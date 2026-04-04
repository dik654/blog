import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import BlockExecViz from './viz/BlockExecViz';
import { DESIGN_CHOICES } from './OverviewData';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = DESIGN_CHOICES.find(d => d.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 실행 전체 흐름</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth는 EVM을 처음부터 구현하지 않는다.
          <strong>revm</strong>(Rust EVM) 라이브러리를 사용한다.
          <br />
          140개 이상의 옵코드 구현이 검증되어 있고, 하드포크 스펙 변경도 revm 팀이 관리한다.<br />
          Reth의 역할은 "revm에 올바른 입력을 넣고, 결과를 효율적으로 저장"하는 것이다.
        </p>
        <p className="leading-7">
          블록 실행의 핵심 추상화는 <code>BlockExecutionStrategy</code> 패턴이다.<br />
          이더리움 메인넷, OP Stack, Polygon 등 체인마다 블록 실행 규칙이 다르다.
          <br />
          trait 기반 Strategy 패턴으로 실행 로직을 교체한다.<br />
          핵심 파이프라인은 공유하고, 체인별 차이(시스템 TX, pre/post hook 등)만 오버라이드한다.
        </p>
        <p className="leading-7">
          상태 변경은 <code>BundleState</code>에 인메모리로 누적된다.<br />
          블록마다 DB에 쓰지 않고, commit_threshold(기본 10,000블록) 단위로 한 번에 기록한다.
          <br />
          이 아티클에서는 BlockExecutor, EvmConfig, BundleState의 내부를 코드 수준으로 추적한다.
        </p>
      </div>

      <div className="not-prose mb-8"><ContextViz /></div>

      {/* Design decision cards */}
      <h3 className="text-lg font-semibold mb-3">핵심 설계 판단</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {DESIGN_CHOICES.map(d => (
          <button key={d.id}
            onClick={() => setSelected(selected === d.id ? null : d.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === d.id ? d.color : 'var(--color-border)',
              background: selected === d.id ? `${d.color}10` : undefined,
            }}>
            <p className="font-bold text-sm" style={{ color: d.color }}>{d.title}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.title}</p>
            <p className="text-sm text-foreground/60 leading-relaxed mb-2">
              <strong>문제:</strong> {sel.problem}
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <strong>해결:</strong> {sel.solution}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-4"><BlockExecViz /></div>
    </section>
  );
}
