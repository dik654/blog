import SceneShell from "./SceneShell";

/**
 * 본문 대응: #precedence — D(c)의 세 행을 위에서부터 차례로 검사하는 판정.
 * 첫 절의 rule 세 개(deny: Bash(rm *), ask: Bash(git push *), allow: Bash(npm test *))에
 * call 하나씩을 넣고, 처음 맞은 칸에서 결과가 정해지면 뒤 칸은 보지 않는다는 점을 보인다.
 * 마지막 장면은 공식 해석 문장의 Bash(*) deny + Bash(npm test *) allow 경우다.
 */
type Gate = "deny" | "ask" | "allow";
type Outcome = Gate | "none";

interface LadderScene {
  label: string;
  summary: string;
  note: string;
  call: string;
  rules: Record<Gate, string>;
  hit: Outcome;
}

const BASE_RULES: Record<Gate, string> = {
  deny: "Bash(rm *)",
  ask: "Bash(git push *)",
  allow: "Bash(npm test *)",
};

const SCENES: readonly LadderScene[] = [
  {
    label: "npm test",
    summary: "deny ✗ → ask ✗ → allow ✓",
    call: "npm test",
    rules: BASE_RULES,
    hit: "allow",
    note: "deny와 ask가 모두 맞지 않을 때만 allow 칸까지 내려옵니다. allow는 rule상 자동 실행된다는 뜻이며 명령이 정확하거나 안전하다는 보증은 아닙니다.",
  },
  {
    label: "git push origin main",
    summary: "deny ✗ → ask ✓",
    call: "git push origin main",
    rules: BASE_RULES,
    hit: "ask",
    note: "git push와 맞는 allow rule이 없어도 바로 deny되지 않습니다. deny가 맞지 않고 ask가 맞으므로 사용자의 새 결정을 기다리고, allow 칸은 보지 않습니다.",
  },
  {
    label: "rm -rf build",
    summary: "deny ✓",
    call: "rm -rf build",
    rules: BASE_RULES,
    hit: "deny",
    note: "첫 칸에서 deny가 맞으면 결과가 정해집니다. 뒤의 ask·allow는 검사하지 않습니다.",
  },
  {
    label: "아무 rule에도 맞지 않는 call",
    summary: "deny ✗ → ask ✗ → allow ✗",
    call: "ls (가정)",
    rules: BASE_RULES,
    hit: "none",
    note: "세 칸 모두 맞지 않으면 rule이 결과를 정하지 못하고 기본 decision으로 넘어갑니다. ls는 경우를 보이려고 고른 예입니다(가정).",
  },
  {
    label: "Bash(*) deny와 npm test allow",
    summary: "deny ✓ · allow는 보지 않음",
    call: "npm test",
    rules: { deny: "Bash(*)", ask: "—", allow: "Bash(npm test *)" },
    hit: "deny",
    note: "rule 집합을 아래 D(c) 식의 해석 문장대로 바꿨습니다. npm test는 allow와도 맞지만 넓은 Bash(*) deny가 첫 칸에서 먼저 맞으므로 test도 deny됩니다.",
  },
];

const GATES: readonly Gate[] = ["deny", "ask", "allow"];
const ORDER: Record<Gate, number> = { deny: 0, ask: 1, allow: 2 };

const RESULT: Record<Outcome, { text: string; tone: string }> = {
  deny: { text: "deny · 차단", tone: "border-red-600 text-red-700 dark:text-red-400" },
  ask: { text: "ask · 사용자에게 묻기", tone: "border-amber-600 text-amber-700 dark:text-amber-400" },
  allow: { text: "allow · 자동 실행", tone: "border-emerald-600 text-emerald-700 dark:text-emerald-400" },
  none: { text: "기본 decision으로", tone: "border-dashed border-border text-muted-foreground" },
};

function gateState(gate: Gate, hit: Outcome) {
  if (hit === gate) return "match";
  if (hit !== "none" && ORDER[gate] > ORDER[hit]) return "skipped";
  return "miss";
}

export default function PrecedenceLadderViz() {
  return (
    <SceneShell
      eyebrow="판정 순서"
      title="처음 맞은 칸에서 결과가 정해집니다"
      description="한 장면이 call 하나입니다. 왼쪽 칸부터 rule과 대조하고, 맞는 칸이 나오면 그 뒤 칸은 보지 않습니다. 앞의 네 장면은 첫 절의 rule 세 개를 씁니다."
      ariaLabel="deny, ask, allow 순서로 call을 대조해 결과가 정해지는 다섯 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const result = RESULT[scene.hit];
        return (
          <div className="min-w-0">
            <div className="rounded-lg border border-border bg-background px-3 py-2 text-center">
              <span className="block text-xs text-muted-foreground">Bash call</span>
              <code className="block break-all font-mono text-sm font-bold">{scene.call}</code>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {GATES.map((gate, index) => {
                const state = gateState(gate, scene.hit);
                const box =
                  state === "match"
                    ? "border-primary bg-primary/10"
                    : state === "skipped"
                      ? "border-dashed border-border/50 opacity-45"
                      : "border-border bg-background";
                const status = state === "match" ? "맞음 → 결정" : state === "skipped" ? "보지 않음" : "안 맞음 → 다음";
                return (
                  <div key={gate} className={`min-w-0 rounded-lg border px-2 py-2 text-center ${box}`}>
                    <span className="block text-[11px] text-muted-foreground">{index + 1}번째</span>
                    <span className="block text-sm font-bold">{gate}</span>
                    <code className="mt-1 block min-h-[2.5rem] break-all font-mono text-[11px] leading-4">{scene.rules[gate]}</code>
                    <span className={`mt-1 block text-[11px] font-semibold ${state === "match" ? "text-primary" : "text-muted-foreground"}`}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className={`mt-3 rounded-lg border px-3 py-2 text-center text-sm font-bold ${result.tone}`}>
              결과: {result.text}
            </div>
          </div>
        );
      }}
    />
  );
}
