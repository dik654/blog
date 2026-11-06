import LedgerBars from "./LedgerBars";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 자산 90·빚 80의 부족을 메우는 방법별 금액.
 * 현금 8 → 90/72. 담보 10 → 100/80. 매각 8 → 82/72, 한도 65.6, 부족 6.4. 매각 40 → 50/40.
 * 70%: 현금 17 → 90/63. 매각 56.67 → 33.33/23.33.
 * 매각 1억 원당 부족 감소: 80%는 1−0.8=0.2, 70%는 1−0.7=0.3 → 8÷0.2=40, 17÷0.3≈56.67.
 */
const SCENES = [
  { label: "출발점", summary: "자산 90 · 빚 80 · 8 부족", asset: 90, debt: 80, ratio: 0.8, note: "세 방법 모두 이 장부에서 시작합니다. 점선은 조치 전 자산 90억 원의 크기입니다." },
  { label: "외부 현금으로 상환", summary: "8억 원이면 맞음", asset: 90, debt: 72, ratio: 0.8, note: "자산은 그대로라 한도선도 72억 원에 머뭅니다. 밖에서 가져온 8억 원만큼 빚이 줄어 선에 닿습니다." },
  { label: "같은 인정률의 자산 추가", summary: "10억 원 필요", asset: 100, debt: 80, ratio: 0.8, note: "빚은 그대로 두고 한도선을 올립니다. 새 자산에도 같은 80%를 적용하면 1억 원이 한도를 0.8억 원 올리므로 8 ÷ 0.8 = 10억 원을 맡깁니다." },
  { label: "자산 8억 원을 판다면", summary: "82 · 72 · 아직 6.4 부족", asset: 82, debt: 72, ratio: 0.8, note: "빚과 함께 자산도 줄어 한도선이 65.6까지 내려옵니다. 1억 원을 팔 때 빚은 1, 한도는 0.8 줄어 부족은 0.2억 원만 줄어듭니다." },
  { label: "자산 40억 원을 판다면", summary: "8 ÷ 0.2 = 40", asset: 50, debt: 40, ratio: 0.8, note: "80−x = 0.8×(90−x)의 답 x=40입니다. 자산 50, 빚 40으로 비율이 맞습니다. 자기 몫 10은 그대로이고 보유 자산만 줄었습니다." },
  { label: "70%로 낮아지면 · 현금", summary: "17억 원 상환", asset: 90, debt: 63, ratio: 0.7, note: "한도선이 90 × 70% = 63억 원이므로 외부 현금 17억 원을 갚아야 합니다." },
  { label: "70%로 낮아지면 · 매각", summary: "약 56.67억 원 매각", asset: 33.33, debt: 23.33, ratio: 0.7, note: "1억 원을 팔 때 부족이 0.3억 원씩 줄어 17 ÷ 0.3 ≈ 56.67입니다. 자산 약 33.33, 빚 약 23.33이 남습니다." },
] as const;

export default function CureOptionsViz() {
  return (
    <SceneShell
      eyebrow="부족을 메우는 세 방법"
      title="같은 부족을 메워도 현금 8억, 담보 10억, 매각 40억으로 금액이 다릅니다"
      description="장면마다 어느 막대가 움직이고 한도선이 어디로 가는지 보세요. 단위는 억 원이고 금액과 비율은 모두 가정입니다."
      note="가격 90 고정 기준입니다. 수수료와 가격 충격을 생략했으므로 실제 필요액은 더 클 수 있습니다."
      ariaLabel="현금 상환, 추가 담보, 자산 매각에 필요한 금액 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return <LedgerBars asset={scene.asset} debt={scene.debt} ratio={scene.ratio} ghostAsset={90} />;
      }}
    />
  );
}
