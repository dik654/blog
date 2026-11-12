import SceneShell from "./SceneShell";

/**
 * 본문 대응: #hybrid — layer 30 개, n=32,768, w=1,024 인 5:1 구성의 KV 총량.
 * all-global: 30n = 983,040 · 5:1: 5n + 25w = 163,840 + 25,600 = 189,440 → 19.3%, 983,040/189,440 ≈ 5.2 배.
 * 이 글이 만든 산수 예이며 Gemma 3 보고치(15% 미만)와 별개다. 줄 순서(local 5 개 뒤 global 1 개)는 그림용 가정.
 */
const N = 32768;
const WIN = 1024;
const LAYERS = 30;
const ALL_GLOBAL = LAYERS * N;
const GLOBAL_PART = 5 * N;
const LOCAL_PART = 25 * WIN;
const MIXED = GLOBAL_PART + LOCAL_PART;
const PERCENT = ((MIXED / ALL_GLOBAL) * 100).toFixed(1);
const FOLD = (ALL_GLOBAL / MIXED).toFixed(1);
const fmt = (value: number) => value.toLocaleString("en-US");

const SCENES = [
  { label: "All-global", summary: `30 × 32,768 = ${fmt(ALL_GLOBAL)}`, note: "모든 layer 가 global 이면 30 개 layer 가 각자 32,768 token 의 KV 를 저장합니다. 줄 하나의 길이가 그 layer 가 저장하는 token 수입니다." },
  { label: "5:1 hybrid", summary: `5n + 25w = ${fmt(MIXED)}`, note: "Local layer 25 개는 window 1,024 token 만 저장해 줄이 아주 짧아집니다. n 에 비례해 길게 남는 줄은 global layer 5 개뿐입니다." },
  { label: "총량 비교", summary: `${PERCENT}% · 약 ${FOLD} 배 절감`, note: "줄을 모두 이어 붙이면 189,440 / 983,040 ≈ 19.3% 입니다. 이 글이 만든 산수 예이고, Gemma 3 가 보고한 15% 미만이라는 수치와는 별개입니다." },
] as const;

const VW = 360;
const LEFT = 52;
const RIGHT = 344;
const TOP = 14;
const ROW_H = 4;
const ROW_GAP = 1.6;
const VH = TOP + LAYERS * (ROW_H + ROW_GAP) + 30;
const len = (tokens: number, max: number) => (tokens / max) * (RIGHT - LEFT);
const isGlobalLayer = (layer: number) => layer % 6 === 5;

export default function HybridKvTotalViz() {
  return (
    <SceneShell
      eyebrow="Hybrid attention · KV 총량"
      title="Local layer 가 많을수록 n 에 비례해 남는 줄은 global layer 몇 개뿐입니다"
      description="줄 하나가 layer 하나, 줄 길이가 그 layer 의 KV cache 가 저장하는 token 수입니다. 이 글의 산수 예(layer 30 개, n=32,768, local window w=1,024)를 씁니다. 줄 순서는 그림용 가정이며 합계는 순서와 무관합니다."
      ariaLabel="All-global 30 layer 와 5:1 hybrid 의 KV 저장량 비교"
      scenes={SCENES}
      render={(active) => {
        if (active === 2) {
          const barY = [TOP + 20, TOP + 92];
          return (
            <svg viewBox={`0 0 ${VW} ${VH}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[2].label}: ${SCENES[2].summary}`}>
              <text x={LEFT - 6} y={barY[0] + 14} textAnchor="end" fontSize={11} fill="#334155">all-global</text>
              <rect x={LEFT} y={barY[0]} width={RIGHT - LEFT} height={20} fill="#94a3b8" fillOpacity={0.35} stroke="#64748b" strokeWidth={1} />
              <text x={RIGHT} y={barY[0] - 5} textAnchor="end" fontSize={11} fill="#334155">30n = {fmt(ALL_GLOBAL)} token</text>
              <text x={LEFT - 6} y={barY[1] + 14} textAnchor="end" fontSize={11} fill="#334155">5:1</text>
              <rect x={LEFT} y={barY[1]} width={len(GLOBAL_PART, ALL_GLOBAL)} height={20} fill="#d97706" fillOpacity={0.45} stroke="#d97706" strokeWidth={1} />
              <rect x={LEFT + len(GLOBAL_PART, ALL_GLOBAL)} y={barY[1]} width={len(LOCAL_PART, ALL_GLOBAL)} height={20} fill="#2563eb" fillOpacity={0.45} stroke="#2563eb" strokeWidth={1} />
              <rect x={LEFT} y={barY[1]} width={RIGHT - LEFT} height={20} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
              <text x={LEFT} y={barY[1] + 36} fontSize={11} fill="#b45309">global 5n = {fmt(GLOBAL_PART)}</text>
              <text x={LEFT} y={barY[1] + 50} fontSize={11} fill="#1d4ed8">local 25w = {fmt(LOCAL_PART)}</text>
              <text x={RIGHT} y={barY[1] + 36} textAnchor="end" fontSize={11} fontWeight={700} fill="#334155">합 {fmt(MIXED)} = {PERCENT}%</text>
              <text x={RIGHT} y={barY[1] + 50} textAnchor="end" fontSize={11} fill="#64748b">983,040 ÷ 189,440 ≈ {FOLD} 배</text>
            </svg>
          );
        }
        const hybrid = active === 1;
        return (
          <svg viewBox={`0 0 ${VW} ${VH}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: LAYERS }, (_, layer) => {
              const global = !hybrid || isGlobalLayer(layer);
              const y = TOP + layer * (ROW_H + ROW_GAP);
              const color = !hybrid ? "#64748b" : global ? "#d97706" : "#2563eb";
              return <rect key={layer} x={LEFT} y={y} width={len(global ? N : WIN, N)} height={ROW_H} fill={color} fillOpacity={0.6} />;
            })}
            <text x={LEFT - 6} y={TOP + 8} textAnchor="end" fontSize={11} fill="#64748b">layer 1</text>
            <text x={LEFT - 6} y={TOP + LAYERS * (ROW_H + ROW_GAP) - 2} textAnchor="end" fontSize={11} fill="#64748b">layer 30</text>
            <line x1={LEFT} x2={RIGHT} y1={VH - 22} y2={VH - 22} stroke="#94a3b8" strokeWidth={1} />
            <text x={LEFT} y={VH - 8} fontSize={11} fill="#64748b">0</text>
            <text x={LEFT + len(WIN, N)} y={VH - 8} fontSize={11} fill="#1d4ed8" fontWeight={hybrid ? 700 : 400} opacity={hybrid ? 1 : 0}>w = 1,024</text>
            <text x={RIGHT} y={VH - 8} textAnchor="end" fontSize={11} fill="#64748b">n = 32,768 token</text>
            {hybrid && (
              <>
                <rect x={LEFT + 70} y={TOP + 36} width={10} height={6} fill="#d97706" fillOpacity={0.6} />
                <text x={LEFT + 84} y={TOP + 42} fontSize={11} fill="#b45309">global 5 개</text>
                <rect x={LEFT + 70} y={TOP + 49} width={10} height={6} fill="#2563eb" fillOpacity={0.6} />
                <text x={LEFT + 84} y={TOP + 55} fontSize={11} fill="#1d4ed8">local 25 개</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
