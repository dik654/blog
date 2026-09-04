import ExplainedFormula from "@/components/ui/explained-formula";
import LoopViz from "./viz/LoopViz";

export default function Loop() {
  return (
    <section id="loop" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Batch iteration과 optimizer update를 같은 step이라고 부르면 오류가 생깁니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Training phase에서는 <code>model.train()</code> 뒤 forward·loss·backward를
          수행하고, 정해진 accumulation이 끝났을 때 optimizer를 update합니다.
          Validation phase에서는 <code>model.eval()</code>과
          <code>torch.inference_mode()</code> 또는 <code>no_grad()</code> 안에서
          prediction과 metric만 계산합니다. <code>eval()</code>은 Dropout·BatchNorm의
          module behavior를 바꾸고, <code>inference_mode()</code>는 autograd 기록을
          끄므로 둘은 서로 대신하지 않습니다.
        </p>
        <p>
          Scheduler·logging·checkpoint 주기를 “step”으로 적는다면 그 step이 micro-batch iteration인지 optimizer update인지
          반드시 밝혀야 합니다. Gradient accumulation을 켜면 둘의 숫자가 달라지는데 이것이 resume 후 scheduler가 한 칸 밀리는 흔한 원인입니다.
        </p>
      </div>

      <div className="not-prose my-8"><LoopViz /></div>

      <ExplainedFormula
        question="Micro-batch를 A번 모을 때 실제 update가 보는 batch 크기는 얼마일까?"
        idea={<>Rank 하나의 micro-batch 크기 Bmicro를 A회 누적하고 W개 data-parallel rank가 서로 다른 sample의 gradient를 평균내면 한 optimizer update가 반영하는 sample 수가 곱으로 늘어납니다.</>}
        formula={String.raw`\begin{aligned}B_{\mathrm{effective}}&=B_{\mathrm{micro}}\times A\times W,\\\bar L&=\frac{1}{A}\sum_{r=1}^{A}L_r.\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}B_{\mathrm{effective}}&=\underbrace{B_{\mathrm{micro}}\times A\times W,}_{\text{accumulation steps 계산}}\\\bar L&=\underbrace{\frac{1}{A}\sum_{r=1}^{A}L_r.}_{\text{기준량당 비율}}\end{aligned}`}
        operations={[
          { expression: String.raw`B_{\mathrm{micro}}\times A\times W,`, annotation: ["accumulation steps이(가) 식의 결과에 기여하는","방식을 계산합니다.","Rank 하나의 micro-batch 크기 Bmicro를 A회","누적하고 W개 data-parallel rank가 서로 다른"] },
          { expression: String.raw`\frac{1}{A}\sum_{r=1}^{A}L_r.`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Rank 하나의 micro-batch 크기 Bmicro를 A회","누적하고 W개 data-parallel rank가 서로 다른","sample의 gradient를 평균내면 한 optimizer"] },
        ]}
        terms={[
          { symbol: "B_micro", name: "per-rank micro-batch", description: "한 rank가 forward/backward 한 번에 처리하는 sample 수입니다." },
          { symbol: "A", name: "accumulation steps", description: "Optimizer update 전에 gradient를 모으는 micro-batch 횟수입니다." },
          { symbol: "W", name: "data-parallel world size", description: "서로 다른 data shard를 처리하고 gradient를 reduce하는 rank 수입니다." },
          { symbol: "L̄", name: "normalized accumulated loss", description: "크기가 같은 micro-batch에서 각 loss를 A로 나눠 backward한 것과 같은 평균 objective입니다." },
        ]}
        assumptions={["각 rank와 micro-batch의 sample 수가 같고 DDP가 rank gradient를 평균냅니다.", "마지막 미완성 accumulation은 실제 sample count로 다시 정규화하거나 명시적으로 drop합니다.", "Token 수가 다른 sequence batch는 sample 평균 대신 valid-token numerator·denominator를 누적해야 할 수 있습니다."]}
        interpretation="Bmicro=16, A=4, W=8이면 optimizer는 update 한 번마다 명목상 512 samples의 평균 gradient를 반영합니다. Scheduler도 의도한 기준이 update라면 이때 한 번 움직입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>AMP에서는 scale을 제거한 실제 gradient를 clip합니다</h3>
        <p>
          현재 PyTorch API는 <code>torch.amp.autocast(&quot;cuda&quot;, ...)</code>와
          <code>torch.amp.GradScaler(&quot;cuda&quot;, ...)</code>입니다. Autocast는
          연산별로 낮은 precision 또는 FP32를 선택하며 model 전체를 무조건
          <code>half()</code>로 바꾸는 기능이 아닙니다. FP16의 작은 gradient가 0으로
          사라지는 문제를 줄이기 위해 loss scaling을 사용할 수 있습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Loss scaling이 learning rate를 바꾸지 않으면서 작은 FP16 gradient를 어떻게 지킬까?"
        idea={<>Backward 전에 loss를 s배 하면 gradient도 s배 커집니다. Optimizer가 사용하기 전에 다시 s로 나누면 원래 gradient가 복원되며, overflow가 발견되면 update를 건너뛰고 scale을 줄일 수 있습니다.</>}
        formula={String.raw`\begin{aligned}g_{\mathrm{scaled}}&=\nabla_{\theta}(sL)=s\nabla_{\theta}L,\\g&=g_{\mathrm{scaled}}/s.\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}g_{\mathrm{scaled}}&=\underbrace{\nabla_{\theta}(sL)=s\nabla_{\theta}L,}_{\text{unscaled loss 계산}}\\g&=\underbrace{g_{\mathrm{scaled}}/s.}_{\text{기준량당 비율}}\end{aligned}`}
        operations={[
          { expression: String.raw`\nabla_{\theta}(sL)=s\nabla_{\theta}L,`, annotation: ["unscaled loss이(가) 식의 결과에 기여하는 방식을","계산합니다.","Backward 전에 loss를 s배 하면 gradient도","s배 커집니다."] },
          { expression: String.raw`g_{\mathrm{scaled}}/s.`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Backward 전에 loss를 s배 하면 gradient도","s배 커집니다."] },
        ]}
        terms={[
          { symbol: "L", name: "unscaled loss", description: "원래 최적화하려는 batch objective입니다." },
          { symbol: "s", name: "loss scale", description: "작은 gradient를 FP16 표현 범위 안으로 올리기 위한 동적 배율입니다." },
          { symbol: "g_scaled", name: "scaled gradient", description: "Backward 직후 parameter에 저장된 scale 적용 gradient입니다." },
          { symbol: "g", name: "unscaled gradient", description: "Clip·optimizer update 전에 복원해야 하는 실제 gradient입니다." },
        ]}
        assumptions={["Scale s는 해당 backward 전체에 같은 값으로 적용됩니다.", "Gradient norm 계산과 clipping은 scaler.unscale_ 이후에 수행합니다.", "BF16은 FP16보다 지수 범위가 넓지만 NaN·Inf와 validation parity 검사는 여전히 필요합니다."]}
        interpretation="Scaled gradient를 그대로 clip하면 clip threshold의 의미가 s에 따라 바뀌므로 training dynamics가 의도와 달라집니다."
      />

      <div id="docs-pytorch-amp" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 문서 따라 읽기 · Automatic Mixed Precision</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          PyTorch 문서는 autocast를 forward와 loss 구간에 적용하고 backward는 context 밖에서 실행하도록 안내합니다. FP16을 GradScaler와 함께
          쓰는 일반 경로도 설명하지만 모든 model이 FP16 범위와 호환된다고 보장하지는 않습니다. Scale이 항상 1보다 크다는 보장도 없습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.pytorch.org/docs/stable/amp.html" target="_blank" rel="noreferrer">현재 AMP API와 op별 dtype 정책 보기</a>
      </div>
    </section>
  );
}
