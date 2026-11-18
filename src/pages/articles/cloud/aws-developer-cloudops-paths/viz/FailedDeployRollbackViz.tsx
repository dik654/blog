import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 하루 10번 배포 중 1번이 오류율을 높인다(가정), 5분 안 탐지·10분 안 되돌리기 목표,
 * 운영자의 단계 배포·오류율 경보·자동 중단·되돌리기, 버전으로 추적한 산출물과 설정.
 * 처음 비율 10%는 6절 용어 설명(단계 배포)의 예시다. 몇 번째 배포가 실패하는지는 그림을 위한 가정(7번째)이다.
 * 5분·10분이 어느 시각부터 재는지는 글이 정하지 않으므로 축에 놓지 않는다.
 */
type Cell = "old" | "new" | "bad";

const BAD_DEPLOY = 6;
const GOOD_DEPLOY = 2;

const SCENES = [
  {
    label: "하루 10번 배포, 그중 1번이 문제",
    summary: "10회 중 1회 오류율 상승",
    focus: -1,
    cells: Array<Cell>(10).fill("old"),
    tag: "",
    note: "팀은 하루 10번 배포하고 그중 한 번이 사용자 오류율을 높입니다. 어느 배포가 문제인지는 미리 알 수 없으므로 모든 배포가 같은 길을 지납니다.",
  },
  {
    label: "새 버전을 작은 비율에 먼저",
    summary: "요청 10%만 새 버전",
    focus: GOOD_DEPLOY,
    cells: ["new", ...Array<Cell>(9).fill("old")] as Cell[],
    tag: "운영자 준비 · 단계 배포",
    note: "단계 배포는 새 버전을 일부 요청에 먼저 내는 방식입니다. 6절 예시처럼 요청 10%에서 오류율을 먼저 봅니다.",
  },
  {
    label: "분기 ① 지표가 괜찮으면 넓힙니다",
    summary: "10% → 100%",
    focus: GOOD_DEPLOY,
    cells: Array<Cell>(10).fill("new"),
    tag: "운영자 준비 · 단계 배포",
    note: "문제없는 아홉 번의 배포는 사용자 지표를 확인한 뒤 모든 요청으로 넓힙니다.",
  },
  {
    label: "분기 ② 오류율이 오르면 멈춥니다",
    summary: "탐지 목표 5분 안 · 자동 중단",
    focus: BAD_DEPLOY,
    cells: ["bad", ...Array<Cell>(9).fill("old")] as Cell[],
    tag: "운영자 준비 · 오류율 경보 + 자동 중단",
    note: "문제 배포에서는 새 버전을 받은 10%에서 오류율이 오르고 경보가 울립니다. 목표는 5분 안에 이상을 아는 것이며, 배포는 더 넓히지 않고 멈춥니다.",
  },
  {
    label: "이전 버전으로 되돌립니다",
    summary: "되돌리기 목표 10분 안",
    focus: BAD_DEPLOY,
    cells: Array<Cell>(10).fill("old"),
    tag: "되돌릴 대상 · 버전으로 추적한 이전 산출물과 설정",
    note: "빌드 산출물과 설정을 버전으로 추적했으므로 돌아갈 이전 상태가 분명합니다. 목표는 10분 안에 이전 버전으로 되돌리는 것입니다.",
  },
] as const;

const CELL_STYLE: Record<Cell, { cls: string; word: string }> = {
  old: { cls: "border-border text-muted-foreground", word: "이전" },
  new: { cls: "border-[#2563eb] bg-[#2563eb]/10 text-[#2563eb] dark:text-[#93c5fd]", word: "새" },
  bad: { cls: "border-[#dc2626] bg-[#dc2626]/10 text-[#b91c1c] dark:text-[#f87171]", word: "오류" },
};

export default function FailedDeployRollbackViz() {
  return (
    <SceneShell
      eyebrow="실패한 배포 한 건"
      title="문제 배포는 작은 비율에서 잡혀 이전 버전으로 돌아갑니다"
      description="윗줄 칸 하나가 하루 배포 한 번, 아랫줄 칸 하나가 그 배포가 받는 요청의 10%입니다. 7번째가 문제 배포라는 것과 10%라는 첫 비율은 그림을 위한 예입니다(가정)."
      ariaLabel="하루 10번 배포 중 문제 배포 한 번이 단계 배포, 경보, 자동 중단, 되돌리기를 지나는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const alarm = active === 3;
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">하루 배포 10번</p>
              <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: 10 }, (_, index) => {
                  const isBad = index === BAD_DEPLOY;
                  const isFocus = index === scene.focus;
                  return (
                    <div
                      key={index}
                      className={`flex h-10 items-center justify-center rounded-md border text-xs font-semibold ${
                        isFocus ? "border-[#2563eb] ring-1 ring-[#2563eb]" : "border-border"
                      } ${isBad ? "text-[#b91c1c] dark:text-[#f87171]" : "text-muted-foreground"}`}
                    >
                      {isBad ? "!" : index + 1}
                    </div>
                  );
                })}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">! = 오류율을 높이는 배포(가정: 7번째). 독자에게만 미리 보여 준 표시이며, 팀은 배포 전에 어느 것인지 모릅니다.</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                {scene.focus < 0 ? "배포 한 번이 받는 요청 (아직 배포 전)" : `${scene.focus + 1}번째 배포가 받는 요청`}
              </p>
              <div className="grid grid-cols-10 gap-1">
                {scene.cells.map((cell, index) => (
                  <div key={index} className={`flex h-10 items-center justify-center rounded-md border text-[11px] font-semibold ${CELL_STYLE[cell].cls}`}>
                    {CELL_STYLE[cell].word}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex min-h-[2.75rem] flex-wrap items-center gap-2 text-xs">
              {scene.tag && <span className="rounded-full border border-border px-2.5 py-1 font-semibold">{scene.tag}</span>}
              {alarm && <span className="rounded-full border border-[#dc2626] px-2.5 py-1 font-semibold text-[#b91c1c] dark:text-[#f87171]">경보: 오류율 상승</span>}
            </div>
          </div>
        );
      }}
    />
  );
}
