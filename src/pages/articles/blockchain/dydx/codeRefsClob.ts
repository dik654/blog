import type { CodeRef } from '@/components/code/types';

export const clobRefs: Record<string, CodeRef> = {
  'dx-memclob': {
    path: 'protocol/x/clob/memclob/memclob.go',
    lang: 'go',
    highlight: [1, 18],
    desc: 'MemCLOB — 인메모리 CLOB. Price-Time Priority 매칭 엔진.',
    code: `// x/clob/memclob/memclob.go
type MemClobPriceTimePriority struct {
    openOrders         *OpenOrders
    canceledOrders     map[OrderId]bool
    operationsToPropose *OperationsToPropose
}

type Orderbook struct {
    Bids    map[Subticks]*Level   // 매수 주문
    Asks    map[Subticks]*Level   // 매도 주문
    BestBid Subticks
    BestAsk Subticks
}

type Level struct {
    LevelOrders list.List[ClobOrder]  // 시간순 FIFO
}`,
    annotations: [
      { lines: [3, 7], color: 'sky', note: 'MemCLOB 핵심 구조체' },
      { lines: [9, 14], color: 'emerald', note: 'Orderbook — Bids/Asks' },
      { lines: [16, 18], color: 'amber', note: 'Level — 동일 가격 FIFO' },
    ],
  },

  'dx-match-order': {
    path: 'protocol/x/clob/memclob/match_order.go',
    lang: 'go',
    highlight: [1, 20],
    desc: 'matchOrder — 매칭 엔진 메인 함수. CacheContext로 롤백.',
    code: `// x/clob/memclob/match_order.go
func (m *MemClobPriceTimePriority) matchOrder(
    ctx sdk.Context, order types.MatchableOrder,
) (orderStatus, offchainUpdates, err) {
    // 1. CacheContext — 매칭 실패 시 롤백
    branchedContext, writeCache := ctx.CacheContext()
    // 2. Taker 주문 매칭
    takerOrderStatus := m.mustPerformTakerOrderMatching(
        branchedContext, order)
    // 3. 기존 주문 교체
    if !order.IsLiquidation() {
        if old, found := m.openOrders.getOrder(...); found {
            makerOrdersToRemove = append(...)
        }
    }
    // 4. 성공 시 커밋
    writeCache()
    return takerOrderStatus, offchainUpdates, nil
}`,
    annotations: [
      { lines: [7, 7], color: 'sky', note: 'CacheContext — 원자적 롤백' },
      { lines: [9, 10], color: 'emerald', note: 'Taker 매칭 실행' },
      { lines: [18, 18], color: 'amber', note: 'writeCache 커밋' },
    ],
  },

  'dx-taker-match': {
    path: 'protocol/x/clob/memclob/taker_match.go',
    lang: 'go',
    highlight: [1, 22],
    desc: 'mustPerformTakerOrderMatching — 가격-시간 우선순위 매칭.',
    code: `// x/clob/memclob/taker_match.go
func (m *MemClobPriceTimePriority) mustPerformTakerOrderMatching(
    ctx sdk.Context, takerOrder types.MatchableOrder,
) {
    orderbook := m.openOrders.mustGetOrderbook(ctx, takerOrder.GetClobPairId())
    for {
        // 1. 최적 가격 주문 찾기
        bestOrder, found := m.openOrders.getBestOrderOnSide(orderbook, ...)
        if !found { break }
        // 2. 가격 교차 확인
        if !m.canMatchOrders(takerOrder, makerOrder) { break }
        // 3. 매칭 수량 계산
        matchQty := min(taker.Remaining, maker.GetBaseQuantums())
        // 4. 담보 확인
        if !m.checkCollateralization(ctx, taker, maker, matchQty) {
            makerOrdersToRemove = append(..., UNDERCOLLATERALIZED)
            continue
        }
        // 5. 체결
        fill := types.MakerFill{MakerOrderId: ..., FillAmount: matchQty}
        takerStatus.RemainingQuantums -= matchQty
    }
}`,
    annotations: [
      { lines: [8, 10], color: 'sky', note: '최적 가격 탐색' },
      { lines: [12, 12], color: 'emerald', note: '가격 교차 확인' },
      { lines: [16, 18], color: 'amber', note: '담보 부족 → Maker 제거' },
      { lines: [21, 22], color: 'rose', note: '체결 후 잔량 업데이트' },
    ],
  },
};
