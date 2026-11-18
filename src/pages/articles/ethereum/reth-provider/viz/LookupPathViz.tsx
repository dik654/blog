import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overlay·#history — key 하나를 읽는 갈림길.
 * Overlay에 값 → 그 값(A = 7). Overlay에서 삭제된 account → None, DB로 내려가지 않음.
 * Overlay에 기록 없음 → history evidence 또는 현재 DB 상태(K = 5).
 * 정상 결과: NotYetWritten · InChangeset · InPlainState. 읽을 수 없음: StateAtBlockPruned · changeset 행 누락.
 */
type Node = "hit" | "deleted" | "miss" | "notYet" | "changeset" | "plain" | "pruned" | "missing";

const SCENES = [
  { label: "Account A", summary: "overlay 값 → 7", note: "A는 overlay의 7이 답이고, DB의 10으로 내려가지 않습니다.", path: ["hit"] },
  { label: "삭제된 account", summary: "None에서 멈춤", note: "삭제 상태 account는 None이 답이고 DB로 내려가지 않습니다(사례는 가정).", path: ["deleted"] },
  { label: "Slot K", summary: "overlay 없음 → 5", note: "K는 아래로 내려가 5를 얻습니다. 두 칸 중 어느 쪽인지는 본문이 정하지 않았습니다.", path: ["miss", "changeset", "plain"] },
  { label: "Pruned history", summary: "StateAtBlockPruned", note: "pruning 경계보다 오래된 history는 StateAtBlockPruned로 중단합니다.", path: ["miss", "pruned"] },
  { label: "Changeset 행 누락", summary: "별도 오류", note: "있어야 할 changeset 행이 없으면 None이 아닌 별도 오류입니다.", path: ["miss", "missing"] },
] as const;

function Box({ id, path, title, body, tone }: { id: Node; path: readonly string[]; title: string; body?: string; tone: "ok" | "err" | "step" }) {
  const on = path.includes(id);
  const border = !on ? "border-border" : tone === "err" ? "border-red-600" : "border-blue-600";
  const head = !on ? "text-muted-foreground" : tone === "err" ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400";
  return (
    <div className={`min-w-0 rounded-lg border bg-background px-2 py-1.5 ${border} ${on ? "" : "opacity-60"}`}>
      <strong className={`block break-keep text-[10px] [overflow-wrap:anywhere] sm:text-[11px] leading-4 ${head}`}>{title}</strong>
      {body ? <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{body}</span> : null}
    </div>
  );
}

export default function LookupPathViz() {
  return (
    <SceneShell
      eyebrow="Key 하나 읽기"
      title="Overlay에서 멈출지, 아래로 내려갈지, 오류로 끊을지"
      description="위에서 아래로 내려가며 key 하나의 답이 정해집니다. 파란 테두리는 값이나 None을 돌려주는 정상 결과, 빨간 테두리는 보관하지 않아 읽을 수 없다는 오류입니다."
      note="A = 7, K = 5는 본문의 설명용 값입니다. 아래 갈래 중 어느 것을 고르는지의 세부 조건은 그리지 않았습니다."
      ariaLabel="execution overlay를 먼저 확인하고 없으면 history 또는 DB로 내려가며, pruned와 missing changeset은 오류로 구분하는 갈림길"
      scenes={SCENES}
      render={(active) => {
        const path: readonly string[] = SCENES[active].path;
        const missOn = path.includes("miss");
        return (
          <div className="min-w-0 space-y-1.5 sm:space-y-2">
            <strong className="block text-center text-xs">H1000의 execution overlay에 이 key가 있나?</strong>
            <div className="grid grid-cols-3 gap-2">
              <Box id="hit" path={path} tone="ok" title="값 있음 → 그 값 (A = 7)" />
              <Box id="deleted" path={path} tone="ok" title="account 삭제 → None" />
              <Box id="miss" path={path} tone="step" title="기록 없음 → 아래로" />
            </div>
            <p className={`text-center text-[10px] font-bold ${missOn ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground/60"}`}>↓ history evidence 또는 현재 DB</p>
            <div className={`space-y-2 rounded-lg border border-dashed p-2 ${missOn ? "border-blue-600/60" : "border-border"}`}>
              <div className="grid grid-cols-3 gap-2">
                <Box id="notYet" path={path} tone="ok" title="NotYetWritten" />
                <Box id="changeset" path={path} tone="ok" title="InChangeset" />
                <Box id="plain" path={path} tone="ok" title="InPlainState" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Box id="pruned" path={path} tone="err" title="StateAtBlockPruned" />
                <Box id="missing" path={path} tone="err" title="changeset 행 누락" />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
