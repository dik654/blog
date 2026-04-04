import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '전체 체크포인트 검증 흐름', body: 'VDF 생성자는 순차 계산, 검증자는 체크포인트 간 병렬 검증이 가능합니다.' },
  { label: '순차 계산 (생성자)', body: '이전 결과가 다음 입력이므로 병렬화 불가. GPU/ASIC 이점 없음.' },
  { label: '병렬 검증 (검증자)', body: '체크포인트 간 독립 구간으로 분할하여 멀티스레드 검증.' },
];

const CPS = Array.from({ length: 8 }, (_, i) => i);

export default function CheckpointVerifyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {CPS.map((i) => {
            const x = 15 + i * 40;
            const isSeq = step <= 1;
            const groupColor = i < 4 ? '#10b981' : '#6366f1';
            const color = step === 0 ? '#f59e0b' : isSeq ? '#f59e0b' : groupColor;
            return (
              <g key={i}>
                <motion.rect x={x} y={30} width={30} height={30} rx={5}
                  animate={{ fill: `${color}18`, stroke: color, strokeWidth: 1.5 }}
                  transition={{ duration: 0.3 }} />
                <text x={x + 15} y={48} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={color}>CP{i + 1}</text>
                {i < 7 && (
                  <motion.line x1={x + 30} y1={45} x2={x + 40} y2={45}
                    stroke={isSeq ? '#f59e0b' : '#666'} strokeWidth={1}
                    strokeDasharray={isSeq ? '0' : '3 2'}
                    animate={{ opacity: isSeq ? 0.8 : 0.3 }}
                    transition={{ duration: 0.3 }} />
                )}
              </g>
            );
          })}
          {step === 2 && (
            <>
              <motion.rect x={15} y={70} width={150} height={16} rx={3}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
              <text x={90} y={81} textAnchor="middle" fontSize={10} fill="#10b981">Thread 1</text>
              <motion.rect x={175} y={70} width={150} height={16} rx={3}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                fill="#6366f110" stroke="#6366f1" strokeWidth={0.8} />
              <text x={250} y={81} textAnchor="middle" fontSize={10} fill="#6366f1">Thread 2</text>
            </>
          )}
          <text x={170} y={18} textAnchor="middle" fontSize={10} fontWeight={500}
            fill="var(--muted-foreground)">
            {step === 0 ? 'VDF 체크포인트 구조' : step === 1 ? '순차 계산 (병렬화 불가)' : '병렬 검증 (그룹 분할)'}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
