import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Full Cone NAT', body: '내부 → 외부 매핑 생성 후 어떤 외부 호스트든 해당 매핑으로 접근 가능.' },
  { label: 'Restricted Cone NAT', body: '내부가 먼저 패킷을 보낸 IP만 매핑을 통해 접근 가능. 포트는 무관.' },
  { label: 'Port Restricted Cone', body: '내부가 보낸 IP와 포트 조합만 매핑으로 접근 가능.' },
  { label: 'Symmetric NAT', body: '목적지(IP:포트)마다 서로 다른 외부 매핑 생성. 홀 펀칭 매우 어려움.' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function NATTypesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Internal host */}
          <rect x={10} y={55} width={60} height={28} rx={5}
            fill="#6366f112" stroke="#6366f1" strokeWidth={1.3} />
          <text x={40} y={73} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">Internal</text>

          {/* NAT box */}
          <motion.rect x={110} y={40} width={70} height={58} rx={6}
            fill={C[step] + '12'} stroke={C[step]} strokeWidth={1.5}
            animate={{ stroke: C[step] }} transition={sp} />
          <text x={145} y={63} textAnchor="middle" fontSize={10} fontWeight={600} fill={C[step]}>NAT</text>
          <text x={145} y={78} textAnchor="middle" fontSize={10} fill={C[step]}>
            {['Full Cone', 'Restricted', 'Port Restr.', 'Symmetric'][step]}
          </text>

          {/* External hosts */}
          {[
            { id: 'A', y: 15 }, { id: 'B', y: 60 }, { id: 'C', y: 105 },
          ].map((h, i) => {
            const allowed = step === 0 ? true
              : step === 1 ? i <= 1
              : step === 2 ? i === 0
              : i === 0;
            return (
              <motion.g key={h.id} animate={{ opacity: allowed ? 1 : 0.15 }} transition={sp}>
                <rect x={300} y={h.y} width={64} height={28} rx={5}
                  fill={allowed ? C[step] + '12' : '#64748b08'}
                  stroke={allowed ? C[step] : '#64748b'} strokeWidth={1} />
                <text x={332} y={h.y + 18} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={allowed ? C[step] : '#64748b'}>Host {h.id}</text>
                {/* Arrow */}
                <line x1={180} y1={69} x2={300} y2={h.y + 14}
                  stroke={allowed ? C[step] : '#64748b'} strokeWidth={1}
                  strokeDasharray={allowed ? '0' : '4 3'} strokeOpacity={allowed ? 0.6 : 0.15} />
              </motion.g>
            );
          })}
          {/* Internal → NAT arrow */}
          <line x1={70} y1={69} x2={110} y2={69} stroke="#6366f1" strokeWidth={1} />
          {/* Mapping labels for Symmetric */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              <text x={232} y={28} textAnchor="middle" fontSize={10} fill={C[3]}>:5001</text>
              <text x={232} y={73} textAnchor="middle" fontSize={10} fill={C[3]}>:5002</text>
              <text x={232} y={118} textAnchor="middle" fontSize={10} fill={C[3]}>:5003</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
