import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 평소 100 − 5 = 95, 사고 달 100 − 40 = 60, 60 + 25 = 85.
 * 남은 소득 충격 40 − 25 = 15와 가처분 차이 95 − 85 = 10이 다른 이유는 평소 보험료 5.
 * 가로축은 0~100을 같은 비율로 그렸다. 설명용 장부이며 실제 보험료율·보상률이 아니다.
 */
const SPEND = "#2563eb";
const PREMIUM = "#64748b";
const LOSS = "#dc2626";
const BENEFIT = "#16a34a";
const MUTED = "#94a3b8";

const X0 = 16;
const X1 = 344;
const x = (value: number) => X0 + ((X1 - X0) * value) / 100;
const ROW_A = 34;
const ROW_B = 108;
const BAR_H = 28;

const SCENES = [
  { label: "평소 달", summary: "100 − 5 = 95", note: "월급 100에서 사회보험료 5를 내면 평소에 쓸 수 있는 돈(가처분소득)은 95입니다. 세금과 다른 공제는 생략했습니다." },
  { label: "사고 달: 소득이 줄어듭니다", summary: "100 − 40 = 60", note: "업무상 사고로 시장소득(일해서 버는 돈)이 40 줄어 60이 됩니다. 급여가 들어오기 전이라면 그달 쓸 돈은 60입니다." },
  { label: "사고 달: 급여가 들어옵니다", summary: "60 + 25 = 85", note: "제도가 급여 25를 지급하면 그달 쓸 수 있는 돈은 85입니다. 손실 40 가운데 메우지 못한 15는 빈 칸으로 남았습니다." },
  { label: "15와 10은 왜 다른가", summary: "15 − 10 = 평소 보험료 5", note: "월급 100에서 재면 남은 충격은 40 − 25 = 15입니다. 평소 가처분 95에서 재면 차이는 95 − 85 = 10입니다. 두 값의 차이 5가 평소에도 낸 보험료입니다." },
] as const;

function Seg({ from, to, y, color, label, outline, on = true }: { from: number; to: number; y: number; color: string; label: string; outline?: boolean; on?: boolean }) {
  const w = x(to) - x(from);
  return (
    <g opacity={on ? 1 : 0.35}>
      <rect x={x(from)} y={y} width={w} height={BAR_H} rx={3} fill={outline ? "none" : color} fillOpacity={outline ? 0 : 0.85} stroke={color} strokeWidth={1} strokeDasharray={outline ? "4 3" : undefined} />
      <text x={x(from) + w / 2} y={y + BAR_H / 2 + 4.5} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={outline ? color : "#ffffff"}>{label}</text>
    </g>
  );
}

function Bracket({ from, to, y, color, label }: { from: number; to: number; y: number; color: string; label: string }) {
  return (
    <g>
      <path d={`M${x(from)},${y - 5} L${x(from)},${y} L${x(to)},${y} L${x(to)},${y - 5}`} fill="none" stroke={color} strokeWidth={1.25} />
      <text x={x(from) - 6} y={y + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function IncomeLedgerViz() {
  return (
    <SceneShell
      eyebrow="한 달 장부"
      title="손실 40 가운데 25를 메우면 무엇이 남는지 셉니다"
      description="막대 길이는 0부터 100까지 같은 비율입니다. 실제 보험료율이나 보상률이 아닌 설명용 장부입니다."
      ariaLabel="평소 달과 사고 달의 가처분소득 비교: 95, 60, 85와 남은 충격 15, 차이 10"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={X0} y={ROW_A - 8} fontSize={12.5} fontWeight={700} fill="currentColor">평소 달 · 월급 100</text>
          <Seg from={0} to={95} y={ROW_A} color={SPEND} label="쓸 돈 95" on={active === 0 || active === 3} />
          <Seg from={95} to={100} y={ROW_A} color={PREMIUM} label="" on={active === 0 || active === 3} />
          <text x={x(97.5)} y={ROW_A + BAR_H + 13} textAnchor="middle" fontSize={11} fill={PREMIUM}>보험료 5</text>

          <text x={X0} y={ROW_B - 8} fontSize={12.5} fontWeight={700} fill="currentColor" opacity={active === 0 ? 0.4 : 1}>사고 달 · 월급 100 기준</text>
          {active === 0 ? (
            <rect x={x(0)} y={ROW_B} width={x(100) - x(0)} height={BAR_H} rx={3} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="2 4" />
          ) : (
            <>
              <Seg from={0} to={60} y={ROW_B} color={SPEND} label="시장소득 60" />
              {active === 1 ? (
                <Seg from={60} to={100} y={ROW_B} color={LOSS} label="손실 40" outline />
              ) : (
                <>
                  <Seg from={60} to={85} y={ROW_B} color={BENEFIT} label="급여 25" />
                  <Seg from={85} to={100} y={ROW_B} color={LOSS} label="15" outline />
                </>
              )}
            </>
          )}

          {active === 3 && (
            <>
              <line x1={x(85)} x2={x(85)} y1={ROW_A} y2={ROW_B + BAR_H} stroke={MUTED} strokeWidth={1} strokeDasharray="2 3" />
              <line x1={x(95)} x2={x(95)} y1={ROW_A + BAR_H} y2={ROW_B + BAR_H + 70} stroke={PREMIUM} strokeOpacity={0.6} strokeWidth={1} strokeDasharray="2 3" />
              <Bracket from={85} to={100} y={ROW_B + BAR_H + 22} color={LOSS} label="월급 기준 남은 충격 15" />
              <Bracket from={85} to={95} y={ROW_B + BAR_H + 46} color={SPEND} label="평소 가처분 기준 차이 10" />
              <Bracket from={95} to={100} y={ROW_B + BAR_H + 70} color={PREMIUM} label="그 차이 = 평소 보험료 5" />
            </>
          )}
          <text x={X0} y={228} fontSize={11} fill="currentColor" opacity={0.6}>0</text>
          <text x={X1} y={228} textAnchor="end" fontSize={11} fill="currentColor" opacity={0.6}>100</text>
        </svg>
      )}
    />
  );
}
