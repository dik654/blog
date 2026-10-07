import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";
import BoundaryViz from "./why-firms-exist/viz/BoundaryViz";
import ContractWebViz from "./why-firms-exist/viz/ContractWebViz";
import { choices } from "./why-firms-exist/model";

function CostTable({ scenarios }: { scenarios: { label: string; outside: number; setup?: number }[] }) {
  const data = scenarios.map(s => ({ ...s, ...choices(s.outside, s.setup ?? 0) }));
  return <div className="my-6 overflow-x-auto"><table className="w-full text-left text-sm">
    <caption className="mb-3 text-left text-sm leading-6">(가정) 같은 여섯 일의 전체 조정 비용입니다. 최저인 칸을 모두 표시합니다.</caption>
    <thead><tr><th scope="col" className="p-2">안의 개수</th>{data.map(s => <th scope="col" key={s.label} className="p-2">{s.label}</th>)}</tr></thead>
    <tbody>{Array.from({ length: 7 }, (_, n) => <tr key={n} className="border-t border-border"><th scope="row" className="p-2">{n}개</th>{data.map(s => <td key={s.label} className="p-2">{s.totals[n]}{s.minimizers.includes(n) ? " (최저)" : ""}</td>)}</tr>)}</tbody>
  </table></div>;
}

/** Coase 1937 원문 390~397쪽을 확인했습니다. 숫자는 본문의 가정입니다. */
export default function WhyFirmsExistArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 일을 맡길 때마다 다시 협상해야 한다면</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">작은 조립업체가 부품을 다듬고 검사하는 여섯 가지 일을 처리하려 합니다. 밖에 맡기면 상대를 찾고 조건을 맞춰야 합니다. 회사 안에서 처리하면 담당자를 배정하고 진행을 확인해야 합니다. 같은 물건을 만들더라도 일을 맞추는 방식에 따라 드는 비용이 다릅니다.</p>
          <p className="leading-7">이 글에서는 같은 여섯 일을 놓고 밖에서 처리할지 안으로 들일지 비교합니다. 회사 안에서도 임금과 예산, 부서 사이의 정산 가격을 쓸 수 있습니다. 여기서 살펴볼 것은 가격이 사라지는지가 아니라 매번 거래 조건을 협상할 일과 정해 둔 권한으로 배정할 일을 어떻게 나누는지입니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-muted-foreground">비교할 일은 여섯 개로 고정합니다. 먼저 두 방식에서 무엇을 해야 하는지 나눕니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 밖에 주문하거나 안에서 배정한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            밖에 맡기는 쪽은 가능한 상대와 가격을 알아보고 규격·납기·대금 조건을 정합니다. 물건이 오면 약속과 맞는지 확인하고 어긋난 부분을 처리합니다. 회사 안에서는 사람과 설비를
            배정하고 일의 순서를 바꾸며 결과를 확인합니다. 어느 쪽이든 정보를 모으고 판단하는 사람이 필요합니다.
          </p>
          <p className="leading-7">아래 비교에서는 최종 생산량과 품질이 같다고 둡니다. 원재료와 직접 가공에 드는 돈도 같아서 비교에서 생략합니다. 따라서 밖의 견적 총액과 안쪽 관리비 일부를 바로 비교하는 계산이 아닙니다. 실제 선택에서는 이 가정을 확인한 뒤 서로 다른 비용도 모두 넣어야 합니다.</p>
        </div>
        <FlowRail title="같은 완성품에 도달하는 두 경로" steps={[
          { actor: "같은 여섯 일", movement: "수량·품질·직접 생산비를 같게 놓습니다.", receives: "비교할 작업 목록" },
          { actor: "밖에 맡기거나 안에서 배정", movement: "상대 탐색·협상·확인 또는 내부 배정·감독의 비용을 셉니다.", receives: "방식별 조정 비용" },
          { actor: "전체 선택을 비교", movement: "같은 일을 모두 끝내는 조합 중 비용이 가장 작은 것을 찾습니다.", receives: "안에서 처리할 범위" },
        ]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-muted-foreground">두 경로의 비용을 작은 수로 정하고 일곱 가지 선택을 비교합니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 전부 밖에 두면 24, 전부 안에 두면 21이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">여섯 일을 정해진 순서로 1번부터 6번까지 놓습니다. 밖에 맡길 때 일을 맞추는 비용은 각각 4입니다. 안에서는 앞에서부터 들인다고 정하고 각각 1·2·3·4·5·6이 든다고 둡니다. 숫자는 같은 화폐 단위의 (가정)이며 설립·전환 비용은 일단 0입니다. 실제 기업에서 잰 값은 아닙니다.</p>
          <p className="leading-7">전부 밖에 맡기면 4 × 6 = 24입니다. 전부 안에 들이면 1 + 2 + 3 + 4 + 5 + 6 = 21입니다. 두 가지 중에서는 안에서 처리하는 쪽이 싸지만 선택이 여기서 끝나지는 않습니다. 일부만 안에서 처리할 수 있기 때문입니다.</p>
          <p className="leading-7">앞의 세 일을 안에서 처리하면 1 + 2 + 3 + 4 + 4 + 4 = 18입니다. 네 일을 들여도 1 + 2 + 3 + 4 + 4 + 4 = 18입니다. 넷째 일은 안과 밖 모두 4여서 바꿔도 합계가 같습니다. 따라서 세 개와 네 개가 함께 최저입니다.</p>
          <p className="leading-7">이후 그림에서 네 개를 선택하는 것은 동률이면 하나 더 안으로 들이기로 정했기 때문입니다. 정답이 네 개 하나뿐이어서가 아닙니다. 이 차이를 기억하면 비용이 딱 같아지는 점이 없어도 선택할 수 있는 이유를 뒤에서 이해하기 쉽습니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-muted-foreground">일의 수와 완성품은 그대로 두고 어느 쪽에 맡기는지만 그림에서 바꿉니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 여섯 일을 옮길 때 합계가 어떻게 변하는가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">아래의 각 칸은 같은 작업 하나입니다. 안에서 처리하는지 밖에서 처리하는지에 따라 그 칸의 비용만 바뀝니다. 합계 아래에는 안에 들인 일이 0개부터 6개일 때의 비용이 모두 나옵니다. 색과 선택 표시만 보지 말고 최저인 개수가 몇 개인지 함께 확인합니다.</p>
          <p className="leading-7">첫 세 장면은 밖의 비용을 4로 고정합니다. 다음 장면에서는 그 비용만 5로 올리고 마지막에는 3.5로 낮춥니다. 안쪽의 1·2·3·4·5·6은 그대로입니다. 회사가 더 많은 일을 맡게 되어도 내부 처리 능력이 좋아졌다고 곧바로 결론 낼 수 없는 이유를 보여 줍니다.</p>
        </div>
        <BoundaryViz />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-muted-foreground">같은 합계를 비교했습니다. 이제 밖의 비용 4에 무엇이 들어 있는지 봅니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 물건값을 알아보고 약속을 지키는 데에도 돈이 든다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">밖의 비용 4를 상대와 가격을 알아보는 데 1, 조건을 협상하는 데 1, 검사와 약속 이행을 확인하는 데 2로 나눠 봅니다. 이 분해도 (가정)입니다. 부품 자체를 만드는 비용은 앞서 두 방식에서 같다고 두었으므로 여기의 4에 다시 넣지 않습니다.</p>
          <p className="leading-7">안쪽 비용에도 담당자 배정, 일정 조정, 검사, 잘못된 판단을 고치는 일이 들어갈 수 있습니다. 관리자에게 일을 맡긴다고 이런 일이 없어지지 않습니다. 더 많은 일을 함께 맡을 때 추가 부담이 커질 수 있다는 상황을 1·2·3·4·5·6으로 표현했습니다. 모든 기업에서 반드시 이 순서로 오른다는 법칙은 아닙니다.</p>
          <p className="leading-7">장기 계약으로 반복 협상을 줄일 수 있고 회사 안에서도 지시와 확인에 많은 시간을 쓸 수 있습니다. 그래서 계약서 수나 직원 수만 보고 어느 쪽이 싸다고 정하기 어렵습니다. 같은 일을 끝낼 때 필요한 활동을 목록으로 만들고 각각의 비용을 비교해야 합니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-muted-foreground">숫자와 활동을 연결했으니 이제 이 비교에 쓰는 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 방식의 비용과 기업의 경계를 구분한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">상대를 찾고 협상하며 계약의 이행을 확인하는 비용을 거래비용이라고 부릅니다. 이 글의 밖의 비용 4는 시장을 이용하는 거래비용을 단순하게 놓은 값입니다. 물건의 판매가격이나 원재료비 전체와 같은 말은 아닙니다.</p>
          <p className="leading-7">회사 안에서 누가 무엇을 할지 정하고 확인하는 데 드는 부담을 내부 조정 비용으로 묶어 부르겠습니다. 여기서는 안에 한 일을 더 들일 때의 추가 비용이 1·2·3·4·5·6입니다. 이 추가 부담이 커질 가능성이 경영의 수확 체감이라는 논의와 연결됩니다.</p>
          <p className="leading-7">
            회사에서 직접 처리하는 일과 외부에 맡기는 일을 나누는 범위를 기업의 경계라고 부릅니다. 일을 하나 더 안으로 들일 때 바뀌는 비용을 비교하는 것은 한계비용 비교입니다. 같은
            값이 정확히 존재하는지는 작업을 나눌 수 있는 정도와 비용의 모양에 달려 있습니다.
          </p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-muted-foreground">이름을 붙인 뒤에도 비교 대상은 같은 여섯 일입니다. 넷째 일 하나를 따라갑니다.</p>
      </section>
      <section id="cost-of-market" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 넷째 일을 바꿔도 합계가 18인 이유</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">세 일을 안에서 처리한 상태에서는 안쪽 비용이 1 + 2 + 3 = 6이고 밖의 세 일은 4 × 3 = 12입니다. 합계 18에서 넷째 일을 안으로 옮기면 밖에서 쓰던 4가 사라지고 안에서 쓰는 4가 추가됩니다. 전체 변화는 4 − 4 = 0입니다.</p>
          <p className="leading-7">다섯째까지 옮기면 밖의 4를 아끼지만 안의 5가 추가됩니다. 합계는 1만큼 늘어 19가 됩니다. 일 하나의 생산비를 절약했는지와 일을 맞추는 비용을 절약했는지는 구분해야 합니다. 이 사례는 생산비가 같다는 조건에서 뒤의 차이만 계산했습니다.</p>
          <p className="leading-7">실제 외주업체가 더 효율적인 설비를 갖췄다면 생산비도 달라집니다. 그때는 외주 대금과 구매·검사 비용, 내부 생산비와 관리 비용을 같은 범위로 맞춰야 합니다. 다른 회사의 내부 관리비가 싸다는 사실만으로 거래가 공짜가 되는 것도 아닙니다. 두 회사 사이의 계약과 확인 비용이 남을 수 있습니다.</p>
        </div>

        <p data-stage-bridge="cost-of-market" className="mt-5 text-sm leading-7 text-muted-foreground">비용 비교는 같아도 계약 방식은 바뀔 수 있습니다. 반복 협상을 줄이는 경우를 봅니다.</p>
      </section>
      <section id="one-contract" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 세부 작업을 나중에 정할 수 있는 범위를 약속한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">같은 담당자에게 여섯 작업을 요청할 때마다 조건을 새로 협상한다고 가정해 봅니다. 보수와 업무 범위 등을 미리 정하고 그 안의 세부 작업을 나중에 배정할 수 있다면 반복 협상의 일부를 줄일 수 있습니다. 작업 지시 여섯 번과 감독의 필요까지 없어지는 것은 아닙니다.</p>
          <p className="leading-7">
            고용 계약에 아무 일도 적지 않고 지시 권한만 무제한으로 준다는 뜻은 아닙니다. 보수·업무 범위·기간 등 약정과 법적 제한 아래에서 이후의 세부 사항을 정합니다. 어느 지시가
            허용되는지는 실제 계약 내용과 적용되는 법에 따라 확인해야 합니다.
          </p>
          <p className="leading-7">외부 공급자와도 장기 기본 계약을 맺고 개별 주문을 넣을 수 있습니다. 따라서 계약서가 하나라는 사실은 기업 내부와 외부를 가르는 충분한 기준이 아닙니다. 누가 어떤 결정을 내릴 수 있고 결과와 변경 비용을 누가 부담하는지를 함께 봐야 합니다.</p>
        </div>
        <ContractWebViz />
        <p data-stage-bridge="one-contract" className="mt-5 text-sm leading-7 text-muted-foreground">여섯 작업의 예를 실제 논문의 계약 설명과 대조합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. Coase의 원문은 시장을 사용하는 비용부터 묻는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">Coase의 1937년 논문 390쪽은 시장의 가격을 알아보고 거래를 성립시키는 활동에 비용이 든다는 점에서 출발합니다. 이어지는 391~392쪽에서는 반복 계약의 일부를 줄이면서 일정 범위 안의 세부 지시를 뒤로 미루는 관계를 설명합니다. 이때 계약과 권한의 한계가 사라지는 것은 아닙니다.</p>
          <p className="leading-7">
            논문은 장기 공급 계약에서 앞일을 전부 구체화하기 어려운 문제도 함께 다룹니다. 그래서 회사의 존재를 여섯 사람이 모두 서로 계약하면 15개이고 가운데 한 사람을 더 두면
            6개라는 그림으로 증명할 수는 없습니다. 그 계산에는 모든 사람 쌍이 계약하고 관리자를 한 명 더 둔다는 가정이 들어 있습니다.
          </p>
        </div>
        <SourceApplication source="Coase (1937) · 인쇄 390쪽" excerpt="there is a cost of using the price mechanism" application="밖의 4에 해당하는 것은 가격을 알아보고 조건을 맞추고 이행을 확인하는 활동입니다. 여섯 일의 1·2·3·4·5·6과 4는 원문에 실린 측정값이 아니라 본문의 가정입니다." />
        <CitationBlock source="R. H. Coase · The Nature of the Firm (1937), pp.386–405" citeKey={1} href="https://msuweb.montclair.edu/~lebelp/coasenatfirmec1937.pdf">대학에 공개된 원문 스캔의 390~397쪽을 확인했습니다. 시장 이용 비용, 계약의 한계, 기업 확장의 조건과 기술 변화의 상대적 효과를 읽었습니다. 인용 문구는 해당 쪽의 이미지와 대조했습니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-muted-foreground">원문의 비교를 여섯 개 작업의 식으로 쓰되 동률과 나눌 수 없는 작업을 구분합니다.</p>
      </section>
      <section id="boundary" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 하나 더 들일 때의 차이는 안의 비용 빼기 밖의 비용이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">안에 들인 작업 수는 n이라고 쓰겠습니다. 다음 작업의 안쪽 비용은 aₙ₊₁이고, 밖의 작업당 비용은 b입니다. 앞에서부터 n개를 들일 수 있고 다른 작업의 비용은 바뀌지 않는다는 조건입니다. 설립·전환 비용도 아직 0입니다.</p>
          <p className="leading-7">
            전체 비용은 안에서 처리하는 비용을 더한 뒤 남은 6 − n개에 밖의 비용 b를 곱해 더합니다. 하나 더 들이면 원래 합계에서 밖의 b 하나가 빠지고 안의 aₙ₊₁ 하나가
            추가됩니다. 따라서 차이가 음수이면 비용이 줄고 양수이면 늘어납니다. 0이면 동률입니다.
          </p>
        </div>
        <ExplainedFormula question="안의 작업을 n개에서 n+1개로 늘리면 무엇이 달라지나요?"
          idea="나머지 작업의 비용은 서로 지워지고 새로 더한 안쪽 비용과 제거한 바깥쪽 비용만 남습니다."
          formula={String.raw`C(n+1)-C(n)=a_{n+1}-b`}
          annotatedFormula={String.raw`\begin{gathered}
C(n)=\sum_{i=1}^{n}a_i+(6-n)b\\
C(n+1)-C(n)=a_{n+1}-b\\
b=4:\quad4-4=0\\
b=3.5:\quad4-3.5=0.5
\end{gathered}`}
          operations={[
            { expression: String.raw`C(n)=\sum_{i=1}^{n}a_i+(6-n)b`, annotation: "안의 합계와 밖의 남은 개수를 함께 셉니다." },
            { expression: String.raw`C(4)-C(3)=4-4=0`, annotation: "밖이 4일 때 세 개와 네 개가 동률입니다." },
            { expression: String.raw`C(4)-C(3)=4-3.5=0.5`, annotation: "밖이 3.5이면 넷째를 들일 때 비용이 0.5 늘어납니다." },
          ]}
          terms={[
            { symbol: "n", name: "안의 작업 수", description: "0부터 6까지의 정수입니다. 앞에서부터 n개를 처리합니다." },
            { symbol: String.raw`C(n)`, name: "전체 조정 비용", description: "여섯 일을 모두 처리할 때의 합계입니다." },
            { symbol: String.raw`a_i`, name: "안에 추가할 비용", description: "i번째 일을 들일 때 더해지는 값입니다." },
            { symbol: "b", name: "밖의 작업당 비용", description: "모든 작업에 같은 값이며 기본 사례에서는 4입니다." },
          ]}
          assumptions={["생산비·품질·수량은 두 방식에서 같고 설립·전환 비용은 0입니다.", "앞에서부터 들이며 추가 비용은 감소하지 않고 다른 작업에 영향을 주지 않습니다."]}
          interpretation="추가 비용이 감소하지 않으면 변화는 음수에서 0 또는 양수 쪽으로 갑니다. 음수 구간 뒤의 동률 선택들을 모두 포함해 최저를 찾습니다. 정확한 등식이 없어도 정수 개수의 최저는 존재할 수 있습니다." />
        <CostTable scenarios={[{ label: "밖 4", outside: 4 }, { label: "밖 3.5", outside: 3.5 }]} />
        <SourceApplication source="Coase (1937) · 인쇄 395쪽" excerpt="costs of organising an extra transaction within the firm" application="이 추가 비용을 밖에서 같은 거래를 하거나 다른 기업이 조직하는 비용과 비교한다는 문맥입니다. 본문의 aₙ₊₁−b는 그 생각을 조건을 명시한 이산 모형으로 옮긴 것으로 원문의 식을 복사한 것이 아닙니다." />
        <div className="prose prose-neutral mt-5 max-w-none dark:prose-invert">
          <p className="leading-7">밖이 4일 때는 세 개와 네 개가 모두 18로 최저입니다. 밖이 3.5이면 세 개에서 16.5가 유일한 최저입니다. 안쪽 비용 중 3.5는 없습니다. 연속적으로 나눌 수 있는 내부 최적점의 등식과 정수 작업의 선택을 같은 규칙으로 단정하면 이 경우를 놓칩니다.</p>
        </div>
        <p data-stage-bridge="boundary" className="mt-5 text-sm leading-7 text-muted-foreground">계산 조건을 확인했습니다. 이번에는 바깥 비용만 바꿔 경계가 움직이는 이유를 봅니다.</p>
      </section>
      <section id="what-moves" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">11. 회사가 커졌어도 안쪽이 좋아진 것은 아닐 수 있다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            밖의 비용이 5가 되면 네 개와 다섯 개가 20으로 최저입니다. 밖의 비용이 2가 되면 한 개와 두 개가 11로 최저입니다. 아래 표에서 안으로 들인 개수별 비용을 비교할 수
            있습니다. 동률이면 더 들이는 약속을 쓰면 각각 다섯 개와 두 개를 고릅니다.
          </p>
          <p className="leading-7">이 변화에서 내부 비용은 하나도 바꾸지 않았습니다. 밖에서 상대를 찾고 약속을 이행하기가 어려워지면 내부 개선 없이도 더 많은 일을 안에서 처리할 수 있습니다. 규모 증가만으로 생산성 향상을 증명할 수 없는 이유입니다.</p>
          <p className="leading-7">Coase는 397쪽에서 장소의 분산, 일의 차이, 가격 변화가 조직하는 부담에 영향을 줄 수 있다고 논의합니다. 같은 쪽 각주 3은 발명이 안쪽과 바깥쪽의 비용을 모두 바꿀 수 있으므로 상대적 변화를 봐야 한다고 설명합니다. 통신이 싸졌다는 사실 하나만으로 기업이 반드시 커지거나 작아진다고 정할 수는 없습니다.</p>
        </div>
        <CostTable scenarios={[{ label: "밖 5", outside: 5 }, { label: "밖 2", outside: 2 }]} />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm"><thead><tr><th className="p-3">밖의 비용</th><th className="p-3">최저 합계</th><th className="p-3">최저인 안의 작업 수</th></tr></thead>
            <tbody>{[[4, 18, "3개·4개"], [5, 20, "4개·5개"], [2, 11, "1개·2개"], [3.5, 16.5, "3개"]].map(([b, total, n]) => <tr key={b} className="border-t border-border"><td className="p-3">{b}</td><td className="p-3">{total}</td><td className="p-3">{n}</td></tr>)}</tbody>
          </table>
        </div>
        <p data-stage-bridge="what-moves" className="mt-5 text-sm leading-7 text-muted-foreground">같은 비교로 설명할 수 있는 변화와 가정이 깨져 다시 계산해야 할 경우를 나눕니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">12. 설립비가 생기면 첫 작업만 보고 멈출 수 없다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">하나라도 안에서 처리하려면 처음에 5를 더 내야 한다고 가정해 봅니다. 밖의 비용은 4로 되돌립니다. 아래 표처럼 첫 작업만 들이면 24에서 26으로 오르지만 세 개나 네 개를 묶어 들이면 23으로 낮아집니다. 첫 변화가 양수라는 이유만으로 전부 밖에 두면 최저를 놓칩니다.</p>
          <p className="leading-7">안쪽 추가 비용이 항상 5이고 밖은 항상 4인 경우도 봅니다. 내부 비용이 올라가지 않아도 전부 밖에 두는 것이 가장 쌉니다. 반대로 안이 항상 3이면 이 사례의 여섯 일은 모두 안에서 처리합니다. 비용이 증가하지 않는다는 사실만으로 세상의 모든 거래가 한 기업에 들어간다고 결론 낼 수는 없습니다.</p>
          <p className="leading-7">현실에서는 품질·자금·권한·법적 책임·작업 간 연결과 변경 비용도 다릅니다. 이 글의 비용 합계는 권한을 누가 갖는지, 이익을 누가 가져가는지까지 자동으로 결정하지 않습니다. 내부 이전가격의 존재와 수준을 이 수식 하나로 설명하는 것도 범위를 넘습니다.</p>
          <p className="leading-7">Coase는 1991년 노벨 강연에서 실제 기업과 계약에 관한 자료가 더 필요하다고 강조했습니다. 여섯 일의 산술은 어떤 항목을 비교할지 보여 줍니다. 특정 기업의 최적 크기나 모든 기업이 존재하는 이유를 실증한 결과로 읽어서는 안 됩니다.</p>
        </div>
        <CostTable scenarios={[{ label: "밖 4·설립비 5", outside: 4, setup: 5 }]} />
        <CitationBlock source="R. H. Coase · The Institutional Structure of Production, Nobel lecture (1991)" citeKey={2} href="https://www.nobelprize.org/prizes/economic-sciences/1991/coase/lecture/">공식 강연 본문 중 계약 활동의 비용과 실제 자료의 필요성을 설명하는 단락을 확인했습니다. 이 글의 숫자는 강연에서 측정한 결과가 아닙니다.</CitationBlock>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-muted-foreground">
            조건을 바꿨을 때도 같은 작업의 전체 비용을 다시 계산하면 어디까지 결론을 낼 수 있는지 알 수 있습니다.
          </p>
      </section>
      <section id="handoff" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">13. 같은 일을 끝내는 전체 비용으로 예측한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            밖에서 새로 협상할 비용을 아끼려다 안쪽의 배정과 감독 비용을 더 쓸 수 있습니다. 비교할 작업과 품질을 맞춘 뒤 두 경로의 전체 비용을 계산합니다. 그다음 계약에서 정한 업무
            범위와 나중에 지시할 수 있는 일을 확인합니다.
          </p>
          <p className="leading-7">생산비가 달라지는 경우는 <Link to="/economics/firms/scale-and-cost-structure">규모와 비용 구조</Link>로 이어갑니다. 시장 가격이 정보를 전달하는 과정은 <Link to="/economics/prices/prices-as-information">가격과 정보</Link>에서, 교환 자체의 이득과 거래비용은 <Link to="/economics/scarcity/gains-from-trade">교환의 이득</Link>에서 연결해 읽을 수 있습니다.</p>
        </div>
        <ReviewPrompts questions={[
          "밖의 비용이 4일 때 안에서 세 개를 처리하는 경우와 네 개를 처리하는 경우의 합계는 각각 얼마이며 왜 동률인가요? (답: 3절)",
          "밖의 비용이 3.5이면 안쪽 비용과 정확히 같은 값이 없어도 어느 개수를 선택할 수 있나요? (답: 10절)",
          "하나라도 안에 들일 때 설립비 5가 생기면 첫 작업만 보고 판단하는 방식은 어떤 선택을 놓치나요? (답: 12절)",
        ]} />
        <ContentBoundary article="why-firms-exist" />
        <p data-stage-bridge="handoff" className="mt-5 text-sm leading-7 text-muted-foreground">여섯 작업의 계산과 실제 계약의 조건을 함께 설명할 수 있으면 다음 글로 넘어갈 준비가 된 것입니다.</p>
      </section>
    </div>
  );
}
