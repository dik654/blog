import ExplainedFormula from "@/components/ui/explained-formula";
import PoWMiningViz from "./viz/PoWMiningViz";
import PoWFlowViz from "./viz/PoWFlowViz";

export default function ProofOfWork() {
  return (
    <section id="pow" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PoW는 찾기 어렵고 검증하기 쉬운 hash lottery다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Miner는 previous block hash와 transaction commitment 등이 들어간 header를
          바꾸며 hash를 계산합니다. Hash를 <code>b</code>-bit 정수로 볼 때 결과가 target
          <code>T</code>보다 작으면 proof가 valid합니다. 성공한 miner가 block을 전파해도
          다른 node는 target뿐 아니라 parent·transaction·state-transition rule 전체를
          다시 검증합니다. Work가 많다고 invalid transaction이 valid해지지는 않습니다.
        </p>
      </div>

      <PoWMiningViz />
      <ExplainedFormula
        question="Target이 작아질수록 평균 시도 수는 어떻게 변할까?"
        idea="Hash output을 균등하고 각 시도를 독립이라고 근사하면 성공 영역의 비율이 한 번의 성공 확률이고, geometric distribution의 기대 시도 수는 그 역수입니다."
        formula={String.raw`\begin{aligned}
          p&=\Pr[H<T]=\frac{T}{2^b}\\
          \mathbb{E}[N]&=\frac{1}{p}=\frac{2^b}{T}
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          p&=\underbrace{\Pr[H<T]=\frac{T}{2^b}}_{\text{기준량당 비율}}\\
          \mathbb{E}[N]&=\underbrace{\frac{1}{p}=\frac{2^b}{T}}_{\text{확률 가중 평균}}
        \end{aligned}`}
        operations={[
          { expression: String.raw`\Pr[H<T]=\frac{T}{2^b}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Hash output을 균등하고 각 시도를 독립이라고 근사하면","성공 영역의 비율이 한 번의 성공 확률이고, geometric","distribution의 기대 시도 수는 그 역수입니다."] },
          { expression: String.raw`\frac{1}{p}=\frac{2^b}{T}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Hash output을 균등하고 각 시도를 독립이라고 근사하면","성공 영역의 비율이 한 번의 성공 확률이고, geometric","distribution의 기대 시도 수는 그 역수입니다."] },
        ]}
        terms={[
          { symbol: "b", name: "hash bits", description: "Toy model에서 hash output을 나타내는 bit 수입니다." },
          { symbol: "T", name: "target", description: "0 이상 T 미만 output을 성공으로 인정하는 threshold입니다." },
          { symbol: "p", name: "success probability", description: "한 번의 header 시도가 성공할 확률입니다." },
          { symbol: "N", name: "trials", description: "첫 성공까지 필요한 hash 시도 수입니다." },
        ]}
        assumptions={[
          "Hash output을 균등 분포처럼 보고 서로 다른 header 시도를 독립 근사합니다.",
          "Network propagation·hardware efficiency·difficulty adjustment는 이 식 밖의 시스템 요소입니다.",
        ]}
        interpretation="b=8, T=16이면 p=16/256=1/16이고 기대 시도 수는 16입니다. T를 8로 줄이면 성공 확률은 절반, 기대 시도 수는 두 배가 됩니다."
      />

      <PoWFlowViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>유효한 block 두 개가 생기면 누적 work를 비교합니다</h3>
        <p>
          Network delay 때문에 같은 parent를 가리키는 block이 동시에 보일 수 있습니다.
          Bitcoin 계열 node는 각 branch의 valid proof가 나타내는 cumulative work를 계산해
          더 큰 chainwork를 가진 branch를 따릅니다. 그래서 “가장 긴 chain”은 단순 block
          개수가 아니라 가장 많은 proof-of-work가 누적된 valid chain으로 읽어야 합니다.
        </p>
        <p>
          공격자가 뒤처진 branch를 따라잡을 가능성은 honest work가 더 쌓일수록 낮아지지만
          일반적으로 0이 되지는 않습니다. Confirmation policy는 attacker hash share,
          transaction value, network condition과 허용 위험을 명시해야 하며 고정된 숫자를
          모든 배포의 finality로 복사하면 안 됩니다.
        </p>
      </div>

      <div id="paper-bitcoin-pow" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · PoW 정본</p>
        <p className="mt-2 text-sm font-semibold">Bitcoin: A Peer-to-Peer Electronic Cash System</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 신뢰 기관 없이 transaction ordering과 double-spend 저항을 만드는 것입니다.
          Hash-based proof-of-work와 가장 많은 누적 work를 가진 chain, 공격자가 따라잡을
          확률을 결합합니다. 모든 hash function·모든 network·고정 confirmation 수에 같은
          안전성이 자동으로 성립한다는 논문은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://bitcoin.org/bitcoin.pdf" target="_blank" rel="noreferrer">Bitcoin paper 원문 보기</a>
      </div>
    </section>
  );
}
