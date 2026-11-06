import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stall-taxonomy — 표본 100개 = long 60·short 15·barrier 10·not selected 10·selected 5.
 * selected 5개이므로 issue 한 번 사이 100÷5=20개, 그중 long 60÷5=12개. 셋째 장면의 겹침 그림은 가정.
 */
type Kind = "long" | "short" | "bar" | "not" | "sel";

const META: Record<Kind, { name: string; mark: string; color: string; total: number; perIssue: number }> = {
  long: { name: "long scoreboard", mark: "L", color: "#d97706", total: 60, perIssue: 12 },
  short: { name: "short scoreboard", mark: "S", color: "#0284c7", total: 15, perIssue: 3 },
  bar: { name: "barrier", mark: "B", color: "#64748b", total: 10, perIssue: 2 },
  not: { name: "not selected", mark: "N", color: "#16a34a", total: 10, perIssue: 2 },
  sel: { name: "selected", mark: "●", color: "#2563eb", total: 5, perIssue: 1 },
};
const ORDER: readonly Kind[] = ["long", "short", "bar", "not", "sel"];
const ROW_ORDER: readonly Kind[] = ["sel", "long", "short", "bar", "not"];

const ALL = ORDER.flatMap((kind) => Array.from({ length: META[kind].total }, () => kind));
const ONE_ROW = ROW_ORDER.flatMap((kind) => Array.from({ length: META[kind].perIssue }, () => kind));
const BY_ISSUE = Array.from({ length: 5 }, () => ONE_ROW).flat();

const X0 = 10;
const Y0 = 26;
const CELL = 17;

const SCENES = [
  { label: "표본 100개", summary: "60 + 15 + 10 + 10 + 5 = 100", note: "칸 하나가 warp 상태 표본 하나입니다. 같은 이름끼리 모으면 long scoreboard 가 60칸으로 가장 크고, 실제 issue 된 selected 는 5칸입니다." },
  { label: "Issue 한 번 사이", summary: "100 ÷ 5 = 20 · 60 ÷ 5 = 12", note: "selected 5칸을 다섯 줄의 맨 앞에 놓고 나머지를 고르게 나눕니다. 평균적으로 issue 한 번 사이에 표본이 20개 있었고 그중 12개가량이 long scoreboard, 즉 global·local·texture memory 의 결과를 기다리는 표본입니다." },
  { label: "60 clock 이 아닙니다", summary: "겹침 → 먼저 issue activity", note: "여러 warp 의 기다림은 서로 겹치므로 “100 clock 중 60 clock 을 HBM 에서 기다렸다”로 읽으면 안 됩니다. Scheduler Statistics 에서 issue activity 가 낮은지 먼저 확인한 뒤에만 이 분포를 원인 후보로 씁니다." },
] as const;

const OVERLAP_ROWS = ["W0", "W1", "W2"] as const;

export default function SampleSplitViz() {
  return (
    <SceneShell
      eyebrow="표본 분포 읽기"
      title="표본 100개를 issue 한 번 단위로 다시 나누면 20개 중 12개가 됩니다"
      description="active warp 표본 100개의 분포는 글이 셈을 보이려고 둔 가정값입니다. 셋째 장면의 warp 3개·clock 6칸도 겹침을 보이려는 가정입니다."
      ariaLabel="stall 표본 100개의 구성과 issue 한 번 사이 표본 20개로 나눈 결과"
      scenes={SCENES}
      render={(active) => {
        const cells = active === 1 ? BY_ISSUE : ALL;
        return (
          <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={15} fontSize={12} fill="currentColor">{active === 1 ? "한 줄 = issue 한 번 사이 (평균)" : "칸 하나 = warp 상태 표본 하나"}</text>
            {cells.map((kind, index) => {
              const col = index % 20;
              const row = Math.floor(index / 20);
              const x = X0 + col * CELL;
              const y = Y0 + row * CELL;
              return (
                <g key={index} opacity={active === 2 ? 0.35 : 1}>
                  <rect x={x} y={y} width={CELL - 2} height={CELL - 2} fill={META[kind].color} fillOpacity={0.25} stroke={META[kind].color} strokeWidth={1} />
                  <text x={x + (CELL - 2) / 2} y={y + 11.5} textAnchor="middle" fontSize={10} fill="currentColor">{META[kind].mark}</text>
                </g>
              );
            })}
            {active < 2 && ORDER.map((kind, index) => (
              <g key={kind}>
                <rect x={X0} y={124 + index * 20} width={12} height={12} fill={META[kind].color} fillOpacity={0.25} stroke={META[kind].color} strokeWidth={1} />
                <text x={X0 + 20} y={134 + index * 20} fontSize={12} fill="currentColor">{META[kind].mark} {META[kind].name}</text>
                <text x={340} y={134 + index * 20} textAnchor="end" fontSize={12} fontWeight={700} fill="currentColor">
                  {active === 0 ? `${META[kind].total}개` : `줄마다 ${META[kind].perIssue}개`}
                </text>
              </g>
            ))}
            {active === 2 && (
              <g>
                <text x={X0} y={128} fontSize={12} fill="currentColor">같은 clock 에 셋이 함께 기다리는 경우 (가정)</text>
                {OVERLAP_ROWS.map((name, row) => (
                  <g key={name}>
                    <text x={X0} y={152 + row * 20} fontSize={11} fill="currentColor">{name}</text>
                    {Array.from({ length: 6 }, (_, clock) => {
                      const waiting = clock === 2 || (row === 0 && clock === 3) || (row === 1 && clock === 1);
                      return (
                        <rect key={clock} x={40 + clock * 34} y={140 + row * 20} width={32} height={16} fill={waiting ? "#d97706" : "none"} fillOpacity={0.3} stroke={waiting ? "#d97706" : "#94a3b8"} strokeOpacity={waiting ? 1 : 0.45} strokeWidth={1} />
                      );
                    })}
                  </g>
                ))}
                <rect x={40 + 2 * 34 - 2} y={136} width={36} height={64} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                <text x={X0} y={218} fontSize={12} fontWeight={700} fill="currentColor">clock 1칸인데 기다림 표본 후보는 3칸</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
