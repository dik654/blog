import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PARALLEL_STRATEGY, PARALLEL_BENEFIT } from './ParallelData';

export default function Parallel() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="parallel" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">병렬 상태 루트 (Parallel Trie)</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>overlay_root_parallel()</code>은 PrefixSet 최적화에 더해 병렬 처리를 적용한다.<br />
          각 계정의 storage trie는 독립적인 서브트리이므로, 동시에 계산할 수 있다.<br />
          계산이 끝난 storage root를 account trie에 합산하면 최종 상태 루트가 나온다.
        </p>
        <p className="leading-7">
          <strong>왜 storage trie만 병렬화하는가?</strong>{' '}
          account trie는 단일 트리다. 모든 계정이 하나의 트리에 속하므로 동시 수정 시 경합이 발생한다.<br />
          반면 storage trie는 계정별로 완전히 분리되어 있다.<br />
          계정 A의 스토리지 해시 계산이 계정 B에 영향을 주지 않으므로 lock 없이 병렬 실행이 가능하다.
        </p>

        {/* ── rayon 병렬화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">rayon par_iter — storage trie 병렬화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`use rayon::prelude::*;

pub fn overlay_root_parallel(self) -> Result<B256> {
    // 1. 변경된 계정 목록 수집
    let changed_accounts: Vec<B256> = self.changed_storage_prefixes
        .keys()
        .copied()
        .collect();

    // 2. 각 계정의 storage_root 병렬 계산
    let storage_roots: HashMap<B256, B256> = changed_accounts
        .par_iter()  // rayon 병렬 iterator
        .map(|hashed_addr| {
            let storage_prefix_set = &self.changed_storage_prefixes[hashed_addr];
            let storage_root = self.compute_storage_root_incremental(
                *hashed_addr,
                storage_prefix_set,
            )?;
            Ok((*hashed_addr, storage_root))
        })
        .collect::<Result<_>>()?;

    // 3. storage_roots를 account trie에 반영하여 state_root 계산
    //    account trie는 단일 스레드로 구성 (병렬화 불가)
    self.compute_account_root_with_storage(storage_roots)
}

// rayon의 work-stealing:
// - N개 CPU 코어에 작업 자동 분산
// - 빠른 스레드가 느린 스레드의 작업 훔침 (load balancing)
// - 100K 계정 × 16 코어 = 이상적 16배 가속`}
        </pre>
        <p className="leading-7">
          <code>par_iter()</code> 하나로 병렬화 완성 — rayon이 내부적으로 work-stealing 스케줄링.<br />
          각 storage trie 계산은 <strong>완전 독립</strong> — 공유 상태 없음, lock 없음.<br />
          16코어에서 변경 계정 1만 개 처리 시 순차 대비 ~14배 가속 (이론치 16배에 근접).
        </p>

        {/* ── DB 접근 동시성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MDBX 다중 reader — DB 접근 병렬화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 각 병렬 task가 자체 MDBX 읽기 트랜잭션 보유
par_iter().map(|hashed_addr| {
    // 스레드 로컬 읽기 트랜잭션
    let tx = db.tx()?;  // MVCC 스냅샷 (읽기 전용)

    // 해당 계정의 storage trie 노드 읽기
    let storage_nodes = tx.cursor_read::<StoragesTrie>()?
        .walk_range(storage_prefix..)?;

    // 병렬 계산 진행
    compute_trie(storage_nodes)?
})

// MDBX의 동시성 모델:
// - 다중 reader: 제한 없음 (READ_ONLY 트랜잭션 N개)
// - 단일 writer: 동시 1개 (READ_WRITE 트랜잭션 1개)
//
// 병렬 trie 계산 시 16개 reader가 동시에 DB 접근
// → 각 스레드가 mmap 영역을 직접 읽음 (lock 없음)
// → 각 스레드가 자기 MVCC 스냅샷 보유

// 성능 이점:
// - 전통적 DB: writer lock → 읽기도 대기
// - MDBX: reader는 lock 없음 → 병렬 읽기 자유
// - 페이지 캐시 공유 → 여러 스레드가 같은 데이터 접근 시 추가 I/O 없음`}
        </pre>
        <p className="leading-7">
          MDBX의 <strong>multi-reader 지원</strong>이 병렬 trie 계산의 토대.<br />
          각 스레드가 독립 읽기 트랜잭션 → DB 경합 없이 병렬 스캔.<br />
          mmap 덕분에 같은 페이지를 여러 스레드가 동시에 읽어도 추가 I/O 없음.
        </p>

        {/* ── Amdahl의 법칙 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Amdahl의 법칙 — 이론적 한계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 병렬화 가속 계산 (Amdahl's law):
// Speedup = 1 / (S + P/N)
// S = 순차 부분 비율 (account trie)
// P = 병렬 부분 비율 (storage trie)
// N = 코어 수

// Reth의 trie 계산 분석:
// - 순차 부분 (account trie 재해시): ~20% (S=0.2)
// - 병렬 부분 (storage trie 재해시): ~80% (P=0.8)

// 이론적 가속:
// N=4:  1 / (0.2 + 0.8/4) = 1 / 0.4 = 2.5x
// N=8:  1 / (0.2 + 0.8/8) = 1 / 0.3 = 3.33x
// N=16: 1 / (0.2 + 0.8/16) = 1 / 0.25 = 4x
// N=32: 1 / (0.2 + 0.8/32) = 1 / 0.225 = 4.44x
// N=∞:  1 / (0.2 + 0) = 5x (최대)

// 실측값 (reth 메인넷 archive):
// 단일 스레드 MerkleStage: ~150ms/block
// 16 스레드 MerkleStage: ~40ms/block (3.75x)
// → Amdahl 이론치(4x)에 근접

// 추가 최적화 한계:
// - account trie 병렬화는 locking 복잡 → 구현 난이도 > 이득
// - storage trie 병렬화로 현재 만족스러운 속도 달성`}
        </pre>
        <p className="leading-7">
          Amdahl의 법칙: <strong>순차 부분이 가속의 상한</strong>.<br />
          account trie 순차 처리가 ~20% 점유 → 최대 가속 ~5배.<br />
          16코어에서 실측 ~3.75배 가속 — 이론치에 근접한 구현.
        </p>

        {/* ── 실전 성능 수치 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실전 벤치마크 — 블록 크기별 효과</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 블록 복잡도별 병렬화 효과 (메인넷 아카이브 노드, 16코어)
//
// 가벼운 블록 (100 TX, 500 변경 계정):
//   순차: 20ms
//   병렬: 15ms
//   가속: 1.33x (병렬화 오버헤드가 체감됨)
//
// 일반 블록 (200 TX, 1500 변경 계정):
//   순차: 80ms
//   병렬: 30ms
//   가속: 2.66x
//
// 혼잡 블록 (500 TX, 5000 변경 계정):
//   순차: 300ms
//   병렬: 80ms
//   가속: 3.75x
//
// DeFi 폭주 블록 (1000 TX, 20000 변경 계정, 스토리지 집중):
//   순차: 1500ms
//   병렬: 350ms
//   가속: 4.28x (이론 한계에 근접)

// 병렬화의 가치:
// - 가벼운 블록에서는 미미 (thread spawn 오버헤드)
// - 무거운 블록에서 급격히 증가 (workload가 병렬 구간에 집중)
// - DeFi 활동이 많은 시기에 유의미
//
// rayon의 adaptive scheduling:
// - 작은 작업 → 단일 스레드 실행
// - 큰 작업 → 자동 분할 병렬`}
        </pre>
        <p className="leading-7">
          병렬화 효과는 <strong>블록 복잡도에 비례</strong>.<br />
          일반 블록에서 2~3배, 혼잡 블록에서 4배 근처 — 혼잡할수록 이득이 커짐.<br />
          rayon의 adaptive scheduling이 작업 크기에 따라 자동으로 병렬화 수준 조절.
        </p>
      </div>

      {/* 병렬화 전략 카드 */}
      <h3 className="text-lg font-semibold mb-3">병렬화 3단계</h3>
      <div className="space-y-2 mb-8">
        {PARALLEL_STRATEGY.map((s, i) => (
          <motion.div key={i} onClick={() => setActiveStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeStep ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeStep ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeStep ? s.color : 'var(--muted)', color: i === activeStep ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === activeStep && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 순차 vs 병렬 비교 */}
      <div className="rounded-lg border border-border p-4 mb-8">
        <h4 className="text-sm font-semibold mb-3">순차 vs 병렬 비교</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="w-16 text-xs font-semibold text-red-400 shrink-0">순차</span>
            <span className="text-foreground/70">{PARALLEL_BENEFIT.sequential}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-16 text-xs font-semibold text-emerald-400 shrink-0">병렬</span>
            <span className="text-foreground/70">{PARALLEL_BENEFIT.parallel}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-16 text-xs font-semibold text-muted-foreground shrink-0">병목</span>
            <span className="text-foreground/60">{PARALLEL_BENEFIT.bottleneck}</span>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>PrefixSet 분할과 병렬화의 조합</strong> —
          PrefixSet이 변경 범위를 최소화하고, 병렬 trie가 나머지 작업을 코어 수만큼 분산한다.
          <br />
          대규모 블록(DeFi 배치, NFT 민트 등)에서 효과가 크다.<br />
          변경 계정이 많을수록 병렬화의 이점이 커진다.
        </p>
      </div>
    </section>
  );
}
