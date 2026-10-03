import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">사람이 많다는 말만으로 시장의 크기를 알 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            100명이 사는 마을도 어린이가 많은지, 하루 종일 일할 수 있는 사람이 많은지에 따라 필요한 가게와 서비스가 달라집니다. 누군가는 가족을 돌보느라 일할 시간을 내지 못합니다.
            돈을 벌 수 있는 시간은 사람 수뿐 아니라 생활의 조건에 달려 있습니다.
          </p>
          <p className="leading-8">이 글은 사람 수가 변하는 길과 하루 시간이 나뉘는 길을 함께 따라갑니다. 이 두 흐름을 알면 학교·주택·병원·일자리 수요가 왜 서로 다른 속도로 움직이는지 질문할 수 있습니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">사람 수에서 생활과 일로 이어지는 질문을 잡았습니다. 먼저 들어오고 나가는 길을 봅니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">사람은 들어오고 나가며 남은 사람도 나이를 먹습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            마을에는 새로 태어나는 사람과 이사 오는 사람이 있습니다. 사망하거나 다른 곳으로 떠나는 사람도 있습니다. 남아 있는 사람도 시간이 지나면 학교를 졸업하고 일을 바꾸고 돌봄이
            필요한 시기를 맞습니다.
          </p>
          <p className="leading-8">생활에는 일을 해 버는 돈과 돌보는 시간이 모두 필요합니다. 가족·공공기관·민간업체가 이 시간을 나눠 맡습니다. 어느 한쪽이 맡던 일이 다른 쪽으로 옮겨가면 돈의 지급 상대와 일을 할 수 있는 시간이 함께 바뀝니다.</p>
        </div>

        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">출입과 시간 배분이라는 두 흐름을 구분했으니 한 마을의 숫자를 고정합니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">100명과 하루 8시간을 기준으로 삼습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            (가정) 연초 A마을은 100명입니다. 한 해 출생 2명·사망 1명·전입 3명·전출 2명이 있고 모두 같은 거주지 기준으로 셉니다. 연초의 나이는 0–14세 20명,15–64세
            60명,65세 이상 20명입니다.60명 가운데 실제 유급 취업자는 45명이라고 놓습니다.
          </p>
          <p className="leading-8">
            (가정) 한 가구의 성인에게 하루 8시간이 있고 가족 돌봄에 4시간이 필요합니다. 돌봄과 유급 일을 동시에 할 수 없고 통근·휴식은 생략하므로 밖에서 일할 수 있는 시간은
            4시간입니다. 모든 가구에 같은 시간표를 적용할 수는 없습니다.
          </p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">마을의 연간 숫자와 가구의 하루 숫자는 단위가 다릅니다. 각 흐름을 그 단위 안에서 계산합니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">태어난 사람과 들어온 사람을 같은 바구니에 더합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">먼저 100명에 태어난 2명을 더하고 사망한 1명을 뺍니다.101명입니다. 전입 3명을 더하고 전출 2명을 빼면 102명이 됩니다.2명이 늘었지만 출생·사망의 차이로 1명, 이동의 차이로 1명 늘었습니다.</p>
          <p className="leading-8">이 그림은 총수를 보여줍니다. 전입 3명이 영아인지 취업 가능한 성인인지 알 수 없으므로, 일할 사람 3명이 생겼다는 결론은 아직 낼 수 없습니다. 나이를 나눈 장부가 필요한 이유입니다.</p>
        </div>
        <NumericPath title="(가정) 같은 거주지·같은 1년의 사람 수" steps={[{"label": "연초", "value": "100명", "detail": "출발 시점"}, {"label": "출생−사망", "value": "+1명", "detail": "2−1"}, {"label": "전입−전출", "value": "+1명", "detail": "3−2"}, {"label": "연말", "value": "102명", "detail": "나이별 구성은 별도"}]} />

        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">총수가 102명이 되는 길을 확인했습니다. 노동과 소비를 보려면 어떤 정보를 더 넣어야 하는지 살펴봅니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">나이가 같아도 일할 수 있는 조건이 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">연초 15–64세 60명 모두를 취업자로 세면 실제 45명보다 15명을 더 셉니다. 이 15명에는 공부하거나 구직하는 사람, 건강상 일을 못 하는 사람, 가족을 돌보는 사람이 있을 수 있습니다. 각각의 이유가 다르면 필요한 지원도 달라집니다.</p>
          <p className="leading-8">이주한 사람도 나이만으로 고용되지 않습니다. 언어·자격·거주지와 일자리 사이 거리, 합법적인 취업 권리와 고용주의 채용 조건이 맞아야 합니다. 이들이 가족과 함께 이동하면 학교·주택·돌봄 수요도 생깁니다.</p>
          <p className="leading-8">
            하루 8시간의 가구에서 돌봄 4시간은 남는 시간에 저절로 처리되는 일이 아닙니다. 방문 일정이 근무시간과 겹치거나 대체 서비스를 살 돈이 없으면 일을 줄일 수 있습니다. 이
            제약을 빼고 계산하면 노동공급을 실제보다 크게 잡습니다.
          </p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">사람 수를 근무시간으로 바꾸는 조건이 보입니다. 이제 자주 쓰는 비율과 용어를 정의합니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">인구 장부·연령 부양비·돌봄 노동이라는 이름을 붙입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            처음 인구에 태어난 사람과 들어온 사람을 더하고 사망한 사람과 떠난 사람을 빼는 것이 인구의 잔액·출입 장부입니다. 관측 기간의 길이와 거주자 정의가 같아야 계산이 맞습니다.
          </p>
          <p className="leading-8">15–64세 인구를 분모로 두고 그 밖의 연령을 분자로 두는 비율을 여기서는 연령 부양비라고 부릅니다. A마을은(20+20)/60×100=약 66.7입니다.15–64세 100명당 다른 연령 66.7명이 있다는 뜻입니다.65세 이상 모두가 경제적으로 의존한다는 뜻도,15세부터 모두 취업한다는 뜻도 아닙니다.</p>
          <p className="leading-8">다른 사람의 생활과 능력을 유지하도록 제공하는 활동을 돌봄 노동이라고 부릅니다. 식사를 직접 돕는 일뿐 아니라 청소·준비처럼 간접적으로 돌보는 일도 있습니다. 임금을 받는지 여부와 실제 노동이 존재하는지는 구분합니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">연령 비율과 실제 노동의 차이를 설명할 수 있습니다. 처음의 100명과 8시간을 다시 끝까지 계산합니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">102명이라는 결과와 가계의 1만원은 다른 경로에서 나옵니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">마을 장부는 100+2−1+3−2=102명입니다. 전입자가 모두 어린이라면 총수는 그대로 102명이지만 즉시 취업할 성인은 늘지 않습니다.20/60/20은 연초 구성입니다. 연말 연령별 숫자는 사망·이동의 나이와 생일이 있어야 계산할 수 있습니다.</p>
          <p className="leading-8">
            (가정) 가구가 돌봄 4시간 중 2시간을 외부 서비스에 맡깁니다. 요금은 시간당 1.5만원이고 비워진 2시간에 시간당 2만원의 유급 일을 할 수 있다고 놓습니다. 늘어난 수입은
            4만원, 늘어난 지출은 3만원이므로 차액은 1만원입니다. 세금과 통근비는 생략했습니다.
          </p>
          <p className="leading-8">외부 서비스가 집에서 너무 멀거나 고용주가 근무시간을 늘려주지 않으면 4만원의 추가 수입이 생기지 않습니다. 서비스의 안정성과 돌봄을 받는 사람의 필요도 맞아야 합니다. 계산의 핵심은 시간을 비우는 것과 그 시간을 소득으로 바꾸는 것을 각각 확인하는 데 있습니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">사람이 늘어나는 계산과 일할 시간이 늘어나는 계산을 연결했습니다. 인구 전망의 원문에서는 이 과정을 더 잘게 나눕니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">UN은 같은 나이 집단을 한 해씩 앞으로 옮깁니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">UN의 WPP2024 방법론은 총인구에 일정한 증가율을 계속 곱하는 방식으로 끝나지 않습니다. 나이와 성별을 나눈 현재 인구에 출생·사망·이동을 적용해 다음 해를 만듭니다. A마을의 102명을 학교 수요로 바꾸려면 바로 이 나이별 경로가 필요합니다.</p>
          <p className="leading-8">
            방법론의 출발점을 사례로 읽어 봅니다. 현재 10세인 집단 가운데 다음 해까지 살아남은 사람은 11세 집단으로 이동합니다. 새로 태어난 2명은 새 나이 집단에 들어가고 전입
            3명과 전출 2명은 각자의 나이 위치에 반영됩니다. 이 글에는 그 상세 나이가 없으므로 다음 해 학생 수를 지어내지 않습니다.
          </p>
          <p className="leading-8">2024판의 전망값에는 앞으로의 출생·사망·이동에 대한 가정이 들어갑니다. 멀리 갈수록 정책과 생활조건의 변화가 누적됩니다. 중간 시나리오 한 줄과 함께 불확실성 범위를 읽어야 합니다.</p>
        </div>

        <SourceApplication source="UN DESA · WPP2024 Methodology, p.1–2 및 II.G" excerpt="fertility, mortality, and migration" application="100명이 102명으로 변한 총수 계산은 세 경로의 합계입니다. 다음 해 학생·노동자·고령자 수를 얻으려면 현재 나이별 인구가 살아남아 한 살씩 옮겨가고, 새 출생과 이동이 어느 나이에 더해지는지 알아야 합니다." />
        <CitationBlock source="UN DESA · WPP2024 Methodology, p.1–2 및 II.G" citeKey={1} href="https://population.un.org/wpp/assets/Files/WPP2024_Methodology.pdf">2024판은 연령·성별 출생·사망·국제이동으로 매년 인구를 전진시킵니다. 추정과 전망을 구분합니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">인구 전망이 어떤 입력을 요구하는지 확인했습니다. 시간 장부도 원문이 어디까지 포함하는지 봅니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">ILO의 돌봄 범위에는 가정에서 보낸 4시간도 들어갑니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">ILO는 돌봄의 범위를 유급 서비스에 한정하지 않습니다. 가족과 공동체가 무급으로 맡는 활동도 포함합니다. A가구의 4시간을 가계 지출이 없다는 이유로 0으로 처리하면 실제 제약을 지우게 됩니다.</p>
          <p className="leading-8">2시간이 유료 서비스로 옮겨가면 3만원의 거래가 새로 기록됩니다. 그러나 이전에도 같은 2시간의 돌봄이 있었습니다. 통계에 잡히는 돈의 증가와 돌봄의 양·품질 증가, 다른 일을 할 수 있는 시간 증가는 각각 측정해야 합니다.</p>
          <p className="leading-8">국가를 비교할 때는 공공 서비스의 이용 자격·대기·시간대, 가계 부담, 종사자의 근무조건을 확인합니다. 세금으로 낸 비용을 무료라고 지우거나, 값싼 돌봄의 조건을 제공자의 낮은 보수와 불안정한 지위에서 떼어 놓으면 부담의 이동을 놓칩니다.</p>
        </div>

        <SourceApplication source="ILO · Care economy, What is the care economy?" excerpt="paid and unpaid, direct and indirect" application="집에서 제공하는 4시간도 실제 돌봄입니다. 그중 2시간을 유료로 바꾸면 장부에 3만원의 서비스 거래가 나타나지만, 돌봄 자체가 0에서 처음 생긴 것은 아닙니다." />
        <CitationBlock source="ILO · Care economy, What is the care economy?" citeKey={2} href="https://www.ilo.org/topics-and-sectors/care-economy">유급·무급, 직접·간접 돌봄과 제공자·수혜자·고용주·서비스 기관의 범위. 확인 2026-10-04.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">보이지 않던 돌봄시간까지 장부에 들어왔습니다. 이제 인구 숫자로 예측할 수 없는 부분을 정리합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">인구 구성은 조건이며 한 나라의 운명표는 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">같은 연령 부양비 66.7이라도 취업률·임금·건강·재산·공공서비스가 다르면 가계 부담이 달라집니다. 연금 재정도 가입·기여·급여 규칙과 고용에 달려 있습니다. 나이 비율만으로 제도의 결과를 확정할 수 없습니다.</p>
          <p className="leading-8">
            이주는 출발지와 도착지 모두를 바꿉니다. 송금과 숙련 이전이 생길 수 있고 가족 분리와 특정 직종의 인력 부족도 생길 수 있습니다. 이주자 전체를 하나의 효과로 묶기보다 누가
            언제 어떤 권리로 이동했는지 봅니다.
          </p>
          <p className="leading-8">정책의 효과를 보려면 사람 수 외에 실제 취업자·근무시간·시간 사용 조사·대기시간·돌봄 품질을 함께 관측합니다.102명이라는 총수와 가계의 추가 1만원은 그중 일부를 설명하는 가정 계산입니다.</p>
        </div>

        <CitationBlock source="ONS · National population projections methodology" citeKey={3} href="https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationprojections/methodologies/methodologyusedtoproducethenationalpopulationprojections">출생·사망·이동의 가정에 따른 전망이라는 방법적 경계. 한국의 장기 전망이나 다른 나라의 실제 수치를 대신하지 않습니다.</CitationBlock>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">인구는 사람 수, 나이, 실제 일과 돌봄의 시간을 함께 읽어야 합니다. 세 질문으로 계산의 경계를 확인합니다.</p>
        <ReviewPrompts questions={["전입 3명이 모두 아이들이라면 102명이라는 결과와 당장 일할 사람 수는 어떻게 달라질까요? (답: 7절)", "가족 돌봄 2시간을 외부에 맡겼다는 사실만으로 가계가 반드시 더 부유해질까요? (답: 7절)", "연령 부양비 66.7만 보고 연금이 고갈된다고 결론 낼 수 있을까요? (답: 10절)"]} />
      </section>
    </div>
  );
}
