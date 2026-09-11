import TermBreakdown from "@/components/articles/term-breakdown";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation";
import { codeRefs } from "./codeRefs";
import GatedResidualViz from "./viz/GatedResidualViz";

export default function GatedResidual({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="gated-residual" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">층 사이를 잇는 통로가 네 갈래로 늘어납니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Flash-Next는 층과 층 사이에 residual stream을 하나가 아니라 네 개 유지합니다. 토큰 하나가 층 사이로
          들고 가는 벡터는 2,560차원이 아니라 그 네 배인 10,240차원이고, 블록에 들어갈 때마다 학습된 게이트로
          한 갈래를 만들어 넣었다가 출력은 갈래마다 다른 세기로 되돌립니다.
        </p>

        <p className="leading-7">
          기존 residual connection은 블록 출력을 통로 하나에 그대로 더합니다. 층이 깊어질수록 그 통로에는
          모든 블록의 출력이 같은 비중으로 쌓이고, 어떤 층은 자기 출력이 묻히고 어떤 층은 뒤쪽 표현을
          지배합니다. 갈래를 늘리면 층마다 어느 통로에서 읽고 어느 통로에 쓸지 자체를 학습할 수 있습니다.
        </p>

        <p className="leading-7">
          읽는 쪽은 저랭크로 만듭니다. 10,240차원을 320차원으로 줄였다가 다시 펼쳐 갈래별 게이트를 만들고,
          정규화된 네 갈래에 이 게이트를 곱해 평균낸 값이 블록 입력이 됩니다. 게이트 자체를 10,240×10,240
          행렬로 두면 층마다 1억 개가 넘는 파라미터가 필요하지만, 320을 거치면 655만 개로 끝납니다.
        </p>

        <p className="leading-7">
          쓰는 쪽은 갈래마다 스칼라 하나입니다. 블록 출력에 곱해지는 이 계수는 시그모이드의 두 배라 0과 2
          사이 값을 가집니다. 1보다 크면 그 갈래에 증폭해서 쓰고 0에 가까우면 이번 층의 결과를 그 갈래에는
          거의 남기지 않습니다.
        </p>
      </div>

      <GatedResidualViz />

      <TermBreakdown
        title="gated residual을 이루는 세 텐서"
        description="공개 config의 hc_count와 hc_lowrank가 각각 어디에 쓰이는지 구분합니다."
        items={[
          {
            term: "hc_norm",
            description: "네 갈래를 각각 정규화합니다. group_size가 hidden_size와 같아 갈래끼리 크기를 공유하지 않습니다.",
            example: "10,240차원을 2,560씩 네 묶음으로 나눠 RMSNorm을 겁니다.",
            boundary: "정규화는 갈래 사이 정보를 섞지 않습니다. 섞는 일은 다음 저랭크 게이트가 합니다.",
          },
          {
            term: "input_mix_weight_down · up",
            description: "블록 입력을 만들 때 쓰는 저랭크 게이트입니다. 10,240에서 320으로 줄였다가 다시 펼칩니다.",
            example: "silu로 한 번, sigmoid로 한 번 눌러 0과 1 사이 가중치를 갈래마다 만듭니다.",
            boundary: "게이트는 토큰마다 다시 계산됩니다. 층에 고정된 상수 배합이 아닙니다.",
          },
          {
            term: "block_inject_weight",
            description: "블록 출력을 갈래마다 얼마나 되돌릴지 정하는 계수입니다. 갈래당 스칼라 하나입니다.",
            example: "2 × sigmoid이므로 값의 범위는 0부터 2까지입니다.",
            boundary: "마지막 mixer에는 이 계수가 없습니다. 네 갈래를 한 갈래로 합치기만 합니다.",
          },
        ]}
      />

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("gated-residual", codeRefs["gated-residual"])} />
        <span className="text-xs text-muted-foreground">Qwen4ExpTextGatedResidual.forward</span>
        <CodeViewButton onClick={() => onCodeRef("decoder-layer", codeRefs["decoder-layer"])} />
        <span className="text-xs text-muted-foreground">한 층에서 두 번 반복되는 mix와 주입</span>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          이 배선은 층마다 두 벌 필요합니다. attention 앞에서 한 번, MoE 앞에서 한 번 같은 절차를 반복하기
          때문입니다. 두 벌을 합치면 층당 1,319만 개, 48개 층이면 6억 3천만 개가 됩니다. 토큰당 활성
          파라미터 6B 가운데 10분의 1이 통로를 배선하는 데 쓰이는 셈입니다.
        </p>

        <p className="leading-7">
          비용은 파라미터만이 아닙니다. 층 사이를 흐르는 텐서가 네 배로 커지므로 activation을 읽고 쓰는 양도
          같이 늘어납니다. 서빙 구현이 이 mix와 combine 연산을 따로 융합해 최적화하는 이유가 여기에 있습니다.
        </p>
      </div>

      <h3 id="paper-hyper-connections" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        Hyper-Connections가 보인 것과 보이지 않은 것
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          residual을 여러 갈래로 확장하고 그 사이 배합을 학습한다는 제안은 Hyper-Connections 논문이
          내놓았습니다. 논문은 residual 변형들이 기울기 소실과 표현 붕괴 사이에서 한쪽을 택하는 문제를
          지적하고, 갈래 사이 가로 연결과 깊이 방향 연결을 분리하면 그 절충을 피할 수 있다고 주장합니다.
        </p>

        <p className="leading-7">
          Flash-Next는 여기에 갈래별 정규화와 저랭크 게이트를 얹었습니다. Transformers 문서가 이 조합을 두고
          Hyper-Connection과 GatedNorm을 합쳤다고 설명하는 부분이 그것입니다. 논문의 실험은 해당 규모의
          언어·비전 모델에서 수렴이 빨라졌다는 저자 자기보고이며, 125B MoE에서 같은 이득이 난다는 확인은
          아닙니다.
        </p>
      </div>

      <CitationBlock
        source="Zhu et al. — Hyper-Connections (ICLR 2025, arXiv 2409.19606)"
        citeKey={2}
        type="paper"
        href="https://arxiv.org/abs/2409.19606"
      >
        residual stream을 여러 갈래로 확장하고 갈래 간 배합을 학습 가능한 값으로 두는 방법을 제시합니다.
        기울기 소실과 표현 붕괴의 절충을 완화했다는 결론은 논문이 실험한 모델 규모와 학습 설정 안에서만
        성립하며, Qwen이 고른 갈래 수 4와 랭크 320이 최적이라는 근거는 논문에 없습니다.
      </CitationBlock>
    </section>
  );
}
