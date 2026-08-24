import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ServingContractViz from "./viz/ServingContractViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        빠른 inference engine을 안정적인 서비스로 바꾸는 제어면
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          LLM 서빙에서 GPU 한 장의 token/s를 높이는 일과, 여러 사용자의 요청을
          예측 가능한 지연으로 처리하는 일은 서로 다른 문제입니다. 후자는
          prompt와 output 길이가 매번 달라지고 stream이 오래 열리기 때문에, 평균
          처리량만 높아도 긴 요청 몇 개가 queue를 밀어내거나 새 replica가
          준비되는 동안 SLO를 놓칠 수 있습니다.
        </p>
        <p className="leading-8">
          따라서 운영 설계는 먼저 서비스 계약을 정한 뒤 gateway, serving
          runtime, GPU fleet과 관측 제어면으로 내려가야 합니다. 여기서 서비스
          계약은 “평균 100 tokens/s” 같은 한 숫자가 아니라, workload별
          TTFT·TPOT·완료율·비용과 허용할 context·tool·data region을 함께
          뜻합니다. 엔진 내부의 continuous batching과 KV cache 원리는{" "}
          <Link to="/ai/vllm-serving">vLLM 서빙 구조</Link>, scheduler 세부
          동작은 <Link to="/ai/vllm-scheduler">vLLM scheduler</Link>가
          소유하므로 이 글에서는 반복하지 않습니다.
        </p>
      </div>

      <ServingContractViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Latency는 하나의 숫자가 아니라 서로 다른 사용자 경험이다</h3>
        <p className="leading-8">
          Streaming 응답에서 사용자는 먼저 “언제 첫 글자가 보이는가”를 느끼고,
          그다음에는 “출력이 얼마나 끊기지 않는가”를 느낍니다. 첫 질문이
          TTFT(Time to First Token), 두 번째가 TPOT(Time Per Output
          Token)입니다. 전체 완료 시간은 두 값을 합쳐야 알 수 있지만, TTFT가
          나빠진 원인이 gateway인지 runtime queue인지도 구분해야 하므로 요청
          수명주기에 timestamp를 남깁니다.
        </p>
      </div>

      <ExplainedFormula
        question="한 요청의 TTFT는 어느 계층에서 소비됐는가?"
        idea={
          <>
            요청이 들어온 시점부터 첫 token이 client에 전달될 때까지를 계층별
            구간으로 나눕니다. 각 항은 독립적인 상수가 아니라 같은 request
            trace에서 측정한 시간 차이입니다.
          </>
        }
        formula={String.raw`\begin{aligned}
T_{\mathrm{TTFT}}={}&T_{\mathrm{ingress}}+T_{\mathrm{route}}\\
&+T_{\mathrm{queue}}+T_{\mathrm{prefill}}+T_{\mathrm{first\ emit}}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
T_{\mathrm{TTFT}}={}&\underbrace{T_{\mathrm{ingress}}}_{\text{입구 처리 계산}}+T_{\mathrm{route}}\\
&+T_{\mathrm{queue}}+T_{\mathrm{prefill}}+T_{\mathrm{first\ emit}}
\end{aligned}`}
        operations={[
          { expression: String.raw`T_{\mathrm{ingress}}`, annotation: ["입구 처리이(가) 식의 결과에 기여하는 방식을 계산합니다.","요청이 들어온 시점부터 첫 token이 client에 전달될","때까지를 계층별 구간으로 나눕니다."] },
        ]}
        terms={[
          {
            symbol: "T_{\\mathrm{ingress}}",
            name: "입구 처리",
            description:
              "인증, rate limit, request parsing과 gateway까지의 전송 시간입니다.",
          },
          {
            symbol: "T_{\\mathrm{route}}",
            name: "routing",
            description:
              "후보 filtering, backend 선택과 연결 준비에 사용한 시간입니다.",
          },
          {
            symbol: "T_{\\mathrm{queue}}",
            name: "queue",
            description:
              "runtime에 도착한 요청이 처음 schedule될 때까지 기다린 시간입니다.",
          },
          {
            symbol: "T_{\\mathrm{prefill}}",
            name: "prefill",
            description:
              "prompt token을 처리해 첫 decode에 필요한 state를 만든 시간입니다.",
          },
          {
            symbol: "T_{\\mathrm{first\\ emit}}",
            name: "첫 token 전달",
            description:
              "첫 decode 결과가 serialization과 streaming을 거쳐 관측 지점에 도달한 시간입니다.",
          },
        ]}
        assumptions={[
          "각 구간의 시작·종료 clock이 일관되고 중복되지 않게 instrumentation되어 있어야 합니다.",
          "Client가 측정한 TTFT와 server가 측정한 TTFT는 network 구간 때문에 다를 수 있으므로 metric 이름에 관측 위치를 포함합니다.",
        ]}
        interpretation="TTFT 상승만으로 GPU가 느려졌다고 결론 내릴 수 없습니다. queue만 늘었다면 admission·routing·capacity 문제이고, prefill이 늘었다면 prompt length mix나 runtime 변화부터 확인합니다."
      />

      <ExplainedFormula
        question="첫 token 이후 전체 응답 완료 시간은 무엇이 결정하는가?"
        idea={
          <>
            첫 token 뒤에는 각 output token 사이의 간격이 누적됩니다. 평균
            TPOT만 적으면 tail stall을 감출 수 있으므로, 실제 trace에서는 token
            간격의 분포도 함께 보존합니다.
          </>
        }
        formula={String.raw`T_{\mathrm{complete}}=T_{\mathrm{TTFT}}+\sum_{i=2}^{N_{\mathrm{out}}}\Delta t_i+T_{\mathrm{tail}}`}
        annotatedFormula={String.raw`T_{\mathrm{complete}}=\underbrace{T_{\mathrm{TTFT}}+\sum_{i=2}^{N_{\mathrm{out}}}\Delta t_i+T_{\mathrm{tail}}}_{\text{변화량 계산}}`}
        operations={[
          { expression: String.raw`T_{\mathrm{TTFT}}+\sum_{i=2}^{N_{\mathrm{out}}}\Delta t_i+T_{\mathrm{tail}}`, annotation: ["인접한 level의 차이를 남겨 변화량을 계산합니다.","첫 token 뒤에는 각 output token 사이의 간격이","누적됩니다."] },
        ]}
        terms={[
          {
            symbol: "N_{\\mathrm{out}}",
            name: "output token 수",
            description:
              "요청이 실제로 생성한 token 수이며 max_tokens와 같지 않을 수 있습니다.",
          },
          {
            symbol: "\\Delta t_i",
            name: "token 간격",
            description:
              "i−1번째와 i번째 token이 관측 지점을 통과한 시각의 차이입니다.",
          },
          {
            symbol: "T_{\\mathrm{tail}}",
            name: "마무리 구간",
            description:
              "마지막 token 뒤 finish reason, usage, connection close가 전달되는 시간입니다.",
          },
        ]}
        assumptions={[
          "Streaming completion을 기준으로 하며 non-streaming API에서는 client가 중간 token 간격을 직접 관측할 수 없습니다.",
          "Tool execution과 application-side 후처리는 별도 span으로 두거나 이 식의 범위를 명시해야 합니다.",
        ]}
        interpretation="짧은 답변은 TTFT가, 긴 답변은 누적 TPOT가 지배하기 쉽습니다. 그러므로 workload별 output length 분포 없이 p95 latency 하나만 비교하면 개선 지점을 잘못 고를 수 있습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>이 글의 top-down 운영 순서</h3>
        <ol className="leading-8">
          <li>Workload와 SLO를 고정해 어떤 요청을 보호할지 정합니다.</li>
          <li>Gateway에서 capability·deadline·retry 경계를 적용합니다.</li>
          <li>
            GPU node와 model Pod가 실제 capacity가 되는 준비 시간을 측정합니다.
          </li>
          <li>
            Probe·canary·drain으로 traffic admission과 rollout을 통제합니다.
          </li>
          <li>
            SLI와 error budget을 scale·route·rollback의 closed-loop로
            연결합니다.
          </li>
        </ol>
      </div>
    </section>
  );
}
