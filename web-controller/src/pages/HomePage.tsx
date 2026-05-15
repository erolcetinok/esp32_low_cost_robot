import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="app home">
      <section className="hero">
        <h1 className="hero-headline">
          A low-cost, accessible robotics kit for{" "}
          <em>every classroom</em>.
        </h1>
        <p className="hero-lede">
          The robot runs on an ESP32 and a handful of inexpensive parts.
          Students program it with drag-and-drop blocks in a web browser. It's
          designed for teachers of any technical background, and built to stay
          affordable for schools with limited STEM resources.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/studio">
            Open Blockly Studio →
          </Link>
          <Link className="btn btn-ghost" to="/docs">
            Read the docs
          </Link>
        </div>
      </section>

      <section className="pillars" aria-label="What the kit stands for">
        <div className="pillar">
          <span className="pillar-label">01 · Affordable</span>
          <h3>Built from common parts</h3>
          <p>
            An ESP32, two hobby motors, a battery, and a small motor driver.
            The bill of materials is short on purpose, so a school without a
            STEM budget can still put together a class set.
          </p>
          <Link to="/parts" className="pillar-link">
            See the parts list →
          </Link>
        </div>
        <div className="pillar">
          <span className="pillar-label">02 · Approachable</span>
          <h3>Blocks, not code</h3>
          <p>
            Students drag blocks together in the browser to move, turn, set the
            speed, or repeat a sequence. Teachers don't need a coding
            background to teach it, and students can see something move on
            their first try.
          </p>
          <Link to="/curriculum" className="pillar-link">
            Browse the lessons →
          </Link>
        </div>
        <div className="pillar">
          <span className="pillar-label">03 · Classroom-ready</span>
          <h3>Safe by default</h3>
          <p>
            The robot boots disarmed. If the connection drops, a watchdog stops
            the motors. A built-in simulator lets students keep programming
            even when a robot isn't in front of them.
          </p>
        </div>
      </section>

      <section className="quickstart" aria-label="Quickstart">
        <div className="quickstart-intro">
          <span className="eyebrow">Setup</span>
          <h2>Five steps to get the robot running.</h2>
          <p>
            Full walkthrough in the <Link to="/docs/setup">Setup Guide</Link>.
          </p>
        </div>
        <ol className="quickstart-steps">
          <li>
            <span className="quickstart-num">01</span>
            <span className="quickstart-text">
              Flash firmware to the ESP32 from <code>firmware/</code>.
            </span>
          </li>
          <li>
            <span className="quickstart-num">02</span>
            <span className="quickstart-text">
              Run <code>cd web-controller</code>, then <code>npm install</code>,
              then <code>npm run dev</code>.
            </span>
          </li>
          <li>
            <span className="quickstart-num">03</span>
            <span className="quickstart-text">
              Open the local URL in <strong>Chrome</strong> or{" "}
              <strong>Edge</strong>.
            </span>
          </li>
          <li>
            <span className="quickstart-num">04</span>
            <span className="quickstart-text">
              Open <strong>Studio</strong>, click <em>Connect</em>, then{" "}
              <em>Enable driving</em>.
            </span>
          </li>
          <li>
            <span className="quickstart-num">05</span>
            <span className="quickstart-text">
              Stack a Blockly program and hit <em>Run Blocks</em>.
            </span>
          </li>
        </ol>
      </section>

      <footer className="home-footer">
        <span>Senior project · Open source · MIT</span>
        <span>For schools with limited STEM resources</span>
      </footer>
    </main>
  );
}
