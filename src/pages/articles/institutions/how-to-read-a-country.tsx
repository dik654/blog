import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";
import CountryExplorer from "../world-systems/CountryExplorer";
import { Link } from "react-router-dom";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">나라의 별명보다 누가 벌고 누가 부담하는지 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            어느 나라에서 공장이 잘 돌아간다는 소식과 그곳 가계의 생활이 나아졌다는 소식은 같은 말이 아닙니다. 물건을 만들 때 밖에서 사 온 것이 많을 수도 있고 남은 돈이 일부
            소유자에게 모일 수도 있습니다. 숫자 하나에서 생활 전체를 추측하면 이 사이가 사라집니다.
          </p>
          <p className="leading-8">
            이 글은 나라를 읽는 질문의 순서를 만듭니다. 누가 규칙을 정하고 무엇을 만들어 누구에게 파는지 따라갑니다. 약속한 돈을 언제 갚아야 하는지, 그 결과가 생활과 기대를 어떻게
            바꾸는지도 살핍니다. 실제 국가·지역 자료는 뒤의 탐색기에서 같은 기준으로 비교합니다.
          </p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">국가를 읽는 목적은 정해졌습니다. 먼저 나라 안팎에서 오가는 것만 살펴봅니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">사람·물건·돈·결정이 국경을 오갑니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">안쪽에는 일하는 사람과 물건을 만드는 곳, 공동 서비스를 정하는 곳이 있습니다. 바깥에는 물건을 사는 고객과 부품을 파는 곳, 돈을 빌려주는 상대가 있습니다. 사람도 안팎으로 이동합니다. 이 흐름 중 하나가 막히면 나머지가 어떻게 달라질지가 첫 질문입니다.</p>
          <p className="leading-8">
            규칙을 바꾸는 결정은 가게와 가계가 내는 비용을 바꿉니다. 바뀐 비용은 생산과 소비를 바꾸고 달라진 결과를 본 사람들이 다시 돈과 표를 움직입니다. 한 방향의 순서만 있는
            구조가 아니라 결과가 다음 결정을 바꾸는 반복입니다.
          </p>
        </div>

        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">안과 밖의 연결이 보이면 작은 나라 하나에 숫자를 붙일 수 있습니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">수출 100·밖에서 산 부품 60·갚을 외화 30을 놓습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            (가정) A국의 한 생산 사슬이 1년 동안 외국에 물건 100을 팔고 그 물건에 들어간 외국산 부품에 60을 냅니다. 다른 중간 투입은 생략합니다. 단위는 모두 같은 외화의
            금액 단위입니다. 생산 사슬 안에서 나눌 잔액은 40입니다.
          </p>
          <p className="leading-8">
            (가정) A국 기업들이 연말에 진 외화 부채의 잔액은 30이고 A국 정부는 같은 해 수입보다 지출을 5 더 했습니다. 여기서 30은 한 시점의 빚,5는 한 해의 부족액입니다.
            수출 100과 함께 더해 135의 소득이라고 부를 수 없습니다.
          </p>
          <p className="leading-8">40 가운데 얼마가 노동자의 임금이고 얼마가 소유자의 몫인지 아직 모릅니다.30을 다음 주에 갚는지 10년 후에 갚는지도 모릅니다. 사례에 적힌 네 숫자가 답하지 못하는 질문을 다음 장부에서 채웁니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">100·60·30·5는 서로 다른 대상을 셉니다. 이제 같은 수출 거래가 지나가는 길을 그립니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">판매 100에서 밖으로 60이 나가고 안쪽에 40이 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">외국 고객이 낸 100 중 60은 외국 부품 판매자에게 갑니다. 남은 40은 이 단순한 생산 사슬에서 일한 사람과 자본 제공자 등이 나눌 몫입니다.40이 정부 통장에 들어가는 것도, 모두 가계 월급이 되는 것도 아닙니다.</p>
          <p className="leading-8">빚 30은 이 흐름 옆에 따로 둡니다. 이자를 내는 비용과 원금을 갚는 현금은 판매액의 차이만으로 알 수 없습니다. 정부의 5도 세금·지출·차입의 흐름에서 다시 확인해야 합니다.</p>
        </div>
        <NumericPath title="(가정) 한 생산 사슬의 연간 흐름" steps={[{"label": "외국 고객의 지급", "value": "100", "detail": "같은 외화 단위"}, {"label": "밖에서 산 부품", "value": "−60", "detail": "다른 중간 투입 생략"}, {"label": "안쪽에서 나눌 잔액", "value": "40", "detail": "국가전체 GDP·순이익 아님"}]} />

        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">남은 40과 갚을 30을 분리했습니다. 왜 나라 전체를 여러 장부로 나누는지 설명할 차례입니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">전력 부족은 생산뿐 아니라 생활과 정치에도 닿습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">공장이 전기를 더 필요로 하면 설비와 연료를 확보해야 합니다. 누가 시설을 짓고 누가 요금을 정하는지에 따라 기업의 비용과 가계 부담이 달라집니다. 전력회사의 부족한 돈을 정부가 채우면 세금이나 차입까지 연결됩니다. 생산만 보아서는 비용을 떠안는 사람을 놓칩니다.</p>
          <p className="leading-8">
            나라 평균으로 가게 자리를 고르기도 어렵습니다. 국가 자료에서 방향을 잡은 뒤 해당 도시의 교통·임금·고객 수요를 확인하고 실제 건물의 임대차·용도·영업허가까지 내려가야
            합니다. 같은 나라에서도 지방과 계약이 바뀌면 결론이 달라집니다.
          </p>
          <p className="leading-8">자료를 읽는 단위도 생활 질문에 맞춥니다. 인구는 총수와 나이를, 문화는 가족과 공동체의 약속을, 생산은 물·에너지·재료를 봅니다. 기술의 가능성은 실제 측정과 실험으로 확인합니다. 이 질문들이 각 장부의 빈칸을 찾게 합니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">한 거래가 여러 사람의 비용을 바꾼다는 이유가 잡혔습니다. 이 비교 틀에 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">일곱 장부는 따로 적고 서로 연결합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">이 글에서는 정치·법, 예산, 생산, 대외 거래, 생활 서비스, 정보, 기대를 ‘국가의 일곱 장부’라고 부릅니다. 공식 통계 분류 하나의 이름이 아니라 질문을 빠뜨리지 않기 위한 이 글의 분석 틀입니다. 모든 장부에 결정권자·돈을 내는 사람·손실을 받는 사람을 적습니다.</p>
          <p className="leading-8">정치·법에는 누가 규칙을 바꾸고 누가 집행하는지 씁니다. 예산에는 정부의 수입·지출·빚을, 생산에는 노동과 재료가 무엇으로 바뀌는지 씁니다. 전기요금 사례라면 정부 결정이 기업과 소비자, 납세자의 장부로 이어집니다.</p>
          <p className="leading-8">
            대외 거래는 물건과 자금의 국경 이동, 생활 서비스는 주거·의료·교육·이동의 실제 접근성입니다. 정보는 사람들이 무엇을 보고 믿는 경로이고 기대는 그 믿음 때문에 오늘 바뀌는
            소비·투자·투표입니다. 같은 정의로 비교할 수 있는지를 ‘비교 가능성’이라고 부릅니다.
          </p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">일곱 이름은 질문을 담는 칸입니다. A국의 네 숫자를 그 칸에 넣어 끝까지 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">A국의 40이 생활과 상환 능력이 되려면 조건이 더 필요합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">첫째, 수출 100에서 수입 투입 60을 빼 40을 얻습니다. 이것은 생략한 다른 중간 투입이 없다는 가정의 생산 사슬 잔액입니다. 나라 전체의 생산을 다 센 값도, 세금과 이자까지 뺀 회사 순이익도 아닙니다.</p>
          <p className="leading-8">둘째,40이 임금과 자본의 몫으로 어떻게 나뉘는지 확인합니다. 소득이 생겼어도 실제 입금이 늦으면 곧 돌아오는 부채 30의 만기를 넘길 수 있습니다. 외화 수출대금의 수취일, 부채의 상환일과 보유 현금을 함께 놓아야 합니다.</p>
          <p className="leading-8">(가정) 외화 1을 사는 데 자국 돈 1이 들다가 1.2가 들게 되면, 외화 부채 30의 자국 돈 환산액은 30에서 36이 됩니다.6만큼 커집니다. 동시에 외화 수출 100과 부품값 60의 환산액도 달라집니다. 어떤 회사가 수출하고 어떤 회사가 빚을 졌는지 모르면 국가 합계로 순효과를 확정할 수 없습니다.</p>
          <p className="leading-8">셋째, 정부 적자 5가 전력 시설 때문인지 다른 지출 때문인지 봅니다. 시설이 제때 작동하고 사용료가 들어오는지에 따라 이후 비용과 생산이 달라집니다. 마지막으로 실제 임금·가격·서비스의 변화가 처음의 기대와 맞았는지 확인합니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">숫자에서 생활로 가는 중간 조건을 찾았습니다. 실제 자료에서도 이 구분을 지키는지 원문을 읽습니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">World Bank의 자료 설명을 A국 장부에 적용합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            여러 나라를 같은 화면에 놓으려면 비교 가능한 자료가 필요합니다. World Bank의 WDI는 여러 공식 원자료를 모은 출발점입니다. 한 기관에서 다운로드했어도 지표마다
            정의와 연도가 다를 수 있습니다.
          </p>
          <p className="leading-8">예를 들어 A국의 100은 연간 총수출,30은 연말 외화 부채 잔액입니다. 지표 이름·단위·대상·기준 연도를 각각 기록하고 가져옵니다. 기업 부채를 정부 부채로 바꾸거나, 현재 달러 값을 물가를 고정한 성장률로 읽지 않습니다.</p>
          <p className="leading-8">탐색기의 1인당 국내총생산도 이 나라 안에서 생산한 가치를 인구로 나눈 값입니다. 환율이 달라지면 현재 달러 값이 변합니다. 그 값이 평균 임금이나 개인이 자유롭게 쓸 수 있는 돈을 직접 보여주는 것은 아닙니다.</p>
        </div>

        <SourceApplication source="World Bank · WDI DataBank" excerpt="compiled from officially recognized international sources" application="A국 100·60·30·5는 이 데이터에서 얻은 값이 아닙니다. 실제 비교에서는 수출액·외채잔액·재정수지 각각의 정의와 연도를 찾고, 합계가 같은 단위인지 확인합니다." />
        <CitationBlock source="World Bank · WDI DataBank" citeKey={1} href="https://databank.worldbank.org/home">WDI의 수집 범위와 원자료 설명. 통계 조회 2026-10-04.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">국제 자료를 어디서 가져오고 무엇을 확인할지 정했습니다. 실제 목록과 수치로 비교 범위를 확인합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">250개 국가·지역을 같은 질문으로 탐색합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            UN M49는 통계에 쓸 국가·지역 코드 목록입니다.2026-10-04에 확인한 기본 목록 248개를 모두 싣고 FAQ에서 별도 통계 코드 사용을 설명하는 코소보 412와 대만
            158을 더했습니다. 아래 250개는 외교상 승인된 국가 수를 뜻하지 않습니다.
          </p>
          <p className="leading-8">World Bank 국가 API에는 집계 지역을 뺀 217개 경제가 있습니다. 이 중 Channel Islands 같은 항목은 UN의 개별 지역 행과 범위가 다릅니다. 이런 값을 저지섬·건지섬 각각의 값으로 복제하지 않았습니다. 원자료가 없는 지역은 빈칸의 이유를 읽을 수 있게 남겼습니다.</p>
          <p className="leading-8">인구,1인당 생산액,65세 이상 비중,전력 접근 인구를 나란히 확인해 보세요. 각 값은 2020–2025년 중 가장 최근 관측값입니다.2025년 값과 2023년 값을 같은 해의 차이라고 읽지 않습니다. 전력 접근률이 같아도 정전 시간·산업 요금·접속 대기는 다를 수 있습니다.</p>
        </div>
<CountryExplorer />
        <SourceApplication source="UNSD · M49, Countries or Areas와 FAQ" excerpt="for statistical convenience" application="A국을 목록에 대응시킬 때 국가 이름 외에 통계 지역 코드를 기록합니다. 본문 탐색기는 248개 행에 코소보·대만 2개 행을 보태 250개를 보여주며, 주권 승인 목록이라고 부르지 않습니다." />
        <CitationBlock source="UNSD · M49, Countries or Areas와 FAQ" citeKey={2} href="https://unstats.un.org/unsd/methodology/m49/">목록 248개, FAQ의 별도 통계 코드 412·158. 확인 2026-10-04.</CitationBlock>
        <CitationBlock source="World Bank · API Basic Call Structures" citeKey={3} href="https://datahelpdesk.worldbank.org/knowledgebase/articles/898581-api-basic-call-structures">네 지표의 2020–2025 자료를 조회하고 국가별 마지막 비결측 값을 표시합니다. 소득 구간·대륙 합계는 국가 값에서 제외합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">포함한 지역과 관측 시점을 화면에서 확인할 수 있습니다. 마지막으로 통계가 이야기의 근거가 되는 조건을 점검합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">국가에 관한 주장은 틀릴 수 있는 질문으로 바꿉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">“빚이 많아서 외화 위기가 온다”라는 주장은 만기와 통화를 정해야 확인할 수 있습니다. A국의 부채 30이 곧 만기가 되는지, 사용할 수 있는 외화와 이미 약정한 유입이 얼마인지 봅니다. 같은 통화의 안정적인 수입으로 상환할 수 있다면 부채잔액만으로 만든 위기 설명은 약해집니다.</p>
          <p className="leading-8">수출이 늘어난 뒤 집값이 올랐어도 수출이 원인이라고 바로 말할 수 없습니다. 같은 시기 금리·대출 규칙·주택 공급·인구 이동이 바뀌었는지 비교합니다. 수출 소득을 받은 사람과 집을 산 사람이 이어지는지도 확인합니다. 시간 순서는 원인을 찾는 출발점입니다.</p>
          <p className="leading-8">국가 평균 뒤에는 소득·지역·연령·법적 지위에 따른 차이가 있습니다. 다음 읽기는 이 차이를 설명하는 데 씁니다. 인구와 돌봄은 노동과 소비의 조건을, 문화와 규범은 협력과 갈등을, 측정과 인과는 주장의 근거를, 물질과 폐기물은 생산의 시작과 끝을 이어 줍니다.</p>
        </div>
<ul className="mt-6 list-disc space-y-3 pl-5 leading-7"><li><Link className="text-sky-700 underline dark:text-sky-300" to="/economics/institutions/population-migration-and-care">인구·이주·돌봄: 사람 수가 노동시간으로 바뀌는 조건</Link></li><li><Link className="text-sky-700 underline dark:text-sky-300" to="/economics/institutions/culture-norms-and-coordination">문화·규범: 서로의 행동을 어떻게 예상하는가</Link></li><li><Link className="text-sky-700 underline dark:text-sky-300" to="/economics/institutions/evidence-measurement-and-causality">측정·인과: 숫자가 주장을 뒷받침하는가</Link></li><li><Link className="text-sky-700 underline dark:text-sky-300" to="/economics/infrastructure/materials-waste-and-circularity">자원·폐기물: 만든 물건이 버려진 뒤의 흐름</Link></li></ul>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">한 나라를 다 안다는 결론 대신, 다음으로 확인할 장부와 반증 자료를 고를 수 있으면 이 읽기 틀을 사용할 수 있습니다.</p>
        <ReviewPrompts questions={["수출 100·수입 60인데 외화 부채 30을 당장 갚아야 한다면 40만 보고 상환 가능하다고 결론 내릴 수 있을까요? (답: 7절)", "두 나라의 전력 접근률이 같아도 공장 운영비가 다를 수 있는 이유는 무엇일까요? (답: 9절)", "외화 부채가 많다는 이야기를 반증하려면 어느 자료부터 확인할까요? (답: 10절)"]} />
      </section>
    </div>
  );
}
