import { StableSceneStack } from "@/components/viz/StableSceneStack";
import LedgerBoard from "./LedgerBoard";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #balance-sheet-policy — 채권 6을 은행에서 살 때와 비은행 고객에게서 살 때의 장부.
 * 중앙은행 쪽은 같고 고객 예금의 직접 변화만 0과 +6으로 갈린다.
 */
const SCENES = [
  {
    label: "은행에서 살 때",
    summary: "채권 6 → 준비금 6",
    note: "은행이 가진 채권 6을 준비금 6으로 교환하면 은행 자산의 구성이 바뀝니다. 고객 예금은 이 거래만으로 직접 늘지 않습니다.",
    total: "직접 변화 없음",
    accounts: [
      { name: "중앙은행", assets: ["채권 +6"], liabilities: ["준비금 +6"] },
      { name: "은행", assets: ["채권 −6", "준비금 +6"], liabilities: [] },
      { name: "비은행 고객", assets: [], liabilities: [] },
    ],
  },
  {
    label: "비은행 고객에게서 살 때",
    summary: "준비금·예금이 함께 +6 가능",
    note: "은행이 고객 계좌에 6을 지급하면 준비금과 고객 예금이 함께 늘 수 있습니다. 고객은 채권을 예금으로 바꾼 것이므로 거래 자체가 순재산 6의 증가는 아닙니다.",
    total: "+6 가능 (새 대출 수요 없이도)",
    accounts: [
      { name: "중앙은행", assets: ["채권 +6"], liabilities: ["준비금 +6"] },
      { name: "은행", assets: ["준비금 +6"], liabilities: ["고객 예금 +6"] },
      { name: "비은행 고객", assets: ["채권 −6", "예금 +6"], liabilities: [] },
    ],
  },
] as const;

export default function QeLedgerViz() {
  return (
    <SceneShell
      eyebrow="양적완화의 장부"
      title="채권을 누구에게서 사는지에 따라 고객 예금의 직접 변화가 갈립니다"
      description="양적완화는 중앙은행이 장기 국채 등을 대규모로 사서 금융 조건에 영향을 주는 정책입니다. 표는 채권 6을 살 때의 변화입니다."
      ariaLabel="중앙은행이 채권을 은행과 비은행 고객에게서 살 때의 장부 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <LedgerBoard key={scene.label} accounts={scene.accounts} total={scene.total} totalLabel="고객 예금" />
          ))}
        />
      )}
    />
  );
}
