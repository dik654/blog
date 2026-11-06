import LedgerBars from "./LedgerBars";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 자산 90·빚 80을 고정하고 허용 비율만 80%→70%로 낮춘다(가정).
 * 한도 72→63, 대출자가 남겨 두는 여유 18→27, 부족 8→17.
 */
const SCENES = [
  { label: "허용 비율 80%", summary: "여유 18 · 부족 8", ratio: 0.8, note: "대출자는 자산 90억 원 가운데 18억 원을 빌려주지 않고 남겨 둡니다. 확인과 매각 사이에 값이 더 떨어지거나 수수료가 들어갈 수 있기 때문입니다." },
  { label: "허용 비율 70%", summary: "여유 27 · 부족 17", ratio: 0.7, note: "자산과 빚의 막대는 그대로이고 한도선만 왼쪽으로 옮겨 갑니다. 가격이 움직이지 않았는데 부족액이 8억 원에서 17억 원으로 늘어납니다." },
] as const;

export default function RatioCutViz() {
  return (
    <SceneShell
      eyebrow="허용 비율"
      title="가격이 그대로여도 한도선이 움직이면 부족액이 늘어납니다"
      description="허용 비율은 자산 가치 가운데 빌려주는 비율입니다. 자산 90억 원과 빚 80억 원은 고정했고, 80%와 70%는 모두 가정입니다."
      ariaLabel="허용 비율을 80퍼센트에서 70퍼센트로 낮출 때 대출 한도와 부족액의 변화"
      scenes={SCENES}
      render={(active) => <LedgerBars asset={90} debt={80} ratio={SCENES[active].ratio} />}
    />
  );
}
