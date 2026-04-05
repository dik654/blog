import CometPackedViz from './viz/CometPackedViz';
import UserBasicPackedViz from './viz/UserBasicPackedViz';
import AccrueInternalViz from './viz/AccrueInternalViz';
import KinkModelViz from './viz/KinkModelViz';

export default function CometArchitecture() {
  return (
    <section id="comet-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Comet 컨트랙트 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <CometPackedViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Comet 주요 상태</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`contract Comet is CometMainInterface {
    // Base asset 정보 (immutable)
    address public immutable baseToken;
    address public immutable baseTokenPriceFeed;
    uint64 public immutable baseScale;

    // Supply/Borrow 이자율
    uint64 public immutable supplyKink;
    uint64 public immutable supplyPerSecondInterestRateSlopeLow;
    uint64 public immutable supplyPerSecondInterestRateSlopeHigh;
    uint64 public immutable supplyPerSecondInterestRateBase;
    // Borrow도 동일 구조

    // 누적 이자 indexes
    uint64 internal baseSupplyIndex_;
    uint64 internal baseBorrowIndex_;
    uint40 internal lastAccrualTime_;

    // 총 잔액
    uint104 public totalSupplyBase;
    uint104 public totalBorrowBase;

    // 사용자 계정
    mapping(address => UserBasic) internal userBasic;
    mapping(address => mapping(address => UserCollateral)) internal userCollateral;
}

struct UserBasic {
    int104 principal;           // base asset balance (signed)
    uint64 baseTrackingIndex;
    uint64 baseTrackingAccrued;
    uint16 assetsIn;            // 담보 자산 bitmap
    uint8 _reserved;
}

struct UserCollateral {
    uint128 balance;
    uint128 _reserved;
}`}</pre>
        <p>
          <strong>principal은 signed int</strong>: 양수=예치, 음수=차입<br />
          한 address가 동시 supply·borrow 불가 — 부호로 상태 구분<br />
          <code>assetsIn</code> bitmap: 어떤 담보 자산 보유 중인지 O(1) 조회
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">packed storage 최적화</h3>

        <UserBasicPackedViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// UserBasic 구조체 layout
struct UserBasic {
    int104 principal;           // 13 bytes
    uint64 baseTrackingIndex;   // 8 bytes
    uint64 baseTrackingAccrued; // 8 bytes
    uint16 assetsIn;            // 2 bytes
    uint8 _reserved;            // 1 byte
}
// Total: 32 bytes = 1 storage slot

// 한 SLOAD로 전체 사용자 상태 조회
// 가스: 2,100 (cold) / 100 (warm)`}</pre>
        <p>
          <strong>1 slot = 1 SLOAD</strong>: 사용자 상태 조회 가스 최소화<br />
          int104로 base asset 표현 — USDC 최대 10^31 (충분)<br />
          uint64 index — 시간에 따른 이자 누적 추적
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">supply() — base asset 공급</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function supply(address asset, uint amount) external {
    if (asset == baseToken) {
        _supplyBase(msg.sender, msg.sender, amount);
    } else {
        _supplyCollateral(msg.sender, msg.sender, asset, safe128(amount));
    }
}

function _supplyBase(address from, address dst, uint amount) internal {
    accrueInternal();  // 이자 누적 갱신

    doTransferIn(baseToken, from, amount);

    int104 dstPrincipal = userBasic[dst].principal;
    int256 dstBalance = presentValue(dstPrincipal) + signed256(amount);

    int104 dstPrincipalNew = principalValue(dstBalance);
    updateBasePrincipal(dst, userBasic[dst], dstPrincipalNew);

    // 부채 감소 or 예치 증가
    // (principal이 signed이므로 같은 함수로 처리)
}`}</pre>
        <p>
          <strong>accrueInternal()</strong>: 이자 index 업데이트 먼저<br />
          <strong>presentValue/principalValue</strong>: index 곱/나눔으로 변환<br />
          양수 principal → 이자 받음, 음수 → 이자 지불
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">이자 누적 — accrueInternal()</h3>

        <AccrueInternalViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function accrueInternal() internal {
    uint40 now_ = getNowInternal();
    uint timeElapsed = uint(now_ - lastAccrualTime_);
    if (timeElapsed == 0) return;

    uint utilization = getUtilization();
    uint supplyRate = getSupplyRate(utilization);
    uint borrowRate = getBorrowRate(utilization);

    // 복리 근사 (linear for short intervals)
    baseSupplyIndex_ = mulFactor(baseSupplyIndex_, (FACTOR_SCALE + supplyRate * timeElapsed));
    baseBorrowIndex_ = mulFactor(baseBorrowIndex_, (FACTOR_SCALE + borrowRate * timeElapsed));

    lastAccrualTime_ = now_;
}

function getUtilization() public view returns (uint) {
    if (totalSupplyBase == 0) return 0;
    return totalBorrowBase * FACTOR_SCALE / totalSupplyBase;
}`}</pre>
        <p>
          <strong>lazy accrual</strong>: 사용자 상호작용 시에만 index 갱신<br />
          Gas 효율 — 매 블록 업데이트하지 않음<br />
          Utilization은 totalBorrowBase / totalSupplyBase — 단순 계산
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">이자율 곡선 — Kink 모델</h3>

        <KinkModelViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function getBorrowRate(uint utilization) external view returns (uint64) {
    if (utilization <= borrowKink) {
        // Low utilization: 완만한 기울기
        return borrowPerSecondInterestRateBase
            + mulFactor(borrowPerSecondInterestRateSlopeLow, utilization);
    } else {
        // High utilization: 가파른 기울기
        return borrowPerSecondInterestRateBase
            + mulFactor(borrowPerSecondInterestRateSlopeLow, borrowKink)
            + mulFactor(borrowPerSecondInterestRateSlopeHigh,
                        utilization - borrowKink);
    }
}

// Comet USDC 파라미터
borrowKink: 90%
borrowBase: 0.015 (1.5%/year)
borrowSlopeLow: 0.0333 (at kink: 1.5% + 3% = 4.5%)
borrowSlopeHigh: 2.0 (at 100%: 4.5% + 20% = 24.5%)

supplyKink: 90%
supplyBase: 0%
supplySlopeLow: 0.0366 (at kink: 3.3%)
supplySlopeHigh: 1.72 (at 100%: 3.3% + 17.2% = 20.5%)`}</pre>
        <p>
          <strong>Aave와 유사한 kink 모델</strong>: 최적점 근처 완만, 초과 시 급격<br />
          Supply rate &lt; Borrow rate — 프로토콜이 spread 획득<br />
          Spread = Treasury(reserve factor 역할)
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Compound V3의 엔지니어링 철학</p>
          <p>
            "Do less, do it well" — <strong>기능 최소화로 완성도 극대화</strong>
          </p>
          <p className="mt-2">
            선택한 것:<br />
            ✓ Packed storage (가스 최적화)<br />
            ✓ 단일 base asset (복잡도 제거)<br />
            ✓ Lazy accrual (필요할 때만 계산)<br />
            ✓ Immutable 설정 (배포 후 변경 없음)
          </p>
          <p className="mt-2">
            포기한 것:<br />
            ✗ 다중 차입 자산<br />
            ✗ Stable borrow rate 옵션<br />
            ✗ aToken-style ERC20 (대신 단일 계정 상태)
          </p>
          <p className="mt-2">
            이 trade-off가 <strong>"보수적 안정성"</strong> 브랜딩<br />
            기관·고빈도 사용자에게 어필 — "믿을 수 있는 단순함"
          </p>
        </div>

      </div>
    </section>
  );
}
