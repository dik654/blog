import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = {
  ns: '#0ea5e9',
  sec: '#10b981',
  bus: '#8b5cf6',
  smc: '#f59e0b',
  warn: '#ef4444',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'NS bit — AXI 버스가 운반하는 1비트 보안 신호' },
  { label: 'NS=0 (Secure World) — 모든 메모리 접근 가능 (superset)' },
  { label: 'NS=1 (Normal World) — Secure 영역 접근 시 bus fault' },
  { label: 'World 전환 — SMC 명령으로 EL3 Monitor 거쳐 이동' },
];

function NsBitWire({ active }: { active: boolean }) {
  return (
    <motion.g animate={{ opacity: active ? 1 : 0.25 }} transition={sp}>
      <text x={240} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.bus}>
        AXI Bus Transaction
      </text>
      <rect x={60} y={60} width={360} height={22} rx={4} fill={`${C.bus}10`} stroke={`${C.bus}50`} strokeWidth={0.7} />
      {['ADDR', 'DATA', 'CTRL', 'NS'].map((seg, i) => (
        <g key={seg}>
          <rect x={70 + i * 88} y={64} width={80} height={14} rx={2} fill={i === 3 ? `${C.bus}30` : 'transparent'} stroke={`${C.bus}50`} strokeWidth={0.6} />
          <text x={110 + i * 88} y={74} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={i === 3 ? C.bus : 'var(--muted-foreground)'}>{seg}</text>
        </g>
      ))}
    </motion.g>
  );
}

function MemoryAccessRow({ from, target, ok, y, sub, active }: {
  from: string; target: string; ok: boolean; y: number; sub: string; active: boolean;
}) {
  const color = ok ? C.sec : C.warn;
  return (
    <motion.g animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
      <rect x={50} y={y} width={120} height={26} rx={5} fill={`${color}10`} stroke={`${color}50`} strokeWidth={0.8} />
      <text x={110} y={y + 12} textAnchor="middle" fontSize={9} fontWeight={700} fill={color}>{from}</text>
      <text x={110} y={y + 22} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">CPU 측</text>
      <line x1={170} y1={y + 13} x2={310} y2={y + 13} stroke={color} strokeWidth={1} strokeDasharray={ok ? '0' : '3 2'} />
      <polygon points={`${310},${y + 13} ${304},${y + 10} ${304},${y + 16}`} fill={color} />
      <text x={240} y={y + 8} textAnchor="middle" fontSize={7.5} fill={color} fontWeight={600}>{ok ? 'OK' : 'BUS FAULT'}</text>
      <rect x={310} y={y} width={130} height={26} rx={5} fill={`${color}10`} stroke={`${color}50`} strokeWidth={0.8} />
      <text x={375} y={y + 12} textAnchor="middle" fontSize={9} fontWeight={700} fill={color}>{target}</text>
      <text x={375} y={y + 22} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{sub}</text>
    </motion.g>
  );
}

function WorldSwitchDiagram({ active }: { active: boolean }) {
  return (
    <motion.g animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
      <ModuleBox x={170} y={42} w={140} h={32} label="EL3 Monitor" sub="Secure Monitor" color={C.smc} />
      <line x1={120} y1={120} x2={200} y2={78} stroke={C.smc} strokeWidth={1} markerEnd="url(#arr)" />
      <line x1={360} y1={120} x2={280} y2={78} stroke={C.smc} strokeWidth={1} markerEnd="url(#arr)" />
      <text x={150} y={102} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.smc}>SMC #</text>
      <text x={330} y={102} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.smc}>SMC #</text>
      <ModuleBox x={50} y={120} w={140} h={42} label="Normal World" sub="Linux + Apps" color={C.ns} />
      <ModuleBox x={290} y={120} w={140} h={42} label="Secure World" sub="OP-TEE + TAs" color={C.sec} />
      <text x={120} y={172} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">EL2/EL1/EL0</text>
      <text x={360} y={172} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">S-EL1/S-EL0</text>
    </motion.g>
  );
}

export default function TrustZoneNsBitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arr" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={6} markerHeight={6} orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={C.smc} />
            </marker>
          </defs>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            ARM TrustZone — NS bit 기반 격리
          </text>
          {step === 0 && <NsBitWire active />}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <DataBox x={50} y={120} w={170} h={36} label="ARMv6 (2003) 도입" sub="모든 현대 ARM Cortex-A 지원" color={C.ns} />
              <DataBox x={260} y={120} w={170} h={36} label="버스가 NS 신호 운반" sub="메모리·페리페럴이 NS로 검사" color={C.bus} />
            </motion.g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.sec}>NS = 0 (Secure CPU 상태)</text>
              <MemoryAccessRow from="Secure CPU" target="Secure DRAM" ok y={70} sub="0x3F800000+" active />
              <MemoryAccessRow from="Secure CPU" target="Normal DRAM" ok y={108} sub="superset 접근" active />
              <MemoryAccessRow from="Secure CPU" target="Secure 페리페럴" ok y={146} sub="UART/Crypto" active />
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ns}>NS = 1 (Normal CPU 상태)</text>
              <MemoryAccessRow from="Normal CPU" target="Normal DRAM" ok y={70} sub="Linux 영역" active />
              <MemoryAccessRow from="Normal CPU" target="Secure DRAM" ok={false} y={108} sub="data abort 발생" active />
              <MemoryAccessRow from="Normal CPU" target="Secure 페리페럴" ok={false} y={146} sub="TZPC가 거부" active />
            </g>
          )}
          {step === 3 && <WorldSwitchDiagram active />}
        </svg>
      )}
    </StepViz>
  );
}
