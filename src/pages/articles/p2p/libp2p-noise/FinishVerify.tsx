import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';
import { CHECKS, PARAMS } from './FinishVerifyData';

export default function FinishVerify({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);

  return (
    <section id="finish-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">finish(): 검증과 전환</h2>

      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-4">finish() 내부 검증 흐름</p>
        <div className="flex flex-col gap-1.5">
          {CHECKS.map((c, i) => (
            <motion.button key={c.label}
              onClick={() => setActive(i)}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="w-full flex items-center gap-3 rounded-lg border px-4 py-2.5 text-left cursor-pointer"
              style={{
                borderColor: active === i ? c.color + '60' : c.color + '20',
                background: active === i ? c.color + '12' : 'transparent',
              }}>
              <span className="text-xs font-mono font-bold shrink-0"
                style={{ color: c.color }}>{c.label}</span>
              <span className="text-xs text-foreground/60 flex-1">{c.desc}</span>
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 rounded-lg border p-3 text-xs text-foreground/70"
            style={{ borderColor: CHECKS[active].color + '30', background: CHECKS[active].color + '08' }}>
            <strong style={{ color: CHECKS[active].color }}>{CHECKS[active].label}</strong>
            <p className="mt-1">{CHECKS[active].detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* PARAMS_XX 분해 */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-2">Noise 파라미터</p>
        <p className="font-mono text-sm font-bold text-foreground/80 mb-3">{PARAMS.value}</p>
        <div className="flex flex-wrap gap-2">
          {PARAMS.parts.map((p, i) => (
            <motion.div key={p.token}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="rounded-lg border px-3 py-1.5"
              style={{ borderColor: p.color + '40', background: p.color + '08' }}>
              <span className="text-xs font-mono font-bold" style={{ color: p.color }}>{p.token}</span>
              <span className="text-[10px] text-foreground/50 ml-2">{p.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>finish()</code>는 3라운드가 끝난 뒤 호출된다.<br />
          핵심은 <strong>서명 검증</strong>이다.<br />
          상대가 보낸 DH 공개키가 정말 해당 PeerId 소유인지 확인한다.
        </p>
        <p>
          검증에 통과하면 <code>HandshakeState</code>가 <code>TransportState</code>로 전환된다.<br />
          이후 모든 바이트는 <strong>ChaCha20-Poly1305</strong>로 암호화된다.<br />
          반환값은 <code>(PeerId, Output)</code> — Swarm이 바로 사용할 수 있는 형태다.
        </p>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('noise-handshake', codeRefs['noise-handshake'])} />
          <span className="text-[10px] text-muted-foreground self-center">finish() 구현</span>
          <CodeViewButton onClick={() => onCodeRef('noise-config', codeRefs['noise-config'])} />
          <span className="text-[10px] text-muted-foreground self-center">Noise Config</span>
        </div>
      )}
    </section>
  );
}
