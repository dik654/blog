import DayGrid, { type DayCell } from "./DayGrid";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 설명용 시간표. 칸 하나가 1시간이다.
 * 수면 8 + 노동 9 + 돌봄 3 + 통근 2 = 22시간이 묶이고 24 − 22 = 2시간이 남는다.
 * 통근 2→1, 노동 9→8이 되면 24 − (8 + 8 + 3 + 1) = 4시간이 된다.
 */
const BLOCKS: readonly { text: string; hours: number }[] = [
  { text: "수면", hours: 8 },
  { text: "노동", hours: 9 },
  { text: "돌봄", hours: 3 },
  { text: "통근", hours: 2 },
  { text: "선택", hours: 2 },
];

const BASE: readonly string[] = BLOCKS.flatMap((block) => Array.from({ length: block.hours }, () => block.text));
const LAST_WORK = 16;
const LAST_COMMUTE = 21;

const SCENES = [
  {
    label: "하루 24칸",
    summary: "8 + 9 + 3 + 2 + 2 = 24",
    legend: "수면 8 · 유급 노동 9 · 가족 돌봄 3 · 통근 2 · 남은 시간(선택) 2",
    note: "칸 하나가 1시간입니다. 수면·유급 노동·가족 돌봄·통근을 먼저 채우면 공부할지 쉴지 고를 수 있는 칸은 두 개가 남습니다.",
  },
  {
    label: "묶인 칸과 남은 칸",
    summary: "8 + 9 + 3 + 2 = 22 · 남은 2",
    legend: "회색 22칸: 이미 묶인 시간 · 파란 2칸: 바로 조정할 수 있는 시간",
    note: "22칸은 몸·노동계약·돌봄·주거가 이미 묶어 둔 시간입니다. ‘하루는 누구에게나 24시간’이라는 말만으로는 선택 조건이 같다고 결론 내릴 수 없습니다.",
  },
  {
    label: "조건이 바뀐 뒤",
    summary: "24 − (8 + 8 + 3 + 1) = 4",
    legend: "초록 점선 2칸: 통근 2→1, 노동 9→8로 풀린 시간 · 파란 2칸: 원래 남던 시간",
    note: "직장 가까이 옮겨 통근이 1시간 줄고 근무 조정으로 노동이 1시간 줄면 자유 시간은 4시간입니다. 이 두 칸은 의지 하나가 아니라 돈·주거·고용 규칙과 타인의 협조가 함께 만든 가능성입니다(설명용 변화).",
  },
] as const;

function cellsFor(active: number): DayCell[] {
  return BASE.map((text, hour) => {
    if (active === 2 && (hour === LAST_WORK || hour === LAST_COMMUTE)) return { text: "풀림", tone: "freed" };
    if (text === "선택" && active > 0) return { text, tone: "free" };
    return { text, tone: "bound" };
  });
}

export default function DayLedgerViz() {
  return (
    <SceneShell
      eyebrow="사실성과 가능성"
      title="24시간 가운데 바로 고를 수 있는 칸은 몇 개인가"
      description="칸 하나가 1시간인 설명용 시간표입니다. 첫 장면은 아직 나누지 않은 하루이고, 둘째 장면부터 회색은 이미 묶인 조건(사실성: 몸·과거·노동·돌봄처럼 이미 놓인 조건), 파랑은 지금 고를 수 있는 시간입니다."
      ariaLabel="하루 24시간 중 묶인 22시간과 남은 2시간, 조건 조정 뒤 4시간"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <DayGrid cells={cellsFor(active)} />
          <p className="text-xs leading-6 text-muted-foreground sm:text-sm">{SCENES[active].legend}</p>
        </div>
      )}
    />
  );
}
