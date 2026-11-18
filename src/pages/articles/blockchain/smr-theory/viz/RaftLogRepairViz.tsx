import LogGrid from "./LogGrid";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #log-replication 첫 문단 — AppendEntries의 이전 entry index·term 확인과 conflicting suffix 수리.
 * 가정 사례: leader(term 3) log = [t1,t1,t3,t3], follower log = [t1,t1,t2,t2] (index 3–4는 commit되지 않은 이전 leader의 entry).
 * 불일치하면 한 칸 앞으로 물러나 다시 묻는 방식은 한 가지 구현 예입니다.
 */
const LEADER = [1, 1, 3, 3] as const;
const FOLLOWER_OLD = [1, 1, 2, 2] as const;

type Mark = "ok" | "bad" | "probe" | null;

const SCENES = [
  { label: "두 log의 뒷부분이 다릅니다", summary: "index 1–2 같음 · 3–4 다름", note: "칸 안의 숫자는 그 entry를 만든 leader의 term입니다. Follower의 index 3–4는 이전 term 2 leader가 보낸, commit되지 않은 entry입니다(가정).", follower: FOLLOWER_OLD, leaderMarks: [null, null, null, null], followerMarks: [null, null, "bad", "bad"], msg: "아직 보낸 메시지 없음" },
  { label: "이전 entry 확인이 어긋남", summary: "prev = index 3 · t3 → 거절", note: "Leader가 index 4를 보내며 바로 앞 entry가 (index 3, term 3)인지 묻습니다. Follower의 index 3은 term 2라서 prefix가 맞지 않아 거절합니다.", follower: FOLLOWER_OLD, leaderMarks: [null, null, "probe", null], followerMarks: [null, null, "bad", null], msg: "AppendEntries(prev 3·t3, entry 4)" },
  { label: "한 칸 앞에서 다시 확인", summary: "prev = index 2 · t1 → 일치", note: "Leader가 한 칸 물러나 (index 2, term 1)을 묻습니다(가정한 재시도 방식). Follower의 index 2도 term 1이므로 여기까지의 prefix는 같습니다.", follower: FOLLOWER_OLD, leaderMarks: [null, "probe", null, null], followerMarks: ["ok", "ok", null, null], msg: "AppendEntries(prev 2·t1, entry 3–4)" },
  { label: "그 지점부터 덮어씀", summary: "follower = [t1,t1,t3,t3]", note: "Follower는 일치한 index 2 뒤의 conflicting suffix(term 2 두 칸)를 지우고 leader의 entry를 받아 같은 prefix를 만듭니다.", follower: LEADER, leaderMarks: [null, null, null, null], followerMarks: ["ok", "ok", "ok", "ok"], msg: "Follower 수락 → 같은 log" },
] as const;

export default function RaftLogRepairViz() {
  return (
    <SceneShell
      eyebrow="AppendEntries 일관성 확인"
      title="이전 entry의 index·term이 맞는 지점을 찾고, 그 뒤만 leader 것으로 바꿉니다"
      description="칸 하나가 log entry 하나이고 위 숫자가 log index, 칸 안이 term입니다. Leader는 term 3, 두 log의 내용은 가정 사례입니다."
      ariaLabel="Raft leader와 follower log에서 prev index와 term 확인 후 conflicting suffix를 고치는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="space-y-3">
            <LogGrid
              slots={4}
              rows={[
                { name: "leader", terms: LEADER, marks: scene.leaderMarks as readonly Mark[] },
                { name: "follower", terms: scene.follower, marks: scene.followerMarks as readonly Mark[] },
              ]}
            />
            <p className="rounded-md border border-border bg-background px-3 py-2 font-mono text-xs sm:text-sm">{scene.msg}</p>
          </div>
        );
      }}
    />
  );
}
