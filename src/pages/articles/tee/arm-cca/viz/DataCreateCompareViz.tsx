import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

export default function DataCreateCompareViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">DATA_CREATE vs DATA_CREATE_UNKNOWN</text>

        {/* DATA_CREATE column */}
        <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
          <ModuleBox x={20} y={32} w={210} h={42}
            label="DATA_CREATE" sub="측정 포함 (RIM extend)" color="#10b981" />

          <DataBox x={25} y={88} w={200} h={28}
            label="Realm 상태: NEW만" color="#10b981" outlined />

          <ActionBox x={25} y={124} w={200} h={26}
            label="copy_from_ns(data, src)" color="#3b82f6" />
          <ActionBox x={25} y={156} w={200} h={26}
            label="rim_extend(desc + content)" color="#8b5cf6" />
          <ActionBox x={25} y={188} w={200} h={26}
            label="rtt_map_data(rd, ipa, data)" color="#06b6d4" />

          <DataBox x={45} y={228} w={160} h={28}
            label="용도: 초기 코드/데이터" color="#10b981" outlined />
        </motion.g>

        {/* DATA_CREATE_UNKNOWN column */}
        <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}>
          <ModuleBox x={250} y={32} w={210} h={42}
            label="DATA_CREATE_UNKNOWN" sub="측정 무관" color="#f59e0b" />

          <DataBox x={255} y={88} w={200} h={28}
            label="Realm 상태: ACTIVE 허용" color="#f59e0b" outlined />

          <ActionBox x={255} y={124} w={200} h={26}
            label="memset(data, 0, PAGE_SIZE)" color="#94a3b8" />
          <ActionBox x={255} y={156} w={200} h={26}
            label="(측정 없음)" color="#cbd5e1" />
          <ActionBox x={255} y={188} w={200} h={26}
            label="rtt_map_data(rd, ipa, data)" color="#06b6d4" />

          <DataBox x={275} y={228} w={160} h={28}
            label="용도: 런타임 heap/swap" color="#f59e0b" outlined />
        </motion.g>

        <text x={240} y={272} textAnchor="middle" fontSize={6.5} fontStyle="italic"
          fill="var(--muted-foreground)">
          UNKNOWN은 RSI_IPA_STATE_SET으로 Realm이 Accept 의사 표시 필요
        </text>
      </svg>
    </div>
  );
}
