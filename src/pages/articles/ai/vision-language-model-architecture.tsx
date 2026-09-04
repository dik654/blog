import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import VisionLanguageModelArchitectureViz from "./vision-language-model-architecture/viz/VisionLanguageModelArchitectureViz";

/**
 * VLM은 image patch를 projector로 LLM token에 맞춥니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function VisionLanguageModelArchitectureArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          VLM은 vision encoder·projector·LLM을 이어 붙여 만든 조립입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Vision-language model(VLM)은 image를 처리하는 <Link to="/ai/vision-transformer#patch-embedding">vision
            encoder</Link>와 text를 처리하는 LLM을 하나의 forward pass로 묶은 multimodal model입니다.
            둘 다 각자 사전학습된 채로 시작하기 때문에, 이 둘을 이어 붙이는 부품과 방식이 VLM 구조의
            핵심 질문이 됩니다.
          </p>
          <p>
            Image를 patch embedding sequence로 바꾸는 쪽이 vision encoder이고 LLM은 text token embedding sequence를
            입력받습니다. 두 sequence는 만들어진 차원도 학습된 분포도 다릅니다. 그래서 그 사이를 잇는 projector와 두 표현을 함께 추론할 수 있게 하는 alignment
            방식이 따로 필요합니다.
          </p>
          <p>
            이 글은 patch embedding이 projector를 거쳐 LLM token으로 바뀌는 조립 과정, projector가
            맞추는 차원 산수, 그리고 LLaVA·Flamingo·BLIP-2 세 계열이 image와 text를 결합하는 지점을
            어떻게 다르게 골랐는지를 다룹니다.
          </p>
        </div>
        <VisionLanguageModelArchitectureViz />
        <ContentBoundary article="vision-language-model-architecture" />
      </section>

      <section id="architecture" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Multimodal model 중 image·text만 다루는 것이 VLM입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이미지·텍스트·오디오처럼 서로 다른 modality를 함께 입력받아 하나의 모델로 처리하는 모델을 통틀어 multimodal model이라고 부릅니다. 그중 image와
            text 두 modality만 다루는 쪽을 vision-language model(VLM)이라고 좁혀 부릅니다.
          </p>
          <p>
            VLM은 대개 새 모델을 처음부터 학습하지 않습니다. <Link to="/ai/vision-transformer#patch-embedding">
            Vision transformer</Link> 글에서 다룬 patch embedding 절차로 image를 벡터 sequence로
            바꾸는 vision encoder(CLIP ViT-L/14 등)와, 이미 언어를 다루는 LLM(Vicuna 등)을 각각
            사전학습된 채로 가져와 하나의 파이프라인으로 묶습니다.
          </p>
          <p>
            두 모델을 단순히 나란히 두기만 하면 VLM이 되지는 않습니다. 같은 forward pass 안에서 image 표현과 text 표현이 함께 추론돼야, 즉 LLM이 image
            내용을 참조하며 다음 token을 예측할 수 있어야 VLM이라고 부릅니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Image에서 LLM token sequence까지 이어지는 VLM 조립"
          input={[
            "원본 image (H×W×C)",
            "사전학습된 vision encoder (예: CLIP ViT-L/14)",
            "projector (linear 또는 MLP)",
            "사전학습된 LLM (예: Vicuna)",
          ]}
          steps={[
            { code: "patches = split_into_patches(image, patch_size)", note: "Image를 P×P patch N개로 나눕니다. 224px 이미지를 patch 14로 나누면 16×16=256개입니다." },
            { code: "Z_v = vision_encoder(patches)", note: "Vision encoder가 각 patch를 D_v차원 embedding으로 바꿉니다. CLIP ViT-L/14는 1024차원입니다." },
            { code: "H_v = projector(Z_v)", note: "Projector가 D_v차원을 LLM hidden dimension D_t로 맞춥니다." },
            { code: "sequence = concat(H_v, text_embeddings)", note: "Visual token과 text token embedding을 순서대로 이어붙여 하나의 sequence로 만듭니다." },
            { code: "output = LLM(sequence)", note: "LLM이 image와 text가 섞인 sequence를 하나의 forward pass로 처리합니다." },
          ]}
          output="Image 내용을 참조한 LLM의 다음 token 확률 분포"
        />
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          이 pseudocode는 LLaVA처럼 visual token을 text token에 이어붙이는 concat 방식을 보여 줍니다.
          Flamingo·BLIP-2가 고르는 다른 결합 방식은{" "}
          <a href="#alignment">아래 alignment 절</a>에서 비교합니다.
        </p>
        <TermBreakdown
          title="Multimodal model·VLM·vision encoder의 위치"
          description="세 용어는 같은 조립 안에서 서로 다른 층위를 가리킵니다."
          items={[
            { term: "Multimodal Model", description: "여러 modality를 함께 입력받아 하나의 모델로 처리하는 모델 전체를 가리키는 상위 범주입니다.", example: "Image+text+audio를 함께 다루는 모델도 multimodal model입니다.", boundary: "modality가 두 개 이상이면 전부 이 범주에 들어가, VLM은 그 부분집합일 뿐입니다." },
            { term: "Vision-Language Model (VLM)", description: "Multimodal model 중 image와 text 두 modality만 다루는 모델입니다.", example: "LLaVA·Flamingo·BLIP-2 모두 image+text VLM입니다.", boundary: "Video·audio를 추가로 다루면 VLM이라는 이름만으로는 그 확장을 표현하지 못합니다." },
            { term: "Vision Encoder", description: "Image를 patch embedding sequence로 바꾸는, VLM 안의 한 구성 요소입니다.", example: "CLIP ViT-L/14가 224px 이미지를 256개의 1024차원 patch embedding으로 바꿉니다.", boundary: "Vision encoder 혼자서는 text를 다루지 못하며 VLM 전체가 아니라 그 부품입니다." },
          ]}
        />
      </section>

      <section id="projector" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Multimodal projector는 patch embedding 차원을 LLM hidden 차원에 맞춥니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Multimodal projector는 linear 또는 MLP 계층입니다. 여기서 vision encoder가 만든 patch embedding의 차원을 LLM의 hidden
            dimension에 맞춥니다. 그러면 LLM이 image 표현을 text token과 나란히 처리할 수 있는 형태가 됩니다.
          </p>
          <p>
            CLIP ViT-L/14는 224px 이미지 한 장에서 patch embedding을 1024차원으로 만듭니다. 이 글이 예로 쓰는 Vicuna-13B의 hidden
            dimension은 5120차원입니다. 차원이 다르니 두 벡터를 그대로 같은 sequence에 놓을 수 없습니다.
          </p>
          <p>
            LLaVA는 이 격차를 linear layer 하나(1024→5120)로 메웠고 뒤이은 LLaVA-1.5는 그 자리를 GELU를 하나 끼운 2-layer MLP로 바꿔 표현력을
            늘렸습니다. 두 방식 모두 vision encoder와 LLM 본체는 그대로 둔 채 이 다리 하나만 새로 학습합니다.
          </p>
        </div>
        <ExplainedFormula
          question="Patch embedding과 LLM embedding의 차원이 다를 때 projector는 무엇을 계산하나요?"
          idea="Vision encoder 출력을 새로 학습하는 대신, 그 위에 차원만 바꾸는 행렬 하나를 얹어 LLM이 이미 알아듣는 embedding 공간으로 옮깁니다."
          formula={String.raw`H_v = W\,Z_v`}
          annotatedFormula={String.raw`H_v=\underbrace{W}_{\text{학습되는 projection 행렬}}\,\underbrace{Z_v}_{\text{vision encoder patch embedding}}`}
          operations={[
            { expression: String.raw`Z_v`, annotation: ["Vision encoder가 만든", "D_v차원 patch embedding sequence"] },
            { expression: String.raw`W`, annotation: ["D_v차원을 LLM hidden dimension D_t로 매핑하는", "학습 가능한 행렬(또는 2-layer MLP)"] },
            { expression: String.raw`H_v`, annotation: ["LLM의 word embedding과 같은 차원의", "visual token sequence"] },
          ]}
          terms={[
            { symbol: String.raw`Z_v`, name: "Patch embedding", description: "Vision encoder가 만든 image patch의 D_v차원 embedding sequence입니다." },
            { symbol: "W", name: "Projection matrix", description: "D_v차원을 LLM hidden dimension D_t로 매핑하는 학습 가능한 계층입니다." },
            { symbol: String.raw`H_v`, name: "Visual token", description: "LLM에 text token embedding과 나란히 들어가는 D_t차원 sequence입니다." },
          ]}
          assumptions={["Vision encoder(CLIP ViT-L/14)와 LLM(Vicuna) 모두 이미 사전학습돼 있다는 전제입니다.", "여기 쓴 형태는 linear projector이며, LLaVA-1.5의 2-layer MLP는 W 사이에 비선형 GELU가 하나 더 들어간 확장입니다."]}
          interpretation="이 식은 차원만 맞출 뿐 image 내용과 언어 사이의 의미 대응을 자동으로 만들지 않습니다. Feature alignment pretraining 단계에서 vision encoder와 LLM을 얼리고 W만 학습해 이 대응을 익힙니다."
        />
      </section>

      <section id="alignment" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Cross-modal alignment는 결합 지점에 따라 고정 LLM 유지와 통합 학습으로 갈립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Image 표현과 text 표현을 같은 모델이 함께 추론할 수 있는 상태로 맞추는 일, 이것이 cross-modal alignment입니다. Projector로 차원을 맞춘 뒤
            어디에 어떻게 끼워 넣느냐에 따라 결합 지점과 학습 비용이 달라집니다.
          </p>
          <p>
            LLaVA는 projector가 만든 visual token(H_v)을 text token embedding과 그대로 이어붙여 LLM 입력 sequence 하나로 만듭니다. 이
            concat-projection 방식은 LLM 구조를 바꾸지 않습니다. 다만 instruction tuning 단계에서는 LLM 파라미터까지 함께 업데이트합니다.
          </p>
          <p>
            Flamingo는 이어붙이는 대신 고정된 LLM 층 사이사이에 gated cross-attention layer를 새로 끼워 넣습니다. 이 layer는 Perceiver
            Resampler가 만든 64개의 고정 개수 visual token만 참조하고 LLM 원래 층은 학습 내내 얼린 채로 둡니다.
          </p>
          <p>
            학습 안정성을 위해 각 cross-attention layer의 출력에는 0으로 초기화한 scalar α를 tanh에 넣어 곱합니다. 학습 시작 시점에는 tanh(0)=0이라
            cross-attention이 아무 영향도 주지 않습니다. 학습이 진행되며 α가 커지면 image 정보가 서서히 섞여 들어갑니다.
          </p>
          <p>
            BLIP-2는 그 중간에 있는 병목을 씁니다. Q-Former라는 작은 transformer가 32개의 learnable query embedding만으로 image
            feature를 압축합니다. 257개(patch 256+CLS 1)짜리 원본 feature보다 훨씬 작은 표현이 나오고 이 결과를 linear layer로 LLM 입력에
            연결합니다.
          </p>
        </div>
        <TermBreakdown
          title="세 VLM이 고른 결합 지점 비교"
          description="결합 지점을 어디에 두느냐가 학습 비용과 LLM 보존 여부를 함께 정합니다."
          items={[
            { term: "Cross-Modal Alignment", description: "Image 표현과 text 표현을 같은 추론에서 함께 쓸 수 있게 맞추는 것입니다.", example: "concat-projection·cross-attention·query bottleneck 세 방식 모두 이 목적을 다르게 구현합니다.", boundary: "결합 지점을 늘릴수록 표현력은 커지지만 학습·추론 비용도 함께 늘어납니다." },
            { term: "Concat-Projection (LLaVA)", description: "Projector가 만든 visual token을 text token과 이어붙여 LLM 입력 하나로 만듭니다.", example: "LLM 구조는 그대로 두고 instruction tuning 단계에서 LLM 파라미터까지 함께 학습합니다.", boundary: "Visual token 개수만큼 LLM의 context 길이를 그대로 소비합니다." },
            { term: "Gated Cross-Attention (Flamingo)", description: "고정된 LLM 층 사이에 새 cross-attention layer를 끼워 visual token을 참조합니다.", example: "9B 모델은 4번째 층마다 삽입해 학습 66% 단축, 성능 하락은 1.9%에 그쳤습니다.", boundary: "LLM 원본 층은 학습 내내 얼려 두어야 하며, 언어 능력 저하를 막는 대신 새 layer의 학습·추론 비용이 더 붙습니다." },
            { term: "Query Bottleneck (BLIP-2 Q-Former)", description: "32개의 learnable query만으로 image feature를 압축해 정보 병목을 만듭니다.", example: "257×1024 크기의 원본 patch feature를 32×768 크기로 줄인 뒤 LLM에 연결합니다.", boundary: "병목이 클수록 학습 파라미터는 줄지만, 압축 과정에서 세부 정보가 사라질 수 있습니다." },
          ]}
        />
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 결합 지점이 다른 세 VLM 논문입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Concat-projection·gated cross-attention·query bottleneck 세 결합 방식은 각각 LLaVA,
            Flamingo, BLIP-2 논문에서 가져왔습니다.
          </p>
        </div>
        <div id="paper-llava" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Liu, Li, Wu, Lee · Visual Instruction Tuning (NeurIPS 2023)"
            citeKey={1}
            href="https://arxiv.org/abs/2304.08485"
          >
            CLIP ViT-L/14 vision encoder와 Vicuna LLM을 linear projection 하나로 이어 붙이고, GPT-4로
            생성한 instruction-following 데이터로 학습한 end-to-end VLM인 LLaVA를 제안합니다.
            Feature alignment pretraining에서는 encoder·LLM을 얼리고 projection matrix만 학습하고,
            instruction tuning에서는 projection과 LLM을 함께 학습합니다.
          </CitationBlock>
        </div>
        <div id="paper-flamingo" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Alayrac et al. · Flamingo: a Visual Language Model for Few-Shot Learning (NeurIPS 2022)"
            citeKey={2}
            href="https://arxiv.org/abs/2204.14198"
          >
            Perceiver Resampler로 image·video feature를 고정 개수(64개)의 visual token으로 압축하고,
            frozen LLM 층 사이에 삽입한 gated cross-attention dense layer가 학습 가능한 α를 tanh에
            통과시켜 image 정보를 서서히 섞는 구조를 제안합니다. 9B 모델에서 4번째 층마다 삽입하면
            매 층 삽입 대비 학습이 66% 빨라지고 성능은 1.9%만 떨어집니다.
          </CitationBlock>
        </div>
        <div id="paper-blip2" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Li, Li, Savarese, Hoi · BLIP-2: Bootstrapping Language-Image Pre-training with Frozen Image Encoders and Large Language Models (ICML 2023)"
            citeKey={3}
            href="https://arxiv.org/abs/2301.12597"
          >
            32개의 learnable query를 쓰는 경량 Q-Former(188M 파라미터)로 frozen image encoder와 frozen
            LLM 사이 modality gap을 잇습니다. Representation learning stage(ITC·ITG·ITM)와 generative
            learning stage 2단계로 사전학습해, Flamingo80B보다 54배 적은 학습 파라미터로 zero-shot
            VQAv2에서 8.7% 앞서는 결과를 보고합니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          Vision encoder가 patch embedding을 만드는 절차 자체는{" "}
          <Link to="/ai/vision-transformer#patch-embedding">Vision transformer</Link> 글을, visual
          token이 reconstruction과 semantic 중 무엇을 보존하는지는{" "}
          <Link to="/ai/visual-representation-tokenizers#objective">Visual representation tokenizer</Link>{" "}
          글을 참고하세요. VLM이 만든 semantic 표현이 물리적 행동으로 이어질 때 생기는 간극은{" "}
          <Link to="/ai/vla-embodiment-gap#overview">VLA embodiment gap</Link> 글에서 다룹니다.
        </p>
      </section>
    </div>
  );
}
