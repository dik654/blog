import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

export default function SmcHvcCompareViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">SMC vs HVC — 호출 경로 비교</text>

        <defs>
          <marker id="sh-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* SMC path */}
        <text x={120} y={40} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="#3b82f6">SMC (Secure Monitor Call)</text>

        <ModuleBox x={20} y={50} w={90} h={36}
          label="Host EL2" sub="Non-secure" color="#3b82f6" />
        <ModuleBox x={130} y={50} w={90} h={36}
          label="Monitor EL3" sub="TF-A" color="#ef4444" />

        <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.4 }}
          x1={110} y1={68} x2={130} y2={68}
          stroke="#3b82f6" strokeWidth={1.4} markerEnd="url(#sh-arr)" />
        <text x={120} y={102} textAnchor="middle" fontSize={6.5} fontFamily="monospace"
          fill="var(--muted-foreground)">arm_smccc_1_1_smc()</text>

        <ModuleBox x={20} y={120} w={200} h={32}
          label="→ delegate to RMM" sub="Monitor가 RMM 진입" color="#f59e0b" />

        <DataBox x={20} y={165} w={200} h={28}
          label="rmi_realm_create()" color="#3b82f6" outlined />

        {/* HVC path */}
        <text x={360} y={40} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="#10b981">HVC (Hypervisor Call)</text>

        <ModuleBox x={260} y={50} w={90} h={36}
          label="Realm EL1" sub="Realm Guest" color="#10b981" />
        <ModuleBox x={370} y={50} w={90} h={36}
          label="RMM EL2" sub="직접 진입" color="#f59e0b" />

        <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          x1={350} y1={68} x2={370} y2={68}
          stroke="#10b981" strokeWidth={1.4} markerEnd="url(#sh-arr)" />
        <text x={360} y={102} textAnchor="middle" fontSize={6.5} fontFamily="monospace"
          fill="var(--muted-foreground)">asm hvc #0</text>

        <ModuleBox x={260} y={120} w={200} h={32}
          label="→ EL3 안 거침" sub="HVC는 EL2로 직접" color="#10b981" />

        <DataBox x={260} y={165} w={200} h={28}
          label="rsi_call(fid, ...)" color="#10b981" outlined />

        {/* Footer compare */}
        <rect x={20} y={210} width={440} height={60} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.4} />
        <text x={240} y={228} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="var(--foreground)">호출자 권한이 곧 경계</text>
        <text x={240} y={245} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">Host(EL2 NS)는 SMC만 가능 — Realm(EL1)은 HVC만 가능</text>
        <text x={240} y={260} textAnchor="middle" fontSize={6.5} fontStyle="italic"
          fill="var(--muted-foreground)">CPU 인스트럭션 권한 검사가 1차 방어 (실수 호출 차단)</text>
      </svg>
    </div>
  );
}
