import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import AnarchyStructureViz from "./international-anarchy/viz/AnarchyStructureViz";
import ShadowOfFutureViz from "./international-anarchy/viz/ShadowOfFutureViz";

/**
 * 위가 없는 곳에서는 같은 문제가 다르게 풀립니다
 *
 * 1~8편이 쌓은 구조에서 최종 판정과 집행의 자리를 지웠을 때 무엇이 남는지를
 * 다룬다. 안보 딜레마에서 출발해 반복이 만드는 문턱과 강제하지 않는 기구까지
 * 가고, 시리즈 전체를 1편의 질문으로 닫는다.
 */
export default function InternationalAnarchyArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          여덟 글이 쌓은 구조에서 맨 위 칸을 지워 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            첫 글에서 시작한 질문은 이것이었습니다. 모두가 원하지만 각자에게는
            낼 이유가 없는 것을 어떻게 만드는가입니다. 답은 강제였습니다. 내지
            않는 사람에게서도 걷을 수 있으면 계산 자체가 바뀝니다.
          </p>

          <p className="leading-7">
            그 뒤 일곱 글은 전부 그 강제력을 다뤘습니다. 어디에 모이는지, 무엇으로
            묶는지, 누가 쥐는지, 어떻게 뽑는지, 어떻게 집행하는지였습니다. 이
            구조의 맨 위에는 언제나 더 올라갈 데가 없는 자리가 있었습니다.
          </p>

          <p className="leading-7">
            국가들 사이에는 그 자리가 없습니다. 그러면 첫 글의 문제가 그대로
            돌아오는데, 이번에는 강제라는 해법 없이 돌아옵니다.
          </p>
        </div>

        <AnarchyStructureViz />

        <ContentBoundary article="international-anarchy" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              최종 판정과 집행의 자리가 비어 있으면 무엇이 사라지고, 그런데도
              약속이 서는 경우는 어떤 조건에서인가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 위가 없다는 것의 정확한 뜻, 스스로를 지키는 일이 만드는 역설,
            반복이 강제를 대신할 수 있는 조건, 강제력 없는 기구가 실제로 하는 일,
            그리고 그 모든 것으로도 남는 한계입니다.
          </p>

          <p className="leading-7">
            이 글이 정치 시리즈의 마지막입니다. 마지막 절에서 여덟 글이 답한 것과
            답하지 못한 것을 함께 정리합니다.
          </p>
        </div>
      </section>

      <section id="no-sovereign" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 무정부는 혼란이 아니라 위가 없다는 뜻입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            국제 정치를 무정부라고 부를 때 그것은 질서가 없다는 뜻이 아닙니다.
            무역은 대부분 규칙대로 이루어지고 조약은 대개 지켜집니다. 없는 것은
            질서가 아니라 그 위의 자리입니다.
          </p>

          <p className="leading-7">
            2편에서 강제력의 독점을 세 조건으로 봤습니다. 경쟁하는 조직이 없고,
            판정이 최종이며, 그 범위가 영토로 닫힌다는 것이었습니다. 국가들 사이는
            세 조건이 모두 성립하지 않습니다. 여럿이 강제력을 갖고, 어느 판정도
            최종이 아니며, 범위를 정해 주는 바깥이 없습니다.
          </p>

          <p className="leading-7">
            그래서 사라지는 것이 정확히 무엇인지가 중요합니다. 다툼이 생겼을 때
            끝을 내주는 자리와, 약속을 어겼을 때 대신 집행해 주는 자리입니다.
            이 둘이 없으면 남는 것은 각자의 판단과 각자의 힘뿐이고, 이 상태를
            자력구제라고 부릅니다.
          </p>

          <p className="leading-7">
            여기서 오해를 하나 걷어 내야 합니다. 자력구제는 언제나 싸운다는 뜻이
            아닙니다. 최후에 기댈 곳이 자기 자신뿐이라는 뜻이며, 그 사실이 평시의
            선택까지 바꾼다는 것이 다음 절의 내용입니다.
          </p>
        </div>

        <TermBreakdown
          title="위가 없을 때 사라지는 것과 남는 것"
          items={[
            {
              term: "사라지는 것 · 최종 판정",
              description:
                "누가 옳은지에 대한 다툼을 끝내 주는 자리가 없습니다. 국제 재판소가 있어도 그 관할을 받아들일지를 당사국이 정합니다.",
              example:
                "같은 조문을 두고 두 나라가 정반대로 해석해도, 어느 해석이 맞는지 정해 줄 상위 기관이 없습니다.",
              boundary:
                "판정 자체가 없다는 뜻은 아닙니다. 판정은 나오지만 그 판정이 최종이 되는 근거가 당사국의 동의에 머뭅니다.",
            },
            {
              term: "사라지는 것 · 약속의 집행",
              description:
                "어겼을 때 대신 강제해 주는 곳이 없습니다. 어긴 쪽에 손해를 입히려면 상대방이 스스로 해야 합니다.",
              example:
                "국내 계약은 어기면 법원이 집행하지만, 조약은 어겨도 집행할 기관이 없어 상대국의 대응만 남습니다.",
              boundary:
                "그래서 약속이 전부 무의미해지는 것은 아닙니다. 어겼을 때 상대가 대응할 수 있으면 그 자체가 제약이 되며, 그 조건이 3절의 계산입니다.",
            },
            {
              term: "남는 것 · 자력구제",
              description:
                "최후에 기댈 곳이 자기 자신뿐인 상태입니다. 이것이 평시의 선택까지 바꿉니다.",
              example:
                "누구도 지금 공격할 뜻이 없어도, 나중에 그럴 수 있다는 가능성만으로 대비에 자원을 쓰게 됩니다.",
              boundary:
                "언제나 싸운다는 뜻이 아닙니다. 대부분의 시기에 대부분의 관계는 협력적이며, 문제는 그 협력이 무엇에 기대고 있는가입니다.",
            },
          ]}
        />
      </section>

      <section id="security-dilemma" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 스스로를 지키는 일이 서로를 덜 안전하게 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            자력구제 상태에서 안전을 늘리려면 스스로 수단을 갖춰야 합니다. 그런데
            여기에 국내 사회에는 없는 문제가 하나 붙어 있습니다. 자기를 지키는
            수단의 상당수가 남을 위협하는 수단과 같다는 것입니다.
          </p>

          <p className="leading-7">
            국내에서 안전을 늘리는 방법은 대체로 남에게 해가 되지 않습니다. 문에
            자물쇠를 달거나 밝은 길로 다니는 것은 이웃의 안전을 줄이지 않습니다.
            그런데 함대를 늘리는 것은 다릅니다. 방어를 위한 함대라도 상대의 해상
            교통을 끊을 수 있는 함대이기 때문입니다.
          </p>

          <p className="leading-7">
            그러면 서로 나쁜 뜻이 없어도 같은 결과가 나옵니다. 가가 대비를 늘리면
            나에게는 위협이 커진 것으로 보이고, 나도 늘리면 가에게 같은 일이
            일어납니다. 둘 다 자원을 더 쓰고 둘 다 처음보다 덜 안전해집니다.
          </p>

          <p className="leading-7">
            여기서 읽어야 할 것은 이 결과가 의도에서 나오지 않는다는 점입니다.
            상대의 의도를 정확히 알 수 없고, 알더라도 그 의도가 나중에 바뀌지
            않으리라는 보장이 없습니다. 그래서 선의만으로는 이 구조를 벗어나지
            못합니다.
          </p>
        </div>

        <CitationBlock
          source="Robert Jervis · Cooperation Under the Security Dilemma (World Politics 30권 2호, 1978년 1월, 167~214쪽)"
          citeKey={1}
          href="https://www.jstor.org/stable/2009958"
        >
          무정부 상태가 왜 서로 원하는 결과조차 어렵게 만드는지를 다룬 글입니다.
          &ldquo;국제적 주권자의 부재는 전쟁이 일어나게 할 뿐 아니라, 현상에
          만족하는 국가들조차 서로가 공동의 이익이라고 인정하는 목표에 이르기
          어렵게 만든다&rdquo;로 시작해, 국제법을 만들고 집행할 기관이 없으므로
          &ldquo;상대가 협력하면 상호 이익을 가져올 협력 정책이 상대가 협력하지
          않으면 재앙을 가져올 수 있다&rdquo;고 적습니다. 안보 딜레마는
          &ldquo;국가가 자기 안전을 높이려고 쓰는 수단의 상당수가 다른 나라의
          안전을 떨어뜨린다&rdquo;로 규정되며, 영국 해군을 예로 들어
          &ldquo;의도했든 아니든 영국 해군은 중요한 강압 수단이었다&rdquo;고
          말합니다. 아래 3절의 문턱 계산은 이 논문에 있는 것이 아니라 반복 게임의
          표준 분석이며 이 글에서 직접 전개했습니다. 다만 이 논문이 협력 가능성을
          높이는 조건으로 든 세 가지가 그 문턱의 움직임과 정확히 대응합니다.
          대학 서버에 공개된 사본에서 전문을 확인했습니다.
        </CitationBlock>
      </section>

      <section id="shadow" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 강제할 곳이 없어도 약속이 서는 조건이 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            여기까지만 보면 국제 협력은 불가능해야 합니다. 그런데 실제로는 많은
            약속이 지켜집니다. 강제하는 자리가 없는데도 그렇다면 다른 무언가가
            그 자리를 대신하고 있다는 뜻입니다.
          </p>

          <p className="leading-7">
            그 무언가는 미래입니다. 한 번 어기고 끝나는 관계라면 어기는 쪽이 늘
            낫습니다. 그런데 같은 상대를 계속 만나야 한다면, 한 번 얻는 것과 앞으로
            잃을 것을 견줘야 합니다.
          </p>

          <p className="leading-7">
            이 견줌은 정확히 계산됩니다. 그리고 여기서 금융 쪽 글에서 쓰던 도구가
            그대로 들어옵니다. 미래의 값을 오늘의 값으로 바꾸는{" "}
            <Link to="/finance/money/time-value-and-discounting#discounting">
              할인계수
            </Link>
            입니다. 다만 여기서는 이자율뿐 아니라 다음에 또 만날 가능성까지
            그 안에 들어갑니다.
          </p>
        </div>

        <ExplainedFormula
          question="강제할 곳이 없는데 약속이 지켜지려면 무엇이 필요한가?"
          idea="계속 지켰을 때 앞으로 받을 몫의 합과, 한 번 어겨서 크게 얻고 그 뒤로 관계가 나빠졌을 때의 합을 견줍니다. 두 합이 같아지는 지점이 문턱이고, 다음에 또 만날 몫이 그 문턱보다 크면 어기지 않는 쪽이 스스로에게 이익이 됩니다."
          formula={String.raw`\frac{R}{1-\delta} \;\ge\; T + \frac{\delta P}{1-\delta} \quad\Longleftrightarrow\quad \delta \;\ge\; \delta^{*} = \frac{T-R}{T-P}`}
          annotatedFormula={String.raw`\underbrace{\frac{R}{1-\delta}}_{\text{계속 지킬 때}} \;\ge\; \underbrace{T + \frac{\delta P}{1-\delta}}_{\text{한 번 어길 때}} \quad\Longleftrightarrow\quad \delta \;\ge\; \underbrace{\frac{T-R}{T-P}}_{\text{필요한 미래의 몫}}`}
          operations={[
            {
              expression: String.raw`\frac{R}{1-\delta}`,
              annotation: [
                "매 기간 R을 받고 그것을 할인해 더한 값입니다. δ가 1에 가까울수록 이 합이 커집니다.",
                "관계가 길수록 지키는 쪽의 몫이 커진다는 것이 여기서 나옵니다.",
              ],
            },
            {
              expression: String.raw`T + \frac{\delta P}{1-\delta}`,
              annotation: [
                "이번에 T를 챙기고 그다음부터는 서로 어기는 상태가 이어질 때의 값입니다.",
                "T는 한 번뿐이고 P는 계속이므로, 미래가 무거워질수록 이 쪽이 불리해집니다.",
              ],
            },
            {
              expression: String.raw`\frac{T-R}{T-P}`,
              annotation: [
                "두 값이 같아지는 지점을 δ에 대해 푼 것입니다. 분자는 한 번 어겨서 더 얻는 몫, 분모는 어김으로써 잃게 되는 매 기간의 몫입니다.",
                "그래서 어겨서 얻는 것이 클수록 문턱이 올라가고, 함께 지켜서 얻는 것이 크거나 함께 어겼을 때의 손해가 클수록 내려갑니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\delta`,
              name: "다음에 또 만날 몫",
              description:
                "다음 기간의 1이 지금 얼마인지를 나타내며, 할인과 관계가 이어질 확률을 함께 담습니다. 0에 가까우면 사실상 한 번뿐인 만남입니다.",
            },
            {
              symbol: String.raw`T,\,R,\,P`,
              name: "어길 때 · 함께 지킬 때 · 함께 어길 때의 값",
              description:
                "혼자 어겨서 얻는 값이 가장 크고, 함께 지킬 때가 그다음이며, 함께 어길 때가 가장 나쁩니다.",
            },
            {
              symbol: String.raw`\delta^{*}`,
              name: "문턱",
              description:
                "협력이 스스로 서기 시작하는 지점이며, 0과 1 사이의 값입니다. 이 값이 1에 가까워지면 사실상 협력이 불가능합니다.",
            },
          ]}
          assumptions={[
            "어기면 그 뒤로 협력이 돌아오지 않는다는 가장 단순한 대응을 가정합니다. 실제로는 몇 기간 뒤 회복되는 대응이 더 흔하며, 그러면 문턱이 올라갑니다.",
            "어겼다는 사실을 상대가 알아챌 수 있다고 둡니다. 확인할 수 없으면 이 계산 자체가 성립하지 않습니다.",
            "관계가 언제 끝나는지 정해져 있지 않다고 둡니다. 끝나는 시점이 알려져 있으면 마지막 기간부터 거슬러 협력이 무너집니다.",
          ]}
          interpretation="한 번 어겨서 얻는 값을 5, 함께 지켰을 때를 3, 함께 어겼을 때를 1로 두면 문턱은 (5−3)÷(5−1)로 0.5입니다. 다음에 또 만날 몫이 0.3이면 계속 지킬 때의 값이 4.29, 한 번 어길 때가 5.43이라 어기는 쪽이 낫고, 0.8이면 15와 9가 되어 지키는 쪽이 낫습니다. 여기서 읽어야 할 것은 강제하는 자리 없이도 약속이 설 수 있지만 그것이 조건부라는 점입니다. 관계가 짧거나 어겨서 얻는 것이 크면 같은 상대 같은 약속이라도 무너집니다. 읽으면 안 되는 것은 국제 협력이 시간만 지나면 저절로 안정된다는 결론입니다. 이 계산은 위반을 알아챌 수 있고 되갚을 수 있다는 것을 전제하며, 둘 중 하나만 빠져도 문턱 자체가 의미를 잃습니다."
        />

        <ShadowOfFutureViz />
      </section>

      <section id="institutions" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 강제하지 않는 기구가 무엇을 하는지가 여기서 설명됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            국제기구를 세계 정부의 축소판으로 보면 실망하게 됩니다. 군대도 경찰도
            없고 결정을 강제할 수단도 없기 때문입니다. 그런데 앞 절의 계산을
            놓고 보면 다르게 읽힙니다.
          </p>

          <p className="leading-7">
            문턱 계산이 성립하려면 조건이 둘 있었습니다. 어겼다는 사실을 알아챌 수
            있어야 하고, 앞으로도 계속 만나야 합니다. 기구가 하는 일의 대부분이
            정확히 이 둘을 만드는 일입니다.
          </p>

          <p className="leading-7">
            보고와 검증 절차는 위반을 보이게 만듭니다. 정기 회의와 갱신 주기는
            다음에 또 만난다는 사실을 확정합니다. 여러 사안을 한 기구 안에 묶으면
            한 사안에서 어긴 것이 다른 사안에까지 영향을 미쳐, 어겨서 얻는 값은
            그대로인데 잃는 값이 커집니다.
          </p>

          <p className="leading-7">
            그래서 강제력이 없다는 것이 무력하다는 뜻은 아닙니다. 기구는 약속을
            집행하는 것이 아니라 약속이 스스로 서는 조건을 만듭니다. 다만 조건을
            만들 뿐이므로, 조건이 아무리 좋아도 문턱을 넘지 못하는 사안에서는
            아무 일도 일어나지 않습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="어떤 국제 합의가 실제로 지켜질지 판정하는 절차"
          input={[
            "합의의 내용과 각 당사국이 어겨서 얻는 것, 함께 지켜서 얻는 것",
            "위반을 확인할 수 있는 수단이 있는지",
            "관계가 앞으로 얼마나 이어질 것으로 보이는지",
          ]}
          steps={[
            {
              code: "위반을 알아챌 수 있는지 먼저 본다. 없으면 나머지 단계는 의미가 없다.",
              note: "확인할 수 없는 약속은 어겨도 대응을 부르지 않으므로 계산 자체가 서지 않습니다. 검증 절차가 합의문의 실질인 경우가 많은 이유입니다.",
            },
            {
              code: "알아챘을 때 되갚을 수단이 있는지 본다.",
              note: "되갚을 수단이 한쪽에만 있으면 그쪽의 약속만 신뢰할 수 없게 됩니다. 힘의 차이가 큰 관계에서 합의가 약한 이유가 여기 있습니다.",
            },
            {
              code: "다음에 또 만날 몫을 어림한다. 정권 교체나 합의 종료 시점이 예정되어 있으면 그만큼 낮춘다.",
              note: "끝나는 시점이 알려져 있으면 마지막 기간부터 거슬러 협력이 무너집니다. 기한이 있는 합의에 자동 갱신 조항이 흔한 것이 이 때문입니다.",
            },
            {
              code: "어겨서 얻는 값과 함께 지켜서 얻는 값으로 문턱을 계산하고 셋째 단계의 값과 비교한다.",
              note: "문턱을 넘으면 강제 없이도 지켜질 수 있고, 넘지 못하면 합의문을 아무리 정교하게 써도 지켜지지 않습니다.",
            },
            {
              code: "넘지 못하면 문턱 자체를 낮출 수 있는지 본다: 사안 묶기, 검증 강화, 갱신 주기 단축, 함께 어겼을 때의 손해 키우기.",
              note: "협상에서 다루는 것의 상당 부분이 실제로는 이 조정입니다. 무엇을 약속하느냐보다 약속이 설 조건을 어떻게 만드느냐가 쟁점이 됩니다.",
            },
          ]}
          output="그 합의가 강제 없이 지켜질 수 있는지에 대한 판정과, 지켜지지 않는다면 어느 조건을 바꿔야 하는지에 대한 목록"
        />
      </section>

      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 그래도 남는 것이 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절의 계산에는 조용한 가정이 하나 있었습니다. 각자가 자기 몫만
            본다는 것입니다. 그런데 위가 없는 곳에서는 그 가정이 늘 성립하지
            않습니다.
          </p>

          <p className="leading-7">
            둘 다 이익을 보는 합의라도 한쪽이 더 많이 얻으면, 그 차이가 나중에
            힘의 차이가 됩니다. 그리고 최후에 기댈 곳이 자기 자신뿐인 상태에서는
            힘의 차이가 곧 안전의 차이입니다. 그래서 이익이 얼마인지뿐 아니라
            누가 더 얻는지가 판단에 들어옵니다.
          </p>

          <p className="leading-7">
            이 고려가 강할수록 협력은 어려워집니다. 서로에게 이익인 거래도 상대가
            더 얻는다는 이유로 거부될 수 있기 때문입니다. 반대로 상대의 힘이
            커져도 자기 안전이 줄지 않는 관계에서는 이 고려가 거의 사라집니다.
          </p>

          <p className="leading-7">
            또 하나 남는 것은 국가를 하나의 행위자로 둔 단순화입니다. 실제로
            협상하는 사람은 앞의 여덟 글이 다룬 국내 구조 안에 있습니다. 상대국과
            합의해도 자기 의회를 통과하지 못하면 소용이 없고, 그 사실 자체가
            협상의 도구가 되기도 합니다.
          </p>
        </div>

        <ProgressiveDetail
          title="국내에서 통과시키기 어렵다는 것이 왜 협상에서 유리한가?"
          preview="앞 글들의 거부권자 계산이 국제 협상 테이블 위로 올라옵니다."
        >
          <p className="leading-7">
            3편에서 거부권자가 늘수록 통과 가능한 영역이 좁아진다는 것을 봤습니다.
            국제 합의도 결국 국내에서 비준되어야 한다면, 그 나라가 받아들일 수
            있는 안의 범위는 국내 거부권자들이 정합니다.
          </p>
          <p className="leading-7">
            그러면 그 범위가 좁다는 사실이 협상에서 힘이 됩니다. 상대가 원하는
            안을 받아들이고 싶어도 국내에서 부결될 것이 분명하면, 상대는 통과
            가능한 쪽으로 옮겨 올 수밖에 없습니다. 협상 대표가 자기 손이 묶여
            있다는 것을 굳이 보여 주는 이유입니다.
          </p>
          <p className="leading-7">
            반대 방향도 성립합니다. 국내에서 무엇이든 통과시킬 수 있는 대표는
            양보할 여지가 크다고 읽히므로 더 많이 요구받습니다. 여기서 앞 글들의
            계산이 국경 밖까지 이어진다는 것이 드러납니다. 국내 제도는 국제
            협상의 배경이 아니라 그 안에 들어와 있는 변수입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          첫 글의 질문으로 돌아와서 무엇이 답해졌는지 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            첫 글의 질문은 모두가 원하지만 각자에게는 낼 이유가 없는 것을 어떻게
            만드는가였습니다. 답은 강제였고, 그 뒤 일곱 글은 그 강제력을 누가
            쥐고 어떻게 묶고 어떻게 쓰는지를 따라갔습니다.
          </p>

          <p className="leading-7">
            이 글에서 그 답이 조건부였다는 것이 드러났습니다. 강제라는 해법은
            강제할 자리가 있을 때만 쓸 수 있고, 그 자리가 없으면 첫 글의 문제가
            그대로 돌아옵니다. 그때 남는 것은 반복과 확인과 평판이며, 이것들은
            강제보다 약하고 조건이 많이 붙습니다.
          </p>

          <p className="leading-7">
            그래서 이 시리즈가 답하지 못한 것도 분명해집니다. 강제할 자리가 없는
            문제들, 곧 국경을 넘는 오염이나 감염병처럼 모두가 원하지만 아무도
            강제할 수 없는 사안에서 무엇을 해야 하는지입니다. 여기서 준 것은
            해법이 아니라 그 사안이 어려운 이유를 계산으로 보는 방법입니다.
          </p>

          <p className="leading-7">
            여덟 글을 관통한 실은 하나였습니다. 제도를 좋고 나쁨으로 보지 않고,
            무엇을 사고 무엇으로 값을 치르는지로 보는 것입니다. 강제력은 질서를
            사고 그 힘의 남용 가능성을 치렀고, 헌법은 제약을 사고 경직성을,
            다수제는 단독 과반을 사고 표를, 정당은 결정 가능성을 사고 잘려 나간
            쟁점을, 위임은 집행을 사고 통제를 치렀습니다. 국제 협력은 이 목록에서
            가장 비싼 값을 치릅니다. 강제 없이 조건만으로 서야 하기 때문입니다.
          </p>

          <p className="leading-7">
            이 시리즈의 첫 글로 돌아가려면{" "}
            <Link to="/politics/polity/collective-choice-problem">
              집합적 선택 문제
            </Link>
            에서 다시 시작하면 됩니다. 두 번째로 읽을 때는 각 글이 무엇을 값으로
            치렀는지가 먼저 보일 것입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
