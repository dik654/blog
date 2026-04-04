import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  '해시 함수 내부 구조 — 두 가지 주요 구성법',
  'Merkle-Damgard — 블록 단위 순차 압축 (SHA-256)',
  'Sponge — 흡수(absorb) + 압출(squeeze) (SHA-3)',
  '보안 비교 — 길이 확장 vs rate/capacity',
];

export default function ConstructionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Merkle-Damgard */}
          <motion.g animate={{ opacity: step <= 1 || step === 3 ? 1 : 0.15 }}>
            <text x={20} y={20} fontSize={12} fontWeight={600} fill={C1}>Merkle-Damgard</text>
            <rect x={20} y={35} width={40} height={28} rx={4} fill={`${C1}10`} stroke={C1} strokeWidth={1} />
            <text x={40} y={53} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>IV</text>
            {[0, 1, 2].map(i => (
              <g key={i}>
                <line x1={60 + i * 90} y1={49} x2={80 + i * 90} y2={49} stroke={C1} strokeWidth={0.8} />
                <polygon points={`${78 + i * 90},46 ${84 + i * 90},49 ${78 + i * 90},52`} fill={C1} />
                <rect x={85 + i * 90} y={35} width={45} height={28} rx={5}
                  fill={step === 1 ? `${C1}15` : `${C1}08`} stroke={C1} strokeWidth={1} />
                <text x={107 + i * 90} y={53} textAnchor="middle" fontSize={11} fontWeight={500} fill={C1}>f</text>
                <text x={107 + i * 90} y={30} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">m{i + 1}</text>
                <line x1={107 + i * 90} y1={32} x2={107 + i * 90} y2={35}
                  stroke="var(--border)" strokeWidth={0.5} />
              </g>
            ))}
            <line x1={310} y1={49} x2={330} y2={49} stroke={C1} strokeWidth={0.8} />
            <rect x={332} y={37} width={50} height={24} rx={4} fill={`${C1}15`} stroke={C1} strokeWidth={1} />
            <text x={357} y={53} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>hash</text>
          </motion.g>

          {/* Sponge */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.15 }}>
            <text x={20} y={110} fontSize={12} fontWeight={600} fill={C2}>Sponge (SHA-3)</text>
            <rect x={20} y={125} width={360} height={70} rx={6} fill={`${C2}05`} stroke={C2} strokeWidth={0.8} />
            <rect x={28} y={132} width={344} height={25} rx={4} fill={`${C2}10`} stroke={C2} strokeWidth={0.6} />
            <text x={200} y={149} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>rate (r) — 입출력 영역</text>
            <rect x={28} y={162} width={344} height={25} rx={4} fill={`${C3}08`} stroke={C3} strokeWidth={0.6} />
            <text x={200} y={179} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>capacity (c) — 보안 영역</text>
            {['absorb', 'absorb', 'squeeze'].map((l, i) => (
              <g key={i}>
                <line x1={90 + i * 120} y1={118} x2={90 + i * 120} y2={132}
                  stroke={l === 'absorb' ? C2 : C1} strokeWidth={0.8} />
                <text x={90 + i * 120} y={114} textAnchor="middle" fontSize={9} fontWeight={500}
                  fill={l === 'absorb' ? C2 : C1}>{l === 'absorb' ? `absorb ${i + 1}` : 'squeeze'}</text>
              </g>
            ))}
          </motion.g>

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={225} fontSize={9} fill={C1}>
                Merkle-Damgard — 길이 확장 공격에 취약 (HMAC으로 완화)
              </text>
              <text x={20} y={245} fontSize={9} fill={C2}>
                Sponge — capacity가 클수록 안전. 보안: min(2^(c/2), 2^n)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
