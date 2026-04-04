import type { CodeRef } from '@/components/code/types';

export const transitionCodeRef: Record<string, CodeRef> = {
  'st-execute': {
    path: 'core/state_transition.go — execute()',
    lang: 'go',
    highlight: [1, 42],
    desc: '트랜잭션의 상태 전이 메인 함수.\npreCheck → IntrinsicGas 차감 → EVM 호출 → 가스 환불 순서.',
    code: `func (st *stateTransition) execute() (*ExecutionResult, error) {
    // 1. preCheck: nonce 검증 + 잔액 확인 + 가스 구매
    if err := st.preCheck(); err != nil {
        return nil, err
    }

    var (
        msg              = st.msg
        rules            = st.evm.ChainConfig().Rules(...)
        // 트랜잭션에 받는 주소(To)가 지정되지 않은 경우 = 컨트랙트 생성
        contractCreation = msg.To == nil
    )

    // 2. IntrinsicGas: 기본 가스 비용 계산 + 차감
    gas, err := IntrinsicGas(msg.Data, msg.AccessList, ...)
    st.gasRemaining -= gas

    // 3. EVM 호출 — 컨트랙트 생성 vs 일반 호출
    if contractCreation {
        ret, _, st.gasRemaining, vmerr = st.evm.Create(
            msg.From, msg.Data, st.gasRemaining, value)
    } else {
        // nonce 증가 후 Call 실행
        st.state.SetNonce(msg.From, st.state.GetNonce(msg.From)+1, ...)
        ret, st.gasRemaining, vmerr = st.evm.Call(
            msg.From, st.to(), msg.Data, st.gasRemaining, value)
    }

    // 4. 가스 환불 계산 (최대 사용량의 1/5, EIP-3529)
    st.gasRemaining += st.calcRefund()

    // 5. 잔여 가스 ETH로 환불 + 블록 제안자(coinbase)에게 수수료 지급
    st.returnGas()
    fee := new(uint256.Int).SetUint64(st.gasUsed())
    fee.Mul(fee, effectiveTipU256)
    st.state.AddBalance(st.evm.Context.Coinbase, fee, ...)

    return &ExecutionResult{
        UsedGas: st.gasUsed(), Err: vmerr, ReturnData: ret,
    }, nil
}`,
    annotations: [
      { lines: [2, 4], color: 'sky', note: 'preCheck — nonce 일치 확인, 잔액 >= gasLimit*gasPrice + value 검증' },
      { lines: [13, 14], color: 'emerald', note: 'IntrinsicGas — 기본 21000 + data 바이트당 4/16 gas' },
      { lines: [17, 27], color: 'amber', note: 'EVM 호출 — msg.To == nil이면 Create, 아니면 Call' },
      { lines: [30, 31], color: 'violet', note: '환불 — EIP-3529 이후 사용 가스의 1/5 상한' },
      { lines: [34, 36], color: 'rose', note: '블록 제안자 수수료 — 실질 팁(gasPrice - baseFee) × 사용 가스' },
    ],
  },
  'intrinsic-gas': {
    path: 'core/state_transition.go — IntrinsicGas()',
    lang: 'go',
    highlight: [1, 24],
    desc: '트랜잭션 실행 전 차감하는 최소 가스 비용.\ndata 바이트 수, 컨트랙트 생성 여부에 따라 달라짐.',
    code: `func IntrinsicGas(data []byte, accessList types.AccessList,
    authList []types.SetCodeAuthorization,
    isContractCreation, isHomestead, isEIP2028, isEIP3860 bool,
) (uint64, error) {
    var gas uint64
    if isContractCreation && isHomestead {
        gas = params.TxGasContractCreation  // 53,000
    } else {
        gas = params.TxGas                  // 21,000
    }
    // data 바이트별 비용
    z := uint64(bytes.Count(data, []byte{0}))    // zero bytes
    nz := dataLen - z                             // non-zero bytes
    gas += nz * nonZeroGas    // 16 gas (EIP-2028)
    gas += z * params.TxDataZeroGas  // 4 gas

    // EIP-3860: init code 워드당 추가 비용
    if isContractCreation && isEIP3860 {
        lenWords := toWordSize(dataLen)
        gas += lenWords * params.InitCodeWordGas  // 2 gas/word
    }
    // Access list 비용
    gas += uint64(len(accessList)) * params.TxAccessListAddressGas
    return gas, nil
}`,
    annotations: [
      { lines: [6, 10], color: 'sky', note: '기본 가스 — 일반 tx 21,000 / 컨트랙트 생성 53,000' },
      { lines: [12, 16], color: 'emerald', note: 'data 비용 — zero byte 4gas, non-zero byte 16gas' },
      { lines: [19, 22], color: 'amber', note: 'EIP-3860 — init code 32바이트 워드당 2gas 추가' },
    ],
  },
};
