import SceneShell from "./SceneShell";

/**
 * 본문 대응: #reconstruction의 BCE 해석 — 실제 값 x=1인 좌표 하나에서
 * 제곱 오차 (1−x̂)²와 BCE −log x̂(자연로그)를 예측 x̂에 따라 비교한다.
 * x̂=0.9: 0.01 / 0.105, 0.5: 0.25 / 0.693, 0.1: 0.81 / 2.303, 0.01: 0.980 / 4.605.
 */
const POINTS = [0.9, 0.5, 0.1, 0.01] as const;
const sq = (p: number) => (1 - p) ** 2;
const bce = (p: number) => -Math.log(p);

const SCENES = [
  { label: "정답 가까이 (x̂=0.9)", summary: "제곱 0.01 · BCE 0.105", note: "실제 값이 1이고 예측이 0.9이면 두 벌점 모두 작습니다." },
  { label: "중간 (x̂=0.5)", summary: "제곱 0.25 · BCE 0.693", note: "예측이 1에서 멀어질수록 두 벌점 모두 커지지만, 이미 BCE 쪽이 더 큽니다." },
  { label: "반대쪽 (x̂=0.1)", summary: "제곱 0.81 · BCE 2.303", note: "정답이 1인데 0에 가까운 0.1을 예측했습니다. 제곱 오차는 0.81이고 BCE는 그 약 2.8배인 2.303입니다." },
  { label: "반대 극단 (x̂=0.01)", summary: "제곱 0.980 · BCE 4.605", note: "제곱 오차는 x̂가 0에 다가가도 1을 넘지 않습니다. BCE의 −log x̂는 x̂가 0에 다가갈수록 끝없이 커집니다(발산). 실제 값이 0인 좌표에서는 좌우를 뒤집은 모양이 됩니다." },
] as const;

const W = 320;
const H = 220;
const L = 40;
const R = 304;
const T = 16;
const B = 186;
const Y_MAX = 5;
const px = (p: number) => L + p * (R - L);
const py = (v: number) => B - (Math.min(v, Y_MAX) / Y_MAX) * (B - T);
const SAMPLES = Array.from({ length: 101 }, (_, i) => i / 100);
const SQ_PATH = SAMPLES.map((p, i) => `${i ? "L" : "M"}${px(p).toFixed(1)} ${py(sq(p)).toFixed(1)}`).join(" ");
const BCE_START = Math.exp(-Y_MAX);
const BCE_PATH = [BCE_START, ...SAMPLES.slice(1)]
  .map((p, i) => `${i ? "L" : "M"}${px(p).toFixed(1)} ${py(bce(p)).toFixed(1)}`)
  .join(" ");
const SQ_COLOR = "#64748b";
const BCE_COLOR = "#dc2626";
const LINE = "#94a3b8";

export default function BcePenaltyViz() {
  return (
    <SceneShell
      eyebrow="같은 오답, 다른 벌점"
      title="정답이 1인데 0 쪽을 예측하면 BCE 벌점은 끝없이 커집니다"
      description="실제 값 x=1인 좌표 하나에서 decoder 예측 x̂에 따른 벌점입니다. 회색은 제곱 오차 (1−x̂)², 빨강은 BCE(binary cross-entropy)의 −log x̂이며 log는 자연로그로 계산했습니다. 세로축은 5에서 자릅니다."
      ariaLabel="예측 확률에 따른 제곱 오차와 BCE 벌점 곡선 비교"
      scenes={SCENES}
      render={(active) => {
        const p = POINTS[active];
        return (
          <div className="min-w-0 space-y-2">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {[0, 1, 2, 3, 4, 5].map((v) => (
                <g key={v}>
                  <line x1={L} x2={R} y1={py(v)} y2={py(v)} stroke={LINE} strokeWidth={1} opacity={v === 0 ? 1 : 0.25} />
                  <text x={L - 6} y={py(v) + 4} fontSize={12} textAnchor="end" fill={SQ_COLOR}>{v}</text>
                </g>
              ))}
              {[0, 0.5, 1].map((v) => (
                <text key={v} x={px(v)} y={B + 17} fontSize={12} textAnchor="middle" fill={SQ_COLOR}>{v}</text>
              ))}
              <text x={R} y={H - 2} fontSize={12} textAnchor="end" fill={SQ_COLOR}>예측 x̂</text>
              <path d={SQ_PATH} fill="none" stroke={SQ_COLOR} strokeWidth={1.25} />
              <path d={BCE_PATH} fill="none" stroke={BCE_COLOR} strokeWidth={1.25} />
              <line x1={px(p)} x2={px(p)} y1={T} y2={B} stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={px(p)} cy={py(sq(p))} r={4} fill={SQ_COLOR} />
              <circle cx={px(p)} cy={py(bce(p))} r={4} fill={BCE_COLOR} />
              <text x={px(p) + 8} y={py(bce(p)) + (p < 0.05 ? 14 : -8)} fontSize={13} fontWeight={700} fill={BCE_COLOR}>{bce(p).toFixed(3)}</text>
              <text x={p > 0.8 ? px(p) - 8 : px(p) + 8} y={py(sq(p)) - 8} textAnchor={p > 0.8 ? "end" : "start"} fontSize={13} fontWeight={700} fill={SQ_COLOR}>{sq(p).toFixed(p > 0.05 ? 2 : 3)}</text>
            </svg>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
              <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5" style={{ backgroundColor: SQ_COLOR }} />제곱 오차 (1−x̂)²</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5" style={{ backgroundColor: BCE_COLOR }} />BCE −log x̂</span>
            </div>
          </div>
        );
      }}
    />
  );
}
