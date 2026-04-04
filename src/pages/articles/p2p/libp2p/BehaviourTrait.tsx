import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

const callbacks = [
  { fn: 'handle_pending_inbound_connection', desc: '인바운드 연결 수락 전 거부 가능' },
  { fn: 'handle_established_inbound_connection', desc: 'ConnectionHandler 인스턴스 반환 필수' },
  { fn: 'handle_pending_outbound_connection', desc: '추가 주소를 Vec로 반환 가능' },
  { fn: 'handle_established_outbound_connection', desc: 'ConnectionHandler 인스턴스 반환 필수' },
];

const toSwarmVariants = [
  { name: 'GenerateEvent', desc: '외부에 이벤트 전달' },
  { name: 'Dial', desc: '새 연결 시도' },
  { name: 'NotifyHandler', desc: '특정 Handler에 메시지 전송' },
  { name: 'CloseConnection', desc: '연결 종료 요청' },
];

export default function BehaviourTrait({ title, onCodeRef }: {
  title?: string; onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="behaviour-trait" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'NetworkBehaviour 트레이트'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>NetworkBehaviour</strong>는 프로토콜 로직을 캡슐화하는 트레이트다.<br />
          Kademlia, GossipSub, Identify 등 모든 프로토콜이 이 트레이트를 구현한다.
        </p>

        <h3>연결 생명주기 콜백 4개</h3>
      </div>

      <div className="space-y-2 mt-3">
        {callbacks.map((c, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border px-4 py-2.5">
            <span className="font-mono text-xs text-sky-500 mt-0.5 shrink-0">{i + 1}</span>
            <div>
              <p className="font-mono text-sm font-semibold text-foreground/90">{c.fn}</p>
              <p className="text-xs text-foreground/60 mt-0.5">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3>이벤트 흐름</h3>
        <p>
          <strong>Swarm → Behaviour</strong> 방향은 <code>FromSwarm</code> 열거형이 전달한다.<br />
          연결 수립, 종료, 주소 변경 등의 이벤트가 포함된다.<br />
          <strong>Handler → Behaviour</strong> 방향은 <code>on_connection_handler_event()</code>를 호출한다.
        </p>

        <h3>Behaviour → Swarm 커맨드 (ToSwarm)</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        {toSwarmVariants.map(v => (
          <div key={v.name} className="rounded-lg border px-3 py-2 text-center">
            <p className="font-mono text-xs font-bold text-amber-500">{v.name}</p>
            <p className="text-[11px] text-foreground/50 mt-1">{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3>왜 ConnectionHandler를 Behaviour가 생성하나?</h3>
        <p>
          프로토콜마다 서브스트림 협상(negotiation)이 다르기 때문이다.<br />
          Kademlia는 <code>/ipfs/kad/1.0.0</code>, GossipSub은 <code>/meshsub/1.1.0</code>을 사용한다.<br />
          Handler 생성 시점에 프로토콜 정보를 주입해야 올바른 협상이 가능하다.
        </p>
        <p>
          <code>#[derive(NetworkBehaviour)]</code> 매크로를 사용하면 여러 Behaviour를 하나의 struct로 합성할 수 있다.<br />
          Swarm은 합성된 단일 Behaviour만 폴링하면 된다.
        </p>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-4">
          <CodeViewButton onClick={() => onCodeRef('network-behaviour', codeRefs['network-behaviour'])} />
          <CodeViewButton onClick={() => onCodeRef('to-swarm', codeRefs['to-swarm'])} />
          <CodeViewButton onClick={() => onCodeRef('from-swarm', codeRefs['from-swarm'])} />
        </div>
      )}
    </section>
  );
}
