import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import TwoRuinsViz from "./ruins-mislead/viz/TwoRuinsViz";
import AverageShipViz from "./ruins-mislead/viz/AverageShipViz";

/**
 * 폐허는 두 방향으로 잘못 말합니다
 *
 * 역사 7편, 세 번째 분류의 첫 글. 남아 있는 것을 어떻게 읽을지가 아니라
 * 남는 과정 자체가 만드는 치우침을 본다. 1차 자료는 투키디데스
 * 『펠로폰네소스 전쟁사』 1권 10절이고 Crawley 영역본(Project Gutenberg
 * eBook 7142) 전사본으로 읽었다.
 */
export default function RuinsMisleadArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          두 도시가 같은 폐허가 되면 뒷사람은 반대 방향으로 틀립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 두 분류는 손에 들어온 기록을 어떻게 읽을지를 물었습니다. 그런데
            손에 들어온 쪽이 그 시대가 남긴 전부는 아닙니다. 남는 과정 자체가
            한쪽으로 기울어 있다면 <strong>기록을 아무리 정확하게 읽어도 그
            기울기만큼 틀립니다.</strong>
          </p>

          <p className="leading-7">
            2,400년 전의 저자가 이 문제를 사고실험으로 적어 두었습니다.
            라케다이몬이 사람 없는 땅이 되고 신전과 공공 건물의 기초만
            남는다면 뒷사람은 그 명성을 그 힘의 참된 표현으로 받아들이기를
            몹시 꺼릴 것이라고 합니다. 그 도시는 펠로폰네소스의 5분의 2를
            차지하고 전체를 이끄는데도 성읍이 촘촘히 지어지지 않고 옛 방식대로
            마을이 모여 있을 뿐이기 때문입니다.
          </p>

          <p className="leading-7">
            이어서 반대쪽을 둡니다. 아테네가 같은 재난을 겪는다면 눈에 보이는
            것에서 미루어 그 힘을 실제의 두 배로 볼 것이라고 덧붙입니다. <strong>같은 재난, 같은 읽기인데 오해의 방향이 반대라면 무엇을
            고쳐야 합니까.</strong>
          </p>
        </div>

        <TwoRuinsViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            짚을 것이 넷입니다. 두 도시의 사정이 어떻게 다른지, 남는 것이 왜
            치우치는지, 저자가 세운 규칙이 무엇인지, 그 규칙을 저자 자신이
            어디에 썼는지입니다.
          </p>

          <p className="leading-7">
            <em>여기서 멈춰도 하나는 남습니다. 남아 있는 것을 그 시대의
            표본이라고 가정할 수 없습니다.</em>
          </p>
        </div>
      </section>

      <section id="two-cities" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 힘은 생김새를 따르지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            저자가 든 두 도시는 당대의 사정이 분명히 다릅니다. 라케다이몬은
            땅의 5분의 2를 차지하고 바깥의 많은 동맹을 거느리며 전체를
            이끕니다. 그런데도 도시는 한곳에 촘촘히 지어지지 않았고 웅장한
            신전이나 공공 건물로 꾸며지지도 않았습니다. 옛 헬라스의 방식대로
            마을들이 모여 있을 뿐입니다.
          </p>

          <p className="leading-7">
            아테네는 반대입니다. 눈에 들어오는 것이 커서 그 겉모습에서 미루면
            힘이 실제보다 커 보입니다. 두 도시를 나란히 두면 <strong>겉모습과
            힘 사이에 고정된 관계가 없다</strong>는 사실이 드러납니다. 관계가
            고정되어 있지 않으므로 하나에서 다른 하나를 읽어 낼 수 없습니다.
          </p>

          <p className="leading-7">
            이 사고실험이 쓸모 있는 까닭은 두 도시가 모두 저자의 당대에 있었고
            저자가 겉모습과 힘을 둘 다 알았기 때문입니다. 뒷사람은 겉모습만
            보게 되고 힘은 추정해야 합니다. 그러니까 저자는 답을 아는 문제를
            하나 만들어 두고 거기서 나올 오답을 미리 계산해 본 셈입니다.
          </p>
        </div>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>두 도시의 사정이 갈렸습니다. 다음 부품에서는 오해가 어디서
            들어오는지를 봅니다.</em>
          </p>
        </div>
      </section>

      <section id="what-remains" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 남는 것이 종류를 가려서 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            같은 재난을 겪어도 남는 것이 다릅니다. 저자가 남는다고 꼽은 것은
            신전과 공공 건물의 기초입니다. 돌로 크게 지은 것은 기초가 남고
            흩어진 마을과 거기 살던 사람의 수와 바깥의 동맹은 남지 않습니다.
          </p>

          <p className="leading-7">
            그래서 오해의 방향이 도시마다 정해집니다. 돌로 크게 지은 쪽은 <strong>남는 것이 힘의 표시와 닮아 있어</strong> 과대평가되고
            흩어져 사는 쪽은 남는 것이 적어 과소평가됩니다. 오차는 추정하는
            사람의 게으름에서 오지 않고 자료 쪽에서 들어옵니다.
          </p>
        </div>

        <TermBreakdown
          title="남는 것과 남지 않는 것"
          description="재난이 같아도 걸러지는 종류가 정해져 있습니다."
          items={[
            {
              term: "남는 것",
              description:
                "돌로 크게 지은 신전과 공공 건물의 기초입니다. 저자가 직접 적은 항목입니다.",
              example:
                "뒷사람은 이것을 보고 그 도시의 크기와 힘을 가늠하게 됩니다.",
              boundary:
                "기초가 남았다고 해서 그 건물이 그 도시의 힘에서 차지하던 몫까지 남는 것은 아닙니다.",
            },
            {
              term: "남지 않는 것",
              description:
                "흩어진 마을의 규모, 사람의 수, 이끌던 동맹처럼 돌로 지어지지 않은 것입니다.",
              example:
                "라케다이몬이 땅의 5분의 2를 차지하고 전체를 이끌었다는 사실은 폐허에서 나오지 않습니다.",
              boundary:
                "남지 않는 것의 목록은 사회마다 다릅니다. 이 사고실험은 돌 건축이 힘의 표시이던 경우의 것입니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>오차가 자료 쪽에서 온다는 데까지 잡혔습니다. 다음 부품은
            추정하는 쪽이 무엇을 바꿔야 하는지입니다.</em>
          </p>
        </div>
      </section>

      <section id="the-rule" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 겉모습을 보되 힘을 따로 따지라는 규칙입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            저자가 이 사고실험에서 끌어낸 결론은 짧습니다. 그러므로 우리는
            의심할 권리가 없고 도시의 힘을 따지는 일을 빼놓은 채 성읍을
            살펴보는 것으로 만족해서도 안 된다고 짚습니다. 앞 구절은
            미케나이가 작아 보인다고 해서 시인과 전승이 전하는 원정의 규모를
            물리치면 안 된다는 말을 받습니다. 뒤 구절은 그 반대쪽을 막습니다.
          </p>

          <p className="leading-7">
            규칙의 모양을 보면 두 방향을 모두 막습니다. 작아 보인다고 깎지 말
            것, 커 보인다고 그대로 받지 말 것입니다. 하나의 방향으로만
            보정하는 규칙이었다면 반대쪽 도시에서 더 크게 틀렸을 것입니다. <strong>규칙이 양쪽을 막는 까닭은 오차의 원인이 자료의
            치우침이라고 먼저 짚었기 때문</strong>입니다.
          </p>
        </div>

        <CitationBlock
          source="투키디데스, 『펠로폰네소스 전쟁사』 1권 10절 · Richard Crawley 영역"
          citeKey={1}
          href="https://www.gutenberg.org/ebooks/7142"
        >
          원문은 이렇습니다 — “For I suppose if Lacedaemon were to become
          desolate, and the temples and the foundations of the public buildings
          were left, that as time went on there would be a strong disposition
          with posterity to refuse to accept her fame as a true exponent of her
          power. … Whereas, if Athens were to suffer the same misfortune, I
          suppose that any inference from the appearance presented to the eye
          would make her power to have been twice as great as it is. We have
          therefore no right to be sceptical, nor to content ourselves with an
          inspection of a town to the exclusion of a consideration of its
          power.” Project Gutenberg의 Crawley 영역본 전사본(eBook 7142)으로
          1권을 읽었습니다. facsimile이 아니므로 쪽수를 적지 않고 권·절 번호까지만
          적습니다. 한국어 서술은 이 글이 옮긴 것이고 공인된 번역이 아닙니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>규칙이 나왔습니다. 저자가 그 규칙을 실제로 어디에 썼는지를
            보면 규칙의 쓰임이 분명해집니다.</em>
          </p>
        </div>
      </section>

      <section id="using-the-rule" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 같은 규칙으로 전해지는 수를 내려 잡습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            규칙을 적은 바로 다음에 저자는 그것을 씁니다. 대상은 트로이아로 간
            함대의 규모이고 자료는 시인이 남긴 수뿐입니다. 배는 1,200척이고
            보이오티아 배는 한 척에 120명, 필록테테스의 배는 50명이라고 적혀
            있습니다. 다른 배의 인원은 목록 어디에도 없습니다.
          </p>
        </div>

        <AverageShipViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            여기서 저자가 한 일이 눈여겨볼 만합니다. 다른 배의 인원이 적혀
            있지 않은 자리를 자료의 공백으로 두지 않고 <strong>시인이 그 둘로
            가장 많은 쪽과 가장 적은 쪽을 나타내려 했다는 단서로
            읽습니다.</strong> 그러고는 가장 큰 배와 가장 작은 배의 평균을
            잡으면 건너간 사람의 수가 대단치 않게 보인다고 적습니다.
          </p>

          <p className="leading-7">
            결론의 방향이 앞 절과 반대라는 점이 중요합니다. 폐허를 보고 작게
            보지 말라던 저자가 전해지는 수는 그대로 받지 않고 내려 잡습니다.
            그러니까 규칙은 크게 보라는 것도 작게 보라는 것도 아니고 <strong>자료가 어느 쪽으로 기울어 있는지를 먼저 보라는
            것</strong>입니다. 폐허는 흩어져 사는 쪽을 깎아 내리고 시인의 수는
            부풀리는 쪽으로 기울어 있습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="저자가 같은 자리에서 쓴 보정 절차"
          input={[
            "남아 있는 자료 — 폐허의 모습 또는 전해지는 수",
            "그 자료가 만들어지고 남은 과정",
          ]}
          steps={[
            {
              code: "자료가 어느 쪽으로 기울어 있는지를 먼저 정한다",
              note: "폐허는 돌로 크게 지은 쪽에 유리하고, 시인의 수는 과장하는 쪽으로 기웁니다. 기울기를 정하지 않으면 보정의 방향도 정할 수 없습니다.",
            },
            {
              code: "적히지 않은 것도 단서로 쓴다",
              note: "다른 배의 인원이 목록에 없다는 사실에서 두 수가 최대와 최소라는 읽기가 나옵니다. 공백 자체가 성격을 알려 주는 경우입니다.",
            },
            {
              code: "기울기의 반대쪽으로 보정해 범위를 잡는다",
              note: "폐허 쪽은 올려 보고 시인의 수는 내려 봅니다. 결과는 한 점이 아니라 어느 쪽에 치우쳤는지가 표시된 값입니다.",
            },
            {
              code: "결론을 자료가 버틸 수 있는 꼴로만 적는다",
              note: "저자는 평균을 곱한 수를 적지 않고 '대단치 않다'는 말로 결론을 냅니다. 자료가 한 점을 받치지 못하면 한 점을 적지 않습니다.",
            },
          ]}
          output="방향이 표시된 추정 — 한 점이 아니라 어느 쪽으로 기운 값인지가 함께 남음"
        />

        <ProgressiveDetail
          title="이 추론이 기대고 있는 것"
          preview="저자가 조건을 붙여 둔 자리가 세 군데 있습니다."
        >
          <p className="leading-7">
            첫째, 시인의 증언을 자료로 받아들일 수 있다면이라는 단서를 저자가
            두 번 붙입니다. 받아들일 수 없다면 이 추론 전체가 서지 않습니다.
            둘째, 시인이 스스로 허락한 과장을 감안해야 한다고 덧붙입니다.
            감안의 크기는 적혀 있지 않으므로 결론의 정밀도가 그만큼 열려
            있습니다.
          </p>
          <p className="leading-7">
            셋째, 두 수가 최대와 최소라는 읽기는 저자의 추측입니다. 그는
            적어도 시인이 목록의 다른 배에는 인원을 적지 않았다는 사실을
            근거로 들지만 그 근거가 다른 설명을 완전히 막지는 않습니다. 세
            조건이 모두 저자의 문장 안에 적혀 있다는 점이 이 대목의
            미덕입니다. 조건을 숨겼다면 결론만 남았을 것입니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>이 글의 답은 여기서 닫힙니다. 남은 것으로 지난 일을 그리려면
            남는 과정이 무엇을 걸렀는지를 먼저 적어야 합니다.</em>
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          다음은 사라짐이 우연이 아닌 경우입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글의 치우침은 재료와 세월이 만들었습니다. 돌은 남고 흙은 남지
            않습니다. 그런데 기록이 사라지는 데에는 다른 경로도 있습니다.
            누군가 지워서 사라지는 경우입니다.
          </p>

          <p className="leading-7">
            지운 자리가 남아 있을 때 그 자리에서 무엇을 읽을 수 있고 지워진
            내용을 다른 경로로 메울 수 있다면 그 메운 것은 원래의 것과 같은
            자격을 갖습니까. 다음 글은 돌기둥에서 다섯 단이 긁혀 나간 자리를
            봅니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 두 도시의 폐허에서 오해의 방향이 반대인 까닭은 무엇입니까.{" "}
            <strong>(답: 부품 2절)</strong>
          </p>

          <p className="leading-7">
            2. 저자의 규칙이 한 방향만 막는 규칙이 아니어야 했던 까닭은
            무엇입니까. <strong>(답: 부품 3절)</strong>
          </p>

          <p className="leading-7">
            3. 저자가 평균을 잡고도 곱한 수를 적지 않은 것을 어떻게 읽어야
            합니까. <strong>(답: 부품 4절)</strong>
          </p>
        </div>

        <ContentBoundary article="ruins-mislead" />
      </section>
    </div>
  );
}
