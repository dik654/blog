import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS: StepDef[] = [
  {
    label: '1. Cross-Entropy의 한계',
    body: 'CE = -log(p_t)\n다수 클래스(easy sample): p_t ≈ 0.95 → loss ≈ 0.05 (작음)\n소수 클래스(hard sample): p_t ≈ 0.2 → loss ≈ 1.6 (큼)\n문제: easy sample이 전체 loss를 지배 → 소수 클래스 학습 방해',
  },
  {
    label: '2. Focal Loss — easy sample 가중치 감소',
    body: 'FL = -(1 - p_t)^gamma * log(p_t)\n(1 - p_t)^gamma가 modulating factor\np_t가 높은(쉬운) 샘플 → (1-p_t)^gamma ≈ 0 → loss 거의 0\np_t가 낮은(어려운) 샘플 → (1-p_t)^gamma ≈ 1 → 원래 CE 유지',
  },
  {
    label: '3. gamma의 효과',
    body: 'gamma = 0 → 표준 CE (감소 없음)\ngamma = 1 → 약한 감소\ngamma = 2 → 적절한 감소 (기본값)\ngamma = 5 → 강한 감소 (easy sample 거의 무시)\n실전: gamma=2가 RetinaNet 논문의 기본 설정',
  },
  {
    label: '4. Class Weight — 역빈도 가중치',
    body: 'w_i = N / (K * n_i)\nN: 전체 샘플 수, K: 클래스 수, n_i: 클래스 i의 샘플 수\n소수 클래스 → n_i 작음 → w_i 큼 → loss 기여 증가\nsklearn: class_weight="balanced" 자동 계산',
  },
  {
    label: '5. Weighted BCE + alpha-balanced Focal',
    body: 'Weighted BCE: w_pos * y * log(p) + w_neg * (1-y) * log(1-p)\nalpha-balanced Focal: -alpha_t * (1-p_t)^gamma * log(p_t)\nalpha: 클래스별 가중치 (보통 소수 클래스에 0.75)\nalpha + gamma 조합이 가장 강력',
  },
  {
    label: '6. 손실 함수 선택 가이드',
    body: '경미한 불균형(1:5) → Class Weight만 적용\n보통(1:20) → Focal Loss (gamma=2)\n심각(1:100+) → alpha-balanced Focal + Hard Example Mining\n비용 비대칭 → Asymmetric Loss (FP/FN 비용 다를 때)',
  },
];

export default function FocalLossViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: CE 한계 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Cross-Entropy의 문제</text>

              {/* easy sample 바 */}
              <rect x={40} y={45} width={200} height={30} rx={4}
                fill="#3b82f612" stroke="#3b82f6" strokeWidth={1} />
              <text x={50} y={64} fontSize={10} fill="#3b82f6" fontWeight={600}>Easy (p=0.95)</text>
              <motion.rect x={155} y={50} width={0} height={20} rx={3} fill="#3b82f6" fillOpacity={0.3}
                initial={{ width: 0 }} animate={{ width: 10 }} transition={{ ...sp, duration: 0.6 }} />
              <text x={175} y={64} fontSize={9} fill="#3b82f6">loss=0.05</text>

              {/* hard sample 바 */}
              <rect x={40} y={85} width={200} height={30} rx={4}
                fill="#ef444412" stroke="#ef4444" strokeWidth={1} />
              <text x={50} y={104} fontSize={10} fill="#ef4444" fontWeight={600}>Hard (p=0.2)</text>
              <motion.rect x={155} y={90} width={0} height={20} rx={3} fill="#ef4444" fillOpacity={0.3}
                initial={{ width: 0 }} animate={{ width: 80 }} transition={{ ...sp, duration: 0.6 }} />
              <text x={245} y={104} fontSize={9} fill="#ef4444">loss=1.6</text>

              {/* 문제 */}
              <rect x={280} y={45} width={210} height={70} rx={6}
                fill="#f59e0b08" stroke="#f59e0b" strokeWidth={1} />
              <text x={385} y={65} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="#f59e0b">문제: Easy가 95%</text>
              <text x={385} y={82} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">전체 loss에서 다수 클래스가</text>
              <text x={385} y={96} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">gradient를 지배</text>

              {/* 누적 loss 시각화 */}
              <text x={260} y={140} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--foreground)">배치 내 총 loss 구성</text>
              <rect x={60} y={150} width={380} height={24} rx={4}
                fill="#3b82f615" stroke="#3b82f6" strokeWidth={0.8} />
              <motion.rect x={60} y={150} width={0} height={24} rx={4} fill="#3b82f6" fillOpacity={0.25}
                initial={{ width: 0 }} animate={{ width: 361 }} transition={{ ...sp, duration: 0.8 }} />
              <motion.rect x={421} y={150} width={0} height={24} rx={4} fill="#ef4444" fillOpacity={0.35}
                initial={{ width: 0 }} animate={{ width: 19 }} transition={{ ...sp, duration: 0.8, delay: 0.3 }} />
              <text x={240} y={166} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={600}>
                Easy samples (95% of loss)
              </text>
              <text x={431} y={166} textAnchor="middle" fontSize={7} fill="#ef4444">5%</text>

              <text x={260} y={200} textAnchor="middle" fontSize={10}
                fill="#ef4444" fontWeight={600}>소수 클래스의 gradient가 묻혀버림</text>
            </motion.g>
          )}

          {/* Step 1: Focal Loss 수식 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Focal Loss 핵심 아이디어</text>

              {/* CE */}
              <rect x={30} y={35} width={200} height={30} rx={5}
                fill="#64748b10" stroke="#64748b" strokeWidth={1} />
              <text x={130} y={54} textAnchor="middle" fontSize={11} fontFamily="monospace"
                fill="var(--foreground)">CE = -log(p_t)</text>

              {/* 화살표 */}
              <line x1={130} y1={65} x2={130} y2={82} stroke="var(--border)" strokeWidth={1} />
              <polygon points="126,80 134,80 130,86" fill="var(--border)" />
              <text x={155} y={78} fontSize={9} fill="var(--muted-foreground)">modulating factor 추가</text>

              {/* Focal */}
              <rect x={30} y={90} width={290} height={34} rx={5}
                fill="#8b5cf612" stroke="#8b5cf6" strokeWidth={1.5} />
              <text x={175} y={112} textAnchor="middle" fontSize={12} fontFamily="monospace"
                fontWeight={600} fill="#8b5cf6">FL = -(1-p_t)^gamma * log(p_t)</text>

              {/* 각 부분 설명 */}
              <rect x={340} y={35} width={160} height={26} rx={4} fill="#10b98110" />
              <text x={420} y={52} textAnchor="middle" fontSize={9} fill="#10b981">
                p_t 높으면(쉬우면) → 0에 가까움
              </text>

              <rect x={340} y={68} width={160} height={26} rx={4} fill="#ef444410" />
              <text x={420} y={85} textAnchor="middle" fontSize={9} fill="#ef4444">
                p_t 낮으면(어려우면) → 1에 가까움
              </text>

              {/* 효과 시각화 */}
              <text x={260} y={148} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--foreground)">p_t=0.95 (easy)</text>
              <rect x={60} y={155} width={400} height={18} rx={3}
                fill="#3b82f608" stroke="var(--border)" strokeWidth={0.5} />
              <motion.rect x={60} y={155} width={0} height={18} rx={3} fill="#3b82f6" fillOpacity={0.2}
                initial={{ width: 0 }} animate={{ width: 10 }} transition={{ ...sp, duration: 0.6 }} />
              <text x={80} y={168} fontSize={8} fill="#3b82f6">FL ≈ 0.0001</text>
              <text x={200} y={168} fontSize={8} fill="var(--muted-foreground)">CE=0.05 → FL이 500배 감소</text>

              <text x={260} y={195} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--foreground)">p_t=0.2 (hard)</text>
              <rect x={60} y={202} width={400} height={18} rx={3}
                fill="#ef444408" stroke="var(--border)" strokeWidth={0.5} />
              <motion.rect x={60} y={202} width={0} height={18} rx={3} fill="#ef4444" fillOpacity={0.3}
                initial={{ width: 0 }} animate={{ width: 260 }} transition={{ ...sp, duration: 0.6 }} />
              <text x={330} y={215} fontSize={8} fill="#ef4444">FL ≈ 1.02 (CE=1.6의 64% 유지)</text>
            </motion.g>
          )}

          {/* Step 2: gamma 효과 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">gamma에 따른 loss 곡선</text>

              {/* 축 */}
              <line x1={60} y1={200} x2={480} y2={200} stroke="var(--border)" strokeWidth={1} />
              <line x1={60} y1={200} x2={60} y2={35} stroke="var(--border)" strokeWidth={1} />
              <text x={270} y={225} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                p_t (예측 확률)
              </text>
              <text x={38} y={115} fontSize={9} fill="var(--muted-foreground)"
                transform="rotate(-90, 38, 115)">loss</text>

              {/* x축 레이블 */}
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
                <text key={v} x={60 + v * 420} y={215} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">{v}</text>
              ))}

              {/* gamma=0 (CE) 곡선 — 근사 */}
              <motion.polyline
                points="60,35 102,68 144,95 186,118 228,140 270,158 312,172 354,183 396,191 438,196 480,200"
                fill="none" stroke="#94a3b8" strokeWidth={1.8}
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp} />
              <text x={82} y={52} fontSize={9} fill="#94a3b8" fontWeight={600}>gamma=0 (CE)</text>

              {/* gamma=1 */}
              <motion.polyline
                points="60,70 102,100 144,122 186,140 228,155 270,167 312,178 354,186 396,194 438,198 480,200"
                fill="none" stroke="#3b82f6" strokeWidth={1.8}
                initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ ...sp, delay: 0.2 }} />
              <text x={112} y={90} fontSize={9} fill="#3b82f6" fontWeight={600}>gamma=1</text>

              {/* gamma=2 (기본) */}
              <motion.polyline
                points="60,108 102,130 144,148 186,162 228,173 270,181 312,188 354,193 396,197 438,199 480,200"
                fill="none" stroke="#8b5cf6" strokeWidth={2.5}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }} />
              <text x={115} y={125} fontSize={9} fill="#8b5cf6" fontWeight={700}>gamma=2 (기본)</text>

              {/* gamma=5 */}
              <motion.polyline
                points="60,160 102,172 144,180 186,186 228,190 270,194 312,196 354,198 396,199 438,200 480,200"
                fill="none" stroke="#ef4444" strokeWidth={1.8}
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ ...sp, delay: 0.6 }} />
              <text x={115} y={158} fontSize={9} fill="#ef4444" fontWeight={600}>gamma=5</text>

              {/* 핵심 영역 하이라이트 */}
              <motion.rect x={350} y={180} width={130} height={20} rx={4}
                fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1} strokeDasharray="3 2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }} />
              <motion.text x={415} y={177} textAnchor="middle" fontSize={8} fill="#10b981" fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
                easy sample 영역 → loss 크게 감소
              </motion.text>
            </motion.g>
          )}

          {/* Step 3: Class Weight */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Class Weight: 역빈도 가중치</text>

              {/* 수식 */}
              <rect x={130} y={35} width={260} height={30} rx={5}
                fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1.2} />
              <text x={260} y={55} textAnchor="middle" fontSize={11} fontFamily="monospace"
                fill="#8b5cf6" fontWeight={600}>w_i = N / (K * n_i)</text>

              {/* 변수 설명 */}
              {[
                { label: 'N=1000', desc: '전체 샘플', color: '#3b82f6', x: 60 },
                { label: 'K=2', desc: '클래스 수', color: '#10b981', x: 200 },
                { label: 'n_i', desc: '클래스별 수', color: '#f59e0b', x: 340 },
              ].map((v) => (
                <g key={v.label}>
                  <rect x={v.x} y={78} width={120} height={24} rx={4} fill={`${v.color}10`} />
                  <text x={v.x + 60} y={94} textAnchor="middle" fontSize={9} fill={v.color} fontWeight={600}>
                    {v.label}: {v.desc}
                  </text>
                </g>
              ))}

              {/* 계산 예시 */}
              <text x={260} y={125} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--foreground)">계산 예시: 정상 950, 이상 50</text>

              <rect x={50} y={138} width={190} height={50} rx={6}
                fill="#3b82f608" stroke="#3b82f6" strokeWidth={1} />
              <text x={145} y={156} textAnchor="middle" fontSize={10} fill="#3b82f6" fontWeight={600}>
                정상: w = 1000/(2*950)
              </text>
              <text x={145} y={174} textAnchor="middle" fontSize={12} fill="#3b82f6" fontWeight={700}>
                = 0.53
              </text>

              <rect x={280} y={138} width={190} height={50} rx={6}
                fill="#ef444408" stroke="#ef4444" strokeWidth={1} />
              <text x={375} y={156} textAnchor="middle" fontSize={10} fill="#ef4444" fontWeight={600}>
                이상: w = 1000/(2*50)
              </text>
              <text x={375} y={174} textAnchor="middle" fontSize={12} fill="#ef4444" fontWeight={700}>
                = 10.0
              </text>

              {/* 효과 */}
              <rect x={100} y={200} width={320} height={26} rx={5}
                fill="#10b98110" stroke="#10b981" strokeWidth={1} />
              <text x={260} y={217} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}>
                이상 클래스의 loss가 19배 더 크게 반영
              </text>
            </motion.g>
          )}

          {/* Step 4: 조합 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">손실 함수 변형들</text>

              {[
                {
                  name: 'Weighted BCE', formula: 'w * BCE',
                  desc: '클래스별 가중치 적용', color: '#3b82f6', y: 35,
                },
                {
                  name: 'alpha-balanced Focal', formula: '-alpha_t * (1-p_t)^g * log(p_t)',
                  desc: 'alpha(가중치) + gamma(난이도)', color: '#8b5cf6', y: 90,
                },
                {
                  name: 'Asymmetric Loss', formula: 'L+ = (1-p)^g+ * log(p), L- = p^g- * log(1-p)',
                  desc: 'FP와 FN에 다른 gamma 적용', color: '#ef4444', y: 145,
                },
              ].map((item, i) => (
                <motion.g key={item.name} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.15 }}>
                  <rect x={20} y={item.y} width={480} height={44} rx={6}
                    fill={`${item.color}08`} stroke={item.color} strokeWidth={1} />
                  <text x={35} y={item.y + 18} fontSize={11} fontWeight={700} fill={item.color}>
                    {item.name}
                  </text>
                  <text x={35} y={item.y + 34} fontSize={9} fontFamily="monospace"
                    fill="var(--foreground)">{item.formula}</text>
                  <text x={490} y={item.y + 26} textAnchor="end" fontSize={9}
                    fill="var(--muted-foreground)">{item.desc}</text>
                </motion.g>
              ))}

              <rect x={100} y={205} width={320} height={26} rx={5}
                fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} />
              <text x={260} y={222} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>
                alpha-balanced Focal이 가장 범용적 (RetinaNet 기본)
              </text>
            </motion.g>
          )}

          {/* Step 5: 선택 가이드 */}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">손실 함수 선택 가이드</text>

              {[
                { ratio: '1:5', loss: 'Class Weight', detail: 'CE + balanced weight', color: '#10b981', y: 38 },
                { ratio: '1:20', loss: 'Focal Loss', detail: 'gamma=2, alpha=0.25', color: '#3b82f6', y: 83 },
                { ratio: '1:100+', loss: 'alpha-Focal + Mining', detail: 'Hard Example Mining 추가', color: '#f59e0b', y: 128 },
                { ratio: '비대칭 비용', loss: 'Asymmetric Loss', detail: 'g+=0, g-=4 (FN 강조)', color: '#ef4444', y: 173 },
              ].map((item, i) => (
                <motion.g key={item.ratio} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  {/* 비율 뱃지 */}
                  <rect x={30} y={item.y} width={90} height={32} rx={16}
                    fill={`${item.color}15`} stroke={item.color} strokeWidth={1.2} />
                  <text x={75} y={item.y + 20} textAnchor="middle" fontSize={10} fontWeight={700}
                    fill={item.color}>{item.ratio}</text>

                  {/* 화살표 */}
                  <line x1={120} y1={item.y + 16} x2={148} y2={item.y + 16}
                    stroke={item.color} strokeWidth={1} />
                  <polygon points={`146,${item.y + 13} 146,${item.y + 19} 152,${item.y + 16}`}
                    fill={item.color} />

                  {/* 손실 함수 */}
                  <rect x={155} y={item.y} width={150} height={32} rx={6}
                    fill={`${item.color}10`} stroke={item.color} strokeWidth={1} />
                  <text x={230} y={item.y + 20} textAnchor="middle" fontSize={10} fontWeight={600}
                    fill={item.color}>{item.loss}</text>

                  {/* 설정 */}
                  <text x={320} y={item.y + 20} fontSize={9}
                    fill="var(--muted-foreground)">{item.detail}</text>
                </motion.g>
              ))}

              <text x={260} y={230} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                모든 경우: 리샘플링과 손실 함수 조합이 단독 사용보다 효과적
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
