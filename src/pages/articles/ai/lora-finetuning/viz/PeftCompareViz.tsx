import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const d = 0.08;

const STEPS = [
  {
    label: '1. Full Fine-tuning의 문제',
    body: '7B 모델 전체 파라미터를 갱신하면 FP16 기준 최소 112GB VRAM 필요\n기울기+옵티마이저 상태까지 포함하면 A100 80GB 2장도 부족',
  },
  {
    label: '2. PEFT: 파라미터 효율적 접근법 3가지',
    body: 'Adapter — 레이어 사이에 소형 MLP 삽입 (Houlsby, 2019)\nPrefix-tuning — 키/값 앞에 학습 가능한 벡터 추가 (Li & Liang, 2021)\nLoRA — 가중치 변화를 저랭크 행렬로 분해 (Hu et al., 2021)',
  },
  {
    label: '3. 학습 파라미터 비교',
    body: 'Full: 100% (7B 전체) / Adapter: ~3.6% / Prefix: ~0.1%\nLoRA: ~0.1-1% — 추론 시 원본과 병합 가능, 추가 지연 없음',
  },
];

export default function PeftCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              {/* 모델 크기 시각화 */}
              <ModuleBox x={30} y={10} w={120} h={50} label="LLaMA-2 7B" sub="70억 파라미터" color="#ef4444" />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <rect x={170} y={20} width={280} height={14} rx={4} fill="#ef444420" stroke="#ef4444" strokeWidth={0.5} />
                <rect x={170} y={20} width={280} height={14} rx={4} fill="#ef4444" opacity={0.6} />
                <text x={310} y={30} textAnchor="middle" fontSize={8} fontWeight={600} fill="#ffffff">
                  모델 가중치 14GB (FP16)
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                <rect x={170} y={42} width={280} height={14} rx={4} fill="#f59e0b20" stroke="#f59e0b" strokeWidth={0.5} />
                <rect x={170} y={42} width={280} height={14} rx={4} fill="#f59e0b" opacity={0.6} />
                <text x={310} y={52} textAnchor="middle" fontSize={8} fontWeight={600} fill="#ffffff">
                  기울기 14GB
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <rect x={170} y={64} width={280} height={28} rx={4} fill="#6366f120" stroke="#6366f1" strokeWidth={0.5} />
                <rect x={170} y={64} width={280} height={28} rx={4} fill="#6366f1" opacity={0.6} />
                <text x={310} y={82} textAnchor="middle" fontSize={8} fontWeight={600} fill="#ffffff">
                  옵티마이저 상태 (Adam: m+v) ~56GB
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 4 }}>
                <rect x={170} y={100} width={280} height={14} rx={4} fill="#10b98120" stroke="#10b981" strokeWidth={0.5} />
                <rect x={170} y={100} width={280} height={14} rx={4} fill="#10b981" opacity={0.5} />
                <text x={310} y={110} textAnchor="middle" fontSize={8} fontWeight={600} fill="#ffffff">
                  활성화 메모리 ~28GB+
                </text>
              </motion.g>
              <AlertBox x={170} y={130} w={280} h={40} label="합계: 112GB+" sub="A100 80GB 2장 필요" color="#ef4444" />
              <motion.text x={60} y={150} fontSize={9} fill="var(--muted-foreground)" textAnchor="middle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 5 }}>
                학습 비용
              </motion.text>
              <motion.text x={60} y={165} fontSize={9} fill="var(--muted-foreground)" textAnchor="middle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 5 }}>
                GPU 대당 $2/hr
              </motion.text>
            </g>
          )}
          {step === 1 && (
            <g>
              <ModuleBox x={10} y={8} w={100} h={44} label="Adapter" sub="Houlsby 2019" color="#3b82f6" />
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: d }}>
                {/* Adapter 구조: FFN 사이에 삽입 */}
                <rect x={120} y={12} width={40} height={16} rx={3} fill="#3b82f620" stroke="#3b82f6" strokeWidth={0.5} />
                <text x={140} y={23} textAnchor="middle" fontSize={7} fill="#3b82f6">FFN</text>
                <line x1={140} y1={28} x2={140} y2={34} stroke="#3b82f6" strokeWidth={0.5} markerEnd="url(#arrowB)" />
                <rect x={125} y={34} width={30} height={12} rx={3} fill="#3b82f6" opacity={0.3} />
                <text x={140} y={42.5} textAnchor="middle" fontSize={6.5} fontWeight={600} fill="#3b82f6">Adapter</text>
              </motion.g>

              <ModuleBox x={10} y={64} w={100} h={44} label="Prefix-tuning" sub="Li & Liang 2021" color="#10b981" />
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: d * 2 }}>
                {/* Prefix 구조: K,V 앞에 prefix 추가 */}
                <DataBox x={120} y={68} w={55} h={24} label="Prefix" sub="학습 벡터" color="#10b981" />
                <text x={180} y={82} fontSize={8} fill="var(--muted-foreground)">+</text>
                <DataBox x={190} y={68} w={40} h={24} label="K, V" color="#64748b" />
              </motion.g>

              <ModuleBox x={10} y={126} w={100} h={44} label="LoRA" sub="Hu et al. 2021" color="#6366f1" />
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: d * 3 }}>
                {/* LoRA 구조: W + BA */}
                <rect x={120} y={130} width={50} height={32} rx={4} fill="#64748b10" stroke="var(--border)" strokeWidth={0.5} />
                <text x={145} y={149} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">W</text>
                <text x={178} y={149} fontSize={10} fill="var(--muted-foreground)">+</text>
                <rect x={190} y={130} width={22} height={32} rx={3} fill="#6366f130" stroke="#6366f1" strokeWidth={0.5} />
                <text x={201} y={149} textAnchor="middle" fontSize={8} fontWeight={600} fill="#6366f1">B</text>
                <rect x={218} y={136} width={32} height={20} rx={3} fill="#6366f130" stroke="#6366f1" strokeWidth={0.5} />
                <text x={234} y={149} textAnchor="middle" fontSize={8} fontWeight={600} fill="#6366f1">A</text>
              </motion.g>

              {/* 오른쪽 비교 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 4 }}>
                <text x={290} y={24} fontSize={9} fontWeight={600} fill="var(--foreground)">추론 지연</text>
                <text x={290} y={40} fontSize={8} fill="#3b82f6">Adapter: 있음 (직렬 추가)</text>
                <text x={290} y={55} fontSize={8} fill="#10b981">Prefix: 약간 (토큰 길이 증가)</text>
                <text x={290} y={70} fontSize={8} fill="#6366f1">LoRA: 없음 (병합 가능)</text>

                <text x={290} y={100} fontSize={9} fontWeight={600} fill="var(--foreground)">학습 파라미터</text>
                <text x={290} y={116} fontSize={8} fill="#3b82f6">Adapter: ~3.6%</text>
                <text x={290} y={131} fontSize={8} fill="#10b981">Prefix: ~0.1%</text>
                <text x={290} y={146} fontSize={8} fill="#6366f1">LoRA: ~0.1-1%</text>

                <rect x={285} y={156} width={170} height={28} rx={6} fill="#6366f110" stroke="#6366f1" strokeWidth={0.5} />
                <text x={370} y={173} textAnchor="middle" fontSize={8} fontWeight={600} fill="#6366f1">
                  LoRA = 추론 오버헤드 0 + 적은 파라미터
                </text>
              </motion.g>
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                학습 파라미터 수 비교 (7B 모델 기준)
              </text>
              {/* Full fine-tuning bar */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <text x={20} y={46} fontSize={9} fontWeight={600} fill="#ef4444">Full</text>
                <rect x={80} y={34} width={380} height={20} rx={4} fill="#ef444430" stroke="#ef4444" strokeWidth={0.5} />
                <text x={270} y={48} textAnchor="middle" fontSize={8} fontWeight={600} fill="#ef4444">7,000M (100%)</text>
              </motion.g>
              {/* Adapter bar */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                <text x={20} y={76} fontSize={9} fontWeight={600} fill="#3b82f6">Adapter</text>
                <rect x={80} y={64} width={14} height={20} rx={4} fill="#3b82f630" stroke="#3b82f6" strokeWidth={0.5} />
                <text x={100} y={78} fontSize={8} fontWeight={600} fill="#3b82f6">252M (3.6%)</text>
              </motion.g>
              {/* Prefix bar */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <text x={20} y={106} fontSize={9} fontWeight={600} fill="#10b981">Prefix</text>
                <rect x={80} y={94} width={4} height={20} rx={2} fill="#10b98130" stroke="#10b981" strokeWidth={0.5} />
                <text x={90} y={108} fontSize={8} fontWeight={600} fill="#10b981">7M (0.1%)</text>
              </motion.g>
              {/* LoRA bar */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 4 }}>
                <text x={20} y={136} fontSize={9} fontWeight={600} fill="#6366f1">LoRA</text>
                <rect x={80} y={124} width={6} height={20} rx={2} fill="#6366f130" stroke="#6366f1" strokeWidth={0.5} />
                <text x={92} y={138} fontSize={8} fontWeight={600} fill="#6366f1">~20M (0.3%)</text>
              </motion.g>
              {/* LoRA advantage */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 5 }}>
                <StatusBox x={190} y={152} w={200} h={40} label="LoRA 이점" sub="병합 시 추론 지연 0" color="#6366f1" progress={1} />
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
