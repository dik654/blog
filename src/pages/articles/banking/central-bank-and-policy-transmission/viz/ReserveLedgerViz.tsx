import { StableSceneStack } from "@/components/viz/StableSceneStack";
import LedgerBoard from "./LedgerBoard";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case·#cb-balance-sheet — 같은 부족분 6을 B에게 빌릴 때와 중앙은행에서 빌릴 때.
 * A의 준비금은 둘 다 14 → 20. 은행 전체 준비금 변화는 0과 +6으로 갈린다.
 */
const SCENES = [
  {
    label: "B에게 빌릴 때",
    summary: "A +6 · B −6 = 전체 0",
    note: "B가 6을 보내면 A가 쓸 돈은 14에서 20으로 늘고 B가 쓸 돈은 6 줄어듭니다. 은행 전체의 지급용 돈은 이 거래만으로 늘지 않습니다.",
    total: "변화 없음",
    accounts: [
      { name: "A은행", assets: ["준비금 +6"], liabilities: ["B에게 갚을 돈 +6"] },
      { name: "B은행", assets: ["준비금 −6", "A에게 받을 돈 +6"], liabilities: [] },
      { name: "중앙은행", assets: [], liabilities: ["A 준비금 +6", "B 준비금 −6"] },
    ],
  },
  {
    label: "중앙은행에서 빌릴 때",
    summary: "A +6 = 전체 +6",
    note: "A의 준비금은 똑같이 20이 되지만 이번에는 중앙은행의 준비금 부채가 새로 늘어납니다. 다른 거래가 없다면 은행 전체 준비금은 6 늘어납니다.",
    total: "+6 (다른 거래가 없다면)",
    accounts: [
      { name: "A은행", assets: ["준비금 +6"], liabilities: ["중앙은행 차입 +6"] },
      { name: "B은행", assets: [], liabilities: [] },
      { name: "중앙은행", assets: ["A 대출 +6"], liabilities: ["A 준비금 +6"] },
    ],
  },
] as const;

export default function ReserveLedgerViz() {
  return (
    <SceneShell
      eyebrow="장부 비교"
      title="같은 6을 메워도 은행 전체 준비금은 달라집니다"
      description="표에는 이 거래가 만든 변화만 적었습니다. 단위는 억 원이고 B의 원래 잔액은 글에 없습니다."
      ariaLabel="은행 간 차입과 중앙은행 차입의 장부 변화 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <LedgerBoard key={scene.label} accounts={scene.accounts} total={scene.total} totalLabel="은행 전체 준비금" />
          ))}
        />
      )}
    />
  );
}
