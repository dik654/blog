import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';

const COMPARE = [
  { proto: 'QUIC', security: 'TLS 1.3 내장', mux: '스트림 다중화 내장', steps: 1, color: '#06b6d4' },
  { proto: 'TCP', security: 'Noise XX 별도', mux: 'Yamux 별도', steps: 3, color: '#ef4444' },
];

const LAYERS = [
  { label: 'TCP raw bytes', desc: 'OS 소켓, 평문 바이트 스트림', color: '#64748b' },
  { label: '+ Noise XX', desc: '암호화 + PeerId 인증', color: '#8b5cf6' },
  { label: '+ Yamux', desc: '하나의 TCP 위에 여러 스트림 다중화', color: '#10b981' },
  { label: '= (PeerId, StreamMuxerBox)', desc: 'Swarm이 사용하는 최종 Output', color: '#f59e0b' },
];

export default function Overview({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TCP Transport 개요</h2>

      {/* TCP 업그레이드 스택 시각화 */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-4">
          TCP 업그레이드 스택 — 3단계를 거쳐야 Swarm에 진입
        </p>
        <div className="flex flex-col gap-1.5">
          {LAYERS.map((l, i) => (
            <motion.div key={l.label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
              style={{ borderColor: l.color + '40', background: l.color + '08' }}>
              <span className="text-xs font-mono font-bold shrink-0 w-48"
                style={{ color: l.color }}>{l.label}</span>
              <span className="text-xs text-foreground/60">{l.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          libp2p에서 TCP는 가장 기본적인 전송 계층이다.<br />
          하지만 TCP 자체는 <strong>평문 바이트 스트림</strong>만 제공한다.<br />
          P2P 통신에 필요한 암호화와 스트림 다중화가 없다.
        </p>
        <p>
          그래서 TCP Transport의 핵심 과제는 <strong>업그레이드 체인</strong>이다.
          raw TCP 위에 Noise(암호화) + Yamux(멀티플렉싱)을 순서대로 얹어야
          Swarm이 쓸 수 있는 <code>(PeerId, StreamMuxerBox)</code>가 된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 QUIC 대신 TCP를 분석하는가?</h3>
        <p>
          QUIC는 보안+다중화가 내장이라 Transport 하나로 끝난다.<br />
          TCP는 각 계층이 <strong>분리</strong>되어 있어 libp2p의 모듈 설계가 드러난다.<br />
          업그레이드 패턴을 이해하면 커스텀 Transport 작성도 가능하다.
        </p>
      </div>

      {/* TCP vs QUIC 비교 카드 */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-mono text-foreground/50 mb-3">TCP vs QUIC — 업그레이드 비용</p>
        <div className="flex flex-col gap-2">
          {COMPARE.map((c, i) => (
            <motion.div key={c.proto}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
              style={{ borderColor: c.color + '40', background: c.color + '08' }}>
              <span className="text-xs font-mono font-bold w-12"
                style={{ color: c.color }}>{c.proto}</span>
              <span className="text-xs text-foreground/60 flex-1">
                보안: {c.security} / 다중화: {c.mux}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                style={{ background: c.color + '15', color: c.color }}>
                {c.steps === 1 ? '1단계' : `${c.steps}단계`}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 소스 코드 참조 */}
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('transport-trait', codeRefs['transport-trait'])} />
          <span className="text-[10px] text-muted-foreground self-center">Transport 트레이트</span>
          <CodeViewButton onClick={() => onCodeRef('tcp-transport', codeRefs['tcp-transport'])} />
          <span className="text-[10px] text-muted-foreground self-center">TCP Transport 구현</span>
        </div>
      )}
    </section>
  );
}
