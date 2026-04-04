import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BuilderDetailViz from './viz/BuilderDetailViz';
import type { CodeRef } from '@/components/code/types';
import { BUILD_STEPS } from './BuilderApiData';

export default function BuilderApi({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const sel = BUILD_STEPS.find(s => s.step === activeStep);

  return (
    <section id="builder-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Builder API 연동</h2>
      <div className="not-prose mb-8"><BuilderDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('mev-builder', codeRefs['mev-builder'])} />
          <span className="text-[10px] text-muted-foreground self-center">MevPayloadBuilder</span>
          <CodeViewButton onClick={() => onCodeRef('mev-build', codeRefs['mev-build'])} />
          <span className="text-[10px] text-muted-foreground self-center">build_payload 비교 로직</span>
        </div>
        <p>
          <strong>MevPayloadBuilder</strong>는 로컬 빌더와 외부 빌더를 래핑하는 구조체다.
          inner(로컬 PayloadBuilder)와 relay_client(릴레이 통신 클라이언트) 두 필드를 가진다.
        </p>
        <p>
          핵심 설계 판단 — 로컬 블록을 먼저 완성한 뒤 외부 입찰과 비교한다.<br />
          이 "로컬 먼저" 패턴 덕분에, 외부 릴레이가 전부 다운되어도 노드는 정상적으로 블록을 제안할 수 있다.<br />
          네트워크 liveness를 절대 해치지 않는 안전한 설계다.
        </p>
      </div>

      {/* Build steps */}
      <h3 className="text-lg font-semibold mb-3">build_payload 흐름</h3>
      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {BUILD_STEPS.map(s => (
          <button key={s.id}
            onClick={() => setActiveStep(activeStep === s.step ? null : s.step)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeStep === s.step ? s.color : 'var(--color-border)',
              background: activeStep === s.step ? `${s.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: s.color }}>Step {s.step}</p>
            <p className="text-xs text-foreground/60 mt-1">{s.title}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>Step {sel.step}: {sel.title}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>타이밍 게임</strong> — 빌더는 슬롯 마감 직전까지 TX를 수집하여 MEV를 최대화하려 한다.<br />
          하지만 너무 늦으면 Proposer가 로컬 블록을 사용한다.<br />
          이 긴장 관계가 빌더 간 경쟁을 만들고, 결과적으로 Proposer에게 더 높은 수수료를 제공한다.
        </p>
      </div>
    </section>
  );
}
