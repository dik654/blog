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
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Wave 구조 (partial sync, 2 rounds)</p>
            <p className="text-sm">
              <code>Wave w = rounds [2w, 2w+1]</code> — round 2w: anchor round, round 2w+1: voting round
            </p>
            <div className="grid gap-2 sm:grid-cols-3 mt-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Anchor selection</p>
                <p className="text-muted-foreground"><code>anchor_author(w) = schedule[w % n]</code>, round-robin, 모든 validator 동일 계산, no communication</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Voting (DAG edges)</p>
                <p className="text-muted-foreground">round 2w+1 vertex가 <code>anchor(w)</code> 참조 = vote. parents list에 anchor 있으면 vote</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Commit rule (fast path)</p>
                <p className="text-muted-foreground">round 2w+1의 vertices 중 <code>f+1+</code>가 <code>anchor(w)</code> 참조 → commit</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Step-by-step 예시 (<code>n=4, f=1</code>)</p>
            <div className="text-sm space-y-1.5">
              <p><strong>Round 0</strong> (wave 0 anchor): V0~V3 propose. <code>anchor_author(0)=V0</code>, <code>anchor(0)</code>=V0's round 0 vertex</p>
              <p><strong>Round 1</strong>: V0~V3 propose, each references <code>2f+1=3</code> round 0 certs. V1, V2, V3가 <code>anchor(0)</code> 참조 → votes=3 &ge; <code>f+1</code>=2 → <code>anchor(0)</code> committed</p>
              <p><strong>Round 2</strong> (wave 1 anchor): <code>anchor_author(1)=V1</code>, <code>anchor(1)</code>=V1's round 2 vertex</p>
              <p><strong>Round 3</strong>: votes for <code>anchor(1)</code> counted → <code>&ge; f+1</code>이면 commit</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Wave = <strong>[anchor round, voting round]</strong>.<br />
          anchor는 deterministic round-robin leader.<br />
          f+1+ DAG edges → commit (fast path 2 rounds).
        </p>

        {/* ── Commit Algorithm ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Commit Algorithm 상세</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Commit Algorithm (각 validator 독립 실행)</p>
            <ol className="text-sm list-decimal list-inside space-y-1">
              <li><code>get_anchor(wave)</code> — anchor 없으면 skipped wave로 <code>None</code> 반환</li>
              <li><code>count_votes(anchor, wave*2+1)</code> — round 2w+1에서 anchor 참조 수 카운트. <code>&lt; f+1</code>이면 insufficient votes</li>
              <li>anchor + causal history DFS 수집: <code>visited</code> set으로 중복 방지, <code>already_committed</code> 체크</li>
              <li><code>to_commit.sort_by_key(|v| (v.round, v.author))</code> — deterministic 순서</li>
            </ol>
          </div>
          <div className="p-4">
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Skipped wave handling</p>
                <p className="text-muted-foreground">anchor 못 commit 시 skip → 다음 anchor commit 시 skip wave도 include. 모든 vertex 결국 committed</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Commit chaining</p>
                <p className="text-muted-foreground">wave w commit → wave w-1, w-2, ... 도 chain commit. recursive DAG traversal, amortized cost low</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-1">성능</p>
            <p className="text-sm text-muted-foreground">
              commit 주기: 2 rounds (fast path). 처리량: n vertices per round, amortized <code>n/2</code> vertices per round. <code>n=100</code>일 때 50 vertices per round commit
            </p>
          </div>
        </div>
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
