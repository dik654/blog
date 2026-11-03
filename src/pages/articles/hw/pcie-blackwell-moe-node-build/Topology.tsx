import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import NodeTopologyViz from "./viz/NodeTopologyViz";
import TokenTimeBudgetViz from "./viz/TokenTimeBudgetViz";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

/**
 * 층위 1·2·3. 4절은 이름 없이 길을 그리고, 5절은 그 길이 왜 단일 스트림 속도를 정하는지 시간으로 나누고,
 * 6절에서야 스위치·P2P·DCP·GPUDirect RDMA 같은 표준 이름을 붙인다.
 * 본문 대응: 65·44·32·600·900 tok/s는 rtx6kpro 위키(현장 경험), 1.25ms·116µs·60µs는 계산.
 */
export default function Topology() {
  return (
    <>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 카드끼리 가는 길은 세 갈래이고 길이가 다릅니다</h2>
        <div className={prose}>
          <p>
            이 카드에는 카드끼리 잇는 전용 다리가 없습니다. 제조사 사양표의 해당 칸이 그냥 &ldquo;No&rdquo;입니다. 그래서 카드 사이 데이터는 모두 서버 보드의 확장 슬롯 나무를 타고 움직입니다.
          </p>
          <p>
            8장짜리 서버는 보통 나무를 두 그루 둡니다. CPU 소켓마다 중간 분기기를 하나 달고 그 아래에 카드 넷을 붙입니다. 같은 분기기 아래 두 카드는 분기기에서 바로 꺾어 오가지만, 다른 그루의 카드로 가려면 소켓과 소켓 사이 링크를 건너야 합니다.
          </p>
          <p>
            셋째 길도 있습니다. 카드끼리 직접 쓰는 기능을 끄면 데이터가 먼저 호스트 메모리에 복사됐다가 상대 카드로 다시 올라갑니다. 아래 그림이 세 길과, 분기기를 네트워크 카드 안에 넣은 다른 배치, 그리고 노드 밖으로 나가는 두 망을 차례로 보여 줍니다.
          </p>
        </div>
        <NodeTopologyViz />
        <div className={prose}>
          <p>
            그림만 보면 짧은 길이 늘 좋아 보입니다. 그런데 1절에서 본 것처럼 동시 요청이 많을 때는 셋째 길이 더 빨랐습니다. 길의 길이가 언제 속도를 정하고 언제 정하지 않는지는 토큰 하나를 만드는 시간을 쪼개 봐야 보입니다.
          </p>
        </div>
      </section>

      <section id="why" data-teach-level="2" data-calculation-explained className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 토큰 하나에 122번 맞추므로 길의 지연이 속도를 정합니다</h2>
        <div className={prose}>
          <p>
            사용자 한 명에게 65 tok/s를 준다는 것은 토큰 하나를 15.4ms에 만든다는 뜻입니다. 흔한 설명은 이 시간이 대부분 가중치를 읽는 데 든다는 것입니다. 숫자를 넣어 보면 이 노드에서는 그렇지 않습니다.
          </p>
          <p>
            활성 32B를 모두 4bit로 보면 토큰 하나에 16GB를 읽고, 여덟 장이 나눠 읽으니 장마다 2GB입니다. 카드 대역폭 1,597GB/s로 나누면 1.25ms입니다. 실제로는 attention과 공유 expert가 BF16이라 이보다 길지만, 두 배로 잡아도 2.5ms입니다.
          </p>
          <p>
            나머지 12~14ms는 다른 데 씁니다. 가장 큰 후보는 카드끼리 계산 결과를 맞추는 일입니다. 가중치를 여덟 장에 나눠 계산하면 층마다 두 번, 부분 결과를 모아 더해야 다음 단계로 넘어갈 수 있습니다. 61층이면 토큰 하나에 122번입니다.
          </p>
          <p>
            한 번에 옮기는 양은 토큰 하나의 hidden 벡터, 7,168개 값에 2byte로 14KiB뿐입니다. 이 정도 크기는 회선 대역폭이 아니라 출발에서 도착까지의 왕복 지연이 시간을 정합니다. 그래서 4절의 길이가 그대로 속도로 번집니다.
          </p>
        </div>

        <ExplainedFormula
          question="단일 사용자 토큰 하나의 시간은 어디에 쓰입니까?"
          idea="토큰 하나를 만들려면 가중치를 한 번 읽고, 층마다 정해진 횟수만큼 카드끼리 맞추고, 그 밖의 커널과 스케줄링을 거쳐야 합니다. 동시 요청이 하나뿐이면 이 세 몫이 겹치지 않고 거의 그대로 더해집니다."
          formula={String.raw`t_{tok} = \frac{N_{act} \cdot b_w}{P_{TP} \cdot B_{mem}} + 2L \cdot t_{sync} + t_{etc}`}
          annotatedFormula={String.raw`t_{tok} = \underbrace{\frac{N_{act} \cdot b_w}{P_{TP} \cdot B_{mem}}}_{\text{장마다 가중치 읽기}} + \underbrace{2L \cdot t_{sync}}_{\text{층마다 두 번 맞추기}} + \underbrace{t_{etc}}_{\text{커널·스케줄링}}`}
          operations={[
            {
              expression: String.raw`\frac{N_{act} \cdot b_w}{P_{TP} \cdot B_{mem}}`,
              annotation: ["32B × 0.5byte를 8장 × 1,597GB/s로 나눠 1.25ms입니다.", "BF16 부분이 있어 실제는 이보다 깁니다."],
            },
            {
              expression: String.raw`2L \cdot t_{sync}`,
              annotation: ["61층에 두 번씩 122번입니다.", "한 번의 시간이 길의 왕복 지연을 따라 움직입니다."],
            },
            {
              expression: String.raw`t_{etc}`,
              annotation: ["샘플링, 커널 실행 준비, 기억을 나눌 때 생기는 추가 합치기가 여기에 들어갑니다.", "측정 없이 둘째 항과 나눌 수 없습니다."],
            },
          ]}
          terms={[
            { symbol: "N_{act}", name: "활성 파라미터", description: "토큰 하나가 쓰는 파라미터 수로 약 32B입니다." },
            { symbol: "b_w", name: "가중치 값 크기", description: "4bit면 0.5byte입니다." },
            { symbol: "B_{mem}", name: "카드 메모리 대역폭", description: "사양 1,597GB/s입니다." },
            { symbol: "L", name: "층 수", description: "61층입니다." },
            { symbol: "t_{sync}", name: "맞추기 한 번의 시간", description: "14KiB를 여덟 장이 모아 더하는 데 걸리는 시간입니다." },
          ]}
          assumptions={[
            "동시 요청이 하나라 세 항이 겹치지 않는다고 둡니다. 동시 요청이 많으면 맞추기 한 번에 여러 토큰을 실어 보내 셈이 달라집니다.",
            "기억을 시퀀스로 나누면 층마다 합치기가 더 생깁니다. 그래서 122는 맞추기 횟수의 하한입니다.",
            "65·44 tok/s는 같은 노드에서 직접 쓰기 설정만 바꾼 현장 측정이라 차이를 둘째 항에 돌립니다. 다른 항도 함께 바뀌었을 수 있습니다.",
          ]}
          interpretation="15.4ms에서 1.25ms를 빼면 14.1ms이고, 이것을 모두 맞추기로 보면 한 번에 약 116µs가 상한입니다. 직접 쓰기를 끄자 22.7ms가 되었으니 늘어난 7.3ms는 맞추기 한 번에 약 60µs씩입니다. 읽어야 할 것은 단일 사용자 속도가 메모리보다 길의 지연에 묶인다는 점입니다. 읽으면 안 되는 것은 116µs나 60µs를 이 카드의 측정값으로 쓰는 것입니다."
        />

        <CalculationWalkthrough
          title="토큰 하나의 시간 장부"
          question="65 tok/s와 44 tok/s의 차이는 맞추기 한 번에 얼마씩 붙은 셈일까요?"
          scope="단일 사용자, 컨텍스트 0K, 같은 노드에서 직접 쓰기 설정만 바꾼 두 측정을 씁니다. 가중치 읽기는 4bit 하한입니다."
          steps={[
            { label: "65 tok/s의 토큰 시간", expression: "1,000ms ÷ 65", result: "15.4ms", reason: "단일 사용자 속도를 토큰 하나의 시간으로 바꿉니다." },
            { label: "장마다 읽는 가중치", expression: "32B × 0.5byte ÷ 8장", result: "2GB", reason: "활성 파라미터를 4bit로 보고 여덟 장이 나눠 읽습니다." },
            { label: "가중치 읽기 하한", expression: "2GB ÷ 1,597GB/s", result: "1.25ms", reason: "대역폭을 다 쓴다고 본 가장 짧은 시간입니다." },
            { label: "맞추기 횟수", expression: "61층 × 층마다 2번", result: "122번", reason: "층마다 두 번 모아 더해야 다음 층으로 갑니다." },
            { label: "맞추기 한 번의 상한", expression: "(15.4 − 1.25)ms ÷ 122", result: "약 116µs", reason: "남은 시간을 모두 맞추기에 돌린 상한입니다." },
            { label: "직접 쓰기를 끈 토큰 시간", expression: "1,000ms ÷ 44", result: "22.7ms", reason: "같은 노드, 같은 모델에서 이 설정만 바꿨습니다." },
            { label: "맞추기 한 번에 붙은 시간", expression: "(22.7 − 15.4)ms ÷ 122", result: "약 60µs", reason: "늘어난 시간이 모두 맞추기에서 났다고 가정합니다." },
          ]}
          conclusion="단일 사용자 속도는 가중치 읽기가 아니라 토큰마다 122번 오가는 맞추기의 왕복 지연에 묶이고, 길을 바꾸면 한 번에 수십 µs가 붙습니다."
          caveats={[
            "65·44 tok/s는 rtx6kpro 위키의 Festr Turin 노드 측정(vLLM, INT4, FP8 기억, 시퀀스 8조각)입니다.",
            "같은 노드에서 컨텍스트 100K는 36 대 29, 200K는 27 대 23으로 차이가 줄어듭니다. 긴 컨텍스트에서는 attention 계산 몫이 커지기 때문으로 보입니다(추론).",
          ]}
        />

        <TokenTimeBudgetViz />

        <div className={prose}>
          <p>
            CPU와 메모리도 이 길 위에 있습니다. 소켓을 건너는 맞추기는 소켓 사이 링크를 타고, 직접 쓰기를 끈 맞추기는 호스트 메모리에 내려앉습니다. 그래서 CPU 세대와 메모리 채널이 단일 사용자 속도를 움직일 수 있습니다. 같은 사람이 측정한 Turin 노드(DDR5-6400, 소켓당 12채널) 65 tok/s와 Genoa 노드(DDR5-4800) 약 32 tok/s가 그 예입니다.
          </p>
          <p>
            다만 이 비교는 통제된 A/B가 아닙니다. CPU 세대 말고도 메모리 속도, DIMM 수, 소켓 링크 수가 함께 달랐고, 다른 사람의 Genoa 노드(채널 5개, 링크 2개)는 32~35 tok/s였습니다. 그래서 이 글은 &ldquo;Turin이면 두 배&rdquo;라고 쓰지 않습니다. 메모리 채널을 다 채운 최신 소켓을 기본으로 두고 7절의 수락 측정으로 확인합니다.
          </p>
          <p>
            동시 요청이 많아지면 셈이 뒤집힙니다. 요청 100개를 한꺼번에 처리하면 맞추기 한 번에 토큰 100개를 실어 보내므로 왕복 지연보다 한 번에 옮기는 양과 채널 수가 중요해집니다. 같은 노드에서 직접 쓰기를 끈 쪽이 약 900 tok/s로 켠 쪽 약 600보다 높았습니다. 왜 그런지는 기록에 설명이 없고, 이 글도 원인을 확정하지 않습니다.
          </p>
        </div>
      </section>

      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 지금까지 본 역할에 표준 이름을 붙입니다</h2>
        <div className={prose}>
          <p>
            이제 이름을 붙이겠습니다. 소켓 아래에서 슬롯 여러 개로 갈라 주는 분기기는 PCIe 스위치입니다. 소켓마다 스위치를 하나씩 둔 배치는 듀얼 루트(dual-root)입니다. 카드끼리 호스트를 거치지 않고 서로의 메모리를 읽고 쓰는 기능은 PCIe P2P입니다.
          </p>
          <p>
            층마다 부분 결과를 모아 더하는 통신은 all-reduce이고, 이것을 실행하는 라이브러리가 NCCL입니다. 대화 기억을 시퀀스 방향으로 카드에 나누는 설정은 vLLM에서 decode context parallel(DCP)이라고 부릅니다. 넘친 기억을 호스트로 내리는 계층의 대표 구현은 LMCache입니다.
          </p>
          <p>
            노드 밖에서는 네트워크 카드가 호스트 메모리를 거치지 않고 카드 메모리를 바로 읽는 기능이 GPUDirect RDMA입니다. 분기기를 네트워크 카드 안에 넣은 제품은 ConnectX-8 SuperNIC입니다. 카드 쪽의 정식 이름은 RTX PRO 6000 Blackwell Server Edition이고, 데스크톱용 Workstation Edition과는 다른 제품입니다.
          </p>
        </div>
        <TermBreakdown
          title="이 글에서 쓰는 이름"
          description="앞 절에서 역할을 먼저 본 순서대로 적었습니다."
          items={[
            {
              term: "PCIe 스위치 · 듀얼 루트",
              description: "소켓 하나의 레인을 슬롯 여러 개로 나눠 주는 분기기와, 소켓마다 하나씩 둔 배치입니다.",
              example: "Supermicro SYS-522GA-NRT는 PCIe 5.0 x16 스위치 기반 dual-root 섀시로 카드 8장을 받습니다.",
              boundary: "어느 카드가 어느 스위치 아래 있는지는 섀시와 슬롯 배치로 정해지므로 nvidia-smi topo -m으로 확인합니다.",
            },
            {
              term: "PCIe P2P",
              description: "카드가 다른 카드의 메모리를 호스트 복사 없이 직접 읽고 쓰는 기능입니다.",
              example: "같은 노드에서 켜면 단일 사용자 65 tok/s, 끄면 44 tok/s였습니다(현장 경험).",
              boundary: "NVIDIA 제품 문서에 이 카드의 P2P 지원 문구는 없고, IOMMU와 ACS 설정에 따라 멈춤 보고가 있습니다.",
            },
            {
              term: "all-reduce · NCCL",
              description: "여러 카드의 부분 결과를 모아 더해 모두에게 돌려주는 통신과 그 라이브러리입니다.",
              example: "61층에 두 번씩, 토큰마다 122번 일어납니다.",
              boundary: "한 번의 크기가 14KiB라 대역폭보다 지연이 시간을 정합니다.",
            },
            {
              term: "DCP · FP8 KV",
              description: "대화 기억을 시퀀스 방향으로 카드에 나누는 설정과, 기억 값을 1byte로 저장하는 설정입니다.",
              example: "BF16·DCP1 약 19만 토큰이 FP8·DCP8에서 3,621,504 토큰이 됐습니다(현장 경험).",
              boundary: "단일 스트림이 90에서 65 tok/s로 떨어지고 출력 drift 버그 vllm#41623이 열려 있습니다.",
            },
            {
              term: "LMCache 호스트 오프로드",
              description: "카드 칸을 넘친 기억을 호스트 메모리에 두었다가 같은 앞부분이 다시 오면 올려 쓰는 계층입니다.",
              example: "200K 대화 하나가 1byte 기준 약 7GB라 1TB에 약 142개입니다(계산).",
              boundary: "TP rank마다 같은 기억을 각자 내리는지는 확인하지 못했습니다. 그렇다면 담는 수가 8분의 1입니다.",
            },
            {
              term: "GPUDirect RDMA · ConnectX-8",
              description: "네트워크 카드가 카드 메모리를 직접 읽는 경로와, PCIe Gen6 스위치를 품은 800Gb/s 네트워크 카드입니다.",
              example: "NVIDIA RTX PRO Server 레퍼런스는 카드 2장당 ConnectX-8 하나를 붙입니다.",
              boundary: "NVIDIA는 RTX PRO 6000의 GPUDirect RDMA 지원을 제품명으로 명시하지 않았으므로 노드마다 직접 확인합니다.",
            },
          ]}
        />
      </section>
    </>
  );
}
