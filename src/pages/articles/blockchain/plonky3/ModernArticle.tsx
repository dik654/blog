import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import Plonky3ProofViz from "./Plonky3ProofViz";
import { codeRefs } from "./codeRefs";
import { plonky3Tree } from "./fileTrees";

const COMMIT = "0d803737b681774186cd283b1fd2d8e493655c82";
const SOURCE = `https://github.com/Plonky3/Plonky3/tree/${COMMIT}`;
const ARCHITECTURE = `https://github.com/Plonky3/Plonky3/blob/${COMMIT}/docs/architecture.md`;
const STARK_PAPER = "https://eprint.iacr.org/2018/046.pdf";

const TRACE = [
  [0, 1],
  [1, 1],
  [1, 2],
  [2, 3],
  [3, 5],
  [5, 8],
  [8, 13],
  [13, 21],
] as const;

export default function ModernPlonky3Article() {
  const sidebar = useCodeSidebar();

  const openSource = (key: string) =>
    sidebar.open(key, codeRefs[key]);

  return (
    <>
      <article className="space-y-14 [overflow-wrap:anywhere]">
        <section id="overview" className="space-y-6 scroll-mt-20">
          <header className="space-y-3">
            <p className="text-sm font-semibold text-primary">한 문장으로 먼저 답하기</p>
            <h2 className="max-w-4xl break-keep text-3xl font-bold tracking-tight">
              Plonky3 proof는 같은 AIR·공개값·config가 있어야 뜻이 생깁니다
            </h2>
          </header>

          <p className="text-lg leading-8 text-foreground/90">
            Proof 파일만 보고 “0과 1에서 시작한 피보나치 계산의 끝이 21이다”라고 알 수는
            없습니다. 실제 verifier 호출은 proof와 별도로 계산 규칙인 AIR, 공개값
            <code>[0,1,21]</code>, 그리고 field·commitment·FRI·transcript가 연결된
            config를 받습니다.
          </p>
          <p>
            Plonky3의 핵심은 이 부품들을 하나의 고정된 조합으로 강제하지 않는 데 있습니다.
            필요한 증명 시스템을 Rust type으로 조립할 수 있습니다. 대신 “어느 조합으로
            무엇을 증명했는가”를 배포 시스템이 정확히 관리해야 합니다.
          </p>

          <Plonky3ProofViz />
          <ContentBoundary article="plonky3" />

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              ["계산", "8 rows × 2 columns", "(0,1)에서 (13,21)까지 이어지는 실행표입니다."],
              ["조립", "AIR + PCS + transcript", "계산 규칙과 암호 부품을 서로 맞는 type으로 연결합니다."],
              ["의미", "proof + external context", "Proof bytes만으로는 AIR·공개값·version을 알 수 없습니다."],
            ].map(([eyebrow, title, body]) => (
              <article key={eyebrow} className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-primary">{eyebrow}</p>
                <h3 className="mt-2 break-keep text-sm font-black">{title}</h3>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="black-box" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">01 · 이름보다 입출력을 먼저 보기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Prover는 실행표를 숨겨 처리하고 verifier는 짧은 proof와 공개 문맥을 받습니다
            </h2>
          </header>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3">주체</th>
                  <th className="p-3">입력</th>
                  <th className="p-3">하는 일</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Prover", "8×2 trace·AIR·public values·config", "trace와 quotient를 commit하고 opening proof 생성"],
                  ["Verifier", "AIR·public values·같은 config·proof", "transcript 재생, opening 검사, AIR 항등식 확인"],
                  ["Application", "verifier route·source/version 정책", "어떤 AIR와 config를 신뢰할지 proof 바깥에서 선택"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => (
                      <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            “Plonky3가 proof를 검증한다”는 말에는 숨은 주어가 있습니다. 호출자가 어떤
            AIR 구현과 어떤 config를 verifier에 넣었는지가 먼저 정해져 있어야 합니다.
            그 선택이 다르면 같은 바이트의 의미도 달라집니다.
          </p>
        </section>

        <section id="case" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">02 · 같은 작은 계산을 끝까지 유지하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              공식 test는 피보나치 수 하나가 아니라 인접한 두 값을 8행에 기록합니다
            </h2>
          </header>

          <p>
            첫 행을 <code>(left,right)=(0,1)</code>로 둡니다. 다음 행의 left에는 현재
            right를 옮기고, 다음 right에는 현재 두 값을 더한 값을 둡니다. 이 과정을
            일곱 번 반복하면 마지막 행은 <code>(13,21)</code>입니다.
          </p>

          <div className="not-prose grid grid-cols-4 gap-1.5 sm:grid-cols-8">
            {TRACE.map(([left, right], index) => (
              <article key={`${left}-${right}-${index}`} className="min-w-0 border border-border bg-background p-3 text-center">
                <p className="text-[8px] font-bold text-muted-foreground">row {index}</p>
                <p className="mt-2 font-mono text-xs font-black">{left} · {right}</p>
              </article>
            ))}
          </div>

          <p>
            왜 한 열에 <code>0,1,1,2,3,5,8,13,21</code>을 쓰지 않을까요? AIR은 현재
            행과 다음 행을 함께 열어 관계를 검사합니다. 두 열로 두면 “right를 다음
            left로 옮긴다”와 “두 값을 더한다”를 각각 단순한 제약으로 쓸 수 있습니다.
          </p>
        </section>

        <section id="air" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">03 · 실행표를 받아들일 조건으로 바꾸기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              시작·전이·끝을 모두 묶어야 21이라는 공개 주장이 정해집니다
            </h2>
          </header>

          <ExplainedFormula
            question="8행 trace가 피보나치 계산임을 어떤 세 조건으로 표현하나요?"
            idea="첫 행의 두 값, 모든 인접 행의 이동·덧셈, 마지막 행의 공개 결과를 각각 0이 되는 식으로 검사합니다."
            formula={String.raw`(a_0,b_0)=(0,1),\quad(a_{i+1},b_{i+1})=(b_i,a_i+b_i),\quad b_7=21`}
            annotatedFormula={String.raw`\begin{aligned}
              &\underbrace{(a_0,b_0)=(0,1)}_{\text{공개 시작값}} \\
              &\underbrace{(a_{i+1},b_{i+1})=(b_i,a_i+b_i)}_{\text{일곱 전이}} \\
              &\underbrace{b_7=21}_{\text{공개 끝값}}
            \end{aligned}`}
            operations={[
              { expression: String.raw`(a_0,b_0)=(0,1)`, annotation: ["첫 행에서만 검사", "다른 씨앗으로 시작하는 표를 거절"] },
              { expression: String.raw`a_{i+1}-b_i=0`, annotation: ["현재 right를 다음 left로 이동", "i=0부터 6까지 적용"] },
              { expression: String.raw`b_{i+1}-a_i-b_i=0`, annotation: ["다음 right는 현재 두 값의 합", "row 6→7에서는 21−8−13=0"] },
              { expression: String.raw`b_7-21=0`, annotation: ["마지막 행에서만 검사", "공개 결과와 trace를 연결"] },
            ]}
            terms={[
              { symbol: "a_i", name: "left column", description: "i번째 행의 왼쪽 값입니다." },
              { symbol: "b_i", name: "right column", description: "i번째 행의 오른쪽 값입니다." },
              { symbol: "i", name: "transition row", description: "0부터 6까지의 인접 행 번호입니다." },
            ]}
            assumptions={[
              "계산은 선택한 base field 안에서 이뤄집니다.",
              "Trace 높이는 이 test에서 2³=8입니다.",
              "Selector는 마지막 행 뒤에 존재하지 않는 다음 행을 검사하지 않습니다.",
            ]}
            interpretation="row 6=(8,13), row 7=(13,21)이므로 이동식은 13−13=0, 덧셈식은 21−8−13=0입니다. 마지막 right도 공개값 21과 같습니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Fibonacci AIR·trace 원문" onClick={() => openSource("p3-fib-air")} />
          </div>

          <p>
            전이 조건만 남기면 <code>(2,7)</code>에서 시작하는 다른 피보나치 표도 통과할
            수 있습니다. 마지막 조건만 남기면 중간 계산을 마음대로 만들 수 있습니다.
            세 종류의 조건은 중복이 아니라 서로 다른 빈틈을 막습니다.
          </p>
        </section>

        <section id="config" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">04 · 이름은 역할이 보인 뒤 붙이기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Config는 옵션 목록이 아니라 서로의 type을 참조하는 한 연결망입니다
            </h2>
          </header>

          <p>
            공식 test의 <code>MyConfig</code>를 위에서 아래로 읽으면 역할이 보입니다.
            BabyBear가 trace 값을 담고, 4차 확장체가 challenge 공간을 넓힙니다.
            Poseidon2 기반 hash와 compression이 Merkle MMCS를 만들고, radix-2 DFT와
            MMCS가 FRI PCS 안으로 들어갑니다. 마지막 challenger가 commitment를 관찰해
            Fiat–Shamir challenge를 만듭니다.
          </p>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">역할</th><th className="p-3">공식 test의 선택</th><th className="p-3">바꾸면 함께 달라지는 것</th></tr>
              </thead>
              <tbody>
                {[
                  ["Trace field", "BabyBear", "domain·DFT·직렬화 가능한 base 값"],
                  ["Challenge field", "BabyBear 4차 확장", "α·ζ와 soundness 계산"],
                  ["Commitment", "Poseidon2 + Merkle MMCS", "commitment 값·opening path"],
                  ["Polynomial opening", "TwoAdicFriPcs", "blowup·queries·folding·proof 형식"],
                  ["Transcript", "DuplexChallenger", "commitment를 흡수한 challenge 순서"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Fibonacci config 원문" onClick={() => openSource("p3-fib-config")} />
            <CodeViewButton label="StarkGenericConfig 원문" onClick={() => openSource("p3-generic-config")} />
          </div>

          <p>
            이 test는 <code>num_queries=2</code>, <code>log_blowup=2</code>, 작은 PoW를
            사용합니다. 빠른 회귀 검사용 fixture이지 “2 queries면 운영에서 안전하다”는
            권장값이 아닙니다. 실제 배포에서는 목표 보안값을 먼저 정하고 composable
            soundness 분석으로 parameter를 골라야 합니다.
          </p>
        </section>

        <section id="prove-path" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">05 · 같은 요청의 prover 경로</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Trace를 고정한 뒤 제약을 quotient로 바꾸고 필요한 위치만 엽니다
            </h2>
          </header>

          <p>
            먼저 8행 trace를 더 큰 평가 영역에서 계산하고 commitment를 만듭니다.
            Transcript는 이 commitment와 공개값을 흡수해 challenge <code>α</code>를
            정합니다. α는 여러 제약을 하나로 섞는 계수입니다.
          </p>

          <ExplainedFormula
            question="여러 AIR 제약을 왜 quotient 하나로 바꿀 수 있나요?"
            idea="각 제약을 임의 계수 α의 거듭제곱으로 섞습니다. 올바른 trace에서는 그 식이 trace domain 전체에서 0이므로, 그 domain에서 0인 다항식 Z_H로 정확히 나뉩니다."
            formula={String.raw`C_\alpha(X)=\sum_j\alpha^j C_j(X),\qquad Q(X)=\frac{C_\alpha(X)}{Z_H(X)}`}
            annotatedFormula={String.raw`\begin{aligned}
              \underbrace{C_\alpha(X)}_{\text{여러 제약을 섞은 식}}
                &= \sum_j\alpha^j C_j(X) \\
              \underbrace{Q(X)}_{\text{제약 몫}}
                &= \frac{C_\alpha(X)}{\underbrace{Z_H(X)}_{\text{8행 domain에서 0}}}
            \end{aligned}`}
            operations={[
              { expression: String.raw`C_\alpha= C_0+\alpha C_1+\alpha^2 C_2+\cdots`, annotation: ["제약마다 따로 opening하지 않음", "α는 trace commitment 뒤에 정함"] },
              { expression: String.raw`C_\alpha(h)=0\;\text{for every }h\in H`, annotation: ["올바른 8행에서 모든 제약이 0", "Z_H의 모든 근에서도 0"] },
              { expression: String.raw`C_\alpha=Z_H Q`, annotation: ["나머지가 없는 다항식 나눗셈", "바깥점 ζ에서 한 번 더 대조"] },
            ]}
            terms={[
              { symbol: "C_j", name: "AIR constraint", description: "시작·이동·덧셈·끝 조건 중 하나입니다." },
              { symbol: "α", name: "batching challenge", description: "commitment와 공개값 뒤 transcript에서 나온 임의 값입니다." },
              { symbol: "Z_H", name: "vanishing polynomial", description: "trace domain H의 모든 점에서 0인 다항식입니다." },
              { symbol: "Q", name: "quotient", description: "섞은 제약식이 trace domain에서 0임을 담는 몫입니다." },
            ]}
            assumptions={[
              "AIR의 실제 최대 차수와 quotient domain 크기를 맞춥니다.",
              "α는 trace commitment와 공개값을 흡수한 뒤 정합니다.",
              "작은 설명은 역할을 보여 주며 실제 field에서의 soundness 값은 config에 따라 달라집니다.",
            ]}
            interpretation="row마다 제약식을 전부 보내는 대신, 한 quotient 항등식을 commitment와 무작위 바깥점 opening으로 확인할 수 있습니다."
          />

          <AlgorithmBlock
            title="공식 prover 경로와 같은 순서의 의사코드"
            input={["trace 8×2", "FibonacciAir", "public=[0,1,21]", "고정된 StarkConfig"]}
            steps={[
              { code: "trace_commit ← PCS.commit(LDE(trace))", note: "질문을 만들기 전에 실행표를 고정합니다." },
              { code: "α ← transcript(shape, trace_commit, public_values)", note: "AIR shape와 공개값까지 같은 순서로 흡수합니다." },
              { code: "Q ← combine_constraints(AIR, α) / Z_H", note: "시작·전이·끝 제약을 하나의 quotient 항등식으로 만듭니다." },
              { code: "quotient_commit ← PCS.commit(Q chunks)", note: "몫도 challenge ζ가 나오기 전에 고정합니다." },
              { code: "ζ ← transcript(quotient_commit, PoW); opening ← PCS.open(ζ, gζ)", note: "current·next trace와 quotient의 필요한 값만 엽니다." },
            ]}
            output="commitments·opened values·PCS/FRI opening proof·degree bits·PoW witness"
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="trace commit→quotient 원문" onClick={() => openSource("p3-prove-pipeline")} />
          </div>
        </section>

        <section id="proof-shape" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">06 · proof 구조체를 실제로 열어 보기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              직렬화되는 Proof에는 AIR 이름과 공개값과 config hash가 없습니다
            </h2>
          </header>

          <p>
            실제 <code>Proof&lt;SC&gt;</code>에는 trace·quotient commitment, 열린 값, PCS
            opening proof, <code>degree_bits</code>, out-of-domain PoW witness가 있습니다.
            반면 <code>FibonacciAir</code> 코드, 공개값 <code>[0,1,21]</code>, source commit은
            들어 있지 않습니다.
          </p>

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
            <article className="min-w-0 bg-background p-4">
              <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-300">Proof bytes 안</p>
              <ul className="mt-3 space-y-2 text-xs leading-5">
                <li>· trace·quotient·선택적 random commitment</li>
                <li>· ζ와 다음 점에서 연 값</li>
                <li>· PCS/FRI opening proof</li>
                <li>· degree bits·PoW witness</li>
              </ul>
            </article>
            <article className="min-w-0 bg-background p-4">
              <p className="text-[10px] font-black text-amber-700 dark:text-amber-300">호출자·배포가 따로 고정</p>
              <ul className="mt-3 space-y-2 text-xs leading-5">
                <li>· AIR implementation과 의미</li>
                <li>· 공개 statement 값과 schema</li>
                <li>· exact config·parameter·serialization</li>
                <li>· source commit·toolchain·verifier route</li>
              </ul>
            </article>
          </div>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Proof 구조체 원문" onClick={() => openSource("p3-proof-shape")} />
          </div>

          <p>
            따라서 별도의 receipt나 envelope를 만드는 것은 Plonky3 기본 Proof의 필드를
            설명하는 일이 아니라 애플리케이션 통합 규칙을 추가하는 일입니다. 예를 들어
            <code>air_id</code>, <code>config_id</code>, <code>source_sha</code>, 공개값,
            proof bytes를 함께 서명하거나 신뢰된 verifier endpoint에 묶을 수 있습니다.
          </p>
        </section>

        <section id="verify-path" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">07 · 같은 요청의 verifier 경로</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              같은 문맥으로 transcript를 재생한 뒤 opening과 AIR 항등식을 모두 확인합니다
            </h2>
          </header>

          <AlgorithmBlock
            title="공식 verifier 경로와 같은 순서의 의사코드"
            input={["같은 StarkConfig", "FibonacciAir", "proof", "public=[0,1,21]"]}
            steps={[
              { code: "proof shape와 degree/domain 범위를 먼저 검사", note: "악의적인 크기값으로 shift·allocation이 깨지기 전에 거절합니다." },
              { code: "α, ζ ← transcript.replay(config, AIR shape, commitments, public)", note: "prover와 같은 메시지 순서여야 같은 challenge가 나옵니다." },
              { code: "PCS.verify(opening claims, opening_proof)", note: "열린 current·next·quotient 값이 commitment에 속하는지 확인합니다." },
              { code: "Q(ζ) ← quotient chunks를 재조립", note: "분할해 commit한 몫을 바깥점의 한 값으로 합칩니다." },
              { code: "verify_constraints(AIR, current, next, public, α, Q(ζ))", note: "검증자가 들고 있는 AIR의 Cα(ζ)=Z_H(ζ)Q(ζ)를 확인합니다." },
            ]}
            output="모든 단계가 성공하면 Ok(()), 하나라도 다르면 typed VerificationError"
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="verifier transcript 원문" onClick={() => openSource("p3-verify-transcript")} />
            <CodeViewButton label="AIR 항등식 검사 원문" onClick={() => openSource("p3-verify-air")} />
          </div>

          <p>
            중요한 순서는 <strong>opening 검증 뒤 AIR 항등식 검증</strong>입니다. Opening이
            맞다는 사실은 “이 값이 commitment 안에 있었다”만 말합니다. 그 값이 피보나치
            규칙과 공개값을 만족하는지는 verifier가 가진 AIR을 적용해야 알 수 있습니다.
          </p>
        </section>

        <section id="failure-boundaries" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">08 · 정상과 거절을 실제로 실행하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              정상 8행은 통과하고 짧은 공개값과 과도한 degree는 구조화된 오류로 거절됐습니다
            </h2>
          </header>

          <p>
            2026-11-01 공식 main HEAD <code>0d803737</code>에서 Rust
            <code>1.93.0</code>으로 세 test를 직접 실행했습니다. 빌드 작업은 두 개로
            제한했고, 첫 compile을 포함해 약 21초가 걸렸습니다. 아래는 성능
            benchmark가 아니라 기능 경계 확인입니다.
          </p>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">실행한 test</th><th className="p-3">바꾼 것</th><th className="p-3">실제 결과</th></tr>
              </thead>
              <tbody>
                {[
                  ["test_public_value", "8행·public [0,1,21]", "prove·verify 통과"],
                  ["test_short_public_values_rejected", "public을 [0,1]로 축소", "expected 3, got 2로 거절"],
                  ["test_degree_bits_too_large_rejected", "degree_bits=usize::BITS", "DegreeBitsTooLarge로 거절"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="정상 prove·verify test" onClick={() => openSource("p3-fib-success")} />
            <CodeViewButton label="공개값 mismatch test" onClick={() => openSource("p3-public-mismatch")} />
          </div>

          <p>
            이것으로 모든 악의적 proof가 안전하게 오류로 끝난다고 말할 수는 없습니다.
            공식 README는 특정 malformed proof에서 verifier가 panic할 수 있다고 경고하며,
            신뢰하지 않는 proof를 받는 통합자는 <code>verify</code>를
            <code>catch_unwind</code>로 감싸라고 권합니다. Process 격리, 입력 크기 제한,
            timeout과 메모리 한도도 함께 두는 편이 안전합니다.
          </p>
        </section>

        <section id="release" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">09 · 배포 전에 의미와 성능을 따로 고정하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              먼저 proof의 의미를 잠그고 그 다음 같은 profile에서 비용을 잽니다
            </h2>
          </header>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">Release gate</th><th className="p-3">반드시 고정할 것</th><th className="p-3">실패하면</th></tr>
              </thead>
              <tbody>
                {[
                  ["Semantic parity", "native 실행과 AIR의 정상·단일 행·시작·끝 변조 corpus", "AIR 수정"],
                  ["Artifact binding", "air/config/source ID·public schema·proof format", "서로 다른 verifier route 차단"],
                  ["Security profile", "field·extension·PCS·queries·blowup·PoW·ZK", "parameter 재산정"],
                  ["Adversarial boundary", "shape·opening·transcript·panic·resource-limit tests", "격리·fail closed"],
                  ["Performance", "같은 workload·compiler·features·hardware에서 prove/verify·bytes·RSS", "이전 profile로 rollback"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Main HEAD는 현재 package version 0.8.0을 사용하지만 0.9.0 release candidate와
            deprecated crate 안내도 함께 존재합니다. Moving main과 stable tag를 같은
            artifact로 취급하지 말고, 실제 배포는 commit·Cargo.lock·Rust toolchain·feature와
            serialization fixture까지 고정해야 합니다.
          </p>

          <div id="paper-stark-plonky3">
            <CitationBlock source="Ben-Sasson et al. · STARK" citeKey={1} href={STARK_PAPER}>
              <p><strong>문제:</strong> Trusted setup 없이 큰 계산의 무결성을 짧게 검증합니다.</p>
              <p><strong>기여:</strong> AIR, low-degree IOP, FRI와 hash commitment를 결합한 STARK 계열의 이론 구조를 제시합니다.</p>
              <p><strong>전제:</strong> 논문의 field·hash·random-oracle·soundness model을 사용합니다.</p>
              <p><strong>근거 범위:</strong> Trace 제약을 낮은 차수 주장과 opening으로 바꾸는 배경입니다.</p>
              <p><strong>말하지 않는 것:</strong> 현재 Plonky3 API·type alias·구체 benchmark를 규정하지 않습니다.</p>
            </CitationBlock>
          </div>

          <div id="paper-plonky3-source">
            <CitationBlock source="Plonky3 · commit 0d803737" citeKey={2} type="code" href={SOURCE}>
              <p><strong>문제:</strong> 여러 field·commitment·PCS·transcript로 PIOP와 STARK를 조립할 수 있는 toolkit을 제공합니다.</p>
              <p><strong>고정한 버전:</strong> 2026-10-26 commit <code>0d803737</code>이며 2026-11-01 공식 main HEAD로 확인했습니다.</p>
              <p><strong>직접 확인:</strong> Fibonacci AIR·config·prove·verify·negative tests와 실제 Proof 구조를 읽고 세 focused test를 실행했습니다.</p>
              <p><strong>구조 문서:</strong> <a href={ARCHITECTURE}>공식 architecture guide</a>는 Plonky3를 하나의 고정 proof system이 아니라 작은 crate 모음으로 설명합니다.</p>
              <p><strong>말하지 않는 것:</strong> 이 test profile의 운영 보안, 모든 malformed proof의 panic-free 처리, 외부 감사 완료를 주장하지 않습니다.</p>
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
        fileTrees={{ plonky3: plonky3Tree }}
        projectMetas={{
          plonky3: {
            id: "plonky3",
            label: "Plonky3 · Rust · uni-stark",
            badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700",
          },
        }}
      />
    </>
  );
}
