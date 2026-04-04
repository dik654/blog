import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BodiesDetailViz from './viz/BodiesDetailViz';
import { BODY_VERIFY_ITEMS } from './BodiesStageData';

export default function BodiesStage({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>('tx_root 대조');

  return (
    <section id="bodies-stage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BodiesStage 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          HeadersStage가 저장한 헤더에는 <code>tx_root</code>(트랜잭션 머클 루트)가 포함되어 있다.<br />
          BodiesStage는 피어에게 바디를 요청한 뒤, 이 tx_root를 기준으로 무결성을 검증한다.
          <br />
          악의적 피어가 위조된 TX를 보내더라도 머클 루트가 달라지므로 즉시 탐지된다.
        </p>
        <p className="leading-7">
          바디는 <code>transactions</code>(TX 목록), <code>ommers</code>(삼촌 블록 헤더),
          <code>withdrawals</code>(Shanghai 이후 CL 인출)로 구성된다.<br />
          각각의 머클 루트를 헤더와 대조해 세 가지 무결성 검증을 수행한다.
        </p>
        <p className="leading-7">
          HeadersStage와 마찬가지로 commit_threshold 단위 배치 삽입을 사용한다.<br />
          다음 Stage인 SendersStage가 이 TX 데이터에서 sender 주소를 복구한다.
        </p>
      </div>

      <div className="not-prose mb-6"><BodiesDetailViz /></div>

      {/* Verification items */}
      <h3 className="text-lg font-semibold mb-3">무결성 검증 항목</h3>
      <div className="not-prose space-y-2 mb-6">
        {BODY_VERIFY_ITEMS.map(v => {
          const isOpen = expanded === v.label;
          return (
            <div key={v.label} className="rounded-lg border border-border/60 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : v.label)}
                className="w-full text-left px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                <p className="font-semibold text-sm">{v.label}</p>
                <span className="text-foreground/40 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-border/40 pt-3">
                      <p className="text-sm text-foreground/80 leading-relaxed">{v.desc}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('bodies-stage', codeRefs['bodies-stage'])} />
        <span className="text-[10px] text-muted-foreground self-center">BodiesStage::execute()</span>
      </div>
    </section>
  );
}
