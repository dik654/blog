import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import QsaIndexViz from "./viz/QsaIndexViz";

export default function QsaIndex({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="qsa-index" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">희소 attention은 블록을 먼저 고르고 원본을 읽습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Qwen Sparse Attention은 층마다 두 단계로 돕니다. 먼저 가벼운 indexer가 과거를 4토큰짜리 블록으로
          압축한 키로 점수를 매겨 읽을 블록을 고르고, 그 다음 실제 attention이 선택된 위치의 원본 K/V만
          읽습니다. 압축된 키는 색인이지 값이 아닙니다.
        </p>

        <p className="leading-7">
          이렇게 나누는 이유는 비용의 성격이 다르기 때문입니다. 문맥이 262,144 토큰까지 늘어나면 전체를
          보는 attention은 토큰 하나를 뽑을 때마다 그 길이만큼 K/V를 다시 읽어야 합니다. indexer는 4토큰을
          하나로 줄인 키만 훑으므로 같은 문맥에서 읽는 양이 4분의 1로 떨어집니다.
        </p>

        <p className="leading-7">
          점수는 head마다 내적을 구한 뒤 음수를 0으로 눌러 더합니다. head 하나가 반대 방향으로 크게 끌어
          내려 다른 head가 찾아낸 블록을 밀어내는 일을 막는 장치입니다.
        </p>
      </div>

      <ExplainedFormula
        question="어떤 블록을 읽을지 어떻게 정하나요"
        idea="질의 head마다 압축된 블록 키와의 유사도를 구한 뒤, 양의 기여만 더해 블록 하나의 점수로 만듭니다."
        formula={String.raw`s_j = \frac{1}{\sqrt{d_i}}\sum_{h=1}^{H_i}\mathrm{ReLU}\left(q_h \cdot \bar{k}_j\right)`}
        annotatedFormula={String.raw`\underbrace{s_j}_{\text{블록 }j\text{ 점수}} = \underbrace{\frac{1}{\sqrt{d_i}}}_{\text{차원 스케일}}\sum_{h=1}^{H_i}\underbrace{\mathrm{ReLU}\left(q_h \cdot \bar{k}_j\right)}_{\text{head }h\text{ 의 양의 기여}}`}
        operations={[
          {
            expression: String.raw`\bar{k}_j`,
            annotation: [
              "블록 j에 속한 4개 토큰의 index key를 FP32로 평균낸 뒤 정규화합니다",
              "블록의 첫 토큰 위치로 RoPE를 적용해 위치 정보를 남깁니다",
            ],
          },
          {
            expression: String.raw`q_h \cdot \bar{k}_j`,
            annotation: "질의 head h(4개)와 압축 키를 내적합니다. key head는 1개뿐이라 모든 질의 head가 같은 키를 씁니다",
          },
          {
            expression: String.raw`\mathrm{ReLU}\left(q_h \cdot \bar{k}_j\right)`,
            annotation: "음의 내적을 0으로 만듭니다. 한 head의 강한 반대 신호가 다른 head의 선택을 상쇄하지 못합니다",
          },
          {
            expression: String.raw`\frac{1}{\sqrt{d_i}}`,
            annotation: "index head 차원 128의 제곱근으로 나눠 점수 크기를 차원과 무관하게 맞춥니다",
          },
        ]}
        terms={[
          { symbol: String.raw`s_j`, name: "블록 점수", description: "블록 j를 읽을지 판단하는 하나의 실수입니다. 상위 512개만 선택됩니다." },
          { symbol: String.raw`q_h`, name: "indexer 질의", description: "현재 토큰에서 뽑은 4개 index query head 중 h번째입니다. attention의 24개 query head와는 별개입니다." },
          { symbol: String.raw`\bar{k}_j`, name: "압축 블록 키", description: "연속한 4개 토큰의 index key를 평균낸 128차원 벡터입니다." },
          { symbol: String.raw`H_i`, name: "index query head 수", description: "공개 config의 indexer_n_heads로 4입니다." },
          { symbol: String.raw`d_i`, name: "index head 차원", description: "indexer_head_dim으로 128입니다. attention head 차원 256과 다릅니다." },
        ]}
        assumptions={[
          "블록은 지금 시점에서 볼 수 있는 위치만 4개씩 끊어 만듭니다. 4개가 채워지지 않은 마지막 조각은 점수 계산에서 빠집니다.",
          "점수는 선택에만 쓰입니다. 이 값이 attention 확률이 되지는 않습니다.",
        ]}
        interpretation="점수가 높은 블록이 실제로 더 중요하다는 보장은 아니며, 학습으로 그렇게 정렬되도록 맞춰 둔 선택 규칙입니다. 선택이 틀리면 그 정보는 이 층에서 완전히 사라집니다."
      />

      <QsaIndexViz />

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("qsa-indexer", codeRefs["qsa-indexer"])} />
        <span className="text-xs text-muted-foreground">Qwen4ExpTextQSAIndexer.forward</span>
      </div>

      <h3 id="qsa-budget" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        2048 토큰 예산이 자리 2051개를 잡는 이유
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          예산은 블록 수로 환산해서 씁니다. <code>indexer_budget</code> 2048을{" "}
          <code>indexer_compress_ratio</code> 4로 나눈 512가 고를 블록 수이고, 되펼치면 다시 2048개
          토큰입니다. 여기에 아직 4개가 차지 않은 꼬리 토큰이 최대 3개 붙어 한 질의가 보는 위치는 최대
          2051개가 됩니다.
        </p>

        <p className="leading-7">
          문맥이 예산보다 짧으면 선택은 아무것도 버리지 않습니다. 8,000 토큰 문맥이라면 완전한 블록이
          2,000개라 512개만 남지만, 2,000 토큰 문맥에서는 블록이 500개뿐이라 전부 선택됩니다. 희소해지는
          시점이 문맥 길이 약 8K 부근이라는 뜻입니다.
        </p>

        <p className="leading-7">
          꼬리를 따로 붙이는 이유는 가장 최근 토큰이 아직 블록을 이루지 못하기 때문입니다. 압축 대상이 되지
          못한 최신 위치를 점수 경쟁 없이 항상 포함시켜, 방금 생성한 토큰이 다음 스텝에서 사라지지 않게
          합니다.
        </p>
      </div>

      <AlgorithmBlock
        title="QSA indexer 한 스텝"
        input={[
          "현재 토큰의 hidden state",
          "지금까지 저장된 index key 전체와 위치 정보",
          "causal mask로 얻은 볼 수 있는 위치 목록",
        ]}
        steps={[
          { code: "q, k_token = split(index_qk_proj(h))", note: "질의 4 head와 공유 key 1 head를 한 번의 투영으로 뽑습니다" },
          { code: "cache.update_indexer(k_token)", note: "index key는 attention K/V와 별도로 쌓입니다" },
          { code: "blocks = visible[: n*4].view(n, 4)", note: "볼 수 있는 위치를 4개씩 끊어 완전한 블록만 만듭니다" },
          { code: "k_bar = rope(norm(mean_fp32(keys[blocks])))", note: "블록 평균을 FP32로 구하고 블록 첫 위치의 RoPE를 적용합니다" },
          { code: "s = relu(q @ k_bar.T).sum(head) / sqrt(128)", note: "head별 양의 기여만 더해 블록 점수를 만듭니다" },
          { code: "top = s.topk(min(512, n))", note: "예산을 블록 단위로 씁니다. 블록이 512개 미만이면 전부 고릅니다" },
          { code: "sel = blocks[top].flatten() + tail", note: "선택 블록을 토큰으로 되펼치고 미완성 꼬리를 덧붙입니다" },
          { code: "mask = causal_mask & scatter(sel)", note: "선택 결과는 mask로만 전달되고 값 계산은 원본 K/V가 맡습니다" },
        ]}
        output="이 층의 attention이 읽을 위치만 남긴 mask (질의당 최대 2051개)"
      />

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("qsa-validation", codeRefs["qsa-validation"])} />
        <span className="text-xs text-muted-foreground">
          예산·압축비·head 수를 함께 검사하는 validate_architecture
        </span>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="선택이 빗나가면 무엇이 사라지나요"
          preview="선택되지 않은 위치는 이 층에서 확률 0이 아니라 아예 계산에 들어오지 않습니다. 다만 같은 토큰을 다른 층이 다시 볼 기회는 남습니다."
        >
          <p className="leading-7">
            mask는 causal mask와 논리곱으로 합쳐지므로 선택되지 않은 위치는 softmax 이전에 제거됩니다. 낮은
            확률로 살아남는 것이 아니라 존재하지 않는 위치가 됩니다. 한 층의 indexer가 필요한 문장을 놓치면
            그 층의 출력에는 해당 정보가 반영되지 않습니다.
          </p>
          <p className="leading-7">
            그래도 모델 전체가 정보를 잃는다고 단정할 수는 없습니다. 희소 층은 12개이고 각 층의 indexer는
            서로 다른 투영을 학습하므로 선택 집합이 층마다 다릅니다. 선형 층 36개는 애초에 문맥 전체를 압축한
            상태를 들고 있어 다른 경로로 과거를 남깁니다.
          </p>
          <p className="leading-7">
            이 상호 보완이 실제로 얼마나 성립하는지는 공개 config가 답해 주지 않습니다. 층별 선택 중복도와
            누락 회복률은 체크포인트를 직접 돌려 재야 하는 값이며, 이 글은 그 실측을 주장하지 않습니다.
          </p>
        </ProgressiveDetail>
      </div>

      <h3 id="paper-native-sparse-attention" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        선행 논문이 물려준 아이디어와 남긴 차이
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          블록 단위로 압축한 키로 읽을 곳을 고르고 그 선택을 학습으로 정렬한다는 발상은 Native Sparse
          Attention이 먼저 정리했습니다. 이 논문은 사후에 희소 패턴을 덧씌우는 대신 사전학습부터 희소
          경로로 학습해야 선택기가 쓸모 있는 신호를 배운다고 주장합니다.
        </p>

        <p className="leading-7">
          Flash-Next의 QSA는 그 원리를 가져오되 다른 자리에 놓았습니다. NSA는 압축·선택·슬라이딩 세 갈래를
          합쳐 attention 자체를 대체하지만, QSA는 선택만 담당하는 작은 모듈을 붙이고 나머지는 기존 GQA
          경로를 그대로 씁니다. 그리고 12개 층에서만 쓰이며 나머지 36개 층은 선형 mixer가 맡습니다.
        </p>

        <p className="leading-7">
          그래서 NSA의 벤치마크 수치를 Flash-Next의 성능 근거로 옮겨 읽으면 안 됩니다. 두 연구는 모델 크기도
          학습 데이터도 다르고, QSA가 선형 층과 함께 놓였을 때의 효과는 별도 평가 대상입니다.
        </p>
      </div>

      <CitationBlock
        source="Yuan et al. — Native Sparse Attention: Hardware-Aligned and Natively Trainable Sparse Attention (arXiv 2502.11089)"
        citeKey={1}
        type="paper"
        href="https://arxiv.org/abs/2502.11089"
      >
        압축 블록 점수로 읽을 구간을 고르고 그 선택을 사전학습부터 함께 학습한다는 설계를 제시한 논문입니다.
        저자 자기보고 실험은 해당 모델과 64K 길이 조건에 한정되며, Qwen의 QSA 구현이나 3:1 배치의 우수성을
        보증하지는 않습니다. 관련 배경은{" "}
        <Link to="/cs/ai/sparse-windowed-attention-patterns">희소 attention 패턴 계열</Link>에서 다룹니다.
      </CitationBlock>
    </section>
  );
}
