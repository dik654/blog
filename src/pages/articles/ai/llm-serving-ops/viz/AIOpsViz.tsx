import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };

const PIPELINE = [
  { label: 'vLLM Metrics', sub: 'TTFT · TPS · GPU%', x: 5, color: '#6366f1' },
  { label: 'Prometheus', sub: 'TSDB', x: 130, color: '#3b82f6' },
  { label: 'Grafana', sub: 'Dashboard', x: 260, color: '#10b981' },
  { label: 'AlertManager', sub: 'Rules', x: 390, color: '#ef4444' },
];

const METRICS = [
  { label: 'TTFT', value: '120ms', y: 80 },
  { label: 'TPS', value: '45 t/s', y: 98 },
  { label: 'GPU%', value: '78%', y: 116 },
];

const STEPS = [
  { label: '메트릭 수집', body: 'vLLM이 /metrics 엔드포인트 노출\nTTFT, TPS, GPU 사용률' },
  { label: 'Prometheus 스크래핑', body: 'ServiceMonitor가 vLLM Pod 자동 탐지\n15초 간격 스크래핑 → 시계열 저장' },
  { label: 'Grafana 시각화', body: '실시간 대시보드: 요청별 레이턴시 분포\nP50/P95/P99 TTFT 히트맵' },
  { label: '이상 탐지 · 알럿', body: 'TTFT P95 > 500ms 5분 지속 → PagerDuty\nGPU% > 85% → Slack 경고' },
  { label: 'AIOps 자동 대응', body: '알럿 → K8s HPA 스케일아웃 트리거\n비용 초과 → LiteLLM 저비용 모델 폴백' },
];

export default function AIOpsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PIPELINE.map((p, i) => {
            const active = i <= step;
            const current = i === step || (step === 4 && i === 3);
            return (
              <motion.g key={p.label} animate={{ opacity: active ? 1 : 0.2 }} transition={sp}>
                <rect x={p.x} y={12} width={110} height={42} rx={5}
                  fill={current ? `${p.color}15` : `${p.color}08`}
                  stroke={p.color} strokeWidth={current ? 2 : 0.8} />
                <text x={p.x + 55} y={30} textAnchor="middle" fontSize={10}
                  fontWeight={700} fill={p.color}>{p.label}</text>
                <text x={p.x + 55} y={45} textAnchor="middle" fontSize={9}
                  fill={p.color} opacity={0.6}>{p.sub}</text>
                {i < PIPELINE.length - 1 && (
                  <text x={p.x + 117} y={36} fontSize={11}
                    fill="var(--muted-foreground)" opacity={active ? 0.5 : 0.15}>→</text>
                )}
              </motion.g>
            );
          })}

          {step === 0 && METRICS.map((m, i) => (
            <motion.g key={m.label} initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
              transition={{ ...sp, delay: i * 0.1 }}>
              <text x={20} y={m.y} fontSize={10} fill="#6366f1" fontWeight={600}>{m.label}</text>
              <text x={60} y={m.y} fontSize={10} fill="var(--muted-foreground)">{m.value}</text>
            </motion.g>
          ))}

          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={395} y={62} width={110} height={24} rx={4}
                fill="#ef444415" stroke="#ef4444" strokeWidth={1} />
              <text x={450} y={78} textAnchor="middle" fontSize={10} fill="#ef4444">
                TTFT P95 {'>'} 500ms
              </text>
            </motion.g>
          )}

          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <path d="M450,88 L450,110 L320,110 L320,58" fill="none"
                stroke="#10b981" strokeWidth={1.2} strokeDasharray="4 2"
                markerEnd="url(#arrGrn2)" />
              <text x={390} y={130} textAnchor="middle" fontSize={10} fill="#10b981">
                자동 스케일링 트리거
              </text>
              <rect x={140} y={100} width={100} height={22} rx={4}
                fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.8} />
              <text x={190} y={115} textAnchor="middle" fontSize={10} fill="#3b82f6">
                LiteLLM 폴백
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="arrGrn2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#10b981" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
