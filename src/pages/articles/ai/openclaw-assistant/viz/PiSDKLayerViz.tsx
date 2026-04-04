import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const LAYERS = [
  { label: 'pi-ai', sub: 'LLM 추상화', color: '#6366f1', y: 85 },
  { label: 'pi-agent-core', sub: '에이전트 루프', color: '#10b981', y: 60 },
  { label: 'pi-coding-agent', sub: '세션 관리', color: '#f59e0b', y: 35 },
  { label: 'OpenClaw', sub: '채널 통합', color: '#8b5cf6', y: 10 },
];
const LX = 60, LW = 250, LH = 22;

const STEPS = [
  { label: 'pi-ai — LLM 추상화 계층' }, { label: 'pi-agent-core — 에이전트 루프' },
  { label: 'pi-coding-agent — 세션 관리' }, { label: 'OpenClaw — 채널 통합' },
];
const BODY = [
  'LLM 추상화 + 프로바이더 API 통합', '도구 실행 + 에이전트 상태 관리',
  'SessionManager + 코딩 도구 제공', '채널/스킬/샌드박스 통합 에이전트',
];

export default function PiSDKLayerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const active = step === i;
            const below = step > i;
            const op = active ? 1 : below ? 0.6 : 0.25;
            return (
              <g key={l.label}>
                <motion.rect x={LX} y={l.y} width={LW} height={LH} rx={5}
                  animate={{ fill: `${l.color}${active ? '22' : '0a'}`, stroke: l.color,
                    strokeWidth: active ? 2 : 0.8, opacity: op }}
                  transition={{ duration: 0.3 }} />
                <text x={LX + 12} y={l.y + LH / 2 + 3} fontSize={9} fontWeight={600}
                  fill={l.color} opacity={op}>{l.label}</text>
                <text x={LX + LW - 12} y={l.y + LH / 2 + 3} textAnchor="end" fontSize={9}
                  fill="var(--muted-foreground)" opacity={op * 0.7}>{l.sub}</text>
                {/* dependency arrow */}
                {i > 0 && (
                  <motion.line x1={LX + LW / 2} y1={l.y} x2={LX + LW / 2} y2={l.y - 3}
                    stroke={l.color} strokeWidth={1} opacity={op * 0.4} />
                )}
              </g>
            );
          })}
          {/* highlight bracket */}
          {step >= 0 && (
            <motion.line x1={LX - 8} y1={LAYERS[step].y}
              x2={LX - 8} y2={LAYERS[step].y + LH}
              stroke={LAYERS[step].color} strokeWidth={1.5} strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }} />
          )}
          {/* side labels */}
          <text x={LX - 16} y={55} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
            transform="rotate(-90, 38, 55)">의존성 ↑</text>
          {/* inline body */}
          <motion.text x={380} y={57} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
