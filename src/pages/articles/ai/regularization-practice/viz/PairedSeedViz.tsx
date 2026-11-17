import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ablation — Δs = M_reg − M_base를 같은 seed끼리 만들고 평균합니다.
 * 세 seed의 점수는 모두 가정(높을수록 좋은 validation metric, 단위 .01):
 * base 70·76·73, reg 72·78·74 → Δ 2·2·1, 평균 5/3 ≈ 1.7 → .017.
 * Seed 사이 baseline 흔들림은 76−70 = 6 → .06.
 */
const BASE: readonly number[] = [70, 76, 73];
const REG: readonly number[] = [72, 78, 74];
const DELTA = BASE.map((value, index) => REG[index] - value);
const DELTA_SUM = DELTA.reduce<number>((sum, value) => sum + value, 0);
const MEAN = DELTA_SUM / DELTA.length;
const SPREAD = Math.max(...BASE) - Math.min(...BASE);

const pct = (hundredths: number) => `.${String(Math.round(hundredths)).padStart(2, "0")}`;
const signed = (hundredths: number) => `+${pct(hundredths)}`;
const meanText = `+.0${Math.round(MEAN * 10)}`;

const MIN = 68;
const MAX = 80;
const LEFT = 64;
const RIGHT = 292;
const px = (value: number) => LEFT + ((value - MIN) / (MAX - MIN)) * (RIGHT - LEFT);
const ROW_Y: readonly number[] = [44, 84, 124];
const TICKS: readonly number[] = [68, 70, 72, 74, 76, 78, 80];

const SCENES = [
  { label: "Baseline만 보면", summary: `seed마다 ${pct(SPREAD)}까지 흔들림`, note: `Regularizer 없이도 seed(초기값·data 순서)만 바꾸면 점수가 ${pct(BASE[0])}·${pct(BASE[1])}·${pct(BASE[2])}로 ${pct(SPREAD)}까지 달라집니다.` },
  { label: "같은 seed끼리 짝", summary: "base ○ — reg ●", note: `같은 seed로 regularized run을 돌려 짝을 짓습니다. 점만 섞어 놓으면 seed 2의 baseline ${pct(BASE[1])}이 seed 1의 regularized ${pct(REG[0])}보다 높아 효과가 흔들림에 묻힙니다.` },
  { label: "차이만 남기기", summary: `Δ̄ = (${DELTA.map(pct).join("+")})/${DELTA.length} ≈ ${meanText}`, note: `짝마다 빼면 Δ는 ${DELTA.map(signed).join(", ")}로 모두 같은 방향입니다. Seed가 같이 만든 흔들림은 뺄셈에서 덜 섞이고, 평균 Δ̄는 약 ${meanText}입니다. 이 평균만으로 채택하지 않고 train fit·worst slice·calibration·cost를 함께 봅니다.` },
] as const;

export default function PairedSeedViz() {
  return (
    <SceneShell
      eyebrow="Paired seed 비교 · S=3 (가정)"
      title="같은 seed끼리 빼면 seed가 만든 흔들림이 덜 섞입니다"
      description="한 줄이 한 seed입니다. 가로축은 높을수록 좋은 validation 점수이고, 빈 원은 baseline, 채운 원은 regularizer 하나만 바꾼 run입니다."
      note="세 seed의 점수는 모두 설명용 가정입니다."
      ariaLabel="세 seed에서 baseline과 regularized run의 점수를 짝지어 차이와 평균을 구하는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {TICKS.map((tick) => (
            <g key={tick}>
              <line x1={px(tick)} x2={px(tick)} y1={24} y2={146} stroke="#e2e8f0" strokeWidth={1} />
              <text x={px(tick)} y={162} textAnchor="middle" fontSize={12} fill="#64748b">{pct(tick)}</text>
            </g>
          ))}
          <text x={RIGHT} y={180} textAnchor="end" fontSize={12} fill="#64748b">validation 점수 →</text>
          {active === 0 && (
            <g>
              <line x1={px(Math.min(...BASE))} x2={px(Math.max(...BASE))} y1={150 - 4} y2={150 - 4} stroke="#d97706" strokeWidth={1.25} />
              <text x={(px(Math.min(...BASE)) + px(Math.max(...BASE))) / 2} y={192} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">흔들림 {pct(SPREAD)}</text>
            </g>
          )}
          {BASE.map((base, index) => {
            const reg = REG[index];
            const y = ROW_Y[index];
            return (
              <g key={index}>
                <text x={8} y={y + 4} fontSize={13} fontWeight={700} fill="#334155">seed {index + 1}</text>
                {active >= 1 && <line x1={px(base)} x2={px(reg)} y1={y} y2={y} stroke="#2563eb" strokeWidth={1.25} />}
                <circle cx={px(base)} cy={y} r={6} fill="#ffffff" stroke="#475569" strokeWidth={1.25} />
                {active >= 1 && <circle cx={px(reg)} cy={y} r={6} fill="#2563eb" />}
                {active >= 2 && (
                  <text x={px(Math.max(...REG)) + 14} y={y + 4} fontSize={13} fontWeight={700} fill="#15803d">Δ {signed(DELTA[index])}</text>
                )}
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
