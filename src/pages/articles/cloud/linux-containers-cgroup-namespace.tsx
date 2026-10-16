import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import CpuQuotaThrottleViz from "./linux-containers-cgroup-namespace/viz/CpuQuotaThrottleViz";
import ContainerThreeAxesViz from "./linux-containers-cgroup-namespace/viz/ContainerThreeAxesViz";
import { codeRefs } from "./linux-containers-cgroup-namespace/codeRefs";
import { linuxContainerTrees } from "./linux-containers-cgroup-namespace/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function LinuxContainersCgroupNamespaceArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. CPU를 12%만 쓰는 컨테이너가 왜 요청마다 100ms를 멈추나요?</h2>
          <div className={prose}>
            <p>
              (가정) CPU limit이 500m인 API 컨테이너가 있습니다. 모니터링의 CPU 사용률은 12%인데 요청의 p99 지연이 100ms 단위로 튑니다. 같은 노드의 옆 컨테이너는 hostname이 다르고 ps에 자기 프로세스만 보이며 80번 포트에 bind하려다 Permission denied를 받았습니다. 네 가지 증상은 서로 무관해 보이지만 커널 안에서는 세 가지 장치의 결과입니다.
            </p>
            <p>
              답을 먼저 적겠습니다. 리눅스에 "컨테이너"라는 커널 객체는 없습니다. 컨테이너는 보통의 프로세스 묶음에 세 겹을 씌운 것입니다. 얼마나 쓸 수 있는지는 cgroup이 정하고, 무엇이 보이는지는 namespace가 정하며, 무엇을 할 수 있는지는 capability와 사용자 ID가 정합니다.</p>
            <p>12%인데 멈추는 이유는 cgroup의 CPU quota가 100ms 주기마다 50ms만 주기 때문이며, hostname과 PID가 다른 이유는 namespace, bind 실패는 capability입니다.</p>
            <p>
              이 글은 Kubernetes의 requests와 limits, QoS, OOMKilled, securityContext가 서 있는 바닥입니다. 그 위층은 <a href="/cs/cloud/kubernetes-requests-limits-allocatable-qos#overview">requests와 limits가 실제로 하는 일</a>과 <a href="/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview">Pod 상태와 Event</a>에서 다루고, 메모리 쪽 OOM 점수 계산은 이미 <a href="/cs/cloud/linux-memory-page-cache-oom#overview">메모리 글</a>에 있어 이 글은 CPU와 namespace, capability를 채웁니다. 근거는 Linux v6.12와 Kubernetes v1.37.1 원문입니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 런타임은 프로세스 하나를 만들 때 플래그·디렉터리·비트맵 세 가지를 정합니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 컨테이너 런타임이 하는 일은 셋입니다. 첫째, 새 프로세스를 만들 때 clone 플래그 CLONE_NEW*를 켜서 그 프로세스가 볼 세계(mount 표, PID 번호판, 네트워크 장치, hostname)를 호스트와 분리합니다.</p>
            <p>둘째, /sys/fs/cgroup 아래에 디렉터리 하나를 만들고 그 안의 파일에 cpu.max·cpu.weight·memory.max 같은 숫자를 쓴 뒤 프로세스 PID를 cgroup.procs에 넣습니다. 셋째, 프로세스의 사용자 ID를 바꾸고 capability bounding set을 깎습니다.</p>
            <p>
              이 세 가지는 서로 독립입니다. cgroup은 PID namespace를 모르고, namespace는 CPU 양을 모릅니다. 그래서 cgroup만 쓴 systemd 서비스(한도는 있지만 호스트가 다 보임)도 있으며, namespace만 쓴 샌드박스(격리는 되지만 한도가 없음)도 있습니다.</p>
            <p>Kubernetes Pod는 셋을 다 쓰되 범위가 다릅니다. 네트워크·UTS·IPC namespace는 Pod 단위라 한 Pod 안의 컨테이너가 localhost를 공유하며, mount·PID namespace와 cgroup은 컨테이너 단위입니다.</p>
            <p>
              이 글이 다루는 것은 세 축의 커널 쪽 끝입니다. 어떤 파일에 어떤 숫자가 쓰이고 그 숫자가 어떤 커널 코드를 거쳐 증상이 되는지를 봅니다. 런타임이 이미지를 풀어 rootfs를 만드는 과정(overlayfs)은 <a href="/cs/cloud/linux-vfs-mount-page-cache-fsync#overview">파일이 디스크에 닿기까지</a>에서, Pod의 네트워크 namespace에 veth를 꽂는 과정은 <a href="/cs/cloud/linux-network-interface-route-netfilter-dns#overview">패킷이 프로세스에 닿기까지</a>에서 봅니다.
            </p>
          </div>
          <ContainerThreeAxesViz />
        </section>

        <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 50ms짜리 quota는 4 스레드가 12.5ms 만에 다 쓰고, 나머지 87.5ms는 멈춥니다</h2>
          <div className={prose}>
            <p>
              (가정) 1절의 컨테이너에는 cpu.max에 "50000 100000"이 쓰여 있습니다. 100,000µs 주기마다 50,000µs, 곧 0.5 CPU만큼의 실행 시간을 준다는 뜻입니다. 이 앱은 요청 하나를 받으면 스레드 네 개가 각각 15ms씩 CPU를 씁니다. 노드에는 빈 CPU가 넉넉해 네 스레드가 동시에 돕니다.
            </p>
            <p>
              주기가 시작되고 네 스레드가 함께 돌면 벽시계 1ms마다 cgroup의 실행 시간은 4ms씩 줄어듭니다. 12.5ms가 지나면 4 × 12.5 = 50ms가 되어 quota가 바닥납니다. 각 스레드에는 2.5ms씩 일이 남았지만 커널은 이 cgroup의 스레드를 모두 run queue에서 내립니다. 노드 CPU가 놀고 있어도 다음 주기가 시작되는 100ms까지 기다립니다.
            </p>
            <p>
              100ms에 quota가 다시 50ms로 채워지면 남은 2.5ms × 4 = 10ms를 쓰고 요청이 끝납니다. 15ms면 끝날 일이 102.5ms 걸렸습니다. 이 요청이 1초에 두 번 오면 CPU 사용 시간은 120ms이고 사용률은 12%입니다. 평균은 한도의 4분의 1인데 요청마다 한도에 부딪힙니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="요청 하나가 102.5ms 걸리는 과정"
            question="0.5 CPU 한도에서 4 스레드 × 15ms 요청은 얼마나 걸리고, 사용률은 얼마로 보일까요?"
            scope="cpu.max 50000 100000, 요청 하나 = 4 스레드가 동시에 각각 15ms, 노드에 빈 CPU 4개 이상, 요청은 1초에 2번, 주기 경계에 맞춰 도착한다고 가정합니다."
            steps={[
              { label: "주기당 quota", expression: "50,000µs ÷ 100,000µs", result: "0.5 CPU", reason: "cpu.max의 두 숫자는 '$PERIOD마다 $MAX까지'입니다. kubelet은 limit 500m을 500 × 100000 ÷ 1000 = 50000으로 바꿔 씁니다." },
              { label: "소진까지 벽시계", expression: "50ms ÷ 4 스레드", result: "12.5ms", reason: "네 스레드가 동시에 돌면 벽시계 1ms에 실행 시간 4ms가 빠집니다." },
              { label: "남은 일", expression: "(15 − 12.5) × 4", result: "10ms", reason: "스레드마다 2.5ms씩 남았지만 quota가 0이라 run queue에서 내려옵니다." },
              { label: "대기", expression: "100 − 12.5", result: "87.5ms", reason: "period timer가 100ms에 quota를 다시 채울 때까지 멈춥니다. 이 시간이 cpu.stat throttled_usec에 더해집니다." },
              { label: "완료 시각", expression: "100 + 10 ÷ 4", result: "102.5ms", reason: "다음 주기에 네 스레드가 2.5ms씩 마저 돕니다." },
              { label: "사용률", expression: "2 × 60ms ÷ 1,000ms", result: "12%", reason: "요청 둘이 쓴 120ms를 1초로 나눈 값입니다. 모니터링은 이 숫자만 보여 줍니다." },
            ]}
            conclusion="평균 12%는 한도 50%의 4분의 1이지만 요청 하나하나는 한도에 닿아 87.5ms씩 멈춥니다. CPU limit은 평균을 제한하는 것이 아니라 100ms 창마다 상한을 긋는 것입니다."
            caveats={["실제 커널은 quota를 CPU별 run queue에 5ms slice로 나눠 주므로 소진 시각이 수 ms 어긋날 수 있습니다.", "요청이 주기 중간에 도착하면 남은 quota만 쓸 수 있어 더 일찍 멈춥니다. 여기서는 가장 단순한 경우만 셌습니다."]}
          />
          <CpuQuotaThrottleViz />
        </section>

        <section id="names" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 한도를 적는 디렉터리가 cgroup, 비율은 weight, 상한은 max입니다</h2>
          <div className={prose}>
            <p>
              앞 절의 장치에 표준 이름을 붙입니다. 프로세스 집합의 자원 사용을 세고 제한하는 커널 기능이 cgroup(control group)이고, 지금 배포판이 쓰는 판은 v2입니다. v2는 /sys/fs/cgroup 아래 디렉터리 트리 하나이며, 디렉터리마다 cpu·memory·io·pids 같은 컨트롤러의 파일이 놓입니다. 프로세스는 정확히 한 디렉터리에 속하고, 디렉터리의 한도는 그 아래 모든 자손에 함께 적용됩니다.
            </p>
            <p>
              CPU 컨트롤러의 파일은 둘로 나뉩니다. cpu.weight는 경합할 때의 비율입니다. 기본 100이고 범위는 1~10000이며, 형제 cgroup A가 100·B가 300이면 CPU가 모자랄 때 1:3으로 나눕니다.</p>
            <p>놀고 있는 CPU는 weight와 무관하게 누구나 씁니다. cpu.max는 상한입니다. "$MAX $PERIOD" 두 숫자로 적고 기본값은 "max 100000"이라 주기만 있고 상한은 없습니다. 3절의 멈춤은 cpu.max만의 효과이고 weight는 관여하지 않았습니다.</p>
            <p>
              이 멈춤의 증거는 같은 디렉터리의 cpu.stat에 남습니다. nr_periods는 지나간 주기 수, nr_throttled은 멈춤이 있었던 주기 수, throttled_usec은 멈춘 시간의 합입니다.</p>
            <p>3절의 요청 둘은 1초에 nr_throttled 2, throttled_usec 175,000을 남깁니다. 메모리 컨트롤러의 memory.max·memory.high·memory.events는 6절에서, 세 컨트롤러가 함께 내는 압력 지표 PSI는 7절에서 봅니다.</p>
          </div>
          {code("cpu-max-doc", "cpu.max 정의")}
          {code("cpu-weight-doc", "cpu.weight 정의")}
          {code("cpu-stat-doc", "cpu.stat 항목")}
        </section>

        <section id="kubelet-translation" data-teach-level="2" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. kubelet은 requests를 weight로, limits를 max로 번역합니다</h2>
          <div className={prose}>
            <p>
              Kubernetes의 resources 필드는 이 두 파일의 다른 이름입니다. kubelet은 requests.cpu를 먼저 cgroup v1 시절의 단위인 shares로 바꿉니다. 1 CPU = 1024 shares라 500m은 512, 1000m은 1024, 2000m은 2048입니다.</p>
            <p>cgroup v2 노드에서는 이 shares를 다시 [1, 10000] 범위의 cpu.weight로 눌러 넣습니다. limits.cpu는 quota로 바꿉니다. milliCPU × 100000 ÷ 1000이라 500m이 50000µs, 2 CPU가 200000µs입니다.</p>
            <p>
              쓰이는 식은 선형 변환 하나입니다. shares 2~262144를 weight 1~10000에 대응시키므로 512 shares는 weight 20, 1024는 39, 2048은 79가 됩니다. 커널은 이 weight를 받아 자기 기준(weight 100 = shares 1024)으로 다시 shares 205·399·809로 저장합니다. 숫자는 두 번 바뀌지만 Pod끼리의 비율 1:2:4는 그대로 남습니다. weight가 정하는 것은 비율뿐이기 때문입니다.
            </p>
          </div>
          <ExplainedFormula
            question="requests.cpu 500m은 cgroup v2의 cpu.weight 몇이 됩니까?"
            idea="milliCPU를 1024 단위 shares로 바꾼 뒤, shares의 범위 [2, 262144]를 weight의 범위 [1, 10000]에 선형으로 겹칩니다."
            formula={"\\text{weight}=1+\\frac{(\\text{shares}-2)\\cdot 9999}{262142},\\quad \\text{shares}=\\frac{\\text{milliCPU}\\cdot 1024}{1000}"}
            annotatedFormula={"\\text{weight}=\\underbrace{1}_{\\text{weight 하한}}+\\frac{\\overbrace{(\\text{shares}-2)}^{\\text{shares 하한 위 거리}}\\cdot\\overbrace{9999}^{10000-1}}{\\underbrace{262142}_{262144-2}}"}
            operations={[
              { expression: "\\text{shares}=500\\cdot 1024/1000", annotation: ["정수 나눗셈으로 512입니다. 1000m은 1024, 2000m은 2048입니다."] },
              { expression: "(512-2)\\cdot 9999", annotation: ["510 × 9999 = 5,099,490입니다."] },
              { expression: "5{,}099{,}490/262142", annotation: ["19.45…이고 정수 나눗셈이라 19입니다.", "1 + 19 = 20이 cpu.weight입니다."] },
            ]}
            terms={[
              { symbol: "\\text{milliCPU}", name: "requests.cpu", description: "500m = 500. request가 없고 limit만 있으면 limit 값을 씁니다(kubelet이 API 서버의 기본값 채우기를 한 번 더 합니다)." },
              { symbol: "\\text{shares}", name: "cgroup v1 cpu.shares", description: "1 CPU = 1024. 0이면 2(커널 최소), 262144(256 CPU)가 최대입니다." },
              { symbol: "\\text{weight}", name: "cgroup v2 cpu.weight", description: "1~10000. 커널은 이 값을 weight × 1024 ÷ 100으로 다시 shares에 대응시켜 저장합니다." },
            ]}
            assumptions={["Kubernetes v1.37.1 pkg/kubelet/cm 코드의 정수 나눗셈을 그대로 따릅니다.", "cgroup v2 노드입니다. v1 노드는 shares를 그대로 cpu.shares에 씁니다."]}
            interpretation="같은 비율이면 같은 결과입니다. 500m·1000m·2000m 세 Pod는 weight 20·39·79를 받고 커널 안에서 shares 205·399·809가 됩니다. CPU가 모자랄 때 셋은 약 1:2:4로 나눠 씁니다. 노드 CPU가 남으면 셋 다 limit까지 씁니다."
          />
          <CalculationWalkthrough
            title="세 Pod의 cpu.weight와 cpu.max"
            question="requests 500m·1000m·2000m, limits 500m·없음·2000m인 세 컨테이너의 cgroup 파일은 각각 무엇이 됩니까?"
            scope="Kubernetes v1.37.1 kubelet, cgroup v2 노드, CPUCFSQuotaPeriod 기능 게이트 꺼짐(주기 100000µs 고정), cpuCFSQuota 기본 true입니다."
            steps={[
              { label: "A shares", expression: "500 × 1024 ÷ 1000", result: "512", reason: "MilliCPUToShares. 정수 나눗셈입니다." },
              { label: "A weight", expression: "1 + (512 − 2) × 9999 ÷ 262142", result: "20", reason: "getCPUWeight. 커널은 20 × 1024 ÷ 100 ≈ 205 shares로 저장합니다." },
              { label: "A cpu.max", expression: "500 × 100000 ÷ 1000", result: "50000 100000", reason: "MilliCPUToQuota. 3절의 바로 그 값입니다." },
              { label: "B weight", expression: "1 + (1024 − 2) × 9999 ÷ 262142", result: "39", reason: "1000m → 1024 shares → 39. 커널 저장값은 399입니다." },
              { label: "B cpu.max", expression: "limit 없음", result: "max 100000", reason: "limit이 없으면 quota를 쓰지 않아 기본값 그대로입니다. 노드 CPU가 남는 한 멈추지 않습니다." },
              { label: "C weight · cpu.max", expression: "2048 → 1 + 2046 × 9999 ÷ 262142 · 2000 × 100", result: "79 · 200000 100000", reason: "2 CPU는 100ms 주기에 200ms, 곧 두 CPU를 꽉 채워 쓸 수 있습니다." },
            ]}
            conclusion="requests는 비율(20:39:79), limits는 100ms마다의 상한(50ms·없음·200ms)입니다. B처럼 limit을 비우면 3절의 멈춤이 사라지고, 대신 노드가 바쁠 때 weight 비율만큼만 받습니다."
            caveats={["Static CPU Manager 정책으로 Guaranteed Pod에 CPU를 전용 할당하는 경우는 cpuset이라는 다른 컨트롤러를 씁니다. 이 글은 기본 정책만 다룹니다.", "limits.memory는 그대로 memory.max에 byte로 쓰입니다. 2Gi = 2,147,483,648입니다."]}
          />
          {code("kubelet-quota-shares", "MilliCPUToQuota · MilliCPUToShares")}
          {code("kubelet-cpu-weight", "shares → cpu.weight 선형식")}
          {code("kubelet-linux-resources", "spec → CRI LinuxContainerResources")}
          {code("weight-conversion", "커널의 weight ↔ shares")}
          <div id="paper-k8s-cpu-throttle" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Resource Management for Pods and Containers (2026-10-16 확인)" citeKey={1} href="https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/">
              <q>cpu limits are enforced by CPU throttling</q> 같은 문서는 메모리 한도는 커널의 OOM kill로 집행된다고 적어 두 limit의 증상이 다름을 명시합니다. CPU는 느려지고 메모리는 죽습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="memory-high-max" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. memory.high는 느려지게 하고, memory.max는 죽입니다</h2>
          <div className={prose}>
            <p>
              메모리 컨트롤러에도 두 종류의 선이 있습니다. memory.high를 넘으면 그 cgroup의 프로세스는 할당 때마다 직접 회수를 강제당해 느려지지만 OOM killer는 불리지 않습니다. 커널 문서는 이 보장을 한 문장으로 적습니다.</p>
            <p>극단적인 경우에는 high를 넘을 수도 있고, 그 넘침을 막는 마지막 벽이 memory.max입니다. max에 닿고 회수로 줄일 수 없으면 그 cgroup 안에서 OOM killer가 불려 점수가 가장 높은 프로세스가 SIGKILL을 받습니다.</p>
            <p>
              (가정) memory.max 2 GiB, memory.high 1.8 GiB인 컨테이너가 있다면, 1.8 GiB를 넘는 순간부터 할당이 느려지고 PSI memory가 오르며 memory.events의 high 카운터가 늘어납니다. 운영자는 이 구간에서 경보를 받고 한도를 올리거나 재시작을 고를 수 있습니다. high 없이 max만 있으면 느려지는 구간 없이 바로 137을 만납니다.
            </p>
            <p>
              Kubernetes 기본 설정은 두 번째 쪽입니다. v1.37.1 kubelet은 MemoryQoS 기능 게이트가 꺼진 기본 상태에서 memory.high에 "max"를 명시해 둡니다. 게이트를 켜면 requests + factor × (limits − requests)를 high로 계산하지만 이 기능은 아직 alpha입니다.</p>
            <p>그래서 기본 Kubernetes 컨테이너의 메모리 장애는 경고 구간 없이 OOMKilled로 나타납니다. 점수 계산과 137의 뜻, oom.group으로 함께 죽이는 규칙은 <a href="/cs/cloud/linux-memory-page-cache-oom#reclaim-path">메모리 글 8절</a>에 있습니다.</p>
          </div>
          {code("memory-high-max-doc", "memory.high · memory.max 정의")}
          {code("memory-high-guideline", "커널 문서의 운영 지침")}
          {code("kubelet-memory-high", "kubelet의 memory.high 처리")}
          <div id="paper-cgroup-v2-high" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Linux v6.12 Documentation/admin-guide/cgroup-v2.rst · memory.high" citeKey={2} href="https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/admin-guide/cgroup-v2.rst">
              <q>Going over the high limit never invokes the OOM killer and under extreme conditions the limit may be breached.</q> 같은 문서의 Usage Guidelines는 high를 공격적으로 낮게 잡아도 프로세스가 죽는 대신 점진적으로 느려지므로 운영자가 관찰하며 고칠 수 있다고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="psi" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. 사용률은 쓴 양을 세고, PSI는 자원 때문에 멈춘 시간을 셉니다</h2>
          <div className={prose}>
            <p>
              3절의 12%와 6절의 느려짐은 사용률 지표에 나타나지 않습니다. 사용률은 쓴 양을 세고, 두 증상은 못 쓰고 기다린 시간이기 때문입니다. 그 시간을 세는 지표가 PSI(Pressure Stall Information)입니다. /proc/pressure/cpu·memory·io 세 파일이 시스템 전체를, cgroup 디렉터리의 cpu.pressure·memory.pressure·io.pressure가 그 cgroup을 보여 줍니다.
            </p>
            <p>
              형식은 두 줄입니다. some 줄은 적어도 한 작업이 그 자원 때문에 멈춰 있던 시간의 비율이고, full 줄은 일할 수 있는 작업 전부가 동시에 멈춘 비율입니다. avg10·avg60·avg300은 최근 10·60·300초의 비율이고 total은 누적 µs입니다. 메모리 글 4절의 서버가 자주 읽는 파일 page까지 비우며 버벅일 때 오르는 것이 memory의 full이고, 노드 CPU가 모자라 run queue에서 기다리는 시간이 cpu의 some입니다.
            </p>
            <p>
              PSI 파일에 "some 150000 1000000"을 쓰면 1초 창에서 150ms 이상 멈출 때 poll()이 깨어나는 트리거가 됩니다. systemd-oomd가 커널 OOM 전에 cgroup을 정리하는 근거가 이 트리거입니다.</p>
            <p>3절의 quota 멈춤은 cpu.stat의 throttled_usec으로 직접 세는 쪽이 정확하므로, 컨테이너 CPU 진단은 cpu.stat을 먼저 보고 노드 전체 경합은 cpu.pressure를 봅니다. 노드 수준 도구는 <a href="/cs/cloud/linux-observability-proc-psi-perf-ebpf#overview">서버를 관측하는 도구</a>에서 이어집니다.</p>
          </div>
          {code("psi-doc", "PSI some·full 정의")}
          {code("psi-trigger", "PSI 트리거 형식")}
        </section>

        <section id="namespaces" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. namespace는 여덟 종류의 번호판을 바꿀 뿐 양은 바꾸지 않습니다</h2>
          <div className={prose}>
            <p>
              1절의 옆 컨테이너가 다른 hostname을 보고 ps에 자기 프로세스만 보는 이유는 namespace입니다. namespace는 커널의 전역 자원 하나를 여러 벌로 만들어 프로세스마다 다른 벌을 보여 주는 장치입니다. 종류는 여덟입니다.</p>
            <p>mount namespace는 마운트 표를 따로 갖고 PID namespace는 프로세스 번호를 따로 셉니다. network namespace는 장치와 주소, 포트, 라우팅 표, netfilter 규칙을 한 벌로 갖습니다.</p>
            <p>UTS namespace는 hostname을 분리하고 IPC namespace는 System V IPC와 메시지 큐를 분리합니다. user namespace는 UID와 GID 대응을 바꾸고, cgroup namespace는 cgroup 루트를, time namespace는 boot clock과 monotonic clock의 오프셋을 바꿉니다.</p>
            <p>
              커널 안에서 프로세스는 struct nsproxy 하나를 가리키고 그 안에 uts, ipc, mnt, pid, net, time, cgroup 일곱 namespace의 포인터가 들어 있습니다(user namespace는 자격 증명 쪽에 따로 있습니다). 컨테이너의 첫 프로세스는 clone 때 CLONE_NEWNS·CLONE_NEWPID 같은 플래그로 이 포인터들 가운데 몇 개를 새 객체로 바꾼 프로세스입니다.</p>
            <p>바꾸지 않은 포인터는 호스트와 같은 객체를 가리킵니다. 그래서 Kubernetes Pod 안의 컨테이너들은 network·UTS·IPC를 공유하고(같은 sandbox에서 만든 포인터를 물려받음) mount·PID는 각자 새로 받습니다.</p>
            <p>
              표의 마지막 열이 중요합니다. 어느 namespace도 CPU 시간이나 메모리 양을 격리하지 않습니다. 컨테이너 안에서 /proc/meminfo를 읽으면 노드 전체 메모리가 보이고, nproc은 노드의 CPU 수를 돌려줍니다.</p>
            <p>한도는 cgroup 파일에만 있어 JVM이나 Go 런타임은 cgroup 파일을 직접 읽어 자기 한도를 알아냅니다. PID namespace의 PID 1 규칙과 좀비 수거는 <a href="/cs/cloud/linux-process-signals-pid1-fds#paper-pid-namespaces">프로세스·신호 글</a>에, network namespace에 veth를 꽂아 Pod IP를 주는 과정은 <a href="/cs/cloud/linux-network-interface-route-netfilter-dns#overview">패킷 경로 글</a>에 있습니다.</p>
          </div>
          {code("namespaces-man", "namespaces(7) 여덟 종류")}
          {code("nsproxy", "struct nsproxy")}
          {code("clone-flags", "CLONE_NEW* 플래그")}
          <div id="paper-namespaces-man" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Linux man-pages · namespaces(7) · git master (2026-10-17 확인)" citeKey={3} href="https://man7.org/linux/man-pages/man7/namespaces.7.html">
              <q>A namespace wraps a global system resource in an abstraction</q> 이어지는 표는 Cgroup·IPC·Network·Mount·PID·Time·User·UTS 여덟 종류와 각각이 격리하는 자원을 적습니다. 메모리와 CPU 양은 어느 행에도 없습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="capabilities" data-teach-level="4" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. root 권한은 41개 비트로 쪼개져 있고, 컨테이너는 그중 14개로 시작합니다</h2>
          <div className={prose}>
            <p>
              1절의 bind 실패는 세 번째 축입니다. 전통적인 유닉스에서는 UID 0이면 모든 것을 할 수 있었습니다. 리눅스는 그 "모든 것"을 capability라는 비트 41개(0~40)로 쪼갰습니다.</p>
            <p>프로세스는 다섯 집합(Permitted·Effective·Inheritable·Bounding·Ambient)을 갖고, /proc/PID/status의 CapEff가 지금 쓸 수 있는 비트를 16진수로 보여 줍니다. 1024 미만 포트에 bind하는 능력은 번호 10번 CAP_NET_BIND_SERVICE이고, bind()는 이 비트가 없으면 EACCES를 돌려줍니다.</p>
            <p>
              Kubernetes 문서의 기본 컨테이너 예제는 CapEff 00000000a80425fb를 보여 줍니다. 아래에서 이 숫자를 풀면 14개 비트가 켜져 있고 그 안에 10번이 들어 있습니다. 그래서 root로 도는 기본 컨테이너는 80번 포트에 bind할 수 있습니다.</p>
            <p>1절의 컨테이너는 runAsUser 1000으로 돌았기 때문에 실패했습니다. UID가 0이 아니면 execve 때 Permitted·Effective가 비워지므로, 필요한 비트 하나만 capabilities.add로 돌려주면 됩니다.</p>
          </div>
          <CalculationWalkthrough
            title="CapEff 00000000a80425fb 읽기"
            question="기본 컨테이너의 capability bitmap에 어떤 능력이 켜져 있고, 80번 포트에 bind할 수 있습니까?"
            scope="Kubernetes 문서 security-context 예제의 값입니다. 번호표는 Linux v6.12 include/uapi/linux/capability.h를 따릅니다. 16진수 한 자리는 비트 네 개입니다."
            steps={[
              { label: "자리 나누기", expression: "a8 04 25 fb", result: "비트 31~24 · 23~16 · 15~8 · 7~0", reason: "오른쪽 끝 fb가 비트 0~7입니다." },
              { label: "fb", expression: "1111 1011", result: "0,1,3,4,5,6,7", reason: "CHOWN·DAC_OVERRIDE·FOWNER·FSETID·KILL·SETGID·SETUID. 2번 DAC_READ_SEARCH는 꺼져 있습니다." },
              { label: "25", expression: "0010 0101", result: "8,10,13", reason: "SETPCAP(8)·NET_BIND_SERVICE(10)·NET_RAW(13). 10번이 켜져 있으므로 root 컨테이너는 1024 미만에 bind할 수 있습니다." },
              { label: "04", expression: "0000 0100", result: "18", reason: "SYS_CHROOT. 12번 NET_ADMIN과 21번 SYS_ADMIN은 꺼져 있어 라우팅 표를 바꾸거나 mount할 수 없습니다." },
              { label: "a8", expression: "1010 1000", result: "27,29,31", reason: "MKNOD·AUDIT_WRITE·SETFCAP." },
              { label: "합계", expression: "7 + 3 + 1 + 3", result: "14개", reason: "containerd·Docker의 기본 집합입니다. 41개 가운데 27개는 Bounding set에서도 빠져 있어 setuid 바이너리를 실행해도 얻지 못합니다." },
            ]}
            conclusion="기본 컨테이너는 NET_BIND_SERVICE를 갖지만 runAsUser를 0이 아닌 값으로 두면 execve 때 집합이 비워집니다. 80·443을 쓰려면 capabilities.add: [NET_BIND_SERVICE] 하나를 주고, 나머지는 drop: [ALL]로 비우는 것이 가장 좁은 설정입니다."
            caveats={["ns_capable은 그 네트워크 namespace를 소유한 user namespace 기준으로 확인합니다. user namespace를 쓰는 rootless 컨테이너는 안에서 root처럼 보여도 호스트 자원에는 권한이 없습니다.", "allowPrivilegeEscalation: false는 커널의 no_new_privs 비트를 켜 setuid와 파일 capability로 권한이 늘어나는 길을 막습니다. 기본값은 true입니다."]}
          />
          {code("cap-numbers", "capability 번호표")}
          {code("bind-cap-check", "bind()의 CAP_NET_BIND_SERVICE 확인")}
          {code("capabilities-bind-man", "capabilities(7) · NET_BIND_SERVICE")}
          {code("capabilities-man", "Bounding · Ambient 집합")}
          <div id="paper-k8s-security-context" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Configure a Security Context for a Pod or Container (2026-10-17 확인)" citeKey={4} href="https://kubernetes.io/docs/tasks/configure-pod-container/security-context/">
              <q>CapPrm: 00000000a80425fb</q> capabilities 필드를 주지 않은 컨테이너의 /proc/1/status 출력입니다. 같은 문서는 allowPrivilegeEscalation이 no_new_privs 플래그를 직접 제어하며 기본값이 true라고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="kernel-source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 원문은 실행 시간을 빼고, 통에서 slice를 받고, 못 받으면 run queue를 내립니다</h2>
          <div className={prose}>
            <p>
              3절의 멈춤을 Linux v6.12 kernel/sched/fair.c에서 따라갑니다. cpu.max에 쓴 두 숫자는 core.c의 cpu_max_write → tg_set_cfs_bandwidth(9298행)로 들어가 task group의 cfs_bandwidth 구조체에 quota 50,000,000ns·period 100,000,000ns로 저장됩니다. quota는 1ms 이상, period는 1ms 이상 1초 이하여야 합니다(9291–9313행).
            </p>
            <p>
              실행 중인 스레드가 CPU를 쓸 때마다 스케줄러는 __account_cfs_rq_runtime(5812행)으로 그 CPU의 run queue가 가진 runtime_remaining에서 delta_exec를 뺍니다.</p>
            <p>0 이하가 되면 assign_cfs_rq_runtime이 cgroup 공용 통 cfs_b-&gt;runtime에서 slice 5ms를 꺼내 옵니다(5800–5808행). 통까지 비어 있으면 resched_curr로 현재 스레드를 내리고, 다음 스케줄 결정에서 check_cfs_rq_runtime(6488행)이 throttle_cfs_rq(5915행)를 불러 이 cgroup의 run queue 전체를 dequeue합니다. 1절의 네 스레드가 내려오는 순간입니다.</p>
            <p>
              100ms마다 hrtimer가 sched_cfs_period_timer → do_sched_cfs_period_timer(6279행)를 부릅니다. nr_periods를 올리고 __refill_cfs_bandwidth_runtime(5748행)으로 통에 quota를 더하되 quota + burst로 자릅니다.</p>
            <p>멈춘 run queue가 있었으면 nr_throttled을 올리고 distribute_cfs_runtime으로 runtime을 나눠 주며 unthrottle합니다. cpu.stat을 읽으면 core.c의 cpu_cfs_stat_show(9583행)가 이 카운터들을 그대로 출력합니다.</p>
          </div>
          <AlgorithmBlock
            title="100ms 주기 하나에서 quota가 소진되고 다시 채워지는 순서"
            input={["quota = 50,000µs, period = 100,000µs, burst = 0 (cpu.max \"50000 100000\")", "runtime(통) = 50,000µs, 각 CPU run queue의 runtime_remaining = 0", "네 스레드가 네 CPU에서 동시에 시작, 각각 15,000µs 일"]}
            steps={[
              { code: "on tick: rq.runtime_remaining -= delta_exec", note: "1ms마다 네 run queue에서 각각 1,000µs가 빠집니다. 처음에는 0 이하라 바로 다음 줄로 갑니다." },
              { code: "if rq.runtime_remaining <= 0: amount = min(slice 5000, 통.runtime); 통.runtime -= amount; rq.runtime_remaining += amount", note: "네 run queue가 각각 5,000µs를 받아 통은 50,000 → 30,000. 5ms 뒤 다시 받아 10,000, 10ms 뒤 마지막 10,000을 넷이 2,500씩 나눠 받아 통은 0입니다." },
              { code: "if amount == 0: resched_curr(rq)", note: "12.5ms 시점, 통이 비어 amount 0. 현재 스레드를 내려 다음 스케줄 결정을 강제합니다." },
              { code: "check_cfs_rq_runtime → throttle_cfs_rq: if !__assign(cfs_b, rq, 1ns): dequeue whole rq; list_add(throttled_cfs_rq)", note: "1ns도 못 받으므로 네 run queue 모두 dequeue. 스레드들은 runnable이지만 돌지 않습니다. 이 시간이 throttled_time에 쌓입니다." },
              { code: "at 100ms: period_timer → nr_periods++; 통.runtime = min(통.runtime + quota, quota + burst)", note: "통이 다시 50,000µs. burst가 0이라 지난 주기에 안 쓴 몫은 넘어오지 않습니다." },
              { code: "if throttled list not empty: nr_throttled++; distribute_cfs_runtime(); unthrottle", note: "nr_throttled이 1이 되고 네 run queue가 runtime을 받아 다시 돕니다. 남은 2,500µs × 4를 쓰고 요청이 끝납니다." },
            ]}
            repeatUntil="주기마다 반복합니다. 두 주기 연속 아무도 쓰지 않으면 timer가 idle로 멈췄다가 다음 할당 때 다시 시작합니다."
            output="cpu.stat: nr_periods 2, nr_throttled 1, throttled_usec 87,500(요청 하나 기준). 사용률은 12%, 요청 지연은 102.5ms."
          />
          {code("cfs-assign", "실행 시간 차감과 slice 받기")}
          {code("cfs-slice", "slice 5ms와 주기별 refill")}
          {code("cfs-throttle", "throttle_cfs_rq")}
          {code("cfs-check", "check_cfs_rq_runtime")}
          {code("cfs-period-timer", "period timer")}
          {code("cpu-max-write", "cpu.max 쓰기와 범위 검사")}
          {code("cpu-weight-write", "cpu.weight 쓰기")}
          {code("cpu-stat-show", "cpu.stat 출력")}
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 볼 파일은 cpu.stat과 pressure, 고칠 곳은 limit과 capability입니다</h2>
          <div className={prose}>
            <p>
              진단은 cgroup 디렉터리에서 시작합니다. 컨테이너 안에서 cat /sys/fs/cgroup/cpu.stat의 nr_throttled·throttled_usec이 오르면 3절의 멈춤이 일어나고 있습니다.</p>
            <p>memory.events의 high·max·oom_kill은 6절의 두 선 가운데 어디에 닿았는지를, cpu.pressure·memory.pressure의 some·full은 그 때문에 얼마나 멈췄는지를 보여 줍니다. 사용률 그래프는 이 셋 가운데 아무것도 보여 주지 않습니다.</p>
            <p>
              CPU 고치기에는 세 길이 있습니다. limit을 지우면 quota가 사라지고 weight 비율만 남아 노드가 바쁠 때만 느려집니다. limit을 올리면 주기당 상한이 커져 멈춤이 줄지만 평균 사용률과는 다른 기준으로 잡아야 합니다. 3절처럼 스레드 수 × 요청당 CPU 시간이 한 주기에 들어갈 만큼이어야 합니다.</p>
            <p>cpu.max.burst를 주면 지난 주기에 안 쓴 몫을 다음 주기에 더 쓸 수 있지만 Kubernetes는 아직 이 파일을 노출하지 않습니다. 멀티스레드 런타임은 GOMAXPROCS나 JVM의 ActiveProcessorCount를 limit에 맞춰 두면 한 주기 안에서 quota를 쪼개 쓰는 스레드가 줄어듭니다.</p>
            <p>
              메모리는 high와 max를 떨어뜨려 느려지는 구간을 만드는 것이 커널 문서의 권장이지만 Kubernetes 기본값은 high를 쓰지 않으므로 애플리케이션 쪽 지표나 memory.events.max 증가로 경보를 대신합니다.</p>
            <p>권한은 runAsNonRoot와 drop ALL에서 출발해 9절처럼 필요한 비트만 돌려주고, allowPrivilegeEscalation: false로 no_new_privs를 켭니다. namespace는 격리의 겉모습만 바꾸므로 "컨테이너 안이니 안전하다"는 가정은 Bounding set과 seccomp로 뒷받침해야 합니다.</p>
            <p>
              이 글의 수치는 kubelet·커널의 식에 가정한 spec을 넣어 손으로 계산한 것이며 실제 노드에서 잰 값이 아닙니다. slice 분배와 주기 중간 도착은 결과를 수 ms 바꿉니다. 이 바닥 위에서 Kubernetes가 requests 합으로 노드를 고르고 Allocatable을 계산하는 과정은 <a href="/cs/cloud/kubernetes-requests-limits-allocatable-qos#overview">requests와 limits가 실제로 하는 일</a>에서, 멈춤이 liveness probe 실패와 재시작으로 번지는 경로는 <a href="/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview">Pod 상태와 Event</a>에서 이어집니다.
            </p>
          </div>
          <ContentBoundary article="linux-containers-cgroup-namespace" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 같은 사례로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>3절의 앱이 스레드를 둘로 줄여 요청당 2 × 30ms를 쓴다면 quota 50ms는 벽시계 몇 ms에 바닥나고 요청은 몇 ms 걸릴까요? (답: 3절)</p>
            <p>requests.cpu 250m인 Pod의 cpu.weight는 얼마이고, 커널은 그것을 shares 몇으로 저장할까요? (답: 5절)</p>
            <p>CapEff가 00000000a80425fb인 컨테이너에서 ip route add를 실행하면 성공할까요? 어느 비트가 결정하나요? (답: 9절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={linuxContainerTrees}
        projectMetas={{
          linux: { id: "linux", label: "Linux v6.12 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          kubernetes: { id: "kubernetes", label: "Kubernetes v1.37.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          "man-pages": { id: "man-pages", label: "Linux man-pages 원문", badgeClass: "bg-emerald-500/10 border-emerald-500 text-emerald-700" },
        }}
      />
    </>
  );
}
