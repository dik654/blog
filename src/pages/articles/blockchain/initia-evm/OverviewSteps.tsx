import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const APPROACHES = [
  { label: '이더리움 네이티브', stack: ['CL', 'Engine API', 'EL(geth)'], color: '#6366f1' },
  { label: 'Octane (외부 연결)', stack: ['CometBFT', 'ABCI→Engine API', 'geth'], color: '#10b981' },
  { label: 'MiniEVM (내부 임베딩)', stack: ['CometBFT', 'ABCI', 'x/evm 모듈'], color: '#f59e0b' },
];

export default function OverviewSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 400 120" className="w-full max-w-xl" style={{ height: 'auto' }}>
      {APPROACHES.map((a, col) => {
        const x = 20 + col * 135;
        const active = step === 0 || step === col + 1;
        const glow = step === col + 1;
        return (
          <motion.g key={col} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <text x={x + 50} y={12} textAnchor="middle" fontSize={8} fontWeight={700}
              fill={a.color}>{a.label}</text>
            {a.stack.map((item, row) => {
              const y = 20 + row * 30;
              return (
                <g key={row}>
                  <rect x={x} y={y} width={100} height={22} rx={4}
                    fill={glow ? `${a.color}18` : `${a.color}08`}
                    stroke={a.color} strokeWidth={glow ? 1.5 : 0.6} />
                  <text x={x + 50} y={y + 14} textAnchor="middle" fontSize={8}
                    fontWeight={500} fill={a.color}>{item}</text>
                  {row < a.stack.length - 1 && (
                    <line x1={x + 50} y1={y + 22} x2={x + 50} y2={y + 28}
                      stroke={a.color} strokeWidth={0.8} strokeDasharray="2 2" />
                  )}
                </g>
              );
            })}
            {/* highlight border on active */}
            {glow && <rect x={x - 4} y={16} width={108} height={84} rx={6}
              fill="none" stroke={a.color} strokeWidth={1} strokeDasharray="3 3" opacity={0.4} />}
          </motion.g>
        );
      })}
      <text x={200} y={114} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
        외부 연결: IPC 오버헤드 / 내부 임베딩: 낮은 지연, EVM 업데이트 직접 추적
      </text>
    </svg>
  );
}
