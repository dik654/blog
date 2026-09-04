import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import UsdcLifecycleViz from "./viz/UsdcLifecycleViz";

export default function ModernUsdcArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">USDC · issuer and chain boundary</p><h2 className="text-3xl font-bold tracking-tight">USDC는 reserve-backed issuer liability와 여러 chain의 token supply를 함께 맞추는 시스템이다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">고정 사례는 eligible Circle Mint 고객이 100달러를 입금해 Ethereum에서 100 USDC를 mint한 뒤, 25 USDC를 CCTP로 다른 domain에 옮기는 흐름입니다. 첫 단계는 은행 rail·issuer ledger·token mint이고, 두 번째는 source burn·message attestation·destination mint입니다. 둘은 같은 ‘1:1’ 문구로 합칠 수 없습니다.</p>
      <ContentBoundary article="usdc-circle" />
      <UsdcLifecycleViz />
      <div id="paper-circle-transparency"><CitationBlock source="Circle · Transparency & Stability" citeKey={1} href="https://www.circle.com/transparency"><p><strong>문제:</strong> Circulating USDC와 이를 뒷받침한다고 발행자가 공개하는 reserve·assurance를 사용자가 확인해야 합니다.</p><p><strong>기여:</strong> Reserve 구성, weekly disclosure와 monthly third-party assurance의 issuer disclosure surface를 제공합니다.</p><p><strong>전제:</strong> Circle이 게시한 현재 issuer claim이며 링크의 시점·scope를 함께 기록합니다.</p><p><strong>근거 범위:</strong> Circle의 reserve disclosure·assurance cadence와 1:1 redeemability claim입니다.</p><p><strong>말하지 않는 것:</strong> Assurance가 financial-statement audit·실시간 proof·모든 사용자의 즉시 은행 상환이나 secondary-market $1 체결을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="issuance-redemption" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · mint and redeem</p><h2 className="mt-2 text-2xl font-bold">100달러 입금→100 mint와 40 burn→40달러 지급을 두 개의 reconciled receipt로 남긴다</h2></header>
      <p>Mint receipt에는 customer eligibility, fiat settlement reference, destination chain·address, amount와 transaction hash를 묶습니다. Redemption은 token burn receipt와 bank payout receipt가 모두 있어야 닫힙니다. <code>burned</code>는 은행 지급 완료와 같지 않고, 거래소에서 100 USDC를 산 사용자가 Circle Mint 상환 자격을 자동으로 얻는 것도 아닙니다.</p>
      <ExplainedFormula question="한 chain의 USDC circulating supply는 issuer mint·burn과 어떻게 reconcile할까요?" idea="이전 supply에 confirmed mint를 더하고 confirmed burn을 뺍니다. Bridge-wrapped token이나 pending message는 별도 bucket입니다." formula={String.raw`S_t=S_{t-1}+M_t-B_t`}
      annotatedFormula={String.raw`S_t=\underbrace{S_{t-1}+M_t-B_t}_{\text{confirmed supply 계산}}`}
      operations={[
        { expression: String.raw`S_{t-1}+M_t-B_t`, annotation: ["confirmed supply이(가) 식의 결과에 기여하는","방식을 계산합니다.","이전 supply에 confirmed mint를 더하고","confirmed burn을 뺍니다."] },
      ]} terms={[{symbol:"S_t",name:"confirmed supply",description:"시점 t의 해당 native USDC contract confirmed circulating supply입니다."},{symbol:"M_t",name:"confirmed mint",description:"기간 중 issuer 또는 authorized minter가 완료한 mint 합계입니다."},{symbol:"B_t",name:"confirmed burn",description:"기간 중 완료된 native burn 합계입니다."}]} assumptions={["같은 chain·contract·block finality와 decimal 단위를 사용합니다.","Pending transaction과 bridge representation을 confirmed native supply에 섞지 않습니다.","Reserve snapshot의 valuation time과 supply snapshot time을 함께 기록합니다.","이 식은 reserve asset quality·redemption queue latency를 증명하지 않습니다."]} interpretation="이전 supply 1,000, mint 100, burn 40이면 1,060입니다. Reserve가 1,060달러라고 가정하려면 별도의 disclosure·valuation evidence가 필요합니다." />
      <div id="paper-circle-mint"><CitationBlock source="Circle Mint · How minting works" citeKey={2} href="https://developers.circle.com/circle-mint/concepts/how-minting-works"><p><strong>문제:</strong> Fiat deposit·account eligibility와 onchain mint를 잇는 operational flow가 필요합니다.</p><p><strong>기여:</strong> Circle Mint의 funding, mint, transfer와 redemption interface를 설명합니다.</p><p><strong>전제:</strong> Supported account·bank rail·asset·chain과 당시 Circle Mint terms를 사용합니다.</p><p><strong>근거 범위:</strong> Issuer-facing mint/redemption lifecycle의 공식 문서 범위입니다.</p><p><strong>말하지 않는 것:</strong> 모든 holder가 Circle Mint customer이거나 payout이 즉시·무조건 완료된다는 뜻은 아닙니다.</p></CitationBlock></div>
    </section>

    <section id="cctp-burn-mint" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · CCTP</p><h2 className="mt-2 text-2xl font-bold">CCTP는 source USDC를 lock한 wrapper가 아니라 burn message를 attest한 뒤 destination native USDC를 mint한다</h2></header>
      <p>25 USDC transfer는 source domain의 <code>depositForBurn</code>에서 시작합니다. Message에는 source·destination domain, nonce, recipient, amount, finality threshold 같은 identity가 들어갑니다. Attestation service가 burn event를 확인한 뒤 destination <code>receiveMessage</code>가 signature와 message uniqueness를 검증하고 25를 mint합니다. Source burn만 끝난 중간 상태는 손실이 아니라 pending이지만, retry는 같은 message를 두 번 mint하지 않아야 합니다.</p>
      <p>
            Recipient bytes, domain mapping, contract version, finality threshold와 fee를 고정하지 않은 UI quote는
            execution contract가 아닙니다. Destination mint 전에 message hash를 저장하고 duplicate·wrong domain·wrong
            recipient·insufficient finality를 fail closed로 시험합니다.
          </p>
      <div id="paper-circle-cctp"><CitationBlock source="Circle · CCTP Technical Guide and Contracts" citeKey={3} type="code" href="https://developers.circle.com/cctp/references/technical-guide"><p><strong>문제:</strong> Native USDC를 source에서 제거하고 destination에서 중복 없이 다시 발행해야 합니다.</p><p><strong>기여:</strong> Burn message, attestation, domain routing, MessageTransmitter·TokenMessenger/TokenMinter lifecycle을 정의합니다.</p><p><strong>전제:</strong> 선택한 CCTP version, supported domains/contracts, finality policy와 Circle attestation service를 고정합니다.</p><p><strong>근거 범위:</strong> CCTP native burn-and-mint protocol과 message verification surface입니다.</p><p><strong>말하지 않는 것:</strong> General bridge security·destination application safety·issuer reserve solvency나 zero-latency delivery를 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="reserve-release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · release</p><h2 className="mt-2 text-2xl font-bold">Reserve snapshot·supply·bank payout·CCTP message를 같은 날짜와 version으로 묶는다</h2></header>
      <p>Release matrix는 100 mint, 40 redeem, 25 cross-domain burn/mint를 같은 fixture로 재생합니다. Supply equation, issuer ledger, reserve disclosure date, bank payout status, CCTP source/destination transaction과 nonce를 대조합니다. Wrong recipient, duplicate message, attestation delay, chain reorg와 issuer redemption pause를 주입하고 pending·failed·completed 상태를 구분합니다.</p>
      <p>기초 6문제는 issuer mint/redeem과 CCTP burn/mint, supply 계산, reserve assurance 경계를 묻습니다. 심화 4문제는 replay·finality·snapshot mismatch와 release rollback을 설계하게 합니다.</p>
    </section>
  </article>;
}
