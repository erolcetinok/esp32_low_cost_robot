import { useEffect, useRef } from "react";
import * as Blockly from "blockly";

export type Step = {
  type: "command" | "wait" | "set_speed";
  command?: string;
  speed?: number;
  waitMs?: number;
  value?: number;
};

type Props = {
  onReady?: (collectSteps: () => Step[]) => void;
};

let blocksDefined = false;

function defineBlocks() {
  if (blocksDefined) return;
  blocksDefined = true;
  Blockly.common.defineBlocksWithJsonArray([
    {
      type: "robot_command",
      message0: "move %1 speed %2",
      args0: [
        {
          type: "field_dropdown",
          name: "CMD",
          options: [
            ["move forward", "F"],
            ["move backward", "B"],
            ["turn left", "L"],
            ["turn right", "R"],
          ],
        },
        {
          type: "field_number",
          name: "SPEED",
          value: 80,
          min: 0,
          max: 255,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 210,
    },
    {
      type: "robot_action",
      message0: "robot action %1",
      args0: [
        {
          type: "field_dropdown",
          name: "ACTION",
          options: [
            ["stop", "S"],
            ["enable driving", "SAFE_OFF"],
            ["disable driving", "SAFE_ON"],
            ["check connection", "PING"],
          ],
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
    },
    {
      type: "robot_set_speed",
      message0: "set default speed %1",
      args0: [
        {
          type: "field_number",
          name: "SPEED",
          value: 80,
          min: 0,
          max: 255,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 260,
    },
    {
      type: "robot_wait",
      message0: "wait %1 ms",
      args0: [
        {
          type: "field_number",
          name: "WAIT_MS",
          value: 500,
          min: 0,
          max: 10000,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 40,
    },
    {
      type: "robot_wait_seconds",
      message0: "wait %1 seconds",
      args0: [
        {
          type: "field_number",
          name: "WAIT_S",
          value: 1,
          min: 0,
          max: 30,
          precision: 0.1,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 40,
    },
    {
      type: "robot_repeat",
      message0: "repeat %1 times",
      args0: [
        {
          type: "field_number",
          name: "COUNT",
          value: 2,
          min: 1,
          max: 20,
        },
      ],
      message1: "do %1",
      args1: [
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 120,
    },
  ]);
}

export function BlocklyProgrammer({ onReady }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    defineBlocks();
    if (!hostRef.current) return;
    if (workspaceRef.current) {
      workspaceRef.current.dispose();
      workspaceRef.current = null;
    }
    workspaceRef.current = Blockly.inject(hostRef.current, {
      toolbox: {
        kind: "categoryToolbox",
        contents: [
          {
            kind: "category",
            name: "Open Blocks",
            categorystyle: "logic_category",
            contents: [
              { kind: "block", type: "robot_command" },
              { kind: "block", type: "robot_action" },
              { kind: "block", type: "robot_set_speed" },
              { kind: "block", type: "robot_wait" },
              { kind: "block", type: "robot_wait_seconds" },
              { kind: "block", type: "robot_repeat" },
            ],
          },
        ],
      },
      grid: { spacing: 20, length: 3, colour: "#e3e3e3", snap: true },
      trashcan: true,
    });
    const xmlText = `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="robot_command" x="24" y="24">
          <field name="CMD">SAFE_OFF</field>
          <field name="SPEED">80</field>
          <next>
            <block type="robot_command">
              <field name="CMD">F</field>
              <field name="SPEED">80</field>
              <next>
                <block type="robot_wait">
                  <field name="WAIT_MS">800</field>
                  <next>
                    <block type="robot_command">
                      <field name="CMD">L</field>
                      <field name="SPEED">80</field>
                      <next>
                        <block type="robot_wait_seconds">
                          <field name="WAIT_S">0.5</field>
                          <next>
                            <block type="robot_action">
                              <field name="ACTION">S</field>
                            </block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </xml>
    `;
    Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(xmlText), workspaceRef.current);
    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, []);

  function collectStepsFromBlock(start: Blockly.Block | null): Step[] {
    const steps: Step[] = [];
    let cursor = start;
    while (cursor) {
      if (cursor.type === "robot_command") {
        const cmd = cursor.getFieldValue("CMD");
        const speed = Number(cursor.getFieldValue("SPEED")) || 0;
        steps.push({ type: "command", command: cmd, speed });
      } else if (cursor.type === "robot_action") {
        const action = cursor.getFieldValue("ACTION");
        steps.push({ type: "command", command: action });
      } else if (cursor.type === "robot_set_speed") {
        steps.push({ type: "set_speed", value: Number(cursor.getFieldValue("SPEED")) || 0 });
      } else if (cursor.type === "robot_wait") {
        steps.push({ type: "wait", waitMs: Number(cursor.getFieldValue("WAIT_MS")) || 0 });
      } else if (cursor.type === "robot_wait_seconds") {
        const seconds = Number(cursor.getFieldValue("WAIT_S")) || 0;
        steps.push({ type: "wait", waitMs: Math.round(seconds * 1000) });
      } else if (cursor.type === "robot_repeat") {
        const count = Math.max(1, Number(cursor.getFieldValue("COUNT")) || 1);
        const doStart = cursor.getInputTargetBlock("DO");
        const inner = collectStepsFromBlock(doStart);
        for (let i = 0; i < count; i += 1) {
          steps.push(...inner);
        }
      }
      cursor = cursor.getNextBlock();
    }
    return steps;
  }

  function collectSteps(): Step[] {
    const ws = workspaceRef.current;
    if (!ws) return [];
    const tops = ws.getTopBlocks(true);
    if (!tops.length) return [];
    return collectStepsFromBlock(tops[0]);
  }

  useEffect(() => {
    onReady?.(collectSteps);
  }, [onReady]);

  return <div ref={hostRef} className="blockly-host" />;
}
