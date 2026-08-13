import {
  EDITORIAL_BOUNDARIES,
  type EditorialBoundaryKey,
} from "@/content/editorial-ownership";

const EVIDENCE_LABEL = {
  standard: "표준·명세",
  "primary-source": "공식 자료",
  "project-measurement": "프로젝트 실측",
  "project-claim": "프로젝트 해석",
} as const;

export default function ContentBoundary({
  article,
}: {
  article: EditorialBoundaryKey;
}) {
  const boundary = EDITORIAL_BOUNDARIES[article];

  return (
    <aside
      className="not-prose my-6 rounded-xl border border-border bg-muted/20 p-4"
      aria-label="콘텐츠 소유권과 근거 경계"
    >
      <h3 className="text-sm font-bold">{boundary.title}</h3>
      <div className="mt-3 grid min-w-0 gap-4 lg:grid-cols-3">
        <section className="min-w-0">
          <p className="text-xs font-semibold text-foreground/80">
            이 글에서만 정의
          </p>
          <ul className="mt-2 space-y-1.5 text-xs leading-5 text-muted-foreground">
            {boundary.owns.map((item) => (
              <li key={item} className="break-words">
                · {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="min-w-0">
          <p className="text-xs font-semibold text-foreground/80">
            기존 글에서 재사용
          </p>
          <ul className="mt-2 space-y-1.5 text-xs leading-5">
            {boundary.reuses.map((item) => (
              <li key={`${item.href}-${item.label}`} className="break-words">
                ·{" "}
                <a
                  className="text-primary underline-offset-4 hover:underline"
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section className="min-w-0">
          <p className="text-xs font-semibold text-foreground/80">
            근거 표시 규칙
          </p>
          <ul className="mt-2 space-y-2 text-xs leading-5 text-muted-foreground">
            {boundary.evidence.map((item) => (
              <li key={`${item.kind}-${item.rule}`} className="break-words">
                <span className="mr-1 rounded bg-background px-1.5 py-0.5 font-semibold text-foreground/75">
                  {EVIDENCE_LABEL[item.kind]}
                </span>
                {item.rule}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
