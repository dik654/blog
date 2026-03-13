import { CitationBlock } from '../../../../components/ui/citation';

export default function HotStuff() {
  return (
    <section id="hotstuff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HotStuff</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          HotStuff(2019, Yin et al.)는 PBFT의 두 가지 핵심 문제를 해결합니다:
          (1) <strong>선형 View Change</strong> — O(n³) → O(n),
          (2) <strong>파이프라이닝</strong> — 합의 단계를 겹쳐서 처리량 향상.
          Facebook의 Libra(Diem) 블록체인에 채택되었습니다.
        </p>

        <CitationBlock source="Yin et al., PODC 2019 — Abstract" citeKey={4} type="paper"
          href="https://arxiv.org/abs/1803.05069">
          <p className="italic text-foreground/80">
            "We present HotStuff, a leader-based Byzantine fault-tolerant replication protocol for
            the partially synchronous model. Once network communication becomes synchronous, HotStuff
            enables a correct leader to drive the protocol to consensus at the pace of actual (vs. maximum)
            network delay — a property called <strong>responsiveness</strong> — and with communication
            complexity that is linear in the number of replicas."
          </p>
          <p className="mt-2 text-xs">
            HotStuff가 최초로 Responsiveness + Linear View Change를 동시에 달성한 프로토콜입니다.
            PBFT는 responsive하지만 view change가 O(n³), Tendermint는 O(n²) view change지만
            not responsive (Precommit 단계에서 타임아웃 Δ 대기 필요).
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">3단계 투표 (Threshold Signature 기반)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`HotStuff 기본 (Basic HotStuff):

PBFT와 달리 "Star topology" — 모든 통신이 리더를 경유

  Replicas     Leader      Replicas
     │           │            │
     │←─Prepare──│──Prepare──→│   Phase 1: Prepare
     │──Vote────→│←──Vote─────│   (PBFT Pre-Prepare에 해당)
     │           │            │
     │←PreCommit─│─PreCommit─→│   Phase 2: Pre-Commit
     │──Vote────→│←──Vote─────│   (PBFT Prepare에 해당)
     │           │            │
     │←─Commit───│──Commit───→│   Phase 3: Commit
     │──Vote────→│←──Vote─────│   (PBFT Commit에 해당)
     │           │            │
     │←─Decide───│──Decide───→│   Phase 4: Decide (실행)

통신 복잡도: O(n) per phase — Star topology
  → 리더가 n개 메시지 수신 → Threshold Signature 집계
  → 하나의 QC(Quorum Certificate)로 전파

PBFT: 모든 노드 → 모든 노드 (O(n²))
HotStuff: 모든 노드 → 리더 → 모든 노드 (O(n))

메시지 지연: 7 (Basic HotStuff)
  Prepare(2) + Pre-Commit(2) + Commit(2) + Decide(1) = 7 delays
  → PBFT(5 delays)보다 길지만, 선형 복잡도로 확장성 우월`}</code>
        </pre>

        <CitationBlock source="HotStuff 논문 §4 — Threshold Signatures" citeKey={5} type="paper">
          <p className="italic text-foreground/80">
            "The key enabler of linear view change in HotStuff is the use of <strong>threshold signatures</strong>
            to combine n votes into a single compact Quorum Certificate (QC). This QC carries the same
            proof of 2f+1 agreement as PBFT's set of 2f+1 individual signatures, but in O(1) size."
          </p>
          <p className="mt-2 text-xs">
            PBFT에서 View Change가 O(n³)인 핵심 원인은 개별 서명을 모두 전달해야 했기 때문입니다.
            HotStuff는 Threshold Signature로 2f+1개의 투표를 하나의 QC로 압축하여,
            View Change도 정상 경로와 동일한 O(n) 복잡도를 달성했습니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Chained HotStuff (파이프라이닝)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Chained HotStuff — 단계를 겹쳐서 처리:

View 1: Block₁ ─── Prepare ────────────────────────
View 2: Block₂ ─── Prepare ─── Block₁ Pre-Commit──
View 3: Block₃ ─── Prepare ─── Block₂ Pre-Commit ─── Block₁ Commit──
View 4: Block₄ ─── Prepare ─── Block₃ Pre-Commit ─── Block₂ Commit ─── Block₁ Decide

각 view에서:
  1. 새 블록을 Prepare
  2. 이전 블록을 Pre-Commit (genericQC)
  3. 2단계 전 블록을 Commit (lockedQC)
  4. 3단계 전 블록을 Decide (commitQC)

→ 매 view마다 하나의 투표로 여러 블록의 진행을 동시 처리
→ 이더리움의 "블록 파이프라인"과 유사한 개념
   (slot N 제안 + slot N-1 어테스테이션이 동시 진행)`}</code>
        </pre>

        <CitationBlock source="relab/hotstuff — consensus/chainedhotstuff.go" citeKey={6} type="code"
          href="https://github.com/relab/hotstuff">
          <pre className="text-xs overflow-x-auto"><code>{`// chainedhotstuff.go — CommitRule
func (hs *ChainedHotStuff) CommitRule(qc QuorumCert) *Block {
    // b'' ← b'.parent ← b.parent  (3-chain)
    b2 := hs.blocks.Get(qc.BlockHash())
    if b2 == nil { return nil }
    b1 := hs.blocks.Get(b2.ParentHash())
    if b1 == nil { return nil }
    b := hs.blocks.Get(b1.ParentHash())
    if b == nil { return nil }
    // 3단계 연속 QC가 형성되면 b를 커밋
    if b1.View() == b.View()+1 && b2.View() == b1.View()+1 {
        return b
    }
    return nil
}`}</code></pre>
          <p className="mt-2 text-xs text-muted-foreground">
            Chained HotStuff의 CommitRule: 3개의 연속된 view에서 QC가 체인을 이루면(3-chain)
            가장 오래된 블록을 커밋합니다. 이것이 파이프라이닝의 핵심 로직입니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">View Change 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">프로토콜</th>
                <th className="border border-border px-4 py-2 text-left">정상 경로</th>
                <th className="border border-border px-4 py-2 text-left">View Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">PBFT</td>
                <td className="border border-border px-4 py-2">O(n²)</td>
                <td className="border border-border px-4 py-2">O(n³) — 별도 프로토콜</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">Tendermint</td>
                <td className="border border-border px-4 py-2">O(n²)</td>
                <td className="border border-border px-4 py-2">O(n²) — 단순 라운드 증가</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">HotStuff</td>
                <td className="border border-border px-4 py-2">O(n)</td>
                <td className="border border-border px-4 py-2">O(n) — 정상 경로와 동일!</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">이더리움</td>
                <td className="border border-border px-4 py-2">O(n) 위원회 내</td>
                <td className="border border-border px-4 py-2">없음 (fork choice가 대체)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
