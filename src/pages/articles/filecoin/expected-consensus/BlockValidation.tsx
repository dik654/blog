import ValidationDetailViz from './viz/ValidationDetailViz';
import type { CodeRef } from '@/components/code/types';

interface Props {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}

export default function BlockValidation({ onCodeRef }: Props) {
  return (
    <section id="validation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 검증 파이프라인</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        ValidateBlock() — 수신 블록을 30초(1에폭) 내에 검증<br />
        동기 전처리 후 6개 goroutine 병렬 실행
      </p>
      <div className="not-prose mb-8">
        <ValidationDetailViz onOpenCode={onCodeRef} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── ValidateBlock Steps ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ValidateBlock() 6단계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ValidateBlock 병렬 검증 6 단계:

// Preparation (동기):
// - block header decode
// - basic sanity checks
// - parent tipset load
// - lookback state compute

// Step 1: Miner Check (goroutine 1)
// - miner exists & valid
// - miner is in active set
// - minerInfo at lookback height
// - worker address lookup

// Step 2: Ticket Check (goroutine 2)
// - VRF signature verification
// - matches previous tipset's ticket
// - drand beacon correctness
// - ticket proof valid

// Step 3: Election Check (goroutine 3)
// - ElectionProof verification
// - VRF output valid
// - miner won the election (hash < threshold)
// - wincount correct

// Step 4: WinningPoSt Check (goroutine 4)
// - Proof-of-SpaceTime verification
// - challenged sectors correct
// - SNARK proof valid
// - ~40s work (parallel GPU)

// Step 5: BLS Signature Check (goroutine 5)
// - aggregate BLS signature
// - matches all BLS messages
// - block signer correct

// Step 6: State Root Check (goroutine 6)
// - apply all messages
// - compute new state root
// - matches block.ParentStateRoot
// - gas receipts match

// Timing budget:
// - epoch: 30s
// - propagation: 5-10s
// - validation: 10-15s target
// - margin: 5s buffer

// Failure modes:
// - miner invalid → reject block
// - ticket invalid → reject
// - election fraud → reject + slash?
// - PoSt failure → reject
// - signature mismatch → reject
// - state mismatch → reject

// Parallel execution:
// - 각 step 독립 goroutine
// - early abort on first failure
// - cumulative result
// - ~10-15s total (vs 30s sequential)`}
        </pre>
        <p className="leading-7">
          6-step validation: <strong>miner, ticket, election, WinPoSt, BLS, state</strong>.<br />
          parallel goroutines, early abort.<br />
          10-15s total (epoch 30s budget 내).
        </p>

        {/* ── Lookback State ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Lookback State &amp; Worker Key</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Lookback 메커니즘:

// 정의:
// - lookback = 900 epochs (7.5h 과거)
// - 현재 epoch의 state 대신 lookback state 사용
// - 특정 lookups에 한해 (miner info, worker)

// 이유:
// - finality assumption (probabilistic)
// - worker key 안정성
// - reorg 시 일관성

// Lookback state 사용처:
// 1. miner worker address 조회
// 2. ticket verification (worker sig)
// 3. election checks
// 4. miner info (sector power)

// Worker address:
// - miner가 block 서명에 사용
// - storage provider의 hot wallet
// - rotation 가능 (storage provider 결정)

// Worker resolution:
// 1. miner actor state at lookback
// 2. miner.Info().Worker (ID address)
// 3. resolve to BLS/Secp key
// 4. verify signatures

// 왜 lookback 사용?
//
// without lookback:
// - current epoch의 worker key 사용
// - 한 epoch 전 rotation 가능
// - inconsistency risk
//
// with lookback:
// - 900 epoch 전 worker key
// - 해당 시점엔 finalized
// - consistent across nodes
// - safe for block signing

// 900 epochs 근거:
// - historical reorg depth analysis
// - probability of 900-deep reorg < 10^-18
// - 7.5h = practical finality
// - F3 이후엔 축소 가능

// Impact:
// - worker key rotation: 900 epoch delay
// - miners 관리 복잡
// - but security guarantee 강함

// Future:
// - F3 enforced 후 lookback 축소
// - instant finality enables lookback=0
// - network upgrade required`}
        </pre>
        <p className="leading-7">
          Lookback 900 epochs: <strong>worker key 안정성 + finality 보장</strong>.<br />
          과거 state 사용 → consistent validation.<br />
          F3 이후엔 축소 가능성.
        </p>

        {/* ── Validation Performance ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Validation Performance</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Validation Performance:

// Single block validation breakdown:
// - header decode: <1ms
// - miner check: 10-50ms (state lookup)
// - ticket check: 5-10ms (VRF verify)
// - election check: 5-10ms
// - WinningPoSt: 500ms-2s (SNARK verify)
// - BLS check: 10-50ms (aggregation)
// - state check: 500ms-5s (apply messages)

// Bottlenecks:
// 1. WinningPoSt verification
//    - SNARK verification
//    - 500ms+ per block
//    - CPU-bound
//
// 2. State computation
//    - message execution
//    - VM invocation
//    - state tree update
//    - 1-5s typical
//
// 3. BLS aggregation
//    - all messages signed
//    - aggregate verify
//    - 10-100ms

// Optimization:
// - parallel goroutines (6 checks)
// - state caching (LRU)
// - message batching
// - SNARK verification batch

// Target: 30s budget
// - propagation: 5-10s
// - validation: 10-15s
// - sync ms: 5s margin

// Chain sync:
// - ChainSync subsystem
// - fetch missing blocks
// - validate in parallel
// - apply to chain

// Initial sync:
// - genesis → current
// - 100K+ blocks
// - days to catch up
// - snapshot-based faster

// Continuous sync:
// - keep up with live chain
// - <1 epoch lag
// - automatic

// Performance metrics:
// - blocks/sec: ~1 (online mode)
// - full sync: ~24h (from scratch)
// - snapshot sync: ~4h
// - state computation: 100-500ms/tipset

// Scalability limits:
// - message count per block
// - state tree depth (HAMT)
// - sector proving time
// - network bandwidth`}
        </pre>
        <p className="leading-7">
          Validation: <strong>10-15s target (30s epoch budget)</strong>.<br />
          bottlenecks: WinPoSt (500ms), state (1-5s), BLS (10-100ms).<br />
          parallel goroutines + state caching으로 최적화.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 6단계 parallel validation인가</strong> — 30s 시간 budget.<br />
          sequential 실행: 30s 초과 → 다음 epoch 미루기.<br />
          parallel 실행: 10-15s 완료 → real-time 가능.<br />
          early abort로 fail-fast 공격 방어.
        </p>
      </div>
    </section>
  );
}
