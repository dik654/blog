import SceneShell from "./SceneShell";
import TimeLanes, { type LaneRow } from "./TimeLanes";

/**
 * 본문 대응: #named-async-barrier — PTX 9.0 생산자·소비자 예. barrier 0과 1은 방향이 반대인 두 완료 표시다.
 * 가로는 진행 순서입니다. 64는 PTX 예제의 thread 수이며 생산자와 소비자의 인원 배분은 본문에 없어 적지 않습니다.
 */
const WRITE = { from: 0, to: 3, label: "쓰기", tone: "send" } as const;
const ARRIVE0 = { from: 3, to: 6, label: "arrive 0", tone: "flag" } as const;
const SYNC0 = { from: 3, to: 6, label: "sync 0", tone: "barrier" } as const;
const READ = { from: 6, to: 9, label: "읽기", tone: "run" } as const;
const ARRIVE1 = { from: 9, to: 12, label: "arrive 1", tone: "flag" } as const;
const SYNC1 = { from: 9, to: 12, label: "sync 1", tone: "barrier" } as const;
const REWRITE = { from: 12, to: 15, label: "덮기", tone: "send" } as const;

const SCENES: readonly { label: string; summary: string; note: string; lanes: readonly LaneRow[] }[] = [
  {
    label: "생산 쪽 알림",
    summary: "bar.arrive 0,64",
    note: "생산자 쪽은 쓰기 뒤 도착만 알립니다. 소비자가 올 때까지 멈춰 서지 않습니다. 64명 모두가 같은 barrier 0에 모입니다.",
    lanes: [{ name: "생산자", segs: [WRITE, ARRIVE0] }, { name: "소비자", segs: [] }],
  },
  {
    label: "소비 쪽 대기",
    summary: "bar.sync 0,64 뒤 읽기",
    note: "소비자 쪽은 같은 번호 0으로 bar.sync를 지난 뒤 읽습니다. 번호가 같아야 같은 완료를 기다립니다.",
    lanes: [{ name: "생산자", segs: [WRITE, ARRIVE0] }, { name: "소비자", segs: [{ from: 0, to: 3, label: "일", tone: "idle" }, SYNC0, READ] }],
  },
  {
    label: "반대 방향 완료",
    summary: "barrier 1 → 덮어쓰기 허용",
    note: "소비가 끝난 뒤에는 barrier 1로 반대 방향의 완료를 알립니다. 생산자는 이것을 지나야 다음 값을 씁니다. 그래서 번호가 두 개 필요합니다.",
    lanes: [{ name: "생산자", segs: [WRITE, ARRIVE0, { from: 6, to: 9, label: "다른 일", tone: "idle" }, SYNC1, REWRITE] }, { name: "소비자", segs: [{ from: 0, to: 3, label: "일", tone: "idle" }, SYNC0, READ, ARRIVE1] }],
  },
  {
    label: "번호가 어긋나면",
    summary: "같은 완료가 아님",
    note: "named barrier는 0–15의 논리적 자원 번호로 대기점을 구별합니다. 이렇게 잘못 적으면 소비자는 생산 완료가 아닌 다른 대기점을 기다리므로 읽기 전에 7이 보인다는 보장이 없습니다. PTX 예의 구조에는 이런 조합이 없습니다.",
    lanes: [{ name: "생산자", segs: [WRITE, { from: 3, to: 6, label: "arrive 0", tone: "bad" }] }, { name: "소비자", segs: [{ from: 0, to: 3, label: "일", tone: "idle" }, { from: 3, to: 6, label: "sync 1", tone: "bad" }, { from: 6, to: 9, label: "읽기?", tone: "bad" }] }],
  },
];

export default function NamedBarrierViz() {
  return (
    <SceneShell
      eyebrow="번호 붙은 대기점"
      title="생산과 소비를 번호 두 개로 어떻게 맞물릴까요"
      description="PTX(NVIDIA GPU의 저수준 명령 표기) ISA 9.0의 생산자·소비자 예입니다. 가로는 진행 순서이고, arrive 칸은 도착만 알리는 지점, sync 칸은 기다리는 지점입니다."
      ariaLabel="barrier 0으로 생산 완료를, barrier 1로 소비 완료를 알리는 순서"
      scenes={SCENES}
      render={(index) => <TimeLanes lanes={SCENES[index].lanes} max={15} />}
    />
  );
}
