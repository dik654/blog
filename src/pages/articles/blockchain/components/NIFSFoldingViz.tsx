import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b'];

const STEPS = [
  { label: '① 입력: 누적 U1/W1 + 현재 U2/W2', body: '이전 스텝까지 누적된 RelaxedR1CS(U1,W1)과 이번 스텝 R1CS(U2,W2)를 준비합니다.' },
  { label: '② 교차항 T 계산 및 커밋', body: 'T = A·W1⊗B·W2 + A·W2⊗B·W1 − u1·C·W2 − u2·C·W1. 랜덤 r_T로 KZG 커밋합니다.' },
  { label: '③ Fiat-Shamir 도전값 r 샘플링', body: 'RO에 pp_digest, U2, comm_T를 흡수한 뒤 도전값 r을 squeeze합니다.' },
  { label: '④ 선형 폴딩 → 새 누적 인스턴스', body: "u'=u1+r, X'=X1+r·X2, W'=W1+r·W2, E'=E1+r·T+r²·E2로 결합합니다." },
];

const BX = [40, 180, 320], BW = 120, BH = 44;

export default function NIFSFoldingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="nf-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {/* U1 box */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <rect x={BX[0]} y={20} width={BW} height={BH} rx={7}
              fill={C[0] + '18'} stroke={C[0]} strokeWidth={step === 0 ? 2 : 1} />
            <text x={BX[0] + BW / 2} y={37} textAnchor="middle" fontSize={9} fontWeight={600} fill={C[0]}>U1 / W1</text>
            <text x={BX[0] + BW / 2} y={52} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">누적 인스턴스</text>
          </motion.g>
          {/* U2 box */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <rect x={BX[0]} y={80} width={BW} height={BH} rx={7}
              fill={C[0] + '18'} stroke={C[0]} strokeWidth={step === 0 ? 2 : 1} />
            <text x={BX[0] + BW / 2} y={97} textAnchor="middle" fontSize={9} fontWeight={600} fill={C[0]}>U2 / W2</text>
            <text x={BX[0] + BW / 2} y={112} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">현재 스텝</text>
          </motion.g>
          {/* Cross-term T */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
              <line x1={BX[0] + BW} y1={55} x2={BX[1]} y2={72} stroke={C[1]} strokeWidth={1.2} markerEnd="url(#nf-a)" />
              <line x1={BX[0] + BW} y1={90} x2={BX[1]} y2={72} stroke={C[1]} strokeWidth={1.2} markerEnd="url(#nf-a)" />
              <rect x={BX[1]} y={50} width={BW} height={BH} rx={7}
                fill={C[1] + '18'} stroke={C[1]} strokeWidth={step === 1 ? 2 : 1} />
              <text x={BX[1] + BW / 2} y={68} textAnchor="middle" fontSize={9} fontWeight={600} fill={C[1]}>교차항 T</text>
              <text x={BX[1] + BW / 2} y={82} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">comm_T = KZG</text>
            </motion.g>
          )}
          {/* Challenge r */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <circle cx={BX[1] + BW / 2} cy={135} r={18} fill={C[2] + '18'} stroke={C[2]} strokeWidth={step === 2 ? 2 : 1} />
              <text x={BX[1] + BW / 2} y={138} textAnchor="middle" fontSize={10} fontWeight={600} fill={C[2]}>r</text>
              <text x={BX[1] + BW / 2} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Fiat-Shamir</text>
              <line x1={BX[1] + BW / 2} y1={94} x2={BX[1] + BW / 2} y2={117} stroke={C[2]} strokeWidth={1} strokeDasharray="3 2" />
            </motion.g>
          )}
          {/* Folded output */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
              <line x1={BX[1] + BW} y1={72} x2={BX[2]} y2={72} stroke={C[3]} strokeWidth={1.2} markerEnd="url(#nf-a)" />
              <rect x={BX[2]} y={50} width={BW} height={BH} rx={7}
                fill={C[3] + '18'} stroke={C[3]} strokeWidth={1.5} />
              <text x={BX[2] + BW / 2} y={68} textAnchor="middle" fontSize={9} fontWeight={600} fill={C[3]}>U' / W'</text>
              <text x={BX[2] + BW / 2} y={82} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">새 누적 결과</text>
              <motion.line x1={BX[2] + BW / 2} y1={94} x2={BX[2] + BW / 2} y2={135}
                stroke={C[3]} strokeWidth={1} strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x={BX[2] + BW / 2} y={148} textAnchor="middle" fontSize={9} fill={C[3]}>다음 폴딩 입력</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
