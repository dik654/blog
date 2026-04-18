import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const d = 0.07;
const P = '#6366f1', G = '#10b981', W = '#f59e0b', B = '#3b82f6', R = '#ef4444', T = '#8b5cf6';

const STEPS = [
  {
    label: '1. QLoRA 핵심: 4비트 양자화 + LoRA 결합',
    body: '사전학습 모델을 NF4(Normal Float 4-bit)로 양자화하여 메모리 75% 절감\n양자화된 가중치 위에 LoRA 어댑터를 학습 — 단일 GPU로 65B 모델 fine-tuning 가능',
  },
  {
    label: '2. NF4: 정규분포에 최적화된 4비트 데이터 타입',
    body: '신경망 가중치는 정규분포를 따름 → 양자화 구간을 정규분포 분위수에 맞춤\n균등 분할(FP4)보다 정보 손실이 적음 — 동일 비트에서 더 높은 정밀도',
  },
  {
    label: '3. Double Quantization: 양자화 상수도 양자화',
    body: '블록별 양자화 상수(scale factor)는 FP32 → 추가 메모리 소모\nDQ: 양자화 상수 자체를 8비트로 2차 양자화 → 파라미터당 0.37비트 추가 절감',
  },
  {
    label: '4. Paged Optimizers: GPU OOM 방지',
    body: 'NVIDIA 통합 메모리(unified memory)를 활용하여 옵티마이저 상태를 CPU↔GPU 페이징\n긴 시퀀스에서 메모리 피크 발생 시 자동으로 CPU로 이전, 필요 시 복귀',
  },
  {
    label: '5. VRAM 비교: Full vs LoRA vs QLoRA',
    body: '65B 모델 기준 — Full: 780GB+ / LoRA(FP16): 160GB+ / QLoRA(NF4): ~48GB\nQLoRA로 단일 A100 80GB에서 65B 모델 학습 가능',
  },
];

export default function QLoraDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                QLoRA = Quantization + LoRA
              </text>
              {/* Base model quantized */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <rect x={30} y={35} width={140} height={60} rx={6} fill={`${B}10`} stroke={B} strokeWidth={0.8} />
                <text x={100} y={56} textAnchor="middle" fontSize={10} fontWeight={700} fill={B}>Base Model</text>
                <text x={100} y={72} textAnchor="middle" fontSize={8} fill={B}>NF4 양자화 (4-bit)</text>
                <text x={100} y={86} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">메모리 75% 절감</text>
              </motion.g>

              {/* Arrow */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                <line x1={170} y1={65} x2={200} y2={65} stroke="var(--border)" strokeWidth={1} />
                <polygon points="197,60 197,70 205,65" fill="var(--muted-foreground)" />
              </motion.g>

              {/* Forward/Backward */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <ActionBox x={210} y={32} w={100} h={34} label="Forward" sub="NF4→BF16 역양자화" color={G} />
                <ActionBox x={210} y={72} w={100} h={34} label="Backward" sub="BF16 기울기 계산" color={W} />
              </motion.g>

              {/* LoRA adapter */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 4 }}>
                <line x1={310} y1={65} x2={340} y2={65} stroke={P} strokeWidth={1} />
                <polygon points="337,60 337,70 345,65" fill={P} />
                <rect x={350} y={40} width={110} height={50} rx={6} fill={`${P}12`} stroke={P} strokeWidth={0.8} />
                <text x={405} y={60} textAnchor="middle" fontSize={10} fontWeight={700} fill={P}>LoRA Adapter</text>
                <text x={405} y={76} textAnchor="middle" fontSize={8} fill={P}>BF16 (16-bit)</text>
                <text x={405} y={86} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">학습 대상</text>
              </motion.g>

              {/* Memory breakdown */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 5 }}>
                <rect x={30} y={110} width={430} height={30} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <rect x={30} y={110} width={240} height={30} rx={6} fill={`${B}15`} />
                <text x={150} y={129} textAnchor="middle" fontSize={8} fontWeight={600} fill={B}>4-bit 모델 (대부분)</text>
                <rect x={270} y={110} width={60} height={30} fill={`${P}15`} />
                <text x={300} y={129} textAnchor="middle" fontSize={8} fontWeight={600} fill={P}>LoRA</text>
                <rect x={330} y={110} width={60} height={30} fill={`${W}15`} />
                <text x={360} y={129} textAnchor="middle" fontSize={8} fontWeight={600} fill={W}>Optim</text>
                <rect x={390} y={110} width={70} height={30} rx={6} fill={`${G}15`} />
                <text x={425} y={129} textAnchor="middle" fontSize={8} fontWeight={600} fill={G}>Act</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 6 }}>
                <rect x={120} y={150} width={240} height={22} rx={8} fill={`${G}10`} stroke={G} strokeWidth={0.5} />
                <text x={240} y={165} textAnchor="middle" fontSize={8} fontWeight={600} fill={G}>
                  65B 모델 → 단일 A100 80GB에서 학습 가능
                </text>
              </motion.g>
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                NF4 vs FP4: 정규분포 최적 양자화
              </text>
              {/* Normal distribution curve */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <text x={120} y={36} textAnchor="middle" fontSize={9} fontWeight={600} fill={B}>가중치 분포 (정규분포)</text>
                {/* Bell curve approximation */}
                <path d="M 20,130 Q 40,128 60,120 Q 80,100 100,60 Q 110,40 120,35 Q 130,40 140,60 Q 160,100 180,120 Q 200,128 220,130"
                  fill={`${B}10`} stroke={B} strokeWidth={1} />
                <line x1={20} y1={130} x2={220} y2={130} stroke="var(--border)" strokeWidth={0.5} />
              </motion.g>

              {/* FP4 uniform quantization */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                <text x={120} y={148} textAnchor="middle" fontSize={8} fill={R}>FP4: 균등 분할 (정보 낭비)</text>
                {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                  <line key={`fp4-${i}`} x1={20 + i * 28.5} y1={125} x2={20 + i * 28.5} y2={135} stroke={R} strokeWidth={0.8} />
                ))}
              </motion.g>

              {/* NF4 quantiles */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <text x={120} y={170} textAnchor="middle" fontSize={8} fill={G}>NF4: 분위수 기반 (밀집 구간에 집중)</text>
                {/* More lines near center, fewer at edges */}
                {[10, 40, 60, 80, 95, 105, 115, 120, 125, 135, 145, 160, 175, 195, 210, 225].slice(0, 8).map((x, i) => (
                  <line key={`nf4-${i}`} x1={x} y1={125} x2={x} y2={135} stroke={G} strokeWidth={0.8} />
                ))}
              </motion.g>

              {/* Comparison box */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 4 }}>
                <rect x={260} y={35} width={200} height={100} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={360} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">정보 이론적 비교</text>
                <text x={270} y={72} fontSize={8} fill={R}>FP4: 균등 16구간</text>
                <text x={270} y={88} fontSize={8} fill={R}>  꼬리 부분에 불필요한 정밀도</text>
                <text x={270} y={108} fontSize={8} fill={G}>NF4: 분위수 16구간</text>
                <text x={270} y={124} fontSize={8} fill={G}>  중심부(가중치 밀집)에 더 많은 구간</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 5 }}>
                <rect x={260} y={145} width={200} height={22} rx={8} fill={`${G}10`} stroke={G} strokeWidth={0.5} />
                <text x={360} y={160} textAnchor="middle" fontSize={8} fontWeight={600} fill={G}>
                  동일 4비트에서 정보 보존량 최대
                </text>
              </motion.g>
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                Double Quantization (DQ)
              </text>
              {/* Block quantization explanation */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <text x={240} y={38} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  블록별 양자화: 64개 가중치마다 1개 scale factor(FP32)
                </text>
              </motion.g>

              {/* Weight blocks */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                <text x={30} y={64} fontSize={8} fontWeight={600} fill={B}>Block 1</text>
                <rect x={80} y={52} width={120} height={18} rx={3} fill={`${B}15`} stroke={B} strokeWidth={0.5} />
                <text x={140} y={64} textAnchor="middle" fontSize={7.5} fill={B}>64개 NF4 가중치</text>
                <rect x={206} y={52} width={40} height={18} rx={3} fill={`${R}20`} stroke={R} strokeWidth={0.5} />
                <text x={226} y={64} textAnchor="middle" fontSize={7} fontWeight={600} fill={R}>scale</text>
                <text x={256} y={64} fontSize={7} fill={R}>FP32</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <text x={30} y={88} fontSize={8} fontWeight={600} fill={B}>Block 2</text>
                <rect x={80} y={76} width={120} height={18} rx={3} fill={`${B}15`} stroke={B} strokeWidth={0.5} />
                <text x={140} y={88} textAnchor="middle" fontSize={7.5} fill={B}>64개 NF4 가중치</text>
                <rect x={206} y={76} width={40} height={18} rx={3} fill={`${R}20`} stroke={R} strokeWidth={0.5} />
                <text x={226} y={88} textAnchor="middle" fontSize={7} fontWeight={600} fill={R}>scale</text>
                <text x={256} y={88} fontSize={7} fill={R}>FP32</text>
              </motion.g>

              {/* Arrow: DQ applied */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 4 }}>
                <line x1={240} y1={100} x2={240} y2={118} stroke={G} strokeWidth={1} />
                <polygon points="235,118 245,118 240,125" fill={G} />
                <text x={290} y={115} fontSize={8} fontWeight={600} fill={G}>Double Quantization 적용</text>
              </motion.g>

              {/* After DQ */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 5 }}>
                <text x={30} y={142} fontSize={8} fontWeight={600} fill={B}>Block 1</text>
                <rect x={80} y={130} width={120} height={18} rx={3} fill={`${B}15`} stroke={B} strokeWidth={0.5} />
                <text x={140} y={142} textAnchor="middle" fontSize={7.5} fill={B}>64개 NF4 가중치</text>
                <rect x={206} y={130} width={40} height={18} rx={3} fill={`${G}20`} stroke={G} strokeWidth={0.5} />
                <text x={226} y={142} textAnchor="middle" fontSize={7} fontWeight={600} fill={G}>scale</text>
                <text x={256} y={142} fontSize={7} fill={G}>FP8</text>
              </motion.g>

              {/* Savings */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 6 }}>
                <rect x={100} y={162} width={280} height={30} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--foreground)">
                  scale: FP32(32bit) → FP8(8bit)
                </text>
                <text x={240} y={188} textAnchor="middle" fontSize={8} fontWeight={600} fill={G}>
                  파라미터당 0.37비트 절감 (64개당 24비트 감소)
                </text>
              </motion.g>
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                Paged Optimizers: OOM 방지
              </text>
              {/* GPU Memory */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <rect x={30} y={35} width={180} height={100} rx={8} fill="var(--card)" stroke={P} strokeWidth={0.8} />
                <text x={120} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={P}>GPU VRAM</text>
                <rect x={40} y={60} width={160} height={20} rx={3} fill={`${B}15`} stroke={B} strokeWidth={0.5} />
                <text x={120} y={74} textAnchor="middle" fontSize={8} fill={B}>4-bit 모델 가중치</text>
                <rect x={40} y={84} width={100} height={20} rx={3} fill={`${P}15`} stroke={P} strokeWidth={0.5} />
                <text x={90} y={98} textAnchor="middle" fontSize={8} fill={P}>LoRA + 기울기</text>
                <rect x={40} y={108} width={60} height={18} rx={3} fill={`${W}15`} stroke={W} strokeWidth={0.5} />
                <text x={70} y={120} textAnchor="middle" fontSize={7.5} fill={W}>Optim (일부)</text>
              </motion.g>

              {/* Bidirectional arrow */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                <line x1={220} y1={85} x2={260} y2={85} stroke={G} strokeWidth={1.5} />
                <polygon points="255,80 255,90 265,85" fill={G} />
                <polygon points="225,80 225,90 215,85" fill={G} />
                <text x={240} y={105} textAnchor="middle" fontSize={7.5} fill={G}>페이징</text>
              </motion.g>

              {/* CPU Memory */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <rect x={270} y={35} width={180} height={100} rx={8} fill="var(--card)" stroke="#64748b" strokeWidth={0.8} />
                <text x={360} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">CPU RAM</text>
                <rect x={280} y={60} width={160} height={20} rx={3} fill={`${W}10`} stroke={W} strokeWidth={0.5} />
                <text x={360} y={74} textAnchor="middle" fontSize={8} fill={W}>옵티마이저 상태 (나머지)</text>
                <rect x={280} y={84} width={100} height={20} rx={3} fill="#64748b10" stroke="var(--border)" strokeWidth={0.5} />
                <text x={330} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">활성화 오버플로</text>
              </motion.g>

              {/* How it works */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 4 }}>
                <rect x={30} y={148} width={420} height={44} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={164} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">
                  NVIDIA Unified Memory 활용: cudaMallocManaged()
                </text>
                <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  메모리 피크 시 자동 CPU 이전 → 필요 시 GPU 복귀 → OOM 없이 학습 지속
                </text>
              </motion.g>
            </g>
          )}
          {step === 4 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                VRAM 사용량 비교 (65B 모델)
              </text>
              {/* Full fine-tuning */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <text x={20} y={48} fontSize={9} fontWeight={600} fill={R}>Full FT</text>
                <rect x={80} y={36} width={380} height={22} rx={4} fill={`${R}20`} stroke={R} strokeWidth={0.5} />
                <text x={270} y={51} textAnchor="middle" fontSize={8} fontWeight={600} fill={R}>780GB+ (FP16) — GPU 10장+</text>
              </motion.g>

              {/* LoRA FP16 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                <text x={20} y={80} fontSize={9} fontWeight={600} fill={P}>LoRA</text>
                <text x={20} y={90} fontSize={7} fill="var(--muted-foreground)">(FP16)</text>
                <rect x={80} y={68} width={78} height={22} rx={4} fill={`${P}20`} stroke={P} strokeWidth={0.5} />
                <text x={119} y={83} textAnchor="middle" fontSize={8} fontWeight={600} fill={P}>160GB+</text>
              </motion.g>

              {/* QLoRA NF4 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <text x={20} y={118} fontSize={9} fontWeight={600} fill={G}>QLoRA</text>
                <text x={20} y={128} fontSize={7} fill="var(--muted-foreground)">(NF4)</text>
                <rect x={80} y={106} width={24} height={22} rx={4} fill={`${G}20`} stroke={G} strokeWidth={0.8} />
                <text x={112} y={121} fontSize={8} fontWeight={600} fill={G}>~48GB</text>
              </motion.g>

              {/* Single GPU highlight */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 4 }}>
                <rect x={80} y={140} width={380} height={48} rx={8} fill={`${G}08`} stroke={G} strokeWidth={0.5} />
                <text x={270} y={158} textAnchor="middle" fontSize={9} fontWeight={600} fill={G}>
                  QLoRA: 단일 A100 80GB로 65B 모델 fine-tuning 가능
                </text>
                <text x={270} y={176} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  성능 저하 최소: 16-bit full fine-tuning의 97-99% 성능 유지
                </text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
