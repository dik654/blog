import { motion } from 'framer-motion';

const HOST = '#ef4444';
const TD = '#10b981';
const SEAM = '#8b5cf6';
const PEND = '#f59e0b';

interface Step { side: 'host' | 'guest'; api: string; effect: string; }

const STEPS: Step[] = [
  { side: 'host', api: 'TDH.MEM.SEPT.ADD', effect: 'S-EPT 중간 레벨 페이지 테이블 추가' },
  { side: 'host', api: 'TDH.MEM.PAGE.AUG', effect: '실제 페이지 바인딩 (pending 상태)' },
  { side: 'guest', api: 'TDG.MEM.PAGE.ACCEPT', effect: 'pending → present 전환 + zero 검증' },
];

export default function SeptStructureViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 320" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Secure EPT — TD Module 소유 4-레벨 페이지 테이블</text>

        <defs>
          <marker id="se-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill={SEAM} />
          </marker>
        </defs>

        {/* Three actors */}
        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <rect x={20} y={40} width={120} height={32} rx={6}
            fill={HOST} fillOpacity={0.15} stroke={HOST} strokeWidth={1} />
          <text x={80} y={56} textAnchor="middle" fontSize={9} fontWeight={700} fill={HOST}>
            Host (KVM-TDX)
          </text>
          <text x={80} y={67} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">
            SEAMCALL 호출자
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <rect x={180} y={40} width={120} height={32} rx={6}
            fill={SEAM} fillOpacity={0.15} stroke={SEAM} strokeWidth={1} />
          <text x={240} y={56} textAnchor="middle" fontSize={9} fontWeight={700} fill={SEAM}>
            TD Module
          </text>
          <text x={240} y={67} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">
            S-EPT 직접 수정자
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <rect x={340} y={40} width={120} height={32} rx={6}
            fill={TD} fillOpacity={0.15} stroke={TD} strokeWidth={1} />
          <text x={400} y={56} textAnchor="middle" fontSize={9} fontWeight={700} fill={TD}>
            TD Guest
          </text>
          <text x={400} y={67} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">
            TDCALL 호출자
          </text>
        </motion.g>

        {/* Sequence */}
        {STEPS.map((s, i) => {
          const y = 100 + i * 50;
          const fromX = s.side === 'host' ? 80 : 400;
          const fromColor = s.side === 'host' ? HOST : TD;
          return (
            <motion.g key={i}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.18 }}>
              <text x={20} y={y - 8} fontSize={8} fontWeight={700} fill={fromColor}>
                Step {i + 1}
              </text>

              {/* Arrow line */}
              <line x1={fromX} y1={y} x2={240} y2={y}
                stroke={SEAM} strokeWidth={1.2} markerEnd="url(#se-arr)"
                strokeDasharray={s.side === 'guest' ? '4 2' : 'none'} />

              {/* API call label */}
              <rect x={120} y={y - 12} width={120} height={14} rx={3}
                fill={SEAM} fillOpacity={0.12} stroke={SEAM} strokeWidth={0.5} />
              <text x={180} y={y - 2} textAnchor="middle"
                fontSize={7} fontFamily="monospace" fontWeight={600} fill={SEAM}>
                {s.api}
              </text>

              {/* Effect */}
              <rect x={20} y={y + 8} width={440} height={22} rx={4}
                fill="var(--muted)" opacity={0.2} stroke="var(--border)" strokeWidth={0.4} />
              <text x={240} y={22 + y} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                {s.effect}
              </text>
            </motion.g>
          );
        })}

        {/* Why accept */}
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
          <rect x={30} y={258} width={420} height={50} rx={8}
            fill={PEND} fillOpacity={0.08} stroke={PEND} strokeWidth={1} strokeDasharray="3 2" />
          <text x={240} y={275} textAnchor="middle" fontSize={9} fontWeight={700} fill={PEND}>
            왜 ACCEPT가 필수인가
          </text>
          <text x={240} y={290} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            Host가 페이지 교체·재매핑하는 공격 차단
          </text>
          <text x={240} y={302} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            TD가 명시적으로 "이 GPA를 새로 받겠다" 승인 → S-EPT entry present
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
