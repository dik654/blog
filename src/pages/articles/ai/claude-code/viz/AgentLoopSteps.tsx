import { motion } from 'framer-motion';
import { C } from './AgentLoopVizData';
import { Box, Arrow, Label } from './AgentLoopVizParts';

export function Step0() {
  return (
    <g>
      <Box x={20} y={50} w={120} h={50} color={C.user} label="User" sub="자연어 명령 입력" />
      <Arrow x1={140} y1={75} x2={210} y2={75} color={C.user} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Box x={220} y={50} w={130} h={50} color={C.api} label="Claude API" sub="메시지 수신 대기" />
      </motion.g>
      <Label x={155} y={68} text="프롬프트 전달" />
    </g>
  );
}

export function Step1() {
  return (
    <g>
      <Box x={10} y={20} w={100} h={40} color={C.user} label="Messages" sub="대화 히스토리" />
      <Box x={10} y={75} w={100} h={40} color={C.tools} label="Tool Defs" sub="Read, Bash, Grep..." />
      <Arrow x1={110} y1={50} x2={160} y2={70} color={C.user} />
      <Arrow x1={110} y1={90} x2={160} y2={75} color={C.tools} />
      <Box x={170} y={45} w={130} h={50} color={C.api} label="Claude API" sub="~200K 토큰 컨텍스트" />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <Arrow x1={300} y1={70} x2={345} y2={70} color={C.api} />
        <Label x={310} y={60} text="응답 생성" />
        <rect x={345} y={55} width={25} height={30} rx={4} fill={`${C.api}22`} stroke={C.api} strokeWidth={1} strokeDasharray="3 2" />
        <text x={357} y={74} textAnchor="middle" fontSize={9} fill={C.api}>...</text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  return (
    <g>
      <Box x={120} y={10} w={130} h={40} color={C.api} label="Claude 응답" />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <polygon points="185,70 220,90 185,110 150,90" fill={`${C.api}15`} stroke={C.api} strokeWidth={1.5} />
        <text x={185} y={93} textAnchor="middle" fontSize={9} fontWeight="600" fill={C.api}>분기</text>
      </motion.g>
      <Arrow x1={185} y1={50} x2={185} y2={70} color={C.api} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <Arrow x1={150} y1={90} x2={40} y2={90} color={C.user} />
        <Box x={5} y={105} w={90} h={35} color={C.user} label="텍스트 출력" sub="사용자에게 표시" />
        <Label x={60} y={84} text="텍스트 응답" color={C.user} />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Arrow x1={220} y1={90} x2={290} y2={90} color={C.tools} />
        <Box x={290} y={72} w={80} h={35} color={C.tools} label="도구 호출" sub="tool_use" />
        <Label x={230} y={84} text="도구 요청" color={C.tools} />
      </motion.g>
    </g>
  );
}
