import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">버린 물건이 수거됐다는 사실은 과정의 시작입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            포장재를 분리해 버리면 다시 제품이 될 것이라고 기대합니다. 하지만 수거 뒤에도 섞인 재료를 가르고 오염을 제거하고 다시 쓸 품질로 만들어야 합니다. 그 과정에서 사용할 수
            없는 부분이 나오고 사람·설비·에너지가 필요합니다.
          </p>
          <p className="leading-8">이 글은 사용이 끝난 물건의 양과 처리에 드는 돈을 함께 추적합니다. 환경에 좋은지 판단하기 전에 실제로 무엇이 얼마나 돌아오고 누가 비용을 냈는지를 분명히 합니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">버린 뒤의 행선지를 확인할 목적이 잡혔습니다. 전체 흐름을 먼저 봅니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">원료가 물건이 되고 사용 뒤 여러 갈래로 나뉩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            땅과 생물에서 얻은 원료는 가공을 거쳐 제품이 됩니다. 오래 쓰거나 고쳐 쓰는 물건도 있고 사용이 끝나 수거되는 물건도 있습니다. 수거된 뒤 다시 재료가 되는 부분과 별도
            처리되는 부분이 갈립니다.
          </p>
          <p className="leading-8">
            그 옆에는 돈의 흐름이 있습니다. 소비자와 생산자, 지자체가 비용을 나눠 낼 수 있고 다시 만든 재료를 사는 업체도 있습니다. 물건의 이동과 돈의 지급이 같은 방향일 필요는
            없습니다.
          </p>
        </div>

        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">물질과 돈을 따로 따라갈 준비가 됐습니다. 한 종류의 포장재 100kg을 놓습니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">100kg 중 80kg을 모으고 그중 75%를 회수합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">(가정) 사용이 끝난 같은 종류의 포장재 100kg이 있습니다.80kg을 모으고 20kg은 수거되지 않습니다. 모은 80kg의 75%만 다시 쓸 재료가 됩니다. 수분과 추가 투입, 재고의 증감은 생략해 같은 기준의 질량을 비교합니다.</p>
          <p className="leading-8">(가정) 수거비 4만원, 선별·재처리비 6만원, 잔여물 처리비 2만원입니다. 회수한 재료는 1kg당 1000원에 팔 수 있다고 놓습니다. 이것은 특정 국가나 재료의 실제 단가가 아닙니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">물질의 분모 100kg과 처리비용을 고정했습니다. 분기마다 남는 양을 확인합니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">60kg은 돌아오고 40kg은 다른 경로에 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">수거된 80kg에 75%를 곱하면 60kg의 재료가 나옵니다. 처리 과정의 잔여물은 20kg입니다. 처음에 수거되지 않은 20kg과 합치면 다시 재료가 되지 않은 양은 40kg입니다.</p>
          <p className="leading-8">100=20+20+60으로 처음 양을 확인할 수 있습니다. 여기서 미수거 20kg의 최종 처리나 유출 여부는 아직 모릅니다. 모았지만 남은 20kg도 소각·매립·다른 처리 중 어디로 가는지 확인해야 합니다. 계산에서 제외했다고 없어지는 물질은 아닙니다.</p>
        </div>
        <NumericPath title="(가정) 같은 재료 100kg의 분기" steps={[{"label": "사용종료", "value": "100kg", "detail": "같은질량기준"}, {"label": "수거", "value": "80kg", "detail": "미수거 20kg"}, {"label": "회수비율 적용", "value": "×75%", "detail": "처리잔여 20kg"}, {"label": "다시쓸재료", "value": "60kg", "detail": "총량대비 60%"}]} />

        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">100kg의 각 행선지를 맞췄습니다. 왜 모으는 단계와 다시 쓰는 단계가 다른지 살펴봅니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">품질과 판매처가 없으면 모인 양이 쌓이기만 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">서로 다른 재질이 붙어 있거나 오염이 심하면 분리 비용이 커집니다. 회수 재료가 원래 제품의 안전·강도·위생 기준을 만족하는지도 확인해야 합니다. 무게가 같다는 이유로 같은 용도에 바로 투입할 수는 없습니다.</p>
          <p className="leading-8">재료를 실제로 살 업체도 필요합니다. 새 원료가 싸지거나 주문이 줄면 회수품이 쌓일 수 있습니다. 수거량만 성과로 잡으면 비용을 들여 모은 뒤 어디에 쓰였는지 놓칠 수 있습니다.</p>
          <p className="leading-8">설계 단계에서 수리·분해·분리가 쉬우면 뒤의 작업이 달라집니다. 같은 기능을 더 오래 제공하면 버려지는 물건의 양 자체도 줄일 수 있습니다. 재료로 되돌리는 단계와 제품을 오래 쓰는 단계는 서로 다른 경로입니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">회수량에 품질과 수요 조건을 더했습니다. 세 비율과 책임에 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">수거율·회수 수율·생산자 책임을 구분합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            발생한 100kg 가운데 모은 80kg의 비율은 수거율 80%입니다. 수거한 80kg 가운데 회수한 60kg의 비율은 처리 수율 75%입니다. 처음 100kg을 분모로 계산하면
            실제 재료 회수 비율은 60%입니다. 분모를 생략하면 같은 숫자를 다른 성과로 읽게 됩니다.
          </p>
          <p className="leading-8">제품을 판매한 뒤의 수거와 처리까지 생산자의 책임을 넓히는 정책을 확대생산자책임(Extended Producer Responsibility), 줄여서 EPR이라고 부릅니다. 한국에서 시행하는 &lsquo;생산자책임재활용제도&rsquo;는 이 일반 개념을 적용한 한국 제도의 이름이며, 그 대상 품목과 의무 방식은 이 글에서 법령 원문으로 확인하지 않았습니다. 책임은 돈을 내는 방식이나 실제 회수·처리의 의무 등으로 정할 수 있습니다. 구체적인 대상과 방식은 현지 제도에서 확인합니다.</p>
          <p className="leading-8">제품과 재료를 오래 사용해 새로운 자원 투입과 버리는 양을 줄이려는 관점을 순환경제라고 부릅니다. 이름에 순환이 들어가도 모든 재료가 손실 없이 같은 품질로 무한히 돌아온다는 뜻은 아닙니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">비율의 분모와 책임의 대상을 나눴습니다. 처음 100kg과 처리비 장부를 끝까지 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">60kg을 팔아 6만원을 받아도 처리비 12만원이 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">발생 100kg 중 80kg을 수거해 60kg을 회수했습니다.80kg을 재활용했다고 적으면 실제 재료 회수 60kg보다 20kg을 과장합니다. 분류상 재활용의 인정 시점이 다른 제도와 비교할 때에는 법적 집계 정의도 함께 적어야 합니다.</p>
          <p className="leading-8">회수품 60kg을kg당 1000원에 팔면 6만원입니다. 수거 4만원+재처리 6만원+잔여물 2만원=12만원이므로 추가로 6만원의 재원이 필요합니다. 요금·생산자 부담·세금 등 누가 채울지 결정하지 않으면 운영이 계속되기 어렵습니다.</p>
          <p className="leading-8">(가정) 판매가격만kg당 800원으로 떨어지면 수입은 4만 8000원이고 부족액은 7만 2000원입니다. 물질을 같은 60kg 회수했어도 재무 결과가 바뀝니다. 품질과 판로, 비용을 함께 봐야 하는 이유입니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">물질 회수의 성과와 자금 부족을 같이 계산했습니다. 원문 그림에서도 두 종류의 화살표를 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">OECD 그림은 물건의 이동과 돈의 지급을 다르게 그립니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">OECD의 플라스틱 보고서 Figure6.4는 제품·포장·폐기물의 흐름을 실선 블록 화살표로, 돈의 흐름을 점선으로 구분합니다. 이 구분을 100kg 사례에 적용하면 수거·처리·회수의 양과 판매·부담금의 금액을 같은 장부에 섞지 않게 됩니다.</p>
          <p className="leading-8">60kg을 누가 받아 어떤 용도에 썼는지 물질 경로에 적습니다.6만원의 판매대금과 추가 재원을 누가 냈는지는 돈의 경로에 적습니다. 물건이 국경을 넘으면 운송·통관·실제 처리시설의 확인도 필요합니다.</p>
          <p className="leading-8">보고서의 그림은 이 사례의 75% 수율이나 12만원 비용을 뒷받침하는 실측이 아닙니다. 그런 수치는 재료·설비·지역별 자료로 채워야 합니다. 여기서는 서로 다른 흐름을 구분하는 도구를 가져옵니다.</p>
        </div>

        <SourceApplication source="OECD · Global Plastics Outlook, Box6.4·Figure6.4" excerpt="The block arrows represent physical flows of products, packaging or waste." application="100→80→60kg은 물질 이동입니다. 판매수입 6만원과 부족분 6만원은 돈의 이동입니다. 생산자가 6만원을 낸다고 60kg이 100kg으로 늘거나 처리비용 12만원이 사라지지 않습니다." />
        <CitationBlock source="OECD · Global Plastics Outlook, Box6.4·Figure6.4" citeKey={1} href="https://www.oecd.org/en/publications/global-plastics-outlook_de747aef-en/full-report/component-11.html">Figure6.4는 물리적 물질 이동과 돈의 흐름을 다른 화살표로 구분합니다.100kg 계산은 본문 가정입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">수치가 어떤 원문 원리와 연결되고 어떤 부분은 가정인지 확인했습니다. 처리 책임의 원문을 읽습니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">판매 뒤의 책임을 연결해도 실물 비용은 사라지지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">OECD의 2024년 EPR 설명은 소비자가 사용한 뒤의 단계까지 책임을 확장합니다. 사례에서 생산자가 부족액 6만원을 내도록 설계할 수 있습니다. 판매수입 6만원과 합쳐 12만원을 충당하지만 수거와 처리에 든 자원이 0이 되는 것은 아닙니다.</p>
          <p className="leading-8">생산자는 그 비용 일부를 제품 가격에 반영할 수도 있습니다. 그러면 법적으로 돈을 내는 주체와 최종적으로 경제적 부담을 지는 사람이 다를 수 있습니다. 소비자 부담이 반드시 6만원 줄었다거나 모든 비용을 기업 주주만 부담한다고 결론 내릴 수 없습니다.</p>
          <p className="leading-8">실제 제도는 품목·보고 시점·실적 검증·미이행 책임을 정합니다.60kg이 실제로 회수됐는지와 잔여물이 적정하게 처리됐는지 확인해야 돈을 납부한 사실을 환경 성과로 바꾸어 쓰지 않을 수 있습니다. 다른 나라에 적용할 때에는 현지 원문으로 이 항목을 다시 채웁니다.</p>
        </div>

        <SourceApplication source="OECD · Extended Producer Responsibility, Abstract (2024)" excerpt="including at the post-consumer stage" application="판매가 끝난 100kg의 처리에도 생산자의 재정·운영 책임을 연결할 수 있습니다. 사례의 부족액 6만원을 부담하게 설계한다면 실제 60kg 회수와 잔여물처리를 확인해야 하며 납부만으로 실적을 인정하지 않습니다." />
        <CitationBlock source="OECD · Extended Producer Responsibility, Abstract (2024)" citeKey={2} href="https://www.oecd.org/en/publications/extended-producer-responsibility_67587b0b-en.html">제품 사용 후 단계까지 생산자 책임을 확장하는 정책 원리. 품목·부담방식·법적의무는 관할마다 다릅니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">비용을 누가 내는지와 어떤 환경 결과가 났는지를 나눴습니다. 마지막으로 회수량이 지표의 전부가 아닌 이유를 봅니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">덜 버리는 것과 더 많이 회수하는 것은 다른 성과입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            (가정) 재생재료 60kg을 새 원료와 같은 품질로 모두 쓸 수 있습니다. 새 제품의 필요량이 100kg이면 새 원료 40kg이 필요하지만 수요가 120kg으로 늘면 60kg이
            필요합니다. 회수량이 같아도 전체 수요가 커지면 새 원료 사용이 늘 수 있습니다.
          </p>
          <p className="leading-8">(가정) 반대로 제품을 오래 써서 발생량을 100kg에서 80kg으로 줄이고 수거율 80%·처리수율 75%를 유지하면 회수량은 48kg입니다.60kg보다 작지만 폐기물 발생 자체가 20kg 줄었습니다. 회수된 톤수 하나만으로 정책의 성패를 정할 수 없습니다.</p>
          <p className="leading-8">UNEP의 2024년 전망에서 2060년 자원 추출량이 2020년보다 60% 늘 수 있다는 설명도 정책과 수요의 조건이 있는 시나리오입니다. 확정된 미래가 아니며 이 글의 60% 재료 회수와도 다른 수치입니다.</p>
          <p className="leading-8">
            제품을 비교할 때에는 같은 기능을 얼마나 오래 제공하는지부터 맞춥니다. 제조·세척·운송·재사용 횟수·처리의 경계를 정하고 온실가스·물 사용·유해성·일하는 조건을 각각
            확인합니다. 한 지표의 개선이 모든 영향을 함께 줄였다고 보장하지 않습니다.
          </p>
        </div>

        <CitationBlock source="UNEP·IRP · Global Resources Outlook2024" citeKey={3} href="https://www.unep.org/resources/Global-Resource-Outlook-2024">2020년 대비 2060년 추출량 증가를 조건부 전망으로 읽습니다. 보고서와 방법론의 범위를 확인하며 사례의 60%회수율과 섞지 않습니다.</CitationBlock>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">처음 양·회수량·비용·대체 효과를 분리하면 순환이라는 말을 실제 장부로 읽을 수 있습니다. 세 질문으로 그 차이를 확인합니다.</p>
        <ReviewPrompts questions={["수거 80kg을 그대로 재활용실적 80kg이라고 적으면 얼마나 과장되나요? (답: 7절)", "생산자가 6만원을 내면 소비자와 세금 부담은 반드시 6만원만큼 줄어들까요? (답: 9절)", "재활용량이 그대로 60kg인데 새 원료 투입이 늘 수 있을까요? (답: 10절)"]} />
      </section>
    </div>
  );
}
