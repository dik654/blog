import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import PrecedentChainViz from "./precedent-and-legal-change/viz/PrecedentChainViz";
import OverrulingThresholdViz from "./precedent-and-legal-change/viz/OverrulingThresholdViz";

/**
 * 앞선 판단은 왜 구속하고 언제 뒤집습니까
 *
 * 2편이 회색을 메우는 도구까지 다뤘으니, 메운 판단이 다음 사건에 갖는 힘을
 * 받는다. 무엇이 끌려오는지·왜 따르는지·어떻게 피하는지·언제 뒤집는지까지가
 * 범위이고, 사인 사이의 구체적 관계는 다음 카테고리가 소유한다.
 */
export default function PrecedentAndLegalChangeArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한 사건에서 메운 회색은 그 사건에서 끝나지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글은 조문을 사안에 대는 일까지 다뤘습니다. 회색 지대가 남고 그 회색을 문언·체계·목적·기록 순서로 메운다는 것이었습니다.
          </p>

          <p className="leading-7">
            그런데 메운 뒤에 무슨 일이 일어나는지는 다루지 않았습니다. 다음에 비슷한 사건이 오면 앞의 판단이 근거로 제시되고 그것이 반복되면 조문에 적혀 있지 않은 선이 사실상 규칙처럼
            굳습니다.
          </p>

          <p className="leading-7">
            그러면 앞 글의 계산이 한 겹 더 복잡해집니다. 기준으로 두기로 한
            영역도 시간이 지나면서 규칙에 가까워지기 때문입니다. 미리 적어 두는
            일을 만드는 쪽만 하는 것이 아니라는 뜻입니다.
          </p>
        </div>

        <PrecedentChainViz />

        <ContentBoundary article="precedent-and-legal-change" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              앞선 판단은 무엇을 근거로 다음 사건을 구속하고, 언제 그것을 뒤집는
              것이 옳은가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 앞 판단에서 무엇이 끌려오는지, 왜 따라야 하는지, 따르지 않으면서
            뒤집지도 않는 통로가 무엇인지, 그리고 뒤집을 때가 언제인지입니다.
          </p>

          <p className="leading-7">
            여기까지가 법이 작동하는 방식에 관한 이야기입니다. 이 장치들이 실제
            관계에서 무엇을 정하는지는 다음 카테고리에서 시작합니다. 첫 글은{" "}
            <Link to="/law/private-law/contract-and-enforceable-promise">
              계약
            </Link>
            이고, 어떤 약속을 법이 지켜 주는지를 묻습니다.
          </p>
        </div>
      </section>

      <section id="what-binds" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 끌려오는 것은 결론이 아니라 이유입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 사건에서 원고가 이겼다는 사실 자체는 다음 사건에 아무 힘이
            없습니다. 두 사건의 당사자가 다르고 사실도 다릅니다. 끌려오는 것은
            결론이 아니라 그 결론을 떠받친 이유입니다.
          </p>

          <p className="leading-7">
            그래서 판결문을 읽을 때 먼저 할 일이 어느 부분이 그 이유인지 가려내는
            것입니다. 판결문에는 결론에 이르는 데 꼭 필요했던 판단과, 설명을 위해
            곁들인 말이 함께 들어 있습니다. 앞의 것만 다음 사건을 구속합니다.
          </p>

          <p className="leading-7">
            가려내는 방법은 빼 보는 것입니다. 그 판단을 빼면 같은 결론이 나오지 않는다면 그것은 이유이고 빼도 결론이 그대로라면 곁들인 말입니다. 다만 실제 판결문에서 이 구분이 언제나
            뚜렷하지는 않고 그 자체가 다음 사건의 다툼거리가 되기도 합니다.
          </p>

          <p className="leading-7">
            한 가지 더 있습니다. 이유는 그 사건의 사실과 묶여 있습니다. 어느 범위의 사실까지를 그 이유가 덮는지가 정해져 있지 않고 그 범위를 좁히는 것이 3절에서 볼 통로가 됩니다.
          </p>
        </div>

        <CitationBlock
          source="Stanford Encyclopedia of Philosophy · Precedent and Analogy in Legal Reasoning (Grant Lamond, 2006년 6월 20일 초판)"
          citeKey={1}
          href="https://plato.stanford.edu/entries/legal-reas-prec/"
        >
          앞선 판단이 어떤 방식으로 다음 사건에 작용하는지를 정리한 항목입니다.
          구속하는 부분을 &ldquo;그 사건이 근거가 되는 법명제이며, 뒤의 법원을
          구속하는 측면&rdquo;으로 규정하고, 나머지를 &ldquo;판결에서 표현된 다른
          진술과 견해로서 뒤의 법원을 구속하지 않는 것&rdquo;으로 갈라 놓습니다.
          범위를 좁히는 실무에 대해서는 뒤의 법원이 &ldquo;구속력 있는 선례를
          따르거나 구별하거나 둘 중 하나를 해야 하는 선언적 의무&rdquo;를 진다고
          적습니다. 따르는 이유로는 같은 사안을 같이 다루는 것, 그때그때 새로
          정하는 것보다 예측이 쉬워진다는 것, 이미 형성된 기대를 지킨다는 것,
          그리고 법원이 미결 부분을 채워 법을 개선한다는 것 넷을 듭니다. 아래
          4절의 계산은 이 항목에 있는 것이 아니라 그 이유들 가운데 둘을 견주어
          이 글에서 직접 전개한 것입니다.
        </CitationBlock>
      </section>

      <section id="why-follow" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 따르는 이유는 넷이고 서로 다른 것을 지킵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 판단을 따라야 할 이유를 하나로 말하면 설명이 막힙니다. 이유가
            여럿이고 각각 다른 것을 지키기 때문입니다. 그래서 어떤 상황에서는
            한 이유가 강해지고 다른 이유가 약해집니다.
          </p>

          <p className="leading-7">
            첫째는 같은 사안을 같이 다뤄야 한다는 것입니다. 사실이 같은데 결과가
            다르면, 다른 결과를 만든 것은 사건의 사실이 아니라 누가 재판했느냐가
            됩니다.
          </p>

          <p className="leading-7">
            둘째는 예측입니다. 매번 새로 정하면 아무도 미리 알 수 없습니다. 1편의
            형식 조건이 조문에 요구한 것을 판단의 층에서 다시 요구하는 셈입니다.
          </p>

          <p className="leading-7">
            셋째는 이미 그 판단에 맞춰 한 일들입니다. 계약을 그렇게 쓰고 등기를
            그렇게 하고 사업을 그렇게 벌여 놓았다면, 판단이 바뀔 때 그 모든 것이
            함께 흔들립니다.
          </p>

          <p className="leading-7">
            넷째는 비용입니다. 앞 글에서 사건마다 판단하는 비용을 세었는데,
            선례가 있으면 그 비용이 크게 줄어듭니다. 선례는 판단하는 쪽이 사후에
            만들어 낸 규칙이고, 그래서 앞 글의 계산이 여기서 다시 돕니다.
          </p>
        </div>

        <TermBreakdown
          title="네 이유가 각각 강해지는 상황"
          items={[
            {
              term: "같은 사안을 같이",
              description:
                "사실이 같은 두 사건의 결과가 다르면 결과를 만든 것이 사실이 아니라 재판부가 됩니다.",
              example:
                "같은 조항을 놓고 같은 다툼이 벌어졌는데 법원마다 답이 다르면, 어느 법원에 가느냐가 사건의 승패를 정합니다.",
              boundary:
                "두 사건이 정말 같은지는 어느 사실을 중요하게 보느냐에 달려 있어, 이 이유만으로는 범위가 정해지지 않습니다.",
            },
            {
              term: "미리 알 수 있게",
              description:
                "판단이 반복되면 사람들이 자기 위치를 미리 알 수 있게 됩니다. 앞 글들의 형식 조건이 판단의 층에서 다시 요구되는 것입니다.",
              example:
                "같은 유형의 분쟁에서 어떤 결과가 나올지 알면 소송을 하지 않고 미리 정리할 수 있습니다.",
              boundary:
                "예측 가능성은 그 판단이 옳은지와 무관하게 커집니다. 잘못된 판단도 반복되면 예측 가능해집니다.",
            },
            {
              term: "이미 해 둔 것",
              description:
                "그 판단을 믿고 계약을 쓰고 등기를 하고 사업을 벌여 놓은 것이 있으면, 바뀔 때 함께 흔들립니다.",
              example:
                "어떤 조항이 유효하다는 판단을 믿고 같은 조항으로 수천 건의 계약을 맺어 두었다면 변경의 파장이 큽니다.",
              boundary:
                "모든 기대가 보호되는 것은 아닙니다. 판단이 곧 바뀔 것이 예상되던 영역에서의 기대는 무게가 가볍습니다.",
            },
            {
              term: "다시 정하지 않아도 됨",
              description:
                "앞 글에서 센 사건당 판단 비용이 선례가 있으면 크게 줄어듭니다.",
              example:
                "기준으로 적힌 조문이라도 판단이 쌓이면 사실상 규칙처럼 적용되어 사건 처리가 빨라집니다.",
              boundary:
                "비용이 줄어드는 만큼 어긋남의 손해는 남습니다. 앞 글의 두 항목이 그대로 다시 나타납니다.",
            },
          ]}
        />
      </section>

      <section id="distinguishing" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 뒤집지 않고도 방향을 바꾸는 통로가 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 판단을 따르기 어려운 사건이 왔을 때 선택지가 둘뿐이라면 제도가
            매우 뻣뻣해집니다. 그대로 따르거나 뒤집는 것입니다. 그런데 실제로는
            세 번째 길이 훨씬 자주 쓰입니다.
          </p>

          <p className="leading-7">
            사실의 차이를 짚는 것입니다. 앞 사건에는 없던 사정이 이 사건에 있고
            그 사정이 앞 판단의 이유가 겨냥한 성질과 관련이 있다면, 앞 판단은 이
            사건에 닿지 않습니다. 앞 판단을 부정하지 않으면서 그 범위를 좁히는
            것입니다.
          </p>

          <p className="leading-7">
            이 통로가 제도를 부드럽게 만듭니다. 잘못된 판단이라도 한 번에
            뒤집지 않고 범위를 좁혀 가며 실질적으로 무력화할 수 있고, 그 과정에서
            어떤 사실이 중요한지가 드러납니다.
          </p>

          <p className="leading-7">
            대가도 있습니다. 좁히기가 반복되면 규칙이 예외의 목록으로 변해 예측이
            다시 어려워집니다. 그리고 겉으로는 따르는 것처럼 보이면서 실제로는
            따르지 않는 상태가 되어, 무엇이 현재의 규칙인지 읽기 어려워집니다.
          </p>
        </div>

        <AlgorithmBlock
          title="앞선 판단을 이 사건에 어떻게 처리할지 정하는 절차"
          input={[
            "앞 판단의 사실관계와 결론, 그리고 결론을 떠받친 이유",
            "이 사건의 사실관계",
            "그 사이에 있었던 관련 판단과 조문의 개정",
          ]}
          steps={[
            {
              code: "앞 판결문에서 결론에 꼭 필요했던 판단과 곁들인 말을 가른다.",
              note: "빼 보는 것이 방법입니다. 빼면 같은 결론이 나오지 않는 판단이 이유이고, 빼도 결론이 그대로인 것은 곁들인 말입니다.",
            },
            {
              code: "그 이유가 어느 범위의 사실까지를 덮는지 적어 본다.",
              note: "이유는 그 사건의 사실과 묶여 있고 범위가 미리 정해져 있지 않습니다. 이 단계에서 적은 범위가 다음 단계의 판단 대상입니다.",
            },
            {
              code: "이 사건에 앞 사건에 없던 사정이 있는지 보고, 있다면 그 사정이 이유가 겨냥한 성질과 관련 있는지 본다.",
              note: "관련 없는 차이로 갈라 세우면 사실상 뒤집으면서 뒤집지 않은 것처럼 보이게 됩니다. 관련성이 이 통로의 정당성을 지탱합니다.",
            },
            {
              code: "관련 있는 차이가 있으면 범위를 좁혀 적용하지 않는다. 좁힌 범위가 앞 사건의 결론을 여전히 떠받치는지 확인한다.",
              note: "좁힌 결과가 앞 사건의 결론까지 무너뜨린다면 그것은 좁히기가 아니라 뒤집기입니다. 이름과 실질이 갈리지 않게 하는 점검입니다.",
            },
            {
              code: "관련 있는 차이가 없으면 따르거나 뒤집는다. 뒤집으려면 다음 절의 비교를 한다.",
              note: "여기서 비로소 변경이 선택지가 됩니다. 앞의 네 단계는 변경을 피할 길이 있는지 확인하는 과정입니다.",
            },
            {
              code: "좁히기가 이미 여러 번 쌓였는지 확인한다. 쌓였다면 규칙이 예외의 목록이 되어 있는지 본다.",
              note: "예외가 원칙보다 길어졌다면 좁히기를 한 번 더 하는 것보다 정리해 다시 세우는 편이 예측 가능성에 낫습니다.",
            },
          ]}
          output="이 사건에 앞 판단을 적용할지에 대한 판정과, 적용하지 않는다면 그것이 범위를 좁힌 것인지 뒤집은 것인지에 대한 구분"
        />
      </section>

      <section id="when-to-overrule" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 뒤집을 때가 언제인지는 견줘서 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 판단이 틀렸다는 것만으로는 뒤집을 이유가 되지 않습니다. 틀린 채로 두는 데도 얻는 것이 있고 바로잡는 데도 치르는 것이 있기 때문입니다. 그래서 비교가 필요합니다.
          </p>

          <p className="leading-7">
            얻는 쪽부터 보면, 더 나은 규칙으로 바꾸면 앞으로 오는 사건마다 조금씩 나아집니다. 이 개선은 한 번이 아니라 계속 쌓이고 그래서 그 규칙이 앞으로 얼마나 오래 쓰일지가
            크기를 정합니다.
          </p>

          <p className="leading-7">
            치르는 쪽은 둘입니다. 이미 그 판단에 맞춰 해 둔 것들이 흔들리고 뒤집는 행위 자체가 앞으로의 안정성을 낮춥니다. 이 둘은 지금 한 번에 발생합니다.
          </p>

          <p className="leading-7">
            앞으로 계속 쌓이는 것과 지금 한 번에 치르는 것을 견주려면 금융 쪽에서
            쓰던 도구가 필요합니다. 미래의 값을 오늘의 값으로 바꾸는{" "}
            <Link to="/finance/money/time-value-and-discounting#discounting">
              할인계수
            </Link>
            입니다.
          </p>
        </div>

        <ExplainedFormula
          question="앞선 판단이 틀렸다면 언제 뒤집는 것이 나은가?"
          idea="바꾸면 앞으로 오는 사건마다 조금씩 나아지고 그 개선이 계속 쌓입니다. 반면 뒤집는 값은 지금 한 번에 치릅니다. 이미 그 판단에 맞춰 해 둔 것이 흔들리는 몫과, 뒤집는 행위 자체가 앞으로의 안정성을 낮추는 몫입니다. 앞으로 쌓일 것을 오늘의 값으로 바꿔 지금 치를 값과 견주면 판정이 나옵니다."
          formula={String.raw`\frac{\delta}{1-\delta}\,\Delta \;>\; R + S`}
          annotatedFormula={String.raw`\underbrace{\frac{\delta}{1-\delta}\,\Delta}_{\text{앞으로 쌓일 개선의 현재 값}} \;>\; \underbrace{R + S}_{\text{지금 한 번에 치르는 값}}`}
          operations={[
            {
              expression: String.raw`\frac{\delta}{1-\delta}`,
              annotation: [
                "다음 기간부터 매 기간 1씩 받는 흐름을 오늘의 값으로 바꾼 배수입니다.",
                "δ가 1에 가까워질수록 이 배수가 급격히 커집니다. 같은 개선 폭이라도 앞으로 오래 쓰일 규칙일수록 바꿀 이유가 커진다는 뜻입니다.",
              ],
            },
            {
              expression: String.raw`\Delta`,
              annotation: [
                "새 규칙이 헌 규칙보다 사건 하나당 얼마나 나은지입니다. 판단이 얼마나 틀렸는지가 여기 들어갑니다.",
                "이 값이 0이면 좌변이 0이 되어 어떤 경우에도 뒤집지 않습니다. 틀리지 않은 판단을 바꿀 이유가 없다는 것이 식에서 그대로 나옵니다.",
              ],
            },
            {
              expression: String.raw`R + S`,
              annotation: [
                "앞의 항은 이미 그 판단에 맞춰 해 둔 것이 흔들리는 몫이고, 뒤의 항은 뒤집는 행위가 앞으로의 안정성을 낮추는 몫입니다.",
                "둘 다 지금 한 번에 발생하므로 할인하지 않습니다. 좌변만 할인 대상인 것이 이 비교의 핵심입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\delta`,
              name: "같은 문제가 또 올 몫",
              description:
                "다음 기간의 1이 지금 얼마인지를 나타내며, 할인과 그 규칙이 앞으로 쓰일 가능성을 함께 담습니다.",
            },
            {
              symbol: String.raw`R`,
              name: "이미 쌓인 신뢰 이익",
              description:
                "그 판단을 믿고 맺은 계약과 해 둔 등기와 벌여 놓은 사업이 바뀔 때 흔들리는 몫입니다.",
            },
            {
              symbol: String.raw`S`,
              name: "안정성 훼손",
              description:
                "한 번 뒤집었다는 사실 자체가 다른 판단들도 뒤집힐 수 있다는 신호가 되어 예측 가능성을 낮추는 몫입니다.",
            },
          ]}
          assumptions={[
            "새 규칙이 실제로 더 낫다고 둡니다. 무엇이 더 나은지에 대한 판단이 갈리면 Δ의 부호부터 다투어집니다.",
            "개선이 사건마다 같은 크기로 쌓인다고 둡니다. 실제로는 사회가 바뀌면서 그 크기도 함께 변합니다.",
            "신뢰 이익과 안정성 훼손을 같은 단위로 잴 수 있다고 둡니다. 둘 다 어림값이라 비교의 방향은 믿을 수 있어도 수치는 그렇지 않습니다.",
          ]}
          interpretation="사건당 개선을 3, 신뢰 이익을 40, 안정성 훼손을 20으로 두면 치를 값은 60입니다. 같은 문제가 또 올 몫이 0.9이면 앞으로 얻을 개선의 현재 값이 27이라 그대로 두는 쪽이 낫고, 0.95이면 57로 올라와도 아직 모자랍니다. 0.97이 되면 97이 되어 뒤집는 쪽이 낫습니다. 여기서 읽어야 할 것은 같은 규칙과 같은 개선 폭인데 남은 기간이 길다는 이유만으로 판정이 바뀐다는 점입니다. 또 하나는 신뢰 이익의 크기가 영역마다 다르다는 것입니다. 같은 0.95에서도 신뢰 이익이 10뿐이면 치를 값이 30으로 내려가 57이 이를 넘습니다. 재산과 계약에서 판례 변경이 드물고 절차나 증거 영역에서 상대적으로 잦은 것이 이 차이로 설명됩니다. 읽으면 안 되는 것은 이 식이 실제 변경을 예측한다는 결론입니다. 세 값 모두 사건 밖에서 관측되지 않는 어림이라, 이 식이 주는 것은 수치가 아니라 무엇을 견줘야 하는지에 대한 목록입니다."
        />

        <OverrulingThresholdViz />

        <div id="retroactivity" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            뒤집으면 언제부터 적용되는가
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              앞의 계산에는 빠진 것이 하나 있습니다. 뒤집은 새 판단이 언제부터
              적용되느냐입니다. 지금 다투고 있는 그 사건에도 적용되어야 하는지가
              먼저 걸립니다.
            </p>

            <p className="leading-7">
              적용하지 않으면 이상해집니다. 그 사건을 가지고 온 사람은 바뀐
              판단의 혜택을 받지 못하는데, 바꾸게 만든 것은 그 사람입니다. 그러면
              아무도 판단을 바꾸려 다투지 않게 됩니다.
            </p>

            <p className="leading-7">
              적용하면 다른 쪽이 이상해집니다. 그 사람은 행동할 당시의 판단에
              맞춰 행동했는데 나중에 바뀐 잣대로 재게 됩니다. 1편에서 소급 적용이
              왜 문제인지 봤던 것과 같은 구조입니다.
            </p>

            <p className="leading-7">
              그래서 이 문제는 해소되는 것이 아니라 어느 쪽 비용을 질지 고르는
              것에 가깝습니다. 다만 형벌에서는 고를 여지가 훨씬 좁습니다. 앞 글의
              유추 금지와 같은 이유로, 불리한 방향의 변경을 지난 행위에 대는 것이
              막혀 있기 때문입니다.
            </p>
          </div>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          판단이 쌓일수록 법은 규칙에 가까워집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글에서 본 과정에는 방향이 있습니다. 회색으로 시작한 영역이 판단이 쌓이면서 점점 좁아지고 어느 시점부터는 조문에 적힌 것과 거의 같은 정도로 예측할 수 있게 됩니다.
          </p>

          <p className="leading-7">
            그러면 앞 글의 맞바꿈이 그대로 돌아옵니다. 예측이 쉬워진 만큼 어긋남의 손해가 남고 좁히기로 그것을 줄이려 하면 예외의 목록이 길어집니다. 기준을 골랐다고 해서 기준의 성질이
            계속 유지되지는 않습니다.
          </p>

          <p className="leading-7">
            여기서 법이 작동하는 방식에 관한 세 글이 끝납니다. 무엇이 법인지,
            그 문장을 사안에 어떻게 대는지, 그리고 그렇게 댄 판단이 어떻게 다시
            규범이 되는지까지 봤습니다.
          </p>

          <p className="leading-7">
            다음 카테고리부터는 이 장치들이 실제 관계에서 무엇을 정하는지를
            봅니다. 첫 글{" "}
            <Link to="/law/private-law/contract-and-enforceable-promise">
              계약
            </Link>
            은 어떤 약속을 법이 지켜 주고, 어겼을 때 무엇을 물리는지를 묻습니다.
            국제 관계에서 강제 없이 약속이 서는 조건을 봤던 것과 정반대 쪽에서
            같은 문제를 보는 셈입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
