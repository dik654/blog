import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import Halo2RowViz from "./Halo2RowViz";
import { codeRefs } from "./codeRefs";
import { halo2Tree } from "./fileTree";

const HALO_PAPER = "https://eprint.iacr.org/2019/1021.pdf";
const HALO2_SOURCE =
  "https://github.com/zcash/halo2/tree/3442dd33754ae0d44b8970e5a4eea79b0c3360bf";
const HALO2_BOOK = "https://zcash.github.io/halo2/user/simple-example.html";

export default function ModernHalo2Article() {
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
              Halo2는 비공개 계산을 표의 cell과 반드시 지켜야 할 식으로 바꿉니다
            </h2>
          </header>

          <p className="text-lg leading-8 text-foreground/90">
            공개할 값은 <code>out=12</code>, 숨길 값은 <code>a=3</code>과
            <code>b=4</code>라고 하겠습니다. Prover는 3과 4를 보여 주지 않은 채
            <code>a·b=out</code>을 만족한다는 proof를 만들고 싶습니다.
          </p>
          <p>
            Halo2에서는 값을 cell에 써 넣는 일과 그 값 사이의 관계를 강제하는 일이
            분리됩니다. 3, 4, 12를 표에 올바르게 배치해도 selector·gate·copy
            constraint·public binding 중 하나가 빠지면 의도한 주장이 증명되지 않습니다.
          </p>

          <Halo2RowViz />
          <ContentBoundary article="halo2" />

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              [
                "배치",
                "Columns·rows·regions",
                "Private advice, public instance와 fixed selector를 어느 cell에 둘지 정합니다.",
              ],
              [
                "강제",
                "Gate·copy·lookup",
                "Row 식, cell equality와 table membership이 실제 relation을 만듭니다.",
              ],
              [
                "증명",
                "Keygen·prove·verify",
                "Circuit shape와 public instance를 commitment·transcript·opening에 결속합니다.",
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
              01 · 이름보다 표의 동작을 먼저 보기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Prover는 비공개 표를 채우고 verifier는 표 전체의 규칙을 확인합니다
            </h2>
          </header>

          <p>
            하나의 큰 표를 떠올리면 됩니다. 열은 값의 역할을 나누고 행은 계산 단계를
            나눕니다. Prover가 채우는 비공개 열, verifier에게 공개되는 열, 회로가 미리
            고정하는 열이 있습니다. Proof는 표를 그대로 공개하지 않고, 등록된 모든
            식이 성립한다는 사실을 확인하게 합니다.
          </p>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-center text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3">row</th>
                  <th className="p-3">advice A</th>
                  <th className="p-3">advice B</th>
                  <th className="p-3">fixed selector</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-3 font-mono">0</td>
                  <td className="p-3 font-mono font-semibold">a=3</td>
                  <td className="p-3 font-mono font-semibold">b=4</td>
                  <td className="p-3 font-mono text-primary">s=1</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 font-mono">1</td>
                  <td className="p-3 font-mono font-semibold">out=12</td>
                  <td className="p-3 text-muted-foreground">—</td>
                  <td className="p-3 font-mono text-muted-foreground">s=0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            이제 이름을 붙일 수 있습니다. Prover가 채우는 비공개 열은
            <strong>advice column</strong>입니다. 공개 입력 열은
            <strong>instance column</strong>입니다. Selector처럼 회로가 고정한 값은
            <strong>fixed column</strong>에 들어갑니다. 여러 cell을 함께 배치하는 논리적
            구역이 <strong>region</strong>입니다.
          </p>
        </section>

        <section id="case" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              02 · 3×4=12를 한 gate로 만들기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              현재 행의 두 값과 다음 행의 결과를 rotation으로 읽습니다
            </h2>
          </header>

          <p>
            공식 simple example은 두 advice column만 사용합니다. 그래서 현재 행의
            첫째·둘째 cell을 lhs·rhs로 읽고, 다음 행의 첫째 cell을 out으로 읽습니다.
            <code>Rotation::cur()</code>과 <code>Rotation::next()</code>가 이 상대 위치를
            표현합니다.
          </p>

          <ExplainedFormula
            question="Row 0에서 multiplication gate가 정확히 무엇을 검사하나요?"
            idea="Selector가 켜진 행에서 현재 lhs·rhs와 다음 행 out을 읽어 곱셈 차이가 0인지 검사합니다."
            formula={String.raw`s_{mul}(r)\bigl(A(r)B(r)-A(r+1)\bigr)=0`}
            annotatedFormula={String.raw`\underbrace{s_{mul}(r)}_{\text{row }r\text{에서 gate를 켬}}\Bigl(\underbrace{A(r)}_{a=3}\underbrace{B(r)}_{b=4}-\underbrace{A(r+1)}_{out=12}\Bigr)=0`}
            operations={[
              {
                expression: String.raw`A(r)=3,\ B(r)=4,\ A(r+1)=12`,
                annotation: [
                  "현재 row의 advice 두 칸",
                  "다음 row의 첫 advice 칸",
                  "rotation이 상대 위치를 지정",
                ],
              },
              {
                expression: String.raw`s_{mul}(r)=1`,
                annotation: [
                  "synthesize에서 selector enable",
                  "해당 row에만 gate 적용",
                  "다른 row는 재사용 가능",
                ],
              },
              {
                expression: String.raw`1\cdot(3\cdot4-12)=0`,
                annotation: [
                  "3·4−12=0",
                  "정상 witness는 통과",
                  "out=11이면 1≠0이라 실패",
                ],
              },
            ]}
            terms={[
              {
                symbol: "r",
                name: "Current row",
                description: "Selector가 켜지고 lhs·rhs를 읽는 기준 행입니다.",
              },
              {
                symbol: "A,B",
                name: "Advice columns",
                description: "Prover가 private witness와 중간 결과를 배치하는 열입니다.",
              },
              {
                symbol: "s_{mul}",
                name: "Selector",
                description: "Multiplication identity를 어느 행에 적용할지 정하는 fixed 값입니다.",
              },
            ]}
            assumptions={[
              "Selector가 multiplication region의 offset 0에서 실제로 enable됩니다.",
              "현재·다음 row query가 usable row와 floor-planner layout에서 같은 region을 가리킵니다.",
              "Output cell은 instance column의 의도한 위치와 별도 제약으로 연결됩니다.",
            ]}
            interpretation="3, 4, 12를 cell에 써 넣었다는 사실만으로는 부족합니다. 이 expression이 create_gate에 등록되고 selector가 실제 row에서 켜져야 3·4=12가 강제됩니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton
              label="공식 simple example의 gate"
              onClick={() => sidebar.open("simple-gate", codeRefs["simple-gate"])}
            />
          </div>
        </section>

        <section id="columns-regions" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              03 · Gate 밖의 같은 값을 연결하기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Copy constraint와 instance constraint가 cell의 의미를 이어 줍니다
            </h2>
          </header>

          <p>
            입력 a와 b가 다른 region에서 이미 만들어졌다면 multiplication region에
            같은 숫자를 다시 써 넣는 것만으로는 충분하지 않습니다. Malicious prover는
            두 곳에 서로 다른 값을 넣을 수 있습니다. Equality-enabled column과
            <code>copy_advice</code>가 두 cell의 equality relation을 만듭니다.
          </p>

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              [
                "Gate",
                "행 안팎의 polynomial identity",
                "예: s·(lhs·rhs−out)=0",
              ],
              [
                "Copy",
                "서로 다른 cell의 equality",
                "예: load region의 a = mul region의 lhs",
              ],
              [
                "Lookup",
                "값 tuple의 table membership",
                "예: 8-bit range table에 x가 포함됨",
              ],
            ].map(([name, role, example]) => (
              <article key={name} className="bg-background p-4">
                <p className="text-xs font-black text-primary">{name}</p>
                <p className="mt-2 text-sm font-semibold">{role}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{example}</p>
              </article>
            ))}
          </div>

          <p>
            마지막 output cell도 공개 instance의 row 0과 자동으로 같아지지 않습니다.
            공식 예제는 <code>constrain_instance</code>로 둘을 연결합니다. 공개값 배열의
            순서나 열 수가 달라지면 다른 statement이므로 API schema에 포함해야 합니다.
          </p>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton
              label="selector·copy·public binding"
              onClick={() =>
                sidebar.open("simple-mul-expose", codeRefs["simple-mul-expose"])
              }
            />
          </div>
        </section>

        <section id="failure-boundaries" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              04 · 같은 숫자여도 빠진 제약은 숨겨지지 않습니다
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Selector·copy·instance 중 빠진 경계마다 다른 위조가 생깁니다
            </h2>
          </header>

          <div className="not-prose overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3">빠진 것</th>
                  <th className="p-3">정상 데모에서 보이는 모습</th>
                  <th className="p-3">악의적 witness가 바꿀 수 있는 것</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["selector enable", "코드가 3·4와 12를 계산", "gate가 꺼져 out=11도 이 식은 통과"],
                  ["copy constraint", "두 region에 모두 4를 대입", "한 region은 4, 다른 region은 5"],
                  ["instance constraint", "화면에 public 12를 표시", "proof의 output cell을 다른 값으로 둠"],
                  ["lookup registration", "정상 8-bit 값만 테스트", "table 밖 값도 membership 검사 없이 사용"],
                ].map(([missing, demo, attack]) => (
                  <tr key={missing} className="border-t border-border">
                    <td className="p-3 font-semibold">{missing}</td>
                    <td className="p-3 text-muted-foreground">{demo}</td>
                    <td className="p-3">{attack}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            따라서 “정상값으로 MockProver가 통과했다”는 테스트만으로는 부족합니다.
            Out=11, selector-off mutation, missing-copy mutation, wrong instance row와 range
            overflow를 각각 독립된 fixture로 두어야 합니다.
          </p>
        </section>

        <section id="proof-pipeline" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              05 · Configure부터 verify까지 한 요청 추적
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              MockProver의 의미 검사와 실제 cryptographic proof를 구분합니다
            </h2>
          </header>

          <p>
            <code>configure</code>는 회로의 열과 각 열을 읽는 규칙을 정합니다. Gate와
            lookup, equality relation도 이때 등록됩니다.
          </p>
          <p>
            <code>synthesize</code>는 그 설계에 맞춰 region의 cell을 채우고 필요한
            selector를 켭니다. MockProver는 이 의미를 빠르게 디버그하지만, 배포 proof와
            verifier를 대체하지 않습니다.
          </p>

          <AlgorithmBlock
            title="3×4=12 circuit을 key와 proof로 검증하는 과정"
            input={[
              "private = {a:3, b:4}",
              "publicInstances = [[12]]",
              "profile = sourceCommit + curve/PCS + k + transcript",
            ]}
            steps={[
              {
                code: "configure() → advice, instance, selector, gate",
                note: "Circuit shape와 어떤 relative cell을 읽는지가 정해집니다.",
              },
              {
                code: "synthesize(a=3,b=4) → row0[3,4,s=1], row1[12]",
                note: "Prover의 witness와 selector·copy·public binding을 배치합니다.",
              },
              {
                code: "MockProver::run(k,circuit,[[12]]).verify() → Ok",
                note: "먼저 semantic relation과 layout 오류를 빠르게 찾습니다.",
              },
              {
                code: "keygen_vk(params,circuit); keygen_pk(params,vk,circuit)",
                note: "Circuit shape·fixed data·permutation을 key에 고정합니다.",
              },
              {
                code: "create_proof(params,pk,[circuit],[[12]],rng,transcript)",
                note: "Advice commitments, challenges, quotient와 IPA opening을 transcript 순서로 만듭니다.",
              },
              {
                code: "verify_proof(params,vk,strategy,[[12]],transcript) → Ok",
                note: "같은 public instance와 profile로 transcript를 재생하고 opening relation을 확인합니다.",
              },
              {
                code: "verify([[11]]) | verify(wrongVk) | verify(malformedProof) → Err",
                note: "잘못된 statement와 artifact drift가 fail closed하는지 별도로 확인합니다.",
              },
            ]}
            output="releaseReceipt = circuit/profile hashes + semantic matrix + proof matrix + stage metrics"
          />

          <aside className="not-prose rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
              고정 소스로 직접 실행한 결과
            </p>
            <p className="mt-2 text-sm leading-6">
              <code>3442dd3</code>과 그 <code>Cargo.lock</code>에서 공식
              <code>simple-example</code>을 release mode로 실행했습니다. 이 예제는
              <code>constant=7, a=2, b=3</code>으로 공개값 <code>252</code>를 만들며,
              정확한 값은 통과하고 <code>253</code>은 실패한다고 assert합니다. 두
              조건이 모두 맞아 실행이 종료 코드 0으로 끝났습니다.
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              이 결과는 공식 예제의 positive·negative MockProver 경로를 확인한 것입니다.
              위의 <code>3×4=12</code>는 같은 gate 구조를 설명하기 위한 작은 사례이며,
              production proof 생성·성능·보안 감사를 대신하지 않습니다.
            </p>
          </aside>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton
              label="공식 MockProver positive·negative test"
              onClick={() => sidebar.open("simple-mock", codeRefs["simple-mock"])}
            />
            <CodeViewButton
              label="create_proof() 입구"
              onClick={() => sidebar.open("create-proof", codeRefs["create-proof"])}
            />
            <CodeViewButton
              label="verify_proof() 입구"
              onClick={() => sidebar.open("verify-proof", codeRefs["verify-proof"])}
            />
          </div>
        </section>

        <section id="profile" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              06 · “Halo2”라는 이름보다 정확한 proof profile
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Zcash IPA 구현과 KZG 기반 fork는 서로 다른 시스템입니다
            </h2>
          </header>

          <p>
            Halo2는 하나의 고정 wire format 이름이 아닙니다. 이 글에서 source로 삼은
            Zcash repository는 inner-product argument 기반 polynomial commitment를
            사용합니다. KZG를 채택한 downstream 구현은 setup, curve, opening,
            transcript와 serialization이 달라질 수 있습니다.
          </p>

          <ExplainedFormula
            question="한 배포가 사용하는 Halo2 proof를 무엇으로 식별해야 하나요?"
            idea="Repository 이름이 아니라 실제 검증에 영향을 주는 source·commitment·parameter·transcript·circuit을 한 profile로 묶습니다."
            formula={String.raw`P=H(commit\parallel curve/PCS\parallel k\parallel transcript\parallel circuit\parallel publicSchema)`}
            annotatedFormula={String.raw`P=H(\underbrace{commit}_{source}\parallel\underbrace{curve/PCS}_{IPA\text{ 또는 다른 profile}}\parallel\underbrace{k}_{2^k\text{ rows}}\parallel\underbrace{transcript}_{challenge\ order}\parallel\underbrace{circuit\parallel publicSchema}_{statement\ identity})`}
            operations={[
              {
                expression: String.raw`commit\parallel curve/PCS`,
                annotation: [
                  "검증한 source snapshot",
                  "Zcash IPA와 KZG fork를 분리",
                  "이름이 같아도 호환 추정 금지",
                ],
              },
              {
                expression: String.raw`k\parallel transcript`,
                annotation: [
                  "2^k row domain과 public params",
                  "commitment·challenge를 읽는 순서",
                  "proof bytes 해석에 필요",
                ],
              },
              {
                expression: String.raw`circuit\parallel publicSchema`,
                annotation: [
                  "gate·copy·lookup·fixed shape",
                  "instance columns·rows·encoding",
                  "VK·proof가 가리키는 statement",
                ],
              },
            ]}
            terms={[
              {
                symbol: "PCS",
                name: "Polynomial commitment scheme",
                description: "Zcash source에서는 IPA opening을 사용합니다.",
              },
              {
                symbol: "k",
                name: "Domain size exponent",
                description: "Circuit table의 row 수를 2^k로 잡는 parameter입니다.",
              },
              {
                symbol: "P",
                name: "Deployment profile digest",
                description: "운영 호환성을 식별하는 manifest 값이며 proof 자체가 아닙니다.",
              },
            ]}
            assumptions={[
              "Canonical serialization과 domain separation을 profile version에 고정합니다.",
              "Params·VK·PK·proof가 같은 source와 circuit profile에서 생성됩니다.",
              "Digest는 source review·negative tests·parameter validation을 대체하지 않습니다.",
            ]}
            interpretation="두 시스템이 모두 Halo2-style columns와 gates를 사용해도 PCS·curve·transcript가 다르면 key와 proof를 서로 교환할 수 없습니다."
          />
        </section>

        <section id="release" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              07 · Underconstraint를 먼저 닫고 비용을 나중에 재기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Positive 하나보다 실패해야 할 fixture의 독립성이 중요합니다
            </h2>
          </header>

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["valid", "a=3,b=4,out=12", "MockProver와 real verifier 통과"],
              ["wrong instance", "out=11", "instance binding으로 실패"],
              ["selector off", "s=0, out=11", "mutation test가 빠진 gate를 탐지"],
              ["missing copy", "old a=3, copied a=5", "equality relation 누락 탐지"],
              ["profile drift", "wrong params·VK", "proof 검증 실패"],
              ["malformed proof", "truncated·changed bytes", "parser·transcript fail closed"],
            ].map(([name, fixture, expected]) => (
              <article key={name} className="bg-background p-4">
                <p className="text-[9px] font-bold text-primary">{name}</p>
                <p className="mt-2 font-mono text-xs font-semibold">{fixture}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{expected}</p>
              </article>
            ))}
          </div>

          <p>
            이 행렬이 통과한 뒤에만 각 단계의 시간을 나눠 측정합니다. Configure와
            synthesize, keygen, prove, verify가 서로 다른 비용을 숨기지 않게 합니다.
          </p>
          <p>
            측정표에는 k와 usable rows, column·query 수를 먼저 적습니다. Proof·key
            bytes, peak RSS와 thread count도 같은 실행에 기록합니다. Source나 circuit
            fingerprint가 바뀌면 old/new VK·proof cross-matrix를 다시 실행합니다.
          </p>

          <div id="paper-halo">
            <CitationBlock source="Bowe·Grigg·Hopwood · Halo" citeKey={1} href={HALO_PAPER}>
              <p><strong>문제:</strong> Trusted setup 없이 proof composition과 polynomial verification을 누적합니다.</p>
              <p><strong>기여:</strong> IPA commitment와 accumulation을 이용한 Halo construction을 제시합니다.</p>
              <p><strong>전제:</strong> Curve cycle, discrete-log hardness, random oracle와 논문의 model입니다.</p>
              <p><strong>근거 범위:</strong> Halo protocol과 논문 experiment 범위입니다.</p>
              <p><strong>말하지 않는 것:</strong> 현재 Halo2 API의 모든 gate·lookup·serialization을 직접 규정하지 않습니다.</p>
            </CitationBlock>
          </div>

          <div id="paper-zcash-halo2-source">
            <CitationBlock
              source="zcash/halo2 · commit 3442dd3"
              citeKey={2}
              type="code"
              href={HALO2_SOURCE}
            >
              <p><strong>문제:</strong> 표에 값을 놓는 단계부터 검증까지 이어지는 실제 IPA 구현을 고정합니다.</p>
              <p><strong>기여:</strong> 공식 simple example과 prover·verifier source를 제공합니다.</p>
              <p><strong>고정한 버전:</strong> 2026-10-27 commit <code>3442dd3</code>과 Cargo.lock입니다.</p>
              <p><strong>근거 범위:</strong> 선택 snapshot의 source·example·tests입니다.</p>
              <p><strong>말하지 않는 것:</strong> KZG forks, 모든 downstream gadget과 production audit를 보장하지 않습니다.</p>
            </CitationBlock>
          </div>

          <a
            className="not-prose block rounded-lg border border-border p-4 text-sm font-semibold hover:border-primary"
            href={HALO2_BOOK}
            target="_blank"
            rel="noreferrer"
          >
            Halo2 Book · 공식 simple example 열기
          </a>
        </section>
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ halo2: halo2Tree }}
        projectMetas={{
          halo2: {
            id: "halo2",
            label: "zcash/halo2 · Rust · IPA",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </>
  );
}
