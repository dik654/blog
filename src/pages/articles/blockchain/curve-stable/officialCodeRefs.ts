import type { CodeRef } from "@/components/code/types";

export const officialCurveStableCodeRefs: Record<string, CodeRef> = {
  "curve-fixture": {
    path: "tests/fixtures/constants.py · tests/fixtures/pools.py · tests/pools/exchange/test_exchange.py",
    lang: "python",
    highlight: [1, 30],
    desc: "StableSwap-NG commit 2abe778f · plain-token 공식 테스트가 만드는 pool과 1,000-token 교환 조건입니다. 이해를 돕는 한국어 주석만 덧붙였습니다.",
    code: `# 각 token은 처음에 3,000,000개가 준비됩니다.
INITIAL_AMOUNT = 3_000_000

# Basic pool에는 절반인 1,500,000개씩 예치합니다.
deposit_basic_amounts = [
    INITIAL_AMOUNT * 10**decimals[i] // 2
    for i in range(2)
]

# Plain-token pool의 사용자 표시 A와 기본 fee입니다.
A = 2000
fee = 1_000_000          # 1e10 분모에서 0.01%
offpeg_fee_multiplier = 20_000_000_000

def test_min_dy(...):
    # Bob은 token i를 1,000개 보냅니다.
    amount = 1_000 * 10 ** decimals[sending]

    # 먼저 같은 현재 상태에서 최소 예상 출력을 읽습니다.
    min_dy = swap.get_dy(sending, receiving, amount)

    # 실제 교환 뒤 Bob의 token j 증가량을 비교합니다.
    swap.exchange(sending, receiving, amount, 0, sender=bob)
    receiving_token_diff = final_receiving - initial_receiving

    # Plain token 경로는 quote와 실제 출력 차이가 1 wei 이하여야 합니다.
    assert abs(receiving_token_diff - min_dy) <= 1`,
    annotations: [
      { lines: [1, 7], color: "sky", note: "공식 fixture의 균형 pool은 각 자산 1,500,000개에서 시작합니다." },
      { lines: [9, 12], color: "amber", note: "A=2000과 0.01% fee는 이 테스트 fixture의 값이며 모든 Curve pool의 공통값이 아닙니다." },
      { lines: [14, 27], color: "emerald", note: "get_dy로 읽은 현재 상태의 quote와 실제 exchange 결과를 같은 fixture에서 대조합니다." },
    ],
  },
  "curve-normalize": {
    path: "contracts/main/CurveStableSwapNG.vy · _stored_rates / _xp_mem",
    lang: "python",
    highlight: [1, 31],
    desc: "같은 commit · raw token balance를 decimals·oracle·ERC-4626 rate가 반영된 공통 1e18 단위 xp로 바꾸는 실제 경로입니다.",
    code: `@view
@internal
def _stored_rates() -> DynArray[uint256, MAX_COINS]:
    # 배포 때 정한 decimals 보정값에서 시작합니다.
    rates: DynArray[uint256, MAX_COINS] = rate_multipliers

    for i in range(N_COINS_128, bound=MAX_COINS_128):
        if asset_types[i] == 1 and not rate_oracles[i] == 0:
            # Oracle token은 현재 1e18 precision rate를 읽습니다.
            oracle_response: Bytes[32] = raw_call(
                convert(rate_oracles[i] % 2**160, address),
                _abi_encode(rate_oracles[i] & ORACLE_BIT_MASK),
                max_outsize=32,
                is_static_call=True,
            )
            assert len(oracle_response) == 32
            fetched_rate: uint256 = convert(oracle_response, uint256)
            rates[i] = unsafe_div(rates[i] * fetched_rate, PRECISION)

        elif asset_types[i] == 3:
            # ERC-4626 token은 convertToAssets 결과까지 rate에 반영합니다.
            rates[i] = unsafe_div(
                rates[i] * ERC4626(coins[i]).convertToAssets(call_amount[i]) * scale_factor[i],
                PRECISION
            )
    return rates

@pure
@internal
def _xp_mem(_rates, _balances):
    result = []
    for i in range(N_COINS_128, bound=MAX_COINS_128):
        # Curve 수학은 raw 잔액이 아니라 같은 단위의 xp를 읽습니다.
        result.append(unsafe_div(_rates[i] * _balances[i], PRECISION))
    return result`,
    annotations: [
      { lines: [1, 18], color: "sky", note: "Token 유형에 따라 rate의 출처가 달라집니다. 같은 raw 1개가 같은 가치 단위라는 보장은 없습니다." },
      { lines: [20, 24], color: "amber", note: "ERC-4626 share token은 underlying asset 환산값을 사용합니다." },
      { lines: [27, 33], color: "emerald", note: "Invariant의 xᵢ는 rate×balance/1e18로 정규화한 xp입니다." },
    ],
  },
  "curve-exchange": {
    path: "contracts/main/CurveStableSwapNG.vy · _exchange",
    lang: "python",
    highlight: [1, 30],
    desc: "같은 commit · 실제 받은 입력을 확인한 뒤 rate·balance·A가 반영된 계산을 실행하고 min_dy를 통과해야 출력 token을 보내는 순서입니다.",
    code: `@internal
def _exchange(sender, i, j, _dx, _min_dy, receiver, expect_optimistic_transfer):
    # 같은 token끼리 또는 0개 교환은 시작하지 않습니다.
    assert i != j
    assert _dx > 0

    # 현재 rate와 LP 귀속 잔액을 같은 transaction에서 읽습니다.
    rates = self._stored_rates()
    old_balances = self._balances()
    xp = self._xp_mem(rates, old_balances)

    # 요청값이 아니라 pool이 실제 받은 양을 dx로 사용합니다.
    dx = self._transfer_in(i, _dx, sender, expect_optimistic_transfer)

    # 입력 token을 공통 단위로 더한 뒤 invariant 경로를 실행합니다.
    x = xp[i] + unsafe_div(dx * rates[i], PRECISION)
    dy = self.__exchange(x, xp, rates, i, j)

    # 사용자가 정한 최소 출력보다 작으면 transfer-out 전에 전체 revert합니다.
    assert dy >= _min_dy, "Exchange resulted in fewer coins than expected"

    # 검사를 통과한 실제 dy만 receiver에게 전송합니다.
    self._transfer_out(j, dy, receiver)
    log TokenExchange(msg.sender, i, dx, j, dy)
    return dy`,
    annotations: [
      { lines: [1, 10], color: "sky", note: "Quote가 아니라 execution 시점의 rate와 balance snapshot이 계산 입력입니다." },
      { lines: [12, 17], color: "emerald", note: "Transfer-in 뒤 실제 받은 dx를 정규화해 새 x를 만듭니다." },
      { lines: [19, 25], color: "rose", note: "min_dy 실패는 출력 전송뿐 아니라 입력 전송과 계산 효과도 transaction 전체에서 되돌립니다." },
    ],
  },
  "curve-invariant": {
    path: "contracts/main/CurveStableSwapNG.vy · get_D / get_y",
    lang: "python",
    highlight: [1, 44],
    desc: "같은 commit · 현재 xp에서 D를 구하고 입력 뒤 같은 D를 만족하는 출력 잔액 y를 최대 255번의 정수 반복으로 찾는 핵심입니다.",
    code: `@pure
@internal
def get_D(_xp, _amp):
    # 균형 1,500,000 / 1,500,000이면 첫 추정 D는 합계 3,000,000입니다.
    S = sum(_xp)
    if S == 0:
        return 0
    D = S
    Ann = _amp * N_COINS

    for _i in range(255):
        D_P = D
        for x in _xp:
            D_P = D_P * D / x
        D_P /= pow_mod256(N_COINS, N_COINS)
        Dprev = D
        D = (
            (Ann * S / A_PRECISION + D_P * N_COINS) * D
            / ((Ann - A_PRECISION) * D / A_PRECISION + (N_COINS + 1) * D_P)
        )
        # 1 wei 안에서 같아지면 현재 D를 사용합니다.
        if abs(D - Dprev) <= 1:
            return D
    raise

@pure
@internal
def get_y(i, j, x, xp, _amp, D):
    # j를 제외한 잔액과 새 입력 x로 y의 이차식 계수를 만듭니다.
    S_ = 0
    c = D
    Ann = _amp * N_COINS
    for _i in range(N_COINS):
        if _i == i:
            _x = x
        elif _i != j:
            _x = xp[_i]
        else:
            continue
        S_ += _x
        c = c * D / (_x * N_COINS)
    c = c * D * A_PRECISION / (Ann * N_COINS)
    b = S_ + D * A_PRECISION / Ann

    # 같은 D를 만족하는 출력 쪽 잔액 y를 정수 반복으로 풉니다.
    y = D
    for _i in range(255):
        y_prev = y
        y = (y * y + c) / (2 * y + b - D)
        if abs(y - y_prev) <= 1:
            return y
    raise`,
    annotations: [
      { lines: [1, 21], color: "sky", note: "get_D는 현재 normalized balances와 A에서 invariant D를 1 wei 수렴 조건으로 찾습니다." },
      { lines: [23, 38], color: "amber", note: "get_y는 새 x를 넣되 D를 고정해 출력 자산의 남을 잔액 y를 풉니다." },
      { lines: [40, 47], color: "emerald", note: "정수 나눗셈과 최대 반복 수까지 contract semantics의 일부입니다." },
    ],
  },
  "curve-output": {
    path: "contracts/main/CurveStableSwapNG.vy · __exchange",
    lang: "python",
    highlight: [1, 27],
    desc: "같은 commit · y를 찾은 뒤 1 wei를 보수적으로 빼고 dynamic fee와 출력 token rate를 적용해 사용자가 받는 dy를 만드는 실제 코드입니다.",
    code: `@internal
def __exchange(x, _xp, rates, i, j):
    # Ramp 중이면 현재 block.timestamp의 A를 읽습니다.
    amp = self._A()
    D = self.get_D(_xp, amp)
    y = self.get_y(i, j, x, _xp, amp, D)

    # 반올림으로 pool이 더 내지 않도록 1 wei를 뺍니다.
    dy = _xp[j] - y - 1

    # 두 자산의 평균 xp가 멀어질수록 설정에 따라 fee가 커질 수 있습니다.
    dy_fee = unsafe_div(
        dy * self._dynamic_fee(
            unsafe_div(_xp[i] + x, 2),
            unsafe_div(_xp[j] + y, 2),
            self.fee
        ),
        FEE_DENOMINATOR
    )

    # Fee를 뺀 normalized output을 token j의 실제 단위로 되돌립니다.
    dy = (dy - dy_fee) * PRECISION / rates[j]

    # Admin 몫은 출력 자산 장부에 따로 누적합니다.
    self.admin_balances[j] += unsafe_div(
        unsafe_div(dy_fee * admin_fee, FEE_DENOMINATOR) * PRECISION,
        rates[j]
    )
    return dy`,
    annotations: [
      { lines: [1, 6], color: "sky", note: "A, D, y가 한 execution snapshot에서 연결됩니다." },
      { lines: [8, 18], color: "amber", note: "Gross output에 보수적 1 wei와 dynamic fee를 적용합니다." },
      { lines: [20, 27], color: "emerald", note: "마지막에 token j의 단위로 되돌린 값이 min_dy와 실제 transfer-out에 쓰입니다." },
    ],
  },
  "curve-ramp-a": {
    path: "contracts/main/CurveStableSwapNG.vy · _A",
    lang: "python",
    highlight: [1, 18],
    desc: "같은 commit · A ramp 중에는 시작값과 목표값 사이를 현재 block.timestamp로 선형 보간합니다.",
    code: `@view
@internal
def _A() -> uint256:
    t1 = self.future_A_time
    A1 = self.future_A

    if block.timestamp < t1:
        A0 = self.initial_A
        t0 = self.initial_A_time

        # 목표 A가 더 크면 시간 경과분만큼 올립니다.
        if A1 > A0:
            return A0 + (A1 - A0) * (block.timestamp - t0) / (t1 - t0)

        # 목표 A가 더 작으면 같은 방식으로 내립니다.
        return A0 - (A0 - A1) * (block.timestamp - t0) / (t1 - t0)

    # Ramp가 끝났거나 설정되지 않았으면 목표값을 사용합니다.
    return A1`,
    annotations: [
      { lines: [1, 8], color: "sky", note: "Quote와 execution의 timestamp가 다르면 ramp 중 A도 달라질 수 있습니다." },
      { lines: [10, 18], color: "amber", note: "A는 한 번에 바뀌는 상수가 아니라 시간에 따른 상태 전이가 될 수 있습니다." },
    ],
  },
};
