import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';

const CHAIN_STEPS = [
  {
    step: 1,
    from: 'TcpStream',
    to: '(PeerId, Output<T>)',
    layer: 'Noise XX',
    desc: '3-way 핸드셰이크로 DH 키 교환. 상대 PeerId 인증 + 암호화 스트림 생성.',
    color: '#8b5cf6',
  },
  {
    step: 2,
    from: 'Output<T>',
    to: 'StreamMuxerBox',
    layer: 'Yamux',
    desc: '하나의 암호화된 TCP 위에 다수의 논리적 스트림 다중화. 최대 256개 인바운드 버퍼.',
    color: '#10b981',
  },
  {
    step: 3,
    from: '(PeerId, StreamMuxerBox)',
    to: 'Swarm 진입',
    layer: 'Transport::Output',
    desc: 'ConnectionPool에 등록. 이제 NetworkBehaviour가 서브스트림을 열 수 있다.',
    color: '#f59e0b',
  },
];

const BUILDER_CHAIN = [
  { method: '.with_tcp()', desc: 'TCP Transport 등록', color: '#64748b' },
  { method: '.with_noise()', desc: 'Security 업그레이드 등록', color: '#8b5cf6' },
  { method: '.with_behaviour()', desc: 'Yamux 자동 + Behaviour 생성', color: '#10b981' },
  { method: '.build()', desc: 'Swarm 인스턴스 반환', color: '#f59e0b' },
];

export default function UpgradeChain({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="upgrade-chain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">업그레이드 체인</h2>

      {/* 업그레이드 파이프라인 */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-4">
          TCP raw bytes → Swarm Output 까지 3단계
        </p>
        <div className="flex flex-col gap-3">
          {CHAIN_STEPS.map((s, i) => (
            <motion.div key={s.step}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              className="rounded-lg border p-4"
              style={{ borderColor: s.color + '40', background: s.color + '06' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold rounded-full w-5 h-5
                  flex items-center justify-center shrink-0"
                  style={{ background: s.color + '20', color: s.color }}>{s.step}</span>
                <span className="text-xs font-mono font-bold" style={{ color: s.color }}>
                  {s.layer}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-foreground/5
                  text-foreground/60">{s.from}</span>
                <span className="text-foreground/30">→</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-foreground/5
                  text-foreground/60">{s.to}</span>
              </div>
              <p className="text-[11px] text-foreground/60">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">왜 Security가 Mux보다 먼저인가?</h3>
        <p>
          암호화 전에 다중화를 하면 스트림 헤더가 <strong>평문</strong>으로 노출된다.<br />
          공격자가 어떤 프로토콜을 협상하는지 관찰할 수 있다.<br />
          Security 먼저 적용하면 Yamux 프레임 자체가 암호화된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">SwarmBuilder 체이닝 패턴</h3>
        <p>
          타입 상태 패턴(typestate pattern)으로 빌더 순서를 컴파일 타임에 강제한다.
          <code>.with_tcp()</code> 없이 <code>.with_noise()</code>를 호출하면 컴파일 에러.
          실수를 런타임이 아닌 컴파일 타임에 잡는 Rust의 전형적 설계다.
        </p>
      </div>

      {/* SwarmBuilder 체이닝 */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-mono text-foreground/50 mb-3">
          SwarmBuilder — 타입 상태로 순서 강제
        </p>
        <div className="flex flex-col gap-1.5">
          {BUILDER_CHAIN.map((b, i) => (
            <motion.div key={b.method}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2"
              style={{ borderColor: b.color + '40', background: b.color + '08' }}>
              <span className="text-xs font-mono font-bold shrink-0"
                style={{ color: b.color }}>{b.method}</span>
              <span className="text-xs text-foreground/60">{b.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 코드 참조 */}
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('noise-config', codeRefs['noise-config'])} />
          <span className="text-[10px] text-muted-foreground self-center">Noise XX 핸드셰이크</span>
          <CodeViewButton onClick={() => onCodeRef('yamux-muxer', codeRefs['yamux-muxer'])} />
          <span className="text-[10px] text-muted-foreground self-center">Yamux StreamMuxer</span>
          <CodeViewButton onClick={() => onCodeRef('noise-handshake', codeRefs['noise-handshake'])} />
          <span className="text-[10px] text-muted-foreground self-center">finish() 서명 검증</span>
        </div>
      )}
    </section>
  );
}
