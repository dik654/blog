import ChainedVotingViz from './viz/ChainedVotingViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const commitRuleCode = `Chained HotStuff 3-chain Commit Rule:

View v:   리더가 B1 제안 → prepareQC(B1) 생성
View v+1: 리더가 B2 제안 → B2.qc = prepareQC(B1)
           → B1은 pre-committed
View v+2: 리더가 B3 제안 → B3.qc = prepareQC(B2)
           → B2 pre-committed, B1 committed
View v+3: B3 committed → B1 DECIDE (확정)

3-chain rule:
  B1.view + 1 == B2.view
  B2.view + 1 == B3.view
  → B1이 확정됨 (3개 연속 QC 체인)`;

export default function ChainedVoting() {
  return (
    <section id="chained-voting" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체인 투표 (Chained HotStuff)</h2>
      <div className="not-prose mb-8"><ChainedVotingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Yin et al., PODC 2019 — §5 Chained HotStuff" citeKey={1} type="paper"
          href="https://arxiv.org/abs/1803.05069">
          <p className="italic">
            "Chained HotStuff pipelines the protocol phases across views, achieving a one-block latency in the steady state."
          </p>
        </CitationBlock>

        <CodePanel title="3-chain Commit Rule" code={commitRuleCode}
          annotations={[
            { lines: [3, 4], color: 'sky', note: 'View v: B1 Prepare' },
            { lines: [5, 7], color: 'emerald', note: 'View v+1: B1 Pre-Commit' },
            { lines: [8, 9], color: 'amber', note: 'View v+2~v+3: B1 Commit & Decide' },
            { lines: [11, 14], color: 'violet', note: '3-chain 조건' },
          ]} />

        {/* ── Basic vs Chained ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Basic HotStuff vs Chained HotStuff</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">Basic HotStuff (3-phase, 1 block per view)</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Phase 1 Prepare</strong> — leader → all: <code className="text-xs">msg(PREPARE, B, prepareQC)</code> → vote → <code className="text-xs">prepareQC</code></p>
              <p><strong>Phase 2 Pre-commit</strong> — leader → all: <code className="text-xs">msg(PRE-COMMIT, prepareQC)</code> → vote → <code className="text-xs">precommitQC</code></p>
              <p><strong>Phase 3 Commit</strong> — leader → all: <code className="text-xs">msg(COMMIT, precommitQC)</code> → vote → <code className="text-xs">commitQC</code></p>
              <p><strong>Phase 4 Decide</strong> — leader → all: <code className="text-xs">msg(DECIDE, commitQC)</code> → execute block B</p>
              <p className="text-xs mt-2 text-muted-foreground/70">결과: 1 block, 4 rounds per view. Throughput 낮음</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Chained HotStuff (pipelined)</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>View v</strong> — leader proposes <code className="text-xs">B_v</code>, <code className="text-xs">B_v.qc = QC(B_(v-1))</code></p>
              <p className="text-xs pl-2">→ "vote for B_v = prepareQC for B_(v-1)"</p>
              <p><strong>View v+1</strong> — proposes <code className="text-xs">B_(v+1)</code>, <code className="text-xs">qc = QC(B_v)</code></p>
              <p className="text-xs pl-2">→ "vote = precommitQC for B_(v-1)"</p>
              <p><strong>View v+2</strong> — proposes <code className="text-xs">B_(v+2)</code> → "vote = commitQC for B_(v-1)"</p>
              <p><strong>View v+3</strong> — <code className="text-xs">B_(v-1)</code> DECIDED</p>
              <p className="text-xs mt-2 text-muted-foreground/70">결과: 매 view 1 block, 3-view latency. Throughput 3배</p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">핵심 insight: 같은 vote가 여러 단계 역할 수행</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">B_v</code>에 대한 vote = <code className="text-xs">B_(v-1)</code>의 prepareQC 역할</li>
              <li>별도 phase 없이 pipeline 효과 — 매 view 1 QC 생성</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Chained = <strong>vote 재사용으로 파이프라인</strong>.<br />
          vote(B_v)가 prev block의 다음 QC 단계 역할.<br />
          매 view 1 block propose + 1 commit (steady state).
        </p>

        {/* ── 3-chain 규칙 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3-chain Commit Rule 상세</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">Block 구조</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">parent: Hash</code> — 이전 block hash</li>
              <li><code className="text-xs">qc: QC</code> — justifying QC</li>
              <li><code className="text-xs">view: int</code> — block의 view</li>
              <li><code className="text-xs">proposer: Node</code> — leader</li>
              <li><code className="text-xs">payload: [TX]</code> — transactions</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">QC 구조</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">block: Hash</code> — voted-for block</li>
              <li><code className="text-xs">view: int</code></li>
              <li><code className="text-xs">signatures: AggSig</code> — 2f+1 votes</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">3-chain 조건 — block B commits when</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>B ← B&apos; ← B&apos;&apos; (parent chain), 각각 QC 존재</p>
              <p><code className="text-xs">B.view + 1 == B&apos;.view</code> &amp;&amp; <code className="text-xs">B&apos;.view + 1 == B&apos;&apos;.view</code> → B is committed (finalized)</p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">왜 2-chain은 부족한가</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>View v: B 제안 + <code className="text-xs">prepareQC(B)</code></p>
              <p>View v+1: B&apos; 제안, QC(B) 포함 — 여기서 B commit하면?</p>
              <p>Byzantine leader가 v+2에서 다른 chain <code className="text-xs">B*</code> 제안 가능 → fork 생성</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">3-chain 방어</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>B commit 전 3 연속 view QC 필요</p>
              <p>연속 view에 2f+1 vote → quorum 형성</p>
              <p>동시에 다른 chain은 3-chain 형성 불가 → safety 보장</p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Lock (2-chain)</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>B가 B&apos; 통해 2번 QC → B lock</p>
              <p>lock은 safety (view change 시 보존)</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">Commit (3-chain)</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>B lock + B&apos; lock → B commit</p>
              <p>final decision, revert 불가</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          3-chain = <strong>연속 view 3개 QC로 commit</strong>.<br />
          2-chain: lock (safety), 3-chain: commit (final).<br />
          consecutive view 조건이 fork 방어 핵심.
        </p>

        {/* ── 성능 분석 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">성능 분석: Latency vs Throughput</h3>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">프로토콜</th>
                <th className="border border-border px-4 py-2 text-left">Latency</th>
                <th className="border border-border px-4 py-2 text-left">Throughput</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Basic HotStuff', '4δ', '1/(4δ) blocks/sec'],
                ['Chained HotStuff', '3δ', '1/δ blocks/sec (3x 향상)'],
                ['PBFT', '3δ', '1/(3δ)'],
                ['Tendermint', '3δ', '1/(3δ)'],
              ].map(([name, ...rest]) => (
                <tr key={name}>
                  <td className="border border-border px-4 py-2 font-medium">{name}</td>
                  {rest.map((v, i) => (
                    <td key={i} className="border border-border px-4 py-2">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Chained HotStuff 이점</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>각 view마다 새 block 생성</li>
              <li>이전 block의 commit은 background</li>
              <li>leader 바뀌어도 pipeline 유지</li>
              <li>고처리량 + 빠른 finality</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">한계</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>매 view leader rotation 필요</li>
              <li>leader 실패 시 pipeline break</li>
              <li>view change도 3-chain에 포함됨</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">실제 성능 — Aptos (2024)</div>
            <div className="text-sm text-muted-foreground">
              block time <code className="text-xs">100-300ms</code> / finality <code className="text-xs">~1s</code> / TPS <code className="text-xs">10,000+</code> / validator <code className="text-xs">~100</code>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Chained HotStuff: <strong>latency 3δ + throughput 1/δ</strong>.<br />
          Basic 대비 3배 처리량.<br />
          매 view 1 block — pipeline 효과 극대화.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 3-chain이 필요한가 (2-chain 부족한 이유)</strong> — view change safety.<br />
          2-chain은 locking에 충분하지만 commit에는 부족.<br />
          view change 시 Byzantine leader가 2-chain block 무시 가능.<br />
          3-chain은 3 연속 QC → 3f+1 중 2f+1의 2f+1 투표 → safety 보장.
        </p>
      </div>
    </section>
  );
}
