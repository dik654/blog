import SceneShell from "./SceneShell";

/**
 * 본문 대응: #step-size 하강 보조정리. f=x²/2, x=4, L=1, ‖∇f‖²=16.
 * 다음 값 ≤ 8 − η(1−η/2)×16 = 8(1−η)². η=0.5: 0.375×16=6 → 2. η=1: 0.5×16=8 → 0. η=2: 0 → 8. η=3: −1.5×16=−24 → 32.
 */
const SCENES = [
  { label: "η = 0.5", summary: "0.5×0.75×16 = 6 줄어 2", eta: 0.5, note: "빼는 양 η(1−Lη/2)‖∇f‖²이 양수이므로 점수 8보다 낮은 상한이 나옵니다." },
  { label: "η = 1/L = 1", summary: "1×0.5×16 = 8 줄어 0", eta: 1, note: "곡선의 바닥입니다. 감소량이 ‖∇f‖²/(2L)=16/2=8로 정리됩니다." },
  { label: "η = 2/L = 2", summary: "2×0×16 = 0 → 8 그대로", eta: 2, note: "괄호 1−Lη/2가 0이 되어 보장되는 감소가 사라집니다. 여기가 0<η<2/L의 오른쪽 끝입니다." },
  { label: "η = 3", summary: "3×(−0.5)×16 = −24 → 32", eta: 3, note: "괄호가 음수가 되어 '빼는 양'이 오히려 더해집니다. 상한이 현재 점수 8보다 높아 감소를 보장하지 못합니다." },
] as const;

const LEFT = 30;
const BASE_Y = 164;
const X_SCALE = 96;
const Y_SCALE = 4;
const ETA_MAX = 3.2;
const sx = (eta: number) => LEFT + eta * X_SCALE;
const sy = (value: number) => BASE_Y - value * Y_SCALE;
const bound = (eta: number) => 8 * (1 - eta) ** 2;
const CURVE = Array.from({ length: 65 }, (_, index) => (index / 64) * ETA_MAX)
  .filter((eta) => bound(eta) <= 38)
  .map((eta) => `${sx(eta).toFixed(1)},${sy(bound(eta)).toFixed(1)}`)
  .join(" ");
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";

export default function DescentBoundViz() {
  return (
    <SceneShell
      eyebrow="보폭과 보장되는 감소"
      title="다음 점수의 상한은 η=1/L에서 가장 낮고 η=2/L을 넘으면 지금보다 높아집니다"
      description="f=x²/2, x=4, L=1, ‖∇f‖²=16으로 넣은 값이고 세로축은 다음 점수의 상한입니다. L은 기울기 변화의 상한이며, 경로 전체에 같은 L을 쓸 수 있다는 전제입니다."
      ariaLabel="보폭 η에 따른 다음 점수의 상한과 현재 점수 8의 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const value = bound(scene.eta);
        return (
          <svg viewBox="0 0 360 192" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={sx(0)} y={sy(8)} width={sx(2) - sx(0)} height={BASE_Y - sy(8)} fill={BLUE} opacity={0.07} />
            <line x1={LEFT} x2={sx(ETA_MAX)} y1={sy(8)} y2={sy(8)} stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
            <text x={sx(ETA_MAX)} y={sy(8) - 6} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>현재 점수 8</text>
            <text x={sx(1)} y={sy(8) - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>감소 보장 구간</text>
            <line x1={LEFT} x2={sx(ETA_MAX)} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            <line x1={LEFT} x2={LEFT} y1={sy(38)} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            <polyline points={CURVE} fill="none" stroke={GRAY} strokeWidth={1.25} />
            {[0, 8, 32].map((tick) => (
              <text key={tick} x={LEFT - 6} y={sy(tick) + 4} textAnchor="end" fontSize={11} fill={GRAY}>{tick}</text>
            ))}
            {[0, 0.5, 1, 2, 3].map((tick) => (
              <text key={tick} x={sx(tick)} y={BASE_Y + 15} textAnchor="middle" fontSize={11} fill={GRAY}>{tick}</text>
            ))}
            <text x={sx(ETA_MAX)} y={BASE_Y + 15} textAnchor="end" fontSize={11} fill={GRAY}>η</text>
            <line x1={sx(scene.eta)} x2={sx(scene.eta)} y1={sy(value)} y2={BASE_Y} stroke={BLUE} strokeWidth={1} strokeDasharray="2 3" />
            <circle cx={sx(scene.eta)} cy={sy(value)} r={5} fill={BLUE} />
            <text x={sx(scene.eta) + (scene.eta === 3 ? -9 : 9)} y={sy(value) + (scene.eta === 3 ? 4 : scene.eta === 2 ? 17 : -9)} textAnchor={scene.eta === 3 ? "end" : "start"} fontSize={12} fontWeight={700} fill={BLUE}>상한 {value}</text>
          </svg>
        );
      }}
    />
  );
}
