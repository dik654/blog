import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #overview의 세 예측 질문과 #agent-loop 식 a_t=P(s_t), o_t=E(G(a_t)), s_{t+1}=U(s_t,o_t).
 * 같은 다섯 칸(제안 → gate → 실행 → 관측 → 다음 state)에 갈래 넷을 놓아,
 * 어디서 멈추고 무엇이 다음 state에 들어가는지 비교합니다.
 */

type SlotState = "on" | "off" | "stop";

interface Slot {
  value: string;
  state: SlotState;
}

const SLOT_NAMES = [
  { name: "제안", symbol: "a_t", hint: "Model이 고른 tool과 input" },
  { name: "Runtime gate", symbol: "G", hint: "identity·scope·approval 판정" },
  { name: "실행", symbol: "E", hint: "허용된 call을 실제 환경에 적용" },
  { name: "관측", symbol: "o_t", hint: "status·payload·error" },
  { name: "다음 state", symbol: "s_{t+1}", hint: "다음 판단의 근거" },
] as const;

const SCENES: readonly {
  label: string;
  summary: string;
  slots: readonly Slot[];
  verdict: string;
  note: string;
}[] = [
  {
    label: "Edit 제안이 gate에서 거부될 때",
    summary: "file 변화 없음",
    slots: [
      { value: "auth.ts Edit", state: "on" },
      { value: "거부", state: "stop" },
      { value: "실행되지 않음", state: "off" },
      { value: "거부 observation", state: "on" },
      { value: "file은 그대로 · 거부 기록만 추가", state: "on" },
    ],
    verdict: "올바른 patch라도 제안만으로는 workspace effect가 생기지 않습니다.",
    note: "첫째 질문의 답입니다. G가 거부하면 E는 실행되지 않고, 거부 observation만 다음 state에 들어갑니다.",
  },
  {
    label: "검색이 실행됐지만 exit 1일 때",
    summary: "실패 status가 기록됨",
    slots: [
      { value: "auth.ts 검색", state: "on" },
      { value: "통과", state: "on" },
      { value: "검색 command 실행", state: "on" },
      { value: "exit 1 + error", state: "stop" },
      { value: "실패한 검색이라는 사실", state: "on" },
    ],
    verdict: "다음 state에는 성공한 검색 결과와 같은 값이 들어가지 않습니다.",
    note: "둘째 질문의 답입니다. Harness는 exit status까지 observation으로 돌려주므로, Model은 실패를 근거로 다음 행동을 고릅니다.",
  },
  {
    label: "검색이 성공할 때",
    summary: "결과가 다음 근거가 됨",
    slots: [
      { value: "auth.ts 검색", state: "on" },
      { value: "통과", state: "on" },
      { value: "검색 command 실행", state: "on" },
      { value: "성공 status + 검색 결과", state: "on" },
      { value: "검색 결과가 다음 근거", state: "on" },
    ],
    verdict: "같은 제안이라도 관측이 다르면 다음 state가 다릅니다.",
    note: "다음 state는 기존 state에 이번 관측을 합쳐 만듭니다. 그래서 둘째 장면과 셋째 장면은 같은 제안에서 출발해도 서로 다른 다음 판단으로 이어집니다.",
  },
  {
    label: "Model이 “수정 완료”라고 말할 때",
    summary: "판정은 verifier가",
    slots: [
      { value: "“수정 완료” 문장", state: "on" },
      { value: "tool call 제안이 아님", state: "off" },
      { value: "실행할 것 없음", state: "off" },
      { value: "새 관측 없음", state: "off" },
      { value: "test 통과로 판정하지 않음", state: "stop" },
    ],
    verdict: "Verifier가 재현 test와 regression test를 다시 실행해 완료를 판정합니다.",
    note: "셋째 질문의 답입니다. 완료 문장은 Model의 제안일 뿐이고, 완료는 Model의 문장과 독립된 verifier의 증거로 판정합니다.",
  },
];

const slotTone: Record<SlotState, string> = {
  on: "border-border bg-background text-foreground",
  off: "border-dashed border-border/70 bg-background text-muted-foreground/70",
  stop: "border-primary bg-primary/10 text-foreground",
};

function SceneDiagram({ index }: { index: number }) {
  const scene = SCENES[index];
  return (
    <div className="min-w-0">
      <ol className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-5">
        {scene.slots.map((slot, slotIndex) => {
          const meta = SLOT_NAMES[slotIndex];
          return (
            <li
              key={meta.name}
              className={`flex min-w-0 items-start gap-3 rounded-lg border px-3 py-1.5 sm:flex-col sm:py-2 sm:gap-1 ${slotTone[slot.state]}`}
            >
              <span className="w-[7.5rem] shrink-0 sm:w-auto">
                <span className="block text-[11px] font-bold text-muted-foreground">
                  {slotIndex + 1}. {meta.name} <span className="font-mono">{meta.symbol}</span>
                </span>
                <span className="hidden text-[10px] leading-4 text-muted-foreground sm:block">{meta.hint}</span>
              </span>
              <span className="min-w-0 break-keep text-sm font-bold leading-5">
                {slot.state === "stop" ? "■ " : slot.state === "off" ? "– " : ""}
                {slot.value}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 rounded-lg border border-border px-3 py-2 text-sm leading-6">
        <span className="font-bold text-primary">결과 · </span>
        {scene.verdict}
      </p>
    </div>
  );
}

export function ProposalBranchViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const labels = SCENES.map((scene) => scene.label);
  return (
    <VizFrame
      eyebrow="한 step의 네 갈래"
      title="제안 하나가 다음 state가 되기까지"
      description="Model이 tool call을 제안하면(a_t) runtime gate G가 identity·scope·approval을 판정하고, 통과한 call만 executor E가 실행해 observation o_t(status·payload·error)를 돌려줍니다. 갈래마다 어디서 멈추고 무엇이 다음 state에 들어가는지 봅니다. ■는 결과가 갈리는 칸, –는 거치지 않는 칸입니다."
      note="“로그인 실패를 재현하고 최소 수정한 뒤 test하라”는 본문 요청을 그대로 씁니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Model 제안이 gate, 실행, 관측을 거쳐 다음 state가 되는 네 갈래"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene, index) => (
            <SceneDiagram key={scene.label} index={index} />
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
