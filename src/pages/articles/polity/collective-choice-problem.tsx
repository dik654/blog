import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import PoliticsMapViz from "./collective-choice-problem/viz/PoliticsMapViz";
import FreeRidingViz from "./collective-choice-problem/viz/FreeRidingViz";

/**
 * 각자 고르면 되는 일과 하나로 정해야 하는 일은 다릅니다
 *
 * 정치 카테고리의 입구 글이다. 먼저 정치 전체를 "한 사회에 하나만 존재할 수 있는
 * 결정"의 연쇄로 한 화면에 놓고, 그 연쇄의 첫 칸(문제 자체)만 연다.
 * 강제력을 누가 쥐는지는 다음 글이 소유한다.
 */
export default function CollectiveChoiceProblemArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          정치는 한 사회에 하나만 있을 수 있는 결정을 다루는 일입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            점심 메뉴는 각자 고르면 됩니다. 내가 짜장면을 골라도 옆 사람은
            짬뽕을 먹을 수 있습니다. 그런데 국방을 얼마나 할지, 세율을 몇
            퍼센트로 할지, 어느 쪽으로 차를 몰지는 그렇지 않습니다. 한 사회에
            하나만 존재할 수 있고, 정해지면 반대한 사람에게도 그대로 적용됩니다.
          </p>

          <p className="leading-7">
            정치는 이런 결정을 다루는 일입니다. 그리고 이 성질 하나에서 뒤따르는
            거의 모든 것이 나옵니다. 하나로 정해야 하니 결정을 강제할 힘이
            필요하고, 그 힘이 생기면 그것을 제어할 장치가 필요하며, 누가 그
            힘을 쓸지 정하는 절차가 필요해집니다.
          </p>

          <p className="leading-7">
            그림을 먼저 보여 드리는 이유가 있습니다. 뒤따르는 글들이 국가·헌법·
            선거·관료제·국제질서처럼 서로 다른 주제처럼 보이지만, 실은 이 한
            줄기를 한 칸씩 따라가는 일이기 때문입니다.
          </p>
        </div>

        <PoliticsMapViz />

        <ContentBoundary article="collective-choice-problem" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              하나로 정해야 하는 일은 왜 각자에게 맡겨 두면 해결되지 않는가
            </strong>
            입니다. 이 질문에 답해야 국가라는 것이 왜 생겼는지, 왜 강제가
            들어오는지가 설명됩니다.
          </p>

          <p className="leading-7">
            순서는 두 종류의 선택을 가르는 기준, 각자 합리적으로 판단할 때
            생기는 결과, 그 결과가 저절로 풀리는 경우와 그 조건, 그리고 조건이
            깨질 때 남는 선택지입니다. 마지막에 이 논증이 증명하지 않는 것으로
            닫습니다.
          </p>

          <p className="leading-7">
            누가 그 강제력을 쥐고 어떤 근거로 쓰는지는 이 글이 다루지 않습니다.
            그 자리는{" "}
            <Link to="/politics/polity/state-and-legitimacy">
              국가와 정당성
            </Link>
            이 맡습니다.
          </p>
        </div>
      </section>

      <section id="two-kinds-of-choice" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 남을 빼놓을 수 있느냐가 두 종류를 가릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            기준은 단순합니다. 돈을 내지 않은 사람을 못 쓰게 막을 수 있으면 각자
            고르는 문제이고, 막을 수 없으면 하나로 정해야 하는 문제입니다. 영화표는
            안 산 사람을 입장시키지 않을 수 있지만, 깨끗한 공기나 국방은 세금을
            안 낸 사람만 골라 빼놓을 수 없습니다.
          </p>

          <p className="leading-7">
            두 번째 기준이 하나 더 있습니다. 한 사람이 쓴다고 남이 쓸 몫이 줄어
            드는가입니다. 빵은 내가 먹으면 남은 양이 줄지만, 등대 불빛은 배 한
            척이 더 본다고 어두워지지 않습니다. 앞을 경합적, 뒤를 비경합적이라
            합니다.
          </p>

          <p className="leading-7">
            둘 다 해당하는 것, 곧 빼놓을 수도 없고 나눠 써도 줄지 않는 것을{" "}
            <strong>공공재</strong>라 부릅니다. 국방·치안·법질서가 대표적입니다.
            그리고 바로 이 성질 때문에 시장에 맡겨 두면 필요한 만큼 공급되지
            않습니다.
          </p>
        </div>

        <TermBreakdown
          title="두 기준으로 네 칸이 나옵니다"
          items={[
            {
              term: "사적재 — 빼놓을 수 있고 경합적",
              description:
                "값을 안 내면 못 쓰게 막을 수 있고, 한 사람이 쓰면 남은 몫이 줄어듭니다. 시장이 가장 잘 다루는 종류입니다.",
              example: "빵, 옷, 영화표처럼 사고파는 대부분의 물건입니다.",
              boundary:
                "시장이 잘 다룬다는 것이 분배가 공정하다는 뜻은 아닙니다. 공급의 문제와 분배의 문제는 다른 질문입니다.",
            },
            {
              term: "공공재 — 빼놓을 수 없고 비경합적",
              description:
                "돈을 안 낸 사람도 혜택을 받고, 한 사람이 더 누려도 남의 몫이 줄지 않습니다. 각자에게 맡기면 과소 공급됩니다.",
              example:
                "국방, 치안, 법질서, 기초연구처럼 누가 누리는지 가려낼 수 없는 것들입니다.",
              boundary:
                "완벽한 공공재는 드뭅니다. 대부분은 정도의 문제이며, 기술이 바뀌면 배제 가능성이 달라지기도 합니다.",
            },
            {
              term: "공유자원 — 빼놓을 수 없지만 경합적",
              description:
                "막을 수는 없는데 쓰면 줄어듭니다. 각자 더 쓰려는 유인이 있어 고갈로 이어지기 쉽습니다.",
              example: "어장, 지하수, 목초지처럼 여럿이 함께 쓰는 자연 자원입니다.",
              boundary:
                "고갈이 필연은 아닙니다. 뒤에서 볼 조건이 갖춰지면 이용자들끼리 규칙을 만들어 유지한 사례가 여럿 있습니다.",
            },
            {
              term: "클럽재 — 빼놓을 수 있지만 비경합적",
              description:
                "값을 안 내면 막을 수 있는데, 회원이 늘어도 혼잡해지기 전까지는 서로의 몫이 줄지 않습니다.",
              example: "유료 방송, 회원제 시설, 혼잡하지 않은 유료도로입니다.",
              boundary:
                "혼잡해지는 순간 경합성이 생겨 성격이 바뀝니다. 네 칸은 고정된 분류가 아니라 조건에 따라 옮겨 다닙니다.",
            },
          ]}
        />
      </section>

      <section id="free-riding" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 각자 합리적으로 판단하면 아무도 내지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            빼놓을 수 없다는 성질에서 곧바로 문제가 나옵니다. 내가 내지 않아도
            남들이 내면 나도 혜택을 받습니다. 그렇다면 내지 않는 쪽이 언제나
            이득입니다. 이것을 <strong>무임승차</strong>라 합니다.
          </p>

          <p className="leading-7">
            여기서 중요한 것은 이것이 누군가의 못된 심성이 아니라는 점입니다.
            모두가 공공재를 원하고 모두가 그것이 필요하다고 믿어도, 각자에게는
            내지 않는 편이 유리합니다. 그래서 모두가 원하는 것이 아무도 내지
            않아 만들어지지 않습니다.
          </p>

          <p className="leading-7">
            더 나쁜 것은 집단이 커질수록 이 유인이 강해진다는 점입니다. 내가 낸
            돈이 만들어 낸 혜택을 여럿이 나눠 가지므로, 사람이 많을수록 내 몫이
            작아집니다. 그래서 큰 집단일수록 자발적 공급이 어렵습니다.
          </p>
        </div>

        <ExplainedFormula
          question="집단이 커질수록 자발적으로 돈을 낼 유인이 왜 약해지는가?"
          idea="내가 비용을 내면 공공재가 늘어나고 그 혜택은 구성원 전체가 나눠 가집니다. 그래서 내가 실제로 되돌려 받는 것은 내가 만든 전체 혜택이 아니라 그중 내 몫뿐입니다. 사람 수가 분모에 들어가므로, 집단이 커질수록 되돌아오는 몫이 작아집니다."
          formula={String.raw`\text{순이득}_i = \frac{b}{n} - c, \qquad \text{기여 조건: } \frac{b}{n} > c`}
          annotatedFormula={String.raw`\text{순이득}_i = \underbrace{\frac{b}{n}}_{\text{내가 만든 혜택 중 내 몫}} - \underbrace{c}_{\text{내가 실제로 내는 비용}}`}
          operations={[
            {
              expression: String.raw`b`,
              annotation: [
                "내가 비용을 냈을 때 사회 전체에 생기는 혜택의 크기입니다.",
                "공공재이므로 이 혜택은 기여하지 않은 사람에게도 그대로 갑니다.",
              ],
            },
            {
              expression: String.raw`\frac{b}{n}`,
              annotation: [
                "나눗셈은 전체 혜택을 구성원 수로 나눠 내게 돌아오는 몫만 남깁니다.",
                "n이 커질수록 이 값이 0에 가까워지므로 기여 유인이 사라집니다.",
              ],
            },
            {
              expression: String.raw`\frac{b}{n} - c`,
              annotation: [
                "차가 양수일 때만 개인에게 기여가 이득이 됩니다.",
                "사회 전체 기준으로는 b > c면 이득인데 개인 기준은 b/n > c이므로, 두 판정이 어긋납니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`b`,
              name: "기여가 만드는 사회 전체 혜택",
              description:
                "한 사람의 기여로 늘어나는 공공재의 가치를 모든 구성원 몫을 합해 잰 값입니다.",
            },
            {
              symbol: String.raw`c`,
              name: "기여자가 치르는 비용",
              description: "기여하는 사람이 실제로 부담하는 금액이나 노력입니다.",
            },
            {
              symbol: String.raw`n`,
              name: "혜택을 나눠 갖는 사람 수",
              description:
                "빼놓을 수 없으므로 기여하지 않은 사람까지 전부 포함합니다.",
            },
          ]}
          assumptions={[
            "혜택이 모두에게 똑같이 나뉜다고 둡니다. 실제로는 누군가가 유난히 크게 이득을 보면 그 사람 혼자서라도 공급할 수 있습니다.",
            "기여 여부가 남에게 보이지 않거나, 보여도 평판이 걸리지 않는다고 둡니다.",
            "한 번만 만나는 상황이라고 둡니다. 계속 마주치는 사이라면 다음 절의 이야기가 됩니다.",
          ]}
          interpretation="b가 100이고 c가 10일 때, 사회 전체로 보면 기여가 분명히 이득입니다. 그런데 n이 5면 개인 몫이 20이라 여전히 이득이지만, n이 100이면 개인 몫이 1이라 손해가 됩니다. 여기서 읽어야 할 것은 개인의 합리성과 집단의 이익이 갈라지는 지점이 집단 크기로 정해진다는 점입니다. 읽으면 안 되는 것은 '큰 집단에서는 자발적 협력이 불가능하다'는 결론입니다. 이 식은 세 가지 전제 위에 서 있고, 그 전제가 깨지는 실제 사례가 다음 절에 있습니다."
        />

        <FreeRidingViz />
      </section>

      <section id="self-governance" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 조건이 맞으면 강제 없이도 유지되는 경우가 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 식의 결론을 그대로 밀고 나가면 &ldquo;공유자원은 반드시
            고갈된다&rdquo;가 됩니다. 그런데 실제로는 수백 년 동안 이용자들끼리
            규칙을 만들어 어장과 목초지와 관개수로를 유지해 온 사례가 여럿
            있습니다. 이 사례들은 앞 식이 틀렸다는 뜻이 아니라 그 전제가 깨졌다는
            뜻입니다.
          </p>

          <p className="leading-7">
            전제를 다시 봅시다. 기여 여부가 남에게 보이지 않는다고 했고, 한 번만
            만난다고 했습니다. 작은 마을에서 대대로 같은 사람들이 같은 수로를
            쓴다면 두 전제가 모두 깨집니다. 누가 물을 더 가져갔는지 보이고,
            내년에도 같은 사람들과 마주쳐야 합니다.
          </p>

          <p className="leading-7">
            그래서 질문이 &ldquo;자치가 가능한가&rdquo;에서 &ldquo;어떤 조건에서
            가능한가&rdquo;로 바뀝니다. 오래 유지된 사례들을 모아 보면 반복해서
            나타나는 조건들이 있습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="자치로 유지될 가능성을 점검하는 절차"
          input={[
            "자원과 이용자의 범위: 누가 쓸 수 있고 어디까지가 그 자원인가",
            "현재 규칙: 얼마나 가져갈 수 있고 누가 무엇을 부담하는가",
            "관계 구조: 이용자들이 서로를 알아볼 수 있는가, 계속 마주치는가",
          ]}
          steps={[
            {
              code: "경계가 명확한가? 이용자 집합과 자원 범위가 정해져 있지 않으면 여기서 중단한다.",
              note: "누가 구성원인지 모르면 규칙을 어긴 사람을 가릴 수 없습니다. 다른 조건이 아무리 좋아도 이것이 없으면 성립하지 않습니다.",
            },
            {
              code: "규칙이 그 지역 조건에 맞는가? 부담과 몫의 비율이 현지 사정과 맞물리는가 확인한다.",
              note: "바깥에서 일률적으로 내려온 규칙은 잘 지켜지지 않습니다. 부담이 혜택과 어긋나면 지킬 이유가 사라집니다.",
            },
            {
              code: "규칙을 바꾸는 자리에 이용자들이 참여하는가?",
              note: "자기가 만든 규칙은 남이 정해 준 규칙보다 잘 지켜집니다. 이 조건이 자치와 외부 규제를 가르는 지점입니다.",
            },
            {
              code: "감시가 이루어지는가? 감시자가 이용자들에게 책임을 지는 구조인가?",
              note: "위반이 보이지 않으면 앞 절의 무임승차 유인이 그대로 돌아옵니다. 감시자가 외부인이면 이용자들이 그를 속이는 문제가 새로 생깁니다.",
            },
            {
              code: "제재가 단계적인가? 첫 위반에 곧바로 최대 처벌을 매기지 않는가?",
              note: "처벌이 너무 무거우면 아무도 신고하지 않아 오히려 집행되지 않습니다. 가벼운 제재부터 올라가는 편이 실제로 작동합니다.",
            },
            {
              code: "분쟁을 싸게 처리할 자리가 있는가? 조직할 권리를 바깥이 인정하는가?",
              note: "다툼을 해결할 비용이 크면 규칙이 있어도 흐지부지됩니다. 상급 권위가 이용자들의 규칙 자체를 부정하면 그 순간 무너집니다.",
            },
            {
              code: "자원이 더 큰 체계의 일부라면, 위 항목들이 층마다 겹쳐 있는가?",
              note: "작은 수로가 큰 강 유역의 일부라면 마을 규칙만으로는 부족합니다. 층을 겹쳐 두는 것이 규모 문제에 대한 답입니다.",
            },
          ]}
          output="이 자원이 자치로 유지될 만한지에 대한 판정과, 부족한 조건이 무엇인지에 대한 목록"
        />

        <CitationBlock
          source="Indiana University Ostrom Workshop · Ostrom Design Principles (teaching tools)"
          citeKey={1}
          href="https://ostromworkshop.indiana.edu/courses-teaching/teaching-tools/ostrom-design/index.html"
        >
          위 점검 항목은 Elinor Ostrom이 1990년 저작 <em>Governing the Commons</em>
          에서 제시한 설계 원칙을 절차 형태로 옮긴 것입니다. 이 페이지는 해당
          원칙이 오래 유지된 공유자원 관리 제도들에서 반복해 관찰된 특징을 정리한
          것임을 밝히고 있습니다. 다만 이것은 &ldquo;이 조건을 갖추면 반드시
          성공한다&rdquo;는 충분조건이 아니라 사례에서 관찰된 공통점이며, 실패한
          사례가 왜 실패했는지까지 이 목록으로 설명되지는 않습니다. 원 저작은
          출판사 사이트가 자동 조회를 막고 있어 서지 사항만 확인했습니다.
        </CitationBlock>

        <div id="scale-limit" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            그런데 이 조건들은 규모가 커지면 대부분 깨집니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              점검 항목을 다시 보면 공통점이 보입니다. 서로를 알아볼 수 있고,
              계속 마주치고, 규칙을 함께 만들 수 있을 만큼 작아야 한다는
              것입니다. 마을 수로에서는 가능하지만 오천만 명의 국방에서는
              성립하지 않습니다.
            </p>

            <p className="leading-7">
              국방을 예로 들면 누가 얼마나 기여했는지 서로 알 수 없고, 규칙을
              함께 만드는 자리에 모두가 참여할 수도 없으며, 감시도 불가능합니다.
              앞 식의 세 전제가 전부 되살아납니다.
            </p>

            <p className="leading-7">
              그래서 규모가 커지면 남는 선택지가 좁아집니다. 자발적 기여에
              맡기거나, 아니면 내지 않는 사람에게서도 강제로 걷는 것입니다.
              앞은 방금 본 이유로 작동하지 않습니다.
            </p>
          </div>
        </div>
      </section>

      <section id="coercion" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 강제는 문제를 푸는 동시에 새 문제를 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            강제로 걷으면 앞의 문제가 풀립니다. 내지 않는 쪽이 이득이라는 계산
            자체가 사라지기 때문입니다. 세금을 안 내면 불이익이 오므로, 각자
            합리적으로 판단해도 내는 쪽을 고르게 됩니다.
          </p>

          <p className="leading-7">
            그런데 이 해법은 조건을 하나 요구합니다. 강제할 수 있는 힘이 실제로
            있어야 한다는 것입니다. 그리고 그 힘은 공공재를 만드는 데만 쓰이는
            것이 아니라 다른 데에도 쓸 수 있습니다. 걷은 돈을 국방에 쓸지 자기
            주머니에 넣을지는 힘을 쥔 쪽이 정합니다.
          </p>

          <p className="leading-7">
            그래서 문제가 옮겨 갑니다. 처음에는 &ldquo;공공재를 어떻게
            만드는가&rdquo;였는데 이제는 &ldquo;그 힘을 누가 쥐고, 쥔 사람이
            멋대로 쓰지 못하게 어떻게 막는가&rdquo;가 됩니다. 정치라는 주제가
            사실상 여기서 시작됩니다.
          </p>
        </div>

        <ProgressiveDetail
          title="강제 말고 다른 길은 없는가?"
          preview="보조금·규제·재산권 설정 같은 길이 있지만 모두 결국 강제할 수 있는 주체를 전제합니다."
        >
          <p className="leading-7">
            빼놓을 수 없다는 성질 자체를 바꾸는 길이 있습니다. 배제할 수 있게
            만들면 사적재처럼 다룰 수 있습니다. 유료도로에 요금소를 세우거나,
            어장에 소유권을 설정해 주인이 관리하게 하는 식입니다. 기술이 바뀌면
            배제 가능성도 바뀌므로 이 경계는 고정된 것이 아닙니다.
          </p>
          <p className="leading-7">
            그런데 이 길들을 잘 보면 공통점이 있습니다. 요금소를 세우려면 그
            도로를 누가 통제하는지 정해져 있어야 하고, 소유권을 설정하려면 그
            권리를 인정하고 침해를 막아 줄 곳이 있어야 합니다. 배제 장치 자체가
            강제할 수 있는 주체를 전제로 합니다.
          </p>
          <p className="leading-7">
            그래서 선택지는 &ldquo;강제냐 아니냐&rdquo;가 아니라 &ldquo;강제를
            어디까지, 어떤 형태로 쓰느냐&rdquo;에 가깝습니다. 규제·과세·재산권
            설정은 서로 다른 도구이지만 모두 같은 전제 위에 서 있습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          시장이 못 한다는 것이 정부가 잘한다는 뜻은 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글의 논증은 &ldquo;각자에게 맡기면 과소 공급된다&rdquo;까지만
            보였습니다. 여기서 &ldquo;그러므로 정부가 공급하면 된다&rdquo;로
            건너뛰면 한 단계를 빠뜨린 것입니다. 정부도 사람이 운영하고, 그
            사람들에게도 각자의 유인이 있습니다.
          </p>

          <p className="leading-7">
            실제로 뒤의 글들은 그 빠뜨린 단계를 하나씩 채웁니다. 힘을 쥔 쪽이
            멋대로 쓰지 못하게 하는 장치, 누가 쥘지 정하는 절차, 그 절차 자체의
            한계, 그리고 정해진 것이 그대로 집행되지 않는 문제입니다.
          </p>

          <p className="leading-7">
            다음 글은 그 힘의 자리입니다.{" "}
            <Link to="/politics/polity/state-and-legitimacy">
              국가와 정당성
            </Link>
            에서 왜 강제력을 한 곳에 몰아주게 되는지, 그리고 그 힘이 단순한
            폭력과 무엇이 다른지를 봅니다.
          </p>
        </div>
      </section>
    </div>
  );
}
