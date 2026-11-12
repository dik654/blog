import SceneShell from "./SceneShell";

/**
 * 본문 대응: #runtime-boundary — 최종 latency ≈ forward 한 번 시간 × NFE(호출 수).
 * 숫자는 모두 그림용 가정: 기준 8회 × 1단위, 빠른 forward는 0.6단위, 줄인 호출은 4회.
 * 8×1 = 8, 8×0.6 = 4.8, 4×1 = 4, 4×0.6 = 2.4.
 */
const SCENES = [
  { label: "기준", calls: 8, each: 1, note: "칸 하나가 DiT forward 한 번, 즉 solver가 network를 한 번 부르는 NFE(network function evaluation) 한 번입니다. Image diffusion은 매 step 전체 noisy token을 다시 읽으므로, LLM처럼 앞부분 K/V를 cache해 두고 새 token만 계산하는 구조가 기본이 아닙니다. 칸이 이어진 길이가 총 시간입니다." },
  { label: "forward 한 번을 빠르게", calls: 8, each: 0.6, note: "FlashAttention·GQA·kernel fusion은 칸 하나의 길이를 줄입니다. 칸 개수, 즉 호출 수는 그대로입니다." },
  { label: "호출 수를 줄이기", calls: 4, each: 1, note: "Distillation이나 solver 선택은 칸 개수를 줄입니다. 칸 하나의 길이는 그대로입니다. 몇 step에서 같은 품질이 나오는지는 checkpoint마다 따로 측정해야 하는 주장입니다." },
  { label: "두 축이 곱으로 만남", calls: 4, each: 0.6, note: "총 시간에서는 두 개선이 곱해지지만 실패 원인은 다릅니다. 같은 prompt·seed·resolution에서 한 번의 시간, 호출 수, 전체 latency, 품질 저하를 따로 기록해야 어느 축의 개선인지 알 수 있습니다." },
] as const;

const BASE_CALLS = 8;
const LEFT = 8;
const RIGHT = 332;
const UNIT = (RIGHT - LEFT) / BASE_CALLS;
const ROW_Y = 30;
const ROW_H = 40;

const fmt = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1));

export default function SamplingCostViz() {
  return (
    <SceneShell
      eyebrow="Sampling 비용"
      title="총 시간은 forward 한 번의 길이와 호출 횟수의 곱입니다"
      description="가로 길이가 시간입니다. 칸 하나는 forward 한 번이며, 8회·1단위·0.6단위·4회는 비교를 위한 가정입니다. 점선은 기준 길이입니다."
      ariaLabel="forward 한 번 시간과 NFE 호출 수가 곱해져 총 latency가 되는 과정"
      scenes={SCENES.map((scene) => ({
        label: scene.label,
        summary: `${scene.calls}회 × ${fmt(scene.each)} = ${fmt(scene.calls * scene.each)}단위`,
        note: scene.note,
      }))}
      render={(active) => {
        const scene = SCENES[active];
        const width = scene.each * UNIT;
        const total = scene.calls * scene.each;
        const end = LEFT + total * UNIT;
        return (
          <svg viewBox="0 0 340 118" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.calls}회 곱하기 ${fmt(scene.each)}단위`}>
            <rect x={LEFT} y={ROW_Y} width={RIGHT - LEFT} height={ROW_H} rx={4} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
            {Array.from({ length: scene.calls }, (_, i) => (
              <g key={i}>
                <rect x={LEFT + i * width + 1} y={ROW_Y + 3} width={width - 2} height={ROW_H - 6} rx={3} fill={active === 0 ? "#64748b" : "#2563eb"} opacity={0.85} />
                <text x={LEFT + i * width + width / 2} y={ROW_Y + ROW_H / 2 + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">
                  {i + 1}
                </text>
              </g>
            ))}
            <text x={LEFT} y={ROW_Y - 10} fontSize={11} fill="#334155">forward 호출 {scene.calls}회 · 한 번 {fmt(scene.each)}단위</text>
            <line x1={LEFT} x2={end} y1={ROW_Y + ROW_H + 16} y2={ROW_Y + ROW_H + 16} stroke="#2563eb" strokeWidth={1.25} />
            <line x1={end} x2={end} y1={ROW_Y + ROW_H + 10} y2={ROW_Y + ROW_H + 22} stroke="#2563eb" strokeWidth={1.25} />
            <text x={end > 200 ? end : end + 6} y={ROW_Y + ROW_H + 38} textAnchor={end > 200 ? "end" : "start"} fontSize={11} fontWeight={700} fill="#2563eb">
              총 {fmt(total)}단위
            </text>
            <text x={RIGHT} y={ROW_Y - 10} textAnchor="end" fontSize={10} fill="#64748b">기준 8단위</text>
          </svg>
        );
      }}
    />
  );
}
