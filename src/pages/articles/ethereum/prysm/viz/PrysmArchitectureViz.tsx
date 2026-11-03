import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "블록 수신",
  "입구 검사",
  "상태 전이",
  "실행 판정",
  "후보 등록",
  "머리 선택",
  "임무 서명",
] as const;

const SCENES = [
  {
    question:
      "Peer가 slot 352의 block B를 보냈습니다. 무엇부터 믿을 수 있습니까?",
    answer: "아직 아무것도 믿지 않고, block root와 source peer만 접수합니다.",
    owner: "P2P·sync service",
    input: "wire bytes · peer · topic",
    output: "B352 접수 기록",
    rejected: "중복 root · blacklisted root",
  },
  {
    question: "Bytes를 열 수 있으면 곧 올바른 block입니까?",
    answer:
      "아닙니다. SSZ 형식, fork·topic, proposer 서명과 parent 조건을 따로 검사합니다.",
    owner: "gossip validator · blockchain service",
    input: "typed block · fork digest",
    output: "검사 가능한 B352",
    rejected: "wrong fork · bad signature · missing parent",
  },
  {
    question: "서명이 맞으면 chain state를 바꿔도 됩니까?",
    answer:
      "Parent state에 fork 규칙을 순서대로 적용해 약속한 post-state root가 나와야 합니다.",
    owner: "consensus transition",
    input: "pre-state S351 · B352",
    output: "post-state S352",
    rejected: "transition error · root mismatch",
  },
  {
    question: "Prysm이 transaction과 EVM 실행까지 직접 검증합니까?",
    answer:
      "아닙니다. Execution client에 payload를 넘기고 VALID·INVALID·SYNCING을 돌려받습니다.",
    owner: "Engine API · execution client",
    input: "execution payload",
    output: "이 사례는 SYNCING",
    rejected: "INVALID · Engine transport failure",
  },
  {
    question: "Consensus는 통과했지만 Engine이 SYNCING이면 block을 버립니까?",
    answer:
      "Data availability까지 통과했다면 optimistic 후보로 넣고, 실행 확정 여부를 표시합니다.",
    owner: "blockchain service · fork-choice store",
    input: "S352 · B352 · status",
    output: "optimistic candidate",
    rejected: "DA failure · finalized ancestry failure",
  },
  {
    question: "후보로 들어갔으면 곧 canonical head나 finalized block입니까?",
    answer:
      "아닙니다. Vote weight가 현재 head를 고르고, justified·finalized checkpoint는 더 느리게 움직입니다.",
    owner: "fork choice · finality",
    input: "후보 tree · attestations",
    output: "head · justified · finalized",
    rejected: "head가 아닌 valid branch도 남을 수 있음",
  },
  {
    question: "선택된 head를 알면 validator는 바로 서명해도 됩니까?",
    answer:
      "Duty·domain·signing root와 slashing history를 확인한 뒤, 허용된 key만 서명합니다.",
    owner: "validator client · signer",
    input: "validator 17 · slot 352 duty",
    output: "서명 receipt 또는 거절",
    rejected: "conflicting duty · unauthorized key",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 담당은 ${scene.owner}이고 결과는 ${scene.output}입니다.`,
);

export default function PrysmArchitectureViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Block B352 한 건 · Prysm의 실제 책임 경계"
      title="블록을 받는 순간부터 validator가 서명할 때까지, 성공 상태는 일곱 번 바뀝니다"
      description="각 장면은 바로 앞 답이 낳는 꼬리 질문으로 이어집니다. 접수·검증·상태·실행·후보·head·서명을 한 단어인 ‘성공’으로 합치지 않습니다."
      note="B352·validator 17과 Engine=SYNCING은 설명용 fixture입니다. 코드 경계는 Prysm v7.3.1 @ 96d418cd에 고정했습니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Prysm 블록 처리와 validator 서명 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[42rem] space-y-4 sm:min-h-[34rem] xl:min-h-[29rem]"
          >
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
              {LABELS.map((label, index) => (
                <div
                  key={label}
                  className={`border px-1 py-2 text-center text-[9px] font-black ${
                    index === scenes.active
                      ? "border-primary bg-primary/10"
                      : index < scenes.active
                        ? "border-foreground/30 bg-background"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {index + 1}. {label}
                </div>
              ))}
            </div>

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.35fr)_minmax(14rem,0.65fr)]">
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 생긴 꼬리 질문 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.question}
                </h4>
                <p className="mt-3 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.answer}
                </p>
              </div>
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 단계의 담당
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.owner}
                </p>
                <p className="mt-4 text-[9px] font-bold text-muted-foreground">
                  여기서 멈추는 이유
                </p>
                <p className="mt-2 break-keep text-[10px] font-bold leading-5">
                  {scene.rejected}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <article className="min-w-0 border border-border bg-background p-3">
                <p className="text-[9px] font-bold text-muted-foreground">
                  들어온 것
                </p>
                <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">
                  {scene.input}
                </p>
              </article>
              <article className="min-w-0 border border-primary/60 bg-background p-3">
                <p className="text-[9px] font-bold text-muted-foreground">
                  넘겨줄 것
                </p>
                <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">
                  {scene.output}
                </p>
              </article>
            </div>

            <div className="flex gap-1" aria-hidden="true">
              {LABELS.map((label, index) => (
                <span
                  key={label}
                  className={`h-1.5 flex-1 ${
                    index <= scenes.active ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="Prysm 블록 B352의 처리 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
