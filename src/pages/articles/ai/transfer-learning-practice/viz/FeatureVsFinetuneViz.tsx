import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './FeatureVsFinetuneVizData';

export default function FeatureVsFinetuneViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Feature Extraction mode */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Frozen backbone */}
              <rect x={30} y={30} width={160} height={120} rx={10}
                fill={COLORS.feature} fillOpacity={0.06} stroke={COLORS.feature} strokeWidth={1.5} />
              <text x={110} y={22} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.feature}>
                Backbone (Frozen)
              </text>
              {['Conv1', 'Conv2', 'Conv3', 'Conv4'].map((name, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <rect x={45} y={38 + i * 27} width={130} height={22} rx={4}
                    fill={COLORS.feature} fillOpacity={0.12} stroke={COLORS.feature} strokeWidth={0.6} />
                  <text x={110} y={53 + i * 27} textAnchor="middle" fontSize={8} fill={COLORS.feature}>
                    {name} ❄
                  </text>
                </motion.g>
              ))}
              {/* Arrow to feature vector */}
              <motion.line x1={195} y1={90} x2={230} y2={90}
                stroke="var(--muted-foreground)" strokeWidth={1.5} markerEnd="url(#arrFvF)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.3 }} />
              {/* Feature vector */}
              <DataBox x={235} y={70} w={100} h={34} label="피처 벡터" sub="2048-dim 고정" color={COLORS.feature} />
              {/* Arrow to head */}
              <motion.line x1={340} y1={87} x2={370} y2={87}
                stroke={COLORS.finetune} strokeWidth={1.5} markerEnd="url(#arrFvF)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.5 }} />
              {/* Trainable head */}
              <rect x={375} y={60} width={120} height={55} rx={8}
                fill={COLORS.finetune} fillOpacity={0.1} stroke={COLORS.finetune} strokeWidth={1.5} />
              <text x={435} y={80} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.finetune}>
                분류 헤드 🔥
              </text>
              <text x={435} y={95} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                FC → Softmax
              </text>
              <text x={435} y={107} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                학습 파라미터 &lt; 1%
              </text>
              {/* Advantages */}
              <rect x={30} y={170} width={200} height={40} rx={6}
                fill={COLORS.feature} fillOpacity={0.06} stroke={COLORS.feature} strokeWidth={0.6} />
              <text x={130} y={186} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.feature}>장점: 빠른 학습 · 과적합 방지</text>
              <text x={130} y={200} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">GPU 메모리 적게 사용 · 소량 데이터에 안전</text>
              {/* Limitation */}
              <rect x={260} y={170} width={220} height={40} rx={6}
                fill={COLORS.warn} fillOpacity={0.06} stroke={COLORS.warn} strokeWidth={0.6} strokeDasharray="4 3" />
              <text x={370} y={186} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.warn}>한계: 도메인 적응 불가</text>
              <text x={370} y={200} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">피처가 고정 → 도메인 차이 큰 경우 성능 한계</text>
            </motion.g>
          )}

          {/* Step 1: Full Fine-tuning mode */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* All trainable */}
              <rect x={30} y={30} width={160} height={120} rx={10}
                fill={COLORS.finetune} fillOpacity={0.06} stroke={COLORS.finetune} strokeWidth={1.5} />
              <text x={110} y={22} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.finetune}>
                전체 모델 (Trainable)
              </text>
              {['Conv1 🔥', 'Conv2 🔥', 'Conv3 🔥', 'Conv4 🔥'].map((name, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <rect x={45} y={38 + i * 27} width={130} height={22} rx={4}
                    fill={COLORS.finetune} fillOpacity={0.15} stroke={COLORS.finetune} strokeWidth={0.8} />
                  <text x={110} y={53 + i * 27} textAnchor="middle" fontSize={8} fill={COLORS.finetune}>
                    {name}
                  </text>
                </motion.g>
              ))}
              {/* Arrow */}
              <motion.line x1={195} y1={90} x2={260} y2={90}
                stroke={COLORS.finetune} strokeWidth={1.5} markerEnd="url(#arrFvF)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.3 }} />
              {/* Head */}
              <rect x={265} y={65} width={100} height={48} rx={8}
                fill={COLORS.finetune} fillOpacity={0.15} stroke={COLORS.finetune} strokeWidth={1.5} />
              <text x={315} y={85} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.finetune}>FC Head 🔥</text>
              <text x={315} y={100} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">전체 파라미터 갱신</text>
              {/* LR requirement */}
              <rect x={385} y={45} width={120} height={55} rx={8}
                fill={COLORS.data} fillOpacity={0.08} stroke={COLORS.data} strokeWidth={0.8} />
              <text x={445} y={62} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.data}>필수 조건</text>
              <text x={445} y={76} textAnchor="middle" fontSize={7.5} fill="var(--foreground)">작은 LR (1e-5 수준)</text>
              <text x={445} y={88} textAnchor="middle" fontSize={7.5} fill="var(--foreground)">충분한 데이터 (10K+)</text>
              {/* Pros and cons */}
              <rect x={30} y={170} width={200} height={40} rx={6}
                fill={COLORS.finetune} fillOpacity={0.06} stroke={COLORS.finetune} strokeWidth={0.6} />
              <text x={130} y={186} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.finetune}>장점: 최고 성능 달성 가능</text>
              <text x={130} y={200} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">도메인 특화 피처까지 학습 · SOTA 접근</text>
              <AlertBox x={260} y={168} w={220} h={42} label="위험: 과적합 · Catastrophic Forgetting" sub="데이터 부족 시 pretrained 지식 손실" color={COLORS.warn} />
            </motion.g>
          )}

          {/* Step 2: Performance comparison chart */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Axes */}
              <line x1={80} y1={20} x2={80} y2={170} stroke="var(--muted-foreground)" strokeWidth={1} />
              <line x1={80} y1={170} x2={470} y2={170} stroke="var(--muted-foreground)" strokeWidth={1} />
              <text x={35} y={95} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)" transform="rotate(-90,35,95)">
                정확도
              </text>
              <text x={275} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">데이터량</text>
              {/* X labels */}
              {[
                { x: 120, label: '100' }, { x: 200, label: '1K' },
                { x: 300, label: '10K' }, { x: 420, label: '100K' },
              ].map((t, i) => (
                <g key={i}>
                  <line x1={t.x} y1={170} x2={t.x} y2={175} stroke="var(--muted-foreground)" strokeWidth={0.6} />
                  <text x={t.x} y={184} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{t.label}</text>
                </g>
              ))}
              {/* Feature extraction curve — starts high, plateaus */}
              <motion.path d="M95,100 C150,60 200,48 300,42 Q380,38 450,36"
                stroke={COLORS.feature} strokeWidth={2.5} fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 1 }} />
              <text x={460} y={32} fontSize={8} fontWeight={600} fill={COLORS.feature}>Feature Ext.</text>
              {/* Fine-tuning curve — starts low, overtakes */}
              <motion.path d="M95,140 C150,120 200,70 300,38 Q380,25 450,22"
                stroke={COLORS.finetune} strokeWidth={2.5} fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 1, delay: 0.2 }} />
              <text x={460} y={18} fontSize={8} fontWeight={600} fill={COLORS.finetune}>Fine-tuning</text>
              {/* Crossover zone */}
              <rect x={175} y={20} width={70} height={150} rx={0} fill={COLORS.data} fillOpacity={0.06} />
              <text x={210} y={155} textAnchor="middle" fontSize={7.5} fill={COLORS.data} fontWeight={600}>교차 지점</text>
              <text x={210} y={165} textAnchor="middle" fontSize={7} fill={COLORS.data}>~1K~5K</text>
              {/* Annotations */}
              <rect x={90} y={196} width={150} height={22} rx={4} fill={COLORS.feature} fillOpacity={0.08}
                stroke={COLORS.feature} strokeWidth={0.6} />
              <text x={165} y={211} textAnchor="middle" fontSize={7.5} fill={COLORS.feature}>소량: Feature Ext. 안전</text>
              <rect x={280} y={196} width={150} height={22} rx={4} fill={COLORS.finetune} fillOpacity={0.08}
                stroke={COLORS.finetune} strokeWidth={0.6} />
              <text x={355} y={211} textAnchor="middle" fontSize={7.5} fill={COLORS.finetune}>대량: Fine-tune 우세</text>
            </motion.g>
          )}

          {/* Step 3: Decision flowchart */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Start */}
              <rect x={190} y={5} width={140} height={28} rx={14}
                fill={COLORS.decision} fillOpacity={0.15} stroke={COLORS.decision} strokeWidth={1} />
              <text x={260} y={23} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.decision}>
                데이터 몇 개?
              </text>
              {/* Branch: few */}
              <line x1={220} y1={33} x2={100} y2={60} stroke="var(--muted-foreground)" strokeWidth={1} />
              <text x={140} y={48} fontSize={7} fill="var(--muted-foreground)">&lt; 1K</text>
              {/* Branch: medium */}
              <line x1={260} y1={33} x2={260} y2={60} stroke="var(--muted-foreground)" strokeWidth={1} />
              <text x={275} y={48} fontSize={7} fill="var(--muted-foreground)">1K~10K</text>
              {/* Branch: many */}
              <line x1={300} y1={33} x2={420} y2={60} stroke="var(--muted-foreground)" strokeWidth={1} />
              <text x={380} y={48} fontSize={7} fill="var(--muted-foreground)">&gt; 10K</text>
              {/* Few data path */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.1 }}>
                <rect x={30} y={62} width={140} height={32} rx={6}
                  fill={COLORS.feature} fillOpacity={0.12} stroke={COLORS.feature} strokeWidth={1} />
                <text x={100} y={82} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.feature}>
                  Feature Extraction
                </text>
              </motion.g>
              {/* Medium data path — domain check */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <rect x={185} y={62} width={150} height={28} rx={14}
                  fill={COLORS.data} fillOpacity={0.1} stroke={COLORS.data} strokeWidth={1} />
                <text x={260} y={80} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.data}>
                  도메인 유사?
                </text>
                {/* Yes */}
                <line x1={220} y1={90} x2={160} y2={115} stroke="var(--muted-foreground)" strokeWidth={0.8} />
                <text x={175} y={105} fontSize={7} fill="var(--muted-foreground)">Yes</text>
                <rect x={80} y={115} width={140} height={28} rx={6}
                  fill={COLORS.feature} fillOpacity={0.08} stroke={COLORS.feature} strokeWidth={0.8} />
                <text x={150} y={133} textAnchor="middle" fontSize={8} fill={COLORS.feature}>상위 블록만 Fine-tune</text>
                {/* No */}
                <line x1={300} y1={90} x2={360} y2={115} stroke="var(--muted-foreground)" strokeWidth={0.8} />
                <text x={340} y={105} fontSize={7} fill="var(--muted-foreground)">No</text>
                <rect x={290} y={115} width={140} height={28} rx={6}
                  fill={COLORS.data} fillOpacity={0.08} stroke={COLORS.data} strokeWidth={0.8} />
                <text x={360} y={133} textAnchor="middle" fontSize={8} fill={COLORS.data}>Gradual Unfreezing</text>
              </motion.g>
              {/* Many data path */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={360} y={62} width={130} height={32} rx={6}
                  fill={COLORS.finetune} fillOpacity={0.12} stroke={COLORS.finetune} strokeWidth={1} />
                <text x={425} y={82} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.finetune}>
                  Full Fine-tuning
                </text>
              </motion.g>
              {/* Bottom summary */}
              <rect x={50} y={160} width={420} height={50} rx={8}
                fill="var(--muted)" fillOpacity={0.1} stroke="var(--border)" strokeWidth={0.6} />
              <text x={260} y={178} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
                실전 원칙: 단순한 것부터 시작
              </text>
              <text x={260} y={193} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                Feature Extraction → 성능 부족 시 Gradual Unfreezing → 마지막에 Full Fine-tune
              </text>
              <text x={260} y={205} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                검증 loss 모니터링 — overfitting 조짐 시 더 많이 freeze
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="arrFvF" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
