import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import PoWMiningViz from "./viz/PoWMiningViz";
import PoWFlowViz from "./viz/PoWFlowViz";

export default function ProofOfWork() {
  return (
    <section data-teach-level="5" id="pow" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        8. A의 이름이 100개여도 계산 몫 10%는 그대로입니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          3절의 A, B, C, D가 각각 초당 10·20·30·40번 계산한다고 놓습니다(가정). 결과를 예측하기 어려운 고정 길이 함수인 hash를 반복해서 계산하고 허용 범위에 들어가는 결과를 찾습니다. 같은 장비 효율과 조건이라면 A의 시도 몫은 전체의 10%입니다. 이름을 100개로 나눠도 시도 수는 늘지 않습니다.
        </p><p>
          각 시도의 입력에는 이전 블록을 가리키는 값과 거래 목록의 약속이 들어갑니다. X 안의 송금을 바꾸면 이 약속도 바뀌므로 그 새 후보에 맞는 결과를 다시 찾아야 합니다. 다른 노드는 계산 증거와 별개로 100−10=90인지 검증합니다. 많은 계산을 한 후보라도 잘못된 잔액은 거절합니다.
        </p>
      </div>

      <PoWMiningViz />
      <ExplainedFormula
        question="Target이 작아질수록 평균 시도 수는 어떻게 변할까?"
        idea="가능한 출력 중 허용되는 출력의 비율을 셉니다. 실패한 뒤에도 같은 조건으로 다시 시도하면 평균 시도 횟수는 성공확률의 역수가 됩니다."
        formula={String.raw`\begin{aligned}
          p&=\Pr[H<T]=\frac{T}{2^b}\\
          \mathbb{E}[N]&=\frac{1}{p}=\frac{2^b}{T}
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          p&=\underbrace{\Pr[H<T]=\frac{T}{2^b}}_{\text{target 아래 출력 비율}}\\
          \mathbb{E}[N]&=\underbrace{\frac{1}{p}=\frac{2^b}{T}}_{\text{첫 성공까지 평균 시도}}
        \end{aligned}`}
        operations={[
          { expression: String.raw`\Pr[H<T]=\frac{T}{2^b}`, annotation: ["허용되는 T개 출력을 전체 2^b개 출력으로 나눕니다.","서로 다른 입력의 hash가 독립 균등 출력처럼 동작한다는 모형입니다."] },
          { expression: String.raw`\frac{1}{p}=\frac{2^b}{T}`, annotation: ["성공확률 p의 역수로 첫 성공까지 평균 시도 수를 계산합니다.","매 시도 후 같은 조건으로 다시 시작한다는 가정이 필요합니다."] },
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
        interpretation="설명용 b=8, T=16에서는 0부터 15까지 16개가 성공이므로 p=1/16, 평균 시도 수는 16입니다. T=8이면 평균은 32입니다. 이는 H<T를 쓰는 가정이며 Bitcoin의 실제 H≤target 경계와 비트 폭을 그대로 복사한 값은 아닙니다."
      />

      <p className="leading-8">평균 시도 횟수를 E라고 놓으면 한 번은 반드시 시도하고 실패확률 1−p일 때 같은 탐색을 다시 시작합니다. 따라서 E=1+(1−p)E이고 pE=1에서 E=1/p를 얻습니다. 사례의 전체 속도 100회/초라면 평균 대기 16/100=0.16초입니다. 이것은 단순 모형의 값이며 네트워크 전파나 난이도 조정을 포함한 실제 체인 속도가 아닙니다.</p>
      <AlgorithmBlock title="작업 증거를 검증하는 개념 절차 (의사코드)" input={["이전 기록 P, 후보 X, 계산 증거", "설명용 8비트 hash와 T=16 (가정)"]} steps={[{code:"후보가 P를 올바르게 참조하는지 확인한다"},{code:"X 안의 각 거래를 앞선 상태에서 순서대로 검증한다",note:"사례의 잔액은 100−10=90이어야 합니다."},{code:"합의한 입력 인코딩으로 hash를 다시 계산한다"},{code:"설명용 조건 H < 16인지 확인한다"},{code:"유효한 후보의 누적 작업량을 갱신하고 선택 규칙을 적용한다"}]} output="유효한 경쟁 가지와 현재 head. 증거 한 개만으로 영구 확정을 선언하지 않습니다." />
      <PoWFlowViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>유효한 블록 두 개가 생기면 누적 작업량을 비교합니다</h3>
        <p>
          지연 때문에 X와 Y가 같은 부모에서 갈라질 수 있습니다. Bitcoin 계열에서는 유효한 작업 증거가 나타내는 작업량을 누적해 더 큰 가지를 따릅니다. 각 블록의 난이도가 다르면 블록 개수만 비교할 수 없습니다. X 쪽에 동등 난이도의 작업 두 개가 더 쌓이고 Y 쪽에는 하나가 쌓였다면 그 조건 아래 X 쪽 누적량이 큽니다.
        </p>
        <p>
          뒤처진 공격자의 계산 비중이 정직한 쪽보다 작다는 모형에서는 차이가 커질수록 따라잡을 가능성이 낮아집니다. 일반적으로 0은 아닙니다. 송금 10을 언제 확정으로 취급할지는 공격자 비중, 통신 조건, 금액과 허용 위험을 함께 정해야 합니다.
        </p>
      </div>

      <div id="paper-bitcoin-pow" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · PoW 정본</p>
        <p className="mt-2 text-sm font-semibold">Bitcoin: A Peer-to-Peer Electronic Cash System</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          §4의 원문은 “the greatest proof-of-work effort invested in it”로 선택 근거를 설명합니다. X·Y 사례에서는 각 유효한 가지에 쌓인 작업량을 비교한다는 뜻입니다. §5의 거래 유효성 검사를 생략하고 작업량만 많다고 120이라는 거짓 잔액을 받아들이지는 않습니다. 논문의 공격 확률은 명시한 계산 비중과 네트워크 가정 안에서 읽습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://bitcoin.org/bitcoin.pdf" target="_blank" rel="noreferrer">Bitcoin paper 원문 보기</a>
      </div>
      <p className="leading-8">작업량과 내용 검사가 맡은 역할을 나눴습니다. 다음에는 같은 네 참여자의 자원을 잠근 지분으로 바꿔 선택 확률과 표 무게를 따져 보겠습니다.</p>
    </section>
  );
}
