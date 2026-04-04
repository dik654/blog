import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

const methods = [
  { fn: 'listen_protocol()', desc: '인바운드 서브스트림에 적용할 프로토콜을 광고한다. SubstreamProtocol을 반환.' },
  { fn: 'poll()', desc: 'ConnectionHandlerEvent를 반환. OutboundSubstreamRequest 또는 NotifyBehaviour.' },
  { fn: 'on_behaviour_event()', desc: 'Behaviour가 NotifyHandler로 보낸 메시지를 수신한다.' },
  { fn: 'on_connection_event()', desc: '서브스트림 협상 완료(FullyNegotiated) 또는 실패 이벤트를 처리.' },
];

const negotiationSteps = [
  'Handler가 poll()에서 OutboundSubstreamRequest 반환',
  'Swarm이 Muxer에서 새 서브스트림 할당',
  'multistream-select로 프로토콜 협상 (/ipfs/kad/1.0.0 등)',
  'FullyNegotiatedOutbound 이벤트가 on_connection_event()로 전달',
  'Handler가 협상된 스트림 위에서 프로토콜 I/O 시작',
];

export default function HandlerTrait({ title, onCodeRef }: {
  title?: string; onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="handler-trait" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'ConnectionHandler 트레이트'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>ConnectionHandler</strong>는 개별 연결(피어 1명)에 대한 프로토콜 핸들러다.<br />
          Behaviour가 연결 <em>전체</em>를 관리하면, Handler는 연결 <em>하나</em>를 관리한다.
        </p>

        <h3>핵심 메서드</h3>
      </div>

      <div className="space-y-2 mt-3">
        {methods.map((m, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border px-4 py-2.5">
            <span className="font-mono text-xs text-emerald-500 mt-0.5 shrink-0">{i + 1}</span>
            <div>
              <p className="font-mono text-sm font-semibold text-foreground/90">{m.fn}</p>
              <p className="text-xs text-foreground/60 mt-0.5">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3>서브스트림 협상 흐름</h3>
        <p>
          Handler가 새 아웃바운드 스트림을 요청하면, Swarm이 Muxer(멀티플렉서)를 통해 스트림을 할당하고
          multistream-select 프로토콜로 양측이 합의한다.
        </p>
      </div>

      <div className="space-y-1.5 mt-3">
        {negotiationSteps.map((step, i) => (
          <div key={i} className="flex items-start gap-2.5 text-sm">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-500/15 text-violet-500 text-[10px] font-bold shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span className="text-foreground/75">{step}</span>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3>유휴 연결 관리</h3>
        <p>
          <code>connection_keep_alive()</code>가 <code>false</code>를 반환하면 유휴 연결은 자동 종료된다.<br />
          Kademlia Handler는 쿼리 진행 중에만 <code>true</code>를 반환하고,
          쿼리가 끝나면 <code>false</code>로 전환해 리소스를 해제한다.
        </p>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-4">
          <CodeViewButton onClick={() => onCodeRef('connection-handler', codeRefs['connection-handler'])} />
          <CodeViewButton onClick={() => onCodeRef('swarm-event', codeRefs['swarm-event'])} />
        </div>
      )}
    </section>
  );
}
