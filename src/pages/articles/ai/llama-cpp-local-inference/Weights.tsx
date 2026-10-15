import { Link } from "react-router-dom";
import { CodeViewButton } from "@/components/code";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import Q4KBlockViz from "./viz/Q4KBlockViz";
import Q4KIntegerDotViz from "./viz/Q4KIntegerDotViz";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

interface Props {
  code: (key: string) => void;
}

export default function Weights({ code }: Props) {
  return (
    <>
      <section id="k-quant-block" data-teach-level="6" data-calculation-explained className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">11. Q4_K는 가중치 256개를 배율 16 byte와 4비트 값 128 byte에 담습니다</h2>
        <div className={prose}>
          <p>
            KV를 정했으니 가중치로 넘어갑니다. 1절의 16GB는 가중치 8.03 × 10⁹개를 2 byte씩 둔 크기입니다. 6GB GPU에 넣으려면 값 하나를 1 byte보다 훨씬
            작게 담아야 합니다. 정수로 줄이는 일반 원리, 곧 배율 하나와 정수 값으로 실수를 근사하는 방법은{" "}
            <Link to="/cs/ai/quantization-formats-and-granularity#granularity">양자화 단위</Link>에서 다뤘습니다. 여기서는 llama.cpp가 그 배율을 어떻게 묶는지만
            봅니다.
          </p>
          <p>
            GGUF는 llama.cpp가 쓰는 모델 파일 형식이고, 그 안에서 가중치는 블록 단위 양자화 형식으로 저장됩니다. 파일 형식과 양자화 방법이 서로 다른 층이라는
            구분은{" "}
            <Link to="/cs/ai/weight-only-quantization#artifact-boundary">가중치 양자화 글</Link>에 있습니다. 이 글이 보는 형식은 이름에 K가 붙은 K-quant 중
            Q4_K입니다.
          </p>
          <p>
            Q4_K는 가중치 256개를 super-block 하나로 묶고 그 안을 32개씩 작은 블록 8개로 나눕니다. 작은 블록마다 배율 sc와 빼는 값 m이 있고 값 하나는 0~15의
            4비트 정수 q입니다. 실수는 d·sc·q − dmin·m으로 되돌립니다. sc와 m을 6비트로 줄이고 super-block 전체의 배율 d와 dmin 두 개만 f16으로
            둡니다.
          </p>
        </div>
        <Q4KBlockViz />
        <CalculationWalkthrough
          title="Q4_K super-block과 8B 모델 전체의 byte"
          question="가중치 256개는 몇 byte이고, 8B 모델 전체는 몇 GB일까요?"
          scope="모든 텐서를 Q4_K 하나로 둔다고 가정합니다. 실제 GGUF 파일은 텐서마다 Q6_K 등 다른 형식을 섞어 이보다 큽니다."
          steps={[
            { label: "배율 두 개", expression: "d 2 byte + dmin 2 byte", result: "4 byte", reason: "super-block 전체에 하나씩 있는 f16 배율입니다." },
            { label: "작은 블록 배율", expression: "(8 sc + 8 m) × 6비트", result: "96비트 = 12 byte", reason: "작은 블록 8개가 sc와 m을 하나씩 가집니다. 6비트로 줄여 12 byte에 빽빽이 넣습니다." },
            { label: "값", expression: "256 × 4비트", result: "128 byte", reason: "값 두 개가 byte 하나를 나눠 씁니다." },
            { label: "블록 합", expression: "4 + 12 + 128", result: "144 byte", reason: "원문의 static_assert가 확인하는 크기와 같습니다." },
            { label: "값당 비트", expression: "144 × 8 ÷ 256", result: "4.5비트", reason: "4비트 값에 배율 몫 0.5비트가 붙습니다." },
            { label: "모델 전체", expression: "8,030,261,248 × 144 ÷ 256", result: "약 4.52 GB", reason: "가중치 수는 공개 설정값으로 embedding·층·출력층을 더한 값입니다." },
          ]}
          conclusion="Q4_K는 F16 512 byte를 144 byte로 줄여 28.1%가 됩니다. 8B 모델은 약 4.52GB입니다."
          caveats={["Q8_0은 34 byte × 8 = 272 byte, 같은 모델 약 8.53GB입니다.", "정확도 손실은 이 계산에 들어 있지 않습니다."]}
        />
        <div className={prose}>
          <p>
            가중치 수 8,030,261,248은 설정값으로 직접 셌습니다. embedding과 출력층이 각각 128,256 × 4,096이고 층 하나가 attention
            41,943,040개와 MLP 176,160,768개에 norm 8,192개를 더한 218,112,000개입니다. 층 32개와 출력 norm 4,096개까지 더하면 이 수가
            됩니다.
          </p>
        </div>
        <CodeViewButton label="Q4_K 블록 선언과 144 byte 검사" onClick={() => code("q4k-block")} />
      </section>

      <section id="integer-dot" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">12. 활성값도 int8로 바꾸면 곱셈을 정수로 끝내고 배율은 마지막에 한 번 곱합니다</h2>
        <div className={prose}>
          <p>
            4비트로 저장했다고 계산까지 4비트로 하는 것은 아닙니다. 가장 쉬운 길은 가중치를 실수로 되돌린 뒤 곱하는 것이지만 그러면 값마다 곱셈과 뺄셈이 한 번씩 더 듭니다.
            llama.cpp의 CUDA 경로는 활성값을 32개마다 int8 값과 배율 d8로 바꾼 q8_1 블록을 만든 뒤, 정수끼리 먼저 곱합니다.
          </p>
          <p>
            작은 예로 확인합니다. 4비트 값 q = [3, 0, 15, 7], 배율 d = 0.5, sc = 2, dmin = 0.25, m = 1이라 합시다. (가정) 실수 가중치는 [2.75, −0.25, 14.75,
            6.75]입니다. 활성값은 int8 u = [1, −2, 3, 4]와 d8 = 0.1로, 실수 [0.1, −0.2, 0.3, 0.4]입니다. 실수끼리 곱해 더하면 7.45입니다.
          </p>
          <p>
            정수 경로는 먼저 q와 u를 곱해 더해 76을 얻고 u만 더해 6을 얻습니다. 76에는 d와 sc를, 6에는 dmin과 m을 곱해 빼면 74.5이고 마지막으로 d8을 곱하면
            같은 7.45입니다. 실수 곱셈은 값 4개에 한 번씩이 아니라 블록마다 몇 번으로 줄었습니다.
          </p>
        </div>
        <Q4KIntegerDotViz />
        <ExplainedFormula
          question="4비트 가중치와 int8 활성값의 내적을 정수 합 두 개로 어떻게 쓸 수 있을까요?"
          idea="가중치를 배율·정수·빼는 값으로 펼치면 배율은 합 밖으로 나가고, 합 안에는 정수 곱과 정수 합만 남습니다."
          formula={String.raw`y=\sum_{j} d_{8,j}\left(d\,sc_j\sum_{k\in j}q_k u_k-d_{min}\,m_j\sum_{k\in j}u_k\right)`}
          annotatedFormula={String.raw`\begin{aligned}y=\sum_{j}\underbrace{d_{8,j}}_{\text{활성값 배율}}\bigl(&\underbrace{d\,sc_j}_{\text{가중치 배율}}\underbrace{\sum_{k\in j}q_k u_k}_{\text{정수 곱의 합}}\\&-\underbrace{d_{min}\,m_j}_{\text{빼는 값}}\underbrace{\sum_{k\in j}u_k}_{\text{활성값 합}}\bigr)\end{aligned}`}
          operations={[
            { expression: String.raw`\sum_{k\in j}q_k u_k`, annotation: ["[3,0,15,7]과 [1,−2,3,4]를 곱해 더하면", "3 + 0 + 45 + 28 = 76입니다."] },
            { expression: String.raw`\sum_{k\in j}u_k`, annotation: ["min 항에 곱할 활성값 합은", "1 − 2 + 3 + 4 = 6입니다."] },
            { expression: String.raw`d\,sc_j\cdot 76-d_{min}\,m_j\cdot 6`, annotation: ["d·sc = 1, dmin·m = 0.25이므로", "76 − 1.5 = 74.5입니다."] },
            { expression: String.raw`d_{8,j}\cdot 74.5`, annotation: ["활성값 배율 0.1을 마지막에 곱하면", "실수로 계산한 값과 같은 7.45입니다."] },
          ]}
          terms={[
            { symbol: "q_k", name: "4비트 가중치 값", description: "0~15의 정수입니다. Q4_K 블록의 qs에 두 개씩 들어 있습니다." },
            { symbol: "u_k", name: "int8 활성값", description: "q8_1 블록의 qs입니다. 실수 활성값을 d8로 나눠 반올림한 정수입니다." },
            { symbol: "j", name: "작은 블록 번호", description: "32개 단위입니다. 가중치의 sc·m과 활성값의 d8이 같은 32개를 덮습니다." },
            { symbol: "d,\\,d_{min}", name: "super-block 배율", description: "256개 전체에 하나씩 있는 f16 값입니다." },
            { symbol: "sc_j,\\,m_j", name: "작은 블록 배율", description: "6비트 정수로 저장된 블록별 배율과 빼는 값입니다." },
          ]}
          assumptions={["예시는 작은 블록 하나에 값 4개만 넣은 축소입니다. 실제 블록은 32개입니다.", "활성값을 int8로 바꾸며 생기는 반올림 오차는 0으로 두었습니다."]}
          interpretation="정수 곱의 합과 정수 합만 있으면 블록 하나의 결과가 나옵니다. 이 식은 같은 값을 다르게 계산하는 순서이며 양자화 자체의 오차를 줄이지 않습니다."
        />
        <div className={prose}>
          <p>
            정수 곱의 합은 dp4a라는 GPU 명령 하나가 맡습니다. 32비트 레지스터 두 개를 byte 네 칸씩으로 보고 네 쌍을 곱해 더한 뒤 누적값에 더합니다. 위 76이 dp4a
            한 번의 결과입니다. 4비트 값 여덟 개가 든 32비트에서 0x0F0F0F0F로 네 개를 byte 칸에 꺼내 놓는 줄이 그 앞에 있습니다.
          </p>
          <p>
            활성값 합 6도 같은 명령으로 구합니다. 가중치 자리에 1 네 개를 넣으면 dp4a가 u를 그대로 더하기 때문입니다. 아래 의사코드는 블록 하나에서 일어나는 순서를
            한 줄씩 보여 줍니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Q4_K × q8_1 작은 블록 하나의 내적 (의사코드)"
          input={["v: 4비트 값 [3,0,15,7]이 든 32비트", "u: int8 [1,−2,3,4]", "d·sc = 1, dmin·m = 0.25, d8 = 0.1"]}
          steps={[
            { code: "vi ← v & 0x0F0F0F0F", note: "4비트 값 넷을 byte 네 칸에 하나씩 놓습니다." },
            { code: "dot ← dp4a(vi, u, 0)", note: "3·1 + 0·(−2) + 15·3 + 7·4 = 76입니다." },
            { code: "sum_u ← dp4a(0x01010101, u, 0)", note: "1·1 + 1·(−2) + 1·3 + 1·4 = 6입니다." },
            { code: "acc ← d8 · (d·sc · dot − dmin·m · sum_u)", note: "0.1 · (76 − 1.5) = 7.45입니다." },
          ]}
          output="블록 결과 7.45를 다른 블록의 결과와 더해 출력 원소 하나를 만듭니다."
        />
        <div className={prose}>
          <p>
            원문의 vec_dot_q4_K_q8_1_impl_vmmq가 이 네 줄입니다. 그 위의 vec_dot_q4_K_q8_1은 12 byte에 묶인 6비트 sc·m을 비트 연산으로 꺼내 넘깁니다. 이
            kernel은 행렬 열이 8개 이하일 때, 곧 slot 몇 개가 한 token씩 decode하는 경우에 쓰입니다. prompt처럼 열이 많은 곱은 다른 kernel로 갑니다.
          </p>
        </div>
        <CodeViewButton label="dp4a 두 번과 배율 한 번의 원문" onClick={() => code("vec-dot-impl")} />
        <CodeViewButton label="6비트 sc·m을 꺼내는 원문" onClick={() => code("vec-dot-unpack")} />
        <CodeViewButton label="q8_1 활성값 블록" onClick={() => code("q8-1-block")} />
        <CodeViewButton label="열 8개 이하 kernel 기준" onClick={() => code("mmvq-limit")} />
      </section>
    </>
  );
}
