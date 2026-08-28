import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SpeculativeDecodingVariantsViz from "./speculative-decoding-variants/viz/SpeculativeDecodingVariantsViz";

/**
 * Speculative decoding 변형은 draft 의 출처와 verify 의 모양으로 갈립니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function SpeculativeDecodingVariantsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          변형은 draft 를 어디서 얻고 verify 를 어떤 모양으로 하느냐로 갈립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Speculative decoding 의 변형은 두 축으로 정리됩니다. Draft token 을 별도 model,
            자기 자신의 앞부분, 학습된 보조 head, 과거 출력의 통계 가운데 어디서 얻느냐가 한
            축이고, verify 를 한 줄의 chain 으로 하느냐 여러 후보를 담은 tree 로 하느냐가 다른
            축입니다. 두 축의 조합이 곧 변형의 이름입니다.
          </p>
          <p>
            <Link to="/ai/vllm-spec-decode#overview">앞 글</Link> 은 작은 draft model 이 K 개
            token 을 제안하고 target 이 한 번의 forward 로 검증하는 기본 cycle 과, 수락률 α 와
            draft 비용 c 로 speedup 을 닫는 식을 다뤘습니다. 이 글은 그 식의 c 와 α 를 각
            변형이 어떻게 바꾸는지를 봅니다.
          </p>
          <p>
            Draft 출처로는 self-speculative(자기 앞 layer), MTP head(학습된 보조 head),
            suffix decoding(과거 출력의 suffix tree)을, verify 모양으로는 tree 기반 speculation 과
            tree attention verification 을 다룹니다. 아래 그림은 tree 하나가 어떻게 만들어지고
            한 번의 forward 로 검증되는지를 먼저 보입니다.
          </p>
        </div>
        <SpeculativeDecodingVariantsViz />
        <TermBreakdown
          title="변형을 가르는 두 축"
          description="각 변형은 draft 출처 하나와 verify 모양 하나를 고른 조합입니다."
          items={[
            { term: "Draft 출처", description: "제안 token 을 만드는 주체입니다. 별도 model, 자기 앞 layer, 학습된 head, 과거 출력의 통계가 있습니다.", example: "MTP head 는 c≈1/L, suffix tree 는 c≈0.001", boundary: "출처가 target 과 멀수록 α 가 낮고, 가까울수록 c 가 큽니다." },
            { term: "Verify 모양", description: "한 forward 에 넣는 후보의 구조입니다. Chain 은 K 개, tree 는 Σ_k Π s_i 개를 검증합니다.", example: "폭 (3,2,2) tree 는 21 개 후보를 한 번에", boundary: "Tree 는 token 수가 늘어 compute-bound 에 가까운 batch 에서 verify 비용이 오릅니다." },
          ]}
        />
        <ContentBoundary article="speculative-decoding-variants" />
      </section>

      <section id="self-speculative" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Self-speculative decoding 은 자기 앞 layer 를 draft model 로 씁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Self-speculative decoding 은 별도 draft model 없이 target 의 앞 E 개 layer 에서
            일찍 빠져나와 token 을 제안하고, 나머지 L−E 개 layer 로 검증하는 방식입니다. Draft 와
            verify 가 같은 weight 와 같은 KV cache 를 쓰므로 메모리가 추가로 들지 않습니다.
          </p>
          <p>
            비용은 layer 비율로 셉니다. L=32 에서 E=8 이면 draft token 하나에 forward 의 4 분의 1
            이 들어 c=0.25 입니다. Verify 는 앞 E 개 layer 의 KV 가 draft 때 이미 계산되어 있어
            나머지 24 개 layer 만 돌리므로 forward 의 0.75 배입니다.
          </p>
          <p>
            K=4 이면 cycle 비용은 4×0.25+0.75 = 1.75 forward 입니다. α=0.7 이면 기대 확정 길이가
            (1−0.7⁵)/0.3 = 2.77 이라 speedup 은 1.58 배이고, α=0.8 이면 3.36/1.75 = 1.92 배입니다.
            LayerSkip 논문은 요약 2.16 배, 코드 1.82 배를 보고했습니다.
          </p>
          <p>
            전제가 있습니다. 보통의 model 은 마지막 layer 까지 가야 답이 나오도록 학습되어 8 번째
            layer 의 출력에 LM head 를 붙이면 α 가 낮습니다. LayerSkip 은 뒤쪽 layer 일수록 높은
            비율로 layer 를 빼는 layer dropout 과, 모든 layer 가 같은 LM head 로 손실을 받는 early
            exit loss 로 앞 layer 의 α 를 올립니다.
          </p>
          <p>
            학습을 바꾸지 않는 변형도 있습니다. Draft &amp; Verify 는 pretrained model 의 중간
            layer 일부를 건너뛰는 부분 그래프를 Bayesian 탐색으로 골라 draft 로 쓰는데, 건너뛸
            layer 를 고르는 탐색이 model 마다 한 번 필요합니다.
          </p>
        </div>
        <div id="paper-layerskip" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Elhoushi et al. · LayerSkip: Enabling Early Exit Inference and Self-Speculative Decoding"
            citeKey={1}
            href="https://arxiv.org/abs/2404.16710"
          >
            2024 년 논문은 layer dropout 과 shared-head early exit loss 로 앞 layer 의 예측을
            학습하고, 앞 E 개 layer 를 draft, 나머지를 verify 로 쓰며 KV cache 와 exit query
            cache 를 공유하는 self-speculative decoding 을 제시했습니다. 요약 2.16 배, 코드
            1.82 배, 의미 분석 2.0 배는 저자 측정이며 학습 recipe 를 적용한 model 에 한정됩니다.
          </CitationBlock>
        </div>
      </section>

      <section id="mtp" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          MTP head 는 draft 비용을 layer 하나로 줄이고 이득은 조건식이 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            MTP head 는 target 학습 때 함께 훈련된 보조 module 로, 마지막 hidden state 와 다음
            token 의 embedding 을 받아 그다음 token 을 예측합니다. DeepSeek-V3 의 MTP module 은
            공유 embedding, Transformer block 하나, projection, 공유 output head 로 이뤄지고,
            깊이 k 의 module 은 깊이 k−1 의 출력을 입력으로 받아 인과 사슬을 유지합니다.
          </p>
          <p>
            Serving 에서 이 module 을 draft 로 쓰는 것이 MTP draft 입니다. Target forward 가 끝난
            hidden state 에 module 하나를 더 돌리면 다음 token 후보가 나오므로 draft 비용 c 는
            block 수의 비인 1/L 근처입니다. DeepSeek-V3 는 61 layer 에 module 1 개라 c≈0.016 이고,
            논문은 둘째 token 의 수락률 85~90 % 와 TPS 1.8 배를 보고했습니다.
          </p>
          <p>
            식에 넣어 보면 K=1, α=0.85, c=0.016 에서 speedup 은 (1+0.85)/(1+0.016) = 1.82 배로
            보고치와 맞습니다. 앞 글의{" "}
            <Link to="/ai/vllm-spec-decode#speedup-model">speedup 식</Link> 이 그대로 적용되며,
            MTP 가 바꾼 것은 c 를 0.1~0.3 에서 0.02 로 내린 것뿐입니다.
          </p>
          <p>
            효용 경계는 조건식으로 적습니다. Decode 가 memory-bound 인 동안 verify 는 token 수가
            K+1 배가 돼도 weight 를 한 번 읽는 비용에 머물지만, batch 가 커져 B(K+1) 개 token 이
            compute-bound 경계를 넘으면 verify 비용이 v 배로 늘어납니다. 이득이 남는 조건은
            기대 확정 길이가 Kc+v 보다 큰 것입니다.
          </p>
        </div>
        <ExplainedFormula
          question="MTP draft 가 base decode 보다 빠른 조건은 무엇인가요?"
          idea="분자는 한 cycle 에 확정되는 기대 token 수, 분모는 draft 비용 Kc 에 verify 비용 v 를 더한 forward 등가 수입니다. v 는 memory-bound 에서 1 이고 batch 가 compute-bound 경계를 넘으면 그 배율만큼 커집니다."
          formula={String.raw`S_{\text{MTP}}=\frac{\dfrac{1-\alpha^{K+1}}{1-\alpha}}{Kc+v(B)},\qquad v(B)=\max\!\Big(1,\ \frac{B(K+1)}{B^{*}}\Big),\qquad S_{\text{MTP}}>1 \iff \frac{1-\alpha^{K+1}}{1-\alpha}>Kc+v(B)`}
          annotatedFormula={String.raw`S_{\text{MTP}}=\frac{\overbrace{\dfrac{1-\alpha^{K+1}}{1-\alpha}}^{\text{cycle 당 기대 확정 token}}}{\underbrace{Kc}_{\text{MTP module 비용}}+\underbrace{v(B)}_{\text{verify 비용 배율}}},\qquad v(B)=\max\!\Big(1,\ \underbrace{\frac{B(K+1)}{B^{*}}}_{\text{compute-bound 초과분}}\Big)`}
          operations={[
            { expression: String.raw`\frac{1-\alpha^{K+1}}{1-\alpha}`, annotation: ["위치별 수락률 α 의 등비 합으로", "한 cycle 에 확정되는 기대 token 수를 구함"] },
            { expression: String.raw`Kc`, annotation: ["MTP module 을 K 번 돌리는 비용을", "target forward 한 번을 1 로 두고 더함"] },
            { expression: String.raw`\max\!\Big(1,\ \frac{B(K+1)}{B^{*}}\Big)`, annotation: ["batch B 에서 verify 하는 B(K+1) 개 token 이", "ridge 를 넘는 batch B* 를 초과한 배율만큼 verify 시간을 늘림"] },
          ]}
          terms={[
            { symbol: String.raw`\alpha`, name: "위치별 수락률", description: "MTP head 의 예측이 target 에 수락될 확률로, DeepSeek-V3 자기보고는 둘째 token 에서 0.85~0.90 입니다." },
            { symbol: "c", name: "Draft 비용 계수", description: "MTP module 하나의 비용을 target forward 로 나눈 값으로 block 수 비 1/L 근처입니다." },
            { symbol: String.raw`B^{*}`, name: "Ridge batch", description: "Decode 가 memory-bound 에서 compute-bound 로 넘어가는 token 수입니다. Hardware 와 model 에 따라 수십에서 수백입니다." },
          ]}
          assumptions={["수락이 위치마다 독립이고 같은 α 라는 앞 글의 단순화를 그대로 씁니다.", "v(B) 는 linear layer 의 weight 읽기만 본 근사이고 attention 의 KV 읽기는 token 수에 비례해 따로 늘어납니다."]}
          interpretation="K=1, c=0.016 이면 v=1 에서 α>0.016 만 넘으면 이득이지만, v=2 가 되는 batch 에서는 α>1.03 이 필요해 이득이 사라집니다. 경계는 α 가 아니라 batch 가 정합니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            숫자로 보면 K=1, α=0.85 에서 기대 확정 길이는 1.85 입니다. v=1 이면 1.82 배이고
            v=1.5 면 1.22 배, v=2 면 0.92 배로 base 보다 느립니다. 같은 model 이라도 batch 가
            ridge 의 절반을 넘는 순간 MTP 를 끄는 편이 낫다는 뜻이며, 그 batch 값은 자기 GPU
            에서 재야 합니다.
          </p>
          <p>
            둘째 경계는 α 의 분포 의존입니다. MTP head 는 사전학습 분포에서 훈련되므로 코드나
            구조화된 출력에서는 높고, 분포가 다른 입력에서는 떨어집니다. 셋째는 깊이입니다.
            Module 이 하나뿐인 model 에서 K&gt;1 을 만들려면 같은 module 을 다시 돌리는데, 학습
            때 없던 깊이라 α 가 위치마다 내려갑니다.
          </p>
        </div>
        <div id="paper-deepseek-v3-mtp" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="DeepSeek-AI · DeepSeek-V3 Technical Report, §2.2 Multi-Token Prediction · §5.4.3"
            citeKey={2}
            href="https://arxiv.org/abs/2412.19437"
          >
            2024 년 보고서는 깊이마다 인과 사슬을 유지하는 순차 MTP module(공유 embedding,
            Transformer block 하나, projection, 공유 output head)을 학습 목표로 두고, 추론에서
            그 module 을 speculative decoding 의 draft 로 재사용해 둘째 token 수락률 85~90 % 와
            TPS 약 1.8 배를 자기보고했습니다. Batch 조건과 GPU 는 보고서가 명시한 범위에 한정됩니다.
          </CitationBlock>
        </div>
      </section>

      <section id="tree" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Tree 기반 speculation 은 위치마다 후보 여러 개를 한 forward 에 넣습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Tree 기반 speculation 은 draft 가 위치마다 top-1 하나가 아니라 top-s 개 후보를 내고,
            그 후보들을 부모–자식으로 이어 token tree 를 만든 뒤 tree 전체를 target 의 한 forward
            로 검증하는 방식입니다. 첫 위치에서 top-1 이 틀려도 top-2 가 맞으면 cycle 이 계속됩니다.
          </p>
          <p>
            Tree 의 크기는 각 깊이의 폭 s_k 의 곱을 더한 값입니다. 폭이 (3, 2, 2) 이면 깊이 1 에
            3 개, 깊이 2 에 3×2 = 6 개, 깊이 3 에 12 개로 21 개 token 을 한 번에 검증합니다.
            같은 깊이의 chain 은 3 개만 검증하므로 verify 에 들어가는 token 이 7 배입니다.
          </p>
          <p>
            이득은 위치별 성공 확률이 top-1 수락률에서 top-s 포함률로 오르는 데서 옵니다. SpecInfer
            의 표는 폭을 5 로 늘리면 greedy 검증 성공률이 70 % 에서 89 % 로 오른다고 보고했습니다.
            폭 (3, 2, 2) 에서 포함률이 0.89, 0.85, 0.80 이면 기대 확정 길이는
            1+0.89+0.76+0.61 = 3.25 로, α=0.7 chain 의 2.53 보다 깁니다.
          </p>
          <p>
            Tree 를 만드는 방식이 변형마다 다릅니다. Medusa 는 head k 가 위치 t+k+1 을 독립으로
            예측하므로 각 head 의 top-s_k 를 Cartesian 곱으로 이어 붙이고, SpecInfer 는 작은
            draft model 을 여러 번 돌리거나 여러 draft model 의 tree 를 합치며,{" "}
            <Link to="/ai/vllm-spec-decode#paper-eagle">EAGLE</Link> 은 feature 단계에서 사슬을
            이으며 가지를 칩니다.
          </p>
          <p>
            비용은 후보 수에 비례해 늘어나는 verify token 입니다. Memory-bound decode 에서는
            weight 읽기가 같아 21 개나 3 개나 시간이 비슷하지만, attention 의 KV 읽기와 batch
            가 커진 뒤의 compute 는 21 배에 가깝게 늘어나므로 tree 크기는 batch 에 따라
            줄여야 합니다. Medusa 는 head 별 정확도 추정으로 tree 를 가지치기해 64 node 안에
            둡니다.
          </p>
        </div>
        <ExplainedFormula
          question="폭 s_1, …, s_D 인 tree 는 몇 개의 token 을 한 forward 에 검증하나요?"
          idea="깊이 k 의 node 수는 그 위까지의 폭의 곱이고, tree 전체는 깊이별 node 수의 합입니다. Chain 은 모든 s_k 가 1 인 특수한 경우입니다."
          formula={String.raw`|T|=\sum_{k=1}^{D}\prod_{i=1}^{k}s_i,\qquad \mathbb{E}[Y_T]=\sum_{k=0}^{D}\prod_{i=1}^{k}\beta_i`}
          annotatedFormula={String.raw`|T|=\underbrace{\sum_{k=1}^{D}\prod_{i=1}^{k}s_i}_{\text{깊이별 node 수의 합}},\qquad \mathbb{E}[Y_T]=\underbrace{\sum_{k=0}^{D}\prod_{i=1}^{k}\beta_i}_{\text{깊이 k 까지 모두 포함될 확률의 합}}`}
          operations={[
            { expression: String.raw`\prod_{i=1}^{k}s_i`, annotation: ["깊이 1 부터 k 까지의 폭을 곱해", "깊이 k 에 있는 후보 node 수를 구함"] },
            { expression: String.raw`\sum_{k=1}^{D}\prod_{i=1}^{k}s_i`, annotation: ["깊이별 node 수를 모두 더해", "한 forward 로 검증하는 token 수 |T| 를 얻음"] },
            { expression: String.raw`\prod_{i=1}^{k}\beta_i`, annotation: ["깊이 i 의 top-s_i 후보에 정답이 있을 확률 β_i 를 곱해", "깊이 k 까지 경로가 살아 있을 확률을 구함"] },
          ]}
          terms={[
            { symbol: String.raw`s_i`, name: "깊이 i 의 폭", description: "그 위치에서 tree 에 남기는 후보 수입니다. Chain 은 모두 1 입니다." },
            { symbol: String.raw`\beta_i`, name: "깊이 i 의 포함률", description: "Target 의 다음 token 이 깊이 i 의 후보 s_i 개 안에 있을 확률로, s_i=1 이면 α 입니다." },
            { symbol: "D", name: "Tree 깊이", description: "Chain 의 K 에 해당합니다." },
          ]}
          assumptions={["β_i 는 부모가 맞았다는 조건 아래의 확률이며 깊이마다 독립이라고 둡니다.", "Greedy 검증 기준이고 stochastic 검증은 residual 분포로 경로를 고릅니다."]}
          interpretation="폭 (3, 2, 2) 이면 |T|=21 이고, β=(0.89, 0.85, 0.80) 이면 기대 확정 길이 3.25 입니다. 후보를 7 배 넣어 길이를 2.53 에서 3.25 로 늘린 셈이라 memory-bound 일 때만 남는 거래입니다."
        />
        <div id="paper-medusa" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Cai, Li, Geng, Peng, Lee, Chen, Dao · Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads"
            citeKey={3}
            href="https://arxiv.org/abs/2401.10774"
          >
            2024 년 논문은 마지막 hidden state 위에 residual FFN head K 개를 붙여 위치 t+k+1 을
            독립 예측하고, head 별 top-s_k 의 Cartesian 곱을 tree attention 으로 한 번에 검증하며,
            entropy 기반 typical acceptance 를 제안했습니다. Vicuna 7B~33B 에서 batch 1 기준
            2.3~2.8 배는 저자 측정이며 typical acceptance 는 target 분포를 보존하지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="tree-verify" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Tree attention 은 조상만 보는 mask 로 tree 전체를 한 번에 검증합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Speculative tree verification 은 tree 의 모든 node 를 한 sequence 로 펼쳐 target 에
            넣되, 각 node 가 prefix 와 자기 조상만 보도록 attention mask 를 만드는 검증입니다.
            형제 가지가 서로를 보지 못하므로 각 경로의 logit 은 그 경로만 chain 으로 넣었을 때와
            같습니다.
          </p>
          <p>
            Mask 는 |T|×|T| 의 0/1 행렬입니다. 행 i 의 node 가 열 j 의 node 를 볼 수 있으면 1 이고,
            j 가 i 의 조상이거나 i 자신일 때만 1 입니다. 폭 (2, 2) 인 tree 는 node 6 개라 6×6 에
            1 이 12 개이고, 같은 6 token 을 chain 으로 넣었을 때의 causal mask 21 개보다 적습니다.
          </p>
          <p>
            검증은 root 에서 내려갑니다. 각 node 의 target 출력이 자식 가운데 하나와 일치하면 그
            자식으로 내려가고, 일치하는 자식이 없으면 멈추고 target 이 낸 token 을 마지막에
            붙입니다. 결과는 root 에서 내려온 경로 하나이고 다른 가지의 KV 는 버립니다.
          </p>
          <p>
            KV cache 도 tree 모양으로 씁니다. SpecInfer 는 depth-first 순서로 node 를 방문하며
            공유 KV cache 를 채우고, 확정 경로 밖의 항목은 다음 step 에서 덮어씁니다. Paged KV
            에서는 tree 의 token 들이 같은 block 에 이어 쓰이고 block table 만 정리하면 됩니다.
          </p>
          <p>
            Stochastic 검증은 경로 선택을 rejection sampling 으로 합니다. Node 마다 target 확률과
            draft 확률의 비로 수락을 정하고, 거부되면 그 node 의 residual 분포에서 뽑아 다른
            형제로 넘어가거나 멈춥니다. Target 분포가 보존되는 조건은 앞 글의{" "}
            <Link to="/ai/vllm-spec-decode#draft-verify">rejection sampling</Link> 과 같습니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Tree attention verification: token tree 하나를 한 forward 로 검증"
          input={["확정 prefix 와 그 KV cache", "token tree T (node 마다 token, parent)", "target model"]}
          steps={[
            { code: "order ← depth-first(T);  M ← zeros(|T|, |T|)", note: "Node 를 한 sequence 로 펼치고 tree mask 를 준비합니다." },
            { code: "for i in order: for j in ancestors(i) ∪ {i}: M[i, j] ← 1", note: "조상과 자기만 보게 해 형제 가지를 서로 가립니다." },
            { code: "logits ← target(prefix ⊕ order, mask = causal(prefix) ⊕ M)", note: "Prefix 는 모든 node 가 보고, node 사이는 M 이 정합니다. Forward 는 한 번입니다." },
            { code: "u ← root;  path ← []", note: "Root 는 마지막 확정 token 입니다." },
            { code: "while ∃ child c of u with argmax(logits[u]) = token(c): path.append(c); u ← c", note: "Greedy 검증. Stochastic 이면 비 p/q 로 수락하고 residual 로 넘어갑니다." },
            { code: "path.append(argmax(logits[u]))", note: "멈춘 node 의 target 출력을 bonus token 으로 붙여 cycle 마다 최소 1 개를 확정합니다." },
            { code: "commit KV of path;  discard KV of T ∖ path", note: "확정 경로 밖 가지의 KV 는 다음 step 이 덮어씁니다." },
          ]}
          output="확정 token 경로 path (길이 1 이상, 최대 D+1) 와 갱신된 KV cache"
        />
        <div id="paper-specinfer" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Miao et al. · SpecInfer: Accelerating Generative Large Language Model Serving with Tree-based Speculative Inference and Verification"
            citeKey={4}
            href="https://arxiv.org/abs/2305.09781"
          >
            2023 년 논문은 후보를 token tree 로 조직하고 topology-aware causal mask 로 tree 전체를
            한 forward 에 검증하는 tree-based parallel decoding 과, 경로를 따라 residual 분포로
            내려가는 multi-step speculative sampling 을 제시했습니다. 분산 추론 1.5~2.8 배,
            offloading 2.6~3.5 배는 저자 측정이며 draft 는 작은 SSM 여러 개를 전제합니다.
          </CitationBlock>
        </div>
      </section>

      <section id="suffix" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Suffix decoding 은 과거 출력의 suffix tree 에서 draft 를 꺼내 c 를 0 근처로 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Suffix decoding 은 model 없이 이전 요청의 출력과 현재 prompt 를 suffix tree 에 넣어
            두고, 최근 token 몇 개와 일치하는 suffix 뒤에 무엇이 자주 왔는지를 세어 draft 로 내는
            방식입니다. Draft 는 CPU 에서 token 당 약 20 µs 가 들어 GPU 비용이 없고, 반복이 많은
            agent workload 에서 확정 길이가 깁니다.
          </p>
          <p>
            자료 구조는 두 개입니다. 이전 출력 전체로 만든 global tree 와 현재 prompt 로 만든
            per-request tree 이고, node 마다 token 과 그 경로가 나온 횟수를 둡니다. 최근 token
            열의 가장 긴 일치 suffix 를 찾고, 그 아래 자식들을 빈도로 점수 매겨 가장 높은 node
            부터 greedy 로 확장해 speculation tree 를 만듭니다.
          </p>
          <p>
            비용 식에 넣으면 c 는 20 µs 를 decode step 약 25 ms 로 나눈 0.001 근처입니다. AgenticSQL
            에서 논문이 보고한 step 당 평균 확정 6.3 token 을 넣으면 상한은 6.3/(1+K×0.001) ≈ 6.2 배
            이고, 실측 5.3 배와의 차이는 긴 tree 를 verify 하는 target 쪽 비용입니다.
          </p>
          <p>
            Cache miss 는 draft 길이 0 으로 나타납니다. 일치 suffix 가 짧으면 확장할 자식이 없거나
            점수가 낮아 draft 를 몇 개만 내거나 아예 내지 않고, 그 step 은 보통 decode 와 같은
            비용으로 끝납니다. Model 기반 draft 처럼 틀린 K 개를 만들고 버리는 손실이 없어
            miss 가 speedup 을 1 아래로 끌어내리지 않습니다.
          </p>
          <p>
            한계는 분포입니다. 처음 보는 자유 서술에는 일치 suffix 가 없어 이득이 0 에 가깝고,
            SQL 생성이나 도구 호출처럼 형식이 반복되는 workload 에서만 확정 길이가 길어집니다.
            논문의 5.3 배는 AgenticSQL, 4.5 배는 SWE-Bench 에서 저자가 잰 값입니다.
          </p>
        </div>
        <div id="paper-suffix-decoding" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Oliaro, Jia, Campos, Qiao · SuffixDecoding: Extreme Speculative Decoding for Emerging AI Applications"
            citeKey={5}
            href="https://arxiv.org/abs/2411.04975"
          >
            2024 년 논문은 이전 출력과 prompt 의 suffix tree 에서 빈도 기반으로 speculation tree
            를 꺼내고 일치 길이에 따라 draft 수를 조절하는 model-free draft 를 제시했습니다.
            AgenticSQL 5.3 배, EAGLE-2/3 대비 2.8 배, SWE-Bench 4.5 배는 저자 측정이며 반복이
            많은 agent workload 에 한정된 결과입니다.
          </CitationBlock>
        </div>
        <TermBreakdown
          title="변형별 c 와 α 의 자리"
          description="같은 speedup 식에서 각 변형이 움직이는 항입니다."
          items={[
            { term: "Self-speculative", description: "c 는 E/L, verify 는 (L−E)/L 로 별도 메모리가 없습니다.", example: "E=8, L=32, K=4 에서 cycle 1.75 forward", boundary: "학습 recipe 없이는 앞 layer 의 α 가 낮습니다." },
            { term: "MTP head", description: "c 가 1/L 근처로 가장 작고 α 는 학습 분포에 묶입니다.", example: "c≈0.016, α=0.85 에서 1.82 배", boundary: "Batch 가 ridge 의 절반을 넘으면 v 가 커져 이득이 사라집니다." },
            { term: "Tree speculation", description: "α 대신 top-s 포함률 β 로 길이를 늘리고 verify token 을 |T| 배로 늘립니다.", example: "폭 (3,2,2) 에서 21 token, 길이 3.25", boundary: "Compute-bound 에 가까울수록 tree 를 줄여야 합니다." },
            { term: "Suffix decoding", description: "c≈0.001 이고 α 는 workload 의 반복성이 정합니다.", example: "AgenticSQL 평균 확정 6.3", boundary: "처음 보는 자유 서술에서는 draft 가 나오지 않습니다." },
          ]}
        />
        <ProgressiveDetail
          title="어느 변형을 언제 고르나요?"
          preview="MTP module 이 있는 model 은 작은 batch 에서 MTP 가 기본이고, 반복이 많은 agent workload 는 suffix decoding 이, 별도 학습 없이 메모리를 아껴야 하면 self-speculative 가, α 가 낮은 자유 서술은 tree 로 폭을 넓히는 것이 순서입니다."
        >
          <p>
            판단은 세 값으로 닫힙니다. 자기 workload 에서 잰 α(또는 β), 자기 GPU 에서 잰 c 와
            ridge batch, 그리고 운영 batch 의 분포입니다. 세 값을 speedup 식에 넣어 1 을 넘는
            변형만 후보이고, 후보가 여럿이면 verify token 이 적은 쪽이 batch 변동에 안전합니다.
          </p>
          <p>
            변형은 겹쳐 쓸 수 있습니다. MTP head 위에 tree 를 얹거나 suffix tree 가 miss 일 때
            EAGLE 로 넘어가는 구성이 그렇고, 이때 c 는 두 draft 비용의 합이 되므로 식을 다시
            세워야 합니다. 앞 글의{" "}
            <Link to="/ai/vllm-spec-decode#dynamic-policy">dynamic speculation policy</Link> 가
            그 전환을 runtime 에 하는 자리입니다.
          </p>
        </ProgressiveDetail>
      </section>
    </div>
  );
}
