import { motion } from 'framer-motion';

const SRC = '#3b82f6';
const DST = '#10b981';
const MIG = '#8b5cf6';
const NET = '#f59e0b';

interface Stage { num: number; title: string; desc: string; color: string; }

const STAGES: Stage[] = [
  { num: 1, title: 'MigTD 실행 (양쪽)', desc: 'Service TD · Migration key 관리', color: MIG },
  { num: 2, title: '상호 Attestation', desc: 'Quote 교환 + 정책 검증 + ECDH 세션 키', color: MIG },
  { num: 3, title: 'Key Re-encryption', desc: 'tdh_export_mem(page) → 세션 키로 재암호화', color: SRC },
  { num: 4, title: 'Network Transfer', desc: 'send_over_network(encrypted_page)', color: NET },
  { num: 5, title: 'Import on Dest', desc: 'tdh_import_mem(page, dst_hkid) → 새 KeyID', color: DST },
  { num: 6, title: 'Resume Execution', desc: 'tdh_vp_enter(migrated_td)', color: DST },
];

export default function LiveMigrationViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 380" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Live Migration — TDX 1.5 MigTD 기반</text>

        <defs>
          <marker id="lm-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill={NET} />
          </marker>
        </defs>

        {/* Source / Destination overview */}
        <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
          <rect x={20} y={36} width={150} height={50} rx={6}
            fill={SRC} fillOpacity={0.12} stroke={SRC} strokeWidth={1} />
          <text x={95} y={56} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={SRC}>
            Source Host
          </text>
          <text x={95} y={71} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            TD + MigTD
          </text>
          <text x={95} y={82} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill={SRC}>
            HKID_src
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <line x1={170} y1={61} x2={310} y2={61}
            stroke={NET} strokeWidth={1.4} strokeDasharray="4 3" markerEnd="url(#lm-arr)" />
          <rect x={195} y={48} width={90} height={14} rx={3}
            fill={NET} fillOpacity={0.18} stroke={NET} strokeWidth={0.4} />
          <text x={240} y={58} textAnchor="middle"
            fontSize={7} fontFamily="monospace" fontWeight={700} fill={NET}>
            session-key encrypted
          </text>
        </motion.g>

        <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <rect x={310} y={36} width={150} height={50} rx={6}
            fill={DST} fillOpacity={0.12} stroke={DST} strokeWidth={1} />
          <text x={385} y={56} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={DST}>
            Destination Host
          </text>
          <text x={385} y={71} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            새 TD + MigTD
          </text>
          <text x={385} y={82} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill={DST}>
            HKID_dst
          </text>
        </motion.g>

        {/* Stages */}
        {STAGES.map((s, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}>
            <rect x={20} y={108 + i * 36} width={440} height={30} rx={4}
              fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.5} />
            <rect x={20} y={108 + i * 36} width={3.5} height={30} fill={s.color} />

            <circle cx={42} cy={123 + i * 36} r={9} fill={s.color} />
            <text x={42} y={126 + i * 36} textAnchor="middle"
              fontSize={9} fontWeight={700} fill="white">
              {s.num}
            </text>

            <text x={62} y={120 + i * 36} fontSize={8.5} fontWeight={700} fill={s.color}>
              {s.title}
            </text>
            <text x={62} y={132 + i * 36} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
              {s.desc}
            </text>
          </motion.g>
        ))}

        {/* Security guarantees */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
          <rect x={30} y={332} width={420} height={42} rx={6}
            fill={MIG} fillOpacity={0.08} stroke={MIG} strokeWidth={0.6} strokeDasharray="3 2" />
          <text x={240} y={348} textAnchor="middle" fontSize={9} fontWeight={700} fill={MIG}>
            보안 속성
          </text>
          <text x={240} y={362} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            원본 KeyID 네트워크 노출 안 됨 · 세션 키 일회용 · MigTD가 정책 강제 (이동 허용 플랫폼 제한)
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
