import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import { CitationBlock } from "@/components/ui/citation";
import NetworkNeedViz from "./viz/NetworkNeedViz";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

const LWS_EXCERPT = `# 초안(2026-11-03), 어느 클러스터에도 적용하지 않음
apiVersion: leaderworkerset.x-k8s.io/v1
kind: LeaderWorkerSet
spec:
  leaderWorkerTemplate:
    size: 1                      # 노드 하나 = 복제본 하나
    workerTemplate:
      metadata:
        annotations:
          kueue.x-k8s.io/podset-required-topology: kubernetes.io/hostname
      spec:
        resourceClaims:
          - name: gpus
            resourceClaimTemplateName: pro6000-x8
        containers:
          - name: vllm
            image: docker.io/vllm/vllm-openai:v0.32.0
            args:
              - --tensor-parallel-size=8
              - --decode-context-parallel-size=8
              - --language-model-only
              - --gpu-memory-utilization=0.92
              # - --disable-custom-all-reduce   # P2P 멈춤을 격리할 때만`;

const MULTINODE_EXCERPT = `# 두 노드에 층을 나눌 때(size: 2), 리더와 워커가 같은 명령을 쓰고 워커만 --headless
vllm serve /models/moonshotai/Kimi-K2.5 \\
  --tensor-parallel-size 8 --pipeline-parallel-size 2 \\
  --nnodes "\${LWS_GROUP_SIZE}" --node-rank "\${LWS_WORKER_INDEX}" \\
  --master-addr "\${LWS_LEADER_ADDRESS}" \${EXTRA}`;

/**
 * 층위 4(노드 밖으로 같은 사례를 이어 추적)와 층위 5(쿠버네티스 초안 실물).
 * 본문 대응: 14,336byte/token과 70,272byte/token은 3·5절 값 그대로다.
 * 버전과 필드는 04-k8s-serving-stack.md(2026-11-03, 태그 기준 코드·문서 읽기)에서 옮겼고 클러스터에서 실행하지 않았다.
 */
export default function NetworkScale() {
  return (
    <>
      <section id="network" data-teach-level="4" data-calculation-explained className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 노드 밖 망은 복제본이면 거의 놀고 앞뒤 분리에서만 일합니다</h2>
        <div className={prose}>
          <p>
            노드 한 대가 감당하는 동시 에이전트가 모자라면 노드를 더합니다. 이때 망 크기는 노드를 어떻게 묶느냐로 정해집니다. 같은 모델 한 벌을 노드마다 통째로 올리면 카드끼리 맞추는
            122번은 모두 노드 안에서 끝나고 노드 사이로는 요청과 응답 글자만 갑니다.
          </p>
          <p>
            첫 노드는 400G 포트를 하나 꽂아만 두고 기존 100GbE 서비스망에 붙입니다. 노드가 늘면 llm-d의 요청 분배기(EPP)가 각 복제본의 기억 상태를 보고 요청을
            나눕니다. 같은 앞부분을 가진 요청이 같은 노드로 가야 3절의 기억 칸이 다시 쓰입니다.
          </p>
          <p>
            층을 두 노드에 나누는 방식은 다릅니다. 경계에서 토큰마다 hidden 벡터 하나를 넘기므로 망은 거의 쓰지 않지만 한 사용자의 토큰은 여전히 두 노드를 차례로 지나야 해서
            빨라지지 않습니다. 한 노드에 안 들어가는 모델이나 기억을 담을 때 쓰는 방식입니다.
          </p>
          <p>
            망이 실제로 일하는 것은 앞뒤 단계를 나눌 때입니다. 프롬프트를 읽는 노드와 토큰을 내는 노드를 따로 두면 앞 노드가 만든 기억을 뒤 노드로 넘겨야 합니다. 200K 토큰
            대화면 그 기억이 기가바이트 단위라서 여기서 처음으로 원격 메모리를 직접 읽고 쓰는 RDMA와 400G가 값을 합니다.
          </p>
        </div>

        <CalculationWalkthrough
          title="노드 사이로 흐르는 양"
          question="층을 나눌 때와 앞뒤 단계를 나눌 때 노드 밖으로 무엇이 얼마나 나갈까요?"
          scope="회선 속도만으로 나눈 이상값입니다. 프로토콜 오버헤드, 혼잡, 호스트 복사는 넣지 않았고 기억은 한 벌만 넘긴다고 둡니다."
          steps={[
            { label: "층 경계의 토큰 하나", expression: "7,168개 값 × 2byte", result: "14,336byte", reason: "다음 노드가 이어서 계산하려면 hidden 벡터 하나만 있으면 됩니다." },
            { label: "초당 2,000토큰의 경계 전송", expression: "2,000 × 14,336byte × 8bit", result: "약 0.23Gbps", reason: "토큰이 경계를 한 번씩 건넙니다. 100GbE의 0.2%입니다." },
            { label: "200K 대화의 기억", expression: "200,000토큰 × 70,272byte", result: "약 14.05GB", reason: "3절의 토큰당 기억을 그대로 씁니다. 앞 노드가 프롬프트 전체를 처리했을 때입니다." },
            { label: "100GbE로 넘기기", expression: "14.05GB ÷ 12.5GB/s", result: "약 1.12초", reason: "100Gb/s를 byte로 바꾸면 12.5GB/s입니다." },
            { label: "400G로 넘기기", expression: "14.05GB ÷ 50GB/s", result: "약 0.28초", reason: "같은 기억을 네 배 넓은 회선으로 보냅니다. 1byte 기억이면 다시 절반입니다." },
          ]}
          conclusion="복제본과 층 나누기는 100GbE로 충분하고, 앞뒤 단계를 나눌 때만 기억 전송이 첫 토큰 지연에 초 단위로 얹혀 RDMA와 400G가 필요해집니다."
          caveats={[
            "llm-d P/D 가이드는 NIXL이 TCP로도 돌지만 운영에는 RDMA를 강하게 권한다고 적습니다.",
            "GPUDirect RDMA 없이 호스트 메모리를 거치면 UCX의 cuda_copy 경로로 동작한 보고가 있고, 더 느립니다.",
          ]}
        />

        <NetworkNeedViz />

        <div className={prose}>
          <p>
            RDMA를 켤 때는 카드 쪽 증명이 먼저입니다. NVIDIA의 GPUDirect RDMA 문서는 지원 대상을 &ldquo;Tesla and Quadro&rdquo;로 적고
            RTX PRO 6000을 제품명으로 적은 공식 문서는 찾지 못했습니다. RTX PRO가 Quadro 계보라 포함된다고 읽을 수는 있지만 그건 해석입니다. 실증이라 할 만한 것은
            포럼 사용자 한 명이 Max-Q에서 동작했다고 보고한 정도입니다.
          </p>
          <p>
            노드마다 ib_write_bw --use_cuda로 네트워크 카드가 카드 메모리를 직접 읽는지 확인합니다. 같은 문서는 두 장치가 같은 root complex 아래 있어야 하고
            스위치만 거치는 길이 가장 좋으며 소켓을 건너는 길은 매우 느리거나 불안정할 수 있다고 적습니다. 7절의 topo 출력에서 NIC와 카드가 같은 스위치인지 보는 것도 이
            때문입니다.
          </p>
          <p>
            GPU 통신 라이브러리 NCCL에도 하나 짚을 값이 있습니다. NCCL_NET_GDR_READ의 기본값은 NVLink가 있는 플랫폼에서만 1이고 나머지는 0입니다. 이 노드처럼 PCIe만 있으면 직접 1로 적어야 송신 쪽도 카드 메모리를 직접 읽습니다.
          </p>
          <p>
            노드를 넘는 expert 분산(wide-EP)은 이 노드에서 보류합니다. DeepEP의 빠른 모드는 노드 안 NVLink를 전제하고, 8장 PCIe 노드에서 초기화가 실패한 이슈가 열려 있습니다. pplx는 vLLM에서 빠졌고, 남는 allgather_reducescatter는 토큰을 모든 rank에 모으므로 참여 노드가 늘수록 트래픽이 커집니다. llm-d의 wide-EP 가이드도 H200·B200과 모든 NIC 사이 RDMA 조건에서만 검증됐습니다.
          </p>
        </div>
      </section>

      <section id="kubernetes" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 쿠버네티스에서는 노드 하나가 복제본 하나입니다</h2>
        <div className={prose}>
          <p>
            8절의 결론을 쿠버네티스 객체로 옮기면 단순합니다. 복제본 하나가 노드 하나의 카드 여덟 장을 통째로 잡고, 요청 분배기가 복제본 앞에 섭니다. 아래 초안은 근거 조사에서 함께 만든 것이며 아직 어느 클러스터에도 적용하지 않았습니다.
          </p>
          <p>
            실행 단위로 LeaderWorkerSet(LWS) v1.0.0을 씁니다. 노드 하나짜리 복제본이면 size 1이라 Deployment로도 되지만 나중에 두 노드짜리로 바꿀 때
            객체 종류와 라벨이 그대로라 요청 분배기와 큐 설정을 다시 손대지 않아도 됩니다.
          </p>
        </div>
        <pre className="not-prose my-6 overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-5">
          <code>{LWS_EXCERPT}</code>
        </pre>
        <div className={prose}>
          <p>
            두 노드에 층을 나눌 때는 vLLM 자체의 멀티프로세스 런처를 씁니다. v0.32.0 코드는 노드가 둘 이상이면 실행기를 mp로 강제하고 Ray는 거부합니다. 같은 저장소의 다른 문서에 &ldquo;multi-node 기본은 Ray&rdquo;라는 낡은 문장이 남아 있으니 코드 쪽을 따릅니다.
          </p>
        </div>
        <pre className="not-prose my-6 overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-5">
          <code>{MULTINODE_EXCERPT}</code>
        </pre>
        <div className={prose}>
          <p>
            승인과 배치는 Kueue v0.20.4의 LWS 통합과 토폴로지 인지 배치(TAS)로 합니다. 쿠버네티스 1.34에서는 LWS 자체의 gang 기능이 1.37을 요구해 쓸 수
            없으므로 LWS 그룹 전체를 Kueue Workload 하나로 승인받습니다. TAS와 DRA를 함께 쓰려면 KueueDRADeviceFeasibility라는 alpha 게이트가
            필요하다는 점을 먼저 시험합니다.
          </p>
          <p>
            GPU Operator v26.7.2의 지원 목록에는 RTX PRO 6000 Blackwell Server Edition이 있고 Workstation Edition은 없습니다.
            그런데 GPU Operator가 카드를 DRA로 나눠 주는 경로(GPUCluster)에는 RDMA 설정 필드가 없습니다. GPUDirect RDMA는 호스트 작업으로 남으므로
            문서가 권하는 DMA-BUF 경로를 호스트 드라이버에서 준비합니다.
          </p>
          <p>
            NIC는 Network Operator v26.7.1로 붙입니다. 문서의 네트워크 모드 가운데 GPUDirect 전용으로 지정된 것은 없고 노드당 8장짜리 Pod 하나라면
            macvlan과 RDMA shared device plugin 조합이 가장 단순합니다. 다만 GPU는 DRA로, NIC는 device plugin으로 따로 받으면 둘을 같은
            NUMA에 맞춰 줄 장치가 없습니다(추론). 이 점도 수락 단계에서 확인합니다.
          </p>
          <p>
            복제본을 묶는 그룹 개념은{" "}
            <Link to="/cs/ai/onprem-k8s-inference-platform#group-replica">온프레미스 추론 플랫폼의 그룹 단위 복제본</Link>
            이 정본입니다. 이 글은 그 위에 PCIe 노드 하나의 조건만 얹습니다.
          </p>
        </div>
        <CitationBlock
          source="vLLM v0.32.0 · docs/deployment/frameworks/lws.md (Multiprocessing 탭)"
          citeKey={1}
          href="https://github.com/vllm-project/vllm/blob/v0.32.0/docs/deployment/frameworks/lws.md"
        >
          LWS 문서의 기본 탭은 멀티프로세스 실행입니다. 리더와 워커가 같은 vllm serve 명령에 --nnodes, --node-rank, --master-addr를 LWS 환경 변수로 채우고, 워커만 --headless를 붙입니다. 같은 태그의 arg_utils.py는 nnodes가 1보다 크면 실행기를 mp로 정하고, Ray에서 이 값을 쓰면 거부합니다. 이 글은 문서와 코드를 읽었을 뿐 클러스터에서 실행하지 않았습니다.
        </CitationBlock>
      </section>
    </>
  );
}
