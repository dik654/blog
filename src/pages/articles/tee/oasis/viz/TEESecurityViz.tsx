import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { id: 'enclave', label: 'SGX 엔클레이브', color: '#6366f1', x: 60, y: 20 },
  { id: 'quote', label: 'SGX Quote', color: '#8b5cf6', x: 200, y: 20 },
  { id: 'pcs', label: 'Intel PCS', color: '#0ea5e9', x: 340, y: 20 },
  { id: 'ias', label: 'Intel IAS', color: '#10b981', x: 340, y: 80 },
  { id: 'ratls', label: 'RA-TLS', color: '#f59e0b', x: 200, y: 80 },
  { id: 'km', label: '키 매니저', color: '#ef4444', x: 60, y: 80 },
  { id: 'dmv', label: 'dm-verity', color: '#ec4899', x: 60, y: 140 },
];

const EDGES = [
  { from: 0, to: 1, label: 'EREPORT' },
  { from: 1, to: 2, label: 'DCAP 검증' },
  { from: 1, to: 3, label: 'EPID 검증' },
  { from: 2, to: 4, label: '검증 완료' },
  { from: 4, to: 5, label: '키 교환' },
  { from: 6, to: 0, label: '무결성 보장' },
];

const STEPS = [
  { label: 'SGX Quote 생성' },
  { label: '원격 증명 검증' },
  { label: 'RA-TLS & 키 교환' },
  { label: '전체 TEE 보안 체인' },
];

const ANNOT = ['EREPORT QE Quote 생성', 'PCS(DCAP)/IAS(EPID) 검증', 'RA-TLS 키 교환 채널 확립', 'SGX 전체 보안 체인 통합'];
const VN = [[0, 1], [1, 2, 3], [2, 4, 5], [0, 1, 2, 3, 4, 5, 6]];
const VE = [[0], [1, 2], [3, 4], [0, 1, 2, 3, 4, 5]];

export default function TEESecurityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const vis = VE[step].includes(i);
            const f = NODES[e.from], t = NODES[e.to];
            const mx = (f.x + t.x) / 2, my = (f.y + 15 + t.y + 15) / 2 + 5;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.7 : 0.05 }} transition={sp}>
                <line x1={f.x} y1={f.y + 30} x2={t.x} y2={t.y}
                  stroke="var(--muted-foreground)" strokeWidth={1} />
                <rect x={mx - 28} y={my - 8} width={56} height={12} rx={2} fill="var(--card)" />
                <text x={mx} y={my} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{e.label}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VN[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <rect x={n.x - 50} y={n.y} width={100} height={30} rx={6}
                  fill={`${n.color}15`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x} y={n.y + 19} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
                  <motion.text x={405} y={85} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
