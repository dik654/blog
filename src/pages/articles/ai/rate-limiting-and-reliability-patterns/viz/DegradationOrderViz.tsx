import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #load-shedding-and-admission — (가정) 세 단계 저하 순서와 거절 뒤 재시도.
 * 일괄 요약(음수)을 먼저 버리거나 끊고, 동의한 요청을 작은 모델로 돌리고, 0 이상 대화형을 마지막에 거절한다.
 */
type Lane = { text: string; tone: "normal" | "changed" | "dropped" };

const LANE_NAMES = ["일괄 요약 작업 (음수 priority)", "작은 모델에 미리 동의한 요청", "대화형 요청 (0 이상)"];

const SCENES: readonly { label: string; summary: string; note: string; lanes: readonly [Lane, Lane, Lane] }[] = [
  {
    label: "1단계 · 포화 때 가장 먼저",
    summary: "일괄 요약을 버리거나 끊음",
    note: "몇 시간 늦어도 되는 작업에 음수를 주어 포화 때 가장 먼저 버리거나 끊습니다.",
    lanes: [
      { text: "버리거나 끊음", tone: "dropped" },
      { text: "그대로", tone: "normal" },
      { text: "그대로", tone: "normal" },
    ],
  },
  {
    label: "2단계 · 그래도 넘치면",
    summary: "동의한 요청을 작은 모델로",
    note: "미리 동의한 요청을 작은 모델 묶음으로 돌립니다. 사전 동의와 품질 기준이 있어야 하며, 동의 없이 몰래 낮추면 저하가 아니라 품질 위반입니다.",
    lanes: [
      { text: "버리거나 끊음", tone: "dropped" },
      { text: "작은 모델 묶음으로", tone: "changed" },
      { text: "그대로", tone: "normal" },
    ],
  },
  {
    label: "3단계 · 마지막",
    summary: "대화형 요청을 거절",
    note: "0 이상의 대화형 요청은 앞의 두 단계를 거친 뒤 마지막에 거절합니다. 이 세 단계 구성은 글의 가정입니다.",
    lanes: [
      { text: "버리거나 끊음", tone: "dropped" },
      { text: "작은 모델 묶음으로", tone: "changed" },
      { text: "거절", tone: "dropped" },
    ],
  },
  {
    label: "거절당한 클라이언트",
    summary: "다시 보내는 간격이 효과를 정함",
    note: "곧바로 다시 보내면 포화가 풀리지 않습니다. 응답에 다시 시도할 시점을 알려 주고 클라이언트가 지수 backoff로 간격을 벌려야 버린 효과가 남습니다.",
    lanes: [
      { text: "버리거나 끊음", tone: "dropped" },
      { text: "작은 모델 묶음으로", tone: "changed" },
      { text: "거절 응답을 받음", tone: "dropped" },
    ],
  },
];

const TONE = {
  normal: "border-border text-muted-foreground",
  changed: "border-amber-600 font-bold text-amber-700 dark:text-amber-400",
  dropped: "border-dashed border-red-600 font-bold text-red-700 dark:text-red-400",
} as const;

export default function DegradationOrderViz() {
  return (
    <SceneShell
      eyebrow="저하 순서 (가정)"
      title="넘칠수록 덜 중요한 요청부터 포기하도록 순서를 만들 수 있습니다"
      description="위에서 아래로 포기하는 순서이며, 어떤 요청을 어느 단계에 둘지는 글의 가정입니다."
      ariaLabel="일괄 요약, 동의한 요청, 대화형 요청 순서로 저하하는 세 단계와 거절 뒤 재시도"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene, sceneIndex) => (
            <div key={scene.label}>
              <div className="space-y-1.5">
                {scene.lanes.map((lane, index) => (
                  <div key={index} className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center gap-2 rounded-lg border border-border/60 bg-background px-2 py-1.5 text-xs sm:gap-3 sm:px-3 sm:text-sm">
                    <span className="font-semibold">{index + 1}. {LANE_NAMES[index]}</span>
                    <span className={`rounded-md border px-2 py-1 leading-5 ${TONE[lane.tone]}`}>{lane.text}</span>
                  </div>
                ))}
              </div>
              <div className={`mt-2 grid grid-cols-2 gap-2 text-xs leading-5 sm:text-sm ${sceneIndex === 3 ? "" : "invisible"}`} aria-hidden={sceneIndex !== 3}>
                <div className="rounded-lg border border-dashed border-red-600 px-2 py-1">
                  <span className="block font-bold text-red-700 dark:text-red-400">곧바로 재전송</span>
                  포화가 풀리지 않음
                </div>
                <div className="rounded-lg border border-green-600 px-2 py-1">
                  <span className="block font-bold text-green-700 dark:text-green-400">알려 준 시점 + backoff</span>
                  버린 효과가 남음
                </div>
              </div>
            </div>
          ))}
        />
      )}
    />
  );
}
