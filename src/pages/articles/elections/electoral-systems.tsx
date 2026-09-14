import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ElectoralSystemsViz from "./electoral-systems/viz/ElectoralSystemsViz";
import DivisorViz from "./electoral-systems/viz/DivisorViz";

/**
 * 표를 의석으로 바꾸는 규칙이 결과를 정합니다
 *
 * 4편이 의석 분포를 주어진 것으로 두고 계산했으니, 그 의석이 어디서 오는지를
 * 받는다. 선거구 크기 하나가 제도의 성격을 거의 정한다는 것을 축으로 삼고,
 * 집계 규칙 자체의 한계는 다음 글이 소유한다.
 */
export default function ElectoralSystemsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          표는 그대로인데 의석만 바뀝니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글은 의석 분포를 주어진 것으로 두고 시작했습니다. 누가 몇 석을
            가졌느냐에 따라 협상력이 정해지고, 단독 과반이 있느냐에 따라 정부
            형태의 성격까지 달라졌습니다. 그런데 그 의석은 하늘에서 떨어지지
            않습니다.
          </p>

          <p className="leading-7">
            의석은 표를 세는 규칙이 만들어 냅니다. 그리고 그 규칙은 표를 그대로
            옮기는 통로가 아닙니다. 같은 표에 다른 규칙을 적용하면 전혀 다른
            의회가 나옵니다. 아래 예에서 한 정당은 44퍼센트를 얻고 아홉 석을 전부
            가져가기도 하고, 똑같은 44퍼센트로 세 석만 가져가기도 합니다.
          </p>

          <p className="leading-7">
            이것을 부정이라고 부를 수는 없습니다. 어느 계산에도 잘못이 없기
            때문입니다. 규칙이 다를 뿐입니다.
          </p>
        </div>

        <ElectoralSystemsViz />

        <ContentBoundary article="electoral-systems" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              표를 의석으로 바꾸는 규칙은 무엇을 정하고, 그 대가로 무엇을 버리는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 제도를 이루는 선택지, 표를 버려서 다수를 만드는 쪽, 버리지
            않는 대신 나누어 떨어지지 않는 것을 나누는 쪽, 그 차이를 하나의 수로
            재는 방법, 그리고 둘을 섞었을 때 생기는 일입니다.
          </p>

          <p className="leading-7">
            집계 규칙 자체에 한계가 있다는 더 근본적인 문제는 여기서 다루지
            않습니다. 어떤 규칙을 써도 피할 수 없는 것들은 다음 글{" "}
            <Link to="/politics/elections/voting-paradoxes">
              다수결의 역설
            </Link>
            이 맡습니다.
          </p>
        </div>
      </section>

      <section id="district-magnitude" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 규칙은 여럿이지만 결과를 정하는 것은 거의 하나입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            선거 제도를 설계할 때 정해야 할 것은 여러 가지입니다. 한 선거구에서
            몇 명을 뽑을지, 당선자를 어떻게 가릴지, 의석을 얻으려면 최소 얼마를
            받아야 하는지, 유권자가 몇 표를 어떻게 던질지가 각각 선택지입니다.
          </p>

          <p className="leading-7">
            그런데 이 가운데 하나가 나머지를 거의 다 끌고 갑니다. 한 선거구에서
            몇 명을 뽑는가입니다. 한 명만 뽑으면 그 선거구의 의석은 나눌 수 없고,
            1등이 아닌 모든 표는 의석으로 바뀌지 못합니다. 열 명을 뽑으면 10퍼센트
            남짓만 받아도 한 자리를 가져갈 수 있습니다.
          </p>

          <p className="leading-7">
            그래서 비례성은 제도의 이름이 아니라 이 숫자에서 나옵니다. 비례대표라고
            불러도 선거구마다 두 명씩만 뽑으면 작은 정당은 거의 들어가지 못하고,
            다수제라고 불러도 선거구가 충분히 크면 결과는 꽤 비례에 가까워집니다.
          </p>

          <p className="leading-7">
            나머지 선택지는 이 숫자가 만든 결과를 다듬는 역할을 합니다. 봉쇄조항은
            작은 정당을 한 번 더 걸러 내고, 투표 방식은 유권자가 자기 표를 어디에
            쓸지를 바꿉니다.
          </p>
        </div>

        <TermBreakdown
          title="제도를 이루는 선택지와 각각이 정하는 것"
          items={[
            {
              term: "선거구 크기",
              description:
                "한 선거구에서 뽑는 사람의 수입니다. 의석을 나눌 수 있는 최소 단위를 정하므로 비례성의 상한을 여기서 정합니다.",
              example:
                "한 명을 뽑으면 1등 아닌 표는 전부 버려지고, 열 명을 뽑으면 10퍼센트 남짓으로도 한 자리를 얻습니다.",
              boundary:
                "크기를 키우면 비례성은 올라가지만 유권자와 당선자 사이의 거리도 멀어집니다. 누구를 뽑았는지 특정하기 어려워집니다.",
            },
            {
              term: "당선 결정 방식",
              description:
                "표를 의석으로 바꾸는 계산 규칙입니다. 1등만 가져가는 방식과 몫을 나누는 방식이 크게 갈립니다.",
              example:
                "같은 득표를 단순다수로 세면 한 당이 전부 가져가고, 몫으로 나누면 여러 당에 흩어집니다.",
              boundary:
                "선거구에서 한 명만 뽑으면 어떤 계산 규칙을 써도 결과가 거의 같아집니다. 계산 규칙은 크기가 클 때만 힘을 씁니다.",
            },
            {
              term: "봉쇄조항",
              description:
                "의석 배분에 참여하려면 넘어야 하는 최소 득표율이나 최소 지역구 의석 수입니다.",
              example:
                "전국 득표 3퍼센트를 넘지 못한 정당을 배분에서 빼면, 그 표는 나머지 정당들에게 나뉘어 갑니다.",
              boundary:
                "정당이 너무 잘게 쪼개지는 것을 막는 장치이지만, 문턱 바로 아래의 표는 통째로 버려지므로 불비례를 오히려 키울 수 있습니다.",
            },
          ]}
        />
      </section>

      <section id="plurality" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 다수제는 표를 버려서 다수를 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            한 선거구에서 한 명만 뽑고 1등이 가져가는 방식은 가장 단순합니다.
            그리고 가장 많이 버립니다. 위 예에서 44퍼센트를 얻은 정당이 아홉 석을
            전부 가져가고, 41퍼센트와 15퍼센트는 한 석도 얻지 못했습니다.
          </p>

          <p className="leading-7">
            버리는 것이 결함만은 아닙니다. 이 방식은 의회에 단독 과반을 만들어 낼
            확률을 크게 올립니다. 앞 글에서 봤듯 단독 과반이 있으면 연립 협상이
            필요 없고, 거부권자가 줄어 정부가 결정을 빨리 내립니다. 버려진 표는
            그 대가로 지불한 값입니다.
          </p>

          <p className="leading-7">
            여기서 두 번째 효과가 따라 나옵니다. 이길 수 없는 후보에게 던진 표가
            아무 의석도 만들지 못한다는 것을 유권자가 알면, 당선 가능한 후보 쪽으로
            표를 옮기게 됩니다. 계산 규칙이 표를 버리는 것이 첫째 효과이고, 그 사실을
            안 유권자가 스스로 선택을 바꾸는 것이 둘째 효과입니다. 다수제에서 정당
            수가 줄어드는 경향은 이 둘이 함께 만듭니다.
          </p>

          <p className="leading-7">
            다만 이것은 경향이지 법칙이 아닙니다. 지지가 특정 지역에 몰린 정당은
            전국 득표가 작아도 그 지역에서 계속 1등을 하므로 사라지지 않습니다.
            아래에서 보듯 표가 어디에 몰려 있는지가 결과를 크게 바꿉니다.
          </p>
        </div>

        <div id="districting" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            같은 표에 선거구 경계만 다시 그으면
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              위 Viz의 마지막 장면이 그 실험입니다. 전국 득표는 44·41·15로
              그대로 두고 선거구 경계만 바꿨더니, 아홉 석을 전부 가져가던 정당이
              세 석만 가져갔습니다. 계산 규칙도 유권자도 바뀌지 않았습니다.
            </p>

            <p className="leading-7">
              이유는 단순합니다. 다수제에서 이기는 데 필요한 것은 1등이지 큰
              표차가 아닙니다. 어느 선거구에서 90 대 5로 이기면 남는 표가 전부
              버려지고, 다른 선거구에서 59 대 21로 이기면 같은 한 석을 훨씬 적은
              표로 삽니다. 그래서 표가 몰려 있는 쪽이 손해를 봅니다.
            </p>

            <p className="leading-7">
              이 성질을 의도적으로 쓰면 경계 긋기가 무기가 됩니다. 상대 지지자를
              몇 개 선거구에 몰아넣어 그쪽 표를 남게 만들거나, 반대로 여러
              선거구에 잘게 흩어 어디서도 1등이 되지 못하게 만드는 것입니다. 둘 다
              득표를 한 표도 바꾸지 않고 의석을 바꿉니다.
            </p>

            <p className="leading-7">
              그래서 다수제를 쓰는 곳에서는 경계를 누가 긋는가가 제도의 일부가
              됩니다. 선거 규칙을 정하는 것과 지도를 그리는 것이 같은 무게를 갖고,
              지도를 그리는 쪽이 중립적인지가 별도의 문제로 남습니다.
            </p>
          </div>
        </div>
      </section>

      <section id="proportional" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 비례는 나누어 떨어지지 않는 것을 나눕니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            반대쪽 선택은 선거구를 크게 잡고 득표에 비례해 의석을 나누는
            것입니다. 그런데 여기서 바로 문제가 생깁니다. 의석은 쪼갤 수 없습니다.
            44퍼센트에 9석을 곱하면 3.96석이고, 0.96석을 줄 방법이 없습니다.
          </p>

          <p className="leading-7">
            그래서 비례대표라는 이름 아래에는 실제로 여러 방식이 있습니다. 모두
            남는 소수점을 어떻게 처리할지에 대한 서로 다른 답입니다. 가장 널리
            쓰이는 방식은 표를 1, 2, 3으로 차례로 나눈 몫을 한 줄로 세우고 앞에서부터
            의석 수만큼 끊는 것입니다.
          </p>

          <p className="leading-7">
            이 방식의 성질은 아래 절차에서 바로 드러납니다. 의석을 받은 정당은
            다음 계산에서 나누는 수가 커지므로 몫이 줄고, 그만큼 다른 정당에게
            차례가 돌아갑니다. 큰 정당의 몫이 충분히 줄어드는 순간에만 작은 정당이
            들어옵니다.
          </p>
        </div>

        <AlgorithmBlock
          title="몫을 큰 순서로 세워 의석을 하나씩 나누는 절차"
          input={[
            "각 정당의 득표수",
            "나눌 의석 수",
            "봉쇄조항이 있다면 그 문턱",
          ]}
          steps={[
            {
              code: "봉쇄조항을 넘지 못한 정당을 먼저 배분 대상에서 제외한다.",
              note: "제외된 정당의 표는 사라지는 것이 아니라 남은 정당들에게 나뉘어 갑니다. 문턱 바로 아래에서 떨어진 표가 불비례의 큰 몫을 차지하기도 합니다.",
            },
            {
              code: "각 정당에 대해 득표를 1, 2, 3, … 으로 나눈 몫을 모두 구한다.",
              note: "나누는 수는 그 정당이 이미 받은 의석 수에 1을 더한 값입니다. 의석을 많이 받을수록 다음 몫이 작아집니다.",
            },
            {
              code: "모든 몫을 큰 순서로 한 줄로 세운다.",
              note: "정당별로 줄을 세우는 것이 아니라 전부 섞어서 한 줄입니다. 이 줄이 곧 의석을 가져가는 순서입니다.",
            },
            {
              code: "앞에서부터 나눌 의석 수만큼 끊고, 각 몫의 주인에게 의석을 하나씩 준다.",
              note: "끊는 자리 바로 뒤에 있던 몫은 의석으로 바뀌지 못합니다. 그 몫이 누구 것인지가 제도의 성격을 드러냅니다.",
            },
            {
              code: "나누는 수를 1, 3, 5, … 로 바꾸면 다른 방식이 된다.",
              note: "첫 의석을 받기까지의 문턱이 낮아져 작은 정당이 더 일찍 들어옵니다. 어느 쪽이 옳은 것이 아니라, 비례를 무엇으로 볼지에 대한 답이 다른 것입니다.",
            },
          ]}
          output="각 정당이 가져가는 의석 수와, 끊는 자리 뒤에 남아 잘린 몫의 목록"
        />

        <DivisorViz />
      </section>

      <section id="disproportionality" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 얼마나 비틀렸는지는 하나의 수로 잴 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            지금까지는 제도를 말로 비교했습니다. 그런데 어느 제도가 표를 얼마나
            비트는지는 숫자로 잴 수 있고, 재고 나면 비교가 훨씬 정확해집니다.
          </p>

          <p className="leading-7">
            재는 방법은 간단합니다. 각 정당의 득표율과 의석률의 차이를 보는
            것입니다. 다만 차이를 그냥 더하면 안 됩니다. 남는 쪽과 모자라는 쪽이
            서로 상쇄되어 언제나 0이 되기 때문입니다. 그래서 제곱해서 더합니다.
          </p>

          <p className="leading-7">
            제곱해서 더하면 또 하나가 따라옵니다. 큰 차이가 작은 차이보다 훨씬
            무겁게 들어간다는 것입니다. 이것은 결함이 아니라 의도입니다. 여러 정당이
            조금씩 손해 보는 것과 한 정당이 크게 손해 보는 것을 다른 사건으로 세겠다는
            뜻입니다.
          </p>
        </div>

        <ExplainedFormula
          question="어떤 제도가 표를 더 많이 비트는지 어떻게 비교하는가?"
          idea="각 정당에 대해 득표율과 의석률의 차이를 구하고, 상쇄되지 않도록 제곱해서 더합니다. 합을 반으로 나누는 것은 하나의 왜곡이 반드시 두 번 세어지기 때문입니다. 한 정당이 실제보다 많이 받으면 다른 정당이 그만큼 적게 받으므로, 같은 왜곡이 양쪽에서 한 번씩 계산에 들어옵니다."
          formula={String.raw`\mathrm{LSq} = \sqrt{\tfrac{1}{2} \sum_{i=1}^{n} (v_i - s_i)^2}`}
          annotatedFormula={String.raw`\mathrm{LSq} = \sqrt{\tfrac{1}{2} \sum_{i=1}^{n} \underbrace{(v_i - s_i)^2}_{i\text{가 받은 몫과 얻은 몫의 어긋남}}}`}
          operations={[
            {
              expression: String.raw`(v_i - s_i)^2`,
              annotation: [
                "득표율에서 의석률을 뺀 차이를 제곱합니다. 남는 쪽과 모자라는 쪽이 상쇄되지 않게 하려는 것입니다.",
                "제곱이므로 큰 어긋남 하나가 작은 어긋남 여럿보다 훨씬 무겁게 들어갑니다.",
              ],
            },
            {
              expression: String.raw`\tfrac{1}{2}`,
              annotation: [
                "한 정당이 더 받은 만큼 다른 정당이 덜 받으므로 같은 왜곡이 두 번 세어집니다. 반으로 나눠 한 번으로 만듭니다.",
                "이 인자가 없으면 값이 언제나 √2배 커질 뿐 제도 사이의 순서는 바뀌지 않습니다.",
              ],
            },
            {
              expression: String.raw`\sqrt{\phantom{x}}`,
              annotation: [
                "제곱해서 더한 값을 다시 퍼센트 단위로 되돌립니다.",
                "그래서 결과를 '평균적으로 몇 퍼센트포인트 어긋났는가'에 가깝게 읽을 수 있습니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`v_i`,
              name: "정당 i의 득표율",
              description:
                "전체 유효표에서 그 정당이 받은 비율이며 퍼센트로 씁니다.",
            },
            {
              symbol: String.raw`s_i`,
              name: "정당 i의 의석률",
              description:
                "전체 의석에서 그 정당이 얻은 비율이며 같은 단위로 씁니다.",
            },
            {
              symbol: String.raw`\mathrm{LSq}`,
              name: "불비례 지수",
              description:
                "0이면 득표율과 의석률이 완전히 일치하고, 값이 클수록 표가 의석으로 옮겨 가는 과정에서 많이 비틀렸다는 뜻입니다.",
            },
          ]}
          assumptions={[
            "정당이 분석의 단위라고 둡니다. 무소속이 많으면 각각을 하나의 정당처럼 세어야 해서 값이 흔들립니다.",
            "득표율과 의석률을 같은 시점의 같은 선거에서 잰다고 둡니다. 지역구와 비례를 따로 뽑는 제도에서는 어느 표를 기준으로 삼을지부터 정해야 합니다.",
            "비례에서 벗어난 정도만 재고, 그 벗어남이 정당한지 아닌지는 판단하지 않습니다.",
          ]}
          interpretation="위 예에서 득표율은 44·41·15퍼센트입니다. 소선거구 단순다수로 세어 의석이 9·0·0이 되면 의석률은 100·0·0이고, 차이의 제곱을 더하면 3136 더하기 1681 더하기 225로 5042이며, 반으로 나눈 2521의 제곱근은 약 50.2입니다. 같은 표를 전국 비례로 나눠 4·4·1이 되면 의석률이 44.4·44.4·11.1이 되어 값은 약 3.7로 떨어집니다. 선거구 경계만 바꿔 3·6·0이 된 경우는 약 22.3입니다. 여기서 읽어야 할 것은 세 값의 순서가 아니라 격차의 크기입니다. 같은 표를 놓고 규칙만 바꿨는데 50.2와 3.7이 나온다는 것이 제도가 결과를 얼마나 만드는지를 보여 줍니다. 읽으면 안 되는 것은 값이 작은 제도가 더 좋은 제도라는 결론입니다. 이 수는 비례에서 벗어난 정도만 재며, 그 대가로 얻는 단독 과반이나 대표의 지역 연결은 세지 않습니다."
        />

        <CitationBlock
          source="Michael Gallagher · Election indices (최소제곱지수의 출처를 저자 본인이 밝힌 문서)"
          citeKey={1}
          href="https://doi.org/10.1016/0261-3794(91)90004-C"
        >
          위 지수는 저자 본인이 정리한 &ldquo;Election indices&rdquo; 문서에서
          &ldquo;득표 분포와 의석 분포 사이의 불비례를 재는 최소제곱지수(LSq)&rdquo;로
          소개되며, 출처를 Michael Gallagher, &lsquo;Proportionality, disproportionality
          and electoral systems&rsquo;, <em>Electoral Studies</em> 10권 1호(1991),
          33~51쪽으로 밝힙니다. 같은 문서가 정당 수를 재는 다른 지수의 출처도 함께
          적고 있어, 두 지수를 짝지어 쓰는 관행이 어디서 왔는지 확인할 수 있습니다.
          다만 1991년 원 논문 자체는 출판사 쪽이 자동 조회를 막아 열지 못했고, 서지
          사항과 지수의 귀속만 확인했습니다. 지수의 계산 자체는 이 글에서 직접
          전개한 것입니다.
        </CitationBlock>

        <ProgressiveDetail
          title="불비례가 낮은 것이 언제나 좋은가?"
          preview="이 수는 비례에서 벗어난 정도만 재고, 벗어남의 대가로 무엇을 얻었는지는 세지 않습니다."
        >
          <p className="leading-7">
            값이 0이라는 것은 득표율과 의석률이 일치한다는 뜻일 뿐, 그 의회가 잘
            굴러간다는 뜻이 아닙니다. 완전히 비례하는 의회는 사회의 분열을 그대로
            옮겨 놓으므로, 앞 글에서 본 정부 구성 문제가 그만큼 어려워집니다.
          </p>
          <p className="leading-7">
            반대로 값이 크다는 것도 그 자체로는 판정이 아닙니다. 다수제가 만드는
            높은 값은 단독 과반을 만들기 위해 지불한 값이며, 그 단독 과반이
            필요한지 아닌지는 이 수 바깥의 문제입니다.
          </p>
          <p className="leading-7">
            그래서 이 지수는 제도를 고르는 기준이 아니라 무엇을 얼마나 지불했는지
            읽는 계기판에 가깝습니다. 두 제도를 비교할 때 이 값과 함께 의회가 정부를
            세울 수 있는지, 대표가 지역과 연결되어 있는지를 같이 놓고 봐야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="mixed" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 섞으면 두 논리가 한 선거에 들어옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            많은 나라가 둘 중 하나를 고르는 대신 섞습니다. 의석의 일부는 소선거구로
            뽑아 지역과 대표를 연결하고, 나머지는 정당 득표에 따라 나눠 비례를
            보충하는 식입니다.
          </p>

          <p className="leading-7">
            섞는 방식은 크게 둘입니다. 두 부분을 따로 계산해 단순히 더하면 지역구의
            불비례가 그대로 남고 비례 부분만큼만 완화됩니다. 반대로 정당 득표율로
            전체 의석을 먼저 정하고 지역구에서 이미 얻은 만큼을 빼서 채우면, 전체가
            비례에 가까워집니다. 같은 이름으로 불려도 이 둘은 다른 제도입니다.
          </p>

          <p className="leading-7">
            한국은 지역구를 소선거구 단순다수로 뽑고 비례대표를 따로 두는 쪽에
            속합니다. 그리고 그 구체적인 규칙은 헌법이 아니라 법률에 맡겨져
            있습니다. 헌법은 국회가 보통·평등·직접·비밀선거로 선출된 의원으로
            구성된다는 것과 의원 수의 하한만 정하고, 선거구와 비례대표에 관한
            사항은 법률로 정한다고 위임합니다.
          </p>

          <p className="leading-7">
            이 위임이 앞 글의 논의와 직접 이어집니다. 헌법 개정에는 높은 문턱이
            있지만 법률 개정에는 없습니다. 그래서 선거 제도는 헌정 질서 가운데
            가장 바꾸기 쉬운 부분이며, 바꾸는 주체가 그 제도로 당선된 사람들이라는
            점에서 한 번 더 특이합니다. 규칙을 고치는 쪽과 규칙의 적용을 받는 쪽이
            같습니다.
          </p>
        </div>

        <CitationBlock
          source="대한민국헌법 제41조 (한국법제연구원 영문 번역본)"
          citeKey={2}
          href="https://elaw.klri.re.kr/eng_service/lawView.do?hseq=1&lang=ENG"
        >
          제1항은 국회가 &ldquo;보통·평등·직접·비밀선거로 국민이 선출한
          의원으로 구성된다&rdquo;고 정하고, 제2항은 의원 수를 법률로 정하되
          200인 이상이어야 한다고 합니다. 제3항은 &ldquo;국회의원의 선거구,
          비례대표제, 그 밖에 국회의원 선거에 관한 사항은 법률로 정한다&rdquo;고
          하여 제도 설계 전체를 법률에 위임합니다. 위 본문에서 선거 제도가 헌정
          질서 가운데 가장 바꾸기 쉬운 부분이라고 한 근거가 이 위임 구조입니다.
          번역본은 참조용이며 법적 효력은 국문 원문에 있다고 이 사이트가
          명시합니다.
        </CitationBlock>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          제도는 무엇을 버릴지 정할 뿐 옳은 답을 정하지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글의 비교는 어느 제도가 옳은가에 대한 답을 주지 않습니다. 준
            것은 각 제도가 무엇을 사고 무엇으로 값을 치르는지입니다. 다수제는
            단독 과반을 사고 표를 지불하며, 비례는 표를 지키고 정부 구성의
            어려움을 지불합니다.
          </p>

          <p className="leading-7">
            그리고 이 글의 계산에는 전부 같은 가정이 깔려 있었습니다. 유권자의
            선호가 고정되어 있고, 제도는 그 선호를 세는 방법일 뿐이라는 가정입니다.
            실제로는 규칙을 아는 유권자가 자기 표를 다르게 쓰므로 득표율 자체가
            제도의 결과입니다.
          </p>

          <p className="leading-7">
            더 근본적인 문제도 남아 있습니다. 여기서는 어떻게 세느냐만 다뤘지, 셈
            자체가 사람들의 뜻을 제대로 담아낼 수 있는지는 묻지 않았습니다. 그런데
            선택지가 셋 이상이면 어떤 집계 규칙도 피하지 못하는 이상한 일들이
            생깁니다.
          </p>

          <p className="leading-7">
            다음 글{" "}
            <Link to="/politics/elections/voting-paradoxes">
              다수결의 역설
            </Link>
            이 그 문제를 맡습니다. 규칙을 고르는 문제가 아니라 규칙이라는 것에
            애초에 어떤 한계가 있는지가 주제입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
