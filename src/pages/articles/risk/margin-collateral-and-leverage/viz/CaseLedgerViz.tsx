import LedgerBars from "./LedgerBars";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 자기 돈 20 + 차입 80 = 자산 100, 대출은 자산의 80% 이하(가정).
 * 90으로 내리면 자기 몫 10(절반), 한도 90×0.8=72, 빚 80−72=8 부족.
 */
const SCENES = [
  { label: "처음", summary: "자기 돈 20 + 빌린 돈 80", asset: 100, showLimit: true, note: "자산 100억 원 가운데 80억 원이 빚입니다. 80%까지 빌려주는 계약이라 빚이 한도선에 정확히 닿아 있습니다." },
  { label: "가격이 10억 원 내림", summary: "자기 몫 20 → 10", asset: 90, showLimit: false, note: "빚은 80억 원 그대로이므로 내린 10억 원은 자기 몫에서 먼저 빠집니다. 자산은 10% 내렸는데 자기 몫은 절반이 됩니다." },
  { label: "한도를 다시 계산", summary: "90 × 80% = 72 → 8 부족", asset: 90, showLimit: true, note: "자기 몫이 10억 원 남아도 한도선은 72억 원으로 옮겨 갑니다. 빚이 선을 넘은 8억 원을 갚거나 그에 맞는 자산을 더 넣어야 합니다." },
] as const;

export default function CaseLedgerViz() {
  return (
    <SceneShell
      eyebrow="100억 원 사례"
      title="가격이 내리면 자기 몫이 먼저 줄고, 한도선도 함께 내려옵니다"
      description="한도는 대출자가 자산 가치의 몇 %까지 빌려주기로 한 금액입니다. 단위는 억 원입니다."
      note="80%는 설명용 가정이며 특정 나라 주식 신용거래의 실제 허용 비율이 아닙니다."
      ariaLabel="자산 100억 원이 90억 원으로 내릴 때 자기 몫과 대출 한도의 변화"
      scenes={SCENES}
      render={(active) => <LedgerBars asset={SCENES[active].asset} debt={80} ratio={0.8} showLimit={SCENES[active].showLimit} />}
    />
  );
}
