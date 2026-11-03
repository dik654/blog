import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";

export default function LinkAxis() {
  return (
    <section id="link-axis" className="scroll-mt-20">
      <h2 className="mb-6 break-keep text-2xl font-bold">
        한 장에 못 담으면 연결 이름보다 통신 범위와 반복 횟수가 중요해집니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          70B 사례의 최소 210.4GiB와 실행 여유를 한 장에 담지 못한 후보는 모델을
          여러 장에 나눠야 합니다. 이때 중요한 질문은 “NVLink인가 Ethernet인가”에서
          끝나지 않습니다. 한 요청의 각 layer에서 어떤 byte가 몇 번 오가고, 그
          통신이 촘촘한 scale-up 범위 안에서 끝나는지 rack 사이 scale-out network를
          건너는지를 먼저 봐야 합니다.
        </p>
        <p className="leading-7">
          예를 들어 tensor parallel 2로 weight를 두 장에 나누면 각 가속기는 자신의
          조각을 계산한 뒤 다음 layer로 가기 전에 결과를 합쳐야 합니다. 이 collective가
          수십 개 layer에서 반복되므로 링크의 짧은 지연도 TPOT에 누적됩니다. 반면
          한 장에 모두 들어가면 이 모델 병렬 통신은 요청 경로에서 빠지고, 여러 장은
          서로 독립된 replica로 쓸 수 있습니다.
        </p>
      </div>

      <TermBreakdown
        title="연결을 읽을 때 분리할 세 범위"
        description="제품명이 아니라 한 요청이 실제로 넘는 경계를 구분합니다."
        items={[
          {
            term: "장치 내부 HBM",
            description: "한 가속기의 compute unit이 자기 HBM에서 weight와 KV cache를 읽는 범위입니다.",
            example: "한 장에 담긴 70B 요청은 모델 병렬 collective 없이 이 범위에서 decode할 수 있습니다.",
            boundary: "HBM 대역폭을 여러 장의 합산 수치로 읽으면 한 요청이 실제로 얻는 값을 과장할 수 있습니다.",
          },
          {
            term: "Scale-up domain",
            description: "여러 가속기를 한 모델처럼 자주 동기화하도록 만든 촘촘한 연결 범위입니다.",
            example: "NVLink·NVSwitch, UALink, TPU ICI, NeuronSwitch처럼 시스템별 구현과 domain 크기가 다릅니다.",
            boundary: "서로 다른 domain의 aggregate bandwidth와 가속기 한 장의 link bandwidth를 같은 열에 놓지 않습니다.",
          },
          {
            term: "Scale-out network",
            description: "Server·rack·cluster 경계를 넘어 replica 또는 분산 작업을 잇는 network입니다.",
            example: "InfiniBand나 RoCE Ethernet이 여러 node의 data parallel·pipeline stage를 잇습니다.",
            boundary: "같은 Ethernet 계열이어도 NIC 수, switch hop, oversubscription과 congestion이 다르면 경로가 다릅니다.",
          },
        ]}
      />

      <h3 id="collective-path" className="mt-10 mb-3 scroll-mt-24 break-keep text-xl font-semibold">
        같은 70B 요청이 병렬화 방식에 따라 다른 통신을 만듭니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          Tensor parallel은 한 layer를 여러 장이 함께 계산하므로 짧고 잦은 collective에
          민감합니다. Pipeline parallel은 layer 묶음 사이 activation을 넘기므로 경계
          횟수는 줄지만 stage가 서로 기다릴 수 있습니다. MoE expert parallel은 token이
          선택한 expert로 흩어졌다 돌아오는 all-to-all이 생겨, 평균보다 쏠림과 tail이
          더 중요해집니다.
        </p>
        <p className="leading-7">
          따라서 “더 빠른 link”를 고르는 것이 아니라, 먼저 목표 replica가 요구하는
          GPU 수와 병렬화 축을 정하고 그 통신이 어느 domain 안에서 끝나는지 topology로
          배치합니다. Domain을 넘겨야 한다면 그 구성 그대로 p95 TPOT를 재야 합니다.
          통신량 계산과 placement의 일반 원리는{" "}
          <Link to="/cs/ai/parallelism-strategy-and-placement">병렬화 전략과 배치</Link>에서
          더 깊게 다룹니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="벤더마다 연결 이름이 다른데 무엇을 같은 열에 적나요?"
          preview="이름 대신 domain 크기, 장치당 주입 대역폭, 실제 pair 경로, collective 결과와 장애 시 축소 범위를 기록합니다."
        >
          <p className="leading-7">
            NVIDIA rack-scale system은 NVLink·NVSwitch, AMD의 최신 rack-scale system은
            UALink, Google TPU는 ICI topology, AWS Trainium UltraServer는 NeuronSwitch,
            Gaudi 3는 내장 Ethernet port를 사용합니다. 이것들은 모두 “가속기 연결”이지만
            switch 구조와 예약 단위, topology가 같다는 뜻은 아닙니다.
          </p>
          <p className="leading-7">
            공통 원장에는 ① 한 domain의 가속기 수, ② 장치당 실제 주입 대역폭,
            ③ 두 endpoint 사이 hop, ④ all-reduce·all-to-all p95, ⑤ link 또는 장치 하나가
            실패했을 때 남는 domain을 적습니다. 공식 peak는 후보를 거르는 값이고 실제
            collective 결과가 배치 결정에 들어갑니다.
          </p>
        </ProgressiveDetail>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          이 단계까지 통과해도 실제로 설치하거나 예약할 수 없다면 후보가 아닙니다.
          다음 절에서는 카드·모듈 이름보다 먼저 자체 랙, 통합 rack system, 특정 cloud
          service라는 배치 경계를 나눕니다.
        </p>
      </div>
    </section>
  );
}
