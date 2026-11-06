import SceneShell from "./SceneShell";
import TaskLanes, { type Lane } from "./TaskLanes";

/**
 * 본문 대응: #timeline — 공유 자원 대기와 오버헤드 없이 셋이 0 ms에 준비될 때의 실행 순서.
 * 제어 0–1, 센서 1–3, 로그 3–5, 제어 5–6(로그를 밀어냄), 로그 6–7. 센서 응답 3 ms ≤ 마감 4 ms.
 */
const LANES: readonly Lane[] = [
  { name: "제어", segments: [{ from: 0, to: 1, kind: "run", label: "실행" }, { from: 5, to: 6, kind: "run", label: "실행" }] },
  { name: "센서", segments: [{ from: 0, to: 1, kind: "wait", label: "대기" }, { from: 1, to: 3, kind: "run", label: "실행 2 ms" }] },
  { name: "로그", segments: [{ from: 0, to: 3, kind: "wait", label: "준비된 채 대기" }, { from: 3, to: 5, kind: "run", label: "실행 2 ms" }, { from: 5, to: 6, kind: "wait", label: "밀림" }, { from: 6, to: 7, kind: "run", label: "1 ms" }] },
  { name: "센서 응답", segments: [{ from: 0, to: 3, kind: "span", label: "R = 대기 1 + 실행 2", showAt: 1 }] },
];

const SCENES = [
  { now: 0, label: "0 ms: 셋이 함께 준비", summary: "실행: 제어 0–1 ms", note: "셋 다 준비됐지만 코어는 하나입니다. 우선순위가 가장 높은 제어가 먼저 실행되고 센서와 로그는 준비된 채 기다립니다." },
  { now: 1, label: "1 ms: 제어가 끝남", summary: "실행: 센서 1–3 ms", note: "제어가 1 ms를 끝내고 다음 차례까지 쉽니다. 센서는 3 ms에 완료되어 4 ms 마감보다 1 ms 앞섭니다. 일한 시간은 2 ms이고 준비 뒤 걸린 시간은 3 ms입니다." },
  { now: 3, label: "3 ms: 로그 차례", summary: "실행: 로그 3–5 ms", note: "남은 작업은 로그뿐입니다. 필요한 3 ms 가운데 2 ms를 일했을 때 5 ms가 됩니다." },
  { now: 5, label: "5 ms: 제어가 다시 준비", summary: "실행: 제어 5–6 ms", note: "제어의 주기가 5 ms라 다시 준비됐습니다. 우선순위가 더 높으므로 아직 일이 남은 로그를 잠시 멈추게 합니다. 이것이 선점입니다." },
  { now: 6, label: "6 ms: 로그 재개", summary: "실행: 로그 6–7 ms", note: "제어가 끝나면 로그가 남은 1 ms를 실행합니다. 로그의 3 ms는 한 덩어리가 아니라 3–5 ms와 6–7 ms로 나뉩니다." },
] as const;

export default function PreemptionTimelineViz() {
  return (
    <SceneShell
      eyebrow="대기 없는 시간표"
      title="한 코어에서 실행되는 작업이 바뀌는 시각을 따라갑니다"
      description="가로축은 ms, 파란 칸은 실행, 테두리 칸은 준비된 채 기다리는 시간입니다. 실행 시간은 실측값이 아닌 본문의 가정이며 공유 자원 대기와 RTOS 오버헤드는 없다고 둡니다."
      ariaLabel="제어 센서 로그의 0에서 7 ms까지 실행 순서"
      scenes={SCENES}
      render={(active) => <TaskLanes lanes={LANES} maxT={7} now={SCENES[active].now} deadlineLane={1} ariaLabel={`${SCENES[active].label}. ${SCENES[active].summary}`} />}
    />
  );
}
