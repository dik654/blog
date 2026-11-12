import SceneShell from "./SceneShell";

/**
 * 본문 대응: #distillation — 16개 후보 점수를 같은 τ의 softmax로 바꾸고 KL로 student를 teacher 쪽으로 당긴다.
 * 점수 16개는 모두 설명용 가정. τ = 1.0과 0.05는 Loss ablation 절의 두 설정.
 */
const TEACHER: readonly number[] = [0.86, 0.78, 0.75, 0.72, 0.7, 0.68, 0.66, 0.64, 0.62, 0.6, 0.58, 0.56, 0.54, 0.52, 0.5, 0.48];
const STUDENT: readonly number[] = [0.74, 0.77, 0.72, 0.7, 0.69, 0.66, 0.65, 0.62, 0.61, 0.58, 0.57, 0.55, 0.53, 0.51, 0.49, 0.47];

const softmax = (scores: readonly number[], tau: number) => {
  const exps = scores.map((s) => Math.exp(s / tau));
  const total = exps.reduce<number>((sum, e) => sum + e, 0);
  return exps.map((e) => e / total);
};

const T_FLAT = softmax(TEACHER, 1);
const T_SHARP = softmax(TEACHER, 0.05);
const S_SHARP = softmax(STUDENT, 0.05);
const KL = T_SHARP.reduce<number>((sum, p, i) => sum + p * Math.log(p / S_SHARP[i]), 0);
const N = TEACHER.length;
const UNIFORM = 1 / N;

const pct = (p: number) => `${(p * 100).toFixed(1)}%`;

const SCENES = [
  {
    label: "teacher 점수 16개",
    summary: "positive 1 + negative 15",
    note: "Query 하나의 후보 목록입니다. 맨 왼쪽이 positive, 나머지 15개가 저장된 negative입니다. 학습 파일에는 이 scalar 점수 16개만 저장합니다.",
  },
  {
    label: "τ = 1.0으로 확률로 바꾸면",
    summary: `positive ${pct(T_FLAT[0])} · 균등 ${pct(UNIFORM)}`,
    note: "점수를 τ로 나눈 뒤 지수를 취해 합이 1이 되게 나눕니다. 점수 차이가 0.4 안팎이라 τ = 1.0에서는 모든 후보가 균등선 근처에 모여 차이가 거의 드러나지 않습니다.",
  },
  {
    label: "τ = 0.05로 바꾸면",
    summary: `positive ${pct(T_SHARP[0])}`,
    note: "같은 점수를 0.05로 나누면 작은 점수 차이가 크게 벌어집니다. Teacher가 높게 둔 상위 후보에 확률이 몰려, 상위 후보 사이의 차이가 더 강조됩니다.",
  },
  {
    label: "student 분포와 비교",
    summary: `KL(Pᵀ‖Pˢ) ≈ ${KL.toFixed(2)}`,
    note: `Student는 같은 16개 후보에 cosine 점수를 매기고 같은 τ로 분포를 만듭니다. 이 가정에서 student는 첫 negative를 positive보다 높게 둡니다(${pct(S_SHARP[1])} 대 ${pct(S_SHARP[0])}). KL은 teacher 분포 기준으로 이 차이를 재고, 학습은 이 값을 줄이는 쪽으로 student를 움직입니다.`,
  },
] as const;

const W = 380;
const H = 196;
const LEFT = 22;
const BASE_Y = 160;
const TOP_Y = 34;
const STEP = 21.5;
const BAR_W = 9;
const P_MAX = 0.7;

const TEACH = "#2563eb";
const STU = "#d97706";
const POS = "#16a34a";
const MUTED = "#64748b";
const GRID = "#94a3b8";

export default function TemperatureViz() {
  return (
    <SceneShell
      eyebrow="Temperature"
      title="같은 점수라도 τ가 작으면 상위 후보에 확률이 몰립니다"
      description="막대 하나가 후보 하나입니다. 첫 장면은 점수 자체(0~1), 이후 장면은 16개 후보 안의 확률입니다."
      note="16개 점수는 모두 설명용 가정이며 내부 teacher의 실제 값이 아닙니다. τ = 1.0과 0.05는 Loss ablation 절의 두 설정입니다."
      ariaLabel="temperature에 따라 teacher 후보 분포가 평탄해지거나 상위에 몰리는 모습과 student 분포 비교"
      scenes={SCENES}
      render={(active) => {
        const raw = active === 0;
        const teacher = raw ? TEACHER : active === 1 ? T_FLAT : T_SHARP;
        const max = raw ? 1 : P_MAX;
        const h = (v: number) => (v / max) * (BASE_Y - TOP_Y);
        const showStudent = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <g fontSize={13} fill={MUTED}>
              <rect x={LEFT} y={8} width={10} height={10} fill={TEACH} opacity={0.8} />
              <text x={LEFT + 14} y={17}>{raw ? "teacher 점수" : "teacher 확률"}</text>
              <g opacity={showStudent ? 1 : 0}>
                <rect x={LEFT + 120} y={8} width={10} height={10} fill={STU} opacity={0.8} />
                <text x={LEFT + 134} y={17}>student 확률 (τ = 0.05)</text>
              </g>
            </g>
            {!raw && (
              <>
                <line x1={LEFT - 4} x2={W - 10} y1={BASE_Y - h(UNIFORM)} y2={BASE_Y - h(UNIFORM)} stroke={GRID} strokeWidth={1} strokeDasharray="3 3" />
                <text x={W - 10} y={BASE_Y - h(UNIFORM) - 4} textAnchor="end" fontSize={12} fill={MUTED}>균등 1/16</text>
              </>
            )}
            {teacher.map((v, i) => {
              const x = LEFT + i * STEP;
              const s = S_SHARP[i];
              return (
                <g key={i}>
                  <rect x={x} y={BASE_Y - h(v)} width={BAR_W} height={h(v)} fill={i === 0 ? POS : TEACH} opacity={0.8} />
                  {showStudent && (
                    <rect x={x + BAR_W + 1} y={BASE_Y - h(s)} width={BAR_W} height={h(s)} fill={STU} opacity={0.8} />
                  )}
                  {i === 0 && (
                    <text x={x + BAR_W / 2} y={BASE_Y - h(v) - 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={POS}>
                      {raw ? v.toFixed(2) : pct(v)}
                    </text>
                  )}
                </g>
              );
            })}
            <line x1={LEFT - 4} x2={W - 10} y1={BASE_Y} y2={BASE_Y} stroke={GRID} strokeWidth={1} />
            <text x={LEFT + BAR_W / 2} y={BASE_Y + 15} textAnchor="middle" fontSize={12} fontWeight={700} fill={POS}>p</text>
            <text x={LEFT + STEP + BAR_W / 2} y={BASE_Y + 15} textAnchor="middle" fontSize={12} fill={MUTED}>n1</text>
            <text x={LEFT + 15 * STEP + BAR_W / 2} y={BASE_Y + 15} textAnchor="middle" fontSize={12} fill={MUTED}>n15</text>
            <text x={LEFT + 8 * STEP} y={BASE_Y + 30} textAnchor="middle" fontSize={12} fill={MUTED}>후보 16개 · positive 1 + negative 15</text>
          </svg>
        );
      }}
    />
  );
}
