import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  { label: '1. RLHF의 문제를 수식으로', body: 'RLHF가 풀고 싶은 문제:\n"좋은 응답을 만들되, 원래 모델에서 너무 멀어지지 말 것"\n→ 이 두 목표를 수식 하나로 표현한 것이 RLHF 목적함수' },
  { label: '2. 목적함수 각 항의 의미', body: 'max E[ r(x,y) − β · KL ]\nr(x,y): 보상 모델이 매긴 "응답 품질 점수" (높을수록 좋음)\nβ: 안전 계수 — 클수록 보수적\nKL: 학습 중 모델(π_θ)이 원래 모델(π_ref)에서 얼마나 달라졌는지\n→ "점수는 높이되, 너무 달라지진 마"' },
  { label: '3. DPO의 발견: 최적 정책을 직접 구할 수 있다', body: '이 목적함수의 "정답"(최적 정책 π*)을 수학적으로 풀어보면:\nπ*(y|x) = π_ref(y|x) × exp(r/β) / Z\n의미: 보상 r이 높은 응답일수록 확률이 지수적으로 커짐\nZ: 전체 확률이 1이 되도록 맞춰주는 상수 (나중에 소거됨)' },
  { label: '4. 핵심 변환: 보상 = 로그 비율', body: '3번 수식을 r에 대해 역으로 풀면:\nr = β × log(π*/π_ref) + 상수\n의미: "보상 점수" = β × "학습 모델이 원래 모델 대비 이 응답을 얼마나 더 선호하는지"\n→ 별도 보상 모델이 필요 없다! 정책 자체가 보상을 내포' },
  { label: '5. π/π_ref 비율의 의미', body: 'π_θ(y|x): 학습 중인 모델이 응답 y를 생성할 확률\nπ_ref(y|x): SFT로 학습한 원래 모델이 y를 생성할 확률\nπ/π_ref > 1: 학습 모델이 원래보다 이 응답을 더 선호\nπ/π_ref < 1: 학습 모델이 원래보다 이 응답을 덜 선호\nlog를 씌우는 이유: 비율을 더하기/빼기로 다루기 쉽게 변환' },
  { label: '6. BT에 대입 → 최종 DPO 손실', body: 'BT 모델: P(y_w이 y_l보다 좋을 확률) = σ(r_w − r_l)\nr = β·log(π/π_ref)를 대입하면 상수 Z가 빼기에서 소거됨!\n최종: L = −log σ(β × (log_ratio_win − log_ratio_lose))\n→ 보상 모델 학습(2단계) + PPO(3단계)가 이 하나의 손실로 대체됨' },
];

export default function DPODerivationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 문제 정의 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={40} y={15} width={180} height={36} rx={5}
                fill="#10b98112" stroke="#10b981" strokeWidth={1} />
              <text x={130} y={30} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}>좋은 응답 만들기</text>
              <text x={130} y={44} textAnchor="middle" fontSize={9} fill="#10b981">r(x,y) ↑</text>

              <text x={240} y={36} fontSize={14} fill="var(--muted-foreground)">+</text>

              <rect x={260} y={15} width={180} height={36} rx={5}
                fill="#ef444412" stroke="#ef4444" strokeWidth={1} />
              <text x={350} y={30} textAnchor="middle" fontSize={10} fill="#ef4444" fontWeight={600}>너무 달라지지 말기</text>
              <text x={350} y={44} textAnchor="middle" fontSize={9} fill="#ef4444">KL ↓</text>

              <rect x={100} y={65} width={260} height={30} rx={6}
                fill="#6366f112" stroke="#6366f1" strokeWidth={1.5} />
              <text x={230} y={84} textAnchor="middle" fontSize={11} fill="#6366f1" fontWeight={700}>
                = RLHF 목적함수
              </text>
              <text x={230} y={112} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                DPO: 이 수식의 "정답"을 바로 구할 수 있다는 발견
              </text>
            </motion.g>
          )}

          {/* Step 1: 각 항 색상 분해 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={25} y={24} fontSize={11} fill="var(--foreground)">max E[</text>
              <rect x={80} y={10} width={60} height={22} rx={3} fill="#10b98118" stroke="#10b981" strokeWidth={1} />
              <text x={110} y={25} textAnchor="middle" fontSize={11} fill="#10b981" fontWeight={600}>r(x,y)</text>
              <text x={150} y={24} fontSize={14} fill="var(--muted-foreground)">−</text>
              <rect x={162} y={10} width={20} height={22} rx={3} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
              <text x={172} y={25} textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight={600}>β</text>
              <text x={190} y={24} fontSize={11} fill="var(--muted-foreground)">·</text>
              <rect x={198} y={10} width={36} height={22} rx={3} fill="#ef444418" stroke="#ef4444" strokeWidth={1} />
              <text x={216} y={25} textAnchor="middle" fontSize={11} fill="#ef4444" fontWeight={600}>KL</text>
              <text x={240} y={24} fontSize={11} fill="var(--foreground)">]</text>

              {/* 설명 */}
              <rect x={20} y={45} width={130} height={18} rx={3} fill="#10b98110" />
              <text x={85} y={57} textAnchor="middle" fontSize={9} fill="#10b981">r: 응답 품질 점수</text>
              <rect x={165} y={45} width={110} height={18} rx={3} fill="#f59e0b10" />
              <text x={220} y={57} textAnchor="middle" fontSize={9} fill="#f59e0b">β: 안전 계수</text>
              <rect x={290} y={45} width={150} height={18} rx={3} fill="#ef444410" />
              <text x={365} y={57} textAnchor="middle" fontSize={9} fill="#ef4444">KL: 원래 모델과의 거리</text>

              <text x={230} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                β가 크면 → KL 벌점 강함 → 원래 모델 근처에서만 학습
              </text>
              <text x={230} y={102} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                β가 작으면 → 자유롭게 탐색 → 보상 해킹 위험
              </text>
            </motion.g>
          )}

          {/* Step 2: 최적 정책 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={230} y={18} textAnchor="middle" fontSize={10} fill="var(--foreground)">
                최적 정책 = 원래 모델 × 보상에 비례하는 가중치
              </text>
              <text x={20} y={44} fontSize={11} fill="var(--foreground)">π* =</text>
              <rect x={50} y={30} width={75} height={22} rx={3} fill="#3b82f618" stroke="#3b82f6" strokeWidth={1} />
              <text x={87} y={45} textAnchor="middle" fontSize={10} fill="#3b82f6">π_ref</text>
              <text x={132} y={44} fontSize={11} fill="var(--muted-foreground)">×</text>
              <rect x={142} y={30} width={85} height={22} rx={3} fill="#10b98118" stroke="#10b981" strokeWidth={1} />
              <text x={184} y={45} textAnchor="middle" fontSize={10} fill="#10b981">exp(r/β)</text>
              <text x={234} y={44} fontSize={11} fill="var(--muted-foreground)">/</text>
              <rect x={244} y={30} width={30} height={22} rx={3} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
              <text x={259} y={45} textAnchor="middle" fontSize={10} fill="#f59e0b">Z</text>

              <rect x={30} y={62} width={160} height={16} rx={3} fill="#3b82f610" />
              <text x={110} y={74} textAnchor="middle" fontSize={9} fill="#3b82f6">π_ref: SFT 원래 모델</text>
              <rect x={200} y={62} width={150} height={16} rx={3} fill="#10b98110" />
              <text x={275} y={74} textAnchor="middle" fontSize={9} fill="#10b981">exp(r/β): 보상 높으면 ↑↑</text>
              <rect x={360} y={62} width={80} height={16} rx={3} fill="#f59e0b10" />
              <text x={400} y={74} textAnchor="middle" fontSize={9} fill="#f59e0b">Z: 합=1 맞춤</text>

              <text x={230} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                보상 r이 높은 응답 → exp(r/β)가 크게 증가 → 확률 ↑
              </text>
              <text x={230} y={118} textAnchor="middle" fontSize={10} fill="#6366f1" fontWeight={600}>
                Z는 나중에 빼기에서 소거되므로 계산 불필요!
              </text>
            </motion.g>
          )}

          {/* Step 3: 핵심 변환 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={230} y={16} textAnchor="middle" fontSize={10} fill="var(--foreground)">
                2번을 뒤집으면: 보상 = 정책 비율의 로그
              </text>
              <text x={20} y={44} fontSize={11} fill="var(--foreground)">r =</text>
              <rect x={40} y={30} width={20} height={22} rx={3} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
              <text x={50} y={45} textAnchor="middle" fontSize={10} fill="#f59e0b">β</text>
              <text x={66} y={44} fontSize={11} fill="var(--muted-foreground)">×</text>
              <rect x={74} y={30} width={115} height={22} rx={3} fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1} />
              <text x={131} y={45} textAnchor="middle" fontSize={10} fill="#8b5cf6">log(π / π_ref)</text>
              <text x={196} y={44} fontSize={11} fill="var(--muted-foreground)">+ Z</text>

              <rect x={20} y={62} width={200} height={16} rx={3} fill="#8b5cf610" />
              <text x={120} y={74} textAnchor="middle" fontSize={9} fill="#8b5cf6">
                π/π_ref: 학습 모델이 원래보다 이 응답을 얼마나 더 좋아하는지
              </text>
              <text x={230} y={95} textAnchor="middle" fontSize={11} fill="#10b981" fontWeight={600}>
                보상 모델 R을 따로 학습할 필요가 없다!
              </text>
              <text x={230} y={115} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                정책(π_θ)이 변하면 자동으로 보상도 변함
              </text>
            </motion.g>
          )}

          {/* Step 4: 비율의 의미 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={230} y={16} textAnchor="middle" fontSize={10} fill="var(--foreground)">
                π_θ(y|x) / π_ref(y|x) — 이 비율이 의미하는 것
              </text>
              {[
                { ratio: '> 1', meaning: '학습 모델이 이 응답을 더 선호', color: '#10b981', x: 30 },
                { ratio: '= 1', meaning: '원래와 동일한 선호도', color: '#f59e0b', x: 180 },
                { ratio: '< 1', meaning: '학습 모델이 이 응답을 덜 선호', color: '#ef4444', x: 310 },
              ].map((item, i) => (
                <motion.g key={item.ratio} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.15 }}>
                  <rect x={item.x} y={28} width={130} height={40} rx={5}
                    fill={`${item.color}12`} stroke={item.color} strokeWidth={1} />
                  <text x={item.x + 65} y={45} textAnchor="middle" fontSize={11}
                    fontWeight={700} fill={item.color}>비율 {item.ratio}</text>
                  <text x={item.x + 65} y={60} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">{item.meaning}</text>
                </motion.g>
              ))}

              <text x={230} y={88} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                log를 씌우는 이유: 비율(곱셈)을 차이(덧셈)로 변환
              </text>
              <text x={230} y={106} textAnchor="middle" fontSize={10} fill="#6366f1">
                log(2) = 0.69 → "2배 더 선호" = 0.69점
              </text>
              <text x={230} y={122} textAnchor="middle" fontSize={10} fill="#6366f1">
                log(0.5) = −0.69 → "절반만 선호" = −0.69점
              </text>
            </motion.g>
          )}

          {/* Step 5: 최종 DPO */}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={230} y={14} textAnchor="middle" fontSize={10} fill="var(--foreground)">
                BT에 대입: 선호 응답의 log_ratio가 비선호보다 높으면 OK
              </text>
              <rect x={20} y={22} width={420} height={28} rx={5}
                fill="#6366f115" stroke="#6366f1" strokeWidth={2} />
              <text x={230} y={40} textAnchor="middle" fontSize={10} fill="#6366f1" fontFamily="monospace">
                L = −log σ(β × (log_ratio_win − log_ratio_lose))
              </text>

              <rect x={50} y={58} width={160} height={16} rx={3} fill="#10b98110" />
              <text x={130} y={70} textAnchor="middle" fontSize={9} fill="#10b981">
                log_ratio_win: 좋은 응답의 선호도 변화
              </text>
              <rect x={230} y={58} width={180} height={16} rx={3} fill="#ef444410" />
              <text x={320} y={70} textAnchor="middle" fontSize={9} fill="#ef4444">
                log_ratio_lose: 나쁜 응답의 선호도 변화
              </text>

              <text x={230} y={92} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                win의 선호도 변화 {'>'} lose의 변화 → σ ↑ → loss ↓
              </text>
              <rect x={60} y={100} width={340} height={22} rx={5}
                fill="#f59e0b12" stroke="#f59e0b" strokeWidth={1} />
              <text x={230} y={115} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">
                RM 학습(2단계) + PPO(3단계) → 이 하나의 손실로 대체!
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
