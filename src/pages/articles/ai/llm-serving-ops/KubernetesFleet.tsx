import ExplainedFormula from "@/components/ui/explained-formula";
import FleetCapacityViz from "./viz/FleetCapacityViz";

const placement = [
  ["Hardware", "GPU model · memory · MIG profile"],
  ["Topology", "NVLink · RDMA · NUMA locality"],
  ["Software", "driver · CUDA/runtime support matrix"],
  ["Artifacts", "local weight cache · registry/network path"],
] as const;

export default function KubernetesFleet() {
  return (
    <section id="k8s-gpu-fleet" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Pod 수가 아니라 Ready 상태의 model capacity를 센다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Kubernetes가 GPU request를 보고 Pod를 배치해도 그 순간부터 token을
          생성할 수 있는 것은 아닙니다. 빈 GPU가 없으면 Pod가 Pending에 머물고,
          새 node를 만든다면 machine provisioning 뒤에 driver·container
          toolkit·device plugin과 label이 준비되어야 합니다. 그다음에도 image와
          weight를 받고 distributed worker를 초기화한 뒤 warm-up을 통과해야 실제
          capacity가 됩니다.
        </p>
        <p className="leading-8">
          NVIDIA GPU Operator는 driver, Container Toolkit, Kubernetes device
          plugin, GPU Feature Discovery(GFD), DCGM monitoring 등 이 준비 계층을
          Operator로 관리합니다. 다만 설치 여부가 모든 node의 version과 기능이
          같다는 뜻은 아니므로, 지원 matrix와 node label을 deployment 계약에
          포함하고 upgrade 중 혼합 상태도 관측해야 합니다.
        </p>
      </div>

      <FleetCapacityViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Placement는 GPU 개수보다 구체적으로 표현한다</h3>
        <p className="leading-8">
          <code>nvidia.com/gpu: 1</code>은 개수만 말해 줄 뿐 model이 요구하는
          memory, compute capability, MIG profile이나 multi-GPU topology를
          보장하지 않습니다. 따라서 label·node affinity·topology constraint로
          실행 조건을 선언하고, taint와 toleration으로 일반 workload가 비싼 GPU
          node를 점유하지 못하게 합니다. 조건이 많아질수록 schedulable pool이
          작아지므로 각 조건별 여유 capacity도 따로 측정해야 합니다.
        </p>
      </div>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        {placement.map(([title, body]) => (
          <div key={title} className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-sm font-bold text-foreground">{title}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Queue가 알려 주는 것은 평균 사용률과 다르다</h3>
        <p className="leading-8">
          LLM request는 prompt와 output 길이가 달라 service time의 분산이
          큽니다. GPU utilization이 높지 않아도 긴 prefill이 decode를
          지연시키거나 KV budget 때문에 새 sequence가 waiting에 남을 수
          있습니다. 반대로 utilization이 높더라도 TTFT와 TPOT SLO를 지키고
          있다면 즉시 scale할 이유는 없습니다. Queue length와 queue time을
          사용자 SLI와 함께 보는 이유입니다.
        </p>
      </div>

      <ExplainedFormula
        question="평균적으로 시스템 안에 머무는 요청 수는 arrival와 체류 시간에 어떻게 연결되는가?"
        idea={
          <>
            안정된 관측 구간에서는 들어온 요청률과 요청 하나가 queue·실행에 머문
            평균 시간을 곱하면 시스템 안의 평균 요청 수가 됩니다. 같은 관계를
            token work에 적용하려면 prompt와 output을 하나의 단순 token으로 섞지
            말고 phase별로 정의해야 합니다.
          </>
        }
        formula={String.raw`L=\lambda W`}
        annotatedFormula={String.raw`L=\underbrace{\lambda W}_{\text{완료 가능한 arrival rate 계산}}`}
        operations={[
          { expression: String.raw`\lambda W`, annotation: ["완료 가능한 arrival rate이(가) 식의 결과에","기여하는 방식을 계산합니다.","안정된 관측 구간에서는 들어온 요청률과 요청 하나가","queue·실행에 머문 평균 시간을 곱하면 시스템 안의 평균"] },
        ]}
        terms={[
          {
            symbol: "L",
            name: "평균 in-flight 요청",
            description:
              "Waiting과 running을 포함해 시스템 경계 안에 있는 평균 요청 수입니다.",
          },
          {
            symbol: "\\lambda",
            name: "완료 가능한 arrival rate",
            description: "같은 단위 시간에 경계로 들어오는 요청률입니다.",
          },
          {
            symbol: "W",
            name: "평균 체류 시간",
            description:
              "한 요청이 들어와 완료·실패·취소될 때까지 머문 평균 시간입니다.",
          },
        ]}
        assumptions={[
          "관측 window에서 arrival와 departure가 장기적으로 균형인 stable system을 가정합니다.",
          "평균 관계이므로 p99 queue나 긴 prompt가 만드는 tail을 직접 보장하지 않습니다.",
        ]}
        interpretation="Arrival가 같은데 체류 시간이 두 배가 되면 평균 in-flight도 두 배가 됩니다. Admission limit과 concurrency를 정할 때 평균뿐 아니라 length bucket별 tail을 함께 보는 출발점입니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="paper-little-law" className="scroll-mt-20">
          Little의 원 논문이 보장한 것: 안정된 긴 관측 구간의 세 평균은 연결됩니다
        </h3>
        <p className="leading-8">
          <a href="https://pubsonline.informs.org/doi/10.1287/opre.9.3.383">
            A Proof for the Queuing Formula: L = λW
          </a>
          는 평균 in-system 수, effective arrival rate, 평균 체류 시간이
          <code>L=λW</code>를 만족하는 조건을 증명했습니다. 핵심 직관은 관측 구간에
          각 요청이 머문 시간을 모두 더한 “request-time 면적”을 한쪽에서는 시간별
          in-flight 수의 합으로, 다른 쪽에서는 완료 요청 수×평균 체류 시간으로
          세면 같은 양이라는 것입니다.
        </p>
        <p className="leading-8">
          이 관계는 특정 queue discipline이나 service-time 분포를 요구하지 않는다는
          장점이 있지만, 평균들이 유한하고 장기적으로 안정된 경계를 전제로 합니다.
          장애로 queue가 계속 증가해 arrival와 departure가 균형을 잃은 구간이나
          관측 window 끝에 미완료 요청을 임의로 제외한 데이터에는 그대로 적용하면
          안 됩니다. 또한 Little's law만으로 p99 queue time이나 필요한 replica 수를
          계산할 수는 없습니다.
        </p>

        <h3>Scale latency가 SLO보다 길다면 반응형 autoscaling만으로 늦다</h3>
        <p className="leading-8">
          GPU node 확보부터 model readiness까지 10분이 걸리는데 traffic spike가
          1분 만에 SLO를 소진한다면, HPA threshold를 아무리 정교하게 조정해도 새
          capacity는 늦게 도착합니다. 최소 warm replica, 예약 node, weight
          cache와 예측형 provisioning 중 필요한 장치를 둬야 하며, scale path의
          각 단계 시간을 histogram으로 남겨 어느 구간을 줄였는지 확인합니다.
        </p>
      </div>
    </section>
  );
}
