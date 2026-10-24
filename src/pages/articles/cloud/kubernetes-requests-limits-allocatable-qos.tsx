import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import AllocatableLedgerViz, { AllocatableFormulaViz } from "./kubernetes-requests-limits-allocatable-qos/viz/AllocatableLedgerViz";
import ThrottlePeriodViz from "./kubernetes-requests-limits-allocatable-qos/viz/ThrottlePeriodViz";
import { codeRefs } from "./kubernetes-requests-limits-allocatable-qos/codeRefs";
import { k8sResourcesTrees } from "./kubernetes-requests-limits-allocatable-qos/fileTree";
import KubernetesSeriesLocator, { KubernetesMapReturn } from "./kubernetes-shared/KubernetesSeriesLocator";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

function ResourceIncidentViz() {
  return (
    <figure className="not-prose my-6 grid gap-3 sm:grid-cols-3" aria-label="requests와 limits를 혼동할 때 나타나는 세 증상">
      {[
        ["배치", "실사용 18%", "requests 합계는 가득 참", "Pending"],
        ["CPU", "평균 사용률 50%", "100ms 주기 quota 소진", "p99 증가"],
        ["메모리", "limit 초과", "커널이 프로세스 종료", "OOMKilled"],
      ].map(([stage, seen, cause, result]) => (
        <div key={stage} className="rounded-xl border border-border p-4">
          <span className="text-xs font-bold text-primary">{stage}</span>
          <strong className="mt-2 block text-sm">{seen}</strong>
          <div className="my-3 h-px bg-border" />
          <p className="text-xs leading-5 text-muted-foreground">{cause}</p>
          <p className="mt-2 text-sm font-bold text-foreground">→ {result}</p>
        </div>
      ))}
    </figure>
  );
}

function EvictionOrderViz() {
  const rows = [
    { name: "A · Burstable", request: "2Gi", usage: "3Gi", excess: "+1Gi", rank: "1번째" },
    { name: "B · BestEffort", request: "0", usage: "0.5Gi", excess: "+0.5Gi", rank: "2번째" },
    { name: "C · Guaranteed", request: "4Gi", usage: "3.9Gi", excess: "request 이하", rank: "마지막" },
  ];
  return (
    <figure className="not-prose my-6 overflow-hidden rounded-xl border border-border" aria-label="요청량 초과분에 따른 Pod 축출 순서">
      {rows.map((row) => (
        <div key={row.name} className="grid grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,0.75fr))] gap-2 border-b border-border px-3 py-3 text-xs last:border-b-0 sm:text-sm">
          <strong>{row.name}</strong><span>{row.request}</span><span>{row.usage}</span><span className="text-right font-bold text-primary">{row.excess} · {row.rank}</span>
        </div>
      ))}
      <figcaption className="border-t border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">왼쪽부터 Pod, request, 실제 사용량, 초과량과 축출 순서입니다. QoS 이름만으로 순서를 정하지 않습니다.</figcaption>
    </figure>
  );
}

export default function KubernetesRequestsLimitsAllocatableQosArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. CPU가 82% 놀고 있는 노드에 Pod가 왜 Pending으로 남나요?</h2>
          <KubernetesSeriesLocator current="resources" question="같은 YAML의 requests와 limits는 배치 단계와 실행 단계에서 각각 누가 사용할까요?" bridge="checkout Pod가 Node를 고를 때와 Node에서 실행될 때 쓰는 자원 기준을 확대합니다." />
          <ResourceIncidentViz />
          <div className={prose}>
            <p>
              (가정) 노드 3대짜리 클러스터에서 새 Deployment를 올렸는데 Pod 하나가 Pending에서 움직이지 않습니다. kubectl describe에는 <code>0/3 nodes are available: 3 Insufficient cpu.</code>가 적혀 있는데 모니터링 대시보드의 노드 CPU 사용률은 18%입니다.
            </p>
            <p>
              같은 주에 다른 팀의 컨테이너는 CPU 사용률 50%에서 p99 지연이 두 배로 뛰었고, 또 다른 컨테이너는 아무 로그 없이 OOMKilled로 재시작했습니다. 세 사건은 모두 requests와 limits라는 두 숫자가 어디서 누구에게 읽히는지 모르면 설명이 안 됩니다.
            </p>
            <p>
              답을 먼저 적겠습니다. requests는 scheduler의 숫자이고 limits는 커널의 숫자입니다. scheduler는 노드의 실제 사용량을 보지 않고 이미 배치된 Pod들의 requests 합을 Allocatable과 비교해서 자리를 정합니다. 그래서 노드가 놀고 있어도 requests 합이 차 있으면 Pending입니다.
            </p>
            <p>
              limits는 노드에 도착한 뒤 kubelet이 cgroup에 쓰는 값이고 CPU limit은 100ms 주기마다 쓸 수 있는 시간을 정해 넘치면 멈추게 하며 memory limit은 넘치면 커널이 OOM kill로 끝냅니다. 둘 다 "limit"이지만 하나는 느려지고 하나는 죽습니다.
            </p>
            <p>이 글은 Kubernetes v1.37.1 원문과 공식 문서를 따라 세 숫자(Allocatable·requests·limits)가 어디서 계산되고 어디서 집행되는지 한 노드의 장부로 끝까지 추적합니다.
            </p>
            <p>
              컨테이너 한도가 커널에서 cgroup v2의 cpu.max·memory.max로 구현되는 바닥은 <a href="/cs/cloud/linux-containers-cgroup-namespace#overview">컨테이너는 cgroup과 namespace다</a>에서, OOM 점수 계산은 <a href="/cs/cloud/linux-memory-page-cache-oom#overview">리눅스 메모리 글</a>에서 이어받습니다. 시리즈 지도는 <a href="/cs/cloud/kubernetes-concept-map#overview">Kubernetes 개념 지도</a>에 있습니다.</p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 같은 YAML의 두 숫자를 scheduler와 kubelet이 따로 읽습니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 흐름은 세 칸입니다. 운영자가 Pod spec에 <code>resources.requests</code>와 <code>resources.limits</code>를 적습니다. API 서버가 그 Pod를 받아 두면 scheduler가 requests만 읽어 노드를 고르고, 고른 노드의 kubelet이 limits를 읽어 컨테이너의 cgroup에 씁니다. 그 뒤로는 Kubernetes가 아니라 리눅스 커널이 한도를 집행합니다.
            </p>
            <p>
              이 분업 때문에 두 숫자의 뜻이 갈립니다. requests는 "이만큼은 확보해 달라"는 예약이라 노드의 장부에서 빠져나가지만 컨테이너가 실제로 그만큼 쓰는지와는 무관합니다. limits는 "이 이상은 못 쓴다"는 상한이라 장부와 무관하게 컨테이너가 닿는 순간에만 작동합니다. requests가 작으면 스케줄은 잘 되는데 노드가 터지고, requests가 크면 노드가 놀아도 Pending입니다.
            </p>
            <p>면접에서 "requests와 limits의 차이"를 물으면 대개 이 세 칸을 기대합니다. 이 글은 한 칸씩 숫자로 채웁니다. 3절이 노드 장부의 출발점인 Allocatable, 4절이 scheduler의 비교, 6~7절이 kubelet과 커널의 집행, 8~9절이 그 뒤의 eviction과 admission입니다.</p>
          </div>
        </section>

        <section id="allocatable" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 32Gi·16 CPU 노드가 Pod에 내주는 몫은 28.5Gi·14.5 CPU입니다</h2>
          <AllocatableFormulaViz />
          <div className={prose}>
            <p>공식 문서의 예를 그대로 가져옵니다. 메모리 32Gi, CPU 16, 디스크 100Gi인 노드에서 kubelet 자신과 컨테이너 런타임 몫으로 kubeReserved를 {"{"}cpu 1000m, memory 2Gi, ephemeral-storage 1Gi{"}"}로 두었습니다.</p>
            <p>sshd·systemd 같은 OS 데몬 몫인 systemReserved는 {"{"}cpu 500m, memory 1Gi, ephemeral-storage 1Gi{"}"}이고, 메모리가 500Mi 아래로 내려가면 Pod를 쫓아내기 시작하는 evictionHard는 {"{"}memory.available: &lt;500Mi, nodefs.available: &lt;10%{"}"}입니다.</p>
            <p>이 노드가 Pod에 내줄 수 있는 양이 Allocatable이고 Capacity에서 두 예약과 eviction 하한을 뺀 값입니다. 메모리는 32 − 2 − 1 − 0.5 = 28.5Gi, CPU는 16 − 1 − 0.5 = 14.5, 디스크는 100 − 1 − 1 − 10 = 88Gi입니다. CPU에는 eviction 하한이 없어 두 예약만 뺍니다.</p>
            <p>두 예약은 설정하지 않으면 0이지만 eviction 하한은 설정하지 않아도 기본값이 있습니다. kubelet 소스의 DefaultEvictionHard는 memory.available 100Mi, nodefs.available 10%, nodefs.inodesFree 5%, imagefs.available 15%, imagefs.inodesFree 5%입니다. 아무 설정도 없는 노드의 Allocatable 메모리는 Capacity − 100Mi라는 뜻입니다.</p>
          </div>
          <CalculationWalkthrough
            title="Allocatable 28.5Gi·14.5 CPU가 나오는 과정"
            question="32Gi·16 CPU·100Gi 노드에서 scheduler가 Pod requests 합의 상한으로 삼는 숫자는 얼마일까요?"
            scope="공식 문서 reserve-compute-resources의 예시 값을 그대로 씁니다. Allocatable = Capacity − kubeReserved − systemReserved − evictionHard이고 CPU에는 evictionHard 항목이 없습니다."
            steps={[
              { label: "메모리 예약", expression: "2Gi + 1Gi", result: "3Gi", reason: "kubeReserved 2Gi는 kubelet·런타임 몫, systemReserved 1Gi는 OS 데몬 몫입니다. 둘 다 운영자가 적어야 생기는 값입니다." },
              { label: "메모리 eviction 하한", expression: "memory.available < 500Mi", result: "0.5Gi", reason: "available이 이 아래로 내려가면 kubelet이 Pod를 쫓아내므로 Pod에 약속할 수 없는 몫입니다. 기본값은 100Mi이고 예시는 500Mi로 올렸습니다." },
              { label: "Allocatable 메모리", expression: "32 − 3 − 0.5", result: "28.5Gi", reason: "scheduler는 이 노드 Pod들의 memory requests 합이 28.5Gi를 넘지 않게 합니다." },
              { label: "Allocatable CPU", expression: "16 − 1 − 0.5", result: "14.5 CPU", reason: "CPU는 eviction 신호가 없어 두 예약만 뺍니다. 14,500m이 4절 장부의 상한입니다." },
              { label: "Allocatable 디스크", expression: "100 − 1 − 1 − 10", result: "88Gi", reason: "nodefs.available 10%는 100Gi의 10%인 10Gi입니다." },
            ]}
            conclusion="같은 28.5Gi를 scheduler는 requests 합의 상한으로, kubelet은 실제 사용량의 eviction 기준으로 씁니다. 숫자 하나를 두 부품이 다른 뜻으로 읽는 것이 이 글의 전부입니다."
            caveats={["enforceNodeAllocatable 기본값은 [pods]라 Pod들의 cgroup 합에만 Allocatable이 강제됩니다. kube-reserved·system-reserved를 cgroup으로 강제하려면 따로 켜야 하고 문서는 그 전에 충분히 프로파일링하라고 적습니다.", "Allocatable은 kubectl describe node의 Allocatable 항목에 그대로 나옵니다. Capacity와 다르면 예약이 걸려 있다는 뜻입니다."]}
          />
          {code("allocatable-example", "문서의 Allocatable 예시")}
          {code("eviction-hard-defaults", "evictionHard 기본값")}
        </section>

        <section id="scheduling-sum" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 노드가 18%만 써도 requests 합이 차면 Pending입니다</h2>
          <AllocatableLedgerViz />
          <div className={prose}>
            <p>
              (가정) 3절의 노드에 2 CPU를 요청한 Pod 7개가 이미 배치되어 있습니다. requests 합은 14,000m이고 Allocatable 14,500m에서 남은 몫은 500m입니다. 그런데 일곱 Pod는 대기 상태의 웹 서버라 실제로는 합쳐서 2.9 CPU, 사용률로 18%만 씁니다.
            </p>
            <p>
              여기에 1 CPU를 요청한 새 Pod가 옵니다. scheduler의 NodeResourcesFit 플러그인은 노드마다 podRequest.MilliCPU &gt; Allocatable.MilliCPU − Requested.MilliCPU인지 봅니다.
            </p>
            <p>
              Requested는 nodeInfo가 더해 둔 배치된 Pod들의 requests 합이지 kubelet이 잰 사용량이 아닙니다. 1,000 &gt; 14,500 − 14,000 = 500이라 이 노드는 탈락하고 세 노드가 모두 같으면 event에 <code>0/3 nodes are available: 3 Insufficient cpu.</code>가 남습니다.
            </p>
            <p>
              같은 Pod의 requests를 500m으로 낮추면 500 &gt; 500이 아니라 통과합니다. 반대로 requests를 100m처럼 작게 적은 Pod가 많으면 장부는 넉넉한데 실제 사용량이 노드를 넘어 8절의 eviction과 7절의 OOM으로 갑니다. requests는 "실제로 쓸 양"에 가깝게 적어야 scheduler의 장부와 노드의 현실이 맞습니다.
            </p>
            <p>event 메시지의 3은 "시도한 노드 3대"이고 뒤 문장은 Filter 단계의 탈락 이유를 노드 수로 묶은 것입니다. 메시지에 <code>preemption: 0/3 nodes are available: 3 No preemption victims found</code>가 더 붙으면 PostFilter 단계에서 우선순위가 낮은 Pod를 밀어내려 했지만 밀어낼 대상이 없었다는 뜻입니다.</p>
          </div>
          {code("fits-request", "fit.go의 Insufficient 판정")}
          {code("no-node-available-msg", "0/N nodes are available 조립")}
        </section>

        <section id="names" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 예약은 requests, 상한은 limits, 노드 몫은 Allocatable입니다</h2>
          <div className={prose}>
            <p>앞 절의 숫자에 표준 이름을 붙입니다. 컨테이너가 확보해 달라는 양은 requests이고 scheduler의 Filter 단계와 노드 장부에만 쓰입니다. 컨테이너가 넘을 수 없는 양은 limits이고 kubelet이 cgroup에 쓰는 값입니다. 노드가 Pod 전체에 내주는 양은 Allocatable이고 Capacity에서 예약과 eviction 하한을 뺀 값입니다.</p>
            <p>requests와 limits의 조합이 Pod의 QoS class를 정합니다. 모든 컨테이너가 cpu와 memory 둘 다 request와 limit을 0보다 크게 적고 서로 같으면 Guaranteed입니다. 그렇지 않으면서 어느 컨테이너든 request나 limit이 하나라도 있으면 Burstable, 아무것도 없으면 BestEffort입니다. 4절의 Pod는 requests만 적었으니 Burstable입니다.</p>
            <p>QoS class는 세 곳에서 쓰입니다. kubelet이 컨테이너 프로세스의 oom_score_adj를 Guaranteed −997, BestEffort 1000, Burstable은 request 비율로 정하는 데 쓰고(<a href="/cs/cloud/linux-memory-page-cache-oom#kubernetes-qos">계산은 리눅스 메모리 글 11절</a>).
            </p>
            <p>
              또 Guaranteed Pod에만 CPU manager의 전용 코어 배정 자격을 주며, node-pressure eviction 순서를 "추정"하는 데 씁니다. 8절에서 보듯 eviction 순서의 직접 기준은 아닙니다.</p>
          </div>
          {code("qos-rules-doc", "QoS 판정 규칙")}
          {code("kubelet-oom-adj", "QoS별 oom_score_adj")}
        </section>

        <section id="cpu-throttle" data-teach-level="3" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. CPU limit 500m은 100ms마다 50ms이고, 스레드 4개면 12.5ms 만에 끝납니다</h2>
          <ThrottlePeriodViz />
          <div className={prose}>
            <p>
              Pod가 노드에 도착하면 kubelet은 CPU limit을 CFS quota로 바꿉니다. 식은 quota = milliCPU × period ÷ 1000이고 period는 kubelet 설정 cpuCFSQuotaPeriod의 기본값 100ms = 100,000μs입니다. limit 500m이면 50,000μs, 곧 100ms 주기마다 CPU 시간 50ms입니다. cgroup v2에서는 <code>cpu.max</code>에 <code>50000 100000</code>으로 쓰입니다.
            </p>
            <p>
              50ms는 벽시계 시간이 아니라 CPU 시간입니다. 스레드 하나가 쉬지 않고 돌면 1ms마다 1ms를 써서 50ms 시점에 quota가 끝나고 남은 50ms 동안 멈춥니다. 스레드 네 개가 동시에 돌면 1ms마다 4ms를 써서 12.5ms 만에 끝나고 87.5ms를 멈춥니다. 두 경우 모두 주기당 사용량은 50ms ÷ 100ms = 0.5 CPU라 사용률 그래프는 같은데 요청 하나가 겪는 지연은 50ms와 87.5ms로 다릅니다.
            </p>
            <p>이것이 1절의 "사용률 50%인데 p99가 두 배" 사건입니다. 멀티스레드 런타임(Go·JVM·Node 워커)은 limit의 몇 배 되는 스레드를 띄우기 쉽습니다. 짧게 몰아서 CPU를 쓰는 요청일수록 주기 초반에 quota를 비운 채 주기 끝까지 기다리게 됩니다. 공식 문서도 CPU limit은 커널이 집행하는 hard limit이며 넘을 수 없다고만 적고 그 대가가 지연이라는 사실은 운영에서 배웁니다.</p>
            <p>requests 쪽은 다른 값이 됩니다. request 500m은 shares 512(= 500 × 1024 ÷ 1000)가 되고 cgroup v2 노드에서는 다시 cpu.weight 20으로 변환됩니다. weight는 CPU가 모자랄 때 형제 cgroup 사이의 나눔 비율일 뿐 상한이 아니라서 노드가 놀면 request보다 얼마든지 더 씁니다. request는 노드가 바쁠 때의 최소 몫, limit은 노드가 놀 때도 넘을 수 없는 상한입니다.</p>
          </div>
          <CalculationWalkthrough
            title="limit 500m · request 500m이 cgroup 값이 되는 과정"
            question="kubelet은 500m을 커널의 어떤 숫자로 바꾸고, 스레드 4개는 몇 ms 만에 quota를 다 쓸까요?"
            scope="helpers_linux.go의 MilliCPUToQuota·MilliCPUToShares와 cgroup_manager_linux.go의 getCPUWeight를 기본 period 100ms로 따라갑니다. 스레드가 쉬지 않고 돈다는 것은 가정입니다."
            steps={[
              { label: "quota", expression: "500 × 100,000 ÷ 1,000", result: "50,000μs", reason: "limit은 μs 단위 CPU 시간이 됩니다. 최소 1,000μs라 10m 아래 limit은 10m처럼 동작합니다." },
              { label: "스레드 1개 소진 시각", expression: "50,000 ÷ 1", result: "50ms", reason: "1ms마다 CPU 시간 1ms를 쓰므로 주기의 절반에서 멈추고 50ms를 기다립니다." },
              { label: "스레드 4개 소진 시각", expression: "50,000 ÷ 4", result: "12.5ms", reason: "1ms마다 4ms를 씁니다. 남은 87.5ms 동안 네 스레드가 모두 run queue에서 내려갑니다." },
              { label: "주기당 사용량", expression: "50ms ÷ 100ms", result: "0.5 CPU", reason: "두 경우 모두 같습니다. 사용률 지표로는 throttling을 볼 수 없고 cpu.stat의 nr_throttled·throttled_usec을 봐야 합니다." },
              { label: "shares", expression: "500 × 1,024 ÷ 1,000", result: "512", reason: "request는 shares가 됩니다. 0m이면 커널 기본 1024가 아니라 최소값 2를 써서 아무것도 요청하지 않은 Pod가 가장 적은 몫을 받습니다." },
              { label: "cpu.weight", expression: "1 + (512 − 2) × 9,999 ÷ 262,142", result: "20", reason: "cgroup v2는 shares [2, 262144]를 weight [1, 10000]으로 선형 변환합니다. 정수 나눗셈이라 1 + 19.45 → 20입니다." },
            ]}
            conclusion="limit은 '100ms마다 50ms'라는 시간 상한이 되어 스레드 수만큼 빨리 닳고, request는 비율 20이 되어 바쁠 때의 나눔만 정합니다. 둘 다 500m이지만 커널에서는 전혀 다른 두 파일입니다."
            caveats={["커널은 quota를 CPU별 slice(기본 5ms)로 나눠 주므로 실제 소진 시각은 조금 다릅니다. 멈춤이 있다는 사실과 길이의 크기만 이 계산으로 봅니다.", "cpuCFSQuota를 false로 두면 limit이 cgroup에 쓰이지 않아 throttling은 사라지지만 Pod 하나가 노드 CPU를 다 쓸 수 있습니다."]}
          />
          {code("cfs-quota", "MilliCPUToQuota · MilliCPUToShares")}
          {code("cpu-weight", "shares → cpu.weight 변환")}
          {code("kubelet-cfs-defaults", "cpuCFSQuota · 100ms 기본값")}
        </section>

        <section id="memory-limit" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. memory limit은 멈추지 않고 137로 끝냅니다. 그것도 바로는 아닙니다</h2>
          <div className={prose}>
            <p>
              memory limit은 kubelet이 cgroup의 <code>memory.max</code>에 그대로 씁니다. 컨테이너가 이 값에 닿으면 커널은 먼저 그 cgroup의 page cache를 회수하고 회수할 것이 없으면 cgroup 안에서 OOM killer를 불러 프로세스 하나(또는 oom.group이 켜져 있으면 전부)에 SIGKILL을 보냅니다.
            </p>
            <p>
              주 프로세스가 죽으면 컨테이너는 exit code 137, reason OOMKilled로 끝나고 restartPolicy에 따라 다시 뜹니다.
            </p>
            <p>
              공식 문서는 이 집행을 "reactively"라고 적습니다. 커널이 메모리 압력을 감지했을 때만 죽이므로 limit을 조금 넘은 컨테이너가 당장 죽지 않을 수 있고, 반대로 노드 전체가 모자라면 limit 안에 있어도 전역 OOM의 후보가 됩니다. CPU limit과의 차이가 여기 있습니다. CPU는 넘는 순간 멈추고 끝나지만 메모리는 넘어도 잠깐 살다가 죽습니다.
            </p>
            <p>137이 OOM이었다는 증거는 세 곳에서 확인합니다. 컨테이너 상태의 lastState.terminated.reason이 OOMKilled인지, cgroup의 memory.events에서 oom_kill이 늘었는지, dmesg에 "Memory cgroup out of memory" 줄이 있는지입니다.
            </p>
            <p>
              점수 계산과 희생자 선택은 <a href="/cs/cloud/linux-memory-page-cache-oom#oom-score">리눅스 메모리 글 7~10절</a>이 memory.max 2 GiB 사례로 끝까지 계산합니다. 이 글은 그 글의 입구인 "limit이 memory.max가 된다"까지만 맡습니다.</p>
            <p>memory에는 request 쪽 집행이 없습니다. CPU request가 weight가 되는 것과 달리 memory request는 scheduler 장부와 oom_score_adj 계산, 그리고 8절의 eviction 비교에만 쓰입니다. 그래서 memory는 request = limit으로 두라는 조언이 많고 그렇게 두면 Guaranteed 조건의 절반을 채웁니다.</p>
          </div>
          {code("limits-enforcement-doc", "CPU는 throttle, memory는 OOM")}
          {code("oomkilled-137-doc", "OOMKilled · Exit Code 137 예시")}
          <div id="paper-k8s-limits" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Resource Management for Pods and Containers (website main 2f85f280, 2026-10-17 확인)" citeKey={1} href="https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/">
              <q>This means memory limits are enforced reactively.</q> 같은 문서의 바로 앞 문단은 CPU limit을 "a hard limit the kernel enforces"라고 적어 두 집행의 차이를 한 자리에서 보여 줍니다. 아래 예시 출력에는 Reason OOMKilled와 Exit Code 137이 있습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="eviction-order" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 노드가 모자라면 requests를 넘긴 Pod부터 쫓아냅니다. QoS 순서가 아닙니다</h2>
          <EvictionOrderViz />
          <div className={prose}>
            <p>
              7절의 OOM은 컨테이너 하나가 자기 limit에 닿는 이야기였습니다. 노드 전체의 memory.available이 3절의 eviction 하한(기본 100Mi, 예시 500Mi) 아래로 내려가면 다른 경로가 열립니다. kubelet의 eviction manager가 Pod를 골라 Failed(reason Evicted)로 만들고 컨테이너를 정리합니다.
            </p>
            <p>
              커널이 아니라 kubelet이 하는 일이고, 컨테이너 재시작이 아니라 Pod 종료라는 점이 OOMKilled와 다릅니다.
            </p>
            <p>
              순서를 정하는 기준은 세 가지입니다. ① 사용량이 requests를 넘었는가 ② Pod Priority ③ requests 대비 얼마나 넘었는가. 그래서 requests를 넘긴 BestEffort·Burstable Pod가 Priority 순, 초과량 순으로 먼저 나가고, requests 이하로 쓰는 Guaranteed·Burstable Pod는 Priority 순으로 마지막에 나갑니다.
            </p>
            <p>
              공식 문서는 note에 "The kubelet does not use the pod's QoS class to determine the eviction order."라고 명시합니다.
            </p>
            <p>
              (가정) 4절의 노드에서 request 2Gi인 Burstable Pod A가 3Gi를, request 없는 BestEffort Pod B가 0.5Gi를, request = limit 4Gi인 Guaranteed Pod C가 3.9Gi를 쓴다고 합시다. requests를 넘긴 것은 A(1Gi 초과)와 B(request 0이라 모든 사용이 초과)입니다.
            </p>
            <p>
              Priority가 같다면 초과량이 큰 A가 B보다 먼저 나갑니다. "BestEffort가 항상 먼저"가 아닙니다. C는 request 안에 있어 마지막입니다.
            </p>
            <p>DiskPressure에서는 QoS 추정조차 맞지 않습니다. ephemeral-storage requests에는 QoS class가 없기 때문입니다. eviction이 제때 메모리를 되찾지 못해 노드 전역 OOM이 나면 그때는 커널이 oom_score_adj로 순서를 정하고 그 계산은 리눅스 메모리 글 11절에 있습니다.</p>
          </div>
          {code("eviction-order-doc", "eviction 세 기준과 note")}
          <div id="paper-k8s-eviction" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Node-pressure Eviction · Pod selection for kubelet eviction (website main 2f85f280, 2026-10-17 확인)" citeKey={2} href="https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/">
              <q>The kubelet does not use the pod's QoS class to determine the eviction order.</q> 같은 절은 QoS class를 "estimate the most likely pod eviction order"에만 쓰라고 적고, ephemeral-storage에는 QoS 분류가 적용되지 않아 DiskPressure에서는 그 추정도 맞지 않는다고 덧붙입니다.
            </CitationBlock>
          </div>
        </section>

        <section id="admission" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. Deployment는 있는데 Pod가 없다면 admission에서 403으로 막혔을 수 있습니다</h2>
          <div className={prose}>
            <p>requests·limits는 Pod가 API 서버에 들어오는 순간에도 검사됩니다. namespace에 LimitRange가 있으면 admission controller가 빠진 request·limit에 기본값을 채우고 범위를 벗어난 값을 403 Forbidden으로 거절합니다. 검사는 Pod admission 때만 하므로 LimitRange를 나중에 바꿔도 이미 도는 Pod는 그대로입니다.</p>
            <p>ResourceQuota는 namespace 합계를 제한합니다. 새 Pod의 requests를 더했을 때 quota를 넘으면 역시 403으로 거절되고 Pod 객체 자체가 생기지 않습니다. cpu·memory quota가 걸린 namespace에서 requests·limits를 적지 않은 Pod는 생성이 거부될 수 있어 LimitRange로 기본값을 채워 두는 것이 보통입니다.</p>
            <p>이 거절은 Pod가 아니라 Pod를 만들려던 ReplicaSet에 남습니다. Deployment와 ReplicaSet은 정상인데 Pod가 0개이고 ReplicaSet의 event에 FailedCreate와 "exceeded quota" 또는 "forbidden" 메시지가 있으면 이 경로입니다.
            </p>
            <p>
              Pod의 event만 보면 아무것도 없어 보이는 이유이고, event를 소유자 사슬(Deployment → ReplicaSet → Pod)마다 따로 봐야 하는 이유는 <a href="/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview">Pod 상태와 Event 글</a>에서 이어집니다.</p>
          </div>
          {code("limit-range-doc", "LimitRange는 admission 때만")}
          {code("resource-quota-doc", "ResourceQuota의 403")}
        </section>

        <section id="source-trace" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 원문은 requests를 빼고 비교하고, limit을 μs로 바꾸고, 하한을 기본값으로 둡니다</h2>
          <div className={prose}>
            <p>Kubernetes v1.37.1의 pkg/scheduler/framework/plugins/noderesources/fit.go에서 fitsRequest(710행)가 4절의 판정입니다.
            </p>
            <p>
              713~721행은 Pod 수가 maxPods(kubelet 기본 110)를 넘는지, 732~741행은 podRequest.MilliCPU가 GetAllocatable().GetMilliCPU() − GetRequested().GetMilliCPU()보다 큰지 봅니다. Requested는 nodeInfo에 배치된 Pod들의 requests 합입니다.
            </p>
            <p>
              742~751행이 메모리, 그 아래가 ephemeral-storage와 확장 자원(GPU 등)에 같은 식을 적용합니다.</p>
            <p>pkg/scheduler/framework/types.go 1447행의 NoNodeAvailableMsg "0/%v nodes are available"가 event 문장의 앞머리이고 1471행에서 전체 노드 수를 채운 뒤 PreFilter·Filter·PostFilter 메시지를 뒤에 붙입니다.</p>
            <p>pkg/kubelet/cm/helpers_linux.go 117~142행의 MilliCPUToQuota가 6절의 식입니다. 103~108행에 QuotaPeriod 100,000μs와 MinQuotaPeriod 1,000μs가 상수로 있고 144~160행의 MilliCPUToShares가 shares를 만듭니다.
            </p>
            <p>
              cgroup v2의 weight 변환은 cgroup_manager_linux.go 268~277행의 getCPUWeight이고 1 + (shares − 2) × 9999 ÷ 262142입니다. 두 상수 262144·2는 커널 kernel/sched/sched.h의 shares 상·하한을 그대로 가져온 것이라고 주석이 밝힙니다.</p>
            <p>pkg/kubelet/apis/config/v1beta1/defaults.go 204~209행이 cpuCFSQuota true와 cpuCFSQuotaPeriod 100ms를, 193~194행이 maxPods 110을 기본값으로 둡니다.
            </p>
            <p>
              pkg/kubelet/eviction/defaults_linux.go 22~28행의 DefaultEvictionHard가 3절의 하한입니다. QoS별 oom_score_adj는 pkg/kubelet/qos/policy.go 31~36행의 상수와 47~72행의 GetContainerOOMScoreAdjust이며 리눅스 메모리 글이 같은 파일을 더 깊이 읽습니다.</p>
          </div>
          <AlgorithmBlock
            title="Pod 하나가 노드 하나에 들어가는지 fit.go가 판정하는 순서"
            input={[
              "podRequest = Pod의 컨테이너 requests 합 (init 컨테이너는 최대값, 4절 사례 cpu 1000m)",
              "allocatable = 노드 Allocatable (cpu 14,500m), requested = 배치된 Pod requests 합 (cpu 14,000m)",
              "pods = 배치된 Pod 수 7, allowedPodNumber = 110",
            ]}
            steps={[
              { code: "if len(pods) + 1 > allowedPodNumber: reasons += 'Too many pods'", note: "8 > 110이 아니라 통과합니다. 작은 노드에서는 CPU보다 이 한도가 먼저 차기도 합니다." },
              { code: "if podRequest == 0 everywhere: return reasons", note: "requests를 하나도 적지 않은 BestEffort Pod는 자원 검사 없이 통과합니다. 장부에서 0을 차지하기 때문입니다." },
              { code: "if podRequest.MilliCPU > allocatable.MilliCPU - requested.MilliCPU: reasons += 'Insufficient cpu'", note: "1,000 > 14,500 − 14,000 = 500이라 탈락합니다. 실제 사용량 2,900m은 어디에도 없습니다." },
              { code: "if podRequest.Memory > allocatable.Memory - requested.Memory: reasons += 'Insufficient memory'", note: "메모리도 같은 뺄셈입니다. 두 자원이 모두 모자라면 두 이유가 다 남습니다." },
              { code: "for r in scalar resources: same comparison → 'Insufficient <r>'", note: "nvidia.com/gpu 같은 확장 자원은 request = limit이어야 하고 같은 식으로 셉니다." },
              { code: "return reasons   # 비어 있으면 이 노드는 후보", note: "모든 노드가 이유를 돌려주면 scheduler는 '0/3 nodes are available: 3 Insufficient cpu.' event를 Pod에 남기고 Pending으로 둡니다." },
            ]}
            repeatUntil="노드마다 반복하고, 후보가 하나라도 남으면 Score 단계로 넘어가 가장 점수가 높은 노드에 bind합니다. 후보가 없으면 PostFilter(preemption)를 시도합니다."
            output="4절 사례: 세 노드 모두 'Insufficient cpu' → Pending. requests를 500m으로 낮추면 500 > 500이 거짓이라 후보가 됩니다."
          />
          {code("fits-request", "fitsRequest 원문")}
          {code("cfs-quota", "MilliCPUToQuota 원문")}
          {code("cpu-weight", "getCPUWeight 원문")}
          {code("eviction-hard-defaults", "DefaultEvictionHard 원문")}
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. requests와 limits는 사용량을 예측하거나 성능을 보장하지 않습니다</h2>
          <div className={prose}>
            <p>
              <code>Insufficient cpu/memory</code>는 실제 사용률이 높다는 뜻이 아닙니다. scheduler의 장부에서 requests 합이 Allocatable을 넘었다는 뜻이므로, 노드가 비어 보여도 Pod는 Pending일 수 있습니다.
            </p>
            <p>
              반대로 requests 합이 작다고 실제 노드가 안전한 것도 아닙니다. 컨테이너의 실제 사용량이 requests를 넘어도 limit에 닿기 전까지 실행되므로, 장부가 비어 있는 동안 메모리 압력이나 CPU 경합이 생길 수 있습니다.
            </p>
            <p>
              CPU limit은 평균 사용률이 아니라 CFS 주기 안의 실행 시간을 제한합니다. 그래서 평균이 50%여도 <code>cpu.stat</code>의 <code>nr_throttled</code>와 <code>throttled_usec</code>이 늘고 tail latency가 악화될 수 있습니다. memory limit은 같은 방식으로 멈추지 않고 회수 뒤 OOM kill로 끝날 수 있습니다.
            </p>
            <p>
              따라서 이 API 필드만으로 적정 requests·limits 값을 계산할 수는 없습니다. 워크로드 프로파일, 실제 분포, 허용 지연과 실패 기준이 필요하며 그 선택과 변경 절차는 <a href="/cs/cloud/kubernetes-sre-slo-burn-rate-upgrades#overview">Kubernetes 운영</a>의 실무 판단으로 넘깁니다.
            </p>
            <p>이 글의 수치는 공식 문서의 Allocatable 예와 kubelet 변환식으로 손으로 계산한 값이며 실제 클러스터를 돌려 잰 것이 아닙니다. 실제 노드의 Allocatable·requests 합·throttling은 kubectl describe node, cpu.stat, memory.events에서 다시 읽어야 합니다.
            </p>
            <p>
              노드에 도착한 Pod가 CrashLoopBackOff·Pending·OOMKilled 같은 상태 단어로 어떻게 보이는지는 <a href="/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview">Pod 상태와 Event 글</a>에서, Pod가 노드에 묶이고 노드가 죽을 때의 시계는 <a href="/cs/cloud/kubernetes-pod-to-node-scheduler-kubelet-notready#overview">Pod가 노드에 닿기까지</a>에서 이어집니다.</p>
          </div>
          <KubernetesMapReturn current="resources" />
          <ContentBoundary article="kubernetes-requests-limits-allocatable-qos" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 같은 노드로 다음 판정을 예상해 보세요</h2>
          <div className={prose}>
            <p>3절의 노드에서 운영자가 evictionHard를 기본값(memory.available 100Mi)으로 되돌리고 systemReserved를 지우면 Allocatable 메모리와 CPU는 각각 얼마가 될까요? (답: 3절)</p>
            <p>4절의 노드에 requests 없이 limits만 cpu 2로 적은 Pod가 오면 fit.go는 어떻게 판정하고, 그 Pod의 QoS class와 cgroup의 cpu.max·cpu.weight는 무엇이 될까요? (답: 4·5·6절)</p>
            <p>limit 2 CPU인 컨테이너가 스레드 8개로 쉬지 않고 돌면 100ms 주기 안에서 몇 ms에 quota가 끝나며 몇 ms를 멈출까요? 주기당 사용량은 얼마로 보일까요? (답: 6절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={k8sResourcesTrees}
        projectMetas={{
          kubernetes: { id: "kubernetes", label: "Kubernetes v1.37.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          website: { id: "website", label: "kubernetes/website 공식 문서", badgeClass: "bg-emerald-500/10 border-emerald-500 text-emerald-700" },
        }}
      />
    </>
  );
}
