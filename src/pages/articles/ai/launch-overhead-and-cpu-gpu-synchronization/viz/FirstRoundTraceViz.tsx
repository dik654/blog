import SceneShell from "./SceneShell";
import TimeLanes, { LaneLegend, type LaneSpan } from "./TimeLanes";
import { GOOD, PREP, SEND, WAIT, WORK } from "./laneColors";

/**
 * 본문 대응: #case — 준비 0–2, 첫 지시 2–5, 첫 계산 5–7(3→4), 둘째 지시 5–8, 둘째 계산 8–10(4→8).
 * 8 μs부터 다음 회 준비가 가능하다. 값 8은 10 μs에, 시각 8 μs는 둘째 지시 전달 끝에 해당한다.
 */
const MAX = 11;
const TICKS = [0, 2, 5, 7, 8, 10] as const;

const P: LaneSpan = { from: 0, to: 2, color: PREP, text: "준비" };
const S1: LaneSpan = { from: 2, to: 5, color: SEND, dark: true, text: "지시1" };
const S2: LaneSpan = { from: 5, to: 8, color: SEND, dark: true, text: "지시2" };
const NEXT: LaneSpan = { from: 8, to: 10, color: PREP, text: "다음" };
const W1: LaneSpan = { from: 5, to: 7, color: WORK, dark: true, text: "+1" };
const GAP: LaneSpan = { from: 7, to: 8, color: WAIT, dashed: true };
const W2: LaneSpan = { from: 8, to: 10, color: WORK, dark: true, text: "×2" };
const value = (from: number, to: number, text: string): LaneSpan => ({ from, to, color: GOOD, dark: true, text });

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  prep: readonly LaneSpan[];
  work: readonly LaneSpan[];
  values: readonly LaneSpan[];
}[] = [
  { label: "준비", summary: "0–2 μs", prep: [P], work: [], values: [value(0, 2, "3")], note: "아직 전달한 지시가 없어 계산하는 쪽은 할 일이 없습니다. 값은 처음의 3입니다." },
  { label: "첫 지시 전달", summary: "2–5 μs", prep: [P, S1], work: [], values: [value(0, 5, "3")], note: "지시가 완전히 전달된 뒤에만 계산을 시작할 수 있으므로 5 μs까지 기다립니다." },
  { label: "전달과 계산이 겹칩니다", summary: "5–7 μs 계산, 5–8 μs 전달", prep: [P, S1, S2], work: [W1], values: [value(0, 7, "3")], note: "첫 계산이 도는 동안 준비하는 쪽은 둘째 지시를 보냅니다. 계산은 7 μs에 끝나 4를 만듭니다." },
  { label: "계산하는 쪽의 빈 구간", summary: "7–8 μs 빔, 8–10 μs 계산", prep: [P, S1, S2], work: [W1, GAP, W2], values: [value(0, 7, "3"), value(7, 10, "4")], note: "앞 결과는 7 μs에 있지만 둘째 지시는 8 μs에 도착합니다. 점선 칸만큼 비었다가 8 μs에 둘째 계산을 시작합니다." },
  { label: "숫자 8은 두 번 나옵니다", summary: "시각 8 μs ≠ 값 8", prep: [P, S1, S2, NEXT], work: [W1, GAP, W2], values: [value(0, 7, "3"), value(7, 10, "4"), value(10, 11, "8")], note: "8 μs는 둘째 지시를 다 보낸 시각이고, 준비하는 쪽은 여기서 다음 회를 준비할 수 있습니다. 답인 값 8을 쓸 수 있는 시각은 10 μs입니다." },
];

export default function FirstRoundTraceViz() {
  return (
    <SceneShell
      eyebrow="첫 회의 시간표"
      title="첫 회 10 μs를 한 구간씩 따라갑니다"
      description="(가정) 한 회 준비 2 μs, 지시 전달 3 μs, 계산 2 μs입니다. 세 줄이 같은 시간축을 씁니다."
      ariaLabel="첫 회의 준비, 전달, 계산, 값의 변화를 시간순으로 추적"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <TimeLanes
              max={MAX}
              ticks={TICKS}
              lanes={[
                { label: "준비하는 쪽", spans: scene.prep },
                { label: "계산하는 쪽", spans: scene.work },
                { label: "현재 값", spans: scene.values },
              ]}
            />
            <LaneLegend items={[{ color: PREP, label: "준비" }, { color: SEND, label: "지시 전달" }, { color: WORK, label: "계산" }, { color: WAIT, label: "빈 구간", dashed: true }, { color: GOOD, label: "결과 값" }]} />
          </div>
        );
      }}
    />
  );
}
