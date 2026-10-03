import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ThreeAccountsViz from "./told-but-not-believed/viz/ThreeAccountsViz";
import ReportVsBelieveViz from "./told-but-not-believed/viz/ReportVsBelieveViz";

/**
 * 믿지 않는 이야기도 적는다고 그는 규칙으로 적었습니다
 *
 * 역사 2편. 1편이 한 책 안에 만들어진 방법이 다른 두 칸이 있다는 것을
 * 세웠고, 이 글은 그 다음 자리를 본다. 1차 자료는 헤로도토스 『역사』 7권
 * 148~152절이고 Macaulay 영역본(Project Gutenberg eBook 2456) 전사본으로
 * 읽었다. facsimile이 아니므로 쪽수를 적지 않고 권·절 번호까지만 적는다.
 */
export default function ToldButNotBelievedArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          아르고스가 왜 빠졌는지에 대한 답이 셋 적혀 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            페르시아가 그리스를 치러 올 때 아르고스는 연합에 들어오지 않았습니다.
            헤로도토스는 그 이유를 적으면서 답을 하나 고르지 않고{" "}
            <strong>셋을 나란히 적어 둡니다.</strong> 아르고스인 자신의 설명,
            헬라스에 돌던 다른 이야기, 그리고 아르고스인이 페르시아를 불러들인
            당사자였다는 더 심한 이야기입니다.
          </p>

          <p className="leading-7">
            세 이야기가 가리키는 아르고스의 책임은 전혀 다릅니다. 첫째대로라면
            신탁을 따랐고 스파르타가 양보하지 않아 빠진 것이고, 셋째대로라면
            침략을 부른 쪽입니다. 그런데 저자는 어느 쪽이 맞는지 확실히 말할 수
            없다고 적고, 아르고스인이 보고하는 것 외에는 이 문제에 대해 어떤
            의견도 밝히지 않는다고 덧붙입니다.
          </p>

          <p className="leading-7">
            <strong>
              믿지 않으면서 적은 문장이 책에 남아 있다면, 읽는 쪽은 그것을
              무엇으로 다뤄야 합니까.
            </strong>{" "}
            <Link to="/history/testimony/speeches-were-reconstructed">
              1편
            </Link>
            이 한 책 안에 만들어진 방법이 다른 두 칸이 있다는 것을 세웠다면, 이
            글은 그 칸 안에서 저자가 믿는 것과 믿지 않는 것을 어떻게 구분해
            두었는지를 봅니다.
          </p>
        </div>

        <ThreeAccountsViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            네 자리를 봅니다. 세 이야기가 무엇인지, 각 이야기에 붙은 꼬리표가
            무엇을 하는지, 저자가 전할 의무와 믿을 의무를 어떻게 갈랐는지,
            그리고 그 규칙이 어디까지 걸리는지입니다.
          </p>

          <p className="leading-7">
            <em>
              이 절만 읽고 멈춰도 한 가지는 남습니다. 사료에 적힌 문장이
              저자가 믿는 문장이라는 보장은 없습니다.
            </em>
          </p>
        </div>
      </section>

      <section id="three-accounts" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 같은 일에 대한 세 설명이 책에 함께 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            첫째 설명은 아르고스인 자신이 한 말입니다. 바르바로이가 움직인다는
            소식을 가장 먼저 알았고 델포이에 사람을 보내 어떻게 해야 가장
            좋을지 물었더니 창을 거두어 잘 지키라는 답을 받았다고 합니다. 그
            뒤 그리스 사절이 왔을 때 아르고스는 스파르타와 30년 화평을 맺고
            연합 지휘권의 절반을 받는 조건으로 응하겠다고 했습니다. 스파르타가
            왕이 둘이라 양보할 수 없다고 하자 사절에게 해 지기 전에 떠나라고
            통고했다는 데까지가 첫째 설명입니다.
          </p>

          <p className="leading-7">
            둘째 설명은 헬라스에 돌던 다른 이야기입니다. 크세르크세스가 원정에
            나서기 전에 아르고스로 사자를 보내 페르세우스의 후손이라는 혈연을
            들어 가만히 있으라고 했습니다. 아르고스인은 그 말을 크게 여겨
            처음에는 돕겠다고도 몫을 달라고도 하지 않았습니다. 뒤에 그리스
            쪽이 끌어들이려 하자 스파르타가 지휘권을 나눠 주지 않으리라는 것을
            알고 <strong>가만히 있을 구실을 얻으려고</strong> 지휘권을
            요구했다고 합니다.
          </p>

          <p className="leading-7">
            셋째 설명은 저자가 맨 끝에 한 줄로 덧붙입니다. 아르고스인이 바로
            페르시아를 불러들여 헬라스를 치게 한 자들이었다는 말도 전해진다고
            씁니다. 스파르타와의 전쟁이 나쁘게 끝난 탓에 당장의 괴로움보다는
            무엇이든 겪는 편을 택했기 때문이라는 이유까지 함께 옮깁니다.
          </p>
        </div>

        <TermBreakdown
          title="세 설명이 가리키는 책임"
          description="같은 사실을 설명하면서 아르고스의 자리를 서로 다르게 놓습니다."
          items={[
            {
              term: "아르고스인의 설명",
              description:
                "신탁을 따랐고 조건이 맞지 않아 빠졌다는 것입니다. 책임은 양보하지 않은 스파르타 쪽으로 갑니다.",
              example:
                "30년 화평과 지휘권 절반을 요구했고, 스파르타가 왕이 둘이라며 거절했습니다.",
              boundary:
                "저자는 이 설명을 '아르고스인이 보고한다'는 꼬리표를 붙여 옮깁니다.",
            },
            {
              term: "헬라스에 돌던 이야기",
              description:
                "페르시아 쪽의 제안을 받고 이미 빠지기로 한 뒤에 구실을 만들었다는 것입니다. 책임이 아르고스로 옮겨 옵니다.",
              example:
                "지휘권 요구가 조건이 아니라 가만히 있을 구실이었다고 봅니다.",
              boundary:
                "같은 행동(지휘권 요구)을 두 설명이 정반대로 해석합니다. 행동만으로는 둘을 가릴 수 없습니다.",
            },
            {
              term: "불러들였다는 이야기",
              description:
                "아르고스인이 침략을 부른 당사자였다는 것입니다. 가장 무거운 책임입니다.",
              example:
                "스파르타와의 전쟁이 나쁘게 끝나 당장의 괴로움을 벗으려 했다는 이유까지 함께 전해집니다.",
              boundary:
                "저자는 이것도 '전해진다'로만 적고 자기 판단을 붙이지 않습니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>셋이 무엇인지는 잡혔습니다. 다음 부품은 셋이 섞이지 않는
            까닭입니다.</em>
          </p>
        </div>
      </section>

      <section id="tags" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 셋을 가르는 것은 문장에 붙은 꼬리표입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            세 설명은 내용으로는 서로를 부정하지만 같은 책에 함께 있습니다.
            섞이지 않는 이유는 각 설명이 들어오는 자리에 <strong>누구의
            말인지가 적혀 있기 때문</strong>입니다. 첫째는 아르고스인이 자기
            일을 이렇게 보고한다고 적혀 들어오고, 둘째는 헬라스에 다른 이야기가
            전해진다고 적혀 들어오며, 셋째는 이런 말도 전해진다고 적혀
            들어옵니다.
          </p>

          <p className="leading-7">
            꼬리표는 설명 안에서도 계속 붙습니다. 아르고스인의 설명을 옮기는
            동안 "그들은 말한다"가 문장마다 되풀이됩니다. 신탁을 받았다는
            대목도 조건을 걸었다는 대목도 아르고스인의 보고로 남고, 저자의
            서술로 넘어가지 않습니다. 그래서 독자는 한 문단 안에서도
            어디까지가 누구의 주장인지를 잃지 않습니다.
          </p>

          <p className="leading-7">
            이 장치가 없으면 세 설명은 서로 모순된 서술이 되어 책의 신뢰를
            깎습니다. 꼬리표가 있으면 세 설명은 <strong>세 개의 서로 다른
            보고</strong>가 됩니다. 모순은 저자의 것이 아니라 당대 사람들
            사이의 것이 됩니다. 보고가 갈렸다는 사실 자체가 기록의 내용이 되는
            셈입니다.
          </p>
        </div>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>꼬리표의 일은 여기까지입니다. 다음 부품은 저자가 그 꼬리표로
            무엇을 할 수 있게 되었는지입니다.</em>
          </p>
        </div>
      </section>

      <section id="two-duties" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 전할 의무와 믿을 의무를 따로 두었습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            세 설명을 적어 둔 뒤 저자는 한 문장으로 자기가 무엇을 하고 있는지
            밝힙니다. 전해지는 것을 전할 의무는 자기에게 있으나 그것을 다 믿을
            의무는 없다는 말입니다. 적는 일과 믿는 일을 하나로 묶으면 믿지
            못하는 이야기는 책에 들어오지 못합니다. 들어오지 못한 이야기가
            있었다는 사실까지 함께 사라집니다.
          </p>
        </div>

        <ReportVsBelieveViz />

        <CitationBlock
          source="헤로도토스, 『역사』 7권 152절 · G. C. Macaulay 영역"
          citeKey={1}
          href="https://www.gutenberg.org/ebooks/2456"
        >
          원문은 이렇습니다 — “I however am bound to report that which is
          reported, though I am not bound altogether to believe it; and let this
          saying be considered to hold good as regards every narrative in the
          history.” 같은 절의 앞부분에서는 확실히 말할 수 없다고 적고 아르고스인
          자신이 보고하는 것 외에는 의견을 밝히지 않겠다고 둡니다. Project
          Gutenberg의 Macaulay 영역본 전사본(eBook 2456)으로 7권을 읽었습니다.
          facsimile이 아니므로 쪽수를 적지 않고 권·절 번호까지만 적습니다.
          한국어 서술은 이 글이 옮긴 것이고 공인된 번역이 아닙니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            둘을 가르면 책에 담기는 양이 늘어납니다. 믿는 이야기와 믿지 않는
            이야기가 함께 들어오고 믿지 않는다는 사실도 함께 들어옵니다. 읽는
            쪽이 얻는 것은 확정된 답이 아닙니다. 무엇이 전해졌는지, 그리고
            저자가 그것을 어디까지 받아들였는지, 이 두 가지입니다.
          </p>

          <p className="leading-7">
            판정을 미룬 자리에서 저자가 아무 말도 하지 않은 것은 아닙니다.
            같은 절에서 그는, 모든 사람이 자기가 겪은 나쁜 일을 한곳에 모아
            이웃의 몫과 바꾸려 든다면 이웃이 겪은 일을 자세히 들여다본 뒤에는
            자기가 가져온 몫을 기꺼이 되가져갈 것이라고 적습니다. 그러니 가장
            비열하게 행동한 것이 아르고스인은 아니라는 말을 덧붙입니다. 누가
            가장 나쁜가를 따지는 일과 무엇이 전해졌는가를 적는 일은 서로
            다릅니다. 저자는 두 작업을 한 절 안에서 따로 해 보임으로써 그
            차이를 드러냅니다.
          </p>
        </div>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              두 의무가 갈렸습니다. 남은 것은 그 규칙이 이 한 대목에만
              걸리는지입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="scope" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 그 규칙이 책 전체에 걸린다고 못 박아 두었습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            같은 문장의 뒷부분이 이 글에서 가장 중요한 대목입니다. 저자는 이
            말이 <strong>이 역사의 모든 서술에 대해 유효한 것으로 여겨지게
            하라</strong>고 써 둡니다. 책 전체에 걸리는 규칙으로 선언한
            셈입니다. 아르고스 이야기 한 자리에서 쓴 변명이 아닙니다.
          </p>

          <p className="leading-7">
            범위가 적혀 있으면 독자가 해야 할 일이 달라집니다. 이 책의 어느
            대목을 읽든 그 문장이 저자가 믿는 문장이라고 가정할 수 없습니다.
            저자가 전해지는 말을 옮긴 문장으로 읽는 쪽이 기본값입니다. 그래서
            이 책에서 무엇을 인용할 때는 그 자리에 꼬리표가 붙어 있는지,
            저자가 자기 판단을 따로 적어 두었는지를 먼저 봅니다.
          </p>

          <p className="leading-7">
            이 규칙이 책을 약하게 만드는 듯 보이지만 반대입니다. 규칙이 없으면
            독자는 모든 문장을 저자의 주장으로 읽고, 어긋난 대목을 만나면 책
            전체를 의심하게 됩니다. 규칙이 있으면 어긋난 대목은 당대의 보고가
            갈렸다는 증거로 읽힙니다. <strong>책에서 꺼낼 수 있는 것과 꺼낼 수
            없는 것의 경계가 저자의 선언에 따라 정해집니다.</strong>
          </p>
        </div>

        <ProgressiveDetail
          title="그러면 믿지 않는 이야기를 적는 것이 언제나 좋은 것입니까"
          preview="아닙니다. 꼬리표와 범위 선언이 함께 있을 때만 그렇습니다."
        >
          <p className="leading-7">
            전해지는 것을 다 적되 어느 것이 누구의 말인지 적지 않으면, 독자는
            세 설명을 한 저자의 모순된 서술로 읽게 됩니다. 범위를 적지 않으면
            독자는 어느 대목이 믿어서 적은 것이고 어느 대목이 전해서 적은
            것인지 구별할 수 없습니다. 세 가지가 함께 있어야 쓸 수 있는 기록이
            됩니다. 전해진 것을 다 남기고, 각각에 출처를 붙이고, 그 방식이 책
            전체에 걸린다고 적어 두는 일입니다.
          </p>
          <p className="leading-7">
            1편의 저자는 두 칸의 만듦새를 밝혔고 이 글의 저자는 믿음의 범위를
            밝혔습니다. 두 진술이 담은 것은 사건이 아닌 기록 쪽의 정보입니다.
            그 정보가 있는 사료와 없는 사료는 같은 신뢰를 받을 수 없습니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              이 글의 답은 여기서 닫힙니다. 믿지 않으면서 적은 문장은 저자의
              주장이 아니라 당대에 그런 말이 돌았다는 기록입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          다음은 적은 사람이 그 자리에 있었던 경우입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            지금까지 두 저자는 멀리서 전해진 이야기를 다뤘습니다. 그러면 적은
            사람이 사건의 한복판에 있었다면 어떻게 됩니까. 게다가 한쪽 편에서
            싸웠다가 다른 쪽으로 넘어간 당사자라면 말입니다. 직접 보았다는
            사실은 꼬리표가 필요 없다는 뜻입니까, 아니면 다른 종류의 꼬리표가
            필요하다는 뜻입니까. 다음 글의 질문이 이것입니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 아르고스가 지휘권을 요구한 같은 행동을 두 설명이 어떻게 다르게
            읽습니까. <strong>(답: 부품 1절)</strong>
          </p>

          <p className="leading-7">
            2. 세 설명이 한 저자의 모순된 서술로 읽히지 않는 이유는 무엇입니까.{" "}
            <strong>(답: 부품 2절)</strong>
          </p>

          <p className="leading-7">
            3. 이 책의 한 문장을 인용하려 할 때 먼저 무엇을 확인해야 합니까. <strong>(답: 부품 4절)</strong>
          </p>
        </div>

        <ContentBoundary article="told-but-not-believed" />
      </section>
    </div>
  );
}
