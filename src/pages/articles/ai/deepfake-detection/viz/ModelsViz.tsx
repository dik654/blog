import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './ModelsData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function ModelsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="md-arrow" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">XceptionNet 구조</text>

              {/* 입력 */}
              <DataBox x={15} y={48} w={65} h={28} label="299x299" sub="RGB" color={COLORS.xception} />

              {/* Entry Flow */}
              <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.15 }}>
                <line x1={82} y1={62} x2={100} y2={62}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#md-arrow)" />
                <rect x={105} y={42} width={80} height={38} rx={6}
                  fill={`${COLORS.xception}08`} stroke={COLORS.xception} strokeWidth={1} />
                <text x={145} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.xception}>Entry Flow</text>
                <text x={145} y={70} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Conv + MaxPool</text>
              </motion.g>

              {/* Middle Flow */}
              <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <line x1={188} y1={62} x2={206} y2={62}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#md-arrow)" />
                <rect x={210} y={42} width={95} height={38} rx={6}
                  fill={`${COLORS.xception}12`} stroke={COLORS.xception} strokeWidth={1.5} />
                <text x={257} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.xception}>Middle Flow</text>
                <text x={257} y={70} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">DW Sep Conv x8</text>
              </motion.g>

              {/* Exit Flow */}
              <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.45 }}>
                <line x1={308} y1={62} x2={326} y2={62}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#md-arrow)" />
                <rect x={330} y={42} width={80} height={38} rx={6}
                  fill={`${COLORS.xception}08`} stroke={COLORS.xception} strokeWidth={1} />
                <text x={370} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.xception}>Exit Flow</text>
                <text x={370} y={70} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Global AvgPool</text>
              </motion.g>

              {/* 출력 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <line x1={413} y1={62} x2={431} y2={62}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#md-arrow)" />
                <DataBox x={435} y={48} w={70} h={28} label="Real/Fake" sub="Binary" color={COLORS.highlight} />
              </motion.g>

              {/* Depthwise Separable Conv 설명 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.7 }}>
                <rect x={50} y={100} width={420} height={90} rx={8}
                  fill="var(--card)" stroke={COLORS.xception} strokeWidth={0.8} />
                <text x={260} y={120} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill={COLORS.xception}>Depthwise Separable Convolution</text>

                {/* Depthwise 단계 */}
                <rect x={70} y={130} width={130} height={45} rx={5}
                  fill={COLORS.xception} fillOpacity={0.06} stroke={COLORS.xception} strokeWidth={0.6} />
                <text x={135} y={148} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.xception}>Depthwise</text>
                <text x={135} y={162} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">채널별 독립 필터</text>

                <line x1={205} y1={152} x2={225} y2={152}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#md-arrow)" />

                {/* Pointwise 단계 */}
                <rect x={230} y={130} width={130} height={45} rx={5}
                  fill={COLORS.xception} fillOpacity={0.06} stroke={COLORS.xception} strokeWidth={0.6} />
                <text x={295} y={148} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.xception}>Pointwise</text>
                <text x={295} y={162} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">1x1 Conv 채널 결합</text>

                <text x={420} y={152} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={COLORS.highlight}>파라미터 8x 감소</text>
              </motion.g>

              <text x={260} y={215} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                FaceForensics++ 벤치마크 de facto 베이스라인 (2019~)
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">EfficientNet: Compound Scaling</text>

              {/* 3가지 스케일링 */}
              <text x={260} y={45} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">너비 + 깊이 + 해상도를 동시에 확대</text>

              {[
                { x: 30, label: '너비 (Width)', desc: '채널 수 증가', icon: '↔', color: '#3b82f6' },
                { x: 195, label: '깊이 (Depth)', desc: '레이어 수 증가', icon: '↕', color: '#10b981' },
                { x: 360, label: '해상도 (Res)', desc: '입력 크기 증가', icon: '⬜', color: '#f59e0b' },
              ].map((dim, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.15 + i * 0.15 }}>
                  <rect x={dim.x} y={55} width={140} height={50} rx={7}
                    fill={`${dim.color}08`} stroke={dim.color} strokeWidth={1.2} />
                  <text x={dim.x + 70} y={74} textAnchor="middle" fontSize={10} fontWeight={700}
                    fill={dim.color}>{dim.label}</text>
                  <text x={dim.x + 70} y={90} textAnchor="middle" fontSize={8}
                    fill="var(--muted-foreground)">{dim.desc}</text>
                </motion.g>
              ))}

              {/* B0 → B7 스케일 바 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <text x={260} y={128} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">B0 → B7 스케일 비교</text>
                {['B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'].map((b, i) => {
                  const w = 25 + i * 8;
                  const h = 16 + i * 3;
                  const x = 25 + i * 58;
                  const isB4 = i === 4;
                  return (
                    <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...sp, delay: 0.7 + i * 0.05 }}>
                      <rect x={x} y={140} width={w} height={h} rx={3}
                        fill={isB4 ? COLORS.highlight : COLORS.efficient}
                        fillOpacity={isB4 ? 0.2 : 0.08}
                        stroke={isB4 ? COLORS.highlight : COLORS.efficient}
                        strokeWidth={isB4 ? 2 : 0.8} />
                      <text x={x + w / 2} y={140 + h / 2 + 4} textAnchor="middle"
                        fontSize={isB4 ? 9 : 7.5}
                        fontWeight={isB4 ? 700 : 500}
                        fill={isB4 ? COLORS.highlight : COLORS.efficient}>{b}</text>
                    </motion.g>
                  );
                })}
              </motion.g>

              {/* B4 강조 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 1 }}>
                <line x1={269} y1={172} x2={269} y2={190}
                  stroke={COLORS.highlight} strokeWidth={1} strokeDasharray="2 2" />
                <rect x={195} y={192} width={150} height={32} rx={6}
                  fill={COLORS.highlight} fillOpacity={0.08} stroke={COLORS.highlight} strokeWidth={1.2} />
                <text x={270} y={206} textAnchor="middle" fontSize={8} fontWeight={700}
                  fill={COLORS.highlight}>B4 (380x380): 최적 지점</text>
                <text x={270} y={218} textAnchor="middle" fontSize={7}
                  fill="var(--muted-foreground)">정확도↑ 과적합↓ 균형</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">CLIP 기반 제로샷 딥페이크 탐지</text>

              {/* CLIP 구조 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.1 }}>
                <ModuleBox x={20} y={45} w={110} h={48} label="Image Encoder"
                  sub="ViT-L/14" color={COLORS.clip} />
              </motion.g>

              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <ModuleBox x={20} y={115} w={110} h={48} label="Text Encoder"
                  sub="Transformer" color={COLORS.clip} />
              </motion.g>

              {/* 프롬프트 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={155} y={115} width={190} height={48} rx={6}
                  fill={COLORS.clip} fillOpacity={0.06} stroke={COLORS.clip} strokeWidth={0.8} />
                <text x={250} y={132} textAnchor="middle" fontSize={7.5} fontWeight={600}
                  fill={COLORS.clip}>"a real photo of a person"</text>
                <text x={250} y={148} textAnchor="middle" fontSize={7.5} fontWeight={600}
                  fill={COLORS.highlight}>"a deepfake photo of a person"</text>
              </motion.g>

              {/* 코사인 유사도 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.45 }}>
                <line x1={135} y1={69} x2={375} y2={69}
                  stroke={COLORS.clip} strokeWidth={0.8} strokeDasharray="3 2" />
                <line x1={135} y1={139} x2={135} y2={69}
                  stroke={COLORS.clip} strokeWidth={0.8} strokeDasharray="3 2" />
                <line x1={375} y1={69} x2={375} y2={85}
                  stroke={COLORS.clip} strokeWidth={0.8} />

                <ActionBox x={340} y={85} w={100} h={35} label="cos 유사도"
                  sub="이미지 ↔ 텍스트" color={COLORS.clip} />
              </motion.g>

              {/* 제로샷 결과 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.6 }}>
                <line x1={390} y1={124} x2={390} y2={145}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#md-arrow)" />
                <rect x={340} y={148} width={100} height={42} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={390} y={165} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill="var(--foreground)">Real: 0.82</text>
                <text x={390} y={180} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={COLORS.highlight}>Fake: 0.34</text>
              </motion.g>

              {/* 장단점 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.75 }}>
                <rect x={50} y={185} width={250} height={48} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={70} y={202} fontSize={8} fontWeight={600} fill={COLORS.clip}>
                  장점: 학습 데이터 없이 탐지 가능
                </text>
                <text x={70} y={218} fontSize={8} fontWeight={600} fill={COLORS.highlight}>
                  한계: fine-tuned 모델 대비 정확도 낮음
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">앙상블: 다양성이 정확도를 만든다</text>

              {/* 다양한 백본 */}
              {[
                { x: 20, y: 45, label: 'XceptionNet', sub: '299x299', color: COLORS.xception },
                { x: 20, y: 100, label: 'EfficientNet-B4', sub: '380x380', color: COLORS.efficient },
                { x: 20, y: 155, label: 'CLIP ViT', sub: '224x224', color: COLORS.clip },
              ].map((model, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.1 + i * 0.12 }}>
                  <ModuleBox x={model.x} y={model.y} w={120} h={42} label={model.label}
                    sub={model.sub} color={model.color} />
                </motion.g>
              ))}

              {/* 각 모델 → 예측 확률 */}
              {[
                { y: 66, prob: 'P=0.85', color: COLORS.xception },
                { y: 121, prob: 'P=0.91', color: COLORS.efficient },
                { y: 176, prob: 'P=0.78', color: COLORS.clip },
              ].map((pred, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.35 + i * 0.1 }}>
                  <line x1={145} y1={pred.y} x2={200} y2={pred.y}
                    stroke="#888" strokeWidth={0.8} markerEnd="url(#md-arrow)" />
                  <DataBox x={205} y={pred.y - 14} w={70} h={28} label={pred.prob}
                    sub="fake 확률" color={pred.color} />
                </motion.g>
              ))}

              {/* 결합 방법 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.6 }}>
                {[0, 1, 2].map(i => (
                  <line key={i} x1={278} y1={[52, 107, 162][i]}
                    x2={315} y2={110}
                    stroke="#888" strokeWidth={0.6} markerEnd="url(#md-arrow)" />
                ))}
                <rect x={320} y={82} width={100} height={55} rx={8}
                  fill={COLORS.ensemble} fillOpacity={0.08} stroke={COLORS.ensemble} strokeWidth={1.5} />
                <text x={370} y={102} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill={COLORS.ensemble}>앙상블</text>
                <text x={370} y={116} textAnchor="middle" fontSize={7.5}
                  fill="var(--muted-foreground)">확률 평균</text>
                <text x={370} y={128} textAnchor="middle" fontSize={7.5}
                  fill="var(--muted-foreground)">또는 스태킹</text>
              </motion.g>

              {/* 최종 결과 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.75 }}>
                <line x1={425} y1={110} x2={450} y2={110}
                  stroke="#888" strokeWidth={0.8} markerEnd="url(#md-arrow)" />
                <DataBox x={455} y={96} w={55} h={28} label="P=0.88"
                  sub="최종" color={COLORS.highlight} outlined />
              </motion.g>

              {/* 핵심 원칙 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.85 }}>
                <rect x={60} y={200} width={400} height={35} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={215} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill="var(--foreground)">핵심: 다양한 백본 x 다양한 전처리 = 서로 다른 피처 → 상보적 결합</text>
                <text x={260} y={228} textAnchor="middle" fontSize={7}
                  fill="var(--muted-foreground)">대회 상위권은 예외 없이 3~5개 모델 앙상블</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
