import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import RuleOrStandardViz from "./rules-standards-and-interpretation/viz/RuleOrStandardViz";
import InterpretationCoreViz from "./rules-standards-and-interpretation/viz/InterpretationCoreViz";

/**
 * 미리 적어 둘 것인가 그때 판단할 것인가
 *
 * 1편이 어떤 문장이 법인지까지 갔으니, 그 문장을 개별 사건에 대는 일을 받는다.
 * 규칙과 기준의 비용 비교에서 출발해 해석 도구와 흠결·유추까지 가고, 판단이
 * 쌓여 규범이 되는 과정은 다음 글이 소유한다.
 */
export default function RulesStandardsAndInterpretationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          같은 내용을 언제 정하느냐가 제도를 가릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글은 어떤 문장이 법인지까지 갔습니다. 효력은 권한을 준 상위
            규범에서 오고, 그 규범이 사람을 이끌려면 공포되고 명확해야 한다는
            것까지였습니다.
          </p>

          <p className="leading-7">
            그런데 명확성 조건을 두고 회색 지대가 있느냐가 아니라 얼마나 넓으냐를
            봐야 한다고 적었습니다. 모든 조문에 회색이 있다는 뜻이고, 그러면 그
            회색을 누가 언제 메우는지가 남은 질문이 됩니다.
          </p>

          <p className="leading-7">
            답은 둘입니다. 만들 때 미리 좁혀 두거나, 사건이 온 뒤에 메우는
            것입니다. 두 방식은 같은 내용을 담을 수 있고 차이는 시점 하나뿐인데,
            그 하나가 제도의 성격을 거의 다 정합니다.
          </p>
        </div>

        <RuleOrStandardViz />

        <ContentBoundary article="rules-standards-and-interpretation" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              일반적인 문장과 개별 사건 사이를 무엇이 잇고, 그 이음매를 어느
              시점에 두어야 하는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 두 방식이 무엇을 다르게 하는지, 어느 쪽이 싼지가 어떻게
            계산되는지, 어느 쪽을 택해도 남는 해석의 문제, 그리고 적혀 있지 않은
            사안을 어떻게 다루는지입니다.
          </p>

          <p className="leading-7">
            한 번 메워진 회색이 다음 사건에 어떤 힘을 갖는지는 다루지 않습니다.
            판단이 쌓여 규범처럼 굳는 과정은 다음 글{" "}
            <Link to="/law/legal-system/precedent-and-legal-change">
              선례와 법의 변화
            </Link>
            가 맡습니다.
          </p>
        </div>
      </section>

      <section id="two-timings" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 차이는 내용이 아니라 시점입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            시속 100킬로미터를 넘지 말라는 조문과 과도한 속도로 달리지 말라는
            조문을 놓고 보면, 둘이 막으려는 것은 같습니다. 다른 것은 얼마가
            과도한지를 언제 정하느냐입니다.
          </p>

          <p className="leading-7">
            앞쪽은 만들 때 정해 둡니다. 그래서 운전자는 계기판만 보면 자기가
            위반인지 알 수 있고, 판단하는 쪽은 속도만 재면 됩니다. 뒤쪽은 사건이
            온 뒤에 정합니다. 그래서 운전자는 미리 알 수 없고, 판단하는 쪽이
            그날의 도로 상태와 시야를 놓고 정해야 합니다.
          </p>

          <p className="leading-7">
            이 시점 차이에서 나머지가 따라 나옵니다. 미리 정해 두면 만드는 데
            품이 많이 들지만 쓸 때는 싸집니다. 그때 정하기로 하면 만들기는 쉽지만
            사건마다 값을 치릅니다. 그리고 미리 정해 둔 선은 반드시 실제 위험과
            어긋나는 구간을 남깁니다.
          </p>

          <p className="leading-7">
            그래서 어느 쪽이 나은지는 취향이 아니라 계산으로 답할 수 있습니다.
            아래가 그 계산입니다.
          </p>
        </div>

        <TermBreakdown
          title="시점 하나에서 갈라지는 것들"
          items={[
            {
              term: "누가 비용을 치르는가",
              description:
                "미리 정하면 만드는 쪽이 한 번 치르고, 그때 정하면 사건마다 당사자와 판단하는 쪽이 나눠 치릅니다.",
              example:
                "속도 제한은 입법 과정에서 한 번 논의되고 끝나지만, 과도한 속도였는지는 사건마다 다시 다퉈야 합니다.",
              boundary:
                "만드는 비용은 제도 바깥에서 보이지 않고 사건마다 치르는 비용은 잘 보이므로, 실제보다 기준 쪽이 비싸 보이는 착시가 생깁니다.",
            },
            {
              term: "언제 알 수 있는가",
              description:
                "미리 정하면 행동하기 전에 자기 위치를 알 수 있고, 그때 정하면 끝난 뒤에야 알게 됩니다.",
              example:
                "시속 100이라는 선이 있으면 95로 달리는 사람은 안심하고 달릴 수 있습니다.",
              boundary:
                "미리 알 수 있다는 것은 선 바로 아래까지 마음 놓고 갈 수 있다는 뜻이기도 합니다. 선이 실제 위험과 어긋나는 구간에서 그 안심이 위험해집니다.",
            },
            {
              term: "어긋남이 어디에 남는가",
              description:
                "미리 그은 선은 위험한데 걸리지 않는 경우와 위험하지 않은데 걸리는 경우를 함께 만듭니다.",
              example:
                "빙판에서 시속 90은 위험하지만 걸리지 않고, 텅 빈 직선 도로에서 시속 105는 위험하지 않지만 걸립니다.",
              boundary:
                "이 어긋남을 줄이려고 조건을 잘게 나누면 조문이 길어지고, 앞 글의 안정성 조건이 흔들립니다.",
            },
          ]}
        />
      </section>

      <section id="cost-comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 어느 쪽이 싼지는 사안이 몇 건이냐가 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            비용을 세 덩어리로 갈라 놓으면 답이 나옵니다. 미리 정해 두는 데 드는
            비용은 한 번뿐이고, 사건마다 판단하는 비용은 건수만큼 붙으며, 미리
            그은 선이 실제와 어긋나 생기는 손해도 건수만큼 붙습니다.
          </p>

          <p className="leading-7">
            그러면 사안이 많아질수록 한 번 치르는 비용이 사건당으로는 얇아지고,
            사건마다 붙는 비용은 그대로입니다. 어느 지점에서 두 총액이 뒤집힙니다.
          </p>

          <p className="leading-7">
            이 계산이 설명해 주는 것이 하나 있습니다. 왜 교통 규칙은 숫자로 적혀
            있고 이혼할 때 재산을 어떻게 나눌지는 기여도라는 말로만 적혀 있는지
            입니다. 앞은 해마다 수백만 건이고 뒤는 사건마다 사정이 전혀 다릅니다.
          </p>
        </div>

        <ExplainedFormula
          question="같은 내용을 미리 적어 둘지 그때 판단할지는 무엇으로 정하는가?"
          idea="두 방식의 총비용을 사안 수로 적어 비교합니다. 미리 적어 두는 쪽은 만들 때 한 번 큰 비용을 치르고 그 뒤로는 선이 실제와 어긋나 생기는 손해만 사건마다 붙습니다. 그때 판단하는 쪽은 만드는 비용이 거의 없는 대신 사건마다 판단 비용을 치릅니다. 두 총액이 같아지는 사안 수가 갈림길이 됩니다."
          formula={String.raw`c_{R} + n\,m \;<\; n\,c_{S} \quad\Longleftrightarrow\quad n \;>\; n^{*} = \frac{c_{R}}{c_{S}-m}`}
          annotatedFormula={String.raw`\underbrace{c_{R} + n\,m}_{\text{미리 적어 둘 때}} \;<\; \underbrace{n\,c_{S}}_{\text{그때 판단할 때}} \quad\Longleftrightarrow\quad n \;>\; \underbrace{\frac{c_{R}}{c_{S}-m}}_{\text{뒤집히는 사안 수}}`}
          operations={[
            {
              expression: String.raw`c_{R} + n\,m`,
              annotation: [
                "만들 때 한 번 치르는 비용에, 미리 그은 선이 실제와 어긋나 생기는 손해를 사건 수만큼 더한 값입니다.",
                "앞 항은 n과 무관하므로 사안이 많아질수록 사건당 부담이 얇아집니다.",
              ],
            },
            {
              expression: String.raw`n\,c_{S}`,
              annotation: [
                "사건마다 무엇이 과도한지를 새로 정하는 비용이며, 당사자가 알아보는 비용과 판단하는 쪽의 비용을 함께 넣습니다.",
                "n에 정비례하므로 사안이 늘어도 사건당 부담이 줄지 않습니다.",
              ],
            },
            {
              expression: String.raw`\frac{c_{R}}{c_{S}-m}`,
              annotation: [
                "두 총액이 같아지는 사안 수입니다. 분모는 사건 하나를 미리 정해 둔 선으로 처리해서 절약되는 몫입니다.",
                "어긋남의 손해 m이 판단 비용에 가까워지면 분모가 0에 가까워져 문턱이 무한히 커집니다. 그런 영역에서는 사안이 아무리 많아도 미리 적어 두면 손해입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`c_{R}`,
              name: "미리 정해 두는 비용",
              description:
                "경우의 수를 조사하고 선을 어디에 그을지 정해 조문으로 적는 데 드는 비용이며 한 번만 듭니다.",
            },
            {
              symbol: String.raw`c_{S}`,
              name: "사건마다 판단하는 비용",
              description:
                "그 사건에서 무엇이 과도한지를 새로 정하는 데 드는 비용입니다.",
            },
            {
              symbol: String.raw`m`,
              name: "어긋남의 기대 손해",
              description:
                "미리 그은 선이 실제 위험과 맞지 않아 생기는 손해를 사건 하나당 평균으로 잡은 값입니다.",
            },
          ]}
          assumptions={[
            "두 방식이 같은 목표를 담을 수 있다고 둡니다. 애초에 미리 적을 수 없는 판단이라면 비교가 성립하지 않습니다.",
            "사안 수를 미리 어림할 수 있다고 둡니다. 새로 생긴 영역에서는 이 값이 가장 불확실합니다.",
            "어긋남의 손해를 사건당 평균으로 잡습니다. 드물지만 아주 큰 손해가 섞여 있으면 평균이 실제 위험을 가립니다.",
          ]}
          interpretation="미리 정해 두는 비용을 1000, 사건마다 판단하는 비용을 12, 어긋남의 손해를 사건당 2로 두면 문턱은 1000 나누기 10으로 100건입니다. 한 해 20건이면 미리 정해 두는 쪽이 1040이고 그때 판단하는 쪽이 240이라 후자가 싸고, 500건이면 2000 대 6000으로 전자가 압도합니다. 여기서 읽어야 할 것은 같은 내용을 담은 두 조문의 우열이 조문 자체가 아니라 그 조문이 걸리는 사안의 수에서 나온다는 점입니다. 읽으면 안 되는 것은 사안이 많으면 언제나 미리 적어 두는 쪽이 낫다는 결론입니다. 같은 500건이라도 어긋남의 손해가 8로 커지면 문턱이 250건으로 밀리고, 200건짜리 영역은 1400 대 2400에서 2600 대 2400으로 뒤집힙니다."
        />

        <CitationBlock
          source="Louis Kaplow · Rules Versus Standards: An Economic Analysis (Duke Law Journal 42권 3호, 1992, 557~629쪽)"
          citeKey={1}
          href="https://doi.org/10.2307/1372840"
        >
          규칙과 기준의 차이를 시점 하나로 정리한 글입니다. 논문은
          &ldquo;규칙과 기준의 유일한 차이는 법에 내용을 부여하는 작업이 개인이
          행동하기 전에 이루어지는가 후에 이루어지는가&rdquo;라고 정의를 좁히고,
          고속도로에서 &ldquo;시속 55마일 초과 금지&rdquo;와 &ldquo;과도한 속도
          금지&rdquo;를 같은 목적의 두 형태로 나란히 놓습니다. 비용에 대해서는
          &ldquo;규칙은 대체로 기준보다 만드는 데 비용이 더 들지만, 기준은
          개인이 어떻게 행동할지 정할 때 해석하는 비용과 판단하는 쪽이 과거
          행위에 적용하는 비용이 더 드는 경향이 있다&rdquo;고 적습니다. 위 식은
          이 두 문장을 가장 짧은 형태로 옮긴 것이며 논문의 모형 자체는 아닙니다.
          하버드 공개 저장소 사본에서 전문을 확인했습니다.
        </CitationBlock>
      </section>

      <section id="interpretation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 어느 쪽을 택해도 해석은 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            숫자로 적어 두면 해석이 필요 없을 것 같지만 그렇지 않습니다. 속도는
            숫자로 적을 수 있어도 차량이 무엇인지, 도로가 어디까지인지는 다시
            말로 적어야 합니다. 말로 적는 순간 뜻이 정해지지 않는 구간이
            생깁니다.
          </p>

          <p className="leading-7">
            그런데 그 구간은 조문 전체가 아닙니다. 공원에 차량을 들이지 말라는
            조문에서 승용차가 걸린다는 데는 다툼이 없고, 유모차를 밀고 들어가는
            사람이 걸리지 않는다는 데도 다툼이 없습니다. 양쪽 끝에는 뜻이 정해진
            구간이 있습니다.
          </p>

          <p className="leading-7">
            문제는 사이입니다. 자전거와 전동 휠체어와 응급차와 기념물로 세워 둘
            옛 전차는 조문만 읽어서는 정해지지 않습니다. 앞 글에서 명확성 조건을
            두고 회색이 있느냐가 아니라 얼마나 넓으냐를 봐야 한다고 한 것이 이
            구간을 가리킵니다.
          </p>

          <p className="leading-7">
            회색을 메우는 도구에는 순서가 있고, 그 순서에는 이유가 있습니다.
            뒤로 갈수록 판단하는 쪽이 채워 넣는 몫이 커지기 때문입니다.
          </p>
        </div>

        <InterpretationCoreViz />

        <AlgorithmBlock
          title="조문을 개별 사안에 대어 판단하는 절차"
          input={[
            "적용을 다투는 조문과 그 조문이 놓인 법 전체",
            "사안의 사실관계",
            "그 조문이 만들어질 때의 기록과 이후의 개정 이력",
          ]}
          steps={[
            {
              code: "쓰인 말의 통상적인 뜻으로 사안이 걸리는지 본다. 걸리거나 확실히 안 걸리면 여기서 끝난다.",
              note: "실제 사건의 대부분이 이 단계에서 끝납니다. 다투어져 기록에 남는 사건은 회색 지대에 들어온 것들뿐이라, 법을 사건 기록으로만 배우면 회색이 실제보다 넓어 보입니다.",
            },
            {
              code: "같은 법의 다른 조문과 맞춰 본다. 같은 말이 다른 곳에서 어떻게 쓰였는지, 예외 조항이 무엇을 전제하는지 본다.",
              note: "한 법 안에서 같은 말은 같은 뜻으로 쓰였다고 보는 것이 출발점입니다. 예외를 따로 적어 두었다는 사실 자체가 원칙의 범위를 알려 주기도 합니다.",
            },
            {
              code: "그 조문이 막으려던 것이 무엇인지 놓고 사안이 거기 해당하는지 본다.",
              note: "공원의 조문이 막으려던 것이 소음과 사고라면 기념물로 세워 둘 전차는 해당하지 않습니다. 다만 목적은 하나로 정해져 있지 않을 때가 많아 이 단계에서 판단이 갈리기 시작합니다.",
            },
            {
              code: "그래도 남으면 만들 때의 기록을 본다. 심사 과정에서 무엇이 논의되었고 무엇이 빠졌는지 확인한다.",
              note: "기록은 그때의 한 사람의 발언일 수도 있어 무게가 고르지 않습니다. 이 단계에 기대는 비중이 클수록 판단의 근거가 조문에서 멀어집니다.",
            },
            {
              code: "적용할 조문 자체가 없으면 흠결인지 아니면 일부러 두지 않은 것인지 가른다.",
              note: "일부러 두지 않은 것을 흠결로 보면 만드는 쪽이 정한 범위를 판단하는 쪽이 넓히는 것이 됩니다. 두 경우를 가르는 것이 이 단계의 실질입니다.",
            },
            {
              code: "흠결이면 비슷한 조문을 끌어다 쓸 수 있는지 본다. 다만 형벌을 넓히는 방향으로는 쓰지 않는다.",
              note: "형벌에서 이 방향을 막는 이유는 처벌 범위가 행위 시점에 정해져 있어야 한다는 데 있습니다. 앞 글의 소급 금지와 같은 뿌리입니다.",
            },
          ]}
          output="그 조문이 사안에 적용되는지에 대한 판정과, 어느 단계에서 답이 갈렸는지 및 그 단계에서 판단하는 쪽이 채워 넣은 몫"
        />
      </section>

      <section id="gaps-and-analogy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 적혀 있지 않은 사안에서 두 방향이 갈립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            회색 지대보다 한 걸음 더 나간 경우가 있습니다. 적용할 조문 자체가
            없는 경우입니다. 새 기술이 나오거나 예상하지 못한 방식의 분쟁이
            생기면 그렇게 됩니다.
          </p>

          <p className="leading-7">
            여기서 먼저 갈라야 할 것이 있습니다. 빠뜨린 것인지 일부러 두지 않은
            것인지입니다. 일부러 규율하지 않기로 한 영역을 빈칸으로 보고 메우면,
            만드는 쪽이 정한 범위를 판단하는 쪽이 넓히는 일이 됩니다.
          </p>

          <p className="leading-7">
            빠뜨린 것이라고 판단되면 비슷한 조문을 끌어다 쓸 수 있습니다. 두
            사안이 그 조문이 겨냥한 성질에서 같다면 같이 다루는 것이 오히려 그
            조문의 뜻에 맞기 때문입니다.
          </p>

          <p className="leading-7">
            그런데 이 방향이 한 영역에서만은 막혀 있습니다. 처벌을 넓히는
            방향입니다.
          </p>
        </div>

        <CitationBlock
          source="대한민국헌법 제12조 제1항 · 제13조 제1항 (한국법제연구원 영문 번역본)"
          citeKey={2}
          href="https://elaw.klri.re.kr/eng_service/lawView.do?hseq=1&lang=ENG"
        >
          제12조 제1항은 &ldquo;누구든지 법률에 의하지 아니하고는 체포·구속·압수·
          수색 또는 심문을 받지 아니하며, 법률과 적법한 절차에 의하지 아니하고는
          처벌·보안처분 또는 강제노역을 받지 아니한다&rdquo;고 정합니다. 제13조
          제1항은 &ldquo;모든 국민은 행위시의 법률에 의하여 범죄를 구성하지
          아니하는 행위로 소추되지 아니하며, 동일한 범죄에 대하여 거듭 처벌받지
          아니한다&rdquo;고 합니다. 위 본문에서 처벌을 넓히는 방향의 유추가 막혀
          있다고 한 근거가 이 두 조문이며, 처벌의 근거가 법률에 있어야 한다는 것과
          그 법률이 행위 시점에 있어야 한다는 것이 각각 한 조문씩 대응합니다.
          번역본은 참조용이며 법적 효력은 국문 원문에 있다고 이 사이트가
          명시합니다.
        </CitationBlock>

        <ProgressiveDetail
          title="왜 형벌에서만 유추를 막는가?"
          preview="같은 도구가 한쪽에서는 뜻을 살리고 다른 쪽에서는 예고 없는 처벌이 됩니다."
        >
          <p className="leading-7">
            사인 사이의 분쟁에서 비슷한 조문을 끌어다 쓰면, 누군가는 지고
            누군가는 이깁니다. 그 결과가 예상과 다를 수는 있어도 새로운 종류의
            불이익이 생기지는 않습니다.
          </p>
          <p className="leading-7">
            형벌은 다릅니다. 행위 시점에 처벌 대상이 아니었던 행동을 나중에
            비슷하다는 이유로 처벌하면, 그 사람은 조심할 방법이 애초에 없었습니다.
            앞 글의 소급 금지가 막으려던 것과 정확히 같은 일이 해석의 형태로
            일어나는 것입니다.
          </p>
          <p className="leading-7">
            그래서 이 금지는 해석 기술의 문제가 아니라 처벌의 조건에 관한
            것입니다. 다만 경계는 여전히 다투어집니다. 조문의 뜻을 넓게 읽는
            것과 없는 조문을 끌어다 쓰는 것이 언제나 뚜렷이 갈리지는 않기
            때문입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한 번 메운 회색은 그 사건에서 끝나지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글은 조문을 사안에 대는 일까지 다뤘습니다. 미리 적어 둘지 그때
            정할지를 사안 수와 어긋남의 손해로 계산했고, 어느 쪽을 택해도 남는
            회색을 무슨 순서로 메우는지 봤습니다.
          </p>

          <p className="leading-7">
            그런데 한 사건에서 회색을 메운 판단은 그 사건과 함께 사라지지
            않습니다. 다음에 비슷한 사건이 오면 앞의 판단이 근거로 제시되고, 그것이
            반복되면 조문에 적혀 있지 않은 내용이 사실상 규칙처럼 굳습니다.
          </p>

          <p className="leading-7">
            그러면 이 글의 계산이 한 겹 더 복잡해집니다. 처음에는 기준으로 둔
            영역도 판단이 쌓이면서 점점 규칙에 가까워지기 때문입니다. 미리 적어
            두는 일을 만드는 쪽만 하는 것이 아니라는 뜻입니다.
          </p>

          <p className="leading-7">
            다음 글{" "}
            <Link to="/law/legal-system/precedent-and-legal-change">
              선례와 법의 변화
            </Link>
            가 그 과정을 맡습니다. 앞선 판단이 왜 구속력을 갖는지, 그리고 언제
            뒤집는 것이 옳은지가 주제입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
