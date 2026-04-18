import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './OverviewVizData';

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrOv" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 전체 파이프라인 구조도 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 6 modules in a flow */}
              <DataBox x={10} y={40} w={72} h={34} label="Dataset" color={COLORS.data} />
              <line x1={84} y1={57} x2={100} y2={57} stroke={COLORS.flow} strokeWidth={1} markerEnd="url(#arrOv)" />
              <ModuleBox x={104} y={33} w={80} h={48} label="DataLoader" sub="batch, shuffle" color={COLORS.loader} />
              <line x1={186} y1={57} x2={202} y2={57} stroke={COLORS.flow} strokeWidth={1} markerEnd="url(#arrOv)" />
              <ModuleBox x={206} y={33} w={72} h={48} label="Model" sub="forward()" color={COLORS.model} />
              <line x1={280} y1={57} x2={296} y2={57} stroke={COLORS.flow} strokeWidth={1} markerEnd="url(#arrOv)" />
              <ActionBox x={300} y={38} w={64} h={38} label="Loss" sub="criterion" color={COLORS.loss} />
              <line x1={366} y1={57} x2={382} y2={57} stroke={COLORS.flow} strokeWidth={1} markerEnd="url(#arrOv)" />
              <ActionBox x={386} y={38} w={72} h={38} label="Optimizer" sub="Adam/SGD" color={COLORS.optim} />
              {/* Scheduler below optimizer */}
              <line x1={422} y1={78} x2={422} y2={100} stroke={COLORS.flow} strokeWidth={1} markerEnd="url(#arrOv)" />
              <StatusBox x={372} y={104} w={100} h={48} label="Scheduler" sub="LR 조절" color={COLORS.sched} progress={0.6} />
              {/* Feedback arrow: optimizer → model */}
              <path d="M386,76 L386,180 L242,180 L242,82" fill="none" stroke={COLORS.optim} strokeWidth={1.2} strokeDasharray="4 3" markerEnd="url(#arrOv)" />
              <text x={314} y={194} textAnchor="middle" fontSize={9} fill={COLORS.optim} fontWeight={600}>weight update (반복)</text>
            </motion.g>
          )}

          {/* Step 1: Forward pass highlighted */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={50} w={80} h={34} label="Batch" sub="(X, y)" color={COLORS.loader} outlined />
              <motion.line x1={104} y1={67} x2={160} y2={67} stroke={COLORS.model} strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.6 }}
                markerEnd="url(#arrOv)" />
              <ModuleBox x={164} y={43} w={120} h={48} label="Model" sub="nn.Module" color={COLORS.model} />
              <motion.line x1={288} y1={67} x2={344} y2={67} stroke={COLORS.model} strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.6, delay: 0.2 }}
                markerEnd="url(#arrOv)" />
              <DataBox x={348} y={50} w={100} h={34} label="logits" sub="예측값 텐서" color={COLORS.model} outlined />
              {/* GPU memory bar */}
              <rect x={140} y={120} width={240} height={8} rx={4} fill="var(--border)" opacity={0.3} />
              <motion.rect x={140} y={120} width={0} height={8} rx={4} fill={COLORS.model} opacity={0.6}
                animate={{ width: 200 }} transition={{ ...sp, duration: 0.8, delay: 0.3 }} />
              <text x={260} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                GPU 메모리 사용: activation 저장 (backward에 필요)
              </text>
            </motion.g>
          )}

          {/* Step 2: Backward pass */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={30} y={50} w={90} h={34} label="logits" sub="예측값" color={COLORS.model} />
              <DataBox x={30} y={100} w={90} h={34} label="target" sub="정답" color={COLORS.data} />
              <line x1={124} y1={67} x2={164} y2={80} stroke={COLORS.flow} strokeWidth={1} markerEnd="url(#arrOv)" />
              <line x1={124} y1={117} x2={164} y2={100} stroke={COLORS.flow} strokeWidth={1} markerEnd="url(#arrOv)" />
              <ActionBox x={168} y={72} w={100} h={38} label="Loss Function" sub="CrossEntropy" color={COLORS.loss} />
              <motion.line x1={272} y1={91} x2={340} y2={91} stroke={COLORS.loss} strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.5 }}
                markerEnd="url(#arrOv)" />
              <DataBox x={344} y={74} w={80} h={34} label="loss" sub="scalar" color={COLORS.loss} outlined />
              {/* backward arrow */}
              <motion.path d="M384,110 L384,150 L120,150 L120,86"
                fill="none" stroke={COLORS.loss} strokeWidth={1.5} strokeDasharray="5 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, duration: 0.8, delay: 0.4 }}
                markerEnd="url(#arrOv)" />
              <text x={252} y={166} textAnchor="middle" fontSize={9} fill={COLORS.loss} fontWeight={600}>
                loss.backward() → 모든 param에 .grad 기록
              </text>
            </motion.g>
          )}

          {/* Step 3: Update step */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 3 actions in sequence */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0 }}>
                <ActionBox x={20} y={55} w={130} h={42} label="optimizer.step()" sub="gradient → weight" color={COLORS.optim} />
              </motion.g>
              <line x1={154} y1={76} x2={178} y2={76} stroke={COLORS.flow} strokeWidth={1} markerEnd="url(#arrOv)" />
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <ActionBox x={182} y={55} w={130} h={42} label="scheduler.step()" sub="LR 조절" color={COLORS.sched} />
              </motion.g>
              <line x1={316} y1={76} x2={340} y2={76} stroke={COLORS.flow} strokeWidth={1} markerEnd="url(#arrOv)" />
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <ActionBox x={344} y={55} w={140} h={42} label="optimizer.zero_grad()" sub="gradient 초기화" color={COLORS.flow} />
              </motion.g>
              {/* Cycle arrow back */}
              <motion.path d="M260,100 L260,140 C260,160 260,160 180,160 L100,160 L100,140"
                fill="none" stroke={COLORS.optim} strokeWidth={1.2} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, duration: 0.7, delay: 0.5 }}
                markerEnd="url(#arrOv)" />
              <text x={260} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                매 배치마다 이 3단계 반복 → 1 epoch = 전체 데이터 1회 순회
              </text>
            </motion.g>
          )}

          {/* Step 4: Competition speed setup */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Timeline bar */}
              <rect x={40} y={50} width={440} height={30} rx={6} fill="var(--border)" opacity={0.15} />
              <motion.rect x={40} y={50} width={0} height={30} rx={6} fill={COLORS.loader} opacity={0.5}
                animate={{ width: 110 }} transition={{ ...sp, duration: 0.6 }} />
              <motion.rect x={150} y={50} width={0} height={30} rx={6} fill={COLORS.optim} opacity={0.5}
                animate={{ width: 330 }} transition={{ ...sp, duration: 0.6, delay: 0.2 }} />
              <text x={95} y={70} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">15분</text>
              <text x={315} y={70} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">나머지 시간: 실험</text>
              <text x={95} y={98} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">뼈대 코드 완성</text>
              <text x={315} y={98} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">데이터 분석 · 피처 · 하이퍼파라미터</text>

              {[
                { label: 'Dataset', x: 50, color: COLORS.data },
                { label: 'Loader', x: 130, color: COLORS.loader },
                { label: 'Model', x: 210, color: COLORS.model },
                { label: 'Loss+Opt', x: 290, color: COLORS.optim },
                { label: 'Loop', x: 370, color: COLORS.loss },
              ].map((m, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.08 }}>
                  <DataBox x={m.x} y={120} w={70} h={30} label={m.label} color={m.color} />
                </motion.g>
              ))}
              <text x={260} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                이 5개 모듈 구조를 외워두면 대회 첫 제출까지 30분
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
