import { motion } from 'framer-motion';

const TD = '#10b981';
const MAA = '#3b82f6';
const RP = '#8b5cf6';
const JWT = '#f59e0b';

interface Step { num: number; from: string; to: string; payload: string; color: string; }

const STEPS: Step[] = [
  { num: 1, from: 'TD App', to: '/dev/tdx_guest', payload: 'ioctl(TDX_CMD_GET_QUOTE)', color: TD },
  { num: 2, from: 'TD Guest', to: 'MAA endpoint', payload: 'POST /attest/TdxVm', color: MAA },
  { num: 3, from: 'MAA', to: 'Intel PCS', payload: 'verify quote (cert chain + TCB)', color: MAA },
  { num: 4, from: 'MAA', to: 'TD App', payload: 'JWT (signed claims)', color: JWT },
  { num: 5, from: 'TD App', to: 'Relying Party', payload: 'attach JWT to request', color: RP },
  { num: 6, from: 'Relying Party', to: 'MAA signing key', payload: 'jwt.verify(jwt, key)', color: RP },
];

const CLAIMS: { key: string; value: string }[] = [
  { key: 'tdx_mrtd', value: '<base64 SHA-384>' },
  { key: 'tdx_rtmr0..3', value: '<runtime measurements>' },
  { key: 'tcb_status', value: 'UpToDate' },
  { key: 'x-ms-runtime', value: '{ user data }' },
  { key: 'x-ms-policy-hash', value: '<policy SHA-256>' },
];

export default function AzureMaaViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 400" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Azure MAA — Microsoft Attestation Service 플로우</text>

        {/* URL */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <rect x={20} y={32} width={440} height={20} rx={4}
            fill={MAA} fillOpacity={0.1} stroke={MAA} strokeWidth={0.6} />
          <text x={240} y={45} textAnchor="middle"
            fontSize={7} fontFamily="monospace" fill={MAA}>
            POST https://sharedeus2.eus2.attest.azure.net/attest/TdxVm?api-version=2023-04-01-preview
          </text>
        </motion.g>

        {STEPS.map((s, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}>
            <rect x={20} y={62 + i * 32} width={440} height={28} rx={4}
              fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.5} />

            <circle cx={36} cy={76 + i * 32} r={9} fill={s.color} />
            <text x={36} y={79 + i * 32} textAnchor="middle"
              fontSize={9} fontWeight={700} fill="white">
              {s.num}
            </text>

            <rect x={52} y={68 + i * 32} width={75} height={16} rx={3}
              fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={0.4} />
            <text x={89} y={79 + i * 32} textAnchor="middle"
              fontSize={7} fontWeight={600} fill={s.color}>
              {s.from}
            </text>

            <text x={132} y={79 + i * 32} fontSize={9} fill="var(--muted-foreground)">→</text>

            <rect x={144} y={68 + i * 32} width={100} height={16} rx={3}
              fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={0.4} />
            <text x={194} y={79 + i * 32} textAnchor="middle"
              fontSize={7} fontWeight={600} fill={s.color}>
              {s.to}
            </text>

            <text x={252} y={79 + i * 32} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
              {s.payload}
            </text>
          </motion.g>
        ))}

        {/* JWT claims */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
          <rect x={20} y={264} width={440} height={20} rx={4}
            fill={JWT} fillOpacity={0.18} stroke={JWT} strokeWidth={1} />
          <text x={240} y={278} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={JWT}>
            JWT.claims (MAA 서명)
          </text>
        </motion.g>

        {CLAIMS.map((c, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.95 + i * 0.07 }}>
            <rect x={20} y={290 + i * 20} width={440} height={18} rx={3}
              fill={JWT} fillOpacity={0.05} stroke={JWT} strokeWidth={0.4} />
            <text x={32} y={302 + i * 20} fontSize={7.5} fontFamily="monospace" fontWeight={700} fill={JWT}>
              {c.key}
            </text>
            <text x={155} y={302 + i * 20} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">
              {c.value}
            </text>
          </motion.g>
        ))}

        {/* Note */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <text x={240} y={394} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            Relying Party는 PCS 직접 호출 불필요 — MAA가 모든 검증 + JWT 발급
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
