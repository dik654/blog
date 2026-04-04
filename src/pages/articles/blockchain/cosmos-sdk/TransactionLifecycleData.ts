export const TX_FLOW_CODE = `이더리움 TX 흐름                     Cosmos TX 흐름
───────────────                     ──────────────
1. RLP 인코딩 & 서명                 1. Protobuf 인코딩 & 서명
2. txpool 진입                      2. CheckTx (ABCI) → 멤풀
3. 블록에 포함                       3. PrepareProposal → 블록
4. EVM 실행                         4. FinalizeBlock → 모듈 실행
   - gas 차감                          - gas 차감
   - 상태 변경                         - 상태 변경
   - 이벤트 발생                        - 이벤트 발생
5. 영수증(receipt) 생성              5. TxResult 반환
6. stateRoot 업데이트                6. app_hash 업데이트`;

export const TX_FLOW_ANNOTATIONS = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: '인코딩 & 멤풀 진입' },
  { lines: [6, 9] as [number, number], color: 'emerald' as const, note: '실행 & 상태 변경' },
];

export const ANTE_CODE = `AnteHandler 체인 (이더리움 TX 검증과 비교):

SetUpContextDecorator     ← GasMeter 설정 (gasLimit 설정)
ValidateBasicDecorator    ← TX 형식 검증 (RLP 디코딩)
TxTimeoutHeightDecorator  ← (이더리움에 없음) 높이 기반 만료
ValidateMemoDecorator     ← (이더리움에 없음) 메모 길이 제한
ConsumeGasForTxSizeDecorator ← intrinsic gas (21000+)
DeductFeeDecorator        ← gas * gasPrice 선차감
SetPubKeyDecorator        ← (이더리움: ecrecover)
SigVerificationDecorator  ← 서명 검증 (secp256k1/ed25519)
IncrementSequenceDecorator ← nonce 증가`;

export const ANTE_ANNOTATIONS = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: '기본 설정 & 형식 검증' },
  { lines: [7, 8] as [number, number], color: 'emerald' as const, note: '가스 & 수수료 처리' },
  { lines: [9, 11] as [number, number], color: 'amber' as const, note: '서명 검증 & nonce' },
];

export const IBC_CODE = `IBC vs 이더리움 크로스체인:

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
     │                       │←── Acknowledgement ───│`;

export const IBC_ANNOTATIONS = [
  { lines: [3, 8] as [number, number], color: 'sky' as const, note: '롤업 vs IBC 비교' },
  { lines: [10, 18] as [number, number], color: 'emerald' as const, note: 'IBC 핸드셰이크 시퀀스' },
];
