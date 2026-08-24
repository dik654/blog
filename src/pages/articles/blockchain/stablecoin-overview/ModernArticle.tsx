import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import StablecoinSystemViz from "./viz/StablecoinSystemViz";

export default function ModernStablecoinOverviewArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Stablecoin · system boundary</p><h2 className="text-3xl font-bold tracking-tight">스테이블코인은 ‘1달러 토큰’이 아니라 목표 가격을 발행·상환·시장 거래로 연결한 장치다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">처음 보는 사람은 화면의 <strong>$1.00</strong>부터 보지만, 검증은 그 뒤에서 시작합니다. 기준 자산이 무엇인지, 누가 토큰을 발행하고 어떤 조건으로 상환하는지, 준비금이나 담보를 누가 보관하는지, 시장 가격이 흔들릴 때 어떤 메커니즘과 책임 주체가 작동하는지를 따로 적어야 합니다.</p>
      <p>이 글의 고정 사례는 목표 가격 1달러, 시장 가격 0.97달러인 토큰입니다. 3% 할인은 관측 가능한 가격 이탈일 뿐입니다. 발행자에게 1달러 상환권이 있는지, 담보 가치가 충분한지, 상환 창구가 열려 있는지는 이 숫자만으로 알 수 없습니다. Stablecoin은 bank deposit·money-market fund·CBDC와도 같은 법적 claim이 아닙니다.</p>
      <ContentBoundary article="stablecoin-overview" />
      <StablecoinSystemViz />
      <div id="paper-fsb-stablecoin"><CitationBlock source="FSB · Global Stablecoin Recommendations (2023)" citeKey={1} href="https://www.fsb.org/2023/07/high-level-recommendations-for-the-regulation-supervision-and-oversight-of-global-stablecoin-arrangements-final-report/"><p><strong>문제:</strong> 발행·상환·안정화·이전·사용자 접점이 여러 주체에 흩어진 stablecoin arrangement를 일관되게 감독해야 합니다.</p><p><strong>기여:</strong> Governance, risk management, recovery, disclosure, legal claim·redemption과 stabilization requirements를 기능 단위로 제시합니다.</p><p><strong>전제:</strong> Global stablecoin arrangement에 대한 2023 high-level regulatory recommendation입니다.</p><p><strong>근거 범위:</strong> Stablecoin을 token 하나가 아닌 연결된 기능과 책임으로 읽는 분류 근거입니다.</p><p><strong>말하지 않는 것:</strong> 특정 토큰의 준비금 건전성·상환 성공·가격 안정이나 법률 자문을 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="stabilization-mechanisms" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · mechanism</p><h2 className="mt-2 text-2xl font-bold">Fiat reserve·crypto collateral·algorithmic incentive는 서로 다른 failure owner를 가진다</h2></header>
      <p><strong>법정화폐 담보형</strong>은 발행자의 reserve·custodian·redemption rail을 신뢰합니다. <strong>암호자산 담보형</strong>은 onchain collateral, oracle, debt ceiling과 liquidation에 의존합니다. <strong>알고리즘형</strong>은 별도 자산과 mint/burn incentive로 수요 충격을 흡수하려 하지만, reflexive collateral과 얇은 liquidity가 함께 무너지면 이름만으로 상환 능력이 생기지 않습니다. Hybrid는 이 경계를 섞으므로 ‘네 가지 유형’ 같은 고정 분류보다 실제 asset·claim·control을 추적해야 합니다.</p>
      <ExplainedFormula question="목표가 1달러일 때 시장 가격 이탈을 어떻게 같은 단위로 비교할까요?" idea="시장 가격과 기준 가격의 절대 차이를 기준 가격으로 나눕니다. 방향은 별도 signed gap으로 보존합니다." formula={String.raw`d=\frac{|P_{market}-P_{target}|}{P_{target}}`}
      annotatedFormula={String.raw`d=\underbrace{\frac{|P_{market}-P_{target}|}{P_{target}}}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`\frac{|P_{market}-P_{target}|}{P_{target}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","시장 가격과 기준 가격의 절대 차이를 기준 가격으로 나눕니다."] },
      ]} terms={[{symbol:"d",name:"relative price deviation",description:"목표 대비 시장 가격 이탈률이며 무차원 비율입니다."},{symbol:"P_market",name:"market price",description:"특정 venue·시간·quote currency에서 관측한 거래 가격입니다."},{symbol:"P_target",name:"reference target",description:"발행·프로토콜이 목표로 삼는 기준 가격입니다."}]} assumptions={["같은 시각·quote currency·price source를 사용합니다.","Thin market의 한 체결가보다 depth-weighted observation을 함께 봅니다.","가격 이탈은 reserve deficit·법적 claim·상환 가능성의 직접 측정값이 아닙니다.","가격 source와 window를 evidence에 기록합니다."]} interpretation="Ptarget=1, Pmarket=0.97이면 d=0.03, 즉 3%입니다. 그러나 준비금이 97%라는 결론은 나오지 않습니다." />
    </section>

    <section id="failure-boundaries" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · failure map</p><h2 className="mt-2 text-2xl font-bold">Depeg를 발견하면 가격보다 먼저 상환 queue와 backing ledger의 끊어진 edge를 찾는다</h2></header>
      <p>같은 0.97달러라도 원인은 다릅니다. 은행 영업시간·KYC 때문에 상환이 지연될 수 있고, reserve asset의 만기·유동성이 맞지 않을 수 있습니다. Crypto-backed 구조에서는 oracle lag나 liquidation congestion이, bridge-wrapped token에서는 canonical issuer가 아닌 bridge custody가 failure owner일 수 있습니다. Governance pause·sanctions·chain finality도 별도 경계입니다.</p>
      <p>따라서 incident ledger는 <code>price source/time</code>, circulating supply, redeemable population, reserve·collateral snapshot, queue·settlement status, oracle/bridge/governance version을 한 줄에 묶습니다. 한 축만 정상이라고 전체가 안전하다고 판정하지 않습니다.</p>
      <div id="paper-bis-stablecoin"><CitationBlock source="BIS Working Paper 905 · Stablecoins: risks, potential and regulation" citeKey={2} href="https://www.bis.org/publ/work905.htm"><p><strong>문제:</strong> 다양한 stablecoin 설계가 지급·금융안정에 주는 효용과 위험을 구분해야 합니다.</p><p><strong>기여:</strong> Backing, governance, settlement, network와 market-liquidity risk를 함께 분석합니다.</p><p><strong>전제:</strong> 2020년 공개 설계와 당시 시장을 분석한 정책 연구입니다.</p><p><strong>근거 범위:</strong> Stablecoin 유형별 위험 축을 비교하는 개념 근거입니다.</p><p><strong>말하지 않는 것:</strong> 2026년 개별 발행자·토큰의 현재 reserve나 규제 지위를 판정하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="stablecoin-release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · release gate</p><h2 className="mt-2 text-2xl font-bold">채택은 ‘페그 유지’ 한 줄이 아니라 발행·상환·stress·복구 증거 묶음으로 결정한다</h2></header>
      <p>Release fixture는 정상 mint/redeem, 3% depeg, reserve disclosure 지연, oracle stale, liquidation backlog, bridge pause, governance parameter change를 같은 version에서 재생합니다. 가격 회복뿐 아니라 claim holder가 누구인지, queue가 어떻게 닫혔는지, 손실이 누구에게 귀속됐는지, rollback 또는 exit 경로가 남았는지를 확인합니다.</p>
      <p>기초 6문제는 target·market·redemption, 세 backing mechanism, 3% deviation과 failure owner를 묻습니다. 심화 4문제는 run, oracle·bridge 반례, incident ledger와 release matrix를 설계하게 합니다.</p>
    </section>
  </article>;
}
