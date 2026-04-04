import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BisectionGameViz from './viz/BisectionGameViz';
import FaultGameFlowViz from './viz/FaultGameFlowViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import { BISECTION_TREE, POSITION_ENCODING } from './BisectionGameData';

export default function BisectionGame({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="bisection-game" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bisection Game: 이진 분할 상세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Fault Proof의 핵심은 Bisection Game이다.<br />
          10만 개의 실행 명령어를 L1에서 전부 재실행하면 가스가 수십억 소모된다.<br />
          대신 이진 분할로 "어디서 결과가 갈리는지"를 O(log n) 단계로 찾아낸다.
        </p>
      </div>
      {/* Bisection trace table */}
      <div className="not-prose rounded-lg border border-border/60 overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 text-xs">
              <th className="px-3 py-2 text-left font-medium">Depth</th>
              <th className="px-3 py-2 text-left font-medium">Index</th>
              <th className="px-3 py-2 text-left font-medium">범위</th>
              <th className="px-3 py-2 text-left font-medium">Action</th>
              <th className="px-3 py-2 text-left font-medium">Actor</th>
            </tr>
          </thead>
          <tbody>
            {BISECTION_TREE.map((s, i) => (
              <tr key={i} className="border-t border-border/30">
                <td className="px-3 py-2 font-mono text-xs">{s.depth}</td>
                <td className="px-3 py-2 font-mono text-xs">{s.indexAtDepth}</td>
                <td className="px-3 py-2 text-xs">{s.traceRange}</td>
                <td className="px-3 py-2 text-xs">{s.action}</td>
                <td className="px-3 py-2 text-xs font-semibold"
                  style={{ color: s.actor === '방어자' ? '#10b981' : '#ef4444' }}>
                  {s.actor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Position encoding detail */}
      <button onClick={() => setExpanded(!expanded)}
        className="not-prose w-full text-left rounded-lg border border-border/60 px-5 py-3 mb-4 cursor-pointer hover:bg-muted/30 transition-colors">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">Position 인코딩: depth + indexAtDepth</p>
          <span className="text-foreground/40 text-lg transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose overflow-hidden rounded-lg border border-border/60 px-5 pb-4 pt-3 mb-4">
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{POSITION_ENCODING.explanation}</p>
            <pre className="text-xs bg-muted/40 rounded p-3 font-mono mb-2 overflow-x-auto">
              {POSITION_ENCODING.formula}
            </pre>
            <p className="text-xs text-foreground/70 mb-2">{POSITION_ENCODING.attackDefend}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">{POSITION_ENCODING.depthRule}</p>
            <div className="flex flex-wrap gap-2">
              <CodeViewButton onClick={() => onCodeRef('position', codeRefs['position'])} />
              <span className="text-[10px] text-muted-foreground self-center">Position 구조체</span>
              <CodeViewButton onClick={() => onCodeRef('claim-struct', codeRefs['claim-struct'])} />
              <span className="text-[10px] text-muted-foreground self-center">Claim 구조체</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="not-prose"><BisectionGameViz /></div>
      <h3 className="text-lg font-semibold mt-8 mb-4">Fault Game 코드 흐름: Claim · Position · Game</h3>
      <div className="not-prose"><FaultGameFlowViz /></div>
    </section>
  );
}
