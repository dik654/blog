import CNN3DViz from "./viz/CNN3DViz";

export default function CNN3D() {
  return (
    <section id="3dcnn" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">3D convolution은 공간 필터에 시간 방향 receptive field를 더합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          2D encoder와 pooling은 frame 순서를 충분히 표현하지 못할 수 있습니다. 3D convolution은 kernel을 시간·높이·너비 방향으로 움직여 짧은 motion pattern을 직접 학습합니다. 다만 계산량과 activation memory가 커지므로, 먼저 같은 frame budget의 2D baseline보다 일관되게 나은지 확인합니다.
        </p>
        <p>
          I3D는 2D image kernel을 시간축으로 확장해 image pretraining을 video model의 초기값으로 활용했습니다. R(2+1)D는 하나의 3D convolution을 spatial convolution과 temporal convolution으로 나누고 사이에 비선형성을 넣습니다. 이 factorization은 단순한 파라미터 절감 공식이 아니라 최적화와 표현 구조를 바꾸는 선택이므로 동일한 FLOPs와 data recipe에서 비교해야 합니다.
        </p>
      </div>
      <ExplainedFormula
        question="한 3D convolution output이 원본 시간축의 몇 초를 직접 볼까?"
        idea={<>Temporal kernel kₜ의 sample 위치가 dilation dₜ만큼 떨어져 있으므로 첫 위치에서 마지막 위치까지 1+(kₜ−1)dₜ개의 sampled-frame span을 봅니다.</>}
        formula={String.raw`\begin{aligned}
R_t&=1+(k_t-1)d_t,\\
D_{\mathrm{span}}&=\frac{(R_t-1)s}{f_{\mathrm{src}}}.
\end{aligned}`}
        terms={[
          { symbol: "kₜ", name: "temporal kernel size", description: "한 convolution이 읽는 temporal sample 위치 수입니다." },
          { symbol: "dₜ", name: "temporal dilation", description: "Kernel sample 사이의 sampled-frame 간격입니다." },
          { symbol: "s/fsrc", name: "sample time step", description: "Sampling stride를 적용한 인접 model frame 사이의 실제 second입니다." },
          { symbol: "Rₜ", name: "sampled-frame span", description: "첫 kernel 위치부터 마지막 위치까지 포함하는 sampled-frame index 폭입니다." },
          { symbol: "Dspan", name: "timestamp span", description: "첫 관측 timestamp와 마지막 관측 timestamp 사이의 실제 second입니다." },
        ]}
        assumptions={["한 layer의 direct span이며 여러 stride layer가 쌓인 network 전체 receptive field는 재귀적으로 계산합니다.", "Padding은 span 크기를 바꾸지 않지만 boundary에서 실제 관측 frame 수를 줄일 수 있습니다.", "Theoretical span 안의 모든 frame이 prediction에 같은 영향을 준다는 뜻은 아닙니다."]}
        interpretation="30 fps, sampling stride 2, kₜ=3, dilation 1이면 source frame index 0·2·4를 읽습니다. Rₜ=3이고 첫·마지막 timestamp span은 4/30≈.133초입니다. Layer를 쌓거나 temporal stride를 늘리면 전체 receptive field가 확장됩니다."
      />
      <div className="not-prose my-8"><CNN3DViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>SlowFast는 의미와 motion을 서로 다른 시간 해상도로 읽습니다</h3>
        <p>
          Slow pathway는 낮은 frame rate에서 비교적 풍부한 channel로 object와 scene semantics를 읽고, Fast pathway는 높은 frame rate에서 가벼운 channel로 빠른 변화를 읽습니다. 두 경로 사이의 lateral connection이 시간 정보를 결합합니다. 구체적인 frame-rate 비율과 channel 비율은 논문의 고정 규칙이 아니라 target event와 latency에 맞춰 검증할 hyperparameter입니다.
        </p>
        <p>
          짧은 동작과 긴 상태 변화가 함께 있다면 단일 clip score만 보지 말고 event duration별 recall을 나눠 봅니다. 여기서 개선이 없다면 더 복잡한 3D backbone보다 sampling이나 영상 단위 aggregation을 먼저 고치는 편이 낫습니다.
        </p>
      </div>
      <ExplainedFormula
        question="SlowFast는 두 pathway의 frame rate와 channel capacity를 어떻게 분리할까?"
        idea={<>Fast path는 Slow path보다 α배 많은 frame을 보되 channel은 β배만 사용해 빠른 motion을 읽는 비용을 제한합니다.</>}
        formula={String.raw`T_{\mathrm{fast}}=\alpha T_{\mathrm{slow}},\qquad C_{\mathrm{fast}}=\beta C_{\mathrm{slow}}`}
        terms={[
          { symbol: "α", name: "frame-rate ratio", description: "Fast path가 Slow path보다 시간축을 얼마나 촘촘하게 보는지 나타냅니다." },
          { symbol: "β", name: "channel ratio", description: "Fast path channel capacity가 Slow path의 몇 배인지 나타내며 보통 1보다 작습니다." },
          { symbol: "T,C", name: "temporal samples and channels", description: "각 pathway의 frame 수와 feature channel 수입니다." },
        ]}
        assumptions={["두 pathway가 같은 원본 시간 구간을 서로 다른 sampling rate로 관측합니다.", "Lateral connection의 location과 transform을 architecture contract에 기록합니다.", "α·β의 식은 resource allocation이며 실제 FLOPs·latency는 stage geometry와 runtime에서 측정합니다."]}
        interpretation="α=8, β=1/8이면 Fast path는 8배 촘촘한 시간축을 1/8 channel로 읽습니다. 이 비율이 모든 event에 최적이라는 뜻은 아니며 duration·motion slice에서 검증해야 합니다."
      />
      <div id="paper-i3d" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">논문 읽기 · I3D와 Kinetics</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Carreira와 Zisserman은 2D ConvNet filter를 3D로 inflate하고 Kinetics video pretraining 뒤 smaller action benchmarks로 transfer했습니다. Architecture 효과는 Kinetics 규모와 pretraining을 떼어 보편적 3D 우월성으로 읽지 않습니다.</p><a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openaccess.thecvf.com/content_cvpr_2017/html/Carreira_Quo_Vadis_Action_CVPR_2017_paper.html" target="_blank" rel="noreferrer">Inflation·Kinetics·transfer 범위 보기</a></div>
      <div id="paper-r2plus1d" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">논문 읽기 · R(2+1)D</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Tran 등은 3D convolution을 2D spatial과 1D temporal convolution으로 나누고 중간 비선형성을 추가해 optimization과 representation을 비교했습니다. Factorization은 단순한 동일 함수의 빠른 구현이 아닙니다.</p><a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openaccess.thecvf.com/content_cvpr_2018/html/Tran_A_Closer_Look_CVPR_2018_paper.html" target="_blank" rel="noreferrer">Factorization과 controlled comparison 보기</a></div>
      <div id="paper-slowfast" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">논문 읽기 · SlowFast</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Feichtenhofer 등은 low-rate Slow semantic path와 lightweight high-rate Fast motion path를 lateral connection으로 결합했습니다. 논문의 Kinetics·Charades·AVA 설정 밖에서 α·β를 고정 default로 보지 않습니다.</p><a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openaccess.thecvf.com/content_ICCV_2019/html/Feichtenhofer_SlowFast_Networks_for_Video_Recognition_ICCV_2019_paper.html" target="_blank" rel="noreferrer">두 pathway의 rate·capacity ablation 보기</a></div>
    </section>
  );
}
import ExplainedFormula from "@/components/ui/explained-formula";
