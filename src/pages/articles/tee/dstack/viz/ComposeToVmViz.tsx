import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, ModuleBox, DataBox } from '@/components/viz/boxes';

const C = {
  yaml: '#0ea5e9',
  cli: '#6366f1',
  manifest: '#10b981',
  build: '#f59e0b',
  measure: '#8b5cf6',
  td: '#ef4444',
  kms: '#06b6d4',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: '사용자 작성 docker-compose.yaml — 평범한 스펙' },
  { label: 'dstack deploy --tdx — CLI가 변환 시작' },
  { label: 'VM Manifest + TD 이미지 빌드 (kernel + initramfs + rootfs)' },
  { label: 'Measurement 계산 — MRTD (결정적 reproducible build)' },
  { label: 'KVM-TDX로 TD 생성 — virtio · port forward · network bridge' },
  { label: 'TD 시작 — Linux boot → Docker daemon → 앱 실행' },
  { label: 'Attestation 제출 → 정책 매치 → 키·secrets 수령 → 앱 사용' },
];

const COMPOSE_LINES = [
  { line: "version: '3.8'", c: C.yaml },
  { line: 'services:', c: C.yaml },
  { line: '  app:', c: C.yaml },
  { line: '    image: ghcr.io/myorg/confidential-app:v1.0', c: C.yaml },
  { line: '    ports:', c: C.yaml },
  { line: '      - "8080:8080"', c: C.yaml },
  { line: '    environment:', c: C.yaml },
  { line: '      - API_KEY=${API_KEY}   # KMS에서 주입', c: C.kms },
  { line: '    volumes:', c: C.yaml },
  { line: '      - encrypted:/data', c: C.yaml },
];

export default function ComposeToVmViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            Docker Compose → Confidential TDX VM
          </text>
          {step === 0 && (
            <g>
              {COMPOSE_LINES.map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <rect x={20} y={36 + i * 18} width={440} height={14} rx={2} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.5} />
                  <text x={32} y={47 + i * 18} fontSize={8.5} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                개발자는 TEE 디테일을 몰라도 됨 — 표준 docker-compose
              </text>
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.cli}>
                $ dstack deploy docker-compose.yaml --tdx
              </text>
              <ActionBox x={30} y={56} w={200} h={36} label="dstack CLI" sub="입력 파싱" color={C.cli} />
              <text x={245} y={78} fontSize={11} fill={C.manifest}>→</text>
              <ActionBox x={260} y={56} w={200} h={36} label="VM Manifest 생성" sub="JSON 스펙" color={C.manifest} />
              {[
                '• docker-compose 파싱 (services, volumes, ports, env)',
                '• policy 정의 (allowed_mrtd, expected_rtmr)',
                '• KMS server URL + cluster_id 주입',
                '• owner signature 첨부 (Ed25519)',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.2 + i * 0.1 }}
                  x={36} y={120 + i * 20} fontSize={8.5} fill={C.manifest} fontWeight={600}>{t}</motion.text>
              ))}
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.build}>
                TD 이미지 빌드 (Reproducible)
              </text>
              <motion.g initial={{ opacity: 0, scaleY: 0.5 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.1 }} style={{ transformOrigin: '240px 80px' }}>
                <rect x={30} y={56} width={420} height={48} rx={6} fill={`${C.build}15`} stroke={C.build} strokeWidth={1} />
                <rect x={30} y={56} width={140} height={48} rx={6} fill={`${C.build}30`} />
                <rect x={170} y={56} width={140} height={48} rx={6} fill={`${C.build}25`} />
                <rect x={310} y={56} width={140} height={48} rx={6} fill={`${C.build}20`} />
                <text x={100} y={78} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.build}>Kernel</text>
                <text x={100} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Linux 6.x + TDX patch</text>
                <text x={240} y={78} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.build}>initramfs</text>
                <text x={240} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">guest-agent + cryptsetup</text>
                <text x={380} y={78} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.build}>rootfs</text>
                <text x={380} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Docker layers 통합</text>
              </motion.g>
              {[
                '• Fixed base image hash → 결정적 결과',
                '• Deterministic file ordering (sorted)',
                '• Stripped timestamps (epoch 0)',
                '• Docker layers를 rootfs ext4에 통합',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.4 + i * 0.08 }}
                  x={36} y={130 + i * 18} fontSize={8.5} fill="var(--muted-foreground)">{t}</motion.text>
              ))}
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.measure}>
                Measurement 계산 (TD launch 직전)
              </text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <rect x={30} y={56} width={420} height={36} rx={5} fill={`${C.measure}15`} stroke={`${C.measure}55`} strokeWidth={0.8} />
                <text x={45} y={73} fontSize={9.5} fontWeight={700} fill={C.measure}>MRTD = SHA-384(image)</text>
                <text x={45} y={86} fontSize={8.5} fill="var(--muted-foreground)">초기 이미지 (kernel || initrd || cmdline || OVMF)</text>
              </motion.g>
              {[
                'RTMR[0] — UEFI 측정 (firmware/loader)',
                'RTMR[1] — Linux kernel 부팅 측정',
                'RTMR[2] — OS rootfs 측정 (extended at boot)',
                'RTMR[3] — 사용자 앱 측정 (compose + container layers)',
              ].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
                  <rect x={30} y={104 + i * 22} width={420} height={18} rx={3} fill={`${C.measure}08`} stroke={`${C.measure}30`} strokeWidth={0.5} />
                  <text x={42} y={117 + i * 22} fontSize={8.5} fill={C.measure} fontWeight={600}>{t}</text>
                </motion.g>
              ))}
              <DataBox x={130} y={196} w={220} h={20} label="$ dstack verify ... → MRTD/RTMR 출력" color={C.measure} />
            </g>
          )}
          {step === 4 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.td}>
                KVM-TDX로 TD 생성
              </text>
              <ModuleBox x={30} y={56} w={140} h={42} label="dstack-vmm" sub="VM lifecycle" color={C.cli} />
              <ModuleBox x={180} y={56} w={140} h={42} label="QEMU + KVM-TDX" sub="hypervisor" color={C.td} />
              <ModuleBox x={330} y={56} w={130} h={42} label="TDX Module" sub="SEAM (CPU)" color={C.td} />
              {[
                'virtio device 설정 (block, net)',
                'Port forwarding (8080 → host)',
                'Network bridge (NAT or br0)',
                'TDX_TD_VCPU_INIT — vCPU에 TD bit 설정',
                'TDX_TD_FINALIZE — measurement freeze',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.2 + i * 0.08 }}
                  x={36} y={120 + i * 18} fontSize={8.5} fill={C.td} fontWeight={600}>• {t}</motion.text>
              ))}
            </g>
          )}
          {step === 5 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.build}>
                TD 시작 — Boot 시퀀스
              </text>
              {[
                'OVMF firmware → Linux kernel 로드',
                'Linux init → systemd 또는 dstack-init',
                'cryptsetup → encrypted volumes 마운트 (key 대기)',
                'Docker daemon 시작',
                'docker-compose up → 사용자 컨테이너 실행',
                'guest-agent → KMS 호출 (다음 단계)',
              ].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={30} y={52 + i * 26} width={420} height={22} rx={4}
                    fill={`${C.build}10`} stroke={`${C.build}45`} strokeWidth={0.6} />
                  <text x={45} y={67 + i * 26} fontSize={9.5} fontWeight={700} fill={C.build}>{i + 1}.</text>
                  <text x={70} y={67 + i * 26} fontSize={9} fill="var(--muted-foreground)">{t}</text>
                </motion.g>
              ))}
            </g>
          )}
          {step === 6 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.kms}>
                Attestation → Secrets → 앱 사용
              </text>
              <ModuleBox x={30} y={52} w={130} h={42} label="guest-agent" sub="quote 생성" color={C.kms} />
              <text x={170} y={76} fontSize={11} fill={C.kms}>→</text>
              <ModuleBox x={185} y={52} w={120} h={42} label="dstack-kms" sub="정책 검증" color={C.manifest} />
              <text x={315} y={76} fontSize={11} fill={C.kms}>→</text>
              <ModuleBox x={330} y={52} w={130} h={42} label="encrypted secrets" sub="API_KEY · DB pwd" color={C.td} />
              {[
                '✓ MRTD + RTMR 매치 → policy OK',
                '✓ encrypted_keys 반환 (quote pubkey로 암호화)',
                '✓ guest-agent가 복호 → env 또는 file로 주입',
                '✓ 사용자 앱이 secrets 사용 — TEE 외부엔 평문 노출 없음',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.3 + i * 0.1 }}
                  x={36} y={118 + i * 20} fontSize={8.5} fill={C.kms} fontWeight={600}>{t}</motion.text>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
