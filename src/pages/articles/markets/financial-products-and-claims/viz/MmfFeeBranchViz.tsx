import SceneShell from "./SceneShell";
import { Arrow, Box } from "./SvgParts";

/**
 * 본문 대응: #limits — 미국 MMF 유형별 NAV와 2023-07-12 채택 개정의 수수료 갈림.
 * 5%는 본문의 기준입니다. 순환매 3%와 6%는 기준 양쪽을 보이려는 예시입니다.
 */
const SCENES = [
  { label: "유형이 NAV를 가릅니다", summary: "고정 목표 대 변동", note: "개인용·정부 MMF 대부분은 좌당 1.00달러의 고정 NAV를 목표로 하고, 기관용 prime·tax-exempt MMF는 NAV를 변동시켜야 합니다." },
  { label: "하루 순환매 3%(예시)", summary: "5% 이하 → 의무 수수료 아님", note: "기관용 prime·tax-exempt MMF의 의무 수수료는 하루 순환매가 순자산의 5%를 넘어야 작동합니다. 3%는 예시입니다." },
  { label: "하루 순환매 6%(예시)", summary: "5% 초과 → 유동성 수수료 의무", note: "5%를 넘으면 유동성 수수료를 물려야 합니다. 유동성 비용이 미미한 경우는 제외입니다. 6%는 예시입니다." },
  { label: "이사회 재량", summary: "정부 MMF 아닌 펀드", note: "정부 MMF가 아닌 펀드는 이사회가 판단하면 재량 수수료를 물릴 수 있습니다. 환매를 멈추던 게이트 조항은 없어졌습니다." },
] as const;

const ACCENT = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const MUTED = "#94a3b8";
const GX = (percent: number) => 16 + (percent / 8) * 308;

function Gauge({ value }: { value: number }) {
  const over = value > 5;
  return (
    <g>
      <text x={16} y={24} fontSize={12} fontWeight={700} fill="currentColor">기관용 prime·tax-exempt의 하루 순환매</text>
      <rect x={GX(0)} y={34} width={GX(8) - GX(0)} height={18} rx={3} fill={MUTED} opacity={0.25} />
      <rect x={GX(0)} y={34} width={GX(value) - GX(0)} height={18} rx={3} fill={over ? RED : ACCENT} opacity={0.85} />
      <line x1={GX(5)} x2={GX(5)} y1={28} y2={60} stroke="currentColor" strokeWidth={1.25} />
      <text x={GX(5)} y={74} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">기준 5%</text>
      <text x={GX(value) + (over ? 6 : -6)} y={48} textAnchor={over ? "start" : "end"} fontSize={12} fontWeight={700} fill={over ? "currentColor" : "#ffffff"}>{value}%</text>
      <Arrow x1={GX(value)} y1={80} x2={GX(value)} y2={100} tone={over ? RED : GRAY} />
      <Box x={over ? 120 : 60} y={102} w={200} h={48} lines={over ? ["유동성 수수료 의무", "유동성 비용 미미하면 제외"] : ["의무 수수료 작동 안 함", "재량 수수료는 별도"]} tone={over ? RED : MUTED} />
    </g>
  );
}

export default function MmfFeeBranchViz() {
  return (
    <SceneShell
      eyebrow="미국 MMF의 갈림"
      title="MMF 유형과 하루 순환매에 따라 NAV와 수수료가 갈립니다"
      description="기관용 prime·tax-exempt는 변동 NAV와 5% 의무 수수료가 걸리는 미국 MMF 유형입니다. 순자산 대비 하루 순환매는 그날 나간 돈에서 들어온 돈을 뺀 비율입니다."
      note="미국 관할이며 SEC가 2023년 7월 12일 채택한 개정 기준입니다. 환매 조건은 유형마다 다릅니다."
      ariaLabel="미국 MMF의 유형별 NAV와 하루 순환매 5퍼센트 기준의 유동성 수수료"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 340 158" className="mx-auto h-auto w-full max-w-[540px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && (
            <g>
              <Box x={0} y={14} w={140} h={56} lines={["개인용·정부 MMF", "대부분"]} tone={ACCENT} />
              <Arrow x1={140} y1={42} x2={190} y2={42} tone={ACCENT} />
              <Box x={192} y={14} w={148} h={56} lines={["고정 NAV 목표", "좌당 1.00달러"]} tone={ACCENT} />
              <Box x={0} y={88} w={140} h={56} lines={["기관용", "prime·tax-exempt"]} tone={AMBER} />
              <Arrow x1={140} y1={116} x2={190} y2={116} tone={AMBER} />
              <Box x={192} y={88} w={148} h={56} lines={["변동 NAV", "가격이 움직임"]} tone={AMBER} />
            </g>
          )}
          {active === 1 && <Gauge value={3} />}
          {active === 2 && <Gauge value={6} />}
          {active === 3 && (
            <g>
              <Box x={0} y={40} w={120} h={72} lines={["정부 MMF가", "아닌 펀드"]} tone={AMBER} />
              <Arrow x1={120} y1={76} x2={160} y2={76} tone={AMBER} />
              <Box x={162} y={14} w={178} h={56} lines={["이사회 판단", "재량 수수료 가능"]} tone={AMBER} />
              <rect x={162} y={88} width={178} height={56} rx={8} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
              <text x={251} y={112} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>게이트 조항</text>
              <text x={251} y={130} textAnchor="middle" fontSize={11} fill={GRAY}>개정으로 없어짐</text>
              <line x1={200} x2={302} y1={108} y2={108} stroke={RED} strokeWidth={1} />
            </g>
          )}
        </svg>
      )}
    />
  );
}
