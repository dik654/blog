import ExplainedFormula from "@/components/ui/explained-formula";

export default function ForwardPass() {
  return (
    <section id="forward-pass" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Forward pass는 예측과 backward tape를 함께 만든다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Forward pass는 입력에서 출력까지 activation을 계산한다. Training에서는
          여기에 한 가지 책임이 더 있다. Backward가 local derivative를 계산할 때
          다시 사용할 input·pre-activation·mask 같은 값을 graph에 보관해야 한다.
          따라서 inference와 training이 같은 산술식을 실행해도 memory 사용량은
          크게 달라질 수 있다.
        </p>
      </div>

      <ExplainedFormula
        question="linear layer의 forward가 backward에 필요한 어떤 값을 남겨야 할까?"
        idea={<>matrix multiplication으로 pre-activation Z를 만들고 activation f를 적용합니다. Weight gradient에는 X가, activation backward에는 Z 또는 A가 필요하므로 framework는 이 tensor들을 saved state로 보관합니다.</>}
        formula={String.raw`Z=XW+\mathbf 1b^\top,\qquad A=f(Z)`}
        terms={[
          { symbol: "X\\in\\mathbb R^{B\\times D_{in}}", name: "batch input", description: "B개 sample의 input 또는 이전 layer activation입니다." },
          { symbol: "W\\in\\mathbb R^{D_{in}\\times D_{out}}", name: "weight", description: "batch 전체가 공유하는 trainable parameter입니다." },
          { symbol: "b\\in\\mathbb R^{D_{out}}", name: "bias", description: "batch dimension으로 broadcast됩니다." },
          { symbol: "Z,A", name: "saved activations", description: "Z는 nonlinearity 전 값, A는 적용 후 값입니다." },
        ]}
        assumptions={["row-major batch 표기이며 framework에 따라 weight를 transpose해 저장할 수 있습니다."]}
        interpretation="forward activation memory가 training memory의 큰 비중을 차지하는 이유는 backward가 local derivative를 계산할 때 이 중간값을 다시 사용하기 때문입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Activation checkpointing은 일부 중간값을 저장하지 않고 backward 때
          forward를 다시 계산해 memory를 줄이는 대신 compute를 더 쓰는
          trade-off다. 즉 gradient 공식을 바꾸지 않고 tape의 저장 정책을 바꾼다.
          In-place operation이나 detach가 문제가 되는지도 이 graph와 saved tensor의
          수명 관점에서 확인해야 한다.
        </p>
      </div>
    </section>
  );
}
