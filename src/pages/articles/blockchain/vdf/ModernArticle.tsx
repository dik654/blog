import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { chiaVdfTree } from "./fileTrees";
import VdfEvaluationViz from "./VdfEvaluationViz";

const VDF_PAPER = "https://eprint.iacr.org/2018/601.pdf";
const VDF_SURVEY = "https://eprint.iacr.org/2018/712.pdf";
const WESOLOWSKI_PAPER = "https://eprint.iacr.org/2018/623.pdf";
const CHIAVDF =
  "https://github.com/Chia-Network/chiavdf/tree/6c68b9538d6f84fc248f00adce20646fb838cdf8";
const CHIAVDF_EVAL =
  "https://github.com/Chia-Network/chiavdf/blob/6c68b9538d6f84fc248f00adce20646fb838cdf8/src/vdf.h";
const CHIAVDF_VERIFY =
  "https://github.com/Chia-Network/chiavdf/blob/6c68b9538d6f84fc248f00adce20646fb838cdf8/src/verifier.h";

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article className="space-y-14">
        <section id="overview" className="space-y-6">
          <header className="space-y-3">
            <p className="text-sm font-semibold text-primary">
              한 입력 · 의존하는 제곱 T회 · 결과 하나 · 짧은 증명 하나
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              VDF는 오래 계산한 결과를 처음부터 다시 계산하지 않고 확인하게
              합니다
            </h2>
          </header>

          <VdfEvaluationViz />

          <p className="text-lg leading-8 text-foreground/90">
            검증 가능한 지연 함수(VDF)는 입력 하나에 대해 일정한 순차 계산을
            요구하면서도, 계산이 끝난 뒤에는 누구나 훨씬 적은 일로 같은 결과를
            확인하게 하는 암호학적 도구입니다. 핵심은 단순히 “느린 함수”가
            아니라
            <strong> 순차성, 유일한 출력, 공개 검증</strong>을 함께 요구한다는
            점입니다.
          </p>
          <p>
            이 글은 입력 <code>g</code>와 반복 횟수 <code>T</code>를 고정하고,
            repeated squaring으로 <code>y</code>를 만든 뒤 Wesolowski 증명
            <code>π</code>를 검사하는 한 흐름만 추적합니다. VDF를 난수 비콘에
            연결하거나 블록을 선택하는 규칙은 별도 프로토콜의 책임입니다.
          </p>

          <ContentBoundary article="vdf" />

          <div id="paper-vdf">
            <CitationBlock
              type="paper"
              citeKey={1}
              source="Boneh et al. · Verifiable Delay Functions · 2018/601"
              href={VDF_PAPER}
            >
              <p>
                <strong>문제:</strong> 많은 병렬 프로세서로도 지정 시간보다 빨리
                계산하기 어렵지만 결과는 빠르게 검증할 수 있는 함수를 정의해야
                합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> Setup·Eval·Verify와 correctness,
                soundness, sequentiality, uniqueness의 보안 조건을 정식화합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> 보안 매개변수, 허용한 병렬성, VDF
                construction이 요구하는 계산 가정을 함께 고정합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> VDF의 정의와 후보 construction의
                분석에 한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> 반복 횟수 T가 모든 하드웨어에서
                같은 초 단위 지연을 만든다고 보장하지 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="contract" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              01 · 순차 계산 계약
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              왜 같은 계산 경로를 여러 코어가 나눠 끝낼 수 없을까요?
            </h2>
          </header>
          <p>
            반복 제곱은 현재 원소를 제곱한 결과가 다음 단계의 입력이 됩니다.
            <code>g₂</code>를 모르면 <code>g₃</code>를 계산할 수 없으므로 한
            경로의 임계 경로에는 T개의 의존 단계가 남습니다. 안전한 VDF는 여기에
            순서를 알기 어려운 군과 construction의 보안 가정을 더해, 지수를 군의
            순서로 줄여 건너뛰는 우회도 막습니다.
          </p>

          <ExplainedFormula
            question="Repeated squaring 한 경로에서 매 단계는 무엇을 받는가?"
            idea={
              <>
                직전 군 원소 하나를 제곱해 다음 군 원소를 만들고, T번째 결과를
                y로 둡니다.
              </>
            }
            formula={String.raw`g_0=g,\quad g_{i+1}=g_i^2,\quad y=g_T=g^{2^T}`}
            annotatedFormula={String.raw`\underbrace{g_0=g}_{\text{시작 원소}},\quad \underbrace{g_{i+1}=g_i^2}_{\text{직전 결과에 의존}},\quad \underbrace{y=g_T=g^{2^T}}_{\text{T회 뒤의 유일한 결과}}`}
            operations={[
              {
                expression: String.raw`g_{i+1}=g_i^2`,
                annotation: [
                  "gᵢ가 나온 뒤에만 다음 제곱을 시작",
                  "T회면 한 경로에 T개의 의존 단계",
                  "출력 y는 결정론적으로 하나",
                ],
              },
              {
                expression: String.raw`y=g^{2^T}`,
                annotation: [
                  "제곱할 때마다 지수는 두 배",
                  "T=4이면 지수는 2⁴=16",
                  "검증자는 이 T회를 다시 하지 않음",
                ],
              },
            ]}
            terms={[
              {
                symbol: "G",
                name: "Unknown-order group",
                description:
                  "군의 순서를 알기 어렵다는 가정을 사용하는 계산 공간입니다.",
              },
              {
                symbol: "g",
                name: "Input group element",
                description:
                  "외부 입력을 규칙에 따라 G의 원소로 옮긴 값입니다.",
              },
              {
                symbol: "T",
                name: "Delay parameter",
                description:
                  "초가 아니라 반복할 순차 군 연산의 수를 나타냅니다.",
              },
              {
                symbol: "y",
                name: "VDF output",
                description: "T회의 반복 제곱 뒤에 얻는 결정론적 출력입니다.",
              },
            ]}
            assumptions={[
              "작은 mod 17 군은 계산 순서만 보여 주는 예시이며 보안 매개변수가 아닙니다.",
              "순차성은 코드의 for 문 모양만이 아니라 고정한 construction과 계산 가정에 의존합니다.",
            ]}
            interpretation="g=3, mod 17, T=4이면 3→9→13→16→1 순서로 계산합니다. 그러나 군의 순서를 쉽게 알 수 있는 이 예시는 지수를 줄일 수 있으므로 안전한 VDF가 아닙니다."
          />

          <div className="not-prose flex flex-wrap gap-3">
            <CodeViewButton
              label="실제 반복 제곱 코드"
              onClick={() =>
                sidebar.open(
                  "vdf-repeated-square",
                  codeRefs["vdf-repeated-square"],
                )
              }
            />
          </div>
        </section>

        <section id="wesolowski" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              02 · Wesolowski 증명
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              검증자는 어떻게 T번의 제곱을 짧은 식으로 바꿀까요?
            </h2>
          </header>
          <p>
            비대화형 Wesolowski 구성은 결과 <code>y</code>를 먼저 고정하고,
            transcript를 hash-to-prime에 넣어 소수 <code>ℓ</code>을 만듭니다.
            그런 다음 <code>2^T</code>를 <code>ℓ</code>로 나눈 몫 <code>q</code>
            와 나머지
            <code>r</code>를 지수 법칙에 옮깁니다. 증명 <code>π</code>는 군 원소
            하나입니다.
          </p>

          <ExplainedFormula
            question="Verifier는 2^T번의 제곱 대신 무엇을 확인하는가?"
            idea={
              <>
                큰 지수 2^T를 소수 ℓ에 대한 몫과 나머지로 나누고, 몫 부분을 증명
                π에 담습니다.
              </>
            }
            formula={String.raw`2^T=q\ell+r,\quad \pi=g^q,\quad y\stackrel?=\pi^\ell g^r`}
            annotatedFormula={String.raw`\underbrace{2^T=q\ell+r}_{\text{정수 나눗셈}},\quad \underbrace{\pi=g^q}_{\text{prover가 보낸 군 원소}},\quad \underbrace{y\stackrel?=\pi^\ell g^r}_{\text{verifier의 짧은 검사}}`}
            operations={[
              {
                expression: String.raw`\ell=H_{prime}(G,g,y,T)`,
                annotation: [
                  "논문 표기의 비대화형 transcript",
                  "y를 먼저 고정한 뒤 challenge 생성",
                  "구현마다 정확한 직렬화 입력을 명세로 고정",
                ],
              },
              {
                expression: String.raw`2^T=q\ell+r`,
                annotation: ["T=4, ℓ=5이면 16=3·5+1", "q=3, r=1", "π=g³"],
              },
              {
                expression: String.raw`\pi^\ell g^r=g^{q\ell+r}=g^{2^T}=y`,
                annotation: [
                  "π와 작은 지수 ℓ·r로 계산",
                  "제출된 y와 같은지 비교",
                  "원래 T회의 평가를 되풀이하지 않음",
                ],
              },
            ]}
            terms={[
              {
                symbol: "ℓ",
                name: "Challenge prime",
                description:
                  "결과가 포함된 transcript에서 결정론적으로 얻는 소수입니다.",
              },
              {
                symbol: "q",
                name: "Quotient",
                description: "2^T를 ℓ로 나눈 몫입니다.",
              },
              {
                symbol: "r",
                name: "Remainder",
                description: "Verifier가 빠르게 계산하는 2^T mod ℓ입니다.",
              },
              {
                symbol: "π",
                name: "Proof element",
                description: "몫 지수를 담은 g^q 군 원소입니다.",
              },
            ]}
            assumptions={[
              "비대화형 구성은 Fiat–Shamir와 random-oracle 분석, 충분히 큰 challenge prime을 사용합니다.",
              "Wesolowski soundness는 논문이 명시한 unknown-order group과 adaptive-root 계열 가정에 의존합니다.",
            ]}
            interpretation="설명용 mod 17 예시에서 π=3³=10, ℓ=5, r=1이므로 10⁵·3 mod 17=1=y입니다. 이 등식은 산술을 확인할 뿐 mod 17을 안전한 VDF로 만들지는 않습니다."
          />

          <div className="not-prose border border-border bg-muted/15 p-4 sm:p-5">
            <p className="text-xs font-bold text-primary">
              큰 q를 정수로 펼치지 않는 증명 생성 흐름
            </p>
            <pre className="mt-3 overflow-x-auto text-xs leading-6 text-foreground">
              <code>{`// 증명 원소는 군의 항등원에서 시작합니다.
π ← 1
// 나눗셈의 현재 나머지를 1로 시작합니다.
r ← 1
// 2^T의 비트를 왼쪽부터 처리하듯 T번 반복합니다.
repeat T times:
  // 두 배한 나머지가 ℓ을 넘는지 확인해 몫의 다음 비트를 얻습니다.
  b ← floor(2r / ℓ)
  // 검증자가 다시 계산할 나머지만 유지합니다.
  r ← 2r mod ℓ
  // 몫 q를 저장하지 않고 지수 안에서 π=g^q를 누적합니다.
  π ← π² · g^b
// 완성된 군 원소 하나를 증명으로 보냅니다.
return π`}</code>
            </pre>
          </div>

          <div id="paper-wesolowski-survey">
            <CitationBlock
              type="paper"
              citeKey={2}
              source="Boneh·Bünz·Fisch · A Survey of Two VDFs · 2018/712"
              href={VDF_SURVEY}
            >
              <p>
                <strong>문제:</strong> Pietrzak과 Wesolowski의 반복 제곱 VDF가
                어떤 증명과 계산 가정을 쓰는지 비교해야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> Wesolowski의 quotient/remainder
                검증식, Fiat–Shamir 비대화형 변환과 큰 q를 지수 안에서 계산하는
                long-division 알고리즘을 한 흐름으로 설명합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> 미지 순서 유한 아벨 군,
                hash-to-group, random oracle과 adaptive-root assumption을
                사용합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> 이 글의 식과 설명용 prover 반복은
                survey 2.1절의 구성에 귀속합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> 증명 생성 비용이 0이거나 모든
                하드웨어에서 같은 비율로 빨라진다고 말하지 않습니다.
              </p>
            </CitationBlock>
          </div>

          <div id="paper-wesolowski">
            <CitationBlock
              type="paper"
              citeKey={3}
              source="Wesolowski · Efficient Verifiable Delay Functions · 2018/623"
              href={WESOLOWSKI_PAPER}
            >
              <p>
                <strong>문제:</strong> 짧은 출력과 효율적인 공개 검증을 갖춘
                VDF를 만들어야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> 미지 순서 군에서 result와 proof가
                각각 군 원소 하나인 construction과 보안 분석을 제시합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> RSA group 또는 imaginary quadratic
                field의 class group처럼 순서를 알기 어려운 군을 사용합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> Wesolowski construction과 그 보안
                모델에 한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> 작은 known-order 군이나 임의의
                modulus 선택을 안전하다고 승인하지 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="source" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">03 · 실제 구현</p>
            <h2 className="mt-2 text-2xl font-bold">
              Chia 구현은 이 식을 어떤 함수로 나눌까요?
            </h2>
          </header>
          <p>
            고정한 <code>chiavdf 1.1.14</code>의 기준 경로에서
            <code>repeated_square_original</code>은 직전 form을 제곱해 다음
            iteration으로 넘깁니다. 검증 경로는 <code>GetB</code>로 소수 B를
            만들고, <code>r = 2^iters mod B</code>와 <code>proof^B · x^r</code>
            를 계산해 제출된 <code>y</code>와 비교합니다.
          </p>
          <p>
            논문 표기의 비대화형 transcript와 실제 구현의 입력을 같다고
            뭉뚱그리면 안 됩니다. Survey는 <code>(G,g,y,T)</code>를 hash하는
            일반 구성을 설명하지만, 이 Chia 버전의 <code>GetB</code>는 고정된
            class-group 문맥에서 직렬화한 <code>x</code>와 <code>y</code>를
            입력으로 씁니다.
            <code>D</code>와 <code>iters</code>는 검증 API의 별도 입력입니다.
          </p>
          <p>
            Chia는 긴 평가 구간을 여러 증명으로 잇는 n-Wesolowski 경로도
            제공합니다. 여기서 확인하는 <code>VerifyWesolowskiProof</code>는 그
            구간마다 쓰이는 기본 관계식입니다. 여러 구간의 반복 횟수 합과 마지막
            출력까지 확인해야 전체 n-Wesolowski proof가 완성됩니다.
          </p>

          <div className="not-prose flex flex-wrap gap-3">
            <CodeViewButton
              label="repeated_square 발췌"
              onClick={() =>
                sidebar.open(
                  "vdf-repeated-square",
                  codeRefs["vdf-repeated-square"],
                )
              }
            />
            <CodeViewButton
              label="Wesolowski 검증 발췌"
              onClick={() =>
                sidebar.open(
                  "vdf-wesolowski-verify",
                  codeRefs["vdf-wesolowski-verify"],
                )
              }
            />
          </div>

          <div id="source-chiavdf">
            <CitationBlock
              type="code"
              citeKey={4}
              source="Chia-Network/chiavdf 1.1.14 · commit 6c68b95"
              href={CHIAVDF}
            >
              <p>
                <strong>문제:</strong> Class group에서 반복 제곱을 수행하고
                Wesolowski proof를 실제 bytes와 함수 경계로 검증해야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> <code>src/vdf.h</code>의 evaluation
                루프와 <code>proof_common.h</code>·<code>verifier.h</code>의
                hash-to-prime, remainder, proof equation을 제공합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> 1.1.14 tag의 commit 6c68b95와 같은
                form serialization, discriminant, proof encoding을 함께
                사용합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> 이 버전 Chia VDF 구현의 함수와 입력
                경계에 한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> 이 코드가 모든 VDF construction의
                transcript, 보안 수준이나 wall-clock 지연을 대표하지 않습니다.
              </p>
            </CitationBlock>
          </div>

          <p className="text-sm text-muted-foreground">
            원문 위치:{" "}
            <a className="text-primary hover:underline" href={CHIAVDF_EVAL}>
              evaluation loop
            </a>
            {" · "}
            <a className="text-primary hover:underline" href={CHIAVDF_VERIFY}>
              verification loop
            </a>
          </p>
        </section>

        <section id="boundary" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              04 · 검증 결과의 경계
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              VDF 검증 통과는 어디까지 말해 줄까요?
            </h2>
          </header>

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
            <article className="bg-background p-5">
              <p className="text-xs font-bold text-primary">검증하는 것</p>
              <ul className="mt-3 space-y-2 text-sm leading-6">
                <li>고정한 입력과 T에 대한 제출 결과 y</li>
                <li>고정한 transcript 규칙에서 만든 challenge</li>
                <li>Wesolowski proof equation의 성립</li>
                <li>선택한 construction 가정 아래의 유일한 출력</li>
              </ul>
            </article>
            <article className="bg-background p-5">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                따로 확인할 것
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6">
                <li>T가 실제 장비에서 몇 초인지</li>
                <li>입력에 충분한 entropy가 있는지</li>
                <li>애플리케이션이 결과를 보기 전에 규칙을 고정했는지</li>
                <li>블록 포함·합의·finality가 완료됐는지</li>
              </ul>
            </article>
          </div>

          <p>
            따라서 VDF를 난수 생성에 쓴다면 입력 entropy와 소비 규칙이 더
            필요합니다. 여러 참여자가 미래 round에 값을 만드는 threshold
            beacon은
            <a
              className="ml-1 text-primary hover:underline"
              href="/cs/blockchain/drand#overview"
            >
              drand 글
            </a>
            에서 별도로 추적합니다. VDF proof가 유효하다는 사실만으로 난수
            선택이 공정하거나 chain이 확정됐다고 결론 내리지 않습니다.
          </p>

          <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground">
            <strong className="text-foreground">
              부모 지도에 돌려줄 결론:
            </strong>{" "}
            VDF는 합의나 난수 비콘 전체가 아니라, 고정한 입력을 순차적으로
            평가하고 그 결과를 짧게 검증하는 암호학적 부품입니다. 애플리케이션은
            이 부품 앞에서 입력과 T를 정하고, 뒤에서 검증 결과를 어떤 상태
            전이에 사용할지 따로 정해야 합니다.
          </aside>
        </section>
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ chiavdf: chiaVdfTree }}
        projectMetas={{
          chiavdf: {
            id: "chiavdf",
            label: "chiavdf 1.1.14 · C++",
            badgeClass: "bg-emerald-500/10 border-emerald-500 text-emerald-700",
          },
        }}
      />
    </>
  );
}
