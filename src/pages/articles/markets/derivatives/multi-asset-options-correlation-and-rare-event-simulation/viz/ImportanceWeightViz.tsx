import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names 둘째 문단(중요도 표본추출), #mechanism 둘째 문단(가중치 누락 편향), #comparison(잘못 고른 표본 분포).
 * (가정) 손실 크기를 표준정규분포로 두고, 기준선 t=3.719는 원래 분포에서 넘을 확률이 0.01%인 위치.
 * 옮긴 분포 N(t,1) → 적중 비율 50%. 적중의 평균 무게 = 0.0001 ÷ 0.5 = 0.0002, 50%×0.0002 = 0.01%.
 * 무게를 빼면 50% ÷ 0.01% = 5,000배 과대.
 * 잘못 고른 분포 N(6, 0.6²): 기준선 바로 옆(3.8)에서 원래 높이 φ(3.8)≈2.9e−4, 바꾼 높이 ≈8.0e−4 → 무게 ≈0.36.
 * 이 분포의 표본 하나당 분산 ≈2.4e−5로 N(t,1)의 ≈4.2e−8보다 수백 배 크지만, 바꾸지 않은 경우(≈1e−4)보다는 작다.
 * 그래서 장면 문구는 "옮긴 분포보다 크게 흔들림"으로 쓰고, "원래보다 커짐"은 9절의 일반 경고로만 둔다.
 */
const T = 3.719;
const BAD_MEAN = 6;
const BAD_SD = 0.6;
const phi = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
const original = (v: number) => phi(v);
const shifted = (v: number) => phi(v - T);
const bad = (v: number) => phi((v - BAD_MEAN) / BAD_SD) / BAD_SD;

const SCENES = [
  { label: "원래 분포로 뽑으면", summary: "기준선 너머 0.01% · 10만 개 중 약 10개", curve: "original", note: "(가정) 손실 크기의 분포를 회색 종 모양으로 둡니다. 빨간 기준선 오른쪽이 관심 있는 희귀 손실인데, 면적이 0.01%라 그림에서 보이지도 않습니다. 5절처럼 10만 번 뽑아도 열 번 정도만 들어옵니다." },
  { label: "희귀 구간 쪽으로 옮겨 뽑기", summary: "옮긴 분포에서는 절반이 적중 (가정)", curve: "shifted", note: "표본을 뽑는 분포를 기준선 위치로 옮기면(가정) 뽑은 경로의 절반이 기준선을 넘습니다. 희귀 경로를 훨씬 자주 보지만, 이 비율 50%는 원래 확률이 아닙니다." },
  { label: "적중마다 무게를 곱합니다", summary: "평균 무게 0.01% ÷ 50% = 0.0002", curve: "shifted", note: "가능도 비율은 그 경로가 원래 분포에서 나올 가능성을 옮긴 분포에서 나올 가능성으로 나눈 값입니다. 기준선 너머에서는 회색 높이가 파란 높이보다 훨씬 낮아 무게가 아주 작고, 적중 50%에 평균 무게 0.0002를 곱하면 0.01%로 돌아옵니다." },
  { label: "무게를 빠뜨리면", summary: "50% ÷ 0.01% = 5,000배 과대", curve: "shifted", note: "분포를 바꾼 뒤 가능도 가중치를 빼먹으면 적중 비율 50%를 그대로 확률로 읽게 됩니다. 적중이 많아 표준오차는 작게 나오므로 정밀해 보이지만 원래 0.01%보다 5,000배 큰 편향값입니다." },
  { label: "잘못 고른 분포", summary: "기준선 옆 경로에 거대한 무게", curve: "bad", note: "(가정) 표본 분포를 너무 멀리 옮기면 기준선 바로 옆의 희귀 경로는 거의 뽑히지 않고, 어쩌다 뽑히면 무게가 다른 적중보다 훨씬 커집니다. 이런 경로 몇 개가 결과를 흔들어, 기준선으로 옮긴 분포보다 추정이 크게 흔들립니다. 더 나쁘게 고르면 분포를 바꾸지 않았을 때보다 분산이 오히려 커질 수도 있습니다." },
] as const;

const W = 360;
const H = 200;
const LEFT = 12;
const RIGHT = 12;
const BOTTOM = 166;
const TOP = 22;
const V_MIN = -3.5;
const V_MAX = 8;
const Y_MAX = 0.7;
const x = (v: number) => LEFT + ((v - V_MIN) / (V_MAX - V_MIN)) * (W - LEFT - RIGHT);
const y = (d: number) => BOTTOM - (d / Y_MAX) * (BOTTOM - TOP);
const GRID = Array.from({ length: 116 }, (_, i) => V_MIN + i * 0.1);
const line = (f: (v: number) => number) => GRID.map((v) => `${x(v)},${y(f(v))}`).join(" ");
const tailArea = (f: (v: number) => number) => {
  const pts = GRID.filter((v) => v >= T);
  return `M ${x(T)} ${BOTTOM} L ${x(T)} ${y(f(T))} ${pts.map((v) => `L ${x(v)} ${y(f(v))}`).join(" ")} L ${x(V_MAX)} ${BOTTOM} Z`;
};
const ORIGINAL_LINE = line(original);
const SHIFTED_LINE = line(shifted);
const BAD_LINE = line(bad);
const SHIFTED_TAIL = tailArea(shifted);
const BAD_TAIL = tailArea(bad);
const PROBE = 3.8;

export default function ImportanceWeightViz() {
  return (
    <SceneShell
      eyebrow="중요도 표본추출"
      title="희귀 경로를 자주 뽑고, 무게로 원래 확률을 되돌립니다"
      description="가로는 손실 크기(오른쪽일수록 큼), 세로는 그 크기가 뽑힐 상대적 가능성입니다. 분포 모양과 위치는 설명용 가정이며, 빨간 선은 원래 분포에서 넘을 확률이 0.01%인 기준선입니다."
      ariaLabel="원래 분포, 기준선으로 옮긴 분포, 잘못 옮긴 분포에서 적중 비율과 가능도 가중치를 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showShifted = scene.curve === "shifted";
        const showBad = scene.curve === "bad";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={LEFT} x2={W - RIGHT} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            {showShifted && <path d={SHIFTED_TAIL} fill="#2563eb" opacity={0.15} />}
            {showBad && <path d={BAD_TAIL} fill="#d97706" opacity={0.15} />}
            <polyline points={ORIGINAL_LINE} fill="none" stroke="#64748b" strokeWidth={1.25} />
            <text x={x(0)} y={y(original(0)) - 6} textAnchor="middle" fontSize={11} fill="#64748b">원래 분포</text>
            {showShifted && (
              <>
                <polyline points={SHIFTED_LINE} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                <text x={x(T + 1.6)} y={y(shifted(T)) - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">옮긴 분포</text>
                <text x={x(T + 2.6)} y={BOTTOM - 30} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">적중 50%</text>
              </>
            )}
            {showBad && (
              <>
                <polyline points={BAD_LINE} fill="none" stroke="#d97706" strokeWidth={1.25} />
                <text x={x(BAD_MEAN)} y={y(bad(BAD_MEAN)) - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">너무 멀리 옮긴 분포</text>
                <circle cx={x(PROBE)} cy={BOTTOM - 4} r={4} fill="#d97706" />
                <text x={x(PROBE)} y={BOTTOM + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">거의 안 뽑힘 → 무게 큼</text>
              </>
            )}
            {active === 2 && (
              <g>
                <line x1={x(4.2)} x2={x(4.2)} y1={BOTTOM} y2={y(shifted(4.2))} stroke="#2563eb" strokeWidth={1} strokeDasharray="2 2" />
                <circle cx={x(4.2)} cy={y(shifted(4.2))} r={3.5} fill="#2563eb" />
                <circle cx={x(4.2)} cy={BOTTOM} r={3.5} fill="#64748b" />
                <text x={x(T) - 8} y={52} textAnchor="end" fontSize={10} fill="#334155">무게 = 회색 높이 ÷ 파란 높이</text>
                <text x={x(T) - 8} y={66} textAnchor="end" fontSize={10} fill="#334155">기준선 너머 회색은 거의 0</text>
              </g>
            )}
            {active === 3 && (
              <text x={x(T) + 8} y={TOP + 2} fontSize={11} fontWeight={700} fill="#dc2626">무게 없이 읽으면 50%</text>
            )}
            <line x1={x(T)} x2={x(T)} y1={TOP - 8} y2={BOTTOM} stroke="#dc2626" strokeWidth={1.25} />
            <text x={x(T) - 4} y={TOP - 10 + 8} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">기준선</text>
            <text x={LEFT} y={BOTTOM + 18} fontSize={11} fill="#64748b">작은 손실</text>
            <text x={W - RIGHT} y={BOTTOM + 18} textAnchor="end" fontSize={11} fill="#64748b">큰 손실 →</text>
          </svg>
        );
      }}
    />
  );
}
