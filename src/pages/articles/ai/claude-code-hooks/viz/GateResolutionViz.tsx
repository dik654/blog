import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview 예시와 #resolution 식 F(x)=I_E∧I_M∧I_Q.
 * Hook: PreToolUse · matcher Bash · if Bash(rm *) · handler block-rm.sh.
 * npm test → 1·1·0 → F=0. rm -rf /tmp/build → 1·1·1 → F=1. Edit tool call → 1·0 → F=0.
 */
type Gate = 1 | 0 | null;

const OK = "#16a34a";
const NO = "#dc2626";
const IDLE = "#94a3b8";
const ACCENT = "#2563eb";

const CASES = [
  { input: "Bash · npm test", gates: [1, 1, 0] as readonly Gate[] },
  { input: "Bash · rm -rf /tmp/build", gates: [1, 1, 1] as readonly Gate[] },
  { input: "Edit tool call", gates: [1, 0, null] as readonly Gate[] },
] as const;

const GATES = [
  { key: "I_E", name: "event", rule: "PreToolUse" },
  { key: "I_M", name: "matcher", rule: "Bash" },
  { key: "I_Q", name: "if", rule: "Bash(rm *)" },
] as const;

const SCENES = [
  {
    label: "Hook 설정",
    summary: "F = I_E ∧ I_M ∧ I_Q",
    note: "세 gate는 서로 독립입니다. 언제(event), 어떤 대상(matcher), 어떤 argument(if)를 각각 따로 판정하고, 셋이 모두 1일 때만 block-rm.sh가 실행됩니다. 아래 세 입력은 모두 PreToolUse 시점에 들어온 tool call입니다.",
  },
  {
    label: "npm test",
    summary: "1 ∧ 1 ∧ 0 = 0",
    note: "시점도 맞고 tool도 Bash지만 argument가 rm으로 시작하지 않아 if gate가 0입니다. F=0이므로 handler를 만들지 않습니다.",
  },
  {
    label: "rm -rf /tmp/build",
    summary: "1 ∧ 1 ∧ 1 = 1",
    note: "세 gate가 모두 1입니다. 이 입력만 JSON input과 함께 block-rm.sh로 전달됩니다. 무엇을 결정할지는 이제 handler의 output에 달려 있습니다.",
  },
  {
    label: "Edit tool call",
    summary: "1 ∧ 0 ∧ … = 0",
    note: "Event는 PreToolUse로 맞지만 tool이 Bash가 아니라 matcher gate가 0입니다. 하나가 0이면 AND 결과는 if 값과 상관없이 0이라, Bash handler process는 만들어지지 않습니다.",
  },
] as const;

function GateChip({ name, rule, value, shown }: { name: string; rule: string; value: Gate; shown: boolean }) {
  const color = !shown ? IDLE : value === 1 ? OK : value === 0 ? NO : IDLE;
  const mark = !shown ? "·" : value === 1 ? "1 ✓" : value === 0 ? "0 ✗" : "—";
  return (
    <div className="min-w-0 rounded-md border px-1.5 py-1 text-center sm:py-1.5" style={{ borderColor: color, borderStyle: shown && value === null ? "dashed" : "solid" }}>
      <p className="hidden truncate text-[11px] text-muted-foreground sm:block" title={rule}>
        {name}
      </p>
      <p className="font-mono text-xs font-bold" style={{ color }}>
        {mark}
      </p>
    </div>
  );
}

export default function GateResolutionViz() {
  return (
    <SceneShell
      eyebrow="Gate 세 개의 AND"
      title="같은 PreToolUse hook에 들어온 세 입력의 판정"
      description="본문 예시 hook(PreToolUse · Bash · Bash(rm *) · block-rm.sh)에 세 tool call을 차례로 넣습니다. 1은 gate 통과, 0은 불일치입니다."
      ariaLabel="Event, matcher, if gate를 AND로 묶어 handler 실행 여부를 정하는 세 가지 입력"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {GATES.map((gate) => (
              <div key={gate.key} className="min-w-0 rounded-md border px-2 py-1.5 text-center" style={{ borderColor: active === 0 ? ACCENT : "#cbd5e1" }}>
                <p className="font-mono text-[11px] font-bold" style={{ color: ACCENT }}>
                  {gate.key}
                </p>
                <p className="text-[11px] leading-4 text-muted-foreground">{gate.name}</p>
                <p className="whitespace-nowrap font-mono text-[11px] leading-4 text-foreground">{gate.rule}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {CASES.map((item, index) => {
              const shown = active === index + 1;
              const done = active > index;
              const fires = item.gates.every((g) => g === 1);
              const resultColor = !done ? IDLE : fires ? OK : NO;
              return (
                <div
                  key={item.input}
                  className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1.5 rounded-lg border px-2 py-2 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_minmax(0,8rem)] sm:items-center sm:gap-2"
                  style={{ borderColor: shown ? ACCENT : "#e2e8f0", opacity: done ? 1 : 0.55 }}
                >
                  <p className="truncate font-mono text-xs font-semibold">{item.input}</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {GATES.map((gate, g) => (
                      <GateChip key={gate.key} name={gate.key} rule={gate.rule} value={item.gates[g]} shown={done} />
                    ))}
                  </div>
                  <p className="text-xs font-bold sm:text-right" style={{ color: resultColor }}>
                    {!done ? "판정 전" : fires ? "F=1 → block-rm.sh 실행" : "F=0 → handler 없음"}
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
