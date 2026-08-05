import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const HANDLERS = [
  { id: 'VERSION', target: 'RMI_ABI_VERSION 반환', color: '#3b82f6' },
  { id: 'GRANULE_DELEGATE', target: 'smc_granule_delegate(arg0)', color: '#06b6d4' },
  { id: 'REALM_CREATE', target: 'smc_realm_create(arg0, arg1)', color: '#10b981' },
  { id: 'DATA_CREATE', target: 'smc_data_create(arg0, ...)', color: '#f59e0b' },
  { id: 'REC_ENTER', target: 'smc_rec_enter(arg0, arg1)', color: '#8b5cf6' },
];

export default function RmiDispatcherViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 290" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">handle_ns_smc — RMI Dispatcher (runtime/core/handler.c)</text>

        <ModuleBox x={170} y={28} w={140} h={42}
          label="handle_ns_smc()" sub="40+ leaf 핸들러" color="#10b981" />

        <DataBox x={20} y={36} w={130} h={28}
          label="function_id (X0)" color="#3b82f6" outlined />

        <text x={240} y={88} textAnchor="middle" fontSize={8.5} fontWeight={600}
          fill="var(--muted-foreground)">switch (function_id) → 분기</text>

        {HANDLERS.map((h, i) => (
          <motion.g key={h.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}>
            <DataBox x={25} y={105 + i * 32} w={170} h={26}
              label={`SMC_RMI_${h.id}`} color={h.color} outlined />
            <ActionBox x={210} y={105 + i * 32} w={250} h={26}
              label={h.target} color={h.color} />
          </motion.g>
        ))}

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <ActionBox x={20} y={272} w={440} h={14}
            label="default → RMI_ERROR_NOT_SUPPORTED" color="#ef4444" />
        </motion.g>
      </svg>
    </div>
  );
}
