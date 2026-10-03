import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import FlowRail from "../world-systems/FlowRail";
import SourceApplication from "../world-systems/SourceApplication";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import { HyperCoreEvmViz } from "./hyperliquid/viz/HyperliquidBoundaryViz";
import { codeRefs } from "./hyperliquid/codeRefs";

const DOCS = "https://hyperliquid.gitbook.io/hyperliquid-docs";
export default function HyperliquidArticle() {
 const sidebar = useCodeSidebar();
 return <><article className="space-y-14">
  <section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">1. 매매 버튼 뒤에서 돈과 책임이 어떻게 바뀌는가</h2>
   <p>Hyperliquid은 사용자가 서명한 매매 요청을 받아 주문장과 담보 잔액을 바꾸는 블록체인입니다. 화면에서 주문이 보이는 순간, 일부가 팔리는 순간, 손실 때문에 강제 정리되는 순간에는 각각 다른 기록이 남습니다.</p>
   <p>이 글은 1,000 USDC를 가진 계정이 BTC 0.1개에 해당하는 무기한 계약을 사는 사례로 그 기록을 따라갑니다. 공식 자료는 2026-10-04 확인했습니다. 가격·체결량·손익은 가정이고, 요율은 확인일의 적용 조건을 따로 적습니다.</p>
   <p data-stage-bridge="overview" className="text-sm text-muted-foreground">주문 하나의 상태가 어떻게 달라지는지 보려면 먼저 요청을 받고 처리하는 역할을 나눠야 합니다.</p>
  </section>
  <section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">2. 승인한 내용, 거래 결과, 모두가 인정한 기록</h2>
   <p>사용자는 사고 싶은 양과 가격을 승인합니다. 거래를 처리하는 곳은 상대 주문과 담보를 확인합니다. 참여 노드들은 어떤 순서로 처리한 결과를 공통 기록으로 삼을지 정합니다. 조회 화면은 이 결과를 가져와 보여 줍니다.</p>
   <FlowRail title="어느 단계까지 성공했는지 묻는 세 역할" steps={[{actor:"무엇을 승인했나",movement:"가격·수량·계정을 서명합니다.",receives:"서명된 요청"},{actor:"무엇이 거래됐나",movement:"상대 주문과 담보를 확인합니다.",receives:"체결·잔량·잔액"},{actor:"어떤 기록을 따르나",movement:"같은 처리 순서와 결과를 확인합니다.",receives:"합의된 거래 상태"}]} />
   <p data-stage-bridge="black-box" className="text-sm text-muted-foreground">서명과 체결을 구별했으니 한 주문의 실제 숫자를 넣습니다.</p>
  </section>
  <section id="case" data-teach-level="0" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">3. 0.1개를 주문해도 처음에는 0.04개만 체결된다</h2>
   <p>계정에 1,000 USDC가 있고 BTC 가격 50,000달러 이하에서 0.1개를 사겠다고 요청합니다. 먼저 팔려는 물량이 0.04개뿐이면 2,000달러어치가 체결되고 0.06개는 기다립니다. 나중에 남은 0.06개도 같은 가격에 체결된다고 합시다. 최종 계약 금액은 5,000달러입니다. 모두 (가정)입니다.</p>
   <p>확인일의 기본 0등급 무기한 계약 요율은 상대 주문을 즉시 가져가면 0.045%, 대기 주문이 나중 체결되면 0.015%입니다. 할인·소개·builder 추가비가 없는 일반 시장을 가정하면 처음 비용은 2,000×0.045%=0.90 USDC, 나중 비용은 3,000×0.015%=0.45 USDC입니다. 합계 1.35 USDC를 빼면 가격 손익과 펀딩 전 잔액은 998.65 USDC입니다.</p>
   <CitationBlock source="Hyperliquid · Fees, perps fee tiers" citeKey={1} href={`${DOCS}/trading/fees`}>2026-10-04 기본 0등급 요율. 계정 할인·시장 종류·실제 userFees와 builder 조건에 따라 달라집니다.</CitationBlock>
   <p data-stage-bridge="case" className="text-sm text-muted-foreground">0.04와 0.06의 두 체결이 하나의 0.1 주문으로 연결돼야 합니다. 화면에서 찾을 기록을 그립니다.</p>
  </section>
  <section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">4. 주문 번호와 체결 기록으로 잔량을 따라간다</h2>
   <FlowRail title="(가정) 주문 0.1 → 체결 0.04 → 대기 0.06 → 전체 체결 0.1" steps={[{actor:"얼마를 요청했나",movement:"0.1개, 최대 50,000달러를 보냅니다.",receives:"주문 식별자"},{actor:"얼마가 남았나",movement:"0.04개 체결 뒤 잔량 0.06개를 확인합니다.",receives:"체결 기록과 대기 주문"},{actor:"돈이 얼마나 달라졌나",movement:"나머지 체결과 총수수료 1.35를 맞춥니다.",receives:"포지션 0.1, 잔액 998.65"}]} />
   <p>응답을 못 받았다면 0.1개를 새로 주문하기 전에 기존 주문 번호나 직접 붙인 식별자로 조회합니다. 취소 요청을 보내는 동안 0.06개 일부가 먼저 체결될 수도 있으므로 최종 체결량과 남은 양을 다시 맞춥니다.</p>
   <p data-stage-bridge="picture" className="text-sm text-muted-foreground">요청을 보내는 사이에도 거래는 계속됩니다. 그래서 한 주문을 여러 기록으로 확인해야 합니다.</p>
  </section>
  <section id="need" data-teach-level="2" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">5. 승인만으로 돈을 바꾸면 안 되는 이유</h2>
   <p>서명이 맞아도 담보가 부족하거나 가격 단위가 틀리면 요청은 거절될 수 있습니다. 0.1개 주문 뒤 연결이 끊겼다고 같은 경제적 주문을 새 식별자로 반복하면 원래 주문과 새 주문이 모두 체결될 수 있습니다. 중복 서명을 막는 장치만으로 이런 중복 의도까지 알아내지는 못합니다.</p>
   <p>가격이 내려가면 1,000 USDC로 지탱하는 5,000달러 계약의 손실이 담보를 빠르게 줄입니다. 거래소는 상대방에게 줄 돈을 마련할 수 있는지 계속 확인해야 합니다. 자금 이동도 출발 체인의 전송 기록과 도착 계정의 사용 가능 잔액이 둘 다 있어야 끝납니다.</p>
   <p data-stage-bridge="need" className="text-sm text-muted-foreground">요청·거래·위험·자금 이동을 따로 확인해야 하는 이유를 봤으니 실제 구성요소의 이름을 붙입니다.</p>
  </section>
  <section id="order-lifecycle" data-teach-level="3" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">6. 주문·담보·실행 환경의 이름을 연결한다</h2>
   <p>HyperCore는 주문장과 현물·무기한 계약, 담보 상태를 처리하는 실행 환경입니다. HyperBFT는 Hyperliquid 노드들이 공통 처리 순서를 확정하는 합의 체계입니다. API는 요청 제출과 조회 통로이므로 API 화면만으로 합의 전체를 대체하지 않습니다.</p>
   <p>상대의 대기 주문을 가져간 처음 0.04개는 taker 체결, 내 주문이 기다렸다가 맞은 나머지는 maker 체결입니다. Gtc는 취소되거나 체결될 때까지 대기할 수 있는 지정가 방식입니다. 주문의 oid와 체결 이력, 포지션은 서로 다른 조회 대상입니다.</p>
   <p>Cross margin은 계정의 해당 범위에서 담보를 공유하고 isolated margin은 배정한 포지션 담보를 구분합니다. Mark price는 손익과 청산 판단에 쓰는 평가가격입니다. 체결 화면의 마지막 가격이나 외부 기준가격 하나와 항상 같지는 않습니다.</p>
   <p>HyperEVM은 스마트 계약을 실행하며 gas는 HYPE로 냅니다. 같은 합의 아래에서도 HyperCore 주문 수수료와 EVM gas는 별개입니다. 확인일 메인넷 chain ID는 999, 테스트넷은 998입니다.</p>
   <CitationBlock source="Hyperliquid · HyperEVM" citeKey={2} href={`${DOCS}/for-developers/hyperevm`}>HyperBFT와 EVM 실행, HYPE gas 및 네트워크 식별자를 확인합니다.</CitationBlock>
   <p data-stage-bridge="order-lifecycle" className="text-sm text-muted-foreground">이름을 사례에 붙였으니 0.1개 주문을 접수부터 손실 처리까지 추적합니다.</p>
  </section>
  <section id="mechanism" data-teach-level="4" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">7. 담보가 들어오고 주문이 체결된 뒤에도 검사는 계속된다</h2>
   <p>먼저 1,000 USDC가 거래할 계정과 담보 구역에 실제로 반영됐는지 확인합니다. 현재 공식 USDC 문서는 CCTP를 권장하고 기존 Arbitrum Bridge2를 deprecated로 표시합니다. CCTP의 출발지 소각, 발행자 인증, 도착지 발행과 HyperCore 반영을 구별합니다. 예전 bridge의 입금 시간과 최소액을 CCTP에 적용하지 않습니다.</p>
   <p>지갑은 BTC 시장에서 50,000 이하로 0.1개를 사는 Gtc 요청과 nonce를 승인합니다. HyperCore는 요청의 형식과 위험 조건을 확인하고 0.04개 체결과 0.06개 대기를 기록합니다. 이후 0.06개가 체결되면 두 fill의 합 0.1과 총수수료 1.35를 포지션·잔액과 맞춥니다.</p>
   <div id="consensus" className="scroll-mt-20"><p>HyperBFT의 공통 순서 안에서 체결과 취소 중 무엇이 먼저 적용됐는지가 정해집니다. 합의가 전 세계 사용자의 실제 클릭 시각을 알아내거나 모든 주문에 동일한 네트워크 지연을 보장하는 것은 아닙니다. 핵심 거래 엔진 전체의 소스가 공개됐다고 가정하지 않습니다.</p></div>
   <div id="margin-liquidation" className="scroll-mt-20"><p>이후 미실현 손실 700 USDC, 펀딩 순지급 20 USDC, 유지 요구액 300 USDC라고 가정하면 계정 가치는 1,000−1.35−700−20=278.65입니다. 요구액보다 21.35 부족합니다. 300은 설명용 값이며 실제 요구액은 자산·규모 구간·mark price로 다시 계산합니다.</p></div>
   <p>공식 청산 규칙은 먼저 주문장에서 포지션을 닫으려 시도합니다. 정리에 실패하고 계정 가치가 유지 요구액의 2/3 아래로 내려가면 backstop 인수 경로가 열립니다. 이 사례의 단순 기준은 200이므로 278.65는 아직 그 아래가 아닙니다. 실제 주문장 가격과 평가가격은 달라질 수 있고 큰 포지션에는 부분 청산 규칙도 있습니다.</p>
   <p>HIP-3 시장은 외부 운영자가 가격 자료·계약조건·레버리지 한도와 종료를 정합니다. 운영자 DEX마다 담보와 주문장을 구분하며, 확인일 문서는 500k HYPE 예치와 최소 183일 조건을 명시합니다. 운영자가 haltTrading을 보내면 주문 취소와 현재 mark price 정산이 일어나므로 시장 이름만 보고 일반 BTC 시장과 책임이 같다고 읽지 않습니다. 잘못된 운영의 예치금 삭감은 사용자 손실 보상과 같은 약속이 아닙니다.</p>
   <CitationBlock source="Hyperliquid · USDC" citeKey={3} href={`${DOCS}/for-developers/api/usdc`}>CCTP 권장과 legacy bridge의 상태를 2026-10-04 확인했습니다.</CitationBlock>
   <CitationBlock source="Hyperliquid · Liquidations" citeKey={4} href={`${DOCS}/trading/liquidations`}>주문장 청산, 유지 요구액 2/3의 backstop, cross·isolated 범위를 확인합니다.</CitationBlock>
   <CitationBlock source="Hyperliquid · HIP-3" citeKey={5} href={`${DOCS}/hyperliquid-improvement-proposals-hips/hip-3-builder-deployed-perpetuals`}>운영자 책임·시장별 담보·예치·종료·삭감 조건의 확인일 문서입니다.</CitationBlock>
   <p data-stage-bridge="mechanism" className="text-sm text-muted-foreground">1,000의 담보가 주문과 비용·손실로 변했습니다. 이제 공개 코드가 실제로 담당하는 범위를 확인합니다.</p>
  </section>
  <section id="source" data-teach-level="5" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">8. 공개 SDK는 요청을 만들고 결과를 조회한다</h2>
   <p>공식 Python SDK의 commit 2fdb18f9517675ea03695a0962bd19eece9c83f0을 고정했습니다. order()는 요청을 만들고 bulk_orders()는 자산 번호로 바꾼 뒤 서명해 전송합니다. 가격 50000과 수량 0.1은 wire의 p·s에 들어갑니다. 이 파일에서 거래 상대나 청산 가격을 계산하지는 않습니다.</p>
   <SourceApplication source="공식 SDK · exchange.py order()" excerpt="return self.bulk_orders([order], builder)" application="0.1개 주문은 이 줄에서 batch 경로로 전달됩니다. 반환된 응답을 보고 0.04 체결·0.06 대기를 확인한 뒤 fill과 잔액을 별도로 조회해야 사례의 998.65를 대조할 수 있습니다." />
   <div className="flex flex-wrap gap-3"><CodeViewButton label="order → bulk_orders 원본" onClick={()=>sidebar.open("order",codeRefs.order)} /><CodeViewButton label="가격·수량의 wire 변환" onClick={()=>sidebar.open("wire",codeRefs.wire)} /><CodeViewButton label="ok 뒤 resting·oid 조회" onClick={()=>sidebar.open("status",codeRefs.status)} /></div>
   <CitationBlock source="Hyperliquid Python SDK · pinned 2fdb18f" citeKey={6} href="https://github.com/hyperliquid-dex/hyperliquid-python-sdk/tree/2fdb18f9517675ea03695a0962bd19eece9c83f0">원본 파일과 MIT 라이선스를 보존했습니다. 예제 ETH 0.2·1100은 testnet이며 이 글의 BTC 사례와 구분합니다.</CitationBlock>
   <div id="hyperevm-bridge" className="scroll-mt-20 space-y-5"><p>EVM 계약에서 주문하면 CoreWriter가 중간에 들어갑니다. 버전 1, action ID1로 주문을 나타내고 자산과 매수 방향, 가격과 수량, 주문 방식을 ABI 형식으로 보냅니다. 문서의 가격·수량 단위는 10⁸ 배이므로 사례 값은 5,000,000,000,000과 10,000,000입니다.</p><p>EVM 영수증의 성공 뒤에도 주문 action은 지연 처리될 수 있습니다. 따라서 영수증만 보고 BTC 0.1개가 모두 체결됐다고 판단하지 않고 Core의 최종 체결을 다시 읽습니다.</p></div>
   <HyperCoreEvmViz />
   <CitationBlock source="Hyperliquid · Interacting with HyperCore" citeKey={7} href={`${DOCS}/for-developers/hyperevm/interacting-with-hypercore`}>CoreWriter 인코딩·지연·별도 Core 실행 기록. read precompile 설명에는 testnet 문구가 남아 있으므로 실제 네트워크·시스템 주소 지원을 별도 확인합니다.</CitationBlock>
   <p data-stage-bridge="source" className="text-sm text-muted-foreground">SDK의 반환과 Core의 결과가 다른 단계임을 확인했습니다. 같은 담보로 만기형 상품을 거래하면 무엇이 달라지는지 비교합니다.</p>
  </section>
  <section id="comparison" data-teach-level="6" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">9. HIP-4는 같은 주문장 위에서도 지급 구조가 다르다</h2>
   <p>1,000 USDC 중 60을 써 Yes 100개를 개당 0.60에 산다고 합시다. 결과가 Yes면 100, No면 0을 받아 수수료 전 손익은+40 또는−60입니다. 나머지 940은 이 단순 사례에서 사용하지 않았습니다. 이는 BTC 0.1 무기한 계약의 5,000달러 노출과 다른 지급 구조입니다.</p>
   <SourceApplication source="Hyperliquid · HIP-4, Overview" excerpt="does not involve leverage or liquidations" application="Yes 100개를 60에 산 사례는 정한 범위의 결과 지급을 미리 담보합니다. 앞의 BTC 계약처럼 가격 손실이 유지 요구액을 넘겨 포지션을 청산하는 경로와 구별합니다. 담보가 충분하다는 사실은 Yes가 나올 가능성이나 60 회수를 보장하지 않습니다." />
   <p>HIP-4 문서는 Yes가 settleFraction, No가 1−settleFraction을 받는 구조와 둘을 합친 주문장을 설명합니다. 따라서 Yes 0.60 매수는 No 0.40 매도와 대응합니다. 이진 결과의 0·1 정산 외에 일반 범위 정산도 있으므로 상품의 실제 조건을 읽습니다.</p>
   <p>확인일 공식 개요에는 초기 메인넷 출시와 단계적 확대가 있고, 별도 deployer API에는 Testnet-only가 남아 있습니다. 수수료 개요의 초기 0 문구와 후속 수수료 문서도 구별해야 합니다. 이 글은 거래 원리를 설명하며 모든 배포 기능이 메인넷에서 활성화됐거나 계속 무료라고 단정하지 않습니다.</p>
   <CitationBlock source="Hyperliquid · HIP-4 Outcome markets" citeKey={8} href={`${DOCS}/hyperliquid-improvement-proposals-hips/hip-4-outcome-markets`}>2026-10-04 원문. 완전 담보·고정 범위 정산과 초기 출시 범위를 확인합니다.</CitationBlock>
   <CitationBlock source="Hyperliquid · HIP-4 deployer actions" citeKey={9} href={`${DOCS}/for-developers/api/hip-4-deployer-actions`}>확인일 Testnet-only 표기를 유지합니다. 문서에 있는 기능을 메인넷 활성화로 확대하지 않습니다.</CitationBlock>
   <p data-stage-bridge="comparison" className="text-sm text-muted-foreground">같은 1,000도 계약의 지급 구조에 따라 위험이 달라집니다. 마지막으로 남는 책임과 검증 한계를 확인합니다.</p>
  </section>
  <section id="risk-checklist" data-teach-level="7" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">10. 체결이 맞아도 외부 가격과 자금 회수의 위험은 남는다</h2>
   <p>HyperCore의 공통 기록은 잘못 설계된 외부 가격 자료나 발행자의 자산 상환 능력까지 보장하지 않습니다. HIP-3 운영자가 어떤 시장을 종료할 수 있는지, 담보 토큰의 발행자와 회수 경로가 무엇인지까지 확인해야 합니다. 계정의 통합·portfolio margin 모드를 켠 경우에는 이 글의 단순 담보 구분을 그대로 복사하지 않습니다.</p>
   <p>수수료는 거래 규모뿐 아니라 계정 등급·할인·시장 배율·builder 조건으로 달라집니다. HIP-3 추가 배율은 실제 설정과 userFees를 조회해 계산합니다.</p>
   <p>현금 회수에는 또 다른 절차가 남습니다. 출금 요청 뒤 발행자 인증과 도착지 처리가 끝났는지 확인해야 합니다. 주문 하나의 성공만으로 거래 화면의 잔액을 이미 회수한 돈으로 셀 수는 없습니다.</p>
   <p>공식 문서가 충돌하는 기능 상태는 확정된 하나의 결론으로 합치지 않았습니다. 위 링크의 확인일·네트워크와 실제 API 지원을 맞춰야 합니다. 더 일반적인 담보·청산 구조는 <Link className="underline" to="/finance/markets/forwards-and-futures">선물과 증거금</Link>에서 이어 읽을 수 있습니다.</p>
   <p data-stage-bridge="risk-checklist" className="text-sm text-muted-foreground">서명·체결·위험·자금 이동을 같은 주문의 기록으로 연결하면 어느 성공이 아직 남았는지 판단할 수 있습니다.</p>
   <ReviewPrompts questions={["0.04를 taker, 0.06을 maker로 같은 50,000에 체결했다면 총수수료와 손익 전 잔액은 얼마인가요? (답: 3절)","유지 요구액 300일 때 계정 가치 278.65와200은 청산 과정에서 각각 무엇을 뜻하나요? (답: 7절)"]} />
  </section>
 </article><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={{}} projectMetas={{"hyperliquid-python-sdk":{id:"hyperliquid-python-sdk",label:"공식 Python SDK · 2fdb18f",badgeClass:"border-sky-500 bg-sky-500/10 text-sky-700"}}} /></>;
}
