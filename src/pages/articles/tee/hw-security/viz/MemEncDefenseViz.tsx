import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '✓ Cold Boot Attack — DRAM 동결 후 이식, 키는 CPU OFF시 사라짐 → 복호화 불가' },
  { label: '✓ Bus Snooping — 버스에 logic analyzer, 관찰 = 암호문만' },
  { label: '✓ DRAM Probe — 칩에 물리 프로브, 추출 = 암호문' },
  { label: '✓ Rowhammer (부분) — 비트 플립 시 random byte 복호화, MAC 있으면 탐지' },
  { label: '✗ Cache Side Channel — CPU 캐시 평문, Prime+Probe 가능' },
  { label: '✗ Transient Execution (Spectre) — 투기 실행이 메모리 접근 패턴 유도' },
  { label: '✗ EM Analysis — 전력·EM 방사로 키 추출, 물리 접근 + 고가 장비' },
  { label: '✗ Software Vulnerabilities — Guest OS 버그, kernel exploit, SW 공격은 별개' },
];

const ATTACKS: { kind: 'def' | 'undef'; title: string; mech: string; result: string }[] = [
  { kind: 'def', title: 'Cold Boot Attack', mech: 'DRAM 동결 후 다른 머신 이식', result: 'CPU OFF 시 키 휘발 → 복호화 불가' },
  { kind: 'def', title: 'Bus Snooping', mech: '버스에 logic analyzer 부착', result: '관찰되는 것은 암호문만' },
  { kind: 'def', title: 'DRAM Probe', mech: '물리 프로브 + nation-state 장비', result: '추출 = 암호문 (키 부재)' },
  { kind: 'def', title: 'Rowhammer (부분)', mech: 'DRAM 셀 비트 플립 공격', result: 'MAC 있으면 탐지 가능' },
  { kind: 'undef', title: 'Cache Side Channel', mech: 'Prime+Probe, Flush+Reload', result: '캐시 평문 → 패턴 추론 가능' },
  { kind: 'undef', title: 'Transient Execution', mech: 'Spectre/Meltdown 패밀리', result: '투기 실행으로 캐시 leak' },
  { kind: 'undef', title: 'Electromagnetic', mech: 'CPU 전력·EM 방사 측정', result: '키 추출 가능 (고가 장비)' },
  { kind: 'undef', title: 'Software Vuln', mech: 'Guest OS 버그, kernel exploit', result: '메모리 암호화 범위 외' },
];

export default function MemEncDefenseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const a = ATTACKS[step];
        const color = a.kind === 'def' ? '#10b981' : '#ef4444';
        const icon = a.kind === 'def' ? '✓' : '✗';
        return (
          <svg viewBox="0 0 520 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
              {icon} {a.title}
            </text>
            <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <AlertBox x={40} y={50} w={200} h={80}
                label="공격 방식" sub={a.mech} color="#ef4444" />
              <text x={250} y={94} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ModuleBox x={280} y={50} w={200} h={80}
                label={a.kind === 'def' ? '메모리 암호화 방어' : '방어 불가'}
                sub={a.result} color={color} />
            </motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <text x={260} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
                {a.kind === 'def'
                  ? '메모리 암호화의 핵심 가치 — 물리 공격 차단'
                  : '메모리 암호화 범위 밖 — 별도 대응 필요'}
              </text>
            </motion.g>
          </svg>
        );
      }}
    </StepViz>
  );
}
