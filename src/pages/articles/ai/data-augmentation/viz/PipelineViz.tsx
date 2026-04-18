import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './PipelineData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function PipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pipe-arrow" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Albumentations 구조</text>

              {/* Compose 최상위 */}
              <ModuleBox x={180} y={35} w={160} h={45} label="A.Compose([...])"
                sub="변환 파이프라인 정의" color={COLORS.compose} />

              {/* 변환 체인 */}
              {[
                { label: 'RandomCrop', sub: '(224, 224)', color: '#3b82f6' },
                { label: 'HorizontalFlip', sub: 'p=0.5', color: '#10b981' },
                { label: 'ColorJitter', sub: 'p=0.3', color: '#f59e0b' },
                { label: 'Normalize', sub: 'ImageNet', color: '#8b5cf6' },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
                  {i > 0 && (
                    <line x1={45 + i * 120} y1={115} x2={55 + i * 120} y2={115}
                      stroke="#888" strokeWidth={0.8} markerEnd="url(#pipe-arrow)" />
                  )}
                  <ActionBox x={60 + i * 120} y={95} w={100} h={38}
                    label={item.label} sub={item.sub} color={item.color} />
                </motion.g>
              ))}

              {/* 속도 비교 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <rect x={60} y={155} width={400} height={70} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={175} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">속도 비교 (1000장 기준)</text>

                {[
                  { lib: 'Albumentations', w: 160, color: COLORS.train },
                  { lib: 'torchvision', w: 80, color: '#f59e0b' },
                  { lib: 'PIL/Pillow', w: 45, color: '#ef4444' },
                ].map((item, i) => (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: 0.8 + i * 0.1 }}>
                    <text x={115} y={195 + i * 12} textAnchor="end" fontSize={8}
                      fill="var(--foreground)">{item.lib}</text>
                    <motion.rect x={120} y={187 + i * 12} width={item.w} height={9} rx={3}
                      fill={item.color} opacity={0.6}
                      initial={{ width: 0 }} animate={{ width: item.w }}
                      transition={{ ...sp, delay: 0.9 + i * 0.1 }} />
                  </motion.g>
                ))}
                <text x={340} y={195} fontSize={7} fill="var(--muted-foreground)">2~10x 빠름</text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Train 파이프라인 — 강한 증강</text>

              {/* 순서도 */}
              <text x={260} y={45} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                순서: 기하학적 → 색상 → 정규화
              </text>

              {/* 3단계 파이프라인 */}
              <ModuleBox x={20} y={60} w={140} h={50} label="기하학적 변환"
                sub="Crop → Flip → Rotate" color="#3b82f6" />
              <motion.line x1={165} y1={85} x2={185} y2={85}
                stroke="#888" strokeWidth={1} markerEnd="url(#pipe-arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.2 }} />
              <ModuleBox x={190} y={60} w={140} h={50} label="색상 변환"
                sub="Jitter → CLAHE" color="#f59e0b" />
              <motion.line x1={335} y1={85} x2={355} y2={85}
                stroke="#888" strokeWidth={1} markerEnd="url(#pipe-arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.3 }} />
              <ModuleBox x={360} y={60} w={140} h={50} label="정규화"
                sub="Normalize(mean, std)" color="#8b5cf6" />

              {/* OneOf 블록 */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={80} y={130} width={360} height={55} rx={8}
                  fill={`${COLORS.oneof}08`} stroke={COLORS.oneof} strokeWidth={0.8}
                  strokeDasharray="5 3" />
                <text x={100} y={148} fontSize={9} fontWeight={600}
                  fill={COLORS.oneof}>OneOf(p=0.3)</text>
                <text x={100} y={163} fontSize={8}
                  fill="var(--muted-foreground)">하나만 랜덤 선택:</text>

                {[
                  { label: 'GaussianBlur', x: 240 },
                  { label: 'MedianBlur', x: 330 },
                  { label: 'GaussNoise', x: 420 },
                ].map((item, i) => (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: 0.5 + i * 0.1 }}>
                    <DataBox x={item.x - 38} y={140} w={76} h={26}
                      label={item.label} color={COLORS.oneof} />
                  </motion.g>
                ))}
              </motion.g>

              {/* 핵심 포인트 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <rect x={80} y={200} width={360} height={35} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={222} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">
                  각 변환에 p(확률) 설정 — 매 이터레이션마다 다른 조합이 적용
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Train vs Test 파이프라인</text>

              {/* Train */}
              <rect x={20} y={40} width={230} height={170} rx={8}
                fill={`${COLORS.train}06`} stroke={COLORS.train} strokeWidth={0.8} />
              <text x={135} y={60} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={COLORS.train}>Train</text>

              {[
                'RandomResizedCrop(224)',
                'HorizontalFlip(p=0.5)',
                'ColorJitter(0.2, 0.2)',
                'OneOf([Blur, Noise])',
                'Normalize(mean, std)',
              ].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <text x={40} y={82 + i * 22} fontSize={8} fill="var(--foreground)">{t}</text>
                  <text x={230} y={82 + i * 22} fontSize={7}
                    fill={COLORS.train}>랜덤</text>
                </motion.g>
              ))}

              {/* Test */}
              <rect x={270} y={40} width={230} height={170} rx={8}
                fill={`${COLORS.test}06`} stroke={COLORS.test} strokeWidth={0.8} />
              <text x={385} y={60} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={COLORS.test}>Test</text>

              {[
                'Resize(256)',
                'CenterCrop(224)',
                'Normalize(mean, std)',
              ].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.08 }}>
                  <text x={290} y={82 + i * 22} fontSize={8} fill="var(--foreground)">{t}</text>
                  <text x={480} y={82 + i * 22} fontSize={7}
                    fill={COLORS.test}>결정적</text>
                </motion.g>
              ))}

              {/* 핵심 차이 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <rect x={290} y={145} width={195} height={50} rx={4}
                  fill="var(--card)" stroke={COLORS.test} strokeWidth={0.5} />
                <text x={387} y={165} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={COLORS.test}>랜덤 요소 없음</text>
                <text x={387} y={182} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">같은 이미지 → 항상 같은 출력</text>
              </motion.g>

              {/* 공통 Normalize */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <line x1={135} y1={210} x2={385} y2={210} stroke="#888" strokeWidth={0.5}
                  strokeDasharray="4 2" />
                <text x={260} y={230} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">
                  Normalize는 반드시 동일 파라미터 사용 (Train = Test)
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">TTA — Test Time Augmentation</text>

              {/* 원본 테스트 이미지 */}
              <rect x={20} y={50} width={70} height={70} rx={6}
                fill={`${COLORS.tta}20`} stroke={COLORS.tta} strokeWidth={0.8} />
              <text x={55} y={90} textAnchor="middle" fontSize={9} fill={COLORS.tta}>Test</text>

              {/* 분기 화살표 */}
              {[0, 1, 2, 3, 4].map(i => (
                <motion.line key={i} x1={95} y1={85} x2={140} y2={45 + i * 35}
                  stroke="#888" strokeWidth={0.6} markerEnd="url(#pipe-arrow)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ ...sp, delay: i * 0.06 }} />
              ))}

              {/* N개 변형 */}
              {[
                { label: '원본', y: 32 },
                { label: 'HFlip', y: 67 },
                { label: 'Crop 1', y: 102 },
                { label: 'Crop 2', y: 137 },
                { label: 'Crop 3', y: 172 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.15 + i * 0.06 }}>
                  <rect x={145} y={item.y} width={68} height={28} rx={4}
                    fill={`${COLORS.tta}12`} stroke={COLORS.tta} strokeWidth={0.5} />
                  <text x={179} y={item.y + 18} textAnchor="middle" fontSize={8}
                    fill={COLORS.tta}>{item.label}</text>
                </motion.g>
              ))}

              {/* 각 변형 → 예측 */}
              {[0, 1, 2, 3, 4].map(i => (
                <motion.g key={`pred${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.06 }}>
                  <line x1={218} y1={45 + i * 35} x2={270} y2={45 + i * 35}
                    stroke="#888" strokeWidth={0.5} markerEnd="url(#pipe-arrow)" />
                  <rect x={275} y={32 + i * 35} width={55} height={26} rx={4}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <text x={302} y={49 + i * 35} textAnchor="middle" fontSize={8}
                    fill="var(--foreground)">P(y|x{i + 1})</text>
                </motion.g>
              ))}

              {/* 앙상블 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={`c${i}`} x1={335} y1={45 + i * 35} x2={380} y2={110}
                    stroke={COLORS.compose} strokeWidth={0.5} />
                ))}

                <ModuleBox x={385} y={85} w={120} h={50} label="평균 앙상블"
                  sub="(P₁+P₂+...+P₅) / 5" color={COLORS.compose} />
              </motion.g>

              {/* 효과 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.9 }}>
                <rect x={140} y={210} width={240} height={30} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={230} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">
                  +0.1~0.3% 성능 향상. 추론 시간 5배 증가
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
