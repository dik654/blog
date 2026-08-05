import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox } from '@/components/viz/boxes';

const C = {
  drm: '#6366f1',
  bio: '#0ea5e9',
  pay: '#10b981',
  boot: '#f59e0b',
  auto: '#8b5cf6',
  iot: '#06b6d4',
  android: '#ef4444',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const CASES = [
  {
    title: 'Mobile DRM — Widevine L1 / FairPlay',
    color: C.drm,
    items: [
      { k: 'Widevine L1', v: 'Android 4K 비디오 — 키 hardware-level 보호' },
      { k: 'Secure decoding', v: 'Decoder가 TA 안에서 동작 — frame buffer secure' },
      { k: 'Key provisioning', v: 'Studio key를 TEE seal로 영구 저장' },
    ],
  },
  {
    title: 'Biometric — Fingerprint · Face ID',
    color: C.bio,
    items: [
      { k: 'Template 저장', v: '지문/얼굴 template은 TEE storage만' },
      { k: 'Matching in TEE', v: '비교 연산 자체가 secure world에서 실행' },
      { k: 'Liveness detection', v: '센서 데이터를 TA가 직접 처리' },
    ],
  },
  {
    title: 'Mobile Payments — Samsung/Google Pay',
    color: C.pay,
    items: [
      { k: 'Samsung Pay', v: 'TA에서 카드 emulation 토큰 생성' },
      { k: 'Google Pay', v: 'TEE 옵션 (HCE 또는 SE 대체)' },
      { k: 'PCI DSS', v: 'TEE 통과 = 카드 데이터 격리 만족' },
    ],
  },
  {
    title: 'Boot Verification — Verified Boot',
    color: C.boot,
    items: [
      { k: 'Android Verified Boot', v: 'TA가 dm-verity 키 검증' },
      { k: 'U-Boot → OP-TEE', v: '부팅 단계마다 다음 단계 measure' },
      { k: 'Chain of trust', v: 'ROM → ATF → OP-TEE → Linux' },
    ],
  },
  {
    title: 'Automotive — Car Key · V2X',
    color: C.auto,
    items: [
      { k: 'Car key', v: 'NFC/UWB 디지털 키를 TEE에' },
      { k: 'V2X security', v: '차량 간 메시지 서명 키 보호' },
      { k: 'ECU auth', v: '제어 unit 펌웨어 인증' },
    ],
  },
  {
    title: 'IoT Gateway — Firmware · Identity',
    color: C.iot,
    items: [
      { k: 'Secure FW update', v: '서명 검증 + atomic install' },
      { k: 'Device identity', v: 'HUK로 device certificate 파생' },
      { k: 'Bluetooth pairing', v: 'LTK는 secure storage' },
    ],
  },
  {
    title: 'Android 통합 TA — Keymaster · Gatekeeper · Trusty',
    color: C.android,
    items: [
      { k: 'Keymaster TA', v: 'Android keystore의 TEE 백엔드' },
      { k: 'Gatekeeper TA', v: 'PIN/password 검증 + brute-force 방어' },
      { k: 'Trusty TA', v: 'Google 자체 TEE OS 호환 layer' },
    ],
  },
];

const STEPS = CASES.map((c) => ({ label: c.title }));

export default function UseCasesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const c = CASES[step];
        return (
          <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={c.color}>
              {c.title}
            </text>
            <ModuleBox x={30} y={28} w={140} h={42} label={`Use case ${step + 1}/${CASES.length}`} sub="Trusted App 시나리오" color={c.color} />
            <DataBox x={200} y={32} w={140} h={32} label="OP-TEE TA" sub="Secure world 실행" color={c.color} />
            <DataBox x={350} y={32} w={110} h={32} label="HUK 기반 sealing" sub="제조키 binding" color={c.color} />
            {c.items.map((it, i) => (
              <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, ...sp }}>
                <rect x={30} y={88 + i * 36} width={420} height={30} rx={5}
                  fill={`${c.color}10`} stroke={`${c.color}45`} strokeWidth={0.8} />
                <rect x={30} y={88 + i * 36} width={3.5} height={30} rx={1} fill={c.color} />
                <text x={45} y={104 + i * 36} fontSize={10} fontWeight={700} fill={c.color}>{it.k}</text>
                <text x={45} y={114 + i * 36} fontSize={8.5} fill="var(--muted-foreground)">{it.v}</text>
              </motion.g>
            ))}
          </svg>
        );
      }}
    </StepViz>
  );
}
