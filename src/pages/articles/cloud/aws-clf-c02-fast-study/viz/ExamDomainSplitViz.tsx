import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names 첫 문단 — 공식 비중 24·30·34·12%, 기술+보안 64%.
 * 3절의 채점 문항 50개에 비중을 그대로 곱한 환산(가정): 12 + 15 + 17 + 6 = 50.
 */
const DOMAINS = [
  { key: "concept", short: "개", name: "클라우드 개념", weight: 24, color: "#64748b" },
  { key: "security", short: "보", name: "보안과 규정 준수", weight: 30, color: "#2563eb" },
  { key: "tech", short: "기", name: "클라우드 기술과 서비스", weight: 34, color: "#0e7490" },
  { key: "billing", short: "청", name: "청구·요금·지원", weight: 12, color: "#a16207" },
] as const;

const SCORED = 50;
const COUNTS = DOMAINS.map((domain) => (SCORED * domain.weight) / 100);
const CELLS = DOMAINS.flatMap((domain, index) => Array.from({ length: COUNTS[index] }, () => index));
const FOCUS = new Set([1, 2]);
const FOCUS_COUNT = COUNTS.reduce<number>((sum, count, index) => (FOCUS.has(index) ? sum + count : sum), 0);

const SCENES = [
  {
    label: "채점 50문항을 비중대로 나누면",
    short: "네 영역",
    summary: "12 · 15 · 17 · 6칸",
    note: "칸 하나가 채점 문항 하나입니다. 50 × 24% = 12처럼 비중을 문항 수로 옮긴 환산(가정)이며, 어느 것인지 알 수 없는 미채점 15문항은 그리지 않았습니다.",
  },
  {
    label: "보안과 기술을 합치면",
    short: "보안+기술",
    summary: `15 + 17 = ${FOCUS_COUNT}칸 · 64%`,
    note: `50칸 중 ${FOCUS_COUNT}칸으로 절반을 넘습니다. 그래서 두 영역을 공부 순서의 마지막으로 미루지 않습니다.`,
  },
] as const;

export default function ExamDomainSplitViz() {
  return (
    <SceneShell
      eyebrow="시험 영역 비중"
      title="채점 50문항을 네 영역 비중으로 나눠 봅니다"
      description="공식 비중 24·30·34·12%를 3절의 채점 문항 50개에 옮겨 칸으로 셉니다. 칸의 배치는 영역별로 모은 것이며 실제 출제 순서가 아닙니다."
      ariaLabel="CLF-C02 채점 문항 50개를 네 영역 비중으로 나눈 칸 그림"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-10 gap-1">
            {CELLS.map((domainIndex, cell) => {
              const domain = DOMAINS[domainIndex];
              const dim = active === 1 && !FOCUS.has(domainIndex);
              return (
                <div
                  key={cell}
                  className="flex h-6 min-w-0 items-center justify-center rounded-sm text-[10px] font-bold text-white sm:text-xs"
                  style={{ backgroundColor: domain.color, opacity: dim ? 0.18 : 1 }}
                >
                  {domain.short}
                </div>
              );
            })}
          </div>
          <ul className="mt-4 grid gap-x-4 gap-y-1.5 text-xs leading-5 sm:grid-cols-2 sm:text-sm">
            {DOMAINS.map((domain, index) => {
              const dim = active === 1 && !FOCUS.has(index);
              return (
                <li key={domain.key} className={`flex min-w-0 items-center gap-2 ${dim ? "text-muted-foreground/60" : ""}`}>
                  <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-[9px] font-bold text-white" style={{ backgroundColor: domain.color, opacity: dim ? 0.3 : 1 }}>
                    {domain.short}
                  </span>
                  <span className="min-w-0 break-keep">{domain.name}</span>
                  <span className="ml-auto shrink-0 font-mono">
                    {domain.weight}% → {COUNTS[index]}칸
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    />
  );
}
