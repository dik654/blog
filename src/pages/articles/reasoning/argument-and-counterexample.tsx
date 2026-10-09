import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function ArgumentAndCounterexampleArticle() {
  return (
    <div className="space-y-16">
      <LessonSection id="overview" level="S" title="1. 결론과 근거 사이의 다리를 검사합니다" bridge="그럴듯함 대신 문장 사이의 연결을 볼 질문을 정했습니다. 이제 주장을 네 칸으로 나눕니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">“이 가게는 카드 결제를 받으니 전자제품 가게일 것이다.” 결론이 우연히 맞을 수는 있습니다. 그러나 식당과 약국도 카드를 받습니다. 철학에서 논증을 배운다는 것은 어려운 말을 외우는 일이 아니라, 결론이 근거에서 실제로 따라오는지 확인하는 습관을 만드는 일입니다.</p>
          <p className="leading-8">이 글에서는 한 상권의 가게 100곳을 끝까지 씁니다. 문장이 사실인지, 사실이라고 놓았을 때 결론이 빠져나갈 구멍이 없는지, 구멍이 있다면 가장 작은 반례가 무엇인지 차례로 확인합니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="black-box" level="B" title="2. 주장을 전제와 결론으로 나눕니다" bridge="주장의 입력과 출력을 나눴습니다. 숫자를 붙여 결론이 새는 자리를 찾아봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">먼저 이유로 내놓은 문장들을 왼쪽에, 그 이유로 받아들이라는 문장을 오른쪽에 둡니다. 가운데에는 왼쪽이 참일 때 오른쪽이 반드시 참인지 검사하는 다리가 있습니다. 이 다리는 목소리의 자신감이나 사례의 생생함과 별개입니다.</p>
          <p className="leading-8">검사는 두 번 합니다. 첫째, 이유로 내놓은 문장 자체가 사실인지 봅니다. 둘째, 그 문장들을 모두 참이라고 잠시 놓아도 결론만 거짓인 경우를 만들 수 있는지 봅니다. 두 질문을 섞으면 틀린 사실과 틀린 추론을 고치기 어렵습니다.</p>
        </div>
        <FlowRail title="한 논증을 검사하는 순서" steps={[
          { actor: "이유가 되는 문장", movement: "사실과 가정을 따로 적습니다.", receives: "검사할 입력" },
          { actor: "연결 규칙", movement: "입력은 그대로 두고 결론만 거짓인 경우를 찾습니다.", receives: "반례의 가능성" },
          { actor: "받아들일 결론", movement: "사실 검사와 연결 검사를 모두 통과했는지 봅니다.", receives: "잠정적인 판단" },
        ]} />
      </LessonSection>

      <LessonSection id="case" level="0" title="3. 카드 결제 가게 100곳으로 빈틈을 찾습니다" bridge="카드 결제라는 한 특징만으로 업종을 맞힐 수 없는 수치 반례를 만들었습니다. 아직 이름을 붙이지 않고 모양만 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">한 상권에 가게가 100곳 있다고 합시다. 전자제품 가게는 40곳이고 모두 카드 결제를 받습니다. 나머지 60곳 가운데 식당과 약국 50곳도 카드를 받습니다. 따라서 카드를 받는 가게는 모두 90곳입니다. 이 숫자는 추론 모양을 보기 위한 가정입니다.</p>
          <p className="leading-8">가게 A가 카드를 받는다는 사실만 알면 A는 90곳 중 하나입니다. 그중 전자제품 가게는 40곳뿐이고 다른 업종은 50곳입니다. “전자제품 가게이면 카드 결제”가 참이어도 “카드 결제이면 전자제품 가게”는 따라오지 않습니다.</p>
        </div>
        <NumericPath title="카드 결제에서 업종으로 거꾸로 갈 때 생기는 빈틈" steps={[
          { label: "전체 가게", value: "100곳", detail: "설명을 위한 가정" },
          { label: "카드 결제", value: "90곳", detail: "전자 40 + 다른 업종 50" },
          { label: "전자제품", value: "40곳", detail: "카드 결제만으로는 한 곳을 고를 수 없음" },
        ]} />
      </LessonSection>

      <LessonSection id="picture" level="1" title="4. 참인 문장과 따라오는 관계를 따로 놓습니다" bridge="내용의 참과 구조의 빈틈을 다른 칸에 두었습니다. 이 분리가 필요한 이유를 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">“전자제품 가게 40곳은 모두 카드를 받는다”는 문장은 사례 안에서 참입니다. “A는 카드를 받는다”도 참일 수 있습니다. 그런데 두 문장을 나란히 놓아도 A의 업종은 정해지지 않습니다. 참인 문장 두 개와 빈틈없는 연결은 같은 것이 아닙니다.</p>
          <p className="leading-8">반대로 연결 모양은 빈틈없지만 첫 문장이 거짓일 수도 있습니다. “이 상권의 모든 가게가 밤 10시에 닫는다. A는 이 상권에 있다. 그러므로 A는 밤 10시에 닫는다”는 모양은 빠져나갈 곳이 없습니다. 다만 24시간 영업점이 하나라도 있으면 첫 문장을 고쳐야 합니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="need" level="2" title="5. 맞는 결론도 나쁜 추론에서 나올 수 있습니다" bridge="왜 결과만 채점하면 추론 실력이 늘지 않는지 확인했습니다. 이제 각 역할에 표준 이름을 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">A가 실제로 전자제품 가게라면 처음 결론은 맞습니다. 그래도 카드 결제에서 업종을 알아낸 것은 아닙니다. 우연히 맞은 결론을 좋은 추론으로 인정하면 같은 방법을 다음 가게에 썼을 때 실패합니다.</p>
          <p className="leading-8">그래서 논증은 정답 하나보다 재사용 가능한 경로를 평가합니다. 법정의 증거, 과학의 가설, 사업의 투자 판단도 같은 이유로 “결론이 맞았는가”와 “당시 근거에서 그 결론을 낼 수 있었는가”를 나눠 기록합니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="names" level="3" title="6. 전제·결론·타당성·건전성에 이름을 붙입니다" bridge="문장과 연결에 이름을 붙였습니다. 같은 100곳 사례에서 두 추론 형식을 바로 대조합니다.">
        <TermBreakdown title="논증을 읽는 네 이름" items={[
          { term: "전제", description: "결론의 이유로 제시한 문장입니다.", example: "전자제품 가게 40곳은 모두 카드를 받습니다.", boundary: "전제라고 부른다고 참이 되는 것은 아닙니다." },
          { term: "결론", description: "전제들로 받아들이라고 요구하는 문장입니다.", example: "가게 A는 전자제품 가게입니다.", boundary: "결론이 참이어도 그 논증이 좋았다는 뜻은 아닙니다." },
          { term: "타당성", description: "전제를 모두 참으로 놓았을 때 결론만 거짓인 경우가 없는 연결입니다.", example: "모든 E가 C이고 A가 E이면 A는 C입니다.", boundary: "현실의 전제가 참인지까지 보장하지 않습니다." },
          { term: "건전성", description: "연결이 타당하고 실제 전제도 모두 참인 논증입니다.", example: "폐점 규칙과 A의 입점 사실을 모두 확인한 경우입니다.", boundary: "숨은 전제와 말의 뜻이 바뀌지 않았는지도 따로 확인해야 합니다." },
        ]} />
      </LessonSection>

      <LessonSection id="mechanism" level="4" title="7. 같은 가게 사례를 두 추론 형식에 넣습니다" bridge="90곳과 40곳을 같은 형식 안에서 다시 계산했습니다. 오래된 원문이 이 구조를 어떻게 나누는지 확인합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">첫 형식은 “전자제품이면 카드 결제다. A는 전자제품이다. 그러므로 A는 카드 결제다”입니다. 첫 두 문장을 유지하면서 결론만 거짓으로 만들 수 없습니다. A가 전자제품 40곳 중 하나이면 카드 결제 90곳에도 반드시 들어갑니다.</p>
          <p className="leading-8">둘째 형식은 “전자제품이면 카드 결제다. A는 카드 결제다. 그러므로 A는 전자제품이다”입니다. A를 카드 결제를 받는 식당 50곳 중 하나로 고르면 두 전제는 참이고 결론만 거짓입니다. 이 한 곳이 반례가 되어 연결 전체를 무너뜨립니다.</p>
          <p className="leading-8">반례는 현실에서 흔한 사례일 필요가 없습니다. 전제를 유지하며 결론만 거짓으로 만드는 경우가 하나라도 가능하면 “반드시 따라온다”는 주장은 끝납니다. 현실에서 어느 업종일 가능성이 큰지는 별도의 확률 자료가 필요한 질문입니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="source" level="5" title="8. 아리스토텔레스 원문에서 논증과 증명을 가릅니다" bridge="결론이 필연적으로 따라오는 구조와 지식을 주는 증명을 구분했습니다. 다른 전통의 원인 구분과 대조합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">아리스토텔레스의 『분석론 전서』는 전제를 어떤 것을 다른 것에 긍정하거나 부정하는 문장으로 놓고, 항들이 일정한 관계에 있을 때 결론이 따라오는 구조를 먼저 다룹니다. 이어 논증 일반과 증명을 구분합니다. 연결이 성립한다고 해서 그 전제가 지식을 주는 좋은 출발점이라는 뜻은 아닙니다.</p>
        </div>
        <SourceApplication source="Aristotle · Prior Analytics I.4" excerpt="not every syllogism is a demonstration" application="가게 A의 폐점 시간이 형식상 따라오더라도, ‘모든 가게가 10시에 닫는다’는 전제를 조사하지 않았다면 현실을 증명한 것은 아닙니다." />
        <CitationBlock source="Aristotle, Prior Analytics I.1·I.4, A. J. Jenkinson 번역" citeKey={1} href="https://classics.mit.edu/Aristotle/prior.1.i.html">원문은 전제와 추론 형식을 먼저 정의하고 증명을 그중 한 종류로 구분합니다. 가게 숫자는 이 글의 가정입니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="comparison" level="6" title="9. 묵가의 원인 구분으로 조건을 더 세밀하게 봅니다" bridge="같은 ‘원인’이라는 말 안에서도 필요한 조건과 충분한 묶음을 나눴습니다. 현실 논증의 남는 한계를 정리합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">중국 묵가의 『묵자』 「경상」은 어떤 일이 생기기 전에 반드시 필요한 것을 이유나 원인으로 설명합니다. 같은 책의 해설 편인 「경설상(經說上)」은 이를 두 가지로 나눕니다. ‘작은 이유(소고, 小故)’는 있어도 반드시 그렇게 되지는 않지만 없으면 반드시 그렇게 되지 않는 필요 조건이고, ‘큰 이유(대고, 大故)’는 있으면 반드시 그렇게 되는 더 큰 원인 묶음입니다(有之必然，無之必不然). 이는 “카드 결제는 전자제품 가게이기 위한 조건인가”와 “카드 결제만으로 업종이 정해지는가”를 분리하는 데 도움이 됩니다.</p>
          <p className="leading-8">우리 사례에서 카드 결제는 전자제품 가게 40곳이 공통으로 가진 속성이지만, 다른 업종 50곳도 가집니다. 따라서 업종을 정하는 충분한 표지가 아닙니다. 필요한 조건과 충분한 조건을 바꾸어 말하는 순간 둘째 추론의 빈틈이 생깁니다.</p>
        </div>
        <SourceApplication source="Mozi · Canon I" excerpt="what it must get before it will come about" application="필요한 조건 하나를 찾았다는 사실과 그 조건만으로 결과가 정해진다는 주장을 나눠야 합니다." />
        <CitationBlock source="Chinese Text Project, Mozi · Canon I와 경설(Exposition of Canon I), A. C. Graham 역" citeKey={2} href="https://ctext.org/mozi/canon-i">원문과 번역은 원인·이름·분류를 짧은 경문(經)과 같은 책 안의 해설(經說)로 나눕니다. 소고·대고 구분은 후대 주석이 아니라 「경설상」 본문에 있습니다(ctext는 자동 조회 불가라 2024-12-07 Wayback 사본과 zh.wikisource 「經說上」으로 2026-10-09 확인). 현대 논리 기호와 완전히 같은 체계라고 동일시하지 않습니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="limits" level="7" title="10. 현실의 논증은 불확실한 전제와 숨은 선택을 남깁니다" bridge="형식·사실·확률·말의 뜻을 따로 검사할 경계를 세웠습니다. 아래 질문으로 같은 사례를 다시 판단할 수 있습니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">현실에서는 “카드를 받는다”의 뜻도 달라질 수 있습니다. 간판에는 가능하다고 적혀 있지만 단말기가 고장 났을 수 있고, 특정 카드만 받거나 온라인 결제만 될 수 있습니다. 문장의 범위를 맞추지 않으면 형식이 좋아도 다른 대상을 말하게 됩니다.</p>
          <p className="leading-8">또한 대부분의 판단은 필연보다 가능성을 묻습니다. 카드 결제 가게 90곳 중 전자제품 가게가 40곳이라는 정보는 무작위로 하나를 골랐을 때 40/90이라는 출발점을 줄 뿐입니다. 위치·간판·재고 같은 새 근거가 들어오면 확률 판단은 바뀝니다. 이 글의 타당성 검사는 그 확률 계산을 대신하지 않습니다.</p>
        </div>
        <ReviewPrompts questions={[
          "카드 결제 가게 90곳 중 다른 업종 50곳이 있다는 사실은 어느 추론의 반례인가요? (답: 7절)",
          "연결 모양이 빈틈없어도 건전한 논증이 아닐 수 있는 이유는 무엇인가요? (답: 6절)",
          "카드 결제만으로 업종을 추론할 때 필요한 조건과 충분한 조건을 어떻게 혼동했나요? (답: 9절)",
        ]} />
      </LessonSection>
    </div>
  );
}
