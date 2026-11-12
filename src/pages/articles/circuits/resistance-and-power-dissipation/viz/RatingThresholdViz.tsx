import SceneShell from "./SceneShell";

/**
 * 본문 대응: #rating — 1 kΩ 하나의 열 P=V²/R을 데이터시트의 두 허용 전력(70 °C 기준)과 비교한다.
 * 7.2 V → 7.2²/1000 W = 51.84 mW, 12 V → 144 mW, 100 mW 선 → √(0.10×1000) = 10 V.
 * 곡선은 이상적인 1 kΩ의 계산값이며 실제 사용 가능 여부는 전압 한계·주변 온도·기판 조건이 함께 정한다.
 */
const STANDARD = 100;
const EXTENDED = 125;
const X0 = 44;
const X1 = 362;
const Y0 = 226;
const Y1 = 20;
const VMAX = 13;
const PMAX = 160;
const sx = (v: number) => X0 + (v / VMAX) * (X1 - X0);
const sy = (p: number) => Y0 - (p / PMAX) * (Y0 - Y1);
const CURVE = Array.from({ length: 53 }, (_, i) => i * 0.25)
  .map((v) => `${sx(v).toFixed(1)},${sy(v * v).toFixed(1)}`)
  .join(" ");

const SCENES = [
  {
    label: "두 허용값",
    summary: "표준 100 mW · 확장 125 mW",
    point: null,
    note: "인용한 데이터시트(2026년 4월 개정) 2쪽은 70 °C 기준 전력으로 표준 동작 0.10 W, 확장 동작 0.125 W를 따로 적습니다. 회색 곡선은 이상적인 1 kΩ에 걸린 전압 V와 열 V²/R의 관계입니다.",
  },
  {
    label: "첫 부품 7.2 V",
    summary: "51.84 mW < 100 mW",
    point: { v: 7.2, p: 51.84, text: "7.2 V · 51.84 mW", color: "#2563eb" },
    note: "바꾼 회로의 첫 1 kΩ에는 7.2 V가 걸려 51.84 mW입니다. 표준 0.10 W보다 낮지만, 그 사실만으로 어떤 기판·주변 온도에서도 안전하다고 결론낼 수는 없습니다.",
  },
  {
    label: "12 V 직결",
    summary: "144 mW > 125 mW > 100 mW",
    point: { v: 12, p: 144, text: "12 V · 144 mW", color: "#dc2626" },
    note: "같은 가상 1 kΩ을 갈림길 없이 12 V에 직접 연결하면 12²/1000 = 0.144 W입니다. 표준과 확장 두 선을 모두 넘습니다. 저항값 1 kΩ만으로는 이 판단을 할 수 없습니다.",
  },
  {
    label: "표준선이 만나는 전압",
    summary: "√(0.10 × 1000) = 10 V",
    point: { v: 10, p: 100, text: "10 V · 100 mW", color: "#d97706" },
    note: "표준 0.10 W만으로 역산한 계산 경계는 10 V입니다. 실제 사용 전압은 표의 전압 한계, 주변 온도, 기판의 열 방출 조건도 함께 만족해야 합니다.",
  },
] as const;

export default function RatingThresholdViz() {
  return (
    <SceneShell
      eyebrow="계산한 열과 허용 전력"
      title="1 kΩ에 걸린 전압이 커지면 열은 제곱으로 커집니다"
      description="가로축은 1 kΩ 하나의 양끝 전압, 세로축은 그 부품의 열(mW)입니다. 허용 전력은 부품이 내도 되는 열의 상한으로 표에 적힌 값(정격)입니다."
      ariaLabel="1 킬로옴 저항의 전압별 전력 곡선과 100, 125 밀리와트 허용선"
      scenes={SCENES}
      render={(active) => {
        const point = SCENES[active].point;
        return (
          <svg viewBox="0 0 376 262" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label="전압 대 전력 곡선">
            <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke="#94a3b8" strokeWidth={1} />
            {[0, 2, 4, 6, 8, 10, 12].map((v) => (
              <text key={v} x={sx(v)} y={Y0 + 16} fontSize={14} textAnchor="middle" fill="currentColor">{v}</text>
            ))}
            <text x={X1} y={Y0 + 32} fontSize={14} textAnchor="end" fill="currentColor">양끝 전압 (V)</text>
            {[0, 50, 100, 150].map((p) => (
              <text key={p} x={X0 - 6} y={sy(p) + 4} fontSize={14} textAnchor="end" fill="currentColor">{p}</text>
            ))}
            <text x={X0 - 6} y={Y1 - 6} fontSize={14} textAnchor="end" fill="currentColor">mW</text>
            <line x1={X0} y1={sy(STANDARD)} x2={X1} y2={sy(STANDARD)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="6 4" />
            <line x1={X0} y1={sy(EXTENDED)} x2={X1} y2={sy(EXTENDED)} stroke="#7c3aed" strokeWidth={1.25} strokeDasharray="2 3" />
            <text x={X0 + 6} y={sy(STANDARD) - 6} fontSize={14} fill="#d97706" fontWeight={700}>표준 100 mW</text>
            <text x={X0 + 6} y={sy(EXTENDED) - 6} fontSize={14} fill="#7c3aed" fontWeight={700}>확장 125 mW</text>
            <polyline points={CURVE} fill="none" stroke="#64748b" strokeWidth={1.25} />
            <text x={sx(4)} y={sy(16) - 10} fontSize={14} fill="#64748b">P = V²/1 kΩ</text>
            {point ? (
              <g>
                <line x1={sx(point.v)} y1={Y0} x2={sx(point.v)} y2={sy(point.p)} stroke={point.color} strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={sx(point.v)} cy={sy(point.p)} r={5} fill={point.color} />
                <text x={sx(point.v) - 10} y={sy(point.p) + (point.p > 130 ? 4 : -10)} fontSize={14} textAnchor="end" fill={point.color} fontWeight={700}>{point.text}</text>
              </g>
            ) : null}
          </svg>
        );
      }}
    />
  );
}
