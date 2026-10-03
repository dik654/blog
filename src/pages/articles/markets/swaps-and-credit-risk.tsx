import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 스왑은 원금을 통째로 바꾸기보다 서로 필요한 현금흐름을 교환한다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function SwapsAndCreditRiskArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10억 원이라는 숫자가 오가야 스왑이 성립하는 것은 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">두 회사가 10억 원을 기준으로 한쪽은 연 4% 고정을 내고 다른 쪽은 연 6% 변동을 낸다고 합시다. 같은 날 순액 정산한다면 4천만 원과 6천만 원을 모두 보내는 대신 차액 2천만 원만 한쪽으로 갈 수 있습니다.</p>
          <p className="leading-7">10억 원은 지급액을 계산하는 명목원금입니다. 지금 당장 10억 원을 잃을 위험과 같지 않습니다. 다만 금리가 바뀌면 앞으로 주고받을 돈의 현재가치와 담보 요구가 달라집니다.</p>
        </div>
        <FlowRail
          title="(가정) 명목원금 10억 원, 고정금리 4%, 변동금리 6%"
          steps={[
            { actor: "고정금리 지급자", movement: "10억 원 기준 연 4천만 원을 지급합니다.", receives: "변동금리 수취" },
            { actor: "변동금리 지급자", movement: "현재 기준 연 6천만 원을 지급합니다.", receives: "고정금리 수취" },
            { actor: "담보·청산 상대", movement: "시가 변동과 채무불이행을 관리합니다.", receives: "담보와 수수료" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">10억 원은 계산의 기준이고 실제 움직이는 것은 이자 차액입니다. 누가 고정과 변동을 주고받는지 계산합니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">기존 부채와 스왑을 더해 실제 노출을 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">변동금리 대출이 있는 회사가 스왑에서 변동을 받고 고정을 지급하면 두 변동금리 흐름이 상쇄되어 대체로 고정금리 부담이 남습니다. 스왑만 보면 왜 이 계약을 했는지 알 수 없습니다.</p>
          <p className="leading-7">CDS는 채무불이행 같은 신용 사건이 발생하면 보호 매도자가 보상하고 보호 매수자는 정기 보험료와 비슷한 프리미엄을 냅니다. 실제 채권을 가진 보호 매수자는 신용 위험을 줄일 수 있지만 기초 채권 없이 계약을 맺으면 새로운 신용 가격 노출이 생깁니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">4천만 원 지급과 6천만 원 수취를 나누면 차액은 2천만 원입니다. 다른 스왑의 계약 조건과 신용 위험을 봅니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">장외 계약은 상대방과 청산·담보 방식이 중요합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">미국 CFTC 자료는 CDS를 신용 사건에 대한 지급과 정기 지급의 교환으로 정의합니다. BIS 통계는 장외 파생상품의 명목원금·총시가·신용노출을 따로 발표합니다. 세 수치를 하나의 위험액으로 읽으면 시장의 크기를 잘못 이해합니다.</p>
          <p className="leading-7">금리 스왑의 일정·기준금리·지급 주기, 통화 스왑의 원금 교환 여부, CDS의 신용 사건 정의는 계약마다 다릅니다. 중앙청산 의무와 담보 규칙도 관할권과 상품에 따라 달라집니다.</p>
        </div>
        <SourceApplication source="US CFTC · Swaps Report Data Dictionary, Fixed-Float" excerpt="a fixed rate of interest multiplied by a notional amount" application="명목원금 10억 원에 4% 고정 지급은 연 4천만 원, 6% 변동 수취는 연 6천만 원입니다. 같은 기간·기준이면 차액은 2천만 원이며 명목원금 10억 원 자체가 교환된다는 뜻은 아닙니다." />
        <CitationBlock source="CFTC Swaps Report Data Dictionary" citeKey={1} href="https://www.cftc.gov/MarketReports/SwapsReports/DataDictionary/index.htm">CDS와 금리·총수익 스왑의 계약 다리 정의를 제공합니다.</CitationBlock>
        <CitationBlock source="BIS OTC Derivatives Statistics" citeKey={2} href="https://data.bis.org/topics/OTC_DER">명목원금·총시가·신용노출을 구분하는 공식 국제 통계입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">CFTC의 분류는 약정 현금흐름을 보여 줍니다. 상대가 지급하지 못할 때 숫자가 얼마나 달라지는지 남겨 둡니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">위험을 넘겨도 상대방이 돈을 못 내면 보호는 실패합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">CDS 보호 매도자가 신용 사건 때 지급하지 못하면 보호 매수자는 채권 손실과 계약 손실을 동시에 만날 수 있습니다. 금리 스왑도 상대방 부도와 담보 공백이 남습니다.</p>
          <p className="leading-7">명목원금 10억 원보다 작은 시가가 위험을 전부 설명하지는 않습니다. 스트레스 상황의 미래 변동, 동시 부도, 담보 품질과 법적 상계 가능성을 별도로 봐야 합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "고정금리와 변동금리를 교환하면 원금 자체가 반드시 이동할까요? 어떤 현금흐름을 바꿨는지 적어 보세요. (답: 2절)",
          "상대방 신용이 나빠질 때 약정 이익과 실제 받을 돈은 왜 달라질까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
