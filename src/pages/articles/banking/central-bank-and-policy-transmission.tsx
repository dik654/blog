import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import PolicyRateViz from "./central-bank-and-policy-transmission/viz/PolicyRateViz";
import TransmissionViz from "./central-bank-and-policy-transmission/viz/TransmissionViz";

/**
 * 중앙은행은 돈을 찍는 곳이 아니라 하나의 가격을 고정하는 곳입니다
 *
 * 앞 글이 남긴 문장("창조된 통화의 총량은 결국 중앙은행 정책에 달렸다")을
 * 받아, 그 정책이 수량이 아니라 가격이라는 것을 중앙은행 장부에서 보인다.
 * 만기별 금리 구조 자체는 채권 글이 소유한다.
 */
export default function CentralBankAndPolicyTransmissionArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한 점의 가격을 못 박아 두면 나머지 금리가 그 점에 매달립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            중앙은행이 하는 일은 이 한 문장으로 줄어듭니다. 은행끼리 하루짜리
            돈을 주고받는 시장에서 금리 하나를 목표치에 못 박고, 그 점에 나머지
            금리들이 매달리게 하는 것입니다. 돈을 얼마나 찍을지를 정하는 것이
            아니라 가격 하나를 고정하는 일입니다.
          </p>

          <p className="leading-7">
            앞 글은 &ldquo;창조된 통화의 총량이 결국 중앙은행 정책에 달려
            있다&rdquo;는 문장을 설명하지 않은 채 남겨 두었습니다. 은행이 대출로
            예금을 만들고 준비금을 늘려도 대출이 늘지 않는다면, 중앙은행은 대체
            무엇으로 영향을 줄까요. 답이 바로 수량이 아니라 가격입니다.
          </p>

          <p className="leading-7">
            그래서 이 글은 &ldquo;금리를 올렸다&rdquo;는 한 문장을 분해합니다.
            무엇을 목표로 삼았고, 그 목표를 실제로 어떻게 달성하며, 그 한 점이
            어떤 경로로 우리가 쓰는 대출금리까지 번지는지입니다.
          </p>
        </div>

        <PolicyRateViz />

        <ContentBoundary article="central-bank-and-policy-transmission" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            순서는 중앙은행의 장부, 그 장부로 한 점을 고정하는 방법, 고정된 점이
            번지는 경로, 그리고 점을 더 내릴 수 없을 때 쓰는 수단입니다. 마지막에
            한국 제도와 다음 글로 넘어갑니다.
          </p>

          <p className="leading-7">
            만기가 다르면 금리도 다르다는 사실은 이 글에서 결과로만 쓰고 구조는
            설명하지 않습니다. 수익률 곡선의 모양과 듀레이션은{" "}
            <Link to="/finance/markets/bond-pricing-and-yield-curve">
              채권 가격과 금리
            </Link>
            가 소유합니다. 은행이 대출을 늘리고 줄이는 장부는 앞 글{" "}
            <Link to="/finance/banking/bank-balance-sheet-and-deposit-creation#limits">
              은행 장부의 제약
            </Link>
            에 있습니다.
          </p>
        </div>
      </section>

      <section id="cb-balance-sheet" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 중앙은행의 부채가 곧 은행들이 쓰는 결제 수단입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            중앙은행도 장부를 씁니다. 자산에는 국채와 금융기관 대출이, 부채에는
            현금과 지급준비금이 적힙니다. 앞 글에서 본 은행 장부와 다른 점은
            이 부채가 다른 모두의 자산이라는 것입니다. 은행이 결제에 쓰는 돈이
            중앙은행의 빚이기 때문입니다.
          </p>

          <p className="leading-7">
            여기서 중앙은행의 특별한 지위가 나옵니다. 자기 부채로 결제되는
            시장에서는 그 부채를 직접 만들어 낼 수 있습니다. 국채를 사면 자산이
            늘고 그 대금으로 파는 쪽 은행의 지급준비금이 늘어납니다. 은행이
            대출로 예금을 만들던 것과 같은 구조인데, 만드는 것이 예금이 아니라
            준비금입니다.
          </p>

          <p className="leading-7">
            다만 이 능력이 &ldquo;돈을 찍으면 경제가 돌아간다&rdquo;는 뜻은
            아닙니다. 앞 글에서 확인했듯 준비금이 늘어도 대출 수요가 없으면
            예금은 늘지 않습니다. 그래서 중앙은행은 준비금의 양이 아니라 준비금
            시장의 <em>가격</em>을 조작 대상으로 삼습니다.
          </p>
        </div>

        <TermBreakdown
          title="중앙은행 장부의 네 칸"
          items={[
            {
              term: "자산 — 국채·증권",
              description:
                "공개시장운영으로 사들인 채권입니다. 이 자산이 늘어난 만큼 부채 쪽 준비금이 늘어납니다.",
              example:
                "한국은행이 은행에서 국채를 사면 그 은행의 지급준비금 계정 잔액이 그만큼 늘어납니다.",
              boundary:
                "환매조건부매매처럼 되사고 되파는 조건이 붙으면 만기에 자동으로 되돌아가므로, 항구적 매입과는 효과의 지속 기간이 다릅니다.",
            },
            {
              term: "자산 — 금융기관 대출",
              description:
                "담보를 받고 은행에 빌려준 자금입니다. 앞 글의 최종대부자 기능이 장부에서는 이 칸으로 나타납니다.",
              example:
                "우량 채권을 담보로 단기 자금을 공급하면 이 자산과 그 은행의 준비금이 함께 늘어납니다.",
              boundary:
                "담보 가치와 적격 요건이 정해져 있어 아무 자산이나 받아 주지 않습니다. 지원 가능 여부가 담보로 걸립니다.",
            },
            {
              term: "부채 — 지급준비금",
              description:
                "은행이 중앙은행에 갖고 있는 예치금이며, 은행 사이의 최종 결제 수단입니다. 이 시장의 금리가 정책의 조작 대상입니다.",
              example:
                "A은행이 B은행에 지급할 것이 생기면 두 은행의 준비금 계정 잔액이 서로 반대로 움직입니다.",
              boundary:
                "가계와 기업은 이 계정을 가질 수 없으므로, 준비금이 늘었다고 시중에 돈이 풀린 것은 아닙니다.",
            },
            {
              term: "부채 — 발행 화폐",
              description:
                "유통 중인 지폐와 주화입니다. 앞 글에서 본 대로 한국은행권은 한국은행의 부채입니다.",
              example:
                "사람들이 현금을 더 찾으면 은행 준비금이 줄고 발행 화폐가 늘어 부채 구성만 바뀝니다.",
              boundary:
                "현금 수요는 대체로 결제 관습이 정하며 중앙은행이 이 칸의 크기를 목표로 삼지는 않습니다.",
            },
          ]}
        />
      </section>

      <section id="rate-setting" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 목표는 금리이고 수단은 준비금 시장의 수급과 이자입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            정책금리는 명령이 아니라 목표입니다. 한국은행이 기준금리를 정하면
            그 숫자가 자동으로 시장에 나타나는 것이 아니라, 은행끼리 하루짜리
            자금을 주고받는 금리가 그 부근에 오도록 중앙은행이 개입합니다.
            그러니까 정책금리는 &ldquo;맞추겠다고 공표한 값&rdquo;입니다.
          </p>

          <p className="leading-7">
            맞추는 방법은 두 가지입니다. 하나는 준비금의 양을 조절해 수급으로
            금리를 움직이는 것이고, 다른 하나는 준비금 자체에 이자를 붙여
            시장금리가 그 아래로 내려가지 못하게 막는 것입니다. 앞이{" "}
            <strong>공개시장운영</strong>, 뒤가 <strong>지급준비금 부리</strong>
            입니다.
          </p>

          <p className="leading-7">
            두 수단은 함께 쓰입니다. 준비금에 이자를 주면 은행은 그보다 낮은
            금리로 남에게 빌려줄 이유가 없으므로 시장금리에 바닥이 생기고,
            중앙은행이 언제든 그보다 조금 높은 금리로 빌려주겠다고 하면 천장이
            생깁니다. 그 사이에 목표를 두면 금리가 갇힙니다.
          </p>
        </div>

        <ExplainedFormula
          question="중앙은행은 시장 참가자 각자의 판단을 어떻게 하나의 금리로 몰아넣는가?"
          idea="은행이 남는 준비금으로 할 수 있는 선택지를 둘로 제한하면 가격이 그 사이에 갇힙니다. 중앙은행에 맡기면 반드시 받는 이자가 바닥이 되고, 중앙은행에서 언제든 빌릴 수 있는 금리가 천장이 됩니다. 누구도 바닥보다 싸게 빌려주거나 천장보다 비싸게 빌리지 않습니다."
          formula={String.raw`i_{\text{하한}} \le i_{\text{시장}} \le i_{\text{상한}}`}
          annotatedFormula={String.raw`\underbrace{i_{\text{하한}}}_{\text{준비금에 주는 이자}} \le \underbrace{i_{\text{시장}}}_{\text{은행 간 하루짜리 금리}} \le \underbrace{i_{\text{상한}}}_{\text{중앙은행 대출 금리}}`}
          operations={[
            {
              expression: String.raw`i_{\text{하한}} \le i_{\text{시장}}`,
              annotation: [
                "중앙은행에 맡기면 확실히 받는 이자가 있으므로 그보다 낮은 금리로 남에게 빌려줄 이유가 없습니다.",
                "이 부등식이 깨지려면 은행이 손해를 감수해야 하므로 바닥이 단단합니다.",
              ],
            },
            {
              expression: String.raw`i_{\text{시장}} \le i_{\text{상한}}`,
              annotation: [
                "중앙은행에서 담보만 있으면 언제든 빌릴 수 있으므로 그보다 비싸게 빌릴 이유가 없습니다.",
                "다만 이 천장은 담보가 있고 창구를 쓰는 데 따르는 평판 부담이 없을 때만 단단합니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`i_{\text{하한}}`,
              name: "준비금 부리 금리",
              description:
                "은행이 중앙은행에 맡긴 준비금에 붙는 이자율입니다. 시장금리의 바닥 역할을 합니다.",
            },
            {
              symbol: String.raw`i_{\text{시장}}`,
              name: "은행 간 초단기 금리",
              description:
                "은행끼리 하루짜리 자금을 주고받을 때의 금리이며, 정책금리가 겨냥하는 값입니다.",
            },
            {
              symbol: String.raw`i_{\text{상한}}`,
              name: "대출창구 금리",
              description:
                "중앙은행이 담보를 받고 은행에 빌려줄 때의 금리로, 시장금리의 천장 역할을 합니다.",
            },
          ]}
          assumptions={[
            "모든 은행이 중앙은행 계정과 적격 담보에 접근할 수 있다고 둡니다. 접근이 제한된 참가자가 많은 시장에서는 바닥이 새어 시장금리가 하한 아래로 내려갈 수 있습니다.",
            "중앙은행 창구를 쓰는 데 따르는 평판 부담이 없다고 둡니다. 실제로는 이 부담 때문에 천장이 느슨해집니다.",
            "규제상 보유해야 하는 유동성 요건이 이 선택을 왜곡하지 않는다고 둡니다.",
          ]}
          interpretation="이 부등식이 말하는 것은 '중앙은행이 가격을 직접 부른다'가 아니라 '선택지를 제한해 가격이 좁은 구간에 갇히게 한다'는 점입니다. 그래서 준비금을 아주 많이 공급해 두면 수급 조절 없이도 시장금리가 하한에 붙어 있게 되고, 이 상태를 바닥 방식이라 부릅니다. 반대로 이 구간이 넓거나 접근이 제한되면 같은 정책금리를 공표해도 실제 시장금리가 벗어날 수 있으므로, 공표값과 실현값을 같은 것으로 읽으면 안 됩니다."
        />

        <div id="operation-procedure" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            공표한 금리를 실제 시장금리로 만드는 하루
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              구간을 만들어 두어도 그 안에서 금리는 움직입니다. 그래서
              중앙은행은 준비금이 남거나 모자라는 정도를 보고 매번 흡수하거나
              공급합니다. 한국은행은 이 조절을 주로 7일물 환매조건부매매로
              합니다.
            </p>
          </div>

          <AlgorithmBlock
            title="정책금리를 목표치에 붙여 두는 일상 운영"
            input={[
              "목표 정책금리와 하한·상한 금리",
              "오늘 은행 부문의 준비금 수요 추정치: 지준 적립 필요액, 결제 대비, 현금 수요",
              "오늘의 자금 유출입: 국고 수급, 만기 도래하는 기존 RP",
            ]}
            steps={[
              {
                code: "잉여 = 예상 준비금 공급 − 예상 준비금 수요",
                note: "먼저 오늘 시장에 준비금이 남는지 모자라는지를 추정합니다. 이 값이 개입의 방향과 크기를 정합니다.",
              },
              {
                code: "if 잉여 > 0: RP 매각으로 잉여만큼 흡수한다",
                note: "준비금이 남으면 금리가 하한 쪽으로 눌리므로, 채권을 팔아 준비금을 거둬들입니다. 되사는 조건이 붙어 있어 만기에 자동으로 원위치합니다.",
              },
              {
                code: "if 잉여 < 0: RP 매입으로 부족분만큼 공급한다",
                note: "모자라면 금리가 상한 쪽으로 튀므로 채권을 사서 준비금을 넣어 줍니다. 한국은행은 이때 기준금리를 최저입찰금리로 씁니다.",
              },
              {
                code: "관측: 실제 은행 간 하루짜리 금리를 목표와 비교한다",
                note: "공표값과 실현값이 다를 수 있으므로 결과를 반드시 확인합니다. 이 차이가 벌어지면 운영 방식 자체를 손봅니다.",
              },
              {
                code: "반복: 다음 영업일의 수요·유출입을 다시 추정한다",
                note: "준비금 수요는 매일 바뀌므로 이 조절은 한 번으로 끝나지 않습니다. 정책금리 결정은 연 8회지만 운영은 매일입니다.",
              },
            ]}
            output="목표치 부근에 머무는 은행 간 초단기 금리와, 그 과정에서 바뀐 중앙은행 대차대조표의 구성"
            repeatUntil="정책금리 목표가 바뀌거나 운영 체제 자체가 개편될 때까지"
          />

          <CitationBlock
            source="한국은행 · 공개시장운영 (통화정책수단)"
            citeKey={1}
            href="https://www.bok.or.kr/portal/main/contents.do?menuNo=200294"
          >
            한국은행이 공개시장운영을 어떤 수단으로 하는지 설명한 공식
            페이지입니다. 증권 매매가 통상 7일물 환매조건부매매를 중심으로
            이루어지고, 기준금리가 7일물 RP 매각 시 고정입찰금리이자 매입 시
            최저입찰금리로 쓰인다는 본문 서술은 여기에 근거합니다. 다만 이
            페이지는 제도 설명이며, 특정 시점의 조절 규모나 금리 수준을 이
            문서로 인용할 수는 없습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="transmission" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 한 점이 곡선 전체를 끌고 가는 것은 기대 때문입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            여기서 이상한 점이 하나 있습니다. 중앙은행이 고정하는 것은 하루짜리
            금리 하나인데, 정작 사람들의 삶을 바꾸는 것은 3년 만기 대출금리와
            10년 만기 국채금리입니다. 하루짜리 가격 하나가 어떻게 몇 년짜리
            가격을 움직일까요.
          </p>

          <p className="leading-7">
            답은 긴 금리가 짧은 금리의 <em>앞으로의 경로</em>에 대한 기대를
            담고 있다는 데 있습니다. 3년 동안 돈을 묶어 두는 대신 하루짜리를
            3년치 이어 굴리는 선택이 있으므로, 두 방법의 결과가 크게 벌어지면
            차익이 생기고 그 차익이 두 금리를 묶어 놓습니다.
          </p>

          <p className="leading-7">
            그래서 중앙은행의 말이 행동만큼 중요해집니다. 오늘 0.25%포인트를
            올린 것보다 앞으로 얼마나 더 올릴 것처럼 보이는지가 긴 금리를 더
            많이 움직입니다. 같은 인상도 &ldquo;이번이 마지막&rdquo;이라는
            신호와 함께 나오면 긴 금리는 오히려 내릴 수 있습니다.
          </p>
        </div>

        <ExplainedFormula
          question="몇 년짜리 금리는 중앙은행이 정하는 하루짜리 금리와 어떻게 이어지는가?"
          idea="같은 기간 돈을 굴리는 두 방법이 있으면 결과가 비슷해야 합니다. 하나는 n년짜리를 한 번 사는 것이고 다른 하나는 하루짜리를 계속 이어 굴리는 것입니다. 후자의 결과는 앞으로의 단기금리 경로에 달려 있으므로, 장기금리는 그 경로의 평균에 불확실성의 대가를 더한 값이 됩니다."
          formula={String.raw`i_{n} = \frac{1}{n}\sum_{k=0}^{n-1} E[i^{\text{단기}}_{t+k}] + \tau_n`}
          annotatedFormula={String.raw`i_{n} = \underbrace{\frac{1}{n}\sum_{k=0}^{n-1} E[i^{\text{단기}}_{t+k}]}_{\text{앞으로의 단기금리 기대 평균}} + \underbrace{\tau_n}_{\text{기간 프리미엄}}`}
          operations={[
            {
              expression: String.raw`E[i^{\text{단기}}_{t+k}]`,
              annotation: [
                "k기간 뒤의 단기금리가 얼마일 것으로 보는지에 대한 시장의 기대입니다.",
                "중앙은행의 말이 여기에 직접 들어오므로, 오늘의 인상폭보다 앞으로의 경로가 더 중요해집니다.",
              ],
            },
            {
              expression: String.raw`\frac{1}{n}\sum_{k=0}^{n-1}`,
              annotation: [
                "합은 만기까지의 모든 기간을 누적하고, n으로 나누는 것은 같은 기간당 비율로 환산하기 위해서입니다.",
                "이 평균이 두 투자 방법의 결과를 맞추는 자리입니다.",
              ],
            },
            {
              expression: String.raw`\tau_n`,
              annotation: [
                "긴 기간을 묶어 두는 데 따르는 불확실성의 대가를 더합니다.",
                "이 항이 0이 아니기 때문에 장기금리를 기대 평균으로만 읽으면 안 됩니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`i_n`,
              name: "n기간 만기 금리",
              description: "지금 시점에서 n기간짜리 자금에 매겨지는 금리입니다.",
            },
            {
              symbol: String.raw`E[i^{\text{단기}}_{t+k}]`,
              name: "미래 단기금리의 기대값",
              description:
                "앞으로 중앙은행이 정책금리를 어떻게 움직일 것인지에 대한 시장의 예상입니다.",
            },
            {
              symbol: String.raw`\tau_n`,
              name: "기간 프리미엄",
              description:
                "만기가 길수록 요구되는 추가 보상입니다. 관측되지 않고 모형으로 추정하는 값이라는 점이 중요합니다.",
            },
          ]}
          assumptions={[
            "두 투자 방법 사이에 거래가 자유롭다고 둡니다. 규제·세제·시장 분할이 있으면 차익이 다 지워지지 않습니다.",
            "복리 효과를 무시한 근사식입니다. 정확히는 배율의 곱을 맞춰야 하지만 금리가 작을 때는 평균으로 근사합니다.",
            "신용위험이 없는 같은 발행자의 금리끼리 비교한다고 둡니다. 회사채라면 부도 위험에 대한 보상이 따로 붙습니다.",
          ]}
          interpretation="이 식이 설명하는 것은 중앙은행이 긴 금리를 직접 정하지 않으면서도 영향을 준다는 점입니다. 읽으면 안 되는 것은 두 가지입니다. 첫째, 기간 프리미엄은 관측값이 아니라 추정값이므로 장기금리의 변화를 전부 기대의 변화로 해석할 수 없습니다. 둘째, 이 관계는 만기별 금리가 왜 그런 모양인지까지 설명하지 않습니다. 그 구조는 채권 글이 따로 다룹니다."
        />

        <TransmissionViz />

        <div id="transmission-lag" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            같은 인상도 경로마다 도착 시각이 다릅니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              금리 하나가 바뀌면 여러 경로가 동시에 열립니다. 은행이 매기는
              대출금리가 바뀌고, 자산 가격이 재평가되며, 환율이 움직이고, 사람들의
              예상 자체가 달라집니다. 각 경로의 속도가 다르기 때문에 효과는 한
              번에 오지 않습니다.
            </p>

            <p className="leading-7">
              그래서 통화정책은 오늘의 물가를 보고 오늘 대응하는 일이 될 수
              없습니다. 지금 올린 금리가 실물에 닿을 무렵의 상태를 겨냥해야
              하고, 그 시차 때문에 정책은 늘 예측 위에서 이루어집니다.
            </p>
          </div>

          <ProgressiveDetail
            title="파급이 약해지거나 끊기는 경우는 언제인가?"
            preview="경로마다 전제가 다르고, 그 전제가 깨지면 같은 인상도 다른 결과를 냅니다."
          >
            <p className="leading-7">
              은행 경로는 은행이 조달 비용 변화를 대출금리에 넘길 수 있어야
              작동합니다. 예금 금리를 낮추는 데 한계가 있거나 경쟁이 심하면
              마진이 눌려 전가가 덜 일어납니다. 고정금리 대출 비중이 높으면
              이미 실행된 대출에는 변화가 닿지 않습니다.
            </p>
            <p className="leading-7">
              자산가격 경로는 앞 글의 할인 계산 그대로입니다. 금리가 오르면
              할인계수가 작아져 미래 현금흐름의 현재가치가 줄어듭니다. 다만 같은
              시점에 기대 현금흐름 자체가 커지면 두 효과가 상쇄될 수 있으므로,
              금리가 올랐는데 자산가격이 오르는 일도 생깁니다.
            </p>
            <p className="leading-7">
              기대 경로는 중앙은행의 말이 믿길 때만 작동합니다. 목표를 여러 번
              어긴 뒤에는 같은 발표가 같은 효과를 내지 않습니다. 이 경로가 다른
              경로와 다른 점은, 실제 행동 없이도 작동할 수 있는 동시에 신뢰를
              잃으면 행동을 해도 작동하지 않는다는 것입니다.
            </p>
          </ProgressiveDetail>
        </div>
      </section>

      <section id="balance-sheet-policy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 점을 더 내릴 수 없으면 장부의 크기로 넘어갑니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            정책금리에는 실질적인 하한이 있습니다. 너무 낮추면 사람들이 예금
            대신 현금을 들고 있으려 하기 때문입니다. 하한에 닿으면 가격을 더
            내리는 수단이 막히고, 남는 선택지는 장부의 구성과 크기를 바꾸는
            것입니다.
          </p>

          <p className="leading-7">
            <strong>양적완화</strong>는 중앙은행이 장기 국채 등을 대량으로 사서
            준비금을 공급하는 것입니다. 목적은 준비금을 늘리는 자체가 아니라
            앞 절 식의 두 항을 건드리는 데 있습니다. 오래 사겠다는 약속으로
            기대 경로를 낮추고, 장기물을 사들여 기간 프리미엄을 눌러 내립니다.
          </p>

          <p className="leading-7">
            여기서 앞 글의 결론이 다시 필요합니다. 준비금이 늘어난다고 예금이
            자동으로 늘지는 않습니다. 실제로 준비금이 크게 늘어난 기간에도 대출이
            그만큼 늘지 않은 사례가 있고, 이것이 통화승수를 절차로 읽으면 안
            된다는 앞 글의 주장과 같은 이야기입니다.
          </p>
        </div>

        <TermBreakdown
          title="장부 정책이 바꾸는 것과 바꾸지 못하는 것"
          items={[
            {
              term: "바꾸는 것 — 기간 프리미엄",
              description:
                "장기물을 대량으로 사서 시장에 남는 장기 채권의 양을 줄이면, 그 위험을 떠안는 대가가 낮아져 장기금리가 눌립니다.",
              example:
                "장기 국채를 사들이면 남은 투자자들이 감당할 만기 위험이 줄어듭니다.",
              boundary:
                "기간 프리미엄은 관측값이 아니라 추정값이므로, 장기금리 하락분을 이 경로의 효과로 전부 귀속시킬 수 없습니다.",
            },
            {
              term: "바꾸는 것 — 기대 경로",
              description:
                "오래 완화적으로 유지하겠다는 약속과 함께 실행하면, 앞으로의 단기금리 기대 자체가 낮아져 장기금리가 내려갑니다.",
              example:
                "매입 규모보다 '언제까지 유지할 것인가'라는 문구가 시장 반응을 더 크게 만드는 경우가 있습니다.",
              boundary:
                "이 경로는 신뢰에 의존하므로 과거에 약속을 지키지 않은 이력이 있으면 같은 발표가 같은 효과를 내지 않습니다.",
            },
            {
              term: "바꾸지 못하는 것 — 대출 수요",
              description:
                "준비금이 늘어도 빌리려는 사람과 빌려줄 만한 상대가 없으면 예금은 늘지 않습니다.",
              example:
                "은행 준비금이 크게 늘어난 기간에도 대출 잔액이 그만큼 늘지 않은 사례가 있습니다.",
              boundary:
                "그렇다고 효과가 없다는 뜻은 아닙니다. 금리 경로로는 작동하되 수량 경로로 자동 전환되지 않는다는 뜻입니다.",
            },
          ]}
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          가격은 정해졌고, 이제 그 가격으로 오간 돈이 실제로 옮겨져야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            한국의 경우 금융통화위원회가 연 8회 본회의에서 기준금리를 정하고,
            한국은행은 주로 7일물 환매조건부매매로 준비금을 조절해 초단기 금리를
            그 부근에 둡니다. 물가안정이 한국은행법이 정한 최우선 목표라는 점도
            이 운영의 출발점입니다.
          </p>

          <p className="leading-7">
            여기까지 오면 처음 그림의 위쪽 두 화살표가 채워집니다. 은행이 예금을
            만들고, 중앙은행이 그 창조의 가격을 정합니다. 그런데 한 가지가
            남았습니다. 앞 절에서 계속 등장한 &ldquo;은행끼리 주고받는다&rdquo;는
            말이 실제로 무엇을 뜻하는가입니다.
          </p>

          <p className="leading-7">
            A은행 고객이 B은행 고객에게 송금하면 두 은행 사이에 무엇이
            움직이는지, 그리고 그 이동이 언제 되돌릴 수 없게 되는지는 아직
            설명하지 않았습니다. 다음 글{" "}
            <Link to="/finance/banking/payment-clearing-settlement">
              송금 한 건이 최종성에 도달하기까지
            </Link>
            가 그 자리를 맡습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
