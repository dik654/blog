import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import CacheStateViz from "./viz/CacheStateViz";
import HybridScheduleViz from "./viz/HybridScheduleViz";

const KV_TERMS = [
  {
    symbol: String.raw`L_{attn}`,
    name: "Attention layer 수",
    description:
      "과거 token의 K/V를 실제로 저장하는 layer만 셉니다. Qwen3.6-27B에서는 64가 아니라 16입니다.",
  },
  {
    symbol: "T",
    name: "Context token 수",
    description:
      "Text token과 image·video에서 변환된 visual token을 합친 sequence 길이입니다.",
  },
  {
    symbol: String.raw`H_{KV}`,
    name: "KV head 수",
    description:
      "과거 token마다 저장하는 K/V 표현의 수입니다. Query head 24가 아니라 KV head 4를 넣습니다.",
  },
  {
    symbol: String.raw`d_h`,
    name: "Head dimension",
    description:
      "K 또는 V head 하나에 들어 있는 scalar 원소 수이며 공식 config에서는 256입니다.",
  },
  {
    symbol: String.raw`B_{KV}`,
    name: "원소당 byte",
    description:
      "BF16·FP16이면 2 byte입니다. KV quantization을 쓰면 scale metadata까지 별도로 계산합니다.",
  },
] as const;

const DELTA_TERMS = [
  {
    symbol: String.raw`S_{t-1},S_t`,
    name: "이전·현재 state",
    description:
      "한 head의 key→value association을 담는 고정 shape matrix입니다.",
  },
  {
    symbol: String.raw`\gamma_t`,
    name: "Retention gate",
    description: "새 token을 쓰기 전에 이전 state를 얼마나 남길지 정합니다.",
  },
  {
    symbol: String.raw`k_t`,
    name: "현재 key",
    description: "State의 어느 방향을 읽고 고칠지 가리키는 주소 vector입니다.",
  },
  {
    symbol: String.raw`v_t`,
    name: "현재 value",
    description: "현재 key 방향에 기록하려는 내용 vector입니다.",
  },
  {
    symbol: String.raw`\beta_t`,
    name: "Correction strength",
    description: "Prediction error를 얼마나 강하게 다시 쓸지 조절합니다.",
  },
  {
    symbol: String.raw`q_t`,
    name: "현재 query",
    description: "갱신된 state에서 이번 token에 필요한 내용을 읽습니다.",
  },
] as const;

const STATE_TERMS = [
  {
    symbol: String.raw`L_\Delta`,
    name: "DeltaNet layer 수",
    description:
      "공식 layer_types에서 linear attention으로 표시된 48개 layer입니다.",
  },
  {
    symbol: String.raw`H_S`,
    name: "State head 수",
    description: "Value head layout에 맞춘 48개 state head입니다.",
  },
  {
    symbol: String.raw`d_k,d_v`,
    name: "Matrix의 두 축",
    description: "Key 주소와 value 내용 방향이며 둘 다 128입니다.",
  },
  {
    symbol: String.raw`B_S`,
    name: "State 원소당 byte",
    description:
      "Reference recurrent state가 FP32이므로 core 계산에는 4 byte를 사용합니다.",
  },
] as const;

export default function ModernArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>64층 모두가 같은 방식으로 과거를 기억하지 않습니다</h2>
          <p className="text-lg leading-8">
            공식 공개 모델 <strong>Qwen3.6-27B</strong>는 네 개의 mixer를 한
            묶음으로 삼습니다. 앞의 세 칸은 과거를 고정 크기 state에 눌러 담는{" "}
            <strong>Gated DeltaNet</strong>이고, 마지막 한 칸은 과거 token의
            key와 value를 그대로 남기는 <strong>Gated Attention</strong>입니다.
            이 네 칸을 16번 반복해 DeltaNet 48층과 Attention 16층, 총 64층이
            됩니다.
          </p>
          <p className="leading-8">
            그래서 “64층 모델”이라는 한 숫자만 보고 KV cache를 계산하면 안
            됩니다. KV는 16개 Attention layer에만 생기고, 48개 DeltaNet
            layer에는 token history 대신 request마다 고정된 recurrent matrix가
            생깁니다. 이 글은 두 기억의 <em>형태</em>와 한 token을 처리할 때의{" "}
            <em>갱신 연산</em>까지만 설명합니다. Scheduler와 VRAM admission은
            다음 런타임 글에서 조합합니다.
          </p>
        </div>

        <TermBreakdown
          title="처음 필요한 네 용어를 하나씩 고정합니다"
          items={[
            {
              term: "Token",
              description:
                "모델이 sequence의 한 위치로 처리하는 단위입니다. Text뿐 아니라 vision encoder가 만든 visual token도 포함됩니다.",
              example:
                "Text 30K와 visual token 2K가 함께 들어오면 attention이 읽는 T는 대략 32K입니다.",
              boundary:
                "Token 수는 글자 수·단어 수·원본 pixel 수와 같지 않습니다.",
            },
            {
              term: "Mixer",
              description:
                "현재 hidden state에 다른 위치의 정보를 섞는 sublayer입니다. Qwen3.6에서는 DeltaNet 또는 Attention이 이 자리에 옵니다.",
              example:
                "DeltaNet→FFN을 세 번 거친 뒤 Attention→FFN을 한 번 거칩니다.",
              boundary:
                "Mixer가 64개라는 말은 full attention이 64개라는 뜻이 아닙니다.",
            },
            {
              term: "Explicit token memory",
              description:
                "과거 token마다 만든 key와 value를 sequence 축에 붙여 두는 기록 방식입니다.",
              example:
                "Context가 4K에서 8K로 늘면 같은 dtype의 KV도 두 배가 됩니다.",
              boundary:
                "FlashAttention은 이 기록을 효율적으로 읽는 구현이며 고정 state로 바꾸는 방법은 아닙니다.",
            },
            {
              term: "Recurrent state",
              description:
                "지금까지의 입력을 매 step 같은 shape의 matrix에 반영하는 기억 방식입니다.",
              example:
                "4K를 읽든 262K를 읽든 core state matrix의 shape는 같습니다.",
              boundary:
                "크기가 고정됐다는 말은 과거 token 원본이 손실 없이 보존된다는 뜻이 아닙니다.",
            },
          ]}
        />

        <HybridScheduleViz />
        <ContentBoundary article="qwen36-hybrid-architecture" />
      </section>

      <section id="attention-kv" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>Attention은 현재 query가 과거 token 기록을 직접 다시 읽습니다</h2>
          <p className="leading-8">
            현재 token은 query를 만들고, 과거 token은 key와 value를 남깁니다.
            Query와 각 key의 유사도로 읽을 위치를 정한 뒤 해당 value들을
            합칩니다. Autoregressive decode는 과거 K/V를 매번 다시 만들지 않도록
            cache에 보존하므로 context 길이와 함께 memory가 자랍니다. Q·K·V
            자체가 낯설다면{" "}
            <Link to="/ai/attention-theory">Attention 기초</Link>의 score와
            value 합부터 읽을 수 있습니다.
          </p>
        </div>

        <TermBreakdown
          title="GQA는 바라보는 관점과 저장하는 기록 수를 분리합니다"
          items={[
            {
              term: "Query head · 24개",
              description:
                "현재 token이 과거를 바라보는 learned 관점입니다. 다음 step을 위해 history로 저장하지 않습니다.",
              example:
                "24개 Q head가 score를 계산해도 cache 폭은 24가 아닙니다.",
              boundary: "Query 수만 보고 KV 크기를 계산하지 않습니다.",
            },
            {
              term: "KV head · 4개",
              description:
                "과거 token마다 실제로 보존하는 key와 value 표현의 수입니다.",
              example:
                "24÷4=6이므로 여섯 Query head가 한 KV head를 공유합니다.",
              boundary:
                "공유는 memory를 줄이지만 모든 task에서 24개 KV head와 같은 품질을 보장하지 않습니다.",
            },
            {
              term: "Head dimension · 256",
              description:
                "K 또는 V head 하나가 token마다 보존하는 scalar 원소 수입니다.",
              example:
                "한 layer의 한 token은 K 4×256개와 V 4×256개를 남깁니다.",
              boundary: "DeltaNet state의 128차원 축과 섞지 않습니다.",
            },
          ]}
        />

        <div id="kv-bytes" className="scroll-mt-20">
          <ExplainedFormula
            question="Qwen3.6-27B에서 token 하나가 늘 때 BF16 attention KV는 몇 byte 늘어날까요?"
            idea={
              <>
                K/V를 저장하는 16개 layer만 고른 뒤, K와 V 두 기록, KV head 4개,
                head당 256개 원소, BF16 2 byte를 순서대로 곱합니다.
              </>
            }
            formula={String.raw`M_{KV}(T)=L_{attn}\times2\times T\times H_{KV}\times d_h\times B_{KV}`}
            annotatedFormula={String.raw`\begin{aligned}
M_{KV}(T)
 &=\underbrace{16}_{\substack{\text{K/V를 남기는}\\\text{Attention layer}}}
   \times\underbrace{2}_{\text{K와 V}}\\
 &\quad\times\underbrace{T}_{\text{과거 token 수}}
   \times\underbrace{(4\times256)}_{\substack{\text{token 하나의}\\\text{KV head 폭}}}\\
 &\quad\times\underbrace{2\ \mathrm{byte}}_{\text{BF16 원소 폭}}
 =\underbrace{64\ \mathrm{KiB}\times T}_{\text{context와 함께 증가}}
\end{aligned}`}
            operations={[
              {
                expression: String.raw`16`,
                annotation: ["64층 전체에서", "KV를 남기는 층만 선택"],
              },
              {
                expression: String.raw`2\times T`,
                annotation: ["K와 V 두 기록을", "과거 token마다 반복"],
              },
              {
                expression: String.raw`4\times256`,
                annotation: ["저장하는 KV head 수와", "head 하나의 폭을 결합"],
              },
              {
                expression: String.raw`16\times2\times4\times256\times2`,
                annotation: [
                  "token 하나의 모든 KV 원소를 byte로 바꿔",
                  "65,536 byte = 64 KiB를 얻음",
                ],
              },
            ]}
            terms={KV_TERMS}
            assumptions={[
              "Batch 1, prefix sharing과 allocator padding을 제외한 unsharded logical cache입니다.",
              "16개 attention layer가 KV head 4·head dimension 256을 사용합니다.",
              "Tensor parallel의 rank별 physical allocation은 shard 방식에 따라 달라집니다.",
            ]}
            interpretation="32K·128K·262K에서는 각각 약 2·8·16 GiB입니다. 64를 layer 수로 넣으면 네 배로 과대계산하지만, 이 logical 값만으로 실제 GPU peak가 확정되지는 않습니다."
            title="Attention KV의 곱이 각각 세는 대상"
          />
        </div>

        <CacheStateViz />

        <div id="paper-qwen36-config" className="scroll-mt-20 space-y-5">
          <CitationBlock
            source="Qwen · Qwen3.6-27B model card"
            citeKey={1}
            href="https://huggingface.co/Qwen/Qwen3.6-27B"
          >
            <p>
              <strong>문제:</strong> 공개 checkpoint의 모델명·layer
              pattern·context·modalities를 식별합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> 27B dense, 64 layers, 16×(3 Gated
              DeltaNet+1 Gated Attention), native 262,144와 별도 extended
              context를 공개합니다.
            </p>
            <p>
              <strong>전제:</strong> 확인한 공식 repository revision과 model
              card입니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 공개 model identity와 지원 범위를
              확인합니다.
            </p>
            <p>
              <strong>비주장:</strong> 모든 runtime의 1M 품질·latency·VRAM을
              보장하지 않습니다.
            </p>
          </CitationBlock>
          <CitationBlock
            source="Qwen3.6-27B · official config.json"
            citeKey={2}
            type="code"
            href="https://huggingface.co/Qwen/Qwen3.6-27B/blob/main/config.json"
          >
            <p>
              <strong>문제:</strong> 이름이 아니라 실제 layer_types와 head
              shape를 읽습니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> 48 linear·16 full attention, Q 24/KV
              4/head 256, Delta QK 16/V 48/head 128과 FP32 state를 고정합니다.
            </p>
            <p>
              <strong>전제:</strong> Config와 weights·runtime implementation
              revision이 호환돼야 합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 이 글의 logical tensor shape와 byte
              계산입니다.
            </p>
            <p>
              <strong>비주장:</strong> Allocator·workspace·throughput을
              config만으로 확정하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="deltanet-state" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>DeltaNet은 같은 크기의 matrix를 읽고, 틀린 만큼만 고쳐 씁니다</h2>
          <p className="leading-8">
            단순 누적은 새 key·value가 올 때마다 outer product를 계속 더합니다.
            하지만 같은 key 방향에 이미 알맞은 value가 기록돼 있다면 또 더할
            이유가 없습니다. Delta rule은 현재 state가 그 key에서 예측하는 값을
            먼저 읽고, 실제 value와의 차이만 다시 씁니다. 그래서 이름의 delta는
            “새 value 전체”가 아니라 “현재 예측에서 어긋난 양”입니다.
          </p>
        </div>

        <TermBreakdown
          title="한 step을 감쇠 → 오차 → 수정 → 읽기로 나눕니다"
          items={[
            {
              term: "Retention",
              description:
                "이전 state에 γₜ를 곱해 오래된 association을 얼마나 남길지 정합니다.",
              example: "γₜ=.9면 이번 write 전에 이전 성분의 90%를 남깁니다.",
              boundary:
                "한 step의 .9가 긴 sequence 전체의 90% 보존을 뜻하지 않습니다.",
            },
            {
              term: "Prediction error",
              description:
                "감쇠한 state를 현재 key로 읽은 예측을 실제 value에서 뺍니다.",
              example: "예측이 3이고 실제 value가 5면 error는 2입니다.",
              boundary: "Value 5 전체를 다시 더하는 단순 누적과 다릅니다.",
            },
            {
              term: "Delta write",
              description: "Error에 βₜ를 곱하고 현재 key 방향으로 다시 씁니다.",
              example: "βₜ=.25, error=2라면 correction content는 .5입니다.",
              boundary:
                "서로 비슷한 key 방향은 같은 matrix 좌표에서 간섭할 수 있습니다.",
            },
          ]}
        />

        <div id="delta-update" className="scroll-mt-20">
          <ExplainedFormula
            question="왜 새 value를 그대로 더하지 않고 기존 prediction을 뺀 오차를 쓰나요?"
            idea={
              <>
                이미 맞는 association은 중복해 키우지 않고, 현재 key에서 틀린
                부분만 targeted correction하기 위해서입니다.
              </>
            }
            formula={String.raw`\bar S_t=\gamma_tS_{t-1},\ e_t=v_t-\bar S_t^\top k_t,\ S_t=\bar S_t+k_t(\beta_te_t)^\top,\ y_t=S_t^\top q_t`}
            annotatedFormula={String.raw`\begin{aligned}
\bar S_t&=\underbrace{\gamma_tS_{t-1}}_{\substack{\text{오래된 association을}\\\text{먼저 감쇠}}}\\
e_t&=\underbrace{v_t}_{\text{실제 새 내용}}-\underbrace{\bar S_t^\top k_t}_{\substack{\text{현재 key에서}\\\text{이미 예측한 내용}}}\\
S_t&=\underbrace{\bar S_t}_{\text{남긴 state}}+\underbrace{k_t(\beta_te_t)^\top}_{\substack{\text{key 방향에}\\\text{오차만 기록}}}\\
y_t&=\underbrace{S_t^\top q_t}_{\substack{\text{현재 query로}\\\text{갱신 state를 읽기}}}
\end{aligned}`}
            operations={[
              {
                expression: String.raw`\gamma_tS_{t-1}`,
                annotation: ["이전 association을", "retention gate만큼 보존"],
              },
              {
                expression: String.raw`v_t-\bar S_t^\top k_t`,
                annotation: [
                  "실제 value에서 이미 아는 값을 빼",
                  "중복 대신 prediction error 계산",
                ],
              },
              {
                expression: String.raw`k_t(\beta_te_t)^\top`,
                annotation: [
                  "오차의 크기를 조절한 뒤",
                  "현재 key 방향에만 다시 기록",
                ],
              },
              {
                expression: String.raw`S_t^\top q_t`,
                annotation: ["갱신이 끝난 state를", "현재 query 방향으로 읽음"],
              },
            ]}
            terms={DELTA_TERMS}
            assumptions={[
              "한 request·한 head의 직관식이며 실제 tensor에는 batch와 여러 head가 있습니다.",
              "Reference path에는 q/k normalization, causal convolution과 output gate가 더 있습니다.",
              "이 식은 recurrent decode form이며 prefill은 같은 recurrence를 chunkwise parallel form으로 계산합니다.",
            ]}
            interpretation="State shape은 context T와 함께 늘지 않습니다. 대신 과거 token 원본을 보존하지 않으므로 exact UUID·needle retrieval에서는 explicit attention과 다른 trade-off가 생깁니다."
            title="Delta update의 각 연산이 필요한 이유"
          />
        </div>

        <div id="state-bytes" className="scroll-mt-20">
          <ExplainedFormula
            question="48개 DeltaNet core matrix는 request 하나당 몇 byte인가요?"
            idea={
              <>
                각 layer의 48개 state head에 128×128 FP32 matrix가 하나씩
                있으므로 layer·head·두 matrix 축·원소 byte를 곱합니다.
              </>
            }
            formula={String.raw`M_\Delta=L_\Delta\times H_S\times d_k\times d_v\times B_S`}
            annotatedFormula={String.raw`\begin{aligned}
M_\Delta
 &=\underbrace{48}_{\Delta\text{ layers}}\times\underbrace{48}_{\text{state heads}}\\
 &\quad\times\underbrace{(128\times128)}_{\substack{\text{key 주소}\times\text{value 내용}\\\text{association matrix}}}\\
 &\quad\times\underbrace{4\ \mathrm{byte}}_{\text{FP32 state}}
 =\underbrace{144\ \mathrm{MiB}}_{\text{request당 core state}}
\end{aligned}`}
            operations={[
              {
                expression: String.raw`48\times48`,
                annotation: [
                  "모든 DeltaNet layer에서",
                  "각 state head를 하나씩 예약",
                ],
              },
              {
                expression: String.raw`128\times128`,
                annotation: [
                  "key 주소와 value 내용을",
                  "2차원 association으로 결합",
                ],
              },
              {
                expression: String.raw`37{,}748{,}736\times4`,
                annotation: ["전체 core 원소 수에", "FP32 byte 폭을 적용"],
              },
            ]}
            terms={STATE_TERMS}
            assumptions={[
              "Hugging Face reference의 repeated head layout과 FP32 state를 기준으로 합니다.",
              "짧은 causal-convolution history는 별도입니다.",
              "Packed layout·TP partition·alignment가 physical allocation을 바꿀 수 있습니다.",
            ]}
            interpretation="4K와 262K에서 core shape는 144 MiB로 같지만, active request가 열 개면 이 고정 state도 대략 열 배가 됩니다. O(1)은 context 길이 T에 대한 표현이지 연산 비용이 1이라는 뜻이 아닙니다."
            title="고정 recurrent state의 shape와 dtype"
          />
        </div>

        <div id="paper-gated-deltanet" className="scroll-mt-20">
          <CitationBlock
            source="Yang et al. · Gated Delta Networks"
            citeKey={3}
            href="https://arxiv.org/abs/2412.06464"
          >
            <p>
              <strong>문제:</strong> 고정 state 효율을 유지하면서 associative
              recall과 parallel training 효율을 개선합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> Adaptive forgetting gate와 delta
              update, hardware-efficient parallel algorithm과 hybrid 구성을
              제시합니다.
            </p>
            <p>
              <strong>전제:</strong> 논문의 model scale·data·benchmark·kernel과
              recurrence 조건입니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Gating과 prediction-error correction의
              method·평가 근거입니다.
            </p>
            <p>
              <strong>비주장:</strong> Qwen의 3:1 비율이 보편적 최적이거나 fixed
              state가 모든 exact retrieval을 대체한다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            이제 두 기억의 shape를 알았으므로{" "}
            <Link to="/ai/qwen36-hybrid-runtime">
              Qwen3.6 하이브리드 런타임
            </Link>
            에서 prefill·decode가 이를 어떻게 commit하고, native·extended
            context와 MTP rollback을 어떻게 검증하는지 이어서 볼 수 있습니다.
            가중치와 GPU capacity를 계산하는 일반 절차는{" "}
            <Link to="/ai/model-vram-budgeting">모델 VRAM 계산</Link>이
            소유합니다.
          </p>
        </div>
      </section>
    </article>
  );
}
