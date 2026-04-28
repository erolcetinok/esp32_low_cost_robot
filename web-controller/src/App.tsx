import { useMemo, useState } from "react";

import { BleClient } from "./bluetooth/bleClient";
import { formatCommand, type RobotCommand } from "./bluetooth/protocol";
import { ConnectionPanel } from "./components/ConnectionPanel";
import { DrivePad } from "./components/DrivePad";

export default function App() {
  const client = useMemo(() => new BleClient(), []);
  const [connected, setConnected] = useState(false);
  const [speed, setSpeed] = useState(80);
  const [logs, setLogs] = useState<string[]>([]);

  function log(message: string) {
    setLogs((prev) => [message, ...prev].slice(0, 25));
  }

  async function connect() {
    try {
      await client.connect((status) => log(`Robot: ${status}`));
      setConnected(client.isConnected());
      log("Connected");
    } catch (err) {
      log(`Connect failed: ${(err as Error).message}`);
    }
  }

  async function disconnect() {
    await client.disconnect();
    setConnected(false);
    log("Disconnected");
  }

  async function send(command: RobotCommand, commandSpeed?: number) {
    const payload = formatCommand(command, commandSpeed);
    try {
      await client.send(payload);
      log(`Sent: ${payload}`);
    } catch (err) {
      log(`Send failed: ${(err as Error).message}`);
    }
  }

  return (
    <main>
      <h1>ESP32 Robot Controller</h1>
      <ConnectionPanel connected={connected} onConnect={connect} onDisconnect={disconnect} />

      <section className="panel">
        <h2>Safety</h2>
        <div className="row">
          <button disabled={!connected} onClick={() => send("SAFE_ON")}>
            SAFE ON
          </button>
          <button disabled={!connected} onClick={() => send("SAFE_OFF")}>
            SAFE OFF
          </button>
          <button disabled={!connected} onClick={() => send("PING")}>
            PING
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Speed</h2>
        <input
          type="range"
          min={0}
          max={255}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          disabled={!connected}
        />
        <p>{speed}</p>
      </section>

      <DrivePad speed={speed} disabled={!connected} onCommand={send} />

      <section className="panel">
        <h2>Status Log</h2>
        <pre>{logs.join("\n") || "No events yet"}</pre>
      </section>
    </main>
  );
}
