import CodePanel from '@/components/ui/code-panel';
import BitswapFlowViz from './viz/BitswapFlowViz';
import { BITSWAP_CODE, BITSWAP_ANNOTATIONS } from './BitswapData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Bitswap({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="bitswap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bitswap 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Bitswap</strong>은 IPFS의 블록 교환 프로토콜입니다.<br />
          BitTorrent에서 영감을 받았지만, 파일이 아닌 <strong>개별 블록</strong> 단위로 교환합니다.<br />
          각 노드는 원하는 블록(Wantlist)과 보유 블록을 추적합니다.<br />
          tit-for-tat 전략의 <strong>Ledger</strong>로 공정한 교환을 유지합니다.
        </p>
        <h3>메시지 타입</h3>
        <ul>
          <li><code>WANT_HAVE</code> -- 블록 보유 여부만 질의 (경량)</li>
          <li><code>WANT_BLOCK</code> -- 블록 데이터 직접 요청</li>
          <li><code>HAVE</code> -- 블록 보유 응답</li>
          <li><code>BLOCK</code> -- 실제 블록 데이터 전송</li>
          <li><code>DONT_HAVE</code> -- 블록 미보유 응답</li>
        </ul>
        <h3>세션 기반 요청</h3>
        <p>
          Bitswap Session은 같은 DAG(Directed Acyclic Graph)의 블록들을
          함께 요청하는 단위입니다.<br />
          이전 블록을 빠르게 응답한 피어에게 다음 요청을 우선 배정하여 지연을 최적화합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('kubo-bitswap-create', codeRefs['kubo-bitswap-create'])} />
            <span className="text-[10px] text-muted-foreground self-center">Bitswap 생성</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-bitswap-defaults', codeRefs['kubo-bitswap-defaults'])} />
            <span className="text-[10px] text-muted-foreground self-center">기본 옵션</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-noop-exchange', codeRefs['kubo-noop-exchange'])} />
            <span className="text-[10px] text-muted-foreground self-center">NoopExchange</span>
          </div>
        )}
        <CodePanel title="블록 수신 핸들러" code={BITSWAP_CODE} annotations={BITSWAP_ANNOTATIONS} />
      </div>
      <div className="mt-8"><BitswapFlowViz /></div>
    </section>
  );
}
