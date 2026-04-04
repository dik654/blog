import { useState } from 'react';
import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';
import { ROUNDS } from './HandshakeFlowData';

export default function HandshakeFlow({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const [step, setStep] = useState(0);

  return (
    <section id="handshake-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">XX 3라운드 핸드셰이크</h2>

      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <div className="flex justify-between px-6 mb-3">
          <span className="text-xs font-mono font-bold text-indigo-400">Initiator</span>
          <span className="text-xs font-mono font-bold text-emerald-400">Responder</span>
        </div>
        <div className="space-y-2 px-2">
          {ROUNDS.map((r, i) => (
            <motion.button key={r.round}
              onClick={() => setStep(i)}
              className="w-full rounded-lg border px-4 py-3 text-left cursor-pointer"
              style={{
                borderColor: step === i ? r.color + '60' : r.color + '15',
                background: step === i ? r.color + '12' : 'transparent',
                opacity: i <= step ? 1 : 0.3,
              }}
              animate={{ x: i <= step ? 0 : (r.dir === 'right' ? -6 : 6) }}>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-foreground/40 w-3">{r.round}</span>
                <span className="font-mono text-xs font-bold shrink-0"
                  style={{ color: r.color }}>{r.token}</span>
                <span className="text-[10px] text-foreground/50 flex-1 truncate">{r.exchange}</span>
              </div>
              <div className="flex gap-4 mt-1.5 ml-6 text-[10px] font-mono text-foreground/40">
                <span>I: {r.initiator}</span>
                <span>R: {r.responder}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div key={step}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mt-3 rounded-lg border p-3 text-xs text-foreground/70"
          style={{ borderColor: ROUNDS[step].color + '30', background: ROUNDS[step].color + '08' }}>
          <strong style={{ color: ROUNDS[step].color }}>Round {ROUNDS[step].round}:</strong>{' '}
          {ROUNDS[step].detail}
          {step === 2 && (
            <span className="block mt-1.5 text-foreground/50">
              {'HKDF(ee || es || se) → ChaChaPoly 세션키 도출 완료'}
            </span>
          )}
        </motion.div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          XX 패턴의 3라운드는 <strong>대칭적</strong>이다.<br />
          Initiator와 Responder 모두 identity를 상대에게 공개한다.
        </p>
        <p>
          <strong>payload란?</strong> protobuf로 인코딩된 identity 정보다.<br />
          Ed25519 공개키 + DH 공개키에 대한 서명이 들어있다.<br />
          Round 2, 3의 payload는 이미 Noise 암호화된 상태라 도청 불가.
        </p>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('noise-config', codeRefs['noise-config'])} />
          <span className="text-[10px] text-muted-foreground self-center">핸드셰이크 구현</span>
        </div>
      )}
    </section>
  );
}
