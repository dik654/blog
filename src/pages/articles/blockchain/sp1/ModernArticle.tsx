import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefsReal, SP1_COMMIT, SP1_VERSION } from "./codeRefsReal";
import { sp1RealTree } from "./fileTreeReal";
import { Sp1ReceiptViz } from "./Sp1ReceiptViz";

const SOURCE = `https://github.com/succinctlabs/sp1/tree/${SP1_COMMIT}`;
const PROGRAM = `https://github.com/succinctlabs/sp1/blob/${SP1_COMMIT}/crates/core/executor/src/program.rs`;
const RECORD = `https://github.com/succinctlabs/sp1/blob/${SP1_COMMIT}/crates/core/executor/src/record.rs`;
const PROOF = `https://github.com/succinctlabs/sp1/blob/${SP1_COMMIT}/crates/sdk/src/proof.rs`;
const PROVER = `https://github.com/succinctlabs/sp1/blob/${SP1_COMMIT}/crates/sdk/src/prover.rs`;
const FIBONACCI = `https://github.com/succinctlabs/sp1/blob/${SP1_COMMIT}/examples/fibonacci/program/src/main.rs`;
const ADVISORY = "https://github.com/succinctlabs/sp1/security/advisories/GHSA-p7v2-jjv3-8p8f";
const DOCS = "https://docs.succinct.xyz/docs/sp1/introduction";

export default function ModernSp1() {
  const sidebar = useCodeSidebar();
  const openSource = (key: string) => sidebar.open(key, codeRefsReal[key]);

  return (
    <>
      <article className="space-y-14 [overflow-wrap:anywhere]">
        <section id="overview" className="space-y-6 scroll-mt-20">
          <header className="space-y-3">
            <p className="text-sm font-semibold text-primary">한 문장으로 먼저 답하기</p>
            <h2 className="max-w-4xl break-keep text-3xl font-bold tracking-tight">
              SP1은 고정 ELF의 실행과 그 프로그램이 공개한 bytes를 검증 가능한 proof로 묶습니다
            </h2>
          </header>

          <p className="text-lg leading-8 text-foreground/90">
            공식 Fibonacci guest에 <code>n=10</code>을 넣으면 guest는 <code>10·55·89</code>를 이 순서로
            공개합니다. SP1 proof는 단순히 “55가 맞다”를 증명하지 않습니다. <strong>허용한 RV64IM
            ELF가 입력을 읽어 그 세 값을 commit할 때까지 SP1 machine 규칙대로 실행됐다</strong>는
            statement를 verification key와 함께 증명합니다.
          </p>
          <p>
            이 한 문장을 이해하려면 세 질문을 분리해야 합니다. 실행이 성공했는가, 그 실행에 대한 proof가
            유효한가, application이 그 public values를 기대한 의미로 해석했는가입니다. 이 글은 같은
            <code>n=10</code> 사례를 execute부터 core shards, recursion, PLONK·Groth16 wrapper와 최종
            검증까지 바꾸지 않고 추적합니다.
          </p>

          <Sp1ReceiptViz />
          <ContentBoundary article="sp1" />

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              ["실행 대상", "RV64IM ELF", "Rust source 이름이 아니라 executor가 읽는 instruction·memory image"],
              ["공개 statement", "10 · 55 · 89", "guest의 commit 순서까지 포함한 public values bytes"],
              ["검증 조건", "VK + proof + version", "program identity, exit code, public-values digest와 proof mode"],
            ].map(([eyebrow, title, body]) => (
              <article key={eyebrow} className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-primary">{eyebrow}</p>
                <h3 className="mt-2 break-words font-mono text-sm font-black">{title}</h3>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="black-box" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">01 · 이름보다 입출력을 먼저 보기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              네 주체는 서로 다른 질문에 답합니다
            </h2>
          </header>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">주체</th><th className="p-3">받는 것</th><th className="p-3">내놓거나 확인하는 것</th></tr>
              </thead>
              <tbody>
                {[
                  ["Host", "ELF와 stdin n=10", "execute·setup·prove 요청"],
                  ["Guest", "stdin에서 읽은 u32", "commit한 public values 10·55·89"],
                  ["Executor", "ELF와 stdin", "CPU·memory·syscall event와 execution report"],
                  ["Prover", "PK·execution record", "Core·Compressed·PLONK·Groth16 proof"],
                  ["Verifier", "proof·VK·version·expected exit", "암호 검증과 public-values digest 결속"],
                  ["Application", "검증된 public values", "schema대로 decode하고 10·55·89인지 판정"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            가장 자주 생기는 오해는 stdin과 public values를 같은 것으로 보는 것입니다. <code>stdin.write(&n)</code>은
            prover가 guest에 주는 입력입니다. 이 값은 guest가 <code>commit</code>하지 않으면 proof의 공개 출력이
            아닙니다. 현재 공식 Fibonacci 예시는 n도 commit하므로 <code>n=10</code>이 공개됩니다.
          </p>
        </section>

        <section id="case" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">02 · 같은 작은 사례를 끝까지 유지하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              n=10을 넣으면 public values에는 10·55·89가 남습니다
            </h2>
          </header>

          <p>
            Guest는 <code>a=0</code>, <code>b=1</code>에서 시작해 열 번 반복합니다. 매 반복에서
            <code>c=(a+b) mod 7919</code>, <code>a=b</code>, <code>b=c</code>로 바꿉니다. 따라서 반복이
            끝나면 <code>a=F(10)=55</code>, <code>b=F(11)=89</code>입니다. 7919 나머지는 큰 n에서
            overflow를 막기 위한 규칙이며 n=10에서는 결과를 바꾸지 않습니다.
          </p>

          <ExplainedFormula
            question="왜 결과가 55 하나가 아니라 10·55·89 세 값인가?"
            idea={<>공식 guest가 입력 n을 먼저 commit하고, 반복 뒤의 a와 b도 차례로 commit하기 때문입니다.</>}
            formula={String.raw`PV=encode(n\|F(n)\|F(n+1))=encode(10\|55\|89)`}
            annotatedFormula={String.raw`PV=\underbrace{encode(n)}_{\text{첫 commit: 10}}\|\underbrace{encode(F(n))}_{\text{둘째 commit: 55}}\|\underbrace{encode(F(n+1))}_{\text{셋째 commit: 89}}`}
            operations={[
              { expression: String.raw`n=10`, annotation: ["Host가 stdin에 쓴 u32", "guest가 읽은 뒤 첫 번째로 commit"] },
              { expression: String.raw`F(10)=55`, annotation: ["10번 반복 뒤 a", "두 번째 public value"] },
              { expression: String.raw`F(11)=89`, annotation: ["같은 반복 뒤 b", "세 번째 public value"] },
            ]}
            terms={[
              { symbol: "PV", name: "Public values", description: "Guest가 commit한 ordered bytes입니다." },
              { symbol: "encode", name: "Serialization", description: "Host와 application이 같은 형·순서로 읽어야 하는 byte encoding입니다." },
              { symbol: "F(n)", name: "Fibonacci value", description: "F(0)=0, F(1)=1인 수열의 n번째 값입니다." },
            ]}
            assumptions={[
              "공식 v6.10.0 Fibonacci guest의 commit 순서를 사용합니다.",
              "n=10에서는 mod 7919가 55와 89를 바꾸지 않습니다.",
            ]}
            interpretation="Application이 55만 읽거나 순서를 55·89·10으로 가정하면 proof가 유효해도 의미 해석은 틀립니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="공식 Fibonacci guest의 read·commit" onClick={() => openSource("sp1-fibonacci")} />
          </div>
        </section>

        <section id="execute-vs-prove" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">03 · 실행과 증명을 분리하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              execute는 결과를 계산하지만 제3자용 proof를 만들지는 않습니다
            </h2>
          </header>

          <AlgorithmBlock
            title="n=10 한 요청이 execute에서 verify까지 가는 경로"
            input={[
              "고정 RV64IM ELF",
              "SP1Stdin에 직렬화한 u32 n=10",
              "application이 허용한 public-values schema",
            ]}
            steps={[
              { code: "(pv, report) ← execute(ELF, stdin)", note: "실행 결과와 cycle report를 먼저 확인합니다. 아직 proof는 없습니다." },
              { code: "pk ← setup(ELF); vk ← pk.verifying_key()", note: "이 ELF에 대응하는 program identity를 key로 고정합니다." },
              { code: "proof ← prove(pk, stdin).core()", note: "Execution record를 shards로 나눠 core proofs를 만듭니다." },
              { code: "compressed ← recurse(proof)", note: "필요하면 core proofs를 고정 크기 recursive proof로 접습니다." },
              { code: "verify(proof, vk, SUCCESS)", note: "Version, exit code, public-values digest와 mode별 proof를 확인합니다." },
              { code: "decode(PV) == [10,55,89]", note: "마지막으로 application이 schema와 기대값을 판정합니다." },
            ]}
            output="고정 ELF가 공개한 10·55·89에 결속된 검증 결과"
          />

          <p>
            이 순서를 두는 이유는 실패 위치를 분리하기 위해서입니다. execute에서 10·55·89가 나오지 않으면 guest나
            입력 문제입니다. execute는 맞지만 prove가 실패하면 witness·machine·resource 경계 문제입니다. Proof가
            검증되지만 application이 값을 거절하면 public-values schema 또는 업무 규칙 문제입니다.
          </p>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="setup·prove·execute·verify API" onClick={() => openSource("sp1-prover")} />
          </div>
        </section>

        <section id="program-artifact" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">04 · 결과가 아니라 프로그램까지 고정하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Program identity는 소스 이름이 아니라 ELF와 verification key에 속합니다
            </h2>
          </header>

          <p>
            SP1 executor의 <code>Program::from</code>은 ELF bytes를 decode하고 RV64IM instruction으로
            transpile합니다. Program에는 instruction, start/base PC, 초기 memory image와 page protection 같은
            실제 실행 자료가 들어갑니다. 같은 <code>main.rs</code>라도 compiler·target·dependency가 달라 ELF가
            바뀌면 새 program artifact입니다.
          </p>

          <ExplainedFormula
            question="배포 시 어떤 값을 한 artifact로 묶어야 할까?"
            idea={<>Executor가 읽는 ELF, setup이 만든 VK, public-values schema와 verifier version을 함께 고정합니다.</>}
            formula={String.raw`A_P=H(H(ELF)\|vkHash\|schema\|version)`}
            annotatedFormula={String.raw`A_P=H(\underbrace{H(ELF)\|vkHash}_{\text{program identity}}\|\underbrace{schema\|version}_{\text{해석·검증 경계}})`}
            operations={[
              { expression: String.raw`H(ELF)\|vkHash`, annotation: ["실행할 RV64IM bytes와", "그 program의 verification key"] },
              { expression: String.raw`schema\|version`, annotation: ["10·55·89의 형·순서와", "호환되는 SP1 circuit version"] },
            ]}
            terms={[
              { symbol: "A_P", name: "Program artifact ID", description: "배포 가능한 program·key·schema 묶음의 식별자입니다." },
              { symbol: "vkHash", name: "Verification-key hash", description: "Verifier가 허용한 program identity입니다." },
              { symbol: "schema", name: "Public-values schema", description: "Committed bytes를 어떤 형과 순서로 읽는지 정의합니다." },
            ]}
            assumptions={["Canonical length-delimited encoding을 사용합니다.", "실제 VK hashing과 version 비교는 pinned SP1 구현을 따릅니다."]}
            interpretation="결과 bytes가 같아도 ELF·VK·schema·version 중 하나가 다르면 같은 배포 artifact로 승인하지 않습니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="ELF를 Program으로 바꾸는 경계" onClick={() => openSource("sp1-program")} />
          </div>

          <div id="paper-sp1-program" className="scroll-mt-20">
            <CitationBlock type="code" citeKey={1} source={`SP1 Program parser · ${SP1_VERSION} · ${SP1_COMMIT.slice(0, 8)}`} href={PROGRAM}>
              <p><strong>문제:</strong> ELF bytes를 zkVM이 실행할 instruction·memory image로 바꿔야 합니다.</p>
              <p><strong>핵심 기여:</strong> 고정 source는 RV64IM ELF decode, transpile과 Program field 경계를 정의합니다.</p>
              <p><strong>중요 가정:</strong> 이 release가 지원하는 ELF와 target을 사용합니다.</p>
              <p><strong>근거 범위:</strong> Program loading과 machine identity의 입력입니다.</p>
              <p><strong>일반화 금지:</strong> Source-level equivalence, guest의 업무 정확성이나 임의 OS 동작을 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="execution-shards" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">05 · 긴 실행을 나누되 순서는 잃지 않기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Core verifier는 shard proof와 shard 사이의 연속성을 따로 검사합니다
            </h2>
          </header>

          <p>
            ExecutionRecord는 instruction count 하나가 아닙니다. CPU·ALU·memory·branch event와
            syscall·precompile event를 담습니다. Memory 초기화·종료와 public values도 같은 record에 남습니다.
          </p>
          <p>
            긴 record는 여러 shard로 나눌 수 있습니다. 그러나 유효한 proof들을 아무 순서로 붙인다고 한 실행이
            되지는 않습니다.
          </p>

          <ExplainedFormula
            question="두 shard가 같은 실행의 이웃이라는 것을 무엇으로 확인할까?"
            idea={<>앞 shard의 종료 PC·timestamp·exit·digest 경계가 다음 shard의 시작 경계와 같아야 합니다.</>}
            formula={String.raw`nextPC_i=startPC_{i+1},\quad t_i^{last}=t_{i+1}^{initial}`}
            annotatedFormula={String.raw`\underbrace{nextPC_i=startPC_{i+1}}_{\text{명령 흐름 연속}}\quad\land\quad\underbrace{t_i^{last}=t_{i+1}^{initial}}_{\text{실행 시간축 연속}}`}
            operations={[
              { expression: String.raw`nextPC_i=startPC_{i+1}`, annotation: ["i번째 shard가 끝난 명령 주소에서", "다음 shard가 시작해야 함"] },
              { expression: String.raw`t_i^{last}=t_{i+1}^{initial}`, annotation: ["마지막 timestamp가 다음 처음과 같아야", "event 조각이 빠지거나 겹치지 않음"] },
            ]}
            terms={[
              { symbol: String.raw`nextPC_i`, name: "Previous next PC", description: "i번째 shard 실행 뒤 이어질 program counter입니다." },
              { symbol: String.raw`startPC_{i+1}`, name: "Next start PC", description: "다음 shard가 시작한다고 주장하는 PC입니다." },
              { symbol: "t", name: "Timestamp boundary", description: "Shard 실행 event의 연속성을 나타내는 공개 경계입니다." },
            ]}
            assumptions={["모든 shard가 같은 VK와 proof nonce에 속합니다.", "Exit code, memory index, committed digest와 global cumulative sum도 실제 verifier가 별도로 연결합니다."]}
            interpretation="두 번째 shard의 start PC 하나만 바뀌어도 각 shard의 내용을 따로 보는 것과 무관하게 전체 core proof는 거절됩니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="ExecutionRecord의 실제 event fields" onClick={() => openSource("sp1-record")} />
            <CodeViewButton label="Core shard 연속성 검사" onClick={() => openSource("sp1-core-verify")} />
          </div>

          <div id="paper-sp1-record" className="scroll-mt-20">
            <CitationBlock type="code" citeKey={2} source={`SP1 ExecutionRecord·core verifier · ${SP1_VERSION}`} href={RECORD}>
              <p><strong>문제:</strong> 실행 event를 shard witness로 나누되 순서를 잃어서는 안 됩니다.</p>
              <p><strong>핵심 기여:</strong> Record는 event·공개값·경계 상태를 담고, verifier는 timestamp·PC·exit·memory·digest 연속성을 검사합니다.</p>
              <p><strong>중요 가정:</strong> 같은 VK와 v6.10.0 public-values layout을 사용합니다.</p>
              <p><strong>근거 범위:</strong> ExecutionRecord 구조와 Core proof의 순서·완결성 검증입니다.</p>
              <p><strong>일반화 금지:</strong> Shard 수나 크기가 모든 workload에서 최적이라는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="proof-modes" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">06 · 변형이 생긴 이유를 목적에서 이해하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              네 proof mode는 목적이 다릅니다
            </h2>
          </header>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">Mode</th><th className="p-3">왜 필요한가</th><th className="p-3">주 검증 경로</th></tr>
              </thead>
              <tbody>
                {[
                  ["Core", "실행 shards를 직접 증명; 크기는 cycle에 따라 증가", "SP1 native verifier"],
                  ["Compressed", "Core proofs를 recursion으로 고정 크기에 집계", "SP1 recursion/native verifier"],
                  ["PLONK", "EVM·외부 verifier가 다루기 쉬운 BN254 wrapper", "PLONK verifier contract/library"],
                  ["Groth16", "고정 형식·작은 온체인 proof를 위한 BN254 wrapper", "Groth16 verifier contract/library"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Compressed가 Core보다 “더 참”인 것은 아닙니다. 앞의 core verification을 재귀적으로 접어 proof 크기를
            일정하게 만드는 목적이 다릅니다. PLONK와 Groth16도 같은 statement를 BN254 기반의 외부 검증 형식으로
            바꾸는 wrapper입니다. 그래서 mode를 선택할 때 proving 시간 하나가 아니라 verifier 환경과 proof size,
            setup artifact, 온체인 비용을 함께 봐야 합니다.
          </p>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="SP1Proof 네 가지 variants" onClick={() => openSource("sp1-proof")} />
          </div>

          <div id="paper-sp1-proof" className="scroll-mt-20">
            <CitationBlock type="code" citeKey={3} source={`SP1 proof types · ${SP1_VERSION}`} href={PROOF}>
              <p><strong>문제:</strong> 서로 다른 proof mode와 공개값·version을 한 receipt로 전달해야 합니다.</p>
              <p><strong>핵심 기여:</strong> Core·Compressed·PLONK·Groth16 variant와 public values, SP1 version을 묶습니다.</p>
              <p><strong>중요 가정:</strong> Proof를 만든 release와 호환되는 verifier를 사용합니다.</p>
              <p><strong>근거 범위:</strong> SDK receipt의 구조와 wrapper 공개입력 검사입니다.</p>
              <p><strong>일반화 금지:</strong> Mode 사이의 자동 호환이나 같은 성능을 뜻하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="verification" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">07 · 암호 검증 뒤 application 판정까지</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Proof가 유효해도 expected VK와 10·55·89를 비교해야 합니다
            </h2>
          </header>

          <p>
            SDK verifier는 먼저 proof bundle의 SP1 version이 현재 circuit version과 같은지 확인합니다. Core와
            Compressed에서는 proof 안의 committed-value digest가 public values hash와 같은지 봅니다.
          </p>
          <p>
            PLONK와 Groth16에서는 wrapper public input에서 public-values hash와 exit code를 읽습니다. 마지막에는
            application이 선택한 verification key로 해당 mode의 proof를 검증합니다.
          </p>

          <ExplainedFormula
            question="Application이 승인하는 최종 조건은 무엇인가?"
            idea={<>Proof 자체의 유효성, 기대한 program key, 성공 exit와 정확한 public-values 해석을 모두 AND로 묶습니다.</>}
            formula={String.raw`Accept=Verify(\pi,VK)\land version=v\land exit=0\land decode(PV)=[10,55,89]`}
            annotatedFormula={String.raw`Accept=\underbrace{Verify(\pi,VK)}_{\text{암호 proof+program}}\land\underbrace{version=v\land exit=0}_{\text{실행 호환·성공}}\land\underbrace{decode(PV)=[10,55,89]}_{\text{업무 statement}}`}
            operations={[
              { expression: String.raw`Verify(\pi,VK)`, annotation: ["선택 mode의 proof가 유효하고", "허용한 program key에 속함"] },
              { expression: String.raw`version=v\land exit=0`, annotation: ["호환 circuit version과", "기대한 성공 status"] },
              { expression: String.raw`decode(PV)=[10,55,89]`, annotation: ["schema대로 읽은 세 u32가", "요청과 기대 결과에 정확히 일치"] },
            ]}
            terms={[
              { symbol: String.raw`\pi`, name: "Proof", description: "Core, Compressed, PLONK 또는 Groth16 proof입니다." },
              { symbol: "VK", name: "Expected verification key", description: "Application이 허용한 ELF의 verification key입니다." },
              { symbol: "PV", name: "Committed public values", description: "Proof에 hash로 결속된 ordered bytes입니다." },
            ]}
            assumptions={["Application은 예상 VK를 신뢰할 수 있는 배포 manifest에서 가져옵니다.", "Public-values decoder와 guest commit 순서가 같은 schema revision을 사용합니다."]}
            interpretation="다른 Fibonacci program의 유효 proof나 [10,55,90]을 공개한 유효 proof는 이 application에서 거절합니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Version·exit·public-values 검증" onClick={() => openSource("sp1-verification")} />
          </div>
        </section>

        <section id="release-gate" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">08 · 검증기 자체도 검증 대상에 넣기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              검증기 자체도 release gate로 막습니다
            </h2>
          </header>

          <p>
            SP1 v6.0.0부터 v6.8.0까지의 native Rust verifier에는 proof tensor의 선언 dimensions와 실제 storage
            길이가 달라도 일부 검증 단계가 서로 다른 원소를 읽을 수 있는 soundness 취약점이 있었습니다. 공식
            advisory는 Core와 Compressed proof를 신뢰하지 않는 prover에게서 직접 받는 경로가 영향받았고,
            v6.8.1에서 수정됐다고 설명합니다. 이 글은 패치 이후인 <code>{SP1_VERSION}</code>을 고정합니다.
          </p>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">Negative fixture</th><th className="p-3">기대 결과</th><th className="p-3">막는 경계</th></tr>
              </thead>
              <tbody>
                {[
                  ["PV를 10·55·90으로 변경", "Invalid public-values digest 또는 app reject", "proof↔PV 결속"],
                  ["다른 ELF의 VK 사용", "Mode verifier reject", "program identity"],
                  ["Shard start PC·timestamp 변경", "Core continuity reject", "한 실행의 순서"],
                  ["Version string 변경", "VersionMismatch", "circuit 호환성"],
                  ["Tensor 2×2, storage 3개 또는 5개", "Deserialize/error 또는 view panic", "malformed proof shape"],
                  ["CPU·CUDA backend 결과 불일치", "release 중단", "backend parity"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            로컬에서는 v6.10.0의 <code>slop-tensor</code> 공식 unit tests 18개를 실행했습니다. JSON·bincode에서
            선언 크기보다 storage가 짧거나 긴 네 사례를 모두 거절했고, invalid shape를 view로 바꾸는 두 사례도
            예정된 panic으로 통과했습니다.
          </p>
          <p>
            공식 Succinct toolchain과 protoc로 SDK proof tests 6개도 실행했습니다. PLONK·Groth16 proof bytes,
            이전 형식 역직렬화와 Core의 온체인 변환 거절을 모두 확인했습니다.
          </p>
          <p>
            <code>SP1_PROVER=light</code>로 Fibonacci guest에 n=10을 넣은 실행은 공개값 10·55·89를 냈고,
            이어서 CPU Core proof를 실제로 생성해 같은 VK로 검증했습니다. 실행 스크립트의 1,744는
            instruction 1,742회에 SHA syscall 2회를 더한 수이고, proof 스크립트의 1,742는 instruction만 센
            값입니다. 같은 실행을 두 숫자로 부른 것이 아니라 계수 범위가 달랐습니다.
          </p>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Tensor shape 길이 검사와 회귀 테스트" onClick={() => openSource("sp1-tensor-shape")} />
          </div>

          <div id="paper-sp1-tensor-advisory" className="scroll-mt-20">
            <CitationBlock type="code" citeKey={4} source={`SP1 v6 native verifier advisory · patched in 6.8.1`} href={ADVISORY}>
              <p><strong>문제:</strong> Proof-controlled tensor의 선언 shape와 실제 storage 길이가 다르면 검증 단계가 서로 다른 자료를 볼 수 있었습니다.</p>
              <p><strong>핵심 기여:</strong> Deserialization과 verifier 경로에서 physical shape를 확인해 mismatch를 거절합니다.</p>
              <p><strong>중요 가정:</strong> 신뢰하지 않는 prover에게서 native Core·Compressed proof를 받는 경로를 구분합니다.</p>
              <p><strong>근거 범위:</strong> 공식 advisory가 밝힌 v6 native Rust verifier의 영향·패치 범위입니다.</p>
              <p><strong>일반화 금지:</strong> 이 취약점이 PLONK·Groth16 wrapper 경로 또는 v6.10.0에도 남았다는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>

          <div id="paper-sp1-prover" className="scroll-mt-20">
            <CitationBlock type="code" citeKey={5} source={`SP1 SDK proof lifecycle · ${SP1_VERSION}`} href={PROVER}>
              <p><strong>문제:</strong> Setup·execute·prove·verify의 책임과 실패 위치를 분리해야 합니다.</p>
              <p><strong>핵심 기여:</strong> 고정 source는 Prover trait과 version·exit·public-values·mode verification 경계를 제공합니다.</p>
              <p><strong>중요 가정:</strong> Matching release의 keys, proof serialization과 verifier를 사용합니다.</p>
              <p><strong>근거 범위:</strong> SDK의 user-facing lifecycle과 receipt verification입니다.</p>
              <p><strong>일반화 금지:</strong> 특정 backend의 가용성·속도, 입력 provenance나 guest 업무 정확성을 보장하지 않습니다.</p>
            </CitationBlock>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm leading-7">
            <p className="font-semibold">고정한 현재 자료</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>SP1 {SP1_VERSION} · commit {SP1_COMMIT}</li>
              <li><a className="text-primary hover:underline" href={FIBONACCI}>공식 Fibonacci guest</a></li>
              <li><a className="text-primary hover:underline" href={RECORD}>ExecutionRecord source</a></li>
              <li><a className="text-primary hover:underline" href={PROOF}>Proof receipt types</a></li>
              <li><a className="text-primary hover:underline" href={DOCS}>공식 SP1 문서</a></li>
              <li><a className="text-primary hover:underline" href={SOURCE}>Pinned source tree</a></li>
            </ul>
          </div>
        </section>
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefsReal}
        fileTrees={{ sp1: sp1RealTree }}
        projectMetas={{
          sp1: {
            id: "sp1",
            label: `succinctlabs/sp1 ${SP1_VERSION} · Rust`,
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </>
  );
}
