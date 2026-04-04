import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';
import { HB_PHASES } from './HeartbeatData';

export default function Heartbeat({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  const phase = HB_PHASES[active];

  return (
    <section id="heartbeat" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">heartbeat() 유지보수</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <code>heartbeat()</code>는 주기적으로(기본 1초) 실행되어 메시를 건강하게 유지한다.<br />
          정리 &rarr; 페널티 &rarr; 메시 리밸런싱 &rarr; 팬아웃 &rarr; gossip 전파.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {HB_PHASES.map((p, i) => (
            <button key={p.id} onClick={() => setActive(i)}
              className="text-xs font-mono px-3 py-1.5 rounded-md transition-colors"
              style={{
                background: active === i ? p.color + '20' : 'transparent',
                color: active === i ? p.color : 'inherit',
                border: `1px solid ${active === i ? p.color + '60' : 'transparent'}`,
              }}>
              {p.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={phase.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}>
            <div className="flex flex-col gap-2">
              {phase.items.map((item, i) => (
                <motion.div key={item.action}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 rounded-lg border px-3 py-2"
                  style={{ borderColor: item.color + '30', background: item.color + '06' }}>
                  <span className="text-[11px] font-mono font-bold shrink-0"
                    style={{ color: item.color }}>{item.action}</span>
                  <span className="text-xs text-foreground/60">{item.desc}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('gossipsub-heartbeat', codeRefs['gossipsub-heartbeat'])} />
          <span className="text-[10px] text-muted-foreground self-center">heartbeat() 구현</span>
        </div>
      )}
    </section>
  );
}
