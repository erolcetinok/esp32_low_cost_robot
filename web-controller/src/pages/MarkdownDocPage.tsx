import ReactMarkdown from "react-markdown";
import { Link, Navigate, useParams } from "react-router-dom";

import { DOCS_BY_SLUG, isDocSlug } from "../docs/docSources";

export function MarkdownDocPage() {
  const { slug } = useParams();
  if (!isDocSlug(slug)) {
    return <Navigate to="/docs" replace />;
  }
  const doc = DOCS_BY_SLUG[slug];
  return (
    <main className="app doc-page">
      <Link className="page-back" to="/docs">
        ← All docs
      </Link>
      <article className="doc-card doc-prose">
        <ReactMarkdown>{doc.markdown}</ReactMarkdown>
      </article>
    </main>
  );
}
