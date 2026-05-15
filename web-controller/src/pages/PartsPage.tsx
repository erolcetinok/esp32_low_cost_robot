import { BOM, TOOLS, categorySubtotal, formatUSD, totalUSD } from "../parts/billOfMaterials";

export function PartsPage() {
  const total = totalUSD();

  return (
    <main className="app parts-page">
      <header className="doc-page-head">
        <span className="doc-page-eyebrow">Bill of materials</span>
        <h1>What goes into one kit.</h1>
        <p>
          Approximate parts to build one ESP32 Low Cost Robot. Prices are
          single-unit estimates in U.S. dollars from common hobbyist suppliers —
          ordering for a class set is usually cheaper per kit.
        </p>
      </header>

      <section className="parts-summary" aria-label="Cost summary">
        <div className="parts-summary-row">
          <span className="parts-summary-label">Estimated cost per kit</span>
          <span className="parts-summary-total">{formatUSD(total)}</span>
        </div>
        <p className="parts-summary-note">
          A class set of ten kits typically lands closer to {formatUSD(total * 0.75)}–
          {formatUSD(total * 0.85)} per kit when parts are bought in bulk and
          the chassis is cut or printed at school.
        </p>
      </section>

      {BOM.map((cat) => (
        <section key={cat.name} className="parts-category">
          <header className="parts-category-head">
            <h2 className="parts-category-title">{cat.name}</h2>
            <span className="parts-category-blurb">{cat.blurb}</span>
            <span className="parts-category-subtotal">
              {formatUSD(categorySubtotal(cat))}
            </span>
          </header>
          <ol className="parts-list">
            {cat.parts.map((p) => (
              <li key={p.name} className="parts-row">
                <div className="parts-row-main">
                  <h3 className="parts-row-name">{p.name}</h3>
                  <p className="parts-row-desc">{p.description}</p>
                  {p.notes ? <p className="parts-row-notes">{p.notes}</p> : null}
                </div>
                <div className="parts-row-numbers">
                  <span className="parts-row-qty">
                    <span className="parts-num-label">Qty</span>
                    <span className="parts-num-value">{p.quantity}</span>
                  </span>
                  <span className="parts-row-price">
                    <span className="parts-num-label">Unit</span>
                    <span className="parts-num-value">
                      {formatUSD(p.unitPriceUSD)}
                    </span>
                  </span>
                  <span className="parts-row-subtotal">
                    <span className="parts-num-label">Subtotal</span>
                    <span className="parts-num-value">
                      {formatUSD(p.quantity * p.unitPriceUSD)}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className="parts-tools" aria-label="Tools">
        <header className="parts-category-head">
          <h2 className="parts-category-title">Tools (not per kit)</h2>
          <span className="parts-category-blurb">
            One set per classroom, not one set per student.
          </span>
        </header>
        <ul className="parts-tools-list">
          {TOOLS.map((tool) => (
            <li key={tool.name} className="parts-tool-row">
              <span className="parts-tool-name">{tool.name}</span>
              <span className="parts-tool-notes">{tool.notes}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="parts-sourcing" aria-label="Sourcing notes">
        <h2 className="parts-category-title">Where to find parts</h2>
        <p>
          Every part on this list is available from common hobbyist suppliers —
          Adafruit, SparkFun, Pololu, or AliExpress / Amazon for the
          lowest-cost options. The chassis files are open and can be laser-cut
          or 3D-printed on most school equipment, which removes one of the
          biggest costs entirely.
        </p>
        <p>
          The bill of materials is intentionally short. If you find a cheaper
          substitute for any part — for example, a generic motor driver in
          place of the TB6612 — the firmware and wiring can usually be adjusted
          to fit. Get in touch if you're planning a build.
        </p>
      </section>
    </main>
  );
}
