import ExplainedFormula from "@/components/ui/explained-formula";
import SignalControlViz from "./viz/SignalControlViz";

const signals = [
  [
    "User SLI",
    "client TTFT · TPOT · completion · valid response",
    "SLO와 paging의 기준",
  ],
  [
    "Gateway",
    "route time · attempts · fallback · deadline",
    "정책과 retry 증폭",
  ],
  [
    "Runtime",
    "waiting/running · queue/prefill/decode time · KV usage",
    "memory·scheduler 압력",
  ],
  [
    "Fleet",
    "ready replica · Pending Pod · node/model ready time",
    "도착하지 않은 capacity",
  ],
  [
    "Workload",
    "prompt/output length · tools · tenant · priority",
    "mix 변화와 noisy neighbor",
  ],
] as const;

export default function Observability() {
  return (
    <section id="observability-aiops" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        관측은 dashboard가 아니라 다음 결정을 재현하는 기록이다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          vLLM은 running·waiting request, KV cache usage, prompt/output token,
          TTFT·inter-token latency, queue·prefill·decode time 같은 metric을
          제공합니다. 각각은 중요한 신호지만 서로 다른 model version과
          workload를 한 그래프에 섞으면 원인을 잃습니다. Request ID와 trace ID를
          기준으로 gateway route, runtime instance, artifact version과
          prompt/output length bucket을 연결해야 “긴 prompt가 늘었다”와 “같은
          prompt가 느려졌다”를 구분할 수 있습니다.
        </p>
      </div>

      <SignalControlViz />

      <figure data-viz="serving-signal-evidence-ledger" className="not-prose my-10 overflow-hidden rounded-xl border border-border/70 bg-card">
        <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
          <p className="text-xs font-bold text-primary">TRACE-ALIGNED SIGNALS</p>
          <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">계층별 신호를 같은 request·artifact·workload 축에 맞춥니다</h3>
        </figcaption>
        <div className="grid gap-3 p-5 sm:p-7 lg:grid-cols-5">
          {signals.map(([layer, metric, question], index) => (
            <article key={layer} className="min-w-0 rounded-lg border bg-background p-5">
              <div className="flex items-center justify-between gap-3">
                <strong className="text-sm">{layer}</strong>
                <span className="font-mono text-xs font-bold text-primary">0{index + 1}</span>
              </div>
              <p className="mt-4 break-words font-mono text-xs leading-5 text-primary">{metric}</p>
              <p className="mt-4 border-t pt-4 text-xs leading-5 text-muted-foreground">{question}</p>
            </article>
          ))}
        </div>
      </figure>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>SLO는 평균보다 workload와 percentile을 먼저 고정한다</h3>
        <p className="leading-8">
          Interactive chat의 TTFT와 batch summarization의 완료 시간은 같은 SLO가
          아닙니다. Model alias, priority, prompt/output length bucket과
          streaming 여부별로 어떤 요청을 valid event로 셀지 정한 뒤, 그중 기준을
          만족한 비율로 SLI를 계산합니다. 취소도 client가 떠난 것인지 server가
          deadline을 넘긴 것인지 분리해야 실패율을 왜곡하지 않습니다.
        </p>

        <h3>Page는 GPU 상태가 아니라 error budget 소진 속도에 건다</h3>
        <p className="leading-8">
          GPU utilization과 waiting request는 진단과 scale에 유용하지만, 사용자
          영향이 없는데도 당직자를 호출할 수 있습니다. Paging은
          TTFT·completion·error 같은 SLO event가 허용 실패 비율을 얼마나 빠르게
          소진하는지에 연결합니다. 짧은 spike와 지속 장애를 함께 잡기 위해 긴
          window와 짧은 window를 결합하고, traffic이 적은 서비스에서는 한두 건이
          과도한 burn rate를 만들 수 있으므로 최소 event 수나 synthetic probe를
          함께 둡니다.
        </p>
      </div>

      <ExplainedFormula
        question="현재 실패율은 SLO가 허용한 속도보다 몇 배 빠르게 error budget을 쓰는가?"
        idea={
          <>
            SLO가 허용하는 실패 비율은 1−SLO입니다. 같은 window에서 실제 bad
            event 비율을 이 값으로 나누면, budget을 정상 속도의 몇 배로
            소진하는지 알 수 있습니다.
          </>
        }
        formula={String.raw`r_{\mathrm{burn}}=\frac{N_{\mathrm{bad}}/N_{\mathrm{total}}}{1-S_{\mathrm{SLO}}}`}
        annotatedFormula={String.raw`r_{\mathrm{burn}}=\underbrace{\frac{N_{\mathrm{bad}}/N_{\mathrm{total}}}{1-S_{\mathrm{SLO}}}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{N_{\mathrm{bad}}/N_{\mathrm{total}}}{1-S_{\mathrm{SLO}}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","SLO가 허용하는 실패 비율은 1−SLO입니다."] },
        ]}
        terms={[
          {
            symbol: "N_{\\mathrm{bad}}",
            name: "bad events",
            description:
              "해당 window에서 latency·error·validity SLO를 만족하지 못한 event 수입니다.",
          },
          {
            symbol: "N_{\\mathrm{total}}",
            name: "valid events",
            description: "같은 SLO 정의에 포함되는 전체 event 수입니다.",
          },
          {
            symbol: "S_{\\mathrm{SLO}}",
            name: "SLO target",
            description: "예를 들어 99.9%이면 허용 실패 비율은 0.1%입니다.",
          },
          {
            symbol: "r_{\\mathrm{burn}}",
            name: "burn rate",
            description:
              "1이면 window 전체에서 허용된 평균 속도, 10이면 그 열 배 속도로 budget을 씁니다.",
          },
        ]}
        assumptions={[
          "분자와 분모가 같은 event 정의와 관측 window를 사용합니다.",
          "Low-traffic 서비스는 rate의 통계적 불안정성을 별도로 다룹니다.",
        ]}
        interpretation="99.9% SLO에서 실제 실패율이 1%라면 burn rate는 10입니다. 원인 metric의 절대 임계치보다 남은 error budget과 대응 시간을 직접 연결할 수 있습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>자동화는 observe–decide–act–verify가 닫혀 있어야 한다</h3>
        <p className="leading-8">
          여기서 <em>closed-loop</em>는 업계에서 쓰는 제어 용어이므로 억지로
          풀어 쓰지 않습니다. Metric을 보고 scale이나 route를 바꿨다면, 같은
          workload와 SLI에서 개선됐는지 다시 측정하고 효과가 없거나 부작용이
          생기면 중단·rollback 해야 한다는 뜻입니다. 단순 threshold action은
          자동화이지만 결과를 되먹이지 않으면 closed-loop가 아닙니다.
        </p>
      </div>

      <ExplainedFormula
        question="한 번의 운영 변경이 실제로 사용자 SLI를 개선했다고 언제 말할 수 있는가?"
        idea={
          <>
            변경 전후의 SLI 차이에서 자연 변동과 workload mix 변화를 분리합니다.
            실무에서는 canary와 control을 같은 시간대에 비교하고, prompt/output
            bucket별 차이를 함께 확인합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
\Delta_{\mathrm{after}}&=S_{\mathrm{canary,after}}-S_{\mathrm{control,after}}\\
\Delta_{\mathrm{before}}&=S_{\mathrm{canary,before}}-S_{\mathrm{control,before}}\\
\Delta_{\mathrm{effect}}&=\Delta_{\mathrm{after}}-\Delta_{\mathrm{before}}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\Delta_{\mathrm{after}}&=\underbrace{S_{\mathrm{canary,after}}-S_{\mathrm{control,after}}}_{\text{변화량 계산}}\\
\Delta_{\mathrm{before}}&=\underbrace{S_{\mathrm{canary,before}}-S_{\mathrm{control,before}}}_{\text{변화량 계산}}\\
\Delta_{\mathrm{effect}}&=\underbrace{\Delta_{\mathrm{after}}-\Delta_{\mathrm{before}}}_{\text{변화량 계산}}
\end{aligned}`}
        operations={[
          { expression: String.raw`S_{\mathrm{canary,after}}-S_{\mathrm{control,after}}`, annotation: ["비교할 SLI이(가) 식의 결과에 기여하는 방식을 계산합니다.","변경 전후의 SLI 차이에서 자연 변동과 workload","mix 변화를 분리합니다."] },
          { expression: String.raw`S_{\mathrm{canary,before}}-S_{\mathrm{control,before}}`, annotation: ["비교할 SLI이(가) 식의 결과에 기여하는 방식을 계산합니다.","변경 전후의 SLI 차이에서 자연 변동과 workload","mix 변화를 분리합니다."] },
          { expression: String.raw`\Delta_{\mathrm{after}}-\Delta_{\mathrm{before}}`, annotation: ["인접한 level의 차이를 남겨 변화량을 계산합니다.","변경 전후의 SLI 차이에서 자연 변동과 workload","mix 변화를 분리합니다."] },
        ]}
        terms={[
          {
            symbol: "S",
            name: "비교할 SLI",
            description:
              "TTFT percentile, success rate, cost efficiency처럼 방향을 명시한 하나의 지표입니다.",
          },
          {
            symbol: "\\Delta_{\\mathrm{after}},\\Delta_{\\mathrm{before}}",
            name: "시점별 집단 차이",
            description:
              "각 시점에서 canary SLI와 control SLI 사이의 차이입니다.",
          },
          {
            symbol: "\\mathrm{canary}",
            name: "변경군",
            description:
              "새 route·replica·artifact 또는 policy를 적용한 traffic입니다.",
          },
          {
            symbol: "\\mathrm{control}",
            name: "대조군",
            description:
              "같은 시간대에 기존 설정으로 처리한 비교 traffic입니다.",
          },
          {
            symbol: "\\Delta_{\\mathrm{effect}}",
            name: "차이의 차이",
            description:
              "공통 traffic 변화와 기존 집단 차이를 일부 상쇄한 추정량입니다.",
          },
        ]}
        assumptions={[
          "Canary와 control의 traffic assignment가 비교 가능하며 중대한 selection bias가 없어야 합니다.",
          "이 식만으로 인과성이 보장되지는 않으며 sample size, confidence interval과 guardrail metric을 함께 봅니다.",
        ]}
        interpretation="변경 직후 TTFT가 낮아졌다는 사실만으로 성공이라 결론 내리지 않습니다. Control도 같은 폭으로 좋아졌다면 traffic이 가벼워진 결과일 수 있습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>자율 운영은 권한보다 검증 범위를 먼저 늘린다</h3>
        <ol className="leading-8">
          <li>
            Metric·trace·artifact provenance로 사람이 장애를 재현할 수 있게
            합니다.
          </li>
          <li>Runbook의 진단과 추천을 자동화하되 실행 전 근거를 남깁니다.</li>
          <li>
            되돌릴 수 있는 scale·route 변경에 최대 폭, cooldown과 deadline을
            둡니다.
          </li>
          <li>
            동일 SLI의 사후 검증과 rollback이 반복해서 통과한 동작만 범위를
            넓힙니다.
          </li>
        </ol>
        <p className="leading-8">
          이 경계를 명시하면 결정론적 policy와 model 판단을 구분할 수 있고,
          장애가 생겼을 때 어떤 입력이 어떤 변경을 만들었는지도 추적할 수
          있습니다.
        </p>
      </div>
    </section>
  );
}
