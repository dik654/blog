import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function EvidenceModelsAndCausalExplanationArticle() {
  return (
    <div className="space-y-16">
      <LessonSection id="overview" level="S" title="1. 맞힌 횟수만으로 무엇이 원인인지 정할 수 없습니다" bridge="예측 성공과 인과 설명을 분리했습니다. 관측에서 개입까지의 전체 경로를 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">비 오는 날에는 우산 판매와 교통사고가 함께 늘 수 있습니다. 우산 판매량만으로 사고가 많은 날을 맞힐 수 있어도, 우산 판매를 금지한다고 사고가 줄지는 않습니다. 함께 움직인다는 기록과 무엇을 바꾸면 결과가 달라진다는 주장은 다릅니다.</p>
          <p className="leading-8">과학철학은 과학을 바깥에서 채점하는 말놀이가 아닙니다. 관측, 모형, 예측, 원인, 설명이 각각 어떤 증거를 요구하는지 묻습니다. 이 글은 100일의 날씨 기록으로 예측에 좋은 표지와 원인을 가르는 과정을 보여 줍니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="black-box" level="B" title="2. 관측·모형·예측·개입을 한 줄로 잇습니다" bridge="자료에서 행동 결정까지 네 단계를 나눴습니다. 숫자를 붙여 같은 상관을 만드는 두 모형을 비교합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">관측은 정해진 방법으로 얻은 기록입니다. 모형은 기록에서 중요한 관계만 남긴 표현입니다. 예측은 보지 않은 날의 결과를 맞히는 일이고, 개입은 한 값을 일부러 바꿨을 때 다른 값이 어떻게 달라지는지 묻는 일입니다.</p>
          <p className="leading-8">좋은 예측 모형이 언제나 원인 모형은 아닙니다. 사고가 날 가능성을 빨리 경보하는 목적에는 우산 판매량이 쓸모 있을 수 있지만, 사고를 줄일 정책을 고르려면 비·시야·노면·운전 행동의 경로가 필요합니다.</p>
        </div>
        <FlowRail title="기록에서 인과 설명까지" steps={[
          { actor: "관측", movement: "비·판매·사고를 같은 날짜 기준으로 기록합니다.", receives: "비교 가능한 자료" },
          { actor: "모형", movement: "함께 변하는 관계와 가능한 원인 경로를 표현합니다.", receives: "예측과 반례" },
          { actor: "개입", movement: "판매가 아니라 노면·속도를 바꿨을 때 사고가 달라지는지 봅니다.", receives: "정책에 쓸 설명" },
        ]} />
      </LessonSection>

      <LessonSection id="case" level="0" title="3. 우산 판매와 사고 100일의 기록을 만듭니다" bridge="우산 판매가 훌륭한 신호이면서 나쁜 원인 후보가 되는 자료를 만들었습니다. 숨은 비를 그림 밖으로 꺼냅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">100일 중 비가 온 날이 40일이라고 합시다. 우산이 많이 팔린 날은 42일이며, 그중 36일에 비가 왔습니다. 사고가 난 날은 25일이고, 그중 20일이 비 오는 날이었습니다. 숫자는 설명을 위한 가정입니다.</p>
          <p className="leading-8">우산 판매가 많은 42일 중 사고가 난 날이 18일, 판매가 적은 58일 중 사고가 난 날이 7일이라면 두 기록은 강하게 함께 움직입니다. 그러나 비가 우산 구매와 미끄러운 노면을 동시에 만든 경로가 이 상관을 설명할 수 있습니다.</p>
        </div>
        <NumericPath title="같이 늘어난 두 값 뒤에 비가 있습니다" steps={[
          { label: "관측 기간", value: "100일", detail: "비 40일" },
          { label: "우산 판매 많음", value: "42일", detail: "그중 사고 18일" },
          { label: "전체 사고", value: "25일", detail: "그중 비 오는 날 20일" },
        ]} />
      </LessonSection>

      <LessonSection id="picture" level="1" title="4. 비와 우산 판매가 함께 움직이는 이유를 드러냅니다" bridge="공통 원인과 결과를 화살표로 분리했습니다. 설명이 예측보다 더 필요한 순간을 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">첫 모형은 ‘우산 판매 → 사고’입니다. 둘째 모형은 ‘비 → 우산 판매’와 ‘비 → 시야·노면 → 사고’입니다. 두 모형 모두 관측된 상관과 맞을 수 있지만, 우산 판매를 줄였을 때의 예측은 서로 다릅니다.</p>
          <p className="leading-8">비 오는 날 우산 가게를 닫는 실험은 사고 원인에 거의 손대지 못합니다. 배수, 조명, 제한 속도를 바꾸는 개입은 원인 후보 경로를 직접 건드립니다. 화살표의 방향은 숫자 표만 보고 자동으로 정해지지 않으므로 시간 순서와 배경 지식, 실험이 필요합니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="need" level="2" title="5. 설명은 다음 상황에서 무엇을 바꿔야 할지 알려 줍니다" bridge="정확한 경보와 효과적인 개입이 다른 목적임을 확인했습니다. 각 역할에 이름을 붙입니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">내일 사고 위험을 알려 주는 서비스라면 우산 판매 신호도 쓸 수 있습니다. 다만 온라인 배송으로 판매 시점이 바뀌면 신호가 깨질 수 있습니다. 비와 노면이라는 경로를 알면 어떤 환경 변화에서 예측이 무너질지 더 잘 예상할 수 있습니다.</p>
          <p className="leading-8">설명은 사실 목록에 이야기를 덧붙이는 장식이 아닙니다. 어떤 변화에도 관계가 남는지, 어느 값을 건드리면 결과가 달라지는지, 실패했을 때 어느 가정을 고쳐야 하는지 보여 주는 역할을 합니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="names" level="3" title="6. 증거·모형·상관·인과 설명에 이름을 붙입니다" bridge="관측한 것과 모형이 덧붙인 것을 구분했습니다. 우산 판매 금지와 노면 개선의 결과를 같은 자료에서 비교합니다.">
        <TermBreakdown title="과학적 주장의 네 층" items={[
          { term: "경험적 증거", description: "관찰·측정·실험으로 얻어 주장을 지지하거나 약하게 만드는 기록입니다.", example: "100일의 비·판매·사고 기록입니다.", boundary: "자료는 수집 방법과 비교 기준을 떠나 스스로 말하지 않습니다." },
          { term: "과학적 모형", description: "대상의 일부 관계를 목적에 맞게 단순화한 표현입니다.", example: "비가 노면을 거쳐 사고 위험을 높인다는 화살표입니다.", boundary: "대상과 똑같은 복사본이 아니며 생략 범위를 밝혀야 합니다." },
          { term: "상관", description: "두 값이 자료에서 함께 변하는 정도입니다.", example: "우산 판매가 많은 날 사고 비율이 더 높습니다.", boundary: "방향과 공통 원인을 혼자 정하지 못합니다." },
          { term: "인과 설명", description: "원인의 변화가 어떤 경로로 결과의 변화를 만드는지 보이는 설명입니다.", example: "비가 시야와 마찰을 바꿔 사고 위험을 높입니다.", boundary: "개입 가능한 원인만이 모든 과학적 설명이라는 뜻은 아닙니다." },
        ]} />
      </LessonSection>

      <LessonSection id="mechanism" level="4" title="7. 우산 판매를 줄이는 개입과 비를 막는 개입을 비교합니다" bridge="같은 상관에서 서로 다른 개입 결과를 예측했습니다. 법칙에 맞는 설명도 방향을 놓칠 수 있는 반례를 봅니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">우산 판매가 많은 날 사고 확률은 18/42≈43%, 적은 날은 7/58≈12%입니다. 이 차이는 경보에는 유용합니다. 하지만 판매를 42일 모두 0으로 만드는 개입을 해도 비 오는 40일과 젖은 노면은 남으므로 사고 25건이 같은 비율로 줄어든다는 근거는 없습니다.</p>
          <p className="leading-8">반대로 비 오는 날의 20건 가운데 절반이 미끄러운 노면 경로를 거친다는 추가 증거가 있고, 배수 개선이 그 경로를 절반 줄인다면 기대 감소는 약 5건입니다. 이 계산도 개입이 운전량을 바꾸지 않는다는 가정을 둡니다.</p>
          <p className="leading-8">따라서 인과 계산은 상관표보다 더 많은 가정을 요구합니다. 그 대신 어떤 조치가 왜 효과를 낼지, 효과가 없을 때 노면 경로·운전량·측정 오류 가운데 무엇을 다시 볼지 알려 줍니다.</p>
        </div>
      </LessonSection>

      <LessonSection id="source" level="5" title="8. 법칙만으로 만든 설명의 비대칭 문제를 확인합니다" bridge="참인 규칙에 현상을 넣는 것만으로 설명이 완성되지 않는 이유를 봤습니다. 개입과 모형 목적을 현대 논의와 비교합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">20세기 과학 설명의 연역·법칙 모형은 초기 조건과 일반 법칙에서 현상을 논리적으로 이끌어 내려고 했습니다. 그러나 깃대 높이와 태양 각도로 그림자 길이를 구할 수 있다고 해서 그림자 길이가 깃대 높이의 원인인 것은 아닙니다. 논리적 도출만으로 설명 방향을 고르기 어렵습니다.</p>
          <p className="leading-8">우산 사례도 “판매가 많으면 사고가 많다”는 규칙에 오늘 판매량을 넣어 사고를 맞힐 수 있습니다. 그래도 왜 사고가 났는지에는 비와 노면 경로가 필요합니다. 참이고 예측력이 있는 문장도 질문에 관련된 원인을 빼면 설명이 얕을 수 있습니다.</p>
        </div>
        <SourceApplication source="Stanford Encyclopedia · Scientific Explanation" excerpt="true, accurate, supported by evidence ... yet unexplanatory" application="우산 판매 규칙이 자료와 맞고 예측에 성공해도 사고를 줄일 원인 경로를 주지 않으면 인과 설명은 아닙니다." />
        <CitationBlock source="Stanford Encyclopedia of Philosophy, Scientific Explanation" citeKey={1} href="https://plato.stanford.edu/entries/scientific-explanation/">법칙 모형, 통계적 관련성, 인과·통합·실용적 설명이 서로 어떤 문제를 해결하는지 정리한 전문 개관입니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="comparison" level="6" title="9. 개입과 모형의 목적에 따라 좋은 설명이 달라집니다" bridge="원인 설명도 하나의 만능 형식이 아니라는 점을 확인했습니다. 실험하기 어려운 대상과 여러 설명 수준의 한계를 남깁니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">개입주의 설명은 원인 후보를 바꿨을 때 결과가 어떻게 달라지는지 묻습니다. 우산 판매량만 바꾸는 경우와 배수를 바꾸는 경우를 구별하기 좋습니다. 관계가 여러 현실적인 개입에서도 안정적으로 유지되는지 보는 것이 핵심입니다.</p>
          <p className="leading-8">그러나 모든 설명이 원인 조작은 아닙니다. 행성 궤도, 진화 역사, 수학적 대칭, 통계역학처럼 실제 개입이 불가능하거나 구조적 제약이 답의 중심인 경우도 있습니다. 예측·인과·통합·이해라는 목적에 따라 좋은 단순화가 달라집니다.</p>
        </div>
        <SourceApplication source="Stanford Encyclopedia · Causal Approaches" excerpt="invariant under at least some interventions" application="판매 장소가 바뀌어도 비→노면→사고 관계가 유지되는지 물으면 단순한 판매 신호보다 옮겨 쓸 수 있는 설명인지 검사할 수 있습니다." />
        <CitationBlock source="Stanford Encyclopedia of Philosophy, Causal Approaches to Scientific Explanation" citeKey={2} href="https://plato.stanford.edu/entries/causal-explanation-science/">기제·개입·설명 깊이와 비인과 설명의 경계를 다루는 개관입니다.</CitationBlock>
      </LessonSection>

      <LessonSection id="limits" level="7" title="10. 실험할 수 없는 대상과 여러 수준의 설명을 남겨 둡니다" bridge="증거의 출처와 모형 목적을 밝히고 경쟁 설명을 개입 질문으로 가르는 절차를 세웠습니다. 아래 질문으로 다시 검사합니다.">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">관측 자료에서는 측정하지 않은 운전량이나 행사 일정이 비와 사고의 관계를 바꿀 수 있습니다. 무작위 실험도 순응 실패와 다른 지역 일반화 문제를 남깁니다. “실험했다”는 말보다 무엇을 무작위로 나눴고 어떤 결과를 얼마나 오래 쟀는지가 중요합니다.</p>
          <p className="leading-8">한 현상에는 여러 수준의 설명이 함께 필요할 수 있습니다. 사고는 타이어 마찰, 운전자 판단, 도로 설계, 단속 제도로 설명됩니다. 어느 하나가 참이라고 다른 설명이 사라지는 것은 아니며, 질문과 바꿀 수 있는 수단에 맞춰 수준을 고릅니다.</p>
        </div>
        <ReviewPrompts questions={[
          "우산 판매가 많은 날의 사고 확률 43%가 판매 금지 정책의 효과를 뜻하지 않는 이유는 무엇인가요? (답: 7절)",
          "참이고 예측력 있는 법칙도 설명이 아닐 수 있다는 비대칭 문제는 무엇인가요? (답: 8절)",
          "배수 개선이 사고를 약 5건 줄인다는 계산에는 어떤 추가 가정이 들어가나요? (답: 7절)",
        ]} />
      </LessonSection>
    </div>
  );
}
