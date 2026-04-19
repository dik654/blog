import PhatContractViz from './viz/PhatContractViz';
import PhatContractStepViz from './viz/PhatContractStepViz';
import PhatInkExampleViz from './viz/PhatInkExampleViz';
import PhatDeployFlowViz from './viz/PhatDeployFlowViz';
import PhatSecurityLayersViz from './viz/PhatSecurityLayersViz';

export default function PhatContract({ title }: { title?: string }) {
  return (
    <section id="phat-contract" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Phat Contract (Pink Runtime)'}</h2>
      <div className="not-prose mb-8">
        <PhatContractViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Phat Contract — TEE 스마트 컨트랙트</h3>
        <p>
          <strong>Phat Contract</strong>: Phala Network의 TEE 내부 실행 스마트 컨트랙트<br />
          <strong>Pink Runtime</strong>: Substrate <code>pallet-contracts</code> 확장 — TEE 특화 기능 추가<br />
          <strong>언어</strong>: Ink! (Rust 기반 DSL) → WASM으로 컴파일<br />
          <strong>차별점</strong>: HTTP 요청, 외부 API, 오프체인 계산이 컨트랙트 안에서 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Phat Contract 개발 예시</h3>
      </div>
      <div className="not-prose my-6"><PhatInkExampleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Pink Runtime 확장 기능</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">확장 기능</th>
                <th className="border border-border px-3 py-2 text-left">API</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">HTTP Request</td>
                <td className="border border-border px-3 py-2"><code>pink::http_get/post</code></td>
                <td className="border border-border px-3 py-2">Oracle, API 호출</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Random</td>
                <td className="border border-border px-3 py-2"><code>pink::ext().getrandom</code></td>
                <td className="border border-border px-3 py-2">VRF, 추첨</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Signing</td>
                <td className="border border-border px-3 py-2"><code>pink::signing::sign</code></td>
                <td className="border border-border px-3 py-2">외부 체인 tx 서명</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Cache</td>
                <td className="border border-border px-3 py-2"><code>pink::cache::*</code></td>
                <td className="border border-border px-3 py-2">off-chain 상태 캐시</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">IPFS</td>
                <td className="border border-border px-3 py-2"><code>pink::ipfs::*</code></td>
                <td className="border border-border px-3 py-2">대용량 데이터 저장</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Sidevm</td>
                <td className="border border-border px-3 py-2"><code>pink::sidevm::*</code></td>
                <td className="border border-border px-3 py-2">장기 실행 프로세스</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">배포 & 호출</h3>
      </div>
      <div className="not-prose my-6"><PhatDeployFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">보안 모델</h3>
      </div>
      <div className="not-prose my-6"><PhatSecurityLayersViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

      </div>
      <div className="not-prose mt-6">
        <PhatContractStepViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Phat Contract vs EVM 스마트 컨트랙트</p>
          <p>
            <strong>Ethereum 스마트 컨트랙트</strong>:<br />
            - 결정적 on-chain 실행<br />
            - 외부 API 호출 불가 (oracle 필요)<br />
            - 모든 state 공개<br />
            - Gas 예측 가능
          </p>
          <p className="mt-2">
            <strong>Phat Contract</strong>:<br />
            ✓ HTTP 요청 직접 호출<br />
            ✓ 외부 API key 기밀 보관<br />
            ✓ Off-chain 결과 서명 후 on-chain 제출<br />
            ✗ 가격 변동성 큼 (TEE + network)
          </p>
          <p className="mt-2">
            <strong>유스케이스</strong>:<br />
            - Chainlink 대안 (decentralized oracle)<br />
            - AI agent 실행 플랫폼<br />
            - Private RWA tokenization<br />
            - Cross-chain bridge (서명 생성)
          </p>
        </div>

      </div>
    </section>
  );
}
