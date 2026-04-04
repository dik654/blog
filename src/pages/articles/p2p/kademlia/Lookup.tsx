import CodePanel from '@/components/ui/code-panel';
import KadLookupViz from './viz/KadLookupViz';
import KadIterativeLookupViz from './viz/KadIterativeLookupViz';
import { findNodeCode, findValueCode, rpcMessages } from './LookupData';

export default function Lookup({ title }: { title?: string }) {
  return (
    <section id="lookup" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '노드 조회 & 값 저장/조회'}</h2>
      <div className="not-prose mb-8"><KadLookupViz /></div>
      <div className="not-prose mb-8"><KadIterativeLookupViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Kademlia의 핵심 동작은 <strong>반복적 노드 조회(iterative FIND_NODE)</strong>입니다.<br />
          목표 ID에 가장 가까운 노드를 찾을 때까지 반복적으로 가까운 노드들에게 질의합니다.
        </p>

        <h3>FIND_NODE (반복적 조회)</h3>
        <CodePanel title="FIND_NODE 반복적 조회" code={findNodeCode} annotations={[
          { lines: [1, 3], color: 'sky', note: 'alpha=3 동시 질의, K=20 반환' },
          { lines: [20, 21], color: 'emerald', note: 'alpha개 동시 RPC 전송' },
          { lines: [40, 43], color: 'amber', note: '수렴 체크 — 더 가까운 노드 없으면 종료' },
        ]} />

        <h3>FIND_VALUE (값 조회)</h3>
        <p>
          FIND_VALUE는 FIND_NODE와 동일하지만, 질의 노드가 해당 키를 알고 있으면
          즉시 값을 반환합니다.
        </p>
        <CodePanel title="FIND_VALUE & STORE" code={findValueCode} annotations={[
          { lines: [4, 8], color: 'sky', note: 'Value 응답 시 즉시 반환' },
          { lines: [13, 18], color: 'emerald', note: 'STORE — 가장 가까운 k개에 저장' },
        ]} />

        <h3>RPC 메시지 유형</h3>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          {rpcMessages.map(({ name, desc }) => (
            <div key={name} className="rounded-lg border border-border p-3">
              <p className="font-mono text-xs font-bold text-primary">{name}</p>
              <p className="text-xs text-foreground/70 mt-1">{desc}</p>
            </div>
          ))}
        </div>

        <h3>수렴 보장</h3>
        <p>
          각 반복에서 새 노드가 발견되거나, 더 가까운 노드가 없으면 종료됩니다.<br />
          네트워크가 연결되어 있다면 <code>O(log N)</code> 홉으로
          가장 가까운 노드를 반드시 찾습니다.
        </p>
      </div>
    </section>
  );
}
