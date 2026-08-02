import { useState } from 'react';
import { motion } from 'framer-motion';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import CFGDetailScene from './viz/CFGDetailScene';

const SCALES = [
  { value: 1, label: 'w=1', desc: '조건 방향을 한 번만 사용' },
  { value: 3, label: 'w=3', desc: '조건 방향을 약하게 더 밀기' },
  { value: 7.5, label: 'w=7.5', desc: 'SD 계열에서 자주 쓰는 균형값' },
  { value: 15, label: 'w=15', desc: '조건 방향 과증폭 — 다양성/질감 손상 가능' },
];

export default function CFGSection() {
  const [active, setActive] = useState(2);
  const sel = SCALES[active];

  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Classifier-Free Guidance (CFG)</h3>
      <p>
        같은 <M>{'z_t'}</M> 에서 조건을 비우고 예측하면 <M>{'\\epsilon_\\emptyset'}</M>.
        Prompt 조건 <M>{'c'}</M> 를 넣고 예측하면 <M>{'\\epsilon_c'}</M>.
        두 값의 차이 <M>{'\\epsilon_c-\\epsilon_\\emptyset'}</M> 를 조건이 만든 방향으로 본다.
        <M>{'w'}</M> 는 그 방향을 얼마나 더 밀지 정한다.
        이 방식이 <strong>Classifier-Free Guidance</strong>.
      </p>
      <M display>{'\\hat\\epsilon = \\epsilon_{\\emptyset} + w\\, (\\epsilon_c - \\epsilon_{\\emptyset})'}</M>
      <FormulaNote
        meaning={'CFG는 조건이 없을 때의 기본 denoise 방향에서 출발해, prompt를 넣었을 때 달라진 방향만 분리해서 더한다. 차이 epsilon_c - epsilon_emptyset을 쓰는 이유는 prompt가 만든 변화만 뽑기 위해서다. w는 그 방향의 세기를 키우지만, 너무 크면 다양성과 자연스러운 질감이 줄 수 있다.'}
        symbols={[
          ['epsilon_emptyset', '조건을 비운 기본 noise 예측이다. prompt 효과를 비교할 기준점이다.'],
          ['epsilon_c', 'prompt 조건 c를 넣었을 때의 noise 예측이다.'],
          ['epsilon_c - epsilon_emptyset', '조건이 만든 방향이다. 두 예측의 차이만 남겨 prompt 효과를 분리한다.'],
          ['w', 'guidance scale. 조건 방향을 얼마나 강하게 밀지 정한다.'],
          ['epsilon_hat', '샘플러가 실제로 사용할 최종 noise 예측이다.'],
        ]}
      />
      <div className="not-prose my-4 rounded-xl border border-border bg-card p-5 space-y-4">
        <p className="text-xs font-mono text-foreground/50">Guidance Scale 효과</p>
        <div className="flex gap-2 justify-center">
          {SCALES.map((s, i) => (
            <motion.button key={s.value} whileHover={{ scale: 1.05 }}
              onClick={() => setActive(i)}
              className="rounded-lg border px-3 py-2 transition-all cursor-pointer"
              style={{
                borderColor: i === active ? '#6366f1' : '#6366f130',
                background: i === active ? '#6366f118' : '#6366f108',
              }}>
              <p className="font-mono font-bold text-sm text-indigo-400">{s.label}</p>
            </motion.button>
          ))}
        </div>
        <motion.div key={active} initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-indigo-500/30 bg-indigo-500/8 p-3 text-sm text-foreground/80 text-center">
          <span className="font-mono text-indigo-400 font-semibold">w = {sel.value}</span>
          <span className="mx-2 text-foreground/30">|</span>
          {sel.desc}
        </motion.div>
        <div className="h-3 rounded-full bg-border/30 overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
            animate={{ width: `${(sel.value / 15) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200 }} />
        </div>
        <div className="flex justify-between text-[10px] text-foreground/40 font-mono">
          <span>다양성 높음</span><span>텍스트 충실도 높음</span>
        </div>
      </div>

      <div className="not-prose mt-4">
        <CFGDetailScene />
      </div>
    </>
  );
}
