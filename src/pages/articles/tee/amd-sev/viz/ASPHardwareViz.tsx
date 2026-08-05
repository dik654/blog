import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const C = {
  cpu: '#6366f1',
  asp: '#8b5cf6',
  mc: '#0ea5e9',
  crypto: '#10b981',
  iface: '#f59e0b',
};

const STEPS = [
  { label: 'EPYC die — x86 코어와 ASP 공존', body: '같은 실리콘에 x86 코어 + ARM Cortex-A5 ASP 통합' },
  { label: 'ASP CPU/메모리 — 32-bit RISC + 자체 SRAM', body: '500MHz~1GHz, 64KB~256KB SRAM, AMD-서명 boot ROM' },
  { label: 'Crypto 가속기 — AES/SHA/RSA/ECDSA/TRNG', body: 'SEV에 필요한 모든 암호 연산 하드웨어 가속' },
  { label: 'Interfaces — mailbox + shared DRAM + eFUSE', body: 'x86와 통신 채널 + chip-unique secrets 접근' },
];

export default function ASPHardwareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <motion.rect x={20} y={26} width={440} height={196} rx={10}
            fill="var(--card)" stroke={C.cpu} strokeWidth={1}
            animate={{ opacity: step === 0 ? 1 : 0.6 }} />
          <text x={240} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.cpu}>EPYC CPU Die</text>

          {/* x86 cores */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.4 }}>
            <ModuleBox x={40} y={56} w={150} h={50} label="x86 Cores" sub="Zen N" color={C.cpu} />
          </motion.g>

          {/* ASP block */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.7 }}>
            <ModuleBox x={210} y={56} w={230} h={50} label="ASP (ARM Cortex-A5)" sub="32-bit RISC, 500MHz~1GHz" color={C.asp} />
            {step === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DataBox x={210} y={114} w={75} h={22} label="Boot ROM" color={C.asp} outlined />
                <DataBox x={290} y={114} w={75} h={22} label="SRAM 64-256K" color={C.asp} outlined />
                <DataBox x={370} y={114} w={70} h={22} label="ARM A5 core" color={C.asp} outlined />
              </motion.g>
            )}
          </motion.g>

          {/* Crypto block */}
          <motion.g animate={{ opacity: step === 2 ? 1 : 0.3 }}>
            <ModuleBox x={40} y={144} w={400} h={48} label="Crypto Engines (ASP 내부)" sub="AES · SHA · RSA · ECDSA · HMAC · TRNG" color={C.crypto} />
            {step === 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {['AES-128/256', 'SHA-256/384', 'RSA 2048/4096', 'ECDSA P-256/384', 'TRNG'].map((label, i) => (
                  <motion.g key={label}
                    initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                    <DataBox x={50 + i * 78} y={166} w={75} h={22} label={label} color={C.crypto} outlined />
                  </motion.g>
                ))}
              </motion.g>
            )}
          </motion.g>

          {/* Memory controller */}
          <motion.g animate={{ opacity: step >= 3 ? 1 : 0.3 }}>
            <ModuleBox x={40} y={198} w={170} h={20} label="Memory Controller + AES" sub="" color={C.mc} />
            <DataBox x={220} y={200} w={100} h={16} label="Mailbox" color={C.iface} outlined />
            <DataBox x={325} y={200} w={50} h={16} label="DRAM" color={C.iface} outlined />
            <DataBox x={380} y={200} w={60} h={16} label="eFUSE" color={C.iface} outlined />
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
