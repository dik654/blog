import SceneShell from "./SceneShell";

/**
 * 본문 대응: #byzantine — 같은 H/R/type에서 다른 BlockID면 상충. round·type·ChainID가 다르면 그것만으로 이 chain의 이중 서명 증거가 아니다.
 * 마지막 장면: 합의는 보존·전달, 처벌은 FinalizeBlock을 받은 application.
 */
interface Pair {
  chain: readonly [string, string];
  height: readonly [string, string];
  round: readonly [string, string];
  type: readonly [string, string];
  block: readonly [string, string];
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  pair?: Pair;
  verdict: string;
  conflict: boolean;
}

const SAME_CHAIN = ["이 chain", "이 chain"] as const;
const H41 = ["41", "41"] as const;
const PRECOMMITS = ["precommit", "precommit"] as const;

const SCENES: readonly Scene[] = [
  { label: "좌표가 같고 BlockID만 다름", summary: "상충", conflict: true, pair: { chain: SAME_CHAIN, height: H41, round: ["1", "1"], type: PRECOMMITS, block: ["B41", "다른 BlockID"] }, verdict: "ErrVoteConflictingVotes → evidence pool", note: "A가 h41/r1/precommit에서 두 BlockID에 모두 서명한 경우입니다. tryAddVote는 두 signed vote를 evidence pool(상충 증거를 모아 두는 곳)로 보내고 기존 VoteSet 항목을 교체하지 않습니다." },
  { label: "round가 다름", summary: "그것만으로 이중 서명 아님", conflict: false, pair: { chain: SAME_CHAIN, height: H41, round: ["1", "2 (가정)"], type: PRECOMMITS, block: ["B41", "다른 BlockID"] }, verdict: "이것만으로 이중 서명 아님", note: "Validator는 더 높은 round에서 적법한 POL(한 block에 모인 +2/3 prevote)을 보고 lock을 바꿀 수 있습니다." },
  { label: "type이 다름", summary: "다른 좌표", conflict: false, pair: { chain: SAME_CHAIN, height: H41, round: ["1", "1"], type: ["prevote", "precommit"], block: ["B41", "다른 BlockID"] }, verdict: "좌표가 달라 이것만으로 상충 아님", note: "Duplicate vote의 좌표에는 height뿐 아니라 round와 type도 들어갑니다. 이 조합은 그 규칙을 보이려는 가정입니다." },
  { label: "ChainID가 다름", summary: "이 chain의 evidence 아님", conflict: false, pair: { chain: ["이 chain", "다른 chain"], height: H41, round: ["1", "1"], type: PRECOMMITS, block: ["B41", "다른 BlockID"] }, verdict: "signature가 유효해도 evidence 아님", note: "Signature가 유효해도 다른 ChainID의 canonical bytes(서명 대상으로 정한 byte 표현)에 대한 서명이면 이 chain의 evidence가 아닙니다." },
  { label: "발견 뒤의 길", summary: "발견과 처벌은 다른 단계", conflict: false, verdict: "처벌 정책은 application이 정함", note: "slashing(지분 삭감)·jailing(자격 정지)은 application이 정합니다. 탐지 수와 처벌 결과를 같은 metric으로 보면 누락 단계를 알 수 없습니다." },
];

const ROWS: readonly { key: keyof Pair; name: string }[] = [
  { key: "chain", name: "ChainID" },
  { key: "height", name: "height" },
  { key: "round", name: "round" },
  { key: "type", name: "type" },
  { key: "block", name: "BlockID" },
];

const PATH: readonly { name: string; who: string }[] = [
  { name: "상충 서명 보존", who: "consensus node" },
  { name: "gossip · block inclusion", who: "전달 경로" },
  { name: "FinalizeBlock의 misbehavior", who: "application이 받음" },
  { name: "slashing · jailing 결정", who: "application" },
];

export default function ConflictVoteViz() {
  return (
    <SceneShell
      eyebrow="A가 서명한 vote 두 장"
      title="두 서명은 좌표까지 같아야 상충입니다"
      description="서명 두 장을 칸마다 맞대어 봅니다. 표시한 줄이 두 서명에서 다른 칸입니다."
      ariaLabel="두 vote의 좌표 비교로 상충 여부를 판정하고 evidence가 application까지 가는 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const pair = scene.pair;
        return (
          <div className="min-w-0">
            {pair ? (
              <div className="grid grid-cols-[4.25rem_minmax(0,1fr)_minmax(0,1fr)] gap-1 text-xs">
                <span />
                <strong className="text-center">서명 1</strong>
                <strong className="text-center">서명 2</strong>
                {ROWS.map(({ key, name }) => {
                  const [first, second] = pair[key];
                  const differs = first !== second;
                  const cell = `rounded border px-1 py-1 text-center font-mono ${differs ? "border-amber-600 font-bold text-amber-700 dark:text-amber-400" : "border-border text-muted-foreground"}`;
                  return (
                    <div key={key} className="contents">
                      <span className="self-center text-muted-foreground">{name}</span>
                      <span className={cell}>{first}</span>
                      <span className={cell}>{second}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <ol className="space-y-1 text-xs">
                {PATH.map((step, index) => (
                  <li key={step.name}>
                    {index > 0 && <p className="text-center text-muted-foreground">↓</p>}
                    <div className="flex items-baseline justify-between gap-2 rounded-lg border border-border bg-background px-2 py-1.5">
                      <strong>{step.name}</strong>
                      <span className="shrink-0 text-muted-foreground">{step.who}</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            <div className={`mt-3 rounded-lg border px-2 py-2 text-center font-mono text-xs font-bold ${scene.conflict ? "border-red-600 text-red-700 dark:text-red-400" : "border-dashed border-border text-muted-foreground"}`}>{scene.verdict}</div>
          </div>
        );
      }}
    />
  );
}
