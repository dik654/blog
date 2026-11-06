import SceneShell from "./SceneShell";
import { Arrow, Box } from "./SvgParts";

/**
 * 본문 대응: #mechanism — 지정 예고 → 10매매거래일 창 → 재해당 → 다음 매매거래일 지정.
 * 6일째 재해당은 순서를 보이려는 예시입니다. 조문 번호와 기준은 본문 그대로입니다.
 */
const SCENES = [
  { label: "장 종료 판정", summary: "괴리율 ≥ 그 비율의 2배", note: "장 종료 때 실시간 괴리율의 절댓값이 그 비율의 2배 이상이면 거래소가 지정을 예고할 수 있습니다. 1만 원짜리 국내 기초자산 상품이면 4%, 1만400원입니다." },
  { label: "10매매거래일의 창", summary: "예고 뒤 10거래일을 봅니다", note: "한 번 넘었다고 바로 지정되지는 않습니다. 예고 뒤 10매매거래일 안에 같은 요건에 다시 해당하는지를 봅니다." },
  { label: "창 안에서 다시 해당", summary: "다음 매매거래일 지정", note: "6거래일째에 다시 해당했다고 예를 들면 그다음 매매거래일에 투자유의종목으로 지정합니다. 6일째는 설명용 예시입니다." },
  { label: "지정된 뒤", summary: "체결 방법 변경 · 정지 가능", note: "지정된 종목은 거래소가 매매 체결 방법을 달리 정할 수 있습니다(제38조의2). 세칙 기준에 해당하면 매매거래를 정지할 수도 있습니다(제26조)." },
] as const;

const ACCENT = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const MUTED = "#94a3b8";
const CELL = 25;
const LEFT = 44;
const cellX = (day: number) => LEFT + (day - 1) * (CELL + 1.5);

export default function DesignationWindowViz() {
  return (
    <SceneShell
      eyebrow="투자유의 지정의 순서"
      title="괴리율이 선을 넘은 뒤 지정까지 어떤 순서로 가는지 봅니다"
      description="칸 하나가 매매거래일 하루입니다. 왼쪽 끝이 예고일입니다."
      note="한국거래소 유가증권시장 업무규정과 시행세칙 기준이며 2026-10-09 현재 조문입니다."
      ariaLabel="괴리율 기준 해당, 지정 예고, 10매매거래일 안 재해당, 투자유의종목 지정의 순서"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 340 166" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={0} y={32} width={38} height={34} rx={4} fill={AMBER} opacity={0.85} />
          <text x={19} y={53} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">예고</text>
          {active >= 1 && <text x={LEFT} y={20} fontSize={12} fontWeight={700} fill={ACCENT}>10매매거래일 안</text>}
          {Array.from({ length: 10 }, (_, index) => {
            const day = index + 1;
            const hit = active >= 2 && day === 6;
            const marked = active >= 2 && day === 7;
            return (
              <g key={day}>
                <rect x={cellX(day)} y={32} width={CELL} height={34} rx={3} fill={hit ? AMBER : marked ? RED : active >= 1 ? ACCENT : "none"} fillOpacity={hit || marked ? 0.85 : 0.14} stroke={active >= 1 ? ACCENT : MUTED} strokeWidth={0.75} />
                <text x={cellX(day) + CELL / 2} y={53} textAnchor="middle" fontSize={12} fontWeight={hit || marked ? 700 : 400} fill={hit || marked ? "#ffffff" : GRAY}>{day}</text>
              </g>
            );
          })}
          {active === 0 && <text x={0} y={92} fontSize={13} fontWeight={700} fill={AMBER}>장 종료: 절댓값이 2배 이상 → 예고할 수 있음</text>}
          {active >= 2 && (
            <g>
              <Arrow x1={cellX(6) + CELL / 2} y1={88} x2={cellX(6) + CELL / 2} y2={70} tone={AMBER} />
              <text x={cellX(6) + CELL / 2 - 6} y={100} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>다시 해당(예시)</text>
              <Arrow x1={cellX(7) + CELL / 2} y1={88} x2={cellX(7) + CELL / 2} y2={70} tone={RED} />
              <text x={cellX(7) + CELL / 2 + 6} y={100} fontSize={12} fontWeight={700} fill={RED}>지정</text>
            </g>
          )}
          {active === 3 && (
            <g>
              <Box x={0} y={112} w={164} h={46} lines={["체결 방법 변경 가능", "제38조의2"]} tone={RED} />
              <Box x={176} y={112} w={164} h={46} lines={["매매거래 정지 가능", "세칙 기준 해당 시 · 제26조"]} tone={RED} />
            </g>
          )}
        </svg>
      )}
    />
  );
}
