import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './CNN3DVizData';

export default function CNN3DViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arr3d" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 2D vs 3D Conv */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                2D Conv vs 3D Conv
              </text>

              {/* 2D Conv */}
              <text x={120} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.conv2d}>2D Conv</text>
              <rect x={55} y={50} width={130} height={90} rx={6} fill={`${COLORS.conv2d}08`} stroke={COLORS.conv2d} strokeWidth={1} />
              {/* 단일 프레임 그리드 */}
              {[0, 1, 2, 3, 4].map((r) =>
                [0, 1, 2, 3, 4].map((c) => (
                  <rect key={`${r}-${c}`} x={65 + c * 22} y={58 + r * 14} width={18} height={10} rx={1}
                    fill={r < 3 && c < 3 ? `${COLORS.conv2d}30` : `${COLORS.conv2d}10`}
                    stroke={r < 3 && c < 3 ? COLORS.conv2d : 'none'} strokeWidth={r < 3 && c < 3 ? 0.8 : 0} />
                ))
              )}
              <text x={120} y={150} textAnchor="middle" fontSize={9} fill={COLORS.conv2d} fontWeight={600}>커널: k x k</text>
              <text x={120} y={163} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">공간만 처리</text>

              {/* 화살표 */}
              <text x={240} y={100} textAnchor="middle" fontSize={16} fontWeight={700} fill={COLORS.conv3d}>→</text>

              {/* 3D Conv */}
              <text x={360} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.conv3d}>3D Conv</text>
              <rect x={290} y={50} width={140} height={110} rx={6} fill={`${COLORS.conv3d}08`} stroke={COLORS.conv3d} strokeWidth={1.5} />
              {/* 3D 스택 */}
              {[0, 1, 2].map((t) => (
                <motion.g key={t} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: t * 0.1 }}>
                  {[0, 1, 2].map((r) =>
                    [0, 1, 2].map((c) => (
                      <rect key={`${t}-${r}-${c}`}
                        x={302 + c * 22 + t * 10} y={60 + r * 14 + t * 8}
                        width={18} height={10} rx={1}
                        fill={`${COLORS.conv3d}25`} stroke={COLORS.conv3d} strokeWidth={0.6} />
                    ))
                  )}
                </motion.g>
              ))}
              <text x={360} y={170} textAnchor="middle" fontSize={9} fill={COLORS.conv3d} fontWeight={600}>커널: d x k x k</text>
              <text x={360} y={183} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">시간 + 공간 동시 처리</text>

              {/* 하단 비교 */}
              <rect x={60} y={195} width={360} height={30} rx={8} fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={214} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--muted-foreground)">
                d = 시간 방향 커널 크기 (보통 3). 연속 프레임의 움직임 패턴을 직접 학습
              </text>
            </motion.g>
          )}

          {/* Step 1: C3D */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.c3d}>
                C3D — 최초의 3D ConvNet (2015)
              </text>

              {/* 파이프라인 */}
              <DataBox x={10} y={45} w={70} h={32} label="16 Frames" sub="입력 클립" color={COLORS.c3d} />

              {['Conv1', 'Conv2', 'Conv3', 'Conv4', 'Conv5'].map((name, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  {i > 0 && <line x1={70 + (i - 1) * 82 + 10} y1={108} x2={74 + i * 82} y2={108} stroke={COLORS.flow} strokeWidth={0.8} markerEnd="url(#arr3d)" />}
                  <ActionBox x={74 + i * 82} y={90} w={72} h={36} label={name} sub="3x3x3" color={COLORS.c3d} />
                </motion.g>
              ))}
              <line x1={82} y1={61} x2={100} y2={100} stroke={COLORS.flow} strokeWidth={0.8} markerEnd="url(#arr3d)" />

              {/* FC + output */}
              <line x1={483} y1={108} x2={483} y2={145} stroke={COLORS.flow} strokeWidth={0.8} markerEnd="url(#arr3d)" />
              <ModuleBox x={440} y={150} w={80} h={36} label="FC + Softmax" sub="클래스 예측" color={COLORS.c3d} />

              {/* 장단점 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.5 }}>
                <DataBox x={20} y={155} w={140} h={28} label="단순 + 시공간 직접 추출" color={COLORS.c3d} />
                <AlertBox x={180} y={150} w={180} h={36} label="2D pretrained 활용 불가" sub="대규모 데이터 필요" color={COLORS.r21d} />
              </motion.g>

              <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                Sports-1M 데이터셋으로 학습. 모든 conv를 3x3x3으로 통일한 최초 성공 사례
              </text>
            </motion.g>
          )}

          {/* Step 2: I3D */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.i3d}>
                I3D — Inflated 3D ConvNet (2017)
              </text>

              {/* Inflation 과정 */}
              <text x={120} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.conv2d}>2D Pretrained</text>
              <rect x={55} y={50} width={130} height={50} rx={6} fill={`${COLORS.conv2d}10`} stroke={COLORS.conv2d} strokeWidth={1} />
              <text x={120} y={72} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.conv2d}>k x k</text>
              <text x={120} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">ImageNet 학습 완료</text>

              {/* 화살표: inflate */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                <line x1={190} y1={75} x2={250} y2={75} stroke={COLORS.i3d} strokeWidth={1.5} markerEnd="url(#arr3d)" />
                <text x={220} y={68} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS.i3d}>Inflate</text>
                <text x={220} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">W / d 복제</text>
              </motion.g>

              <text x={360} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.i3d}>3D Inflated</text>
              <rect x={285} y={50} width={150} height={55} rx={6} fill={`${COLORS.i3d}10`} stroke={COLORS.i3d} strokeWidth={1.5} />
              {/* 3개 레이어 */}
              {[0, 1, 2].map((t) => (
                <motion.rect key={t} x={300 + t * 12} y={60 + t * 6} width={100} height={24} rx={3}
                  fill={`${COLORS.i3d}15`} stroke={COLORS.i3d} strokeWidth={0.6}
                  initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.4 + t * 0.08 }}
                />
              ))}
              <text x={360} y={84} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.i3d}>d x k x k</text>

              {/* Two-Stream */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.5 }}>
                <text x={240} y={125} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">Two-Stream I3D</text>
                <ModuleBox x={50} y={135} w={160} h={44} label="RGB Stream" sub="외형 + 공간 피처" color={COLORS.i3d} />
                <ModuleBox x={270} y={135} w={160} h={44} label="Optical Flow" sub="움직임 피처" color={COLORS.r21d} />
                <line x1={130} y1={182} x2={240} y2={202} stroke={COLORS.flow} strokeWidth={0.8} markerEnd="url(#arr3d)" />
                <line x1={350} y1={182} x2={240} y2={202} stroke={COLORS.flow} strokeWidth={0.8} markerEnd="url(#arr3d)" />
                <DataBox x={185} y={206} w={110} h={26} label="Late Fusion" sub="예측 결합" color={COLORS.i3d} />
              </motion.g>
            </motion.g>
          )}

          {/* Step 3: SlowFast */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                SlowFast Networks (2019)
              </text>

              {/* Slow Pathway */}
              <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={30} y={35} width={420} height={65} rx={8}
                  fill={`${COLORS.slow}06`} stroke={COLORS.slow} strokeWidth={1.2} />
                <text x={50} y={52} fontSize={10} fontWeight={700} fill={COLORS.slow}>Slow Pathway</text>
                <text x={50} y={65} fontSize={8} fill="var(--muted-foreground)">4 fps | 채널 많음 (80%)</text>

                {/* 4 프레임 */}
                {[0, 1, 2, 3].map((i) => (
                  <rect key={i} x={200 + i * 55} y={42} width={40} height={50} rx={4}
                    fill={`${COLORS.slow}15`} stroke={COLORS.slow} strokeWidth={0.8} />
                ))}
                <text x={330} y={72} textAnchor="middle" fontSize={7} fill={COLORS.slow}>공간 의미 (무엇이)</text>
              </motion.g>

              {/* Fast Pathway */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={30} y={110} width={420} height={65} rx={8}
                  fill={`${COLORS.fast}06`} stroke={COLORS.fast} strokeWidth={1.2} />
                <text x={50} y={127} fontSize={10} fontWeight={700} fill={COLORS.fast}>Fast Pathway</text>
                <text x={50} y={140} fontSize={8} fill="var(--muted-foreground)">32 fps | 채널 적음 (1/8)</text>

                {/* 많은 프레임 */}
                {Array.from({ length: 16 }).map((i, idx) => (
                  <rect key={idx} x={180 + idx * 16} y={117} width={11} height={50} rx={2}
                    fill={`${COLORS.fast}15`} stroke={COLORS.fast} strokeWidth={0.5} />
                ))}
                <text x={310} y={148} textAnchor="middle" fontSize={7} fill={COLORS.fast}>시간 동작 (어떻게)</text>
              </motion.g>

              {/* Lateral connection */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                {[0, 1, 2].map((i) => (
                  <line key={i} x1={240 + i * 70} y1={110} x2={240 + i * 70} y2={100}
                    stroke={COLORS.fast} strokeWidth={1.2} strokeDasharray="3 2" markerEnd="url(#arr3d)" />
                ))}
                <text x={310} y={108} textAnchor="middle" fontSize={7} fontWeight={600} fill={COLORS.fast}>Lateral Connection</text>
              </motion.g>

              {/* 결합 */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.5 }}>
                <line x1={240} y1={178} x2={240} y2={195} stroke={COLORS.flow} strokeWidth={1} markerEnd="url(#arr3d)" />
                <DataBox x={170} y={198} w={140} h={28} label="예측 결합" sub="파라미터 80% Slow" color={COLORS.slow} />
              </motion.g>
            </motion.g>
          )}

          {/* Step 4: R(2+1)D */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.r21d}>
                R(2+1)D — 공간/시간 분리 (2018)
              </text>

              {/* 3D Conv 하나 */}
              <text x={100} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.conv3d}>기존 3D Conv</text>
              <rect x={45} y={55} width={110} height={70} rx={6} fill={`${COLORS.conv3d}10`} stroke={COLORS.conv3d} strokeWidth={1} />
              {[0, 1, 2].map((t) => (
                <rect key={t} x={55 + t * 10} y={62 + t * 8} width={70} height={35} rx={3}
                  fill={`${COLORS.conv3d}15`} stroke={COLORS.conv3d} strokeWidth={0.5} />
              ))}
              <text x={100} y={112} textAnchor="middle" fontSize={8} fill={COLORS.conv3d}>3 x 3 x 3 = 27</text>

              {/* 화살표 */}
              <line x1={160} y1={90} x2={190} y2={90} stroke={COLORS.r21d} strokeWidth={1.5} markerEnd="url(#arr3d)" />
              <text x={175} y={82} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS.r21d}>분해</text>

              {/* 공간 Conv */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <text x={265} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.i3d}>Spatial Conv</text>
                <rect x={210} y={50} width={110} height={40} rx={6} fill={`${COLORS.i3d}10`} stroke={COLORS.i3d} strokeWidth={1.2} />
                <text x={265} y={72} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.i3d}>1 x 3 x 3</text>
                <text x={265} y={84} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">공간 패턴</text>
              </motion.g>

              {/* ReLU */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                <rect x={245} y={96} width={40} height={18} rx={9} fill={`${COLORS.r21d}20`} stroke={COLORS.r21d} strokeWidth={0.8} />
                <text x={265} y={108} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS.r21d}>ReLU</text>
                <text x={310} y={108} fontSize={7} fill="var(--muted-foreground)">비선형성 추가!</text>
              </motion.g>

              {/* 시간 Conv */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.35 }}>
                <text x={265} y={126} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.fast}>Temporal Conv</text>
                <rect x={210} y={132} width={110} height={40} rx={6} fill={`${COLORS.fast}10`} stroke={COLORS.fast} strokeWidth={1.2} />
                <text x={265} y={154} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.fast}>3 x 1 x 1</text>
                <text x={265} y={166} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">시간 패턴</text>
              </motion.g>

              {/* 비교 박스 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={350} y={55} width={120} height={120} rx={8}
                  fill="var(--muted)" fillOpacity={0.15} stroke="var(--border)" strokeWidth={0.5} />
                <text x={410} y={75} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">파라미터 비교</text>
                <text x={410} y={95} textAnchor="middle" fontSize={8} fill={COLORS.conv3d}>3D: 3x3x3 = 27</text>
                <text x={410} y={112} textAnchor="middle" fontSize={8} fill={COLORS.r21d}>R(2+1)D:</text>
                <text x={410} y={126} textAnchor="middle" fontSize={8} fill={COLORS.r21d}>(1x3x3)+(3x1x1)</text>
                <text x={410} y={140} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.r21d}>= 12 (56% 절감)</text>
                <text x={410} y={160} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">+ 비선형성 증가</text>
              </motion.g>

              <text x={240} y={208} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                분리 사이에 ReLU를 삽입해 표현력 향상 + 파라미터 절감을 동시 달성
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
