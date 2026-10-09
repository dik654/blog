import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function DecolonizationOilShocksAndDebtArticle() {
  return (
    <div className="space-y-16">
      <LessonSection id="overview" level="S" title="1. 국기를 바꾼 날과 경제의 선택지가 바뀐 날은 같지 않습니다" bridge="정치적 독립과 생산 구조의 변화를 다른 시간표로 놓았습니다. 외화 장부의 연결을 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">식민지에서 독립한 국가는 법과 예산을 스스로 정할 권한을 얻습니다. 그러나 수출이 커피·구리 한두 품목에 몰리고 기계·석유·의약품을 외화로 사야 한다면, 세계 가격과 대출 조건은 새 정부의 선택을 계속 좁힙니다.</p>
          <p className="leading-8">이 글은 1945년 이후 탈식민, 개발 투자, 1970년대 석유 충격과 페트로달러 대출, 1980년대 부채 위기를 한 외화 장부로 잇습니다. 모든 신생국이 같은 길을 갔다고 보지 않고 산유국·비산유국과 지역별 정책 차이를 함께 봅니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="black-box" level="B" title="2. 원자재 수출·수입·유가·대출·금리를 연결합니다" bridge="국내 생산과 외화 지급의 제약을 연결했습니다. 수출 100인 작은 나라의 충격을 계산합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">수출은 외화를 벌고 수입과 외채 원리금은 외화를 씁니다. 원자재 가격이 떨어지거나 석유 가격이 오르면 같은 양을 팔아도 기계와 연료를 사기 어려워집니다. 부족분을 빌리면 당장 생산과 소비를 유지할 수 있지만 미래 지급이 늘어납니다.</p>
          <p className="leading-8">빌린 통화도 중요합니다. 달러로 빌렸는데 자국 통화 가치가 떨어지면 국내 세금으로 마련해야 할 금액이 커집니다. 변동금리 대출은 미국 금리 상승이 국내 정책과 상관없이 이자 부담을 올릴 수 있습니다.</p>
        </div>
        <FlowRail title="독립 뒤 외화 제약이 움직이는 경로" steps={[
          { actor: "수출 구조", movement: "원자재 가격과 물량이 외화 수입을 정합니다.", receives: "달러 수입" },
          { actor: "수입과 개발 투자", movement: "석유·기계·의약품에 외화를 지급합니다.", receives: "생산 능력과 생활 재화" },
          { actor: "국제 대출", movement: "당장의 부족을 메우고 미래 이자·환율 위험을 남깁니다.", receives: "현재 자금과 미래 의무" },
        ]} />
      </LessonSection>

      <LessonSection id="case" level="0" title="3. 수출 100과 석유 수입 40인 나라의 외화 장부를 봅니다" bridge="가격 충격이 흑자 10을 적자 30으로 바꾸는 장부를 만들었습니다. 정치적 권한과 지급 능력을 나눕니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">한 나라가 원자재 수출로 외화 100을 벌고, 석유 40과 다른 물품 50을 수입한다고 합시다. 처음 무역수지는 100-(40+50)=10의 흑자입니다. 숫자는 작동 원리를 위한 가정입니다.</p>
          <p className="leading-8">석유 가격이 두 배가 되어 같은 양에 80을 내면 총수입은 130, 무역수지는 -30이 됩니다. 정부는 석유 사용을 줄이거나 수입을 줄이거나 환율을 바꾸거나 30을 빌려야 합니다. 어느 선택도 단기 비용 없이 끝나지 않습니다.</p>
        </div>
        <NumericPath title="석유 가격 충격이 외화 장부를 뒤집습니다" steps={[
          { label: "처음 외화", value: "+10", detail: "수출 100 - 수입 90" },
          { label: "석유 두 배", value: "+40 비용", detail: "석유 40 → 80" },
          { label: "새 부족", value: "-30", detail: "수출 100 - 수입 130" },
        ]} />
      </LessonSection>

      <LessonSection id="picture" level="1" title="4. 정치적 주권과 외화 지급 능력을 다른 축에 놓습니다" bridge="스스로 결정할 권리와 가능한 선택의 비용이 다름을 확인했습니다. 개발 대출이 필요한 이유와 위험을 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">독립 정부는 30의 부족을 어디서 줄일지 스스로 정할 수 있습니다. 이것은 식민 통치와 다른 중요한 변화입니다. 그러나 세계 시장의 유가와 수출 가격, 외화 대출 계약을 혼자 정할 수 있는 것은 아닙니다.</p>
          <p className="leading-8">주권이 제약을 없애지는 않지만, 제약이 있다고 독립의 의미가 사라지는 것도 아닙니다. 누구에게 세금을 걷고 무엇을 보호하며 어떤 산업을 키울지 선택할 권한과, 그 선택을 가능하게 하는 자원 조건을 함께 봐야 합니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="need" level="2" title="5. 개발 투자는 필요했지만 빌린 통화와 금리가 위험을 만들었습니다" bridge="대출의 생산적 용도와 만기·통화 위험을 나눴습니다. 핵심 용어에 이름을 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">전력망·학교·항만·공장을 지으려면 오늘 큰돈이 들고 효과는 나중에 납니다. 국내 저축과 세수만으로 부족할 때 외채는 시간을 당겨 쓸 수 있게 합니다. 투자가 수출과 생산성을 키우면 미래 상환 재원도 생깁니다.</p>
          <p className="leading-8">그러나 수익은 자국 통화로 나고 빚은 달러로 갚거나, 단기 변동금리로 장기 시설을 지으면 만기와 통화가 어긋납니다. 사업이 유익해도 세계 금리와 환율이 급변하면 현금 부족으로 중단될 수 있습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="names" level="3" title="6. 탈식민·교역조건·페트로달러 재순환·외채에 이름을 붙입니다" bridge="정치 변화, 가격 비율, 자금 흐름, 미래 의무를 분리했습니다. 싼 대출이 위기로 바뀌는 계산을 합니다.">
        <TermBreakdown title="독립 뒤 세계 경제를 읽는 네 이름" items={[
          { term: "탈식민", description: "식민 지배를 끝내고 정치적 자결과 독립 국가를 세우는 과정입니다.", example: "1945년 뒤 아시아·아프리카의 많은 영토가 독립합니다.", boundary: "식민 경제 구조와 불평등이 독립일에 모두 사라진다는 뜻은 아닙니다." },
          { term: "교역조건", description: "수출 가격과 수입 가격의 비율로, 같은 수출로 살 수 있는 수입량을 보여 줍니다.", example: "원자재 가격이 그대로인데 석유 가격이 두 배가 됩니다.", boundary: "수출입 물량과 국내 분배를 혼자 보여 주지 않습니다." },
          { term: "페트로달러 재순환", description: "산유국의 늘어난 달러 수입이 국제 은행 예금과 다른 나라 대출로 다시 흐르는 과정입니다.", example: "석유 수입국이 30의 부족을 은행 대출로 메웁니다.", boundary: "공식 원조·직접 투자·채권 투자를 모두 같은 흐름으로 부르지 않습니다." },
          { term: "외채", description: "정부와 국내 조직이 국외 채권자에게 미래 외화 지급을 약속한 빚입니다.", example: "달러 130에 변동 이자를 냅니다.", boundary: "외채 자체가 위기라는 뜻은 아니며 용도·만기·통화·금리가 중요합니다." },
        ]} />
      </LessonSection>

      <LessonSection id="mechanism" level="4" title="7. 싼 대출이 금리 상승 뒤 부채 위기로 바뀌는 경로를 계산합니다" bridge="같은 빚의 이자가 6.5에서 15.6으로 뛰는 경로를 봤습니다. 탈식민과 석유 충격의 실제 순서를 확인합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">처음 외채가 100이고 금리가 5%라면 연 이자는 5입니다. 석유 부족 30을 빌리면 외채는 130, 같은 금리의 이자는 6.5가 됩니다. 수출 100으로 감당할 수 있다고 판단할 수 있습니다.</p>
          <p className="leading-8">이후 국제 금리가 12%(가정)로 오르면 이자는 15.6이 됩니다. 동시에 원자재 수출액이 100에서 80으로 떨어지면 이자/수출 비율은 6.5%에서 19.5%로 세 배가 됩니다. 원금을 갚기 전에도 외화 부족이 커집니다.</p>
          <p className="leading-8">정부가 지출과 수입을 급히 줄이면 국내 경기와 고용이 악화됩니다. 새로 빌려 이자를 내면 만기 위험이 커집니다. 채권자도 대출을 회수하지 못하므로 채무 재조정·긴급 금융·정책 조건이 국제 협상의 대상이 됩니다. 5%와 12%는 설명용 가정이고, 실제 금리가 어디까지 올랐는지와 협상이 어떤 이름으로 진행됐는지는 8절의 연표에서 봅니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="source" level="5" title="8. 1945년 탈식민에서 1970년대 석유 충격까지 순서를 잇습니다" bridge="독립 확대와 세계 가격·금융 충격이 겹친 시간을 확인했습니다. 국가별 차이를 비교합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">유엔이 창설된 1945년에는 약 7억5천만 명이 식민 통치에 의존한 영토에 살았습니다. 1960년 유엔 총회 결의 1514는 식민지 민족의 자결과 독립을 선언했습니다. 정치적 독립이 빠르게 늘어난 시기와 새 국가가 산업·교육·보건 투자를 확대하려던 시기가 겹칩니다.</p>
          <p className="leading-8">1973~74년 석유 가격 급등은 비산유 개발도상국의 외화 부족을 키웠습니다. 산유국 달러가 국제 은행을 거쳐 대출로 재순환되며 당장의 조정을 늦췄지만 외채가 쌓였습니다. 1979년 뒤 두 번째 석유 충격과 높은 세계 금리, 수출 수요 둔화가 상환 조건을 바꿨습니다.</p>
          <p className="leading-8">7절의 '금리 5%→12%' 가정을 실제 사건에 대 보면 순서가 이렇습니다. IMF의 1980년대 부채위기 장에 따르면 국제 은행의 순대출은 1977년 680억 달러에서 1980년 1,600억 달러로 늘었고, 그 가운데 3분의 1 가까이가 비산유 개발도상국으로 갔습니다. 1979년 10월 6일 폴 볼커 의장의 연방준비제도가 통화 긴축으로 방향을 바꿨고, 연방기금금리는 1980년 말 사상 최고인 20%에 이르렀습니다. IMF 장은 미국 금리가 1981년 6월 20%로 정점에 올랐다고 적습니다. 1982년 8월 멕시코 재무장관 헤수스 실바 에르소그가 당시 800억 달러에 이른 외채를 더는 갚을 수 없다고 통보하면서 위기가 본격화했습니다. 채권국의 대응은 1985년 제임스 베이커 미 재무장관의 '베이커 플랜'과 1989년 3월 니컬러스 브래디 재무장관의 '브래디 플랜'으로 이어졌고, IMF와 세계은행은 1996년 최빈 채무국 대상의 과다채무빈곤국(HIPC) 이니셔티브를 시작했습니다. 연도와 금리는 연방준비제도 역사 자료(Fed History의 'Anti-Inflation Measures'·'Latin American Debt Crisis')와 IMF HIPC 안내에서 확인했습니다(확인일 2026-10-09).</p>
        </div>
        <SourceApplication source="United Nations · Decolonization" excerpt="some 750 million people" application="1945년의 정치적 출발점을 확인하되, 독립한 여러 국가의 경제 구조가 같았다고 보지 않습니다." />
        <CitationBlock source="United Nations, Decolonization" citeKey={1} href="https://www.un.org/en/global-issues/decolonization/">1945년 비자치 영토 인구, 1960년 독립 부여 선언과 이후 제도 경로를 정리한 공식 자료입니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="comparison" level="6" title="9. 산유국·비산유국과 지역별 정책 선택은 같은 결과를 내지 않았습니다" bridge="공통 충격과 서로 다른 자원·정책·제도 조건을 나눴습니다. 단일 원인 설명의 한계를 정리합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">석유 수출국은 가격 상승으로 큰 외화 흑자를 얻었지만 국내 흡수 능력, 인구, 정치 제도에 따라 투자 결과가 달랐습니다. 비산유국은 수입비 부담을 받았고, 다른 원자재 가격이 함께 오른 나라는 충격 일부를 상쇄했습니다.</p>
          <p className="leading-8">동아시아 일부 국가는 제조업 수출과 토지·교육 정책을 결합했고, 라틴아메리카 여러 국가는 국제 은행 대출 노출이 컸습니다. 아프리카 국가 안에서도 산유 여부와 전쟁·식민 유산·시장 크기가 달랐습니다. ‘개발도상국’ 평균은 이 차이를 숨길 수 있습니다.</p>
          <p className="leading-8">아래 세 번째 자료의 결론도 같은 방향입니다. 첫 석유 충격(1974)은 표본 국가 가운데 인도네시아와 나이지리아를 뺀 모든 나라의 교역조건을 악화시켰습니다. 그런데도 저자들은 충격의 크기와 이후 위기의 규모 사이에 직접 관계가 없었고, 부채위기를 두 석유 충격의 악영향에 곧바로 돌릴 수 없다고 결론짓습니다. 멕시코와 나이지리아처럼 석유를 수출하는 나라도 부진했고, 1970년대의 과도하고 생산성 낮은 투자를 줄이는 일부 투자 삭감은 필요했다고 봅니다.</p>
        </div>
        <SourceApplication source="IMF · The 1980s Debt Crisis" excerpt="Petro-dollars were ‘recycled’ in the form of loans" application="30의 부족을 대출로 메우는 선택이 1970년대에는 유동성을 주었지만 금리·수출 조건이 바뀐 뒤 같은 계약이 위기의 전달 경로가 됩니다." />
        <CitationBlock source="IMF, Chapter 1: The 1980s Debt Crisis" citeKey={2} href="https://www.elibrary.imf.org/display/book/9781484371329/ch001.xml">브레턴우즈 붕괴, 석유 충격, 국제 은행 대출과 1980년대 위기의 연결을 기관 역사에서 설명합니다.</CitationBlock>
        <CitationBlock source="I. M. D. Little, Richard Cooper, W. Max Corden & Sarath Rajapatirana, Macroeconomic Crisis and Adjustment, Finance & Development 32(1), 1995" citeKey={3} href="https://www.elibrary.imf.org/view/journals/022/0032/001/article-A014-en.xml">IMF 잡지에 실렸지만 내용은 세계은행 비교연구 프로젝트의 요약입니다. 첫 석유 충격의 교역조건 효과, 1970년대 석유 수입의 은행 재순환, 1979년 뒤 변동금리 부담, 그리고 충격 크기와 위기 규모 사이에 직접 관계가 없었다는 결론을 확인했습니다(확인일 2026-10-09).</CitationBlock>
      </LessonSection>

      <LessonSection id="limits" level="7" title="10. 부채 위기를 국내 실책이나 외부 충격 하나로만 설명하지 않습니다" bridge="정치적 권한과 세계 가격·통화·채권 관계를 한 경로에 놓았습니다. 아래 질문으로 외화 장부를 다시 계산합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">부실 사업, 부패, 환율 방어 같은 국내 선택은 실제 영향을 줬습니다. 동시에 식민지 시기의 수출 특화, 국제 은행의 느슨한 대출, 유가, 선진국 금리, 세계 경기와 채무 조정 규칙도 결과를 바꿨습니다. 책임을 하나의 주체에만 놓으면 예방 수단도 좁아집니다.</p>
          <p className="leading-8">외채 130이라는 숫자만으로 지속 가능성을 판정할 수도 없습니다. 수출과 세수, 만기, 고정·변동금리, 빌린 통화, 투자 수익, 채권자 구성과 재조정 제도를 함께 봐야 합니다. 같은 빚도 충격을 흡수할 장치에 따라 다른 경로를 갑니다.</p>
        </div>
        <ReviewPrompts questions={[
          "석유 가격이 두 배가 될 때 처음의 외화 흑자 10은 왜 적자 30으로 바뀌나요? (답: 3절)",
          "외채 130의 금리가 5%에서 12%로 오를 때 이자/수출 비율이 세 배가 되는 조건은 무엇인가요? (답: 7절)",
          "정치적 독립이 중요하면서도 경제 선택의 제약이 바로 사라지지 않는 이유는 무엇인가요? (답: 4·8절)",
        ]} />
      </LessonSection>
    </div>
  );
}
