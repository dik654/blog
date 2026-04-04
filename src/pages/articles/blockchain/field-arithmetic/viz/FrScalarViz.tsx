import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const STEPS = [
  { label: '두 개의 254-bit 체: Fp vs Fr', body: 'BN254는 좌표용 Fp와 스칼라용 Fr 두 소수체를 사용합니다. 소수가 다릅니다.' },
  { label: 'Fp: 타원곡선 좌표', body: 'G1 점 (x,y)의 좌표가 Fp 원소. G2 좌표는 Fp2 = Fp의 이차 확장.' },
  { label: 'Fr: 스칼라 연산', body: 'k·G1, k·G2의 계수 k가 Fr 원소. ZK 회로의 모든 값도 Fr.' },
  { label: '페어링에서의 역할', body: 'e(G1, G2) → GT ⊂ Fp12. 스칼라 k ∈ Fr로 e(kP, Q) = e(P, Q)^k.' },
];

const FP = '#6366f1', FR = '#10b981', GT = '#f59e0b';

export default function FrScalarViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Fp box */}
          <motion.rect x={20} y={15} width={120} height={50} rx={6}
            animate={{ fill: step === 1 ? `${FP}20` : `${FP}0a`, stroke: FP,
              strokeWidth: step === 1 ? 1.8 : 0.7 }} transition={sp} />
          <text x={80} y={30} textAnchor="middle" fontSize={9} fontWeight={600} fill={FP}>Fp</text>
          <text x={80} y={40} textAnchor="middle" fontSize={9} fill={`${FP}99`}>254-bit 좌표체</text>
          <motion.text x={80} y={52} textAnchor="middle" fontSize={9} fill={`${FP}77`}
            animate={{ opacity: step >= 1 ? 1 : 0.3 }} transition={sp}>
            G1 점 (x, y) ∈ Fp²
          </motion.text>
          {/* Fr box */}
          <motion.rect x={200} y={15} width={120} height={50} rx={6}
            animate={{ fill: step === 2 ? `${FR}20` : `${FR}0a`, stroke: FR,
              strokeWidth: step === 2 ? 1.8 : 0.7 }} transition={sp} />
          <text x={260} y={30} textAnchor="middle" fontSize={9} fontWeight={600} fill={FR}>Fr</text>
          <text x={260} y={40} textAnchor="middle" fontSize={9} fill={`${FR}99`}>254-bit 스칼라체</text>
          <motion.text x={260} y={52} textAnchor="middle" fontSize={9} fill={`${FR}77`}
            animate={{ opacity: step >= 2 ? 1 : 0.3 }} transition={sp}>
            k · G1 → G1, 회로 값
          </motion.text>
          {/* Connecting usage arrows */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={sp}>
              <line x1={200} y1={40} x2={142} y2={40} stroke={FR} strokeWidth={0.7} strokeDasharray="3 2" />
              <rect x={159} y={31} width={22} height={8} rx={2} fill="var(--card)" />
              <text x={170} y={37} textAnchor="middle" fontSize={9} fill={FR}>k ∈ Fr</text>
            </motion.g>
          )}
          {/* Pairing diagram */}
          <motion.g animate={{ opacity: step === 3 ? 1 : 0.15 }} transition={sp}>
            {/* G1 */}
            <rect x={30} y={78} width={60} height={24} rx={4} fill={`${FP}12`} stroke={FP} strokeWidth={0.7} />
            <text x={60} y={93} textAnchor="middle" fontSize={9} fontWeight={600} fill={FP}>G1</text>
            {/* x symbol */}
            <text x={105} y={93} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">×</text>
            {/* G2 */}
            <rect x={120} y={78} width={60} height={24} rx={4} fill={`${FR}12`} stroke={FR} strokeWidth={0.7} />
            <text x={150} y={93} textAnchor="middle" fontSize={9} fontWeight={600} fill={FR}>G2</text>
            {/* arrow */}
            <line x1={182} y1={90} x2={215} y2={90} stroke={GT} strokeWidth={0.8} markerEnd="url(#frarr)" />
            <rect x={190} y={80} width={16} height={8} rx={2} fill="var(--card)" />
            <text x={198} y={86} textAnchor="middle" fontSize={9} fill={GT}>e( )</text>
            {/* GT */}
            <rect x={218} y={78} width={80} height={24} rx={4} fill={`${GT}12`} stroke={GT} strokeWidth={0.7} />
            <text x={258} y={93} textAnchor="middle" fontSize={9} fontWeight={600} fill={GT}>GT ⊂ Fp12</text>
          </motion.g>
          {step === 3 && (
            <motion.text x={170} y={115} textAnchor="middle" fontSize={9} fill={GT}
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp}>
              e(kP, Q) = e(P, Q)^k  — 쌍선형성
            </motion.text>
          )}
          <defs>
            <marker id="frarr" markerWidth={6} markerHeight={4} refX={5} refY={2} orient="auto">
              <path d="M0,0 L6,2 L0,4" fill={GT} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
