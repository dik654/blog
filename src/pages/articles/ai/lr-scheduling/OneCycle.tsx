import ExplainedFormula from "@/components/ui/explained-formula";
import OneCycleViz from "./viz/OneCycleViz";

export default function OneCycle() {
  return (
    <section id="onecycle" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">OneCycle은 하나의 run 안에서 탐색과 감쇠를 끝냅니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          OneCycle은 초기 LR에서 max LR까지 올려 넓은 parameter 이동을 허용한 뒤,
          run 끝으로 갈수록 initial보다 훨씬 작은 LR까지 내립니다. Momentum을
          함께 조절할 때는 LR가 올라가는 동안 momentum을 낮추고, LR가 내려갈 때
          다시 높이는 반대 방향의 schedule을 사용합니다.
        </p>
        <p>
          원 논문은 큰 learning rate가 regularization처럼 작동해 일부 model과
          dataset에서 매우 빠른 수렴을 보인 현상을 super-convergence라고
          불렀습니다. 그러나 속도 배수나 일반화 이득은 보편적인 보장이 아니며,
          max LR이 과하면 즉시 발산할 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="OneCycle의 상승·하강 구간을 total update budget 안에서 어떻게 배치할까?"
        idea={<>전체 T updates 가운데 pT까지는 initial에서 max로, 나머지는 max에서 final로 보간합니다. 실제 구현은 linear 또는 cosine interpolation을 쓰므로 여기서는 경계와 진행률을 먼저 분리합니다.</>}
        formula={String.raw`\begin{aligned}
T_{\uparrow}&=\lfloor pT\rfloor,\\
r_{\uparrow}&=t/T_{\uparrow},\\
\eta_t&=I(\eta_{\mathrm{init}},\eta_{\max};r_{\uparrow}),\\[4pt]
r_{\downarrow}&=(t-T_{\uparrow})/(T-T_{\uparrow}),\\
\eta_t&=I(\eta_{\max},\eta_{\mathrm{final}};r_{\downarrow}).
\end{aligned}`}
        terms={[
          { symbol: "p", name: "rise fraction", description: "전체 updates 중 LR가 max에 도달할 때까지 사용하는 비율입니다." },
          { symbol: "r_↑,r_↓", name: "phase progress", description: "상승 구간과 하강 구간 안에서 각각 0부터 1까지 움직이는 local progress입니다." },
          { symbol: "I(a,b;r)", name: "interpolation", description: "해당 phase일 때 진행률 r에 따라 a에서 b로 이동하는 linear 또는 cosine 함수입니다." },
          { symbol: "η_init", name: "initial LR", description: "첫 update의 learning rate이며 max_lr와 div_factor로 정할 수 있습니다." },
          { symbol: "η_final", name: "final LR", description: "Run 끝에서 사용하는 매우 작은 rate이며 initial과 같은 값이 아닐 수 있습니다." },
        ]}
        assumptions={["첫 세 줄은 t≤T↑인 상승 phase, 다음 두 줄은 t>T↑인 하강 phase에 적용합니다.", "Total updates T를 run 전에 알며 scheduler는 optimizer update마다 정확히 한 번 호출합니다.", "PyTorch 기본 two-phase policy와 원 논문을 흉내 내는 three_phase=True는 같은 곡선이 아닙니다.", "Cycle momentum을 켤 때 optimizer가 momentum 또는 beta1 변경을 지원하는지 확인합니다."]}
        interpretation="OneCycle이라는 이름만 기록해서는 곡선을 복원할 수 없습니다. T·p·max_lr·div_factor·final_div_factor·interpolation·momentum 범위를 함께 저장해야 합니다."
      />
      <div className="not-prose my-8"><OneCycleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Max LR은 짧은 range test와 실제 run으로 확인합니다</h3>
        <p>
          Learning-rate range test는 작은 값에서 rate를 올리며 loss가 안정적으로
          감소하는 구간과 발산 지점을 찾는 진단입니다. 한 번의 noisy curve를
          정답으로 쓰지 않고 그보다 보수적인 후보를 실제 validation run에서
          비교합니다. Batch size와 optimizer가 바뀌면 test도 다시 해야 합니다.
        </p>
        <p>
          OneCycle은 total steps를 미리 알아야 하므로 streaming data나 종료
          시점이 불확실한 continual training에는 불편할 수 있습니다. Resume 시
          scheduler state와 global update를 함께 복원하지 않으면 cycle 위치가
          바뀝니다.
        </p>
      </div>
      <div id="paper-super-convergence" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Super-Convergence</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Smith와 Topin은 큰 maximum LR를 포함한 one-cycle policy가 CIFAR·MNIST·ImageNet의 여러 vision architecture에서 매우 빠른 학습을 만든 조건을 보고했습니다. 큰 LR가 regularization 역할을 했기 때문에 다른 regularization과의 균형도 조정했습니다. 논문의 속도 배수를 임의의 model·optimizer에 그대로 적용할 수는 없습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1708.07120" target="_blank" rel="noreferrer">Range test·regularization 조건·실험 보기</a>
      </div>
      <div id="docs-pytorch-onecycle" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 문서 따라 읽기 · PyTorch OneCycleLR</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">현재 OneCycleLR은 batch마다 update 뒤 호출하며 total_steps를 직접 받거나 epochs×steps_per_epoch로 추론합니다. Default는 two-phase fastai behavior이고 원 논문 형태는 three_phase=True로 선택합니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.OneCycleLR" target="_blank" rel="noreferrer">현재 parameter와 resume state 보기</a>
      </div>
    </section>
  );
}
