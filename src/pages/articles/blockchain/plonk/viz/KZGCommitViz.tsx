import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { srs: '#6366f1', cm: '#10b981', open: '#f59e0b', vfy: '#8b5cf6' };

const STEPS = [
  { label: 'Universal Setup -- SRS', body: 'MPC 세레모니로 비밀 tau를 생성하고, tau의 거듭제곱을 타원곡선 점으로 인코딩. 1회 생성 후 재사용.' },
  { label: 'Commit -- 다항식을 G1 점으로', body: 'f(x)의 계수와 SRS를 MSM으로 결합하여 G1 점 하나(64바이트)로 압축. tau를 모르지만 계산 가능.' },
  { label: 'Open -- 인수정리로 증명', body: 'f(z)=y를 증명하려면 q(x)=(f(x)-y)/(x-z)를 계산. 인수정리에 의해 q가 존재하면 f(z)=y 참.' },
  { label: 'Verify -- 페어링 2회 O(1)', body: 'e([f]-y*G1, G2) = e([q], [tau]-z*G2). 페어링 2회로 회로 크기와 무관하게 상수 시간 검증.' },
];

const NODES = [
  { id: 'tau', label: 'tau', sub: 'secret', x: 20, y: 20, w: 60, h: 30, color: C.srs },
  { id: 'srs', label: 'SRS', sub: '[tau^i]', x: 20, y: 75, w: 60, h: 30, color: C.srs },
  { id: 'fx', label: 'f(x)', sub: 'polynomial', x: 120, y: 20, w: 70, h: 30, color: C.cm },
  { id: 'commit', label: '[f(tau)]', sub: 'G1 64B', x: 120, y: 75, w: 70, h: 30, color: C.cm },
  { id: 'open', label: 'q(x)', sub: '(f-y)/(x-z)', x: 240, y: 20, w: 80, h: 30, color: C.open },
  { id: 'verify', label: 'Pairing', sub: 'e(.,.) O(1)', x: 240, y: 75, w: 80, h: 30, color: C.vfy },
  { id: 'result', label: 'Accept', sub: '', x: 370, y: 50, w: 70, h: 30, color: '#22c55e' },
];

const stepMap: Record<number, number[]> = { 0: [0, 1], 1: [2, 3], 2: [4], 3: [5, 6] };

export default function KZGCommitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 470 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const activeNodes = [...Array(step + 1)].flatMap((_, s) => stepMap[s] || []);
            const active = activeNodes.includes(i);
            const glow = (stepMap[step] || []).includes(i);
            return (
              <g key={n.id}>
                <motion.rect x={n.x} y={n.y} width={n.w} height={n.h} rx={5}
                  initial={{ opacity: 0.1 }}
                  animate={{
                    opacity: active ? 1 : 0.15,
                    fill: active ? `${n.color}18` : `${n.color}06`,
                    stroke: n.color,
                    strokeWidth: glow ? 2 : 0.5,
                  }}
                  transition={sp} />
                <text x={n.x + n.w / 2} y={n.y + 13} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}
                  opacity={active ? 1 : 0.2}>{n.label}</text>
                {n.sub && (
                  <text x={n.x + n.w / 2} y={n.y + 24} textAnchor="middle"
                    fontSize={8} fill={n.color}
                    opacity={active ? 0.6 : 0.1}>{n.sub}</text>
                )}
              </g>
            );
          })}
          {/* tau -> SRS */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 0.5 : 0.05 }} transition={sp}>
            <line x1={50} y1={50} x2={50} y2={74} stroke={C.srs} strokeWidth={0.8} />
            <polygon points="47,72 53,72 50,76" fill={C.srs} />
          </motion.g>
          {/* f(x) -> commit */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 0.5 : 0.05 }} transition={sp}>
            <line x1={155} y1={50} x2={155} y2={74} stroke={C.cm} strokeWidth={0.8} />
            <polygon points="152,72 158,72 155,76" fill={C.cm} />
          </motion.g>
          {/* SRS -> commit */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 0.5 : 0.05 }} transition={sp}>
            <line x1={80} y1={90} x2={119} y2={90} stroke={C.cm} strokeWidth={0.8} />
            <polygon points="117,87 117,93 121,90" fill={C.cm} />
          </motion.g>
          {/* commit -> open */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 0.5 : 0.05 }} transition={sp}>
            <line x1={190} y1={82} x2={239} y2={42} stroke={C.open} strokeWidth={0.8} />
            <polygon points="237,39 237,46 241,42" fill={C.open} />
          </motion.g>
          {/* open -> verify, commit -> verify */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 3 ? 0.5 : 0.05 }} transition={sp}>
            <line x1={280} y1={50} x2={280} y2={74} stroke={C.vfy} strokeWidth={0.8} />
            <polygon points="277,72 283,72 280,76" fill={C.vfy} />
            <line x1={190} y1={95} x2={239} y2={90} stroke={C.vfy} strokeWidth={0.8} />
            <polygon points="237,87 237,93 241,90" fill={C.vfy} />
          </motion.g>
          {/* verify -> accept */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 3 ? 0.5 : 0.05 }} transition={sp}>
            <line x1={320} y1={90} x2={369} y2={70} stroke="#22c55e" strokeWidth={0.8} />
            <polygon points="367,67 367,73 371,70" fill="#22c55e" />
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
