import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "duty 준비",
  "slot 시작",
  "관찰 대기",
  "data 고정",
  "key 서명",
  "DB gate",
  "제출·거절",
] as const;

const SCENES = [
  {
    question: "V37이 slot 100에서 attester라는 사실은 언제 준비될까요?",
    answer:
      "Validator client는 epoch duty를 미리 받아 둡니다. Slot 100이 시작되면 저장된 duty에서 V37의 attester 역할과 committee 정보를 찾습니다.",
    owner: "beacon node → duty store",
    input: "V37 · attester · slot 100 · committee 2",
    output: "실행할 역할 하나",
    stillOpen: "어느 block root에 투표할지는 아직 모릅니다.",
  },
  {
    question: "Slot이 시작되면 곧바로 아무 head에나 서명할까요?",
    answer:
      "아닙니다. Prysm은 slot 전체를 deadline으로 둔 context를 만들고, RolesAt이 돌려준 역할만 병렬 실행합니다.",
    owner: "runner.run → performRoles",
    input: "slot start t=0 · next-slot deadline t=12s",
    output: "SubmitAttestation 작업 시작",
    stillOpen: "유효한 현재-slot block을 조금 더 기다릴 수 있습니다.",
  },
  {
    question: "왜 약 4초까지 기다렸다가 투표할 수 있을까요?",
    answer:
      "유효한 slot-100 block을 먼저 보면 바로 진행합니다. 보지 못해도 pre-Gloas mainnet due time인 3333 basis points에 도달하면 더 늦지 않게 진행합니다.",
    owner: "waitUntilAttestationDueOrValidBlock",
    input: "min(valid block 관찰 시각, 12,000ms × 3333/10,000)",
    output: "head를 읽을 시점 확정",
    stillOpen: "투표 data와 domain은 아직 만들어야 합니다.",
  },
  {
    question: "서명 대상에는 block root 하나만 들어갈까요?",
    answer:
      "Beacon node에서 받은 attestation data에는 slot, committee, head root, source·target checkpoint가 들어갑니다. 여기에 attester domain을 결합해 signing root RA를 만듭니다.",
    owner: "getAttestationData → domainAndSigningRoot",
    input: "slot 100 · root R100 · source 2 · target 3 · attester domain",
    output: "signing root RA",
    stillOpen: "RA가 과거 투표와 충돌하는지는 아직 확인하지 않았습니다.",
  },
  {
    question: "Prysm은 slashing DB를 먼저 확인하고 서명할까요?",
    answer:
      "현재 v7.3.1 attestation 경로는 그렇지 않습니다. Keymanager가 RA에 서명한 뒤 IndexedAttestation을 만들고, 그 다음 local slashing-protection DB를 호출합니다.",
    owner: "keymanager.Sign",
    input: "public key V37 · RA · domain · attestation data · slot 100",
    output: "BLS signature σA",
    stillOpen: "σA는 아직 beacon node에 제출되지 않았습니다.",
  },
  {
    question: "그렇다면 local slashing protection이 막는 것은 무엇일까요?",
    answer:
      "DB는 같은 target epoch의 다른 root와 양방향 surround를 검사합니다. 안전하면 source·target·RA를 저장하고, 위험하면 오류를 돌려 제출 경로를 멈춥니다.",
    owner: "SlashableAttestationCheck",
    input: "새 투표 2→3, RA · 과거 history",
    output: "저장 완료 또는 거절",
    stillOpen: "이 gate는 이 process의 서명 생성 자체보다 network 제출을 막습니다.",
  },
  {
    question: "같은 key를 두 client가 동시에 쓰면 이 흐름만으로 안전할까요?",
    answer:
      "아닙니다. 허용된 기록만 beacon node로 제출하지만, 다른 process·다른 DB·remote signer까지 하나의 lock으로 묶지는 않습니다. 한 key에는 한 writer 또는 signer-side 공용 보호가 필요합니다.",
    owner: "validator client → beacon node",
    input: "DB가 RA를 저장한 σA 또는 충돌해 거절된 σB",
    output: "안전한 경우만 attestation 제출",
    stillOpen: "제출 성공은 block 포함이나 finality를 보장하지 않습니다.",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 결과는 ${scene.output}입니다.`,
);

export default function ValidatorDutyTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9800, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="한 attestation이 나가는 실제 순서"
      title="V37의 slot-100 duty가 서명·DB gate·제출을 통과하는 경로"
      description="각 단계가 무엇을 새로 확정하는지와, 서명과 slashing DB의 실제 호출 순서를 함께 봅니다."
      note="V37·R100·source 2·target 3은 설명용입니다. 12초·3333 BPS는 pre-Gloas mainnet 설정이며 active fork와 network 설정에 따라 달라집니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Validator attestation 실행 경로 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[39rem] space-y-4 sm:min-h-[35rem] xl:min-h-[31rem]"
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

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.2fr)_minmax(15rem,0.8fr)]">
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 생긴 꼬리 질문 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.question}
                </h4>
                <p className="mt-3 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.answer}
                </p>
              </article>
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 단계의 owner
                </p>
                <p className="mt-2 break-words border-l-2 border-primary pl-3 text-xs font-black leading-5">
                  {scene.owner}
                </p>
                <p className="mt-4 text-[9px] font-bold text-muted-foreground">
                  판단 재료
                </p>
                <p className="mt-2 break-words font-mono text-[10px] font-black leading-5 sm:text-xs">
                  {scene.input}
                </p>
              </article>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <article className="min-w-0 border border-primary/60 bg-background p-3">
                <p className="text-[9px] font-bold text-muted-foreground">
                  새로 확정된 결과
                </p>
                <p className="mt-2 break-words font-mono text-[10px] font-black leading-5 sm:text-xs">
                  {scene.output}
                </p>
              </article>
              <article className="min-w-0 border border-amber-500/50 bg-amber-500/5 p-3">
                <p className="text-[9px] font-bold text-muted-foreground">
                  아직 확정되지 않은 것
                </p>
                <p className="mt-2 break-keep text-[10px] font-black leading-5 sm:text-xs">
                  {scene.stillOpen}
                </p>
              </article>
            </div>

            <div className="grid grid-cols-7 gap-1" aria-label="Attestation 실행 순서">
              {LABELS.map((label, index) => (
                <div key={label} className="min-w-0">
                  <div
                    className={`h-2 border ${
                      index <= scenes.active
                        ? "border-primary bg-primary"
                        : "border-border bg-background"
                    }`}
                  />
                  <p className="mt-1 hidden text-center text-[8px] font-bold text-muted-foreground sm:block">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="Validator attestation 실행 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
