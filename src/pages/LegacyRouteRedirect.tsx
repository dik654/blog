import { Navigate, useLocation, useParams } from "react-router-dom";
import { CATEGORY_DOMAIN } from "@/content/domains";
import { articleHref, categoryHref } from "@/lib/routes";

/**
 * 대분류를 도입하기 전 주소(`/ai/flash-attention`)로 들어온 방문자를 새 주소로
 * 보냅니다. 북마크·외부 링크가 끊기지 않게 하는 것이 목적이므로 히스토리에
 * 흔적을 남기지 않고(`replace`) anchor와 query도 그대로 옮깁니다.
 */
export default function LegacyRouteRedirect() {
  const { category, article } = useParams<{
    category: string;
    article?: string;
  }>();
  const { hash, search } = useLocation();

  if (!category || !CATEGORY_DOMAIN[category]) {
    return (
      <div className="max-w-2xl py-12">
        <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
        <p className="mt-3 text-muted-foreground">
          주소가 바뀌었거나 삭제된 글입니다. 위 네비게이션에서 대분류를 골라
          다시 찾아보세요.
        </p>
      </div>
    );
  }

  const target = article
    ? articleHref(category, article)
    : categoryHref(category);

  return <Navigate to={`${target}${search}${hash}`} replace />;
}
