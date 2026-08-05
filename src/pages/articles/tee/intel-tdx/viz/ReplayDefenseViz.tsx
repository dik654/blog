import { motion } from 'framer-motion';

const ATK = '#ef4444';
const OK = '#10b981';
const KEY = '#8b5cf6';
const MEM = '#3b82f6';

export default function ReplayDefenseViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 340" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Replay Attack — TDX 1.5 Cryptographic Integrity 방어</text>

        <defs>
          <marker id="rd-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill={ATK} />
          </marker>
          <marker id="rd-arr-ok" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill={OK} />
          </marker>
        </defs>

        {/* Attack scenario */}
        <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
          <text x={30} y={42} fontSize={9} fontWeight={700} fill={ATK}>
            공격 시나리오: old ciphertext 주입
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <rect x={30} y={50} width={130} height={42} rx={6}
            fill={MEM} fillOpacity={0.12} stroke={MEM} strokeWidth={1} />
          <text x={95} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill={MEM}>
            과거 스냅샷
          </text>
          <text x={95} y={82} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill="var(--muted-foreground)">
            C_old = E(K, P_old, addr)
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <line x1={160} y1={71} x2={210} y2={71}
            stroke={ATK} strokeWidth={1.2} markerEnd="url(#rd-arr)" />
          <text x={185} y={64} textAnchor="middle" fontSize={7} fill={ATK}>주입</text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <rect x={210} y={50} width={130} height={42} rx={6}
            fill={MEM} fillOpacity={0.12} stroke={MEM} strokeWidth={1} />
          <text x={275} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill={MEM}>
            DRAM[addr]
          </text>
          <text x={275} y={82} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill="var(--muted-foreground)">
            C_old (덮어쓰기)
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <line x1={340} y1={71} x2={390} y2={71}
            stroke={MEM} strokeWidth={1.2} markerEnd="url(#rd-arr-ok)" />
          <text x={365} y={64} textAnchor="middle" fontSize={7} fill={MEM}>read</text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          <rect x={385} y={50} width={70} height={42} rx={6}
            fill={KEY} fillOpacity={0.18} stroke={KEY} strokeWidth={1} />
          <text x={420} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={KEY}>
            CPU
          </text>
          <text x={420} y={83} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">
            decrypt + MAC
          </text>
        </motion.g>

        {/* TDX 1.5 MAC */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <text x={30} y={120} fontSize={9} fontWeight={700} fill={OK}>
            TDX 1.5 방어 — 28비트 MAC per 캐시라인
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
          <rect x={30} y={130} width={420} height={48} rx={6}
            fill={OK} fillOpacity={0.08} stroke={OK} strokeWidth={0.8} />
          <text x={240} y={148} textAnchor="middle"
            fontSize={8} fontFamily="monospace" fontWeight={600} fill={OK}>
            MAC = HMAC(key, plaintext || address)
          </text>
          <text x={240} y={163} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            ECC 비트 영역에 저장 · MAC 키 = AES-XTS 데이터 키 (주소 tweak 포함)
          </text>
          <text x={240} y={174} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            검증 실패 → Machine Check Exception → TD poison
          </text>
        </motion.g>

        {/* Comparison table */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
          <text x={30} y={205} fontSize={9} fontWeight={700} fill="var(--foreground)">
            한계와 잔존 위협
          </text>
        </motion.g>

        {[
          { what: '다른 주소의 ciphertext 삽입', ver: 'TDX 1.5 차단', defense: '주소 tweak 불일치 → MAC 실패', bad: false },
          { what: '동일 주소의 과거 ciphertext', ver: 'MAC 검증 통과 가능', defense: 'timestamp 미포함 → 잔존 위험', bad: true },
          { what: '실전 capability', ver: '제한적', defense: 'DMA 격리 + IOMMU + MMU로 차단', bad: false },
        ].map((row, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.95 + i * 0.1 }}>
            <rect x={30} y={215 + i * 38} width={420} height={32} rx={5}
              fill={row.bad ? ATK : OK} fillOpacity={0.06}
              stroke={row.bad ? ATK : OK} strokeWidth={0.6}
              strokeDasharray={row.bad ? '3 2' : 'none'} />
            <text x={42} y={232 + i * 38} fontSize={7.5} fontWeight={700} fill={row.bad ? ATK : OK}>
              {row.what}
            </text>
            <text x={42} y={244 + i * 38} fontSize={7} fill="var(--muted-foreground)">
              {row.ver} — {row.defense}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
