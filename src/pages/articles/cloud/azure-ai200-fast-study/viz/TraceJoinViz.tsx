import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 2문단 — trace ID로 입구부터 데이터까지 이어 살피고, 첫 실패와 가장 긴 구간을 찾는다(알고리즘 5단계).
 * 1·2장면: ID(t-17, t-42, t-08)와 기록 줄은 그림용 가정.
 * 3·4장면: 8절 실습의 예시 출력(실측 아님). 정상 request 820 · search 120 · model 640ms, 실패 request 8100 · search 7450ms(model 줄 없음).
 * 막대는 길이만 비교한다. 각 구간의 시작 시각은 출력에 없다. 축은 두 장면 공통 0~8100ms.
 * 7450 / 8100 = 92%.
 */
const ACCENT = "#2563eb";
const RED = "#dc2626";
const MUTED = "#94a3b8";
const LABEL = "#475569";
const VIOLET = "#7c3aed";

const COLUMNS = [
  { title: "입구 컨테이너", lines: ["t-17 요청 받음", "t-42 요청 받음", "t-08 요청 받음"] },
  { title: "벡터 검색", lines: ["t-42 질의", "t-08 질의", "t-17 질의"] },
  { title: "모델 호출", lines: ["t-08 호출", "t-17 호출", "t-42 호출"] },
] as const;
const TARGET = "t-42";

const MAX_MS = 8100;
const BAR_X0 = 92;
const BAR_X1 = 300;
const bw = (ms: number) => (ms / MAX_MS) * (BAR_X1 - BAR_X0);

type Row = { name: string; ms: number | null };

const RUNS: { normal: readonly Row[]; failure: readonly Row[] } = {
  normal: [
    { name: "요청 전체", ms: 820 },
    { name: "검색", ms: 120 },
    { name: "모델", ms: 640 },
  ],
  failure: [
    { name: "요청 전체", ms: 8100 },
    { name: "검색", ms: 7450 },
    { name: "모델", ms: null },
  ],
};

const SCENES = [
  {
    label: "로그만 많이 모았을 때",
    summary: "9줄 · 어느 줄이 한 요청인지 모름",
    note: "세 부품이 각자 기록을 남기면 여러 요청의 줄이 뒤섞입니다. 줄이 많아도 이 가운데 어느 세 줄이 같은 요청인지 이어 보지 못하면 첫 실패를 찾기 어렵습니다(5절).",
  },
  {
    label: "같은 trace ID로 거르기",
    summary: `${TARGET} → 입구·검색·모델 3구간`,
    note: "trace ID는 한 요청이 지나는 모든 구간에 같이 붙는 번호입니다. 그 번호 하나로 거르면 흩어진 세 줄이 한 요청의 경로로 이어집니다. 그다음에 구간마다 걸린 시간을 비교합니다.",
  },
  {
    label: "정상 예시",
    summary: "요청 820ms · 검색 120 · 모델 640",
    note: "8절 실습의 예시 출력(실측 아님)입니다. 요청 전체가 820ms이고, 가장 긴 구간은 모델 640ms입니다. 막대는 길이만 비교하며 구간이 언제 시작했는지는 출력에 없습니다.",
  },
  {
    label: "실패 예시",
    summary: "검색 7,450ms = 요청의 92%",
    note: "같은 예시의 실패 출력입니다. 요청은 success=true로 끝났지만 8,100ms 가운데 검색이 7,450ms를 차지하므로 검색 구간부터 봅니다. 이 출력에는 모델 줄이 없어 막대를 그리지 않았습니다.",
  },
] as const;

export default function TraceJoinViz() {
  return (
    <SceneShell
      eyebrow="trace ID로 잇기"
      title="흩어진 기록을 한 요청으로 이어야 가장 긴 구간이 보입니다"
      description="앞의 두 장면은 세 부품의 기록 줄이고 ID는 그림용 가정입니다. 뒤의 두 장면은 8절 실습의 예시 출력(실측 아님)을 같은 0~8,100ms 축에 놓았습니다."
      ariaLabel="세 부품의 뒤섞인 기록을 trace ID로 묶고, 예시 출력에서 구간별 시간을 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 2 ? (
            <>
              {COLUMNS.map((column, ci) => {
                const x = 6 + ci * 118;
                return (
                  <g key={column.title}>
                    <text x={x + 53} y={16} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={LABEL}>{column.title}</text>
                    <rect x={x} y={24} width={106} height={108} rx={8} fill="none" stroke={MUTED} strokeWidth={1} />
                    {column.lines.map((line, li) => {
                      const hit = active === 1 && line.startsWith(TARGET);
                      return (
                        <g key={line} opacity={active === 1 && !hit ? 0.3 : 1}>
                          <rect x={x + 8} y={34 + li * 32} width={90} height={22} rx={4} fill="none" stroke={hit ? VIOLET : MUTED} strokeWidth={hit ? 1.25 : 1} />
                          <text x={x + 53} y={49 + li * 32} textAnchor="middle" fontSize={10.5} fontWeight={hit ? 700 : 400} fill="currentColor">{line}</text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
              {active === 1 ? (
                <>
                  <polyline points="104,77 132,45" fill="none" stroke={VIOLET} strokeWidth={1.25} strokeDasharray="4 3" />
                  <polyline points="222,45 250,109" fill="none" stroke={VIOLET} strokeWidth={1.25} strokeDasharray="4 3" />
                  <text x={180} y={156} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6d28d9">{TARGET} 하나로 세 구간이 이어짐</text>
                </>
              ) : (
                <text x={180} y={156} textAnchor="middle" fontSize={11} fill={LABEL}>세 요청의 줄이 섞여 있음</text>
              )}
            </>
          ) : (
            <>
              {(active === 2 ? RUNS.normal : RUNS.failure).map((row, ri) => {
                const y = 26 + ri * 40;
                const longest = active === 3 && row.name === "검색";
                return (
                  <g key={row.name}>
                    <text x={BAR_X0 - 8} y={y + 13} textAnchor="end" fontSize={11} fontWeight={700} fill={LABEL}>{row.name}</text>
                    <rect x={BAR_X0} y={y} width={BAR_X1 - BAR_X0} height={18} rx={3} fill={MUTED} opacity={0.15} />
                    {row.ms === null ? (
                      <text x={BAR_X0 + 6} y={y + 13} fontSize={10.5} fill={LABEL}>출력에 없음</text>
                    ) : (
                      <>
                        <rect x={BAR_X0} y={y} width={Math.max(bw(row.ms), 2)} height={18} rx={3} fill={longest ? RED : ri === 0 ? MUTED : ACCENT} />
                        <text x={row.ms > 6000 ? BAR_X1 + 4 : BAR_X0 + bw(row.ms) + 6} y={y + 13} fontSize={10.5} fontWeight={700} fill={longest ? RED : "currentColor"}>
                          {row.ms.toLocaleString("en-US")}ms
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
              <line x1={BAR_X0} x2={BAR_X1} y1={146} y2={146} stroke={MUTED} strokeWidth={1} />
              {[0, 4000, 8100].map((tick) => (
                <text key={tick} x={BAR_X0 + bw(tick)} y={162} textAnchor="middle" fontSize={10} fill={LABEL}>{`${tick.toLocaleString("en-US")}${tick === MAX_MS ? "ms" : ""}`}</text>
              ))}
              <text x={BAR_X0} y={14} fontSize={10.5} fill={LABEL}>요청 결과 success=true</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
