import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import ArticlePage from "@/pages/ArticlePage";
import LegacyRouteRedirect from "@/pages/LegacyRouteRedirect";
import { DOMAIN_META } from "@/content/domains";

/**
 * 대분류 세그먼트는 `:domain` 같은 동적 조각이 아니라 실제 slug로 선언합니다.
 * 동적 조각으로 두면 `/cs/ai`와 예전 주소 `/ai/flash-attention`이 둘 다 두
 * 조각이라 라우터가 구분하지 못합니다.
 */
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {DOMAIN_META.map((domain) => (
            <Fragment key={domain.slug}>
              <Route
                path={`/${domain.slug}/:category`}
                element={<CategoryPage domain={domain.slug} />}
              />
              <Route
                path={`/${domain.slug}/:category/:article`}
                element={<ArticlePage domain={domain.slug} />}
              />
            </Fragment>
          ))}
          {/* 대분류 도입 이전에 공개된 두 조각 주소를 살려 둡니다. */}
          <Route path="/:category" element={<LegacyRouteRedirect />} />
          <Route path="/:category/:article" element={<LegacyRouteRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
