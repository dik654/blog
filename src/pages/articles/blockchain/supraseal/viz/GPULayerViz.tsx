import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const LAYERS = [
  { label: 'CPU (64코어)', items: ['SHA-256 PC1', 'C1 포함증명', 'Orchestrator'], color: '#6366f1' },
  { label: 'NVMe (16x)', items: ['SPDK 직접제어', '스트라이핑', 'F2FS'], color: '#10b981' },
  { label: 'GPU (RTX 4090)', items: ['Poseidon PC2', 'MSM/NTT C2', '64 스트림'], color: '#f59e0b' },
  { label: 'Memory (512GB)', items: ['Huge Pages 1GB', 'NUMA 인식', 'DMA 고정'], color: '#ec4899' },
];

const BODIES = [
  'CPU, NVMe, GPU, Memory가 파이프라인으로 협력하는 전체 구조입니다.',
  'SHA-256 PC1 해싱, C1 포함 증명 생성, 전체 오케스트레이션을 담당합니다.',
  'SPDK로 커널 우회 직접 제어. 16개 드라이브 스트라이핑으로 IOPS를 확보합니다.',
  'Poseidon PC2, MSM/NTT C2를 CUDA 64 스트림으로 병렬 처리합니다.',
];
const STEPS = [
  { label: 'GPU 파이프라인' },
  { label: 'CPU 레이어' },
  { label: 'NVMe 레이어' },
  { label: 'GPU 레이어' },
];

export default function GPULayerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="max-w-2xl">
        <div className="grid grid-cols-2 gap-2">
          {LAYERS.map((layer, li) => {
            const active = step === 0 || step === li + 1;
            return (
              <motion.div key={layer.label}
                className="rounded-lg border p-2"
                animate={{
                  opacity: active ? 1 : 0.15,
                  borderColor: active ? layer.color : 'var(--border)',
                }} transition={sp}>
                <div className="text-[11px] font-bold mb-1" style={{ color: layer.color }}>
                  {layer.label}
                </div>
                {layer.items.map((item) => (
                  <div key={item} className="text-[10px] text-muted-foreground">
                    {item}
                  </div>
                ))}
              </motion.div>
            );
          })}
        </div>
        <motion.p className="text-[11px] mt-2 text-muted-foreground/80"
          initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>
          {BODIES[step]}
        </motion.p>
        </div>
      )}
    </StepViz>
  );
}
