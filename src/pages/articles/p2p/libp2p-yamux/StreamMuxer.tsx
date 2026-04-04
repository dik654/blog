import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';
import { POLL_STEPS } from './StreamMuxerData';

export default function StreamMuxer({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  const step = POLL_STEPS[active];

  return (
    <section id="stream-muxer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StreamMuxer 구현</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Yamux <code>Muxer</code>는 libp2p의 <strong>StreamMuxer</strong> 트레이트를 구현한다.<br />
          세 가지 poll 메서드가 핵심이다.<br />
          각각 인바운드 수신, 아웃바운드 생성, 이벤트 루프를 담당한다.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <div className="flex gap-1.5 mb-4">
          {POLL_STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setActive(i)}
              className="text-xs font-mono px-3 py-1.5 rounded-md transition-colors"
              style={{
                background: active === i ? s.color + '20' : 'transparent',
                color: active === i ? s.color : 'inherit',
                border: `1px solid ${active === i ? s.color + '60' : 'transparent'}`,
              }}>
              {s.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}>
            <p className="text-sm font-semibold mb-2" style={{ color: step.color }}>
              {step.desc}
            </p>
            <p className="text-xs text-foreground/70 mb-3">{step.detail}</p>

            <div className="flex items-center gap-1.5 mb-3">
              {step.flow.map((f, i) => (
                <motion.div key={f}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono px-2 py-1 rounded border"
                    style={{ borderColor: step.color + '40', background: step.color + '10' }}>
                    {f}
                  </span>
                  {i < step.flow.length - 1 && (
                    <span className="text-foreground/30 text-xs">&rarr;</span>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="rounded-lg border border-dashed px-3 py-2"
              style={{ borderColor: step.color + '40', background: step.color + '06' }}>
              <p className="text-[11px] text-foreground/60">
                <strong style={{ color: step.color }}>설계 판단:</strong> {step.why}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('yamux-muxer', codeRefs['yamux-muxer'])} />
          <span className="text-[10px] text-muted-foreground self-center">StreamMuxer 전체 구현</span>
        </div>
      )}
    </section>
  );
}
