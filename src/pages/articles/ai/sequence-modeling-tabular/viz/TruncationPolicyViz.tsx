import SceneShell from "./SceneShell";

/**
 * 본문 대응: #encoding "Padding과 truncation" — event 1,000개 history를 128 자리로 줄이는 네 정책.
 * 최근 128개만 남기면 1,000 − 128 = 872개를 버린다. precursor 위치(오래된 쪽 30% 지점)는 가정.
 */
const TOTAL = 1000;
const KEEP = 128;
const DROPPED = TOTAL - KEEP;
const PRECURSOR_AT = 230;

const W = 360;
const H = 158;
const X0 = 16;
const BW = W - 2 * X0;
const BY = 44;
const BH = 22;
const px = (event: number) => X0 + (event / TOTAL) * BW;
const RECENT_X = px(TOTAL - KEEP);
const SAMPLE_TICKS = Array.from({ length: KEEP }, (_, k) => px(((k + 0.5) * TOTAL) / KEEP));
const SUMMARY_BLOCKS = [0, 1, 2, 3];

const KEPT = "#2563eb";
const LOST = "#dc2626";
const MUTED = "#94a3b8";
const SUB = "#64748b";

type Fate = "lost" | "depends" | "kept";

const SCENES = [
  {
    label: "최근 128개만 남기기",
    summary: `${KEEP} 남김 · ${DROPPED} 버림`,
    fate: "lost" as Fate,
    fateText: "precursor 사라짐",
    note: `1,000개 중 오른쪽(최근) 128개만 tensor에 들어가고 ${DROPPED}개는 버려집니다. 잘린 event는 나중에 복구되지 않으므로, 오래된 구간에 있던 precursor도 함께 없어집니다.`,
  },
  {
    label: "균등 sampling",
    summary: "1,000개 전체에서 128개를 고르게",
    fate: "depends" as Fate,
    fateText: "표본 간격에 걸리는지에 따라 다름",
    note: "자리 수는 똑같이 128개지만 오래된 구간에서도 고르게 뽑습니다. 대신 뽑힌 표본 사이에 놓인 event는 빠지므로, precursor가 남는지는 그 위치가 표본에 걸리는지에 달립니다.",
  },
  {
    label: "중요 event 보존",
    summary: "중요 event는 위치와 무관하게 남김",
    fate: "kept" as Fate,
    fateText: "precursor를 중요 event로 지정했다면 남음",
    note: "중요하다고 지정한 event는 오래된 구간에 있어도 남기고, 나머지 자리를 최근 event로 채웁니다(두 몫의 배분은 가정입니다). recent-only와 같은 cutoff·split에 놓고 비교해야 차이를 판정할 수 있습니다.",
  },
  {
    label: "오래된 구간 요약",
    summary: "최근은 원본 · 오래된 쪽은 요약",
    fate: "depends" as Fate,
    fateText: "요약이 이 evidence를 담는지에 따라 다름",
    note: "최근 구간은 event 그대로 두고 오래된 구간은 몇 개의 hierarchical summary로 바꿉니다(요약 칸 수는 가정). 요약이 어떤 target evidence를 버리는지는 length slice와 positive-pattern coverage로 확인합니다.",
  },
] as const;

export default function TruncationPolicyViz() {
  return (
    <SceneShell
      eyebrow="Truncation policy"
      title="1,000개 history를 128 자리에 담는 네 방법"
      description="가로 막대 하나가 event 1,000개짜리 history이며 왼쪽이 오래된 쪽, 오른쪽이 cutoff 직전입니다. 파란 부분이 남는 event, 빨간 표시는 precursor(목표 사건보다 먼저 나타나는 단서 event)입니다. precursor의 위치는 설명용 가정입니다."
      ariaLabel="event 1,000개를 128개로 줄이는 네 truncation 정책이 남기는 위치와 precursor 보존 여부"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const precursorKept = scene.fate === "kept";
        const fateColor = scene.fate === "lost" ? LOST : scene.fate === "kept" ? KEPT : SUB;
        const preX = px(PRECURSOR_AT);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={30} fontSize={11} fill={SUB}>← 오래된 event</text>
            <text x={W - X0} y={30} textAnchor="end" fontSize={11} fill={SUB}>cutoff 직전 →</text>
            <rect x={X0} y={BY} width={BW} height={BH} fill={MUTED} fillOpacity={0.12} stroke={MUTED} strokeWidth={1} />

            {(active === 0 || active === 2 || active === 3) && (
              <rect x={active === 2 ? RECENT_X + 3 : RECENT_X} y={BY} width={active === 2 ? W - X0 - RECENT_X - 3 : W - X0 - RECENT_X} height={BH} fill={KEPT} fillOpacity={0.55} />
            )}
            {active === 1 && SAMPLE_TICKS.map((x, k) => <line key={k} x1={x} x2={x} y1={BY} y2={BY + BH} stroke={KEPT} strokeWidth={1} />)}
            {active === 3 &&
              SUMMARY_BLOCKS.map((b) => {
                const segW = (RECENT_X - X0) / SUMMARY_BLOCKS.length;
                return (
                  <g key={b}>
                    <rect x={X0 + b * segW + 4} y={BY + 4} width={segW - 8} height={BH - 8} rx={3} fill="none" stroke={KEPT} strokeWidth={1} strokeDasharray="3 2" />
                    <text x={X0 + b * segW + segW / 2} y={BY + 15} textAnchor="middle" fontSize={9} fill={KEPT}>요약</text>
                  </g>
                );
              })}

            <line x1={preX} x2={preX} y1={BY - 6} y2={BY + BH + 6} stroke={LOST} strokeWidth={1.25} />
            {precursorKept && <rect x={preX - 3} y={BY} width={6} height={BH} fill={KEPT} fillOpacity={0.8} />}
            {scene.fate === "lost" && (
              <g stroke={LOST} strokeWidth={1.25}>
                <line x1={preX - 5} y1={BY + BH + 9} x2={preX + 5} y2={BY + BH + 19} />
                <line x1={preX + 5} y1={BY + BH + 9} x2={preX - 5} y2={BY + BH + 19} />
              </g>
            )}
            <text x={preX} y={BY + BH + 32} textAnchor="middle" fontSize={10} fill={LOST}>precursor (위치 가정)</text>

            <text x={X0} y={128} fontSize={11} fill={SUB}>
              {active === 3 ? "최근 event 원본 + 요약 칸 (길이·칸 수 가정)": "남는 자리 "}
              {active !== 3 && <tspan fontWeight={700} fill="currentColor">{KEEP}</tspan>}
              {active === 1 && " · 세로선 하나 = 뽑힌 event 하나"}
              {active === 0 && (
                <>
                  {" "}· 버리는 event <tspan fontWeight={700} fill={LOST}>{TOTAL} − {KEEP} = {DROPPED}</tspan>
                </>
              )}
            </text>
            <text x={X0} y={146} fontSize={11} fill={fateColor} fontWeight={700}>{scene.fateText}</text>
          </svg>
        );
      }}
    />
  );
}
