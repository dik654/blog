import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** teach-system S→B→0…7. 공식 문서 확인 2026-10-04, 사례 수치는 가정. */
export default function WaterUtilityAndTariffsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teaching-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">S · 오늘 나오는 물을 내년에도 받으려면 무엇을 내야 할까요</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">수돗물이 오늘 나온다고 배관을 앞으로도 계속 쓸 수 있는 것은 아닙니다. 물을 깨끗하게 만드는 일과 땅속 관을 교체하는 일은 지출 시점이 다릅니다.</p>
          <p className="leading-8">요금을 정할 때는 안전하게 공급할 총비용과 가구가 감당할 몫을 함께 봅니다. 누군가 덜 내도록 지원한다면 그 차이를 누가 메우는지도 정해야 합니다.</p>
        </div>
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">지속해서 공급할 돈과 가구의 부담을 나눌 질문이 생겼습니다. 큰 흐름을 먼저 봅니다.</p>
      </section>
      <section id="black-box" data-teaching-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">B · 공급에서 사용과 지원까지 연결됩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">공급자는 물을 모아 처리하고 집까지 보냅니다. 집은 사용한 물에 대한 요금을 냅니다. 정부가 일부 가구의 요금을 대신 내면 공급자에게 오는 돈의 출처가 달라집니다.</p>
          <p className="leading-8">하수 처리는 사용 뒤의 별도 기능입니다. 같은 청구서라도 물 공급과 사용한 물의 처리를 구별합니다. 그래야 비용을 빠뜨리거나 두 번 세지 않습니다.</p>
        </div>
        <NumericPath title="큰 흐름부터 읽기" steps={[{"label": "공급하기", "value": "1"}, {"label": "사용·지급하기", "value": "2"}, {"label": "차액 채우기", "value": "3"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">서비스와 지급자가 분리됐습니다. 공급 비용과 지원금을 하나의 장부로 맞춥니다.</p>
      </section>
      <section id="case" data-teaching-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">0 · 공급 비용 90을 가구 80과 지원 10으로 나눕니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">한 해 정수·운영에 60, 배관 교체에 30이 필요하다고 놓습니다(가정). 서비스에 필요한 자원은 합계 90입니다. 정부가 취약 가구를 대신해 요금 10을 낸다고 합시다. 가구는 80, 정부는 10을 내서 공급자가 90을 받습니다.</p>
          <p className="leading-8">지원금 10이 같은 요금을 대신 내는 돈이라면 서비스 비용에 다시 더해 100이라고 쓰면 안 됩니다. 별도 연결 공사나 지원 행정에 실제로 10이 들었다면 그때 추가 자원 비용으로 계산합니다.</p>
        </div>
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">90의 서비스 비용과 10의 부담 이전을 구별했습니다. 돈이 합쳐지는 지점을 엽니다.</p>
      </section>
      <section id="picture" data-teaching-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1 · 지원금은 부족한 수입을 메우는 경로입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">가구가 80만 내는 조건에서 정부 지급 10이 실제로 들어와야 필요한 90이 맞춰집니다. 예산이 승인됐더라도 지급이 늦으면 공급자의 현금이 부족합니다. 지출할 돈이 마련됐는지와 지원을 약속했는지를 구분합니다.</p>
        </div>
        <NumericPath title="(가정) 같은 공급 비용의 지급자를 나누기" steps={[{"label": "가구 지급", "value": "80"}, {"label": "정부가 대신 지급", "value": "+10"}, {"label": "공급자 수입·필요액", "value": "90"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">80+10=90이 실제 수입으로 맞아야 합니다. 배관 교체를 미루는 선택의 대가를 봅니다.</p>
      </section>
      <section id="need" data-teaching-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2 · 사용량이 줄어도 묻힌 관의 비용은 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">집들이 물을 아끼면 처리에 쓰는 전력과 약품 일부는 줄어듭니다. 이미 설치한 관은 계속 교체하고 수리해야 합니다. 필요한 인력도 같은 비율로 줄지 않습니다. 사용한 양만큼만 받는 구조에서는 절수가 수입을 먼저 줄일 수도 있습니다.</p>
          <p className="leading-8">요금을 낮추려고 교체 30을 미루면 올해 수입과 지출은 맞을 수 있습니다. 그러나 설비 상태가 나빠지면 누수와 단수의 비용이 뒤로 넘어갑니다. 현재 이용자와 미래 이용자의 부담까지 함께 보는 이유입니다.</p>
        </div>
        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">작게 사용해도 남는 비용을 확인했습니다. 요금 설계의 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teaching-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3 · 서비스 비용과 부담자, 접근성을 구분합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">취수와 정수, 배관의 유지와 교체까지 넣어 서비스의 전체 비용을 셉니다. 이 글의 90은 한 해 필요한 현금 지출을 단순화한 값이며 감가상각을 계산한 회계 비용과 같지 않습니다.</p>
          <p className="leading-8">돈을 최종적으로 누가 내는지 보는 질문이 부담 귀속입니다. 같은 90도 가구가 전부 내거나 세금이 일부를 대신할 수 있습니다.</p>
          <p className="leading-8">안전한 물을 필요한 때 받고 그 비용을 감당할 수 있는지가 서비스 접근성입니다. 배관이 없는 집은 연결된 집의 요금 할인만으로 혜택을 받지 못합니다.</p>
        </div>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">비용·부담자·이용 가능 여부를 분리했습니다. 같은 90을 두 가지 수입 구조에 넣습니다.</p>
      </section>
      <section id="mechanism" data-teaching-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4 · 요금 60만 받고 지원 10을 받아도 20이 모자랍니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">가구 수입 80과 정부 지급 10이면 서비스 90을 충당합니다. 가구 수입을 60으로 낮추고 지원은 10에 두면 총수입은 70, 부족액은 20입니다(가정). 지원을 더 받거나 다른 수입을 마련하지 않으면 교체나 운영을 줄여야 합니다.</p>
          <p className="leading-8">사용량과 무관하게 받는 기본 금액을 늘리면 수입은 안정되지만 적게 쓰는 집의 부담이 커질 수 있습니다. 사용량별 가격을 높이면 절수를 유도할 수 있지만 가구원 수가 많은 저소득 가구가 불리할 수 있습니다.</p>
          <p className="leading-8">어떤 요금표든 수도 서비스의 전체 비용을 사라지게 하지는 않습니다. 요금·세금·차입 중 누가 언제 부담할지를 바꾸므로 차입을 쓰면 뒤의 상환 재원도 적습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">부족액 20의 조달 선택이 드러났습니다. 비용 회수의 공식 정의와 대조합니다.</p>
      </section>
      <section id="source" data-teaching-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 · 세계은행의 재원 공백에 70과 90을 넣습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">세계은행의 수도 요금 연구는 요금만으로 전체 비용을 충당하지 못하는 간격을 구별합니다. 이 사례에서 요금 60과 서비스 90 사이 간격은 30입니다. 정부 지급 10을 넣고도 최종 20이 남습니다.</p>
          <p className="leading-8">요금으로 회수할 몫과 다른 재원에서 받을 몫을 정하는 것은 정책 선택입니다. 다만 두 재원을 합쳐도 90에 못 미치는데 안정 공급을 약속하면 설비 교체나 다른 사업의 돈을 가져오게 됩니다.</p>
        </div>
        <SourceApplication source="World Bank · Troubled Tariffs, How Should Costs Be (re)Covered?" excerpt="the difference between revenues collected through tariffs and full economic cost recovery constitutes an economic shortfall" application="서비스 90에서 요금 60을 빼면 30의 간격입니다. 정부가 10을 지급한 뒤에도 20이 남습니다. 지원을 서비스 비용에 다시 더하지 않습니다." />
        <CitationBlock source="World Bank · Troubled Tariffs, How Should Costs Be (re)Covered?" citeKey={1} href="https://documents1.worldbank.org/curated/en/568291635871410812/pdf/Troubled-Tariffs-Revisiting-Water-Pricing-for-Affordable-and-Sustainable-Water-Services.pdf">요금·지원·전체 비용을 구분하는 세계은행 연구. 사례는 현금 지출을 단순화했습니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">요금의 공백 30과 모든 지원 뒤의 공백 20을 구분했습니다. 실제 나라의 청구 항목을 확인합니다.</p>
      </section>
      <section id="comparison" data-teaching-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6 · 싱가포르의 물값에는 다른 목적의 세 항목이 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">싱가포르 PUB는 물 생산·공급 요금, 물 절약과 희소성을 반영하는 세금, 사용한 물 처리의 세금을 구분합니다. 하나의 단가 안에 어떤 비용과 정책 목적이 들어 있는지 먼저 읽어야 합니다.</p>
          <p className="leading-8">우리 사례의 공급 비용 90을 싱가포르 요금으로 환산할 수는 없습니다. 하수 처리까지 포함한 청구액과 급수만 계산한 비용을 비교하면 범위가 어긋납니다. 다른 나라에서도 지방 수도사업자의 요금표와 정부 지원의 지급 대상을 확인합니다.</p>
          <p className="leading-8">제도 설명은 2026-10-04 확인 기준입니다. 건조한 지역의 취수 비용이나 인구가 흩어진 곳의 긴 배관 비용은 달라지므로 동일한 요금 수준이 동일한 효율을 뜻하지 않습니다.</p>
        </div>
        <SourceApplication source="PUB Singapore · Water Price, Components of the Water Price" excerpt="There are three components to the water price in the monthly bill." application="서비스 비용 90과 청구액을 비교하기 전에 공급, 절약 유도, 하수 처리의 범위를 맞춥니다. 같은 10의 세금과 가구 지원은 역할이 다릅니다." />
        <CitationBlock source="PUB Singapore · Water Price, Components of the Water Price" citeKey={2} href="https://www.pub.gov.sg/Public/WaterLoop/Water-Price">싱가포르 급수·절약세·하수처리세의 목적. 2026-10-04 확인.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">실제 청구서의 목적과 계산 범위를 맞췄습니다. 지원받지 못하는 사람까지 살핍니다.</p>
      </section>
      <section id="limits" data-teaching-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7 · 낮은 요금이 누구에게 도착하는지 확인합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">이미 연결된 집의 요금을 낮추면 물을 많이 쓰는 집이 더 큰 금액을 지원받을 수 있습니다. 연결되지 않은 집은 여전히 다른 판매자에게 더 비싸게 물을 살 수 있습니다. 연결비 지원과 매달 요금 지원은 서로 다른 문제를 풉니다.</p>
          <p className="leading-8">부담 가능성과 안정 공급을 함께 보려면 가구 소득 대비 청구액, 수질, 공급 시간, 누수와 미연결 가구를 봅니다. 낮은 요금만으로 공정성을 판정할 수 없습니다.</p>
          <p className="leading-8">90의 가정 장부는 부담 이전을 보여 줄 뿐 실제 공사 수명이나 물 수요를 추정하지 않습니다. 실제 조정에서는 사업자의 설비 상태와 현지 지원 규칙을 대조합니다.</p>
        </div>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">요금의 크기에서 서비스의 지속성과 수혜자까지 연결했습니다. 두 장부를 다시 계산해 봅니다.</p>
        <ReviewPrompts questions={["서비스 비용 90에 가구 지급 60과 정부 지원 10이 있으면 남은 공백은 얼마일까요? (답: 4절)", "정부가 같은 요금 10을 대신 냈는데 총서비스 비용을 100으로 쓰면 무엇을 두 번 세었을까요? (답: 0절)"]} />
      </section>
    </div>
  );
}
