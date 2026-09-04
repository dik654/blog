import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SparseWindowedAttentionPatternsViz from "./sparse-windowed-attention-patterns/viz/SparseWindowedAttentionPatternsViz";

/**
 * Sliding-window·sparse·hybrid attention 은 mask 가 어느 (query, key) 쌍을
 * 아예 계산하지 않을지 미리 정해 O(n²) 을 O(n·w) 로 낮추는 설계입니다.
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function SparseWindowedAttentionPatternsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Attention 은 어디를 볼지 window·sparse·hybrid 로 정해 비용을 줄입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Full attention 은 query 하나가 과거 n 개 key 전부를 보므로 layer 하나의 attention FLOP 이 n 의 제곱에 비례합니다. n 이 수만
            token 을 넘으면 이 항이 나머지 계산을 누르고 KV cache 도 n 에 비례해 계속 커집니다.
          </p>
          <p>
            Sliding-window, sparse, hybrid attention 은 계산을 빨리 하는 대신 query 가 애초에 볼 수 있는 key 의 집합을 n 보다 훨씬 작게 미리
            정해 둡니다.
          </p>
          <p>
            <Link to="/ai/attention-kernel-anatomy-and-backends#anatomy">Attention kernel 글</Link>
            은 이 mask 안에서 실제로 남은 tile 을 GPU 가 어떻게 빨리 계산하는지를 다뤘고,{" "}
            <Link to="/ai/yarn-rope-extension#rope-foundation">YaRN 글</Link>은 각 위치가 어떤
            숫자로 표현되는지를 다뤘습니다. 이 글은 그 앞 단계, 즉 n×n mask 가운데 어느 칸을
            아예 비워 둘지를 다룹니다.
          </p>
          <p>
            먼저 최근 w 개 token 만 보는 sliding-window(local) attention 을 봅니다. 그다음 window 로는 닿지 않는 원거리 정보를 위해 global
            token 몇 개를 더한 sparse attention(Longformer, BigBird)으로 넘어갑니다.
          </p>
          <p>
            이어서 token 이 아니라 layer 단위로 local 과 global 을 나누는 hybrid attention(Gemma)을 봅니다. 마지막으로 이 고정 패턴들과 학습된
            sparsity 를 쓰는 Native Sparse Attention 을 대조합니다.
          </p>
        </div>
        <SparseWindowedAttentionPatternsViz />
        <ContentBoundary article="sparse-windowed-attention-patterns" />
      </section>

      <section id="window" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Sliding-window attention 은 최근 w 개만 보고 layer 를 쌓아 범위를 넓힙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Sliding-window attention(local attention)은 mask 를 고정해 둡니다. 위치 i 의 query 는 전체 과거 대신 직전 w 개 key 만
            봅니다. Attention 이 보는 폭은 i 가 커져도 w 로 일정합니다. 한 layer 의 attention FLOP 과 그 layer 가 저장해야 하는 KV 폭이 모두 n
            이 아니라 w 에 비례합니다.
          </p>
          <p>
            Mistral 7B 는 W=4096, layer 32 개에 이 패턴을 씁니다. 한 layer 는 4096 개 밖의 token 을 보지 못하지만 layer 를 쌓으면 정보가 한
            칸씩 더 멀리 전달됩니다. k 번째 layer 까지 쌓은 뒤의 이론적 수신 범위(receptive field)는 W×k 이고 32 layer 전부를 지나면 약 131,072
            token, 즉 32K 문맥 전체보다 넓어집니다.
          </p>
          <p>
            그렇다고 첫 layer 부터 먼 정보가 보이는 것은 아닙니다. n=32,768, w=4096 인 sequence 를 8 layer 만 지나야 겨우 W×8=32,768 로 전체
            길이를 덮습니다. 그 전 layer 에서는 멀리 있는 사실 하나를 찾는 task 가 window 폭보다 먼 거리에서는 아예 신호를 못 받습니다. 이 한계가 다음 절의
            global token 을 부릅니다.
          </p>
        </div>
        <ExplainedFormula
          question="Window w 로 attention FLOP 과 layer 를 쌓았을 때의 수신 범위는 각각 어떻게 바뀌나요?"
          idea="Dense attention 은 query 마다 key n 개를 전부 보지만 window attention 은 w 개만 봅니다. 대신 한 layer 의 수신 범위도 w 로 줄어들므로, 그 범위를 늘리려면 layer 를 쌓아야 하고 k layer 뒤에는 W·k 까지 정보가 전달됩니다."
          formula={String.raw`\mathrm{FLOP}_{\text{dense}} = 4n^2d,\qquad \mathrm{FLOP}_{\text{window}} = 4nwd,\qquad R_k = Wk`}
          annotatedFormula={String.raw`\mathrm{FLOP}_{\text{window}} = \underbrace{4nwd}_{\text{query } n\text{개} \times \text{key } w\text{개}},\qquad R_k = \underbrace{Wk}_{\text{layer } k\text{개가 쌓은 수신 범위}}`}
          operations={[
            { expression: String.raw`4n^2d`, annotation: ["Query n 개가 key n 개를 모두 보는", "dense QK+PV 의 FLOP"] },
            { expression: String.raw`4nwd`, annotation: ["Query n 개가 key w 개만 보도록", "mask 를 고정했을 때의 FLOP"] },
            { expression: String.raw`Wk`, annotation: ["Window 폭 W 를 layer 수 k 로 곱해", "정보가 실제로 전달되는 최대 거리를 계산"] },
          ]}
          terms={[
            { symbol: "n", name: "Sequence 길이", description: "지금까지 처리한 전체 token 수입니다." },
            { symbol: "w, W", name: "Window 폭", description: "query 하나가 보는 key 의 개수입니다. Mistral 7B 는 4096 을 씁니다." },
            { symbol: "d", name: "Head dimension", description: "attention-kernel-anatomy 글과 같은 head 당 차원 수입니다." },
            { symbol: "R_k", name: "k layer 뒤의 수신 범위", description: "정보가 layer 를 거쳐 전달될 수 있는 최대 거리입니다." },
          ]}
          assumptions={["Causal window(과거 w 개만)를 기준으로 하며, dilation 이나 layer 별로 다른 w 는 다음 절에서 따로 다룹니다.", "FLOP 은 QK·PV matmul만 세고 global token 이나 random key 는 다음 절에서 더합니다."]}
          interpretation="n=32,768, w=4096 이면 FLOP 은 dense 대비 8분의 1이고, 이는 Mistral 7B 논문이 보고한 32K sequence 에서의 KV cache 8배 절감과 같은 비율입니다. 수신 범위는 32 layer 뒤 131,072 로 sequence 전체보다 넓지만, layer 8개를 지나야 그 32K 를 겨우 덮습니다."
        />
        <AlgorithmBlock
          title="Rolling-buffer KV cache 갱신 (Mistral SWA)"
          input={["새 token 위치 i 의 K_i, V_i", "고정 크기 W 인 순환 buffer K_buf, V_buf"]}
          steps={[
            { code: "idx ← i mod W", note: "위치 i 를 버퍼 크기로 나눈 나머지가 덮어쓸 slot 입니다." },
            { code: "K_buf[idx] ← K_i;  V_buf[idx] ← V_i", note: "i > W 이면 그 slot 에 있던 오래된 값이 그대로 사라집니다. Shift 연산이 없습니다." },
            { code: "valid ← min(i + 1, W)", note: "버퍼가 아직 다 차지 않은 초반에는 실제로 쓰인 slot 수만 셉니다." },
            { code: "for j in (i − valid + 1) … i:  S_j ← Q_i · K_buf[j mod W] / √d", note: "causal 이므로 자신보다 앞선 valid 개 slot 만 봅니다." },
            { code: "O_i ← softmax(S) · V_buf[해당 slot]", note: "다음 step 도 같은 크기 W 의 K_buf, V_buf 를 그대로 재사용합니다." },
          ]}
          output="O_i 와 다음 step에서도 크기가 그대로인 K_buf, V_buf. 메모리는 i 가 커져도 W 로 고정됩니다."
        />
        <div id="paper-mistral" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Jiang, Sablayrolles, Mensch, Bamford, Chaplot, de las Casas, Bressand, Lengyel, Lample, Saulnier, Lavaud, Lachaux, Stock, Le Scao, Lavril, Wang, Lacroix, El Sayed · Mistral 7B"
            citeKey={1}
            href="https://arxiv.org/abs/2310.06825"
          >
            2023 년 논문은 causal sliding-window attention(W=4096, 32 layer)과 timestep i 를
            i mod W 위치에 덮어쓰는 rolling buffer cache 를 제시하고, 32K sequence 에서 KV
            cache 메모리 8 배 절감과 16K 길이·수정된 FlashAttention/xFormers 기준 2 배 속도
            향상을 보고했습니다. 이론적 수신 범위 W×k=131K 도 논문이 직접 계산한 값입니다.
          </CitationBlock>
        </div>
      </section>

      <section id="sparse-global" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Global token 몇 개가 window 가 못 닿는 거리에 지름길을 놓습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            소수의 token g 개만 window 제한을 벗겨 주는 예외가 global attention 입니다. 이 g 개는 전체 n 개 위치와 서로 attend 합니다. 나머지 보통
            token 은 여전히 window w 안만 봅니다.
          </p>
          <p>
            Global token 은 자신이 본 것을 한 layer 만에 sequence 전체로 퍼뜨리고 전체로부터도
            한 layer 만에 정보를 받습니다. Window 를 layer 8 개 쌓아야 닿는 거리를 global
            token 은 layer 1 개로 잇는 셈입니다.
          </p>
          <p>
            Longformer 는 이 global token 을 task 에 맞춰 고릅니다. 분류에는 [CLS] 하나,
            질문 답변에는 질문의 모든 token 을 씁니다. HotpotQA 같은 multi-hop 질문에는 질문
            token 에 문단 제목과 문장 시작 token 까지 더합니다.
          </p>
          <p>
            언어모델링 실험은 애초에 window 폭을 layer 마다 다르게(아래층 32 부터 위층 8192 나 23040 까지) 키워 global token 없이도 깊은 layer 에서
            넓은 범위를 보게 합니다.
          </p>
          <p>
            BigBird 는 여기에 무작위로 고른 key r 개를 더해 window·global·random 세 mask 를
            한 attention 에 합칩니다. 이 조합이 중요한 이유는 성능이 아니라 표현력입니다.
          </p>
          <p>
            BigBird 는 global token 을 포함한 sparse attention 이(은닉 차원이 조건을 만족하면)
            full attention 과 같은 함수 근사력(universal approximator)과 Turing completeness
            를 갖는다는 정리를 증명했습니다.
          </p>
          <p>
            반대로 global token 이 하나도 없는 순수 window+random 조합은, 한 중심 node 가 모든
            다른 node 와 연결되고 나머지는 중심과 자기 자신만 보는 star graph 도달 문제조차
            O(1) layer 로 풀지 못한다는 것도 같은 논문의 결과입니다.
          </p>
        </div>
        <ExplainedFormula
          question="Global token g 개를 더하면 O(n) 성질을 유지하면서 비용은 얼마나 늘어나나요?"
          idea="보통 query 는 window w 개에 global token g 개까지 더해서 봅니다. g 가 n 과 무관한 상수(BigBird 는 O(1)개, 흔히 CLS 하나)로 남는 한 전체 비용은 여전히 n 에 대해 선형입니다."
          formula={String.raw`\mathrm{FLOP}_{\text{dense}} = 4n^2d,\qquad \mathrm{FLOP}_{\text{sparse}} = 4n(w+g)d`}
          annotatedFormula={String.raw`\mathrm{FLOP}_{\text{sparse}} = 4n\underbrace{(w+g)}_{\text{query 한 개가 보는 key 수}}d`}
          operations={[
            { expression: String.raw`4n^2d`, annotation: ["모든 query-key 쌍을 보는", "dense attention 의 FLOP"] },
            { expression: String.raw`4n(w+g)d`, annotation: ["Query n 개가 각자 window w 개와", "global token g 개, 총 (w+g) 개만 보는 FLOP"] },
          ]}
          terms={[
            { symbol: "g", name: "Global token 수", description: "전체 n 개와 예외적으로 attend 하는 token 수입니다." },
            { symbol: "w", name: "Window 폭", description: "앞 절과 같은 local window 크기입니다." },
            { symbol: "n", name: "Sequence 길이", description: "attention 이 다루는 전체 token 수입니다." },
          ]}
          assumptions={["BigBird 의 random key r 개는 같은 형태로 (w+g+r) 에 더해지지만 이 글은 w 와 g 만 셉니다.", "g 가 n 에 비례해 커지면(예: 모든 문장 시작 token) 선형성이 깨지므로 g 는 상수로 취급합니다."]}
          interpretation="w=4096, g=2(CLS 하나 정도) 이면 (w+g)/w ≈ 1.0005 로 global token 을 더한 비용은 사실상 공짜에 가깝습니다. n²d 항을 n(w+g)d 로 낮췄다는 사실이 비용의 핵심이고, g 의 정확한 값은 부차적입니다."
        />
        <div id="paper-longformer" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Beltagy, Peters, Cohan · Longformer: The Long-Document Transformer"
            citeKey={2}
            href="https://arxiv.org/abs/2004.05150"
          >
            2020 년 논문은 local sliding-window attention 에 task 별 global attention(분류는
            [CLS], QA 는 질문 token)을 더해 O(n) 을 유지하는 패턴을 제시하고, dilation 을 일부
            head 에만 줘 receptive field 를 ℓ×d×w 까지 늘리는 변형도 보고했습니다. 언어모델링
            실험은 window 폭을 layer 마다 32 에서 8192·23040 까지 늘리는 설정을 썼습니다.
          </CitationBlock>
        </div>
        <div id="paper-bigbird" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zaheer, Guruganesh, Dubey, Ainslie, Alberti, Ontanon, Pham, Ravula, Wang, Yang, Ahmed · Big Bird: Transformers for Longer Sequences"
            citeKey={3}
            href="https://arxiv.org/abs/2007.14062"
          >
            2020 년 논문은 window·global·random 세 mask 를 결합한 sparse attention 이 full
            attention 과 같은 universal approximation·Turing completeness 를 갖는다는 정리와,
            global token 없이는 star graph 도달 문제를 O(1) layer 로 풀 수 없다는 하한을
            증명했습니다. 실험 범위는 논문의 encoder 기반 QA·분류·요약 task 로 한정됩니다.
          </CitationBlock>
        </div>
      </section>

      <section id="hybrid" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Hybrid attention 은 layer 단위로 local 과 global 을 나눕니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Hybrid attention 은 한 attention 안에서 window·global mask 를 섞지 않습니다. layer 자체를 두 종류로 나눕니다. 일부 layer 는
            window 만 보는 local layer, 나머지는 그 layer 가 다루는 전체 문맥을 보는 global layer 입니다. KV cache 총량은 local layer
            비율이 높을수록 줄어들고 원거리 정보는 global layer 를 지날 때만 한 번에 전달됩니다.
          </p>
          <p>
            Gemma 2 는 이 비율을 1:1 로 둡니다. Layer 하나 걸러 하나가 window=4096 인 local,
            나머지는 span=8192 인 global layer입니다.
          </p>
          <p>
            Gemma 3 는 비율을 5:1(local layer 5 개당 global layer 1 개)로 늘리고 local
            window 도 1024 로 좁힙니다. 32K 문맥에서 KV cache 오버헤드를 all-global 기준
            60% 에서 15% 미만으로 낮췄다고 보고했습니다.
          </p>
          <p>
            128K 같은 긴 문맥에서 실제로 그 길이를 통째로 저장하는 layer 는 global layer
            뿐입니다.
          </p>
          <p>
            이 절감을 산수로 확인해 보면, layer 30 개 중 5 개가 global(n=32,768), 25 개가
            local(w=1024)인 5:1 구성의 KV 총량은 all-global 대비{" "}
            <code>(5n+25w)/(30n) ≈ 19.3%</code>, 즉 약 5.2 배 절감입니다.
          </p>
          <p>
            이는 이 글이 만든 산수 예일 뿐 Gemma 3 가 보고한 15% 미만이라는 수치와는 별개입니다. 두 계산이 비슷한 자리에 오는 이유는 같습니다. Local layer 가 많고
            window 가 좁을수록 global layer 몇 개의 KV 만 n 에 비례해 남기 때문입니다.
          </p>
        </div>
        <div id="paper-gemma2" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Gemma Team · Gemma 2: Improving Open Language Models at a Practical Size"
            citeKey={4}
            href="https://arxiv.org/abs/2408.00118"
          >
            2024 년 기술 보고서는 local sliding-window(4096)와 global(span 8192) attention을
            매 layer 번갈아 쓰는 1:1 구조를 채택했다고 밝혔습니다. KV cache 절감을 수치로
            분해해 보고하지는 않았습니다.
          </CitationBlock>
        </div>
        <div id="paper-gemma3" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Gemma Team · Gemma 3 Technical Report"
            citeKey={5}
            href="https://arxiv.org/abs/2503.19786"
          >
            2025 년 기술 보고서는 local:global 비율을 5:1 로 늘리고 local window 를 1024 로
            좁혀, 32K 문맥에서 all-global 대비 KV cache 오버헤드를 60% 에서 15% 미만으로
            낮췄다고 보고했습니다(논문 Figure 5). Global layer 만 128K 급 긴 문맥의 실제 길이를
            저장한다고 명시합니다.
          </CitationBlock>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          고정 패턴은 설계자가 정하고, Native Sparse Attention 은 model 이 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 세 패턴의 공통점은 어느 (query, key) 쌍을 볼지가 학습 전에 이미 정해진다는
            것입니다. Window 폭, global token 위치, layer 비율은 모두 architecture 설정값이고
            입력 내용과 무관합니다. Native Sparse Attention(NSA)은 이 결정을 학습 가능한
            연산으로 바꿔, 어떤 block 을 볼지를 매 query 마다 content 기반으로 고릅니다.
          </p>
          <p>
            NSA 가 함께 돌리는 branch 는 셋입니다. Block 32 개를 stride 16 으로 묶어 압축하는 branch, 압축 단계의 attention score 로 중요도를
            매겨 64 크기 block 16 개를 고르는 선택 branch, 최근 512 token 을 보는 sliding-window branch입니다.
          </p>
          <p>
            이 가운데 선택 branch 만 놓고 보면 BigBird 의 고정 random block 자리에 학습된 중요도 순위가 들어간 모습입니다. 나머지 두 branch 는 이 글의
            window·global 아이디어와 겹칩니다.
          </p>
          <p>
            논문은 64K 길이에서 forward 9.0 배, backward 6.0 배, decoding 최대 11.6 배 속도를 보고했습니다. 다만 이 수치는 저자가 고른
            kernel·hardware·model 크기에서 잰 값입니다. 고정 패턴과 달리 block 선택 자체가 추가 연산과 kernel 복잡도를 요구한다는 점은 이 글의
            window·hybrid 패턴에는 없는 비용입니다.
          </p>
        </div>
        <TermBreakdown
          title="Window·sparse·hybrid·NSA 가 다르게 고정하는 축"
          description="네 패턴 모두 O(n²) 을 피하지만, 무엇을 상수로 고정하고 무엇을 입력에 맞춰 바꾸는지가 다릅니다."
          items={[
            { term: "Sliding-window(local) attention", description: "모든 query 가 최근 w 개 key 만 보도록 고정합니다.", example: "Mistral 7B, W=4096", boundary: "한 layer 만으로는 w 밖 정보를 전혀 보지 못합니다." },
            { term: "Global attention", description: "소수 g 개 token 만 window 없이 전체를 봅니다.", example: "Longformer 의 [CLS]·질문 token", boundary: "g 가 n 에 비례해 커지면 선형성이 깨집니다." },
            { term: "Hybrid attention", description: "token 이 아니라 layer 를 local·global 로 나눕니다.", example: "Gemma 3, local:global=5:1", boundary: "원거리 정보는 global layer 를 지날 때만 전달됩니다." },
            { term: "Native Sparse Attention", description: "볼 block 을 query 마다 학습된 중요도로 고릅니다.", example: "block 64, 상위 16 개 선택", boundary: "선택 자체가 추가 연산이고 고정 패턴보다 kernel 이 복잡합니다." },
          ]}
        />
        <ProgressiveDetail
          title="고정 패턴을 그대로 써도 되는 경우와 학습된 sparsity 가 필요한 경우"
          preview="입력 분포가 안정적이고 원거리 정보의 위치를 미리 알거나 task 가 정해 줄 수 있으면 고정 패턴으로 충분하고, 어느 과거 token 이 중요한지가 입력마다 달라지면 NSA 같은 학습된 선택이 필요합니다."
        >
          <p>
            Longformer 의 global token 은 질문이 무엇인지 알기 때문에 사람이 정할 수 있는 경우입니다. 반대로 어떤 과거 문장이 나중에 중요해질지 미리 알 수 없는
            일반적인 긴 문서 생성이라면 고정된 window 나 global 위치는 우연히 중요한 token 을 놓칠 수 있습니다.
          </p>
          <p>
            NSA 의 선택 branch 는 이 경우를 위해 매 query 마다 다시 고릅니다. 대가로 압축·선택·window 세 branch 를 함께 학습하고 서빙해야 하는 복잡도가
            붙습니다.
          </p>
          <p>
            이 글이 다룬 mask 가 정해진 뒤, 그 mask 안에 남은 tile 을 GPU 가 실제로 어떻게
            빨리 계산하는지는{" "}
            <Link to="/ai/attention-kernel-anatomy-and-backends#anatomy">
              attention kernel 글
            </Link>
            의 몫입니다. Window·sparse mask 는 causal mask 처럼 대각선을 잘라내는 것이 아니라
            architecture 가 정한 별도의 tile 을 통째로 지우므로, 그 kernel 이 이 mask 모양까지
            받아들이는지가 다음 판단입니다.
          </p>
        </ProgressiveDetail>
        <div id="paper-nsa" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Yuan, Gao, Zhang, Xu, Chen, Xu, Zhu, Xie, Chen, Wang, Zheng, Liu, Ruan, Feng, Lu, Chen, Fu, Dai, Zhang, Zhang, Ruan, Liu, Zhang, Liang, Wang, Xiao · Native Sparse Attention"
            citeKey={6}
            href="https://arxiv.org/abs/2502.11089"
          >
            2025 년 논문은 압축(block 32, stride 16), 선택(block 64, 상위 16개), 최근
            512 token 을 보는 sliding-window 세 branch 를 hardware-aligned kernel 로 함께
            학습해, 고정 sparsity 패턴과 달리 어느 block 을 볼지를 query 마다 정합니다. 64K
            길이에서 forward 9.0 배·backward 6.0 배·decoding 최대 11.6 배는 저자 자기보고
            수치입니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
