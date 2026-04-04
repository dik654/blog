import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import EclipseAttackViz from './viz/EclipseAttackViz';

export default function Eclipse({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="eclipse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Eclipse 공격과 버킷 다양성 방어</h2>

      <EclipseAttackViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>공격 시나리오</h3>
        <p>
          공격자가 대상 노드의 라우팅 테이블을 전부 자기 노드로 채운다.
          <br />
          대상 노드는 네트워크를 볼 때 공격자의 노드만 보인다 — 네트워크에서 "일식"당한 상태.
          <br />
          트랜잭션 전파를 차단하거나, 거짓 블록을 전달하거나, 이중지불 공격에 활용된다.
        </p>
        <p>
          공격 벡터: 대상 노드에 계속 새 노드를 주입하여 모든 k-버킷을 악성 노드로 채운다.
          <br />
          go-ethereum은 세 가지 구조적 방어를 통해 이를 막는다.
        </p>

        <h3>방어 1: 오래된 노드 우선 — 쫓아내기 어려움</h3>
        <p>
          Kademlia의 핵심 규칙: 버킷이 가득 차면 새 노드를 거부한다.
          <br />
          기존 노드가 살아 있는 한 새 노드가 밀어낼 수 없다.
          <br />
          공격자는 기존의 정상 노드를 자기 노드로 교체할 방법이 없다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('add-found-node', codeRefs['add-found-node'])} />
            <span className="text-[10px] text-muted-foreground self-center">table.go — addFoundNode()</span>
          </div>
        )}

        <h3>방어 2: 교체 목록(Replacement List)</h3>
        <p>
          버킷에 빈 자리가 없으면, 새 노드는 <code>replacements</code> 목록에 저장된다(최대 10개).
          <br />
          기존 노드가 재검증에 실패하여 삭제될 때만, 교체 목록에서 랜덤으로 하나를 승격시킨다.
          <br />
          공격자가 교체 목록을 채워도, 정상 노드가 죽지 않는 한 버킷에 진입할 수 없다.
        </p>

        <h3>방어 3: 재검증으로 가짜 노드 제거</h3>
        <p>
          공격자의 가짜 노드가 교체 목록이나 버킷에 진입하더라도, 재검증에서 PING에 응답하지 못하면 삭제된다.
          <br />
          fast list에서 빠르게 검증하므로, 응답하지 않는 가짜 노드는 수 초 내에 걸러진다.
          <br />
          세 방어가 겹쳐 작동하여, Eclipse 공격의 성공 확률을 극히 낮춘다.
        </p>
      </div>
    </section>
  );
}
