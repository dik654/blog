import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RollupCompareViz from './viz/RollupCompareViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import { CATEGORIES } from './ComparisonData';

export default function Comparison({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = CATEGORIES.find(c => c.id === selected);

  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Optimistic vs ZK 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          두 방식 모두 "실행은 오프체인, 검증은 L1"이라는 롤업 원칙을 따른다.<br />
          차이는 검증 방법 — 사기 증명(fraud proof) vs 유효성 증명(validity proof).
          아래 카테고리를 클릭하면 각 측면의 상세 비교를 확인할 수 있다.
        </p>
      </div>
      {/* Category selector */}
      <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {CATEGORIES.map(c => (
          <button key={c.id}
            onClick={() => setSelected(selected === c.id ? null : c.id)}
            className="rounded-lg border p-3 text-center transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === c.id ? '#6366f1' : 'var(--color-border)',
              background: selected === c.id ? 'rgba(99,102,241,0.06)' : undefined,
            }}>
            <p className="text-lg mb-1">{c.icon}</p>
            <p className="font-semibold text-sm">{c.label}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose overflow-hidden rounded-lg border border-border/60 mb-6">
            <div className="px-5 py-4">
              <p className="font-semibold mb-3">{sel.icon} {sel.label}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-800/30 p-3">
                  <p className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-400 mb-1">
                    Optimistic: {sel.optimistic.value}
                  </p>
                  <p className="text-sm text-foreground/70 leading-relaxed">{sel.optimistic.detail}</p>
                </div>
                <div className="rounded-lg bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-200/50 dark:border-indigo-800/30 p-3">
                  <p className="font-mono font-bold text-sm text-indigo-700 dark:text-indigo-400 mb-1">
                    ZK: {sel.zk.value}
                  </p>
                  <p className="text-sm text-foreground/70 leading-relaxed">{sel.zk.detail}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* OP Stack gas cost section */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-lg font-semibold mb-3">OP Stack의 가스 비용 최적화</h3>
        <p>
          op-batcher(L2 배치 데이터를 L1에 제출하는 컴포넌트)는 블록을 채널로 압축(zlib/brotli)하여 L1 데이터 비용을 최소화한다.
          processBlocks()에서 채널을 최대한 채운 뒤 한 번에 제출한다.<br />
          EIP-4844 blob 사용 시 calldata 대비 최대 10배 저렴.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-3">
          <CodeViewButton onClick={() => onCodeRef('process-blocks', codeRefs['process-blocks'])} />
          <span className="text-[10px] text-muted-foreground self-center">블록 패킹</span>
          <CodeViewButton onClick={() => onCodeRef('tx-data', codeRefs['tx-data'])} />
          <span className="text-[10px] text-muted-foreground self-center">DA 타입 전환</span>
        </div>
        <h3 className="text-lg font-semibold mb-3">보안 모델: 1-of-N vs 수학적 증명</h3>
        <p>
          Optimistic — <strong>"정직한 검증자 1명이면 충분"</strong>.
          Bisection Game(분쟁 범위를 반씩 좁히는 이진 분할 게임)의 체스 클럭(Chess Clock)이 양측에 공정한 응답 시간을 보장한다.<br />
          ZK — 수학적 증명 의존. 정직 가정 불필요하지만, 증명 회로 버그 위험이 있다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-3">
          <CodeViewButton onClick={() => onCodeRef('game-state', codeRefs['game-state'])} />
          <span className="text-[10px] text-muted-foreground self-center">Game 인터페이스</span>
          <CodeViewButton onClick={() => onCodeRef('output-root', codeRefs['output-root'])} />
          <span className="text-[10px] text-muted-foreground self-center">Output Root</span>
        </div>
      </div>
      <div className="not-prose"><RollupCompareViz /></div>
    </section>
  );
}
