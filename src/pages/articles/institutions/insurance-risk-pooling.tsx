import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** teach-system S→B→0…7. 공식 문서 확인 2026-10-04, 사례 수치는 가정. */
export default function InsuranceRiskPoolingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teaching-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">S · 혼자 감당하기 어려운 손실을 어떻게 나눌까요</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">집이나 차가 크게 손상되면 평소의 생활비로 복구하기 어렵습니다. 여러 사람이 작은 돈을 미리 모으고 사고가 생긴 일부에게 지급하면 각자가 따로 큰돈을 보관하는 부담을 줄일 수 있습니다.</p>
          <p className="leading-8">이 글은 돈을 모으는 단계부터 지급 여부를 판단하고 남은 손실을 부담하는 단계까지 따라갑니다. 가입자가 많다는 사실이 어떤 위험에는 도움이 되고 어떤 위험에는 충분하지 않은지도 봅니다.</p>
        </div>
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공동으로 준비하는 이유가 잡혔습니다. 돈이 움직이는 큰 경로를 봅니다.</p>
      </section>
      <section id="black-box" data-teaching-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">B · 가입자가 내고 운영자가 모아 사고를 당한 사람에게 줍니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">가입자는 미리 정한 금액을 냅니다. 운영자는 약속된 사건이 생겼는지 확인하고 정해진 돈을 지급합니다. 사고를 당한 사람은 받은 돈으로 복구하며, 계약 밖의 손실은 스스로 부담합니다.</p>
          <p className="leading-8">처음에 들어온 돈 전부를 바로 나눠 줄 수는 없습니다. 사고를 조사하는 비용과 늦게 확인될 지급 약속도 남아 있기 때문입니다.</p>
        </div>
        <NumericPath title="큰 흐름부터 읽기" steps={[{"label": "미리 내기", "value": "1"}, {"label": "모으고 확인하기", "value": "2"}, {"label": "사고 뒤 받기", "value": "3"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">모은 돈과 당장 줄 수 있는 돈을 구분했습니다. 한 해의 숫자를 놓습니다.</p>
      </section>
      <section id="case" data-teaching-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">0 · 1천 명의 10만 원이 20명의 300만 원을 지급합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">1천 명이 한 해 10만 원씩 내면 총 1억 원입니다(가정). 그해 20명에게 각 300만 원을 지급한다면 총 6천만 원이 나갑니다. 돈의 차이는 4천만 원입니다.</p>
          <p className="leading-8">이 4천만 원은 바로 순이익이 아닙니다. 운영비와 사고 조사비, 아직 보고되지 않은 지급 건을 처리해야 합니다. 실제 사고 인원도 매년 정확히 20명이라고 보장되지 않습니다.</p>
        </div>
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">1억·6천만·4천만 원을 구분했습니다. 지급 판단을 하는 곳을 엽니다.</p>
      </section>
      <section id="picture" data-teaching-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1 · 손실이 생겼다는 사실과 계약이 지급한다는 판단은 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">지급자는 어떤 사고인지, 유효한 계약 기간인지, 손실을 보여 주는 자료가 있는지 확인합니다. 같은 300만 원 손실이어도 계약에 포함되지 않은 사고라면 지급액이 달라질 수 있습니다.</p>
        </div>
        <NumericPath title="(가정) 첫 사례의 한 해 공동 장부" steps={[{"label": "1천 명이 낸 돈", "value": "1억 원"}, {"label": "20명에게 지급", "value": "−6천만 원"}, {"label": "비용·의무 차감 전", "value": "4천만 원"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">사고 금액만으로 지급액을 확정할 수 없습니다. 계약의 경계를 둔 이유를 봅니다.</p>
      </section>
      <section id="need" data-teaching-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2 · 모든 비용을 대신 내주면 가입과 행동도 바뀝니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">위험이 큰 사람만 모이면 처음 예상한 20명보다 사고가 많아질 수 있습니다. 가입할 때 위험 정보를 확인하는 이유입니다. 반대로 보장이 있다는 이유로 예방을 줄이면 실제 사고 비용이 늘 수도 있습니다.</p>
          <p className="leading-8">작은 손실의 일부를 가입자에게 남기는 장치는 청구 처리 비용과 예방 유인을 함께 고려한 선택입니다. 다만 남기는 부담이 너무 크면 필요한 보호를 받기 어렵습니다.</p>
        </div>
        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가입 조건과 본인 부담의 역할을 보았습니다. 업계에서 쓰는 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teaching-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3 · 위험 풀·면책·한도를 구분합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">여러 사람의 돈으로 약정 사고를 나누는 공동 장부가 보험 위험 풀입니다. 각자가 내는 돈은 보험료, 사고 뒤 받는 돈은 보험금입니다.</p>
          <p className="leading-8">계약이 지급하지 않는 사고나 조건을 면책이라고 부릅니다. 지급액의 최대값은 보상 한도이며, 가입자가 먼저 부담하는 금액은 자기부담금입니다. 셋은 같은 뜻이 아닙니다.</p>
          <p className="leading-8">2절의 두 현상에도 이름이 있습니다. 자기 위험을 보험사보다 잘 아는 사람이 더 많이 가입해 사고가 처음 예상한 20명보다 늘어나는 쪽을 역선택(adverse selection)이라고 하고, 가입한 뒤 보장을 믿고 예방을 줄여 사고 비용이 커지는 쪽을 도덕적 해이(moral hazard)라고 합니다.</p>
          <p className="leading-8">역선택은 Akerlof의 1970년 논문(The Quarterly Journal of Economics 84권 3호)과 Rothschild·Stiglitz의 1976년 보험시장 논문(같은 학술지 90권 4호)으로 이어지는 문제이며, 이 글에서는 두 논문의 서지만 확인했습니다. 두 현상이 어떤 숫자로 시장을 무너뜨리거나 자기부담금으로 줄어드는지는 <Link className="text-sky-700 underline dark:text-sky-300" to="/economics/market-failure/information-asymmetry#unravelling">정보 비대칭 글의 역선택 절</Link>과 <Link className="text-sky-700 underline dark:text-sky-300" to="/economics/market-failure/information-asymmetry#hidden-action">숨은 행동 절</Link>에서 사례로 설명합니다.</p>
          <p className="leading-8">다수의 가입자가 한 재난으로 함께 손해를 입는 상황은 동시 사고의 위험입니다. 사람 수가 늘어도 손실이 함께 움직이면 공동 장부가 동시에 부족해질 수 있습니다.</p>
        </div>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">지급 조건의 이름을 정했습니다. 같은 사고를 계약 계산에 넣습니다.</p>
      </section>
      <section id="mechanism" data-teaching-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4 · 300만 원 손실에서 지급 230만 원과 부담 70만 원이 갈립니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">첫 사례의 300만 원은 보험금으로 약정된 금액이었습니다. 이제 같은 크기의 실제 손실에 다른 계약을 적용해 봅니다(가정). 자기부담금 20만 원을 먼저 빼고 지급 한도 230만 원을 적용하면, 280만 원 중 230만 원만 지급됩니다. 가입자에게 남는 손실은 70만 원입니다.</p>
          <p className="leading-8">20명이 이 조건의 사고를 겪으면 지급액은 4,600만 원입니다. 최초의 6천만 원보다 1,400만 원 적지만 가입자에게 그만큼 손실이 더 남습니다. 낮은 보험료만으로 유리한 계약인지 판단하기 어려운 이유입니다.</p>
          <p className="leading-8">계약별로 자기부담금과 한도를 적용하는 순서가 다를 수 있으므로 이 순서는 설명용입니다. 실제로는 약관의 계산 순서와 보장 대상을 읽습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보험자의 지급 감소와 가입자의 잔여 손실이 함께 보입니다. 공식 계약 설명에 대입합니다.</p>
      </section>
      <section id="source" data-teaching-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 · NAIC의 계약 설명은 보장된 사건을 기준으로 지급합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">미국 보험감독자협의회 NAIC의 입문 자료는 보험이 계약에서 시작한다고 설명합니다. 같은 300만 원이라도 계약의 지급 조건을 먼저 읽는 것이 이 설명의 핵심입니다.</p>
          <p className="leading-8">사진과 수리 견적, 사고 보고를 준비하고 약정 대상인지 확인한 뒤 한도와 자기부담금을 적용합니다. 가입자가 걱정하는 모든 손실이 자동으로 포함되지는 않습니다.</p>
        </div>
        <SourceApplication source="NAIC · How Does Insurance Work?" excerpt="Insurance starts with a contract called a policy." application="300만 원 손실의 보장 여부를 확인한 뒤 자기부담금 20만 원과 지급 한도 230만 원을 적용합니다. 사례의 최종 지급은 230만 원, 남은 손실은 70만 원입니다." />
        <CitationBlock source="NAIC · How Does Insurance Work?" citeKey={1} href="https://content.naic.org/consumer/how-does-insurance-work">미국 보험 입문 안내. 약관의 보장 사건과 자기부담금 구조.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">원문의 계약 기준과 230만 원 계산을 연결했습니다. 나라별 보장 경계의 실제 예를 봅니다.</p>
      </section>
      <section id="comparison" data-teaching-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6 · 미국의 일반 주택보험과 홍수보험은 보장 범위가 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">미국 NFIP의 공식 안내는 일반적인 주택보험 대부분이 홍수 피해를 보장하지 않는다고 설명합니다. 사례의 300만 원 손실이 홍수 때문이라면 총손실부터 보기 전에 그 사고가 계약에 포함되는지 확인해야 합니다.</p>
          <p className="leading-8">이 미국 설명을 한국이나 다른 나라의 주택보험 약관에 그대로 적용할 수는 없습니다. 현지 감독기관 안내와 실제 증권의 보장 목록, 면책과 특별약정을 함께 읽습니다. 사회보험도 재원과 가입 의무, 급여 기준이 다른 별도 제도입니다.</p>
          <p className="leading-8">제도 설명은 2026-10-04 확인 기준입니다. 이 글의 보험료와 한도는 실제 상품 조건이 아닙니다.</p>
        </div>
        <SourceApplication source="US NFIP · Eligibility, frequently asked questions" excerpt="most homeowners insurance does not cover flood damage" application="300만 원 손실이라도 면책된 홍수라면 이 계약에서 지급하지 않을 수 있습니다. 230만 원 한도를 계산하기 전에 보장 사건인지 확인합니다." />
        <CitationBlock source="US NFIP · Eligibility, frequently asked questions" citeKey={2} href="https://www.floodsmart.gov/get-insured/eligibility">미국 일반 주택보험과 홍수보험의 구분. 2026-10-04 확인. 2026-10-09 재확인 때는 이 페이지가 자동 조회를 차단(403)해 원문을 다시 대조하지 못했고, 같은 문구가 FEMA/NFIP 공식 자료 제목에 있다는 것만 검색으로 확인했습니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보험의 이름보다 보장되는 사건을 확인했습니다. 많은 사고가 한꺼번에 생길 때를 봅니다.</p>
      </section>
      <section id="limits" data-teaching-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7 · 동시에 500명이 손해를 입으면 인원수만으로 버틸 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">최초 조건처럼 1인당 300만 원을 지급하는 사고가 500명에게 생기면 총 15억 원이 필요합니다(가정). 보험료 1억 원만으로는 부족합니다. 계약상 지급 약속을 지키려면 자본과 미리 쌓은 준비, 다른 보험자와 나누는 계약이 필요합니다.</p>
          <p className="leading-8">서로 독립적인 작은 사고를 많이 모을수록 실제 사고 비율이 예상 비율에 가까워지는 성질을 대수의 법칙이라고 합니다. 이 효과를 지역 전체 재난에 그대로 적용하면 안 됩니다. 가입 지역과 사고 원인의 집중, 지급 능력과 보장 중단 가능성을 함께 봅니다.</p>
          <p className="leading-8">남는 4천만 원을 이익으로 판단하려면 운영비와 미래 지급 의무를 확인해야 합니다. 보험은 약정된 재정 부담을 옮기는 장치이며 실제 안전과 모든 손실을 보장하지는 않습니다.</p>
        </div>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">계약의 경계와 동시 손실의 한계를 확인했습니다. 지급액과 남은 부담을 다시 나눠 봅니다.</p>
        <ReviewPrompts questions={["손실 300만 원에서 자기부담 20만 원을 뺀 뒤 지급 한도 230만 원을 적용하면 가입자의 부담은 얼마일까요? (답: 4절)", "최초 조건에서 500명이 동시에 사고를 당하면 보험료 1억 원으로 충분할까요? (답: 7절)"]} />
      </section>
    </div>
  );
}
