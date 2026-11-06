import SceneShell from "./SceneShell";
import TimeLanes, { type LaneRow, type TimeMark } from "./TimeLanes";

/**
 * 본문 대응: #host-memory — 호출 반환과 buffer 사용 끝은 다른 시점이다. H2D event는 입력, D2H event는 출력의 기준.
 * 2·5·2ms 모형입니다. host 호출과 준비 대기의 길이는 본문에 없어 시간 칸의 폭만 설명용으로 그렸습니다.
 */
const DEVICE: LaneRow = { name: "장치", segs: [{ from: 0, to: 2, label: "H2D", tone: "send" }, { from: 2, to: 7, label: "계산", tone: "run" }, { from: 7, to: 9, label: "D2H", tone: "fetch" }] };
const HOST_FREE: LaneRow = { name: "host", segs: [{ from: 0, to: 0.6, tone: "barrier" }, { from: 0.6, to: 11, label: "호출 반환 뒤 다른 일", tone: "idle" }] };
const IN_USE = { from: 0, to: 2, label: "사용", tone: "wait" } as const;

const SCENES: readonly { label: string; summary: string; note: string; lanes: readonly LaneRow[]; marks?: readonly TimeMark[] }[] = [
  {
    label: "호출이 돌아와도",
    summary: "반환 ≠ 8 도착",
    note: "호출이 먼저 돌아와도 복사와 계산은 그 뒤에 진행될 수 있습니다. pinned는 겹침을 준비할 뿐 보장하지 않습니다.",
    lanes: [HOST_FREE, DEVICE, { name: "입력 7", segs: [IN_USE] }, { name: "출력", segs: [] }],
  },
  {
    label: "보내는 중에 덮으면",
    summary: "입력 7 → 9 = 계약 위반",
    note: "A를 보내는 동안 CPU가 입력을 9로 덮으면 어느 값을 보냈는지에 대한 계약을 깨뜨립니다.",
    lanes: [HOST_FREE, DEVICE, { name: "입력 7", segs: [{ from: 0, to: 2, label: "덮기", tone: "bad" }] }, { name: "출력", segs: [] }],
  },
  {
    label: "H2D 뒤 event",
    summary: "완료 뒤 입력 재사용",
    note: "H2D 뒤 event가 끝나면 입력을 다시 써도 됩니다. 어느 event가 어느 buffer의 기준인지가 핵심입니다.",
    lanes: [HOST_FREE, DEVICE, { name: "입력 7", segs: [IN_USE, { from: 2, to: 11, label: "재사용 가능", tone: "send" }] }, { name: "출력", segs: [] }],
    marks: [{ at: 2, label: "H2D event" }],
  },
  {
    label: "D2H 뒤 event",
    summary: "완료 뒤 출력 읽기",
    note: "가져오는 동안에는 출력을 읽거나 해제하면 안 됩니다. D2H 뒤 event가 끝나야 host가 8을 읽습니다.",
    lanes: [HOST_FREE, DEVICE, { name: "입력 7", segs: [IN_USE, { from: 2, to: 11, label: "재사용 가능", tone: "send" }] }, { name: "출력", segs: [{ from: 7, to: 9, label: "금지", tone: "bad" }, { from: 9, to: 11, label: "8", tone: "fetch" }] }],
    marks: [{ at: 2, label: "H2D event" }, { at: 9, label: "D2H event" }],
  },
  {
    label: "pageable 입력",
    summary: "Async여도 host가 붙잡힐 수 있음",
    note: "일반적인 pageable 메모리는 준비 복사 때문에 Async여도 host 관점에서 동기적으로 동작하거나 stream을 기다릴 수 있습니다.",
    lanes: [{ name: "host", segs: [{ from: 0, to: 3, label: "준비·대기", tone: "wait" }, { from: 3, to: 11, label: "호출 반환 뒤", tone: "idle" }] }, DEVICE, { name: "입력 7", segs: [IN_USE] }, { name: "출력", segs: [] }],
  },
];

export default function AsyncOwnershipViz() {
  return (
    <SceneShell
      eyebrow="호출 반환과 buffer 사용"
      title="호출이 돌아온 뒤에도 입력과 출력은 언제까지 장치의 것일까요"
      description="A의 7을 보내 8을 돌려받는 2·5·2ms 모형이고 CUDA Runtime 13.0.2 기준입니다. host 호출과 준비 대기의 칸 폭은 설명용입니다."
      ariaLabel="비동기 호출 반환 뒤 입력과 출력 buffer를 언제 다시 만질 수 있는지 event 기준으로 보여 주는 다섯 장면"
      scenes={SCENES}
      render={(index) => <TimeLanes lanes={SCENES[index].lanes} marks={SCENES[index].marks ?? [{ at: 0, label: "호출" }]} max={11} ticks={[0, 2, 7, 9]} unit="ms" />}
    />
  );
}
