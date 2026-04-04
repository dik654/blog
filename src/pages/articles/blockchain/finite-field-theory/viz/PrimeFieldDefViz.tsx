import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import Math from '@/components/ui/math';

const STEPS = [
  { label: '소수체 표기 — Fp = Z/pZ', body: 'Fp와 Z/pZ는 같은 것을 다르게 표기한 것이다.' },
  { label: '예시 — F₇ = {0~6}', body: 'F₇ = {0,1,2,3,4,5,6}. 7 이상은 mod 7로 되돌아온다.' },
  { label: '소수 → 역원 존재 → 체', body: 'p가 소수이면 0 외 모든 원소에 곱셈 역원이 존재한다.' },
];

export default function PrimeFieldDefViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full max-w-2xl mx-auto space-y-4 py-4">
          {step === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-5 py-2.5">
                  <Math>{'\\mathbb{F}_p'}</Math>
                </div>
                <span className="text-muted-foreground text-lg">=</span>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5">
                  <Math>{'\\mathbb{Z}/p\\mathbb{Z}'}</Math>
                </div>
              </div>
              <div className="flex justify-center gap-16 text-xs font-medium">
                <span className="text-indigo-400">소수체</span>
                <span className="text-emerald-400">정수를 p로 나눈 나머지</span>
              </div>
              <div className="text-center text-xs text-muted-foreground border border-border/50 rounded-md py-1.5 mx-12">
                같은 것을 다르게 표기한 것
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-center gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6].map(v => (
                  <motion.div key={v} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: v * 0.05 }}
                    className="w-9 h-8 rounded-md border border-indigo-500/40 bg-indigo-500/10
                      flex items-center justify-center text-sm font-medium text-indigo-400">
                    {v}
                  </motion.div>
                ))}
                <span className="text-xs text-muted-foreground ml-2">← mod 7</span>
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex justify-center gap-2">
                {['8 \\bmod 7 = 1', '15 \\bmod 7 = 1', '20 \\bmod 7 = 6'].map((eq, i) => (
                  <div key={i} className="rounded-md border border-emerald-500/20 bg-emerald-500/5
                    px-3 py-1 text-xs">
                    <Math>{eq}</Math>
                  </div>
                ))}
              </motion.div>
              <p className="text-center text-xs text-muted-foreground">
                어떤 연산을 해도 결과는 항상 {'{'}0~6{'}'} 안
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="text-center text-sm font-medium text-emerald-400">
                곱셈 역원 (곱해서 1이 되는 쌍)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  '1 \\times 1 = 1',
                  '2 \\times 4 \\equiv 1',
                  '3 \\times 5 \\equiv 1',
                  '6 \\times 6 \\equiv 1',
                ].map((eq, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.15 }}
                    className="rounded-md border border-emerald-500/30 bg-emerald-500/10
                      px-2 py-1.5 text-center text-xs">
                    <Math>{eq}</Math>
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center space-y-1">
                <p className="text-sm font-medium text-amber-400">
                  0은 제외 — 0 × ? = 1 불가능
                </p>
                <p className="text-xs text-muted-foreground">
                  체의 정의: "0이 아닌 모든 원소"에만 역원 요구
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      )}
    </StepViz>
  );
}
