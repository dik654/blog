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
HotStuff: 모든 노드 → 리더 → 모든 노드 (O(n))`}</code>
        </pre>
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
        <h3 className="text-xl font-semibold mt-6 mb-3">코드 구조 (relab/hotstuff)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`hotstuff/
├── consensus/       # 합의 로직
│   ├── consensus.go # Rules 인터페이스 (VoteRule, CommitRule)
│   └── chainedhotstuff.go  # Chained HotStuff 구현
├── crypto/          # Threshold Signature
│   ├── bls12/       # BLS12-381 서명 집계
│   └── ecdsa/       # ECDSA 서명
├── synchronizer/    # View 동기화 & 타이머
├── leaderrotation/  # 리더 선출 전략
│   ├── roundrobin.go
│   └── reputation.go
├── blockchain/      # 블록 저장소
└── internal/proto/  # gRPC 프로토콜 정의`}</code>
        </pre>
      </div>
    </section>
  );
}
