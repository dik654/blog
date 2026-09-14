import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import RiskDecompositionViz from "./risk-diversification-and-pricing/viz/RiskDecompositionViz";
import DiversificationCurveViz from "./risk-diversification-and-pricing/viz/DiversificationCurveViz";

/**
 * 나눠서 없앨 수 있는 위험에는 아무도 대가를 주지 않습니다
 *
 * 2편부터 비워 둔 할인율 r의 나머지 절반(위험의 값)을 채우는 글. 만기 구조는
 * 6편이 이미 닫았다. 규제가 위험을 어떻게 자본으로 환산하는지는 9편이 맡는다.
 */
export default function RiskDiversificationAndPricingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          위험은 한 덩어리가 아니라 두 종류로 갈라집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            지금까지 여섯 편 내내 같은 자리를 비워 두었습니다. 미래 현금흐름을
            오늘로 되돌릴 때 쓰는 r입니다.{" "}
            <Link to="/finance/money/time-value-and-discounting#boundary">
              2편
            </Link>
            에서 &ldquo;무엇과 견주느냐의 선택&rdquo;이라고만 했고,{" "}
            <Link to="/finance/markets/bond-pricing-and-yield-curve#yield-curve">
              6편
            </Link>
            에서 만기 구조로 절반을 채웠습니다. 남은 절반이 위험입니다.
          </p>

          <p className="leading-7">
            그런데 위험이 클수록 r이 크다고 단순히 말할 수는 없습니다. 위험에는 여러 자산에 나눠 담으면 사라지는 것이 있고 아무리 나눠도 남는 것이 있기 때문입니다. 그리고 보상은
            남는 쪽에만 붙습니다.
          </p>

          <p className="leading-7">
            이유는 간단합니다. 나눠서 없앨 수 있는 위험을 계속 지고 있는 것은
            선택이지 필연이 아닙니다. 남들이 공짜로 없앨 수 있는 것을 지고
            있다고 해서 시장이 대가를 줄 이유가 없습니다.
          </p>
        </div>

        <RiskDecompositionViz />

        <ContentBoundary article="risk-diversification-and-pricing" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              어떤 위험에 보상이 붙고 어떤 위험에는 붙지 않는지, 그 경계를 어떻게
              계산으로 긋는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 위험을 숫자로 재는 법, 둘을 섞으면 왜 줄어드는지, 여럿을
            섞어도 끝내 남는 것이 무엇인지, 그리고 그 남는 양을 재서 r을 만드는
            식입니다. 마지막에 이 틀이 무너지는 조건으로 닫습니다.
          </p>
        </div>
      </section>

      <section id="measuring-risk" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 위험을 재려면 먼저 흩어진 정도를 숫자로 만들어야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            평균 수익률이 같은 두 자산이 있어도 하나는 매년 비슷하고 다른 하나는
            크게 오르내린다면 둘은 같지 않습니다. 그 차이를 재는 가장 흔한
            방법이 평균에서 벗어난 정도를 제곱해 평균 낸 값, 곧{" "}
            <strong>분산</strong>입니다.
          </p>

          <p className="leading-7">
            제곱을 쓰는 이유는 둘입니다. 위로 벗어난 것과 아래로 벗어난 것이 서로 상쇄되지 않게 하고 크게 벗어난 경우에 더 큰 무게를 주기 위해서입니다. 제곱한 값은 단위가 달라지므로
            제곱근을 취해 원래 단위로 되돌린 것이 표준편차입니다.
          </p>

          <p className="leading-7">
            이 척도에는 처음부터 한계가 박혀 있습니다. 위로 벗어난 것과 아래로 벗어난 것을 같은 위험으로 센다는 점입니다. 투자자가 실제로 두려워하는 것은 아래쪽뿐인데도 그렇습니다. 이
            한계를 기억해 두고 넘어가야 뒤에서 이 틀이 어디서 무너지는지 알 수 있습니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 숫자를 부르는 세 이름을 먼저 구분합니다"
          items={[
            {
              term: "분산",
              description:
                "각 관측값이 평균에서 벗어난 정도를 제곱해 평균 낸 값입니다. 단위가 원래 값의 제곱이라 직접 해석하기는 어렵습니다.",
              example:
                "수익률이 각각 10%, 0%, −10%면 평균은 0이고 분산은 (0.01+0+0.01)/3 ≈ 0.0067입니다.",
              boundary:
                "관측값이 충분히 많고 분포가 크게 바뀌지 않아야 의미가 있습니다. 표본이 적으면 추정값 자체가 크게 흔들립니다.",
            },
            {
              term: "표준편차",
              description:
                "분산의 제곱근이며 원래 값과 같은 단위입니다. 실무에서 변동성이라고 부르는 것이 대개 이 값입니다.",
              example:
                "위 예의 표준편차는 약 8.2%포인트로, 수익률과 같은 단위로 읽힙니다.",
              boundary:
                "변동성이 크다는 것은 위아래로 많이 움직인다는 뜻이지 손실이 크다는 뜻이 아닙니다.",
            },
            {
              term: "공분산",
              description:
                "두 자산이 평균에서 같은 방향으로 벗어나는 경향을 잰 값입니다. 한 자산이 자기 자신과 갖는 공분산이 곧 분산입니다.",
              example:
                "한쪽이 오를 때 다른 쪽도 오르는 경향이면 양수, 반대로 움직이면 음수입니다.",
              boundary:
                "크기가 두 자산의 변동성에 함께 좌우되어 해석이 어려우므로, 보통 −1에서 1 사이로 정규화한 상관계수를 씁니다.",
            },
          ]}
        />
      </section>

      <section id="covariance" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 섞었을 때 위험이 줄어드는 몫은 상관이 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            두 자산을 반씩 담으면 기대 수익률은 두 값의 평균이 됩니다. 그런데 위험은 평균이 되지 않습니다. 한쪽이 나쁠 때 다른 쪽이 괜찮은 경우가 섞여 들어가면서 합친 것의 변동이
            각각의 평균보다 작아집니다.
          </p>

          <p className="leading-7">
            얼마나 작아지는지는 두 자산이 함께 움직이는 정도, 곧 상관이
            정합니다. 완전히 같은 방향으로 움직이면 줄어드는 것이 없고, 서로
            무관하면 상당히 줄며, 반대로 움직이면 크게 줄어듭니다. 극단적으로
            상관이 −1이면 위험을 완전히 없앨 수도 있습니다.
          </p>

          <p className="leading-7">
            그래서 분산투자의 핵심은 &ldquo;많이 담는 것&rdquo;이 아니라
            &ldquo;서로 다르게 움직이는 것을 담는 것&rdquo;입니다. 같은 업종
            주식 50개를 담는 것보다 성격이 다른 자산 5개를 담는 편이 나은
            경우가 흔합니다.
          </p>
        </div>

        <ExplainedFormula
          question="두 자산을 섞으면 합친 것의 변동은 얼마가 되는가?"
          idea="각 자산이 자기 비중만큼 기여하되, 둘이 함께 움직이는 부분이 따로 더해집니다. 함께 움직이는 부분이 작거나 음수면 합친 변동이 각각의 평균보다 작아지고, 그 차이가 곧 분산투자로 없앤 위험입니다."
          formula={String.raw`\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2 w_1 w_2 \rho_{12}\sigma_1\sigma_2`}
          annotatedFormula={String.raw`\sigma_p^2 = \underbrace{w_1^2\sigma_1^2 + w_2^2\sigma_2^2}_{\text{각자의 변동이 비중만큼 기여}} + \underbrace{2 w_1 w_2 \rho_{12}\sigma_1\sigma_2}_{\text{함께 움직이는 부분}}`}
          operations={[
            {
              expression: String.raw`w_1^2\sigma_1^2`,
              annotation: [
                "비중을 제곱해 곱하므로 비중을 반으로 줄이면 기여가 4분의 1로 줄어듭니다.",
                "이 제곱이 뒤에서 자산 수를 늘릴 때 개별 변동이 빠르게 사라지는 이유가 됩니다.",
              ],
            },
            {
              expression: String.raw`\rho_{12}\sigma_1\sigma_2`,
              annotation: [
                "상관계수에 두 표준편차를 곱해 공분산을 만듭니다.",
                "곱이므로 상관이 0이면 이 항 전체가 사라지고, 음수면 전체 분산을 깎아 냅니다.",
              ],
            },
            {
              expression: String.raw`2 w_1 w_2`,
              annotation: [
                "두 자산의 쌍은 1-2와 2-1 두 번 나타나므로 2를 곱해 한 번에 셉니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\sigma_p^2`,
              name: "포트폴리오 분산",
              description: "합친 것의 수익률이 흩어지는 정도입니다.",
            },
            {
              symbol: String.raw`w_i`,
              name: "각 자산의 비중",
              description: "전체 중 그 자산에 넣은 비율이며 합이 1입니다.",
            },
            {
              symbol: String.raw`\sigma_i`,
              name: "각 자산의 표준편차",
              description: "그 자산 하나만 들고 있을 때의 변동성입니다.",
            },
            {
              symbol: String.raw`\rho_{12}`,
              name: "두 자산의 상관계수",
              description:
                "−1에서 1 사이의 값으로, 두 자산이 같은 방향으로 움직이는 정도입니다.",
            },
          ]}
          assumptions={[
            "분산과 상관이 안정적이라고 둡니다. 실제로는 시장이 급락할 때 상관이 함께 올라가는 경향이 관측됩니다.",
            "공매도 제약이나 거래 비용을 넣지 않았습니다. 음의 비중이 필요한 조합은 실행하지 못할 수 있습니다.",
            "수익률의 분포를 평균과 분산만으로 요약할 수 있다고 둡니다.",
          ]}
          interpretation="두 자산의 표준편차가 각각 20%이고 반씩 담았을 때, 상관이 1이면 합친 변동도 20%로 하나도 줄지 않습니다. 상관이 0이면 약 14.1%, −1이면 0이 됩니다. 여기서 읽어야 할 것은 분산투자의 이익이 자산 개수가 아니라 상관에서 나온다는 점입니다. 읽으면 안 되는 것은 상관이 과거 값 그대로 유지된다는 가정입니다. 바로 이 가정이 위기 때 가장 먼저 깨집니다."
        />

        <div id="many-assets" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            자산 수를 늘리면 무엇이 사라지고 무엇이 남는가
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              앞 식을 자산 N개로 넓히면 항이 두 묶음으로 갈립니다. 각자의 분산이
              들어간 항은 N개이고 쌍들의 공분산이 들어간 항은 N(N−1)개입니다.
              균등하게 담으면 앞 묶음은 1/N로 줄어들고 뒤 묶음은 평균 공분산으로
              수렴합니다.
            </p>

            <p className="leading-7">
              결론이 여기서 나옵니다. 자산을 늘릴수록 개별 자산 고유의 변동은 사라지지만 서로 함께 움직이는 부분은 아무리 늘려도 남습니다. 남는 값은 0이 아니라 평균 공분산입니다.
            </p>
          </div>

          <ExplainedFormula
            question="자산을 무한히 늘리면 포트폴리오의 위험은 어디까지 줄어드는가?"
            idea="균등하게 N개로 나누면 각 자산 고유의 변동은 비중 제곱 때문에 N에 반비례해 줄어듭니다. 반면 쌍의 개수는 N의 제곱에 가깝게 늘어나 비중 제곱과 상쇄되므로, 공분산 쪽 기여는 줄지 않고 평균값으로 남습니다."
            formula={String.raw`\sigma_p^2 = \frac{1}{N}\overline{\sigma^2} + \frac{N-1}{N}\overline{\text{cov}} \;\; \xrightarrow{\;N \to \infty\;} \;\; \overline{\text{cov}}`}
            annotatedFormula={String.raw`\sigma_p^2 = \underbrace{\frac{1}{N}\overline{\sigma^2}}_{\text{N이 커지면 사라지는 몫}} + \underbrace{\frac{N-1}{N}\overline{\text{cov}}}_{\text{1에 가까워지며 남는 몫}}`}
            operations={[
              {
                expression: String.raw`\frac{1}{N}\overline{\sigma^2}`,
                annotation: [
                  "개별 분산 항 N개에 각각 비중 제곱 1/N²을 곱해 더한 결과입니다.",
                  "나눗셈이 N에 반비례하게 만들어, 자산을 늘릴수록 이 몫이 0으로 갑니다.",
                ],
              },
              {
                expression: String.raw`\frac{N-1}{N}\overline{\text{cov}}`,
                annotation: [
                  "쌍의 개수 N(N−1)에 비중 제곱 1/N²을 곱하면 (N−1)/N만 남습니다.",
                  "이 비율은 N이 커질수록 1에 가까워지므로 평균 공분산이 그대로 남습니다.",
                ],
              },
            ]}
            terms={[
              {
                symbol: String.raw`\overline{\sigma^2}`,
                name: "개별 분산의 평균",
                description: "담은 자산들이 각자 갖는 변동의 평균입니다.",
              },
              {
                symbol: String.raw`\overline{\text{cov}}`,
                name: "쌍 공분산의 평균",
                description:
                  "서로 다른 두 자산이 함께 움직이는 정도의 평균이며, 분산투자로 없앨 수 없는 바닥입니다.",
              },
              {
                symbol: String.raw`N`,
                name: "담은 자산의 수",
                description: "균등한 비중으로 나눠 담았다고 가정합니다.",
              },
            ]}
            assumptions={[
              "모든 자산에 같은 비중으로 담는다고 둡니다. 한 자산에 쏠려 있으면 개별 위험이 그만큼 덜 사라집니다.",
              "평균 분산과 평균 공분산이 자산을 더해도 크게 변하지 않는다고 둡니다. 성격이 비슷한 자산만 더하면 평균 공분산이 오히려 올라갑니다.",
              "거래 비용과 최소 투자 단위를 무시합니다.",
            ]}
            interpretation="평균 표준편차가 30%이고 평균 상관이 0.3인 자산들이라면, 20개만 담아도 포트폴리오 표준편차가 약 17%까지 내려오고 그 뒤로는 거의 평평해집니다. 여기서 읽어야 할 것은 '몇 개를 담느냐'보다 '평균 공분산이 얼마냐'가 바닥을 정한다는 점입니다. 읽으면 안 되는 것은 수를 늘리면 위험이 0이 된다는 결론입니다. 평균 공분산이 양수인 한 바닥은 반드시 남습니다."
          />

          <DiversificationCurveViz />
        </div>
      </section>

      <section id="systematic-risk" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 남는 위험에만 보상이 붙는 이유는 선택 가능성에 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절에서 위험이 두 조각으로 갈렸습니다. 자산 수를 늘리면 사라지는
            조각과 끝내 남는 조각입니다. 앞을 <strong>비체계적 위험</strong>,
            뒤를 <strong>체계적 위험</strong>이라 부릅니다. 앞은 그 회사에만
            생기는 일이고 뒤는 모두에게 함께 오는 일입니다.
          </p>

          <p className="leading-7">
            이제 보상의 문제입니다. 어떤 투자자가 한 종목만 들고 있어서 큰 위험을 지고 있다고 합시다. 그 위험의 상당 부분은 다른 종목 몇 개를 더 담기만 하면 사라집니다. 없앨 수
            있는 것을 굳이 지고 있는 셈입니다. 그에 대해 시장이 더 높은 수익률을 줄 이유가 없습니다.
          </p>

          <p className="leading-7">
            반대로 모두에게 함께 오는 위험은 누구도 피할 수 없습니다. 피할 수
            없는 것을 지는 대가는 지불되어야 합니다. 그래서 기대 수익률은 총
            위험이 아니라 <em>남는 위험</em>에 비례합니다. 변동성이 큰 자산이
            반드시 기대 수익률이 높지는 않은 이유가 여기에 있습니다.
          </p>
        </div>

        <CitationBlock
          source="Harry Markowitz · Portfolio Selection (The Journal of Finance 7(1), 1952, 77–91)"
          citeKey={1}
          href="https://onlinelibrary.wiley.com/doi/10.1111/j.1540-6261.1952.tb01525.x"
        >
          자산 하나하나를 따로 고르는 대신 조합 전체의 기대값과 변동을 함께 보는
          틀을 제시한 논문입니다. 위험을 분산으로 재고, 자산 간 공분산 때문에
          조합의 위험이 개별 위험의 평균보다 작아질 수 있다는 점을 정식화한 것이
          이 글 2절의 바탕입니다. 다만 이 논문은 조합을 어떻게 고를지에 대한
          틀이며, 균형에서 기대 수익률이 어떻게 정해지는지에 대한 결과는 이후
          별도의 연구에서 나왔습니다. 둘을 같은 출처로 묶어 인용하면 안 됩니다.
          출판사 사이트가 자동 조회를 막고 있어 서지 사항은 발행처 목록으로
          확인했습니다.
        </CitationBlock>
      </section>

      <section id="capm" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 남는 위험의 양을 재면 마침내 r이 나옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            보상이 남는 위험에만 붙는다면, 자산마다 그 남는 위험을 얼마나 지고
            있는지를 재야 합니다. 그 척도가 <strong>베타</strong>입니다. 시장
            전체가 1%포인트 움직일 때 이 자산이 평균적으로 몇 %포인트 움직이는지를
            나타냅니다.
          </p>

          <p className="leading-7">
            베타가 1이면 시장과 같은 만큼, 2면 두 배로 움직입니다. 베타가 0에 가까운 자산은 시장이 어떻게 되든 자기 길을 가므로 피할 수 없는 위험을 거의 지지 않습니다. 그래서
            요구 수익률도 낮습니다.
          </p>

          <p className="leading-7">
            여기까지 오면 r을 쓸 수 있습니다. 위험을 전혀 지지 않을 때의 수익률에
            베타만큼의 위험 보상을 더하는 것입니다. 2편부터 비워 두었던 자리가
            이 식으로 채워집니다.
          </p>
        </div>

        <ExplainedFormula
          question="피할 수 없는 위험을 이만큼 지는 자산에는 얼마를 요구해야 하는가?"
          idea="위험을 전혀 지지 않아도 받을 수 있는 수익률이 바닥이고, 그 위에 위험을 진 대가가 얹힙니다. 대가의 단가는 시장 전체를 들고 있을 때 받는 초과 수익률이고, 그 단가에 이 자산이 지고 있는 피할 수 없는 위험의 양을 곱합니다."
          formula={String.raw`E[r_i] = r_f + \beta_i \left(E[r_m] - r_f\right), \quad \beta_i = \frac{\text{cov}(r_i, r_m)}{\sigma_m^2}`}
          annotatedFormula={String.raw`E[r_i] = \underbrace{r_f}_{\text{위험을 안 질 때의 바닥}} + \underbrace{\beta_i}_{\text{피할 수 없는 위험의 양}} \cdot \underbrace{\left(E[r_m] - r_f\right)}_{\text{위험 한 단위의 값}}`}
          operations={[
            {
              expression: String.raw`E[r_m] - r_f`,
              annotation: [
                "시장 전체를 들고 있을 때 무위험 수익률보다 더 받는 몫이며, 위험 한 단위의 가격 역할을 합니다.",
                "차는 '위험을 져서 얻은 부분'만 남기기 위해 바닥을 덜어 냅니다.",
              ],
            },
            {
              expression: String.raw`\frac{\text{cov}(r_i, r_m)}{\sigma_m^2}`,
              annotation: [
                "이 자산이 시장과 함께 움직이는 정도를 시장 자신의 변동으로 나눠 정규화합니다.",
                "나눗셈 덕분에 시장의 베타가 정확히 1이 되어 기준점이 생깁니다.",
              ],
            },
            {
              expression: String.raw`\beta_i \left(E[r_m] - r_f\right)`,
              annotation: [
                "곱은 위험의 단가와 수량을 결합해 이 자산이 요구할 프리미엄을 만듭니다.",
                "개별 자산의 총 변동이 아니라 시장과 겹치는 부분만 들어간다는 점이 핵심입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`r_f`,
              name: "무위험 수익률",
              description:
                "위험을 지지 않아도 받을 수 있는 수익률이며 보통 국채 금리를 씁니다.",
            },
            {
              symbol: String.raw`\beta_i`,
              name: "베타",
              description:
                "시장이 움직일 때 이 자산이 함께 움직이는 정도로, 피할 수 없는 위험의 양입니다.",
            },
            {
              symbol: String.raw`E[r_m]`,
              name: "시장 기대 수익률",
              description:
                "모든 위험 자산을 시가총액 비중으로 담았을 때의 기대 수익률입니다.",
            },
          ]}
          assumptions={[
            "모든 투자자가 같은 정보를 보고 평균과 분산만으로 판단한다고 둡니다.",
            "모두가 무위험 금리로 빌리고 빌려줄 수 있으며 거래 비용과 세금이 없다고 둡니다.",
            "시장 포트폴리오를 관측할 수 있다고 둡니다. 실제로는 지수로 대신하며, 그 대체가 결과를 바꿀 수 있습니다.",
          ]}
          interpretation="무위험 수익률이 3%이고 시장 초과 수익률이 5%일 때, 베타가 1.2인 자산의 요구 수익률은 3 + 1.2×5 = 9%입니다. 여기서 읽어야 할 것은 개별 자산의 총 변동성이 아니라 시장과 겹치는 부분만 값이 매겨진다는 점입니다. 읽으면 안 되는 것은 이 식이 실제 수익률을 예측한다는 생각입니다. 이것은 균형에서 성립할 관계를 말하는 모형이며, 전제가 강하고 실증적으로 잘 맞지 않는 구간이 보고되어 왔습니다. 그래서 실무에서는 이 값을 정답이 아니라 출발점으로 쓰고 여러 보정을 덧붙입니다."
        />

        <div id="applying-r" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            이 값을 앞의 글들에 어떻게 끼워 넣는가
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              7편에서 배당할인모형의 분모로 &ldquo;요구 수익률&rdquo;을 썼습니다.
              그 자리에 지금 구한 값을 넣으면 평가가 닫힙니다. 다만 넣기 전에
              맞춰야 할 것이 몇 가지 있습니다.
            </p>
          </div>

          <AlgorithmBlock
            title="평가에 쓸 할인율을 고르는 절차"
            input={[
              "평가 대상의 현금흐름과 그 현금흐름이 누구에게 귀속되는지(주주인지 회사 전체인지)",
              "만기 구조: 6편의 수익률 곡선에서 읽은 해당 기간의 무위험 금리",
              "베타 추정치와 그 추정에 쓴 기간·지수",
            ]}
            steps={[
              {
                code: "현금흐름의 귀속을 확인한다. 주주 몫이면 자기자본 비용, 회사 전체면 가중평균을 쓴다.",
                note: "분자가 누구의 몫인지와 분모가 누구의 요구 수익률인지가 어긋나면 평가 전체가 무의미해집니다. 7편의 배수 함정과 같은 종류의 실수입니다.",
              },
              {
                code: "무위험 금리를 현금흐름 기간에 맞춘다. 10년짜리 평가에는 10년 지점의 금리를 쓴다.",
                note: "6편에서 본 대로 만기마다 금리가 다르므로, 짧은 금리를 긴 평가에 쓰면 할인율이 체계적으로 낮아집니다.",
              },
              {
                code: "명목과 실질을 맞춘다. 명목 현금흐름에는 명목 할인율을 쓴다.",
                note: "2편의 단위 점검입니다. 물가 상승분을 현금흐름에는 넣고 할인율에는 빼면 평가액이 부풀려집니다.",
              },
              {
                code: "베타 추정의 기간·지수·주기를 기록하고, 값이 바뀌면 결론이 얼마나 달라지는지 함께 본다.",
                note: "베타는 관측값이 아니라 추정값이라 기간을 바꾸면 값이 달라집니다. 하나의 숫자로 보고하면 그 불확실성이 사라져 버립니다.",
              },
              {
                code: "결과를 구간으로 보고한다. 할인율과 성장률을 함께 흔들어 본 표를 붙인다.",
                note: "7편에서 본 대로 분모가 작은 수라 민감도가 큽니다. 점 하나로 보고하는 평가는 그 민감도를 숨깁니다.",
              },
            ]}
            output="현금흐름의 귀속·기간·단위가 모두 맞춰진 할인율과, 그 값이 흔들릴 때 평가액이 어떻게 움직이는지에 대한 구간"
          />
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          이 틀은 평온할 때 가장 잘 맞고 필요할 때 가장 덜 맞습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            지금까지의 계산은 두 가지 위에 서 있습니다. 수익률의 흩어짐을 평균과
            분산만으로 요약할 수 있다는 것, 그리고 자산 간 상관이 안정적이라는
            것입니다. 두 전제 모두 평온한 시장에서는 그럴듯하고 위기에서는
            어긋납니다.
          </p>

          <p className="leading-7">
            실제 수익률 분포는 아주 큰 손실이 정규분포가 예측하는 것보다 자주 나타납니다. 그리고 그런 국면에서 자산들의 상관이 함께 1에 가까워져 정확히 분산투자가 필요한 순간에
            분산투자의 효과가 줄어듭니다.
          </p>

          <p className="leading-7">
            그래서 이 틀은 버릴 것이 아니라 경계를 알고 쓸 것입니다. 위험을 재는 도구로는 여전히 쓸모 있지만 꼬리에서 무엇이 일어나는지는 따로 봐야 합니다.
          </p>
        </div>

        <ProgressiveDetail
          title="위기에 상관이 올라가면 무엇이 달라지는가?"
          preview="분산투자로 없앨 수 있다고 믿었던 부분이 사라져, 실제 손실이 계산보다 커집니다."
        >
          <p className="leading-7">
            평균 표준편차가 30%이고 상관이 0.3인 자산 20개로 만든 포트폴리오의
            표준편차는 약 17%로, 평균의 6할 남짓입니다. 그런데 상관만 0.8로
            올라가면 같은 조합의 표준편차가 약 27%가 되어 평균의 9할에
            이릅니다. 담은 자산을 하나도 바꾸지 않았는데 위험이 1.5배 넘게
            늘어난 것입니다.
          </p>
          <p className="leading-7">
            이것이 위험 관리에서 가장 곤란한 성질입니다. 모형이 예측한 손실 한도가 평상시 상관으로 계산되어 있으면, 실제로 그 한도가 필요한 국면에서는 한도 자체가 틀려 있습니다.
            그래서 스트레스 상황을 따로 가정해 계산하는 절차가 필요해집니다.
          </p>
          <p className="leading-7">
            다음 글의 출발점이 바로 여기입니다. 개별 투자자는 손실을 감수하면 그만이지만 은행은 그 손실이 예금자와 다른 기관으로 번집니다. 그래서 규제는 평상시가 아니라 나쁜 상황을
            기준으로 자본을 쌓게 합니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            마지막 글{" "}
            <Link to="/finance/risk/capital-requirements-and-systemic-risk">
              규제가 은행에 자본을 쌓게 하는 이유
            </Link>
            에서 이 글의 위험 개념이 어떻게 자본 요구량으로 환산되는지, 그리고
            3편에서 본 뱅크런과 5편에서 본 미결제 익스포저가 왜 한 사람의
            문제가 아닌지를 봅니다.
          </p>
        </div>
      </section>
    </div>
  );
}
