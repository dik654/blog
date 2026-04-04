import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '태동 (1943–1969)', body: '인공 뉴런 → 퍼셉트론 → XOR 한계 증명. "이건 못 푼다"는 결론이 연구를 멈추게 함.' },
  { label: '암흑기 (1970–2005)', body: 'AI 겨울. SVM, Random Forest 등 전통 ML이 주류. 신경망 연구는 비주류로 전락.' },
  { label: '부활 (2006–2016)', body: 'Hinton의 DBN → AlexNet(2012) → ResNet(2015). GPU 병렬 처리가 핵심 전환점.' },
  { label: '폭발 (2017–현재)', body: 'Transformer → BERT → GPT → Diffusion. 스케일링 법칙이 지배하는 시대.' },
];

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const EVENTS = [
  [{ year: '1943', name: '인공 뉴런' }, { year: '1957', name: '퍼셉트론' }, { year: '1969', name: 'XOR 한계' }],
  [{ year: '1986', name: '역전파' }, { year: '1995', name: 'SVM' }, { year: '1998', name: 'LeNet' }],
  [{ year: '2006', name: 'DBN' }, { year: '2012', name: 'AlexNet' }, { year: '2015', name: 'ResNet' }],
  [{ year: '2017', name: 'Transformer' }, { year: '2020', name: 'GPT-3' }, { year: '2022', name: 'ChatGPT' }],
];

const COLORS = ['#6366f1', '#94a3b8', '#10b981', '#f59e0b'];

export default function DLTimelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Timeline base line */}
          <line x1={20} y1={45} x2={400} y2={45} stroke="var(--border)" strokeWidth={1.5} />

          {/* Era segments */}
          {EVENTS.map((era, ei) => {
            const sx = 20 + ei * 95;
            const active = step === ei;
            return (
              <motion.g key={ei} animate={{ opacity: active ? 1 : 0.25 }} transition={sp}>
                <rect x={sx} y={38} width={90} height={14} rx={3}
                  fill={active ? `${COLORS[ei]}20` : 'transparent'}
                  stroke={active ? COLORS[ei] : 'transparent'} strokeWidth={1} />
                {era.map((evt, vi) => {
                  const ex = sx + 15 + vi * 28;
                  return (
                    <g key={vi}>
                      <circle cx={ex} cy={45} r={4}
                        fill={active ? COLORS[ei] : '#aaa'} />
                      <text x={ex} y={30} textAnchor="middle" fontSize={9}
                        fontWeight={600} fill={active ? COLORS[ei] : '#999'}>
                        {evt.year}
                      </text>
                      <text x={ex} y={70} textAnchor="middle" fontSize={9}
                        fill={active ? 'var(--foreground)' : '#999'}>
                        {evt.name}
                      </text>
                    </g>
                  );
                })}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
