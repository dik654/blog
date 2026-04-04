import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const PX = 70, VX = 260, MY = [26, 48, 70];
const COLORS = ['#6366f1', '#f59e0b', '#10b981'];

const ARROWS = [
  { label: 'R = k·G', dir: 'right' as const, desc: 'Commit' },
  { label: 'e = random', dir: 'left' as const, desc: 'Challenge' },
  { label: 's = k - e·sk', dir: 'right' as const, desc: 'Response' },
];

const STEPS = [
  { label: 'Prover & Verifier 준비', body: 'Prover는 sk를 보유, Verifier는 pk = sk·G를 보유합니다.' },
  { label: 'Move 1: Commit (R = k·G)', body: 'Prover가 랜덤 nonce k로 commitment R을 생성하여 Verifier에 전송합니다.' },
  { label: 'Move 2: Challenge (e)', body: 'Verifier가 랜덤 challenge e를 전송합니다. Fiat-Shamir 시 e = H(R‖pk‖m).' },
  { label: 'Move 3: Response (s)', body: 's = k - e·sk 계산. 검증: s·G + e·pk = k·G = R. ZK + Soundness 보장.' },
];

export default function SigmaProtocolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 95" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Prover & Verifier boxes */}
          <motion.rect x={PX - 30} y={6} width={60} height={18} rx={4}
            animate={{ fill: '#6366f115', stroke: '#6366f1', strokeWidth: 1.2 }} transition={sp} />
          <text x={PX} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">Prover</text>
          <motion.rect x={VX - 30} y={6} width={60} height={18} rx={4}
            animate={{ fill: '#f59e0b15', stroke: '#f59e0b', strokeWidth: 1.2 }} transition={sp} />
          <text x={VX} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">Verifier</text>
          {/* vertical dashed lines */}
          <line x1={PX} y1={26} x2={PX} y2={88} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 2" />
          <line x1={VX} y1={26} x2={VX} y2={88} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 2" />
          {/* 3-move arrows */}
          {ARROWS.map((a, i) => {
            const active = i + 1 <= step;
            const highlighted = i + 1 === step;
            const y = MY[i];
            const x1 = a.dir === 'right' ? PX + 6 : VX - 6;
            const x2 = a.dir === 'right' ? VX - 6 : PX + 6;
            return (
              <g key={i}>
                <motion.line x1={x1} y1={y} x2={x2} y2={y}
                  stroke={COLORS[i]} strokeWidth={highlighted ? 1.4 : 0.8}
                  markerEnd="url(#arrowhead)"
                  animate={{ opacity: active ? 0.8 : 0.12 }} transition={sp} />
                <motion.text x={(PX + VX) / 2} y={y - 3} textAnchor="middle"
                  fontSize={9} fontWeight={600}
                  animate={{ fill: COLORS[i], opacity: active ? 0.9 : 0.15 }} transition={sp}
                >{a.label}</motion.text>
                <motion.text x={(PX + VX) / 2} y={y + 7} textAnchor="middle"
                  fontSize={9}
                  animate={{ fill: COLORS[i], opacity: active ? 0.5 : 0.1 }} transition={sp}
                >{a.desc}</motion.text>
              </g>
            );
          })}
          {/* verify result */}
          {step === 3 && (
            <motion.text x={(PX + VX) / 2} y={86} textAnchor="middle" fontSize={9}
              fill="#10b981" fontWeight={600}
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={sp}
            >s·G + e·pk = R  ✓</motion.text>
          )}
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <path d="M0,0 L6,2 L0,4" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
