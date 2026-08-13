import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { KIMI_K3_CONFIG } from "@/content/kimi-k3";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Kimi K3의 핵심은 2.8T라는 크기보다 세 방향의 비용을 따로 재배분한 데 있다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Kimi K3는 전체 2.8T parameter 가운데 token마다 104B를 활성화하는 native multimodal MoE입니다. 이 숫자만 보면 “expert를 많이 둔 큰 sparse model”로 끝나기 쉽지만, technical report의 설계는 세 문제를 따로 다룹니다. 긴 sequence는 Kimi Delta Attention(KDA)과 Gated Multi-head Latent Attention(MLA)이 나눠 처리하고, 깊은 network의 정보 경로는 Attention Residuals가 다시 선택하며, 넓은 expert 공간은 Stable LatentMoE가 작은 latent width로 압축합니다.
        </p>
        <p className="leading-8">
          따라서 이 글의 질문은 “K3가 얼마나 큰가”가 아니라 “각 축에서 무엇을 줄였고, 줄이는 과정에서 잃을 수 있는 정보를 어떤 장치로 보강했는가”입니다. MoE의 expert·router·Top-k·load·통신 기본기는 <Link to="/ai/mixture-of-experts">Mixture-of-Experts 정본</Link>이 소유하며, 여기서는 K3가 그 위에 추가한 latent path와 안정화 방법만 다룹니다.
        </p>
      </div>

      <OverviewViz />

      <div className="not-prose my-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {KIMI_K3_CONFIG.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border/70 bg-card p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <strong className="mt-1.5 block text-sm leading-5 text-foreground">{value}</strong>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          위 수치는 공식 repository와 report의 model configuration을 한 manifest에서 렌더링합니다. 93개 main layer 중 첫 layer는 dense이고, attention layer는 69 KDA와 24 Gated MLA로 구성됩니다. Hidden size는 7,168, attention head는 96개이며, MoE는 896개 routed expert 중 16개와 shared expert 2개를 사용합니다. Context limit은 1,048,576 token이고, weight MXFP4·activation MXFP8 조건을 포함한 quantization-aware training(QAT)을 적용했습니다.
        </p>
        <p className="leading-8">
          공식 report는 K2와 같은 loss에 도달하는 compute 비율을 근거로 약 2.5배의 overall scaling efficiency를 제시하지만, 이는 architecture·data·training을 합친 종합 결과입니다. KDA 하나나 3:1 schedule 하나의 독립적인 인과 효과로 바꾸어 말하면 안 됩니다. 또한 repository의 공개 weight에는 별도의 Kimi K3 License가 적용되므로, model card의 구조 정보와 사용 조건도 분리해서 확인해야 합니다.
        </p>
      </div>

      <div id="paper-kimi-k3" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · Kimi K3 Technical Report</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 report가 풀려는 문제는 frontier model을 sequence length·network depth·expert width로 동시에 확장하면서 training·inference cost와 안정성을 감당하는 것입니다. KDA+Gated MLA, Block AttnRes, Stable LatentMoE와 data·optimizer·post-training recipe를 하나의 2.8T model에서 결합한 것이 핵심 기여입니다. 공개 configuration과 실험은 결합된 system의 결과를 보여 주지만, 모든 component의 full-scale 독립 ablation이나 다른 model family에서의 보편적 우위를 증명하지는 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2607.24653" target="_blank" rel="noreferrer">
          공식 report의 model configuration과 실험 범위 보기
        </a>
      </div>

      <ContentBoundary article="kimi-k3-architecture" />
    </section>
  );
}
