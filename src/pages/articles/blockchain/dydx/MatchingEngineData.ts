export const matchingCode = `매칭 엔진 핵심 로직 (matchOrder):

func (m *MemClobPriceTimePriority) matchOrder(
  ctx sdk.Context,
  order types.MatchableOrder,
) (orderStatus, offchainUpdates, makerOrdersToRemove, err) {

  // 1. 상태 분기 - 매칭 실패 시 롤백
  branchedContext, writeCache := ctx.CacheContext()

  // 2. Taker 주문 매칭 수행
  takerOrderStatus := m.mustPerformTakerOrderMatching(
    branchedContext, order,
  )

  // 3. 기존 주문 교체 처리
  if !order.IsLiquidation() {
    if orderToBeReplaced, found := m.openOrders.getOrder(...); found {
      makerOrdersToRemove = append(...)
    }
  }

  // 4. 매칭 성공 시 상태 커밋
  writeCache()
  return takerOrderStatus, offchainUpdates, makerOrdersToRemove, nil
}`;

export const matchingAnnotations = [
  { lines: [8, 9] as [number, number], color: 'sky' as const, note: 'CacheContext로 원자적 롤백 보장' },
  { lines: [11, 14] as [number, number], color: 'emerald' as const, note: 'Taker 주문 매칭 실행' },
  { lines: [17, 21] as [number, number], color: 'amber' as const, note: '기존 주문 교체(Replace) 처리' },
  { lines: [24, 25] as [number, number], color: 'rose' as const, note: '성공 시 상태 커밋' },
];

export const takerMatchCode = `Taker 주문 매칭 루프:

func (m *MemClobPriceTimePriority) mustPerformTakerOrderMatching(
  ctx sdk.Context, takerOrder types.MatchableOrder,
) {
  orderbook := m.openOrders.mustGetOrderbook(ctx, takerOrder.GetClobPairId())
  oppositeSide := orderbook.GetSide(!takerOrder.IsBuy())

  for {
    // 1. 최적 가격의 주문 찾기
    bestLevelOrder, found := m.openOrders.getBestOrderOnSide(orderbook, ...)
    if !found { break }

    // 2. 가격 매칭 조건 확인
    if !m.canMatchOrders(takerOrder, makerOrder) { break }

    // 3. 매칭 수량 계산
    matchQuantums := min(takerStatus.RemainingQuantums, makerOrder.GetBaseQuantums())

    // 4. 담보 확인 → 부족 시 Maker 제거
    if !m.checkCollateralization(ctx, takerOrder, makerOrder, matchQuantums) {
      makerOrdersToRemove = append(..., UNDERCOLLATERALIZED)
      continue
    }

    // 5. 체결 실행
    fill := types.MakerFill{MakerOrderId: ..., FillAmount: matchQuantums}
    takerOrderStatus.RemainingQuantums -= matchQuantums

    if takerOrderStatus.RemainingQuantums == 0 { break }
  }
}`;

export const takerMatchAnnotations = [
  { lines: [10, 12] as [number, number], color: 'sky' as const, note: '최적 가격 주문 탐색' },
  { lines: [14, 15] as [number, number], color: 'emerald' as const, note: '가격 교차 조건 확인' },
  { lines: [20, 23] as [number, number], color: 'amber' as const, note: '담보 부족 시 주문 제거' },
  { lines: [26, 28] as [number, number], color: 'rose' as const, note: '체결 후 잔량 업데이트' },
];
