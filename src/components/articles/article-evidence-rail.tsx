import type { ArticleEvidenceItem } from "@/content/article-evidence";
import { Link } from "react-router-dom";
import {
  getPaperReadingInternalHref,
  type PaperReading,
} from "@/content/article-learning";

const KIND_STYLE: Record<ArticleEvidenceItem["kind"], string> = {
  "핵심 논문": "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  "리뷰 논문": "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  "핵심 연구": "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  "Benchmark 논문": "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  "평가 논문": "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  "공식 문서": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "공식 구현": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  "공식 가이드": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "공식 OpenAI 문서": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "공식 규격": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "공식 코드": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  "공식 연구": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "공식 예제": "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  "공식 프로젝트 기록": "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  "구현 이슈": "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  "프로젝트 실측": "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "보충 읽기": "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  "후속 분석": "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  "후속 논문": "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  "비판적 읽기": "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  "공개 강의": "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
};

export default function ArticleEvidenceRail({
  items,
  paperReadings,
}: {
  items: readonly ArticleEvidenceItem[];
  paperReadings?: readonly PaperReading[];
}) {
  const readingByHref = new Map(
    paperReadings?.map((reading) => [reading.href, reading]) ?? [],
  );
  return (
    <aside
      className="not-prose mb-8 min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card"
      aria-label="이 글의 핵심 근거"
    >
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border/60 bg-muted/20 px-4 py-3 sm:px-5">
        <div>
          <p className="text-sm font-bold text-foreground">근거 지도</p>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            본문에서 해석하기 전에 원문·코드·실측의 위치를 먼저 확인합니다.
          </p>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {items.length}개 원천
        </span>
      </div>

      <div className="grid min-w-0 gap-2 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-4">
        {items.map((item, index) => {
          const reading = item.href ? readingByHref.get(item.href) : undefined;
          const content = (
            <>
              <span
                className={`inline-flex w-fit rounded-md px-2 py-1 text-xs font-black tracking-wide ${KIND_STYLE[item.kind]}`}
              >
                {item.kind}
              </span>
              <strong className="mt-2 block break-words text-xs leading-5 text-foreground">
                {item.label}
              </strong>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                {item.note}
              </span>
              {item.href && (
                <span className="mt-2 block text-xs font-bold text-primary">
                  원문 열기 ↗
                </span>
              )}
            </>
          );

          return item.href ? (
            <div
              key={`${item.kind}-${item.label}-${item.href}-${index}`}
              data-evidence-item
              className="min-w-0 rounded-xl border border-border/70 bg-background/70 p-3"
            >
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="block transition-colors hover:text-primary"
              >
                {content}
              </a>
              {reading && (
                <Link
                  data-paper-explainer
                  to={getPaperReadingInternalHref(reading)}
                  className="mt-3 block border-t border-border/70 pt-2 text-xs font-bold text-foreground/80 hover:text-primary"
                >
                  이 글의 핵심 아이디어·가정·범위 해설 ↓
                </Link>
              )}
            </div>
          ) : (
            <div
              key={`${item.kind}-${item.label}-no-href-${index}`}
              data-evidence-item
              className="min-w-0 rounded-xl border border-border/70 bg-background/70 p-3"
            >
              {content}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
