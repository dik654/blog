import { motion } from 'framer-motion';

const HOST = '#ef4444';
const GUEST = '#10b981';
const DATA = '#8b5cf6';
const KEY = '#f59e0b';

interface Section { title: string; color: string; items: { name: string; desc: string }[]; }

const SECTIONS: Section[] = [
  {
    title: 'TDH.* — Host-side functions (SEAMCALL)',
    color: HOST,
    items: [
      { name: 'TDH.MNG.*', desc: 'TD 생성/초기화/종료' },
      { name: 'TDH.MEM.*', desc: '메모리 매핑 관리' },
      { name: 'TDH.VP.*', desc: '가상 CPU 관리' },
      { name: 'TDH.PHYMEM.*', desc: '물리 메모리 페이지 관리' },
      { name: 'TDH.SYS.*', desc: '시스템 초기화 / 업데이트' },
    ],
  },
  {
    title: 'TDG.* — Guest-side functions (TDCALL)',
    color: GUEST,
    items: [
      { name: 'TDG.VP.*', desc: 'VM 속성 조회' },
      { name: 'TDG.MEM.*', desc: '메모리 속성 조회' },
      { name: 'TDG.MR.*', desc: 'Measurement (REPORT 생성)' },
      { name: 'TDG.VP.VMCALL', desc: 'Host 서비스 요청 (I/O)' },
      { name: 'TDG.SERVTD.*', desc: 'Service TD 연동' },
    ],
  },
];

const DATA_STRUCTS: { name: string; desc: string }[] = [
  { name: 'TDR', desc: 'TD Root — TD 메타데이터' },
  { name: 'TDCS', desc: 'TD Control — TD 설정' },
  { name: 'TDVPS', desc: 'TD VP State — vCPU 상태' },
  { name: 'SEPT', desc: 'Secure EPT — TD 페이지 테이블' },
];

export default function TdModuleStructViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 420" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TD Module 내부 — TDH / TDG / 데이터 구조 (~5MB)</text>

        {SECTIONS.map((sec, si) => {
          const yBase = 36 + si * 156;
          return (
            <motion.g key={si}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + si * 0.2 }}>
              <rect x={20} y={yBase} width={440} height={146} rx={8}
                fill={sec.color} fillOpacity={0.06} stroke={sec.color} strokeWidth={1} />

              <rect x={20} y={yBase} width={440} height={22} rx={6}
                fill={sec.color} fillOpacity={0.18} />
              <text x={32} y={yBase + 14} fontSize={9} fontWeight={700} fill={sec.color}>
                {sec.title}
              </text>

              {sec.items.map((it, j) => (
                <motion.g key={j}
                  initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + si * 0.2 + j * 0.05 }}>
                  <rect x={32} y={yBase + 32 + j * 22} width={416} height={20} rx={3}
                    fill="var(--card)" stroke={sec.color} strokeWidth={0.4} strokeOpacity={0.5} />
                  <rect x={42} y={yBase + 36 + j * 22} width={120} height={12} rx={2}
                    fill={sec.color} fillOpacity={0.18} />
                  <text x={102} y={yBase + 45 + j * 22} textAnchor="middle"
                    fontSize={7} fontFamily="monospace" fontWeight={700} fill={sec.color}>
                    {it.name}
                  </text>
                  <text x={172} y={yBase + 45 + j * 22} fontSize={7} fill="var(--muted-foreground)">
                    {it.desc}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          );
        })}

        {/* Data structures */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <rect x={20} y={348} width={440} height={20} rx={4}
            fill={DATA} fillOpacity={0.18} stroke={DATA} strokeWidth={0.6} />
          <text x={240} y={362} textAnchor="middle" fontSize={9} fontWeight={700} fill={DATA}>
            내부 데이터 구조
          </text>
        </motion.g>

        {DATA_STRUCTS.map((d, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.78 + i * 0.05 }}>
            <rect x={20 + i * 110} y={374} width={108} height={28} rx={4}
              fill={DATA} fillOpacity={0.06} stroke={DATA} strokeWidth={0.5} />
            <text x={74 + i * 110} y={386} textAnchor="middle"
              fontSize={8} fontFamily="monospace" fontWeight={700} fill={DATA}>
              {d.name}
            </text>
            <text x={74 + i * 110} y={397} textAnchor="middle"
              fontSize={6} fill="var(--muted-foreground)">
              {d.desc}
            </text>
          </motion.g>
        ))}

        {/* Crypto note */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}>
          <text x={240} y={416} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={KEY}>
            + 메모리 암호화 키 관리 (MKTME 키 슬롯 생명주기)
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
