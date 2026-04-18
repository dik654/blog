import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './AdvancedData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function AdvancedViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Mixup — 픽셀 + 라벨 혼합</text>

              {/* 이미지 A */}
              <rect x={30} y={45} width={90} height={90} rx={6}
                fill={COLORS.imgA} opacity={0.35} />
              <text x={75} y={95} textAnchor="middle" fontSize={10} fill={COLORS.imgA}>고양이</text>
              <text x={75} y={150} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">y₁ = [1, 0]</text>

              {/* + */}
              <text x={145} y={95} textAnchor="middle" fontSize={16}
                fill="var(--muted-foreground)">+</text>

              {/* 이미지 B */}
              <rect x={170} y={45} width={90} height={90} rx={6}
                fill={COLORS.imgB} opacity={0.35} />
              <text x={215} y={95} textAnchor="middle" fontSize={10} fill={COLORS.imgB}>개</text>
              <text x={215} y={150} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">y₂ = [0, 1]</text>

              {/* = */}
              <text x={285} y={95} textAnchor="middle" fontSize={16}
                fill="var(--muted-foreground)">=</text>

              {/* 혼합 결과 */}
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={310} y={45} width={90} height={90} rx={6}
                  fill={COLORS.mixed} opacity={0.35} />
                {/* 두 색상 겹침 효과 */}
                <rect x={310} y={45} width={90} height={90} rx={6}
                  fill={COLORS.imgA} opacity={0.15} />
                <rect x={310} y={45} width={90} height={90} rx={6}
                  fill={COLORS.imgB} opacity={0.1} />
                <text x={355} y={90} textAnchor="middle" fontSize={9} fill={COLORS.mixed}>혼합</text>
                <text x={355} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  λ=0.7
                </text>
              </motion.g>

              {/* 라벨 혼합 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <text x={355} y={150} textAnchor="middle" fontSize={8}
                  fill={COLORS.mixed}>ỹ = [0.7, 0.3]</text>

                {/* 수식 */}
                <rect x={50} y={170} width={420} height={55} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={190} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">x̃ = λ·x₁ + (1-λ)·x₂</text>
                <text x={260} y={210} textAnchor="middle" fontSize={9}
                  fill={COLORS.mixed}>λ ~ Beta(α, α), α=0.2~0.4 → soft label로 과적합 방지</text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">CutMix — 패치 교체로 지역 특징 보존</text>

              {/* 이미지 A */}
              <rect x={30} y={50} width={100} height={100} rx={6}
                fill={COLORS.imgA} opacity={0.3} />
              <text x={80} y={105} textAnchor="middle" fontSize={10} fill={COLORS.imgA}>이미지 A</text>

              {/* 이미지 B */}
              <rect x={160} y={50} width={100} height={100} rx={6}
                fill={COLORS.imgB} opacity={0.3} />
              {/* Cut 영역 표시 */}
              <motion.rect x={185} y={70} width={45} height={45} rx={2}
                fill={COLORS.cutArea} opacity={0.6}
                stroke={COLORS.cutArea} strokeWidth={1.5} strokeDasharray="4 2"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ ...sp, delay: 0.2 }} />
              <text x={210} y={105} textAnchor="middle" fontSize={10} fill={COLORS.imgB}>이미지 B</text>

              {/* 화살표 */}
              <motion.text x={292} y={105} textAnchor="middle" fontSize={16}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                transition={{ ...sp, delay: 0.3 }}>→</motion.text>

              {/* 결과 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={320} y={50} width={100} height={100} rx={6}
                  fill={COLORS.imgA} opacity={0.3} />
                {/* 붙여넣은 패치 */}
                <motion.rect x={345} y={70} width={45} height={45} rx={2}
                  fill={COLORS.cutArea} opacity={0.5}
                  initial={{ x: 185, y: 70 }} animate={{ x: 345, y: 70 }}
                  transition={{ ...sp, delay: 0.5 }} />
                <text x={370} y={170} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">결과</text>
              </motion.g>

              {/* 라벨 계산 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <rect x={440} y={55} width={70} height={90} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={475} y={78} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill="var(--foreground)">라벨 비율</text>
                <text x={475} y={96} textAnchor="middle" fontSize={8} fill={COLORS.imgA}>A: 80%</text>
                <text x={475} y={112} textAnchor="middle" fontSize={8} fill={COLORS.imgB}>B: 20%</text>
                <text x={475} y={132} textAnchor="middle" fontSize={7}
                  fill="var(--muted-foreground)">면적 비율</text>
              </motion.g>

              {/* Mixup vs CutMix */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <rect x={40} y={185} width={440} height={45} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={205} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">Mixup: 전체 투명 겹침(비현실적) vs CutMix: 지역 교체(현실적)</text>
                <text x={260} y={220} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">λ = 1 - (w×h)/(W×H) — 잘라낸 면적 비율로 라벨 결정</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">CutOut — 영역 마스킹</text>

              {/* 원본 */}
              <rect x={50} y={50} width={120} height={120} rx={6}
                fill={COLORS.imgA} opacity={0.3} />
              <circle cx={110} cy={110} r={30} fill={COLORS.imgA} opacity={0.4} />
              <text x={110} y={115} textAnchor="middle" fontSize={9} fill={COLORS.imgA}>물체</text>

              {/* CutOut 적용 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <rect x={220} y={50} width={120} height={120} rx={6}
                  fill={COLORS.imgA} opacity={0.3} />
                <circle cx={280} cy={110} r={30} fill={COLORS.imgA} opacity={0.4} />
                {/* 검은 마스크 */}
                <motion.rect x={255} y={85} width={50} height={50} rx={2}
                  fill="#1a1a1a" opacity={0.85}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: 0.4 }} />
              </motion.g>

              {/* CutMix — 상위호환 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={390} y={50} width={120} height={120} rx={6}
                  fill={COLORS.imgA} opacity={0.3} />
                <circle cx={450} cy={110} r={30} fill={COLORS.imgA} opacity={0.4} />
                {/* 다른 이미지로 채움 */}
                <motion.rect x={425} y={85} width={50} height={50} rx={2}
                  fill={COLORS.imgB} opacity={0.4}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: 0.6 }} />
              </motion.g>

              <text x={110} y={188} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">원본</text>
              <text x={280} y={188} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">CutOut (검정)</text>
              <text x={450} y={188} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">CutMix (이미지B)</text>

              {/* 비교 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <DataBox x={90} y={205} w={150} h={28} label="CutOut: 정보 손실" sub="마스킹 영역 = 0" color={COLORS.erasing} />
                <DataBox x={290} y={205} w={150} h={28} label="CutMix: 정보 보존" sub="다른 이미지로 채움" color={COLORS.mosaic} />
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Mosaic — 4장을 2x2로 합성</text>

              {/* 4장의 원본 */}
              {[
                { x: 20, y: 40, color: COLORS.imgA, label: 'Img 1' },
                { x: 85, y: 40, color: COLORS.imgB, label: 'Img 2' },
                { x: 20, y: 95, color: COLORS.mosaic, label: 'Img 3' },
                { x: 85, y: 95, color: COLORS.cutArea, label: 'Img 4' },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <rect x={item.x} y={item.y} width={55} height={45} rx={4}
                    fill={item.color} opacity={0.3} />
                  <text x={item.x + 27} y={item.y + 27} textAnchor="middle" fontSize={8}
                    fill={item.color}>{item.label}</text>
                </motion.g>
              ))}

              {/* 화살표 */}
              <motion.text x={185} y={95} textAnchor="middle" fontSize={16}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                transition={{ ...sp, delay: 0.4 }}>→</motion.text>

              {/* Mosaic 결과 */}
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={220} y={35} width={160} height={130} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.8} />

                {/* 랜덤 분할점 */}
                <line x1={310} y1={35} x2={310} y2={165} stroke="var(--border)" strokeWidth={1} />
                <line x1={220} y1={95} x2={380} y2={95} stroke="var(--border)" strokeWidth={1} />

                <rect x={222} y={37} width={86} height={56} rx={3} fill={COLORS.imgA} opacity={0.25} />
                <rect x={312} y={37} width={66} height={56} rx={3} fill={COLORS.imgB} opacity={0.25} />
                <rect x={222} y={97} width={86} height={66} rx={3} fill={COLORS.mosaic} opacity={0.25} />
                <rect x={312} y={97} width={66} height={66} rx={3} fill={COLORS.cutArea} opacity={0.25} />

                {/* 분할점 표시 */}
                <motion.circle cx={310} cy={95} r={4} fill={COLORS.mixed}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: 0.7 }} />
                <text x={310} y={180} textAnchor="middle" fontSize={8}
                  fill={COLORS.mixed}>랜덤 분할점</text>
              </motion.g>

              {/* YOLO 효과 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.8 }}>
                <rect x={400} y={40} width={110} height={125} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={455} y={62} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">효과</text>
                <text x={455} y={82} textAnchor="middle" fontSize={8}
                  fill={COLORS.mosaic}>4배 컨텍스트</text>
                <text x={455} y={100} textAnchor="middle" fontSize={8}
                  fill={COLORS.mosaic}>작은 객체 탐지</text>
                <text x={455} y={118} textAnchor="middle" fontSize={8}
                  fill={COLORS.mosaic}>BN 통계 개선</text>
                <text x={455} y={142} textAnchor="middle" fontSize={7}
                  fill="var(--muted-foreground)">YOLOv4 도입</text>
              </motion.g>

              <text x={260} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                한 배치에서 4장 정보를 동시 학습 — 미니배치 크기 의존성 감소
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
