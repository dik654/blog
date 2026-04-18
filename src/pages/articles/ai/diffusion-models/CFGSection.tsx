import { useState } from 'react';
import { motion } from 'framer-motion';
import CFGDetailViz from './viz/CFGDetailViz';

const SCALES = [
  { value: 1, label: 'w=1', desc: '조건 무시 — 무작위 생성' },
  { value: 3, label: 'w=3', desc: '약한 가이던스 — 다양하지만 부정확' },
  { value: 7.5, label: 'w=7.5', desc: '기본값 — 품질과 다양성 균형' },
  { value: 15, label: 'w=15', desc: '강한 가이던스 — 정확하지만 과포화' },
];

export default function CFGSection() {
  const [active, setActive] = useState(2);
  const sel = SCALES[active];

  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Classifier-Free Guidance (CFG)</h3>
      <p>
        CFG — 조건부/비조건부 예측을 혼합하여 텍스트 충실도를 제어<br />
        <strong>epsilon = epsilon_uncond + w * (epsilon_cond - epsilon_uncond)</strong><br />
        가중치 w가 클수록 텍스트에 충실하지만 다양성 감소
      </p>
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
        <CFGDetailViz />
      </div>
    </>
  );
}
