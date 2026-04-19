import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  root: '#6366f1',
  core: '#10b981',
  lib: '#0ea5e9',
  ta: '#f59e0b',
  ext: '#8b5cf6',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'core/ — OP-TEE OS 커널 (arch · kernel · mm · tee · crypto)' },
  { label: 'lib/ — 공통 라이브러리 (libutee · libutils · libmbedtls)' },
  { label: 'ta/ — 샘플 Trusted Apps (aes · hello_world · secure_storage)' },
  { label: '연관 레포 — optee_client · optee_test · optee_examples · build' },
];

interface Node {
  id: string; name: string; comment: string; depth: number; y: number;
  color: string; group: 0 | 1 | 2 | 3;
}

const NODES: Node[] = [
  { id: 'root', name: 'optee_os/', comment: 'OS 본체', depth: 0, y: 18, color: C.root, group: 0 },
  { id: 'core', name: 'core/', comment: 'TEE OS 커널', depth: 1, y: 36, color: C.core, group: 0 },
  { id: 'arch', name: 'arch/arm/', comment: 'ARM-specific 코드', depth: 2, y: 50, color: C.core, group: 0 },
  { id: 'kernel', name: 'kernel/', comment: 'Thread, IRQ, syscall', depth: 2, y: 64, color: C.core, group: 0 },
  { id: 'mm', name: 'mm/', comment: 'MMU, secure DDR', depth: 2, y: 78, color: C.core, group: 0 },
  { id: 'tee', name: 'tee/', comment: 'TEE core services', depth: 2, y: 92, color: C.core, group: 0 },
  { id: 'crypto', name: 'crypto/', comment: 'mbedTLS / libtomcrypt', depth: 2, y: 106, color: C.core, group: 0 },
  { id: 'lib', name: 'lib/', comment: '공통 라이브러리', depth: 1, y: 36, color: C.lib, group: 1 },
  { id: 'libutee', name: 'libutee/', comment: 'TA용 libc subset', depth: 2, y: 50, color: C.lib, group: 1 },
  { id: 'libutils', name: 'libutils/', comment: '유틸리티', depth: 2, y: 64, color: C.lib, group: 1 },
  { id: 'libmbedtls', name: 'libmbedtls/', comment: 'Crypto backend', depth: 2, y: 78, color: C.lib, group: 1 },
  { id: 'ta', name: 'ta/', comment: '샘플 Trusted Apps', depth: 1, y: 36, color: C.ta, group: 2 },
  { id: 'aes', name: 'aes/', comment: 'AES encrypt/decrypt', depth: 2, y: 50, color: C.ta, group: 2 },
  { id: 'hello', name: 'hello_world/', comment: 'Tutorial TA', depth: 2, y: 64, color: C.ta, group: 2 },
  { id: 'sstor', name: 'secure_storage/', comment: 'Persistent storage TA', depth: 2, y: 78, color: C.ta, group: 2 },
  { id: 'optee_client', name: 'optee_client', comment: 'libteec — Linux 측 client lib', depth: 0, y: 36, color: C.ext, group: 3 },
  { id: 'optee_test', name: 'optee_test', comment: 'xtest 테스트 suite', depth: 0, y: 56, color: C.ext, group: 3 },
  { id: 'optee_examples', name: 'optee_examples', comment: '샘플 앱', depth: 0, y: 76, color: C.ext, group: 3 },
  { id: 'build', name: 'build', comment: 'Yocto/Linaro 빌드 환경', depth: 0, y: 96, color: C.ext, group: 3 },
];

export default function RepoDirTreeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={12} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            optee_os 디렉토리 구조
          </text>
          {NODES.map((n, i) => {
            const visible = n.group === step || (step === 0 && n.id === 'root');
            const x = 30 + n.depth * 22;
            return (
              <motion.g key={n.id} animate={{ opacity: visible ? 1 : 0.08 }} transition={{ ...sp, delay: visible ? i * 0.025 : 0 }}>
                {n.depth > 0 && (
                  <line x1={x - 14} y1={n.y + 7} x2={x - 4} y2={n.y + 7} stroke={n.color} strokeWidth={0.8} opacity={0.6} />
                )}
                {n.depth > 0 && (
                  <line x1={x - 14} y1={n.y - 6} x2={x - 14} y2={n.y + 7} stroke={n.color} strokeWidth={0.8} opacity={0.4} />
                )}
                <rect x={x} y={n.y - 1} width={n.depth === 2 ? 90 : 110} height={14} rx={3}
                  fill={`${n.color}12`} stroke={`${n.color}55`} strokeWidth={0.7} />
                <text x={x + 6} y={n.y + 9} fontSize={9} fontWeight={n.depth === 0 ? 700 : 600} fill={n.color}
                  fontFamily="monospace">{n.name}</text>
                <text x={x + (n.depth === 2 ? 100 : 120)} y={n.y + 9} fontSize={8} fill="var(--muted-foreground)">
                  {n.comment}
                </text>
              </motion.g>
            );
          })}
          <motion.g key={`legend-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.3 }}>
            <rect x={20} y={140} width={440} height={22} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
            <text x={240} y={154} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              {step === 0 && 'core = OP-TEE OS의 모든 커널 코드 — arch는 SoC별 분기, mm은 MMU/메모리, tee는 GP API 구현'}
              {step === 1 && 'lib = TA와 OS 양쪽이 공유 — libutee는 TA 표준 헤더, libmbedtls는 SW crypto'}
              {step === 2 && 'ta = 빌드시 함께 컴파일되는 샘플 — UUID로 식별, .ta 파일로 secure storage 로드'}
              {step === 3 && '실제 시스템 = optee_os + optee_client(libteec) + Linux + U-Boot + ATF 조합'}
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
