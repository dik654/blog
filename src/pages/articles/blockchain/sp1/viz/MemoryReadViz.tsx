import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'CPU (mr 호출)', sub: 'LW/LH/LB', color: '#6366f1' },
  { label: '정렬 검사', sub: 'addr % 4 == 0', color: '#ef4444' },
  { label: '페이지 조회', sub: 'addr >> 14', color: '#10b981' },
  { label: '레코드 읽기', sub: 'value + timestamp', color: '#f59e0b' },
  { label: '이벤트 기록', sub: 'MemoryReadRecord', color: '#8b5cf6' },
  { label: 'TS 갱신', sub: 'shard + timestamp', color: '#ec4899' },
];

const NW = 78, GAP = 82, SY = 40;
const nx = (i: number) => 4 + i * GAP;
const EDGES = ['addr', '유효', '페이지 히트', 'prev 값', '기록 완료'];

const STEPS = [
  { label: 'CPU 요청', body: 'LW/LH/LB 명령어가 메모리 읽기를 요청합니다.' },
  { label: '정렬 검사', body: '주소가 4바이트 정렬인지 확인합니다. 미정렬 시 패닉.' },
  { label: '페이지 조회', body: '상위 비트(addr >> 14)로 PagedMemory 페이지를 찾습니다.' },
  { label: '레코드 읽기', body: '현재 value와 이전 shard/timestamp를 읽습니다.' },
  { label: '이벤트 기록', body: 'MemoryReadRecord를 생성해 증명용 이벤트 로그에 추가합니다.' },
  { label: '타임스탬프 갱신', body: '현재 shard와 글로벌 클럭으로 타임스탬프를 업데이트합니다.' },
];

export default function MemoryReadViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 640 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="mr-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => step > i && (
            <motion.g key={`e${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
              <line x1={nx(i) + NW} y1={SY + 19} x2={nx(i + 1)} y2={SY + 19}
                stroke="var(--muted-foreground)" strokeWidth={1.2} markerEnd="url(#mr-ah)" />
              <rect x={(nx(i) + NW + nx(i + 1)) / 2 - 18} y={SY + 6} width={36} height={11} rx={2} fill="var(--card)" />
              <text x={(nx(i) + NW + nx(i + 1)) / 2} y={SY + 13}
                textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{lbl}</text>
            </motion.g>
          ))}
          {NODES.map((n, i) => i <= step && (
            <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}>
              <rect x={nx(i)} y={SY} width={NW} height={38} rx={7}
                fill={n.color + '18'} stroke={n.color} strokeWidth={step === i ? 2 : 1} />
              <text x={nx(i) + NW / 2} y={SY + 15} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
              <text x={nx(i) + NW / 2} y={SY + 28} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">{n.sub}</text>
            </motion.g>
          ))}
          {/* Alignment check warning */}
          {step === 1 && (
            <motion.text x={nx(1) + NW / 2} y={SY + 52} textAnchor="middle"
              fontSize={9} fill="#ef4444" fontWeight={600}
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>미정렬 시 패닉!</motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
