import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

type Variant = 'gateway' | 'gpu' | 'deployment' | 'observability';

const sp = { type: 'spring' as const, bounce: 0.18, duration: 0.55 };

const CONFIG = {
  gateway: {
    title: 'LiteLLM control plane',
    accent: '#3b82f6',
    lanes: ['Client', 'Policy', 'Router', 'Provider', 'Telemetry'],
    steps: [
      { label: 'Virtual key 인증', body: '요청이 들어오면 user/team/project 단위 권한과 budget을 먼저 확인한다.' },
      { label: 'Model alias 해석', body: 'chat-fast 같은 논리 모델명을 실제 model group 후보로 확장한다.' },
      { label: '라우팅 결정', body: 'latency, cost, health, capability, region 상태를 동시에 평가한다.' },
      { label: 'Fallback/cooldown', body: 'provider 429, timeout, overload를 구분해 retry, fallback, cooldown을 다르게 적용한다.' },
      { label: '비용·품질 피드백', body: 'token, cost, route, fallback, eval 결과를 다음 라우팅 정책의 입력으로 남긴다.' },
    ],
    metrics: ['fallback rate', 'cost / team', 'provider p95'],
  },
  gpu: {
    title: 'GPU fleet feedback loop',
    accent: '#10b981',
    lanes: ['Queue', 'Scheduler', 'Node Pool', 'GPU', 'Autoscaler'],
    steps: [
      { label: '수요 감지', body: '대기 요청, TTFT 상승, queue depth가 capacity 부족 신호가 된다.' },
      { label: 'SKU 선택', body: '모델 크기, VRAM, interconnect, MIG 정책에 따라 가능한 노드 풀을 고른다.' },
      { label: 'Pod 배치', body: 'taint, affinity, GPU limit, topology 정책으로 serving pod를 배치한다.' },
      { label: 'GPU 포화 관측', body: 'DCGM, KV cache pressure, SM util, memory util을 함께 본다.' },
      { label: 'Scale/drain', body: 'Karpenter warm pool, scale-down drain, quota/chargeback으로 fleet을 닫힌 루프로 운영한다.' },
    ],
    metrics: ['SM util', 'VRAM free', 'scale latency'],
  },
  deployment: {
    title: 'Serving release gate',
    accent: '#f59e0b',
    lanes: ['Artifact', 'Warmup', 'Readiness', 'Traffic', 'Rollback'],
    steps: [
      { label: 'Artifact 고정', body: 'weight, tokenizer, chat template, quantization, engine args를 하나의 release로 묶는다.' },
      { label: 'Model warmup', body: 'image pull, weight load, KV allocation, sample generation을 traffic 전에 완료한다.' },
      { label: 'Readiness gate', body: '프로세스 생존이 아니라 실제 첫 토큰 생성 가능성을 readiness 기준으로 둔다.' },
      { label: 'Canary/shadow', body: 'latency, JSON validity, tool success, quality eval을 route별로 비교한다.' },
      { label: 'Rollback 조건', body: 'TTFT, timeout, 품질 회귀, cost burn이 기준을 넘으면 gateway route와 deployment를 되돌린다.' },
    ],
    metrics: ['TTFT canary', 'JSON valid', 'rollback SLO'],
  },
  observability: {
    title: 'AIOps incident graph',
    accent: '#8b5cf6',
    lanes: ['SLO', 'Gateway', 'Engine', 'GPU/K8s', 'Automation'],
    steps: [
      { label: 'SLO 위반', body: 'availability, TTFT, output TPS, error budget이 사용자 영향의 첫 신호다.' },
      { label: 'Route 분해', body: 'model group, provider, deployment, fallback 여부로 gateway 증상을 나눈다.' },
      { label: 'Engine 병목', body: 'queue wait, prefill/decode ratio, KV cache, timeout으로 vLLM 상태를 본다.' },
      { label: 'Fleet 원인', body: 'node condition, device plugin, DCGM, pod readiness를 통해 인프라 원인을 좁힌다.' },
      { label: '자동 조치 검증', body: 'scale, fallback, rate limit, rollback을 실행한 뒤 같은 SLO 쿼리로 효과를 확인한다.' },
    ],
    metrics: ['error budget', 'queue wait', 'auto action audit'],
  },
} as const;

function wrapText(text: string, maxChars = 52): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

export default function ServingOpsDeepViz({ variant }: { variant: Variant }) {
  const cfg = CONFIG[variant];

  return (
    <StepViz steps={[...cfg.steps]}>
      {(step) => {
        const activeX = 44 + step * 108;
        return (
          <svg viewBox="0 0 590 260" className="w-full max-w-3xl" style={{ height: 'auto' }}>
            <rect x={8} y={8} width={574} height={244} rx={8}
              fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
            <text x={24} y={32} fontSize={13} fontWeight={700} fill="var(--foreground)">
              {cfg.title}
            </text>
            <text x={565} y={32} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">
              live operating model
            </text>

            {cfg.lanes.map((lane, i) => {
              const x = 38 + i * 108;
              const active = i <= step;
              const current = i === step;
              return (
                <motion.g key={lane} animate={{ opacity: active ? 1 : 0.28 }} transition={sp}>
                  <rect x={x} y={56} width={84} height={46} rx={6}
                    fill={current ? `${cfg.accent}18` : `${cfg.accent}08`}
                    stroke={current ? cfg.accent : 'var(--border)'}
                    strokeWidth={current ? 2 : 1} />
                  <text x={x + 42} y={82} textAnchor="middle" fontSize={11} fontWeight={700}
                    fill={current ? cfg.accent : 'var(--foreground)'}>
                    {lane}
                  </text>
                  {i < cfg.lanes.length - 1 && (
                    <line x1={x + 86} y1={79} x2={x + 104} y2={79}
                      stroke={active ? cfg.accent : 'var(--border)'} strokeWidth={1.5}
                      markerEnd="url(#arr)" />
                  )}
                </motion.g>
              );
            })}

            <motion.circle initial={false} r={7} animate={{ cx: activeX + 42, cy: 126 }}
              transition={sp} fill={cfg.accent} />
            <motion.path
              d={`M${activeX + 42},134 C${activeX + 42},156 508,156 508,112`}
              fill="none" stroke={cfg.accent} strokeWidth={1.4} strokeDasharray="5 4"
              animate={{ opacity: step === 4 ? 0.85 : 0.2 }}
              transition={sp} />

            <motion.g key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={38} y={150} width={524} height={62} rx={7}
                fill={`${cfg.accent}0f`} stroke={`${cfg.accent}55`} strokeWidth={1} />
              <text x={56} y={176} fontSize={13} fontWeight={700} fill={cfg.accent}>
                {cfg.steps[step].label}
              </text>
              <text x={56} y={197} fontSize={11} fill="var(--muted-foreground)">
                {wrapText(cfg.steps[step].body).map((line, i) => (
                  <tspan key={line} x={56} dy={i === 0 ? 0 : 15}>{line}</tspan>
                ))}
              </text>
            </motion.g>

            <g>
              {cfg.metrics.map((metric, i) => (
                <motion.g key={metric} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <rect x={38 + i * 173} y={224} width={150} height={18} rx={4}
                    fill="var(--muted)" opacity={0.22} />
                  <text x={113 + i * 173} y={237} textAnchor="middle" fontSize={10}
                    fill="var(--muted-foreground)">
                    {metric}
                  </text>
                </motion.g>
              ))}
            </g>

            <defs>
              <marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7" fill={cfg.accent} />
              </marker>
            </defs>
          </svg>
        );
      }}
    </StepViz>
  );
}
