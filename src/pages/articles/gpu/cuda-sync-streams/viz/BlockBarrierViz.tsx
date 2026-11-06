import SceneShell from "./SceneShell";
import TimeLanes, { type LaneRow } from "./TimeLanes";

/**
 * 본문 대응: #block-sync — thread0의 7 쓰기 → block barrier → thread1 읽기, barrier가 하지 않는 일 셋.
 * 가로는 진행 순서이며 시간 수치가 아닙니다. x++ 장면: 두 thread가 7을 읽어 8을 쓰면 7 + 2 = 9가 아니라 8입니다.
 */
const BAR = { from: 7, to: 10.2, label: "barrier", tone: "barrier" } as const;

const SCENES: readonly { label: string; summary: string; note: string; lanes: readonly LaneRow[] }[] = [
  {
    label: "순서 없이",
    summary: "읽을 때 7이 있다는 보장 없음",
    note: "thread1이 thread0의 쓰기보다 앞서 읽으면 7을 받는다는 보장이 없습니다. 같은 block이라는 사실만으로 순서가 생기지는 않습니다.",
    lanes: [{ name: "thread0", segs: [{ from: 5, to: 9, label: "7 쓰기", tone: "send" }] }, { name: "thread1", segs: [{ from: 1, to: 5, label: "읽기?", tone: "bad" }] }],
  },
  {
    label: "barrier로 잇기",
    summary: "쓰기 → barrier → 읽기 → 8",
    note: "참여 thread들이 같은 동기화 지점에 도달할 때까지 기다리고, 앞선 메모리 접근을 뒤의 참여 thread가 올바른 순서로 보게 됩니다. 먼저 온 thread는 대기 칸만큼 기다립니다.",
    lanes: [
      { name: "thread0", segs: [{ from: 1, to: 7, label: "7 쓰기", tone: "send" }, BAR] },
      { name: "thread1", segs: [{ from: 1, to: 3, label: "일", tone: "idle" }, { from: 3, to: 7, label: "대기", tone: "wait" }, BAR, { from: 10.2, to: 14, label: "7 읽어 8", tone: "run" }] },
    ],
  },
  {
    label: "다른 block",
    summary: "barrier 밖에서 따로 진행",
    note: "이 호출은 다른 block의 도착을 모으지 않습니다. 옆 block은 자기 일을 계속하므로 block 사이의 순서는 여기서 생기지 않습니다.",
    lanes: [
      { name: "block 0 t0", segs: [{ from: 1, to: 7, label: "7 쓰기", tone: "send" }, BAR] },
      { name: "block 0 t1", segs: [{ from: 3, to: 7, label: "대기", tone: "wait" }, BAR, { from: 10.2, to: 14, label: "7 읽어 8", tone: "run" }] },
      { name: "block 1", segs: [{ from: 1, to: 14, label: "barrier와 무관하게 진행", tone: "idle" }] },
    ],
  },
  {
    label: "x++는 다른 문제",
    summary: "두 번 더했는데 9가 아니라 8",
    note: "둘이 함께 7을 읽고 각자 8을 쓰면 증가 하나가 사라집니다. barrier는 x++를 원자적으로 만들지 않으므로 atomic 연산이나 별도 출력 영역이 필요합니다.",
    lanes: [
      { name: "thread0", segs: [{ from: 1, to: 7, label: "7 읽기", tone: "idle" }, { from: 7, to: 13, label: "8 쓰기", tone: "bad" }] },
      { name: "thread1", segs: [{ from: 1, to: 7, label: "7 읽기", tone: "idle" }, { from: 7, to: 13, label: "8 쓰기", tone: "bad" }] },
    ],
  },
  {
    label: "한쪽만 barrier로",
    summary: "미도착 → 동작 미정의",
    note: "참여할 thread가 종료하지 않은 채 다른 경로로 빠져 같은 지점에 오지 않으면 동작이 정의되지 않습니다. 조건은 block에서 동일하게 평가되어야 합니다.",
    lanes: [
      { name: "thread0", segs: [{ from: 1, to: 3, label: "참", tone: "idle" }, { from: 3, to: 14, label: "상대가 오지 않음 · 미정의", tone: "bad" }] },
      { name: "thread1", segs: [{ from: 1, to: 3, label: "거짓", tone: "idle" }, { from: 3, to: 14, label: "다른 경로 · barrier 없음", tone: "send" }] },
    ],
  },
];

export default function BlockBarrierViz() {
  return (
    <SceneShell
      eyebrow="block 안의 순서"
      title="block barrier는 무엇을 보장하고 무엇을 보장하지 않을까요"
      description="가로는 진행 순서이며 시간 수치가 아닙니다. barrier 칸이 __syncthreads() 지점입니다."
      ariaLabel="thread 사이 쓰기와 읽기 순서, 다른 block, x++, 갈라진 경로에서 block barrier가 하는 일과 하지 않는 일"
      scenes={SCENES}
      render={(index) => <TimeLanes lanes={SCENES[index].lanes} max={14} />}
    />
  );
}
