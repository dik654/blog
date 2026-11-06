import SceneShell from "./SceneShell";
import { StoreGrid, type StoreCell } from "./StoreGrid";

/** 본문 대응: #mechanism — 첫 형식은 A가 전자 40곳 안, 둘째 형식은 A가 카드 90곳 안. 결론만 거짓인 칸: 0곳 / 50곳. */
const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  groups: readonly [StoreCell, StoreCell, StoreCell];
  mark?: number;
}[] = [
  { label: "첫 형식: A는 전자제품", summary: "전제가 허용한 칸 40곳", groups: ["electronics", "dimOther", "dimNoCard"], mark: 14, note: "“전자제품이면 카드 결제다. A는 전자제품이다.” 두 전제를 지키면 A는 진한 40칸 안에만 놓을 수 있습니다." },
  { label: "결론 “A는 카드 결제”", summary: "결론만 거짓인 칸 0곳", groups: ["electronics", "dimOther", "dimNoCard"], mark: 37, note: "결론이 거짓이 되려면 A가 실선 밖으로 나가야 합니다. 40칸 어디로 옮겨도 실선 안이므로 전제를 유지한 채 결론만 거짓으로 만들 수 없습니다." },
  { label: "둘째 형식: A는 카드 결제", summary: "전제가 허용한 칸 90곳", groups: ["electronics", "other", "dimNoCard"], note: "“전자제품이면 카드 결제다. A는 카드 결제다.” 이번에는 전제가 A를 실선 안 90칸 어디에나 두는 것을 허용합니다. 결론은 A가 그중 위쪽 40칸에 있다고 주장합니다." },
  { label: "결론 “A는 전자제품”", summary: "결론만 거짓인 칸 50곳", groups: ["dimElectronics", "other", "dimNoCard"], note: "진한 50칸 어디에 A를 두어도 두 전제는 참이고 결론만 거짓입니다. 전제가 허용한 곳에 결론 밖의 칸이 남아 있습니다." },
  { label: "반례는 한 곳이면 됩니다", summary: "카드를 받는 식당 A", groups: ["dimElectronics", "dimOther", "dimNoCard"], mark: 56, note: "A를 카드를 받는 식당 한 곳으로 고르면 “반드시 따라온다”는 주장은 끝납니다. 이 일이 현실에서 흔한지는 묻지 않으며, 어느 업종일 가능성이 큰지는 별도의 확률 자료가 필요한 질문입니다." },
] as const;

export default function TwoFormsViz() {
  return (
    <SceneShell
      eyebrow="A를 어디에 놓을 수 있는가"
      title="전제가 허용한 칸 안에 결론이 틀리는 칸이 있는지 봅니다"
      description="3절과 같은 100곳입니다. 실선 안이 카드 결제 90곳이고, 빨간 A는 전제를 지키면서 가게 A를 놓아 본 자리입니다."
      ariaLabel="두 추론 형식에서 가게 A를 놓을 수 있는 칸과 결론이 거짓이 되는 칸"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return <StoreGrid groups={scene.groups} showCardOutline markedCell={scene.mark} ariaLabel={`${scene.label}: ${scene.summary}`} />;
      }}
    />
  );
}
