import SceneShell from "./SceneShell";

/**
 * 본문 대응: #neural-approach — u_wᵀv_c ≈ PMI(w,c) − log k.
 * 고양이–반려 PMI 0.439에서 negative sample 수 k가 커질수록 같은 pair의 최적 score가 내려갑니다.
 * k=5는 본문 값(log(76/49) − log 5 = 0.43892 − 1.60944 ≈ −1.171). k=1·2는 내려가는 방향을 보이려는 가정입니다.
 */
const PMI = 0.439;
const KS = [1, 2, 5] as const;
const shifted = (k: number) => PMI - Math.log(k);

const MIN = -1.4;
const MAX = 0.7;
const X0 = 24;
const X1 = 336;
const x = (value: number) => X0 + ((value - MIN) / (MAX - MIN)) * (X1 - X0);
const AXIS_Y = 92;
const TICKS = [-1, -0.5, 0, 0.5] as const;
const fmt = (value: number) => `${value < 0 ? "−" : ""}${Math.abs(value).toFixed(3)}`;

const SCENES = [
  {
    label: "k = 1 (가정)",
    summary: `log 1 = 0 → ${fmt(shifted(1))}`,
    note: "negative를 하나만 뽑으면 log 1=0이라 이동이 없습니다. 최적 score는 PMI 0.439와 같은 자리에 있습니다.",
  },
  {
    label: "k = 2 (가정)",
    summary: `0.439 − ${Math.log(2).toFixed(3)} = ${fmt(shifted(2))}`,
    note: "k를 2로 늘리면 log 2≈0.693만큼 내려가 0 아래로 넘어갑니다. pair의 PMI는 그대로인데 score만 이동했습니다.",
  },
  {
    label: "k = 5 (본문)",
    summary: `0.43892 − ${Math.log(5).toFixed(5)} ≈ −1.171`,
    note: "본문의 k=5에서는 0.439−log 5≈−1.171입니다. 양의 PMI pair도 negative class prior를 반영한 최적 score에서는 음수가 될 수 있습니다.",
  },
] as const;

export default function ShiftedPmiViz() {
  return (
    <SceneShell
      eyebrow="SGNS 최적 score의 이동"
      title="negative 수 k가 늘수록 같은 pair의 score가 log k만큼 내려갑니다"
      description="가로축 하나가 score 값입니다. 회색 점은 고양이–반려의 PMI 0.439, 파란 점은 독립 cell optimum에서 SGNS dot product가 가까워지는 PMI − log k입니다."
      note="noise가 context marginal이라는 전제에서 독립 cell optimum을 보는 근사입니다. smoothed noise·subsampling·유한 차원·공유 parameter·SGD에서는 각 cell이 이 값에 정확히 맞는다는 보증이 없습니다."
      ariaLabel="negative sample 수 k가 1, 2, 5일 때 고양이-반려 pair의 shifted PMI 위치"
      scenes={SCENES}
      render={(active) => {
        const k = KS[active];
        const score = shifted(k);
        const previous = (KS as readonly number[]).slice(0, active);
        return (
          <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[480px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {TICKS.map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(tick)} y={AXIS_Y + 18} fontSize={12} textAnchor="middle" fill="#64748b">
                  {tick === 0 ? "0" : `${tick < 0 ? "−" : ""}${Math.abs(tick)}`}
                </text>
              </g>
            ))}
            <line x1={x(0)} x2={x(0)} y1={30} y2={AXIS_Y + 4} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
            <text x={x(0) - 4} y={34} textAnchor="end" fontSize={10} fill="#64748b">0 오른쪽 = 양수</text>
            {previous.map((value) => (
              <circle key={value} cx={x(shifted(value))} cy={AXIS_Y} r={4} fill="none" stroke="#2563eb" strokeOpacity={0.45} strokeWidth={1} />
            ))}
            {active > 0 ? (
              <>
                <line x1={x(PMI)} x2={x(score) + 8} y1={60} y2={60} stroke="#2563eb" strokeWidth={1.25} />
                <path d={`M${x(score) + 8} 55 L${x(score)} 60 L${x(score) + 8} 65`} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                <text x={x(PMI)} y={50} fontSize={13} textAnchor="middle" fill="#2563eb">−log {k}</text>
              </>
            ) : null}
            <circle cx={x(PMI)} cy={AXIS_Y} r={6} fill="#94a3b8" />
            <text x={x(PMI)} y={AXIS_Y + 36} fontSize={12} textAnchor="middle" fill="#64748b">PMI 0.439</text>
            <circle cx={x(score)} cy={AXIS_Y} r={active === 0 ? 3.5 : 6} fill="#2563eb" />
            <text x={x(score)} y={AXIS_Y + 36 + (active === 0 ? 14 : 0)} fontSize={13} fontWeight={700} textAnchor="middle" fill="#2563eb">
              {active === 2 ? "−1.171" : fmt(score)}
            </text>
          </svg>
        );
      }}
    />
  );
}
