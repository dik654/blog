import { motion } from 'framer-motion';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

export default function MecOptionViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 250" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">MEC — Memory Encryption Contexts (FEAT_MEC, ARMv9.4)</text>

        <ModuleBox x={20} y={35} w={140} h={50}
          label="기본 RME" sub="격리만 (GPT)" color="#3b82f6" />
        <ModuleBox x={170} y={35} w={140} h={50}
          label="RME + MEC" sub="격리 + DRAM 암호화" color="#10b981" />
        <ModuleBox x={320} y={35} w={140} h={50}
          label="GPT entry + MECID" sub="per-Realm key" color="#f59e0b" />

        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          <DataBox x={20} y={110} w={210} h={36}
            label="AES-XTS + per-Realm KeyID"
            sub="MKTME / SEV-SNP 유사" color="#06b6d4" outlined />
          <DataBox x={250} y={110} w={210} h={36}
            label="메모리 컨트롤러가 key 선택"
            sub="GPT entry MECID 비트" color="#8b5cf6" outlined />
        </motion.g>

        <text x={240} y={170} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="var(--foreground)">초기 CCA 실리콘 현황</text>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <DataBox x={50} y={185} w={170} h={28}
            label="Neoverse V3" sub="MEC 미포함 (RME만)"
            color="#94a3b8" />
          <DataBox x={260} y={185} w={170} h={28}
            label="차세대" sub="MEC 통합 예정"
            color="#10b981" outlined />
        </motion.g>

        <AlertBox x={120} y={222} w={240} h={22}
          label="MEC 없으면 cold boot 공격 가능"
          color="#ef4444" />
      </svg>
    </div>
  );
}
