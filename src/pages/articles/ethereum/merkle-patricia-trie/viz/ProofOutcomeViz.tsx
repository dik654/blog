import MptSceneShell from "./MptSceneShell";

/**
 * 본문 대응: #proof-failures — 같은 작은 trie에서 key와 보낸 node만 바꿔 세 결론(포함·부재·잘못된 증명)을 가른다.
 * trie 모양은 앞 증명 그림과 같은 가정: root node = extension a7 → branch(slot 1·6·c를 채움, 가정) → leaf 355….
 */
type Mark = "ok" | "stop" | "missing" | "bad" | "idle";
type Verdict = "포함" | "부재" | "잘못된 증명";

interface OutcomeScene {
  label: string;
  summary: string;
  key: string;
  marks: readonly Mark[];
  slot: number | null;
  slotEmpty: boolean;
  verdict: Verdict;
  reason: string;
  note: string;
}

const SCENES: readonly OutcomeScene[] = [
  {
    label: "끝까지 이어짐",
    summary: "포함",
    key: "a7 · 1 · 355…",
    marks: ["ok", "ok", "ok", "ok"],
    slot: 1,
    slotEmpty: false,
    verdict: "포함",
    reason: "경로를 전부 소비했고 leaf value가 참조 사슬과 맞습니다.",
    note: "root에서 시작해 a7 → slot 1 → 355…로 key 경로를 모두 소비하고 마지막 leaf value까지 닿았습니다. 각 단계의 bytes가 위쪽 참조와 맞으므로 포함 증명입니다.",
  },
  {
    label: "빈 slot에서 막힘",
    summary: "부재",
    key: "a7 · 2 · …",
    marks: ["ok", "ok", "stop", "idle"],
    slot: 2,
    slotEmpty: true,
    verdict: "부재",
    reason: "root에 결속된 branch의 slot 2가 비어 있습니다.",
    note: "다른 key가 a7까지는 같고 다음 nibble이 2라고 하겠습니다(가정). 이 branch는 root에 결속된 node이고 slot 2가 비어 있으므로, 이 key는 이 root 아래에 없다고 판단할 수 있습니다.",
  },
  {
    label: "경로 조각이 다름",
    summary: "부재",
    key: "a8 · …",
    marks: ["ok", "stop", "idle", "idle"],
    slot: null,
    slotEmpty: false,
    verdict: "부재",
    reason: "root에 결속된 extension의 조각 a7과 남은 key a8…이 다릅니다.",
    note: "key가 a8로 시작한다고 하겠습니다(가정). 인증된 extension은 이 아래의 모든 key가 a7을 지난다고 말하므로, a8… key는 이 root 아래에 없습니다. 이 판단도 extension node가 root hash와 맞을 때만 성립합니다.",
  },
  {
    label: "중간 node 누락",
    summary: "잘못된 증명",
    key: "a7 · 1 · 355…",
    marks: ["ok", "ok", "missing", "idle"],
    slot: null,
    slotEmpty: false,
    verdict: "잘못된 증명",
    reason: "extension이 가리키는 branch bytes가 증명에 없습니다.",
    note: "증명 제공자가 branch node를 빼고 보냈습니다. extension이 가리키는 다음 node를 확인할 수 없으니 여기서 멈춘 것은 '계정 없음'이 아니라 '증명이 불완전함'입니다.",
  },
  {
    label: "참조 불일치",
    summary: "잘못된 증명",
    key: "a7 · 1 · 355…",
    marks: ["ok", "ok", "ok", "bad"],
    slot: 1,
    slotEmpty: false,
    verdict: "잘못된 증명",
    reason: "slot 1의 참조와 보낸 leaf bytes가 맞지 않습니다.",
    note: "branch slot 1까지는 맞지만, 함께 보낸 leaf가 그 참조와 맞지 않는 무관한 leaf입니다. 참조 사슬이 끊겼으므로 이 leaf의 내용은 판단 근거가 되지 못하고 결과는 잘못된 증명입니다.",
  },
];

const NODES = [
  ["블록 헤더", "stateRoot R"],
  ["Extension", "조각 a7"],
  ["Branch", "16 slots"],
  ["Leaf", "suffix 355…"],
] as const;

const MARK_STYLE: Record<Mark, string> = {
  ok: "border-primary/70 bg-primary/[0.05]",
  stop: "border-amber-600 bg-amber-500/10",
  missing: "border-dashed border-red-600 bg-background",
  bad: "border-red-600 bg-red-500/10",
  idle: "border-border/50 bg-background opacity-50",
};

const MARK_TEXT: Record<Mark, string> = {
  ok: "✓ 확인",
  stop: "■ 여기서 막힘",
  missing: "✕ 증명에 없음",
  bad: "✕ 참조와 다름",
  idle: "도달 안 함",
};

const VERDICT_STYLE: Record<Verdict, string> = {
  포함: "border-primary text-primary",
  부재: "border-amber-600 text-amber-700 dark:text-amber-400",
  "잘못된 증명": "border-red-600 text-red-700 dark:text-red-400",
};

const HEX = "0123456789abcdef".split("");
/** 가정한 branch에서 child가 있는 slot. 찾는 key는 slot 1로, 부재 예는 빈 slot 2로 갑니다. */
const FILLED_SLOTS: readonly number[] = [1, 6, 12];

function BranchSlots({ slot, slotEmpty, dim }: { slot: number | null; slotEmpty: boolean; dim: boolean }) {
  return (
    <div className={`mt-2 grid grid-cols-8 gap-0.5 ${dim ? "opacity-50" : ""}`} aria-label="branch의 16개 slot">
      {HEX.map((digit, index) => {
        const filled = FILLED_SLOTS.includes(index);
        const chosen = slot === index;
        const tone = chosen
          ? slotEmpty
            ? "border-amber-600 bg-background text-amber-700 dark:text-amber-400"
            : "border-primary bg-primary text-primary-foreground"
          : filled
            ? "border-primary/60 bg-primary/15 text-foreground"
            : "border-border/60 bg-background text-muted-foreground/60";
        return (
          <span key={digit} className={`flex h-5 items-center justify-center rounded-sm border font-mono text-[10px] ${tone}`}>
            {digit}
          </span>
        );
      })}
    </div>
  );
}

export default function ProofOutcomeViz() {
  return (
    <MptSceneShell
      eyebrow="같은 trie · 다섯 경우"
      title="어디서 멈췄는지가 부재와 잘못된 증명을 가릅니다"
      description="앞 그림의 작은 trie에서 찾는 key와 증명이 보낸 node만 바꿉니다. Branch 칸은 nibble 0부터 f까지의 child 자리이며, 채운 칸은 slot 1·6·c라고 둡니다(가정)."
      note="trie 모양·key·slot 상태는 세 결론을 구분하기 위한 가정입니다. 부재 판정은 막힌 지점의 node가 root에 결속되어 있을 때만 성립합니다."
      ariaLabel="같은 trie에서 포함, 두 가지 부재, 두 가지 잘못된 증명이 갈리는 지점"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-3">
            <p className="text-xs text-muted-foreground">
              찾는 key <span className="ml-1 font-mono text-sm font-bold text-foreground">{scene.key}</span>
            </p>
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="root부터 leaf까지 확인한 node">
              {NODES.map(([kind, detail], nodeIndex) => {
                const mark = scene.marks[nodeIndex];
                return (
                  <li key={kind} className={`min-w-0 rounded-md border px-2 py-2 sm:px-3 ${MARK_STYLE[mark]}`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <strong className="text-sm">{kind}</strong>
                      <span className="font-mono text-[10px] text-muted-foreground">{nodeIndex === 0 ? "기준" : `node ${nodeIndex}`}</span>
                    </div>
                    <p className="font-mono text-[11px] text-muted-foreground">{detail}</p>
                    {nodeIndex === 2 ? <BranchSlots slot={scene.slot} slotEmpty={scene.slotEmpty} dim={mark === "missing" || mark === "idle"} /> : null}
                    <p className="mt-1.5 text-[11px] font-semibold">{MARK_TEXT[mark]}</p>
                  </li>
                );
              })}
            </ol>
            <div className={`rounded-md border-l-4 bg-background px-3 py-2 ${VERDICT_STYLE[scene.verdict]}`}>
              <p className="text-sm font-bold">결론 · {scene.verdict}</p>
              <p className="mt-0.5 break-keep text-xs leading-5 text-muted-foreground">{scene.reason}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
