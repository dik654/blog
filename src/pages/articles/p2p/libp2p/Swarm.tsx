import CodePanel from '@/components/ui/code-panel';
import SwarmEventViz from './viz/SwarmEventViz';
import { networkBehaviourCode, deriveCode, connectionHandlerCode, eventFlowSteps } from './SwarmData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Swarm({ title, onCodeRef }: {
  title?: string; onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="swarm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Swarm & NetworkBehaviour'}</h2>
      <div className="not-prose mb-8"><SwarmEventViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Swarm은 libp2p의 핵심 이벤트 루프입니다.<br />
          Transport에서 들어오는 연결 이벤트와 NetworkBehaviour가 요청하는 액션을 조율합니다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('swarm-poll', codeRefs['swarm-poll'])} />
            <CodeViewButton onClick={() => onCodeRef('network-behaviour', codeRefs['network-behaviour'])} />
            <CodeViewButton onClick={() => onCodeRef('to-swarm-enum', codeRefs['to-swarm-enum'])} />
          </div>
        )}

        <h3>NetworkBehaviour 트레이트</h3>
        <CodePanel title="NetworkBehaviour 트레이트" code={networkBehaviourCode} annotations={[
          { lines: [2, 3], color: 'sky', note: 'ConnectionHandler + 이벤트 타입 정의' },
          { lines: [6, 12], color: 'emerald', note: '인바운드 연결 처리' },
          { lines: [17, 21], color: 'amber', note: 'poll — 비동기 이벤트 생성' },
        ]} />

        <h3>여러 프로토콜 조합: derive(NetworkBehaviour)</h3>
        <CodePanel title="derive(NetworkBehaviour) 매크로" code={deriveCode} annotations={[
          { lines: [1, 6], color: 'sky', note: '여러 프로토콜을 하나의 struct로 결합' },
          { lines: [10, 16], color: 'emerald', note: '이벤트 패턴 매칭 처리' },
        ]} />

        <h3>ConnectionHandler</h3>
        <p>
          각 연결에는 프로토콜별 <code>ConnectionHandler</code>가 연결됩니다.<br />
          Swarm이 스트림 I/O를 담당하고 Handler는 프로토콜 상태를 관리합니다.
        </p>
        <CodePanel title="ConnectionHandler 트레이트" code={connectionHandlerCode} annotations={[
          { lines: [2, 5], color: 'sky', note: '핸들러 입출력 타입 정의' },
          { lines: [8, 8], color: 'emerald', note: 'inbound 프로토콜 목록 제공' },
          { lines: [11, 12], color: 'amber', note: 'poll — 스트림 I/O 처리' },
        ]} />

        <h3>이벤트 흐름 요약</h3>
        <div className="not-prose space-y-1.5 my-4">
          {eventFlowSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-xs font-mono text-foreground/40 mt-0.5 w-4">{i + 1}</span>
              <span className="text-foreground/80">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
