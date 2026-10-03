import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 어느 나라든 일곱 장부로 읽는 법 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function HowToReadACountryArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">수출 100이라는 숫자만으로 그 나라의 힘을 알 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">A국의 수출이 100이고 수입 중간재가 60이면 국내에 남는 가치가 100이라고 말할 수 없습니다. 외화 부채 30이 있으면 환율과 만기 구조도 봐야 합니다. 정부 적자 5 역시 어느 통화로 누구에게 빌렸는지에 따라 제약이 달라집니다.</p>
          <p className="leading-7">나라를 처음 볼 때 지도와 GDP 순위부터 외우기보다 어떤 계약과 결정권이 사람들의 삶을 묶는지 묻습니다. 같은 질문을 한국, 미국, 유럽 각국, 중국, 일본, 인도, 브라질, 나이지리아 등에 반복할 수 있습니다.</p>
        </div>
        <FlowRail
          title="(가정) A국 수출 100, 수입 중간재 60, 외화 부채 30, 정부 재정 적자 5"
          steps={[
            { actor: "국가·지방정부", movement: "규칙·예산·공공 서비스를 정합니다.", receives: "세입과 정당성" },
            { actor: "가계·기업", movement: "노동·생산·저축·투자를 결정합니다.", receives: "소득과 청구권" },
            { actor: "해외 상대·언론", movement: "무역·자금·정보를 주고받습니다.", receives: "상품·채권·기대" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">수출 100에서 수입 중간재 60을 가르면 국가의 총액과 남는 가치가 달라집니다. 다른 장부도 펼쳐 봅니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">일곱 장의 장부를 만들면 분야가 서로 이어집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">첫 장은 정치와 법입니다. 누가 규칙을 만들고 토지, 기업, 계약의 권리를 집행하는지 적습니다. 둘째는 예산입니다. 세금, 정부 지출, 부채와 지방정부 몫을 확인합니다.</p>
          <p className="leading-7">셋째는 생산입니다. 에너지, 식량, 물, 부품과 노동을 어디서 얻고 어느 공정에 강한지 살핍니다. 넷째는 대외 거래입니다. 무역뿐 아니라 외화 부채의 만기와 투자 흐름을 봅니다.</p>
          <p className="leading-7">다섯째는 생활입니다. 주거, 교육, 의료, 교통의 비용과 접근성을 확인합니다. 여섯째는 정보입니다. 언론, 플랫폼과 통계가 무엇을 보이거나 가리는지 묻습니다. 일곱째는 기대입니다. 사람들과 투자자가 어떤 미래를 믿고 돈과 표를 움직이는지 봅니다. 모든 장에서 결정권자, 비용 부담자와 손실 부담자를 적습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">정치부터 기대까지 일곱 장을 만들었습니다. 나라를 비교할 때 각 숫자의 정의와 시점을 맞춥니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">국가별 수치를 같은 정의와 시점에 맞춰야 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">세계은행 WDI와 IMF 국제수지는 여러 나라의 거시 지표를 비교할 시작점입니다. 하지만 통계의 조사 범위·환율·비공식 경제·가격 수준·행정구역이 다릅니다. 숫자가 같아도 법적 권리와 서비스의 품질은 다를 수 있습니다.</p>
          <p className="leading-7">토지 개발과 임대, 의료, 교육, 기업의 공급망은 지방 규칙의 영향을 크게 받습니다. 유럽연합도 회원국별 법과 공통 규정이 겹칩니다. 미국의 주, 인도의 주, 한국의 지자체를 국가 평균 하나에 숨기지 않습니다.</p>
          <p className="leading-7">비교 대상을 넓힐 때는 동아시아의 한국·일본·중국, 동남아의 베트남·인도네시아, 남아시아의 인도·방글라데시, 유럽의 독일·프랑스·영국, 미주의 미국·멕시코·브라질, 아프리카의 나이지리아·케냐·남아프리카공화국, 중동의 사우디아라비아·이집트, 오세아니아의 호주부터 같은 일곱 질문을 적용해 봅니다. 이는 대표 사례의 출발점입니다. 나머지 국가도 세계은행 국가별 자료와 현지 정부·법령 원문을 같은 방식으로 찾습니다.</p>
          <p className="leading-7">예를 들어 전력 단가를 비교할 때는 전력망 접속 대기와 정전 위험을, 집값을 비교할 때는 토지권리와 도시 내부의 통근 시간을 함께 적습니다. 한 나라가 어느 범주에 속한다고 미리 정하는 대신 지표의 정의, 기준 연도, 해당 도시와 계약을 자료마다 기록합니다.</p>
        </div>
        <SourceApplication source="World Bank · World Development Indicators, DataBank" excerpt="compiled from officially recognized international sources" application="A국의 수출 100·수입 중간재 60·외화 부채 30·정부 적자 5는 설명용 가정입니다. 실제 국가에 적용할 때는 WDI와 IMF의 지표 정의·연도부터 확인해야 합니다." />
        <CitationBlock source="World Bank World Development Indicators" citeKey={1} href="https://databank.worldbank.org/source/world-development-indicators">여러 나라의 인구·생산·생활 지표의 정의와 시계열을 찾는 출발점입니다.</CitationBlock>
        <CitationBlock source="World Bank DataBank 안내" citeKey={2} href="https://databank.worldbank.org/home">WDI가 국제적으로 인정받는 원자료를 모은 지표 체계라는 설명의 원문입니다.</CitationBlock>
        <CitationBlock source="IMF Balance of Payments" citeKey={3} href="https://data.imf.org/Datasets/BOP">대외 거래·금융 흐름의 공식 비교 자료입니다.</CitationBlock>
        <CitationBlock source="World Bank World Development Report 2020" citeKey={4} href="https://www.worldbank.org/en/publication/wdr2020">무역·생산망에서 국가별 역할을 비교하는 공식 보고서입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">WDI가 제공하는 국제 지표도 현지 법과 서비스 품질을 모두 담지는 못합니다. 한 나라의 별명을 반증할 자료를 정합니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">하나의 이야기로 한 나라를 정의하면 변화가 보이지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">기술 강국, 자원 강국, 부채 국가 같은 별명은 일부만 보여줍니다. 새 정부의 정책, 인구 이동, 에너지 가격, 전쟁과 제재, 기술 표준, 사회적 신뢰가 서로 다른 속도로 바뀝니다.</p>
          <p className="leading-7">가설을 쓰기 전 관측 가능한 지표를 정합니다. 예를 들어 외화 위기 가설이면 단기 외채 만기, 외환 보유액, 은행의 외화 자금과 실제 수입 대금을 봅니다. 정치적 주장과 시장가격, 국민의 체감도 서로 다른 자료입니다.</p>
        </div>
        <ReviewPrompts questions={[
          "수출 100 중 수입 중간재가 60이라면 왜 수출 100을 국내에 남는 가치라고 할 수 없을까요? (답: 2절)",
          "어느 나라의 외화 위기 이야기를 검증하려면 어떤 만기·보유액 자료를 먼저 찾을까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
