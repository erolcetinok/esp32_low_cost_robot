import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { SiteLayout } from "./layouts/SiteLayout";
import { DocsHubPage } from "./pages/DocsHubPage";
import { HomePage } from "./pages/HomePage";
import { MarkdownDocPage } from "./pages/MarkdownDocPage";
import { StudioPage } from "./pages/StudioPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="docs" element={<DocsHubPage />} />
          <Route path="docs/:slug" element={<MarkdownDocPage />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
