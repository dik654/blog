import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MultiHeadLatentAttentionMechanicsViz from "./multi-head-latent-attention-mechanics/viz/MultiHeadLatentAttentionMechanicsViz";

/**
 * MLA 는 latent 로 압축한 KV 를 흡수한 weight 로 곧장 소비합니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function MultiHeadLatentAttentionMechanicsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          MLA 는 decode 에서 key·value 를 복원하지 않고 latent 를 그대로 씁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <Link to="/ai/motif-3-architecture#gdla">MLA latent KV compression</Link> 은 token 마다
            key·value 를 저차원 latent 하나로 눌러 담아 KV cache 를 줄입니다. 이 글은 그 압축이
            구체적으로 어떤 두 행렬로 이뤄지는지, decode 에서 그 latent 를 다시 펼치지 않고
            바로 소비하려면 weight 를 어떻게 미리 접어 둬야 하는지, 그리고 그 접기가 위치
            정보(RoPE)를 왜 별도 경로로 빼내야만 성립하는지를 다룹니다.
          </p>
          <p>
            <Link to="/ai/kv-cache-fundamentals#kv-shape">KV cache</Link> 는 decode 마다 과거
            token 의 key·value 를 다시 계산하지 않으려고 들고 있는 상태입니다. 표준 multi-head
            attention 은 head 마다 독립된 key·value 를 저장하므로 head 수와 head 차원에 비례해
            cache 가 커집니다. <Link to="/ai/kv-cache-fundamentals#kv-shape-sharing">GQA</Link>
            는 head 를 묶어 이 크기를 줄이지만 공유된 head 만큼 표현력을 나눠 씁니다.
          </p>
          <p>
            MLA 는 다른 축을 택합니다. Head 별로 key·value 를 따로 두는 대신 모든 head 가
            공유하는 저차원 latent 벡터 하나만 캐시하고, 필요할 때 head 별 up-projection 으로
            복원합니다. 그런데 decode 에서 매 step 마다 이 복원을 다시 하면 압축한 의미가
            없어지므로, DeepSeek-V2 는 복원 행렬을 query·output 쪽으로 옮겨 접어 두는 방법을
            함께 제시했습니다.
          </p>
          <p>
            수치로 봅니다. DeepSeek-V2(236B)는 d_model=5120, head 128개, head 차원 128을
            씁니다. 표준 방식이라면 layer 하나가 token 하나마다 key·value 를 합쳐 128×128×2=32768
            개 원소를 캐시해야 합니다. MLA 는 이것을 latent 차원 512와 위치 전용 차원 64를
            더한 576개 원소로 줄입니다. 원소 수 기준 약 56.9배입니다.
          </p>
        </div>
        <div id="paper-deepseek-v2" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="DeepSeek-AI · DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model"
            citeKey={1}
            href="https://arxiv.org/abs/2405.04434"
          >
            2024년 논문 §2.1이 Multi-head Latent Attention 을 제시합니다. Low-rank joint
            key-value compression 과 decoupled RoPE 로 KV cache 를 GQA 2.25 group 수준까지
            줄이면서 MHA 보다 나은 품질을 보였다고 저자가 보고합니다. 수치는 236B 모델,
            자체 벤치마크 기준입니다.
          </CitationBlock>
        </div>
        <ContentBoundary article="multi-head-latent-attention-mechanics" />
      </section>

      <section id="kv-projection" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Down/up-projection 이 저차원 latent 병목을 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            MLA 의 압축은 두 단계입니다. Token 의 hidden state h_t 를 작은 latent
            c_t^KV 로 내리는 down-projection, 그리고 그 latent 에서 head 별 key·value 를
            다시 만드는 up-projection입니다. 캐시에 남는 것은 첫 단계의 결과 하나뿐입니다.
          </p>
          <p>
            KV down projection 은 W^DKV 라는 하나의 행렬로 h_t 를 d_c 차원 latent 로
            내립니다. K와 V를 따로 내리지 않고 같은 latent 를 공유하는 것이 핵심이라,
            압축률이 head 수만큼 곱으로 커집니다.
          </p>
          <p>
            KV up projection 은 W^UK, W^UV 두 행렬로 이 latent 를 head 별 key·value 로
            되돌립니다. Prefill 처럼 모든 token 을 병렬로 처리할 때는 이 복원을 실제로
            수행해 표준 attention 과 같은 모양으로 계산합니다.
          </p>
        </div>
        <ExplainedFormula
          question="h_t 하나에서 어떻게 저차원 latent 하나로 key 와 value 를 함께 표현하나요?"
          idea="먼저 모든 head 가 공유하는 좁은 통로로 내려 압축하고, head 가 필요한 순간에만 각자의 up-projection 으로 원래 크기를 되찾습니다."
          formula={String.raw`\mathbf{c}_t^{KV}=W^{DKV}\mathbf{h}_t,\qquad \mathbf{k}_t^{C}=W^{UK}\mathbf{c}_t^{KV},\qquad \mathbf{v}_t^{C}=W^{UV}\mathbf{c}_t^{KV}`}
          annotatedFormula={String.raw`\underbrace{\mathbf{c}_t^{KV}=W^{DKV}\mathbf{h}_t}_{\text{모든 head 공유 latent 로 압축}},\qquad \underbrace{\mathbf{k}_t^{C}=W^{UK}\mathbf{c}_t^{KV}}_{\text{head 별 content key 복원}},\qquad \underbrace{\mathbf{v}_t^{C}=W^{UV}\mathbf{c}_t^{KV}}_{\text{head 별 content value 복원}}`}
          operations={[
            { expression: String.raw`W^{DKV}\mathbf{h}_t`, annotation: ["d_model 차원 hidden state 를 d_c 차원으로 내려", "K 와 V 가 같은 latent 를 공유하게 만듦"] },
            { expression: String.raw`W^{UK}\mathbf{c}_t^{KV}`, annotation: ["latent 를 head 수만큼 넓혀 content key 를 복원", "prefill 처럼 병렬 계산일 때 실제로 수행"] },
            { expression: String.raw`W^{UV}\mathbf{c}_t^{KV}`, annotation: ["같은 latent 에서 content value 를 복원", "key 와 다른 weight 지만 입력은 같은 벡터"] },
          ]}
          terms={[
            { symbol: String.raw`\mathbf{h}_t`, name: "token hidden state", description: "d_model 차원 벡터입니다. DeepSeek-V2 는 5120." },
            { symbol: String.raw`\mathbf{c}_t^{KV}`, name: "KV latent", description: "d_c 차원으로 압축된 벡터로 캐시에 남는 유일한 것입니다. DeepSeek-V2 는 512." },
            { symbol: String.raw`W^{UK},\,W^{UV}`, name: "up-projection", description: "d_c 를 n_h·d_h 차원으로 넓히는 head 별 복원 행렬입니다." },
          ]}
          assumptions={["K와 V는 서로 다른 up-projection 을 쓰지만 입력 latent 는 같은 c_t^KV 하나입니다.", "Query 쪽도 같은 모양의 down/up 쌍(W^DQ, W^UQ)을 따로 두지만 latent 를 캐시하지는 않습니다."]}
          interpretation="캐시 대상이 head 수·head 차원에 비례하던 key·value 에서 head 와 무관한 latent 하나로 바뀝니다. 복원은 필요할 때만, 필요한 쪽에서만 일어납니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Low-rank KV bottleneck 은 이 latent 차원 d_c 가 만드는 좁은 통로 자체를
            가리키는 이름입니다. 128개 head 가 각자 128차원 key 를 가지면 head 를 이어 붙인
            차원은 16384인데, 이 정보 전부가 512차원 latent 하나를 거쳐야 합니다.
          </p>
          <p>
            압축률을 세어 보면 latent 자체는 16384/512=32배 좁습니다. 그런데 실제 캐시
            바이트는 K 와 V 가 같은 latent 를 공유하고 위치 항까지 더한 뒤에 정해지므로,
            바로 다음 절에서 볼 decoupled RoPE 를 더하면 비율이 달라집니다.
          </p>
          <p>
            Rank–compression tradeoff 는 d_c 를 얼마로 잡을지의 선택입니다. d_c 를 줄이면
            캐시와 up-projection 행렬이 함께 작아지지만, 512차원 통로에 16384차원 정보를
            우겨넣는 부담도 커져 head 들이 서로 구분해야 할 정보가 겹치기 쉬워집니다.
            DeepSeek-V2 는 512를 실험으로 골랐다고 밝혔을 뿐, 이 값이 최적이라는 증명은
            논문에 없습니다.
          </p>
          <p>
            <Link to="/ai/math-matrices-svd#low-rank">Low-rank approximation</Link> 이
            일반적으로 말하는 절충과 같습니다. Latent 차원이 실제 정보의 rank 보다 작으면
            reconstruction 오차가 생기고, 그 오차가 attention 품질로 새어 나갑니다.
          </p>
        </div>
      </section>

      <section id="decoupled-rope" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          RoPE 는 압축된 key 에 바로 곱하지 못해 위치 전용의 작은 경로로 분리됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <Link to="/ai/yarn-rope-extension#rope-foundation">RoPE</Link> 는 query 와 key 를
            위치에 비례한 각도로 회전시켜 상대 위치만 dot product 에 남기는 방법입니다.
            그런데 이 회전을 k_t^C 에 바로 적용하면 뒤에서 볼 weight absorption 이 깨집니다.
            그래서 MLA 는 위치 정보를 압축 경로 밖의 작은 벡터로 따로 만듭니다.
          </p>
          <p>
            이유는 회전 자체가 위치 t 마다 달라지는 행렬이라는 데 있습니다. k_t^C=W^UK c_t^KV
            에 RoPE 회전 R(t)를 곱하면 결과는 R(t)W^UK c_t^KV 가 되고, 이 R(t)W^UK 는 t 마다
            다른 행렬이라 미리 한 번 W^Q 쪽으로 접어 재사용할 수 없습니다. 매 위치마다
            다시 곱해야 하면 absorption 의 이득이 사라집니다.
          </p>
          <p>
            해법은 위치 항을 latent 를 거치지 않는 별도 경로로 빼는 것입니다. Query 쪽은
            head 마다 다른 작은 벡터를, key 쪽은 모든 head 가 공유하는 벡터 하나를
            hidden state 에서 직접 만들고, 여기에만 RoPE 를 적용합니다.
          </p>
        </div>
        <ExplainedFormula
          question="위치 정보는 어디서 따로 만들어져 어떻게 RoPE 를 적용받나요?"
          idea="Query 의 위치 벡터는 head 별로, key 의 위치 벡터는 모든 head 가 공유하는 하나로 hidden state 에서 직접 만들고, 이 작은 벡터에만 회전을 적용합니다."
          formula={String.raw`\mathbf{q}_t^{R}=\operatorname{RoPE}\!\big(W^{QR}\mathbf{c}_t^{Q}\big),\qquad \mathbf{k}_t^{R}=\operatorname{RoPE}\!\big(W^{KR}\mathbf{h}_t\big)`}
          annotatedFormula={String.raw`\underbrace{\mathbf{q}_t^{R}=\operatorname{RoPE}\!\big(W^{QR}\mathbf{c}_t^{Q}\big)}_{\text{head 별 위치 query, 회전 적용}},\qquad \underbrace{\mathbf{k}_t^{R}=\operatorname{RoPE}\!\big(W^{KR}\mathbf{h}_t\big)}_{\text{head 공유 위치 key, }h_t\text{에서 직접}}`}
          operations={[
            { expression: String.raw`W^{QR}\mathbf{c}_t^{Q}`, annotation: ["query latent 에서 head 별 위치 벡터를 만들어", "content query 와 나란히 이어 붙일 준비"] },
            { expression: String.raw`W^{KR}\mathbf{h}_t`, annotation: ["압축 latent 를 거치지 않고 h_t 에서 직접 만들어", "모든 head 가 이 벡터 하나를 공유"] },
            { expression: String.raw`\operatorname{RoPE}(\cdot)`, annotation: ["위치 t 에 비례한 각도로 좌표쌍을 회전시켜", "회전이 latent 압축 경로 밖에서만 일어나게 함"] },
          ]}
          terms={[
            { symbol: String.raw`\mathbf{q}_t^{R},\,\mathbf{k}_t^{R}`, name: "위치 query/key", description: "차원 d_h^R. DeepSeek-V2 는 64로, content 차원 128의 절반입니다." },
            { symbol: String.raw`W^{QR}`, name: "위치 query projection", description: "query latent c_t^Q 에서 head 별 위치 벡터를 만드는 행렬입니다." },
            { symbol: String.raw`W^{KR}`, name: "위치 key projection", description: "h_t 에서 직접 위치 벡터 하나를 만드는 행렬로, 모든 head 가 같은 결과를 씁니다." },
          ]}
          assumptions={["k_t^R 은 head 사이에 공유되므로 캐시에는 head 수와 무관하게 한 벡터만 늘어납니다.", "q_t^R 은 head 마다 다르지만 decode 매 step 새로 계산될 뿐 캐시되지는 않습니다."]}
          interpretation="위치 정보가 압축·복원 경로 밖에 있으므로 회전 R(t) 는 이 작은 벡터에만 곱해지고, content 쪽 up-projection W^UK 는 위치와 무관한 고정 행렬로 남아 뒤에서 볼 absorption 이 성립합니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            수치로 보면 위치 경로가 얼마나 얇은지 드러납니다. d_h^R=64를 head 마다 따로
            뒀다면 128개 head 가 64×128=8192개 원소를 캐시해야 하지만, key 쪽을 공유해
            토큰당 64개만 늘어납니다. Content latent 512와 합쳐 576이라는 앞 절의 숫자가
            여기서 나옵니다.
          </p>
        </div>
      </section>

      <section id="content-position" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          최종 attention 점수는 content 끼리의 내적과 위치끼리의 내적을 더한 값입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Query 와 key 는 각각 content 부분과 위치 부분을 이어 붙인 벡터입니다. 두 벡터를
            이어 붙이고 내적을 하면 결과는 이어 붙인 부분끼리의 내적을 각각 구해 더한
            값과 같으므로, attention 점수는 자동으로 두 항의 합으로 갈라집니다.
          </p>
          <p>
            Content query 는 q_t^C=W^UQ c_t^Q, content key 는 k_t^C=W^UK c_t^KV 로 앞 절까지
            나온 두 latent 에서 만들어집니다. Positional query·key 는 방금 만든 q_t^R,
            k_t^R 입니다. 최종 벡터는 각각 [q_t^C; q_t^R], [k_t^C; k_t^R]입니다.
          </p>
          <p>
            score = q_t^C·k_t^C + q_t^R·k_t^R 로, 앞 항은 512차원 latent 를 거친 content
            유사도, 뒷 항은 64차원 위치 유사도입니다. 두 항은 서로 다른 weight 와 서로
            다른 차원에서 독립적으로 계산되고 마지막에 더해질 뿐입니다.
          </p>
          <p>
            Decoupled content/position attention 이라는 이름은 이 분리 자체를 가리킵니다.
            표준 RoPE 적용 attention 은 이 둘을 애초에 나누지 않아 회전이 content 계산
            속으로 섞여 들어가지만, MLA 는 둘을 끝까지 분리해 둡니다.
          </p>
        </div>
        <TermBreakdown
          title="MLA 의 query·key 를 이루는 네 조각"
          description="이어 붙여진 두 벡터 안에서 서로 다른 역할을 하는 부분들입니다."
          items={[
            { term: "Content query", description: "q_t^C=W^UQ c_t^Q. Query latent 에서 복원된, 위치와 무관한 부분입니다.", example: "차원 128", boundary: "회전이 걸리지 않으므로 이 부분만 따로 weight absorption 대상이 됩니다." },
            { term: "Content key", description: "k_t^C=W^UK c_t^KV. KV latent 에서 복원된, 위치와 무관한 부분입니다.", example: "차원 128", boundary: "decode 에서는 실제로 복원하지 않고 흡수된 형태로만 등장합니다." },
            { term: "Positional query", description: "q_t^R=RoPE(W^QR c_t^Q). Head 별로 다른 위치 전용 부분입니다.", example: "차원 64", boundary: "매 decode step 마다 새로 계산되고 캐시되지 않습니다." },
            { term: "Positional key", description: "k_t^R=RoPE(W^KR h_t). 모든 head 가 공유하는 위치 전용 부분입니다.", example: "차원 64, head 공유", boundary: "head 별로 따로 두면 캐시가 head 수만큼 커져 목적이 무너집니다." },
          ]}
        />
      </section>

      <section id="weight-absorption" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          결합법칙으로 up-projection 을 옮겨 접는 weight absorption
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Weight absorption 은 학습이 끝난 뒤 고정된 W^UK, W^UV 를 다른 행렬과 미리
            곱해 접어 두는 재결합입니다. Content 점수와 출력이 행렬곱의 결합 순서를
            바꿔도 같은 값이라는 사실만으로 성립하며, 추가 학습은 필요 없습니다.
          </p>
          <p>
            Query-side absorption 은 content 점수 계산에 씁니다. q_t^C·k_t^C = q_t^C·(W^UK
            c_j^KV) 인데, 이를 (W^UK^T q_t^C)·c_j^KV 로 다시 묶으면 과거 token 마다 k_j^C
            를 만들 필요 없이 캐시된 c_j^KV 를 latent 공간에서 바로 상대할 수 있습니다.
          </p>
          <p>
            Value-side absorption 은 출력 쪽입니다. 가중합 결과를 W^UV 로 복원한 뒤
            W^O 를 곱하는 대신, W^O W^UV 를 먼저 곱해 둔 하나의 행렬로 latent 가중합을
            바로 model 차원으로 보냅니다. v_j^C 도 끝까지 만들어지지 않습니다.
          </p>
        </div>
        <ExplainedFormula
          question="decode 에서 과거 latent 를 다시 펼치지 않고 어떻게 점수와 출력을 계산하나요?"
          idea="내적과 가중합은 결합법칙을 따르므로 W^UK 는 query 쪽으로, W^UV 는 W^O 쪽으로 미리 옮겨 곱해 두면 계산 순서만 바뀌고 값은 같습니다."
          formula={String.raw`\text{score}^{C}_{t,j}=(W^{UK}\mathbf{c}_t^{Q\!\to\!K})^{\!\top}\!\mathbf{c}_j^{KV}=\big((W^{UK})^{\!\top}\mathbf{q}_t^{C}\big)^{\!\top}\mathbf{c}_j^{KV},\qquad \mathbf{o}_t=(W^{O}W^{UV})\sum_j p_{t,j}\,\mathbf{c}_j^{KV}`}
          annotatedFormula={String.raw`\underbrace{(W^{UK})^{\!\top}\mathbf{q}_t^{C}}_{\text{query-side absorption, 새 토큰마다 한 번}}\!{}^{\top}\underbrace{\mathbf{c}_j^{KV}}_{\text{캐시된 latent, 복원 없이 그대로}},\qquad \mathbf{o}_t=\underbrace{(W^{O}W^{UV})}_{\text{value-side absorption, 미리 접어 둔 상수}}\underbrace{\sum_j p_{t,j}\,\mathbf{c}_j^{KV}}_{\text{latent 공간에서의 가중합}}`}
          operations={[
            { expression: String.raw`(W^{UK})^{\!\top}\mathbf{q}_t^{C}`, annotation: ["현재 query 를 head 별 up-projection 의 전치로 접어", "512차원 latent 공간의 벡터로 바꿈 — 새 token 마다 head당 한 번"] },
            { expression: String.raw`\sum_j p_{t,j}\,\mathbf{c}_j^{KV}`, annotation: ["attention 가중치로 과거 latent 를 그대로 가중합해", "v_j^C 를 한 번도 만들지 않음"] },
            { expression: String.raw`W^{O}W^{UV}`, annotation: ["value up-projection 과 output projection 을 미리 곱해", "가중합 결과를 latent 공간에서 model 차원으로 한 번에 보냄"] },
          ]}
          terms={[
            { symbol: String.raw`p_{t,j}`, name: "attention 가중치", description: "content 점수와 위치 점수를 더한 score 에 softmax 를 적용한 값입니다." },
            { symbol: String.raw`(W^{UK})^{\!\top}`, name: "흡수된 query 쪽 행렬", description: "d_h×d_c 행렬의 전치로, 미리 한 번 곱해 두면 매 decode step 재사용합니다." },
            { symbol: String.raw`W^{O}W^{UV}`, name: "흡수된 output 쪽 행렬", description: "학습 후 고정된 두 행렬의 곱으로, 추론 내내 상수입니다." },
          ]}
          assumptions={["W^UK, W^UV, W^O 사이에 비선형이 없어야 결합법칙으로 순서를 바꿀 수 있습니다.", "content 부분에만 적용됩니다. 위치 부분은 RoPE 회전이 t 마다 달라 같은 방식으로 접을 수 없습니다."]}
          interpretation="Content 점수의 내적 차원이 128에서 512로 늘어 head당 곱셈은 늘지만, 캐시에서 읽는 바이트는 head 차원과 무관한 latent 576개 원소로 고정됩니다. Decode 는 메모리 대역폭에 묶여 있어 이 교환이 순이익이 됩니다."
        />
        <MultiHeadLatentAttentionMechanicsViz />
        <AlgorithmBlock
          title="MLA decode: 새 token 하나가 흡수된 weight 로 latent 캐시와 만나는 한 step"
          input={[
            "h_t ∈ R^{d_model} (현재 token hidden state)",
            "캐시 C=[c_1^KV,…,c_{t-1}^KV] ∈ R^{(t-1)×d_c}, K^R=[k_1^R,…,k_{t-1}^R] ∈ R^{(t-1)×d_h^R}",
            "흡수된 상수 행렬 (W^UK)^T (head 별), W^O W^UV, 그리고 W^DQ, W^UQ, W^QR, W^KR",
          ]}
          steps={[
            { code: "c_t^KV ← W^DKV h_t;  C.append(c_t^KV)", note: "새 token 의 latent 만 압축해 캐시에 더합니다. k_t^C, v_t^C 는 만들지 않습니다." },
            { code: "k_t^R ← RoPE(W^KR h_t);  K^R.append(k_t^R)", note: "위치 key 는 head 공유이므로 벡터 하나만 캐시에 더합니다." },
            { code: "c_t^Q ← W^DQ h_t", note: "query 쪽 latent 를 압축합니다. 이 값은 캐시하지 않습니다." },
            { code: "for head i: q_t^{C,i} ← W^UQ_i c_t^Q;  q_t^{R,i} ← RoPE(W^QR_i c_t^Q)", note: "head 별 content query 와 위치 query 를 만듭니다." },
            { code: "for head i: q'^i_t ← (W^UK_i)^T q_t^{C,i}", note: "query-side absorption. Head 당 한 번, 과거 token 수와 무관합니다." },
            { code: "for head i, j=1..t: score_{i,j} ← q'^i_t · c_j^KV + q_t^{R,i} · k_j^R", note: "content 내적과 위치 내적을 각각 구해 더합니다." },
            { code: "p_i ← softmax(score_i / sqrt(d_h + d_h^R))", note: "표준 attention 과 같은 scaling 을 두 항 합의 차원으로 적용합니다." },
            { code: "for head i: o_i ← Σ_j p_{i,j} c_j^KV", note: "latent 공간에서 가중합을 구합니다. v_j^C 는 등장하지 않습니다." },
            { code: "out ← Σ_i (W^O_i W^UV_i) o_i", note: "value-side absorption. 마지막에 한 번만 model 차원으로 투영합니다." },
          ]}
          repeatUntil="다음 token 이 생성될 때마다 캐시 C, K^R 에 한 줄씩 더하며 반복합니다."
          output="attention 출력 out ∈ R^{d_model}, 갱신된 캐시 C, K^R (k_t^C, v_t^C 는 어느 step 에서도 저장되지 않습니다)"
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Absorption 은 메모리 왕복을 줄이는 대신 head당 곱셈을 늘리는 교환입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            MLA 는 공짜가 아닙니다. Content 점수의 내적을 128차원에서 512차원으로 늘려
            head당 곱셈이 네 배 늘어난 대가로 캐시 바이트를 56.9배 줄입니다. Decode 가
            <Link to="/ai/kv-cache-fundamentals#kv-shape">메모리 대역폭에 묶여 있다는 전제</Link>
            아래에서만 이 교환이 이득입니다.
          </p>
          <p>
            그래서 실제 구현은 경로를 나눕니다. vLLM 의 MLA kernel 은 prefill 처럼
            query·key 비율이 1에 가까울 때는 흡수하지 않은(naive) 경로로 head 별
            key·value 를 실제로 복원해 계산량을 아끼고, decode 처럼 비율이 작을 때만
            흡수된 경로를 씁니다.
          </p>
          <p>
            둘째 한계는 absorption 이 선형 재결합이라는 점입니다. W^UK, W^UV 사이에
            비선형이나 위치 의존 행렬이 끼면 결합법칙이 깨져 접을 수 없습니다. Decoupled
            RoPE 가 있는 이유가 바로 이 한계를 피하기 위해서입니다.
          </p>
          <p>
            셋째, d_c 를 더 줄이는 선택은 이 글의 범위가 아닙니다. Rank–compression
            tradeoff 가 어디까지 버티는지는 구현마다 다른 실험 질문이고, 이어지는
            <Link to="/ai/qwen36-hybrid-architecture#deltanet-state"> Gated DeltaNet 계열의 recurrent state</Link>
            처럼 latent 크기를 완전히 고정 shape 으로 바꾸는 접근도 있습니다.
          </p>
        </div>
        <div id="paper-deepseek-v3" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="DeepSeek-AI · DeepSeek-V3 Technical Report"
            citeKey={2}
            href="https://arxiv.org/abs/2412.19437"
          >
            2024년 후속 보고서는 671B 모델에 같은 MLA 설계를 그대로 채택했다고 밝히며,
            이 글의 압축·absorption 설계가 DeepSeek-V2 한 세대의 실험이 아니라 이어지는
            구성임을 확인해 줍니다. 세부 dimension 은 두 보고서가 조금 다를 수 있습니다.
          </CitationBlock>
        </div>
        <div id="paper-vllm-mla" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="vLLM Project · MLA attention 구현 (mla_attention)"
            citeKey={3}
            href="https://docs.vllm.ai/en/v0.22.0/api/vllm/model_executor/layers/attention/mla_attention/"
            type="code"
          >
            공식 구현 문서는 prefill 을 compute-friendly naive 경로로, decode 를
            data-movement-friendly absorbed 경로로 나눈다고 설명합니다. 캐시된 latent
            (kv_c)와 위치 key(k_pe)를 분리해 저장한다는 서술도 이 문서를 따릅니다.
          </CitationBlock>
        </div>
        <ProgressiveDetail
          title="MHA·GQA·MLA 의 token당 KV cache 원소 수를 어떻게 비교하나요?"
          preview="MHA는 2·n_h·d_h, GQA는 2·n_g·d_h, MLA는 d_c+d_h^R 개 원소입니다. DeepSeek-V2 숫자를 넣으면 MLA 는 GQA의 group 2.25개와 같은 크기입니다."
        >
          <p>
            MHA: 2×128×128=32768. GQA를 group 8개로 예로 들면 2×8×128=2048. MLA:
            512+64=576. 576을 2×128로 나누면 2.25가 나와, 논문이 말한 "GQA 2.25 group과
            같은 크기"라는 문장이 그대로 재현됩니다.
          </p>
          <p>
            이 비교는 원소 수 기준이며 실제 byte 는 <Link to="/ai/kv-cache-fundamentals#kv-shape-formula">dtype</Link>
            에 곱해집니다. Query 쪽 압축(d_c'=1536)은 캐시되지 않으므로 이 비교에
            들어가지 않습니다.
          </p>
        </ProgressiveDetail>
      </section>
    </div>
  );
}
