import ExplainedFormula from "@/components/ui/explained-formula";
import MemoryViz from "./viz/MemoryViz";

export default function MemoryAxis() {
  return (
    <section id="memory-axis" className="scroll-mt-20">
      <h2 className="mb-6 break-keep text-2xl font-bold">
        한 장 적합성은 weight만이 아니라 KV cache와 실행 여유를 더해 판단합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          고정한 70B 모델의 BF16 weight는 약 130.4GiB입니다. 여기까지만 보면
          192GB급 가속기에도 들어갈 것 같습니다. 그러나 서비스는 weight만 저장하지
          않습니다. 여덟 요청이 각자 32K 문맥을 기억하는 KV cache와 allocator,
          kernel workspace도 같은 HBM을 씁니다.
        </p>
        <p className="leading-7">
          아래 계산은 모든 70B 모델의 공통값이 아닙니다. 이해를 위해 80 layer,
          KV head 8개, head dimension 128인 Llama 계열 구조를 가정합니다. 모델의
          layer 수나 KV head 수가 다르면 해당 값부터 바꿔야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="70B·32K·동시 요청 8개의 한 장 실행에 최소 몇 byte가 필요한가요?"
        idea="고정된 weight와 요청마다 늘어나는 KV cache를 먼저 더합니다. 이 결과는 runtime 여유를 넣기 전의 최소선입니다."
        formula={String.raw`S_{\min}=P b_w+B L\left(2n_{\mathrm{layer}}n_{\mathrm{kv}}d_{\mathrm{head}}b_{\mathrm{kv}}\right)`}
        annotatedFormula={String.raw`\underbrace{S_{\min}}_{\text{최소 HBM}}=\overbrace{P b_w}^{\text{weight}}+\overbrace{B L\left(2n_{\mathrm{layer}}n_{\mathrm{kv}}d_{\mathrm{head}}b_{\mathrm{kv}}\right)}^{\text{모든 요청의 KV cache}}`}
        operations={[
          {
            expression: String.raw`70\times10^9\times2\div2^{30}\approx130.4\ \mathrm{GiB}`,
            annotation: "70B개 BF16 weight가 차지하는 이진 단위 용량입니다.",
          },
          {
            expression: String.raw`2\times80\times8\times128\times2=327{,}680\ \mathrm{byte/token}`,
            annotation: "한 token에서 K와 V가 80개 layer에 남기는 cache입니다.",
          },
          {
            expression: String.raw`8\times32{,}768\times327{,}680\div2^{30}=80\ \mathrm{GiB}`,
            annotation: "요청 8개의 32K 문맥이 차지하는 KV cache 합계입니다.",
          },
          {
            expression: String.raw`130.4+80=210.4\ \mathrm{GiB}`,
            annotation: "Allocator·workspace·fragmentation 여유를 더하기 전부터 필요한 최소량입니다.",
          },
        ]}
        terms={[
          { symbol: "P", name: "파라미터 수", description: "이 사례에서는 70×10⁹개입니다." },
          { symbol: String.raw`b_w`, name: "weight 한 개의 byte", description: "BF16이므로 2 byte입니다." },
          { symbol: "B", name: "동시 요청 수", description: "같이 cache를 유지하는 요청 8개입니다." },
          { symbol: "L", name: "요청당 문맥 길이", description: "각 요청의 32,768 token입니다." },
          { symbol: String.raw`n_{\mathrm{layer}}`, name: "layer 수", description: "가정한 모델의 80개 layer입니다." },
          { symbol: String.raw`n_{\mathrm{kv}}`, name: "KV head 수", description: "GQA 구조에서 K·V를 저장하는 head 8개입니다." },
          { symbol: String.raw`d_{\mathrm{head}}`, name: "head 차원", description: "head 하나가 가진 값 128개입니다." },
          { symbol: String.raw`b_{\mathrm{kv}}`, name: "KV 값 한 개의 byte", description: "BF16 cache를 가정해 2 byte입니다." },
        ]}
        assumptions={[
          "모델 구조와 KV cache dtype을 고정한 단순 용량 계산입니다. 압축·window attention·cache offload를 쓰면 달라집니다.",
          "210.4GiB에는 runtime 예약, activation, kernel workspace, 통신 buffer와 fragmentation 여유가 들어 있지 않습니다.",
          "제품 문서의 GB와 이 계산의 GiB를 섞지 않습니다. 예를 들어 decimal 288GB는 약 268.2GiB입니다.",
        ]}
        interpretation="192GB·180GB·144GB·128GB급 후보는 이 사례의 한 장 경로에서 계산 전에 탈락합니다. 288GB급도 남는 약 57.8GiB 안에 runtime 여유가 실제로 들어가는지 실행으로 확인해야 합니다."
      />

      <MemoryViz />

      <h3 id="bandwidth-floor" className="mt-10 mb-3 scroll-mt-24 break-keep text-xl font-semibold">
        용량을 통과한 뒤에는 대역폭으로 decode 한 step의 낙관적 바닥을 봅니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          자기회귀 decode는 한 번에 다음 token 한 칸을 만듭니다. 같은 model weight를
          읽어 batch의 여러 요청을 함께 계산하면, 한 step이 끝날 때 요청마다 최대
          한 token씩 나옵니다. 그래서 batch가 커져도 한 요청의 token 간격이 8분의
          1로 줄지는 않습니다. 대신 같은 step에서 token을 최대 8개 얻으므로 전체
          처리량이 커집니다.
        </p>
      </div>

      <ExplainedFormula
        question="140GB weight와 유효 HBM 대역폭 8TB/s라면 decode 속도의 낙관적 바닥은 어디인가요?"
        idea="한 batch step에서 weight를 한 번 읽는다고 단순화한 뒤, step 시간과 전체 token 처리량을 따로 계산합니다."
        formula={String.raw`T_{\mathrm{step}}\ge\frac{S_w}{W_{\mathrm{eff}}},\qquad Q_{\mathrm{token}}\le\frac{B W_{\mathrm{eff}}}{S_w}`}
        annotatedFormula={String.raw`\underbrace{T_{\mathrm{step}}}_{\text{요청별 token 간격의 바닥}}\ge\frac{\overbrace{S_w}^{\text{읽을 weight byte}}}{\underbrace{W_{\mathrm{eff}}}_{\text{실제 유효 대역폭}}},\qquad\underbrace{Q_{\mathrm{token}}}_{\text{batch 전체 token/s 상한}}\le\frac{\overbrace{B}^{\text{step당 최대 token 수}}W_{\mathrm{eff}}}{S_w}`}
        operations={[
          {
            expression: String.raw`140\ \mathrm{GB}\div8\ \mathrm{TB/s}=0.0175\ \mathrm{s}`,
            annotation: "한 step이 weight를 읽는 데만 최소 17.5ms가 걸린다는 뜻입니다.",
          },
          {
            expression: String.raw`1\div0.0175\approx57.1\ \mathrm{token/s\ per\ sequence}`,
            annotation: "요청 하나가 보는 낙관적 생성 속도입니다. Batch 8로 다시 나누지 않습니다.",
          },
          {
            expression: String.raw`8\div0.0175\approx457\ \mathrm{token/s}`,
            annotation: "한 step에서 최대 8 token을 얻는 batch 전체의 낙관적 처리량입니다.",
          },
        ]}
        terms={[
          { symbol: String.raw`T_{\mathrm{step}}`, name: "Decode step 시간", description: "Batch의 모든 요청이 다음 token 한 칸을 계산하는 시간입니다." },
          { symbol: String.raw`S_w`, name: "읽을 weight 크기", description: "예시에서는 decimal 단위 140GB입니다." },
          { symbol: String.raw`W_{\mathrm{eff}}`, name: "유효 HBM 대역폭", description: "Peak가 아니라 해당 kernel이 실제로 얻은 byte/s입니다." },
          { symbol: "B", name: "Batch 크기", description: "이 사례에서는 동시에 한 step을 도는 요청 8개입니다." },
          { symbol: String.raw`Q_{\mathrm{token}}`, name: "전체 token 처리량", description: "Batch 전체가 1초에 완료하는 출력 token 수입니다." },
        ]}
        assumptions={[
          "같은 weight를 batch가 공유하고 memory read가 지배하는 decode 구간을 가정합니다.",
          "140GB와 8TB/s는 계산 원리를 보이기 위한 decimal 단위 예시이며 특정 제품 실측값이 아닙니다.",
          "실제 step에는 KV cache 읽기, 연산, 통신, scheduler와 kernel 비효율이 더해지므로 지연은 커지고 처리량은 작아집니다.",
        ]}
        interpretation="17.5ms와 457 token/s는 제품 성능 약속이 아니라 넘기 어려운 낙관적 경계입니다. 후보 비교에서는 같은 batch·문맥·정밀도로 p95 TPOT와 실제 tokens/s를 다시 잽니다."
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          이제 첫 꼬리 질문이 생깁니다. 210.4GiB와 실행 여유가 한 장에 들어가지
          않으면 어떻게 해야 할까요? 모델을 여러 장에 나누고, 다음 절에서 그
          조각들이 매 layer마다 어느 연결 범위에서 얼마나 자주 통신하는지 봅니다.
        </p>
      </div>
    </section>
  );
}
