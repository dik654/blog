import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** teach-system S→B→0…7. 공식 문서 확인 2026-10-04, 사례 수치는 가정. */
export default function HousingLandAndSupplyArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teaching-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">S · 집을 원하는 사람과 입주 가능한 집 사이를 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">주거비가 오르면 더 지으면 되는지 묻게 됩니다. 집을 완성하려면 지을 권리, 돈, 공사와 기반 시설이 모두 준비돼야 합니다. 한 부분이 늦으면 수요가 늘어도 당장 입주할 집은 늘지 않습니다.</p>
          <p className="leading-8">이 글은 한 사업의 판매대금에서 출발해 땅에 얼마를 쓸 수 있는지, 허가와 대출 조건이 바뀌면 그 숫자가 어떻게 달라지는지 추적합니다.</p>
        </div>
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공급을 막는 연결을 볼 질문이 생겼습니다. 큰 경로부터 살핍니다.</p>
      </section>
      <section id="black-box" data-teaching-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">B · 땅의 권리에서 공사와 입주로 이어집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">땅을 사용할 사람이 지을 수 있는 범위를 확인합니다. 자금을 빌리거나 모은 뒤 공사를 합니다. 입주 조건을 충족하면 집을 넘깁니다. 구매자의 돈은 앞서 투입한 비용과 자금 제공자에게 돌아갑니다.</p>
          <p className="leading-8">집이 완성돼도 일자리와 교통, 물과 전기가 멀면 사람들이 원하는 주거를 충분히 공급한 것은 아닙니다. 건물 수와 살 수 있는 조건을 같이 봅니다.</p>
        </div>
        <NumericPath title="큰 흐름부터 읽기" steps={[{"label": "지을 권리 확인", "value": "1"}, {"label": "자금·공사 준비", "value": "2"}, {"label": "입주하기", "value": "3"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">권리·돈·공사·입주의 순서가 잡혔습니다. 한 사업의 가격을 나눕니다.</p>
      </section>
      <section id="case" data-teaching-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">0 · 판매 10억에서 다른 비용 7억을 빼면 3억이 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">완성한 집의 예상 판매대금을 10억 원으로 놓습니다(가정). 공사 5억 원, 금융·허가·관련 비용 1억 원, 사업자가 요구하는 정상 이익 1억 원이 필요하면 토지에 지불할 수 있는 금액은 3억 원입니다. 세금과 시간 차이를 이 합계에 반영했다고 단순화합니다.</p>
          <p className="leading-8">3억은 이미 거래된 땅의 시세가 자동으로 따라오는 숫자가 아닙니다. 예상 판매가와 비용을 받아들일 때 사업자가 감당할 수 있는 최대 토지비를 계산한 값입니다.</p>
        </div>
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">10−7=3의 의미를 정했습니다. 땅을 사는 결정 안을 엽니다.</p>
      </section>
      <section id="picture" data-teaching-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1 · 땅값에 넣기 전에 비용과 필요한 이익을 차감합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">사업자는 집의 예상 수입에서 공사와 자금 조달 비용, 요구 이익을 먼저 덜어 냅니다. 땅 주인이 4억 원을 요구하면 이 가정의 3억과 1억 차이가 납니다. 공사비를 낮추거나 가격 전망을 바꾸지 못하면 거래가 성립하기 어렵습니다.</p>
        </div>
        <NumericPath title="(가정) 판매대금에서 토지에 남길 금액 계산" steps={[{"label": "예상 판매", "value": "10억 원"}, {"label": "비용·정상 이익", "value": "−7억 원"}, {"label": "토지에 남는 금액", "value": "3억 원"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">계산한 토지비와 매도자의 요구가 다를 수 있습니다. 왜 권리와 시간이 가격에 들어가는지 봅니다.</p>
      </section>
      <section id="need" data-teaching-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2 · 더 지을 권리와 기다리는 기간이 현금을 바꿉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">같은 땅이라도 허용되는 높이와 세대 수가 달라지면 판매할 수 있는 집의 수가 바뀝니다. 더 지을 수 있어도 도로와 상하수도 보강, 학교나 공원 부담이 함께 늘 수 있습니다.</p>
          <p className="leading-8">허가를 기다리는 동안 돈을 빌려 두었다면 이자와 관리비를 계속 냅니다. 공급을 늘리는 규칙 변경은 언제 입주로 이어지는지까지 확인해야 합니다.</p>
        </div>
        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">권리와 시간이 비용을 바꾸는 이유를 알았습니다. 계산과 제도의 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teaching-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3 · 잔여가치·허가 지연·주거비 부담을 구분합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">판매가치에서 사업 비용과 정상 이익을 빼 토지에 남는 금액을 주택 토지 잔여가치라고 부릅니다. 앞의 3억 원이 이 값입니다.</p>
          <p className="leading-8">권리 확인과 인허가, 기반 시설, 시공 때문에 수요 증가가 입주로 이어지는 데 걸리는 시간이 공급의 허가 시간입니다. 허가 건수가 늘었다는 통계와 완공 물량은 다릅니다.</p>
          <p className="leading-8">가구가 실제 감당하는 주거비는 매매가나 월세 외에도 대출 이자, 관리비, 교통비에 걸칩니다. 주거비 부담의 분배를 보려면 가구 소득과 거주 권리도 함께 봅니다.</p>
        </div>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">사업자 계산과 가구 부담을 구별했습니다. 같은 10억 사업에 지연을 넣습니다.</p>
      </section>
      <section id="mechanism" data-teaching-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4 · 지연으로 비용이 5천만 원 늘면 토지 여유는 줄어듭니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">처음 판매 10억 원, 토지 외 비용·정상 이익 7억 원을 고정합니다. 허가나 공사 지연으로 금융·관리 비용이 5천만 원 늘면 토지에 남는 금액은 2억5천만 원입니다(가정). 토지를 아직 안 샀다면 제안 가격을 낮출 수 있습니다.</p>
          <p className="leading-8">이미 토지비 3억 원을 지급했다면 땅값을 소급해 줄일 수 없습니다. 판매가나 다른 비용이 그대로라면 요구했던 이익 1억 원 중 5천만 원을 잃습니다. 토지 거래 전 계산과 거래 후 손익은 다른 결정을 만듭니다.</p>
          <p className="leading-8">판매 예상이 10억에서 9억으로 줄면 원래 조건에서도 토지 잔여가치는 2억입니다. 가격과 비용의 작은 변화가 마지막에 남는 토지 금액에는 큰 비율로 나타납니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">3억이 2억5천만 원으로 줄어드는 경로를 계산했습니다. 공식 평가 원칙과 연결합니다.</p>
      </section>
      <section id="source" data-teaching-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 · 개발 평가 원문은 정상 이익까지 비용에 넣습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">RICS의 개발 부동산 평가 전문 표준(professional standard)은 완성 가치에서 개발 비용을 뺄 때 사업자의 이익도 그 비용에 포함합니다. 사례의 7억 원에는 공사 5억 원, 금융·허가 등 1억 원, 정상 이익 1억 원이 이미 들어 있습니다.</p>
          <p className="leading-8">우리 사례에서 3억의 토지 잔여가치는 예상 수입과 비용을 놓고 계산한 결과입니다. 그것만으로 기존 주민의 편익이나 나라 전체의 순이익을 확정하지 못합니다.</p>
        </div>
        <SourceApplication source="RICS Valuation of development property · 6.1.1, p.24" excerpt="including profit" application="10억에서 정상 이익 1억을 이미 포함한 7억을 빼면 3억입니다. 정상 이익을 다시 한 번 빼지 않습니다. 일반 개발사업의 유도는 토지개발 글에서 이어집니다." />
        <CitationBlock source="RICS Valuation of development property · 6.1.1, p.24" citeKey={1} href="https://www.rics.org/content/dam/ricsglobal/documents/to-be-sorted/valuation-of-development-property---first-edition.pdf">개발 비용에 정상 이익을 포함하는 RICS 잔여 평가 설명입니다. 링크한 PDF는 2019년 10월 guidance note 1판(2020-02-01 발효)이고 인용문과 24쪽은 이 판 기준입니다. 2026-10-09 확인한 <a className="text-sky-700 underline dark:text-sky-300" href="https://www.rics.org/profession-standards/rics-standards-and-guidance/sector-standards/valuation-standards/valuation-of-development-property">RICS 현행 페이지</a>는 같은 문서를 Professional Standard로 분류하며 내용은 같습니다.</CitationBlock>
        <p className="mt-4 leading-8"><Link className="text-sky-700 underline dark:text-sky-300" to="/economics/property/land-development-residual#mechanism">토지개발의 잔여가치 계산</Link>에서는 같은 원리로 여러 자금 제공자와 인허가 비용을 더 자세히 추적합니다.</p>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">사업 가치와 사회적 편익을 분리했습니다. 나라별 소유권의 기간도 확인합니다.</p>
      </section>
      <section id="comparison" data-teaching-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6 · 싱가포르의 기간 있는 소유권을 영구 소유와 구분합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">싱가포르 정부는 일반적인 새 HDB 주택의 구매자가 99년 동안 주택 권리를 소유한다고 설명합니다. 이것은 거주할 때마다 임대료를 내는 단순 임차와 다릅니다. 기간이 없는 소유권과도 다릅니다.</p>
          <p className="leading-8">10억이라는 같은 판매금액을 비교하더라도 남은 기간과 처분 조건이 다르면 같은 권리를 산 것이 아닙니다. 이 글의 10억 가정에 HDB의 실제 가격이나 거래 자격을 대입한 것은 아닙니다.</p>
          <p className="leading-8">같은 99년 권리 안에서도 처분 조건이 갈립니다. 위 정부 설명은 &ldquo;2023년 3월 기준&rdquo;으로 쓰였고, 그 뒤 2024년 10월 분양분부터 HDB는 새 주택을 Standard·Plus·Prime으로 나눴습니다. 보도에 따르면 Plus·Prime 주택은 최소 거주 기간이 10년이고 되팔 때 받은 보조금 일부를 환수당하며, 최소 거주 기간이 지나도 집 전체를 임대할 수 없습니다.</p>
          <p className="leading-8">같은 99년 주택이라도 10년을 살아야 팔 수 있고 팔 때 보조금 일부를 돌려줘야 한다면, 같은 값을 주고 산 권리의 내용이 달라집니다. 이 유형 규칙은 HDB 공식 페이지가 2026-10-09 자동 조회를 막아(403) 보조 출처(EdgeProp 2024년 보도)로만 확인했습니다.</p>
          <p className="leading-8">2026-10-04 확인 기준으로 다른 나라 주택은 등기·토지 임차권·용도 규정·대출 계약을 각각 확인해야 합니다. 국가 평균 자가보유율 하나로 권리의 내용까지 같다고 볼 수 없습니다.</p>
        </div>
        <SourceApplication source="Singapore Government · Do HDB flat buyers own their flat?" excerpt="own the rights to their flats for 99 years" application="같은 10억이라도 기간이 정해진 권리인지 먼저 확인합니다. 사례의 3억 토지 여력 계산에는 판매하는 권리의 기간과 조건이 이미 반영돼야 합니다." />
        <CitationBlock source="Singapore Government · Do HDB flat buyers own their flat?" citeKey={2} href="https://www.gov.sg/explainers/do-hdb-flat-buyers-own-their-flat/">싱가포르 HDB 권리의 기간에 대한 정부 설명. 페이지에 &ldquo;accurate as of March 2023&rdquo;로 적힌 설명을 2026-10-04 재확인했으며, 2024년 10월 도입된 Standard·Plus·Prime 구분보다 앞선 자료입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">집의 가격과 소유권의 기간을 구분했습니다. 공급 증가가 해결하지 못하는 경계를 봅니다.</p>
      </section>
      <section id="limits" data-teaching-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7 · 새 집 수와 현재 가구의 거주 안정은 다른 결과입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">새 공급이 늘어도 소득이 낮은 가구가 보증금이나 대출 조건을 충족하지 못할 수 있습니다. 기존 임차인의 이주 비용과 일자리에서 멀어지는 비용도 남습니다.</p>
          <p className="leading-8">반대로 공급을 제한한 채 구매 보조만 늘리면 지을 수 있는 양이 짧은 기간에 늘지 않아 가격에 일부 반영될 수 있습니다. 얼마나 반영되는지는 지역 수요와 공급 조건을 따로 확인해야 합니다.</p>
          <p className="leading-8">실제 선택에서는 거래가, 신규 허가·착공·입주, 공실과 월세, 가구 소득과 대출 부담을 시간순으로 읽습니다. 10억의 사업 계산으로 모든 가구의 살림을 대신 판단할 수 없습니다.</p>
        </div>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">토지 계산과 가구의 생활 조건이 연결됐습니다. 비용과 권리의 변화를 예측해 봅니다.</p>
        <ReviewPrompts questions={["이미 땅에 3억 원을 냈는데 지연 비용이 5천만 원 늘면 누구의 여유가 줄어들까요? (답: 4절)", "가격이 같은 집 두 채의 남은 소유 기간이 다르면 같은 자산으로 비교해도 될까요? (답: 6절)"]} />
      </section>
    </div>
  );
}
