import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import BalanceSheetViz from "./bank-balance-sheet-and-deposit-creation/viz/BalanceSheetViz";
import BankRunViz from "./bank-balance-sheet-and-deposit-creation/viz/BankRunViz";

/**
 * 은행은 맡아 둔 돈을 빌려주는 것이 아니라 대출로 예금을 만듭니다
 *
 * 앞 글에서 "예금은 은행의 빚"까지 확인했으므로, 이 글은 그 빚이 생기는 분개
 * 한 줄에서 출발해 제약·만기변환·뱅크런까지 T계정 한 장으로 읽는다.
 * 중앙은행이 무엇을 움직이는지는 다음 글이 소유한다.
 */
export default function BankBalanceSheetAndDepositCreationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          은행에 관한 거의 모든 질문이 장부 한 장에서 갈립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            은행을 설명하는 방식은 크게 둘입니다. 하나는 예금자에게 맡아 둔 돈을
            필요한 사람에게 옮겨 주는 중개자라는 그림이고, 다른 하나는 대출을
            실행하는 순간 예금을 새로 적어 넣는 발행자라는 그림입니다. 어느
            쪽으로 보느냐에 따라 통화량, 뱅크런, 자본규제, 중앙은행 정책의 설명이
            전부 달라집니다.
          </p>

          <p className="leading-7">
            두 그림 중 어느 쪽이 맞는지는 의견으로 가릴 문제가 아닙니다. 은행이
            대출을 실행할 때 장부에 무엇이 적히는지 보면 끝나는 문제입니다. 이
            글은 그래서 은행 대차대조표 한 장을 놓고 시작합니다.
          </p>

          <p className="leading-7">
            앞 글에서 예금이 은행의 빚이라는 것까지는 확인했습니다.{" "}
            <Link to="/finance/money/money-as-a-claim#credit-money">
              돈은 누군가의 빚이다
            </Link>
            에서 본 그림의 첫 화살표입니다. 이제 그 빚이 어디서 생기는지를
            봅니다.
          </p>
        </div>

        <BalanceSheetViz />

        <ContentBoundary article="bank-balance-sheet-and-deposit-creation" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              은행은 남의 돈을 옮기는 곳인가, 아니면 돈을 만드는 곳인가
            </strong>
            입니다. 답을 장부에서 확인하고 나면 곧바로 다음 질문이 따라붙습니다.
            만들 수 있다면 왜 무한정 만들지 않는가, 그리고 그렇게 만든 구조는
            어디가 약한가입니다.
          </p>

          <p className="leading-7">
            순서는 장부를 읽는 법, 대출 한 건이 기록되는 순간, 무한정 만들지
            못하게 하는 제약, 그 구조에 내장된 만기 불일치, 그리고 그 불일치가
            터지는 방식입니다. 마지막에 한국 제도와 다음 글로 넘어갑니다.
          </p>
        </div>
      </section>

      <section id="balance-sheet" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 장부의 왼쪽은 받을 것, 오른쪽은 갚을 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            은행 대차대조표는 두 열로 되어 있습니다. 왼쪽 자산에는 은행이 받을
            권리가, 오른쪽 부채에는 은행이 갚을 의무가 적힙니다. 둘의 차이가
            자기자본이고, 이것이 주주 몫이자 손실을 먼저 받아 내는 완충
            장치입니다.
          </p>

          <p className="leading-7">
            여기서 초보자가 가장 자주 뒤집는 지점이 있습니다. 예금은 은행의
            자산이 아니라 <strong>부채</strong>입니다. 앞 글의 정의를 그대로
            따르면 당연합니다. 예금은 은행이 예금자에게 지고 있는 빚이기
            때문입니다. 반대로 대출은 은행이 받을 권리이므로 자산입니다.
          </p>

          <p className="leading-7">
            그래서 &ldquo;은행이 돈이 많다&rdquo;는 말은 장부에서 두 가지로
            갈립니다. 자산이 크다는 뜻일 수도 있고 자기자본이 두껍다는 뜻일 수도
            있는데, 위험을 견디는 힘은 뒤쪽이 정합니다. 자산이 아무리 커도 그만큼
            부채가 크면 손실 한 번에 자본이 사라집니다.
          </p>
        </div>

        <TermBreakdown
          title="은행 장부의 네 칸을 먼저 구분합니다"
          items={[
            {
              term: "자산 — 대출채권",
              description:
                "은행이 빌려준 돈을 돌려받을 권리입니다. 은행 자산에서 가장 큰 몫을 차지하며, 차주가 갚지 못하면 그만큼 가치가 깎입니다.",
              example:
                "주택담보대출 3억 원을 실행하면 자산 쪽에 대출채권 3억 원이 적힙니다.",
              boundary:
                "장부에 적힌 금액은 액면이며, 실제 회수 가능액은 부실 정도에 따라 달라집니다. 그 차이를 미리 덜어 두는 것이 대손충당금입니다.",
            },
            {
              term: "자산 — 지급준비금",
              description:
                "은행이 중앙은행에 갖고 있는 예치금입니다. 다른 은행으로 돈이 빠져나갈 때 실제로 넘겨주는 수단이 이것입니다.",
              example:
                "고객이 타행으로 1천만 원을 이체하면 이 계정에서 1천만 원이 줄어듭니다.",
              boundary:
                "은행끼리 주고받는 결제 수단이며 가계·기업이 직접 쓸 수 있는 돈이 아닙니다. 앞 글의 통화지표에서 제외되는 이유가 이것입니다.",
            },
            {
              term: "부채 — 예금",
              description:
                "은행이 예금자에게 요구가 있으면 돌려주겠다고 진 빚입니다. 대부분 언제든 찾을 수 있는 짧은 부채입니다.",
              example:
                "당신 통장의 100만 원은 은행 장부의 부채 쪽에 100만 원으로 적혀 있습니다.",
              boundary:
                "은행이 예금을 어딘가에 보관하고 있는 것이 아닙니다. 예금은 보관물이 아니라 채무 기록입니다.",
            },
            {
              term: "자기자본",
              description:
                "자산에서 부채를 뺀 나머지로, 주주의 몫이자 손실을 가장 먼저 흡수하는 층입니다.",
              example:
                "자산 100, 부채 92면 자기자본은 8이고, 자산 가치가 8% 떨어지면 자본이 전부 사라집니다.",
              boundary:
                "자기자본은 금고에 쌓아 둔 현금이 아니라 장부상의 차액입니다. 규제가 요구하는 것도 특정 자산을 보유하라는 뜻이 아닙니다.",
            },
          ]}
        />
      </section>

      <section id="deposit-creation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 대출 한 건은 장부의 양쪽을 동시에 늘립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            은행이 1억 원을 대출하면 장부에는 두 줄이 <em>동시에</em> 적힙니다.
            자산 쪽에 대출채권 1억 원, 부채 쪽에 그 사람의 예금 1억 원입니다.
            어느 계좌에서 1억 원이 빠져나와 옮겨 간 것이 아니라, 없던 예금이 그
            자리에서 생깁니다.
          </p>

          <p className="leading-7">
            이것이 첫 절의 질문에 대한 답입니다. 은행은 예금을 빌려주는 것이
            아니라 대출을 실행하면서 예금을 만듭니다. 그래서 앞 글에서 본
            통화지표의 대부분은 중앙은행이 찍어 낸 것이 아니라 상업은행의 대출
            장부에서 나옵니다.
          </p>

          <p className="leading-7">
            반대 방향도 성립합니다. 차주가 대출을 갚으면 자산의 대출채권과 부채의
            예금이 함께 줄어듭니다. 돈이 은행 금고로 들어가는 것이 아니라 장부에서
            사라집니다. 대출이 늘면 통화량이 늘고 대출을 갚으면 통화량이 주는
            이유가 여기에 있습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="대출 1억 원이 실행될 때 장부에 적히는 순서"
          input={[
            "차주의 신용 심사 결과와 승인된 한도 1억 원",
            "은행의 현재 대차대조표: 자산(대출채권·지급준비금), 부채(예금), 자기자본",
          ]}
          steps={[
            {
              code: "자산.대출채권 += 1억     // 받을 권리가 생긴다",
              note: "은행이 얻는 것은 차주에게서 원리금을 받을 권리이며, 이것이 자산이 커지는 이유입니다.",
            },
            {
              code: "부채.예금[차주] += 1억   // 같은 순간 갚을 의무가 생긴다",
              note: "차주가 쓸 수 있게 하려면 그 사람 계좌에 잔액을 적어야 하고, 그 잔액은 곧 은행의 빚입니다. 어느 계좌에서도 차감하지 않습니다.",
            },
            {
              code: "assert 자산 - 부채 == 자기자본  // 자본은 변하지 않는다",
              note: "양쪽이 같은 금액으로 늘었으므로 차액인 자기자본은 그대로입니다. 대출 자체는 은행을 부유하게 만들지 않습니다.",
            },
            {
              code: "if 차주가 타행으로 송금: 부채.예금[차주] -= 금액; 자산.지급준비금 -= 금액",
              note: "여기서 비로소 은행이 실제로 내줘야 할 것이 생깁니다. 만든 예금이 밖으로 나갈 때 지급준비금이 필요하다는 뜻이며, 이것이 무한정 대출하지 못하는 실무적 이유입니다.",
            },
            {
              code: "상환 시: 자산.대출채권 -= 원금; 부채.예금[차주] -= 원금",
              note: "만들 때와 정확히 반대로 양쪽이 함께 줄어듭니다. 통화량이 대출 잔액과 함께 늘고 주는 구조가 여기서 나옵니다.",
            },
          ]}
          output="대출채권과 예금이 같은 금액만큼 늘어난 대차대조표, 그리고 그 예금이 타행으로 나갈 때 필요한 지급준비금 소요"
        />

        <div id="intermediary-myth" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            중개자 그림은 장부의 어느 줄에서 어긋나는가
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              중개자 그림이 맞다면 대출 실행 시 누군가의 예금이 줄고 차주의 예금이
              늘어야 합니다. 총 예금은 그대로여야 하고 통화량도 변하지 않아야
              합니다. 그런데 실제 분개에서는 기존 예금이 한 푼도 줄지 않고 새 예금이
              늘어납니다.
            </p>

            <p className="leading-7">
              이 차이는 해석의 문제가 아니라 회계 사실입니다. 영국 중앙은행은
              2014년 공보에서 이 점을 명시적으로 정리하면서, 은행이 단순 중개자로
              예금을 빌려주지도 않고 중앙은행 화폐를 기계적으로 부풀리지도 않는다고
              썼습니다.
            </p>
          </div>

          <CitationBlock
            source="McLeay, Radia, Thomas · Money creation in the modern economy (Bank of England Quarterly Bulletin 2014 Q1)"
            citeKey={1}
            href="https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy"
          >
            중앙은행이 직접 두 가지 통념을 반박한 자료입니다. 은행이 저축자가
            맡긴 예금을 빌려주는 중개자라는 설명과, 중앙은행 화폐를 정해진 배수로
            부풀린다는 설명을 모두 부정하고, 대출이 예금을 만든다는 회계 사실에서
            출발합니다. 다만 이 자료는 영국 제도를 기준으로 하며, 창조된 통화의
            총량이 최종적으로 중앙은행의 정책에 달려 있다는 결론까지 함께
            읽어야 합니다. 대출로 예금이 생긴다는 사실이 은행이 제약 없이 통화를
            늘릴 수 있다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 만들 수 있다는 것이 무한정 만든다는 뜻은 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            장부에 두 줄을 적는 일이 공짜라면 은행은 왜 대출을 무한정 늘리지
            않을까요. 막는 것은 종이가 아니라 네 가지입니다. 빌려줄 만한 상대가
            한정돼 있고, 만든 예금이 밖으로 빠져나가며, 손실을 받아 낼 자본이
            정해져 있고, 그 위에 규제가 상한을 겁니다.
          </p>

          <p className="leading-7">
            가장 먼저 걸리는 것은 수익성입니다. 대출 금리가 자금 조달 비용과
            예상 손실을 넘지 못하면 대출은 손해입니다. 갚을 가능성이 낮은 상대에게
            높은 금리를 매기는 것도 한계가 있어서, 금리를 올릴수록 갚을 수 있는
            사람이 먼저 떠나고 위험한 사람만 남습니다.
          </p>

          <p className="leading-7">
            두 번째는 유출입니다. 앞 절 분개의 네 번째 줄에서 봤듯, 만든 예금이
            타행으로 나가면 지급준비금이 그만큼 빠집니다. 대출을 늘릴수록 다른
            은행에 갚아야 할 결제 수요가 커지고, 그것을 조달하는 비용이
            대출 확대의 실질적 제동입니다.
          </p>
        </div>

        <div id="money-multiplier" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            교과서의 통화승수는 상한이지 작동 방식이 아닙니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              많은 교과서는 이 제약을 지급준비율 하나로 요약해, 중앙은행이
              본원통화를 주면 은행이 그것을 정해진 배수로 부풀린다고 설명합니다.
              식 자체는 틀리지 않았지만 읽는 방향이 거꾸로입니다. 이 식은 준비금이
              대출을 낳는 절차가 아니라, 다른 제약이 전혀 없을 때의 산술적 상한을
              말할 뿐입니다.
            </p>
          </div>

          <ExplainedFormula
            question="지급준비율만이 유일한 제약이라면 예금은 최대 몇 배까지 늘 수 있는가?"
            idea="예금이 생길 때마다 그 일부를 준비금으로 떼어 둬야 한다면, 남은 몫이 다시 대출로 나가 또 예금을 만듭니다. 매 회차 남는 비율이 일정하므로 전체 합은 등비급수가 되고, 그 합이 배수의 상한이 됩니다."
            formula={String.raw`m = \frac{1}{rr}, \qquad \Delta D_{\max} = m \cdot \Delta R`}
            annotatedFormula={String.raw`m = \underbrace{\frac{1}{rr}}_{\text{매 회차 } (1-rr)\text{씩 남는 등비급수의 합}}, \qquad \Delta D_{\max} = m \cdot \underbrace{\Delta R}_{\text{늘어난 준비금}}`}
            operations={[
              {
                expression: String.raw`1-rr`,
                annotation: [
                  "예금 1원이 생길 때 준비금으로 떼고 남아 다시 대출로 나갈 수 있는 몫입니다.",
                ],
              },
              {
                expression: String.raw`\frac{1}{rr}`,
                annotation: [
                  "공비가 1−rr인 등비급수 1+(1−rr)+(1−rr)²+…의 합이며, 무한히 반복될 때의 극한입니다.",
                  "나눗셈은 늘어난 준비금을 준비율로 정규화해 몇 배까지 갈 수 있는지를 말합니다.",
                ],
              },
              {
                expression: String.raw`m \cdot \Delta R`,
                annotation: [
                  "상한 배수를 실제 늘어난 준비금에 곱해 예금 증가의 최대치를 얻습니다.",
                  "이 곱은 최대치를 말할 뿐 실제로 그만큼 늘어난다는 뜻이 아닙니다.",
                ],
              },
            ]}
            terms={[
              {
                symbol: String.raw`rr`,
                name: "지급준비율",
                description:
                  "예금 대비 준비금으로 보유해야 하는 비율입니다. 나라와 예금 종류에 따라 다르고 0인 경우도 있습니다.",
              },
              {
                symbol: String.raw`m`,
                name: "통화승수의 상한",
                description:
                  "준비금 1원이 지탱할 수 있는 예금의 최대 배수입니다.",
              },
              {
                symbol: String.raw`\Delta R`,
                name: "준비금의 증가",
                description: "은행 전체가 보유한 지급준비금의 변화량입니다.",
              },
            ]}
            assumptions={[
              "은행이 준비금을 법정 최소치만 남기고 전부 대출한다고 둡니다. 실제로는 결제 대비와 유동성 규제로 더 많이 남깁니다.",
              "대출받은 돈이 전액 다시 은행 예금으로 돌아온다고 둡니다. 현금으로 빠져나가면 배수는 그만큼 작아집니다.",
              "빌리려는 수요가 항상 존재한다고 둡니다. 수요가 없으면 준비금이 늘어도 대출은 늘지 않습니다.",
            ]}
            interpretation="rr이 0.1이면 상한은 10배입니다. 이 식에서 읽어야 할 것은 '준비율이 낮을수록 상한이 높다'는 관계뿐입니다. 읽으면 안 되는 것은 인과의 방향입니다. 실제 순서는 준비금이 먼저 생겨 대출이 뒤따르는 것이 아니라, 대출이 먼저 일어나고 필요한 준비금을 은행이 조달하는 쪽에 가깝습니다. 준비금을 늘렸는데도 대출이 늘지 않은 사례가 이 식을 절차로 읽으면 안 되는 이유를 보여 줍니다."
          />

          <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
            <p className="leading-7">
              세 번째 제약인 자본과 네 번째인 규제는 이 글의 범위를 넘습니다.
              손실을 얼마나 받아 낼 수 있어야 하는지, 위험한 자산일수록 왜 더
              많은 자본을 요구하는지는{" "}
              <Link to="/finance/risk/capital-requirements-and-systemic-risk">
                규제가 은행에 자본을 쌓게 하는 이유
              </Link>
              가 소유합니다. 여기서는 &ldquo;장부를 늘리는 데에도 값이
              붙는다&rdquo;는 사실만 가져갑니다.
            </p>
          </div>
        </div>
      </section>

      <section id="maturity-transformation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 짧은 빚으로 긴 자산을 떠받치는 구조가 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            지금까지의 장부를 만기로 다시 읽으면 한 가지가 눈에 들어옵니다.
            오른쪽 부채는 대부분 언제든 찾을 수 있는 예금이고, 왼쪽 자산은 수년에서
            수십 년짜리 대출입니다. 짧은 빚으로 긴 자산을 떠받치는 이 구조를{" "}
            <strong>만기 변환</strong>이라 합니다.
          </p>

          <p className="leading-7">
            이것은 결함이 아니라 은행이 하는 일 자체입니다. 예금자는 언제든 꺼낼 수
            있는 편의를 얻고 차주는 긴 자금을 얻으며, 은행은 그 차이에서 이자
            마진을 얻습니다. 사회적으로도 짧은 저축을 긴 투자로 잇는 기능이
            없으면 주택도 공장도 지어지기 어렵습니다.
          </p>

          <p className="leading-7">
            문제는 이 구조가 전제를 하나 깔고 있다는 데 있습니다. 예금자 전부가
            동시에 찾지는 않는다는 전제입니다. 평소에는 잘 맞지만, 전제가 깨지는
            순간 은행은 자산이 멀쩡해도 지급하지 못합니다.
          </p>
        </div>
      </section>

      <section id="bank-run" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 5. 그래서 인출은 스스로를 실현시키는 예언이 됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            긴 자산은 급하게 팔면 제값을 못 받습니다. 그래서 인출이 몰리면 은행은
            자산을 헐값에 처분해야 하고, 나중에 찾는 사람일수록 덜 받게 됩니다.
            이 사실을 모두가 알고 있다는 점이 핵심입니다. 남들이 찾을 것 같으면
            나도 먼저 찾는 것이 합리적이 됩니다.
          </p>

          <p className="leading-7">
            그 결과 은행의 상태가 멀쩡해도 인출이 몰린다는 예상만으로 인출이
            일어나고, 그 인출이 예상을 사실로 만듭니다. 이렇게 믿음이 결과를
            만들어 내는 상황을 <strong>자기실현적 인출</strong>, 곧 뱅크런이라
            합니다. 원인이 부실이 아니라 조정 실패라는 점에서 일반적인 파산과
            다릅니다.
          </p>

          <p className="leading-7">
            해법도 원인에서 나옵니다. 문제가 &ldquo;남들이 먼저 찾을 것&rdquo;
            이라는 예상이라면, 그 예상을 무너뜨리면 됩니다. 예금보험은 먼저 찾을
            이유를 없애고, 중앙은행의 최종대부자 기능은 자산이 멀쩡한 은행이
            일시적 현금 부족으로 쓰러지지 않게 합니다.
          </p>
        </div>

        <BankRunViz />

        <div id="safety-net" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            두 안전장치는 서로 다른 실패를 막습니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              예금보험과 최종대부자는 함께 언급되지만 막는 대상이 다릅니다. 앞은
              예금자의 선택을 바꾸고, 뒤는 은행의 현금 부족을 메웁니다. 둘을
              뭉뚱그리면 &ldquo;중앙은행이 부실 은행을 살린다&rdquo;는 오해가
              생깁니다.
            </p>
          </div>

          <TermBreakdown
            title="예금보험과 최종대부자의 역할 구분"
            items={[
              {
                term: "예금보험 (deposit insurance)",
                description:
                  "한도까지는 은행이 망해도 돌려받는다고 미리 약속해 먼저 찾을 유인을 없애는 장치입니다. 실제로 지급하지 않아도 존재만으로 인출을 막는 것이 목적입니다.",
                example:
                  "한도 안의 예금자는 남들이 줄을 서도 서두를 이유가 없어져 조정 실패가 풀립니다.",
                boundary:
                  "한도 밖 예금과 은행의 다른 채권자는 여전히 먼저 빠지려 하므로, 대규모 법인 예금이 많은 은행에서는 효과가 약합니다.",
              },
              {
                term: "최종대부자 (lender of last resort)",
                description:
                  "자산은 멀쩡한데 당장 현금이 없는 은행에 중앙은행이 담보를 받고 자금을 빌려주는 기능입니다. 급매를 막아 헐값 처분의 연쇄를 끊습니다.",
                example:
                  "우량 대출채권을 담보로 잡고 단기 자금을 공급하면 자산을 팔지 않고 인출에 응할 수 있습니다.",
                boundary:
                  "지급 능력이 없는 은행을 살리는 장치가 아닙니다. 담보 가치가 부족하면 지원 대상이 아니며, 그 판정 자체가 쉽지 않다는 점이 이 장치의 오래된 난점입니다.",
              },
            ]}
          />

          <ProgressiveDetail
            title="안전장치가 만드는 새 문제는 무엇인가?"
            preview="위험을 대신 져 주면 위험을 덜 조심하게 되므로, 규제가 뒤따라 붙습니다."
          >
            <p className="leading-7">
              예금자가 은행의 건전성을 살피지 않게 되면 은행은 더 위험한 자산을
              담아도 조달 비용이 오르지 않습니다. 손실은 크게 나면 보험이 떠안고
              이익은 주주가 가져가는 비대칭이 생깁니다. 이것을 도덕적 해이라고
              부릅니다.
            </p>
            <p className="leading-7">
              그래서 예금보험과 최종대부자는 언제나 규제와 한 묶음으로
              움직입니다. 보험료를 위험에 연동하고, 자본을 미리 쌓게 하고,
              유동성 자산 보유를 요구하는 식입니다. 이 대목이 이 카테고리
              마지막 글의 출발점입니다.
            </p>
            <p className="leading-7">
              한국에서는 예금보험공사가 예금보험을, 한국은행이 최종대부자
              기능을 맡습니다. 보장 한도와 적용 범위는 제도 개편으로 바뀌므로
              금액을 외우기보다 &ldquo;한도 안은 보장, 한도 밖은 손실 분담&rdquo;
              이라는 구조로 기억하는 편이 오래갑니다.
            </p>
          </ProgressiveDetail>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          장부를 다 읽었으니 남는 질문은 그 장부 밖에 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            은행이 대출로 예금을 만든다는 것, 그리고 그 창조에 수익성·유출·자본·
            규제라는 값이 붙는다는 것까지 왔습니다. 그런데 앞 절의 통화승수
            논의에서 남겨 둔 문장이 하나 있습니다. 창조된 통화의 총량이 결국
            중앙은행의 정책에 달려 있다는 것입니다.
          </p>

          <p className="leading-7">
            이 문장은 아직 설명되지 않았습니다. 중앙은행이 준비금을 늘려도 대출이
            늘지 않는다면, 대체 무엇을 움직여 총량에 영향을 준다는 뜻일까요.
            답은 수량이 아니라 가격, 곧 금리에 있습니다.
          </p>

          <p className="leading-7">
            그래서 다음 글은 중앙은행의 장부입니다.{" "}
            <Link to="/finance/banking/central-bank-and-policy-transmission">
              기준금리 한 번이 시장금리로 번지는 경로
            </Link>
            에서 정책금리가 무엇을 조작하는 이름인지, 그것이 어떤 경로로 이
            글의 대출 결정까지 닿는지를 봅니다.
          </p>
        </div>
      </section>
    </div>
  );
}
