import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

export function ErrorStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={30} y={20} width={130} height={50} rx={6}
        fill="#6366f110" stroke="#6366f1" strokeWidth={1.2} />
      <text x={95} y={38} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">io.EOF</text>
      <text x={95} y={56} textAnchor="middle" fontSize={9} fill="var(--foreground)">데이터 없음 (대기)</text>
      <rect x={185} y={20} width={130} height={50} rx={6}
        fill="#ef444410" stroke="#ef4444" strokeWidth={1.2} />
      <text x={250} y={38} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">ResetError</text>
      <text x={250} y={56} textAnchor="middle" fontSize={9} fill="var(--foreground)">reorg → 파이프라인 리셋</text>
      <rect x={340} y={20} width={130} height={50} rx={6}
        fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1.2} />
      <text x={405} y={38} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">ChannelFullErr</text>
      <text x={405} y={56} textAnchor="middle" fontSize={9} fill="var(--foreground)">채널 용량 초과</text>
      <rect x={130} y={100} width={240} height={34} rx={5}
        fill="#10b98110" stroke="#10b981" strokeWidth={1} />
      <text x={250} y={114} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={500}>
        호출자가 에러 값을 검사하여 분기 처리
      </text>
      <text x={250} y={126} textAnchor="middle" fontSize={9} fill="var(--foreground)">
        errors.As(err, &target) / err == io.EOF
      </text>
      {[95, 250, 405].map((cx, i) => (
        <motion.line key={i} x1={cx} y1={70} x2={250} y2={100}
          stroke="var(--muted-foreground)" strokeWidth={0.8} strokeDasharray="3 2"
          initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: i * 0.12 }} />
      ))}
    </motion.g>
  );
}

export function PointerRecvStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={30} y={20} width={140} height={70} rx={6}
        fill="#0ea5e910" stroke="#0ea5e9" strokeWidth={1.2} />
      <rect x={30} y={20} width={140} height={18} rx={6} fill="#0ea5e930" />
      <text x={100} y={33} textAnchor="middle" fontSize={10} fontWeight={600} fill="#0ea5e9">channelManager</text>
      <text x={42} y={52} fontSize={9} fill="var(--foreground)">blocks: Queue</text>
      <text x={42} y={66} fontSize={9} fill="var(--foreground)">tip: Hash</text>
      <text x={42} y={80} fontSize={9} fill="var(--foreground)">currentChannel</text>
      <motion.path d="M170,55 L210,55" fill="none" stroke="#0ea5e9"
        strokeWidth={1.5} markerEnd="url(#go-arr)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <text x={190} y={48} fontSize={8} fill="#0ea5e9">*ptr</text>
      <rect x={220} y={25} width={260} height={60} rx={6}
        fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1.2} />
      <text x={350} y={42} textAnchor="middle" fontSize={10} fontWeight={500} fill="#8b5cf6">
        func (s *channelManager) AddL2Block()
      </text>
      <text x={350} y={58} textAnchor="middle" fontSize={9} fill="var(--foreground)">
        s.blocks.Enqueue(block) → 원본 직접 수정
      </text>
      <text x={350} y={72} textAnchor="middle" fontSize={9} fill="var(--foreground)">
        s.tip = block.Hash() → 원본의 tip 갱신
      </text>
      <rect x={80} y={110} width={360} height={28} rx={4}
        fill="#ef444408" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="4 2" />
      <text x={260} y={128} textAnchor="middle" fontSize={10} fill="#ef4444">
        값 리시버 (s channelManager) → 복사본 수정 → 원본 불변
      </text>
    </motion.g>
  );
}
