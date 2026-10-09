import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function GoldStandardDepressionBrettonWoodsArticle() {
  return (
    <div className="space-y-16">
      <LessonSection id="overview" level="S" title="1. 금에서 달러로 기준이 바뀌어도 조정 문제는 남았습니다" bridge="제도의 이름보다 국제 지급이 막힐 때 누가 무엇을 바꾸는지 묻기로 했습니다. 세 제도의 큰 흐름을 연결합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">환율을 고정하면 수출입 계약의 계산은 쉬워집니다. 그러나 국외로 지급할 돈이 들어오는 돈보다 많아지면 약속을 지킬 준비자산이 줄어듭니다. 환율을 못 바꾸는 동안 임금·물가·금리·수입·고용 가운데 다른 것이 움직여야 합니다.</p>
          <p className="leading-8">이 글은 1870~1880년대의 고전적 금본위제, 1930년대 붕괴, 1944년 브레턴우즈 회의와 1970년대 초 전환을 시간순으로 잇습니다. 모든 나라가 같은 날 들어오고 나간 것이 아니므로 연대는 주요 제도의 범위를 가리키며 국가별 경로는 따로 확인합니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="black-box" level="B" title="2. 환율 약속·준비자산·국내 조정·국제 지원을 연결합니다" bridge="국제 결제의 약속과 국내 경제가 만나는 고리를 그렸습니다. 준비자산 100단위의 작은 사례로 압박을 계산합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">정부나 중앙은행은 자국 통화를 금 또는 기준 통화와 정한 비율로 바꾸겠다고 약속합니다. 민간의 수출입과 자본 이동이 국외 지급 수요를 만들고, 지급이 유입보다 크면 준비자산이 줄어듭니다. 약속을 유지하려면 금리를 올리거나 국내 지출과 수입을 줄이는 조정이 일어날 수 있습니다.</p>
          <p className="leading-8">국제 지원 장치가 있으면 일시적 부족을 빌려 메울 수 있습니다. 환율을 바꿀 수 있으면 상품과 자산의 상대 가격을 한 번에 고칠 수 있습니다. 자본 이동을 제한하면 준비자산이 빠져나가는 속도를 늦출 수 있습니다. 제도는 이 선택지 가운데 무엇을 허용하고 누구의 동의를 요구하는지 정합니다.</p>
        </div>
        <FlowRail title="국외 지급 부족이 국내 조정으로 돌아오는 길" steps={[
          { actor: "무역과 자본 이동", movement: "외화로 받을 돈과 지급할 돈의 차이를 만듭니다.", receives: "국제수지 압력" },
          { actor: "중앙은행과 준비자산", movement: "정한 환율로 금·외화를 내주거나 사들입니다.", receives: "준비자산의 증가·감소" },
          { actor: "국내 경제와 국제기구", movement: "금리·지출·환율·통제·대출 중 허용된 수단으로 조정합니다.", receives: "고용·물가·교역의 변화" },
        ]} />
      </LessonSection>

      <LessonSection id="case" level="0" title="3. 금 100단위와 국외 지급 20단위의 압박을 계산합니다" bridge="한 해의 적자가 준비자산 비율을 어떻게 바꾸는지 고정했습니다. 고정된 값과 움직일 수 있는 값을 나눕니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">한 나라가 금 준비자산 100단위를 가지고 자국 통화 500단위를 발행했다고 합시다. 통화 5단위를 금 1단위로 바꿔 준다는 약속입니다. 올해 국외 수입·이자 지급이 수출·소득 유입보다 금 20단위만큼 많고 새 차입이 없다면 준비자산은 80으로 줄어듭니다.</p>
          <p className="leading-8">통화량이 그대로 500이면 금 1단위당 통화가 5에서 6.25로 늘어나 약속의 여유가 줄어듭니다. 같은 20단위 유출이 한 번 더 생기면 금은 60입니다. 이 숫자는 조정 구조를 보여 주는 가정이며 실제 금본위제가 언제나 고정 준비율로 움직였다는 뜻은 아닙니다.</p>
        </div>
        <NumericPath title="고정 교환 약속 아래 준비자산이 줄어드는 가정" steps={[
          { label: "처음 금", value: "100", detail: "통화 500, 약속 5:1" },
          { label: "국외 순지급", value: "20", detail: "새 차입이 없다고 가정" },
          { label: "남은 금", value: "80", detail: "통화가 그대로면 여유 축소" },
        ]} />
      </LessonSection>

      <LessonSection id="picture" level="1" title="4. 바꿀 수 없는 값과 움직일 수 있는 값을 나눕니다" bridge="고정환율이 다른 조정 변수의 부담을 키우는 구조를 보았습니다. 왜 평시의 장점이 위기의 제약이 되는지 살펴봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">금 1과 통화 5의 교환 비율을 고정하면 그 가격은 움직일 수 없습니다. 그러면 국외 지급 20을 줄이기 위해 수입 수요, 국내 신용, 임금과 물가, 자본 이동이나 외국 차입이 움직여야 합니다. 정책이 어느 변수를 먼저 움직이게 하는지가 비용의 위치를 정합니다.</p>
          <p className="leading-8">평시에는 고정된 기준이 장기 계약의 환율 불확실성을 줄일 수 있습니다. 위기에는 사람들이 동시에 금이나 기준 통화로 바꾸려 하면 준비자산이 더 빨리 줄고, 약속을 지키려는 긴축이 생산과 고용을 더 낮출 수 있습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="need" level="2" title="5. 고정은 불확실성을 줄이지만 위기의 출구도 좁힙니다" bridge="신뢰를 주는 장치와 조정을 막는 제약이 같은 약속에서 나옴을 확인했습니다. 역사적 제도의 이름을 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">환율을 언제든 바꿀 수 있다면 국외 계약자는 손실을 걱정해 더 높은 가격을 요구할 수 있습니다. 반대로 절대로 바꾸지 않겠다는 약속은 국내 실업이 커져도 금리와 지출을 방어에 맞추게 할 수 있습니다. 신뢰가 강할수록 정책의 다른 선택지는 좁아질 수 있습니다.</p>
          <p className="leading-8">브레턴우즈의 설계자들은 전간기의 경쟁적 평가절하와 지급 제한을 피하면서도, 일시적 부족을 국제 지원으로 넘기고 지속적인 불균형에는 환율 조정을 허용하려 했습니다. 고정과 변동 사이에 조정 가능한 약속을 둔 이유입니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="names" level="3" title="6. 금본위제·평가절하·자본통제·브레턴우즈에 이름을 붙입니다" bridge="기준 자산, 환율 변경, 이동 제한, 국제 지원이 서로 다른 수단임을 나눴습니다. 같은 20단위 적자를 세 제도에 넣어봅니다.">
        <TermBreakdown title="국제 통화 질서를 읽는 네 이름" items={[
          { term: "금본위제", description: "통화 가치를 일정한 금의 양에 연결하고 정한 비율의 교환을 약속하는 제도입니다.", example: "통화 5를 금 1로 바꿉니다.", boundary: "국가별 교환 범위·준비율·가입과 이탈 시기는 달랐습니다." },
          { term: "평가절하", description: "고정환율에서 자국 통화의 공식 가치를 낮추는 결정입니다.", example: "금 1에 통화 5가 아니라 6.25를 주도록 바꿉니다.", boundary: "시장 변동으로 값이 떨어지는 것과 공식 비율을 바꾸는 것을 구분합니다." },
          { term: "자본통제", description: "국경을 넘는 금융자산의 구입·이전·환전을 제한하는 규칙입니다.", example: "금으로 바꾸어 국외로 보내는 속도를 늦춥니다.", boundary: "상품 무역 제한과 같지 않으며 우회·집행 비용이 생깁니다." },
          { term: "브레턴우즈 체제", description: "달러를 금에 연결하고 다른 통화를 달러에 조정 가능한 고정 비율로 묶은 전후 체제입니다.", example: "일시적 부족에는 IMF 지원, 지속적 불균형에는 비율 조정을 둡니다.", boundary: "1944년 합의, 실제 가동, 국가별 태환, 1970년대 전환 시점은 구분해야 합니다." },
        ]} />
      </LessonSection>

      <LessonSection id="mechanism" level="4" title="7. 같은 20단위 적자가 세 제도에서 어떻게 처리되는지 봅니다" bridge="적자 크기가 같아도 환율·국제대출·자본 이동 규칙이 비용의 경로를 바꾼다는 점을 추적했습니다. 실제 연표를 확인합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">엄격한 금 교환 약속을 유지하고 새 차입이 없다면 준비자산 100에서 20을 내줍니다. 금리 인상과 신용 축소로 수입과 국내 가격을 낮춰 다음 적자를 줄이려 할 수 있습니다. 조정 비용은 실업과 채무 부담으로 나타날 수 있습니다.</p>
          <p className="leading-8">조정 가능한 고정환율과 국제 지원 아래에서는 20을 일시적으로 빌려 준비자산 감소를 늦출 수 있습니다. 문제가 한 해의 충격이 아니라 계속되는 가격 차이라면 공식 비율을 바꿀 수 있습니다. 대신 지원 조건과 다른 나라의 동의가 정책 범위를 정합니다.</p>
          <p className="leading-8">변동환율에서는 외화 수요가 늘며 자국 통화 가격이 내려갈 수 있습니다. 수입은 비싸지고 수출은 싸져 적자를 줄이는 방향이 생기지만, 외화 부채와 수입 물가가 즉시 부담이 됩니다. 어느 체제도 20의 실물 자원 차이를 공짜로 없애지 않습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="source" level="5" title="8. 1870년대부터 1930년대 붕괴까지의 순서를 확인합니다" bridge="금본위제의 성립·전쟁 뒤 복원·대공황기 붕괴를 한 단계로 뭉개지 않고 나눴습니다. 1944년의 새 설계가 고친 부분을 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">IMF의 국제 통화 체제 역사 자료는 주요 통화가 1870~1880년대에 금본위제로 옮겨 갔고, 제1차 세계대전까지 체제가 이어졌다고 정리합니다. 전쟁 뒤에는 수정된 형태로 복원됐지만 전후 디플레이션과 대공황기의 경제·정치 압력을 견디지 못하고 1930년대에 무너졌습니다.</p>
          <p className="leading-8">이 연표는 모든 나라가 같은 제도에 같은 기간 참여했다는 뜻이 아닙니다. 영국은 1925년 4월 말 금본위로 돌아갔다가 1931년 9월 금 교환을 중단했고, 미국은 1933년 4월 20일 루스벨트 대통령의 포고로 금본위를 공식 정지했습니다. 금 블록 국가들의 시점은 또 달랐고, 원자재 수출국은 가격 급락과 지급 압력을 먼저 겪기도 했습니다.</p>
          <p className="leading-8">이탈 시점이 왜 중요한지는 4절의 장부로 읽을 수 있습니다. 금 교환을 지키는 동안에는 준비자산 유출을 국내 긴축으로 막아야 했고, 이탈한 나라는 그 제약에서 먼저 벗어났습니다.</p>
          <p className="leading-8">나라별 이탈 시점과 경기 회복의 관계를 비교한 대표 연구가 Barry Eichengreen과 Jeffrey Sachs의 「1930년대의 환율과 경기 회복(Exchange Rates and Economic Recovery in the 1930s)」(Journal of Economic History 45(4), 1985)입니다. 초록에 따르면 이 연구는 1930년대의 통화 절하가 먼저 시작한 나라에 이득이 됐음을 보이고, 개별 절하가 이웃에 준 영향은 부정적이었지만 여러 나라가 함께 절하했다면 서로에게 이득이 될 수 있었다고 봅니다. 이 글은 초록만 확인했고 나라별 추정치는 옮기지 않았습니다.</p>
        </div>
        <SourceApplication source="IMF · Reserve Accumulation and International Monetary Stability" excerpt="collapse in the 1930s" application="준비자산 20의 유출을 국내 긴축만으로 막으려는 약속은 여러 나라가 동시에 침체를 겪을 때 정치적으로 유지하기 더 어려워집니다." />
        <CitationBlock source="International Monetary Fund, 2010 supplementary information" citeKey={1} href="https://www.elibrary.imf.org/view/journals/007/2010/034/article-A001-en.xml">금본위제에서 브레턴우즈와 1970년대 변동환율까지의 큰 연표와 조정 방식을 확인했습니다. 영국의 1925~31년 금본위 기간은 잉글랜드은행 계간지(1970년 1분기)의 금·외환 보유 기록에서, 미국의 1933년 4월 20일 정지는 연방준비제도 역사 자료의 'Roosevelt's Gold Program'에서 따로 확인했습니다(확인일 2026-10-09).</CitationBlock>
      </LessonSection>

      <LessonSection id="comparison" level="6" title="9. 1944년의 조정 가능한 고정환율이 무엇을 바꿨는지 봅니다" bridge="브레턴우즈가 고정환율을 그대로 복원하지 않고 대출·조정·자본 이동의 여지를 둔 이유를 확인했습니다. 국가별 차이와 후속 붕괴의 범위를 정리합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">1944년 44개국 대표는 전간기의 초인플레이션과 디플레이션, 금본위제 붕괴, 경쟁적 평가절하와 무역 제한을 겪은 뒤 새 체제를 설계했습니다. 달러를 금에 연결하고 다른 통화는 달러에 고정하되, 지속적인 국제수지 문제에는 비율을 조정할 수 있게 했습니다.</p>
          <p className="leading-8">IMF는 일시적인 지급 부족에 자금을 제공하는 장치였습니다. 자본 이동을 넓게 자유화하는 오늘의 질서와도 달랐습니다. 국내 고용과 사회정책을 위한 여지를 지키면서 교역의 환율 기준을 제공하려는 절충이었습니다.</p>
          <p className="leading-8">그러나 달러 준비자산을 세계에 공급하려면 미국이 달러를 국외로 내보내야 했고, 국외 달러가 금 보유에 비해 커질수록 금 교환 약속의 신뢰가 약해졌습니다. 1971년 8월 15일 닉슨 대통령이 '금 창구'를 닫아 달러의 금 교환을 중단한 일과, 1973년 3월 서독을 비롯한 주요 통화가 변동환율로 옮겨 간 일은 이 체제의 끝을 이루는 서로 다른 사건입니다.</p>
        </div>
        <SourceApplication source="IMF · Measure to Measure" excerpt="delegates of 44 nations gathered" application="한 나라의 준비자산 20 문제를 개별 긴축에만 맡기지 않고 국제 대출과 합의된 환율 조정의 문제로 옮겼습니다." />
        <CitationBlock source="Atish Rex Ghosh, Measure to Measure, Finance & Development 2014" citeKey={2} href="https://www.imf.org/external/pubs/ft/fandd/2014/09/ghosh.htm">브레턴우즈 회의의 문제의식, 조정 가능한 환율, IMF의 역할과 이후 체제 변화를 설명합니다. 1971년 8월 15일은 연방준비제도 역사 자료의 'Gold Convertibility Ends'에서, 1973년 3월 변동 전환은 독일 연방은행의 1973년 브레턴우즈 종료 해설에서 따로 확인했습니다(확인일 2026-10-09).</CitationBlock>
      </LessonSection>

      <LessonSection id="limits" level="7" title="10. 국가마다 들어오고 나간 시기와 비용은 달랐습니다" bridge="1870년대부터 1970년대까지를 하나의 세계 경험으로 평평하게 만들지 않을 기준을 세웠습니다. 같은 20단위 사례로 제도 차이를 다시 설명할 수 있습니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">금본위제와 브레턴우즈는 주요 유럽·북미 국가의 제도만으로 세계 전체를 설명할 수 없습니다. 식민지와 원자재 수출국은 통화 선택권, 가격 충격, 제국 통화권과 부채 구조가 달랐습니다. 독립 뒤 새 통화를 만든 나라들도 서로 다른 시기에 자본통제와 고정환율을 사용했습니다.</p>
          <p className="leading-8">또한 금본위제가 대공황의 유일한 원인이라거나 브레턴우즈가 전후 성장을 혼자 만들었다고 말하지 않습니다. 은행 위기, 전쟁 부채, 재정·통화정책, 무역 제한과 정치 연합이 함께 움직였습니다. 국제 통화 체제는 그 충격을 전달하거나 막는 규칙 가운데 하나입니다.</p>
        </div>
        <ReviewPrompts questions={[
          "금 100에서 순지급 20이 나갈 때 환율을 고정하면 어떤 국내 변수들이 대신 움직여야 하나요? (답: 4절)",
          "브레턴우즈는 엄격한 금본위제의 20단위 부족 처리와 무엇이 달랐나요? (답: 7절)",
          "1971년 금 교환 중단과 1970년대 초 변동환율 전환을 구분해야 하는 이유는 무엇인가요? (답: 9절)",
        ]} />
      </LessonSection>
    </div>
  );
}
