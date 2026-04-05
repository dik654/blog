import GaugeViz from './viz/GaugeViz';
import BoostCalculatorViz from './viz/BoostCalculatorViz';
import CurveWarsViz from './viz/CurveWarsViz';

export default function GaugeCrv() {
  return (
    <section id="gauge-crv" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Gauge · CRV · veTokenomics</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Curve의 경제 모델 요약</h3>

        <GaugeViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">LiquidityGauge — 보상 분배</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 각 풀마다 Gauge 컨트랙트 배포
contract LiquidityGauge {
    address public lp_token;          // 이 gauge가 관리하는 LP 토큰
    mapping(address => uint256) public balanceOf;  // 사용자별 스테이킹 양
    uint256 public totalSupply;

    uint256 public inflation_rate;     // CRV 분배 속도
    uint256 public future_epoch_time;

    function deposit(uint256 _value) external {
        _update(msg.sender);
        balanceOf[msg.sender] += _value;
        totalSupply += _value;
        IERC20(lp_token).transferFrom(msg.sender, self, _value);
    }

    function claimable_tokens(address addr) external view returns (uint256) {
        // 사용자가 받을 CRV 계산 (boost 포함)
        // ...
    }
}`}</pre>
        <p>
          <strong>2단계 스테이킹</strong>: Pool에 유동성 예치 → LP Token → Gauge에 스테이킹<br />
          Gauge 스테이킹 없으면 CRV 보상 없음 (수수료만 받음)<br />
          LP는 수수료 + CRV 보상 이중 수익
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">veCRV — Vote Escrowed CRV</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// CRV 잠금 → veCRV 수령 (non-transferable)
contract VotingEscrow {
    struct LockedBalance {
        int128 amount;   // 잠긴 CRV 양
        uint256 end;     // 해제 시점
    }

    mapping(address => LockedBalance) public locked;

    // 잠금 기간에 비례하여 voting power 부여
    function balanceOf(address addr) external view returns (uint256) {
        LockedBalance memory l = locked[addr];
        if (l.end <= block.timestamp) return 0;

        // voting power는 시간 경과에 따라 감소
        uint256 timeLeft = l.end - block.timestamp;
        return uint256(l.amount) * timeLeft / MAXTIME;
    }
}

// MAXTIME = 4 years
// 예: 1000 CRV × 4년 잠금 = 1000 veCRV
//     1000 CRV × 1년 잠금 = 250 veCRV`}</pre>
        <p>
          <strong>잠금 기간 비례</strong>: 더 오래 잠글수록 더 많은 voting power<br />
          최대 4년 — 이후 선형 감소<br />
          <strong>NFT도 transferable도 아님</strong> — 진지한 장기 홀더만
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Gauge Weight Voting</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// veCRV 보유자가 각 gauge의 CRV 할당 비율 투표
contract GaugeController {
    mapping(address => mapping(address => VotedSlope)) public vote_user_slopes;

    function vote_for_gauge_weights(address gauge_addr, uint256 user_weight) external {
        // user_weight: 0 ~ 10000 (0% ~ 100%)
        // 이 사용자의 voting power 중 몇 %를 이 gauge에 할당할지

        // 여러 gauge에 분산 투표 가능 (합이 10000 이하)
    }

    // 각 gauge의 weight = Σ (사용자 vote × 해당 사용자 veCRV balance)
    function gauge_relative_weight(address addr) external view returns (uint256);
}

// 주간 CRV emission 분배
weekly_crv = 7 days × inflation_rate
gauge_crv[i] = weekly_crv × gauge_relative_weight[i]`}</pre>
        <p>
          <strong>거버넌스 토큰의 실질적 가치</strong>: CRV 분배 방향 결정<br />
          프로젝트들이 "자신의 gauge에 veCRV 투표" 얻기 위해 경쟁<br />
          → <strong>Curve Wars</strong> 발생
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Boost — LP 수익 증폭</h3>

        <BoostCalculatorViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// veCRV 보유자는 자신의 LP 보상을 boost 받음
// boost = min(2.5x, 1 + 1.5 × (veCRV / total_veCRV) / (LP_staked / total_LP))

// 예시
Alice: 10 veCRV (전체의 0.1%), 100 LP (전체의 1%)
boost = 1 + 1.5 × 0.1% / 1% = 1.15x  (15% 더)

Bob: 100 veCRV (1%), 100 LP (1%)
boost = 1 + 1.5 × 1% / 1% = 2.5x (MAX)

Charlie: 0 veCRV, 100 LP
boost = 1.0x (base)

// 결과: Bob은 Charlie보다 2.5배 더 많은 CRV 수령`}</pre>
        <p>
          <strong>Boost는 최대 2.5배</strong>: veCRV / LP 비율에 비례<br />
          veCRV 많으면 → 작은 LP로도 높은 보상<br />
          LP 많은데 veCRV 없으면 → base 보상만
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Curve Wars & Bribes</h3>

        <CurveWarsViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 프로젝트가 자신의 풀에 유동성 유치하려면 CRV 보상 필요
// CRV 보상은 veCRV 보유자의 투표로 결정
// → 프로젝트가 veCRV 매수 or "bribes(뇌물)" 제공

문제:
- 프로젝트가 CRV 직접 매수 → 비효율 (시장가 비쌈)
- Convex Finance: CRV 모아서 투표 대행 서비스
- 프로젝트는 Convex에 bribes → Convex가 투표 → 보상 유도

Convex(cvxCRV):
- CRV → cvxCRV 전환 (lock 대신)
- 모은 CRV로 max lock 후 투표
- veCRV 투표권 80%+ 독점

bribes 시장 (Votium, Hidden Hand):
- 프로젝트: "내 gauge에 투표해주면 BAL 토큰 1000개 줌"
- cvxCRV 보유자: 투표 후 bribes 수령`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: veTokenomics의 혁신과 한계</p>
          <p>
            <strong>혁신</strong>:<br />
            ✓ "토큰 매도" 대신 "토큰 잠금" 유도 → 공급 압력 감소<br />
            ✓ 거버넌스 참여자 = 장기 이해관계자<br />
            ✓ LP 보상 + 거버넌스가 자연스럽게 결합
          </p>
          <p className="mt-2">
            <strong>한계</strong>:<br />
            ✗ 거버넌스 집중화 (Convex 80% 독점)<br />
            ✗ Bribes 시장으로 거버넌스 자본화 (메타거버넌스)<br />
            ✗ 4년 잠금의 유동성 비용 — meta-token (cvxCRV, sdCRV) 등장
          </p>
          <p className="mt-2">
            <strong>영향</strong>: 많은 DeFi 프로토콜이 ve 모델 채택<br />
            - Balancer → veBAL<br />
            - Frax → veFXS<br />
            - Aura → vlAURA (Balancer 버전)
          </p>
          <p className="mt-2">
            veTokenomics는 <strong>"토큰 디자인의 중요 혁신"</strong> — 장단점 모두 계승
          </p>
        </div>

      </div>
    </section>
  );
}
