import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Intel ME — Quark 별도 코어, 시스템 부트 제어, fTPM 제공' },
  { label: 'AMD ASP — Cortex-A5 코어, SEV 암호 연산, eFuse 관리' },
  { label: 'ARM TrustZone Secure ROM — BL1, TF-A, hash chain 시작점' },
  { label: 'Apple SEP — Custom ARM core, sepOS, 지문/Face ID + 키 관리' },
  { label: 'Google Titan — Custom RISC-V chip, 데이터센터 + Pixel phone' },
  { label: '공통 속성 — 메인 CPU보다 권한 ↑ + eFuse 키 + 서명 firmware만 + 업데이트 제한' },
];

const ROT_DATA: { color: string; title: string; rows: { k: string; v: string }[] }[] = [
  {
    color: '#6366f1',
    title: 'Intel ME (Management Engine)',
    rows: [
      { k: '코어', v: '별도 x86 (32-bit Quark)' },
      { k: '역할', v: '시스템 부트 제어 + fTPM 제공' },
      { k: '검증', v: 'Firmware update 검증' },
      { k: '도입', v: '모든 Intel chipset (Q35 이후)' },
    ],
  },
  {
    color: '#10b981',
    title: 'AMD ASP (Secure Processor, 구 PSP)',
    rows: [
      { k: '코어', v: 'ARM Cortex-A5' },
      { k: '역할', v: 'SEV 암호 연산 담당' },
      { k: 'Boot', v: 'Boot verification + eFuse 관리' },
      { k: '도입', v: 'Zen 이후 모든 EPYC/Ryzen' },
    ],
  },
  {
    color: '#f59e0b',
    title: 'ARM TrustZone Secure ROM',
    rows: [
      { k: '역할', v: '1st-stage bootloader (BL1)' },
      { k: '검증', v: 'TF-A (Trusted Firmware-A)' },
      { k: '시작점', v: 'Hash chain 시작' },
      { k: '대상', v: 'Cortex-A 코어 전반' },
    ],
  },
  {
    color: '#0ea5e9',
    title: 'Apple SEP (Secure Enclave Processor)',
    rows: [
      { k: '코어', v: 'Custom ARM core' },
      { k: '대상', v: 'T2/M1 이상 Mac, 최신 iPhone' },
      { k: 'OS', v: '자체 OS (sepOS)' },
      { k: '기능', v: '지문/Face ID + 키 관리' },
    ],
  },
  {
    color: '#a855f7',
    title: 'Google Titan',
    rows: [
      { k: '아키', v: 'Custom RISC-V chip' },
      { k: '용도', v: '데이터센터 + Pixel phone' },
      { k: '역할', v: 'Boot integrity' },
      { k: 'Provisioning', v: '공장 단계 키 주입' },
    ],
  },
];

const COMMON = [
  { line: '메인 CPU보다 권한 높음', c: '#6366f1' },
  { line: 'eFuse로 고유 키 보유', c: '#10b981' },
  { line: 'AMD/Intel/Arm 서명된 firmware만 실행', c: '#f59e0b' },
  { line: '업데이트 제한적 (rollback 방어)', c: '#ef4444' },
];

export default function RootOfTrustViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 5 && (() => {
            const r = ROT_DATA[step];
            return (<g>
              <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={r.color}>
                {r.title}
              </text>
              {r.rows.map((row, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}>
                  <rect x={30} y={42 + i * 40} width={460} height={32} rx={4}
                    fill={`${r.color}10`} stroke={`${r.color}40`} strokeWidth={0.8} />
                  <text x={50} y={62 + i * 40} fontSize={10.5} fontWeight={700} fill={r.color}>{row.k}</text>
                  <text x={150} y={62 + i * 40} fontSize={10} fill="var(--foreground)">{row.v}</text>
                </motion.g>
              ))}
            </g>);
          })()}
          {step === 5 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              모든 Root of Trust 공통 속성
            </text>
            {COMMON.map((c, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 38} width={420} height={30} rx={5}
                  fill={`${c.c}10`} stroke={`${c.c}50`} strokeWidth={0.8} />
                <text x={70} y={70 + i * 38} fontSize={11} fontWeight={600} fill={c.c}>{c.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
