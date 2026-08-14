import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import DaiVaultViz from "./viz/DaiVaultViz";

export default function ModernDaiArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">DAI · collateralized debt boundary</p><h2 className="text-3xl font-bold tracking-tight">DAI를 이해하는 출발점은 token 가격이 아니라 Vat의 collateral·normalized debt·rate 장부다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">고정 사례는 oracle 가치 150달러인 collateral을 Vault에 넣고 100 DAI debt를 만드는 설명용 position입니다. Collateral ratio는 150%입니다. 그러나 liquidation threshold·debt ceiling·fee·auction parameter는 collateral type과 governance version에 따라 달라지므로 150%를 현재 안전선으로 일반화하지 않습니다.</p>
      <p>이 글은 역사적 Maker/Sky의 DAI core contract 구조를 설명합니다. 현재 Sky ecosystem의 USDS·SKY product, governance migration과 DAI의 실제 parameter는 별도 versioned deployment surface입니다. ‘MakerDAO가 지금도 모든 이름과 값을 그대로 유지한다’는 전제로 읽지 않습니다.</p>
      <ContentBoundary article="dai-maker" />
      <DaiVaultViz />
      <div id="paper-dai-dss"><CitationBlock source="Sky ecosystem · Multi-Collateral DAI core (pinned)" citeKey={1} type="code" href="https://github.com/sky-ecosystem/dss/tree/fa4f6630afb0624d04a003e920b0d71a00331d98"><p><strong>문제:</strong> 여러 collateral type의 담보·부채·rate·authorization을 정밀한 core ledger에서 관리해야 합니다.</p><p><strong>기여:</strong> Vat, Spot, Jug, Dog/Clipper와 adapters의 executable contract boundary를 제공합니다.</p><p><strong>전제:</strong> Commit fa4f6630과 해당 Solidity arithmetic·authorization model을 고정합니다.</p><p><strong>근거 범위:</strong> Pinned DAI core source의 state·module seam과 failure behavior입니다.</p><p><strong>말하지 않는 것:</strong> 현재 mainnet parameter·governance decision·collateral 가격·Sky product 전체를 고정하거나 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="vault-debt-collateral" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · vault ledger</p><h2 className="mt-2 text-2xl font-bold">Token 수량, oracle 가치, normalized debt와 누적 rate를 한 숫자로 뭉치지 않는다</h2></header>
      <p>Vault의 collateral token은 adapter를 거쳐 collateral type(<code>ilk</code>) 장부에 들어갑니다. 사용자가 늘리거나 줄이는 normalized debt(<code>art</code>)에 collateral type 공통 누적 multiplier(<code>rate</code>)를 곱해야 현재 debt가 됩니다. Oracle price와 safety margin이 collateral value를 제한합니다. Wallet에 보이는 DAI, Vat 내부 DAI와 outstanding debt도 서로 다른 state입니다.</p>
      <ExplainedFormula question="설명용 Vault의 collateral ratio와 현재 debt를 어떻게 분리해 계산할까요?" idea="Collateral token 수량에 oracle price를 곱해 가치 V를 만들고, normalized debt에 누적 rate를 곱해 debt D를 만든 뒤 비율을 계산합니다." formula={String.raw`\begin{aligned}D&=art\times rate\\CR&=\frac{V_{collateral}}{D}\times100\%\end{aligned}`} terms={[{symbol:"art",name:"normalized debt",description:"Vault가 보유한 rate 적용 전 debt unit입니다."},{symbol:"rate",name:"accumulated debt multiplier",description:"Collateral type별 stability fee accrual을 누적한 multiplier입니다."},{symbol:"V_collateral",name:"oracle-valued collateral",description:"담보 수량에 versioned oracle price와 unit conversion을 적용한 가치입니다."},{symbol:"CR",name:"collateral ratio",description:"현재 debt 대비 oracle-valued collateral의 비율입니다."}]} assumptions={["동일 시점의 oracle, rate와 token decimals를 사용합니다.","Liquidation threshold는 collateral type의 versioned parameter로 별도 조회합니다.","Oracle stale·debt ceiling·auction liquidity를 이 비율 하나로 대체하지 않습니다.","0 debt에서는 비율로 liquidation 판단을 하지 않습니다."]} interpretation="V=150, art=100, rate=1이면 D=100, CR=150%입니다. Rate가 1.05로 오르면 debt=105, CR≈142.86%가 됩니다." />
    </section>

    <section id="liquidation-peg-tools" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · oracle, liquidation, peg tools</p><h2 className="mt-2 text-2xl font-bold">Unsafe 판정·collateral sale·bad debt 처리와 PSM swap은 서로 다른 상태 전이다</h2></header>
      <p>Oracle update로 risk-adjusted collateral value가 debt 아래로 내려가면 liquidation module이 unsafe Vault debt·collateral을 떼어내고 auction 경로로 보냅니다. Auction 낙찰은 oracle 판정과 같지 않으며, congestion·price gap·keeper failure가 남습니다. Stability fee accrual은 debt를 늘리고, savings rate는 별도 holder incentive입니다.</p>
      <p>Peg Stability Module(PSM)은 승인된 stablecoin과 DAI를 governance fee 조건으로 교환해 direct arbitrage rail을 제공합니다. 이는 모든 DAI를 fiat reserve로 바꾸는 선언이 아닙니다. PSM collateral issuer risk, debt ceiling, pause, fees와 liquidity를 별도 기록합니다.</p>
      <div id="paper-dai-psm"><CitationBlock source="Sky ecosystem · Lite PSM (pinned)" citeKey={2} type="code" href="https://github.com/sky-ecosystem/dss-lite-psm/tree/dbf0022225f645f5697e5517d0cf00810471bccf"><p><strong>문제:</strong> Approved stablecoin과 DAI 사이의 low-slippage peg rail을 Vat interaction 비용과 risk limit 아래 운영해야 합니다.</p><p><strong>기여:</strong> Lite PSM·Pocket·Mom lifecycle, fees와 capacity control의 executable implementation을 제공합니다.</p><p><strong>전제:</strong> Commit dbf00222, configured gem·fees·bud·line과 issuer token behavior를 고정합니다.</p><p><strong>근거 범위:</strong> Pinned Lite PSM swap·liquidity architecture입니다.</p><p><strong>말하지 않는 것:</strong> PSM collateral의 무위험성, unlimited redemption, fee 0 또는 DAI 전체가 fiat-backed라는 뜻이 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="dai-release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · release gate</p><h2 className="mt-2 text-2xl font-bold">Parameter snapshot과 module generation이 없는 ‘health check’는 재현할 수 없다</h2></header>
      <p>Release fixture는 V=150, art=100, rate=1에서 시작해 rate 1.05, oracle price drop, threshold crossing, auction delay와 PSM pause를 순서대로 재생합니다. Vat urn/ilk, Spot/Jug timestamp, Dog·Clip version, auction receipt, PSM inventory·fee·line을 같은 block과 deployment manifest로 묶습니다.</p>
      <p>기초 6문제는 collateral/debt/rate/ratio, liquidation과 PSM 경계를 묻습니다. 심화 4문제는 oracle stale·auction gap·PSM issuer risk·migration release matrix를 설계하게 합니다.</p>
    </section>
  </article>;
}
