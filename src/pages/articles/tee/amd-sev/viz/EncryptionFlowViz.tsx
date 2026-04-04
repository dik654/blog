import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { indigo: '#6366f1', green: '#10b981', amber: '#f59e0b' };

const STEPS = [
  { label: 'CPU Write 시작', body: 'CPU가 GPA에 데이터 쓰기 요청 → 페이지 테이블 참조' },
  { label: 'C-bit 확인', body: 'page_table[GPA].c_bit — 해당 페이지의 암호화 플래그 확인' },
  { label: 'C-bit=1 → AES-128 암호화', body: 'ASID별 키 조회 → AES-128-ECB 하드웨어 가속 암호화 → 암호문 기록' },
  { label: 'C-bit=0 → 평문 기록', body: '공유 메모리 용도 — 암호화 없이 직접 DRAM에 기록 (~2% 오버헤드)' },
];

export default function EncryptionFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* CPU */}
          <rect x={20} y={50} width={80} height={40} rx={6}
            fill={`${C.indigo}12`} stroke={C.indigo} strokeWidth={step === 0 ? 1.8 : 1} />
          <text x={60} y={74} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.indigo}>CPU</text>
          {/* Arrow CPU → PT */}
          <motion.line x1={100} y1={70} x2={140} y2={70}
            stroke={step >= 0 ? C.indigo : '#88888840'} strokeWidth={1.2}
            markerEnd="url(#encArr)" animate={{ opacity: step >= 0 ? 0.8 : 0.2 }} />
          {/* Page Table */}
          <rect x={140} y={40} width={90} height={60} rx={6}
            fill={step === 1 ? `${C.amber}15` : 'var(--card)'}
            stroke={step === 1 ? C.amber : '#88888860'} strokeWidth={step === 1 ? 1.5 : 0.8} />
          <text x={185} y={62} textAnchor="middle" fontSize={10} fontWeight={600}
            fill={step === 1 ? C.amber : 'var(--foreground)'}>Page Table</text>
          <text x={185} y={78} textAnchor="middle" fontSize={10}
            fill={step === 1 ? C.amber : 'var(--muted-foreground)'}>C-bit 확인</text>
          {/* Branch: C-bit = 1 */}
          <motion.g animate={{ opacity: step === 2 ? 1 : (step <= 1 ? 0.2 : 0.15) }}>
            <line x1={230} y1={55} x2={290} y2={35} stroke={C.green} strokeWidth={1.2} markerEnd="url(#encArrG)" />
            <rect x={290} y={15} width={110} height={48} rx={6}
              fill={step === 2 ? `${C.green}12` : 'var(--card)'}
              stroke={C.green} strokeWidth={step === 2 ? 1.5 : 0.8} />
            <text x={345} y={33} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>AES-128-ECB</text>
            <text x={345} y={48} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">ASID키 → 암호화</text>
            <line x1={400} y1={39} x2={440} y2={39} stroke={C.green} strokeWidth={1.2} markerEnd="url(#encArrG)" />
            <rect x={440} y={20} width={80} height={38} rx={6}
              fill={`${C.green}08`} stroke={C.green} strokeWidth={0.8} />
            <text x={480} y={38} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>DRAM</text>
            <text x={480} y={50} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">암호문</text>
          </motion.g>
          {/* Label C-bit=1 */}
          <motion.text x={255} y={32} fontSize={10} fontWeight={600} fill={C.green}
            animate={{ opacity: step >= 2 ? 0.8 : 0.2 }}>C=1</motion.text>
          {/* Branch: C-bit = 0 */}
          <motion.g animate={{ opacity: step === 3 ? 1 : (step <= 1 ? 0.2 : 0.15) }}>
            <line x1={230} y1={85} x2={290} y2={110} stroke={C.amber} strokeWidth={1.2} markerEnd="url(#encArrA)" />
            <rect x={290} y={95} width={110} height={38} rx={6}
              fill={step === 3 ? `${C.amber}12` : 'var(--card)'}
              stroke={C.amber} strokeWidth={step === 3 ? 1.5 : 0.8} />
            <text x={345} y={113} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.amber}>바이패스</text>
            <text x={345} y={127} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">암호화 없음</text>
            <line x1={400} y1={114} x2={440} y2={114} stroke={C.amber} strokeWidth={1.2} markerEnd="url(#encArrA)" />
            <rect x={440} y={95} width={80} height={38} rx={6}
              fill={`${C.amber}08`} stroke={C.amber} strokeWidth={0.8} />
            <text x={480} y={113} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.amber}>DRAM</text>
            <text x={480} y={125} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">평문</text>
          </motion.g>
          <motion.text x={255} y={105} fontSize={10} fontWeight={600} fill={C.amber}
            animate={{ opacity: step >= 2 ? 0.8 : 0.2 }}>C=0</motion.text>
          <defs>
            <marker id="encArr" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={C.indigo} />
            </marker>
            <marker id="encArrG" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={C.green} />
            </marker>
            <marker id="encArrA" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={C.amber} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
