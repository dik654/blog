import HooksViz from './viz/HooksViz';
import HookAddressViz from './viz/HookAddressViz';
import DynamicFeeViz from './viz/DynamicFeeViz';

export default function Hooks() {
  return (
    <section id="hooks" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Hooks — Pre/Post 커스텀 로직</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <HooksViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Hook이란</h3>
        <p>
          Hook: 풀의 수명 주기 이벤트에 <strong>커스텀 컨트랙트 로직</strong> 주입<br />
          풀 생성자가 해당 풀에 hook 지정 — 이후 모든 swap/mint/burn이 hook 거침<br />
          결과: <strong>Uniswap을 플랫폼으로</strong> 활용한 무한 파생 AMM
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">10가지 Hook 포인트</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">IHooks 인터페이스 — 10개 Hook 포인트</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold mb-2">Initialize (2)</p>
              <p className="text-muted-foreground"><code>beforeInitialize(sender, key, sqrtPriceX96)</code></p>
              <p className="text-muted-foreground"><code>afterInitialize(sender, key, sqrtPriceX96, tick)</code></p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold mb-2">Liquidity (4)</p>
              <p className="text-muted-foreground"><code>beforeAddLiquidity(sender, key, params, hookData)</code></p>
              <p className="text-muted-foreground"><code>afterAddLiquidity(sender, key, params, delta, hookData)</code></p>
              <p className="text-muted-foreground"><code>beforeRemoveLiquidity(...)</code></p>
              <p className="text-muted-foreground"><code>afterRemoveLiquidity(...)</code></p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold mb-2">Swap (2)</p>
              <p className="text-muted-foreground"><code>beforeSwap(sender, key, params, hookData)</code></p>
              <p className="text-muted-foreground"><code>afterSwap(sender, key, params, delta, hookData)</code></p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold mb-2">Donate (2)</p>
              <p className="text-muted-foreground"><code>beforeDonate(...)</code></p>
              <p className="text-muted-foreground"><code>afterDonate(...)</code></p>
            </div>
          </div>
        </div>
        <p>
          <strong>5개 이벤트 × Pre/Post = 10개 hook 포인트</strong><br />
          Pre hook: 이벤트 차단·파라미터 검증·사전 처리<br />
          Post hook: 후속 처리·보상·알림
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Hook 활성화 플래그 — 주소 인코딩</h3>

        <HookAddressViz />

        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">Hook 주소 플래그 인코딩</p>
          <p className="text-sm text-muted-foreground mb-3">컨트랙트 주소의 상위 비트에 활성화 플래그 인코딩 — 각 bit가 hook 활성 여부 표시</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-3">
            <div className="bg-background rounded-md p-3 border border-border">
              <code className="text-xs font-mono">BEFORE_INITIALIZE_FLAG</code>
              <p className="text-muted-foreground mt-1">bit 159</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <code className="text-xs font-mono">AFTER_INITIALIZE_FLAG</code>
              <p className="text-muted-foreground mt-1">bit 158</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <code className="text-xs font-mono">BEFORE_ADD_LIQUIDITY_FLAG</code>
              <p className="text-muted-foreground mt-1">bit 157 ... (10개)</p>
            </div>
          </div>
          <div className="bg-background rounded-md p-3 border border-border text-sm">
            <p className="font-semibold mb-1">예시: beforeSwap + afterSwap 활성화</p>
            <p className="text-muted-foreground">상위 8비트 = <code>0000_1100</code> → CREATE2로 이 패턴의 주소 마이닝 후 배포</p>
          </div>
          <div className="bg-background rounded-md p-3 border border-border text-sm mt-2">
            <p className="font-semibold mb-1">validateHookAddress()</p>
            <p className="text-muted-foreground">주소의 플래그 비트와 실제 함수 selector 일치 여부 검증 — 불일치 시 revert</p>
          </div>
        </div>
        <p>
          <strong>주소 자체가 활성화 플래그</strong>: CREATE2로 원하는 주소 패턴 배포<br />
          이 설계로 <strong>런타임 hook 호출 비용 절감</strong> — 어떤 hook이 활성인지 mapping 조회 불필요<br />
          hook 주소 mining이 배포 시 필요 — 1회성 비용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 Hook 예시 — Dynamic Fee</h3>

        <DynamicFeeViz />
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">VolatilityFeeHook — 변동성 기반 수수료 조정</p>
          <div className="bg-background rounded-md p-3 border border-border text-sm mb-3">
            <p className="text-muted-foreground"><code>beforeSwap</code> hook에서 <code>computeVolatility(key)</code>로 최근 변동성 계산 후 수수료 동적 조정</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm mb-3">
            <div className="bg-red-50 dark:bg-red-950/30 rounded-md p-3 border border-red-200 dark:border-red-800 text-center">
              <p className="font-semibold text-red-700 dark:text-red-400">고변동성</p>
              <p className="text-muted-foreground">volatility &gt; 5%</p>
              <p className="font-semibold mt-1">1% (10000)</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 rounded-md p-3 border border-orange-200 dark:border-orange-800 text-center">
              <p className="font-semibold text-orange-700 dark:text-orange-400">중간</p>
              <p className="text-muted-foreground">volatility &gt; 2%</p>
              <p className="font-semibold mt-1">0.3% (3000)</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 rounded-md p-3 border border-green-200 dark:border-green-800 text-center">
              <p className="font-semibold text-green-700 dark:text-green-400">저변동성</p>
              <p className="text-muted-foreground">volatility &le; 2%</p>
              <p className="font-semibold mt-1">0.05% (500)</p>
            </div>
          </div>
          <div className="bg-background rounded-md p-3 border border-border text-sm">
            <p className="text-muted-foreground"><code>updateDynamicLPFee(key, newFee)</code>로 Pool에 새 수수료 적용 → <code>beforeSwap.selector</code> 반환</p>
          </div>
        </div>
        <p>
          <strong>Dynamic Fee</strong>: 시장 상황에 따라 수수료 실시간 조정<br />
          V3는 고정 4 tier — V4 hook은 무제한 유연성<br />
          LP 수익 최적화·변동성 대응 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 Hook 예시 — Onchain Limit Orders</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">LimitOrderHook — Onchain Limit Orders</p>
          <div className="bg-background rounded-md p-3 border border-border text-sm mb-3">
            <p className="font-semibold mb-1">Order 구조체</p>
            <p className="text-muted-foreground"><code>owner</code> (주소), <code>tick</code> (실행 가격), <code>amount</code> (수량) — <code>mapping(PoolId =&gt; mapping(int24 =&gt; Order[]))</code>에 저장</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold">afterSwap hook 동작</p>
              <div className="mt-2 space-y-1 text-muted-foreground">
                <p>1. <code>getSlot0(key.toId())</code>로 현재 tick 조회</p>
                <p>2. <code>lastTick</code>부터 <code>currentTick</code>까지 순회</p>
                <p>3. 해당 tick에 등록된 주문이 있으면 <code>fillLimitOrders(key, t)</code> 실행</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>Limit Order 구현</strong>: V4 이전엔 불가능했던 기능<br />
          CLOB(오더북) 없이 AMM 위에 limit order 레이어 추가<br />
          dydx 같은 별도 DEX 필요 없이 Uniswap 위에서 실현
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Hook의 가능성 — 예시 모음</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">Hook 종류</th>
                <th className="border border-border px-3 py-2 text-left">기능</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border px-3 py-2">TWAMM</td><td className="border border-border px-3 py-2">시간 가중 자동 매수 (대규모 주문 분할)</td></tr>
              <tr><td className="border border-border px-3 py-2">MEV Capture</td><td className="border border-border px-3 py-2">MEV를 LP에게 재분배</td></tr>
              <tr><td className="border border-border px-3 py-2">Oracle</td><td className="border border-border px-3 py-2">커스텀 TWAP/가격 피드 제공</td></tr>
              <tr><td className="border border-border px-3 py-2">Fee Rebate</td><td className="border border-border px-3 py-2">거래량 기반 수수료 할인</td></tr>
              <tr><td className="border border-border px-3 py-2">Range Manager</td><td className="border border-border px-3 py-2">자동 구간 재조정</td></tr>
              <tr><td className="border border-border px-3 py-2">KYC/Whitelist</td><td className="border border-border px-3 py-2">규제 준수 풀 (기관용)</td></tr>
              <tr><td className="border border-border px-3 py-2">Auction AMM</td><td className="border border-border px-3 py-2">경매 기반 가격 발견</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Uniswap을 "DEX 플랫폼"으로</p>
          <p>
            V4 Hooks는 Uniswap을 <strong>AMM → DEX 플랫폼</strong>으로 전환:
          </p>
          <p className="mt-2">
            <strong>V1-V3 관점</strong>: "우리가 만든 AMM 사용해" (단일 제품)<br />
            <strong>V4 관점</strong>: "우리 인프라 위에 AMM 만들어" (플랫폼)
          </p>
          <p className="mt-2">
            비유: Uniswap = iOS, Hooks = App Store<br />
            - 사용자는 한 곳에서 다양한 AMM 경험<br />
            - 개발자는 처음부터 AMM 안 만들어도 됨<br />
            - Uniswap은 플랫폼 수수료로 가치 포획
          </p>
          <p className="mt-2">
            <strong>리스크</strong>: 악의적 hook이 MEV 탈취·자금 유출 가능<br />
            대응: hook 감사 마켓플레이스, 커뮤니티 평가 시스템<br />
            풀 생성자가 hook 선택 책임 — 사용자는 풀 선택 시 hook 확인 필수
          </p>
        </div>

      </div>
    </section>
  );
}
