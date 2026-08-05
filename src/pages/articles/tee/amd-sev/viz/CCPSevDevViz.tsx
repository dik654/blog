import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  probe: '#8b5cf6',
  dev: '#0ea5e9',
  fops: '#10b981',
  cmd: '#f59e0b',
};

const STEPS = [
  { label: 'sev_platform_probe — sp_device 연결', body: 'devm_kzalloc + io_map (MMIO 레지스터)' },
  { label: '/dev/sev character device 등록', body: 'misc_register(&sev_misc_dev) → 사용자공간 진입점' },
  { label: 'sev_fops — unlocked_ioctl만 노출', body: 'open/read/write 없이 ioctl 단일 인터페이스' },
  { label: 'sev_ioctl dispatch — ~20개 cmd', body: 'FACTORY_RESET / PLATFORM_STATUS / PEK_CERT_IMPORT / GET_ID 등' },
];

const CMDS = [
  { id: 'FACTORY_RESET', sub: 'platform 초기화' },
  { id: 'PLATFORM_STATUS', sub: '현재 상태' },
  { id: 'PEK_CERT_IMPORT', sub: 'OCA cert' },
  { id: 'GET_ID', sub: 'chip ID' },
];

export default function CCPSevDevViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">
            drivers/crypto/ccp/sev-dev.c — CCP 드라이버
          </text>

          <motion.g animate={{ opacity: step === 0 ? 1 : 0.3 }}>
            <ModuleBox x={20} y={26} w={210} h={50} label="sev_platform_probe" sub="probe(sp_device)" color={C.probe} />
            {step === 0 && (
              <DataBox x={250} y={32} w={210} h={20} label="devm_kzalloc + io_map" color={C.probe} outlined />
            )}
            {step === 0 && (
              <DataBox x={250} y={56} w={210} h={20} label="sev_platform_init(&error)" color={C.probe} outlined />
            )}
          </motion.g>

          <motion.g animate={{ opacity: step === 1 ? 1 : 0.3 }}>
            <ActionBox x={20} y={86} w={210} h={42} label="misc_register" sub="/dev/sev 노출" color={C.dev} />
            {step === 1 && (
              <DataBox x={250} y={92} w={210} h={32} label="userspace 진입점 = char device" color={C.dev} outlined />
            )}
          </motion.g>

          <motion.g animate={{ opacity: step === 2 ? 1 : 0.3 }}>
            <ModuleBox x={20} y={138} w={210} h={42} label="sev_fops" sub="file_operations" color={C.fops} />
            {step === 2 && (
              <DataBox x={250} y={144} w={210} h={32} label=".unlocked_ioctl = sev_ioctl (단일)" color={C.fops} outlined />
            )}
          </motion.g>

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <text x={20} y={200} fontSize={9} fontWeight={700} fill={C.cmd}>주요 ioctl 명령</text>
              {CMDS.map((c, i) => (
                <motion.g key={c.id}
                  initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <DataBox x={20 + i * 115} y={196} w={108} h={20} label={c.id} color={C.cmd} outlined />
                  <text x={74 + i * 115} y={216} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{c.sub}</text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {step !== 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step < 3 ? 0.6 : 0 }}>
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                CCP = Cryptographic Coprocessor (ASP의 Linux 이름)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
