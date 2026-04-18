import JolteonViz from './viz/JolteonViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const pathCode = `Jolteon 이중 경로:

Fast Path (낙관적, 2단계):
  리더 → Propose(B)
  모든 노드 → Vote(B)
  리더가 n-f 투표 수집 → QC(B) 형성
  → 2단계 완료, 4 message delays
  조건: 모든 정직 노드가 동의해야 함

Slow Path (HotStuff 3단계):
  리더 장애 또는 일부 비동의 시 fallback
  Prepare → Pre-Commit → Commit
  → 7 message delays
  O(n) View Change 유지

전환 규칙:
  Fast path QC 실패 → 자동으로 slow path
  Slow path 완료 후 → 다음 view에서 fast 재시도`;

export default function Jolteon() {
  return (
    <section id="jolteon" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Jolteon</h2>
      <div className="not-prose mb-8"><JolteonViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Gelashvili et al., FC 2022 — Jolteon" citeKey={1} type="paper"
          href="https://arxiv.org/abs/2106.10362">
          <p className="italic">
            "Jolteon combines the linear view-change of HotStuff with the optimistic responsiveness of PBFT."
          </p>
        </CitationBlock>

        <CodePanel title="Jolteon 이중 경로" code={pathCode}
          annotations={[
            { lines: [3, 8], color: 'emerald', note: 'Fast: 2단계, 4 delays' },
            { lines: [10, 14], color: 'sky', note: 'Slow: 3단계 HotStuff' },
            { lines: [16, 18], color: 'amber', note: '자동 전환 규칙' },
          ]} />

        {/* ── Jolteon 프로토콜 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Jolteon 프로토콜 상세</h3>
        <div className="not-prose grid grid-cols-1 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">Fast Path — View v</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>1. Propose</strong> — leader → all: <code className="text-xs">Propose(B_v, B_v.qc = QC(B_(v-1)))</code></p>
              <p><strong>2. Vote</strong> — <code className="text-xs">B_v.qc.view == v-1</code> (consecutive) → <code className="text-xs">vote(B_v)</code> → leader. TC 있으면 safety check 후 vote</p>
              <p><strong>3. Aggregate</strong> — 2f+1 votes → <code className="text-xs">QC(B_v)</code> → broadcast</p>
              <p><strong>4. Update</strong> — <code className="text-xs">lockedQC = QC(B_v)</code> if consecutive. 2-chain 달성 시 <code className="text-xs">B_(v-1)</code> commit</p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">2-chain Commit Rule</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>commit(B) iff B&apos; 존재:</p>
              <p><code className="text-xs">QC(B)</code>, <code className="text-xs">QC(B&apos;)</code> exist &amp;&amp; B ← B&apos; (parent)</p>
              <p><code className="text-xs">B.view + 1 == B&apos;.view</code> (consecutive) → B committed</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Slow Path (View Change)</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>1.</strong> timeout → <code className="text-xs">Timeout(v, highQC, highTC)</code> → new leader</p>
              <p><strong>2.</strong> 2f+1 Timeout 수집 → <code className="text-xs">TC(v)</code> 형성, <code className="text-xs">max(highQC)</code> 계산</p>
              <p><strong>3.</strong> <code className="text-xs">B_(v+1) = Block(qc=max_highQC, tc=TC(v))</code></p>
              <p><strong>4.</strong> TC validity + proposal safety check → vote</p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Safety 보장</div>
            <div className="text-sm text-muted-foreground">
              2-chain commit + TC → HotStuff 3-chain 역할. TC가 view v의 "종료" 증명. <code className="text-xs">max(highQC)</code>로 이전 locked state 전달.
            </div>
          </div>
        </div>
        <p className="leading-7">
          Jolteon = <strong>2-chain + TC</strong>.<br />
          HotStuff의 3-chain 대비 1 view 단축.<br />
          TC가 view change safety 역할 (HotStuff-2와 동일 아이디어).
        </p>

        {/* ── Fast vs Slow Path ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Fast Path vs Slow Path</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Fast Path (happy case)</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>조건</strong>: honest leader, GST passed, 모든 replica timely 수신</p>
              <p><strong>흐름</strong>: View v-1에서 <code className="text-xs">QC(B_(v-1))</code> → View v에서 2f+1 vote → <code className="text-xs">QC(B_v)</code> → <code className="text-xs">B_(v-1)</code> committed</p>
              <p><strong>Latency</strong>: 1 block per <code className="text-xs">2δ</code> (steady state)</p>
              <p><strong>Communication</strong>: propose + vote + QC broadcast = <code className="text-xs">O(n)</code> per view</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Slow Path (sad case)</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>조건</strong>: leader 실패/Byzantine, network partition, message delay</p>
              <p><strong>흐름</strong>: Timeout → <code className="text-xs">Timeout(v, highQC)</code> → 2f+1 수집 → <code className="text-xs">TC(v)</code> → new proposal with TC</p>
              <p><strong>Latency</strong>: <code className="text-xs">timeout + δ + 2δ</code> per commit</p>
              <p><strong>Communication</strong>: Timeout + TC + Propose = <code className="text-xs">O(n)</code></p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">자동 Fallback &amp; 낙관적 효과</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Fast path 실패 시 자동 timeout → 전환 overhead 최소, 연속 실패 시 exponential timeout</p>
              <p>대부분 fast path — optimistic <code className="text-xs">2δ</code> / worst case <code className="text-xs">timeout + 3δ</code></p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Fast path: <strong>2δ per commit (happy case)</strong>.<br />
          Slow path: TC formation + timeout 포함 (sad case).<br />
          자동 fallback — 별도 관리 불필요.
        </p>

        {/* ── Ditto 확장 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Ditto: Async Fallback 추가</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Mode 1: Fast Path</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Jolteon fast path</li>
              <li>partial sync optimistic</li>
              <li><code className="text-xs">2δ</code> per commit</li>
              <li>normal operation</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Mode 2: Slow Path</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Jolteon slow path with TC</li>
              <li><code className="text-xs">timeout + 3δ</code></li>
              <li>leader 장애 복구</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">Mode 3: Async DAG</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Narwhal 기반, fully async</li>
              <li>no timing assumption</li>
              <li>liveness under any condition</li>
              <li>higher latency but always progress</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">Mode 전환 규칙</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Mode 1 → 2: timeout 발생</li>
              <li>Mode 2 → 3: 연속 timeout (GST 못 도달)</li>
              <li>Mode 3 → 1: 네트워크 안정화 감지</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">Ditto의 기여</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>"어떤 네트워크 상황에서도 liveness" — 기존 BFT는 GST 필요</p>
              <p>DDoS 공격에도 진행, long-lived 시스템 강건성</p>
              <p>Aptos DiemBFT v4에 부분 반영, Mysticeti (Sui) 영향</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Ditto = <strong>Jolteon + DAG async fallback</strong>.<br />
          3 mode: optimistic → partial sync → async.<br />
          async-safe liveness — DDoS에도 진행.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Jolteon의 2-chain이 안전한가</strong> — TC의 역할.<br />
          HotStuff 3-chain의 Pre-commit = Jolteon의 TC.<br />
          TC가 "이 view가 종료됐고 max highQC가 유효함" 증명.<br />
          이론적으로 HotStuff-2와 동일 원리 (different formulation).
        </p>
      </div>
    </section>
  );
}
