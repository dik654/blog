import SimplexSceneShell from "./SimplexSceneShell";

/**
 * 본문 대응: #journal·#failure — voter loop는 certification result와 vote를 sync_journal()로 기록한 뒤 notify()한다.
 * RecvError는 false로 바꾸지 않는다. Sync된 결과는 journal에서 replay하고, 기록되지 않은 결과는 restart 뒤 다시 요청한다.
 * 어느 지점에서 멈추는지는 설명용 가정이다.
 */
const STEPS = ["certify 요청", "결과 수신", "journal sync", "notify · 전파"] as const;

type StepState = "done" | "error" | "stopped" | "todo";

const SCENES = [
  {
    label: "정상 순서",
    summary: "결과 → sync → 전파",
    states: ["done", "done", "done", "done"],
    stopAfter: -1,
    journal: "결과 기록됨",
    outcome: "vote·report 전파",
    note: "Successful certification은 곧바로 broadcast되지 않습니다. 결과와 vote를 journal에 먼저 sync한 뒤 notify()를 호출합니다. Journal은 이 validator 한 대의 local 기록이며 committee 전체의 finalization certificate가 아닙니다.",
  },
  {
    label: "결과 channel 오류",
    summary: "RecvError ≠ false",
    states: ["done", "error", "todo", "todo"],
    stopAfter: -1,
    journal: "기록 없음",
    outcome: "certify 다시 요청",
    note: "결과를 받는 channel이 끊겨 RecvError가 나면 코드는 이를 false로 바꾸지 않습니다. 실제 거절이 아닌 통신 오류가 certification 실패로 굳으면 view를 빠져나가지 못해 liveness가 멈출 수 있기 때문입니다. 여기서는 멈춘 지점이 아니라 결과가 오지 않은 경우이며, journal에 결과가 없으므로 restart 뒤에는 다시 요청합니다.",
  },
  {
    label: "sync 전에 멈춤 (가정)",
    summary: "기록 없음 → 다시 요청",
    states: ["done", "done", "stopped", "todo"],
    stopAfter: 1,
    journal: "기록 없음",
    outcome: "certify 다시 요청",
    note: "결과를 받았더라도 journal에 쓰기 전에 멈췄다면 남은 기록이 없습니다. 기록되지 않은 결과는 restart 뒤 다시 요청합니다.",
  },
  {
    label: "sync 뒤에 멈춤 (가정)",
    summary: "기록 있음 → replay",
    states: ["done", "done", "done", "stopped"],
    stopAfter: 2,
    journal: "결과 기록됨",
    outcome: "journal에서 replay",
    note: "Sync를 마친 뒤 전파 전에 멈췄다면 결과가 journal에 남아 있습니다. Sync된 결과는 journal에서 replay합니다. Replay는 journal에 적힌 결과를 다시 읽어 상태를 되살리는 일입니다.",
  },
] as const;

const STATE_STYLE: Record<StepState, { border: string; color: string; dashed: boolean; text: string }> = {
  done: { border: "#2563eb", color: "#2563eb", dashed: false, text: "완료" },
  error: { border: "#dc2626", color: "#dc2626", dashed: false, text: "RecvError" },
  stopped: { border: "#d97706", color: "#d97706", dashed: true, text: "도달 못 함" },
  todo: { border: "#94a3b8", color: "#64748b", dashed: true, text: "—" },
};

export default function CrashRecoveryViz() {
  return (
    <SimplexSceneShell
      eyebrow="멈춘 지점과 복구"
      title="Restart 뒤의 행동은 결과가 journal에 있었는지로 갈립니다"
      description="한 validator의 voter loop가 네 단계 중 어디에서 멈췄는지에 따라 journal 기록을 다시 읽어 복원(replay)할지, certify를 다시 요청할지가 정해집니다. 멈춘 지점은 설명용 가정입니다."
      ariaLabel="certification 결과가 journal에 기록되기 전과 후에 멈췄을 때 restart 뒤 복구 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STEPS.map((step, index) => {
                const style = STATE_STYLE[scene.states[index] as StepState];
                const stopHere = index === scene.stopAfter;
                return (
                  <li
                    key={step}
                    className={`relative min-w-0 rounded-lg border px-2 py-2 text-center ${style.dashed ? "border-dashed" : ""}`}
                    style={{ borderColor: style.border }}
                  >
                    <span className="block font-mono text-[10px] text-muted-foreground">{index + 1}</span>
                    <strong className="block break-keep text-xs">{step}</strong>
                    <span className="mt-1 block text-[11px] font-bold" style={{ color: style.color }}>{style.text}</span>
                    <span className={`mt-1 block text-[10px] font-bold ${stopHere ? "" : "invisible"}`} style={{ color: "#dc2626" }}>여기서 멈춤</span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center text-xs">
              <div className="rounded-lg border px-2 py-2" style={{ borderColor: scene.journal === "결과 기록됨" ? "#2563eb" : "#94a3b8" }}>
                <span className="block text-[10px] font-bold text-muted-foreground">JOURNAL</span>
                <strong className="break-keep">{scene.journal}</strong>
              </div>
              <span aria-hidden className="text-primary">→</span>
              <div className="rounded-lg border px-2 py-2" style={{ borderColor: "#2563eb" }}>
                <span className="block text-[10px] font-bold text-muted-foreground">{active === 0 ? "다음" : "RESTART 뒤"}</span>
                <strong className="break-keep">{scene.outcome}</strong>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
