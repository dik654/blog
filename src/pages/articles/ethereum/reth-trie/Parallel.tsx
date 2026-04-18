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
        <div className="my-4 not-prose">
          <div className="rounded-lg border border-border p-4">
            <p className="font-semibold text-sm mb-3"><code>overlay_root_parallel()</code> — 3단계</p>
            <div className="space-y-3">
              {[
                { step: '1', title: '변경 계정 목록 수집', detail: 'changed_storage_prefixes.keys() → Vec<B256>', color: 'text-sky-400' },
                { step: '2', title: 'storage_root 병렬 계산', detail: 'par_iter() → 각 계정의 storage trie 증분 계산 (rayon work-stealing)', color: 'text-emerald-400' },
                { step: '3', title: 'account trie 합산', detail: 'storage_roots → account trie 반영 → state_root (단일 스레드)', color: 'text-amber-400' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-muted shrink-0 ${s.color}`}>{s.step}</span>
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="text-xs text-foreground/60">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-border">
              <p className="text-xs text-foreground/70"><strong>rayon work-stealing</strong>: N코어에 자동 분산, 빠른 스레드가 느린 스레드 작업 steal</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>par_iter()</code> 하나로 병렬화 완성 — rayon이 내부적으로 work-stealing 스케줄링.<br />
          각 storage trie 계산은 <strong>완전 독립</strong> — 공유 상태 없음, lock 없음.<br />
          16코어에서 변경 계정 1만 개 처리 시 순차 대비 ~14배 가속 (이론치 16배에 근접).
        </p>

        {/* ── DB 접근 동시성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MDBX 다중 reader — DB 접근 병렬화</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">MDBX 다중 reader — 스레드별 독립 TX</p>
            <div className="space-y-1 text-xs text-foreground/60">
              <p>각 병렬 task가 <code>db.tx()?</code>로 자체 MVCC 스냅샷 보유</p>
              <p><code>cursor_read::&lt;StoragesTrie&gt;()</code>로 해당 계정 trie 노드 읽기</p>
              <p>mmap 영역 직접 읽기 → <strong>lock 없음</strong></p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">MDBX 동시성 모델</p>
              <p className="text-xs text-foreground/60">다중 reader: 제한 없음 (N개 READ_ONLY TX)</p>
              <p className="text-xs text-foreground/60">단일 writer: 동시 1개 (READ_WRITE TX)</p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-xs font-semibold text-emerald-400 mb-1">성능 이점</p>
              <p className="text-xs text-foreground/60">reader lock 없음 → 병렬 읽기 자유</p>
              <p className="text-xs text-foreground/60">페이지 캐시 공유 → 추가 I/O 없음</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          MDBX의 <strong>multi-reader 지원</strong>이 병렬 trie 계산의 토대.<br />
          각 스레드가 독립 읽기 트랜잭션 → DB 경합 없이 병렬 스캔.<br />
          mmap 덕분에 같은 페이지를 여러 스레드가 동시에 읽어도 추가 I/O 없음.
        </p>

        {/* ── Amdahl의 법칙 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Amdahl의 법칙 — 이론적 한계</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-border p-4">
            <p className="font-semibold text-sm mb-2">Amdahl의 법칙</p>
            <p className="text-xs text-foreground/70 mb-3">Speedup = 1 / (S + P/N) — S=순차(account trie ~20%), P=병렬(storage trie ~80%)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border">
                  <th className="text-left py-1 pr-3 font-semibold">코어 수</th>
                  <th className="text-right py-1 px-3 font-semibold">이론 가속</th>
                  <th className="text-right py-1 pl-3 font-semibold">비고</th>
                </tr></thead>
                <tbody className="text-foreground/70">
                  <tr className="border-b border-border/50"><td className="py-1 pr-3">N=4</td><td className="text-right px-3">2.5x</td><td className="text-right pl-3"></td></tr>
                  <tr className="border-b border-border/50"><td className="py-1 pr-3">N=8</td><td className="text-right px-3">3.33x</td><td className="text-right pl-3"></td></tr>
                  <tr className="border-b border-border/50"><td className="py-1 pr-3 font-semibold">N=16</td><td className="text-right px-3 font-semibold text-emerald-400">4x</td><td className="text-right pl-3 text-muted-foreground">실측 3.75x</td></tr>
                  <tr><td className="py-1 pr-3">N=inf</td><td className="text-right px-3">5x</td><td className="text-right pl-3 text-muted-foreground">이론 최대</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-xs font-semibold text-emerald-400 mb-1">실측 (reth 메인넷 archive)</p>
              <p className="text-xs text-foreground/60">단일: ~150ms → 16스레드: ~40ms (3.75x)</p>
              <p className="text-xs text-muted-foreground">Amdahl 이론치(4x)에 근접</p>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-xs font-semibold text-amber-400 mb-1">추가 최적화 한계</p>
              <p className="text-xs text-foreground/60">account trie 병렬화는 locking 복잡</p>
              <p className="text-xs text-muted-foreground">storage trie 병렬화로 충분한 속도</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Amdahl의 법칙: <strong>순차 부분이 가속의 상한</strong>.<br />
          account trie 순차 처리가 ~20% 점유 → 최대 가속 ~5배.<br />
          16코어에서 실측 ~3.75배 가속 — 이론치에 근접한 구현.
        </p>

        {/* ── 실전 성능 수치 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실전 벤치마크 — 블록 크기별 효과</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">블록 복잡도별 병렬화 효과 (16코어, 메인넷)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border">
                  <th className="text-left py-1 pr-3 font-semibold">블록 유형</th>
                  <th className="text-right py-1 px-2 font-semibold">TX</th>
                  <th className="text-right py-1 px-2 font-semibold">변경 계정</th>
                  <th className="text-right py-1 px-2 font-semibold text-red-400">순차</th>
                  <th className="text-right py-1 px-2 font-semibold text-emerald-400">병렬</th>
                  <th className="text-right py-1 pl-2 font-semibold">가속</th>
                </tr></thead>
                <tbody className="text-foreground/70">
                  <tr className="border-b border-border/50"><td className="py-1.5 pr-3">가벼운</td><td className="text-right px-2">100</td><td className="text-right px-2">500</td><td className="text-right px-2 text-red-400">20ms</td><td className="text-right px-2 text-emerald-400">15ms</td><td className="text-right pl-2">1.33x</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 pr-3">일반</td><td className="text-right px-2">200</td><td className="text-right px-2">1,500</td><td className="text-right px-2 text-red-400">80ms</td><td className="text-right px-2 text-emerald-400">30ms</td><td className="text-right pl-2">2.66x</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1.5 pr-3">혼잡</td><td className="text-right px-2">500</td><td className="text-right px-2">5,000</td><td className="text-right px-2 text-red-400">300ms</td><td className="text-right px-2 text-emerald-400">80ms</td><td className="text-right pl-2 font-semibold">3.75x</td></tr>
                  <tr><td className="py-1.5 pr-3">DeFi 폭주</td><td className="text-right px-2">1,000</td><td className="text-right px-2">20,000</td><td className="text-right px-2 text-red-400">1,500ms</td><td className="text-right px-2 text-emerald-400">350ms</td><td className="text-right pl-2 font-semibold text-emerald-400">4.28x</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-foreground/70">가벼운 블록: thread spawn 오버헤드 → 이득 미미 / 무거운 블록: 병렬 구간 집중 → 이론 한계 근접</p>
            <p className="text-xs text-muted-foreground mt-1">rayon adaptive scheduling: 작은 작업 → 단일 스레드, 큰 작업 → 자동 분할</p>
          </div>
        </div>
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
