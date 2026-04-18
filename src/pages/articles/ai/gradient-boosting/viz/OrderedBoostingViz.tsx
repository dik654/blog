import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS: StepDef[] = [
  {
    label: 'Target Leakage 문제 — 왜 Ordered Boosting이 필요한가',
    body: '일반 GBM: 모든 샘플의 잔차를 동일 모델로 계산 → 학습 데이터 정보 누출\n예측 대상 샘플의 정보가 잔차 계산에 포함 → 과적합\nCatBoost: 각 샘플의 잔차를 "그 샘플을 제외한" 모델로 계산',
  },
  {
    label: 'Ordered Boosting 과정 — 순서 기반 잔차 계산',
    body: '데이터를 랜덤 순열 σ로 정렬\n샘플 σ(i)의 잔차 = σ(1)~σ(i-1)로 학습한 모델의 예측 오차\n각 샘플이 "미래의 자기 자신"을 보지 못함 — target leakage 원천 차단',
  },
  {
    label: 'Symmetric Tree — 균형 트리 강제',
    body: 'CatBoost 기본: Oblivious Decision Tree (대칭 결정 트리)\n같은 깊이의 모든 노드가 동일한 분할 조건 사용\n깊이 d → 리프 2^d개, 분할 조건 d개만\nGPU 연산에 유리 + 정규화 효과 내장 — SIMD로 병렬 예측',
  },
  {
    label: 'Ordered Target Statistics — 범주형 인코딩',
    body: '범주형 피처를 수치로 변환할 때도 순서 기반 통계 사용\nTS(xᵢ) = (Σⱼ<ᵢ[xⱼ=xᵢ]·yⱼ + a·p) / (Σⱼ<ᵢ[xⱼ=xᵢ] + a)\na = 사전 가중치, p = 전체 평균 — Laplace smoothing 효과\n"이전 샘플까지만" 참조 → 또 다시 target leakage 방지',
  },
  {
    label: 'GPU 학습 & 실전 장점',
    body: 'Symmetric Tree의 규칙적 구조 → GPU SIMD 병렬 최적화\n결측값: 자동으로 최적 방향 결정 (XGBoost와 유사)\n범주형 피처가 많은 데이터셋에서 최고 성능\n기본 하이퍼파라미터가 이미 좋음 — 튜닝 비용 최소',
  },
];

export default function OrderedBoostingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 260" className="w-full h-auto">
          {step === 0 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Target Leakage 문제</text>

              {/* 일반 GBM */}
              <motion.g initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={20} y={40} width={220} height={120} rx={10}
                  fill="#ef4444" fillOpacity={0.05} stroke="#ef4444" strokeWidth={1.2} />
                <text x={130} y={62} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill="#ef4444">일반 GBM</text>
                {/* 샘플 */}
                {['x₁', 'x₂', 'x₃', 'x₄'].map((s, i) => (
                  <g key={s}>
                    <rect x={35 + i * 50} y={74} width={40} height={22} rx={5}
                      fill="#ef4444" fillOpacity={0.12} stroke="#ef4444" strokeWidth={0.8} />
                    <text x={55 + i * 50} y={89} textAnchor="middle" fontSize={9}
                      fill="#ef4444">{s}</text>
                  </g>
                ))}
                <text x={130} y={116} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">동일 모델로 전체 잔차 계산</text>
                <text x={130} y={132} textAnchor="middle" fontSize={8}
                  fill="#ef4444">x₃의 잔차에 x₃ 자신 정보 포함!</text>
                <text x={130} y={148} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="#ef4444">→ Target Leakage</text>
              </motion.g>

              {/* CatBoost */}
              <motion.g initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <rect x={270} y={40} width={230} height={120} rx={10}
                  fill="#10b981" fillOpacity={0.05} stroke="#10b981" strokeWidth={1.5} />
                <text x={385} y={62} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill="#10b981">CatBoost (Ordered)</text>
                {['x₁', 'x₂', 'x₃', 'x₄'].map((s, i) => (
                  <g key={s}>
                    <rect x={285 + i * 52} y={74} width={42} height={22} rx={5}
                      fill="#10b981" fillOpacity={0.12} stroke="#10b981" strokeWidth={0.8} />
                    <text x={306 + i * 52} y={89} textAnchor="middle" fontSize={9}
                      fill="#10b981">{s}</text>
                  </g>
                ))}
                <text x={385} y={116} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">x₃ 잔차: x₁,x₂만으로 학습한 모델</text>
                <text x={385} y={132} textAnchor="middle" fontSize={8}
                  fill="#10b981">각 샘플이 "이전"만 참조</text>
                <text x={385} y={148} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="#10b981">→ Leakage 원천 차단</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={80} y={180} width={360} height={35} rx={6}
                  fill="#f59e0b" fillOpacity={0.06} stroke="#f59e0b" strokeWidth={0.8} />
                <text x={260} y={202} textAnchor="middle" fontSize={9} fill="#f59e0b">
                  데이터셋이 작을수록 leakage 영향 큼 → CatBoost의 장점 극대화
                </text>
              </motion.g>
            </g>
          )}

          {step === 1 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Ordered Boosting: 순열 기반 잔차</text>

              {/* 순열 σ */}
              <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
                <text x={260} y={48} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">랜덤 순열 σ: [x₃, x₁, x₄, x₂]</text>
              </motion.g>

              {/* 각 샘플별 모델 */}
              {[
                { sample: 'x₃', model: '(없음)', used: '초기 평균', color: '#94a3b8' },
                { sample: 'x₁', model: 'M₁', used: 'x₃만으로 학습', color: '#3b82f6' },
                { sample: 'x₄', model: 'M₂', used: 'x₃,x₁로 학습', color: '#10b981' },
                { sample: 'x₂', model: 'M₃', used: 'x₃,x₁,x₄로 학습', color: '#8b5cf6' },
              ].map((s, i) => {
                const y = 62 + i * 46;
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: i * 0.12 }}>
                    {/* 순서 번호 */}
                    <circle cx={40} cy={y + 18} r={12} fill={s.color} fillOpacity={0.15}
                      stroke={s.color} strokeWidth={1} />
                    <text x={40} y={y + 22} textAnchor="middle" fontSize={10}
                      fontWeight={700} fill={s.color}>{i + 1}</text>
                    {/* 샘플 */}
                    <rect x={65} y={y + 4} width={55} height={28} rx={14}
                      fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={1} />
                    <text x={92} y={y + 22} textAnchor="middle" fontSize={10}
                      fontWeight={700} fill={s.color}>{s.sample}</text>
                    {/* 화살표 */}
                    <text x={138} y={y + 22} fontSize={10} fill="var(--muted-foreground)">→</text>
                    {/* 모델 */}
                    <rect x={155} y={y + 4} width={55} height={28} rx={6}
                      fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.5} />
                    <text x={182} y={y + 22} textAnchor="middle" fontSize={9}
                      fill="var(--foreground)">{s.model}</text>
                    {/* 설명 */}
                    <text x={230} y={y + 22} fontSize={9} fill="var(--muted-foreground)">
                      {s.used}
                    </text>
                  </motion.g>
                );
              })}

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={60} y={240} width={400} height={20} rx={4}
                  fill="var(--muted)" fillOpacity={0.15} />
                <text x={260} y={254} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  각 모델은 해당 샘플 "이전의" 데이터만 사용 — Leave-one-out 근사
                </text>
              </motion.g>
            </g>
          )}

          {step === 2 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Symmetric (Oblivious) Decision Tree</text>

              {/* 일반 트리 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <text x={130} y={48} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#94a3b8">일반 트리</text>
                <rect x={105} y={55} width={50} height={20} rx={5}
                  fill="#94a3b8" fillOpacity={0.1} stroke="#94a3b8" strokeWidth={0.8} />
                <text x={130} y={69} textAnchor="middle" fontSize={8} fill="#94a3b8">x₁ &lt; 3</text>
                <line x1={120} y1={75} x2={85} y2={90} stroke="#94a3b8" strokeWidth={0.8} />
                <line x1={140} y1={75} x2={175} y2={90} stroke="#94a3b8" strokeWidth={0.8} />
                <rect x={60} y={90} width={50} height={20} rx={5}
                  fill="#94a3b8" fillOpacity={0.1} stroke="#94a3b8" strokeWidth={0.8} />
                <text x={85} y={104} textAnchor="middle" fontSize={8} fill="#94a3b8">x₂ &lt; 5</text>
                <rect x={150} y={90} width={50} height={20} rx={5}
                  fill="#94a3b8" fillOpacity={0.1} stroke="#94a3b8" strokeWidth={0.8} />
                <text x={175} y={104} textAnchor="middle" fontSize={8} fill="#94a3b8">x₃ &lt; 7</text>
                <text x={130} y={134} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  각 노드 다른 조건 → 불규칙
                </text>
              </motion.g>

              {/* Oblivious Tree */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <text x={390} y={48} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#10b981">Oblivious Tree (CatBoost)</text>
                <rect x={365} y={55} width={50} height={20} rx={5}
                  fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.2} />
                <text x={390} y={69} textAnchor="middle" fontSize={8} fontWeight={700}
                  fill="#10b981">x₁ &lt; 3</text>
                <line x1={380} y1={75} x2={340} y2={90} stroke="#10b981" strokeWidth={0.8} />
                <line x1={400} y1={75} x2={440} y2={90} stroke="#10b981" strokeWidth={0.8} />
                {/* 같은 조건으로 분할 */}
                <rect x={315} y={90} width={50} height={20} rx={5}
                  fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.2} />
                <text x={340} y={104} textAnchor="middle" fontSize={8} fontWeight={700}
                  fill="#10b981">x₂ &lt; 5</text>
                <rect x={415} y={90} width={50} height={20} rx={5}
                  fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.2} />
                <text x={440} y={104} textAnchor="middle" fontSize={8} fontWeight={700}
                  fill="#10b981">x₂ &lt; 5</text>
                <text x={390} y={134} textAnchor="middle" fontSize={8}
                  fill="#10b981">같은 깊이 = 같은 조건!</text>
              </motion.g>

              {/* 장점 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                {[
                  { icon: '⚡', text: 'GPU SIMD 최적화', desc: '규칙적 구조 → 벡터 연산', color: '#3b82f6' },
                  { icon: '🛡️', text: '정규화 효과', desc: '적은 분할 조건 → 과적합 감소', color: '#10b981' },
                  { icon: '🔮', text: '빠른 예측', desc: '비트 연산으로 리프 결정', color: '#8b5cf6' },
                ].map((a, i) => (
                  <g key={i}>
                    <rect x={30 + i * 165} y={155} width={150} height={52} rx={8}
                      fill={a.color} fillOpacity={0.06} stroke={a.color} strokeWidth={1} />
                    <text x={105 + i * 165} y={175} textAnchor="middle" fontSize={10}
                      fontWeight={700} fill={a.color}>{a.icon} {a.text}</text>
                    <text x={105 + i * 165} y={195} textAnchor="middle" fontSize={8}
                      fill="var(--muted-foreground)">{a.desc}</text>
                  </g>
                ))}
              </motion.g>
            </g>
          )}

          {step === 3 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Ordered Target Statistics</text>

              {/* 수식 */}
              <motion.g initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
                <rect x={60} y={38} width={400} height={45} rx={8}
                  fill="#8b5cf6" fillOpacity={0.06} stroke="#8b5cf6" strokeWidth={1.2} />
                <text x={260} y={58} textAnchor="middle" fontSize={10} fontWeight={600}
                  fontFamily="monospace" fill="var(--foreground)">
                  TS(xᵢ) = (Σⱼ&lt;ᵢ[xⱼ=xᵢ]·yⱼ + a·p) / (Σⱼ&lt;ᵢ[xⱼ=xᵢ] + a)
                </text>
                <text x={260} y={74} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  a = 사전 가중치(smoothing) | p = 전체 타겟 평균 (prior)
                </text>
              </motion.g>

              {/* 순서 예시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <text x={260} y={108} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">예시: 범주 "A"의 TS 계산 (a=1, p=0.5)</text>
              </motion.g>

              {[
                { i: 1, cat: 'A', y: 1, seen: 0, sum: 0, ts: '0.50', note: '이전 A 없음 → prior만' },
                { i: 2, cat: 'B', y: 0, seen: '-', sum: '-', ts: '-', note: '다른 범주 (skip)' },
                { i: 3, cat: 'A', y: 0, seen: 1, sum: 1, ts: '0.75', note: '이전 A: y=1 하나' },
                { i: 4, cat: 'A', y: 1, seen: 2, sum: 1, ts: '0.50', note: '이전 A: y=1,0 → 합=1' },
              ].map((row, ri) => (
                <motion.g key={ri}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.3 + ri * 0.1 }}>
                  <rect x={30} y={118 + ri * 30} width={460} height={26} rx={4}
                    fill={row.cat === 'A' ? '#8b5cf6' : '#94a3b8'}
                    fillOpacity={0.04}
                    stroke={row.cat === 'A' ? '#8b5cf6' : 'var(--border)'}
                    strokeWidth={row.cat === 'A' ? 0.8 : 0.3} />
                  <text x={50} y={135 + ri * 30} fontSize={9} fontWeight={600}
                    fill="var(--foreground)">σ({row.i})</text>
                  <text x={95} y={135 + ri * 30} fontSize={9} fill="var(--foreground)">
                    cat={row.cat}
                  </text>
                  <text x={155} y={135 + ri * 30} fontSize={9} fill="var(--foreground)">
                    y={row.y}
                  </text>
                  <text x={220} y={135 + ri * 30} fontSize={9}
                    fill={row.ts === '-' ? 'var(--muted-foreground)' : '#8b5cf6'}
                    fontWeight={row.ts !== '-' ? 700 : 400}>
                    TS={row.ts}
                  </text>
                  <text x={310} y={135 + ri * 30} fontSize={8}
                    fill="var(--muted-foreground)">{row.note}</text>
                </motion.g>
              ))}

              <motion.text x={260} y={252} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                핵심: j &lt; i 조건 → 미래 정보 차단 → target leakage 방지
              </motion.text>
            </g>
          )}

          {step === 4 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">CatBoost 실전 장점</text>

              {[
                { title: 'GPU 최적화', desc: 'Symmetric Tree\n→ SIMD 벡터 연산', stat: '2~5x 속도', color: '#3b82f6' },
                { title: '결측값 처리', desc: '자동 최적 방향\n결정 (별도 설정 불필요)', stat: '자동', color: '#10b981' },
                { title: '범주형 직접', desc: 'Ordered TS\nTarget Leakage 없음', stat: '최고 성능', color: '#8b5cf6' },
                { title: '기본 설정', desc: '하이퍼파라미터\n튜닝 최소', stat: 'out-of-box', color: '#f59e0b' },
              ].map((item, i) => {
                const col = i % 2;
                const row = Math.floor(i / 2);
                const x = 30 + col * 245;
                const y = 45 + row * 100;
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...sp, delay: i * 0.1 }}>
                    <rect x={x} y={y} width={225} height={85} rx={10}
                      fill={item.color} fillOpacity={0.06} stroke={item.color} strokeWidth={1.2} />
                    <text x={x + 112} y={y + 22} textAnchor="middle" fontSize={12}
                      fontWeight={700} fill={item.color}>{item.title}</text>
                    <line x1={x + 15} y1={y + 30} x2={x + 210} y2={y + 30}
                      stroke={item.color} strokeOpacity={0.2} strokeWidth={0.6} />
                    {item.desc.split('\n').map((line, li) => (
                      <text key={li} x={x + 15} y={y + 46 + li * 14} fontSize={9}
                        fill="var(--foreground)">{line}</text>
                    ))}
                    <rect x={x + 140} y={y + 54} width={70} height={20} rx={10}
                      fill={item.color} fillOpacity={0.15} stroke={item.color} strokeWidth={0.6} />
                    <text x={x + 175} y={y + 68} textAnchor="middle" fontSize={8}
                      fontWeight={700} fill={item.color}>{item.stat}</text>
                  </motion.g>
                );
              })}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
