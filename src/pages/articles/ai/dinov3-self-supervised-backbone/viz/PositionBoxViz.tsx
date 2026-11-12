import SceneShell from "./SceneShell";

/**
 * 본문 대응: PostHoc.tsx 위치 정보 문단 — 패치 좌표를 [-1, 1] 상자로 정규화,
 * 두 패치의 상대 위치로 attention 편향, 학습 중 상자를 0.5배~2배로 무작위 조정.
 * 512·768 입력은 /16 패치면 한 변 32·48개 → 같은 비율 4·6칸으로 줄여 그린다(가정).
 */
const SIZE = 200; // 좌표 −2 … 2 를 그리는 정사각형
const ORIGIN = 108;
const UNIT = SIZE / 4; // 좌표 1당 px
const px = (v: number) => ORIGIN + v * UNIT;
const py = (v: number) => ORIGIN - v * UNIT;

const SCENES = [
  { label: "넓은 크롭 512", summary: "좌표 상자 [−1, 1]", n: 4, scale: 1, note: "패치마다 상자 안의 좌표를 하나씩 줍니다. 패치 한 변이 16픽셀인 /16 모델이면 512 입력의 한 변은 512 ÷ 16 = 32패치이고, 그림은 4칸으로 줄였습니다(가정)." },
  { label: "넓은 크롭 768", summary: "패치는 늘고 상자는 그대로", n: 6, scale: 1, note: "768 입력은 768 ÷ 16 = 48패치라 격자가 촘촘해지지만 좌표는 여전히 같은 [−1, 1] 상자 안에 있습니다. 그림의 6칸은 32:48 = 4:6 비율만 맞춘 것입니다(가정)." },
  { label: "학습 중 0.5배", summary: "상자 [−0.5, 0.5]", n: 4, scale: 0.5, note: "학습 중에는 상자를 무작위로 줄였다 늘립니다. 0.5배면 좌표가 절반 범위에 모이고 두 패치의 상대 위치도 절반이 됩니다." },
  { label: "학습 중 2배", summary: "상자 [−2, 2]", n: 4, scale: 2, note: "2배면 상대 위치도 두 배가 됩니다. 0.5배와 2배는 범위의 양 끝이고 실제로는 그 사이 값을 고릅니다. 이렇게 학습해 두면 입력 크기가 달라져도 좌표 규칙이 깨지지 않습니다." },
] as const;

const BOX = "#2563eb";
const PATCH = "#0f766e";
const PAIR = "#d97706";
const MUTED = "#94a3b8";

export default function PositionBoxViz() {
  return (
    <SceneShell
      eyebrow="패치 좌표"
      title="입력이 커져도 좌표는 같은 상자 안에 둡니다"
      description="점 하나가 패치 하나의 좌표이고, 파란 상자가 좌표 범위입니다. 주황 화살표는 두 패치의 상대 위치로, attention 편향에 쓰이는 값입니다. 점의 개수는 줄여 그렸고 점을 칸 중심에 둔 배치도 설명을 위한 가정입니다."
      ariaLabel="입력 크기와 학습 중 상자 크기에 따른 패치 좌표 배치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const half = scene.scale;
        const centers = Array.from({ length: scene.n }, (_, i) => (-1 + (2 * i + 1) / scene.n) * half);
        const a = { x: centers[0], y: centers[scene.n - 1] };
        const b = { x: centers[scene.n - 1], y: centers[0] };
        return (
          <svg viewBox="0 0 216 228" className="mx-auto block h-auto w-full max-w-[280px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <defs>
              <marker id="pos-arrow" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={6} markerHeight={6} orient="auto">
                <path d="M0 0 L8 4 L0 8 z" fill={PAIR} />
              </marker>
            </defs>
            {/* 좌표 −2 … 2 바깥틀 */}
            <rect x={px(-2)} y={py(2)} width={SIZE} height={SIZE} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
            {[-2, -1, 0, 1, 2].map((t) => (
              <g key={t}>
                <line x1={px(t)} y1={py(-2)} x2={px(t)} y2={py(-2) + 4} stroke={MUTED} strokeWidth={1} />
                <text x={px(t)} y={py(-2) + 16} textAnchor="middle" fontSize={10} fill={MUTED}>
                  {t}
                </text>
              </g>
            ))}
            <line x1={px(-2)} y1={ORIGIN} x2={px(2)} y2={ORIGIN} stroke={MUTED} strokeWidth={0.5} />
            <line x1={ORIGIN} y1={py(-2)} x2={ORIGIN} y2={py(2)} stroke={MUTED} strokeWidth={0.5} />
            {/* 좌표 상자 */}
            <rect x={px(-half)} y={py(half)} width={2 * half * UNIT} height={2 * half * UNIT} fill={BOX} fillOpacity={0.08} stroke={BOX} strokeWidth={1.25} />
            {centers.map((cx) =>
              centers.map((cy) => <circle key={`${cx}-${cy}`} cx={px(cx)} cy={py(cy)} r={scene.n > 4 ? 3 : 3.5} fill={PATCH} />),
            )}
            <line x1={px(a.x)} y1={py(a.y)} x2={px(b.x)} y2={py(b.y)} stroke={PAIR} strokeWidth={1.25} markerEnd="url(#pos-arrow)" />
          </svg>
        );
      }}
    />
  );
}
