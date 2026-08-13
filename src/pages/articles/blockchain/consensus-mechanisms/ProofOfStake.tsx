import ExplainedFormula from "@/components/ui/explained-formula";
import PoSValidatorViz from "./viz/PoSValidatorViz";
import PoSFlowViz from "./viz/PoSFlowViz";

export default function ProofOfStake() {
  return (
    <section id="pos" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PoS는 stake-weighted message와 처벌 가능한 서명을 사용한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Validator는 stake와 signing key를 protocol state에 등록합니다. Protocol은
          검증 가능한 randomness와 state를 이용해 proposer·committee를 정하고,
          validator는 block과 fork-choice/finality 대상에 서명합니다. Stake가 많을수록
          장기적으로 더 큰 선택·vote weight를 갖지만, 가장 큰 validator가 매 slot의
          proposer가 되는 것은 아닙니다.
        </p>
      </div>

      <PoSValidatorViz />
      <ExplainedFormula
        question="Stake 10·20·30·40인 네 validator의 단순 weighted lottery 확률은?"
        idea="Toy lottery에서는 각 validator의 stake를 전체 effective stake로 나눈 비율을 한 번의 선택 확률로 둡니다. 실제 protocol은 committee sampling·effective-balance cap·randomness 규칙을 더합니다."
        formula={String.raw`P(i)=\frac{s_i}{\sum_j s_j}`}
        terms={[
          { symbol: "s_i", name: "validator stake", description: "Validator i에 protocol이 인정한 effective stake입니다." },
          { symbol: String.raw`\sum_j s_j`, name: "total stake", description: "해당 선택 집합에 참여한 전체 effective stake입니다." },
          { symbol: "P(i)", name: "selection probability", description: "Toy model에서 validator i가 선택될 확률입니다." },
        ]}
        assumptions={[
          "한 slot의 단순 stake-proportional sampling을 설명하는 toy model입니다.",
          "Key 수를 stake로 오인하지 않고 protocol version의 eligibility·randomness·committee rule을 별도 확인합니다.",
        ]}
        interpretation="합이 100이면 확률은 0.1, 0.2, 0.3, 0.4입니다. 40%는 장기 빈도의 기대값이지 다음 slot 당첨 보장이 아닙니다."
      />

      <PoSFlowViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Fork choice·finality·slashing은 같은 기능이 아닙니다</h3>
        <p>
          Fork choice는 최신 attestation weight를 이용해 현재 head를 고릅니다. Finality
          gadget은 checkpoint 사이의 충분한 stake vote로 history를 확정합니다. Slashing은
          같은 role·height에서 서로 모순되는 서명처럼 객관적으로 검증 가능한 위반 evidence에
          경제적 penalty를 연결합니다. Offline penalty와 slashing도 구분해야 합니다.
        </p>
        <p>
          Honest supermajority·network recovery·key custody·client implementation 같은 전제가
          깨지면 liveness나 safety가 달라집니다. “Stake가 비싸다”는 직관만으로 protocol
          safety를 증명할 수 없고, 어떤 message가 어떤 threshold를 충족했으며 어떤 conflicting
          evidence가 있었는지 trace로 검증해야 합니다.
        </p>
      </div>

      <div id="paper-gasper" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Fork choice와 finality 결합</p>
        <p className="mt-2 text-sm font-semibold">Combining GHOST and Casper</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 block-tree fork choice와 accountable finality gadget을 하나의 protocol로
          결합하는 것입니다. Honest stake·network timing·validator message 전제 아래 safety와
          liveness 성질을 분석합니다. 현재 Ethereum client의 모든 upgrade 규칙을 이 논문
          snapshot 하나로 대체할 수 있다는 뜻은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2003.03052" target="_blank" rel="noreferrer">Gasper 논문 보기</a>
      </div>

      <div id="paper-ethereum-pos-spec" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">규격 읽기 · 현재 PoS 동작</p>
        <p className="mt-2 text-sm font-semibold">Ethereum Proof-of-Stake Consensus Specifications</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          현재 client가 구현해야 할 state transition·fork choice·validator operation의 versioned
          정본입니다. 이 글은 역할과 이론을 설명하고, 실제 constant·fork epoch·handler는
          배포한 client와 stable specification version에 고정합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://ethereum.github.io/consensus-specs/" target="_blank" rel="noreferrer">현재 consensus specs 보기</a>
      </div>
    </section>
  );
}
