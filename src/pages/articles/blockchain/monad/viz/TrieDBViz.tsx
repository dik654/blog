import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const REFS = ['monad-triedb-node', 'monad-triedb-node', 'monad-io-uring', 'monad-io-uring'];
const STEPS = [
  { label: 'Trie 조회 요청', body: 'EVM 실행 중 계정/스토리지 접근 시 nibble 키로 Trie 탐색을 시작합니다.' },
  { label: 'LRU 캐시 확인', body: '루트 근처 노드는 캐시에서 즉시 반환합니다. 히트율 최적화.' },
  { label: 'io_uring 비동기 읽기', body: '캐시 미스 시 io_uring SQE로 디스크 읽기를 배치 제출합니다.' },
  { label: 'CQE 완료 + 응답', body: '완료 큐에서 결과를 수신하여 노드를 역직렬화합니다.' },
];

const NODES = [
  { x: 180, y: 15, label: 'Root', c: '#8b5cf6', w: 60 },
  { x: 120, y: 55, label: 'Branch', c: '#0ea5e9', w: 55 },
  { x: 240, y: 55, label: 'Branch', c: '#0ea5e9', w: 55 },
  { x: 90, y: 95, label: 'Leaf', c: '#10b981', w: 45 },
  { x: 160, y: 95, label: 'Ext', c: '#f59e0b', w: 45 },
];

export default function TrieDBViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
        <svg viewBox="0 0 440 140" className="w-full max-w-xl mx-auto" style={{ height: 'auto' }}>
          {/* Trie nodes */}
          {NODES.map((n, i) => {
            const highlightLevel = step === 0 ? 0 : step === 1 && i < 3 ? i : -1;
            const active = highlightLevel === i || (step >= 2 && i >= 3);
            return (
              <motion.g key={i} animate={{ opacity: active ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}>
                <rect x={n.x} y={n.y} width={n.w} height={22} rx={5}
                  fill={n.c + (active ? '18' : '06')} stroke={n.c}
                  strokeWidth={active ? 1.2 : 0.5} strokeOpacity={active ? 0.7 : 0.15} />
                <text x={n.x + n.w / 2} y={n.y + 14} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={n.c}>{n.label}</text>
              </motion.g>
            );
          })}
          {/* Edges */}
          <line x1={210} y1={37} x2={148} y2={55} stroke="currentColor" strokeWidth={0.5} strokeOpacity={0.12} />
          <line x1={210} y1={37} x2={268} y2={55} stroke="currentColor" strokeWidth={0.5} strokeOpacity={0.12} />
          <line x1={140} y1={77} x2={112} y2={95} stroke="currentColor" strokeWidth={0.5} strokeOpacity={0.12} />
          <line x1={155} y1={77} x2={182} y2={95} stroke="currentColor" strokeWidth={0.5} strokeOpacity={0.12} />

          {/* io_uring box */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
            <rect x={330} y={40} width={90} height={50} rx={6}
              fill="#f59e0b08" stroke="#f59e0b" strokeWidth={step >= 2 ? 1.2 : 0.5}
              strokeOpacity={step >= 2 ? 0.6 : 0.1} />
            <text x={375} y={55} textAnchor="middle" fontSize={9} fontWeight={600}
              fill="#f59e0b">io_uring</text>
            <text x={375} y={67} textAnchor="middle" fontSize={9} fill="#f59e0b"
              fillOpacity={0.6}>SQE → CQE</text>
            <text x={375} y={80} textAnchor="middle" fontSize={9} fill="#f59e0b"
              fillOpacity={0.4}>4.17x speedup</text>
          </motion.g>

          {/* Arrow trie → io_uring */}
          {step >= 2 && (
            <motion.line x1={295} y1={66} x2={328} y2={66}
              stroke="#f59e0b" strokeWidth={1} strokeOpacity={0.4}
              strokeDasharray="3 2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }} />
          )}
        </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(REFS[step])} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
