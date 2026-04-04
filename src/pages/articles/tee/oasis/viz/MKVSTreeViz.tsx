import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Internal Node: 트리 분기점', body: 'Hash(자식 해시 결합), Label(엣지 레이블 — 경로 압축), Left/Right 자식 포인터로 구성됩니다.' },
  { label: 'Leaf Node: 실제 데이터', body: 'H(key || value) 해시, Key(키), Value(바이트 배열). 검색 결과를 담는 말단 노드입니다.' },
  { label: 'Merkle Tree 핵심 특성', body: '루트 해시 하나로 전체 상태 무결성 검증 가능.\n차이점만 전송(diff sync). 경로 압축으로 효율 향상.' },
];

const C = { internal: '#6366f1', leaf: '#10b981', root: '#f59e0b' };

export default function MKVSTreeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Root */}
          <motion.rect x={230} y={10} width={80} height={34} rx={6}
            fill={step === 2 ? `${C.root}20` : `${C.root}08`}
            stroke={C.root} strokeWidth={step === 2 ? 2 : 1}
            animate={{ opacity: step === 2 ? 1 : 0.6 }} />
          <text x={270} y={31} textAnchor="middle" fontSize={10} fontWeight={600}
            fill={C.root}>Root Hash</text>
          {/* Internal nodes */}
          {[{ x: 150, label: 'Internal A' }, { x: 390, label: 'Internal B' }].map((n, i) => (
            <g key={n.label}>
              <line x1={270} y1={44} x2={n.x} y2={65} stroke={step === 0 ? C.internal : 'var(--border)'}
                strokeWidth={step === 0 ? 1.2 : 0.6} />
              <motion.rect x={n.x - 45} y={65} width={90} height={32} rx={6}
                fill={step === 0 ? `${C.internal}18` : `${C.internal}06`}
                stroke={step === 0 ? C.internal : `${C.internal}30`}
                strokeWidth={step === 0 ? 2 : 0.6}
                animate={{ opacity: step === 0 ? 1 : 0.3 }} />
              <text x={n.x} y={85} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={step === 0 ? C.internal : 'var(--muted-foreground)'}>{n.label}</text>
              <text x={n.x} y={110} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">{i === 0 ? 'Hash + Label' : 'Left / Right'}</text>
            </g>
          ))}
          {/* Leaf nodes */}
          {[100, 200, 340, 440].map((x, i) => (
            <g key={`leaf-${i}`}>
              <line x1={i < 2 ? 150 : 390} y1={97} x2={x} y2={122}
                stroke={step === 1 ? C.leaf : 'var(--border)'} strokeWidth={step === 1 ? 1 : 0.5} />
              <motion.rect x={x - 32} y={122} width={64} height={28} rx={5}
                fill={step === 1 ? `${C.leaf}18` : `${C.leaf}06`}
                stroke={step === 1 ? C.leaf : `${C.leaf}30`}
                strokeWidth={step === 1 ? 1.8 : 0.5}
                animate={{ opacity: step === 1 ? 1 : 0.25 }} />
              <text x={x} y={140} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={step === 1 ? C.leaf : 'var(--muted-foreground)'}>Leaf {i + 1}</text>
            </g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
