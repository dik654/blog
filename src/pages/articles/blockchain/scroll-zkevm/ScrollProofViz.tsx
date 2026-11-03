import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "block witness",
  "fork 실행",
  "공개 입력",
  "chunk proof",
  "batch 집계",
  "bundle 집계",
  "EVM proof",
  "L1 최종화",
] as const;

const SCENES = [
  {
    question: "무엇이 Scroll 증명 한 건의 출발점인가요?",
    answer: "예시 chunk에는 블록 witness, 이전 상태 root S₀, transaction과 상태·code 자료, 이전 L1 message queue hash Q₀, 그리고 fork 이름이 들어 있습니다.",
    state: "ChunkWitness { blocks, prev_msg_queue_hash=Q₀, fork=GalileoV2, ... }",
    confirmed: "Prover는 이미 만들어진 post-root만 받는 것이 아니라, 상태 전이를 다시 실행할 재료를 받습니다.",
    next: "witness를 어떤 EVM 규칙으로 실행할지",
    phase: 0,
  },
  {
    question: "같은 block witness를 아무 EVM 규칙으로 실행해도 되나요?",
    answer: "안 됩니다. version byte와 fork_name이 같은지 먼저 확인하고, GalileoV2 같은 선택된 hard fork의 chain spec으로 sbv verifier를 실행합니다.",
    state: "run(blocks, chain_spec(GalileoV2)) → S₀, S₁, withdraw root",
    confirmed: "현재 구조에서 예전 opcode별 Halo2 gadget 자리는 고정 fork의 Rust 실행 검증 경로가 맡습니다.",
    next: "실행 결과 가운데 verifier가 보게 될 statement",
    phase: 1,
  },
  {
    question: "실행 전체를 온체인에 공개하나요?",
    answer: "아닙니다. Guest는 chain, pre/post roots, transaction digest, message queue hashes, first block와 block contexts를 정해진 순서로 직렬화하고 Keccak-256 digest H₁ 하나를 공개합니다.",
    state: "H₁ = Keccak256(version ∥ chain ∥ S₀ ∥ S₁ ∥ txDigest ∥ Q₀ ∥ Q₁ ∥ blockCtxs)",
    confirmed: "H₁은 root 두 개의 hash가 아니라 fork·data·queue·block context까지 묶은 32-byte public input hash입니다.",
    next: "H₁이 어떤 guest 실행에서 나왔는지 인증하는 방법",
    phase: 2,
  },
  {
    question: "H₁만 알고 있으면 chunk가 올바르게 실행됐다고 믿어도 되나요?",
    answer: "아닙니다. OpenVM STARK proof가 고정 chunk guest의 RISC-V 실행과 H₁을 인증해야 합니다. Proof에는 어떤 guest와 VM 설정인지 가리키는 EXE·VM commitments도 연결됩니다.",
    state: "chunk STARK: guest identity + valid execution + public H₁",
    confirmed: "공개값이 같아도 다른 guest나 다른 VM 설정에서 만든 proof는 같은 Scroll chunk proof가 아닙니다.",
    next: "여러 chunk proof를 하나의 batch로 안전하게 접는 법",
    phase: 3,
  },
  {
    question: "유효한 chunk proof를 여러 개 모으면 자동으로 유효한 batch인가요?",
    answer: "아닙니다. Batch guest는 모든 child가 고정 chunk EXE·VM commitments인지 확인하고, 각 proof의 Hᵢ가 witness의 ChunkInfo hash와 같은지, Sᵢ의 끝과 Sᵢ₊₁의 시작 및 Qᵢ가 이어지는지 검사합니다.",
    state: "child identity 일치 ∧ H(witnessᵢ)=proofᵢ.PI ∧ Sᵢ.post=Sᵢ₊₁.prev ∧ Qᵢ.post=Qᵢ₊₁.prev",
    confirmed: "각 proof가 따로 참이라는 조건과 서로 같은 연속 체인이라는 조건은 별개이며 둘 다 필요합니다.",
    next: "왜 batch에서 끝내지 않고 bundle을 한 번 더 만드는지",
    phase: 4,
  },
  {
    question: "Batch proof 하나를 바로 L1에 올리면 되지 않나요?",
    answer: "가능한 설계지만 Scroll은 여러 batch를 bundle로 한 번 더 모읍니다. Bundle statement는 첫 batch의 이전 state/batch hash부터 마지막 batch의 post-state/batch hash까지를 한 최종화 단위로 압축합니다.",
    state: "BundleInfo { first.parent roots, last.post roots, num_batches, withdraw root, Qfinal }",
    confirmed: "Bundle은 증명 생성 단위가 아니라 여러 batch의 L1 최종화 비용을 나누어 내는 aggregation 경계입니다.",
    next: "OpenVM root proof가 EVM에서 바로 검증되는지",
    phase: 5,
  },
  {
    question: "OpenVM STARK를 Ethereum 계약이 그대로 검증하나요?",
    answer: "최종 bundle root proof는 EVM-verifiable SNARK로 변환됩니다. Verifier는 proof가 들고 온 app EXE·VM commitments를 신뢰한 VK의 commitments와 먼저 비교한 뒤 verifier bytecode를 실행합니다.",
    state: "bundle root proof → Halo2 SNARK wrapper → app commitments check → EVM verifier",
    confirmed: "현재 구조에도 Halo2 SNARK가 남지만, EVM opcode마다 만든 과거 Halo2 zkEVM 회로와는 역할이 다릅니다.",
    next: "proof 통과가 실제로 어느 상태를 최종화하는지",
    phase: 6,
  },
  {
    question: "온체인 검증이 통과하면 무엇이 확정되나요?",
    answer: "계약은 bundle public input의 이전 상태가 현재 최종화 경계와 맞는지 확인하고, 인증된 post-state와 batch/message commitments를 새 경계로 반영합니다. DA, sequencer liveness, transaction privacy는 별도 문제입니다.",
    state: "trusted verifier + expected public input → finalize S₁ and bundle commitments",
    confirmed: "Scroll proof가 보장하는 핵심은 고정 코드·fork 아래의 상태 전이입니다. 데이터 가용성과 서비스 지속성까지 같은 proof가 보장하지는 않습니다.",
    next: "fork·asset·VK 불일치와 negative fixture를 막는 release gate",
    phase: 7,
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) => `${LABELS[index]}. ${scene.question} ${scene.answer} 이 장면에서 ${scene.confirmed}`,
);

const PATH = [
  ["01", "witness", "blocks · S₀ · Q₀"],
  ["02", "execute", "fork 규칙 · S₁"],
  ["03", "chunk", "H₁ · STARK"],
  ["04", "batch", "child 연결"],
  ["05", "bundle", "최종화 범위"],
  ["06", "L1", "SNARK 검증"],
] as const;

export function ScrollProofViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="현재 OpenVM 구조 · 같은 chunk를 끝까지 추적"
      title="한 chunk의 상태 전이가 L1 최종화 증명이 되는 과정"
      description="한 사례를 바꾸지 않고 block witness, fork 실행, public input, chunk·batch·bundle proof, EVM verifier의 질문을 차례로 엽니다."
      note="구조와 필드 이름은 Scroll zkvm-prover v0.9.1 commit bf887150의 guest programs·types·verifier를 따릅니다. 숫자 S₀·S₁·Q₀·Q₁은 연결 관계를 보이기 위한 기호입니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        aria-label="Scroll OpenVM 증명 경로 여덟 장면 탐색기"
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[104rem] space-y-4 sm:min-h-[76rem] lg:min-h-[61rem] xl:min-h-[57rem]"
          >
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
              {LABELS.map((label, index) => (
                <div
                  key={label}
                  className={`min-w-0 border px-1 py-2 text-center text-[9px] font-black leading-4 ${
                    index === scenes.active
                      ? "border-primary bg-primary/10"
                      : index < scenes.active
                        ? "border-foreground/25 bg-background"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {index + 1}. {label}
                </div>
              ))}
            </div>

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)]">
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">지금 생긴 꼬리 질문 · {LABELS[scenes.active]}</p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.question}
                </h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.answer}
                </p>
              </article>
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">이 장면의 statement</p>
                <p className="mt-2 break-words font-mono text-[10px] font-black leading-5">
                  {scene.state}
                </p>
              </article>
            </div>

            <article className="border border-border bg-background p-4">
              <p className="text-[9px] font-bold text-primary">같은 요청이 지나가는 여섯 경계</p>
              <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
                {PATH.map(([number, title, detail], index) => (
                  <div
                    key={number}
                    className={`min-w-0 border p-2.5 ${
                      index <= Math.min(scene.phase, 5)
                        ? "border-primary/55 bg-primary/[0.06]"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <p className="text-[8px] font-black text-primary">{number}</p>
                    <p className="mt-1 break-words text-[10px] font-black">{title}</p>
                    <p className="mt-1 break-keep text-[8px] leading-4">{detail}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 break-keep text-[10px] leading-5 text-muted-foreground">
                화살표 대신 번호와 활성 상태로 순서를 표시합니다. 각 경계는 앞 단계의 결과를 입력으로 받습니다.
              </p>
            </article>

            <div className="grid gap-px bg-border p-px sm:grid-cols-3">
              {[
                ["실행 전", "S₀ · Q₀", "이전 state root와 message queue hash"],
                ["실행 후", "S₁ · Q₁", "같은 fork 규칙으로 계산한 다음 경계"],
                ["공개 digest", "H₁", "roots·data·queue·block contexts의 hash"],
              ].map(([kind, value, note], index) => (
                <article
                  key={kind}
                  className={`min-w-0 bg-background p-4 ${scene.phase >= index ? "opacity-100" : "opacity-55"}`}
                >
                  <p className="text-[9px] font-bold text-primary">{kind}</p>
                  <p className="mt-2 break-words font-mono text-sm font-black">{value}</p>
                  <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">{note}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-px bg-border p-px sm:grid-cols-2">
              <article className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300">증명 안에서 확인</p>
                <ul className="mt-3 space-y-1.5 text-[10px] leading-5">
                  <li>✓ fork와 guest program identity</li>
                  <li>✓ EVM state transition과 public input hash</li>
                  <li>✓ child proof identity·hash·연속성</li>
                </ul>
              </article>
              <article className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-rose-700 dark:text-rose-300">증명 바깥의 별도 질문</p>
                <ul className="mt-3 space-y-1.5 text-[10px] leading-5">
                  <li>× transaction data를 사용자가 제때 얻는가</li>
                  <li>× sequencer와 prover가 계속 서비스를 제공하는가</li>
                  <li>× transaction 내용이 private한가</li>
                </ul>
              </article>
            </div>

            <div className="grid gap-px bg-border p-px sm:grid-cols-2">
              <article className="bg-background p-4">
                <p className="text-[9px] font-bold text-primary">새로 확정된 결과</p>
                <p className="mt-2 break-keep text-xs font-semibold leading-5">{scene.confirmed}</p>
              </article>
              <article className="bg-background p-4">
                <p className="text-[9px] font-bold text-amber-700 dark:text-amber-300">다음 꼬리 질문</p>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{scene.next}</p>
              </article>
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="Scroll 증명 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
