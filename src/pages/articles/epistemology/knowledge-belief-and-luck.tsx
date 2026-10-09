import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function KnowledgeBeliefAndLuckArticle() {
  return (
    <div className="space-y-16">
      <LessonSection id="overview" level="S" title="1. 정답을 맞혔다는 사실만으로는 안다고 할 수 없습니다" bridge="정답과 지식 사이에 판단 경로가 있다는 질문을 세웠습니다. 그 경로를 네 부분으로 나눕니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">길을 나서며 시계를 봤고 정확히 12시라고 생각했습니다. 실제로도 12시였습니다. 그런데 그 시계가 어제 12시에 멈춘 것이었다면, 정답을 맞힌 사람에게 “시간을 알았다”고 말하기는 어렵습니다.</p>
          <p className="leading-8">이 글은 믿음의 내용만 채점하지 않습니다. 그 믿음이 사실과 어떤 경로로 이어졌는지 봅니다. 러셀이 든 멈춘 시계를 열 개로 늘린 작은 사례로 참·믿음·근거를 모두 갖춘 듯한 판단에 우연이 어떻게 끼어드는지 추적합니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="black-box" level="B" title="2. 믿음·사실·근거와 사실에 닿은 경로를 나눕니다" bridge="머릿속 판단, 바깥 사실, 판단 이유와 둘 사이의 연결을 나눴습니다. 멈춘 시계에 숫자를 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">사람이 어떤 문장을 받아들이는 것은 머릿속 상태입니다. 그 문장이 실제 세계와 맞는지는 바깥의 사실입니다. 왜 받아들였는지를 설명하는 증거나 절차는 근거입니다. 세 가지가 모두 있어도 근거가 우연히 사실과 맞아떨어질 수 있습니다.</p>
          <p className="leading-8">따라서 마지막에는 작은 변화에도 같은 판단이 계속 맞을지를 묻습니다. 1분만 일찍 봤거나, 옆의 시계를 골랐거나, 고장이 다른 시각에 났어도 맞았을까요? 이런 가까운 경우를 바꾸어 보는 것이 행운을 찾는 한 방법입니다.</p>
        </div>
        <FlowRail title="한 믿음을 지식 후보로 검사하는 순서" steps={[
          { actor: "사람의 판단", movement: "무엇을 믿는지 분명히 적습니다.", receives: "검사할 문장" },
          { actor: "근거와 절차", movement: "어떤 관찰과 방법으로 믿게 됐는지 봅니다.", receives: "정당화 후보" },
          { actor: "바깥의 사실", movement: "정답뿐 아니라 근거가 사실에 닿은 경로를 비교합니다.", receives: "우연인지에 대한 판정" },
        ]} />
      </LessonSection>

      <LessonSection id="case" level="0" title="3. 멈춘 시계 열 개 중 하나가 우연히 맞습니다" bridge="10개 중 하나가 맞는 순간과 정상 시계가 계속 맞는 경우를 분리했습니다. 두 줄의 경로로 그려봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">벽에 같은 모양의 시계 열 개가 있고 모두 멈췄다고 합시다. 각 시계는 1시부터 10시까지 서로 다른 정각에 멈췄습니다. 민아는 지금이 몇 시인지 모르고 4시에 멈춘 시계 하나를 믿었습니다. 실제 시각도 우연히 4시였습니다.</p>
          <p className="leading-8">민아는 “지금 4시다”라고 믿고, 눈앞의 시곗바늘이라는 평소 좋은 근거도 갖고 있으며, 문장도 참입니다. 그러나 10개 중 다른 시계를 골랐거나 1분 뒤에 봤다면 틀렸습니다. 이 숫자는 판단 구조를 보기 위한 가정입니다.</p>
        </div>
        <NumericPath title="정답까지 갔지만 사실을 따라간 것은 아닌 경로" steps={[
          { label: "멈춘 시계", value: "10개", detail: "1~10시 정각에 하나씩 멈춤" },
          { label: "선택한 표시", value: "4:00", detail: "평소에는 합리적인 관찰" },
          { label: "실제 시각", value: "4:00", detail: "그 순간에만 우연히 일치" },
        ]} />
      </LessonSection>

      <LessonSection id="picture" level="1" title="4. 정답과 판단 경로를 두 줄로 놓습니다" bridge="정답 일치와 사실 추적을 따로 그렸습니다. 근거를 더해도 문제가 남는 이유를 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">정상 시계에서는 실제 시간이 톱니와 전자 신호를 움직이고 그 결과가 바늘에 표시됩니다. 민아의 눈과 판단은 그 표시를 따라갑니다. 사실이 표시를 만들고 표시가 믿음을 만든 한 줄의 경로입니다.</p>
          <p className="leading-8">멈춘 시계에서는 고장이 4:00이라는 표시를 고정했고, 실제 시간이 별도로 흘러 4:00에 도착했습니다. 표시와 사실이 같은 원인에서 오지 않았습니다. 화면에 같은 숫자가 나타나도 두 경로의 구조는 다릅니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="need" level="2" title="5. 근거를 더해도 행운이 남을 수 있습니다" bridge="근거의 존재만으로 사실과의 연결이 보장되지 않음을 확인했습니다. 오래 쓰인 세 조건과 반례에 이름을 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">눈으로 시계를 보는 일은 보통 시간을 알아내는 좋은 방법입니다. 그래서 민아의 믿음은 근거 없는 찍기보다 낫습니다. 문제는 일반적으로 좋은 방법이었다는 사실이 이 상황의 고장을 잡지 못했다는 데 있습니다.</p>
          <p className="leading-8">지식의 기준은 너무 약하면 운 좋은 추측까지 통과시키고, 너무 강하면 평범한 관찰도 탈락시킵니다. 그래서 철학의 역할은 단어 하나로 결론을 내리는 것이 아니라, 후보 기준이 어떤 반례를 통과하고 어떤 정상 사례를 놓치는지 비교하는 데 있습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="names" level="3" title="6. 정당화된 참인 믿음과 인식적 행운에 이름을 붙입니다" bridge="세 조건과 그 사이에 남는 우연을 구분했습니다. 같은 4시 사례로 네 검사를 차례대로 합니다.">
        <TermBreakdown title="지식 후보를 읽는 네 이름" items={[
          { term: "믿음", description: "당사자가 어떤 문장을 참이라고 받아들이는 상태입니다.", example: "민아는 지금 4시라고 판단합니다.", boundary: "입 밖으로 말하지 않아도 믿음일 수 있고, 말한다고 실제로 믿는 것은 아닐 수 있습니다." },
          { term: "참", description: "믿은 문장이 바깥 사실과 맞는 조건입니다.", example: "실제 시각도 4시입니다.", boundary: "참이라는 결과만으로 그 사람이 어떻게 맞혔는지는 알 수 없습니다." },
          { term: "정당화", description: "그 믿음을 가질 만한 이유나 절차가 있다는 뜻입니다.", example: "평소 정확한 시계를 눈으로 확인했습니다.", boundary: "근거가 있어도 숨은 고장 때문에 사실과 어긋날 수 있습니다." },
          { term: "인식적 행운", description: "근거와 사실의 연결이 끊겼는데 우연한 사정이 결론을 참으로 만든 경우입니다.", example: "멈춘 바늘과 실제 시간이 하루에 한 번 겹칩니다.", boundary: "모든 우연이 지식을 없애는 것은 아니므로 어떤 연결을 끊는 행운인지 밝혀야 합니다." },
        ]} />
      </LessonSection>

      <LessonSection id="mechanism" level="4" title="7. 12시 정각의 같은 시계 사례를 끝까지 추적합니다" bridge="참·믿음·근거를 통과하고도 사실 추적에서 실패하는 경로를 확인했습니다. 게티어의 원래 문제로 옮겨갑니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">사례를 12시로 바꿔 같은 검사를 해도 결과는 같습니다. 민아가 12시라고 믿으니 믿음 조건을 통과합니다. 실제로 12시이므로 참 조건도 통과합니다. 평소 작동한다고 생각할 이유가 있는 시계를 봤으므로 어느 정도의 정당화도 있습니다.</p>
          <p className="leading-8">그러나 11시 59분에 봤다면 멈춘 시계는 12시를 가리켜 틀립니다. 12시 1분에도 틀립니다. 정상 시계였다면 두 경우 모두 바늘이 실제 시간을 따라 바뀌었을 것입니다. 작은 변화에 쉽게 거짓이 되는 이유는 민아의 판단이 현재 시각이 아니라 고장 난 바늘을 따라갔기 때문입니다.</p>
          <p className="leading-8">여기서 “가까운 경우에도 쉽게 틀리지 않는가”를 안전성의 한 직관으로 쓸 수 있습니다. 다만 어느 경우를 가깝다고 정할지, 확률이 높은 사실을 안다고 할 수 있는지 같은 논쟁은 남습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="source" level="5" title="8. 게티어의 짧은 반례가 세 조건을 흔듭니다" bridge="정당화·참·믿음의 합이 충분하지 않다는 원래 질문을 확인했습니다. 대표적인 보완책들이 무엇을 고치는지 비교합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">에드먼드 게티어의 1963년 논문은 제목 자체로 “정당화된 참인 믿음이 지식인가”를 묻고, 세 조건을 갖추었지만 지식이라고 보기 어려운 사례를 제시했습니다. 핵심은 단순한 찍기가 아니라, 그럴듯한 근거에서 한 단계 잘못 갔다가 별도의 우연으로 결론이 참이 되는 구조입니다.</p>
          <p className="leading-8">논문의 두 번째 사례를 따라가면 그 구조가 보입니다. 스미스에게는 존스가 포드 차를 가졌다고 믿을 강한 증거가 있습니다. 이 믿음을 f라고 부릅니다. 스미스는 친구 브라운이 지금 어디 있는지 전혀 모르면서도 f에서 “존스가 포드를 가졌거나 브라운이 바르셀로나에 있다”라는 선언 문장 h를 이끌어 내 받아들입니다. 실제로는 존스에게 포드가 없고, 우연히 브라운이 바르셀로나에 있습니다. 그래서 h는 참이고, 스미스는 h를 믿으며, 좋은 증거에서 연역했으니 정당화도 있습니다. 그런데 h를 참으로 만든 것은 스미스가 전혀 몰랐던 브라운의 위치입니다.</p>
          <p className="leading-8">이 반례는 두 전제 위에 섭니다. 첫째, 거짓인 명제도 정당하게 믿을 수 있습니다(f는 거짓이지만 증거는 좋았습니다). 둘째, 정당하게 믿는 명제에서 논리적으로 따라 나오는 명제를 연역해 받아들이면 그 결론도 정당화됩니다(h는 f에서 따라 나옵니다). 민아의 경우에는 “이 시계가 가고 있다”는 거짓 믿음이 f 자리에, 실제 시각이 우연히 4시였다는 사실이 바르셀로나의 브라운 자리에 놓입니다. 논문의 첫 번째 사례(취직할 사람의 주머니에 동전 열 개가 있다는 믿음)도 같은 구조입니다. 포드·바르셀로나 문장은 Stanford 철학백과 The Analysis of Knowledge가 인용한 원문과 대조했습니다(2026-10-09 확인).</p>
        </div>
        <SourceApplication source="Gettier · Analysis 23(6), 1963" excerpt="Is Justified True Belief Knowledge?" application="민아의 판단은 믿음·참·정당화를 각각 통과하는 듯하지만 고장과 실제 시각의 우연한 일치가 남습니다." />
        <CitationBlock source="Edmund L. Gettier, Analysis 23(6), 121–123" citeKey={1} href="https://doi.org/10.1093/analys/23.6.121">제목·서지는 Crossref의 DOI 기록으로 확인했습니다(출판사 페이지는 자동 조회 불가, 2026-10-09). 멈춘 시계는 게티어가 아니라 러셀의 사례입니다(Bertrand Russell, Human Knowledge: Its Scope and Limits, London: George Allen and Unwin, 1948). 시계를 열 개로 늘리고 시각을 정한 수치 설정만 이 글의 가정입니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="comparison" level="6" title="9. 신뢰성·안전성·지적 성품은 다른 곳을 고칩니다" bridge="한 가지 정답 대신 서로 다른 수선 위치를 비교했습니다. 어느 기준도 쉽게 닫히지 않는 경계를 남깁니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">신뢰성 접근은 믿음을 만든 과정이 대체로 참을 내는지 묻습니다. 안전성 접근은 가까운 상황에서도 같은 방식의 믿음이 쉽게 거짓이 되지 않는지 묻습니다. 덕 인식론은 사람이 진실을 찾는 지적 능력과 성품 때문에 참에 도달했는지 봅니다.</p>
          <p className="leading-8">멈춘 시계 사례에서 세 접근은 모두 고장 난 표시와 사실의 우연한 만남을 문제 삼지만 설명의 초점이 다릅니다. 정상 시계 과정의 신뢰도를 볼지, 11시 59분이라는 가까운 경우를 볼지, 민아의 확인 습관과 능력을 볼지에 따라 필요한 추가 정보가 달라집니다.</p>
        </div>
        <SourceApplication source="Stanford Encyclopedia of Philosophy · Analysis of Knowledge §8" excerpt="an explicit ‘anti-luck’ condition" application="네 번째 낱말을 붙이는 데서 끝내지 말고 어떤 종류의 행운이 믿음과 사실의 연결을 끊었는지 밝혀야 합니다." />
        <CitationBlock source="Stanford Encyclopedia of Philosophy, The Analysis of Knowledge" citeKey={2} href="https://plato.stanford.edu/entries/knowledge-analysis/">정당화된 참인 믿음, 게티어 반례, 신뢰성·안전성·인식적 행운 논의를 비교하는 해설입니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="limits" level="7" title="10. 지식의 경계는 하나의 네 번째 조건으로 닫히지 않습니다" bridge="지식 주장의 강도를 근거와 오류 가능성에 맞추는 법을 남겼습니다. 같은 시계 사례로 세 질문에 답할 수 있습니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">안전성을 지나치게 강하게 요구하면 정상적인 지각도 “혹시 정교한 속임수가 있었을 수 있다”는 이유로 탈락합니다. 반대로 과정의 평균 신뢰도만 보면 평소 좋은 시계가 오늘 멈춘 예외를 놓칩니다. 기준은 오류 가능성을 0으로 만드는 장치가 아니라, 어떤 실패를 허용하고 어떤 실패를 막는지 밝히는 장치입니다.</p>
          <p className="leading-8">뉴스, 연구 결과, AI의 답을 읽을 때도 “참인가” 다음에 “어떤 방법으로 나왔는가”와 “조금 다른 입력에서도 같은 방법이 맞는가”를 묻습니다. 확인하지 못한 부분은 안다고 단정하기보다 믿음의 근거와 불확실성을 함께 적는 편이 정확합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "민아의 4시 판단은 믿음·참·정당화 중 무엇을 통과하나요? (답: 6절)",
          "11시 59분과 12시 1분을 바꾸어 보는 검사는 어떤 우연을 드러내나요? (답: 7절)",
          "신뢰성·안전성·지적 성품은 멈춘 시계의 어느 부분을 각각 묻나요? (답: 9절)",
        ]} />
      </LessonSection>
    </div>
  );
}
