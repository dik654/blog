import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STACK = [
  { name: 'Kubernetes Pod', sub: 'user workload', color: '#3b82f6' },
  { name: 'Kata Agent', sub: 'inside Realm', color: '#06b6d4' },
  { name: 'Realm Guest', sub: 'Linux 6.x + CCA', color: '#10b981' },
  { name: 'RMM (TF-RMM)', sub: 'EL2 Realm', color: '#f59e0b' },
  { name: 'Host Hypervisor', sub: 'cloud-hypervisor', color: '#8b5cf6' },
  { name: 'Host Kernel + KVM-CCA', sub: 'arch/arm64/kvm', color: '#ec4899' },
];

const STEPS = [
  { name: 'Attestation Agent', sub: 'CCA token 요청', color: '#10b981' },
  { name: 'KBS', sub: 'Key Broker 검증', color: '#f59e0b' },
  { name: '복호화 키 전달', sub: 'EAT pass', color: '#06b6d4' },
  { name: 'Pod 실행 시작', sub: 'container live', color: '#3b82f6' },
];

export default function CocoStackViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 320" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Confidential Containers (Kata) + ARM CCA</text>

        {STACK.map((s, i) => (
          <motion.g key={s.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}>
            <ModuleBox x={150} y={32 + i * 30} w={180} h={26}
              label={s.name} sub={s.sub} color={s.color} />
          </motion.g>
        ))}

        <text x={240} y={225} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="var(--foreground)">증명 연동 흐름</text>

        {STEPS.map((s, i) => (
          <motion.g key={s.name}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}>
            <DataBox x={15 + i * 117} y={240} w={108} h={42}
              label={s.name} sub={s.sub} color={s.color} outlined />
          </motion.g>
        ))}

        <text x={240} y={305} textAnchor="middle" fontSize={6.5} fontStyle="italic"
          fill="var(--muted-foreground)">
          TDX CoCo와 동일 KBS 재사용 가능 — EAT 포맷 호환
        </text>
      </svg>
    </div>
  );
}
