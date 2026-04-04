import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';

const SOCKET_OPTS = [
  {
    name: 'TCP_NODELAY',
    why: 'Nagle 알고리즘 비활성화',
    detail: 'P2P 메시지는 작고 빈번하다. Nagle이 200ms 버퍼링하면 gossip 전파 지연이 누적된다.',
    decision: 'latency > throughput',
    color: '#10b981',
  },
  {
    name: 'SO_REUSEADDR',
    why: 'TIME_WAIT 소켓 재바인드',
    detail: '노드 재시작 시 이전 소켓이 TIME_WAIT 상태라도 같은 포트를 즉시 바인드할 수 있다.',
    decision: '빠른 재시작',
    color: '#f59e0b',
  },
  {
    name: 'SO_REUSEPORT',
    why: 'NAT 홀펀칭용 포트 공유',
    detail: '리스닝 포트와 같은 포트로 dial해야 NAT 매핑을 재사용할 수 있다. Unix 전용.',
    decision: 'NAT 우회',
    color: '#8b5cf6',
  },
  {
    name: 'set_nonblocking',
    why: '비동기 I/O',
    detail: 'tokio/async-std 런타임이 poll 기반으로 소켓을 구동한다. 블로킹이면 스레드가 점유된다.',
    decision: 'async 호환',
    color: '#06b6d4',
  },
];

export default function SocketCreation({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="socket-creation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">소켓 생성: create_socket()</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <code>create_socket()</code>은 TCP 연결의 첫 단계다.
          <strong>socket2</strong> 크레이트로 OS 소켓을 만들고, 4가지 옵션을 설정한다.<br />
          각 옵션에는 P2P 환경에서의 명확한 이유가 있다.
        </p>
      </div>

      {/* 소켓 옵션 카드 */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-4">소켓 옵션 — 왜 이 설정인가?</p>
        <div className="flex flex-col gap-2.5">
          {SOCKET_OPTS.map((opt, i) => (
            <motion.div key={opt.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-lg border p-3.5"
              style={{ borderColor: opt.color + '40', background: opt.color + '06' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold" style={{ color: opt.color }}>
                  {opt.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{ background: opt.color + '15', color: opt.color }}>
                  {opt.decision}
                </span>
              </div>
              <p className="text-xs text-foreground/70 mb-1">{opt.why}</p>
              <p className="text-[11px] text-foreground/50">{opt.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 Nagle을 끄는가?</h3>
        <p>
          Nagle 알고리즘은 작은 패킷을 모아서 보낸다. HTTP처럼 대량 전송에는 효율적이다.<br />
          하지만 P2P에서는 <strong>수십 바이트짜리 gossip 메시지</strong>가 핵심이다.
          200ms 지연이 합의 라운드에 누적되면 블록 전파가 느려진다.
        </p>
        <p>
          <code>SO_REUSEPORT</code>는 <strong>Unix 전용</strong>이고,
          <code>PortUse::Reuse</code>일 때만 활성화된다.<br />
          이 조건부 설정이 중요하다. 불필요한 포트 공유는 보안 위험이 있기 때문이다.
        </p>
      </div>

      {/* 코드 참조 */}
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('tcp-socket', codeRefs['tcp-socket'])} />
          <span className="text-[10px] text-muted-foreground self-center">
            create_socket() 구현
          </span>
        </div>
      )}
    </section>
  );
}
