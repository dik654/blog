import SceneShell from "./SceneShell";

/**
 * 본문 대응: #side-effect-control — 파일 저장 지점 복원은 내부 상태만 되돌리고, 전송한 메시지와 처리한 청구는 남는다.
 * 취소·보상은 새로운 외부 효과이며 금액 결과는 글에 없어 그리지 않는다.
 */
type Cell = { text: string; tone: "plain" | "faded" | "done" | "pending" };

const SCENES: readonly ({ label: string; summary: string; note: string; inside: Cell[]; outside: Cell[] })[] = [
  {
    label: "저장 지점을 만듭니다",
    summary: "내부 기록 저장",
    note: "저장 지점은 파일과 진행 기록처럼 작업 내부의 상태를 잡아 둡니다. 아직 바깥에서 일어난 일은 없습니다.",
    inside: [{ text: "저장 지점", tone: "plain" }, { text: "", tone: "faded" }],
    outside: [{ text: "", tone: "faded" }, { text: "", tone: "faded" }],
  },
  {
    label: "실행이 바깥을 바꿉니다",
    summary: "메시지 전송 · 청구 처리",
    note: "실행을 이어가면 내부 파일이 바뀌고, 메시지를 전송하거나 청구를 처리하면 외부 서비스의 기록도 바뀝니다.",
    inside: [{ text: "저장 지점", tone: "plain" }, { text: "이후 변경", tone: "plain" }],
    outside: [{ text: "메시지 전송", tone: "done" }, { text: "청구 처리", tone: "done" }],
  },
  {
    label: "저장 지점으로 돌아갑니다",
    summary: "바깥은 그대로",
    note: "내부의 이후 변경은 사라져도 이미 전송한 메시지나 처리한 청구는 사라지지 않습니다. 복원은 경계 아래로 내려가지 않습니다.",
    inside: [{ text: "저장 지점", tone: "plain" }, { text: "되돌림", tone: "faded" }],
    outside: [{ text: "메시지 전송", tone: "done" }, { text: "청구 처리", tone: "done" }],
  },
  {
    label: "바깥은 따로 다룹니다",
    summary: "취소·보상도 새 효과",
    note: "외부 서비스의 취소·보상 절차가 따로 필요합니다. 보상도 새로운 외부 효과이므로 권한과 중복 실행 조건을 다시 확인합니다.",
    inside: [{ text: "저장 지점", tone: "plain" }, { text: "되돌림", tone: "faded" }],
    outside: [{ text: "메시지 전송", tone: "done" }, { text: "청구 처리", tone: "done" }, { text: "취소·보상 (권한·중복 재확인)", tone: "pending" }],
  },
];

const TONE: Record<Cell["tone"], string> = {
  plain: "border-border bg-background font-semibold",
  faded: "border-dashed border-border text-muted-foreground",
  done: "border-primary bg-primary/[0.06] font-semibold",
  pending: "border-dashed border-amber-600 font-semibold text-amber-700 dark:text-amber-400",
};

function Lane({ title, cells }: { title: string; cells: Cell[] }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-black text-primary">{title}</p>
      <div className="mt-1 grid min-h-[6.5rem] auto-rows-fr gap-1.5 sm:min-h-[3.25rem] sm:grid-cols-3 sm:auto-rows-auto">
        {cells.map((cell, index) => (
          <span key={index} className={`flex min-h-8 items-center justify-center rounded-lg border px-2 py-1 text-center text-xs leading-5 ${TONE[cell.tone]}`}>
            {cell.text}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CheckpointBoundaryViz() {
  return (
    <SceneShell
      eyebrow="복원의 경계"
      title="저장 지점은 경계 위만 되돌립니다"
      description="위 칸은 작업 내부의 상태, 아래 칸은 이미 외부 서비스에 남은 효과입니다."
      ariaLabel="저장 지점으로 돌아가도 전송한 메시지와 처리한 청구는 남고, 취소와 보상은 별도 외부 효과라는 흐름"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <Lane title="내부: 파일·진행 기록" cells={scene.inside} />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-px flex-1 border-t border-dashed border-muted-foreground" />
              복원이 닿는 경계
              <span className="h-px flex-1 border-t border-dashed border-muted-foreground" />
            </div>
            <Lane title="외부: 메시지·청구" cells={scene.outside} />
          </div>
        );
      }}
    />
  );
}
