import { Arrow, Box } from "./FlowParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 공동 재원과 창구의 돈이 병원에서 합쳐지고, 병원이 비용을 낸다.
 * 금액은 다음 절에서 넣는다. 여기서는 돈의 경로와 시점만 그린다.
 */
const POOL = "#2563eb";
const PATIENT = "#d97706";
const HOSPITAL = "#64748b";

const SCENES = [
  { label: "건강할 때 미리 냅니다", summary: "사람들 → 공동 재원", note: "공동 재원은 여러 사람이 미리 낸 돈을 모아 둔 곳입니다. 아직 아무도 진료를 받지 않아도 이 길에는 돈이 흐릅니다." },
  { label: "치료받으면 지급 담당이 보냅니다", summary: "공동 재원 → 지급 담당 → 병원", note: "아픈 사람이 치료받으면 지급 담당이 계약상 보장되는 진료를 확인해 병원에 돈을 보냅니다." },
  { label: "환자는 본인 몫을 따로 냅니다", summary: "환자 → 병원", note: "환자가 내야 할 부분은 다른 길로 들어옵니다. 미리 모은 돈과 창구에서 낸 돈이 병원에서 합쳐집니다." },
  { label: "병원은 받은 돈으로 비용을 냅니다", summary: "병원 → 의료진·약품·시설", note: "병원을 거친 돈은 의료진, 약품과 시설의 비용으로 나갑니다." },
  { label: "진료와 대금이 갈립니다", summary: "진료 결정 ≠ 대금 지급", note: "진료가 이뤄지는 병원과 대금을 보내는 지급 담당이 떨어져 있습니다. 누가 진료를 결정하는지와 누가 대금을 주는지가 같지 않다는 것이 이 구조의 특징입니다." },
] as const;

export default function MoneyPathViz() {
  return (
    <SceneShell
      eyebrow="돈의 큰 경로"
      title="돈은 두 길로 병원에 들어옵니다"
      description="위 줄은 미리 모은 돈이 가는 길, 아래 줄은 창구에서 낸 돈과 병원에서 나가는 돈의 길입니다. 이 단계에서는 금액을 넣지 않습니다."
      ariaLabel="사전 납부, 지급 담당의 확인, 환자 부담, 병원 비용으로 이어지는 돈의 경로"
      scenes={SCENES}
      render={(active) => {
        const gap = active === 4;
        return (
          <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={6} y={22} w={88} h={44} title="사람들" sub="건강할 때부터" color={POOL} on={active === 0} />
            <Box x={130} y={22} w={88} h={44} title="공동 재원" color={POOL} on={active === 0 || active === 1} />
            <Box x={254} y={22} w={100} h={44} title="지급 담당" sub="보장 여부 확인" color={POOL} on={active === 1 || gap} />
            <Box x={6} y={128} w={88} h={44} title="환자" sub="본인 몫" color={PATIENT} on={active === 2} />
            <Box x={130} y={128} w={88} h={44} title="병원" sub={gap ? "진료하는 곳" : undefined} color={HOSPITAL} on={active === 1 || active === 2 || active === 3 || gap} />
            <Box x={254} y={128} w={100} h={44} title="비용" sub="의료진·약품·시설" color={HOSPITAL} on={active === 3} />
            <Arrow x1={96} y1={44} x2={128} y2={44} color={POOL} on={active === 0} />
            <Arrow x1={220} y1={44} x2={252} y2={44} color={POOL} on={active === 1} />
            <Arrow x1={290} y1={68} x2={196} y2={126} color={POOL} on={active === 1 || gap} />
            <Arrow x1={96} y1={150} x2={128} y2={150} color={PATIENT} on={active === 2} />
            <Arrow x1={220} y1={150} x2={252} y2={150} color={HOSPITAL} on={active === 3} />
            {gap && <text x={306} y={106} textAnchor="middle" fontSize={11} fontWeight={700} fill={POOL}>대금을 주는 쪽</text>}
          </svg>
        );
      }}
    />
  );
}
