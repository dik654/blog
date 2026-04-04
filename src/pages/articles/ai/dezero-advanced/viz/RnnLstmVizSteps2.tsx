import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './RnnLstmVizData';

export function RefCellStep() {
  const fields = [
    { label: 'h: RefCell<Option>', sub: '은닉 상태', y: 20, c: CE },
    { label: 'c: RefCell<Option>', sub: '셀 상태', y: 55, c: CV },
    { label: 'w_hf..w_hg: RefCell', sub: '4개 lazy 가중치', y: 90, c: CA },
  ] as const;
  return (
    <g>
      {fields.map((f, i) => (
        <VizBox key={i} x={20} y={f.y} w={160} h={28}
          label={f.label} sub={f.sub} c={f.c} delay={i * 0.12} />
      ))}
      <VizBox x={240} y={20} w={140} h={28}
        label="첫 스텝: None" sub="h 없이 x→gate만 계산" c={CA} delay={0.4} />
      <VizBox x={240} y={60} w={140} h={28}
        label="이후: Some(h)" sub="x→gate + h→gate" c={CE} delay={0.5} />
      <VizBox x={240} y={100} w={140} h={28}
        label="reset_state()" sub="시퀀스 끝에서 None 복원" c={CV} delay={0.6} />
      <motion.line x1={180} y1={34} x2={240} y2={34} stroke={CE} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
    </g>
  );
}

export function ParamCompareStep() {
  const rnnH = 40, lstmH = 100;
  return (
    <g>
      <text x={80} y={15} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={CA}>RNN</text>
      <motion.rect x={40} y={130 - rnnH} width={80} height={rnnH} rx={4}
        fill={`${CA}30`} stroke={CA} strokeWidth={1}
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        style={{ transformOrigin: '80px 130px' }} transition={{ delay: 0.1 }} />
      <text x={80} y={130 - rnnH / 2 + 3} textAnchor="middle"
        fontSize={8} fill={CA}>W_h x 1</text>
      <text x={280} y={15} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={CV}>LSTM</text>
      <motion.rect x={220} y={130 - lstmH} width={120} height={lstmH} rx={4}
        fill={`${CV}20`} stroke={CV} strokeWidth={1}
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        style={{ transformOrigin: '280px 130px' }} transition={{ delay: 0.2 }} />
      {['W_hf', 'W_hi', 'W_ho', 'W_hg'].map((n, i) => (
        <text key={i} x={280} y={130 - lstmH + 18 + i * 22}
          textAnchor="middle" fontSize={8} fill={CV}>{n}</text>
      ))}
      <text x={80} y={145} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)">H*H 파라미터</text>
      <text x={280} y={145} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)">4*H*H 파라미터 (+ Linear x 4)</text>
    </g>
  );
}
