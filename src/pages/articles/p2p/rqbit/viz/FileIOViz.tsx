import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'FileStorage 추상화: 파일 시스템 인터페이스' },
  { label: '피스 → 파일 매핑: 크로스 파일 피스 처리' },
  { label: '해시 검증: SHA-1 피스 무결성 확인' },
  { label: 'HTTP 스트리밍: Range 요청 기반 파일 서빙' },
];

const ANNOT = ['FileStorage 추상화 인터페이스', '크로스 파일 피스 매핑 처리', 'SHA-1 피스 무결성 검증', 'HTTP Range 스트리밍 서빙'];
const LAYERS = [
  { label: 'HTTP API / Stream', color: '#8b5cf6', y: 15 },
  { label: 'ChunkTracker', color: '#3b82f6', y: 50 },
  { label: 'FileStorage (pread/pwrite)', color: '#10b981', y: 85 },
  { label: 'Disk (파일 시스템)', color: '#f59e0b', y: 120 },
];

export default function FileIOViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const active = i === step;
            return (
              <g key={l.label}>
                <motion.rect x={50} y={l.y} width={260} height={28} rx={6}
                  fill={active ? `${l.color}22` : `${l.color}08`}
                  stroke={active ? l.color : `${l.color}30`}
                  strokeWidth={active ? 2.5 : 1}
                  animate={{ opacity: active ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }} />
                <text x={180} y={l.y + 18} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? l.color : 'var(--muted-foreground)'}>
                  {l.label}
                </text>
              </g>
            );
          })}
          {/* Data flow arrow */}
          <motion.line x1={330} y1={LAYERS[0].y + 14}
            x2={330} y2={LAYERS[Math.min(step, 3)].y + 14}
            stroke={LAYERS[Math.min(step, 3)].color} strokeWidth={2.5}
            markerEnd="url(#ah4)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.4 }} />
          <defs>
            <marker id="ah4" markerWidth={6} markerHeight={5} refX={6} refY={2.5} orient="auto">
              <path d="M0,0 L6,2.5 L0,5" fill="var(--muted-foreground)" />
            </marker>
          </defs>
                  <motion.text x={365} y={75} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
