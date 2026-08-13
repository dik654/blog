import ExplainedFormula from "@/components/ui/explained-formula";
import WarmupViz from "./viz/WarmupViz";

export default function Warmup() {
  return (
    <section id="warmup" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Warmup은 초기의 큰 update를 늦추지만 문제 원인을 대신 해결하지는 않습니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          학습 초반에는 model representation과 optimizer state가 충분한 history를
          쌓지 못했습니다. Warmup은 처음 W updates 동안 LR를 peak까지 올려 초기
          이동을 제한합니다. 다만 NaN의 원인이 잘못된 loss scale·data·normalization·
          과도한 peak LR라면 warmup을 길게 하는 것만으로 문제를 감추지 말고 해당
          원인을 먼저 분리해야 합니다.
        </p>
        <p>
          가장 단순한 linear warmup은 step 비율에 따라 rate를 선형 증가시킵니다.
          이후 constant, linear, cosine, inverse-square-root decay 같은 본 schedule로
          넘깁니다. 두 scheduler를 연결할 때 경계에서 rate가 튀지 않는지와
          <code>last_epoch</code> 또는 global step의 의미를 확인합니다.
        </p>
      </div>
      <ExplainedFormula
        question="Linear warmup과 본 schedule을 한 번의 연속된 LR 함수로 어떻게 연결할까?"
        idea={<>W updates까지는 start에서 peak로 선형 이동하고, 그 다음에는 남은 T−W updates에 맞춰 본 schedule S를 진행합니다. 두 구간의 경계값을 peak로 같게 두면 LR가 갑자기 뛰지 않습니다.</>}
        formula={String.raw`\begin{aligned}
r_t&=t/W,\\
\eta_t&=I(\eta_{\mathrm{start}},\eta_{\mathrm{peak}};r_t),\\[-1pt]
&\hspace{4.5em}0\le t\le W,\\[5pt]
k&=t-W,\quad L=T-W,\\
\eta_t&=S(k;L),\\[-1pt]
&\hspace{4.5em}W<t\le T.
\end{aligned}`}
        terms={[
          { symbol: "W", name: "warmup updates", description: "Start LR에서 peak LR까지 올리는 optimizer update 수입니다." },
          { symbol: "T", name: "total updates", description: "Warmup과 본 schedule을 모두 포함한 run의 update budget입니다." },
          { symbol: "I(a,b;r)", name: "linear interpolation", description: "진행률 r에 따라 start a에서 end b까지 선형으로 이동하는 함수입니다." },
          { symbol: "S(k;L)", name: "main schedule", description: "길이 L의 local step k에서 값을 내는 cosine·linear·constant 등의 함수입니다." },
          { symbol: "η_start,η_peak", name: "boundary learning rates", description: "Warmup 시작값과 본 schedule 첫 값입니다." },
        ]}
        assumptions={["W<T이며 t는 optimizer update index입니다.", "S(0;T−W)=ηpeak가 되도록 경계 convention을 맞춥니다.", "Resume 시 global update와 두 scheduler의 state를 함께 복원합니다."]}
        interpretation="전체 T를 그대로 cosine T_max로 쓰고 앞에 W를 추가하면 의도한 종료점이 밀립니다. 본 schedule의 local clock은 t−W이고 길이는 T−W입니다."
      />
      <div className="not-prose my-8"><WarmupViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Warmup은 필수가 아니라 안정성 도구입니다</h3>
        <p>
          Adam류에서는 bias-corrected first moment를 second moment의 제곱근으로
          나눈 방향에 LR를 곱합니다. 초기 history가 짧을 때 이 정규화 방향의
          크기가 예상보다 클 수 있으므로 warmup이 안정화에 도움을 줄 수 있지만,
          필요한 길이는 β₂·parameterization·batch와 gradient 통계에 의존합니다.
        </p>
        <p>
          실험 기록에는 warmup steps, peak LR, decay 종류, final LR과 total
          updates를 한 묶음으로 남깁니다. 이 정보가 있어야 batch나 world size를
          바꾼 뒤에도 같은 schedule을 재구성할 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="Adam 계열에서 warmup이 직접 줄이는 것은 무엇일까?"
        idea={<>Warmup은 moment를 바꾸는 대신 정규화된 optimizer 방향 앞의 ηt를 작게 둡니다. 따라서 초기 update magnitude는 줄지만, 잘못된 gradient나 numerical overflow 자체가 사라지는 것은 아닙니다.</>}
        formula={String.raw`\begin{aligned}u_t&=\frac{\widehat m_t}{\sqrt{\widehat v_t}+\varepsilon},\\\Delta\theta_t&=-\eta_tu_t.\end{aligned}`}
        terms={[
          { symbol: "m̂_t", name: "bias-corrected first moment", description: "최근 gradient 방향의 지수 이동 평균을 초기 bias에 맞춰 보정한 값입니다." },
          { symbol: "v̂_t", name: "bias-corrected second moment", description: "최근 squared gradient scale의 지수 이동 평균을 보정한 값입니다." },
          { symbol: "ε", name: "numerical stabilizer", description: "분모가 0에 가까워지는 일을 막는 optimizer 상수입니다." },
          { symbol: "η_tu_t", name: "scheduled update", description: "Warmup이 직접 작게 만드는 실제 optimizer step의 핵심 항입니다." },
        ]}
        assumptions={["표시는 Adam류의 핵심 항을 단순화했으며 decoupled weight decay 등 추가 update는 별도입니다.", "Moment bias correction을 사용한다는 설정입니다.", "Update magnitude는 coordinate별 값과 전체 parameter norm으로 모두 관측할 수 있습니다."]}
        interpretation="Warmup 효과는 LR만 보지 말고 ‖Δθt‖/‖θt‖, gradient norm, overflow와 loss spike가 함께 줄었는지 확인해야 설명할 수 있습니다."
      />
      <div id="paper-untuned-warmup" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Untuned Warmup for Adaptive Optimization</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Ma와 Yarats는 Adam warmup의 필요성을 adaptive LR variance만으로 설명하는 주장에 반론을 제기하고 update term의 크기를 중심으로 분석했습니다. 여러 practical setting에서 simple untuned linear warmup과 RAdam을 비교했지만, 제안한 rule of thumb이 모든 architecture와 optimizer의 최적 W라는 뜻은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1910.04209" target="_blank" rel="noreferrer">Update magnitude 분석과 실험 범위 보기</a>
      </div>
    </section>
  );
}
