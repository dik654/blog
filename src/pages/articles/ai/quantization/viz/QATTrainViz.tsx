import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const STEPS = [
  {
    label: '1. QAT의 핵심: 학습 중에 양자화를 시뮬레이션',
    body: 'Forward: FP32 가중치 → fake quantize → INT8 근사값으로 추론\nBackward: STE(Straight-Through Estimator)로 gradient를 FP32 가중치에 그대로 전달\n→ 모델이 "양자화된 상태"에서 좋은 출력을 내도록 스스로 적응\nPTQ와의 차이: PTQ는 학습 후 변환, QAT는 학습 중 변환을 시뮬레이션',
  },
  {
    label: '2. Fake Quantization 노드',
    body: 'forward: x_q = dequant(quant(x)) = round(x/s)*s\n실제로 INT8로 변환하지 않고, FP32 연산에서 "양자화했다 복원한 값"을 사용\n→ 양자화 오차가 손실 함수에 반영됨\n→ 역전파로 이 오차를 줄이는 방향으로 가중치 업데이트',
  },
  {
    label: '3. STE(Straight-Through Estimator)',
    body: 'round() 함수의 gradient = 0 (계단 함수) → 역전파 불가능\nSTE 해법: forward는 round() 적용, backward는 round()를 건너뛰고 gradient 직접 전달\n수식: ∂L/∂x ≈ ∂L/∂x_q (clamp 범위 내에서 gradient = 1)\n→ 수학적으로 정확하지 않지만, 실전에서 잘 작동하는 경험적 해법',
  },
  {
    label: '4. QAT의 트레이드오프',
    body: '정확도: PTQ 대비 INT8에서 0.5~1% 향상, INT4에서 2~5% 향상\n비용: 전체 학습의 10~20% 추가 fine-tuning 필요 (보통 수 에폭)\nLLM에서: 7B 모델 QAT = GPU 8장 × 수시간 → 비용 부담\n→ LLM에서는 PTQ + GPTQ/AWQ가 더 실용적, QAT는 소형 모델·엣지 디바이스에 적합',
  },
];

export default function QATTrainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                QAT 학습 루프
              </text>

              {/* Forward path */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <ModuleBox x={15} y={25} w={80} h={40} label="FP32 가중치" sub="원본" color="#3b82f6" />
                <text x={102} y={48} fontSize={10} fill="var(--muted-foreground)">→</text>
                <ActionBox x={112} y={26} w={90} h={38} label="Fake Quant" sub="round(x/s)*s" color="#f59e0b" />
                <text x={209} y={48} fontSize={10} fill="var(--muted-foreground)">→</text>
                <DataBox x={218} y={30} w={80} h={30} label="INT8 근사" color="#10b981" />
                <text x={305} y={48} fontSize={10} fill="var(--muted-foreground)">→</text>
                <ModuleBox x={315} y={25} w={70} h={40} label="Forward" sub="추론" color="#6366f1" />
                <text x={392} y={48} fontSize={10} fill="var(--muted-foreground)">→</text>
                <DataBox x={402} y={30} w={60} h={30} label="Loss" color="#ef4444" />
              </motion.g>

              {/* Forward label */}
              <text x={240} y={22} textAnchor="middle" fontSize={8} fill="#10b981">Forward →</text>

              {/* Backward path */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <line x1={430} y1={70} x2={430} y2={90} stroke="#ef4444" strokeWidth={1} markerEnd="url(#arrowDown)" />
                <text x={240} y={100} textAnchor="middle" fontSize={8} fill="#ef4444">← Backward (STE)</text>
                <rect x={60} y={105} width={360} height={30} rx={6} fill="#ef444410" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3" />
                <text x={240} y={124} textAnchor="middle" fontSize={9} fill="#ef4444">
                  gradient가 round()를 건너뛰고 FP32 가중치에 직접 전달
                </text>
                <line x1={50} y1={120} x2={50} y2={60} stroke="#ef4444" strokeWidth={1} markerEnd="url(#arrowUp)" />
              </motion.g>

              {/* 핵심 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
                <rect x={80} y={150} width={320} height={24} rx={5} fill="#6366f115" stroke="#6366f1" strokeWidth={1.2} />
                <text x={240} y={166} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">
                  핵심: 모델이 "양자화 오차가 있는 상태"에서 좋은 출력을 내도록 적응
                </text>
              </motion.g>

              <defs>
                <marker id="arrowDown" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6" fill="#ef4444" />
                </marker>
                <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M6,0 L0,3 L6,6" fill="#ef4444" />
                </marker>
              </defs>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                Fake Quantization 동작 원리
              </text>

              {/* 입력값 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <text x={20} y={40} fontSize={9} fill="var(--foreground)" fontWeight={600}>FP32 입력</text>
                {[0.37, -0.82, 0.15, 1.24, -0.51].map((v, i) => (
                  <g key={i}>
                    <rect x={20 + i * 50} y={45} width={45} height={20} rx={3} fill="#3b82f615" stroke="#3b82f6" strokeWidth={0.6} />
                    <text x={42 + i * 50} y={59} textAnchor="middle" fontSize={8} fill="#3b82f6" fontFamily="monospace">{v.toFixed(2)}</text>
                  </g>
                ))}
              </motion.g>

              {/* 화살표 + quant */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
                <text x={310} y={40} fontSize={9} fill="#f59e0b" fontWeight={600}>① quant: round(x/s)</text>
                <text x={150} y={82} fontSize={10} fill="var(--muted-foreground)">↓ scale = 0.01 기준</text>
              </motion.g>

              {/* 양자화 값 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <text x={20} y={102} fontSize={9} fill="var(--foreground)" fontWeight={600}>INT8 정수</text>
                {[37, -82, 15, 124, -51].map((v, i) => (
                  <g key={i}>
                    <rect x={20 + i * 50} y={107} width={45} height={20} rx={3} fill="#10b98115" stroke="#10b981" strokeWidth={0.6} />
                    <text x={42 + i * 50} y={121} textAnchor="middle" fontSize={8} fill="#10b981" fontFamily="monospace">{v}</text>
                  </g>
                ))}
              </motion.g>

              {/* dequant */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <text x={310} y={102} fontSize={9} fill="#f59e0b" fontWeight={600}>② dequant: q×s</text>
                <text x={150} y={143} fontSize={10} fill="var(--muted-foreground)">↓ 다시 FP32로 복원</text>
              </motion.g>

              {/* 복원값 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.5 }}>
                <text x={20} y={160} fontSize={9} fill="var(--foreground)" fontWeight={600}>복원 FP32</text>
                {[0.37, -0.82, 0.15, 1.24, -0.51].map((v, i) => (
                  <g key={i}>
                    <rect x={20 + i * 50} y={165} width={45} height={20} rx={3} fill="#ef444415" stroke="#ef4444" strokeWidth={0.6} />
                    <text x={42 + i * 50} y={179} textAnchor="middle" fontSize={8} fill="#ef4444" fontFamily="monospace">{v.toFixed(2)}</text>
                  </g>
                ))}
                <text x={310} y={179} fontSize={8} fill="#ef4444">오차가 Loss에 반영</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                STE: round()의 gradient 문제 해결
              </text>

              {/* round 계단 함수 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={15} y={25} width={200} height={85} rx={6} fill="#ef444408" stroke="#ef4444" strokeWidth={0.8} />
                <text x={115} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">round() 함수</text>
                {/* 계단 형태 */}
                <line x1={40} y1={55} x2={80} y2={55} stroke="#ef4444" strokeWidth={1.5} />
                <line x1={80} y1={55} x2={80} y2={70} stroke="#ef4444" strokeWidth={0.5} strokeDasharray="2 2" />
                <line x1={80} y1={70} x2={120} y2={70} stroke="#ef4444" strokeWidth={1.5} />
                <line x1={120} y1={70} x2={120} y2={85} stroke="#ef4444" strokeWidth={0.5} strokeDasharray="2 2" />
                <line x1={120} y1={85} x2={160} y2={85} stroke="#ef4444" strokeWidth={1.5} />
                <line x1={160} y1={85} x2={160} y2={100} stroke="#ef4444" strokeWidth={0.5} strokeDasharray="2 2" />
                <line x1={160} y1={100} x2={200} y2={100} stroke="#ef4444" strokeWidth={1.5} />
                <text x={115} y={105} textAnchor="middle" fontSize={8} fill="#ef4444">gradient = 0 (평탄!)</text>
              </motion.g>

              {/* STE 직선 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={245} y={25} width={220} height={85} rx={6} fill="#10b98108" stroke="#10b981" strokeWidth={0.8} />
                <text x={355} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">STE 근사</text>
                {/* clamp 범위 표시 */}
                <rect x={280} y={52} width={130} height={50} rx={3} fill="#10b98108" stroke="#10b981" strokeWidth={0.5} strokeDasharray="3 2" />
                <line x1={280} y1={95} x2={410} y2={55} stroke="#10b981" strokeWidth={1.5} />
                {/* clamp 외부 */}
                <line x1={260} y1={95} x2={280} y2={95} stroke="#10b98160" strokeWidth={1.5} />
                <line x1={410} y1={55} x2={440} y2={55} stroke="#10b98160" strokeWidth={1.5} />
                <text x={355} y={105} textAnchor="middle" fontSize={8} fill="#10b981">gradient = 1 (범위 내)</text>
              </motion.g>

              {/* 수식 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.35 }}>
                <rect x={50} y={125} width={380} height={30} rx={6} fill="#6366f115" stroke="#6366f1" strokeWidth={1.2} />
                <text x={240} y={139} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#6366f1">
                  Forward: y = round(x)    Backward: ∂y/∂x ≈ 1 (if min ≤ x ≤ max)
                </text>
                <text x={240} y={151} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  수학적으로 부정확하지만, 실전에서 잘 작동하는 경험적 해법 (Bengio, 2013)
                </text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
                <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  clamp 범위 밖 = gradient 차단 → outlier 가중치의 과도한 업데이트 방지
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                QAT vs PTQ 트레이드오프
              </text>

              {/* 비교 표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
                {/* 헤더 */}
                <rect x={20} y={28} width={130} height={22} rx={3} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={85} y={43} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">항목</text>
                <rect x={155} y={28} width={150} height={22} rx={3} fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.5} />
                <text x={230} y={43} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">PTQ</text>
                <rect x={310} y={28} width={150} height={22} rx={3} fill="#10b98110" stroke="#10b981" strokeWidth={0.5} />
                <text x={385} y={43} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">QAT</text>
              </motion.g>

              {[
                { item: 'INT8 정확도 차이', ptq: '0.5~1% ↓', qat: '0.1~0.3% ↓', pColor: '#f59e0b', qColor: '#10b981' },
                { item: 'INT4 정확도 차이', ptq: '5~15% ↓', qat: '1~3% ↓', pColor: '#ef4444', qColor: '#10b981' },
                { item: '필요 시간', ptq: '분 단위', qat: '시간~일', pColor: '#10b981', qColor: '#f59e0b' },
                { item: 'GPU 비용', ptq: '1장 충분', qat: '4~8장 필요', pColor: '#10b981', qColor: '#ef4444' },
                { item: 'LLM 적합도', ptq: 'GPTQ/AWQ', qat: '비용 과다', pColor: '#10b981', qColor: '#ef4444' },
              ].map((row, i) => (
                <motion.g key={row.item} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.15 + i * 0.08 }}>
                  <rect x={20} y={54 + i * 24} width={130} height={22} rx={3} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
                  <text x={85} y={69 + i * 24} textAnchor="middle" fontSize={8} fill="var(--foreground)">{row.item}</text>
                  <rect x={155} y={54 + i * 24} width={150} height={22} rx={3} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
                  <text x={230} y={69 + i * 24} textAnchor="middle" fontSize={8} fill={row.pColor}>{row.ptq}</text>
                  <rect x={310} y={54 + i * 24} width={150} height={22} rx={3} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
                  <text x={385} y={69 + i * 24} textAnchor="middle" fontSize={8} fill={row.qColor}>{row.qat}</text>
                </motion.g>
              ))}

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                <rect x={50} y={178} width={380} height={18} rx={4} fill="#6366f110" />
                <text x={240} y={190} textAnchor="middle" fontSize={8} fill="#6366f1">
                  결론: LLM은 PTQ(GPTQ/AWQ), 소형 모델·엣지는 QAT가 표준
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
