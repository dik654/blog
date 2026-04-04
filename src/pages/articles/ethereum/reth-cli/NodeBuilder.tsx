import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BuilderDetailViz from './viz/BuilderDetailViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { STATES } from './NodeBuilderData';

export default function NodeBuilder({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="node-builder" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">NodeBuilder 패턴</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 typestate 패턴인가?</strong>{' '}
          일반 빌더 패턴은 잘못된 순서로 메서드를 호출해도 런타임에야 발견된다.
          <br />
          Reth는 각 빌드 단계를 별도 struct로 정의하여,
          순서 위반을 <strong>컴파일 타임에 차단</strong>한다.{' '}
          <CodeViewButton onClick={() => open('builder-node')} />
        </p>
        <p className="leading-7">
          <code>with_types()</code> 전에 <code>launch()</code>를 호출하면?
          컴파일 에러가 발생한다. <code>NodeBuilder</code> struct에는
          <code>launch()</code> 메서드가 존재하지 않기 때문이다.
          <br />
          오직 <code>NodeBuilderWithComponents</code>에서만 호출할 수 있다.{' '}
          <CodeViewButton onClick={() => open('builder-states')} />
        </p>
      </div>

      {/* Interactive typestate cards */}
      <h3 className="text-lg font-semibold mb-3">3단계 상태 전이</h3>
      <div className="not-prose space-y-2 mb-6">
        {STATES.map((s, i) => (
          <motion.div key={s.name}
            onClick={() => setStep(i)}
            className="rounded-lg border p-4 cursor-pointer transition-colors"
            style={{
              borderColor: i === step ? s.color : 'var(--color-border)',
              background: i === step ? `${s.color}08` : undefined,
            }}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${i === step ? 'text-white' : 'bg-muted text-muted-foreground'}`}
                style={{ background: i === step ? s.color : undefined }}>{i + 1}</span>
              <span className="font-mono font-bold text-sm">{s.name}</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">{s.generic}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="mt-2 ml-10 space-y-1 text-sm">
                    <p className="text-foreground/80">{s.desc}</p>
                    <p className="text-emerald-600 dark:text-emerald-400">{s.available}</p>
                    <CodeViewButton onClick={() => open(s.codeKey)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose">
        <BuilderDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
