import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  { id: 'tcp', label: 'TCP Handshake', color: '#ef4444', dur: '1 RTT' },
  { id: 'ms1', label: 'multistream-select', color: '#6366f1', dur: '1 RTT' },
  { id: 'noise', label: 'Noise XX', color: '#10b981', dur: '3 RTT' },
  { id: 'ms2', label: 'multistream-select', color: '#6366f1', dur: '1 RTT' },
  { id: 'yamux', label: 'Yamux Session', color: '#f59e0b', dur: '0 RTT' },
  { id: 'proto', label: 'Protocol Negotiation', color: '#8b5cf6', dur: '1 RTT' },
];

const QUIC_STAGES = [
  { id: 'quic', label: 'QUIC + TLS 1.3', color: '#06b6d4', dur: '1 RTT' },
  { id: 'proto', label: 'Protocol Negotiation', color: '#8b5cf6', dur: '1 RTT' },
];

export default function TransportUpgradeViz() {
  const [mode, setMode] = useState<'tcp' | 'quic'>('tcp');
  const stages = mode === 'tcp' ? STAGES : QUIC_STAGES;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-xs font-mono text-foreground/50 flex-1">연결 설정 과정 비교</p>
        {(['tcp', 'quic'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className="text-[10px] font-mono px-2.5 py-1 rounded-md border transition-all cursor-pointer"
            style={{
              borderColor: mode === m ? (m === 'tcp' ? '#ef4444' : '#06b6d4') : 'transparent',
              background: mode === m ? (m === 'tcp' ? '#ef444415' : '#06b6d415') : 'transparent',
              color: mode === m ? (m === 'tcp' ? '#ef4444' : '#06b6d4') : undefined,
            }}>
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} className="flex items-center gap-1.5 flex-wrap">
          {stages.map((s, i) => (
            <div key={s.id + i} className="flex items-center gap-1.5">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-lg border px-3 py-2 text-center"
                style={{ borderColor: s.color + '50', background: s.color + '10' }}>
                <p className="text-[10px] font-mono font-bold" style={{ color: s.color }}>
                  {s.label}
                </p>
                <p className="text-[9px] text-foreground/40 mt-0.5">{s.dur}</p>
              </motion.div>
              {i < stages.length - 1 && (
                <span className="text-foreground/25 text-xs">→</span>
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <p className="text-[10px] text-foreground/40 font-mono">
        총 RTT: {mode === 'tcp' ? '~7 RTT (TCP+Noise+Yamux)' : '~2 RTT (QUIC 내장)'}
      </p>
    </div>
  );
}
