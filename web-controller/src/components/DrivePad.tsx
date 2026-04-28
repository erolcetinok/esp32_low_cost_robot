import type { RobotCommand } from "../bluetooth/protocol";

type Props = {
  speed: number;
  disabled: boolean;
  onCommand: (command: RobotCommand, speed?: number) => void;
};

export function DrivePad({ speed, disabled, onCommand }: Props) {
  return (
    <section className="panel">
      <h2>Drive</h2>
      <div className="pad">
        <button disabled={disabled} onClick={() => onCommand("F", speed)}>
          Forward
        </button>
        <div className="row">
          <button disabled={disabled} onClick={() => onCommand("L", speed)}>
            Left
          </button>
          <button className="stop" disabled={disabled} onClick={() => onCommand("S")}>
            STOP
          </button>
          <button disabled={disabled} onClick={() => onCommand("R", speed)}>
            Right
          </button>
        </div>
        <button disabled={disabled} onClick={() => onCommand("B", speed)}>
          Backward
        </button>
      </div>
    </section>
  );
}
