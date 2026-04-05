import FrobViz from './viz/FrobViz';
import UserFlowViz from './viz/UserFlowViz';
import JoinAdapterViz from './viz/JoinAdapterViz';
import DrawFlowViz from './viz/DrawFlowViz';
import CollateralRatioViz from './viz/CollateralRatioViz';

export default function VaultCdp() {
  return (
    <section id="vault-cdp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Vault (CDP) — 담보 예치 &amp; DAI 발행</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">CDP 개념 복습</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`Collateralized Debt Position:
  - 담보: 사용자가 예치하는 암호자산
  - 부채: 사용자가 발행하는 DAI
  - 항상: 담보 가치 > 부채 가치 × 안전 비율

// 예시
담보: 10 ETH × $3,000 = $30,000
부채: 15,000 DAI
담보 비율: 200% (최소 150% 필요)

// 청산 조건
담보 비율 < 150% → 청산 대상`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Vat.frob() — 핵심 함수</h3>

        <FrobViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Vault State Modify (single function)
function frob(
    bytes32 i,   // Ilk (예: "ETH-A")
    address u,   // Vault 소유자
    address v,   // 담보 제공자
    address w,   // DAI 수신자
    int256 dink, // 담보 변화 (+추가, -회수)
    int256 dart  // 부채 변화 (+발행, -상환)
) external {
    Urn memory urn = urns[i][u];
    Ilk memory ilk = ilks[i];

    // 1) 상태 업데이트
    urn.ink = _add(urn.ink, dink);
    urn.art = _add(urn.art, dart);
    ilk.Art = _add(ilk.Art, dart);

    // 2) 부채 한도 체크
    int dtab = _mul(ilk.rate, dart);
    require(
        dart <= 0 || _mul(urn.art, ilk.rate) <= _mul(urn.ink, ilk.spot),
        "not-safe"
    );

    // 3) dust 체크 (최소 부채)
    require(urn.art == 0 || _mul(urn.art, ilk.rate) >= ilk.dust, "dust");

    // 4) line (총 한도) 체크
    require(ilk.Art * ilk.rate <= ilk.line, "ceiling-exceeded");

    // 5) 토큰 이동
    gem[i][v] = _sub(gem[i][v], dink);  // 담보 차감
    dai[w] = _add(dai[w], dtab);         // DAI 증가
}`}</pre>
        <p>
          <strong>단일 함수로 모든 Vault 상호작용</strong>: add/remove collateral + draw/repay debt<br />
          signed integer 사용 — 양수/음수로 방향 구분<br />
          4가지 체크: safe, dust, ceiling, balance
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">dsproxy - 사용자 인터페이스</h3>

        <UserFlowViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Vat.frob()은 저수준 API — 사용자 직접 호출 어려움
// DSProxy + DssProxyActions가 고수준 래퍼

function openLockETHAndDraw(
    address manager,       // CDP manager
    address jug,           // 이자율 모듈
    address ethJoin,       // ETH 어댑터
    address daiJoin,       // DAI 어댑터
    bytes32 ilk,           // "ETH-A"
    uint256 wadD           // DAI 발행량
) external payable returns (uint256 cdp) {
    cdp = manager.open(ilk, address(this));  // 1) Vault 오픈
    lockETH(manager, ethJoin, cdp);          // 2) ETH 예치
    _draw(manager, jug, daiJoin, cdp, wadD); // 3) DAI 발행
}

// 사용자는 1 트랜잭션으로 전체 흐름 완료
// DSProxy가 모든 low-level 호출 담당`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">담보 예치 — ethJoin.join()</h3>

        <JoinAdapterViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 각 담보 자산마다 Join 어댑터 존재
// ETH는 WETH로 wrapping 필요

contract ETHJoin {
    function join(bytes32 urn, uint256 wad) external payable {
        require(msg.value == wad, "amount-mismatch");
        require(int256(wad) >= 0, "overflow");

        WETH(gem).deposit{value: wad}();  // ETH → WETH

        // Vat에 담보 등록
        vat.slip(ilk, urn, int256(wad));
    }

    function exit(address usr, uint256 wad) external {
        // Vat에서 담보 차감
        vat.slip(ilk, msg.sender, -int256(wad));

        WETH(gem).withdraw(wad);  // WETH → ETH
        payable(usr).transfer(wad);
    }
}

// USDC, WBTC 등은 GemJoin 사용 (generic ERC20 어댑터)`}</pre>
        <p>
          <strong>Join 어댑터 패턴</strong>: 각 담보 자산을 Vat 내부 표현으로 변환<br />
          ETH → WETH, USDC → 내부 gem 단위 등<br />
          decimals 차이도 Join에서 처리 (WBTC 8 → 내부 18)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">DAI 발행 — Draw</h3>

        <DrawFlowViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Draw = 부채 증가 (Vat.frob with positive dart)

function draw(
    address manager, address jug, address daiJoin,
    uint256 cdp, uint256 wad
) public {
    address urn = manager.urns(cdp);
    address vat = manager.vat();
    bytes32 ilk = manager.ilks(cdp);

    // 1) 이자 갱신 (최신 rate 반영)
    jug.drip(ilk);

    // 2) frob으로 DAI 발행 (internal balance)
    manager.frob(cdp, 0, _getDrawDart(vat, jug, urn, ilk, wad));

    // 3) move로 DAI를 사용자 address로 이동
    manager.move(cdp, address(this), toRad(wad));

    // 4) daiJoin.exit으로 ERC20 DAI 출금
    if (vat.can(address(this), address(daiJoin)) == 0) {
        vat.hope(daiJoin);
    }
    DaiJoinLike(daiJoin).exit(msg.sender, wad);
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">담보 비율 계산</h3>

        <CollateralRatioViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Collateralization Ratio 계산
collateralValue = urn.ink × spot / RAY
debt = urn.art × ilk.rate / RAY

collateralizationRatio = collateralValue / debt

// 예시
urn.ink = 10 ETH
spot = 2000 (min ETH price for liquidation safety)
urn.art = 15,000 DAI
ilk.rate = 1.05 (5% 이자 누적)

collateralValue = 10 × 2000 = $20,000
debt = 15,000 × 1.05 = $15,750

ratio = 20,000 / 15,750 = 127% → 청산 대상 (150% 미만)`}</pre>
        <p>
          <strong>spot ≠ 시장 가격</strong>: spot = marketPrice / liquidationRatio<br />
          150% 비율 ETH-A: spot = ETH가격 / 1.5<br />
          spot × ink ≥ art × rate 체크 — 안전 조건
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Vat의 우아한 설계</p>
          <p>
            Vat.frob()는 <strong>DeFi 역사상 가장 범용적인 함수</strong>:<br />
            - 담보 추가/회수<br />
            - 부채 증가/상환<br />
            - 다른 사용자에게 부채 이전<br />
            - Vault 확대/축소
          </p>
          <p className="mt-2">
            <strong>하나의 함수 + signed integer = 모든 조작</strong>
          </p>
          <p className="mt-2">
            이 설계의 효과:<br />
            ✓ 감사 단순 (단일 진입점)<br />
            ✓ 가스 효율 (여러 operation 조합 가능)<br />
            ✓ 확장성 (새 기능은 외부 래퍼로 추가)
          </p>
          <p className="mt-2">
            Maker 코드는 <strong>"mathematical rigor"</strong> 유명 — 모든 연산이 정수 수학<br />
            Vat는 이 철학의 결정체
          </p>
        </div>

      </div>
    </section>
  );
}
