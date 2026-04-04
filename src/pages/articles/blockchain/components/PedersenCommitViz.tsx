import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const STEPS = [
  { label: 'Pedersen 커밋: C = v·B + r·B_blind', body: '값 v와 블라인딩 인수 r로 커밋 C를 생성합니다. v를 몰라도 검증 가능.' },
  { label: '정보이론적 히딩 (Hiding)', body: 'C만 봐서는 v를 역산 불가능. r이 완전 난수이면 완전 영지식.' },
  { label: '계산적 바인딩 (Binding)', body: 'v,r을 공개하면 누구나 C = v·B + r·B_blind를 재계산해 검증.' },
  { label: 'Bulletproofs 범위 증명 연결', body: 'C를 기반으로 O(log n) 크기의 범위 증명을 생성. 투명 셋업.' },
];

const BX = 60, BY = 55, BBLX = 200, CX = 295;

export default function PedersenCommitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 360 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* v · B */}
          <motion.rect x={BX - 28} y={BY - 14} width={56} height={28} rx={5}
            animate={{ fill: step >= 0 ? '#6366f118' : '#6366f106', stroke: '#6366f1',
              strokeWidth: step === 0 ? 2 : 0.8 }} transition={sp} />
          <text x={BX} y={BY - 2} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">v · B</text>
          <text x={BX} y={BY + 8} textAnchor="middle" fontSize={9} fill="#6366f1" opacity={0.6}>기저점</text>

          {/* + */}
          <text x={130} y={BY + 3} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">+</text>

          {/* r · B_blind */}
          <motion.rect x={BBLX - 34} y={BY - 14} width={68} height={28} rx={5}
            animate={{ fill: step >= 0 ? '#0ea5e918' : '#0ea5e906', stroke: '#0ea5e9',
              strokeWidth: step === 1 ? 2 : 0.8 }} transition={sp} />
          <text x={BBLX} y={BY - 2} textAnchor="middle" fontSize={9} fontWeight={600} fill="#0ea5e9">r · B_blind</text>
          <text x={BBLX} y={BY + 8} textAnchor="middle" fontSize={9} fill="#0ea5e9" opacity={0.6}>블라인딩</text>

          {/* = */}
          <text x={256} y={BY + 3} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">=</text>

          {/* C */}
          <motion.rect x={CX - 28} y={BY - 14} width={56} height={28} rx={5}
            animate={{ fill: step >= 2 ? '#10b98128' : '#10b98108', stroke: '#10b981',
              strokeWidth: step >= 2 ? 2 : 0.8 }} transition={sp} />
          <text x={CX} y={BY + 4} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">C</text>

          {/* hiding label */}
          {step >= 1 && (
            <motion.text x={BX + 70} y={16} textAnchor="middle" fontSize={5.5} fill="#f59e0b"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={sp}>Hiding: C로부터 v 역산 불가</motion.text>
          )}
          {/* binding label */}
          {step >= 2 && (
            <motion.text x={CX} y={98} textAnchor="middle" fontSize={5.5} fill="#10b981"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={sp}>Binding: (v,r) 공개시 검증 가능</motion.text>
          )}
          {/* range proof */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={100} y={90} width={120} height={16} rx={4} fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1} />
              <text x={160} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">
                O(log n) 범위 증명
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
