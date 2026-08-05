import { motion } from 'framer-motion';

const SIG = '#3b82f6';
const CERT = '#8b5cf6';
const TCB = '#f59e0b';
const POL = '#10b981';
const FAIL = '#ef4444';

interface Stage { num: number; title: string; desc: string; color: string; }

const STAGES: Stage[] = [
  { num: 1, title: 'ECDSA 서명 검증', desc: 'verify_ecdsa_signature(quote.body, sig, att_key)', color: SIG },
  { num: 2, title: 'Cert Chain 검증', desc: 'att_key ← PCK ← Intel Root CA', color: CERT },
  { num: 3, title: 'PCK CRL 조회', desc: 'PCS: /sgx/certification/v4/pckcrl', color: CERT },
  { num: 4, title: 'TCB Info & QE Identity', desc: 'PCS: /tdx/certification/v4/tcb?fmspc=...', color: TCB },
  { num: 5, title: 'TCB Status 결정', desc: 'UpToDate / OutOfDate / SWHardeningNeeded / Revoked', color: TCB },
  { num: 6, title: '정책 매칭', desc: 'allowed_mrtd · DEBUG bit 거부 · RTMR 정책', color: POL },
];

interface TcbCase { status: string; result: string; color: string; }

const CASES: TcbCase[] = [
  { status: 'UpToDate', result: 'OK', color: POL },
  { status: 'OutOfDate', result: 'WARN — 패치 필요', color: TCB },
  { status: 'ConfigNeeded', result: 'WARN — BIOS 설정', color: TCB },
  { status: 'SWHardeningNeeded', result: 'WARN — 사이드채널 패치', color: TCB },
  { status: 'Revoked', result: 'FAIL — 거부', color: FAIL },
];

export default function VerifierFlowViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 400" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">DCAP QVL — Quote 검증 6단계</text>

        {STAGES.map((s, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.1 }}>
            <rect x={20} y={36 + i * 30} width={440} height={26} rx={4}
              fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.6} />
            <rect x={20} y={36 + i * 30} width={3.5} height={26} fill={s.color} />

            <circle cx={42} cy={49 + i * 30} r={9} fill={s.color} />
            <text x={42} y={52 + i * 30} textAnchor="middle"
              fontSize={9} fontWeight={700} fill="white">
              {s.num}
            </text>

            <text x={62} y={48 + i * 30} fontSize={8.5} fontWeight={700} fill={s.color}>
              {s.title}
            </text>
            <text x={62} y={59 + i * 30} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
              {s.desc}
            </text>
          </motion.g>
        ))}

        {/* TCB Status switch */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <text x={240} y={232} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
            TCB Status 결정 매트릭스
          </text>
        </motion.g>

        {CASES.map((c, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.78 + i * 0.07 }}>
            <rect x={30} y={240 + i * 22} width={420} height={20} rx={3}
              fill={c.color} fillOpacity={0.08} stroke={c.color} strokeWidth={0.5} />
            <rect x={42} y={244 + i * 22} width={130} height={12} rx={2}
              fill={c.color} fillOpacity={0.18} />
            <text x={107} y={253 + i * 22} textAnchor="middle"
              fontSize={7} fontFamily="monospace" fontWeight={700} fill={c.color}>
              {c.status}
            </text>
            <text x={185} y={253 + i * 22} fontSize={7} fontWeight={600} fill={c.color}>
              {c.result}
            </text>
          </motion.g>
        ))}

        {/* Policy enforcement */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <rect x={30} y={358} width={420} height={36} rx={6}
            fill={POL} fillOpacity={0.08} stroke={POL} strokeWidth={0.6} />
          <text x={240} y={374} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={POL}>
            정책 강제 (Relying Party 결정)
          </text>
          <text x={240} y={388} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
            allowed_mrtd · reject_debug · match_rtmr · PCS 셀프호스팅 (pccs)
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
