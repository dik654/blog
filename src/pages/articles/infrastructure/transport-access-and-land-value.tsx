import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** teach-system S→B→0…7. 공식 문서 확인 2026-10-04, 사례 수치는 가정. */
export default function TransportAccessAndLandValueArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teaching-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">S · 빠르게 가는 길이 누구의 기회를 바꿀까요</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">새 역이나 도로의 가치는 이동 속도만으로 끝나지 않습니다. 출퇴근이 쉬워지면 지원할 일자리와 이용할 병원이 달라지고, 그 위치에 살려는 사람도 늘어납니다.</p>
          <p className="leading-8">이 글은 한 사람의 통근시간을 줄인 뒤 그 이익이 승객, 집주인, 정부 사이에 어떻게 나뉘는지 추적합니다. 시설을 짓는 비용과 이용하면서 얻는 시간을 같은 장부에 두기 전에 각각 무엇을 세는지 확인합니다.</p>
        </div>
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">교통을 이동과 기회의 연결로 볼 준비가 됐습니다. 큰 흐름을 펼칩니다.</p>
      </section>
      <section id="black-box" data-teaching-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">B · 건설하는 곳·운영하는 곳·이용하는 사람이 연결됩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">정부나 사업자가 길과 정류장을 만들면 운영자가 차량과 인력을 투입합니다. 승객은 요금을 내고 목적지에 갑니다. 공사비를 누가 먼저 냈는지와 운행비를 누가 계속 내는지는 다를 수 있습니다.</p>
          <p className="leading-8">길 주변의 집과 가게는 움직이지 않아도 위치의 이익이 바뀝니다. 그 이익을 얻는 사람이 공사비를 직접 낸 사람과 같을 필요는 없습니다.</p>
        </div>
        <NumericPath title="큰 흐름부터 읽기" steps={[{"label": "짓기", "value": "1"}, {"label": "운행하기", "value": "2"}, {"label": "기회에 닿기", "value": "3"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">이용자 밖으로 옮겨 가는 이익도 보았습니다. 한 달의 시간 변화를 계산합니다.</p>
      </section>
      <section id="case" data-teaching-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">0 · 편도 25분 절약은 왕복 한 달에 1,000분입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">통근이 편도 60분에서 35분으로 줄고 한 달에 20일 출근한다고 놓습니다(가정). 편도 절약은 25분, 한 달 편도 합계는 500분입니다. 같은 조건으로 귀가한다면 왕복 합계는 1,000분, 약 16시간 40분입니다.</p>
          <p className="leading-8">왕복으로 한 달 추가 교통비가 2만 원이고 주변 월세가 10만 원 올랐다고도 놓습니다(가정). 이때 시간은 줄지만 가구의 현금 지출은 월 12만 원 늘어납니다.</p>
        </div>
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">시간 1,000분과 현금 12만 원을 따로 적었습니다. 이동시간이 줄어드는 부분을 엽니다.</p>
      </section>
      <section id="picture" data-teaching-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1 · 차량 안의 시간과 문 앞까지의 시간을 합칩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">35분은 집 문을 나서 회사에 도착하기까지의 시간으로 가정했습니다. 차량 탑승만 35분이고 걸어서 10분, 환승 대기 10분이 더 든다면 실제는 55분이 됩니다. 노선 속도와 생활에서 절약하는 시간을 구별해야 합니다.</p>
        </div>
        <NumericPath title="(가정) 문 앞에서 문 앞까지 왕복 통근시간" steps={[{"label": "편도 감소", "value": "60−35=25분"}, {"label": "하루 왕복", "value": "50분"}, {"label": "20일의 절약", "value": "1,000분"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">실제 출발지와 도착지를 고정했습니다. 왜 운영과 보행 연결이 필요한지 봅니다.</p>
      </section>
      <section id="need" data-teaching-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2 · 선로가 있어도 자주 오지 않으면 선택지가 줄어듭니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">열차가 빨라도 배차가 드물면 늦을 때의 대기가 길어집니다. 정류장까지 안전하게 걷기 어렵거나 마지막 운행이 이르면 일부 사람은 그 노선을 쓸 수 없습니다. 시설 건설 뒤에도 운영비가 필요한 이유입니다.</p>
          <p className="leading-8">혼잡한 길에 차 한 대가 더 들어가면 다른 사람의 이동도 늦어질 수 있습니다. 한 이용자의 요금과 시간만 세면 다른 이용자에게 준 비용을 놓칩니다.</p>
        </div>
        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">길의 존재와 쓸 수 있는 기회를 구분했습니다. 이 차이에 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teaching-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3 · 접근성·지대 이동·중복 계산을 구분합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">주어진 시간과 비용 안에서 갈 수 있는 일자리와 서비스의 범위를 교통 접근성이라고 부릅니다. 속도가 같아도 주변 일자리와 환승망이 다르면 접근성은 다릅니다.</p>
          <p className="leading-8">좋아진 위치의 이익이 임대료에 반영되는 경로가 교통 이익의 지대 이동입니다. 여기서 지대는 토지의 위치와 이용권에서 얻는 수입을 뜻합니다.</p>
          <p className="leading-8">같은 시간 절약이 집값에도 반영됐는데 두 금액을 독립 편익처럼 더하면 중복 계산이 됩니다. 실제 사업 평가는 각 항목이 이미 다른 항목에 들어 있는지 확인합니다.</p>
        </div>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">시간·위치·평가의 이름을 정했습니다. 같은 통근 사례의 가구 장부를 잇습니다.</p>
      </section>
      <section id="mechanism" data-teaching-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4 · 시간 절약과 임대료 상승을 동시에 적습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">한 달 왕복 1,000분을 아끼고 추가 요금 2만 원, 월세 10만 원을 낸다는 사례를 다시 봅니다. 시간을 쉴 때 쓸지 일을 더 할지는 개인의 선택입니다. 16시간 40분에 시급을 곱한 값이 통장에 자동으로 들어오지는 않습니다.</p>
          <p className="leading-8">집주인은 월세 인상의 수입을 얻고 교통 운영자는 요금을 받습니다. 정부는 공사비와 운영 지원을 부담할 수 있습니다. 통근자 이익을 계산한 뒤 임대료 상승액을 사회 전체의 새 이익으로 그대로 더하면 같은 접근성 가치를 두 번 셀 수 있습니다.</p>
          <p className="leading-8">접근성 향상도 모든 주민에게 같지 않습니다. 기존 임차인이 월세를 감당하지 못해 더 먼 곳으로 이동하면 원래 기대한 시간 절약을 누리지 못할 수 있습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">누가 시간을 얻고 누가 돈을 받는지 이어졌습니다. 공식 자료가 측정하는 대상을 확인합니다.</p>
      </section>
      <section id="source" data-teaching-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 · 세계은행의 접근성 질문을 출퇴근 경로에 적용합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">세계은행의 도시 교통 교육은 도시마다 필요한 접근성을 먼저 조사하게 합니다. 이 사례에서는 단순히 차량이 25분 빨라졌는지가 아니라 집에서 회사까지 60분이 35분이 됐는지를 확인합니다.</p>
          <p className="leading-8">학교와 병원에 갈 때도 같은 노선이 도움이 되는지, 장애인과 야간 노동자도 이용할 수 있는지 추가로 묻습니다. 하나의 평균 시간에 모든 사람의 이동을 넣지 않습니다.</p>
        </div>
        <SourceApplication source="World Bank · Leaders in Urban Transport Planning" excerpt="assess the accessibility needs and challenges facing their own cities" application="우리 통근자의 편도 60→35분을 실제 집과 회사 사이에서 측정합니다. 왕복 20일이면 1,000분이지만 모든 주민의 절약을 대표하지 않습니다." />
        <CitationBlock source="World Bank · Leaders in Urban Transport Planning" citeKey={1} href="https://academy.worldbank.org/en/infrastructure/transport/leaders-in-urban-transport-planning">도시별 접근성과 교통 계획의 연결을 다루는 세계은행 자료.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">측정할 출발지와 기회가 분명해졌습니다. 평가 지침이 중복을 막는 방법을 봅니다.</p>
      </section>
      <section id="comparison" data-teaching-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6 · 잉글랜드의 평가 원칙은 이익을 두 번 세지 말라고 요구합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">MHCLG의 사업 평가 안내는 토지가치 변화와 다른 편익을 합칠 때 중복을 확인하도록 합니다. 이 안내는 머리말에 &ldquo;Applies to England&rdquo;라고 적힌 잉글랜드의 주택·재생 사업 평가 지침입니다(2026-02-18 갱신). 이 원칙을 사례에 적용하면 1,000분 절약의 가치와 월세 상승 10만 원이 같은 접근성 개선을 반영하는지부터 봅니다.</p>
          <p className="leading-8">교통 사업에는 교통부(DfT)의 평가 지침 TAG가 따로 있습니다. TAG Unit A2.2(2025년 5월판)는 토지가치 상승에 토지로 자본화된 모든 영향이 담기므로 광역 경제 효과나 함께 시행한 다른 사업의 효과까지 섞여 중복 계산이나 편익의 잘못된 귀속이 생길 수 있다고 경고합니다.</p>
          <p className="leading-8">그래서 토지가치 상승, 직접 교통 편익, 다른 광역 경제 효과가 얼마나 겹치는지 경제 서술(Economic Narrative)에서 따져 보도록 합니다. 사례에 대입하면 월세 상승 10만 원 안에 통근 시간 1,000분의 가치가 이미 들어 있는지부터 묻는 것이 같은 질문입니다(2026-10-09 확인).</p>
          <p className="leading-8">서울이나 런던, 뭄바이의 사업에 동일한 시간가치를 넣을 수는 없습니다. 소득, 대체 교통, 요금, 일자리 분포와 토지 규칙이 다르므로 현지 평가 지침과 자료가 필요합니다.</p>
          <p className="leading-8">국가별 비교는 2026-10-04 확인 기준이며, 잉글랜드 지침을 다른 나라의 법적 의무로 적용하는 것은 아닙니다.</p>
        </div>
        <SourceApplication source="UK MHCLG Appraisal Guide · 4.39" excerpt="it is essential that there is no double counting of impacts" application="시간 절약 1,000분의 가치를 계산한 뒤 그 개선이 월세 10만 원에도 반영됐다면 둘을 독립 편익으로 바로 더하지 않습니다." />
        <CitationBlock source="UK MHCLG Appraisal Guide · 4.39" citeKey={2} href="https://www.gov.uk/government/publications/the-mhclg-appraisal-guide/the-mhclg-appraisal-guide">잉글랜드 주택·재생 사업 평가 지침(&ldquo;Applies to England&rdquo;, 2026-02-18 갱신)의 중복 계산 경계. 2026-10-04 확인, 적용 범위 2026-10-09 재확인. 교통 사업 쪽 근거는 <a className="text-sky-700 underline dark:text-sky-300" href="https://assets.publishing.service.gov.uk/media/6899eafbe7be62b4f0643223/tag-unit-a2-2-induced-investment-unit-may-25.pdf">DfT TAG Unit A2.2(2025년 5월)</a>입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">시간과 토지의 편익을 합칠 조건을 확인했습니다. 예측이 달라지는 경계를 살핍니다.</p>
      </section>
      <section id="limits" data-teaching-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7 · 새 수요와 지연 비용을 빼면 사업을 과대평가합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">노선이 좋아진 뒤 사람이 더 모여 혼잡과 대기가 늘 수 있습니다. 다른 상권의 소비가 새 역 주변으로 옮겨 온 것이라면 한 지역의 매출 증가를 나라 전체의 새 매출로 세기 어렵습니다.</p>
          <p className="leading-8">공사비 초과, 개통 지연, 유지비, 소음과 이주 부담도 지역별로 나눠 봅니다. 특히 평균 이용자 수가 맞아도 출근시간 한 방향에 수요가 몰리면 필요한 차량과 설비가 달라집니다.</p>
          <p className="leading-8">교통 편익 계산의 경계는 시간·소득·지가가 무엇을 대표하는지에 있습니다. 같은 1,000분을 실제 절약했는지 먼저 확인한 뒤 편익의 분배와 추가 비용을 계산합니다.</p>
        </div>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">측정한 시간과 사회 전체 편익을 구분했습니다. 경로와 지급 조건을 바꿔 봅니다.</p>
        <ReviewPrompts questions={["편도 25분을 줄여 20일 출근하면 왕복으로 몇 시간을 아낄까요? (답: 0절)", "시간 절약과 월세 상승을 합쳐 전체 편익으로 쓰기 전에 무엇을 확인할까요? (답: 6절)"]} />
      </section>
    </div>
  );
}
