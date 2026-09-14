import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ClaimLadderViz from "./equity-claims-and-valuation/viz/ClaimLadderViz";
import GordonSensitivityViz from "./equity-claims-and-valuation/viz/GordonSensitivityViz";

/**
 * 주주는 아무것도 약속받지 못한 대신 남는 것을 전부 갖습니다
 *
 * 6편이 "적혀 있는 현금흐름"을 다뤘으므로, 이 글은 적혀 있지 않은 쪽을 맡는다.
 * 분자와 분모가 동시에 불확실해지는 구조와 그 결과를 다루며, 위험을 어떻게
 * 값으로 매기는지는 다음 글이 소유한다.
 */
export default function EquityClaimsAndValuationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          같은 회사에 걸린 청구권들이 순위대로 줄을 서 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            회사가 벌어들인 돈은 정해진 순서로 나갑니다. 거래처와 직원, 세금, 그다음 채권자의 이자와 원금, 우선주, 마지막이 보통주 주주입니다. 앞 순위가 다 받고 남은 것이 주주
            몫입니다. 남지 않으면 아무것도 받지 못합니다.
          </p>

          <p className="leading-7">
            그래서 주식에는 표면금리도 만기도 없습니다.{" "}
            <Link to="/finance/markets/bond-pricing-and-yield-curve#cashflow-to-price">
              채권 글
            </Link>
            에서는 받을 금액과 날짜가 적혀 있어 식에 그대로 넣기만 하면 됐지만,
            여기서는 넣을 숫자 자체를 추정해야 합니다.
          </p>

          <p className="leading-7">
            불확실해지는 것은 분자만이 아닙니다. 마지막 순위라는 위치 때문에 같은 회사의 실적 변화가 주주 몫에서는 더 크게 흔들립니다. 그만큼 더 높은 보상을 요구하게 되어 분모도
            커집니다. 분자와 분모가 함께 흔들리는 것이 주식 가치평가의 본질적인 어려움입니다.
          </p>
        </div>

        <ClaimLadderViz />

        <ContentBoundary article="equity-claims-and-valuation" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              아무것도 약속받지 못한 청구권에 어떻게 값을 매기고, 그 값이 왜
              채권보다 훨씬 크게 흔들리는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 청구권의 순위와 유한책임이 만드는 비대칭, 자본구조가 주주
            수익을 증폭하는 방식, 적혀 있지 않은 현금흐름을 할인하는 모형과 그
            모형의 민감도, 그리고 실무가 쓰는 우회로입니다.
          </p>

          <p className="leading-7">
            위험에 얼마를 요구해야 하는지, 곧 분모 r을 정하는 문제는 이 글에서
            열어 두고 다음 글로 넘깁니다. 그 자리는{" "}
            <Link to="/finance/risk/risk-diversification-and-pricing">
              위험의 값
            </Link>
            이 맡습니다.
          </p>
        </div>
      </section>

      <section id="residual-claim" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 마지막 순위이면서 아래가 막혀 있다는 것이 핵심입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            주주는 마지막에 받지만 손실도 무한정 지지는 않습니다. 회사가 아무리
            큰 빚을 남기고 무너져도 주주가 개인 재산으로 갚을 의무는 없고,
            투자한 금액을 잃는 데서 멈춥니다. 이것이 <strong>유한책임</strong>
            입니다.
          </p>

          <p className="leading-7">
            두 성질이 합쳐지면 독특한 모양이 나옵니다. 회사 가치가 부채보다 작으면 주주 몫은 0에서 더 내려가지 않고 부채를 넘어서면 넘어선 만큼 전부 주주 몫이 됩니다. 아래는 막혀
            있고 위는 열려 있는 비대칭 구조입니다.
          </p>

          <p className="leading-7">
            이 비대칭은 값을 매길 때도 행동을 설명할 때도 중요합니다. 회사가
            어려워질수록 주주는 위험한 선택을 선호하게 됩니다. 잘되면 전부
            자기 몫이고 잘못돼도 이미 0에서 더 잃을 것이 없기 때문입니다.
            채권자가 계약서에 여러 제약을 붙이는 이유가 여기에 있습니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 회사에 걸린 세 청구권의 성격"
          items={[
            {
              term: "채권자의 청구권",
              description:
                "금액과 시점이 적혀 있고 순위가 앞섭니다. 회사가 아주 잘돼도 약속된 것보다 더 받지는 못합니다.",
              example:
                "이자 5%짜리 회사채는 회사 이익이 두 배가 되어도 이자가 5%입니다.",
              boundary:
                "위가 막혀 있으므로 상방을 포기한 대신 앞 순위를 얻은 계약이며, 그래서 요구 수익률이 더 낮습니다.",
            },
            {
              term: "우선주의 청구권",
              description:
                "보통주보다 앞서서 정해진 배당을 받지만 채권자보다는 뒤입니다. 둘의 성격을 섞어 둔 중간 계약입니다.",
              example:
                "정해진 배당을 먼저 받되 잔여재산 분배에서도 보통주보다 앞섭니다.",
              boundary:
                "발행 조건에 따라 의결권·전환권·누적 여부가 달라 하나로 묶어 말할 수 없습니다.",
            },
            {
              term: "보통주의 청구권",
              description:
                "앞 순위가 다 받고 남은 것을 전부 갖습니다. 약속된 금액이 없는 대신 상방에 한도가 없습니다.",
              example:
                "이익이 늘면 배당과 주가 상승으로 그 몫이 그대로 돌아옵니다.",
              boundary:
                "남지 않으면 0이며, 유한책임 덕분에 0보다 아래로 내려가지는 않습니다.",
            },
          ]}
        />
      </section>

      <section id="leverage" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 같은 사업이라도 빚을 섞으면 주주 몫의 진폭이 커집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            자산 100억 원으로 연 8억 원을 버는 회사가 있습니다. 전부 자기 돈이면 주주 수익률은 8%입니다. 그런데 50억을 연 5%에 빌려 썼다면 이자 2.5억을 빼고 5.5억이
            남습니다. 주주가 넣은 50억 대비 11%가 됩니다. 같은 사업인데 주주 수익률이 올랐습니다.
          </p>

          <p className="leading-7">
            공짜는 아닙니다. 사업이 나빠져 자산 수익률이 3%로 떨어지면 3억에서
            이자 2.5억을 빼고 0.5억만 남아 주주 수익률은 1%가 됩니다. 빚이
            없었다면 3%였을 것입니다. 좋을 때 더 좋고 나쁠 때 더 나쁜 것이{" "}
            <strong>재무레버리지</strong>입니다.
          </p>

          <p className="leading-7">
            그래서 자본구조는 주주 수익률의 <em>기대값</em>과 <em>변동폭</em>을
            함께 바꿉니다. 앞 절에서 본 유한책임까지 겹치면, 빚이 많을수록
            주주의 몫은 아래가 막힌 채 진폭만 커지는 모양에 가까워집니다.
          </p>
        </div>

        <ExplainedFormula
          question="같은 자산 수익률에서 빚의 비중이 주주 수익률을 어떻게 바꾸는가?"
          idea="회사가 번 것에서 채권자에게 약속한 이자를 먼저 떼고 남는 것이 주주 몫입니다. 자산이 버는 비율과 빚에 주는 비율의 차이만큼이 남고, 그 차이가 주주가 넣은 돈 대비 몇 배로 얹히는지는 빚과 자기자본의 비율이 정합니다."
          formula={String.raw`ROE = ROA + \frac{D}{E}\left(ROA - r_d\right)`}
          annotatedFormula={String.raw`ROE = \underbrace{ROA}_{\text{사업 자체의 수익률}} + \underbrace{\frac{D}{E}}_{\text{증폭 배수}} \cdot \underbrace{\left(ROA - r_d\right)}_{\text{빌린 돈이 남긴 차이}}`}
          operations={[
            {
              expression: String.raw`ROA - r_d`,
              annotation: [
                "자산이 버는 비율에서 빚에 주기로 한 비율을 뺀 차이입니다.",
                "차가 양수면 빌릴수록 주주 몫이 늘고, 음수면 빌릴수록 줄어듭니다.",
              ],
            },
            {
              expression: String.raw`\frac{D}{E}`,
              annotation: [
                "빚을 자기자본으로 나눠, 그 차이가 주주가 넣은 돈 대비 몇 배로 얹히는지를 구합니다.",
                "나눗셈은 절대 금액이 아니라 주주 돈 한 단위당 효과로 정규화합니다.",
              ],
            },
            {
              expression: String.raw`\frac{D}{E}\left(ROA - r_d\right)`,
              annotation: [
                "곱은 차이와 배수를 결합해 레버리지가 더하거나 빼는 몫을 만듭니다.",
                "부호가 그대로 유지되므로 이 항 하나가 증폭의 방향과 크기를 모두 담습니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`ROA`,
              name: "자산 수익률",
              description:
                "자금을 어디서 조달했는지와 무관하게 사업 자체가 자산 대비 얼마를 버는지입니다.",
            },
            {
              symbol: String.raw`ROE`,
              name: "자기자본 수익률",
              description:
                "주주가 넣은 돈 대비 남는 몫의 비율입니다. 주주가 실제로 체감하는 수익률입니다.",
            },
            {
              symbol: String.raw`r_d`,
              name: "차입 금리",
              description: "빌린 돈에 약속한 이자율입니다.",
            },
            {
              symbol: String.raw`D, E`,
              name: "부채와 자기자본",
              description:
                "자금 조달의 두 원천이며 합이 자산입니다. 둘의 비율이 증폭 배수를 정합니다.",
            },
          ]}
          assumptions={[
            "차입 금리가 부채 비중과 무관하게 고정이라고 둡니다. 실제로는 빚이 많아질수록 채권자가 더 높은 금리를 요구합니다.",
            "세금과 파산 비용을 넣지 않았습니다. 둘 다 자본구조의 효과를 바꿉니다.",
            "자산 수익률이 자본구조와 독립이라고 둡니다. 조달 구조가 투자 결정에 영향을 주면 이 전제가 깨집니다.",
          ]}
          interpretation="ROA가 8%, 차입 금리가 5%, 부채와 자기자본이 같으면 ROE는 8 + 1×(8−5) = 11%입니다. ROA가 3%로 떨어지면 3 + 1×(3−5) = 1%가 됩니다. 여기서 읽어야 할 것은 레버리지가 수익률을 만들어 내는 것이 아니라 이미 있는 차이를 확대할 뿐이라는 점입니다. 읽으면 안 되는 것은 ROE가 높으니 좋은 회사라는 결론입니다. 같은 ROE라도 레버리지로 만든 것이면 변동폭이 훨씬 크고, 그 위험은 이 식에 숫자로 나타나지 않습니다."
        />

        <div id="structure-neutrality" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            그렇다면 빚을 늘리는 것만으로 회사가 더 가치 있어질까요
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              레버리지가 ROE를 올린다면 빚을 늘리기만 하면 회사 가치가 오를
              것처럼 보입니다. 그런데 오르는 것은 기대 수익률만이 아니라 위험도
              함께입니다. 주주가 그만큼 더 높은 수익률을 요구하면 두 효과가
              상쇄됩니다.
            </p>

            <p className="leading-7">
              1958년의 한 논문이 이 상쇄를 엄밀하게 보였습니다. 일정한 조건 아래에서는 회사를 어떤 비율로 조달하든 전체 가치가 같습니다. 투자자가 스스로 돈을 빌리거나 빌려줄 수
              있으므로 회사가 대신 해 주는 것에 웃돈을 낼 이유가 없다는 논리입니다.
            </p>

            <p className="leading-7">
              이 결과가 말해 주는 것은 &ldquo;자본구조가 중요하지 않다&rdquo;가 아닙니다. 오히려 반대입니다. 현실에서 자본구조가 가치를 바꾼다면 그것은 이 논문이 배제한
              것들, 곧 세금과 파산 비용과 정보 비대칭 때문입니다. 그래서 그 요인들을 따로 봐야 한다는 안내입니다.
            </p>
          </div>

          <CitationBlock
            source="Modigliani · Miller · The Cost of Capital, Corporation Finance and the Theory of Investment (American Economic Review 48(3), 1958)"
            citeKey={1}
            href="https://www.aeaweb.org/aer/top20/48.3.261-297.pdf"
          >
            자본구조와 기업 가치의 관계를 다룬 논문입니다. 증권을 사는 쪽이
            스스로 돈을 빌리거나 빌려줄 수 있으므로, 어떤 자본구조의 회사에서
            사든 같은 결과를 만들 수 있고 따라서 기업의 시장가치는 자본구조와
            무관하다는 것이 핵심 명제입니다. 다만 이 결과는 세금·파산 비용·정보
            비대칭이 없는 조건 아래에서 성립합니다. 현실의 자본구조 선택을 이
            논문으로 정당화하거나 부정할 수 없으며, 이 명제는 오히려 그 조건
            가운데 무엇이 깨졌는지를 묻게 하는 출발점으로 읽어야 합니다.
          </CitationBlock>
        </div>
      </section>

      <section id="ddm" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 적혀 있지 않은 현금흐름은 모양을 가정해야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            할인 식 자체는 달라지지 않습니다. 주주가 받을 현금을 시점마다 적고 할인해 더하면 됩니다. 문제는 그 현금흐름에 끝이 없다는 데 있습니다. 회사는 만기가 없으므로 배당은
            원칙적으로 영원히 이어집니다.
          </p>

          <p className="leading-7">
            무한히 더할 수는 없으니 모양을 가정합니다. 가장 단순하게는 배당이 매년 일정한 비율로 늘어난다고 가정합니다. 그러면 2편에서 본 등비급수가 되어 무한한 합이 짧은 식 하나로
            닫힙니다.
          </p>

          <p className="leading-7">
            닫힌 식은 편하지만 위험합니다. 분모가 &ldquo;요구 수익률 빼기 성장 률&rdquo;이라는 작은 수라서 두 숫자 중 하나만 조금 바꿔도 결과가 크게 달라지기 때문입니다.
            이 민감도가 주식 가치평가를 어렵게 만드는 실질적인 이유입니다.
          </p>
        </div>

        <ExplainedFormula
          question="영원히 이어지는 배당의 현재가치를 어떻게 하나의 식으로 닫는가?"
          idea="매년 같은 비율로 늘어나는 배당을 할인하면 각 항의 비율이 일정한 등비수열이 됩니다. 공비가 1보다 작으면 무한히 더해도 유한한 값에 수렴하므로, 합을 닫힌 형태로 적을 수 있습니다. 수렴 조건이 곧 이 식의 사용 조건입니다."
          formula={String.raw`P_0 = \sum_{t=1}^{\infty} \frac{D_1 (1+g)^{t-1}}{(1+r)^{t}} = \frac{D_1}{r-g} \quad (r > g)`}
          annotatedFormula={String.raw`P_0 = \frac{\overbrace{D_1}^{\text{1년 뒤 배당}}}{\underbrace{r-g}_{\text{요구 수익률에서 성장률을 뺀 값}}}`}
          operations={[
            {
              expression: String.raw`\frac{(1+g)^{t-1}}{(1+r)^{t}}`,
              annotation: [
                "배당이 커지는 배율과 할인되는 배율이 함께 작용해 각 항의 크기를 정합니다.",
                "두 배율의 비가 일정하므로 항들이 등비수열을 이룹니다.",
              ],
            },
            {
              expression: String.raw`\sum_{t=1}^{\infty}`,
              annotation: [
                "회사에 만기가 없으므로 합의 범위가 무한합니다.",
                "공비가 1보다 작을 때만 이 합이 유한한 값으로 수렴합니다.",
              ],
            },
            {
              expression: String.raw`\frac{D_1}{r-g}`,
              annotation: [
                "나눗셈의 분모가 요구 수익률에서 성장률을 뺀 값이라 두 숫자의 차가 작을수록 결과가 폭발합니다.",
                "이 구조 때문에 g를 r에 가깝게 잡는 것만으로 평가액을 얼마든지 키울 수 있습니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`P_0`,
              name: "오늘의 주식 가치",
              description: "앞으로 받을 배당 전부의 현재가치입니다.",
            },
            {
              symbol: String.raw`D_1`,
              name: "1년 뒤 배당",
              description:
                "다음 기에 받을 것으로 예상되는 주당 배당액입니다. 올해 배당이 아니라 다음 기 값이라는 점에 주의합니다.",
            },
            {
              symbol: String.raw`r`,
              name: "요구 수익률",
              description:
                "이 위험을 지는 대가로 요구하는 연 수익률입니다. 이 값을 정하는 문제는 다음 글이 다룹니다.",
            },
            {
              symbol: String.raw`g`,
              name: "배당 성장률",
              description: "배당이 매년 일정하게 늘어난다고 가정한 비율입니다.",
            },
          ]}
          assumptions={[
            "배당이 영원히 일정한 비율로 늘어난다고 둡니다. 실제 기업의 성장률은 단계마다 달라지므로 강한 가정입니다.",
            "요구 수익률이 성장률보다 크다고 둡니다. 그렇지 않으면 합이 발산해 식 자체가 성립하지 않습니다.",
            "배당을 주주가 실제로 받는 현금으로 봅니다. 자사주 매입처럼 다른 형태로 돌려주는 경우 정의를 맞춰야 합니다.",
          ]}
          interpretation="1년 뒤 배당이 1,000원, 요구 수익률이 8%, 성장률이 3%면 가치는 1,000 ÷ 0.05 = 20,000원입니다. 그런데 성장률만 4%로 올리면 25,000원이 되어 25% 오릅니다. 여기서 읽어야 할 것은 이 식이 '참값을 계산해 준다'가 아니라 '가정을 밝히면 그 가정 아래의 값을 준다'는 점입니다. 영구 성장률은 경제 전체의 장기 성장률을 넘을 수 없다는 제약을 함께 걸지 않으면, 이 식은 원하는 답을 만들어 내는 도구가 되기 쉽습니다."
        />

        <GordonSensitivityViz />
      </section>

      <section id="multiples" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 실무는 가정을 줄이는 대신 비교 대상을 빌려 씁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 식의 민감도 때문에 실무에서는 다른 길을 자주 씁니다. 비슷한
            회사들이 이익 대비 몇 배에 거래되는지를 보고 그 배수를 가져다 쓰는
            방식입니다. 주가를 주당순이익으로 나눈 값이 대표적입니다.
          </p>

          <p className="leading-7">
            이 방법이 가정을 없애는 것은 아닙니다. 비교 대상이 제대로 평가되어 있다는 가정을 대신 깔 뿐입니다. 시장 전체가 비싸면 배수도 비싸고 그 배수를 가져다 쓰면 비싼 값이
            그대로 옮겨 옵니다.
          </p>

          <p className="leading-7">
            그래도 배수는 유용합니다. 앞 식의 가정을 거꾸로 읽는 도구가 되기
            때문입니다. 어떤 회사가 이익의 30배에 거래된다면, 그 가격이
            성립하려면 성장률과 요구 수익률이 어떤 조합이어야 하는지 되물을 수
            있습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="배수에서 시장이 깔고 있는 가정을 역산하는 절차"
          input={[
            "관측된 배수: 주가 ÷ 주당순이익",
            "배당성향: 이익 가운데 배당으로 나가는 비율",
            "가정 후보 범위: 요구 수익률 r의 그럴듯한 구간",
          ]}
          steps={[
            {
              code: "D1 = EPS × 배당성향 × (1+g)   // 배당을 이익에서 끌어낸다",
              note: "고든 식은 배당을 입력으로 받으므로, 이익 기준 배수와 이으려면 배당성향을 거쳐야 합니다.",
            },
            {
              code: "P/EPS = 배당성향 × (1+g) / (r − g)",
              note: "앞 식의 양변을 주당순이익으로 나누면 배수가 성장률과 요구 수익률만의 함수가 됩니다.",
            },
            {
              code: "for r in 후보 범위: g_implied = r − 배당성향 × (1+g) / (P/EPS)  // 반복으로 g를 푼다",
              note: "g가 양변에 나타나므로 한 번에 풀리지 않습니다. 초기값에서 시작해 수렴할 때까지 반복합니다.",
            },
            {
              code: "if g_implied > 경제 장기 성장률: 이 배수는 지속 불가능한 가정 위에 있다고 판정한다",
              note: "영구 성장률이 경제 전체보다 높으면 그 회사가 언젠가 경제보다 커진다는 뜻이라 성립하지 않습니다. 이 판정이 이 절차의 핵심 쓸모입니다.",
            },
          ]}
          output="관측된 배수를 정당화하려면 시장이 어떤 성장률을 가정해야 하는지, 그리고 그 가정이 상식적 범위 안인지에 대한 판정"
        />

        <div id="multiple-traps" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            배수를 비교할 때 자주 어긋나는 지점
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              배수는 단순해 보이지만 분자와 분모가 같은 대상을 가리키지 않으면 비교가 무너집니다. 주가는 주주 몫만 반영하는데 이익은 채권자 몫을 떼기 전 값일 수 있습니다. 그러면
              빚이 많은 회사가 자동으로 싸 보입니다.
            </p>
          </div>

          <ProgressiveDetail
            title="분자와 분모를 맞춘다는 것은 무슨 뜻인가?"
            preview="주주 몫끼리, 회사 전체끼리 짝을 맞춰야 서로 다른 자본구조의 회사를 비교할 수 있습니다."
          >
            <p className="leading-7">
              주가는 주주에게 귀속되는 값이므로 짝이 되는 이익도 이자를 다 뺀 뒤의 순이익이어야 합니다. 반대로 회사 전체의 가치를 보고 싶다면 분자에 주식 시가총액과 순부채를 더한
              값을 놓고 분모에는 이자를 떼기 전의 영업 성과를 놓아야 합니다.
            </p>
            <p className="leading-7">
              둘을 섞으면 자본구조가 다른 회사들의 순위가 뒤집힙니다. 빚이 많은 회사는 주주 몫이 작아져 분자가 작아지는데 분모로 이자 차감 전 이익을 쓰면 배수가 낮게 나옵니다. 싸
              보이는 이유가 사업이 아니라 조달 구조인 셈입니다.
            </p>
            <p className="leading-7">
              시점도 맞춰야 합니다. 지난 1년 실적으로 계산한 배수와 앞으로 1년 예상으로 계산한 배수는 다른 숫자입니다. 성장하는 회사일수록 차이가 큽니다. 두 기준을 섞어 비교하면
              성장률이 높은 회사가 비싸 보이는 착시가 생깁니다.
            </p>
          </ProgressiveDetail>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          분자를 다뤘으니 남은 것은 분모입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            한 가지 덧붙일 것이 있습니다. 주주 몫은 회사가 버는 것뿐 아니라 주식
            수에도 달려 있습니다. 새 주식을 발행하면 같은 이익을 더 많은 사람이
            나눠 갖게 되어 한 주당 몫이 줄어듭니다. 그래서 주당 기준으로 볼
            때는 앞으로 늘어날 주식까지 세어야 합니다.
          </p>

          <p className="leading-7">
            이제 이 글이 미뤄 둔 것으로 돌아갑니다. 배당도 성장률도 추정했지만
            요구 수익률 r은 &ldquo;위험을 지는 대가&rdquo;라고만 하고 지나쳤습니다.
            그 대가가 얼마여야 하는지는 아직 아무도 말하지 않았습니다.
          </p>

          <p className="leading-7">
            여기서 중요한 사실이 하나 있습니다. 모든 위험에 보상이 붙는 것은 아니라는 점입니다. 여러 주식에 나눠 담으면 사라지는 위험이 있고 아무리 나눠도 남는 위험이 있습니다.
            보상은 남는 쪽에만 붙습니다.
          </p>

          <p className="leading-7">
            다음 글{" "}
            <Link to="/finance/risk/risk-diversification-and-pricing">
              위험은 나눌 수 있는 것과 없는 것으로 갈립니다
            </Link>
            에서 그 구분을 계산으로 세우고, 2편부터 비워 둔 r의 자리를
            채웁니다.
          </p>
        </div>
      </section>
    </div>
  );
}
