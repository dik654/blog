import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { e1: '#6366f1', e2: '#10b981', fold: '#f59e0b', verify: '#8b5cf6' };

const STEPS = [
  { label: '초기화: 두 곡선 E1/E2 인스턴스 준비', body: 'E1(주 회로)과 E2(보조 회로)에 초기 누적 인스턴스를 설정합니다.' },
  { label: 'NIFS 폴딩: E1에서 증인 결합', body: '교차항 T 계산 → Fiat-Shamir 도전값 r → U1+r·U2 선형 결합으로 E1 폴딩.' },
  { label: 'NIFS 폴딩: E2에서 교대 실행', body: 'E2 보조 회로에서 E1 폴딩을 회로 내 재현·검증합니다. 이중 곡선 IVC.' },
  { label: 'Spartan 검증: 최종 증명 생성', body: '마지막 누적 인스턴스에 Spartan SNARK 적용. 비대화형 최종 검증.' },
];

const BW = 100, BH = 44, GY = 30;

export default function NovaFoldingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="nv-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {/* E1 box */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <rect x={20} y={GY} width={BW} height={BH} rx={7}
              fill={C.e1 + '18'} stroke={C.e1} strokeWidth={step <= 1 ? 2 : 1} />
            <text x={70} y={GY + 18} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.e1}>E1 주 회로</text>
            <text x={70} y={GY + 32} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">RelaxedR1CS</text>
          </motion.g>
          {/* E2 box */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <rect x={20} y={GY + 70} width={BW} height={BH} rx={7}
              fill={C.e2 + '18'} stroke={C.e2} strokeWidth={step === 2 ? 2 : 1} />
            <text x={70} y={GY + 88} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.e2}>E2 보조 회로</text>
            <text x={70} y={GY + 102} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">검증 재현</text>
          </motion.g>
          {/* Fold E1 */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
              <line x1={120} y1={GY + BH / 2} x2={155} y2={GY + BH / 2}
                stroke={C.fold} strokeWidth={1.2} markerEnd="url(#nv-a)" />
              <rect x={160} y={GY} width={90} height={BH} rx={7}
                fill={C.fold + '18'} stroke={C.fold} strokeWidth={step === 1 ? 2 : 1} />
              <text x={205} y={GY + 18} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fold}>NIFS 폴딩</text>
              <text x={205} y={GY + 32} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">T, r, 결합</text>
            </motion.g>
          )}
          {/* Cross-curve arrow */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <path d="M 205 74 Q 205 95 160 107 L 120 107"
                fill="none" stroke={C.e2} strokeWidth={1} strokeDasharray="4 2" />
              <line x1={120} y1={GY + 70 + BH / 2} x2={155} y2={GY + 70 + BH / 2}
                stroke={C.e2} strokeWidth={1.2} markerEnd="url(#nv-a)" />
              <rect x={160} y={GY + 70} width={90} height={BH} rx={7}
                fill={C.e2 + '18'} stroke={C.e2} strokeWidth={1.5} />
              <text x={205} y={GY + 88} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.e2}>E2 폴딩</text>
              <text x={205} y={GY + 102} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">교대 검증</text>
            </motion.g>
          )}
          {/* Spartan */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
              <line x1={250} y1={GY + 50} x2={290} y2={GY + 50}
                stroke={C.verify} strokeWidth={1.2} markerEnd="url(#nv-a)" />
              <rect x={295} y={GY + 28} width={100} height={BH} rx={7}
                fill={C.verify + '18'} stroke={C.verify} strokeWidth={1.5} />
              <text x={345} y={GY + 46} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.verify}>Spartan</text>
              <text x={345} y={GY + 60} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">최종 검증</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
