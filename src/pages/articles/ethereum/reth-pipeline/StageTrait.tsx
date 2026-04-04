import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import StageTraitViz from './viz/StageTraitViz';
import { STAGE_METHODS } from './StageTraitData';
import type { CodeRef } from '@/components/code/types';

export default function StageTrait({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [active, setActive] = useState(0);

  return (
    <section id="stage-trait" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Stage trait & 실행 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Pipeline은 <code>Vec&lt;Box&lt;dyn Stage&gt;&gt;</code>를 순회하며 각 Stage를 호출한다.<br />
          Stage trait의 핵심은 두 메서드다. <code>execute()</code>가 정방향 처리를 담당하고,
          <code>unwind()</code>가 reorg(체인 재구성) 시 역방향 롤백을 처리한다.
        </p>
        <p className="leading-7">
          <strong>Geth와의 차이:</strong> Geth는 블록 단위 실행이라 reorg 시 전체 상태를 되돌려야 한다.
          <br />
          Reth는 Stage별 unwind()가 있어 필요한 Stage만 부분 롤백이 가능하다.<br />
          예를 들어 MerkleStage만 문제가 생기면 Execution까지만 되돌리면 된다.
        </p>
        <p className="leading-7">
          Pipeline::run()은 모든 Stage가 <code>done=true</code>를 반환할 때까지 루프를 반복한다.<br />
          한 Stage가 target까지 도달하지 못하면 다음 루프에서 같은 Stage부터 이어서 실행한다.
        </p>
      </div>

      <div className="not-prose mb-6"><StageTraitViz /></div>

      {/* Interactive trait method cards */}
      <h3 className="text-lg font-semibold mb-3">Stage trait 메서드</h3>
      <div className="not-prose space-y-2 mb-6">
        {STAGE_METHODS.map((m, i) => (
          <motion.div key={i} onClick={() => setActive(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === active ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === active ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${i === active ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>{m.method}</span>
              <span className="text-sm font-medium">{m.desc}</span>
            </div>
            <AnimatePresence>
              {i === active && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-1 leading-relaxed">{m.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('pipeline-run', codeRefs['pipeline-run'])} />
        <span className="text-[10px] text-muted-foreground self-center">Pipeline::run()</span>
      </div>
    </section>
  );
}
