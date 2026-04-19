import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_IN = '#6366f1';
const C_OUT = '#10b981';
const C_KEY = '#f59e0b';
const C_MAC = '#ef4444';

const FIELDS = [
  { name: 'cpusvn', size: '16B' },
  { name: 'attributes', size: '8B' },
  { name: 'mrenclave', size: '32B' },
  { name: 'mrsigner', size: '32B' },
  { name: 'isvprodid/svn', size: '4B' },
  { name: 'reportdata', size: '64B' },
  { name: 'keyid', size: '32B' },
  { name: 'mac', size: '16B' },
];

const STEPS = [
  {
    label: 'EREPORT — Ring 3, enclave 내부에서 호출',
    body: 'Input: TARGETINFO (검증할 대상 enclave 정보) + REPORTDATA (64B user data).\nOutput: 자기 identity와 MAC 포함한 report 구조.',
  },
  {
    label: 'Report 구조 — 8개 핵심 필드',
    body: 'cpusvn / attributes / mrenclave / mrsigner / isv* / reportdata / keyid / mac.\n각 필드는 enclave identity와 platform state를 인코딩한다.',
  },
  {
    label: 'MAC 계산 — target enclave만 검증 가능',
    body: 'report_key = EGETKEY(REPORT, target.MRENCLAVE).\nMAC = AES-CMAC(report_key, report[0..384]). 검증자만 같은 키 얻을 수 있다.',
  },
];

export default function EreportViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={20} w={170} h={36} label="TARGETINFO" sub="MRENCLAVE, ATTR" color={C_IN} outlined />
              <DataBox x={40} y={70} w={170} h={36} label="REPORTDATA (64B)" sub="nonce, pubkey" color={C_IN} outlined />
              <ActionBox x={250} y={45} w={170} h={42} label="EREPORT" sub="Ring 3 instruction" color={C_OUT} />
              <DataBox x={130} y={130} w={220} h={36} label="report struct (432B)" sub="MAC 포함" color={C_OUT} outlined />
              <line x1={210} y1={90} x2={250} y2={66} stroke={C_IN} strokeWidth={0.7} />
              <line x1={335} y1={87} x2={240} y2={130} stroke={C_OUT} strokeWidth={0.7} />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                같은 CPU 내 다른 enclave가 검증
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {FIELDS.map((f, i) => {
                const x = 40 + (i % 4) * 110;
                const y = 28 + Math.floor(i / 4) * 50;
                return (
                  <motion.g key={i} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}>
                    <DataBox x={x} y={y} w={100} h={36} label={f.name} sub={f.size} color={C_OUT} outlined />
                  </motion.g>
                );
              })}
              <text x={240} y={156} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C_OUT}>
                report_body + keyid + mac
              </text>
              <text x={240} y={178} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                struct 전체 크기: 432 bytes
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={20} w={170} h={32} label="target.MRENCLAVE" color={C_IN} outlined />
              <ActionBox x={250} y={20} w={170} h={32} label="EGETKEY (REPORT)" color={C_KEY} />
              <DataBox x={120} y={70} w={240} h={32} label="report_key (16B)" color={C_KEY} outlined />
              <ActionBox x={40} y={120} w={400} h={32} label="MAC = AES-CMAC(report_key, report[0..384])" color={C_MAC} />
              <text x={240} y={180} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_MAC}>
                target 측만 같은 key 파생 → MAC 검증 가능
              </text>
              <text x={240} y={198} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                CPU 바운드 — 다른 CPU에서는 절대 같은 key 못 얻음
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
