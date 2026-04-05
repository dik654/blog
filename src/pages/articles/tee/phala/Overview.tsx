import PhalaArchViz from './viz/PhalaArchViz';
import OverviewStepViz from './viz/OverviewStepViz';

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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Phala 아키텍처

// Layer 1: On-chain (Substrate)
// - Parachain on Polkadot/Kusama
// - 워커 등록·스테이킹 관리
// - Phat Contract 배포 등록
// - 경제적 인센티브 (PHA 토큰)
// - 거버넌스

// Layer 2: Off-chain (TEE Workers)
// - Intel SGX 엔클레이브에서 실행
// - pRuntime (Phala Runtime) 내장
// - Phat Contract WASM 바이트코드 실행
// - 각 워커가 컨트랙트 인스턴스 유지
// - gRPC로 외부 통신

// 역할 분담
// On-chain: "어디서 실행" (워커 선택)
// Off-chain: "무엇을 실행" (실제 계산)
//
// On-chain: Consensus, 최종 결과 커밋
// Off-chain: Heavy compute, external API, 기밀 state

// 유사 프로젝트와 비교
// Chainlink: oracle 중심, 외부 API 호출
// Oasis: 자체 L1 + TEE VM
// Phala: Polkadot 기반, 워커 분산 네트워크`}</pre>

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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Phala의 TEE 활용 목적

// 목적 1: Off-chain computation 신뢰성
// - Oracle이 외부 API 호출하는데 결과를 믿어야 함
// - TEE 안에서 실행 → "워커가 결과 조작 못 함" 증명
// - Chainlink + committee 대안

// 목적 2: 기밀 데이터 처리
// - 민감 입력(의료, 금융)을 블록체인에 노출 안 함
// - TEE에서만 평문 처리
// - 결과만 on-chain 기록

// 목적 3: AI 모델 실행
// - LLM inference가 TEE에서 진행
// - 프롬프트, API 키, 출력 모두 보호
// - Privacy-preserving AI agent

// 목적 4: Heavy compute off-chain
// - 블록체인 한계 (gas, TPS) 극복
// - 복잡 연산은 off-chain
// - 결과만 on-chain commit

// 한계 인식
// ✗ TEE 신뢰 필요 (Intel 의존)
// ✗ SGX 하드웨어 요구사항 (워커 진입 장벽)
// ✗ 사이드채널 공격 가능성`}</pre>

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
