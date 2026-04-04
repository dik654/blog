import { motion } from 'framer-motion';
import { C } from './GatewayVizData';
import { Box, Arrow } from './GatewayVizParts';

export function Step0() {
  return (
    <g>
      <Box x={10} y={20} w={80} h={32} label="Operator" color={C.client} sub="CLI / TUI" />
      <Box x={10} y={70} w={80} h={32} label="Node" color={C.client} sub="macOS / iOS" />
      <Box x={10} y={120} w={80} h={32} label="WebChat" color={C.client} sub="브라우저" />
      <Arrow x1={90} y1={36} x2={180} y2={86} color={C.client} delay={0.1} />
      <Arrow x1={90} y1={86} x2={180} y2={90} color={C.client} delay={0.2} />
      <Arrow x1={90} y1={136} x2={180} y2={96} color={C.client} delay={0.3} />
      <Box x={180} y={65} w={140} h={50} label="OpenClaw Gateway" color={C.gateway} sub="ws://127.0.0.1:18789" />
      <motion.text x={200} y={150} fontSize={9} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        단일 Node.js 프로세스로 모든 클라이언트 관리
      </motion.text>
    </g>
  );
}

export function Step1() {
  return (
    <g>
      <Box x={10} y={65} w={80} h={50} label="Gateway" color={C.gateway} sub="Channel Router" />
      <Arrow x1={90} y1={78} x2={150} y2={30} color={C.gateway} delay={0.1} />
      <Arrow x1={90} y1={85} x2={150} y2={65} color={C.gateway} delay={0.15} />
      <Arrow x1={90} y1={92} x2={150} y2={100} color={C.gateway} delay={0.2} />
      <Arrow x1={90} y1={100} x2={150} y2={135} color={C.gateway} delay={0.25} />
      <Arrow x1={90} y1={107} x2={150} y2={170} color={C.gateway} delay={0.3} />
      {['WhatsApp', 'Telegram', 'Slack', 'Discord', 'iMessage'].map((ch, i) => (
        <motion.g key={ch} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}>
          <rect x={150} y={18 + i * 35} width={70} height={24} rx={4}
            fill={`${C.gateway}15`} stroke={C.gateway} strokeWidth={1} />
          <text x={185} y={34 + i * 35} textAnchor="middle" fontSize={9} fontWeight="500" fill={C.gateway}>{ch}</text>
        </motion.g>
      ))}
      <motion.text x={240} y={60} fontSize={9} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>+ Matrix, Teams,</motion.text>
      <motion.text x={240} y={72} fontSize={9} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>IRC, Signal, ...</motion.text>
      <motion.text x={240} y={90} fontSize={9} fontWeight="600" fill={C.gateway}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>20+ 채널 지원</motion.text>
    </g>
  );
}
