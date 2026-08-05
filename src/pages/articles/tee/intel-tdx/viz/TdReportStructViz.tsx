import { motion } from 'framer-motion';

const MAC = '#ef4444';
const TCB = '#f59e0b';
const TDI = '#10b981';
const RD = '#8b5cf6';

interface Field { name: string; size: string; desc: string; color: string; }

const REPORT_MAC: Field[] = [
  { name: 'report_type', size: '4B', desc: 'TDX', color: MAC },
  { name: 'cpusvn', size: '16B', desc: 'CPU Security Version', color: MAC },
  { name: 'tee_tcb_info_hash', size: '48B', desc: 'SHA-384(TEE_TCB_INFO)', color: MAC },
  { name: 'tdinfo_hash', size: '48B', desc: 'SHA-384(TDINFO_STRUCT)', color: MAC },
  { name: 'reportdata', size: '64B', desc: '사용자 정의 (nonce + pubkey hash)', color: RD },
  { name: 'mac', size: '32B', desc: 'HMAC-SHA256 서명', color: MAC },
];

const TD_INFO: Field[] = [
  { name: 'attributes', size: '8B', desc: 'TD_ATTRIBUTES (DEBUG bit 등)', color: TDI },
  { name: 'xfam', size: '8B', desc: 'XCR0 allowed mask', color: TDI },
  { name: 'mrtd', size: '48B', desc: '초기 이미지 측정 (SHA-384, 불변)', color: TDI },
  { name: 'mrconfigid', size: '48B', desc: 'config 해시', color: TDI },
  { name: 'rtmr[0..3]', size: '4×48B', desc: '런타임 측정 (TPM PCR 유사)', color: TDI },
  { name: 'servtd_hash', size: '48B', desc: 'service TD 해시 (1.5+)', color: TDI },
];

export default function TdReportStructViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 410" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TDREPORT_STRUCT — 1024B (TDX Module Spec 1.5)</text>

        {/* REPORTMACSTRUCT */}
        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <rect x={20} y={36} width={440} height={20} rx={4}
            fill={MAC} fillOpacity={0.18} stroke={MAC} strokeWidth={1} />
          <text x={240} y={50} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={MAC}>
            REPORTMACSTRUCT — 256B (HMAC으로 서명)
          </text>
        </motion.g>

        {REPORT_MAC.map((f, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + i * 0.05 }}>
            <rect x={20} y={62 + i * 22} width={440} height={20} rx={3}
              fill={f.color} fillOpacity={0.06} stroke={f.color} strokeWidth={0.4} />
            <text x={32} y={76 + i * 22} fontSize={7.5} fontFamily="monospace" fontWeight={700} fill={f.color}>
              {f.name}
            </text>
            <rect x={155} y={66 + i * 22} width={36} height={12} rx={2}
              fill={f.color} fillOpacity={0.2} />
            <text x={173} y={75 + i * 22} textAnchor="middle"
              fontSize={6.5} fontFamily="monospace" fontWeight={600} fill={f.color}>
              {f.size}
            </text>
            <text x={200} y={76 + i * 22} fontSize={7} fill="var(--muted-foreground)">
              {f.desc}
            </text>
          </motion.g>
        ))}

        {/* TEE_TCB_INFO bar */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <rect x={20} y={200} width={440} height={20} rx={4}
            fill={TCB} fillOpacity={0.18} stroke={TCB} strokeWidth={1} />
          <text x={240} y={214} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={TCB}>
            TEE_TCB_INFO — 239B (TDX Module 버전 정보)
          </text>
        </motion.g>

        {/* TDINFO_STRUCT */}
        <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <rect x={20} y={228} width={440} height={20} rx={4}
            fill={TDI} fillOpacity={0.18} stroke={TDI} strokeWidth={1} />
          <text x={240} y={242} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={TDI}>
            TDINFO_STRUCT — 512B (TD 정체성 + 측정값)
          </text>
        </motion.g>

        {TD_INFO.map((f, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.62 + i * 0.05 }}>
            <rect x={20} y={254 + i * 22} width={440} height={20} rx={3}
              fill={f.color} fillOpacity={0.06} stroke={f.color} strokeWidth={0.4} />
            <text x={32} y={268 + i * 22} fontSize={7.5} fontFamily="monospace" fontWeight={700} fill={f.color}>
              {f.name}
            </text>
            <rect x={155} y={258 + i * 22} width={36} height={12} rx={2}
              fill={f.color} fillOpacity={0.2} />
            <text x={173} y={267 + i * 22} textAnchor="middle"
              fontSize={6.5} fontFamily="monospace" fontWeight={600} fill={f.color}>
              {f.size}
            </text>
            <text x={200} y={268 + i * 22} fontSize={7} fill="var(--muted-foreground)">
              {f.desc}
            </text>
          </motion.g>
        ))}

        {/* Summary */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
          <rect x={30} y={388} width={420} height={20} rx={5}
            fill={RD} fillOpacity={0.1} stroke={RD} strokeWidth={0.6} strokeDasharray="3 2" />
          <text x={240} y={402} textAnchor="middle" fontSize={7.5} fill={RD}>
            REPORTDATA(64B) → nonce + pubkey hash로 replay 방어 + 키 바인딩
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
