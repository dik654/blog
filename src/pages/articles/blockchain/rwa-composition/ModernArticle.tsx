import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../../world-systems/FlowRail";
import SourceApplication from "../../world-systems/SourceApplication";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
export default function ModernRwaCompositionArticle() { return <article className="space-y-14">
<section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">1. 화면의 토큰 잔액이 실제 자산의 어떤 권리를 뜻하는가</h2>
<p>국채나 펀드 지분을 토큰으로 옮기면 지갑에서 전달하고 계약에 연결하기 쉬워집니다. 하지만 돈을 받을 권리는 발행 조건과 등록부, 자산을 맡은 기관, 지급 절차로 정해집니다. 체인의 잔액이 바뀐 뒤 은행 계좌에 현금이 들어올 때까지 어떤 절차가 남는지 확인해야 합니다.</p><p>이 글은 작은 가상 펀드를 먼저 계산한 뒤 BlackRock의 BUIDL을 실제 기관 사례로 비교합니다. 계산용 가격 1.02와 실제 BUIDL이 목표로 하는 1달러는 서로 다른 사례 조건입니다. 확인일은 2026-10-04이며 과거 출시 조건을 모든 현재 지분 종류의 조건으로 확대하지 않습니다.</p>
<p data-stage-bridge="overview" className="text-sm text-muted-foreground">토큰과 지급 권리를 함께 보려면 돈과 기록을 맡는 역할부터 나눠야 합니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">2. 자산을 운용하는 곳과 보유자를 기록하는 곳</h2>
<FlowRail title="기관 자산의 권리와 지급을 연결하는 역할" steps={[{actor:"자산 운용·보관",movement:"현금과 증권을 투자하고 보관합니다.",receives:"평가한 순자산"},{actor:"발행·등록",movement:"보유 자격과 지분 수를 기록합니다.",receives:"이전 가능한 권리"},{actor:"매매·상환",movement:"양도하거나 조건에 따라 회수합니다.",receives:"대금 또는 은행 입금"}]} /><p>운용사는 무엇을 살지 결정하고 수탁자는 정한 자산을 보관합니다. 명의개서 기관은 누가 지분을 보유하는지 기록합니다. 거래 상대방은 지분을 사는 사람이며 항상 펀드 자체와 같지는 않습니다. 각 역할을 합쳐 “블록체인이 보장한다”고 적으면 실패 지점을 찾기 어렵습니다.</p>
<p data-stage-bridge="black-box" className="text-sm text-muted-foreground">역할을 나눴으니 작은 장부의 자산과 발행 수를 계산합니다.</p>
</section>
<section id="case" data-teach-level="0" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">3. 순자산 102를 100개로 나누면 개당 1.02다</h2>
<p>모든 금액을 달러로 두고, 자산 평가액 105에서 지급할 비용·부채 3을 빼면 순자산 102입니다. 발행 지분 100개로 나누면 개당 1.02입니다. 보유자 A의 10개는 같은 평가 기준으로 10.20이며,100개 전부를 담보로 보는 대출자가 20%를 할인하면 102×0.8=81.60입니다. 모두 설명용 가정입니다.</p><p>81.60은 담보를 평가한 금액입니다. 실제 대출 한도와 같으려면 추가 담보비율·집중도 제한 등 다른 조건이 없다는 가정이 필요합니다. 10.20도 지금 즉시 그 가격으로 팔 수 있다는 약속이 아닙니다. 평가 기준 시각과 실제 거래 상대방이 필요합니다.</p>
<p data-stage-bridge="case" className="text-sm text-muted-foreground">계산 결과를 자산 장부와 토큰 장부의 두 줄로 그려 봅니다.</p>
</section>
<section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">4. 105−3의 자산 장부와 100개의 권리 장부를 맞춘다</h2>
<div className="grid gap-4 md:grid-cols-2"><div className="rounded-xl border p-5"><h3 className="font-bold">기초 자산 장부</h3><p className="mt-3">자산 105 − 부채·비용 3 = 순자산 102</p><p className="mt-2 text-sm">수탁 명세·가격·미지급 비용·평가 시각을 확인합니다.</p></div><div className="rounded-xl border p-5"><h3 className="font-bold">보유 권리 장부</h3><p className="mt-3">발행 100 × 개당 1.02 = 순자산 102</p><p className="mt-2 text-sm">발행·소각·등록 보유자와 토큰 공급량을 맞춥니다.</p></div></div><p>두 장부가 같은 시각을 가리켜야 합니다. 신규 입금만 반영하고 발행할 지분을 빠뜨리거나, 소각만 반영하고 상환할 현금을 빼지 않으면 개당 가치가 일시적으로 부풀어 보입니다. A의 10개 이전도 어느 등록부를 언제 갱신하는지 연결해야 합니다.</p>
<p data-stage-bridge="picture" className="text-sm text-muted-foreground">두 장부의 합계가 같아야 하는 이유가 보였습니다. 체인 잔액만 읽을 때 놓치는 일을 살펴봅니다.</p>
</section>
<section id="need" data-teach-level="2" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">5. 24시간 옮길 수 있어도 24시간 같은 가격으로 팔리지는 않는다</h2>
<p>A가 주말에 10개를 보내는 것은 계약이 허용하면 가능합니다. 그러나 자산 시장이 닫혔거나 환매 창구가 쉬면 10.20에 현금을 회수할 경로가 바로 열리지 않을 수 있습니다. 시세를 내는 상대방은 이 지연과 가격 위험을 견적에 반영합니다.</p><p>보유 자격이 필요한 지분은 받는 주소나 담보 계약도 자격 조건을 만족해야 합니다. 계약이 transfer를 지원한다는 사실만으로 그 권리를 누구나 합법적으로 취득하거나 다른 프로토콜에서 담보로 쓸 수 있다고 판단하지 않습니다. 정지·동결·오발행 정정 권한도 권리의 조건에 포함됩니다.</p>
<p data-stage-bridge="need" className="text-sm text-muted-foreground">이전·평가·회수를 구분했으니 관련 용어를 사례에 붙입니다.</p>
</section>
<section id="claim-asset-map" data-teach-level="3" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">6. 순자산 가치와 명의개서, 시장 매매와 상환</h2>
<p>105−3의 102는 순자산,102/100의 1.02는 지분당 순자산 가치(NAV)입니다. 어느 시각까지의 자산과 거래를 반영할지 정하는 것이 평가 기준 시각과 마감 조건입니다. 20% 할인은 haircut이며 담보 평가에서 회수 불확실성을 반영합니다.</p><p>명의개서 기관(transfer agent)은 보유자와 지분 이전의 등록을 담당합니다. 기존 보유자의 10개를 다른 투자자에게 파는 것은 유통시장 거래입니다. 펀드의 정해진 절차로 지분을 없애고 대가를 받는 것은 환매 또는 상환입니다. 유통시장 가격과 환매 산정 가격·지급 시각은 같을 필요가 없습니다.</p>
<p data-stage-bridge="claim-asset-map" className="text-sm text-muted-foreground">같은 10개가 매매될 때 누가 어떤 장부를 바꾸는지 한 번 추적합니다.</p>
</section>
<section id="token-cashflow-control" data-teach-level="4" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">7. 자격 확인에서 대금 회수까지 같은 10개를 따라간다</h2>
<p>A가 10개를 팔려면 먼저 상품과 받을 주소의 자격을 확인합니다. 이어 평가 시각·가격과 견적 유효기간을 확인합니다. 상대방 B가 10.15를 지급하는 견적을 제시하고 A가 동의했다고 합시다. 두 토큰의 교환이 한 거래에서 성공하면 A는 10개를 내고 10.15의 결제 토큰을 받습니다. 장부 평가 10.20과 매매 대금 10.15의 차이는 0.05입니다.</p><p>결제 토큰을 받았다는 사실과 은행의 달러를 받았다는 사실은 다릅니다. 그 토큰의 발행자에게 상환을 신청할 자격, 수수료, 은행 송금 시각을 추가로 확인해야 합니다. 원자적 교환은 한 체인 거래 안에서 두 자산의 전달이 함께 성공하거나 되돌아가는 성질이며, 체인 밖 자산의 건전성까지 검사하지는 않습니다.</p><p>담보 계약에 100개를 넣는 경로라면 1.02 가격의 출처와 최신성,20% haircut, 허용 주소, 청산 때 인수할 상대방을 이어서 확인합니다. 대출 계약이 토큰을 압류할 수 있어도 발행자의 이전 제한 때문에 팔 수 없다면 81.60 평가만으로 회수 가능성을 설명할 수 없습니다.</p>
<p data-stage-bridge="token-cashflow-control" className="text-sm text-muted-foreground">가상 사례에서 토큰과 돈이 이동하는 조건을 확인했습니다. 실제 펀드의 발행 원문에 대입합니다.</p>
</section>
<section id="source" data-teach-level="5" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">8. BUIDL은 국채 그 자체가 아니라 펀드 지분이다</h2>
<SourceApplication source="Securitize · BlackRock BUIDL 출시 발표, 2024-03-20" excerpt="a stable value of $1 per token" application="가상 펀드의 102/100=1.02를 BUIDL 현재 가격이라고 복사하지 않습니다. BUIDL 발표는 1달러의 안정적 가치 목표와 일별 수익 발생·월별 추가 토큰 분배를 설명합니다. 목표 가치와 원금 보장은 구별해야 합니다." /><p>출시 발표에서 자산은 현금·미국 국채·환매조건부채권으로 구성됩니다. BlackRock Financial Management가 운용하고 BNY Mellon이 수탁·관리, Securitize가 토큰화와 명의개서를 담당합니다. 투자자는 개별 국채의 직접 소유자라는 설명 대신 해당 펀드 지분의 발행 문서와 권리를 확인해야 합니다.</p><p>발표에는 사전 승인 투자자 간 이전과 Rule 506(c)·Investment Company Act 3(c)(7)에 따른 구조가 명시됩니다. 당시 최소 투자 500만 달러도 출시 조건입니다. 이를 모든 현재 지분 종류의 최소액이나 일반 개인의 접근 조건으로 사용하지 않습니다.</p><CitationBlock source="Securitize · BlackRock BUIDL launch" citeKey={1} href="https://investors.securitize.io/news/news-details/2024/BlackRock-Launches-Its-First-Tokenized-Fund-BUIDL-on-the-Ethereum-Network-03-20-2024/default.aspx">공식 출시 발표의 투자 대상·역할·지급 방식·초기 자격 조건입니다. 현재 청약에는 최신 발행 문서를 다시 확인합니다.</CitationBlock>
<p data-stage-bridge="source" className="text-sm text-muted-foreground">실제 발행 구조가 정리됐습니다. 같은 지분을 현금성 토큰으로 바꾸는 후속 서비스를 비교합니다.</p>
</section>
<section id="permissioned-market-stack" data-teach-level="6" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">9. Circle 교환과 UniswapX 거래는 회수 경로를 늘린다</h2>
<SourceApplication source="Uniswap Labs · BUIDL 연동 발표, 2026-02-11" excerpt="pre-qualified and whitelisted through Securitize" application="A의 10개를 10.15에 교환하는 가상 거래도 자격과 유효한 견적이 먼저 필요합니다. 원자적으로 전달한다는 기술 조건만으로 모든 지갑에 거래가 열리거나 NAV 10.20에 매수자가 항상 있다고 결론내리지 않습니다." /><p>2024년 Circle 발표의 경로는 BUIDL 지분을 Circle에 전달하고 USDC를 받는 유통시장 교환입니다. 펀드 자체의 환매와 구분합니다. 2026년 UniswapX 연동은 Securitize의 자격 확인과 허용된 견적 상대방을 통해 지분을 매매하는 구조입니다. 공개된 아무 풀에 누구나 참여하는 구조로 요약하면 조건을 놓칩니다.</p><p>가상 사례의 A가 받은 10.15 USDC를 은행 달러로 바꾸려면 다시 USDC 상환 경로를 거칩니다. Circle의 안내는 상환 요청에 따른 소각과 등록 은행 계좌 송금, 수수료를 설명합니다. 따라서 지분→USDC와 USDC→은행 달러는 별도 사건이며 24시간 거래 가능성이 모든 은행 지급을 즉시 끝낸다는 뜻은 아닙니다.</p><CitationBlock source="Circle · BUIDL USDC transfer contract, 2024-04-11" citeKey={2} href="https://www.circle.com/pressroom/circle-announces-usdc-smart-contract-for-transfers-by-blackrocks-buidl-fund-investors">지분을 Circle에 넘기고 USDC를 받는 교환 구조입니다.</CitationBlock><CitationBlock source="Uniswap Labs · BUIDL liquidity, 2026-02-11" citeKey={3} href="https://blog.uniswap.org/unlocking-defi-liquidity-for-buidl">자격·허용 목록·RFQ 상대방·원자적 결제를 확인했습니다.</CitationBlock><CitationBlock source="Circle · Tokenizing and redeeming USDC" citeKey={4} href="https://help.circle.com/support/en/tokenizing-and-redeeming-usdc?id=kb_article_view&amp;sysparm_article=KB0010781">USDC 소각과 은행 송금은 별도의 상환 절차입니다.</CitationBlock>
<p data-stage-bridge="permissioned-market-stack" className="text-sm text-muted-foreground">지분·USDC·은행 달러가 각각 다른 장부의 결과임을 확인했습니다. 마지막으로 결합 과정의 실패를 정리합니다.</p>
</section>
<section id="rwa-release" data-teach-level="7" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">10. 빠른 결제는 잘못된 평가와 회수 제한을 없애지 않는다</h2>
<p>평가가 오래됐거나 부채 3을 빠뜨리면 최초 1.02부터 잘못됩니다. 받을 주소가 자격을 잃거나 이전이 중지되면 원자적 거래는 성립하지 않을 수 있습니다. 수탁·발행·등록의 법적 관계가 잘못되면 체인 기록이 정확해도 누구에게 어떤 청구를 할 수 있는지가 달라집니다.</p><p>실제 연동에서는 같은 기준 시각의 공급량·자산·부채를 맞추고, 정상 이전·거절·정지·환매 지연을 따로 확인합니다. 위탁기관과 발행 문서는 국가·상품마다 다르므로 미국의 사모 펀드 조건을 다른 국가의 예금·공모 펀드·부동산 권리에 복사하지 않습니다.</p><p>RWA의 이점은 권리 전달과 결제를 프로그램에 연결하는 데 있습니다. 판단의 끝에는 102의 근거,100의 등록,1.02의 시각,81.60의 가정,10.15의 실제 수령을 다시 놓습니다. 토큰 이름이나 총발행액 하나로 이 다섯 질문을 대신할 수 없습니다.</p>
<p data-stage-bridge="rwa-release" className="text-sm text-muted-foreground">같은 권리의 평가·이전·담보·회수 기록이 연결되면 어디서 돈이 멈추는지 설명할 수 있습니다.</p>
<ReviewPrompts questions={["순자산102와 발행 100개에 20% haircut을 적용하면 담보 평가액은 얼마인가요? (답: 3·6절)", "10개를 10.15 USDC에 팔았다는 사실은 왜 은행 달러 10.15의 수령과 다르나요? (답: 7·9절)"]} />
</section>
</article>; }
