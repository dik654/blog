import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ServingArchitectureMatrixViz from "./serving-architecture-matrix/viz/ServingArchitectureMatrixViz";
import ExpertUnionViz from "./serving-architecture-matrix/viz/ExpertUnionViz";
import KvPlacementViz from "./serving-architecture-matrix/viz/KvPlacementViz";
import NetworkDemandViz from "./serving-architecture-matrix/viz/NetworkDemandViz";
import NodeFitViz from "./serving-architecture-matrix/viz/NodeFitViz";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

/**
 * 모델 구조가 서빙 장비와 병렬화를 정합니다.
 * 본문 수치는 ./serving-architecture-matrix/data.ts와 같은 계산에서 나온다.
 * 공개 config.json은 2026-11-03에 Hugging Face에서 직접 열어 확인했다.
 */
export default function ServingArchitectureMatrixArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 같은 GPU 8장에 긴 대화가 1개 들어가는 모델과 140개 들어가는 모델이 있습니다</h2>
        <div className={prose}>
          <p className="text-lg leading-8">
            96GB급 GPU 8장을 꽂은 서버 한 대를 생각해 봅시다. 여기에 모델을 올리고 128K token짜리 문맥을 붙잡고 일하는 코딩 에이전트를 동시에 몇 개 둘 수 있는지 세어
            보면 모델마다 결과가 크게 갈립니다. 이 글의 계산으로 Kimi K2.5는 약 1개, Llama 3.1 405B는 3개, Qwen3-235B-A22B는 9개,
            Qwen3.6-35B-A3B는 140개가 넘습니다.
          </p>
          <p>크기 차이만으로는 이 순서가 설명되지 않습니다. K2.5는 token 하나가 GPU에 남기는 기록이 Llama 405B의 7분의 1 정도인데도 받을 수 있는 에이전트 수는 더 적습니다. 남은 메모리의 크기와 함께, 그 기록을 8장에 어떻게 나눠 놓을 수 있는지가 다르기 때문입니다.</p>
          <p>
            이 글의 답을 먼저 적으면, 모델 구조가 다섯 숫자를 정하고 그 다섯 숫자가 장비와 나누는 방식을 정합니다. 다섯 숫자는 가중치 크기, token 하나를 만들 때 읽는
            byte, 에이전트 하나가 붙잡는 기록, 기록과 가중치를 여러 장에 나누는 방식, 그 방식이 요구하는 네트워크입니다.
          </p>
          <p>
            이 답으로 내릴 판단도 하나 정해 둡니다. RTX PRO 6000 8장을 NVLink 없이 PCIe로만 이은 노드에 어떤 모델이 들어가는지, 어떻게 나눠야 하는지, 무엇이
            병목인지, 그리고 빠른 노드 간 네트워크를 사면 무엇이 좋아지고 무엇은 그대로인지입니다. 마지막 질문에 미리 답하면 네트워크는 자리를 늘려 주지만 한 사용자의 속도는 올려 주지
            않습니다.
          </p>
          <p>이 글은 세 선행 글 위에 서 있습니다. <Link to="/cs/ai/model-vram-budgeting#moe-serving-boundary">MoE VRAM 예산</Link>에서 전체 parameter와 활성 parameter를 나눠 세는 법을, <Link to="/cs/ai/kv-cache-fundamentals#kv-shape-sharing">KV cache 기초</Link>에서 token마다 쌓이는 기록의 모양을, <Link to="/cs/ai/tensor-and-pipeline-parallel-inference#tensor-parallel">TP와 PP</Link>에서 모델을 여러 장에 나누는 두 축을 가져옵니다. 여기서는 그 셋을 모델 여섯 개에 같은 질문으로 적용합니다.</p>
        </div>
        <ContentBoundary article="serving-architecture-matrix" />
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. config 한 장과 GPU 사양을 넣으면 다섯 숫자가 나옵니다</h2>
        <div className={prose}>
          <p>바깥에서 보면 이 계산은 입력 두 개와 출력 다섯 개로 된 상자입니다. 첫 입력은 Hugging Face 저장소의 config.json과 체크포인트 파일 크기입니다. 층 수, hidden 폭, 기록을 남기는 head 수와 폭, expert 수와 token마다 고르는 expert 수가 모두 이 파일에 있습니다.</p>
          <p>
            나머지 입력은 장비입니다. RTX PRO 6000 Server Edition은 장마다 GDDR7 메모리가 96GB급(nvidia-smi 기준 97,887 MiB)이고 메모리
            대역폭이 초당 1,597GB이며 GPU끼리는 PCIe로만 이어집니다. 이 글은 장마다 86.4GB를 가중치와 기록에 쓸 수 있다고 가정합니다. 3절에서 이 가정이 실제 측정과
            얼마나 맞는지 확인합니다.
          </p>
          <p>
            출력은 가중치가 노드에 들어가는가, token 하나를 만들 때 몇 byte를 읽는가, 에이전트 하나가 몇 GB를 붙잡는가, 몇 장에 어떻게 나눌 것인가, 그 나눔이 노드 안팎에
            무엇을 요구하는가, 이 다섯 질문의 답입니다. 아래 그림은 여섯 모델에 이 질문을 한 번씩 던진 결과입니다.
          </p>
        </div>
        <ServingArchitectureMatrixViz />
        <div className={prose}>
          <p>
            장면을 넘기면 행의 순서가 질문마다 뒤바뀝니다. 가중치에서는 K3와 K2.5가 가장 무겁지만 에이전트당 기록에서는 Llama가 압도적으로 무겁고, 나누는 방식에서는 K2.5가
            가장 나쁩니다. 한 열만 보고 장비를 고르면 다른 열에서 막힌다는 것이 이 표의 첫 번째 쓸모입니다.
          </p>
          <p>
            이 상자 밖에 둔 것도 있습니다. 엔진이 그 구조를 실제로 지원하는지, 측정된 속도가 얼마인지, 사용자 경험 기준을 지키며 몇 명을 받는지는 config로 계산되지 않습니다.
            앞의 둘은 7절에서 경계로 다루고 마지막은 에이전트 서빙 용량을 다루는 별도 글의 질문입니다. 다음 절은 K2.5 한 행을 손으로 끝까지 채웁니다.
          </p>
        </div>
      </section>

      <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. Kimi K2.5 한 행을 config에서 끝까지 계산합니다</h2>
        <div className={prose}>
          <p>K2.5의 config.json에는 층 61개, hidden 폭 7,168, attention head 64개가 있습니다. 기록 쪽 값은 kv_lora_rank 512와 qk_rope_head_dim 64이고, expert 쪽은 routed expert 384개 가운데 token마다 8개를 고르고 공유 expert 1개를 늘 씁니다. 첫 층만 dense라 MoE 층은 60개입니다. 공식 INT4 체크포인트 파일은 합계 595.2GB입니다.</p>
          <p>
            가중치는 간단합니다. 595.2GB는 노드가 쓸 수 있다고 잡은 691.2GB에 들어가고 96GB가 남습니다. 장으로 나누면 장마다 약 12GB가 기록을 둘 자리입니다. 다만
            들어간다고 넉넉한 것은 아니라는 점이 이 행의 나머지 숫자에서 드러납니다.
          </p>
          <p>두 번째 질문은 token 하나를 만들 때 읽는 byte입니다. 요청이 하나뿐이면 층마다 고른 expert 8개와 공유 expert, attention 가중치만 읽으면 됩니다. 활성 parameter 32B에 INT4 expert와 BF16 attention을 섞으면 token당 약 30GB이고, 8장이 나눠 읽으면 장당 3.75GB, 1,597GB/s로 나누면 약 2.3ms입니다(추정). 대역폭만 보면 초당 400 token 이상이 상한입니다.</p>
          <p>요청이 여러 개면 사정이 달라집니다. 서로 다른 요청이 서로 다른 expert를 고르므로 한 step이 읽어야 하는 expert의 합집합이 커집니다. 아래 그림이 그 합집합의 크기를 384칸 위에 칠합니다.</p>
        </div>
        <ExpertUnionViz />
        <div className={prose}>
          <p>
            동시 요청이 16개면 서로 다른 expert 약 110개(29%), 64개면 284개(74%), 128개면 358개(93%)를 읽습니다. step 하나가 읽는 양은 결국 전체
            가중치에 가까워지고 대신 그 양을 128개 token이 나눠 갖습니다. 1T 모델이 32B처럼 가볍게 읽힌다는 말은 요청 하나일 때의 지연에만 맞습니다.
          </p>
          <p>
            다음은 기록입니다. token 하나가 층마다 남기는 것은 숫자 576개(512 + 64)짜리 한 덩어리입니다. 61층이면 61 × 576 × 2 byte = 70,272
            byte, 약 68.6KiB입니다. 128K token 문맥이면 9.2GB, 200K면 14.1GB입니다.
          </p>
          <p>네 번째 질문에서 이 행이 막힙니다. 8장으로 나누면 576개짜리 덩어리는 쪼갤 head가 없어 8장 모두에 같은 사본이 놓입니다. 장마다 12GB 자리에 9.2GB짜리 에이전트를 두면 하나가 겨우 들어갑니다. token 축으로 문맥을 8조각 내고 기록을 FP8로 줄이면 장당 몫이 16분의 1이 되어 128K 에이전트 약 21개가 들어갑니다.</p>
          <p>
            이 계산이 실제와 얼마나 맞는지는 rtx6kpro 커뮤니티 위키의 같은 노드 기록으로 확인할 수 있습니다(현장 경험). BF16 기록에 나누지 않은 설정은 약 19만
            token, FP8 기록에 8조각 설정은 GPU 메모리 사용률 0.93에서 3,621,504 token을 보고했습니다. 이 글의 가정으로 계산하면 17만과 273만(0.93이면
            339만)입니다. 계산값은 실제보다 10~25% 보수적인 쪽에 있습니다.
          </p>
          <p>
            마지막 질문은 네트워크입니다. 8장이 층마다 attention 뒤와 FFN 뒤에 결과를 합치면 token 하나에 122번 모입니다. 노드를 둘로 나눠 앞뒤 층을 맡기면 경계에서
            hidden 7,168개를 BF16으로 한 번, 14,336 byte만 넘깁니다. expert를 장마다 나눠 두면 MoE 층마다 token을 expert가 있는 장으로 보냈다
            받아야 합니다.
          </p>
        </div>
        <ExplainedFormula
          question="동시 요청 B개가 한 MoE 층에서 읽는 서로 다른 expert는 몇 개입니까?"
          idea="한 expert가 B개 요청 모두에게 선택되지 않을 확률을 구해 1에서 빼면, 그 expert가 이번 step에 적어도 한 번 읽힐 확률이 됩니다. 여기에 expert 수를 곱하면 기대값입니다."
          formula={String.raw`N_{\mathrm{read}}(B)=E\left(1-\left(1-\frac{k}{E}\right)^{B}\right)`}
          annotatedFormula={String.raw`N_{\mathrm{read}}(B)=\underbrace{E}_{\text{routed expert 수}}\Bigl(1-\underbrace{\Bigl(1-\frac{k}{E}\Bigr)^{B}}_{\text{B개 요청 누구도 고르지 않을 확률}}\Bigr)`}
          operations={[
            { expression: String.raw`k/E`, annotation: ["8 ÷ 384 = 0.0208입니다.", "요청 하나가 특정 expert를 고를 확률입니다."] },
            { expression: String.raw`\left(1-k/E\right)^{B}`, annotation: ["B = 64면 0.9792^64 ≈ 0.26입니다.", "64개 요청이 모두 그 expert를 피할 확률입니다."] },
            { expression: String.raw`E\left(1-\cdot\right)`, annotation: ["384 × (1 − 0.26) ≈ 284입니다.", "B = 16이면 110, B = 128이면 358입니다."] },
          ]}
          terms={[
            { symbol: "E", name: "routed expert 수", description: "한 MoE 층에서 router가 고를 수 있는 expert 개수입니다. K2.5는 384입니다." },
            { symbol: "k", name: "token당 선택 수", description: "token 하나가 고르는 routed expert 개수입니다. K2.5는 8입니다. 공유 expert는 늘 읽으므로 따로 셉니다." },
            { symbol: "B", name: "동시 decode 요청 수", description: "한 step에서 함께 token을 만드는 요청 수입니다." },
            { symbol: String.raw`N_{\mathrm{read}}`, name: "읽는 expert 수", description: "이번 step에 가중치를 메모리에서 읽어야 하는 서로 다른 expert의 기대 개수입니다." },
          ]}
          assumptions={["요청마다 expert를 고르게, 서로 독립적으로 고른다고 봅니다.", "실제 router는 인기 expert로 몰리므로 합집합이 이 값보다 조금 작습니다."]}
          interpretation="B가 커질수록 step 하나가 읽는 expert는 전체에 다가가고, token 하나가 나눠 갖는 몫은 N/B로 줄어듭니다. 요청 하나일 때 MoE가 얻는 대역폭 이득은 동시성이 높아지면 사라지고, 그때부터 처리량은 전체 가중치를 얼마나 빨리 읽고 expert 행렬곱을 얼마나 꽉 채우느냐에 달립니다."
        />
        <CalculationWalkthrough
          title="Kimi K2.5 한 행"
          question="8×RTX PRO 6000 노드에서 K2.5의 다섯 숫자는 얼마입니까?"
          scope="config.json과 HF 파일 크기, 장당 86.4GB와 1,597GB/s 가정만 씁니다. 엔진 작업 공간과 실제 kernel 효율은 넣지 않습니다."
          steps={[
            { label: "가중치", expression: "691.2 GB − 595.2 GB", result: "96 GB, 장당 12 GB", reason: "INT4 체크포인트를 올리고 남는 자리입니다." },
            { label: "token당 읽기, 요청 하나", expression: "약 30 GB ÷ 8장 ÷ 1,597 GB/s", result: "약 2.3 ms(추정)", reason: "활성 32B 가운데 expert는 INT4, attention과 공유 expert는 BF16이라 약 30GB로 잡았습니다." },
            { label: "token당 읽기, 동시 64", expression: "384 × (1 − (1 − 8/384)^64)", result: "284개, 74%", reason: "요청이 많으면 step마다 읽는 expert 합집합이 커집니다." },
            { label: "에이전트 기록", expression: "61 × 576 × 2 B × 131,072", result: "70,272 B/token, 9.2 GB", reason: "층마다 latent 512개와 위치용 64개를 BF16으로 남깁니다." },
            { label: "나누는 방식", expression: "12 GB ÷ 9.2 GB · (12 GB × 8) ÷ (9.2 GB ÷ 2)", result: "약 1개 · 약 21개", reason: "8장 복제면 장마다 한 벌, token 축 8조각과 FP8이면 장당 16분의 1입니다." },
            { label: "네트워크", expression: "2 × 61 · 7,168 × 2 B", result: "122회 · 14,336 B", reason: "TP8의 token당 합치기 횟수와 PP 경계 byte입니다." },
          ]}
          conclusion="K2.5는 노드에 들어가지만 남는 자리가 작고 그 자리마저 8번 겹쳐 쓰기 때문에, 문맥을 token 축으로 나누지 않으면 128K 에이전트 하나가 한계입니다."
          caveats={["30GB는 근거 문서의 추정치이고 엔진이 실제로 읽는 byte는 kernel 구현에 따라 다릅니다.", "에이전트 수는 상주 가능 수이지 속도 기준을 지키는 동시 처리 수가 아닙니다."]}
        />
        <div className={prose}>
          <p>
            한 행을 채우는 데 config 값 일곱 개와 장비 숫자 두 개면 충분했습니다. 다른 다섯 모델도 같은 칸을 같은 순서로 채우면 됩니다. 다만 행마다 결과가 왜 그렇게
            갈리는지는 구조의 부품을 들여다봐야 설명됩니다.
          </p>
        </div>
      </section>

      <section id="why-columns" data-teach-level="2" data-calculation-explained className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 다섯 숫자는 구조의 세 선택에서 갈립니다</h2>
        <div className={prose}>
          <p>여섯 모델의 차이는 세 가지 선택으로 줄일 수 있습니다. 첫째, token마다 모든 가중치를 쓰는가, 일부 expert만 쓰는가. 둘째, attention이 과거 token의 기록을 head 몇 개 분량으로 남기는가. 셋째, 모든 층이 과거 전체를 보는가, 일부 층은 고정 크기 요약이나 최근 창만 보는가입니다.</p>
          <p>
            가중치를 전부 쓰는지가 1번과 2번 질문을 정합니다. Llama 405B는 dense라 token마다 405.9B parameter를 모두 읽습니다. 공식 FP8 체크포인트
            487.3GB를 8장이 나눠 읽으면 장당 61GB, 약 38ms라 요청 하나의 상한이 초당 26 token입니다. 활성 22B인 Qwen3-235B-A22B는 같은 계산으로
            상한이 580 token이 넘습니다.
          </p>
          <p>
            두 번째 선택은 3번과 4번 질문을 정합니다. Llama는 층마다 KV head 8개에 폭 128을 남겨 token당 504KiB, Qwen3-235B는 KV head 4개라
            188KiB, K2.5는 576개 한 덩어리라 68.6KiB입니다. head가 적을수록 기록은 작아지지만 그만큼 여러 장에 나눌 조각도 줄어듭니다. 아래 그림은 이 맞바꿈을
            GPU 8장 위에 놓고 보여 줍니다.
          </p>
        </div>
        <KvPlacementViz />
        <div className={prose}>
          <p>
            head 8개는 8장에 하나씩 나뉘어 노드에 기록이 한 벌만 있습니다. head 4개는 두 장씩 같은 head를 들어 두 벌, 576개 한 덩어리는 여덟 벌이 됩니다. 기록이
            Llama의 7분의 1인 K2.5가 노드에서는 오히려 Llama보다 더 많은 자리를 차지합니다.
          </p>
          <p>
            층마다 과거 전체를 보는지는 기록이 문맥 길이를 따라 자라는지를 정합니다. Qwen3.6-35B-A3B는 40층 가운데 30층이 과거를 128 × 128 행렬 하나로 요약해
            들고 다니고 10층만 KV를 남깁니다. gpt-oss-120b는 36층 가운데 18층이 최근 128 token만 봅니다. Kimi K3는 93층 가운데 69층이 요약 행렬을,
            24층만 latent 기록을 씁니다.
          </p>
          <p>요약 행렬은 문맥이 1K든 1M이든 크기가 같습니다. Qwen3.6-35B-A3B의 한 층은 value head 32개마다 128 × 128 행렬이라 FP32로 2MiB이고, 30층이면 요청당 약 63MB입니다. K3는 head 96개에 69층이라 FP32로 약 434MB입니다. 문맥이 길어질수록 이 고정 몫보다 길이 비례 몫이 훨씬 커집니다.</p>
        </div>
        <ExplainedFormula
          question="128K token 문맥을 붙잡은 에이전트 하나가 GPU 메모리를 얼마나 씁니까?"
          idea="층을 세 종류로 나눠 따로 셉니다. 과거 전체를 보는 층은 문맥 길이에 비례하고, 최근 창만 보는 층은 창 크기에서 멈추고, 요약 행렬을 쓰는 층은 길이와 무관합니다."
          formula={String.raw`M(C)=C\,b\sum_{\ell\in F}w_\ell+\sum_{\ell\in S}\min(C,W)\,b\,w_\ell+\sum_{\ell\in R}s_\ell`}
          annotatedFormula={String.raw`M(C)=\underbrace{C\,b\sum_{\ell\in F}w_\ell}_{\text{전체를 보는 층: 길이 비례}}+\underbrace{\sum_{\ell\in S}\min(C,W)\,b\,w_\ell}_{\text{창 층: W에서 멈춤}}+\underbrace{\sum_{\ell\in R}s_\ell}_{\text{요약 행렬 층: 고정}}`}
          operations={[
            { expression: String.raw`w_\ell=2H_{kv}d_h`, annotation: ["Llama 405B: 2 × 8 × 128 = 2,048개", "126층 × 2,048 × 2 B = 516,096 B/token"] },
            { expression: String.raw`w_\ell=d_c+d_r`, annotation: ["K2.5: 512 + 64 = 576개", "61층 × 576 × 2 B = 70,272 B/token"] },
            { expression: String.raw`\min(C,W)`, annotation: ["gpt-oss-120b 창 층: W = 128", "18층 × 128 × 2,048 B = 4.7 MB에서 멈춤"] },
            { expression: String.raw`s_\ell`, annotation: ["Qwen3.6-35B-A3B: 32 × 128 × 128 × 4 B = 2 MiB", "30층이면 약 63 MB, 문맥과 무관"] },
          ]}
          terms={[
            { symbol: "C", name: "문맥 길이", description: "에이전트가 붙잡은 token 수입니다. 이 글은 131,072(128K)를 씁니다." },
            { symbol: "b", name: "원소 byte", description: "BF16이면 2, FP8이면 1입니다." },
            { symbol: String.raw`w_\ell`, name: "token당 원소 수", description: "층 하나가 token마다 남기는 숫자 개수입니다. KV head 방식이면 2·H·d, latent 방식이면 d_c + d_r입니다." },
            { symbol: "F, S, R", name: "층 묶음", description: "과거 전체를 보는 층, 최근 창만 보는 층, 요약 행렬을 쓰는 층의 집합입니다." },
            { symbol: "W", name: "창 크기", description: "창 층이 보는 최근 token 수입니다." },
            { symbol: String.raw`s_\ell`, name: "고정 state", description: "요약 행렬과 짧은 convolution 기록의 byte입니다." },
          ]}
          assumptions={["논리 크기입니다. block 빈칸, 엔진 작업 공간, 여러 장에 겹쳐 놓인 사본은 넣지 않았습니다.", "창 층의 오래된 block을 엔진이 실제로 돌려줘야 둘째 항이 W에서 멈춥니다."]}
          interpretation="128K에서 첫째 항이 거의 모든 차이를 만듭니다. 둘째와 셋째 항은 수 MB에서 수백 MB라 문맥이 길수록 무시할 만해지고, 그래서 hybrid 구조는 긴 문맥에서 같은 메모리에 훨씬 많은 에이전트를 둡니다."
        />
        <CalculationWalkthrough
          title="128K 에이전트 하나의 기록"
          question="여섯 모델에서 128K 에이전트 하나가 붙잡는 기록은 몇 GB입니까?"
          scope="BF16 KV의 논리 크기입니다. 요약 행렬은 config의 dtype 또는 vLLM 기본값인 FP32로 셉니다. 사본 수는 다음 절에서 곱합니다."
          steps={[
            { label: "Llama 3.1 405B", expression: "126 × 2 × 8 × 128 × 2 B × 131,072", result: "516,096 B/token, 67.6 GB", reason: "126층 모두 KV head 8개를 남깁니다." },
            { label: "Qwen3-235B-A22B", expression: "94 × 2 × 4 × 128 × 2 B × 131,072", result: "192,512 B/token, 25.2 GB", reason: "94층 모두 KV head 4개를 남깁니다." },
            { label: "Kimi K2.5, DeepSeek-V3", expression: "61 × 576 × 2 B × 131,072", result: "70,272 B/token, 9.2 GB", reason: "두 모델 모두 61층 latent 576개입니다." },
            { label: "Kimi K3", expression: "24 × 576 × 2 B × 131,072 + 69 × 96 × 128 × 128 × 4 B", result: "3.6 GB + 0.43 GB ≈ 4.1 GB", reason: "latent 층 24개와 KDA 요약 층 69개를 따로 셉니다. convolution 기록 약 15MB는 뺐습니다." },
            { label: "Qwen3.6-35B-A3B", expression: "10 × 2 × 2 × 256 × 2 B × 131,072 + 30 × 2 MiB", result: "2.68 GB + 0.06 GB ≈ 2.75 GB", reason: "full attention 10층만 KV를 남기고 DeltaNet 30층은 고정 state입니다." },
            { label: "gpt-oss-120b", expression: "18 × 2 × 8 × 64 × 2 B × 131,072 + 4.7 MB", result: "36,864 B/token, 4.8 GB", reason: "창 층 18개가 창 밖 block을 돌려줄 때입니다. 돌려주지 않으면 9.7 GB입니다." },
          ]}
          conclusion="128K에서 가장 무거운 Llama와 가장 가벼운 Qwen3.6-35B-A3B는 에이전트 하나의 기록이 약 25배 차이 납니다. 이 차이는 parameter 수보다 층마다 남기는 기록의 모양에서 나옵니다."
          caveats={["Qwen3-235B-A22B는 native 문맥이 32,768이라 128K는 YaRN 확장 조건입니다.", "DeepSeek-V3 FP8은 688.6GB라 같은 기록을 갖더라도 8장 노드에 둘 자리가 거의 없습니다(6절)."]}
        />
        <div className={prose}>
          <p>
            가중치를 전부 쓰는지가 읽는 byte를, 기록을 head 몇 개로 남기는지가 기록 크기와 나눌 수 있는 조각 수를, 층 일부를 고정 state로 바꿨는지가 문맥 길이에 대한
            민감도를 정합니다. 각 행이 갈린 원인은 이 셋입니다. 이 선택들에 정식 이름을 붙이면 이름마다 나누는 방식의 규칙이 하나씩 대응됩니다.
          </p>
        </div>
      </section>

      <section id="names-and-rules" data-teach-level="3" data-calculation-explained className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 이름을 붙이면 나누는 방식과 네트워크 요구가 규칙이 됩니다</h2>
        <div className={prose}>
          <p>
            앞 절에서 이름 없이 설명한 부품들에도 업계에서 쓰는 이름이 있습니다. 아래 표는 이미 숫자로 본 동작 하나와 그 이름을 한 줄씩 짝지었습니다.
          </p>
        </div>
        <TermBreakdown
          title="이 글에서 쓰는 구조와 배치의 이름"
          items={[
            { term: "GQA(grouped-query attention)", description: "query head 여러 개가 KV head 하나를 함께 읽게 해서 KV head 수를 줄인 attention입니다.", example: "Llama 405B는 query 128개에 KV 8개, Qwen3-235B는 query 64개에 KV 4개입니다.", boundary: "KV head 수보다 많은 장으로 나누면 같은 KV head가 여러 장에 복제됩니다." },
            { term: "MLA(multi-head latent attention)", description: "K와 V를 head별로 남기지 않고 압축한 latent 하나와 위치용 작은 벡터만 남기는 attention입니다.", example: "DeepSeek-V3와 K2.5는 512 + 64 = 576개, K3의 MLA 층도 576개입니다.", boundary: "decode에서는 모든 head가 이 한 덩어리를 공유해 읽으므로 head 축으로 쪼갤 수 없습니다." },
            { term: "선형 attention 계열 층(Gated DeltaNet, KDA)", description: "과거 token을 하나씩 남기는 대신 head마다 고정 크기 행렬에 누적해 들고 가는 층입니다.", example: "Qwen3.6-35B-A3B는 40층 중 30층, K3는 93층 중 69층이 이 방식입니다.", boundary: "state는 head 축으로 나뉘지만 문맥을 다시 읽는 기능은 함께 섞인 full attention 층이 맡습니다." },
            { term: "SWA(sliding-window attention)", description: "각 token이 최근 W개만 보게 해서 그 층의 기록을 W에서 멈추게 하는 attention입니다.", example: "gpt-oss-120b는 36층 중 18층이 W = 128입니다.", boundary: "엔진이 창 밖 block을 실제로 돌려주지 않으면 메모리 이득이 사라집니다." },
            { term: "DCP(decode context parallel)", description: "head 대신 문맥의 token 축으로 기록을 나눠 각 장이 일부 구간만 들게 하는 decode 배치입니다.", example: "K2.5 TP8 + DCP8에서 장마다 128K 문맥의 8분의 1, 약 1.15GB만 듭니다.", boundary: "층마다 부분 attention 결과를 합치는 통신이 하나 더 붙고 요청 하나의 속도가 떨어집니다." },
            { term: "EP(expert parallel)", description: "expert를 장마다 나눠 두고 token을 그 expert가 있는 장으로 보냈다 받는 배치입니다.", example: "K2.5 MoE 층마다 token 하나가 8개 expert로 흩어졌다 모입니다.", boundary: "이 왕복이 노드 안 NVLink를 전제로 설계된 구현이 많아 PCIe 노드에서는 경로가 제한됩니다." },
          ]}
        />
        <div className={prose}>
          <p>
            이름이 붙으면 4번 질문의 규칙을 한 식으로 적을 수 있습니다. 기록을 나누는 축은 KV head와 token 두 가지이고 GPU 한 장이 드는 몫은 두 축으로 나뉜 조각 수에
            반비례합니다. TP를 아무리 키워도 KV head 수보다 잘게 나뉘지는 않습니다.
          </p>
        </div>
        <ExplainedFormula
          question="TP T장과 DCP D조각으로 나눌 때 GPU 한 장이 에이전트 하나 때문에 드는 기록은 얼마입니까?"
          idea="기록은 KV head 축으로 최대 KV head 수만큼, token 축으로 D조각만큼 나뉩니다. 장 수가 그보다 많으면 남는 장은 같은 조각을 복제해서 듭니다."
          formula={String.raw`m_{\mathrm{GPU}}=\frac{M(C)}{\min(T,H_{kv})\cdot D}`}
          annotatedFormula={String.raw`m_{\mathrm{GPU}}=\frac{\overbrace{M(C)}^{\text{에이전트 기록 한 벌}}}{\underbrace{\min(T,H_{kv})}_{\text{head 축으로 나뉘는 조각}}\cdot\underbrace{D}_{\text{token 축 조각}}}`}
          operations={[
            { expression: String.raw`\min(8,8)\cdot1`, annotation: ["Llama 405B: 67.6 ÷ 8 = 8.46 GB", "노드 전체에 한 벌입니다."] },
            { expression: String.raw`\min(8,4)\cdot1`, annotation: ["Qwen3-235B: 25.2 ÷ 4 = 6.31 GB", "8장 × 6.31 = 50.5 GB, 두 벌입니다."] },
            { expression: String.raw`\min(8,1)\cdot1`, annotation: ["K2.5 TP8: 9.2 ÷ 1 = 9.2 GB", "8장 모두 한 벌씩, 여덟 벌입니다."] },
            { expression: String.raw`\min(8,1)\cdot8`, annotation: ["K2.5 TP8 + DCP8: 9.2 ÷ 8 = 1.15 GB", "다시 한 벌로 돌아옵니다."] },
          ]}
          terms={[
            { symbol: "T", name: "TP 장 수", description: "한 모델 복제본을 head와 행렬 축으로 나누는 GPU 수입니다." },
            { symbol: String.raw`H_{kv}`, name: "KV head 수", description: "기록을 독립적으로 남기는 head 수입니다. MLA는 1로 봅니다." },
            { symbol: "D", name: "DCP 조각 수", description: "문맥을 token 축으로 나눈 조각 수입니다. 나누지 않으면 1입니다." },
            { symbol: String.raw`M(C)`, name: "기록 한 벌", description: "4절 식으로 구한 에이전트 하나의 논리 기록입니다." },
          ]}
          assumptions={["T가 H_kv의 배수이거나 약수라고 봅니다.", "요약 행렬 층의 state는 head 축으로 T조각에 나뉩니다(vLLM 2026-11-03 코드 기준)."]}
          interpretation="분모가 T보다 작으면 노드에 기록이 T ÷ (min(T, H_kv)·D) 벌 겹칩니다. GQA는 TP를 KV head 수 이하로 두거나 복제본을 늘려 이 배수를 1로 만들고, MLA는 D를 키워야만 1로 돌아옵니다."
        />
        <div className={prose}>
          <p>
            이 규칙에서 구조별 선택이 바로 나옵니다. Llama 405B는 TP8이 KV head 8개와 딱 맞습니다. Qwen3-235B는 TP8이면 두 벌이 되므로 TP4 복제본 두
            개도 같은 후보입니다. TP4는 체크포인트 239GB를 장당 60GB로 나눠 들어가고 사본이 없는 대신 장마다 읽는 가중치가 두 배라 요청 하나의 상한이 절반이 됩니다. MLA
            모델은 DCP 없이는 장을 늘려도 기록 자리가 늘지 않습니다.
          </p>
          <p>
            Qwen3.6-35B-A3B와 gpt-oss-120b는 가중치가 한 장에 들어갑니다. 이때는 나누지 않는 배치가 가장 좋습니다. 장마다 독립 복제본을 두면 기록 사본도, 장
            사이 동기화도 없습니다. vLLM 코드에서 DeltaNet과 KDA의 state가 head 축으로 TP 장 수만큼 나뉘는 것을 확인했지만 애초에 쪼갤 이유가 없습니다.
          </p>
          <p>5번 질문, 네트워크도 같은 방식으로 규칙이 됩니다. 나누는 방식마다 token 하나가 만들어지는 동안 오가는 것의 횟수와 크기가 config 값 몇 개로 정해집니다. 아래 그림이 K2.5 token 하나를 기준으로 네 방식의 선을 그립니다.</p>
        </div>
        <NetworkDemandViz />
        <ExplainedFormula
          question="token 하나를 만들 때 나누는 방식마다 무엇이 몇 번 오갑니까?"
          idea="TP는 층마다 두 번 모든 장의 부분합을 더하고, PP는 노드 경계에서 hidden 벡터를 한 번 넘기고, EP는 MoE 층마다 선택된 expert로 token을 보냈다 받습니다."
          formula={String.raw`n_{\mathrm{TP}}=2L,\qquad V_{\mathrm{PP}}=h\,b,\qquad V_{\mathrm{EP}}\le 2\,k\,h\,b\,L_{\mathrm{moe}}`}
          annotatedFormula={String.raw`\underbrace{n_{\mathrm{TP}}=2L}_{\text{token당 합치기 횟수}},\quad\underbrace{V_{\mathrm{PP}}=h\,b}_{\text{경계당 byte}},\quad\underbrace{V_{\mathrm{EP}}\le 2\,k\,h\,b\,L_{\mathrm{moe}}}_{\text{보냈다 받는 byte 상한}}`}
          operations={[
            { expression: String.raw`2L`, annotation: ["K2.5: 2 × 61 = 122회", "Llama 405B: 2 × 126 = 252회"] },
            { expression: String.raw`h\,b`, annotation: ["K2.5: 7,168 × 2 B = 14,336 B", "2,000 tok/s여도 0.23 Gbps"] },
            { expression: String.raw`2\,k\,h\,b\,L_{\mathrm{moe}}`, annotation: ["K2.5: 2 × 8 × 7,168 × 2 B = 229 KB/층", "60층이면 약 13.8 MB/token"] },
          ]}
          terms={[
            { symbol: "L", name: "층 수", description: "TP 장들이 함께 계산하는 decoder 층 수입니다." },
            { symbol: "h", name: "hidden 폭", description: "층 사이를 흐르는 벡터의 원소 수입니다." },
            { symbol: "b", name: "원소 byte", description: "activation을 BF16으로 보내면 2입니다." },
            { symbol: "k", name: "token당 expert 수", description: "token 하나가 보내지는 routed expert 수입니다." },
            { symbol: String.raw`L_{\mathrm{moe}}`, name: "MoE 층 수", description: "expert를 거치는 층 수입니다. K2.5는 60입니다." },
          ]}
          assumptions={["EP는 같은 장의 expert로 가는 token도 센 상한입니다.", "TP 합치기 한 번의 크기는 h·b 정도로 작아 왕복 지연이 시간을 정합니다."]}
          interpretation="TP는 횟수가, EP는 양이, PP는 둘 다 작습니다. 그래서 TP와 EP는 노드 안의 빠른 연결 위에 두고, 노드 사이에는 PP 경계나 복제본만 두는 것이 기본 배치가 됩니다."
        />
        <CalculationWalkthrough
          title="나누는 방식별 token당 통신"
          question="여섯 모델을 TP8로 나눴을 때와 노드 경계에 PP를 둘 때 token 하나가 만드는 통신은 얼마입니까?"
          scope="config의 층 수와 hidden 폭만 씁니다. 엔진의 통신 합치기 최적화와 FP8 dispatch는 넣지 않습니다."
          steps={[
            { label: "Llama 3.1 405B", expression: "2 × 126 · 16,384 × 2 B", result: "252회 · 32 KiB", reason: "층이 가장 많아 TP 합치기 횟수가 가장 많고, hidden도 가장 넓습니다." },
            { label: "Qwen3-235B-A22B", expression: "2 × 94 · 4,096 × 2 B · 2 × 8 × 4,096 × 2 B × 94", result: "188회 · 8 KiB · 약 12.3 MB", reason: "EP를 쓰면 MoE 94층에서 8개 expert로 보냈다 받습니다." },
            { label: "Kimi K2.5", expression: "2 × 61 · 7,168 × 2 B · 2 × 8 × 7,168 × 2 B × 60", result: "122회 · 14 KiB · 약 13.8 MB", reason: "첫 층이 dense라 MoE 층은 60개입니다." },
            { label: "Kimi K3", expression: "2 × 93 · 7,168 × 2 B", result: "186회 · 14 KiB", reason: "EP byte는 latent MoE의 dispatch 폭을 확인하지 못해 계산하지 않았습니다." },
            { label: "Qwen3.6-35B-A3B", expression: "2 × 40 · 2,048 × 2 B", result: "80회 · 4 KiB", reason: "한 장에 들어가므로 실제 배치에서는 0회입니다." },
            { label: "gpt-oss-120b", expression: "2 × 36 · 2,880 × 2 B", result: "72회 · 5.6 KiB", reason: "역시 한 장에 들어가므로 실제 배치에서는 0회입니다." },
            { label: "PP 대역폭 감각", expression: "14,336 B × 2,000 tok/s × 8 bit", result: "0.23 Gbps", reason: "노드 경계 PP는 100GbE의 0.3%도 쓰지 않습니다." },
          ]}
          conclusion="노드 사이에 두기 쉬운 것은 PP 경계뿐입니다. TP 합치기 수백 번과 EP의 token당 수 MB는 노드 안에 두어야 하고, NVLink가 없는 노드에서는 노드 안에서도 PCIe 지연과 대역폭이 그 몫을 정합니다."
          caveats={["EP byte는 같은 장의 expert로 가는 경우까지 센 상한입니다.", "DCP를 켜면 층마다 attention 결과를 합치는 통신이 하나씩 더 붙습니다."]}
        />
        <div className={prose}>
          <p>
            이름과 규칙을 실제 노드 하나에 끝까지 대입해 봅니다. 3절의 K2.5 숫자를 그대로 들고 가 다른 다섯 행과 나란히 놓습니다.
          </p>
        </div>
      </section>

      <section id="node-case" data-teach-level="4" data-calculation-explained className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 8×RTX PRO 6000 노드에 여섯 모델을 대입합니다</h2>
        <div className={prose}>
          <p>
            노드는 2절에서 정한 그대로입니다. 장마다 1,597GB/s, 가중치와 기록에 쓸 몫은 86.4GB, 8장 합계 691.2GB이고 GPU끼리는 PCIe로만 연결됩니다. 각
            모델을 가장 가벼운 공개 체크포인트로 올리고 기본 배치와 5절 규칙으로 고친 배치에서 128K 에이전트가 몇 개 상주하는지 셉니다.
          </p>
          <p>
            먼저 들어가지 않는 모델을 걸러 냅니다. Kimi K3 공식 MXFP4는 1,561GB라 8장의 실제 용량 821GB를 넘습니다. DeepSeek-V3 FP8 688.6GB는
            691.2GB에 수치상으로는 들어가지만 기록 자리가 2.6GB뿐이라 서빙할 수 없고 vLLM 레시피도 FP8에 VRAM 805GB를 요구합니다. DeepSeek 계열은
            NVFP4 413.3GB 체크포인트를 써야 이 노드에 올라갑니다.
          </p>
        </div>
        <NodeFitViz />
        <div className={prose}>
          <p>
            기본 배치에서 Llama 405B는 FP8 가중치 487.3GB를 TP8로 올리고 남은 203.9GB에 67.6GB짜리 에이전트 3개를 둡니다. 요청 하나의 상한은 대역폭만으로
            초당 26 token이고 실제로는 252번의 합치기 지연이 더해집니다. 이 행의 병목은 기록 크기와 dense 읽기 둘 다입니다.
          </p>
          <p>
            Qwen3-235B-A22B는 FP8 239GB를 올리고 452.2GB가 남지만 TP8에서 기록이 두 벌이라 128K 에이전트 9개, FP8 기록이면 18개입니다. TP4
            복제본 두 개로 바꿔도 상주 수는 약 8.4개로 비슷합니다. 대신 동기화에 참여하는 장이 4장으로 줄고 대기열이 둘로 나뉩니다. 이 선택은 측정으로 가려야 합니다.
          </p>
          <p>
            K2.5는 3절에서 본 대로 기본 배치 1개, FP8 기록과 DCP8로 21개입니다. 대가도 같은 위키에 있습니다. 요청 하나의 속도가 BF16 기록의 초당 90 token에서
            FP8·DCP8의 65 token으로 떨어지고 DCP 경로의 출력 drift 버그(vLLM #41623)가 열려 있습니다. 반대로 DCP 없이 150K 문맥에 가면 초당 6~7
            token으로 무너진다는 보고도 있습니다(현장 경험).
          </p>
          <p>
            Qwen3.6-35B-A3B는 FP8 가중치 37.5GB가 한 장에 들어가 장마다 48.9GB가 남습니다. 2.75GB짜리 에이전트를 장당 17개씩, 노드에 약 142개
            둡니다. gpt-oss-120b도 MXFP4 65.2GB가 한 장에 들어가 장당 4개, 노드에 약 35개입니다. 두 모델 모두 장 사이 통신이 없고 병목은 장 하나의 메모리
            대역폭입니다.
          </p>
        </div>
        <CalculationWalkthrough
          title="8장 노드의 128K 상주 에이전트"
          question="장당 86.4GB 가정에서 여섯 모델은 128K 에이전트를 몇 개 상주시킵니까?"
          scope="가중치를 뺀 자리를 4절의 기록 한 벌과 5절의 사본 배수로 나눕니다. 작업 공간과 prefix 공유는 넣지 않습니다."
          steps={[
            { label: "Llama 3.1 405B, TP8", expression: "(691.2 − 487.3) GB ÷ 67.6 GB", result: "3.0개, FP8 기록 6.0개", reason: "KV head 8개라 사본이 없습니다." },
            { label: "Qwen3-235B-A22B, TP8", expression: "(691.2 − 239.0) GB ÷ (2 × 25.2 GB)", result: "9.0개, FP8 기록 17.9개", reason: "KV head 4개라 두 벌입니다." },
            { label: "Kimi K2.5, TP8", expression: "12.0 GB ÷ 9.2 GB · (96 GB ÷ 4.6 GB)", result: "1.3개 · DCP8 + FP8 20.8개", reason: "장마다 한 벌이던 것을 token 축 8조각과 FP8로 줄입니다." },
            { label: "Kimi K3", expression: "1,561 GB > 821 GB", result: "올라가지 않음", reason: "16장 TP16·DCP16으로 가동한 보고가 있습니다(현장 경험)." },
            { label: "Qwen3.6-35B-A3B, 장마다", expression: "8 × (86.4 − 37.5) GB ÷ 2.75 GB", result: "142개", reason: "가중치가 한 장에 들어가 복제본 8개가 독립으로 받습니다." },
            { label: "gpt-oss-120b, 장마다", expression: "8 × (86.4 − 65.2) GB ÷ 4.8 GB", result: "35개", reason: "창 층의 block을 돌려줄 때입니다. 돌려주지 않으면 17개입니다." },
          ]}
          conclusion="같은 노드에서 상주 가능한 128K 에이전트는 1개에서 142개까지 벌어지고, K2.5처럼 배치 하나로 20배가 바뀌는 행도 있습니다. 장비를 정하기 전에 모델의 구조를 먼저 읽어야 하는 이유입니다."
          caveats={["상주 가능 수는 위쪽 경계입니다. 요청당 속도 기준을 지키는 동시 처리 수는 측정해야 압니다.", "prefix 공유로 여러 에이전트가 같은 앞부분을 쓰면 실제 자리는 더 남습니다."]}
        />
        <div className={prose}>
          <p>
            빠른 노드 간 네트워크로 두 번째 노드를 붙여 PP 경계 하나를 노드 사이에 두면 가중치는 여전히 한 벌이고 늘어난 691.2GB는 모두 기록 자리가 됩니다. K2.5는
            96GB이던 자리가 787GB로 늘어 DCP8·FP8 기준 171개, Llama는 FP8 기록으로 26개가 됩니다. 경계를 넘는 양은 token당 14~32KiB라
            100GbE로도 충분합니다.
          </p>
          <p>
            그런데 요청 하나의 속도는 오르지 않습니다. PP는 한 token의 층들을 두 노드가 차례로 처리하므로 노드마다 읽는 가중치가 절반이 되는 대신 두 번 기다립니다. 경계 왕복
            하나가 더해질 뿐입니다. MLX의 PP4 14.49 대 TP4 14.82 token/s 비교에서는 둘이 비슷해 보이지만 batch 1의 결과라 동시 처리에는 일반화할 수
            없습니다.
          </p>
          <p>노드를 넘는 TP나 EP는 다른 이야기입니다. TP의 수백 번 합치기가 노드 간 왕복 지연을 그대로 맞고, EP의 token당 수 MB가 NIC를 지납니다. 근거 문서가 확인한 바로는 DeepEP의 normal 모드는 노드 안 NVLink가 필수이고(DeepEP #216), pplx 백엔드는 vLLM에서 제거됐으며, llm-d의 wide-EP는 H200·B200 같은 NVLink 장비에서만 검증됐습니다. PCIe 노드에서는 복제본과 PP 경계로 늘리는 것이 현실적인 선택입니다.</p>
        </div>
        <AlgorithmBlock
          title="config에서 PCIe 노드 배치 고르기"
          input={["config.json: 층 수 L, KV head 수 H_kv 또는 latent 폭, expert 수 E와 k, 층 종류", "체크포인트 크기 W_ckpt, 장당 쓸 수 있는 메모리 G, 장 수 N", "목표 문맥 C"]}
          steps={[
            { code: "if W_ckpt ≤ G: 장마다 복제본 N개, 장 사이 통신 없음", note: "Qwen3.6-35B-A3B, gpt-oss-120b가 여기서 끝납니다." },
            { code: "elif W_ckpt ≤ N·G: 노드 하나에 TP T = 2의 거듭제곱 중 가중치가 들어가는 최소값", note: "TP 합치기 2L회는 노드 안에 둡니다." },
            { code: "  if H_kv < T: (MLA면) DCP D = T ÷ H_kv 검토, (GQA면) TP를 H_kv로 줄이고 복제본 늘리기 검토", note: "4절 식의 사본 배수를 1로 되돌리는 단계입니다." },
            { code: "  KV dtype을 FP8로 바꿨을 때의 정확도와 속도를 같이 잽니다", note: "자리는 두 배, 대가는 kernel 경로와 정확도입니다." },
            { code: "else: 노드 사이에 PP 경계를 두고 노드 안은 TP", note: "경계는 token당 h·b byte라 대역폭 요구가 작습니다." },
            { code: "자리가 모자라면 노드를 복제본 또는 PP로 늘립니다. 노드 간 TP·EP는 실측으로 증명된 뒤에만", note: "네트워크는 자리를 늘리고 요청 하나의 속도는 늘리지 않습니다." },
          ]}
          output="모델별 TP·DCP·PP·복제본 구성과, 그 구성에서 측정해야 할 항목(요청 하나의 속도, 상주 에이전트 수, 동시성별 처리량)"
        />
        <div className={prose}>
          <p>이 절차의 숫자가 어디서 왔는지는 공개 원문에서 다시 확인할 수 있습니다. 아래는 각 행을 채우는 데 쓴 config와 코드, 같은 노드의 현장 기록입니다.</p>
        </div>
        <CitationBlock source="Hugging Face · moonshotai/Kimi-K2.5, deepseek-ai/DeepSeek-V3 config.json (2026-11-03 확인)" citeKey={1} href="https://huggingface.co/moonshotai/Kimi-K2.5/blob/main/config.json" type="code">
          K2.5 text_config: hidden_size 7168, num_hidden_layers 61, num_attention_heads 64, kv_lora_rank 512, qk_rope_head_dim 64, n_routed_experts 384, num_experts_per_tok 8, n_shared_experts 1, first_k_dense_replace 1. DeepSeek-V3도 61층, kv_lora_rank 512, qk_rope_head_dim 64로 같은 기록 모양이고 n_routed_experts 256, first_k_dense_replace 3입니다. 3절의 70,272 B/token은 61 × (512 + 64) × 2입니다.
        </CitationBlock>
        <CitationBlock source="Hugging Face · Llama 3.1 405B, Qwen/Qwen3-235B-A22B config.json" citeKey={2} href="https://huggingface.co/Qwen/Qwen3-235B-A22B/blob/main/config.json" type="code">
          Qwen3-235B-A22B: num_hidden_layers 94, hidden_size 4096, num_attention_heads 64, num_key_value_heads 4, head_dim 128, num_experts 128, num_experts_per_tok 8. Llama 3.1 405B 공식 저장소는 로그인 동의가 필요해 같은 구조의 공개 파생 체크포인트 config(NousResearch/Hermes-3-Llama-3.1-405B)로 확인했습니다: num_hidden_layers 126, hidden_size 16384, num_attention_heads 128, num_key_value_heads 8. 공식 FP8 체크포인트 크기 487.3GB는 HF API 메타데이터 값입니다.
        </CitationBlock>
        <CitationBlock source="Hugging Face · moonshotai/Kimi-K3, Qwen/Qwen3.6-35B-A3B, openai/gpt-oss-120b config.json" citeKey={3} href="https://huggingface.co/moonshotai/Kimi-K3/blob/main/config.json" type="code">
          K3 linear_attn_config: kda_layers 69개, full_attn_layers 24개, num_heads 96, head_dim 128, kv_lora_rank 512, qk_rope_head_dim 64, num_experts 896, num_experts_per_token 16. Qwen3.6-35B-A3B: layer_types 40개 중 linear_attention 30, full_attention 10, num_key_value_heads 2, head_dim 256, linear_num_value_heads 32, linear_key_head_dim 128, mamba_ssm_dtype float32. gpt-oss-120b: layer_types 36개 중 sliding_attention 18, sliding_window 128, num_key_value_heads 8, head_dim 64.
        </CitationBlock>
        <CitationBlock source="vLLM · model_executor/layers/mamba/mamba_utils.py (커밋 3c01fae6, 2026-11-03)" citeKey={4} href="https://github.com/vllm-project/vllm/blob/3c01fae696376ceefa94fcdb75907a3cd8d4b9d4/vllm/model_executor/layers/mamba/mamba_utils.py" type="code">
          gated_delta_net_state_shape와 kda_state_shape가 state의 head 차원을 divide(num_heads, tp_world_size)로 나눕니다. KDA의 recurrent state 기본 dtype은 float32입니다. K3의 MLA 층은 vllm/models/kimi_k3/nvidia/mla.py에서 head_size = kv_lora_rank + qk_rope_head_dim으로 576개를 저장합니다.
        </CitationBlock>
        <CitationBlock source="local-inference-lab/rtx6kpro · models/kimi-k25.md, benchmarks/results.md (커밋 1b6de11b, 2026-11-02)" citeKey={5} href="https://github.com/local-inference-lab/rtx6kpro" type="code">
          8×RTX PRO 6000, K2.5 INT4, vLLM 단일 배치: BF16 KV·DCP1 90 tok/s, FP8 KV·DCP8 65 tok/s(P2P on), 44 tok/s(P2P off). FP8 KV·DCP8·gpu-util 0.93의 KV 용량 3,621,504 token. Discord 대화를 정리한 위키라 실행 환경 일부가 비어 있는 현장 경험 등급입니다.
        </CitationBlock>
        <div className={prose}>
          <p>
            K2.5 행을 원문에 다시 넣어 보면 계산이 닫힙니다. 61 × 576 × 2 = 70,272 byte이고, 같은 노드 위키의 3,621,504 token에 FP8 기준
            35,136 byte를 곱하면 127GB, 8장으로 나누면 장당 약 16GB입니다. 이 글이 가정한 장당 12GB보다 넓은데 위키 설정이 GPU 메모리 사용률을 0.93으로
            올렸고 장의 실제 용량도 97,887 MiB라서입니다.
          </p>
        </div>
      </section>

      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 표가 맞아도 kernel 지원과 측정 속도는 따로 확인해야 합니다</h2>
        <div className={prose}>
          <p>다섯 숫자는 이 구조가 이 장비에 들어갈 수 있는지를 알려 줄 뿐, 엔진이 그 경로를 이 GPU에서 제대로 실행하는지는 알려 주지 않습니다. RTX PRO 6000은 SM120 계열이라 데이터센터 Blackwell과 kernel 지원이 다릅니다. 근거 문서가 확인한 열린 버그만 해도 몇 개가 행 하나를 통째로 막습니다.</p>
          <p>예를 들어 vLLM #48898은 NVFP4 MoE를 TP8로 나눌 때 장마다의 행렬 폭이 32의 배수가 아니면 출력이 깨지는 문제이고, #47990은 DeepSeek FP8의 CUTLASS 경로가 576 폭의 latent projection에서 실패하는 문제입니다. 둘 다 열려 있어서 DeepSeek-V3/R1 행은 계산상 들어가도 이 노드에서 실서빙된 보고를 찾지 못했습니다.</p>
          <p>속도 쪽도 표 밖에 있습니다. 3절의 대역폭 상한은 초당 400 token이 넘었지만 실제 단일 스트림은 65~101 token입니다. 차이의 큰 몫은 122번의 합치기와 kernel 실행 지연입니다. P2P를 켜고 끈 측정(65 대 44)을 token당 시간으로 바꾸면 15.4ms 대 22.7ms이고, 차이 7.3ms를 122로 나누면 합치기 한 번에 약 60μs가 늘어난 셈입니다(추정, 차이를 모두 통신 탓으로 둠).</p>
          <p>
            같은 위키는 동시 처리량을 최대로 만드는 설정이 반대로 P2P를 끄는 쪽이라고 적습니다. 요청 하나의 지연과 노드 전체의 처리량은 서로 다른 설정을 원합니다. 이 표로 후보를
            좁힌 다음에는 같은 노드에서 요청 하나의 속도와 동시성별 처리량을 따로 재야 합니다.
          </p>
        </div>
        <ProgressiveDetail title="이 표의 가정 가운데 결과를 뒤집을 수 있는 것은 무엇입니까?" preview="장당 메모리 가정, 요약 행렬 dtype, 창 block 회수 여부, 긴 문맥 지원 범위가 행의 순서를 바꿀 수 있습니다.">
          <div className={prose}>
            <p>장당 86.4GB는 실측 K2.5 용량과 비교해 보수적인 쪽으로 잡은 값입니다. 엔진, CUDA graph, 비전 tower 포함 여부에 따라 실제 남는 자리는 이보다 10~30% 클 수 있습니다. 가중치가 노드를 거의 채우는 K2.5에서 이 차이가 가장 크게 드러납니다.</p>
            <p>Qwen3.6-35B-A3B의 요약 행렬은 config의 mamba_ssm_dtype이 float32라 FP32로 셌습니다. vLLM의 GDN state dtype은 설정에 따라 BF16일 수 있고 그러면 63MB가 31MB가 됩니다. 128K에서는 KV 2.68GB가 지배하므로 결론은 바뀌지 않습니다.</p>
            <p>gpt-oss-120b의 창 층 이득은 엔진이 창 밖 block을 실제로 돌려줄 때만 생깁니다. 돌려주지 않으면 에이전트 하나가 9.7GB가 되어 상주 수가 절반이 됩니다. 이 차이는 <Link to="/cs/ai/hybrid-kv-cache-allocation#overview">hybrid KV 할당</Link>에서 다룹니다.</p>
            <p>Qwen3-235B-A22B는 native 문맥이 32,768 token이고 128K는 YaRN 확장 조건입니다. Llama 3.1 405B와 DeepSeek-V3는 128K, K2.5와 Qwen3.6은 262,144, K3는 1,048,576 token까지 config에 적혀 있습니다. 200K 에이전트를 기준으로 삼으면 Llama와 Qwen3-235B 행은 비교에서 빠집니다.</p>
          </div>
        </ProgressiveDetail>
        <div className={prose}>
          <p>마지막으로 이 글의 에이전트 수는 메모리에 동시에 머물 수 있는 수입니다. 요청마다 초당 몇 token 이상을 보장하면서 받을 수 있는 수는 그보다 작고, 그 측정 방법은 에이전트 서빙 용량을 다루는 글의 몫입니다. MLA 기록이 왜 head 축으로 나뉘지 않는지와 DCP의 통신은 <Link to="/cs/ai/mla-kv-replication-and-decode-context-parallel">MLA KV 복제와 DCP</Link>에서, 노드 사이에 prefill과 decode를 나누는 다음 단계는 <Link to="/cs/ai/disaggregated-prefill-decode-serving">prefill·decode 분리 서빙</Link>에서 이어집니다.</p>
          <p>
            읽은 내용을 질문 세 개로 확인해 봅니다.
          </p>
          <p>첫째, Qwen3-235B-A22B를 TP8 대신 TP4 복제본 둘로 나누면 노드의 128K 상주 수와 요청 하나의 대역폭 상한은 각각 어느 쪽으로 움직일까요? (답: 5절)</p>
          <p>둘째, K2.5 노드에 두 번째 노드를 PP 경계로 붙였을 때 상주 에이전트 수가 두 배보다 훨씬 크게 늘어나는 이유는 무엇일까요? (답: 6절)</p>
          <p>셋째, 동시 요청을 1개에서 128개로 늘리면 K2.5 한 MoE 층이 step마다 읽는 expert 수와 token 하나가 나눠 갖는 expert 몫은 어떻게 변할까요? (답: 3절)</p>
        </div>
      </section>
    </div>
  );
}
