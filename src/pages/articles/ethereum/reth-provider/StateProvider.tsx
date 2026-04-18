import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StateProviderViz from './viz/StateProviderViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { TRAIT_METHODS, IMPLEMENTORS } from './StateProviderData';

export default function StateProvider({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeMethod, setActiveMethod] = useState(0);

  return (
    <section id="state-provider" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StateProvider trait</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>StateProvider</code>는 상태 접근의 핵심 추상화다.<br />
          이 trait을 구현하면 어떤 저장소든 — 메모리, 디스크 DB, 테스트 Mock — 동일한 인터페이스로 상태를 제공할 수 있다.<br />
          호출자는 상태가 어디에 저장되어 있는지 알 필요가 없다.
        </p>
        <p className="leading-7">
          trait은 3개 메서드만 요구한다.<br />
          <strong>계정 조회</strong>, <strong>스토리지 조회</strong>, <strong>바이트코드 조회</strong>.<br />
          이 3개면 EVM 실행에 필요한 모든 상태 접근을 커버한다.<br />
          Geth의 <code>StateDB</code>가 수십 개 메서드를 노출하는 것과 대조적이다.
        </p>

        {/* ── trait 계층 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Provider trait 계층 — 역할별 세분화</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { name: 'HeaderProvider', methods: ['header_by_number(n)', 'header_by_hash(h)'], color: 'border-sky-500/20 bg-sky-500/5', textColor: 'text-sky-400' },
              { name: 'BlockReader', methods: ['block(id: BlockHashOrNumber)'], color: 'border-emerald-500/20 bg-emerald-500/5', textColor: 'text-emerald-400' },
              { name: 'TransactionReader', methods: ['transaction_by_hash(h)'], color: 'border-violet-500/20 bg-violet-500/5', textColor: 'text-violet-400' },
              { name: 'StateProvider', methods: ['account(a)', 'storage(a, k)', 'bytecode_by_hash(h)'], color: 'border-indigo-500/20 bg-indigo-500/5', textColor: 'text-indigo-400' },
            ].map(t => (
              <div key={t.name} className={`rounded-lg border p-3 ${t.color}`}>
                <code className={`text-sm font-semibold ${t.textColor}`}>{t.name}</code>
                <div className="mt-1 space-y-0.5">
                  {t.methods.map(m => <p key={m} className="text-xs font-mono text-foreground/60">{m}</p>)}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <code className="text-sm font-semibold text-amber-400">StateProviderFactory</code>
            <span className="text-xs text-muted-foreground ml-2">: BlockReader + HeaderProvider</span>
            <div className="mt-1 space-y-0.5 text-xs font-mono text-foreground/60">
              <p>latest() → Box&lt;dyn StateProvider&gt;</p>
              <p>history_by_block_number(block) → Box&lt;dyn StateProvider&gt;</p>
            </div>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Interface Segregation Principle</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-foreground/70">
              <p>RPC는 필요한 trait만 의존</p>
              <p>Mock은 최소 메서드만 구현</p>
              <p>새 기능은 관련 trait만 확장</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          trait을 <strong>역할별로 쪼개어</strong> 정의 — "필요한 것만 의존".<br />
          RPC의 <code>eth_getBlockByNumber</code>는 <code>HeaderProvider + BlockReader</code>만 필요 → 다른 trait 몰라도 됨.<br />
          Mock 테스트 시 최소 메서드만 구현하여 테스트 단순화.
        </p>

        {/* ── 구현체 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StateProvider 구현체 3가지</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4 not-prose">
          {[
            { num: '1', name: 'LatestStateProviderRef', color: 'border-emerald-500/20 bg-emerald-500/5', textColor: 'text-emerald-400', how: 'tx.get::<PlainAccountState>(addr)', detail: 'O(log n) B+tree 직접 조회' },
            { num: '2', name: 'HistoricalStateProviderRef', color: 'border-amber-500/20 bg-amber-500/5', textColor: 'text-amber-400', how: 'load_historical_account(tx, addr, block)', detail: '현재 상태 로드 → ChangeSets 역적용 → 복원' },
            { num: '3', name: 'BundleStateProvider', color: 'border-sky-500/20 bg-sky-500/5', textColor: 'text-sky-400', how: 'bundle.state.get(addr) → fallback', detail: 'BundleState 우선, 없으면 DB provider 위임' },
            { num: '4', name: 'MockStateProvider', color: 'border-border bg-muted/30', textColor: 'text-muted-foreground', how: 'self.accounts.get(addr).cloned()', detail: 'HashMap lookup — 테스트용' },
          ].map(impl => (
            <div key={impl.num} className={`rounded-lg border p-3 ${impl.color}`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">{impl.num}.</span>
                <code className={`text-sm font-semibold ${impl.textColor}`}>{impl.name}</code>
              </div>
              <p className="text-xs font-mono text-foreground/50 mt-1">{impl.how}</p>
              <p className="text-xs text-foreground/60 mt-0.5">{impl.detail}</p>
            </div>
          ))}
        </div>
        <p className="leading-7">
          4가지 구현체 모두 <strong>동일한 3개 메서드</strong>만 구현.<br />
          상위 코드(revm, RPC)는 어느 구현체를 받든 동일하게 동작 → 저장소 교체 가능.<br />
          MockStateProvider로 단위 테스트 작성 시 HashMap만 채우면 끝.
        </p>

        {/* ── EVM 통합 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">revm Database trait과의 통합</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="font-semibold text-sm text-violet-400 mb-2">revm Database trait</p>
              <div className="space-y-1 text-xs">
                <div><code className="text-violet-300">basic(address)</code> → <code>Option&lt;AccountInfo&gt;</code></div>
                <div><code className="text-violet-300">code_by_hash(hash)</code> → <code>Bytecode</code></div>
                <div><code className="text-violet-300">storage(addr, index)</code> → <code>U256</code></div>
                <div><code className="text-violet-300">block_hash(number)</code> → <code>B256</code></div>
              </div>
            </div>
            <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
              <p className="font-semibold text-sm text-indigo-400 mb-2">StateProviderDatabase&lt;DB&gt; — 어댑터</p>
              <div className="space-y-1 text-xs text-foreground/60">
                <p><code>basic()</code> → Reth <code>account()</code> → revm <code>AccountInfo</code> 변환</p>
                <p><code>storage()</code> → Reth <code>storage()</code> → <code>unwrap_or_default()</code></p>
                <p className="text-muted-foreground mt-1">code: None (lazy load via <code>code_by_hash()</code>)</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">revm이 모든 StateProvider 구현체와 동작</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-foreground/70">
              <p>초기 동기화: <code>LatestStateProviderRef</code></p>
              <p>Historical RPC: <code>HistoricalStateProviderRef</code></p>
              <p>블록 실행 중: <code>BundleStateProvider</code></p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>StateProviderDatabase</code>가 <strong>어댑터 패턴</strong> — Reth와 revm의 경계.<br />
          StateProvider의 3개 메서드를 revm의 Database trait으로 매핑.<br />
          이 어댑터 덕분에 revm은 Reth 내부를 알 필요 없고, Reth는 revm을 자유롭게 사용.
        </p>
      </div>

      {/* trait 메서드 인터랙티브 카드 */}
      <h3 className="text-lg font-semibold mb-3">핵심 3개 메서드</h3>
      <div className="space-y-2 mb-8">
        {TRAIT_METHODS.map((m, i) => (
          <motion.div key={i} onClick={() => setActiveMethod(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeMethod ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeMethod ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <code className="text-sm font-mono font-semibold text-indigo-400">{m.name}</code>
              <span className="text-xs text-muted-foreground">→ {m.returns}</span>
            </div>
            <AnimatePresence>
              {i === activeMethod && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{m.desc}</p>
                  <p className="text-xs text-muted-foreground mt-1">MDBX 테이블: <code>{m.table}</code></p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 trait인가?</strong>{' '}
          Rust의 trait은 인터페이스 역할을 한다.
          <code>LatestStateProviderRef</code>는 MDBX에서 최신 상태를 읽고,
          <code>HistoricalStateProvider</code>는 ChangeSet으로 과거 상태를 복원하지만,
          <br />
          호출하는 쪽은 둘 다 <code>&dyn StateProvider</code>로 동일하게 다룬다.
        </p>
      </div>

      {/* 구현체 목록 */}
      <div className="grid grid-cols-2 gap-2 mb-8">
        {IMPLEMENTORS.map((impl) => (
          <div key={impl.name} className="rounded-lg border border-border p-3">
            <p className="font-semibold text-sm" style={{ color: impl.color }}>{impl.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{impl.desc}</p>
          </div>
        ))}
      </div>

      <div className="not-prose">
        <StateProviderViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
