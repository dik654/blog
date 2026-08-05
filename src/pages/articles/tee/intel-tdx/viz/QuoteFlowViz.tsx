import { motion } from 'framer-motion';

const TD = '#10b981';
const HOST = '#ef4444';
const QE = '#8b5cf6';
const SHARED = '#f59e0b';

interface Step { actor: string; api: string; result: string; color: string; }

const STEPS: Step[] = [
  { actor: 'TD Guest', api: 'TDG.MR.REPORT (TDCALL)', result: 'TDREPORT (HMAC 서명)', color: TD },
  { actor: 'TD Guest', api: 'TDVMCALL_GET_QUOTE', result: 'shared_pa로 전달', color: SHARED },
  { actor: 'Host VMM', api: 'forward to QE/Service TD', result: 'PCK ECDSA 서명 요청', color: HOST },
  { actor: 'Quote Enclave', api: 'verify MAC + ECDSA-P256 sign', result: 'Quote 생성', color: QE },
  { actor: 'Host', api: 'write back to shared buffer', result: 'SetupEventNotify 알림', color: SHARED },
];

export default function QuoteFlowViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 360" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Quote 생성 — TD → Host → QE 비동기 플로우</text>

        {STEPS.map((s, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.13 }}>
            <text x={20} y={56 + i * 50} fontSize={8} fontWeight={700} fill={s.color}>
              {i + 1}
            </text>

            {/* Actor */}
            <rect x={32} y={42 + i * 50} width={100} height={22} rx={4}
              fill={s.color} fillOpacity={0.15} stroke={s.color} strokeWidth={0.6} />
            <text x={82} y={56 + i * 50} textAnchor="middle"
              fontSize={8} fontWeight={700} fill={s.color}>
              {s.actor}
            </text>

            {/* API */}
            <rect x={140} y={42 + i * 50} width={170} height={22} rx={4}
              fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.4} />
            <text x={225} y={56 + i * 50} textAnchor="middle"
              fontSize={7.5} fontFamily="monospace" fontWeight={600} fill={s.color}>
              {s.api}
            </text>

            {/* Result */}
            <text x={320} y={56 + i * 50} fontSize={7.5} fill="var(--muted-foreground)">
              → {s.result}
            </text>
          </motion.g>
        ))}

        {/* Quote buf struct */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
          <text x={30} y={304} fontSize={9} fontWeight={700} fill="var(--foreground)">
            tdx_quote_buf 구조체 (Host ↔ TD 공유)
          </text>
        </motion.g>

        {[
          { f: 'version', t: 'u64', n: '1' },
          { f: 'status', t: 'u64', n: '0 = success' },
          { f: 'in_len', t: 'u32', n: 'TDREPORT 크기' },
          { f: 'out_len', t: 'u32', n: 'Quote 크기' },
          { f: 'data[]', t: 'u8', n: 'TDREPORT → 덮어쓰기 → Quote' },
        ].map((r, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.95 + i * 0.05 }}>
            <rect x={30} y={312 + i * 12} width={420} height={10} rx={2}
              fill="var(--muted)" opacity={0.2} stroke="var(--border)" strokeWidth={0.3} />
            <text x={42} y={320 + i * 12} fontSize={6.5} fontFamily="monospace" fontWeight={700} fill={SHARED}>
              {r.t}
            </text>
            <text x={75} y={320 + i * 12} fontSize={6.5} fontFamily="monospace" fontWeight={600} fill="var(--foreground)">
              {r.f}
            </text>
            <text x={155} y={320 + i * 12} fontSize={6.5} fill="var(--muted-foreground)">
              {r.n}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
