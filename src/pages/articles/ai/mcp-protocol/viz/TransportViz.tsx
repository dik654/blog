import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, TRANSPORTS } from './TransportData';

const W = 460, H = 230;
const LW = 120, RW = 120, MW = 100;
const LX = 30, MX = (W - MW) / 2, RX = W - RW - 30;

/* Real protocol-level message examples per transport */
const MSG_EXAMPLES: Record<number, { dir: string; msg: string }> = {
  1: { dir: 'stdin →', msg: '{"jsonrpc":"2.0","method":"tools/list","id":1}' },
  2: { dir: 'POST →', msg: '/mcp  {"method":"tools/call","params":{...}}' },
  3: { dir: 'POST →', msg: '/mcp  Accept: text/event-stream' },
};

export default function TransportViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Client box (left) */}
          <rect x={LX} y={70} width={LW} height={36} rx={6}
            fill="#6366f110" stroke="#6366f1" strokeWidth={1} />
          <text x={LX + LW / 2} y={92} textAnchor="middle"
            fontSize={10} fontWeight={600} fill="#6366f1">Client</text>

          {/* Server box (right) */}
          <rect x={RX} y={70} width={RW} height={36} rx={6}
            fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} />
          <text x={RX + RW / 2} y={92} textAnchor="middle"
            fontSize={10} fontWeight={600} fill="#f59e0b">Server</text>

          {/* Transport rows */}
          {TRANSPORTS.map((t, i) => {
            const active = step === i + 1;
            const op = step === 0 ? 0.6 : active ? 1 : 0.15;
            return (
              <motion.g key={t.label} animate={{ opacity: op }}
                transition={{ duration: 0.3 }}>
                {/* center transport box */}
                <rect x={MX} y={t.y - 10} width={MW} height={34} rx={6}
                  fill={active ? `${t.color}20` : `${t.color}08`}
                  stroke={t.color} strokeWidth={active ? 2 : 1} />
                <text x={MX + MW / 2} y={t.y + 5} textAnchor="middle"
                  fontSize={9} fontWeight={700} fill={t.color}>{t.label}</text>
                <text x={MX + MW / 2} y={t.y + 17} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)">{t.arrow}</text>
                {/* left arrow */}
                <line x1={LX + LW} y1={88} x2={MX} y2={t.y + 7}
                  stroke={t.color} strokeWidth={0.8} opacity={active ? 0.6 : 0.2}
                  strokeDasharray={active ? 'none' : '3 2'} />
                {/* right arrow */}
                <line x1={MX + MW} y1={t.y + 7} x2={RX} y2={88}
                  stroke={t.color} strokeWidth={0.8} opacity={active ? 0.6 : 0.2}
                  strokeDasharray={active ? 'none' : '3 2'} />
              </motion.g>
            );
          })}

          {/* Real protocol message example */}
          {step >= 1 && step <= 3 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={30} y={182} width={400} height={26} rx={4}
                fill="var(--card)" stroke={TRANSPORTS[step - 1].color}
                strokeWidth={1} />
              <rect x={30} y={182} width={4} height={26} rx={2}
                fill={TRANSPORTS[step - 1].color} />
              <text x={44} y={196} fontSize={8} fontWeight={600}
                fill={TRANSPORTS[step - 1].color}>{MSG_EXAMPLES[step].dir}</text>
              <text x={92} y={196} fontSize={8} fontFamily="monospace"
                fill="var(--muted-foreground)">{MSG_EXAMPLES[step].msg}</text>
            </motion.g>
          )}

          {/* scenario label */}
          {step >= 1 && step <= 3 && (
            <motion.text x={W / 2} y={222} textAnchor="middle"
              fontSize={9} fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              {['로컬 도구 (파일, git)', '원격 API 서버', '클라우드 배포 (stateless)'][step - 1]}
            </motion.text>
          )}

          {/* overview label */}
          {step === 0 && (
            <motion.text x={W / 2} y={215} textAnchor="middle"
              fontSize={9} fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              JSON-RPC 2.0 기반 — 전송 방식만 교체 가능
            </motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
