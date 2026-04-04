import type { CodeRef } from '@/components/code/types';

export const codeRefsExec: Record<string, CodeRef> = {
  'monad-parallel-exec': {
    path: 'category/execution/ethereum/execute_block.cpp',
    code: `// Monad 병렬 실행 — Boost.Fiber 기반
for (unsigned i = 0; i < txn_count; ++i) {
  priority_pool.submit(i, [&] {
    auto result = execute_impl2(state);
    prev_.get_future().wait();
    if (block_state_.can_merge(state)) {
      block_state_.merge(state);
    } else {
      block_metrics_.inc_retries();
      state = State{block_state_};
      result = execute_impl2(state);
      block_state_.merge(state);
    }
  });
}`,
    lang: 'c',
    highlight: [1, 15],
    desc: '병렬 실행 코어. Fiber 풀 동시 실행 → 충돌 시 재실행.',
    annotations: [
      { lines: [2, 3], color: 'sky', note: 'Fiber 풀 동시 제출' },
      { lines: [4, 5], color: 'emerald', note: '낙관적 실행 + 순서 대기' },
      { lines: [6, 12], color: 'amber', note: '충돌 → 재실행' },
    ],
  },
  'monad-jit-compile': {
    path: 'category/execution/evm/jit_compiler.cpp',
    code: `// Monad JIT 컴파일 파이프라인
// 첫 실행: 인터프리터
// 백그라운드: asmjit → x86 변환
// 이후: 캐시된 네이티브 코드
class EvmStackAllocator {
  std::vector<CachedStack> cache_;
  uint8_t* allocate(size_t size) {
    for (auto &c : cache_)
      if (c.capacity >= size)
        return c.data.release();
    return new uint8_t[size];
  }
};
// malloc 대비 16.7배 빠른 할당`,
    lang: 'c',
    highlight: [1, 14],
    desc: 'JIT: asmjit EVM→x86-64. 인터프리터 2.01배.',
    annotations: [
      { lines: [1, 4], color: 'sky', note: 'JIT 3단계' },
      { lines: [5, 13], color: 'emerald', note: 'EvmStackAllocator' },
    ],
  },
  'monad-perf-benchmark': {
    path: 'benchmarks/burntpix/results.md',
    code: `// BurntPix (GCC 14, AVX2)
// Interpreter: 1025ms 1.00x
// Compiler:    509ms  2.01x
// evmone:      802ms  1.28x
// 병렬 (100 TX, 8코어)
// 순차 1000ms → 병렬 180ms → 5.56x
// io_uring vs 동기 I/O
// 동기: 5,000 ops/s → io_uring: 20,833 → 4.17x`,
    lang: 'c',
    highlight: [1, 8],
    desc: '벤치마크: JIT 2x, 병렬 5.56x, io_uring 4.17x.',
    annotations: [
      { lines: [1, 4], color: 'sky', note: 'JIT 2.01x' },
      { lines: [5, 6], color: 'emerald', note: '병렬 5.56x' },
      { lines: [7, 8], color: 'amber', note: 'io_uring 4.17x' },
    ],
  },
};
