import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./ClawSceneShell";

/**
 * 본문 대응: #enforcer "실행 성공과 승인 소비는 crash에서도 연결돼야 합니다".
 * consume을 effect 전에 끝내면 실행 실패 시 승인을 잃고, effect 뒤에만 하면 crash 때 같은 token이 재사용될 수 있다.
 * 재개 시 stable operation ID로 status lookup: completed → 기존 effect에 result, failed → 안전 조건 확인 뒤 retry,
 * unknown → 사람 확인이나 compensation. 이 protocol은 pinned 구현이 아니라 hardening 요구사항이다.
 */
type Mark = "done" | "fail" | "crash" | "todo";

const MARK_STYLE: Record<Mark, { border: string; sign: string; color: string }> = {
  done: { border: "border-border", sign: "✓", color: "#16a34a" },
  fail: { border: "border-red-600", sign: "✕", color: "#dc2626" },
  crash: { border: "border-dashed border-red-600", sign: "✕", color: "#dc2626" },
  todo: { border: "border-dashed border-border", sign: "·", color: "#94a3b8" },
};

const SCENES = [
  {
    label: "consume을 effect 전에",
    summary: "실행이 실패하면 승인만 사라짐",
    steps: [
      ["scope·executor·expiry 확인", "done"],
      ["token consume", "done"],
      ["auth.ts edit", "fail"],
      ["result 기록", "todo"],
    ] as const,
    state: [["token", "Consumed"], ["auth.ts", "그대로"], ["tool result", "실패"]] as const,
    note: "consume을 effect 전에 끝내면 edit가 실패해도 token은 이미 Consumed입니다. 수정은 일어나지 않았는데 승인만 잃습니다.",
  },
  {
    label: "consume을 effect 뒤에",
    summary: "edit 직후 crash → token이 남음",
    steps: [
      ["scope·executor·expiry 확인", "done"],
      ["auth.ts edit", "done"],
      ["process 종료", "crash"],
      ["token consume", "todo"],
    ] as const,
    state: [["token", "아직 사용 가능"], ["auth.ts", "이미 수정됨"], ["tool result", "없음"]] as const,
    note: "edit는 disk에 남았는데 tool result는 없고 token도 쓰이지 않았습니다. 재개할 때 같은 token으로 edit를 blind replay하면 같은 수정이 한 번 더 적용됩니다.",
  },
  {
    label: "재개 전에 operation부터 조회",
    summary: "operation ID로 status lookup",
    steps: [
      ["token·operation ID를 planned operation에 묶음", "done"],
      ["auth.ts edit", "done"],
      ["process 종료", "crash"],
      ["재개: status lookup", "done"],
    ] as const,
    state: [["planned op", "ID · before digest"], ["auth.ts", "이미 수정됨"], ["다음 행동", "조회 결과로 결정"]] as const,
    note: "실행 전에 token과 stable operation ID를 planned operation에 먼저 묶어 두면, 재개할 때 edit를 다시 실행하지 않고 그 operation의 status부터 확인할 수 있습니다.",
  },
] as const;

const BRANCHES = [
  ["completed", "기존 effect에 result를 붙임", "#16a34a"],
  ["failed", "안전 조건 확인 뒤 retry", "#d97706"],
  ["unknown", "사람 확인 또는 compensation", "#dc2626"],
] as const;

const ALL_SCENES = [
  ...SCENES,
  {
    label: "조회 결과로 갈라짐",
    summary: "completed · failed · unknown",
    note: "status가 completed면 다시 실행하지 않고 결과만 붙이고, failed면 안전 조건을 확인한 뒤 retry하며, unknown이면 사람의 확인이나 compensation으로 보냅니다. exactly-once를 주장하는 대신 이 갈래를 설계합니다.",
  },
] as const;

export default function CrashConsumeViz() {
  return (
    <SceneShell
      eyebrow="crash 순서"
      title="승인을 언제 소비하든 crash 뒤에는 상태 조회가 필요합니다"
      description="consume은 approval token의 사용 횟수를 올려 다시 못 쓰게 만드는 일입니다. 로그인 사례의 auth.ts edit 한 번을 시간 순서로 따라갑니다."
      note="일반 file write와 in-memory ledger 사이에는 원자적 transaction이 없습니다. operation ID·status lookup·reconciliation은 pinned 구현이 아니라 필요한 hardening입니다."
      ariaLabel="approval consume 시점과 crash, 재개 시 status lookup 갈래를 시간 순서로 보여 주는 네 장면"
      scenes={ALL_SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            ...SCENES.map((scene) => (
              <div key={scene.label} className="min-w-0">
                <ol className="grid gap-2 sm:grid-cols-4">
                  {scene.steps.map(([text, mark], index) => {
                    const style = MARK_STYLE[mark];
                    return (
                      <li key={text} className={`flex min-w-0 items-center gap-2 rounded-lg border px-2 py-2 text-xs leading-5 sm:flex-col sm:items-start ${style.border}`}>
                        <span className="font-mono text-[11px] text-muted-foreground">t{index + 1}</span>
                        <span className={`min-w-0 flex-1 break-words ${mark === "todo" ? "text-muted-foreground" : "font-semibold"}`}>{text}</span>
                        <span className="font-bold" style={{ color: style.color }}>{style.sign}</span>
                      </li>
                    );
                  })}
                </ol>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-xs leading-5">
                  {scene.state.map(([key, value]) => (
                    <div key={key} className="min-w-0 rounded-lg bg-muted/40 px-2 py-1.5">
                      <dt className="text-[11px] text-muted-foreground">{key}</dt>
                      <dd className="break-words font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )),
            <div key="branches" className="min-w-0">
              <div className="rounded-lg border border-border px-3 py-2 text-center text-xs font-semibold">재개: operation ID로 status lookup</div>
              <div className="mx-auto h-3 w-px bg-border" />
              <div className="grid gap-2 sm:grid-cols-3">
                {BRANCHES.map(([status, action, color]) => (
                  <div key={status} className="min-w-0 rounded-lg border px-3 py-2 text-xs leading-5" style={{ borderColor: color }}>
                    <span className="block font-mono font-bold" style={{ color }}>{status}</span>
                    <span className="block break-words">{action}</span>
                  </div>
                ))}
              </div>
            </div>,
          ]}
        />
      )}
    />
  );
}
