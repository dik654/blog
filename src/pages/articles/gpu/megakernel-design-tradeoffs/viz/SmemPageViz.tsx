import SceneShell from "./SceneShell";

/**
 * 본문 대응: #resource-sharing — shared memory 는 page 로 나눠 시간에 따라 재사용한다.
 * 16 KiB × 13 = 208 KiB = 212,992 B ≈ 213 kB (Hazy Research 자기보고).
 * task 이름·page 수·시간 칸은 그림용 가정: A 8, B 4, C 6, 미리 올림 2, D 7. 6열에서 빈 칸 6 < E 8.
 */
const SCENES = [
  { label: "213 kB 를 13칸으로", summary: "16 KiB × 13 = 208 KiB ≈ 213 kB", note: "Hazy Research 는 H100 의 shared memory 213 kB 를 16 KiB page 13개로 나눕니다. MPK 는 32 KB page 를 씁니다. 세로 한 칸이 page 하나, 가로가 시간입니다." },
  { label: "필요한 만큼 빌림", summary: "A 8칸 + B 4칸, 1칸 빔", note: "Task 가 도는 동안 필요한 page 만 빌립니다. 맨 위 register 띠와 달리 page 의 몫은 task 마다 다를 수 있습니다." },
  { label: "돌려주면 재사용", summary: "A 의 8칸 → C 6칸 + 미리 올림 2칸", note: "A 가 돌려준 page 를 C 가 다시 빌립니다. 이것이 cross-operator shared-memory reuse 이고, 남은 page 에는 다음 task 의 weight 를 미리 올려 둘 수 있습니다." },
  { label: "미리 올린 page 이어받기", summary: "D 7칸 = 미리 올린 2칸 + 5칸", note: "D 는 weight 가 미리 올라온 2칸에 B 가 돌려준 4칸과 빈 1칸을 더해 시작합니다." },
  { label: "모자라면 기다림", summary: "빈 칸 6 < E 가 원하는 8", note: "C 가 돌려줘 6칸이 비었지만 E 에게는 8칸이 필요합니다(가정). Page 를 다 쓴 task 는 다른 task 가 돌려줄 때까지 기다리며, 이 대기도 t_sync 에 들어갑니다." },
] as const;

const COLS = 6;
const ROWS = 13;

const BLOCKS = [
  { name: "A · 8칸", from: 1, col: [1, 3], row: [1, 9], color: "#2563eb" },
  { name: "B · 4칸", from: 1, col: [1, 5], row: [9, 13], color: "#7c3aed" },
  { name: "C · 6칸", from: 2, col: [3, 6], row: [1, 7], color: "#059669" },
  { name: "weight 미리", from: 2, col: [3, 5], row: [7, 9], color: "#d97706", dashed: true },
  { name: "D · 7칸", from: 3, col: [5, 7], row: [7, 14], color: "#d97706" },
] as const;

export default function SmemPageViz() {
  return (
    <SceneShell
      eyebrow="Shared memory 재사용"
      title="Shared memory 는 page 로 빌리고 돌려줍니다"
      description="A~E 다섯 task 와 각자의 page 수, 시간 칸은 그림을 위한 가정입니다. 실제 배치는 kernel 마다 다릅니다."
      ariaLabel="시간에 따라 13개의 shared memory page 를 task 들이 빌리고 돌려주는 표"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-1">
            <span className="text-[10px] leading-3 text-muted-foreground">reg</span>
            <div className="flex h-5 items-center justify-center rounded-sm border text-[11px] font-semibold" style={{ borderColor: "#64748b", backgroundColor: "#64748b22" }}>
              register 128(가정): forward 내내 고정
            </div>
          </div>
          <div className="mt-1.5 grid grid-cols-[1.75rem_minmax(0,1fr)] gap-1">
            <div className="grid" style={{ gridTemplateRows: `repeat(${ROWS}, 1rem)` }}>
              {Array.from({ length: ROWS }, (_, index) => (
                <span key={index} className="text-right font-mono text-[10px] leading-4 text-muted-foreground">{index + 1}</span>
              ))}
            </div>
            <div className="relative min-w-0">
              <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${ROWS}, 1rem)` }}>
                {Array.from({ length: ROWS * COLS }, (_, index) => (
                  <span key={index} className="border-b border-r border-border/50" />
                ))}
              </div>
              <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${ROWS}, 1rem)` }}>
                {BLOCKS.map((block) => (
                  <div
                    key={block.name}
                    className={`m-px flex items-center justify-center rounded-sm border text-[11px] font-semibold transition-opacity duration-300 motion-reduce:transition-none ${active >= block.from ? "" : "invisible"} ${"dashed" in block ? "border-dashed" : ""}`}
                    style={{ gridColumn: `${block.col[0]} / ${block.col[1]}`, gridRow: `${block.row[0]} / ${block.row[1]}`, borderColor: block.color, backgroundColor: `${block.color}26` }}
                  >
                    {block.name}
                  </div>
                ))}
                <div
                  className={`m-px flex items-center justify-center rounded-sm border border-dashed text-center text-[11px] font-semibold leading-4 ${active === 4 ? "" : "invisible"}`}
                  style={{ gridColumn: "6 / 7", gridRow: "1 / 7", borderColor: "#dc2626", color: "#dc2626" }}
                >
                  빈 6칸 · E 대기
                </div>
              </div>
            </div>
          </div>
          <p className="mt-1 text-right text-[11px] text-muted-foreground">시간 → (왼쪽 숫자 = page 번호)</p>
        </div>
      )}
    />
  );
}
