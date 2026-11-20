import LogGrid from "./LogGrid";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #log-replication "Commit rule을 ‘과반 복제’ 한 문장으로 줄이면 안 됩니다".
 * 가정 사례: 서버 5대(q=3), S1이 term 3 leader, commit index 2에서 시작.
 * index 3(t2)은 S1–S3에 있음 → 규칙의 근거는 current-term entry → index 4(t3)가 S1–S3에 저장되면 commit index 4, index 3도 함께 committed.
 * S4(log [t1,t1])가 candidate가 되면 S1–S3은 vote를 주지 않아 최대 2표(S4, S5) < 3.
 */
type Mark = "ok" | "bad" | "probe" | null;
type Row = { name: string; terms: readonly (number | null)[] };

const BEFORE: readonly Row[] = [
  { name: "S1 leader", terms: [1, 1, 2, null] },
  { name: "S2", terms: [1, 1, 2, null] },
  { name: "S3", terms: [1, 1, 2, null] },
  { name: "S4", terms: [1, 1, null, null] },
  { name: "S5", terms: [1, 1, null, null] },
];
const AFTER: readonly Row[] = [
  { name: "S1 leader", terms: [1, 1, 2, 3] },
  { name: "S2", terms: [1, 1, 2, 3] },
  { name: "S3", terms: [1, 1, 2, 3] },
  { name: "S4", terms: [1, 1, null, null] },
  { name: "S5", terms: [1, 1, null, null] },
];

const SCENES = [
  { label: "이전 term entry가 과반에 있음", summary: "index 3(t2) 3/5 · commit index 2", note: "S1은 term 3 leader입니다. Index 3은 이전 term 2의 entry이며 S1–S3에 있습니다. Leader가 commit index를 옮기는 근거는 current term entry의 과반 저장이므로 이 칸만 세어 전진하지 않습니다.", rows: BEFORE, commit: 2, highlight: 3, side: "commit index 2 그대로" },
  { label: "current term entry를 과반에 저장", summary: "index 4(t3) 3/5", note: "Leader가 term 3 entry를 index 4에 쓰고 S2·S3까지 저장됐음을 확인합니다. 과반 q=3을 채운 칸은 current term의 entry입니다.", rows: AFTER, commit: 2, highlight: 4, side: "index 4 과반 저장 확인 · commit index 아직 2" },
  { label: "앞 칸도 함께 committed prefix", summary: "commit index 2 → 4", note: "Index 4가 commit되면 그 앞의 index 3(term 2) entry도 committed prefix에 들어갑니다. 아래 초록 선이 committed prefix입니다.", rows: AFTER, commit: 4, highlight: null, side: "commit index 4" },
  { label: "덜 최신인 log는 당선되지 못함", summary: "S4 최대 2표 < 3", note: "Up-to-date 비교는 마지막 entry의 term이 큰 쪽, 같으면 더 긴 쪽이 앞섭니다. 마지막이 t3인 S1–S3은 S4(마지막 t1)에 vote를 주지 않아, S4는 자기·S5 표 2표에 그쳐 committed index 3–4를 잃는 leader가 되지 못합니다.", rows: AFTER, commit: 4, highlight: null, side: "S4 candidate → S1–S3 거절" },
] as const;

export default function RaftCommitViz() {
  return (
    <SceneShell
      eyebrow="Commit rule"
      title="Current term entry가 과반에 저장될 때 그 앞의 이전 term entry까지 함께 commit됩니다"
      description="서버 5대(과반 3), 위 숫자가 log index, 칸 안이 term인 가정 사례입니다. 초록 선은 commit index까지의 committed prefix입니다."
      ariaLabel="Raft leader가 current term entry로 commit index를 옮기고 election restriction이 덜 최신인 후보를 막는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const voteScene = active === 3;
        return (
          <div className="space-y-3">
            <LogGrid
              slots={4}
              commitIndex={scene.commit}
              rows={scene.rows.map((row) => ({
                name: row.name,
                terms: row.terms,
                marks: row.terms.map((term, i): Mark => {
                  if (term === null) return null;
                  if (voteScene) return row.name === "S4" ? "probe" : i === 3 ? "ok" : null;
                  if (scene.highlight === i + 1) return scene.highlight === 4 ? "ok" : "probe";
                  return null;
                }),
              }))}
            />
            <p className="rounded-md border border-border bg-background px-3 py-2 font-mono text-xs sm:text-sm">{scene.side}</p>
          </div>
        );
      }}
    />
  );
}
