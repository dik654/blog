import WaveViz from './viz/WaveViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const waveCode = `Bullshark 웨이브 커밋 규칙:

DAG를 2라운드 단위 "웨이브"로 분할:
  Wave w = { Round 2w, Round 2w+1 }

앵커(Anchor):
  각 웨이브의 첫 라운드(짝수)에서 지정
  anchor(w) = leader_of_round(2w)
  → 결정론적 선택 (round % n)

커밋 조건:
  Wave w+1의 앵커가 존재하고,
  Wave w+1의 Round 2(w+1)+1 에서
  f+1 이상의 정점이 anchor(w)에 인과적 연결
  → anchor(w) 커밋!

커밋 후 정렬:
  anchor(w)에서 DAG 역추적
  도달 가능한 모든 미확정 정점 수집
  라운드 오름차순 → 같은 라운드 내 작성자 ID 순`;

export default function WaveCommit() {
  return (
    <section id="wave-commit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">웨이브 커밋</h2>
      <div className="not-prose mb-8"><WaveViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Spiegelman et al., CCS 2022 — §4" citeKey={1} type="paper"
          href="https://arxiv.org/abs/2201.05677">
          <p className="italic">
            "Bullshark achieves optimal amortized latency of 2 rounds in the common case under partial synchrony."
          </p>
        </CitationBlock>

        <CodePanel title="웨이브 커밋 규칙" code={waveCode}
          annotations={[
            { lines: [3, 4], color: 'sky', note: '2라운드 = 1웨이브' },
            { lines: [6, 9], color: 'emerald', note: '앵커 선택: 결정론적' },
            { lines: [11, 15], color: 'amber', note: '커밋 조건: f+1 참조' },
            { lines: [17, 20], color: 'violet', note: '정렬: 라운드→작성자 순' },
          ]} />

        {/* ── Wave Detail ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Wave 상세 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Wave 구조 (partial sync, 2 rounds):

// Wave w = rounds [2w, 2w+1]
// - round 2w: anchor round
// - round 2w+1: voting round

// Anchor selection:
// anchor_author(w) = schedule[w % n]
// - round-robin
// - 모든 validator가 동일 계산
// - no communication

// anchor(w) = the vertex by anchor_author at round 2w
// - may or may not exist (author's vertex at that round)

// Voting (DAG edges):
// - round 2w+1 vertex가 anchor(w) 참조 = vote
// - reference via parents list
// - 각 round 2w+1 vertex의 parents에 anchor(w) 있으면 vote

// Commit rule (fast path):
// commit anchor(w) iff exists wave w+1 anchor a' such that:
//   in a'.causal_history():
//     anchor(w)가 포함됨
//
// 또는 simpler form:
// commit anchor(w) iff:
//   round 2w+1의 vertices 중 f+1+ 가 anchor(w) 참조

// Step-by-step example (n=4, f=1):
//
// Round 0 (wave 0 anchor):
//   V0, V1, V2, V3 propose
//   anchor_author(0) = V0
//   anchor(0) = V0's round 0 vertex
//
// Round 1:
//   V0, V1, V2, V3 propose
//   each references 2f+1 = 3 round 0 certs
//   votes for anchor(0): count those referencing V0_r0
//
// 만약 V1, V2, V3가 anchor(0) 참조:
//   votes = 3 >= f+1 = 2
//   anchor(0) committed!
//
// Round 2 (wave 1 anchor):
//   anchor_author(1) = V1
//   anchor(1) = V1's round 2 vertex
//
// Round 3:
//   votes for anchor(1) counted
//   if >= f+1, commit anchor(1)`}
        </pre>
        <p className="leading-7">
          Wave = <strong>[anchor round, voting round]</strong>.<br />
          anchor는 deterministic round-robin leader.<br />
          f+1+ DAG edges → commit (fast path 2 rounds).
        </p>

        {/* ── Commit Algorithm ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Commit Algorithm 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Commit Algorithm (각 validator 독립 실행):

fn try_commit_anchor(wave: u64) -> Option<Vec<Vertex>> {
    let anchor = get_anchor(wave);
    if anchor.is_none() {
        return None;  // skipped wave
    }

    // Count votes in next round
    let votes = count_votes(anchor, wave * 2 + 1);
    if votes < f + 1 {
        return None;  // insufficient votes
    }

    // Commit anchor + causal history
    let mut to_commit = Vec::new();
    let mut visited = HashSet::new();
    let mut queue = vec![anchor];

    while let Some(v) = queue.pop() {
        if visited.contains(&v) || already_committed(v) {
            continue;
        }
        visited.insert(v);
        to_commit.push(v);
        for parent in v.parents() {
            queue.push(parent);
        }
    }

    // Sort deterministically
    to_commit.sort_by_key(|v| (v.round, v.author));

    Some(to_commit)
}

// Commit order 보장:
// - 모든 validator 동일 순서 계산
// - (round, author) tuple sort
// - deterministic

// Skipped wave handling:
// - anchor 못 commit 시 skip
// - 다음 anchor commit 시 skip wave도 include
// - 모든 vertex 결국 committed

// Commit chaining:
// - wave w commit → wave w-1, w-2, ... 도 chain commit
// - recursive DAG traversal
// - amortized cost low

// 성능:
// - commit 주기: 2 rounds (fast path)
// - 처리량: n vertices per round
// - amortized commit: n/2 vertices per round
// - n=100: 50 vertices per round commit`}
        </pre>
        <p className="leading-7">
          Commit algorithm: <strong>count votes → DFS history → sort</strong>.<br />
          모든 validator 독립 실행, 같은 결과 (deterministic).<br />
          amortized: n/2 vertices per round commit.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 2-round이 optimal인가</strong> — Pass-Shi lower bound.<br />
          이론적으로 responsive BFT consensus는 최소 2δ 필요.<br />
          Bullshark는 2 rounds = 2 × δ latency (partial sync, fast path).<br />
          DAG 위에서 이 하한 달성 — 추가 개선 여지 거의 없음.
        </p>
      </div>
    </section>
  );
}
