import SceneShell from "./SceneShell";

/**
 * 본문 대응: #step-size — f(x)=x²/2, x₀=4에서 거리 배율 |1−η|. 표의 값에 η=0을 더했습니다.
 * 왼쪽 팔(1−η>0)은 같은 쪽, 오른쪽 팔(1−η<0)은 좌우 번갈아. 0<η<2가 |1−η|<1인 구간입니다.
 */
const SCENES = [
  { label: "η = 0", summary: "|1−η| = 1 · 제자리", eta: 0, note: "기울기에 0을 곱하니 위치가 그대로입니다. 줄지도 늘지도 않습니다." },
  { label: "η = 0.5", summary: "|1−η| = 0.5 · 같은 쪽 수축", eta: 0.5, note: "배율이 양수라 부호가 그대로이고 거리가 절반씩 줄어듭니다." },
  { label: "η = 1", summary: "|1−η| = 0 · 한 번에 0", eta: 1, note: "배율이 0이라 첫 이동에 위치 0으로 갑니다. 이 함수의 경우입니다." },
  { label: "η = 1.5", summary: "|1−η| = 0.5 · 좌우 오가며 수축", eta: 1.5, note: "배율이 −0.5라 좌우를 번갈아 가지만 거리는 절반씩 줄어듭니다. 번갈아 간다고 실패는 아닙니다." },
  { label: "η = 2", summary: "|1−η| = 1 · 같은 거리 왕복", eta: 2, note: "구간의 오른쪽 끝입니다. 배율이 −1이라 4와 −4를 오가며 거리가 그대로입니다." },
  { label: "η = 3", summary: "|1−η| = 2 · 좌우 오가며 확대", eta: 3, note: "점선 위로 올라왔습니다. 배율이 −2라 부호를 바꾸며 거리가 두 배씩 커집니다." },
] as const;

const LEFT = 30;
const BASE_Y = 160;
const X_SCALE = 96;
const Y_SCALE = 62;
const ETA_MAX = 3.2;
const sx = (eta: number) => LEFT + eta * X_SCALE;
const sy = (value: number) => BASE_Y - value * Y_SCALE;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";

export default function StepFactorViz() {
  return (
    <SceneShell
      eyebrow="수렴을 가르는 문턱"
      title="거리 배율이 1 아래로 내려오는 구간에서만 0으로 다가갑니다"
      description="f(x)=x²/2, x₀=4의 경우입니다. 가로축은 보폭 η, 세로축은 한 번 이동한 뒤의 거리 배율 |1−η|입니다."
      ariaLabel="보폭 η에 따른 거리 배율과 수렴 구간"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const value = Math.abs(1 - scene.eta);
        return (
          <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={sx(0)} y={sy(2.2)} width={sx(2) - sx(0)} height={BASE_Y - sy(2.2)} fill={BLUE} opacity={0.07} />
            <text x={sx(1)} y={sy(2.2) + 14} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>0&lt;η&lt;2: 거리가 줄어드는 구간</text>
            <line x1={LEFT} x2={sx(ETA_MAX)} y1={sy(1)} y2={sy(1)} stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
            <text x={LEFT - 6} y={sy(1) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>1</text>
            <line x1={LEFT} x2={sx(ETA_MAX)} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            <line x1={LEFT} x2={LEFT} y1={sy(2.2)} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            <polyline points={`${sx(0)},${sy(1)} ${sx(1)},${sy(0)} ${sx(ETA_MAX)},${sy(ETA_MAX - 1)}`} fill="none" stroke={GRAY} strokeWidth={1.25} />
            <text x={sx(0.1)} y={sy(0.3)} fontSize={11} fill={GRAY}>같은 쪽</text>
            <text x={sx(1.72)} y={sy(0.42)} fontSize={11} fill={GRAY}>좌우 번갈아</text>
            {[0, 0.5, 1, 1.5, 2, 3].map((tick) => (
              <text key={tick} x={sx(tick)} y={BASE_Y + 15} textAnchor="middle" fontSize={11} fill={GRAY}>{tick}</text>
            ))}
            <text x={sx(ETA_MAX)} y={BASE_Y + 15} textAnchor="end" fontSize={11} fill={GRAY}>η</text>
            <line x1={sx(scene.eta)} x2={sx(scene.eta)} y1={sy(value)} y2={BASE_Y} stroke={BLUE} strokeWidth={1} strokeDasharray="2 3" />
            <circle cx={sx(scene.eta)} cy={sy(value)} r={5} fill={BLUE} />
          </svg>
        );
      }}
    />
  );
}
