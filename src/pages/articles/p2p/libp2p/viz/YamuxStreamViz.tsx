import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STREAMS = [
  { id: 1, proto: '/ipfs/kad/1.0.0', color: '#6366f1', label: 'Kademlia' },
  { id: 2, proto: '/meshsub/1.1.0', color: '#10b981', label: 'GossipSub' },
  { id: 3, proto: '/ipfs/id/1.0.0', color: '#f59e0b', label: 'Identify' },
  { id: 4, proto: '/libp2p/autonat/1.0.0', color: '#ec4899', label: 'AutoNAT' },
];

const PHASES = [
  { label: 'TCP 연결 (1개)', desc: '단일 TCP 연결 위에 Yamux 세션 수립' },
  { label: 'Stream 1: Kademlia', desc: 'SYN 플래그로 스트림 열기 → multistream-select → DHT 쿼리' },
  { label: 'Stream 2: GossipSub', desc: '독립 스트림으로 pub/sub 메시지 전송. Stream 1과 간섭 없음' },
  { label: '4개 동시 스트림', desc: '각 스트림이 독립적 흐름 제어. WindowUpdate로 백프레셔 적용' },
];

export default function YamuxStreamViz() {
  const [step, setStep] = useState(0);
  const visible = step === 0 ? 0 : step === 3 ? 4 : step;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-mono text-foreground/50">Yamux 멀티플렉싱 — 단일 연결 위 다중 스트림</p>

      {/* TCP connection bar */}
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2">
        <p className="text-[10px] font-mono text-red-400">TCP Connection (1개)</p>
      </div>

      {/* Streams */}
      <div className="space-y-1.5 pl-4 border-l-2 border-red-500/20">
        <AnimatePresence>
          {STREAMS.slice(0, visible).map((s, i) => (
            <motion.div key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-lg border px-3 py-2 flex items-center gap-3"
              style={{ borderColor: s.color + '40', background: s.color + '08' }}>
              <span className="text-[10px] font-mono font-bold" style={{ color: s.color }}>
                Stream {s.id}
              </span>
              <span className="text-[10px] font-mono text-foreground/40">{s.proto}</span>
              <span className="text-[10px] ml-auto" style={{ color: s.color }}>{s.label}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Step controls */}
      <div className="flex gap-1.5">
        {PHASES.map((_, i) => (
          <div key={i} onClick={() => setStep(i)}
            className={`h-1 flex-1 rounded-full cursor-pointer transition-colors ${i <= step ? 'bg-primary' : 'bg-border'}`} />
        ))}
      </div>
      <p className="text-xs font-semibold text-center">{PHASES[step].label}</p>
      <p className="text-[10px] text-foreground/50 text-center">{PHASES[step].desc}</p>
    </div>
  );
}
