import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  { label: '1. 쌍별 비교의 한계', body: 'DPO/RLHF는 (y_w, y_l) 쌍 데이터 필요\n실제 환경: 단일 응답에 "좋아요/싫어요" 피드백이 더 자연스러움\n기존 평점 데이터(1-5점)를 선호 쌍으로 변환하면 정보 손실' },
  { label: '2. 전망이론 (Prospect Theory)', body: 'Kahneman & Tversky: 인간은 이득보다 손실에 더 민감\n→ 나쁜 응답을 억제하는 것이 좋은 응답을 강화하는 것보다 효과적\nKTO는 이 비대칭성을 손실 함수에 반영' },
  { label: '3. KTO 손실 함수', body: 'z = log(π_θ(y|x)/π_ref(y|x)) − KL(π_θ ∥ π_ref)\n좋은 응답: L_good = −σ(β·z) — 확률 ↑ 유도\n나쁜 응답: L_bad = −σ(−β·z) — 확률 ↓ 유도 (더 강하게)\n→ 쌍 데이터 없이 단일 응답 피드백으로 학습' },
  { label: '4. KTO의 장점', body: '쌍 데이터 수집 불필요 → 기존 평점/좋아요 데이터 활용\n손실 회피 비대칭 → 유해 응답 억제에 효과적\n실험: DPO와 동등 성능, 데이터 효율 더 높음\n한계: 좋음/나쁨 경계 기준 설정이 중요' },
];

export default function KTOViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* DPO 쌍별 vs KTO 단일 */}
              <rect x={30} y={15} width={170} height={40} rx={5}
                fill="#ef444412" stroke="#ef4444" strokeWidth={1} />
              <text x={115} y={32} textAnchor="middle" fontSize={10} fill="#ef4444">DPO: (y_w, y_l) 쌍 필요</text>
              <text x={115} y={46} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">수집 비용 높음</text>

              <text x={220} y={38} fontSize={12} fill="var(--muted-foreground)">vs</text>

              <rect x={240} y={15} width={190} height={40} rx={5}
                fill="#10b98112" stroke="#10b981" strokeWidth={1.5} />
              <text x={335} y={32} textAnchor="middle" fontSize={10} fill="#10b981">KTO: 단일 응답 + 👍/👎</text>
              <text x={335} y={46} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">기존 데이터 활용 가능</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 전망이론 비대칭 그래프 */}
              <text x={230} y={14} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                전망이론: 가치 함수 v(x)
              </text>
              {/* 축 */}
              <line x1={100} y1={55} x2={360} y2={55} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <line x1={230} y1={20} x2={230} y2={100} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <text x={365} y={58} fontSize={9} fill="var(--muted-foreground)">이득</text>
              <text x={95} y={58} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">손실</text>
              {/* 이득 곡선 (완만) */}
              <motion.path d="M230,55 Q280,35 360,30" fill="none" stroke="#10b981" strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
              {/* 손실 곡선 (가파름) */}
              <motion.path d="M230,55 Q180,80 100,95" fill="none" stroke="#ef4444" strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
              <text x={310} y={28} fontSize={9} fill="#10b981">이득 → 완만</text>
              <text x={130} y={100} fontSize={9} fill="#ef4444">손실 → 가파름</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={230} y={16} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                z = log(π_θ/π_ref) − KL
              </text>
              <rect x={30} y={28} width={190} height={30} rx={4}
                fill="#10b98112" stroke="#10b981" strokeWidth={1} />
              <text x={125} y={47} textAnchor="middle" fontSize={10} fill="#10b981">
                L_good = −σ(β·z) → 확률 ↑
              </text>
              <rect x={240} y={28} width={190} height={30} rx={4}
                fill="#ef444412" stroke="#ef4444" strokeWidth={1.5} />
              <text x={335} y={47} textAnchor="middle" fontSize={10} fill="#ef4444">
                L_bad = −σ(−β·z) → 확률 ↓↓
              </text>
              <text x={230} y={80} textAnchor="middle" fontSize={10} fontWeight={600} fill="#8b5cf6">
                나쁜 응답 억제가 더 강함 (손실 회피 반영)
              </text>
              <text x={230} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                쌍 데이터 없이 단일 응답의 좋음/나쁨 이진 피드백
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                { label: '쌍 데이터 불필요', desc: '기존 평점/좋아요 활용', color: '#10b981' },
                { label: '손실 회피 비대칭', desc: '유해 응답 억제에 효과적', color: '#f59e0b' },
                { label: 'DPO와 동등 성능', desc: '데이터 효율 더 높음', color: '#6366f1' },
              ].map((item, i) => (
                <g key={item.label}>
                  <rect x={30 + i * 140} y={20} width={130} height={50} rx={5}
                    fill={`${item.color}12`} stroke={item.color} strokeWidth={1} />
                  <text x={95 + i * 140} y={40} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={item.color}>{item.label}</text>
                  <text x={95 + i * 140} y={56} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">{item.desc}</text>
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
