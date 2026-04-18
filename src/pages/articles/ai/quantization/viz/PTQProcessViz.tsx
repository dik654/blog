import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  {
    label: '1. 동적 양자화 vs 정적 양자화',
    body: '동적(Dynamic): 추론 시 매 배치마다 scale/zp를 실시간 계산 → 구현 간단, 약간 느림\n정적(Static): calibration 데이터로 미리 scale/zp 고정 → 추론 빠름, 사전 작업 필요\n→ 동적은 NLP(배치 작음), 정적은 CV(배치 큼)에 유리',
  },
  {
    label: '2. Calibration: 최적 scale/zero_point 결정',
    body: 'calibration 데이터(100~1000개 샘플)를 모델에 통과시켜 각 레이어의 활성값 분포 수집\nMinMax: 단순히 최솟값/최댓값 사용 → outlier에 취약\nHistogram(Percentile): 상위/하위 0.1% 제거 → outlier 강건\nEntropy(KL-divergence): 원본 분포와 양자화 분포의 KL을 최소화하는 범위 탐색',
  },
  {
    label: '3. Per-tensor vs Per-channel 양자화',
    body: 'Per-tensor: 텐서 전체에 하나의 scale/zp → 빠르지만 채널 간 범위 차이 시 부정확\nPer-channel: 출력 채널마다 독립 scale/zp → 정확도 우수, 약간 복잡\n대부분의 PTQ는 가중치=per-channel, 활성값=per-tensor 조합 사용\n→ 가중치는 고정이라 per-channel 비용 없음, 활성값은 동적이라 per-tensor가 실용적',
  },
  {
    label: '4. PTQ 정확도가 유지되는 이유',
    body: '신경망 가중치는 과잉 파라미터(over-parameterized) → 약간의 노이즈에 둔감\nINT8(256단계)은 가중치 분포의 99%를 충분히 커버\n양자화 오차는 랜덤 노이즈처럼 작용 → 여러 레이어를 지나며 평균화\n단, INT4 이하에서는 정보 손실이 급격히 증가 → GPTQ/AWQ 같은 보정 필요',
  },
];

export default function PTQProcessViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 동적 양자화 흐름 */}
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                두 가지 PTQ 방식
              </text>

              {/* Dynamic */}
              <rect x={20} y={30} width={210} height={75} rx={8} fill="#3b82f608" stroke="#3b82f6" strokeWidth={1} />
              <text x={125} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">동적 양자화</text>
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={30} y={56} width={55} height={22} rx={4} fill="#3b82f618" stroke="#3b82f6" strokeWidth={0.8} />
                <text x={57} y={71} textAnchor="middle" fontSize={8} fill="#3b82f6">입력 배치</text>
                <text x={92} y={71} fontSize={10} fill="var(--muted-foreground)">→</text>
                <rect x={100} y={56} width={55} height={22} rx={4} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.8} />
                <text x={127} y={71} textAnchor="middle" fontSize={8} fill="#f59e0b">scale 계산</text>
                <text x={162} y={71} fontSize={10} fill="var(--muted-foreground)">→</text>
                <rect x={170} y={56} width={50} height={22} rx={4} fill="#10b98118" stroke="#10b981" strokeWidth={0.8} />
                <text x={195} y={71} textAnchor="middle" fontSize={8} fill="#10b981">양자화</text>
              </motion.g>
              <text x={125} y={95} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">매 배치마다 실시간 | NLP에 적합</text>

              {/* Static */}
              <rect x={250} y={30} width={210} height={75} rx={8} fill="#10b98108" stroke="#10b981" strokeWidth={1} />
              <text x={355} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">정적 양자화</text>
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={260} y={56} width={55} height={22} rx={4} fill="#6366f118" stroke="#6366f1" strokeWidth={0.8} />
                <text x={287} y={71} textAnchor="middle" fontSize={8} fill="#6366f1">calibration</text>
                <text x={322} y={71} fontSize={10} fill="var(--muted-foreground)">→</text>
                <rect x={330} y={56} width={55} height={22} rx={4} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.8} />
                <text x={357} y={71} textAnchor="middle" fontSize={8} fill="#f59e0b">scale 고정</text>
                <text x={392} y={71} fontSize={10} fill="var(--muted-foreground)">→</text>
                <rect x={400} y={56} width={50} height={22} rx={4} fill="#10b98118" stroke="#10b981" strokeWidth={0.8} />
                <text x={425} y={71} textAnchor="middle" fontSize={8} fill="#10b981">양자화</text>
              </motion.g>
              <text x={355} y={95} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">사전 계산 고정 | CV에 적합</text>

              {/* 비교 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
                <rect x={60} y={120} width={170} height={22} rx={4} fill="#3b82f610" />
                <text x={145} y={135} textAnchor="middle" fontSize={9} fill="#3b82f6">구현 간단, scale 계산 오버헤드</text>
                <rect x={260} y={120} width={170} height={22} rx={4} fill="#10b98110" />
                <text x={345} y={135} textAnchor="middle" fontSize={9} fill="#10b981">추론 빠름, calibration 필요</text>
              </motion.g>

              <text x={240} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                LLM 서빙에서는 정적 양자화가 표준 — 한번 calibration 후 반복 사용
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                Calibration 방법 3가지
              </text>

              {/* MinMax */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={15} y={28} width={145} height={68} rx={6} fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
                <text x={87} y={45} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">MinMax</text>
                <text x={87} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">min/max 그대로 사용</text>
                <text x={87} y={75} textAnchor="middle" fontSize={8} fill="#ef4444">outlier에 취약</text>
                <rect x={30} y={80} width={30} height={8} rx={2} fill="#ef444440" />
                <rect x={62} y={80} width={80} height={8} rx={2} fill="#ef444418" />
                <circle cx={140} cy={84} r={3} fill="#ef4444" />
              </motion.g>

              {/* Percentile */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={170} y={28} width={145} height={68} rx={6} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} />
                <text x={242} y={45} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">Percentile</text>
                <text x={242} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">상하위 0.1% 제거</text>
                <text x={242} y={75} textAnchor="middle" fontSize={8} fill="#f59e0b">outlier 강건</text>
                <rect x={185} y={80} width={100} height={8} rx={2} fill="#f59e0b30" />
                <line x1={185} y1={78} x2={185} y2={92} stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="2 2" />
                <line x1={285} y1={78} x2={285} y2={92} stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="2 2" />
              </motion.g>

              {/* Entropy */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <rect x={325} y={28} width={145} height={68} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={1} />
                <text x={397} y={45} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">Entropy (KL)</text>
                <text x={397} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">KL 발산 최소화</text>
                <text x={397} y={75} textAnchor="middle" fontSize={8} fill="#10b981">최적 범위 탐색</text>
                <path d="M340,84 Q360,82 380,78 Q395,70 397,68 Q399,70 415,78 Q435,82 455,84" fill="none" stroke="#10b981" strokeWidth={1} />
                <path d="M350,84 Q370,83 385,80 Q395,76 397,75 Q399,76 410,80 Q425,83 445,84" fill="none" stroke="#10b98160" strokeWidth={1} strokeDasharray="3 2" />
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <text x={240} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  calibration 데이터: 100~1000개 샘플이면 충분 (전체 학습 데이터 불필요)
                </text>
                <rect x={80} y={130} width={320} height={24} rx={5} fill="#6366f112" stroke="#6366f1" strokeWidth={1} />
                <text x={240} y={146} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">
                  TensorRT / ONNX Runtime: Entropy 방식이 기본값
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                Per-tensor vs Per-channel
              </text>

              {/* Per-tensor */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={20} y={28} width={200} height={80} rx={6} fill="#ef444408" stroke="#ef4444" strokeWidth={1} />
                <text x={120} y={45} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">Per-tensor</text>
                {/* 행렬 시각화 */}
                {[0, 1, 2].map(r => (
                  <g key={r}>
                    {[0, 1, 2, 3].map(c => (
                      <rect key={c} x={40 + c * 40} y={52 + r * 16} width={36} height={13} rx={2}
                        fill="#ef444418" stroke="#ef4444" strokeWidth={0.5} />
                    ))}
                  </g>
                ))}
                <text x={120} y={106} textAnchor="middle" fontSize={8} fill="#ef4444">scale 1개 → 전체 공유</text>
              </motion.g>

              {/* Per-channel */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={250} y={28} width={210} height={80} rx={6} fill="#10b98108" stroke="#10b981" strokeWidth={1} />
                <text x={355} y={45} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">Per-channel</text>
                {[
                  { color: '#3b82f6', y: 52 },
                  { color: '#10b981', y: 68 },
                  { color: '#f59e0b', y: 84 },
                ].map((row, r) => (
                  <g key={r}>
                    {[0, 1, 2, 3].map(c => (
                      <rect key={c} x={270 + c * 40} y={row.y} width={36} height={13} rx={2}
                        fill={`${row.color}18`} stroke={row.color} strokeWidth={0.5} />
                    ))}
                    <text x={440} y={row.y + 10} fontSize={7} fill={row.color}>s{r + 1}</text>
                  </g>
                ))}
                <text x={355} y={106} textAnchor="middle" fontSize={8} fill="#10b981">채널마다 독립 scale</text>
              </motion.g>

              {/* 실무 조합 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
                <rect x={60} y={125} width={360} height={28} rx={6} fill="#6366f112" stroke="#6366f1" strokeWidth={1} />
                <text x={240} y={138} textAnchor="middle" fontSize={9} fill="#6366f1">
                  실무 표준: 가중치 = per-channel (고정) / 활성값 = per-tensor (동적)
                </text>
                <text x={240} y={150} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  가중치는 한번 계산이면 끝, 활성값은 매번 바뀌니 per-tensor가 실용적
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                PTQ가 작동하는 이유 4가지
              </text>

              {[
                { title: '과잉 파라미터', desc: '7B 모델: 70억 개 파라미터 — 약간의 노이즈에 둔감', color: '#3b82f6', y: 30 },
                { title: 'INT8 커버리지', desc: '256단계로 가중치 분포의 99%를 표현', color: '#10b981', y: 72 },
                { title: '오차 평균화', desc: '양자화 노이즈가 여러 레이어를 지나며 상쇄', color: '#f59e0b', y: 114 },
                { title: 'INT4의 한계', desc: '16단계는 부족 → GPTQ/AWQ 보정 필수', color: '#ef4444', y: 156 },
              ].map((item, i) => (
                <motion.g key={item.title} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <rect x={30} y={item.y} width={420} height={32} rx={6}
                    fill={`${item.color}10`} stroke={item.color} strokeWidth={0.8} />
                  <rect x={30} y={item.y} width={4} height={32} rx={2} fill={item.color} />
                  <text x={45} y={item.y + 20} fontSize={10} fontWeight={700} fill={item.color}>{item.title}</text>
                  <text x={160} y={item.y + 20} fontSize={9} fill="var(--muted-foreground)">{item.desc}</text>
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
