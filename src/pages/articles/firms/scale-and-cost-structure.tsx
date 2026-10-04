import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";
import DetourViz from "./scale-and-cost-structure/viz/DetourViz";
import DifferentiationViz from "./scale-and-cost-structure/viz/DifferentiationViz";
import { methodCosts } from "./scale-and-cost-structure/model";

function MethodTable({ quantities }: { quantities: number[] }) {
  return <div className="my-6 overflow-x-auto"><table className="w-full text-left text-sm">
    <caption className="mb-3 text-left leading-6">(가정) 같은 부품의 전체 비용 · 가장 작은 값을 모두 표시합니다.</caption>
    <thead><tr><th scope="col" className="p-2">주문</th>{["A", "B", "C"].map(x => <th scope="col" className="p-2" key={x}>{x}</th>)}</tr></thead>
    <tbody>{quantities.map(n => { const c = methodCosts(n); return <tr key={n} className="border-t border-border"><th scope="row" className="p-2">{n}개</th>{c.rows.map(m => <td className="p-2" key={m.id}>{m.total}{m.total === c.minimum ? " (최저)" : ""}</td>)}</tr>; })}</tbody>
  </table></div>;
}

/** 같은 규격·기간·생산 여력의 가정 모형이며 실제 기업의 가격표가 아닙니다. */
export default function ScaleAndCostStructureArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 부품 20개와 100개에 같은 설비를 골라도 될까</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">같은 규격의 부품을 만드는 업체가 주문을 받았습니다. 간단한 도구로 바로 만들 수도 있고 설비를 먼저 갖춰 이후 작업을 줄일 수도 있습니다. 설비가 부품 하나를 빨리 만든다는 사실만으로 어떤 주문에서도 싼 방법이 되지는 않습니다.</p>
          <p className="leading-7">이 글은 부품 20개와 100개를 놓고 세 가지 방법의 전체 비용을 비교합니다. 같은 설비에 더 많은 물량을 넣는 효과와 다른 설비로 바꾸는 효과를 나눕니다. 여러 업체의 주문을 모으는 경우에도 같은 숫자를 사용해 무엇이 절약되고 어떤 비용이 새로 생기는지 보겠습니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-muted-foreground">먼저 주문 수량에서 방법 선택과 비용 계산으로 이어지는 순서를 잡습니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 같은 물건과 기간을 맞춘 뒤 전체 비용을 비교한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            비교할 것은 같은 기간에 같은 품질의 부품을 주문 수량만큼 만드는 일입니다. 각 방법을 쓰려면 처음에 드는 준비 비용과 부품 하나를 더 만들 때 드는 비용을 알아야 합니다.
            준비 비용에 개수만큼의 추가 비용을 더하면 전체가 나옵니다.
          </p>
          <p className="leading-7">
            숫자는 모두 설명을 위한 (가정)입니다. 세 방법 모두 제때 생산할 여력이 있고 필요한 수량을 미리 안다고 둡니다. 비교에서 생략한 재료비 등은 세 방법에서 같다고 둡니다.
            주문을 다 만들 수 없는 설비나 불량률이 다른 공정은 이 비용표만으로 비교할 수 없습니다.
          </p>
        </div>
        <FlowRail title="주문에서 비용 비교까지" steps={[
          { actor: "같은 규격의 주문", movement: "수량·품질·납기와 생산할 여력을 맞춥니다.", receives: "비교 가능한 작업" },
          { actor: "세 방법을 각각 계산", movement: "처음 비용 + 하나당 추가 비용 × 수량을 구합니다.", receives: "방법별 전체 비용" },
          { actor: "가장 작은 비용을 선택", movement: "동률인 방법도 남기고 예상 수량이 바뀌면 다시 비교합니다.", receives: "조건에 맞는 생산 방법" },
        ]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-muted-foreground">같은 작업에 세 가지 비용표를 붙입니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 20개라면 200, 140, 320 중에서 고른다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">A는 준비 비용 없이 부품마다 10이 듭니다. B는 처음 60을 쓰고 이후 하나마다 4를 씁니다. C는 처음 300을 쓰고 하나마다 1을 씁니다. 같은 화폐 단위의 (가정)이며 B와 C의 준비 비용은 서로 다른 대안의 전체 금액입니다. C를 고른다고 60과 300을 모두 내는 것은 아닙니다.</p>
          <p className="leading-7">20개를 만들면 A는 10 × 20 = 200입니다. B는 60 + 4 × 20 = 140이고 C는 300 + 1 × 20 = 320입니다. 이 주문에는 B가 가장 쌉니다. 하나당 평균은 140 ÷ 20 = 7입니다. 부품을 하나 더 만들 때의 4와 전체 비용을 나눈 7은 다른 값입니다.</p>
          <p className="leading-7">100개라면 A는 1,000, B는 460, C는 400입니다. 이번에는 C가 가장 쌉니다. C의 하나당 추가 비용 1이 가장 낮다는 사실은 두 주문에서 같았지만 처음에 쓰는 300을 나눌 수량이 달라졌습니다. 장비의 이름만 보고 고를 수 없는 이유입니다.</p>
        </div>
        <MethodTable quantities={[20, 100]} />
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-muted-foreground">수량을 바꿔도 부품과 비용표는 그대로 둡니다. 동률인 주문도 그림에서 확인합니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 5개·10개·20개·80개·100개를 같은 표로 비교한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">아래 그림은 세 방법의 준비 비용과 하나당 추가 비용을 보여 줍니다. 선택한 주문 수량을 곱해 전체 비용을 구하고 가장 작은 방법을 모두 표시합니다. 20개에서 출발해 작은 주문과 큰 주문을 비교할 수 있습니다.</p>
          <p className="leading-7">10개에서는 A와 B가 모두 100입니다. 80개에서는 B와 C가 모두 380입니다. 비용만 놓고 보면 같은 값인 방법은 둘 다 선택할 수 있습니다. 이후 글에서 더 싸진다고 말할 때는 동률을 포함하는지 구분하겠습니다.</p>
        </div>
        <DetourViz />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-muted-foreground">서로 다른 방법을 비교했습니다. 이번에는 B 하나를 그대로 두고 수량만 바꿉니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 방법을 바꾸지 않아도 평균은 내려갈 수 있다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">B를 그대로 사용할 때 20개의 전체 비용은 140, 평균은 7입니다. 100개의 전체 비용은 460, 평균은 4.6입니다. 설비도 부품마다 쓰는 4도 바꾸지 않았지만 처음의 60을 나누는 개수가 늘어 평균이 낮아졌습니다.</p>
          <p className="leading-7">따라서 평균비용이 내려간 것을 모두 방법 변경의 결과로 설명할 수는 없습니다. 같은 B 안에서 준비 비용을 더 많은 물량에 나누는 변화와 100개 주문에서 B의 460 대신 C의 400을 선택하는 변화가 함께 있을 수 있습니다.</p>
          <p className="leading-7">물론 실제로 수량만 늘리면 계속 같은 비용이 유지되는 것은 아닙니다. 설비 한도를 넘으면 새 장비나 교대 인력이 필요할 수 있고 불량·대기·재고가 늘 수도 있습니다. 여기서는 정한 범위 안에서 여력이 충분하다는 가정으로 두 효과를 구분했습니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-muted-foreground">준비 비용과 추가 비용, 평균의 차이를 확인했으니 용어를 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 고정비·변동비·평균비용과 방법 선택을 구분한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            정한 기간과 생산 범위에서 수량에 따라 바뀌지 않는 비용을 고정비라고 부릅니다. B에서 처음에 쓰는 60이 여기에 해당합니다. 수량에 따라 더해지는 변동비는 이 사례에서 4 ×
            수량입니다. 전체 비용을 수량으로 나눈 것이 평균비용입니다. 생산량이 0일 때 이 나눗셈은 정의되지 않습니다.
          </p>
          <p className="leading-7">설비를 만드는 일을 먼저 하고 이후 직접 작업을 줄이는 방식을 우회 생산이라고 부릅니다. Young의 논문은 이 방식과 산업 사이의 분업을 설명합니다. 이 글의 준비 비용과 하나당 비용은 그 생각을 계산해 보기 위한 모형입니다.</p>
          <p className="leading-7">방법 둘의 비용이 같아지는 수량을 여기서는 비용 동률 수량이라고 부르겠습니다. A와 B는 10개에서 같습니다. 이 수량을 넘어서야 B가 더 싸집니다. 수량이 정수라면 첫 개수는 11입니다. 이름만 보고 동률 수량과 엄격히 더 싼 최소 수량을 섞지 않도록 합니다.</p>
          <p className="leading-7">한 기업이 생산량을 늘리거나 방법을 바꿔 얻는 비용 절약은 내부 경제의 사례입니다. 산업의 전문화처럼 기업 밖의 변화가 그 기업의 비용 조건을 개선하면 외부 경제로 살펴볼 수 있습니다. 누구의 비용을 보는지 정해야 두 범위를 구분할 수 있습니다. 고정비를 나누는 사례 하나로 모든 투입을 늘렸을 때의 생산 법칙까지 증명하지는 않습니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-muted-foreground">같은 20개 주문을 준비 비용을 내기 전과 낸 뒤로 나눠 따라갑니다.</p>
      </section>
      <section id="roundabout" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 60을 내기 전의 선택과 이미 낸 뒤의 선택은 다르다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">아직 어느 설비도 갖추지 않았다면 20개 주문에 B를 선택해 먼저 60을 쓰고 가공하면서 80을 더 씁니다. 합계 140을 회수할 수 있는지는 판매가격과 대금 지급일을 따로 알아야 합니다. 가장 싼 생산 방법이라는 말은 주문 자체가 이익을 낸다는 말과 다릅니다.</p>
          <p className="leading-7">이제 B의 60을 이미 지출했고 돌려받을 수 없으며 새 주문 5개를 처리할 여력이 남았다고 가정합니다. 그 주문 때문에 추가로 쓰는 돈은 4 × 5 = 20입니다. A를 새로 선택해 50을 쓰는 것보다 작습니다. 이미 쓴 60을 이 주문의 추가 비용에 다시 넣어 80과 50을 비교하면 이후 선택이 달라집니다.</p>
          <p className="leading-7">이 계산은 과거의 투자가 성공했다는 판정이 아닙니다. 되팔 수 있는 설비의 가치, 다른 주문에 쓸 기회, 정비나 가동 재개 비용이 있으면 앞으로 달라지는 비용에 넣어야 합니다. 같은 60이라도 투자 전의 비교와 지출 후의 비교에서 역할이 달라집니다.</p>
        </div>

        <p data-stage-bridge="roundabout" className="mt-5 text-sm leading-7 text-muted-foreground">비교 시점을 고정한 뒤 두 방법의 비용이 같아지는 수량을 계산합니다.</p>
      </section>
      <section id="minimum-market" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 준비 비용 차이를 하나당 절약액으로 나눈다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            A와 B를 새로 선택하는 경우 전체 비용은 각각 10N과 60 + 4N입니다. B에서 A를 빼면 60 − 6N입니다. 부품마다 여섯 단위씩 아끼므로 60을 회수하는 동률 수량은
            10개입니다. 10개에서는 동률이고 그보다 많으면 B가 더 쌉니다.
          </p>
          <p className="leading-7">B와 C도 비교해야 합니다. C의 준비 비용은 B보다 300 − 60 = 240 크고 하나당 비용은 4 − 1 = 3 작습니다. 동률 수량은 240 ÷ 3 = 80입니다. 양의 정수 주문에서는 81개부터 C가 B보다 쌉니다. 두 번째 계산에 C의 300만 넣으면 비교하는 대안이 달라집니다.</p>
        </div>
        <ExplainedFormula question="두 방법의 전체 비용이 같은 수량은 어떻게 구하나요?"
          idea="새 방법이 먼저 더 쓰는 돈을 이후 부품마다 아끼는 돈으로 나눕니다. 비교하는 두 대안의 차이를 사용합니다."
          formula={String.raw`N^*=\frac{F_2-F_1}{c_1-c_2}`}
          annotatedFormula={String.raw`\begin{gathered}N^*=\frac{F_2-F_1}{c_1-c_2}\\A,B:\quad60/6=10\\B,C:\quad240/3=80\end{gathered}`}
          operations={[
            { expression: String.raw`\Delta F=F_2-F_1`, annotation: "처음에 더 쓰는 금액입니다. B와 C에서는 240입니다." },
            { expression: String.raw`\Delta c=c_1-c_2`, annotation: "하나마다 아끼는 금액입니다. B와 C에서는 3입니다." },
            { expression: String.raw`\Delta F-\Delta cN`, annotation: "새 방법에서 기존 방법을 뺀 전체 비용 차이입니다." },
            { expression: String.raw`N> N^*`, annotation: "차이가 음수가 되어 새 방법이 엄격히 더 쌉니다. 같으면 동률입니다." },
          ]}
          terms={[
            { symbol: "N", name: "같은 주문의 수량", description: "양의 수량을 같은 기간·품질 조건에서 비교합니다." },
            { symbol: String.raw`F_1,F_2`, name: "각 대안의 준비 비용", description: "정해 둔 생산 범위에서 수량과 무관합니다. 서로 더하는 누적 단계가 아닙니다." },
            { symbol: String.raw`c_1,c_2`, name: "각 대안의 하나당 추가 비용", description: "이 모형에서는 수량과 무관하게 일정합니다." },
            { symbol: String.raw`N^*`, name: "비용 동률 수량", description: "정수 주문에서 엄격히 더 싼 첫 개수는 이 값의 내림에 1을 더합니다." },
          ]}
          assumptions={["새 방법의 준비 비용이 더 크고 하나당 비용은 더 낮아 두 차이가 양수입니다.", "수량·품질·납기·생산 여력을 같게 두며 준비 비용은 아직 지출하지 않았습니다."]}
          interpretation="준비 비용 차이가 일정할 때 하나당 절약액이 커지면 동률 수량은 작아집니다. 준비 비용 하나만 보고 필요한 수량의 순서를 정할 수는 없습니다." />
        <SourceApplication source="Young (1928) · 인쇄 530쪽" excerpt="It would be wasteful to make a hammer to drive a single nail" application="못 하나와 망치라는 원문의 예는 먼저 준비하는 수고를 나눌 수량의 중요성을 보여 줍니다. 이 글은 같은 관계를 부품과 A·B·C의 가정 비용으로 계산합니다. 60·300과 위 식은 논문에 실린 수치나 식이 아닙니다." />
        <CitationBlock source="Allyn A. Young · Increasing Returns and Economic Progress (1928), Economic Journal 38(152), pp.527–542" citeKey={1} href="https://gwern.net/doc/economics/automation/1928-young.pdf">공개 원문 스캔의 527~534쪽과 536~539쪽을 읽고 530·539쪽은 이미지로 대조했습니다. 논문은 우회 생산과 산업 사이의 분업을 논의합니다. 서지는 출판사 목록의 DOI 10.2307/2224097과 대조했습니다.</CitationBlock>
        <p data-stage-bridge="minimum-market" className="mt-5 text-sm leading-7 text-muted-foreground">둘씩의 비교를 알았더라도 모든 대안 중 가장 작은 것을 골라야 합니다.</p>
      </section>
      <section id="all-methods" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 더 비싼 설비라는 이름만으로 차례대로 넘어가지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            기본 사례의 최저 방법은 10개 미만에서 A, 10개 초과 80개 미만에서 B, 80개 초과에서 C입니다. 10개와 80개에서는 각각 두 방법이 동률입니다. 이는 이 세
            비용표를 모두 비교한 결과입니다. 어느 방법을 먼저 고르는지는 각 방법의 비용에 달려 있습니다.
          </p>
          <p className="leading-7">C의 준비 비용만 75로 낮춘 별도 대안 C′를 넣어 봅니다. 하나당 비용은 1 그대로입니다. 준비 비용 75는 B의 60보다 크지만 A와의 동률은 75 ÷ 9 = 약 8.33개입니다. 9개에서 A는 90, B는 96, C′는 84이므로 C′를 고릅니다.</p>
          <p className="leading-7">
            이때 B가 A보다 비싸지 않으려면 수량이 10개 이상이어야 하고 C′보다 비싸지 않으려면 5개 이하여야 합니다. 두 조건을 함께 만족하는 수량이 없으므로 B의 비용은 가장 낮을
            수 없습니다. A에서 B로 넘어갈 수 있는지만 보고 10개 전에는 멈춘다는 규칙은 9개의 더 싼 C′를 놓칩니다.
          </p>
        </div>

        <div className="prose prose-neutral mt-5 max-w-none dark:prose-invert">
          <p className="leading-7">새 방법의 준비 비용이 더 큰데 하나당 절약액이 0이거나 음수이면 수량을 늘려도 그 차이를 회수하지 못합니다. 반대로 준비 비용이 같고 하나당 비용만 낮다면 모든 양의 수량에서 새 방법이 더 쌉니다. 식의 분모와 분자를 확인하고 7절처럼 이미 지출한 비용의 역할도 구분해야 합니다.</p>
        </div>
        <p data-stage-bridge="all-methods" className="mt-5 text-sm leading-7 text-muted-foreground">방법을 모두 비교하는 원칙을 유지한 채 세 고객의 주문을 한데 모읍니다.</p>
      </section>
      <section id="differentiation" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 30개씩 세 주문을 모으면 90개용 방법을 고를 수 있다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">세 업체가 같은 부품을 각각 30개씩 만든다고 가정합니다. 각자 고른 B의 비용은 60 + 4 × 30 = 180이고 세 곳 합계는 540입니다. 한 전문 업체가 주문을 모아 90개를 만들면 C의 300 + 90 = 390을 선택할 수 있습니다. 생산량은 같은 90개이며 생산 비용 차이는 150입니다.</p>
          <p className="leading-7">다만 공동 생산에 운송·검사·계약 비용이 60 더 필요하면 전체 비용은 450으로 절약액은 90입니다. 추가 비용이 180이면 전체 570으로 각자 만들 때보다 30 더 듭니다. 주문이 같은 규격과 일정으로 모이고 제때 공급될 수 있어야 원래 계산도 유효합니다.</p>
          <p className="leading-7">완제품 업체 세 곳은 그대로 남고 중간 부품을 전문 생산자에게 맡길 수 있습니다. 생산 비용의 절약분이 공급자의 이익, 고객 가격, 임금 등에 어떻게 나뉘는지는 별도 문제입니다. 150을 계산했다고 고객 세 곳이 모두 그만큼 가격을 할인받는 것은 아닙니다.</p>
          <p className="leading-7">전문 생산자가 자기 공장의 주문을 모아 설비를 바꾸는 것은 그 기업의 내부 경제로 볼 수 있습니다. 그 전문화 덕분에 고객 기업도 부품을 더 싸게 구할 수 있게 된다면 고객 쪽에서는 외부 경제가 됩니다. 이 사례의 생산비 계산만으로 고객의 실제 구입가격까지 확정할 수는 없습니다.</p>
        </div>
        <DifferentiationViz />
        <SourceApplication source="Young (1928) · 인쇄 539쪽" excerpt="specialised undertakings" application="전문 업체가 여러 고객의 수요를 모으면 한 고객만으로는 경제적이지 않던 방법을 쓸 수 있다는 논의와 연결합니다. 세 고객의 30개와 생산 비용 540→390은 이를 설명하기 위한 가정입니다. 기업 분리가 언제나 유리하다는 법칙으로 읽지 않습니다." />
        <p data-stage-bridge="differentiation" className="mt-5 text-sm leading-7 text-muted-foreground">전문 업체가 보는 수량이 어디서 생기는지도 조건에 넣어야 합니다.</p>
      </section>
      <section id="market-is-produced" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">11. 생산 능력과 구매력이 서로의 조건을 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            Young은 533쪽에서 시장의 크기를 인구나 면적뿐 아니라 생산물을 살 수 있는 구매력과 연결합니다. 한 산업의 생산성 변화가 다른 산업의 가격·소득·주문에 영향을 주면
            새로운 전문화가 가능해질 수 있습니다. 인구가 같아도 산업 사이의 관계는 달라질 수 있습니다.
          </p>
          <p className="leading-7">같은 90개 계획도 세 고객에게 실제 주문과 지급 능력이 있어야 성립합니다. 물건을 만들었다는 사실만으로 팔리는 것은 아닙니다. 논문의 533~534쪽은 생산 활동 사이의 비례와 수요·공급의 반응이라는 조건을 논의하고 자본 축적과 기술 습득, 이동과 조정에 시간이 든다는 점도 설명합니다.</p>
          <p className="leading-7">537~539쪽의 인쇄업 사례는 인쇄소뿐 아니라 종이·잉크·활자·관련 기계 산업의 전문화를 함께 보도록 합니다. 이 사례를 옛 인쇄소가 모든 투입물을 반드시 혼자 만들었다는 역사적 사실로 바꿔 쓰지는 않습니다. 539쪽의 개별 기업 규모 한계도 해당 논의의 가정이며 모든 기업의 규모를 측정한 값은 아닙니다.</p>
        </div>

        <p data-stage-bridge="market-is-produced" className="mt-5 text-sm leading-7 text-muted-foreground">수량이 커지면 비용이 줄 수 있다는 설명에서 기업 수의 결론을 따로 검토합니다.</p>
      </section>
      <section id="not-monopoly" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">12. 비용이 줄어든다는 사실만으로 판매자가 하나가 되지는 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">기본 비용표에서 시장 전체가 8개라면 A로 모두 만드는 비용은 80입니다. 두 업체가 4개씩 A로 만들어도 40 + 40 = 80입니다. B와의 동률 수량 10개가 시장보다 크다는 이유만으로 한 업체가 더 싸다고 결론 내릴 수 없습니다.</p>
          <p className="leading-7">100개에서는 한 곳이 C로 만드는 비용 400이 두 곳이 50개씩 B로 만드는 비용 260 + 260 = 520보다 작습니다. 이 계산은 제시한 분할보다 한 곳의 생산 비용이 작다는 뜻입니다. 가능한 모든 분할이나 여러 품목의 조건을 검사한 것도, 실제 시장에서 한 업체만 살아남는 것을 증명한 것도 아닙니다.</p>
          <p className="leading-7">자연독점의 비용 조건을 검토하려면 해당 수요량에서 한 업체의 비용을 여러 업체가 나눠 생산하는 비용과 비교해야 합니다. 실제 기업 수와 가격에는 진입, 서비스 차이, 운송, 계약, 규제와 경쟁 행동도 영향을 줍니다. Young의 527쪽도 수확 체증에서 독점 경향을 무조건 끌어내는 추론을 경계합니다.</p>
          <p className="leading-7">큰 기업의 판매가격이 낮다는 관찰에는 같은 설비의 비용 배분, 다른 설비 선택, 전문 공급자의 절약, 구매 협상과 이윤 정책이 함께 섞일 수 있습니다. 생산비와 판매가격을 나누고 실제 물량·설비·거래 조건을 확인해야 원인을 구분할 수 있습니다.</p>
        </div>

        <p data-stage-bridge="not-monopoly" className="mt-5 text-sm leading-7 text-muted-foreground">마지막으로 같은 숫자의 동률과 주문 합산 조건을 직접 예측해 봅니다.</p>
      </section>
      <section id="handoff" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">13. 같은 방법의 절약과 방법을 바꾸는 절약을 각각 계산한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">수량을 정하고 세 방법의 전체 비용을 비교했습니다. B의 평균이 7에서 4.6으로 내려가는 변화와 B에서 C로 바꿔 460 대신 400을 쓰는 변화는 서로 구분할 수 있습니다. 세 고객의 주문을 모을 때에도 생산 비용 뒤에 추가 거래 비용을 더해야 합니다.</p>
          <p className="leading-7">안에서 만들지 외부에 맡길지의 계약과 조정 비용은 <Link to="/economics/firms/why-firms-exist">기업의 경계</Link>에서 이어집니다. 생산 비용이 같아도 판매가격을 고르는 힘이 다르면 결과가 달라집니다. 그 관계는 <Link to="/economics/firms/market-power-and-markup">시장 지배력과 가격</Link>에서 살펴봅니다.</p>
        </div>
        <ReviewPrompts questions={[
          "B의 방법과 하나당 추가 비용 4를 그대로 유지해도 주문이 20개에서 100개로 늘면 평균은 어떻게 바뀌나요? (답: 5절)",
          "A와 B가 10개에서 동률이라면 B가 엄격히 더 싼 첫 정수 주문 수량은 얼마인가요? (답: 8절)",
          "세 고객의 30개 주문을 모아 생산 비용을 540에서 390으로 줄였지만 추가 운송·계약 비용이 180이면 전체 비용은 어떻게 되나요? (답: 10절)",
        ]} />
        <ContentBoundary article="scale-and-cost-structure" />
        <p data-stage-bridge="handoff" className="mt-5 text-sm leading-7 text-muted-foreground">동일 방법의 평균, 대안 사이의 선택, 실제 판매 조건을 나눠 설명할 수 있으면 계산의 적용 범위를 이해한 것입니다.</p>
      </section>
    </div>
  );
}
