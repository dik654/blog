import { motion } from 'framer-motion';

const KID = '#f59e0b';
const PA = '#3b82f6';
const HOST = '#6b7280';
const TD = '#10b981';

interface RowDef { kid: string; pa: string; owner: string; color: string; }

const ROWS: RowDef[] = [
  { kid: '0', pa: '0x0000_0000_1234_5000', owner: 'Host (TME 공유)', color: HOST },
  { kid: '1', pa: '0x0001_0000_1234_5000', owner: 'TD #1 (private)', color: TD },
  { kid: '3', pa: '0x0003_0000_1234_5000', owner: 'TD #3 (private)', color: TD },
  { kid: '63', pa: '0x003F_0000_1234_5000', owner: '최대 KeyID = MAX_KEYID', color: KID },
];

export default function KeyIdEncodingViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 320" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">KeyID 인코딩 — PA 상위 비트로 키 선택</text>

        {/* PA layout */}
        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <text x={30} y={42} fontSize={9} fontWeight={700} fill="var(--foreground)">52비트 물리 주소 레이아웃</text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <rect x={30} y={50} width={120} height={36} rx={4}
            fill={KID} fillOpacity={0.18} stroke={KID} strokeWidth={1.2} />
          <text x={90} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill={KID}>
            KeyID
          </text>
          <text x={90} y={80} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            6비트 (예: bits 51..46)
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <rect x={150} y={50} width={300} height={36} rx={4}
            fill={PA} fillOpacity={0.12} stroke={PA} strokeWidth={1} />
          <text x={300} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill={PA}>
            실제 PA (46비트)
          </text>
          <text x={300} y={80} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            메모리 컨트롤러가 실제 DRAM 주소로 사용
          </text>
        </motion.g>

        {/* Bit positions */}
        <text x={30} y={98} fontSize={6.5} fontFamily="monospace" fill="var(--muted-foreground)">bit 51</text>
        <text x={150} y={98} fontSize={6.5} fontFamily="monospace" fill="var(--muted-foreground)">bit 46</text>
        <text x={420} y={98} fontSize={6.5} fontFamily="monospace" fill="var(--muted-foreground)">bit 0</text>

        {/* CPUID source */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <rect x={30} y={115} width={420} height={48} rx={6}
            fill="var(--muted)" opacity={0.25} stroke="var(--border)" strokeWidth={0.5} />
          <text x={240} y={132} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
            CPUID(0x1F)로 KeyID 비트 폭 조회
          </text>
          <text x={240} y={146} textAnchor="middle" fontSize={7} fontFamily="monospace" fill={KID}>
            EBX[7:0] = MAX_KEYID_BITS (예: 6 → 64개 KeyID)
          </text>
          <text x={240} y={158} textAnchor="middle" fontSize={7} fontFamily="monospace" fill={KID}>
            EDX[15:0] = MAX_KEYID (예: 63)
          </text>
        </motion.g>

        {/* Examples table */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          <text x={30} y={185} fontSize={9} fontWeight={700} fill="var(--foreground)">KeyID 분배 예시</text>
        </motion.g>

        {/* Header */}
        <text x={42} y={203} fontSize={7} fontWeight={600} fill="var(--muted-foreground)">KeyID</text>
        <text x={100} y={203} fontSize={7} fontWeight={600} fill="var(--muted-foreground)">물리 주소 예시</text>
        <text x={325} y={203} fontSize={7} fontWeight={600} fill="var(--muted-foreground)">소유자</text>

        {ROWS.map((r, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 + i * 0.07 }}>
            <rect x={30} y={210 + i * 22} width={420} height={20} rx={3}
              fill={r.color} fillOpacity={0.06} stroke={r.color} strokeWidth={0.5} />
            <rect x={42} y={213 + i * 22} width={42} height={14} rx={2}
              fill={r.color} fillOpacity={0.2} stroke={r.color} strokeWidth={0.5} />
            <text x={63} y={224 + i * 22} textAnchor="middle"
              fontSize={7.5} fontFamily="monospace" fontWeight={700} fill={r.color}>
              {r.kid}
            </text>
            <text x={100} y={224 + i * 22} fontSize={7.5} fontFamily="monospace" fill={r.color}>
              {r.pa}
            </text>
            <text x={325} y={224 + i * 22} fontSize={7.5} fill="var(--muted-foreground)">
              {r.owner}
            </text>
          </motion.g>
        ))}

        {/* Note */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
          <text x={240} y={310} textAnchor="middle" fontSize={7.5}
            fill="var(--muted-foreground)">
            TD에는 KeyID 필드 투명 — TD Module이 PA 변환 시 자동 주입
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
