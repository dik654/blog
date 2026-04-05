import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ChainSync 전체 흐름</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Lotus 체인 동기화 4단계 — 부트스트랩 → 헤더 수집 → 블록 검증 → 상태 계산<br />
        Syncer가 조율, StateManager가 FVM으로 메시지 실행
      </p>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── ChainSync 4단계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ChainSync 4단계 파이프라인</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Lotus ChainSync 4 stages:

// Stage 1: Bootstrap
// - connect to bootstrap peers
// - discover hello messages
// - identify current heaviest tipset
// - goal: find sync target

// Stage 2: Header Collection
// - request missing BlockHeaders
// - from target → current backwards
// - BlockSyncClient.GetFullTipSet()
// - parallel batches (100 blocks)
// - verify header chain integrity

// Stage 3: Block Validation
// - ValidateBlock() per block
// - parallel goroutines
// - miner, ticket, election checks
// - WinningPoSt verification
// - BLS signature checks

// Stage 4: State Computation
// - ApplyBlocks() per tipset
// - FVM message execution
// - StateTree updates
// - gas accounting
// - CronTick processing

// Sync modes:
// - bootstrap: from genesis (days)
// - resume: from last checkpoint (hours)
// - catch-up: recent blocks only (minutes)
// - real-time: keep up with head (continuous)

// Subsystems:
// - Syncer: orchestration
// - ChainStore: persistent storage
// - StateManager: computation
// - BlockSync: P2P fetching

// 성능:
// - bootstrap: 24h (full)
// - snapshot sync: 4h
// - catch-up: ~1 epoch/sec
// - steady state: 1 tipset per 30s`}
        </pre>
        <p className="leading-7">
          ChainSync: <strong>bootstrap → headers → validate → state</strong>.<br />
          4 subsystems coordinated.<br />
          bootstrap 24h, snapshot 4h, steady 30s/tipset.
        </p>

        {/* ── Initial Sync vs Resume ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Initial Sync vs Resume</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Initial Sync 전략:

// 1. Full sync (from genesis):
//    - 400만+ epochs 필요 (2024 기준)
//    - estimated: 3-7 days
//    - disk: ~500 GiB+
//    - CPU/GPU intensive
//
// 2. Snapshot sync:
//    - CAR file download
//    - compressed (~100 GB)
//    - ~4-12 hours
//    - most common choice
//
// 3. Lite node:
//    - full state 없음
//    - P2P state query
//    - lightweight

// Snapshot format:
// - CAR (Content Addressable Archive)
// - zstd compressed
// - ~100 GB compressed
// - 매일 생성 + CDN 배포

// Resume process:
// 1. load chain state from disk
// 2. determine local heaviest tipset
// 3. compare with network heaviest
// 4. sync missing blocks
// 5. validate incremental

// Resume performance:
// - 1 hour offline: ~2 min catch-up
// - 1 day offline: ~30 min
// - 1 week offline: ~2-4 hours
// - 1 month+: snapshot recommended

// Pruning:
// - old blocks cleanup
// - state snapshots 유지
// - configurable retention
// - ~20 GiB minimal`}
        </pre>
        <p className="leading-7">
          Sync 전략: <strong>full (days), snapshot (hours), lite</strong>.<br />
          snapshot = CAR file (~100GB compressed).<br />
          대부분 실무: snapshot sync 선호.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 4-stage 파이프라인인가</strong> — 각 단계 책임 분리.<br />
          bootstrap: discovery, headers: skeleton, blocks: validation, state: execution.<br />
          각 stage 병렬화 가능 → throughput 최적화.
        </p>
      </div>
    </section>
  );
}
