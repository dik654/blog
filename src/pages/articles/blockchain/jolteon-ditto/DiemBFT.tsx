import { CitationBlock } from '@/components/ui/citation';

export default function DiemBFT() {
  return (
    <section id="diembft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DiemBFT v4 (Aptos 합의)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Baudet et al. — DiemBFT v4" citeKey={2} type="paper"
          href="https://developers.diem.com/papers/diem-consensus-state-machine-replication-in-the-diem-blockchain/2021-08-17.pdf">
          <p className="italic">
            "DiemBFT v4 employs a reputation mechanism that promotes leaders based on their recent performance."
          </p>
        </CitationBlock>

        {/* ── Leader Reputation ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Leader Reputation 메커니즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Leader Reputation 문제 인식:
//
// 기존 round-robin leader:
// - 모든 validator가 동등한 차례
// - 네트워크 약한 validator도 leader
// - leader 실패 시 view change 지연
// - system throughput 저하
//
// 해결: 최근 성능 기반 선출
// - 성공한 leader → 자주 선출
// - 실패한 leader → 제외 or 후순위
// - 동적 조정

// Reputation 계산:
//
// window = 지난 W 라운드 (e.g., W=100)
// for each validator v:
//     successes = # rounds where v was leader and committed
//     failures = # rounds where v was leader and timed out
//     reputation(v) = successes / (successes + failures + 1)
//
// Leader 선출 (weighted random):
// prob(v) = reputation(v) / Σ reputation(v_i)
// 가중 확률 기반 random

// 실제 구현 (DiemBFT v4):
// - active validator set (ActiveValidatorSet)
// - reputation score tracked per round
// - leader_selection: pseudo-random weighted
// - VRF or hash-based randomness

// 효과:
// - 빠른 leader = 더 자주 선출
// - 느린 leader = 덜 선출
// - 악의적 leader = exclude 가능
// - throughput 향상

// 공격 완화:
// - bribery 공격: 일시적 선출 증가만
// - long-term 평판으로 평가
// - sudden failure = 즉시 demotion

// 제한사항:
// - 초기에는 random (reputation 없음)
// - reputation 축적 필요
// - window 크기 trade-off

// Aptos 실측 (2024):
// - validator ~100
// - leader rotation: 매 round
// - reputation 기반: ~80% 고성능 leader
// - throughput: 100K+ TPS`}
        </pre>
        <p className="leading-7">
          Leader Reputation = <strong>성과 기반 weighted 선출</strong>.<br />
          느린/실패한 leader를 자동 demotion.<br />
          throughput 향상 + bribery 공격 완화.
        </p>

        {/* ── Pacemaker 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Pacemaker: View Synchronization</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// DiemBFT Pacemaker 역할:
// - view 증가 관리
// - timeout 추적
// - TC 생성
// - view synchronization

// Round 구조:
// - round = view in HotStuff 용어
// - round ↔ leader 1:1 매핑
// - consecutive rounds 필요 (2-chain)

// Timeout 관리:
// timeout(round) = base_timeout * γ^k
// - base_timeout = 1s
// - γ = 1.2 (geometric backoff)
// - k = round가 얼마나 지속됐는지
// - exponential backoff

// View 동기화:
// - Byzantine validator가 premature timeout 가능
// - TC로 자동 동기화:
//   TC(v) 수신 → all validators move to v+1
// - 정직 validator가 TC 따라가기

// 상세 알고리즘:
// loop:
//     leader = leader_selection(round)
//     if self == leader:
//         propose(get_block())
//     start timer(timeout(round))
//
//     while not timeout:
//         if receive QC(round):
//             process QC, next round
//         if receive TC(round):
//             process TC, skip to TC.round+1
//
//     on timeout:
//         send Timeout(round, highQC, highTC)
//         collect 2f+1 timeouts
//         form TC(round)
//         move to next round

// QC Fast-forward:
// - 높은 QC 받으면 skip 가능
// - QC(r) received, current_round < r
// - update current_round = r
// - 따라잡기

// 결과:
// - 빠른 view synchronization
// - byzantine 저항
// - async-safe (Ditto fallback)`}
        </pre>
        <p className="leading-7">
          Pacemaker = <strong>view 동기화 + timeout 관리</strong>.<br />
          TC와 QC로 자동 fast-forward.<br />
          Byzantine validator의 premature timeout 방어.
        </p>

        {/* ── Aptos 실제 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Aptos의 실제 구현 세부사항</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Aptos Consensus (DiemBFT v4 기반):
//
// Components:
// 1. Consensus protocol: DiemBFT v4
// 2. Quorum Store: Narwhal 기반 DAG mempool
// 3. State Sync: 새 validator 동기화
// 4. Execution: Block-STM parallel execution
// 5. Storage: RocksDB

// Block structure:
// struct Block {
//     epoch: u64,
//     round: u64,
//     timestamp: u64,
//     payload: Payload,       // QS batches
//     qc: QuorumCert,         // parent QC
//     tc: Option<TC>,         // if view change
// }

// Quorum Store (Narwhal-inspired):
// - transactions broadcast by validators
// - batches formed with signatures
// - block payload = batch references (O(1))
// - throughput decoupled from consensus

// Execution (Block-STM):
// - optimistic concurrency control
// - speculative parallel execution
// - conflict detection + retry
// - deterministic outcome

// Performance (2024):
// - block time: 100-300ms
// - finality: ~1s
// - throughput: 100K+ TPS (tested)
// - validators: ~100

// Comparison:
// Ethereum: 12s block time, 30 TPS
// Solana: 400ms, 2K TPS
// Sui: ~400ms, 100K+ TPS
// Aptos: 300ms, 100K+ TPS

// Aptos vs Sui:
// - Aptos: DiemBFT v4 (leader-based)
// - Sui: Mysticeti (DAG-based)
// - 성능 비슷, 접근 다름

// 오픈소스:
// - Aptos Core: github.com/aptos-labs
// - Move language
// - Rust 구현
// - 완전 공개 + 활발`}
        </pre>
        <p className="leading-7">
          Aptos = <strong>DiemBFT v4 + Quorum Store + Block-STM</strong>.<br />
          100K+ TPS 목표 — production-grade BFT blockchain.<br />
          Sui (Mysticeti)와 함께 고성능 L1 양대산맥.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Jolteon 기반 개선</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">리더 평판 시스템</p>
            <p className="text-sm">
              최근 라운드에서 성공적으로 블록을 확정한 검증자에게<br />
              더 높은 리더 선출 확률 부여.<br />
              느린 검증자가 리더가 되어 시스템을 지연시키는 것 방지
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Pacemaker 동기화</p>
            <p className="text-sm">
              검증자 간 라운드 진행 속도를 동기화.<br />
              timeout-certificate 기반 view 진행.<br />
              라운드가 분기되지 않도록 보장
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">진화 계보 정리</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">프로토콜</th>
                <th className="border border-border px-4 py-2 text-left">핵심 기여</th>
                <th className="border border-border px-4 py-2 text-left">채택</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['HotStuff (2019)', 'O(n) 통신, 선형 VC', 'Libra 초기'],
                ['Jolteon (2022)', '낙관적 fast path', '이론적 개선'],
                ['Ditto (2022)', 'DAG fallback', '이론적 개선'],
                ['DiemBFT v4', '리더 평판 + Jolteon', 'Aptos 메인넷'],
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

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Aptos는 DiemBFT v4를 채택했나</strong> — Diem 팀의 계승.<br />
          Aptos Labs는 Diem 개발자들이 창립 (2021).<br />
          3년간 Diem에서 검증된 코드 + production 경험.<br />
          Mysticeti가 더 빠르지만 검증된 성숙도가 Aptos의 선택.
        </p>
      </div>
    </section>
  );
}
