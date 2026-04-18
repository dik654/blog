import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, COLORS } from './OverfittingDiagnosisData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* 학습 곡선 좌표 생성 */
const epochs = 20;
const trainNormal = Array.from({ length: epochs }, (_, i) => 1.0 - 0.7 * (1 - Math.exp(-i / 5)));
const valNormal = Array.from({ length: epochs }, (_, i) => 1.05 - 0.6 * (1 - Math.exp(-i / 6)));

const trainOverfit = Array.from({ length: epochs }, (_, i) => 1.0 - 0.95 * (1 - Math.exp(-i / 4)));
const valOverfit = Array.from({ length: epochs }, (_, i) => {
  const base = 1.05 - 0.5 * (1 - Math.exp(-i / 6));
  return i > 8 ? base + (i - 8) * 0.04 : base;
});

const trainReg = Array.from({ length: epochs }, (_, i) => 1.0 - 0.75 * (1 - Math.exp(-i / 5)));
const valReg = Array.from({ length: epochs }, (_, i) => 1.08 - 0.6 * (1 - Math.exp(-i / 5.5)));

function toPath(data: number[], ox: number, oy: number, w: number, h: number): string {
  return data
    .map((v, i) => {
      const x = ox + (i / (data.length - 1)) * w;
      const y = oy + h - v * h;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function Axes({ ox, oy, w, h }: { ox: number; oy: number; w: number; h: number }) {
  return (
    <g>
      <line x1={ox} y1={oy} x2={ox} y2={oy + h} stroke="#888" strokeWidth={0.5} />
      <line x1={ox} y1={oy + h} x2={ox + w} y2={oy + h} stroke="#888" strokeWidth={0.5} />
      <text x={ox - 4} y={oy + 4} textAnchor="end" fontSize={7} fill="#888">Loss</text>
      <text x={ox + w} y={oy + h + 10} textAnchor="end" fontSize={7} fill="#888">Epoch</text>
    </g>
  );
}

function Legend({ ox, oy }: { ox: number; oy: number }) {
  return (
    <g>
      <line x1={ox} y1={oy} x2={ox + 14} y2={oy} stroke={COLORS.train} strokeWidth={1.5} />
      <text x={ox + 18} y={oy + 3} fontSize={8} fill={COLORS.train}>Train</text>
      <line x1={ox + 50} y1={oy} x2={ox + 64} y2={oy} stroke={COLORS.val} strokeWidth={1.5} strokeDasharray="3 2" />
      <text x={ox + 68} y={oy + 3} fontSize={8} fill={COLORS.val}>Val</text>
    </g>
  );
}

export default function OverfittingDiagnosisViz() {
  const W = 170, H = 110, ox1 = 35, ox2 = 255, oy = 30;

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* 좌 패널: 학습 곡선 */}
          <text x={ox1 + W / 2} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
            fill="var(--foreground)">
            {step <= 2 ? '학습 곡선 (Learning Curve)' : '정규화 적용 후'}
          </text>
          <Axes ox={ox1} oy={oy} w={W} h={H} />
          <Legend ox={ox1 + 20} oy={oy + H + 18} />

          {/* Step 0: 정상 학습 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <path d={toPath(trainNormal, ox1, oy, W, H)} fill="none"
                stroke={COLORS.train} strokeWidth={1.5} />
              <path d={toPath(valNormal, ox1, oy, W, H)} fill="none"
                stroke={COLORS.val} strokeWidth={1.5} strokeDasharray="3 2" />
            </motion.g>
          )}

          {/* Step 1: 오버피팅 시작 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <path d={toPath(trainOverfit, ox1, oy, W, H)} fill="none"
                stroke={COLORS.train} strokeWidth={1.5} />
              <path d={toPath(valOverfit, ox1, oy, W, H)} fill="none"
                stroke={COLORS.val} strokeWidth={1.5} strokeDasharray="3 2" />
              {/* 반등 지점 표시 */}
              <motion.circle cx={ox1 + (8 / 19) * W} cy={oy + H - valOverfit[8] * H}
                r={4} fill="none" stroke={COLORS.gap} strokeWidth={1.5}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...sp, delay: 0.3 }} />
              <text x={ox1 + (8 / 19) * W + 8} y={oy + H - valOverfit[8] * H - 4}
                fontSize={8} fill={COLORS.gap} fontWeight={600}>반등!</text>
            </motion.g>
          )}

          {/* Step 2: 심한 오버피팅 — 격차 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <path d={toPath(trainOverfit, ox1, oy, W, H)} fill="none"
                stroke={COLORS.train} strokeWidth={1.5} />
              <path d={toPath(valOverfit, ox1, oy, W, H)} fill="none"
                stroke={COLORS.val} strokeWidth={1.5} strokeDasharray="3 2" />
              {/* 격차 영역 */}
              <motion.rect x={ox1 + W - 30} y={oy + H - trainOverfit[19] * H}
                width={20}
                height={(valOverfit[19] - trainOverfit[19]) * H}
                rx={2} fill={COLORS.gap} fillOpacity={0.2} stroke={COLORS.gap}
                strokeWidth={0.8} strokeDasharray="2 1"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }} />
              <text x={ox1 + W + 2} y={oy + H - (trainOverfit[19] + valOverfit[19]) / 2 * H + 4}
                fontSize={7} fill={COLORS.gap} fontWeight={600}>Gap ↑</text>
            </motion.g>
          )}

          {/* Step 3: 정규화 적용 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <path d={toPath(trainReg, ox1, oy, W, H)} fill="none"
                stroke={COLORS.reg} strokeWidth={1.5} />
              <path d={toPath(valReg, ox1, oy, W, H)} fill="none"
                stroke={COLORS.reg} strokeWidth={1.5} strokeDasharray="3 2" opacity={0.7} />
            </motion.g>
          )}

          {/* 우 패널: 정규화 기법 로드맵 */}
          <text x={ox2 + W / 2} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
            fill="var(--foreground)">정규화 기법 4가지</text>
          <rect x={ox2} y={oy} width={W} height={H + 20} rx={6}
            fill="none" stroke="var(--border)" strokeWidth={0.6} />

          {[
            { name: 'Dropout', color: '#8b5cf6', desc: '뉴런 무작위 비활성화' },
            { name: 'Weight Decay', color: '#3b82f6', desc: '가중치 크기 억제' },
            { name: 'Early Stopping', color: '#10b981', desc: 'Val Loss 반등 시 종료' },
            { name: 'Label Smoothing', color: '#f59e0b', desc: 'Soft Label로 과신 방지' },
          ].map((item, i) => {
            const iy = oy + 8 + i * 30;
            const active = step === 3;
            return (
              <g key={item.name}>
                <rect x={ox2 + 8} y={iy} width={W - 16} height={24} rx={4}
                  fill={active ? `${item.color}15` : 'transparent'}
                  stroke={active ? item.color : 'var(--border)'} strokeWidth={active ? 1 : 0.4} />
                <circle cx={ox2 + 20} cy={iy + 12} r={3}
                  fill={active ? item.color : '#888'} />
                <text x={ox2 + 30} y={iy + 10} fontSize={9} fontWeight={600}
                  fill={active ? item.color : 'var(--foreground)'}>{item.name}</text>
                <text x={ox2 + 30} y={iy + 20} fontSize={7}
                  fill="var(--muted-foreground)">{item.desc}</text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
