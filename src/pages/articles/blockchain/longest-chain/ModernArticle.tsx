import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import {
  ChainworkImplementationViz,
  FinalityBoundaryViz,
  ReorgImplementationPseudocodeViz,
  NakamotoReorgTraceViz,
} from "./viz/ModernLongestViz";

export default function ModernLongestChainArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Nakamoto 합의 상세</p>
          <h2 className="text-3xl font-bold tracking-tight">더 무거운 분기가 도착하면 이미 실행한 장부는 어떻게 바뀔까요?</h2>
        </header>
        <p className="text-lg font-semibold leading-8 text-foreground">
          노드는 <strong>더 많은 누적 work를 가진 유효한 분기</strong>를 후보로 고른 뒤, 공통 조상까지 기존 상태를 되돌리고 새 분기를 앞에서부터 다시 실행합니다.
        </p>
        <p className="text-lg leading-8 text-foreground/90">
          <a className="font-semibold text-primary underline-offset-4 hover:underline" href="/cs/blockchain/consensus-mechanisms#pow">앞선 합의 기초</a>에서 hash lottery, cumulative work와 확률적 confirmation을 구분했습니다. 이 글은 같은 parent에서 갈라진 두 유효 분기만 확대합니다. A 분기의 송금 x를 실행한 노드가 더 많은 누적 work를 가진 B3를 받았을 때 후보 head, UTXO와 x의 상태가 어떤 순서로 바뀌는지 끝까지 따라갑니다.
        </p>

        <NakamotoReorgTraceViz />

        <p>
          흔히 쓰는 “longest chain”은 block 개수가 가장 많은 목록이라는 뜻이 아닙니다. Bitcoin Core는 각 block의 target에서 기대 작업량을 계산해 <code>nChainWork</code>에 누적하고, 사용 가능한 후보 가운데 이 값이 가장 큰 분기를 활성화하려고 합니다. 더 무거운 분기가 현재 tip의 형제가 아니라 오래된 조상에서 갈라졌다면, 기존 상태를 공통 조상까지 되돌린 뒤 새 분기를 다시 실행합니다.
        </p>
        <p>
          이 글의 구현 추적은 2026년 10월 27일 공개된 Bitcoin Core <code>v32.1</code> tag에 고정합니다. 논문의 추상 규칙과 구현의 후보 정렬·재조직 절차를 구분하며, 현대 mining pool의 경제나 특정 거래소의 입금 정책까지 일반화하지 않습니다.
        </p>
      </section>

      <section id="chain-selection" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">01 · 누적 work와 재조직</p>
          <h2 className="text-2xl font-bold">누적 work가 큰 후보를 찾았다고 장부가 바로 바뀔까요?</h2>
        </header>

        <ChainworkImplementationViz />

        <ExplainedFormula
          question="Target이 다른 block을 높이가 아닌 하나의 work 단위로 어떻게 비교할까요?"
          idea={<>256-bit hash가 0부터 T까지 들어올 확률은 (T+1)/2²⁵⁶입니다. Bitcoin Core는 그 역수에 대응하는 정수 work를 계산하고 부모의 누적 work에 더합니다. 8-bit 설명용 예에서 T=63이면 work 4, T=15이면 work 16입니다.</>}
          formula={String.raw`w(T)=\left\lfloor\frac{2^{256}}{T+1}\right\rfloor,\qquad W(B)=W(parent(B))+w(T_B)`}
          annotatedFormula={String.raw`\underbrace{w(T)}_{\text{block work}}=\underbrace{\left\lfloor\frac{2^{256}}{T+1}\right\rfloor}_{\text{성공 확률의 역수}},\qquad \underbrace{W(B)}_{\text{누적 work}}=\underbrace{W(parent(B))}_{\text{부모까지}}+w(T_B)`}
          operations={[
            { expression: String.raw`P(hash\le T)=\frac{T+1}{2^{256}}`, annotation: ["0도 성공 범위에 포함", "target이 작을수록 성공 확률 감소", "균등 hash 출력 근사"] },
            { expression: String.raw`w(T)=\left\lfloor\frac{2^{256}}{T+1}\right\rfloor`, annotation: ["Bitcoin Core GetBitsProof와 같은 값", "8-bit toy: T=63 → 4", "8-bit toy: T=15 → 16"] },
            { expression: String.raw`W(B)=W(parent(B))+w(T_B)`, annotation: ["block index에 누적", "높이와 별도 값", "가장 큰 usable candidate를 먼저 검사"] },
          ]}
          terms={[
            { symbol: "T", name: "PoW target", description: "Block header hash가 넘지 않아야 하는 inclusive upper bound입니다." },
            { symbol: "w(T)", name: "Block work", description: "해당 target의 valid block 하나가 나타내는 정수 기대 작업량입니다." },
            { symbol: "W(B)", name: "Cumulative chainwork", description: "Genesis부터 후보 head B까지 누적한 block work입니다." },
          ]}
          assumptions={[
            "Hash 출력을 독립에 가까운 균등 256-bit 값으로 모델링합니다.",
            "nBits가 표현한 target과 difficulty transition이 먼저 consensus rule을 통과해야 합니다.",
            "8-bit 수치는 계산을 보이기 위한 예이며 실제 Bitcoin 값이 아닙니다.",
          ]}
          interpretation="Block count가 같아도 누적 work가 다를 수 있고, 누적 work가 커도 transaction이나 state transition이 invalid면 활성 체인이 될 수 없습니다."
        />

        <p>
          <code>CBlockIndexWorkComparator</code>는 먼저 <code>nChainWork</code>를 비교하고, 동률이면 block data가 활성화 가능한 상태가 된 로컬 sequence를 사용합니다. 이 동률 규칙은 모든 노드가 같은 head를 즉시 본다는 합의 증거가 아닙니다. 새 work가 한쪽에 붙으면 work 차이가 우선순위를 결정하고, 전파가 이어지는 동안 노드들은 그 분기로 수렴합니다.
        </p>
        <p>
          <code>FindMostWorkChain</code>이 고른 후보도 아직 완전히 실행된 체인은 아닙니다. 경로에 알려진 invalid block이 있거나 필요한 block data가 없으면 후보에서 제외합니다. <code>ActivateBestChainStep</code>은 현재 tip과 후보의 공통 조상을 찾고, 이전 분기를 <code>DisconnectTip</code>으로 역순 해제한 뒤 새 분기를 <code>ConnectTip</code>으로 정방향 검증합니다. 새 분기의 transaction이 실패하면 그 분기를 invalid로 표시하고 다른 후보를 찾습니다.
        </p>

        <ReorgImplementationPseudocodeViz />

        <div id="paper-bitcoin-core-v32-chainwork">
          <CitationBlock source="Bitcoin Core v32.1 · chainwork와 후보 정렬" citeKey={1} type="code" href="https://github.com/bitcoin/bitcoin/tree/v32.1">
            <p><strong>문제:</strong> Compact target을 정수 work로 바꾸고, 여러 block index 후보를 재현 가능한 우선순위로 비교해야 합니다.</p>
            <p><strong>구현:</strong> <code>GetBitsProof</code>가 target-to-work를 계산하고, <code>nChainWork</code>가 부모 값에 이를 누적하며, comparator가 work와 activation sequence를 차례로 비교합니다.</p>
            <p><strong>전제:</strong> Bitcoin Core v32.1 tag와 그 tag가 가리키는 commit <code>f0de87f040621468b956f01f526a43a010310501</code>에 한정합니다.</p>
            <p><strong>근거 범위:</strong> <code>src/chain.cpp</code>, <code>src/node/blockstorage.cpp</code>의 work 계산·누적·후보 정렬입니다.</p>
            <p><strong>말하지 않는 것:</strong> Work 점수만으로 block transaction이 유효하거나 경제적으로 되돌릴 수 없다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-bitcoin-core-v32-reorg">
          <CitationBlock source="Bitcoin Core v32.1 · ActivateBestChainStep" citeKey={2} type="code" href="https://github.com/bitcoin/bitcoin/blob/v32.1/src/validation.cpp#L3122-L3264">
            <p><strong>문제:</strong> 더 많은 work의 후보가 현재 체인과 갈라졌을 때 UTXO와 mempool을 일관되게 새 분기로 옮겨야 합니다.</p>
            <p><strong>구현:</strong> 사용 가능한 최다 work 후보를 찾고, 공통 조상까지 기존 block을 해제한 뒤 새 block을 순서대로 연결합니다.</p>
            <p><strong>실패 동작:</strong> Disconnect 실패는 로컬 시스템의 치명적 오류로 중단하고, 새 block의 consensus invalid는 그 분기를 제외해 다음 후보를 다시 찾습니다.</p>
            <p><strong>말하지 않는 것:</strong> 지갑·거래소·애플리케이션의 외부 지급까지 자동으로 되돌린다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="finality" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">02 · 확인 깊이</p>
          <h2 className="text-2xl font-bold">확인 수가 늘면 왜 위험은 줄지만 확정 스위치는 생기지 않을까요?</h2>
        </header>

        <FinalityBoundaryViz />

        <ExplainedFormula
          question="공격 분기가 관찰 시점에 z work-step 뒤처졌다면 언젠가 동률에 닿을 확률은 얼마일까요?"
          idea={<>다음 work event를 정직한 쪽이 얻을 확률을 p, 공격자가 얻을 확률을 q라고 두면 deficit은 한 칸 멀어지거나 가까워지는 random walk가 됩니다. q&lt;p일 때 z에서 0에 닿을 확률은 (q/p)^z입니다. q=0.1, p=0.9, z=6이면 약 1.88×10⁻⁶입니다.</>}
          formula={String.raw`P_{catch}(z)=\left(\frac{q}{p}\right)^z\quad(q<p),\qquad P_{catch}(6)=\left(\frac{0.1}{0.9}\right)^6\approx1.88\times10^{-6}`}
          annotatedFormula={String.raw`\underbrace{P_{catch}(z)}_{\text{언젠가 동률}}=\underbrace{\left(\frac{q}{p}\right)^z}_{\text{현재 deficit z에서 시작}}\quad\underbrace{(q<p)}_{\text{공격자가 열세}}`}
          operations={[
            { expression: String.raw`q/p`, annotation: ["공격자가 한 칸 따라붙는 상대 비율", "p=1-q인 두 집단 단순 모델", "q≥p이면 eventual catch-up을 1로 봄"] },
            { expression: String.raw`(q/p)^z`, annotation: ["관찰 시점의 고정 deficit z", "z가 커질수록 지수적으로 감소", "정상 전파·고정 share 전제"] },
            { expression: String.raw`(0.1/0.9)^6\approx1.88\times10^{-6}`, annotation: ["약 0.000188%", "언젠가 동률에 닿을 확률", "전체 double-spend 계산과는 다른 입력"] },
          ]}
          terms={[
            { symbol: "p", name: "Honest work share", description: "다음 work event를 정직한 분기가 얻는다고 모델링한 비율입니다." },
            { symbol: "q", name: "Attacker work share", description: "다음 work event를 공격 분기가 얻는다고 모델링한 비율입니다." },
            { symbol: "z", name: "Current deficit", description: "계산을 시작하는 순간 공격 분기가 뒤처진 work-step 수입니다." },
          ]}
          assumptions={[
            "p와 q가 관찰 구간 동안 일정하고 q<p입니다.",
            "Block arrival를 독립적인 memoryless process로 근사합니다.",
            "두 분기의 block work가 같아 deficit을 block 수처럼 표현할 수 있습니다.",
            "Propagation advantage, eclipse, selfish mining과 difficulty 변화는 포함하지 않습니다.",
          ]}
          interpretation="이 식은 이미 z만큼 뒤처진 시점부터의 eventual catch-up입니다. 정직한 체인에 z개가 붙는 동안 공격자가 만든 block 수까지 평균내는 whitepaper의 Poisson double-spend 계산과 같은 값으로 읽으면 안 됩니다."
        />

        <p>
          Bitcoin whitepaper는 수신자가 z개의 새 block을 기다리는 동안 공격자가 얼마나 전진했는지를 Poisson 분포로 평균낸 뒤, 남은 deficit에서의 catch-up 확률을 합합니다. 따라서 UI의 “6 confirmations”와 위 식의 “현재 deficit 6”은 자동으로 같은 입력이 아닙니다. 공격자 share, 전파 조건과 계산 시작 시점을 고정하지 않은 확인 숫자만으로 위험을 말할 수 없습니다.
        </p>

        <div id="paper-bitcoin-whitepaper">
          <CitationBlock source="Satoshi Nakamoto · Bitcoin: A Peer-to-Peer Electronic Cash System" citeKey={3} href="https://bitcoin.org/bitcoin.pdf">
            <p><strong>문제:</strong> 중앙 운영자 없이 transaction history를 선택하고 double spending을 어렵게 해야 합니다.</p>
            <p><strong>기여:</strong> Proof-of-work chain, 가장 많은 누적 CPU effort를 가진 chain 선택과 attacker catch-up의 random-walk·Poisson 계산을 제시합니다.</p>
            <p><strong>전제:</strong> 논문이 둔 독립 block arrival, 고정 hash share와 network 전파 근사 안에서 읽습니다.</p>
            <p><strong>말하지 않는 것:</strong> 고정된 확인 수가 모든 금액·network 상태에서 deterministic finality를 준다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">03 · 공통 접두사와 실패</p>
          <h2 className="text-2xl font-bold">깊은 과거가 같아진다는 말은 어떤 전제에서만 맞을까요?</h2>
        </header>

        <p>
          두 정직한 노드가 가진 chain에서 최근 k개 block을 잘라냈을 때 더 오래된 부분이 같다면 k-common-prefix 성질을 만족합니다. 이는 모든 미래에 절대로 갈라지지 않는다는 뜻이 아니라, 정해진 실행 구간과 security parameter에서 실패 확률이 작다는 명제입니다. Backbone 분석은 이를 정직한 chain이 계속 자라는 <strong>chain growth</strong>, 충분한 정직한 block이 남는 <strong>chain quality</strong>와 함께 다룹니다.
        </p>
        <p>
          공격자가 정직한 쪽 이상으로 work를 만들거나, 정직한 노드들이 장기간 partition되어 서로의 block을 받지 못하면 두 집단은 각자 무거운 분기를 키울 수 있습니다. Eclipse로 한 노드의 network view가 고립되거나 전파 지연이 커져 정직한 stale block이 많아져도 단순한 p·q 모델이 실제 우위를 잘못 나타낼 수 있습니다. 이때 확인 숫자만 늘리는 것은 깨진 전제를 복구하지 못합니다.
        </p>
        <p>
          재조직 도중 기존 분기를 해제하지 못하면 Bitcoin Core는 덜 무거운 체인에 조용히 머무르지 않고 치명적 로컬 오류로 중단합니다. 새 분기의 block이 consensus rule을 위반하면 해당 분기를 실패로 표시하고 다른 후보를 찾습니다. 합의 계층이 head를 바꿔도 이미 외부로 보낸 상품·법정화폐·다른 chain의 지급은 자동으로 되돌아가지 않습니다. 따라서 프로토콜의 head, transaction의 현재 확인 깊이와 외부 효과는 서로 다른 상태입니다.
        </p>

        <div id="paper-bitcoin-backbone">
          <CitationBlock source="Garay–Kiayias–Leonardos · The Bitcoin Backbone Protocol" citeKey={4} href="https://eprint.iacr.org/2014/765.pdf">
            <p><strong>문제:</strong> Longest-chain protocol의 ledger safety와 liveness를 명시적 실행 모델에서 설명해야 합니다.</p>
            <p><strong>기여:</strong> Common prefix, chain growth와 chain quality를 정의하고 이 성질에서 ledger를 구성합니다.</p>
            <p><strong>전제:</strong> 논문의 synchronous-round, random-oracle과 정직한 mining-power 조건에 한정합니다.</p>
            <p><strong>근거 범위:</strong> 깊은 history가 높은 확률로 일치한다는 문장의 정확한 관찰 대상과 반례 경계를 정합니다.</p>
            <p><strong>말하지 않는 것:</strong> 실제 pool 집중, 구현 오류, 장기 partition과 경제적 공격이 자동으로 포함된다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}
