import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import WhyStateProsecutesViz from "./crime-and-punishment-purpose/viz/WhyStateProsecutesViz";
import DeterrenceViz from "./crime-and-punishment-purpose/viz/DeterrenceViz";

/**
 * 왜 국가가 직접 벌합니까
 *
 * 사법 세 글이 값을 주고받는 조정까지 다뤘으니, 그 조정이 무너지는 영역을
 * 받는다. 벌하는 네 이유와 억제의 계산, 형량만 올리는 방식이 실패하는 지점,
 * 그리고 죄형법정주의까지가 범위이고 증명은 다음 글이 소유한다.
 */
export default function CrimeAndPunishmentPurposeArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          값을 주고받는 방식이 무너지는 자리가 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 세 글은 전부 사인 사이의 조정이었습니다. 약속을 어기면 물리고,
            경계를 넘으려면 사거나 값을 치르고, 사고가 나면 누가 질지를 정했습니다.
            끝은 언제나 값을 주고받는 것이었습니다.
          </p>

          <p className="leading-7">
            그 방식이 작동하려면 조건이 셋 필요합니다. 누가 했는지 알아야 하고,
            그쪽에 물릴 재산이 있어야 하며, 값을 치르면 정리되는 종류의 일이어야
            합니다. 셋 중 하나만 빠져도 사슬이 끊어집니다.
          </p>

          <p className="leading-7">
            그래서 다른 장치가 따로 있습니다. 당한 쪽이 아니라 국가가 나서고,
            값을 물리는 대신 벌합니다. 그런데 벌하는 것은 아무것도 만들어 내지
            않고 비용만 듭니다. 그럼에도 왜 하는지부터 물어야 합니다.
          </p>
        </div>

        <WhyStateProsecutesViz />

        <ContentBoundary article="crime-and-punishment-purpose" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              왜 국가가 직접 벌하고, 그 이유가 얼마나 벌할지에 대해 무엇을 말해
              주는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 벌하는 이유 네 갈래, 그 가운데 계산이 가능한 하나, 형량만
            올리는 방식이 실패하는 지점, 그리고 그 계산이 성립하려면 무엇이 미리
            정해져 있어야 하는지입니다.
          </p>

          <p className="leading-7">
            벌하기 전에 무엇을 얼마나 증명해야 하는지는 다루지 않습니다. 다음 글{" "}
            <Link to="/law/criminal-law/procedure-and-proof">절차와 증명</Link>이
            그 자리를 맡습니다.
          </p>
        </div>
      </section>

      <section id="four-reasons" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 벌하는 이유가 넷이고 각각 다른 것을 요구합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            왜 벌하느냐는 물음에 답이 하나가 아닙니다. 그리고 답이 다르면 얼마나
            벌해야 하는지도 달라집니다. 그래서 이유를 먼저 갈라 놓아야 형량 논의가
            엇갈리지 않습니다.
          </p>

          <p className="leading-7">
            첫째는 한 일에 값하는 만큼 갚는다는 것입니다. 이 답은 형량을 지은
            죄의 무게에 묶습니다. 더 벌하면 지나치고 덜 벌하면 모자랍니다. 앞으로
            생길 효과는 계산에 들어오지 않습니다.
          </p>

          <p className="leading-7">
            둘째는 앞으로 같은 일이 덜 일어나게 한다는 것입니다. 이 답은 형량을
            효과에 묶습니다. 같은 죄라도 막기 어려우면 더 벌하는 것이 정당해지고,
            벌해도 줄지 않으면 벌할 이유가 약해집니다.
          </p>

          <p className="leading-7">
            셋째는 그 사람이 당분간 하지 못하게 떼어 놓는다는 것이고, 넷째는 그
            사람을 바꾸어 다시 하지 않게 한다는 것입니다. 셋째는 기간에, 넷째는
            처우의 내용에 묶습니다.
          </p>

          <p className="leading-7">
            넷은 자주 같은 결론을 내지만 갈릴 때가 있습니다. 갈리는 지점에서 어느
            답을 쓰고 있는지가 드러납니다.
          </p>
        </div>

        <TermBreakdown
          title="네 이유가 형량에 대해 각각 무엇을 말하는가"
          items={[
            {
              term: "값하는 만큼",
              description:
                "형량을 지은 죄의 무게에 묶습니다. 앞으로의 효과는 계산에 들어오지 않습니다.",
              example:
                "같은 죄라면 막기 쉬운지 어려운지와 무관하게 같은 형량이어야 합니다.",
              boundary:
                "죄의 무게를 재는 자가 따로 필요합니다. 무엇이 더 무거운지가 사회마다 다르면 이 답만으로는 형량이 정해지지 않습니다.",
            },
            {
              term: "덜 일어나게",
              description:
                "형량을 효과에 묶습니다. 막기 어려운 죄일수록 더 벌하는 것이 정당해집니다.",
              example:
                "검거가 어려운 범죄에 더 무거운 형을 두는 설계가 이 답에서 나옵니다.",
              boundary:
                "이 답만 따르면 한 사람을 본보기로 지나치게 벌하는 것도 정당화될 수 있어, 다른 답이 상한을 잡아 줘야 합니다.",
            },
            {
              term: "떼어 놓기",
              description:
                "그 사람이 당분간 하지 못하게 하는 것이며 형량을 기간에 묶습니다.",
              example:
                "반복해서 같은 일을 하는 경우에 기간을 늘리는 설계가 여기서 나옵니다.",
              boundary:
                "앞으로 할 것이라는 예측에 기대므로, 예측이 빗나가면 하지 않았을 일로 가두는 셈이 됩니다.",
            },
            {
              term: "바꾸기",
              description:
                "그 사람이 다시 하지 않게 만드는 것이며 형량보다 처우의 내용에 묶습니다.",
              example:
                "같은 기간이라도 무엇을 하며 보내는지가 이 답에서는 핵심이 됩니다.",
              boundary:
                "효과가 사람마다 다르고 재기 어려워, 이 답을 앞세우면 같은 죄에 다른 처분이 내려지는 문제가 따라옵니다.",
            },
          ]}
        />
      </section>

      <section id="deterrence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 넷 가운데 하나는 계산할 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            네 이유 가운데 둘째만 숫자로 다룰 수 있습니다. 앞으로 덜 일어나게
            한다는 것은 사람들이 그 일을 할지 말지를 어떻게 정하는지에 대한 가정을
            깔고 있고, 그 가정을 적으면 계산이 나오기 때문입니다.
          </p>

          <p className="leading-7">
            가정은 단순합니다. 그 일로 얻는 것과 그 일 때문에 잃을 것을 견준다는
            것입니다. 잃을 것은 잡혔을 때의 형량이지만, 잡히지 않을 수도 있으므로
            잡힐 확률을 곱해야 합니다.
          </p>

          <p className="leading-7">
            그러면 막는 힘은 확률과 형량의 곱이 됩니다. 그리고 여기서 정책적으로
            중요한 결론이 바로 나옵니다. 같은 곱을 만드는 조합이 무수히 많다는
            것입니다.
          </p>
        </div>

        <ExplainedFormula
          question="어느 정도로 벌하면 그 일이 덜 일어나는가?"
          idea="그 일로 얻는 것과 잃을 것을 견준다고 둡니다. 잃을 것은 잡혔을 때의 형량인데 잡히지 않을 수도 있으므로 잡힐 확률을 곱해야 합니다. 그 곱이 얻는 것보다 크면 하지 않는 쪽이 낫습니다. 그래서 막는 힘은 확률과 형량의 곱이고, 같은 곱을 만드는 조합은 무수히 많습니다."
          formula={String.raw`p \cdot S > G \;\Rightarrow\; \text{하지 않는 쪽이 낫다}, \qquad p \cdot S = \text{const} \;\text{인 조합은 무수히 많다}`}
          annotatedFormula={String.raw`\underbrace{p \cdot S}_{\text{기대 제재}} > \underbrace{G}_{\text{얻는 것}} \;\Rightarrow\; \text{하지 않는다}, \qquad \underbrace{p \cdot S = \text{const}}_{\text{같은 곱을 만드는 조합들}}`}
          operations={[
            {
              expression: String.raw`p \cdot S`,
              annotation: [
                "잡힐 확률에 잡혔을 때의 형량을 곱한 값이며, 그 일을 할 때 치를 것으로 예상되는 값입니다.",
                "확률이 아주 낮으면 형량이 아무리 커도 이 값이 작을 수 있습니다. 검거율이 낮은 영역에서 형량만 올리는 정책이 잘 듣지 않는 이유입니다.",
              ],
            },
            {
              expression: String.raw`p \cdot S > G`,
              annotation: [
                "치를 것으로 예상되는 값이 얻는 것보다 크면 하지 않는 쪽이 낫습니다.",
                "이 판정은 그 사람이 실제로 이 계산을 한다고 둘 때만 성립합니다. 충동이나 잘못된 확률 인식은 들어 있지 않습니다.",
              ],
            },
            {
              expression: String.raw`p \cdot S = \text{const}`,
              annotation: [
                "같은 곱을 만드는 확률과 형량의 조합이 무수히 많습니다. 계산만 보면 전부 같은 억제력입니다.",
                "그런데 드는 비용이 다릅니다. 확률을 올리려면 사람과 장비가 들고, 형량을 올리려면 가두는 비용과 잘못 벌했을 때의 대가가 커집니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`p`,
              name: "잡혀서 벌을 받을 확률",
              description:
                "적발되고 기소되고 유죄가 인정될 확률을 모두 곱한 값입니다. 어느 한 단계만 낮아도 전체가 낮아집니다.",
            },
            {
              symbol: String.raw`S`,
              name: "잡혔을 때의 형량",
              description:
                "그 사람이 실제로 치르는 값이며, 갇히는 기간뿐 아니라 그 뒤의 불이익까지 넣어야 실제 크기가 됩니다.",
            },
            {
              symbol: String.raw`G`,
              name: "그 일로 얻는 것",
              description:
                "금전적 이득뿐 아니라 그 일을 하는 이유 전부를 넣습니다.",
            },
          ]}
          assumptions={[
            "그 사람이 확률과 형량을 알고 계산한다고 둡니다. 실제로는 확률을 크게 잘못 알고 있는 경우가 흔합니다.",
            "위험을 대하는 태도를 중립으로 둡니다. 이 전제가 깨지면 같은 곱이라도 확률 쪽과 형량 쪽의 효과가 달라집니다.",
            "잡힐 확률과 형량이 서로 독립이라고 둡니다. 실제로는 형량이 무거워지면 판단하는 쪽이 유죄 인정에 더 신중해져 확률이 함께 내려가기도 합니다.",
          ]}
          interpretation="그 일로 얻는 것이 8이라고 하겠습니다. 잡힐 확률이 30퍼센트이고 형량이 30이면 기대 제재가 9라 8을 넘으므로 하지 않는 쪽이 낫습니다. 확률이 5퍼센트로 떨어지면 같은 형량 30으로는 1.5밖에 되지 않아 막히지 않고, 형량을 200으로 올리면 10이 되어 다시 막힙니다. 여기서 읽어야 할 것은 검거율이 낮은 영역에서 형량만 올리는 방식이 계산상으로는 성립한다는 점입니다. 읽으면 안 되는 것은 그래서 두 방법이 같다는 결론입니다. 확률 50퍼센트에 형량 20, 확률 1퍼센트에 형량 1,000은 곱이 같지만 드는 비용도 다르고 실제 효과도 다릅니다. 앞쪽은 잡는 데 자원이 들고 뒤쪽은 가두는 비용과 잘못 벌했을 때의 대가가 커지며, 위험을 대하는 태도에 따라 같은 곱이라도 억제력이 달라집니다."
        />

        <DeterrenceViz />

        <CitationBlock
          source="Gary S. Becker · Crime and Punishment: An Economic Approach (Journal of Political Economy 76권 2호, 1968 · NBER 단행본 1974, 1~54쪽)"
          citeKey={1}
          href="https://www.nber.org/system/files/chapters/c3625/c3625.pdf"
        >
          범죄를 도덕이 아니라 선택으로 놓고 제재의 설계를 다룬 글입니다. 유죄
          확률 p와 형량 f 가운데 &ldquo;어느 쪽이 올라가도 그 일에서 기대되는
          효용이 줄어들어 건수를 줄이는 쪽으로 작용한다&rdquo;고 적고, 곧이어 둘이
          바꿔 쓸 수 있는 값이 아님을 보입니다. p를 올리고 f를 같은 비율로 내려
          기대 소득을 그대로 두어도 기대 효용은 달라지는데, &ldquo;위험을 선호하면
          p를 올리는 쪽이 건수를 더 줄이고, 위험을 회피하면 f를 올리는 쪽이 더
          크며, 위험 중립이면 둘이 같다&rdquo;는 것입니다. 그래서 &ldquo;범죄자는
          형량보다 검거 확률에 더 반응한다는 널리 퍼진 일반화는, 기대효용의 틀에서
          보면 범죄자가 위험 선호적이라는 뜻&rdquo;이 됩니다. 위 식의 곱 형태와
          조합의 다양성은 이 논문의 틀에서 나오지만, 본문이 든 수치는 설명을 위해
          이 글에서 만든 예입니다. NBER 공개 사본에서 전문을 확인했습니다.
        </CitationBlock>
      </section>

      <section id="why-severity-fails" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 그래서 형량만 올리는 방식은 잘 듣지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절의 계산만 보면 형량을 올려 낮은 검거율을 메우는 것이 값싼
            해법처럼 보입니다. 사람을 더 뽑는 데는 돈이 들지만 법정형을 고치는
            데는 종이만 들기 때문입니다.
          </p>

          <p className="leading-7">
            그런데 잘 듣지 않습니다. 이유가 넷이고, 넷 다 앞 절 계산의 전제가
            깨지는 지점입니다.
          </p>

          <p className="leading-7">
            첫째는 확률을 잘못 안다는 것입니다. 형량은 법전에 적혀 있지만 검거율은
            적혀 있지 않고, 사람들은 자기가 잡히지 않을 것이라고 생각하는 쪽으로
            기웁니다. 그러면 곱의 한쪽이 실제보다 작게 계산됩니다.
          </p>

          <p className="leading-7">
            둘째는 위험을 대하는 태도입니다. 같은 곱이라도 위험을 선호하는 쪽은
            확률이 올라가는 것에 더 민감하고 형량이 올라가는 것에 덜 민감합니다.
            그러면 형량으로 메우는 방식이 계산보다 덜 듣습니다.
          </p>

          <p className="leading-7">
            셋째는 잘못 벌했을 때의 대가입니다. 형량이 커질수록 한 번의 오판이
            내는 손해가 커지고, 판단하는 쪽도 그것을 알기 때문에 유죄 인정에 더
            신중해집니다. 그러면 형량을 올린 만큼 확률이 내려가 곱이 그대로이거나
            오히려 줄어듭니다.
          </p>
        </div>

        <div id="marginal-deterrence" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            모든 죄에 최고형을 매기면 안 되는 이유
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              넷째 이유는 따로 볼 만합니다. 억제만 생각하면 모든 죄에 가장 무거운
              형을 매기는 것이 가장 강한 억제처럼 보입니다. 그런데 그렇게 하면
              무너지는 것이 있습니다.
            </p>

            <p className="leading-7">
              물건을 훔치는 것과 훔치다가 목격자를 해치는 것에 같은 형이 매겨져
              있다고 해 봅시다. 이미 훔치기로 한 사람에게는 목격자를 남기지 않을
              이유만 생기고 그러지 않을 이유는 없습니다. 더 무거운 일을 막을 힘이
              사라진 것입니다.
            </p>

            <p className="leading-7">
              그래서 형량에는 층이 있어야 합니다. 더 무거운 일에 더 무거운 형이
              매겨져 있어야, 이미 가벼운 쪽을 저지르기로 한 사람에게도 거기서
              멈출 이유가 남습니다. 억제는 하느냐 마느냐만이 아니라 어디까지
              하느냐에도 걸립니다.
            </p>

            <p className="leading-7">
              이 점은 첫째 이유와도 만납니다. 값하는 만큼 갚는다는 답은 형량을 죄의
              무게에 묶는데, 그 묶음이 여기서는 억제를 위해서도 필요해집니다. 서로
              다른 두 답이 같은 결론에 이르는 드문 지점입니다.
            </p>
          </div>
        </div>

        <AlgorithmBlock
          title="어떤 행위를 벌할지와 얼마나 벌할지 정하는 절차"
          input={[
            "그 행위가 만드는 손해와 행위자가 얻는 것",
            "사인끼리 값을 주고받아 정리될 수 있는지",
            "적발과 기소와 유죄 인정 각 단계의 확률",
            "같은 계열에서 더 무거운 행위와 더 가벼운 행위의 목록",
          ]}
          steps={[
            {
              code: "사인끼리 정리되는지 먼저 본다. 정리되면 벌할 이유가 약하다.",
              note: "누가 했는지 알 수 있고 물릴 재산이 있고 값으로 정리되는 종류라면 앞 세 글의 장치로 충분합니다. 벌하는 것은 비용만 들고 아무것도 만들어 내지 않습니다.",
            },
            {
              code: "값을 치르면 해도 되는 것으로 두어도 되는지 본다. 안 된다면 그 자체가 벌할 이유다.",
              note: "동의를 요구하던 보호가 값으로 뚫리면 그 보호가 무의미해집니다. 이 이유는 손해의 크기와 무관하게 성립합니다.",
            },
            {
              code: "적발·기소·유죄 인정 각 단계의 확률을 곱해 실제 p를 구한다.",
              note: "어느 한 단계만 낮아도 전체가 낮아집니다. 법정형을 올리기 전에 이 값이 얼마인지부터 봐야 합니다.",
            },
            {
              code: "p를 올릴 수 있는지 먼저 따진다. 올릴 여지가 있으면 형량보다 그쪽이 낫다.",
              note: "형량으로 메우는 방식은 확률 인식의 왜곡, 위험 태도, 오판의 대가 때문에 계산보다 덜 듣습니다.",
            },
            {
              code: "형량을 정할 때 같은 계열의 더 무거운 행위와 더 가벼운 행위를 함께 놓고 층을 확인한다.",
              note: "층이 없으면 이미 가벼운 쪽을 저지르기로 한 사람에게 더 무거운 쪽으로 가지 않을 이유가 사라집니다.",
            },
            {
              code: "행위와 형을 미리 공포된 문언으로 적을 수 있는지 확인한다.",
              note: "적을 수 없으면 억제 계산 자체가 성립하지 않습니다. 사람들이 무엇을 하면 무엇을 치르는지 미리 알 수 없기 때문입니다.",
            },
          ]}
          output="그 행위를 벌할지에 대한 판정과, 벌한다면 확률과 형량 가운데 어느 쪽을 움직일지 및 같은 계열 안에서의 층에 대한 설계"
        />
      </section>

      <section id="legality" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 이 계산은 미리 적혀 있을 때만 성립합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절의 계산에는 조용한 전제가 있습니다. 사람들이 무엇을 하면 무엇을
            치르는지 미리 안다는 것입니다. 모르면 곱을 계산할 수 없고, 계산할 수
            없으면 억제도 없습니다.
          </p>

          <p className="leading-7">
            그래서 첫 글에서 본 형식 조건이 여기서 가장 엄격한 형태로 나타납니다.
            무엇이 범죄인지와 얼마를 치르는지가 행위 이전에 문언으로 적혀 있어야
            하고, 그 문언을 넓혀 처벌 범위를 늘리는 것도 막힙니다.
          </p>

          <p className="leading-7">
            이것을 억제만으로 정당화하면 절반입니다. 미리 알려져 있어야 한다는
            요구는 계산이 가능해야 한다는 데서도 나오지만, 조심할 방법이 있어야
            한다는 데서도 나옵니다. 두 번째 이유는 억제가 전혀 작동하지 않는
            경우에도 남습니다.
          </p>

          <p className="leading-7">
            그래서 이 요구는 형벌의 목적이 무엇이든 유지됩니다. 값하는 만큼
            갚는다는 답을 택해도, 행위 시점에 무엇이 금지되어 있었는지는 여전히
            먼저 정해져 있어야 합니다.
          </p>
        </div>

        <ProgressiveDetail
          title="형량이 무거워지면 왜 유죄 인정이 어려워지는가?"
          preview="판단하는 쪽도 잘못 벌했을 때의 대가를 계산에 넣습니다."
        >
          <p className="leading-7">
            앞 절에서 형량을 올리면 확률이 함께 내려갈 수 있다고 적었습니다. 이
            연결은 우연이 아닙니다. 유죄로 인정할지 정하는 쪽도 잘못 판단했을 때의
            결과를 생각하기 때문입니다.
          </p>
          <p className="leading-7">
            형량이 가벼우면 애매한 사건에서 유죄로 기울어도 잘못했을 때의 손해가
            작습니다. 형량이 아주 무거우면 같은 애매함에서 무죄로 기웁니다. 그래서
            법정형을 올린 만큼 실제 유죄율이 내려가고, 곱이 생각만큼 커지지
            않습니다.
          </p>
          <p className="leading-7">
            이 연결이 다음 글의 주제와 이어집니다. 얼마나 확실해야 유죄로 할
            것인가는 두 종류의 잘못을 어떻게 저울질하느냐의 문제이고, 그 저울이
            형량의 크기에 따라 기웁니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          벌하기로 정해도 벌하기 전에 해야 할 일이 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글은 왜 벌하는지와 얼마나 벌할지를 다뤘습니다. 네 이유를 갈라
            놓았고, 그 가운데 계산할 수 있는 하나를 폈고, 그 계산이 형량만 올리는
            방식에 대해 무엇을 말하는지 봤습니다.
          </p>

          <p className="leading-7">
            그런데 앞 절의 확률에는 아직 설명하지 않은 것이 들어 있습니다.
            적발되는 것과 유죄로 인정되는 것은 다릅니다. 그 사이에 얼마나 확실해야
            벌할 수 있는지를 정하는 문턱이 있습니다.
          </p>

          <p className="leading-7">
            그 문턱을 어디에 두느냐는 취향이 아닙니다. 무고한 사람을 벌하는 잘못과
            한 사람을 놓아주는 잘못의 무게가 다르다면, 그 차이가 문턱의 위치를
            정합니다. 계산이 가능한 지점입니다.
          </p>

          <p className="leading-7">
            다음 글{" "}
            <Link to="/law/criminal-law/procedure-and-proof">절차와 증명</Link>이
            그 자리를 맡습니다. 왜 열 명을 놓치더라도 한 명을 잘못 벌하지 말라고
            하는지가 주제입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
