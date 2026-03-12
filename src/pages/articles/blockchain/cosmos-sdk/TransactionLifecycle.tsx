export default function TransactionLifecycle() {
  return (
    <section id="tx-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">트랜잭션 생명주기 & IBC</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">트랜잭션 처리 흐름</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움 TX 흐름                     Cosmos TX 흐름
───────────────                     ──────────────
1. RLP 인코딩 & 서명                 1. Protobuf 인코딩 & 서명
2. txpool 진입                      2. CheckTx (ABCI) → 멤풀
3. 블록에 포함                       3. PrepareProposal → 블록
4. EVM 실행                         4. FinalizeBlock → 모듈 실행
   - gas 차감                          - gas 차감
   - 상태 변경                         - 상태 변경
   - 이벤트 발생                        - 이벤트 발생
5. 영수증(receipt) 생성              5. TxResult 반환
6. stateRoot 업데이트                6. app_hash 업데이트`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">AnteHandler (미들웨어)</h3>
        <p>
          이더리움의 트랜잭션 검증이 EVM 실행 전에 서명, nonce, gas를 확인하듯,
          Cosmos SDK의 <strong>AnteHandler</strong>는 메시지 실행 전에
          체인 형태의 미들웨어로 사전 검증을 수행합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`AnteHandler 체인 (이더리움 TX 검증과 비교):

SetUpContextDecorator     ← GasMeter 설정 (gasLimit 설정)
ValidateBasicDecorator    ← TX 형식 검증 (RLP 디코딩)
TxTimeoutHeightDecorator  ← (이더리움에 없음) 높이 기반 만료
ValidateMemoDecorator     ← (이더리움에 없음) 메모 길이 제한
ConsumeGasForTxSizeDecorator ← intrinsic gas (21000+)
DeductFeeDecorator        ← gas * gasPrice 선차감
SetPubKeyDecorator        ← (이더리움: ecrecover)
SigVerificationDecorator  ← 서명 검증 (secp256k1/ed25519)
IncrementSequenceDecorator ← nonce 증가`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">IBC (Inter-Blockchain Communication)</h3>
        <p>
          IBC는 이더리움 생태계의 <strong>브릿지</strong>와 비교되지만,
          프로토콜 레벨에서 표준화된 크로스체인 통신입니다.
          이더리움의 롤업이 L1에 증명을 제출하는 것과 유사하게,
          IBC는 Light Client 증명을 사용하여 체인 간 상태를 검증합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`IBC vs 이더리움 크로스체인:

이더리움 롤업 ↔ L1                    IBC
──────────────────                   ──────────────────
롤업이 L1에 상태 루트 제출            체인 A가 체인 B의 Light Client 유지
L1이 fraud/validity proof 검증       Light Client가 헤더 & Merkle 증명 검증
메시지 전달 (L1 ↔ L2)                패킷 전달 (Chain A ↔ Chain B)
시퀀서가 L2→L1 메시지 포함            릴레이어가 패킷 중계

IBC 핸드셰이크:
  Chain A                    Relayer                  Chain B
     │── ConnOpenInit ──────→│──────────────────────→│
     │                       │←── ConnOpenTry ───────│
     │←──────────────────────│── ConnOpenAck ────────→│
     │                       │←── ConnOpenConfirm ───│
     │                       │                        │
     │── Transfer(token) ───→│── RecvPacket ────────→│
     │                       │←── Acknowledgement ───│`}</code>
        </pre>
      </div>
    </section>
  );
}
