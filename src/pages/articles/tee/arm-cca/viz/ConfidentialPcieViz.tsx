import { motion } from 'framer-motion';
import { DataBox, ModuleBox, ActionBox } from '@/components/viz/boxes';

const TECH = [
  { name: 'PCIe TDISP', desc: 'TEE ↔ device 상호 인증', spec: 'PCIe 6.0 (2024)', color: '#3b82f6' },
  { name: 'IDE', desc: 'PCIe link AES-GCM', spec: 'Integrity + Encryption', color: '#10b981' },
  { name: 'CXL 3.1 CC', desc: '메모리 풀링 + 기밀성', spec: 'CXL.mem ↔ TEE', color: '#8b5cf6' },
];

export default function ConfidentialPcieViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 250" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Confidential PCIe / CXL — 진행 중인 표준</text>

        {TECH.map((t, i) => (
          <motion.g key={t.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}>
            <ModuleBox x={20 + i * 155} y={35} w={140} h={70}
              label={t.name} sub={t.desc} color={t.color} />
            <text x={90 + i * 155} y={120} textAnchor="middle" fontSize={6.5}
              fontFamily="monospace" fill="var(--muted-foreground)">{t.spec}</text>
          </motion.g>
        ))}

        <text x={240} y={150} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="var(--foreground)">ARM CCA + TDISP 통합 시나리오</text>

        <DataBox x={20} y={165} w={130} h={36}
          label="NIC을 Realm에 할당"
          color="#3b82f6" outlined />
        <DataBox x={170} y={165} w={130} h={36}
          label="직접 DMA (no bounce)"
          color="#10b981" outlined />
        <DataBox x={320} y={165} w={140} h={36}
          label="NIC firmware 측정 포함"
          color="#f59e0b" outlined />

        <ActionBox x={20} y={215} w={210} h={28}
          label="Nvidia H100 — Hopper CC" sub="이미 production"
          color="#76b900" />
        <ActionBox x={250} y={215} w={210} h={28}
          label="Arm + Nvidia 협업 진행 중" sub="2024~"
          color="#8b5cf6" />
      </svg>
    </div>
  );
}
