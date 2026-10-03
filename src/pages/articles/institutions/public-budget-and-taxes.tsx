import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 세금은 국가가 서비스를 사는 돈이고 예산은 우선순위의 기록이다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function PublicBudgetAndTaxesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">올해 100을 쓰면 올해 세금 80만 보면 부족합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">정부가 세금 80과 새로 빌린 돈 20으로 의료 40, 교육 30, 도로 20, 이자 10을 냈다고 합시다. 빌린 20은 공짜 수입이 아닙니다. 다음 기간의 세금, 차환, 물가와 성장 경로에 따라 부담이 정해집니다.</p>
          <p className="leading-7">예산을 볼 때 숫자의 크기보다 어떤 서비스를 누가 받고 누가 돈을 내는지 묻습니다. 중앙정부 숫자만 보면 지방정부와 공기업의 약속이 빠질 수 있습니다.</p>
        </div>
        <FlowRail
          title="(가정) 세금 80, 신규 차입 20, 의료 40·교육 30·도로 20·이자 10"
          steps={[
            { actor: "납세자·채권자", movement: "세금 80과 신규 차입 20을 공급합니다.", receives: "공공 서비스와 채권 청구권" },
            { actor: "정부·지자체", movement: "의료 40·교육 30·도로 20·이자 10에 배분합니다.", receives: "정책 집행 권한과 상환 의무" },
            { actor: "가구·기업", movement: "서비스와 이전지출을 받습니다.", receives: "편익과 장래 세부담" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">올해 세금 80과 차입 20으로 지출 100을 맞췄습니다. 올해 서비스와 미래 상환 약속을 분리합니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">세입·지출·부채 잔액과 의회 결정권을 분리합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">세금은 가계와 기업의 현재 구매력을 정부로 옮깁니다. 정부는 계약과 인건비로 의료·교육·도로를 구매합니다. 국채는 미래 현금흐름에 대한 채권자의 청구권이고 정부의 부채입니다.</p>
          <p className="leading-7">예산안이 통과돼도 실제 집행과 서비스 결과는 다릅니다. 발주 지연, 인력 부족, 지방 매칭 예산이 계획의 속도를 바꿀 수 있습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">예산 승인과 실제 집행이 다른 단계임을 알았습니다. 국가별 재정통계의 정부 범위를 맞춰 봅니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">나라의 재정 여력은 통화·세금·제도에 따라 달라집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">IMF 정부재정통계는 정부의 수입·지출·자산·부채를 비교하는 공식 분류를 제공합니다. 자국 통화 채무와 외화 채무는 환율 위험이 다르고, 연방제는 지방정부 몫이 큽니다.</p>
          <p className="leading-7">한국·미국·유럽 국가·개도국을 비교할 때 정부 범위, 회계연도, 사회보험 포함 여부, 이자 비용과 숨은 보증을 같은 정의로 맞춥니다.</p>
        </div>
        <SourceApplication source="IMF · About Government Finance Statistics, analytical framework" excerpt="The difference between revenue and expense is the net operating balance" application="올해 세금 80과 지출 100을 단순 비교하면 차이는 -20입니다. 다만 정부 재정통계의 발생주의 수입·비용과 이 글의 현금 세금·차입 예시는 같은 지표가 아니므로 실제 재정수지로 옮길 때 분류를 다시 맞춰야 합니다." />
        <CitationBlock source="IMF About Government Finance Statistics" citeKey={1} href="https://www.imf.org/external/pubs/ft/gfs/manual/aboutgfs.htm">수입·비용·비금융자산 투자와 순융자·차입의 관계를 표시한 IMF 원문입니다.</CitationBlock>
        <CitationBlock source="IMF Government Finance Statistics Manual 2014" citeKey={2} href="https://www.imf.org/external/np/sta/gfsm/pdf/text14.pdf">정부 수입·지출·재정수지·자산·부채의 통계 분류 기준입니다.</CitationBlock>
        <CitationBlock source="IMF Quarterly Government Finance Statistics" citeKey={3} href="https://data.imf.org/en/Datasets/QGFS">나라별 정부재정 통계의 시점과 범위를 확인할 수 있습니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">IMF의 발생주의 지표는 이 글의 현금 예시와 같은 수치가 아닙니다. 적자만으로 사업의 성과를 재단하지 않습니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">적자 숫자 하나로 낭비 또는 투자를 판정할 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">도로 20이 생산성을 높일 수도 있지만 잘못된 위치에 놓이면 유지비만 남습니다. 의료 40도 접근성과 결과를 확인해야 합니다.</p>
          <p className="leading-7">부채 지속 가능성을 보려면 금리·성장·만기·통화·세입 기반과 정책 신뢰를 함께 살핍니다. 이 글의 100은 실제 국가 예산이 아닌 설명용 가정입니다.</p>
        </div>
        <ReviewPrompts questions={[
          "세금 80과 차입 20으로 100을 쓰는 정부의 올해 현금과 미래 상환 약속은 어떻게 다를까요? (답: 2절)",
          "같은 적자 20이어도 외화 채무 비중이 높다면 무엇을 더 확인해야 할까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
