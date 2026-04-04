import { motion } from 'framer-motion';

const layers = [
  { label: 'secp256k1 / bn254', desc: '특정 곡선 구현 (ECDSA, Pairing)', bg: 'bg-rose-50 dark:bg-rose-950/20', border: 'border-rose-200 dark:border-rose-800' },
  { label: 'ecc (EccChip)', desc: '점 덧셈, 배가, 스칼라 곱셈, MSM', bg: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-purple-200 dark:border-purple-800' },
  { label: 'fields (FpChip)', desc: '소수체 연산 (mul, add, carry_mod)', bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-800' },
  { label: 'bigint (CRTInteger)', desc: 'limb 기반 큰 정수 (88비트 x 3)', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-800' },
];

export default function EccModuleViz() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm font-semibold mb-4 text-foreground/80">halo2-ecc 모듈 계층</p>
      <div className="flex flex-col gap-1.5 max-w-2xl mx-auto">
        {layers.map((l, i) => (
          <motion.div key={l.label}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-lg border p-3 ${l.bg} ${l.border}`}>
            <p className="text-xs font-medium">{l.label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{l.desc}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 justify-center text-[10px] text-muted-foreground">
        <span>RangeChip (halo2-base)</span>
        <span>num-bigint, rayon</span>
      </div>
    </div>
  );
}
