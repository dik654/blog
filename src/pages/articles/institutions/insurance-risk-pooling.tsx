import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 보험은 작은 보험료를 모아 큰 손실을 나누지만 모든 위험을 없애지는 못한다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function InsuranceRiskPoolingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">모두에게 300만 원을 쥐여줄 필요는 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">1천 명이 각 10만 원을 내면 보험료 1억 원이 모입니다. 20명이 평균 300만 원의 손해를 입으면 6천만 원을 지급합니다. 남은 4천만 원은 전부 순이익이 아닙니다. 심사·모집·운영비와 앞으로의 사고 불확실성을 감당할 자본이 필요합니다.</p>
          <p className="leading-7">보험 가입자는 사고가 없으면 보험료를 돌려받지 못할 수 있지만 큰 손실을 감당하지 않아도 되는 확실성을 삽니다. 보험사는 손해가 언제 얼마나 모일지 예측해야 합니다.</p>
        </div>
        <FlowRail
          title="(가정) 1천 명이 각 10만 원 보험료, 20명이 평균 300만 원 손해"
          steps={[
            { actor: "가입자 1천 명", movement: "각 10만 원, 모두 합해 1억 원을 냅니다.", receives: "약정 사고 때 보상 청구권" },
            { actor: "사고자 20명", movement: "각 평균 300만 원 손해를 신고합니다.", receives: "합계 6천만 원 보험금" },
            { actor: "보험사·재보험사", movement: "심사·지급·준비금과 대형 위험을 관리합니다.", receives: "비용·자본 몫과 재보험료" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보험료 1억 원과 지급 6천만 원을 나눠 적었습니다. 한꺼번에 사고가 날 때 이 계산이 왜 흔들리는지 봅니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같이 모을 수 있는 위험과 같이 터지는 위험을 구분합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">자동차 사고처럼 사람마다 우연히 발생하는 위험은 큰 집단에서 평균을 추정하기 쉽습니다. 그러나 한 지역의 홍수나 광범위한 전염병처럼 많은 계약이 동시에 손해를 내면 풀 안에서 나누는 힘이 약해집니다.</p>
          <p className="leading-7">보험사는 면책·자기부담금·보상 한도·대기 기간으로 지급 조건을 정하고 재보험으로 큰 위험 일부를 넘길 수 있습니다. 가입자는 사고 위험을 알고 보험사는 모를 수 있으므로 심사와 가입 조건도 중요합니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">풀 안의 위험과 동시에 닥치는 재난을 갈랐다면 계약의 보장 조건을 읽을 수 있습니다. 제도별 재원 차이를 확인합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">보험과 사회보장은 위험 풀의 돈을 모으는 방식이 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">미국 NAIC의 소비자 안내는 보험료를 모아 약정 손실을 지급하는 원리를 설명합니다. WHO는 의료 재원의 pooling이 개인에게 의료비 위험이 집중되지 않도록 하는 기능이라고 설명합니다. 민간 손해보험과 공공 건강보장을 같은 계약이라고 볼 수는 없습니다.</p>
          <p className="leading-7">한국·영국·미국·일본·인도 등은 공보험·민간보험의 경계와 의무 가입 범위가 다릅니다. 어느 나라든 누가 보험료를 내고 누가 보상 대상을 정하며 결손을 누가 메우는지를 먼저 묻습니다.</p>
        </div>
        <SourceApplication source="NAIC · How Does Insurance Work?" excerpt="the company agrees to pay its share of the cost for covered losses or events" application="1천 명이 낸 1억 원 중 약정 사고를 당한 20명에게 6천만 원을 지급합니다. 남은 4천만 원은 운영비와 미래 위험을 포함하므로 확정 이익이라고 말할 수 없습니다." />
        <CitationBlock source="NAIC How Does Insurance Work?" citeKey={1} href="https://content.naic.org/consumer/how-does-insurance-work">미국 보험 감독당국 협의체의 위험 풀·보험료·보상 개요입니다.</CitationBlock>
        <CitationBlock source="WHO Pooling revenues and reducing fragmentation" citeKey={2} href="https://www.who.int/activities/pooling">의료 재원의 위험 공유와 풀 분절의 한계를 설명합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">NAIC의 약정 손실 문구를 숫자에 대입했습니다. 남은 4천만 원을 순이익이라 부를 수 없는 이유를 정리합니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">보험료가 싸다는 사실만으로 보장이 충분한 것은 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">보상 한도와 면책, 실손 여부, 중복 보장, 갱신 때 보험료 변경, 보험사의 지급 능력을 확인해야 합니다. 상품이 보장하는 사고와 고객이 걱정하는 손실이 다르면 낮은 보험료는 의미가 없습니다.</p>
          <p className="leading-7">국가적 재난은 민간 보험의 자본만으로 감당하기 어렵고 정부의 재난 지원이나 별도 재보험 구조가 필요할 수 있습니다. 모든 손실을 하나의 보험으로 완전히 옮길 수는 없습니다.</p>
        </div>
        <ReviewPrompts questions={[
          "1천 명이 10만 원씩 낸 보험료에서 20명에게 300만 원씩 지급하면 남는 돈이 곧 순이익일까요? (답: 2절)",
          "많은 가입자가 동시에 같은 재난을 당하면 위험 풀이 왜 약해질까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
