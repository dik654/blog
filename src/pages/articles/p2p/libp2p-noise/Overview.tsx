import { useState } from 'react';
import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';
import { COMPARE, REASONS } from './OverviewData';

export default function Overview({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Noise XX란?</h2>

      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-4">
          Noise XX가 P2P에 적합한 이유
        </p>
        <div className="flex flex-col gap-1.5">
          {REASONS.map((r, i) => (
            <motion.button key={r.label}
              onClick={() => setActive(i)}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5 text-left cursor-pointer"
              style={{
                borderColor: active === i ? r.color + '60' : r.color + '20',
                background: active === i ? r.color + '12' : 'transparent',
              }}>
              <span className="text-xs font-mono font-bold shrink-0"
                style={{ color: r.color }}>{r.label}</span>
              <span className="text-xs text-foreground/60">{r.desc}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Noise Framework는 TLS의 대안으로 설계된 암호화 핸드셰이크 프레임워크다.
          libp2p는 그중 <strong>XX 패턴</strong>을 채택했다.
        </p>
        <p>
          XX의 핵심: <strong>양쪽 모두 상대의 identity를 모르는 상태</strong>에서 시작한다.
          3번의 메시지 교환으로 상호 인증 + 암호화 채널을 수립한다.
        </p>
        <p>
          P2P 환경에서는 CA(인증기관)가 없다.<br />
          Noise XX는 공개키 자체가 신원이므로 CA 없이 동작한다.<br />
          Ed25519 공개키에서 PeerId를 도출하면 그것이 곧 노드의 주소다.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-mono text-foreground/50 mb-3">TLS vs Noise XX</p>
        <div className="flex flex-col gap-2">
          {COMPARE.map((c, i) => (
            <motion.div key={c.model}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
              style={{ borderColor: c.color + '40', background: c.color + '08' }}>
              <span className="text-xs font-mono font-bold w-24 shrink-0"
                style={{ color: c.color }}>{c.model}</span>
              <span className="text-xs text-foreground/60 flex-1">
                인증: {c.auth} / 적합: {c.fit}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('noise-config', codeRefs['noise-config'])} />
          <span className="text-[10px] text-muted-foreground self-center">Noise XX Config</span>
          <CodeViewButton onClick={() => onCodeRef('transport-trait', codeRefs['transport-trait'])} />
          <span className="text-[10px] text-muted-foreground self-center">Transport 트레이트</span>
        </div>
      )}
    </section>
  );
}
