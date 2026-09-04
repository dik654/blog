import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ContextViz from "./viz/ContextViz";
import ConsensusOverviewViz from "./viz/ConsensusOverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PoW와 PoS는 ‘합의 방식’ 한 칸짜리 옵션이 아니라 영향력의 비용을 정하는 장치다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          공개 네트워크에서는 한 사람이 node identity를 천 개 만들 수 있습니다. 따라서 “node 한 개에 표 한 장”을 그대로 주면 Sybil 공격으로 투표를 장악할 수
          있습니다. Proof of Work(PoW)는 영향력을 hash work에 연결하고 Proof of Stake(PoS)는 protocol에 잠긴 stake와 서명 책임에
          연결합니다. 출발점은 둘 다 같습니다. 정체성 수가 아니라 희소 자원으로 proposal·vote weight를 제한하는 것입니다.
        </p>
        <p>
          하지만 Sybil resistance만으로 consensus가 완성되지는 않습니다. Valid block을 판정할 state-transition rule이 있어야 하고 동시에 생긴
          branch 중 어느 쪽을 head로 볼지 고르는 fork choice가 필요합니다. history를 더는 뒤집지 않겠다고 선을 긋는 finality rule, 참여자가
          protocol을 어겼을 때의 penalty와 recovery도 마찬가지입니다.
        </p>
        <p>
          Process·timing·failure와 safety/liveness는{" "}
          <Link to="/blockchain/distributed-systems">분산 시스템 기초</Link>, 고정 membership
          의 log agreement는 <Link to="/blockchain/smr-theory">SMR</Link>, Byzantine quorum
          proof는 <Link to="/blockchain/bft-theory">BFT 이론</Link>에서 가져옵니다. 이 글은
          permissionless membership에서 PoW·PoS가 그 원리를 어떻게 조합하는지를 다룹니다.
        </p>
      </div>

      <ContentBoundary article="consensus-mechanisms" />
      <ContextViz />
      <ConsensusOverviewViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Fork choice와 finality를 먼저 분리합니다</h3>
        <p>
          Fork choice는 온라인 rule입니다. 지금까지 관찰한 valid message만 보고 어느 block을 head로 볼지 정합니다. 새 block이나 vote가 오면
          head가 바뀔 수 있습니다. Finality는 그보다 강한 판단입니다. 특정 checkpoint보다 앞선 history는 protocol 가정 아래 되돌아가지 않는다고 봅니다.
          PoW의 confirmation depth는 reorg 위험이 낮아지는 probabilistic 정책이고 PoS protocol은 충분한 stake vote로 explicit
          finality를 제공할 수 있습니다.
        </p>
        <p>
          같은 “확정”이라는 말을 쓰더라도 근거가 되는 evidence는 다릅니다. 그래서 receipt에 head root와 finalized root, 관찰 시점, client/spec
          version을 따로 남깁니다. Head가 바뀐 것을 conflicting finality로 오인해서는 안 됩니다. finality가 없다는 이유로 valid head 선택까지
          실패했다고 판단해서도 안 됩니다.
        </p>
      </div>
    </section>
  );
}
