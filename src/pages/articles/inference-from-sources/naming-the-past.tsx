import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import FourNamesViz from "./naming-the-past/viz/FourNamesViz";
import WhatTheNameAddsViz from "./naming-the-past/viz/WhatTheNameAddsViz";

/**
 * 우리가 법전이라 부르는 것이 스스로를 부르는 이름
 *
 * 역사 9편이자 마지막 글. 앞 두 글이 자료 쪽에서 들어오는 걸름을 다뤘다면
 * 이 글은 읽는 쪽이 가져오는 것을 다룬다. 1차 자료는 함무라비 법전이고
 * C. H. W. Johns 영역(1903년 T. & T. Clark 판)의 Project Gutenberg
 * 전사본(eBook 17150)으로 읽었다.
 */
export default function NamingThePastArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          돌은 자기를 법전이라고 부르지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞의 두 글은 자료가 손에 들어오기까지 무엇이 걸러지는지를 봤습니다.
            그런데 걸름은 자료 쪽에서만 들어오지 않습니다. 읽는 쪽도 무언가를
            가지고 옵니다. 가장 먼저 가지고 오는 것이{" "}
            <strong>그 대상을 부르는 이름</strong>입니다.
          </p>

          <p className="leading-7">
            우리는 그 돌기둥을 함무라비 법전이라고 부릅니다. 지금까지 두
            글에서도 그렇게 불렀습니다. 그런데 돌에 새겨진 글은 끝에서 자기를
            한 번 부릅니다. 그때 쓰는 말은 법전이 아닙니다. 강한 왕 함무라비가
            확정한 <strong>올바름의 판결들</strong>이라고 적혀 있습니다.
          </p>

          <p className="leading-7">
            <strong>
              우리가 붙인 이름이 그 대상이 자기에게 붙인 이름과 다를 때, 그 차이는
              읽기에 무엇을 더하고 무엇을 가립니까.
            </strong>{" "}
            <Link to="/history/inference-from-sources/the-gap-was-made">앞 글</Link>이
            사라진 자리를 봤다면, 이 글은 우리가 채워 넣은 자리를 봅니다.
          </p>
        </div>

        <FourNamesViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            네 부품입니다. 이 대상에 붙은 이름이 몇 개인지, 법전이라는 이름에서
            어떤 기대가 생기는지, 이름과 함께 들어온 구조가 무엇인지, 그리고 번역어가
            같은 일을 어떻게 하는지입니다.
          </p>

          <p className="leading-7">
            <em>이 절까지만 읽어도 남는 말이 하나 있습니다. 사료를 부르는
            이름은 사료의 일부가 아닐 수 있습니다.</em>
          </p>
        </div>
      </section>

      <section id="four-names" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 한 대상이 네 이름으로 불렸습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            첫 번째는 글 자체의 것입니다. 번역본에서 조항들이 끝나는 자리에 한
            줄이 있습니다. 강한 왕 함무라비가 확정하여 이 땅이 확실한 인도와
            은혜로운 다스림을 얻게 한 올바름의 판결들이라는 것입니다. 이 이름은
            구체적 상황에 내려진 판단을 먼저 떠올리게 합니다.
          </p>

          <p className="leading-7">
            두 번째는 학교의 것입니다. 1903년 머리말에 따르면 이 글은 훗날
            바빌로니아의 학교에서 교재가 되었고, 그러면서 열두 장쯤으로
            나뉘고 셈 지방의 관습대로 첫머리 단어를 따서 <em>Ninu ilu sirum</em>
            이라 불렸습니다. <strong>이름이 내용에서 오지 않고 첫 줄에서 온
            경우</strong>입니다.
          </p>

          <p className="leading-7">
            세 번째는 아시리아의 것입니다. 기원전 7세기에 다른 판으로
            읽혔습니다. 거기서는 함무라비 대왕이 세운 올바름의 판결들이라는
            이름이 붙은 것으로 보인다고 적혀 있습니다. 자기 이름에 왕의 칭호가
            더해진 꼴입니다.
          </p>

          <p className="leading-7">
            네 번째가 우리의 것입니다. 이 번역본의 표제는 세계에서 가장 오래된
            법전입니다. 본문은 1조부터 282조까지 번호가 매겨져 있습니다. 네
            이름 가운데 가장 늦게 붙었고 지금 가장 널리 쓰입니다.
          </p>
        </div>

        <CitationBlock
          source="C. H. W. Johns 영역, 『The Oldest Code of Laws in the World』(1903) · 본문 끝 문장과 머리말"
          citeKey={1}
          href="https://www.gutenberg.org/ebooks/17150"
        >
          조항들이 끝나는 자리의 문장은 이렇습니다 — “The judgements of
          righteousness which Hammurabi the mighty king confirmed and caused the
          land to take a sure guidance and a gracious rule.” 머리말은 전해진
          내력을 이렇게 적습니다 — “two thousand years and more later it was made
          a text-book for study in the schools of Babylonia, being divided for
          that purpose into some twelve chapters, and entitled, after the Semitic
          custom, _Ninu ilu sirum_, from its opening words. In Assyria also, in
          the seventh century B.C., it was studied in a different edition,
          apparently under the name of ‘The Judgments of Righteousness which
          Hammurabi, the great king, set up.’” Project Gutenberg 전사본(eBook
          17150)으로 읽었고, facsimile이 아니므로 쪽수 대신 해당 대목의 위치만
          적습니다. 한국어 서술은 이 글이 옮긴 것이고 공인된 번역이 아닙니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            머리말의 <em>"이천 년도 더 지난 뒤"</em>라는 시간 간격은 여기서
            검증할 수 없습니다. 존스는 같은 머리말에서 함무라비를 기원전 3천년에
            두었지만, 현재 소장기관인{" "}
            <a href="https://www.louvre.fr/en/the-code-of-hammurabi">루브르 박물관</a>은
            돌에 글이 새겨진 때를 약 기원전 1750년으로 설명합니다. 학교에서 쓴
            판본의 연대를 따로 대조하지 않았으므로, 여기서는 존스가 전한 이름과
            장 구분만 소개하고 시간 간격은 주장하지 않습니다.
          </p>
        </div>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              이름이 넷이라는 것이 잡혔습니다. 그 가운데 우리가 쓰는 이름에서
              떠오르는 기대가 다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="what-the-name-adds" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 법전이라는 이름에서 떠올릴 네 기대를 점검합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            두 이름이 가리키는 것은 같은 돌인데 머릿속에 그려지는 것이 다릅니다.
            판결들이라는 이름은 구체적 상황의 판단을, 법전이라는 이름은 일반
            규칙을 먼저 떠올리게 합니다. 같은 문장도 어느 이름으로 부르느냐에
            따라 읽는 관점이 달라집니다. <strong>그 이름만으로 실제 판결을 모아
            만든 것인지, 제정한 규칙을 얼마나 집행했는지는 알 수 없습니다.</strong>
          </p>

          <p className="leading-7">
            <a href="https://www.louvre.fr/en/the-code-of-hammurabi">루브르 박물관</a>도
            오늘 이 돌을 <em>법전</em>이라 부르면서, 현대의 법전과
            같은 것은 아니고 판결을 모은 자료에 가깝다고 설명합니다. 통용되는
            이름을 쓰되 그 이름에서 떠오른 현대의 모습을 그대로 가져오지 않는
            읽기입니다.
          </p>
        </div>

        <WhatTheNameAddsViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 번역본의 <em>법전</em>이라는 표제와 조항 번호를 함께 볼 때 독자가
            떠올릴 수 있는 기대 네 가지를 점검해 보겠습니다. 다룰 영역을 빠짐없이
            담았는가, 지금 보이는 장·조 번호가 원래 있었는가, 왕의 권위로
            확정되었는가, 적힌 대로 집행되었는가입니다. <strong>이것은 점검할
            질문이지 "법전"이라는 단어의 필수 뜻은 아닙니다.</strong>
          </p>

          <p className="leading-7">
            네 질문 가운데 왕이 확정했다는 것은 글 자체가 적어 둡니다. 다룰
            영역을 빠짐없이 담았는지는 돌만으로 확인할 수 없고 지워진 다섯 단은
            그 한계를 더합니다. 지금 보이는 장·조 번호는 뒷사람이 붙였으며,
            실제 집행 빈도도 돌은 보여 주지 않습니다. <strong>독자가 떠올린
            네 기대 가운데 돌이 직접 받치는 것은 왕의 확정뿐입니다.</strong>
          </p>

          <p className="leading-7">
            그러니 이름을 쓰는 것 자체가 잘못은 아니고, 이름에서 떠오른 기대를
            사료가 확인한 사실로 착각하는 것이 잘못입니다. 둘을 가르는 방법은 간단합니다.
            결론에 쓰려는 성질을 하나씩 떼어 그 성질이 어느 문장에서 나왔는지를
            찾아보는 것입니다. 찾지 못하면 그것은 이름에서 온 것입니다.
          </p>
        </div>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              이름의 몫이 드러났습니다. 이름만 들어온 것이 아니라는 것이 다음
              부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="imposed-structure" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 장과 조항 번호도 뒷사람이 붙인 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글에서 조항을 가리킬 때마다 196조, 209조, 273조 같은 번호를
            썼습니다. 번호가 있으면 찾기 쉽고 서로 대어 보기도 쉽습니다. 그런데 그
            번호는 돌에 새겨진 것이 아닙니다. 앞 글에서 본 100조가 그 증거입니다.
            사라진 분량의 추정에 따라 번호가 정해졌다면, 번호 체계 전체가 복원
            과정의 산물입니다.
          </p>

          <p className="leading-7">
            장 구분도 마찬가지입니다. 존스의 머리말에 따르면 열두 장쯤의 구분은
            훗날 학교에서 공부할 때 붙었고, 이 번역본에서는 그 구분도 따르지
            않습니다. 그러니까 지금 우리가 보는 꼴은{" "}
            <strong>돌의 꼴이 아니라 읽기 좋게 여러 번 손본 꼴</strong>입니다.
          </p>

          <p className="leading-7">
            구조가 더해지는 것이 이름이 더해지는 것보다 알아채기 어렵습니다. 이름은
            말이라서 다른 말로 바꿔 볼 수 있지만, 번호는 자료처럼 보입니다. 1조에서
            282조까지 매겨져 있으면 전체가 282개로 이루어진 하나의 덩어리라는 인상이
            따라오고, 그 인상은 완전성을 기대하게 만들 수 있지만 증거는 아닙니다.
          </p>
        </div>

        <TermBreakdown
          title="돌에 있던 것과 뒤에 붙은 것"
          description="섞여 있으면 둘 다 사료처럼 보입니다."
          items={[
            {
              term: "돌에 있던 것",
              description:
                "조항의 문장들, 왕과 샤마시가 마주한 부조, 그리고 자기를 부르는 이름입니다.",
              example:
                "올바름의 판결들이라는 자기 이름은 본문 끝에 적혀 있습니다.",
              boundary:
                "다섯 단이 지워졌으므로 돌에 있던 것조차 전부 남아 있지는 않습니다.",
            },
            {
              term: "뒤에 붙은 것",
              description:
                "열두 장의 구분, 1~282조의 번호, 법전이라는 표제, 그리고 번역어입니다.",
              example:
                "장 구분은 훗날 학교에서 쓰였고, 번호와 표제는 근대의 판이 붙였습니다.",
              boundary:
                "붙은 것이 쓸모없다는 뜻이 아닙니다. 번호가 없으면 이 시리즈처럼 조항을 가리키며 이야기할 수 없습니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              구조까지 왔습니다. 가장 알아채기 어려운 것이 마지막 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="translated-words" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 번역어가 조용히 같은 일을 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            이 시리즈에서 신분을 말할 때 신사와 가난한 사람과 종이라는 말을
            썼습니다. 그 말들은 돌에서 바로 온 것이 아닙니다. 영역자가{" "}
            <em>gentleman</em>, <em>poor man</em>, <em>servant</em>를 골랐고, 이
            글이 그것을 다시 한국어로 옮긴 것입니다.{" "}
            <strong>두 번 옮겨진 말로 세 신분을 이야기한 셈</strong>입니다.
          </p>

          <p className="leading-7">
            번역어는 이름보다 더 조용합니다. 표제는 눈에 띄지만 본문 안의 낱말은
            사료의 말처럼 읽힙니다. 그런데 gentleman이라는 말은 20세기 초 영국
            독자에게 특정한 계급의 모습을 불러왔을 것이고, 그 모습이 메소포타미아의
            신분과 어디까지 겹치는지는 그 선택 자체가 답해 주지 않습니다.
          </p>

          <p className="leading-7">
            그렇다고 번역을 거치지 않을 수는 없습니다. 아카드어를 읽지 못하는 쪽이
            이 사료를 보려면 누군가의 선택을 통과해야 하고, 통과한 뒤에는 그 선택이
            본문 안에 녹아 있습니다. 할 수 있는 일은 번역을 피하는 것이 아니라{" "}
            <strong>어느 번역을 거쳤는지를 적어 두는 것</strong>입니다. 그래야
            다른 번역을 읽은 사람과 어긋났을 때 어디서 갈렸는지 찾을 수 있습니다.
          </p>
        </div>

        <ProgressiveDetail
          title="그러면 이 시리즈의 글들은 어떻게 되는 것입니까"
          preview="같은 제약을 받습니다. 그래서 각 글이 어느 판으로 읽었는지를 본문과 자료 목록에 적어 두었습니다."
        >
          <p className="leading-7">
            아홉 편 가운데 투키디데스는 Crawley 영역, 헤로도토스는 Macaulay 영역,
            요세푸스는 Whiston 영역, 함무라비 법전은 Johns 영역으로 읽었습니다.
            넷 다 그리스어나 아카드어 원문이 아니고, 넷 다 facsimile이 아니라
            전사본입니다. 그래서 쪽수를 적지 않고 권·절이나 조항 번호까지만
            적었습니다.
          </p>
          <p className="leading-7">
            이 제약을 적어 두는 일이 이 시리즈가 첫 글에서 세운 기준과 같습니다.
            저자가 자기 방법을 적어 두면 독자가 신뢰의 범위를 추측하지 않아도
            된다는 것이었습니다. 같은 요구가 이 글들에도 걸리므로, 각 글은 무엇을
            읽었고 무엇을 읽지 않았는지를 자료 목록에 적습니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              이 글의 답은 여기서 닫힙니다. 이름과 구조와 번역어는 버릴 수 없고,
              버리는 대신 출처를 적고 함의를 따로 확인하는 것이 할 수 있는
              일입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">세 분류가 물은 것</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            아홉 편이 다룬 것은 지난 일이 아니라 지난 일을 아는 방법이었습니다.
            세 분류가 각각 하나씩 물었습니다.
          </p>

          <p className="leading-7">
            첫 분류는 적은 사람을 물었습니다. 연설은 저자가 지어 넣었고 사건은
            교차 확인을 거쳤다는 것, 믿지 않는 이야기도 꼬리표를 붙여 남긴다는 것,
            당사자는 자기 치우침을 먼저 적어야 한다는 것이었습니다.
          </p>

          <p className="leading-7">
            둘째 분류는 적힌 숫자를 물었습니다. 170만은 1만이라는 눈금을 170번
            적용한 수이고, 528만 3220은 가정들을 쌓아 만든 수이며, 법전의 금액은
            센 수가 아니라 정한 수였습니다.
          </p>

          <p className="leading-7">
            셋째 분류는 남은 것과 우리를 물었습니다. 폐허는 돌로 지은 쪽에 유리하게
            남고, 돌의 지운 자리에는 삭제 흔적이 남으며, 우리가 붙인 이름은 사료가
            말하지 않은 것을 함께 들여옵니다.
          </p>

          <p className="leading-7">
            세 물음이 하나로 모이는 자리가 있습니다. 어떤 주장을 하기 전에{" "}
            <strong>그 주장을 떠받치는 문장이 어느 사료의 어느 자리에서 왔고,
            거기까지 오는 동안 무엇이 더해지고 무엇이 빠졌는지</strong>를 적을 수
            있어야 한다는 것입니다. 적을 수 없으면 그 주장은 아직 사료에서 나온
            것이 아닙니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 이 대상에 붙은 네 이름을 붙은 순서대로 쓰고, 각각 누가 붙였는지
            쓰세요. <strong>(답: 부품 1절)</strong>
          </p>

          <p className="leading-7">
            2. 법전이라는 표제에서 떠올릴 네 질문 가운데 사료가 직접 답하는 것은
            무엇입니까. <strong>(답: 부품 2절)</strong>
          </p>

          <p className="leading-7">
            3. 번역어가 이름보다 알아채기 어려운 까닭은 무엇입니까.{" "}
            <strong>(답: 부품 4절)</strong>
          </p>
        </div>

        <ContentBoundary article="naming-the-past" />
      </section>
    </div>
  );
}
