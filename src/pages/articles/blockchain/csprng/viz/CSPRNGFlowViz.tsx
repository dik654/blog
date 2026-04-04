import { motion, type ReactNode } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { src: '#f59e0b', pool: '#6366f1', out: '#10b981' };

const STEPS = [
  { label: 'PRNG vs CSPRNG', body: 'CSPRNG는 이전 출력을 관찰해도 다음 값 예측 불가.' },
  { label: '① 엔트로피 수집', body: '키보드·마우스·디스크 I/O·RDRAND 등 물리적 무작위성 수집.' },
  { label: '② 엔트로피 풀 → CSPRNG', body: 'OS가 엔트로피 풀에서 시드를 받아 암호학적 난수열 생성.' },
  { label: '③ 암호 프로토콜에 공급', body: '모든 비밀값(Schnorr r, TLS키, 지갑키)이 CSPRNG에서 생성.' },
];

const BX = [60, 190, 340], BW = 100, BY = 30, BH = 50;

export default function CSPRNGFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* 3 boxes */}
          {[
            { x: BX[0], label: '엔트로피 소스', sub: '키보드·마우스·HW', color: C.src },
            { x: BX[1], label: '엔트로피 풀', sub: '/dev/urandom', color: C.pool },
            { x: BX[2], label: 'CSPRNG 출력', sub: '예측 불가능한 난수열', color: C.out },
          ].map((b, i) => (
            <motion.g key={i} animate={{ opacity: step === 0 || step === i + 1 ? 1 : 0.3 }}>
              <rect x={b.x} y={BY} width={BW} height={BH} rx={6}
                fill={`${b.color}12`} stroke={b.color}
                strokeWidth={step === i + 1 ? 1.5 : 0.8} />
              <text x={b.x + BW / 2} y={BY + 20} textAnchor="middle"
                fontSize={10} fontWeight={600} fill={b.color}>{b.label}</text>
              <text x={b.x + BW / 2} y={BY + 35} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">{b.sub}</text>
            </motion.g>
          ))}
          {/* Arrows between boxes */}
          {[
            { x1: BX[0] + BW, x2: BX[1], color: C.src },
            { x1: BX[1] + BW, x2: BX[2], color: C.pool },
          ].map((a, i) => (
            <motion.g key={i} animate={{ opacity: step === 0 || step >= i + 2 ? 0.8 : 0.15 }}>
              <line x1={a.x1 + 4} y1={BY + BH / 2} x2={a.x2 - 4} y2={BY + BH / 2}
                stroke={a.color} strokeWidth={1} />
              <polygon points={`${a.x2 - 4},${BY + BH / 2 - 3} ${a.x2},${BY + BH / 2} ${a.x2 - 4},${BY + BH / 2 + 3}`}
                fill={a.color} />
            </motion.g>
          ))}
          {/* PRNG vs CSPRNG comparison */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={100} y={BY + BH + 16} width={120} height={22} rx={4}
                fill="#ef444415" stroke="#ef4444" strokeWidth={0.8} />
              <text x={160} y={BY + BH + 31} textAnchor="middle"
                fontSize={9} fontWeight={500} fill="#ef4444">PRNG — 예측 가능</text>
              <rect x={240} y={BY + BH + 16} width={120} height={22} rx={4}
                fill={`${C.out}15`} stroke={C.out} strokeWidth={0.8} />
              <text x={300} y={BY + BH + 31} textAnchor="middle"
                fontSize={9} fontWeight={500} fill={C.out}>CSPRNG — 예측 불가</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
