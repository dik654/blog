import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';
import { STEPS } from './KeypairSigningData';

export default function KeypairSigning({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const [step, setStep] = useState(0);

  return (
    <section id="keypair-signing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AuthenticKeypair: 키 생성과 서명</h2>

      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-4">
          into_authentic() 과정 — DH 공개키를 identity 키로 서명
        </p>
        <div className="flex flex-col gap-1.5">
          {STEPS.map((s, i) => (
            <motion.button key={s.label}
              onClick={() => setStep(i)}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="w-full flex items-center gap-3 rounded-lg border px-4 py-2.5 text-left cursor-pointer"
              style={{
                borderColor: step === i ? s.color + '60' : s.color + '20',
                background: step === i ? s.color + '12' : 'transparent',
                opacity: i <= step ? 1 : 0.35,
              }}>
              <span className="text-xs font-mono font-bold shrink-0"
                style={{ color: s.color }}>{s.label}</span>
              <span className="text-xs text-foreground/60 flex-1">{s.desc}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 rounded-lg border p-3 text-xs text-foreground/70"
            style={{
              borderColor: STEPS[step].color + '30',
              background: STEPS[step].color + '08',
            }}>
            <strong style={{ color: STEPS[step].color }}>{STEPS[step].label}</strong>
            <p className="mt-1">{STEPS[step].detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Noise 핸드셰이크에는 두 종류의 키가 등장한다.
          <strong>X25519</strong>(키 교환용)와 <strong>Ed25519</strong>(서명용)다.
        </p>
        <p>
          <strong>왜 두 키가 필요한가?</strong>{' '}
          X25519는 DH 연산에 최적화된 키라 서명이 불가능하다.<br />
          Ed25519 identity 키로 DH 공개키를 서명해야
          "이 DH 키의 주인이 누구인지" 증명할 수 있다.
        </p>
        <p>
          도메인 프리픽스 <code>"noise-libp2p-static-key:"</code>는
          같은 Ed25519 키를 다른 맥락에서 재사용해도
          서명이 충돌하지 않도록 하는 안전장치다.
        </p>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('noise-config', codeRefs['noise-config'])} />
          <span className="text-[10px] text-muted-foreground self-center">Noise Config 구현</span>
        </div>
      )}
    </section>
  );
}
