import GetBalanceViz from './viz/GetBalanceViz';
import CodePanel from '@/components/ui/code-panel';
import { rpcCode, rpcAnnotations } from './codeRefs';

export default function GetBalance() {
  return (
    <section id="get-balance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        eth_getBalance 구현
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth: MDBX PlainAccountState 테이블에서
          keccak(addr)로 직접 조회한다. O(log n) B-tree 검색.<br />
          Helios: get_proof(addr, &[], block)로
          어카운트 증명을 요청한 뒤 MPT 검증을 수행한다.
        </p>
        <p className="leading-7">
          검증 과정: CL에서 확인된 state_root를 기준으로
          keccak(addr) 경로를 따라 Branch/Extension/Leaf 노드를 순회한다.<br />
          최종 Leaf의 RLP 디코딩 결과에서
          balance 필드(두 번째)를 추출한다.
        </p>
      </div>
      <div className="not-prose mb-6"><GetBalanceViz /></div>
      <CodePanel title="rpc.rs — get_balance()"
        code={rpcCode} annotations={rpcAnnotations} />
    </section>
  );
}
