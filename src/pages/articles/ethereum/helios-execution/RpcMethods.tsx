import type { CodeRef } from '@/components/code/types';
import RpcMethodsViz from './viz/RpcMethodsViz';
import GetBalanceViz from './viz/GetBalanceViz';
import GetCodeViz from './viz/GetCodeViz';
import GetStorageViz from './viz/GetStorageViz';
import GetLogsViz from './viz/GetLogsViz';
import SendTxViz from './viz/SendTxViz';

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function RpcMethods({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="rpc-methods" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Helios Execution Layer는 5개 RPC 메서드를 제공한다.
          4개는 Merkle 증명으로 검증, 1개만 RPC를 신뢰한다.
          모두 같은 패턴: <code>get_proof → verify → 값 추출</code>.
        </p>
      </div>

      {/* 개요: 공통 패턴 + Bloom + 신뢰 모델 */}
      <div className="not-prose mb-10">
        <RpcMethodsViz />
      </div>

      {/* ① eth_getBalance */}
      <h3 className="text-xl font-semibold mt-10 mb-4">① eth_getBalance — 잔액 조회</h3>
      <div className="not-prose mb-10">
        <GetBalanceViz />
      </div>

      {/* ② eth_getCode */}
      <h3 className="text-xl font-semibold mt-10 mb-4">② eth_getCode — 컨트랙트 코드</h3>
      <div className="not-prose mb-10">
        <GetCodeViz />
      </div>

      {/* ③ eth_getStorageAt */}
      <h3 className="text-xl font-semibold mt-10 mb-4">③ eth_getStorageAt — 스토리지 슬롯</h3>
      <div className="not-prose mb-10">
        <GetStorageViz />
      </div>

      {/* ④ eth_getLogs */}
      <h3 className="text-xl font-semibold mt-10 mb-4">④ eth_getLogs — 이벤트 로그 (Bloom Filter)</h3>
      <div className="not-prose mb-10">
        <GetLogsViz />
      </div>

      {/* ⑤ eth_sendRawTransaction */}
      <h3 className="text-xl font-semibold mt-10 mb-4">⑤ eth_sendRawTransaction — 유일한 신뢰 지점</h3>
      <div className="not-prose mb-10">
        <SendTxViz />
      </div>
    </section>
  );
}
