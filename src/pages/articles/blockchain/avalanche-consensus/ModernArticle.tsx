import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import {
  AvalancheDecisionBoundaryViz,
  AvalancheImplementationBoundaryViz,
  AvalanchePollUpdatePseudocodeViz,
  AvalanchePollTraceViz,
} from "./viz/ModernAvalancheConsensusViz";

export default function ModernAvalancheConsensusArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Avalanche Snow 상세</p>
          <h2 className="text-3xl font-bold tracking-tight">다섯 명에게 물은 결과가 어떻게 한 노드의 결정으로 쌓일까요?</h2>
        </header>
        <p className="text-lg font-semibold leading-8 text-foreground/90">
          작은 표본에서 같은 후보가 충분히 자주, 그리고 연속해서 우세한지를 반복해 묻고 그 기억을 쌓으면 한 노드의 결정에 도달합니다.
        </p>
        <p className="text-lg leading-8 text-foreground/90">
          같은 자금을 쓰는 block A와 B가 동시에 보였다고 하겠습니다. 노드는 전체 validator에게 한 번에 투표를 받지 않습니다. 작은 표본을 반복해서 뽑고, 같은 후보가 threshold를 넘었는지에 따라 <code>preference</code>와 <code>confidence</code>를 바꿉니다. 아래 그림은 A를 선호하던 한 노드가 B 표본을 여러 번 관찰해 B를 local decision으로 만드는 과정을 끝까지 추적합니다.
        </p>

        <AvalanchePollTraceViz />

        <p>
          이 글의 작은 수치는 상태 차이를 보이기 위한 설명용 예입니다. <code>k=5</code>, <code>alphaPreference=3</code>, <code>alphaConfidence=4</code>, <code>beta=3</code>은 AvalancheGo v1.14.2의 parameter 제약 <code>K/2 &lt; AlphaPreference ≤ AlphaConfidence ≤ K</code>를 만족합니다. 같은 릴리스의 기본값은 20·15·15·20입니다.
        </p>
        <p>
          여기서 가장 중요한 구분은 한 poll의 성공, 한 노드의 local decision, network 전체의 probabilistic safety가 서로 다른 사건이라는 점입니다. 이 글은 Snow family의 상태 전이와 AvalancheGo v1.14.2의 고정 코드만 설명합니다. 특정 network의 finality 시간이나 처리량은 다루지 않습니다.
        </p>
      </section>

      <section id="sampling-poll" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">01 · 한 번의 표본</p>
          <h2 className="break-keep text-2xl font-bold">같은 표를 보고도 선호 후보와 연속 횟수가 다르게 바뀌는 이유는 무엇일까요?</h2>
        </header>
        <p>
          AvalancheGo v1.14.2에는 하나의 <code>alpha</code>가 아니라 두 threshold가 있습니다. 같은 choice가 <code>AlphaPreference</code> 이상이면 내부 preference를 바꿀 수 있고, <code>AlphaConfidence</code> 이상이어야 연속 confidence를 올립니다.
        </p>
        <p>
          따라서 B가 3표를 얻은 세 번째 장면에서는 preference는 바뀌지만 confidence는 0입니다. 응답이 늦은 validator는 자동으로 반대 vote가 되지 않습니다. 집계된 수가 threshold에 못 미치면 unsuccessful poll처럼 counter가 초기화됩니다.
        </p>

        <ExplainedFormula
          question="N명 중 F명이 Byzantine일 때 k명 표본에 Byzantine validator가 alpha명 이상 들어올 한 번의 확률은 얼마일까요?"
          idea={<>균일하게 k명을 복원 없이 뽑는 설명용 모델에서는 hypergeometric distribution의 tail을 더합니다. N=100, F=20, k=5, alpha=4이면 약 0.00535, 즉 0.535%입니다. 이 값은 한 poll의 표본 구성만 말합니다.</>}
          formula={String.raw`P[X\ge\alpha]=\sum_{i=\alpha}^{\min(k,F)}\frac{\binom Fi\binom{N-F}{k-i}}{\binom Nk}`}
          annotatedFormula={String.raw`P[X\ge\alpha]=\underbrace{\sum_{i=\alpha}^{\min(k,F)}}_{\text{alpha명 이상인 경우}}\frac{\underbrace{\binom Fi}_{\text{Byzantine i명}}\underbrace{\binom{N-F}{k-i}}_{\text{나머지는 정직}}}{\underbrace{\binom Nk}_{\text{가능한 모든 표본}}}`}
          operations={[
            { expression: String.raw`\sum_{i=4}^{5}`, annotation: ["N=100·F=20·k=5·alpha=4", "i=4와 5인 경우만 더함", "한 poll의 표본 구성"] },
            { expression: String.raw`\binom{20}{i}\binom{80}{5-i}`, annotation: ["Byzantine 집합에서 i명", "정직한 집합에서 나머지", "복원 없는 조합 수"] },
            { expression: String.raw`P\approx0.005354`, annotation: ["약 0.535%", "반복 poll의 독립성은 별도", "network conflict 확률이 아님"] },
          ]}
          terms={[
            { symbol: "N", name: "Validator population", description: "같은 membership snapshot에서 표본을 뽑는 전체 대상 수입니다." },
            { symbol: "F", name: "Faulty population", description: "그 snapshot에서 adversary가 통제한다고 둔 validator 수입니다." },
            { symbol: "k", name: "Sample size", description: "한 poll에서 뽑아 응답을 묻는 validator 수입니다." },
            { symbol: String.raw`\alpha`, name: "Threshold", description: "이 확률식에서 위험 표본으로 세기 위한 faulty validator 수입니다." },
            { symbol: "X", name: "Faulty sample count", description: "뽑힌 k명 안에 들어온 Byzantine validator 수입니다." },
          ]}
          assumptions={[
            "Validator를 같은 확률로, 복원 없이 뽑는 단순 모델입니다.",
            "실제 stake-weighted sampler에는 weight 분포에 맞는 모델이 필요합니다.",
            "Membership과 F는 한 poll 동안 고정되어 있다고 둡니다.",
            "Eclipse, correlated seeds, omission과 adaptive response는 포함하지 않습니다.",
          ]}
          interpretation="한 poll의 tail이 작아도 같은 peer만 되풀이해 뽑거나 공격자가 sampling 경로를 편향시키면 반복 실행의 전제가 깨집니다. 이 수치를 그대로 최종 상충 결정 확률로 읽으면 안 됩니다."
        />

        <div id="paper-avalanchego-parameters">
          <CitationBlock source="AvalancheGo v1.14.2 · snowball/parameters.go" citeKey={1} type="code" href="https://github.com/ava-labs/avalanchego/blob/v1.14.2/snow/consensus/snowball/parameters.go">
            <p><strong>문제:</strong> 잘못된 sample·preference·confidence·finalization threshold 조합을 초기화 전에 거절해야 합니다.</p>
            <p><strong>구현:</strong> <code>K/2 &lt; AlphaPreference ≤ AlphaConfidence ≤ K</code>와 <code>0 &lt; ConcurrentRepolls ≤ Beta</code> 등을 검사합니다.</p>
            <p><strong>전제:</strong> v1.14.2 tag가 가리키는 commit <code>6e5acf909c7a16b991142d6b3979bac5699bdb68</code>에 고정합니다.</p>
            <p><strong>말하지 않는 것:</strong> Parameter가 유효하다는 사실만으로 sampler가 공정하거나 network safety가 증명되지는 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="confidence" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">02 · 두 종류의 기억</p>
          <h2 className="break-keep text-2xl font-bold">실패 한 번은 무엇을 지우고 무엇을 남길까요?</h2>
        </header>

        <AvalancheImplementationBoundaryViz />

        <p>
          Snowflake의 <code>confidence</code>는 같은 preference가 <code>AlphaConfidence</code>를 연속으로 넘은 횟수입니다. Preference가 바뀌거나 poll이 threshold에 못 미치면 0으로 돌아갑니다. <code>beta</code>에 닿으면 그 로컬 상태를 잠급니다. A 성공·A 성공·실패·A 성공을 합계 세 번으로 세면 안 되는 이유입니다.
        </p>
        <p>
          Snowball은 각 choice가 <code>AlphaPreference</code>를 넘은 poll 수를 <code>preferenceStrength</code>에 계속 더합니다. 새 choice의 strength가 기존 최댓값보다 클 때만 외부 preference를 바꾸므로, 동률에서는 이전 preference가 남습니다. 누적 strength는 preference의 관성을 만들지만 finalization counter를 대신하지 않습니다.
        </p>

        <AvalanchePollUpdatePseudocodeViz />

        <p>
          구현 이름도 구분해야 합니다. AvalancheGo v1.14.2의 <code>chains/manager.go</code>는 Snowman consensus를 만들 때 <code>Topological&#123;Factory: snowball.SnowflakeFactory&#125;</code>를 사용합니다.
        </p>
        <p>
          같은 package에 Snowball 구현이 존재한다고 해서 해당 manager 경로가 <code>SnowballFactory</code>를 쓴다고 말할 수는 없습니다. 위 두 열은 프로토콜 계보의 차이를 이해하기 위한 비교입니다.
        </p>

        <div id="paper-avalanche-family">
          <CitationBlock source="Team Rocket · Scalable and Probabilistic Leaderless BFT Consensus through Metastability" citeKey={2} href="https://arxiv.org/abs/1906.08936">
            <p><strong>문제:</strong> 전체 참여자의 all-to-all vote 없이 Byzantine 환경에서 합의에 가까워지는 protocol family가 필요합니다.</p>
            <p><strong>기여:</strong> Repeated random subsampling과 metastability를 바탕으로 Slush·Snowflake·Snowball·Avalanche 구성을 제시합니다.</p>
            <p><strong>전제:</strong> 논문이 명시한 sampling, Byzantine fraction과 network scheduler model 안에서 읽습니다.</p>
            <p><strong>말하지 않는 것:</strong> 논문 실험의 처리량과 지연이 현재 모든 Avalanche network 또는 설정에서 그대로 나온다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-avalanchego-snow-state">
          <CitationBlock source="AvalancheGo v1.14.2 · binary Snowflake와 Snowball" citeKey={3} type="code" href="https://github.com/ava-labs/avalanchego/tree/v1.14.2/snow/consensus/snowball">
            <p><strong>문제:</strong> 같은 poll 결과가 연속 confidence와 누적 preference를 서로 다른 규칙으로 갱신해야 합니다.</p>
            <p><strong>구현:</strong> <code>binary_snowflake.go</code>는 reset·increment·finalize를, <code>binary_snowball.go</code>는 choice별 strength와 lazy tie preference를 구현합니다.</p>
            <p><strong>전제:</strong> Engine이 이미 choice별 poll count를 올바르게 집계해 전달했다고 가정합니다.</p>
            <p><strong>말하지 않는 것:</strong> 이 로컬 state object가 sampling, network delivery, block validity와 chain acceptance 전체를 수행하지는 않습니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-avalanchego-snowman-factory">
          <CitationBlock source="AvalancheGo v1.14.2 · Snowman factory wiring" citeKey={4} type="code" href="https://github.com/ava-labs/avalanchego/blob/v1.14.2/chains/manager.go#L930-L934">
            <p><strong>문제:</strong> Node가 실제 linear-chain consensus 구현을 어떤 local choice state와 연결하는지 확인해야 합니다.</p>
            <p><strong>구현:</strong> v1.14.2 manager는 Snowman의 <code>Topological</code> consensus에 <code>SnowflakeFactory</code>를 주입합니다.</p>
            <p><strong>근거 범위:</strong> 이 고정 릴리스의 manager wiring에만 해당합니다.</p>
            <p><strong>말하지 않는 것:</strong> 다른 릴리스·다른 chain engine이나 논문의 Snowball construction이 불필요하다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="limits" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">03 · 결정의 경계</p>
          <h2 className="break-keep text-2xl font-bold">한 노드가 결정을 내리면 네트워크 전체도 끝난 걸까요?</h2>
        </header>

        <AvalancheDecisionBoundaryViz />

        <p>
          Safety는 두 정직한 노드가 상충하는 값을 결정하지 않는 성질입니다. Liveness는 필요한 network 조건이 성립할 때 정직한 노드가 결국 결정을 만드는 성질입니다. 한 노드의 confidence가 beta에 닿았다는 기록만으로 두 성질을 직접 관찰할 수는 없습니다.
        </p>
        <p>
          두 성질을 판단하려면 Byzantine stake 비율, stake-weighted sampling, sample 사이의 상관, message delay와 omission을 포함한 model이 함께 필요합니다.
        </p>
        <p>
          실패 동작도 나눠 봐야 합니다. AlphaPreference에 못 미친 poll은 confidence를 0으로 돌리지만 기존 preference와 Snowball strength를 지우지 않습니다. Preference threshold는 넘고 confidence threshold에는 못 미친 poll은 preference를 바꿀 수 있어도 streak를 늘리지 않습니다.
        </p>
        <p>
          Partition이나 응답 부족이 계속되면 노드는 충돌 값을 억지로 정하지 않습니다. Confidence가 beta에 도달하지 못한 채 진행을 멈출 수 있습니다.
        </p>
        <p>
          현재 Avalanche 문서에서 Primary Network의 P·C·X Chain은 linear Snowman 계열로 설명됩니다. X-Chain의 과거 Avalanche DAG engine은 2023년 Cortina upgrade 뒤 Primary Network에서 더 이상 사용하지 않는 역사적 경로입니다.
        </p>
        <p>
          그러므로 “Avalanche 합의”라는 이름을 보았을 때 논문의 DAG, Snowball building block, 현재 Snowman chain engine을 한 프로그램으로 합치지 않아야 합니다.
        </p>

        <div id="paper-avalanche-current-consensus">
          <CitationBlock source="Avalanche Builder Hub · Consensus Protocols" citeKey={5} href="https://build.avax.network/docs/nodes/architecture/consensus">
            <p><strong>문제:</strong> Snow family의 개념과 현재 Primary Network에서 쓰는 linear consensus 경로를 구분해야 합니다.</p>
            <p><strong>공식 설명:</strong> Snowman은 P·C·X Chain과 대부분의 Avalanche L1에서 쓰이며, X-Chain의 DAG engine은 Cortina 이후 역사적 호환 경로로 남아 있습니다.</p>
            <p><strong>근거 범위:</strong> 문서가 설명하는 현재 network architecture와 protocol 계보입니다.</p>
            <p><strong>말하지 않는 것:</strong> 모든 L1의 정확한 parameter, 릴리스 wiring, finality 지연이 같다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>

        <p>
          이제 전체 지도에는 다음 사실을 되돌려 놓을 수 있습니다. Snow 계열의 핵심은 “작은 표본을 쓴다”가 아니라, 표본 결과가 preference와 연속 confidence를 서로 다른 state로 갱신하고, 이 로컬 상태 전이가 명시된 network model 아래에서 probabilistic safety로 이어진다는 점입니다. 제품의 parameter 변경·장애 주입·rollback 판단은 별도의 실무 글에서 다룹니다.
        </p>
      </section>
    </article>
  );
}
