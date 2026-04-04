import { motion } from 'framer-motion';
import { C } from './AgentLoopVizData';
import { Box, Arrow, Label } from './AgentLoopVizParts';

export function Step3() {
  return (
    <g>
      <Box x={10} y={55} w={80} h={40} color={C.tools} label="도구 호출" sub="Write, Bash..." />
      <Arrow x1={90} y1={75} x2={120} y2={75} color={C.tools} />
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
        <rect x={125} y={50} width={70} height={50} rx={6}
          fill={`${C.perm}12`} stroke={C.perm} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={160} y={72} textAnchor="middle" fontSize={9} fontWeight="700" fill={C.perm}>권한 확인</text>
        <text x={160} y={86} textAnchor="middle" fontSize={9} fill={C.perm} opacity={0.7}>Ask / Auto / YOLO</text>
      </motion.g>
      <Arrow x1={195} y1={75} x2={225} y2={75} color={C.perm} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <Box x={230} y={55} w={70} h={40} color={C.tools} label="실행" sub="도구 동작" />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Arrow x1={300} y1={75} x2={325} y2={75} color={C.tools} />
        <Box x={325} y={55} w={50} h={40} color={C.api} label="결과" sub="수집" />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Label x={115} y={120} text="OS 샌드박싱: Seatbelt (macOS) / bwrap (Linux)" color={C.perm} />
      </motion.g>
    </g>
  );
}

export function Step4() {
  return (
    <g>
      <Box x={130} y={15} w={110} h={35} color={C.api} label="Claude API" />
      <Box x={270} y={60} w={90} h={35} color={C.tools} label="도구 실행" />
      <Box x={130} y={110} w={110} h={35} color={C.api} label="결과 추가" sub="컨텍스트 업데이트" />
      <Arrow x1={240} y1={32} x2={290} y2={60} color={C.api} />
      <Arrow x1={315} y1={95} x2={240} y2={120} color={C.tools} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Arrow x1={130} y1={127} x2={80} y2={90} color={C.api} dashed />
        <Arrow x1={80} y1={60} x2={130} y2={32} color={C.api} dashed />
        <text x={55} y={80} textAnchor="middle" fontSize={10} fontWeight="800" fill={C.user}>Loop</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={10} y={150} width={360} height={22} rx={4} fill={`${C.user}15`} stroke={C.user} strokeWidth={1} />
        <text x={190} y={165} textAnchor="middle" fontSize={9} fontWeight="700" fill={C.user}>
          평균 21.2회 도구 호출 / 요청 | 병렬 실행 가능 | 서브에이전트 최대 7개
        </text>
      </motion.g>
    </g>
  );
}
