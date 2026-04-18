import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, C, WEIGHT_EXAMPLES } from './LateFusionVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function LateFusionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 기본 Late Fusion 아키텍처 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* View 1 경로 — 상단 */}
              <motion.g initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.1 }}>
                <DataBox x={10} y={25} w={65} h={28} label="View 1" sub="H×W×3" color={C.view1} />
                <line x1={77} y1={39} x2={100} y2={39} stroke={C.view1} strokeWidth={1.2} />
                <ModuleBox x={102} y={18} w={105} h={44} label="Backbone A" sub="ResNet-50" color={C.view1} />
                <line x1={209} y1={39} x2={230} y2={39} stroke={C.view1} strokeWidth={1.2} />
                <DataBox x={232} y={25} w={65} h={28} label="f1" sub="2048-d" color={C.view1} />
              </motion.g>

              {/* View 2 경로 — 하단 */}
              <motion.g initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.25 }}>
                <DataBox x={10} y={90} w={65} h={28} label="View 2" sub="H×W×3" color={C.view2} />
                <line x1={77} y1={104} x2={100} y2={104} stroke={C.view2} strokeWidth={1.2} />
                <ModuleBox x={102} y={83} w={105} h={44} label="Backbone B" sub="ResNet-50" color={C.view2} />
                <line x1={209} y1={104} x2={230} y2={104} stroke={C.view2} strokeWidth={1.2} />
                <DataBox x={232} y={90} w={65} h={28} label="f2" sub="2048-d" color={C.view2} />
              </motion.g>

              {/* 독립 백본 강조 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={98} y={14} width={113} height={118} rx={10}
                  fill="none" stroke={C.backbone} strokeWidth={1} strokeDasharray="4 3" />
                <text x={154} y={142} textAnchor="middle" fontSize={8}
                  fill={C.backbone}>독립 파라미터</text>
              </motion.g>

              {/* Concat → FC */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}>
                <line x1={299} y1={39} x2={330} y2={68} stroke={C.view1} strokeWidth={1} />
                <line x1={299} y1={104} x2={330} y2={78} stroke={C.view2} strokeWidth={1} />
                <ActionBox x={332} y={55} w={60} h={32} label="Concat" sub="4096-d" color={C.fuse} />
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}>
                <line x1={394} y1={71} x2={410} y2={71} stroke={C.cls} strokeWidth={1.2} />
                <ModuleBox x={412} y={52} w={55} h={38} label="FC Head" sub="분류" color={C.cls} />
              </motion.g>

              {/* 수식 */}
              <motion.text x={240} y={190} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                f = [f1 ; f2] → FC → softmax → class
              </motion.text>
            </motion.g>
          )}

          {/* Step 1: 가중 결합 변형 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 수식 */}
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">f = w1 · f1 + w2 · f2</text>
              <text x={240} y={35} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">w1, w2는 학습 가능한 파라미터 (softmax로 정규화)</text>

              {/* 가중치 시각화 */}
              {WEIGHT_EXAMPLES.map((ex, i) => (
                <motion.g key={i} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.15 }}>
                  <text x={30} y={72 + i * 58} fontSize={8} fill="var(--muted-foreground)">
                    {ex.desc}
                  </text>

                  {/* w1 바 */}
                  <rect x={30} y={78 + i * 58} width={180} height={14} rx={3}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <motion.rect x={30} y={78 + i * 58} width={180 * ex.w1} height={14} rx={3}
                    fill={C.view1 + '40'} stroke={C.view1} strokeWidth={0.8}
                    initial={{ width: 0 }} animate={{ width: 180 * ex.w1 }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }} />
                  <text x={35} y={89 + i * 58} fontSize={8} fontWeight={600}
                    fill={C.view1}>w1={ex.w1}</text>

                  {/* w2 바 */}
                  <rect x={240} y={78 + i * 58} width={180} height={14} rx={3}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <motion.rect x={240} y={78 + i * 58} width={180 * ex.w2} height={14} rx={3}
                    fill={C.view2 + '40'} stroke={C.view2} strokeWidth={0.8}
                    initial={{ width: 0 }} animate={{ width: 180 * ex.w2 }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }} />
                  <text x={245} y={89 + i * 58} fontSize={8} fontWeight={600}
                    fill={C.view2}>w2={ex.w2}</text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {/* Step 2: 장단점 비교 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 장점 */}
              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.1 }}>
                <rect x={20} y={15} width={200} height={90} rx={8}
                  fill="#22c55e08" stroke="#22c55e" strokeWidth={1} />
                <text x={120} y={35} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#22c55e">장점</text>

                {[
                  '각 뷰의 독립적 표현 학습',
                  'ImageNet pretrained 모델 그대로 사용',
                  '뷰별 최적 백본 선택 가능',
                ].map((t, i) => (
                  <g key={i}>
                    <rect x={30} y={44 + i * 18} width={180} height={14} rx={3}
                      fill="#22c55e0a" />
                    <text x={120} y={55 + i * 18} textAnchor="middle" fontSize={8}
                      fill="var(--foreground)">{t}</text>
                  </g>
                ))}
              </motion.g>

              {/* 단점 */}
              <motion.g initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.25 }}>
                <rect x={260} y={15} width={200} height={90} rx={8}
                  fill="#ef444408" stroke="#ef4444" strokeWidth={1} />
                <text x={360} y={35} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#ef4444">단점</text>

                {[
                  '뷰 간 저수준 상호작용 불가',
                  '파라미터 수 = 백본 × 뷰 수',
                  '정보 손실: 피처 압축 후 결합',
                ].map((t, i) => (
                  <g key={i}>
                    <rect x={270} y={44 + i * 18} width={180} height={14} rx={3}
                      fill="#ef44440a" />
                    <text x={360} y={55 + i * 18} textAnchor="middle" fontSize={8}
                      fill="var(--foreground)">{t}</text>
                  </g>
                ))}
              </motion.g>

              {/* Early vs Late 비교 다이어그램 */}
              <motion.g initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <text x={240} y={130} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">정보 흐름 비교</text>

                {/* Early */}
                <text x={60} y={150} textAnchor="middle" fontSize={8}
                  fill={C.view1} fontWeight={600}>Early</text>
                <rect x={20} y={155} width={80} height={8} rx={2}
                  fill={C.view1 + '30'} stroke={C.view1} strokeWidth={0.8} />
                <text x={60} y={178} textAnchor="middle" fontSize={7}
                  fill="var(--muted-foreground)">입력 → 결합 → 백본</text>

                {/* Late */}
                <text x={240} y={150} textAnchor="middle" fontSize={8}
                  fill={C.view2} fontWeight={600}>Late</text>
                <rect x={180} y={155} width={35} height={8} rx={2}
                  fill={C.view1 + '30'} stroke={C.view1} strokeWidth={0.8} />
                <rect x={220} y={155} width={8} height={8} rx={2}
                  fill={C.fuse + '50'} stroke={C.fuse} strokeWidth={0.8} />
                <rect x={233} y={155} width={35} height={8} rx={2}
                  fill={C.view2 + '30'} stroke={C.view2} strokeWidth={0.8} />
                <text x={240} y={178} textAnchor="middle" fontSize={7}
                  fill="var(--muted-foreground)">입력 → 백본 → 결합</text>

                {/* Attention */}
                <text x={415} y={150} textAnchor="middle" fontSize={8}
                  fill={C.fuse} fontWeight={600}>Attention</text>
                <rect x={375} y={155} width={80} height={8} rx={2}
                  fill={C.fuse + '20'} stroke={C.fuse} strokeWidth={0.8} />
                {/* 교차 화살표 */}
                <line x1={395} y1={158} x2={435} y2={158} stroke={C.fuse}
                  strokeWidth={0.8} strokeDasharray="2 1" />
                <text x={415} y={178} textAnchor="middle" fontSize={7}
                  fill="var(--muted-foreground)">백본 → 교차참조 → 결합</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
