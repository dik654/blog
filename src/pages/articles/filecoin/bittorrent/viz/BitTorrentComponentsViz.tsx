import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const COMPS = [
  { label: '.torrent 파일', c: '#6366f1', tag: 'META' },
  { label: 'Tracker 서버', c: '#f59e0b', tag: 'INDEX' },
  { label: 'Seeder (업로더)', c: '#10b981', tag: 'SEED' },
  { label: 'Leecher (다운로더)', c: '#8b5cf6', tag: 'LEECH' },
];
const ANNOT = ['조각 해시 메타데이터 파일', 'Tracker 피어 목록 관리', '파일 전체 보유 피어', '다운로드 중인 피어'];
const POS = [
  { x: 60, y: 40 }, { x: 300, y: 40 },
  { x: 60, y: 110 }, { x: 300, y: 110 },
];

export default function BitTorrentComponentsViz() {
  return (
    <StepViz steps={COMPS}>
      {(step) => (
        <svg viewBox="0 0 500 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {COMPS.map((comp, i) => {
            const p = POS[i];
            const active = i === step;
            return (
              <motion.g key={i}
                animate={{ scale: active ? 1.08 : 0.92, opacity: active ? 1 : 0.35 }}
                style={{ transformOrigin: `${p.x + 50}px ${p.y + 20}px` }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <rect x={p.x} y={p.y} width={100} height={40} rx={8}
                  fill={comp.c + (active ? '20' : '08')} stroke={comp.c}
                  strokeWidth={active ? 2 : 1} strokeOpacity={active ? 1 : 0.3} />
                <text x={p.x + 50} y={p.y + 18} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={comp.c}>{comp.tag}</text>
                <text x={p.x + 50} y={p.y + 32} textAnchor="middle"
                  fontSize={10} fill={comp.c} fillOpacity={0.6}>
                  {comp.label}
                </text>
              </motion.g>
            );
          })}
          {/* flow arrows */}
          {[[0, 1], [1, 3], [2, 3], [3, 2]].map(([a, b], i) => (
            <motion.line key={i}
              x1={POS[a].x + 100} y1={POS[a].y + 20}
              x2={POS[b].x} y2={POS[b].y + 20}
              stroke="currentColor" strokeWidth={1} strokeOpacity={0.12}
              strokeDasharray="4 3" />
          ))}
          {/* active pulse */}
          <motion.circle
            key={`pulse-${step}`}
            cx={POS[step].x + 50} cy={POS[step].y + 20} r={20}
            fill="none" stroke={COMPS[step].c} strokeWidth={1.5}
            initial={{ r: 20, opacity: 0.6 }} animate={{ r: 35, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
                  <motion.text x={405} y={80} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
