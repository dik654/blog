import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 교육은 기술을 만들고 자격을 보여 주지만 두 효과는 다르다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function EducationSkillsAndSignalsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">교육비 1천만 원을 내고 연봉 200만 원이 올라도 계산은 끝나지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">교육비 1천만 원과 취업을 1년 늦춘 비용을 냈다고 합시다. 연 임금이 200만 원 늘어도 세금, 근속 기간, 실업 위험과 대체 경로를 모르면 투자 수익을 단정할 수 없습니다. 평균 졸업생 임금도 원래 능력과 가정 배경의 차이를 포함할 수 있습니다.</p>
          <p className="leading-7">교육의 편익은 임금 외에 건강, 시민 참여, 직업 선택의 폭에도 있습니다.</p>
        </div>
        <FlowRail
          title="(가정) 교육비 1천만 원, 연 임금 증가 200만 원, 취업 지연 1년"
          steps={[
            { actor: "학습자·가계", movement: "교육비 1천만 원과 학습 시간을 냅니다.", receives: "능력·자격·취업 기회" },
            { actor: "학교·훈련기관", movement: "교사·시설·평가에 돈을 씁니다.", receives: "수업료와 공공 재원" },
            { actor: "고용주·정부", movement: "기술을 쓰고 교육에 보조금을 댑니다.", receives: "생산성과 세입" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">학비 1천만 원과 임금 증가 200만 원을 적었습니다. 자격과 실제 기술 중 무엇이 바뀌었는지 봅니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">기술 습득과 신호, 인맥을 분리해 관찰합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">수업이 문제 해결 능력을 키우면 같은 사람이 다른 일을 할 수 있습니다. 자격증은 이미 가진 능력을 고용주에게 보여 줄 수도 있습니다. 학교의 인맥과 채용 통로는 별도의 효과입니다.</p>
          <p className="leading-7">어느 경로가 큰지 알려면 수업 전후 능력, 직무 성과, 자격 요건이 바뀐 채용 결과를 비교해야 합니다. 졸업장과 임금의 상관만으로 수업 효과를 증명할 수 없습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">수업·선발·취업 연결의 경로를 나눴습니다. 국가별 공공 부담을 개인 학비와 구분합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">국가별 공공 부담과 개인 부담을 같이 놓습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">OECD 2026 교육 지표는 교육 단계별 공공·민간 지출과 학생당 자원을 비교합니다. 국가마다 등록금, 장학금, 직업훈련, 채용 관행과 자격 인정을 위한 규칙이 다릅니다.</p>
          <p className="leading-7">같은 학위라도 노동 수요, 이민 규정, 언어와 산업 구조가 다르면 임금 결과가 달라집니다. 학습 기회의 분배도 평균 수익률과 함께 봅니다.</p>
        </div>
        <SourceApplication source="OECD Education at a Glance 2026 · Figure C1.1" excerpt="Government expenditure on education as a percentage of GDP and as a percentage of government expenditure on all services" application="개인이 낸 학비 1천만 원은 정부 지출/GDP나 정부 예산 중 교육비 비율의 분자에 바로 넣을 수 없습니다. 교육 투자의 부담 주체와 분모부터 구분합니다." />
        <CitationBlock source="OECD Education at a Glance 2026: Education Finance" citeKey={1} href="https://www.oecd.org/en/publications/education-at-a-glance-2026_b4968bbc-en/full-report/key-system-level-indicators-of-education-finance_d143f855.html">2026년 교육 단계별 재원과 지출의 국제 비교 자료입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">OECD의 교육 재정 분모를 확인했습니다. 평균 지출에서 한 개인의 임금 수익을 바로 끌어낼 수는 없습니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">평균 임금 상승을 모든 개인의 수익으로 약속할 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">산업의 기술 수요가 바뀌면 지금의 자격 가치도 바뀝니다. 학비 대출의 금리와 상환 유예가 현금 부담의 시점을 바꿉니다.</p>
          <p className="leading-7">진로 선택에는 과정별 완료율, 실제 직무 연결, 비용, 대안 교육과 교육 뒤 경력의 분산을 확인해야 합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "학비 1천만 원을 연 임금 증가 200만 원으로 나눈 5년이 실제 회수 기간과 다른 이유는 무엇일까요? (답: 2절)",
          "졸업장 소지자의 높은 임금이 모두 수업 효과라고 말할 수 있을까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
