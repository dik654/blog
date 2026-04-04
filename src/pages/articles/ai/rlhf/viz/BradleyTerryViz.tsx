import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  { label: '1. 왜 보상 모델이 필요한가', body: 'LLM의 응답 품질을 "숫자"로 표현하고 싶음\n하지만 "좋은 응답"의 절대 점수를 매기기는 어려움\n→ 대신 "A가 B보다 낫다"는 상대 비교가 자연스러움' },
  { label: '2. 인간의 쌍별 비교', body: '같은 질문 x에 대해 응답 2개를 보여줌\n인간이 "왼쪽이 더 좋다" / "오른쪽이 더 좋다" 선택\n→ (y_win, y_lose) 선호 쌍 수집\n1쌍당 $0.5~2 비용, 수만 쌍 필요' },
  { label: '3. Bradley-Terry 모델이란', body: '체스 ELO 레이팅과 같은 원리:\n선수 A의 실력이 r_A, B가 r_B일 때\nA가 B를 이길 확률 = σ(r_A − r_B)\nσ = sigmoid = 1/(1+exp(−x))\n→ 실력 차이가 클수록 이길 확률이 1에 가까움' },
  { label: '4. 보상 모델 학습', body: 'R(x,y): 질문 x에 대한 응답 y의 "실력 점수"\nP(y_w ≻ y_l) = σ(R(x,y_w) − R(x,y_l))\nLoss = −log σ(R(y_w) − R(y_l))\n→ 선호 응답의 점수가 비선호보다 높아지도록 학습' },
  { label: '5. 예시: 실제 학습 과정', body: '질문: "파이썬에서 리스트 정렬 방법은?"\ny_w: "sorted() 함수를 사용합니다. 예: sorted([3,1,2]) → [1,2,3]"\ny_l: "정렬할 수 있습니다."\n→ R(y_w)=0.8, R(y_l)=0.2 → σ(0.6)=0.65 → loss 감소' },
];

export default function BradleyTerryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 절대 점수 vs 상대 비교 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={30} y={15} width={160} height={40} rx={5}
                fill="#ef444412" stroke="#ef4444" strokeWidth={1} />
              <text x={110} y={32} textAnchor="middle" fontSize={10} fill="#ef4444">절대 점수: "8.5점"</text>
              <text x={110} y={46} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">기준이 모호함</text>

              <text x={210} y={38} fontSize={12} fill="var(--muted-foreground)">→</text>

              <rect x={230} y={15} width={190} height={40} rx={5}
                fill="#10b98115" stroke="#10b981" strokeWidth={1.5} />
              <text x={325} y={32} textAnchor="middle" fontSize={10} fill="#10b981">상대 비교: "A가 B보다 낫다"</text>
              <text x={325} y={46} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">인간에게 자연스러운 판단</text>

              <text x={230} y={80} textAnchor="middle" fontSize={10} fill="#6366f1" fontWeight={600}>
                문제: 상대 비교를 어떻게 "숫자 점수"로 변환?
              </text>
              <text x={230} y={100} textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight={600}>
                → Bradley-Terry 모델
              </text>
            </motion.g>
          )}

          {/* Step 2: sigmoid 시각화 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={230} y={16} textAnchor="middle" fontSize={10} fill="var(--foreground)">
                σ(x) = 1 / (1 + e⁻ˣ) — Sigmoid 함수
              </text>
              {/* 간단한 sigmoid 곡선 */}
              <line x1={60} y1={75} x2={400} y2={75} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              <line x1={230} y1={25} x2={230} y2={125} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              <motion.path d="M60,115 Q130,112 170,100 Q200,85 230,75 Q260,65 290,50 Q330,38 400,35"
                fill="none" stroke="#6366f1" strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
              <text x={405} y={38} fontSize={9} fill="#6366f1">1.0</text>
              <text x={405} y={78} fontSize={9} fill="var(--muted-foreground)">0.5</text>
              <text x={405} y={118} fontSize={9} fill="#6366f1">0.0</text>
              <text x={230} y={135} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                r_w − r_l (실력 차이)
              </text>

              {/* 핵심 포인트 */}
              <circle cx={310} cy={43} r={4} fill="#10b981" />
              <text x={316} y={42} fontSize={9} fill="#10b981">차이 크면 확률 ≈ 1</text>
              <circle cx={150} cy={107} r={4} fill="#ef4444" />
              <text x={156} y={106} fontSize={9} fill="#ef4444">차이 작으면 확률 ≈ 0</text>
            </motion.g>
          )}

          {/* Step 3: 보상 모델 학습 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={30} y={10} width={400} height={30} rx={5}
                fill="#6366f112" stroke="#6366f1" strokeWidth={1} />
              <text x={230} y={29} textAnchor="middle" fontSize={11} fill="#6366f1" fontFamily="monospace">
                P(y_w ≻ y_l) = σ(R(x,y_w) − R(x,y_l))
              </text>

              <text x={230} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                ↓ 최대화 → 음의 로그 → 최소화
              </text>

              <rect x={60} y={68} width={340} height={30} rx={5}
                fill="#ef444412" stroke="#ef4444" strokeWidth={1.5} />
              <text x={230} y={87} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444" fontFamily="monospace">
                Loss = −log σ(R(y_w) − R(y_l))
              </text>

              <text x={230} y={115} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                R(y_w) ↑, R(y_l) ↓ → 차이 ↑ → σ ↑ → loss ↓
              </text>
            </motion.g>
          )}

          {/* Step 4: 예시 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={20} y={10} width={200} height={36} rx={4}
                fill="#10b98115" stroke="#10b981" strokeWidth={1} />
              <text x={120} y={25} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>y_w: "sorted()를 사용..."</text>
              <text x={120} y={38} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">R = 0.8</text>

              <rect x={240} y={10} width={200} height={36} rx={4}
                fill="#ef444415" stroke="#ef4444" strokeWidth={1} />
              <text x={340} y={25} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={600}>y_l: "정렬할 수 있습니다"</text>
              <text x={340} y={38} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">R = 0.2</text>

              <text x={230} y={65} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                차이 = 0.8 − 0.2 = 0.6
              </text>
              <text x={230} y={82} textAnchor="middle" fontSize={10} fill="#6366f1">
                σ(0.6) = 0.65 → "65% 확률로 y_w가 더 좋다"
              </text>
              <text x={230} y={102} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>
                학습이 진행되면 → 차이↑ → σ→1.0 → loss→0
              </text>
            </motion.g>
          )}

          {/* Step 1: 쌍별 비교 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={80} y={10} width={120} height={28} rx={4}
                fill="#6366f115" stroke="#6366f1" strokeWidth={1} />
              <text x={140} y={28} textAnchor="middle" fontSize={10} fill="#6366f1">질문 x</text>

              <line x1={140} y1={38} x2={100} y2={52} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <line x1={140} y1={38} x2={180} y2={52} stroke="var(--muted-foreground)" strokeWidth={0.8} />

              <rect x={40} y={54} width={120} height={28} rx={4}
                fill="#10b98115" stroke="#10b981" strokeWidth={1.5} />
              <text x={100} y={72} textAnchor="middle" fontSize={10} fill="#10b981">응답 A ✓</text>

              <rect x={160} y={54} width={100} height={28} rx={4}
                fill="#ef444415" stroke="#ef4444" strokeWidth={1} />
              <text x={210} y={72} textAnchor="middle" fontSize={10} fill="#ef4444">응답 B ✗</text>

              <text x={150} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                인간: "A가 더 좋다" → (y_w=A, y_l=B)
              </text>
              <text x={150} y={118} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                y_w = 선호된 응답(winner) / y_l = 비선호 응답(loser)
              </text>

              <rect x={300} y={50} width={140} height={46} rx={5}
                fill="#f59e0b08" stroke="#f59e0b" strokeWidth={0.8} />
              <text x={370} y={67} textAnchor="middle" fontSize={9} fill="#f59e0b">InstructGPT: 40K 쌍</text>
              <text x={370} y={81} textAnchor="middle" fontSize={9} fill="#f59e0b">Anthropic: 170K 쌍</text>
              <text x={370} y={93} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">1쌍당 $0.5~2</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
