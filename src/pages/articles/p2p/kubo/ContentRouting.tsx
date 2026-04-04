import CodePanel from '@/components/ui/code-panel';
import RoutingFlowViz from './viz/RoutingFlowViz';
import { ROUTING_CODE, ROUTING_ANNOTATIONS, ROUTER_TABLE } from './ContentRoutingData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ContentRouting({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="content-routing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Content Routing</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Content Routing은 <strong>CID로부터 해당 블록을 보유한 피어를 찾는</strong> 과정입니다.<br />
          Kubo는 여러 라우터를 병렬로 실행하는 <code>ComposableParallel</code> 구조를 사용합니다.
        </p>
        <h3>라우터 우선순위</h3>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">라우터 타입</th>
                <th className="text-left p-2">우선순위</th>
                <th className="text-left p-2">특징</th>
              </tr>
            </thead>
            <tbody>
              {ROUTER_TABLE.map((r) => (
                <tr key={r.type} className="border-b border-muted">
                  <td className="p-2 font-mono text-xs">{r.type}</td>
                  <td className="p-2">{r.priority}</td>
                  <td className="p-2">{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3>DHT 기반 콘텐츠 발견</h3>
        <p>
          Kademlia DHT의 <code>FIND_PROVIDERS</code> RPC로
          CID 해시와 가장 가까운 노드들을 탐색합니다.<br />
          블록 보유 노드는 주기적으로 <code>ADD_PROVIDER</code>로 자신을 DHT에 등록합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('kubo-composer', codeRefs['kubo-composer'])} />
            <span className="text-[10px] text-muted-foreground self-center">Composer 라우터</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-dht-routing', codeRefs['kubo-dht-routing'])} />
            <span className="text-[10px] text-muted-foreground self-center">DHT 라우팅</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-http-routing', codeRefs['kubo-http-routing'])} />
            <span className="text-[10px] text-muted-foreground self-center">HTTP 위임 라우팅</span>
          </div>
        )}
        <CodePanel title="병렬 라우터 조합" code={ROUTING_CODE} annotations={ROUTING_ANNOTATIONS} />
      </div>
      <div className="mt-8"><RoutingFlowViz /></div>
    </section>
  );
}
