import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const steps: StepDef[] = [
  {
    label: '단일 기법의 한계',
    body: '양자화만 적용하면 정확도 하락, 프루닝만 적용하면 크기 감소 한계. 각 기법은 서로 다른 축을 공략한다.',
  },
  {
    label: '프루닝 — 불필요한 연결 제거',
    body: '뉴런/채널/어텐션 헤드 중 기여도 낮은 것을 제거. 모델 구조 자체를 축소하여 파라미터 수 감소.',
  },
  {
    label: '지식 증류 — 작은 모델에 지식 전달',
    body: '큰 Teacher 모델의 soft label(확률 분포)을 작은 Student가 학습. 프루닝으로 잃은 정확도를 회복.',
  },
  {
    label: '양자화 — 비트 수 줄이기',
    body: 'FP16 → INT8 → INT4. 가중치와 활성값의 표현 정밀도를 낮춰 메모리와 연산량을 동시 감소.',
  },
  {
    label: '조합 시너지: EXAONE 1.2B 예시',
    body: '프루닝(30% 제거) → 증류(정확도 회복) → INT4 양자화 = 원본 대비 크기 1/6, 속도 3x, 정확도 95% 유지.',
  },
];

function Visual({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {step === 0 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
            단일 기법 적용 결과
          </text>
          {/* 원본 */}
          <ModuleBox x={10} y={40} w={100} h={50} label="원본 모델" sub="1.2B FP16" color="#6366f1" />
          {/* 양자화만 */}
          <line x1={110} y1={65} x2={160} y2={55} stroke="#ef4444" strokeWidth={1} markerEnd="url(#arr-red)" />
          <AlertBox x={160} y={32} w={130} h={48} label="양자화만" sub="크기 ↓ 정확도 ↓↓" color="#ef4444" />
          {/* 프루닝만 */}
          <line x1={110} y1={65} x2={160} y2={115} stroke="#f59e0b" strokeWidth={1} markerEnd="url(#arr-amber)" />
          <AlertBox x={160} y={92} w={130} h={48} label="프루닝만" sub="파라미터 ↓ 속도 변화 적음" color="#f59e0b" />
          {/* 증류만 */}
          <line x1={110} y1={65} x2={160} y2={172} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#arr-blue)" />
          <AlertBox x={160} y={150} w={130} h={48} label="증류만" sub="학습 비용 ↑↑↑" color="#3b82f6" />
          {/* 화살표 결론 */}
          <rect x={320} y={75} width={150} height={40} rx={8} fill="#71717a" fillOpacity={0.1} stroke="#71717a" strokeWidth={1} />
          <text x={395} y={92} textAnchor="middle" fontSize={10} fontWeight={600} fill="#71717a">
            각 기법이 공략하는 축이 다름
          </text>
          <text x={395} y={106} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            조합해야 Pareto optimal
          </text>
          <defs>
            <marker id="arr-red" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none" stroke="#ef4444" strokeWidth={1} />
            </marker>
            <marker id="arr-amber" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none" stroke="#f59e0b" strokeWidth={1} />
            </marker>
            <marker id="arr-blue" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none" stroke="#3b82f6" strokeWidth={1} />
            </marker>
          </defs>
        </g>
      )}

      {step === 1 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
            프루닝: 구조 축소
          </text>
          {/* 원본 그리드 */}
          <text x={80} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">원본 가중치</text>
          {[0,1,2,3,4,5].map(r =>
            [0,1,2,3,4,5].map(c => (
              <motion.rect key={`o-${r}-${c}`} x={30 + c * 18} y={48 + r * 18} width={14} height={14} rx={2}
                fill="#6366f1" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                transition={{ delay: (r * 6 + c) * 0.01 }} />
            ))
          )}
          {/* 프루닝 후 */}
          <text x={240} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">프루닝 후 (30% 제거)</text>
          {[0,1,2,3,4,5].map(r =>
            [0,1,2,3,4,5].map(c => {
              const pruned = [2,5,8,11,14,17,20,23,26,29,32].includes(r * 6 + c);
              return (
                <motion.rect key={`p-${r}-${c}`} x={190 + c * 18} y={48 + r * 18} width={14} height={14} rx={2}
                  fill={pruned ? '#ef4444' : '#10b981'}
                  initial={{ opacity: 0 }} animate={{ opacity: pruned ? 0.15 : 0.7 }}
                  transition={{ delay: (r * 6 + c) * 0.01 + 0.3 }} />
              );
            })
          )}
          {/* 효과 요약 */}
          <ActionBox x={350} y={50} w={120} h={40} label="파라미터 30% ↓" sub="연산량 비례 감소" color="#10b981" />
          <ActionBox x={350} y={100} w={120} h={40} label="정확도 5~10% ↓" sub="증류로 회복 가능" color="#f59e0b" />
          <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            Magnitude pruning: |w| 작은 순서대로 제거 → Structured pruning: 채널/헤드 단위
          </text>
        </g>
      )}

      {step === 2 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
            지식 증류: Teacher → Student
          </text>
          {/* Teacher */}
          <ModuleBox x={20} y={40} w={120} h={55} label="Teacher" sub="EXAONE 7.8B" color="#8b5cf6" />
          {/* soft label 화살표 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <line x1={140} y1={67} x2={210} y2={67} stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 2" />
            <polygon points="208,63 216,67 208,71" fill="#8b5cf6" />
            <text x={175} y={58} textAnchor="middle" fontSize={8} fill="#8b5cf6">soft labels</text>
          </motion.g>
          {/* KL div */}
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <rect x={210} y={42} width={90} height={50} rx={6} fill="#3b82f6" fillOpacity={0.08}
              stroke="#3b82f6" strokeWidth={1} />
            <text x={255} y={62} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">KL Divergence</text>
            <text x={255} y={76} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">분포 차이 최소화</text>
          </motion.g>
          {/* Student */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <line x1={300} y1={67} x2={340} y2={67} stroke="#3b82f6" strokeWidth={1.5} />
            <polygon points="338,63 346,67 338,71" fill="#3b82f6" />
          </motion.g>
          <ModuleBox x={346} y={40} w={120} h={55} label="Student" sub="프루닝된 1.2B" color="#10b981" />
          {/* 온도 설명 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <DataBox x={130} y={120} w={100} h={32} label="T=4~8" sub="soft label 온도" color="#f59e0b" />
            <DataBox x={255} y={120} w={100} h={32} label="α=0.5~0.7" sub="증류 loss 비율" color="#f59e0b" />
          </motion.g>
          <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            Teacher의 확률 분포가 hard label보다 풍부한 정보(dark knowledge) 포함
          </text>
          <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            Loss = α · KL(teacher, student) + (1-α) · CE(label, student)
          </text>
        </g>
      )}

      {step === 3 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
            양자화: 비트 정밀도 감소
          </text>
          {/* FP16 바 */}
          {[
            { label: 'FP16', bits: 16, w: 320, color: '#6366f1', y: 38 },
            { label: 'INT8', bits: 8, w: 160, color: '#3b82f6', y: 78 },
            { label: 'INT4', bits: 4, w: 80, color: '#10b981', y: 118 },
          ].map((q, i) => (
            <motion.g key={q.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}>
              <rect x={120} y={q.y} width={q.w} height={28} rx={6}
                fill={q.color} fillOpacity={0.15} stroke={q.color} strokeWidth={1} />
              <text x={120 + q.w / 2} y={q.y + 17} textAnchor="middle" fontSize={10} fontWeight={700} fill={q.color}>
                {q.label}
              </text>
              <text x={120 + q.w + 10} y={q.y + 17} fontSize={9} fill="var(--muted-foreground)">
                {q.bits}bit × {q.label === 'FP16' ? '1.2B' : q.label === 'INT8' ? '1.2B' : '1.2B'} = {
                  q.label === 'FP16' ? '2.4GB' : q.label === 'INT8' ? '1.2GB' : '0.6GB'
                }
              </text>
            </motion.g>
          ))}
          {/* 속도 비교 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <text x={240} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
              INT4: GEMM 연산 INT4 커널 활용 → FP16 대비 ~2x 처리량 증가
            </text>
            <text x={240} y={186} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              GPTQ / AWQ: 보정 데이터로 양자화 오차를 최소화하는 PTQ(Post-Training Quantization)
            </text>
          </motion.g>
        </g>
      )}

      {step === 4 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#8b5cf6">
            조합 결과: EXAONE 1.2B 파이프라인
          </text>
          {/* 파이프라인 흐름 */}
          <ModuleBox x={10} y={40} w={85} h={48} label="원본" sub="1.2B FP16" color="#6366f1" />
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <line x1={95} y1={64} x2={120} y2={64} stroke="#10b981" strokeWidth={1.5} />
            <polygon points="118,60 126,64 118,68" fill="#10b981" />
          </motion.g>
          <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <ActionBox x={126} y={42} w={80} h={44} label="프루닝" sub="30% 제거" color="#10b981" />
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <line x1={206} y1={64} x2={230} y2={64} stroke="#3b82f6" strokeWidth={1.5} />
            <polygon points="228,60 236,64 228,68" fill="#3b82f6" />
          </motion.g>
          <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <ActionBox x={236} y={42} w={80} h={44} label="증류" sub="정확도 회복" color="#3b82f6" />
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
            <line x1={316} y1={64} x2={340} y2={64} stroke="#ef4444" strokeWidth={1.5} />
            <polygon points="338,60 346,64 338,68" fill="#ef4444" />
          </motion.g>
          <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
            <ActionBox x={346} y={42} w={80} h={44} label="INT4 양자화" sub="GPTQ/AWQ" color="#ef4444" />
          </motion.g>
          {/* 결과 메트릭 */}
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <StatusBox x={50} y={115} w={110} h={50} label="크기" sub="2.4GB → 0.42GB (1/6)" color="#10b981" progress={0.17} />
            <StatusBox x={185} y={115} w={110} h={50} label="속도" sub="45 → 135 tok/s (3x)" color="#3b82f6" progress={0.75} />
            <StatusBox x={320} y={115} w={110} h={50} label="정확도" sub="PPL 12.1 → 12.7 (95%)" color="#8b5cf6" progress={0.95} />
          </motion.g>
          <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            핵심: 각 기법이 서로 다른 축(구조 / 지식 / 정밀도)을 공략 → 곱셈적 효과
          </text>
        </g>
      )}
    </svg>
  );
}

export default function SynergyViz() {
  return (
    <StepViz steps={steps}>
      {(step) => <Visual step={step} />}
    </StepViz>
  );
}
