import { Link } from "react-router-dom";

import { LESSONS } from "../curriculum/lessons";

export function CurriculumHubPage() {
  return (
    <main className="app curriculum-page">
      <header className="doc-page-head">
        <span className="doc-page-eyebrow">Curriculum</span>
        <h1>Lessons for the classroom.</h1>
        <p>
          A small set of lessons that build on each other — starting with the
          simulator, working up to programs on real hardware. Each lesson uses
          the 5E flow (engage, explore, build, reflect) and is sized for a
          single class period.
        </p>
      </header>

      <ol className="curriculum-list">
        {LESSONS.map((lesson) => (
          <li key={lesson.slug} className="lesson-card">
            <Link to={`/curriculum/${lesson.slug}`} className="lesson-card-link">
              <span className="lesson-card-num">
                {String(lesson.number).padStart(2, "0")}
              </span>
              <div className="lesson-card-body">
                <h2 className="lesson-card-title">{lesson.title}</h2>
                <p className="lesson-card-tagline">{lesson.tagline}</p>
                <div className="lesson-card-meta">
                  <span>{lesson.grades}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lesson.duration}</span>
                </div>
                <ul className="lesson-card-concepts" aria-label="Concepts">
                  {lesson.concepts.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              <span className="lesson-card-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <p className="curriculum-footnote">
        More lessons coming. The curriculum is open and gets built up alongside
        the kit.
      </p>
    </main>
  );
}
