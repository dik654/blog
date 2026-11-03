import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** teach-system S→B→0…7. 공식 문서 확인 2026-10-04, 사례 수치는 가정. */
export default function ElectricityGridAndPowerArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teaching-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">S · 전기를 만들 장소와 사용할 장소 사이에 무엇이 필요할까요</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">공장을 지을 때는 전기를 싸게 살 수 있는지와 원하는 날부터 계속 받을 수 있는지를 함께 봅니다. 발전소에 여유가 있어도 공장까지 보내는 길이 좁으면 생산을 시작하기 어렵습니다.</p>
          <p className="leading-8">이 글은 만드는 곳, 보내는 길, 쓰는 곳을 한 시간의 거래로 묶습니다. 설비를 더 짓는 선택과 사용 시간을 옮기는 선택이 각각 어느 막힘을 풀고 누구에게 비용을 보내는지 따라갑니다.</p>
        </div>
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공장 입지를 볼 질문을 정했습니다. 먼저 전기가 지나갈 큰 경로를 펼칩니다.</p>
      </section>
      <section id="black-box" data-teaching-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">B · 만드는 곳에서 쓰는 곳까지 세 번 확인합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">만드는 곳은 그 시간에 얼마나 내보낼 수 있는지 알려 줍니다. 보내는 쪽은 길을 안전하게 통과할 수 있는 양을 확인합니다. 쓰는 곳은 도착한 양으로 기계를 돌리고 부족하면 다른 공급이나 생산 연기를 선택합니다.</p>
          <p className="leading-8">돈은 반대 방향으로 흘러갑니다. 쓰는 사람이 내는 돈으로 생산과 길의 유지 비용을 갚습니다. 어느 기관이 세 일을 나누어 맡든 이 세 기능은 모두 필요합니다.</p>
        </div>
        <NumericPath title="큰 흐름부터 읽기" steps={[{"label": "만들기", "value": "1"}, {"label": "보내기", "value": "2"}, {"label": "쓰기", "value": "3"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">세 기능을 구분했으니 이제 같은 한 시간에 서로 다른 숫자가 붙는 이유를 봅니다.</p>
      </section>
      <section id="case" data-teaching-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">0 · 한 시간에 100을 만들 수 있지만 80만 보낼 수 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">오후 한 시간 동안 한 발전소는 100MWh를 만들 수 있습니다. 먼 공장으로 보내는 길은 그 시간에 80MWh까지만 통과시킨다고 놓습니다(가정). 공장이 원하는 양은 100MWh입니다. 손실과 다른 이용자는 우선 생략합니다.</p>
          <p className="leading-8">그 발전소에서 공장으로 도착할 양은 80MWh입니다. 나머지 20MWh는 공장 근처의 다른 공급원에서 구해야 합니다. 사용을 줄이는 선택도 있습니다. 100MWh를 먼저 만든 뒤 20MWh를 길에서 버린다는 뜻은 아닙니다. 미리 생산을 줄이는 선택도 있습니다.</p>
        </div>
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">100·80·20의 차이가 잡혔습니다. 다음 그림에서 보내는 쪽의 판단 하나를 엽니다.</p>
      </section>
      <section id="picture" data-teaching-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1 · 보내는 쪽은 두 숫자 중 작은 값을 고릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">발전소가 내보낼 수 있는 100과 길이 허용하는 80을 동시에 지켜야 합니다. 이 단순한 한 경로에서는 작은 쪽인 80이 도착 상한입니다. 실제 연결망에서는 여러 길로 흐르는 양과 고장 때의 안전 조건까지 계산합니다.</p>
        </div>
        <NumericPath title="(가정) 한 시간 동안 보낼 수 있는 에너지" steps={[{"label": "만들 수 있는 양", "value": "100MWh"}, {"label": "길의 통과 한도", "value": "80MWh"}, {"label": "이 길로 도착", "value": "80MWh"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">그림의 80은 발전소 부족이 아닌 연결 한도에서 나왔습니다. 한도를 둔 이유를 확인합니다.</p>
      </section>
      <section id="need" data-teaching-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2 · 안전 여유와 시간별 조정에도 돈이 듭니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">길을 무제한으로 사용하면 설비의 열과 운전 조건이 허용 범위를 벗어날 수 있습니다. 여분의 길이나 공급을 준비하는 이유는 평소 생산량을 키우는 것뿐 아니라 고장과 갑작스러운 수요에도 버티기 위해서입니다.</p>
          <p className="leading-8">공장이 20MWh의 작업을 밤으로 옮기면 같은 길을 더 넓히지 않고도 일을 마칠 수 있습니다(가정). 대신 교대 인력과 납품 일정의 비용이 생깁니다. 가까운 저장 설비에 미리 채워 두어도 충전 손실과 설치비를 부담합니다.</p>
        </div>
        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">길을 늘리거나 시간을 바꾸는 대가를 알았습니다. 이제 이 역할에 쓰는 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teaching-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3 · 출력·사용량·접속을 다른 단위로 부릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">순간에 얼마나 빠르게 전기를 만들거나 쓰는지 나타내는 양이 전력이고 단위는 MW입니다. 그 상태를 얼마 동안 유지했는지 합친 에너지는 MWh로 적습니다. 100MW를 한 시간 유지하면 100MWh가 됩니다.</p>
          <p className="leading-8">전기를 장거리로 옮기는 길은 송전망입니다. 그 길에 새 발전소나 공장을 연결할 조건을 망 접속이라고 부릅니다. 이 사례의 접속 제약은 그 한 시간의 공급을 80MWh로 제한합니다.</p>
          <p className="leading-8">생산과 사용을 계속 맞추는 담당은 계통운영자입니다. 망 소유자와 계통운영자가 같은 조직인지, 최종 요금을 받는 사업자까지 겸하는지는 나라와 지역의 제도에 달려 있습니다.</p>
        </div>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">MW와 MWh를 구별했으니 같은 사례의 물량과 지급액을 끝까지 계산합니다.</p>
      </section>
      <section id="mechanism" data-teaching-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4 · 먼 발전 80과 가까운 발전 20을 합쳐 공급합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">먼 발전의 단가를 MWh당 5만 원, 공장 근처 대체 공급을 10만 원으로 둡니다(가정). 먼 곳에서 80MWh를 받아 400만 원, 가까운 곳에서 20MWh를 받아 200만 원을 냅니다. 에너지 조달비는 합계 600만 원입니다.</p>
          <p className="leading-8">길의 제약이 없어서 먼 곳에서 100MWh를 모두 살 수 있었다면 500만 원입니다. 두 조건의 차이 100만 원은 이 한 시간의 추가 조달비입니다. 이것만으로 송전선 건설비를 회수할 수 있는지는 아직 모릅니다. 연간 혼잡 시간과 공사비를 더 알아야 합니다.</p>
          <p className="leading-8">최종 전력 시스템 비용에는 망 유지, 운영, 고장 대비와 저장 비용도 들어갑니다. 600만 원은 최종 청구서의 일부입니다. 실제 도매시장에서는 단가 결정과 혼잡 비용의 배분 방식도 계약에 따라 달라집니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공급 100MWh와 에너지 비용 600만 원이 이어졌습니다. 국제 자료가 설명하는 병목을 같은 숫자에 적용합니다.</p>
      </section>
      <section id="source" data-teaching-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 · IEA의 접속 병목을 우리 공장에 대입합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">IEA의 전력망 분석은 생산 설비만 늘려서는 연결 대기를 해결할 수 없다는 문제를 다룹니다. 사례의 100MWh 가운데 먼 곳에서 80MWh만 받는 조건이 바로 그 구분을 보여 줍니다.</p>
          <p className="leading-8">보고서가 모든 공장의 접속량을 계산해 주는 것은 아닙니다. 실제 80이라는 한도는 해당 망사업자의 접속 검토, 보강 공사 범위와 공급 개시일 문서에서 확인해야 합니다.</p>
        </div>
        <SourceApplication source="IEA Electricity 2026 · Grids" excerpt="Grids are emerging as a bottleneck for connecting supply, demand and storage" application="100MWh의 생산 가능량과 80MWh의 전송 가능량을 분리합니다. 나머지 20MWh에는 대체 공급이나 수요 조정이 필요합니다." />
        <CitationBlock source="IEA Electricity 2026 · Grids" citeKey={1} href="https://www.iea.org/reports/electricity-2026/grids">전력망 접속 병목에 관한 2026년 국제 분석. 현지 요금이나 계약을 정하지 않습니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">국제 보고서의 주장과 현장 계약의 숫자를 나눴습니다. 비용을 정하는 지역 제도를 비교합니다.</p>
      </section>
      <section id="comparison" data-teaching-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6 · 미국 안에서도 망 운영과 가격 결정이 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">미국 FERC의 시장 안내는 독립 운영자가 도매시장을 여는 지역과 발전·송전·배전을 함께 맡는 전력회사가 있는 지역을 구분합니다. 따라서 미국 전력요금 하나로 사례의 600만 원 청구 방식을 정할 수 없습니다.</p>
          <p className="leading-8">같은 100MWh라도 지역 도매 규칙, 소매 계약, 망 요금, 수요를 줄여 달라는 약정이 다르면 지급액이 달라집니다. 다른 나라에 적용할 때도 접속 허가 담당과 운영 담당, 요금 승인 담당을 각각 찾아야 합니다.</p>
          <p className="leading-8">법·시장 비교는 2026-10-04 공식 안내 확인 기준입니다. 이 글의 두 단가는 가정이며 어느 나라의 실제 요금표도 아닙니다.</p>
        </div>
        <SourceApplication source="FERC · Electric Power Markets, National Overview" excerpt="Utilities in these markets are frequently vertically integrated" application="같은 80MWh를 공급해도 발전·망·소매의 담당이 같은 회사일 수 있습니다. 에너지 조달비 600만 원과 최종 요금의 배분을 현지 계약에서 확인합니다." />
        <CitationBlock source="FERC · Electric Power Markets, National Overview" citeKey={2} href="https://www.ferc.gov/electric-power-markets">미국 내부의 시장 구조 차이와 지역 규제 범위. 2026-10-04 확인.</CitationBlock>
        <CitationBlock source="US EIA · Generation, capacity and sales" citeKey={3} href="https://www.eia.gov/energyexplained/electricity/electricity-in-the-us-generation-capacity-and-sales.php">MW 출력과 MWh 에너지 단위를 구분하는 공식 안내.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">기관의 이름보다 접속 권리와 지급 계약을 먼저 확인했습니다. 마지막으로 이 계산이 놓치는 시간을 봅니다.</p>
      </section>
      <section id="limits" data-teaching-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7 · 싼 평균 요금이 필요한 순간의 공급을 보장하지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">저장 설비가 20MWh를 담을 수 있어도 한 시간에 5MW만 낼 수 있다면 그 시간의 부족 20MWh를 모두 채우지 못합니다(가정). 저장량과 방전 속도를 함께 확인해야 합니다.</p>
          <p className="leading-8">전력 가격과 공급 안정성의 경계는 계약상 받을 권리, 실제 연결 용량, 정전 때의 대체 수단에 있습니다. 낮은 평균 요금과 연간 발전량만으로 공장의 생산 손실을 추정할 수 없습니다.</p>
          <p className="leading-8">실제 투자에서는 최대 사용량의 시간표와 접속일을 맞춥니다. 공급 지연과 정전 때 손실을 계산합니다. 100·80·20 모델은 이 질문을 열어 주지만 복잡한 전력 흐름이나 고장 확률을 대신 계산하지는 않습니다.</p>
        </div>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">한 시간의 공급과 비용을 추적했고 저장 속도라는 경계도 확인했습니다. 이제 조건이 바뀔 때 결과를 예상해 봅니다.</p>
        <ReviewPrompts questions={["같은 조건에서 공장 근처 공급 단가가 더 오르면 600만 원 중 어느 부분이 변할까요? (답: 4절)", "20MWh 저장장치가 왜 한 시간의 부족 20MWh를 못 채울 수 있을까요? (답: 7절)"]} />
      </section>
    </div>
  );
}
