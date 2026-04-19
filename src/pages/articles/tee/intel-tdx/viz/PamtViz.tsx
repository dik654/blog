import { motion } from 'framer-motion';

const FREE = '#6b7280';
const NDA = '#9ca3af';
const TDP = '#10b981';
const META = '#8b5cf6';
const ATK = '#ef4444';

interface State { name: string; desc: string; color: string; }

const STATES: State[] = [
  { name: 'FREE', desc: '미할당 — 누구도 소유 안 함', color: FREE },
  { name: 'NDA', desc: 'Non-TDX Domain (일반 Host 페이지)', color: NDA },
  { name: 'TD_PAGE', desc: 'TD Private 페이지 (KeyID = TD)', color: TDP },
  { name: 'TD_TDR/TDCS', desc: 'TD 관리 구조체', color: META },
  { name: 'TD_EPT', desc: 'S-EPT 페이지 (테이블)', color: META },
  { name: 'TD_TDVPS', desc: 'vCPU 상태 페이지', color: META },
];

const FLOW: { from: string; to: string; api: string }[] = [
  { from: 'FREE', to: 'NDA', api: 'kernel alloc' },
  { from: 'NDA', to: 'TD_PAGE', api: 'TDH.MEM.PAGE.ADD' },
  { from: 'TD_PAGE', to: 'NDA', api: 'TDH.PHYMEM.PAGE.RECLAIM (WBINVD 후)' },
];

export default function PamtViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 340" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">PAMT — 물리 페이지 상태 머신 (TD Module 소유)</text>

        {/* States grid */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <text x={30} y={42} fontSize={9} fontWeight={700} fill="var(--foreground)">
            페이지 타입
          </text>
        </motion.g>

        {STATES.map((s, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 30 + col * 220;
          const y = 52 + row * 32;
          return (
            <motion.g key={i}
              initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}>
              <rect x={x} y={y} width={210} height={26} rx={4}
                fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth={0.6} />
              <rect x={x} y={y} width={3} height={26} fill={s.color} />
              <text x={x + 8} y={y + 12} fontSize={8} fontFamily="monospace" fontWeight={700} fill={s.color}>
                {s.name}
              </text>
              <text x={x + 8} y={y + 22} fontSize={6.5} fill="var(--muted-foreground)">
                {s.desc}
              </text>
            </motion.g>
          );
        })}

        {/* Transitions */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          <text x={30} y={170} fontSize={9} fontWeight={700} fill="var(--foreground)">
            상태 전이 (원자적, PAMT 갱신 동시 실패 시 reject)
          </text>
        </motion.g>

        {FLOW.map((f, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 + i * 0.1 }}>
            <rect x={20} y={180 + i * 28} width={440} height={22} rx={4}
              fill="var(--muted)" opacity={0.2} stroke="var(--border)" strokeWidth={0.4} />
            <rect x={28} y={184 + i * 28} width={70} height={14} rx={3}
              fill={FREE} fillOpacity={0.18} stroke={FREE} strokeWidth={0.5} />
            <text x={63} y={194 + i * 28} textAnchor="middle"
              fontSize={7} fontFamily="monospace" fontWeight={600} fill="var(--foreground)">
              {f.from}
            </text>
            <text x={108} y={194 + i * 28} fontSize={9} fill="var(--muted-foreground)">→</text>
            <rect x={120} y={184 + i * 28} width={80} height={14} rx={3}
              fill={TDP} fillOpacity={0.18} stroke={TDP} strokeWidth={0.5} />
            <text x={160} y={194 + i * 28} textAnchor="middle"
              fontSize={7} fontFamily="monospace" fontWeight={600} fill="var(--foreground)">
              {f.to}
            </text>
            <text x={210} y={194 + i * 28} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
              {f.api}
            </text>
          </motion.g>
        ))}

        {/* Size info */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
          <rect x={30} y={272} width={420} height={32} rx={6}
            fill={META} fillOpacity={0.08} stroke={META} strokeWidth={0.6} />
          <text x={240} y={288} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={META}>
            메모리 비용
          </text>
          <text x={240} y={300} textAnchor="middle" fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">
            4KB 페이지당 ~16B PAMT · 1TB DRAM → 4GB PAMT (BIOS 예약)
          </text>
        </motion.g>

        {/* Attack defense note */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15 }}>
          <rect x={30} y={310} width={420} height={24} rx={6}
            fill={ATK} fillOpacity={0.06} stroke={ATK} strokeWidth={0.6} strokeDasharray="3 2" />
          <text x={240} y={326} textAnchor="middle" fontSize={7.5} fill={ATK}>
            방어: Host가 동일 페이지 동시 사용 시 PAMT 검사로 두 번째 호출 reject
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
