import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, COLORS, sp } from './FreezingVizData';

export default function FreezingViz() {
  const layers = [
    { label: 'Conv1', sub: '에지 검출', depth: 0 },
    { label: 'Conv2', sub: '텍스처', depth: 1 },
    { label: 'Conv3', sub: '패턴', depth: 2 },
    { label: 'Conv4', sub: '부분 객체', depth: 3 },
    { label: 'FC', sub: '분류 결정', depth: 4 },
  ];

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Freeze concept — low layers frozen, top trainable */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {layers.map((l, i) => {
                const x = 30 + i * 96;
                const frozen = i < 3;
                const color = frozen ? COLORS.frozen : COLORS.trainable;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: i * 0.08 }}>
                    <rect x={x} y={50} width={85} height={55} rx={8}
                      fill={`${color}12`} stroke={color} strokeWidth={1.5} />
                    <text x={x + 42} y={70} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{l.label}</text>
                    <text x={x + 42} y={83} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{l.sub}</text>
                    <rect x={x + 15} y={90} width={55} height={10} rx={5}
                      fill={`${color}20`} stroke={color} strokeWidth={0.6} />
                    <text x={x + 42} y={98} textAnchor="middle" fontSize={7} fontWeight={600} fill={color}>
                      {frozen ? '❄ Frozen' : '🔥 Train'}
                    </text>
                    {/* Connecting arrows */}
                    {i < 4 && (
                      <line x1={x + 85} y1={77} x2={x + 96} y2={77}
                        stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrFZ)" />
                    )}
                  </motion.g>
                );
              })}
              {/* Legend */}
              <rect x={30} y={130} width={10} height={10} rx={2} fill={COLORS.frozen} opacity={0.5} />
              <text x={45} y={139} fontSize={8} fill="var(--foreground)">동결 (가중치 고정, gradient 차단)</text>
              <rect x={260} y={130} width={10} height={10} rx={2} fill={COLORS.trainable} opacity={0.5} />
              <text x={275} y={139} fontSize={8} fill="var(--foreground)">학습 (gradient 흐름, 가중치 갱신)</text>
              <text x={260} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                requires_grad = False → gradient 계산 생략 → 메모리·시간 절약
              </text>
            </motion.g>
          )}

          {/* Step 1: Freeze ratio vs data amount chart */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Y axis: freeze ratio */}
              <line x1={80} y1={30} x2={80} y2={170} stroke="var(--muted-foreground)" strokeWidth={1} />
              <text x={40} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)" transform="rotate(-90,40,100)">
                Freeze 비율
              </text>
              <text x={72} y={38} fontSize={7} fill="var(--muted-foreground)">100%</text>
              <text x={72} y={172} fontSize={7} fill="var(--muted-foreground)">0%</text>
              {/* X axis: data amount */}
              <line x1={80} y1={170} x2={460} y2={170} stroke="var(--muted-foreground)" strokeWidth={1} />
              <text x={270} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">데이터량</text>
              {/* Tick marks */}
              {[
                { x: 140, label: '100' },
                { x: 220, label: '1K' },
                { x: 300, label: '10K' },
                { x: 380, label: '100K' },
                { x: 440, label: '1M' },
              ].map((t, i) => (
                <g key={i}>
                  <line x1={t.x} y1={170} x2={t.x} y2={175} stroke="var(--muted-foreground)" strokeWidth={0.8} />
                  <text x={t.x} y={184} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{t.label}</text>
                </g>
              ))}
              {/* Curve */}
              <motion.path d="M100,45 C180,50 250,90 360,145 Q420,165 450,168"
                stroke={COLORS.gradual} strokeWidth={2.5} fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 1.2 }} />
              {/* Annotations */}
              <rect x={85} y={32} width={80} height={22} rx={4} fill={COLORS.frozen} fillOpacity={0.1}
                stroke={COLORS.frozen} strokeWidth={0.8} />
              <text x={125} y={46} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.frozen}>
                거의 전부 Freeze
              </text>
              <rect x={370} y={140} width={85} height={22} rx={4} fill={COLORS.trainable} fillOpacity={0.1}
                stroke={COLORS.trainable} strokeWidth={0.8} />
              <text x={412} y={154} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.trainable}>
                전체 Fine-tune
              </text>
            </motion.g>
          )}

          {/* Step 2: Gradual Unfreezing — 3 phases */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                { phase: '1단계', desc: '분류 헤드만 학습', frozen: [0, 1, 2, 3], train: [4], y: 20 },
                { phase: '2단계', desc: '마지막 블록 해동', frozen: [0, 1, 2], train: [3, 4], y: 80 },
                { phase: '3단계', desc: '전체 해동', frozen: [], train: [0, 1, 2, 3, 4], y: 140 },
              ].map((p, pi) => (
                <motion.g key={pi} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: pi * 0.15 }}>
                  {/* Phase label */}
                  <text x={15} y={p.y + 22} fontSize={9} fontWeight={700} fill={COLORS.gradual}>{p.phase}</text>
                  <text x={15} y={p.y + 34} fontSize={7.5} fill="var(--muted-foreground)">{p.desc}</text>
                  {/* Layer boxes */}
                  {layers.map((l, li) => {
                    const lx = 100 + li * 82;
                    const frozen = p.frozen.includes(li);
                    const color = frozen ? COLORS.frozen : COLORS.trainable;
                    return (
                      <g key={li}>
                        <rect x={lx} y={p.y + 5} width={72} height={35} rx={5}
                          fill={`${color}10`} stroke={color} strokeWidth={1}
                          opacity={frozen ? 0.5 : 1} />
                        <text x={lx + 36} y={p.y + 21} textAnchor="middle" fontSize={8} fontWeight={600} fill={color}>
                          {l.label}
                        </text>
                        <text x={lx + 36} y={p.y + 32} textAnchor="middle" fontSize={7} fill={color}>
                          {frozen ? '❄' : '🔥'}
                        </text>
                      </g>
                    );
                  })}
                </motion.g>
              ))}
              <text x={260} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                ULMFiT (Howard & Ruder, 2018) — Catastrophic Forgetting 방지 핵심 기법
              </text>
            </motion.g>
          )}

          {/* Step 3: Decision guide — data size × domain similarity */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 2×2 matrix */}
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Freeze 전략 결정 매트릭스
              </text>
              {/* Axes */}
              <line x1={120} y1={35} x2={120} y2={185} stroke="var(--muted-foreground)" strokeWidth={1} />
              <line x1={120} y1={185} x2={480} y2={185} stroke="var(--muted-foreground)" strokeWidth={1} />
              <text x={80} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)" transform="rotate(-90,80,115)">
                도메인 유사도
              </text>
              <text x={300} y={202} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">데이터량</text>
              <text x={105} y={60} fontSize={7} fill="var(--muted-foreground)">높음</text>
              <text x={105} y={170} fontSize={7} fill="var(--muted-foreground)">낮음</text>
              <text x={175} y={197} fontSize={7} fill="var(--muted-foreground)">적음</text>
              <text x={440} y={197} fontSize={7} fill="var(--muted-foreground)">많음</text>
              {/* Quadrants */}
              {[
                { x: 130, y: 40, w: 165, h: 65, label: '많이 Freeze', sub: '헤드만 학습', color: COLORS.frozen },
                { x: 305, y: 40, w: 165, h: 65, label: '조금 Freeze', sub: '상위 블록 학습', color: COLORS.trainable },
                { x: 130, y: 115, w: 165, h: 65, label: 'Gradual Unfreeze', sub: '도메인 적응 필요', color: COLORS.gradual },
                { x: 305, y: 115, w: 165, h: 65, label: 'Full Fine-tune', sub: '전체 가중치 갱신', color: COLORS.data },
              ].map((q, i) => (
                <motion.g key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <rect x={q.x} y={q.y} width={q.w} height={q.h} rx={6}
                    fill={`${q.color}10`} stroke={q.color} strokeWidth={1} />
                  <text x={q.x + q.w / 2} y={q.y + 28} textAnchor="middle" fontSize={10} fontWeight={700} fill={q.color}>
                    {q.label}
                  </text>
                  <text x={q.x + q.w / 2} y={q.y + 44} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                    {q.sub}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          )}

          <defs>
            <marker id="arrFZ" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
