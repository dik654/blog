import SceneShell from "./TrieSceneShell";

/**
 * 본문 대응: #parallel — 서로 다른 contract의 storage trie는 독립 계산, coordinator가 storage root를 account value에 넣고 account trie root를 계산.
 * 완료 순서는 매번 달라도 account key로 정렬하고 duplicate ownership을 거절. stale parent root를 읽은 worker 결과는 각각 valid해 보여도 결합 root가 틀릴 수 있음.
 * contract C1·C2·C3, account key 순서 C1 < C2 < C3, 두 실행의 완료 순서는 설명용 가정.
 */
const CONTRACTS: readonly string[] = ["C1", "C2", "C3"];
const RUNS: readonly { name: string; order: readonly string[] }[] = [
  { name: "실행 1", order: ["C2", "C3", "C1"] },
  { name: "실행 2", order: ["C3", "C1", "C2"] },
];
/** 정렬은 account key 순서(가정: C1 < C2 < C3)를 따릅니다. */
const SORTED = [...RUNS[0].order].sort((a, b) => CONTRACTS.indexOf(a) - CONTRACTS.indexOf(b));

const SCENES = [
  {
    label: "contract마다 work item",
    summary: "storage trie 3개 · 같은 base",
    note: "서로 다른 contract의 storage trie는 각자 root를 가지므로 같은 base checkpoint에서 따로 계산할 수 있습니다. 같은 contract의 여러 slot은 한 trie 안에서 정해진 key 순서로 처리합니다.",
  },
  {
    label: "끝나는 순서는 실행마다 다름",
    summary: "C2→C3→C1 / C3→C1→C2",
    note: "worker가 끝나는 순서는 매번 달라질 수 있습니다. 그림의 두 순서는 가정이며, 이 순서를 그대로 따라 합치면 실행마다 결과가 달라질 위험이 생깁니다.",
  },
  {
    label: "account key 순서로 정렬",
    summary: `두 실행 모두 ${SORTED.join(" · ")}`,
    note: "coordinator는 받은 결과를 account key로 정렬합니다. 같은 account를 두 worker가 반환하면 duplicate ownership으로 거절합니다.",
  },
  {
    label: "account trie root를 계산",
    summary: "두 실행의 최종 root가 같음",
    note: "정렬한 storage root를 각 account value에 넣고 마지막으로 account trie root를 계산합니다. 완료 순서와 상관없이 입력이 같으므로 최종 root도 같아야 합니다.",
  },
  {
    label: "stale 입력이 섞이면",
    summary: "각각은 valid · 결합은 틀림",
    note: "C2 worker가 stale parent root를 읽었다고 가정합니다. 그 storage root는 혼자 보면 올바른 trie root처럼 보이지만, 다른 결과와 합친 root는 틀릴 수 있습니다. delete와 update를 서로 다른 generation에서 계산해도 같은 문제가 생깁니다.",
  },
] as const;

function chip(on: boolean, warn = false) {
  if (!on) return "border-border text-muted-foreground";
  return warn ? "border-red-500/70 bg-red-500/10 text-foreground" : "border-primary bg-primary/10 text-foreground";
}

function ParallelMergeFigure({ active }: { active: number }) {
  const stale = active === 4;
  return (
    <div className="min-w-0 space-y-3 text-xs leading-5">
      <div>
        <p className="mb-1.5 font-semibold text-muted-foreground">① work item · 같은 base checkpoint</p>
        <div className="grid grid-cols-3 gap-2">
          {CONTRACTS.map((name) => {
            const bad = stale && name === "C2";
            return (
              <div key={name} className={`rounded-md border px-2 py-2 text-center ${chip(active === 0 || bad, bad)}`}>
                <strong className="block">{name} storage</strong>
                <span className="block break-keep">{bad ? "stale parent root" : "→ storage root"}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <p className="mb-1.5 font-semibold text-muted-foreground">② 끝난 순서 (가정)</p>
        <div className="space-y-1.5">
          {RUNS.map((run) => (
            <div key={run.name} className="grid grid-cols-[3.5rem_repeat(3,minmax(0,1fr))] items-center gap-2">
              <span className="text-muted-foreground">{run.name}</span>
              {run.order.map((name, index) => (
                <span key={name} className={`rounded-md border px-1 py-1 text-center font-mono ${chip(active === 1)}`}>{`${index + 1}. ${name}`}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 font-semibold text-muted-foreground">③ account key 순 merge → account trie root</p>
        <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.4fr)] items-center gap-2">
          {SORTED.map((name) => {
            const bad = stale && name === "C2";
            return <span key={name} className={`rounded-md border px-1 py-1 text-center font-mono ${chip(active === 2 || active === 3 || bad, bad)}`}>{name}</span>;
          })}
          <span className={`break-keep rounded-md border px-2 py-1 text-center ${chip(active >= 3, stale)}`}>
            {stale ? "결합 root가 틀릴 수 있음" : active >= 3 ? "두 실행 같은 root" : "root"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ParallelMergeViz() {
  return (
    <SceneShell
      eyebrow="parallel storage roots"
      title="worker가 끝나는 순서가 달라도 합치는 순서는 하나입니다"
      description="contract 세 개(C1·C2·C3)의 storage trie를 나눠 계산하는 모형입니다. contract 수, account key 순서 C1 < C2 < C3와 완료 순서는 설명용 가정입니다."
      ariaLabel="contract별 storage root를 병렬 계산한 뒤 account key 순서로 합쳐 같은 state root를 얻는 과정과 stale 입력이 섞일 때의 문제"
      scenes={SCENES}
      render={(active) => <ParallelMergeFigure active={active} />}
    />
  );
}
