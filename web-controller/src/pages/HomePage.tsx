import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="app">
      <section className="home-hero">
        <h1>Build and program a classroom-friendly ESP32 robot</h1>
        <p>
          This site collects setup guidance, wiring, firmware notes, and the Bluetooth protocol. Open{" "}
          <strong>Studio</strong>
          Blockly programs and connect via Web Bluetooth—or use the simulator when hardware is not available.
        </p>
        <div className="home-actions">
          <Link className="home-primary" to="/studio">
            Open Blockly Studio
          </Link>
          <Link className="home-secondary" to="/docs">
            Read the docs
          </Link>
        </div>
      </section>

      <div className="home-grid">
        <section className="home-card">
          <h2>Safety (short version)</h2>
          <ul>
            <li>Robot stays in protected mode until you arm driving for motion.</li>
            <li>Firmware watchdog stops motors if commands stop flowing.</li>
            <li>Try Simulator mode first when you are warming up.</li>
            <li>In Studio, Space triggers stop + safe mode.</li>
          </ul>
        </section>
        <section className="home-card">
          <h2>Quick start</h2>
          <ul>
            <li>Flash firmware from <code>firmware/</code>.</li>
            <li>
              Run the web app: <code>cd web-controller && npm install && npm run dev</code>
            </li>
            <li>
              Chrome or Edge · open Studio · Connect · build blocks · Run Blocks
            </li>
          </ul>
          <p style={{ margin: "10px 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Full walkthrough in <Link to="/docs/setup">Setup Guide</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
