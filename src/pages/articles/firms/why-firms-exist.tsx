import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import BoundaryViz from "./why-firms-exist/viz/BoundaryViz";
import ContractWebViz from "./why-firms-exist/viz/ContractWebViz";

/**
 * 시장을 쓰는 데에도 값이 듭니다
 *
 * 경제 2단계 1편. 1단계 아홉 편은 값이 조정한다고 두고 거기서 나오는 것을
 * 끝까지 따라갔다. 여기서는 그 전제를 처음으로 뺀다. 생산의 대부분은 값이
 * 아니라 지시로 조정되는데, 그 이유와 그렇게 조정되는 범위가 어디서
 * 멈추는지를 Coase 1937의 경계 조건으로 센다.
 */
export default function WhyFirmsExistArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          값이 조정한다고 했는데 공장 안에는 값이 없습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞의 아홉 편은 아무도 전체를 정하지 않는데 누가 무엇을 갖는지가
            어떻게 정해지는지를 따라갔습니다. 답은 늘 값이었습니다. 값이{" "}
            <Link to="/economics/prices/prices-as-information">
              아무도 갖지 않은 지식을 옮기고
            </Link>
            , 값이 누가 사고 누가 파는지를 갈라냈습니다.
          </p>

          <p className="leading-7">
            그런데 공장 문을 열고 들어가면 값이 없습니다. 조립 라인에서 다음
            공정으로 부품이 넘어갈 때 두 공정이 값을 흥정하지 않습니다. 설계가
            바뀌면 누가 무엇을 할지는 지시로 정해집니다. 한 나라 생산의 아주 큰
            몫이 이렇게, 값이 아니라 지시로 조정됩니다.
          </p>

          <p className="leading-7">
            그러면 묻게 됩니다.{" "}
            <strong>
              값이 그렇게 잘 조정한다면 왜 조직이 생기고, 생겼다면 왜 세상
              전체가 하나의 조직이 되지 않습니까.
            </strong>{" "}
            이 글은 그 하나의 질문을 풉니다. 답은 둘 다 같은 자리에서 나옵니다 —
            값을 쓰는 데에도 값이 들고, 지시로 바꾸는 데에도 값이 듭니다.
          </p>
        </div>

        <BoundaryViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            네 부품으로 풉니다. 시장을 쓰는 데 무엇이 드는지, 조직이 그 무엇을
            줄이는지, 그래서 조직이 어디서 커지기를 멈추는지, 그 멈추는 자리를
            무엇이 옮기는지입니다.
          </p>
        </div>
      </section>

      <section id="cost-of-market" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 값을 알아내는 일 자체가 공짜가 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            1단계에서는 값이 그냥 거기 있었습니다. 사는 쪽도 파는 쪽도 값을 보고
            정하기만 하면 됐습니다. 그런데 실제로 거래 하나를 하려면 먼저 상대를
            찾아야 하고, 상대가 부른 값이 괜찮은 값인지 알아보려면 다른 값들도
            알아야 하고, 물건이 약속대로인지 따져야 하고, 약속이 지켜지지 않을
            때 어떻게 할지도 정해 둬야 합니다.
          </p>

          <p className="leading-7">
            Coase가 1937년에 이 문제를 처음 정면으로 다루면서 쓴 말이 그대로
            제목이 될 만합니다. 조직이 생기는 주된 이유는{" "}
            <strong>값 기구를 쓰는 데 값이 들기 때문</strong>이고, 그중 가장
            눈에 띄는 것은 관련된 값이 얼마인지 알아내는 데 드는 값이라는
            것입니다.
          </p>

          <p className="leading-7">
            이 몫은 이미 1단계에서 이름을 얻었습니다.{" "}
            <Link to="/economics/scarcity/gains-from-trade">
              교환의 이득
            </Link>
            에서 상대를 찾고 재고 강제하는 데 드는 값을 거래비용이라 불렀고, 그
            값이 기회비용의 차이보다 커지면 교환 자체가 일어나지 않는다고
            했습니다. 여기서는 같은 몫이 다른 일을 합니다. 교환을 막는 대신{" "}
            <strong>교환을 조직으로 바꿉니다.</strong>
          </p>
        </div>

        <CitationBlock
          source="R. H. Coase, “The Nature of the Firm,” Economica, New Series, Vol. 4, No. 16 (Nov. 1937), pp. 386–405"
          citeKey={1}
          href="https://www.jstor.org/stable/2626876"
        >
          논문의 문장은 “The main reason why it is profitable to establish a
          firm would seem to be that there is a cost of using the price
          mechanism”이고, 이어서 가장 뚜렷한 몫으로 “that of discovering what
          the relevant prices are”를 듭니다. 협상과 계약을 맺는 값도 함께 셉니다.
          JSTOR 스캔본을 열어 본문을 직접 확인했습니다. OCR 본문에 원문 쪽
          번호가 남아 있지 않아 쪽수까지는 특정하지 않았고, 서지는 표제지 기준입니다.
        </CitationBlock>
      </section>

      <section id="one-contract" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 조직은 여러 약속을 하나로 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            조직이 그 값을 어떻게 줄이는지가 다음입니다. 값으로 조정한다는 것은
            맞춰야 할 것을 전부 약속으로 적는다는 뜻입니다. 여섯이 하나를
            만들려면 짝마다 약속을 맺어야 하고, 사람이 늘면 짝은 사람보다 빠르게
            늘어납니다.
          </p>

          <p className="leading-7">
            가운데를 하나 두고 각자가 그 하나와만 맺으면 약속의 수가 사람의
            수로 줄어듭니다. Coase의 표현으로는 이 일련의 계약들이 하나로
            대체됩니다.
          </p>
        </div>

        <ContractWebViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            줄어든 것은 수만이 아닙니다. 남은 그 하나의 약속은 성격이 다릅니다.
            무엇을 할지가 적히지 않고{" "}
            <strong>지시를 받는 범위만 적힙니다.</strong> 그 범위 안에서 무엇을
            할지는 나중에 지시로 정해집니다. 고용 계약이 하는 일이 정확히
            이것입니다.
          </p>

          <p className="leading-7">
            왜 이렇게 하느냐면 앞을 내다볼 수 없기 때문입니다. 긴 기간을 하나로
            묶을수록 맺는 값은 아껴지는데, 기간이 길수록 상대가 무엇을 해야
            할지를 미리 적어 두기가 어려워집니다. 그래서 내용을 비워 두고 나중에
            채우는 쪽을 고릅니다. 비워 둔 자리를 채우는 것이 지시이고, 지시가
            값을 대신하는 범위가 조직입니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 조정, 두 가지 방식"
          description="무엇을 할지 언제 정하느냐가 둘을 가릅니다."
          items={[
            {
              term: "값으로 조정",
              description:
                "맺을 때 무엇을 얼마에 할지를 전부 적습니다. 짝마다 따로 맺습니다.",
              example:
                "부품을 밖에서 사 옵니다. 규격과 값과 납기를 계약서에 적습니다.",
              boundary:
                "맺을 때마다 찾고 따지고 강제할 방법을 마련해야 하고, 앞일을 적을 수 없으면 적을 수가 없습니다.",
            },
            {
              term: "지시로 조정",
              description:
                "맺을 때는 범위만 적고 무엇을 할지는 그때그때 정합니다. 각자가 가운데와만 맺습니다.",
              example:
                "같은 부품을 안에서 만듭니다. 설계가 바뀌면 지시가 바뀝니다.",
              boundary:
                "범위 안의 일을 누가 어디에 둘지 가운데가 정해야 하고, 다룰 것이 늘수록 그 판단이 틀리기 쉬워집니다.",
            },
          ]}
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 경계는 두 값이 같아지는 자리에서 멈춥니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            여기까지면 조직이 무한히 커져야 합니다. 안으로 들일수록 약속의 수가
            줄어드니까요. 그런데 세상은 하나의 조직이 아닙니다. Coase가 스스로
            던진 질문이 이것입니다 — 조직으로 값을 줄일 수 있다면 왜 시장 거래가
            하나라도 남아 있습니까.
          </p>

          <p className="leading-7">
            답은 안쪽 값도 공짜가 아니라는 것입니다. 다룰 것이 늘수록 가운데가
            무엇을 어디에 둘지 판단하기 어려워지고, 틀리는 몫이 커집니다. 안으로
            하나 더 들이는 값이 올라갑니다. 그래서 두 값이 만나는 자리가
            생깁니다.
          </p>
        </div>

        <ExplainedFormula
          question="조직은 어디까지 커지고 멈춥니까"
          idea={
            <>
              조직은 안에서 거래 하나를 더 다루는 값이 같은 거래를 시장에서 하는
              값과 같아질 때까지 커집니다. 두 값 중 어느 하나가 낮아서가 아니라{" "}
              <strong>둘이 같아지는 자리</strong>라는 점이 핵심입니다.
            </>
          }
          formula={String.raw`C_{\text{안}}(n+1) \;=\; C_{\text{밖}}(n+1)`}
          annotatedFormula={String.raw`\underbrace{C_{\text{안}}(n+1)}_{\text{안에서 하나 더 다루는 값}} \;=\; \underbrace{C_{\text{밖}}(n+1)}_{\text{밖에서 같은 것을 사 오는 값}}`}
          operations={[
            {
              expression: String.raw`C_{\text{안}}(n+1)`,
              annotation: [
                "이미 n개를 다루는 조직이 하나를 더 들일 때 더 드는 값",
                "들일수록 오릅니다",
              ],
            },
            {
              expression: String.raw`C_{\text{밖}}(n+1)`,
              annotation: [
                "같은 거래를 시장에서 할 때 드는 값",
                "찾고 따지고 강제하는 몫입니다",
              ],
            },
            {
              expression: String.raw`C_{\text{안}} < C_{\text{밖}}`,
              annotation: [
                "이쪽이면 아직 안으로 들이는 편이 낫습니다",
                "경계는 더 바깥으로 갑니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "n",
              name: "이미 안에서 다루는 거래의 수",
              description: "조직의 크기를 이것으로 잽니다.",
            },
            {
              symbol: String.raw`C_{\text{안}}`,
              name: "안에서 하나 더 다루는 값",
              description:
                "지시로 조정할 때 드는 몫입니다. 무엇을 어디에 둘지 틀리는 몫이 여기 들어갑니다.",
            },
            {
              symbol: String.raw`C_{\text{밖}}`,
              name: "밖에서 같은 것을 하는 값",
              description:
                "상대를 찾고 값을 알아보고 약속을 맺고 강제하는 몫입니다.",
            },
          ]}
          interpretation="조직의 크기는 누가 정하는 것이 아니라 두 값이 만나는 자리에서 정해집니다. 안쪽이 더 싸면 경계는 밖으로 밀리고, 밖쪽이 더 싸면 안으로 당겨집니다."
          assumptions={[
            "두 값을 같은 단위로 견줄 수 있다고 둡니다.",
            "안쪽 값이 거래 수가 늘수록 오른다고 둡니다. 이것이 멈추는 자리를 만듭니다.",
            "밖에서 같은 것을 다른 조직이 더 싸게 다룰 수 있으면 비교 대상은 시장이 아니라 그 조직이 됩니다.",
          ]}
        />

        <CitationBlock
          source="R. H. Coase, “The Nature of the Firm,” Economica 4(16), 1937"
          citeKey={2}
          href="https://www.jstor.org/stable/2626876"
        >
          경계 조건의 원문은 “a firm will tend to expand until the costs of
          organising an extra transaction within the firm become equal to the
          costs of carrying out the same transaction by means of an exchange on
          the open market or the costs of organising in another firm”입니다.
          비교 대상이 시장만이 아니라 <strong>다른 조직</strong>이기도 하다는
          점이 원문에 함께 적혀 있습니다. 위 식은 그중 시장과의 비교만 적은
          것이고, 다른 조직과의 비교는 같은 형태로 한 항을 바꿔 읽습니다.
        </CitationBlock>
      </section>

      <section id="what-moves" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 경계를 옮기는 것은 조직의 뜻이 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            경계가 두 값이 만나는 자리라면, 경계가 움직이는 것은 두 값 중
            하나가 움직였다는 뜻입니다. Coase는 조직이 더 커지는 조건을 세 가지로
            적었습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="조직이 더 커지는 조건"
          input={[
            "C_안(n): 안에서 n번째 거래를 다루는 값",
            "C_밖: 같은 거래를 시장에서 하는 값",
            "요소의 공급가가 조직 크기에 따라 달라지는 정도",
          ]}
          steps={[
            {
              code: "C_안 증가분이 작고 n이 늘어도 천천히 오른다",
              note: "안으로 들일 때 더 드는 값이 작고 거래를 더 맡아도 그 값이 천천히 오르면 경계가 밖으로 밀립니다.",
            },
            {
              code: "판단이 덜 틀리고 n이 늘어도 오류가 천천히 늘어난다",
              note: "가운데가 무엇을 어디에 둘지 덜 틀리고 다룰 것이 늘어도 틀리는 몫이 천천히 늘면 같은 방향입니다.",
            },
            {
              code: "조직이 커질 때 요소의 공급가가 덜 오른다",
              note: "사람과 설비를 구하는 값이 덜 오르거나 오히려 내리면 경계가 더 밀립니다. 앞의 둘과 달리 조직하는 능력이 아니라 구하는 조건의 문제입니다.",
            },
          ]}
          output="두 값이 만나는 n이 더 커진다 — 즉 조직의 경계가 밖으로 밀린다"
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            여기서 한 가지가 뒤집힙니다. 어떤 회사가 커졌다는 것을 보고 우리는
            그 회사가 잘한다고 읽기 쉽습니다. 그런데 식은 다른 것도 허용합니다.{" "}
            <strong>밖이 나빠져도 경계는 밀립니다.</strong> 상대를 찾기 어려워
            지거나 약속을 강제하기 힘들어진 곳에서는, 안이 전혀 좋아지지 않아도
            조직이 커집니다. 네 번째 장면이 그 경우입니다.
          </p>

          <p className="leading-7">
            Coase는 흩어진 거리와 거래의 종류가 서로 다른 정도, 그리고 값이
            자주 바뀌는 정도가 조직하는 값과 틀리는 몫을 함께 키운다고 적었습니다.
            반대로 요소들을 가까이 모으는 발명은 그 값을 낮춥니다. 통신과 운송이
            싸지면 조직이 커진다는 말이 여기서 나오는데, 같은 발명이 시장 쪽
            값도 낮추므로 어느 쪽이 더 낮아지는지는 미리 정해져 있지 않습니다.
          </p>
        </div>

        <ProgressiveDetail
          title="그러면 왜 가운데가 전부 지시하지 않습니까"
          preview="지시가 값보다 싸다면 조직 안에서도 끝까지 지시만 쓰면 될 텐데, 큰 조직 안에 다시 값이 들어오는 일이 흔합니다."
        >
          <p className="leading-7">
            같은 식이 조직 안에서도 성립하기 때문입니다. 사업부 사이에 내부
            이전가격을 두는 것은 안에서 지시로 조정하는 값이 이미 충분히 올라서,
            값으로 조정하는 쪽이 싸진 자리가 생겼다는 뜻입니다. 경계는 조직과
            시장 사이에만 있는 것이 아니라 조직 안에도 다시 그어집니다.
          </p>
          <p className="leading-7">
            Coase 자신도 비교 대상에 “다른 조직”을 넣어 두었습니다. 조직이 멈추는
            자리가 시장보다 싼 곳일 수도 있고, 그 일을 더 잘 다루는 다른 조직이
            있는 곳일 수도 있습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          경계 안에서는 값이 아니라 지시가 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            1단계가 세운 그림에서 하나가 빠졌습니다. 값이 모든 것을 조정하는
            것이 아니라, <strong>값을 쓰는 것이 비싼 자리에서는 지시가
            대신합니다.</strong> 그 범위가 조직이고, 범위의 끝은 두 값이 만나는
            자리입니다.
          </p>

          <p className="leading-7">
            그런데 여기서 빈칸이 하나 생깁니다. 지금까지는 조직을{" "}
            <strong>값을 받아들이는 쪽</strong>으로 두었습니다. 밖의 값이 주어져
            있고 조직은 그에 맞춰 안팎을 가를 뿐이었습니다. 조직이 충분히 커지면
            그 전제가 깨집니다. 파는 쪽이 하나뿐이면 값은 주어지는 것이 아니라{" "}
            <strong>정해지는 것</strong>이 됩니다.
          </p>

          <p className="leading-7">
            다음 두 편이 그 빈칸을 채웁니다. 먼저 많이 만들수록 값이 싸지는
            구조가 어디서 오는지를 보는데, 거기서 하나로 몰린다는 결론이
            곧바로 따라 나오지는 않는다는 것까지가 그 글의 몫입니다. 그다음
            파는 쪽이 하나일 때 값이 어디에 멈추는지를 셉니다. 1단계에서 세운
            균형값 <code>P* = 7</code>이 그때 어디로 움직이는지가 그 글의
            숫자입니다.
          </p>
        </div>

        <ContentBoundary article="why-firms-exist" />
      </section>
    </div>
  );
}
