import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import BatchingGenerationsViz from "./viz/BatchingGenerationsViz";

const OVERHEAD_TERMS = [
  { symbol: "t_{sched}", name: "Scheduling CPU 시간", description: "한 step 의 running 순회·admission·SchedulerOutput 직렬화에 드는 CPU 시간입니다. Running 수에 비례해 자랍니다." },
  { symbol: "t_{gpu}", name: "GPU step 시간", description: "그 step 의 forward 가 GPU 에서 도는 시간입니다. Batch 의 token 수와 KV 읽기량이 정합니다." },
  { symbol: "T_{sync}", name: "동기 step 주기", description: "Scheduling 이 끝나야 forward 를 시작하는 구조에서 step 하나가 차지하는 시간입니다." },
  { symbol: "T_{async}", name: "비동기 step 주기", description: "다음 step 의 scheduling 을 이번 forward 와 겹치는 구조에서의 주기입니다." },
  { symbol: "U", name: "GPU 점유율", description: "Step 주기 가운데 GPU 가 실제로 일하는 비율입니다." },
] as const;

export default function QueueBatching({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="queue-batching" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Queue 정책은 batch 를 언제 다시 고르느냐와 누구를 먼저 보느냐로 나뉩니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Scheduler 가 답해야 할 질문은 둘입니다. Batch 의 구성을 언제 다시 고르느냐가 batching 의 세대를 가르고 waiting queue 에서 누구를 먼저 보느냐가
          queue discipline 입니다. 이 절은 그 두 질문과 거기서 생기는 fairness, head-of-line blocking, 그리고 scheduler 자체가 쓰는 시간을
          다룹니다.
        </p>
        <p className="leading-8">
          한 step 안에서 token budget 이 running 과 waiting 에 어떻게 나뉘는지는{" "}
          <Link to="/ai/continuous-batching-step-anatomy#token-budget">Scheduling step 해부</Link>
          가, KV 여유를 보고 받을지 말지와 누구를 내보낼지는{" "}
          <Link to="/ai/serving-memory-admission-and-preemption#watermark-admission">KV admission 과 preemption</Link>
          이 정본입니다.
        </p>

        <h3 id="batching-generations" className="scroll-mt-20">
          Static·dynamic batching 은 batch 를 고정해 idle slot 을 남깁니다
        </h3>
        <p className="leading-8">
          Static batching 은 정해진 수의 요청을 함께 시작해 가장 긴 요청이 끝날 때까지 batch 를 바꾸지 않는 방식입니다. Output 길이가 40, 120, 200,
          400 token 인 요청 넷을 묶으면 batch 는 400 iteration 을 돌고 slot 넷이 쓸 수 있던 1,600 slot-iteration 가운데 760 만 일을
          합니다. 나머지 52.5% 는 빈 slot 입니다.
        </p>
        <p className="leading-8">
          Orca 논문이 짚은 문제가 정확히 이것입니다. 먼저 끝난 요청의 결과는 batch 가 끝날 때까지 client 에게 돌아가지 못하고 늦게 도착한 요청은 batch 가 끝날 때까지
          들어오지 못합니다. 길이 편차가 클수록 두 대기가 함께 커집니다.
        </p>
        <p className="leading-8">
          Dynamic batching 에서는 server 쪽 batcher 가 짧은 window(예: 10 ms) 동안 도착한 요청을 모아 batch 를 만듭니다. 도착 시각이 흩어진
          요청을 한 batch 에 넣을 수 있어 첫 admission 까지의 대기는 줄지만 만들어진 batch 는 여전히 끝까지 고정입니다. 위의 idle 52.5% 는 그대로이고
          window 만큼의 지연이 더해집니다.
        </p>
        <p className="leading-8">
          Iteration-level scheduling 은 batch 를 iteration 이 끝날 때마다 다시 고릅니다.
          끝난 요청은 그 자리에서 빠지고 새 요청은 다음 iteration 경계에서 들어오므로 빈
          slot 이 곧바로 채워집니다.
        </p>
        <p className="leading-8">
          이 원리는 <Link to="/ai/vllm-serving#engine-loop">continuous batching</Link> 으로
          vLLM 에 들어왔습니다. Orca 는 GPT-3 175B 에서 같은 지연 조건으로
          FasterTransformer 대비 36.9× 처리량을 보고했고, 이는 저자 자기보고 수치입니다.
        </p>
      </div>

      <BatchingGenerationsViz />

      <div className="not-prose my-8">
        <CitationBlock
          source="Yu et al. · Orca: A Distributed Serving System for Transformer-Based Generative Models (OSDI 2022)"
          citeKey={1}
          href="https://www.usenix.org/conference/osdi22/presentation/yu"
        >
          Request 단위 batch 고정이 만드는 두 대기(먼저 끝난 요청의 반환 지연, 늦게 온 요청의
          admission 지연)를 문제로 삼고 iteration-level scheduling 과 selective batching 을
          제안했습니다. 36.9× 는 GPT-3 175B 에서 같은 지연 조건으로 FasterTransformer 와 비교한
          저자 자기보고입니다.
        </CitationBlock>
      </div>

      <TermBreakdown
        title="Batching 세 세대의 차이"
        description="같은 요청 넷을 세 방식으로 돌렸을 때 무엇이 달라지는지 정리했습니다."
        items={[
          { term: "Static batching", description: "정해진 크기의 batch 를 함께 시작하고 가장 긴 요청이 끝날 때까지 고정합니다.", example: "40·120·200·400 token 요청 넷이 400 iteration 을 함께 돌아 idle 52.5% 가 됩니다.", boundary: "Offline 평가처럼 길이가 비슷하고 도착이 한꺼번에인 workload 에서만 손실이 작습니다." },
          { term: "Dynamic batching", description: "Window 동안 도착을 모아 batch 를 만들되 만들어진 batch 는 고정합니다.", example: "10 ms window 로 흩어진 도착을 한 batch 에 넣지만 idle 52.5% 는 그대로입니다.", boundary: "Window 는 도착 편차를 줄일 뿐 output 길이 편차는 건드리지 못합니다." },
          { term: "Iteration-level scheduling", description: "Iteration 경계마다 batch 를 다시 골라 끝난 요청을 빼고 새 요청을 넣습니다.", example: "A 가 끝난 자리에 다음 iteration 부터 E 가 들어와 slot 이 비지 않습니다.", boundary: "경계마다 scheduling 을 다시 하므로 아래 scheduler overhead 가 step 마다 붙습니다." },
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="request-queue" className="scroll-mt-20">
          Request queue 는 도착 순서를 담는 자리가 아니라 정책이 사는 자리입니다
        </h3>
        <p className="leading-8">
          Request queue 는 아직 자리를 받지 못한 요청이 기다리는 자료구조이고 그 안의 순서를 정하는 규칙이 queue discipline 입니다. vLLM V1 은 FCFS
          정책이면 도착 순서의 deque 를, priority 정책이면 (priority, arrival) 순서의 heap 을 씁니다. Preemption 으로 돌아온 요청도 같은 규칙으로
          다시 꽂힙니다.
        </p>
        <p className="leading-8">
          Queue 가 정하는 것은 검토 순서뿐입니다. 맨 앞 요청이 실제로 running 으로 올라가는지는 token·sequence·KV 세 예산이 정하고 그 판정은 admission
          글이 다룹니다. Queue 에서 읽어야 할 관측값은 길이보다 queue age, 곧 맨 앞 요청이 기다린 시간입니다.
        </p>
      </div>
      <CodeViewButton onClick={() => onCodeRef("priority-queue", codeRefs["priority-queue"])} />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="scheduler-fairness" className="scroll-mt-20">
          Fairness 는 요청 수가 아니라 처리한 token 으로 재야 합니다
        </h3>
        <p className="leading-8">
          Scheduler fairness 는 여러 client 가 같은 engine 을 쓸 때 각 client 가 받는
          service 의 몫이 어떻게 갈리는지를 말합니다. 요청 수로 세면 공정해 보여도
          token 으로 세면 크게 기웁니다. Client A 가 4,000 token 요청 100 개, client B 가
          200 token 요청 100 개를 보내면 FCFS 는 둘을 번갈아 받지만 GPU 시간의 95% 는 A
          에게 갑니다.
        </p>
        <p className="leading-8">
          Rate limit 은 A 를 막을 수는 있지만 B 가 조용할 때도 A 를 막아 GPU 를 놀립니다. Virtual Token Counter(VTC) 는 client 마다 처리한
          input·output token 을 세어 가장 적게 받은 client 의 요청부터 admission 하는 continuous batching 용 fair scheduler 이며
          두 backlogged client 의 service 차이가 2× 안에 묶인다는 상한을 증명했습니다.
        </p>
        <p className="leading-8">
          vLLM V1 에는 client 단위 fairness 정책이 내장돼 있지 않습니다. Priority 와 arrival time 으로 순서를 정할 뿐이라 tenant 별 공정성이
          필요하면 gateway 에서 priority 를 매기거나 queue age 상한을 SLO 로 두어야 합니다. 그 한계가 아래 starvation 절의 출발점입니다.
        </p>
      </div>

      <ProgressiveDetail
        title="VTC 가 work-conserving 이면서 공정할 수 있는 이유는 무엇인가요?"
        preview="Counter 가 가장 작은 client 를 먼저 보되 그 client 의 요청이 없으면 다음 client 를 보므로 GPU 가 비지 않고, 새로 backlogged 가 된 client 의 counter 를 현재 최솟값으로 올려 과거의 조용함이 무한한 우선권이 되지 않게 합니다."
      >
        <p className="leading-8">
          Sheng 외의 논문은 요청 길이를 미리 알 수 없고 batch 가 GPU 에서 병렬로 돈다는 LLM serving 의 두 조건 때문에 network fair queueing 을
          그대로 쓸 수 없다고 보고, token 단위 cost 를 누적하는 counter 로 대신했습니다. 상한 2× 는 token cost 의 정의와 batch 안에서 일어나는 병렬성을
          전제로 한 이론값입니다.
        </p>
        <p className="leading-8">
          이 글은 VTC 의 문제 정의와 상한만 가져옵니다. 실험 수치와 구현은 논문 조건에 묶이고 vLLM 에 이 정책이 그대로 들어 있다는 뜻은 아닙니다.
        </p>
      </ProgressiveDetail>

      <div className="not-prose my-8">
        <CitationBlock
          source="Sheng et al. · Fairness in Serving Large Language Models (OSDI 2024)"
          citeKey={2}
          href="https://arxiv.org/abs/2401.00588"
        >
          요청 길이를 미리 알 수 없고 batch 가 병렬로 도는 LLM serving 에서 client 별 token
          counter 로 순서를 정하는 Virtual Token Counter 를 제안하고, backlogged client 사이
          service 차이의 2× 상한을 증명했습니다. 실험 비교는 저자 자기보고이며 vLLM 에 내장된
          정책은 아닙니다.
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="hol-blocking" className="scroll-mt-20">
          Head-of-line blocking 은 앞의 큰 요청이 뒤의 작은 요청을 막는 현상입니다
        </h3>
        <p className="leading-8">
          Head-of-line blocking 은 queue 맨 앞 요청이 진행하지 못할 때 뒤의 요청이 조건을
          만족하는데도 함께 멈추는 현상입니다. LLM scheduler 에서는 두 자리에서 생깁니다.
          하나는 waiting queue 의 admission, 다른 하나는 batch 안의 step 시간입니다.
        </p>
        <p className="leading-8">
          Queue 쪽의 예입니다. 맨 앞 요청이 KV block 500 개를 필요로 하는데 free block 이 200 개뿐이면 V1 은 waiting 순회를 그 자리에서 멈춥니다.
          바로 뒤에 20 block 이면 되는 요청이 있어도 이번 step 에는 들어오지 못합니다. FCFS 를 지키는 대가이며 뒤를 건너뛰면 순서 보장이 깨지고 앞 요청이 굶을 수
          있습니다.
        </p>
        <p className="leading-8">
          Batch 쪽의 예입니다. Decode 60 개가 도는 step 이 25 ms 인데 8,000-token prompt 의 prefill 을 통째로 한 step 에 넣으면 그
          step 이 400 ms 가 된다고 합시다. 60 개 요청의 그 token 하나는 25 ms 대신 425 ms 뒤에 나오고 TPOT 가 한 번 17 배로 튑니다.
        </p>
        <p className="leading-8">
          Chunked prefill 로 512 token 씩 16 조각으로 나누면 mixed step 이 약 50 ms 씩 16
          번입니다. Decode 가 밀리는 총량은 비슷하지만 token 하나가 425 ms 를 기다리는 일은
          사라지고 최악이 50 ms 로 내려옵니다. HOL 을 없앤 것이 아니라 잘게 나눠 tail 에서
          평균으로 옮긴 것입니다. 이 맞바꿈의 식은 다음 절에서 이어집니다.
        </p>
        <p className="leading-8">
          FastServe 가 문제 삼은 HOL 은 output token 단위였습니다. 긴 generation 이 짧은
          job 을 막으니 output token 경계에서 preempt 하자는 제안이었고, 그 설계 공간은{" "}
          <Link to="/ai/vllm-scheduler#paper-fastserve">아래 preemption 절</Link> 에서
          다룹니다.
        </p>

        <h3 id="scheduler-overhead" className="scroll-mt-20">
          Scheduler overhead 는 GPU step 뒤에 숨을 때만 공짜입니다
        </h3>
        <p className="leading-8">
          Iteration 마다 batch 를 다시 고르는 대가는 step 마다 scheduler 가 CPU 에서 쓰는
          시간입니다. Running 을 순회해 need 를 계산하고 block 을 배정하며, waiting 을
          검토하고, 결과를 <code>SchedulerOutput</code> 으로 직렬화해 worker 에 보냅니다.
          이 시간은 running 수에 비례해 자라고 prefix cache 조회가 붙으면 더 늘어납니다.
        </p>
        <p className="leading-8">
          Scheduling 5 ms 뒤에 GPU step 20 ms 가 오는 동기 구조라면 step 주기는 25 ms 이고
          GPU 는 20% 를 놉니다. Decode TPOT 도 20 ms 가 아니라 25 ms 입니다. 다음 step 의
          scheduling 을 이번 forward 와 겹치면 주기는 둘 중 큰 쪽인 20 ms 로 줄고 5 ms 는
          사라진 것처럼 보입니다.
        </p>
        <p className="leading-8">
          vLLM V1 은 이를 위해 scheduler 를 API server 와 분리된 engine core process 로
          옮기고 <code>--async-scheduling</code> 으로 겹치기를 제공합니다. 문서는 이 옵션이
          GPU 점유의 빈틈을 없애 latency 와 throughput 을 좋게 한다고 적고, engine core 가
          busy loop 라 CPU 를 빼앗기면 크게 느려진다고 경고합니다.
        </p>
        <p className="leading-8">
          숨기는 데는 한계가 있습니다. Batch 가 작아 GPU step 이 8 ms 로 줄면 같은 5 ms 는 동기 구조에서 38% 의 overhead 이고 겹쳐도 CPU 가 GPU
          보다 느려지는 순간부터는 CPU 가 주기를 정합니다. 겹치기는 출력을 보기 전에 다음 step 을 짜야 하므로 stop 판정처럼 결과에 따라 달라지는 결정이 한 step 늦게
          반영됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="Scheduling 시간이 step 주기와 GPU 점유율에 얼마나 남나요?"
        idea="동기 구조에서는 scheduling 과 forward 가 직렬이라 두 시간이 더해지고, 비동기 구조에서는 둘이 겹쳐 큰 쪽만 남습니다. GPU 점유율은 주기 가운데 forward 가 차지하는 비율입니다."
        formula={String.raw`\begin{aligned}
T_{sync} &= t_{sched} + t_{gpu}, \qquad T_{async} = \max\!\left(t_{sched},\; t_{gpu}\right) \\
U &= \frac{t_{gpu}}{T}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
T_{sync} &= \underbrace{t_{sched} + t_{gpu}}_{\text{직렬이라 더해짐}}, \qquad T_{async} = \underbrace{\max\!\left(t_{sched},\; t_{gpu}\right)}_{\text{겹쳐서 큰 쪽만 남음}} \\
U &= \underbrace{\frac{t_{gpu}}{T}}_{\text{주기 중 GPU 가 일하는 비율}}
\end{aligned}`}
        operations={[
          { expression: String.raw`t_{sched} + t_{gpu}`, annotation: ["Scheduling 이 끝나야 forward 가 시작하므로", "두 시간을 그대로 더합니다"] },
          { expression: String.raw`\max\!\left(t_{sched},\; t_{gpu}\right)`, annotation: ["다음 step 의 scheduling 을 이번 forward 와 겹치면", "둘 중 긴 쪽이 주기가 됩니다"] },
          { expression: String.raw`\frac{t_{gpu}}{T}`, annotation: ["Forward 시간을 주기로 나눠", "GPU 가 노는 비율을 읽습니다"] },
        ]}
        terms={OVERHEAD_TERMS}
        assumptions={[
          "Scheduling 과 forward 가 서로 다른 자원(CPU 와 GPU)을 쓰므로 겹칠 수 있습니다.",
          "Worker 로의 전송과 output 수신 시간은 t_sched 에 포함했고 sampling 은 t_gpu 에 포함했습니다.",
          "비동기 구조는 이번 step 의 출력을 보기 전에 다음 step 을 짜므로 decode 요청마다 1 token 이 나온다고 가정합니다.",
        ]}
        interpretation="t_sched=5 ms, t_gpu=20 ms 이면 동기 주기 25 ms 에 U=80%, 비동기 주기 20 ms 에 U=100% 입니다. t_gpu 가 8 ms 로 줄면 동기 U 는 62% 로 떨어지고, t_sched 가 t_gpu 를 넘는 순간 비동기 주기도 CPU 시간이 정하므로 running 수를 늘려 t_sched 를 키우는 설정은 GPU 를 키우는 설정이 아닙니다."
        title="동기·비동기 scheduling 의 step 주기"
      />
    </section>
  );
}
