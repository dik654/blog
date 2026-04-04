import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };

const NODES = [
  { label: 'A100 ×4', x: 20, y: 50, color: '#10b981', gpus: 4 },
  { label: 'A100 ×4', x: 180, y: 50, color: '#10b981', gpus: 4 },
  { label: 'T4 ×2', x: 340, y: 50, color: '#f59e0b', gpus: 2 },
];

const PODS: { n: number; g: number; label: string }[][] = [
  [],
  [{ n: 0, g: 0, label: '70B' }],
  [{ n: 0, g: 0, label: '70B' }, { n: 0, g: 2, label: '70B' }],
  [{ n: 0, g: 0, label: '70B' }, { n: 0, g: 2, label: '70B' }, { n: 2, g: 0, label: '7B' }],
  [{ n: 0, g: 0, label: '70B' }, { n: 0, g: 2, label: '70B' }, { n: 2, g: 0, label: '7B' }, { n: 1, g: 0, label: '70B' }],
];

const STEPS = [
  { label: 'GPU 노드 풀 구성', body: 'GPU 타입별 노드 풀 분리\nA100: 대형 모델 / T4: 경량 모델 서빙' },
  { label: 'Device Plugin 탐지', body: 'NVIDIA Device Plugin이 각 노드의 GPU 탐지\n→ nvidia.com/gpu 리소스로 등록' },
  { label: 'Pod 스케줄링', body: 'resources.limits: nvidia.com/gpu: 2\n→ GPU 여유 있는 노드에 자동 배치' },
  { label: '멀티 모델 배치', body: '모델 크기에 맞는 노드 풀에 Pod 배치\nnodeSelector + tolerations로 격리' },
  { label: 'Karpenter 스케일아웃', body: '대기 Pod 감지 → 새 GPU 노드 프로비저닝\n→ Pod 스케줄 → running 전환' },
];

export default function GPUFleetViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 175" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <rect x={5} y={5} width={490} height={165} rx={8}
            fill="none" stroke="var(--muted-foreground)" strokeWidth={0.6} strokeDasharray="4 2" />
          <text x={15} y={22} fontSize={11} fontWeight={600} fill="var(--muted-foreground)">K8s Cluster</text>

          {NODES.map((node, ni) => {
            const isNew = step === 4 && ni === 1;
            return (
              <motion.g key={ni} animate={{ opacity: 1 }} transition={sp}>
                <rect x={node.x} y={node.y} width={145} height={80} rx={5}
                  fill={isNew ? `${node.color}15` : `${node.color}08`}
                  stroke={node.color} strokeWidth={isNew ? 2 : 0.8} />
                <text x={node.x + 72} y={node.y + 18} textAnchor="middle" fontSize={11}
                  fontWeight={600} fill={node.color}>{node.label}</text>
                {Array.from({ length: node.gpus }).map((_, gi) => (
                  <rect key={gi} x={node.x + 10 + gi * 30} y={node.y + 28} width={26} height={18} rx={3}
                    fill="var(--muted)" opacity={0.15} stroke={node.color} strokeWidth={0.5} />
                ))}
                {isNew && (
                  <motion.text x={node.x + 72} y={node.y - 8} textAnchor="middle" fontSize={10}
                    fill="#10b981" fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Karpenter ↑
                  </motion.text>
                )}
              </motion.g>
            );
          })}

          {step >= 1 && PODS[Math.min(step, 4)].map((pod, pi) => {
            const node = NODES[pod.n];
            return (
              <motion.g key={pi} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: pi * 0.15 }}>
                <rect x={node.x + 10 + pod.g * 30} y={node.y + 28} width={56} height={18} rx={3}
                  fill={`${node.color}30`} stroke={node.color} strokeWidth={1.2} />
                <text x={node.x + 38 + pod.g * 30} y={node.y + 41} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={node.color}>{pod.label}</text>
              </motion.g>
            );
          })}

          {step >= 1 && (
            <motion.text x={250} y={158} textAnchor="middle" fontSize={10}
              fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
              nvidia-device-plugin DaemonSet → nvidia.com/gpu 리소스 등록
            </motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
