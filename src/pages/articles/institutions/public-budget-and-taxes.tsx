import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** teach-system S→B→0…7. 공식 문서 확인 2026-10-04, 사례 수치는 가정. */
export default function PublicBudgetAndTaxesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teaching-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">S · 국가가 올해 쓰는 돈과 미래의 약속을 함께 읽습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">정부 지출이 늘면 누가 혜택을 받고 누가 비용을 내는지 살펴야 합니다. 오늘 걷은 돈과 빌린 돈은 당장 같은 지급에 쓸 수 있지만 앞으로 남기는 의무가 다릅니다.</p>
          <p className="leading-8">이 글은 한 해의 현금 흐름을 맞춘 뒤 서비스 비용, 새 자산, 빚의 변화를 나눕니다. 이 구분을 해야 나라의 적자 숫자를 비교하거나 어떤 사업에 돈을 더 쓸지 판단할 수 있습니다.</p>
        </div>
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">현재 지급과 미래 의무를 나눌 질문이 잡혔습니다. 돈과 결정의 큰 경로를 봅니다.</p>
      </section>
      <section id="black-box" data-teaching-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">B · 걷고 빌린 뒤 승인받은 곳에 지급합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">가계와 기업이 돈을 내고 자금을 빌려 주는 사람이 추가 돈을 제공합니다. 정부는 승인된 목적에 따라 병원과 학교, 공사 수행자와 채권자에게 지급합니다. 받는 사람은 그 돈으로 인력과 자재를 구매합니다.</p>
          <p className="leading-8">계획이 승인된 시점과 통장에서 돈이 나간 시점, 서비스가 실제 제공된 시점은 다를 수 있습니다. 세 시점을 섞으면 미집행 사업을 이미 이뤄 낸 결과로 읽게 됩니다.</p>
        </div>
        <NumericPath title="큰 흐름부터 읽기" steps={[{"label": "걷고 빌리기", "value": "1"}, {"label": "승인·배분하기", "value": "2"}, {"label": "서비스 제공하기", "value": "3"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">승인·지급·결과를 나눴습니다. 한 해의 숫자를 맞춥니다.</p>
      </section>
      <section id="case" data-teaching-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">0 · 세금 80과 새 차입 20으로 지출 100을 맞춥니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">세금 80, 새로 빌린 돈 20이 들어온다고 놓습니다(가정). 의료 40, 교육 30, 도로 건설 20, 이자 10을 지급하면 총지출은 100입니다. 기존 빚의 원금 상환과 다른 수입은 없다고 단순화합니다.</p>
          <p className="leading-8">기초 부채가 200이었다면 새 차입으로 기말 부채는 220입니다(가정). 세금 80은 갚아야 할 빚이 아니지만 차입 20에는 계약상 상환 의무가 붙습니다.</p>
        </div>
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">올해 현금 100과 남는 부채 220을 구분했습니다. 지출 분류의 안을 엽니다.</p>
      </section>
      <section id="picture" data-teaching-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1 · 지금 소비한 서비스와 앞으로 쓸 자산을 나눕니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">의료 40·교육 30·이자 10은 이 사례에서 당기 비용으로 놓고 도로 20은 새 자산 취득으로 놓습니다(가정). 도로에 현금이 나가도 그 금액을 당기 비용과 같은 항목에 모두 넣지는 않는 회계 기준이 있습니다.</p>
        </div>
        <NumericPath title="(가정) 한 해의 현금 조달과 사용" steps={[{"label": "세금과 차입", "value": "80+20"}, {"label": "의료·교육·도로·이자", "value": "40+30+20+10"}, {"label": "조달과 지급", "value": "100=100"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">현금 지급과 비용이라는 두 측정이 갈라졌습니다. 왜 두 장부가 필요한지 봅니다.</p>
      </section>
      <section id="need" data-teaching-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2 · 현금 부족과 자산의 증가는 다른 사실입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">현금 장부는 약속한 날 대금을 지급할 수 있는지 알려 줍니다. 자산과 부채 장부는 돈을 써서 무엇이 남았는지 보여 줍니다. 도로가 남아도 공사 대금을 낼 현금이 없으면 지급 문제가 생깁니다.</p>
          <p className="leading-8">반대로 채권을 팔아 현금이 늘었다고 국가가 그만큼 부유해진 것은 아닙니다. 현금과 같은 크기의 상환 약속도 생겼기 때문입니다.</p>
        </div>
        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">현금과 순자산의 질문을 구별했습니다. 통계에서 쓰는 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teaching-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3 · 세입·비용·자산 취득·금융 조달을 구분합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">세금처럼 정부의 순자산을 늘리는 수입을 재정통계의 수입으로 분류합니다. 차입은 갚을 의무가 함께 늘어나는 금융 조달이며 수입과 구별합니다.</p>
          <p className="leading-8">수입에서 비용을 뺀 값은 순운영수지입니다. 여기서 비금융자산의 순취득을 더 빼면 순융자·순차입이 됩니다. 현금과 발생 시점이 다른 경우에는 현금수지와도 달라질 수 있습니다.</p>
          <p className="leading-8">국채는 정부가 약정한 원금과 이자를 지급하는 채무입니다. 올해 적자는 기간 중 흐름이고 부채는 특정 날짜에 남은 잔액이므로 같은 숫자로 취급하지 않습니다.</p>
        </div>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공식 장부의 이름을 정했습니다. 80·100·20을 각 분류에 넣습니다.</p>
      </section>
      <section id="mechanism" data-teaching-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4 · 같은 해에 순운영수지 0과 순차입 20이 함께 나옵니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">모든 발생과 지급이 그해에 일치하고 도로 감가상각과 자산 매각을 생략한다고 추가로 가정합니다. 수입은 세금 80, 비용은 의료 40+교육 30+이자 10=80이므로 순운영수지는 0입니다.</p>
          <p className="leading-8">도로의 비금융자산 순취득 20을 빼면 순융자·순차입은 −20입니다. 이를 새 채무 20으로 조달해 현금은 맞고 부채는 200에서 220으로 늘어납니다. 올해 현금 지출 100을 전부 비용이라고 써 순운영수지 −20이라 하면 다른 지표가 됩니다.</p>
          <p className="leading-8">예산 승인 뒤 도로 공사가 지연되면 지급과 자산 취득의 시점이 달라집니다. 실제 통계에서는 미지급액과 감가상각, 평가 변화까지 조정해야 이 가정의 계산과 비교할 수 있습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">현금수지와 순운영수지를 실제로 구분했습니다. IMF의 원문 정의에 대입합니다.</p>
      </section>
      <section id="source" data-teaching-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 · IMF의 순운영수지 문장을 그대로 계산합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">IMF의 정부재정통계 설명은 수입에서 비용을 뺀 값을 순운영수지로 정의합니다. 우리 사례에서 차입 20은 수입에 넣지 않고 도로 20은 당기 비용과 구분하므로 80−80=0입니다.</p>
          <p className="leading-8">이 계산은 도로가 성공적인 투자라는 평가가 아닙니다. 무엇을 어느 시점에 기록하는지 정한 것입니다. 사업의 성과는 통행 시간이나 유지 비용 같은 별도 결과로 확인합니다.</p>
        </div>
        <SourceApplication source="IMF · About GFS, Analytical Framework" excerpt="The difference between revenue and expense is the net operating balance" application="차입20을 수입에서 제외하고 도로20을 자산 취득으로 분리하면 수입80−비용80=0입니다. 이후 비금융자산 순취득20을 빼 순차입20을 계산합니다." />
        <CitationBlock source="IMF · About GFS, Analytical Framework" citeKey={1} href="https://www.imf.org/external/pubs/ft/gfs/manual/aboutgfs.htm">현금·발생주의 구분과 수입/비용/자산 취득의 연결. 사례는 감가상각 등을 생략.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">통계 정의와 정책 평가를 분리했습니다. 같은 국가 비교에서도 범위를 맞춥니다.</p>
      </section>
      <section id="comparison" data-teaching-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6 · 중앙정부만 볼지 지방과 사회보험까지 볼지 정합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">IMF의 비교 자료에는 정부 수입·지출뿐 아니라 자산·부채와 금융 조달도 들어갑니다. 사례의 부채 220을 다른 나라와 비교하려면 중앙정부인지 지방정부와 사회보험을 포함한 일반정부인지 맞춰야 합니다.</p>
          <p className="leading-8">세금을 법적으로 내는 사람과 경제적으로 부담하는 사람도 다를 수 있습니다. 판매자에게 세금 1을 부과한 뒤 가격을 0.6 올리고 다른 조건이 같다면 구매자가 0.6, 판매자가 0.4를 부담하는 가정이 됩니다. 실제 전가 비율은 수요와 공급 반응으로 확인합니다. 이것이 조세 부담과 공공 편익을 따로 보는 이유입니다.</p>
          <p className="leading-8">미국의 CBO는 의회의 예산 판단을 지원하는 분석 기관입니다. 다른 나라에서는 예산 승인 기관과 지방정부 권한이 다릅니다. 2026-10-04 확인한 국제 분류를 현지 예산 권한의 법으로 적용하지 않습니다.</p>
        </div>
        <SourceApplication source="IMF · Quarterly Government Finance Statistics" excerpt="balance sheet data on government assets and liabilities" application="기초부채200에서 신규차입20을 더해220을 얻습니다. 다른 나라와 비교할 때 정부 범위와 자산·부채의 측정일을 일치시킵니다." />
        <CitationBlock source="IMF · Quarterly Government Finance Statistics" citeKey={2} href="https://data.imf.org/en/Datasets/QGFS">정부 재정 흐름과 자산·부채 데이터 범위.</CitationBlock>
        <CitationBlock source="US CBO · Introduction to CBO" citeKey={3} href="https://www.cbo.gov/about/overview">미국 의회 예산 과정의 분석 지원 기관. 2026-10-04 확인.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">정부 범위와 부담자를 구분했습니다. 같은 부채 220이 다른 위험을 갖는 이유를 봅니다.</p>
      </section>
      <section id="limits" data-teaching-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7 · 부채의 통화와 만기가 재정 여력을 바꿉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">부채 220 중 외화 몫이 있다면 자국 통화가 약해질 때 같은 외화 원금의 자국 통화 부담이 늘 수 있습니다. 자국 통화 부채도 물가, 금리와 차환 조건의 제약을 받습니다.</p>
          <p className="leading-8">짧은 만기의 돈을 계속 빌려야 한다면 금리 상승과 차환 실패에 더 민감할 수 있습니다. 금리, 성장과 세입 기반을 함께 살펴야 같은 적자 20의 부담을 비교할 수 있습니다.</p>
          <p className="leading-8">도로 20이 미래 생산성을 높일지, 의료 40이 필요한 서비스를 늘렸는지는 지출액만으로 알 수 없습니다. 재정 여력은 지급 능력의 문제이고 사업의 정당성과 효과는 별도로 검증합니다.</p>
        </div>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">통계 분류·상환 조건·사업 결과를 분리했습니다. 같은 예산을 다른 장부로 읽어 봅니다.</p>
        <ReviewPrompts questions={["도로20을 새 자산으로 구분하면 사례의 순운영수지와 순차입은 각각 얼마일까요? (답: 4절)", "기말부채220이 같은 두 나라의 위험을 비교하려면 통화와 만기를 왜 봐야 할까요? (답: 7절)"]} />
      </section>
    </div>
  );
}
