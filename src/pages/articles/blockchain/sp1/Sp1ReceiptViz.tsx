import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "입력 n=10",
  "guest 실행",
  "execute",
  "setup",
  "core shards",
  "compressed",
  "EVM wrapper",
  "verify",
] as const;

const SCENES = [
  {
    question: "SP1 증명 한 건은 무엇에서 시작하나요?",
    answer:
      "Host가 RV64IM ELF와 stdin의 n=10을 준비합니다. 공식 Fibonacci guest는 n을 읽고, n과 연속한 두 Fibonacci 값 55·89를 public values에 commit합니다.",
    state: "ELF + stdin(n=10) → expected public values [10, 55, 89]",
    confirmed: "stdin에 넣었다고 자동으로 공개되는 것은 아닙니다. guest가 commit한 bytes만 verifier가 보는 public values가 됩니다.",
    next: "평범한 Rust 반복문이 어떻게 증명 대상이 되는지",
    phase: 0,
  },
  {
    question: "Verifier가 Rust 소스 한 줄씩 다시 실행하나요?",
    answer:
      "아닙니다. Guest를 RV64IM ELF로 컴파일하고, executor가 instruction·memory·syscall event를 만듭니다. Proof system은 이 실행 trace가 SP1 machine 규칙을 만족했다고 증명합니다.",
    state: "run RV64IM(ELF, n=10) → execution record + committed bytes",
    confirmed: "증명 대상은 소스의 의도가 아니라 실제 ELF가 만든 기계 실행입니다.",
    next: "execute 명령의 성공과 proof 생성의 차이",
    phase: 1,
  },
  {
    question: "execute가 10·55·89를 내면 증명이 끝난 건가요?",
    answer:
      "아닙니다. execute는 프로그램을 돌려 결과와 cycle report를 얻는 단계입니다. 아직 다른 사람이 검증할 cryptographic proof는 없습니다.",
    state: "execute(ELF, stdin) → public values + report; proof = none",
    confirmed: "실행 성공은 디버깅 근거이고, proof 검증 성공은 제3자가 확인할 계산 근거입니다.",
    next: "어떤 프로그램을 증명했는지 고정하는 방법",
    phase: 2,
  },
  {
    question: "결과가 같으면 다른 ELF로 만든 proof도 받아도 되나요?",
    answer:
      "안 됩니다. setup은 ELF에 대응하는 proving key와 verifying key를 만듭니다. Application은 기대한 verification key와 public-values schema를 함께 고정해야 합니다.",
    state: "setup(ELF) → proving key PK + verification key VK",
    confirmed: "10·55·89라는 결과만 같아도 VK가 다르면 다른 프로그램의 statement입니다.",
    next: "긴 실행을 여러 proof로 나눠도 한 실행인 이유",
    phase: 3,
  },
  {
    question: "Shard proof가 각각 유효하면 순서를 섞어도 되나요?",
    answer:
      "안 됩니다. Core verifier는 첫 shard, timestamp, PC, exit code, memory init/finalize 경계, committed-value digest와 global cumulative sum을 순서대로 연결합니다.",
    state: "next_pcᵢ = pc_startᵢ₊₁ ∧ last_timeᵢ = initial_timeᵢ₊₁",
    confirmed: "각 조각의 진실성과 조각 사이의 연속성은 서로 다른 검사입니다.",
    next: "많은 shard proofs를 더 작은 결과로 접는 법",
    phase: 4,
  },
  {
    question: "Core proof를 왜 compressed proof로 다시 감싸나요?",
    answer:
      "Core proof 크기는 실행 cycle과 shard 수에 따라 늘어납니다. Recursion은 여러 core proofs의 검증을 다시 증명해 cycle 수와 무관한 고정 크기의 compressed proof를 만듭니다.",
    state: "core shard proofs → recursive verification → compressed proof",
    confirmed: "Compressed는 같은 계산을 다시 실행하는 것이 아니라 앞 proof들의 올바른 검증을 한 proof로 접습니다.",
    next: "Ethereum에서 바로 확인하려면 무엇이 더 필요한지",
    phase: 5,
  },
  {
    question: "Compressed proof를 EVM 계약이 그대로 읽나요?",
    answer:
      "일반적인 온체인 경로는 PLONK 또는 Groth16 wrapper를 사용합니다. Wrapper public inputs에는 SP1 vkey hash, public-values hash와 exit code가 들어갑니다.",
    state: "compressed → PLONK/Groth16 { vkHash, H(PV), exitCode, ... }",
    confirmed: "Core·compressed는 native verifier 경로이고 PLONK·Groth16은 고정 형식의 온체인 verifier 경로입니다.",
    next: "proof bytes 외에 application이 끝까지 확인할 값",
    phase: 6,
  },
  {
    question: "verify가 통과하면 10번째 Fibonacci가 55라고 바로 믿어도 되나요?",
    answer:
      "Verifier는 proof mode별 암호 검증과 함께 SP1 version, exit code, VK, public-values digest를 확인합니다. Application은 decoded public values가 정확히 [10,55,89]인지도 확인해야 합니다.",
    state: "valid proof ∧ expected VK ∧ success exit ∧ PV=[10,55,89]",
    confirmed: "증명은 고정 ELF가 공개한 bytes를 보장합니다. 그 bytes를 업무 의미로 해석하고 허용하는 일은 application 경계입니다.",
    next: "verifier version·malformed proof·backend parity를 막는 release gate",
    phase: 7,
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) => `${LABELS[index]}. ${scene.question} ${scene.answer} 이 장면에서 ${scene.confirmed}`,
);

const PATH = [
  ["01", "ELF", "실행할 program"],
  ["02", "execute", "trace·PV"],
  ["03", "core", "shard proofs"],
  ["04", "compress", "재귀 집계"],
  ["05", "wrap", "PLONK·Groth16"],
  ["06", "verify", "VK·PV·exit"],
] as const;

export function Sp1ReceiptViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="SP1 v6.10.0 · n=10 한 사례를 끝까지 추적"
      title="Rust guest 실행이 검증 가능한 proof receipt가 되는 과정"
      description="같은 입력과 공개값을 바꾸지 않고 execute, setup, core shards, recursion, wrapper와 application 검증의 꼬리 질문을 차례로 엽니다."
      note="필드와 proof mode는 SP1 v6.10.0 commit d83ed91을 따릅니다. 공식 Fibonacci guest는 n=10일 때 n·F(10)·F(11), 즉 10·55·89를 이 순서로 commit합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        aria-label="SP1 proof receipt 여덟 장면 탐색기"
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[102rem] space-y-4 sm:min-h-[75rem] lg:min-h-[60rem] xl:min-h-[56rem]"
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
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">{scene.question}</h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.answer}</p>
              </article>
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">이 장면의 statement</p>
                <p className="mt-2 break-words font-mono text-[10px] font-black leading-5">{scene.state}</p>
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
                화살표 대신 번호와 활성 상태로 순서를 표시합니다. 각 경계는 앞 단계의 artifact를 입력으로 받습니다.
              </p>
            </article>

            <div className="grid gap-px bg-border p-px sm:grid-cols-3">
              {[
                ["Host 입력", "n = 10", "stdin bytes; guest가 읽는 값"],
                ["Guest 공개", "10 · 55 · 89", "commit 순서를 포함한 public values"],
                ["Application 기대", "VK₍fib₎ + schema", "허용한 ELF와 공개값 해석"],
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
                <p className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300">증명과 verifier가 확인</p>
                <ul className="mt-3 space-y-1.5 text-[10px] leading-5">
                  <li>✓ 허용한 VK의 RV64IM 실행</li>
                  <li>✓ shard 경계·exit code·public-values digest</li>
                  <li>✓ 선택한 proof mode의 암호 검증</li>
                </ul>
              </article>
              <article className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-rose-700 dark:text-rose-300">Application이 따로 확인</p>
                <ul className="mt-3 space-y-1.5 text-[10px] leading-5">
                  <li>× 이 ELF가 업무상 허용한 코드인가</li>
                  <li>× 10·55·89의 byte 순서와 의미가 맞는가</li>
                  <li>× 입력 provenance와 권한이 유효한가</li>
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
            playLabel="SP1 proof receipt 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
