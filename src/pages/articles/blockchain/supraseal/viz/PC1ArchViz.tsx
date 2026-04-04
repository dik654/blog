import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { label: 'NVMe x12', sub: '22TB 스트라이프', color: '#6366f1', x: 40, y: 20 },
  { label: 'SPDK', sub: '사용자 공간 I/O', color: '#8b5cf6', x: 40, y: 60 },
  { label: 'Parent Reader', sub: '부모 노드 로드', color: '#10b981', x: 140, y: 20 },
  { label: 'Hashers', sub: 'SHA-256 x4', color: '#f59e0b', x: 140, y: 60 },
  { label: 'Node Writer', sub: '해시 결과 저장', color: '#ec4899', x: 250, y: 20 },
  { label: 'Coordinator', sub: 'CCX/L3 캐시', color: '#3b82f6', x: 250, y: 60 },
];

const EDGES = [[0, 2], [1, 2], [2, 3], [3, 4], [3, 5], [4, 0]];

const STEP_ACTIVE = [
  [0, 1, 2, 3, 4, 5],
  [0, 1, 2],
  [2, 3, 5],
  [3, 4, 0],
];

const STEPS = [
  { label: 'PC1 소프트웨어 구조', body: 'SPDK + NVMe 기반 파이프라인으로 PC1을 고속 처리합니다.' },
  { label: 'NVMe + SPDK', body: 'SPDK로 커널 우회 직접 NVMe 제어. 12개 드라이브 스트라이핑으로 IOPS 확보.' },
  { label: 'SHA-256 해싱', body: '멀티버퍼 SHA Extensions로 코어당 4섹터를 동시 해싱합니다.' },
  { label: '결과 저장', body: '해시된 노드를 NVMe에 쓰고 다음 레이어의 부모로 사용합니다.' },
];

export default function PC1ArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const activeSet = new Set(STEP_ACTIVE[step]);
        return (
          <svg viewBox="0 0 450 85" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {EDGES.map(([a, b], ei) => {
              const na = NODES[a], nb = NODES[b];
              const vis = activeSet.has(a) && activeSet.has(b);
              return (
                <motion.line key={ei}
                  x1={na.x + 26} y1={na.y} x2={nb.x - 26} y2={nb.y}
                  stroke="var(--border)" strokeWidth={0.7}
                  animate={{ opacity: vis ? 0.5 : 0.08 }} transition={sp} />
              );
            })}
            {NODES.map((n, i) => {
              const active = activeSet.has(i);
              return (
                <g key={n.label}>
                  <motion.rect x={n.x - 30} y={n.y - 13} width={60} height={26} rx={4}
                    animate={{
                      fill: active ? `${n.color}18` : `${n.color}04`,
                      stroke: n.color, strokeWidth: active ? 1.4 : 0.5,
                      opacity: active ? 1 : 0.2,
                    }} transition={sp} />
                  <motion.text x={n.x} y={n.y - 1} textAnchor="middle" fontSize={10} fontWeight={600}
                    animate={{ fill: n.color, opacity: active ? 1 : 0.2 }} transition={sp}>
                    {n.label}
                  </motion.text>
                  <motion.text x={n.x} y={n.y + 7} textAnchor="middle" fontSize={9}
                    animate={{ fill: n.color, opacity: active ? 0.5 : 0.1 }} transition={sp}>
                    {n.sub}
                  </motion.text>
                </g>
              );
            })}
        </svg>
        );
      }}
    </StepViz>
  );
}
