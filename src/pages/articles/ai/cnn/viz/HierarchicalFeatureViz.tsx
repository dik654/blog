import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import {
  STEPS, sp, LAYERS,
  EDGE_V, EDGE_H, EDGE_D,
  SHAPE_L, SHAPE_C, PART_EYE,
} from './HierarchicalFeatureVizData';

const P = 8; // pixel cell size for edges/shapes

function PixelGrid({ data, ox, oy, color, label, cellSize = P }: {
  data: number[][]; ox: number; oy: number; color: string; label?: string; cellSize?: number;
}) {
  return (
    <g>
      {label && (
        <text x={ox + (data[0].length * cellSize) / 2} y={oy - 4}
          textAnchor="middle" fontSize={9} fill={color} fontWeight={600}>{label}</text>
      )}
      {data.map((row, r) => row.map((v, c) => (
        <rect key={`${r}-${c}`}
          x={ox + c * cellSize} y={oy + r * cellSize}
          width={cellSize - 0.5} height={cellSize - 0.5} rx={1}
          fill={v > 0 ? `${color}50` : '#80808010'}
          stroke={v > 0 ? color : '#94a3b850'} strokeWidth={0.3} />
      )))}
    </g>
  );
}

export default function HierarchicalFeatureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 560 165" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Layer headers */}
          {LAYERS.map((l, i) => {
            const x = 10 + i * 130;
            const active = step === i || step === 4;
            return (
              <motion.g key={i} animate={{ opacity: active ? 1 : 0.25 }} transition={sp}>
                <rect x={x} y={8} width={115} height={18} rx={4}
                  fill={`${l.color}15`} stroke={l.color} strokeWidth={active ? 1 : 0.3} />
                <text x={x + 58} y={20} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={l.color}>{l.label}: {l.sub}</text>
              </motion.g>
            );
          })}

          {/* Arrows between layers */}
          {[0, 1, 2].map(i => (
            <motion.g key={`a${i}`}
              animate={{ opacity: (step > i || step === 4) ? 0.5 : 0.1 }} transition={sp}>
              <line x1={10 + i * 130 + 115} y1={17} x2={10 + (i + 1) * 130} y2={17}
                stroke="#94a3b8" strokeWidth={0.8} />
              <text x={10 + i * 130 + 122} y={14} fontSize={8} fill="#94a3b8">+</text>
            </motion.g>
          ))}

          {/* Step 0: Edge patterns with actual 3x3 grids */}
          {(step === 0 || step === 4) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <PixelGrid data={EDGE_V} ox={14} oy={36} color="#3b82f6" label="|" />
              <PixelGrid data={EDGE_H} ox={48} oy={36} color="#3b82f6" label="─" />
              <PixelGrid data={EDGE_D} ox={82} oy={36} color="#3b82f6" label="╲" />
              <text x={68} y={74} textAnchor="middle" fontSize={9} fill="#3b82f6">
                3×3 커널이 감지
              </text>
              {/* Show activation values */}
              <text x={14} y={84} fontSize={8} fill="#3b82f6">활성화: 3.0</text>
              <text x={48} y={84} fontSize={8} fill="#3b82f6">활성화: 3.0</text>
              <text x={82} y={84} fontSize={8} fill="#3b82f6">활성화: 3.0</text>
            </motion.g>
          )}

          {/* Step 1: Shape patterns - edges combine */}
          {(step === 1 || step === 4) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <PixelGrid data={SHAPE_L} ox={144} oy={32} color="#8b5cf6" label="ㄴ 모양" />
              <PixelGrid data={SHAPE_C} ox={200} oy={32} color="#8b5cf6" label="C 곡선" />
              <text x={198} y={84} textAnchor="middle" fontSize={9} fill="#8b5cf6">
                │+─ 조합 → 도형
              </text>
            </motion.g>
          )}

          {/* Step 2: Part patterns - shapes combine */}
          {(step === 2 || step === 4) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <PixelGrid data={PART_EYE} ox={274} oy={30} color="#f59e0b" label="눈 패턴" cellSize={7} />
              <text x={330} y={84} textAnchor="middle" fontSize={9} fill="#f59e0b">
                곡선+원 조합 → 부분
              </text>
              <text x={330} y={94} textAnchor="middle" fontSize={8} fill="#f59e0b">
                수용야: 92×92 px
              </text>
            </motion.g>
          )}

          {/* Step 3: Object classification with actual probability */}
          {(step === 3 || step === 4) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={465} y={36} textAnchor="middle" fontSize={10} fill="#ef4444"
                fontWeight={700}>분류 확률</text>
              {[
                { cls: '강아지', prob: 0.82, w: 72 },
                { cls: '고양이', prob: 0.11, w: 10 },
                { cls: '토끼', prob: 0.04, w: 3 },
                { cls: '기타', prob: 0.03, w: 2 },
              ].map((d, i) => (
                <g key={i}>
                  <text x={418} y={52 + i * 15} fontSize={9} fill="var(--foreground)">{d.cls}</text>
                  <rect x={455} y={44 + i * 15} width={d.w} height={10} rx={2}
                    fill={i === 0 ? '#ef4444' : '#ef444430'} />
                  <text x={460 + d.w} y={53 + i * 15} fontSize={9} fontWeight={i === 0 ? 700 : 400}
                    fill={i === 0 ? '#ef4444' : '#94a3b8'}>{(d.prob * 100).toFixed(0)}%</text>
                </g>
              ))}
            </motion.g>
          )}

          {/* Step 4: Brain mapping */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: 0.2 }}>
              {LAYERS.map((l, i) => (
                <g key={`b${i}`}>
                  <line x1={10 + i * 130 + 58} y1={97} x2={10 + i * 130 + 58} y2={112}
                    stroke={l.color} strokeWidth={0.8} strokeDasharray="2 2" />
                  <rect x={10 + i * 130 + 30} y={112} width={56} height={18} rx={4}
                    fill={`${l.color}20`} stroke={l.color} strokeWidth={0.8} />
                  <text x={10 + i * 130 + 58} y={124} textAnchor="middle"
                    fontSize={10} fontWeight={700} fill={l.color}>{l.brain}</text>
                </g>
              ))}
              <text x={260} y={150} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                V1(엣지) → V2(도형) → V4(부분) → IT(물체) — CNN과 구조적으로 유사
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
