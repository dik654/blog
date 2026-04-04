import { useState } from 'react';
import { motion } from 'framer-motion';
import { steps } from './blockLifecycleData';

export default function BlockLifecycle({ title }: { title?: string }) {
  const [active, setActive] = useState(0);

  return (
    <section id="block-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '블록 생명주기'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          하나의 블록이 제안되어 확정되기까지의 전체 흐름입니다.<br />
          각 단계를 클릭하면 상세 설명을 볼 수 있습니다.
        </p>
      </div>

      <div className="not-prose flex flex-col gap-1">
        {steps.map((step, i) => (
          <motion.button
            key={step.phase}
            onClick={() => setActive(i)}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            viewport={{ once: true }}
            className={`w-full text-left rounded-lg px-4 py-3 cursor-pointer transition-all border-l-4 ${
              active === i
                ? 'border-l-primary bg-accent/60 shadow-sm'
                : 'border-l-transparent hover:bg-accent/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                step.actor.includes('CL') && step.actor.includes('EL')
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  : step.actor.includes('EL')
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
              }`}>
                {step.actor}
              </span>
              <span className="text-sm font-semibold">{step.phase}</span>
            </div>
            {active === i && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-foreground/75 mt-2 ml-[72px]"
              >
                {step.detail}
              </motion.p>
            )}
          </motion.button>
        ))}
      </div>
    </section>
  );
}
