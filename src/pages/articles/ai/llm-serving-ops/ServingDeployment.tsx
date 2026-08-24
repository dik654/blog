import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import DeploymentLifecycleViz from "./viz/DeploymentLifecycleViz";
import ProbeContractViz from "./viz/ProbeContractViz";

export default function ServingDeployment() {
  return (
    <section id="serving-deployment" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        배포 완료는 process 시작이 아니라 안전한 traffic 전환이다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          LLM Pod는 container가 시작된 뒤에도 weight를 읽고 GPU memory를
          할당하며, tensor-parallel worker를 연결하고 kernel을 warm-up하는
          시간이 필요합니다. 이때 process가 살아 있다는 사실만 보고 traffic을
          보내면 첫 요청이 초기화 비용을 떠안고, rollout 중인 replica들이 연달아
          timeout을 만들 수 있습니다.
        </p>
        <p className="leading-8">
          배포 단위에는 model 이름만 적지 않습니다. Weight digest, tokenizer와
          chat template, quantization, runtime image, parallelism과 generation
          default를 함께 versioning합니다. 이 중 하나만 달라도 output
          format·quality·memory capacity가 바뀔 수 있기 때문입니다.
        </p>
      </div>

      <DeploymentLifecycleViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Startup, readiness, liveness는 같은 health check가 아니다</h3>
        <p className="leading-8">
          Kubernetes에서 startup probe가 성공하기 전에는 readiness와 liveness
          probe가 실행되지 않습니다. Readiness 실패는 Pod를 Service의
          EndpointSlice에서 제외하지만 process는 계속 살려 두고, liveness 실패는
          설정한 임계치 뒤 container를 재시작합니다. 따라서 “요청이 밀렸다”를
          liveness 조건으로 쓰면 바쁜 replica를 재시작해 남은 replica의 부하까지
          키우는 cascading failure가 생길 수 있습니다.
        </p>
      </div>

      <ProbeContractViz />

      <ExplainedFormula
        question="Weight loading이 긴 Pod에 startup probe가 허용하는 최대 초기화 시간은 얼마인가?"
        idea={
          <>
            첫 검사 전 지연 뒤 일정한 주기로 검사하고, 연속 실패가 임계치에
            도달하면 container를 재시작합니다. 실제 경계는 timeout과 실행 시점
            때문에 조금 달라질 수 있으므로 이 식은 설정 budget을 읽는
            근사치입니다.
          </>
        }
        formula={String.raw`\begin{aligned}
T_{\mathrm{start}}&\approx T_{\mathrm{delay}}\\
&\quad+N_{\mathrm{fail}}T_{\mathrm{period}}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
T_{\mathrm{start}}&\approx \underbrace{T_{\mathrm{delay}}}_{\text{initial delay 계산}}\\
&\quad+N_{\mathrm{fail}}T_{\mathrm{period}}
\end{aligned}`}
        operations={[
          { expression: String.raw`T_{\mathrm{delay}}`, annotation: ["initial delay이(가) 식의 결과에 기여하는 방식을","계산합니다.","첫 검사 전 지연 뒤 일정한 주기로 검사하고, 연속 실패가","임계치에 도달하면 container를 재시작합니다."] },
        ]}
        terms={[
          {
            symbol: "T_{\\mathrm{delay}}",
            name: "initial delay",
            description:
              "Container 시작 뒤 첫 startup probe까지 기다리는 시간입니다.",
          },
          {
            symbol: "N_{\\mathrm{fail}}",
            name: "failureThreshold",
            description: "재시작 전에 허용하는 연속 실패 횟수입니다.",
          },
          {
            symbol: "T_{\\mathrm{period}}",
            name: "periodSeconds",
            description: "Probe를 반복하는 기본 간격입니다.",
          },
        ]}
        assumptions={[
          "Kubernetes 문서가 제시하는 initialDelaySeconds + failureThreshold × periodSeconds 기준을 설정 검토용으로 단순화했습니다.",
          "Probe timeout과 실제 실행 지연을 포함한 정확한 재시작 시각은 cluster에서 측정합니다.",
        ]}
        interpretation="평균 load time에 맞추지 말고 정상적인 cold-start tail을 수용하도록 startup budget을 잡습니다. 그와 별개로 초기화가 실제로 진행 중인지 판단할 신호도 필요합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Readiness는 첫 admission뿐 아니라 overload와 drain에도 사용한다</h3>
        <p className="leading-8">
          Readiness endpoint는 HTTP process가 응답한다는 사실보다
          model·tokenizer·worker가 같은 version으로 준비됐고 새 요청을 받을 수
          있는지를 확인해야 합니다. 종료할 때는 먼저 새 admission을 막고,
          EndpointSlice와 load balancer의 전파 시간을 고려한 뒤 진행 중인
          stream에 grace period를 줍니다. 강제 종료까지 남은 시간보다 최대
          stream 수명이 길다면 application-level cancellation과 resume 정책도
          필요합니다.
        </p>

        <h3>Canary는 오류율뿐 아니라 behavior와 capacity 회귀를 본다</h3>
        <p className="leading-8">
          새 artifact의 smoke test에서는 schema, tool call, representative
          context와 stop condition을 검사합니다. Canary traffic에서는 같은
          workload bucket의 TTFT·TPOT·error·output format·quality proxy와
          tokens/GPU-second를 이전 version과 비교합니다. 단순 성공률만 보면
          tokenizer 변경이나 KV capacity 감소처럼 늦게 나타나는 회귀를 놓칠 수
          있습니다.
        </p>

        <h3>
          HPA는 metric을 replica 비율로 바꾸는 intermittent control loop다
        </h3>
        <p className="leading-8">
          Kubernetes HPA는 기본적으로 일정 주기마다 metric을 읽어 현재 replica
          수에 비율을 곱합니다. <code>autoscaling/v2</code>에서는 custom
          metric을 사용할 수 있으므로 CPU 대신 waiting requests나 queue time을
          연결할 수 있지만, metric이 replica 증가에 따라 감소하는 성질을 가져야
          합니다. 새 Pod가 아직 Ready가 아니거나 metric이 비어 있을 때는
          controller가 보수적으로 계산하며, 여러 metric을 쓰면 가장 큰 replica
          제안을 선택합니다.
        </p>
      </div>

      <ExplainedFormula
        question="HPA는 현재 metric과 목표값으로 다음 replica 수를 어떻게 제안하는가?"
        idea={
          <>
            현재값이 목표의 두 배면 replica도 대략 두 배로, 절반이면 절반으로
            제안합니다. 실제 controller는 tolerance, missing metric, Ready
            상태와 scale behavior를 추가로 적용합니다.
          </>
        }
        formula={String.raw`R_{\mathrm{desired}}=\left\lceil R_{\mathrm{current}}\frac{m_{\mathrm{current}}}{m_{\mathrm{target}}}\right\rceil`}
        annotatedFormula={String.raw`R_{\mathrm{desired}}=\underbrace{\left\lceil R_{\mathrm{current}}\frac{m_{\mathrm{current}}}{m_{\mathrm{target}}}\right\rceil}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\left\lceil R_{\mathrm{current}}\frac{m_{\mathrm{current}}}{m_{\mathrm{target}}}\right\rceil`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","현재값이 목표의 두 배면 replica도 대략 두 배로,","절반이면 절반으로 제안합니다."] },
        ]}
        terms={[
          {
            symbol: "R_{\\mathrm{current}}",
            name: "현재 replica",
            description: "HPA가 제어하는 workload의 현재 Pod 수입니다.",
          },
          {
            symbol: "m_{\\mathrm{current}}",
            name: "현재 metric",
            description:
              "대상 Pod 평균 또는 object/external metric의 현재 관측값입니다.",
          },
          {
            symbol: "m_{\\mathrm{target}}",
            name: "목표 metric",
            description:
              "Replica 한 개당 유지하려는 queue·utilization 등의 목표값입니다.",
          },
          {
            symbol: "R_{\\mathrm{desired}}",
            name: "제안 replica",
            description:
              "Ratio와 올림을 적용한 뒤 policy·min/max로 제한할 후보입니다.",
          },
        ]}
        assumptions={[
          "Metric이 replica를 늘리면 감소하고 수요가 늘면 증가하는 방향성을 가져야 합니다.",
          "실제 Kubernetes는 tolerance, missing metric, unready Pod, 여러 metric과 stabilization policy를 추가로 반영합니다.",
        ]}
        interpretation="HPA 수식은 Pod 수만 제안합니다. Pending→node provision→model load→Ready 경로는 별도의 지연이므로, min replica와 node autoscaling을 함께 설계해야 실제 capacity가 제때 늘어납니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Scale-down에는 stabilization window와 drain을 둬 짧은 traffic 감소에
          replica가 흔들리지 않게 합니다. Runtime의 memory·scheduling 한계는
          <Link to="/ai/vllm-paged-attention"> PagedAttention·KV cache</Link>와
          <Link to="/ai/llm-serving-capacity">
            {" "}
            hybrid attention serving
          </Link>
          에서 계산하고, 여기서는 그 결과인 ready capacity와 queue를 제어 신호로
          사용합니다.
        </p>
      </div>
    </section>
  );
}
