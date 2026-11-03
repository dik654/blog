import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { currentCodeRefs, RISC0_COMMIT } from "./currentCodeRefs";
import { currentRisc0Tree } from "./currentFileTree";
import { Risc0ReceiptViz } from "./Risc0ReceiptViz";

const HELLO = `https://github.com/risc0/risc0/tree/${RISC0_COMMIT}/examples/hello-world`;
const RECEIPT = `https://github.com/risc0/risc0/blob/${RISC0_COMMIT}/risc0/zkvm/src/receipt.rs`;
const CLAIM = `https://github.com/risc0/risc0/blob/${RISC0_COMMIT}/risc0/zkvm/src/claim/receipt.rs`;

export default function ModernRisc0() {
  const sidebar = useCodeSidebar();
  const openSource = (key: string) => sidebar.open(key, currentCodeRefs[key]);

  return (
    <>
      <article className="space-y-14 [overflow-wrap:anywhere]">
        <section id="overview" className="space-y-6 scroll-mt-20">
          <header className="space-y-3">
            <p className="text-sm font-semibold text-primary">한 문장으로 먼저 답하기</p>
            <h2 className="max-w-4xl break-keep text-3xl font-bold tracking-tight">
              RISC Zero receipt는 guest의 성공 실행과 journal 391을 인증합니다
            </h2>
          </header>

          <p className="text-lg leading-8 text-foreground/90">
            공식 예제에서 host는 비공개 수 17과 23을 넣습니다. Guest는 두 수가 1이 아닌지
            확인하고 곱 391만 journal에 씁니다. Prover가 만든 결과를 검증할 때는
            <code>verify(MULTIPLY_ID)</code>를 호출합니다. 이 한 호출은 seal뿐 아니라 “허용한
            guest인가, 정상 종료했는가, 공개 journal이 바뀌지 않았는가”를 함께 확인합니다.
          </p>
          <p>
            따라서 “Rust 코드가 참이다” 또는 “391이 현실의 올바른 값이다”라고 넓혀 말하면
            안 됩니다. 정확한 뜻은 <strong>expected ImageID가 가리키는 guest 실행의 claim과
            journal bytes를 seal이 인증했다</strong>입니다. 입력 출처, journal의 업무상 의미,
            최신성, 권한은 애플리케이션이 별도로 정합니다.
          </p>

          <Risc0ReceiptViz />
          <ContentBoundary article="risc0" />

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              ["비공개 입력", "17 · 23", "Host가 guest에 넣지만 journal에는 쓰지 않습니다."],
              ["공개 출력", "391", "env::commit으로 공개한 u64입니다."],
              ["검증자 기준", "MULTIPLY_ID", "배포 때 허용한 guest의 identity입니다."],
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
              Host가 입력을 넣고 verifier가 expected ImageID를 확인합니다
            </h2>
          </header>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">주체</th><th className="p-3">받는 것</th><th className="p-3">내놓는 것</th></tr>
              </thead>
              <tbody>
                {[
                  ["Host", "a=17, b=23, MULTIPLY_ELF", "ExecutorEnv와 prove 요청"],
                  ["Guest", "두 u64", "journal에 product=391"],
                  ["Prover", "환경과 ELF", "inner proof·journal·metadata를 담은 Receipt"],
                  ["Verifier", "Receipt와 고정 MULTIPLY_ID", "성공 또는 typed verification error"],
                  ["Application", "검증 결과와 업무 문맥", "freshness·권한·입력 신뢰 최종 판단"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            핵심 분리는 간단합니다. Prover는 private input을 알아야 실행을 만들 수 있지만,
            verifier는 두 수를 다시 받을 필요가 없습니다. 대신 public journal과 expected method
            identity가 claim에 정확히 묶였는지 확인합니다.
          </p>
        </section>

        <section id="case" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">02 · 같은 작은 사례를 끝까지 유지하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              17과 23은 guest 입력이고 391만 journal의 공개 출력입니다
            </h2>
          </header>

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
            <article className="min-w-0 bg-background p-5">
              <p className="text-[10px] font-black text-primary">Guest가 검사하는 것</p>
              <ol className="mt-3 space-y-2 text-xs leading-6">
                <li>1. <code>a: u64</code>와 <code>b: u64</code>를 읽습니다.</li>
                <li>2. 어느 값도 1이 아니어야 합니다.</li>
                <li>3. <code>checked_mul</code>이 overflow 없이 391을 만들어야 합니다.</li>
                <li>4. <code>env::commit(&amp;product)</code>로 곱만 공개합니다.</li>
              </ol>
            </article>
            <article className="min-w-0 bg-background p-5">
              <p className="text-[10px] font-black text-amber-700 dark:text-amber-300">이 예제가 말하지 않는 것</p>
              <ul className="mt-3 space-y-2 text-xs leading-6">
                <li>· 17과 23의 출처가 믿을 만하다는 보장</li>
                <li>· Prover host 메모리에서도 입력이 숨겨진다는 보장</li>
                <li>· 391이 가격·잔액 등 특정 업무 단위라는 보장</li>
                <li>· 같은 receipt의 재사용을 애플리케이션이 막았다는 보장</li>
              </ul>
            </article>
          </div>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="공식 guest 17×23→391" onClick={() => openSource("risc0-hello-guest")} />
            <CodeViewButton label="공식 host prove·decode" onClick={() => openSource("risc0-hello-host")} />
          </div>
        </section>

        <section id="guest-journal" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">03 · Guest와 journal의 경계</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              무엇을 계산했는지와 무엇을 공개했는지는 다른 결정입니다
            </h2>
          </header>

          <p>
            Guest는 17과 23을 모두 사용하지만 journal에는 391만 씁니다. Journal은 영지식으로
            숨기는 저장소가 아니라 verifier에게 공개할 출력입니다. 따라서 email, 원본 문서,
            비밀 key처럼 숨겨야 할 값을 <code>env::commit</code>하면 그 bytes는 receipt의 공개
            인터페이스가 됩니다.
          </p>

          <ExplainedFormula
            question="17과 23을 공개하지 않고도 verifier가 확인하는 값은 무엇인가요?"
            idea="Guest가 두 입력을 읽어 product를 계산하지만 public output에는 product의 직렬화만 둡니다."
            formula={String.raw`J=\operatorname{encode}_{u64}(391)`}
            annotatedFormula={String.raw`\begin{aligned}
              \underbrace{a=17,\ b=23}_{\text{비공개 입력}}\\
              \underbrace{p=a\times b=391}_{\text{guest 계산}}\\
              \underbrace{J=\operatorname{encode}_{u64}(p)}_{\text{공개 journal}}
            \end{aligned}`}
            operations={[
              { expression: String.raw`17\times23`, annotation: ["두 u64를 guest 안에서 사용", "1 거절과 overflow 검사도 같은 실행에 포함"] },
              { expression: String.raw`\operatorname{encode}_{u64}(391)`, annotation: ["journal decode 타입과 순서가 같아야 함", "17·23 자체는 commit하지 않음"] },
            ]}
            terms={[
              { symbol: "J", name: "Journal", description: "Guest가 공개하기로 선택한 bytes입니다." },
              { symbol: "encode_u64", name: "직렬화", description: "Host의 decode와 같은 타입·순서를 써야 하는 byte 표현입니다." },
            ]}
            assumptions={[
              "이 예제의 guest가 product만 commit합니다. 다른 guest는 입력이나 다른 값을 공개할 수 있습니다.",
              "비공개 입력은 journal에 나타나지 않는다는 뜻이며, host·prover의 운영 보안까지 설명하지 않습니다.",
              "17×23의 산술과 guest의 모든 분기가 고정 ELF 안에서 성공해야 합니다.",
            ]}
            interpretation="Journal을 390으로 바꾸면 digest가 달라집니다. 17이나 23을 journal에 추가하면 그 값은 공개 출력의 일부가 됩니다."
          />
        </section>

        <section id="method-artifact" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">04 · 공개값만 같아도 같은 증명이 아닌 이유</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              ImageID는 verifier가 허용한 guest method를 고정합니다
            </h2>
          </header>

          <p>
            어떤 다른 guest도 journal에 391을 쓸 수 있습니다. 그래서 verifier는 journal 값만
            보지 않고, 배포 때 생성된 <code>MULTIPLY_ID</code>를 코드나 신뢰된 설정에서 가져와
            <code>verify</code>에 넣습니다. 요청자가 보낸 ImageID를 그대로 기대값으로 쓰면
            요청자가 고른 다른 정상 guest까지 승인할 수 있습니다.
          </p>

          <AlgorithmBlock
            title="공식 hello-world 한 요청의 prove 경로"
            input={["private a=17, b=23", "빌드가 만든 MULTIPLY_ELF", "journal schema: u64 product"]}
            steps={[
              { code: "env ← ExecutorEnv.write(17).write(23)", note: "두 입력은 host가 executor 환경에 넣습니다." },
              { code: "guest ← execute(MULTIPLY_ELF, env)", note: "guest는 1을 거절하고 checked_mul로 391을 계산합니다." },
              { code: "journal ← commit(encode_u64(391))", note: "공개 출력은 product 하나입니다." },
              { code: "receipt ← default_prover.prove(env, MULTIPLY_ELF).receipt", note: "실행 claim을 인증하는 inner receipt와 journal이 만들어집니다." },
              { code: "c ← receipt.journal.decode::<u64>()", note: "Host가 공개 bytes를 같은 타입과 순서로 해석합니다." },
            ]}
            output="Receipt + public product 391"
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="MULTIPLY_ELF prove 원문" onClick={() => openSource("risc0-hello-host")} />
            <CodeViewButton label="MULTIPLY_ID verify 원문" onClick={() => openSource("risc0-hello-verify")} />
          </div>
        </section>

        <section id="receipt-shape" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">05 · 증명 결과의 세 필드를 같은 신뢰도로 보면 안 됩니다</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Inner와 journal은 검증하지만 metadata는 보안 기준이 아닙니다
            </h2>
          </header>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">필드</th><th className="p-3">역할</th><th className="p-3">보안상 읽는 법</th></tr>
              </thead>
              <tbody>
                {[
                  ["inner", "proof variant·claim·verifier parameters", "seal 무결성과 claim을 검증"],
                  ["journal", "guest가 commit한 public bytes", "verify가 digest를 expected claim에 결속"],
                  ["metadata", "SDK·proof system 문맥과 상호운용 정보", "암호학적으로 결속되지 않음; 버전 승인 근거로 사용 금지"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            현재 코드도 metadata가 receipt에 암호학적으로 묶이지 않았고, stated version을 보고
            receipt를 승인하는 식의 보안 결정을 해서는 안 된다고 직접 경고합니다. 허용
            verifier parameters와 method version은 verifier binary나 서명된 배포 설정처럼 별도의
            신뢰 경로에서 가져와야 합니다.
          </p>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Receipt 세 필드와 metadata 경고" onClick={() => openSource("risc0-receipt-shape")} />
          </div>
        </section>

        <section id="receipt-claim" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">06 · Expected claim을 실제 필드로 풀기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              ReceiptClaim::ok가 성공 조건을 한 digest로 묶습니다
            </h2>
          </header>

          <p>
            <code>ReceiptClaim</code>의 실제 필드는 pre, post, exit code, input, output입니다.
            <code>ok(image_id, journal)</code>는 pre에 ImageID digest를 넣고, 정상 종료
            <code>Halted(0)</code>, 종료 state, journal과 빈 assumptions를 채웁니다. 최종 digest는
            tagged struct로 네 field digest와 exit pair를 함께 hash합니다.
          </p>

          <ExplainedFormula
            question="verify(MULTIPLY_ID)가 실제 claim과 비교하는 한 값은 어떻게 만들어지나요?"
            idea="호출자가 고정한 ImageID와 receipt의 journal digest로 성공 실행 claim을 만든 뒤, 실제 inner claim digest와 같은지 봅니다."
            formula={String.raw`d_{exp}=H_{\text{ReceiptClaim}}(d_{in},d_{pre},d_{post},d_{out};e_{sys},e_{user})`}
            annotatedFormula={String.raw`\begin{aligned}
              \underbrace{d_{exp}}_{\text{expected claim digest}}=H_{\text{ReceiptClaim}}(&\underbrace{d_{in}}_{\text{input claim}}\|\underbrace{d_{pre}}_{\text{MULTIPLY\_ID}}\\
              &\|\underbrace{d_{post}}_{\text{정상 종료 state}}\|\underbrace{d_{out}}_{H(J=391),\,assumptions=\varnothing};\\
              &\underbrace{e_{sys},e_{user}}_{\text{Halted(0)}})
            \end{aligned}`}
            operations={[
              { expression: String.raw`d_{pre}=\operatorname{digest}(MULTIPLY\_ID)`, annotation: ["검증자가 허용한 method", "요청자 임의값이 아님"] },
              { expression: String.raw`d_{out}=\operatorname{digest}(H(J),\varnothing)`, annotation: ["journal 391의 digest", "ok claim은 빈 assumptions를 기대"] },
              { expression: String.raw`d_{exp}\stackrel{?}=d_{inner}`, annotation: ["seal 검증 뒤 claim digest 비교", "하나라도 다르면 ClaimDigestMismatch"] },
            ]}
            terms={[
              { symbol: "d_pre", name: "Pre-state digest", description: "성공 claim에서 expected ImageID로 고정되는 시작 state identity입니다." },
              { symbol: "d_out", name: "Output digest", description: "Journal digest와 assumptions를 묶은 output commitment입니다." },
              { symbol: "Halted(0)", name: "정상 종료", description: "Guest가 성공 code 0으로 종료했음을 뜻합니다." },
              { symbol: "d_inner", name: "Proven claim digest", description: "검증된 inner receipt가 인증하는 실제 claim digest입니다." },
            ]}
            assumptions={[
              "정확한 field order, tags, pruning과 hash 구현은 고정 commit의 ReceiptClaim::digest를 따릅니다.",
              "ReceiptClaim::ok는 모든 가능한 claim이 아니라 성공 종료·빈 assumptions인 표준 기대 claim을 만듭니다.",
              "Seal의 암호학적 무결성 검사도 먼저 통과해야 합니다.",
            ]}
            interpretation="391을 390으로 바꾸거나 MULTIPLY_ID 대신 다른 ImageID를 쓰거나 exit가 Halted(1)이면 expected digest가 실제 claim digest와 달라져야 합니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="ReceiptClaim::ok와 digest 원문" onClick={() => openSource("risc0-receipt-claim")} />
          </div>
        </section>

        <section id="verify-path" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">07 · 같은 결과를 검증하는 경로</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Seal을 확인한 뒤 expected claim digest까지 같아야 승인합니다
            </h2>
          </header>

          <AlgorithmBlock
            title="현재 Receipt::verify_with_context와 같은 순서의 의사코드"
            input={["Receipt { inner, journal=391, metadata }", "trusted expected image: MULTIPLY_ID", "trusted VerifierContext"]}
            steps={[
              { code: "require inner.verifier_parameters == metadata.verifier_parameters", note: "Receipt struct 내부가 서로 모순되면 형식 오류로 거절합니다. metadata 자체를 신뢰 기준으로 삼는 단계는 아닙니다." },
              { code: "inner.verify_integrity_with_context(ctx)", note: "선택된 proof system으로 seal과 inner claim의 암호학적 무결성을 확인합니다." },
              { code: "expected ← ReceiptClaim::ok(MULTIPLY_ID, Pruned(H(journal)))", note: "호출자가 고정한 method, Halted(0), 현재 journal digest, 빈 assumptions로 기대 claim을 만듭니다." },
              { code: "actual ← inner.claim().digest()", note: "Seal이 인증한 실제 execution claim digest를 읽습니다." },
              { code: "require expected.digest() == actual", note: "ImageID·exit·journal·assumptions 중 하나라도 다르면 ClaimDigestMismatch입니다." },
            ]}
            output="successful execution of MULTIPLY_ID with public journal 391"
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Receipt::verify 실제 원문" onClick={() => openSource("risc0-receipt-verify")} />
          </div>
        </section>

        <section id="integrity-boundary" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">08 · 이름이 비슷한 API의 위험한 차이</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              verify_integrity 성공은 “원하는 guest가 성공했다”는 뜻이 아닙니다
            </h2>
          </header>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">검사</th><th className="p-3">확인</th><th className="p-3">확인하지 않음</th></tr>
              </thead>
              <tbody>
                {[
                  ["verify_integrity", "seal↔claim, journal↔output digest", "성공 exit, expected ImageID"],
                  ["verify(MULTIPLY_ID)", "위 무결성 + Halted(0) + ImageID + journal + 빈 assumptions", "입력 출처, freshness, 업무 권한"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            예를 들어 다른 guest가 정상적인 seal로 journal 391을 만들었거나, 같은 guest가
            <code>Halted(1)</code>로 끝난 receipt라 해도 무결성 자체는 참일 수 있습니다. 그러나
            우리가 원하는 문장은 “MULTIPLY_ID가 성공해 391을 공개했다”이므로 최종 승인에는
            <code>verify(MULTIPLY_ID)</code>가 필요합니다.
          </p>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="verify_integrity의 공식 경고" onClick={() => openSource("risc0-integrity-boundary")} />
          </div>
        </section>

        <section id="session-segments" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">09 · 실행이 길어 segment를 나눌 때</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Segment는 post state에서 다음 pre state로 이어져야 합니다
            </h2>
          </header>

          <p>
            긴 실행은 여러 segment receipt로 나눌 수 있습니다. 그렇다고 독립적인 실행들을
            임의 순서로 붙일 수 있는 것은 아닙니다. 현재 composite verifier는 비최종 segment가
            <code>SystemSplit</code>로 끝나고 output이 비어 있는지 확인한 뒤, 그 post-state digest를
            다음 segment의 expected pre-state digest로 사용합니다.
          </p>

          <ExplainedFormula
            question="Segment A와 B가 같은 한 실행의 앞뒤라는 조건은 무엇인가요?"
            idea="A의 종료 state commitment를 B의 시작 state commitment와 비교합니다. 비최종 segment는 아직 최종 journal을 내지 않습니다."
            formula={String.raw`H(s_i^{post})=H(s_{i+1}^{pre}),\qquad exit_i=SystemSplit,\qquad output_i=None`}
            annotatedFormula={String.raw`\begin{aligned}
              \underbrace{H(s_i^{post})}_{\text{i번째 종료 state}}&=\underbrace{H(s_{i+1}^{pre})}_{\text{다음 시작 state}}\\
              \underbrace{exit_i}_{\text{비최종 종료}}&=SystemSplit\\
              \underbrace{output_i}_{\text{비최종 공개 출력}}&=None
            \end{aligned}`}
            operations={[
              { expression: String.raw`H(s_i^{post})\stackrel{?}=H(s_{i+1}^{pre})`, annotation: ["이전 post를 다음 expected pre로 저장", "순서 교체·누락이면 연결 실패"] },
              { expression: String.raw`exit_i=SystemSplit`, annotation: ["비최종 segment의 continuation 표지", "Halted를 중간에 끼우면 거절"] },
              { expression: String.raw`output_i=None`, annotation: ["최종 journal은 마지막 receipt에서", "중간 output이 있으면 형식 오류"] },
            ]}
            terms={[
              { symbol: "s_i^post", name: "Post state", description: "i번째 segment가 끝난 뒤의 machine state입니다." },
              { symbol: "s_{i+1}^pre", name: "Next pre state", description: "다음 segment가 시작할 때의 machine state입니다." },
              { symbol: "SystemSplit", name: "Continuation exit", description: "실행이 끝난 것이 아니라 다음 segment로 계속된다는 exit code입니다." },
            ]}
            assumptions={[
              "각 SegmentReceipt의 seal 무결성도 먼저 확인합니다.",
              "최종 segment에는 별도의 final claim·assumptions 검사가 이어집니다.",
              "State digest의 collision resistance와 canonical encoding에 의존합니다.",
            ]}
            interpretation="두 segment의 proof가 각각 유효해도 A의 post digest와 B의 pre digest가 다르면 하나의 연속 실행이 아닙니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Composite segment chaining 원문" onClick={() => openSource("risc0-composite-chain")} />
          </div>
        </section>

        <section id="release-gate" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">10 · 확인한 것과 아직 확인하지 못한 것을 분리하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              실패 사례를 거절한 뒤 현재 stats로 비용을 잽니다
            </h2>
          </header>

          <p>
            현재 main의 <code>SessionStats</code>는 segments, total rows, padding rows, RISC-V
            instruction count, ecall·syscall metrics, block counts, execution time을 제공합니다.
          </p>
          <p>
            기존 글처럼 모든 것을 “cycles” 하나로 합쳐 쓰면 어느 부분이 늘었는지 가립니다.
            Prove·verify wall time, receipt bytes와 peak memory는 별도 계측값으로 붙여야 합니다.
          </p>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">Release gate</th><th className="p-3">Positive</th><th className="p-3">반드시 거절할 fixture</th></tr>
              </thead>
              <tbody>
                {[
                  ["Guest 의미", "17×23→journal 391", "1×391, overflow, journal 390, decode schema 변경"],
                  ["Method", "MULTIPLY_ID", "다른 ImageID, request가 고른 ImageID, old artifact"],
                  ["Receipt", "seal + Halted(0) + expected claim", "corrupt seal, Halted(1), journal digest mismatch"],
                  ["Segments", "ordered post→pre chain", "누락, 재정렬, state mismatch, 중간 output"],
                  ["운영 정책", "signed allowlist·freshness·authorization", "metadata version 신뢰, replay, unknown input source"],
                  ["비용", "rows·padding·instructions·ecall/syscall + stage wall time", "다른 guest·hardware 수치를 섞은 비교"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="현재 SessionStats 원문" onClick={() => openSource("risc0-session-stats")} />
          </div>

          <div className="not-prose rounded-lg border border-border bg-muted/20 p-5 text-sm leading-7">
            <p className="font-bold">이 글을 읽은 뒤 답할 수 있어야 하는 질문</p>
            <ol className="mt-3 space-y-2 text-muted-foreground">
              <li>1. 왜 journal 391만 맞는 것으로는 충분하지 않은가?</li>
              <li>2. <code>verify_integrity</code>와 <code>verify(MULTIPLY_ID)</code>의 차이는 무엇인가?</li>
              <li>3. 왜 receipt metadata의 version을 보안 allowlist로 쓰면 안 되는가?</li>
              <li>4. Segment proof가 각각 유효해도 composite가 거절될 수 있는 이유는 무엇인가?</li>
              <li>5. Receipt가 유효해도 freshness와 입력 신뢰를 애플리케이션이 확인해야 하는 이유는 무엇인가?</li>
            </ol>
          </div>

          <div id="paper-risc0-overview">
            <CitationBlock source="RISC Zero hello-world · main commit 164c64bb" citeKey={1} type="code" href={HELLO}>
              <p><strong>문제:</strong> 비공개 두 인수로 공개 곱을 계산하고 그 실행 결과를 검증합니다.</p>
              <p><strong>직접 적용:</strong> 17·23 입력, 1 거절, checked multiplication, journal 391, MULTIPLY_ELF·MULTIPLY_ID 경로를 글 전체의 한 사례로 사용했습니다.</p>
              <p><strong>근거 범위:</strong> 고정 commit의 공식 hello-world guest·host 예제입니다.</p>
              <p><strong>말하지 않는 것:</strong> Host 메모리 보안, 입력 출처, freshness, production 배포 안전을 자동 보장한다고 주장하지 않습니다.</p>
            </CitationBlock>
          </div>

          <div id="paper-risc0-receipt">
            <CitationBlock source="RISC Zero Receipt verifier · main commit 164c64bb" citeKey={2} type="code" href={RECEIPT}>
              <p><strong>문제:</strong> Seal 무결성과 애플리케이션이 기대한 성공 guest·journal을 구별해 검증해야 합니다.</p>
              <p><strong>직접 적용:</strong> 구조, metadata 경고, verify_integrity 경계, ReceiptClaim::ok와 claim digest 비교를 실제 순서로 옮겼습니다.</p>
              <p><strong>근거 범위:</strong> 고정 commit package version 5.0.0의 검증 API입니다.</p>
              <p><strong>말하지 않는 것:</strong> Moving main을 안정 release로 부르거나, 유효한 증명을 업무상 승인과 동일시하지 않습니다.</p>
            </CitationBlock>
          </div>

          <div id="paper-risc0-claim">
            <CitationBlock source="RISC Zero ReceiptClaim · main commit 164c64bb" citeKey={3} type="code" href={CLAIM}>
              <p><strong>문제:</strong> Execution의 pre·post·exit·input·output을 하나의 stable digest로 표현합니다.</p>
              <p><strong>직접 적용:</strong> 설명용 축약식을 실제 tagged struct field order와 Halted(0) expected claim에 맞췄습니다.</p>
              <p><strong>근거 범위:</strong> 고정 commit의 ReceiptClaim data model과 digest 구현입니다.</p>
              <p><strong>말하지 않는 것:</strong> Claim type 자체가 guest business logic·외부 assumptions·input provenance를 자동 검증한다고 말하지 않습니다.</p>
            </CitationBlock>
          </div>

          <p className="text-sm text-muted-foreground">
            고정 source는 package version <code>5.0.0</code>을 표시하는 2026-10-26 main commit입니다.
            Moving main과 stable release를 같은 것으로 취급하지 않습니다. 배포할 때는 exact commit,
            Cargo.lock, Rust toolchain, guest ELF·ImageID, verifier parameters와 journal schema를 함께
            보관해야 합니다.
          </p>
        </section>
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={currentCodeRefs}
        fileTrees={{ risc0: currentRisc0Tree }}
        projectMetas={{
          risc0: {
            id: "risc0",
            label: "RISC Zero · Rust · main 164c64bb",
            badgeClass: "border-sky-500 bg-sky-500/10 text-sky-700",
          },
        }}
      />
    </>
  );
}
