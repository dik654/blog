import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import HybridRuntimeFlowViz from "./viz/HybridRuntimeFlowViz";

const MEMORY_TERMS = [
  {
    symbol: String.raw`M_W`,
    name: "공유 model weights",
    description:
      "Active request들이 함께 사용하는 checkpoint weight residency입니다.",
  },
  {
    symbol: "N",
    name: "Active request 수",
    description:
      "서로 독립된 KV와 recurrent state를 동시에 가진 request의 수입니다.",
  },
  {
    symbol: String.raw`M_{KV}(T_r)`,
    name: "Request r의 KV",
    description: "해당 request의 context 길이 Tᵣ에 따라 증가합니다.",
  },
  {
    symbol: String.raw`M_\Delta`,
    name: "고정 recurrent state",
    description:
      "Context 길이와 무관하지만 request마다 필요한 Delta core·convolution state입니다.",
  },
  {
    symbol: String.raw`M_{work}`,
    name: "Runtime overhead",
    description:
      "Kernel temporary, CUDA graph, allocator padding·fragmentation과 activation입니다.",
  },
] as const;

const PREFIX_TERMS = [
  {
    symbol: "a",
    name: "Accepted prefix length",
    description: "Target 검증을 통과해 정본으로 남길 마지막 token 경계입니다.",
  },
  {
    symbol: String.raw`K\!V_{:a}`,
    name: "승인된 KV prefix",
    description: "Attention layer가 token a까지 보존한 key/value block입니다.",
  },
  {
    symbol: String.raw`S_a`,
    name: "승인된 recurrent state",
    description:
      "같은 token a까지 DeltaNet update를 반영한 matrix state입니다.",
  },
  {
    symbol: String.raw`C_a`,
    name: "승인된 convolution history",
    description: "짧은 local history도 같은 boundary에 맞춘 상태입니다.",
  },
  {
    symbol: String.raw`G_a`,
    name: "Request generation",
    description:
      "세 state가 동일한 accepted prefix를 가리키는 원자적 commit 단위입니다.",
  },
] as const;

export default function ModernArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>두 기억을 같은 request lifecycle로 움직입니다</h2>
          <p className="text-lg leading-8">
            <Link to="/ai/qwen36-hybrid-architecture">앞 글</Link>에서
            Qwen3.6-27B의 Attention은 token마다 K/V를 남기고 DeltaNet은 고정
            matrix를 갱신한다는 사실을 확인했습니다. Scheduler 입장에서는 이
            둘을 별개의 cache가 아니라{" "}
            <strong>같은 accepted prefix를 설명하는 한 request state</strong>로
            관리해야 합니다.
          </p>
          <p className="leading-8">
            Prefill은 prompt를 읽고 decode는 token 하나를 만듭니다. MTP는 여러 token을 미리 제안합니다. 셋은 계산 형태가 서로 다릅니다. 그런데
            Attention KV·Delta matrix·convolution history가 서로 다른 token 경계를 가리키면 다음 출력은 하나의 과거에서 나온 결과가 아닙니다. 이
            글은 그 state lifecycle만 집중해서 설명합니다.
          </p>
        </div>

        <TermBreakdown
          title="실행 순서에 필요한 용어를 먼저 하나씩 놓습니다"
          items={[
            {
              term: "Request state",
              description:
                "한 사용자의 accepted prefix를 이어 생성하는 데 필요한 cache 묶음입니다.",
              example:
                "Attention KV, Delta core matrix와 convolution history가 들어갑니다.",
              boundary:
                "Model weights처럼 request 사이에 그대로 공유하지 않습니다.",
            },
            {
              term: "Prefill",
              description:
                "Prompt의 많은 token을 matrix·chunk 연산으로 한꺼번에 읽는 구간입니다.",
              example:
                "긴 prompt를 chunk로 처리하며 chunk 끝마다 두 state를 이어 붙입니다.",
              boundary: "DeltaNet이라고 prefill 계산이 0이 되는 것은 아닙니다.",
            },
            {
              term: "Decode",
              description:
                "현재 accepted state에서 다음 token 하나를 만들고 cache를 한 step 갱신하는 구간입니다.",
              example:
                "KV는 한 열 늘고 Delta matrix는 같은 shape에서 값만 바뀝니다.",
              boundary: "O(1) in T여도 matrix traffic과 FFN 계산은 남습니다.",
            },
            {
              term: "Accepted prefix",
              description:
                "Target 검증을 통과해 이후 token이 정본 과거로 읽을 token 구간입니다.",
              example:
                "MTP가 네 token을 제안해 두 개만 승인하면 state도 두 token까지만 commit합니다.",
              boundary:
                "화면에 잠깐 생성한 draft 전체가 accepted prefix는 아닙니다.",
            },
          ]}
        />

        <HybridRuntimeFlowViz />
        <ContentBoundary article="qwen36-hybrid-runtime" />
      </section>

      <section id="hybrid-runtime" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>길이 비례 KV와 request당 고정 state를 따로 합산합니다</h2>
          <p className="leading-8">
            긴 request 하나에서는 KV가 지배합니다. 짧은 request를 많이 동시에 띄우면 request마다 반복되는 Delta state가 중요해집니다. “최대
            context”와 “최대 concurrency”는 같은 질문이 아닙니다.
          </p>
        </div>

        <ExplainedFormula
          question="Hybrid request memory를 어떤 성장축으로 나눠야 하나요?"
          idea={
            <>
              공유 weight는 한 번만 더하고, 각 request의 길이 비례 KV와 고정
              state를 request별로 합산한 뒤 실행에서 드러나는 workspace를 별도
              항으로 둡니다.
            </>
          }
          formula={String.raw`M_{runtime}=M_W+\sum_{r=1}^{N}[M_{KV}(T_r)+M_\Delta]+M_{work}`}
          annotatedFormula={String.raw`\begin{aligned}
m_r&=\underbrace{M_{KV}(T_r)}_{\substack{\text{request }r\text{의 길이에}\\\text{따라 증가}}}
 +\underbrace{M_\Delta}_{\substack{\text{길이와 무관하지만}\\\text{request마다 필요}}}\\
M_{runtime}&=\underbrace{M_W}_{\text{모든 request가 공유}}
 +\underbrace{\sum_{r=1}^{N}m_r}_{\text{active request별 state 합산}}
 +\underbrace{M_{work}}_{\substack{\text{kernel·graph·allocator}\\\text{실측 overhead}}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`M_{KV}(T_r)`,
              annotation: [
                "request마다 실제 token 길이를 넣어",
                "서로 다른 KV 크기를 계산",
              ],
            },
            {
              expression: String.raw`M_{KV}(T_r)+M_\Delta`,
              annotation: [
                "길이 비례 기록과 고정 작업판을",
                "한 request의 소유량으로 결합",
              ],
            },
            {
              expression: String.raw`\sum_{r=1}^{N}m_r`,
              annotation: [
                "동시에 살아 있는 request의 state를",
                "공유하지 않고 모두 합산",
              ],
            },
            {
              expression: String.raw`M_W+\sum m_r+M_{work}`,
              annotation: [
                "공유·request별·temporary memory를 분리해",
                "logical floor와 physical peak를 혼동하지 않음",
              ],
            },
          ]}
          terms={MEMORY_TERMS}
          assumptions={[
            "Prefix sharing·offload·beam branching과 TP/PP shard를 제외한 logical decomposition입니다.",
            "M_Δ에는 실제 engine이 보존하는 core·convolution state를 포함해야 합니다.",
            "Physical allocation은 cache block·alignment·kernel backend에 따라 달라집니다.",
          ]}
          interpretation="128K 하나와 32K 네 개는 logical KV 총량이 같을 수 있지만 고정 recurrent state는 후자가 네 배입니다. Scheduler는 실제 T₁…Tᴺ 분포로 admission해야 합니다."
          title="Hybrid request memory의 세 성장축"
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            M_work를 이루는 kernel temporary·allocator padding·activation과
            달리 <Link to="/ai/cuda-graph-capture">CUDA graph</Link>가
            차지하는 몫은 shape마다 capture된 graph 수에 좌우됩니다 — request
            길이 분포가 다양할수록 capture해야 할 shape도 늘어납니다.
          </p>
        </div>
      </section>

      <section id="prefix-transaction" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>Prefill·decode·MTP는 같은 prefix transaction을 지킵니다</h2>
          <p className="leading-8">
            Prefill chunk가 끝났거나 MTP draft가 일부 승인됐을 때 Attention KV만
            먼저 정본으로 만들면 안 됩니다. Delta state와 convolution history도
            정확히 같은 token까지 계산된 값이어야 합니다. Request state는 개별
            tensor 저장이 아니라{" "}
            <strong>accepted token boundary를 가진 generation</strong>입니다.
          </p>
        </div>

        <div id="state-commit" className="scroll-mt-20">
          <ExplainedFormula
            question="MTP 후보 중 a개만 승인됐을 때 무엇을 함께 commit해야 하나요?"
            idea={
              <>
                승인 token a까지의 KV, recurrent matrix, convolution history를
                한 tuple로 묶고 generation pointer를 한 번에 바꿉니다.
              </>
            }
            formula={String.raw`G_a=\operatorname{commit}(KV_{:a},S_a,C_a)`}
            annotatedFormula={String.raw`\begin{aligned}
a&=\underbrace{\operatorname{verify}(\text{draft})}_{\substack{\text{target이 승인한}\\\text{연속 prefix 길이}}}\\
G_a&=\operatorname{commit}\!\left(
 \underbrace{KV_{:a}}_{\text{Attention 기록}},
 \underbrace{S_a}_{\text{Delta matrix}},
 \underbrace{C_a}_{\text{local history}}\right)\\
\text{rollback}&=\underbrace{\operatorname{discard}(KV_{>a},S_{>a},C_{>a})}_{\substack{\text{승인 뒤의 임시 분기를}\\\text{세 state에서 함께 제거}}}
\end{aligned}`}
            operations={[
              {
                expression: String.raw`\operatorname{verify}(\text{draft})`,
                annotation: [
                  "target output과 후보를 대조해",
                  "연속 승인 token 수를 결정",
                ],
              },
              {
                expression: String.raw`(KV_{:a},S_a,C_a)`,
                annotation: [
                  "서로 다른 cache tensor를",
                  "같은 token boundary의 tuple로 묶음",
                ],
              },
              {
                expression: String.raw`\operatorname{commit}(\cdots)`,
                annotation: [
                  "generation pointer를 한 번에 바꿔",
                  "부분 commit을 방지",
                ],
              },
              {
                expression: String.raw`\operatorname{discard}(KV_{>a},S_{>a},C_{>a})`,
                annotation: [
                  "거절된 후보의 모든 state를",
                  "같은 suffix 범위에서 폐기",
                ],
              },
            ]}
            terms={PREFIX_TERMS}
            assumptions={[
              "Draft state는 committed state와 분리된 copy-on-write 또는 복구 가능한 representation입니다.",
              "a는 target이 승인한 연속 prefix 길이이며 중간 token을 건너뛰지 않습니다.",
              "Restart 뒤 generation pointer와 세 state의 token boundary를 검증할 receipt가 있어야 합니다.",
            ]}
            interpretation="KV만 rollback하면 Delta state는 거절된 token을 본 미래에 남고, Delta만 rollback하면 Attention은 더 긴 과거를 봅니다. 다음 token의 과거를 일치시키려면 원자적 commit이 필요합니다."
            title="Accepted prefix를 원자적으로 commit하는 이유"
          />
        </div>

        <TermBreakdown
          title="같은 transaction이 세 실행 형태를 연결합니다"
          items={[
            {
              term: "Chunked prefill",
              description:
                "각 prompt chunk의 KV와 final Delta state를 이전 accepted generation에 이어 붙입니다.",
              example: "두 번째 16K chunk는 첫 chunk의 state에서 시작합니다.",
              boundary:
                "Chunk 사이 state를 초기화하면 하나의 prompt가 여러 sequence가 됩니다.",
            },
            {
              term: "Recurrent decode",
              description:
                "새 token마다 KV 한 열과 fixed matrix 한 step을 갱신합니다.",
              example:
                "Attention read는 길어져도 Delta matrix shape는 같습니다.",
              boundary: "O(1) in T는 절대 연산량이 1이라는 뜻이 아닙니다.",
            },
            {
              term: "Speculative branch",
              description:
                "MTP 후보가 만든 cache를 target 검증 전까지 임시 generation에 둡니다.",
              example: "4개 중 2개 승인 시 token 2 경계만 승격합니다.",
              boundary:
                "Draft length와 accepted length를 같은 throughput 숫자로 쓰지 않습니다.",
            },
          ]}
        />

        <div id="paper-vllm-hybrid" className="scroll-mt-20">
          <CitationBlock
            source="vLLM · Hybrid KV Cache Manager design"
            citeKey={1}
            type="code"
            href="https://docs.vllm.ai/en/stable/design/hybrid_kv_cache_manager/"
          >
            <p>
              <strong>문제:</strong> 서로 다른 cache spec을 같은 allocator와
              request lifecycle에서 관리합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> Cache group의 physical memory per
              block을 맞추고 grouping·padding trade-off를 설명합니다.
            </p>
            <p>
              <strong>전제:</strong> 확인한 vLLM stable revision과 지원 cache
              spec입니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Hybrid cache group의 allocator
              설계입니다.
            </p>
            <p>
              <strong>비주장:</strong> Logical bytes와 physical cache block이
              정확히 같다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>

        <div id="paper-transformers-runtime" className="scroll-mt-20">
          <CitationBlock
            source="Hugging Face Transformers · Qwen3.5/Qwen3.6 reference"
            citeKey={2}
            type="code"
            href="https://huggingface.co/docs/transformers/model_doc/qwen3_5"
          >
            <p>
              <strong>문제:</strong> Hybrid layer의 chunk prefill·recurrent
              decode와 cache state shape를 실행 가능한 reference에서 확인합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> Layer dispatch, DeltaNet
              fast-kernel/fallback과 cache API 경계를 문서화합니다.
            </p>
            <p>
              <strong>전제:</strong> Transformers·optional kernel·GPU·dtype
              revision을 함께 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Reference recurrence와 cache
              lifecycle의 구현 경계입니다.
            </p>
            <p>
              <strong>비주장:</strong> Reference fallback 성능이 모든 serving
              engine의 production throughput을 대표하지 않습니다.
            </p>
          </CitationBlock>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            State lifecycle 다음에는{" "}
            <Link to="/ai/qwen36-long-context-deployment">
              Qwen3.6 long-context deployment
            </Link>
            에서 native·extended context, multimodal position과 48 GiB profile을
            별도 release 문제로 다룹니다.
          </p>
        </div>
      </section>
    </article>
  );
}
