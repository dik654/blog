import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Cairo 소스', color: '#8b5cf6', x: 5, y: 55 },
  { label: 'Cairo VM', color: '#6366f1', x: 85, y: 55 },
  { label: 'Adapter', color: '#3b82f6', x: 165, y: 55 },
  { label: 'S-two Prover', color: '#10b981', x: 245, y: 25 },
  { label: 'Verifier', color: '#f59e0b', x: 245, y: 85 },
  { label: 'Proof', color: '#ef4444', x: 330, y: 55 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 1, to: 2 },
  { from: 2, to: 3 }, { from: 3, to: 5 },
  { from: 5, to: 4 },
];

const STEPS = [
  { label: 'Cairo → S-two 증명 시스템 전체 흐름', body: 'Cairo 소스에서 Circle STARK 증명 생성 및 검증까지의 파이프라인.' },
  { label: 'Cairo VM 실행', body: '소스 코드를 CASM으로 컴파일하고 VM에서 실행하여 실행 추적을 생성합니다.' },
  { label: '어댑터 변환', body: 'Cairo VM 출력을 재배치(relocate)하여 S-two Prover 입력 형식으로 변환합니다.' },
  { label: '증명 & 검증', body: 'Circle STARK 증명을 생성하고, Cairo로 작성된 검증기로 온체인 검증합니다.' },
];

const ACTIVE: number[][] = [[0,1,2,3,4,5],[0,1],[1,2],[3,4,5]];
const BW = 72, BH = 26;
const mid = (i: number) => ({ x: NODES[i].x + BW / 2, y: NODES[i].y + BH / 2 });

export default function StwoProveViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 555 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const f = mid(e.from), t = mid(e.to);
            const show = ACTIVE[step].includes(e.from) && ACTIVE[step].includes(e.to);
            return (
              <motion.line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke="#666" strokeWidth={1.5} strokeDasharray="5 3"
                animate={{ opacity: show ? 1 : 0.1 }} transition={{ duration: 0.3 }} />
            );
          })}
          {NODES.map((n, i) => {
            const show = ACTIVE[step].includes(i);
            return (
              <motion.g key={i} animate={{ opacity: show ? 1 : 0.12 }} transition={{ duration: 0.3 }}>
                <rect x={n.x} y={n.y} width={BW} height={BH} rx={6}
                  fill={`${n.color}15`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x + BW / 2} y={n.y + BH / 2 + 4}
                  textAnchor="middle" fontSize={8} fontWeight="700" fill={n.color}>
                  {n.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
