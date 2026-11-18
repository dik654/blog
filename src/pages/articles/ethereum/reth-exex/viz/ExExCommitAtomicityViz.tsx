import SceneShell from "./SceneShell";

/**
 * 본문 대응: #durable-apply — Extension A가 103′~105′를 적용한 뒤 파생 행과 ExExHead가 함께 확정되지 않으면
 * 재시작 위치가 어긋난다. 칸 = 각 block의 파생 행, ▲ = 저장된 ExExHead, 아래 줄 = 재시작 뒤 결과.
 */
const SLOTS = ["102", "103′", "104′", "105′"] as const;

type Row = "kept" | "written" | "missing";

interface AtomicityScene {
  label: string;
  summary: string;
  rows: readonly Row[];
  head: number;
  restart: readonly string[];
  outcome: string;
  note: string;
}

const SCENES: readonly AtomicityScene[] = [
  {
    label: "같은 transaction",
    summary: "행 + head 105′ 함께 확정",
    rows: ["kept", "written", "written", "written"],
    head: 3,
    restart: ["", "", "", ""],
    outcome: "재시작은 105′ 다음부터 이어 갑니다",
    note: "파생 행과 head를 같은 로컬 DB transaction에 묶으면 둘은 함께 확정됩니다. 저장된 head가 가리키는 위치와 실제로 남은 행이 어긋나지 않으므로 재시작도 105′ 다음부터 이어 갑니다.",
  },
  {
    label: "행만 commit",
    summary: "행은 105′까지 · head는 102",
    rows: ["kept", "written", "written", "written"],
    head: 0,
    restart: ["", "다시 적용", "다시 적용", "다시 적용"],
    outcome: "102 다음부터 다시 받아 같은 구간을 또 적용할 수 있습니다",
    note: "파생 행은 commit됐는데 head가 102에 남은 경우입니다. 재시작한 extension은 head 102 다음부터 다시 처리하므로 이미 쓴 103′~105′를 한 번 더 적용할 수 있습니다.",
  },
  {
    label: "head만 전진",
    summary: "head는 105′ · 행은 빠짐",
    rows: ["kept", "missing", "missing", "missing"],
    head: 3,
    restart: ["", "건너뜀", "건너뜀", "건너뜀"],
    outcome: "105′ 다음부터 이어 가므로 빈 칸이 채워지지 않습니다",
    note: "반대로 head만 105′로 전진하고 파생 행이 빠진 경우입니다. 재시작은 head 다음부터 이어 가므로 103′~105′ 구간을 건너뛰고, 그 칸의 행은 빈 채로 남습니다.",
  },
];

const ROW_STYLE: Record<Row, { text: string; className: string }> = {
  kept: { text: "기존 행", className: "border-border text-muted-foreground" },
  written: { text: "행 있음", className: "border-[#2563eb] text-[#2563eb] bg-[#2563eb]/10" },
  missing: { text: "행 없음", className: "border-dashed border-[#dc2626] text-[#dc2626]" },
};

export default function ExExCommitAtomicityViz() {
  return (
    <SceneShell
      eyebrow="로컬 확정 단위"
      title="파생 행과 ExExHead가 따로 남으면 재시작 위치가 어긋납니다"
      description="Extension A가 new branch 103′~105′를 적용한 직후 멈췄다고 보고, 저장소에 무엇이 남았는지에 따라 재시작 결과가 어떻게 갈리는지 비교합니다. ExExHead는 extension이 완전히 반영했다고 저장한 마지막 block입니다."
      ariaLabel="파생 행과 ExExHead를 함께 확정한 경우와 한쪽만 남은 두 경우의 재시작 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2 text-xs">
            <div className="grid grid-cols-[4.5rem_repeat(4,minmax(0,1fr))] items-center gap-1.5 sm:grid-cols-[6rem_repeat(4,minmax(0,1fr))] sm:gap-2">
              <span className="text-[11px] text-muted-foreground">block</span>
              {SLOTS.map((slot) => (
                <span key={slot} className="text-center font-mono font-bold">{slot}</span>
              ))}

              <span className="text-[11px] text-muted-foreground">파생 행</span>
              {scene.rows.map((row, index) => (
                <span key={SLOTS[index]} className={`rounded-md border px-1 py-2 text-center text-[11px] leading-4 ${ROW_STYLE[row].className}`}>
                  {ROW_STYLE[row].text}
                </span>
              ))}

              <span className="text-[11px] text-muted-foreground">ExExHead</span>
              {SLOTS.map((slot, index) => (
                <span key={slot} className={`text-center font-mono text-[11px] leading-4 ${index === scene.head ? "font-bold text-[#b45309]" : "text-transparent"}`}>
                  ▲ head
                </span>
              ))}

              <span className="text-[11px] text-muted-foreground">재시작 뒤</span>
              {scene.restart.map((mark, index) => (
                <span
                  key={SLOTS[index]}
                  className={`rounded-md px-1 py-1.5 text-center text-[11px] leading-4 ${
                    mark === "다시 적용" ? "bg-[#d97706]/15 font-semibold text-[#b45309]" : mark === "건너뜀" ? "bg-[#dc2626]/10 font-semibold text-[#dc2626]" : "text-transparent"
                  }`}
                >
                  {mark || "·"}
                </span>
              ))}
            </div>
            <p className="border-t border-border pt-2 text-[12px] font-semibold leading-5 sm:text-sm">{scene.outcome}</p>
          </div>
        );
      }}
    />
  );
}
