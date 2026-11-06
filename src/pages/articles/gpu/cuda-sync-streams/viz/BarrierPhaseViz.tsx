import SceneShell from "./SceneShell";
import TimeLanes, { type LaneRow } from "./TimeLanes";

/**
 * 본문 대응: #named-async-barrier — cuda::barrier의 기대 도착 수 2 → 1 → 0과 arrive/wait 분리.
 * 가로는 진행 순서입니다. 이것은 C++ barrier의 작은 예로 PTX named barrier와는 별개입니다.
 */
const P_WRITE = { from: 0, to: 3, label: "쓰기", tone: "send" } as const;
const Q_WRITE = { from: 0, to: 5, label: "쓰기", tone: "send" } as const;
const P_ARRIVE = { from: 3, to: 6, label: "arrive", tone: "flag" } as const;
const Q_ARRIVE = { from: 5, to: 8, label: "arrive", tone: "flag" } as const;
const P_WORK = { from: 6, to: 10, label: "독립 계산", tone: "idle" } as const;
const Q_WORK = { from: 8, to: 10, label: "계산", tone: "idle" } as const;
const WAIT_P = { from: 10, to: 12.5, label: "wait", tone: "barrier" } as const;
const WAIT_Q = { from: 10, to: 12.5, label: "wait", tone: "barrier" } as const;
const READ = { from: 12.5, to: 15, label: "읽기", tone: "run" } as const;

const SCENES: readonly { label: string; summary: string; count: number; note: string; lanes: readonly LaneRow[] }[] = [
  { label: "회차 시작", summary: "기대 도착 수 2", count: 2, note: "초기화가 모든 참여보다 먼저 끝나야 합니다. 두 참여자가 각자 한 번 도착한다면 기대 수는 2입니다.", lanes: [{ name: "참여자 1", segs: [P_WRITE] }, { name: "참여자 2", segs: [Q_WRITE] }] },
  { label: "첫 도착", summary: "2 → 1", count: 1, note: "공유할 값을 쓴 뒤 arrive에서 token(이번 회차를 가리키는 값)을 얻습니다. 첫 참여자는 멈추지 않고 상대 값에 의존하지 않는 계산을 이어 갑니다.", lanes: [{ name: "참여자 1", segs: [P_WRITE, P_ARRIVE, P_WORK] }, { name: "참여자 2", segs: [Q_WRITE] }] },
  { label: "둘째 도착", summary: "1 → 0 · 회차 끝", count: 0, note: "둘째 참여자가 도착하면 기대 수가 0이 되어 그 회차가 끝납니다.", lanes: [{ name: "참여자 1", segs: [P_WRITE, P_ARRIVE, P_WORK] }, { name: "참여자 2", segs: [Q_WRITE, Q_ARRIVE, Q_WORK] }] },
  { label: "wait 뒤 읽기", summary: "wait(token) → 상대 값", count: 0, note: "각자 wait(token) 뒤에 상대 값을 읽습니다. arrive 이전의 쓰기가 해당 wait 이후의 참여자에게 보입니다. Token이 나타내는 회차와 phase의 사용 조건은 지켜야 합니다.", lanes: [{ name: "참여자 1", segs: [P_WRITE, P_ARRIVE, P_WORK, WAIT_P, READ] }, { name: "참여자 2", segs: [Q_WRITE, Q_ARRIVE, Q_WORK, WAIT_Q, READ] }] },
  { label: "한 명이 빠지면", summary: "1에서 멈춤", count: 1, note: "참가자가 빠지면 필요한 도착 수가 채워지지 않습니다. 전체 block이나 warp를 맞추는 단순한 경우에는 공식 가이드가 __syncthreads와 __syncwarp를 권장합니다.", lanes: [{ name: "참여자 1", segs: [P_WRITE, P_ARRIVE, P_WORK, { from: 10, to: 15, label: "wait 끝나지 않음", tone: "bad" }] }, { name: "참여자 2", segs: [{ from: 0, to: 15, label: "오지 않음", tone: "bad" }] }] },
];

export default function BarrierPhaseViz() {
  return (
    <SceneShell
      eyebrow="도착 세기"
      title="arrive와 wait 사이에서 기대 수는 어떻게 줄어들까요"
      description="cuda::barrier에 두 참여자를 둔 작은 예입니다. 가로는 진행 순서이며 앞의 PTX 예와는 별개입니다."
      ariaLabel="기대 도착 수가 2에서 0으로 줄고 wait 뒤 값을 읽는 과정과 한 참여자가 빠진 경우"
      scenes={SCENES}
      render={(index) => (
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">남은 도착 수</span>
            {[2, 1, 0].map((value) => (
              <span
                key={value}
                className={`flex h-8 w-8 items-center justify-center rounded-sm border font-mono text-sm font-bold ${value === SCENES[index].count ? "border-primary bg-primary text-primary-foreground" : "border-border/70 text-muted-foreground"}`}
              >
                {value}
              </span>
            ))}
          </div>
          <TimeLanes lanes={SCENES[index].lanes} max={15} />
        </div>
      )}
    />
  );
}
