import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #agentic-training — sample이 prompt–answer 한 쌍이 아니라
 * action과 observation이 이어지는 trajectory라는 점과 AlgorithmBlock의 rollout 6단계.
 * test 실행 → 실패 → 파일 수정 → 재실행 → 통과라는 세 turn은 설명을 위한 가정입니다.
 */
const SCENES = [
  {
    label: "Reset: 새 environment",
    summary: "state₀ ← E.reset(goal=x)",
    turns: 0,
    note: "Task마다 새 environment E를 만들고 filesystem·credentials·network 권한을 고정합니다. 이 시점의 기록은 goal 하나뿐입니다. 비교하면 SFT sample은 prompt와 응답 한 쌍으로 끝나지만, 이 기록은 turn마다 길어집니다.",
  },
  {
    label: "Turn 0 · test 실행",
    summary: "observation: 실패 (가정)",
    turns: 1,
    note: "Policy πθ, 곧 다음 action을 고르는 model이 history, 곧 goal과 지금까지의 action·observation 기록을 보고 tool call을 고릅니다. Environment가 돌려준 실패 observation이 history에 붙고, 지워지지 않은 채 다음 판단의 조건으로 남습니다.",
  },
  {
    label: "Turn 1 · 파일 수정",
    summary: "effect: environment가 바뀜",
    turns: 2,
    note: "이번 tool call은 파일을 실제로 바꿉니다. Tool output뿐 아니라 이 effect도 기록합니다. Environment가 바뀌었으니 다음 state도 앞과 다릅니다. 실패 관측 뒤에 고른 이 복구 경로까지 학습 data가 될 수 있습니다.",
  },
  {
    label: "Turn 2 · test 재실행",
    summary: "observation: 통과로 종료",
    turns: 3,
    note: "Success/failure terminal state나 turn·token·wall-clock budget에 닿을 때까지 action과 observation이 반복됩니다. 여기서는 세 번째 turn에서 통과하며 끝났다고 가정했습니다.",
  },
  {
    label: "Verifier 채점",
    summary: "reward, receipt ← V(…)",
    turns: 3,
    note: "Verifier V는 결과를 채점하는 검사기입니다. 최종 artifact, trajectory, 실제 effect를 함께 받되 final answer와 실행 흔적·side effect를 분리해 채점하고 reward와 receipt를 남깁니다.",
  },
  {
    label: "학습 신호로 변환",
    summary: "accepted trajectory → policy 후보",
    turns: 3,
    note: "받아들인 trajectory를 SFT·RL·OPD 가운데 고른 objective에 맞는 신호로 바꿔 dataset이나 policy를 갱신합니다. 남는 것은 versioned trajectory, verifier receipt, 갱신된 policy 후보입니다.",
  },
] as const;

const TURNS = [
  { action: "test 실행", observation: "test 실패" },
  { action: "파일 수정", observation: "수정 완료" },
  { action: "test 재실행", observation: "test 통과" },
] as const;

const TEST_STATE = ["미실행", "실패", "마지막 결과 실패 · 재실행 전", "통과", "통과", "통과"] as const;

function Slot({ children, on, tone }: { children: ReactNode; on: boolean; tone: "action" | "observation" | "goal" }) {
  const color =
    tone === "action"
      ? "border-sky-600 text-sky-800 dark:text-sky-300"
      : tone === "observation"
        ? "border-amber-600 text-amber-800 dark:text-amber-300"
        : "border-border text-foreground";
  return (
    <div
      className={`min-w-0 break-keep rounded-md border px-2 py-1 text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none ${
        on ? `${color} opacity-100` : "border-dashed border-border text-muted-foreground opacity-40"
      }`}
    >
      {children}
    </div>
  );
}

function Box({ title, value, on }: { title: string; value: string; on: boolean }) {
  return (
    <div className={`min-w-0 rounded-md border px-2 py-1 text-xs leading-5 ${on ? "border-primary" : "border-dashed border-border text-muted-foreground"}`}>
      <span className="font-bold">{title}</span> <span className="break-keep">{value}</span>
    </div>
  );
}

export default function AgentTrajectoryViz() {
  return (
    <SceneShell
      eyebrow="Trajectory rollout"
      title="Agentic training의 sample은 turn마다 길어지는 기록입니다"
      description="Trajectory는 action(행동)과 observation(관측)이 차례로 이어진 기록입니다. 파란 칸은 model이 고른 action, 주황 칸은 environment가 돌려준 observation이고, E·verifier·objective 칸은 그때의 environment E와 채점·학습 단계입니다."
      note="test 실행 → 실패 → 파일 수정 → 재실행 → 통과라는 세 turn은 설명을 위한 가정이며, 특정 모델의 실제 기록이 아닙니다."
      ariaLabel="Agentic trajectory가 reset, 세 turn, verifier 채점, 학습 신호 변환을 거치는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const fileChanged = scene.turns >= 2;
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] sm:gap-5">
            <div className="min-w-0 space-y-1.5">
              <Slot on tone="goal">goal x · test를 통과시키기 (가정)</Slot>
              {TURNS.map((turn, index) => (
                <div key={turn.action} className="grid grid-cols-2 gap-1.5">
                  <Slot on={scene.turns > index} tone="action">
                    a<sub>{index}</sub> · {turn.action}
                  </Slot>
                  <Slot on={scene.turns > index} tone="observation">
                    o<sub>{index + 1}</sub> · {turn.observation}
                  </Slot>
                </div>
              ))}
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-1.5 sm:grid-cols-1">
              <Box title="E 파일" value={fileChanged ? "수정됨 (effect)" : "원본 · 권한 고정"} on={fileChanged} />
              <Box title="E test" value={TEST_STATE[active]} on={active >= 1} />
              <Box title="verifier V" value={active >= 4 ? "artifact·trajectory·effect → reward·receipt" : "채점 전"} on={active >= 4} />
              <Box title="objective" value={active >= 5 ? "SFT·RL·OPD 중 하나 → policy 후보" : "갱신 전"} on={active >= 5} />
            </div>
          </div>
        );
      }}
    />
  );
}
