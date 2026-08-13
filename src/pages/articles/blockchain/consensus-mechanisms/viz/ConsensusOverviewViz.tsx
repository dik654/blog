import {
  DistributedFrame,
  Ledger,
} from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function ConsensusOverviewViz() {
  return (
    <DistributedFrame
      eyebrow="비교 축"
      title="PoW와 PoS는 같은 단위의 숫자 하나로 비교할 수 없다"
      description="TPS나 평균 block time 하나가 아니라 비용 자산·fork choice·finality·failure oracle을 같은 workload에서 비교합니다."
      note="BFT voting은 별도 정본에서 다룹니다. 여기서는 permissionless membership에 자원 비용을 연결하는 PoW·PoS를 비교합니다."
    >
      <Ledger
        columns={2}
        items={[
          { label: "PoW", title: "계산 자원으로 영향력 제한", body: "Hash target을 만족한 proof를 누구나 검증하고 cumulative work가 큰 branch를 선택합니다.", example: "cost asset = hash work · finality = confirmation depth" },
          { label: "PoS", title: "경제적 stake로 영향력 제한", body: "Stake-weighted proposer·attester가 vote하고, equivocation에는 slashing 가능한 evidence를 남깁니다.", example: "cost asset = bonded stake · finality = protocol checkpoint" },
          { label: "공통", title: "Fork choice와 finality 분리", body: "현재 head를 고르는 rule과 이미 확정된 history를 되돌리지 않는 rule은 같은 것이 아닙니다.", example: "head update ≠ finalized checkpoint" },
          { label: "평가", title: "같은 failure schedule에서 측정", body: "Reorg depth, conflicting finality, recovery time, resource cost와 participation concentration을 함께 기록합니다.", example: "same binary · config · membership · fault trace" },
        ]}
      />
    </DistributedFrame>
  );
}
