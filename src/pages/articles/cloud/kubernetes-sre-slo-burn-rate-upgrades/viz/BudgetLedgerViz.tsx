import SceneShell from "./SceneShell";

/**
 * 본문 대응: #budget-policy — 100 − 3.47 − 5 = 91.53(본문 91.5), 91.53 − 80 = 11.53(본문 11.5).
 * 멈춤을 가르는 잔량 숫자는 본문에 없으므로 문턱 선을 긋지 않는다.
 */
const STEPS = [
  { top: "월초", bottom: "", spent: 0, left: 100, label: "100%", gate: "배포 가능" },
  { top: "10분", bottom: "장애", spent: 3.47, left: 96.53, label: "96.5%", gate: "배포 가능" },
  { top: "잘못된", bottom: "rollout", spent: 5, left: 91.53, label: "91.5%", gate: "배포 가능" },
  { top: "셋째 주", bottom: "큰 장애", spent: 80, left: 11.53, label: "11.5%", gate: "기능 배포 멈춤" },
];

const SCENES = [
  { label: "월초", summary: "budget 259만 개 = 100%", note: "이 달의 실패 허용량이 온전히 남아 있습니다. 새 release를 내보낼 수 있습니다." },
  { label: "10분 장애 뒤", summary: "100 − 3.47 = 96.53%", note: "3절의 10분 장애가 3.47%를 썼습니다. 아직 배포할 수 있습니다." },
  { label: "잘못된 rollout 뒤", summary: "96.53 − 5 = 91.53%", note: "배포 중 잘못된 rollout이 5%를 더 썼습니다. 본문의 91.5%이고 아직 배포할 수 있습니다." },
  { label: "큰 장애 뒤", summary: "91.53 − 80 = 11.53%", note: "남은 11.5%로 월말까지 버텨야 하므로 새 기능 배포를 멈추고, 남은 변경은 PDB 추가·probe 수정·limit 조정 같은 복원력 작업으로 제한합니다." },
] as const;

const X0 = 34;
const PITCH = 80;
const BAR = 54;
const BASE = 136;
const TOP = 18;
const yAt = (percent: number) => BASE - ((BASE - TOP) * percent) / 100;

export default function BudgetLedgerViz() {
  return (
    <SceneShell
      eyebrow="budget으로 내리는 배포 결정"
      title="남은 budget 이 이번 달 변경의 허가증입니다"
      description="파란 부분이 남은 budget, 빨간 부분이 그 사건이 쓴 몫입니다. 사건 간격은 시간에 비례하지 않습니다."
      note="사건과 비율은 본문의 가정입니다. 본문은 멈출 잔량을 숫자로 정하지 않으므로 문턱 선을 긋지 않았습니다."
      ariaLabel="사건마다 줄어드는 남은 budget과 배포 허가 상태"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 194" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[0, 50, 100].map((percent) => (
            <g key={percent}>
              <line x1={X0 - 2} x2={350} y1={yAt(percent)} y2={yAt(percent)} stroke="#94a3b8" strokeWidth={percent === 0 ? 1 : 0.5} />
              <text x={X0 - 6} y={yAt(percent) + 4} textAnchor="end" fontSize={10} fill="#64748b">{percent}%</text>
            </g>
          ))}
          {STEPS.map((step, index) => {
            const x = X0 + 6 + index * PITCH;
            const shown = index <= active;
            const stopped = step.gate !== "배포 가능";
            return (
              <g key={step.top}>
                {shown && (
                  <>
                    <rect x={x} y={yAt(step.left)} width={BAR} height={BASE - yAt(step.left)} fill="#2563eb" fillOpacity={0.45} stroke="#2563eb" strokeWidth={1} />
                    {step.spent > 0 && <rect x={x} y={yAt(step.left + step.spent)} width={BAR} height={yAt(step.left) - yAt(step.left + step.spent)} fill="#dc2626" fillOpacity={0.4} stroke="#dc2626" strokeWidth={1} />}
                    <text x={x + BAR / 2} y={stopped ? yAt(step.left) - 5 : yAt(step.left) + 16} textAnchor="middle" fontSize={11.5} fontWeight={700} className="fill-foreground">{step.label}</text>
                    {stopped ? (
                      <text x={x + BAR / 2} y={yAt(50)} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">−80</text>
                    ) : step.spent > 0 ? (
                      <text x={x + BAR / 2} y={TOP - 4} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#dc2626">−{step.spent}</text>
                    ) : null}
                  </>
                )}
                <text x={x + BAR / 2} y={BASE + 14} textAnchor="middle" fontSize={10} fill={shown ? "#64748b" : "#94a3b8"} opacity={shown ? 1 : 0.5}>{step.top}</text>
                <text x={x + BAR / 2} y={BASE + 26} textAnchor="middle" fontSize={10} fill={shown ? "#64748b" : "#94a3b8"} opacity={shown ? 1 : 0.5}>{step.bottom}</text>
                {shown && <text x={x + BAR / 2} y={BASE + 46} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={stopped ? "#dc2626" : "#15803d"}>{step.gate}</text>}
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
