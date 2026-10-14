import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import KvByteLedgerViz from "./kv-cache-quantization/viz/KvByteLedgerViz";
import QuantRoundTripViz from "./kv-cache-quantization/viz/QuantRoundTripViz";
import ScaleGranularityViz from "./kv-cache-quantization/viz/ScaleGranularityViz";
import { codeRefs } from "./kv-cache-quantization/codeRefs";
import { kvQuantTrees } from "./kv-cache-quantization/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function KvCacheQuantizationArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. KV를 8비트로 저장하면 무엇이 두 배가 되고 무엇이 새로 생기나요?</h2>
          <div className={prose}>
            <p>긴 대화를 많이 받는 서버에서 GPU 메모리를 가장 먼저 채우는 것은 모델 가중치가 아니라 요청마다 쌓이는 KV cache인 경우가 많습니다. 같은 메모리에 더 많은 token을 넣는 가장 직접적인 방법은 KV 숫자 하나를 2 byte 대신 1 byte로 저장하는 것입니다.</p>
            <p>이 글의 답을 먼저 적겠습니다. KV를 8비트로 저장하면 같은 pool에 token이 두 배 들어갑니다. 대신 값을 쓸 때 scale로 나눠 넣고 attention이 읽을 때 곱해 되돌리는 두 지점이 새로 생깁니다. 그리고 scale을 얼마나 잘게 나눠 두느냐가 정확도와 부가 저장량을 맞바꿉니다.</p>
            <p>이 답을 token 하나의 byte 장부, key 원소 네 개의 왕복 계산, vLLM의 실제 쓰기 kernel 순서로 따라갑니다. 마지막에는 TensorRT-LLM과 llama.cpp, 그리고 key와 value를 다른 방향으로 묶는 KIVI가 같은 질문에 어떻게 다르게 답하는지 비교합니다.</p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 쓰는 kernel과 읽는 kernel 사이에 scale 하나가 끼어듭니다</h2>
          <div className={prose}>
            <p>바깥에서 보면 입력과 출력은 그대로입니다. 모델은 BF16으로 K와 V를 계산하고, attention은 그 K·V를 읽어 BF16 결과를 냅니다. 바뀌는 것은 둘 사이의 보관 형식뿐입니다. 저장할 때는 8비트로 줄이고, 읽을 때는 다시 계산용 형식으로 늘립니다.</p>
            <p>줄였다 늘린 값이 원래 값과 똑같지는 않습니다. 8비트로는 담을 수 있는 수의 개수가 256개뿐이라 그 사이의 값은 가까운 칸으로 옮겨집니다. 그래서 이 상자의 계약은 "같은 값"이 아니라 "가까운 값"입니다. 얼마나 가까운지는 어떤 칸 배치를 쓰고 값을 어느 비율로 줄여 넣는지에 달려 있습니다.</p>
            <p>KV를 처음 만드는 계산, 곧 prefill과 decode의 행렬곱은 이 상자 밖에 있습니다. 가중치를 8비트로 바꾸는 일과도 다릅니다. KV가 무엇이고 왜 token마다 쌓이는지는 <a href="/cs/ai/kv-cache-fundamentals#kv-shape">KV cache 기초</a>에서 다뤘으므로 여기서는 저장 형식만 봅니다.</p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. token 하나의 KV는 128KiB에서 64KiB가 됩니다</h2>
          <div className={prose}>
            <p>층 32개, KV head 8개, head 폭 128인 GQA 모델을 가정합니다. (가정) query head는 더 많지만 KV를 저장하는 head는 8개뿐이라는 점이 GQA입니다. token 하나가 한 층에 남기는 칸은 K head 8개와 V head 8개입니다.</p>
            <p>칸 하나에는 숫자 128개가 있습니다. BF16이면 숫자 하나가 2 byte라 칸 하나가 256 byte입니다. 한 층은 16칸이라 4,096 byte, 32층이면 131,072 byte, 곧 128KiB입니다. 숫자 하나를 1 byte로 저장하면 칸의 개수는 그대로이고 칸의 폭만 절반이 되어 64KiB입니다.</p>
            <p>KV에 40GiB를 쓸 수 있다면 BF16은 327,680 token, FP8은 655,360 token을 담습니다. 요청 하나가 평균 4,096 token을 쓴다면 동시에 붙잡을 수 있는 요청이 80개에서 160개로 늘어나는 셈입니다. (가정) 이 계산에는 scale 저장량과 block 끝의 빈칸을 넣지 않았습니다. 그 둘은 7절에서 다시 셉니다.</p>
          </div>
          <CalculationWalkthrough
            title="token 하나의 KV byte"
            question="같은 40GiB pool에 BF16과 FP8은 각각 몇 token을 담을까요?"
            scope="KV head 8개를 가진 32층 GQA 모델의 K·V 본체만 셉니다. scale, block padding, 가중치와 작업 공간은 넣지 않습니다."
            steps={[
              { label: "head 한 칸", expression: "128 원소 × 2 byte", result: "256 byte", reason: "head 폭 128개의 숫자를 BF16으로 저장합니다." },
              { label: "한 층", expression: "2(K·V) × 8 head × 256 byte", result: "4,096 byte", reason: "K와 V가 각각 KV head 8칸씩 있으므로 16칸입니다." },
              { label: "token 하나", expression: "32 층 × 4,096 byte", result: "131,072 byte = 128KiB", reason: "모든 층이 이 token의 K·V를 따로 저장합니다." },
              { label: "FP8", expression: "131,072 ÷ 2", result: "65,536 byte = 64KiB", reason: "칸의 개수는 같고 원소 하나가 1 byte가 됩니다." },
              { label: "pool 40GiB", expression: "42,949,672,960 ÷ 131,072 · ÷ 65,536", result: "327,680 · 655,360 token", reason: "같은 byte 예산을 token 하나의 크기로 나눕니다." },
            ]}
            conclusion="같은 pool에 FP8 KV는 BF16의 정확히 두 배 token을 담습니다. scale과 padding을 더하면 이 비율이 조금 줄어듭니다."
            caveats={["층·head 수는 가정입니다. 실제 모델 설정으로 다시 셉니다.", "token 수가 두 배라는 것이 처리량 두 배를 뜻하지는 않습니다(13절)."]}
          />
          <KvByteLedgerViz />
        </section>

        <section id="round-trip" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 네 값을 나눴다 곱하면 큰 값 하나만 크게 틀어집니다</h2>
          <div className={prose}>
            <p>같은 head의 key 원소 네 개 0.47, −1.3, 3.1, 12.0을 저장한다고 합시다. 서버가 처음 몇 개의 요청에서 본 가장 큰 절댓값은 4.0이었고, 12.0은 그 뒤에 처음 나타났습니다. (가정) 저장할 때 쓸 비율은 4.0을 200에 맞추도록 0.02로 정했습니다.</p>
            <p>쓰는 쪽은 각 값을 0.02로 나눠 23.5, −65, 155, 600을 얻습니다. 8비트 부동소수점 형식은 이 수들을 그대로 담지 못하고 가까운 칸에 맞춥니다. 16과 32 사이는 2 간격이라 23.5는 24, 64와 128 사이는 8 간격이라 −65는 −64, 128과 256 사이는 16 간격이라 155는 160이 됩니다. 이 형식이 담을 수 있는 가장 큰 수는 448이라 600은 448에서 멈춥니다.</p>
            <p>읽는 쪽은 저장된 수에 0.02를 곱합니다. 0.48, −1.28, 3.2, 8.96입니다. 작은 세 값의 오차는 0.01, 0.02, 0.10으로 원래 크기의 2~3%입니다. 12.0은 8.96으로 돌아와 3.04, 25%가 사라집니다. 간격 때문에 생긴 작은 오차와 상한에 걸려 생긴 큰 오차는 원인이 다릅니다.</p>
            <p>큰 값이 늘 같은 채널에서 나온다면 그 채널에만 다른 비율을 줄 수 있습니다. 12.0을 200에 맞춰 0.06을 쓰면 200은 192로 저장되고 11.52로 돌아와 오차가 0.48로 줄어듭니다. 비율을 몇 개 두느냐가 7절의 질문입니다.</p>
          </div>
          <QuantRoundTripViz />
        </section>

        <section id="why-scale" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. FP8은 비율 없이도 저장되지만 448을 넘는 값은 잘립니다</h2>
          <div className={prose}>
            <p>비율을 1로 두면 어떨까요? 8비트 부동소수점은 지수 자리가 있어 0.47은 0.46875, −1.3은 −1.25, 3.1은 3.0, 12.0은 12로 저장됩니다. 상대 오차가 몇 %에 머뭅니다. 값의 크기가 달라져도 칸 간격이 함께 커지고 작아지기 때문입니다. 그래서 FP8 KV는 보정 없이 켜도 바로 망가지지 않습니다.</p>
            <p>8비트 정수는 사정이 다릅니다. 정수 칸은 −127부터 127까지 간격 1로 고정이라 비율 1로 넣으면 0.47은 0, −1.3은 −1이 됩니다. 비율을 4.0÷127로 잡으면 작은 값은 잘 맞지만 12.0은 127에서 잘려 4.0으로 돌아옵니다. 정수 형식에서는 비율이 칸 간격 자체를 정하므로 보정이 필수입니다.</p>
            <p>FP8에서도 비율이 하는 일은 남아 있습니다. 바로 담을 수 있는 범위를 값에 맞추는 일입니다. E4M3 형식은 지수 4비트와 가수 3비트로 448까지 담고, E5M2는 지수 5비트와 가수 2비트로 57,344까지 담는 대신 칸이 더 거칩니다.</p><p>FP8에서는 scale을 두 배로 키워도 0.47·−1.3·3.1의 상대 오차는 거의 그대로입니다. 칸 간격이 값과 함께 줄어들기 때문입니다. 대가가 생기는 곳은 아주 작은 값 쪽입니다. x ÷ s가 2⁻⁶보다 작아지면 E4M3의 정규 범위를 벗어나 간격 2⁻⁹의 고정 칸으로 떨어집니다. 형식별 칸 배치는 <a href="/cs/ai/quantization-formats-and-granularity#floating-point-formats">부동소수점 양자화 형식</a>에서 자세히 봅니다.</p>
          </div>
        </section>

        <section id="names" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 쓰기 양자화와 읽기 역양자화 사이의 비율을 scale이라고 부릅니다</h2>
          <div className={prose}>
            <p>KV를 낮은 정밀도로 보관하는 방법 전체를 KV cache 양자화(KV cache quantization)라고 합니다. 값을 나눠 8비트에 넣는 쓰기 단계가 양자화(quantize), 저장값에 곱해 계산용 형식으로 되돌리는 읽기 단계가 역양자화(dequantize)입니다.</p>
            <p>둘이 함께 쓰는 비율이 scale입니다. 앞 절의 0.02가 key의 scale이고, value에도 따로 scale이 있습니다. 쓰기와 읽기가 같은 scale을 써야 값이 제자리로 돌아옵니다. 처음 몇 batch에서 최댓값을 보고 scale을 정하는 일을 보정(calibration)이라고 부르고, 상한을 넘은 값을 최댓값에 멈추는 동작을 포화(saturation)라고 부릅니다.</p>
          </div>
          <ExplainedFormula
            question="key 원소 하나가 저장됐다가 읽힐 때 어떤 값이 됩니까?"
            idea="쓰기는 scale로 나눈 값을 FP8 칸에 맞추고, 읽기는 그 칸의 값에 같은 scale을 곱합니다."
            formula={"\\hat{x}=s\\cdot\\operatorname{sat}_{448}\\!\\big(\\operatorname{round}_{\\text{E4M3}}(x/s)\\big),\\qquad s=\\frac{\\max|x_{\\text{calib}}|}{r}"}
            annotatedFormula={"\\begin{aligned}\\hat{x}&=\\underbrace{s}_{\\text{읽기: 다시 곱함}}\\cdot\\underbrace{\\operatorname{sat}_{448}\\!\\big(\\operatorname{round}_{\\text{E4M3}}(\\overbrace{x/s}^{\\text{쓰기: 나눔}})\\big)}_{\\text{저장된 8비트 값}}\\\\s&=\\frac{\\overbrace{\\max|x_{\\text{calib}}|}^{\\text{보정 때 본 최댓값}}}{\\underbrace{r}_{\\text{최댓값을 놓을 자리}}}\\end{aligned}"}
            operations={[
              { expression: "x/s", annotation: ["12.0 ÷ 0.02 = 600입니다.", "E4M3의 상한 448을 넘습니다."] },
              { expression: "\\operatorname{sat}_{448}(\\operatorname{round}_{\\text{E4M3}}(x/s))", annotation: ["155는 가장 가까운 칸 160으로,", "600은 포화로 448이 됩니다."] },
              { expression: "s\\cdot(\\cdot)", annotation: ["448 × 0.02 = 8.96으로 돌아옵니다."] },
              { expression: "\\max|x_{\\text{calib}}|/r", annotation: ["4.0 ÷ 200 = 0.02입니다.", "vLLM은 key에 r = 200, value에 r = 100을 씁니다."] },
            ]}
            terms={[
              { symbol: "x", name: "원래 값", description: "BF16으로 계산한 key 또는 value 원소 하나입니다." },
              { symbol: "s", name: "scale", description: "쓰기와 읽기가 같이 쓰는 비율입니다. tensor·head·block 단위로 하나씩 둡니다." },
              { symbol: "r", name: "최댓값을 놓을 자리", description: "448보다 작게 두어 보정 뒤 더 큰 값이 와도 여유를 남깁니다." },
              { symbol: "\\hat{x}", name: "읽힌 값", description: "attention이 실제로 쓰는 근사값입니다." },
            ]}
            assumptions={["E4M3 반올림은 가장 가까운 칸, 중간이면 짝수 쪽입니다.", "scale은 보정 뒤 고정입니다. 실행 중에 다시 계산하지 않습니다."]}
            interpretation="작은 값의 오차는 칸 간격에서, 큰 값의 오차는 상한에서 나옵니다. r을 200에서 100으로 줄이면 s=0.04가 되어 12.0은 300→288→11.52로 돌아오고, 작은 세 값은 0.48·−1.28·3.2로 그대로입니다. FP8에서 r은 상한 여유와 아주 작은 값의 정규 범위 이탈을 맞바꿉니다."
          />
        </section>

        <section id="granularity" data-teach-level="4" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. scale을 잘게 둘수록 오차는 줄고 부가 저장량은 늘어납니다</h2>
          <div className={prose}>
            <p>4절의 사례에서 12.0을 망가뜨린 것은 scale이 하나뿐이라는 사실이었습니다. 큰 값과 작은 값이 같은 scale을 쓰면 둘 중 하나는 불리합니다. scale을 여러 개 두어 값이 비슷한 원소끼리 묶으면 이 충돌이 줄어듭니다. 대신 scale도 메모리에 저장해야 합니다.</p>
            <p>tensor 하나에 scale 하나를 두면 층마다 K와 V에 숫자 둘이라 부가 저장량은 사실상 0입니다. head마다 두면 층마다 KV head 수만큼이고 여전히 작습니다. llama.cpp의 q8_0처럼 원소 32개마다 2 byte scale을 붙이면 원소당 1.0625 byte가 되어 본체보다 6.25% 큽니다. 묶음이 작을수록 scale의 몫이 커집니다.</p>
            <p>묶는 방향도 묶음 크기만큼 중요합니다. 큰 값이 특정 채널에 계속 나타난다면 token을 따라 묶은 scale은 그 채널을 피하지 못합니다. 채널을 따라 묶어야 큰 채널만 따로 떼어 낼 수 있습니다. 묶는 방향에 대한 일반 규칙은 <a href="/cs/ai/ptq-calibration#scale-granularity">scale 단위</a>에 있고, 이 글은 KV에서 그 선택이 왜 key와 value에서 갈리는지를 12절에서 봅니다.</p>
          </div>
          <CalculationWalkthrough
            title="scale 단위별 원소당 byte"
            question="head 폭 128인 KV에서 scale을 어디에 두느냐에 따라 원소당 byte가 얼마나 늘까요?"
            scope="scale 하나를 FP16 2 byte로 저장한다고 봅니다. per-tensor·per-head scale은 층마다 몇 개뿐이라 원소당 몫을 0으로 둡니다."
            steps={[
              { label: "per-tensor FP8", expression: "1 byte + 0", result: "1.0 byte/원소", reason: "층마다 K·V scale이 하나씩입니다. vLLM 기본과 TensorRT-LLM이 이 단위입니다." },
              { label: "q8_0 block", expression: "(2 + 32) ÷ 32", result: "1.0625 byte/원소", reason: "원소 32개와 FP16 scale 하나가 한 block입니다." },
              { label: "q4_0 block", expression: "(2 + 16) ÷ 32", result: "0.5625 byte/원소", reason: "4비트 32개는 16 byte이고 scale 2 byte가 붙습니다." },
              { label: "head 하나", expression: "128 × 1.0625 · 128 × 0.5625", result: "136 · 72 byte", reason: "BF16 256 byte와 비교하면 53%와 28%입니다." },
            ]}
            conclusion="block scale은 큰 값을 가까운 원소 32개 안에 가두는 대신 원소당 1/16 byte를 더 씁니다."
            caveats={["실제 kernel은 정렬 때문에 더 큰 단위로 저장할 수 있습니다.", "KIVI의 비대칭 2비트는 scale과 zero를 함께 저장해 별도로 셉니다(12절)."]}
          />
          <ScaleGranularityViz />
        </section>

        <section id="trace" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. token 하나의 key는 보정, 쓰기, 읽기 세 번 scale을 만납니다</h2>
          <div className={prose}>
            <p>vLLM에 kv_cache_dtype=fp8과 calculate_kv_scales=True를 주었다고 합시다. 서버가 뜰 때 warmup으로 첫 batch를 한 번 실행합니다. 각 attention 층은 이 batch의 key에서 가장 큰 절댓값 4.0을 찾아 k_scale = 4.0 ÷ 200 = 0.02를 정하고 다시는 계산하지 않습니다.</p>
            <p>요청이 들어와 새 token의 key가 나오면 쓰기 kernel이 slot 주소를 구합니다. block 번호와 block 안 위치를 계산하는 방법은 BF16일 때와 똑같습니다. 다른 점은 값을 복사하는 순간 0.02로 나눠 FP8로 바꾼다는 것뿐입니다. 이때 12.0은 448로 저장됩니다.</p>
            <p>다음 decode step에서 attention kernel이 이 block을 읽습니다. 저장된 448을 계산용 형식으로 바꾸고 0.02를 곱해 8.96을 씁니다. query와 곱해 점수를 만드는 일은 그 뒤입니다. 그러니 이 token의 점수는 원래 12.0 대신 8.96으로 계산됩니다. 오차가 다음 token의 확률에 얼마나 번지는지는 모델과 입력에 따라 달라 이 산수로 정할 수 없습니다.</p>
          </div>
        </section>

        <section id="scale-source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. vLLM은 첫 batch의 최댓값을 200 자리에 놓습니다</h2>
          <div className={prose}>
            <p>vLLM v0.27.1(commit 6e448d0)의 attention.py 124–150행은 scale을 따로 정하지 않은 층에 k·v scale 1.0을 넣습니다. 같은 함수가 envs.py의 상수를 읽어 k_range 200, v_range 100을 붙입니다. 보정 없이 fp8만 켜면 5절의 비율 1 경로입니다.</p>
            <p>584–594행의 calc_kv_scales는 key 전체의 최댓값을 k_range로, value 전체의 최댓값을 v_range로 나눕니다. 4.0이면 0.02입니다. 마지막 줄이 calculate_kv_scales를 False로 바꾸므로 보정은 한 번뿐입니다. warmup batch가 실제 요청보다 작은 값만 담았다면 그 뒤의 큰 값은 4절처럼 상한에 걸립니다.</p>
            <p>공식 문서는 세 방식을 구분합니다. 보정하지 않으면 scale이 1.0이고, calculate_kv_scales는 warmup 중 임의 token 한 batch로 한 번 정하며, 권장 방식은 llm-compressor로 데이터셋을 돌려 scale을 정해 checkpoint에 넣는 것입니다. head마다 scale을 두는 방식은 이 마지막 경로와 FlashAttention backend에서만 쓸 수 있다고 적습니다.</p>
          </div>
          {code("scale-defaults", "보정 전 기본 scale 1.0과 range 상수")}
          {code("calc-scales", "첫 batch에서 scale을 한 번 정하는 원문")}
          {code("scale-constants", "K 200, V 100 상수")}
          <div id="paper-vllm-kvcache" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="vLLM docs · Quantized KV Cache (2026-10-14 확인)" citeKey={1} href="https://docs.vllm.ai/en/latest/features/quantization/quantized_kvcache/">
              <q>All quantization scales are set to 1.0.</q> 보정하지 않은 경로에 대한 설명입니다. 같은 문서는 per-tensor와 per-attention-head 두 방식, calculate_kv_scales, llm-compressor 보정, fp8_e4m3·fp8_e5m2 선택지, sliding-window 층을 제외하는 kv-cache-dtype-skip-layers를 함께 다룹니다.
            </CitationBlock>
          </div>
        </section>

        <section id="write-kernel" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 쓰기 kernel은 주소 계산을 그대로 두고 값만 바꿉니다</h2>
          <div className={prose}>
            <p>cache_kernels.cu의 reshape_and_cache_flash_kernel(314–399행)은 token 하나를 thread block 하나가 맡습니다. 327–344행이 slot_mapping으로 block과 위치를 구해 목적지 포인터를 만듭니다. 이 부분에는 양자화가 없습니다. KV 양자화를 켜도 PagedAttention의 주소 체계는 바뀌지 않는다는 뜻입니다.</p>
            <p>351–363행은 scale이 하나일 때입니다. 모든 head가 같은 k_scale을 쓰고, 241–252행의 CopyWithScaleOp가 원소마다 scaled_convert를 부릅니다. 364–397행은 scale이 head마다 있을 때로, warp 하나가 head 하나를 맡아 그 head의 scale을 씁니다. 852–856행은 scale 모양이 [1] 또는 [num_heads]가 아니면 멈춥니다.</p>
            <p>실제 변환은 quant_utils.cuh에 있습니다. 303–307행 주석이 "FP8 = Quantize(HP ÷ scale), HP = Dequant(FP8) × scale"이라는 약속을 적고, 480–488행이 half 값을 scale로 나눈 뒤 __NV_SATFINITE로 변환합니다. 이 플래그 때문에 600은 무한대가 되지 않고 448에서 멈춥니다. 읽기 쪽 317–324행은 FP8을 half로 바꾼 뒤 scale을 곱합니다.</p>
          </div>
          {code("write-kernel", "slot 주소와 FP8 쓰기")}
          {code("scale-op", "원소 하나의 복사·변환")}
          {code("fp8-write", "나누고 포화시키는 변환")}
          {code("fp8-convention", "나누기·곱하기 규약과 읽기 변환")}
          {code("scale-shape-check", "scale 모양 [1] 또는 [num_heads]")}
        </section>

        <section id="engines" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 엔진마다 scale을 두는 단위가 다릅니다</h2>
          <div className={prose}>
            <p>TensorRT-LLM의 attention 문서는 INT8과 FP8 KV를 지원하며 scale은 kv_cache_scaling_factor 하나, 모양 [1]이라고 적습니다. 쓸 때는 fp_value × (1.0 ÷ kv_cache_scaling_factor)로 곱셈 하나로 나누기를 대신하고, 읽을 때는 quantized_value × kv_cache_scaling_factor입니다.</p><p>나머지 신경망이 8비트여도 attention 연산자의 입출력은 FP32·FP16·BF16이라는 점도 함께 밝힙니다.</p>
            <p>같은 문서에서 generation 단계의 XQA kernel은 FP16·BF16·FP8·INT8 KV를 받습니다. TensorRT-LLM의 KV 관리와 kernel 선택 전체는 <a href="/cs/ai/tensorrt-llm-kv-cache-and-kernels">TensorRT-LLM의 KV cache와 kernel</a>에서 vLLM과 비교합니다.</p>
            <p>llama.cpp는 -ctk와 -ctv로 K와 V 형식을 따로 정하고, q8_0, q4_0, q4_1, iq4_nl, q5_0, q5_1을 허용합니다. 이 형식들은 가중치 양자화와 같은 block 구조라 원소 32개마다 FP16 scale이 붙습니다. 7절의 1.0625 byte와 0.5625 byte가 여기서 나옵니다.</p>
            <p>llama-context.cpp 4063–4072행은 V를 양자화하려면 Flash Attention이 켜져 있어야 한다고 강제합니다. auto면 켜 주고, 꺼 두라고 했으면 context 생성을 거부합니다. 4074–4092행은 head 폭이 block 크기 32로 나누어떨어지는지 층마다 확인합니다. 같은 KV 양자화라도 엔진마다 scale 단위와 함께 쓰는 kernel 조건이 다릅니다.</p>
          </div>
          {code("q8-block", "q8_0·q4_0 block 구조")}
          {code("v-needs-fa", "V 양자화에 필요한 Flash Attention 조건")}
          <div id="paper-trtllm-kv-quant" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="TensorRT-LLM docs · Attention · INT8/FP8 KV Caches (2026-10-14 확인)" citeKey={2} href="https://nvidia.github.io/TensorRT-LLM/features/attention.html">
              <q>only per-tensor quantization is supported in the current version</q> kv_cache_scaling_factor의 모양은 [1]이고, 양자화는 역수 곱으로, 역양자화는 scale 곱으로 정의합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="kivi" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. key와 value는 큰 값이 몰리는 방향이 달라 다르게 묶습니다</h2>
          <div className={prose}>
            <p>8비트에서는 scale 하나로도 버틸 만하지만 2비트까지 내리면 칸이 네 개뿐이라 묶는 방법이 결과를 가릅니다. KIVI(ICML 2024)는 Llama-2-13B와 Falcon-7B의 KV 크기를 그려 보고 key에는 몇몇 고정된 채널에 아주 큰 값이 있고 value에는 뚜렷한 패턴이 없다고 보고합니다.</p>
            <p>그래서 key는 채널 방향으로 묶습니다. 큰 채널이 자기 scale을 가지면 다른 채널의 칸을 넓히지 않습니다. 4절에서 12.0이 든 채널에만 0.06을 준 것과 같은 생각입니다.</p><p>value는 token 방향으로 묶습니다. attention 출력은 token별 점수로 value를 섞은 합인데, 점수가 몇몇 중요한 token에 몰려 있습니다. token 방향으로 묶으면 다른 token의 오차가 중요한 token의 value에 섞여 들어가지 않습니다. 논문의 Table 2는 이 배치에서 출력의 상대 오차가 채널 방향보다 15배 가까이 작다고 보고합니다.</p>
            <p>채널 방향으로 묶으려면 token이 여러 개 모여야 합니다. KIVI는 묶음 크기 G = 32와 최근 R = 128 token을 원래 정밀도로 두는 residual 구간을 씁니다. token이 R개 쌓이면 묶어서 2비트로 바꿉니다. 논문은 이 방식으로 모델 가중치를 포함한 최대 메모리를 2.6배 줄이고, batch를 최대 4배 키워 처리량이 2.35~3.47배가 되었다고 보고합니다. 저자들의 측정이며 이 글이 재현한 값은 아닙니다.</p>
            <p>vLLM의 쓰기 kernel은 10절에서 본 대로 scale 모양을 [1] 또는 [num_heads]로만 받습니다. KIVI식 채널·token 묶음과 residual 구간은 그 경로에 그대로 들어가지 않는 별도 구현입니다.</p>
          </div>
          <div id="paper-kivi" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Liu 외 · KIVI: A Tuning-Free Asymmetric 2bit Quantization for KV Cache · ICML 2024 (PMLR 235)" citeKey={3} href="https://arxiv.org/abs/2402.02750">
              <q>the key cache should be quantized per-channel</q> 같은 초록은 value를 per-token으로 양자화해야 한다고 결론 내립니다. 본문 §4.1은 G = 32, R = 128을 모든 실험에 썼다고 적습니다. 2.6배·4배·2.35~3.47배는 Llama·Falcon·Mistral에 대한 저자 보고입니다.
            </CitationBlock>
          </div>
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. 두 배의 자리는 두 배의 처리량이나 같은 품질을 보장하지 않습니다</h2>
          <div className={prose}>
            <p>3절의 두 배는 pool에 들어가는 token 수입니다. 실제 처리량은 동시에 돌리는 요청이 늘어도 행렬곱과 scheduler가 따라오는지에 달려 있습니다. decode attention은 매 step마다 KV를 읽으므로 읽을 byte가 절반이 되면 그 부분이 빨라질 수 있습니다. 다만 역양자화 연산이 더해지므로 얼마나 빨라지는지는 kernel과 GPU에서 측정해야 합니다. (가정)</p>
            <p>품질도 모델마다 다릅니다. vLLM 문서는 sliding-window 층이 KV 양자화에 더 민감하다며 그 층만 원래 형식으로 두는 kv-cache-dtype-skip-layers를 제공합니다. FlashAttention 3 backend에서 FP8 KV를 쓰면 query까지 FP8로 바꿔 계산한다는 점도 적습니다. 같은 kv_cache_dtype=fp8이라도 backend에 따라 바뀌는 범위가 다릅니다.</p>
            <p>운영에서 확인할 순서는 이렇습니다. 먼저 scale이 어디서 왔는지 봅니다. 기본 1.0인지, warmup 한 batch인지, 데이터셋 보정인지에 따라 4절의 포화 위험이 다릅니다.</p><p>그다음 같은 평가 세트로 BF16 KV와 출력 분포를 비교하고, 마지막으로 늘어난 token 자리가 실제 동시 요청 수와 지연에 어떻게 반영되는지 잽니다. sliding-window 층의 KV가 어떻게 버려지는지는 <a href="/cs/ai/sliding-window-kv-and-attention-sinks">sliding window KV와 attention sink</a>에서 이어집니다.</p>
          </div>
          <ContentBoundary article="kv-cache-quantization" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">14. 같은 사례로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>warmup에서 본 최댓값이 4.0이 아니라 16.0이었다면 12.0과 0.47은 각각 어떻게 저장되고 돌아올까요? 어느 쪽 오차가 커지나요? (답: 4절, 6절)</p>
            <p>같은 40GiB pool을 llama.cpp q8_0 KV로 채우면 BF16 대비 몇 배의 token이 들어갈까요? FP8 per-tensor와 무엇이 다른가요? (답: 7절)</p>
            <p>key와 value를 모두 token 방향으로 묶은 2비트 KV가 KIVI보다 불리한 이유를 큰 채널의 위치로 설명해 보세요. (답: 12절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={kvQuantTrees}
        projectMetas={{
          vllm: { id: "vllm", label: "vLLM v0.27.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          "llama.cpp": { id: "llama.cpp", label: "llama.cpp 고정 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
