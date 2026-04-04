import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';
import { TOPIC_PARAMS, THRESHOLDS } from './PeerScoringData';

export default function PeerScoring({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const [showThresh, setShowThresh] = useState(false);

  return (
    <section id="peer-scoring" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">피어 스코어링</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          GossipSub는 각 피어에게 <strong>실시간 점수</strong>를 매긴다.<br />
          토픽별 파라미터(P1~P4) + 앱 레벨 스코어를 합산한다.<br />
          음수 임계치 이하면 메시에서 제거하고, 심하면 연결 자체를 끊는다.
        </p>
      </div>

      {/* 토픽 파라미터 */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-4">토픽별 스코어 파라미터</p>
        <div className="flex flex-col gap-2">
          {TOPIC_PARAMS.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-lg border p-3"
              style={{ borderColor: p.color + '40', background: p.color + '06' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold" style={{ color: p.color }}>
                  {p.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
                  style={{
                    background: p.sign === '+' ? '#10b98120' : '#ef444420',
                    color: p.sign === '+' ? '#10b981' : '#ef4444',
                  }}>{p.sign}</span>
              </div>
              <p className="text-xs text-foreground/70 mb-0.5">{p.desc}</p>
              <p className="text-[11px] text-foreground/50">{p.why}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 임계치 토글 */}
      <div className="rounded-xl border border-border bg-card p-5">
        <button onClick={() => setShowThresh(v => !v)}
          className="text-xs font-mono text-foreground/70 hover:text-foreground transition-colors">
          {showThresh ? '[-]' : '[+]'} 스코어 임계치 (3단계)
        </button>
        <AnimatePresence>
          {showThresh && (
            <motion.div initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="flex flex-col gap-2 mt-3">
                {THRESHOLDS.map((t, i) => (
                  <motion.div key={t.name} initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2"
                    style={{ borderColor: t.color + '30', background: t.color + '08' }}>
                    <span className="text-xs font-mono font-bold w-40 shrink-0"
                      style={{ color: t.color }}>{t.name}</span>
                    <span className="text-xs font-mono" style={{ color: t.color }}>{t.value}</span>
                    <span className="text-xs text-foreground/60">{t.effect}</span>
                  </motion.div>
                ))}
              </div>
              <p className="text-[11px] text-foreground/50 mt-3">
                graylistThreshold 이하이면 해당 피어의 모든 RPC를 무시한다.<br />
                이 다단계 차단이 Sybil/Eclipse 공격 피해를 제한한다.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('gossipsub-handle-msg', codeRefs['gossipsub-handle-msg'])} />
          <span className="text-[10px] text-muted-foreground self-center">메시지 수신 + 스코어 적용</span>
        </div>
      )}
    </section>
  );
}
