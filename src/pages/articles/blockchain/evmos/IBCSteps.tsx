import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const LINES = [
  { code: 'stack := ibcCallbacksMW(erc20MW(ibcTransferModule))', color: '#8b5cf6', desc: 'IBC Callbacks MW: 컨트랙트 콜백 호출' },
  { code: 'erc20MW.OnRecvPacket(ctx, packet)  // 수신 시 ERC20 민팅', color: '#10b981', desc: 'ERC20 Middleware: Coin ↔ ERC20 자동 변환' },
  { code: 'transfer.OnRecvPacket(ctx, packet) // 기본 IBC 전송 처리', color: '#6366f1', desc: 'IBC Transfer Module: 기본 토큰 전송 로직' },
];

export default function IBCSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={11} fontWeight={700} fill="var(--foreground)">
        IBC 미들웨어 스택 — 수신 시 위→아래 순서 실행
      </text>
      {LINES.map((l, i) => {
        const active = step === 0 || step === i + 1;
        const y = 24 + i * 40;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={15} y={y} width={450} height={34} rx={4}
              fill={step === i + 1 ? `${l.color}12` : `${l.color}06`}
              stroke={l.color} strokeWidth={step === i + 1 ? 1.5 : 0.5} />
            <text x={25} y={y + 14} fontSize={10} fontWeight={600} fill={l.color} fontFamily="monospace">
              Line {i + 1}: {l.code}
            </text>
            <text x={25} y={y + 28} fontSize={10} fill="var(--muted-foreground)">
              {l.desc}
            </text>
          </motion.g>
        );
      })}
      <motion.g animate={{ opacity: step === 4 ? 1 : 0 }} transition={sp}>
        <text x={15} y={150} fontSize={10} fill="#10b981">
          수신: 위→아래 (Callbacks → ERC20 → Transfer) / 송신: 아래→위
        </text>
      </motion.g>
    </svg>
  );
}
