import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { FilecoinProofStackViz } from "./FilecoinProofStackViz";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { filProofsTree } from "./fileTree";

const RFP =
  "https://github.com/filecoin-project/rust-fil-proofs/tree/d451d23ba6dcabd107e66b2f9c6531887b17fd3d/filecoin-proofs/src/api";
const SEAL =
  "https://github.com/filecoin-project/rust-fil-proofs/blob/d451d23ba6dcabd107e66b2f9c6531887b17fd3d/filecoin-proofs/src/api/seal.rs";
const POS_SPEC =
  "https://github.com/filecoin-project/specs/tree/a95002835b34d4042c007feda3fecf5e68e79dfa/content/algorithms/pos";

export default function ModernFilecoinProofs() {
  const sidebar = useCodeSidebar();
  return (
    <>
      <article className="space-y-14">
        <section id="overview" className="space-y-6">
          <header className="space-y-3">
            <p className="text-sm font-semibold text-primary">
              한 테스트 sector를 처음 seal한 뒤 다음 challenge까지
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              PoRep와 PoSt는 서로 다른 시간의 질문입니다
            </h2>
          </header>
          <p className="text-lg leading-8 text-foreground/90">
            같은 sector를 대상으로 해도 질문이 다르면 증명도 달라집니다. PoRep는
            “이 provider가 이 data로 전용 replica를 만들었는가?”에 답합니다.
            PoSt는 새 randomness로 “지금도 그 replica를 가지고 있는가?”를
            묻습니다.
          </p>
          <p className="text-lg leading-8 text-foreground/90">
            PoSt 안에서도 WindowPoSt는 정해진 deadline의 보관 상태를 점검하고,
            WinningPoSt는 한 epoch의 block 후보 자격에 쓰입니다. 따라서 셋을
            하나의 proof API에 옵션만 바꿔 넣어서는 안 됩니다.
          </p>
          <p className="text-lg leading-8 text-foreground/90">
            <a
              className="text-primary hover:underline"
              href="/cs/blockchain/pos-theory"
            >
              저장 증명 이론 글
            </a>
            은 각 질문의 암호학적 뜻을 설명합니다.{" "}
            <a
              className="text-primary hover:underline"
              href="/cs/gpu/filecoin-gpu-proofs"
            >
              GPU proof pipeline 글
            </a>
            은 phase artifact·parameter cache·deadline 측정을 다룹니다. 이 글은{" "}
            <code>rust-fil-proofs</code>에서 세 질문이 config, API, phase
            output, verifier로 갈라지는 구현 경계에 집중합니다.
          </p>
          <FilecoinProofStackViz />
          <ContentBoundary article="filecoin-proofs" />
        </section>

        <section id="proof-profile" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              01 · 질문에 맞는 API 고르기
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              세 증명을 왜 서로 다른 API로 보내야 할까요?
            </h2>
          </header>
          <p>
            PoRep는 원본 data에서 replica를 만든 관계입니다. WindowPoSt는
            deadline snapshot의 보관 상태를 확인하고, WinningPoSt는 한 epoch의
            block 후보 자격에 쓰입니다. 같은 Merkle path와 SNARK를 쓴다고
            statement를 바꾸어 쓸 수는 없습니다.
          </p>
          <p>
            Router receipt에는 registered proof type, sector size, API feature,
            parameter manifest를 남깁니다. Provider·sector identity, randomness
            domain, code revision도 함께 기록합니다.
          </p>
          <div className="not-prose flex flex-wrap gap-3">
            <CodeViewButton
              label="generate_window_post_sector_proofs()"
              onClick={() =>
                sidebar.open("window-post", codeRefs["window-post"])
              }
            />
          </div>
          <ExplainedFormula
            question="Proof kind를 어느 API로 보내야 할까?"
            idea={
              <>
                Claim과 config type을 먼저 맞춘 뒤 exact entrypoint를 고릅니다.
              </>
            }
            formula={String.raw`R(k)=\begin{cases}seal_*&,k=PoRep\\window\_post&,k=WindowPoSt\\winning\_post&,k=WinningPoSt\end{cases}`}
            annotatedFormula={String.raw`R(k)=\begin{cases}\underbrace{seal_*}_{\text{PC1·PC2·C1·C2}}&,k=PoRep\\\underbrace{window\_post}_{\text{deadline 유지}}&,k=WindowPoSt\\\underbrace{winning\_post}_{\text{block eligibility}}&,k=WinningPoSt\end{cases}`}
            operations={[
              {
                expression: String.raw`seal_*`,
                annotation: [
                  "k=PoRep: 원본 data→replica 관계.",
                  "PC1·PC2·C1·C2 entrypoint로 보냄",
                ],
              },
              {
                expression: String.raw`window\_post`,
                annotation: [
                  "k=WindowPoSt: deadline snapshot",
                  "sector들의 storage maintenance.",
                  "WindowPoStConfig와 짝이 맞아야 함",
                ],
              },
              {
                expression: String.raw`winning\_post`,
                annotation: [
                  "k=WinningPoSt: 한 epoch block",
                  "생산 eligibility 입력. Window config를",
                  "여기 넣으면 다른 statement라 거절",
                ],
              },
            ]}
            terms={[
              {
                symbol: "R",
                name: "API router",
                description:
                  "승인된 proof job을 concrete API family로 보냅니다.",
              },
              {
                symbol: "k",
                name: "Proof kind",
                description:
                  "Job이 증명하려는 PoRep, WindowPoSt, WinningPoSt claim입니다.",
              },
              {
                symbol: "seal_*",
                name: "Seal phases",
                description: "PC1·PC2·C1·C2 계열 entrypoints입니다.",
              },
              {
                symbol: "window_post",
                name: "Window API",
                description:
                  "Deadline sectors의 maintenance proof entrypoints입니다.",
              },
              {
                symbol: "winning_post",
                name: "Winning API",
                description:
                  "Election challenge sectors의 proof entrypoints입니다.",
              },
            ]}
            assumptions={[
              "Config type, registered proof version과 parameter manifest가 같은 profile을 가리킵니다.",
              "Unknown type과 kind/config mismatch는 dispatch 전에 거절합니다.",
            ]}
            interpretation="WindowPoStConfig를 winning_post에 넣는 것은 단순 옵션 오류가 아니라 다른 statement를 요청한 것이므로 fail-closed해야 합니다."
          />
          <div id="paper-rust-fil-proofs-api">
            <CitationBlock
              type="code"
              citeKey={1}
              source="rust-fil-proofs API · commit d451d23"
              href={RFP}
            >
              <p>
                <strong>문제:</strong> Filecoin의 여러 proof claims를 stable
                public API와 typed configs로 분리해야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> Pinned API directory는 seal,
                WindowPoSt, WinningPoSt generation·verification entrypoints와
                common types를 제공합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> commit d451d23의 registered proof
                types, parameters, dependencies와 features를 함께 고정합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> 고정한 rust-fil-proofs public API
                source snapshot입니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> API 존재가 현재 network
                activation, parameter provenance, fixed performance나 retrieval
                SLA를 보장하지 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="phase-envelope" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              02 · 단계 결과 이어 붙이기
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              파일 이름이 같아도 같은 proof 작업이라고 할 수 있을까요?
            </h2>
          </header>
          <p>
            PC1 labels를 다른 sector의 PC2에 넣거나, 오래된 parameter cache로
            proof를 만들면 type 이름만 같아도 같은 작업이 아닙니다. Envelope에는
            앞 단계 artifact digest, output schema와 digest, cache file·size를
            넣습니다.
          </p>
          <p>
            Proof config, sector와 provider identity, randomness epoch와 domain,
            binary revision, 완료 상태도 함께 기록합니다. 기존{" "}
            <a
              className="text-primary hover:underline"
              href="/cs/gpu/filecoin-gpu-proofs#phase-chain"
            >
              phase artifact chain 글
            </a>
            의 원칙을 실제 Rust output에 적용하는 경계입니다.
          </p>
          <div className="not-prose flex flex-wrap gap-3">
            <CodeViewButton
              label="StackedGraph"
              onClick={() =>
                sidebar.open("stacked-graph", codeRefs["stacked-graph"])
              }
            />
            <CodeViewButton
              label="PC1 — labeling"
              onClick={() => sidebar.open("seal-pc1", codeRefs["seal-pc1"])}
            />
            <CodeViewButton
              label="PC2 — TreeC/TreeR"
              onClick={() => sidebar.open("seal-pc2", codeRefs["seal-pc2"])}
            />
            <CodeViewButton
              label="C2 — Groth16 SNARK"
              onClick={() => sidebar.open("seal-c2", codeRefs["seal-c2"])}
            />
          </div>
          <ExplainedFormula
            question="Phase output identity를 어떻게 만들까?"
            idea={
              <>
                Profile과 모든 transitive inputs, output, cache manifest를
                canonical digest로 묶습니다.
              </>
            }
            formula={String.raw`J_i=H(P\|J_{i-1}\|H(I_i)\|H(O_i)\|H(C_i)\|v)`}
            annotatedFormula={String.raw`J_i=H(\underbrace{P}_{\text{proof profile}}\|\underbrace{J_{i-1}}_{\text{직전 phase receipt}}\|\underbrace{H(I_i)\|H(O_i)}_{\text{입력·출력 digest}}\|\underbrace{H(C_i)}_{\text{cache manifest}}\|\underbrace{v}_{\text{revision}})`}
            operations={[
              {
                expression: String.raw`P\|J_{i-1}`,
                annotation: [
                  "proof type·sector·parameter identity와",
                  "바로 앞 phase의 admitted receipt.",
                  "다른 sector의 PC1을 PC2에 못 넣음",
                ],
              },
              {
                expression: String.raw`H(I_i)\|H(O_i)`,
                annotation: [
                  "typed 입력과 labels·commitments·",
                  "proof bytes 같은 출력의 digest",
                ],
              },
              {
                expression: String.raw`H(C_i)\|v`,
                annotation: [
                  "cache file 이름·크기·digest와 binary",
                  "revision. stale parameter cache면",
                  "output이 같아 보여도 J_i가 달라짐",
                ],
              },
            ]}
            terms={[
              {
                symbol: "J_i",
                name: "Phase artifact id",
                description: "i번째 API phase output receipt입니다.",
              },
              {
                symbol: "P",
                name: "Proof profile",
                description: "Proof type, sector/API/parameter identity입니다.",
              },
              {
                symbol: "J_{i-1}",
                name: "Upstream artifact",
                description: "바로 앞 phase의 admitted receipt입니다.",
              },
              {
                symbol: "I_i",
                name: "Phase inputs",
                description:
                  "Public/private typed inputs의 canonical encoding입니다.",
              },
              {
                symbol: "O_i",
                name: "Phase output",
                description:
                  "Labels, commitments, vanilla inputs 또는 proof bytes입니다.",
              },
              {
                symbol: "C_i",
                name: "Cache manifest",
                description: "File names, sizes와 content digests입니다.",
              },
              {
                symbol: "v",
                name: "Revision",
                description: "Binary/source/schema version입니다.",
              },
            ]}
            assumptions={[
              "모든 fields는 type·length가 고정된 canonical encoding입니다.",
              "Digest는 cache contents의 semantic validation이나 proof verification을 대신하지 않습니다.",
            ]}
            interpretation="Output bytes가 같아 보여도 parameter manifest나 upstream sector artifact가 다르면 Ji가 달라야 합니다."
          />
        </section>

        <section id="verification-router" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              03 · 원래 문제로 다시 검증하기
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Proof bytes만 맞으면 통과시켜도 될까요?
            </h2>
          </header>
          <p>
            Verifier는 proof 길이만 보지 않습니다. 원래 질문을 다음처럼 다시
            만듭니다.
          </p>
          <ul className="grid gap-3 sm:grid-cols-3">
            <li className="rounded-lg border border-border p-4">
              <strong>PoRep</strong>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                CommD·CommR·provider·sector·randomness와 config를 묶습니다.
              </p>
            </li>
            <li className="rounded-lg border border-border p-4">
              <strong>PoSt</strong>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Randomness·provider·sector IDs·CommR와 PoSt type을 묶습니다.
              </p>
            </li>
            <li className="rounded-lg border border-border p-4">
              <strong>Aggregate proof</strong>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Public input 순서와 aggregation profile까지 고정합니다.
              </p>
            </li>
          </ul>
          <p>
            Decode, statement 구성, parameter와 verification key 승인, 암호학적
            검증이 모두 성공해야 비로소 proof receipt를 승인합니다.
          </p>
          <div className="not-prose flex flex-wrap gap-3">
            <CodeViewButton
              label="FallbackPoSt PublicInputs"
              onClick={() =>
                sidebar.open("fallback-vanilla", codeRefs["fallback-vanilla"])
              }
            />
          </div>
          <ExplainedFormula
            question="Proof 승인을 Boolean 경계로 쓰면 무엇이 필요한가?"
            idea={
              <>
                Profile, canonical decode, expected statement와 verifier 성공을
                AND로 결합합니다.
              </>
            }
            formula={String.raw`A=P_{ok}\land D_{ok}\land S_{expected}\land V(\pi,S,P)`}
            annotatedFormula={String.raw`A=\underbrace{P_{ok}}_{\text{profile·VK 허용}}\land\underbrace{D_{ok}}_{\text{canonical decode}}\land\underbrace{S_{expected}}_{\text{요청과 같은 statement}}\land\underbrace{V(\pi,S,P)}_{\text{암호학적 verify}}`}
            operations={[
              {
                expression: String.raw`P_{ok}\land D_{ok}`,
                annotation: [
                  "proof type·parameters·VK·revision이",
                  "allowlist에 있고 length·field/group",
                  "encoding이 유효해야 다음 단계",
                ],
              },
              {
                expression: String.raw`S_{expected}`,
                annotation: [
                  "CommD·CommR·prover/sector·randomness,",
                  "PoSt면 challenged sector 순서까지",
                  "요청과 일치. 다른 sector 순서면 0",
                ],
              },
              {
                expression: String.raw`V(\pi,S,P)`,
                annotation: [
                  "profile P의 verifier로 π와 S 검사.",
                  "통과해도 deadline inclusion은 별개",
                ],
              },
            ]}
            terms={[
              {
                symbol: "A",
                name: "Acceptance",
                description: "Proof receipt를 승인하면 1입니다.",
              },
              {
                symbol: "P_{ok}",
                name: "Profile admission",
                description:
                  "Proof type·parameters·VK·revision이 허용되면 1입니다.",
              },
              {
                symbol: "D_{ok}",
                name: "Canonical decode",
                description:
                  "Length와 field/group encoding이 유효하면 1입니다.",
              },
              {
                symbol: "S_{expected}",
                name: "Expected statement",
                description:
                  "요청의 identities, commitments, randomness와 order가 일치하면 1입니다.",
              },
              {
                symbol: "V",
                name: "Verifier",
                description:
                  "Profile P에서 proof π와 statement S를 검사합니다.",
              },
              {
                symbol: String.raw`\pi`,
                name: "Proof bytes",
                description: "검증할 canonical proof입니다.",
              },
            ]}
            assumptions={[
              "Application이 expected statement를 신뢰 가능한 job/chain state에서 구성합니다.",
              "Cryptographic verify 성공만으로 deadline inclusion이나 service availability가 완료되지는 않습니다.",
            ]}
            interpretation="Valid proof라도 다른 sector order나 randomness로 만든 statement라면 Sexpected=0이어서 거절합니다."
          />
          <div id="paper-rust-fil-proofs-seal">
            <CitationBlock
              type="code"
              citeKey={2}
              source="rust-fil-proofs seal API · commit d451d23"
              href={SEAL}
            >
              <p>
                <strong>문제:</strong> Typed PoRep phase outputs와 proof bytes를
                생성하고 expected public inputs로 검증해야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> Pinned source는 PC1/PC2/C1/C2,
                commitment checks, NI-PoRep aggregation과 verification
                entrypoints를 구현합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> Exact commit의 tree type,
                PoRepConfig, parameter cache와 ordered aggregation inputs를
                사용합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> rust-fil-proofs의 seal/verification
                orchestration source에 한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> Source가 ceremony trust,
                all-network activation, GPU speedup이나 모든 hostile parser
                안전을 보장하지 않습니다.
              </p>
            </CitationBlock>
          </div>
          <div id="paper-filecoin-pos-spec">
            <CitationBlock
              type="code"
              citeKey={3}
              source="Filecoin proof-of-storage spec · commit a950028"
              href={POS_SPEC}
            >
              <p>
                <strong>문제:</strong> PoRep와 PoSt가 각각 어떤 storage
                statement를 증명하는지 분리해야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> Pinned specification source는 PoRep
                replica relation과 PoSt/Window/Winning claim의 protocol
                boundary를 설명합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> Network-version-specific actor
                rules와 parameters는 별도 pinned implementation에서 확인합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> Filecoin proof-of-storage protocol
                definitions에 한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> Spec description이 current Lotus
                scheduler, PDP, retrieval success나 고정 timing을 뜻하지
                않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="release-gate" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              04 · 운영에 넣기 전 확인
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Proof stack의 새 버전을 언제 채택할까요?
            </h2>
          </header>
          <p>
            성공 사례만으로는 새 버전을 채택하지 않습니다. Claim별로 한 조건씩
            틀린 표본을 넣습니다.
          </p>
          <ul className="grid gap-3 sm:grid-cols-3">
            <li className="rounded-lg border border-border p-4">
              <strong>PoRep</strong>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                CommD·CommR·sector·ticket·cache 중 하나를 바꿉니다.
              </p>
            </li>
            <li className="rounded-lg border border-border p-4">
              <strong>WindowPoSt</strong>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Deadline·randomness·sector snapshot·skip을 바꿉니다.
              </p>
            </li>
            <li className="rounded-lg border border-border p-4">
              <strong>WinningPoSt</strong>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Epoch·proof type·sector count를 바꿉니다.
              </p>
            </li>
          </ul>
          <p>각 표본이 거절되는지 독립 verifier로 다시 확인합니다.</p>
          <p>
            Cold·warm parameter load, I/O, vanilla proof, SNARK, verification,
            queue, peak memory를 같은 profile에서 기록합니다. 후보 binary가
            실패하면 이전 binary, parameter manifest, verification key
            allowlist로 되돌립니다.
          </p>
          <ExplainedFormula
            question="Proof stack의 end-to-end 완료 시간은 어떻게 기록할까?"
            idea={
              <>
                실제 critical path를 wall time으로 두고 stage ledger와 함께
                보고합니다.
              </>
            }
            formula={String.raw`T_{job}=T_{admit}+T_{io}+T_{vanilla}+T_{snark}+T_{verify}+T_{queue}`}
            annotatedFormula={String.raw`T_{job}=\underbrace{T_{admit}}_{\text{profile·cache 확인}}+\underbrace{T_{io}}_{\text{replica·tree 읽기}}+\underbrace{T_{vanilla}+T_{snark}}_{\text{Merkle path·circuit}}+\underbrace{T_{verify}}_{\text{독립 verify}}+\underbrace{T_{queue}}_{\text{scheduler 대기}}`}
            operations={[
              {
                expression: String.raw`T_{admit}+T_{io}`,
                annotation: [
                  "profile·parameters·inputs·cache 확인과",
                  "replica/tree/cache read-write.",
                  "GPU kernel이 빨라져도 I/O가 늘면 상쇄",
                ],
              },
              {
                expression: String.raw`T_{vanilla}+T_{snark}`,
                annotation: [
                  "labels·Merkle path 처리와",
                  "circuit proof 생성 또는 aggregation",
                ],
              },
              {
                expression: String.raw`T_{verify}+T_{queue}`,
                annotation: [
                  "expected statement의 independent",
                  "verify와 resource admission 대기.",
                  "overlap은 critical path로 따로 기록",
                ],
              },
            ]}
            terms={[
              {
                symbol: "T_{job}",
                name: "Job completion time",
                description:
                  "Admission부터 verified receipt까지의 wall time입니다.",
              },
              {
                symbol: "T_{admit}",
                name: "Admission",
                description:
                  "Profile, parameters, inputs와 cache 확인 시간입니다.",
              },
              {
                symbol: "T_{io}",
                name: "I/O",
                description: "Replica/tree/cache read-write 시간입니다.",
              },
              {
                symbol: "T_{vanilla}",
                name: "Vanilla proof",
                description:
                  "Labels, Merkle paths와 vanilla proof 처리 시간입니다.",
              },
              {
                symbol: "T_{snark}",
                name: "SNARK",
                description: "Circuit proof 생성 또는 aggregation 시간입니다.",
              },
              {
                symbol: "T_{verify}",
                name: "Verification",
                description:
                  "Expected statement의 independent verify 시간입니다.",
              },
              {
                symbol: "T_{queue}",
                name: "Queue",
                description:
                  "Resource admission과 scheduler waiting time입니다.",
              },
            ]}
            assumptions={[
              "Overlapped stages는 단순 합산 대신 wall-clock critical path도 함께 기록합니다.",
              "같은 claim/profile/input distribution과 cold/warm 조건만 비교합니다.",
            ]}
            interpretation="GPU kernel만 빨라져도 I/O나 queue가 늘면 Tjob은 줄지 않을 수 있습니다. Proof type마다 deadline 목적이 달라 한 숫자로 섞지 않습니다."
          />
          <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground">
            <strong className="text-foreground">Article-only 10/10:</strong> 세
            claim, config dispatch, phase envelope, cache/profile identity,
            expected statement, aggregation order, negative fixtures, stage/e2e
            측정과 rollback을 이 글만으로 답할 수 있습니다.
          </aside>
        </section>
      </article>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ "rust-fil-proofs": filProofsTree }}
        projectMetas={{
          "rust-fil-proofs": {
            id: "rust-fil-proofs",
            label: "rust-fil-proofs · Rust",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </>
  );
}
