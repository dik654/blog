import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import SybilAttackViz from './viz/SybilAttackViz';

export default function Sybil({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="sybil" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sybil 공격과 IP 쿼터 방어</h2>

      <SybilAttackViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>공격 시나리오</h3>
        <p>
          공격자가 한 대의 머신에서 수천 개의 가짜 노드 ID를 생성한다.
          <br />
          이 노드들을 대량으로 네트워크에 주입하면, 다른 노드의 라우팅 테이블을 오염시킬 수 있다.
          <br />
          핵심 문제: 노드 ID는 자유롭게 만들 수 있지만, 공인 IP 주소는 그렇지 않다.
        </p>

        <h3>go-ethereum의 방어: IP 쿼터</h3>
        <p>
          같은 <code>/24</code> 서브넷(예: <code>1.2.3.0~1.2.3.255</code>)에서 오는 노드 수를 제한한다.
          <br />
          <strong>버킷당 2개</strong> — 한 버킷에 같은 /24에서 최대 2개 노드.
          <br />
          <strong>테이블 전체 10개</strong> — 라우팅 테이블 전체에서 같은 /24에서 최대 10개 노드.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('add-ip', codeRefs['add-ip'])} />
            <span className="text-[10px] text-muted-foreground self-center">table.go — addIP()</span>
          </div>
        )}

        <h3>DistinctNetSet 구조</h3>
        <p>
          <code>netutil.DistinctNetSet</code>이 실제 서브넷 카운팅을 수행한다.
          <br />
          IP를 <code>/24</code> 프리픽스로 변환한 뒤, 해당 프리픽스의 카운터가 Limit 미만인지 확인한다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('distinct-net-set', codeRefs['distinct-net-set'])} />
            <span className="text-[10px] text-muted-foreground self-center">net.go — DistinctNetSet</span>
          </div>
        )}

        <h3>왜 /24인가</h3>
        <p>
          대부분의 가정용 ISP는 하나의 /24 블록(256개 IP) 안에서 주소를 할당한다.
          <br />
          공격자가 같은 데이터센터에서 IP를 확보해도, /24 단위로 묶이므로 테이블 장악이 어렵다.
          <br />
          수천 개의 Sybil 노드를 만들어도, 버킷당 2개 / 전체 10개의 벽을 넘을 수 없다.
        </p>
      </div>
    </section>
  );
}
