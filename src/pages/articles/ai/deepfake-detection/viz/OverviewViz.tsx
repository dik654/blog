import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './OverviewData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ov-df-arrow" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">딥페이크 생성 기술 진화</text>

              {/* GAN 구조 */}
              <ModuleBox x={30} y={45} w={100} h={48} label="Generator" sub="노이즈 → 이미지" color={COLORS.gan} />
              <ModuleBox x={160} y={45} w={100} h={48} label="Discriminator" sub="진짜/가짜 판별" color={COLORS.gan} />
              <motion.line x1={130} y1={69} x2={155} y2={69}
                stroke={COLORS.gan} strokeWidth={1.2} markerEnd="url(#ov-df-arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={sp} />
              <motion.path d="M210,93 Q210,115 130,115 Q80,115 80,93"
                fill="none" stroke={COLORS.gan} strokeWidth={1} strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.2 }} />
              <text x={145} y={126} textAnchor="middle" fontSize={8} fill={COLORS.gan}>피드백 루프</text>

              {/* 타임라인 화살표 */}
              <motion.line x1={290} y1={69} x2={320} y2={69}
                stroke="#888" strokeWidth={1.5} markerEnd="url(#ov-df-arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.3 }} />
              <text x={305} y={60} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">진화</text>

              {/* Diffusion 구조 */}
              <ModuleBox x={330} y={45} w={100} h={48} label="Diffusion" sub="노이즈 제거 반복" color={COLORS.diffusion} />

              {/* 노이즈 → 이미지 과정 */}
              {[0, 1, 2, 3].map(i => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.1 }}>
                  <rect x={340 + i * 22} y={100} width={18} height={18} rx={3}
                    fill={COLORS.diffusion} opacity={0.15 + i * 0.2} />
                  {i < 3 && <text x={362 + i * 22} y={112} fontSize={7} fill="#888">→</text>}
                </motion.g>
              ))}
              <text x={380} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                노이즈 → 점진 복원
              </text>

              {/* 품질 비교 바 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <text x={145} y={165} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.gan}>GAN 품질</text>
                <rect x={70} y={172} width={150} height={8} rx={4} fill="var(--border)" opacity={0.3} />
                <motion.rect x={70} y={172} width={120} height={8} rx={4} fill={COLORS.gan}
                  initial={{ width: 0 }} animate={{ width: 120 }} transition={{ ...sp, delay: 0.7 }} />

                <text x={380} y={165} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.diffusion}>Diffusion 품질</text>
                <rect x={305} y={172} width={150} height={8} rx={4} fill="var(--border)" opacity={0.3} />
                <motion.rect x={305} y={172} width={145} height={8} rx={4} fill={COLORS.diffusion}
                  initial={{ width: 0 }} animate={{ width: 145 }} transition={{ ...sp, delay: 0.8 }} />
              </motion.g>

              <AlertBox x={160} y={198} w={200} h={40} label="품질 향상 = 탐지 난이도 급증"
                sub="사람의 눈으로 구분 불가능한 수준" color={COLORS.alert} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">딥페이크 3가지 유형</text>

              {/* Face Swap */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.1 }}>
                <rect x={20} y={40} width={150} height={110} rx={8}
                  fill={`${COLORS.swap}08`} stroke={COLORS.swap} strokeWidth={1.5} />
                <text x={95} y={60} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.swap}>Face Swap</text>
                <line x1={35} y1={66} x2={155} y2={66} stroke={COLORS.swap} strokeOpacity={0.3} strokeWidth={0.6} />
                {/* A얼굴 → B영상 */}
                <circle cx={55} cy={90} r={14} fill={COLORS.swap} opacity={0.2} stroke={COLORS.swap} strokeWidth={0.8} />
                <text x={55} y={94} textAnchor="middle" fontSize={9} fill={COLORS.swap}>A</text>
                <line x1={72} y1={90} x2={100} y2={90} stroke="#888" strokeWidth={0.8} markerEnd="url(#ov-df-arrow)" />
                <rect x={105} y={76} width={48} height={28} rx={4} fill={COLORS.swap} opacity={0.15} stroke={COLORS.swap} strokeWidth={0.6} />
                <text x={129} y={94} textAnchor="middle" fontSize={8} fill={COLORS.swap}>B영상</text>
                <text x={95} y={125} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">DeepFaceLab</text>
                <text x={95} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">A의 얼굴을 B에 덮어씌움</text>
              </motion.g>

              {/* Face Reenactment */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.25 }}>
                <rect x={185} y={40} width={150} height={110} rx={8}
                  fill={`${COLORS.reenact}08`} stroke={COLORS.reenact} strokeWidth={1.5} />
                <text x={260} y={60} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.reenact}>Reenactment</text>
                <line x1={200} y1={66} x2={320} y2={66} stroke={COLORS.reenact} strokeOpacity={0.3} strokeWidth={0.6} />
                {/* A표정 → B얼굴 */}
                <circle cx={220} cy={90} r={14} fill={COLORS.reenact} opacity={0.2} stroke={COLORS.reenact} strokeWidth={0.8} />
                <text x={220} y={87} textAnchor="middle" fontSize={7} fill={COLORS.reenact}>A의</text>
                <text x={220} y={96} textAnchor="middle" fontSize={7} fill={COLORS.reenact}>표정</text>
                <line x1={237} y1={90} x2={265} y2={90} stroke="#888" strokeWidth={0.8} markerEnd="url(#ov-df-arrow)" />
                <rect x={270} y={76} width={48} height={28} rx={4} fill={COLORS.reenact} opacity={0.15} stroke={COLORS.reenact} strokeWidth={0.6} />
                <text x={294} y={94} textAnchor="middle" fontSize={8} fill={COLORS.reenact}>B얼굴</text>
                <text x={260} y={125} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">First Order Motion</text>
                <text x={260} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">A의 움직임으로 B를 조종</text>
              </motion.g>

              {/* Entire Face Synthesis */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={350} y={40} width={150} height={110} rx={8}
                  fill={`${COLORS.synthesis}08`} stroke={COLORS.synthesis} strokeWidth={1.5} />
                <text x={425} y={60} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.synthesis}>Full Synthesis</text>
                <line x1={365} y1={66} x2={485} y2={66} stroke={COLORS.synthesis} strokeOpacity={0.3} strokeWidth={0.6} />
                {/* 노이즈 → 얼굴 */}
                <rect x={370} y={76} width={28} height={28} rx={4} fill="var(--border)" opacity={0.5} />
                <text x={384} y={94} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">z</text>
                <line x1={402} y1={90} x2={430} y2={90} stroke="#888" strokeWidth={0.8} markerEnd="url(#ov-df-arrow)" />
                <circle cx={460} cy={90} r={18} fill={COLORS.synthesis} opacity={0.2} stroke={COLORS.synthesis} strokeWidth={0.8} />
                <text x={460} y={94} textAnchor="middle" fontSize={8} fill={COLORS.synthesis}>???</text>
                <text x={425} y={125} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">StyleGAN</text>
                <text x={425} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">실존하지 않는 얼굴 생성</text>
              </motion.g>

              {/* 탐지 난이도 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <text x={95} y={175} textAnchor="middle" fontSize={8} fill={COLORS.swap}>탐지 쉬움</text>
                <text x={260} y={175} textAnchor="middle" fontSize={8} fill={COLORS.reenact}>탐지 보통</text>
                <text x={425} y={175} textAnchor="middle" fontSize={8} fill={COLORS.synthesis}>탐지 어려움</text>
                <line x1={40} y1={185} x2={480} y2={185} stroke="var(--border)" strokeWidth={1} />
                <motion.line x1={40} y1={185} x2={480} y2={185}
                  stroke={COLORS.alert} strokeWidth={2}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ ...sp, delay: 0.8, duration: 0.8 }} />
                <text x={260} y={200} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                  경계 아티팩트 있음 ← → 통계적 패턴만 존재
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">아티팩트의 진화: 점점 사라진다</text>

              {/* 2017 vs 2024 비교 */}
              <text x={140} y={48} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={COLORS.swap}>2017~2019 초기</text>
              <text x={380} y={48} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={COLORS.synthesis}>2023~2025 최신</text>

              {/* 초기 아티팩트들 */}
              {[
                { y: 65, label: '경계 블러', detail: '얼굴-배경 경계 뭉개짐' },
                { y: 95, label: '색상 불일치', detail: '피부톤 미스매치' },
                { y: 125, label: '눈 깜빡임 없음', detail: '생성 모델의 약점' },
                { y: 155, label: '치아 구조 이상', detail: '치아 개수/형태 오류' },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <rect x={30} y={item.y} width={220} height={24} rx={5}
                    fill={COLORS.swap} fillOpacity={0.08} stroke={COLORS.swap} strokeWidth={0.8} />
                  <circle cx={46} cy={item.y + 12} r={4} fill={COLORS.swap} />
                  <text x={58} y={item.y + 16} fontSize={9} fontWeight={600} fill={COLORS.swap}>{item.label}</text>
                  <text x={155} y={item.y + 16} fontSize={7.5} fill="var(--muted-foreground)">{item.detail}</text>
                </motion.g>
              ))}

              {/* 최신 특성 */}
              {[
                { y: 65, label: '경계 완벽', detail: 'blending 기술 고도화' },
                { y: 95, label: '색상 일치', detail: '조건부 생성으로 해결' },
                { y: 125, label: '자연스러운 눈', detail: '시계열 일관성 확보' },
                { y: 155, label: '4K 해상도', detail: '업스케일러 통합' },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
                  <rect x={270} y={item.y} width={220} height={24} rx={5}
                    fill={COLORS.synthesis} fillOpacity={0.08} stroke={COLORS.synthesis} strokeWidth={0.8} />
                  <circle cx={286} cy={item.y + 12} r={4} fill={COLORS.synthesis} />
                  <text x={298} y={item.y + 16} fontSize={9} fontWeight={600} fill={COLORS.synthesis}>{item.label}</text>
                  <text x={398} y={item.y + 16} fontSize={7.5} fill="var(--muted-foreground)">{item.detail}</text>
                </motion.g>
              ))}

              {/* 결론 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <AlertBox x={140} y={195} w={240} h={42} label="사람의 눈으로 탐지 불가"
                  sub="모델이 미세한 통계적 패턴을 학습해야 한다" color={COLORS.alert} />
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">딥페이크 대회: 외부 데이터 구축 필수</text>

              {/* 일반 대회 */}
              <text x={140} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.gan}>일반 비전 대회</text>
              <ModuleBox x={60} y={56} w={160} h={45} label="Train + Test 제공" sub="동일 도메인, 동일 분포" color={COLORS.gan} />

              {/* 딥페이크 대회 */}
              <text x={380} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.alert}>딥페이크 탐지 대회</text>
              <AlertBox x={300} y={56} w={160} h={45} label="Test만 제공"
                sub="조작 기법 미공개" color={COLORS.alert} />

              {/* 화살표 */}
              <motion.line x1={380} y1={108} x2={380} y2={128}
                stroke={COLORS.alert} strokeWidth={1.2} markerEnd="url(#ov-df-arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.3 }} />

              {/* 해결 전략 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={60} y={135} width={400} height={100} rx={10}
                  fill={COLORS.synthesis} fillOpacity={0.05} stroke={COLORS.synthesis} strokeWidth={1.5} />
                <text x={260} y={155} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.synthesis}>외부 데이터 구축 전략</text>

                {[
                  { x: 80, label: 'FF++', desc: 'FaceForensics++' },
                  { x: 175, label: 'DFDC', desc: 'DeepFake Detection' },
                  { x: 270, label: 'CelebDF', desc: 'CelebDF-v2' },
                  { x: 365, label: '자체합성', desc: 'SimSwap 등' },
                ].map((ds, i) => (
                  <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: 0.5 + i * 0.1 }}>
                    <DataBox x={ds.x} y={172} w={75} h={28} label={ds.label} sub={ds.desc} color={COLORS.synthesis} />
                  </motion.g>
                ))}

                <text x={260} y={220} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  다양한 조작 기법을 커버하여 일반화 능력 확보
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
