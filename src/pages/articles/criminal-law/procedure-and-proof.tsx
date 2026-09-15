import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import TwoErrorsViz from "./procedure-and-proof/viz/TwoErrorsViz";
import ProofThresholdViz from "./procedure-and-proof/viz/ProofThresholdViz";

/**
 * 얼마나 확실해야 벌할 수 있습니까
 *
 * 7편이 벌하는 이유와 크기까지 다뤘으니, 벌하기 전에 무엇을 얼마나 증명해야
 * 하는지를 받는다. 두 오판의 비대칭과 문턱의 계산, 증명 책임의 배치, 증거를
 * 모은 방법까지가 범위이고, 재판까지 가지 않는 사건은 다음 글이 소유한다.
 */
export default function ProcedureAndProofArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          벌하기로 정해도 벌하기 전에 해야 할 일이 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서 막는 힘을 잡힐 확률과 형량의 곱으로 적었습니다. 그런데 그
            확률 안에 아직 설명하지 않은 것이 들어 있습니다. 붙잡히는 것과 유죄로
            인정되는 것은 다릅니다.
          </p>

          <p className="leading-7">
            사이에 문턱이 있습니다. 얼마나 확실해야 벌할 수 있는가입니다. 그리고
            이 문턱을 어디에 두느냐는 취향이 아닙니다. 계산할 수 있습니다.
          </p>

          <p className="leading-7">
            출발점은 틀리는 방식이 둘이라는 것입니다. 하지 않은 사람을 벌하는 것과 한 사람을 놓아주는 것이고 둘의 무게가 같지 않습니다.
          </p>
        </div>

        <TwoErrorsViz />

        <ContentBoundary article="procedure-and-proof" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              얼마나 확실해야 벌할 수 있고, 그 문턱은 무엇이 정하며, 문턱만으로
              모자란 부분은 무엇이 메우는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 두 잘못의 비대칭, 문턱의 계산, 그 문턱에서 따라 나오는 증명
            책임의 배치, 그리고 증거를 어떻게 모았는지가 왜 따로 걸리는지입니다.
          </p>

          <p className="leading-7">
            여기까지가 재판이 열렸을 때의 이야기입니다. 그런데 대부분의 분쟁은
            재판까지 가지 않습니다. 그 사정은 다음 글{" "}
            <Link to="/law/dispute-resolution/settlement-and-access">
              합의와 재판
            </Link>
            이 맡습니다.
          </p>
        </div>
      </section>

      <section id="two-errors" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 두 잘못은 같은 종류가 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            하지 않은 사람을 벌하는 것과 한 사람을 놓아주는 것은 둘 다 틀린
            판정입니다. 그런데 남기는 것이 다릅니다.
          </p>

          <p className="leading-7">
            앞쪽은 없던 불이익을 새로 만듭니다. 그 사람은 조심해서 피할 방법이 애초에 없었고 이미 치른 것은 되돌릴 수 없습니다. 그리고 그 일이 알려지면 다른 사람들도 조심해서 피할
            수 있다는 믿음을 잃습니다.
          </p>

          <p className="leading-7">
            뒤쪽은 손해를 남기고 억제를 약하게 만듭니다. 심각한 결과이지만 성격이 다릅니다. 그 사람에게 없던 불이익이 새로 생기지는 않고 앞 글의 계산에서 확률이 조금 내려가는 형태로
            나타납니다.
          </p>

          <p className="leading-7">
            그러면 자연스러운 물음이 나옵니다. 둘의 무게가 다르다면 문턱을 어디에
            두어야 합니까.
          </p>
        </div>
      </section>

      <section id="threshold" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 문턱의 위치는 두 무게의 비가 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            증거를 다 보고 나면 그 사람이 했을 확률에 대한 판단이 남습니다. 완전히 확실한 경우는 드물고 대개는 어느 정도 그럴듯하다는 상태입니다.
          </p>

          <p className="leading-7">
            이때 유죄로 하면 그 사람이 하지 않았을 확률만큼 무고한 유죄의 위험을
            지고, 무죄로 하면 그 사람이 했을 확률만큼 놓아주는 위험을 집니다. 두
            위험을 견주면 문턱이 나옵니다.
          </p>

          <p className="leading-7">
            그리고 결과가 놀랄 만큼 간단합니다. 문턱은 두 잘못의 무게의 비만으로
            정해집니다.
          </p>
        </div>

        <ExplainedFormula
          question="증거를 다 보고 나서 얼마나 그럴듯해야 벌할 수 있는가?"
          idea="유죄로 하면 그 사람이 하지 않았을 확률만큼 무고한 유죄의 대가를 치를 위험을 지고, 무죄로 하면 그 사람이 했을 확률만큼 놓아주는 대가를 치를 위험을 집니다. 두 기대 대가를 견주어 작은 쪽을 고르면 되고, 그 비교를 정리하면 문턱이 두 대가의 비만으로 정해집니다."
          formula={String.raw`(1-\pi)\,C_{\text{오유죄}} < \pi\,C_{\text{놓침}} \quad\Longleftrightarrow\quad \pi > \pi^{*} = \frac{r}{1+r}, \qquad r = \frac{C_{\text{오유죄}}}{C_{\text{놓침}}}`}
          annotatedFormula={String.raw`\underbrace{(1-\pi)\,C_{\text{오유죄}}}_{\text{유죄로 할 때의 기대 대가}} < \underbrace{\pi\,C_{\text{놓침}}}_{\text{무죄로 할 때의 기대 대가}} \quad\Longleftrightarrow\quad \pi > \underbrace{\frac{r}{1+r}}_{\text{문턱}}`}
          operations={[
            {
              expression: String.raw`(1-\pi)\,C_{\text{오유죄}}`,
              annotation: [
                "유죄로 판정했을 때 치를 수 있는 대가입니다. 그 사람이 하지 않았을 확률에 무고한 유죄의 대가를 곱합니다.",
                "했을 경우에는 맞은 판정이므로 대가가 없습니다. 그래서 확률이 1 − π입니다.",
              ],
            },
            {
              expression: String.raw`\pi\,C_{\text{놓침}}`,
              annotation: [
                "무죄로 판정했을 때 치를 수 있는 대가이며, 그 사람이 했을 확률에 놓아주는 대가를 곱합니다.",
                "두 식 모두 같은 π로 쓰였다는 것이 중요합니다. 같은 증거를 놓고 두 선택을 비교하는 것이기 때문입니다.",
              ],
            },
            {
              expression: String.raw`\frac{r}{1+r}`,
              annotation: [
                "부등식을 π에 대해 풀면 두 대가의 절대 크기는 사라지고 비만 남습니다. 문턱을 정하는 데 필요한 것은 비 하나뿐입니다.",
                "r이 커질수록 문턱이 1에 가까워지지만 결코 1이 되지는 않습니다. 확실해야 한다는 요구가 완전한 확실을 뜻할 수는 없다는 것이 식에서 나옵니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\pi`,
              name: "증거를 본 뒤의 유죄 확률",
              description:
                "제출된 증거를 모두 고려했을 때 그 사람이 했을 것으로 보이는 정도입니다.",
            },
            {
              symbol: String.raw`C_{\text{오유죄}}`,
              name: "무고한 사람을 벌하는 대가",
              description:
                "그 사람이 치르는 것뿐 아니라 그런 일이 일어난다는 사실이 사회에 남기는 것까지 넣습니다.",
            },
            {
              symbol: String.raw`C_{\text{놓침}}`,
              name: "한 사람을 놓아주는 대가",
              description:
                "남은 손해와 억제가 약해지는 몫을 넣습니다.",
            },
          ]}
          assumptions={[
            "두 대가를 같은 단위로 견줄 수 있다고 둡니다. 실제로는 그 비를 정하는 일 자체가 사회의 선택이며 계산으로 나오지 않습니다.",
            "증거를 본 뒤의 확률을 하나의 수로 말할 수 있다고 둡니다. 실제 판단은 그렇게 표현되지 않고, 사람마다 다른 수를 떠올립니다.",
            "판정하는 쪽이 이 비교를 그대로 한다고 둡니다. 문턱을 말로 정해 주는 것과 실제로 그 자리에서 판단하는 것 사이에 거리가 있습니다.",
          ]}
          interpretation="두 잘못의 무게가 같다면 비가 1이므로 문턱은 50퍼센트입니다. 조금이라도 더 그럴듯한 쪽으로 정하면 된다는 뜻이고, 사인끼리 다투는 사건에서 쓰는 기준이 여기 가깝습니다. 무고한 유죄를 열 배 무겁게 본다면 문턱이 90.9퍼센트가 되고, 백 배로 보면 99.0퍼센트가 됩니다. 여기서 읽어야 할 것은 형사와 민사의 기준이 다른 이유가 한쪽이 느슨해서가 아니라 두 잘못의 무게가 다르기 때문이라는 점입니다. 또 하나는 비를 아무리 올려도 문턱이 100퍼센트가 되지 않는다는 점입니다. 확실해야 한다는 요구가 완전한 확실을 뜻한다면 아무도 벌할 수 없게 됩니다. 읽으면 안 되는 것은 이 식이 실제 판단을 대신한다는 결론입니다. 두 대가의 비를 정하는 일은 계산에서 나오지 않고, 증거를 본 뒤의 확률도 하나의 수로 떨어지지 않습니다."
        />

        <ProofThresholdViz />

        <CitationBlock
          source="대한민국헌법 제27조 제4항 · 제12조 제7항 (한국법제연구원 영문 번역본)"
          citeKey={1}
          href="https://elaw.klri.re.kr/eng_service/lawView.do?hseq=1&lang=ENG"
        >
          제27조 제4항은 &ldquo;형사피고인은 유죄의 판결이 확정될 때까지는
          무죄로 추정된다&rdquo;고 정합니다. 위 계산에서 문턱을 넘지 못한 상태의
          기본값이 무죄라는 것이 이 조문에 해당합니다. 제12조 제7항은 고문·폭행·
          협박·구속의 부당한 장기화 또는 기망 등으로 자의로 진술된 것이 아니라고
          인정되는 자백과, 정식재판에서 피고인의 자백이 그에게 불리한 유일한
          증거일 때의 자백을 유죄의 증거로 삼지 못하게 하고 그 자백만으로 처벌하지
          못하게 합니다. 아래 4절에서 증거를 어떻게 모았는지가 따로 걸린다고 한
          근거가 앞부분이고, 확률이 아무리 높아 보여도 증거의 구조를 함께 본다는
          것이 뒷부분입니다. 번역본은 참조용이며 법적 효력은 국문 원문에 있다고
          이 사이트가 명시합니다.
        </CitationBlock>
      </section>

      <section id="burden" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 문턱을 정하면 누가 넘어야 하는지도 정해집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            문턱이 높다는 것은 넘지 못한 상태의 기본값이 무죄라는 뜻입니다. 그래서
            증거가 부족할 때 누가 지는지가 자동으로 정해집니다. 벌하려는 쪽입니다.
          </p>

          <p className="leading-7">
            이 배치가 만드는 것이 몇 가지 있습니다. 먼저 스스로 하지 않았음을 보일 필요가 없어집니다. 하지 않았다는 것을 보이는 일은 대개 훨씬 어렵고 어떤 경우에는 불가능합니다.
          </p>

          <p className="leading-7">
            다음으로 애매한 상태의 처리가 정해집니다. 증거가 팽팽하면 문턱을 넘지
            못한 것이고, 넘지 못하면 무죄입니다. 판단을 미루거나 반반으로 나누는
            선택지가 없습니다.
          </p>

          <p className="leading-7">
            그리고 앞 글의 계산과 다시 만납니다. 문턱이 높을수록 실제 유죄 확률이 내려가므로 같은 형량이라도 막는 힘이 줄어듭니다. 문턱을 높이는 것은 공짜가 아닙니다.
          </p>
        </div>

        <TermBreakdown
          title="문턱이 높을 때 따라오는 것들"
          items={[
            {
              term: "기본값이 무죄",
              description:
                "문턱을 넘지 못한 상태가 무죄이므로 증거가 부족하면 벌하려는 쪽이 집니다.",
              example:
                "제출된 증거로 문턱에 이르지 못하면 그것으로 끝이고, 더 확인해 보자는 선택지는 절차가 허용하는 범위 안에서만 있습니다.",
              boundary:
                "기본값이 무죄라는 것이 그 사람이 하지 않았다는 판정은 아닙니다. 문턱을 넘지 못했다는 판정입니다.",
            },
            {
              term: "하지 않았음을 보일 필요가 없음",
              description:
                "없었다는 것을 보이는 일은 대개 훨씬 어렵고 때로는 불가능하므로, 그 부담을 지우지 않습니다.",
              example:
                "그 시간에 다른 곳에 있었음을 보이는 것이 가능한 경우도 있지만, 아무것도 하지 않았음을 보이는 것은 대개 불가능합니다.",
              boundary:
                "어떤 항목은 그 사실을 아는 쪽이 대기가 훨씬 싸서 예외를 두기도 합니다. 예외의 범위 자체가 다투어지는 지점입니다.",
            },
            {
              term: "막는 힘이 줄어듦",
              description:
                "문턱이 높을수록 실제 유죄 확률이 내려가므로 앞 글의 곱이 작아집니다.",
              example:
                "같은 법정형이라도 문턱이 높은 제도에서 기대 제재가 더 작습니다.",
              boundary:
                "이것은 문턱을 낮출 이유가 아니라 문턱의 값을 치르고 있다는 사실의 확인입니다. 값을 알고 치르는 것과 모르고 치르는 것은 다릅니다.",
            },
          ]}
        />
      </section>

      <section id="how-evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 얼마나 확실한가와 어떻게 알아냈는가는 다른 질문입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절까지는 증거가 확률을 얼마나 밀어 올리는지만 봤습니다. 그런데 그
            증거를 어떻게 모았는지가 따로 걸립니다. 확률을 충분히 올려 주는
            증거라도 쓰지 못하는 경우가 있습니다.
          </p>

          <p className="leading-7">
            이상하게 들립니다. 확실성을 높여 주는 정보를 버리면 두 잘못이 모두
            늘어날 것 같기 때문입니다. 그런데 그렇게 하는 이유가 있습니다.
          </p>

          <p className="leading-7">
            첫째는 그 증거가 실제로는 확률을 올려 주지 않는 경우입니다. 강요로 얻은 진술은 한 사람이 하지 않았어도 나올 수 있으므로 했다는 쪽으로 확률을 올려 주지 못합니다. 쓰지
            않는 것이 정확성 자체를 위한 선택입니다.
          </p>

          <p className="leading-7">
            둘째는 앞으로의 행동입니다. 그렇게 얻은 증거를 쓸 수 있게 두면 그렇게 얻을 유인이 생깁니다. 개별 사건에서는 정확성을 조금 잃지만 그 방식이 반복되는 것을 막아 전체적으로는
            잃지 않습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="제출된 증거로 벌할 수 있는지 판정하는 절차"
          input={[
            "제출된 증거와 각 증거를 얻은 경위",
            "그 사건에서 두 잘못의 무게에 대한 판단",
            "증거들이 서로 독립인지에 대한 확인",
          ]}
          steps={[
            {
              code: "각 증거를 어떻게 얻었는지 먼저 본다. 금지된 방법으로 얻은 것은 확률 계산에 넣지 않는다.",
              note: "순서가 중요합니다. 확률을 먼저 계산하고 나중에 빼면, 이미 본 것을 보지 않은 것처럼 판단해야 하는 어려움이 생깁니다.",
            },
            {
              code: "남은 증거가 그 사람이 하지 않았을 때도 같은 모양으로 나올 수 있는지 본다.",
              note: "하지 않았어도 나올 수 있는 증거는 확률을 올려 주지 못합니다. 강요로 얻은 진술이 배제되는 첫째 이유가 이것입니다.",
            },
            {
              code: "증거들이 서로 독립인지 확인한다. 한 뿌리에서 나온 것들을 여럿으로 세지 않는다.",
              note: "같은 사람의 진술을 여러 경로로 받은 것은 하나입니다. 독립이 아닌 것을 곱하면 확률이 실제보다 훨씬 높게 나옵니다.",
            },
            {
              code: "자백이 유일한 증거인지 본다. 유일하면 그것만으로 문턱을 넘었다고 보지 않는다.",
              note: "자백은 여러 이유로 나올 수 있어 한 뿌리에 전체를 거는 것이 위험합니다. 이 점은 얻은 방법과 별개로 걸립니다.",
            },
            {
              code: "남은 증거로 확률이 문턱을 넘는지 본다. 넘지 못하면 무죄다.",
              note: "팽팽한 상태는 넘지 못한 상태입니다. 판단을 미루거나 반반으로 나누는 선택지가 없습니다.",
            },
            {
              code: "넘었다면 앞 글의 층을 확인해 어느 구간의 형을 정할지 본다.",
              note: "같은 계열의 더 무거운 행위와 더 가벼운 행위를 함께 놓고 정해야 층이 유지됩니다.",
            },
          ]}
          output="벌할 수 있는지에 대한 판정과, 판정에서 빠진 증거 및 그것이 빠진 이유"
        />

        <ProgressiveDetail
          title="증거를 버리면 정확성을 잃는 것 아닌가?"
          preview="버리는 증거의 상당수는 애초에 확률을 올려 주지 않던 것입니다."
        >
          <p className="leading-7">
            직관적으로는 정보를 버리면 판단이 나빠질 것 같습니다. 그런데 배제되는
            증거의 성격을 보면 사정이 다릅니다. 강요로 얻은 진술은 하지 않은
            사람에게서도 같은 모양으로 나옵니다. 그런 증거는 두 경우를 갈라 주지
            못하므로 확률을 올려 주지도 않습니다.
          </p>
          <p className="leading-7">
            그래서 이 배제는 정확성을 희생해 다른 가치를 사는 거래가 아니라 상당 부분은 정확성 자체를 위한 정리입니다. 이 점이 흐려지면 배제 규칙이 언제나 값을 치르는 것처럼
            보입니다.
          </p>
          <p className="leading-7">
            다만 전부가 그렇지는 않습니다. 절차를 어겨 얻었지만 내용은 믿을 만한 증거도 있고 그때는 실제로 값을 치릅니다. 그 값을 치르는 이유가 앞으로 그렇게 얻을 유인을 없애는 데
            있다는 것을 분명히 해 두어야, 어디까지 배제할지를 따질 수 있습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          이 모든 것은 재판이 열렸을 때의 이야기입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글은 벌하기 전에 무엇을 얼마나 증명해야 하는지를 다뤘습니다. 두
            잘못의 무게가 문턱을 정하고, 문턱이 증명 책임을 정하고, 증거를 얻은
            방법이 따로 걸린다는 것까지였습니다.
          </p>

          <p className="leading-7">
            그런데 이 절차가 실제로 돌아가는 사건은 전체의 아주 일부입니다. 대부분의 분쟁은 판결이 아니라 합의로 끝나고 형사에서도 다투지 않고 끝나는 경우가 많습니다.
          </p>

          <p className="leading-7">
            그러면 이상한 일이 생깁니다. 지금까지 여덟 글에서 본 규칙들이 실제로
            적용되는 사건이 드물다면, 그 규칙들은 무엇을 하고 있는 것입니까.
          </p>

          <p className="leading-7">
            다음 글{" "}
            <Link to="/law/dispute-resolution/settlement-and-access">
              합의와 재판
            </Link>
            이 그 질문으로 이 시리즈를 닫습니다. 재판까지 가는 사건과 그 전에
            끝나는 사건을 무엇이 가르고, 적용되지 않는 규칙이 어떻게 작동하는지가
            주제입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
