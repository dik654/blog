import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

export default function ProtectedIpaSplitViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 270" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Realm IPA 공간 — Protected vs Unprotected</text>

        {/* Range bars */}
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <ModuleBox x={20} y={35} w={210} h={50}
            label="Protected IPA" sub="0 .. 2^(ipa_bits-1)" color="#10b981" />
          <text x={125} y={102} textAnchor="middle" fontSize={6.5}
            fontFamily="monospace" fill="var(--muted-foreground)">
            Realm granule (Realm PAS) only
          </text>

          <ModuleBox x={250} y={35} w={210} h={50}
            label="Unprotected IPA" sub="2^(ipa_bits-1) .. 2^ipa_bits"
            color="#06b6d4" />
          <text x={355} y={102} textAnchor="middle" fontSize={6.5}
            fontFamily="monospace" fill="var(--muted-foreground)">
            NS granule (Host shared)
          </text>
        </motion.g>

        <text x={240} y={130} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="var(--foreground)">예: ipa_bits = 40</text>

        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}>
          <DataBox x={20} y={140} w={210} h={28}
            label="0x00_0000_0000 .. 0x7f_ffff_ffff" color="#10b981" outlined />
          <DataBox x={250} y={140} w={210} h={28}
            label="0x80_0000_0000 .. 0xff_ffff_ffff" color="#06b6d4" outlined />
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <ActionBox x={20} y={185} w={210} h={32}
            label="private_buf"
            sub="phys_to_virt(0x40000000)" color="#10b981" />
          <ActionBox x={250} y={185} w={210} h={32}
            label="shared_buf (DMA, virtio)"
            sub="phys_to_virt(0x8040000000)" color="#06b6d4" />
        </motion.g>

        <ActionBox x={20} y={228} w={440} h={36}
          label="rmi_rtt_map_unprotected(rd, unprot_ipa, level, host_pa)"
          sub="Stage 2 엔트리 NS=1 → Host 메모리(GPT=NS) 바인딩"
          color="#8b5cf6" />
      </svg>
    </div>
  );
}
