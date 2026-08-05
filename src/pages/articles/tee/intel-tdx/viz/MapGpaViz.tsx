import { motion } from 'framer-motion';

const PRIV = '#10b981';
const SHARED = '#f59e0b';
const TD = '#3b82f6';
const HOST = '#ef4444';
const SEPT = '#8b5cf6';

interface Step { num: number; actor: string; op: string; effect: string; color: string; }

const TO_SHARED: Step[] = [
  { num: 1, actor: 'TD', op: 'cc_mkdec(addr)', effect: 'Shared bit set on PA range', color: TD },
  { num: 2, actor: 'TD', op: 'TDVMCALL_MAP_GPA', effect: 'Host에 매핑 변경 요청', color: TD },
  { num: 3, actor: 'Host', op: 'S-EPT 언매핑 + EPT 매핑', effect: 'KeyID 변경 (TD→0)', color: HOST },
];

const TO_PRIVATE: Step[] = [
  { num: 1, actor: 'TD', op: 'TDVMCALL_MAP_GPA (no shared bit)', effect: 'Host에 private 전환 요청', color: TD },
  { num: 2, actor: 'Host', op: 'EPT 언매핑 + S-EPT 매핑', effect: 'KeyID 변경 (0→TD)', color: HOST },
  { num: 3, actor: 'TD', op: 'tdx_accept_memory(start, end)', effect: 'pending → present 전환', color: PRIV },
];

export default function MapGpaViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 420" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">MapGPA — Private ↔ Shared 페이지 전환</text>

        {/* Two paths header */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <rect x={20} y={32} width={210} height={22} rx={4}
            fill={PRIV} fillOpacity={0.18} stroke={PRIV} strokeWidth={0.6} />
          <text x={125} y={46} textAnchor="middle" fontSize={9} fontWeight={700} fill={PRIV}>
            Private → Shared (DMA 버퍼 할당)
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <rect x={250} y={32} width={210} height={22} rx={4}
            fill={SHARED} fillOpacity={0.18} stroke={SHARED} strokeWidth={0.6} />
          <text x={355} y={46} textAnchor="middle" fontSize={9} fontWeight={700} fill={SHARED}>
            Shared → Private (앱 데이터 회수)
          </text>
        </motion.g>

        {/* Side-by-side step columns */}
        {TO_SHARED.map((s, i) => (
          <motion.g key={`l${i}`}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}>
            <rect x={20} y={62 + i * 56} width={210} height={48} rx={5}
              fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.5} />
            <rect x={20} y={62 + i * 56} width={3} height={48} fill={s.color} />
            <circle cx={38} cy={76 + i * 56} r={8} fill={s.color} />
            <text x={38} y={79 + i * 56} textAnchor="middle"
              fontSize={8} fontWeight={700} fill="white">
              {s.num}
            </text>
            <text x={52} y={76 + i * 56} fontSize={7.5} fontWeight={700} fill={s.color}>
              {s.actor}
            </text>
            <text x={32} y={92 + i * 56} fontSize={7} fontFamily="monospace" fontWeight={600} fill={s.color}>
              {s.op}
            </text>
            <text x={32} y={104 + i * 56} fontSize={6.5} fill="var(--muted-foreground)">
              {s.effect}
            </text>
          </motion.g>
        ))}

        {TO_PRIVATE.map((s, i) => (
          <motion.g key={`r${i}`}
            initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}>
            <rect x={250} y={62 + i * 56} width={210} height={48} rx={5}
              fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.5} />
            <rect x={250} y={62 + i * 56} width={3} height={48} fill={s.color} />
            <circle cx={268} cy={76 + i * 56} r={8} fill={s.color} />
            <text x={268} y={79 + i * 56} textAnchor="middle"
              fontSize={8} fontWeight={700} fill="white">
              {s.num}
            </text>
            <text x={282} y={76 + i * 56} fontSize={7.5} fontWeight={700} fill={s.color}>
              {s.actor}
            </text>
            <text x={262} y={92 + i * 56} fontSize={7} fontFamily="monospace" fontWeight={600} fill={s.color}>
              {s.op}
            </text>
            <text x={262} y={104 + i * 56} fontSize={6.5} fill="var(--muted-foreground)">
              {s.effect}
            </text>
          </motion.g>
        ))}

        {/* Kernel API helpers */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <text x={30} y={258} fontSize={9} fontWeight={700} fill="var(--foreground)">
            Linux 커널 API (set_memory_*)
          </text>
        </motion.g>

        {[
          { fn: 'set_memory_decrypted(vaddr, numpages)', dir: 'Private → Shared', color: SHARED },
          { fn: 'set_memory_encrypted(vaddr, numpages)', dir: 'Shared → Private', color: PRIV },
        ].map((r, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.08 }}>
            <rect x={20} y={266 + i * 30} width={440} height={26} rx={4}
              fill={r.color} fillOpacity={0.08} stroke={r.color} strokeWidth={0.5} />
            <text x={32} y={282 + i * 30} fontSize={7.5} fontFamily="monospace" fontWeight={700} fill={r.color}>
              {r.fn}
            </text>
            <text x={310} y={282 + i * 30} fontSize={7.5} fill="var(--muted-foreground)">
              → {r.dir}
            </text>
          </motion.g>
        ))}

        {/* Critical notes */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}>
          <rect x={30} y={335} width={420} height={75} rx={6}
            fill={SEPT} fillOpacity={0.06} stroke={SEPT} strokeWidth={0.6} strokeDasharray="3 2" />
          <text x={240} y={352} textAnchor="middle" fontSize={9} fontWeight={700} fill={SEPT}>
            왜 MapGPA 필수인가
          </text>
          {[
            'Private 메모리는 디바이스가 읽을 수 없음 (KeyID 다름)',
            'DMA 수행 전 버퍼를 Shared로 전환해야 함',
            'swiotlb (bounce buffer)가 자동 처리 — 커널이 투명하게 전환',
          ].map((line, i) => (
            <motion.text key={i}
              x={240} y={368 + i * 12} textAnchor="middle"
              fontSize={7} fill={SEPT}
              initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.05 + i * 0.05 }}>
              {line}
            </motion.text>
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
