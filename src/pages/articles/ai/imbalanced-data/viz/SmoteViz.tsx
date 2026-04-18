import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS: StepDef[] = [
  {
    label: '1. 랜덤 오버샘플링 — 단순 복제',
    body: '소수 클래스 샘플을 무작위로 복제\n장점: 구현 간단, 정보 손실 없음\n단점: 동일 데이터 반복 → 과적합 위험이 높음',
  },
  {
    label: '2. SMOTE — 합성 소수 오버샘플링',
    body: 'Synthetic Minority Over-sampling Technique (2002)\n소수 클래스 샘플 사이에 새로운 합성 샘플을 생성\n단순 복제가 아닌 "보간"으로 과적합을 줄임',
  },
  {
    label: '3. SMOTE 동작: k-NN 이웃 선택 → 보간',
    body: '1) 소수 클래스 샘플 x_i를 하나 선택\n2) x_i의 k-NN(보통 k=5) 중 하나를 x_nn으로 선택\n3) x_new = x_i + rand(0,1) × (x_nn − x_i)\n→ 두 점 사이 직선 위의 랜덤한 위치에 새 샘플 생성',
  },
  {
    label: '4. ADASYN — 어려운 영역에 집중 생성',
    body: 'Adaptive Synthetic Sampling (2008)\n경계(decision boundary) 근처의 어려운 샘플에 더 많은 합성 샘플 생성\n쉬운 영역은 적게, 어려운 영역은 많이 → 경계 학습 강화',
  },
  {
    label: '5. 언더샘플링 — 다수 클래스 축소',
    body: '랜덤 언더샘플링: 다수 클래스를 무작위 제거 (정보 손실)\nTomek Links: 경계에서 가장 가까운 이종(異種) 쌍을 제거 → 경계 정리\nNearMiss: 소수 클래스와 가까운 다수 샘플만 보존 → 경계 강화',
  },
  {
    label: '6. 리샘플링 전략 비교',
    body: '오버샘플링: 정보 보존, 과적합 위험, 학습 시간 증가\n언더샘플링: 빠름, 정보 손실, 데이터 적을 때 위험\n실전: SMOTE + Tomek Links 조합이 가장 많이 쓰임',
  },
];

export default function SmoteViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 랜덤 오버샘플링 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">랜덤 오버샘플링: 복제</text>

              {/* 원본 */}
              <text x={130} y={50} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">원본</text>
              {[
                { cx: 80, cy: 100 }, { cx: 110, cy: 80 }, { cx: 140, cy: 120 },
                { cx: 100, cy: 140 }, { cx: 160, cy: 100 },
              ].map((p, i) => (
                <circle key={`o-${i}`} cx={p.cx} cy={p.cy} r={6}
                  fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" strokeWidth={1.2} />
              ))}

              {/* 화살표 */}
              <line x1={190} y1={110} x2={250} y2={110} stroke="var(--border)" strokeWidth={1.2} />
              <polygon points="248,106 248,114 256,110" fill="var(--border)" />
              <text x={220} y={100} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">복제</text>

              {/* 복제 후 */}
              <text x={380} y={50} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">복제 후</text>
              {[
                { cx: 310, cy: 100 }, { cx: 340, cy: 80 }, { cx: 370, cy: 120 },
                { cx: 330, cy: 140 }, { cx: 390, cy: 100 },
                { cx: 315, cy: 105 }, { cx: 345, cy: 85 }, { cx: 375, cy: 125 },
                { cx: 335, cy: 145 }, { cx: 395, cy: 105 },
              ].map((p, i) => (
                <motion.circle key={`d-${i}`} cx={p.cx} cy={p.cy} r={6}
                  fill="#ef4444" fillOpacity={i >= 5 ? 0.15 : 0.3}
                  stroke="#ef4444" strokeWidth={1.2}
                  strokeDasharray={i >= 5 ? '3 2' : 'none'}
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...sp, delay: i * 0.05 }} />
              ))}

              <rect x={280} y={175} width={200} height={28} rx={5}
                fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={380} y={193} textAnchor="middle" fontSize={10} fill="#ef4444">
                동일 데이터 반복 → 과적합
              </text>
            </motion.g>
          )}

          {/* Step 1: SMOTE 개요 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">SMOTE: 합성 샘플 생성</text>

              {/* 소수 클래스 원본 점들 */}
              {[
                { cx: 100, cy: 100 }, { cx: 150, cy: 80 }, { cx: 130, cy: 150 },
                { cx: 180, cy: 130 }, { cx: 90, cy: 140 },
              ].map((p, i) => (
                <circle key={`s-${i}`} cx={p.cx} cy={p.cy} r={7}
                  fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" strokeWidth={1.2} />
              ))}
              <text x={140} y={55} textAnchor="middle" fontSize={10} fill="#ef4444">소수 클래스 원본</text>

              {/* 화살표 */}
              <line x1={220} y1={115} x2={280} y2={115} stroke="var(--border)" strokeWidth={1.2} />
              <polygon points="278,111 278,119 286,115" fill="var(--border)" />
              <text x={250} y={105} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">보간</text>

              {/* 합성 점들 (기존 + 새로운) */}
              {[
                { cx: 330, cy: 100 }, { cx: 380, cy: 80 }, { cx: 360, cy: 150 },
                { cx: 410, cy: 130 }, { cx: 320, cy: 140 },
              ].map((p, i) => (
                <circle key={`so-${i}`} cx={p.cx} cy={p.cy} r={7}
                  fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" strokeWidth={1.2} />
              ))}
              {/* 합성 샘플 */}
              {[
                { cx: 355, cy: 90 }, { cx: 345, cy: 125 }, { cx: 370, cy: 115 },
                { cx: 395, cy: 140 }, { cx: 340, cy: 145 },
              ].map((p, i) => (
                <motion.g key={`syn-${i}`} initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
                  <circle cx={p.cx} cy={p.cy} r={7}
                    fill="#10b981" fillOpacity={0.3} stroke="#10b981" strokeWidth={1.2} />
                </motion.g>
              ))}
              <text x={370} y={55} textAnchor="middle" fontSize={10} fill="#10b981">합성 샘플 (새로 생성)</text>

              <rect x={130} y={185} width={260} height={26} rx={5}
                fill="#10b98112" stroke="#10b981" strokeWidth={1} />
              <text x={260} y={202} textAnchor="middle" fontSize={10} fill="#10b981">
                기존 점 사이를 보간 → 다양성 확보
              </text>
            </motion.g>
          )}

          {/* Step 2: SMOTE k-NN 동작 원리 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">SMOTE 동작 원리</text>

              {/* 선택된 점 x_i */}
              <motion.circle cx={160} cy={120} r={9} fill="#ef4444" fillOpacity={0.4}
                stroke="#ef4444" strokeWidth={2}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={sp} />
              <text x={160} y={105} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">x_i</text>

              {/* k-NN 이웃들 */}
              {[
                { cx: 220, cy: 80, label: 'nn1' },
                { cx: 240, cy: 140, label: 'nn2' },
                { cx: 130, cy: 70, label: 'nn3' },
                { cx: 100, cy: 150, label: 'nn4' },
                { cx: 200, cy: 160, label: 'nn5' },
              ].map((nn, i) => (
                <motion.g key={nn.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
                  <line x1={160} y1={120} x2={nn.cx} y2={nn.cy}
                    stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="3 2" />
                  <circle cx={nn.cx} cy={nn.cy} r={6}
                    fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" strokeWidth={1} />
                  <text x={nn.cx + 10} y={nn.cy - 8} fontSize={8} fill="#3b82f6">{nn.label}</text>
                </motion.g>
              ))}

              {/* 선택된 이웃 x_nn (nn2) */}
              <motion.circle cx={240} cy={140} r={8}
                fill="#f59e0b" fillOpacity={0.3} stroke="#f59e0b" strokeWidth={2}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }} />
              <motion.text x={255} y={138} fontSize={10} fontWeight={600} fill="#f59e0b"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                x_nn (선택)
              </motion.text>

              {/* 보간 선 */}
              <motion.line x1={160} y1={120} x2={240} y2={140}
                stroke="#10b981" strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.8 }} />

              {/* 합성 점 */}
              <motion.circle cx={195} cy={128} r={8}
                fill="#10b981" fillOpacity={0.4} stroke="#10b981" strokeWidth={2}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...sp, delay: 1.0 }} />
              <motion.text x={195} y={148} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 1.0 }}>
                x_new
              </motion.text>

              {/* 수식 */}
              <rect x={310} y={60} width={190} height={70} rx={6}
                fill="#10b98108" stroke="#10b981" strokeWidth={1} />
              <text x={405} y={80} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--foreground)">합성 수식</text>
              <text x={405} y={98} textAnchor="middle" fontSize={10} fontFamily="monospace"
                fill="#10b981">x_new = x_i + t(x_nn - x_i)</text>
              <text x={405} y={116} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">t ~ Uniform(0, 1)</text>

              <text x={405} y={155} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">t=0 → x_i 위치</text>
              <text x={405} y={170} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">t=1 → x_nn 위치</text>
              <text x={405} y={185} textAnchor="middle" fontSize={9}
                fill="#10b981">t=0.44 → 중간 어딘가</text>
            </motion.g>
          )}

          {/* Step 3: ADASYN */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">ADASYN: 어려운 영역에 집중</text>

              {/* 경계선 */}
              <motion.line x1={260} y1={40} x2={260} y2={210}
                stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="6 3"
                initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={sp} />
              <text x={260} y={225} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                결정 경계
              </text>

              {/* 다수 클래스 (오른쪽) */}
              {[
                { cx: 340, cy: 80 }, { cx: 380, cy: 100 }, { cx: 360, cy: 140 },
                { cx: 400, cy: 60 }, { cx: 420, cy: 130 }, { cx: 350, cy: 170 },
                { cx: 440, cy: 90 }, { cx: 390, cy: 180 },
              ].map((p, i) => (
                <circle key={`maj-${i}`} cx={p.cx} cy={p.cy} r={5}
                  fill="#3b82f6" fillOpacity={0.25} stroke="#3b82f6" strokeWidth={0.8} />
              ))}
              <text x={400} y={50} textAnchor="middle" fontSize={9} fill="#3b82f6">다수</text>

              {/* 소수 클래스 (왼쪽) */}
              {[
                { cx: 100, cy: 90, easy: true }, { cx: 80, cy: 140, easy: true },
                { cx: 120, cy: 170, easy: true },
                { cx: 220, cy: 100, easy: false }, { cx: 230, cy: 150, easy: false },
              ].map((p, i) => (
                <circle key={`min-${i}`} cx={p.cx} cy={p.cy} r={6}
                  fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" strokeWidth={1.2} />
              ))}
              <text x={100} y={70} textAnchor="middle" fontSize={9} fill="#ef4444">소수</text>

              {/* 쉬운 영역 - 적은 생성 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <circle cx={90} cy={115} r={4} fill="#10b981" fillOpacity={0.4} stroke="#10b981" strokeWidth={1} />
                <text x={50} y={120} fontSize={8} fill="#10b981">생성 적음</text>
              </motion.g>

              {/* 어려운 영역 - 많은 생성 */}
              {[
                { cx: 225, cy: 120 }, { cx: 215, cy: 135 }, { cx: 235, cy: 130 },
                { cx: 225, cy: 165 }, { cx: 210, cy: 155 }, { cx: 240, cy: 140 },
              ].map((p, i) => (
                <motion.circle key={`ada-${i}`} cx={p.cx} cy={p.cy} r={4}
                  fill="#10b981" fillOpacity={0.5} stroke="#10b981" strokeWidth={1.2}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: 0.5 + i * 0.08 }} />
              ))}
              <motion.text x={225} y={195} textAnchor="middle" fontSize={8} fill="#10b981" fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
                경계 근처: 생성 많음
              </motion.text>
            </motion.g>
          )}

          {/* Step 4: 언더샘플링 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">언더샘플링 3가지 방법</text>

              {/* Random */}
              <rect x={15} y={38} width={155} height={85} rx={6}
                fill="#3b82f608" stroke="#3b82f6" strokeWidth={1} />
              <text x={92} y={55} textAnchor="middle" fontSize={11} fontWeight={600} fill="#3b82f6">
                랜덤 언더샘플링
              </text>
              <text x={92} y={72} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                다수 클래스 무작위 제거
              </text>
              <text x={92} y={88} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                빠르지만 정보 손실 큼
              </text>
              <rect x={35} y={98} width={115} height={16} rx={3} fill="#3b82f610" />
              <text x={92} y={110} textAnchor="middle" fontSize={8} fill="#3b82f6">
                복잡도: O(n), 가장 단순
              </text>

              {/* Tomek Links */}
              <rect x={182} y={38} width={155} height={85} rx={6}
                fill="#10b98108" stroke="#10b981" strokeWidth={1} />
              <text x={260} y={55} textAnchor="middle" fontSize={11} fontWeight={600} fill="#10b981">
                Tomek Links
              </text>
              <text x={260} y={72} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                가장 가까운 이종 쌍 제거
              </text>
              <text x={260} y={88} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                경계를 깨끗하게 정리
              </text>
              <rect x={202} y={98} width={115} height={16} rx={3} fill="#10b98110" />
              <text x={260} y={110} textAnchor="middle" fontSize={8} fill="#10b981">
                SMOTE 후처리로 자주 사용
              </text>

              {/* NearMiss */}
              <rect x={349} y={38} width={155} height={85} rx={6}
                fill="#f59e0b08" stroke="#f59e0b" strokeWidth={1} />
              <text x={427} y={55} textAnchor="middle" fontSize={11} fontWeight={600} fill="#f59e0b">
                NearMiss
              </text>
              <text x={427} y={72} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                소수와 가까운 다수만 보존
              </text>
              <text x={427} y={88} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                경계 학습에 집중
              </text>
              <rect x={369} y={98} width={115} height={16} rx={3} fill="#f59e0b10" />
              <text x={427} y={110} textAnchor="middle" fontSize={8} fill="#f59e0b">
                v1/v2/v3 변형 존재
              </text>

              {/* Tomek Links 시각화 */}
              <text x={260} y={148} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--foreground)">Tomek Link 예시</text>
              {/* 소수 점 */}
              <circle cx={200} cy={185} r={7} fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" strokeWidth={1.2} />
              <text x={200} y={205} textAnchor="middle" fontSize={8} fill="#ef4444">소수</text>
              {/* 다수 점 (Tomek pair) */}
              <circle cx={240} cy={175} r={7} fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" strokeWidth={1.2} />
              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="#3b82f6">다수</text>
              {/* 연결선 */}
              <line x1={207} y1={182} x2={233} y2={178} stroke="#ef4444" strokeWidth={1.5} />
              <text x={220} y={168} textAnchor="middle" fontSize={8} fill="#ef4444" fontWeight={600}>
                Tomek Link
              </text>
              {/* 제거 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <line x1={234} y1={169} x2={246} y2={181} stroke="#ef4444" strokeWidth={2} />
                <line x1={246} y1={169} x2={234} y2={181} stroke="#ef4444" strokeWidth={2} />
              </motion.g>

              {/* 나머지 다수 클래스 (배경) */}
              {[
                { cx: 310, cy: 180 }, { cx: 340, cy: 190 }, { cx: 360, cy: 170 },
              ].map((p, i) => (
                <circle key={`bg-${i}`} cx={p.cx} cy={p.cy} r={5}
                  fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={0.6} />
              ))}
              <text x={340} y={215} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                멀리 있는 다수 클래스는 유지
              </text>
            </motion.g>
          )}

          {/* Step 5: 전략 비교 */}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">오버샘플링 vs 언더샘플링</text>

              {/* 오버샘플링 */}
              <rect x={20} y={35} width={230} height={90} rx={8}
                fill="#10b98108" stroke="#10b981" strokeWidth={1.2} />
              <text x={135} y={52} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
                오버샘플링
              </text>
              <text x={135} y={70} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                정보 보존, 학습 데이터 확대
              </text>
              <text x={135} y={85} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                학습 시간 증가, 과적합 위험
              </text>
              <rect x={45} y={98} width={180} height={18} rx={4} fill="#10b98115" />
              <text x={135} y={111} textAnchor="middle" fontSize={9} fill="#10b981">
                대표: SMOTE, ADASYN
              </text>

              {/* 언더샘플링 */}
              <rect x={270} y={35} width={230} height={90} rx={8}
                fill="#3b82f608" stroke="#3b82f6" strokeWidth={1.2} />
              <text x={385} y={52} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
                언더샘플링
              </text>
              <text x={385} y={70} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                빠른 학습, 경계 정리
              </text>
              <text x={385} y={85} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                정보 손실, 소규모 데이터에 부적합
              </text>
              <rect x={295} y={98} width={180} height={18} rx={4} fill="#3b82f615" />
              <text x={385} y={111} textAnchor="middle" fontSize={9} fill="#3b82f6">
                대표: Tomek Links, NearMiss
              </text>

              {/* 실전 조합 */}
              <rect x={90} y={145} width={340} height={50} rx={8}
                fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1.5} />
              <text x={260} y={165} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
                실전 최적 조합
              </text>
              <text x={260} y={182} textAnchor="middle" fontSize={10} fill="var(--foreground)">
                SMOTE(소수 확대) + Tomek Links(경계 정리) = SMOTETomek
              </text>

              <text x={260} y={218} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                imbalanced-learn 라이브러리: from imblearn.combine import SMOTETomek
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
