import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { id: 'ta', label: 'TA (암호화 요청)', color: '#6366f1', x: 60, y: 20 },
  { id: 'svc', label: 'tee_svc_cryp', color: '#0ea5e9', x: 200, y: 20 },
  { id: 'provider', label: 'Crypto Provider', color: '#10b981', x: 340, y: 20 },
  { id: 'hw', label: 'HW 가속 엔진', color: '#f59e0b', x: 270, y: 90 },
  { id: 'sw', label: 'SW (mbedTLS)', color: '#8b5cf6', x: 130, y: 90 },
  { id: 'key', label: '보안 키 저장소', color: '#ef4444', x: 200, y: 150 },
];

const EDGES = [
  { from: 0, to: 1, label: 'GP API 호출' },
  { from: 1, to: 2, label: '알고리즘 디스패치' },
  { from: 2, to: 3, label: 'CAAM/CE 가속' },
  { from: 2, to: 4, label: 'SW 폴백' },
  { from: 1, to: 5, label: '키 로드' },
  { from: 5, to: 2, label: '키 전달' },
];

const STEPS = [
  { label: 'GP API 호출' }, { label: '알고리즘 디스패치' },
  { label: 'HW/SW 분기' }, { label: '보안 키 관리' },
];
const ANNOT = ['GP API 암호화 요청', '알고리즘 ID → provider', 'CAAM/CE 또는 mbedTLS', 'Secure 메모리 키 저장'];

const VN = [[0, 1], [0, 1, 2], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5]];
const VE = [[0], [0, 1], [0, 1, 2, 3], [0, 1, 2, 3, 4, 5]];

export default function CryptoOperationsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const vis = VE[step].includes(i);
            const f = NODES[e.from], t = NODES[e.to];
            const mx = (f.x + t.x) / 2 + 8, my = (f.y + 15 + t.y + 15) / 2 + 5;
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
                <rect x={n.x - 55} y={n.y} width={110} height={30} rx={6}
                  fill={`${n.color}15`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x} y={n.y + 19} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
          <motion.text x={405} y={90} fontSize={10} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
