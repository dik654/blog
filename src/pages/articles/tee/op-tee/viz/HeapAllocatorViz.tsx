import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  pool: '#10b981',
  alloc: '#0ea5e9',
  guard: '#f59e0b',
  aslr: '#8b5cf6',
  canary: '#6366f1',
  asan: '#ef4444',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'tee_mm_pool — bit-fields 기반 secure heap allocator' },
  { label: 'tee_mm_alloc() — best-fit 또는 first-fit + split + mark used' },
  { label: 'Guard pages — 할당 영역 앞뒤에 unmapped page (overflow 즉시 탐지)' },
  { label: 'ASLR + Stack canary — TA 로드/stack 랜덤화 + ROP 방어' },
  { label: 'KASAN — shadow memory로 out-of-bounds 탐지 (개발 빌드)' },
];

export default function HeapAllocatorViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            OP-TEE 보안 페이지 할당자 (core/mm/tee_mm.c)
          </text>
          {step === 0 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.pool}>
                struct tee_mm_pool 구조
              </text>
              {[
                { f: 'lo', t: 'vaddr_t', d: 'Pool 시작 주소' },
                { f: 'hi', t: 'vaddr_t', d: 'Pool 끝 주소' },
                { f: 'size', t: 'size_t', d: '총 크기' },
                { f: 'align', t: 'size_t', d: 'Alignment (보통 PAGE_SIZE)' },
                { f: 'entry', t: 'tee_mm_entry *', d: 'free list head' },
                { f: 'lock', t: 'mutex', d: '동시성 보호' },
              ].map((r, i) => (
                <motion.g key={r.f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <rect x={30} y={52 + i * 22} width={420} height={18} rx={3}
                    fill={`${C.pool}10`} stroke={`${C.pool}45`} strokeWidth={0.6} />
                  <text x={42} y={65 + i * 22} fontSize={9} fontWeight={700} fontFamily="monospace" fill={C.pool}>{r.f}</text>
                  <text x={100} y={65 + i * 22} fontSize={8} fill="var(--muted-foreground)" fontFamily="monospace">{r.t}</text>
                  <text x={210} y={65 + i * 22} fontSize={8.5} fill="var(--muted-foreground)">{r.d}</text>
                </motion.g>
              ))}
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Bit-fields → 페이지 단위로 used/free 추적
              </text>
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.alloc}>
                tee_mm_alloc() 흐름
              </text>
              {[
                'mutex_lock(&pool->lock)',
                'find_free_block(pool, size)  // best-fit 또는 first-fit',
                'split_if_needed(entry, size)  // 큰 block은 분할',
                'mark_used(entry)',
                'mutex_unlock(&pool->lock)',
                'return entry',
              ].map((line, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={30} y={52 + i * 22} width={420} height={18} rx={3}
                    fill={`${C.alloc}10`} stroke={`${C.alloc}40`} strokeWidth={0.6} />
                  <text x={42} y={65 + i * 22} fontSize={9} fontFamily="monospace" fill={C.alloc} fontWeight={600}>{line}</text>
                </motion.g>
              ))}
              <ActionBox x={140} y={186} w={200} h={28} label="Locked critical section" sub="multi-thread safe" color={C.alloc} />
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.guard}>
                Guard Pages 배치 (canary page)
              </text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <rect x={30} y={64} width={70} height={50} rx={4} fill={`${C.guard}30`} stroke={C.guard} strokeWidth={1} strokeDasharray="3 2" />
                <text x={65} y={84} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.guard}>UNMAP</text>
                <text x={65} y={98} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">guard before</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                <rect x={110} y={64} width={260} height={50} rx={4} fill={`${C.pool}20`} stroke={C.pool} strokeWidth={1} />
                <text x={240} y={84} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.pool}>Allocated buffer</text>
                <text x={240} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">user-requested size · aligned to PAGE_SIZE</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={380} y={64} width={70} height={50} rx={4} fill={`${C.guard}30`} stroke={C.guard} strokeWidth={1} strokeDasharray="3 2" />
                <text x={415} y={84} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.guard}>UNMAP</text>
                <text x={415} y={98} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">guard after</text>
              </motion.g>
              <text x={240} y={138} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Buffer overflow 시 unmapped page 접근 → 즉시 fault
              </text>
              <AlertBox x={130} y={154} w={220} h={32} label="Heap overflow 즉시 탐지" sub="전통 방식: 다른 데이터를 덮어쓴 후 발견" color={C.guard} />
            </g>
          )}
          {step === 3 && (
            <g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <rect x={30} y={36} width={205} height={150} rx={6} fill={`${C.aslr}10`} stroke={`${C.aslr}55`} strokeWidth={0.8} />
                <text x={132} y={56} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.aslr}>ASLR (랜덤 매핑)</text>
                <text x={42} y={78} fontSize={8.5} fill="var(--muted-foreground)">• TA 로드 주소 랜덤화</text>
                <text x={42} y={94} fontSize={8.5} fill="var(--muted-foreground)">• Stack base 랜덤화</text>
                <text x={42} y={110} fontSize={8.5} fill="var(--muted-foreground)">• Heap base 랜덤화</text>
                <text x={42} y={126} fontSize={8.5} fill="var(--muted-foreground)">• ROP/JOP 공격 mitigations</text>
                <text x={42} y={146} fontSize={8.5} fill={C.aslr} fontWeight={600}>매번 부팅마다 다른 주소</text>
                <text x={42} y={166} fontSize={8} fill="var(--muted-foreground)">└ kernel.randomize_va_space</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                <rect x={245} y={36} width={205} height={150} rx={6} fill={`${C.canary}10`} stroke={`${C.canary}55`} strokeWidth={0.8} />
                <text x={347} y={56} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.canary}>Stack canary</text>
                <text x={257} y={78} fontSize={8.5} fill="var(--muted-foreground)">• 함수 prologue: stack에 canary 푸시</text>
                <text x={257} y={94} fontSize={8.5} fill="var(--muted-foreground)">• Local buffer 위에 위치</text>
                <text x={257} y={110} fontSize={8.5} fill="var(--muted-foreground)">• Epilogue: canary 값 검증</text>
                <text x={257} y={126} fontSize={8.5} fill="var(--muted-foreground)">• 다르면 __stack_chk_fail()</text>
                <text x={257} y={146} fontSize={8.5} fill={C.canary} fontWeight={600}>Buffer overflow 탐지</text>
                <text x={257} y={166} fontSize={8} fill="var(--muted-foreground)">└ -fstack-protector-strong</text>
              </motion.g>
            </g>
          )}
          {step === 4 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.asan}>
                KASAN (Kernel Address Sanitizer)
              </text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <rect x={30} y={56} width={200} height={36} rx={5} fill={`${C.pool}15`} stroke={C.pool} strokeWidth={0.8} />
                <text x={130} y={73} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.pool}>실제 메모리</text>
                <text x={130} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">8 bytes per granule</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                <rect x={250} y={56} width={200} height={36} rx={5} fill={`${C.asan}15`} stroke={C.asan} strokeWidth={0.8} />
                <text x={350} y={73} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.asan}>Shadow memory</text>
                <text x={350} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">1 byte per 8 bytes (1/8 크기)</text>
              </motion.g>
              {[
                'Compiler가 메모리 접근 전에 shadow check 삽입',
                'Shadow byte: 0 = OK, >0 = redzone, <0 = freed',
                'Out-of-bounds, use-after-free, double-free 탐지',
                '개발/디버그 빌드만 활성화 (10~30% 오버헤드)',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.4 + i * 0.1 }}
                  x={42} y={114 + i * 18} fontSize={8.5} fill={C.asan}>
                  • {t}
                </motion.text>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
