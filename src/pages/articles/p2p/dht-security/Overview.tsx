import AttackLandscapeViz from './viz/AttackLandscapeViz';
import EthDefenseViz from './viz/EthDefenseViz';
import DefenseLimitsViz from './viz/DefenseLimitsViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: DHT 공격 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          DHT는 공개 네트워크이므로 누구나 참여할 수 있다. 이것이 공격 표면이 된다.
          <br />
          주요 공격: Sybil(가짜 노드 대량 생성), Eclipse(특정 노드를 악성 피어로 포위).
        </p>
        <p>
          go-ethereum은 여러 방어를 구현한다:
          <br />
          <strong>IP 쿼터</strong> — 같은 /24 서브넷에서 버킷당 2개, 테이블 전체 10개까지만.
          <br />
          <strong>재검증</strong> — 죽은 노드를 빠르게 걸러내어 공격자가 테이블을 장악하기 어렵게.
          <br />
          <strong>Kademlia 자체 특성</strong> — 노드 ID가 제곱근적으로 분포하여 특정 영역 독점이 어려움.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">DHT Attack Landscape</h3>
      </div>
      <div className="not-prose mb-4"><AttackLandscapeViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">Ethereum의 방어 기법</h3>
      </div>
      <div className="not-prose mb-4"><EthDefenseViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">방어의 한계</h3>
      </div>
      <div className="not-prose mb-4"><DefenseLimitsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: DHT Security의 Trade-off</p>
          <p>
            <strong>완벽한 방어는 불가능</strong>:<br />
            - Open participation 원칙 vs 공격 저항<br />
            - Decentralization vs 강한 identity<br />
            - Performance vs overhead
          </p>
          <p className="mt-2">
            <strong>Ethereum의 접근</strong>:<br />
            ✓ Defense in depth (여러 layer)<br />
            ✓ Economic cost to attack (gas, infrastructure)<br />
            ✓ Monitoring & response<br />
            ✓ Gradual improvement
          </p>
          <p className="mt-2">
            <strong>장기 방향</strong>:<br />
            - Crypto-economic security (stake-based)<br />
            - ZK proofs of honest behavior<br />
            - TEE-attested routing
          </p>
        </div>

      </div>
    </section>
  );
}
