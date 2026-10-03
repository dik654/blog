import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 별도 표시한 숫자 사례는 설명용 가정입니다. */
export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 빚을 없애지 않고 갚는 방식만 바꿀 수 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">회사가 설비를 사려고 돈을 빌렸는데 이자율이 계속 바뀐다고 합시다. 매출은 천천히 바뀌는데 이자가 갑자기 늘면 공장 운영이 어려워집니다. 기존 대출을 모두 갚지 않고도 다른 계약에서 받는 돈으로 이 변화를 상쇄할 수 있습니다.</p>
<p className="leading-8">이 글은 실제 대출과 별도 약속을 한 장부에 합칩니다. 크게 적힌 기준 금액, 정기적으로 오가는 차액, 상대가 지급하지 않을 때의 손실이 서로 어떻게 다른지 계산합니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">기존 빚 위에 지급 방식 변경 계약을 얹는 이유를 잡았습니다. 세 사람의 현금 경로를 연결합니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 빌린 곳에 갚고 다른 곳에서 일부를 돌려받습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">회사는 은행에 변하는 이자를 냅니다. 별도 계약 상대에게 정해진 이자를 내는 대신, 그 상대에게서 같은 기준으로 변하는 이자를 받습니다. 두 변동이 같은 금액과 날짜에 맞으면 회사에는 정해진 부담이 남습니다.</p>
<p className="leading-8">은행 대출과 교환 계약은 다른 약속입니다. 한쪽에서 받을 돈이 늦어져도 다른 쪽에 낼 의무는 그대로일 수 있습니다.</p>
        </div>
<FlowRail title="기존 빚과 별도 지급 교환" steps={[{"actor": "회사", "movement": "은행에 변하는 이자를 냅니다.", "receives": "설비 자금 유지"}, {"actor": "교환 상대", "movement": "변하는 이자를 회사에 지급합니다.", "receives": "회사에서 정해진 이자 수취"}, {"actor": "은행", "movement": "회사의 대출 이자를 받습니다.", "receives": "원금과 이자 청구"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">대출과 교환의 두 경로가 보입니다. 10억 원을 기준으로 같은 기간의 이자를 계산합니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 10억 원의 4%와 6% 차이는 2000만 원입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">회사 대출 원금은 10억 원이고 해당 1년의 대출 이자율은 6%라고 합시다. 별도 계약에서 회사는 같은 10억 원에 대해 4%를 지급하고 6%를 받습니다. 날짜와 계산 기간이 같고 대출 가산금리는 없다는 가정입니다.</p>
<p className="leading-8">은행에 6000만 원을 내고, 교환 상대에게서는 6000만−4000만=2000만 원을 순수취합니다. 합친 순지출은 4000만 원입니다. 10억 원을 다시 받아야 계산이 성립하는 것은 아닙니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">기준 원금과 실제 지급액을 나눴습니다. 교환 약속 안의 계산 조건을 엽니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 같은 숫자를 곱해도 날짜와 기준이 다르면 어긋납니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">두 지급액에는 기준 금액, 이자율, 적용 기간과 지급 날짜가 들어갑니다. 회사가 갚는 이율과 받는 이율이 서로 다른 기준을 따르면 변하는 부분이 완전히 지워지지 않습니다.</p>
<p className="leading-8">대출 6% 안에는 회사의 신용 때문에 추가된 1%가 있다고 합시다. 교환 계약에서 기준 5%만 받는다면 고정 4% 외에 1%가 남습니다. 똑같이 변하는 이자라고 부르는 것만으로 상쇄가 성립하지 않습니다.</p>
        </div>
<FlowRail title="지급 약속의 내부 조건" steps={[{"actor": "얼마를 기준으로 하나?", "movement": "10억 원을 적습니다.", "receives": "이자 계산의 크기"}, {"actor": "어떤 비율을 쓰나?", "movement": "고정 4%와 같은 기준의 변동을 적습니다.", "receives": "두 지급액"}, {"actor": "언제 지급하나?", "movement": "같은 기간과 날짜를 맞춥니다.", "receives": "순지급 가능 여부"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">맞춰야 할 조건은 이율 이름만이 아님을 확인했습니다. 원금을 움직이지 않는 이유를 봅니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 필요한 위험만 바꾸면 원금을 다시 조달할 필요가 줄어듭니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">회사는 공장에 이미 10억 원을 썼으므로 이자를 고정하려고 설비를 팔 필요는 없습니다. 별도 계약이 변동 이자만 맞춰 주면 기존 대출과 사업을 유지할 수 있습니다.</p>
<p className="leading-8">회사가 외화 원금도 필요하다면 시작과 끝에 서로 다른 통화의 원금을 바꾸는 계약이 필요할 수 있습니다. 원금 교환 여부는 교환 계약이라는 이름 하나로 정해지지 않습니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">교환할 대상을 금리와 원금으로 나눴습니다. 이제 현금흐름의 표준 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 스왑의 두 지급 흐름과 신용 보호를 이름 붙입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">조건이 다른 지급 흐름을 맞바꾸는 계약은 스왑, swap입니다. 각 지급 흐름을 다리, leg라고 하고 계산의 기준 금액을 명목원금이라고 합니다. 같은 통화 금리 스왑에서는 보통 명목원금 자체를 주고받지 않습니다.</p>
<p className="leading-8">서로 다른 통화의 원금과 이자를 바꾸는 계약은 통화스왑입니다. 정해진 신용 사건 때 지급받는 대신 정기 대가를 내는 계약은 신용부도스왑, CDS입니다. 여기서 신용 사건은 계약이 정한 부도·지급 불이행 등의 조건입니다.</p>
<p className="leading-8">받을 돈과 낼 돈을 법적으로 합쳐 차액을 남기는 것은 상계입니다. 현재 계약을 새 상대와 대체할 때의 가치는 시가이며 지급액을 계산하는 명목원금과 다릅니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">기준·지급·대체가치의 이름을 구분했습니다. 같은 대출에서 금리가 바뀌는 두 경우를 추적합니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 6%가 2%가 되어도 합친 부담은 4%입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">처음 사례에서는 은행에 6000만 원, 스왑에서 2000만 원 순수취이므로 순지출 4000만 원입니다. 다음 기간 기준금리가 2%가 되면 은행에는 2000만 원, 스왑 상대에게는 4000만−2000만=2000만 원을 냅니다. 합계는 다시 4000만 원입니다.</p>
<p className="leading-8">따라서 금리 상승을 막는 대가로 금리 하락의 이득도 포기합니다. 대출 원금·기준금리·기간이 같다는 조건이 깨지면 고정된 합계가 달라집니다. 분기마다 계산하면 연이율에 실제 기간 비율을 곱해야 합니다.</p>
<p className="leading-8">대출 가산금리가 1%라면 첫 기간 은행에 7000만 원을 내고 스왑에서 2000만 원을 받아 순지출은 5000만 원입니다. 스왑이 회사 신용에 붙은 비용까지 지워 주지는 않습니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">10억 원의 두 다리를 같은 기간에 합쳤습니다. 공식 정의에서 고정 지급이 어떻게 계산되는지 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 고정 지급 원문에 명목원금과 기간을 대입합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">CFTC 사전의 Fixed-Float 설명은 고정 이율과 명목원금을 곱해 한쪽 지급액을 만든다고 적습니다. 아래 발췌에 사례의 10억 원과 4%를 넣으면 1년 고정 지급은 4000만 원입니다.</p>
<p className="leading-8">사전의 오래된 설명 예에는 지금 쓰지 않는 기준금리 명칭이 남아 있을 수 있습니다. 실제 신규 계약의 기준과 대체 조항은 현재 계약서를 읽어야 합니다. 이 글의 6%는 특정 지표의 현재 수준이 아닙니다.</p>
        </div>
<SourceApplication source="CFTC · Swaps Report Data Dictionary, Fixed-Float" excerpt="a fixed rate of interest multiplied by a notional amount" application="10억 원×4%×1년=4000만 원입니다. 같은 기간 변동 수취 6000만 원과 상계하면 회사가 2000만 원을 받습니다." />
<CitationBlock source="CFTC · Swaps Report Data Dictionary, Fixed-Float" citeKey={1} href="https://www.cftc.gov/MarketReports/SwapsReports/DataDictionary/index.htm">원문 위치: CFTC · Swaps Report Data Dictionary, Fixed-Float · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">원문 정의를 4000만 원 지급에 적용했습니다. 다음에는 지급 원인이 금리에서 신용 사건으로 바뀔 때를 비교합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 신용 보호는 손실이 아니라 계약의 사건을 보고 지급합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">같은 10억 원 규모의 채권을 가진 사람이 CDS 보호를 샀다고 합시다. 신용 사건 뒤 채권 회수율이 40%라고 합시다. 현금결제 조건이 그 회수율을 사용한다면 채권에서 4억 원, CDS에서 6억 원을 받습니다. 정기 지급과 상대방 부도는 별도로 고려해야 합니다.</p>
<p className="leading-8">통화스왑에서는 10억 원과 약정 외화를 시작에 교환하고 만기에 되돌리는 구조가 있을 수 있습니다. 금리 스왑에서 원금이 움직이지 않는다는 설명을 통화스왑에 그대로 옮길 수 없습니다. 미국과 EU 모두 상품과 참여자에 따라 청산·담보 규칙이 다르므로 거래소 상장 여부만으로 규제 범위를 판단하지 않습니다.</p>
        </div>
<SourceApplication source="CFTC · Swaps Report Data Dictionary, Credit Default Swaps" excerpt="should a credit event occur" application="10억 원 채권의 가정 회수율 40%에서 손실은 6억 원입니다. 계약이 정한 신용 사건과 결제 조건이 충족되고 보호 매도자가 지급해야 6억 원 보상이 실현됩니다." />
<CitationBlock source="CFTC · Swaps Report Data Dictionary, Credit Default Swaps" citeKey={1} href="https://www.cftc.gov/MarketReports/SwapsReports/DataDictionary/index.htm">원문 위치: CFTC · Swaps Report Data Dictionary, Credit Default Swaps · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock><CitationBlock source="ESMA · Clearing obligation and risk mitigation techniques under EMIR" citeKey={2} href="https://www.esma.europa.eu/post-trading/clearing-obligation-and-risk-mitigation-techniques-under-emir">ESMA · Clearing obligation and risk mitigation techniques under EMIR</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">금리 차액과 신용 사건 지급은 서로 다른 조건입니다. 마지막으로 약정상 이익을 실제 회수액으로 바꿔 봅니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 명목원금도 현재 시가도 최악의 손실과 같지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">10억 원은 이자 계산 기준이고 당기 순수취액은 2000만 원입니다. 계약을 오늘 대체하는 비용은 앞으로 남은 지급들의 현재가치로 계산하므로 이 두 금액과 다시 다릅니다. BIS가 명목원금·총시가·상계 후 신용노출을 따로 집계하는 이유입니다.</p>
<p className="leading-8">CDS 매도자가 지급하지 못하면 6억 원 보호는 약정에만 남습니다. 담보가 있어도 처분 가격·지급 지연·상계의 법적 효력을 확인해야 합니다. 채권 부도와 보호 매도자 부도가 함께 발생할 수도 있습니다. 두 위험을 따로 더한 계산으로는 이때의 손실을 놓칠 수 있습니다.</p>
        </div>
<CitationBlock source="BIS · OTC derivatives statistics" citeKey={3} href="https://data.bis.org/topics/OTC_DER">BIS · OTC derivatives statistics</CitationBlock>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">계산 기준과 실제 받을 돈을 구별하는 데서 설명을 마칩니다. 같은 10억 원을 아래 질문에 다시 대입합니다.</p>
        <ReviewPrompts questions={["변동금리가 2%로 내려가면 회사가 은행과 스왑에 각각 내는 금액은 얼마인가요? (답: 7절)", "10억 원 채권의 회수율 40%에서 CDS는 어떤 조건 아래 6억 원을 보상하나요? (답: 9절)", "명목원금·당기 지급액·현재 시가를 하나의 손실액으로 읽으면 왜 틀리나요? (답: 10절)"]} />
      </section>
    </div>
  );
}
