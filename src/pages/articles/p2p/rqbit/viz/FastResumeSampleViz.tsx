import SceneShell from "./SceneShell";

/**
 * 본문 대응: #range-release — restart의 sampled fast-resume.
 * file마다 적어도 한 piece를 고르고 나머지는 감소하는 확률로 sampling한다.
 * sample 하나라도 깨지면 저장된 bitfield를 지우고 full recovery로 간다.
 * 두 file과 piece 수, 어느 칸이 뽑혔는지는 그림을 위한 가정.
 */
type Cell = "saved" | "must" | "chance" | "skip" | "ok" | "broken" | "cleared";

interface ResumeScene {
  label: string;
  summary: string;
  note: string;
  files: readonly { name: string; cells: readonly Cell[] }[];
}

const SCENES: readonly ResumeScene[] = [
  {
    label: "저장된 bitfield가 HAVE라고 적은 piece",
    summary: "file X 4개 · file Y 3개 (가정)",
    note: "Restart하면 이전 session이 저장한 bitfield가 남아 있습니다. 이 단계의 HAVE는 저장된 기록일 뿐, 이번 시작에서 hash로 다시 확인한 값이 아닙니다.",
    files: [
      { name: "file X", cells: ["saved", "saved", "saved", "saved"] },
      { name: "file Y", cells: ["saved", "saved", "saved"] },
    ],
  },
  {
    label: "file마다 적어도 한 piece를 고릅니다",
    summary: "필수 2개 + 확률로 뽑힌 칸",
    note: "file마다 한 piece는 반드시 검사하고, 나머지는 감소하는 확률로 sampling합니다. 어느 칸이 뽑힐지는 확률이라 여기 고른 칸은 그림을 위한 가정입니다.",
    files: [
      { name: "file X", cells: ["must", "chance", "skip", "skip"] },
      { name: "file Y", cells: ["must", "skip", "skip"] },
    ],
  },
  {
    label: "sample이 모두 맞으면",
    summary: "저장된 bitfield로 바로 resume",
    note: "고른 piece의 hash가 모두 맞으면 저장된 bitfield를 씁니다. 뽑히지 않은 네 칸은 이번 시작에서 hash하지 않았습니다. “resume이 즉시 됐다”가 “모든 byte를 재검증했다”는 뜻이 아닌 이유입니다.",
    files: [
      { name: "file X", cells: ["ok", "ok", "skip", "skip"] },
      { name: "file Y", cells: ["ok", "skip", "skip"] },
    ],
  },
  {
    label: "sample 하나라도 깨지면",
    summary: "bitfield 삭제 → full recovery",
    note: "고른 piece 가운데 하나라도 hash가 다르면 저장된 bitfield를 지우고 full recovery 쪽으로 돌아갑니다. 깨진 칸만 고치는 것이 아니라 저장된 HAVE 기록 전체를 버립니다.",
    files: [
      { name: "file X", cells: ["cleared", "broken", "cleared", "cleared"] },
      { name: "file Y", cells: ["cleared", "cleared", "cleared"] },
    ],
  },
];

const CELL: Record<Cell, { text: string; className: string }> = {
  saved: { text: "HAVE (저장)", className: "border-border text-muted-foreground" },
  must: { text: "필수 검사", className: "border-[#2563eb] bg-[#2563eb]/10 font-bold text-[#2563eb]" },
  chance: { text: "확률로 뽑힘", className: "border-dashed border-[#2563eb] text-[#2563eb]" },
  skip: { text: "hash 안 함", className: "border-dashed border-border text-muted-foreground/70" },
  ok: { text: "hash 맞음", className: "border-[#16a34a] bg-[#16a34a]/10 font-bold text-[#15803d]" },
  broken: { text: "hash 다름", className: "border-[#dc2626] bg-[#dc2626]/10 font-bold text-[#dc2626]" },
  cleared: { text: "기록 지움", className: "border-dashed border-[#dc2626]/50 text-muted-foreground/70" },
};

export default function FastResumeSampleViz() {
  return (
    <SceneShell
      eyebrow="fast-resume"
      title="Restart는 저장된 HAVE를 전부가 아니라 몇 칸만 다시 hash합니다"
      description="칸 하나가 저장된 bitfield에서 HAVE로 적힌 piece 하나입니다. 두 file과 칸 수는 그림을 위한 가정입니다."
      ariaLabel="restart 때 file마다 일부 piece만 hash 검사하고, 하나라도 깨지면 저장된 bitfield를 지우는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="space-y-3">
            {scene.files.map((file) => (
              <div key={file.name} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground sm:text-sm">{file.name}</span>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {file.cells.map((cell, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className={`flex min-h-[3rem] items-center justify-center rounded-lg border px-1 text-center text-[11px] leading-4 sm:text-xs ${CELL[cell].className}`}
                    >
                      <span className="break-keep">{CELL[cell].text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
