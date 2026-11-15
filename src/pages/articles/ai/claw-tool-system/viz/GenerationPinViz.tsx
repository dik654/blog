import ToolSceneShell from "./ToolSceneShell";

/**
 * 본문 대응: #plugin-tools "N세대 call은 N세대 schema와 executor로 끝냅니다".
 * 가로축은 시간이다. 위 띠 = registry generation(N → reload → N+1), 아래 = turn 시작 때 만든 call과 그 call이 끝나는 곳.
 * 이 글이 요구하는 hardening contract이며 pinned source가 이미 구현했다는 뜻이 아니다.
 */
interface PinScene {
  label: string;
  summary: string;
  note: string;
  next: boolean;
  outcome: string;
  outcomeSub: string;
  follow: string;
  tone: "neutral" | "bad" | "good" | "warn";
  link: boolean;
}

const SCENES: readonly PinScene[] = [
  { label: "Turn 시작: schema N을 본 call", summary: "call → N에 pin", note: "모델은 turn 시작 때 schema N을 보고 call을 만들었습니다. 이 call을 N의 name·schema digest·source instance에 묶어 둡니다.", next: false, outcome: "아직 실행 전", outcomeSub: "name·schema digest·instance = N", follow: "", tone: "neutral", link: false },
  { label: "Reload로 N+1이 나왔을 때", summary: "N call ≠ N+1 validator", note: "tools/list_changed나 plugin reload로 N+1이 나왔습니다. 이미 만든 call을 N+1 validator와 executor에 그대로 넘기면 모델이 보지 않은 계약으로 조용히 재해석됩니다.", next: true, outcome: "N+1 validator·executor로 넘기기", outcomeSub: "금지: N call이 N+1 schema로 재해석됨", follow: "", tone: "bad", link: true },
  { label: "N instance가 남아 있으면", summary: "N으로 완료", note: "Call이 pin한 N instance가 아직 살아 있으면 그 instance로 끝냅니다.", next: true, outcome: "N instance로 완료", outcomeSub: "schema digest N · executor N", follow: "", tone: "good", link: true },
  { label: "N instance가 없으면", summary: "stale_registry_generation", note: "N으로 끝낼 수 없으면 call을 stale_registry_generation으로 취소하고, N+1 definition을 넣어 모델에 다시 요청합니다.", next: true, outcome: "stale_registry_generation 취소", outcomeSub: "N으로 끝낼 수 없음", follow: "N+1 definition으로 모델에 다시 요청", tone: "warn", link: true },
  { label: "N+1이 unhealthy하면", summary: "이전 snapshot으로 rollback", note: "N+1 registry가 unhealthy하면 이전 registry snapshot과 executor instance로 atomic rollback할 수 있어야 합니다. In-flight N call을 deadline까지 drain할지 즉시 reject할지는 사전에 정하고, stale rejection·re-discovery·재계획은 audit receipt에 남깁니다.", next: true, outcome: "N+1 unhealthy", outcomeSub: "되돌릴 수 있어야 함", follow: "이전 snapshot으로 atomic rollback", tone: "warn", link: false },
];

const TONE: Record<PinScene["tone"], { border: string; text: string; stroke: string }> = {
  neutral: { border: "border-dashed border-border", text: "text-muted-foreground", stroke: "#94a3b8" },
  bad: { border: "border-red-600", text: "text-red-700 dark:text-red-400", stroke: "#dc2626" },
  good: { border: "border-primary", text: "text-primary", stroke: "#2563eb" },
  warn: { border: "border-amber-600", text: "text-amber-700 dark:text-amber-400", stroke: "#d97706" },
};

function Arrow({ on, color, dashed }: { on: boolean; color: string; dashed: boolean }) {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12" className="shrink-0" aria-hidden style={{ opacity: on ? 1 : 0 }}>
      <line x1={0} y1={6} x2={20} y2={6} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <path d="M15 2 L21 6 L15 10" fill="none" stroke={color} strokeWidth={1} />
    </svg>
  );
}

export default function GenerationPinViz() {
  return (
    <ToolSceneShell
      eyebrow="Registry generation"
      title="Reload 도중에 만든 call은 자기가 본 세대에서 끝냅니다"
      description="Generation은 registry가 publish될 때마다 붙는 세대 번호입니다. 왼쪽 열은 reload 전, 오른쪽 열은 reload 뒤이고, 위 줄은 registry 세대, 아래 줄은 turn 시작 때 만든 call 하나가 어디서 끝나는지입니다. 이 글이 요구하는 hardening 계약이며, pinned source가 이미 구현했다는 뜻은 아닙니다."
      ariaLabel="Registry가 N에서 N+1로 바뀔 때 N에 pin된 call이 끝나는 네 갈래"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active] ?? SCENES[0];
        const tone = TONE[s.tone];
        return (
          <div className="min-w-0 text-xs leading-5">
            <div className="grid min-w-0 grid-cols-2">
              <p className="pb-1 pr-3 font-semibold text-muted-foreground">reload 전</p>
              <p className="min-w-0 break-words border-l border-dashed border-amber-600/70 pb-1 pl-3 font-semibold text-amber-700 dark:text-amber-400">
                {s.next ? "reload · tools/list_changed 뒤" : "reload 뒤 (아직 일어나지 않음)"}
              </p>
              <div className="min-w-0 pr-3">
                <div className="rounded-lg border border-border bg-background px-3 py-2">
                  <p className="text-[11px] text-muted-foreground">registry</p>
                  <p className="font-bold">generation N</p>
                </div>
              </div>
              <div className="min-w-0 border-l border-dashed border-amber-600/70 pl-3">
                <div className={`rounded-lg border px-3 py-2 ${s.next ? "border-border bg-background" : "border-dashed border-border/60 opacity-50"}`}>
                  <p className="text-[11px] text-muted-foreground">registry</p>
                  <p className="font-bold">{s.next ? "generation N+1" : "아직 없음"}</p>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-1 pr-0 pt-4">
                <div className="min-w-0 flex-1 rounded-lg border border-primary bg-background px-3 py-2">
                  <p className="text-[11px] text-muted-foreground">call</p>
                  <p className="break-words font-bold">pin = N</p>
                  <p className="break-words text-muted-foreground">turn 시작 때 schema N을 봄</p>
                </div>
                <Arrow on={s.link} color={tone.stroke} dashed={s.tone === "bad"} />
              </div>
              <div className="min-w-0 border-l border-dashed border-amber-600/70 pl-3 pt-4">
                <div className={`h-full rounded-lg border bg-background px-3 py-2 ${tone.border}`}>
                  <p className="break-words font-bold">{s.outcome}</p>
                  <p className={`break-words ${tone.text}`}>{s.outcomeSub}</p>
                </div>
              </div>
              <div className="pr-3" />
              <div className="min-w-0 border-l border-dashed border-amber-600/70 pl-3 pt-3">
                <div className={`rounded-lg border px-3 py-2 ${s.follow ? `bg-background ${tone.border}` : "invisible border-border"}`}>
                  <p className="break-words font-semibold">{s.follow || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
