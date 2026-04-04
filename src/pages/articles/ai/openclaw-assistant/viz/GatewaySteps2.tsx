import { motion } from 'framer-motion';
import { C } from './GatewayVizData';
import { Box, Arrow } from './GatewayVizParts';

export function Step2() {
  return (
    <g>
      <Box x={10} y={30} w={100} h={36} label="Tool Adapter" color={C.pi} sub="toToolDefinitions()" />
      <Arrow x1={110} y1={48} x2={150} y2={90} color={C.pi} delay={0.1} />
      <Box x={150} y={70} w={120} h={44} label="Pi Agent Session" color={C.pi} sub="createAgentSession()" />
      <Arrow x1={270} y1={92} x2={300} y2={92} color={C.pi} delay={0.3} />
      <Box x={300} y={70} w={90} h={44} label="LLM Model" color={C.pi} sub="멀티 프로바이더" />
      <motion.path d="M 345,114 C 345,140 210,145 210,114"
        fill="none" stroke={C.pi} strokeWidth={1} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }} />
      <motion.text x={270} y={155} textAnchor="middle" fontSize={9} fill={C.pi}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        에이전트 루프 (도구 호출 반복)
      </motion.text>
      {['bash', 'read', 'edit', 'messaging'].map((t, i) => (
        <motion.g key={t} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}>
          <rect x={10 + i * 55} y={140} width={48} height={20} rx={3}
            fill={`${C.pi}15`} stroke={C.pi} strokeWidth={1} />
          <text x={34 + i * 55} y={154} textAnchor="middle" fontSize={9} fill={C.pi}>{t}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function Step3() {
  return (
    <g>
      <Box x={10} y={65} w={100} h={44} label="Pi Agent" color={C.pi} sub="text_delta 이벤트" />
      {[0, 1, 2, 3, 4].map(i => (
        <motion.circle key={i} cx={130 + i * 18} cy={87} r={3} fill={C.response}
          initial={{ opacity: 0, x: -5 }} animate={{ opacity: [0, 1, 0.3], x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.12, repeat: Infinity, repeatDelay: 1 }} />
      ))}
      <Box x={230} y={55} w={100} h={26} label="SSE Stream" color={C.response} />
      <Box x={230} y={90} w={100} h={26} label="WebSocket" color={C.response} />
      <Arrow x1={330} y1={68} x2={360} y2={68} color={C.response} delay={0.4} />
      <Arrow x1={330} y1={103} x2={360} y2={103} color={C.response} delay={0.5} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={360} y={60} width={30} height={50} rx={4} fill={`${C.client}18`} stroke={C.client} strokeWidth={1.5} />
        <text x={375} y={89} textAnchor="middle" fontSize={9} fontWeight="600" fill={C.client}>Client</text>
      </motion.g>
      <motion.text x={200} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        채널별 리치 메시지 포맷으로 변환하여 실시간 전달
      </motion.text>
    </g>
  );
}
