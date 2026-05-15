import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { SiteLayout } from "./layouts/SiteLayout";
import { CurriculumHubPage } from "./pages/CurriculumHubPage";
import { DocsHubPage } from "./pages/DocsHubPage";
import { HomePage } from "./pages/HomePage";
import { LessonPage } from "./pages/LessonPage";
import { MarkdownDocPage } from "./pages/MarkdownDocPage";
import { PartsPage } from "./pages/PartsPage";
import { StudioPage } from "./pages/StudioPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="curriculum" element={<CurriculumHubPage />} />
          <Route path="curriculum/:slug" element={<LessonPage />} />
          <Route path="parts" element={<PartsPage />} />
          <Route path="docs" element={<DocsHubPage />} />
          <Route path="docs/:slug" element={<MarkdownDocPage />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
