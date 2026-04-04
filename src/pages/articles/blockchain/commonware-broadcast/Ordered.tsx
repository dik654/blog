import OrderedViz from './viz/OrderedViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Ordered({ onCodeRef }: Props) {
  return (
    <section id="ordered" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ordered_broadcast: 인증서 체인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          핵심 타입 3종: <code>Chunk</code>(sequencer + height + payload) · <code>Parent</code>(이전 인증서) · <code>Node</code>(Chunk + sig + Parent)
          <br />
          각 시퀀서가 독립 체인 — Node(h=N).parent.certificate = h=N-1의 쿼럼 인증서
          <br />
          height 0이면 Parent = None (genesis)
        </p>
        <p className="leading-7">
          <strong>Engine</strong>의 <code>select_loop!</code> — 노드 수신 → <code>read_staged()</code> 디코딩 → <code>validate_node()</code> 서명 검증
          <br />
          <strong>AckManager</strong> — 부분 서명 수집. 3중 Map: Sequencer → Height → Epoch → Evidence
          <br />
          2f+1 쿼럼 달성 → <code>Partials</code>에서 <code>Certificate</code>로 승격
        </p>
        <p className="leading-7">
          <strong>TipManager</strong> — 시퀀서별 최신 Node 추적. tip 존재 = 전체 체인(h=0~N) 확인됨
        </p>
      </div>
      <div className="not-prose mb-8">
        <OrderedViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
