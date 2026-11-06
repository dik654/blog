import GanttChart, { type GanttBar, type GanttMark } from "./GanttChart";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #layer-overlap — e_i = max(r_i, e_{i-1}) + s_i/B.
 * 일괄 6ms, 층별 64B/ms: 3·5ms, 층별 16B/ms: 6·10ms.
 */
const BLUE = "#2563eb";
const VIOLET = "#7c3aed";
const SLATE = "#64748b";
const COMPUTE: readonly GanttBar[] = [
  { row: 0, from: 0, to: 2, label: "층1", color: BLUE },
  { row: 0, from: 2, to: 4, label: "층2", color: "#1d4ed8" },
];
const DONE: GanttMark = { at: 4, label: "계산 끝", anchor: "end", color: "#475569" };

const SCENES: readonly {
  label: string;
  summary: string;
  calc: string;
  note: string;
  bars: readonly GanttBar[];
  marks: readonly GanttMark[];
}[] = [
  {
    label: "모두 만든 뒤 한 번에",
    summary: "64B/ms · 6 ms 완료",
    calc: "128B ÷ 64B/ms = 2 ms\n4 + 2 = 6",
    note: "앞에서 본 직렬 사례입니다. 두 층을 묶어 계산이 끝난 뒤 보냅니다.",
    bars: [...COMPUTE, { row: 1, rowSpan: 2, from: 4, to: 6, label: "128B", color: VIOLET }],
    marks: [DONE, { at: 6, label: "6 ms", anchor: "start" }],
  },
  {
    label: "층별로 바로 · 빠른 통로",
    summary: "64B/ms · 5 ms 완료",
    calc: "1층 max(2, 0) + 1 = 3\n2층 max(4, 3) + 1 = 5",
    note: "1 ms 빨라졌지만 계산이 끝난 뒤 마지막 1 ms는 여전히 남습니다.",
    bars: [...COMPUTE, { row: 1, from: 2, to: 3, color: VIOLET }, { row: 2, from: 4, to: 5, color: VIOLET }],
    marks: [DONE, { at: 5, label: "5 ms", anchor: "start" }],
  },
  {
    label: "층별로 바로 · 느린 통로",
    summary: "16B/ms · 10 ms 완료",
    calc: "1층 max(2, 0) + 4 = 6\n2층 max(4, 6) + 4 = 10",
    note: "2층은 4 ms에 준비됐지만 1층이 6 ms까지 통로를 쓰므로 기다립니다. 계산이 끝난 뒤 남는 시간은 마지막 층의 4 ms가 아니라 6 ms입니다.",
    bars: [...COMPUTE, { row: 1, from: 2, to: 6, label: "1층 64B", color: VIOLET }, { row: 2, from: 4, to: 6, label: "대기", color: SLATE }, { row: 2, from: 6, to: 10, label: "2층 64B", color: VIOLET }],
    marks: [DONE, { at: 10, label: "10 ms", anchor: "start" }],
  },
];

export default function LayerQueueViz() {
  return (
    <SceneShell
      eyebrow="(가정) 층별 전송을 지원하는 별도 프로토콜"
      title="먼저 보내도 앞 층이 통로를 쓰는 동안 뒤 층은 줄을 섭니다"
      description="가로축은 ms입니다. 앞에서 읽은 NIXL pull 구현이 아니라 한 전용 링크가 층을 순서대로 보낸다는 가정입니다."
      ariaLabel="일괄 전송과 층별 전송의 완료 시점 비교"
      scenes={SCENES}
      render={(active) => (
        <div key={active} className="min-w-0">
          <GanttChart rows={["계산", "1층 전송", "2층 전송"]} axisMax={12} ticks={[0, 2, 4, 6, 8, 10, 12]} bars={SCENES[active].bars} marks={SCENES[active].marks} ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`} />
          <p className="mt-2 whitespace-pre-line text-center font-mono text-xs leading-5 text-foreground">{SCENES[active].calc}</p>
        </div>
      )}
    />
  );
}
