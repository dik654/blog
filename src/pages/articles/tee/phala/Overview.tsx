import PhalaArchViz from './viz/PhalaArchViz';
import OverviewStepViz from './viz/OverviewStepViz';
import ArchLayersViz from './viz/ArchLayersViz';
import TEEPurposeViz from './viz/TEEPurposeViz';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 시스템 아키텍처'}</h2>
      <div className="not-prose mb-8">
        <PhalaArchViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Phala Network 개요</h3>
        <p>
          <strong>Phala Network</strong>: TEE 기반 탈중앙화 오프체인 컴퓨팅 프로토콜<br />
          <strong>주력</strong>: AI 에이전트 실행 레이어 — 기밀·검증 가능한 off-chain 연산<br />
          <strong>기반</strong>: Polkadot 생태계 (Substrate) + Intel SGX TEE 워커<br />
          <strong>핵심 제품</strong>: Phat Contract — 기밀 스마트 컨트랙트
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2계층 아키텍처</h3>
      </div>
      <div className="not-prose my-6"><ArchLayersViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 구성 요소</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">구성요소</th>
                <th className="border border-border px-3 py-2 text-left">역할</th>
                <th className="border border-border px-3 py-2 text-left">구현</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Phat Contract</td>
                <td className="border border-border px-3 py-2">기밀 스마트 컨트랙트</td>
                <td className="border border-border px-3 py-2">Ink! / Rust WASM</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">pRuntime</td>
                <td className="border border-border px-3 py-2">TEE 워커 내부 런타임</td>
                <td className="border border-border px-3 py-2">Rust + SGX SDK</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Worker</td>
                <td className="border border-border px-3 py-2">컴퓨팅 제공 노드</td>
                <td className="border border-border px-3 py-2">Linux + SGX HW</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Gatekeeper</td>
                <td className="border border-border px-3 py-2">키 관리 특권 노드</td>
                <td className="border border-border px-3 py-2">지정된 워커</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Cluster</td>
                <td className="border border-border px-3 py-2">워커 그룹 (같은 Phat)</td>
                <td className="border border-border px-3 py-2">논리 단위</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">PHA Token</td>
                <td className="border border-border px-3 py-2">네이티브 유틸리티 토큰</td>
                <td className="border border-border px-3 py-2">Substrate ERC20 호환</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 TEE 기반인가</h3>
      </div>
      <div className="not-prose my-6"><TEEPurposeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

      </div>
      <div className="not-prose mt-6">
        <OverviewStepViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Phala vs Oasis 차이</p>
          <p>
            <strong>Oasis</strong>:<br />
            - 자체 L1 (Sapphire paratime)<br />
            - EVM 호환 (Solidity)<br />
            - Cosmos/Tendermint 기반<br />
            - 주 타겟: 기밀 DeFi
          </p>
          <p className="mt-2">
            <strong>Phala</strong>:<br />
            - Polkadot 파라체인 (Substrate)<br />
            - Ink! / Rust WASM<br />
            - Off-chain compute 중심<br />
            - 주 타겟: AI agent, oracle
          </p>
          <p className="mt-2">
            <strong>공통점</strong>:<br />
            - TEE 기반 기밀성<br />
            - 분산 워커 네트워크<br />
            - 토큰 스테이킹 인센티브<br />
            - SGX/TDX 하드웨어 요구
          </p>
        </div>

      </div>
    </section>
  );
}
