import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const CHAIN = [
  { label: 'App Code', sub: 'MRENCLAVE', color: '#f59e0b', x: 20 },
  { label: 'Quoting Enclave', sub: 'Quote 서명', color: '#0ea5e9', x: 140 },
  { label: 'Platform', sub: 'HW 인증서', color: '#8b5cf6', x: 270 },
  { label: 'Verifier', sub: 'CA 검증', color: '#10b981', x: 390 },
];

const STEPS = [
  { label: '앱이 자체 측정값(MRENCLAVE) 포함 Report 생성' },
  { label: 'Quoting Enclave가 Report → Quote로 서명' },
  { label: '플랫폼 인증서를 Quote에 첨부' },
  { label: '검증자가 제조사 CA로 전체 체인 확인' },
];
const BODY = [
  'SHA-256(code+data) → 코드 무결성 지문',
  '프로비저닝 키로 EPID/ECDSA 서명',
  'TCB 버전, 펌웨어 해시 포함',
  'Intel IAS / AMD KDS 인증서 체인 검증',
];
const sp = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };

export default function AttestChainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>

          {CHAIN.map((c, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <g key={i}>
                {/* Connector */}
                {i > 0 && (
                  <motion.line x1={CHAIN[i - 1].x + 100} y1={45} x2={c.x} y2={45}
                    stroke={done || active ? c.color : 'var(--border)'}
                    strokeWidth={done || active ? 1.5 : 0.8}
                    markerEnd={done || active ? `url(#ac-${i})` : undefined}
                    animate={{ opacity: done || active ? 1 : 0.2 }} transition={sp} />
                )}
                {/* Node */}
                <motion.rect x={c.x} y={25} width={100} height={40} rx={6}
                  animate={{
                    fill: `${c.color}${active ? '20' : '08'}`,
                    stroke: c.color, strokeWidth: active ? 1.5 : 0.8,
                    opacity: done ? 0.5 : active ? 1 : 0.25,
                  }} transition={sp} />
                <text x={c.x + 50} y={42} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={c.color}>{c.label}</text>
                <text x={c.x + 50} y={56} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{c.sub}</text>
              </g>
            );
          })}

          {/* Animated ball */}
          <motion.circle r={6} fill={CHAIN[step].color}
            animate={{ cx: CHAIN[step].x + 50, cy: 45 }}
            transition={{ type: 'spring', bounce: 0.25 }}
            style={{ filter: `drop-shadow(0 0 4px ${CHAIN[step].color}88)` }} />

          {/* Arrow markers */}
          <defs>
            {CHAIN.slice(1).map((c, i) => (
              <marker key={i} id={`ac-${i + 1}`} markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill={c.color} />
              </marker>
            ))}
          </defs>

          <motion.text x={20} y={100} fontSize={10} fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
