import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./serving-latency-metrics-and-slo/codeRefs";
import { latencySourceTree } from "./serving-latency-metrics-and-slo/fileTree";
import ServingLatencyMetricsAndSloViz from "./serving-latency-metrics-and-slo/viz/ServingLatencyMetricsAndSloViz";
import LatencyPercentileHistogramViz from "./serving-latency-metrics-and-slo/viz/LatencyPercentileHistogramViz";

export default function Article() {
  const sidebar = useCodeSidebar();
  return <><div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 첫 응답의 기다림과 도중의 멈춤을 따로 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>답변이 늦다는 말에는 두 가지 경험이 섞여 있습니다. 처음 아무것도 보이지 않는 기다림과 답변이 나오다가 끊기는 멈춤입니다. 전체 시간이 같아도 어느 쪽이 긴지에 따라 찾아야 할 원인이 달라집니다.</p><p>이 글은 한 요청의 도착 기록을 작은 숫자로 계산한 뒤 여러 요청을 묶어 서비스의 약속을 판정합니다. 측정 도구가 무엇을 세었는지도 실제 코드로 확인합니다.</p></div></section>

<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 시각을 남기고 간격을 계산한 뒤 약속과 비교합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>측정기는 보낸 시각과 받은 시각들을 같은 시계로 남깁니다. 계산기는 첫 도착까지의 시간과 이후 간격을 구합니다. 집계기는 여러 요청의 값을 모으고 판정기는 정한 기간과 한도에 따라 결과를 냅니다.</p><p>처음에는 이 네 자리만 잡습니다. 한 값으로 모든 단계를 대신하면 어느 기다림이 길어졌는지 다시 확인하기 어렵습니다.</p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>보낸 시각과 받은 시각을 기록한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>한 요청의 기다림과 간격을 계산한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>정한 범위의 여러 요청을 집계한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>한도와 허용 실패 비율로 판정한다</span></li></ol></section>

<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 다섯 조각이 도착한 기록부터 계산합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>요청을 보낸 순간을 0초로 둡니다. 이 예에서는 응답 토큰 다섯 개가 각각 한 번씩 도착하며 시각은 1.000·1.040·1.085·1.285·1.327초입니다. 뒤따르는 별도 이벤트는 없다고 둡니다. 장비 실측이 아닌 설명용 가정입니다. (가정)</p><p>처음 보이기까지 1초가 걸립니다. 그 뒤 네 간격은 40·45·200·42ms이고 합은 327ms입니다. 마지막 도착은 1.327초입니다. 200ms의 멈춤 하나가 있었다는 사실은 전체 시간 하나만으로는 보이지 않습니다. (가정)</p></div></section>

<section id="inside-measurement" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 시계와 응답 개수와 집계 범위가 모두 필요합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>시각 기록은 어느 요청의 어느 수신 이벤트인지 구분해야 합니다. 같은 이벤트에 토큰이 몇 개 묶였는지도 남깁니다. 위 사례에서는 각 이벤트에 하나씩이므로 네 간격을 직접 관측했습니다.</p><p>집계 기록에는 성공·실패, 입력과 출력 길이, 도구 버전, 측정 기간을 붙입니다. 실패한 요청을 빼고 성공 응답의 속도만 보여 주면 장애가 늘어난 서비스가 더 빨라 보일 수 있습니다.</p><p>여러 요청을 묶을 때도 단위를 보존합니다. 요청당 평균 하나를 모은 분포와 모든 수신 간격을 모은 분포는 표본 개수와 긴 응답의 가중치가 다릅니다.</p></div></section>

<section id="why-observations" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 같은 평균이라도 멈춘 순간은 다를 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>40·45·200·42ms를 평균내면 81.75ms입니다. 네 간격이 모두 81.75ms인 기록도 평균은 같습니다. 앞의 기록에서 독자가 겪은 200ms 멈춤을 보려면 개별 간격을 남겨야 합니다. (가정)</p><p>마지막 세 토큰이 한 묶음으로 왔다면 측정 가능한 간격 수도 바뀝니다. 평균을 계산하기 전에 토큰 수와 수신 이벤트 수가 같은지 확인하는 이유입니다. 서버 내부의 생성 시각과 화면에서 받은 시각도 같은 측정이 아닙니다.</p></div></section>

<section id="latency-terms" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 첫 도착과 각 간격과 마지막 도착에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>처음까지의 시간을 TTFT(Time to First Token)라고 합니다. 연속한 토큰 도착 사이의 간격이 ITL(Inter-Token Latency)이고 마지막 토큰까지의 전체 시간이 E2E(End-to-End latency)입니다.</p><p>여기서는 모두 client가 요청을 보낸 시각을 기준으로 같은 시계에서 잽니다. 서버 접수 시각을 출발점으로 쓰면 요청 전송 구간이 빠집니다. 한꺼번에 응답을 받는 방식에서는 첫 토큰이 언제 생성됐는지 따로 알 수 없습니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "TTFT", "description": "client 전송부터 첫 토큰 수신까지의 시간입니다. 사례에서는 1초입니다.", "boundary": "도구가 빈 응답 이벤트도 첫 이벤트로 세는지 확인해야 합니다."}, {"term": "ITL", "description": "두 토큰의 관측된 도착 간격입니다. 사례에서는 40·45·200·42ms입니다.", "boundary": "여러 토큰이 묶인 이벤트에서는 실제 토큰별 시각을 복원할 수 없습니다."}, {"term": "E2E", "description": "정한 종료 사건까지의 전체 경과 시간입니다. 토큰 기준 사례에서는 1.327초입니다.", "boundary": "도구의 종료 사건이 마지막 usage 이벤트라면 마지막 토큰 시각과 다릅니다."}]} /></section>

<section id="metrics" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 1초와 327ms를 더하고 네 간격으로 나눕니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            네 간격의 평균을 TPOT(Time per Output Token)라고 부릅니다. 이 사례에서는 327/4=81.75ms입니다. 첫 토큰까지 1초에 이후 네 간격을 더하면
            E2E=1+4×0.08175=1.327초가 됩니다. (가정)
          </p><p>
            200토큰 응답으로 길이를 바꿔 보겠습니다. 첫 도착 1초, 이후 평균 50ms라면 간격은 199개이므로 10.95초입니다. 평균을 30ms로 줄이면 6.97초이고 첫 도착만
            0.3초로 줄이면 10.25초입니다. 응답 길이가 길수록 뒤의 간격 합이 커집니다. (가정)
          </p><p>TTFT에는 전송과 대기, 입력 처리, 첫 출력의 전달이 함께 들어갑니다. 이 한 값으로 대기열 때문인지 긴 입력 때문인지 가릴 수는 없습니다. 원인을 찾을 때는 <Link to="/cs/ai/vllm-serving#latency-accounting">같은 요청의 단계별 시각</Link>으로 돌아갑니다.</p></div><ExplainedFormula
          question="한 요청의 E2E latency 는 어떤 항으로 정확히 나뉘나요?"
          idea="첫 token 까지의 시간과 그 뒤 token 사이 간격의 합으로 나누면, 두 항이 서로 다른 원인(queue·prefill 대 decode step)을 가리킵니다."
          formula={String.raw`\mathrm{E2E}=\mathrm{TTFT}+\sum_{k=1}^{n-1}\mathrm{ITL}_k=\mathrm{TTFT}+(n-1)\cdot\mathrm{TPOT}`}
          annotatedFormula={String.raw`\mathrm{E2E}=\underbrace{\mathrm{TTFT}}_{\text{첫 내용이 도착할 때까지}}+\underbrace{\sum_{k=1}^{n-1}\mathrm{ITL}_k}_{\text{decode 간격 n−1 개의 합}},\qquad \underbrace{\mathrm{TPOT}=\frac{\mathrm{E2E}-\mathrm{TTFT}}{n-1}}_{\text{간격의 요청 단위 평균}}`}
          operations={[
            { expression: String.raw`\mathrm{TTFT}`, annotation: ["client 전송부터 첫 token 수신까지를 재어", "대기·prefill 병목을 한 값으로 요약"] },
            { expression: String.raw`\sum_{k=1}^{n-1}\mathrm{ITL}_k`, annotation: ["n−1 개의 token 간격을 모두 더해", "decode 구간의 총 시간 구성"] },
            { expression: String.raw`\mathrm{TPOT}=\frac{\mathrm{E2E}-\mathrm{TTFT}}{n-1}`, annotation: ["decode 총 시간을 간격 수로 나눠", "요청 하나의 평균 token 간격 산출"] },
          ]}
          terms={[
            { symbol: "n", name: "Output token 수", description: "요청이 실제로 생성한 token 수입니다. 첫 token 도 포함하므로 간격은 n−1 개입니다." },
            { symbol: String.raw`\mathrm{ITL}_k`, name: "k 번째 token 간격", description: "k 번째와 k+1 번째 token 이 client 에 도착한 시각의 차입니다." },
            { symbol: String.raw`\mathrm{TPOT}`, name: "Time per Output Token", description: "간격들의 산술평균이며 vLLM 은 output_len 이 2 이상인 요청에서만 계산합니다." },
          ]}
          assumptions={["n≥2에서 TPOT를 정의하고 같은 client 시계에서 토큰 도착을 잽니다. n=1이면 간격이 없어 TPOT는 정의되지 않습니다.", "이 항등식은 토큰별 도착 시각이 있고 E2E를 마지막 토큰 도착으로 정의할 때 성립합니다. Chunk 이벤트와 뒤따르는 usage 이벤트로 재는 도구 값에는 그대로 적용하지 않습니다."]}
          interpretation="E2E 가 같아도 TTFT 가 큰 요청과 TPOT 가 큰 요청은 다른 병목을 가리킵니다. 두 항을 항상 따로 보고해야 하고, 평균 TPOT 가 같다는 사실이 간격이 고르다는 뜻은 아닙니다."
        /></section>

<section id="throughput" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 서버 전체의 400토큰과 한 사람의 간격을 구분합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            같은 60초 동안 120요청이 끝나고 출력 토큰 24000개를 받았다면 2요청/s와 400토큰/s입니다. 이런 단위 시간당 처리량을 throughput이라고 합니다. 세는
            대상과 측정 구간을 함께 적습니다. (가정)
          </p><p>
            한 번의 계산에서 각 요청에 한 토큰씩 준다고 합시다. 동시에 처리하는 요청을 늘리면 한 번에 나오는 토큰 수도 늘지만 계산 시간이 길어질 수 있습니다. 아래는 요청 수에 따라 출력 간격이 늘어나는 측정값을 가정한 예입니다. (가정)
          </p><table><thead><tr><th>동시에 처리하는 요청</th><th>각 사용자의 출력 간격</th><th>서버 전체 출력</th></tr></thead><tbody><tr><td>1개</td><td>20ms</td><td>50토큰/s</td></tr><tr><td>8개</td><td>28ms</td><td>약 286토큰/s</td></tr><tr><td>32개</td><td>50ms</td><td>640토큰/s</td></tr></tbody></table><p>서버 합계는 늘었지만 각 사용자가 다음 토큰을 기다리는 시간도 길어졌습니다. 이는 주어진 측정값에서 생기는 latency–throughput trade-off입니다. 장비나 구현을 개선하면 둘 다 좋아질 수도 있습니다. 묶음 크기를 늘릴수록 항상 처리량이 커진다는 법칙은 아닙니다.</p><p>요청을 받는 속도가 처리 능력에 가까워지면 대기가 늘 수 있습니다. <Link to="/cs/ai/llm-serving-ops#paper-little-law">Little의 법칙</Link>은 안정된 계의 평균 개수와 도착률·체류 시간을 연결하며 90%에서 반드시 급격히 나빠진다는 임계값을 주지는 않습니다. 실제 입력 길이와 도착 분포에서 부하를 올리며 측정해야 합니다.</p></div><ExplainedFormula
          question="Batch 크기 B 에서 tokens/s 와 ITL 은 같은 양에서 어떻게 갈라지나요?"
          idea="한 decode step 시간 t(B) 는 batch 안 모든 요청이 공유합니다. 그 값을 요청 하나가 보면 ITL 이고, 서버 전체가 보면 B 개 token 을 t(B) 마다 낸 throughput 입니다."
          formula={String.raw`\mathrm{ITL}(B)=t(B),\qquad \mathrm{tokens/s}(B)=\frac{B}{t(B)},\qquad \mathrm{RPS}=\frac{N_{\text{done}}}{T}`}
          annotatedFormula={String.raw`\underbrace{\mathrm{ITL}(B)=t(B)}_{\text{요청 하나가 겪는 step 시간}},\qquad \underbrace{\mathrm{tokens/s}(B)=\frac{B}{t(B)}}_{\text{step 마다 B 개 token 을 내는 서버 처리량}},\qquad \underbrace{\mathrm{RPS}=\frac{N_{\text{done}}}{T}}_{\text{측정 시간 T 동안 완료한 요청 수}}`}
          operations={[
            { expression: String.raw`t(B)`, annotation: ["batch B 의 한 decode step 시간을 재어", "그 값을 모든 요청의 ITL 로 배정"] },
            { expression: String.raw`\frac{B}{t(B)}`, annotation: ["step 당 token 수 B 를 step 시간으로 나눠", "서버 단위 output token throughput 산출"] },
            { expression: String.raw`\frac{N_{\text{done}}}{T}`, annotation: ["완료 요청 수를 측정 시간으로 나눠", "요청 단위 throughput 산출"] },
          ]}
          terms={[
            { symbol: "B", name: "Decode batch 크기", description: "한 step 에 함께 token 을 내는 요청 수입니다." },
            { symbol: "t(B)", name: "Step 시간", description: "같은 조건에서 측정한 한 iteration의 시간입니다. B에 따른 증가 모양은 별도 측정합니다." },
            { symbol: String.raw`N_{\text{done}}`, name: "완료 요청 수", description: "측정 구간 T 안에 마지막 token 까지 받은 요청의 수입니다." },
          ]}
          assumptions={["각 실행 묶음에서 요청당 한 token을 만들고 전송 지연과 중단 없이 같은 간격으로 관측하는 단순 모형입니다. 실제 client 간격은 별도로 측정합니다.", "t(B) 가 sublinear 한 구간은 memory-bound 인 동안만이며, batch 가 compute-bound 로 넘어가면 tokens/s 증가가 멈춥니다."]}
          interpretation="같은 측정 t(B)에서 요청당 간격과 서버 합산 처리량을 계산합니다. 구현 개선으로 둘이 함께 좋아질 수도 있으므로 이 식 자체가 보편적인 상충 법칙은 아닙니다."
        /><ServingLatencyMetricsAndSloViz /></section>

<section id="distribution" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 같은 100개를 순서대로 놓으면 느린 쪽이 보입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            한 5분 구간의 요청 100개를 작은 시간부터 세운다고 합시다. 앞 사례의 TTFT 1초도 이 표본에 들어 있습니다. 아래 도식은 명시된 100개 가정 표본을 사용하며 50번째
            0.7초, 95번째 1.45초, 99번째 2.4초, 최대 4초이고 평균은 0.9초입니다. (가정)
          </p><p>
            정렬 순위로 누적 비율의 위치를 읽는 값을 percentile이라고 합니다. 여기서는 p%에 해당하는 순위를 올림해 그 값을 읽는 nearest-rank를 씁니다. 그 정의에서
            P95는 1.45초이며 적어도 95%가 이 값 이하입니다. 동점이 있으면 정확히 95%라고 할 수는 없습니다.
          </p><p>
            NumPy 기본 선형 보간은 0부터 세는 위치 0.95×99=94.05를 씁니다. 95번째 1.45초와 96번째 1.7초 사이 5%이므로 1.4625초입니다. 두 값 모두 아래
            1.5초 기준을 통과하지만 정의를 섞어 보고하면 비교가 바뀝니다. (가정)
          </p><p>
            차이가 언제나 작은 것도 아닙니다. 20개 중 19개가 0초이고 마지막이 100초라면 nearest-rank P95는 0초지만 선형 보간은 5초입니다. 1초 이하가 95%라는
            조건과 nearest-rank 조건은 같은 표본에서 정확히 동치입니다. 선형 보간은 이 동치를 보장하지 않습니다. (가정)
          </p><p>느린 끝부분을 tail latency라고 부릅니다. 긴 입력, 대기, 중단 뒤 재계산이 원인 후보이지만 꼬리만 보고 원인을 단정할 수 없습니다. 입력 길이와 대기 시간, 중단 기록을 같은 요청 식별자로 붙여 확인합니다.</p></div><ExplainedFormula
          question="정렬한 latency 표본에서 P95 는 정확히 몇 번째 값인가요?"
          idea="표본 N 개를 오름차순으로 정렬한 뒤, 전체의 p % 가 그 아래에 오도록 순위를 올림해서 고릅니다."
          formula={String.raw`P_p=x_{(\lceil p\cdot N/100\rceil)},\qquad x_{(1)}\le x_{(2)}\le\cdots\le x_{(N)}`}
          annotatedFormula={String.raw`P_p=\underbrace{x_{(\lceil p\cdot N/100\rceil)}}_{\text{정렬 표본에서 올림한 순위의 값}},\qquad \underbrace{x_{(1)}\le\cdots\le x_{(N)}}_{\text{오름차순 order statistics}}`}
          operations={[
            { expression: String.raw`\lceil p\cdot N/100\rceil`, annotation: ["p % 에 해당하는 순위를 올림해", "N=100, p=95 이면 95 번째 순위 결정"] },
            { expression: String.raw`x_{(\lceil p\cdot N/100\rceil)}`, annotation: ["그 순위의 정렬 표본을 읽어", "P95 latency 값 산출"] },
          ]}
          terms={[
            { symbol: "N", name: "표본 수", description: "측정 window 안에서 완료된 요청(또는 ITL 간격)의 수입니다." },
            { symbol: String.raw`x_{(k)}`, name: "k 번째 order statistic", description: "정렬한 표본의 k 번째 값입니다." },
            { symbol: "p", name: "Percentile", description: "p는 0 초과 100 이하의 원하는 누적 비율입니다. Nearest-rank P50은 짝수 표본의 두 중앙값 평균과 다를 수 있습니다." },
          ]}
          assumptions={["N은 0보다 크고 p는 0 초과 100 이하인 nearest-rank 정의입니다. NumPy 기본 선형 보간은 다른 정의이며 그 차이의 크기는 인접 표본 사이 간격에 달려 있습니다.", "P99 는 표본이 100 개면 값 하나에 좌우됩니다. 꼬리 percentile 일수록 window 안 표본 수가 충분해야 안정합니다."]}
          interpretation="P95 는 가장 느린 5 % 의 경계이지 그 5 % 가 얼마나 느린지는 말하지 않습니다. 최댓값이나 P99.9 까지 함께 봐야 꼬리의 길이가 드러납니다."
        /><LatencyPercentileHistogramViz /></section>

<section id="source-client-events" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 실제 수신 코드는 토큰 대신 이벤트를 관측합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            다섯 토큰을 1개·1개·3개로 묶어 1·1.040·1.327초에 받았다고 합시다. (가정)
          </p><p>vLLM v0.27.1의 아래 chat 수신 경로는 choices 이벤트 사이 시각 차이를 목록에 넣습니다. 이 입력에서는 40·287ms의 두 값입니다. 원래 네 토큰 간격은 관측할 수 없습니다.
          </p><p>
            원문의 st는 client 전송 전의 시각이고 timestamp는 메시지를 읽은 시각입니다. 이 버전은 choices가 있으면 빈 content인 첫 이벤트도 TTFT를 정할
            수 있습니다. 또 usage 메시지를 포함한 timestamp가 most_recent_timestamp를 갱신하므로 마지막 내용 토큰과 latency의 끝이 달라질 수
            있습니다.
          </p><p>
            NVIDIA의 GenAI-Perf 문서는 뒤 응답의 토큰 수로 나눈 값을 사용합니다. 위 묶음에서는 40ms와 287/3≈95.667ms입니다. 이는 묶음 안의 실제 생성
            간격을 복원한 것이 아닙니다. 두 값을 단순 평균하면 약 67.833ms이며 토큰 수로 가중한 81.75ms와 다릅니다. (가정)
          </p></div><CodeViewButton label="고정 원문: 수신 이벤트와 시각 갱신" onClick={() => sidebar.open("client-events", codeRefs["client-events"])} /><div id="paper-genai-perf" className="mt-8 scroll-mt-20"><CitationBlock source="NVIDIA GenAI-Perf · Metrics" citeKey={1} href="https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/perf_analyzer/genai-perf/README.html#metrics"><q>divided by the number of generated tokens of the latter response</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            원문의 나눗셈에서 뒤 응답의 토큰 수가 3이므로 287ms를 3으로 나눕니다. 2026-10-04 확인한 이 문서에는 GenAI-Perf의 신규 개발 중단과 AIPerf 안내가
            함께 있습니다. 여기서는 기존 결과표를 읽는 정의로 인용하며 새 도구도 해당 버전의 집계 코드를 확인해야 합니다.
          </p></div></div></section>

<section id="paper-vllm-bench" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 같은 기록을 실제 평균과 처리량 코드에 넣습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            원문의 output_len=5, latency=1.327, ttft=1을 넣으면 TPOT=(1.327−1)/(5−1)=0.08175초입니다. 코드가
            output_len&gt;1인 요청만 TPOT 표본에 추가한다는 조건도 확인합니다. 한 토큰 응답에는 토큰 사이 간격이 없습니다. (가정)
          </p><p>
            앞의 묶음 수신에서도 토큰 수가 5로 확인되면 같은 TPOT를 구하지만 ITL 목록은 40·287ms로 남습니다. 따라서 코드의 두 목록을 같은 단위의 관측이라고 합치지
            않습니다.
          </p><p>
            마지막 토큰 뒤 1.350초에 usage 이벤트가 왔다면 이 chat 경로의 latency는 1.350초가 될 수 있습니다. 계산된 TPOT는 87.5ms이며 토큰 기준
            81.75ms와 다릅니다. 그래서 7절의 토큰 시각 항등식과 도구가 선택한 종료 사건을 구별해야 합니다. (가정)
          </p><p>
            처리량 코드에는 completed=120, dur_s=60, total_output=24000을 넣어 2요청/s와 400토큰/s를 확인합니다. 조건을 만족한 요청만 센
            goodput은 별도 값입니다. 120개 중 90개만 설정된 지연 조건을 모두 만족했다면 request_goodput=90/60=1.5요청/s입니다. 단위도 토큰/s와
            다릅니다. (가정)
          </p><p>
            고정 코드의 goodput은 설정된 TTFT·TPOT·E2E 한도를 요청별로 함께 검사합니다. 5분 구간의 P95 약속을 자동으로 판정하는 기능으로 읽지 않습니다.
          </p></div><CodeViewButton label="고정 원문: 토큰 수와 TPOT·ITL 목록" onClick={() => sidebar.open("latency-metrics", codeRefs["latency-metrics"])} /><CodeViewButton label="고정 원문: 요청별 조건과 처리량" onClick={() => sidebar.open("throughput-goodput", codeRefs["throughput-goodput"])} /><CodeViewButton label="고정 원문: NumPy percentile 호출" onClick={() => sidebar.open("percentile-calculation", codeRefs["percentile-calculation"])} /><div id="source-bench-formula" className="mt-8 scroll-mt-20"><CitationBlock source="vLLM v0.27.1 · serve.py L608–611" citeKey={1} href="https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/benchmarks/serve.py#L608-L611"><q>tpot = latency_minus_ttft / (output_len - 1)</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            원문의 분자는 같은 backend가 기록한 latency−ttft이고 분모는 확인된 output_len−1입니다. 입력 기록의 의미를 바꾸지 않은 채 5토큰 예제를 대입해야
            합니다. 전체 고정 파일과 버전·해시는 원문 패널의 저장된 source와 함께 보존했습니다.
          </p></div></div></section>

<section id="slo" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 하루 288구간에서 세 번째 실패는 허용범위를 넘습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            측정값을 SLI(Service-Level Indicator), 그 값에 대한 목표를 SLO(Service-Level Objective)라고 합니다. 이 사례의 약속은 5분마다
            nearest-rank P95 TTFT≤1.5초이고 하루의 정해진 288구간 중 99% 이상이 통과하는 것입니다. (가정)
          </p><p>
            9절의 구간은 P95=1.45초이므로 통과합니다. 하루에 실패 2개면 2/288≈0.6944%로 허용 1% 이내입니다. 실패 3개면 3/288≈1.0417%로 초과합니다. 실패
            5개는 약 1.7361%입니다. 정수로 허용할 수 있는 실패는 floor(288×0.01)=2개입니다. (가정)
          </p><p>
            이 허용량을 error budget이라고 부릅니다. 실패율을 허용 실패율로 나눈 소진 속도도 추적할 수 있습니다. 예를 들어 같은 평가 범위의 2% 실패는 1% 허용량의
            2배입니다. 구간 수 기준과 요청 수 기준을 섞으면 이 계산이 달라집니다. (가정)
          </p><p>
            한 구간에 요청 1개가 있고 다른 구간에 10000개가 있어도 위 약속에서는 구간마다 한 표입니다. 전체 요청 중 95%가 빠르다는 약속과 하루 구간의 99%가 통과한다는
            약속은 서로 다른 집계입니다.
          </p></div><div id="paper-sre-slo" className="mt-8 scroll-mt-20"><CitationBlock source="Google SRE Ch.4 · Defining Objectives" citeKey={1} href="https://sre.google/sre-book/service-level-objectives/"><q>SLOs should specify how they’re measured and the conditions under which they’re valid.</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            이 사례는 client 시계로 측정한 값의 nearest-rank P95를 1.5초와 비교합니다. 5분씩 나눈 하루 288구간 중 99%가 이 비교를 통과해야 합니다. 원문이 요구하는 측정 방식과 유효 조건을 구체화한 것입니다.
          </p><p>원문은 이 LLM 수치를 권장한 것이 아니며 서비스의 약속을 정한 가정입니다. 100% 목표가 모든 배포를 논리적으로 불가능하게 만든다는 뜻도 아닙니다.
          </p></div></div></section>

<section id="slo-procedure" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">13. 관측이 빠진 구간을 통과한 구간으로 세지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            구간은 예를 들어 시작 포함·끝 제외인 5분 간격으로 미리 나눕니다. 어느 요청을 어느 구간에 넣을지와 최소 표본 수를 정합니다. 완료 시각 기준을 쓰면 아직 끝나지 않은 긴
            요청이 다음 구간으로 밀리므로 진행 중 요청과 시간 초과도 별도로 감시해야 합니다.
          </p><p>
            하루 288구간을 보기로 정했는데 10구간의 측정이 빠졌다면 나머지 278개가 모두 통과해도 하루 99% 달성을 바로 선언할 수 없습니다. 아래 절차는 관측 누락이 있으면 달성
            미확인으로 남기는 이 글의 예시 정책입니다. 누락을 실패로 취급하는 다른 정책도 가능하지만 측정 뒤 유리하게 바꾸지 않습니다. (가정)
          </p><p>서비스가 원래 쉬는 시간을 빼려면 평가 대상 구간을 사전에 정하고 바뀐 분모를 계약에 적습니다. 표본 부족 구간을 조용히 분자에서만 빼거나 통과로 더하면 실제 약속과 다른 비율이 됩니다.</p></div><AlgorithmBlock title="정의가 고정된 구간 SLO 판정 (의사코드)" input={["사전에 정한 평가 구간 집합 E와 표본 포함 규칙", "p=95, θ=1.5초, β=0.01, 사전 최소 표본 수", "관측 누락은 달성 미확인으로 처리하는 예시 정책"]} steps={[{"code": "for w in E:", "note": "정한 대상 구간만 순회합니다. 요청 완료·시간 초과·관측 상태를 함께 보존합니다."}, {"code": "  if missing(w) or count(w) < N_min: unknown.add(w); continue", "note": "이 예에서는 표본 부족이나 누락을 통과로 바꾸지 않습니다."}, {"code": "  x ← sort(samples(w)); k ← ceil(p*len(x)/100)", "note": "정렬 위치는 1부터 세고 프로그램의 0기반 배열에서는k−1을 사용합니다."}, {"code": "  if x[k-1] > θ: failed.add(w)", "note": "한 구간의 지연 기준을 판정합니다."}, {"code": "budget ← floor(β * len(E))", "note": "사례에서는floor(0.01×288)=2개입니다."}, {"code": "if count(failed) > budget: status ← violated", "note": "이미 확인된 실패만으로 넘었다면 누락 여부와 관계없이 위반입니다."}, {"code": "else if count(unknown) > 0: status ← unconfirmed", "note": "이 예시 정책에서는 누락이 남아 있으면 달성을 확정하지 않습니다."}, {"code": "else: status ← met", "note": "모든 대상 구간의 관측이 완전하고 실패가 한도 안일 때만 통과입니다."}]} output="판정·실패 수·관측 누락 수·고정 분모·남은 허용량" /></section>

<section id="boundary" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">14. 지표 하나가 원인이나 용량을 자동으로 결정하지는 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            간격의 P99≤80ms를 정해도 요청별로 모든 지연 조건을 만족한다는 뜻은 아닙니다. 출력이 긴 요청은 간격 분포에 더 많은 표본을 주고 여러 조건의 동시 만족 여부도
            남습니다. 같은 입력·출력 길이와 도착 분포에서 조건을 통과한 요청 수를 직접 셉니다.
          </p><p>메모리에 들어가는 최대 묶음과 지연 약속을 지키는 최대 부하는 다를 수 있습니다. 어느 쪽이 먼저 막히는지는측정해야 합니다. <Link to="/cs/ai/llm-serving-capacity#capacity-admission">용량과 요청 수용</Link>을 정할 때 메모리·지연·실패를 함께 확인합니다.</p><p>한 평균이 개선됐다고 꼬리도 개선됐다고 결론내리지 않고 반대도 단정하지 않습니다. 종료 사건, 실패 포함 규칙, percentile 방식과 수집 누락까지 같은 조건으로 비교해야 수치의 변화를 해석할 수 있습니다.</p></div><ContentBoundary article="serving-latency-metrics-and-slo" /></section>

<section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">15. 표본과 분모를 바꿨을 때 결과를 예상해 보세요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            5토큰이 세 묶음으로 도착했습니다. 측정 목록의 간격 수가 반드시 4개일까요? (답: 10절)
          </p><p>
            하루 288구간의 99% 통과가 약속인데 실패가 3개입니다. 허용범위 안일까요? (답: 12절)
          </p><p>
            측정하지 못한 10구간을 지운 뒤 나머지가 모두 통과했습니다. 원래 약속의 달성을 선언해도 될까요? (답: 13절)
          </p></div></section>
</div><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={{vllm:latencySourceTree}} projectMetas={{vllm:{id:"vllm",label:"vLLM v0.27.1 · Python",badgeClass:"bg-blue-500/10 border-blue-500 text-blue-700"}}} /></>;
}
