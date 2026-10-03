import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import EnclosureCountViz from "./how-the-army-was-counted/viz/EnclosureCountViz";
import WhereItCanSlipViz from "./how-the-army-was-counted/viz/WhereItCanSlipViz";

/**
 * 170만이라는 수가 어떤 절차로 나왔는지 적혀 있습니다
 *
 * 역사 4편, 두 번째 분류의 첫 글. 사료에 적힌 숫자를 센 결과로 받지 않고
 * 센 절차를 묻는다. 1차 자료는 헤로도토스 『역사』 7권 60절이고 Macaulay
 * 영역본(Project Gutenberg eBook 2456) 전사본으로 읽었다. facsimile이
 * 아니므로 쪽수를 적지 않고 권·절 번호까지만 적는다.
 */
export default function HowTheArmyWasCountedArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          보병이 170만이라고 적은 다음 줄에 세는 방법이 적혀 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            페르시아 군대의 규모를 적은 대목에 숫자 하나가 있습니다. 육군 전체가
            170만이었다는 것입니다. 오늘 읽는 쪽은 이런 수를 보면 누군가 사람을
            헤아려 얻은 결과로 받습니다. 그런데 이 사료는 드물게{" "}
            <strong>그 수를 어떻게 얻었는지를 바로 다음 줄에 적어
            두었습니다.</strong>
          </p>

          <p className="leading-7">
            방법은 이렇습니다. 1만 명을 한곳에 모아 할 수 있는 만큼 빽빽하게
            세우고 그 바깥으로 원을 두릅니다. 사람들을 내보낸 뒤 그 원의 둘레에
            거친 돌로 배꼽 높이의 담을 쌓습니다. 그다음부터는 다른 사람들을 그
            안으로 들여보내 공간을 채우고 비우기를 되풀이합니다.
          </p>

          <p className="leading-7">
            <strong>
              그러면 170만이라는 수는 사람을 헤아린 결과입니까, 아니면 다른
              무엇을 헤아린 결과입니까.
            </strong>{" "}
            <Link to="/history/testimony/speeches-were-reconstructed">
              앞 분류
            </Link>
            가 서술이 어떻게 만들어졌는지를 물었다면, 이 분류는 숫자가 어떻게
            만들어졌는지를 묻습니다.
          </p>
        </div>

        <EnclosureCountViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            네 부품입니다. 같은 문장에 출처가 다른 두 숫자가 있다는 것, 절차가
            무엇이었는지, 그래서 세어진 것이 무엇인지, 그리고 이 절차가 어디서
            어긋나는지입니다.
          </p>

          <p className="leading-7">
            <em>
              여기서 멈추더라도 하나는 가져갈 수 있습니다. 사료의 숫자를 읽을
              때 먼저 물을 것은 크기가 아니라 단위입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="two-numbers" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 한 문장에 적을 수 없는 수와 적을 수 있는 수가 함께 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이 절은 못 하겠다는 말로 시작합니다. 각 민족이 얼마씩 보냈는지는
            확실한 정보를 줄 수 없고, 그것은 아무도 보고하지 않았기 때문이라고
            적습니다. 그러고 나서 육군 전체의 수는 170만으로 나왔다고 적습니다.
          </p>

          <p className="leading-7">
            한 문장 안에서 두 숫자의 처지가 갈립니다. 민족별 수는{" "}
            <strong>보고가 없어서</strong> 적을 수 없고, 전체 수는{" "}
            <strong>절차가 있어서</strong> 적을 수 있습니다. 전해 들은 것에
            기대는 수와 절차에서 나오는 수가 서로 다른 종류라는 것을, 저자가
            둘을 나란히 두어 보입니다.
          </p>

          <p className="leading-7">
            이 구분이 중요한 까닭은 두 숫자가 겉보기에 같은 꼴로 적혀 있기
            때문입니다. 민족별 수가 만약 어딘가에서 전해졌다면 그것도 숫자로
            적혔을 것이고, 독자는 170만과 같은 무게로 읽었을 것입니다. 전해 들은
            수와 절차에서 나온 수를 갈라 주는 것은 숫자의 모양이 아니라 그 옆에
            적힌 말입니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 절의 두 숫자"
          description="적을 수 있었는지 아닌지가 출처에 따라 갈립니다."
          items={[
            {
              term: "민족별 수 · 적지 못함",
              description:
                "각 민족이 얼마씩 보냈는지는 확실한 정보를 줄 수 없다고 적습니다.",
              example:
                "그 이유로 아무도 그것을 보고하지 않았다는 것을 듭니다. 들은 바가 없으면 수를 만들지 않는다는 뜻입니다.",
              boundary:
                "민족별 구성이 궁금하면 이 절에서는 답을 얻을 수 없습니다. 저자가 그 사실을 적어 두었다는 것까지가 얻을 수 있는 정보입니다.",
            },
            {
              term: "전체 수 · 170만",
              description:
                "육군 전체의 수는 그렇게 나왔다고 적고, 어떻게 나왔는지를 이어서 적습니다.",
              example:
                "1만 명이 들어가는 담을 만들고 채움을 되풀이해 얻었습니다.",
              boundary:
                "절차에서 나온 수이므로 절차의 한계가 그대로 수의 한계가 됩니다. 다음 부품들이 그 한계를 봅니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              두 숫자의 처지가 갈렸습니다. 절차 쪽 수의 내부를 열어 보는 것이
              다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="procedure" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 절차는 눈금을 만드는 일과 채우는 일로 나뉩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            적힌 절차를 단계로 끊으면 앞의 세 단계가 눈금을 만드는 일이고 뒤의 두
            단계가 그 눈금을 쓰는 일입니다. 눈금을 만드는 일은 한 번만 하고, 쓰는
            일은 사람이 남아 있는 동안 되풀이합니다.
          </p>
        </div>

        <AlgorithmBlock
          title="사료에 적힌 세는 절차"
          input={[
            "1만 명이라는 출발 단위",
            "거친 돌",
            "아직 세지 않은 군대",
          ]}
          steps={[
            {
              code: "1만 명을 한곳에 모아 할 수 있는 만큼 빽빽하게 세운다",
              note: "이 1만 명을 무엇으로 세었는지는 적혀 있지 않습니다. 절차의 출발점은 절차 바깥에서 옵니다.",
            },
            {
              code: "모인 사람들 바깥으로 원을 두른다",
              note: "원이 그 1만 명이 차지하는 땅의 크기를 땅 위에 남깁니다. 이 단계에서 사람 수가 면적으로 바뀝니다.",
            },
            {
              code: "사람들을 내보내고 원의 둘레에 배꼽 높이의 담을 쌓는다",
              note: "흙에 그은 선은 지워지므로 돌로 고정합니다. 높이를 배꼽까지로 한 것은 안에 사람을 넣고 밖에서 찬 것을 볼 수 있는 높이입니다.",
            },
            {
              code: "다른 사람들을 담 안에 들여보내 공간을 채운다",
              note: "여기서부터 세는 대상이 사람이 아니라 채움입니다. 한 번 채우는 데 드는 품은 사람 수와 무관하게 일정합니다.",
            },
            {
              code: "다 셀 때까지 되풀이하고, 그 뒤에 민족별로 나눠 세운다",
              note: "민족별로 줄을 세운 것은 세기 위한 것이 아니라 세고 난 뒤의 편성입니다. 그래서 민족별 수가 이 절차에서 나오지 않습니다.",
            },
          ]}
          output="채움의 횟수 170 — 1만을 곱해 170만으로 적힘"
        />

        <CitationBlock
          source="헤로도토스, 『역사』 7권 60절 · G. C. Macaulay 영역"
          citeKey={1}
          href="https://www.gutenberg.org/ebooks/2456"
        >
          원문은 이렇습니다 — “they gathered together in one place a body of ten
          thousand men, and packing them together as closely as they could, they
          drew a circle round outside: and thus having drawn a circle round and
          having let the ten thousand men go from it, they built a wall of rough
          stones round the circumference of the circle, rising to the height of a
          man’s navel.” 같은 절은 앞에서 민족별 수를 확실히 줄 수 없다고 적고,
          전체 육군이 “one hundred and seventy myriads”였다고 적습니다. 영역자는
          그 수를 1,700,000으로 주석에 풀어 두었습니다. Project Gutenberg의
          Macaulay 영역본 전사본(eBook 2456)으로 읽었습니다. facsimile이 아니므로
          쪽수를 적지 않고 권·절 번호까지만 적습니다. 한국어 서술은 이 글이 옮긴
          것이고 공인된 번역이 아닙니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              절차가 다 나왔습니다. 그 절차가 실제로 센 것이 무엇인지를 짚는
              것이 다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="what-was-counted" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 세어진 것은 사람이 아니라 채움의 횟수입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            절차를 끝까지 따라가면 사람을 하나씩 헤아리는 단계가 한 번도 없습니다.
            처음 1만 명은 절차 밖에서 왔고, 그 뒤로는 담이 몇 번 찼는지만
            헤아립니다. 그래서 170만은 사람 1,700,000명을 센 수가 아니라{" "}
            <strong>1만이라는 눈금을 170번 적용한 수</strong>입니다.
          </p>

          <p className="leading-7">
            이 둘은 같은 크기를 가리키면서도 성질이 다릅니다. 사람을 하나씩 센
            수라면 끝자리까지 뜻이 있고, 눈금으로 센 수는 눈금보다 작은 차이를
            담지 못합니다. 170만의 끝자리 0 네 개는 사람이 정확히 그만큼이었다는
            뜻이 아니라 <strong>그 자리에 정보가 없다는 뜻</strong>입니다.
          </p>

          <p className="leading-7">
            대신 얻는 것이 있습니다. 사람을 하나씩 세려면 품이 사람 수에 비례해
            늘어나고 중간에 틀리면 어디서 틀렸는지 찾을 수 없습니다. 채움으로
            세면 한 번 채우는 품이 일정하고 횟수만 기억하면 되므로, 큰 군대일수록
            이 방법이 유리해집니다. 정확도를 내주고 실행 가능성을 얻은 교환입니다.
          </p>
        </div>

        <ProgressiveDetail
          title="오늘 쓰는 측정과 비교하면"
          preview="눈금을 만들고 그 눈금으로 세는 구조는 지금도 같습니다. 다른 것은 눈금의 크기와 그것을 적어 두는지입니다."
        >
          <p className="leading-7">
            오늘도 큰 수를 셀 때 하나씩 헤아리지 않습니다. 쌀 한 가마의 무게를
            정해 두고 가마 수를 세거나, 한 묶음의 장수를 정해 두고 묶음 수를
            셉니다. 구조가 같으므로 한계도 같습니다. 묶음보다 작은 차이는 결과에
            나타나지 않고, 묶음의 크기가 실제와 다르면 그 오차가 묶음 수만큼
            곱해집니다.
          </p>
          <p className="leading-7">
            달라진 것은 눈금을 적어 두는 관행입니다. 오늘의 통계는 단위와 측정
            방법을 함께 적고, 그래서 뒷사람이 해상도를 계산할 수 있습니다. 이
            사료가 드문 이유도 같습니다. 절차를 적어 두었으므로 2,400년 뒤에도
            이 수의 해상도를 1만으로 읽을 수 있습니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              세어진 것이 무엇인지 정해졌습니다. 그 절차가 어디서 어긋나는지가
              마지막 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="where-it-slips" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 어긋날 자리가 셋 있고 모두 눈금 안에 묻힙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            절차가 적혀 있으면 그 절차가 어디서 틀릴 수 있는지도 따질 수 있습니다.
            아래 세 자리는 사료가 지적한 것이 아니라 적힌 절차에서 이 글이 짚은
            것입니다.
          </p>
        </div>

        <WhereItCanSlipViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            세 자리의 어긋남에는 공통점이 있습니다. 어느 것도 1만보다 큰 차이를
            만들기 어렵고, 어느 것도 기록에 흔적을 남기지 않습니다. 그래서 이
            수를 쓸 때의 기준이 정해집니다. 1만 단위에서는 관찰을 전하는 수이고,
            그보다 작은 자리에서는 아무 말도 하지 않는 수입니다.
          </p>

          <p className="leading-7">
            여기서 한 가지를 더 가려야 합니다. 절차가 적혀 있다는 것은 수의
            해상도를 알 수 있다는 뜻일 뿐, 그 수가 실제 군대 규모에 가깝다는
            보증은 아닙니다. 담의 밀도가 실제보다 크게 잡혔다면 170번의 채움은
            실제보다 많은 사람으로 환산되고, 그 오차는 170배로 곱해집니다.
            절차를 아는 것과 결과를 신뢰하는 것은 다른 문제입니다.
          </p>

          <p className="leading-7">
            그래도 절차가 적힌 수와 적히지 않은 수는 같은 자리에 둘 수 없습니다.
            앞쪽은 어디까지 믿을지를 독자가 계산할 수 있고, 뒤쪽은 그조차 할 수
            없습니다. 숫자를 인용할 때 절차가 적혀 있는지를 먼저 보아야 하는
            이유입니다.
          </p>

          <p className="leading-7">
            <em>
              이 글의 답은 여기서 닫힙니다. 적힌 숫자는 센 결과가 아니라 센
              절차의 결과이고, 절차를 모르면 그 수의 뜻도 모릅니다.
            </em>
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          다음은 세기 위한 숫자가 아닌 숫자입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글의 숫자는 무엇이 얼마나 있는지를 재려고 적혔습니다. 그런데
            사료에 적힌 숫자가 모두 재기 위한 것은 아닙니다. 어떤 숫자는 무엇을
            해야 하는지를 정하기 위해 적힙니다. 소를 훔치면 은 얼마를 물라는
            식입니다.
          </p>

          <p className="leading-7">
            그런 숫자는 세어서 얻은 것이 아니므로 틀렸는지 맞았는지를 물을 수
            없습니다. 그러면 그 숫자에서 읽을 수 있는 것은 무엇이고, 측정된
            숫자와 섞으면 무엇이 잘못됩니까. 다음 글의 질문입니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 같은 절에서 민족별 수는 적지 못하고 전체 수는 적을 수 있었던 까닭은
            무엇입니까. <strong>(답: 부품 1절)</strong>
          </p>

          <p className="leading-7">
            2. 170만의 끝자리 0 네 개를 어떻게 읽어야 합니까.{" "}
            <strong>(답: 부품 3절)</strong>
          </p>

          <p className="leading-7">
            3. 담의 밀도를 실제보다 크게 잡았다면 결과는 어느 쪽으로 얼마만큼
            치우칩니까. <strong>(답: 부품 4절)</strong>
          </p>
        </div>

        <ContentBoundary article="how-the-army-was-counted" />
      </section>
    </div>
  );
}
