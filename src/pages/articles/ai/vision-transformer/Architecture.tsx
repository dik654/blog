import ExplainedFormula from "@/components/ui/explained-formula";
import ArchitectureViz from "./viz/ArchitectureViz";

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">ViT 이후의 계보는 같은 구조의 세대교체가 아니라 서로 다른 병목에 대한 분기입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          DeiT는 ImageNet-1K 안에서 강한 augmentation·regularization과 teacher
          distillation을 결합해 supervised training recipe를 바꿨습니다. Swin은
          global attention 대신 local window와 shifted window, patch merging을
          사용해 high-resolution hierarchy를 만들었습니다. MAE는 label이 아니라
          가린 patch 복원으로 encoder를 사전학습했습니다. 해결한 문제가 다르므로
          이름을 한 줄의 단순한 진화 순서로 놓으면 핵심이 사라집니다.
        </p>
      </div>
      <ExplainedFormula
        question="DeiT의 distillation token은 teacher signal을 어디에 넣을까?"
        idea={<>Student는 class token head로 정답 label을 학습하는 동시에 별도의 distillation token head로 teacher prediction을 학습합니다. 두 loss의 결합 비율과 teacher 자체의 training data를 함께 봐야 data efficiency를 해석할 수 있습니다.</>}
        formula={String.raw`\begin{aligned}
\mathcal L_{\mathrm{cls}}&=\operatorname{CE}(y,p_{\mathrm{cls}}),\\
\mathcal L_{\mathrm{dist}}&=\operatorname{CE}(y_T,p_{\mathrm{dist}}),\\
\mathcal L&=(1-\lambda)\mathcal L_{\mathrm{cls}}+\lambda\mathcal L_{\mathrm{dist}}.
\end{aligned}`}
        terms={[
          { symbol: "p_cls", name: "class-token prediction", description: "Ground-truth class label을 읽는 student의 일반 classification head output입니다." },
          { symbol: "p_dist", name: "distillation-token prediction", description: "Teacher target을 읽도록 별도 token에서 만든 student output입니다." },
          { symbol: "y_T", name: "teacher target", description: "Teacher model이 image에 대해 만든 hard class 또는 soft distribution입니다." },
          { symbol: "λ", name: "distillation weight", description: "정답 supervision과 teacher supervision의 loss 기여를 조절합니다." },
        ]}
        assumptions={["설명을 위한 공통 loss 형태이며 DeiT의 hard/soft distillation과 inference head 결합 세부 설정을 구분합니다.", "Teacher architecture·checkpoint·training data와 augmentation이 전체 recipe 일부입니다.", "Teacher가 틀리는 slice에서는 student도 같은 오류를 전수받을 수 있습니다."]}
        interpretation="Distillation token은 attention 연산 자체를 바꾼 것이 아니라 서로 다른 supervision source를 token·head로 분리한 interface입니다."
      />
      <ExplainedFormula
        question="Swin의 window attention은 global attention의 pair 수를 얼마나 줄일까?"
        idea={<>N개 token 전체를 서로 비교하면 N² score가 필요합니다. 각 window에 M²개 token이 있고 window 수가 N/M²라면 score 수는 window당 M⁴, 전체 N·M²에 비례합니다.</>}
        formula={String.raw`\begin{aligned}
C_{\mathrm{global}}&\propto N^2,\\
C_{\mathrm{window}}&\propto \frac{N}{M^2}(M^2)^2=N M^2.
\end{aligned}`}
        terms={[
          { symbol: "N", name: "total tokens", description: "한 stage의 전체 spatial token 개수입니다." },
          { symbol: "M", name: "window side length", description: "각 local attention window의 token-grid 한 변이며 window 하나에는 M² token이 있습니다." },
        ]}
        assumptions={["모든 window 크기가 같고 padding·projection·MLP cost를 생략한 attention-score 지배항입니다.", "Shifted window는 다음 block에서 window partition을 이동해 이전 경계 사이의 정보 교환 경로를 만듭니다.", "한 block의 local attention만으로 모든 token이 직접 연결되는 것은 아닙니다."]}
        interpretation="Window attention의 장점은 단순히 score 수를 줄이는 데 있고, shifted partition과 여러 block이 global information propagation을 보완합니다."
      />
      <ExplainedFormula
        question="MAE가 75% mask ratio에서도 encoder pretraining compute를 줄일 수 있는 이유는 무엇일까?"
        idea={<>Mask token을 encoder 앞에 넣지 않고 visible token만 encoder에 보냅니다. Visible fraction이 v=1−ρ라면 encoder sequence는 vN, global attention score 항은 (vN)²가 됩니다.</>}
        formula={String.raw`\begin{aligned}
N_{\mathrm{vis}}&=(1-\rho)N=vN,\\
\frac{C_{\mathrm{attn,vis}}}{C_{\mathrm{attn,all}}}&\approx\frac{(vN)^2}{N^2}=v^2.
\end{aligned}`}
        terms={[
          { symbol: "ρ,v", name: "mask and visible fractions", description: "가린 patch 비율과 encoder가 실제로 읽는 patch 비율이며 v=1−ρ입니다." },
          { symbol: "N_vis", name: "visible-token count", description: "MAE encoder에 전달되는 원본 patch token 수입니다." },
          { symbol: "C_attn", name: "attention-score cost proxy", description: "Encoder global attention의 pairwise score 항만 비교한 근사 비용입니다." },
        ]}
        assumptions={["원 논문처럼 asymmetric encoder가 visible token만 처리하고 lightweight decoder가 mask token을 나중에 받습니다.", "전체 training cost에는 patch projection·MLP·decoder·memory overhead도 포함됩니다.", "높은 mask ratio가 임의 modality와 objective에서 최적이라는 보장은 없습니다."]}
        interpretation="ρ=.75이면 v=.25이고 attention-score 항은 단순 근사로 1/16입니다. 이것이 encoder를 크게 만들 수 있는 compute 여유를 주지만 전체 wall-time speedup과 같지는 않습니다."
      />
      <div className="not-prose my-8"><ArchitectureViz /></div>
      <div id="paper-deit" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">논문 읽기 · DeiT</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Touvron 등은 ImageNet-1K 중심의 강한 recipe와 convolutional teacher의 distillation token으로 external pretraining data 없이 경쟁력 있는 ViT 학습을 보였습니다. Teacher가 사용한 학습과 recipe cost까지 지운 채 student label 수만으로 data efficiency를 주장하지 않습니다.</p><a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.mlr.press/v139/touvron21a.html" target="_blank" rel="noreferrer">Distillation token과 recipe ablation 보기</a></div>
      <div id="paper-swin" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">논문 읽기 · Swin Transformer</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Liu 등은 non-overlapping local windows, shifted partition과 hierarchical patch merging으로 classification뿐 아니라 detection·segmentation backbone을 구성했습니다. Window complexity 식만으로 모든 hardware에서 faster latency를 보장하지는 않습니다.</p><a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openaccess.thecvf.com/content/ICCV2021/html/Liu_Swin_Transformer_Hierarchical_Vision_Transformer_Using_Shifted_Windows_ICCV_2021_paper.html" target="_blank" rel="noreferrer">Shifted window와 hierarchy 실험 보기</a></div>
      <div id="paper-mae" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">논문 읽기 · Masked Autoencoder</p><p className="mt-2 text-sm leading-6 text-muted-foreground">He 등은 높은 비율의 random patch를 가리고 visible patch만 큰 encoder에 넣은 뒤 작은 decoder가 pixel을 복원하는 asymmetric design을 제안했습니다. ImageNet-1K pretraining과 downstream transfer 결과를 모든 reconstruction target의 semantic quality 보장으로 확대하지 않습니다.</p><a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openaccess.thecvf.com/content/CVPR2022/html/He_Masked_Autoencoders_Are_Scalable_Vision_Learners_CVPR_2022_paper.html" target="_blank" rel="noreferrer">Visible-only encoder와 mask-ratio ablation 보기</a></div>
    </section>
  );
}
