package messagepool

// MessagePool — Filecoin 메시지 풀
// EIP-1559 스타일 가스 모델: BaseFee + GasPremium → 메시지 우선순위 결정

import (
	"context"
	"github.com/filecoin-project/lotus/chain/types"
)

type MessagePool struct {
	pending  map[address.Address]*msgSet // 주소별 pending 메시지
	curTs    *types.TipSet               // 현재 head tipset
	api      Provider                    // 체인 상태 조회
	baseFee  types.BigInt                // 현재 BaseFee
}

// Add는 새 메시지를 풀에 추가
func (mp *MessagePool) Add(ctx context.Context, m *types.SignedMessage) error {
	// 1. 서명 검증
	if err := mp.verifyMsgSig(m); err != nil {
		return err
	}
	// 2. Nonce 검증 — 계정의 현재 nonce 이상이어야 함
	// 갭 허용 안 함: nonce 5가 없으면 nonce 6도 실행 불가
	if err := mp.verifyNonce(m); err != nil {
		return err
	}
	// 3. 가스 검증 — GasLimit ≤ BlockGasLimit
	if err := mp.verifyGas(m); err != nil {
		return err
	}
	// 4. 밸런스 검증 — GasLimit × GasFeeCap 이상 잔고 필요
	if err := mp.verifyBalance(m); err != nil {
		return err
	}
	// 5. pending 맵에 추가 (GasPremium으로 정렬)
	mp.pending[m.Message.From].add(m)
	return nil
}

// GasEstimateMessageGas는 가스 파라미터를 자동 추정
func (mp *MessagePool) GasEstimateMessageGas(
	ctx context.Context, msg *types.Message,
) (*types.Message, error) {
	// GasLimit: 메시지 실행 시뮬레이션으로 추정
	// GasFeeCap: BaseFee × 1.25 + GasPremium
	// GasPremium: 최근 블록의 중간값 기반
	return mp.estimateGas(ctx, msg)
}
