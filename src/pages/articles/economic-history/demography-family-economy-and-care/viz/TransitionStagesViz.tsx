import RateBars from "./RateBars";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview·#case — 1,000명당 출생·사망 40−35=5, 40−15=25, 18−8=10.
 * 사망이 먼저 내려가 틈이 벌어지고, 출생이 뒤따라 내려가 틈이 다시 좁아지는 순서.
 */
const GROUPS = [
  { label: "1단계", birth: 40, death: 35 },
  { label: "2단계", birth: 40, death: 15 },
  { label: "3단계", birth: 18, death: 8 },
] as const;

const SCENES = [
  { label: "1단계 · 높은 출생과 높은 사망", summary: "40 − 35 = +5명", note: "1,000명당 40명이 태어나고 35명이 사망합니다. 두 막대가 거의 같은 높이라 차이, 곧 자연증가는 5명뿐입니다." },
  { label: "2단계 · 사망이 먼저 내려감", summary: "40 − 15 = +25명", note: "보건과 식량 사정이 먼저 좋아져 사망 막대만 35에서 15로 내려갑니다. 출생 막대는 그대로라 틈이 5에서 25로 벌어집니다." },
  { label: "3단계 · 출생이 뒤따라 내려감", summary: "18 − 8 = +10명", note: "출생도 40에서 18로, 1단계의 절반인 20 아래로 내려갑니다. 그래도 틈 10은 1단계의 5보다 큽니다." },
] as const;

export default function TransitionStagesViz() {
  return (
    <SceneShell
      eyebrow="인구 전환의 순서"
      title="사망이 먼저 내려가면 두 막대 사이 틈이 벌어졌다가 좁아집니다"
      description="자연증가는 한 해의 출생에서 사망을 뺀 값입니다. 막대는 인구 1,000명당 한 해의 출생과 사망이며, 특정 나라의 통계가 아니라 이주를 0, 기준 인구를 같게 둔 설명용 수치(가정)입니다."
      ariaLabel="1,000명당 출생과 사망이 세 단계에 걸쳐 바뀔 때 자연증가가 5에서 25로 커졌다가 10으로 내려오는 과정"
      scenes={SCENES}
      render={(active) => <RateBars groups={GROUPS} shown={active} ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`} />}
    />
  );
}
