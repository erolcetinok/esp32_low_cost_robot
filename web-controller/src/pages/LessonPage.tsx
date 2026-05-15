import ReactMarkdown from "react-markdown";
import { Link, Navigate, useParams } from "react-router-dom";

import { LESSONS, LESSONS_BY_SLUG, isLessonSlug } from "../curriculum/lessons";

export function LessonPage() {
  const { slug } = useParams();
  if (!isLessonSlug(slug)) {
    return <Navigate to="/curriculum" replace />;
  }
  const lesson = LESSONS_BY_SLUG[slug];
  const currentIndex = LESSONS.findIndex((l) => l.slug === slug);
  const previous = currentIndex > 0 ? LESSONS[currentIndex - 1] : null;
  const next = currentIndex < LESSONS.length - 1 ? LESSONS[currentIndex + 1] : null;

  return (
    <main className="app lesson-page">
      <Link className="lesson-back" to="/curriculum">
        ← All lessons
      </Link>

      <header className="lesson-hero">
        <span className="lesson-eyebrow">
          Lesson {String(lesson.number).padStart(2, "0")}
        </span>
        <h1 className="lesson-title">{lesson.title}</h1>
        <p className="lesson-tagline">{lesson.tagline}</p>
        <ul className="lesson-meta" aria-label="Lesson details">
          <li>
            <span className="lesson-meta-label">Grades</span>
            <span className="lesson-meta-value">{lesson.grades.replace("Grades ", "")}</span>
          </li>
          <li>
            <span className="lesson-meta-label">Duration</span>
            <span className="lesson-meta-value">{lesson.duration}</span>
          </li>
          <li>
            <span className="lesson-meta-label">Concepts</span>
            <span className="lesson-meta-value">{lesson.concepts.join(" · ")}</span>
          </li>
        </ul>
      </header>

      <section className="lesson-section">
        <h2 className="lesson-section-title">Overview</h2>
        <div className="lesson-prose">
          <ReactMarkdown>{lesson.overview}</ReactMarkdown>
        </div>
      </section>

      <section className="lesson-section">
        <h2 className="lesson-section-title">Objectives</h2>
        <p className="lesson-section-intro">By the end of this lesson, students can:</p>
        <ul className="lesson-list">
          {lesson.objectives.map((obj) => (
            <li key={obj}>{obj}</li>
          ))}
        </ul>
      </section>

      <section className="lesson-section">
        <h2 className="lesson-section-title">Vocabulary</h2>
        <dl className="lesson-vocab">
          {lesson.vocabulary.map((v) => (
            <div key={v.term} className="lesson-vocab-row">
              <dt>{v.term}</dt>
              <dd>{v.def}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="lesson-section">
        <h2 className="lesson-section-title">You'll need</h2>
        <ul className="lesson-list">
          {lesson.materials.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </section>

      <section className="lesson-section">
        <h2 className="lesson-section-title">Lesson flow</h2>
        <ol className="lesson-flow">
          {lesson.flow.map((phase, i) => (
            <li key={phase.label} className="lesson-phase">
              <div className="lesson-phase-head">
                <span className="lesson-phase-step">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="lesson-phase-label">{phase.label}</span>
                <span className="lesson-phase-time">{phase.minutes} min</span>
              </div>
              <h3 className="lesson-phase-title">{phase.title}</h3>
              <div className="lesson-prose">
                <ReactMarkdown>{phase.body}</ReactMarkdown>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="lesson-section">
        <h2 className="lesson-section-title">Teacher tips</h2>
        <ul className="lesson-list">
          {lesson.teacherTips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="lesson-section">
        <h2 className="lesson-section-title">Try this next</h2>
        <ul className="lesson-list">
          {lesson.extensions.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </section>

      <nav className="lesson-pager" aria-label="Lesson navigation">
        {previous ? (
          <Link to={`/curriculum/${previous.slug}`} className="lesson-pager-link">
            <span className="lesson-pager-direction">← Previous</span>
            <span className="lesson-pager-title">{previous.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/curriculum/${next.slug}`} className="lesson-pager-link lesson-pager-next">
            <span className="lesson-pager-direction">Next →</span>
            <span className="lesson-pager-title">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
