import VideoTransformerViz from "./viz/VideoTransformerViz";

export default function VideoTransformer() {
  return (
    <section id="video-transformer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Video transformer는 tubelet 수와 attention pattern이 계산량을 결정합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Video transformer는 연속된 frame의 작은 공간 patch를 tubelet으로 묶어 token으로 바꿉니다. 시간 해상도를 높이거나 spatial patch를 작게 만들면 token 수가 빠르게 늘어나며, 모든 시공간 token을 한 번에 연결하는 joint attention의 비용은 token 수의 제곱에 비례합니다.
        </p>
        <p>
          그래서 실제 설계에서는 공간과 시간 attention을 나눕니다. TimeSformer의 divided attention은 같은 공간 위치의 시간 관계와 같은 frame 안의 공간 관계를 한 block 안에서 차례로 계산합니다. ViViT의 factorized encoder는 spatial encoder와 temporal encoder 자체를 분리합니다. 어느 방식이 항상 우월한 것이 아니라 clip 길이, spatial resolution과 구현 효율에 따라 결과가 달라집니다.
        </p>
      </div>
      <ExplainedFormula
        question="Video를 tubelet으로 바꾸면 token 수와 joint attention pair는 얼마나 될까?"
        idea={<>시간 τ frame, 공간 P×P pixel을 한 tubelet로 묶습니다. 시간·높이·너비 축의 tubelet 개수를 곱하면 total token 수가 됩니다.</>}
        formula={String.raw`\begin{aligned}
N_t&=T/\tau,\\
N_s&=(H/P)(W/P),\\
N&=N_tN_s,\\
C_{\mathrm{joint}}&=N^2.
\end{aligned}`}
        terms={[
          { symbol: "τ", name: "tubelet temporal size", description: "Token 하나가 묶는 연속 frame 수입니다." },
          { symbol: "P", name: "spatial patch size", description: "Token 하나가 묶는 patch 한 변의 pixel 수입니다." },
          { symbol: "T,H,W", name: "clip shape", description: "Model input의 frame 수, height, width입니다." },
          { symbol: "N", name: "video token count", description: "Joint attention sequence에 들어가는 spatiotemporal token 수입니다." },
        ]}
        assumptions={["T는 τ로, H·W는 P로 나누어떨어지는 non-overlapping tubelet입니다.", "Special token은 생략했습니다.", "N²은 dense score pair proxy이며 projection·MLP·kernel 효율은 포함하지 않습니다."]}
        interpretation="T=16, τ=2, H=W=224, P=16이면 8×14×14=1,568 tokens와 약 246만 score pairs입니다. Image ViT보다 temporal axis가 그대로 곱해집니다."
      />
      <div className="not-prose my-8"><VideoTransformerViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>VideoMAE는 높은 masking ratio로 video pretraining 비용을 줄입니다</h3>
        <p>
          인접 frame은 중복이 많기 때문에 VideoMAE는 tube masking으로 입력 대부분을 가리고 보이는 token만 encoder에 전달합니다. Decoder는 가려진 tubelet을 복원하며 representation을 학습합니다. 논문에서 효과적이었던 masking ratio를 모든 데이터에 그대로 적용하기보다 motion 속도와 영상 중복 정도에 맞춰 재검증합니다.
        </p>
        <h3>Accuracy와 함께 token budget을 보고합니다</h3>
        <p>
          Joint, divided, factorized attention을 비교할 때는 frame 수, crop resolution, tubelet size와 test-time clip 수를 함께 공개해야 합니다. 사전학습 checkpoint를 사용할 때는 normalization, frame rate와 positional embedding 보간 방식도 checkpoint contract에 포함합니다. 그래야 architecture 개선과 더 큰 입력 예산의 효과를 구분할 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="공간과 시간 attention을 나누면 score pair의 성장식은 어떻게 달라질까?"
        idea={<>한 frame의 S개 spatial token끼리 attention하는 일을 T번, 같은 spatial 위치의 T개 temporal token끼리 attention하는 일을 S번 수행합니다.</>}
        formula={String.raw`\begin{aligned}
C_{\mathrm{space}}&\propto TS^2,\\
C_{\mathrm{time}}&\propto ST^2,\\
C_{\mathrm{divided}}&=C_{\mathrm{space}}+C_{\mathrm{time}},\\
C_{\mathrm{joint}}&\propto(TS)^2.
\end{aligned}`}
        terms={[
          { symbol: "T", name: "temporal token positions", description: "Tubelet 변환 뒤 시간축 위치 수입니다." },
          { symbol: "S", name: "spatial tokens per time", description: "한 temporal position 안의 patch token 수입니다." },
          { symbol: "Cdivided", name: "factorized score cost", description: "Spatial attention T회와 temporal attention S회의 pair count proxy입니다." },
          { symbol: "Cjoint", name: "joint score cost", description: "모든 TS token을 한 번에 연결하는 pair count proxy입니다." },
        ]}
        assumptions={["Dense attention score pair만 비교하고 embedding dimension·heads·memory traffic은 생략합니다.", "Divided block의 두 attention을 모두 계산합니다.", "비용 감소가 같은 표현력이나 동일 latency를 보장하지 않습니다."]}
        interpretation="Factorization은 모든 space-time pair의 직접 연결을 두 축의 연속 interaction으로 바꿉니다. 따라서 정확도 비교에서는 같은 T·S·test clip 수를 유지해야 합니다."
      />
      <div id="paper-timesformer" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">논문 읽기 · TimeSformer</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Bertasius 등은 video patch에 self-attention을 적용하고 여러 space–time attention scheme을 비교했습니다. Divided attention 결과는 논문의 pretraining·clip·resolution 조건 안에서 읽어야 합니다.</p><a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.mlr.press/v139/bertasius21a.html" target="_blank" rel="noreferrer">Attention factorization과 평가 범위 보기</a></div>
      <div id="paper-videomae" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">논문 읽기 · VideoMAE</p><p className="mt-2 text-sm leading-6 text-muted-foreground">VideoMAE는 temporal redundancy를 활용해 높은 비율의 tubelet을 가리고 visible token만 encoder에 전달하는 self-supervised pretraining을 구성했습니다. 보고된 masking ratio를 motion 특성이 다른 data의 고정 default로 확대하지 않습니다.</p><a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openreview.net/forum?id=AhccnBXSne" target="_blank" rel="noreferrer">Tube masking·pretraining·transfer 범위 보기</a></div>
    </section>
  );
}
import ExplainedFormula from "@/components/ui/explained-formula";
