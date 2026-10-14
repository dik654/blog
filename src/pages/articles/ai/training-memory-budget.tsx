import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ActivationCheckpointViz from "./training-memory-budget/viz/ActivationCheckpointViz";
import TrainingMemoryBudgetViz from "./training-memory-budget/viz/TrainingMemoryBudgetViz";

const stateRows = [
  ["계산용 가중치", "BF16·FP16 weight", "2B × 1,000", "2,000B"],
  ["이번 수정 방향", "BF16·FP16 gradient", "2B × 1,000", "2,000B"],
  ["정밀한 가중치 원본", "FP32 master weight", "4B × 1,000", "4,000B"],
  ["방향의 이동평균", "FP32 first moment m", "4B × 1,000", "4,000B"],
  ["제곱 크기의 이동평균", "FP32 second moment v", "4B × 1,000", "4,000B"],
] as const;

const choiceRows = [
  {
    symptom: "배치나 문장 길이를 늘릴 때만 메모리가 크게 뜁니다.",
    cause: "활성값 장부가 병목일 가능성이 큽니다.",
    action: "배치·문장 길이를 줄이거나 활성값 체크포인팅을 적용합니다.",
  },
  {
    symptom: "입력을 줄여도 큰 모델이 처음부터 올라가지 않습니다.",
    cause: "가중치·기울기·옵티마이저 상태가 병목일 가능성이 큽니다.",
    action: "ZeRO/FSDP 분할, 다른 정밀도, CPU·NVMe 내리기를 검토합니다.",
  },
  {
    symptom: "여러 GPU가 있는데 GPU마다 같은 장부가 반복됩니다.",
    cause: "자료 병렬 복제 때문에 모델 상태가 중복됩니다.",
    action: "분할 단계가 어떤 상태까지 나누는지 확인합니다.",
  },
  {
    symptom: "계산식보다 실제 최고 사용량이 더 큽니다.",
    cause: "임시 작업 공간, 통신 버퍼, 메모리 조각이 빠졌습니다.",
    action: "실행 시점별 할당량을 재고 여유분을 따로 둡니다.",
  },
] as const;

export default function TrainingMemoryBudgetArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section data-teach-level="1" className="scroll-mt-20">
        <p className="mb-3 text-sm font-semibold text-primary">한 문장 답</p>
        <h2 className="mb-6 text-2xl font-bold">
          학습 메모리는 현재 값·수정 장부·중간 활성값을 함께 보관하는 공간입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            매개변수 1,000개를 BF16 파일로 저장하면 2,000바이트입니다. 이 글에서
            고정한 혼합 정밀도 Adam 구성으로 학습하면 매개변수 관련 장부만
            16,000바이트가 됩니다. 여기에 입력 크기와 층 수에 따라 달라지는
            활성값이 더해집니다.
          </p>
          <p>
            그러면 네 가지 질문이 이어집니다. 왜 같은 숫자를 여러 벌 둡니까?
            활성값은 왜 매개변수 수와 다른 식으로 커집니까? 일부 값을 버려도
            어떻게 같은 기울기를 구합니까? 여러 GPU에 나누면 어느 장부가 실제로
            줄어듭니까? 이 질문을 하나의 작은 사례로 차례대로 답합니다.
          </p>
        </div>
        <div className="not-prose mt-7 grid gap-3 sm:grid-cols-2">
          {[
            ["고정 사례", "매개변수 1,000개 · 혼합 정밀도 Adam"],
            ["작은 입력", "자료 2개 · 토큰 4개 · 폭 8"],
            ["계산 깊이", "같은 크기의 출력을 내는 층 9개"],
            ["계산 단위", "BF16·FP16 2B · FP32 4B"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border/75 p-4">
              <p className="text-xs font-semibold text-primary">{label}</p>
              <p className="mt-1 text-sm font-bold">{value}</p>
            </div>
          ))}
        </div>
        <ContentBoundary article="training-memory-budget" />
      </section>

      <section id="tiny-ledger" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 2,000바이트짜리 모델을 학습하면 먼저 16,000바이트 장부가 생깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 2,000바이트는 순방향 계산에 쓰는 가중치입니다. 역방향 계산이
            시작되면 같은 1,000개 자리에 기울기 2,000바이트가 생깁니다. Adam은
            작은 수정값을 보존할 FP32 원본과 최근 방향·크기를 기억할 두 통계를
            더 유지합니다. 이 세 벌은 각각 4,000바이트입니다.
          </p>
          <p>
            아래에서 한 줄씩 더해 확인하십시오. 마지막 16,000바이트는 모든
            환경에 통하는 상수가 아닙니다.{" "}
            <strong>
              FP16·BF16 가중치와 기울기, FP32 master weight, FP32 Adam 통계 두
              벌
            </strong>
            을 둔다는 가정에서만 나온 값입니다.
          </p>
        </div>
        <TrainingMemoryBudgetViz />

        <div className="not-prose grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stateRows.map(([meaning, term, arithmetic, total]) => (
            <div
              key={term}
              className="min-w-0 rounded-lg border border-border/75 p-3"
            >
              <p className="text-xs font-bold text-primary">{meaning}</p>
              <p className="mt-2 break-words text-xs font-semibold">{term}</p>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                {arithmetic}
              </p>
              <p className="mt-1 font-mono text-sm font-bold">{total}</p>
            </div>
          ))}
        </div>

        <ExplainedFormula
          question="매개변수 1,000개의 학습 상태는 왜 16,000바이트입니까?"
          idea={
            <>
              값 하나에 붙는 다섯 장부의 바이트를 먼저 더합니다. 그다음 같은
              묶음이 매개변수 1,000개마다 필요하므로 1,000을 곱합니다.
            </>
          }
          formula={String.raw`M_{\text{state}}=P\times16\ \text{B}=1{,}000\times16\ \text{B}=16{,}000\ \text{B}`}
          annotatedFormula={String.raw`M_{\text{state}}=\underbrace{P}_{\text{매개변수 수}}\times\underbrace{16\ \text{B}}_{\text{매개변수마다 다섯 장부}}`}
          operations={[
            {
              expression: String.raw`2+2=4\ \text{B}`,
              annotation: ["계산용 가중치와 기울기가", "각각 2바이트입니다."],
            },
            {
              expression: String.raw`4+4+4=12\ \text{B}`,
              annotation: ["FP32 원본과 m·v가", "각각 4바이트입니다."],
            },
            {
              expression: String.raw`4+12=16\ \text{B}`,
              annotation: ["한 매개변수 자리에 붙는", "다섯 장부의 합입니다."],
            },
            {
              expression: String.raw`1{,}000\times16\ \text{B}=16{,}000\ \text{B}`,
              annotation: [
                "같은 다섯 값 묶음이",
                "매개변수 1,000개마다 반복됩니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: "P",
              name: "매개변수 수",
              description: "학습으로 바뀌는 숫자의 개수입니다.",
            },
            {
              symbol: String.raw`M_{\text{state}}`,
              name: "모델 상태 메모리",
              description: "활성값을 제외한 다섯 장부의 합입니다.",
            },
          ]}
          assumptions={[
            "가중치와 기울기는 2바이트, master weight와 Adam의 m·v는 4바이트로 둡니다.",
            "활성값, 임시 작업 공간, 통신 버퍼, 메모리 조각은 아직 넣지 않습니다.",
            "구현에 따라 master weight를 두지 않거나 기울기와 상태의 자료형이 달라질 수 있습니다.",
          ]}
          interpretation="16,000B는 이 구성의 모델 상태 장부입니다. 16.0kB는 십진 단위이며 15.625KiB와 같습니다. 실제 최고 GPU 사용량은 더 큽니다."
        />
      </section>

      <section id="why-five" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 다섯 벌은 같은 복사본이 아니라 서로 다른 시점의 일을 맡습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            계산용 가중치는 현재 답을 만드는 값입니다. 기울기는 이번 미니배치가
            그 값을 어느 방향으로 얼마나 고치라고 요구하는지 적습니다. 기울기는
            영구 기록이 아닙니다. 그래도 역방향 계산이 끝나고 Adam이 값을 고칠
            때까지 가중치와 함께 있으므로 최고 메모리 장부에 넣습니다.
          </p>
          <p>
            정밀한 가중치 원본은 <strong>master weight</strong>입니다. 이 글의
            구성에서는 낮은 정밀도의 계산용 가중치에 바로 작은 수정값을 더할 때
            생길 수 있는 반올림 손실을 피하려고 FP32 값을 따로 둡니다. 최근
            기울기의 부호 있는 평균은{" "}
            <strong>첫 번째 모멘트(first moment, m)</strong>이고, 최근 제곱
            기울기의 평균은 <strong>두 번째 모멘트 (second moment, v)</strong>
            입니다. Adam은 m으로 흔들리는 방향을 완화하고 v로 좌표별 수정 크기를
            조절합니다.
          </p>
          <p>
            이 역할을 알면 옵티마이저를 바꿀 때 계산식도 바꿀 수 있습니다.
            모멘텀 없는 SGD라면 m과 v가 없습니다. FP32만으로 학습하면 계산용
            가중치와 master weight를 별도 두지 않는 구성이 흔합니다. 따라서 먼저
            실제 런타임이 보관하는 텐서와 자료형을 확인하고, 그 목록을 바이트로
            바꾸어야 합니다.
          </p>
        </div>
      </section>

      <section
        id="activation-shape"
        data-teach-level="4"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          3. 활성값은 매개변수 수보다 배치·토큰·폭·층 수를 따라 커집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            순방향 계산이 만든 중간 출력은 <strong>활성값(activation)</strong>
            입니다. 역방향 계산은 각 층의 입력을 다시 사용해 가중치 기울기를
            구합니다. 그래서 기본 실행에서는 필요한 활성값을 그때까지 남겨
            둡니다.
          </p>
          <p>
            작은 사례의 층 출력 모양은 자료 2개, 자료마다 토큰 4개, 토큰마다
            숫자 8개입니다. 먼저 <code>2×4×8=64개</code>를 셉니다. BF16 숫자
            하나는 2바이트이므로 층 하나의 출력은 <code>64×2B=128B</code>입니다.
            같은 크기의 출력을 9개 층에서 모두 저장하면
            <code>9×128B=1,152B</code>입니다.
          </p>
        </div>
        <ActivationCheckpointViz />

        <ExplainedFormula
          question="작은 입력의 층 출력 하나가 왜 128바이트입니까?"
          idea={
            <>
              자료 수, 자료 하나의 토큰 수, 토큰 하나의 숫자 수를 곱해 전체
              숫자를 셉니다. 마지막에 숫자 하나의 바이트를 곱합니다.
            </>
          }
          formula={String.raw`M_{\text{output}}=(B S H)\times b=64\times2\ \text{B}=128\ \text{B}`}
          annotatedFormula={String.raw`M_{\text{output}}=\underbrace{B S H}_{\text{출력값 64개}}\times\underbrace{b}_{\text{값마다 2B}}`}
          operations={[
            {
              expression: "2×4=8 tokens",
              annotation: ["자료가 2개이고", "각 자료에 토큰이 4개입니다."],
            },
            {
              expression: "8×8=64 values",
              annotation: [
                "토큰은 모두 8개입니다.",
                "각 토큰에 숫자 8개가 있습니다.",
              ],
            },
            {
              expression: "64×2B=128B",
              annotation: ["BF16 숫자 하나가", "2바이트를 차지합니다."],
            },
          ]}
          terms={[
            {
              symbol: "B",
              name: "배치 크기",
              description: "한 번에 처리하는 자료 수입니다.",
            },
            {
              symbol: "S",
              name: "문장 길이",
              description: "자료 하나의 토큰 수입니다.",
            },
            {
              symbol: "H",
              name: "은닉 폭",
              description: "토큰 하나를 나타내는 숫자 수입니다.",
            },
            {
              symbol: "b",
              name: "값의 바이트",
              description: "숫자 하나를 저장하는 크기입니다.",
            },
          ]}
          assumptions={[
            "설명을 위해 모든 층이 B×S×H 출력 하나만 저장한다고 단순화합니다.",
            "실제 Transformer 층은 attention과 MLP의 여러 중간 텐서를 저장하므로 계수가 더 큽니다.",
          ]}
          interpretation="매개변수 장부 16,000B와 기본 활성값 1,152B를 더한 교육용 하한은 17,152B입니다. 임시 작업 공간은 여전히 빠져 있습니다."
        />

        <AlgorithmBlock
          title="같은 사례의 학습 메모리 하한을 한 줄씩 계산합니다"
          input={[
            "P=1,000; state_bytes=[2,2,4,4,4]",
            "B=2; S=4; H=8; value_bytes=2; layers=9",
          ]}
          steps={[
            {
              code: "weight = P × 2B = 2,000B",
              note: "매개변수마다 계산용 가중치 하나가 있으므로 P를 곱합니다.",
            },
            {
              code: "gradient = P × 2B = 2,000B",
              note: "같은 P개 자리마다 이번 수정 방향 하나를 둡니다.",
            },
            {
              code: "adam = P × (4B + 4B + 4B) = 12,000B",
              note: "FP32 원본·m·v 세 벌이 각각 P개이므로 세 항을 먼저 더합니다.",
            },
            {
              code: "model_state = weight + gradient + adam = 16,000B",
              note: "여기까지는 입력 크기와 무관한 모델 상태입니다.",
            },
            {
              code: "values_per_output = B × S × H = 64",
              note: "자료, 토큰, 토큰당 숫자를 곱해 층 출력의 원소 수를 셉니다.",
            },
            {
              code: "one_output = 64 × 2B = 128B",
              note: "원소 수를 바이트로 바꾸는 단계입니다.",
            },
            {
              code: "saved_outputs = layers × one_output = 9 × 128B = 1,152B",
              note: "아홉 층의 출력 하나씩을 모두 저장한다는 단순화입니다.",
            },
            {
              code: "lower_bound = 16,000B + 1,152B = 17,152B",
              note: "같은 학습 단계에 존재하는 모델 상태와 활성값을 더합니다.",
            },
          ]}
          output="교육용 하한 17,152B; workspace·통신 buffer·allocator 여유는 별도"
        />
      </section>

      <section id="checkpointing" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          4. 활성값 체크포인팅은 중간값을 버리고 역방향 계산 직전에 다시
          만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            아홉 출력을 모두 저장하는 대신 세 층마다 시작값
            <code>x₀·x₃·x₆</code>만 남길 수 있습니다. 순방향 계산이 끝날 때
            <code>x₁·x₂·x₄·x₅·x₇·x₈</code>은 없습니다. 마지막 세 층의 기울기가
            필요해지면 <code>x₆</code>에서 세 층을 다시 실행해
            <code>x₇·x₈·x₉</code>을 복원합니다. 이 저장과 재계산의 교환이
            <strong>활성값 체크포인팅(activation checkpointing)</strong>입니다.
          </p>
          <p>
            간격을 <code>k</code>로 두면 계속 보관할 기준점은 대략
            <code>n/k</code>개입니다. 현재 구간을 복원하는 동안에는 최대
            <code>k</code>개가 더 필요합니다. 두 수의 합<code>n/k+k</code>는{" "}
            <code>k≈√n</code>에서 균형을 이루므로 저장 슬롯은 <code>O(√n)</code>
            이 됩니다. 모든 구간을 한 번씩 복원하므로 단순한 연쇄 구조에서는
            전체적으로 순방향 계산 약 한 번을 더 합니다.
          </p>
        </div>

        <ExplainedFormula
          question="왜 체크포인트 간격을 √n 근처로 잡습니까?"
          idea={
            <>
              간격을 넓히면 오래 보관할 기준점은 줄지만 한 번에 복원할 값이
              늘어납니다. 두 장부가 같아지는 지점을 찾습니다.
            </>
          }
          formula={String.raw`S(k)\approx\frac{n}{k}+k,\qquad k=\sqrt n\Rightarrow S(k)\approx2\sqrt n`}
          annotatedFormula={String.raw`S\approx\underbrace{\frac{n}{k}}_{\text{기준점 수}}+\underbrace{k}_{\text{복원 값 수}}`}
          operations={[
            {
              expression: String.raw`n/k=k`,
              annotation: ["두 장부가 같은 크기가 되는", "균형점을 둡니다."],
            },
            {
              expression: String.raw`k^2=n\Rightarrow k=\sqrt n`,
              annotation: [
                "간격 k와 기준점 수 n/k가",
                "모두 √n 규모가 됩니다.",
              ],
            },
            {
              expression: String.raw`n=9\Rightarrow k=3,\ S\approx3+3=6`,
              annotation: [
                "작은 사례에서는 기준점 3개와",
                "복원 구간 3개를 셉니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: "n",
              name: "층 수",
              description: "같은 연쇄 계산에 있는 층의 수입니다.",
            },
            {
              symbol: "k",
              name: "체크포인트 간격",
              description: "기준점 사이에 다시 실행할 층 수입니다.",
            },
            {
              symbol: "S(k)",
              name: "저장 슬롯 근사",
              description:
                "동시에 살아 있는 단순화한 층 출력의 최고 개수입니다.",
            },
          ]}
          assumptions={[
            "각 층의 계산량과 활성값 크기가 같고, 연쇄 구조이며, 층 출력 하나만 센다는 교육용 근사입니다.",
            "분기, attention 중간 텐서, RNG 상태, 프레임워크 내부 저장값에 따라 실제 최고치는 달라집니다.",
          ]}
          interpretation="아홉 층 사례에서는 출력 슬롯 9개가 약 6개로 줄어듭니다. 큰 n에서 차이가 커지며, 절약한 메모리 대신 구간을 다시 계산합니다."
        />

        <AlgorithmBlock
          title="세 층마다 기준점을 남기고 같은 기울기를 구합니다"
          input={[
            "layers=[L1,…,L9]; checkpoint_interval=3",
            "saved=[x0]; x0=input",
          ]}
          steps={[
            {
              code: "x3 = L3(L2(L1(x0))); save(x3)",
              note: "x₁·x₂는 다음 계산에 쓴 뒤 버리고 세 번째 경계만 남깁니다.",
            },
            {
              code: "x6 = L6(L5(L4(x3))); save(x6)",
              note: "두 번째 구간도 시작값 x₃과 끝 기준점 x₆만 유지합니다.",
            },
            {
              code: "x9 = L9(L8(L7(x6))); loss = score(x9)",
              note: "마지막 출력으로 손실을 계산합니다. 중간 x₇·x₈은 계속 두지 않습니다.",
            },
            {
              code: "replay x6 → x7 → x8 → x9",
              note: "L7~L9의 기울기가 필요할 때 같은 순방향 구간을 다시 실행합니다.",
            },
            {
              code: "backward L9 → L8 → L7; discard(x7,x8,x9)",
              note: "현재 구간의 기울기를 구한 뒤 복원한 값은 버립니다.",
            },
            {
              code: "repeat replay-and-backward for L4~L6, then L1~L3",
              note: "저장한 x₃과 x₀을 차례로 시작점으로 사용합니다.",
            },
          ]}
          output="모든 매개변수의 기울기; 단순 슬롯 최고치 약 6개"
          repeatUntil="L1의 기울기까지 계산할 때까지"
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            체크포인팅은 가중치·기울기·Adam 상태 16,000바이트를 줄이지 않습니다.
            활성값 항만 줄입니다. 또한 다시 실행한 순방향 계산이 원래와 다른
            값을 내면 기울기도 달라질 수 있습니다. 무작위 연산의 상태와 외부에서
            바뀌는 값을 다루는 방식까지 확인해야 합니다.
          </p>
        </div>
      </section>

      <section id="scale-out" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 1,000개에서 75억 개로 늘려도 같은 장부를 반복합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            매개변수 수를 <code>7.5×10⁹</code>개로 바꾸면 모델 상태는
            <code>16B×7.5×10⁹=120×10⁹B</code>입니다. 십진 단위로 120GB이고 이진
            단위로는 약 111.76GiB입니다. 입력을 한 토큰만 넣어도 이 모델 상태는
            먼저 필요하며, 활성값과 임시 공간은 그 위에 더해집니다.
          </p>
          <p>
            자료 병렬 GPU 네 장에 같은 학습기를 복제하면 각 GPU가 16바이트
            장부를 그대로 가질 수 있습니다. <strong>ZeRO</strong>는 이 중복을
            단계별로 나눕니다. 아래 수치는 1,000개 사례를 GPU 네 장에 균등하게
            나눈 이상적인 모델 상태 장부입니다. 통신 버퍼와 순간적인 모으기
            공간은 넣지 않았습니다.
          </p>
        </div>

        <div className="not-prose grid gap-3 md:grid-cols-2">
          {[
            [
              "분할 없음",
              "2,000 + 2,000 + 12,000",
              "GPU당 16,000B",
              "모든 상태를 네 GPU가 각각 보관",
            ],
            [
              "ZeRO 1단계",
              "2,000 + 2,000 + 12,000÷4",
              "GPU당 7,000B",
              "Adam 상태만 네 곳에 나눔",
            ],
            [
              "ZeRO 2단계",
              "2,000 + 2,000÷4 + 12,000÷4",
              "GPU당 5,500B",
              "기울기와 Adam 상태를 나눔",
            ],
            [
              "ZeRO 3단계",
              "(2,000 + 2,000 + 12,000)÷4",
              "GPU당 4,000B",
              "가중치까지 모든 모델 상태를 나눔",
            ],
          ].map(([title, arithmetic, result, meaning]) => (
            <div key={title} className="rounded-xl border border-border/75 p-4">
              <p className="text-sm font-bold text-primary">{title}</p>
              <p className="mt-3 break-words font-mono text-xs">{arithmetic}</p>
              <p className="mt-1 font-mono text-base font-bold">{result}</p>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {meaning}
              </p>
            </div>
          ))}
        </div>

        <div
          id="paper-zero"
          className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
        >
          <p className="text-xs font-bold text-primary">원 논문의 적용 범위</p>
          <h3 className="mt-2 text-base font-bold">
            ZeRO는 반복 저장된 모델 상태를 자료 병렬 작업자 사이에 나눕니다
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Rajbhandari 등은 혼합 정밀도 학습의 모델 상태를
            <code className="mx-1">(2+2+K)Ψ</code>로 적고 Adam에서
            <code className="mx-1">K=12</code>인 75억 매개변수 사례를 120GB로
            계산했습니다. 이는 활성값과 임시 버퍼를 제외한 논문 속 구성의
            장부입니다. 모든 옵티마이저와 구현이 매개변수당 16바이트를 쓴다는
            뜻은 아닙니다.
          </p>
          <a
            href="https://arxiv.org/abs/1910.02054"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-primary underline underline-offset-4"
          >
            ZeRO 원 논문 보기
          </a>
        </div>
      </section>

      <section id="real-code" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          6. PyTorch 구현도 구간 입력을 남기고 역방향 계산에서 구간을 다시
          부릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            아홉 블록이 <code>nn.Sequential</code>에 들어 있다면 아래처럼 세
            구간으로 나눌 수 있습니다. <code>segments=3</code>은 메모리 크기를
            직접 지정하는 값이 아니라 모델을 몇 구간으로 나눌지 정하는 값입니다.
          </p>
        </div>
        <pre className="not-prose my-6 overflow-x-auto rounded-xl border border-border/70 bg-muted/30 p-4 text-xs leading-6">
          <code>{`from torch.utils.checkpoint import checkpoint_sequential

# blocks에는 L1부터 L9까지 순서대로 들어 있습니다.
y = checkpoint_sequential(
    functions=blocks,
    segments=3,
    input=x,
    use_reentrant=False,
)
loss = criterion(y, target)
loss.backward()`}</code>
        </pre>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            고정한 PyTorch 소스는 전체 함수를 세 구간으로 나눈 뒤 마지막 구간을
            제외한 각 구간을 <code>checkpoint(...)</code>로 감쌉니다. 각 구간의
            입력은 남기고 내부 활성값은 저장하지 않으며, 역방향 계산에서 그
            함수를 다시 실행합니다. 마지막 구간은 보통 방식으로 실행하므로 앞의
            3+3 슬롯 그림과 실제 최고치는 정확히 같지 않습니다. 그림은
            저장-재계산 원리를 세는 모형이고, 실제 메모리는 측정해야 합니다.
          </p>
        </div>

        <div
          id="source-pytorch-checkpoint"
          className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
        >
          <p className="text-xs font-bold text-primary">
            고정 커밋의 공식 소스
          </p>
          <h3 className="mt-2 text-base font-bold">
            checkpoint_sequential은 구간 입력을 저장하고 내부 함수를 다시
            실행합니다
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            2026-10-14에 확인한 PyTorch 커밋
            <code className="mx-1">8ed12848</code>의 715~793줄입니다. 이 소스는
            순차 모델의 구간 분할과 <code>use_reentrant</code> 전달 방식을
            확인하는 근거입니다. 다른 계산 그래프의 최적 구간 수나 실제 절약량을
            보장하는 근거는 아닙니다.
          </p>
          <a
            href="https://github.com/pytorch/pytorch/blob/8ed12848bd2b7baba59d5dd8056d861173cd7702/torch/utils/checkpoint.py#L715-L793"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-primary underline underline-offset-4"
          >
            PyTorch 체크포인팅 고정 소스 보기
          </a>
        </div>

        <div
          id="paper-gradient-checkpointing"
          className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
        >
          <p className="text-xs font-bold text-primary">원 논문의 적용 범위</p>
          <h3 className="mt-2 text-base font-bold">
            부분선형 메모리는 계산을 다시 하는 대가로 얻습니다
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Chen 등은 n층 계산을 O(√n) 메모리로 학습하는 방법을 제시했습니다.
            논문의 1,000층 잔차 신경망 실험에서는 활성값 메모리가 48GB에서 7GB로
            줄었습니다. 학습 시간은 약 30% 늘었습니다. 이 수치는 해당 구조와
            장치에서 얻은 결과이며 모든 Transformer와 런타임의 고정 비율이
            아닙니다.
          </p>
          <a
            href="https://arxiv.org/abs/1604.06174"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-primary underline underline-offset-4"
          >
            부분선형 메모리 원 논문 보기
          </a>
        </div>
      </section>

      <section id="decision" data-teach-level="8" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          7. 무엇을 줄일지는 어느 장부가 커지는지 측정한 뒤 정합니다
        </h2>
        <div className="not-prose grid gap-3 md:grid-cols-2">
          {choiceRows.map((row) => (
            <div
              key={row.symptom}
              className="rounded-xl border border-border/75 p-4"
            >
              <p className="text-sm font-bold">{row.symptom}</p>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                <span className="font-semibold text-foreground">
                  읽을 신호:
                </span>{" "}
                {row.cause}
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                <span className="font-semibold text-foreground">
                  다음 행동:
                </span>{" "}
                {row.action}
              </p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral mt-7 max-w-none dark:prose-invert">
          <p>
            체크포인팅은 메모리를 계산으로 바꿉니다. ZeRO와 FSDP는 모델 상태를
            통신으로 바꿉니다. CPU·NVMe 내리기는 GPU 메모리를 전송 시간과 다른
            장치의 용량으로 바꿉니다. 어떤 방법도 장부를 공짜로 없애지 않습니다.
            목표 배치와 문장 길이에서 실행 시점별 메모리, 단계 시간, 통신량을
            함께 측정해 선택해야 합니다.
          </p>
          <p>
            더 세분화된 저정밀도 기본 모델·어댑터 장부는
            <Link to="/cs/ai/lora-finetuning#qlora"> QLoRA 메모리 계산</Link>
            으로, 저장할 값과 다시 계산할 값의 일반 원리는
            <Link to="/cs/ai/reverse-mode-autodiff#save-recompute">
              {" "}
              역방향 자동 미분
            </Link>
            으로 이어집니다. 실제 혼합 정밀도 반복문은
            <Link to="/cs/ai/training-pipeline#loop">
              {" "}
              PyTorch 학습 파이프라인
            </Link>
            에서 확인할 수 있습니다.
          </p>
        </div>
      </section>

      <section
        id="prediction-questions"
        data-teach-level="9"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          8. 같은 장부의 숫자를 바꾸면 결과를 예측할 수 있습니까
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            매개변수 수는 그대로 두고 배치를 2에서 4로 늘립니다. 16,000바이트
            모델 상태와 1,152바이트 활성값 중 어느 쪽이 바뀝니까? 왜 정확히 두
            배가 됩니까? (답: 3절)
          </p>
          <p>
            아홉 층 사례에서 체크포인트 간격을 1로 잡으면 기준점 수와 재계산량은
            각각 어떻게 바뀝니까? 간격 3과 비교해 어느 장부가 커집니까? (답:
            4절)
          </p>
          <p>
            GPU 네 장에 ZeRO 3단계를 적용해도 활성값 체크포인팅이 따로 필요한
            경우는 언제입니까? 어느 기법이 어느 장부를 줄이는지 나누어 설명해
            보십시오. (답: 4·5·7절)
          </p>
        </div>
      </section>
    </div>
  );
}
