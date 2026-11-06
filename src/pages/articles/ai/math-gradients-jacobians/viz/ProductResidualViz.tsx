import SceneShell from "./SceneShell";

/**
 * 본문 대응: #jacobian — 곱 xy를 직사각형 넓이로 그립니다.
 * 3×0.01=+0.03, 2×(−0.02)=−0.04, 합 −0.01 → 5.99. 실제 2.01×2.98=5.9898.
 * 남는 −0.0002 = 0.01×(−0.02).
 */
const SCENES = [
  { label: "처음 넓이", summary: "2 × 3 = 6", note: "곱 xy는 가로 x, 세로 y인 직사각형의 넓이로 볼 수 있습니다. 현재 위치 (2,3)의 넓이는 6입니다." },
  { label: "x만 +0.01", summary: "3 × 0.01 = +0.03", note: "y를 3으로 고정하고 x만 늘리면 오른쪽에 세로 3짜리 띠가 붙습니다. 이것이 표의 둘째 행 첫 칸이 만든 기여입니다." },
  { label: "y만 −0.02", summary: "2 × (−0.02) = −0.04", note: "x를 2로 고정하고 y만 줄이면 위쪽에서 가로 2짜리 띠가 빠집니다. 이것이 둘째 행 둘째 칸의 기여입니다." },
  { label: "두 띠의 어긋남", summary: "−0.01 − 0.0002 = −0.0102", note: "오른쪽 띠는 세로 3으로 계산했지만 실제 세로는 2.98입니다. 모서리 0.01×0.02만큼을 더 얹어 센 셈이고, 이 ΔxΔy=−0.0002가 예측 5.99와 실제 5.9898의 차이입니다." },
] as const;

const LEFT = 56;
const BOTTOM = 222;
const WIDTH = 110;
const HEIGHT = 165;
const GROW = 36;
const DROP = 30;
const TOP = BOTTOM - HEIGHT;
const RIGHT = LEFT + WIDTH;

function Drawing({ index }: { index: number }) {
  const showRight = index === 1 || index === 3;
  const showTop = index === 2 || index === 3;
  const showCorner = index === 3;
  return (
    <svg viewBox="0 0 330 262" className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={SCENES[index].label}>
      <rect x={LEFT} y={TOP} width={WIDTH} height={HEIGHT} fill="#dbeafe" stroke="#2563eb" strokeWidth="1" />
      <text x={LEFT + WIDTH / 2} y={BOTTOM - 60} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e3a8a">넓이 6</text>
      {showRight ? <rect x={RIGHT} y={showCorner ? TOP + DROP : TOP} width={GROW} height={showCorner ? HEIGHT - DROP : HEIGHT} fill="#bbf7d0" stroke="#16a34a" strokeWidth="1" /> : null}
      {showTop ? <rect x={LEFT} y={TOP} width={WIDTH} height={DROP} fill="#fecaca" stroke="#dc2626" strokeWidth="1" strokeDasharray="4 3" /> : null}
      {showCorner ? <rect x={RIGHT} y={TOP} width={GROW} height={DROP} fill="#fde68a" stroke="#d97706" strokeWidth="1" strokeDasharray="2 2" /> : null}
      {showRight ? <text x={RIGHT + GROW + 6} y={BOTTOM - 70} fontSize="12" fontWeight="700" fill="#15803d">+0.03</text> : null}
      {showCorner ? <text x={RIGHT + GROW + 6} y={BOTTOM - 56} fontSize="11" fontWeight="700" fill="#15803d">모서리 포함</text> : null}
      {showTop ? <text x={LEFT + WIDTH / 2} y={TOP + 19} textAnchor="middle" fontSize="12" fontWeight="700" fill="#b91c1c">−0.04</text> : null}
      {showCorner ? <text x={RIGHT + GROW + 6} y={TOP + 12} fontSize="11" fontWeight="700" fill="#b45309">모서리</text> : null}
      {showCorner ? <text x={RIGHT + GROW + 6} y={TOP + 26} fontSize="11" fontWeight="700" fill="#b45309">0.0002</text> : null}
      <text x={LEFT + WIDTH / 2} y={BOTTOM + 18} textAnchor="middle" fontSize="12" fill="currentColor">x = 2</text>
      {showRight ? <text x={RIGHT + GROW / 2} y={BOTTOM + 18} textAnchor="middle" fontSize="11" fill="currentColor">+0.01</text> : null}
      <text x={LEFT - 8} y={TOP + HEIGHT / 2 + 20} textAnchor="end" fontSize="12" fill="currentColor">y = 3</text>
      {showTop ? <text x={LEFT - 8} y={TOP + 19} textAnchor="end" fontSize="11" fill="currentColor">−0.02</text> : null}
    </svg>
  );
}

export default function ProductResidualViz() {
  return (
    <SceneShell
      eyebrow="곱의 나머지"
      title="−0.0002는 두 띠가 어긋난 모서리입니다"
      description="곱 xy를 직사각형 넓이로 그렸습니다. 작은 변화가 보이도록 띠 두께를 크게 과장했으므로 눈금으로 재면 안 됩니다."
      ariaLabel="곱의 변화량을 직사각형의 띠로 나누어 나머지를 찾는 과정"
      scenes={SCENES}
      render={(index) => <Drawing index={index} />}
    />
  );
}
