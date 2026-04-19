import { motion } from 'framer-motion';
import { DataBox, ActionBox } from '@/components/viz/boxes';

const REMS = [
  { i: 0, name: 'REM[0]', use: 'kernel 측정', color: '#3b82f6' },
  { i: 1, name: 'REM[1]', use: 'initrd / rootfs', color: '#06b6d4' },
  { i: 2, name: 'REM[2]', use: '동적 코드 (JIT, plugin)', color: '#8b5cf6' },
  { i: 3, name: 'REM[3]', use: '앱 정의 (free)', color: '#10b981' },
];

export default function RemExtendViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 240" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">REM[0..3] — Runtime Extendable Measurements</text>

        <ActionBox x={20} y={35} w={130} h={50}
          label="Realm Guest" sub="HVC #0 (RSI)" color="#10b981" />
        <ActionBox x={330} y={35} w={130} h={50}
          label="rsi_measurement_extend" sub="runtime/rsi/measurement.c" color="#f59e0b" />

        <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
          x1={150} y1={60} x2={330} y2={60}
          stroke="#8b5cf6" strokeWidth={1.4} />
        <text x={240} y={56} textAnchor="middle" fontSize={7} fontWeight={600}
          fill="#8b5cf6">RSI_MEASUREMENT_EXTEND(index, size, data...)</text>

        <text x={240} y={108} textAnchor="middle" fontSize={8} fontWeight={600}
          fill="var(--muted-foreground)">
          buffer = rd-&gt;rem[index] ‖ data → SHA-512 → rem[index]
        </text>

        {REMS.map((r, idx) => (
          <motion.g key={r.i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}>
            <DataBox x={25 + idx * 110} y={130} w={100} h={36}
              label={r.name} color={r.color} outlined />
            <text x={75 + idx * 110} y={186} textAnchor="middle" fontSize={6.5}
              fill="var(--muted-foreground)">{r.use}</text>
          </motion.g>
        ))}

        <text x={240} y={215} textAnchor="middle" fontSize={7} fontStyle="italic"
          fill="var(--muted-foreground)">
          TPM PCR 유사 · Intel TDX RTMR 대응 · Realm이 자유롭게 확장
        </text>
      </svg>
    </div>
  );
}
