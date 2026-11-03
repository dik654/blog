import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import HyperPlonkZeroCheckViz from "./HyperPlonkZeroCheckViz";
import { codeRefs } from "./codeRefs";
import { hyperplonkTree } from "./fileTree";

const PAPER = "https://eprint.iacr.org/2022/1355.pdf";
const SOURCE =
  "https://github.com/EspressoSystems/hyperplonk/tree/2a3b55c97ad8a5d6627108a2e7def2aeccb7f3b9";

export default function ModernHyperPlonkArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article className="space-y-14 [overflow-wrap:anywhere]">
        <section id="overview" className="space-y-6 scroll-mt-20">
          <header className="space-y-3">
            <p className="text-sm font-semibold text-primary">
              한 문장으로 먼저 답하기
            </p>
            <h2 className="max-w-4xl break-keep text-3xl font-bold tracking-tight">
              HyperPLONK는 많은 행의 오류를 임의로 섞은 뒤 변수 수만큼의 합 검사로 줄입니다
            </h2>
          </header>

          <p className="text-lg leading-8 text-foreground/90">
            네 행에서 <code>x⁵=y</code>를 확인한다고 하겠습니다. 행마다 다시 읽으면
            네 번 검사해야 하지만, HyperPLONK는 행 번호를 <code>00·01·10·11</code>로
            바꾸고 두 변수를 가진 식으로 봅니다. 그러면 네 행의 오차 합을 두 round의
            sumcheck로 줄일 수 있습니다.
          </p>
          <p>
            다만 오차를 그냥 더하면 <code>1+(−1)=0</code>처럼 서로 지울 수 있습니다.
            그래서 먼저 각 행 오차에 예측할 수 없는 가중치를 곱합니다. Sumcheck가
            마지막 한 점까지 줄인 뒤에는 polynomial commitment가 그 값이 처음 약속한
            표에서 왔는지 확인합니다.
          </p>

          <HyperPlonkZeroCheckViz />
          <ContentBoundary article="hyperplonk" />

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              [
                "표현",
                "2^μ rows → μ variables",
                "행 번호의 μ개 bit를 Boolean 좌표로 사용합니다.",
              ],
              [
                "압축",
                "ZeroCheck → sumcheck",
                "모든 행의 0 주장을 임의 가중합과 μ개 round로 줄입니다.",
              ],
              [
                "결속",
                "Permutation + PCS",
                "복사 관계와 마지막 한 점이 원래 약속한 표와 같은지 확인합니다.",
              ],
            ].map(([eyebrow, title, body]) => (
              <article key={eyebrow} className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-primary">{eyebrow}</p>
                <h3 className="mt-2 break-keep text-sm font-black">{title}</h3>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="black-box" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              01 · 이름보다 네 행의 동작을 먼저 보기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Prover는 표 전체를 알고 verifier는 짧은 대화만 확인합니다
            </h2>
          </header>

          <p>
            공식 end-to-end test는 <code>x=[0,1,2,3]</code>과
            <code>y=[0,1,32,243]</code>을 사용합니다. 모든 행에서
            <code>x⁵−y=0</code>입니다. Prover는 이 표와 중간 계산을 알고 있지만,
            verifier가 표의 모든 칸을 다시 읽으면 증명을 쓰는 이점이 줄어듭니다.
          </p>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-center text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3">좌표</th>
                  <th className="p-3">x</th>
                  <th className="p-3">y</th>
                  <th className="p-3">x⁵−y</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["00", "0", "0", "0"],
                  ["01", "1", "1", "0"],
                  ["10", "2", "32", "0"],
                  ["11", "3", "243", "0"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border">
                    {row.map((cell, cellIndex) => (
                      <td key={`${row[0]}-${cellIndex}`} className="p-3 font-mono">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            행이 네 개라 좌표 bit는 두 개입니다. 행이 <code>2^μ</code>개라면 bit와
            변수는 μ개입니다. HyperPLONK가 노리는 핵심 절약은 표 크기만큼 필요한
            FFT 경로를 피하고, 이 μ개 변수에 맞춰 sumcheck를 진행하는 것입니다.
          </p>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton
              label="공식 x⁵−y gate fixture"
              onClick={() => sidebar.open("e2e-gate", codeRefs["e2e-gate"])}
            />
            <CodeViewButton
              label="공식 witness·실패 경로"
              onClick={() => sidebar.open("e2e-paths", codeRefs["e2e-paths"])}
            />
          </div>
        </section>

        <section id="case" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              02 · 틀린 한 행이 만드는 오차
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              값 32를 31로 바꾸면 좌표 10에서만 오차 1이 남습니다
            </h2>
          </header>

          <p>
            Row 10의 <code>x=2</code>는 그대로 두고 y만 31로 바꾸면
            <code>2⁵−31=1</code>입니다. 나머지 세 행은 여전히 0입니다. 이 네 개의
            gate 결과를 <code>f(00),f(01),f(10),f(11)</code>이라고 부르겠습니다.
          </p>

          <ExplainedFormula
            question="공식 test의 custom gate는 각 행에서 무엇을 계산하나요?"
            idea="Selector가 켜진 행에서 첫 witness의 다섯제곱과 둘째 witness의 차이를 계산합니다."
            formula={String.raw`f(x)=q_L(x)W_1(x)^5-W_2(x)`}
            annotatedFormula={String.raw`f(x)=\underbrace{q_L(x)}_{\text{gate selector}}\underbrace{W_1(x)^5}_{\text{첫 witness의 다섯제곱}}-\underbrace{W_2(x)}_{\text{기대 결과}}`}
            operations={[
              {
                expression: String.raw`x=10:\quad q_L=1,\ W_1=2,\ W_2=32`,
                annotation: [
                  "세 번째 행의 Boolean 좌표",
                  "정상 witness 값",
                  "selector가 이 행에서 켜짐",
                ],
              },
              {
                expression: String.raw`1\cdot2^5-32=0`,
                annotation: [
                  "2^5=32",
                  "정상 행은 오차 0",
                  "모든 Boolean corner에서 0이어야 함",
                ],
              },
              {
                expression: String.raw`1\cdot2^5-31=1`,
                annotation: [
                  "y만 31로 바꾼 반례",
                  "좌표 10에 오차 1",
                  "ZeroCheck가 잡아야 할 값",
                ],
              },
            ]}
            terms={[
              {
                symbol: "x",
                name: "Boolean row coordinate",
                description: "00·01·10·11 중 하나인 행 좌표입니다.",
              },
              {
                symbol: "q_L",
                name: "Selector MLE",
                description: "어느 행에 이 custom gate를 적용할지 정합니다.",
              },
              {
                symbol: "W_1,W_2",
                name: "Witness MLEs",
                description: "각 witness column의 네 값을 두 변수 식으로 확장한 것입니다.",
              },
            ]}
            assumptions={[
              "각 witness·selector column의 row order와 bit order를 고정합니다.",
              "Custom gate tuple이 selector와 witness indices를 의도대로 가리킵니다.",
              "Copy 관계와 public input binding은 이 gate와 별도 검사를 거칩니다.",
            ]}
            interpretation="정상 표의 f 값은 [0,0,0,0]입니다. y10=31인 표는 [0,0,1,0]이므로 모든 행에서 0이라는 주장을 만족하지 않습니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton
              label="custom gate tuple과 degree"
              onClick={() => sidebar.open("custom-gate", codeRefs["custom-gate"])}
            />
          </div>
        </section>

        <section id="multilinear" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              03 · 네 칸을 두 변수 식으로 바꾸기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Boolean corner의 값이 정해지면 multilinear extension은 하나로 정해집니다
            </h2>
          </header>

          <p>
            네 값을 식으로 보는 이유는 verifier가 Boolean 좌표 밖의 임의 점도 물을 수
            있게 하기 위해서입니다. 좌표 b와 같은 corner에서만 1이 되는
            <code>χ_b</code>를 만들고, 각 corner 값을 가중치로 더합니다.
          </p>

          <ExplainedFormula
            question="네 table values를 두 변수 MLE로 어떻게 확장하나요?"
            idea="각 Boolean point b에서만 1인 equality basis χ_b를 만들고 table value를 곱해 더합니다."
            formula={String.raw`\widetilde v(r)=\sum_{b\in\{0,1\}^2}v_b\chi_b(r),\qquad \chi_b(r)=\prod_{j=1}^{2}\bigl(b_jr_j+(1-b_j)(1-r_j)\bigr)`}
            annotatedFormula={String.raw`\widetilde v(r)=\underbrace{\sum_{b\in\{0,1\}^2}v_b\chi_b(r)}_{\text{네 corner 값의 가중합}},\qquad \chi_b(r)=\underbrace{\prod_{j=1}^{2}\bigl(b_jr_j+(1-b_j)(1-r_j)\bigr)}_{\text{r=b에서만 1인 basis}}`}
            operations={[
              {
                expression: String.raw`r=(2,3):\quad (\chi_{00},\chi_{01},\chi_{10},\chi_{11})=(2,-3,-4,6)`,
                annotation: [
                  "χ00=(1−2)(1−3)=2",
                  "χ01=(1−2)3=−3",
                  "χ10=2(1−3)=−4, χ11=6",
                ],
              },
              {
                expression: String.raw`v=(3,4,12,1):\quad 3\cdot2+4(-3)+12(-4)+1\cdot6=-48`,
                annotation: [
                  "네 corner 값을 같은 순서로 곱함",
                  "정수 표현의 합은 −48",
                  "F17에서는 −48≡3",
                ],
              },
              {
                expression: String.raw`\widetilde v(b)=v_b\quad\text{for every Boolean }b`,
                annotation: [
                  "맞는 corner의 basis만 1",
                  "나머지 basis는 0",
                  "각 변수 차수는 최대 1",
                ],
              },
            ]}
            terms={[
              {
                symbol: "v_b",
                name: "Table value",
                description: "Bit 좌표 b에 놓인 원래 표 값입니다.",
              },
              {
                symbol: "\\chi_b",
                name: "Equality basis",
                description: "Boolean corner b에서 1이고 다른 corner에서 0인 식입니다.",
              },
              {
                symbol: "\\widetilde v",
                name: "Multilinear extension",
                description: "각 변수 차수가 최대 1이며 원래 표와 모든 corner에서 같은 식입니다.",
              },
            ]}
            assumptions={[
              "00·01·10·11의 순서와 bit endianness를 commitment profile에 고정합니다.",
              "Padding row가 있다면 그 값과 selector 의미를 회로에 포함합니다.",
              "Boolean 밖의 평가는 새 실행 행이 아니라 대수적으로 연장한 값입니다.",
            ]}
            interpretation="MLE는 표를 버리는 것이 아니라 같은 네 값을 임의 field point에서도 평가할 수 있는 하나의 식으로 바꾸는 방법입니다."
          />
        </section>

        <section id="zero-check" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              04 · 단순 합의 상쇄를 막기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              ZeroCheck는 행마다 예측할 수 없는 가중치를 붙입니다
            </h2>
          </header>

          <p>
            <code>[1,−1,0,0]</code>은 틀린 행이 두 개지만 합은 0입니다. 따라서
            <code>Σf(x)=0</code>만 확인해서는 <code>f(x)=0</code>이 모든 행에서
            성립한다고 말할 수 없습니다. 검증자는 prover가 표에 commit한 뒤 임의
            벡터 r을 고릅니다.
          </p>

          <ExplainedFormula
            question="모든 Boolean row에서 f=0이라는 주장을 하나의 합으로 어떻게 바꾸나요?"
            idea="각 행 오차 f(x)에 임의 점 r과의 equality basis를 곱합니다. 거짓 오차들이 이 가중합까지 우연히 0이 될 가능성은 field 크기에 따라 작아집니다."
            formula={String.raw`\widehat f(x)=f(x)\,\mathrm{eq}(x,r),\qquad \sum_{x\in\{0,1\}^{\mu}}\widehat f(x)=0`}
            annotatedFormula={String.raw`\widehat f(x)=\underbrace{f(x)}_{\text{row gate error}}\underbrace{\mathrm{eq}(x,r)}_{\text{transcript가 정한 임의 가중치}},\qquad \underbrace{\sum_{x\in\{0,1\}^{\mu}}\widehat f(x)}_{\text{sumcheck로 줄일 claim}}=0`}
            operations={[
              {
                expression: String.raw`f=[1,-1,0,0]:\quad \sum f=0`,
                annotation: [
                  "두 잘못이 서로 상쇄",
                  "plain sum만 보면 통과",
                  "zero-everywhere와 다른 주장",
                ],
              },
              {
                expression: String.raw`r=(2,3):\quad \mathrm{eq}(00,01,10,11;r)=(2,-3,-4,6)`,
                annotation: [
                  "MLE의 χ basis와 같은 가중치",
                  "prover message 뒤 transcript에서 r 생성",
                  "행마다 다른 값",
                ],
              },
              {
                expression: String.raw`1\cdot2+(-1)(-3)=5\neq0\pmod{17}`,
                annotation: [
                  "상쇄하던 오류가 드러남",
                  "이 r에서는 zero claim 실패",
                  "한 작은 field 예일 뿐 실제 field는 큼",
                ],
              },
            ]}
            terms={[
              {
                symbol: "f(x)",
                name: "Row gate error",
                description: "해당 Boolean row의 custom gate 결과입니다.",
              },
              {
                symbol: "r",
                name: "ZeroCheck challenge",
                description: "오차표가 정해진 뒤 transcript에서 얻는 임의 field vector입니다.",
              },
              {
                symbol: "\\mathrm{eq}(x,r)",
                name: "Random equality weight",
                description: "Boolean x를 임의 점 r에서 평가한 multilinear equality basis입니다.",
              },
            ]}
            assumptions={[
              "Witness commitment와 앞선 transcript 상태가 r보다 먼저 고정됩니다.",
              "Challenge는 충분히 큰 field에서 domain-separated transcript로 생성합니다.",
              "Sumcheck의 마지막 평가를 committed witness와 PCS opening으로 대조합니다.",
            ]}
            interpretation="ZeroCheck가 필요한 이유는 합을 계산하기 위해서가 아니라, 여러 행의 잘못이 합에서 서로 지워지는 것을 막기 위해서입니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton
              label="zero-check의 random r과 f_hat"
              onClick={() => sidebar.open("zero-check", codeRefs["zero-check"])}
            />
          </div>
        </section>

        <section id="sumcheck" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              05 · 네 항의 합을 두 round로 줄이기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              각 round는 한 변수를 임의 값으로 고정하고 다음 claim을 만듭니다
            </h2>
          </header>

          <p>
            Sumcheck 자체를 가장 작은 식 <code>g(b₁,b₂)=b₁b₂</code>로 먼저
            보겠습니다. 네 corner의 합은 1입니다. Prover는 네 값을 보내는 대신 둘째
            변수를 0·1로 더한 한 변수 식을 보냅니다.
          </p>

          <ExplainedFormula
            question="g(b₁,b₂)=b₁b₂의 합 1을 두 round로 어떻게 줄이나요?"
            idea="각 round polynomial의 0·1 값 합이 직전 claim과 같은지 확인한 뒤, 새 challenge에서의 값을 다음 claim으로 사용합니다."
            formula={String.raw`p_1(t)=\sum_{b_2\in\{0,1\}}g(t,b_2)=t,\quad p_2(t)=g(r_1,t)=r_1t`}
            annotatedFormula={String.raw`\underbrace{p_1(t)=g(t,0)+g(t,1)=t}_{\text{둘째 bit를 합침}},\quad \underbrace{p_2(t)=g(r_1,t)=r_1t}_{\text{첫 challenge를 고정}},\quad \underbrace{p_i(0)+p_i(1)}_{\text{직전 claim과 비교}}`}
            operations={[
              {
                expression: String.raw`g(0,0)+g(0,1)+g(1,0)+g(1,1)=1`,
                annotation: [
                  "11에서만 값 1",
                  "처음 claimed sum은 1",
                  "네 corner의 직접 계산",
                ],
              },
              {
                expression: String.raw`p_1(0)+p_1(1)=0+1=1,\quad r_1=2`,
                annotation: [
                  "첫 endpoint 합이 이전 claim과 일치",
                  "p₁을 받은 뒤 r₁ 생성",
                  "다음 claim은 p₁(2)=2",
                ],
              },
              {
                expression: String.raw`p_2(t)=2t,\quad p_2(0)+p_2(1)=2,\quad r_2=3`,
                annotation: [
                  "둘째 endpoint 합도 직전 claim 2와 일치",
                  "마지막 값 p₂(3)=6",
                  "g(2,3)=6과 대조",
                ],
              },
            ]}
            terms={[
              {
                symbol: "p_i",
                name: "Round polynomial",
                description: "아직 고정하지 않은 Boolean 변수를 합해 만든 한 변수 식입니다.",
              },
              {
                symbol: "r_i",
                name: "Round challenge",
                description: "해당 p_i가 transcript에 들어간 뒤 생성하는 임의 값입니다.",
              },
              {
                symbol: "p_i(0)+p_i(1)",
                name: "Round invariant",
                description: "이번 round message와 직전 claim을 잇는 검사입니다.",
              },
            ]}
            assumptions={[
              "Verifier가 각 p_i의 허용 degree를 확인합니다.",
              "p_i가 transcript에 고정된 뒤 r_i를 생성합니다.",
              "마지막 g(r₁,r₂)는 원래 committed polynomials의 평가와 연결합니다.",
            ]}
            interpretation="2²개 값을 직접 보내는 대신 두 round를 거쳐 한 점 g(r₁,r₂)으로 줄였습니다. 2^μ개 row라면 round 수는 μ입니다."
          />

          <ExplainedFormula
            question="거짓 sum claim이 random challenges를 통과할 단순 상한은 무엇인가요?"
            idea="각 round에서 거짓 식과 정답 식의 차이는 degree만큼의 roots에서만 우연히 0이 될 수 있습니다."
            formula={String.raw`\Pr[\mathrm{false\ sum\ accepted}]\le \frac{\mu d}{|\mathbb F|}`}
            annotatedFormula={String.raw`\Pr[\mathrm{false\ sum\ accepted}]\le \frac{\underbrace{\mu}_{\text{round 수}}\underbrace{d}_{\text{round degree bound}}}{\underbrace{|\mathbb F|}_{\text{challenge 공간}}}`}
            operations={[
              {
                expression: String.raw`\mu=2,\ d=1,\ |\mathbb F|=17`,
                annotation: [
                  "두 변수라 두 round",
                  "설명용 선형 polynomial",
                  "작은 field는 계산을 보기 위한 예",
                ],
              },
              {
                expression: String.raw`\mu d/|\mathbb F|=2/17`,
                annotation: [
                  "각 round의 root 확률을 합친 상한",
                  "정확한 실패 확률이 아님",
                  "ZeroCheck·PCS 오차는 별도 결합",
                ],
              },
            ]}
            terms={[
              {
                symbol: "d",
                name: "Per-round degree bound",
                description: "Verifier가 허용하는 round polynomial의 최대 차수입니다.",
              },
              {
                symbol: "|\\mathbb F|",
                name: "Field size",
                description: "Challenge가 선택되는 field 원소 수입니다.",
              },
            ]}
            assumptions={[
              "Challenges가 매 round message 뒤에 균일하게 파생됩니다.",
              "Degree bound와 마지막 evaluation relation을 실제로 검사합니다.",
              "이 식은 sumcheck 한 구성요소의 단순 union bound이며 전체 HyperPLONK 보안식이 아닙니다.",
            ]}
            interpretation="Challenge를 항상 0으로 고르면 error polynomial X가 매번 0이므로 이 상한을 적용할 수 없습니다. 임의성과 순서가 식의 전제입니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton
              label="sumcheck prove·verify loop"
              onClick={() => sidebar.open("sumcheck", codeRefs.sumcheck)}
            />
          </div>
        </section>

        <section id="hyperplonk-boundary" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              06 · Gate·copy·commitment의 책임 나누기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Sumcheck가 줄인 것은 gate claim이며 wiring과 마지막 값은 따로 묶습니다
            </h2>
          </header>

          <div className="not-prose overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3">검사</th>
                  <th className="p-3">답하는 질문</th>
                  <th className="p-3">빠지면 생기는 문제</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["ZeroCheck", "모든 row의 custom gate가 0인가?", "오류가 있는 행도 relation 밖에 남음"],
                  ["Permutation check", "복사되어야 할 wire 값이 같은 multiset인가?", "Gate별 값은 맞아도 wiring을 바꿀 수 있음"],
                  ["Multilinear PCS", "마지막 random-point 값이 commit한 표와 같은가?", "Prover가 마지막 평가를 임의로 말할 수 있음"],
                  ["Transcript", "Message가 정해진 뒤 challenge가 나왔는가?", "Challenge를 미리 알고 거짓 식을 맞출 수 있음"],
                ].map(([name, question, failure]) => (
                  <tr key={name} className="border-t border-border">
                    <td className="p-3 font-semibold">{name}</td>
                    <td className="p-3">{question}</td>
                    <td className="p-3 text-muted-foreground">{failure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            “FFT-free”도 이 경계를 지우지 않습니다. Univariate domain의 FFT·NTT를
            피한다는 뜻이지, witness를 읽는 일, high-degree gate 연산, sumcheck
            message, permutation argument, KZG commitment와 opening이 사라진다는 뜻은
            아닙니다.
          </p>

          <AlgorithmBlock
            title="공식 four-row gate를 HyperPLONK proof로 확인하는 과정"
            input={[
              "rows = x:[0,1,2,3], y:[0,1,32,243]",
              "gate = qL·x^5−y, selector qL:[1,1,1,1]",
              "profile = sourceCommit + field/curve + multilinear PCS + transcript + rowOrder",
            ]}
            steps={[
              {
                code: "map rows 0..3 → Boolean coordinates 00,01,10,11",
                note: "각 witness·selector column을 두 변수 MLE로 해석합니다.",
              },
              {
                code: "commit(W1); commit(W2); append commitments to transcript",
                note: "ZeroCheck challenge가 나오기 전에 witness tables를 고정합니다.",
              },
              {
                code: "f(x) = qL(x)·W1(x)^5 − W2(x)",
                note: "모든 Boolean corner에서 0이어야 하는 gate error polynomial입니다.",
              },
              {
                code: "r ← transcript; fHat(x)=f(x)·eq(x,r)",
                note: "행 오류의 단순 상쇄를 임의 가중치로 막습니다.",
              },
              {
                code: "for i in 1..μ: send p_i; check endpoints; sample r_i",
                note: "2^μ개 항의 합을 μ개 round와 한 random-point claim으로 줄입니다.",
              },
              {
                code: "verify permutation subclaim; batch-open MLE commitments",
                note: "Wiring과 마지막 평가값을 원래 표에 결속합니다.",
              },
              {
                code: "reject wrong witness | wrong permutation/VK | malformed round/opening",
                note: "정상 proof와 독립된 실패 fixture를 각각 확인합니다.",
              },
            ]}
            output="releaseReceipt = source/dependency lock + semantic failures + phase metrics + artifact hashes"
          />
        </section>

        <section id="release" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              07 · Linear-time보다 먼저 재현 경계를 고정하기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              소스·의존성·실패 경로가 같아야 성능 숫자도 비교할 수 있습니다
            </h2>
          </header>

          <aside className="not-prose rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
              고정 소스로 직접 실행한 결과
            </p>
            <p className="mt-2 text-sm leading-6">
              현재 HEAD <code>2a3b55c</code>에서 release test를 실행했습니다. Sumcheck
              5개, ZeroCheck 3개, HyperPLONK end-to-end 1개가 모두 통과했습니다.
              End-to-end test는 정상 <code>x⁵−y</code> proof를 검증하고, 다른
              permutation으로 만든 VK와 잘못 바꾼 witness를 각각 거절합니다.
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              저장소 HEAD에는 <code>Cargo.lock</code>이 없어 <code>--locked</code> 실행은
              실패했습니다. 따라서 성공 실행은 2026-11-01에 Cargo가 새로 해석한 115개
              package와 rustc 환경에 한정됩니다. 이 실행은 audit이나 production
              readiness를 뜻하지 않습니다.
            </p>
          </aside>

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["valid", "x=[0,1,2,3] · y=[0,1,32,243]", "prove·verify 통과"],
              ["wrong row", "y10=31", "gate/ZeroCheck 실패"],
              ["cancelling errors", "f=[1,−1,0,0]", "random-weight ZeroCheck가 탐지"],
              ["wrong permutation", "다른 wiring index", "공식 E2E verify=false"],
              ["wrong witness", "w1[0]: 0→1", "공식 E2E prove error"],
              ["profile drift", "source·dependency·PCS·transcript 변경", "old/new cross-matrix 실행"],
            ].map(([name, fixture, expected]) => (
              <article key={name} className="bg-background p-4">
                <p className="text-[9px] font-bold text-primary">{name}</p>
                <p className="mt-2 break-words font-mono text-xs font-semibold">
                  {fixture}
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {expected}
                </p>
              </article>
            ))}
          </div>

          <p>
            이 실패 행렬을 통과한 뒤에 commit, gate build, ZeroCheck, permutation,
            PCS open·verify 시간을 따로 잽니다. <code>O(N)</code>은 입력 크기에 대한
            증가율이며, 실제 wall time과 memory traffic, MSM·pairing 비용의 상수까지
            작다는 뜻은 아닙니다.
          </p>
          <p>
            현재 공식 README는 외부 보안 감사를 받지 않았다고 명시합니다. 또한
            incomplete proof를 다루는 일부 reference 경로는 production parser처럼
            모든 malformed input을 안전한 오류로 바꾸는지 별도 점검해야 합니다.
          </p>

          <div id="paper-hyperplonk">
            <CitationBlock
              source="Chen et al. · HyperPlonk (EUROCRYPT 2023)"
              citeKey={1}
              href={PAPER}
            >
              <p><strong>문제:</strong> PLONK의 FFT 경로와 high-degree custom gate prover overhead를 줄입니다.</p>
              <p><strong>기여:</strong> Boolean hypercube·ZeroCheck·sumcheck·multilinear PCS를 결합한 HyperPLONK PIOP를 제시합니다.</p>
              <p><strong>전제:</strong> Field challenge, degree bound, transcript와 commitment soundness를 사용합니다.</p>
              <p><strong>근거 범위:</strong> Protocol, asymptotic analysis와 논문 benchmark 범위입니다.</p>
              <p><strong>말하지 않는 것:</strong> 모든 구현의 wall time, memory 우위나 production 안전을 보장하지 않습니다.</p>
            </CitationBlock>
          </div>

          <div id="paper-hyperplonk-source">
            <CitationBlock
              source="EspressoSystems/hyperplonk · commit 2a3b55c"
              citeKey={2}
              type="code"
              href={SOURCE}
            >
              <p><strong>문제:</strong> Gate·ZeroCheck·sumcheck·permutation·PCS가 실제 코드에서 어떻게 이어지는지 확인합니다.</p>
              <p><strong>기여:</strong> Rust reference implementation과 positive·negative end-to-end tests를 제공합니다.</p>
              <p><strong>고정한 버전:</strong> 2025-02-20 commit <code>2a3b55c</code>입니다.</p>
              <p><strong>근거 범위:</strong> 선택 snapshot과 실행 시 새로 해석한 Cargo dependency set입니다.</p>
              <p><strong>말하지 않는 것:</strong> README가 명시하듯 외부 audit이나 production readiness를 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ hyperplonk: hyperplonkTree }}
        projectMetas={{
          hyperplonk: {
            id: "hyperplonk",
            label: "EspressoSystems/hyperplonk · Rust · multilinear KZG",
            badgeClass: "bg-cyan-500/10 border-cyan-500 text-cyan-700",
          },
        }}
      />
    </>
  );
}
