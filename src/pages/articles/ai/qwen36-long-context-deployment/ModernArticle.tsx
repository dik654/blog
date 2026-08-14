import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import WeightVramViz from "../model-vram-budgeting/viz/WeightVramViz";
import ContextEnvelopeViz from "./viz/ContextEnvelopeViz";

const ROPE_TERMS = [
  {
    symbol: String.raw`d_h`,
    name: "Attention head dimension",
    description: "Full-attention head 하나의 전체 width이며 256입니다.",
  },
  {
    symbol: String.raw`\rho`,
    name: "Rotary 적용 비율",
    description:
      "Head 중 위치 회전을 적용하는 비율이며 config에서는 0.25입니다.",
  },
  {
    symbol: String.raw`d_{rope}`,
    name: "Rotary dimension",
    description: "실제로 위치 회전을 적용하는 64개 좌표입니다.",
  },
] as const;

const FLOOR_TERMS = [
  {
    symbol: String.raw`M_W`,
    name: "Mixed-FP8 weights",
    description:
      "공식 checkpoint의 FP8·BF16 tensor payload를 합친 약 28.75 GiB입니다.",
  },
  {
    symbol: String.raw`M_{KV}`,
    name: "Attention KV",
    description: "262,144 token·BF16·batch 1에서 logical 16 GiB입니다.",
  },
  {
    symbol: String.raw`M_\Delta`,
    name: "Delta core state",
    description: "Request 하나의 FP32 recurrent matrix 약 0.14 GiB입니다.",
  },
  {
    symbol: String.raw`M_{free}`,
    name: "미확정 여유",
    description:
      "Known floor를 빼고 남지만 workspace와 headroom이 경쟁하는 후보 공간입니다.",
  },
] as const;

export default function ModernArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>
            Long context는 길이 숫자 하나가 아니라 세 개의 별도 문제입니다
          </h2>
          <p className="text-lg leading-8">
            Qwen3.6-27B가 긴 sequence를 처리하려면 <strong>위치를 표현</strong>
            할 수 있어야 하고,{" "}
            <strong>KV와 recurrent state를 메모리에 수용</strong>할 수 있어야
            하며, 마지막 위치에서도 <strong>필요한 정보를 실제로 회수</strong>
            해야 합니다. RoPE scaling은 첫 문제를, hybrid architecture는 두 번째
            문제의 일부를 다루지만 어느 하나도 세 문제 전체를 자동으로 해결하지
            않습니다.
          </p>
          <p className="leading-8">
            이 글은 공식 native 262,144 token과 별도 extended 1,010,000 token
            profile을 구분합니다. Text·image·video가 같은 context budget을
            어떻게 나누는지, partial multimodal RoPE가 어느 좌표에 위치를
            넣는지, 공식 mixed-FP8 가중치를 48 GiB에 올렸을 때 어떤 미지수가
            남는지 순서대로 확인합니다.
          </p>
        </div>

        <TermBreakdown
          title="먼저 context support를 이루는 네 항목을 분리합니다"
          items={[
            {
              term: "Context token",
              description:
                "Language backbone이 한 sequence position으로 처리하는 단위입니다.",
              example:
                "Text token과 vision encoder가 만든 visual token을 합쳐 T를 계산합니다.",
              boundary: "원본 글자·pixel·video frame 수와 같지 않습니다.",
            },
            {
              term: "Native context",
              description:
                "공식 학습·평가 범위로 공개된 262,144 token profile입니다.",
              example:
                "Text-only와 multimodal fixture를 같은 native budget 안에서 구성합니다.",
              boundary:
                "지원 길이가 모든 위치의 exact retrieval을 보장하지 않습니다.",
            },
            {
              term: "Extended context",
              description:
                "별도 scaling·runtime 설정으로 제시되는 1,010,000 token profile입니다.",
              example:
                "Native와 같은 위치별 retrieval·latency·peak fixture로 다시 검증합니다.",
              boundary:
                "max position 설정을 키운 것만으로 native 품질이 유지되지는 않습니다.",
            },
            {
              term: "Release profile",
              description:
                "Model·runtime·dtype·입력 modality·length·quality threshold를 한 승인 단위로 묶습니다.",
              example:
                "128K text profile과 262K video profile은 별도로 승인합니다.",
              boundary:
                "한 profile의 load 성공을 다른 GPU·kernel·modality로 일반화하지 않습니다.",
            },
          ]}
        />

        <ContextEnvelopeViz />
        <ContentBoundary article="qwen36-long-context-deployment" />
      </section>

      <section id="position-modal" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>Partial multimodal RoPE는 head 일부에 위치 축을 넣습니다</h2>
          <p className="leading-8">
            RoPE는 query와 key의 일부 좌표를 위치에 따라 회전시켜 상대 위치가
            내적에 드러나게 합니다. Qwen3.6 full-attention head는 256차원이고
            그중 25%인 64차원에 rotary position을 적용합니다. Visual token에는
            temporal·height·width 축을 나눠 전달합니다. 이 계산은 위치
            representation의 폭이지 memory 절감량이 아닙니다.
          </p>
        </div>

        <div id="partial-rope" className="scroll-mt-20">
          <ExplainedFormula
            question="Partial RoPE는 head의 몇 차원에 위치 회전을 적용하나요?"
            idea={
              <>
                Head 전체 width에 config의 partial factor를 곱해 rotary
                subspace를 구하고, 나머지 좌표는 회전하지 않는 content feature로
                남깁니다.
              </>
            }
            formula={String.raw`d_{rope}=\rho d_h=0.25\times256=64`}
            annotatedFormula={String.raw`\begin{aligned}
d_{rope}
 &=\underbrace{\rho}_{\substack{\text{위치 회전을 적용할}\\\text{head 비율 }0.25}}
  \times\underbrace{d_h}_{\substack{\text{Attention head의}\\\text{전체 폭 }256}}\\
 &=\underbrace{64}_{\text{rotary coordinates}},\qquad
 \underbrace{256-64=192}_{\text{회전하지 않는 coordinates}}
\end{aligned}`}
            operations={[
              {
                expression: String.raw`0.25\times256`,
                annotation: [
                  "전체 head 폭에서",
                  "위치 회전을 맡을 좌표만 선택",
                ],
              },
              {
                expression: String.raw`256-64`,
                annotation: [
                  "position rotation 밖에 남는",
                  "content 좌표를 분리",
                ],
              },
            ]}
            terms={ROPE_TERMS}
            assumptions={[
              "공식 attention head dim 256과 partial_rotary_factor 0.25를 적용합니다.",
              "Multimodal layout은 temporal·height·width axes를 추가로 나눕니다.",
              "이 식은 position width이며 context memory나 품질 계산이 아닙니다.",
            ]}
            interpretation="64 rotary dimensions와 hybrid cache는 서로 다른 문제를 해결합니다. Rotary width만으로 native 262K나 extended 1.01M의 retrieval 품질을 결론낼 수 없습니다."
            title="Head width에서 위치 subspace를 고르는 연산"
          />
        </div>

        <TermBreakdown
          title="Text·image·video는 같은 budget에 들어오되 위치 축이 다릅니다"
          items={[
            {
              term: "Text position",
              description:
                "Tokenizer가 만든 sequence 순서를 한 축으로 전달합니다.",
              example: "문장 token 30K는 T의 30K를 사용합니다.",
              boundary: "글자 30K가 token 30K라는 뜻은 아닙니다.",
            },
            {
              term: "Image position",
              description:
                "Vision patch의 세로·가로 위치를 visual token representation에 전달합니다.",
              example:
                "Patch token 2K가 text 30K와 interleave되면 T는 약 32K입니다.",
              boundary:
                "Raw pixel 수를 그대로 context token으로 넣지 않습니다.",
            },
            {
              term: "Video position",
              description: "시간 축과 각 frame의 공간 축을 함께 표현합니다.",
              example:
                "Sampling·patch merge가 만든 visual token 수를 startup receipt에 남깁니다.",
              boundary:
                "같은 초 길이의 video라도 해상도·sampling 설정에 따라 token budget이 다릅니다.",
            },
          ]}
        />

        <div id="paper-qwen36-model-context" className="scroll-mt-20">
          <CitationBlock
            source="Qwen · Qwen3.6-27B model card"
            citeKey={1}
            href="https://huggingface.co/Qwen/Qwen3.6-27B"
          >
            <p>
              <strong>문제:</strong> Native·extended context와 multimodal·MTP의
              공개 범위를 식별합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> Native 262,144와 별도 extended
              1,010,000 token profile, image·video 입력을 명시합니다.
            </p>
            <p>
              <strong>전제:</strong> 확인한 공식 repository revision과 model
              card입니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 공개 context·modality support
              claim입니다.
            </p>
            <p>
              <strong>비주장:</strong> Target runtime의 위치별
              retrieval·latency·peak memory를 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>

        <div id="paper-transformers-qwen35-context" className="scroll-mt-20">
          <CitationBlock
            source="Hugging Face Transformers · Qwen3.5/Qwen3.6 reference"
            citeKey={2}
            type="code"
            href="https://huggingface.co/docs/transformers/model_doc/qwen3_5"
          >
            <p>
              <strong>문제:</strong> Hybrid·multimodal checkpoint의 position
              layout과 cache를 실제 API로 실행합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> Layer dispatch, kernel fallback,
              multimodal RoPE와 cache reference path를 문서화합니다.
            </p>
            <p>
              <strong>전제:</strong> Transformers·optional kernel·GPU·dtype
              revision을 함께 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Reference implementation과 지원 API
              경계입니다.
            </p>
            <p>
              <strong>비주장:</strong> Reference fallback 성능이 production
              throughput을 대표하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="memory-profile" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>
            48 GiB에서는 weight가 들어간 뒤의 빈칸을 context budget으로
            계산합니다
          </h2>
          <p className="leading-8">
            가중치 byte와 GB·GiB를 계산하는 일반 절차는{" "}
            <Link to="/ai/model-vram-budgeting">모델 VRAM 계산</Link>이
            정본입니다. Qwen3.6 공식 BF16 payload는 51.75 GiB라 48 GiB 한 장에는
            KV 이전부터 들어가지 않습니다. 공식 mixed-FP8 payload는 약 28.75
            GiB입니다.
          </p>
        </div>

        <div id="qwen-known-floor" className="scroll-mt-20">
          <ExplainedFormula
            question="Mixed-FP8 Qwen을 262K BF16 KV로 올릴 때 48 GiB에 정말 들어간다고 말할 수 있나요?"
            idea={
              <>
                Shape로 확정 가능한 weight·KV·Delta core만 먼저 더하고,
                capacity에서 뺀 나머지는 workspace가 들어갈 후보 공간으로만
                읽습니다.
              </>
            }
            formula={String.raw`M_{known}=M_W+M_{KV}+M_\Delta,\quad M_{free}=48-M_{known}`}
            annotatedFormula={String.raw`\begin{aligned}
M_{known}(262K)
 &=\underbrace{28.75}_{\text{mixed-FP8 weights}}
  +\underbrace{16.00}_{\substack{\text{BF16 Attention KV}\\262{,}144\text{ tokens}}}
  +\underbrace{0.14}_{\text{Delta core state}}\\
 &=\underbrace{44.89\ \mathrm{GiB}}_{\text{shape로 계산한 known floor}}\\
M_{free}
 &=\underbrace{48.00}_{\text{device capacity}}
  -\underbrace{44.89}_{\text{known floor}}
  =\underbrace{3.11\ \mathrm{GiB}}_{\substack{\text{workspace가 경쟁할}\\\text{미확정 후보 공간}}}
\end{aligned}`}
            operations={[
              {
                expression: String.raw`28.75+16.00+0.14`,
                annotation: [
                  "weight·길이 비례 KV·고정 state를",
                  "같은 GiB 단위로 먼저 합산",
                ],
              },
              {
                expression: String.raw`48.00-44.89`,
                annotation: [
                  "device capacity에서 known floor를 빼",
                  "아직 설명되지 않은 memory의 최대 칸을 계산",
                ],
              },
              {
                expression: String.raw`3.11\ \mathrm{GiB}`,
                annotation: [
                  "CUDA graph·temporary·allocator·vision이",
                  "모두 경쟁하는 얇은 여유로 해석",
                ],
              },
            ]}
            terms={FLOOR_TERMS}
            assumptions={[
              "Batch 1·request 1, official mixed-FP8 weights와 BF16 logical KV를 가정합니다.",
              "Convolution state, CUDA graph, workspace, allocator padding, vision activation과 headroom은 known floor 밖입니다.",
              "FP8 weight checkpoint는 KV dtype을 자동으로 FP8로 바꾸지 않습니다.",
            ]}
            interpretation="44.89 GiB가 48 GiB보다 작아도 안전한 262K admission 증거는 아닙니다. 128K known floor는 약 36.89 GiB라 여유가 더 크지만, 둘 다 actual engine peak와 quality fixture로 승인해야 합니다."
            title="Known floor와 아직 모르는 runtime memory"
          />
        </div>

        <WeightVramViz />

        <div
          id="paper-qwen36-weights-context"
          className="scroll-mt-20 space-y-5"
        >
          <CitationBlock
            source="Qwen3.6-27B · official BF16 safetensors index"
            citeKey={3}
            type="code"
            href="https://huggingface.co/Qwen/Qwen3.6-27B/blob/main/model.safetensors.index.json"
          >
            <p>
              <strong>문제:</strong> 27B라는 이름을 실제 BF16 tensor payload로
              바꿉니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> total_size 55,562,855,904 bytes를
              제공해 51.75 GiB floor를 검산합니다.
            </p>
            <p>
              <strong>전제:</strong> 해당 official BF16 checkpoint
              revision입니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Weight payload 하한입니다.
            </p>
            <p>
              <strong>비주장:</strong> KV·activation·runtime peak를 포함하지
              않습니다.
            </p>
          </CitationBlock>
          <CitationBlock
            source="Qwen · Qwen3.6-27B-FP8 official checkpoint"
            citeKey={4}
            type="code"
            href="https://huggingface.co/Qwen/Qwen3.6-27B-FP8/tree/main"
          >
            <p>
              <strong>문제:</strong> FP8 label과 실제 mixed-dtype payload를
              구분합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> 약 24.699B FP8·3.084B BF16 parameter
              구성을 공개합니다.
            </p>
            <p>
              <strong>전제:</strong> Official conversion revision과 지원
              runtime입니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Mixed-precision weight floor입니다.
            </p>
            <p>
              <strong>비주장:</strong> KV도 FP8이거나 48 GiB에서 262K가 자동
              승인된다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-check" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>
            지원 길이는 architecture·memory·kernel·quality receipt로 승인합니다
          </h2>
        </div>
        <TermBreakdown
          title="한 줄의 max length 대신 네 증거를 남깁니다"
          items={[
            {
              term: "Architecture receipt",
              description:
                "Model·config revision, layer pattern, RoPE·vision fields와 input tokenization을 기록합니다.",
              example:
                "Text-only와 vision-enabled build가 같은 artifact인지 대조합니다.",
              boundary:
                "같은 모델명의 conversion이 같은 geometry를 보존한다고 가정하지 않습니다.",
            },
            {
              term: "Memory receipt",
              description:
                "Dtype별 weights, KV, recurrent·convolution state, CUDA graph와 peak/reserved를 분리합니다.",
              example: "128K logical floor와 warmup peak 차이를 기록합니다.",
              boundary: "nvidia-smi 한 시점 값을 KV 비용으로 부르지 않습니다.",
            },
            {
              term: "Kernel receipt",
              description:
                "Prefill·decode의 attention backend와 Delta fast/fallback kernel을 기록합니다.",
              example: "같은 fixture에서 TTFT·tokens/s·peak를 비교합니다.",
              boundary:
                "Layer microbenchmark를 end-to-end speedup으로 확대하지 않습니다.",
            },
            {
              term: "Quality·rollback receipt",
              description:
                "Native/extended, text/multimodal, 위치별 retrieval와 MTP on/off를 같은 dataset에서 비교합니다.",
              example:
                "Threshold 미달이면 native length·non-MTP profile로 되돌립니다.",
              boundary:
                "Load 성공과 필요한 정보를 정확히 회수하는 능력은 다릅니다.",
            },
          ]}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            Cache commit 자체는{" "}
            <Link to="/ai/qwen36-hybrid-runtime">
              Qwen3.6 하이브리드 런타임
            </Link>
            에서, 일반적인 GPU admission과 기동 로그는{" "}
            <Link to="/ai/model-vram-budgeting">모델 VRAM 계산</Link>에서 더
            깊게 이어집니다.
          </p>
        </div>
      </section>
    </article>
  );
}
