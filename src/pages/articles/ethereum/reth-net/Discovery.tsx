import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { LOOKUP_STEPS, DISC_MESSAGES } from './DiscoveryData';

export default function Discovery({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const sel = LOOKUP_STEPS.find(s => s.step === activeStep);

  return (
    <section id="discovery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Discovery v4 (Kademlia)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('net-discovery', codeRefs['net-discovery'])} />
          <span className="text-[10px] text-muted-foreground self-center">Discv4 구조체</span>
        </div>
        <p>
          <strong>Discv4</strong>는 UDP 기반 노드 디스커버리 프로토콜이다.<br />
          Kademlia DHT(분산 해시 테이블)의 변형으로, 256개 k-bucket에 피어를 XOR 거리 기준으로 분류한다.
        </p>
        <p>
          XOR 거리란 두 노드 ID의 비트별 XOR 연산 결과다.<br />
          같은 접두사(prefix)를 공유하는 노드일수록 거리가 가까우며, bucket 번호가 낮다.<br />
          이 구조 덕분에 O(log N) 홉으로 네트워크의 아무 노드나 탐색할 수 있다.
        </p>
      </div>

      {/* lookup() algorithm steps */}
      <h3 className="text-lg font-semibold mb-3">lookup() 알고리즘</h3>
      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {LOOKUP_STEPS.map(s => (
          <button key={s.step}
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
          <motion.div key={sel.step}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>Step {sel.step}: {sel.title}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discovery messages */}
      <h3 className="text-lg font-semibold mb-3">UDP 메시지 타입</h3>
      <div className="not-prose overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-border">
          <thead><tr className="bg-muted">
            <th className="border border-border px-4 py-2 text-left">메시지</th>
            <th className="border border-border px-4 py-2 text-left">방향</th>
            <th className="border border-border px-4 py-2 text-left">용도</th>
          </tr></thead>
          <tbody>
            {DISC_MESSAGES.map(m => (
              <tr key={m.name}>
                <td className="border border-border px-4 py-2 font-mono text-xs">{m.name}</td>
                <td className="border border-border px-4 py-2">{m.direction}</td>
                <td className="border border-border px-4 py-2">{m.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>refresh_buckets()</strong> — 주기적으로 랜덤 target에 대해 lookup을 실행한다.<br />
          이를 통해 Kademlia 버킷이 골고루 채워져 네트워크 연결성을 유지한다.<br />
          부트노드(bootnode)는 초기 접속점으로만 사용되며, lookup 이후에는 일반 피어와 동일하게 취급.
        </p>
      </div>
    </section>
  );
}
