import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };

const STAGES = [
  { label: 'Model Store', sub: 'S3 / PVC', x: 10, color: '#6366f1' },
  { label: 'Init Container', sub: 'Download', x: 125, color: '#3b82f6' },
  { label: 'vLLM Pod', sub: 'Serving', x: 245, color: '#10b981' },
  { label: 'HPA', sub: 'Scale', x: 365, color: '#f59e0b' },
];

const REPLICAS = [[1], [1], [1], [1, 2], [1, 2, 3]];

const STEPS = [
  { label: '모델 아티팩트 준비', body: '모델 가중치를 S3 버킷 또는 PVC에 저장\n→ safetensors 포맷으로 용량 최소화' },
  { label: 'Init Container 로딩', body: 'Pod 시작 시 init container가 모델 다운로드\n→ emptyDir volume에 캐시' },
  { label: 'vLLM Pod Ready', body: '모델 로딩 완료 → GPU 메모리에 가중치 적재\n→ readinessProbe 통과 → Service 등록' },
  { label: 'HPA 스케일아웃', body: 'gpu_utilization > 70%\n→ HPA가 replica 수 증가 결정' },
  { label: 'Rolling Update', body: 'maxSurge=1, maxUnavailable=0\n→ 새 Pod Ready 확인 후 기존 Pod 종료' },
];

export default function DeploymentViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {STAGES.map((s, i) => {
            const active = i <= step;
            const current = i === step;
            return (
              <motion.g key={s.label} animate={{ opacity: active ? 1 : 0.2 }} transition={sp}>
                <rect x={s.x} y={15} width={100} height={42} rx={5}
                  fill={current ? `${s.color}15` : `${s.color}08`}
                  stroke={s.color} strokeWidth={current ? 2 : 0.8} />
                <text x={s.x + 50} y={33} textAnchor="middle" fontSize={11}
                  fontWeight={700} fill={s.color}>{s.label}</text>
                <text x={s.x + 50} y={48} textAnchor="middle" fontSize={10}
                  fill={s.color} opacity={0.6}>{s.sub}</text>
                {i < STAGES.length - 1 && (
                  <text x={s.x + 110} y={40} fontSize={12}
                    fill="var(--muted-foreground)" opacity={active ? 0.5 : 0.15}>→</text>
                )}
              </motion.g>
            );
          })}

          {step >= 2 && REPLICAS[Math.min(step, 4)].map((r, i) => (
            <motion.g key={r} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: i * 0.2 }}>
              <rect x={245 + i * 34} y={70} width={30} height={24} rx={4}
                fill="#10b98120" stroke="#10b981" strokeWidth={1} />
              <text x={260 + i * 34} y={86} textAnchor="middle" fontSize={10}
                fill="#10b981" fontWeight={600}>P{r}</text>
            </motion.g>
          ))}

          {step >= 3 && (
            <motion.text x={390} y={100} textAnchor="middle" fontSize={10} fill="#f59e0b"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              GPU% {'>'} 70% → scale
            </motion.text>
          )}

          {step === 4 && (
            <motion.text x={250} y={125} fontSize={10} fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              maxSurge=1 · maxUnavailable=0 → zero-downtime
            </motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
