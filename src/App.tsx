import { BrowserRouter, Navigate, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import LabPage from '@/pages/LabPage';
import LabDocPage from '@/pages/LabDocPage';
import LabCicdPage from '@/pages/LabCicdPage';
import LabProjectsPage from '@/pages/LabProjectsPage';
import Home from '@/pages/Home';
import CategoryPage from '@/pages/CategoryPage';
import BlogMapPage from '@/pages/BlogMapPage';
import ArticlePage from '@/pages/ArticlePage';
import CorePage from '@/pages/core/CorePage';
import CoreSectionPage from '@/pages/core/CoreSectionPage';
import CoreArticlePage from '@/pages/core/CoreArticlePage';
import CodebaseUnitDetail from '@/pages/core/codebase-unit-detail';
import { BLOG_ROOT, CORE_ROOT, LAB_ROOT, coreItemPath, coreTrackPath } from '@/lib/paths';
import InternalLinkHandler from '@/components/InternalLinkHandler';

function LegacyCoreSectionRedirect() {
  const { section } = useParams<{ section: string }>();
  return <Navigate to={section ? `${CORE_ROOT}/${section}` : CORE_ROOT} replace />;
}

function LegacyBlogCategoryRedirect() {
  const { category } = useParams<{ category: string }>();
  return <Navigate to={category ? `${BLOG_ROOT}/${category}` : BLOG_ROOT} replace />;
}

function LegacyBlogArticleRedirect() {
  const { category, article } = useParams<{ category: string; article: string }>();
  return <Navigate to={category && article ? `${BLOG_ROOT}/${category}/${article}` : BLOG_ROOT} replace />;
}

function LegacyFmBoundaryPracticeRedirect() {
  return <Navigate to={coreItemPath('verification-practice', 'fm-boundary-practice')} replace />;
}

function LegacyGethBlobTxFmRedirect() {
  return <Navigate to={coreItemPath('verification-practice', 'geth-blob-tx-fm')} replace />;
}

function ScrollRestoration() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <InternalLinkHandler />
      <ScrollRestoration />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to={LAB_ROOT} replace />} />
          <Route path={LAB_ROOT} element={<LabPage />} />
          <Route path={`${LAB_ROOT}/cicd`} element={<LabCicdPage />} />
          <Route path={`${LAB_ROOT}/projects`} element={<LabProjectsPage />} />
          <Route path={`${LAB_ROOT}/:doc`} element={<LabDocPage />} />
          <Route path={BLOG_ROOT} element={<Home />} />
          <Route path={CORE_ROOT} element={<CorePage />} />
          <Route path={`${CORE_ROOT}/:section/:item/:unit`} element={<CodebaseUnitDetail />} />
          <Route path={`${CORE_ROOT}/:section/:item`} element={<CoreArticlePage />} />
          <Route path={`${CORE_ROOT}/:section`} element={<CoreSectionPage />} />
          <Route path={`${BLOG_ROOT}/blockchain/fm-boundary-practice`} element={<LegacyFmBoundaryPracticeRedirect />} />
          <Route path={`${BLOG_ROOT}/blockchain/geth-blob-tx-fm`} element={<LegacyGethBlobTxFmRedirect />} />
          <Route path={`${BLOG_ROOT}/software-verification/fm-boundary-practice`} element={<LegacyFmBoundaryPracticeRedirect />} />
          <Route path={`${BLOG_ROOT}/codebase-analysis/geth-blob-tx-fm`} element={<LegacyGethBlobTxFmRedirect />} />
          <Route path={`${BLOG_ROOT}/software-verification`} element={<Navigate to={coreTrackPath('verification-practice')} replace />} />
          <Route path={`${BLOG_ROOT}/codebase-analysis`} element={<Navigate to={coreTrackPath('verification-practice')} replace />} />
          <Route
            path={`${BLOG_ROOT}/ai/research-honglab-ai-landscape-2026`}
            element={<Navigate to={`${BLOG_ROOT}/ai?sub=ai-llm-architectures`} replace />}
          />
          <Route path={`${BLOG_ROOT}/map`} element={<BlogMapPage />} />
          <Route path={`${BLOG_ROOT}/:category`} element={<CategoryPage />} />
          <Route path={`${BLOG_ROOT}/:category/:article`} element={<ArticlePage />} />
          <Route path={`${LAB_ROOT}/blockchain/fm-boundary-practice`} element={<LegacyFmBoundaryPracticeRedirect />} />
          <Route path={`${LAB_ROOT}/blockchain/geth-blob-tx-fm`} element={<LegacyGethBlobTxFmRedirect />} />
          <Route path={`${LAB_ROOT}/:category`} element={<LegacyBlogCategoryRedirect />} />
          <Route path={`${LAB_ROOT}/:category/:article`} element={<LegacyBlogArticleRedirect />} />

          <Route path="/blog" element={<Navigate to={BLOG_ROOT} replace />} />
          <Route path="/blog/core" element={<Navigate to={CORE_ROOT} replace />} />
          <Route path="/blog/core/:section" element={<LegacyCoreSectionRedirect />} />
          <Route path="/blog/blockchain/fm-boundary-practice" element={<LegacyFmBoundaryPracticeRedirect />} />
          <Route path="/blog/blockchain/geth-blob-tx-fm" element={<LegacyGethBlobTxFmRedirect />} />
          <Route path="/blog/:category" element={<LegacyBlogCategoryRedirect />} />
          <Route path="/blog/:category/:article" element={<LegacyBlogArticleRedirect />} />

          <Route path="/core" element={<Navigate to={CORE_ROOT} replace />} />
          <Route path="/core/:section" element={<LegacyCoreSectionRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
