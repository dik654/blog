import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "Machine 준비",
  "m₁ 사전 검사",
  "Actor 호출",
  "호출 실패",
  "R₁ 생성",
  "m₂ 적용",
  "마지막 flush",
  "결과 비교",
] as const;

const SCENES = [
  {
    title: "실행 시작점과 규칙을 고정해 FVM Machine을 만듭니다",
    detail:
      "초기 state root S₀, epoch, network version, base fee, actor manifest와 blockstore가 한 실행 묶음의 문맥을 이룹니다.",
    request: "입력 대기",
    workingState: "Σ₀ ← S₀에서 읽기",
    receipt: "아직 없음",
    finalRoot: "아직 계산하지 않음",
  },
  {
    title: "첫 message m₁을 actor code보다 먼저 검사합니다",
    detail:
      "Sender, sequence, 잔액과 gas limit을 검사합니다. Explicit message라면 sequence를 올리고 최대 gas 비용을 먼저 확보합니다.",
    request: "m₁ · Alice → A",
    workingState: "sequence +1 · gas 확보",
    receipt: "통과 또는 조기 실패",
    finalRoot: "아직 계산하지 않음",
  },
  {
    title: "Actor A가 실행되고 같은 Call Manager 안에서 B를 부릅니다",
    detail:
      "A와 B가 쓴 state·events·access 기록은 actor-call transaction에 임시로 쌓입니다. 아직 최종 state root는 만들지 않습니다.",
    request: "A → B nested send",
    workingState: "A·B 변경 임시 저장",
    receipt: "호출 진행 중",
    finalRoot: "아직 계산하지 않음",
  },
  {
    title: "A가 실패 exit code를 반환하면 actor-call 변경만 되돌립니다",
    detail:
      "Call Manager는 임시 state와 events를 되돌립니다. 사전 검사에서 반영한 sender sequence와 gas 정산까지 모두 사라지는 것은 아닙니다.",
    request: "A abort",
    workingState: "actor 변경 취소 · 외부 효과 유지",
    receipt: "실패 결과 준비",
    finalRoot: "아직 계산하지 않음",
  },
  {
    title: "Executor가 m₁의 영수증 R₁과 gas 정산 결과를 만듭니다",
    detail:
      "R₁에는 exit code, return data, gas used와 events root가 들어갑니다. State root는 R₁의 필드가 아닙니다.",
    request: "m₁ 처리 완료",
    workingState: "Σ₁ · 다음 message의 시작점",
    receipt: "R₁ 확정",
    finalRoot: "아직 계산하지 않음",
  },
  {
    title: "같은 Machine에 다음 message m₂를 이어서 적용합니다",
    detail:
      "m₂는 m₁ 이후의 working state Σ₁을 봅니다. 각 message는 자기 영수증을 만들지만 state root는 매번 flush하지 않습니다.",
    request: "m₂ · Bob → C",
    workingState: "Σ₁ → Σ₂",
    receipt: "R₁ · R₂",
    finalRoot: "아직 계산하지 않음",
  },
  {
    title: "호출자가 모든 message를 적용한 뒤 Machine을 한 번 flush합니다",
    detail:
      "flush()가 working state Σ₂를 blockstore에 기록하고 최종 state root Sfinal을 돌려줍니다. FVM 자체는 chain head를 전진시키지 않습니다.",
    request: "message 적용 종료",
    workingState: "Flush(Σ₂)",
    receipt: "R₁ · R₂ 유지",
    finalRoot: "Sfinal 계산",
  },
  {
    title: "독립 실행끼리 영수증 목록과 마지막 state root를 함께 비교합니다",
    detail:
      "같은 초기 state와 같은 순서의 message, 같은 network version·bundle이라면 R₁·R₂와 Sfinal이 모두 같아야 합니다.",
    request: "m₁, m₂ 순서까지 동일",
    workingState: "같은 전이 확인",
    receipt: "R₁·R₂ 일치",
    finalRoot: "Sfinal 일치",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.title} ${scene.detail} Working state는 ${scene.workingState}, 영수증은 ${scene.receipt}, 최종 root는 ${scene.finalRoot}입니다.`,
);

export function FvmExecutionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9200, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="FVM Machine 1개 · message 2건 · 첫 message는 actor 호출 실패"
      title="각 message는 영수증을 만들고, 마지막 flush가 하나의 state root를 만듭니다"
      description="초기 state에서 Machine을 만든 뒤 m₁과 m₂를 차례로 적용합니다. Actor-call 되돌리기, message-level gas 효과, 영수증과 최종 state root의 경계를 나눠 봅니다."
      note="Alice·Bob·actor A/B/C와 두 message는 설명용 사례입니다. 실제 실행 결과는 message, 초기 state, epoch, network version, actor bundle과 machine context에 따라 달라집니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="FVM message 적용과 최종 flush 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[47rem] space-y-4 sm:min-h-[32rem] xl:min-h-[28rem]"
          >
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
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

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.45fr)_minmax(13rem,0.55fr)]">
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 확인할 경계 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.title}
                </h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.detail}
                </p>
              </div>
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 단계에서 확정된 것
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.receipt}
                </p>
                <p className="mt-4 break-keep text-[9px] leading-5 text-muted-foreground">
                  Message 영수증과 Machine의 최종 state root는 서로 다른 시점에
                  만들어집니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                ["요청", scene.request],
                ["Working state", scene.workingState],
                ["Message 영수증", scene.receipt],
                ["최종 state root", scene.finalRoot],
              ].map(([label, value], index) => (
                <article
                  key={label}
                  className={`min-w-0 border bg-background p-3 ${
                    index === 3 ? "border-primary/60" : "border-border"
                  }`}
                >
                  <p className="text-[9px] font-bold text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">
                    {value}
                  </p>
                </article>
              ))}
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
            playLabel="FVM message 적용과 flush 과정 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
