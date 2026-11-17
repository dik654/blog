import SceneShell from "./SceneShell";

/**
 * 본문 대응: #lexer-fsm-foundation — FSM·DFA·NFA 정의와 lexer가 문자를 token으로 묶는 과정.
 * 입력은 개요 카드의 `const x = {a: 1}`(16자). 그림의 두 패턴(keyword `const` 사슬, identifier 고리)은
 * 정의를 보이려고 고른 가정이며, 숫자·기호 패턴은 그림에서 생략했다.
 */
const SOURCE = "const x = {a: 1}";
const TOKENS = [
  { text: "const", kind: "keyword" },
  { text: "x", kind: "identifier" },
  { text: "=", kind: "기호" },
  { text: "{", kind: "기호" },
  { text: "a", kind: "identifier" },
  { text: ":", kind: "기호" },
  { text: "1", kind: "숫자" },
  { text: "}", kind: "기호" },
] as const;

const SCENES = [
  {
    label: "NFA로 읽으면 두 state에 동시에 있습니다",
    summary: "c·o·n → state 2개",
    read: 3,
    active: ["k3", "id"],
    merged: false,
    tokens: 0,
    note: "`con`까지 읽으면 keyword `const`의 사슬로도, 글자가 이어지는 identifier 고리로도 갈 수 있습니다. 한 symbol에서 여러 state로 동시에 갈 수 있으니 NFA입니다.",
  },
  {
    label: "DFA는 그 묶음을 state 하나로 미리 합칩니다",
    summary: "{k3, identifier} = state 1개",
    read: 3,
    active: ["k3", "id"],
    merged: true,
    tokens: 0,
    note: "패턴을 DFA로 미리 컴파일하면 '동시에 있는 state들의 묶음'이 새 state 하나가 됩니다. 그래서 다음 글자마다 갈 곳이 정확히 하나로 정해지고, 판정은 state 전이 한 번씩으로 끝납니다.",
  },
  {
    label: "공백에서 전이가 끊기면 token 하나를 내보냅니다",
    summary: "const → keyword",
    read: 5,
    active: ["k5", "id"],
    merged: true,
    tokens: 1,
    note: "`t`까지 읽은 뒤 공백에는 갈 전이가 없어 `const`를 token으로 끊습니다. 두 패턴이 모두 받아들이는 단어여서, 이 그림은 keyword를 identifier보다 우선한다고 가정했습니다.",
  },
  {
    label: "Parser가 받는 것은 문자 16개가 아니라 token 8개입니다",
    summary: "16자 → token 8개",
    read: 16,
    active: [],
    merged: false,
    tokens: TOKENS.length,
    note: "같은 방식으로 끝까지 훑으면 공백은 버려지고 token 8개가 남습니다. `x`와 `a`는 `c`로 시작하지 않아 identifier 고리만 받아들입니다. 숫자·기호 패턴도 같은 원리로 각자의 state를 가집니다(그림에서는 생략).",
  },
] as const;

const NODES = [
  { id: "s", x: 34, y: 64, label: "시작" },
  { id: "k1", x: 104, y: 40, label: "k1" },
  { id: "k2", x: 164, y: 40, label: "k2" },
  { id: "k3", x: 224, y: 40, label: "k3" },
  { id: "k4", x: 284, y: 40, label: "k4" },
  { id: "k5", x: 344, y: 40, label: "k5", accept: true },
  { id: "id", x: 164, y: 132, label: "ident", accept: true },
] as const;

const CHAIN = ["c", "o", "n", "s", "t"] as const;
const ACCENT = "#2563eb";
const MUTED = "#94a3b8";

export default function LexerAutomatonViz() {
  return (
    <SceneShell
      eyebrow="문자에서 token으로"
      title="Lexer는 state 전이로 문자를 token으로 묶습니다"
      description="입력은 개요의 `const x = {a: 1}`입니다. 위쪽 사슬 k1~k5는 keyword `const` 패턴, 아래 ident는 '글자가 이어지는 동안' 머무는 identifier 패턴입니다(두 패턴만 그린 가정). 이중 원은 token을 끝낼 수 있는 state입니다."
      ariaLabel="const x = {a: 1}을 NFA와 DFA state 전이로 읽어 token 8개로 묶는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const on = new Set<string>(scene.active as readonly string[]);
        return (
          <div className="min-w-0">
            <div className="flex flex-wrap gap-0.5 font-mono text-sm">
              {SOURCE.split("").map((ch, i) => (
                <span
                  key={i}
                  className={`flex h-7 w-5 items-center justify-center rounded-sm border ${
                    i < scene.read ? "border-primary bg-primary/10 font-bold text-foreground" : "border-border/60 text-muted-foreground"
                  }`}
                >
                  {ch === " " ? "␣" : ch}
                </span>
              ))}
            </div>
            <svg viewBox="14 14 400 160" role="img" aria-label={scene.label} className="mt-3 block h-auto w-full sm:mx-auto sm:max-w-[30rem]">
              {/* 시작 → k1 → … → k5 사슬 */}
              {CHAIN.map((ch, i) => {
                const from = i === 0 ? NODES[0] : NODES[i];
                const to = NODES[i + 1];
                return (
                  <g key={ch}>
                    <line x1={from.x + 16} y1={from.y + (i === 0 ? -8 : 0)} x2={to.x - 16} y2={to.y} stroke={MUTED} strokeWidth="1" />
                    <text x={(from.x + to.x) / 2 + 2} y={(from.y + to.y) / 2 - (i === 0 ? 10 : 6)} textAnchor="middle" fontSize="12" className="fill-foreground font-mono">
                      {ch}
                    </text>
                  </g>
                );
              })}
              {/* 시작 → ident, ident 자기 고리 */}
              <line x1={48} y1={76} x2={148} y2={124} stroke={MUTED} strokeWidth="1" />
              <text x={88} y={112} textAnchor="middle" fontSize="11" className="fill-foreground">글자</text>
              <path d="M 180 124 C 214 104, 214 160, 180 140" fill="none" stroke={MUTED} strokeWidth="1" />
              <text x={222} y={136} fontSize="11" className="fill-foreground">글자</text>
              {scene.merged && (() => {
                // 묶음에 든 state만 점선 고리로 두르고 서로 잇는다. 사각형으로 감싸면 k2처럼 묶음 밖 state까지 들어가 보인다.
                const members = NODES.filter((n) => on.has(n.id));
                const [a, b] = members;
                return (
                  <g>
                    {a && b && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ACCENT} strokeWidth="1.25" strokeDasharray="5 4" />}
                    {members.map((n) => (
                      <circle key={`m-${n.id}`} cx={n.x} cy={n.y} r={21} fill="none" stroke={ACCENT} strokeWidth="1.25" strokeDasharray="5 4" />
                    ))}
                    <text x={262} y={150} fontSize="11" fontWeight="700" fill={ACCENT}>DFA state 하나</text>
                  </g>
                );
              })()}
              {NODES.map((n) => {
                const lit = on.has(n.id);
                return (
                  <g key={n.id}>
                    <circle cx={n.x} cy={n.y} r={16} fill={lit ? "#dbeafe" : "none"} stroke={lit ? ACCENT : MUTED} strokeWidth={lit ? 1.25 : 1} />
                    {"accept" in n && n.accept && <circle cx={n.x} cy={n.y} r={12} fill="none" stroke={lit ? ACCENT : MUTED} strokeWidth="1" />}
                    <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" className={lit ? "fill-slate-900 font-bold" : "fill-foreground"}>
                      {n.label}
                    </text>
                  </g>
                );
              })}
              <text x={364} y={76} fontSize="10" className="fill-muted-foreground">keyword</text>
              <text x={130} y={164} fontSize="10" className="fill-muted-foreground">identifier</text>
            </svg>
            <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-8">
              {TOKENS.map((t, i) => (
                <div
                  key={i}
                  className={`rounded-md border px-1 py-1 text-center text-xs leading-4 ${
                    i < scene.tokens ? "border-primary/60 bg-background" : "border-dashed border-border/50 text-muted-foreground/40"
                  }`}
                >
                  <span className="block font-mono font-bold">{i < scene.tokens ? t.text : "·"}</span>
                  <span className="block text-[11px]">{i < scene.tokens ? t.kind : " "}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
