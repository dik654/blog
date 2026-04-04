import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const N = 100;
const f = Math.floor((N - 1) / 3);
const nf = N - f;
const k1 = nf - f;
const k2 = nf;

const C = { n: '#6366f1', f: '#ef4444', nf: '#10b981', k1: '#f59e0b', k2: '#0ea5e9' };

const BARS = [
  { label: `n=${N}`, val: N, color: C.n },
  { label: `f=${f}`, val: f, color: C.f },
  { label: `n-f=${nf}`, val: nf, color: C.nf },
  { label: `k1=${k1}`, val: k1, color: C.k1 },
  { label: `k2=${k2}`, val: k2, color: C.k2 },
];

const STEPS = [
  { label: `n=${N} 노드, 비잔틴 허용 f=${f}`, body: `전체 ${N}개 노드 중 최대 ${f}개가 비잔틴이어도 시스템이 동작합니다.` },
  { label: `정직 노드 n-f=${nf}, 파라미터 유도`, body: `k1=n-2f=${k1} (primary), k2=n-f=${k2} (secondary). RS 인코딩 파라미터입니다.` },
  { label: '2D 인코딩: k1×k2 심볼 행렬', body: '블롭을 k1×k2 행렬로 배치 → 행 RS → secondary, 열 RS → primary 슬라이버.' },
  { label: 'BFT 안전성: n-f 복구, n-2f 단일 복구', body: 'n-f개 secondary로 블롭 전체 재구성. n-2f개로 단일 슬라이버 복구 가능.' },
];

const barOx = 100, barMax = 260, barH = 16, barGap = 24, barOy = 15;

export default function WalrusBFTViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 165" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {BARS.map((b, i) => {
            const show = i === 0 ? step >= 0
              : i === 1 ? step >= 0
              : step >= 1;
            const w = (b.val / N) * barMax;
            const y = barOy + i * barGap;
            return (
              <motion.g key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: show ? 1 : 0.15, x: 0 }}
                transition={{ delay: show ? i * 0.06 : 0 }}>
                <text x={barOx - 6} y={y + barH / 2 + 3} textAnchor="end"
                  fontSize={9} fill={b.color} fontWeight={600}>{b.label}</text>
                <motion.rect x={barOx} y={y} height={barH} rx={barH / 2}
                  fill={b.color + '25'} stroke={b.color} strokeWidth={1}
                  initial={{ width: 0 }}
                  animate={{ width: show ? w : 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }} />
                <motion.text x={barOx + w + 6} y={y + barH / 2 + 3}
                  fontSize={9} fontWeight={600} fill={b.color}
                  animate={{ opacity: show ? 1 : 0 }}>
                  {b.val}
                </motion.text>
              </motion.g>
            );
          })}
          {/* 2D encoding diagram */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <rect x={barOx + 20} y={barOy + 5 * barGap + 5} width={50} height={30} rx={4}
                fill={C.k1 + '15'} stroke={C.k1} strokeWidth={1} />
              <text x={barOx + 45} y={barOy + 5 * barGap + 24} textAnchor="middle"
                fontSize={9} fill={C.k1}>k1×k2</text>
              <line x1={barOx + 75} y1={barOy + 5 * barGap + 20}
                x2={barOx + 100} y2={barOy + 5 * barGap + 10}
                stroke={C.nf} strokeWidth={0.8} strokeDasharray="3 2" />
              <text x={barOx + 115} y={barOy + 5 * barGap + 12} fontSize={6.5} fill={C.nf}>Secondary</text>
              <line x1={barOx + 75} y1={barOy + 5 * barGap + 20}
                x2={barOx + 100} y2={barOy + 5 * barGap + 30}
                stroke={C.k2} strokeWidth={0.8} strokeDasharray="3 2" />
              <text x={barOx + 115} y={barOy + 5 * barGap + 32} fontSize={6.5} fill={C.k2}>Primary</text>
            </motion.g>
          )}
          {/* Safety badge */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={240} y={barOy + 5 * barGap + 2} width={150} height={30} rx={6}
                fill={C.nf + '10'} stroke={C.nf} strokeWidth={1} />
              <text x={315} y={barOy + 5 * barGap + 14} textAnchor="middle"
                fontSize={6.5} fill={C.nf} fontWeight={600}>n-f={nf}개로 블롭 복구</text>
              <text x={315} y={barOy + 5 * barGap + 26} textAnchor="middle"
                fontSize={6.5} fill={C.k1} fontWeight={600}>n-2f={k1}개로 슬라이버 복구</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
