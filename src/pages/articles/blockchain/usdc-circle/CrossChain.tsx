import CctpViz from './viz/CctpViz';

export default function CrossChain() {
  return (
    <section id="cross-chain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CCTP — Cross-Chain Transfer Protocol</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <CctpViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">CCTP란</h3>
        <p>
          CCTP: Circle의 <strong>네이티브 USDC 크로스체인 전송 프로토콜</strong><br />
          문제 해결: 기존 브리지 보안 문제 (Ronin $625M, Nomad $190M 등)<br />
          메커니즘: Burn on chain A → Mint on chain B (lock-and-mint 아님)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Native USDC vs Bridged USDC</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Native USDC
- Circle이 직접 발행한 USDC
- 각 체인에 독립 컨트랙트
- 1:1 백업 유지

// Bridged USDC (USDC.e)
- 다른 체인에서 brigded된 USDC
- 원본 체인 USDC가 브리지에 lock
- 브리지 체인에서 래핑 USDC mint
- 브리지 취약점에 노출

예시:
- Ethereum USDC (Native)
- Arbitrum USDC (Native, Circle 발행)
- Arbitrum USDC.e (Bridged from Ethereum via Arbitrum Bridge)

// CCTP 이후
Circle이 native USDC를 14+ 체인에 직접 발행
→ bridged USDC 필요성 감소`}</pre>
        <p>
          <strong>Native USDC가 안전</strong>: Circle이 직접 백업<br />
          Bridged USDC는 <strong>브리지 의존</strong> — 브리지 hack 시 디페그 가능<br />
          CCTP 이후 bridged USDC는 점차 퇴출
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CCTP 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// User가 Ethereum USDC → Arbitrum USDC 전송

Step 1: Ethereum에서 Burn
  contract.burnUSDC(1000e6, arbitrumChain, recipient)
  → 1000 USDC 소각
  → MessageSent 이벤트 발생

Step 2: Attestation 서비스
  Circle의 오프체인 서비스가 burn 이벤트 감지
  → attestation 서명 생성 (Circle 비공개 키)
  → 공개 API로 제공

Step 3: User가 Arbitrum에서 Mint
  const message = getAttestation(burnTxHash);
  const attestation = fetchSignature(message);

  arbitrum_contract.receiveMessage(message, attestation)
  → Circle 서명 검증
  → 1000 USDC mint on Arbitrum`}</pre>
        <p>
          <strong>3단계</strong>: Burn → Attestation → Mint<br />
          사용자가 Step 3 수동 호출 필요 (또는 relayer 사용)<br />
          Circle의 서명이 유일한 권한 — <strong>중앙화된 브리지</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MessageTransmitter 컨트랙트</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 각 체인에 배포된 CCTP 컨트랙트

contract MessageTransmitter {
    function sendMessage(
        uint32 destinationDomain,
        bytes32 recipient,
        bytes memory messageBody
    ) external returns (uint64);

    function receiveMessage(
        bytes memory message,
        bytes memory attestation
    ) external returns (bool success);
}

contract TokenMessenger {
    function depositForBurn(
        uint256 amount,
        uint32 destinationDomain,
        bytes32 mintRecipient,
        address burnToken
    ) external returns (uint64 _nonce);

    function handleReceiveMessage(
        uint32 remoteDomain,
        bytes32 sender,
        bytes calldata messageBody
    ) external returns (bool);
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">지원 체인 (2025년)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`CCTP v1 (2023):
  Ethereum, Arbitrum, Avalanche, Base, Optimism, Polygon PoS

CCTP v2 (2024-2025):
  + Solana
  + Noble (Cosmos)
  + Unichain
  + World Chain
  + 기타

// 매일 새 체인 추가 중
// USDC native launch와 CCTP 동시 지원`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">CCTP vs 일반 브리지 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">항목</th>
                <th className="border border-border px-3 py-2 text-left">CCTP</th>
                <th className="border border-border px-3 py-2 text-left">Lock&amp;Mint 브리지</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">메커니즘</td>
                <td className="border border-border px-3 py-2">Burn &amp; Mint</td>
                <td className="border border-border px-3 py-2">Lock &amp; Mint</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">중앙화</td>
                <td className="border border-border px-3 py-2">Circle only (단일)</td>
                <td className="border border-border px-3 py-2">multisig / validator set</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">자산</td>
                <td className="border border-border px-3 py-2">USDC only</td>
                <td className="border border-border px-3 py-2">any token</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">소요 시간</td>
                <td className="border border-border px-3 py-2">15-30분 (v1)<br />8-20초 (v2)</td>
                <td className="border border-border px-3 py-2">수분 ~ 수시간</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">보안 가정</td>
                <td className="border border-border px-3 py-2">Circle 신뢰</td>
                <td className="border border-border px-3 py-2">브리지 validator 신뢰</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">수수료</td>
                <td className="border border-border px-3 py-2">무료 (gas만)</td>
                <td className="border border-border px-3 py-2">0.05-0.1%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">CCTP v2 — Fast Transfer</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// v1 대비 개선
- Fast Transfer: 8-20초 완료 (v1: 15-30분)
- Hooks: 도착 체인에서 자동 액션 실행
- Standard vs Fast 선택 가능

// Fast Transfer 메커니즘
1. User: Burn on chain A
2. Circle: 이벤트 감지 & attestation (빠른 확인)
3. Receiver(relayer): Circle이 직접 mint 실행
4. 사용자는 도착 주소로 USDC 수령

// 비용
Standard: 무료 (user가 mint 실행)
Fast: 약간의 수수료 (relayer가 gas 지불)

// Hooks
receiveMessageAndHook 함수
- USDC 수령과 동시에 다른 컨트랙트 호출
- 예: USDC 수령 → Aave 자동 예치`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: CCTP의 전략적 의미</p>
          <p>
            CCTP는 Circle의 <strong>"모든 체인의 USDC 표준화" 전략</strong>
          </p>
          <p className="mt-2">
            영향:<br />
            ✓ 브리지 공격 위험 감소 (Native USDC만 사용)<br />
            ✓ USDC 유동성 통합 (체인 간 동일 자산)<br />
            ✓ DEX·프로토콜의 CCTP 통합 (Uniswap, Curve 지원)<br />
            ✓ 크로스체인 DeFi 경험 개선
          </p>
          <p className="mt-2">
            <strong>Circle의 노림수</strong>:<br />
            - Native USDC가 표준 → bridged USDC 퇴출<br />
            - 모든 체인이 Circle에 의존<br />
            - 장기적으로 CCTP 수수료 부과 가능성
          </p>
          <p className="mt-2">
            <strong>경쟁</strong>:<br />
            - LayerZero OFT (Omnichain Fungible Token)<br />
            - Wormhole native token transfers<br />
            - Axelar Interchain Tokens<br />
            크로스체인 스테이블코인 전쟁 진행 중
          </p>
        </div>

      </div>
    </section>
  );
}
