import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import TwoKindsViz from "./speeches-were-reconstructed/viz/TwoKindsViz";
import DivergenceViz from "./speeches-were-reconstructed/viz/DivergenceViz";

/**
 * 연설문은 그가 지어 적은 것이라고 본인이 밝혔습니다
 *
 * 역사 1편. 시리즈의 축은 "지난 일"이 아니라 "어떻게 아는가"다. 1차 자료는
 * 투키디데스 『펠로폰네소스 전쟁사』 1권 22절이고 Crawley 영역본(Project
 * Gutenberg 전사본)으로 읽었다. facsimile이 아니므로 쪽수를 적지 않고 권·절
 * 번호까지만 적는다. 이 절은 저자가 자기 책의 두 칸을 각각 어떻게 만들었는지
 * 밝힌 자리이며, 그 밝힘 자체가 이 글의 내용이다.
 */
export default function SpeechesWereReconstructedArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          책에 실린 연설은 그가 지어 넣은 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            2,400년 전에 쓰인 전쟁사가 있습니다. 그 책에는 장군과 사절이 한
            연설이 길게 실려 있어 읽다 보면 그 사람들이 실제로 그렇게 말한 듯
            느껴집니다. 그런데 저자는 책 앞쪽에 한 문단을 두어 그렇지 않다고
            밝혀 놓았습니다. 말을 한 마디씩 기억에 담아 둘 수 없었습니다.
            그래서 <strong>그 자리에서 요구되었다고 자기가 판단한
            말</strong>을 하게 했습니다.
          </p>

          <p className="leading-7">
            이 문단이 중요한 이유는 고백이어서가 아닙니다. 같은 문단에서
            저자는 사건 쪽은 전혀 다르게 다뤘다고 밝힙니다. 손에 닿는 첫
            이야기에서 가져오지 않았고 자기 인상조차 믿지 않았습니다. 자기가
            본 것과 남이 자기를 위해 본 것을 두고 보고의 정확함을 할 수 있는
            한 엄하게 시험했다고 합니다.
          </p>

          <p className="leading-7">
            <strong>그러면 한 권의 책 안에서 어떤 문장은 재구성이고 어떤
            문장은 교차 확인된 보고입니다. 읽는 쪽은 그 둘을 어떻게
            가릅니까.</strong> 이 시리즈는 지난 일을 다루지 않습니다. 지난
            일을 어떻게 아는지를 다루며 첫 글의 자리가 여기입니다.
          </p>
        </div>

        <TwoKindsViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            짚을 것이 넷입니다. 두 칸이 어떻게 다른지, 연설 칸이 어떻게
            만들어졌는지, 사건 칸이 어떻게 만들어졌는지, 그리고 목격자들이 왜
            서로 다르게 말하는지입니다.
          </p>

          <p className="leading-7">
            <em>
              여기까지만 읽어도 이 글의 자리는 잡힙니다 — 사료는 지난 일이
              아니라 지난 일에 대한 누군가의 기록입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="two-kinds" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 한 책 안에 성격이 다른 두 가지가 들어 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            책을 펼치면 연설과 사건이 번갈아 나옵니다. 활자로는 구분이 없고 둘
            다 똑같이 "적힌 것"으로 보입니다. 인용할 때도 보통 구분하지
            않습니다. 어느 장군이 무엇이라고 말했다고 쓰면 그만입니다.
          </p>

          <p className="leading-7">
            그런데 저자는 두 칸을 만든 방법을 따로 적어 두었습니다. 그러니까
            책에는 세 가지가 들어 있는 셈입니다. 연설, 사건, 그리고{" "}
            <strong>그 둘을 어떻게 만들었는지에 대한 저자의 진술</strong>입니다.
            세 번째가 있다는 사실이 이 책을 다른 사료와 가릅니다.
          </p>

          <p className="leading-7">
            이 글은 그 세 번째를 읽습니다. 저자가 자기 책을 어떻게 만들었다고
            말했는지를 보고, 전쟁이 어떻게 흘러갔는지는 묻지 않습니다. 그
            진술이 남아 있으면 독자는 문장마다 어느 칸에서 왔는지를 물을 수
            있습니다. 남아 있지 않으면 물을 수 없습니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 책, 두 칸"
          description="활자로는 같아 보이지만 만들어진 방법이 다릅니다."
          items={[
            {
              term: "연설 칸",
              description:
                "사람들이 한 말로 적혀 있지만, 저자가 그 자리에 요구되었다고 판단한 말로 다시 쓴 것입니다.",
              example:
                "장군이 출정 전에 병사들에게 한 연설이 길게 실려 있습니다. 전체 뜻은 맞추려 했다고 적혀 있습니다.",
              boundary:
                "저자의 판단이 섞여 있으므로, 이 칸의 문장을 그 사람이 한 말로 인용하면 안 됩니다.",
            },
            {
              term: "사건 칸",
              description:
                "일어난 일로 적혀 있고, 두 출처를 두고 정확함을 시험한 것입니다.",
              example:
                "어느 해에 어느 도시가 포위되었고 얼마 뒤 함락되었다는 서술입니다.",
              boundary:
                "시험을 거쳤다는 것이 틀림이 없다는 뜻은 아닙니다. 다음 부품의 두 어긋남이 여기에도 남습니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>두 칸이 있다는 사실은 이 절에서 잡혔습니다. 다음 두 부품은 각
            칸의 만듦새입니다.</em>
          </p>
        </div>
      </section>

      <section id="speeches" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 연설은 기억으로 옮길 수 없어 다시 쓴 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            저자는 연설의 출처부터 둘로 나눕니다. 어떤 연설은 전쟁이 시작되기
            전에, 어떤 연설은 전쟁 중에 있었고, 어떤 것은 자기가 직접 들었고
            어떤 것은 여러 곳에서 얻었습니다. 녹음도 속기도 없던 시절이므로 둘
            다 사람의 기억을 거칩니다.
          </p>

          <p className="leading-7">
            그다음이 핵심입니다. 어느 경우에든 말을 한 마디씩 기억에 담아
            두기는 어려웠습니다. 그래서 자기 버릇은 <strong>그 자리들이 말하는
            이에게 요구했다고 자기가 판단한 것</strong>을 말하게 하는
            쪽이었다고 적어 둡니다. 다만 실제로 한 말의 전체 뜻에는 할 수 있는
            한 가깝게 붙였다고 덧붙입니다.
          </p>

          <p className="leading-7">
            이 한 문장에 두 가지가 동시에 들어 있습니다. 연설은 저자의
            작문입니다. 그러면서 아무렇게나 지은 글이 아니라 <strong>두 가지
            제약을 걸고 지었다</strong>고 밝혀 둡니다. 제약은 그 자리의 요구와
            실제로 한 말의 전체 뜻입니다. 둘 다 저자의 판단을 거치므로 독자가
            그 판단을 검증할 수는 없습니다.
          </p>
        </div>

        <CitationBlock
          source="투키디데스, 『펠로폰네소스 전쟁사』 1권 22절 · Richard Crawley 영역"
          citeKey={1}
          href="https://www.gutenberg.org/ebooks/7142"
        >
          원문은 이렇습니다 — “With reference to the speeches in this history,
          some were delivered before the war began, others while it was going
          on; some I heard myself, others I got from various quarters; it was in
          all cases difficult to carry them word for word in one’s memory, so my
          habit has been to make the speakers say what was in my opinion
          demanded of them by the various occasions, of course adhering as
          closely as possible to the general sense of what they really said.”
          Project Gutenberg의 Crawley 영역본 전사본(eBook 7142)으로 1권을
          읽었습니다. facsimile이 아니라 전사본이므로 쪽수를 적지 않고 권·절
          번호까지만 적습니다. 한국어 서술은 이 글이 옮긴 것이고 공인된 번역이
          아닙니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              연설 칸의 만듦새는 여기까지입니다. 사건 칸은 전혀 다릅니다.
            </em>
          </p>
        </div>
      </section>

      <section id="events" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 사건은 자기 인상조차 믿지 않고 시험한 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            같은 문단의 뒷부분은 방법이 반대입니다. 저자는 사건의 서술을 손에
            닿는 첫 출처에서 가져오는 것을 스스로에게 허락하지 않았고, <strong>자기 자신의 인상조차 믿지 않았다</strong>고 써 둡니다.
            대신 자기가 본 것과 남이 자기를 위해 본 것에 기대되, 보고의
            정확함을 할 수 있는 한 엄하고 자세하게 시험했다고 합니다.
          </p>
        </div>

        <AlgorithmBlock
          title="저자가 적어 둔 사건 서술의 절차"
          input={[
            "자기가 직접 본 것",
            "남이 자기를 위해 본 것",
            "떠도는 이야기",
          ]}
          steps={[
            {
              code: "손에 닿는 첫 출처를 그대로 쓰지 않는다",
              note: "떠도는 이야기를 그대로 옮기는 것을 스스로 금지합니다. 이 금지가 없으면 아래 단계가 작동하지 않습니다.",
            },
            {
              code: "자기 인상도 하나의 보고로 취급한다",
              note: "직접 본 것이라고 바로 쓰지 않습니다. 본인의 기억도 다른 증언과 같은 자리에 두고 다룹니다.",
            },
            {
              code: "두 출처의 보고를 서로 대어 본다",
              note: "맞지 않는 곳이 나오면 거기서 품이 듭니다. 저자는 그 어긋남 때문에 결론을 내는 데 수고가 들었다고 적습니다.",
            },
          ]}
          output="시험을 거친 서술 한 줄 — 다만 어긋남의 두 원인은 그대로 남음"
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            여기서 한 가지를 분명히 해야 합니다. 시험을 거쳤다고 해서 틀림이
            없다는 뜻은 아닙니다. 저자 자신이 바로 다음 문장에서 그 시험이 왜
            어려웠는지를 짚습니다. 그 이유가 이 글의 마지막 부품입니다.
          </p>

          <p className="leading-7">
            <em>
              두 칸의 만듦새가 모두 나왔습니다. 남은 것은 시험이 어려운 이유입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="why-they-diverge" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 목격자들이 갈리는 이유가 두 가지로 적혀 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            저자는 같은 일에 대한 목격자들의 말이 서로 맞지 않아 결론을 내는
            데 품이 들었다고 적고, 그 어긋남의 이유를 둘로 나눕니다. 기억이
            온전하지 않아서, 그리고 한쪽을 지나치게 편들어서입니다.
          </p>
        </div>

        <DivergenceViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            둘을 나란히 적어 둔 대목이 중요합니다. 두 어긋남은 성질이 다르기
            때문입니다. 기억이 흐려 생기는 어긋남은 방향에 규칙이 없어서 여러
            사람의 말을 모으면 줄어듭니다. 편들어 생기는 어긋남은 방향에
            규칙이 있어서 <strong>모을수록 더 확실한 오답이 됩니다.</strong>
          </p>

          <p className="leading-7">
            그래서 증언이 많다는 사실만으로는 안심할 수 없습니다. 많은 증언이
            한쪽으로 쏠려 있을 때, 그 쏠림이 그 일이 실제로 그랬기 때문인지
            증언한 사람들이 모두 같은 편이었기 때문인지를 따로 물어야 합니다.
            이 물음은 증언의 수로는 답할 수 없고 증언한 사람이 어디에 서
            있었는지로 답합니다.
          </p>
        </div>

        <ProgressiveDetail
          title="그러면 이 책은 믿을 수 없는 것입니까"
          preview="반대입니다. 믿을 수 있는 범위를 저자가 직접 적어 두었다는 것이 이 책의 강점입니다."
        >
          <p className="leading-7">
            대부분의 사료에는 이런 진술이 없습니다. 어떻게 만들어졌는지 적혀
            있지 않으면 읽는 쪽이 추측해야 하고, 추측은 검증되지 않습니다. 이
            책에서는 연설이 재구성이고 사건이 교차 확인을 거쳤다고 저자가 밝혀
            두었습니다. 그래서 읽는 쪽은 문장마다 신뢰의 근거를 다르게 잡을 수
            있습니다.
          </p>
          <p className="leading-7">
            이 시리즈가 사료를 다루는 방식이 여기서 정해집니다. 사료가 무엇을
            말하는지보다 그 사료가 어떻게 만들어졌는지를 먼저 묻습니다.
            만들어진 방법이 적혀 있지 않으면 그 사실 자체를 결론의 범위에
            적습니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>이 글의 답은 여기서 끝납니다. 한 책 안에 만들어진 방법이 다른
            두 칸이 있고, 그 구분은 저자가 적어 두었습니다.</em>
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          다음은 믿지 않으면서 적는 경우입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글의 저자는 두 칸을 나누고 각각의 만듦새를 밝혔습니다. 그런데
            같은 시대의 다른 역사가는 더 멀리 갑니다. 들은 것을 적을 의무는
            있지만 그것을 믿을 의무는 없다고 씁니다. 그러고는 그 말이 자기
            책의 모든 이야기에 해당한다고 덧붙입니다.
          </p>

          <p className="leading-7">
            적은 사람이 스스로 믿지 않는 이야기가 책에 실려 있다면 그것은
            무엇을 뜻합니까. 읽는 쪽은 그런 문장을 어떻게 다뤄야 합니까. 다음
            글이 그 자리입니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 이 책에 실린 어느 장군의 연설을 인용해 "그가 이렇게 말했다"고 쓰면
            무엇이 잘못됩니까. <strong>(답: 부품 2절)</strong>
          </p>

          <p className="leading-7">
            2. 같은 사건에 대한 증언을 열 개 모았더니 모두 한쪽으로 쏠려
            있습니다. 안심해도 됩니까. <strong>(답: 부품 4절)</strong>
          </p>

          <p className="leading-7">
            3. 저자가 자기 방법을 적어 두지 않은 사료는 이 글의 기준에서 어떻게
            다뤄야 합니까. <strong>(답: 부품 4절)</strong>
          </p>
        </div>

        <ContentBoundary article="speeches-were-reconstructed" />
      </section>
    </div>
  );
}
