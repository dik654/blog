import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  currentCodeRefs,
  SCROLL_ZKVM_COMMIT,
  SCROLL_ZKVM_VERSION,
} from "./currentCodeRefs";
import { currentScrollTree } from "./currentFileTree";
import { ScrollProofViz } from "./ScrollProofViz";

const SOURCE = `https://github.com/scroll-tech/zkvm-prover/tree/${SCROLL_ZKVM_COMMIT}`;
const CHUNK_SOURCE = `https://github.com/scroll-tech/zkvm-prover/blob/${SCROLL_ZKVM_COMMIT}/crates/types/chunk/src/scroll/execute.rs`;
const VERIFIER_SOURCE = `https://github.com/scroll-tech/zkvm-prover/blob/${SCROLL_ZKVM_COMMIT}/crates/verifier/src/verifier.rs`;
const DOCS = "https://docs.scroll.io/en/technology/zkevm/intro-to-zkevm/";
const EUCLID = "https://docs.scroll.io/en/technology/overview/scroll-upgrades/euclid-upgrade/";
const COORDINATOR = "https://github.com/scroll-tech/scroll/blob/develop/docs/prover-coordinator-overview.md";
const ARCHIVED = "https://github.com/scroll-tech/zkevm-circuits";

export default function ModernArticle() {
  const sidebar = useCodeSidebar();
  const openSource = (key: string) => sidebar.open(key, currentCodeRefs[key]);

  return (
    <>
      <article className="space-y-14 [overflow-wrap:anywhere]">
        <section id="overview" className="space-y-6 scroll-mt-20">
          <header className="space-y-3">
            <p className="text-sm font-semibold text-primary">한 문장으로 먼저 답하기</p>
            <h2 className="max-w-4xl break-keep text-3xl font-bold tracking-tight">
              현재 Scroll은 상태 전이를 계층형 proof로 L1에 증명합니다
            </h2>
          </header>

          <p className="text-lg leading-8 text-foreground/90">
            한 chunk의 실행 전 상태를 <code>S₀</code>, 실행 후 상태를 <code>S₁</code>이라고 하겠습니다.
            현재 Scroll의 chunk guest는 블록 witness를 고정 hard fork 규칙으로 다시 실행해
            <code>S₀→S₁</code>을 계산합니다. 이어서 state roots, transaction data, L1 message queue와
            block contexts를 한 public-input hash로 공개하고, OpenVM proof가 이 guest 실행을 인증합니다.
          </p>
          <p>
            여러 chunk proof는 batch proof로, 여러 batch proof는 bundle proof로 집계됩니다. 마지막
            bundle root proof는 Ethereum 계약이 확인할 수 있는 SNARK로 바뀝니다.
          </p>
          <p>
            그래서 이 글의 결론은 “ADD 한 줄을 Halo2 gate로 검사한다”가 아닙니다. <strong>고정 fork의 전체 상태
            전이와 공개 statement, child proof의 정체성과 연속성을 마지막 verifier까지
            끊기지 않게 묶는다</strong>가 현재 구조의 핵심입니다.
          </p>

          <ScrollProofViz />
          <ContentBoundary article="scroll-zkevm" />

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              ["실행 입력", "ChunkWitness", "blocks·이전 queue hash·fork와 실행에 필요한 state/code 자료"],
              ["공개 statement", "32-byte PI hash", "state roots·data·queue·block contexts를 version별 순서로 hash"],
              ["최종 검증", "Bundle EVM proof", "허용한 guest·VM commitments와 bundle public input을 L1에서 확인"],
            ].map(([eyebrow, title, body]) => (
              <article key={eyebrow} className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-primary">{eyebrow}</p>
                <h3 className="mt-2 break-words font-mono text-sm font-black">{title}</h3>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="migration" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">01 · 먼저 현재 구조와 과거 구조를 분리하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Opcode별 Halo2 회로 설명은 역사이고, Euclid 이후의 현재 증명기는 OpenVM입니다
            </h2>
          </header>

          <p>
            Scroll은 2021–2024년에 EVM opcode마다 전용 circuit과 table을 만든 custom Halo2 zkEVM을
            사용했습니다. 이때는 ADD row, RW table, bytecode lookup을 따라가는 설명이 현재 구현을
            이해하는 올바른 출발점이었습니다.
          </p>
          <p>
            그러나 2025년 Euclid upgrade에서 이 회로를
            deprecate하고 general-purpose RISC-V zkVM인 OpenVM 기반 prover로 옮겼습니다. 이전
            <code>zkevm-circuits</code> 저장소도 2025년 4월 archive되었고 새 저장소로의 이전을
            명시합니다.
          </p>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">구분</th><th className="p-3">과거 custom zkEVM</th><th className="p-3">현재 OpenVM prover</th></tr>
              </thead>
              <tbody>
                {[
                  ["실행 규칙", "opcode별 Halo2 gadget·table", "Rust 실행 검증 코드를 RISC-V guest로 실행"],
                  ["한 step의 설명", "ADD gate·RW lookup", "sbv verifier가 선택 fork로 block witness 재실행"],
                  ["제약 크기", "회로 capacity checker 필요", "일반 program 실행으로 복잡한 transaction 지원"],
                  ["현재성", "archived historical source", `${SCROLL_ZKVM_VERSION} · ${SCROLL_ZKVM_COMMIT.slice(0, 8)} pinned source`],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            다만 “Halo2가 완전히 사라졌다”도 틀립니다. 현재 source에서 최종 EVM proof는 OpenVM root
            proof를 감싼 Halo2 SNARK입니다. 과거의 <em>EVM opcode 전용 Halo2 회로</em>와 현재의
            <em>온체인 검증용 SNARK wrapper</em>는 같은 단어를 쓰지만 역할이 다릅니다.
          </p>
        </section>

        <section id="black-box" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">02 · 이름보다 입출력을 먼저 보기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Chunk guest는 block witness를 받아 상태 전이의 digest를 공개합니다
            </h2>
          </header>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">주체</th><th className="p-3">받는 것</th><th className="p-3">확인하거나 내놓는 것</th></tr>
              </thead>
              <tbody>
                {[
                  ["Coordinator", "rollup DB의 chunk·batch·bundle task", "fork·VK·identifier가 붙은 proving task"],
                  ["Chunk guest", "blocks·state/code·fork·queue hash", "재실행한 ChunkInfo와 PI hash"],
                  ["Batch guest", "chunk proofs와 chunk infos", "child identity·PI hash·연속성을 확인한 batch proof"],
                  ["Bundle guest", "batch proofs와 batch infos", "첫 이전 상태부터 마지막 이후 상태까지의 bundle proof"],
                  ["L1 verifier", "EVM proof·trusted verifier/VK·public input", "검증 성공 뒤 bundle state transition 최종화"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            여기서 중요한 구분은 witness와 public input입니다. Witness에는 실행을 다시 만드는 데
            필요한 block·state·code 자료가 들어갑니다. 반면 verifier가 확인하는 공개 statement는
            그 실행에서 나온 <code>ChunkInfo</code>를 fork별 순서로 직렬화한 32-byte hash입니다.
          </p>
        </section>

        <section id="case" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">03 · 같은 작은 사례를 마지막까지 유지하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              한 chunk가 S₀·Q₀에서 S₁·Q₁로 바뀌는 사례를 추적합니다
            </h2>
          </header>

          <p>
            예시 chunk에는 한 개 이상의 L2 block이 있고, 그 안에는 계정 잔액이나 contract storage를
            바꾸는 transaction이 있다고 하겠습니다. <code>S₀</code>는 첫 block 실행 전 Merkle-Patricia
            Trie root이고 <code>S₁</code>은 모든 block 실행 후 root입니다. <code>Q₀</code>와
            <code>Q₁</code>은 이 chunk 전후의 rolling L1 message queue hash입니다.
          </p>

          <AlgorithmBlock
            title="한 chunk가 public-input hash H₁이 되는 경로"
            input={[
              "ChunkWitness: blocks, states, codes, compression infos",
              "prev_state_root S₀가 block witness 안에 있음",
              "prev_msg_queue_hash Q₀",
              "version byte와 fork_name",
            ]}
            steps={[
              { code: "version ← Version::from(witness.version)", note: "version이 선택한 fork와 witness.fork_name이 다르면 거절합니다." },
              { code: "chain_spec ← hardfork(witness.fork_name)", note: "GalileoV2 예시는 그 fork의 EVM 규칙을 선택합니다." },
              { code: "result ← verifier::run(blocks, chain_spec, compression_infos)", note: "블록을 재실행해 S₀, S₁, withdrawal root를 얻습니다." },
              { code: "Dtx, Q₁, blockCtxs ← derive(executed blocks)", note: "L2 tx data digest와 L1 message queue, block context를 계산합니다." },
              { code: "H₁ ← Keccak256(encode_versioned(ChunkInfo))", note: "정해진 필드와 순서의 digest만 OpenVM public values로 공개합니다." },
            ]}
            output="Chunk STARK가 인증할 public value H₁"
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Chunk guest의 read→validate→reveal" onClick={() => openSource("scroll-chunk-guest")} />
            <CodeViewButton label="Version·fork와 ChunkInfo 경계" onClick={() => openSource("scroll-chunk-validate")} />
          </div>
        </section>

        <section id="chunk-execution" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">04 · 상태 root를 믿지 않고 다시 계산하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              sbv verifier가 fork 규칙으로 block witness를 실행해 S₀와 S₁을 만듭니다
            </h2>
          </header>

          <p>
            <code>ChunkInfo::try_from(witness)</code>는 단순한 형 변환이 아닙니다. 실제로
            <code>execute</code>를 호출하고, witness의 fork 이름을 Euclid·Feynman·Galileo 계열
            hard fork에 매핑한 뒤 <code>verifier::run</code>으로 블록들을 실행합니다. 실행이 실패하면
            public input도 만들지 못합니다.
          </p>

          <p>
            이때 transaction bytes digest, legacy data hash 여부, rolling message queue hash도 실행된
            blocks에서 파생됩니다. 즉 요청자가 <code>S₁</code>이나 <code>Q₁</code>을 임의로 적어
            넣고 proof만 만들 수 있는 인터페이스가 아닙니다. 고정 guest가 witness에서 다시 만든 값이
            statement의 재료가 됩니다.
          </p>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="실제 fork 선택과 block 재실행" onClick={() => openSource("scroll-chunk-execute")} />
          </div>
        </section>

        <section id="public-input" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">05 · 공개 hash에 어떤 의미가 들어 있는지 풀기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              H₁은 roots·data·queue·block context를 함께 묶습니다
            </h2>
          </header>

          <ExplainedFormula
            question="Galileo 계열 chunk proof의 공개값 H₁에는 무엇이 들어 있나요?"
            idea="실행 결과를 version별 고정 순서로 직렬화하고 Keccak-256을 적용합니다. 아래 기호는 실제 pi_galileo 필드를 읽기 쉽게 묶은 것입니다."
            formula={String.raw`H_1=\operatorname{Keccak256}(v\|c\|S_0\|S_1\|W\|D_{tx}\|Q_0\|Q_1\|n_0\|B_1\|\cdots\|B_k)`}
            annotatedFormula={String.raw`\underbrace{H_1}_{\text{OpenVM public value}}=\operatorname{Keccak256}(\underbrace{v\|c}_{\text{fork version·chain}}\|\underbrace{S_0\|S_1\|W}_{\text{state·withdraw roots}}\|\underbrace{D_{tx}}_{\text{L2 tx bytes}}\|\underbrace{Q_0\|Q_1}_{\text{L1 message queue}}\|\underbrace{n_0\|B_1\|\cdots\|B_k}_{\text{first block·contexts}})`}
            operations={[
              { expression: String.raw`v\|c\|S_0\|S_1`, annotation: ["같은 roots라도 fork version·chain이 다르면 다른 bytes", "field order도 statement의 일부"] },
              { expression: String.raw`D_{tx}\|Q_0\|Q_1`, annotation: ["실행한 L2 transaction data", "chunk 전후 L1 message queue 연결"] },
              { expression: String.raw`n_0\|B_1\|\cdots\|B_k`, annotation: ["첫 block number", "각 block의 timestamp·base fee·gas limit·tx counts"] },
              { expression: String.raw`\operatorname{Keccak256}(\cdot)`, annotation: ["OpenVM에 공개되는 값은 32 bytes", "원문 fields는 witness와 coordinator가 함께 보관"] },
            ]}
            terms={[
              { symbol: "v,c", name: "Version·chain", description: "증명한 fork schema와 EIP-155 chain을 고정합니다." },
              { symbol: "S₀,S₁,W", name: "State·withdraw roots", description: "실행 전후 상태와 마지막 withdrawal commitment입니다." },
              { symbol: "D_tx", name: "Transaction data digest", description: "모든 L2 transaction bytes에서 계산합니다." },
              { symbol: "Q₀,Q₁", name: "Message queue hashes", description: "L1 message processing의 chunk 전후 연결점입니다." },
              { symbol: "Bᵢ", name: "BlockContextV2", description: "timestamp, base fee, gas limit, 전체·L1 message transaction 수를 담습니다." },
            ]}
            assumptions={[
              "이 식은 pinned source의 Galileo/GalileoV2 encoding을 설명합니다. EuclidV1·EuclidV2·Validium은 분기별 field layout이 다릅니다.",
              "연결 기호는 byte concatenation이며 각 정수와 root의 byte order·길이는 source가 정합니다.",
              "Hash collision resistance는 field 의미 검증을 대신하지 않습니다. 의미는 guest 실행과 versioned schema가 만듭니다.",
            ]}
            interpretation="S₁ 하나만 바뀌어도 H₁이 달라지지만, tx data나 Q₁, block context 하나만 바뀌어도 역시 다른 statement입니다. 따라서 ‘post-state root proof’라고만 부르면 공개 계약을 너무 좁게 설명한 것입니다."
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="ChunkInfo와 Galileo 직렬화" onClick={() => openSource("scroll-chunk-public-input")} />
          </div>
        </section>

        <section id="chunk-proof" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">06 · 같은 H₁이라도 guest가 다르면 다른 proof</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Chunk STARK는 public input뿐 아니라 EXE·VM commitments에 속합니다
            </h2>
          </header>

          <p>
            OpenVM proof의 program identity는 두 부분입니다. <code>EXE commitment</code>는 실행한 guest
            program을, <code>VM commitment</code>는 그 program이 실행된 VM configuration을 가리킵니다.
            같은 H₁을 공개하는 다른 program proof를 Scroll chunk proof로 받아들이면 안 되므로, parent
            aggregation guest와 최종 verifier는 예상 commitments를 고정합니다.
          </p>

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              ["H₁", "무슨 공개 statement인가", "roots·data·queue·block contexts의 digest"],
              ["EXE commit", "어떤 guest인가", "chunk·batch·bundle program binary의 identity"],
              ["VM commit", "어떤 zkVM 설정인가", "OpenVM execution/configuration identity"],
            ].map(([title, question, answer]) => (
              <article key={title} className="min-w-0 bg-background p-4">
                <p className="font-mono text-xs font-black text-primary">{title}</p>
                <p className="mt-2 break-keep text-[10px] font-bold">{question}</p>
                <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">{answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="batch-aggregation" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">07 · 유효한 child proof들을 연속된 batch로 만들기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Batch guest는 proof 정체성·PI hash·state 연결을 각각 검사합니다
            </h2>
          </header>

          <p>
            Child proof A와 B가 각각 유효해도 A가 chain X의 chunk이고 B가 chain Y의 chunk이거나,
            A의 post-state와 B의 pre-state가 다르면 같은 batch가 될 수 없습니다.
          </p>
          <p>
            그래서
            <code>AggCircuit</code>은 세 검사를 나눕니다. 먼저 child EXE·VM commitments를 확인하고,
            proof에서 공개한 32 bytes와 witness의 <code>ChunkInfo</code> hash를 대조한 뒤, 인접
            <code>ChunkInfo</code>의 연결을 확인합니다.
          </p>

          <AlgorithmBlock
            title="여러 chunk proof를 batch proof 하나로 접는 의사코드"
            input={[
              "chunk proofs P₁…Pₙ",
              "각 proof와 대응하는 ChunkInfo I₁…Iₙ",
              "빌드 때 고정한 chunk EXE_COMMIT·VM_COMMIT",
            ]}
            steps={[
              { code: "assert n ≥ 1", note: "빈 aggregation은 의미 있는 state transition이 아닙니다." },
              { code: "for Pᵢ: assert Pᵢ.commitment == expected_chunk_commitment", note: "다른 guest나 VM이 만든 유효 proof를 차단합니다." },
              { code: "for i: assert H(Iᵢ) == Pᵢ.public_values", note: "witness의 설명과 child proof의 실제 공개값을 연결합니다." },
              { code: "for adjacent Iᵢ,Iᵢ₊₁: validate(Iᵢ₊₁, Iᵢ)", note: "chain id, post→pre state root, message queue가 이어져야 합니다." },
              { code: "BatchInfo ← build(blob, chunk_infos, reference_header)", note: "DA blob과 batch header 관계를 검사해 parent→current batch statement를 만듭니다." },
              { code: "reveal H(BatchInfo)", note: "parent batch에서 현재 batch까지의 public-input hash를 공개합니다." },
            ]}
            output="고정 batch guest의 STARK proof와 BatchInfo hash"
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Child identity와 PI hash 검사" onClick={() => openSource("scroll-batch-circuit")} />
            <CodeViewButton label="인접 chunk 연속성 검사" onClick={() => openSource("scroll-aggregation-checks")} />
          </div>
        </section>

        <section id="continuity" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">08 · 집계가 단순한 proof 압축이 아닌 이유</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              각 child의 진실성과 child 사이의 연속성은 서로 다른 조건입니다
            </h2>
          </header>

          <ExplainedFormula
            question="Chunk A와 B를 같은 batch에 넣으려면 무엇이 같아야 하나요?"
            idea="A 자체와 B 자체가 각각 유효한 것에 더해, B의 시작점이 A의 끝점이어야 합니다. Message queue도 같은 방식으로 이어집니다."
            formula={String.raw`c_A=c_B,\qquad S_A^{post}=S_B^{prev},\qquad Q_A^{post}=Q_B^{prev}`}
            annotatedFormula={String.raw`\underbrace{c_A=c_B}_{\text{같은 chain}}\quad\land\quad\underbrace{S_A^{post}=S_B^{prev}}_{\text{state 연속성}}\quad\land\quad\underbrace{Q_A^{post}=Q_B^{prev}}_{\text{L1 message queue 연속성}}`}
            operations={[
              { expression: String.raw`c_A=c_B`, annotation: ["서로 다른 chain의 유효 proof를 섞지 않음"] },
              { expression: String.raw`S_A^{post}=S_B^{prev}`, annotation: ["A가 끝난 정확한 state에서 B가 시작", "한 root라도 다르면 거절"] },
              { expression: String.raw`Q_A^{post}=Q_B^{prev}`, annotation: ["L1 message 처리 순서를 건너뛰거나 중복하지 않음"] },
            ]}
            terms={[
              { symbol: "c", name: "Chain ID", description: "모든 chunk transaction이 속한 EIP-155 chain입니다." },
              { symbol: "S", name: "State root", description: "EVM world state MPT의 실행 전후 commitment입니다." },
              { symbol: "Q", name: "Message queue hash", description: "L1→L2 message processing 위치를 누적해 연결합니다." },
            ]}
            assumptions={[
              "각 child proof 자체의 STARK 검증과 expected program commitments 검사는 이미 통과해야 합니다.",
              "같은 version byte가 aggregation 전체에서 유지됩니다.",
              "Validium domain은 blockhash와 encryption key 연결 조건을 추가합니다.",
            ]}
            interpretation="A와 B가 각각 진짜여도 A.post≠B.prev이면 중간 상태를 건너뛴 두 개의 따로 유효한 증명일 뿐입니다. Aggregation은 압축과 동시에 이 연결 관계를 검증합니다."
          />
        </section>

        <section id="bundle" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">09 · 왜 batch 위에 bundle을 한 번 더 두는가</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Bundle은 여러 batch의 첫 시작과 마지막 결과를 L1 최종화 단위로 압축합니다
            </h2>
          </header>

          <p>
            Batch는 여러 chunk와 하나의 DA blob을 묶는 단위입니다. Bundle은 여러 batch proof를 다시
            집계해 L1에서 한 번에 최종화할 범위를 만듭니다. 실제 <code>BundleInfo::from</code>은 첫
            batch의 <code>parent_state_root</code>와 <code>parent_batch_hash</code>, 마지막 batch의
            <code>state_root</code>와 <code>batch_hash</code>, 마지막 withdrawal·message queue root를
            가져옵니다.
          </p>

          <p>
            이 계층이 있는 이유는 “더 강한 수학”이 필요해서가 아니라, 여러 batch의 proof verification
            비용을 한 최종화 transaction에 나누어 담기 위해서입니다. 대신 bundle을 만들 때도 batch
            guest commitments, 각 batch PI hash, 인접 batch의 state·batch hash·message queue
            연속성을 다시 확인해야 합니다.
          </p>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="첫 batch에서 마지막 batch까지" onClick={() => openSource("scroll-bundle-info")} />
          </div>
        </section>

        <section id="onchain-verifier" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">10 · 마지막 proof를 다른 circuit에 붙이지 못하게 하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              EVM verifier는 trusted app identity를 먼저 확인합니다
            </h2>
          </header>

          <p>
            최종 bundle proof는 EVM이 검증할 수 있는 SNARK 형식으로 만들어집니다. 그러나 SNARK
            수식이 맞는지만 확인하면 “어떤 guest와 어떤 OpenVM configuration의 proof인가”가 빠질 수
            있습니다. 현재 <code>UniversalVerifier::verify_evm_proof</code>는 proof가 들고 온
            <code>app_exe_commit</code>과 <code>app_vm_commit</code>을 trusted <code>vk</code>에서
            복원한 값과 먼저 비교합니다.
          </p>

          <p>
            두 commitment가 모두 맞은 뒤에야 EVM verifier bytecode를 실행합니다. 운영에서는 이
            expected VK와 verifier bytecode를 proof 제출자가 고르게 해서는 안 됩니다. 배포·governance
            경로가 허용한 circuit release와 on-chain verifier가 같은 identity를 가리켜야 합니다.
          </p>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="EVM proof의 EXE·VM binding" onClick={() => openSource("scroll-verifier-binding")} />
          </div>
        </section>

        <section id="runtime" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">11 · 회로 코드와 운영 pipeline을 구별하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Coordinator와 prover는 task·asset·검증을 나눕니다
            </h2>
          </header>

          <p>
            실제 서비스에서는 guest code만 실행되는 것이 아닙니다. Rollup services가 block을 chunk,
            batch, bundle로 묶어 PostgreSQL에 task를 기록하고, Go coordinator가 pending task를 prover에
            배분합니다.
          </p>
          <p>
            Rust prover는 fork 이름과 task type에 맞는 circuit assets와 VK를 가져와
            OpenVM proof를 만든 뒤 제출합니다. Coordinator는 <code>libzkp</code>를 통해 proof를 다시
            검증한 뒤 완료로 표시합니다.
          </p>

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
            {[
              ["01", "Rollup DB", "blocks→chunk→batch→bundle task"],
              ["02", "Coordinator", "pending task·fork·type 배분"],
              ["03", "Prover", "asset 다운로드·OpenVM prove"],
              ["04", "Coordinator/libzkp", "제출 proof 재검증·완료"],
            ].map(([number, title, body]) => (
              <article key={number} className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-black text-primary">{number}</p>
                <p className="mt-2 break-words text-xs font-black">{title}</p>
                <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>

          <p>
            따라서 <code>fork_name</code>, expected <code>vk</code>, task <code>identifier</code>는
            부가 metadata가 아닙니다. Prover와 coordinator가 다른 zkVM commit·Plonky3 commit·fork
            asset을 쓰면 같은 task를 해석하지 못합니다. Circuit release는 fork·proof type·VK까지
            함께 pin해야 합니다.
          </p>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton label="Coordinator↔prover task 구조" onClick={() => openSource("scroll-proving-task")} />
          </div>
        </section>

        <section id="boundary" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">12 · 증명이 끝나는 곳에서 운영 질문을 분리하기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Valid state transition은 DA·liveness·privacy와 같은 말이 아닙니다
            </h2>
          </header>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">질문</th><th className="p-3">이 proof가 확인</th><th className="p-3">별도 시스템 책임</th></tr>
              </thead>
              <tbody>
                {[
                  ["상태 전이가 맞는가", "고정 fork guest의 S₀→S₁ 실행", "없음: 핵심 proof statement"],
                  ["transaction data를 얻는가", "tx digest와 batch/blob 관계", "Ethereum DA·data retrieval"],
                  ["서비스가 계속 진행하는가", "해당 task가 만들어진 경우의 correctness", "sequencer·coordinator·prover liveness와 escape path"],
                  ["transaction이 비밀인가", "Validium 분기의 encrypted-input constraints 일부", "일반 Scroll transaction privacy는 별도"],
                  ["verifier upgrade가 안전한가", "현재 trusted commitments와 proof 일치", "governance·timelock·release provenance"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="release" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">13 · Source를 읽은 뒤 release gate로 닫기</p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              네 경계를 각각 깨뜨려 fail closed를 확인합니다
            </h2>
          </header>

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["실행", "wrong fork·invalid block·state/code 누락", "chunk guest가 거절"],
              ["statement", "S₁·Dtx·Q₁·block context 변조", "PI hash mismatch"],
              ["aggregation", "다른 child EXE/VM·끊긴 roots/queue", "batch·bundle guest가 거절"],
              ["verification", "다른 VK·verifier bytecode·public input", "commitment 또는 SNARK 검증 실패"],
            ].map(([area, mutation, expected]) => (
              <article key={area} className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-black text-primary">{area}</p>
                <p className="mt-2 break-keep text-[10px] font-bold leading-5">{mutation}</p>
                <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">→ {expected}</p>
              </article>
            ))}
          </div>

          <p>
            성능도 한 숫자로 합치지 않습니다. Chunk execution·STARK proving, child proof deferral,
            batch·bundle aggregation, SNARK wrapping, verifier gas를 따로 측정합니다.
          </p>
          <p>
            첫 asset download와 warm cache를 분리합니다. CPU/GPU backend·proof security profile·fork·block 수·transaction
            gas·child 수를 같은 조건으로 고정해야 비교가 됩니다.
          </p>

          <div className="not-prose overflow-hidden rounded-lg border border-border">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <thead className="bg-muted/40">
                <tr><th className="p-3">2026-11-01 로컬 확인</th><th className="p-3">결과</th><th className="p-3">해석 범위</th></tr>
              </thead>
              <tbody>
                {[
                  ["공식 verify_bundle_info_pi", "1/1 통과", "고정 BundleInfo가 공식 Euclid hash fixture를 재현"],
                  ["PublicInputs::validate fixture", "4/4 통과", "정상 연결 수용, state·queue·version 단독 변조 각각 panic"],
                  ["Full chunk→batch→bundle proof", "이 실행에서는 미수행", "app.vmexe·release VK/params와 장시간 prove가 필요하므로 통과를 주장하지 않음"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border align-top">
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="break-keep p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground">
            두 test run은 저장소가 고정한 <code>nightly-2025-11-20</code>과 source checkout에서
            실행했습니다. 처음에는 dependency와 toolchain을 내려받아 compile했고, 로컬 continuity
            fixture는 실제 <code>PublicInputs::validate</code> 구현만 호출했습니다. 이 결과를 production
            proof나 on-chain deployment 검증으로 확대하지 않습니다.
          </p>

          <div id="paper-scroll-current-docs">
            <CitationBlock source="Scroll Intro to zkEVM · current OpenVM architecture" citeKey={1} href={DOCS}>
              <p><strong>문제:</strong> Scroll proving system이 custom Halo2에서 OpenVM으로 어떻게 바뀌었고 현재 aggregation 계층이 무엇인지 설명합니다.</p>
              <p><strong>직접 적용:</strong> 2025–현재 OpenVM, chunk→batch→bundle→EVM-verifiable SNARK 흐름을 글의 전체 구조로 사용했습니다.</p>
              <p><strong>근거 범위:</strong> Scroll 공식 문서가 설명하는 current proving architecture입니다.</p>
              <p><strong>말하지 않는 것:</strong> 각 source commit이 곧바로 현재 mainnet 배포 binary와 동일하다고 주장하지 않습니다.</p>
            </CitationBlock>
          </div>

          <div id="paper-scroll-euclid">
            <CitationBlock source="Scroll Euclid Upgrade" citeKey={2} href={EUCLID}>
              <p><strong>문제:</strong> Euclid가 왜 opcode별 Halo2 circuits를 deprecate하고 OpenVM·MPT로 옮겼는지 기록합니다.</p>
              <p><strong>직접 적용:</strong> 과거 trace/table 설명을 현재 구현처럼 쓰지 않고 migration 전 구조로 분리했습니다.</p>
              <p><strong>근거 범위:</strong> 2025 Scroll network upgrade의 공식 동기·timeline·component versions입니다.</p>
              <p><strong>말하지 않는 것:</strong> “Halo2”라는 이름이 현재 final SNARK wrapper에서도 사라졌다고 말하지 않습니다.</p>
            </CitationBlock>
          </div>

          <div id="paper-scroll-source">
            <CitationBlock source={`scroll-tech/zkvm-prover ${SCROLL_ZKVM_VERSION} · ${SCROLL_ZKVM_COMMIT.slice(0, 8)}`} citeKey={3} type="code" href={SOURCE}>
              <p><strong>문제:</strong> Chunk execution, versioned public inputs, child proof aggregation과 EVM verification의 실제 경계를 고정합니다.</p>
              <p><strong>직접 적용:</strong> <code>ChunkWitness→ChunkInfo→pi_hash</code>, child EXE·VM commitments, contiguous PI validation과 final verifier 순서를 실제 code에서 옮겼습니다.</p>
              <p><strong>근거 범위:</strong> Tag {SCROLL_ZKVM_VERSION}가 가리키는 commit {SCROLL_ZKVM_COMMIT}의 Rust source입니다.</p>
              <p><strong>말하지 않는 것:</strong> Full end-to-end proof generation, production keys, mainnet deployment provenance를 이 로컬 source audit만으로 검증했다고 말하지 않습니다.</p>
            </CitationBlock>
          </div>

          <div id="paper-scroll-coordinator">
            <CitationBlock source="Scroll Prover-Coordinator System Overview" citeKey={4} href={COORDINATOR}>
              <p><strong>문제:</strong> Rollup DB, Go coordinator, Rust prover, libzkp가 production-like proving task를 어떻게 주고받는지 설명합니다.</p>
              <p><strong>직접 적용:</strong> 회로 구조와 runtime orchestration을 분리하고 fork·ZK version·task type·asset compatibility를 운영 gate에 포함했습니다.</p>
              <p><strong>근거 범위:</strong> Scroll monorepo develop 문서의 current coordinator/prover integration입니다.</p>
              <p><strong>말하지 않는 것:</strong> 이 문서의 deploy topology와 임의 운영자의 실제 production 환경이 같다고 가정하지 않습니다.</p>
            </CitationBlock>
          </div>

          <p className="text-sm text-muted-foreground">
            고정 source는 {SCROLL_ZKVM_VERSION}, commit <code>{SCROLL_ZKVM_COMMIT.slice(0, 12)}</code>입니다.
            Current source와 current mainnet deployment는 별도 provenance 문제입니다.
          </p>
          <p className="text-sm text-muted-foreground">
            배포할 때는 exact
            zkvm-prover·OpenVM·Plonky3 commits, Cargo.lock, fork, chunk/batch/bundle assets, EXE·VM
            commitments와 root verifier VK·bytecode를 함께 기록해야 합니다. Public-input schema와
            coordinator/libzkp version도 같은 release receipt에 남겨야 합니다.
          </p>
          <p className="text-sm text-muted-foreground">
            과거 구조의 archived source는 <a href={ARCHIVED}>별도 저장소</a>에서만
            역사 자료로 참조합니다.
          </p>

          <p className="text-xs text-muted-foreground">
            Source panels: <a href={CHUNK_SOURCE}>chunk execute</a> · <a href={VERIFIER_SOURCE}>final verifier</a>
          </p>
        </section>
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={currentCodeRefs}
        fileTrees={{ scroll: currentScrollTree }}
        projectMetas={{
          scroll: {
            id: "scroll",
            label: `Scroll zkVM · Rust · ${SCROLL_ZKVM_VERSION} ${SCROLL_ZKVM_COMMIT.slice(0, 8)}`,
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </>
  );
}
