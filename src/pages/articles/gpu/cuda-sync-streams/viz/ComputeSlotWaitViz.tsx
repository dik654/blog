import SceneShell from "./SceneShell";
import TimeLanes, { type LaneRow } from "./TimeLanes";

/**
 * 본문 대응: #picture — B는 4ms에 도착하지만 계산 자리가 7ms에 비어 3ms를 기다린다. A의 8은 7ms에 계산한 곳, 9ms에 읽는 쪽.
 * 2·5·2ms와 계산 자리 하나는 글의 가정입니다.
 */
const SEND: LaneRow = { name: "보내기", segs: [{ from: 0, to: 2, label: "A", tone: "send" }, { from: 2, to: 4, label: "B", tone: "send" }] };
const RUN_A = { from: 2, to: 7, label: "A 계산", tone: "run" } as const;
const RUN_B = { from: 7, to: 12, label: "B 계산", tone: "run" } as const;
const FETCH: LaneRow = { name: "가져오기", segs: [{ from: 7, to: 9, label: "A", tone: "fetch" }, { from: 12, to: 14, label: "B", tone: "fetch" }] };

const SCENES = [
  { label: "B 도착", summary: "B 입력 도착 = 4ms", note: "A를 계산하는 동안 비어 있는 보내기 통로로 B가 먼저 도착합니다. 보내기와 계산은 서로 다른 자원이라 겹칠 수 있습니다." },
  { label: "바로 계산한다면", summary: "4–7ms 겹침 → 불가능", note: "4ms에 B 계산을 놓으면 4–7ms에 A와 B가 계산 자리 하나를 함께 쓰게 됩니다. 이번 가정에서는 그릴 수 없는 시간표입니다." },
  { label: "3ms 기다리면", summary: "7 − 4 = 3ms 대기", note: "B는 도착한 상태로 A가 끝나는 7ms까지 기다린 뒤 7–12ms에 계산하고 12–14ms에 돌아옵니다. 보내기가 계산과 겹쳤다고 계산끼리 겹친 것은 아닙니다." },
  { label: "8은 어디에", summary: "7ms 계산한 곳 · 9ms 읽는 쪽", note: "A의 8은 계산이 끝난 7ms에 계산할 곳에 있고, 읽는 사람 쪽에 완전히 돌아오는 때는 9ms입니다. 그래서 7–9ms에는 A를 가져오면서 B를 계산합니다." },
] as const;

function lanes(index: number): LaneRow[] {
  if (index === 0) return [SEND, { name: "계산", segs: [RUN_A] }, { name: "B 상태", segs: [{ from: 4, to: 14, label: "도착함", tone: "idle" }] }];
  if (index === 1) return [SEND, { name: "계산", segs: [RUN_A] }, { name: "B 계산?", segs: [{ from: 4, to: 9, label: "A와 겹침", tone: "bad" }] }];
  if (index === 2) return [SEND, { name: "계산", segs: [RUN_A, RUN_B] }, FETCH, { name: "B 상태", segs: [{ from: 4, to: 7, label: "대기", tone: "wait" }] }];
  return [SEND, { name: "계산", segs: [RUN_A, RUN_B] }, FETCH, { name: "A의 8", segs: [{ from: 7, to: 9, label: "이동", tone: "idle" }, { from: 9, to: 14, label: "읽는 쪽", tone: "fetch" }] }];
}

export default function ComputeSlotWaitViz() {
  return (
    <SceneShell
      eyebrow="도착과 시작 사이"
      title="B가 4ms에 도착했는데 왜 7ms까지 시작하지 못할까요"
      description="같은 줄의 칸은 겹칠 수 없습니다. 2·5·2ms와 계산 자리 하나는 앞에서 놓은 가정이며 측정값이 아닙니다."
      ariaLabel="B의 도착, 계산 자리 겹침, 3밀리초 대기, A의 8의 위치를 시간표로 보여 주는 네 장면"
      scenes={SCENES}
      render={(index) => <TimeLanes lanes={lanes(index)} max={14} ticks={[0, 2, 4, 7, 9, 12, 14]} unit="ms" />}
    />
  );
}
