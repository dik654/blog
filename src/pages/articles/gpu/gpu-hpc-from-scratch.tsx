import { Link } from 'react-router-dom';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import {
  CapabilityCheck,
  ComparisonTable,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { GpuScaleViz, HpcStackViz, MultiNodeJobViz, TransportPathViz } from './gpu-hpc-from-scratch/viz/GpuHpcViz';

export default function GpuHpcFromScratchArticle() {
  return (
    <>
      <section id="server-vs-hpc" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">GPU 서버 여러 대면 바로 HPC일까?</h2>
        <QuestionLead
          question="GPU 서버와 GPU HPC 클러스터의 경계는 어디인가?"
          answer="서버 대수가 아니라 하나의 계산을 여러 장치가 함께 수행하는가가 경계다. GPU 8장이 한 서버에서 각자 독립 추론을 하면 GPU server다. 여러 node가 collective communication으로 하나의 학습 step이나 시뮬레이션을 완성하면 HPC 성격이 강해진다."
        />
        <ConceptPrimer
          items={[
            { term: 'GPU', meaning: '같은 명령을 많은 데이터 조각에 적용하는 병렬 계산 장치다.', why: '행렬 곱, particle update, simulation grid처럼 반복 구조가 큰 계산에 유리하다.' },
            { term: 'Node', meaning: '하나의 운영체제 아래 CPU, RAM, GPU, NIC를 공유하는 서버 한 대다.', why: 'node 내부와 node 사이의 통신 장치와 지연이 완전히 다르다.' },
            { term: 'Cluster', meaning: '여러 node를 network와 scheduler로 묶은 자원 집합이다.', why: '자원 묶음만으로는 부족하고 workload가 분산 실행을 지원해야 한다.' },
            { term: 'HPC', meaning: '큰 계산을 병렬 분해해 여러 compute resource가 협력하도록 만든 시스템과 운영 방식이다.', why: 'GPU 구매보다 병렬 알고리즘, data movement, scheduling이 성능을 좌우한다.' },
          ]}
        />
        <GpuScaleViz />
        <Misconception>
          GPU server 100대를 같은 switch에 꽂아도 application이 process group과 collective를 만들지 않으면 하나의 거대한 GPU처럼 동작하지 않는다.
          물리적 연결, 통신 library, 분산 algorithm이 모두 필요하다.
        </Misconception>
      </section>

      <section id="scale-up-out" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">GPU는 어디까지 같은 컴퓨터처럼 묶일까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Scale-up</strong>은 한 node 안에서 GPU 수와 GPU 사이 대역폭을 늘리는 방향이다.
            PCIe는 CPU, GPU, NIC를 연결하는 범용 bus다. NVLink와 NVSwitch는 지원되는 GPU 사이에 더 높은 대역폭과 직접 peer access 경로를 제공한다.
            다만 제품 세대와 topology에 따라 연결 방식이 달라지므로 “NVLink가 있다”보다 <code>nvidia-smi topo -m</code> 같은 실제 topology가 중요하다.
          </p>
          <p>
            <strong>Scale-out</strong>은 node를 넘어간다. GPU memory의 tensor가 PCIe를 통해 NIC로 가고,
            switch fabric을 지나 다른 node의 NIC와 GPU로 전달된다. 이 구간은 NVLink가 아니라 Ethernet/RoCEv2 또는 InfiniBand가 담당한다.
          </p>
        </div>
        <ComparisonTable
          headers={['경계', '대표 연결', '공유되는 것', '주요 병목']}
          rows={[
            ['GPU 내부', 'HBM · SM interconnect', 'device memory와 cache', 'memory bandwidth · kernel efficiency'],
            ['Node 내부 scale-up', 'PCIe · NVLink · NVSwitch', '하나의 OS, process, topology', 'peer bandwidth · NUMA · PCIe hop'],
            ['Node 사이 scale-out', 'RoCEv2 · InfiniBand', '분산 process group', 'NIC · switch · congestion · collective'],
          ]}
        />
      </section>

      <section id="collectives" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">분산 학습은 무엇을 계속 주고받을까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Data Parallel 학습에서 각 GPU는 다른 mini-batch를 처리해 gradient를 만든다.
            다음 optimizer step 전에 모든 GPU가 같은 gradient 합 또는 평균을 가져야 하므로 <strong>all-reduce</strong>를 호출한다.
            이 교환은 training step마다 반복되기 때문에 network가 느리면 GPU가 계산을 마치고도 기다린다.
          </p>
          <p>
            Ring all-reduce는 tensor를 <M>N</M>개 chunk로 나눠 reduce-scatter와 all-gather 두 단계를 돈다.
            충분히 큰 message에서 각 GPU가 보내는 총량은 대략 다음과 같다.
          </p>
          <M display>{'V_{ring}\\approx 2\\,\\frac{N-1}{N}\\,S'}</M>
          <FormulaNote
            meaning="왜 2를 곱하나: 먼저 각 chunk의 합을 담당 GPU에 모으는 reduce-scatter, 다음에 완성된 chunk를 모두에게 나누는 all-gather가 각각 한 번 필요하다. 왜 (N-1)/N인가: GPU 하나는 전체 tensor S 중 자신의 1/N chunk를 제외한 나머지를 각 단계에서 전달하기 때문이다."
            symbols={[
              ['V_ring', 'GPU 하나가 한 all-reduce 동안 보내는 근사 byte 수'],
              ['N', 'collective에 참여하는 GPU 수'],
              ['S', 'gradient tensor 전체 크기(byte)'],
            ]}
          />
          <p>
            실제 시간은 byte 수만으로 정해지지 않는다. 작은 bucket을 많이 보내면 매번 생기는 startup latency가 커진다.
            큰 bucket은 bandwidth를 잘 쓰지만 backward 계산과 통신을 겹치는 시점이 늦어진다. NCCL tuning은 이 두 비용 사이의 균형을 찾는 일이다.
          </p>
        </div>
      </section>

      <section id="tcp-rdma" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">100G와 RoCEv2는 무엇이 다를까?</h2>
        <QuestionLead
          question="100GbE switch가 있으면 RoCEv2도 자동으로 되는가?"
          answer="아니다. 100GbE는 link의 전송률이고, RoCEv2는 Ethernet/IP/UDP 위에서 RDMA semantics를 제공하는 transport다. RDMA NIC, driver, memory registration, switch QoS와 congestion control, application library가 함께 맞아야 한다."
        />
        <TransportPathViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            100 gigabit per second를 byte 단위로 바꾸면 이론상 12.5 GB/s다. packet header, encoding, protocol overhead,
            traffic pattern 때문에 application이 보는 payload throughput은 더 작다.
          </p>
          <M display>{'100\\ \\mathrm{Gbit/s}\\div 8=12.5\\ \\mathrm{GB/s}'}</M>
          <FormulaNote
            meaning="왜 8로 나누나: 1 byte는 8 bit이기 때문이다. 이 값은 line-rate 상한이며, 실제 tensor 전송률은 protocol overhead, packet loss, congestion, PCIe와 memory copy 경로의 영향을 함께 받는다."
            symbols={[
              ['Gbit/s', '초당 전송되는 gigabit 수'],
              ['GB/s', '초당 전송되는 gigabyte 수'],
              ['12.5', '100Gb/s link의 이론적 byte-rate 상한'],
            ]}
          />
          <p>
            RoCEv2는 layer 3에서 route할 수 있지만 Ethernet을 자동으로 lossless하게 만들지는 않는다.
            ECN은 switch가 packet을 버리기 전에 congestion mark를 붙이고 sender가 rate를 낮추게 한다.
            PFC는 특정 priority를 잠시 pause할 수 있다. PFC를 과하게 쓰면 한 queue의 정체가 다른 flow로 번지는 head-of-line blocking과 pause propagation이 생길 수 있다.
          </p>
        </div>
        <ComparisonTable
          headers={['구분', '100GbE TCP', '100GbE + RoCEv2', 'InfiniBand']}
          rows={[
            ['의미', 'Ethernet link 위 socket 통신', 'Ethernet/IP 위 RDMA', 'HPC용 native switched fabric'],
            ['NIC', '일반 Ethernet NIC 가능', 'RoCE-capable RDMA NIC', 'InfiniBand HCA'],
            ['Data path', 'kernel socket stack 중심', 'registered memory와 NIC DMA', 'native RDMA queue와 fabric'],
            ['운영 핵심', 'routing · buffer · TCP', 'ECN/QoS · congestion · GID/VLAN/MTU', 'subnet manager · fabric topology'],
          ]}
        />
      </section>

      <section id="stack-boundaries" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">하드웨어와 소프트웨어는 어디서 나뉠까?</h2>
        <HpcStackViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            RoCEv2는 하드웨어와 소프트웨어가 함께 만드는 stack이다. NIC 안의 DMA와 queue engine은 hardware다.
            Linux RDMA subsystem, vendor driver, <code>libibverbs</code>, UCX, NCCL은 그 hardware를 application에 노출하는 software다.
          </p>
          <p>
            Kubernetes와 Slurm은 별도의 control plane이다. 어느 job이 어느 node와 GPU를 쓸지 정하고 quota, queue, retry를 관리한다.
            Kubernetes에서는 GPU device plugin과 RDMA device 노출 구성이 필요할 수 있지만, scheduler 자체가 packet을 전송하거나 all-reduce를 계산하지는 않는다.
          </p>
        </div>
        <Misconception>
          “CPU를 우회한다”는 말은 steady-state data path의 copy와 kernel processing을 줄인다는 뜻이다.
          memory 등록, queue 설정, completion 처리, 오류 복구까지 CPU와 OS가 완전히 사라진다는 뜻이 아니다.
        </Misconception>
      </section>

      <section id="two-node-job" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">두 노드 학습 작업은 어떤 순서로 살아날까?</h2>
        <QuestionLead
          question="서버 두 대에 GPU가 네 장씩 보인다면 바로 여덟 장 학습을 시작할 수 있을까?"
          answer="아니다. Scheduler가 GPU 8개를 함께 확보하고, worker 8개가 같은 rendezvous에서 membership을 완성하고, 각 process가 서로 다른 GPU에 결합한 뒤, NCCL communicator와 network transport가 만들어져야 첫 collective를 실행할 수 있다. 어느 하나라도 빠지면 ‘GPU는 보이지만 하나의 job은 아닌’ 상태다."
        />
        <ConceptPrimer
          items={[
            { term: 'Worker process', meaning: '분산 프로그램을 실행하는 독립된 일꾼 하나다.', why: '보통 GPU training에서는 process 하나가 GPU 하나를 맡는다.' },
            { term: 'Rank', meaning: 'worker group 전체에서 각 worker에게 붙는 0부터 시작하는 번호다.', why: '어느 worker가 어떤 tensor 조각과 collective 순서를 맡는지 구분한다.' },
            { term: 'World size', meaning: '같은 collective에 참여해야 하는 worker의 총수다.', why: '두 node에 GPU가 네 장씩이면 보통 8이며, 한 rank가 빠지면 같은 group이 완성되지 않는다.' },
            { term: 'Local rank', meaning: '한 node 안에서만 다시 0부터 세는 worker 번호다.', why: '각 process를 그 node의 GPU 0, 1, 2, 3에 하나씩 결합하는 데 쓴다.' },
            { term: 'Rendezvous', meaning: '같은 job의 worker들이 주소와 membership을 교환하는 만남 지점이다.', why: '서로 다른 node에서 시작한 process가 같은 world에 속한다는 사실을 합의한다.' },
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            예를 들어 Node A와 Node B에 GPU가 네 장씩 있다고 하자. Launcher는 각 node에서 worker 네 개를 만들고
            <code>WORLD_SIZE=8</code>과 서로 다른 <code>RANK=0…7</code>을 준다. 각 node 안에서는
            <code>LOCAL_RANK=0…3</code>이 다시 시작한다. 따라서 Node B의 전역 rank 4는 Node B의 local rank 0, 즉 GPU 0을 쓴다.
            전역 번호와 node 안 번호를 섞으면 두 process가 같은 GPU를 잡거나, 잘못된 device에서 collective를 호출할 수 있다.
          </p>
          <p>
            여기서 scheduler의 <strong>gang scheduling</strong>은 여덟 worker가 시작할 자원을 함께 확보하는 정책이다.
            일곱 worker만 먼저 띄우면 이들은 rendezvous 또는 첫 collective에서 마지막 rank를 기다리며 GPU memory를 차지한다.
            “Pending GPU가 하나뿐”이어도 실제로는 job 전체가 진척되지 않는 이유다.
          </p>
        </div>
        <MultiNodeJobViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모든 rank가 모였다고 끝이 아니다. NCCL은 communicator를 만들면서 GPU·NIC topology와 network plugin을 확인하고
            실제 transport를 고른다. <code>NET/Socket</code>으로도 결과가 맞을 수 있지만, RDMA를 의도했다면 이는 성능 계약의 실패다.
            반대로 초기화가 멈췄다면 bandwidth tuning보다 먼저 rank 수, rendezvous endpoint, firewall과 선택된 interface를 확인해야 한다.
          </p>
          <p>
            통신 시간이 얼마나 작은지 판단할 때는 “100G를 샀다”가 아니라 실제 all-reduce byte를 application이 얻은 effective bandwidth로 나눈다.
            Ring의 GPU당 통신량 <M>{'V_{ring}'}</M>을 앞 절에서 구했다면 숨길 수 없는 통신 시간의 낙관적 하한은 다음처럼 읽는다.
          </p>
          <M display>{'T_{comm}\\ge \\frac{V_{ring}}{B_{effective}}'}</M>
          <FormulaNote
            meaning="왜 통신량을 대역폭으로 나누나: 초당 옮길 수 있는 byte 수로 전체 byte 수를 나누면 전송에 필요한 최소 초가 되기 때문이다. ≥를 쓰는 이유는 실제 실행에는 collective 시작 지연, packet overhead, congestion과 동기화 대기가 더해져 이 값보다 빨라질 수 없기 때문이다."
            symbols={[
              ['T_{comm}', 'all-reduce 통신에 필요한 시간의 낙관적 하한(초)'],
              ['V_{ring}', 'GPU 하나가 ring all-reduce 동안 옮겨야 하는 총 byte 수'],
              ['B_{effective}', 'NCCL benchmark나 실제 job에서 관측한 유효 payload bandwidth(byte/s)'],
            ]}
          />
          <p>
            Backward 계산과 communication을 겹치면 wall-clock에서 일부를 숨길 수 있지만 byte 자체가 사라지지는 않는다.
            따라서 실행 receipt에는 rank와 GPU binding, 선택된 transport, all-reduce correctness뿐 아니라 message size별 bandwidth와 latency를 함께 남겨야 한다.
          </p>
        </div>
        <Misconception>
          “Loss가 내려가니 네트워크도 정상”은 성립하지 않는다. Socket fallback도 수학적으로 같은 gradient를 만들 수 있다.
          Correctness와 transport, throughput은 서로 다른 검증 항목이다.
        </Misconception>
      </section>

      <section id="mig-scheduling" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">MIG와 스케줄러는 언제 필요할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>MIG(Multi-Instance GPU)</strong>는 지원 GPU의 compute와 memory resource를 격리된 GPU instance로 나누는 기능이다.
            여러 작은 inference job, notebook, 개발 환경처럼 한 GPU를 독립 tenant에게 나누고 싶을 때 유용하다.
          </p>
          <p>
            큰 training job은 GPU 전체와 빠른 peer path를 쓰는 편이 단순하다. MIG instance는 GPU 전체와 같은 memory capacity나 interconnect 특성을 갖지 않는다.
            그래서 “HPC니까 MIG”가 아니라 <strong>격리와 높은 utilization이 목표인가, 하나의 큰 job의 통신 효율이 목표인가</strong>를 먼저 본다.
          </p>
        </div>
        <ComparisonTable
          headers={['요청', '권장 할당', '이유']}
          rows={[
            ['대형 multi-GPU training', 'whole GPU 여러 장', 'memory와 collective 경로를 단순하게 유지'],
            ['작은 추론 service 여러 개', 'MIG 또는 time-slicing 검토', '격리와 utilization을 높일 수 있음'],
            ['예약형 HPC batch', 'Slurm 또는 Kubernetes batch scheduler', 'gang scheduling과 queue 정책 필요'],
            ['온라인 inference', 'Kubernetes + serving autoscaling', 'request SLO와 replica lifecycle 중심'],
          ]}
        />
      </section>

      <section id="design-checklist" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">내 클러스터는 무엇부터 설계해야 할까?</h2>
        <CapabilityCheck
          title="구매 목록보다 먼저 답할 질문"
          items={[
            '한 job이 GPU 한 장, 한 node, 여러 node 중 어디까지 확장되는가?',
            '학습 step당 compute 시간과 collective byte는 얼마인가?',
            'GPU와 NIC가 같은 NUMA/PCIe root에 가까운가?',
            '필요한 것은 높은 bandwidth인가, 작은-message latency인가?',
            'RoCE라면 ECN, QoS, MTU, telemetry를 누가 운영하는가?',
            'whole GPU, MIG, time-slicing 중 isolation 요구에 맞는 것은 무엇인가?',
            'scheduler가 gang scheduling과 예약, retry를 지원해야 하는가?',
            'NCCL test와 실제 model benchmark로 topology를 검증했는가?',
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            기존의 <Link to={articlePath('gpu', 'hw-network')}>서버 네트워크 글</Link>은 connector와 Ethernet/InfiniBand 세대를 더 넓게 비교한다.
            실제 Kubernetes fleet 운영은 <Link to={articlePath('ai', 'k8s-gpu-fleet')}>Kubernetes GPU Fleet 글</Link>로 이어진다.
            이 글에서 먼저 잡아야 할 핵심은 scheduler와 transport, scale-up과 scale-out의 경계를 섞지 않는 것이다.
          </p>
          <p data-hpc-kv-handoff-link>
            이 구분은 학습에만 쓰이지 않는다. 긴 prompt에서 만든 KV cache를 다른 node의 decode worker로 옮기는
            <InternalLink slug="llm-disaggregated-serving"> 분리형 LLM Serving</InternalLink>에서는 GPU→NIC→fabric→NIC→GPU 경로의 payload bandwidth와 congestion이 TTFT에 직접 들어간다.
            100GbE line rate만 보고 끝내지 말고 RoCE·InfiniBand transport가 실제로 선택됐는지, 목적 GPU memory가 먼저 등록됐는지와 TCP fallback이 생겼는지를 같은 request trace로 검증한다.
          </p>
        </div>
        <SourceNotes
          sources={[
            { label: 'PyTorch torchrun documentation', href: 'https://docs.pytorch.org/docs/main/elastic/run.html', note: 'RANK, LOCAL_RANK, WORLD_SIZE, rendezvous와 multi-node worker launch의 현재 계약.' },
            { label: 'NVIDIA NCCL usage guide', href: 'https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage.html', note: 'Rank, communicator와 collective operation이 시작되는 순서.' },
            { label: 'NVIDIA NCCL logging guide', href: 'https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/logging.html', note: 'INIT, NET, GRAPH, TUNING log로 transport와 topology 선택을 증명하는 방법.' },
            { label: 'NVIDIA GPUDirect RDMA documentation', href: 'https://docs.nvidia.com/cuda/gpudirect-rdma/', note: 'GPU memory와 peer device DMA를 위한 Linux driver·memory mapping 경계.' },
            { label: 'NVIDIA NCCL networking troubleshooting', href: 'https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/networking_troubleshooting.html', note: 'RoCE interface와 GID 설정을 포함한 NCCL transport 운영 포인트.' },
            { label: 'Kubernetes device plugins', href: 'https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/', note: 'vendor device를 kubelet resource로 광고하고 할당하는 control plane 구조.' },
          ]}
        />
      </section>
    </>
  );
}
