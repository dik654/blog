import SceneShell from "./SceneShell";

/**
 * 본문 대응: #error-recovery — `{"a":`까지만 입력한 순간에도 전부 reject하지 않고
 * 그 구간만 ERROR node로 표시한 뒤 다음 매칭 지점부터 parsing을 재개한다.
 * 두 줄 file과 ERROR node가 놓이는 위치는 보이기 위한 가정이다.
 */
type Tok = { text: string; kind: "kw" | "id" | "op" | "num" | "err" };

const LINES: readonly (readonly Tok[])[] = [
  [
    { text: "const", kind: "kw" },
    { text: "x", kind: "id" },
    { text: "=", kind: "op" },
    { text: '{"a":', kind: "err" },
  ],
  [
    { text: "const", kind: "kw" },
    { text: "y", kind: "id" },
    { text: "=", kind: "op" },
    { text: "2", kind: "num" },
  ],
];

const SCENES = [
  {
    label: '편집 중: 첫 줄이 {"a":에서 끊겨 있습니다',
    summary: "완성되지 않은 source",
    stage: 0,
    note: '사용자가 `{"a":`까지만 입력한 순간입니다. 둘째 줄은 이미 문법에 맞지만, file 전체로 보면 source는 완성되지 않았습니다.',
  },
  {
    label: "전부 reject하면 file 전체가 tree를 잃습니다",
    summary: "tree 없음",
    stage: 1,
    note: "깨진 지점 하나 때문에 parser가 중단되면 멀쩡한 둘째 줄까지 highlighting과 navigation이 끊깁니다. Editor parser가 피하려는 상황입니다.",
  },
  {
    label: "깨진 구간만 ERROR node로 표시합니다",
    summary: '{"a": → ERROR',
    stage: 2,
    note: "문법을 어기는 구간을 ERROR node 하나로 감싸고, 그 앞의 const·x·=는 정상 node로 둡니다. 부분 tree가 생겼습니다.",
  },
  {
    label: "다음 매칭 지점부터 parsing을 재개합니다",
    summary: "둘째 줄은 정상 tree",
    stage: 3,
    note: "다음 줄의 const에서 다시 매칭되므로 그 뒤는 평소처럼 tree가 됩니다. 편집기는 ERROR가 낀 tree를 받아 file 나머지의 highlighting과 navigation을 이어 갈 수 있습니다.",
  },
] as const;

const KIND_CLASS: Record<Tok["kind"], string> = {
  kw: "font-bold text-[#2563eb]",
  id: "text-foreground",
  op: "text-foreground",
  num: "font-bold text-[#16a34a]",
  err: "text-[#dc2626] underline decoration-[#dc2626] decoration-wavy underline-offset-4",
};

type TNode = { label: string; x: number; y: number; parent?: number; err?: boolean; line: 0 | 1 | -1 };
const TREE: readonly TNode[] = [
  { label: "program", x: 220, y: 18, line: -1 },
  { label: "declaration", x: 112, y: 64, parent: 0, line: 0 },
  { label: "declaration", x: 328, y: 64, parent: 0, line: 1 },
  { label: "const", x: 36, y: 114, parent: 1, line: 0 },
  { label: "x", x: 84, y: 114, parent: 1, line: 0 },
  { label: "=", x: 120, y: 114, parent: 1, line: 0 },
  { label: "ERROR", x: 174, y: 114, parent: 1, line: 0, err: true },
  { label: "const", x: 262, y: 114, parent: 2, line: 1 },
  { label: "y", x: 310, y: 114, parent: 2, line: 1 },
  { label: "=", x: 346, y: 114, parent: 2, line: 1 },
  { label: "2", x: 392, y: 114, parent: 2, line: 1 },
];

const MUTED = "#94a3b8";

export default function ErrorRecoveryViz() {
  return (
    <SceneShell
      eyebrow="깨진 source"
      title="깨진 한 줄 때문에 file 전체를 버리지 않습니다"
      description='두 줄짜리 file과 ERROR node 위치는 단순화한 가정입니다. 위는 편집기 화면(색은 highlighting), 아래는 parser가 돌려준 tree입니다.'
      ariaLabel="첫 줄이 깨진 file에서 전부 reject하는 경우와 ERROR node로 부분 tree를 만들고 둘째 줄에서 재개하는 경우 비교"
      scenes={SCENES}
      render={(active) => {
        const { stage } = SCENES[active];
        const lineLit = (line: number) => (stage === 2 ? line === 0 : stage === 3);
        const nodeOn = (n: TNode) => stage >= 2 && (n.line !== 1 || stage === 3);
        return (
          <div className="min-w-0">
            <div className="rounded-lg border border-border/70 bg-background px-3 py-2 font-mono text-sm leading-7">
              {LINES.map((toks, li) => (
                <div key={li} className="flex gap-2">
                  <span className="w-4 text-right text-muted-foreground/60">{li + 1}</span>
                  {toks.map((t, ti) => (
                    <span key={ti} className={lineLit(li) ? KIND_CLASS[t.kind] : "text-muted-foreground"}>
                      {t.text}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <svg viewBox="0 0 440 148" role="img" aria-label={SCENES[active].label} className="mt-3 block h-auto w-full sm:mx-auto sm:max-w-[32rem]">
              {stage === 1 && (
                <g>
                  <rect x={110} y={44} width={220} height={44} rx={8} fill="none" stroke="#dc2626" strokeWidth="1.25" strokeDasharray="5 4" />
                  <text x={220} y={71} textAnchor="middle" fontSize="13" fontWeight="700" fill="#dc2626">tree 없음</text>
                </g>
              )}
              {stage === 0 && (
                <text x={220} y={71} textAnchor="middle" fontSize="12" fill="#64748b">parser가 이 source를 받습니다</text>
              )}
              {stage >= 2 &&
                TREE.map((n, i) => {
                  const p = n.parent === undefined ? undefined : TREE[n.parent];
                  const on = nodeOn(n);
                  const w = Math.max(22, n.label.length * 7 + 12);
                  return (
                    <g key={i} opacity={on ? 1 : 0.18}>
                      {p && <line x1={p.x} y1={p.y + 10} x2={n.x} y2={n.y - 10} stroke={MUTED} strokeWidth="1" />}
                      <rect
                        x={n.x - w / 2}
                        y={n.y - 10}
                        width={w}
                        height={20}
                        rx={6}
                        fill={n.err ? "#fee2e2" : "none"}
                        stroke={n.err ? "#dc2626" : MUTED}
                        strokeWidth={n.err ? 1.25 : 1}
                      />
                      <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" className={n.err ? "font-mono font-bold" : "fill-foreground font-mono"} fill={n.err ? "#b91c1c" : undefined}>
                        {n.label}
                      </text>
                      {n.err && (
                        <text x={n.x} y={n.y + 24} textAnchor="middle" fontSize="10" className="font-mono" fill="#b91c1c">
                          {'{"a":'}
                        </text>
                      )}
                    </g>
                  );
                })}
            </svg>
          </div>
        );
      }}
    />
  );
}
