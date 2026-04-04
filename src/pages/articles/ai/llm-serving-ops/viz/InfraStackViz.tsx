import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };

const LAYERS = [
  { label: 'Application', sub: 'Chat · RAG · Agent', y: 15, color: '#6366f1' },
  { label: 'LiteLLM Gateway', sub: '라우팅 · 폴백 · 비용추적', y: 68, color: '#3b82f6' },
  { label: 'Kubernetes Cluster', sub: 'HPA · Karpenter · Scheduling', y: 121, color: '#10b981' },
  { label: 'GPU Nodes', sub: 'vLLM · TGI · Triton', y: 174, color: '#f59e0b' },
  { label: 'Observability', sub: 'Prometheus · Grafana · Alerts', y: 227, color: '#8b5cf6' },
];

const STEPS = [
  { label: 'Application 요청', body: '사용자 앱(Chat, RAG, Agent)에서 LLM 호출 발생\n→ OpenAI-compatible API 형식으로 요청' },
  { label: 'Gateway 라우팅', body: 'LiteLLM이 모델·비용·가용성 기반으로\n최적 프로바이더 선택 및 요청 라우팅' },
  { label: 'K8s 스케줄링', body: 'Kubernetes가 GPU 리소스 기반으로\nPod 배치 및 오토스케일링 결정' },
  { label: 'GPU 추론 실행', body: 'vLLM/TGI가 GPU에서 모델 추론 수행\nPagedAttention으로 KV 캐시 최적화' },
  { label: '관측 피드백 루프', body: 'TTFT, TPS, GPU% 메트릭 수집\n→ 이상 탐지 → 자동 스케일링/폴백' },
];

export default function InfraStackViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const active = i <= step;
            const current = i === step;
            return (
              <motion.g key={l.label} animate={{ opacity: active ? 1 : 0.2 }} transition={sp}>
                <rect x={80} y={l.y} width={280} height={42} rx={6}
                  fill={current ? `${l.color}18` : `${l.color}08`}
                  stroke={l.color} strokeWidth={current ? 2 : 0.8} />
                <text x={220} y={l.y + 18} textAnchor="middle" fontSize={12}
                  fontWeight={700} fill={l.color}>{l.label}</text>
                <text x={220} y={l.y + 33} textAnchor="middle" fontSize={10}
                  fill={l.color} opacity={0.7}>{l.sub}</text>
                {i < 4 && (
                  <text x={220} y={l.y + 55} textAnchor="middle" fontSize={12}
                    fill="var(--muted-foreground)" opacity={active ? 0.5 : 0.15}>↓</text>
                )}
              </motion.g>
            );
          })}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <path d="M76,248 L40,248 L40,142 L76,142" fill="none"
                stroke="#8b5cf6" strokeWidth={1.2} strokeDasharray="4 2"
                markerEnd="url(#arrowPurple)" />
              <text x={28} y={198} fontSize={10} fill="#8b5cf6"
                transform="rotate(-90,28,198)" textAnchor="middle">피드백</text>
            </motion.g>
          )}
          <motion.circle r={5}
            animate={{ cx: 70, cy: LAYERS[Math.min(step, 4)].y + 21 }}
            transition={sp} fill={LAYERS[Math.min(step, 4)].color} />
          <defs>
            <marker id="arrowPurple" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#8b5cf6" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
