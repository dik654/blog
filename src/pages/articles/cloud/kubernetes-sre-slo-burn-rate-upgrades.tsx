import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import BurnRateWindowViz from "./kubernetes-sre-slo-burn-rate-upgrades/viz/BurnRateWindowViz";
import { codeRefs } from "./kubernetes-sre-slo-burn-rate-upgrades/codeRefs";
import { kubernetesSreTrees } from "./kubernetes-sre-slo-burn-rate-upgrades/fileTree";
import KubernetesSeriesLocator from "./kubernetes-shared/KubernetesSeriesLocator";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function KubernetesSreSloBurnRateUpgradesArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. DNS가 한 시간 넘게 죽었는데 왜 아무도 깨지 않았나요?</h2>
          <KubernetesSeriesLocator current="operations" question="사용자 영향과 원인 지표를 어떤 기준으로 연결해 알림·변경·복구를 결정할까요?" bridge="checkout 경로의 지표를 사용자 영향과 연결해 알림·변경·복구를 결정하는 과정을 봅니다." />
          <div className={prose}>
            <p>
              2019년 1월 7일 Zalando의 한 Kubernetes cluster에서 CoreDNS Pod들이 동시에 OOMKill되고, 다시 뜨자마자 같은 부하에 다시 죽기를 반복했습니다. cluster 안의 모든 이름 해석이 멎은 채 고객은 한 시간 넘게 오류 페이지를 봤습니다. 사후 보고서가 적은 기여 요인 가운데 하나는 memory limit 100Mi가 아니라 이것입니다.
            </p>
            <p>
              cluster 안에서 cluster를 감시하던 monitoring이 cluster와 함께 멈춰 당직자 호출이 늦어졌습니다.
            </p>
            <p>
              이 글의 질문은 그 한 시간입니다. 운영자는 무엇을 재야 하며, 얼마나 나빠졌을 때 사람을 깨워야 할까요? 업그레이드 같은 위험한 변경은 어떤 규칙으로 집행하며, 사고가 끝난 뒤 무엇을 적어야 다음 사고가 짧아질까요? 답을 먼저 적겠습니다. 사용자가 겪는 실패의 비율을 SLO로 약속한 뒤, 그 약속이 허용하는 실패량(error budget)이 평소보다 몇 배 빨리 닳는지(burn rate)로 깨울지 정합니다.
            </p>
            <p>
              변경은 budget이 남아 있을 때 version skew 규칙 안에서 한 단계씩 집행하며, 사고 뒤에는 사람이 아니라 시스템을 고치는 postmortem을 씁니다.
            </p>
            <p>
              이 글은 Google SRE 책과 Workbook 원문, Kubernetes v1.37.1 kubeadm·admission 코드, 그리고 공개된 Kubernetes 장애 보고서 여섯 건으로 그 답을 끝까지 따라갑니다. SLO와 burn rate의 정의 자체는{" "}
              <a href="/cs/ai/llm-serving-ops#observability-aiops">LLM 서빙 운영</a>에 이미 있어 여기서는 Kubernetes 운영의 숫자로 다시 셉니다. 시리즈 전체 지도는{" "}
              <a href="/cs/cloud/kubernetes-concept-map#overview">Kubernetes 개념 지도</a>에 있습니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 운영은 재고, 약속하고, 깨우고, 바꾸고, 배우는 다섯 칸의 고리입니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 흐름은 다섯 칸입니다. 서비스가 사용자에게 어떻게 보이는지 숫자로 잽니다. 그 숫자가 어디까지 나빠져도 되는지 약속합니다. 약속이 깨질 속도가 되면 사람을 깨웁니다. 약속이 지켜지는 동안 배포와 업그레이드를
              집행합니다. 약속이 깨진 사고가 끝나면 왜 그랬는지 적어 다음 고리에 반영합니다.
            </p>
            <p>
              Kubernetes에서 이 고리는 두 층에서 돕니다. 사용자가 보는 층은 Service나 Ingress를 지나는 요청의 성공률과 지연입니다. 그 아래 Pod의 재시작 수, 노드의 CPU throttling, CoreDNS의 메모리는 사용자가 보지 못하는
              원인 층입니다. 이 글의 첫 번째 규칙은 깨우는 기준을 사용자가 보는 층에 두는 것, 그리고 원인 층은 깨어난 뒤 읽는 자료로 쓰는 것입니다. 왜 그래야 하는지는 7절의 사례들이 보여 줍니다.
            </p>
            <p>
              이 글이 다루지 않는 것도 적어 둡니다. Pod가 Ready가 되는 요청 경로는 <a href="/cs/cloud/kubernetes-request-path-and-cka#overview">Kubernetes 요청 경로</a>에, rollout·PDB·drain의 동작 자체는{" "}
              <a href="/cs/cloud/kubernetes-rollout-termination-pdb-drain-hpa#overview">rollout과 종료</a>에, 백업·RPO·RTO는{" "}
              <a href="/cs/cloud/cloud-reliability-observability-iac#overview">클라우드 신뢰성</a>에 있습니다. 여기서는 그 동작들을 언제, 어떤 숫자를 보고 실행할지를 다룹니다.
            </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 30일 99.9%는 43.2분, 곧 259만 번의 실패를 허락합니다</h2>
          <div className={prose}>
            <p>
              (가정) 초당 1,000개 요청을 받는 checkout Service가 있습니다. 운영팀은 30일 동안 요청의 99.9%가 성공해야 한다고 약속했습니다. 이 약속이 허락하는 실패의 총량이 얼마인지부터 셉니다. 30일은 43,200분이므로 그 0.1%는 43.2분입니다. 서비스가 완전히 멈춰 모든 요청이 실패한다면 한 달에 43.2분까지 멈출 수 있다는 뜻입니다.
            </p>
            <p>
              같은 양을 요청 수로 세면 초당 1,000개 × 2,592,000초 = 25억 9,200만 개 요청 가운데 0.1%인 259만 2,000개입니다. 완전히 멈추지 않고 일부만 실패하는 보통의 장애는 이 쪽 단위가 더 쓸모 있습니다. 어느 쪽으로 세든 이 총량이 error budget입니다. 운영의 모든 결정은 이 budget을 얼마나 썼는지, 얼마나 빨리 쓰는 중인지로 내립니다.
            </p>
            <p>
              이제 장애 하나를 넣습니다. (가정) 10분 동안 요청의 15%가 5xx로 끝났습니다. 실패한 요청은 0.15 × 1,000 × 600 = 90,000개로, budget 259만 2,000개의 3.47%입니다. 한 달 budget의 3.5%를 10분에 쓴 셈이라 이 속도가
              계속되면 약 4.8시간 뒤 budget이 바닥납니다.
            </p>
          </div>
          <figure className="not-prose my-6">
            <svg viewBox="0 0 480 96" className="h-auto w-full" role="img" aria-label="30일 error budget 2,592,000개 가운데 10분 장애가 쓴 90,000개">
              <text x="0" y="12" fontSize="10" fontWeight="700" className="fill-foreground">30일 budget = 0.1% × 25억 9,200만 요청 = 2,592,000개</text>
              <rect x="0" y="20" width="480" height="26" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
              <rect x="0" y="20" width="16.7" height="26" rx="2" fill="#dc2626" />
              <line x1="16.7" y1="20" x2="16.7" y2="62" stroke="#dc2626" strokeWidth="1" strokeDasharray="2 2" />
              <text x="22" y="60" fontSize="9" fill="#dc2626" fontWeight="700">10분 × 1,000/s × 15% = 90,000개 (3.47%)</text>
              <text x="478" y="60" fontSize="9" textAnchor="end" className="fill-muted-foreground">남은 2,502,000개 (96.53%)</text>
              <text x="0" y="84" fontSize="9" className="fill-muted-foreground">같은 속도면 2,592,000 ÷ 90,000 × 10분 ≈ 4.8시간 뒤 바닥</text>
              <text x="478" y="84" fontSize="9" textAnchor="end" className="fill-muted-foreground">한 칸 = 90,000개</text>
            </svg>
            <figcaption className="mt-2 text-xs text-muted-foreground">회색 막대가 한 달 budget 전체, 빨간 조각이 10분 장애가 쓴 몫입니다. 빨간 조각 하나가 한 칸이라 같은 장애가 29번 더 나면 막대가 끝납니다.</figcaption>
          </figure>
          <CalculationWalkthrough
            title="30일 99.9% SLO의 error budget과 장애 한 건의 소비"
            question="초당 1,000개 요청을 받는 서비스가 10분 동안 15% 오류를 내면 한 달 budget의 몇 %를 쓸까요?"
            scope="SLO 기간 30일, 목표 99.9%, 트래픽은 초당 1,000개로 일정하다고 가정합니다. 요청 하나가 성공 아니면 실패 둘 중 하나로 끝나는 가용성 SLI만 셉니다."
            steps={[
              { label: "허용 실패 비율", expression: "1 − 0.999", result: "0.001 = 0.1%", reason: "SLO가 성공률이면 1에서 빼서 실패율의 상한을 얻습니다. 이 0.1%가 모든 계산의 분모가 됩니다." },
              { label: "시간으로 센 budget", expression: "30일 × 24 × 60 × 0.001", result: "43.2분", reason: "모든 요청이 실패하는 완전 중단으로 환산한 양입니다. 트래픽이 일정하다는 가정이 여기 숨어 있습니다." },
              { label: "요청 수로 센 budget", expression: "1,000 × 2,592,000 × 0.001", result: "2,592,000개", reason: "30일은 2,592,000초입니다. 일부만 실패하는 장애는 이 단위로 세야 합니다." },
              { label: "장애의 실패 요청", expression: "0.15 × 1,000 × 600", result: "90,000개", reason: "오류율 15%가 600초 이어졌습니다. 성공한 85%는 budget을 쓰지 않습니다." },
              { label: "소비한 budget", expression: "90,000 ÷ 2,592,000", result: "3.47%", reason: "10분짜리 장애 하나가 한 달 허용량의 3.5%입니다. 같은 장애가 29번 더 나면 budget이 끝납니다." },
            ]}
            conclusion="budget은 43.2분 또는 259만 개이고 이 장애는 그중 3.47%를 썼습니다. 다음 절은 이 소비가 평소 허용 속도의 몇 배인지를 세어 깨울지 결정합니다."
            caveats={["트래픽이 시간대마다 다르면 분 단위 budget은 맞지 않습니다. Workbook은 그래서 요청 수 기반 SLI를 권합니다.", "지연 SLO(예: 99%가 300ms 안)는 느린 요청을 실패로 세는 식으로 같은 틀에 넣습니다."]}
          />
        </section>

        <section id="burn-rate" data-teach-level="1" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 한 시간 창에서 2.5% 오류는 허용 속도의 25배이고, 14.4배가 Page의 문턱입니다</h2>
          <div className={prose}>
            <p>
              budget을 정확히 30일에 다 쓰는 속도가 있습니다. 실패율이 꾸준히 0.1%면 30일째에 budget이 0이 됩니다. Workbook은 이 속도를 burn rate 1이라 부릅니다. 어떤 창에서 잰 실패율을 0.1%로 나눈 값이 그 창의 burn rate입니다. 앞 절의 장애가 끝난 직후 지난 1시간 창을 보면 실패 90,000개 ÷ 요청 3,600,000개 = 2.5%, 곧 burn rate 25입니다.
            </p>
            <p>
              이 속도로는 budget이 30일 ÷ 25 = 1.2일 만에 바닥납니다.
            </p>
            <p>
              그렇다면 몇 배부터 사람을 깨워야 할까요? Workbook은 거꾸로 정합니다. 1시간 창 안에서 한 달 budget의 2%를 썼다면 깨울 만하다고 먼저 정한 뒤, 그 소비를 만드는 burn rate를 계산합니다. 소비한 budget 비율 = burn rate ×
              창 길이 ÷ SLO 기간이므로 burn rate = 0.02 × 720시간 ÷ 1시간 = 14.4입니다. 6시간 창에서 5%면 6, 3일 창에서 10%면 1입니다.
            </p>
            <p>
              세 숫자 14.4·6·1은 서로 다른 급함을 나타냅니다. 14.4배는 몇 시간 안에 budget이 끝나는 속도라 Page, 6배는 닷새 안이라 역시 Page, 1배는 정확히 한 달이라 다음 근무일에 볼 Ticket입니다. 우리 장애의 25배는 첫 줄을 넘습니다.
            </p>
          </div>
          <ExplainedFormula
            question="어떤 창에서 burn rate 몇 배가 budget 몇 %를 쓰나요?"
            idea="burn rate는 허용 속도의 배수이고, 창 길이를 SLO 기간으로 나눈 비율만큼 budget을 씁니다."
            formula={"\\text{consumed}=\\text{burn rate}\\times\\frac{\\text{window}}{\\text{period}}"}
            annotatedFormula={"\\underbrace{\\text{consumed}}_{\\text{budget 중 쓴 비율}}=\\underbrace{\\text{burn rate}}_{\\text{실패율}\\div(1-\\text{SLO})}\\times\\underbrace{\\frac{\\text{window}}{\\text{period}}}_{\\text{창이 기간에서 차지하는 몫}}"}
            operations={[
              { expression: "\\text{burn rate}=\\text{error ratio}\\div(1-\\text{SLO})", annotation: ["1시간 창 2.5% ÷ 0.1% = 25입니다.", "장애 중 5분 창은 15% ÷ 0.1% = 150입니다."] },
              { expression: "\\text{consumed}=25\\times 1\\,\\text{h}\\div 720\\,\\text{h}", annotation: ["0.0347, 곧 3.47%입니다. 3절에서 요청 수로 센 값과 같습니다."] },
              { expression: "\\text{burn rate}=0.02\\times 720\\div 1", annotation: ["1시간에 2%를 쓰는 속도는 14.4배입니다. Workbook Table 5-8의 첫 줄입니다."] },
            ]}
            terms={[
              { symbol: "\\text{window}", name: "경보 창", description: "실패율을 평균 내는 시간 길이입니다. 1시간, 6시간, 3일처럼 SLO 기간보다 훨씬 짧습니다." },
              { symbol: "\\text{period}", name: "SLO 기간", description: "budget을 세는 전체 기간입니다. 이 글은 30일 = 720시간입니다." },
              { symbol: "1-\\text{SLO}", name: "허용 실패 비율", description: "99.9%면 0.001입니다. 임계값은 burn rate × 0.001로 적습니다." },
            ]}
            assumptions={["창 안에서 트래픽이 일정하다고 봅니다. 트래픽이 적은 새벽에는 같은 실패 수가 더 높은 비율로 보입니다."]}
            interpretation="같은 burn rate라도 창이 길수록 많은 budget을 쓴 뒤에야 알게 됩니다. 그래서 큰 소진은 짧은 창으로 빨리, 작은 소진은 긴 창으로 늦게라도 잡도록 창을 여러 개 둡니다."
          />
          <CalculationWalkthrough
            title="Workbook Table 5-8의 세 줄을 다시 계산하기"
            question="2% in 1h, 5% in 6h, 10% in 3d는 각각 burn rate 몇 배일까요?"
            scope="SLO 기간 30일 = 720시간입니다. 소비 비율을 먼저 정하고 burn rate를 거꾸로 구합니다."
            steps={[
              { label: "Page · 1시간", expression: "0.02 × 720 ÷ 1", result: "14.4", reason: "한 시간에 budget 2%를 쓰는 속도입니다. 이대로면 50시간, 약 2일 만에 budget이 끝납니다." },
              { label: "Page · 6시간", expression: "0.05 × 720 ÷ 6", result: "6", reason: "여섯 시간에 5%입니다. 5일 만에 끝나는 속도라 아직 Page입니다." },
              { label: "Ticket · 3일", expression: "0.10 × 720 ÷ 72", result: "1", reason: "사흘에 10%는 정확히 한 달에 budget을 다 쓰는 속도입니다. 급하지 않아 Ticket입니다." },
              { label: "우리 장애", expression: "0.025 ÷ 0.001", result: "25", reason: "1시간 창 평균 2.5%는 첫 줄 14.4를 넘습니다. Page 대상입니다." },
            ]}
            conclusion="세 줄은 '얼마나 쓰면 깨울지'를 먼저 정한 결과이고, burn rate는 그 결정을 실패율 임계값으로 바꾼 숫자입니다."
            caveats={["Workbook은 이 값을 99.9% SLO의 출발점으로 제시합니다. SLO가 99%면 허용 실패율이 1%라 같은 burn rate의 임계값은 10배 커집니다."]}
          />
          <div id="paper-workbook-table" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Google SRE Workbook · Chapter 5 Alerting on SLOs · Table 5-8 (2026-10-17 확인)" citeKey={1} href="https://sre.google/workbook/alerting-on-slos/">
              <q>We recommend 2% budget consumption in one hour and 5% budget consumption in six hours as reasonable starting numbers for paging, and 10% budget consumption in three days as a good baseline for ticket alerts.</q> Table 5-8은 이 세 줄을 긴 창 1h·6h·3d, 짧은 창 5m·30m·6h, burn rate 14.4·6·1로 적고, 같은 장은 짧은 창을 긴 창의 1/12로 두라는 지침과 "a constant 0.1% error rate uses exactly all of the error budget: a burn rate of 1"을 함께 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="names" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 재는 것은 SLI, 약속은 SLO, 허용량은 budget, 속도는 burn rate입니다</h2>
          <div className={prose}>
            <p>
              앞 두 절의 숫자에 표준 이름을 붙입니다. 서비스 수준의 한 측면을 신중하게 정의해 잰 양이 SLI(service level indicator)입니다. 이 글의 SLI는 "checkout Service를 지난 요청 가운데 5xx가 아닌 비율"입니다. SLI가 지켜야 할 목표값이 SLO(service level objective)입니다. 여기서는 30일 99.9%입니다.
            </p>
            <p>
              SLO를 어겼을 때의 결과(환불·위약금)까지 적은 계약이 SLA(service level agreement)이며, 운영팀이 매일 보는 숫자는 SLA가 아니라 SLO입니다. 1 − SLO만큼의 실패를 허용하는 총량이 error budget입니다. 어떤 창의 실패율을 1 − SLO로 나눈 배수가 burn rate입니다. 창을 길고 짧은 둘로 두어 둘 다 임계값을 넘을 때만 울리는 경보는 multiwindow multi-burn-rate alert라 부릅니다.
            </p>
            <p>
              SRE 책은 사용자 대면 시스템에서 네 가지만 잴 수 있다면 지연(latency), 트래픽(traffic), 오류(errors), 포화(saturation)를 재라고 적으면서 이를 four golden signals라 부릅니다. SLI는 보통 이 가운데 지연과 오류에서 고릅니다. 포화는 원인 층의 신호입니다. 손으로 반복하는 운영 작업은 toil, 사고 뒤에 쓰는 보고서는 postmortem이라 부르며 각각 10절과 11절에서 다룹니다.
            </p>
            <p>
              이름이 붙었으니 다시 Kubernetes로 돌아옵니다. SLI는 어디서 잴까요? Pod 안의 앱 지표는 Pod가 죽으면 같이 사라지며, Pod가 Service에서 빠진 동안의 실패는 세지 못합니다. 그래서 SLI는 Ingress·Gateway나 Service 앞단처럼 사용자 쪽에서 가장 가까운 지점에서 잽니다. Pod가 Service 뒤에 붙었다 빠지는 경로는 <a href="/cs/cloud/kubernetes-network-packet-path#overview">Kubernetes 패킷 경로</a>에 있습니다.
            </p>
          </div>
          <div id="paper-sre-sli" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Google SRE Book · Chapter 4 Service Level Objectives (2026-10-17 확인)" citeKey={2} href="https://sre.google/sre-book/service-level-objectives/">
              <q>An SLI is a service level indicator—a carefully defined quantitative measure of some aspect of the level of service that is provided.</q> 같은 장은 SLO를 "a target value or range of values for a service level that is measured by an SLI"로, SLA를 "an explicit or implicit contract with your users that includes consequences of meeting (or missing) the SLOs"로 정의하고, 예시 SLO 문장으로 "99% of Get RPC calls will complete in less than 100 ms."를 듭니다.
            </CitationBlock>
          </div>
        </section>

        <section id="multiwindow" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 긴 창은 충분히 많이 썼는지, 짧은 창은 아직 쓰고 있는지를 따로 묻습니다</h2>
          <div className={prose}>
            <p>
              1시간 창 하나로만 경보를 걸면 두 가지가 어긋납니다. 첫째, 15% 오류가 시작된 뒤 1시간 평균이 1.44%를 넘기까지 15% × t ÷ 60 ≥ 1.44%, 곧 약 5.8분이 걸립니다. 이건 받아들일 만합니다. 둘째, 오류가 멎은 뒤에도 사건이
              1시간 창 밖으로 완전히 밀려날 때까지 평균이 임계값 위에 머뭅니다. 10분짜리 사건이면 끝난 뒤 약 50분을 더 울립니다. 이미 복구된 서비스 때문에 당직자가 한 시간 가까이 경보를 끌 수 없는 셈입니다.
            </p>
            <p>
              Workbook의 해법은 창을 하나 더 두는 것입니다. 긴 창(1시간)은 "충분히 큰 소진인가"를, 그 1/12인 짧은 창(5분)은 "지금도 진행 중인가"를 보증합니다. 둘 다 임계값을 넘을 때만 울리면 시작은 긴 창이 넘는 순간,
              해제는 짧은 창이 내려오는 순간이 됩니다. 아래 그림이 그 두 순간을 분 단위로 보여 줍니다.
            </p>
          </div>
          <BurnRateWindowViz />
          <div className={prose}>
            <p>아래 의사코드는 경보 규칙 하나가 1분마다 평가되는 순서입니다. 각 줄의 설명에 장애 시작 6분 뒤(16분 시점)의 값을 적었습니다.</p>
          </div>
          <AlgorithmBlock
            title="multiwindow burn-rate 경보 한 줄의 평가 순서"
            input={["slo = 0.999, period = 30일", "long = 1h, short = 5m, burn = 14.4 (Table 5-8 첫 줄)", "errors(w), requests(w): 지난 w 동안의 실패 수와 요청 수"]}
            steps={[
              { code: "threshold = burn × (1 − slo)", note: "14.4 × 0.001 = 0.0144입니다. 이 값은 창과 무관하게 같습니다." },
              { code: "ratio_long = errors(long) / requests(long)", note: "16분 시점에 지난 1시간 안의 실패는 15% × 6분 = 54,000개, 요청은 3,600,000개라 1.5%입니다." },
              { code: "ratio_short = errors(short) / requests(short)", note: "지난 5분은 모두 장애 중이라 15%입니다. 11분 시점에도 이미 3%로 임계값 위였습니다." },
              { code: "if ratio_long > threshold and ratio_short > threshold: fire(page)", note: "1.5% > 1.44%이고 15% > 1.44%라 처음으로 둘 다 참이 되어 Page가 울립니다. 11분에는 긴 창이 0.25%라 울리지 않았습니다." },
              { code: "elif firing and ratio_short <= threshold: resolve()", note: "오류가 20분에 멎으면 25분에 짧은 창이 0%가 되어 해제됩니다. 긴 창은 여전히 2.5%지만 AND 조건이 깨집니다." },
            ]}
            repeatUntil="1분마다 다시 평가합니다. 6시간/30분 줄(burn 6)과 3일/6시간 줄(burn 1)도 같은 순서로 따로 평가하되, 큰 줄이 울리면 작은 줄은 억제합니다."
            output="16분에 Page 시작, 25분에 해제입니다. 긴 창 하나만 썼다면 75분까지 울렸을 것입니다. Workbook의 예시 PromQL은 job:slo_errors_per_request:ratio_rate1h > (14.4*0.001) and ratio_rate5m > (14.4*0.001)입니다."
          />
        </section>

        <section id="symptom-cause" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. 깨우는 기준은 증상에, 원인 지표는 깨어난 뒤에 읽습니다</h2>
          <div className={prose}>
            <p>
              SRE 책은 monitoring이 답해야 할 질문을 둘로 나눕니다. 무엇이 고장 났는가(증상)와 왜 고장 났는가(원인)입니다. 앞 절까지의 경보는 모두 증상, 곧 사용자가 보는 실패율에 걸렸습니다. 원인 층의 지표에 경보를 걸면 왜
              안 되는지는 공개 장애 보고서 세 건이 보여 줍니다. 같은 증상 뒤에 운영자가 예상하지 못한 원인이 있었기 때문입니다.
            </p>
            <p>
              loveholidays의 GKE cluster에서는 배포가 멈추고 새 Pod 절반이 Pending이었습니다. Pod의 Event는 "0/256 nodes are available: 1 node(s) were unschedulable, 173 Insufficient memory, 214 node(s) didn't match node selector, 87 Insufficient cpu"였습니다.
            </p>
            <p>
              증상은 자원 부족이라 Cluster Autoscaler가 노드를 더 만들어야 했지만, 원인은 Pod용 IP 범위 /16(65,536개)을 노드당 /24(256개)씩 미리 떼어 주는 규칙이었습니다. 65,536 ÷ 256 = 256노드가 상한이었는데, 팀은 노드당 Pod 110개 기준으로 65,536 ÷ 110 ≈ 595노드를 기대했습니다. 자원 지표를 아무리 봐도 IP 상한은 나오지 않습니다.
            </p>
            <p>
              kubernetes/kubernetes#67577(2018-08-20 개설, 2020-11-01 종료)에서는 CPU 사용량이 limit보다 훨씬 낮은 컨테이너가 throttle되어 지연이 튀었습니다. limit을 40m에서 100m·200m으로 올려도 같았습니다. 원인은 커널 CFS bandwidth 코드의 결함이라 수정 커밋 de53fd7ae가 들어간 커널에서 사라졌습니다. CPU 사용률 경보는 조용한 채 지연 SLI만이 증상을 보였습니다.
            </p>
            <p>
              limit이 CFS quota로 바뀌는 과정은{" "} <a href="/cs/cloud/kubernetes-requests-limits-allocatable-qos#overview">requests와 limits</a>와 <a href="/cs/cloud/linux-containers-cgroup-namespace#overview">cgroup과 namespace</a>에 있습니다.
            </p>
            <p>
              Reddit의 2023년 3월 14일 장애에서 API server 로그는 쓰기 요청의 타임아웃을 보였습니다. 원인은 그 쓰기 자체가 아니라 모든 리소스를 검사하던 OPA admission webhook 호출의 타임아웃이었습니다. 그 webhook을 지워도 cluster는 회복되지 않았습니다. 진짜 원인은 더 아래, 9절의 label에 있었습니다. 증상에서 원인까지 두 층을 내려간 사례입니다.
            </p>
            <p>
              webhook이 API 쓰기를 통째로 막을 수 있는 이유는 Kubernetes v1.37.1의 타입 정의에 있습니다. failurePolicy는 Ignore와 Fail 두 값 중 하나이며 비워 두면 Fail입니다. timeoutSeconds는 기본 10초, 최대 30초입니다. Fail 정책의
              webhook이 응답하지 않으면 모든 쓰기가 최대 30초씩 기다리다 거부됩니다. 증상은 "API server가 느리다"지만 원인은 webhook 하나입니다.
            </p>
          </div>
          {code("webhook-failure-policy", "FailurePolicy 두 값")}
          {code("webhook-defaults", "failurePolicy 기본값 Fail")}
          {code("webhook-timeout", "timeoutSeconds 기본 10초")}
          <div className={prose}>
            <p>
              golden signal 넷을 Kubernetes 운영에 놓으면 이렇습니다. 지연과 오류는 Service·Ingress 앞에서 잰 SLI로서 Page의 재료입니다. 트래픽은 그 SLI의 분모이자 burn rate 창을 요청 수로 세는 근거입니다.
            </p>
            <p>
              포화는 노드의 CPU throttling(cgroup cpu.stat의 nr_throttled), 메모리 PSI, CoreDNS의 QPS 대비 메모리처럼 원인 층의 신호라서 대시보드와 Ticket의 재료입니다. 책은 성공한 요청과 실패한 요청의 지연을 분리하라고도 적습니다. DB 연결이 끊겨 즉시 500을 돌려주면 평균 지연은 오히려 좋아 보이기 때문입니다.
            </p>
          </div>
          <div id="paper-golden-signals" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Google SRE Book · Chapter 6 Monitoring Distributed Systems (2026-10-17 확인)" citeKey={3} href="https://sre.google/sre-book/monitoring-distributed-systems/">
              <q>The four golden signals of monitoring are latency, traffic, errors, and saturation.</q> 같은 장은 monitoring이 답할 두 질문을 "what's broken, and why?"로 적고, "It's important to distinguish between the latency of successful requests and the latency of failed requests."라며 빠른 500이 평균 지연을 왜곡한다고 설명합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="budget-policy" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. budget이 남아 있으면 배포하고, 바닥나면 배포를 멈추고 복원력에 씁니다</h2>
          <div className={prose}>
            <p>
              error budget은 경보의 분모일 뿐 아니라 변경의 허가증입니다. SRE 책은 분기 SLO 99.999%인 서비스에서 어떤 문제가 예상 요청의 0.0002%를 실패시키면 그 분기 budget의 20%를 쓴 것이라고 계산하고, budget이 남아 있는 한 새 release를 내보내다가 budget이 소진되면 release를 멈춰 테스트와 복원력에 투자한다고 적습니다. 제품팀과 SRE가 협상 대신 숫자로 결정하게 만드는 장치입니다.
            </p>
            <p>
              3절의 서비스에 적용해 봅니다. 월초에 budget 259만 개가 있습니다. 10분짜리 장애가 3.47%를 쓴 데다 배포 중 rollout이 잘못되어 또 5%를 썼다면 남은 budget은 91.5%입니다. 아직 배포할 수 있습니다. 그런데 셋째 주에
              큰 장애로 80%를 더 썼다면 남은 11.5%로 월말까지 버텨야 하므로 새 기능 배포는 멈춥니다. 그 달 남은 변경은 복원력을 높이는 것(PDB 추가, probe 수정, limit 조정)으로 제한합니다.
            </p>
            <p>
              이 규칙이 작동하려면 budget을 세는 monitoring이 cluster 밖에 있어야 합니다. Zalando의 보고서가 적은 기여 요인이 정확히 이것입니다. cluster 안의 monitoring이 cluster DNS에 의존해 함께 멈춘 탓에 사람이 알아채기까지 시간이 걸렸습니다. 후속 조치도 cluster 밖에서의 경보와 호출 실패 시 직접 escalation이었습니다. SLI를 재는 지점을 사용자 가까이 두라는 5절의 규칙과 같은 이유입니다.
            </p>
            <p>
              같은 보고서의 다른 기여 요인은 Kubernetes 기본 DNS 설정이었습니다. Pod의 resolv.conf는 ndots:5라서 점이 5개 미만인 외부 이름을 조회할 때마다 search 도메인을 먼저 붙여 봅니다. 여기에 Node.js가 결과를 캐시하지 않아 외부 이름 하나에 DNS 질의 10번이 나갔습니다.
            </p>
            <p>
              질의가 늘자 CoreDNS 메모리가 limit 100Mi를 넘어 OOMKill됐으며, limit을 2000Mi로 올린 뒤에야 회복됐습니다. ndots와 search의 동작은{" "} <a href="/cs/cloud/linux-network-interface-route-netfilter-dns#overview">인터페이스·라우팅·netfilter·DNS</a>에, limit과 OOMKill은 <a href="/cs/cloud/linux-memory-page-cache-oom#overview">메모리와 OOM</a>에 있습니다.
            </p>
          </div>
          <div id="paper-zalando-dns" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Zalando · Postmortem: Total DNS outage in Kubernetes cluster (2019-01-07, 2026-10-17 확인)" citeKey={4} href="https://github.com/zalando-incubator/kubernetes-on-aws/blob/dev/docs/postmortems/jan-2019-dns-outage.md">
              <q>This results in 10 DNS queries for every single DNS lookup of an cluster-external name by the application.</q> 같은 보고서는 CoreDNS Pod들이 "getting OOM Killed at the same time" 뒤 회복하지 못해 "total DNS outage"가 됐고, 당직자가 memory requests/limits를 100Mi에서 2000Mi로 올린 뒤 회복했으며, 고객 오류가 "for over 1 hour" 이어졌다고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="upgrade-skew" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. 업그레이드는 API server부터 한 단계씩, kubelet은 세 단계까지 뒤처져도 됩니다</h2>
          <div className={prose}>
            <p>
              budget이 허락하는 변경 가운데 가장 큰 것이 cluster 업그레이드입니다. Kubernetes는 구성 요소 사이에 허용하는 버전 차이를 version skew policy로 정해 두었습니다. HA cluster의 kube-apiserver들은 서로 minor 1단계 안에 있어야 합니다. kubelet과 kube-proxy는 kube-apiserver보다 새로울 수 없지만 minor 3단계까지 오래될 수는 있습니다.
            </p>
            <p>
              kube-controller-manager·kube-scheduler는 1단계까지 오래될 수 있으며 kubectl은 위아래 1단계입니다.
            </p>
            <p>
              이 규칙에서 순서가 나옵니다. 먼저 kube-apiserver를 한 minor 올립니다. 그 다음 controller-manager와 scheduler, 그 다음 노드를 drain한 뒤 kubelet, 마지막으로 kube-proxy입니다. 문서는 kubelet의 minor 업그레이드를 제자리에서 하는 것은 지원하지 않는다고 적습니다.
            </p>
            <p>
              업그레이드 전 확인 항목에는 "등록된 admission webhook이 새 API server가 보낼 데이터를 처리할 수 있는지"를 넣습니다. kubelet이 3단계 뒤처진 노드가 있으면 control plane을 올리기 전에 그 노드부터 올려야 합니다.
            </p>
            <p>
              kubeadm은 이 정책을 상수 세 개와 검사 함수 하나로 집행합니다. v1.37.1의 cmd/kubeadm/app/phases/upgrade/policy.go 30~37행은 control plane 업그레이드·다운그레이드 폭을 1, kubelet 허용 차이를 3으로 둡니다. EnforceVersionPolicies(47행)는 목표 버전이 최소 지원 버전(kubeadm 버전 − 1, constants.go 486행) 아래면 거부합니다.
            </p>
            <p>
              정식 릴리스로 minor 2단계를 뛰면 Mandatory 오류를, CI 버전이면 -f로 넘길 수 있는 Skippable 오류를 냅니다(83~92행). detectTooOldKubelets(173행)는 새 버전 minor가 어떤 kubelet의 minor + 3보다 크면 그 버전 목록을 오류로 돌려줍니다.
            </p>
          </div>
          {code("skew-constants", "허용 skew 상수 1·1·3")}
          {code("skew-enforce", "EnforceVersionPolicies 검사")}
          {code("skew-old-kubelets", "너무 오래된 kubelet 탐지")}
          {code("skew-minimum-versions", "kubeadm 버전 − 1 · − 3")}
          <div className={prose}>
            <p>
              규칙을 다 지켜도 업그레이드는 cluster마다 다른 곳에서 터집니다. Reddit은 가장 오래되고 큰 cluster를 1.23에서 1.24로 올리다 314분을 멈췄습니다.
            </p>
            <p>
              Calico route reflector의 nodeSelector와 peerSelector가 label node-role.kubernetes.io/master를 가리켰는데, 1.20대에 master가 control-plane으로 바뀐 뒤 1.24에서 실행 중인 cluster에서도 master label이 제거되어 selector가 노드 0개에 매칭됐습니다. route reflector가 사라지자 Pod 간 경로 전파가 멈췄습니다.
            </p>
            <p>
              control plane을 껐다 켜도, webhook을 지워도 소용없자 몇 시간 뒤 백업에서 복원하는 쪽을 택했습니다. 보고서는 근인을 label이라 적으면서도 진짜 원인은 "Inconsistency", 곧 cluster마다 다른 맞춤 구성이라고 적습니다. 이 사례가 주는 규칙은 셋입니다.
            </p>
            <p>
              릴리스 노트의 deprecation과 label 변경을 selector 목록과 대조할 것, production과 같은 구성의 사전 cluster에서 먼저 올릴 것, 되돌리기(다운그레이드도 policy.go에서 1단계만 허용되는 또 하나의 버전 변경입니다) 절차를 사고 전에 연습해 둘 것입니다. 노드 OS의 자동 업데이트가 두 번째 변경 경로가 되는 사례는 <a href="/cs/cloud/linux-systemd-boot-change-incidents#overview">systemd와 변경 사고</a>에 있습니다.
            </p>
          </div>
          <div id="paper-version-skew" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Version Skew Policy (website main, 2026-10-17 확인)" citeKey={5} href="https://kubernetes.io/releases/version-skew-policy/">
              <q>kubelet may be up to three minor versions older than kube-apiserver</q> 같은 문서는 kube-apiserver 인스턴스끼리 "within one minor version", kubectl은 "within one minor version (older or newer)"이라 적고, 업그레이드 순서를 kube-apiserver → kube-controller-manager·kube-scheduler·cloud-controller-manager → kubelet(drain 뒤) → kube-proxy로 두며 "In-place minor version kubelet upgrades are not supported."라고 적습니다.
            </CitationBlock>
          </div>
          <div id="paper-reddit-piday" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Reddit Engineering · You Broke Reddit: The Pi-Day Outage (장애 2023-03-14, Wayback 사본으로 2026-10-17 확인)" citeKey={6} href="https://www.reddit.com/r/RedditEng/comments/11xx5o0/you_broke_reddit_the_piday_outage/">
              <q>In the 1.20 series, Kubernetes changed its terminology from "master" to "control-plane." And in 1.24, they removed references to "master," even from running clusters.</q> 같은 글은 중단을 "the 314-minute outage"로, 백업 복원을 "Restoring from a backup is scary, and we hate it."로, 시스템적 원인을 "Inconsistency"로 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="toil" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 손으로 반복하는 복구는 toil이고, controller가 그 일을 대신해야 합니다</h2>
          <div className={prose}>
            <p>
              SRE 책은 운영 작업 가운데 toil을 여섯 특성으로 가려냅니다. 손으로 하는 일(manual), 반복되는 일(repetitive), 자동화할 수 있는 일(automatable), 사건에 끌려 다니는 일(tactical), 끝나도 서비스가 나아지지 않는 일(no enduring value), 서비스가 커지는 만큼 늘어나는 일(O(n) with service growth)입니다.
            </p>
            <p>
              Google SRE 조직은 각 SRE 시간의 50% 미만을 toil에 쓰는 것을 목표로 내걸었습니다.
            </p>
            <p>
              (가정) Kubernetes 운영에서 toil은 이런 모양입니다. 메모리가 새는 Pod를 매일 아침 kubectl rollout restart로 재시작하는 일, 노드 커널 패치 때마다 노드 수십 대를 손으로 drain하고 uncordon하는 일, CoreDNS limit을 부하가 늘 때마다 손으로 올리는 일입니다. 셋 다 반복되는 데다 자동화할 수 있으며 cluster가 커지면 늘어납니다.
            </p>
            <p>
              Kubernetes의 답은 그 자동화를 controller로 만드는 것입니다. 메모리 누수는 limit과 OOMKill 뒤 재시작으로, 노드 패치는 PDB를 지키며 drain하는 도구로, CoreDNS 크기는 autoscaler로 옮깁니다. controller가 목표 상태를 복구하는 원리는 <a href="/cs/cloud/kubernetes-controllers-reconcile-deployment-job#overview">controller와 reconcile</a>에 있습니다.
            </p>
            <p>
              toil을 가려내는 눈은 monitoring의 구멍도 찾아냅니다. NRE Labs의 2018년 12월 장애에서 운영자는 kubectl get pods -n kube-system의 STATUS가 모두 Running인 것만 확인한 채 넘어갔습니다. RESTARTS 열에는 etcd와 kube-apiserver가 183번, kube-controller-manager가 91번 재시작한 기록이 있었습니다.
            </p>
            <p>
              kubeadm이 만든 etcd static Pod의 liveness probe(etcdctl get foo, failureThreshold 8, timeoutSeconds 15)가 실패를 보고해 kubelet이 건강한 etcd를 약 2분마다 죽이는 중이었으며, probe를 떼자 멎었습니다. 글쓴이의 표현대로 "Etcd wasn't actually unhealthy, the kubelet just thought it was."였습니다.
            </p>
            <p>
              kubelet을 손으로 재시작하는 toil이 반복되는 동안 RESTARTS라는 증거는 계속 쌓이는 중이었습니다. probe 종류별 결과와 재시작 수 읽기는 <a href="/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview">Pod 상태와 probe</a>에 있습니다.
            </p>
            <p>
              Blue Matador의 2019년 6월 노드 OOM도 같은 모양입니다. 이틀 연속 production 노드에 SystemOOM이 났는데 원인은 requests·limits가 없던 fluentd 로그 수집 DaemonSet이었습니다. 운영자가 처음 놓친 이유는 그 Pod가 다른 namespace에 있어 기본 namespace의 kubectl get pods에 재시작이 보이지 않았기 때문입니다.
            </p>
            <p>
              조치는 requests 128Mi/100m, limits 1024Mi/250m 설정과 LimitRange·ResourceQuota였습니다. 노드 전체 OOM에서 limit 없는 BestEffort Pod가 먼저 희생되는 순서는 <a href="/cs/cloud/linux-memory-page-cache-oom#kubernetes-qos">메모리와 OOM</a> 11절에 있습니다.
            </p>
          </div>
          <div id="paper-sre-toil" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Google SRE Book · Chapter 5 Eliminating Toil (2026-10-17 확인)" citeKey={7} href="https://sre.google/sre-book/eliminating-toil/">
              <q>Our SRE organization has an advertised goal of keeping operational work (i.e., toil) below 50% of each SRE's time.</q> 같은 장은 toil을 "manual, repetitive, automatable, tactical, devoid of enduring value, and that scales linearly as a service grows"로 정의하고, 스크립트를 손으로 실행하는 시간도 toil이라고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="postmortem" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. postmortem은 사람이 아니라 시스템을 고치고, 쓸 기준을 사고 전에 정합니다</h2>
          <div className={prose}>
            <p>
              이 글이 인용한 여섯 사고에는 공통점이 하나 있습니다. 모두 공개된 postmortem이 있으며, 그 문서가 "누가 잘못했나" 대신 "어떤 조건이 겹쳤나"를 적습니다. SRE 책은 postmortem을 blameless로 쓰는 것을 SRE 문화의 신조로 둡니다. 사고 당시 모두가 자기가 가진 정보로 옳은 일을 했다고 가정한 채 기여 원인을 찾으라고 적습니다. 잘못을 지목하는 문화에서는 사람들이 문제를 드러내지 않기 때문입니다.
            </p>
            <p>
              언제 쓸지도 사고 전에 정합니다. 책이 드는 공통 기준은 일정 기준 이상의 사용자 가시 중단·저하, 어떤 종류든 데이터 손실, 당직자의 개입(rollback·트래픽 우회), 기준 이상의 해결 시간, 그리고 monitoring 실패입니다.
            </p>
            <p>
              마지막 항목은 사고를 시스템이 아니라 사람이 발견했다는 뜻으로, NRE Labs의 RESTARTS 183, Blue Matador의 다른 namespace, Zalando의 cluster 안 monitoring이 모두 여기 해당합니다.
            </p>
            <p>
              좋은 postmortem은 근인과 시스템적 원인을 구분합니다. Reddit은 근인을 label 제거로 적은 뒤 진짜 원인을 cluster마다 다른 구성이라 적었으며, 조치를 구성의 표준화·코드화, pre-production cluster 확충, cluster 수명주기 도구로 잡았습니다. Zalando는 limit 100Mi를 근인으로 적은 뒤 조치를 노드별 DNS 캐시, cluster 밖 경보, VPA로 잡았습니다.
            </p>
            <p>
              둘 다 "다음에는 더 조심하자"가 아니라 사람이 조심하지 않아도 되는 구조를 적었습니다.
            </p>
            <p>
              (가정) 3절의 서비스에서 10분짜리 15% 장애가 났다면 postmortem에는 이렇게 적습니다. 영향: budget 3.47% 소비, 실패 요청 90,000개. 탐지: 16분 시점 Page(장애 시작 6분 뒤), 사람이 아니라 경보가 발견. 근인과 기여 원인, 그리고 재발 방지 항목마다 담당자와 기한을 적습니다. 영향 칸의 숫자가 3절과 4절의 계산 그대로이므로 postmortem과 경보 설계가 같은 단위를 씁니다.
            </p>
          </div>
          <div id="paper-sre-postmortem" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Google SRE Book · Chapter 15 Postmortem Culture: Learning from Failure (2026-10-17 확인)" citeKey={8} href="https://sre.google/sre-book/postmortem-culture/">
              <q>A blamelessly written postmortem assumes that everyone involved in an incident had good intentions and did the right thing with the information they had.</q> 같은 장은 공통 트리거로 "User-visible downtime or degradation beyond a certain threshold", "Data loss of any kind", "On-call engineer intervention", "A resolution time above some threshold", "A monitoring failure"를 들고 기준을 사고 전에 정하라고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 사용자 쪽 SLI와 burn rate를 보고, 변경은 budget과 skew 안에서 합니다</h2>
          <div className={prose}>
            <p>
              경보부터 정리합니다. Page는 Service·Ingress 앞에서 잰 오류율·지연 SLI의 burn rate에 겁니다. 30일 99.9%라면 1시간/5분 창에 14.4배, 6시간/30분 창에 6배를 Page로, 3일/6시간 창에 1배를 Ticket으로 둡니다. Pod 재시작 수, 노드 CPU throttling, CoreDNS 메모리 같은 원인 지표는 대시보드와 Ticket에 두되 Page에서는 뺍니다.
            </p>
            <p>
              그리고 그 monitoring은 cluster 밖에서 돕니다. 변경은 budget으로 허가합니다. 남은 budget이 적으면 기능 배포를 멈춘 채 복원력 변경만 합니다. 업그레이드는 API server → controller-manager·scheduler → (drain 뒤) kubelet → kube-proxy 순으로 minor 한 단계씩, kubelet 3단계·apiserver 1단계·kubectl ±1단계 규칙 안에서 합니다.
            </p>
            <p>
              올리기 전에 릴리스 노트의 label·API 제거를 selector와 webhook 설정에 대조합니다. production과 같은 구성의 cluster에서 먼저 올린 뒤 되돌리는 절차를 연습해 둡니다.
            </p>
            <p>
              사고 뒤에는 기준에 맞으면 반드시 postmortem을 씁니다. 영향은 budget 단위로, 근인 아래의 시스템적 원인과 사람이 조심하지 않아도 되는 조치까지 적습니다. 반복되는 손 작업이 보이면 toil로 이름 붙여 controller나 도구로 옮깁니다.
            </p>
            <p>
              이 글의 수치는 가정한 서비스에 Workbook의 식을 손으로 적용한 값이지 실제 monitoring을 돌려 잰 것이 아닙니다. 여섯 장애의 숫자는 각 보고서가 적은 그대로이며 회사별 빈도나 일반성은 주장하지 않습니다.
            </p>
            <p>
              CKA 범위에서 이 글이 닿는 영역은 Troubleshooting(30%)과 Cluster Architecture·Installation(25%)의 cluster lifecycle 항목이며, 전체 비중은{" "} <a href="/cs/cloud/kubernetes-concept-map#overview">Kubernetes 개념 지도</a>에 있습니다.
            </p>
          </div>
          <ContentBoundary article="kubernetes-sre-slo-burn-rate-upgrades" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. 같은 서비스로 다음 숫자를 예상해 보세요</h2>
          <div className={prose}>
            <p>
              SLO를 99.95%로 올리면 3절의 budget은 몇 분, 몇 개 요청이 될까요? 같은 10분짜리 15% 장애는 그 budget의 몇 %를 쓸까요? (답: 3절) SLO가 99%인 서비스에서 1시간 창 Page 임계값은 실패율 몇 %일까요? 그리고 Table 5-8의 burn rate 14.4는 왜 바뀌지 않을까요? (답: 4절) 장애가 10분이 아니라 3분 만에 끝났다면 6절의 경보는 울렸을까요? 1시간 창 평균의 최댓값으로 설명해 보세요. (답: 6절)
            </p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={kubernetesSreTrees}
        projectMetas={{
          kubernetes: { id: "kubernetes", label: "Kubernetes v1.37.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
