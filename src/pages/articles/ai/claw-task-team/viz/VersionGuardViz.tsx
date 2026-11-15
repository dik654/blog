import SceneShell from "./SceneShell";

/**
 * 본문 대응: #registry — assign의 compare-and-set과 늦은 event 거부.
 * w-3·attempt 2·version 7은 Overview의 auth-401-17 예. v6·v5·w-5는 그림용 가정.
 * 각 장면은 시간 순서 4칸(t1~t4)을 고정해서 씁니다.
 */
type Mark = "ok" | "fail" | "warn" | "none";
type Row = { left: string; registry: string; right: string; mark: Mark };

const SCENES = [
  {
    label: "찾고 나중에 기록하면",
    summary: "한 task에 owner 둘",
    lanes: ["scheduler A", "scheduler B"],
    rows: [
      { left: "Pending 읽음", registry: "Pending · owner 없음", right: "", mark: "none" },
      { left: "", registry: "Pending · owner 없음", right: "Pending 읽음", mark: "none" },
      { left: "owner = w-3 기록", registry: "owner w-3", right: "", mark: "none" },
      { left: "", registry: "owner w-5 (덮어씀)", right: "owner = w-5 기록", mark: "warn" },
    ],
    note: "조회와 기록 사이에 다른 scheduler가 끼어듭니다. 둘 다 Pending을 봤으므로 둘 다 자기가 배정했다고 믿고, registry에는 마지막에 쓴 값만 남습니다. w-5와 version 숫자는 그림을 위한 가정입니다.",
  },
  {
    label: "조건부로 한 번에 쓰면",
    summary: "기대한 v6가 아니면 실패",
    lanes: ["scheduler A", "scheduler B"],
    rows: [
      { left: "Pending · v6 읽음", registry: "Pending · v6", right: "", mark: "none" },
      { left: "", registry: "Pending · v6", right: "Pending · v6 읽음", mark: "none" },
      { left: "Pending·v6일 때만 → w-3", registry: "Assigned · w-3 · attempt 2 · v7", right: "", mark: "ok" },
      { left: "", registry: "그대로 v7", right: "Pending·v6일 때만 → w-5", mark: "fail" },
    ],
    note: "compare-and-set은 ‘status와 version이 내가 읽은 값 그대로일 때만’ owner와 lease를 함께 바꿉니다. A가 먼저 v7로 올렸으므로 B의 조건은 맞지 않아 쓰기가 거부됩니다.",
  },
  {
    label: "이전 attempt의 늦은 event",
    summary: "version이 다르면 거부",
    lanes: ["attempt 2 (w-3)", "attempt 1 (이전)"],
    rows: [
      { left: "heartbeat · v7", registry: "Running · attempt 2 · v7", right: "", mark: "ok" },
      { left: "", registry: "거부: 현재 v7", right: "‘완료’ 보고 · v5", mark: "fail" },
      { left: "완료 요청 · v7", registry: "verifier ID·artifact ref 확인", right: "", mark: "none" },
      { left: "", registry: "Completed", right: "", mark: "ok" },
    ],
    note: "attempt 1이 남긴 늦은 event는 그때의 version(가정 v5)을 들고 옵니다. 지금 task는 v7이므로 거부됩니다. 현재 attempt의 완료도 verifier ID와 artifact reference가 있어야 Completed로 넘어갑니다.",
  },
] as const satisfies readonly { label: string; summary: string; lanes: readonly [string, string]; rows: readonly Row[]; note: string }[];

const MARK_TEXT: Record<Mark, string> = { ok: "✓", fail: "✗", warn: "!", none: "" };
const MARK_CLASS: Record<Mark, string> = {
  ok: "border-emerald-600/60 text-emerald-700 dark:text-emerald-400",
  fail: "border-red-600/60 text-red-700 dark:text-red-400",
  warn: "border-amber-600/60 text-amber-700 dark:text-amber-400",
  none: "border-border/70 text-foreground",
};

function Cell({ text, align }: { text: string; align: "left" | "right" }) {
  if (!text) return <div aria-hidden className="min-h-[2.5rem]" />;
  return (
    <div className={`flex min-h-[2.5rem] min-w-0 items-center ${align === "right" ? "justify-end text-right" : ""}`}>
      <span className="min-w-0 break-words rounded-md border border-border/70 bg-background px-2 py-1 text-[11px] leading-4 sm:text-xs">
        {align === "left" ? `${text} →` : `← ${text}`}
      </span>
    </div>
  );
}

export default function VersionGuardViz() {
  return (
    <SceneShell
      eyebrow="registry의 version 조건"
      title="같은 task에 두 쪽이 쓰면 version이 승자를 가른다"
      description="세로로 내려갈수록 시간이 흐릅니다(t1→t4). 가운데 열은 쓰기 직후 registry에 남은 auth-401-17의 상태입니다. version 번호는 숫자가 커질수록 나중 상태라는 뜻으로 붙인 가정입니다."
      ariaLabel="두 scheduler의 경쟁과 이전 attempt의 늦은 event가 version 조건으로 걸러지는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rows: readonly Row[] = scene.rows;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)] gap-2 border-b border-border/70 pb-2 text-[11px] font-bold sm:text-xs">
              <span>{scene.lanes[0]}</span>
              <span className="text-center text-primary">registry</span>
              <span className="text-right">{scene.lanes[1]}</span>
            </div>
            <div className="mt-2 space-y-2">
              {rows.map((row, index) => (
                <div key={index} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)] items-center gap-2">
                  <Cell text={row.left} align="left" />
                  <div className={`flex min-h-[2.5rem] min-w-0 items-center justify-center gap-1 rounded-md border px-2 py-1 text-center text-[11px] font-semibold leading-4 sm:text-xs ${MARK_CLASS[row.mark]}`}>
                    <span className="font-mono text-muted-foreground">t{index + 1}</span>
                    <span className="min-w-0 break-words">{row.registry}</span>
                    {row.mark !== "none" && <span aria-label={row.mark}>{MARK_TEXT[row.mark]}</span>}
                  </div>
                  <Cell text={row.right} align="right" />
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
