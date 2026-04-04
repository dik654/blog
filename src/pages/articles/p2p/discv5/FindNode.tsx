import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function FindNode({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="findnode" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FINDNODE: 거리 기반 노드 탐색</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          discv4는 대상 공개키를 보내고 가장 가까운 노드를 요청했다.
          discv5는 <strong>log-distance 배열</strong>을 보낸다. 공격자가 라우팅 테이블을 역추적하기 어렵다.
        </p>

        <h3>메시지 구조</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {[
            { name: 'FINDNODE', fields: 'ReqID, Distances []uint', desc: '요청할 log-distance 목록. 0은 자기 자신의 ENR 요청.' },
            { name: 'NODES', fields: 'ReqID, RespCount, Nodes', desc: 'RespCount로 전체 응답 개수를 알려주고 분할 전송.' },
          ].map(m => (
            <div key={m.name} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="font-mono font-bold text-sm text-emerald-400">{m.name}</p>
              <p className="text-xs text-foreground/60 mt-0.5 font-mono">{m.fields}</p>
              <p className="text-sm mt-2">{m.desc}</p>
            </div>
          ))}
        </div>

        <h3>lookupDistances: 인접 거리 계산</h3>
        <p>
          lookup 시 대상 노드에 대해 인접한 거리 3개를 계산한다.<br />
          예: <code>logdist(target, dest) = 255</code>이면 <code>[255, 256, 254]</code>를 요청한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('lookup-distances', codeRefs['lookup-distances'])} />
          <span className="text-[10px] text-muted-foreground self-center">lookupDistances() — 인접 거리 생성</span>
        </div>

        <h3>응답 수집: waitForNodes</h3>
        <p>
          NODES 응답은 패킷 크기(1280B) 제한으로 분할 전송된다.<br />
          첫 응답의 <code>RespCount</code>로 총 패킷 수를 파악하고, 모두 도착하면 반환한다.
          <code>totalNodesResponseLimit = 5</code>로 최대 분할 수를 제한한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('wait-for-nodes', codeRefs['wait-for-nodes'])} />
          <span className="text-[10px] text-muted-foreground self-center">waitForNodes() — 분할 응답 수집</span>
        </div>
      </div>
    </section>
  );
}
