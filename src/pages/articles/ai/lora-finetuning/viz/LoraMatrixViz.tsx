import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const d = 0.07;
const P = '#6366f1', G = '#10b981', W = '#f59e0b', B = '#3b82f6', R = '#ef4444';

const STEPS = [
  {
    label: '1. LoRA 핵심 아이디어: W + ΔW = W + BA',
    body: '사전학습 가중치 W는 고정(frozen). 가중치 변화량 ΔW를 저랭크(low-rank) 행렬 B*A로 분해\nd x d 행렬 대신 d x r + r x d 파라미터만 학습 — r이 4~64이면 99%+ 절감',
  },
  {
    label: '2. 행렬 차원과 rank의 의미',
    body: 'W: (d_out x d_in), B: (d_out x r), A: (r x d_in)\nrank r = 저차원 부분공간의 크기. r이 작을수록 파라미터 적지만 표현력 제한\n실험적으로 r=8~16이 대부분 태스크에서 충분',
  },
  {
    label: '3. 적용 위치: 어떤 가중치 행렬에?',
    body: 'Transformer의 Attention에는 Q, K, V, O 4개 프로젝션 행렬 존재\n원 논문: q_proj, v_proj에만 적용해도 성능 충분\n실무: q_proj, k_proj, v_proj, o_proj + FFN(gate, up, down)까지 확장 추세',
  },
  {
    label: '4. 학습 & 병합 과정',
    body: '학습 시: h = Wx + BAx (두 경로 합산)\nscaling factor α/r을 곱하여 학습률 안정화\n배포 시: W\' = W + (α/r)BA로 병합 → 추론 비용 증가 없음',
  },
];

export default function LoraMatrixViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                LoRA: Low-Rank Adaptation
              </text>
              {/* Input x */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <rect x={20} y={70} width={40} height={60} rx={4} fill="#64748b18" stroke="var(--border)" strokeWidth={0.5} />
                <text x={40} y={103} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">x</text>
                <text x={40} y={118} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">입력</text>
              </motion.g>

              {/* Frozen W path */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: d * 2 }}>
                <line x1={60} y1={85} x2={130} y2={85} stroke="#64748b" strokeWidth={1} strokeDasharray="3 2" />
                <rect x={130} y={55} width={80} height={60} rx={6} fill="#64748b10" stroke="var(--border)" strokeWidth={0.5} />
                <text x={170} y={82} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--foreground)">W</text>
                <text x={170} y={105} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">frozen (고정)</text>
                {/* Lock icon */}
                <text x={200} y={68} fontSize={10}>&#x1F512;</text>
              </motion.g>

              {/* LoRA BA path */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d * 3 }}>
                <line x1={60} y1={115} x2={90} y2={145} stroke={P} strokeWidth={1} />
                {/* A matrix: r x d_in (wide & short) */}
                <rect x={90} y={135} width={50} height={24} rx={4} fill={`${P}20`} stroke={P} strokeWidth={0.8} />
                <text x={115} y={150} textAnchor="middle" fontSize={10} fontWeight={700} fill={P}>A</text>
                <text x={115} y={162} textAnchor="middle" fontSize={7} fill={P}>r x d_in</text>
                {/* Arrow */}
                <line x1={140} y1={147} x2={160} y2={147} stroke={P} strokeWidth={1} />
                {/* B matrix: d_out x r (tall & narrow) */}
                <rect x={160} y={130} width={30} height={36} rx={4} fill={`${P}20`} stroke={P} strokeWidth={0.8} />
                <text x={175} y={150} textAnchor="middle" fontSize={10} fontWeight={700} fill={P}>B</text>
                <text x={175} y={162} textAnchor="middle" fontSize={7} fill={P}>d_out x r</text>
              </motion.g>

              {/* Sum */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 4 }}>
                <line x1={210} y1={85} x2={260} y2={85} stroke="#64748b" strokeWidth={1} strokeDasharray="3 2" />
                <line x1={190} y1={147} x2={260} y2={100} stroke={P} strokeWidth={1} />
                <circle cx={270} cy={90} r={14} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={270} y={94} textAnchor="middle" fontSize={14} fontWeight={700} fill={G}>+</text>
              </motion.g>

              {/* Output h */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 5 }}>
                <line x1={284} y1={90} x2={330} y2={90} stroke="var(--border)" strokeWidth={1} />
                <rect x={330} y={65} width={40} height={50} rx={4} fill={`${G}15`} stroke={G} strokeWidth={0.5} />
                <text x={350} y={93} textAnchor="middle" fontSize={11} fontWeight={700} fill={G}>h</text>
                <text x={350} y={108} textAnchor="middle" fontSize={7} fill={G}>출력</text>
              </motion.g>

              {/* Formula */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 6 }}>
                <rect x={130} y={175} width={220} height={20} rx={6} fill={`${P}10`} stroke={P} strokeWidth={0.5} />
                <text x={240} y={189} textAnchor="middle" fontSize={9} fontWeight={600} fill={P}>
                  h = Wx + BAx = (W + BA)x
                </text>
              </motion.g>
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                행렬 차원 비교: Full vs LoRA
              </text>
              {/* Full ΔW: d_out x d_in */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <text x={30} y={40} fontSize={9} fontWeight={600} fill={R}>Full ΔW</text>
                <rect x={30} y={48} width={120} height={90} rx={4} fill={`${R}10`} stroke={R} strokeWidth={0.8} />
                <text x={90} y={96} textAnchor="middle" fontSize={11} fontWeight={700} fill={R}>ΔW</text>
                <text x={90} y={130} textAnchor="middle" fontSize={8} fill={R}>d_out x d_in</text>
                <text x={90} y={146} textAnchor="middle" fontSize={8} fill={R}>4096 x 4096</text>
                <text x={90} y={162} textAnchor="middle" fontSize={8} fontWeight={600} fill={R}>= 16,777,216</text>
              </motion.g>

              {/* vs */}
              <motion.text x={175} y={96} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                vs
              </motion.text>

              {/* LoRA: B (d_out x r) * A (r x d_in) */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <text x={210} y={40} fontSize={9} fontWeight={600} fill={P}>LoRA (r=8)</text>
                {/* B */}
                <rect x={210} y={48} width={24} height={90} rx={4} fill={`${P}20`} stroke={P} strokeWidth={0.8} />
                <text x={222} y={96} textAnchor="middle" fontSize={10} fontWeight={700} fill={P}>B</text>
                <text x={222} y={130} textAnchor="middle" fontSize={7} fill={P}>4096x8</text>
                {/* times */}
                <text x={244} y={96} fontSize={10} fill="var(--muted-foreground)">x</text>
                {/* A */}
                <rect x={254} y={76} width={90} height={24} rx={4} fill={`${P}20`} stroke={P} strokeWidth={0.8} />
                <text x={299} y={92} textAnchor="middle" fontSize={10} fontWeight={700} fill={P}>A</text>
                <text x={299} y={116} textAnchor="middle" fontSize={7} fill={P}>8x4096</text>
              </motion.g>

              {/* LoRA param count */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 4 }}>
                <text x={270} y={146} textAnchor="middle" fontSize={8} fill={P}>32,768 + 32,768</text>
                <text x={270} y={162} textAnchor="middle" fontSize={8} fontWeight={600} fill={P}>= 65,536</text>
              </motion.g>

              {/* Savings */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 5 }}>
                <rect x={360} y={60} width={105} height={80} rx={8} fill={`${G}10`} stroke={G} strokeWidth={0.5} />
                <text x={412} y={82} textAnchor="middle" fontSize={9} fontWeight={600} fill={G}>파라미터 절감</text>
                <text x={412} y={104} textAnchor="middle" fontSize={18} fontWeight={700} fill={G}>99.6%</text>
                <text x={412} y={124} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">16.7M → 65K</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 6 }}>
                <rect x={120} y={175} width={240} height={18} rx={6} fill={`${B}10`} stroke={B} strokeWidth={0.5} />
                <text x={240} y={188} textAnchor="middle" fontSize={8} fill={B}>
                  rank r이 작을수록 압축률 높음 — 보통 r=8~16 사용
                </text>
              </motion.g>
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                LoRA 적용 위치: Transformer Attention
              </text>
              {/* Attention block */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <rect x={60} y={30} width={360} height={130} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
                  Multi-Head Attention Layer
                </text>
              </motion.g>

              {/* Q, K, V, O projections */}
              {[
                { label: 'Q_proj', x: 80, applied: true, color: P },
                { label: 'K_proj', x: 160, applied: true, color: P },
                { label: 'V_proj', x: 240, applied: true, color: P },
                { label: 'O_proj', x: 320, applied: true, color: P },
              ].map((proj, i) => (
                <motion.g key={proj.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: d * (i + 2) }}>
                  <rect x={proj.x} y={58} width={60} height={36} rx={5}
                    fill={proj.applied ? `${proj.color}18` : '#64748b10'}
                    stroke={proj.applied ? proj.color : 'var(--border)'} strokeWidth={proj.applied ? 0.8 : 0.5} />
                  <text x={proj.x + 30} y={76} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill={proj.applied ? proj.color : 'var(--muted-foreground)'}>{proj.label}</text>
                  <text x={proj.x + 30} y={88} textAnchor="middle" fontSize={7}
                    fill={proj.applied ? proj.color : 'var(--muted-foreground)'}>+LoRA</text>
                </motion.g>
              ))}

              {/* FFN block */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 6 }}>
                <rect x={100} y={105} width={80} height={28} rx={5} fill={`${W}15`} stroke={W} strokeWidth={0.5} />
                <text x={140} y={120} textAnchor="middle" fontSize={8} fontWeight={600} fill={W}>gate_proj</text>
                <text x={140} y={130} textAnchor="middle" fontSize={7} fill={W}>+LoRA</text>

                <rect x={200} y={105} width={80} height={28} rx={5} fill={`${W}15`} stroke={W} strokeWidth={0.5} />
                <text x={240} y={120} textAnchor="middle" fontSize={8} fontWeight={600} fill={W}>up_proj</text>
                <text x={240} y={130} textAnchor="middle" fontSize={7} fill={W}>+LoRA</text>

                <rect x={300} y={105} width={80} height={28} rx={5} fill={`${W}15`} stroke={W} strokeWidth={0.5} />
                <text x={340} y={120} textAnchor="middle" fontSize={8} fontWeight={600} fill={W}>down_proj</text>
                <text x={340} y={130} textAnchor="middle" fontSize={7} fill={W}>+LoRA</text>
              </motion.g>

              {/* Legend */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 7 }}>
                <rect x={60} y={170} width={10} height={10} rx={2} fill={`${P}30`} stroke={P} strokeWidth={0.5} />
                <text x={76} y={179} fontSize={8} fill="var(--foreground)">원 논문 (q, v만)</text>
                <rect x={200} y={170} width={10} height={10} rx={2} fill={`${W}30`} stroke={W} strokeWidth={0.5} />
                <text x={216} y={179} fontSize={8} fill="var(--foreground)">실무 확장 (FFN 포함)</text>
                <text x={350} y={179} fontSize={8} fill="var(--muted-foreground)">더 많이 적용 = 표현력 ↑ 파라미터 ↑</text>
              </motion.g>
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                학습 → 병합 → 배포
              </text>
              {/* Training phase */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <text x={120} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={B}>학습 시</text>
                <rect x={30} y={46} width={80} height={50} rx={5} fill="#64748b10" stroke="var(--border)" strokeWidth={0.5} />
                <text x={70} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">W</text>
                <text x={70} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">frozen</text>
                {/* Lock */}
                <text x={100} y={56} fontSize={8}>&#x1F512;</text>

                <text x={127} y={72} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">+</text>

                <rect x={140} y={52} width={30} height={38} rx={4} fill={`${P}20`} stroke={P} strokeWidth={0.8} />
                <text x={155} y={72} textAnchor="middle" fontSize={9} fontWeight={700} fill={P}>BA</text>
                <text x={155} y={85} textAnchor="middle" fontSize={7} fill={P}>학습</text>
              </motion.g>

              {/* Scaling */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                <rect x={180} y={52} width={50} height={38} rx={4} fill={`${W}10`} stroke={W} strokeWidth={0.5} />
                <text x={205} y={68} textAnchor="middle" fontSize={8} fontWeight={600} fill={W}>x (a/r)</text>
                <text x={205} y={82} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">scaling</text>
              </motion.g>

              {/* Arrow to merge */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <line x1={120} y1={105} x2={120} y2={125} stroke="var(--border)" strokeWidth={1} />
                <polygon points="115,125 125,125 120,132" fill="var(--muted-foreground)" />
                <text x={240} y={118} textAnchor="middle" fontSize={9} fontWeight={600} fill={G}>배포 시: 병합</text>
              </motion.g>

              {/* Merged W' */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d * 4 }}>
                <rect x={50} y={138} width={140} height={50} rx={6} fill={`${G}12`} stroke={G} strokeWidth={0.8} />
                <text x={120} y={162} textAnchor="middle" fontSize={12} fontWeight={700} fill={G}>W' = W + (a/r)BA</text>
                <text x={120} y={180} textAnchor="middle" fontSize={7} fill={G}>단일 행렬, 추가 연산 없음</text>
              </motion.g>

              {/* Benefits */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 5 }}>
                <rect x={260} y={40} width={200} height={95} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={360} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">alpha (a) & rank (r)</text>
                <text x={270} y={76} fontSize={8} fill="var(--muted-foreground)">a=32, r=16 → scale=2.0</text>
                <text x={270} y={92} fontSize={8} fill="var(--muted-foreground)">a=16, r=16 → scale=1.0</text>
                <text x={270} y={108} fontSize={8} fill={P}>a/r이 클수록 LoRA 영향 강함</text>
                <text x={270} y={124} fontSize={8} fill="var(--muted-foreground)">관례: a = r 또는 a = 2r</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 6 }}>
                <rect x={260} y={145} width={200} height={40} rx={6} fill={`${G}10`} stroke={G} strokeWidth={0.5} />
                <text x={360} y={162} textAnchor="middle" fontSize={8} fontWeight={600} fill={G}>병합 후 모델 = 원본과 동일 구조</text>
                <text x={360} y={178} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">추론 속도 저하 없음, VLLM/TGI 호환</text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
