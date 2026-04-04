import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '사용자 메시지' }, { label: 'Gateway 수신' }, { label: '채널 라우터' },
  { label: '스킬 엔진' }, { label: 'Pi 에이전트' }, { label: '응답 전달' },
];
const BODY = [
  'TG/Discord/Slack 채널 메시지', 'WebSocket 수신 + 인증 구분',
  'MsgContext 정규화 + 접근 제어', '명령어 매칭 → 스킬 실행',
  'createAgentSession() 루프 실행', 'text_delta → 리치 포맷 전송',
];

const NODES = [
  { label: '사용자', sub: 'TG/Discord', color: '#6366f1' },
  { label: 'Gateway', sub: 'Node.js', color: '#3b82f6' },
  { label: '채널 라우터', sub: '정규화+ACL', color: '#10b981' },
  { label: '스킬 엔진', sub: '명령 매칭', color: '#f59e0b' },
  { label: 'Pi 에이전트', sub: '에이전틱 루프', color: '#8b5cf6' },
  { label: '응답 전달', sub: '리치 메시지', color: '#ec4899' },
];

const EDGES = ['WebSocket', '인증 후 라우팅', 'MsgContext', '도구 호출', 'text_delta'];

export default function ChannelMessageFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 740 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cm-arr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M0 0L6 3L0 6z" fill="#888" />
            </marker>
          </defs>
          {NODES.map((n, i) => {
            const x = i * 103;
            const active = i === step;
            const done = i < step;
            return (
              <g key={i}>
                {i > 0 && (
                  <motion.line x1={x - 6} y1={40} x2={x + 2} y2={40}
                    stroke={done || active ? n.color : '#555'}
                    strokeWidth={1.5} markerEnd="url(#cm-arr)"
                    animate={{ opacity: done || active ? 0.9 : 0.15 }} />
                )}
                <motion.rect x={x + 4} y={12} width={94} height={56} rx={8}
                  fill={n.color}
                  animate={{ opacity: active ? 1 : done ? 0.5 : 0.15 }}
                  transition={{ duration: 0.3 }} />
                <text x={x + 51} y={35} textAnchor="middle"
                  fontSize={11} fontWeight={700} fill="white"
                  style={{ opacity: active ? 1 : done ? 0.7 : 0.3 }}>{n.label}</text>
                <text x={x + 51} y={50} textAnchor="middle"
                  fontSize={10} fill="white" opacity={0.6}
                  style={{ opacity: active ? 1 : done ? 0.5 : 0.2 }}>{n.sub}</text>
                {i > 0 && (
                  <text x={x - 2} y={28} textAnchor="middle"
                    fontSize={10} fill="var(--muted-foreground)"
                    style={{ opacity: done || active ? 0.7 : 0.15 }}>{EDGES[i - 1]}</text>
                )}
              </g>
            );
          })}
          {/* 응답 → 사용자 리턴 화살표 */}
          <motion.path d="M 555 68 Q 555 82 310 82 Q 51 82 51 68"
            fill="none" stroke="#6366f1" strokeWidth={1.2}
            strokeDasharray="4 3" markerEnd="url(#cm-arr)"
            animate={{ opacity: step === 5 ? 0.7 : 0.06 }} />
          {step === 5 && (
            <text x={310} y={78} textAnchor="middle"
              fontSize={10} fill="var(--muted-foreground)" style={{ opacity: 0.7 }}>
              플랫폼 포맷
            </text>
          )}
          {/* inline body */}
          <motion.text x={630} y={45} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
