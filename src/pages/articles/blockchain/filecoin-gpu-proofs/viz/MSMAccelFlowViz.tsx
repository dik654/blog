import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'scalars', label: '스칼라 입력',   color: '#6366f1', x: 40 },
  { id: 'window',  label: '윈도우 분할',  color: '#8b5cf6', x: 100 },
  { id: 'bucket',  label: '버킷 누적',    color: '#10b981', x: 160 },
  { id: 'reduce',  label: '버킷 리듀스',  color: '#f59e0b', x: 220 },
  { id: 'merge',   label: '윈도우 병합',  color: '#ec4899', x: 280 },
  { id: 'proof',   label: 'Groth16',     color: '#ef4444', x: 340 },
];
const EDGES = ['Pippenger', 'CUDA 커널', '워프 합산', '시프트 결합', 'MSM 결과'];
const Y = 45;

const STEPS = [
  { label: '스칼라 입력', body: '2^26개 이상의 타원곡선 포인트와 스칼라 쌍이 GPU로 전송됩니다.' },
  { label: '윈도우 분할', body: 'Pippenger 알고리즘으로 스칼라를 c-bit 크기의 윈도우로 분할합니다.' },
  { label: '버킷 누적 (GPU)', body: '각 윈도우의 2^c개 버킷에 포인트를 병렬 누적합니다. CUDA 워프 단위 실행.' },
  { label: '버킷 리듀스', body: '각 버킷의 누적 결과를 계층적으로 합산합니다. GPU 공유 메모리 활용.' },
  { label: '윈도우 병합', body: '각 윈도우 결과를 2^c 시프트하며 최종 MSM 결과를 계산합니다.' },
  { label: 'Groth16 증명', body: 'MSM 결과로 Groth16 증명 생성. A10 GPU 기준 ~2.8초, CPU 대비 ~800배.' },
];

export default function MSMAccelFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const vis = i <= step;
            const glow = i === step;
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.15 }} transition={{ duration: 0.35 }}>
                {i > 0 && (
                  <g>
                    <line x1={NODES[i - 1].x + 26} y1={Y} x2={n.x - 26} y2={Y}
                      stroke={`${n.color}50`} strokeWidth={1} />
                    <text x={(NODES[i - 1].x + n.x) / 2} y={Y - 18} textAnchor="middle"
                      fontSize={10} fill="var(--muted-foreground)">{EDGES[i - 1]}</text>
                  </g>
                )}
                <motion.rect x={n.x - 25} y={Y - 14} width={50} height={28} rx={6}
                  fill={`${n.color}${glow ? '28' : '10'}`} stroke={n.color}
                  strokeWidth={glow ? 2 : 1}
                  animate={{ filter: glow ? `drop-shadow(0 0 4px ${n.color}60)` : 'none' }} />
                <text x={n.x} y={Y + 4} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
          {/* GPU zone indicator */}
          {step >= 2 && step <= 4 && (
            <motion.rect x={134} y={Y - 22} width={172} height={44} rx={8}
              fill="none" stroke="#10b98140" strokeWidth={1} strokeDasharray="4 2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
          )}
          {step >= 2 && step <= 4 && (
            <motion.text x={220} y={Y + 30} textAnchor="middle" fontSize={10}
              fill="#10b981" fontWeight={600}
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>GPU Zone</motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
