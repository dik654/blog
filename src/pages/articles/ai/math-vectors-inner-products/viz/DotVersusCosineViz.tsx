import { Arrow } from "./PlaneParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dot-product — (3,4)·(4,−3)=0, a·b=10, a·c=−6, 길이 100과 1의 같은 방향 내적 100.
 * 왼쪽 원은 길이를 지우고 방향만 남긴 그림이고, 오른쪽 두 축은 같은 값을 내적과 코사인으로 읽는다.
 */
const SCENES = [
  { label: "직각인 두 벡터", summary: "0 ÷ (5×5) = 0", dot: 0, cos: 0, arrows: [{ name: "u", deg: 53.13, lx: 34, ly: -20 }, { name: "v", deg: -36.87, lx: 12, ly: 30 }], note: "u=(3,4)와 v=(4,−3)은 첫 좌표의 +12와 둘째 좌표의 −12가 상쇄되어 내적이 0입니다. 코사인도 0입니다." },
  { label: "같은 방향", summary: "10 ÷ (2×5) = 1", dot: 10, cos: 1, arrows: [{ name: "a, b", deg: 0, lx: 22, ly: -7 }], note: "a=(2,0)과 b=(5,0)은 길이 2와 5, 내적 10입니다. 길이의 곱 10으로 나누면 코사인은 1입니다." },
  { label: "반대 방향", summary: "−6 ÷ (2×3) = −1", dot: -6, cos: -1, arrows: [{ name: "a", deg: 0, lx: 22, ly: -7 }, { name: "c", deg: 180, lx: -22, ly: -7 }], note: "c=(−3,0)은 a와 정반대입니다. 내적은 −6이고 길이의 곱 6으로 나누면 코사인은 −1입니다." },
  { label: "길이만 키운 경우", summary: "100 ÷ (100×1) = 1", dot: 100, cos: 1, arrows: [{ name: "100, 1", deg: 0, lx: 22, ly: -7 }], note: "길이 100과 길이 1인 같은 방향 벡터의 내적은 100이지만 코사인은 '같은 방향' 장면과 같은 1입니다. 방향의 일치는 이미 최대입니다. 가로로 그린 것은 그림을 위한 선택입니다(가정)." },
] as const;

const CX = 66;
const CY = 86;
const R = 46;
const AX_L = 158;
const AX_R = 348;
const DOT_MIN = -10;
const DOT_MAX = 100;
const xDot = (value: number) => AX_L + ((value - DOT_MIN) / (DOT_MAX - DOT_MIN)) * (AX_R - AX_L);
const xCos = (value: number) => AX_L + ((value + 1) / 2) * (AX_R - AX_L);

export default function DotVersusCosineViz() {
  return (
    <SceneShell
      eyebrow="내적과 코사인"
      title="내적은 길이를 따라 커지고 코사인은 방향만 남깁니다"
      description="코사인 유사도는 두 벡터가 모두 0이 아닐 때 내적을 두 길이의 곱으로 나눈 값입니다. 왼쪽 원은 길이를 지우고 방향만 그린 것입니다."
      ariaLabel="네 벡터 쌍의 방향, 내적, 코사인 값 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={CX} y={18} textAnchor="middle" fontSize={12} fill="#64748b">방향만</text>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#94a3b8" strokeWidth={1} />
            {scene.arrows.map((arrow, index) => {
              const rad = (arrow.deg * Math.PI) / 180;
              const tipX = CX + R * Math.cos(rad);
              const tipY = CY - R * Math.sin(rad);
              const color = index === 0 ? "#2563eb" : "#d97706";
              return (
                <g key={arrow.name}>
                  <Arrow x1={CX} y1={CY} x2={tipX} y2={tipY} color={color} />
                  <text
                    x={CX + arrow.lx}
                    y={CY + arrow.ly}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={700}
                    fill={color}
                  >
                    {arrow.name}
                  </text>
                </g>
              );
            })}
            <text x={AX_L} y={30} fontSize={12} fontWeight={700} fill="#475569">내적 = {scene.dot < 0 ? `−${-scene.dot}` : scene.dot}</text>
            <rect x={Math.min(xDot(0), xDot(scene.dot))} y={40} width={Math.max(Math.abs(xDot(scene.dot) - xDot(0)), 1)} height={12} rx={2} fill="#64748b" />
            <line x1={AX_L} x2={AX_R} y1={56} y2={56} stroke="#94a3b8" strokeWidth={1} />
            <line x1={xDot(0)} x2={xDot(0)} y1={36} y2={60} stroke="#94a3b8" strokeWidth={1} />
            <text x={xDot(0)} y={72} textAnchor="middle" fontSize={11} fill="#64748b">0</text>
            <text x={AX_R} y={72} textAnchor="end" fontSize={11} fill="#64748b">100</text>
            <text x={AX_L} y={106} fontSize={12} fontWeight={700} fill="#2563eb">코사인 = {scene.cos < 0 ? `−${-scene.cos}` : scene.cos}</text>
            <line x1={AX_L} x2={AX_R} y1={126} y2={126} stroke="#94a3b8" strokeWidth={1} />
            {[-1, 0, 1].map((tick) => (
              <g key={tick}>
                <line x1={xCos(tick)} x2={xCos(tick)} y1={121} y2={131} stroke="#94a3b8" strokeWidth={1} />
                <text x={xCos(tick)} y={146} textAnchor="middle" fontSize={11} fill="#64748b">{tick < 0 ? "−1" : tick}</text>
              </g>
            ))}
            <circle cx={xCos(scene.cos)} cy={126} r={5.5} fill="#2563eb" />
          </svg>
        );
      }}
    />
  );
}
