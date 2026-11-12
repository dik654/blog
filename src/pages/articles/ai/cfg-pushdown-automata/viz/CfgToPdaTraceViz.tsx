import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pda-stack — CFG → PDA construction(표준 절차)을 한 번 끝까지 돌려 본다.
 * 문법은 본문 2절의 S → ( S ) | ε, 입력은 (()) (가정).
 * nonterminal이 top이면 production 하나를 골라 오른쪽을 뒤집어 push,
 * terminal이 top이면 입력 다음 글자와 같을 때만 pop + 소비.
 * 마지막 장면은 첫 선택을 S → ε로 잘못 고른 갈래(입력이 남아 reject).
 */
const INPUT = ["(", "(", ")", ")"] as const;

const SCENES = [
  { label: "시작", summary: "stack = [S]", stack: ["S"], consumed: 0, rule: "start symbol S 하나만 올립니다.", status: "run", note: "입력은 (())이고 stack에는 start symbol S 하나만 있습니다. S는 더 펼쳐야 하는 nonterminal이고, 괄호는 입력에 그대로 나오는 terminal입니다." },
  { label: "S를 펼침", summary: "S → ( S )", stack: ["(", "S", ")"], consumed: 0, rule: "top이 nonterminal S → pop S, push ) S ( (뒤집어서)", status: "run", note: "Top이 nonterminal이라 production S → ( S )를 고릅니다. S를 지우고 오른쪽 ( S )를 뒤집어 ), S, ( 순서로 push하므로 왼쪽 글자 (가 맨 위에 옵니다." },
  { label: "첫 ( 맞춤", summary: "top ( = 입력 (", stack: ["S", ")"], consumed: 1, rule: "top이 terminal ( 이고 다음 입력도 ( → pop, 소비", status: "run", note: "Top의 terminal (가 입력의 다음 글자와 같으므로 둘 다 지웁니다. 남은 입력은 ())입니다." },
  { label: "S를 다시 펼침", summary: "S → ( S )", stack: ["(", "S", ")", ")"], consumed: 1, rule: "top이 nonterminal S → pop S, push ) S (", status: "run", note: "다시 S가 top입니다. 같은 production을 한 번 더 고르면 아직 닫아야 할 )가 stack에 두 개 쌓입니다. 재귀 한 번이 stack 한 칸 깊이로 바뀌는 자리입니다." },
  { label: "둘째 ( 맞춤", summary: "top ( = 입력 (", stack: ["S", ")", ")"], consumed: 2, rule: "top이 terminal ( 이고 다음 입력도 ( → pop, 소비", status: "run", note: "두 번째 (도 소비했습니다. 남은 입력은 ))이고 stack 아래에는 대응하는 )가 두 개 기다립니다." },
  { label: "S를 ε로 지움", summary: "S → ε", stack: [")", ")"], consumed: 2, rule: "top이 nonterminal S → pop S, push 없음 (ε = 빈 문자열)", status: "run", note: "이번에는 S → ε를 고릅니다. ε는 빈 문자열이라 S를 지우기만 하고 아무것도 올리지 않습니다." },
  { label: ") 두 개 맞춤", summary: "stack과 입력이 함께 빔", stack: [], consumed: 4, rule: "top ) = 입력 ) 를 두 번 → pop, 소비", status: "accept", note: "남은 ) 두 개가 입력의 ) 두 개와 차례로 맞습니다. Stack과 입력이 동시에 비었으므로 accept입니다." },
  { label: "첫 선택을 S → ε로 했다면", summary: "stack은 비었는데 입력이 남음", stack: [], consumed: 0, rule: "시작에서 S → ε 선택 → stack이 바로 빔", status: "reject", note: "같은 시작에서 S → ε를 골랐다면 stack은 즉시 비지만 입력 (())은 그대로 남습니다. 둘이 동시에 비지 않으므로 이 갈래는 reject입니다. 어느 production을 고를지가 정해져 있지 않다는 점이 다음 문단의 비결정성입니다." },
] as const;

const SLOTS = 4;

export default function CfgToPdaTraceViz() {
  return (
    <SceneShell
      eyebrow="CFG → PDA 한 번 돌려 보기"
      title="Stack에 grammar symbol을 쌓아 (())을 판정합니다"
      description="문법은 2절의 S → ( S ) | ε이고 입력 (())은 예시로 고른 값입니다(가정). 왼쪽은 입력 띠, 오른쪽은 stack이며 맨 위 칸이 top입니다."
      ariaLabel="CFG를 PDA로 옮긴 절차로 입력 (())을 한 단계씩 판정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const stack: readonly string[] = scene.stack;
        const empties = SLOTS - stack.length;
        return (
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_4.5rem] items-start gap-4 sm:grid-cols-[minmax(0,1fr)_7.5rem] sm:gap-5">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted-foreground">입력 w (흐린 칸은 이미 소비)</p>
              <div className="mt-2 flex gap-1.5 sm:gap-2">
                {INPUT.map((ch, i) => {
                  const used = i < scene.consumed;
                  const next = i === scene.consumed && scene.status === "run";
                  return (
                    <span
                      key={i}
                      className={`flex h-9 w-9 items-center sm:h-10 sm:w-10 justify-center rounded-md border font-mono text-base font-bold ${
                        used ? "border-border/50 text-muted-foreground/40" : next ? "border-primary text-primary" : "border-border text-foreground"
                      }`}
                    >
                      {ch}
                    </span>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">테두리가 진한 칸이 다음에 비교할 글자입니다.</p>
              <div className="mt-4 rounded-lg border border-border/70 bg-background px-3 py-2">
                <p className="text-xs font-semibold text-muted-foreground">이번 step</p>
                <p className="mt-1 min-h-[3.75rem] font-mono text-xs leading-5 text-foreground">{scene.rule}</p>
              </div>
              <p
                className={`mt-3 text-sm font-bold ${
                  scene.status === "accept" ? "text-emerald-700 dark:text-emerald-400" : scene.status === "reject" ? "text-red-700 dark:text-red-400" : "text-muted-foreground"
                }`}
              >
                {scene.status === "accept" ? "accept · stack과 입력이 동시에 빔" : scene.status === "reject" ? "reject · 입력 4글자가 남음" : "진행 중"}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted-foreground">stack<br className="sm:hidden" /> (위가 top)</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {Array.from({ length: empties }, (_, i) => (
                  <span key={`e${i}`} className="h-9 rounded-md border border-dashed border-border/40" />
                ))}
                {stack.map((sym, i) => (
                  <span
                    key={`s${i}`}
                    className={`flex h-9 items-center justify-center rounded-md border font-mono text-sm font-bold ${
                      sym === "S" ? "border-amber-600 text-amber-700 dark:text-amber-400" : "border-border bg-background text-foreground"
                    } ${i === 0 ? "outline outline-1 outline-offset-1 outline-primary/60" : ""}`}
                  >
                    {sym}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">주황 = nonterminal, 흰 칸 = terminal</p>
            </div>
          </div>
        );
      }}
    />
  );
}
