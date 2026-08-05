import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { AlertBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. 단순 메모리 읽기 — Host kernel이 TEE 페이지 접근 (SGX abort, SEV/TDX random)' },
  { label: '2. DMA 공격 — 악성 PCIe 디바이스 직접 메모리 읽기 (IOMMU/SMMU로 차단)' },
  { label: '3. Memory remapping — Hypervisor 페이지 테이블 조작 (S-EPT/RMP/EPCM)' },
  { label: '4. Cold boot — DRAM freezing 후 추출 (AES 암호화로 95%+ 방어)' },
  { label: '5. Memory bus probing — 물리 프로브 (90%+ 방어, trace 패턴 일부 leak)' },
  { label: '6. Side channels — cache/timing 추론 (대부분 TEE 방어 불가)' },
];

const ATTACKS: { color: string; title: string; mech: string; defense: string; level: number }[] = [
  {
    color: '#10b981',
    title: '단순 메모리 읽기',
    mech: 'Host kernel이 TEE 페이지 접근',
    defense: 'SGX abort page / SEV·TDX random bytes',
    level: 1,
  },
  {
    color: '#10b981',
    title: 'DMA 공격',
    mech: '악성 PCIe 디바이스로 메모리 직접 읽기',
    defense: 'IOMMU (SGX/TDX) / SMMU (CCA)',
    level: 1,
  },
  {
    color: '#10b981',
    title: 'Memory remapping',
    mech: 'Hypervisor가 페이지 테이블 조작',
    defense: 'S-EPT (TDX) / RMP (SNP) / EPCM (SGX)',
    level: 1,
  },
  {
    color: '#0ea5e9',
    title: 'Cold boot attack',
    mech: 'DRAM freezing 후 다른 머신으로 이식',
    defense: 'AES 암호화 (키는 CPU 내부)',
    level: 0.95,
  },
  {
    color: '#0ea5e9',
    title: 'Memory bus probing',
    mech: '물리 프로브로 메모리 버스 모니터',
    defense: '암호화된 트래픽만 (trace 일부 leak)',
    level: 0.9,
  },
  {
    color: '#ef4444',
    title: 'Side channels',
    mech: 'Cache/timing 패턴으로 추론',
    defense: '범위 밖 — 앱 레벨 대응 필수',
    level: 0.2,
  },
];

export default function AttackerViewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const a = ATTACKS[step];
        return (
          <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={a.color}>
              공격 #{step + 1}: {a.title}
            </text>
            <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <AlertBox x={40} y={50} w={200} h={70}
                label="공격 메커니즘" sub={a.mech} color="#ef4444" />
              <text x={250} y={88} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ModuleBox x={280} y={50} w={200} h={70}
                label="HW 방어" sub={a.defense} color={a.color} />
            </motion.g>
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}>
              <StatusBox x={120} y={150} w={280} h={50}
                label={`방어 효과 ${(a.level * 100).toFixed(0)}%`}
                sub={a.level === 1 ? '완전 차단' : a.level >= 0.9 ? '거의 완벽' : '부분적 방어'}
                color={a.color} progress={a.level} />
            </motion.g>
          </svg>
        );
      }}
    </StepViz>
  );
}
