import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'TCP+TLS 스택', body: 'TCP는 바이트 스트림, TLS는 별도 핸드셰이크. 3-way + TLS = 최소 2~3 RTT.' },
  { label: 'QUIC 스택', body: 'QUIC는 UDP 위에 전송+암호화를 통합. 1-RTT 핸드셰이크, 스트림 멀티플렉싱 내장.' },
  { label: 'HOL Blocking 비교', body: 'TCP: 패킷 1개 손실 → 전체 차단. QUIC: 해당 스트림만 차단, 나머지 정상.' },
];

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const C = { tcp: '#ef4444', tls: '#f59e0b', quic: '#0ea5e9', udp: '#6366f1' };

export default function QUICStackViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* TCP stack */}
          <motion.g animate={{ opacity: step === 1 ? 0.15 : 1, x: step === 2 ? -10 : 0 }} transition={sp}>
            <text x={80} y={16} textAnchor="middle" fontSize={10} fontWeight={600}
              fill="var(--foreground)">TCP + TLS</text>
            {[
              { y: 24, h: 28, label: 'Application', c: '#64748b' },
              { y: 56, h: 28, label: 'TLS 1.3', c: C.tls },
              { y: 88, h: 28, label: 'TCP', c: C.tcp },
              { y: 120, h: 28, label: 'IP', c: '#6b7280' },
            ].map((l) => (
              <g key={l.label}>
                <rect x={10} y={l.y} width={140} height={l.h} rx={4}
                  fill={l.c + '12'} stroke={l.c} strokeWidth={1.3} />
                <text x={80} y={l.y + l.h / 2 + 4} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={l.c}>{l.label}</text>
              </g>
            ))}
          </motion.g>
          {/* QUIC stack */}
          <motion.g animate={{ opacity: step === 0 ? 0.15 : 1, x: step === 2 ? 10 : 0 }} transition={sp}>
            <text x={340} y={16} textAnchor="middle" fontSize={10} fontWeight={600}
              fill="var(--foreground)">QUIC</text>
            {[
              { y: 24, h: 28, label: 'Application', c: '#64748b' },
              { y: 56, h: 60, label: 'QUIC (TLS + Stream + Flow)', c: C.quic },
              { y: 120, h: 28, label: 'UDP', c: C.udp },
            ].map((l) => (
              <g key={l.label}>
                <rect x={250} y={l.y} width={180} height={l.h} rx={4}
                  fill={l.c + '12'} stroke={l.c} strokeWidth={1.3} />
                <text x={340} y={l.y + l.h / 2 + 4} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={l.c}>{l.label}</text>
              </g>
            ))}
          </motion.g>
          {/* HOL blocking indicator */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={10} y={158} width={140} height={14} rx={3} fill={C.tcp + '18'} stroke={C.tcp} strokeWidth={1} />
              <text x={80} y={168} textAnchor="middle" fontSize={10} fill={C.tcp}>전체 차단</text>
              <rect x={250} y={158} width={180} height={14} rx={3} fill={C.quic + '18'} stroke={C.quic} strokeWidth={1} />
              <text x={340} y={168} textAnchor="middle" fontSize={10} fill={C.quic}>스트림별 독립</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
