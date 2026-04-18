import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';
import { StatusBox, DataBox, AlertBox, ActionBox } from '@/components/viz/boxes';

const steps: StepDef[] = [
  {
    label: 'L4 GPU: 22.4GB VRAM 제약',
    body: 'LLM 대회 환경의 표준 GPU. 모델 가중치 + KV 캐시 + 활성값이 모두 VRAM 안에 들어와야 한다.',
  },
  {
    label: 'FP16 vs INT8 vs INT4 메모리 비교',
    body: '1.2B 모델 기준: FP16=2.4GB, INT8=1.2GB, INT4=0.6GB. VRAM 여유분은 KV 캐시와 배치 크기에 투자.',
  },
  {
    label: 'Pareto Front: 속도 vs 정확도',
    body: 'INT4가 항상 최선은 아님. 정확도 민감 태스크는 INT8, 처리량 중시는 INT4. Pareto front 위의 점만 의미 있다.',
  },
  {
    label: 'KV 캐시 VRAM 계산',
    body: 'KV 캐시 = 2 × layers × d_model × seq_len × batch × bytes_per_param. 긴 시퀀스에서 KV가 가중치보다 클 수 있다.',
  },
  {
    label: '대회 제출 전략: 3단계 의사결정',
    body: '1) PPL 기준 통과 확인 → 2) VRAM 내 최대 배치 → 3) throughput 최적화. 최종 점수 = f(정확도, 속도).',
  },
];

function Visual({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {step === 0 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
            L4 GPU VRAM 레이아웃
          </text>
          {/* VRAM 전체 바 */}
          <rect x={30} y={36} width={420} height={40} rx={8} fill="var(--muted)" fillOpacity={0.2}
            stroke="var(--border)" strokeWidth={1} />
          <text x={240} y={30} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">22.4 GB</text>
          {/* 모델 가중치 */}
          <motion.rect x={30} y={36} width={180} height={40} rx={8}
            fill="#6366f1" fillOpacity={0.3} stroke="#6366f1" strokeWidth={1}
            initial={{ width: 0 }} animate={{ width: 180 }} transition={{ duration: 0.5 }} />
          <text x={120} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">
            모델 가중치
          </text>
          <text x={120} y={70} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">FP16 기준</text>
          {/* KV 캐시 */}
          <motion.rect x={210} y={36} width={100} height={40}
            fill="#10b981" fillOpacity={0.3} stroke="#10b981" strokeWidth={1}
            initial={{ width: 0 }} animate={{ width: 100 }} transition={{ delay: 0.3, duration: 0.4 }} />
          <text x={260} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">KV 캐시</text>
          <text x={260} y={70} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">seq × batch</text>
          {/* 활성값 */}
          <motion.rect x={310} y={36} width={60} height={40}
            fill="#f59e0b" fillOpacity={0.3} stroke="#f59e0b" strokeWidth={1}
            initial={{ width: 0 }} animate={{ width: 60 }} transition={{ delay: 0.5, duration: 0.3 }} />
          <text x={340} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">활성값</text>
          {/* 여유 */}
          <motion.rect x={370} y={36} width={80} height={40}
            fill="#71717a" fillOpacity={0.1} stroke="#71717a" strokeWidth={0.8} strokeDasharray="4 3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
          <text x={410} y={58} textAnchor="middle" fontSize={9} fill="#71717a">여유</text>
          {/* 하단 설명 */}
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <text x={240} y={105} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
              VRAM 부족 시 발생하는 문제
            </text>
            {[
              { label: 'OOM', detail: 'Out of Memory → 추론 불가', color: '#ef4444', x: 30 },
              { label: '배치=1', detail: '처리량 급감 → 느린 추론', color: '#f59e0b', x: 175 },
              { label: '짧은 seq', detail: '긴 입력 처리 불가', color: '#f59e0b', x: 330 },
            ].map((p, i) => (
              <g key={i}>
                <rect x={p.x} y={118} width={130} height={32} rx={6}
                  fill={p.color} fillOpacity={0.06} stroke={p.color} strokeWidth={0.8} strokeDasharray="4 3" />
                <text x={p.x + 65} y={132} textAnchor="middle" fontSize={9} fontWeight={600} fill={p.color}>{p.label}</text>
                <text x={p.x + 65} y={144} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{p.detail}</text>
              </g>
            ))}
          </motion.g>
          <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            양자화 = 모델 가중치 영역을 축소 → 나머지에 VRAM 배분 가능
          </text>
        </g>
      )}

      {step === 1 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
            정밀도별 메모리 비교 (EXAONE 1.2B)
          </text>
          {[
            { label: 'FP16', bits: 16, mem: 2.4, bar: 360, color: '#6366f1' },
            { label: 'INT8', bits: 8, mem: 1.2, bar: 180, color: '#3b82f6' },
            { label: 'INT4', bits: 4, mem: 0.6, bar: 90, color: '#10b981' },
          ].map((q, i) => (
            <motion.g key={q.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}>
              <text x={25} y={52 + i * 50} fontSize={10} fontWeight={700} fill={q.color}>{q.label}</text>
              <text x={70} y={52 + i * 50} fontSize={8} fill="var(--muted-foreground)">{q.bits}bit</text>
              <rect x={100} y={38 + i * 50} width={q.bar} height={22} rx={4}
                fill={q.color} fillOpacity={0.2} stroke={q.color} strokeWidth={1} />
              <text x={100 + q.bar / 2} y={53 + i * 50} textAnchor="middle" fontSize={9} fontWeight={600} fill={q.color}>
                {q.mem} GB
              </text>
              {/* VRAM 22.4 대비 비율 */}
              <text x={100 + q.bar + 10} y={53 + i * 50} fontSize={8} fill="var(--muted-foreground)">
                {Math.round(q.mem / 22.4 * 100)}% of VRAM
              </text>
            </motion.g>
          ))}
          {/* 남는 VRAM */}
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <text x={240} y={195} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
              남는 VRAM → KV 캐시 확장 → 배치 크기 ↑ → 처리량 ↑
            </text>
            <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              INT4: 22.4 - 0.6 = 21.8GB 여유 → batch 32+ 가능 | FP16: 22.4 - 2.4 = 20GB → batch 16~24
            </text>
          </motion.g>
        </g>
      )}

      {step === 2 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#8b5cf6">
            Pareto Front: 속도 vs 정확도
          </text>
          {/* 축 */}
          <line x1={60} y1={180} x2={440} y2={180} stroke="var(--border)" strokeWidth={1} />
          <line x1={60} y1={180} x2={60} y2={36} stroke="var(--border)" strokeWidth={1} />
          <text x={250} y={198} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            Throughput (tok/s) →
          </text>
          <text x={22} y={108} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
            transform="rotate(-90, 22, 108)">정확도 (PPL ↓) →</text>
          {/* 데이터 포인트 */}
          {[
            { label: 'FP16', x: 120, y: 55, color: '#6366f1', ppl: '12.1', tps: '45' },
            { label: 'INT8', x: 240, y: 65, color: '#3b82f6', ppl: '12.3', tps: '85' },
            { label: 'INT4-GPTQ', x: 340, y: 80, color: '#10b981', ppl: '12.7', tps: '135' },
            { label: 'INT4-RTN', x: 360, y: 120, color: '#f59e0b', ppl: '14.2', tps: '140' },
            { label: 'INT3', x: 400, y: 150, color: '#ef4444', ppl: '18.5', tps: '155' },
          ].map((p, i) => (
            <motion.g key={p.label} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12 }}>
              <circle cx={p.x} cy={p.y} r={6} fill={p.color} fillOpacity={0.3} stroke={p.color} strokeWidth={1.5} />
              <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize={8} fontWeight={600} fill={p.color}>
                {p.label}
              </text>
              <text x={p.x} y={p.y + 16} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                PPL {p.ppl} | {p.tps} t/s
              </text>
            </motion.g>
          ))}
          {/* Pareto front 라인 */}
          <motion.path d="M120,55 Q180,58 240,65 Q290,72 340,80"
            fill="none" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="6 3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }} />
          <text x={200} y={48} fontSize={8} fontWeight={600} fill="#8b5cf6">Pareto Front</text>
          {/* Dominated 영역 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ delay: 1 }}>
            <rect x={320} y={100} width={100} height={70} rx={4} fill="#ef4444" />
          </motion.g>
          <text x={370} y={165} textAnchor="middle" fontSize={7} fill="#ef4444">Dominated (비효율)</text>
        </g>
      )}

      {step === 3 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
            KV 캐시 VRAM 계산
          </text>
          {/* 수식 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <rect x={30} y={34} width={420} height={36} rx={6} fill="#10b981" fillOpacity={0.06}
              stroke="#10b981" strokeWidth={0.8} />
            <text x={240} y={50} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
              KV = 2 × L × d × seq × batch × bytes
            </text>
            <text x={240} y={64} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              2(K+V) × 레이어수 × 히든차원 × 시퀀스길이 × 배치 × 정밀도(바이트)
            </text>
          </motion.g>
          {/* EXAONE 1.2B 예시 */}
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <text x={240} y={92} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
              EXAONE 1.2B: L=24, d=2048
            </text>
          </motion.g>
          {/* 시나리오 테이블 */}
          {[
            { seq: 2048, batch: 1, kv: '0.19', total: '0.79', color: '#10b981' },
            { seq: 2048, batch: 8, kv: '1.5', total: '2.1', color: '#3b82f6' },
            { seq: 4096, batch: 8, kv: '3.0', total: '3.6', color: '#f59e0b' },
            { seq: 8192, batch: 16, kv: '12.0', total: '12.6', color: '#ef4444' },
          ].map((s, i) => (
            <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}>
              <rect x={30} y={100 + i * 24} width={420} height={20} rx={3}
                fill={s.color} fillOpacity={0.04} stroke={s.color} strokeWidth={0.5} />
              <text x={40} y={114 + i * 24} fontSize={8} fill="var(--foreground)">
                seq={s.seq}
              </text>
              <text x={120} y={114 + i * 24} fontSize={8} fill="var(--foreground)">
                batch={s.batch}
              </text>
              <text x={200} y={114 + i * 24} fontSize={8} fontWeight={600} fill={s.color}>
                KV={s.kv}GB
              </text>
              <text x={290} y={114 + i * 24} fontSize={8} fill="var(--muted-foreground)">
                모델+KV={s.total}GB (INT4)
              </text>
              <text x={420} y={114 + i * 24} fontSize={8} fill={s.color}>
                {parseFloat(s.total) <= 22.4 ? '✓' : '⚠ OOM'}
              </text>
            </motion.g>
          ))}
          <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            긴 시퀀스 + 큰 배치에서는 KV 캐시가 모델 가중치보다 더 많은 VRAM 차지
          </text>
        </g>
      )}

      {step === 4 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
            대회 제출 전략: 3단계 의사결정
          </text>
          {/* Step 1 */}
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ActionBox x={30} y={36} w={130} h={48} label="1. PPL 기준 확인" sub="허용 PPL 초과 시 탈락" color="#ef4444" />
            <text x={95} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              INT4-GPTQ PPL 12.7 통과?
            </text>
          </motion.g>
          {/* 화살표 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <line x1={160} y1={60} x2={180} y2={60} stroke="var(--border)" strokeWidth={1.5} />
            <polygon points="178,56 186,60 178,64" fill="var(--muted-foreground)" />
          </motion.g>
          {/* Step 2 */}
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <ActionBox x={186} y={36} w={130} h={48} label="2. 최대 배치 탐색" sub="VRAM 내 최대 batch" color="#3b82f6" />
            <text x={251} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              binary search: 1→2→4→8→...
            </text>
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <line x1={316} y1={60} x2={336} y2={60} stroke="var(--border)" strokeWidth={1.5} />
            <polygon points="334,56 342,60 334,64" fill="var(--muted-foreground)" />
          </motion.g>
          {/* Step 3 */}
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <ActionBox x={342} y={36} w={130} h={48} label="3. Throughput 최적" sub="vLLM 파라미터 튜닝" color="#10b981" />
            <text x={407} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              continuous batching ON
            </text>
          </motion.g>
          {/* 전략 요약 */}
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <rect x={30} y={116} width={420} height={70} rx={8} fill="#f59e0b" fillOpacity={0.05}
              stroke="#f59e0b" strokeWidth={0.8} />
            <text x={240} y={134} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
              추천 전략 (L4 22.4GB + EXAONE 1.2B)
            </text>
            <text x={240} y={150} textAnchor="middle" fontSize={8} fill="var(--foreground)">
              프루닝 20~30% → INT4-GPTQ (128 group) → vLLM continuous batching
            </text>
            <text x={240} y={164} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              모델 0.6GB + KV 캐시 여유 → batch 16~32 → throughput 120~150 tok/s 목표
            </text>
            <text x={240} y={178} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              PPL 기준 초과 시: INT8로 후퇴 (1.2GB, batch 줄이되 정확도 확보)
            </text>
          </motion.g>
        </g>
      )}
    </svg>
  );
}

export default function BudgetViz() {
  return (
    <StepViz steps={steps}>
      {(step) => <Visual step={step} />}
    </StepViz>
  );
}
