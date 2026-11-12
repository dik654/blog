import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./ClawSceneShell";

/**
 * 본문 대응: #enforcer "Approval token은 범위·실행자·수명을 가진 예외 record입니다".
 * 기본 최대 사용 횟수 1, consume 때 uses 증가 → 한도면 Consumed.
 * Verify·consume 검사 항목: token 존재, Pending·Consumed·Expired·Revoked 상태, 현재 시각, exact scope, exact executor.
 * 다른 branch → scope mismatch, 다른 executor → unauthorized delegate.
 * branch 이름·actor 이름은 설명용 가정입니다.
 */
type Check = "ok" | "fail" | "none";

const CHECK_LABELS = ["상태", "현재 시각", "scope", "executor"] as const;

const SCENES = [
  {
    label: "승인된 token",
    summary: "Granted · uses 0 / 1",
    status: "Granted",
    uses: 0,
    request: "아직 사용 요청 없음",
    checks: ["none", "none", "none", "none"] as readonly Check[],
    result: "대기",
    tone: "neutral",
    note: "승인은 edit_file(auth.ts)라는 action과 repository·branch(선택)에 묶이고, 승인한 actor와 실행할 executor를 따로 적습니다. 최대 사용 횟수를 따로 정하지 않으면 기본값은 한 번입니다.",
  },
  {
    label: "정해진 executor가 사용",
    summary: "검사 통과 → uses 1 / 1 → Consumed",
    status: "Consumed",
    uses: 1,
    request: "agent A · fix-login · edit_file(auth.ts)",
    checks: ["ok", "ok", "ok", "ok"] as readonly Check[],
    result: "통과 · uses가 한도에 닿아 Consumed",
    tone: "ok",
    note: "네 검사를 모두 통과하면 consume이 uses를 1 올립니다. 한도 1에 닿았으므로 상태가 Consumed로 바뀝니다.",
  },
  {
    label: "같은 token 재사용",
    summary: "Consumed라 실패",
    status: "Consumed",
    uses: 1,
    request: "agent A · fix-login · edit_file(auth.ts)",
    checks: ["fail", "ok", "ok", "ok"] as readonly Check[],
    result: "실패 · 이미 Consumed",
    tone: "fail",
    note: "시각·scope·executor가 모두 앞과 똑같아도 상태가 Consumed라 막힙니다. 한 번 쓴 승인을 다시 쓰는 replay를 이렇게 거릅니다.",
  },
  {
    label: "사용 전, 다른 branch",
    summary: "scope mismatch",
    status: "Granted",
    uses: 0,
    request: "agent A · main · edit_file(auth.ts)",
    checks: ["ok", "ok", "fail", "ok"] as readonly Check[],
    result: "실패 · scope mismatch",
    tone: "fail",
    note: "1장면의 아직 쓰지 않은 token이라고 다시 가정합니다. action이 같아도 branch가 다르면 exact scope 검사에서 실패하고 uses는 0 그대로입니다.",
  },
  {
    label: "사용 전, 다른 executor",
    summary: "unauthorized delegate",
    status: "Granted",
    uses: 0,
    request: "agent B · fix-login · edit_file(auth.ts)",
    checks: ["ok", "ok", "ok", "fail"] as readonly Check[],
    result: "실패 · unauthorized delegate",
    tone: "fail",
    note: "scope가 모두 같아도 승인에 적힌 executor가 아니면 exact executor 검사에서 실패합니다. 승인한 사람과 실행하는 주체를 나눠 적은 이유가 여기서 드러납니다.",
  },
] as const;

const CHECK_MARK: Record<Check, { sign: string; color: string }> = {
  ok: { sign: "✓", color: "#16a34a" },
  fail: { sign: "✕", color: "#dc2626" },
  none: { sign: "–", color: "#94a3b8" },
};

export default function TokenLifecycleViz() {
  return (
    <SceneShell
      eyebrow="승인 token 한 장"
      title="한 번 쓴 승인, 다른 branch, 다른 executor는 같은 검사에서 막힙니다"
      description="왼쪽은 ledger에 저장된 token, 오른쪽은 그 token을 쓰려는 요청입니다. agent A·B와 branch fix-login·main은 설명용 이름입니다(가정)."
      note="이 ledger는 pinned 시점에 PermissionPolicy·dispatch와 연결된 소비 경로가 확인되지 않은 in-memory 모듈입니다. 그림은 ledger 단독의 검사 규칙입니다."
      ariaLabel="approval token의 uses와 상태가 consume, replay, scope mismatch, executor mismatch에서 어떻게 판정되는지"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="grid min-w-0 gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-lg border border-border px-3 py-2 text-xs leading-5">
                <span className="block font-semibold text-primary">token (ledger)</span>
                <dl className="mt-1 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-2">
                  <dt className="text-muted-foreground">scope</dt>
                  <dd className="break-words font-mono">edit_file(auth.ts) · fix-login</dd>
                  <dt className="text-muted-foreground">approver</dt>
                  <dd className="font-mono">사용자</dd>
                  <dt className="text-muted-foreground">executor</dt>
                  <dd className="font-mono">agent A</dd>
                  <dt className="text-muted-foreground">uses / max</dt>
                  <dd className="font-mono font-bold">{scene.uses} / 1</dd>
                  <dt className="text-muted-foreground">상태</dt>
                  <dd className={`font-mono font-bold ${scene.status === "Consumed" ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"}`}>{scene.status}</dd>
                </dl>
              </div>
              <div className="min-w-0 rounded-lg border border-border px-3 py-2 text-xs leading-5">
                <span className="block font-semibold text-primary">사용 요청</span>
                <span className="mt-1 block break-words font-mono">{scene.request}</span>
                <div className="mt-2 grid grid-cols-4 gap-1 text-center">
                  {CHECK_LABELS.map((label, index) => {
                    const mark = CHECK_MARK[scene.checks[index]];
                    return (
                      <span key={label} className="rounded border border-border px-1 py-1">
                        <span className="block text-[11px] text-muted-foreground">{label}</span>
                        <span className="block font-bold" style={{ color: mark.color }}>{mark.sign}</span>
                      </span>
                    );
                  })}
                </div>
                <span
                  className={`mt-2 block font-semibold ${
                    scene.tone === "ok" ? "text-emerald-700 dark:text-emerald-400" : scene.tone === "fail" ? "text-red-700 dark:text-red-400" : "text-muted-foreground"
                  }`}
                >
                  {scene.result}
                </span>
              </div>
            </div>
          ))}
        />
      )}
    />
  );
}
