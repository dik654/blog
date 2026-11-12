import SceneShell from "./SceneShell";

/**
 * 본문 대응: #numerical — 2⁻ᵏ의 k를 가로축에 놓고 이 실행 환경(CPython 3.9.6 float)의 경계를 표시한다.
 * 0.5**3 → k=3, 정규 최솟값 2⁻¹⁰²², 가장 작은 양수 2⁻¹⁰⁷⁴, 0.5**2000 → k=2000은 경계 밖이라 0.0.
 * 로그 기록: 2000·ln0.5 ≈ −1386.294361, 2001·ln0.5 ≈ −1386.987508, 차이 ≈ 0.693147(=ln2).
 */
const SCENES = [
  { label: "세 번 절반", summary: "0.5 ** 3 = 2⁻³ = 0.125", note: "가로축은 값 자체가 아니라 2⁻ᵏ에서 절반으로 줄인 횟수 k입니다. k=3인 0.125는 다음 장면에서 표시할 표현 경계(k=1022·1074)보다 훨씬 왼쪽이라 float(컴퓨터가 실수를 저장하는 형식)로 그대로 표현됩니다." },
  { label: "표현 경계", summary: "2⁻¹⁰²² · 2⁻¹⁰⁷⁴", note: "sys.float_info.min은 정규 최솟값 k=1022입니다. 더 작은 비정규 값까지 포함한 가장 작은 양수는 k=1074(math.ulp(0.0))이고, 그보다 오른쪽은 담을 수 없습니다." },
  { label: "2000번 절반", summary: "0.5 ** 2000 → 0.0", note: "2⁻²⁰⁰⁰은 수학적으로 양수지만 k=2000은 경계 1074보다 한참 오른쪽이라 직접 계산하면 0으로 반올림됩니다(언더플로). 0이 된 뒤 math.log를 적용하면 ValueError가 납니다." },
  { label: "로그로 기록", summary: "−1386.294361 · −1386.987508", note: "먼저 로그로 바꾸어 더하면 2000번과 2001번이 평범한 크기의 두 수로 남아 구별됩니다. math.exp로 원래 확률에 되돌리면 다시 0.0입니다." },
] as const;

const W = 320;
const X0 = 14;
const X1 = 306;
const K_MAX = 2100;
const AXIS_Y = 74;
const kx = (k: number) => X0 + (k / K_MAX) * (X1 - X0);
const ACCENT = "#2563eb";
const WARN = "#dc2626";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

export default function UnderflowLineViz() {
  return (
    <SceneShell
      eyebrow="표현할 수 있는 작은 양"
      title="2000번 절반은 표현 경계 밖으로 나가지만 로그 기록은 남습니다"
      description="가로축은 2⁻ᵏ의 k, 즉 절반으로 줄인 횟수입니다. 경계값은 본문이 기록한 로컬 CPython 3.9.6 실행 환경의 것입니다."
      ariaLabel="절반으로 줄인 횟수 축 위의 float 표현 경계와 2000번 곱의 언더플로, 로그 기록"
      scenes={SCENES}
      render={(active) => {
        const showBounds = active >= 1;
        const show2000 = active >= 2;
        const showLog = active === 3;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 124`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={kx(1074)} y={AXIS_Y - 30} width={X1 - kx(1074)} height={30} fill={WARN} opacity={showBounds ? 0.1 : 0} />
              <text x={(kx(1074) + X1) / 2} y={AXIS_Y - 36} textAnchor="middle" fontSize={11} fill={WARN} opacity={showBounds ? 1 : 0}>
                양수를 담을 칸 없음 → 0.0
              </text>
              <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke={MUTED} strokeWidth={1} />
              {[0, 500, 1500, 2000].map((k) => (
                <g key={k}>
                  <line x1={kx(k)} x2={kx(k)} y1={AXIS_Y} y2={AXIS_Y + 5} stroke={MUTED} strokeWidth={1} />
                  <text x={kx(k)} y={AXIS_Y + 18} textAnchor="middle" fontSize={11} fill={TEXT}>{k}</text>
                </g>
              ))}
              <text x={X0} y={AXIS_Y + 40} fontSize={11} fill={TEXT}>k (2⁻ᵏ의 지수 크기)</text>
              <circle cx={kx(3)} cy={AXIS_Y} r={4.5} fill={ACCENT} />
              <text x={kx(3)} y={AXIS_Y - 12} fontSize={11} fontWeight={700} fill={ACCENT}>k=3</text>
              <g opacity={showBounds ? 1 : 0}>
                <line x1={kx(1022)} x2={kx(1022)} y1={AXIS_Y - 54} y2={AXIS_Y} stroke={TEXT} strokeWidth={1} strokeDasharray="3 3" />
                <text x={kx(1022) - 4} y={AXIS_Y - 58} textAnchor="end" fontSize={11} fill={TEXT}>정규 최솟값 1022</text>
                <line x1={kx(1074)} x2={kx(1074)} y1={AXIS_Y} y2={AXIS_Y + 30} stroke={WARN} strokeWidth={1.25} />
                <text x={kx(1074) + 4} y={AXIS_Y + 30} fontSize={11} fill={WARN}>가장 작은 양수 1074</text>
              </g>
              <g opacity={show2000 ? 1 : 0}>
                <circle cx={kx(2000)} cy={AXIS_Y} r={4.5} fill="none" stroke={WARN} strokeWidth={1.25} />
                <text x={kx(2000)} y={AXIS_Y - 12} textAnchor="end" fontSize={11} fontWeight={700} fill={WARN}>k=2000</text>
              </g>
            </svg>
            <div className={`mt-2 grid gap-0.5 border-t border-border pt-2 font-mono text-xs leading-5 sm:text-sm sm:leading-6 ${showLog ? "visible" : "invisible"}`} aria-hidden={!showLog}>
              <div className="flex flex-wrap justify-between gap-x-3"><span>2000 * math.log(0.5)</span><span className="font-bold text-primary">약 −1386.294361</span></div>
              <div className="flex flex-wrap justify-between gap-x-3"><span>2001 * math.log(0.5)</span><span className="font-bold text-primary">약 −1386.987508</span></div>
              <div className="flex flex-wrap justify-between gap-x-3"><span>math.exp(2000 * math.log(0.5))</span><span className="font-bold text-red-700 dark:text-red-400">0.0</span></div>
            </div>
          </div>
        );
      }}
    />
  );
}
