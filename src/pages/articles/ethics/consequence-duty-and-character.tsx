import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function ConsequenceDutyAndCharacterArticle() {
  return (
    <div className="space-y-16">
      <LessonSection id="overview" level="S" title="1. 좋은 의도나 큰 이익 하나만으로 행동을 판정하지 않습니다" bridge="하나의 안전 결정을 세 질문으로 볼 준비를 했습니다. 결정 안의 사람과 영향을 먼저 펼칩니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">배달을 시작한 도시락 100개에서 알레르기 표시가 빠졌다는 사실을 알게 됐습니다. 전부 회수하면 비용과 폐기가 생기고, 그대로 두면 누군가 크게 다칠 수 있습니다. 이때 “손해가 작다”, “규칙이다”, “좋은 사람이라면” 가운데 한 문장만으로는 판단 과정이 보이지 않습니다.</p>
          <p className="leading-8">윤리 이론은 정답 세 개를 외우는 표가 아닙니다. 같은 행동에서 누가 어떤 영향을 받는지, 사람을 수단으로만 다루는 약속 위반이 있는지, 이런 결정을 반복하면 어떤 성품과 관행이 생기는지 묻는 서로 다른 검사입니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="black-box" level="B" title="2. 영향·원칙·행위자를 같은 결정에 겹쳐 봅니다" bridge="행동의 결과, 지킬 관계, 반복되는 습관을 분리했습니다. 100개의 도시락에 숫자를 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">첫 장부에는 회수와 미회수 때 각 사람이 겪을 이익과 피해를 적습니다. 둘째에는 회사가 고객에게 한 표시 약속과, 누구에게도 예외 없이 적용할 수 있는 행동 규칙을 적습니다. 셋째에는 책임자가 위험을 숨기거나 드러내는 선택을 반복할 때 조직이 어떤 사람이 되는지 적습니다.</p>
          <p className="leading-8">세 장부는 같은 자료를 다르게 읽습니다. 그래서 하나가 다른 둘을 자동으로 대신하지 않습니다. 예상 피해를 계산해도 권리 침해가 사라지지 않고, 규칙을 지켜도 실제 피해의 크기를 무시할 수 없으며, 좋은 성품을 말해도 무엇을 해야 하는지 구체화해야 합니다.</p>
        </div>
        <FlowRail title="한 행동을 세 번 읽는 순서" steps={[
          { actor: "영향을 받는 사람", movement: "피해·이익·불확실성과 분배를 적습니다.", receives: "결과 장부" },
          { actor: "서로에게 한 약속", movement: "예외 없이 지킬 수 있는 원칙과 권리를 봅니다.", receives: "의무 장부" },
          { actor: "결정을 반복할 조직", movement: "정직·용기·신중함이 습관이 되는지 봅니다.", receives: "성품 장부" },
        ]} />
      </LessonSection>

      <LessonSection id="case" level="0" title="3. 알레르기 표시가 빠진 도시락 100개를 회수할지 정합니다" bridge="피해 가능성과 회수 비용을 작은 수치로 고정했습니다. 숫자에 들어가지 않는 사람과 약속도 함께 펼칩니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">도시락 100개 중 10개에 땅콩 성분이 들어갔을 수 있는데 표시가 빠졌다고 합시다. 그 10개가 누구에게 갔는지는 모릅니다. 즉시 연락하고 회수하는 비용은 총 100만원, 아무 조치도 하지 않았을 때 중증 반응이 생길 가능성은 2%, 발생 시 치료·소득 손실을 5000만원으로 가정합니다.</p>
          <p className="leading-8">단순 기대 손실은 0.02×5000만원=100만원으로 회수 비용과 같습니다. 그러나 숫자가 같다고 행동이 자동으로 정해지지는 않습니다. 피해가 한 고객에게 집중되고 회사는 정보를 알고 있으며, 고객은 성분 표시를 믿고 선택했기 때문입니다.</p>
        </div>
        <NumericPath title="같은 100만원이 전혀 다른 방식으로 생깁니다" steps={[
          { label: "회수", value: "100만원", detail: "회사와 거래처가 넓게 부담" },
          { label: "미회수 기대 손실", value: "2% × 5000만원", detail: "평균값은 100만원" },
          { label: "실제 피해", value: "0원 또는 5000만원", detail: "한 사람에게 집중될 수 있음" },
        ]} />
      </LessonSection>

      <LessonSection id="picture" level="1" title="4. 누가 무엇을 겪고 어떤 약속이 걸렸는지 펼칩니다" bridge="평균 비용 뒤에 숨은 분배와 정보 차이를 드러냈습니다. 세 질문이 각각 잡는 실패를 확인합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">회수 비용 100만원은 회사, 배송 기사, 판매점, 식품을 다시 만들어야 하는 사람에게 나뉩니다. 미회수의 5000만원은 알레르기가 있는 고객 한 명에게 집중될 수 있습니다. 같은 기대값은 부담의 위치와 되돌릴 수 있는 정도를 말해 주지 않습니다.</p>
          <p className="leading-8">또한 회사만 성분 누락을 압니다. 고객은 정확한 표시를 전제로 구매했습니다. 회사가 침묵하면 고객이 자기 위험을 선택할 기회를 빼앗습니다. 마지막으로 이런 침묵이 한 번 허용되면 다음 담당자도 비용이 비슷하다는 이유로 숨기기 쉬워집니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="need" level="2" title="5. 세 질문은 서로 다른 실패를 잡습니다" bridge="결과만, 규칙만, 성품만 볼 때 빠지는 것을 찾았습니다. 이제 세 전통의 표준 이름을 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">결과만 합치면 5000만원 피해가 한 사람에게 몰린다는 점과 고객의 선택권이 평균 속에 사라질 수 있습니다. 의무만 말하면 연락 방법과 회수 속도 중 어느 것이 실제 피해를 더 줄이는지 비교하지 못할 수 있습니다. 성품만 말하면 ‘정직하게 하자’는 말은 남지만 책임자와 마감 시각이 비어 있을 수 있습니다.</p>
          <p className="leading-8">세 관점을 함께 쓴다는 것은 점수를 더해 절충한다는 뜻이 아닙니다. 각 관점이 요구하는 질문을 통과시킨 뒤, 충돌하는 부분과 우선한 이유를 공개하는 것입니다. 이 과정은 누가 결정을 내렸고 어떤 사실을 몰랐는지도 남깁니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="names" level="3" title="6. 결과주의·의무론·덕 윤리에 이름을 붙입니다" bridge="세 관점이 보는 대상을 나눴습니다. 도시락 100개의 선택에 하나씩 적용합니다.">
        <TermBreakdown title="행동을 보는 세 방향" items={[
          { term: "결과주의", description: "선택 가능한 행동들이 사람들의 삶에 만드는 결과를 비교합니다.", example: "회수와 미회수의 피해 크기·가능성·분배를 비교합니다.", boundary: "무엇을 좋은 결과로 셀지와 소수의 큰 피해를 어떻게 다룰지는 추가 판단입니다." },
          { term: "의무론", description: "결과와 별개로 사람에게 지켜야 할 원칙·권리·약속을 묻습니다.", example: "성분 정보를 알고도 숨기면 고객의 선택을 도구로만 씁니다.", boundary: "의무끼리 충돌할 때 우선순위와 적용 범위를 설명해야 합니다." },
          { term: "덕 윤리", description: "한 번의 규칙보다 좋은 판단을 반복해서 내리는 성품과 습관을 봅니다.", example: "정직·용기·신중함을 가진 책임자가 위험을 알리는 방식입니다.", boundary: "성품의 이름만으로 구체적인 회수 절차가 자동으로 나오지는 않습니다." },
        ]} />
      </LessonSection>

      <LessonSection id="mechanism" level="4" title="7. 도시락 100개의 결정을 세 번 계산합니다" bridge="같은 선택에서 세 관점이 요구하는 행동과 이유를 추적했습니다. 각 관점의 원문 표현을 확인합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">결과 장부는 평균 100만원에서 멈추지 않습니다. 피해가 생기면 5000만원이 한 사람에게 집중되고 되돌리기 어렵지만, 회수 비용은 여러 조직이 나누고 나중에 개선할 수 있습니다. 발생 확률이 2%가 아니라 0.5%여도 중증 피해와 회수 과정의 부작용을 함께 비교해야 합니다.</p>
          <p className="leading-8">의무 장부에서는 “비용이 기대 손실 이상일 때 알려진 알레르기 정보를 숨겨도 된다”는 규칙을 모든 판매자가 써도 되는지 묻습니다. 그런 규칙이 공개되면 고객은 성분 표시를 믿을 수 없습니다. 고객을 자기가 고를 수 있는 사람으로 대하려면 즉시 정보와 선택지를 줘야 합니다.</p>
          <p className="leading-8">성품 장부는 회수 버튼만 누르고 끝나지 않습니다. 누락을 먼저 알리고, 원인을 기록하고, 다음 배치의 표시 검사를 고치며, 비용이 드는 사실을 핑계로 위험을 축소하지 않는 습관을 봅니다. 이 사례에서는 세 관점이 즉시 알림과 회수 쪽으로 모이지만, 이유는 서로 다릅니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="source" level="5" title="8. 밀·칸트·아리스토텔레스의 원문 질문을 대조합니다" bridge="세 전통이 행동·원칙·성품 중 어디에 초점을 두는지 원문에서 확인했습니다. 같은 답을 내는 경우와 충돌을 나눕니다.">
        <div className="space-y-6">
          <SourceApplication source="J. S. Mill · Utilitarianism, Chapter II" excerpt="right in proportion as they tend to promote happiness" application="도시락 결정이 회사 비용만이 아니라 모든 영향받는 사람의 고통과 안전에 어떤 결과를 만드는지 묻게 됩니다." />
          <SourceApplication source="Immanuel Kant · Groundwork, Second Section (T. K. Abbott 역)" excerpt="Act only on that maxim whereby thou canst at the same time will that it should become a universal law" application="알고 있는 위험을 비용 때문에 숨기는 규칙을 누구나 사용해도 성분 표시 약속이 유지되는지 시험합니다." />
          <SourceApplication source="Aristotle · Nicomachean Ethics, Book II ch. 6 (D. P. Chase 역)" excerpt="a state apt to exercise deliberate choice, being in the relative mean, determined by reason" application="회수 한 번의 외형뿐 아니라 책임자가 정직과 신중함을 반복 가능한 습관으로 만드는지 봅니다." />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <CitationBlock source="Mill, Utilitarianism II" citeKey={1} href="https://www.gutenberg.org/files/11224/old/11224-h/11224-h.htm">행동의 옳음을 행복과 고통에 미치는 경향으로 설명하는 원문입니다.</CitationBlock>
          <CitationBlock source="Kant, Groundwork II" citeKey={2} href="https://www.gutenberg.org/files/5682/5682-h/5682-h.htm">행동의 준칙을 보편 법칙으로 의지할 수 있는지 묻는 원문입니다.</CitationBlock>
          <CitationBlock source="Aristotle, Nicomachean Ethics II" citeKey={3} href="https://www.gutenberg.org/files/8438/8438-h/8438-h.htm">덕을 선택과 습관에 연결하는 원문입니다(링크는 D. P. Chase 역). 같은 정의를 W. D. Ross 역은 “a state of character concerned with choice”로 옮기는 것처럼, 밀·칸트(T. K. Abbott 역)·아리스토텔레스 번역의 낱말을 하나의 현대 분류와 완전히 같다고 보지 않습니다.</CitationBlock>
        </div>
      </LessonSection>

      <LessonSection id="comparison" level="6" title="9. 세 관점이 같은 답을 낼 때와 갈릴 때를 나눕니다" bridge="결론이 같아도 이유가 다르고, 갈릴 때는 숨은 우선순위가 드러난다는 점을 확인했습니다. 숫자 밖의 책임을 정리합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">도시락 사례에서는 중증 피해 예방, 정확한 정보 제공 의무, 정직한 조직 습관이 모두 회수를 지지할 수 있습니다. 이때 “어차피 결론이 같으니 이론은 필요 없다”고 하면 상황이 바뀌었을 때 무엇을 유지해야 하는지 모릅니다.</p>
          <p className="leading-8">예를 들어 회수 과정 자체가 더 큰 안전 위험을 만들거나, 두 환자 중 한 명만 도울 수 있거나, 지켜야 할 두 약속이 충돌하면 답이 갈릴 수 있습니다. 그때 피해의 분배, 침해할 수 없는 권리, 장기적인 성품과 제도를 어느 순서로 보았는지 적어야 다른 사람이 판단을 검토할 수 있습니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="limits" level="7" title="10. 숫자 밖의 분배와 제도 책임을 남겨 둡니다" bridge="윤리 판단을 수치 하나로 닫지 않고 사실·권리·습관·책임자를 함께 기록할 기준을 세웠습니다. 아래 질문으로 사례를 다시 풀어봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">2%와 5000만원은 설명을 위한 가정이며 실제 위해 평가는 식품 종류, 노출량, 고객 특성, 의료 접근성에 따라 달라집니다. 예상 비용을 사람의 가치로 읽어서는 안 됩니다. 숫자는 선택의 일부 결과를 비교하는 도구일 뿐입니다.</p>
          <p className="leading-8">개인의 좋은 마음으로 시스템 책임을 대신할 수도 없습니다. 성분 관리, 이중 확인, 추적 가능한 배치, 연락 권한과 보상 절차를 조직이 마련해야 합니다. 윤리적 판단은 사고 뒤 책임자를 비난하는 데서 끝나지 않고, 다음 사람이 더 나은 선택을 하기 쉬운 제도를 만드는 데까지 이어집니다.</p>
        </div>
        <ReviewPrompts questions={[
          "회수와 미회수의 기대 비용이 모두 100만원이어도 부담의 분배는 어떻게 다른가요? (답: 4절)",
          "고객에게 위험을 알리는 의무는 결과 계산과 별도로 어떤 선택권을 지키나요? (답: 7절)",
          "정직한 담당자 한 명만 두는 것보다 조직 절차가 필요한 이유는 무엇인가요? (답: 10절)",
        ]} />
      </LessonSection>
    </div>
  );
}
