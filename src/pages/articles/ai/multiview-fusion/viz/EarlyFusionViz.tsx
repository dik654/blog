import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, C, CHANNELS } from './EarlyFusionVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function EarlyFusionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Channel Concatenation */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* View 1 — 3채널 스택 */}
              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.1 }}>
                <text x={60} y={14} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={C.view1}>View 1 (H×W×3)</text>
                {CHANNELS.map((ch, i) => (
                  <g key={`v1-${i}`}>
                    <rect x={20 + i * 6} y={22 + i * 6} width={60} height={40} rx={3}
                      fill={ch.color + '20'} stroke={ch.color} strokeWidth={1} />
                    <text x={50 + i * 6} y={47 + i * 6} textAnchor="middle" fontSize={8}
                      fill={ch.color} fontWeight={600}>{ch.label}</text>
                  </g>
                ))}
              </motion.g>

              {/* View 2 — 3채널 스택 */}
              <motion.g initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <text x={200} y={14} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={C.view2}>View 2 (H×W×3)</text>
                {CHANNELS.map((ch, i) => (
                  <g key={`v2-${i}`}>
                    <rect x={160 + i * 6} y={22 + i * 6} width={60} height={40} rx={3}
                      fill={ch.color + '20'} stroke={ch.color} strokeWidth={1} />
                    <text x={190 + i * 6} y={47 + i * 6} textAnchor="middle" fontSize={8}
                      fill={ch.color} fontWeight={600}>{ch.label}</text>
                  </g>
                ))}
              </motion.g>

              {/* 화살표 → Concat */}
              <motion.line x1={100} y1={75} x2={158} y2={100}
                stroke={C.fuse} strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.4 }} />
              <motion.line x1={210} y1={75} x2={175} y2={100}
                stroke={C.fuse} strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.4 }} />

              {/* Concat 박스 */}
              <motion.g initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ transformOrigin: '165px 115px' }} transition={{ ...sp, delay: 0.5 }}>
                <ActionBox x={120} y={100} w={90} h={32} label="Concat" sub="dim=channel" color={C.fuse} />
              </motion.g>

              {/* 6채널 결과 */}
              <motion.g initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <rect x={110} y={145} width={110} height={30} rx={6}
                  fill={C.fuse + '15'} stroke={C.fuse} strokeWidth={1.5} />
                <text x={165} y={164} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={C.fuse}>H × W × 6</text>
              </motion.g>

              {/* CNN 백본 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}>
                <ModuleBox x={310} y={50} w={140} h={48} label="CNN Backbone" sub="conv1: in_ch=6" color={C.backbone} />
                <line x1={222} y1={115} x2={308} y2={80} stroke={C.backbone}
                  strokeWidth={1} strokeDasharray="3 2" />
                <DataBox x={340} y={120} w={80} h={28} label="Feature" sub="d-dim" color={C.backbone} />
                <DataBox x={340} y={165} w={80} h={28} label="Prediction" sub="class" color={C.cls} />
                <line x1={380} y1={150} x2={380} y2={163} stroke={C.cls}
                  strokeWidth={1} strokeDasharray="2 2" />
              </motion.g>
            </motion.g>
          )}

          {/* Step 1: Siamese Network */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 공유 백본 표시 */}
              <motion.rect x={155} y={8} width={170} height={26} rx={13}
                fill={C.siamese + '12'} stroke={C.siamese} strokeWidth={1}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                style={{ transformOrigin: '240px 21px' }} transition={{ delay: 0.1 }} />
              <text x={240} y={25} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.siamese}>Shared Weights (동일 백본)</text>

              {/* View 1 경로 */}
              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <DataBox x={20} y={50} w={70} h={28} label="View 1" sub="H×W×3" color={C.view1} />
                <ModuleBox x={120} y={44} w={100} h={40} label="Backbone" sub="ResNet/EfficientNet" color={C.siamese} />
                <line x1={92} y1={64} x2={118} y2={64} stroke={C.view1} strokeWidth={1.2} />
                <DataBox x={250} y={50} w={70} h={28} label="f1" sub="피처 벡터" color={C.view1} />
                <line x1={222} y1={64} x2={248} y2={64} stroke={C.siamese} strokeWidth={1.2} />
              </motion.g>

              {/* View 2 경로 */}
              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.35 }}>
                <DataBox x={20} y={110} w={70} h={28} label="View 2" sub="H×W×3" color={C.view2} />
                <ModuleBox x={120} y={104} w={100} h={40} label="Backbone" sub="가중치 공유" color={C.siamese} />
                <line x1={92} y1={124} x2={118} y2={124} stroke={C.view2} strokeWidth={1.2} />
                <DataBox x={250} y={110} w={70} h={28} label="f2" sub="피처 벡터" color={C.view2} />
                <line x1={222} y1={124} x2={248} y2={124} stroke={C.siamese} strokeWidth={1.2} />
              </motion.g>

              {/* 가중치 공유 연결선 */}
              <motion.line x1={170} y1={86} x2={170} y2={102}
                stroke={C.siamese} strokeWidth={1} strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.5 }} />
              <text x={182} y={98} fontSize={7} fill={C.siamese}>share</text>

              {/* Concat → 분류 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}>
                <ActionBox x={345} y={70} w={55} h={32} label="Concat" color={C.fuse} />
                <line x1={322} y1={64} x2={343} y2={82} stroke={C.view1} strokeWidth={1} />
                <line x1={322} y1={124} x2={343} y2={90} stroke={C.view2} strokeWidth={1} />

                <ModuleBox x={420} y={70} w={50} h={32} label="FC" sub="분류" color={C.cls} />
                <line x1={402} y1={86} x2={418} y2={86} stroke={C.cls} strokeWidth={1} />
              </motion.g>

              {/* 아래 설명 */}
              <motion.text x={240} y={170} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                동일 가중치로 두 뷰 인코딩 → 구조적 유사성 학습에 유리
              </motion.text>
            </motion.g>
          )}

          {/* Step 2: 장단점 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 장점 영역 */}
              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.1 }}>
                <rect x={20} y={20} width={200} height={80} rx={8}
                  fill="#22c55e08" stroke="#22c55e" strokeWidth={1} />
                <text x={120} y={40} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#22c55e">장점</text>

                {/* 저수준 피처 상호작용 */}
                <rect x={35} y={50} width={170} height={18} rx={4}
                  fill="#22c55e10" />
                <text x={120} y={63} textAnchor="middle" fontSize={8}
                  fill="var(--foreground)">저수준 피처(엣지, 텍스처) 간 상호작용</text>
                <rect x={35} y={72} width={170} height={18} rx={4}
                  fill="#22c55e10" />
                <text x={120} y={85} textAnchor="middle" fontSize={8}
                  fill="var(--foreground)">초기 레이어부터 뷰 간 관계 학습</text>
              </motion.g>

              {/* 단점 영역 */}
              <motion.g initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.25 }}>
                <rect x={260} y={20} width={200} height={80} rx={8}
                  fill="#ef444408" stroke="#ef4444" strokeWidth={1} />
                <text x={360} y={40} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#ef4444">단점</text>

                <rect x={275} y={50} width={170} height={18} rx={4}
                  fill="#ef444410" />
                <text x={360} y={63} textAnchor="middle" fontSize={8}
                  fill="var(--foreground)">뷰 수 증가 → 입력 채널 비례 증가</text>
                <rect x={275} y={72} width={170} height={18} rx={4}
                  fill="#ef444410" />
                <text x={360} y={85} textAnchor="middle" fontSize={8}
                  fill="var(--foreground)">conv1 재학습 필수 (pretrained 무효)</text>
              </motion.g>

              {/* 아래: 채널 스케일 시각화 */}
              <motion.g initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <text x={240} y={130} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">뷰 수에 따른 입력 채널 변화</text>

                {[
                  { n: 1, ch: 3, w: 30 },
                  { n: 2, ch: 6, w: 60 },
                  { n: 4, ch: 12, w: 120 },
                  { n: 8, ch: 24, w: 200 },
                ].map((item, i) => (
                  <motion.g key={i} initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    style={{ transformOrigin: `${80}px ${148 + i * 18}px` }}
                    transition={{ delay: 0.6 + i * 0.1 }}>
                    <rect x={80} y={140 + i * 18} width={item.w} height={12} rx={3}
                      fill={C.fuse + '30'} stroke={C.fuse} strokeWidth={0.5} />
                    <text x={68} y={150 + i * 18} textAnchor="end" fontSize={8}
                      fill="var(--muted-foreground)">{item.n}뷰</text>
                    <text x={85 + item.w} y={150 + i * 18} fontSize={8}
                      fill={C.fuse} fontWeight={600}>{item.ch}ch</text>
                  </motion.g>
                ))}
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
