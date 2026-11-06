import { FlowArrow, FlowBox } from "./FlowParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 가격 상승 → 자금조달 → 두 갈래. 결과는 #black-box의 "기대를 다시 고칩니다"로 돌아간다.
 * 모든 화살표는 "할 수 있다"이므로 점선입니다. 크기와 확률은 글에 없어서 그리지 않습니다.
 */
const SCENES = [
  { label: "공통 출발", summary: "기대 → 가격 → 자금조달", note: "더 높은 가격은 새 지분을 팔아 건설비를 마련하기 쉽게 할 수 있습니다. 공장이 현금을 벌기 전에 먼저 돈을 대는 사람이 필요한 자리입니다." },
  { label: "기대가 일부 실현되는 갈래", summary: "자금 → 생산 → 일부 실현", note: "자금조달이 실제 생산을 늘리면 처음 기대를 일부 실현할 수 있습니다. 결과를 보고 기대를 다시 고치는 이 고리를 다음 절에서 되먹임이라고 부릅니다." },
  { label: "현금이 기대에 못 미치는 갈래", summary: "과장 → 많은 설비 → 낮은 현금", note: "계획이 과장되어 수요보다 많은 설비를 만들면 나중의 실제 현금은 기대보다 낮아질 수 있습니다. 이 결과도 같은 고리를 타고 기대를 고칩니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";

export default function FeedbackBranchViz() {
  return (
    <SceneShell
      eyebrow="자금이 붙은 뒤의 두 갈래"
      title="자금이 붙은 계획은 기대를 일부 실현할 수도, 기대보다 낮은 현금으로 이어질 수도 있습니다"
      description="점선은 모두 '그럴 수 있다'는 경로이고, 상자 크기는 금액이 아닙니다."
      ariaLabel="가격 상승과 자금조달 뒤에 갈라지는 두 경로와 기대로 돌아오는 고리"
      scenes={SCENES}
      render={(active) => {
        const left = active === 1;
        const right = active === 2;
        const common = active === 0 ? BLUE : GRAY;
        return (
          <svg viewBox="0 0 360 238" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <FlowBox x={26} y={8} w={92} h={38} lines={["기대 높아짐"]} color={common} />
            <FlowBox x={132} y={8} w={84} h={38} lines={["가격 상승"]} color={common} />
            <FlowBox x={230} y={8} w={124} h={38} lines={["자금조달 쉬워짐"]} color={common} />
            <FlowArrow points={[[118, 27], [132, 27]]} color={common} dashed />
            <FlowArrow points={[[216, 27], [230, 27]]} color={common} dashed />

            <FlowArrow points={[[292, 46], [292, 60], [106, 60], [106, 80]]} color={left ? BLUE : GRAY} dashed dim={right} />
            <FlowArrow points={[[292, 46], [292, 60], [274, 60], [274, 80]]} color={right ? AMBER : GRAY} dashed dim={left} />

            <FlowBox x={26} y={80} w={160} h={44} lines={["자금으로", "실제 생산이 늘어남"]} color={left ? BLUE : GRAY} dim={right} />
            <FlowBox x={196} y={80} w={158} h={44} lines={["계획이 과장되어", "수요보다 많은 설비"]} color={right ? AMBER : GRAY} dim={left} />
            <FlowArrow points={[[106, 124], [106, 146]]} color={left ? BLUE : GRAY} dashed dim={right} />
            <FlowArrow points={[[274, 124], [274, 146]]} color={right ? AMBER : GRAY} dashed dim={left} />
            <FlowBox x={26} y={146} w={160} h={44} lines={["처음 기대를", "일부 실현"]} color={left ? BLUE : GRAY} dim={right} />
            <FlowBox x={196} y={146} w={158} h={44} lines={["나중의 실제 현금이", "기대보다 낮아짐"]} color={right ? AMBER : GRAY} dim={left} />

            <FlowArrow points={[[274, 190], [274, 206], [12, 206], [12, 27], [26, 27]]} color={right ? AMBER : GRAY} dashed dim={!right} />
            {left && <FlowArrow points={[[106, 190], [106, 206], [12, 206], [12, 27], [26, 27]]} color={BLUE} dashed />}
            <text x={186} y={226} textAnchor="middle" fontSize={12} fontWeight={active === 0 ? 400 : 700} fill={left ? BLUE : right ? AMBER : GRAY}>
              결과를 보고 기대를 다시 고침
            </text>
          </svg>
        );
      }}
    />
  );
}
