import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const DIRS = [
  { name: 'lib/arch/', desc: 'ARM 아키텍처 인터페이스', color: '#3b82f6' },
  { name: 'lib/realm/', desc: 'Realm 데이터 구조', color: '#10b981' },
  { name: 'lib/rmm_el3_ifc/', desc: 'EL3(Monitor) 통신', color: '#ef4444' },
  { name: 'plat/', desc: '플랫폼별 (fvp, arm)', color: '#f59e0b' },
  { name: 'runtime/core/', desc: 'RMI 핸들러', color: '#8b5cf6' },
  { name: 'runtime/rsi/', desc: 'RSI 핸들러', color: '#06b6d4' },
  { name: 'runtime/exit/', desc: 'Realm exit 처리', color: '#ec4899' },
];

export default function TfRmmTreeViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">TF-RMM 모듈 구조 (github.com/TF-RMM/tf-rmm)</text>

        <ModuleBox x={170} y={32} w={140} h={42}
          label="TF-RMM" sub="EL2 Realm firmware" color="#10b981" />

        <text x={240} y={92} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">아키텍처 독립 · BSD-3 · C 구현</text>

        {DIRS.map((d, i) => {
          const x = 25 + (i % 4) * 110;
          const y = 110 + Math.floor(i / 4) * 75;
          return (
            <motion.g key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}>
              <DataBox x={x} y={y} w={100} h={32}
                label={d.name} color={d.color} outlined />
              <text x={x + 50} y={y + 50} textAnchor="middle" fontSize={6.5}
                fill="var(--muted-foreground)">{d.desc}</text>
            </motion.g>
          );
        })}

        <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.5 }}
          x1={240} y1={75} x2={240} y2={105}
          stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
      </svg>
    </div>
  );
}
