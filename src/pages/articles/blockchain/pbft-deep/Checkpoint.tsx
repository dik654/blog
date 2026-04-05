import CodePanel from '@/components/ui/code-panel';

const checkpointCode = `PBFT 체크포인트 & 가비지 컬렉션:

1. 주기적 체크포인트 (매 100 요청마다)
   CHECKPOINT = ⟨CHECKPOINT, n, d, i⟩_σi
   n = 시퀀스 번호, d = 상태 다이제스트

2. 안정 체크포인트 (Stable Checkpoint)
   2f+1 노드가 같은 (n, d)에 서명 → 안정
   → 이전 로그를 안전하게 삭제 가능

3. 워터마크 (Water Mark)
   low-watermark h = 마지막 안정 체크포인트의 n
   high-watermark H = h + L (L은 버퍼 크기)
   h < n <= H 범위의 요청만 처리

4. 메모리 관리
   안정 체크포인트 이전의 Pre-prepare, Prepare,
   Commit 메시지 로그를 전부 삭제
   → 무한 로그 증가 방지`;

export default function Checkpoint() {
  return (
    <section id="checkpoint" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체크포인트 & 로그 정리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          PBFT는 합의 과정에서 <strong>대량 메시지 로그 축적</strong>.<br />
          n=100, 초당 1000 TX → 분당 18M 메시지 (각 TX 당 O(n²)).<br />
          Checkpoint가 없으면 메모리 폭발.
        </p>

        <CodePanel title="체크포인트 & 워터마크" code={checkpointCode}
          annotations={[
            { lines: [3, 5], color: 'sky', note: '주기적 체크포인트 전송' },
            { lines: [7, 9], color: 'emerald', note: '2f+1 확인 → 안정' },
            { lines: [11, 14], color: 'amber', note: '워터마크로 처리 범위 제한' },
            { lines: [16, 19], color: 'violet', note: '오래된 로그 삭제' },
          ]} />

        {/* ── Checkpoint 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Checkpoint 생성 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Checkpoint 생성 조건:
// - sequence number n이 K의 배수 (K=100 or 128)
// - K번째 request execute 후 생성
//
// Checkpoint 메시지:
// ⟨CHECKPOINT, n, d, i⟩_σi
// - n: checkpoint sequence number
// - d: digest of state after executing up to n
// - i: replica id
// - σi: signature
//
// Proof of stability:
// - Replica는 2f+1 CHECKPOINT for same (n, d) 수집
// - 자신의 CHECKPOINT 포함 가능
// - 이것이 "stable checkpoint proof"
//
// Stable checkpoint 효과:
// 1. log entries with sequence <= n 삭제 가능
// 2. 이전 view의 prepared 정보 삭제 가능
// 3. low watermark h := n
// 4. high watermark H := h + L (L=128 default)
//
// 메모리 절감:
// - log entries: PRE-PREPARE, PREPARE, COMMIT
// - 각 entry O(n) signatures
// - K request 후 삭제 → O(K*n) 메모리 회수
//
// State 동기화:
// - 새 replica 합류 시 stable checkpoint 전송
// - 2f+1 CHECKPOINT 증명 포함
// - 해당 시점의 state snapshot 전송
// - 이후 log replay로 최신 상태 도달

// Watermark 범위 제한 (h < n <= H):
// - h: 이미 stable
// - H = h + L: 아직 stable 안 된 최대값
// - L이 너무 크면 메모리 낭비
// - L이 너무 작으면 progress 제한`}
        </pre>
        <p className="leading-7">
          Checkpoint = <strong>주기적 state snapshot + log GC</strong>.<br />
          매 K=100 request마다 생성, 2f+1 동의로 stable.<br />
          log 삭제 + high watermark 전진으로 메모리 관리.
        </p>

        {/* ── State transfer ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">State Transfer (느린 replica 동기화)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Slow replica 문제:
// - 일부 replica가 메시지 놓침
// - watermark range 벗어남
// - 더 이상 합의 참여 불가
// - → state transfer 필요

// State Transfer 프로토콜:
//
// 1. Slow replica가 감지:
//    - PRE-PREPARE의 n > H
//    - 또는 stable checkpoint notification 받음
//
// 2. FETCH 요청 broadcast:
//    ⟨FETCH, h', h, d_h⟩_σi
//    - h': 현재 내 low watermark
//    - h: 원하는 checkpoint
//    - d_h: 예상 state digest
//
// 3. 다른 replica 응답:
//    - state of checkpoint h 전송
//    - partitioning 기법 사용
//    - Merkle tree로 부분 검증 가능
//
// 4. Slow replica가 state 적용:
//    - 2f+1 CHECKPOINT proof 검증
//    - state 저장
//    - log 비우기
//    - h := 새 checkpoint, H := h + L
//
// 5. 현재 view 따라잡기:
//    - PRE-PREPARE, PREPARE, COMMIT 재수신
//    - 현재 sequence까지 catchup

// 성능 고려:
// - state가 크면 partitioning 필수
// - Hyperledger Fabric: Merkle patricia trie
// - Tendermint: IAVL tree snapshot
// - 대역폭 상한 설정 (other replica 보호)

// 실무 숫자:
// - Ethereum state: 150GB+
// - 전체 snapshot 전송 비현실적
// - snap sync: partial download + proof
// - state root 기준 Merkle proof`}
        </pre>
        <p className="leading-7">
          State transfer = <strong>느린 replica 동기화</strong>.<br />
          watermark 벗어난 replica는 checkpoint state 받아 catchup.<br />
          Merkle tree로 부분 전송 + 검증 가능.
        </p>

        {/* ── PBFT 한계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT의 실무 한계와 후속 프로토콜</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PBFT 한계 총정리:
//
// 1. O(n²) 통신 (normal case):
//    - n=4: 36 messages
//    - n=10: 360 messages
//    - n=50: 9,800 messages
//    - n=100: 39,600 messages
//    - 대역폭 선형 × 노드 비선형
//
// 2. O(n³) view change:
//    - n=100: 3.96M message size (aggregated)
//    - view change 지연 = 수 초~분
//    - primary 공격 시 치명적
//
// 3. Static membership:
//    - 노드 리스트 고정
//    - 동적 합류/탈퇴 복잡
//    - 블록체인 유연성 부족
//
// 4. Client-centric:
//    - client가 primary 추적
//    - client가 f+1 reply 수집
//    - blockchain에 부적합 (client != node)

// 후속 프로토콜의 개선:
//
// Zyzzyva (2007):
// - Speculative execution
// - 정상 case 1 round-trip (PBFT는 2)
// - 공격 시 fallback
//
// Tendermint (2014):
// - Blockchain 맞춤
// - continuous consensus (1 block at a time)
// - no client-facing protocol
// - 2/3+ weight voting
//
// HotStuff (2018):
// - O(n) 통신 (linear!)
// - chained voting (3-chain commit)
// - threshold signature
// - automatic leader rotation
//
// Jolteon (2021):
// - HotStuff + 2-chain commit
// - async fallback (Ditto)
// - Aptos 사용
//
// Mysticeti (2024):
// - DAG-based
// - uncertified blocks
// - O(n) amortized
// - 390ms latency

// 교훈:
// PBFT는 concepts의 보고
// 후속 프로토콜은 모두 PBFT를 개선한 것`}
        </pre>
        <p className="leading-7">
          PBFT 한계: <strong>O(n²) normal, O(n³) view change, static membership</strong>.<br />
          HotStuff가 O(n) + threshold signature로 해결.<br />
          25년간 BFT 연구 = PBFT 개선사.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT 한계 정리</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">정상 경로: O(n²)</p>
            <p className="text-sm">
              Prepare + Commit 모두 All-to-All 통신.<br />
              검증자 100명이면 라운드당 약 20,000 메시지
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">View Change: O(n³)</p>
            <p className="text-sm">
              리더 장애 복구에 막대한 비용.<br />
              HotStuff가 O(n), Tendermint가 O(n²)으로 개선
            </p>
          </div>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 PBFT의 유산</strong> — 3-phase pattern.<br />
          Pre-prepare(propose) → Prepare(vote) → Commit(finalize).<br />
          Tendermint의 Proposal → Prevote → Precommit도 동일 패턴.<br />
          HotStuff의 Prepare → Pre-commit → Commit → Decide도 확장.
        </p>
      </div>
    </section>
  );
}
