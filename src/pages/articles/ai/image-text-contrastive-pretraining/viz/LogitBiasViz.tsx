import SceneShell from "./SceneShell";

/**
 * 본문 대응: SigmoidLoss.tsx #logit-bias — 편향은 모든 로짓에 같은 값을 더해 순서는 그대로 두고 판정선만 옮긴다.
 * 한 행을 양성 1칸 + 음성 9칸으로 줄였다(본문 예시는 1,024칸). 로짓 값과 b = −2는 설명용 가정이다.
 * 판정선: 로짓 0 (시그모이드 0.5). 편향 전 음성 중 0보다 큰 칸 = 0.1, 0.2, 0.5, 0.7 → 4개.
 * b = −2 뒤 음성 최댓값 0.7 − 2 = −1.3 < 0 → 9개 모두 '아니다' 쪽.
 */
const POSITIVE = 0.4;
const NEGATIVES = [-0.8, -0.6, -0.5, -0.3, -0.1, 0.1, 0.2, 0.5, 0.7] as const;
const BIAS = -2;

const SCENES = [
  {
    label: "편향 없음 · 판정선 0",
    summary: "음성 9칸 중 4칸이 '짝' 쪽",
    b: 0,
    note: "로짓이 0보다 크면 시그모이드가 0.5를 넘어 '짝'으로 판정됩니다. 0 근처에 섞인 음성 여럿이 틀린 쪽에 있습니다.",
  },
  {
    label: "모든 로짓에 b 더하기",
    summary: "10칸 모두 2만큼 왼쪽",
    b: BIAS,
    note: "편향은 모든 칸에 같은 값을 더합니다. 점 사이 간격과 순서는 그대로이고 판정선에 대한 위치만 함께 옮겨집니다.",
  },
  {
    label: "'웬만하면 아니다'가 기본값",
    summary: "음성 9칸 모두 '아니다' 쪽",
    b: BIAS,
    note: "음수 편향 아래에서는 음성 칸이 처음부터 판정선 아래입니다. 초록 짝 칸도 지금은 아래에 있어, 표현은 음성을 밀어내는 대신 이 칸을 끌어올리는 쪽을 배우면 됩니다. 음성이 대부분이라는 사실은 상수 하나가 맡습니다.",
  },
] as const;

const POS = "#10b981";
const NEG = "#6366f1";
const LINE = "#f59e0b";
const MUTED = "#94a3b8";
const MIN = -3;
const MAX = 1.2;
const x = (v: number) => 16 + ((v - MIN) / (MAX - MIN)) * 308;

export default function LogitBiasViz() {
  return (
    <SceneShell
      eyebrow="학습되는 편향"
      title="편향은 점들의 순서를 두고 판정선만 옮깁니다"
      description="가로축은 한 칸의 로짓 t·s + b입니다. 초록 점이 양성(짝) 1칸, 보라 점이 음성 9칸이며 본문 예시의 1,024칸을 10칸으로 줄였습니다. 로짓 값과 b = −2는 설명용 가정입니다."
      note="실제 학습에서 편향의 초기값과 이후 궤적은 이 그림의 숫자와 다를 수 있습니다."
      ariaLabel="로짓 수직선 위에서 편향이 모든 점을 같은 거리만큼 옮기는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const wrong = NEGATIVES.filter((v) => v + scene.b > 0).length;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 340 172" className="mx-auto w-full max-w-md" role="img" aria-label={`편향 ${scene.b}, 판정선 위 음성 ${wrong}칸`}>
              <rect x={x(0)} y={20} width={x(MAX) - x(0)} height={110} fill={POS} fillOpacity={0.06} />
              <text x={x(0) + 5} y={34} fontSize={11} fill={POS} fontWeight={700}>
                &apos;짝&apos; 판정
              </text>
              <text x={x(0) - 5} y={34} fontSize={11} fill={MUTED} fontWeight={700} textAnchor="end">
                &apos;아니다&apos; 판정
              </text>
              <text x={16} y={34} fontSize={11} fontWeight={700} fill={scene.b === 0 ? MUTED : POS}>
                b = {scene.b === 0 ? "0" : "−2"}
              </text>
              <line x1={x(0)} y1={20} x2={x(0)} y2={130} stroke={LINE} strokeWidth={1.25} />
              <line x1={x(MIN)} y1={130} x2={x(MAX)} y2={130} stroke={MUTED} strokeWidth={1} />
              {[-3, -2, -1, 0, 1].map((v) => (
                <g key={v}>
                  <line x1={x(v)} y1={130} x2={x(v)} y2={135} stroke={MUTED} strokeWidth={1} />
                  <text x={x(v)} y={149} fontSize={11} fill={MUTED} textAnchor="middle">
                    {v}
                  </text>
                </g>
              ))}
              <text x={x(-0.9)} y={167} fontSize={11} fill={LINE} textAnchor="middle">
                판정선 · 로짓 0 = 시그모이드 0.5
              </text>
              {scene.b !== 0 && (
                <g opacity={0.35}>
                  <circle cx={x(POSITIVE)} cy={62} r={6} fill="none" stroke={POS} strokeWidth={1} strokeDasharray="2 2" />
                  {NEGATIVES.map((v, i) => (
                    <circle key={i} cx={x(v)} cy={100 - (i % 2) * 14} r={5} fill="none" stroke={NEG} strokeWidth={1} strokeDasharray="2 2" />
                  ))}
                </g>
              )}
              {active === 1 && (
                <g>
                  <line x1={x(POSITIVE) - 7} y1={62} x2={x(POSITIVE + BIAS) + 7} y2={62} stroke={POS} strokeWidth={1} />
                  <text x={x(POSITIVE + BIAS) - 10} y={66} fontSize={11} fill={POS} textAnchor="end">
                    + b (−2)
                  </text>
                </g>
              )}
              <circle cx={x(POSITIVE + scene.b)} cy={62} r={6} fill={POS} />
              {NEGATIVES.map((v, i) => {
                const pos = v + scene.b;
                return <circle key={i} cx={x(pos)} cy={100 - (i % 2) * 14} r={5} fill={NEG} stroke={pos > 0 ? "#ef4444" : NEG} strokeWidth={pos > 0 ? 1.25 : 1} />;
              })}
            </svg>
          </div>
        );
      }}
    />
  );
}
