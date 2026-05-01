import { Link } from "react-router-dom";

import { DOCS_BY_SLUG, DOC_HUB_SECTIONS } from "../docs/docSources";

export function DocsHubPage() {
  return (
    <main className="app doc-page">
      <div className="doc-card doc-prose">
        <h1 style={{ marginTop: 0 }}>Documentation</h1>
        <p>Guides rendered from the project <code style={{ whiteSpace: "nowrap" }}>docs/</code> folder.</p>
        <hr />

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

        <p style={{ marginTop: "1.25rem" }}>
          <Link to="/studio">Blockly Studio →</Link>
        </p>
      </div>
    </main>
  );
}
