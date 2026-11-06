import SceneShell from "./SceneShell";
import TimeLanes, { type LaneRow, type TimeMark } from "./TimeLanes";

/**
 * 본문 대응: #event-time — 제출 시간과 장치 완료 시간, 여러 stream의 join, 대기의 포함, 기본 줄에 기댄 계측.
 * A 0–9ms, B 2–14ms는 글의 2·5·2ms 모형입니다. B 구간 14 − 2 = 12ms = 자기 일 9ms + 대기 3ms(본문 숫자에서 계산).
 * NonBlocking 장면의 stop 위치는 본문에 숫자가 없어 "worker가 끝나기 전"이라는 관계만 그렸습니다.
 */
const A_PARTS = [{ from: 0, to: 2, label: "H", tone: "send" }, { from: 2, to: 7, label: "kernel", tone: "run" }, { from: 7, to: 9, label: "D", tone: "fetch" }] as const;
const B_PARTS = [{ from: 2, to: 4, label: "H", tone: "send" }, { from: 4, to: 7, label: "대기", tone: "wait" }, { from: 7, to: 12, label: "kernel", tone: "run" }, { from: 12, to: 14, label: "D", tone: "fetch" }] as const;

const SCENES: readonly { label: string; summary: string; note: string; lanes: readonly LaneRow[]; marks: readonly TimeMark[]; ticks: readonly number[] }[] = [
  {
    label: "CPU 시계만 재면",
    summary: "완료가 잡히지 않음",
    note: "CPU 시계로 호출 전후만 재면 호출이 돌아오는 짧은 구간만 잡힙니다. 장치에서 끝나는 때는 이 구간 밖에 있습니다.",
    lanes: [{ name: "CPU 시계", segs: [{ from: 0, to: 2.6, label: "잰 곳", tone: "bad" }] }, { name: "장치", segs: A_PARTS }],
    marks: [],
    ticks: [0, 9],
  },
  {
    label: "같은 stream에 표식",
    summary: "9 − 0 = 9ms",
    note: "같은 stream에 start, 작업, stop을 차례로 넣고 stop의 완료를 확인한 뒤 장치 시각의 차이를 구합니다. Timing을 끈 event로는 못 합니다.",
    lanes: [{ name: "stream A", segs: A_PARTS }],
    marks: [{ at: 0, label: "start" }, { at: 9, label: "stop" }],
    ticks: [0, 9],
  },
  {
    label: "여러 stream의 전체",
    summary: "stop = 14ms",
    note: "worker가 시작 표식을 기다리고, 각 worker의 마지막 표식을 join stream이 기다립니다. 그 줄에 stop을 기록하면 모든 작업이 stop보다 앞에 놓입니다.",
    lanes: [{ name: "worker A", segs: A_PARTS }, { name: "worker B", segs: B_PARTS }, { name: "join", segs: [{ from: 0, to: 14, label: "A·B의 마지막 표식 기다림", tone: "wait" }] }],
    marks: [{ at: 0, label: "start" }, { at: 14, label: "stop" }],
    ticks: [0, 9, 14],
  },
  {
    label: "구간에 든 기다림",
    summary: "14 − 2 = 12ms = 9 + 3 대기",
    note: "B의 일은 2 + 5 + 2 = 9ms인데 B를 감싼 event 구간은 12ms입니다. 계산 자리를 기다린 3ms가 들어갑니다. event 구간에는 경합과 대기도 반영될 수 있습니다.",
    lanes: [{ name: "worker A", segs: A_PARTS }, { name: "worker B", segs: B_PARTS }],
    marks: [{ at: 2, label: "B start" }, { at: 14, label: "B stop" }],
    ticks: [0, 2, 14],
  },
  {
    label: "기본 줄에 기댄 계측",
    summary: "legacy면 stop이 뒤에 놓임",
    note: "공식 simpleMultiCopy는 기본 줄에 start와 stop을 기록합니다. legacy 기본 줄의 암묵적 연결 덕분에 stop이 일반 stream 작업 뒤에 놓입니다.",
    lanes: [{ name: "worker A", segs: A_PARTS }, { name: "worker B", segs: B_PARTS }, { name: "기본 줄", segs: [{ from: 0, to: 14, label: "앞선 작업에 암묵 연결", tone: "wait" }] }],
    marks: [{ at: 0, label: "start" }, { at: 14, label: "stop" }],
    ticks: [0, 14],
  },
  {
    label: "연결이 끊기면",
    summary: "stop은 늦춰지지 않음",
    note: "per-thread 기본 모드나 NonBlocking worker에서는 연결이 빠집니다. 나중의 동기화가 끝나도 이미 찍힌 stop은 늦춰지지 않습니다. stop 위치는 설명용입니다.",
    lanes: [{ name: "worker A", segs: A_PARTS }, { name: "worker B", segs: B_PARTS }, { name: "기본 줄", segs: [{ from: 0, to: 4, label: "일찍", tone: "bad" }] }, { name: "host", segs: [{ from: 0, to: 14, label: "DeviceSynchronize 대기", tone: "wait" }] }],
    marks: [{ at: 0, label: "start" }, { at: 4, label: "stop" }],
    ticks: [0, 14],
  },
];

export default function TimingJoinViz() {
  return (
    <SceneShell
      eyebrow="시간을 재는 자리"
      title="start와 stop 표식은 어디에 놓아야 전체 시간을 잴까요"
      description="세로선이 event 표식입니다. 2·5·2ms 모형이며 실측이 아니고, CPU 시계와 이른 stop의 칸 폭은 설명용입니다. H는 H2D, D는 D2H입니다."
      ariaLabel="CPU 시계, 같은 stream 표식, 여러 stream의 join, 대기 포함, 기본 줄 연결 유무에 따른 시간 측정 비교"
      scenes={SCENES}
      render={(index) => <TimeLanes lanes={SCENES[index].lanes} marks={SCENES[index].marks} max={14} ticks={SCENES[index].ticks} unit="ms" />}
    />
  );
}
