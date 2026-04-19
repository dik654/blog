import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, ModuleBox, DataBox } from '@/components/viz/boxes';

const C = {
  init: '#8b5cf6',
  start: '#0ea5e9',
  update: '#10b981',
  vmsa: '#f59e0b',
  measure: '#ef4444',
  finish: '#6366f1',
};

const STEPS = [
  { label: '① SEV_CMD_INIT — Platform 초기화 (한번)', body: 'PEK 생성, ASP 초기화' },
  { label: '② LAUNCH_START — Guest context 할당', body: '새 ASID + VEK 생성, handle 반환' },
  { label: '③ LAUNCH_UPDATE_DATA — 페이지 암호화', body: '각 초기 페이지를 VEK로 암호화 + 측정 누적' },
  { label: '④ LAUNCH_UPDATE_VMSA (SEV-ES) — vCPU 상태', body: 'VMSA 페이지도 암호화' },
  { label: '⑤ LAUNCH_MEASURE — 측정값 확보', body: '누적된 SHA-256(launch digest) 반환' },
  { label: '⑥ LAUNCH_FINISH — VM 실행 준비', body: 'frozen 상태로 vCPU 시작 가능' },
];

const CMDS = [
  { label: 'SEV_CMD_INIT', sub: 'PEK 생성', color: C.init },
  { label: 'LAUNCH_START', sub: 'ASID + VEK', color: C.start },
  { label: 'LAUNCH_UPDATE_DATA', sub: '페이지 × N', color: C.update },
  { label: 'LAUNCH_UPDATE_VMSA', sub: 'vCPU 상태', color: C.vmsa },
  { label: 'LAUNCH_MEASURE', sub: 'digest 반환', color: C.measure },
  { label: 'LAUNCH_FINISH', sub: 'frozen', color: C.finish },
];

export default function VMCreateSequenceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {CMDS.map((c, i) => {
            const active = step === i;
            const past = step > i;
            const x = 20 + (i % 3) * 150;
            const y = 26 + Math.floor(i / 3) * 60;
            return (
              <motion.g key={c.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: active ? 1 : past ? 0.55 : 0.25, y: 0 }}
                transition={{ delay: i * 0.04 }}>
                <ActionBox x={x} y={y} w={140} h={50} label={c.label} sub={c.sub} color={c.color} />
                {past && (
                  <motion.text x={x + 130} y={y + 14} fontSize={9} fontWeight={700} fill={c.color}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    ✓
                  </motion.text>
                )}
              </motion.g>
            );
          })}

          <motion.g key={`detail-${step}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            {step === 0 && (
              <DataBox x={20} y={158} w={440} h={50} label="ASP가 platform key 준비 — 한 번만 호출" color={C.init} outlined />
            )}
            {step === 1 && (
              <>
                <DataBox x={20} y={158} w={140} h={50} label="alloc ASID = 3" color={C.start} outlined />
                <DataBox x={170} y={158} w={140} h={50} label="generate VEK (16B)" color={C.start} outlined />
                <DataBox x={320} y={158} w={140} h={50} label="return handle" color={C.start} outlined />
              </>
            )}
            {step === 2 && (
              <DataBox x={20} y={158} w={440} h={50} label="for each page: VEK 암호화 + measurement_chain += SHA(page_info)" color={C.update} />
            )}
            {step === 3 && (
              <DataBox x={20} y={158} w={440} h={50} label="VMSA(레지스터 저장 영역)도 암호화 — SEV-ES부터" color={C.vmsa} />
            )}
            {step === 4 && (
              <DataBox x={20} y={158} w={440} h={50} label="measurement = SHA-256(VEK-encrypted pages) → owner 검증" color={C.measure} />
            )}
            {step === 5 && (
              <ModuleBox x={20} y={158} w={440} h={50} label="frozen — vCPU 실행 준비 완료" sub="이후 변경 불가" color={C.finish} />
            )}
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
