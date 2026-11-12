import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-preprocessing — 사진에서 구한 한 숫자의 묶음별 평균(가정).
 * train 800명 평균 10, validation 200명 평균 20, test 200명 평균 30.
 * 합친 평균 = (800×10 + 200×20 + 200×30) / 1,200 = 18,000 / 1,200 = 15.
 * test 값 30 변환: 30 − 10 = 20 (train에서 배운 평균) vs 30 − 15 = 15 (test가 섞인 평균).
 */
const GROUPS = [
  { name: "train", n: 800, mean: 10, color: "#2563eb" },
  { name: "validation", n: 200, mean: 20, color: "#7c3aed" },
  { name: "test", n: 200, mean: 30, color: "#059669" },
] as const;

const TOTAL_N = GROUPS.reduce<number>((sum, g) => sum + g.n, 0);
const WEIGHTED = GROUPS.reduce<number>((sum, g) => sum + g.n * g.mean, 0);
const POOLED = WEIGHTED / TOTAL_N;
const TRAIN_MEAN = GROUPS[0].mean;
const TEST_VALUE = GROUPS[2].mean;

const SCENES = [
  {
    label: "train 800명으로만 배웁니다",
    summary: `학습용 평균 = ${TRAIN_MEAN}`,
    note: "평균을 빼는 규칙을 배우는(fit) 자료는 첫 800명뿐입니다. Validation과 test 칸은 이 계산에 들어가지 않습니다.",
  },
  {
    label: "세 묶음을 합쳐 배우면",
    summary: `(8,000+4,000+6,000)/1,200 = ${POOLED}`,
    note: "800×10, 200×20, 200×30을 더해 1,200으로 나누면 15입니다. Validation 평균 20과 test 평균 30이 함께 들어가 학습 준비에 쓰는 평균을 10에서 15로 끌어올렸고, 그 결과 test의 분포가 학습 준비에 이미 영향을 줍니다.",
  },
  {
    label: "test 값 30을 변환하면",
    summary: `30−${TRAIN_MEAN}=${TEST_VALUE - TRAIN_MEAN} · 30−${POOLED}=${TEST_VALUE - POOLED}`,
    note: "Train에서 배운 평균 10을 적용하면 20, test를 포함해 다시 배운 평균 15를 적용하면 15입니다. 같은 test 값이라도 후자는 원래의 독립 평가 절차와 다른 계산입니다.",
  },
] as const;

const W = 360;
const H = 188;
const PAD = 16;
const STRIP_Y = 26;
const STRIP_H = 30;
const LINE_Y = 128;
const AXIS_MAX = 32;
const ax = (value: number) => PAD + (value / AXIS_MAX) * (W - 2 * PAD);

export default function MeanLeakViz() {
  return (
    <SceneShell
      eyebrow="전처리 경계"
      title="평균을 어느 묶음에서 배웠는지가 test 값의 변환 결과를 바꿉니다"
      description="위 띠는 1,200명을 사람 수 비율대로 나눈 것이고, 아래 선은 그 숫자의 값(0–30)입니다. 평균 10·20·30은 글의 가정입니다."
      ariaLabel="train 평균 10과 세 묶음을 합친 평균 15, 그리고 test 값 30을 각 평균으로 변환한 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const pooled = active >= 1;
        const used = (index: number) => index === 0 || pooled;
        const widths = GROUPS.map((g) => (g.n / TOTAL_N) * (W - 2 * PAD));
        const starts = widths.map((_, index) => PAD + widths.slice(0, index).reduce<number>((sum, w) => sum + w, 0));
        const mean = pooled ? POOLED : TRAIN_MEAN;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block w-full max-w-[520px]" role="img" aria-label="묶음 띠와 값의 수직선">
            <text x={PAD} y={STRIP_Y - 8} fontSize="11" fill="currentColor" opacity="0.75">
              평균을 배우는 데 들어간 사람 (fit)
            </text>
            {GROUPS.map((g, index) => (
              <g key={g.name}>
                <rect
                  x={starts[index]}
                  y={STRIP_Y}
                  width={widths[index] - 2}
                  height={STRIP_H}
                  rx="4"
                  fill={used(index) ? g.color : "none"}
                  fillOpacity={used(index) ? 0.85 : 0}
                  stroke={g.color}
                  strokeWidth="1"
                  strokeDasharray={used(index) ? undefined : "4 3"}
                />
                <text x={starts[index] + widths[index] / 2 - 1} y={STRIP_Y + 19} textAnchor="middle" fontSize="10" fontWeight="700" fill={used(index) ? "#ffffff" : g.color}>
                  평균 {g.mean}
                </text>
                <text x={starts[index] + widths[index] / 2 - 1} y={STRIP_Y + STRIP_H + 13} textAnchor="middle" fontSize="10" fontWeight="700" fill={g.color}>
                  {g.name}
                </text>
                <text x={starts[index] + widths[index] / 2 - 1} y={STRIP_Y + STRIP_H + 25} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.75">
                  {g.n}명
                </text>
              </g>
            ))}

            <line x1={ax(0)} x2={ax(AXIS_MAX)} y1={LINE_Y} y2={LINE_Y} stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
            {[0, 10, 15, 20, 30].map((tick) => (
              <g key={tick}>
                <line x1={ax(tick)} x2={ax(tick)} y1={LINE_Y - 4} y2={LINE_Y + 4} stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
                <text x={ax(tick)} y={LINE_Y + 18} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">
                  {tick}
                </text>
              </g>
            ))}

            <circle cx={ax(TRAIN_MEAN)} cy={LINE_Y} r="5" fill="#2563eb" />
            <text x={ax(TRAIN_MEAN)} y={LINE_Y - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#2563eb">
              train 평균 10
            </text>
            {pooled ? (
              <>
                <circle cx={ax(POOLED)} cy={LINE_Y} r="5" fill="#d97706" />
                <text x={ax(POOLED) + 4} y={LINE_Y - 28} textAnchor="start" fontSize="11" fontWeight="700" fill="#d97706">
                  합친 평균 15
                </text>
                <line x1={ax(POOLED)} x2={ax(POOLED)} y1={LINE_Y - 24} y2={LINE_Y - 6} stroke="#d97706" strokeWidth="1" />
              </>
            ) : null}

            <rect x={ax(TEST_VALUE) - 5} y={LINE_Y - 5} width="10" height="10" fill="#059669" />
            <text x={ax(TEST_VALUE)} y={LINE_Y - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#059669">
              test 값 30
            </text>

            {active === 2 ? (
              <g>
                <line x1={ax(TRAIN_MEAN)} x2={ax(TEST_VALUE)} y1={LINE_Y + 34} y2={LINE_Y + 34} stroke="#2563eb" strokeWidth="1.25" />
                <text x={(ax(TRAIN_MEAN) + ax(TEST_VALUE)) / 2} y={LINE_Y + 30} textAnchor="middle" fontSize="10" fontWeight="700" fill="#2563eb">
                  30 − 10 = 20 (원래 절차)
                </text>
                <line x1={ax(POOLED)} x2={ax(TEST_VALUE)} y1={LINE_Y + 52} y2={LINE_Y + 52} stroke="#d97706" strokeWidth="1.25" strokeDasharray="4 3" />
                <text x={(ax(POOLED) + ax(TEST_VALUE)) / 2} y={LINE_Y + 48} textAnchor="middle" fontSize="10" fontWeight="700" fill="#d97706">
                  30 − 15 = 15
                </text>
              </g>
            ) : (
              <text x={W / 2} y={LINE_Y + 44} textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.75">
                지금 빼는 평균: {mean}
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
