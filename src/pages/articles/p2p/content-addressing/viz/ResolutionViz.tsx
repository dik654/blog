import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '문제: 불변 CID', body: '내용이 바뀌면 CID도 변경 — "최신"을 가리킬 수 없음' },
  { label: 'IPNS 해결', body: '/ipns/<PeerID>가 DHT 서명 레코드로 최신 CID를 가리킴' },
  { label: 'DNSLink 해결', body: 'DNS TXT 레코드로 CID를 매핑하여 도메인 접근 가능' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { ipns: '#6366f1', dns: '#10b981', cid: '#f59e0b' };

export default function ResolutionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* CID boxes (right side) */}
          {['bafyV1', 'bafyV2', 'bafyV3'].map((cid, i) => (
            <motion.g key={cid}
              animate={{ opacity: step === 0 ? 1 : (i === 2 ? 1 : 0.2) }}
              transition={sp}>
              <rect x={310} y={15 + i * 38} width={90} height={26} rx={4}
                fill={C.cid + '10'} stroke={C.cid} strokeWidth={1} />
              <text x={355} y={32 + i * 38} textAnchor="middle"
                fontSize={10} fontWeight={600} fill={C.cid}>{cid}</text>
            </motion.g>
          ))}

          {/* IPNS pointer */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={30} y={20} width={120} height={30} rx={5}
                fill={C.ipns + '12'} stroke={C.ipns} strokeWidth={1.3} />
              <text x={90} y={33} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ipns}>
                /ipns/PeerID
              </text>
              <text x={90} y={43} textAnchor="middle" fontSize={10} fill={C.ipns} opacity={0.7}>
                DHT 서명 레코드
              </text>
              {/* Arrow to latest CID */}
              <line x1={150} y1={35} x2={310} y2={105}
                stroke={C.ipns} strokeWidth={1.3} strokeDasharray="4 3" />
              <rect x={200} y={62} width={56} height={12} rx={2} fill="var(--card)" />
              <text x={228} y={71} textAnchor="middle" fontSize={10} fill={C.ipns}>Seq: 3</text>
            </motion.g>
          )}

          {/* DNSLink pointer */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={30} y={75} width={120} height={30} rx={5}
                fill={C.dns + '12'} stroke={C.dns} strokeWidth={1.3} />
              <text x={90} y={88} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.dns}>
                example.com
              </text>
              <text x={90} y={98} textAnchor="middle" fontSize={10} fill={C.dns} opacity={0.7}>
                DNS TXT _dnslink
              </text>
              <line x1={150} y1={90} x2={310} y2={105}
                stroke={C.dns} strokeWidth={1.3} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
