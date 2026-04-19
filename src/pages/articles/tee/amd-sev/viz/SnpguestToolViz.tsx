import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  guest: '#0ea5e9',
  cert: '#8b5cf6',
  verify: '#10b981',
  display: '#f59e0b',
  measure: '#ef4444',
};

const STEPS = [
  { label: 'snpguest report — guest 안에서 호출', body: 'random nonce + report 파일 생성 (1184B)' },
  { label: 'snpguest certificates — VCEK/ASK/ARK 가져오기', body: 'PEM 형식으로 디렉토리에 저장' },
  { label: 'snpguest verify — 체인 + 보고서 검증', body: 'verify certs 후 verify attestation' },
  { label: 'snpguest display — TCB 등 사람 읽기 좋게', body: 'Reported TCB Version 출력 (BL/TEE/SNP/uCode)' },
  { label: 'snpguest generate measurement — 기대값 계산', body: 'OVMF + kernel + initrd로 launch digest 재현' },
];

const COMMANDS = [
  { cmd: 'snpguest report report.bin nonce.bin --random', color: C.guest, sub: 'guest 안에서 보고서 요청' },
  { cmd: 'snpguest certificates PEM ./certs/', color: C.cert, sub: 'VCEK + 체인 인증서 다운로드' },
  { cmd: 'snpguest verify certs -d ./certs/', color: C.verify, sub: '체인 검증' },
  { cmd: 'snpguest verify attestation -d ./certs/ -r report.bin', color: C.verify, sub: '서명 + 내용 검증' },
  { cmd: 'snpguest display report report.bin', color: C.display, sub: 'TCB / measurement 표시' },
  { cmd: 'snpguest generate measurement --ovmf … --kernel …', color: C.measure, sub: '기대 measurement 계산' },
];

const TCB_OUT = [
  { k: 'Boot Loader', v: '7' },
  { k: 'TEE', v: '0' },
  { k: 'SNP', v: '20' },
  { k: 'Microcode', v: '208' },
];

export default function SnpguestToolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const visibleSet = new Set<number>();
        if (step === 0) visibleSet.add(0);
        if (step === 1) visibleSet.add(1);
        if (step === 2) { visibleSet.add(2); visibleSet.add(3); }
        if (step === 3) visibleSet.add(4);
        if (step === 4) visibleSet.add(5);
        return (
          <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">
              snpguest CLI (virtee/snpguest, Rust)
            </text>

            {COMMANDS.map((c, i) => {
              const visible = visibleSet.has(i);
              return (
                <motion.g key={i} animate={{ opacity: visible ? 1 : 0.2 }}>
                  <ActionBox x={20} y={26 + i * 28} w={440} h={24} label={c.cmd} color={c.color} />
                </motion.g>
              );
            })}

            <motion.g key={`detail-${step}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              {step === 0 && (
                <DataBox x={60} y={196} w={360} h={36} label="report.bin (1184 bytes) + random-nonce.bin" color={C.guest} outlined />
              )}
              {step === 1 && (
                <DataBox x={60} y={196} w={360} h={36} label="./certs/ ← VCEK.pem · ASK.pem · ARK.pem" color={C.cert} outlined />
              )}
              {step === 2 && (
                <>
                  <DataBox x={20} y={196} w={210} h={36} label="✓ chain valid" color={C.verify} outlined />
                  <DataBox x={250} y={196} w={210} h={36} label="✓ signature OK + content match" color={C.verify} outlined />
                </>
              )}
              {step === 3 && (
                <>
                  <text x={60} y={208} fontSize={9} fontWeight={700} fill={C.display}>Reported TCB Version:</text>
                  {TCB_OUT.map((t, i) => (
                    <text key={t.k} x={60 + i * 95} y={228} fontSize={9} fill="var(--muted-foreground)">
                      {t.k}={t.v}
                    </text>
                  ))}
                </>
              )}
              {step === 4 && (
                <DataBox x={60} y={196} w={360} h={36} label="Expected measurement: abc123..." color={C.measure} outlined />
              )}
            </motion.g>
          </svg>
        );
      }}
    </StepViz>
  );
}
