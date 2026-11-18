import SceneShell from "./SceneShell";

/**
 * 본문 대응: #resume-boundary — 연속 1000 updates와 600+resume+400 updates의
 * LR trace를 같은 update index끼리 맞대면 off-by-one이 첫 불일치 칸으로 드러난다.
 * 칸에는 η 값 대신 사용한 index만 적습니다(본문에 곡선과 수치가 없음).
 * 세 번째 줄의 "한 칸 앞서 복원된 cursor"는 off-by-one을 보이려는 가정입니다.
 */
const COLUMNS = [598, 599, 600, 601] as const;

const ROWS = [
  { name: "연속 1000 updates", shift: 0, resumed: false },
  { name: "600 + 재개 + 400 (state 전부 복원)", shift: 0, resumed: true },
  { name: "600 + 재개 + 400 (cursor가 한 칸 앞섬, 가정)", shift: 1, resumed: true },
] as const;

const SCENES = [
  {
    label: "기준선: 끊지 않은 실행",
    summary: "update t는 ηₜ를 씁니다",
    note: "끊지 않은 실행에서 update t마다 schedule이 ηₜ를 반환합니다. 이 줄이 맞대어 볼 기준 trace입니다.",
  },
  {
    label: "state를 모두 되살린 재개",
    summary: "모든 칸이 일치",
    note: "본문이 나열한 state를 checkpoint에서 모두 되살리면 재개 후 첫 update도 기준선과 같은 η₆₀₀을 씁니다.",
  },
  {
    label: "한 칸 밀린 재개",
    summary: "첫 불일치: update 600",
    note: "cursor가 한 칸 앞서 복원됐다고 가정하면 update 600부터 η₆₀₁을 씁니다. 재개 전 칸은 같으므로 index끼리 맞대야 첫 불일치가 보입니다.",
  },
] as const;

export default function ResumeTraceViz() {
  return (
    <SceneShell
      eyebrow="off-by-one 찾기"
      title="같은 update index끼리 LR trace를 맞대어 봅니다"
      description="칸 하나가 update 하나이고, 칸 안의 글자는 그 update가 쓴 learning rate의 index입니다. 굵은 세로선은 600회를 마친 checkpoint에서 재개한 지점이고(index를 0부터 센다고 가정해 재개 후 첫 update가 t=600), 빨간 칸은 기준선과 다른 index입니다."
      ariaLabel="연속 실행과 재개 실행의 update별 learning rate index 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          {ROWS.map((row, rowIndex) => {
            const visible = rowIndex <= active;
            return (
              <div key={row.name} className={visible ? "" : "opacity-25"}>
                <p className="mb-1 text-xs font-semibold leading-5">{row.name}</p>
                <div className="grid grid-cols-[repeat(2,minmax(0,1fr))_2px_repeat(2,minmax(0,1fr))] gap-1.5">
                  {COLUMNS.map((t, colIndex) => {
                    const used = row.resumed && t >= 600 ? t + row.shift : t;
                    const mismatch = visible && used !== t;
                    const cell = (
                      <div
                        key={t}
                        className={`rounded-md border px-1 py-1 text-center font-mono text-xs leading-5 sm:text-sm ${
                          mismatch
                            ? "border-red-600 bg-red-50 font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300"
                            : visible
                              ? "border-blue-600/60 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200"
                              : "border-border text-muted-foreground"
                        }`}
                      >
                        <span className="block text-[10px] leading-4 text-muted-foreground">t={t}</span>
                        η<sub className="text-[0.75em]">{used}</sub>
                      </div>
                    );
                    return colIndex === 2
                      ? [
                          <div
                            key="ckpt"
                            className={row.resumed ? "rounded-sm bg-foreground" : "bg-transparent"}
                            aria-hidden
                          />,
                          cell,
                        ]
                      : cell;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
