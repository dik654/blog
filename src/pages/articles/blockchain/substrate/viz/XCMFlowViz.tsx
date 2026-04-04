import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Relay Chain', color: '#e11d48', x: 110, y: 5 },
  { label: 'Para A', color: '#10b981', x: 20, y: 70 },
  { label: 'Para B', color: '#f59e0b', x: 200, y: 70 },
  { label: 'XCVM', color: '#8b5cf6', x: 110, y: 70 },
  { label: 'Ethereum', color: '#6366f1', x: 110, y: 130 },
];

const EDGES = [
  { from: 0, to: 1, label: 'DMP' },
  { from: 1, to: 0, label: 'UMP' },
  { from: 1, to: 2, label: 'HRMP' },
  { from: 0, to: 4, label: 'Bridge' },
];

const STEPS = [
  { label: 'XCM 메시지 전달', body: 'DMP(하향), UMP(상향), HRMP(수평), Bridge(외부) 4가지 채널로 통신합니다.' },
  { label: 'DMP & UMP', body: '릴레이→파라체인(DMP), 파라체인→릴레이(UMP)로 수직 메시지를 전달합니다.' },
  { label: 'HRMP & Bridge', body: '파라체인 간 수평 메시지(HRMP)와 외부 네트워크 브릿지(Snowbridge)입니다.' },
];

const VN: number[][] = [[0,1,2,3,4],[0,1,3],[0,1,2,4]];
const VE: number[][] = [[0,1,2,3],[0,1],[2,3]];
const BW = 75, BH = 28;
const mid = (i: number) => ({ x: NODES[i].x+BW/2, y: NODES[i].y+BH/2 });

export default function XCMFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const f = mid(e.from), t = mid(e.to);
            const vis = VE[step].includes(i);
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.8 : 0.06 }}>
                <line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                  stroke="#666" strokeWidth={1.2} strokeDasharray="4 3" />
                <text x={(f.x+t.x)/2+6} y={(f.y+t.y)/2-4} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)">{e.label}</text>
                {vis && (
                  <motion.circle r={3} fill={NODES[e.from].color}
                    animate={{ cx: [f.x,t.x], cy: [f.y,t.y] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.2 }} />
                )}
              </motion.g>
            );
          })}
          {NODES.map((n, i) => (
            <motion.g key={n.label} animate={{ opacity: VN[step].includes(i) ? 1 : 0.1 }}>
              <rect x={n.x} y={n.y} width={BW} height={BH} rx={6}
                fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
              <text x={n.x+BW/2} y={n.y+BH/2+4} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
