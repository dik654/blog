import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '디지털 서명 흐름', body: '비밀키로 서명 생성, 공개키로 검증. 메시지 위변조와 발신자 위장을 동시에 방지.' },
  { label: 'ECDSA (secp256k1)', body: 'Ethereum/Bitcoin 트랜잭션 서명. 비결정적 nonce k — k 재사용 시 비밀키 노출 위험.' },
  { label: 'EdDSA (Ed25519)', body: 'Solana/Cosmos 채택. 결정적 nonce — k = H(sk, m). 배치 검증으로 처리량 향상.' },
  { label: 'BLS (BLS12-381)', body: 'Ethereum Beacon Chain. 서명 집계 — σ_agg = Σσ_i. 검증도 1회 페어링으로 집계 가능.' },
];

const SIGS = [
  { name: 'ECDSA', x: 40, color: C1 },
  { name: 'EdDSA', x: 170, color: C2 },
  { name: 'BLS', x: 300, color: C3 },
];

export default function DigitalSigViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Sign → Verify flow */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={60} y={30} width={80} height={30} rx={5} fill={`${C1}10`} stroke={C1} strokeWidth={1} />
              <text x={100} y={49} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>Sign(sk, m)</text>
              <line x1={140} y1={45} x2={200} y2={45} stroke="var(--border)" strokeWidth={0.8} />
              <rect x={200} y={35} width={30} height={18} rx={3} fill={`${C3}12`} stroke={C3} strokeWidth={0.8} />
              <text x={215} y={48} textAnchor="middle" fontSize={10} fill={C3}>sig</text>
              <line x1={230} y1={45} x2={270} y2={45} stroke="var(--border)" strokeWidth={0.8} />
              <rect x={270} y={30} width={90} height={30} rx={5} fill={`${C2}10`} stroke={C2} strokeWidth={1} />
              <text x={315} y={49} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>Verify(pk)</text>
              <text x={210} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                비밀키 서명 → 공개키 검증
              </text>
            </motion.g>
          )}
          {/* Individual scheme cards */}
          {step >= 1 && SIGS.map((s, i) => {
            const active = step === i + 1;
            return (
              <motion.g key={s.name} animate={{ opacity: active ? 1 : 0.2 }}
                transition={{ duration: 0.3 }}>
                <rect x={s.x} y={20} width={110} height={90} rx={6}
                  fill={`${s.color}${active ? '10' : '05'}`}
                  stroke={s.color} strokeWidth={active ? 1.2 : 0.5} />
                <text x={s.x + 55} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill={s.color}>
                  {s.name}
                </text>
                {active && s.name === 'ECDSA' && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <text x={s.x + 55} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">secp256k1</text>
                    <text x={s.x + 55} y={72} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">sig: 64B, pk: 33B</text>
                    <text x={s.x + 55} y={86} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">비결정적 nonce</text>
                    <text x={s.x + 55} y={100} textAnchor="middle" fontSize={10} fill={s.color}>ETH, BTC</text>
                  </motion.g>
                )}
                {active && s.name === 'EdDSA' && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <text x={s.x + 55} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Ed25519</text>
                    <text x={s.x + 55} y={72} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">sig: 64B, pk: 32B</text>
                    <text x={s.x + 55} y={86} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">결정적, 배치 검증</text>
                    <text x={s.x + 55} y={100} textAnchor="middle" fontSize={10} fill={s.color}>SOL, ATOM</text>
                  </motion.g>
                )}
                {active && s.name === 'BLS' && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <text x={s.x + 55} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">BLS12-381</text>
                    <text x={s.x + 55} y={72} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">sig: 48B, pk: 96B</text>
                    <text x={s.x + 55} y={86} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">서명 집계 가능</text>
                    <text x={s.x + 55} y={100} textAnchor="middle" fontSize={10} fill={s.color}>ETH Beacon</text>
                  </motion.g>
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
