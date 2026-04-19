import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox } from '@/components/viz/boxes';

const C = {
  repro: '#6366f1',
  mrtd: '#10b981',
  rtmr0: '#0ea5e9',
  rtmr3: '#f59e0b',
  ext: '#8b5cf6',
  ver: '#ef4444',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'Reproducible build 4가지 요건 — 결정적 빌드의 기반' },
  { label: 'MRTD — TDX Module이 TD launch 시 image hash 기록' },
  { label: 'RTMR[0..3] — 런타임 측정 (extend-only PCR-style)' },
  { label: 'rtmr_extend — 앱이 SHA-384 값을 RTMR[3]에 누적' },
  { label: '검증 — KMS가 동일 체인 재계산해서 매치 확인' },
  { label: 'dstack verify CLI — 측정값 사전 계산' },
];

const REPRO = [
  { k: 'Fixed base image hash', desc: '동일 base image 사용', color: C.repro },
  { k: 'Deterministic file ordering', desc: 'sort된 file list', color: C.repro },
  { k: 'Stripped timestamps', desc: 'mtime/ctime = epoch 0', color: C.repro },
  { k: 'Pinned dependencies', desc: 'lockfile + checksum 검증', color: C.repro },
];

const RTMRS = [
  { idx: 0, name: 'UEFI 측정', desc: 'OVMF firmware boot', color: C.rtmr0 },
  { idx: 1, name: 'Linux kernel', desc: 'kernel + cmdline', color: C.rtmr0 },
  { idx: 2, name: 'OS rootfs', desc: 'ext4 image hash', color: C.rtmr0 },
  { idx: 3, name: '사용자 앱', desc: 'compose + container layers', color: C.rtmr3 },
];

export default function MeasurementCalcViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            TD Measurement — MRTD + RTMR (PCR-style)
          </text>
          {step === 0 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.repro}>
                Reproducible build 요건 (deterministic 결과)
              </text>
              {REPRO.map((r, i) => (
                <motion.g key={r.k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={30} y={56 + i * 36} width={420} height={32} rx={5}
                    fill={`${r.color}10`} stroke={`${r.color}45`} strokeWidth={0.7} />
                  <rect x={30} y={56 + i * 36} width={3.5} height={32} fill={r.color} />
                  <text x={45} y={71 + i * 36} fontSize={9.5} fontWeight={700} fill={r.color}>{i + 1}. {r.k}</text>
                  <text x={45} y={84 + i * 36} fontSize={8.5} fill="var(--muted-foreground)">{r.desc}</text>
                </motion.g>
              ))}
              <DataBox x={130} y={204} w={220} h={12} label="동일 input → 동일 hash" color={C.repro} />
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.mrtd}>
                MRTD = SHA-384(initial TD image)
              </text>
              <ActionBox x={30} y={56} w={130} h={42} label="kernel + initrd" sub="boot blob" color={C.mrtd} />
              <ActionBox x={170} y={56} w={130} h={42} label="OVMF firmware" sub="UEFI" color={C.mrtd} />
              <ActionBox x={310} y={56} w={140} h={42} label="cmdline + config" sub="boot params" color={C.mrtd} />
              <text x={240} y={120} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.mrtd}>
                TDX Module이 TD_INIT 시 hash 계산 → MRTD 필드에 기록
              </text>
              {[
                '• 한 번 freeze되면 변경 불가 (immutable)',
                '• KMS 정책의 allowed_mrtd[]에 등록된 값과 매칭',
                '• 다른 image면 quote 검증 시 거부',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.2 + i * 0.1 }}
                  x={36} y={146 + i * 18} fontSize={8.5} fill={C.mrtd} fontWeight={600}>{t}</motion.text>
              ))}
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.rtmr0}>
                RTMR — Runtime Extended Measurement Registers
              </text>
              {RTMRS.map((r, i) => (
                <motion.g key={r.idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                  <rect x={30} y={52 + i * 36} width={420} height={30} rx={5}
                    fill={`${r.color}10`} stroke={`${r.color}45`} strokeWidth={0.7} />
                  <rect x={30} y={52 + i * 36} width={56} height={30} rx={5} fill={`${r.color}30`} />
                  <text x={58} y={71 + i * 36} textAnchor="middle" fontSize={10} fontWeight={700} fill={r.color}>RTMR[{r.idx}]</text>
                  <text x={100} y={66 + i * 36} fontSize={9} fontWeight={700} fill={r.color}>{r.name}</text>
                  <text x={100} y={78 + i * 36} fontSize={8.5} fill="var(--muted-foreground)">{r.desc}</text>
                </motion.g>
              ))}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Extend-only — RTMR_new = SHA-384(RTMR_old || measurement)
              </text>
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ext}>
                rtmr_extend(index=3, sha384(item))
              </text>
              {[
                { line: 'rtmr_extend(3, sha384(compose_yaml))', c: C.ext },
                { line: 'rtmr_extend(3, sha384(container_image_A))', c: C.ext },
                { line: 'rtmr_extend(3, sha384(container_image_B))', c: C.ext },
                { line: '// RTMR[3] = SHA-384(SHA-384(...) || sha(item))', c: C.rtmr3 },
                { line: '// 누적 chain — 순서 중요', c: C.rtmr3 },
                { line: '// 같은 input 시퀀스 → 같은 RTMR[3]', c: C.ext },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20} y={56 + i * 24} width={440} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={70 + i * 24} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <ActionBox x={130} y={206} w={220} h={12} label="PCR-style — TPM과 동일 패턴" color={C.ext} />
            </g>
          )}
          {step === 4 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ver}>
                KMS 측 검증 — 동일 체인 재계산
              </text>
              <ModuleBox x={30} y={56} w={130} h={42} label="Manifest" sub="알려진 input" color={C.repro} />
              <text x={172} y={80} fontSize={11} fill={C.ver}>→</text>
              <ModuleBox x={190} y={56} w={140} h={42} label="Replay extend chain" sub="동일 SHA-384 시퀀스" color={C.ext} />
              <text x={342} y={80} fontSize={11} fill={C.ver}>→</text>
              <DataBox x={360} y={62} w={100} h={32} label="Expected RTMR[3]" sub="비교 대상" color={C.ver} />
              {[
                '✓ Quote에서 추출한 RTMR[3] vs replay 결과 비교',
                '✓ 일치 → 의도한 앱이 실행 중 (no malicious patch)',
                '✗ 불일치 → quote 거부 → secrets 발급 안 함',
                '✓ 공격자가 다른 image 부팅해도 measurement 다름',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.3 + i * 0.1 }}
                  x={36} y={120 + i * 18} fontSize={8.5} fill={C.ver} fontWeight={600}>{t}</motion.text>
              ))}
            </g>
          )}
          {step === 5 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.repro}>
                $ dstack verify docker-compose.yaml --show-measurements
              </text>
              {[
                { line: 'MRTD:    0x3a7f2c1e9d8b...  (initial image)', c: C.mrtd },
                { line: 'RTMR[0]: 0x89f01a2b...      (UEFI)', c: C.rtmr0 },
                { line: 'RTMR[1]: 0x1c2d3e4f...      (kernel)', c: C.rtmr0 },
                { line: 'RTMR[2]: 0x5678abcd...      (rootfs)', c: C.rtmr0 },
                { line: 'RTMR[3]: 0xabc123...        (compose+containers)', c: C.rtmr3 },
                { line: '// 위 값들을 KMS 정책에 등록 → 배포 후 검증', c: C.ext },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20} y={56 + i * 24} width={440} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={70 + i * 24} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <DataBox x={130} y={206} w={220} h={12} label="배포 전 정책 작성에 사용" color={C.repro} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
