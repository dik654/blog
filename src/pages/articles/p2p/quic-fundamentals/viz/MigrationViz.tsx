import { useState } from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  { label: 'Wi-Fi 연결', desc: 'Client가 Wi-Fi(IP: 192.168.1.x)로 Server에 QUIC 연결. Connection ID: 0xABCD' },
  { label: 'IP 변경', desc: 'Wi-Fi → 셀룰러 전환. IP가 10.0.0.x로 변경. TCP라면 연결 끊김.' },
  { label: 'Connection Migration', desc: 'Connection ID 0xABCD 유지. PATH_CHALLENGE → PATH_RESPONSE로 새 경로 검증.' },
  { label: '연결 유지', desc: '기존 스트림, 데이터, 암호화 상태 모두 유지. 사용자 경험 끊김 없음.' },
];

const C = { client: '#6366f1', server: '#10b981', wifi: '#0ea5e9', cell: '#f59e0b' };

export default function MigrationViz() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const isCell = step >= 1;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-mono text-foreground/50">QUIC Connection Migration</p>
      <svg viewBox="0 0 360 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
        {/* Client */}
        <motion.g animate={{ y: isCell ? 20 : 0 }} transition={{ type: 'spring', bounce: 0.15 }}>
          <rect x={20} y={30} width={80} height={28} rx={5}
            fill={C.client + '12'} stroke={C.client} strokeWidth={1.3} />
          <text x={60} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.client}>Client</text>
          <text x={60} y={68} textAnchor="middle" fontSize={10} fill={isCell ? C.cell : C.wifi}>
            {isCell ? '10.0.0.5' : '192.168.1.5'}
          </text>
        </motion.g>
        {/* Server */}
        <rect x={260} y={30} width={80} height={28} rx={5}
          fill={C.server + '12'} stroke={C.server} strokeWidth={1.3} />
        <text x={300} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.server}>Server</text>
        {/* Connection line */}
        <motion.line
          x1={100} y1={isCell ? 64 : 44} x2={260} y2={44}
          stroke={isCell ? C.cell : C.wifi} strokeWidth={1.3}
          strokeDasharray={step === 1 ? '4 3' : '0'}
          animate={{ opacity: step === 1 ? 0.4 : 1 }}
        />
        {/* Connection ID badge */}
        <rect x={148} y={step >= 2 ? 22 : 28} width={64} height={14} rx={3} fill="var(--card)"
          stroke={step >= 2 ? C.cell : C.wifi} strokeWidth={1} />
        <text x={180} y={step >= 2 ? 32 : 38} textAnchor="middle" fontSize={10} fontWeight={600}
          fill={step >= 2 ? C.cell : C.wifi}>CID: 0xABCD</text>
        {/* Path validation */}
        {step >= 2 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect x={135} y={52} width={92} height={12} rx={2} fill="var(--card)" />
            <text x={181} y={61} textAnchor="middle" fontSize={10} fill={C.cell}>
              PATH_CHALLENGE/RESPONSE
            </text>
          </motion.g>
        )}
        {step === 3 && (
          <motion.text x={180} y={90} textAnchor="middle" fontSize={10} fill={C.server}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            스트림 & 암호화 상태 유지
          </motion.text>
        )}
      </svg>
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div key={i} onClick={() => setStep(i)}
            className={`h-1 flex-1 rounded-full cursor-pointer transition-colors ${i <= step ? 'bg-primary' : 'bg-border'}`} />
        ))}
      </div>
      <p className="text-xs font-semibold text-center">{s.label}</p>
      <p className="text-[10px] text-foreground/50 text-center">{s.desc}</p>
    </div>
  );
}
