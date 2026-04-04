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
          3개 메서드(<code>account</code>, <code>storage</code>, <code>bytecode_by_hash</code>)만 구현하면
          어떤 저장소든 상태 소스로 사용할 수 있다.
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
