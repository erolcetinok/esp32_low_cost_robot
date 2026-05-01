import type { RobotCommand } from "../bluetooth/protocol";

type Props = {
  speed: number;
  disabled: boolean;
  onCommand: (command: RobotCommand, speed?: number) => void;
};

export function DrivePad({ speed, disabled, onCommand }: Props) {
  return (
    <section className="scratch-panel">
      <h2>Movement</h2>
      <p className="panel-subtitle">Use block controls to drive the robot.</p>
      <div className="block-stack">
        <button className="block-button block-move" disabled={disabled} onClick={() => onCommand("F", speed)}>
          Move Forward
        </button>
        <div className="block-row">
          <button className="block-button block-turn" disabled={disabled} onClick={() => onCommand("L", speed)}>
            Turn Left
          </button>
          <button className="block-button block-stop" disabled={disabled} onClick={() => onCommand("S")}>
            Emergency Stop
          </button>
          <button className="block-button block-turn" disabled={disabled} onClick={() => onCommand("R", speed)}>
            Turn Right
          </button>
        </div>
        <button className="block-button block-move" disabled={disabled} onClick={() => onCommand("B", speed)}>
          Move Backward
        </button>
      </div>
    </section>
  );
}
