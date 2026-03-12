export default function EngineIntegration() {
  return (
    <section id="engine-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Engine API 통합 & 크로스체인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">ABCI → Engine API 브릿지</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`블록 생성 흐름 (이더리움과 비교):

이더리움:
  CL: engine_forkchoiceUpdatedV3(headHash, payloadAttributes)
  EL: 페이로드 빌드 시작
  CL: engine_getPayloadV3(payloadId)
  EL: 완성된 페이로드 반환
  CL: engine_newPayloadV3(payload) → EL이 실행 & 검증

Omni Octane:
  CometBFT: ABCI PrepareProposal 호출
  Octane:   engine_forkchoiceUpdatedV3 → geth에 빌드 요청
            engine_getPayloadV3 → 페이로드 수신
            페이로드를 CometBFT 블록에 포함

  CometBFT: ABCI ProcessProposal 호출
  Octane:   engine_newPayloadV3 → geth가 실행 & 검증
            결과를 CometBFT에 Accept/Reject 반환

  CometBFT: ABCI FinalizeBlock 호출
  Octane:   engine_forkchoiceUpdatedV3(headHash=new) → 확정

→ ABCI 콜백이 Engine API 호출로 변환되는 "어댑터" 패턴`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">크로스 롤업 메시징 (XMsg)</h3>
        <p>
          Omni의 주 목적은 이더리움 롤업 간 메시지 전달입니다.
          이더리움 L1의 크로스 롤업 통신이 L1을 경유해야 하는 반면,
          Omni는 독자적 합의를 통해 <strong>빠른 크로스체인 메시지</strong>를 제공합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`크로스체인 통신 비교:

이더리움 L1 경유:
  Rollup A → L1 → Rollup B  (수 시간~수일)
  (fraud proof / validity proof 대기)

Omni XMsg:
  Rollup A → Omni 검증자 어테스테이션 → Rollup B  (수 초)

  XMsg 흐름:
  1. 소스 체인에서 이벤트 발생 (Solidity portal contract)
  2. Omni 검증자가 이벤트를 관찰 & 어테스테이션 (cross-chain attestation)
  3. 릴레이어가 어테스테이션을 목적지 체인에 제출
  4. 목적지 체인의 portal contract가 검증 & 실행

  → Cosmos IBC와 유사하지만, EVM 롤업 전용으로 최적화`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">코드 구조 (omni 레포)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`omni/
├── octane/                # Octane 엔진 (CometBFT + EVM 통합)
│   └── evmengine/         # ABCI ↔ Engine API 어댑터
│       ├── abci.go        # PrepareProposal, ProcessProposal
│       └── enginecl.go    # Engine API 클라이언트
├── halo/                  # 합의 레이어
│   ├── app/               # Cosmos SDK 앱
│   ├── attest/            # 크로스체인 어테스테이션 모듈
│   └── valsync/           # 검증자 동기화
├── contracts/             # Solidity 컨트랙트
│   ├── portal/            # XMsg 포털 (각 롤업에 배포)
│   └── avs/               # EigenLayer AVS 통합
├── relayer/               # 크로스체인 릴레이어
└── lib/                   # 공통 라이브러리
    └── xchain/            # XMsg 타입 & 인코딩`}</code>
        </pre>
      </div>
    </section>
  );
}
