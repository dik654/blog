import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  ns: '#0ea5e9',
  shr: '#f59e0b',
  sec: '#10b981',
  copy: '#8b5cf6',
  toctou: '#ef4444',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'Linux: tee_shm_alloc() — Normal world physical memory 할당' },
  { label: 'PA 전달 — SMC 인자 또는 shared pointer로 OP-TEE에 송부' },
  { label: 'OP-TEE: NS=1로 secure VA에 매핑 — 양쪽 접근 가능' },
  { label: 'Copy-then-validate — TOCTOU 공격 방어 (한 번 복사 후 검증)' },
  { label: '결과 복사 — secure heap → shared memory → free' },
];

export default function SharedMemoryFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            Shared Memory — Normal ↔ Secure 데이터 전달
          </text>
          {step === 0 && (
            <g>
              <ModuleBox x={30} y={36} w={170} h={42} label="Linux User App" sub="libteec 사용" color={C.ns} />
              <ModuleBox x={30} y={94} w={170} h={42} label="Linux TEE driver" sub="tee_shm_alloc()" color={C.ns} />
              <DataBox x={250} y={50} w={200} h={32} label="TEE_SHM_MAPPED | DMA_BUF" color={C.shr} />
              <DataBox x={250} y={94} w={200} h={42} label="Normal physical memory" sub="NS=1 영역에서 페이지 할당" color={C.shr} outlined />
              <line x1={200} y1={120} x2={250} y2={120} stroke={C.ns} strokeWidth={1} markerEnd="url(#arr-shm)" />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                struct tee_shm *shm = tee_shm_alloc(flags, size)
              </text>
              <text x={240} y={186} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                → kernel page allocator로부터 NS=1 페이지 확보
              </text>
            </g>
          )}
          {step === 1 && (
            <g>
              <ModuleBox x={30} y={36} w={170} h={42} label="Linux Kernel" sub="SMC instruction" color={C.ns} />
              <DataBox x={210} y={50} w={70} h={28} label="x0..x6" sub="레지스터" color={C.copy} />
              <ModuleBox x={290} y={36} w={170} h={42} label="EL3 / OP-TEE" sub="SMC handler" color={C.sec} />
              <line x1={200} y1={58} x2={210} y2={58} stroke={C.copy} strokeWidth={1} markerEnd="url(#arr-shm)" />
              <line x1={280} y1={58} x2={290} y2={58} stroke={C.copy} strokeWidth={1} markerEnd="url(#arr-shm)" />
              <text x={240} y={108} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.copy}>전달 방식</text>
              {[
                '• PA 직접 전달: SMC 인자 (x1, x2, x3...)',
                '• Pointer in shared memory: 큰 구조체 표현',
                '• OP-TEE는 PA를 받아 secure VA로 매핑',
                '• 매핑은 NS=1 (양쪽 접근 가능)',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  x={42} y={132 + i * 16} fontSize={8.5} fill="var(--muted-foreground)">{t}</motion.text>
              ))}
            </g>
          )}
          {step === 2 && (
            <g>
              <ModuleBox x={30} y={36} w={150} h={36} label="Normal World" sub="Linux page" color={C.ns} />
              <ModuleBox x={300} y={36} w={150} h={36} label="Secure World" sub="OP-TEE 매핑" color={C.sec} />
              <DataBox x={190} y={42} w={100} h={24} label="동일 PA" sub="NS=1" color={C.shr} />
              <text x={240} y={94} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                같은 물리 페이지를 양쪽이 매핑 — 데이터 zero-copy
              </text>
              <text x={240} y={114} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.copy}>중요한 보안 가정</text>
              {[
                '✓ Secure world는 Normal world를 신뢰 안 함',
                '✓ Shared memory 내용은 attacker-controlled',
                '✓ 모든 입력은 검증 대상 (포인터 bounds, 길이, 타입)',
                '✓ 직접 사용 금지 — 자체 secure heap에 복사 후 처리',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.2 + i * 0.1 }}
                  x={36} y={138 + i * 18} fontSize={8.5} fill={C.sec} fontWeight={600}>{t}</motion.text>
              ))}
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.toctou}>
                TOCTOU (Time-of-check-to-time-of-use) 방어
              </text>
              {[
                { line: 'void *secure_buf = malloc(size);            // secure heap', c: C.sec, y: 56 },
                { line: 'memcpy(secure_buf, shared_buf, size);       // 한 번만 읽음', c: C.copy, y: 80 },
                { line: 'validate(secure_buf);                       // 자체 버퍼 검증', c: C.sec, y: 104 },
                { line: 'process(secure_buf);                        // 안전한 처리', c: C.sec, y: 128 },
                { line: '// shared_buf는 그동안 외부에서 변경 가능', c: C.toctou, y: 152 },
                { line: '// → 검증 후 변경되어도 secure_buf는 영향 없음', c: C.toctou, y: 168 },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20} y={l.y - 14} width={440} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={l.y} fontSize={8.5} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <AlertBox x={150} y={186} w={180} h={26} label="검증 시점 ≠ 사용 시점 → TOCTOU" color={C.toctou} />
            </g>
          )}
          {step === 4 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.copy}>결과 반환 흐름</text>
              <ActionBox x={30} y={48} w={140} h={36} label="memcpy (out)" sub="secure → shared" color={C.copy} />
              <ActionBox x={180} y={48} w={140} h={36} label="free(secure_buf)" sub="zero before free" color={C.sec} />
              <ActionBox x={330} y={48} w={120} h={36} label="SMC return" sub="status code" color={C.ns} />
              <text x={240} y={108} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.toctou}>주의사항</text>
              {[
                '• Race conditions: 한 번 읽고 자체 검증',
                '• Pointer bounds 엄격 체크 (length, alignment)',
                '• Free 전에 secure data zero-fill (memset_s)',
                '• Cache flush: Secure/NS 캐시 line 동기화 필수',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.2 + i * 0.08 }}
                  x={36} y={132 + i * 18} fontSize={8.5} fill={C.toctou} fontWeight={600}>{t}</motion.text>
              ))}
            </g>
          )}
          <defs>
            <marker id="arr-shm" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={6} markerHeight={6} orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={C.copy} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
