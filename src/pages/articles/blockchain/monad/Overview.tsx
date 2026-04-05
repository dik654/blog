import MonadArchViz from './viz/MonadArchViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Monad 아키텍처 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Monad — EVM 호환 고성능 L1 블록체인<br />
          병렬 실행 + JIT 컴파일 + io_uring 비동기 I/O로 10,000+ TPS 목표
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('monad-parallel-exec', codeRefs['monad-parallel-exec'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              execute_block.cpp
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <MonadArchViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Monad Design Goals</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Monad: EVM Compatible L1
//
// Vision:
//   "Ethereum's performance ceiling과 EVM compatibility를
//    모두 깨고자 하는 시도"
//
// Target Metrics:
//   10,000+ TPS (vs Ethereum's ~15)
//   1 second block time
//   Full EVM bytecode compatibility
//   Parallel execution
//
// 4 Core Innovations:
//
// 1. Parallel Execution
//    Boost.Fiber lightweight threads
//    Optimistic concurrency control
//    Transaction-level parallelism
//    Retry on conflict
//
// 2. JIT Compilation
//    EVM bytecode → x86-64 native code
//    asmjit library
//    2x faster than interpretation
//    Bytecode cache
//
// 3. MonadBFT
//    Custom BFT consensus
//    Pipelined block production
//    Sub-second finality
//    HotStuff 기반
//
// 4. MonadDB
//    Purpose-built state DB
//    io_uring async I/O
//    Merkle Patricia Trie
//    4x throughput vs sync I/O

// Architecture Layers:
//
//   Consensus Layer (MonadBFT)
//     ↓
//   Execution Layer (parallel EVM)
//     ↓
//   State Layer (MonadDB + io_uring)
//     ↓
//   Storage (NVMe SSD)

// Execution Pipeline:
//
//   Block received
//     ↓
//   Transactions queued
//     ↓
//   Parallel execution (all txs simultaneously)
//     ↓
//   Dependency resolution (promises)
//     ↓
//   Sequential merge
//     ↓
//   Retry conflicting txs
//     ↓
//   Final state update

// 경쟁 환경:
//   Solana: 다른 VM (BPF), not EVM
//   Aptos/Sui: Move language
//   Monad: EVM compatible + performance
//   → 기존 Ethereum dApp 즉시 이식 가능
//
// Status (2024):
//   Testnet active
//   Mainnet 예정
//   Foundation backed by major VCs`}
        </pre>
      </div>
    </section>
  );
}
