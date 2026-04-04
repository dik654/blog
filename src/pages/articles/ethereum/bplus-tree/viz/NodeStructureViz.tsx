import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const CI = '#6366f1', CL = '#10b981', CF = '#f59e0b';

const STEPS = [
  { label: 'Internal Node — 키 + 자식 포인터',
    body: '키(K)는 자식 간의 경계값 역할. 포인터(P)는 자식 페이지의 디스크 주소를 가리킨다. K₁ 미만은 P₀, K₁ 이상 K₂ 미만은 P₁로 분기.' },
  { label: 'Leaf Node — 키 + 값 + 다음 리프 포인터',
    body: '실제 데이터(값)를 저장하는 유일한 노드. 키 순서대로 정렬되어 있고, 다음 리프(→next)로 연결된다.' },
  { label: 'Fan-out 효과: 높이 3에서 100만 개 키',
    body: '차수 m=100이면 root 1개 → 자식 100개 → 손자 10,000개 → leaf 1,000,000개. 디스크 I/O는 겨우 3번.' },
];

export default function NodeStructureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Internal Node */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.2 }}>
            <text x={230} y={18} textAnchor="middle" fontSize={11} fontWeight={600} fill={CI}>Internal Node</text>
            {['P₀', 'K₁', 'P₁', 'K₂', 'P₂', 'K₃', 'P₃'].map((lbl, i) => {
              const x = 80 + i * 44;
              const isKey = lbl.startsWith('K');
              return (
                <g key={i}>
                  <rect x={x} y={28} width={40} height={26} rx={4}
                    fill={isKey ? `${CI}15` : `${CI}06`} stroke={CI} strokeWidth={isKey ? 1 : 0.5} />
                  <text x={x + 20} y={45} textAnchor="middle" fontSize={10}
                    fill={isKey ? CI : 'var(--muted-foreground)'}>{lbl}</text>
                </g>
              );
            })}
            <text x={230} y={70} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              P = 자식 페이지 주소, K = 경계 키
            </text>
          </motion.g>

          {/* Leaf Node */}
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.2 }}>
            <text x={230} y={92} textAnchor="middle" fontSize={11} fontWeight={600} fill={CL}>Leaf Node</text>
            {['K₁:V₁', 'K₂:V₂', 'K₃:V₃', '→next'].map((lbl, i) => {
              const x = 90 + i * 80;
              const isLink = lbl === '→next';
              return (
                <g key={i}>
                  <rect x={x} y={100} width={72} height={26} rx={4}
                    fill={isLink ? `${CF}12` : `${CL}10`}
                    stroke={isLink ? CF : CL} strokeWidth={0.8} />
                  <text x={x + 36} y={117} textAnchor="middle" fontSize={10}
                    fill={isLink ? CF : 'var(--foreground)'}>{lbl}</text>
                </g>
              );
            })}
            <text x={230} y={142} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              데이터는 leaf에만 저장, 다음 leaf로 연결
            </text>
          </motion.g>

          {/* Fan-out */}
          <motion.g animate={{ opacity: step === 2 ? 1 : 0.2 }}>
            <text x={230} y={160} textAnchor="middle" fontSize={11} fontWeight={600} fill={CF}>Fan-out (m=100)</text>
            {[
              { lbl: '1', w: 30, x: 195 },
              { lbl: '100', w: 40, x: 255 },
              { lbl: '10K', w: 44, x: 325 },
              { lbl: '1M 키', w: 54, x: 400 },
            ].map((n, i) => (
              <g key={i}>
                <rect x={n.x} y={166} width={n.w} height={20} rx={4}
                  fill={`${CF}${10 + i * 5}`} stroke={CF} strokeWidth={0.6} />
                <text x={n.x + n.w / 2} y={180} textAnchor="middle" fontSize={10} fill="var(--foreground)">{n.lbl}</text>
                {i < 3 && (
                  <line x1={n.x + n.w + 2} y1={176} x2={[255, 325, 400][i] - 2} y2={176}
                    stroke={CF} strokeWidth={0.6} markerEnd="url(#arrNS)" />
                )}
              </g>
            ))}
            <text x={150} y={180} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">높이:</text>
            <text x={155} y={180} fontSize={9} fill="var(--muted-foreground)">0 → 1 → 2 → 3</text>
          </motion.g>

          <defs>
            <marker id="arrNS" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={CF} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
