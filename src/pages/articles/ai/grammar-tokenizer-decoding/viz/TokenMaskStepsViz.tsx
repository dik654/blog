import SceneShell from "./SceneShell";

/**
 * 본문 대응: #token-mask
 * - MaskedSoftmaxViz: bitmask [1,0,1,0]에 가정 logit [2,1,0,3]을 넣어 식을 한 단계씩 계산합니다.
 *   e^ℓ = 7.389, 2.718, 1.000, 20.086 · 합 31.193 → p = 0.237, 0.087, 0.032, 0.644
 *   mask 뒤 합 8.389 → p = 0.881, 0, 0.119, 0 · 0번/2번 비율은 두 경우 모두 e² ≈ 7.39
 * - VocabTrieWalkViz: 가정 vocabulary 7개를 trie로 묶고 state `{"age":` (integer 대기)에서 DFS합니다.
 */
const LOGITS = [2, 1, 0, 3] as const;
const MASK = [1, 0, 1, 0] as const;
const EXP = (LOGITS as readonly number[]).map((value) => Math.exp(value));
const MASKED_EXP = EXP.map((value, index) => ((MASK as readonly number[])[index] === 1 ? value : 0));
const SUM = EXP.reduce<number>((total, value) => total + value, 0);
const MASKED_SUM = MASKED_EXP.reduce<number>((total, value) => total + value, 0);
const PROB = EXP.map((value) => value / SUM);
const MASKED_PROB = MASKED_EXP.map((value) => value / MASKED_SUM);

const SOFTMAX_SCENES = [
  {
    label: "mask 전 확률",
    summary: `합 ${SUM.toFixed(3)}`,
    note: "Logit은 mask 전에 model이 각 token에 준 비정규화 점수입니다. 각 점수를 e의 거듭제곱으로 바꾼 뒤 전체 합으로 나누면 확률이 됩니다. 가장 큰 점수 3을 받은 3번 token이 0.644로 가장 유력합니다.",
  },
  {
    label: "금지 logit을 −∞로",
    summary: "e^(−∞) = 0",
    note: "Bitmask [1,0,1,0]에서 1번과 3번은 현재 grammar state에서 금지입니다. 두 logit을 −∞로 바꾸면 e^(−∞)=0이므로 분자가 사라집니다. 점수가 가장 높았던 3번도 예외가 아닙니다.",
  },
  {
    label: "남은 합으로 다시 나누기",
    summary: `합 ${MASKED_SUM.toFixed(3)} → 0.881 · 0.119`,
    note: "분모도 허용 후보의 합 7.389 + 1.000 = 8.389로 줄어듭니다. 그래서 0번은 0.881, 2번은 0.119가 되고 두 확률의 합은 다시 1입니다.",
  },
  {
    label: "상대 선호는 그대로",
    summary: "0.237 : 0.032 = 0.881 : 0.119",
    note: "0번과 2번의 확률 비율은 mask 전에도 뒤에도 e^(2−0) ≈ 7.39배입니다. Mask는 금지 후보를 지울 뿐 허용 후보끼리의 순서와 비율은 바꾸지 않습니다.",
  },
] as const;

function fmt(value: number) {
  return value === 0 ? "0" : value.toFixed(3);
}

export function MaskedSoftmaxViz() {
  return (
    <SceneShell
      eyebrow="Token 네 개로 계산한 masked softmax"
      title="금지 token의 확률은 0이 되고, 남은 확률이 허용 후보로 다시 나뉩니다"
      description="Token 0~3의 logit 2·1·0·3은 설명을 위한 값입니다(가정). Bitmask [1,0,1,0]은 0번과 2번만 허용한다는 뜻입니다."
      ariaLabel="Logit 네 개에 bitmask를 적용해 softmax 확률이 바뀌는 과정"
      scenes={SOFTMAX_SCENES}
      render={(active) => {
        const masked = active >= 1;
        const renormalized = active >= 2;
        const probs = renormalized ? MASKED_PROB : PROB;
        return (
          <div className="min-w-0 space-y-2 text-xs sm:text-sm">
            <div className="grid grid-cols-[3rem_2.25rem_3.25rem_minmax(0,1fr)_3rem] items-center gap-2 font-semibold text-muted-foreground">
              <span>token</span>
              <span className="text-right">ℓ</span>
              <span className="text-right">e^ℓ</span>
              <span>확률 p</span>
              <span className="text-right">p</span>
            </div>
            {LOGITS.map((logit, index) => {
              const allowed = (MASK as readonly number[])[index] === 1;
              const removed = masked && !allowed;
              const p = removed && renormalized ? 0 : probs[index];
              return (
                <div key={index} className="grid grid-cols-[3rem_2.25rem_3.25rem_minmax(0,1fr)_3rem] items-center gap-2">
                  <span className={`font-mono font-semibold ${removed ? "text-[#dc2626] line-through" : ""}`}>
                    {index}번{allowed ? "" : " ✕"}
                  </span>
                  <span className={`text-right font-mono ${removed ? "text-[#dc2626]" : ""}`}>{removed ? "−∞" : logit}</span>
                  <span className={`text-right font-mono ${removed ? "text-[#dc2626]" : ""}`}>{removed ? "0" : EXP[index].toFixed(3)}</span>
                  <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                    <div
                      className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                      style={{ width: `${(removed ? 0 : p) * 100}%`, backgroundColor: allowed ? "#2563eb" : "#94a3b8" }}
                    />
                  </div>
                  <span className="text-right font-mono font-bold">{removed && !renormalized ? "—" : fmt(p)}</span>
                </div>
              );
            })}
            <p className="pt-1 text-right font-mono text-muted-foreground">
              분모 = {renormalized ? `${EXP[0].toFixed(3)} + ${EXP[2].toFixed(3)} = ${MASKED_SUM.toFixed(3)}` : masked ? "다시 계산 전" : `네 값의 합 = ${SUM.toFixed(3)}`}
            </p>
          </div>
        );
      }}
    />
  );
}

type NodeId = "sp" | "4" | "2" | "}" | "q" | "a" | "t" | "r" | "u" | "e";
interface TrieNode {
  id: NodeId;
  char: string;
  x: number;
  y: number;
  parent: NodeId | "root";
  token?: string;
}

const COL = (depth: number) => 30 + depth * 74;
const NODES: readonly TrieNode[] = [
  { id: "sp", char: "␣", x: COL(1), y: 72, parent: "root" },
  { id: "4", char: "4", x: COL(2), y: 40, parent: "sp", token: "␣4" },
  { id: "2", char: "2", x: COL(3), y: 40, parent: "4", token: "␣42" },
  { id: "}", char: "}", x: COL(4), y: 40, parent: "2", token: "␣42}" },
  { id: "q", char: "\"", x: COL(2), y: 108, parent: "sp", token: "␣\"" },
  { id: "a", char: "a", x: COL(3), y: 108, parent: "q", token: "␣\"a" },
  { id: "t", char: "t", x: COL(1), y: 176, parent: "root", token: "t" },
  { id: "r", char: "r", x: COL(2), y: 176, parent: "t" },
  { id: "u", char: "u", x: COL(3), y: 176, parent: "r" },
  { id: "e", char: "e", x: COL(4), y: 176, parent: "u", token: "true" },
];
const ROOT = { x: COL(0), y: 108 };

type NodeState = "idle" | "ok" | "rejected" | "pruned";
/** 이 장면부터 node가 해당 상태로 보입니다. 알고리즘의 pop 순서를 그대로 따릅니다. */
const SEEN_AT: Record<NodeId, number> = { sp: 1, t: 1, r: 1, u: 1, e: 1, "4": 2, q: 2, a: 2, "2": 3, "}": 4 };
const KIND: Record<NodeId, NodeState> = { sp: "ok", "4": "ok", "2": "ok", "}": "ok", q: "rejected", a: "pruned", t: "rejected", r: "pruned", u: "pruned", e: "pruned" };
const CHECKS_BY_SCENE = [0, 2, 4, 5, 6, 6, 6] as const;
const ALLOWED_BY_SCENE = [[], [], [], ["␣4"], ["␣4", "␣42"], ["␣4", "␣42", "␣42}"], ["␣4", "␣42", "␣42}"]] as const;

const TRIE_SCENES = [
  {
    label: "Vocabulary를 trie로",
    summary: "token 7개 · 공유 prefix는 한 가지",
    note: "Trie는 앞부분(prefix)이 같은 token들이 한 가지를 함께 쓰는 tree입니다. ␣는 공백 byte 하나를 뜻합니다. 현재 grammar state는 {\"age\": 뒤에서 integer value를 기다리는 자리입니다.",
  },
  {
    label: "root에서: ␣ 허용, t 거절",
    summary: "byte 검사 2번 · t·true 제외",
    note: "Stack에서 root를 꺼내 자식 byte를 검사합니다. 값 앞의 공백은 허용되므로 ␣ 가지를 stack에 넣습니다. t는 integer를 시작할 수 없으므로 거절하고, 그 아래 r·u·e는 내려가지 않은 채 token t와 true를 한꺼번에 제외합니다.",
  },
  {
    label: "␣에서: 4 허용, 따옴표 거절",
    summary: "byte 검사 4번 · ␣\"·␣\"a 제외",
    note: "␣ node에서 끝나는 token은 없어서 A에 넣을 것이 없습니다. 숫자 4는 integer의 시작이라 허용됩니다. 따옴표는 문자열의 시작이라 integer 자리에서 거절되고, 그 아래 ␣\"a는 검사하지 않고 함께 제외됩니다.",
  },
  {
    label: "␣4를 꺼냄: A에 추가",
    summary: "A = {␣4} · 2 허용",
    note: "이 node에서 token ␣4가 끝나므로 허용 집합 A에 넣습니다. 이어서 2는 integer를 이어 가므로 허용됩니다.",
  },
  {
    label: "␣42를 꺼냄: A에 추가",
    summary: "A에 ␣42 · } 허용",
    note: "␣42도 A에 들어갑니다. 닫는 괄호는 integer 뒤에서 object를 닫으므로 허용됩니다(age 하나뿐인 object로 가정).",
  },
  {
    label: "␣42}를 꺼냄: stack이 빔",
    summary: "A = {␣4, ␣42, ␣42}}",
    note: "␣42}가 A에 들어가고 더 내려갈 자식이 없습니다. Stack이 비었으므로 이번 decode step의 A(s) 계산이 끝납니다.",
  },
  {
    label: "결과",
    summary: "byte 검사 6번 · 따로 하면 15번",
    note: "Trie로 걸으면 byte 검사가 6번입니다. Token 일곱 개를 처음 거절되는 byte까지 따로 시뮬레이션하면 ␣4 2번, ␣42 3번, ␣42} 4번, ␣\" 2번, ␣\"a 2번, t 1번, true 1번으로 15번입니다. 공유 prefix를 한 번만 처리한 차이입니다.",
  },
] as const;

const COLORS: Record<NodeState, { stroke: string; fill: string; text: string }> = {
  idle: { stroke: "#94a3b8", fill: "#ffffff", text: "#334155" },
  ok: { stroke: "#2563eb", fill: "#2563eb", text: "#ffffff" },
  rejected: { stroke: "#dc2626", fill: "#ffffff", text: "#dc2626" },
  pruned: { stroke: "#cbd5e1", fill: "#f1f5f9", text: "#94a3b8" },
};

function stateAt(node: TrieNode, active: number): NodeState {
  return active >= SEEN_AT[node.id] ? KIND[node.id] : "idle";
}

export function VocabTrieWalkViz() {
  return (
    <SceneShell
      eyebrow="Vocabulary trie를 grammar와 함께 걷기"
      title="Grammar가 거절한 byte 하나가 그 아래 token 전부를 지웁니다"
      description="원 하나가 byte 하나이고, 이중 원은 그 자리에서 vocabulary token 하나가 끝난다는 뜻입니다. Token 일곱 개는 설명용입니다(가정)."
      ariaLabel='State {"age": 에서 vocabulary trie를 깊이 우선으로 걸으며 허용 token을 모으는 과정'
      scenes={TRIE_SCENES}
      render={(active) => {
        const allowed = (ALLOWED_BY_SCENE as readonly (readonly string[])[])[active];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 214" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${TRIE_SCENES[active].label}: ${TRIE_SCENES[active].summary}`}>
              {NODES.map((node) => {
                const parent = node.parent === "root" ? ROOT : NODES.find((item) => item.id === node.parent) ?? ROOT;
                const state = stateAt(node, active);
                return (
                  <line
                    key={`edge-${node.id}`}
                    x1={parent.x}
                    y1={parent.y}
                    x2={node.x}
                    y2={node.y}
                    stroke={state === "ok" ? "#2563eb" : state === "rejected" ? "#dc2626" : "#cbd5e1"}
                    strokeWidth={state === "ok" ? 1.25 : 1}
                    strokeDasharray={state === "pruned" || state === "rejected" ? "3 3" : undefined}
                  />
                );
              })}
              <circle cx={ROOT.x} cy={ROOT.y} r={13} fill="#ffffff" stroke="#334155" strokeWidth={1} />
              <text x={ROOT.x} y={ROOT.y + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">root</text>
              {NODES.map((node) => {
                const state = stateAt(node, active);
                const color = COLORS[state];
                const inA = node.token !== undefined && allowed.includes(node.token);
                return (
                  <g key={node.id}>
                    {node.token && <circle cx={node.x} cy={node.y} r={16} fill="none" stroke={color.stroke} strokeWidth={1} />}
                    <circle cx={node.x} cy={node.y} r={12} fill={color.fill} stroke={color.stroke} strokeWidth={1} />
                    <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={color.text} fontFamily="monospace">
                      {node.char}
                    </text>
                    {node.token && (
                      <text x={node.x} y={node.y + 30} textAnchor="middle" fontSize={11} fill={inA ? "#2563eb" : state === "rejected" || state === "pruned" ? "#dc2626" : "#64748b"} fontWeight={inA ? 700 : 400} fontFamily="monospace">
                        {inA ? `✓ ${node.token}` : state === "rejected" || state === "pruned" ? `✕ ${node.token}` : node.token}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-xs sm:text-sm">
              <span className="font-semibold text-muted-foreground">byte 검사</span>
              <span className="font-mono font-bold">{(CHECKS_BY_SCENE as readonly number[])[active]}번</span>
              <span className="font-semibold text-muted-foreground">허용 집합 A</span>
              <span className="font-mono font-bold break-all">{allowed.length ? `{ ${allowed.join(", ")} }` : "{ }"}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
