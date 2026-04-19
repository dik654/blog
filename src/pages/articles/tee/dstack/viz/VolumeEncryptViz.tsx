import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  vol: '#6366f1',
  key: '#10b981',
  luks: '#0ea5e9',
  fs: '#f59e0b',
  off: '#8b5cf6',
  warn: '#ef4444',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'docker-compose.yaml — volumes에 dstack-encrypted driver 지정' },
  { label: 'Guest agent — KMS에서 volume_key 요청 (attest 동시)' },
  { label: 'cryptsetup luksFormat — LUKS 헤더로 volume 암호화 셋업' },
  { label: 'mkfs + mount — /dev/mapper/encrypted_data 마운트' },
  { label: 'VM 종료 — key는 메모리에서 사라짐 (host도 복호 불가)' },
  { label: 'VM 재시작 — 같은 app_id → 같은 volume_key → 데이터 복구' },
];

export default function VolumeEncryptViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            VM Volume 암호화 — dstack 기본 활성화
          </text>
          {step === 0 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.vol}>
                docker-compose.yaml — encrypted volume 선언
              </text>
              {[
                { line: 'volumes:', c: C.vol },
                { line: '  data:', c: C.vol },
                { line: '    driver: dstack-encrypted   # ★ 핵심', c: C.key },
                { line: '', c: C.vol },
                { line: 'services:', c: C.vol },
                { line: '  app:', c: C.vol },
                { line: '    volumes:', c: C.vol },
                { line: '      - data:/var/lib/db', c: C.fs },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={20} y={52 + i * 22} width={440} height={18} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={64 + i * 22} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <text x={240} y={216} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                기본 driver "local" 대신 dstack-encrypted → 자동 LUKS 적용
              </text>
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.key}>
                Guest agent — volume key 요청
              </text>
              <ModuleBox x={30} y={56} w={130} h={42} label="Guest agent" sub="dstack-guest-agent" color={C.vol} />
              <text x={172} y={80} fontSize={11} fill={C.key}>→</text>
              <ActionBox x={190} y={56} w={120} h={42} label="POST /attest" sub="quote + req keys" color={C.key} />
              <text x={322} y={80} fontSize={11} fill={C.key}>→</text>
              <ModuleBox x={340} y={56} w={120} h={42} label="dstack-kms" sub="HKDF 파생" color={C.luks} />
              {[
                'volume_key = kms_client.get_volume_key("data")',
                '// 내부적으로 HKDF(app_key, "volume:data")',
                '// = HKDF(HKDF(...root_key..."app:" + app_id), ...)',
                '// 결정적 → VM 재시작 후에도 동일',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.2 + i * 0.1 }}
                  x={36} y={130 + i * 18} fontSize={8.5} fontFamily="monospace" fill={C.key} fontWeight={600}>{t}</motion.text>
              ))}
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.luks}>
                cryptsetup — LUKS encrypted volume 생성
              </text>
              {[
                { line: '$ cryptsetup luksFormat /dev/sdb \\', c: C.luks },
                { line: '    --type luks2 \\', c: C.luks },
                { line: '    --cipher aes-xts-plain64 \\', c: C.luks },
                { line: '    --key-file <(echo "$volume_key")', c: C.key },
                { line: '$ cryptsetup luksOpen /dev/sdb encrypted_data \\', c: C.luks },
                { line: '    --key-file <(echo "$volume_key")', c: C.key },
                { line: '// /dev/mapper/encrypted_data 생성됨', c: C.fs },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={20} y={52 + i * 22} width={440} height={18} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={64 + i * 22} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <DataBox x={130} y={216} w={220} h={4} label="" color={C.luks} />
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fs}>
                Filesystem 생성 + mount
              </text>
              {[
                { line: '$ mkfs.ext4 /dev/mapper/encrypted_data', c: C.fs },
                { line: '$ mount /dev/mapper/encrypted_data /data', c: C.fs },
                { line: '// docker가 /data를 컨테이너 volume으로 사용', c: C.luks },
                { line: '// 모든 write가 LUKS layer에서 자동 암호화', c: C.key },
                { line: '// 디스크에는 ciphertext만 저장', c: C.key },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20} y={52 + i * 26} width={440} height={22} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={66 + i * 26} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <ActionBox x={130} y={196} w={220} h={20} label="앱은 평문처럼 사용 — block layer가 투명 처리" color={C.fs} />
            </g>
          )}
          {step === 4 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.off}>
                VM 종료 — Key 사라짐
              </text>
              <ModuleBox x={30} y={56} w={140} h={42} label="VM Memory" sub="volume_key 살아있음" color={C.key} />
              <text x={182} y={80} fontSize={11} fill={C.off}>⏻</text>
              <AlertBox x={200} y={56} w={120} h={42} label="VM shutdown" sub="memory cleared" color={C.off} />
              <text x={332} y={80} fontSize={11} fill={C.off}>→</text>
              <DataBox x={350} y={62} w={110} h={32} label="Disk: ciphertext" sub="복호 불가" color={C.warn} />
              {[
                '✓ Host가 disk image 훔쳐도 평문 접근 불가',
                '✓ Hypervisor compromise도 무력화',
                '✓ Cold storage = 항상 암호화 상태',
                '✗ KMS 자체가 손실되면 영구 복구 불가 (HUK + KMS root 필요)',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.2 + i * 0.1 }}
                  x={36} y={120 + i * 18} fontSize={8.5} fill={C.warn} fontWeight={600}>{t}</motion.text>
              ))}
            </g>
          )}
          {step === 5 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.key}>
                VM 재시작 — 결정적 데이터 복구
              </text>
              {[
                '1) VM boot → guest agent 실행',
                '2) Quote 생성 → KMS 호출 (POST /attest)',
                '3) 같은 app_id → 같은 cluster_key → 같은 app_key',
                '4) 같은 volume_key 반환 (deterministic HKDF)',
                '5) cryptsetup luksOpen → /dev/mapper/encrypted_data',
                '6) mount → 기존 데이터 평문 접근 OK',
              ].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={30} y={52 + i * 26} width={420} height={22} rx={4}
                    fill={`${C.key}10`} stroke={`${C.key}45`} strokeWidth={0.6} />
                  <text x={45} y={67 + i * 26} fontSize={9} fontWeight={600} fill={C.key}>{t}</text>
                </motion.g>
              ))}
              <ActionBox x={130} y={210} w={220} h={6} label="" color={C.key} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
