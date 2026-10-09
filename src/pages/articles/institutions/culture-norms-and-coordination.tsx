import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">계약서에 적지 않은 예상도 사람을 움직입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">새로운 시장에 가게를 열면 임대료뿐 아니라 주변 사람들과 일을 맞추는 방식도 배워야 합니다. 물건이 늦었을 때 누가 먼저 연락하는지, 공동 비용은 언제 내는지, 이견을 어디서 이야기하는지 알아야 일이 이어집니다.</p>
          <p className="leading-8">이 글은 이런 약속을 사람들이 어떻게 예상하고 지키게 되는지 다룹니다. 한 나라 사람의 성격을 분류하는 대신 가게들이 공동 비용을 모으는 작은 장면을 따라갑니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">사람 사이의 예상이 어떤 일을 하는지 질문을 잡았습니다. 약속이 실제 결과가 되는 길부터 봅니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">약속한 일·실제 행동·다음 판단이 이어집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            가게들은 돈을 모아 공동 공간을 청소하기로 합니다. 돈을 걷는 사람이 기록하고 일하는 사람이 청소하고 가게들은 결과를 봅니다. 청소가 잘되고 비용도 납득되면 다음번에도 참여할
            이유가 생깁니다.
          </p>
          <p className="leading-8">반대로 누가 냈는지 알 수 없거나 결과를 확인할 수 없으면 예상이 흔들립니다. 사람들은 다른 가게도 내지 않을 것이라 생각해 납부를 미룰 수 있습니다. 기록과 설명은 이 예상이 바뀌는 지점에 놓입니다.</p>
        </div>

        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">약속과 결과 사이에 관찰이 필요하다는 점이 보입니다. 같은 시장에 금액을 붙입니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">가게 10곳이 2만원씩 모아 16만원의 청소비를 냅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            (가정) A시장에는 가게 10곳이 있습니다. 매달 한 곳당 2만원씩 내고 공동 청소비는 16만원입니다. 다른 비용은 생략하며 모두가 청소의 혜택을 받는다고 놓습니다. 모두
            납부하면 20만원을 모아 4만원이 남습니다.
          </p>
          <p className="leading-8">남은 4만원을 다음 달에 넘길지 돌려줄지 아직 정하지 않았습니다. 청소가 부실하면 누가 문제를 제기할지도 비어 있습니다. 금액을 계산했다고 공동 작업의 규칙까지 완성된 것은 아닙니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">20만원과 16만원의 차이는 4만원입니다. 그 돈이 실제로 모이고 쓰이는 장면을 나눠봅니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">깨끗해진 거리만 봐서는 누가 비용을 냈는지 알 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">돈을 걷는 기록에는 10곳의 납부 여부가 남습니다. 청소 기록에는 언제 어디를 정리했는지 남습니다. 두 기록을 연결해야 납부 약속과 구매한 서비스가 맞는지 볼 수 있습니다.</p>
          <p className="leading-8">회비를 안 낸 가게도 같은 거리를 사용합니다. 청소 결과만으로 성실한 납부와 비용을 다른 사람에게 떠넘긴 행동을 구분할 수 없는 이유입니다. 그렇다고 미납이 언제나 고의인 것도 아니므로 사정을 확인할 절차가 필요합니다.</p>
        </div>
        <NumericPath title="(가정) 공동청소의 돈 경로" steps={[{"label": "가게들의 약속", "value": "10×2만원", "detail": "납부기록 확인"}, {"label": "모인 돈", "value": "20만원", "detail": "담당자가 보관"}, {"label": "서비스 지급", "value": "16만원", "detail": "청소결과 확인"}, {"label": "남은 돈", "value": "4만원", "detail": "처리규칙 필요"}]} />

        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">결과와 기여를 따로 관측해야 한다는 점을 확인했습니다. 기록 외에 필요한 장치를 살펴봅니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">분담·관찰·이의 절차가 각각 다른 문제를 해결합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">분담 규칙은 얼마를 누구에게 걷는지 정합니다. 같은 2만원이 언제나 공정한 것은 아닙니다. 가게 크기와 이용량, 감당할 수 있는 정도를 고려할 것인지 구성원이 정해야 합니다. 규칙을 바꿀 사람이 누구인지도 함께 정합니다.</p>
          <p className="leading-8">관찰은 실제 납부와 청소를 확인합니다. 이의 절차는 기록이 틀렸거나 예외 사정이 있을 때 고치는 길입니다. 납부명단이 잘 보여도 반론할 수 없다면 억울한 기록이 계속 남을 수 있습니다.</p>
          <p className="leading-8">규칙을 어겼을 때의 대응은 이런 확인 뒤에 옵니다. 안내·정정·지급 일정 조정과 반복 위반에 대한 대응을 구분할 수 있습니다. 구체적인 제재를 할 수 있는지는 계약과 현지 법도 확인해야 합니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">각 장치는 분담·사실 확인·정정이라는 다른 일을 맡습니다. 익숙한 용어를 이 역할에 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">사회 규범은 다른 사람이 무엇을 할지에 대한 기대를 포함합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">다른 가게도 회비를 낼 것이라는 예상과 회비를 내야 옳다는 믿음은 다릅니다. 이처럼 행동과 바람직함에 대한 공유된 기대를 사회 규범이라고 부릅니다. 실제로 돈을 냈는지는 다시 관측해야 합니다.</p>
          <p className="leading-8">여러 사람이 함께 얻는 편익을 만들기 위해 행동을 맞추는 문제를 공동 행동이라고 부릅니다. 이 사례에서 비용을 내지 않고 청소의 혜택을 누리는 행동은 무임승차입니다. 미납 원인을 확인하기 전 모든 미납자를 같은 의도로 분류하지 않습니다.</p>
          <p className="leading-8">문화는 이런 생활 방식과 가치·표현·전통·믿음이 형성되고 바뀌는 더 넓은 맥락입니다. 종교 행사나 가족 관계, 인사 방식이 무엇을 의미하는지 이해하는 데 도움을 줍니다. 나라별 점수 하나로 개인의 믿음을 대신할 수는 없습니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">관찰한 행동과 기대, 문화의 범위를 나눴습니다. 같은 10개 가게가 약속을 어겼을 때 계산을 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">미납이 2곳일 때와 3곳일 때 결과가 달라집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">모두 납부하면 10×2=20만원에서 16만원을 내고 4만원이 남습니다.2곳이 미납하면 8×2=16만원으로 청소비만 충당합니다. 세 번째 가게도 내지 않으면 7×2=14만원이 되어 2만원이 부족합니다.</p>
          <p className="leading-8">돈을 걷는 담당자는 먼저 납부기록과 지급일을 대조합니다. 입금이 잘못 연결됐는지, 일시적 어려움이 있는지 확인하고 당사자에게 설명할 기회를 줍니다. 부족한 2만원을 임시로 누가 낼지와 나중에 어떻게 돌려받을지도 문서에 남깁니다.</p>
          <p className="leading-8">청소를 줄이면 거리를 함께 쓰는 모두에게 결과가 나타납니다. 다음 달 납부가 더 줄어들 수도 있습니다. 이 방향은 가정의 가능한 경로이며 실제 결과는 서비스 만족도·소득·관계에 따라 달라집니다. 규칙을 고칠 때는 납부율과 청소 품질을 함께 봅니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">20→16→14만원의 차이가 공동 결과를 바꿨습니다. 문화의 원문은 이런 규칙을 얼마나 넓게 일반화할 수 있는지 경계를 줍니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 문화 안에서도 시간과 장소에 따라 규칙은 달라집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">UNESCO 선언 제 1조는 문화가 시간과 공간에 따라 다양한 형태를 가진다고 설명합니다. A시장의 월 2만원 분담 방식도 한 시점과 장소의 약속입니다. 같은 나라의 다른 시장이 영업시간이나 점포 구성 때문에 다른 분담법을 쓸 수 있습니다.</p>
          <p className="leading-8">지역·세대·직업·종교·이주 경험이 다르면 같은 행사나 약속의 의미도 달라질 수 있습니다. 새로운 점주가 들어오면 이전에는 설명하지 않아도 알던 규칙을 명확히 적어야 할 수 있습니다. 변화를 문화의 부재로 부르기 전에 누가 어떤 의미로 참여하는지 확인합니다.</p>
          <p className="leading-8">이 원문은 특정 회비 규칙의 성능을 증명하는 연구가 아닙니다. 사례에 적용하는 지점은 규칙을 문화적 고정값으로 취급하지 않는다는 원칙입니다. 실제 납부율과 비용은 해당 시장에서 따로 확인해야 합니다.</p>
        </div>

        <SourceApplication source="UNESCO · 문화다양성 선언 제 1조" excerpt="Culture takes diverse forms across time and space." application="A시장 10곳의 월 2만원 약속은 지역·시대·구성원에 따른 한 사례입니다. 다른 시장도 같은 목적을 가질 수 있지만 참여 방식과 비용 분담은 달라질 수 있습니다." />
        <CitationBlock source="UNESCO · 문화다양성 선언 제 1조" citeKey={1} href="https://www.unesco.org/en/legal-affairs/unesco-universal-declaration-cultural-diversity">2001-11-02 채택. 같은 선언의 두 짧은 인용은 8단어와 11단어로 합계 19단어입니다. 확인 2026-10-04, 단어 수 재확인 2026-10-09.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">관행이 바뀔 수 있다는 경계를 확인했습니다. 오래 이어졌다는 이유로 정당해지지 않는 부분도 있습니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">잘 작동하는 관행도 참여자의 권리를 확인해야 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">가게 10곳에서 20만원을 빠르게 모아도 특정 출신 점주는 회의에서 말할 수 없게 한다면 다른 문제가 생깁니다. 돈을 잘 걷는 성과와 구성원을 어떻게 대하는지는 별도의 판단입니다.</p>
          <p className="leading-8">UNESCO 선언 제 4조는 문화다양성을 인권침해의 정당화 근거로 쓸 수 없다는 원칙을 둡니다. A시장의 약속을 검토할 때도 문화라는 말로 질문을 닫지 않고 참여·정보 접근·정정의 기회를 확인합니다. 실제 구제 절차와 위법 여부는 관할 법률과 사건의 사실관계에서 판단합니다.</p>
          <p className="leading-8">다른 나라로 사업을 넓힐 때에는 현지 언어와 관행을 이해하면서 의사결정과 책임을 명확히 해야 합니다. 규칙의 목적이 같아도 영업일·의사소통·분담 방식은 조정할 수 있습니다. 상대를 존중하는 것과 모든 관행을 그대로 받아들이는 것은 같은 판단이 아닙니다.</p>
        </div>

        <SourceApplication source="UNESCO · 문화다양성 선언 제 4조" excerpt="No one may invoke cultural diversity to infringe upon human rights" application="20만원을 모으는 과정이 효율적이어도 특정 출신의 점주를 회의와 정정 절차에서 배제할 근거가 되지는 않습니다. 분담 규칙의 성과와 참여자의 권리는 별도로 확인합니다." />
        <CitationBlock source="UNESCO · 문화다양성 선언 제 4조" citeKey={2} href="https://www.unesco.org/en/legal-affairs/unesco-universal-declaration-cultural-diversity">문화의 차이를 인권침해의 근거로 사용할 수 없다는 원칙. 선언과 국내법 구제 절차는 구분합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">협력의 효과와 권리의 조건을 함께 확인했습니다. 마지막으로 문화가 만능 설명이 되는 순간을 경계합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">문화라는 한 단어 뒤에 비용과 권력이 숨을 수 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">납부율이 높은 시장을 보고 그 나라 사람은 협조적이라고 말하면 빠진 변수가 많습니다. 매출이 안정적이거나 청소의 이익이 크거나 담당자가 기록을 잘 공개했을 수 있습니다. 규칙 변경 전후와 비슷한 시장을 비교해야 이유를 좁힐 수 있습니다.</p>
          <p className="leading-8">
            작은 경제 변화도 행동을 바꿉니다. 가게 1곳이 문을 닫아 9곳만 남으면 모두 내더라도 18−16=2만원이 남습니다. 원래 4만원보다 줄어듭니다. 이 사례에서 같은 관행을
            유지했는데도 결과가 달라진 이유는 납부자 수입니다.
          </p>
          <p className="leading-8">Ostrom의 원문 인터뷰 역시 장기간 유지된 제도의 공통 원리를 찾는 일과 그 원리를 각 체계에 적용하는 방식을 구분합니다. 그는 오래 버틴 체계들의 공통점을 &ldquo;설계 원리(design principles)&rdquo;라고 불렀습니다.</p>
          <p className="leading-8">1990년 책 『Governing the Commons』 90쪽 표 3.1은 이 원리를 여덟 개로 적습니다. 그중 다섯 개가 이 글의 장치와 짝지어집니다. 회비 2만원을 누구에게 얼마나 걷을지 정하는 분담 규칙은 둘째 원리, 그 규칙을 누가 바꾸는지는 셋째 원리에 해당합니다. 납부와 청소를 확인하는 관찰은 넷째, 미납 대응을 안내·정정·반복 위반으로 나누는 일은 다섯째, 이의 절차는 여섯째 원리입니다.</p>
          <p className="leading-8">같은 쪽에서 Ostrom은 이 목록이 아직 추측 단계이며 제도가 오래가기 위한 필요조건이라고 주장할 준비가 되지 않았다고 씁니다. 표를 이끈 3장의 사례도 스위스 산지 목초지나 필리핀 관개 조직처럼 여럿이 함께 쓰는 자원을 관리하는 제도입니다. 공동 청소 회비는 그 틀을 빌려 읽는 것이고, 이 글의 가게 계산은 실증 결과가 아니라 원인을 분리하기 위한 가정입니다. 문화·비용·권리·집행을 각각 기록할 때 비교가 선명해집니다.</p>
        </div>
        <div className="my-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="mb-3 text-left text-sm leading-6">이 글의 장치와 Ostrom(1990) 표 3.1의 원리. 원리 설명은 원문을 줄여 옮긴 것입니다.</caption>
            <thead><tr><th scope="col" className="p-2">이 글의 장치</th><th scope="col" className="p-2">표 3.1의 원리</th><th scope="col" className="p-2">원문의 요지</th></tr></thead>
            <tbody>{[
              ["분담 규칙", "2. 이용·제공 규칙과 현지 조건의 일치", "노동·물자·돈을 요구하는 제공 규칙이 현지 조건에 맞춰집니다."],
              ["규칙을 바꿀 사람", "3. 집단적 선택 장치", "규칙의 영향을 받는 사람 대부분이 규칙 수정에 참여합니다."],
              ["납부·청소 관찰", "4. 감시", "감시자는 이용자에게 책임을 지거나 이용자 자신입니다."],
              ["안내·정정·반복 위반 대응", "5. 단계적 제재", "위반의 심각성과 맥락에 따라 단계를 나눠 제재합니다."],
              ["이의 절차", "6. 갈등 해결 장치", "싸고 빠르게 이용할 수 있는 현지의 해결 자리가 있습니다."],
            ].map(([device, principle, gist]) => <tr key={device} className="border-t border-border"><th scope="row" className="p-2 font-normal">{device}</th><td className="p-2">{principle}</td><td className="p-2">{gist}</td></tr>)}</tbody>
          </table>
        </div>

        <CitationBlock source="Elinor Ostrom · Nobel 인터뷰 원문" citeKey={3} href="https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/164465-ostrom-williamson-interview-transcript/">원문에서 장기간 유지된 제도의 공통 원리를 실제 적용할 방식은 체계마다 다르다고 설명합니다. 본문 10개 가게 계산은 연구 실측이 아닙니다.</CitationBlock>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">사람들의 행동을 이해하려면 기대뿐 아니라 선택할 수 있었던 조건도 함께 봐야 합니다. 다음 질문으로 둘을 구분해 봅니다.</p>
        <ReviewPrompts questions={["세 번째 가게가 회비를 내지 않으면 청소비 장부는 어떻게 바뀔까요? (답: 7절)", "납부명단을 공개했다는 사실만으로 공정한 규칙이라고 할 수 있을까요? (답: 9절)", "협력이 잘되는 이유를 문화라고 말하기 전에 무엇을 비교해야 할까요? (답: 10절)"]} />
      </section>
    </div>
  );
}
