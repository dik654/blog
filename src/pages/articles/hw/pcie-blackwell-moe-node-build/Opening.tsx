import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import CardBudgetViz from "./viz/CardBudgetViz";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

/**
 * 층위 S·B·0. 부품 이름(스위치, P2P, NCCL, DCP)은 4절 이후에 붙인다.
 * 본문 대응: 0절 사례의 숫자(595.2GB, 768GB, 0.92, 70,272byte)는 7절 추적과 연습문제에서 그대로 다시 쓴다.
 */
export default function Opening() {
  return (
    <>
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 같은 카드 여덟 장인데 한 사용자 속도가 두 배 갈립니다</h2>
        <div className={prose}>
          <p className="text-lg leading-8">
            (가정) 두 팀이 같은 서버 카드 여덟 장으로 1조 파라미터 MoE 모델 Kimi K2.5를 올렸습니다. 같은 엔진과 같은 양자화 파일을 썼습니다. 그런데 사용자 한 명이 받는 속도는 한쪽이 초당 65토큰, 다른 쪽이 32토큰이었습니다.
          </p>
          <p>
            이 숫자 짝은 지어낸 것이 아닙니다. 이 카드로 대형 모델을 돌리는 사람들이 모은 공개 위키에 실제로 두 노드의 단일 사용자 속도가 이렇게 적혀 있습니다. 다만 두 노드는
            CPU 세대와 메모리 구성이 함께 달라서 무엇이 차이를 냈는지는 그 기록만으로 가를 수 없습니다.
          </p>
          <p>
            같은 노드 안에서도 설정 하나로 속도가 갈렸습니다. 카드끼리 데이터를 직접 쓰게 두면 65, 막으면 44였습니다. 동시 요청 100개를 받을 때는 반대로 막은 쪽의 총 처리량이
            더 높았습니다.
          </p>
          <p>
            이 글은 이런 노드 한 대를 처음부터 짭니다. 무엇을 사서 어떻게 꽂고 어떤 설정을 켜야 하는지, 그리고 왜 같은 카드가 배치와 설정만으로 두세 배 차이를 내는지를 따라갑니다.
            가격은 매일 바뀌므로 다루지 않습니다. 손익은 파라미터로만 남깁니다.
          </p>
        </div>
        <ContentBoundary article="pcie-blackwell-moe-node-build" />
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 모델과 목표 속도를 넣으면 부품표와 수락 명령이 나옵니다</h2>
        <div className={prose}>
          <p>
            이 설계를 상자 하나로 보면 입력은 어떤 모델을 올리는지(가중치 크기와 층 수), 사용자 한 명에게 얼마나 빨리 돌려줘야 하는지, 대화 기억을 몇 개나 동시에 쥐고 있어야
            하는지입니다.
          </p>
          <p>
            출력은 카드와 CPU, 메모리, 네트워크 카드를 적은 부품표, 펌웨어와 드라이버와 통신 설정 목록, 그리고 산 노드가 기대대로 도는지 확인하는 명령 순서입니다. 이 확인 순서가
            빠지면 같은 부품표로도 두 배 느린 노드를 받을 수 있습니다.
          </p>
          <p>
            상자 안에서는 다섯 가지 일이 차례로 일어납니다. 가중치를 카드에 나눠 담고, 층마다 카드끼리 계산 결과를 맞추고, 남은 칸에 대화 기억을 담고, 넘친 기억을 호스트로 내리고, 노드를 늘릴 때 노드 밖으로 무엇을 보낼지 정합니다. 3절은 첫째와 셋째를 숫자로 셉니다.
          </p>
        </div>
      </section>

      <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 595GB를 넣으면 카드마다 기억 칸 약 14GB가 남습니다</h2>
        <div className={prose}>
          <p>
            Kimi K2.5의 공개 체크포인트는 safetensors 합계 595.2GB입니다. 384개 expert 가운데 토큰마다 8개만 쓰는 구조라 활성 파라미터는 약 32B이지만
            서빙하려면 1조 개 전부가 카드 메모리에 있어야 합니다. 카드 한 장이 96GB이므로 여덟 장이면 768GB입니다.
          </p>
          <p>
            엔진은 카드 메모리를 모두 쓰지 않습니다. 사용률을 0.92로 두면 장마다 88.3GB만 쓰고 가중치를 여덟 장에 고르게 나누면 장마다 74.4GB입니다. 남은 13.9GB가
            대화 기억(KV)을 담는 칸입니다.
          </p>
          <p>
            이 모델은 층마다 토큰 하나의 기억을 576개 값 하나로 압축해 둡니다. 61층에 값 하나가 2byte면 토큰 하나에 70,272byte, 약 70KB입니다. 13.9GB를 이 크기로 나누면 약 19.8만 토큰입니다.
          </p>
          <p>
            흔한 실수는 13.9GB를 여덟 장 더해 111GB로 보는 것입니다. 그렇게 보면 약 158만 토큰이 들어갈 것 같지만 이 압축 기억은 카드끼리 나눠 가질 수 없어서 여덟 장이
            같은 기억을 한 벌씩 들고 있습니다. 실제 용량은 한 장 몫입니다. 현장 측정도 약 19만 토큰이었습니다.
          </p>
          <p>
            19만 토큰이면 컨텍스트 200K인 코딩 에이전트 하나도 다 담지 못합니다. 이 노드는 처음부터 기억을 카드끼리 시퀀스 방향으로 나누고 값을 1byte로 줄이는 설정을 전제로
            짭니다. 그러면 같은 칸에 16배가 들어갑니다. 현장 측정은 3,621,504 토큰, 200K 대화로 약 18개였습니다.
          </p>
        </div>

        <ExplainedFormula
          question="가중치를 넣고 남은 칸에 대화 기억이 몇 토큰 들어갑니까?"
          idea="카드 한 장에서 엔진이 쓰는 몫을 정하고 그 장이 맡은 가중치를 뺀 뒤, 토큰 하나가 그 장에 남기는 기억 크기로 나눕니다. 기억이 여덟 장에 복제되면 나누는 수가 한 장 몫 그대로이고, 시퀀스를 나누면 장마다 남기는 크기가 줄어듭니다."
          formula={String.raw`T_{KV} = \frac{M \cdot u - W / P_{TP}}{L \cdot d_c \cdot b \,/\, P_{DCP}}`}
          annotatedFormula={String.raw`T_{KV} = \frac{\overbrace{M \cdot u}^{\text{엔진이 쓰는 몫}} - \overbrace{W / P_{TP}}^{\text{이 장의 가중치}}}{\underbrace{L \cdot d_c \cdot b}_{\text{토큰 하나의 기억}} \,/\, \underbrace{P_{DCP}}_{\text{시퀀스 조각 수}}}`}
          operations={[
            {
              expression: String.raw`M \cdot u`,
              annotation: ["카드 한 장 96GB에 사용률 0.92를 곱해 88.3GB입니다.", "나머지 8%는 드라이버와 작업 공간에 남깁니다."],
            },
            {
              expression: String.raw`W / P_{TP}`,
              annotation: ["595.2GB를 여덟 장으로 나눠 74.4GB입니다.", "가중치는 고르게 나뉜다고 둡니다."],
            },
            {
              expression: String.raw`L \cdot d_c \cdot b`,
              annotation: ["61층에 압축 값 576개, 값마다 2byte면 70,272byte입니다.", "이 값은 여덟 장이 모두 들고 있어 TP로 나누지 않습니다."],
            },
            {
              expression: String.raw`P_{DCP}`,
              annotation: ["시퀀스를 여덟 조각 내면 장마다 1/8만 남깁니다.", "나누지 않으면 1입니다."],
            },
          ]}
          terms={[
            { symbol: "M", name: "카드 메모리", description: "공칭 96GB입니다. 드라이버는 97,887MiB로 보고합니다." },
            { symbol: "u", name: "사용률", description: "엔진이 가져갈 비율입니다. 현장 측정은 0.93을 썼습니다." },
            { symbol: "W", name: "가중치 총량", description: "Kimi K2.5 INT4 체크포인트 595.2GB입니다." },
            { symbol: "P_{TP}", name: "가중치를 나누는 카드 수", description: "이 노드에서는 8입니다." },
            { symbol: "L, d_c, b", name: "층 수, 압축 폭, 값 크기", description: "61층, 576(512 + 64), BF16 2byte 또는 FP8 1byte입니다." },
            { symbol: "P_{DCP}", name: "시퀀스 조각 수", description: "기억을 시퀀스 방향으로 나누는 카드 수입니다." },
          ]}
          assumptions={[
            "가중치가 여덟 장에 고르게 나뉜다고 둡니다. 실제로는 나눌 수 없는 부분이 있어 장마다 조금씩 다릅니다.",
            "활성값 작업 공간과 CUDA graph 메모리를 빼지 않았습니다. 그래서 계산값이 측정값보다 크게 나올 수 있습니다.",
            "공칭 96GB를 썼습니다. 드라이버가 보고하는 크기는 이보다 커서 반대 방향으로 차이를 냅니다.",
          ]}
          interpretation="BF16, 조각 1이면 (88.3 − 74.4)GB ÷ 70,272byte ≈ 19.8만 토큰입니다. FP8에 조각 8이면 분모가 4,392byte로 줄어 약 316만 토큰입니다. 읽어야 할 것은 카드를 여덟 장 써도 분모에 8이 저절로 생기지 않는다는 점이고, 읽으면 안 되는 것은 계산값을 측정값 대신 쓰는 것입니다. 현장 측정은 각각 약 19만과 3,621,504 토큰입니다."
        />

        <CalculationWalkthrough
          title="8장 노드의 기억 칸"
          question="595.2GB를 올린 8×96GB 노드는 대화 기억을 몇 토큰 쥘 수 있을까요?"
          scope="카드 한 장 기준으로 셉니다. 사용률 0.92, 공칭 96GB, 가중치 균등 분할을 가정하고 활성값 작업 공간은 빼지 않습니다."
          steps={[
            { label: "엔진이 쓰는 몫", expression: "96GB × 0.92", result: "88.3GB", reason: "사용률을 넘는 메모리는 드라이버와 작업 공간에 남깁니다." },
            { label: "이 장의 가중치", expression: "595.2GB ÷ 8장", result: "74.4GB", reason: "가중치는 여덟 장이 나눠 들고, 장마다 한 번만 셉니다." },
            { label: "기억 칸", expression: "88.3GB − 74.4GB", result: "13.9GB", reason: "가중치를 빼고 남은 칸만 대화 기억에 씁니다." },
            { label: "토큰 하나의 기억", expression: "61층 × 576개 × 2byte", result: "70,272byte", reason: "층마다 압축 벡터 하나를 저장하고, 이 벡터는 여덟 장 모두에 복제됩니다." },
            { label: "한 장 몫의 용량", expression: "13.9GB ÷ 70,272byte", result: "약 19.8만 토큰", reason: "복제되므로 여덟 장을 더하지 않습니다. 현장 측정은 약 19만입니다." },
            { label: "시퀀스 8조각 + 1byte 값", expression: "70,272byte ÷ 2 ÷ 8", result: "4,392byte → 약 316만 토큰", reason: "값 크기 절반과 조각 수 8이 곱해져 16배가 들어갑니다. 현장 측정은 사용률 0.93에서 3,621,504입니다." },
            { label: "200K 에이전트 수", expression: "3,621,504 ÷ 200,000", result: "약 18개", reason: "컨텍스트가 꽉 찬 에이전트를 기준으로 동시에 상주시킬 수 있는 수입니다." },
          ]}
          conclusion="여덟 장을 써도 기억 칸은 한 장 몫이라, 긴 컨텍스트 에이전트를 받으려면 시퀀스 분할과 1byte 기억을 전제로 노드를 짜야 합니다."
          caveats={[
            "현장 측정은 rtx6kpro 위키(Festr 노드, vLLM, TRITON_MLA)의 값이며 반복 횟수와 오차가 적혀 있지 않습니다.",
            "시퀀스 분할은 단일 스트림을 90에서 65 tok/s로 낮추고, 출력이 조금씩 달라지는 버그(vllm#41623)가 열려 있습니다.",
          ]}
        />

        <CardBudgetViz />

        <div className={prose}>
          <p>
            카드 칸을 넘친 기억은 호스트 메모리로 내립니다. 200K 토큰 대화 하나의 기억은 1byte 기준 약 7GB라 호스트 1TB를 오프로드에 쓰면 약 142개를 담습니다(계산).
            이 노드의 호스트 메모리는 운영체제가 쓸 양보다 기억 저장소로 쓸 양에 맞춰 정합니다. 같은 카드가 왜 속도에서 두 배 갈리는지는 4절부터 다룹니다.
          </p>
        </div>
      </section>
    </>
  );
}
