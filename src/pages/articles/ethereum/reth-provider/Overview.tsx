import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import ProviderLayerViz from './viz/ProviderLayerViz';
import type { CodeRef } from '@/components/code/types';
import { PROVIDER_LAYERS, GETH_PROBLEMS } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeLayer, setActiveLayer] = useState(0);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Provider 계층 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          블록체인 노드의 모든 모듈은 상태에 접근한다.<br />
          EVM이 트랜잭션을 실행할 때, RPC가 잔액을 응답할 때, 동기화 엔진이 블록을 검증할 때 — 전부 상태 조회가 필요하다.
        </p>
        <p className="leading-7">
          문제는 상태가 존재하는 위치가 다양하다는 점이다.<br />
          실행 중인 블록의 상태는 메모리에, 확정된 상태는 디스크 DB에, 수백만 블록 전의 데이터는 아카이브 파일에 있다.
        </p>
        <p className="leading-7">
          <strong>Provider 추상화가 없으면?</strong>{' '}
          Geth의 <code>statedb</code>처럼 DB 구현체에 직접 결합된다.<br />
          실행 엔진이 LevelDB의 Get/Put을 직접 호출하므로, 저장소 교체나 Mock 테스트가 어렵다.
        </p>
        <p className="leading-7">
          Reth는 <code>StateProvider</code> trait으로 이 문제를 해결한다.<br />
          3개 메서드(<code>account</code>, <code>storage</code>, <code>bytecode_by_hash</code>)만 구현하면 어떤 저장소든 상태 소스로 사용할 수 있다.
        </p>

        {/* ── StateProvider trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StateProvider trait — 3개 메서드 추상화</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3">StateProvider trait — 3개 메서드</p>
            <div className="space-y-2 text-xs">
              <div><code className="text-indigo-300">account(&amp;Address)</code> → <code>Option&lt;Account&gt;</code> <span className="text-foreground/60">— nonce, balance, code_hash 조회</span></div>
              <div><code className="text-indigo-300">storage(&amp;Address, &amp;StorageKey)</code> → <code>Option&lt;StorageValue&gt;</code> <span className="text-foreground/60">— 스토리지 슬롯 값</span></div>
              <div><code className="text-indigo-300">bytecode_by_hash(&amp;B256)</code> → <code>Option&lt;Bytecode&gt;</code> <span className="text-foreground/60">— 컨트랙트 코드</span></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: 'LatestStateProviderRef', desc: 'MDBX 최신 상태' },
              { label: 'HistoricalStateProvider', desc: '과거 특정 블록' },
              { label: 'BundleStateProvider', desc: '인메모리 캐시' },
              { label: 'MockStateProvider', desc: '테스트용' },
            ].map(impl => (
              <div key={impl.label} className="rounded-lg border border-border p-2">
                <code className="text-xs font-semibold text-indigo-400">{impl.label}</code>
                <p className="text-xs text-muted-foreground mt-0.5">{impl.desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">사용처</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-foreground/70">
              <p>revm Database trait (EVM 실행)</p>
              <p>RPC: eth_getBalance, eth_call, eth_getCode</p>
              <p>txpool 검증 (nonce, balance)</p>
              <p>MerkleStage (계정 상태 로드)</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>StateProvider</code> trait이 <strong>상태 접근의 유일한 인터페이스</strong>.<br />
          revm, RPC, txpool 등 모든 상위 모듈이 이 3개 메서드만 사용.<br />
          저장소 구현은 완전히 캡슐화 → EVM 실행 로직과 DB 엔진 분리.
        </p>

        {/* ── 3계층 위임 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">조회 위임 — BundleState → MDBX → StaticFiles</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="space-y-2">
            {[
              { step: '1', label: 'BundleState (메모리)', hit: '99%', temp: 'Hot', size: '~수 MB', desc: '현재 배치 변경분 우선 확인. selfdestruct면 None 반환', color: 'border-red-500/20 bg-red-500/5', badge: 'bg-red-500' },
              { step: '2', label: 'MDBX (디스크)', hit: '0.99%', temp: 'Warm', size: '~100 GB', desc: 'db_provider.account(addr) fallback — 최신 확정 상태', color: 'border-amber-500/20 bg-amber-500/5', badge: 'bg-amber-500' },
              { step: '3', label: 'StaticFiles (고대)', hit: '0.01%', temp: 'Cold', size: '~300 GB', desc: '계정 상태는 아카이브 안 됨 — 항상 MDBX에 존재', color: 'border-sky-500/20 bg-sky-500/5', badge: 'bg-sky-500' },
            ].map(s => (
              <div key={s.step} className={`rounded-lg border p-3 flex items-start gap-3 ${s.color}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${s.badge}`}>{s.step}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{s.label}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{s.temp} — {s.size}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">히트 {s.hit}</span>
                  </div>
                  <p className="text-xs text-foreground/60 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-xs text-foreground/70">Hot → Warm → Cold 순서 → <strong>캐시 효율 극대화</strong></p>
          </div>
        </div>
        <p className="leading-7">
          <strong>3계층 폴백 구조</strong> — hot/warm/cold 순서로 접근.<br />
          반복 읽기는 BundleState 캐시 히트 → 디스크 I/O 최소화.<br />
          각 계층의 구현이 <code>StateProvider</code> trait 뒤에 숨겨져 있어 상위 코드 단순화.
        </p>

        {/* ── latest vs historical ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Latest vs Historical — 2가지 상태 관점</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4 not-prose">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">LatestStateProviderRef — 현재 상태</p>
            <div className="space-y-1 text-xs text-foreground/70">
              <p>필드: <code>tx: &amp;TX</code>, <code>static_file: StaticFileProviderRef</code></p>
              <p className="font-mono text-foreground/60 mt-2">account(addr) → tx.get::&lt;PlainAccountState&gt;(addr)</p>
              <p className="text-muted-foreground mt-1">PlainAccountState 테이블 직접 조회</p>
            </div>
            <p className="text-xs text-emerald-400/70 mt-2">사용: <code>eth_getBalance(addr)</code> — 현재 잔고</p>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">HistoricalStateProviderRef — 과거 상태</p>
            <div className="space-y-1 text-xs text-foreground/70">
              <p>필드: <code>tx</code>, <code>block_number: BlockNumber</code>, <code>static_file</code></p>
              <div className="mt-2 space-y-0.5 text-foreground/60">
                <p>1. 현재 상태 로드 (<code>PlainAccountState</code>)</p>
                <p>2. <code>AccountChangeSets</code>에서 block_number 이후 변경 수집</p>
                <p>3. 역순 적용하여 해당 블록 시점 상태 복원</p>
              </div>
            </div>
            <p className="text-xs text-amber-400/70 mt-2">사용: <code>eth_getBalance(addr, block=12345)</code></p>
          </div>
        </div>
        <p className="leading-7">
          Latest와 Historical이 <strong>같은 trait의 다른 구현</strong>.<br />
          상위 코드는 구현 교체만으로 "현재" 또는 "과거" 쿼리 자유롭게 전환.<br />
          RPC의 <code>eth_call</code>이 block parameter에 따라 provider 선택 — 코드 중복 없음.
        </p>
      </div>

      {/* Geth 문제점 카드 */}
      <h3 className="text-lg font-semibold mb-3">Geth statedb의 한계</h3>
      <div className="grid gap-2 mb-8">
        {GETH_PROBLEMS.map((p, i) => (
          <div key={i} className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="font-semibold text-sm text-red-400">{p.title}</p>
            <p className="text-sm text-foreground/70 mt-1">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Provider 계층 인터랙티브 카드 */}
      <h3 className="text-lg font-semibold mb-3">Reth Provider 3계층</h3>
      <div className="space-y-2 mb-8">
        {PROVIDER_LAYERS.map((l, i) => (
          <motion.div key={i} onClick={() => setActiveLayer(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeLayer ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeLayer ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold`}
                style={{ backgroundColor: i === activeLayer ? l.color : 'var(--muted)', color: i === activeLayer ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{l.title}</span>
            </div>
            <AnimatePresence>
              {i === activeLayer && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{l.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          조회 순서는 위에서 아래로 폴백(fallback)한다.<br />
          BundleState에 캐시가 있으면 디스크를 읽지 않는다.<br />
          MDBX에도 없으면 StaticFiles까지 내려간다.<br />
          이 계층 구조 덕분에 hot path(최근 블록 조회)는 메모리에서 즉시 응답한다.
        </p>
      </div>

      <div className="not-prose mt-6"><ProviderLayerViz /></div>
    </section>
  );
}
