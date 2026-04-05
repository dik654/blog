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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">X25519 vs Ed25519</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// X25519 vs Ed25519
//
// 둘 다 Curve25519 기반이지만 용도 다름
//
// Curve25519:
//   y² = x³ + 486662x² + x  (Montgomery form)
//   prime: 2^255 - 19
//   order: 2^252 + 27742317...
//
// X25519 (ECDH):
//   Montgomery ladder 방식
//   DH 연산 최적화
//   32-byte public key
//
// Ed25519 (EdDSA):
//   Twisted Edwards form 변환
//   서명 알고리즘
//   64-byte signature

// 왜 분리되었나?
//   - 다른 point representation
//   - 다른 ops 최적화
//   - 같은 키 두 용도 사용 시 취약 가능성
//
//   Birational isomorphism은 가능:
//     X25519 key ↔ Ed25519 key
//   하지만 권장 안 됨

// libp2p에서 두 키 조합:
//
// Identity Key (Ed25519 or secp256k1):
//   - Peer 고유 식별
//   - PeerID = hash(public key)
//   - 서명 생성 전용
//   - 장기 사용
//
// Ephemeral DH Key (X25519):
//   - Session key agreement
//   - Noise handshake 전용
//   - 매 connection 갱신
//   - Forward secrecy 보장

// 서명 대상:
//   message = "noise-libp2p-static-key:" + DH_public
//   signature = Ed25519.sign(identity_key, message)
//
//   Domain separator "noise-libp2p-static-key:" 이유:
//     같은 Ed25519 키를 여러 맥락에서 사용 시
//     cross-protocol 공격 방지

// 검증 시:
//   DH_public 수신
//   signature 수신
//   identity_public 수신
//
//   Ed25519.verify(identity_public,
//                  "noise-libp2p-static-key:" + DH_public,
//                  signature)
//   → true면 정당 소유자

// 효과:
//   "이 X25519 public key의 주인은
//    이 Ed25519 identity의 소유자다"
//   → PeerID ↔ ephemeral key 연결`}
        </pre>
      </div>
    </section>
  );
}
