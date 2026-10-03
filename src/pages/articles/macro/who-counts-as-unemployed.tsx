import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ThreeGatesViz from "./who-counts-as-unemployed/viz/ThreeGatesViz";
import FourMeasuresViz from "./who-counts-as-unemployed/viz/FourMeasuresViz";

/**
 * 실업자는 세 조건을 통과한 사람으로 정의됩니다
 *
 * 경제 2단계 8편, 거시 3편. 1차 자료는 국제노동통계인회의(ICLS)의 공식
 * 결의문이다. contract 1.3.1이 허용하는 "공식 규격"이 실물이며, 조항
 * 번호와 원문을 그대로 싣고 쪽 이미지로 대조했다. 100명 보기는 설명을
 * 위해 이 글이 만든 것이고 실제 통계가 아니다 — 본문에서 그 경계를
 * 반복해 적는다.
 */
export default function WhoCountsAsUnemployedArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          일자리를 구하다 지쳐 그만둔 사람은 실업자가 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            반년 동안 일자리를 찾다 지쳐 지난달부터 찾기를 그만둔 사람이
            있습니다. 일하고 싶고 자리가 생기면 내일부터 나갈 수 있습니다.
            국제 기준으로 이 사람은 <strong>실업자가 아닙니다.</strong> 실업률을
            계산할 때 분자에도 분모에도 들어가지 않습니다.
          </p>

          <p className="leading-7">
            빠뜨린 것이 아니라 정의가 그렇습니다. 실업자는 세 조건을 모두
            통과한 사람으로 정의되어 있고 이 사람은 그중 하나를 통과하지 못합니다. 조건은 어느 나라가 임의로 정한 것이 아닙니다. 국제 통계
                     기준 문서에 조항으로 적혀 있습니다.
          </p>

          <p className="leading-7">
            <strong>
              그러면 실업률이라는 숫자는 무엇을 재고 있습니까. 그리고 그 숫자가
              낮아졌다는 말은 무슨 뜻입니까.
            </strong>{" "}
            앞 두 편에서 더한 숫자를 무엇으로 나눌지와 값이 변한 몫을 어떻게
            걷어낼지를 봤습니다. 이번에는 더 앞 단계입니다 — 세기 전에 누구를
            셀지 정하는 자리입니다.
          </p>
        </div>

        <ThreeGatesViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            다섯 부품입니다. 세 조건이 각각 무엇을 거르는지, 분모가 왜 전체
            인구가 아닌지, 그래서 같은 사람들에서 네 가지 숫자가 어떻게
            나오는지, 조건을 건드리면 숫자가 어떻게 움직이는지, 이 숫자를 어떻게 읽어야 하는지입니다.
          </p>

          <p className="leading-7">
            <em>
              여기까지만 읽어도 이 글의 자리는 잡힙니다 — 실업률은 세어 본 결과
              이전에 정의의 결과입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="three-conditions" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 세 조건이 각각 다른 사람을 거릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            첫째는 그 주에 일하지 않았다는 것입니다. 여기서 "일했다"의 선이
            낮다는 점이 중요합니다. 기준 문서는 한 시간 이상 일했으면 일한
            사람으로 셉니다. 주말에 세 시간 아르바이트를 한 사람은{" "}
            <strong>일주일 내내 다른 자리를 구하고 있었어도</strong> 일한
            사람입니다.
          </p>

          <p className="leading-7">
            둘째는 최근에 실제로 일을 찾았다는 것입니다. 기준 문서는 그 기간을
            최근 넉 주 또는 한 달로 두고 무엇이 찾는 활동에 해당하는지를
            일곱 가지로 나열합니다. 고용 서비스에 등록하기, 고용주에게 직접
            지원하기, 구인 광고에 답하기, 친척이나 지인에게 도움을 청하기,
            사업을 차리려고 자금이나 허가를 알아보기 같은 것들입니다.
          </p>

          <p className="leading-7">
            셋째는 자리가 생기면 지금 당장 일할 수 있다는 것입니다. 기준 문서는
            이것을 "지금 시작할 준비가 되어 있는지에 대한 시험"이라고 적습니다.
            다음 달부터 가능한 사람은 이 조건에서 빠지는데, 나라 사정에 따라
            최대 두 주까지 늘려 잡을 수 있다는 단서가 붙어 있습니다.
          </p>

          <p className="leading-7">
            입구의 사람은 첫째와 셋째는 통과하지만 둘째에서 걸립니다. 일하고
            싶고 당장 가능하지만 지난달에 찾지 않았기 때문입니다.{" "}
            <strong>원하는 마음은 조건이 아닙니다.</strong>
          </p>
        </div>

        <CitationBlock
          source="국제노동통계인회의(ICLS), 「Resolution concerning statistics of work, employment and labour underutilization」 19차 결의(2013) · 21차 회의(2023)에서 개정, 47항"
          citeKey={1}
          href="https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@dgreports/@stat/documents/normativeinstrument/wcms_230304.pdf"
        >
          47항 원문입니다 — “Persons in unemployment are defined as all those of
          working age who were not in employment, carried out activities to seek
          employment during a specified recent period and were currently
          available to take up employment given a job opportunity.” 찾는 기간은
          같은 항 (b)에서 “the last four weeks or one month”로, 찾는 활동의 예는
          (b)(i)~(vii)로 나열됩니다. “currently available”이 “a test of readiness
          to start a job in the present”라는 것과 최대 두 주까지 늘릴 수 있다는
          단서는 (d)입니다. 한 시간 기준은 27항 계열의 “work for at least one
          hour”입니다. ILO 공개 PDF를 내려받아 읽었고 47항은 쪽 이미지를 직접
          열어 대조했습니다. 한국어 조건 서술은 이 글이 옮긴 것이고 공식 번역이
          아닙니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              세 문이 각각 무엇을 거르는지는 이 절에서 끝났습니다. 통과한 사람을
              무엇으로 나누는지가 다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="denominator" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 분모는 전체 인구가 아니라 일하거나 찾는 사람입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            실업률을 구할 때 분모는 나라 전체 인구도, 일할 나이의 사람 전체도
            아닙니다. 일하는 사람과 실업자를 더한 수입니다. 기준 문서는 이
            합을 노동력이라고 부릅니다.
          </p>
        </div>

        <ExplainedFormula
          question="실업률의 분모에는 누가 들어갑니까"
          idea={
            <>
              세 조건을 통과한 사람을, 일하는 사람과 그 통과한 사람을 더한 수로
              나눕니다. 셋 중 어느 문에서든 빠진 사람은{" "}
              <strong>분자에서도 분모에서도 함께 사라집니다.</strong> 그래서
              찾기를 그만두면 실업률이 올라가는 것이 아니라 내려갑니다.
            </>
          }
          formula={String.raw`\mathrm{LU1} \;=\; \frac{U}{E + U} \times 100`}
          annotatedFormula={String.raw`\mathrm{LU1} \;=\; \frac{\underbrace{U}_{\text{세 조건을 다 통과한 사람}}}{\underbrace{E + U}_{\text{일하는 사람과 그들을 더한 수}}} \times 100`}
          operations={[
            {
              expression: String.raw`E + U`,
              annotation: [
                "노동력이라고 부르는 분모",
                "일할 나이의 사람 전체가 아닙니다",
              ],
            },
            {
              expression: String.raw`U \to U - 1,\; E + U \to E + U - 1`,
              annotation: [
                "한 사람이 찾기를 그만두면",
                "분자와 분모가 함께 1씩 줄어듭니다",
              ],
            },
            {
              expression: String.raw`\frac{U-1}{E+U-1} < \frac{U}{E+U}`,
              annotation: [
                "그래서 실업률이 내려갑니다",
                "일자리를 얻은 사람이 없는데도 그렇습니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "E",
              name: "일하는 사람",
              description:
                "그 주에 한 시간 이상 일한 사람입니다. 시간이 모자라도 여기 들어갑니다.",
            },
            {
              symbol: "U",
              name: "실업자",
              description: "세 조건을 모두 통과한 사람입니다.",
            },
            {
              symbol: String.raw`E + U`,
              name: "노동력",
              description:
                "분모입니다. 어느 조건에서든 빠진 사람은 여기에도 없습니다.",
            },
          ]}
          interpretation="실업률이 내려갔다는 사실만으로는 일자리가 늘었는지 찾기를 그만둔 사람이 늘었는지 알 수 없습니다. 둘은 같은 방향으로 이 숫자를 움직입니다."
          assumptions={[
            "한 사람은 일하는 사람과 실업자 가운데 한쪽에만 들어갑니다. 기준 문서는 일하는 쪽을 먼저 적용한다고 정해 둡니다.",
            "세 조건의 판정이 설문 응답으로 이루어집니다. 같은 사람도 묻는 방식에 따라 다르게 분류될 수 있습니다.",
            "여기서는 비율의 성질만 봅니다. 실제 자료에서 분자와 분모가 정확히 1씩 움직이는지는 조사 설계에 달려 있습니다.",
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 성질이 이 글에서 가장 중요한 지점입니다. 일자리를 구하다 지친
            사람이 늘어나면 실업률은 <strong>내려갑니다.</strong> 나빠진 일이
            좋아 보이는 숫자로 나타납니다. 숫자가 거짓말을 하는 것이 아니라 그 숫자가 재도록 정의된 것이 그것이기 때문입니다.
          </p>

          <p className="leading-7">
            <em>
              분모의 성질은 여기까지입니다. 그래서 기준 문서가 숫자를 하나만 두지
              않았다는 것이 다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="four-measures" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 같은 사람들에서 네 가지 숫자가 나옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            기준 문서는 실업률 하나만 쓰지 말라고 적어 두었습니다. 쓰이지 않는
            일손을 재는 지표를 넷으로 정의하고 그 가운데{" "}
            <strong>둘 이상이 필요하다</strong>고 못 박습니다. 서로 다른 나라와
            서로 다른 경기 국면에서 쓰이지 않는 일손이 다른 모습으로 나타나기 때문입니다.
          </p>
        </div>

        <FourMeasuresViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            넷의 차이는 분자에 누구를 더하고 분모를 무엇으로 두느냐입니다. 가장
            좁은 것이 실업자만 세는 첫째이고, 가장 넓은 것이 시간이 모자란
            사람과 찾기를 그만둔 사람까지 더한 넷째입니다. 둘째와 셋째는 한쪽씩만
            더합니다.
          </p>

          <p className="leading-7">
            여기서 분모가 둘로 갈린다는 점을 놓치면 안 됩니다. 찾기를 그만둔
            사람을 분자에 더할 때는 분모에도 더해야 합니다. 기준 문서는 그
            넓어진 분모를 따로 이름 붙여 두었습니다. 분자만 넓히고 분모를 그대로 두면
            같은 자료에서 더 큰 숫자가 나오는데, 그것은 다른 지표가 아니라
            잘못 계산한 값입니다.
          </p>
        </div>

        <CitationBlock
          source="같은 결의 51·55·73항"
          citeKey={2}
          href="https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@dgreports/@stat/documents/normativeinstrument/wcms_230304.pdf"
        >
          73항 (c)가 네 지표를 식으로 적습니다. LU1은 실업자를 노동력으로, LU2는
          시간 관련 불완전취업과 실업자의 합을 노동력으로, LU3은 실업자와 잠재
          노동력의 합을 확장 노동력으로, LU4는 셋의 합을 확장 노동력으로
          나눕니다. 같은 항은 “more than one amongst the following headline
          indicators is needed”라고 적어 하나만 쓰지 말라고 합니다. 잠재
          노동력의 정의는 51항이고 — 찾았지만 당장 못 하는 사람과, 찾지 않았지만
          일하고 싶고 당장 가능한 사람 둘입니다 — 확장 노동력이 노동력과 잠재
          노동력의 합이라는 것은 55항입니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              네 숫자가 어떻게 다른지는 이제 셀 수 있습니다. 조건을 건드리면
              어떻게 되는지가 다음 부품입니다.
            </em>
          </p>
        </div>
      </section>

      <section id="moving-the-line" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 조건 하나만 바꿔도 같은 나라의 숫자가 달라집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            세 조건에는 각각 눈금이 있습니다. 일했다고 보는 시간의 선, 찾았다고
            보는 기간의 길이, 당장 가능하다고 보는 창의 폭입니다. 셋 다 기준
            문서에 숫자로 적혀 있고 그 숫자를 바꾸면 같은 사람들에서 다른
            결과가 나옵니다.
          </p>
        </div>

        <AlgorithmBlock
          title="조건의 눈금을 옮겼을 때 숫자가 어디로 가는지"
          input={[
            "일했다고 보는 최소 시간 (기준: 한 시간)",
            "찾았다고 보는 기간 (기준: 넉 주 또는 한 달)",
            "당장 가능하다고 보는 창 (기준: 기준 주, 최대 두 주까지 연장 가능)",
          ]}
          steps={[
            {
              code: "최소 시간을 올린다 → 일하는 사람이 줄고 실업자가 는다",
              note: "주말에만 몇 시간 일하던 사람이 일하는 쪽에서 빠져 나와, 나머지 두 조건을 통과하면 실업자가 됩니다. 분자와 분모가 모두 움직이지만 분자가 더 크게 늘어 실업률이 올라갑니다.",
            },
            {
              code: "찾는 기간을 늘린다 → 실업자가 는다",
              note: "두 달 전에 찾고 그 뒤로 쉰 사람이 넉 주 기준에서는 빠지지만 석 달 기준에서는 들어옵니다. 분자와 분모가 함께 늘고 실업률이 올라갑니다.",
            },
            {
              code: "당장 가능의 창을 늘린다 → 실업자가 는다",
              note: "다음 달부터 가능한 사람이 들어옵니다. 기준 문서가 최대 두 주까지만 허용하는 것은 이 눈금이 결과를 크게 흔들기 때문입니다.",
            },
          ]}
          output="같은 조사 자료에서 서로 다른 실업률 — 어느 쪽도 계산이 틀린 것은 아님"
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            그래서 나라 사이의 비교가 어려워집니다. 기준 문서가 눈금을 한자리로
            고정하지 않고 범위와 단서를 둔 것은 나라마다 노동시장의 모습이 다르기
            때문인데, 그 유연함이 그대로 비교 가능성을 깎습니다.{" "}
            <strong>같은 이름의 숫자가 같은 방식으로 만들어졌다는 보장이
            없습니다.</strong>
          </p>

          <p className="leading-7">
            앞 글의 값 수준과 같은 자리입니다. 거기서는 무엇을 얼마의 비중으로
            평균할지가 선택이었고 여기서는 누구를 셀지가 선택입니다.{" "}
            <Link to="/economics/macro/what-the-price-level-hides">
              중립적인 걷어내기가 없었던 것
            </Link>
            처럼 중립적인 세기도 없습니다.
          </p>

          <p className="leading-7">
            <em>
              읽기를 여기서 멈춰도 이 글의 경고는 다 나왔습니다. 그래서 이 숫자를
              어떻게 읽어야 하는지가 남습니다.
            </em>
          </p>
        </div>
      </section>

      <section id="how-to-read" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 숫자 하나가 아니라 숫자와 정의를 함께 읽습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            실업률이 쓸모없다는 뜻이 아닙니다. 같은 나라에서 같은 정의로 여러
            해를 재면 그 변화는 의미가 있습니다. 문제가 생기는 것은 숫자 하나를
            떼어 내 "일자리 사정"이라고 읽을 때입니다.
          </p>

          <p className="leading-7">
            실업률이 내려갔다는 말을 들으면 물어야 할 것이 정해져 있습니다.
            일하는 사람이 늘었습니까, 아니면 찾기를 그만둔 사람이 늘었습니까.
            앞 글의 식이 네 자리를 적어 두어 물어야 할 목록을 만들었듯이,{" "}
            <strong>세 조건이 여기서 같은 일을 합니다.</strong>
          </p>

          <p className="leading-7">
            기준 문서 자신이 답을 하나 내놓습니다. 넷 중 둘 이상을
            보라는 것입니다. 실업률만 내려가고 더 넓은 지표가 그대로이면 사람이
            세 문 중 하나에서 빠져나간 것이고 넷이 함께 내려갔으면 일자리가
            실제로 늘어난 것입니다. 한 숫자로는 가를 수 없고 두 숫자면 가를 수
            있습니다.
          </p>
        </div>

        <TermBreakdown
          title="실업률이 내려갔다는 같은 사실, 두 가지 경우"
          description="LU1만 보면 같아 보이고, 더 넓은 지표를 함께 보면 갈립니다."
          items={[
            {
              term: "일자리가 늘어난 경우",
              description:
                "실업자였던 사람이 일을 구해 분자에서 분모의 다른 항으로 옮겨 갑니다.",
              example:
                "LU1이 내려가고, 잠재 노동력까지 세는 넓은 지표도 함께 내려갑니다.",
              boundary:
                "분모는 거의 그대로입니다. 사람이 노동력 안에서 자리만 옮기기 때문입니다.",
            },
            {
              term: "찾기를 그만둔 경우",
              description:
                "실업자였던 사람이 둘째 조건에서 빠져 분자와 분모에서 동시에 사라집니다.",
              example:
                "LU1은 내려가는데 잠재 노동력까지 세는 넓은 지표는 그대로이거나 올라갑니다.",
              boundary:
                "그 사람은 통계에서 사라진 것이지 일자리를 얻은 것이 아닙니다.",
            },
          ]}
        />

        <ProgressiveDetail
          title="그러면 왜 애초에 조건을 이렇게 좁게 두었습니까"
          preview="좁게 두는 데에도 이유가 있고, 그래서 기준 문서가 좁은 지표와 넓은 지표를 함께 두었습니다."
        >
          <p className="leading-7">
            찾는 활동을 요구하는 조건은 일하고 싶다는 마음과 실제로 노동시장에
            나와 있는 상태를 가르기 위한 것입니다. 마음만으로 세면 설문에서
            답하기 나름이 되어 나라끼리는커녕 해마다도 견주기 어려워집니다. 당장
            가능해야 한다는 조건도 같은 역할을 합니다.
          </p>
          <p className="leading-7">
            그래서 좁은 정의는 견주기 쉬운 대신 놓치는 사람이 생기고 넓은 정의는 놓치는 사람이 적은 대신 견주기 어려워집니다. 둘 다 두고 함께 보라는 것이 기준 문서의
                                     선택입니다. 이 글이 전하려는 것도 둘 중 하나를
            고르라는 것이 아니라 어느 쪽을 보고 있는지 알고 보라는 것입니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              이 글의 답은 여기서 끝납니다. 실업률은 세어 본 결과이기 전에 세 조건의 결과이고 그 조건에서 빠진 사람은 숫자에서 사라집니다.
            </em>
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          마지막은 나라 밖과의 거래입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            더한 숫자를 읽는 규칙을 셋 봤습니다. 무엇으로 나누느냐, 값이 변한
            몫을 어떻게 걷어내느냐, 누구를 세느냐입니다. 셋 다 숫자가 만들어지는
            자리까지 내려가야 보였고 셋 다 선택이 결과의 일부였습니다.
          </p>

          <p className="leading-7">
            마지막 편은 나라 밖과의 거래입니다. 1단계에서 서로 다른 것을 잘하는
            두 쪽이 거래하면 양쪽이 이득이라는 것을 봤는데, 그 논증이 세워진
            자리로 돌아가 거기서 무엇을 전제했는지를 읽습니다. 전제 하나가
            오늘날에는 성립하지 않습니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 어떤 나라에서 실업률이 내려갔는데 일하는 사람 수는 그대로입니다.
            무슨 일이 있었을 수 있습니까. <strong>(답: 부품 2절)</strong>
          </p>

          <p className="leading-7">
            2. 주말에만 세 시간 일하면서 평일 내내 다른 자리를 찾는 사람은
            어느 쪽으로 세어집니까. <strong>(답: 부품 1절)</strong>
          </p>

          <p className="leading-7">
            3. 찾기를 그만둔 사람을 분자에 더하면서 분모를 그대로 두면 왜 안
            됩니까. <strong>(답: 부품 3절)</strong>
          </p>
        </div>

        <ContentBoundary article="who-counts-as-unemployed" />
      </section>
    </div>
  );
}
