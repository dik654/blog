import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CitationBlock } from "@/components/ui/citation";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

/**
 * 층위 6(원문 실물)·7(한계)·복습.
 * 인용은 15단어 이하로 짧게 두고 나머지는 자기 말로 옮겼다. 확인일은 모두 2026-11-03이다.
 */
export default function SourcesLimits() {
  return (
    <>
      <section id="sources" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 제품 문서·포럼·라이선스 원문이 말하는 것과 아닌 것</h2>
        <div className={prose}>
          <p>
            앞에서 쓴 판단의 원문을 하나씩 엽니다. 각 원문 아래에는 그 문장이 3절과 7절의 노드에서 무엇을 허용하고 무엇을 확인하라고 요구하는지를 적습니다.
          </p>
        </div>

        <div id="source-card" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Lenovo Press LP2263 · ThinkSystem NVIDIA RTX PRO 6000 Blackwell Server Edition PCIe Gen5 GPU"
            citeKey={2}
            href="https://lenovopress.lenovo.com/lp2263-thinksystem-nvidia-rtx-pro-6000-blackwell-server-edition-pcie-gen5-gpu"
          >
            사양표는 96GB GDDR7, 512-bit, 1,597GB/s, 최대 600W를 적고 밀도를 위해 450W로 제한할 수 있다고 씁니다. NVLink 지원 칸은 &ldquo;No&rdquo;입니다. 같은 페이지에 GPUDirect RDMA나 P2P에 관한 문장은 없습니다. 3절의 768GB와 5절의 1,597GB/s가 여기서 왔고, 카드 사이 길이 PCIe뿐이라는 전제도 이 칸 하나에서 나옵니다.
          </CitationBlock>
        </div>

        <div id="source-cx8" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA Technical Blog · ConnectX-8 SuperNICs Advance AI Platform Architecture with PCIe Gen6 Connectivity (2025-05-18)"
            citeKey={3}
            href="https://developer.nvidia.com/blog/nvidia-connectx-8-supernics-advance-ai-platform-architecture-with-pcie-gen6-connectivity"
          >
            ConnectX-8은 PCIe Gen6 스위치 48레인과 800Gb/s 네트워킹을 한 장치에 넣어 <q>eliminates the need for discrete PCIe switches</q>라고 설명합니다. GPU와 NIC를 2:1로 묶고 GPU당 최대 400Gb/s를 줍니다. all-to-all이 최대 두 배라는 문장은 조건이 없는 벤더 주장입니다. GPUDirect RDMA는 언급하지 않습니다. 7절 B안의 카드 8장에 NIC 4개는 이 비율로 계산한 것입니다.
          </CitationBlock>
        </div>

        <div id="source-ra" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA Enterprise Reference Architecture · RTX PRO AI Factory · Appendix"
            citeKey={4}
            href="https://docs.nvidia.com/enterprise-reference-architectures/rtx-pro-ai-factory/latest/appendix.html"
          >
            노드마다 RTX PRO 6000 Server Edition 8장, 2소켓, 시스템 메모리는 GPU당 128GB 이상(1TB 이상)을 권합니다. 컴퓨트 패브릭은 400G BlueField-3 SuperNIC 넷입니다. 이 레퍼런스도 카드 둘에 NIC 하나라는 비율을 지킵니다. 7절의 1.5TB는 이 하한 위에 3절의 기억 오프로드 몫을 더한 값입니다.
          </CitationBlock>
        </div>

        <div id="source-gdr" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · GPUDirect RDMA documentation (CUDA)"
            citeKey={5}
            href="https://docs.nvidia.com/cuda/gpudirect-rdma/index.html"
          >
            <q>GPUDirect RDMA is available on both Tesla and Quadro GPUs.</q> 같은 문서는 두 장치가 같은 PCIe root complex 아래 있어야 하고, 스위치만 거치는 길이 가장 좋으며, CPU 사이를 건너는 길은 <q>may perform very poorly or not work reliably</q>라고 씁니다. IOMMU는 끄거나 pass-through로 둡니다. RTX PRO 6000이라는 이름은 없으므로 8절의 노드별 ib_write_bw 확인이 필요합니다.
          </CitationBlock>
        </div>

        <div id="source-rtx6kpro" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="local-inference-lab/rtx6kpro (구 voipmonitor/rtx6kpro) · models/kimi-k25.md, benchmarks/results.md (커밋 1b6de11b)"
            citeKey={6}
            href="https://github.com/local-inference-lab/rtx6kpro"
          >
            디스코드 커뮤니티 기록을 정리한 위키입니다. Festr의 Turin 노드에서 vLLM, INT4, FP8 기억, DCP 8, 단일 배치로 P2P 켬 65·36·27, 끔 44·29·23 tok/s(0K·100K·200K)를 적습니다. Genoa 노드는 약 32입니다. 100동시 40K의 900 tok/s는 근거 스크린샷을 보면 P2P를 끈 상태였고 켠 상태는 약 600이었는데, 위키 본문은 이 조건을 빠뜨렸습니다. 반복 횟수와 오차가 없어 이 글은 모두 현장 경험으로만 씁니다.
          </CitationBlock>
        </div>

        <div className={prose}>
          <p>
            이어지는 원문은 이 노드가 고르지 않은 두 길에 관한 것입니다. 같은 돈으로 소비자용 카드를 더 많이 사는 길과 노드를 넘어 expert를 흩는 길입니다.
          </p>
        </div>

        <div id="source-geforce-license" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · License For Customer Use of NVIDIA GeForce Software (v. February 25, 2025)"
            citeKey={7}
            href="https://www.nvidia.com/en-us/drivers/geforce-license/"
          >
            2.8조는 GeForce 드라이버가 <q>is not licensed for datacenter deployment</q>라고 적습니다. 2.7조는 이 소프트웨어로 <q>commercial hosting services</q>를 제공하는 것을 금지합니다. 외부 고객에게 유료 LLM을 쿠버네티스로 제공하는 일은 2.7조에 바로 걸립니다. 48GB 개조 카드도 GeForce 드라이버로 돌므로 같은 조항을 피할 근거가 없다고 봅니다(해석). 법무 검토 전에는 상용 서빙에 넣지 않습니다.
          </CitationBlock>
        </div>

        <div className={prose}>
          <p>
            라이선스 말고도 RTX 4090을 빼는 이유가 둘 더 있습니다. P2P는 드라이버 525.105.17 이후 막혀 있고 비공식 P2P 패치에는 580 브랜치가 없습니다. GPUDirect RDMA도 앞 문서의 &ldquo;Tesla and Quadro&rdquo; 밖입니다. 48GB 개조판으로도 595GB 가중치만 담는 데 13장 이상이 필요해 한 벌이 노드 두 대에 걸칩니다. 개조 카드의 회로와 링크 차이는{" "}
            <Link to="/cs/gpu/modded-rtx4090-moe-serving">개조 RTX 4090과 MoE 서빙</Link>이 다룹니다.
          </p>
        </div>

        <div id="source-deepep" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="deepseek-ai/DeepEP issue #216 · llm-d v1.0.0 guides/wide-ep"
            citeKey={8}
            href="https://github.com/deepseek-ai/DeepEP/issues/216"
          >
            DeepEP 메인테이너는 <q>For normal mode, NVLink is a must</q>라고 답했고, 8장 PCIe 노드에서 초기화가 실패한 #584는 열려 있습니다. llm-d의 wide-EP 가이드는 32장 H200 클러스터에서만 검증했고, 네트워크가 <q>require all-to-all RDMA connectivity</q> 조건을 만족해야 한다고 적습니다. 그래서 8절은 이 노드의 확장을 복제본으로 하고 wide-EP를 비교 실험으로만 남겼습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="boundary" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">11. 이 노드 설계는 아직 한 번도 측정되지 않았습니다</h2>
        <div className={prose}>
          <p>
            가장 큰 한계부터 적습니다. 이 글의 어떤 숫자도 우리 손으로 잰 것이 아닙니다. 공식 사양, 코드와 문서 읽기, 커뮤니티 위키의 현장 경험, 그리고 그 위의 계산입니다. 위키
            숫자는 같은 사람이 같은 노드에서 낸 것이라 서로 비교할 만하지만 반복과 오차가 없어 배수를 일반 법칙으로 쓰지 않습니다.
          </p>
          <p>
            둘째, 1절의 900 tok/s는 요청 하나로 보면 9 tok/s입니다. 에이전트 서빙의 독립 평가 기준인 AA-AgentPerf Tier 1은 요청별 P25가 20 tok/s 이상이라 이 숫자는 그 기준에 못 미칩니다. 이 노드가 서비스 목표를 지키며 몇 에이전트를 받는지는 어디에도 측정돼 있지 않고, 측정 방법은{" "}
            <Link to="/cs/ai/agent-serving-slo-and-capacity">에이전트 서빙 SLO와 용량</Link>이 다룹니다.
          </p>
          <p>
            셋째, 가격을 넣지 않았습니다. 카드와 서버 값은 날마다 바뀌므로 파라미터로 둡니다. 손익분기는 서비스 목표를 지키는 처리량과 가동률이 정하고, 같은 처리량이면 가동률이 단가를 가장 크게 움직입니다. 비교의 자를 맞추는 법은{" "}
            <Link to="/cs/ai/own-vs-rent-inference-capacity#unit-mismatch">소유와 임대의 비교</Link>에 있습니다. 순서도 여기서 정해집니다. 같은 구성을 먼저 빌려 자기 워크로드 트레이스로 잰 뒤 그 숫자를 넣어 살지 정합니다.
          </p>
        </div>
        <ProgressiveDetail
          title="확인하지 못한 것과 열린 버그"
          preview="엔진 이미지, 기억 오프로드의 복제 여부, GPUDirect RDMA, 출력 drift가 아직 열려 있습니다."
        >
          <div className={prose}>
            <p>
              현장 측정은 PR 두 개를 얹은 커스텀 vLLM 이미지에서 나왔습니다. 공개 v0.32.0 이미지로 이 노드에서 Kimi K2.5가 돈 보고는 찾지 못했습니다. FP8 기억은 SM120에서 &ldquo;Out of Resource&rdquo;로 실패한 다른 모델의 이슈(#46721)도 있어 대상 이미지에서 먼저 켜 봐야 합니다.
            </p>
            <p>
              기억 오프로드가 TP rank마다 같은 기억을 각자 내리는지는 확인하지 못했습니다. 그렇다면 3절의 142개는 17개로 줄어 호스트 메모리 크기를 다시 정해야 합니다.
              시퀀스 분할의 출력 drift 버그 vllm#41623도 열려 있으니 켜기 전에 고정 프롬프트로 출력 비교를 돌립니다.
            </p>
            <p>
              GPUDirect RDMA는 NVIDIA 문서가 제품명으로 확인하지 않았습니다. Server Edition이 PCIe ATS를 광고하지 않아 ESXi의 P2P 경로가
              막힌다는 포럼 보고도 있어서 가상화를 끼우면 7절의 수락을 다시 해야 합니다.
            </p>
          </div>
        </ProgressiveDetail>
        <div className={prose}>
          <p>
            모델 구조가 이 계산을 어떻게 바꾸는지는{" "}
            <Link to="/cs/ai/serving-architecture-matrix">모델 구조별 서빙 비교</Link>에서, 기억이 카드마다 복제되는 이유와 시퀀스 분할의 대가는{" "}
            <Link to="/cs/ai/mla-kv-replication-and-decode-context-parallel">MLA KV 복제와 decode context parallel</Link>에서, 카드 사이 PCIe 길과 RDMA 원리는{" "}
            <Link to="/cs/gpu/gpu-interconnects#pcie-topology-peer-path">GPU 인터커넥트</Link>와{" "}
            <Link to="/cs/gpu/rdma-roce#gpudirect-topology">RDMA·RoCE</Link>에서 이어집니다.
          </p>
        </div>
      </section>

      <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">12. 같은 노드로 다음 경계를 예상해 보세요</h2>
        <div className={prose}>
          <p>
            사용률을 0.92에서 0.95로 올리면 3절의 기억 칸은 장마다 몇 GB가 되고, BF16 기억으로 몇 토큰이 늘까요? 카드를 여덟 장 더해도 이 수가 그대로인 이유는 무엇일까요? (답: 3절)
          </p>
          <p>
            같은 노드에서 컨텍스트 200K의 단일 사용자 속도가 P2P 켬 27, 끔 23 tok/s라면 맞추기 한 번에 붙는 시간은 0K 때보다 크게 보일까요, 작게 보일까요? 그 셈이 왜 위험할까요? (답: 5절)
          </p>
          <p>
            지금 100GbE에 붙은 이 노드를 두 대로 늘리면서 앞뒤 단계 분리를 함께 도입하려 합니다. 무엇을 먼저 증명하고 어떤 NCCL 값을 바꿔야 할까요? (답: 8절)
          </p>
        </div>
      </section>
    </>
  );
}
