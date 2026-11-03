import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import CircomConstraintViz from "./CircomConstraintViz";
import { codeRefs } from "./codeRefs";
import { circomTree } from "./fileTree";

const CIRCOM_PAPER = "https://eprint.iacr.org/2020/1003.pdf";
const CIRCOM_SOURCE =
  "https://github.com/iden3/circom/tree/ad44e915a12bb047b05745c2884aad9cc8326bc6";
const CIRCOM_CONSTRAINT_DOCS =
  "https://docs.circom.io/circom-language/constraint-generation/";
const CIRCOM_COMPILE_DOCS =
  "https://docs.circom.io/getting-started/compilation-options/";

const SafeCircuit = () => (
  <pre className="not-prose min-w-0 overflow-x-auto rounded-lg border border-border bg-muted/20 p-4 text-xs leading-6">
    <code>{`pragma circom 2.2.3;

template Multiply() {
  signal input a;
  signal input b;
  signal output out;

  out <== a * b;
}

component main = Multiply();`}</code>
  </pre>
);

const UnsafeCircuit = () => (
  <pre className="not-prose min-w-0 overflow-x-auto rounded-lg border border-amber-500/40 bg-amber-500/[0.05] p-4 text-xs leading-6">
    <code>{`template UnsafeMultiply() {
  signal input a;
  signal input b;
  signal output out;

  out <-- a * b; // 계산만 하고 제약은 만들지 않음
}`}</code>
  </pre>
);

export default function ModernCircomArticle() {
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
              Circom은 값을 계산하는 프로그램과 그 값이 맞음을 강제하는 규칙을 함께 만듭니다
            </h2>
          </header>

          <p className="text-lg leading-8 text-foreground/90">
            공개할 값은 <code>out=12</code>, 숨길 값은 <code>a=3</code>과
            <code>b=4</code>라고 하겠습니다. Prover는 a와 b를 보여 주지 않은 채
            <code>a·b=out</code>을 만족한다는 사실만 증명하고 싶습니다.
          </p>
          <p>
            여기서 가장 중요한 구분은 “정직한 프로그램이 12를 계산했다”와 “어떤
            prover도 11을 정답이라고 속일 수 없다”가 같은 말이 아니라는 점입니다.
            Circom은 전자를 위한 witness generator와 후자를 위한 R1CS 제약을 한
            source에서 생성합니다.
          </p>

          <CircomConstraintViz />
          <ContentBoundary article="circom" />

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              [
                "계산",
                "WASM·C++ witness generator",
                "입력을 받아 out과 중간 signal 값을 채웁니다. 정직한 실행 경로를 재현합니다.",
              ],
              [
                "검사",
                "R1CS constraint system",
                "제출된 witness가 a·b=out을 만족하는지 proof system이 검사할 규칙입니다.",
              ],
              [
                "결속",
                "artifact manifest",
                "Source·compiler·R1CS·public schema·key가 같은 회로인지 고정합니다.",
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
              01 · 이름보다 동작을 먼저 보기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              같은 source에서 계산기와 검사표가 따로 나옵니다
            </h2>
          </header>

          <p>
            사용자가 <code>a=3</code>, <code>b=4</code>를 넣으면 계산기는
            <code>out=12</code>와 필요한 중간값을 witness에 채웁니다. 그다음 증명
            도구는 이 witness와 R1CS를 사용해 proof를 만듭니다. Verifier는 a와 b를
            직접 보지 않고 proof와 공개값 12만 받습니다.
          </p>

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
            <article className="bg-background p-5">
              <p className="text-xs font-bold text-primary">정직한 실행 경로</p>
              <p className="mt-3 font-mono text-sm font-black">3 · 4 → 12</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Witness generator가 계산합니다. 이 결과만 보면 정상 데모는 성공합니다.
              </p>
            </article>
            <article className="bg-background p-5">
              <p className="text-xs font-bold text-primary">악의적 입력을 막는 규칙</p>
              <p className="mt-3 font-mono text-sm font-black">a · b = out</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                R1CS에 이 행이 있어야 3·4=11인 witness를 거절할 수 있습니다.
              </p>
            </article>
          </div>

          <p>
            이제 이 둘의 이름을 붙일 수 있습니다. Circom은 회로를 기술하는 DSL이자
            compiler입니다. 계산기가 채운 값 묶음은 <strong>witness</strong>입니다.
            반드시 성립해야 하는 식은 <strong>constraint</strong>입니다. Circom 자체가
            최종 proof를 만드는 것은 아닙니다.
          </p>
        </section>

        <section id="case" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              02 · 3×4=12를 source로 쓰기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Double arrow 한 줄이 계산과 제약을 함께 남깁니다
            </h2>
          </header>

          <p>
            아래 회로에서 <code>a</code>와 <code>b</code>는 main component의 private
            input이고, <code>out</code>은 main output이므로 공개 signal입니다.
            <code>out &lt;== a*b</code>는 out을 계산하는 assignment와
            <code>out === a*b</code>라는 constraint를 함께 생성합니다.
          </p>

          <SafeCircuit />

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              ["template", "재사용할 회로 모양", "아직 실제 제약 묶음이 아니라 설계도입니다."],
              ["signal", "회로가 다루는 field 값", "input·output·intermediate 값이 witness 칸에 대응합니다."],
              ["component", "template의 실제 인스턴스", "main에서 인스턴스화되어 최종 회로에 들어갑니다."],
            ].map(([name, meaning, detail]) => (
              <article key={name} className="bg-background p-4">
                <code className="text-xs font-black text-primary">{name}</code>
                <p className="mt-2 text-sm font-semibold">{meaning}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
              </article>
            ))}
          </div>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton
              label="컴파일러의 assignment 종류"
              onClick={() => sidebar.open("assign-op", codeRefs["assign-op"])}
            />
          </div>
        </section>

        <section id="lowering" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              03 · 실행 결과를 R1CS 한 행으로 낮추기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Witness의 같은 칸을 골라 곱하고 공개 out과 비교합니다
            </h2>
          </header>

          <p>
            설명을 위해 witness 순서를 <code>z=(1,a,b,out)</code>으로 놓겠습니다.
            실제 serialized 순서는 compiler가 만든 symbol·R1CS artifact에서 확인해야
            합니다. 이 예에서 한 행은 a를 고르는 선형식, b를 고르는 선형식, out을
            고르는 선형식으로 구성됩니다.
          </p>

          <ExplainedFormula
            question="Verifier는 숨긴 3과 4를 공개하지 않고 무엇을 검사하나요?"
            idea="Witness의 값을 직접 공개하는 대신, 세 선형식이 고른 값들이 곱셈 관계를 만족한다는 proof를 검사합니다."
            formula={String.raw`\langle A,z\rangle\,\langle B,z\rangle=\langle C,z\rangle`}
            annotatedFormula={String.raw`\underbrace{\langle A,z\rangle}_{a=3}\,\underbrace{\langle B,z\rangle}_{b=4}=\underbrace{\langle C,z\rangle}_{out=12}`}
            operations={[
              {
                expression: String.raw`z=(1,3,4,12)`,
                annotation: [
                  "1은 상수항을 위한 자리",
                  "3과 4는 private witness",
                  "12는 public output",
                ],
              },
              {
                expression: String.raw`\langle A,z\rangle=3,\ \langle B,z\rangle=4`,
                annotation: [
                  "A와 B가 a·b 자리를 선택",
                  "곱은 12",
                  "값의 이름이 아니라 위치와 계수로 선택",
                ],
              },
              {
                expression: String.raw`3\cdot4=12`,
                annotation: [
                  "정상 witness는 통과",
                  "out=11이면 12≠11이라 실패",
                  "이 행이 빠지면 같은 거절을 보장하지 못함",
                ],
              },
            ]}
            terms={[
              {
                symbol: "z",
                name: "Witness vector",
                description: "상수 1, private·public·intermediate signal 값을 정해진 순서로 둔 묶음입니다.",
              },
              {
                symbol: "A,B,C",
                name: "R1CS row",
                description: "같은 z에서 필요한 값을 고르는 sparse linear combination 세 개입니다.",
              },
              {
                symbol: "out",
                name: "Public output",
                description: "Verifier API가 proof와 함께 받는 공개 statement의 일부입니다.",
              },
            ]}
            assumptions={[
              "Compiler version, field modulus와 optimization profile을 고정합니다.",
              "설명용 z 순서와 실제 R1CS witness order를 혼동하지 않고 .sym·R1CS를 확인합니다.",
              "a·b=out만이 애플리케이션이 의도한 전체 관계라는 예제 가정입니다.",
            ]}
            interpretation="R1CS 한 행이 성립한다는 사실은 그 행만 보장합니다. 범위, 해시, membership 같은 규칙이 필요하다면 각각 별도 제약으로 남아야 합니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton
              label="double arrow가 constraint를 추가하는 곳"
              onClick={() =>
                sidebar.open("assignment-branch", codeRefs["assignment-branch"])
              }
            />
            <CodeViewButton
              label="===가 constraint를 추가하는 곳"
              onClick={() =>
                sidebar.open("constraint-equality", codeRefs["constraint-equality"])
              }
            />
          </div>
        </section>

        <section id="counterexample" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              04 · 정상 데모가 통과해도 안전하지 않은 경우
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Single arrow는 값을 채우지만 그 계산을 R1CS에 남기지 않습니다
            </h2>
          </header>

          <p>
            아래처럼 <code>&lt;--</code>를 쓰면 생성된 witness calculator는 여전히
            3과 4로 12를 계산합니다. 그래서 정상 입력만 넣어 본 개발자는 회로가
            맞다고 오해하기 쉽습니다. 그러나 proof가 보장하는 것은 calculator가
            아니라 R1CS이므로 곱셈 constraint가 빠진 사실이 핵심입니다.
          </p>

          <UnsafeCircuit />

          <div className="not-prose border-l-2 border-primary bg-primary/[0.035] p-4 text-sm leading-6">
            <p className="font-semibold">고정한 compiler로 직접 확인한 결과</p>
            <p className="mt-2 text-muted-foreground">
              Circom v2.2.3, commit <code>ad44e91</code>, <code>--O0 --inspect</code>로
              두 회로를 컴파일했습니다. 둘의 witness는 모두
              <code>[1,12,3,4]</code>였지만, 안전한 회로는 non-linear constraint가
              1개였고 single-arrow 변형은 0개였습니다. 변형에는
              <code>&lt;==</code>를 고려하라는 경고와 세 signal이 어느 constraint에도
              없다는 경고가 나왔습니다.
            </p>
          </div>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="w-1/4 p-3">표현</th>
                  <th className="p-3">Witness 계산</th>
                  <th className="p-3">R1CS 제약</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-3 font-mono">out &lt;-- a*b</td>
                  <td className="p-3">있음</td>
                  <td className="p-3 font-semibold text-amber-700 dark:text-amber-300">없음</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 font-mono">out === a*b</td>
                  <td className="p-3">out 대입 없음</td>
                  <td className="p-3">있음</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 font-mono">out &lt;== a*b</td>
                  <td className="p-3">있음</td>
                  <td className="p-3 font-semibold text-primary">있음</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            공식 compiler의 <code>--inspect</code>는 quadratic expression에 single
            arrow를 사용한 경우 경고할 수 있습니다. 하지만 경고가 모든
            underconstraint를 찾아 주는 것은 아닙니다. 의도한 관계와 생성된 제약을
            비교하고, 잘못된 witness가 실제로 실패하는 negative test를 남겨야 합니다.
          </p>
        </section>

        <section id="artifacts" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              05 · Source보다 넓은 출시 단위
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              R1CS·witness generator·public schema·key를 같은 회로로 묶습니다
            </h2>
          </header>

          <p>
            같은 <code>.circom</code> 파일도 compiler version, field, optimization에
            따라 artifact가 달라질 수 있습니다. Source hash 하나만 보관하면 verifier가
            실제로 어떤 R1CS와 public signal 순서를 검사했는지 재현할 수 없습니다.
          </p>

          <div className="not-prose overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3">Artifact</th>
                  <th className="p-3">하는 일</th>
                  <th className="p-3">엇갈리면 생기는 문제</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [".r1cs", "Verifier가 강제할 constraint system", "새 source에 오래된 key 사용"],
                  [".wasm / C++", "정직한 witness 계산", "R1CS와 다른 signal 계산·layout"],
                  [".sym", "signal 이름과 witness 위치를 해석", "debug·public mapping 오판"],
                  ["public schema", "이름·순서·encoding을 API에 결속", "같은 숫자를 다른 필드로 해석"],
                  ["zkey / vkey", "특정 proof system과 circuit의 키", "다른 R1CS의 proof·verify 조합"],
                ].map(([artifact, role, failure]) => (
                  <tr key={artifact} className="border-t border-border">
                    <td className="p-3 font-mono text-xs font-semibold">{artifact}</td>
                    <td className="p-3">{role}</td>
                    <td className="p-3 text-muted-foreground">{failure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Manifest에는 compiler commit, source hash, compile flags, field, R1CS와
            witness generator hash, public signal 이름·순서·encoding, proof backend와
            key hash를 함께 기록합니다. Private witness 값 자체를 manifest에 넣는다는
            뜻은 아닙니다.
          </p>
        </section>

        <section id="proof-flow" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              06 · Compile부터 verify까지 한 요청 추적
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Circom의 출력이 proof system의 입력이 됩니다
            </h2>
          </header>

          <p>
            Circom은 circuit compiler입니다. snarkjs 같은 별도 도구가 R1CS와 witness를
            받아 Groth16 등의 proof를 만들고 검증합니다. Groth16을 선택했다면 회로별
            setup·key 관리와 그에 따른 신뢰 가정도 함께 따라옵니다.
          </p>

          <AlgorithmBlock
            title="3×4=12 회로를 출시하고 요청 하나를 검증하는 과정"
            input={[
              "source = Multiply.circom",
              "private = {a:3, b:4}",
              "public = {out:12}",
              "profile = compiler + field + optimization + proof backend",
            ]}
            steps={[
              {
                code: "compile(source, profile) → r1cs, witnessGenerator, sym",
                note: "계산 artifact와 constraint artifact를 같은 compiler profile로 만듭니다.",
              },
              {
                code: "inspect(r1cs, sym) and bind(publicSchema=[out])",
                note: "제약 수만 세지 말고 의도한 a·b=out 행과 public 의미를 확인합니다.",
              },
              {
                code: "keygen(r1cs, setupProfile) → provingKey, verifyingKey",
                note: "키가 어떤 R1CS와 proof backend에 묶였는지 hash로 기록합니다.",
              },
              {
                code: "witnessGenerator({a:3,b:4}) → witness(out=12)",
                note: "정직한 계산 경로가 witness를 채웁니다.",
              },
              {
                code: "prove(r1cs, provingKey, witness) → proof, publicSignals",
                note: "Proof는 calculator 실행 자체가 아니라 R1CS 만족을 증명합니다.",
              },
              {
                code: "verify(verifyingKey, publicSignals=[12], proof) → true",
                note: "Verifier는 private a·b를 받지 않고 공개값과 proof를 검사합니다.",
              },
              {
                code: "negativeVerify(out=11 | staleKey | changedR1CS) → false",
                note: "잘못된 관계와 artifact drift가 fail closed하는지 별도 fixture로 확인합니다.",
              },
            ]}
            output="releaseReceipt = hashes + publicSchema + positive/negative results + stage metrics"
          />
        </section>

        <section id="release" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              07 · 성능보다 먼저 닫을 실패 경로
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              정상 proof 하나가 아니라 틀린 관계가 모두 거절되는지 확인합니다
            </h2>
          </header>

          <p>
            최소 fixture는 valid 3·4=12, invalid out=11, single-arrow mutation,
            public schema mismatch, tampered R1CS, stale key를 서로 독립적으로 둡니다.
            그다음에만 compile, witness, setup, prove, verify 시간을 분리해 측정합니다.
          </p>

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["valid", "3·4=12", "통과해야 함"],
              ["wrong public", "3·4=11", "거절해야 함"],
              ["missing constraint", "<==를 <--로 변경", "mutation test가 잡아야 함"],
              ["schema drift", "public 이름·순서 변경", "호환되지 않으면 거절"],
              ["artifact drift", "새 R1CS + 오래된 key", "key 결속 실패"],
              ["field boundary", "negative·large value encoding", "정책과 field 의미 확인"],
            ].map(([name, fixture, result]) => (
              <article key={name} className="bg-background p-4">
                <p className="text-[9px] font-bold text-primary">{name}</p>
                <p className="mt-2 font-mono text-xs font-semibold">{fixture}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{result}</p>
              </article>
            ))}
          </div>

          <p>
            Circom 2.2.3의 <code>--sanity_check</code>는 witness generation code에 넣는
            runtime check의 양을 조절합니다. 이것은 R1CS가 의도한 관계를 완전하게
            표현했다는 보증과 다릅니다. Runtime assert가 통과했다는 사실과 proof가
            강제하는 constraint를 다시 구분해야 합니다.
          </p>

          <div id="paper-circom">
            <CitationBlock
              source="Circom: A Circuit Description Language for Building Zero-Knowledge Applications"
              citeKey={1}
              href={CIRCOM_PAPER}
            >
              <p><strong>문제:</strong> 산술 회로와 witness 계산을 재사용 가능한 언어로 작성합니다.</p>
              <p><strong>기여:</strong> Template·signal·constraint를 compiler pipeline과 proof tooling에 연결합니다.</p>
              <p><strong>전제:</strong> 논문의 Circom·R1CS·SNARK model을 사용합니다.</p>
              <p><strong>근거 범위:</strong> 언어와 compiler design의 책임 경계입니다.</p>
              <p><strong>말하지 않는 것:</strong> 작성한 모든 circuit이 자동으로 underconstraint-free라는 보장은 아닙니다.</p>
            </CitationBlock>
          </div>

          <div id="paper-circom-source">
            <CitationBlock
              source="iden3/circom v2.2.3 · commit ad44e91"
              citeKey={2}
              href={CIRCOM_SOURCE}
            >
              <p><strong>문제:</strong> Assignment와 constraint가 compiler에서 실제로 갈라지는 지점을 확인합니다.</p>
              <p><strong>기여:</strong> AssignOp, double-arrow branch와 constraint equality의 고정 원문을 제공합니다.</p>
              <p><strong>고정한 버전:</strong> Release v2.2.3, commit <code>ad44e91</code>입니다.</p>
              <p><strong>근거 범위:</strong> 선택 snapshot의 Rust compiler 동작입니다.</p>
              <p><strong>말하지 않는 것:</strong> snarkjs·배포 circuit·moving main의 전체 안전성을 대신하지 않습니다.</p>
            </CitationBlock>
          </div>

          <div className="not-prose grid gap-3 sm:grid-cols-2">
            <a className="rounded-lg border border-border p-4 text-sm font-semibold hover:border-primary" href={CIRCOM_CONSTRAINT_DOCS} target="_blank" rel="noreferrer">
              공식 문서 · Constraint generation
            </a>
            <a className="rounded-lg border border-border p-4 text-sm font-semibold hover:border-primary" href={CIRCOM_COMPILE_DOCS} target="_blank" rel="noreferrer">
              공식 문서 · Compilation options와 artifact
            </a>
          </div>
        </section>
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ circom: circomTree }}
        projectMetas={{
          circom: {
            id: "circom",
            label: "iden3/circom v2.2.3 · Rust",
            badgeClass: "bg-sky-500/10 border-sky-500 text-sky-700",
          },
        }}
      />
    </>
  );
}
