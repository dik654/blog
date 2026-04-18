import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';
import { ModuleBox, DataBox, StatusBox, ActionBox } from '@/components/viz/boxes';

const steps: StepDef[] = [
  {
    label: '3축 평가 프레임워크',
    body: '모델 경량화 결과는 반드시 3가지 축으로 평가: 크기(메모리), 속도(처리량), 정확도(품질). 한 축만 보면 함정에 빠진다.',
  },
  {
    label: 'Perplexity 측정 방법',
    body: 'PPL = exp(평균 cross-entropy loss). 낮을수록 좋다. WikiText-2 또는 C4 데이터셋으로 측정. 양자화 전후 비교가 핵심.',
  },
  {
    label: '추론 Throughput 측정',
    body: 'tokens/sec = 생성된 총 토큰 / 총 시간. prefill(입력 처리)과 decode(토큰 생성)를 분리 측정해야 병목을 정확히 파악.',
  },
  {
    label: '메모리 사용량 프로파일링',
    body: 'nvidia-smi는 순간값만 표시. torch.cuda.max_memory_allocated()로 피크 사용량을 측정해야 OOM을 예방.',
  },
  {
    label: 'vLLM 실측: 서빙 환경 벤치마크',
    body: 'vLLM의 continuous batching으로 실제 서빙 성능 측정. --max-model-len, --gpu-memory-utilization 파라미터가 throughput 결정.',
  },
];

function Visual({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {step === 0 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
            3축 평가 프레임워크
          </text>
          {/* 삼각형 축 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {/* 삼각형 */}
            <polygon points="240,42 80,180 400,180" fill="none" stroke="var(--border)" strokeWidth={1} />
            {/* 크기 축 (상단) */}
            <circle cx={240} cy={42} r={22} fill="#6366f1" fillOpacity={0.15} stroke="#6366f1" strokeWidth={1.5} />
            <text x={240} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill="#6366f1">크기</text>
            <text x={240} y={52} textAnchor="middle" fontSize={7} fill="#6366f1">MB/GB</text>
            {/* 속도 축 (좌하) */}
            <circle cx={80} cy={180} r={22} fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
            <text x={80} y={178} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">속도</text>
            <text x={80} y={190} textAnchor="middle" fontSize={7} fill="#10b981">tok/s</text>
            {/* 정확도 축 (우하) */}
            <circle cx={400} cy={180} r={22} fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1.5} />
            <text x={400} y={178} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">정확도</text>
            <text x={400} y={190} textAnchor="middle" fontSize={7} fill="#ef4444">PPL</text>
          </motion.g>
          {/* 모델 위치 */}
          {[
            { label: 'FP16 원본', x: 300, y: 120, color: '#6366f1' },
            { label: 'INT8', x: 220, y: 140, color: '#3b82f6' },
            { label: 'INT4-GPTQ', x: 180, y: 125, color: '#10b981' },
            { label: 'INT4-RTN', x: 140, y: 155, color: '#f59e0b' },
          ].map((m, i) => (
            <motion.g key={m.label} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.12 }}>
              <circle cx={m.x} cy={m.y} r={4} fill={m.color} />
              <rect x={m.x - 30} y={m.y - 18} width={60} height={14} rx={7} fill="var(--card)"
                stroke={m.color} strokeWidth={0.8} />
              <text x={m.x} y={m.y - 8} textAnchor="middle" fontSize={7} fontWeight={600} fill={m.color}>
                {m.label}
              </text>
            </motion.g>
          ))}
          <text x={240} y={212} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            이상적 위치: 삼각형 중심에 가까울수록 균형 잡힌 경량화
          </text>
        </g>
      )}

      {step === 1 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
            Perplexity(PPL) 측정
          </text>
          {/* 수식 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <rect x={60} y={32} width={360} height={32} rx={6} fill="#ef4444" fillOpacity={0.05}
              stroke="#ef4444" strokeWidth={0.8} />
            <text x={240} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
              PPL = exp( -1/N × Σ log P(wᵢ | w₁...wᵢ₋₁) )
            </text>
            <text x={240} y={58} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
              N=토큰수, P=모델 예측 확률. 낮을수록 모델이 텍스트를 잘 예측
            </text>
          </motion.g>
          {/* PPL 비교 바 차트 */}
          <text x={240} y={82} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
            EXAONE 1.2B — WikiText-2 PPL
          </text>
          {[
            { label: 'FP16', ppl: 12.1, w: 121, color: '#6366f1' },
            { label: 'INT8', ppl: 12.3, w: 123, color: '#3b82f6' },
            { label: 'INT4-GPTQ', ppl: 12.7, w: 127, color: '#10b981' },
            { label: 'INT4-AWQ', ppl: 12.5, w: 125, color: '#10b981' },
            { label: 'INT4-RTN', ppl: 14.2, w: 142, color: '#f59e0b' },
            { label: 'INT3', ppl: 18.5, w: 185, color: '#ef4444' },
          ].map((q, i) => (
            <motion.g key={q.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}>
              <text x={95} y={100 + i * 18} textAnchor="end" fontSize={8} fontWeight={600} fill={q.color}>
                {q.label}
              </text>
              <rect x={100} y={90 + i * 18} width={q.w * 1.6} height={13} rx={3}
                fill={q.color} fillOpacity={0.2} stroke={q.color} strokeWidth={0.8} />
              <text x={100 + q.w * 1.6 + 5} y={100 + i * 18} fontSize={8} fill="var(--muted-foreground)">
                {q.ppl}
              </text>
            </motion.g>
          ))}
          <text x={240} y={208} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            GPTQ/AWQ: 보정 데이터 사용 → RTN 대비 PPL 1.5+ 개선 | INT3: 실용 한계
          </text>
        </g>
      )}

      {step === 2 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
            추론 Throughput 측정
          </text>
          {/* 두 단계 분리 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <rect x={20} y={36} width={200} height={55} rx={8} fill="#3b82f6" fillOpacity={0.06}
              stroke="#3b82f6" strokeWidth={1} />
            <text x={120} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">Prefill</text>
            <text x={120} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              입력 토큰 병렬 처리
            </text>
            <text x={120} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              compute-bound (GPU 연산 병목)
            </text>
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <line x1={220} y1={63} x2={250} y2={63} stroke="var(--border)" strokeWidth={1.5} />
            <polygon points="248,59 256,63 248,67" fill="var(--muted-foreground)" />
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <rect x={260} y={36} width={200} height={55} rx={8} fill="#10b981" fillOpacity={0.06}
              stroke="#10b981" strokeWidth={1} />
            <text x={360} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">Decode</text>
            <text x={360} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              토큰 하나씩 생성
            </text>
            <text x={360} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              memory-bound (대역폭 병목)
            </text>
          </motion.g>
          {/* Throughput 비교 */}
          <text x={240} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
            Decode Throughput (tok/s) — 배치 8, seq 2048
          </text>
          {[
            { label: 'FP16', tps: 45, w: 90, color: '#6366f1' },
            { label: 'INT8', tps: 85, w: 170, color: '#3b82f6' },
            { label: 'INT4', tps: 135, w: 270, color: '#10b981' },
          ].map((q, i) => (
            <motion.g key={q.label} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.12 }}>
              <text x={70} y={128 + i * 22} textAnchor="end" fontSize={9} fontWeight={600} fill={q.color}>
                {q.label}
              </text>
              <motion.rect x={80} y={118 + i * 22} width={0} height={16} rx={3}
                fill={q.color} fillOpacity={0.2} stroke={q.color} strokeWidth={0.8}
                initial={{ width: 0 }} animate={{ width: q.w }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }} />
              <text x={80 + q.w + 8} y={130 + i * 22} fontSize={8} fontWeight={600} fill={q.color}>
                {q.tps} tok/s
              </text>
            </motion.g>
          ))}
          <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            INT4: 가중치 메모리 대역폭 1/4 → decode 단계에서 ~3x 속도 향상
          </text>
          <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            prefill은 compute-bound → 양자화 효과 작음. decode가 핵심 병목
          </text>
        </g>
      )}

      {step === 3 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
            메모리 프로파일링 방법
          </text>
          {/* nvidia-smi vs torch */}
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <rect x={20} y={36} width={210} height={75} rx={8} fill="#ef4444" fillOpacity={0.05}
              stroke="#ef4444" strokeWidth={0.8} strokeDasharray="4 3" />
            <text x={125} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">nvidia-smi</text>
            <text x={125} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              순간 할당량만 표시
            </text>
            <text x={125} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              피크를 놓칠 수 있음
            </text>
            <text x={125} y={98} textAnchor="middle" fontSize={8} fill="#ef4444">
              ⚠ 부정확 — OOM 예측 불가
            </text>
          </motion.g>
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <rect x={250} y={36} width={210} height={75} rx={8} fill="#10b981" fillOpacity={0.05}
              stroke="#10b981" strokeWidth={1} />
            <text x={355} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
              torch.cuda
            </text>
            <text x={355} y={66} textAnchor="middle" fontSize={8} fill="var(--foreground)">
              max_memory_allocated()
            </text>
            <text x={355} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              프로세스 생애 피크 추적
            </text>
            <text x={355} y={98} textAnchor="middle" fontSize={8} fill="#10b981">
              ✓ 정확한 피크 VRAM 측정
            </text>
          </motion.g>
          {/* 프로파일 타임라인 */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <text x={240} y={130} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
              VRAM 사용 타임라인
            </text>
            {/* 축 */}
            <line x1={50} y1={195} x2={440} y2={195} stroke="var(--border)" strokeWidth={0.8} />
            <line x1={50} y1={195} x2={50} y2={140} stroke="var(--border)" strokeWidth={0.8} />
            {/* 사용량 곡선 */}
            <motion.path
              d="M50,185 L100,180 L150,175 L180,160 L200,145 L210,155 L250,165 L300,170 L350,172 L400,175 L440,178"
              fill="none" stroke="#3b82f6" strokeWidth={1.5}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }} />
            {/* 피크 표시 */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              <line x1={200} y1={145} x2={200} y2={140} stroke="#ef4444" strokeWidth={1} strokeDasharray="2 2" />
              <circle cx={200} cy={145} r={3} fill="#ef4444" />
              <text x={200} y={138} textAnchor="middle" fontSize={7} fontWeight={600} fill="#ef4444">피크</text>
            </motion.g>
            <text x={130} y={207} fontSize={7} fill="var(--muted-foreground)">모델 로드</text>
            <text x={200} y={207} fontSize={7} fill="var(--muted-foreground)">prefill</text>
            <text x={320} y={207} fontSize={7} fill="var(--muted-foreground)">decode</text>
          </motion.g>
        </g>
      )}

      {step === 4 && (
        <g>
          <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#8b5cf6">
            vLLM 서빙 벤치마크 설정
          </text>
          {/* vLLM 파라미터 */}
          <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ModuleBox x={140} y={32} w={200} h={40} label="vLLM Server" sub="continuous batching" color="#8b5cf6" />
          </motion.g>
          {/* 핵심 파라미터 */}
          {[
            { param: '--quantization gptq', desc: 'INT4 GPTQ 커널 활성화', color: '#10b981' },
            { param: '--max-model-len 4096', desc: '최대 시퀀스 길이 제한', color: '#3b82f6' },
            { param: '--gpu-memory-utilization 0.9', desc: 'VRAM 90%까지 사용', color: '#f59e0b' },
            { param: '--enforce-eager', desc: 'CUDA graph 비활성 (디버그)', color: '#71717a' },
          ].map((p, i) => (
            <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}>
              <rect x={30} y={82 + i * 26} width={420} height={22} rx={4}
                fill={p.color} fillOpacity={0.04} stroke={p.color} strokeWidth={0.5} />
              <text x={42} y={96 + i * 26} fontSize={9} fontWeight={600} fill={p.color}
                fontFamily="monospace">{p.param}</text>
              <text x={290} y={96 + i * 26} fontSize={8} fill="var(--muted-foreground)">{p.desc}</text>
            </motion.g>
          ))}
          {/* 벤치마크 명령어 */}
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <rect x={30} y={192} width={420} height={22} rx={4} fill="var(--muted)" fillOpacity={0.3}
              stroke="var(--border)" strokeWidth={0.6} />
            <text x={240} y={207} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
              python benchmark_serving.py --model path --num-prompts 100 --request-rate 10
            </text>
          </motion.g>
        </g>
      )}
    </svg>
  );
}

export default function BenchmarkViz() {
  return (
    <StepViz steps={steps}>
      {(step) => <Visual step={step} />}
    </StepViz>
  );
}
