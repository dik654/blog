import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'TCP: 단일 바이트 스트림', body: 'TCP는 하나의 연결에 하나의 순서 보장 스트림만 제공합니다. 패킷 손실 시 전체 차단.' },
  { label: 'QUIC: 독립 스트림', body: '하나의 QUIC 연결에 여러 스트림. 각 스트림은 독립적 순서 보장.' },
  { label: '패킷 손실 시 차이', body: 'Stream 2에서 패킷 손실 발생. TCP: 전체 차단. QUIC: Stream 2만 대기, 나머지 정상.' },
];

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const C = { s1: '#6366f1', s2: '#10b981', s3: '#f59e0b', tcp: '#ef4444' };

export default function StreamMuxViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={40} y={50} width={340} height={30} rx={5}
                fill={C.tcp + '12'} stroke={C.tcp} strokeWidth={1.3} />
              <text x={210} y={69} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.tcp}>
                TCP: 단일 바이트 스트림
              </text>
              {[0, 1, 2, 3, 4].map(i => (
                <motion.rect key={i} x={60 + i * 64} y={90} width={48} height={16} rx={3}
                  fill={C.tcp + '20'} stroke={C.tcp} strokeWidth={1}
                  animate={{ y: [90, 95, 90] }}
                  transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity }} />
              ))}
              <text x={210} y={124} textAnchor="middle" fontSize={10} fill="var(--foreground)" opacity={0.5}>
                순서대로만 전달 가능
              </text>
            </motion.g>
          )}
          {(step === 1 || step === 2) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                { y: 20, c: C.s1, label: 'Stream 0' },
                { y: 65, c: C.s2, label: 'Stream 2' },
                { y: 110, c: C.s3, label: 'Stream 4' },
              ].map((s, si) => (
                <g key={si}>
                  <rect x={40} y={s.y} width={340} height={28} rx={5}
                    fill={s.c + '10'} stroke={s.c} strokeWidth={1.3}
                    strokeDasharray={step === 2 && si === 1 ? '4 3' : '0'} />
                  <text x={60} y={s.y + 18} fontSize={10} fontWeight={600} fill={s.c}>{s.label}</text>
                  {[0, 1, 2].map(pi => (
                    <motion.rect key={pi} x={140 + pi * 76} y={s.y + 6} width={52} height={16} rx={3}
                      fill={step === 2 && si === 1 && pi === 1 ? C.tcp + '30' : s.c + '20'}
                      stroke={step === 2 && si === 1 && pi === 1 ? C.tcp : s.c} strokeWidth={1}
                      animate={step === 2 && si === 1 && pi === 1
                        ? { opacity: [1, 0.3, 1] }
                        : { opacity: 1 }}
                      transition={{ duration: 0.8, repeat: step === 2 && si === 1 && pi === 1 ? Infinity : 0 }} />
                  ))}
                </g>
              ))}
              {step === 2 && (
                <motion.text x={210} y={155} textAnchor="middle" fontSize={10} fill={C.tcp}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Stream 2만 대기 — 나머지 정상 전송
                </motion.text>
              )}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
