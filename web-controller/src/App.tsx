import { useEffect, useMemo, useRef, useState } from "react";

import { BleClient } from "./bluetooth/bleClient";
import { MockClient } from "./bluetooth/mockClient";
import { formatCommand, type RobotCommand } from "./bluetooth/protocol";
import { BlocklyProgrammer, type Step } from "./components/BlocklyProgrammer";
import { SimulatorStage } from "./components/SimulatorStage";

type Heading = "N" | "E" | "S" | "W";
type Point = { x: number; y: number };

export default function App() {
  const bleClient = useMemo(() => new BleClient(), []);
  const mockClient = useMemo(() => new MockClient(), []);
  const [mode, setMode] = useState<"simulator" | "real">("simulator");
  const [connected, setConnected] = useState(false);
  const [speed, setSpeed] = useState(80);
  const [logs, setLogs] = useState<string[]>([]);
  const [lastCommand, setLastCommand] = useState("None");
  const [isProgramRunning, setIsProgramRunning] = useState(false);
  const [isDrivingEnabled, setIsDrivingEnabled] = useState(false);
  const [simHeading, setSimHeading] = useState<Heading>("N");
  const [simPosition, setSimPosition] = useState<Point>({ x: 5, y: 5 });
  const [simPath, setSimPath] = useState<Point[]>([{ x: 5, y: 5 }]);
  const runTokenRef = useRef(0);
  const collectStepsRef = useRef<(() => Step[]) | null>(null);

  const client = mode === "real" ? bleClient : mockClient;

  function log(message: string) {
    setLogs((prev) => [message, ...prev].slice(0, 25));
  }

  async function connect() {
    try {
      await client.connect((status) => log(`Robot: ${status}`));
      setConnected(client.isConnected());
      log(`Connected (${mode})`);
    } catch (err) {
      log(`Connect failed: ${(err as Error).message}`);
    }
  }

  async function disconnect() {
    await client.disconnect();
    setConnected(false);
    setIsDrivingEnabled(false);
    log("Disconnected");
  }

  async function send(command: RobotCommand, commandSpeed?: number) {
    const payload = formatCommand(command, commandSpeed);
    try {
      await client.send(payload);
      setLastCommand(payload);
      if (command === "SAFE_OFF") setIsDrivingEnabled(true);
      if (command === "SAFE_ON" || command === "S") setIsDrivingEnabled(false);
      if (mode === "simulator") {
        applySimulatorCommand(command);
      }
      log(`Sent: ${payload}`);
    } catch (err) {
      log(`Send failed: ${(err as Error).message}`);
    }
  }

  function rotateLeft(heading: Heading): Heading {
    if (heading === "N") return "W";
    if (heading === "W") return "S";
    if (heading === "S") return "E";
    return "N";
  }

  function rotateRight(heading: Heading): Heading {
    if (heading === "N") return "E";
    if (heading === "E") return "S";
    if (heading === "S") return "W";
    return "N";
  }

  function moveByHeading(position: Point, heading: Heading, delta: 1 | -1): Point {
    const next = { ...position };
    if (heading === "N") next.y -= delta;
    if (heading === "S") next.y += delta;
    if (heading === "E") next.x += delta;
    if (heading === "W") next.x -= delta;
    next.x = Math.max(0, Math.min(9, next.x));
    next.y = Math.max(0, Math.min(9, next.y));
    return next;
  }

  function applySimulatorCommand(command: RobotCommand) {
    if (command === "L") {
      setSimHeading((h) => rotateLeft(h));
      return;
    }
    if (command === "R") {
      setSimHeading((h) => rotateRight(h));
      return;
    }
    if (command === "F" || command === "B") {
      setSimPosition((current) => {
        const delta: 1 | -1 = command === "F" ? 1 : -1;
        const next = moveByHeading(current, simHeading, delta);
        setSimPath((prev) => [...prev, next].slice(-150));
        return next;
      });
      return;
    }
    if (command === "SAFE_ON") {
      setSimHeading("N");
      setSimPosition({ x: 5, y: 5 });
      setSimPath([{ x: 5, y: 5 }]);
    }
  }

  async function runBlockProgram(steps: Step[]) {
    if (!connected) {
      log("Connect first.");
      return;
    }
    if (!steps.length) {
      log("No blocks to run.");
      return;
    }
    if (!isDrivingEnabled) {
      await send("SAFE_OFF");
      log("Driving auto-enabled for program run.");
    }
    const runToken = ++runTokenRef.current;
    setIsProgramRunning(true);
    log(`Program started (${steps.length} steps)`);
    for (const step of steps) {
      if (runToken !== runTokenRef.current) {
        log("Program cancelled.");
        setIsProgramRunning(false);
        return;
      }
      if (step.type === "wait") {
        await new Promise((resolve) => window.setTimeout(resolve, step.waitMs ?? 0));
        log(`Waited ${step.waitMs ?? 0}ms`);
        continue;
      }
      if (step.type === "set_speed") {
        const nextSpeed = Math.max(0, Math.min(255, step.value ?? speed));
        setSpeed(nextSpeed);
        log(`Default speed set to ${nextSpeed}`);
        continue;
      }
      const command = (step.command ?? "S") as RobotCommand;
      const commandSpeed = step.speed ?? speed;
      await send(command, commandSpeed);
    }
    setIsProgramRunning(false);
    log("Program finished.");
  }

  async function emergencyStop() {
    runTokenRef.current += 1;
    setIsProgramRunning(false);
    await send("S");
    await send("SAFE_ON");
    log("Emergency stop triggered.");
  }

  function clearLog() {
    setLogs([]);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code === "Space") {
        event.preventDefault();
        void emergencyStop();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [connected]);

  const modeLabel = mode === "simulator" ? "Simulator" : "Real Robot";

  const connectionLabel = connected ? "Connected" : "Disconnected";

  const drivingLabel = isDrivingEnabled ? "Enabled" : "Disabled";

  const programLabel = isProgramRunning ? "Running" : "Idle";

  const logText = logs.join("\n") || "No events yet";

  const canDrive = connected && !isProgramRunning;

  const canRunProgram = connected && !isProgramRunning;

  const canToggleMode = !isProgramRunning;

  const canConnect = !connected && !isProgramRunning;

  const canDisconnect = connected && !isProgramRunning;

  const canSafety = connected;

  const canPing = connected && !isProgramRunning;

  const canClearLogs = logs.length > 0;

  const toolbarModeClass = mode === "simulator" ? "toolbar-button is-active" : "toolbar-button";
  const toolbarRealClass = mode === "real" ? "toolbar-button is-active" : "toolbar-button";

  function modeSwitch(nextMode: "simulator" | "real") {
    if (nextMode === mode) return;
    setMode(nextMode);
    setConnected(false);
    setIsDrivingEnabled(false);
    runTokenRef.current += 1;
    setIsProgramRunning(false);
  }

  function stopRun() {
    void emergencyStop();
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>Robot Blockly Studio</h1>
          <p className="subtitle">Simple classroom programming console</p>
        </div>
      </header>

      <div className="toolbar grouped">
        <div className="toolbar-group">
          <span className="group-tag">Mode</span>
          <button className={toolbarModeClass} onClick={() => modeSwitch("simulator")} disabled={!canToggleMode}>
            Simulator
          </button>
          <button className={toolbarRealClass} onClick={() => modeSwitch("real")} disabled={!canToggleMode}>
            Real Robot
          </button>
        </div>

        <div className="toolbar-group">
          <span className="group-tag">Link</span>
          <button className="toolbar-button" onClick={connect} disabled={!canConnect}>
            Connect
          </button>
          <button className="toolbar-button" onClick={disconnect} disabled={!canDisconnect}>
            Disconnect
          </button>
        </div>

        <div className="toolbar-group">
          <span className="group-tag">Speed</span>
          <label className="speed-inline">
            Speed
            <input
              type="range"
              min={0}
              max={255}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={!canDrive}
            />
            <span>{speed}</span>
          </label>
        </div>

        <div className="toolbar-group">
          <span className="group-tag">Program</span>
          <button className="toolbar-button" onClick={() => send("PING")} disabled={!canPing}>
            Check Connection
          </button>
          <button className="toolbar-button" onClick={clearLog} disabled={!canClearLogs}>
            Clear Log
          </button>
        </div>
      </div>

      <div className="workspace-layout">
        <section className="workspace-card">
          <div className="workspace-header">
            <h2>Blockly Workspace</h2>
            <div className="run-controls">
              <button
                className="toolbar-button run primary"
                disabled={!canRunProgram}
                onClick={() => runBlockProgram(collectStepsRef.current ? collectStepsRef.current() : [])}
              >
                Run Blocks
              </button>
              <button className="toolbar-button run danger" disabled={!isProgramRunning} onClick={stopRun}>
                Stop Run
              </button>
            </div>
          </div>
          <BlocklyProgrammer onReady={(collect) => (collectStepsRef.current = collect)} />
        </section>

        <aside className="side-stack">
          {mode === "simulator" && (
            <SimulatorStage
              enabled={isDrivingEnabled}
              heading={simHeading}
              position={simPosition}
              path={simPath}
            />
          )}
          <section className="log-card terminal-card">
            <h2>Robot Messages</h2>
            <pre>{logText}</pre>
          </section>
        </aside>
      </div>
    </main>
  );
}
