import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'MonadBFT 합의', body: '파이프라인 BFT로 블록 제안/투표/실행을 오버랩합니다.' },
  { label: '병렬 실행 엔진', body: 'Fiber 기반 Optimistic Concurrency로 트랜잭션을 동시에 실행합니다.' },
  { label: 'JIT 컴파일러', body: 'EVM 바이트코드를 x86 네이티브 코드로 변환합니다. 2배 속도 향상.' },
  { label: 'MonadDB (TrieDB)', body: 'io_uring 비동기 I/O와 LRU 캐싱으로 상태 조회를 최적화합니다.' },
];

const LAYERS = [
  { y: 20, label: 'MonadBFT', sub: 'Pipeline BFT Consensus', c: '#8b5cf6' },
  { y: 54, label: 'Parallel Executor', sub: 'Fiber + OCC', c: '#10b981' },
  { y: 88, label: 'JIT Compiler', sub: 'asmjit → x86 native', c: '#0ea5e9' },
  { y: 122, label: 'MonadDB', sub: 'io_uring + LRU cache', c: '#f59e0b' },
];

export default function MonadArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 160" className="w-full max-w-xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const active = i === step;
            return (
              <motion.g key={i} animate={{ opacity: active ? 1 : 0.25 }} transition={{ duration: 0.3 }}>
                <rect x={60} y={l.y} width={300} height={28} rx={6}
                  fill={l.c + (active ? '18' : '08')} stroke={l.c}
                  strokeWidth={active ? 1.5 : 0.7} strokeOpacity={active ? 0.8 : 0.2} />
                <text x={210} y={l.y + 13} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={l.c}>{l.label}</text>
                <text x={210} y={l.y + 23} textAnchor="middle"
                  fontSize={9} fill={l.c} fillOpacity={0.6}>{l.sub}</text>
                {i < 3 && (
                  <line x1={210} y1={l.y + 28} x2={210} y2={l.y + 34}
                    stroke="currentColor" strokeWidth={0.5} strokeOpacity={0.15} />
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
