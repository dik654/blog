import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';

const DIAL_STEPS = [
  { step: 1, label: 'Multiaddr 파싱', desc: '/ip4/1.2.3.4/tcp/9000 → SocketAddr', color: '#64748b' },
  { step: 2, label: '소켓 생성', desc: 'create_socket() — 옵션 설정 완료', color: '#10b981' },
  { step: 3, label: '포트 재사용 판단', desc: 'port_reuse.local_dial_addr() + PortUse::Reuse', color: '#f59e0b' },
  { step: 4, label: '비동기 connect', desc: 'EINPROGRESS는 정상 — 논블로킹 connect의 in-progress 응답', color: '#8b5cf6' },
  { step: 5, label: '폴백', desc: '바인드 실패 시 PortUse::New로 새 소켓 생성 후 재시도', color: '#ef4444' },
];

const LISTEN_EVENTS = [
  { event: 'NewAddress', desc: 'OS가 할당한 실제 주소를 Swarm에 보고', color: '#10b981' },
  { event: 'Incoming', desc: '새 인바운드 연결 → upgrade Future 전달', color: '#06b6d4' },
  { event: 'AddressExpired', desc: '인터페이스 변경 시 주소 만료 보고', color: '#f59e0b' },
  { event: 'ListenerError', desc: '비치명적 에러 — 리스닝 계속됨', color: '#ef4444' },
];

export default function DialListen({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="dial-listen" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">dial() & listen_on()</h2>

      {/* dial 흐름 */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-4">dial() — 아웃바운드 연결 흐름</p>
        <div className="flex flex-col gap-1.5">
          {DIAL_STEPS.map((s, i) => (
            <motion.div key={s.step}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
              style={{ borderColor: s.color + '40', background: s.color + '08' }}>
              <span className="text-[10px] font-mono font-bold rounded-full w-5 h-5
                flex items-center justify-center shrink-0"
                style={{ background: s.color + '20', color: s.color }}>{s.step}</span>
              <span className="text-xs font-mono font-bold shrink-0 w-28"
                style={{ color: s.color }}>{s.label}</span>
              <span className="text-xs text-foreground/60">{s.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">왜 EINPROGRESS를 무시하는가?</h3>
        <p>
          논블로킹 소켓에서 <code>connect()</code>는 즉시 완료되지 않는다.<br />
          OS가 <strong>EINPROGRESS</strong>를 반환하면 "SYN을 보냈고 응답을 기다리는 중"이라는 뜻이다.<br />
          이걸 에러로 처리하면 모든 비동기 connect가 실패한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">포트 재사용과 NAT 홀펀칭</h3>
        <p>
          리스닝 중인 포트로 아웃바운드 연결을 보내면 NAT 매핑을 공유할 수 있다.
          <code>port_reuse.local_dial_addr()</code>가 리스닝 주소를 반환하고,
          <code>PortUse::Reuse</code>일 때만 바인드를 시도한다.<br />
          실패하면 새 포트로 폴백한다. 이 <strong>시도 → 폴백</strong> 패턴이 핵심이다.
        </p>
      </div>

      {/* listen_on 이벤트 */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-mono text-foreground/50 mb-4">
          listen_on() — ListenStream이 폴링하는 이벤트
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LISTEN_EVENTS.map((e, i) => (
            <motion.div key={e.event}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="rounded-lg border p-3"
              style={{ borderColor: e.color + '40', background: e.color + '06' }}>
              <span className="text-xs font-mono font-bold block mb-1"
                style={{ color: e.color }}>{e.event}</span>
              <span className="text-[11px] text-foreground/60">{e.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p>
          <strong>IfWatcher</strong>는 네트워크 인터페이스 변경을 감지한다.<br />
          WiFi 전환, VPN 연결 등으로 IP가 바뀌면 AddressExpired → NewAddress를 발행한다.<br />
          Swarm은 이 이벤트로 AutoNAT, Identify 등에 주소 변경을 전파한다.
        </p>
      </div>

      {/* 코드 참조 */}
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('tcp-transport', codeRefs['tcp-transport'])} />
          <span className="text-[10px] text-muted-foreground self-center">dial() & listen_on()</span>
          <CodeViewButton onClick={() => onCodeRef('transport-event', codeRefs['transport-event'])} />
          <span className="text-[10px] text-muted-foreground self-center">TransportEvent</span>
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Async TCP Operations</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Async TCP Connect/Listen
//
// Non-blocking connect() 흐름:
//
//   socket = socket(AF_INET, SOCK_STREAM | O_NONBLOCK)
//   result = connect(socket, addr)
//
//   if result == 0:
//     "즉시 성공" (same host)
//
//   elif errno == EINPROGRESS:
//     "처리 중" (정상)
//     epoll_wait(socket, EPOLLOUT)
//     getsockopt(SO_ERROR) 로 결과 확인
//
//   else:
//     진짜 error (connection refused 등)

// Tokio의 TcpSocket::connect:
//
//   pub async fn connect(self, addr: SocketAddr)
//       -> io::Result<TcpStream>
//   {
//       let socket = self.inner.connect(addr).await?;
//       Ok(TcpStream::from_std(socket)?)
//   }
//
//   내부:
//     - socket2로 connect 시작
//     - EINPROGRESS → poll 등록
//     - writable 이벤트 대기
//     - SO_ERROR 체크

// Listen socket 흐름:
//
//   socket()
//   setsockopt(SO_REUSEADDR, SO_REUSEPORT)
//   bind(addr)
//   listen(backlog)
//   accept() loop (non-blocking)

// IfWatcher (네트워크 인터페이스 감시):
//
//   Operating system API:
//     Linux: netlink (NETLINK_ROUTE)
//     macOS: kqueue (PF_ROUTE)
//     Windows: WNetGetConnection
//
//   감지 이벤트:
//     - Interface up/down
//     - IP address change
//     - Default gateway change
//
//   libp2p 활용:
//     - WiFi ↔ Mobile 전환
//     - VPN 연결/해제
//     - Dual-stack (IPv4/IPv6)
//     - 자동 주소 업데이트

// Connection lifecycle:
//
//   1. dial_socket() → TcpStream
//   2. security upgrade → NoiseStream
//   3. muxer upgrade → YamuxMuxer
//   4. ConnectionPool 등록
//   5. Behaviours 알림
//   6. Streams 생성/사용
//   7. Close (FIN or RST)
//   8. Pool에서 제거`}
        </pre>
      </div>
    </section>
  );
}
