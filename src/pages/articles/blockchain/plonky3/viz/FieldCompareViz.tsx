import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FIELDS = [
  { name: 'BabyBear', p: 'p = 2^31 - 2^27 + 1', bits: '31-bit', fft: '2-adic FFT (2^27)', color: '#10b981',
    pros: 'FFT 도메인 최대 2^27. Montgomery 곱셈 최적화.', cons: '필드 크기가 작아 확장체 필요.' },
  { name: 'Mersenne31', p: 'p = 2^31 - 1', bits: '31-bit', fft: 'Circle FFT', color: '#6366f1',
    pros: '비트 마스크로 빠른 리덕션. 특수 기하 구조 활용.', cons: '2-adic 부분군 없음. Circle FFT 구현 복잡.' },
  { name: 'Goldilocks', p: 'p = 2^64 - 2^32 + 1', bits: '64-bit', fft: '2-adic FFT (2^32)', color: '#f59e0b',
    pros: '64비트 네이티브 연산. 큰 FFT 도메인.', cons: '32비트 필드 대비 연산 비용 높음.' },
];

export default function FieldCompareViz() {
  const [active, setActive] = useState<number | null>(null);
  const sel = active !== null ? FIELDS[active] : null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-mono text-foreground/50">Plonky3 필드 비교</p>
      <div className="flex gap-2 flex-wrap">
        {FIELDS.map((f, i) => (
          <motion.button key={f.name} whileHover={{ scale: 1.04 }}
            onClick={() => setActive(active === i ? null : i)}
            className="rounded-lg border px-3 py-2 text-xs font-mono font-bold"
            style={{ borderColor: active===i?f.color:f.color+'30',
              background: active===i?f.color+'18':f.color+'06', color: f.color }}>
            {f.name}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.name} initial={{ opacity:0,y:4 }} animate={{ opacity:1,y:0 }}
            exit={{ opacity:0,y:-4 }} className="rounded-lg border p-3 space-y-1"
            style={{ borderColor: sel.color+'30', background: sel.color+'08' }}>
            <p className="font-mono text-xs" style={{ color: sel.color }}>{sel.p} ({sel.bits})</p>
            <p className="text-xs text-foreground/70">FFT: {sel.fft}</p>
            <p className="text-xs text-foreground/70">장점: {sel.pros}</p>
            <p className="text-xs text-foreground/50">단점: {sel.cons}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
