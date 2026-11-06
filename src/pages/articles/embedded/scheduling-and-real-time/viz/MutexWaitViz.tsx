import SceneShell from "./SceneShell";
import TaskLanes, { type Lane } from "./TaskLanes";

/**
 * 본문 대응: #blocking — 로그가 뮤텍스를 쥔 채 0 ms를 맞고 임계 구간이 2 ms 남은 경우.
 * 제어 0–1, 로그 1–3, 센서 3–5. 응답 1 + 2 + 2 = 5 ms로 마감 4 ms를 1 ms 넘긴다.
 */
const LANES: readonly Lane[] = [
  { name: "제어", segments: [{ from: 0, to: 1, kind: "run", label: "실행" }] },
  { name: "센서", segments: [{ from: 0, to: 1, kind: "wait", label: "대기" }, { from: 1, to: 3, kind: "sleep", label: "뮤텍스 기다리며 잠듦" }, { from: 3, to: 4, kind: "run", label: "실행" }, { from: 4, to: 5, kind: "over", label: "실행·초과" }] },
  { name: "로그", segments: [{ from: 0, to: 1, kind: "wait", label: "대기" }, { from: 1, to: 3, kind: "run", label: "남은 임계 구간 2 ms" }] },
  { name: "뮤텍스", segments: [{ from: 0, to: 3, kind: "span", label: "로그가 보유" }] },
  { name: "센서 응답", segments: [{ from: 0, to: 5, kind: "span", label: "R = 제어 1 + 로그 2 + 실행 2", showAt: 4 }] },
];

const SCENES = [
  { now: 0, label: "0 ms: 로그가 뮤텍스를 쥔 채", summary: "실행: 제어 0–1 ms", note: "앞서 시작한 로그가 공유 버스의 뮤텍스를 가지고 있고 자원을 쥐고 일하는 임계 구간이 2 ms 남았습니다(가정)." },
  { now: 1, label: "1 ms: 센서가 요청하지만 못 얻음", summary: "실행: 로그 1–3 ms", note: "센서는 로그보다 우선순위가 높지만 뮤텍스가 없어 잠듭니다. 잠든 작업은 실행 후보가 아니므로, 낮은 순위의 로그가 먼저 일해야 자원이 풀립니다." },
  { now: 3, label: "3 ms: 임계 구간이 끝남", summary: "실행: 센서 3 ms부터", note: "이제야 센서가 일을 시작합니다. 필요한 CPU 시간 2 ms는 그대로이므로 시작이 늦은 만큼 끝도 늦습니다." },
  { now: 4, label: "5 ms: 센서 완료", summary: "5 ms − 마감 4 ms = 1 ms 초과", note: "센서는 일을 2 ms만 했는데 준비 뒤 5 ms가 걸렸습니다. 나머지 3 ms는 제어 1 ms와 로그 2 ms를 기다린 시간입니다." },
] as const;

export default function MutexWaitViz() {
  return (
    <SceneShell
      eyebrow="자원을 기다리는 시간표"
      title="우선순위가 높은 센서가 낮은 로그를 기다려 5 ms에 끝납니다"
      description="파란 칸은 실행, 점선 칸은 자원을 기다리며 잠든 시간, 빨간 칸은 마감 뒤 실행입니다. 시작 시점과 2 ms 임계 구간은 본문의 가정이며 실측값이 아닙니다."
      ariaLabel="로그가 뮤텍스를 가진 경우 0에서 5 ms까지 실행 순서"
      scenes={SCENES}
      render={(active) => <TaskLanes lanes={LANES} maxT={5} now={SCENES[active].now} deadlineLane={1} ariaLabel={`${SCENES[active].label}. ${SCENES[active].summary}`} />}
    />
  );
}
