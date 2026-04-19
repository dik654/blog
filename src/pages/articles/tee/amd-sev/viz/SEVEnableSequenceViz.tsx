import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, StatusBox } from '@/components/viz/boxes';

const C = {
  bios: '#8b5cf6',
  kernel: '#0ea5e9',
  verify: '#10b981',
  qemu: '#f59e0b',
};

const STEPS = [
  { label: '① BIOS — SMEE / SEV-SNP 활성화', body: 'CPU Configuration 메뉴에서 Enable 후 재부팅' },
  { label: '② Linux 부팅 파라미터 — 모드별 키워드', body: 'mem_encrypt=on / kvm_amd.sev=1 / sev_es=1 / sev_snp=1' },
  { label: '③ 호스트 확인 — dmesg', body: 'SEV / SEV-ES / SEV-SNP supported 메시지 + ASID 수' },
  { label: '④ QEMU SEV VM 실행 — policy bits', body: 'sev-guest object + policy=0x01 (SEV) 또는 ES/no-debug' },
];

const KERNEL_ARGS = [
  { k: 'mem_encrypt=on', sub: 'TME' },
  { k: 'kvm_amd.sev=1', sub: 'SEV host' },
  { k: 'kvm_amd.sev_es=1', sub: 'SEV-ES' },
  { k: 'kvm_amd.sev_snp=1', sub: 'SEV-SNP' },
];

const POLICY = [
  { bit: 0, label: 'SEV', sub: '필수' },
  { bit: 1, label: 'ES', sub: 'SEV-ES' },
  { bit: 2, label: 'no-debug', sub: '디버그 금지' },
  { bit: 3, label: 'no-key-share', sub: '키 공유 금지' },
];

export default function SEVEnableSequenceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step nav at top */}
          <g>
            {['BIOS', 'Kernel', 'dmesg', 'QEMU'].map((s, i) => {
              const x = 30 + i * 130;
              const active = step === i;
              return (
                <motion.g key={s} animate={{ opacity: active ? 1 : 0.35 }}>
                  <circle cx={x} cy={20} r={9}
                    fill={active ? '#6366f1' : 'var(--card)'} stroke="#6366f1" strokeWidth={1.2} />
                  <text x={x} y={23} textAnchor="middle" fontSize={9} fontWeight={700}
                    fill={active ? 'white' : '#6366f1'}>{i + 1}</text>
                  <text x={x} y={42} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill={active ? '#6366f1' : 'var(--muted-foreground)'}>{s}</text>
                </motion.g>
              );
            })}
            {[0, 1, 2].map(i => (
              <line key={i} x1={45 + i * 130} y1={20} x2={145 + i * 130} y2={20}
                stroke="var(--border)" strokeWidth={1} />
            ))}
          </g>

          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <ModuleBox x={60} y={70} w={360} h={110} label="BIOS Setup" sub="Advanced → CPU Configuration" color={C.bios} />
              <DataBox x={80} y={108} w={320} h={26} label="SMEE = Enabled" color={C.bios} outlined />
              <DataBox x={80} y={142} w={320} h={26} label="SEV-SNP Support = Enabled" color={C.bios} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              {KERNEL_ARGS.map((a, i) => (
                <motion.g key={a.k}
                  initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <ActionBox x={30 + (i % 2) * 220} y={70 + Math.floor(i / 2) * 60} w={210} h={48}
                    label={a.k} sub={a.sub} color={C.kernel} />
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20} y={70} w={440} h={110} label="dmesg | grep SEV" sub="부팅 로그 검증" color={C.verify} />
              {[
                'SEV supported: 509 ASIDs',
                'SEV-ES supported: 126 ASIDs',
                'SEV-SNP supported',
              ].map((line, i) => (
                <motion.text key={i} x={50} y={120 + i * 18} fontSize={9.5} fill={C.verify} fontWeight={600}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                  ✓ {line}
                </motion.text>
              ))}
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={20} y={70} w={210} h={48} label="qemu-system-x86_64" sub="-machine q35,memory-encryption=sev0" color={C.qemu} />
              <ActionBox x={250} y={70} w={210} h={48} label="-object sev-guest" sub="policy=0x01 cbitpos=47" color={C.qemu} />
              <text x={20} y={140} fontSize={9} fontWeight={700} fill={C.qemu}>policy bits</text>
              {POLICY.map((p, i) => (
                <motion.g key={p.bit}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
                  <StatusBox x={20 + i * 115} y={148} w={110} h={42} label={`bit ${p.bit}: ${p.label}`} sub={p.sub} color={C.qemu} progress={1} />
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
