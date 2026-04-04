import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { indigo: '#6366f1', green: '#10b981', amber: '#f59e0b' };
const ASIDS = [
  { id: 0, label: '하이퍼바이저', key: '없음', color: 'var(--muted-foreground)' },
  { id: 1, label: 'VM #1', key: 'K1', color: C.indigo },
  { id: 2, label: 'VM #2', key: 'K2', color: C.green },
  { id: 'N', label: 'VM #N', key: 'KN', color: C.amber },
];
const GENS = [
  { name: 'Naples', max: 15 },
  { name: 'Rome', max: 509 },
  { name: 'Milan', max: 509 },
  { name: 'Genoa', max: 1006 },
];
const STEPS = [
  { label: 'ASID — VM별 메모리 키 선택자', body: '각 SEV 게스트에 고유 ASID 할당. 메모리 컨트롤러가 ASID로 올바른 암호화 키 선택' },
  { label: 'ASID 매핑 테이블', body: 'ASID 0 = 하이퍼바이저(암호화 없음), ASID 1~N = 각 게스트 VM의 고유 키' },
  { label: '세대별 최대 동시 VM 수', body: 'Naples 15개 → Rome/Milan 509개 → Genoa 1006개로 확장' },
  { label: 'VEK 생명주기', body: 'PSP가 런치 시 랜덤 생성 → 호스트/하이퍼바이저 접근 불가 → VM 종료 시 자동 폐기' },
];

export default function ASIDMappingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ASID table */}
          <motion.g animate={{ opacity: step <= 1 ? 1 : 0.15 }}>
            <rect x={20} y={10} width={260} height={24} rx={4} fill={`${C.indigo}10`} />
            <text x={30} y={26} fontSize={10} fontWeight={700} fill={C.indigo}>ASID</text>
            <text x={100} y={26} fontSize={10} fontWeight={700} fill="var(--foreground)">소유자</text>
            <text x={210} y={26} fontSize={10} fontWeight={700} fill="var(--foreground)">암호화 키</text>
            {ASIDS.map((a, i) => {
              const y = 38 + i * 26;
              const active = step === 1;
              return (
                <g key={i}>
                  {i === 3 && (
                    <text x={140} y={y - 6} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">...</text>
                  )}
                  <rect x={20} y={i === 3 ? y + 2 : y} width={260} height={22} rx={3}
                    fill={active && i > 0 ? `${typeof a.color === 'string' && a.color.startsWith('#') ? a.color : C.indigo}08` : 'transparent'} />
                  <text x={40} y={(i === 3 ? y + 2 : y) + 15} fontSize={10} fontWeight={600}
                    fill={typeof a.color === 'string' && a.color.startsWith('#') ? a.color : 'var(--muted-foreground)'}>{a.id}</text>
                  <text x={100} y={(i === 3 ? y + 2 : y) + 15} fontSize={10} fill="var(--foreground)">{a.label}</text>
                  <text x={210} y={(i === 3 ? y + 2 : y) + 15} fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">{a.key}</text>
                </g>
              );
            })}
          </motion.g>
          {/* Generation table (step 2) */}
          <motion.g animate={{ opacity: step === 2 ? 1 : 0.12 }}>
            <rect x={310} y={10} width={210} height={24} rx={4} fill={`${C.green}10`} />
            <text x={320} y={26} fontSize={10} fontWeight={700} fill={C.green}>세대</text>
            <text x={440} y={26} fontSize={10} fontWeight={700} fill="var(--foreground)">최대 ASID</text>
            {GENS.map((g, i) => {
              const y = 38 + i * 26;
              const barW = (g.max / 1006) * 100;
              return (
                <g key={g.name}>
                  <text x={320} y={y + 15} fontSize={10} fill="var(--foreground)">{g.name}</text>
                  <rect x={400} y={y + 3} width={barW} height={14} rx={3} fill={`${C.green}20`} />
                  <text x={405 + barW} y={y + 15} fontSize={10} fontWeight={600} fill={C.green}>{g.max}</text>
                </g>
              );
            })}
          </motion.g>
          {/* VEK lifecycle (step 3) */}
          <motion.g animate={{ opacity: step === 3 ? 1 : 0.12 }}>
            {['PSP 생성', '실행 중', 'VM 종료'].map((lbl, i) => {
              const x = 320 + i * 72;
              const colors = [C.amber, C.green, '#ef4444'];
              return (
                <g key={lbl}>
                  <rect x={x} y={90} width={64} height={28} rx={5}
                    fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={1.2} />
                  <text x={x + 32} y={108} textAnchor="middle" fontSize={10} fontWeight={600} fill={colors[i]}>{lbl}</text>
                  {i < 2 && (
                    <line x1={x + 64} y1={104} x2={x + 72} y2={104}
                      stroke={colors[i]} strokeWidth={1} markerEnd="url(#asidArr)" />
                  )}
                </g>
              );
            })}
            <text x={392} y={132} textAnchor="middle" fontSize={10} fill={C.amber}>랜덤 생성</text>
            <text x={464} y={132} textAnchor="middle" fontSize={10} fill="#ef4444">자동 폐기</text>
          </motion.g>
          <defs>
            <marker id="asidArr" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={C.amber} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
