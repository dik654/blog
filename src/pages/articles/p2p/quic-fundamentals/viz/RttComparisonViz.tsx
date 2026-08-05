import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const C = {
  tcp12: '#ef4444',
  tcp13: '#f59e0b',
  quic: '#0ea5e9',
  zrtt: '#10b981',
  warn: '#f43f5e',
};

const STEPS = [
  {
    label: 'TCP + TLS 1.2 — 첫 바이트까지 3 RTT',
    body: 'TCP 3-way 1 RTT, TLS 1.2 핸드셰이크 2 RTT. 데이터 한 바이트 보내기까지 왕복 3회.',
  },
  {
    label: 'TCP + TLS 1.3 — 2 RTT 로 단축',
    body: 'TLS 1.3 이 1 RTT 로 줄였지만 여전히 TCP 핸드셰이크가 별도. 결합 불가.',
  },
  {
    label: 'QUIC 첫 연결 — 1 RTT',
    body: 'Initial 패킷에 ClientHello 가 올라타고 핸드셰이크와 TLS 가 통합. 한 번의 왕복으로 끝.',
  },
  {
    label: 'QUIC 0-RTT — 첫 패킷에 데이터',
    body: '이전 세션의 PSK 로 키를 미리 유도. 첫 패킷부터 애플리케이션 데이터 전송. 단, 멱등 요청만 안전.',
  },
];

interface RttBarProps {
  y: number; label: string; color: string; rtts: number; subtitle: string; highlight?: boolean;
}

function RttBar({ y, label, color, rtts, subtitle, highlight }: RttBarProps) {
  const unit = 70;
  const totalW = unit * 3;
  const fillW = unit * rtts;
  return (
    <g>
      <text x={20} y={y + 14} fontSize={10} fontWeight={600} fill={color}>{label}</text>
      <text x={20} y={y + 27} fontSize={8} fill="#9ca3af">{subtitle}</text>
      <rect x={150} y={y + 4} width={totalW} height={22} rx={4}
        fill="#f3f4f6" opacity={0.08} stroke="#9ca3af" strokeWidth={0.4} strokeDasharray="2 2" />
      {rtts > 0 && (
        <motion.rect x={150} y={y + 4} height={22} rx={4}
          initial={{ width: 0 }} animate={{ width: fillW }} transition={sp}
          fill={color} opacity={highlight ? 0.85 : 0.55} />
      )}
      {rtts === 0 && (
        <motion.circle cx={156} cy={y + 15} r={5}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={sp}
          fill={color} />
      )}
      <text x={150 + totalW + 10} y={y + 19} fontSize={9} fontWeight={700} fill={color}>
        {rtts} RTT
      </text>
    </g>
  );
}

function RttScale() {
  return (
    <g>
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <line x1={150 + i * 70} y1={150} x2={150 + i * 70} y2={155}
            stroke="#9ca3af" strokeWidth={0.5} />
          <text x={150 + i * 70} y={165} fontSize={8} textAnchor="middle" fill="#9ca3af">
            {i}R
          </text>
        </g>
      ))}
      <text x={280} y={178} fontSize={8} textAnchor="middle" fill="#9ca3af">
        첫 바이트까지의 왕복 횟수
      </text>
    </g>
  );
}

export default function RttComparisonViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <RttScale />
          <RttBar y={20} label="TCP + TLS 1.2" color={C.tcp12} rtts={3}
            subtitle="SYN-ACK + ClientHello + Finished" highlight={step === 0} />
          <RttBar y={55} label="TCP + TLS 1.3" color={C.tcp13} rtts={2}
            subtitle="TCP 1R + TLS 1R 결합" highlight={step === 1} />
          <RttBar y={90} label="QUIC 1-RTT" color={C.quic} rtts={1}
            subtitle="Initial = ClientHello, 통합" highlight={step === 2} />
          <RttBar y={125} label="QUIC 0-RTT" color={C.zrtt} rtts={0}
            subtitle="PSK 재사용, 첫 패킷에 데이터" highlight={step === 3} />

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <g transform="translate(310, 105)">
                <rect x={0} y={0} width={160} height={36} rx={6}
                  fill={`${C.warn}10`} stroke={C.warn} strokeWidth={0.8} strokeDasharray="3 2" />
                <text x={80} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.warn}>
                  replay 위험
                </text>
                <text x={80} y={26} textAnchor="middle" fontSize={7.5} fill={C.warn} opacity={0.85}>
                  GET 같은 멱등 요청에만
                </text>
              </g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
