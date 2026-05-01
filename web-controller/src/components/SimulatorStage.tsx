type Point = { x: number; y: number };

type Props = {
  enabled: boolean;
  heading: "N" | "E" | "S" | "W";
  position: Point;
  path: Point[];
};

const GRID_SIZE = 10;

export function SimulatorStage({ enabled, heading, position, path }: Props) {
  return (
    <section className="log-card">
      <h2>Simulator Stage</h2>
      <p className="sim-caption">
        {enabled ? "Robot is armed in simulator mode." : "Robot is in safe mode."} Heading: {heading}
      </p>
      <div className="sim-grid" role="img" aria-label="Robot simulator grid">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);
          const isRobot = x === position.x && y === position.y;
          const isPath = path.some((p) => p.x === x && p.y === y);
          const className = isRobot ? "sim-cell robot" : isPath ? "sim-cell path" : "sim-cell";
          return <div key={idx} className={className} />;
        })}
      </div>
      <p className="sim-caption">
        Position: ({position.x}, {position.y})
      </p>
    </section>
  );
}
