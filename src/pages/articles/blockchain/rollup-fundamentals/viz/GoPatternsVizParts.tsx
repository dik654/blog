import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

export function StructEmbedStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={30} y={20} width={140} height={60} rx={6}
        fill="#6366f110" stroke="#6366f1" strokeWidth={1.2} />
      <rect x={30} y={20} width={140} height={18} rx={6} fill="#6366f130" />
      <text x={100} y={33} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">DriverSetup</text>
      <text x={40} y={54} fontSize={9} fill="var(--foreground)">Log, Metr, Config</text>
      <text x={40} y={68} fontSize={9} fill="var(--foreground)">TxManager, Endpoint</text>
      <rect x={200} y={10} width={270} height={100} rx={6}
        fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1.5} />
      <rect x={200} y={10} width={270} height={18} rx={6} fill="#8b5cf630" />
      <text x={335} y={23} textAnchor="middle" fontSize={10} fontWeight={600} fill="#8b5cf6">BatchSubmitter</text>
      <rect x={215} y={36} width={110} height={30} rx={4}
        fill="#6366f115" stroke="#6366f1" strokeWidth={0.8} strokeDasharray="4 2" />
      <text x={270} y={55} textAnchor="middle" fontSize={9} fontWeight={500} fill="#6366f1">DriverSetup (임베딩)</text>
      <text x={340} y={48} fontSize={9} fill="var(--foreground)">channelMgr</text>
      <text x={340} y={62} fontSize={9} fill="var(--foreground)">publishSignal</text>
      <text x={340} y={76} fontSize={9} fill="var(--foreground)">shutdownCtx</text>
      <motion.path d="M170,50 Q185,50 200,50" fill="none" stroke="#6366f1"
        strokeWidth={1.2} strokeDasharray="3 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.5 }} />
      <text x={250} y={130} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        Go에는 클래스 상속이 없다 → 구조체를 "임베딩"하여 코드 재사용
      </text>
    </motion.g>
  );
}

export function ChannelStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={30} y={30} width={120} height={50} rx={6}
        fill="#10b98110" stroke="#10b981" strokeWidth={1.2} />
      <text x={90} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">main 루프</text>
      <text x={90} y={64} textAnchor="middle" fontSize={9} fill="var(--foreground)">publishSignal &lt;- info</text>
      <motion.rect x={175} y={40} width={130} height={30} rx={15}
        fill="#f59e0b15" stroke="#f59e0b" strokeWidth={1.5}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2 }} />
      <text x={240} y={59} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">chan pubInfo</text>
      <rect x={330} y={30} width={140} height={50} rx={6}
        fill="#6366f110" stroke="#6366f1" strokeWidth={1.2} />
      <text x={400} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">제출 고루틴</text>
      <text x={400} y={64} textAnchor="middle" fontSize={9} fill="var(--foreground)">sig := &lt;-publishSignal</text>
      <motion.line x1={150} y1={55} x2={175} y2={55} stroke="#10b981" strokeWidth={1.2}
        markerEnd="url(#go-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
      <motion.line x1={305} y1={55} x2={330} y2={55} stroke="#6366f1" strokeWidth={1.2}
        markerEnd="url(#go-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
      <text x={250} y={110} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        보내는 쪽 블로킹 → 받는 쪽이 준비될 때까지 대기 (동기화)
      </text>
    </motion.g>
  );
}

export function ContextStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={180} y={10} width={120} height={32} rx={6}
        fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={240} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">shutdownCtx</text>
      <rect x={50} y={70} width={110} height={30} rx={5}
        fill="#6366f110" stroke="#6366f1" strokeWidth={1} />
      <text x={105} y={89} textAnchor="middle" fontSize={9} fontWeight={500} fill="#6366f1">Step(ctx)</text>
      <rect x={190} y={70} width={110} height={30} rx={5}
        fill="#10b98110" stroke="#10b981" strokeWidth={1} />
      <text x={245} y={89} textAnchor="middle" fontSize={9} fontWeight={500} fill="#10b981">AdvanceL1(ctx)</text>
      <rect x={330} y={70} width={110} height={30} rx={5}
        fill="#ec489910" stroke="#ec4899" strokeWidth={1} />
      <text x={385} y={89} textAnchor="middle" fontSize={9} fontWeight={500} fill="#ec4899">FetchReceipts(ctx)</text>
      {[105, 245, 385].map((cx, i) => (
        <motion.line key={i} x1={240} y1={42} x2={cx} y2={70}
          stroke="var(--muted-foreground)" strokeWidth={0.8} strokeDasharray="3 2"
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: i * 0.15 }} />
      ))}
      <motion.text x={240} y={130} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ef4444"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        cancel() → 모든 자식에 취소 전파
      </motion.text>
    </motion.g>
  );
}
