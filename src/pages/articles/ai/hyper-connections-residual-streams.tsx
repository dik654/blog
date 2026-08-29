import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import HyperConnectionsResidualStreamsViz from "./hyper-connections-residual-streams/viz/HyperConnectionsResidualStreamsViz";

/**
 * Hyper-connection 은 residual stream 하나를 n 개로 늘려 신호를 나눠 옮깁니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function HyperConnectionsResidualStreamsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          단일 residual stream 은 층마다 신호가 지나는 유일한 통로입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            표준 residual connection 은 층의 update 를 하나의 stream 에 더하는 통로 하나뿐입니다.
            Hyper-connection(HC)은 이 통로를 n 개의 병렬 residual stream 으로 늘려, 각 층이 n개
            stream 중 필요한 부분만 읽고 결과를 다시 나눠 쓰게 합니다.
          </p>
          <p>
            <Link to="/ai/transformer-architecture#transformer-block">Pre-LN</Link> 은 층 안에서
            normalization 을 어디에 두느냐로 이 신호 전달을 다듬은 결과입니다. Xiong 등은 Post-LN
            에서 마지막 층 근처 gradient 크기가 O(d√ln d)로 깊이와 무관하게 크게 남는 반면, Pre-LN
            은 O(d√(ln d/L))로 깊을수록 오히려 작아진다는 것을 증명했습니다.
          </p>
          <p>
            그 차이는 실제로 학습이 되는지를 가릅니다. IWSLT14 번역 실험에서 warm-up 없이 학습한
            Post-LN Transformer 는 BLEU 8.45 에 그쳤지만, warm-up 을 쓴 모델은 34 근처까지
            올라갔습니다. Hyper-connection 은 이 단일 stream 을 여러 개로 늘려 같은 문제를 다른
            축에서 다룹니다.
          </p>
          <p>
            이 글은 stream 을 늘리는 hyper-connection 의 구조, 층마다 stream 을 읽고 섞고 쓰는
            식, 섞는 행렬에 제약을 거는 mHC 순서로 봅니다. 앞 글은 attention 내부에서 signal 과
            noise 를 가르는 differential attention 을 다뤘습니다.
          </p>
        </div>
        <div id="paper-hyper-connections" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zhu, Wang, Zhu, Wei 외 · Hyper-Connections"
            citeKey={1}
            href="https://arxiv.org/abs/2409.19606"
          >
            2024 년 ICLR 2025 논문은 residual stream 을 n 개로 늘리고 층마다 읽기(Am)·쓰기(B)·
            섞기(Ar) 행렬로 재구성하는 hyper-connection 을 제시합니다. OLMoE-1B-7B 에 확장률
            n=4 를 적용한 모델은 baseline 대비 1.8 배 빠르게 수렴했고, 이는 저자가 같은 데이터·
            예산으로 학습한 대조군 비교입니다.
          </CitationBlock>
        </div>
        <div id="paper-pre-ln" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Xiong, Yang, He, Zheng, Zheng, Xing, Zhang, Lan, Wang, Liu · On Layer Normalization in the Transformer Architecture"
            citeKey={2}
            href="https://arxiv.org/abs/2002.04745"
          >
            2020 년 ICML 논문은 mean-field 이론으로 Post-LN 의 gradient 가 초기화 시점부터 깊이와
            무관하게 크게 유지된다는 것을 증명하고, Pre-LN 이 이 문제를 없애 warm-up 단계를 제거할
            수 있음을 보였습니다. 수치는 IWSLT14·WMT14 번역 실험의 저자 자기보고입니다.
          </CitationBlock>
        </div>
        <ContentBoundary article="hyper-connections-residual-streams" />
      </section>

      <section id="streams" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Hyper-connection 은 hidden vector 를 n 개로 복제해 나란히 흘려보냅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Multiple residual streams 는 layer 입력 h 를 n 번 복제해 만든 hyper hidden matrix
            H ∈ R^(n×d)입니다. n 을 expansion rate 라 부르고, n=1 이면 표준 residual connection
            과 정확히 같아집니다. n 이 커질수록 stream 사이에 정보를 나눠 옮길 여지가 늘어납니다.
          </p>
          <p>
            늘어난 stream 은 공짜가 아닙니다. Hidden 4096, sequence 2048, batch 1, bf16 이면
            stream 하나의 활성값은 2048×4096×2B=16 MiB 입니다. n=4 면 층마다 이 hyper hidden
            matrix 가 64 MiB 로, 표준 residual 의 네 배를 메모리에 들고 있어야 합니다.
          </p>
          <p>
            반대로 mixing 행렬 자체의 연산량은 작습니다. Am, Ar, B 는 각각 n×1, n×n, 1×n 크기라
            n=4 에서도 원소 몇 십 개 수준이고, 저자들은 이 추가 연산이 층 전체의 FLOPs 에 비해
            무시할 만하다고 보고합니다. 비용은 메모리 쪽에 있고 연산 쪽에는 거의 없습니다.
          </p>
        </div>
        <TermBreakdown
          title="확장률 n 이 결정하는 것"
          description="n 은 하나의 숫자지만 메모리·표현력·안정성 세 가지를 동시에 바꿉니다."
          items={[
            {
              term: "n=1",
              description: "표준 residual connection 과 동일합니다.",
              example: "H 는 R^(1×d), Am=Ar=B=1",
              boundary: "Stream 사이에 나눠 옮길 정보 자체가 없습니다.",
            },
            {
              term: "n=4 (저자 기본값)",
              description: "저자들이 실험에서 가장 좋은 결과를 얻은 확장률입니다.",
              example: "OLMo-1B 500B token 학습에서 baseline 대비 validation loss 0.034 감소",
              boundary: "n=8 로 더 늘려도 개선 폭은 작아, 이 지점부터는 이득이 줄어듭니다.",
            },
          ]}
        />
      </section>

      <section id="mixing" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한 층은 n개 stream 을 읽어 하나로 합치고, 출력을 다시 나눠 씁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            층 T(attention 이나 FFN)는 여전히 벡터 하나를 입력받습니다. Read 단계가 Am 으로 n개
            stream 을 가중합해 그 입력을 만들고, T 를 통과한 출력을 write 단계가 B 로 다시 n개
            stream 에 나눠 씁니다. 그 사이 residual mixing 이 기존 stream 끼리를 Ar 로 섞습니다.
          </p>
          <p>
            Residual mixing 은 이 세 단계 중 유일하게 층 T 를 거치지 않는 부분입니다. Stream 이
            서로 정보를 교환하는 것은 오직 이 Ar 행렬을 통해서이고, 다음 절에서 보듯 이 행렬에
            제약이 없으면 층을 쌓을수록 문제가 생깁니다.
          </p>
        </div>
        <ExplainedFormula
          question="한 층에서 n개 stream 을 어떻게 읽고 섞고 다시 쓰나요?"
          idea="n개 stream을 가중합해 층 하나가 받을 입력을 만들고, 층 출력은 다시 n개 stream에 나눠 쓰며, 그와 별도로 기존 stream끼리도 섞습니다."
          formula={String.raw`h_0^\top=A_m^\top H,\qquad \hat H = B^\top\big(T(h_0)\big)^\top + A_r^\top H`}
          annotatedFormula={String.raw`\hat H = \underbrace{B^\top\big(T(\underbrace{A_m^\top H}_{\text{read: n개 stream을 가중합}})\big)^\top}_{\text{write: 층 출력을 n개 stream에 배분}} + \underbrace{A_r^\top H}_{\text{mix: 기존 stream끼리 섞기}}`}
          operations={[
            { expression: String.raw`A_m^\top H`, annotation: ["n×1 가중치로 n개 stream을 하나로 합쳐", "층 T 가 받을 입력 h0를 만듦(read)"] },
            { expression: String.raw`B^\top(T(h_0))^\top`, annotation: ["층 출력을 1×n 가중치로 나눠", "다시 n개 stream에 되씀(write)"] },
            { expression: String.raw`A_r^\top H`, annotation: ["층 T 를 거치지 않고 기존 stream끼리", "n×n 행렬로 직접 섞음(mix)"] },
          ]}
          terms={[
            { symbol: "H", name: "hyper hidden matrix", description: "R^(n×d)로, n개 residual stream을 쌓은 행렬입니다." },
            { symbol: String.raw`A_m`, name: "read 가중치", description: "R^(n×1)로 n개 stream을 층 입력 하나로 합칩니다." },
            { symbol: String.raw`A_r`, name: "residual mixing 행렬", description: "R^(n×n)으로 기존 stream끼리 직접 섞습니다." },
            { symbol: "B", name: "write 가중치", description: "R^(1×n)으로 층 출력을 n개 stream에 나눠 씁니다." },
            { symbol: "T", name: "sublayer", description: "attention이나 FFN처럼 원래 있던 layer 계산입니다." },
          ]}
          assumptions={["Static HC에서 Am, Ar, B는 학습되지만 입력에 의존하지 않는 고정 행렬입니다.", "Dynamic HC(DHC)는 이 값들을 현재 H의 함수로 다시 계산해 층마다 다르게 만듭니다."]}
          interpretation="n=1이면 세 행렬이 모두 스칼라 1이 되어 표준 residual connection과 같아집니다. n>1에서는 이 세 행렬이 늘어난 자유도를 어떻게 쓰는지가 성능을 가릅니다."
        />
        <AlgorithmBlock
          title="한 layer 의 stream 읽기 · 섞기 · 쓰기"
          input={["H ∈ R^(n×d) (이전 layer의 n개 stream)", "sublayer T", "학습된 Am ∈ R^(n×1), Ar ∈ R^(n×n), B ∈ R^(1×n)"]}
          steps={[
            { code: "h0 ← Amᵀ H", note: "n개 stream을 가중합해 T가 받을 입력 하나를 만듭니다(read)." },
            { code: "y ← T(h0)", note: "attention이나 FFN을 원래 방식 그대로 한 번 통과시킵니다." },
            { code: "Ĥ ← Bᵀ yᵀ + Arᵀ H", note: "층 출력을 n개 stream에 나눠 쓰고(write), 동시에 기존 stream끼리 섞습니다(mix)." },
          ]}
          repeatUntil="네트워크의 L개 layer 모두가 자신의 Am, Ar, B(static이면 고정, dynamic이면 H의 함수)로 이 절차를 반복할 때까지."
          output="Ĥ ∈ R^(n×d), 다음 layer의 입력"
        />
      </section>

      <section id="stability" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Mixing 행렬이 doubly-stochastic 이 아니면 층을 쌓을수록 신호가 폭발합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Ar 을 제약 없이 학습하면 L 개 층을 지나는 신호는 Ar 을 L 번 곱한 행렬을 통과합니다.
            이 곱이 항등에서 벗어나 있으면 신호는 특정 방향으로 커지거나 작아지기를 반복하고,
            층이 깊어질수록 그 편차가 누적됩니다. mHC 는 Ar 에 doubly-stochastic 제약을 걸어
            이 누적을 막습니다.
          </p>
          <p>
            Doubly-stochastic 행렬은 원소가 모두 0 이상이고 모든 행과 열의 합이 1인 행렬입니다.
            이런 행렬은 spectral norm 이 1 을 넘지 않고, 행렬곱에 대해 닫혀 있어 L 개를 곱해도
            같은 성질이 유지됩니다. mHC 는 Sinkhorn-Knopp 알고리즘으로 학습된 행렬을 지수화한
            뒤 행·열을 번갈아 정규화해 이 제약 위로 투영합니다.
          </p>
        </div>
        <ExplainedFormula
          question="학습된 mixing 행렬을 어떻게 doubly-stochastic 행렬로 만드나요?"
          idea="모든 원소를 지수화해 양수로 만든 뒤, 행 합과 열 합으로 번갈아 나누는 과정을 여러 번 반복해 행·열 합이 모두 1인 행렬로 수렴시킵니다."
          formula={String.raw`H_{res}=\mathrm{Sinkhorn}\big(\exp(\tilde H_{res})\big),\qquad H_{res}\mathbf 1_n=\mathbf 1_n,\ \ \mathbf 1_n^\top H_{res}=\mathbf 1_n^\top`}
          annotatedFormula={String.raw`H_{res}=\mathrm{Sinkhorn}\big(\underbrace{\exp(\tilde H_{res})}_{\text{모든 원소를 양수로}}\big),\qquad \underbrace{H_{res}\mathbf 1_n=\mathbf 1_n,\ \ \mathbf 1_n^\top H_{res}=\mathbf 1_n^\top}_{\text{행·열 합이 모두 1(doubly-stochastic)}}`}
          operations={[
            { expression: String.raw`\exp(\tilde H_{res})`, annotation: ["학습된 원 행렬의 모든 원소를 지수화해", "Sinkhorn 반복이 시작할 양수 행렬을 만듦"] },
            { expression: String.raw`\mathrm{Sinkhorn}(\cdot)`, annotation: ["행 합으로 나누고 열 합으로 나누는 과정을 20회 반복해", "행·열 합이 모두 1인 행렬로 수렴시킴"] },
            { expression: String.raw`H_{res}\mathbf 1_n=\mathbf 1_n`, annotation: ["행 합이 1이 되어", "spectral norm이 1을 넘지 않게 제한"] },
          ]}
          terms={[
            { symbol: String.raw`\tilde H_{res}`, name: "투영 전 행렬", description: "학습된 R^(n×n) 원 행렬로, 아직 doubly-stochastic 이 아닙니다." },
            { symbol: String.raw`H_{res}`, name: "투영된 mixing 행렬", description: "Sinkhorn-Knopp 을 거쳐 얻은 doubly-stochastic 행렬입니다." },
            { symbol: String.raw`\mathbf 1_n`, name: "n차원 전부 1 벡터", description: "행·열 합 제약을 표현하는 데 씁니다." },
          ]}
          assumptions={["Sinkhorn 반복은 t_max=20에서 실용적으로 수렴한다고 저자들이 보고합니다.", "n=1이면 이 제약이 스칼라 1로 퇴화해 원래 identity mapping과 같아집니다."]}
          interpretation="행·열 합이 모두 1인 행렬은 여러 번 곱해도 그 성질이 유지되므로, L 층을 지나도 신호가 항등에서 크게 벗어나지 않습니다."
        />
        <HyperConnectionsResidualStreamsViz />
        <div id="paper-mhc" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Xie, Wei, Cao 외(DeepSeek-AI) · mHC: Manifold-Constrained Hyper-Connections"
            citeKey={3}
            href="https://arxiv.org/abs/2512.24880"
          >
            2026 년 논문은 제약 없는 hyper-connection 이 27B 모델 학습에서 12k step 근처 loss
            급등을 보이고, 층을 지나는 합성 mixing 행렬의 이득(Amax Gain Magnitude)이 최대 3000
            배까지 벌어진다는 것을 관측했습니다. Sinkhorn-Knopp 로 doubly-stochastic 제약을 걸어
            이 문제를 없애면서, n=4 구현에서 추가 학습 비용은 6.7% 로 보고합니다.
          </CitationBlock>
        </div>
        <ProgressiveDetail
          title="mHC 는 벤치마크에서 얼마나 개선됐나요?"
          preview="27B 모델의 zero-shot 평균 점수가 baseline 43.8에서 HC 48.9, mHC 51.0으로 올랐습니다. mHC 가 HC 보다도 더 나은 것은 안정성 덕에 더 큰 학습률·더 오래 학습이 가능해졌기 때문입니다."
        >
          <p>
            저자들은 3B, 9B, 27B 로 모델 크기를 늘려 가며 mHC 의 이득이 규모가 커져도 유지되는지
            확인했습니다. 이 비교는 DeepSeek-V3 계열 설정을 전제로 하며, 다른 아키텍처·다른
            tokenizer 조합에서 같은 폭의 개선이 나온다는 근거는 아닙니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Doubly-stochastic 제약은 안정성의 충분조건이지 최적화의 보증서는 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Deep network signal propagation 은 forward 의 activation 크기와 backward 의
            gradient 크기가 층을 지나며 어떻게 변하는지를 함께 가리키는 말입니다. He 등은
            <Link to="/ai/resnet#skip-connection">shortcut 을 순수 identity 로 유지</Link>할 때만
            1001-layer 규모에서도 신호가 깨끗이 전달된다는 것을 보였고, hyper-connection 의
            activation explosion 문제는 이 원칙이 여러 stream 으로 확장되며 다시 나타난 것입니다.
          </p>
        </div>
        <div id="paper-resnet-identity" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="He, Zhang, Ren, Sun · Identity Mappings in Deep Residual Networks"
            citeKey={4}
            href="https://arxiv.org/abs/1603.05027"
          >
            2016 년 논문은 shortcut 과 post-add mapping 이 항등이어야 임의로 깊은 network 에서도
            신호가 그대로 전파된다는 것을 대수적으로 보이고, shortcut 에 상수 scaling 이나 gating
            을 섞으면 층이 깊어질수록(예: 1001-layer) 학습이 나빠진다는 것을 확인했습니다.
          </CitationBlock>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            mHC 의 제약은 norm 이 커지거나 작아지지 않는다는 것만 보장합니다. 여러 층에 걸친
            doubly-stochastic 행렬의 곱은 정보를 점점 고르게 섞는 방향으로도 움직일 수 있어,
            stream 사이 표현이 지나치게 비슷해지지 않는지는 별도로 확인해야 합니다.
          </p>
          <p>
            비용도 분명합니다. n 배의 활성값 메모리는 그대로 남고, Sinkhorn 반복 20 회가 층마다
            추가되어 저자 보고 기준 6.7% 의 학습 비용이 더 듭니다. Static HC 가 아니라 dynamic
            HC(DHC)를 쓰면 이 위에 입력 의존 행렬을 계산하는 비용이 더 붙습니다.
          </p>
          <p>
            <Link to="/ai/motif-3-architecture#mhc">Motif 3 의 modified mHC</Link>는 이 mechanism
            위에 post multiplier 를 학습 중 2 에서 1 로 낮추는 annealing 을 더한 것으로, 원 mHC
            가 제안한 것은 doubly-stochastic 제약까지입니다. Attention 내부의 signal·noise 분리를
            다룬 <Link to="/ai/differential-attention">differential attention</Link>과 이 residual
            stream 확장은 서로 다른 층위의 문제이며, GDLA·modified mHC 는 그 둘을 각각 가져와
            한 model 안에서 조합한 결과입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
