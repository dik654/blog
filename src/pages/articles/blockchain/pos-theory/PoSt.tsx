import PoStFlowViz from "./viz/PoStFlowViz";

export default function PoSt() {
  return (
    <section id="post" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PoSt는 fresh challenge와 proving window를 시간축 receipt로 잇는다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Proof of Spacetime은 provider가 committed data를 한 시점에만
          encoding했다는 PoRep evidence에서 더 나아갑니다. 여러 time window의
          storage obligation을 만족했는지까지 검증합니다.
        </p>
        <p>
          Chain이 fresh randomness로 challenged sectors를 정하면 prover는
          commitments의 response를 deadline 안에 제출합니다. Accepted proof
          sequence는 active storage power와 fault lifecycle에 연결됩니다.
        </p>
      </div>
      <PoStFlowViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Winning과 Window 역할을 이름만으로 섞지 않습니다</h3>
        <p>
          Filecoin에는 proof 경로가 둘 있습니다. 하나는 block production
          eligibility와 관련된 경로, 다른 하나는 committed storage 전체를
          주기적으로 audit하는 경로입니다.
        </p>
        <p>
          Sampling과 deadline, partition, fault와 recovery 규칙은 현재 network
          version의 actor·proof specification에서 확인합니다. 오래된 문서의
          기간·sector 수·penalty를 현재 operation에 그대로 적용하지 않습니다.
        </p>
        <h3>한 번의 PASS와 기간 전체 보장을 구분합니다</h3>
        <p>
          Receipt에는 chain epoch/window와 randomness domain·digest, eligible
          sector snapshot과 challenge set을 남깁니다. Proof parameter와
          submission inclusion, verification result도 함께 기록합니다.
        </p>
        <p>
          Missing, invalid, late와 reorged proof는 서로 다른 상태입니다. Node
          restart 뒤 chain state와 local job state를 맞춰야 중복 제출과 누락된
          fault recovery를 막을 수 있습니다.
        </p>
        <p>
          그러려면 proof를 만들기 전에 stable proof/job ID와 submit intent를
          durable store에 먼저 남깁니다. 생성된 proof digest와 transaction ID는
          같은 record에 추가합니다.
        </p>
        <p>
          Restart 뒤에는 chain inclusion을 다시 조회해 pending, included와
          reorged 상태를 맞춥니다. 같은 ID의 재제출은 중복 제거하고, deadline을
          넘긴 job은 late 상태와 원인을 그대로 보존합니다.
        </p>
        <h3>채택 검사는 proof와 retrieval을 서로 다른 oracle로 봅니다</h3>
        <p>
          Base와 candidate에는 같은 data와 replica identity, parameter version,
          sector snapshot, randomness와 challenge를 줍니다. 정상 경로와 함께
          손상 block, missing sector, stale randomness와 wrong replica ID를
          시험합니다. Restart와 reorg도 따로 반복합니다.
        </p>
        <p>
          False acceptance 0건과 valid proof parity, deadline 내 복구는 hard
          gate입니다. Retrieval success rate와 p95는 별도 service gate에 둡니다.
          실패하면 이전 binary·parameter·job schema로 돌아갈 수 있어야 합니다.
        </p>
      </div>
      <div
        id="paper-filecoin-post-spec"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          현재 proof 역할, 규격으로 읽기
        </p>
        <p className="mt-2 text-sm font-semibold">
          Filecoin Proofs documentation and specification
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          provider가 unique copy를 만들었고 계속 저장한다는 claim을 network가
          검증하는 것이 문제입니다. 여기서는 PoRep sealing과 PoSt lifecycle의
          현재 역할을 설명합니다. Retrieval SLO·privacy·geographic redundancy가
          자동으로 보장되지도 않고 모든 actor constant를 이 글에 고정하지도
          않습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://docs.filecoin.io/core-concepts/filecoin-virtual-machine/proofs"
          target="_blank"
          rel="noreferrer"
        >
          Filecoin proofs 공식 문서 보기
        </a>
      </div>
    </section>
  );
}
