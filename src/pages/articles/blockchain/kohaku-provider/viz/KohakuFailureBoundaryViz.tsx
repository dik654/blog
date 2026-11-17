import SceneShell from "./KohakuSceneShell";

/**
 * 본문 대응: #failure-boundary — alpha.13 Helios adapter의 설계된 실패 지점.
 * 생성: executionRpc 없음 → 초기화 거부 / client 생성·waitSynced 실패 → Provider 반환 안 함.
 * 호출(bypassLogs=true getLogs): fetch·JSON decode·RPC error → 호출 오류로 전파.
 * 실패한 Helios 요청을 다른 backend로 바꾸는 fallback은 이 소스에 없음.
 */
type Status = "idle" | "ok" | "fail";

const BUILD = [
  { name: "executionRpc 확인", fail: "초기화 거부" },
  { name: "Helios client 생성", fail: "Provider 반환 안 함" },
  { name: "waitSynced()", fail: "Provider 반환 안 함" },
  { name: "Provider 반환", fail: "" },
] as const;

const CALL = [
  { name: "fetch(executionRpc)", fail: "호출 오류로 전파" },
  { name: "JSON decode", fail: "호출 오류로 전파" },
  { name: "RPC error 확인", fail: "호출 오류로 전파" },
  { name: "TxLog[] 반환", fail: "" },
] as const;

const SCENES = [
  {
    label: "설정 없음",
    summary: "executionRpc 없음 → 초기화 거부",
    build: ["fail", "idle", "idle", "idle"],
    call: ["idle", "idle", "idle", "idle"],
    note: "첫 칸에서 멈춥니다. executionRpc가 없으면 adapter는 초기화를 거부하고, 애플리케이션은 Provider를 받지 못합니다.",
  },
  {
    label: "생성·동기화 실패",
    summary: "client 생성 또는 waitSynced 실패",
    build: ["ok", "fail", "fail", "idle"],
    call: ["idle", "idle", "idle", "idle"],
    note: "설정이 있어도 Helios client 생성이나 waitSynced() 중 하나가 실패하면 Provider를 반환하지 않습니다.",
  },
  {
    label: "우회 호출 실패",
    summary: "bypassLogs=true · fetch·decode·RPC error",
    build: ["ok", "ok", "ok", "ok"],
    call: ["fail", "fail", "fail", "idle"],
    note: "Provider를 받은 뒤 bypassLogs=true인 getLogs가 execution RPC로 갑니다. fetch, JSON decode, RPC error 중 어디서 실패해도 그 호출의 오류로 애플리케이션에 전달됩니다.",
  },
  {
    label: "없는 화살표",
    summary: "다른 backend로 자동 전환 · 소스에 없음",
    build: ["ok", "ok", "ok", "ok"],
    call: ["idle", "idle", "idle", "idle"],
    note: "어느 실패 칸에서도 다른 backend로 가는 경로가 없습니다. 이 화살표를 추가하면 어떤 오류에 어떤 backend로 바꾸고 누가 기록하는지라는 새 운영 정책이 필요합니다.",
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  build: readonly Status[];
  call: readonly Status[];
  note: string;
}[];

const STATUS_CLASS: Record<Status, string> = {
  idle: "border-border bg-background text-muted-foreground",
  ok: "border-emerald-600/60 bg-emerald-500/[0.06] text-foreground",
  fail: "border-red-600 bg-red-500/[0.06] text-foreground",
};

const STATUS_MARK: Record<Status, string> = { idle: "대기", ok: "통과", fail: "실패 가능" };

function Lane({
  title,
  steps,
  statuses,
}: {
  title: string;
  steps: readonly { name: string; fail: string }[];
  statuses: readonly Status[];
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold text-muted-foreground">{title}</p>
      <ol className="mt-1.5 grid gap-1 sm:mt-2 sm:grid-cols-4 sm:gap-2">
        {steps.map((step, index) => {
          const status = statuses[index];
          const showFail = status === "fail" && step.fail !== "";
          return (
            <li
              key={step.name}
              className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 rounded-md border px-2.5 py-1.5 sm:block sm:rounded-lg sm:py-2 ${STATUS_CLASS[status]}`}
            >
              <span className="min-w-0">
                <span className="hidden font-mono text-[10px] text-muted-foreground sm:block">
                  {String(index + 1).padStart(2, "0")} · {STATUS_MARK[status]}
                </span>
                <strong className="block font-mono text-[11px] leading-4 [overflow-wrap:anywhere] sm:mt-1 sm:text-xs">{step.name}</strong>
              </span>
              <span
                className={`block text-right text-[10px] font-semibold leading-4 sm:mt-1.5 sm:min-h-4 sm:text-left sm:text-[11px] ${
                  showFail ? "text-red-700 dark:text-red-300" : "text-muted-foreground"
                }`}
              >
                <span className="sm:hidden">{showFail ? `→ ${step.fail}` : STATUS_MARK[status]}</span>
                <span className={`hidden sm:inline ${showFail ? "" : "sm:invisible"}`}>↓ {step.fail || "—"}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function KohakuFailureBoundaryViz() {
  return (
    <SceneShell
      eyebrow="설계된 실패 지점"
      title="실패는 다른 backend로 넘어가지 않고 오류로 멈춥니다"
      description="위 줄은 Helios adapter가 Provider를 만드는 단계, 아래 줄은 bypassLogs=true일 때 getLogs 한 번의 단계입니다. alpha.13 소스 기준입니다."
      note="빨간 칸은 그 단계에서 실패할 수 있다는 표시이며, 실제 실패 빈도는 측정하지 않았습니다."
      ariaLabel="Kohaku Helios adapter의 생성 단계와 우회 getLogs 호출 단계에서 실패가 오류로 전파되고 fallback이 없는 구조"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const noFallback = active === 3;
        return (
          <div className="min-w-0 space-y-3 sm:space-y-4">
            <Lane title="Provider 생성" steps={BUILD} statuses={scene.build} />
            <Lane title="getLogs 호출 · bypassLogs=true" steps={CALL} statuses={scene.call} />
            <div
              className={`rounded-lg border border-dashed px-3 py-2.5 text-xs leading-5 ${
                noFallback ? "border-red-600 text-foreground" : "border-border/60 text-muted-foreground"
              }`}
            >
              <span className={`font-mono font-bold ${noFallback ? "line-through decoration-red-600" : ""}`}>
                실패 → 다른 backend로 자동 전환
              </span>
              <span className={`ml-2 font-semibold ${noFallback ? "text-red-700 dark:text-red-300" : ""}`}>
                alpha.13 소스에 없음
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
