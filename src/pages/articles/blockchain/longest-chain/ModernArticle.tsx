import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { ChainWorkViz, ProbabilisticFinalityViz } from "./viz/ModernLongestViz";

function Boundary({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-muted-foreground">{children}</div>
    </div>
  );
}

export default function ModernLongestChainArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Nakamoto consensus를 처음부터</p>
          <h2 className="text-3xl font-bold tracking-tight">Longest chain은 가장 긴 목록이 아니라 가장 많은 누적 work를 가진 유효한 branch다</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          Permissionless network에서는 누구나 block을 제안할 수 있고, 서로 다른 block이 거의 동시에 전파되면 정직한 node도 잠시 다른 head를 봅니다. Proof of Work(PoW)는 hash target을 만족시키는 데 평균적으로 드는 계산 자원을 block weight로 바꾸고, node는 <strong>유효한 branch 중 cumulative chainwork가 가장 큰 것</strong>을 canonical 후보로 고릅니다.
        </p>
        <p>
          이름 때문에 block 개수만 세기 쉽지만 Bitcoin식 규칙은 그렇지 않습니다. 각 block의 target이 다르면 같은 한 블록도 서로 다른 expected work를 나타냅니다. 또한 “선택됐다”는 것은 영원히 바뀌지 않는다는 뜻이 아닙니다. 더 큰 cumulative work를 가진 competing branch가 나중에 도착하면 node는 공통 조상까지 state를 되돌리고 새 branch를 적용하는 reorganization(reorg)을 수행합니다.
        </p>
        <ChainWorkViz />
        <div className="grid gap-4 md:grid-cols-3">
          <Boundary title="Validity">Header, transaction, state transition과 PoW가 protocol rule을 만족해야 후보가 됩니다. Work가 커도 invalid block은 선택하지 않습니다.</Boundary>
          <Boundary title="Fork choice">현재 보이는 유효 branch 중 cumulative work가 가장 큰 head를 고릅니다. Network view가 다르면 node마다 잠시 다른 head일 수 있습니다.</Boundary>
          <Boundary title="Finality policy">Payment나 bridge가 몇 confirmations 뒤 행동할지는 공격자 hash share, 금액, eclipse 위험과 운영 손실 예산에 따른 별도 정책입니다.</Boundary>
        </div>
      </section>

      <section id="chain-selection" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · Branch 선택</p>
          <h2 className="mt-2 text-2xl font-bold">Target이 낮을수록 block work가 크고, branch에서는 이를 합한다</h2>
        </header>
        <p>
          Mining은 block header hash를 256-bit 정수로 해석해 target T 이하가 되는 nonce를 찾는 반복 lottery입니다. Uniform hash를
          가정하면 한 번에 성공할 확률은 대략 (T+1)/2²⁵⁶이고 그 역수가 expected trials입니다. 구현은 이 기대량에 대응하는 정수 work를 각 block에 부여하고
          branch를 따라 더합니다.
        </p>
        <ExplainedFormula
          question="서로 다른 difficulty의 block을 block 개수가 아닌 하나의 누적 work 값으로 어떻게 비교하는가?"
          idea={<>Target 이하의 hash가 나올 확률의 역수를 block work로 사용하고, genesis부터 head까지 합합니다. 이해를 위한 8-bit toy hash에서 target 63은 floor(256/64)=4 work, target 15는 floor(256/16)=16 work입니다. 따라서 4-work block 두 개보다 16-work block 하나가 더 무겁습니다.</>}
          formula={String.raw`w(T)=\left\lfloor\frac{2^{256}}{T+1}\right\rfloor,\qquad W(B)=\sum_{b\preceq B}w(T_b)`}
          annotatedFormula={String.raw`w(T)=\underbrace{\left\lfloor\frac{2^{256}}{T+1}\right\rfloor,\qquad W(B)=\sum_{b\preceq B}w(T_b)}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`\left\lfloor\frac{2^{256}}{T+1}\right\rfloor,\qquad W(B)=\sum_{b\preceq B}w(T_b)`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Target 이하의 hash가 나올 확률의 역수를 block","work로 사용하고, genesis부터 head까지 합합니다."] },
          ]}
          terms={[
            { symbol: "T", name: "PoW target", description: "해당 block header hash가 만족해야 하는 inclusive upper bound입니다." },
            { symbol: "w(T)", name: "Block work", description: "그 target에서 한 valid block이 나타내는 정수 expected work입니다." },
            { symbol: "W(B)", name: "Cumulative chainwork", description: "Genesis부터 head B까지 유효한 block work를 더한 값입니다." },
            { symbol: "b\\preceq B", name: "Ancestor relation", description: "Block b가 B의 ancestor이거나 B 자신이라는 뜻입니다." },
          ]}
          assumptions={["Cryptographic hash output을 독립에 가까운 uniform 256-bit 값으로 모델링합니다.", "각 block의 target과 difficulty adjustment가 consensus rule에 맞는지 먼저 검증합니다.", "식의 8-bit 숫자는 직관용이며 실제 chain은 256-bit arithmetic과 protocol-specific target encoding을 사용합니다."]}
          interpretation="Fork choice는 W가 더 큰 유효 branch를 선택합니다. 따라서 ‘longest’라는 표현을 block count로 구현하면 difficulty가 달라지는 경계에서 consensus bug가 됩니다."
        />
        <p>
          동률 또는 거의 동시에 도착한 branch에서는 node가 먼저 본 valid head를 잠정적으로 mining할 수 있습니다. 이후 한 branch에 새 work가 붙으면 network가 그쪽으로 수렴합니다. 여기에는 전파 지연이 block interval에 비해 충분히 작고, 정직한 miner들이 유효 block을 계속 확장하며, eclipse로 network view가 장기간 분리되지 않는다는 liveness 전제가 숨어 있습니다.
        </p>
        <div id="paper-bitcoin-core-chainwork">
          <CitationBlock source="Bitcoin Core · chain.cpp GetBlockProof / chainwork" citeKey={1} type="code" href="https://github.com/bitcoin/bitcoin/blob/master/src/chain.cpp">
            <p><strong>문제:</strong> Compact target을 consensus-safe integer work로 바꾸고 competing chain의 누적 work를 비교해야 합니다.</p>
            <p><strong>기여:</strong> GetBlockProof 계열 계산과 CBlockIndex의 chainwork 누적이 실제 node fork-choice 자료구조에 연결됩니다.</p>
            <p><strong>전제와 범위:</strong> 링크한 current master는 움직이는 구현 근거이므로 production 재현에는 commit을 pin해야 합니다. PoW 보안 확률이나 경제적 finality까지 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="finality" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · 확률적 finality</p>
          <h2 className="mt-2 text-2xl font-bold">Confirmation은 공격자가 따라잡아야 할 work deficit을 키운다</h2>
        </header>
        <p>
          Transaction이 들어간 block 뒤에 z개의 confirmations가 붙으면 공격자는 canonical branch보다 부족한 work를 따라잡아야 history를 바꿀
          수 있습니다. 공격자 hash share q가 정직한 share p보다 작고 network가 정상적으로 전파된다는 모델에서는 z가 커질수록 catch-up probability가
          빠르게 작아집니다. 그러나 확률은 일반적으로 정확히 0이 되지 않으므로 PoW longest-chain에는 BFT checkpoint와 같은 deterministic
          finality 시점이 없습니다.
        </p>
        <ProbabilisticFinalityViz />
        <ExplainedFormula
          question="공격자가 이미 z block만큼 뒤처진 시점부터 언젠가 동률에 도달할 확률은 얼마인가?"
          idea={<>매 다음 block마다 공격자가 한 칸 따라붙을 확률 q, 정직한 chain이 한 칸 더 멀어질 확률 p인 biased random walk로 봅니다. q&lt;p이면 z칸 deficit에서 0에 닿을 확률은 (q/p)의 z제곱입니다. q=0.1, p=0.9, z=6이면 약 0.00000188, 즉 0.000188%입니다.</>}
          formula={String.raw`P_{catch}(z)=\left(\frac{q}{p}\right)^z\quad(q<p),\qquad \left(\frac{0.1}{0.9}\right)^6\approx1.88\times10^{-6}`}
          annotatedFormula={String.raw`P_{catch}(z)=\underbrace{\left(\frac{q}{p}\right)^z\quad(q<p),\qquad \left(\frac{0.1}{0.9}\right)^6\approx1.88\times10^{-6}}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`\left(\frac{q}{p}\right)^z\quad(q<p),\qquad \left(\frac{0.1}{0.9}\right)^6\approx1.88\times10^{-6}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","매 다음 block마다"] },
          ]}
          terms={[
            { symbol: "q", name: "Attacker share", description: "공격자가 다음 work event를 얻는다고 모델링한 hash share입니다." },
            { symbol: "p", name: "Honest share", description: "정직한 network share이며 단순 two-party model에서는 p=1-q입니다." },
            { symbol: "z", name: "Initial deficit", description: "측정을 시작하는 순간 공격 branch가 뒤처진 block-equivalent work deficit입니다." },
            { symbol: "P_{catch}", name: "Catch-up probability", description: "미래 어느 시점에 공격 branch가 동률에 도달할 확률입니다." },
          ]}
          assumptions={["q와 p가 시간 동안 일정하고 q<p입니다. q≥p이면 eventual catch-up probability를 1로 봅니다.", "Block arrivals를 독립적인 memoryless process로 근사하며 propagation advantage·selfish mining·eclipse를 제외합니다.", "Difficulty와 block work가 비교 구간에서 동일해 z를 block 수처럼 쓸 수 있습니다.", "공격자가 merchant의 z confirmations가 쌓이는 동안 이미 mining한 진전은 이 단순 deficit 식의 입력 z에 반영해야 합니다."]}
          interpretation="이 수치는 ‘6 confirmations의 완전한 double-spend probability’가 아닙니다. Bitcoin whitepaper의 계산은 정직한 chain에 z개가 붙는 동안 공격자가 몇 block을 만들었는지도 Poisson distribution으로 평균내므로 목적과 입력이 다릅니다."
        />
        <div id="paper-bitcoin-whitepaper">
          <CitationBlock source="Satoshi Nakamoto · Bitcoin: A Peer-to-Peer Electronic Cash System" citeKey={2} href="https://bitcoin.org/bitcoin.pdf">
            <p><strong>문제:</strong> Trusted third party 없이 transaction history를 합의하고 double spending을 어렵게 해야 합니다.</p>
            <p><strong>기여:</strong> PoW chain, cumulative-work 선택과 attacker catch-up을 random walk·Poisson model로 분석합니다.</p>
            <p><strong>전제와 범위:</strong> 독립 block arrival, hash share와 network model을 둔 확률 분석입니다. 고정된 ‘6 confirmations는 항상 안전’이라는 SLA나 eclipse·selfish-mining 전체를 증명하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="common-prefix" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 정리의 언어</p>
          <h2 className="mt-2 text-2xl font-bold">Common prefix는 깊은 과거가 정직한 node 사이에서 같아지는 조건을 말한다</h2>
        </header>
        <p>
          “확인이 많으면 안전하다”를 theorem으로 만들려면 먼저 관찰 대상을 정해야 합니다. 두 정직한 node가 서로 다른 시점에 가진 chain에서 마지막 k blocks을
          잘라냈을 때, 더 오래된 prefix가 서로 일치한다면 k-common-prefix 성질이 성립합니다. 이 성질은 history가 영원히 고정된다는 절대 명제가 아니라
          security parameter와 execution horizon에 대해 실패 확률이 작다는 확률 명제입니다.
        </p>
        <p>
          Backbone 분석은 common prefix만 따로 약속하지 않습니다. 정직한 block이 일정한 속도로 chain에 들어가는 <strong>chain growth</strong>, 충분한 비율의 honest contribution을 뜻하는 <strong>chain quality</strong>와 함께 봅니다. 정직한 majority 성격의 mining power, bounded delay 또는 round model, hash query independence 같은 전제가 깨지면 theorem의 결론을 운영 SLA로 옮길 수 없습니다.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Boundary title="Proof idea">정직한 chain이 k-deep block을 제거하려면 공격 branch가 그 이후 누적된 honest work를 따라잡아야 합니다. Concentration bound로 일정 기간 honest success가 adversarial success보다 충분히 많을 확률을 보이고, 실패 사건을 security parameter에 따라 작게 제한합니다.</Boundary>
          <Boundary title="Counterexample boundary">공격자가 과반 hash를 지속적으로 가지거나 정직한 node들이 partition되어 서로의 block을 받지 못하면 각 집단이 별도 heavy chain을 키울 수 있습니다. 이때 확인 수만 늘려도 두 view의 common prefix를 보장할 수 없습니다.</Boundary>
        </div>
        <div id="paper-bitcoin-backbone">
          <CitationBlock source="Garay–Kiayias–Leonardos · The Bitcoin Backbone Protocol" citeKey={3} href="https://eprint.iacr.org/2014/765.pdf">
            <p><strong>문제:</strong> Bitcoin식 longest-chain protocol의 ledger safety와 liveness를 명시적 model에서 증명해야 합니다.</p>
            <p><strong>기여:</strong> Common prefix, chain quality, chain growth 성질을 정의하고 조건부 확률 bound를 통해 ledger protocol로 연결합니다.</p>
            <p><strong>전제와 범위:</strong> 논문의 synchronous-round·random-oracle·honest-power 조건 안의 theorem입니다. 실제 network partition, implementation bug, pool centralization과 경제적 공격을 자동 포함하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="comparison" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · 운영 판단</p>
          <h2 className="mt-2 text-2xl font-bold">Fork choice와 finality를 분리하고, assumptions를 관측한다</h2>
        </header>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-[760px] w-full text-sm">
            <thead className="bg-muted/50 text-left"><tr><th className="p-3">축</th><th className="p-3">PoW longest-chain</th><th className="p-3">BFT-style finality</th></tr></thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr><td className="p-3 font-medium text-foreground">Sybil resource</td><td className="p-3">Hash work</td><td className="p-3">고정·선출 validator voting power</td></tr>
              <tr><td className="p-3 font-medium text-foreground">Head 선택</td><td className="p-3">가장 큰 cumulative work</td><td className="p-3">proposal·vote·round protocol</td></tr>
              <tr><td className="p-3 font-medium text-foreground">Finality</td><td className="p-3">확인마다 reorg risk 감소</td><td className="p-3">quorum certificate 뒤 model 안에서 deterministic</td></tr>
              <tr><td className="p-3 font-medium text-foreground">주요 실패 전제</td><td className="p-3">hash share·delay·eclipse·difficulty</td><td className="p-3">fault threshold·quorum intersection·timing</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          운영자는 단순히 confirmations 숫자를 고정하지 말고 transaction value, 최근 orphan/reorg rate, observed propagation
          delay, pool concentration, peer diversity와 eclipse signal을 함께 기록해야 합니다. Exchange deposit과 내부 UI의
          “완료” 표시는 loss budget이 서로 다를 수 있습니다. Fork choice는 canonical head를 정하는 규칙이고 finality policy는 그 head를
          언제 외부 irreversible action에 연결할지 정하는 규칙입니다. 이 둘은 분리해서 다뤄야 합니다.
        </p>
        <h3 className="text-xl font-semibold">이 글 하나로 풀어야 하는 10문제</h3>
        <p>
          기초 6문제는 valid branch와 cumulative work, toy target 계산, 자연 fork와 reorg, 확률적 finality, q=0.1·z=6 catch-up 계산, common-prefix 전제를 다룹니다. 심화 4문제는 whitepaper Poisson 모델과 단순 deficit 모델 비교, partition·delay·hash share 반례, PoW와 BFT finality의 동일 축 비교, paired release gate 설계입니다. 각 답은 위의 정의·수식·전제·counterexample만으로 작성할 수 있어야 합니다.
        </p>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Release gate:</strong> Consensus version, target encoding, difficulty schedule, peer topology와 chain fixture를 pin합니다. Equal-height/different-work, invalid-high-work, delayed block, partition heal, deep competing branch, restart를 old/new node에 같은 순서로 주입해 head·chainwork·reorg events·wallet confirmations가 일치한 뒤 sync latency와 CPU를 비교합니다. Divergence가 나면 자동 rollback하고 irreversible settlement는 중단합니다.
        </aside>
      </section>
    </article>
  );
}
