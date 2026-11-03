import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 별도 표시한 숫자 사례는 설명용 가정입니다. */
export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 앞으로 살 물건의 값이 바뀌면 사업 계획도 바뀝니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">빵을 팔 가격은 이미 정했는데 석 달 뒤 밀값은 모른다면 원료비 상승이 이익을 지울 수 있습니다. 반대로 밀을 키우는 사람은 수확 때 값이 내려갈까 걱정합니다. 둘이 미래 거래가격을 정하면 각자의 사업에서 견디기 어려운 변동을 줄일 수 있습니다.</p>
<p className="leading-8">이 글은 약속한 가격과 그때의 시장가격 차이를 누가 부담하는지 계산합니다. 가격을 정한 뒤에도 중간에 돈을 내야 하는지, 실제 물건의 값과 약속이 같은 방향으로 움직이는지를 함께 봅니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">미래 가격을 정하려는 이유를 잡았습니다. 약속을 맺는 두 사람과 이행을 관리하는 곳을 연결합니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 사는 사람과 파는 사람의 약속을 누군가 관리합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">당사자가 직접 약속하면 품질과 날짜를 자신의 거래에 맞출 수 있습니다. 많은 사람이 같은 약속을 사고팔려면 규격을 맞추고, 약속을 바꿔 넘긴 뒤에도 누가 지급할지 정해야 합니다.</p>
<p className="leading-8">중간의 관리자는 가격 변화에 따라 돈을 주고받게 할 수 있습니다. 덕분에 손실을 뒤로만 미루지 않지만 실제 물건 대금보다 먼저 현금을 준비해야 합니다.</p>
        </div>
<FlowRail title="원료 가격을 정하는 약속" steps={[{"actor": "제빵업자", "movement": "나중에 밀을 살 값을 정합니다.", "receives": "원료비 계획"}, {"actor": "농가", "movement": "나중에 밀을 팔 값을 정합니다.", "receives": "판매대금 계획"}, {"actor": "이행 관리자", "movement": "지급 능력과 중간 정산을 확인합니다.", "receives": "계약 지속 여부"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가격 약속과 중간 지급의 역할이 나뉘었습니다. 밀 100톤에 한 가격을 붙입니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 100톤을 30만 원에 사기로 약속합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">제빵업자가 3개월 뒤 밀 100톤을 톤당 30만 원에 사기로 합니다. 농가는 같은 가격에 팔기로 합니다. 만기 시장가격은 35만 원 또는 25만 원, 수량은 변하지 않는다고 둡니다. 중간에 31만 원까지 오른 날도 있다고 가정합니다.</p>
<p className="leading-8">약속한 총대금은 3000만 원입니다. 35만 원이면 시장대금은 3500만 원이라 구매자는 500만 원 유리합니다. 25만 원이면 시장대금은 2500만 원이라 구매자가 500만 원 더 냅니다. 농가의 차이는 정확히 반대입니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 500만 원이 반대 부호로 나타납니다. 약속 안의 수량·가격·날짜를 엽니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 약속을 계산 가능한 다섯 칸으로 엽니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">무슨 물건인지, 얼마나 거래하는지, 어느 가격을 쓰는지, 언제 계산하는지, 무엇을 실제로 넘기는지 정해야 합니다. 같은 밀도 품질과 인도 장소가 다르면 가격이 달라집니다.</p>
<p className="leading-8">실물 100톤을 넘길 수도 있고, 비교 가격과 30만 원의 차액만 주고받을 수도 있습니다. 차액으로 끝내더라도 제빵업자는 실제 밀을 별도로 사야 합니다.</p>
        </div>
<FlowRail title="하나의 가격 약속 안에서 확인할 질문" steps={[{"actor": "어떤 물건인가?", "movement": "품질과 장소, 100톤을 적습니다.", "receives": "실제 구매와 대응"}, {"actor": "언제 얼마인가?", "movement": "3개월 뒤 톤당 30만 원을 적습니다.", "receives": "약정대금 3000만 원"}, {"actor": "어떻게 끝내나?", "movement": "실물 또는 차액 정산을 정합니다.", "receives": "인도와 현금 준비"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가격 차액과 실제 구매가 별개의 거래임을 확인했습니다. 표준 규격과 중간 지급이 필요한 이유를 살핍니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 규격을 맞추면 바꾸기 쉽고 지급을 앞당기면 버틸 돈이 필요합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">맞춤 약속은 공장에 필요한 품질과 날짜를 정확히 넣을 수 있습니다. 하지만 상대방이 못 갚으면 다른 거래를 구해야 합니다. 공통 규격은 기존 계약을 반대 거래로 줄이기 쉽지만 내 물건과 완전히 맞지 않을 수 있습니다.</p>
<p className="leading-8">100톤의 가격이 하루에 1만 원 오르면 판매 약속의 부담은 100만 원 늘어납니다. 이를 그날 내게 하면 미지급액의 누적을 줄입니다. 농가는 아직 수확대금을 받지 않았으므로 이 100만 원을 따로 마련해야 합니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">거래 편의와 현금 준비 비용의 교환을 보았습니다. 이제 두 계약의 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 선도·선물·헤지는 서로 다른 질문에 답합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">미래 가격을 당사자끼리 맞춤 약속한 계약이 선도, forward입니다. 거래소 규격으로 거래하고 청산기관이 이행을 관리하는 계약은 선물, futures입니다. 선물의 손익을 날마다 반영하는 것을 일일 정산이라고 합니다.</p>
<p className="leading-8">기존에 가진 위험을 다른 거래로 줄이는 행동이 헤지입니다. 이행을 뒷받침하려고 맡기는 돈은 증거금이며 물건값의 선납액과 다릅니다. 실제 현물가격과 계약이 참조하는 가격의 차이는 베이시스입니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">계약 형태와 거래 목적을 구분했습니다. 처음의 100톤을 실제 구매와 정산에 함께 넣습니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 현물 구매와 계약 손익을 합해야 고정된 가격이 보입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">만기 밀값이 35만 원이면 제빵업자는 현물 100톤에 3500만 원을 낸 뒤 선도 차액 500만 원을 받습니다. 순지출은 3000만 원입니다. 25만 원이면 현물에 2500만 원, 계약 손실에 500만 원을 내어 같은 3000만 원이 됩니다.</p>
<p className="leading-8">선물이라면 30만→31만 원인 날 매수자는 100만 원을 받고 매도자는 100만 원을 냅니다. 이후 31만→35만 원이면 누적 추가 400만 원이 같은 방향으로 갑니다. 전체 차액 500만 원은 같아도 돈이 움직이는 날짜는 다릅니다.</p>
<p className="leading-8">마지막 실제 밀값이 36만 원인데 정산 기준은 35만 원이라면 구매자는 3600만−500만=3100만 원을 냅니다. 위치나 품질의 차이가 고정하려던 대금에 100만 원을 남긴 것입니다.</p>
<p className="leading-8">선물형 펀드가 만기 직전의 밀 100톤 계약을 닫고 다음 만기 100톤으로 바꾸는 경우도 봅시다. 가까운 계약이 톤당 30만 원이고 다음 계약이 31만5000원이라고 가정합니다. 그다음 만기까지 현물이 30만 원에 머물고 새 선물도 그 가격에 수렴하면 매수 계약은 100×(30만−31만5000)=−150만 원입니다. 현물 가격이 제자리여도 계약 보유 손익은 음수입니다.</p>
<p className="leading-8">계약 교체를 롤오버, 이 경로가 수익에 미치는 영향을 롤 수익이라고 합니다. 먼 만기의 선물가격이 더 높은 곡선은 콘탱고, 더 낮은 곡선은 백워데이션이라고 부릅니다. 31만5000원짜리 선물 계약을 새로 맺는 순간 차액 1만5000원이 곧바로 확정 손실이 되는 것은 아닙니다. 새 계약 가격이 이후 30만 원으로 내려온다는 가정이 손실을 만듭니다. 담보 현금의 이자와 보수까지 합해야 펀드 전체 성과가 됩니다.</p>
        </div>

<CitationBlock source="CME · Contango, Backwardation and Convergence" citeKey={4} href="https://www.cmegroup.com/education/courses/introduction-to-ferrous-metals/what-is-contango-and-backwardation">“When a market is in contango, the forward price of a futures contract is higher than the spot price.” 만기 수렴은 “as the futures contract approaches maturity, the futures price will converge with the spot price, otherwise an arbitrage opportunity would exist.” CME Institute 철강(ferrous) 과정 2강 · 2026-10-09 브라우저로 렌더링한 페이지 원문과 대조했습니다.</CitationBlock>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">최종 대금 3000만 원과 중간 현금 100만 원을 따로 계산했습니다. 거래소 원문의 정산 방식과 맞춰 봅니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 거래소의 중간 평가는 만기를 기다리지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">CME 자료의 다음 문구를 보면 중간 평가는 손실이 쌓이지 않게 막아 계약 이행을 관리하는 방법입니다. 실제 평가 빈도와 고객 납부 시한은 상품·청산·중개 계약에 따라 확인해야 합니다.</p>
<p className="leading-8">예시의 100만 원은 손실이 확정되어 영원히 회복되지 않는다는 뜻이 아닙니다. 가격이 되돌아오면 반대 방향 정산이 생길 수 있어도 오늘 요구된 돈은 오늘 필요합니다.</p>
        </div>
<SourceApplication source="CME · Understanding Margin Changes, margin philosophies" excerpt="We mark positions to market twice a day" application="100톤×(31만−30만)=100만 원입니다. 가정한 매수 포지션은 100만 원을 받고 매도 포지션은 냅니다. 실제 계약 승수와 정산가는 거래소 명세를 따릅니다." />
<CitationBlock source="CME · Understanding Margin Changes, margin philosophies" citeKey={1} href="https://www.cmegroup.com/education/articles-and-reports/understanding-margin-changes">“We mark positions to market twice a day to prevent losses from accumulating over time.” Matthew Waldis(CME Clearing), 2020-03-25 글 · 2026-10-09 브라우저로 렌더링한 페이지 원문과 대조했습니다. 미국 CME Clearing의 관행이며, 예시의 금액은 별도 가정입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">중간 정산의 문구를 100만 원 현금 이동에 적용했습니다. 다음에는 같은 규칙이 다른 시장에서 무엇을 요구하는지 비교합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 농가의 위험 감소와 투기자의 위험 증가는 같은 계약에서 생깁니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">농가는 밀값 35만 원에서 현물 매출 3500만 원과 선물 손실 500만 원을 합쳐 3000만 원을 확보합니다. 밀을 전혀 보유하지 않은 매도자는 상쇄할 매출 없이 500만 원을 잃습니다. 계약 방향만으로 헤지 여부를 정할 수 없습니다.</p>
<p className="leading-8">한국과 미국의 거래소 상품은 계약 단위·최종결제·증거금 통화가 각각 다릅니다. 특히 외환 선도는 두 통화의 돈을 빌리고 맡기는 비용도 반영합니다. 달러당 1000원, 원화 연 4%, 달러 연 2%라면 1년 뒤 비용이 맞는 단순 가격은 1000×1.04÷1.02≈1019.61원입니다. 이는 자유로운 차입·예치와 거래비용 없음이라는 가정이며 실제 환율 예측값이 아닙니다.</p>
        </div>
<SourceApplication source="CME · Performance Bonds/Margins FAQ" excerpt="debited and credited accordingly" application="30만 원에서 31만 원으로 변할 때 농가의 선물 계좌는 100만 원 감소합니다. 수확대금은 아직 없으므로 계좌 잔고와 납부 시한을 별도로 맞춰야 합니다." />
<CitationBlock source="CME · Performance Bonds/Margins FAQ" citeKey={2} href="https://www.cmegroup.com/solutions/risk-management/performance-bonds-margins/faq-performance-bonds-margins.html">원문 위치: CME · Performance Bonds/Margins FAQ · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock><CitationBlock source="BIS · Covered interest parity lost" citeKey={3} href="https://www.bis.org/publ/qtrpdf/r_qt1609e.htm">BIS · Covered interest parity lost</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">원료사업과 계약을 합산해야 헤지가 되는 이유를 확인했습니다. 마지막으로 수량과 자금의 불일치를 남깁니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 가격을 고정해도 수확과 현금의 위험은 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">가뭄으로 실제 수확이 60톤이면 100톤 판매 계약 중 40톤이 원래 사업을 넘어섭니다. 가격이 크게 오르면 줄어든 현물 수입으로 선물 손실을 다 메우지 못합니다. 수량 전망도 계약과 함께 갱신해야 합니다.</p>
<p className="leading-8">중간 증거금을 못 내서 매도 계약을 닫으면 만기까지 계산했던 고정 대금은 실현되지 않습니다. 이 위험은 <Link to="/finance/risk/margin-collateral-and-leverage">담보와 현금 시점</Link>에서 이어집니다. 만기 연장을 위해 계약을 교체할 때도 새 가격과 거래비용을 다시 부담합니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가격·수량·시점이 모두 맞아야 계획한 효과가 남습니다. 아래에서 같은 100톤의 두 장부를 다시 확인합니다.</p>
        <ReviewPrompts questions={["밀값 25만 원일 때 현물 구매와 계약 손익을 합한 지출은 얼마인가요? (답: 7절)", "실제 밀값 36만 원과 정산가 35만 원이 다르면 얼마의 위험이 남나요? (답: 7절)", "농가의 수확량이 60톤으로 줄면 100톤 매도가 왜 위험해지나요? (답: 10절)"]} />
      </section>
    </div>
  );
}
