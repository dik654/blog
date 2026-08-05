import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  comp: '#0ea5e9',
  mrtd: '#10b981',
  pol: '#f59e0b',
  own: '#8b5cf6',
  hash: '#6366f1',
  warn: '#ef4444',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'app_id 계산 — 4개 입력의 SHA-256 해시 (deterministic identity)' },
  { label: '입력 1: compose_yaml — Docker Compose 내용' },
  { label: '입력 2: mrtd — TD 이미지 hash (kernel + initrd)' },
  { label: '입력 3,4: policy_hash + owner_pubkey — KMS 정책과 소유자' },
  { label: 'Compose 변경 시 — app_id 변경 → 새 app_key (이전 데이터 격리)' },
  { label: '업그레이드 전략 — 새 app_id (격리) vs owner-based key 공유' },
];

const INPUTS = [
  { name: 'compose_yaml', desc: 'Docker Compose 내용 (services · ports · env)', color: C.comp },
  { name: 'mrtd', desc: 'TD launch image hash (boot 직후 측정)', color: C.mrtd },
  { name: 'policy_hash', desc: 'KMS 정책 (allowed images · TCB · RTMR 등)', color: C.pol },
  { name: 'owner_pubkey', desc: '소유자 공개키 (배포 권한 증명)', color: C.own },
];

export default function AppIdCalcViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            app_id 계산 — 결정적 deployment identity
          </text>
          {step === 0 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.hash}>
                app_id = SHA256( compose || mrtd || policy_hash || owner_pubkey )
              </text>
              {INPUTS.map((inp, i) => (
                <motion.g key={inp.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20} y={56 + i * 32} width={130} height={26} rx={5}
                    fill={`${inp.color}15`} stroke={`${inp.color}55`} strokeWidth={0.8} />
                  <text x={85} y={73 + i * 32} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={inp.color}>{inp.name}</text>
                  <line x1={150} y1={70 + i * 32} x2={310} y2={130} stroke={`${C.hash}50`} strokeWidth={0.6} />
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                <rect x={290} y={114} width={180} height={36} rx={6} fill={`${C.hash}20`} stroke={C.hash} strokeWidth={1} />
                <text x={380} y={132} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.hash}>SHA-256</text>
                <text x={380} y={146} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">→ app_id (32 bytes)</text>
              </motion.g>
              <DataBox x={130} y={180} w={220} h={26} label="결정적 — 같은 입력 = 같은 app_id" color={C.hash} />
            </g>
          )}
          {step >= 1 && step <= 3 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={INPUTS[step - 1]?.color || INPUTS[2].color}>
                입력 #{step} — {step === 3 ? 'policy_hash + owner_pubkey' : INPUTS[step - 1].name}
              </text>
              {step === 1 && (
                <g>
                  {[
                    { line: 'version: \'3.8\'', c: C.comp },
                    { line: 'services:', c: C.comp },
                    { line: '  app:', c: C.comp },
                    { line: '    image: ghcr.io/myorg/app:v1.0', c: C.mrtd },
                    { line: '    ports: ["8080:8080"]', c: C.comp },
                    { line: '// 모든 라인이 hash에 들어감', c: C.warn },
                    { line: '// 한 글자만 바뀌어도 app_id 변경', c: C.warn },
                  ].map((l, i) => (
                    <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                      <rect x={20} y={50 + i * 22} width={440} height={18} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                      <text x={32} y={62 + i * 22} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                    </motion.g>
                  ))}
                </g>
              )}
              {step === 2 && (
                <g>
                  {[
                    { line: 'mrtd = SHA-384(', c: C.mrtd },
                    { line: '    kernel_image  ||', c: C.mrtd },
                    { line: '    initramfs     ||', c: C.mrtd },
                    { line: '    cmdline       ||', c: C.mrtd },
                    { line: '    OVMF_firmware', c: C.mrtd },
                    { line: ')', c: C.mrtd },
                    { line: '// TD launch 시 자동 측정 — 변조 불가', c: C.warn },
                  ].map((l, i) => (
                    <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                      <rect x={20} y={50 + i * 22} width={440} height={18} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                      <text x={32} y={62 + i * 22} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                    </motion.g>
                  ))}
                </g>
              )}
              {step === 3 && (
                <g>
                  {[
                    { line: 'policy_hash = SHA256(', c: C.pol },
                    { line: '    allowed_mrtd[] || expected_rtmr[] || min_tcb', c: C.pol },
                    { line: ')', c: C.pol },
                    { line: '// 정책 변경 = 새 app_id (재배포 필요)', c: C.warn },
                    { line: 'owner_pubkey = Ed25519 (32 bytes)', c: C.own },
                    { line: '// 누가 배포했는지 binding', c: C.own },
                    { line: '// 다른 owner가 같은 코드 배포 → 다른 app_id', c: C.own },
                  ].map((l, i) => (
                    <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                      <rect x={20} y={50 + i * 22} width={440} height={18} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                      <text x={32} y={62 + i * 22} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                    </motion.g>
                  ))}
                </g>
              )}
            </g>
          )}
          {step === 4 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.warn}>
                Compose 파일 변경 — 데이터 격리 시나리오
              </text>
              <ActionBox x={30} y={56} w={140} h={36} label="기존 compose v1" sub="app_id = 0xAAA..." color={C.comp} />
              <text x={185} y={78} fontSize={11} fill={C.warn}>→</text>
              <ActionBox x={200} y={56} w={140} h={36} label="새 compose v2" sub="app_id = 0xBBB..." color={C.comp} />
              <text x={355} y={78} fontSize={11} fill={C.warn}>→</text>
              <ActionBox x={370} y={56} w={100} h={36} label="새 app_key" sub="HKDF 다른 입력" color={C.warn} />
              {[
                '✗ 이전 데이터에 접근 불가 (key 다름)',
                '✗ Migration 필요 (구버전이 데이터 export → 신버전 import)',
                '✓ 보안 격리 — 악성 update가 기존 secrets 못 훔침',
                '✓ 결정적 — 같은 v1 코드를 다시 배포하면 데이터 복구',
              ].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <rect x={30} y={108 + i * 24} width={420} height={20} rx={3} fill={`${C.warn}08`} stroke={`${C.warn}35`} strokeWidth={0.5} />
                  <text x={42} y={122 + i * 24} fontSize={8.5} fill={C.warn} fontWeight={600}>{t}</text>
                </motion.g>
              ))}
            </g>
          )}
          {step === 5 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.own}>
                업그레이드 전략 비교
              </text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <rect x={30} y={56} width={205} height={140} rx={6} fill={`${C.warn}10`} stroke={`${C.warn}55`} strokeWidth={0.8} />
                <text x={132} y={76} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.warn}>Option A: 새 app_id</text>
                <text x={42} y={96} fontSize={8.5} fill="var(--muted-foreground)">• 새 compose = 새 ID</text>
                <text x={42} y={112} fontSize={8.5} fill="var(--muted-foreground)">• 강한 격리</text>
                <text x={42} y={128} fontSize={8.5} fill="var(--muted-foreground)">• 데이터 migration 필요</text>
                <text x={42} y={148} fontSize={8.5} fill={C.warn} fontWeight={600}>장: 보안 명확</text>
                <text x={42} y={164} fontSize={8.5} fill={C.warn} fontWeight={600}>단: 운영 복잡</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                <rect x={245} y={56} width={205} height={140} rx={6} fill={`${C.own}10`} stroke={`${C.own}55`} strokeWidth={0.8} />
                <text x={347} y={76} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.own}>Option B: owner key 공유</text>
                <text x={257} y={96} fontSize={8.5} fill="var(--muted-foreground)">• 같은 owner_pubkey</text>
                <text x={257} y={112} fontSize={8.5} fill="var(--muted-foreground)">• HKDF(owner_key, "shared")</text>
                <text x={257} y={128} fontSize={8.5} fill="var(--muted-foreground)">• 여러 app_id가 공유</text>
                <text x={257} y={148} fontSize={8.5} fill={C.own} fontWeight={600}>장: 무중단 업그레이드</text>
                <text x={257} y={164} fontSize={8.5} fill={C.own} fontWeight={600}>단: 격리 약함</text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
