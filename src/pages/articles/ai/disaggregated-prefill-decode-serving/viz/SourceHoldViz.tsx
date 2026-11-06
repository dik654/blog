import GanttChart, { type GanttBar, type GanttMark } from "./GanttChart";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why-hold — 앞 장치 원본 자리를 언제까지 잡아 두는가.
 * 정상 0-4 / 복사 4-6 / 뒤 6-8. 뒤 자리 7ms면 복사 7-9, 뒤 9-11.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const VIOLET = "#7c3aed";
const SLATE = "#64748b";
const RED = "#dc2626";

const ROWS = ["앞 계산", "원본 보관", "복사", "뒤 계산"];

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  bars: readonly GanttBar[];
  marks: readonly GanttMark[];
}[] = [
  {
    label: "완료 신호까지 보관",
    summary: "6 ms 완료 확인 → 8 ms 첫 출력",
    note: "복사가 끝났다는 신호를 받은 뒤에야 앞 장치가 원본 자리를 돌려줍니다. 3절의 8 ms 경로입니다.",
    bars: [
      { row: 0, from: 0, to: 4, label: "0~4", color: BLUE },
      { row: 1, from: 4, to: 6, label: "보관", color: AMBER },
      { row: 2, from: 4, to: 6, label: "4~6", color: VIOLET },
      { row: 3, from: 6, to: 8, label: "6~8", color: BLUE },
    ],
    marks: [{ at: 8, label: "첫 출력 8 ms" }],
  },
  {
    label: "4 ms에 바로 돌려주면",
    summary: "5 ms에 읽는 값이 섞일 수 있음",
    note: "돌려준 자리에는 새 요청의 값이 쓰일 수 있습니다. 뒤 장치가 5 ms에 읽는 동안 값이 섞이면 같은 128B를 받아도 R의 기록이 아닐 수 있습니다.",
    bars: [
      { row: 0, from: 0, to: 4, label: "0~4", color: BLUE },
      { row: 1, from: 4, to: 12, label: "반환됨 · 새 요청이 쓸 수 있음", color: RED, dashed: true },
      { row: 2, from: 4, to: 6, color: RED, dashed: true },
    ],
    marks: [{ at: 5, label: "5 ms 읽는 중", color: RED }],
  },
  {
    label: "뒤 자리가 7 ms에 나면 (가정)",
    summary: "복사 7~9 → 첫 출력 11 ms",
    note: "통로 속도는 그대로인데 복사가 3 ms 밀려 11 ms가 됩니다. 그동안 원본도 앞쪽 공간을 차지해 다음 요청을 받을 빈자리까지 줄어듭니다.",
    bars: [
      { row: 0, from: 0, to: 4, label: "0~4", color: BLUE },
      { row: 1, from: 4, to: 9, label: "보관 4~9", color: AMBER },
      { row: 2, from: 4, to: 7, label: "자리 대기", color: SLATE },
      { row: 2, from: 7, to: 9, label: "7~9", color: VIOLET },
      { row: 3, from: 9, to: 11, label: "9~11", color: BLUE },
    ],
    marks: [{ at: 11, label: "첫 출력 11 ms", anchor: "end" }],
  },
  {
    label: "뒤 장치가 사라지면",
    summary: "완료 신호가 오지 않을 수 있음",
    note: "끝없이 붙잡고 있으면 새 요청의 공간이 줄어듭니다. 그래서 보관 기한을 두되 정상적으로 기다리는 요청은 기한을 연장합니다. 점선 길이는 시간을 뜻하지 않습니다.",
    bars: [
      { row: 0, from: 0, to: 4, label: "0~4", color: BLUE },
      { row: 1, from: 4, to: 12, label: "신호가 없으면 끝을 알 수 없음", color: AMBER, dashed: true },
    ],
    marks: [],
  },
];

export default function SourceHoldViz() {
  return (
    <SceneShell
      eyebrow="(가정) 요청 R의 원본 자리"
      title="원본을 일찍 돌려주면 값이 섞일 수 있고, 뒤 자리가 늦으면 첫 출력이 밀립니다"
      description="가로축은 ms입니다. 계산 4 ms·복사 2 ms·뒤 계산 2 ms는 3절의 설명용 가정입니다."
      ariaLabel="원본 반환 시점과 뒤 자리 배정 시점에 따른 보관, 복사, 첫 출력 비교"
      scenes={SCENES}
      render={(active) => (
        <GanttChart key={active} rows={ROWS} axisMax={12} ticks={[0, 2, 4, 6, 8, 10, 12]} bars={SCENES[active].bars} marks={SCENES[active].marks} ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`} />
      )}
    />
  );
}
