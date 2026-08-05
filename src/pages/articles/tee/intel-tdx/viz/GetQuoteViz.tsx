import { motion } from 'framer-motion';

const TD = '#10b981';
const SHARED = '#f59e0b';
const HOST = '#ef4444';
const QE = '#8b5cf6';
const ASYNC = '#3b82f6';

interface Step { num: number; actor: string; op: string; data: string; color: string; }

const STEPS: Step[] = [
  { num: 1, actor: 'TD App', op: 'tdx_mcall_get_report0', data: 'reportdata → tdreport (HMAC)', color: TD },
  { num: 2, actor: 'TD Driver', op: 'memcpy(shared_buf, tdreport)', data: 'TDREPORT → Shared 버퍼', color: SHARED },
  { num: 3, actor: 'TD Driver', op: '__tdx_hypercall(GET_QUOTE)', data: 'r12=shared_pa, r13=size', color: TD },
  { num: 4, actor: 'Host VMM', op: 'forward to QE/Service TD', data: 'PCK ECDSA-P256 서명 요청', color: HOST },
  { num: 5, actor: 'QE', op: '비동기 처리 + Quote 생성', data: 'Intel PCS 인증서 체인 첨부', color: QE },
  { num: 6, actor: 'Host', op: 'SetupEventNotify 알림', data: 'Quote 준비 완료 시그널', color: ASYNC },
  { num: 7, actor: 'TD App', op: 'memcpy(quote_hdr, shared_buf)', data: 'Shared → 앱 버퍼로 복사', color: TD },
];

export default function GetQuoteViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 400" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">GetQuote — TDREPORT → Quote 비동기 7단계</text>

        {/* Driver location */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <rect x={20} y={32} width={440} height={20} rx={4}
            fill={TD} fillOpacity={0.08} stroke={TD} strokeWidth={0.5} />
          <text x={240} y={45} textAnchor="middle"
            fontSize={7} fontFamily="monospace" fill={TD}>
            drivers/virt/coco/tdx-guest/tdx-guest.c — long tdx_get_quote(quote_hdr)
          </text>
        </motion.g>

        {STEPS.map((s, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}>
            <rect x={20} y={62 + i * 38} width={440} height={32} rx={5}
              fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.5} />
            <rect x={20} y={62 + i * 38} width={3.5} height={32} fill={s.color} />

            <circle cx={42} cy={78 + i * 38} r={9} fill={s.color} />
            <text x={42} y={81 + i * 38} textAnchor="middle"
              fontSize={9} fontWeight={700} fill="white">
              {s.num}
            </text>

            <rect x={58} y={70 + i * 38} width={70} height={14} rx={2}
              fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={0.4} />
            <text x={93} y={80 + i * 38} textAnchor="middle"
              fontSize={7} fontWeight={700} fill={s.color}>
              {s.actor}
            </text>

            <text x={135} y={75 + i * 38} fontSize={7} fontFamily="monospace" fontWeight={600} fill={s.color}>
              {s.op}
            </text>
            <text x={135} y={88 + i * 38} fontSize={6.5} fill="var(--muted-foreground)">
              {s.data}
            </text>
          </motion.g>
        ))}

        {/* Bottom insight */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
          <rect x={30} y={336} width={420} height={56} rx={6}
            fill={QE} fillOpacity={0.06} stroke={QE} strokeWidth={0.6} strokeDasharray="3 2" />
          <text x={240} y={352} textAnchor="middle" fontSize={9} fontWeight={700} fill={QE}>
            2단계 증명: 로컬 TDREPORT → Host → Quote Service
          </text>
          {[
            '비동기 — Host가 Quote 준비되면 이벤트 알림',
            'TD는 Quote 내용 직접 검증 불가 — Relying Party가 검증',
          ].map((line, i) => (
            <motion.text key={i}
              x={240} y={368 + i * 12} textAnchor="middle"
              fontSize={7} fill={QE}
              initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + i * 0.06 }}>
              {line}
            </motion.text>
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
