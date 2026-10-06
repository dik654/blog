import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function BehaviorMeaningAndMachineUnderstandingArticle() {
  return (
    <div className="space-y-16">
      <LessonSection id="overview" level="S" title="1. 대화 성공과 뜻의 이해를 한 질문으로 묶지 않습니다" bridge="관찰 가능한 능력과 내부 상태에 대한 주장을 나눴습니다. 입력에서 환경까지의 전체 구조를 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">중국어를 모르는 사람이 거대한 규칙표를 따라 중국어 질문 100개 중 90개에 알맞은 답을 내놓았다고 합시다. 밖의 채점자는 높은 언어 능력을 관찰합니다. 방 안의 사람은 글자의 뜻을 모른다고 말합니다. 그러면 누가, 무엇을 이해한 것일까요?</p>
          <p className="leading-8">이 질문은 “인공지능은 생각한다”나 “계산은 이해가 아니다” 중 하나를 바로 고르는 문제가 아닙니다. 행동 능력, 기호 처리, 학습, 세계와의 연결, 주관적 경험을 서로 다른 주장으로 분리해야 어떤 증거가 무엇을 뒷받침하는지 알 수 있습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="black-box" level="B" title="2. 입력·처리·출력·내부 상태·환경을 나눕니다" bridge="겉에서 보는 시험과 안에서 일어나는 과정을 나눴습니다. 100문항 규칙실을 숫자로 고정합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">입력은 중국어 질문 문자열입니다. 처리는 모양을 찾아 규칙표의 다음 쪽으로 이동하는 일입니다. 출력은 중국어 답 문자열입니다. 내부에는 규칙표, 메모, 작업자의 상태가 있고, 바깥에는 질문자와 실제 중국어 사용 환경이 있습니다.</p>
          <p className="leading-8">시험은 입력과 출력의 관계를 잘 잴 수 있습니다. 그러나 내부 표현이 무엇을 가리키는지, 새 상황에서 스스로 고칠 수 있는지, 답에 대한 경험이 있는지는 시험 설계에 따라 보이지 않을 수 있습니다.</p>
        </div>
        <FlowRail title="대화 행동을 만드는 다섯 자리" steps={[
          { actor: "질문과 환경", movement: "상황이 있는 문장을 입력합니다.", receives: "문자열과 맥락" },
          { actor: "처리 시스템", movement: "규칙·기억·학습된 표현으로 다음 출력을 고릅니다.", receives: "내부 상태 변화" },
          { actor: "판정자", movement: "정확성·일관성·새 상황 대응을 관찰합니다.", receives: "능력에 대한 증거" },
        ]} />
      </LessonSection>

      <LessonSection id="case" level="0" title="3. 중국어 문답 100개를 규칙표로 처리합니다" bridge="높은 점수와 뜻을 모르는 작업자가 동시에 가능한 사례를 만들었습니다. 시스템 전체를 어디까지 셀지 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">질문 100개 가운데 규칙표에 익숙한 형태가 80개이고 새로운 조합이 20개라고 합시다. 규칙실은 익숙한 질문 78개와 새 질문 12개, 모두 90개를 맞힙니다. 숫자는 논점을 드러내기 위한 가정입니다.</p>
          <p className="leading-8">작업자는 중국어 뜻을 모른 채 기호 모양만 바꿉니다. 그러나 규칙표를 만든 사람, 메모장, 입출력 장치까지 묶은 시스템은 중국어 질문에 안정적으로 답합니다. 작업자 개인의 무이해가 시스템 전체의 무이해를 곧장 증명하는지는 별도 논증이 필요합니다.</p>
        </div>
        <NumericPath title="90점 안에 서로 다른 성공이 들어 있습니다" steps={[
          { label: "전체 질문", value: "100개", detail: "익숙한 80 + 새 조합 20" },
          { label: "정답", value: "90개", detail: "익숙한 78 + 새 조합 12" },
          { label: "오답", value: "10개", detail: "실패 모양이 이해 주장에 주는 정보" },
        ]} />
      </LessonSection>

      <LessonSection id="picture" level="1" title="4. 밖에서 보이는 성공과 안에서 일어난 일을 분리합니다" bridge="같은 90점에서 여러 내부 설명이 가능함을 확인했습니다. 그래도 행동 검사가 필요한 이유를 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">90점은 거짓 자료가 아닙니다. 이 시스템이 정해진 조건에서 중국어 답을 잘 고른다는 강한 증거입니다. 다만 외운 답, 통계적 일반화, 세계에 대한 표현, 의식적 이해 가운데 무엇이 성공을 만들었는지는 추가 검사가 필요합니다.</p>
          <p className="leading-8">내부가 다르다는 이유로 행동을 무시할 수도 없습니다. 사람의 이해도 다른 사람에게는 말과 행동을 통해 드러납니다. 문제는 행동을 증거로 쓰는 것과 특정 시험 한 번을 이해의 완전한 정의로 삼는 것을 구분하는 데 있습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="need" level="2" title="5. 판정할 수 있는 능력과 설명하려는 마음의 범위가 다릅니다" bridge="공개 시험과 마음 이론의 역할을 나눴습니다. 논쟁에서 자주 섞이는 이름을 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">실제 제품을 고를 때는 오류율, 안전성, 새로운 질문 대응, 근거 제시처럼 관찰 가능한 성능이 중요합니다. 의식이 있는지 결론내리지 않아도 시스템을 비교하고 책임 기준을 세울 수 있습니다.</p>
          <p className="leading-8">반면 철학의 마음 이론은 왜 기호가 세계의 대상을 뜻하는지, 느낌과 경험이 계산과 어떤 관계인지 묻습니다. 제품 시험이 이 질문을 자동으로 해결하지 않듯, 사고실험 하나도 실제 시스템의 모든 능력을 측정하지 않습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="names" level="3" title="6. 행동 기준·구문·의미·의도성에 이름을 붙입니다" bridge="관찰 가능한 기준과 의미에 관한 주장을 분리했습니다. 사람·규칙실·학습 시스템의 같은 90점을 비교합니다.">
        <TermBreakdown title="기계 이해 논쟁의 네 이름" items={[
          { term: "행동 기준", description: "내부를 직접 보지 않고 과제에서 드러난 반응으로 능력을 판정하는 기준입니다.", example: "텍스트 대화에서 사람과 구별하기 어렵습니다.", boundary: "시험 밖 능력과 의식 전체를 혼자 보장하지 않습니다." },
          { term: "구문", description: "기호의 모양과 배열을 바꾸는 규칙입니다.", example: "중국어 글자 모양을 찾아 다음 규칙으로 이동합니다.", boundary: "기호가 무엇을 뜻하는지는 형식 규칙만으로 주어지지 않을 수 있습니다." },
          { term: "의미", description: "기호·문장이 대상·상황·사용과 맺는 뜻의 관계입니다.", example: "‘비’라는 글자가 날씨와 젖은 거리의 상황을 가리킵니다.", boundary: "사전 대응표 하나와 실제 사용 능력을 같은 것으로 볼 수 없습니다." },
          { term: "의도성", description: "믿음·바람·생각이 어떤 대상이나 상태를 향하는 성질입니다.", example: "밖에 비가 온다고 믿습니다.", boundary: "주의를 집중한다는 일상어의 의도와 구분해야 합니다." },
        ]} />
      </LessonSection>

      <LessonSection id="mechanism" level="4" title="7. 같은 90점이 사람·규칙실·학습 시스템에서 무엇을 뜻하는지 봅니다" bridge="점수는 같아도 오류·학습·환경 연결이 다른 세 시스템을 비교했습니다. 튜링이 질문을 바꾼 이유를 원문에서 확인합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">사람은 뜻을 물어 설명하고 실제 물건을 가리키며, 오해를 지적받으면 규칙을 고칠 수 있습니다. 고정 규칙실은 표에 없는 질문에서 멈추고, 오류 이유를 자기 경험으로 설명하지 못합니다. 학습 시스템은 새 조합 20개 중 12개를 맞히지만 학습 자료의 비슷한 패턴 때문일 수 있습니다.</p>
          <p className="leading-8">세 시스템의 90점만 보면 같지만, 질문을 바꿔 가리키기·행동·장기 기억·반사실·자기 수정까지 시험하면 능력의 모양이 달라집니다. 이해라는 넓은 말을 한 점수로 줄이지 않고 여러 공개 능력으로 나누면 실제 비교가 가능해집니다.</p>
          <p className="leading-8">그렇다고 능력 목록을 모두 통과하면 주관적 경험까지 증명된다는 결론도 바로 나오지 않습니다. 기능에 관한 주장과 의식에 관한 주장은 필요한 증거가 다릅니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="source" level="5" title="8. 튜링은 모호한 질문을 관찰 가능한 게임으로 바꿉니다" bridge="말의 정의 싸움을 공개된 판정 과제로 바꾸는 장점을 확인했습니다. 중국어 방이 남기는 반례와 비교합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">튜링의 1950년 논문은 “기계가 생각할 수 있는가”를 곧장 정의하려 하기보다, 문자 대화에서 판정자가 사람과 기계를 구별하는 게임을 제안합니다. 몸의 모양이나 목소리를 가리고 지적 행동을 비교할 수 있는 질문으로 바꾼 것입니다.</p>
          <p className="leading-8">이 게임의 힘은 시험 가능한 기준을 준다는 데 있습니다. 그러나 튜링 시험을 통과했다는 말에서 곧바로 모든 종류의 지능, 의미 이해, 의식이 증명됐다고 넓히면 원래 과제의 범위를 넘어섭니다.</p>
        </div>
        <SourceApplication source="A. M. Turing · Computing Machinery and Intelligence" excerpt="I propose to consider the question, ‘Can machines think?’" application="정의가 흔들리는 질문을 문자 대화에서 드러나는 구체적 판정 과제로 바꾸되, 그 과제가 재는 능력의 범위를 적어야 합니다." />
        <CitationBlock source="A. M. Turing, Computing Machinery and Intelligence, Mind 59, 1950" citeKey={1} href="https://academic.oup.com/mind/article/LIX/236/433/986238">모방 게임, 디지털 컴퓨터, 반론과 학습 기계를 다룬 원 논문입니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="comparison" level="6" title="9. 중국어 방은 기호 규칙만으로 의미가 생기는지 반문합니다" bridge="작업자의 구문 처리와 시스템 전체의 이해를 둘러싼 반론을 나눴습니다. 판단 범위를 정리합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">설의 중국어 방 사고실험에서 중국어를 모르는 사람은 영어 규칙에 따라 중국어 기호를 조작해 밖에서는 자연스러운 답을 만듭니다. 설은 구문 규칙을 실행하는 사실만으로 의미 이해가 충분히 생기지 않는다고 주장합니다.</p>
          <p className="leading-8">대표 반론은 방 안 사람 하나가 아니라 규칙·기억·입출력을 합친 시스템 전체가 이해한다고 봅니다. 또 몸과 센서로 세계에 연결되거나 학습 과정이 포함되면 고정 규칙실과 다르다는 반론도 있습니다. 사고실험은 이 답들을 자동으로 끝내지 않고 이해를 어느 수준에 귀속할지 묻게 합니다.</p>
        </div>
        <SourceApplication source="Stanford Encyclopedia · Chinese Room Argument" excerpt="syntactic manipulation is not sufficient for meaning" application="규칙실의 90점은 공개 능력의 증거로 남지만, 기호가 무엇을 뜻하는지 설명하는 추가 관계가 필요한지 묻게 합니다." />
        <CitationBlock source="Stanford Encyclopedia of Philosophy, The Chinese Room Argument" citeKey={2} href="https://plato.stanford.edu/entries/chinese-room/">설의 원 논증과 시스템·로봇·뇌 시뮬레이션 반론을 함께 정리한 전문 개관입니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="limits" level="7" title="10. 행동·구현·학습·몸·의식을 서로 다른 주장으로 남깁니다" bridge="하나의 시험이나 사고실험으로 넓은 마음 개념을 닫지 않는 기준을 세웠습니다. 아래 질문으로 같은 90점을 다시 해석합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">현재 인공지능을 평가할 때도 같은 구분이 필요합니다. 정답률은 과제 능력, 내부 활성은 구현, 학습 자료와 상호작용은 의미 형성의 후보 경로, 자기 보고는 또 하나의 행동 증거입니다. 어느 하나를 의식의 직접 측정값으로 부르면 건너뛴 전제가 생깁니다.</p>
          <p className="leading-8">반대로 “통계로 다음 기호를 골랐다”는 구현 설명만으로 이해가 없다고 끝낼 수도 없습니다. 사람의 뇌도 물리 과정으로 작동한다는 사실이 곧 마음을 지우지 않습니다. 필요한 일은 시스템 수준, 능력 범위, 실패 반례, 세계와의 연결, 의식에 관한 추가 가정을 각각 밝히는 것입니다.</p>
        </div>
        <ReviewPrompts questions={[
          "중국어 문답 90점이 강하게 보여 주는 능력과 혼자 보여 주지 못하는 상태는 무엇인가요? (답: 4·7절)",
          "튜링의 모방 게임과 설의 중국어 방은 각각 질문을 어떤 방향으로 바꾸나요? (답: 8·9절)",
          "방 안 작업자가 이해하지 못한다는 사실에서 시스템 전체도 이해하지 못한다고 결론내릴 때 필요한 전제는 무엇인가요? (답: 3·9절)",
        ]} />
      </LessonSection>
    </div>
  );
}
