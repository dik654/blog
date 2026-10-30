import { Link } from "react-router-dom";
import { defiArticles } from "@/content/blockchain/articlesDeFi";

const PARENT_HREF = "/cs/blockchain?sub=defi-dex";
const dexArticles = defiArticles.filter((article) => article.subcategory === "defi-dex");

export default function DefiDexLocator({
  currentSlug,
  question,
  region,
}: {
  currentSlug: string;
  question: string;
  region: string;
}) {
  const currentIndex = dexArticles.findIndex((article) => article.slug === currentSlug);

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="DEX 학습 지도에서 현재 글의 위치"
      data-learning-track="concept"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/blockchain" className="hover:text-primary">블록체인</Link>
        <span aria-hidden>›</span>
        <Link to={PARENT_HREF} className="hover:text-primary">탈중앙화 거래소</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          {dexArticles[currentIndex]?.title ?? currentSlug}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
            <span className="text-[11px] text-muted-foreground">현재 영역 · {region}</span>
          </div>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">{question}</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link to={PARENT_HREF} className="mt-1 block text-sm font-bold leading-6 hover:text-primary">
            탈중앙화 거래소 ↗
          </Link>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <ol
          className="grid gap-px bg-border p-px"
          style={{ width: `max(100%, ${dexArticles.length * 180}px)`, gridTemplateColumns: `repeat(${dexArticles.length}, minmax(0, 1fr))` }}
          aria-label="DEX 글 순서"
        >
          {dexArticles.map((article, index) => {
            const active = article.slug === currentSlug;
            return (
              <li key={article.slug} className="min-w-0 bg-background">
                <Link
                  to={`/cs/blockchain/${article.slug}`}
                  aria-current={active ? "step" : undefined}
                  className={`block min-h-20 px-3 py-3 ${active ? "ring-2 ring-inset ring-primary" : "text-muted-foreground hover:text-primary"}`}
                >
                  <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[10px] leading-5">{article.title}</strong>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}

export function DefiDexMapReturn({
  currentSlug,
  closure,
}: {
  currentSlug: string;
  closure: string;
}) {
  const currentIndex = dexArticles.findIndex((article) => article.slug === currentSlug);
  const previous = dexArticles[currentIndex - 1];
  const next = dexArticles[currentIndex + 1];

  return (
    <section id="return-map" className="scroll-mt-20 border-y border-border py-6">
      <h2 className="text-xs font-bold text-primary">부모 지도에 돌려줄 사실</h2>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{closure}</p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs">
        <Link to={PARENT_HREF} className="inline-flex min-h-11 items-center border-b border-border font-bold hover:border-primary hover:text-primary">
          직속 부모: 탈중앙화 거래소 ↗
        </Link>
        {previous ? <Link to={`/cs/blockchain/${previous.slug}`} className="inline-flex min-h-11 items-center text-muted-foreground hover:text-primary">← {previous.title}</Link> : null}
        {next ? <Link to={`/cs/blockchain/${next.slug}`} className="inline-flex min-h-11 items-center text-muted-foreground hover:text-primary">{next.title} →</Link> : null}
      </div>
    </section>
  );
}
