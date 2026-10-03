import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import PresenceIsNotEnoughViz from "./the-writer-was-there/viz/PresenceIsNotEnoughViz";
import SplitTheTextViz from "./the-writer-was-there/viz/SplitTheTextViz";

/**
 * 한쪽에서 싸운 사람이 적은 기록을 읽는 법
 *
 * 역사 3편. 1편은 저자가 두 칸을 나눠 만든 경우, 2편은 저자가 믿음의 범위를
 * 선언한 경우였다. 이 글은 저자가 사건의 당사자이고 한쪽 편에서 싸웠던 경우를
 * 본다. 1차 자료는 요세푸스 『유대 전쟁사』 서문이고 Whiston 영역본(Project
 * Gutenberg eBook 2850) 전사본으로 읽었다. facsimile이 아니므로 쪽수를 적지
 * 않고 서문의 절 번호까지만 적는다.
 */
export default function TheWriterWasThereArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          적은 사람이 한쪽에서 싸운 당사자였습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            유대와 로마의 전쟁을 일곱 권으로 적은 사람은 그 전쟁의 당사자였습니다.
            그는 처음에 로마와 맞서 싸웠고, 그 뒤에 벌어진 일에는{" "}
            <strong>있도록 강제되었다</strong>고 적습니다. 한쪽 편에서 싸우다
            반대쪽 진영에 있게 된 사람이 쓴 전쟁사인 셈입니다.
          </p>

          <p className="leading-7">
            직접 보았다는 것은 보통 기록의 강점으로 꼽힙니다. 그런데 이 저자는
            서문의 첫 문단에서 그 자리에 있던 자들도 거짓된 서술을 했다고 적고,
            그 까닭을 로마에 아첨하는 기분이거나 유대인을 미워하는 마음이라고
            둡니다. 자기 글의 가장 큰 자산이 될 수 있는 것을 스스로 깎아 놓은
            것입니다.
          </p>

          <p className="leading-7">
            <strong>
              그러면 자리에 있었던 당사자는 자기 기록이 읽힐 수 있게 하기 위해
              무엇을 더 적어야 합니까.
            </strong>{" "}
            <Link to="/history/testimony/speeches-were-reconstructed">1편</Link>은
            저자가 두 칸을 나눠 만든 경우였고{" "}
            <Link to="/history/testimony/told-but-not-believed">2편</Link>은
            저자가 믿음의 범위를 선언한 경우였습니다. 이 글은 저자가 자기
            치우침을 먼저 적어 두는 경우입니다.
          </p>
        </div>

        <PresenceIsNotEnoughViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            다섯 부품입니다. 자리에 있었다는 것이 왜 부족한지, 저자가 자기 자리를
            어떻게 적었는지, 사실과 애도를 나눠 읽으라는 요청이 무엇을 바꾸는지,
            적장을 증인으로 세운 대목을 어떻게 볼지, 그리고 겪은 사람을 독자로
            두는 것이 어떤 장치인지입니다.
          </p>

          <p className="leading-7">
            <em>
              이 절까지만 읽어도 하나는 남습니다. 목격은 신뢰의 근거가 아니라
              따져야 할 조건입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="not-enough" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 없던 사람도 있던 사람도 각각 다르게 실패합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            서문의 첫 문단은 당대에 나온 다른 기록들을 두 묶음으로 가릅니다. 한
            묶음은 그 일에 관여하지 않은 사람들이 쓴 것입니다. 저자는 그들이 들은
            말을 모아 헛되고 서로 어긋나는 이야기를 만들고 그것을 말재주로 적어
            냈다고 적습니다. 다른 묶음은 그 자리에 있던 사람들이 쓴 것인데, 이쪽도
            거짓된 서술을 했다고 적습니다.
          </p>

          <p className="leading-7">
            두 실패의 원인이 다릅니다. 앞쪽은 보지 못한 것이 원인이고, 뒤쪽은 보고
            나서 자기 처지에 맞게 적은 것이 원인입니다. 저자는 뒤쪽의 동기를 둘로
            적습니다. 로마에 아첨하는 기분과 유대인을 미워하는 마음입니다. 그래서
            그들의 글에는 고발이 들어 있기도 하고 찬사가 들어 있기도 하지만{" "}
            <strong>사실의 정확한 진실은 어디에도 없다</strong>고 둡니다.
          </p>

          <p className="leading-7">
            이 구분이 이 글 전체의 출발점입니다. 목격이 신뢰를 주는 것이라면 두
            번째 묶음은 실패할 수 없었을 것입니다. 실패했으니 목격은 신뢰의 근거가
            아니고, 목격자가 어디에 서 있었는지가 따로 물어야 할 것으로 남습니다.
          </p>
        </div>

        <TermBreakdown
          title="두 묶음의 실패"
          description="원인이 다르므로 고치는 방법도 다릅니다."
          items={[
            {
              term: "관여하지 않은 사람의 실패",
              description:
                "들은 말을 모아 적었고, 그래서 이야기들이 서로 어긋난 채로 한 책에 들어갔습니다.",
              example:
                "저자는 그들이 그것을 말재주로 적어 냈다고 적습니다. 글이 매끄러운 것과 사실이 맞는 것은 별개입니다.",
              boundary:
                "이 실패는 자리에 가면 줄어듭니다. 그래서 목격이 쓸모가 없다는 뜻은 아닙니다.",
            },
            {
              term: "자리에 있던 사람의 실패",
              description:
                "보고 나서 자기 처지에 맞게 적었습니다. 저자는 그 동기를 아첨과 증오로 적습니다.",
              example:
                "그들의 글에는 고발과 찬사가 번갈아 들어 있고 사실의 정확한 진실은 어디에도 없다고 합니다.",
              boundary:
                "이 실패는 자리에 가도 줄지 않습니다. 줄이려면 다른 장치가 필요하고, 그 장치가 이 글의 나머지 부품입니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              두 실패가 갈렸습니다. 두 번째 실패를 줄이기 위해 저자가 가장 먼저
              한 일이 다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="own-position" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 자기가 어느 편에 있었는지를 글머리에 적습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            두 실패를 적은 바로 다음 줄에서 저자는 자기를 소개합니다. 마티아스의
            아들 요셉, 태생이 히브리인이고 제사장이며, 처음에는 자기도 로마와 맞서
            싸웠고 그 뒤에 벌어진 일에는 있도록 강제되었다는 것입니다. 이름과
            혈통과 신분과 전쟁에서의 자리가 한 문장에 함께 들어 있습니다.
          </p>

          <p className="leading-7">
            이 소개가 하는 일은 자기 자격을 내세우는 것이 아닙니다. 바로 앞에서
            아첨과 증오를 실패의 원인으로 적었으므로, 자기가 양쪽을 다 거쳤다는
            말은 <strong>자기에게도 그 두 동기가 걸릴 수 있다는 것을 독자에게
            먼저 알려 주는 것</strong>이 됩니다. 제사장이라는 신분과 맞서 싸웠다는
            사실은 유대 쪽으로, 그 뒤 로마 진영에 있었다는 사실은 로마 쪽으로
            치우칠 자리입니다.
          </p>

          <p className="leading-7">
            2편의 저자가 각 서술에 누구의 말인지를 붙였다면 여기서는{" "}
            <strong>저자 자신에게 꼬리표가 붙습니다.</strong> 꼬리표가 붙은 쪽이
            보고가 아니라 저자이므로, 독자는 모든 문장에 같은 의심을 균일하게
            걸지 않고 주장의 방향에 따라 다르게 걸 수 있습니다. 로마에 유리한
            주장과 유대에 유리한 주장이 같은 무게를 갖지 않는다는 뜻입니다.
          </p>
        </div>

        <CitationBlock
          source="요세푸스, 『유대 전쟁사』 서문 1절 · William Whiston 영역"
          citeKey={1}
          href="https://www.gutenberg.org/ebooks/2850"
        >
          원문은 이렇습니다 — “while those that were there present have given
          false accounts of things, and this either out of a humor of flattery to
          the Romans, or of hatred towards the Jews… Joseph, the son of
          Matthias, by birth a Hebrew, a priest also, and one who at first
          fought against the Romans myself, and was forced to be present at what
          was done afterwards, [am the author of this work].” 대괄호 안은
          영역자가 보충한 부분입니다. Project Gutenberg의 Whiston 영역본
          전사본(eBook 2850)으로 서문 전체를 읽었습니다. facsimile이 아니므로
          쪽수를 적지 않고 서문의 절 번호까지만 적습니다. 한국어 서술은 이 글이
          옮긴 것이고 공인된 번역이 아닙니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              치우침의 자리를 알렸습니다. 그것만으로는 글을 읽을 수 없으므로
              다음 부품의 요청이 따라옵니다.
            </em>
          </p>
        </div>
      </section>

      <section id="split" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 사실과 애도를 나눠 읽으라고 독자에게 요청합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            서문 4절에서 저자는 양쪽을 다 정확히 다루겠다고 적으면서도, 자기가
            겪고 있는 감정에 말을 맞출 것이고 자기 나라가 겪은 비참에 대해 얼마간
            탄식하는 것은 허락되어야 한다고 적습니다. 그러고는 자기를 끝까지
            비난하려는 사람이 있다면 <strong>사실은 역사 부분으로 돌리고 탄식은
            글쓴이 자신에게만 돌리라</strong>고 요청합니다.
          </p>
        </div>

        <SplitTheTextViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            1편의 저자는 두 칸을 자기가 나눠 만들었습니다. 여기서는 나누는 일이
            독자에게 넘어옵니다. 한 문장이 사실 서술인지 탄식인지는 저자가
            표시해 주지 않으므로 독자가 가려야 하고, 가릴 수 있으려면 저자가 그런
            것이 섞여 있다고 미리 말해 두어야 합니다. 요청이 작동하는 조건은{" "}
            <strong>섞였다는 사실의 공개</strong>입니다.
          </p>

          <p className="leading-7">
            이 방식에는 약점이 있습니다. 나누는 기준을 저자가 주지 않았으므로
            어느 문장이 어느 칸인지에 대한 판단이 독자마다 달라집니다. 2편에서
            본 꼬리표가 문장마다 붙어 있던 것과 비교하면 여기서는 경계가 흐립니다.
            그래서 이 요청만으로는 부족하고, 저자는 글 바깥에 댈 것을 따로
            내놓습니다.
          </p>

          <p className="leading-7">
            <em>
              나눠 읽기의 조건과 한계가 나왔습니다. 바깥에 댄 것 둘이 남은 두
              부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="hostile-witness" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 자기 나라를 망친 책임을 적을 때 적장을 증인으로 세웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            같은 4절에 무거운 주장이 하나 있습니다. 자기 나라를 망친 것은 자기들
            안의 난동하는 기질이었고, 로마의 힘을 끌어온 것은 유대인 가운데
            폭군들이었으며, 로마는 마음에 없이 공격해 왔다는 것입니다. 성전을 불에
            타게 한 것도 그 폭군들 탓으로 돌립니다.
          </p>

          <p className="leading-7">
            이 주장에 저자는 증인을 댑니다. 그 성을 무너뜨린 티투스 카이사르가
            바로 증인이라는 것입니다. 전쟁 내내 그가 난동하는 자들에게 억눌린
            백성을 불쌍히 여겼고, 성을 치는 일을 스스로 자주 늦추어 그 일을
            꾸민 자들에게 회개할 틈을 주려 했다고 적습니다.
          </p>

          <p className="leading-7">
            증인으로 적국의 사령관을 세우는 것은 생각해 볼 만한 선택입니다. 자기
            편의 증언이면 같은 편의 말이라 깎이지만, 적의 사령관이 같은 말을 한다면
            그 말은 자기 편에게 유리하자고 한 말이 아니게 됩니다. 2편에서 본
            쏠림의 문제를 피하는 방식입니다.
          </p>

          <ProgressiveDetail
            title="그러면 이 증언은 깎이지 않는 것입니까"
            preview="증인이 누구에게 유리한지를 함께 보면 다시 걸립니다. 이 판단은 이 글이 더한 것입니다."
          >
            <p className="leading-7">
              이 주장이 하는 일을 방향으로 보면, 전쟁의 책임을 로마에서 유대
              내부의 폭군들로 옮깁니다. 그 방향은 로마 쪽에 유리하고, 저자는
              서문을 쓰던 때 로마 진영에 있었습니다. 그러면 티투스가 증인이라는
              것은 적대 증인을 세운 것이 아니라 <strong>이해가 같은 쪽을
              세운 것</strong>일 수도 있습니다. 적장이라는 사실만으로 그 증언을
              적대 증언으로 셀 수 없다는 뜻입니다.
            </p>
            <p className="leading-7">
              이 판단은 저자가 적어 둔 것이 아니라 이 글이 더한 읽기입니다. 저자가
              적은 것은 자기가 양쪽을 거쳤다는 것, 책임이 내부에 있다는 주장, 그
              주장의 증인이 티투스라는 것까지입니다. 그 셋을 나란히 놓고 방향을
              보는 일은 독자의 몫이며, 저자가 2절에서 자기 자리를 먼저 밝혀 둔
              덕분에 독자가 그 일을 할 수 있습니다.
            </p>
            <p className="leading-7">
              그러므로 이 대목에서 쓸 수 있는 결론은 두 겹입니다. 하나는 그런
              주장이 그 자리에서 제기되었고 그 근거로 티투스가 거론되었다는 것이고,
              다른 하나는 그 주장의 방향이 저자의 당시 처지와 같은 쪽이었다는
              것입니다. 둘은 서로를 부정하지 않고 함께 적을 수 있습니다.
            </p>
          </ProgressiveDetail>
        </div>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              바깥에 댄 첫 번째 것이 증인이었습니다. 두 번째는 사람이 아니라
              독자의 구성입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="audience" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 그 전쟁을 겪은 사람들을 독자로 두었습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            서문 8절에서 저자는 자기가 일이 벌어지는 것을 보았거나 그 안에서 겪은
            대로 정확하게 적겠다고 하고, 자기가 몸으로 겪은 재난도 하나 감추지
            않겠다고 적습니다. 그 까닭을 함께 둡니다. <strong>그것들의 진실을
            아는 사람들에게 이야기할 것이기 때문</strong>이라는 것입니다.
          </p>

          <p className="leading-7">
            서문을 닫는 12절에서도 같은 장치를 다시 적습니다. 일곱 권에 모든 것을
            담았고 이 전쟁을 겪어 아는 사람들에게 불평하거나 고발할 거리를 남기지
            않았다는 것입니다. 거짓을 적으면 걸릴 상대를 독자로 두었다는 뜻이고,
            걸릴 상대가 있다는 사실 자체가 글에 걸리는 제약이 됩니다.
          </p>
        </div>

        <AlgorithmBlock
          title="당사자가 쓴 기록에 저자가 걸어 둔 네 장치"
          input={[
            "저자가 사건의 당사자이고 한쪽 편에서 싸웠다",
            "목격은 신뢰를 주지 않는다",
          ]}
          steps={[
            {
              code: "자기 이름·혈통·신분·전쟁에서의 자리를 글머리에 적는다",
              note: "아첨과 증오를 실패 원인으로 적은 바로 뒤에 두어, 자기에게도 그 동기가 걸릴 수 있음을 독자가 알게 합니다.",
            },
            {
              code: "사실과 애도가 섞여 있다고 공개하고 나눠 읽기를 요청한다",
              note: "나누는 일은 독자에게 넘어가므로 경계가 흐려지지만, 섞였다는 사실이 공개되어 사실 서술이 애도와 함께 깎이지 않습니다.",
            },
            {
              code: "자기 편에 불리하지 않은 방향의 주장에 외부 증인을 댄다",
              note: "같은 편의 증언은 쏠림을 의심받으므로 적장의 증언을 댑니다. 그 증인의 이해가 저자와 같은 쪽인지는 독자가 따로 봅니다.",
            },
            {
              code: "그 일을 겪어 아는 사람들을 독자로 둔다",
              note: "거짓을 적으면 걸릴 상대가 있다는 제약을 글 바깥에 둡니다. 저자가 자기 재난을 감추지 않겠다고 한 근거이기도 합니다.",
            },
          ]}
          output="치우침이 공개된 당사자 기록 — 믿을 범위가 주장의 방향에 따라 달라짐"
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            네 장치를 함께 보면 이 서문이 하는 일이 드러납니다. 당사자의 기록을
            믿게 만드는 것이 아니라, 어느 부분을 어느 정도 믿어야 하는지를
            독자가 정할 수 있게 재료를 내놓는 것입니다. 목격은 그 재료 가운데
            하나일 뿐이고 혼자서는 아무것도 보증하지 않습니다.
          </p>

          <p className="leading-7">
            <em>
              이 글의 답은 여기서 닫힙니다. 당사자의 기록은 치우침이 없어서가
              아니라 치우침이 적혀 있어서 쓸 수 있습니다.
            </em>
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">다음은 사료에 적힌 숫자입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            세 저자가 각각 자기 방법을 적어 두었고, 우리는 그 진술을 읽어 글의
            신뢰 범위를 잡는 법을 세웠습니다. 그런데 사료에는 서술만 있는 것이
            아니라 숫자도 적혀 있습니다. 군대가 몇 명이었고 은 몇 세켈을 물렸다는
            식입니다.
          </p>

          <p className="leading-7">
            숫자는 서술과 달리 꼬리표가 붙지 않은 채로 전해지는 일이 많고, 읽는
            쪽은 그것을 센 결과로 받아들이기 쉽습니다. 다음 분류는 그 숫자가
            어떻게 만들어졌는지를 묻습니다. 첫 글은 170만이라는 수가 어떤 절차로
            나왔는지가 사료에 적혀 있는 드문 경우를 봅니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 자리에 있던 사람들의 실패가 자리에 없던 사람들의 실패와 어떻게
            다릅니까. <strong>(답: 부품 1절)</strong>
          </p>

          <p className="leading-7">
            2. 저자가 자기 이름과 전쟁에서의 자리를 글머리에 적은 것이 독자의
            읽기를 어떻게 바꿉니까. <strong>(답: 부품 2절)</strong>
          </p>

          <p className="leading-7">
            3. 티투스를 증인으로 세운 대목에서 쓸 수 있는 결론을 두 겹으로 적어
            보세요. <strong>(답: 부품 4절)</strong>
          </p>
        </div>

        <ContentBoundary article="the-writer-was-there" />
      </section>
    </div>
  );
}
