import SceneShell from "./SceneShell";
import { StoreGrid, type StoreCell } from "./StoreGrid";

/** 본문 대응: #case — 100 = 전자 40 + 다른 업종 60. 다른 업종 중 50이 카드를 받으므로 카드 결제 = 40 + 50 = 90, 나머지 10. 숫자는 글의 가정. */
const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  groups: readonly [StoreCell, StoreCell, StoreCell];
  labels: readonly [boolean, boolean, boolean];
  outline: boolean;
}[] = [
  { label: "한 상권의 가게", summary: "100곳 (가정)", groups: ["plain", "plain", "plain"], labels: [false, false, false], outline: false, note: "칸 하나가 가게 하나입니다. 이 숫자는 추론 모양을 보기 위한 가정이며, 어느 실제 상권의 통계가 아닙니다." },
  { label: "전자제품 가게", summary: "40곳, 모두 카드 결제", groups: ["electronics", "plain", "plain"], labels: [true, false, false], outline: false, note: "위 네 줄이 전자제품 가게 40곳입니다. 이 40곳은 하나도 빠짐없이 카드를 받습니다." },
  { label: "카드를 받는 다른 업종", summary: "40 + 50 = 90곳", groups: ["electronics", "other", "plain"], labels: [true, true, false], outline: true, note: "나머지 60곳 가운데 식당과 약국 50곳도 카드를 받습니다. 그래서 카드를 받는 가게는 전자제품 40곳을 품은 더 큰 묶음 90곳이 됩니다." },
  { label: "남은 가게", summary: "100 − 90 = 10곳", groups: ["electronics", "other", "noCard"], labels: [true, true, true], outline: true, note: "마지막 줄은 카드를 받는 90곳에 들지 않는 10곳입니다. 전자제품 40곳은 모두 실선 안에 있으므로 이 줄에 전자제품 가게는 없습니다." },
] as const;

export default function StoreSplitViz() {
  return (
    <SceneShell
      eyebrow="100곳을 칸으로"
      title="카드 결제 묶음 안에 전자제품 묶음이 들어 있습니다"
      description="칸 하나가 가게 하나이고, 칸 수가 곧 가게 수입니다."
      ariaLabel="가게 100곳을 전자제품 40곳, 카드를 받는 식당과 약국 50곳, 나머지 10곳으로 나눈 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return <StoreGrid groups={scene.groups} showLabels={scene.labels} showCardOutline={scene.outline} ariaLabel={`${scene.label}: ${scene.summary}`} />;
      }}
    />
  );
}
