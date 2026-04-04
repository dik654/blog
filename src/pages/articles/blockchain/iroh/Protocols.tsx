import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import CodePanel from '@/components/ui/code-panel';
import RouterViz from './viz/RouterViz';
import { codeRefs } from './codeRefs';
import { PROTOCOLS, HANDLER_CODE, ROUTER_CODE, ECHO_CODE } from './ProtocolsData';

export default function Protocols({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="protocols" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상위 프로토콜 시스템</h2>
      <div className="not-prose mb-8"><RouterViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          iroh는 <code>ProtocolHandler</code> 트레이트 하나로 모든 프로토콜을 동일하게 확장합니다.<br />
          단일 Endpoint에서 ALPN(Application-Layer Protocol Negotiation)으로
          여러 프로토콜을 동시에 서빙할 수 있습니다.
        </p>

        <h3>실제 소스 코드 탐색</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('protocol-handler', codeRefs['protocol-handler'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProtocolHandler trait</span>
          <CodeViewButton onClick={() => onCodeRef('router-accept-loop', codeRefs['router-accept-loop'])} />
          <span className="text-[10px] text-muted-foreground self-center">Router accept loop</span>
          <CodeViewButton onClick={() => onCodeRef('handle-connection', codeRefs['handle-connection'])} />
          <span className="text-[10px] text-muted-foreground self-center">handle_connection()</span>
        </div>

        <h3>ProtocolHandler 트레이트</h3>
        <CodePanel title="ProtocolHandler 인터페이스" code={HANDLER_CODE} annotations={[
          { lines: [3, 4], color: 'sky', note: '선택: 0-RTT 등 고급 기능' },
          { lines: [7, 8], color: 'emerald', note: '필수: 연결 처리' },
        ]} />

        <h3>Router — 멀티 프로토콜 서빙</h3>
        <CodePanel title="ALPN 기반 프로토콜 라우터" code={ROUTER_CODE} annotations={[
          { lines: [2, 5], color: 'sky', note: '프로토콜 등록' },
        ]} />

        <h3>내장 프로토콜</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 not-prose">
        {PROTOCOLS.map(p => (
          <div key={p.name} className="rounded-xl border p-4"
            style={{ borderColor: p.color + '40', background: p.color + '08' }}>
            <p className="font-mono text-sm font-bold" style={{ color: p.color }}>{p.name}</p>
            <p className="text-xs text-foreground/50 font-mono mt-0.5">{p.alpn}</p>
            <p className="text-sm mt-3 text-foreground/80 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3>커스텀 프로토콜 최소 구현</h3>
        <CodePanel title="Echo 프로토콜 예제" code={ECHO_CODE} annotations={[
          { lines: [4, 11], color: 'sky', note: 'accept 핸들러 구현' },
          { lines: [15, 17], color: 'emerald', note: 'Router에 등록' },
        ]} />
        <p>
          이처럼 iroh 위에서 프로토콜을 만드는 것은 매우 단순합니다.<br />
          NAT 통과, 암호화, 연결 관리는 모두 iroh가 처리하며,
          개발자는 애플리케이션 로직에만 집중할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
