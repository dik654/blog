import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function TradeCreditAndLongDistanceNetworksArticle() {
  return (
    <div className="space-y-16">
      <LessonSection id="overview" level="S" title="1. 교역망은 한 상인이 처음부터 끝까지 걷는 한 줄 길이 아닙니다" bridge="교역을 물건 한 꾸러미의 여행보다 넓게 봤습니다. 네 흐름으로 구조를 나눕니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">기원전 2천년기 아시리아 상인은 당나귀 대상에 주석과 직물을 싣고 아나톨리아로 갔습니다. 그러나 거래는 물건을 가져가 은을 받는 한 장면으로 끝나지 않았습니다. 가족과 동업자가 자금을 대고, 현지 대리인이 팔고, 점토판이 빚과 상환일을 남겼습니다.</p>
          <p className="leading-8">먼 거리의 교역이 커지려면 물건뿐 아니라 대금, 정보, 위험이 서로 다른 길과 시간으로 움직여야 합니다. 이 글은 실제 은 6미나 대출 기록에서 시작해 신용과 중개가 왜 필요했는지 보고, 이를 훗날 ‘실크로드’라고 부른 여러 육상·해상 망과 비교합니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="black-box" level="B" title="2. 물건·대금·정보·위험의 네 흐름을 나눕니다" bridge="한 번의 거래 안에 속도가 다른 네 흐름이 있음을 확인했습니다. 은 6미나의 상환 약속으로 내려갑니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">주석과 직물은 대상과 배를 타고 움직입니다. 은과 금은 반대편으로 돌아오거나 다른 거래의 대금으로 쓰입니다. 가격·분쟁·통행 상황은 편지와 소문으로 늦게 전달됩니다. 도난·질병·전쟁·환율 변화의 손실은 투자자, 운송인, 상인 사이에 나뉩니다.</p>
          <p className="leading-8">네 흐름의 시점이 다르기 때문에 현금으로 즉시 맞바꾸는 거래만으로는 긴 거리를 버티기 어렵습니다. 먼저 물건을 넘기고 나중에 갚는 신용, 다른 도시에서 대신 행동하는 대리인, 무게와 순도를 비교하는 표준이 필요해집니다.</p>
        </div>
        <FlowRail title="먼 거래의 네 흐름" steps={[
          { actor: "출발지의 가족·투자자", movement: "직물·주석과 자금을 맡기고 편지를 보냅니다.", receives: "미래의 은 청구권" },
          { actor: "대상과 중개 도시", movement: "물건을 나눠 옮기고 통행료·위험을 감당합니다.", receives: "운송료와 정보" },
          { actor: "현지 상인·구매자", movement: "물건을 팔고 은으로 결제하거나 빚을 기록합니다.", receives: "상품과 상환 일정" },
        ]} />
      </LessonSection>

      <LessonSection id="case" level="0" title="3. 은 6미나 대출과 두 번의 상환을 따라갑니다" bridge="빚의 양과 시간을 두 칸으로 나눴습니다. 실물과 청구권이 서로 다른 속도로 움직이는 모습을 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">기원전 20~19세기 무렵 카네시 출토로 추정되는 점토판 하나는 두 사람이 상인 아슈르이디에게 은 6미나, 약 3kg을 빚졌다고 적습니다. 그중 3분의 1은 다음 수확 때, 나머지는 뒤에 갚도록 했습니다. 6미나를 단순히 나누면 첫 상환 2미나, 뒤 상환 4미나입니다.</p>
          <p className="leading-8">이 기록은 오늘날 은행 대출 계약과 같지 않습니다. 다만 기한까지 갚지 못하면 달마다 이자가 붙는다는 조항과 증인 명단은 이미 들어 있었습니다(8절). 그래도 누가 누구에게 얼마를 언제 갚는지, 한 번에 갚지 못하는 시간을 어떻게 약속으로 바꿨는지 보여 줍니다. 수확 시점은 채무자의 현금 흐름과 상환일을 연결합니다.</p>
        </div>
        <NumericPath title="6미나를 시간으로 나눈 약속" steps={[
          { label: "전체 채무", value: "6미나", detail: "약 3kg의 은" },
          { label: "다음 수확", value: "2미나", detail: "전체의 3분의 1" },
          { label: "나중 상환", value: "4미나", detail: "남은 3분의 2" },
        ]} />
      </LessonSection>

      <LessonSection id="picture" level="1" title="4. 실물 이동과 장부의 약속이 다른 속도로 움직입니다" bridge="물건이 이미 소비된 뒤에도 청구권이 남는 구조를 확인했습니다. 거리와 시간이 만드는 필요를 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">직물은 이미 팔리고 주석은 다른 물건으로 가공될 수 있습니다. 그래도 점토판에는 은 6미나의 의무가 남습니다. 실물의 위치와 소유가 바뀌어도 장부의 청구권은 상환일까지 이어집니다.</p>
          <p className="leading-8">이 분리는 거래를 늘리지만 분쟁도 만듭니다. 빚진 사람이 죽거나 수확이 실패하거나 점토판 봉인이 깨졌을 때 누가 손실을 지는지 정해야 합니다. 기록, 증인, 법정, 평판은 물건을 직접 보고 있지 않아도 약속을 집행하는 장치입니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="need" level="2" title="5. 거리와 시간이 길어질수록 신용과 중개가 필요해집니다" bridge="현금이 도착할 때까지 생산과 이동을 멈추지 않는 장치를 확인했습니다. 네 역할에 이름을 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">왕복에 여러 달이 걸리면 출발지 투자자는 결과를 기다리는 동안 다른 지출을 해야 합니다. 현지 상인도 상품이 팔리기 전에 운송비와 세금을 냅니다. 신용은 미래의 대금을 현재의 이동과 생산에 연결합니다.</p>
          <p className="leading-8">중개인은 단순히 값을 올려 받는 사람이 아닙니다. 언어, 품질, 통행권, 현지 구매자를 알고 묶음의 크기를 바꿉니다. 다만 정보 우위로 거래 조건을 숨기거나 정치 권력과 결합해 독점할 수도 있습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="names" level="3" title="6. 중개·신용·결제·표준화에 이름을 붙입니다" bridge="먼 거래를 가능하게 하는 기능을 구분했습니다. 6미나가 여러 상품과 약속을 거쳐 돌아오는 길을 추적합니다.">
        <TermBreakdown title="장거리 교역을 잇는 네 장치" items={[
          { term: "상업 중개", description: "서로 직접 만나기 어려운 생산자·운송인·구매자의 거래를 연결하는 일입니다.", example: "아슈르와 카네시 사이에서 물건과 편지를 맡습니다.", boundary: "중개가 언제나 경쟁적이거나 공정하다는 뜻은 아닙니다." },
          { term: "상업 신용", description: "상품이나 자금을 먼저 넘기고 정한 때에 대금을 받는 약속입니다.", example: "은 6미나를 두 시점에 갚습니다.", boundary: "현대 은행의 예금 창출과 같은 제도라고 볼 수 없습니다." },
          { term: "결제", description: "거래에서 생긴 지급 의무를 실제 자산 이전으로 끝내는 과정입니다.", example: "점토판의 은 청구권을 실제 은으로 갚습니다.", boundary: "판매 계약이 생긴 순간과 최종 지급이 끝난 순간은 다를 수 있습니다." },
          { term: "표준화", description: "낯선 거래자도 양·무게·순도·단위를 비교할 수 있게 기준을 맞추는 일입니다.", example: "미나라는 무게 단위로 은 채무를 기록합니다.", boundary: "같은 이름의 단위도 시대와 지역에 따라 값이 달라질 수 있습니다." },
        ]} />
      </LessonSection>

      <LessonSection id="mechanism" level="4" title="7. 6미나가 주석·직물·은으로 돌아오는 경로를 추적합니다" bridge="상품 이익보다 먼저 자금·시간·위험의 분배를 봤습니다. 실제 점토판의 물성과 문구를 확인합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">출발지의 가족이 직물과 주석을 제공하고 상인이 이를 카네시에서 팝니다. 구매자가 즉시 은을 다 내지 못하면 6미나 채무가 생깁니다. 다음 수확에서 2미나가 들어오고, 남은 4미나는 뒤 거래나 수확에서 결제됩니다.</p>
          <p className="leading-8">첫 상환이 늦어지면 상인은 귀환 대금을 마련하지 못하고 투자자도 다음 대상을 꾸리기 어렵습니다. 따라서 수익률만큼 상환 순서와 현금 시점이 중요합니다. 한 채무자의 실패가 동업자와 다음 거래로 번질 수 있습니다.</p>
          <p className="leading-8">반대로 여러 상인과 도시를 쓰면 한 길의 폐쇄를 우회할 수 있습니다. 교역망은 위험을 없애지 않고 누구에게, 어느 시점에 남길지 바꾸는 구조입니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="source" level="5" title="8. 기원전 20~19세기 은 대출 점토판을 읽습니다" bridge="한 계약이 장거리 교역의 신용과 가족망을 보여 주는 범위를 확인했습니다. 더 넓은 교역망과 비교합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">메트로폴리탄 미술관의 점토판은 카네시(오늘날 튀르키예의 퀼테페) 출토로 추정됩니다. 발굴 기록 없이 1966년에 기증된 유물이라 미술관도 출토지를 'probably'로만 적습니다. 점토판은 은 채무의 양과 두 상환 시점을 기록하고, 그 시점까지 갚지 못하면 월 단위 이자가 붙는다고 정합니다. 증인 이름도 본문에 적혀 있고, 증인들의 인장은 점토판을 감쌌던 점토 봉투(접근번호 66.245.17b)에 찍혀 있습니다. 4절에서 말한 기록·증인·평판이라는 집행 장치가 이 한 점의 유물 안에 함께 들어 있는 셈입니다. 같은 지역의 편지와 계약은 아슈르 상인들이 당나귀 대상으로 주석과 직물을 가져와 금·은과 바꾸고 가족·동업자와 거래를 관리했음을 보여 줍니다.</p>
          <p className="leading-8">다만 이자 조항이 있다는 사실과 이자율이 얼마였는지는 다른 문제입니다. 점토판 하나는 당시 모든 거래의 평균 이자율이나 사회 전체의 신용 접근성을 말해 주지 않습니다. 특정 상인 관계의 실재와 기록 방식을 보여 주는 1차 물증으로 쓰고, 시장 규모는 여러 문서와 발굴 맥락으로 확인해야 합니다.</p>
        </div>
        <SourceApplication source="The Met · Cuneiform tablet: loan of silver" excerpt="6 minas ... one third ... by the next harvest" application="전체 6미나를 2미나와 4미나로 나누면 상품 판매와 수확의 시간에 맞춘 단계 상환을 눈으로 볼 수 있습니다." />
        <CitationBlock source="The Metropolitan Museum of Art, Cuneiform tablet: loan of silver" citeKey={1} href="https://www.metmuseum.org/art/collection/search/325858">점토판의 연대·추정 출토지·채무량·상환 일정·연체 이자 조항·증인 봉투(66.245.17b)와 아시리아 상인망의 배경을 제공하는 소장품 기록입니다. 출토지는 미술관 기록상 'probably from Kültepe (Karum Kanesh)'이고 1966년 기증품입니다(확인일 2026-10-09, 원 페이지는 자동 조회가 차단돼 Met Collection API와 2025-01-21 사본으로 대조).</CitationBlock>
      </LessonSection>

      <LessonSection id="comparison" level="6" title="9. 실크로드는 하나의 도로가 아니라 갈아타는 여러 망이었습니다" bridge="긴 거리의 교역을 단일 출발지와 목적지의 직통 거래로 보지 않았습니다. 이득과 위험의 불균등을 정리합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">오늘날 실크로드라고 부르는 연결은 1,500년 넘게 이어진 육상 길과 해상 항로의 묶음입니다. 비단만이 아니라 면직물, 향신료, 말, 유리, 도자기, 종교, 기술이 여러 중개 도시와 제국의 경계를 거쳤습니다.</p>
          <p className="leading-8">대부분의 상인이 중국에서 지중해까지 전 구간을 직접 간 것은 아닙니다. 물건은 구간마다 소유자와 운송 수단을 바꾸고, 언어와 통화도 달라졌습니다. 그래서 어느 한 제국의 흥망, 통행세, 전쟁, 항구 변화가 전체 망의 경로와 가격을 바꿀 수 있었습니다.</p>
        </div>
        <SourceApplication source="Xinru Liu · The Silk Roads: A Brief History with Documents" excerpt="overland trails and sea lanes" application="한 직선 도로 대신 여러 구간의 상인·도시·해상 항로가 물건과 정보를 넘기는 연결망으로 읽습니다." />
        <CitationBlock source="Xinru Liu, The Silk Roads: A Brief History with Documents (Bedford/St. Martin's, 2012)" citeKey={2} href="https://web.archive.org/web/20241223184033/https://en.unesco.org/silkroad/publications/silk-roads-brief-history-documents">UNESCO 실크로드 프로그램 사이트가 소개한 단행본으로, UNESCO 간행물은 아닙니다. 발췌문은 그 소개 페이지에 실린 출판사 소개 글입니다. 원 주소는 unesco.org/en/silkroads로 301 리다이렉트돼 2024-12-23 사본을 연결했습니다(확인일 2026-10-09).</CitationBlock>
      </LessonSection>

      <LessonSection id="limits" level="7" title="10. 교역의 확대를 모두의 번영으로 곧장 바꾸지 않습니다" bridge="상품·대금·정보·위험이 다른 경로로 움직인다는 틀을 세웠습니다. 아래 질문으로 신용과 교역망의 범위를 다시 확인합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">교역은 새 상품과 지식을 퍼뜨리지만 전염병, 전쟁 자금, 약탈과 노예 거래도 연결할 수 있습니다. 통행료를 걷는 국가와 큰 상인은 이익을 얻고, 운송 노동자와 생산자는 위험을 더 많이 질 수 있습니다.</p>
          <p className="leading-8">동전의 확산도 물물교환이 갑자기 사라진 사건이 아닙니다. 계정 단위, 은괴, 외상, 동전이 함께 쓰였고 지역마다 조합이 달랐습니다. 경제사를 읽을 때 새 수단의 등장과 실제 보급, 누가 쓸 수 있었는지를 나눠야 합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "은 6미나의 상환 일정은 실물과 청구권의 시간이 어떻게 다름을 보여 주나요? (답: 3·4절)",
          "장거리 교역에서 중개인이 제공하는 기능과 가질 수 있는 권력은 무엇인가요? (답: 5·6절)",
          "실크로드를 한 직통 도로로 그리면 어떤 역사적 경로를 놓치나요? (답: 9절)",
        ]} />
      </LessonSection>
    </div>
  );
}
