export const ANTE_CHAIN_CODE = `// AnteHandler 데코레이터 체인 (이더리움 TX 검증과 비교)
// 이더리움: validateTx() 단일 함수
// Cosmos: 체인 형태의 미들웨어 파이프라인

anteDecorators := []sdk.AnteDecorator{
    ante.NewSetUpContextDecorator(),     // GasMeter 초기화
    ante.NewExtensionOptionsDecorator(), // 확장 옵션 검증
    ante.NewValidateBasicDecorator(),    // Msg.ValidateBasic()
    ante.NewTxTimeoutHeightDecorator(),  // 블록 높이 만료
    ante.NewValidateMemoDecorator(ak),   // 메모 길이 검증
    ante.NewConsumeGasForTxSizeDecorator(ak), // TX 크기 가스
    ante.NewDeductFeeDecorator(ak, bk, fk),   // 수수료 차감
    ante.NewSetPubKeyDecorator(ak),      // 공개키 저장
    ante.NewValidateSigCountDecorator(ak),    // 서명 수 제한
    ante.NewSigGasConsumeDecorator(ak, sigGasConsumer),
    ante.NewSigVerificationDecorator(ak, signModeHandler),
    ante.NewIncrementSequenceDecorator(ak),   // nonce++
}`;

export const ANTE_ANNOTATIONS = [
  { lines: [6, 10] as [number, number], color: 'sky' as const, note: '초기 검증 (컨텍스트, 기본 유효성)' },
  { lines: [11, 12] as [number, number], color: 'emerald' as const, note: '가스 & 수수료 처리' },
  { lines: [13, 17] as [number, number], color: 'amber' as const, note: '서명 검증 & 시퀀스 관리' },
];
