import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  { label: '1. DPO의 남은 문제', body: 'DPO는 보상 모델을 제거했지만 여전히 2단계 필요:\n① SFT: 먼저 지도학습으로 기본 능력 학습\n② DPO: 그 다음 선호 데이터로 정렬\n게다가 π_ref(원래 모델)를 메모리에 유지해야 함' },
  { label: '2. ORPO 아이디어', body: 'SFT 단계에서 이미 선호 데이터를 사용하면?\n→ 언어 능력 학습 + 선호 정렬을 동시에\nL_ORPO = L_SFT + λ × L_OR\nL_SFT = 일반적인 다음 토큰 예측 손실\nL_OR = 선호 응답과 비선호 응답의 "오즈" 비교' },
  { label: '3. Odds란 무엇인가', body: 'Odds(y|x) = P / (1−P)\nP = 0.8이면 Odds = 0.8/0.2 = 4 → "4대 1로 생성할 것 같다"\nP = 0.5이면 Odds = 1 → "반반"\nP = 0.2이면 Odds = 0.25 → "4대 1로 안 할 것 같다"\n→ 확률을 "가능성 비율"로 변환한 것' },
  { label: '4. 왜 오즈 비율로 비교하는가', body: 'Odds(y_w) / Odds(y_l) = 선호 응답의 가능성 ÷ 비선호의 가능성\ny_w: 선호된 응답 (좋은 것)\ny_l: 비선호 응답 (나쁜 것)\n비율 > 1이면 선호 응답이 더 가능성 높음 → 원하는 상태\nlog를 씌우면: 비율 > 1 → 양수, 비율 < 1 → 음수' },
  { label: '5. ORPO 최종 손실', body: 'L_OR = −log σ(log(Odds(y_w) / Odds(y_l)))\nσ = sigmoid: 양수→1에 가까움, 음수→0에 가까움\n선호 응답의 오즈 > 비선호 → log > 0 → σ > 0.5 → loss 작음\n핵심: π_ref 불필요! 현재 모델의 오즈만으로 비교\nSFT + 정렬 = 1단계, 모델 1개만 필요' },
];

export default function ORPOViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 2단계 vs 1단계 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={230} y={16} textAnchor="middle" fontSize={10} fill="var(--foreground)">DPO: 여전히 2단계</text>
              <rect x={40} y={25} width={130} height={30} rx={5}
                fill="#3b82f612" stroke="#3b82f6" strokeWidth={1} />
              <text x={105} y={44} textAnchor="middle" fontSize={10} fill="#3b82f6">① SFT 학습</text>
              <text x={180} y={44} fontSize={10} fill="var(--muted-foreground)">→</text>
              <rect x={195} y={25} width={130} height={30} rx={5}
                fill="#6366f112" stroke="#6366f1" strokeWidth={1} />
              <text x={260} y={44} textAnchor="middle" fontSize={10} fill="#6366f1">② DPO 정렬</text>
              <text x={230} y={80} textAnchor="middle" fontSize={11} fill="#10b981" fontWeight={600}>
                ORPO: 1단계로 합치면?
              </text>
              <rect x={100} y={90} width={230} height={28} rx={5}
                fill="#10b98115" stroke="#10b981" strokeWidth={1.5} />
              <text x={215} y={108} textAnchor="middle" fontSize={11} fill="#10b981">SFT + 정렬 동시 학습</text>
            </motion.g>
          )}

          {/* Step 1: 수식 분해 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={15} y={30} fontSize={11} fill="var(--foreground)">L_ORPO =</text>
              <rect x={90} y={16} width={80} height={22} rx={3} fill="#3b82f618" stroke="#3b82f6" strokeWidth={1} />
              <text x={130} y={31} textAnchor="middle" fontSize={10} fill="#3b82f6" fontWeight={600}>L_SFT</text>
              <text x={178} y={30} fontSize={12} fill="var(--muted-foreground)">+</text>
              <rect x={190} y={16} width={22} height={22} rx={3} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
              <text x={201} y={31} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>λ</text>
              <text x={218} y={30} fontSize={11} fill="var(--muted-foreground)">×</text>
              <rect x={228} y={16} width={65} height={22} rx={3} fill="#10b98118" stroke="#10b981" strokeWidth={1} />
              <text x={260} y={31} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}>L_OR</text>

              <rect x={30} y={50} width={140} height={16} rx={3} fill="#3b82f610" />
              <text x={100} y={62} textAnchor="middle" fontSize={9} fill="#3b82f6">L_SFT: 다음 토큰 예측</text>
              <rect x={180} y={50} width={80} height={16} rx={3} fill="#f59e0b10" />
              <text x={220} y={62} textAnchor="middle" fontSize={9} fill="#f59e0b">λ: 균형 계수</text>
              <rect x={270} y={50} width={150} height={16} rx={3} fill="#10b98110" />
              <text x={345} y={62} textAnchor="middle" fontSize={9} fill="#10b981">L_OR: 오즈 선호 손실</text>

              <text x={230} y={88} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                λ 크면 정렬 더 중시, 작으면 언어 능력 더 중시
              </text>
            </motion.g>
          )}

          {/* Step 2: Odds 예시 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={230} y={16} textAnchor="middle" fontSize={10} fill="var(--foreground)">
                Odds = "가능성 비율" — 확률을 다른 방식으로 표현
              </text>
              {[
                { p: '0.8', odds: '4.0', desc: '"4:1로 생성"', color: '#10b981' },
                { p: '0.5', odds: '1.0', desc: '"반반"', color: '#f59e0b' },
                { p: '0.2', odds: '0.25', desc: '"1:4로 안 함"', color: '#ef4444' },
              ].map((item, i) => (
                <g key={item.p}>
                  <rect x={30 + i * 145} y={28} width={130} height={48} rx={5}
                    fill={`${item.color}12`} stroke={item.color} strokeWidth={1} />
                  <text x={95 + i * 145} y={44} textAnchor="middle" fontSize={10} fill={item.color}>
                    P = {item.p}
                  </text>
                  <text x={95 + i * 145} y={60} textAnchor="middle" fontSize={11}
                    fontWeight={700} fill={item.color}>Odds = {item.odds}</text>
                  <text x={95 + i * 145} y={73} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">{item.desc}</text>
                </g>
              ))}
              <text x={230} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                Odds = P / (1 − P) — 확률 높으면 Odds도 높음
              </text>
              <text x={230} y={118} textAnchor="middle" fontSize={10} fill="#6366f1">
                Odds 비교로 "어느 응답이 더 가능성 높은가" 측정
              </text>
            </motion.g>
          )}

          {/* Step 3: 비율의 의미 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={22} fontSize={10} fill="var(--foreground)">비율 =</text>
              <rect x={68} y={8} width={95} height={22} rx={3} fill="#10b98118" stroke="#10b981" strokeWidth={1} />
              <text x={115} y={23} textAnchor="middle" fontSize={10} fill="#10b981">Odds(y_w)</text>
              <text x={170} y={22} fontSize={11} fill="var(--muted-foreground)">÷</text>
              <rect x={184} y={8} width={90} height={22} rx={3} fill="#ef444418" stroke="#ef4444" strokeWidth={1} />
              <text x={229} y={23} textAnchor="middle" fontSize={10} fill="#ef4444">Odds(y_l)</text>

              <rect x={30} y={38} width={180} height={16} rx={3} fill="#10b98110" />
              <text x={120} y={50} textAnchor="middle" fontSize={9} fill="#10b981">
                y_w = winner: 인간이 선택한 좋은 응답
              </text>
              <rect x={230} y={38} width={200} height={16} rx={3} fill="#ef444410" />
              <text x={330} y={50} textAnchor="middle" fontSize={9} fill="#ef4444">
                y_l = loser: 인간이 거부한 나쁜 응답
              </text>

              <text x={230} y={76} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                비율 {'>'} 1 → 모델이 좋은 응답을 더 선호 → 원하는 상태
              </text>
              <text x={230} y={94} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                log로 변환: {'>'} 1 → 양수, {'<'} 1 → 음수
              </text>
              <text x={230} y={114} textAnchor="middle" fontSize={10} fill="#6366f1" fontWeight={600}>
                π_ref 없이 현재 모델만으로 비교 가능!
              </text>
            </motion.g>
          )}

          {/* Step 4: 최종 손실 분해 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={18} y={20} fontSize={10} fill="var(--foreground)">L_OR = −log</text>
              <rect x={100} y={6} width={18} height={22} rx={3} fill="#6366f118" stroke="#6366f1" strokeWidth={1} />
              <text x={109} y={21} textAnchor="middle" fontSize={10} fill="#6366f1">σ</text>
              <text x={122} y={20} fontSize={10} fill="var(--foreground)">(log(</text>
              <rect x={152} y={6} width={80} height={22} rx={3} fill="#10b98118" stroke="#10b981" strokeWidth={1} />
              <text x={192} y={21} textAnchor="middle" fontSize={10} fill="#10b981">Odds_w</text>
              <text x={236} y={20} fontSize={10} fill="var(--foreground)">/</text>
              <rect x={245} y={6} width={75} height={22} rx={3} fill="#ef444418" stroke="#ef4444" strokeWidth={1} />
              <text x={282} y={21} textAnchor="middle" fontSize={10} fill="#ef4444">Odds_l</text>
              <text x={324} y={20} fontSize={10} fill="var(--foreground)">))</text>

              <rect x={20} y={36} width={90} height={14} rx={3} fill="#6366f110" />
              <text x={65} y={47} textAnchor="middle" fontSize={8} fill="#6366f1">σ: 0~1 변환</text>
              <rect x={120} y={36} width={120} height={14} rx={3} fill="#10b98110" />
              <text x={180} y={47} textAnchor="middle" fontSize={8} fill="#10b981">좋은 응답의 가능성</text>
              <rect x={250} y={36} width={120} height={14} rx={3} fill="#ef444410" />
              <text x={310} y={47} textAnchor="middle" fontSize={8} fill="#ef4444">나쁜 응답의 가능성</text>

              <text x={230} y={72} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                Odds_w {'>'} Odds_l → 비율 {'>'} 1 → log {'>'} 0 → σ {'>'} 0.5 → loss 작음
              </text>

              <rect x={50} y={84} width={360} height={34} rx={6}
                fill="#f59e0b12" stroke="#f59e0b" strokeWidth={1.5} />
              <text x={230} y={100} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">
                RLHF: 3단계 4모델 → DPO: 2단계 2모델
              </text>
              <text x={230} y={114} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
                → ORPO: 1단계 1모델 (가장 단순!)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
