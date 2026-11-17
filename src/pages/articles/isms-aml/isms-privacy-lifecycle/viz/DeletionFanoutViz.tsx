import SceneShell from "./SceneShell";

/**
 * 본문 대응: #deletion-derived-data 첫 문단 — 요청·deadline event → manifest → idempotent command → typed receipt.
 * 사본 목록은 글 첫머리의 가정(원본 DB·검색 index·analytics table·feature store·backup·support export)입니다.
 * 각 사본에 붙인 receipt 값은 receipt 종류를 보이려는 가정입니다.
 */
type Receipt = "deleted" | "not found" | "held" | "failed" | "backup";

const ARTIFACTS = ["원본 DB", "검색 index", "analytics table", "feature store", "backup", "support export"] as const;
const RECEIPTS: readonly Receipt[] = ["deleted", "deleted", "failed", "not found", "backup", "held"];

const SCENES = [
  {
    label: "삭제 사건",
    summary: "subject request 또는 deadline event",
    note: "정보주체의 삭제 요청이나 보유기한 도래가 deletion job을 깨웁니다. 이 단계에서는 아직 어느 system에 사본이 있는지 모릅니다.",
  },
  {
    label: "manifest 펼치기",
    summary: "원본에서 생긴 사본 6곳",
    note: "Artifact manifest는 lineage(원본에서 어떤 사본이 생겼는지 이은 기록)를 따라 모은 사본 목록입니다. 이 글의 예에서 이력서는 원본 DB뿐 아니라 검색 index, analytics table, feature store, backup, support export에 복제돼 있습니다.",
  },
  {
    label: "idempotent command",
    summary: "6곳에 같은 삭제 명령",
    note: "각 system에 idempotent command를 보냅니다. Idempotent는 같은 명령이 두 번 도착해도 한 번 실행한 것과 결과가 같다는 뜻입니다.",
  },
  {
    label: "typed receipt",
    summary: "deleted · not found · held · failed",
    note: "결과를 성공/실패 한 칸이 아니라 종류가 있는 receipt로 모읍니다. 어느 칸에 어떤 값이 오는지는 설명용 가정입니다. Backup은 즉시 덮어쓸 수 없을 수 있어 아래 backup 문단의 절차로 다룹니다.",
  },
  {
    label: "Primary 404만 본다면",
    summary: "원본 1곳 확인 ≠ 6곳 완료",
    note: "원본 DB가 404를 돌려줬다는 사실은 한 칸의 결과일 뿐입니다. failed·held·backup 칸이 남아 있으면 lifecycle은 완료되지 않습니다.",
  },
] as const;

const LABEL: Record<Receipt, string> = {
  deleted: "deleted",
  "not found": "not found",
  held: "held",
  failed: "failed",
  backup: "별도 backup 절차",
};
const TONE: Record<Receipt, string> = {
  deleted: "text-emerald-700 dark:text-emerald-400",
  "not found": "text-emerald-700 dark:text-emerald-400",
  held: "text-amber-700 dark:text-amber-400",
  failed: "text-red-700 dark:text-red-400",
  backup: "text-amber-700 dark:text-amber-400",
};
const MARK: Record<Receipt, string> = { deleted: "●", "not found": "●", held: "◐", failed: "✕", backup: "◐" };

export default function DeletionFanoutViz() {
  return (
    <SceneShell
      eyebrow="삭제 fan-out"
      title="삭제 요청 하나가 사본마다 다른 결과로 돌아옵니다"
      description="한 사람의 이력서가 여섯 곳에 복제됐다는 글 첫머리의 가정을 씁니다. ●는 이 사본이 닫힘, ◐는 보류·별도 절차, ✕는 실패입니다."
      ariaLabel="삭제 요청이 artifact manifest를 따라 여섯 사본으로 퍼지고 receipt로 돌아오는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className={`mx-auto max-w-sm rounded-lg border px-3 py-2 text-center text-xs sm:text-sm ${active === 0 ? "border-primary bg-primary/[0.06]" : "border-border bg-background"}`}>
            <p className="font-semibold">deletion job</p>
            <p className="text-muted-foreground">요청 또는 deadline event</p>
          </div>
          <p className="my-1.5 text-center text-xs text-muted-foreground" aria-hidden>{active >= 3 ? "↑ receipt" : active >= 1 ? "↓ manifest" : "·"}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ARTIFACTS.map((name, index) => {
              const shown = active >= 1;
              const focusPrimary = active === 4;
              const receipt = RECEIPTS[index];
              const dim = focusPrimary && index !== 0;
              return (
                <div
                  key={name}
                  className={`min-w-0 rounded-lg border px-3 py-2 text-xs transition-opacity sm:text-sm ${shown ? "border-border bg-background" : "border-dashed border-border/50"} ${dim ? "opacity-60" : ""}`}
                >
                  <p className={`break-keep font-semibold ${shown ? "" : "text-muted-foreground/50"}`}>{shown ? name : "?"}</p>
                  <p className="mt-0.5 break-keep font-mono text-[11px] sm:text-xs">
                    {active < 2 ? (
                      <span className="text-muted-foreground">{shown ? "사본 있음" : "아직 모름"}</span>
                    ) : active === 2 ? (
                      <span className="text-primary">→ delete(id)</span>
                    ) : focusPrimary && index === 0 ? (
                      <span className={TONE.deleted}>● 404 확인</span>
                    ) : (
                      <span className={TONE[receipt]}>{MARK[receipt]} {LABEL[receipt]}</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
