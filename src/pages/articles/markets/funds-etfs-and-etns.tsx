import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** ETF와 ETN은 거래 화면이 비슷해도 손에 쥔 청구권이 다르다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function FundsEtfsAndEtnsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">두 상품 모두 지수를 따라도 위험의 상대방은 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">자산 한 좌의 순가치가 1만 원인데 ETF가 거래소에서 1만100원에 거래된다고 합시다. 투자자는 기초자산 가치보다 100원을 더 내고 산 셈입니다. ETF가 지수와 비슷하게 움직이더라도 실제 체결 가격은 순자산가치와 항상 같지 않습니다.</p>
          <p className="leading-7">ETN은 화면에서 주식처럼 거래되지만 특정 자산 묶음의 소유 지분이 아니라 발행자가 지수에 따라 돈을 갚겠다는 약속입니다. 발행자의 채무 이행 능력을 별도로 봐야 합니다.</p>
        </div>
        <FlowRail
          title="(가정) 자산 순가치 1만 원, ETF 거래가격 1만100원, ETN 발행자 부도"
          steps={[
            { actor: "투자자", movement: "시장가격 1만100원에 상품을 삽니다.", receives: "펀드 지분 또는 발행자 청구권" },
            { actor: "운용사·지정참가자", movement: "자산 묶음과 ETF 설정·환매를 관리합니다.", receives: "보수와 거래 차익 기회" },
            { actor: "ETN 발행자", movement: "지수 연계 지급을 약속합니다.", receives: "채무 조달과 수수료" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">순자산가치 1만 원과 시장가격 1만100원을 따로 적었습니다. 투자자가 실제로 가진 청구권을 봅니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">상품 이름 대신 재산과 청구권을 적습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">펀드는 여러 투자자의 돈으로 자산을 보유하고 투자자는 지분을 가집니다. ETF는 그 펀드 지분이 거래소에서 오가며 지정참가자의 설정·환매가 시장가격과 순자산가치의 괴리를 줄이는 경로가 됩니다. 괴리가 즉시 0이 되는 보장은 아닙니다.</p>
          <p className="leading-7">ETN은 발행자에게 돈을 빌려준 구조에 가깝습니다. 지수 수익률과 별도로 발행자 신용, 상환 조건, 거래량과 스프레드, 보수·세금이 투자자 실현 수익을 바꿉니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">ETF 지분과 ETN 발행자 채무를 구별했다면 같은 지수 이름이 같은 위험을 뜻하지 않는다는 점이 보입니다. 공시의 범위를 확인합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">관할권과 상품설명서가 보호 범위를 정합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">미국 SEC 투자자 자료는 ETF의 보유 자산·순자산가치·시장가격과 설정·환매를 구분합니다. 미국 ETN 설명은 발행자의 무담보 채무라는 점을 강조합니다. 한국·유럽의 상품도 국내 설명서·상장 규정·세무를 각각 확인해야 합니다.</p>
          <p className="leading-7">레버리지 ETF나 인버스 상품은 일일 수익률 목표를 재설정하는 경우가 많습니다. 하루 성과를 여러 날 단순 곱한 지수 성과와 동일하다고 가정하면 안 됩니다.</p>
        </div>
        <SourceApplication source="US SEC · ETF Investor Bulletin, What is an ETF?" excerpt="receive an interest in that investment pool" application="ETF 1주를 사면 펀드의 자산 풀에 대한 지분을 갖습니다. 순자산가치 1만 원과 거래가격 1만100원은 다를 수 있고, ETN은 발행자 채무여서 같은 방식으로 풀 지분이라 부르지 않습니다." />
        <CitationBlock source="SEC Investor Bulletin: Exchange-Traded Funds" citeKey={1} href="https://www.sec.gov/files/etfs.pdf">미국 ETF의 펀드 지분·시장가격·NAV·설정 환매 구조 안내입니다.</CitationBlock>
        <CitationBlock source="SEC Testimony on ETFs and ETNs" citeKey={2} href="https://www.sec.gov/newsroom/speeches-statements/ts101911er-testimony-market-micro-structure-examination-etfs">미국 ETN의 발행자 무담보 채무 성격을 설명합니다.</CitationBlock>
        <CitationBlock source="SEC Leveraged and Inverse ETF Alert" citeKey={3} href="https://www.sec.gov/files/investor/pubs/leveragedetfs-alert.htm">일일 재설정 상품의 장기 성과 해석 한계를 안내합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">SEC의 ETF 자료는 ETN을 같은 투자 풀로 설명하지 않습니다. 이제 가격 괴리와 발행자 신용의 한계를 따져 봅니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">지수를 맞혔어도 상품을 잘 고른 것은 아닐 수 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">시장에 매도자가 적으면 ETF나 ETN의 매수·매도 호가 차이가 커질 수 있습니다. 환율과 분배금 재투자, 추적 오차와 세금을 넣으면 화면의 지수 상승률과 투자자의 순수익이 다릅니다.</p>
          <p className="leading-7">투자하기 전에는 기초자산, 법적 구조, 상대방, 상환·설정 조건, 총비용, 거래시간과 환율 노출을 한 장에 적어야 합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "ETF 한 주와 ETN 한 장을 살 때 각각 누구에게 무엇을 청구하는지 설명할 수 있나요? (답: 2절)",
          "지수 수익률이 같아도 투자자 수익률이 달라질 수 있는 비용과 위험은 무엇일까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
