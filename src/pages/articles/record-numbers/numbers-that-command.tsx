import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import LadderViz from "./numbers-that-command/viz/LadderViz";
import FourKindsViz from "./numbers-that-command/viz/FourKindsViz";

/**
 * 재기 위한 숫자가 아니라 시키기 위한 숫자
 *
 * 역사 6편. 앞 두 글이 측정된 숫자를 다뤘다면 이 글은 명령하는 숫자를 본다.
 * 1차 자료는 함무라비 법전이고 C. H. W. Johns 영역(1903년 T. & T. Clark 판)의
 * Project Gutenberg 전사본(eBook 17150)으로 읽었다. facsimile이 아니므로
 * 쪽수를 적지 않고 조항 번호까지만 적는다.
 */
export default function NumbersThatCommandArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          이 숫자들은 무엇을 센 결과가 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            3,700년쯤 전에 돌기둥에 새겨진 법에는 숫자가 빽빽합니다. 소나 양을
            고쳐 준 수의사는 은 6분의 1세켈을 받고 가난한 사람의 눈을 멀게 한
            자는 은 1마나를 물며 품꾼에게는 해의 첫 다섯 달 동안 하루 은 6세를
            줍니다. 앞의 두 글에서 본 숫자와 생김새가 같습니다.
          </p>

          <p className="leading-7">
            그런데 이 숫자들에는 센 절차가 없습니다. 누가 세어서 6분의 1세켈이
            나오지는 않았습니다. <strong>그만큼 주라고 정해 놓은
            것</strong>입니다. 그러니 해상도를 물을 수도 없고 검산할 수도
            없습니다. 앞 두 글에서 쓰던 도구가 여기서는 하나도 걸리지
            않습니다.
          </p>

          <p className="leading-7">
            <strong>
              그러면 명령하는 숫자에서는 무엇을 읽을 수 있습니까. 그리고 그것을
              측정된 숫자처럼 쓰면 무엇이 잘못됩니까.
            </strong>{" "}
            <Link to="/history/record-numbers/what-the-total-cannot-tell">
              앞 글
            </Link>
            이 계산이 적힌 총계를 읽었다면, 이 글은 계산이 있을 수 없는 숫자를
            읽습니다.
          </p>
        </div>

        <LadderViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            볼 것이 넷입니다. 한 사다리 안에서 답의 종류가 바뀌는 자리, 같은
            수가 전혀 다른 일에 쓰이는 자리, 명령하는 숫자의 네 종류, 그리고
            이 숫자로 당시의 값을 읽을 수 있는지입니다.
          </p>

          <p className="leading-7">
            <em>
              이 절에서 멈추더라도 구분 하나는 남습니다. 사료의 숫자에는 재려고
              적은 것과 시키려고 적은 것이 섞여 있습니다.
            </em>
          </p>
        </div>
      </section>

      <section id="rungs" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 한 사다리 안에서 답의 종류가 바뀝니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            눈을 멀게 하거나 뼈를 부러뜨린 경우를 봅니다. 상대가 신사면 그의
            눈을 잃게 하고 가난한 사람이면 은 1마나를 물며 신사의 종이면 그
            종의 값의 절반을 뭅니다. 세 칸의 무게가 다른 것은 금방 보입니다.
            더 눈여겨볼 자리는 <strong>세 칸의 답이 서로 다른
            종류</strong>라는 점입니다.
          </p>

          <p className="leading-7">
            맨 위 칸에는 숫자가 들어가지 않습니다. 가운데 칸에는 정해진 금액이
            들어가고 아래 칸에는 숫자 대신 그 사람의 값에 대한 비율이
            들어갑니다. 같은 상해를 다루면서 한 칸은 되갚고 한 칸은 금액으로
            갈음하며 한 칸은 값으로 환산합니다.
          </p>

          <p className="leading-7">
            이 모양은 여기서만 나오지 않습니다. 이를 부러뜨린 경우도 상대가
            동등한 사람이면 그의 이를 부러뜨리고 가난한 사람이면 은 3분의
            1마나를 뭅니다. 때려서 여자를 죽게 한 경우도 신사의 딸이면
            가해자의 딸을 죽이고 가난한 사람의 딸이면 은 2분의 1마나, 여종이면
            3분의 1마나입니다.
          </p>

          <p className="leading-7">
            이 조항들이 곧바로 보여 주는 바는 <strong>피해자의 신분에 따라
            처분의 종류가 달라진다</strong>는 사실입니다. 신사에게 입힌 해에는
            같은 해를 돌려주고 가난한 사람에게 입힌 해에는 정액을, 종에게 입힌
            해에는 종 값의 비율을 적었습니다. 왜 이런 차이를 두었는지는 이
            조항들만으로 확정할 수 없습니다.
          </p>
        </div>

        <CitationBlock
          source="함무라비 법전 196~199조 · C. H. W. Johns 영역(1903년 판)"
          citeKey={1}
          href="https://www.gutenberg.org/ebooks/17150"
        >
          원문은 이렇습니다 — “196. If a man has caused the loss of a
          gentleman’s eye, his eye one shall cause to be lost. … 198. If he has
          caused a poor man to lose his eye or shattered a poor man’s limb, he
          shall pay one mina of silver. 199. If he has caused the loss of the eye
          of a gentleman’s servant or has shattered the limb of a gentleman’s
          servant, he shall pay half his price.” 번역어 gentleman과 poor man은
          영역자가 고른 말이며, 본문의 ‘신사’와 ‘가난한 사람’은 그 영어를 옮긴
          것입니다. 1마나 = 60세켈이라는 환산은 같은 판 색인의 주에 적혀 있습니다.
          Project Gutenberg 전사본(eBook 17150)으로 읽었고, facsimile이 아니므로
          쪽수 대신 조항 번호까지만 적습니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>칸마다 답의 종류가 바뀌는 것은 잡혔습니다. 이번에는 숫자가
            들어간 칸들만 따로 봅니다.</em>
          </p>
        </div>
      </section>

      <section id="same-ladder" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 같은 10 · 5 · 2가 배상에도 사례금에도 쓰입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            때려서 아이를 잃게 한 경우의 배상은 신사의 딸이면 은 10세켈,
            가난한 사람의 딸이면 5세켈, 신사의 여종이면 2세켈입니다. 조금
            뒤에는 의사의 사례금이 나옵니다. 큰 상처를 청동 칼로 치료하거나
            눈의 종기를 째서 고쳤을 때 환자가 신사면 10세켈, 가난한 사람의
            아들이면 5세켈, 신사의 종이면 그 주인이 2세켈을 줍니다.
          </p>

          <p className="leading-7">
            두 사다리가 그대로 포개집니다. 배상은 해를 입힌 자가 물어 주는
            돈이고 사례금은 고쳐 준 사람이 받는 돈입니다. 일의 성격이 반대인데
            금액이 같습니다. 두 조항에서 금액을 나누는 공통 기준은 <strong>상대가 어느 신분 칸에 있는가</strong>입니다. 같은 금액이
            쓰였다는 사실만으로 배상과 치료를 같은 가치로 평가했다고 볼 수는
            없습니다.
          </p>

          <p className="leading-7">
            사다리의 비율이 늘 같지는 않습니다. 부러진 뼈나 병든 장을 고친
            의사의 사례금은 5세켈·3세켈·2세켈로 10·5·2와 다릅니다. 세 칸의
            값을 묶는 고정된 비는 없습니다. 비교한 세 조항 묶음에서 칸의
            순서는 같지만 금액의 간격은 조항마다 다릅니다.
          </p>
        </div>

        <TermBreakdown
          title="세 사다리를 나란히"
          description="칸의 순서는 같고 간격은 다릅니다."
          items={[
            {
              term: "아이를 잃게 한 배상 (209·211·213조)",
              description: "10세켈 · 5세켈 · 2세켈",
              example:
                "신사의 딸, 가난한 사람의 딸, 신사의 여종 순입니다.",
              boundary:
                "같은 조항 묶음에서 그 여자가 죽으면 답이 금액에서 다른 종류로 바뀝니다.",
            },
            {
              term: "큰 상처·눈을 고친 사례금 (215~217조)",
              description: "10세켈 · 5세켈 · 2세켈",
              example: "환자가 신사, 가난한 사람의 아들, 신사의 종 순입니다.",
              boundary:
                "배상과 금액이 같다고 해서 두 일이 같은 무게로 평가되었다고 읽을 수는 없습니다. 같은 것은 숫자이지 근거가 아닙니다.",
            },
            {
              term: "부러진 뼈·병든 장을 고친 사례금 (221~223조)",
              description: "5세켈 · 3세켈 · 2세켈",
              example: "같은 세 칸인데 간격이 다릅니다.",
              boundary:
                "세 칸의 값이 고정된 비로 묶여 있지 않다는 증거입니다. 순서만 규칙입니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>금액이 무엇을 담고 있는지가 드러났습니다. 다음 부품은 금액
            말고 다른 꼴의 명령입니다.</em>
          </p>
        </div>
      </section>

      <section id="four-kinds" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 네 종류는 서로 다른 기준을 씁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            앞의 조항들을 늘어놓으면 답의 꼴이 네 가지로 갈립니다. 숫자가 아예
            들어가지 않는 자리, 정해진 금액, 그 대상의 값에 매기는 비율, 몇
            번이라는 횟수입니다. 윗사람을 친 자는 집회에서 쇠가죽 채찍 60대를
            맞습니다. 이것도 숫자이지만 돈은 아닙니다.
          </p>
        </div>

        <FourKindsViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            네 종류는 계산할 때 붙잡는 기준이 서로 다릅니다. 같은 해를
            돌려주는 조항은 상해의 종류를 기준으로 삼습니다. 정액 조항은 정해
            둔 은의 무게를, 비율 조항은 대상에게 매긴 값을, 횟수 조항은 정해
            둔 행동의 횟수를 봅니다. 어떤 기준이 적혔는지는 읽을 수 있지만
            실제 집행 빈도는 여기서 나오지 않습니다.
          </p>

          <p className="leading-7">
            비율이 쓰인 자리가 특히 많은 말을 해 줍니다. 종의 눈을 잃게 한
            의사는 그 종 값의 절반을 물고 소나 양을 죽게 한 수의사는 그 값의
            4분의 1을 뭅니다. 둘 다 거래되는 값이 있는 대상입니다. 신사의
            눈에는 비율이 쓰이지 않고 같은 해를 돌려주라는 문장이 놓입니다. 이
            법전의 해당 조항이 종·가축에는 값의 분수를, 신사의 눈에는 다른
            처분을 골랐다는 데까지 읽을 수 있습니다. 그 선택만으로 당시
            사람들의 모든 가치 판단을 알아냈다고 할 수는 없습니다.
          </p>

          <ProgressiveDetail
            title="이 경계를 읽을 때 조심할 것"
            preview="법이 그렇게 나눠 두었다는 것과 사람들이 실제로 그렇게 여겼다는 것은 다릅니다."
          >
            <p className="leading-7">
              법전에 종의 눈이 값으로 환산되어 있으니 그 법은 종을 값으로 재는
              대상으로 다룬 셈입니다. 같은 사회의 사람들이 모두 그렇게
              여겼는지, 또는 실제 재판에서 그렇게 처리되었는지는 이 사료에서
              나오지 않습니다. 법전은 한 사회가 남긴 여러 기록 가운데 하나이고
              그 가운데 명령하는 쪽의 기록입니다.
            </p>
            <p className="leading-7">
              앞 분류에서 저자의 자리를 물었던 물음이 여기서도 그대로
              걸립니다. 이 돌기둥을 세우게 한 쪽이 누구이고 무엇을 정하려
              했는지가 적힌 내용의 모양을 정합니다. 이 글은 그 기록이 무엇을
              어느 칸에 두었는지까지만 읽습니다.
            </p>
          </ProgressiveDetail>

          <p className="leading-7">
            <em>네 종류와 기준이 나왔습니다. 마지막 부품은 이 숫자들로 당시의
            값을 읽어도 되는지입니다.</em>
          </p>
        </div>
      </section>

      <section id="reading-prices" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 정해진 값은 치러진 값이 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            법전에는 품삯과 임차료도 적혀 있습니다. 품꾼을 쓰면 해의 처음부터
            다섯째 달까지는 하루에 은 6세, 여섯째 달부터 연말까지는 5세를
            줍니다. 타작에 소를 빌리면 하루에 곡식 20카, 나귀면 10카입니다.
            소와 수레와 몰이꾼을 함께 빌리면 하루 180카이고 수레만 빌리면
            40카입니다.
          </p>

          <p className="leading-7">
            이런 숫자를 보면 당시의 물가표처럼 읽고 싶어집니다. 그런데 적힌
            것은 그 값에 거래가 이루어졌다는 관찰이 아닙니다. <strong>그
            값으로 하라는 명령</strong>입니다. 실제로 그 명령이 얼마나
            지켜졌는지는 이 조항에 적혀 있지 않습니다.
          </p>

          <p className="leading-7">
            그래도 법이 무엇을 달리 정했는지는 읽을 수 있습니다. 소 20카와
            나귀 10카는 같은 조항 묶음 안에서 정한 금액의 2:1 차이입니다.
            이것은<strong>법전 안의 상대적 설정</strong>입니다. 실제 거래
            가격이 2:1이었다는 측정 결과는 아닙니다. 실제 품삯과 시장 비율을
            알려면 다른 자료가 필요합니다.
          </p>

          <p className="leading-7">
            여기서 앞 두 글과의 차이가 분명해집니다. 측정된 숫자에는 해상도를
            묻고 검산을 할 수 있지만 명령하는 숫자에는 둘 다 할 수 없습니다.
            대신 명령하는 숫자에는 다른 물음이 걸립니다. 무엇을 어느 칸에
            두었는가, 어떤 꼴의 답을 골랐는가, 그 선택이 어떤 기준을
            쓰는가입니다.
          </p>

          <p className="leading-7">
            <em>이 글의 답은 여기서 멈춥니다. 명령하는 숫자는 세상이
            어떠했는지를 말해 주지 않습니다. 그것을 정한 쪽이 세상을 어떻게
            나누었는지를 말해 줍니다.</em>
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          다음은 남은 것과 사라진 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            지금까지 두 분류는 남아 있는 기록을 어떻게 읽을지를 다뤘습니다.
            서술이 어떻게 만들어졌는지, 숫자가 어디서 나왔는지였습니다. 그런데
            손에 들어온 기록이 그 시대가 남긴 전부는 아닙니다.
          </p>

          <p className="leading-7">
            남는 과정 자체가 한쪽으로 치우쳐 있다면 남은 것만 보고 그 시대를
            그리는 일은 어떻게 어긋납니까. 마지막 분류의 첫 글은 돌로 지은
            도시와 흩어져 사는 도시를 견주어 폐허가 무엇을 잘못 말하는지를
            봅니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 눈을 잃게 한 경우의 세 칸에서 답의 종류가 각각 무엇입니까.{" "}
            <strong>(답: 부품 1절)</strong>
          </p>

          <p className="leading-7">
            2. 10 · 5 · 2가 배상과 사례금에 똑같이 쓰인 데서 무엇을 읽을 수
            있습니까. <strong>(답: 부품 2절)</strong>
          </p>

          <p className="leading-7">
            3. 하루 품삯 은 6세를 당시의 품삯으로 인용하면 무엇이 잘못됩니까.{" "}
            <strong>(답: 부품 4절)</strong>
          </p>
        </div>

        <ContentBoundary article="numbers-that-command" />
      </section>
    </div>
  );
}
