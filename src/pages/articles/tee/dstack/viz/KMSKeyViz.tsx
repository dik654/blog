import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'KMS Root Key: 마스터 시크릿 (SGX EGETKEY 봉인)' },
  { label: 'Root CA / K256 Root: HKDF-SHA256 파생' },
  { label: '앱별 키: app_id / instance_id 기반 파생' },
];

const ANNOT = ['KMS의 최상위 키입니다', 'Root CA Key는 TLS 인증서 서명 루트이고', 'App CA Key(앱별 TLS)'];
const TREE = [
  { label: 'KMS Root Key', color: '#a855f7', x: 190, y: 20, depth: 0 },
  { label: 'Root CA', color: '#6366f1', x: 110, y: 80, depth: 1 },
  { label: 'K256 Root', color: '#8b5cf6', x: 280, y: 80, depth: 1 },
  { label: 'App CA', color: '#3b82f6', x: 40, y: 140, depth: 2 },
  { label: 'Disk Key', color: '#06b6d4', x: 120, y: 140, depth: 2 },
  { label: 'Env Key', color: '#10b981', x: 200, y: 140, depth: 2 },
  { label: 'K256 App', color: '#f59e0b', x: 310, y: 140, depth: 2 },
];

const EDGES = [
  [0, 1], [0, 2], [1, 3], [1, 4], [1, 5], [2, 6],
];

export default function KMSKeyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 185" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Edges */}
          {EDGES.map(([from, to], i) => {
            const f = TREE[from];
            const t = TREE[to];
            const visible = t.depth <= step;
            return (
              <motion.line key={i} x1={f.x} y1={f.y + 18} x2={t.x} y2={t.y}
                stroke={visible ? t.color : 'var(--border)'} strokeWidth={visible ? 2 : 1}
                strokeDasharray="4,3"
                animate={{ opacity: visible ? 0.8 : 0.15 }}
                transition={{ duration: 0.3 }} />
            );
          })}

          {/* Nodes */}
          {TREE.map((n) => {
            const active = n.depth === step;
            const visible = n.depth <= step;
            return (
              <g key={n.label}>
                <motion.rect x={n.x - 42} y={n.y} width={84} height={28} rx={6}
                  fill={active ? `${n.color}22` : `${n.color}08`}
                  stroke={active ? n.color : `${n.color}40`}
                  strokeWidth={active ? 2.5 : 1}
                  animate={{ opacity: visible ? 1 : 0.15, scale: active ? 1.05 : 1 }}
                  transition={{ duration: 0.3 }} />
                <text x={n.x} y={n.y + 17} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? n.color : visible ? n.color : 'var(--muted-foreground)'}
                  opacity={visible ? 1 : 0.2}>{n.label}</text>
              </g>
            );
          })}

          {/* Derivation label */}
          {step >= 1 && (
            <motion.text x={190} y={65} textAnchor="middle" fontSize={10} fontWeight={600}
              fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              HKDF-SHA256
            </motion.text>
          )}
          {step >= 2 && (
            <motion.text x={190} y={128} textAnchor="middle" fontSize={10} fontWeight={600}
              fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              HKDF(app_id, ...)
            </motion.text>
          )}
                  <motion.text x={385} y={93} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
