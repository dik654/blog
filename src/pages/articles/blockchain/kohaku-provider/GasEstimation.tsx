import type { CodeRef } from '@/components/code/types';
import GasEstimationViz from './viz/GasEstimationViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function GasEstimation({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="gas-estimation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">가스 추정 (경량 클라이언트 기반)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>base_fee</code>는 블록 헤더에 포함된 값이다.
          <br />
          Helios가 헤더를 Merkle 증명으로 검증하므로 위조 불가.
        </p>
        <p className="leading-7">
          <code>feeHistory</code>로 최근 블록의 우선순위 수수료 분포를 조회한다.
          <br />
          25/75 퍼센타일로 네트워크 혼잡도를 반영한 적정값을 산출한다.
        </p>
        <p className="leading-7">
          <code>eth_call</code>을 ProofDB 기반으로 로컬 실행해서 gas_used를 측정한다.
          <br />
          20% 버퍼를 더해 gas_limit을 설정한다. 풀 노드 없이도 정확한 추정이 가능하다.
        </p>
      </div>
      <div className="not-prose"><GasEstimationViz /></div>
    </section>
  );
}
