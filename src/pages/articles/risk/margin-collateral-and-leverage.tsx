import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 담보와 증거금은 최종 손익보다 먼저 현금을 요구한다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function MarginCollateralAndLeverageArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">자산이 10% 내리면 자기 돈은 절반이 줄 수 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">20억 원의 자기 돈과 80억 원의 빚으로 100억 원 자산을 샀다고 합시다. 자산이 90억 원이 되면 빚 80억 원은 그대로이므로 남는 자기 몫은 10억 원입니다. 자산 수익률은 -10%지만 자기자본 손실은 -50%입니다.</p>
          <p className="leading-7">대출자가 담보 비율을 다시 맞추라면 미래에 가격이 회복될 것이라는 믿음만으로는 부족합니다. 현금이나 추가 담보를 오늘 내야 합니다.</p>
          <p className="leading-7">차입이 자기자본 손익을 키우는 원리는 <Link to="/finance/markets/equity-claims-and-valuation#leverage">재무 레버리지 글</Link>에서 이어받습니다. 여기서는 계약을 유지할 담보 여력이 언제 사라지는지에 집중합니다.</p>
        </div>
        <FlowRail
          title="(가정) 자기자본 20억 원, 차입 80억 원, 자산 100억 원이 10% 하락"
          steps={[
            { actor: "투자자", movement: "20억 원을 넣고 80억 원을 빌려 100억 원 자산을 삽니다.", receives: "자산 상승 시 확대된 자기 몫" },
            { actor: "대출자·청산기관", movement: "담보 가치와 유지 기준을 매일 확인합니다.", receives: "대출 상환과 보호 담보" },
            { actor: "시장", movement: "강제 매도 물량을 현재 호가에 받아들입니다.", receives: "가격 변화와 추가 담보 요구" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">자산 100억 원의 10% 손실이 자기자본 20억 원을 얼마나 깎는지 보았습니다. 자금 요청이 오는 시점을 추적합니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">시가 평가와 유지 기준이 매도 시점을 앞당깁니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">선물의 초기 증거금은 계약 이행 담보입니다. 가격 변동에 따른 일별 정산 손실은 현금으로 빠져나가고 유지 증거금 아래로 내려가면 추가 납입 요구가 생길 수 있습니다. 주식 담보대출도 담보 가치가 줄면 대출 한도가 줄어듭니다.</p>
          <p className="leading-7">여러 투자자가 같은 자산을 담보로 쓰면 가격 하락 → 담보 부족 → 매도 → 추가 하락의 고리가 생깁니다. 누구나 매수자를 찾는 시장일 때는 천천히 움직여도 한꺼번에 팔아야 할 때는 호가가 얇아질 수 있습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">자기자본은 10억 원으로 줄었지만 빚 80억 원은 그대로입니다. 유지 증거금이 요구하는 현금과 비교합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">담보 규칙은 손실을 없애지 않고 분배를 바꿉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">CPMI-IOSCO의 금융시장 인프라 원칙은 중앙청산기관의 위험 관리와 담보·증거금을 다룹니다. CME 자료는 선물의 초기·유지 증거금과 변동증거금 흐름을 설명합니다. 장외 계약은 계약서와 현지 규제에 따라 담보와 상계가 다릅니다.</p>
          <p className="leading-7">BIS는 자금 유동성이 악화하면 시장 유동성도 얇아지고 다시 자금조달이 어려워질 수 있다고 설명합니다. 그래서 상품의 최종 손익과 중간 현금 요구를 같은 위험표에 넣어야 합니다.</p>
        </div>
        <SourceApplication source="CME Group · Understanding Margin Changes" excerpt="maintenance margin, the level at which market participants must maintain their margin over time" application="자산 100억 원이 10% 내려 90억 원이 되고 빚 80억 원은 그대로면 자기자본은 20억 원에서 10억 원으로 줄어듭니다. 남은 담보가 유지 요구액보다 낮으면 최종 매각 전에도 현금이 필요합니다." />
        <CitationBlock source="CME Understanding Margin Changes" citeKey={1} href="https://www.cmegroup.com/education/articles-and-reports/understanding-margin-changes">초기·유지 증거금과 평가손익 정산의 공식 설명입니다.</CitationBlock>
        <CitationBlock source="CPMI-IOSCO Principles for Financial Market Infrastructures" citeKey={2} href="https://www.iosco.org/library/pubdocs/pdf/ioscopd377-pfmi.pdf">청산기관·담보·위험 관리의 국제 원칙입니다.</CitationBlock>
        <CitationBlock source="BIS Market and Funding Liquidity" citeKey={3} href="https://www.bis.org/speeches/20160502-market-and-funding-liquidity-overview">자금 유동성과 거래 유동성 사이의 되먹임을 설명합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">CME의 유지 증거금 정의를 사례에 대입했습니다. 만기 수익보다 오늘의 담보가 먼저 제약이 되는 경우를 봅니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">명목상 헤지에도 현금 위기는 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">농가가 밀값 상승 때 매도 선물에서 손실을 봐도 나중에 비싸게 밀을 팔 수 있습니다. 하지만 증거금 청구는 판매 대금보다 먼저 옵니다. 이 시간차를 버틸 현금 한도가 없다면 올바른 방향의 헤지도 중단될 수 있습니다.</p>
          <p className="leading-7">담보로 낸 자산의 품질, 할인율, 상계 가능성, 청산기관의 규칙, 시장 중단 시 처리 방식은 계약별로 확인해야 합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "최종 예상 이익이 있어도 오늘 담보가 모자라면 어떤 순서로 포지션을 줄여야 할까요? (답: 2절)",
          "원금 규모와 처음 낸 증거금을 같은 손실 한도로 생각하면 어떤 실수가 생길까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
