import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'CNN 아키텍처 진화 계보', body: 'LeNet → EfficientNet 핵심 혁신 추적' },
  { label: 'LeNet-5 (1998)', body: '최초 실용 CNN — 합성곱 + 풀링 구조 정립\n필기 숫자 인식(MNIST)에서 검증' },
  { label: 'AlexNet (2012)', body: 'GPU 학습 + ReLU + Dropout → ImageNet 우승\n딥러닝 붐의 시작점' },
  { label: 'VGG & GoogLeNet (2014)', body: 'VGG: 3×3 커널만으로 깊게 쌓기\nGoogLeNet: Inception 모듈로 병렬 탐색' },
  { label: 'ResNet (2015)', body: 'Skip Connection → 152층도 학습 가능\n기울기 소실 문제를 구조적으로 해결' },
  { label: 'EfficientNet (2019)', body: 'NAS로 최적 구조 탐색\nCompound Scaling: 깊이·너비·해상도 균형 확장' },
];

/* 2행: LeNet → AlexNet 분기 → VGG / GoogLeNet → ResNet → EfficientNet */
const NODES = [
  { label: 'LeNet-5', sub: '1998', color: '#6366f1', x: 4, y: 34 },
  { label: 'AlexNet', sub: '2012', color: '#3b82f6', x: 120, y: 34 },
  { label: 'VGGNet', sub: '2014 깊게', color: '#10b981', x: 236, y: 8 },
  { label: 'GoogLeNet', sub: '2014 넓게', color: '#f59e0b', x: 236, y: 64 },
  { label: 'ResNet', sub: '2015 Skip', color: '#ef4444', x: 352, y: 34 },
  { label: 'EfficientNet', sub: '2019 NAS', color: '#8b5cf6', x: 468, y: 34 },
];

const ARROWS: [number, number][] = [[0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [4, 5]];

const ACTIVE: number[][] = [
  [0, 1, 2, 3, 4, 5], [0], [0, 1], [1, 2, 3], [2, 3, 4], [4, 5],
];

export default function CNNArchEvolutionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 580 108" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cn-arr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M0 0L6 3L0 6z" fill="#888" />
            </marker>
          </defs>
          {ARROWS.map(([a, b], i) => {
            const na = NODES[a], nb = NODES[b];
            const on = ACTIVE[step].includes(a) && ACTIVE[step].includes(b);
            return (
              <motion.line key={i}
                x1={na.x + 102} y1={na.y + 18} x2={nb.x - 2} y2={nb.y + 18}
                stroke="#888" strokeWidth={1.5} markerEnd="url(#cn-arr)"
                animate={{ opacity: on ? 0.8 : 0.08 }} />
            );
          })}
          {NODES.map((n, i) => {
            const on = ACTIVE[step].includes(i);
            return (
              <g key={i}>
                <motion.rect x={n.x} y={n.y} width={100} height={36} rx={7}
                  fill={n.color} animate={{ opacity: on ? 1 : 0.1 }}
                  transition={{ duration: 0.3 }} />
                <text x={n.x + 50} y={n.y + 16} textAnchor="middle"
                  fontSize={11} fontWeight={700} fill="white"
                  opacity={on ? 1 : 0.2}>{n.label}</text>
                <text x={n.x + 50} y={n.y + 30} textAnchor="middle"
                  fontSize={10} fill="white" opacity={on ? 0.7 : 0.15}>{n.sub}</text>
              </g>
            );
          })}
          {/* body moved to StepViz steps.body */}
        </svg>
      )}
    </StepViz>
  );
}
