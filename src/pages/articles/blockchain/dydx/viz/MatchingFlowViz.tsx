import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: '주문 수신', sub: 'PlaceOrder', color: '#6366f1' },
  { label: '주문 검증', sub: 'validateOrder', color: '#10b981' },
  { label: '매칭 시도', sub: 'attemptMatch', color: '#f59e0b' },
  { label: '체결 처리', sub: 'processMatch', color: '#ec4899' },
  { label: '주문서 추가', sub: 'addToBook', color: '#8b5cf6' },
];

const EDGES = ['검증', '탐색', '기록', '등록'];

const STEPS = [
  { label: '주문 수신', body: '사용자 주문이 MemCLOB에 도달합니다.' },
  { label: '주문 검증', body: '계정 잔고, 마진, 주문 유효성, 속도 제한 등을 검증합니다.' },
  { label: '매칭 시도', body: '반대 방향에서 가격-시간 우선순위로 매칭 대상을 탐색합니다.' },
  { label: '체결 처리', body: '매칭 수량 결정 → 담보 확인 → 체결을 기록합니다.' },
  { label: '주문서 추가', body: '미체결 잔량이 있으면 해당 가격 레벨에 추가합니다.' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

export default function MatchingFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 70" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="mf-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {NODES.map((n, i) => {
            const x = 10 + i * 94, w = 80, h = 38;
            const active = step === i;
            const vis = step === i || step === 0;
            return (
              <motion.g key={i} animate={{ opacity: vis || active ? 1 : 0.15 }} transition={sp}>
                <rect x={x} y={16} width={w} height={h} rx={5}
                  fill={active ? n.color + '22' : '#ffffff08'}
                  stroke={n.color} strokeWidth={active ? 2 : 0.8} />
                <text x={x + w / 2} y={31} textAnchor="middle" fontSize={11} fontWeight={600}
                  fill={n.color}>{n.label}</text>
                <text x={x + w / 2} y={46} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{n.sub}</text>
                {i < 4 && (
                  <text x={x + w + 7} y={38} textAnchor="middle" fontSize={10}
                    fill="var(--muted-foreground)" opacity={0.5}>→</text>
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
