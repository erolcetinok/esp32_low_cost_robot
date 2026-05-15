import { Link } from "react-router-dom";

import { DOCS_BY_SLUG, DOC_HUB_SECTIONS } from "../docs/docSources";

export function DocsHubPage() {
  return (
    <main className="app doc-page">
      <header className="doc-page-head">
        <span className="doc-page-eyebrow">Documentation</span>
        <h1>Setup, wiring, and protocol notes.</h1>
        <p>
          Every guide here is rendered directly from the <code>docs/</code> folder
          in the repository. Start with the setup guide if you're new.
        </p>
      </header>

      {DOC_HUB_SECTIONS.map((section) => (
        <div key={section.label} className="doc-hub-section">
          <h2>{section.label}</h2>
          <ul className="doc-hub-links">
            {section.slugs.map((slug) => (
              <li key={slug}>
                <Link to={`/docs/${slug}`}>{DOCS_BY_SLUG[slug].title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="doc-hub-section">
        <h2>Related</h2>
        <ul className="doc-hub-links">
          <li>
            <Link to="/curriculum">Classroom curriculum</Link>
          </li>
          <li>
            <Link to="/parts">Bill of materials</Link>
          </li>
        </ul>
      </div>

      <p className="doc-hub-footer">
        <Link to="/studio">Open Blockly Studio →</Link>
      </p>
    </main>
  );
}
