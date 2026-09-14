import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MonopolyViz from "./state-and-legitimacy/viz/MonopolyViz";
import ComplianceThresholdViz from "./state-and-legitimacy/viz/ComplianceThresholdViz";

/**
 * 강제력을 한 곳에 몰아주고 정당성으로 묶습니다
 *
 * 1편이 남긴 "누가 그 힘을 쥐는가"를 받아, 힘이 한 곳에 몰리는 이유와 그 힘이
 * 단순한 폭력과 갈라지는 지점을 다룬다. 그 힘을 제도로 묶는 방법은 3편이 맡는다.
 */
export default function StateAndLegitimacyArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          같은 힘이 보호도 하고 약탈도 하며, 그 차이를 정당성이 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글은 공공재를 만들려면 내지 않는 사람에게서도 걷을 힘이 필요하다는
            데서 멈췄습니다. 그리고 곧바로 질문을 하나 남겼습니다. 그 힘을 누가
            쥐느냐입니다. 이 글은 그 자리를 채웁니다.
          </p>

          <p className="leading-7">
            답은 두 단계로 나옵니다. 먼저 그 힘이 여러 곳에 흩어져 있으면
            작동하지 않으므로 한 곳으로 몰립니다. 그런데 몰린 힘은 공공재를
            만드는 데도 쓰이지만 그냥 빼앗는 데도 쓰입니다. 같은 힘입니다.
          </p>

          <p className="leading-7">
            그래서 두 번째 질문이 따라옵니다. 무엇이 둘을 가르는가입니다. 여기서
            등장하는 것이 <strong>정당성</strong>입니다. 그리고 정당성은 도덕적
            칭찬이 아니라, 통치를 실제로 가능하게 만드는 물질적 조건에 가깝습니다.
          </p>
        </div>

        <MonopolyViz />

        <ContentBoundary article="state-and-legitimacy" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 둘입니다.{" "}
            <strong>강제력은 왜 한 곳으로 몰리는가</strong>, 그리고{" "}
            <strong>몰린 힘이 단순한 폭력과 무엇이 다른가</strong>입니다.
          </p>

          <p className="leading-7">
            순서는 힘이 흩어져 있을 때 생기는 문제, 몰린 힘이 보이는 두 얼굴,
            순응이 통치 비용을 어떻게 바꾸는지, 그리고 정당성이 있어도 실행할
            능력이 없으면 어떻게 되는지입니다. 마지막에 이 글이 증명하지 않는
            것으로 닫습니다.
          </p>

          <p className="leading-7">
            그 힘을 제도로 묶는 방법, 곧 헌법과 권력분립은 이 글이 다루지
            않습니다. 그 자리는{" "}
            <Link to="/politics/constitution/constitutionalism-and-separation">
              헌법은 권력을 묶는 장치입니다
            </Link>
            가 맡습니다.
          </p>
        </div>
      </section>

      <section id="why-monopoly" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 강제력이 여럿이면 마지막에 누가 맞는지 정할 수 없습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            한 지역에 강제할 수 있는 집단이 셋 있다고 해 봅시다. 각자 세금을 걷고 각자 규칙을 정합니다. 그러면 같은 사람이 세 번 걷히고 세 규칙이 충돌할 때 어느 쪽을 따라야
            하는지 정해지지 않습니다. 결국 힘으로 겨루게 되고 그 과정에서 생산은 멈춥니다.
          </p>

          <p className="leading-7">
            문제의 핵심은 중복이 아니라 <em>최종 판정자가 없다</em>는 데
            있습니다. 다툼이 생겼을 때 더 이상 위로 올라갈 곳이 없어야 분쟁이
            끝납니다. 끝나지 않으면 모든 거래가 &ldquo;나중에 뒤집힐 수
            있다&rdquo;는 불확실성을 안고 이루어집니다.
          </p>

          <p className="leading-7">
            그래서 한 영토 안에서 강제력을 독점하고 최종 판정을 내리는 자리가
            만들어집니다. 그 지위를 <strong>주권</strong>이라 부릅니다. 이것은
            좋은 일이어서가 아니라, 분쟁이 끝나려면 어딘가에서 멈춰야 하기
            때문에 생기는 구조입니다.
          </p>
        </div>

        <TermBreakdown
          title="독점이 실제로 성립했는지 보는 세 가지"
          items={[
            {
              term: "경쟁하는 강제력의 부재",
              description:
                "같은 영토 안에서 독자적으로 세금을 걷거나 처벌을 집행하는 다른 조직이 없어야 합니다.",
              example:
                "무장 세력이 별도로 통행세를 걷는 지역은 이 조건이 깨져 있습니다.",
              boundary:
                "완전한 독점은 드뭅니다. 정도의 문제이며, 어느 수준 이하로 떨어지면 다른 조건들도 함께 무너집니다.",
            },
            {
              term: "최종 판정의 승복",
              description:
                "다툼이 그 판정에서 실제로 끝나야 합니다. 판정이 나와도 계속 다른 데 호소한다면 최종성이 없는 것입니다.",
              example:
                "법원 판결이 나온 뒤 당사자들이 그 결과를 전제로 다음 행동을 하는 상태입니다.",
              boundary:
                "지급결제의 최종성과 같은 구조입니다. 속도가 아니라 '여기서 끝난다'는 규칙이 만들어 줍니다.",
            },
            {
              term: "영토적 범위의 명확성",
              description:
                "어디까지가 그 권위의 범위인지 정해져 있어야 합니다. 경계가 모호하면 그 지역에서 두 권위가 겹칩니다.",
              example:
                "국경이 확정되고 그 안의 모든 지점에 같은 법이 적용되는 상태입니다.",
              boundary:
                "범위가 정해졌다는 것이 그 안에서 실제로 집행된다는 뜻은 아닙니다. 그것은 뒤에서 볼 국가 능력의 문제입니다.",
            },
          ]}
        />
      </section>

      <section id="protection-or-predation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 몰린 힘은 지켜 주기도 하고 빼앗기도 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            여기서 불편한 사실이 하나 나옵니다. 강제력을 독점한 조직과 큰 강도 집단은 하는 일의 형식이 비슷합니다. 둘 다 힘으로 재물을 가져가고 둘 다 그 힘에 저항하기 어렵습니다.
            그렇다면 무엇이 다를까요.
          </p>

          <p className="leading-7">
            한 가지 차이는 시간입니다. 지나가는 강도는 오늘 전부 빼앗고 떠납니다.
            같은 곳에 계속 머물 작정인 쪽은 그렇게 하지 못합니다. 전부 빼앗으면
            내년에 가져갈 것이 없어지기 때문입니다.
          </p>

          <p className="leading-7">
            그래서 머물기로 한 쪽은 스스로 걷는 양을 줄이고 심지어 생산을 늘려 주는 일을 하게 됩니다. 도로를 놓고 도둑을 막아 주면 내년에 걷을 것이 늘어납니다. 자기 이익을 위한
            선택이 결과적으로 공공재 공급이 되는 것입니다.
          </p>

          <p className="leading-7">
            이 논리는 국가의 기원을 설명하는 여러 이야기 가운데 하나이고 국가가 좋은 것이라는 증명이 아닙니다. 오히려 반대로 읽어야 합니다. 통치자의 시간지평이 짧아지면 같은 논리가
            약탈 쪽으로 다시 기웁니다.
          </p>
        </div>

        <ProgressiveDetail
          title="이 설명이 증명하는 것과 증명하지 않는 것"
          preview="약탈자도 머물면 일부 공공재를 공급한다는 것이지, 그렇게 생긴 질서가 정당하다는 뜻은 아닙니다."
        >
          <p className="leading-7">
            이 논리가 보이는 것은 좁습니다. 강제력을 쥔 쪽의 이익만으로도 최소한의
            질서와 일부 공공재가 나올 수 있다는 것입니다. 선의를 가정하지 않고도
            설명이 된다는 점이 이 논증의 힘입니다.
          </p>
          <p className="leading-7">
            증명되지 않는 것은 그다음입니다. 얼마나 걷을지, 걷은 것을 무엇에
            쓸지, 누구를 보호하고 누구를 뺄지는 이 논리로 정해지지 않습니다.
            통치자의 이익과 사회의 이익이 겹치는 구간이 있다는 것이지, 둘이
            일치한다는 뜻이 아닙니다.
          </p>
          <p className="leading-7">
            그래서 이 지점에서 두 갈래가 생깁니다. 겹치는 구간을 넓히려면 통치자의 시간지평을 길게 만들거나 통치자가 마음대로 정하지 못하게 제약을 걸어야 합니다. 앞은 이 글의 남은
            절이, 뒤는 다음 글이 다룹니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="legitimacy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 순응이 흔할수록 통치에 드는 힘이 줄어듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            강제만으로 통치하려면 비용이 감당되지 않습니다. 모든 사람을 감시하고 모든 위반을 적발해야 하는데 그 일을 할 사람들도 다시 감시해야 합니다. 실제로는 대부분의 사람이 대부분의
            경우 스스로 따르기 때문에 통치가 굴러갑니다.
          </p>

          <p className="leading-7">
            그 자발적 순응의 근거를 <strong>정당성</strong>이라 합니다. 사람들이
            그 권위를 따르는 것이 마땅하다고 여기는 상태입니다. 근거는 여러
            가지입니다. 늘 그래 왔기 때문일 수도, 지도자 개인에 대한 믿음일
            수도, 정해진 절차에 따라 만들어졌기 때문일 수도 있습니다.
          </p>

          <p className="leading-7">
            여기서 오해하기 쉬운 지점이 있습니다. 정당성은 &ldquo;정당하다&rdquo;는 판단이 아니라 &ldquo;정당하다고 받아들여지고 있다&rdquo;는 사실 기술입니다. 나쁜
            체제도 정당성을 가질 수 있고 좋은 제도도 정당성을 잃을 수 있습니다.
          </p>
        </div>

        <ExplainedFormula
          question="자발적으로 따르는 사람의 비율이 떨어지면 통치는 언제 불가능해지는가?"
          idea="따르지 않는 사람만 강제로 다뤄야 하므로, 필요한 집행 자원은 불응 비율에 비례해 늘어납니다. 반면 동원할 수 있는 자원은 정해져 있으므로, 불응이 어느 선을 넘으면 필요한 양이 가용한 양을 넘어서고 집행 자체가 무너집니다."
          formula={String.raw`R_{\text{필요}} = (1-p)\,N\,e \;\le\; \bar{R} \quad \Longleftrightarrow \quad p \;\ge\; 1 - \frac{\bar{R}}{N e}`}
          annotatedFormula={String.raw`\underbrace{(1-p)\,N}_{\text{따르지 않는 사람 수}} \cdot \underbrace{e}_{\text{한 명을 강제하는 비용}} \;\le\; \underbrace{\bar{R}}_{\text{동원 가능한 집행 자원}}`}
          operations={[
            {
              expression: String.raw`1-p`,
              annotation: [
                "전체에서 자발적으로 따르는 비율을 빼 강제가 필요한 비율만 남깁니다.",
                "정당성이 높아 p가 1에 가까우면 이 값이 0에 가까워집니다.",
              ],
            },
            {
              expression: String.raw`(1-p)\,N\,e`,
              annotation: [
                "불응 비율에 인구를 곱해 사람 수를 얻고, 다시 1인당 강제 비용을 곱해 총 소요를 만듭니다.",
                "곱이므로 인구가 크거나 강제가 비쌀수록 같은 불응률에서도 소요가 커집니다.",
              ],
            },
            {
              expression: String.raw`1 - \frac{\bar{R}}{N e}`,
              annotation: [
                "부등식을 p에 대해 풀면 통치가 유지되는 최소 순응률이 나옵니다.",
                "나눗셈은 가용 자원을 최대 소요로 정규화해, 자원으로 감당 가능한 불응 비율을 구합니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`p`,
              name: "자발적 순응률",
              description:
                "강제가 없어도 규칙을 따르는 사람의 비율입니다. 정당성이 높을수록 커집니다.",
            },
            {
              symbol: String.raw`N`,
              name: "인구",
              description: "그 권위의 적용을 받는 사람의 수입니다.",
            },
            {
              symbol: String.raw`e`,
              name: "1인당 강제 비용",
              description:
                "따르지 않는 한 사람을 적발하고 제재하는 데 드는 평균 자원입니다.",
            },
            {
              symbol: String.raw`\bar{R}`,
              name: "동원 가능한 집행 자원",
              description:
                "경찰·법원·행정 인력처럼 실제로 쓸 수 있는 집행 역량의 총량입니다.",
            },
          ]}
          assumptions={[
            "불응이 서로 무관하게 흩어져 있다고 둡니다. 한곳에 몰려 조직적으로 일어나면 1인당 비용 e 자체가 올라갑니다.",
            "집행 자원이 불응 규모와 무관하게 고정이라고 둡니다. 실제로는 걷는 세금이 줄면 자원도 함께 줄어 악화가 빨라집니다.",
            "순응과 불응을 이분법으로 나눕니다. 실제로는 부분적 회피처럼 중간 상태가 많습니다.",
          ]}
          interpretation="인구 1,000만, 1인당 강제 비용 1, 가용 자원 50만이면 유지되는 최소 순응률은 95%입니다. 여기서 읽어야 할 것은 통치가 강제가 아니라 순응 위에 서 있고, 강제는 나머지 소수를 다루는 장치라는 점입니다. 읽으면 안 되는 것은 순응률이 높으니 좋은 통치라는 결론입니다. 이 식은 체제가 유지되는 조건만 말하며, 그 순응이 동의에서 온 것인지 체념이나 공포에서 온 것인지는 구분하지 않습니다."
        />

        <ComplianceThresholdViz />

        <CitationBlock
          source="Max Weber · Politics as a Vocation (1919년 강연, 1946년 영역본)"
          citeKey={1}
          href="https://archive.org/details/weber_max_1864_1920_politics_as_a_vocation"
        >
          근대 국가를 &ldquo;일정한 영토 안에서 정당한 물리적 강제력의 독점을
          관철한 조직&rdquo;으로 규정한 강연입니다. 이 글의 1절과 3절이 이 정의의
          두 부분, 곧 독점과 정당성을 각각 풀어 쓴 것입니다. 인용한 판본은 Internet
          Archive에 공개된 영역본이며 전문을 열람할 수 있습니다. 다만 이 정의는
          국가가 무엇인지에 대한 개념 규정이지 국가가 왜 정당한지에 대한 논증이
          아닙니다. 여기서 말하는 정당성도 &ldquo;정당하다고 받아들여진다&rdquo;는
          사실 기술이며, 그 권위가 옳다는 평가와는 다른 층위입니다.
        </CitationBlock>
      </section>

      <section id="state-capacity" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 받아들여지는 것과 실제로 할 수 있는 것은 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            정당성이 높아도 실행할 수단이 없으면 결정은 종이에 머뭅니다. 세금을
            걷으려면 누가 얼마를 버는지 알아야 하고, 법을 집행하려면 그 지역에
            닿는 조직이 있어야 합니다. 이 실행 역량을 <strong>국가 능력</strong>
            이라 합니다.
          </p>

          <p className="leading-7">
            능력은 크게 셋으로 나뉩니다. 사회를 들여다보는 정보 역량, 걷는 징세 역량, 그리고 결정을 물리적으로 관철하는 집행 역량입니다. 셋은 서로 맞물려 있어서 정보가 없으면 걷을
            수 없고 걷지 못하면 집행할 자원이 없습니다.
          </p>

          <p className="leading-7">
            그래서 같은 법을 가진 두 나라가 전혀 다르게 굴러갑니다. 법전이 같아도
            실제로 적용되는 범위가 다르기 때문입니다. 제도를 비교할 때 조문만
            보면 안 되는 이유가 여기에 있습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="한 영토에서 국가가 실제로 작동하는지 점검하는 절차"
          input={[
            "대상 영토와 인구",
            "공식 제도: 법령, 조세 체계, 사법 조직",
            "관측 가능한 지표: 징세 도달 범위, 판정 승복 여부, 경쟁 무장조직 존재",
          ]}
          steps={[
            {
              code: "경쟁하는 강제력이 있는지 본다. 있으면 그 지역은 독점이 성립하지 않은 것으로 표시한다.",
              note: "독점이 없으면 뒤의 모든 항목이 부분적으로만 성립합니다. 전국 평균이 아니라 지역별로 봐야 합니다.",
            },
            {
              code: "정보 역량: 누가 어디서 무엇을 버는지 파악되는 비율을 본다.",
              note: "과세 대상을 모르면 세율을 아무리 정해도 걷히지 않습니다. 등록·주소·소득 파악이 여기에 들어갑니다.",
            },
            {
              code: "징세 역량: 법정 세액 대비 실제 징수액의 비율을 본다.",
              note: "이 비율이 낮으면 재정이 없고, 재정이 없으면 다음 단계의 집행 자원도 없습니다.",
            },
            {
              code: "집행 역량: 판정이 실제로 관철되는 비율과 그 지역적 편차를 본다.",
              note: "수도에서는 작동하고 변방에서는 작동하지 않는 상태가 흔합니다. 평균값이 이 편차를 가립니다.",
            },
            {
              code: "순응률을 추정해 앞 절 부등식에 넣고, 가용 집행 자원으로 감당되는지 확인한다.",
              note: "능력과 정당성은 곱해지듯 작용합니다. 순응률이 낮으면 같은 능력으로도 감당이 안 되고, 능력이 낮으면 같은 순응률로도 무너집니다.",
            },
          ]}
          output="지역별로 독점·정보·징세·집행이 각각 어디까지 성립하는지에 대한 목록과, 현재 순응률에서 유지 가능한지에 대한 판정"
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          작동한다는 것이 옳다는 뜻은 아니며, 그 구분이 다음 글을 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글은 강제력이 왜 한 곳에 몰리고 어떤 조건에서 그 체제가 유지되는지를 보였습니다. 유지 조건을 설명한 것이지 그 체제가 옳다고 말한 것이 아닙니다. 앞 절의 부등식은
            폭정에서도 똑같이 성립합니다.
          </p>

          <p className="leading-7">
            오히려 이 글의 논리가 불편한 결론을 하나 담고 있습니다. 통치자의 이익과 사회의 이익이 겹치는 구간은 조건부입니다. 시간지평이 짧아지거나 순응이 공포로만 유지되면 그 구간은
            좁아집니다.
          </p>

          <p className="leading-7">
            그래서 다음 질문은 이것입니다. 힘을 쥔 쪽의 선의나 계산에 기대지 않고 그 힘이 함부로 쓰이지 못하게 미리 묶어 둘 수 있는가입니다.
          </p>

          <p className="leading-7">
            다음 글{" "}
            <Link to="/politics/constitution/constitutionalism-and-separation">
              헌법은 권력을 묶는 장치입니다
            </Link>
            에서 그 묶는 방법을 봅니다. 권력을 나누고, 서로 견제하게 하고,
            바꾸기 어렵게 만드는 세 가지 장치가 각각 무엇을 막는지가 그 글의
            주제입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
