import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function ConsentLibertyAndLegitimatePowerArticle() {
  return (
    <div className="space-y-16">
      <LessonSection id="overview" level="S" title="1. 규칙이 유익하다는 사실만으로 강제할 권리가 생기지는 않습니다" bridge="좋은 결과와 강제할 자격을 나눴습니다. 이제 결정이 실제 규칙이 되는 네 자리를 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">아파트 상가의 야간 영업을 제한하면 소음은 줄 수 있습니다. 그래도 “조용해지니 옳다”만으로는 충분하지 않습니다. 누가 결정했는지, 반대한 사람에게 어떤 부담이 생기는지, 그 부담을 다툴 길이 있는지를 함께 물어야 합니다.</p>
          <p className="leading-8">정치철학은 완벽한 정부 이름을 고르는 일이 아닙니다. 여러 사람에게 같은 규칙을 강제할 때 그 힘이 정당한지 검사하는 도구입니다. 이 글은 100가구의 표결을 끝까지 따라가며 동의, 자유, 권리, 해악을 서로 다른 질문으로 씁니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="black-box" level="B" title="2. 결정·적용·이의 제기·수정의 네 자리를 봅니다" bridge="표 한 번보다 긴 제도 경로를 잡았습니다. 100가구의 이해가 갈리는 작은 사례로 내려갑니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">규칙은 제안되고, 결정되고, 구체적인 사람에게 적용된 뒤, 잘못됐을 때 고쳐집니다. 제안 내용을 미리 알 수 없거나 특정 가구만 투표하지 못했다면 찬성표 숫자가 커도 절차의 흠이 남습니다.</p>
          <p className="leading-8">적용 단계도 따로 봐야 합니다. 같은 밤 10시 규칙이 편의점, 약국, 술집에 같은 이유로 필요한지, 위반을 누가 조사하고 어떤 증거로 제재하는지에 따라 실제 자유의 범위가 달라집니다.</p>
        </div>
        <FlowRail title="결정이 정당한 규칙이 되는 경로" steps={[
          { actor: "구성원", movement: "이유를 듣고 찬반을 표시합니다.", receives: "참여와 대표" },
          { actor: "집행 기관", movement: "공개된 기준으로 같은 사례를 처리합니다.", receives: "제한된 강제력" },
          { actor: "이의 제기 절차", movement: "오류·차별·과도한 부담을 다시 심사합니다.", receives: "수정 가능한 결정" },
        ]} />
      </LessonSection>

      <LessonSection id="case" level="0" title="3. 100가구의 야간 영업 규칙을 표결합니다" bridge="60대 40이라는 결과를 만들었습니다. 다음에는 수와 권리의 문제를 다른 칸에 놓습니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">100가구가 사는 단지에서 60가구는 밤 10시 뒤 상가 영업 금지에 찬성하고 40가구는 반대한다고 합시다. 찬성 가구는 수면 방해를 줄이고 싶습니다. 반대 가구 중 15가구는 야간 근무 뒤 식료품과 약을 사야 합니다.</p>
          <p className="leading-8">표결 결과는 60대 40이지만 판단은 끝나지 않습니다. 소음이라는 타인 피해를 줄이는 규칙인지, 불쾌하다는 이유로 다른 생활 방식을 막는 규칙인지, 약국 예외나 방음 같은 덜 제한적인 수단이 있는지 비교해야 합니다.</p>
        </div>
        <NumericPath title="찬성표와 부담받는 사람을 함께 셉니다" steps={[
          { label: "전체", value: "100가구", detail: "같은 규칙의 적용 대상" },
          { label: "찬성", value: "60가구", detail: "소음 감소를 기대" },
          { label: "야간 생활 의존", value: "15가구", detail: "필요한 예외와 대안 검토" },
        ]} />
      </LessonSection>

      <LessonSection id="picture" level="1" title="4. 찬성표의 수와 영향을 받는 권리를 따로 놓습니다" bridge="집단의 선택과 개인의 보호선을 분리했습니다. 둘을 함께 유지해야 하는 이유를 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">다수결은 의견이 다른 집단이 한 결정을 내리는 방법입니다. 그러나 어떤 권리도 매번 표 수에 따라 없어질 수 있다면, 오늘의 60가구도 다른 사안에서는 보호받지 못하는 40가구가 됩니다.</p>
          <p className="leading-8">반대로 개인 자유만 말하며 공동 소음과 안전 비용을 모두 남에게 떠넘길 수도 없습니다. 판단의 핵심은 표결과 권리를 서로 없애는 것이 아니라, 공동 결정을 내릴 권한과 넘지 말아야 할 선을 함께 정하는 데 있습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="need" level="2" title="5. 결정을 내려야 하지만 패배한 사람도 구성원으로 남습니다" bridge="한 번 진 사람도 다음 결정을 함께해야 한다는 조건을 확인했습니다. 이제 표준 이름을 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">모두의 만장일치를 기다리면 소음 규칙을 정하지 못할 수 있습니다. 그래서 다수결과 대표가 필요합니다. 다만 진 쪽이 계속 이유를 요구하고 다음 선거·소송·재심에서 바꿀 수 있어야 공동체가 강제와 복종만으로 굳지 않습니다.</p>
          <p className="leading-8">정당한 제도는 모든 사람이 매번 만족하는 상태가 아닙니다. 결정 권한의 출처, 공개된 이유, 공평한 적용, 기본 권리, 수정 통로를 갖춰 패배한 사람도 규칙을 자기 공동체의 결정으로 다툴 수 있게 하는 상태에 가깝습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="names" level="3" title="6. 동의·정당성·자유·해악 원칙에 이름을 붙입니다" bridge="강제력을 검사할 네 기준을 구분했습니다. 같은 60대 40 결과가 제도를 지날 때 무엇이 더 필요한지 추적합니다.">
        <TermBreakdown title="정치적 강제를 읽는 네 이름" items={[
          { term: "통치받는 사람의 동의", description: "권력이 구성원의 수락이나 참여에서 권한을 얻는다는 생각입니다.", example: "공개된 규칙 아래 100가구가 대표와 절차를 선택합니다.", boundary: "그곳에 산다는 사실만으로 모든 조치에 실제 동의했다고 볼 수는 없습니다." },
          { term: "정치적 정당성", description: "어떤 기관이 공동 규칙을 만들고 집행할 권리가 있는 상태입니다.", example: "관리 주체가 위임받은 범위 안에서 소음 규칙을 만듭니다.", boundary: "정책이 효과적이라는 사실과 같은 말이 아닙니다." },
          { term: "자유", description: "타인의 자의적인 지배나 부당한 간섭 없이 선택하고 행동할 수 있는 범위입니다.", example: "야간 생활과 영업을 계획할 수 있습니다.", boundary: "어떤 공동 부담도 지지 않을 권리를 뜻하지 않습니다." },
          { term: "해악 원칙", description: "타인에게 생기는 피해를 막는 일이 강제의 핵심 근거라는 기준입니다.", example: "측정 가능한 야간 소음을 줄이는 규칙입니다.", boundary: "불쾌감·위험·권리 침해 가운데 무엇이 해악인지 별도 논증이 필요합니다." },
        ]} />
      </LessonSection>

      <LessonSection id="mechanism" level="4" title="7. 60대 40의 결과가 정당한 규칙이 되는 경로를 추적합니다" bridge="표결을 권한·이유·비례성·구제 절차와 연결했습니다. 로크의 원문에서 동의의 범위를 확인합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">첫째, 관리 주체가 영업 허가를 전면 금지할 권한까지 위임받았는지 봅니다. 둘째, 소음 기록과 민원 시간을 공개해 왜 밤 10시인지 설명합니다. 셋째, 전면 금지보다 방음·주류 판매 제한·약국 예외처럼 덜 제한적인 수단을 비교합니다.</p>
          <p className="leading-8">넷째, 같은 소음을 내는 가게를 같은 기준으로 처리합니다. 다섯째, 15가구와 점포가 자료를 내고 재심을 청구할 통로를 둡니다. 60표는 결정을 시작하게 하지만 이 다섯 조건이 강제력의 범위를 정합니다.</p>
          <p className="leading-8">이 검사는 정답 공식을 주지 않습니다. 다만 “다수가 원했다”와 “규칙이 정당하다” 사이에 빠진 질문을 드러내므로, 서로 다른 자유와 공동 비용을 어디서 조정했는지 설명할 수 있게 합니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="source" level="5" title="8. 로크의 동의와 재산 보호를 원문에 대입합니다" bridge="동의에서 권력이 생기고 공공선을 위해 제한된다는 주장을 확인했습니다. 다수의 간섭 범위를 밀의 기준과 비교합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">로크의 『통치론』 둘째 논고는 사람이 자유롭고 평등한 상태에서 공동체를 만들며, 다수가 그 공동체를 움직인다고 설명합니다. 동시에 입법 권력은 알려진 법과 공정한 재판을 통해 생명·자유·재산을 지키는 공공선의 범위를 넘어설 수 없다고 제한합니다.</p>
          <p className="leading-8">100가구 사례에 대입하면 최초의 동의는 “60가구가 원하는 것은 무엇이든 한다”는 백지 위임이 아닙니다. 공동체를 만든 목적과 정해진 권한, 공개된 법, 재산과 자유의 보호가 표결 결과를 계속 묶습니다.</p>
        </div>
        <SourceApplication source="John Locke · Second Treatise §§95–96, 131" excerpt="no one can be ... subjected ... without his own consent" application="100가구의 공동 절차는 권력의 출처가 되지만, 입법 권한은 공공선과 알려진 규칙의 경계를 계속 받습니다." />
        <CitationBlock source="John Locke, Second Treatise of Government" citeKey={1} href="https://www.gutenberg.org/files/7370/7370-h/7370-h.htm">동의, 다수의 결정, 알려진 법, 재산 보호와 공공선의 관계를 확인하는 공개 원문입니다. 17세기 영국의 범위와 로크 자신의 역사적 한계까지 현대 권리의 완성본으로 일반화하지 않습니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="comparison" level="6" title="9. 밀의 해악 원칙은 다수의 간섭 범위를 다시 좁힙니다" bridge="권한의 출처에 더해 간섭의 목적을 검사했습니다. 현실의 동의와 불평등이 남기는 문제를 정리합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">밀의 『자유론』은 본인의 삶이 마음에 들지 않는다는 이유보다 타인에게 가는 피해를 막는 일을 강제의 중심 근거로 둡니다. 따라서 “밤늦게 영업하는 모습이 싫다”와 “측정 가능한 소음 때문에 잠을 자지 못한다”는 다른 이유입니다.</p>
          <p className="leading-8">그러나 해악 원칙도 자동 판정기가 아닙니다. 간접 피해와 위험을 어디까지 셀지, 어린이·정보 부족·감염병처럼 선택 능력과 외부 효과가 얽힌 경우를 어떻게 다룰지 추가 판단이 필요합니다. 15가구의 필요도 타인의 수면권과 함께 비교해야 합니다.</p>
        </div>
        <SourceApplication source="John Stuart Mill · On Liberty I" excerpt="to prevent harm to others" application="전면 금지의 이유가 타인의 실제 피해인지, 다수가 선호하지 않는 생활 방식에 대한 간섭인지 구분하게 합니다." />
        <CitationBlock source="John Stuart Mill, On Liberty" citeKey={2} href="https://www.gutenberg.org/files/34901/34901-h/34901-h.htm">사회적 강제가 허용되는 목적과 사상·생활 방식의 자유를 설명하는 공개 원문입니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="limits" level="7" title="10. 실제 동의·불평등·공공재가 단순 표결을 어렵게 만듭니다" bridge="표 수, 권한, 피해, 대안, 수정 통로를 함께 보는 기준을 세웠습니다. 아래 질문으로 같은 규칙을 다시 판단할 수 있습니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">현대 국가는 태어날 때 실제 계약서에 서명한 사람들만으로 만들어지지 않습니다. 이사할 수 있다는 말도 비용·국적·가족 때문에 충분한 동의가 아닐 수 있습니다. 묵시적 동의를 너무 넓게 잡으면 어떤 권력도 사후에 정당화됩니다.</p>
          <p className="leading-8">이 비판이 겨냥하는 넓은 기준은 로크 자신의 것입니다. 『통치론』 둘째 논고 §119는 명시적 동의와 묵시적 동의를 나눈 뒤, 그 정부 영토의 어느 부분이든 소유하거나 누리는 사람은 묵시적 동의를 한 것이라고 답합니다. 일주일 묵는 숙소나 큰길을 자유롭게 지나가는 일까지 포함되고, 로크의 표현으로는 “the very being of any one within the territories of that government”까지 닿습니다. 100가구 사례로 옮기면 동네 길을 한 번 지나간 방문자도 영업시간 규칙에 동의한 사람으로 세어지는 셈이라, 동의가 권력을 제한하는 힘을 잃습니다.</p>
          <p className="leading-8">돈과 시간의 차이는 참여의 질도 바꿉니다. 표는 한 사람에 하나여도 변호사, 언론, 로비, 자료에 접근하는 능력은 다릅니다. 그래서 정당성은 선거뿐 아니라 기본권, 행정 이유, 독립 심사, 정보 공개, 실제로 쓸 수 있는 이의 절차에서 반복해 확인해야 합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "60대 40의 표결만으로 밤 10시 전면 금지를 바로 정당화할 수 없는 이유는 무엇인가요? (답: 7절)",
          "로크의 동의 기준과 밀의 해악 기준은 각각 강제력의 어느 부분을 검사하나요? (답: 8·9절)",
          "야간 약국 예외는 다수결을 무시하는 것이 아니라 어떤 조건을 보완하나요? (답: 3·7절)",
        ]} />
      </LessonSection>
    </div>
  );
}
