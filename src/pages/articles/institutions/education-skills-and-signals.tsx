import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** teach-system S→B→0…7. 공식 문서 확인 2026-10-04, 사례 수치는 가정. */
export default function EducationSkillsAndSignalsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teaching-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">S · 교육을 선택할 때 무엇이 달라질지 묻습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">교육을 받으면 일을 더 잘하게 될 수도 있고, 이미 가진 능력을 다른 사람에게 보여 줄 수도 있습니다. 두 경우 모두 취업에 영향을 줄 수 있지만 배움의 효과를 판단할 때는 서로 구분해야 합니다.</p>
          <p className="leading-8">이 글은 학습자가 지금 내는 돈과 포기하는 소득을 적고, 이후의 임금 변화가 어느 경로에서 왔는지 살핍니다. 교육의 가치는 임금 외에도 있지만 금융적 계산을 할 때 무엇이 빠졌는지는 분명히 해야 합니다.</p>
        </div>
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">배움의 변화와 비용을 따로 볼 질문이 잡혔습니다. 큰 경로를 펼칩니다.</p>
      </section>
      <section id="black-box" data-teaching-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">B · 학습자가 시간을 쓰고 교육기관이 가르치며 고용주가 선택합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">학습자와 가계가 돈과 시간을 내면 교육기관은 교사와 시설, 평가에 자원을 씁니다. 고용주는 결과를 보고 사람을 뽑거나 일을 맡깁니다. 정부나 기업이 비용 일부를 대신 낼 수도 있습니다.</p>
          <p className="leading-8">교육기관이 받은 돈과 학습자가 최종 부담한 돈은 다를 수 있습니다. 같은 금액을 학교 수입과 정부 지원에서 두 번 세지 않도록 지급 경로를 따라갑니다.</p>
        </div>
        <NumericPath title="큰 흐름부터 읽기" steps={[{"label": "돈·시간 투입", "value": "1"}, {"label": "배우고 평가받기", "value": "2"}, {"label": "일할 기회 얻기", "value": "3"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">학습·선발·지급의 경로를 나눴습니다. 한 사람의 숫자를 놓습니다.</p>
      </section>
      <section id="case" data-teaching-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">0 · 학비 1천만 원 외에 포기한 소득 2천만 원이 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">교육비가 1천만 원이고 취업을 1년 늦추며 그동안 받을 수 있었던 소득이 2천만 원이라고 놓습니다(가정). 교육 뒤 연 임금이 200만 원 높아진다면 학비만 나눠 얻은 5년은 비용의 일부만 회수하는 계산입니다.</p>
          <p className="leading-8">세금·물가·이자와 위험을 우선 생략하면 비교할 초기 비용은 3천만 원입니다. 이 예시는 특정 학교나 학위의 실측 수익률이 아닙니다.</p>
        </div>
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">1천만 원과 3천만 원이 다른 이유를 잡았습니다. 임금 변화의 원인을 엽니다.</p>
      </section>
      <section id="picture" data-teaching-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1 · 같은 사람이 일을 더 잘하게 됐는지 살핍니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">수업 전에는 못 풀던 작업을 수업 뒤에 풀면 실제 능력의 변화를 볼 단서가 됩니다. 하지만 학교에 들어오기 전부터 능력이 높은 사람이 더 많이 선발됐다면 졸업자와 비졸업자의 평균 임금 차이에는 그 차이도 섞입니다.</p>
        </div>
        <NumericPath title="(가정) 교육의 단순 비용 회수 계산" steps={[{"label": "학비·포기 소득", "value": "1천+2천만 원"}, {"label": "매년 추가 임금", "value": "÷200만 원"}, {"label": "단순 회수 기간", "value": "15년"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">학습과 선발이 다른 경로임을 보았습니다. 평가와 자격이 왜 있는지 살핍니다.</p>
      </section>
      <section id="need" data-teaching-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2 · 고용주는 짧은 면접으로 모든 능력을 알기 어렵습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">지원자마다 일을 맡겨 보기에는 시간과 비용이 듭니다. 시험과 자격은 어떤 과정을 통과했는지 보여 줘 채용 판단을 돕습니다. 다만 시험을 잘 보는 능력과 실제 직무 능력이 완전히 같지는 않습니다.</p>
          <p className="leading-8">학교에서 만난 사람과 채용 통로가 취업 기회를 늘릴 수도 있습니다. 수업 내용, 평가, 연결망이 어느 역할을 했는지 나눠야 더 싼 교육 경로와도 비교할 수 있습니다.</p>
        </div>
        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">수업과 자격의 역할을 따로 보았습니다. 두 효과의 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teaching-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3 · 능력 축적·신호·기회비용을 구분합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">학습으로 실제 생산과 판단 능력이 달라지는 효과를 교육의 인적자본 축적이라고 부릅니다. 자격이 능력 정보를 고용주에게 전해 선택을 바꾸는 효과는 신호 효과입니다.</p>
          <p className="leading-8">이 개념은 Spence의 1973년 논문 「Job Market Signaling」(The Quarterly Journal of Economics 87권 3호, 355~374쪽)에서 나왔고, 이 글은 그 논문의 서지만 확인했습니다. 자격이 정보를 전하려면 자격을 얻는 비용이 능력에 따라 달라야 한다는 조건은 <Link className="text-sky-700 underline dark:text-sky-300" to="/economics/market-failure/information-asymmetry#signaling">정보 비대칭 글의 신호 절</Link>에서 숫자 사례로 설명합니다.</p>
          <p className="leading-8">교육 때문에 포기한 다른 선택의 가치를 기회비용이라고 합니다. 사례에서는 1년 동안 벌지 못한 2천만 원이 해당합니다. 학비로 학교에 지급된 돈과는 다른 비용입니다.</p>
          <p className="leading-8">세 효과는 함께 존재할 수 있습니다. 학위가 신호로 쓰인다고 수업이 무용하다는 결론도, 임금이 올랐다고 모든 상승이 학습 효과라는 결론도 바로 나오지 않습니다.</p>
        </div>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">비용과 효과의 이름을 정했습니다. 같은 사람의 현금 경로를 계산합니다.</p>
      </section>
      <section id="mechanism" data-teaching-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4 · 3천만 원을 연 200만 원으로 나누면 15년입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">학비 1천만 원과 포기 소득 2천만 원을 합한 3천만 원을 연 추가 임금 200만 원으로 나누면 단순 회수 기간은 15년입니다. 학비만 나눈 5년보다 길어졌습니다. 세금과 할인, 임금 성장과 실업을 생략한 계산입니다.</p>
          <p className="leading-8">추가 임금 200만 원이 매년 계속되고 교육을 받지 않았을 대안도 그대로라는 전제가 필요합니다. 교육 과정 중 퇴학하거나 다른 산업으로 이동하면 실제 경로가 달라집니다.</p>
          <p className="leading-8">임금 상승이 능력 축적에서 왔는지 보려면 이전 능력과 배경, 같은 시기의 노동 수요를 맞춰 비교해야 합니다. 자격의 신호 효과를 살피려면 실제 능력과 수행은 비슷한데 자격 표시만 달라지는 상황이 도움이 됩니다. 단순 졸업자 평균만으로 두 효과를 분리할 수 없습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">회수 계산의 입력과 인과의 전제가 드러났습니다. 공식 통계의 비용 범위와 맞춥니다.</p>
      </section>
      <section id="source" data-teaching-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 · OECD의 교육 재정은 돈의 처음 출처를 구분합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">OECD의 2026 교육 재정 설명은 정부의 민간 이전 전후를 구분합니다. 학습자가 학비 1천만 원을 냈더라도 그 돈이 전부 가계에서 처음 나온 것인지는 별도 질문입니다.</p>
          <p className="leading-8">학비 중 정부 장학금이 400만 원이고 가계 자금이 600만 원이라고 추가로 놓습니다(가정). 학교 수입은 1천만 원으로 같고 초기 재원은 정부 400·가계 600으로 나뉩니다. 개인의 직접 부담 계산도 그만큼 바뀝니다.</p>
        </div>
        <SourceApplication source="OECD Education at a Glance 2026 · C1, Distribution by source of funds" excerpt="before government transfers to the private sector" application="학비1천만 원 중 정부 장학금400만 원·가계600만 원이면 학교의 수입과 초기 재원을 나눠 기록합니다. 포기한 소득2천만 원은 학교 수입이 아닙니다." />
        <CitationBlock source="OECD Education at a Glance 2026 · C1, Distribution by source of funds" citeKey={1} href="https://www.oecd.org/en/publications/education-at-a-glance-2026_b4968bbc-en/full-report/key-system-level-indicators-of-education-finance_d143f855.html">교육 지출의 초기 재원과 최종 지급 구분. 본문 2023 관측자료를 포함하는 2026 보고서.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">학교 수입과 가계 부담을 원문 분류에 맞췄습니다. 국가별 상환 조건을 비교합니다.</p>
      </section>
      <section id="comparison" data-teaching-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6 · 영국의 소득 연계 상환은 대출 잔액만으로 월 부담을 정하지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">영국 정부 안내는 해당 학자금 대출의 상환을 소득 기준과 연결합니다. 어떤 상환 계획인지, 소득이 기준을 넘는지에 따라 실제 현금 지급이 달라집니다. 다른 나라의 학비 대출이나 일반 대출에 같은 규칙을 적용할 수 없습니다.</p>
          <p className="leading-8">사례의 연 임금 증가 200만 원만 알아서는 상환액을 계산할 수 없습니다. 증가 전 총소득, 해당 계획의 기준과 비율을 더 알아야 합니다. 대출금이 학비를 먼저 내줬다고 교육 비용 자체가 사라진 것도 아닙니다.</p>
          <p className="leading-8">2026-10-04 확인한 OECD 재정 자료의 관측연도는 표마다 확인해야 합니다. 학위와 직업훈련, 공공 지원 비중이 다른 국가를 비교할 때 등록금만으로 개인 부담을 순위 매기지 않습니다.</p>
        </div>
        <SourceApplication source="UK Government · Repaying your student loan, How to repay" excerpt="You start repaying when your income is more than the minimum amount." application="추가 임금200만 원만으로 상환액을 정할 수 없습니다. 총소득과 적용 계획의 소득 기준을 알아야 1천만 원 학비 대출의 당기 부담을 계산할 수 있습니다." />
        <CitationBlock source="UK Government · Repaying your student loan, How to repay" citeKey={2} href="https://www.gov.uk/repaying-your-student-loan/how-you-repay">영국 해당 학자금 상환 계획의 소득 조건. 2026-10-04 확인.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 학비라도 지급 시기와 상환 규칙이 다릅니다. 평균 임금에서 빠지는 개인 차이를 봅니다.</p>
      </section>
      <section id="limits" data-teaching-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7 · 평균 임금 차이는 개인에게 약속된 수익이 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">가정 배경과 원래 능력, 거주 지역과 전공 선택이 임금에 함께 영향을 줍니다. 졸업자 평균이 높아도 특정 개인이 같은 차이를 얻는다는 보장은 없습니다. 기술과 산업 수요가 바뀌면 자격의 가치도 달라집니다.</p>
          <p className="leading-8">교육 수익을 비교할 때는 완료율, 취업까지의 기간, 직무 연결, 부채 지급과 대안 경로를 봅니다. 건강과 시민 참여, 직업 선택의 폭처럼 돈으로 바로 세기 어려운 편익도 따로 남깁니다.</p>
          <p className="leading-8">15년은 단순 계산의 결과입니다. 실제 선택에는 불확실한 미래 소득과 그동안의 생활비를 견딜 수 있는지까지 반영해야 합니다.</p>
        </div>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">회수 기간과 능력 변화, 자격과 소득의 경계를 확인했습니다. 같은 숫자를 다른 부담 조건에 넣어 봅니다.</p>
        <ReviewPrompts questions={["학비1천만 원과 포기소득2천만 원을 연 추가임금200만 원으로 회수하면 단순 계산은 몇 년일까요? (답: 4절)", "학비1천만 원 중 정부 장학금400만 원이면 학교 수입과 가계의 직접 부담은 각각 얼마일까요? (답: 5절)"]} />
      </section>
    </div>
  );
}
