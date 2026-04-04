import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Channel', sub: 'Telegram/Discord', color: '#6366f1', x: 5 },
  { label: '정규화', sub: 'MsgContext', color: '#10b981', x: 70 },
  { label: '접근제어', sub: 'Policy', color: '#f59e0b', x: 135 },
  { label: '세션', sub: 'Router', color: '#8b5cf6', x: 200 },
  { label: '에이전트', sub: 'Pi Loop', color: '#ec4899', x: 265 },
  { label: '응답', sub: 'Rich Msg', color: '#14b8a6', x: 325 },
];
const BW = 56, BH = 40, CY = 48;

const STEPS = [
  { label: 'Channel Ingress' }, { label: '정규화 & 중복 제거' },
  { label: '접근 제어' }, { label: '세션 라우팅' },
  { label: '에이전트 처리' }, { label: '응답 전달' },
];
const BODY = [
  '웹훅/API 폴링으로 이벤트 수신', 'MsgContext로 플랫폼 차이 추상화',
  'dmPolicy + groupPolicy 권한 검사', '에이전트 세션 라우팅 + 컨텍스트',
  'Pi 루프 → 스킬 + 서브에이전트', '리치 메시지(MD, 이미지) 변환 전달',
];

export default function ChannelFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 505 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const active = step === i;
            const done = step > i;
            const op = active ? 1 : done ? 0.5 : 0.2;
            return (
              <g key={n.label}>
                <motion.rect x={n.x} y={CY - BH / 2} width={BW} height={BH} rx={5}
                  animate={{ fill: `${n.color}${active ? '22' : '0c'}`, stroke: n.color,
                    strokeWidth: active ? 2 : 1, opacity: op }}
                  transition={{ duration: 0.3 }} />
                <text x={n.x + BW / 2} y={CY - 2} textAnchor="middle" fontSize={7.5}
                  fontWeight={600} fill={active ? n.color : 'var(--foreground)'} opacity={op}>
                  {n.label}
                </text>
                <text x={n.x + BW / 2} y={CY + 9} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)" opacity={op * 0.7}>{n.sub}</text>
                {i < NODES.length - 1 && (
                  <line x1={n.x + BW + 1} y1={CY} x2={NODES[i + 1].x - 1} y2={CY}
                    stroke="var(--border)" strokeWidth={1} opacity={done ? 0.5 : 0.1} />
                )}
              </g>
            );
          })}
          {/* data packet */}
          <motion.circle r={5}
            animate={{ cx: NODES[step].x + BW / 2, cy: CY - BH / 2 - 9 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            fill={NODES[step].color}
            style={{ filter: `drop-shadow(0 0 4px ${NODES[step].color}88)` }} />
          {/* inline body */}
          <motion.text x={395} y={55} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
