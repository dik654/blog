import SceneShell from "./SceneShell";
import { StoreGrid, type StoreCell } from "./StoreGrid";

/** 본문 대응: #comparison — 카드 없음 10곳 중 전자 0곳, 카드 있음 90곳 중 전자 40곳·다른 업종 50곳. */
const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  groups: readonly [StoreCell, StoreCell, StoreCell];
}[] = [
  { label: "카드 결제가 없으면", summary: "10곳 중 전자제품 0곳", groups: ["dimElectronics", "dimOther", "noCard"], note: "카드를 받지 않는 줄에는 전자제품 가게가 한 곳도 없습니다. ‘없으면 반드시 그렇게 되지 않는다’는 필요 조건의 모양입니다." },
  { label: "카드 결제가 있으면", summary: "90곳 중 전자제품 40곳", groups: ["electronics", "other", "dimNoCard"], note: "카드를 받아도 전자제품 가게는 90곳 중 40곳입니다. ‘있어도 반드시 그렇게 되지는 않는다’는 쪽입니다." },
  { label: "충분한 표지라면", summary: "다른 업종 50곳이 0곳이어야", groups: ["dimElectronics", "other", "dimNoCard"], note: "카드 결제만으로 업종이 정해지려면 실선 안에 전자제품 가게만 있어야 합니다. 이 사례에는 다른 업종 50곳이 남아 있어 충분한 표지가 아닙니다." },
] as const;

export default function ConditionRowsViz() {
  return (
    <SceneShell
      eyebrow="없을 때와 있을 때"
      title="카드 결제가 없을 때와 있을 때를 따로 셉니다"
      description="3절의 100곳에서 필요 조건과 충분한 조건을 나누어 봅니다. 묵가의 구분을 가게 사례에 빌려 온 것으로, 현대 논리 기호와 같은 체계라는 뜻은 아닙니다."
      ariaLabel="카드 결제 유무에 따라 전자제품 가게를 센 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return <StoreGrid groups={scene.groups} showCardOutline ariaLabel={`${scene.label}: ${scene.summary}`} />;
      }}
    />
  );
}
