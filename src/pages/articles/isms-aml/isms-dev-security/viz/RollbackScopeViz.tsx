import SceneShell from "./SceneShell";

/**
 * 본문 대응: #build-deploy-gate 셋째 문단 "Release 뒤 authorization negative fixture, error rate, latency, security signal과
 * business invariant를 canary에서 비교합니다. Rollback은 이전 binary만 가리키지 않고 compatible schema/config/feature flag와
 * credential generation을 포함합니다. 이미 외부에 보낸 notification·payment는 되돌릴 수 없으므로 idempotency receipt로 reconcile합니다."
 * 실패 사례는 글의 실패 주입 표 "Canary health는 정상이나 403 fixture가 200"을 씁니다.
 */
type Mark = "idle" | "pass" | "fail";

type Scene = {
  label: string;
  summary: string;
  note: string;
  signals: readonly Mark[];
  rolled: readonly boolean[];
  external: "none" | "reconcile";
  verdict: string;
  bad: boolean;
};

const SIGNALS = ["Authorization negative fixture", "Error rate", "Latency", "Security signal", "Business invariant"] as const;
const PARTS = ["Binary", "Schema", "Config", "Feature flag", "Credential generation"] as const;

const SCENES: readonly Scene[] = [
  {
    label: "Canary 비교",
    summary: "health 정상 · 403 fixture가 200",
    note: "Canary에서 다섯 signal을 비교합니다. 실패 주입 표의 사례처럼 error rate 같은 health는 정상인데, 다른 직원 급여 조회가 403이어야 할 fixture가 200을 돌려받으면 이 release는 통과하지 못합니다. 오류율이 낮다는 사실은 authorization oracle을 대신하지 않습니다.",
    signals: ["fail", "pass", "idle", "idle", "idle"],
    rolled: [false, false, false, false, false],
    external: "none",
    verdict: "Canary 실패 → rollback",
    bad: true,
  },
  {
    label: "Binary만 되돌리면",
    summary: "나머지 네 칸은 지정 안 됨",
    note: "이전 binary만 가리키면 schema·config·feature flag·credential generation은 rollback 대상에서 빠져, 새 release 때의 상태가 이전 binary와 맞는지 아무도 확인하지 않은 채 남습니다. 글은 rollback 대상이 이 넷을 포함해야 한다고 말합니다.",
    signals: ["fail", "pass", "idle", "idle", "idle"],
    rolled: [true, false, false, false, false],
    external: "none",
    verdict: "Rollback 대상이 binary 하나뿐",
    bad: true,
  },
  {
    label: "호환되는 묶음으로",
    summary: "이전 binary + 호환되는 네 칸",
    note: "Rollback target은 이전 binary와 함께 그 binary와 호환되는(compatible) schema·config·feature flag·credential generation을 한 묶음으로 가리킵니다. 호환되는 버전이 꼭 직전 버전이라는 뜻은 아닙니다. 글의 실패 표처럼 expand/contract migration으로 넓혀 둔 schema는 이전 binary와 함께 그대로 쓸 수 있습니다.",
    signals: ["fail", "pass", "idle", "idle", "idle"],
    rolled: [true, true, true, true, true],
    external: "none",
    verdict: "내부 상태는 호환되는 묶음으로",
    bad: false,
  },
  {
    label: "외부로 나간 effect",
    summary: "되돌릴 수 없음 → reconcile",
    note: "그 사이 이미 외부로 보낸 notification·payment는 rollback으로 거둘 수 없습니다. Idempotency receipt(같은 요청을 다시 처리해도 한 번만 반영되게 남긴 요청별 기록)로 무엇이 실제로 나갔는지 맞춰 봅니다(reconcile).",
    signals: ["fail", "pass", "idle", "idle", "idle"],
    rolled: [true, true, true, true, true],
    external: "reconcile",
    verdict: "외부 effect는 receipt로 대조",
    bad: false,
  },
];

const MARK_TEXT: Record<Mark, string> = { idle: "—", pass: "정상", fail: "실패" };

export default function RollbackScopeViz() {
  return (
    <SceneShell
      eyebrow="Canary와 rollback"
      title="되돌릴 수 있는 묶음과 이미 밖으로 나간 effect를 나눕니다"
      description="왼쪽은 canary에서 비교하는 signal, 오른쪽은 rollback이 가리키는 다섯 칸입니다. 이 사례에서 결과를 글이 말하지 않은 signal은 —로 비워 둡니다."
      ariaLabel="canary 실패 뒤 rollback 범위와 외부 effect reconcile"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <div className="min-w-0 space-y-1.5">
                <p className="text-[10px] font-black text-muted-foreground">Canary signal</p>
                {SIGNALS.map((name, index) => {
                  const mark = scene.signals[index];
                  return (
                    <div
                      key={name}
                      className={`flex min-w-0 items-center justify-between gap-2 rounded border bg-background px-2 py-1 text-[11px] ${
                        mark === "fail" ? "border-[#dc2626]" : "border-border"
                      }`}
                    >
                      <span className="min-w-0 break-keep">{name}</span>
                      <span className={`shrink-0 font-bold ${mark === "fail" ? "text-[#b91c1c] dark:text-[#f87171]" : mark === "pass" ? "text-foreground" : "text-muted-foreground"}`}>
                        {MARK_TEXT[mark]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="min-w-0 space-y-1.5">
                <p className="text-[10px] font-black text-muted-foreground">Rollback이 가리키는 것</p>
                {PARTS.map((name, index) => {
                  const back = scene.rolled[index];
                  const partial = active === 1 && !back;
                  return (
                    <div
                      key={name}
                      className={`flex min-w-0 items-center justify-between gap-2 rounded border bg-background px-2 py-1 text-[11px] ${
                        back ? "border-[#2563eb]" : partial ? "border-dashed border-[#dc2626]" : "border-border"
                      }`}
                    >
                      <span className="min-w-0 break-keep">{name}</span>
                      <span className={`shrink-0 font-bold ${back ? "text-[#2563eb] dark:text-[#60a5fa]" : partial ? "text-[#b91c1c] dark:text-[#f87171]" : "text-muted-foreground"}`}>
                        {back ? (index === 0 ? "이전 binary" : "호환 버전 지정") : partial ? "지정 안 됨" : "새 release"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              className={`rounded-lg border px-3 py-2 text-[11px] ${
                scene.external === "reconcile" ? "border-[#d97706]" : "border-dashed border-border text-muted-foreground/70"
              }`}
            >
              <p className="font-bold">이미 외부로 보낸 notification·payment</p>
              <p className="mt-0.5">{scene.external === "reconcile" ? "Rollback 범위 밖 · idempotency receipt로 reconcile" : "Rollback 범위 밖 (다음 장면에서 다룸)"}</p>
            </div>
            <div
              className={`rounded-lg border px-3 py-2 text-sm font-bold ${scene.bad ? "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]" : "border-border"}`}
            >
              {scene.verdict}
            </div>
          </div>
        );
      }}
    />
  );
}
