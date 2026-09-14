import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ParamClassesViz from "./viz/ParamClassesViz";

const CLASSES = [
  {
    name: "Backbone",
    size: "125.5B",
    where: "GPU 상주",
    role: "48개 층의 expert·mixer·배선. 이 중 토큰당 5.8B만 계산에 참여합니다.",
  },
  {
    name: "n-gram 임베딩 표",
    size: "51.2B",
    where: "호스트 메모리 가능",
    role: "2번 층의 조회 전용. 토큰당 16행만 읽으므로 계산량에 거의 기여하지 않습니다.",
  },
  {
    name: "Multi-token prediction",
    size: "공식 표기 4B",
    where: "draft 경로",
    role: "한 층짜리 예측 모듈. 본 모델의 forward에는 들어가지 않습니다.",
  },
];

export default function ParamClasses() {
  return (
    <section id="param-classes" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">125B와 51B와 6B는 서로 다른 회계입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          공식 카드가 적은 세 숫자는 같은 대상을 다르게 센 값이 아니라 아예 다른 세 묶음입니다. 125B는 층에
          쌓인 backbone 전체이고, 6B는 토큰 하나가 실제로 통과하는 부분이며, 51B는 계산이 아니라 조회에만
          쓰이는 표입니다. 배치를 정할 때 이 셋을 한 숫자로 합치면 필요한 VRAM을 두 배 넘게 잘못 잡습니다.
        </p>

        <p className="leading-7">
          backbone의 거의 전부는 expert입니다. expert 하나는 2,560차원을 640차원으로 올렸다 내리는 작은
          feed-forward라 파라미터가 491만 개뿐이지만, 층마다 512개가 있어 25.2억 개가 됩니다. 48개 층을
          곱하면 1,208억 개로 backbone 125.5B의 96%를 차지합니다.
        </p>

        <p className="leading-7">
          토큰 하나는 그중 11개만 지나갑니다. 라우터가 고른 10개와 항상 켜지는 공유 expert 1개를 합쳐 층당
          5,407만 개입니다. 전체 대비 47분의 1이고, 바로 이 비율이 125B 모델을 6B급 계산량으로 돌리는 근거
          입니다.
        </p>
      </div>

      <ExplainedFormula
        question="토큰 하나가 통과하는 파라미터는 몇 개인가요"
        idea="층마다 MoE에서 고정된 개수의 expert만 켜지므로, 전체 expert 수와 무관하게 활성량은 top-k에 비례합니다."
        formula={String.raw`N_{\text{act}} = L\left(k+1\right)\cdot 3\, d\, d_{f} + N_{\text{dense}}`}
        annotatedFormula={String.raw`\underbrace{N_{\text{act}}}_{\text{토큰당 활성}} = \underbrace{L\left(k+1\right)}_{\text{켜지는 expert 수}}\cdot \underbrace{3\, d\, d_{f}}_{\text{expert 하나}} + \underbrace{N_{\text{dense}}}_{\text{항상 도는 부분}}`}
        operations={[
          {
            expression: String.raw`3\, d\, d_{f}`,
            annotation: [
              "gate·up·down 세 행렬이 각각 d×d_f 크기입니다",
              "3 × 2,560 × 640 = 4,915,200 개입니다",
            ],
          },
          {
            expression: String.raw`k+1`,
            annotation: "라우팅된 10개에 공유 expert 1개를 더해 11개입니다. 층마다 5,407만 개가 켜집니다",
          },
          {
            expression: String.raw`L\left(k+1\right)\cdot 3\, d\, d_{f}`,
            annotation: "48개 층을 곱하면 25.9억 개입니다. 전체 expert 1,208억 개의 약 2%입니다",
          },
          {
            expression: String.raw`N_{\text{dense}}`,
            annotation: "선형 층 20.9억, 희소 attention 4.3억, gated residual 6.3억, 라우터 0.6억을 더해 약 32억 개입니다",
          },
        ]}
        terms={[
          { symbol: String.raw`N_{\text{act}}`, name: "토큰당 활성 파라미터", description: "임베딩과 출력 행렬을 제외하고 약 58억 개입니다. 공식 표기 6B와 같은 자리입니다." },
          { symbol: String.raw`L`, name: "층 수", description: "48입니다. MoE 블록은 선형 층과 희소 attention 층 모두에 붙습니다." },
          { symbol: String.raw`k`, name: "라우팅 expert 수", description: "num_experts_per_tok으로 10입니다. 전체 expert 수 512와 무관하게 계산량을 결정합니다." },
          { symbol: String.raw`d`, name: "hidden 차원", description: "2,560입니다. gated residual이 들고 다니는 10,240과 구분해야 합니다." },
          { symbol: String.raw`d_{f}`, name: "expert 내부 차원", description: "moe_intermediate_size로 640입니다. 공유 expert도 같은 값을 씁니다." },
        ]}
        assumptions={[
          "reference 구현의 텐서 모양과 공개 config 값으로 센 논리적 개수이며, 양자화와 텐서 병렬 배치 이후의 실제 메모리와는 다릅니다.",
          "임베딩 행렬과 출력 행렬 12.7억 개는 제외했습니다. 두 값을 포함하면 71억 개가 됩니다.",
        ]}
        interpretation="활성 58억은 계산량의 지표이지 필요한 VRAM이 아닙니다. 라우터가 어떤 expert를 고를지 미리 알 수 없으므로 512개 expert는 모두 적재돼 있어야 합니다."
      />

      <ParamClassesViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          세 묶음을 더하면 체크포인트 크기와 맞습니다. 공개된 가중치 색인이 적은 전체 바이트는 359,999,963,128
          이고 BF16이므로 파라미터는 1,800억 개입니다. backbone 1,255억과 n-gram 표 512억을 더하면 1,767억이고,
          남은 자리를 예측 모듈이 채웁니다.
        </p>

        <p className="leading-7">
          이 산수가 실무에서 갖는 뜻은 하나입니다. 세 묶음은 놓이는 자리가 다릅니다.
        </p>
      </div>

      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border border-border text-sm">
          <thead>
            <tr className="bg-muted/50">
              {["묶음", "크기", "놓이는 자리", "역할"].map((heading) => (
                <th key={heading} className="border border-border px-3 py-2 text-left font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLASSES.map((row) => (
              <tr key={row.name}>
                <td className="border border-border px-3 py-2 font-medium">{row.name}</td>
                <td className="border border-border px-3 py-2">{row.size}</td>
                <td className="border border-border px-3 py-2">{row.where}</td>
                <td className="border border-border px-3 py-2 text-muted-foreground">{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-sm leading-6 text-muted-foreground">
          크기는 공개 config와 reference 구현의 텐서 모양으로 센 논리적 파라미터 수입니다. 실제 배치는
          양자화 형식과 병렬화 방식에 따라 달라집니다.
        </p>

        <p className="leading-7">
          expert를 어떻게 나눠 얹을지, 라우팅 쏠림을 어떻게 다룰지는 이 모델만의 문제가 아닙니다. 일반 원리는{" "}
          <Link to="/cs/ai/expert-parallelism-moe-systems">expert 병렬 시스템</Link>과{" "}
          <Link to="/cs/ai/moe-routing-and-load-balancing">MoE 라우팅과 부하 분산</Link>에서 다루고, 여기서는
          Flash-Next의 숫자가 그 논의의 어느 자리에 들어가는지만 고정했습니다.
        </p>
      </div>

      <CitationBlock
        source="Qwen — Qwen3.8-Flash-Next 공식 config.json과 model.safetensors.index.json"
        citeKey={3}
        type="code"
        href="https://huggingface.co/Qwen/Qwen3.8-Flash-Next/blob/main/config.json"
      >
        층 수 48, expert 512개와 토큰당 10개, moe_intermediate_size 640, hidden_size 2,560은 모두 공개 config의
        값입니다. 전체 바이트 359,999,963,128은 가중치 색인의 total_size이며, 특정 런타임에서의 VRAM 사용량이나
        양자화 후 크기를 뜻하지 않습니다.
      </CitationBlock>
    </section>
  );
}
