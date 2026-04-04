import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './LstmVizData';

export function GateCalcStep() {
  const gates = [
    { label: 'f = sigmoid(-1.4) = 0.20', sub: 'forget: 기억 20% 유지', c: CV, y: 10 },
    { label: 'i = sigmoid(1.4) = 0.80', sub: 'input: 새 정보 80% 수용', c: CV, y: 42 },
    { label: 'g = tanh(0.69) = 0.60', sub: 'candidate: 후보 기억', c: CE, y: 74 },
    { label: 'o = sigmoid(2.2) = 0.90', sub: 'output: 출력 90% 통과', c: CE, y: 106 },
  ] as const;
  return (
    <g>
      <VizBox x={10} y={35} w={80} h={26} label="x=[0.5,0.3]" sub="입력 벡터" c={CA} />
      <VizBox x={10} y={90} w={80} h={26} label="h=[0.2,0.1]" sub="이전 은닉" c={CA} delay={0.05} />
      {gates.map((g, i) => (
        <VizBox key={i} x={125} y={g.y} w={170} h={26}
          label={g.label} sub={g.sub} c={g.c} delay={0.1 + i * 0.1} />
      ))}
      <motion.line x1={90} y1={48} x2={125} y2={23} stroke={CA} strokeWidth={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15 }} />
      <motion.line x1={90} y1={103} x2={125} y2={87} stroke={CA} strokeWidth={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <text x={310} y={25} fontSize={7} fill="var(--muted-foreground)">
        x@W_x + h@W_h + b
      </text>
      <text x={310} y={37} fontSize={7} fill="var(--muted-foreground)">
        각 게이트 독립 파라미터
      </text>
    </g>
  );
}

export function CellUpdateStep() {
  return (
    <g>
      <VizBox x={5} y={18} w={88} h={28} label="c_prev=1.5" sub="이전 셀 상태" c={CV} />
      <VizBox x={5} y={58} w={88} h={28} label="f=0.2" sub="forget gate" c={CV} delay={0.1} />
      <VizBox x={5} y={98} w={88} h={28} label="i=0.8, g=0.6" sub="input / candidate" c={CE} delay={0.15} />
      <VizBox x={130} y={18} w={98} h={28} label="f*c = 0.30" sub="0.2 * 1.5 (유지)" c={CV} delay={0.2} />
      <VizBox x={130} y={68} w={98} h={28} label="i*g = 0.48" sub="0.8 * 0.6 (추가)" c={CE} delay={0.25} />
      <text x={260} y={55} fontSize={14} fill="var(--muted-foreground)">+</text>
      <VizBox x={280} y={35} w={115} h={36} label="c_new = 0.78" sub="0.30 + 0.48" c={CV} delay={0.4} />
      <motion.line x1={93} y1={32} x2={130} y2={32} stroke={CV} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15 }} />
      <motion.line x1={228} y1={32} x2={260} y2={48} stroke={CV} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <motion.line x1={228} y1={82} x2={260} y2={62} stroke={CE} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
      <motion.text x={280} y={88} fontSize={7} fill={CE}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        역전파: dc/dc_prev = f = 0.2 (기울기 직접 전달)
      </motion.text>
      <motion.text x={280} y={100} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        덧셈 경로 → 기울기 소실 완화
      </motion.text>
    </g>
  );
}

export function HiddenOutputStep() {
  return (
    <g>
      <VizBox x={5} y={35} w={100} h={32} label="c_new=0.78" sub="장기 기억" c={CV} />
      <VizBox x={135} y={15} w={105} h={28} label="tanh(0.78)" sub="= 0.653" c={CV} delay={0.1} />
      <VizBox x={135} y={65} w={105} h={28} label="o gate=0.9" sub="출력 필터" c={CE} delay={0.15} />
      <text x={268} y={52} fontSize={14} fill="var(--muted-foreground)">*</text>
      <VizBox x={290} y={30} w={110} h={38} label="h_new=0.588" sub="0.9 * 0.653" c={CE} delay={0.3} />
      <motion.line x1={105} y1={51} x2={135} y2={29} stroke={CV} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.12 }} />
      <motion.line x1={240} y1={29} x2={268} y2={45} stroke={CV} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.line x1={240} y1={79} x2={268} y2={58} stroke={CE} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 }} />
      <text x={290} y={86} fontSize={7} fill="var(--muted-foreground)">
        h → 다음 스텝 입력 + 외부 출력으로 분기
      </text>
      <text x={290} y={98} fontSize={7} fill="var(--muted-foreground)">
        c는 내부적으로만 전달 (외부 노출 안 함)
      </text>
    </g>
  );
}

export function FirstVsLaterStep() {
  return (
    <g>
      <VizBox x={10} y={20} w={180} h={50} label="첫 스텝 (h=None, c=None)"
        sub="f,i,o = sigmoid(x@W_x) / g = tanh(x@W_x)" c={CA} />
      <VizBox x={10} y={90} w={180} h={50} label="이후 스텝 (h=Some, c=Some)"
        sub="f,i,o = sigmoid(x@W_x + h@W_h)" c={CE} delay={0.2} />
      <VizBox x={230} y={20} w={160} h={28} label="c = i * g"
        sub="forget 없음 — 모든 것이 새 기억" c={CV} delay={0.3} />
      <VizBox x={230} y={62} w={160} h={28} label="c = f*c + i*g"
        sub="기존 기억과 새 기억의 가중합" c={CV} delay={0.4} />
      <VizBox x={230} y={105} w={160} h={28} label="reset_state()"
        sub="h, c 모두 None으로 초기화" c={CA} delay={0.5} />
      <motion.line x1={190} y1={45} x2={230} y2={34} stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
      <motion.line x1={190} y1={115} x2={230} y2={76} stroke={CE} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
    </g>
  );
}
