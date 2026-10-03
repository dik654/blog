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
        <h2 className="mb-6 text-2xl font-bold">1. 나중에 회복될 자산도 오늘 돈이 없으면 팔아야 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">빌린 돈으로 자산을 산 사람은 가격이 언젠가 회복될 것이라는 믿음만으로 버틸 수 없습니다. 돈을 빌려준 쪽이 오늘 일부를 돌려달라고 하면 지금 쓸 돈을 마련해야 합니다. 최종 손익과 지급 시점을 따로 읽어야 하는 이유입니다.</p>
<p className="leading-8">이 글은 가격이 내려간 뒤 누구의 몫이 먼저 줄고, 계약을 유지하려면 얼마를 더 내야 하는지 계산합니다. 여러 사람이 동시에 팔 때 그 부담이 다시 커지는 경로까지 따라갑니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가격 전망과 오늘의 지급 능력을 나누었습니다. 빌린 돈이 돌아가는 순서를 그립니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 자산의 값과 갚을 돈을 매일 다시 비교합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">투자자는 자기 돈에 빌린 돈을 더해 자산을 삽니다. 대출자는 자산을 처분해서 빚을 회수할 수 있는지 살핍니다. 가격이 내려 약속한 여유가 줄면 투자자가 돈이나 자산을 더 넣어야 합니다.</p>
<p className="leading-8">추가할 돈이 없으면 자산을 팔아 빚부터 줄입니다. 급한 매물이 많아지면 팔 가격이 더 나빠질 수 있고, 다른 투자자의 장부에도 같은 부담이 생깁니다.</p>
        </div>
<FlowRail title="가격 하락이 오늘의 현금 요구로 바뀌는 경로" steps={[{"actor": "투자자", "movement": "자기 돈과 빌린 돈으로 자산을 삽니다.", "receives": "가격 변화에 따른 자기 몫"}, {"actor": "대출자", "movement": "처분 가치와 빚을 비교합니다.", "receives": "부족하면 추가 지급 요구"}, {"actor": "매수자들", "movement": "급한 매물을 현재 가격에 삽니다.", "receives": "새 가격이 다른 장부로 전달"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가격 하락은 추가 지급 요구를 거쳐 매도로 이어집니다. 100억 원짜리 자산에 숫자를 넣습니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 100억 원이 90억 원이 되면 자기 몫은 절반입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">자기 돈 20억 원과 차입 80억 원으로 100억 원 자산을 샀다고 합시다. 대출 잔액은 자산 가치의 80% 이하여야 한다는 계약을 가정합니다. 이 비율은 설명용이며 특정 나라 주식 신용거래의 실제 허용 비율이 아닙니다.</p>
<p className="leading-8">자산이 90억 원으로 내려도 빚은 80억 원입니다. 남는 자기 몫은 10억 원으로 줄어듭니다. 계약상 대출 허용액은 90×80%=72억 원이므로 8억 원을 갚거나 그에 맞는 추가 자산을 넣어야 합니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">자기 몫 10억 원과 상환 요구 8억 원을 나눴습니다. 계약이 두 숫자를 어떻게 쓰는지 엽니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 손익 장부와 계약 유지 장부는 다른 질문을 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">손익 장부는 자산에서 빚을 빼 내 몫을 계산합니다. 계약 유지 장부는 대출자가 인정하는 자산 가치에 허용 비율을 곱하고 현재 빚과 비교합니다. 내 몫이 양수여도 두 번째 장부가 부족하다고 말할 수 있습니다.</p>
<p className="leading-8">90억 원에서 80억 원을 빼면 10억 원이 남지만 대출자는 자산 90억 원에 대해 72억 원까지만 기다리기로 했습니다. 나머지 8억 원의 처리 날짜가 투자자의 생존 기간을 정합니다.</p>
        </div>
<FlowRail title="두 장부에서 묻는 질문" steps={[{"actor": "내 몫은 얼마인가?", "movement": "자산 90에서 빚 80을 뺍니다.", "receives": "10억 원"}, {"actor": "얼마까지 빌려주나?", "movement": "인정 가치 90의 80%를 계산합니다.", "receives": "72억 원"}, {"actor": "오늘 얼마가 부족한가?", "movement": "빚 80과 한도 72를 비교합니다.", "receives": "8억 원"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">부채를 뺀 값과 계약 한도를 구별했습니다. 왜 여유를 미리 요구하는지 봅니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 팔기까지 시간이 걸리기 때문에 가치 전부를 빌려주지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">대출자는 채무불이행을 확인한 즉시 자산을 같은 가격에 팔 수 있다고 장담하지 못합니다. 확인·매각 사이에 값이 더 떨어지고 수수료도 들어갈 수 있습니다. 그래서 인정 가치의 일부를 남겨 둡니다.</p>
<p className="leading-8">그 여유가 시장 불안 때 커지면 가격이 그대로여도 대출 한도가 줄어듭니다. 90억 원 자산의 허용 비율을 80%에서 70%로 낮춘다고 가정합니다. 한도가 72억 원에서 63억 원으로 줄어 추가 부담이 더 커집니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가격 변화와 대출 조건 변화가 따로 현금을 요구함을 확인했습니다. 각 역할의 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 담보 여력과 레버리지는 같은 값이 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">빌린 돈으로 자기 돈보다 큰 자산을 보유하는 것이 레버리지입니다. 손실 확대 원리는 <Link to="/finance/markets/equity-claims-and-valuation#leverage">주식의 자본구조</Link>에서 이어받습니다. 돈을 못 갚을 때 회수 근거가 되는 자산은 담보입니다.</p>
<p className="leading-8">담보에서 인정하지 않는 가치 비율은 헤어컷이라고 부릅니다. 계약 이행을 위해 미리 맡긴 돈은 증거금입니다. 선물의 가격 변화로 날마다 오가는 정산액과 처음 맡긴 증거금은 역할이 다릅니다.</p>
<p className="leading-8">부족한 돈이나 담보를 더 넣으라는 요구가 마진콜입니다. 자금을 빌리거나 마련할 수 있는 능력은 자금 유동성입니다. 큰 가격 손해 없이 거래할 수 있는 정도는 시장 유동성입니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">손익 크기와 지급 시점의 이름을 나눴습니다. 8억 원 부족을 세 가지 방법으로 처리합니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 현금 상환·추가 담보·매각은 필요한 금액이 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">자산은 90억 원이고 빚은 80억 원입니다. 외부 현금 8억 원으로 빚을 갚으면 빚 72억 원이 되어 80% 기준에 맞습니다. 현금으로 빚을 줄이지 않고 같은 인정률의 자산을 더 맡긴다면 10억 원을 추가해야 합니다. 총담보 100억 원의 80%가 80억 원이기 때문입니다.</p>
<p className="leading-8">보유 자산을 팔아 그 대금으로 빚을 갚는다면 8억 원 매도로는 부족합니다. 자산도 함께 줄기 때문입니다. x억 원을 팔면 빚은 80−x, 자산은 90−x이고 80−x=0.8×(90−x)를 풀면 x=40입니다. 매각 후 자산 50·빚 40으로 비율을 맞춥니다.</p>
<p className="leading-8">허용 비율까지 70%로 낮아지면 외부 현금 상환액은 17억 원입니다. 내부 매각만으로 맞출 때는 80−x=0.7×(90−x)이므로 약 56.67억 원을 팔아야 합니다. 수수료와 가격 충격은 생략했으므로 실제 필요액은 더 클 수 있습니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 부족액을 메우는 방법마다 현금 규모가 다릅니다. 강제 매각의 계약 근거를 원문에서 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 미국 증권 계좌는 사전 연락을 기다려 주지 않을 수 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">FINRA의 증권 신용계좌 위험 공시는 회사가 연락 없이 자산을 처분할 수 있음을 명시합니다. 미국의 이 규칙을 모든 나라 대출에 그대로 적용하지는 않지만 투자자가 납부 기한을 임의로 정할 수 없다는 점을 보여 줍니다.</p>
<p className="leading-8">앞의 40억 원 매각 계산은 가격이 90에 고정되고 계약이 80% 기준을 유지한다는 가정입니다. 실제 계약은 더 높은 내부 유지 기준과 처분 권한을 둘 수 있습니다.</p>
        </div>
<SourceApplication source="FINRA · Guidance on Margin, risks" excerpt="The firm can sell your securities or other assets without contacting you." application="90억 원 자산·80억 원 빚을 가정한 80% 한도에 맞추려면 내부 매각만으로 40억 원이 필요합니다. 투자자가 회복을 기다리고 싶어도 약관의 처분 권한이 앞설 수 있습니다." />
<CitationBlock source="FINRA · Guidance on Margin, risks" citeKey={1} href="https://www.finra.org/sites/default/files/InvestorDocument/p005895.pdf">원문 위치: FINRA · Guidance on Margin, risks · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">강제 매각 문구를 40억 원 처분 사례에 적용했습니다. 다음에는 선물에서 같은 문제가 다른 형태로 나타나는지 봅니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 선물은 자산을 사지 않아도 정산 현금이 필요합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">CME 원문은 증거금 잔액이 가격에 따라 차감·가산된다고 설명합니다. 이 글의 자산대출과 선물은 같은 계약이 아니지만 최종 수익 전에 현금이 필요하다는 공통점을 갖습니다.</p>
<p className="leading-8">처음 10억 원을 선물 증거금으로 맡기고 손실 정산 4억 원이 나가 잔액이 6억 원이 되었다고 합시다. 유지 기준 7억 원 아래이면 처음 요구액 10억 원까지 복원해야 한다고 합시다. 이 조건에서 추가액은 1억 원이 아니라 4억 원입니다. 이 숫자는 CME의 실제 특정 상품 요율이 아닌 비교 가정입니다.</p>
<p className="leading-8">한국·미국·EU의 고객 계좌는 담보 인정 자산과 매각·상계 규칙이 다릅니다. 국제 원칙은 공통 위험 관리 방향을 제시하지만 개별 고객의 납부 시간과 재산 보호는 해당 법과 계약이 정합니다.</p>
        </div>
<SourceApplication source="CME · Performance Bonds/Margins FAQ" excerpt="debited and credited accordingly" application="기존 100→90억 원 자산 사례는 빚 대비 담보 비율을 검사합니다. 선물에서는 정산 후 계좌 잔액을 검사하므로 같은 가격 하락이라도 추가액 계산식이 다릅니다." />
<CitationBlock source="CME · Performance Bonds/Margins FAQ" citeKey={2} href="https://www.cmegroup.com/solutions/risk-management/performance-bonds-margins/faq-performance-bonds-margins.html">원문 위치: CME · Performance Bonds/Margins FAQ · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock><CitationBlock source="CPMI-IOSCO · Principles for Financial Market Infrastructures" citeKey={3} href="https://www.iosco.org/library/pubdocs/pdf/ioscopd377-pfmi.pdf">CPMI-IOSCO · Principles for Financial Market Infrastructures</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">대출 비율과 선물 잔액의 서로 다른 계산을 비교했습니다. 마지막으로 시장 전체로 번지는 경로를 살핍니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 모두의 매각이 다른 사람의 담보 부족을 만듭니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">여러 사람이 40억 원씩 팔려 하면 충분한 매수자가 없는 가격대까지 내려갈 수 있습니다. 그러면 아직 팔지 않은 투자자도 담보 가치 하락으로 추가 지급을 요구받습니다. 자금 부족과 거래 가격 하락이 서로를 키우는 고리입니다.</p>
<p className="leading-8">반대로 만기와 통화가 맞는 현금 여유를 확보하면 강제 매각을 피할 시간이 생깁니다. 장부상 이익·집·장기채를 갖고 있다는 사실과 오늘 납부할 현금이 있다는 사실을 구분해야 합니다. 스트레스 계산에는 가격 하락과 인정 비율 하락을 동시에 넣습니다.</p>
        </div>
<CitationBlock source="BIS · Market and funding liquidity, overview" citeKey={4} href="https://www.bis.org/speeches/20160502-market-and-funding-liquidity-overview">BIS · Market and funding liquidity, overview</CitationBlock>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">자산 수익률뿐 아니라 버틸 수 있는 지급 경로까지 확인했습니다. 같은 장부로 아래의 선택을 계산합니다.</p>
        <ReviewPrompts questions={["90억 원 자산과 80억 원 빚을 80% 한도에 맞추려면 현금 상환과 추가 담보는 각각 얼마인가요? (답: 7절)", "보유 자산을 팔아 빚을 갚으면 왜 8억 원이 아니라 40억 원을 팔아야 하나요? (답: 7절)", "증거금 잔액 6억 원·유지 7억 원·복원 목표 10억 원이면 추가 납입은 얼마인가요? (답: 9절)"]} />
      </section>
    </div>
  );
}
