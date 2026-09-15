import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import PropertyReachViz from "./property-and-entitlement/viz/PropertyReachViz";
import PropertyOrLiabilityViz from "./property-and-entitlement/viz/PropertyOrLiabilityViz";

/**
 * 소유는 무엇을 주고 무엇을 요구합니까
 *
 * 4편이 두 사람 사이의 힘까지 다뤘으니, 누구에게나 미치는 힘을 받는다.
 * 공시·권능의 묶음·두 가지 보호 방식·동의 없는 이전까지가 범위이고,
 * 사고의 비용 배분은 다음 글이 소유한다.
 */
export default function PropertyAndEntitlementArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          어떤 권리는 약속하지 않은 사람에게도 미칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서 본 힘은 약속한 두 사람 사이에만 미쳤습니다. 물건을 넘기기로 한 사람이 어기면 그 사람에게 물릴 수 있지만 그 물건을 가로챈 다른 사람에게는 이 약속을 들이댈 수
            없습니다.
          </p>

          <p className="leading-7">
            그런데 내 물건이라는 주장은 다릅니다. 가져간 사람이 누구든 통하고 그 사람과 내가 아무 약속도 하지 않았어도 통합니다. 두 사람이 정한 것이 어떻게 그 둘의 범위를
            넘어갑니까.
          </p>

          <p className="leading-7">
            이 물음에 답하고 나면 그다음 물음이 자연스럽게 따라옵니다. 그렇게
            강한 힘이라면 왜 어떤 경우에는 동의 없이도 옮겨 갈 수 있는가입니다.
          </p>
        </div>

        <PropertyReachViz />

        <ContentBoundary article="property-and-entitlement" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              누구에게나 미치는 권리는 무엇을 대가로 그 힘을 얻고, 그런데도 동의
              없이 옮겨 가는 경우는 왜 있는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 그 힘의 대가, 소유가 실제로는 여러 권능의 묶음이라는 것, 그
            권능을 지키는 두 가지 방식, 그리고 그 두 방식 가운데 무엇을 쓸지를
            무엇이 정하는지입니다.
          </p>

          <p className="leading-7">
            소유가 정해져 있어도 사고는 일어납니다. 누구의 것인지가 아니라 누가
            그 손해를 지는지는 다음 글{" "}
            <Link to="/law/private-law/tort-and-accident-cost">불법행위</Link>가
            맡습니다.
          </p>
        </div>
      </section>

      <section id="publicity" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 모두에게 지키라고 하려면 모두가 알 수 있어야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            누구에게나 미치는 권리에는 이상한 점이 있습니다. 나와 아무 관계도
            없는 사람에게 의무를 지운다는 것입니다. 그 사람은 동의한 적도 없고
            내가 누구인지도 모릅니다.
          </p>

          <p className="leading-7">
            그래서 조건이 붙습니다. 그 사람이 알 수 있어야 한다는 것입니다.
            모르고 침범한 사람에게까지 지키라고 하려면, 적어도 조금만 살펴보면
            알 수 있는 상태로 두어야 합니다.
          </p>

          <p className="leading-7">
            그 상태를 만드는 것이 밖으로 드러내는 장치입니다. 움직이는 물건은
            누가 쥐고 있는지로, 땅과 건물은 장부에 적어 두는 것으로 드러냅니다.
            앞 글들의 형식 조건이 여기서 특정한 형태로 나타납니다.
          </p>

          <p className="leading-7">
            대가가 하나 더 있습니다. 만들 수 있는 권리의 종류가 미리 정해진 목록으로 제한된다는 것입니다. 당사자가 마음대로 새 종류를 만들면 제삼자가 일일이 확인할 수 없어 알 수
            있게 한다는 조건이 무너집니다.
          </p>
        </div>

        <TermBreakdown
          title="누구에게나 미치는 힘이 치르는 값"
          items={[
            {
              term: "밖으로 드러날 것",
              description:
                "누가 쥐고 있는지 또는 장부에 누구로 적혀 있는지로 밖에서 확인할 수 있어야 합니다.",
              example:
                "땅을 샀다면 장부에 옮겨 적어야 그 뒤에 나타난 사람에게도 내 것이라고 할 수 있습니다.",
              boundary:
                "드러나는 방식이 완전하지는 않습니다. 장부와 실제가 어긋나는 경우를 어떻게 다룰지가 별도의 규칙 덩어리를 이룹니다.",
            },
            {
              term: "종류가 제한될 것",
              description:
                "만들 수 있는 권리의 종류가 미리 정해진 목록 안으로 제한됩니다.",
              example:
                "계약은 내용을 자유롭게 짤 수 있지만, 누구에게나 주장할 권리는 목록에 있는 형태로만 만들 수 있습니다.",
              boundary:
                "목록이 좁으면 새로운 거래 방식이 막힙니다. 그래서 목록을 넓히는 입법이 주기적으로 필요해집니다.",
            },
            {
              term: "조사 부담을 지울 것",
              description:
                "거래하는 쪽이 미리 확인해야 하고, 확인하지 않은 위험은 그쪽이 집니다.",
              example:
                "장부를 보지 않고 산 사람은 앞서 적힌 권리를 몰랐다고 해서 벗어나기 어렵습니다.",
              boundary:
                "확인 비용이 너무 커지면 거래 자체가 줄어듭니다. 드러내는 장치를 싸고 정확하게 만드는 것이 그래서 제도의 과제가 됩니다.",
            },
          ]}
        />
      </section>

      <section id="bundle" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 소유는 하나가 아니라 여러 권능의 묶음입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            소유를 하나의 덩어리로 보면 설명되지 않는 것이 많습니다. 세를 준
            집은 누구의 것인지, 담보로 잡힌 땅은 누구의 것인지가 그렇습니다.
          </p>

          <p className="leading-7">
            묶음으로 보면 풀립니다. 쓰는 권능, 거기서 나오는 것을 가져가는 권능, 남을 배제하는 권능, 넘기거나 없앨 권능이 각각 있고 이것들을 떼어 다른 사람에게 줄 수 있습니다.
          </p>

          <p className="leading-7">
            세를 주는 것은 쓰는 권능을 기간을 정해 넘기는 것이고 담보로 잡히는 것은 갚지 않을 때 팔아 값을 받을 권능을 넘기는 것입니다. 나머지는 그대로 두고 필요한 조각만 옮깁니다.
          </p>

          <p className="leading-7">
            이렇게 보면 소유권의 강함이 어디서 오는지도 분명해집니다. 떼어 준
            것을 빼고 남은 전부가 자기에게 돌아온다는 점입니다. 기간이 끝나면
            쓰는 권능이 저절로 되돌아옵니다.
          </p>
        </div>
      </section>

      <section id="two-protections" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 지키는 방식이 둘이고, 고르는 기준이 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            권능을 정해 준 다음에도 결정이 하나 남습니다. 그것을 어떻게 지킬
            것인가입니다. 방식이 둘이고 성격이 아주 다릅니다.
          </p>

          <p className="leading-7">
            하나는 가져가려면 주인에게서 사야 한다는 것입니다. 값은 주인이 정하고 싫으면 팔지 않아도 됩니다. 다른 하나는 값을 매겨 옮긴 뒤 그 값을 물어 주게 하는 것입니다. 값을
            정하는 것은 주인이 아니라 바깥의 기관입니다.
          </p>

          <p className="leading-7">
            앞쪽이 강해 보이지만 언제나 나은 것은 아닙니다. 사려면 협상해야 하고 협상해야 할 상대가 많아지면 한 사람만 버텨도 전체가 무산됩니다. 그러면 옮기는 편이 나은 자원이 옮겨
            가지 못합니다.
          </p>

          <p className="leading-7">
            그래서 고르는 기준이 나옵니다. 협상이 될 만하면 앞쪽을, 되지 않으면
            뒤쪽을 쓰되 값을 재는 정확도가 충분해야 한다는 것입니다.
          </p>
        </div>

        <ExplainedFormula
          question="가져가려면 사게 할 것인가, 값을 매겨 옮기게 할 것인가?"
          idea="자원을 옮기면 값이 느는 경우를 생각합니다. 사게 하는 방식에서는 협상이 성사되어야 그 이득이 실현되므로, 협상 비용이 이득보다 작아야 합니다. 협상 비용이 더 크면 이득이 있는데도 옮겨 가지 못합니다. 그때는 값을 매겨 옮기는 길이 대안이 되는데, 이쪽은 값을 잘못 매길 위험을 안고 갑니다. 그 위험이 이득보다 작을 때만 대안이 됩니다."
          formula={String.raw`T < G \;\Rightarrow\; \text{사게 한다}, \qquad T > G \;\wedge\; E < G \;\Rightarrow\; \text{값을 매겨 옮긴다}`}
          annotatedFormula={String.raw`\underbrace{T < G}_{\text{협상이 될 만함}} \;\Rightarrow\; \text{사게 한다}, \qquad \underbrace{T > G \;\wedge\; E < G}_{\text{협상은 막히고 값은 잴 만함}} \;\Rightarrow\; \text{값을 매겨 옮긴다}`}
          operations={[
            {
              expression: String.raw`T < G`,
              annotation: [
                "협상에 드는 비용이 옮겨서 느는 값보다 작으면 당사자들이 만나 사고팔 수 있습니다.",
                "이때는 값을 주인이 정하므로 바깥에서 값을 잴 필요가 없고, 잘못 잴 위험도 생기지 않습니다.",
              ],
            },
            {
              expression: String.raw`T > G`,
              annotation: [
                "상대가 많아지면 한 사람만 버텨도 전체가 무산되므로 협상 비용이 급격히 커집니다.",
                "이 구간에서는 이득이 분명히 있는데도 사게 하는 방식으로는 옮겨 가지 못합니다.",
              ],
            },
            {
              expression: String.raw`E < G`,
              annotation: [
                "값을 매겨 옮기는 쪽이 대안이 되려면 잘못 잴 손해가 이득보다 작아야 합니다.",
                "재기 어려운 자원, 곧 그 사람에게만 특별한 의미가 있는 것일수록 이 조건이 깨집니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`G`,
              name: "옮겨서 느는 값",
              description:
                "그 자원이 다른 쪽으로 가면 더 값이 나는 정도이며, 옮길 이유의 크기입니다.",
            },
            {
              symbol: String.raw`T`,
              name: "협상에 드는 비용",
              description:
                "상대를 찾고 값을 정하고 버티는 사람을 설득하는 데 드는 비용을 모두 넣습니다.",
            },
            {
              symbol: String.raw`E`,
              name: "값을 잘못 잴 손해",
              description:
                "바깥에서 정한 값이 실제 가치와 어긋나 생기는 손해의 기대치입니다.",
            },
          ]}
          assumptions={[
            "세 값을 같은 단위로 어림잡을 수 있다고 둡니다. 실제로는 셋 다 사건 밖에서 관측되지 않습니다.",
            "옮기는 것이 실제로 값을 늘린다고 둡니다. 누가 더 높게 평가하는지부터 다투어지면 이 비교의 앞이 막힙니다.",
            "값을 매겨 옮기는 길이 남용되지 않는다고 둡니다. 실제로는 그 길이 열려 있다는 사실 자체가 협상 태도를 바꿉니다.",
          ]}
          interpretation="이웃 한 명에게서 땅 한 필지를 사는 경우 옮겨서 느는 값이 60이고 협상 비용이 10이면 협상이 성사되므로, 동의 없이는 못 가져가게 두는 편이 낫습니다. 같은 도로를 놓기 위해 200필지를 모아야 하면 이득이 4,000인데 협상 비용이 5,000까지 뜁니다. 한 사람만 버텨도 전체가 무산되기 때문입니다. 이때 값을 매겨 옮기고 물어 주는 길이 열리고, 평가 오차가 800이라면 4,000보다 작으므로 막힌 채로 두는 것보다 낫습니다. 여기서 읽어야 할 것은 동의 없이 옮기는 제도가 예외가 아니라 협상이 구조적으로 막히는 구간을 위한 장치라는 점입니다. 읽으면 안 되는 것은 이득만 크면 언제나 옮겨도 된다는 결론입니다. 같은 4,000짜리 이득이라도 값을 재기 어려워 오차가 4,600까지 커지면 옮기는 쪽이 오히려 손해이고, 그때는 동의를 받게 하는 편으로 되돌아갑니다."
        />

        <PropertyOrLiabilityViz />

        <CitationBlock
          source="Guido Calabresi · A. Douglas Melamed · Property Rules, Liability Rules, and Inalienability: One View of the Cathedral (Harvard Law Review 85권 6호, 1972, 1089~1128쪽)"
          citeKey={1}
          href="https://www.jstor.org/stable/1340059"
        >
          권리를 누구에게 줄 것인가와 그 권리를 어떻게 지킬 것인가를 갈라 놓고
          후자를 따로 다룬 글입니다. 앞쪽 방식을 &ldquo;권리를 보유자에게서
          떼어 가고자 하는 사람이 보유자로부터 사야 하며, 그 값은 파는 쪽이
          동의한 자발적 거래에서 정해지는&rdquo; 보호로 규정하고,
          &ldquo;각자가 자기에게 그것이 얼마짜리인지 말하게 하고, 사는 쪽이
          충분히 제시하지 않으면 파는 쪽에 거부권을 준다&rdquo;고 설명합니다.
          뒤쪽 방식은 &ldquo;객관적으로 정해진 값을 치를 의사가 있으면 최초의
          권리를 없앨 수 있는&rdquo; 보호이며, &ldquo;권리의 이전이나 소멸이
          당사자가 아니라 국가의 어떤 기관이 정한 값에 근거해 허용된다&rdquo;는
          점에서 국가의 개입이 한 단계 더 들어갑니다. 같은 집이 사겠다는
          이웃에게는 앞쪽으로, 수용하는 정부에게는 뒤쪽으로 보호되는 식으로 섞일
          수 있다는 점도 함께 적습니다. 위 식은 이 논문의 모형이 아니라 두
          방식의 차이를 가장 짧게 비교하려고 이 글에서 직접 전개한 것입니다.
          대학 강의 자료로 공개된 사본에서 전문을 확인했습니다.
        </CitationBlock>
      </section>

      <section id="forced-transfer" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 동의 없이 옮기는 제도들이 같은 자리에 놓입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절의 기준을 들고 보면 서로 무관해 보이던 제도들이 한 줄에
            놓입니다. 전부 협상이 구조적으로 막히는 구간을 다루는 장치입니다.
          </p>

          <p className="leading-7">
            도로나 철도를 놓으려고 땅을 모으는 경우가 대표적입니다. 필요한 필지가 많아질수록 한 사람이 버티는 것만으로 전체가 멈추고 그 사람은 자기 땅의 가치가 아니라 사업 전체의
            가치를 요구할 수 있게 됩니다.
          </p>

          <p className="leading-7">
            급박한 위험을 피하려고 남의 물건을 쓰는 경우도 같은 자리입니다. 배가
            부서질 상황에서 남의 부두에 묶어 두는 데 미리 동의를 받을 시간이
            없습니다. 협상 비용이 무한대에 가까운 구간입니다.
          </p>

          <p className="leading-7">
            다만 두 경우 모두 값을 물어 주는 것이 따라붙습니다. 동의를 면제해 준
            것이지 값을 면제해 준 것이 아니기 때문입니다. 이 구분이 흐려지면
            협상이 막혔다는 이유만으로 그냥 가져가는 일이 생깁니다.
          </p>
        </div>

        <AlgorithmBlock
          title="동의 없는 이전이 정당한지 판정하는 절차"
          input={[
            "옮겼을 때 느는 값과 지금 보유자의 가치",
            "동의를 받아야 할 사람의 수와 그들의 대체 가능성",
            "값을 바깥에서 잴 수 있는 정도",
          ]}
          steps={[
            {
              code: "옮기면 값이 느는지부터 본다. 늘지 않으면 나머지 단계는 의미가 없다.",
              note: "누가 더 높게 평가하는지가 다투어지는 단계입니다. 여기서 이미 답이 갈리면 아래 비교는 시작되지 않습니다.",
            },
            {
              code: "동의를 받아야 할 사람이 몇 명인지 세고, 한 사람이 버틸 때 전체가 멈추는 구조인지 본다.",
              note: "멈추는 구조라면 그 사람은 자기 몫이 아니라 사업 전체의 값을 요구할 수 있게 됩니다. 협상 비용이 뛰는 것은 인원수 자체보다 이 구조 때문입니다.",
            },
            {
              code: "시간이 있는지 본다. 미리 동의를 받을 시간이 없으면 협상 비용을 아주 크게 잡는다.",
              note: "급박한 위험에서 쓰는 경우가 여기 들어갑니다. 인원수가 한 명이어도 시간이 없으면 협상이 성립하지 않습니다.",
            },
            {
              code: "바깥에서 값을 잴 수 있는지 본다. 잴 수 없는 종류의 가치가 큰 비중이면 옮기지 않는다.",
              note: "시장에서 비슷한 것이 거래되는 자원일수록 재기 쉽고, 그 사람에게만 특별한 의미가 있을수록 재기 어렵습니다.",
            },
            {
              code: "옮기기로 했다면 값을 물어 주는 절차를 함께 세운다.",
              note: "동의를 면제한 것이지 값을 면제한 것이 아닙니다. 이 구분이 흐려지면 협상이 막혔다는 이유만으로 그냥 가져가는 일이 생깁니다.",
            },
            {
              code: "그 길이 열려 있다는 사실이 평소의 협상을 어떻게 바꾸는지 본다.",
              note: "언제든 값을 매겨 가져갈 수 있다면 보유자가 협상에서 요구할 수 있는 상한이 그 값으로 눌립니다. 제도의 효과가 실제 발동 건수보다 넓게 미칩니다.",
            },
          ]}
          output="동의 없는 이전이 정당한지에 대한 판정과, 정당하다면 값을 어떻게 재고 물어 줄지에 대한 설계"
        />

        <ProgressiveDetail
          title="값을 물어 주면 언제나 괜찮은가?"
          preview="물어 주는 값이 그 사람이 실제로 잃은 것과 같다는 보장이 없습니다."
        >
          <p className="leading-7">
            바깥에서 매기는 값은 대개 시장에서 비슷한 것이 거래되는 가격을
            기준으로 삼습니다. 그런데 오래 산 집이나 대를 이어 온 땅처럼 그
            사람에게만 있는 가치는 그 기준에 들어오지 않습니다.
          </p>
          <p className="leading-7">
            그래서 물어 주는 값은 구조적으로 실제 손실보다 작게 나오는 경향이 있습니다. 앞 절 식의 오차 항이 한쪽으로 치우쳐 있다는 뜻이고 그 치우침이 클수록 동의 없는 이전의 문턱을
            높게 잡아야 합니다.
          </p>
          <p className="leading-7">
            제도는 그래서 값만이 아니라 절차로도 다룹니다. 미리 알리고, 다툴 기회를 주고, 정말 필요한 범위인지 따로 심사하게 하는 것입니다. 값을 정확히 재기 어려운 만큼 절차가 그
            자리를 메웁니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          누구의 것인지를 정해도 사고는 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글은 누가 무엇에 대해 어떤 권능을 갖고 그것을 어떻게 지킬지를
            다뤘습니다. 경계가 그어지고 그 경계를 넘으려면 사거나 값을 치러야
            한다는 것까지였습니다.
          </p>

          <p className="leading-7">
            그런데 경계를 넘을 뜻이 전혀 없었는데 넘어가는 일이 있습니다. 사고입니다. 아무도 남의 것을 가져가려 하지 않았는데 손해가 생기고 그 손해를 누군가는 져야 합니다.
          </p>

          <p className="leading-7">
            이때는 앞 절의 계산이 그대로 쓰이지 않습니다. 사고는 미리 협상할
            상대를 특정할 수 없기 때문입니다. 길에서 마주칠 사람과 미리 값을
            정해 둘 수는 없습니다.
          </p>

          <p className="leading-7">
            다음 글{" "}
            <Link to="/law/private-law/tort-and-accident-cost">불법행위</Link>가
            그 자리를 맡습니다. 사고의 비용을 누구에게 지우고, 그 선택이 사람들이
            얼마나 조심할지를 어떻게 바꾸는지가 주제입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
