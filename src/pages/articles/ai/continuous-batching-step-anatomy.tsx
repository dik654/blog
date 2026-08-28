import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ContinuousBatchingStepAnatomyViz from "./continuous-batching-step-anatomy/viz/ContinuousBatchingStepAnatomyViz";

/**
 * Scheduling step 해부: running 먼저, 남은 token budget 은 prefill chunk 로
 *
 * 한 번의 scheduling step 안에서 무엇이 어떤 순서로 결정되는지를 소유한다.
 * Queue 정책·fairness·preemption 비용은 /ai/vllm-scheduler, prefill·decode 의
 * compute·memory 특성은 /ai/prefill-decode-phase-dynamics 가 소유한다.
 */
export default function ContinuousBatchingStepAnatomyArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="step-unit" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한 step 은 이번 forward 에 넣을 request 와 token 수를 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Continuous batching 의 scheduler 는 request 를 통째로 줄 세우지 않습니다.
            매 forward 직전에 한 번 도는 scheduling step 이 이번 forward 에 어떤 request 를
            몇 token 씩 넣을지 결정하고, 그 답이 <code>SchedulerOutput</code> 하나로 worker 에
            넘어갑니다. 이 글은 그 한 step 의 안쪽을 결정이 내려지는 순서대로 엽니다.
          </p>
          <p>
            Step 의 입력은 세 가지입니다. 이미 KV block 을 쥐고 진행 중인 request 의 집합인
            running set, 아직 자리를 받지 못한 request 가 도착 순서로 기다리는 waiting queue,
            그리고 이번 step 이 쓸 수 있는 token budget 과 비어 있는 KV block 수입니다.
            vLLM V1 은 앞의 둘을 <code>self.running</code> 과 <code>self.waiting</code> 으로 들고 있습니다.
          </p>
          <p>
            Scheduler 가 세는 단위는 sequence 입니다. V0 의 SequenceGroup 은 한 prompt 를
            공유하는 여러 sequence(n&gt;1 sampling, beam search)를 한 request 로 묶어 함께
            scheduling 했고, <code>max_num_seqs</code> 는 group 수가 아니라 sequence 수를 셌습니다.
          </p>
          <p>
            V1 은 n&gt;1 요청을 engine 앞단에서 child request 로 나눠 request 하나가
            sequence 하나가 되게 했습니다.
          </p>
          <p>
            Step 의 출력은 request 마다 이번에 계산할 token 수를 적은
            <code>num_scheduled_tokens</code> 와 새로 배정한 KV block 목록입니다. 그 안에
            prefill·decode 표시는 없습니다. 각 request 는 <code>num_computed_tokens</code> 만
            갖고, 이번에 몇 token 을 더 계산하느냐가 곧 그 request 의 phase 를 말해 줍니다.
            이 성질이 다음 절의 token budget 배분을 가능하게 합니다.
          </p>
          <p>
            Prefill 은 prompt 여러 token 을 한 번에 읽는 compute-bound 작업이고 decode 는
            token 하나를 위해 KV cache 전체를 읽는 memory-bound 작업입니다. 두 phase 의
            compute·memory 특성은 <Link to="/ai/prefill-decode-phase-dynamics">Prefill·decode phase dynamics</Link> 가,
            queue 정책과 fairness·preemption 은 <Link to="/ai/vllm-scheduler">vLLM Scheduler</Link> 가 다룹니다.
          </p>
        </div>
        <ContinuousBatchingStepAnatomyViz />
        <ContentBoundary article="continuous-batching-step-anatomy" />
      </section>

      <section id="token-budget" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Token budget 은 running 이 먼저 쓰고 남은 만큼만 waiting 이 받습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한 step 의 token budget 은 <code>max_num_batched_tokens</code> 하나입니다.
            Running set 을 먼저 순회하며 각 request 가 필요한 token 을 budget 에서 빼고,
            남은 budget 이 있을 때만 waiting queue 에서 새 request 를 받습니다. 공식 문서가
            decode 를 우선한다고 적은 것은 이 순서의 결과이지 별도의 규칙이 아닙니다.
          </p>
          <p>
            이 배분이 성립하는 이유는 scheduler 가 request 가 아니라 token 을 배정하기
            때문입니다. Running 의 decode request 는 need 가 1 이고, prefill 이 덜 끝난
            request 는 need 가 남은 prompt 길이입니다. 둘 다 <code>min(need, 남은 budget)</code>
            만큼 받으니 같은 식으로 처리되고, prefill 은 budget 에 맞춰 저절로 잘립니다.
            이것이 token-level scheduling 입니다.
          </p>
          <p>
            Token budget 옆에 sequence budget 이 하나 더 있습니다. <code>max_num_seqs</code> 는
            running set 크기의 상한이며, token 이 남아 있어도 running 이 이 값에 닿으면
            waiting admission 은 멈춥니다. 두 budget 은 서로를 대신하지 못합니다. Token 은
            남고 sequence 가 꽉 찬 상태는 짧은 decode 가 많을 때, 그 반대는 긴 prompt 가
            들어올 때 흔합니다.
          </p>
          <p>
            Budget 2048, running 에 decode 40개, waiting 에 3000-token prompt 하나가 있다고
            합시다. Running 순회가 40 token 을 쓰고 2008 이 남습니다. Waiting 의 prompt 는
            need 가 3000 이지만 <code>min(3000, 2008) = 2008</code> 만 받고 running 으로
            올라갑니다.
          </p>
          <p>
            다음 step 에서는 running 순회 안에서 decode 40 뒤에 남은 992 를 받고,
            그 다음 step 부터는 decode 1 token 이 됩니다.
          </p>
        </div>
        <ExplainedFormula
          question="한 step 의 token budget 은 running 과 waiting 에 어떤 순서로 나뉘나요?"
          idea="Budget 은 하나의 잔액입니다. Running 순회가 request 마다 need 와 잔액 중 작은 쪽을 가져가고, 그 뒤 잔액이 남아 있고 sequence 자리가 있을 때만 waiting 의 prompt 가 잔액 크기의 chunk 를 받습니다."
          formula={String.raw`\begin{aligned}
B_0 &= B_{tok} \\
n_r &= \min\!\left(\mathrm{need}_r,\; B_{k}\right),\qquad B_{k+1}=B_k-n_r \quad (r\in\mathcal R\ \text{순서대로}) \\
n_w &= \min\!\left(P_w - c_w,\; B_{\mathrm{rem}}\right)\quad \text{단 } |\mathcal R| < S_{max}
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
B_0 &= \underbrace{B_{tok}}_{\text{max\_num\_batched\_tokens}} \\
n_r &= \underbrace{\min\!\left(\mathrm{need}_r,\; B_{k}\right)}_{\text{running 이 먼저 잔액에서 가져감}},\qquad \underbrace{B_{k+1}=B_k-n_r}_{\text{잔액 갱신}} \\
n_w &= \underbrace{\min\!\left(P_w - c_w,\; B_{\mathrm{rem}}\right)}_{\text{남은 잔액이 곧 prefill chunk 크기}}\quad \underbrace{|\mathcal R| < S_{max}}_{\text{sequence budget 검사}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\min\!\left(\mathrm{need}_r,\; B_{k}\right)`, annotation: ["Running request 의 남은 일과 현재 잔액 중 작은 쪽을 택해", "decode 는 1, 덜 끝난 prefill 은 잔액까지 배정"] },
            { expression: String.raw`B_{k+1}=B_k-n_r`, annotation: ["배정한 만큼 잔액을 줄여", "다음 request 가 볼 budget 을 갱신"] },
            { expression: String.raw`\min\!\left(P_w - c_w,\; B_{\mathrm{rem}}\right)`, annotation: ["Prompt 의 미계산 길이와 running 이 남긴 잔액 중 작은 쪽이", "이번 step 의 prefill chunk 크기"] },
            { expression: String.raw`|\mathcal R| < S_{max}`, annotation: ["Running 크기가 sequence 상한 아래일 때만", "waiting admission 을 계속"] },
          ]}
          terms={[
            { symbol: String.raw`B_{tok}`, name: "Token budget", description: "한 step 이 계산할 수 있는 token 총량인 max_num_batched_tokens 입니다." },
            { symbol: String.raw`\mathrm{need}_r`, name: "Running request 의 남은 일", description: "target 위치에서 num_computed_tokens 를 뺀 값입니다. Decode 는 1, chunk 가 남은 prefill 은 남은 prompt 길이입니다." },
            { symbol: String.raw`P_w - c_w`, name: "Waiting prompt 의 미계산 길이", description: "Prompt 길이에서 prefix cache 로 이미 채운 token 을 뺀 값입니다." },
            { symbol: String.raw`S_{max}`, name: "Sequence budget", description: "Running set 크기의 상한인 max_num_seqs 입니다." },
          ]}
          assumptions={["long_prefill_token_threshold 가 0(기본) 이어서 chunk 상한이 잔액뿐인 경우입니다. 값을 두면 min 에 그 항이 하나 더 들어갑니다.", "KV block 배정이 성공한 request 만 n 을 실제로 받습니다. 실패하면 running 은 preemption, waiting 은 admission 중단으로 갑니다.", "Speculative decoding 의 draft token 과 encoder budget 은 need 와 잔액 계산에 추가 항을 더합니다."]}
          interpretation="Running 이 먼저 잔액을 쓰기 때문에 decode 는 budget 이 0 이 아닌 한 멈추지 않고, waiting prompt 는 남은 잔액 크기로 잘려 여러 step 에 걸쳐 들어옵니다. 잔액이 크면 TTFT 가 짧아지고 그 step 의 decode 지연은 길어집니다."
        />
      </section>

      <section id="step-procedure" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Running 순회, preempt, admission, chunk 분할이 step 의 순서입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <code>schedule()</code> 은 running 순회, preempt 판단, waiting admission, batch
            조립의 네 구간을 이 순서로 지납니다. 순서가 결과를 바꿉니다. Running 을 먼저
            보기 때문에 decode 가 멈추지 않고, preemption 이 한 번이라도 일어난 step 에는
            waiting admission 을 통째로 건너뛰기 때문에 memory 가 모자란 순간 새 request 가
            밀려 들어오지 않습니다.
          </p>
          <p>
            Waiting admission 은 매 step 반복됩니다. Static batching 이 batch 가 끝나야 다음
            묶음을 받는 것과 달리, 어느 step 이든 running 에 빈 sequence 자리와 남은 token
            budget, 첫 chunk 를 담을 KV block 이 있으면 waiting 맨 앞의 request 가 그 자리에서
            running 으로 올라갑니다. 이것이 continuous request admission 입니다.
          </p>
          <p>
            Chunk 크기는 정해진 상수가 아니라 그 step 에 남은 budget 입니다. V1 은 need 를
            <code>token_budget</code> 과 비교해 작은 쪽을 택하고,
            <code>long_prefill_token_threshold</code> 가 0 보다 크면 그 값으로 한 번 더
            자릅니다. 기본값 0 은 상한을 두지 않는다는 뜻이라, 긴 prompt 하나가 그 step 의
            남은 budget 을 전부 가져갈 수 있습니다.
          </p>
          <p>
            KV block 이 모자랄 때의 처리는 두 구간이 다릅니다. Running request 의
            <code>allocate_slots</code> 가 실패하면 running 의 끝(FCFS) 또는 priority 가 가장
            낮은 request 를 골라 block 을 되찾고 다시 시도합니다.
          </p>
          <p>
            Waiting request 가 실패하면
            그 자리에서 admission 순회를 끊고 다음 step 을 기다립니다. 되찾은 request 를
            다시 계산하는 비용은 <Link to="/ai/vllm-scheduler#preemption">KV pressure 와 recomputation</Link> 에 있습니다.
          </p>
        </div>
        <AlgorithmBlock
          title="vLLM V1 schedule() 의 한 step"
          input={["running: 진행 중 request 목록(도착 순)", "waiting: 대기 request queue", "token_budget = max_num_batched_tokens", "max_num_seqs, long_prefill_token_threshold", "kv_cache_manager 의 free block 수"]}
          steps={[
            { code: "for r in running:  need = r.num_tokens_with_spec − r.num_computed_tokens", note: "Decode 는 1, chunk 가 남은 prefill 은 남은 prompt 길이가 need 입니다." },
            { code: "  n = min(need, token_budget, long_prefill_token_threshold or ∞)", note: "잔액과 chunk 상한으로 자릅니다. n 이 0 이면 이 request 를 건너뜁니다." },
            { code: "  while allocate_slots(r, n) fails:  preempt(running.pop() or lowest priority)", note: "KV block 이 없으면 running 의 뒤쪽 request 를 내보내 block 을 회수하고 다시 시도합니다." },
            { code: "  scheduled[r] = n;  token_budget −= n", note: "성공한 request 만 잔액을 줄입니다." },
            { code: "if no preemption:  while waiting and token_budget > 0 and len(running) < max_num_seqs:", note: "Preemption 이 있었던 step 은 admission 을 건너뜁니다. Sequence budget 도 여기서 검사합니다." },
            { code: "  w = waiting.peek();  n = min(w.num_tokens − computed_by_prefix_cache, token_budget, threshold)", note: "Waiting prompt 의 chunk 크기는 running 이 남긴 잔액입니다." },
            { code: "  if allocate_slots(w, n) fails: break;  waiting.pop(); running.append(w); scheduled[w] = n", note: "Waiting 의 실패는 preempt 가 아니라 순회 중단입니다. 성공하면 상태가 RUNNING 이 됩니다." },
            { code: "return SchedulerOutput(scheduled_new/cached_reqs, num_scheduled_tokens, new_blocks, finished_req_ids)", note: "Worker 는 이 목록만 보고 한 forward 를 돌립니다." },
            { code: "update_from_output: r.num_computed_tokens += n;  stop 검사;  완료 request 의 block 반환", note: "Forward 결과로 counter 와 완료 상태를 갱신해야 다음 step 이 같은 token 을 다시 넣지 않습니다." },
          ]}
          repeatUntil="Engine 이 멈출 때까지 forward 마다 한 번씩 반복합니다."
          output="이번 forward 의 request 별 token 수와 KV block 배정, 갱신된 running·waiting 집합"
        />
      </section>

      <section id="batch-shape" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Mixed batch 는 GPU 를 채우고 decode 지연은 chunk 크기가 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한 step 의 결과물이 batch 의 모양을 정합니다. Running 에 decode 만 있으면 decode
            batch, waiting 에서 갓 올라온 prefill 만 있으면 prefill batch, 둘이 같은 step 에
            들어가면 mixed batch 입니다. Chunked prefill 이 기본인 V1 에서는 request 가
            이어지는 한 대부분의 step 이 mixed batch 입니다.
          </p>
          <p>
            Batch 의 모양이 step 마다 달라지는 것이 dynamic batch composition 입니다. 앞의
            예에서 step 1 은 decode 40 + prefill 2008, step 2 는 decode 40 + prefill 992,
            step 3 은 decode 41 이라 세 step 의 token 수가 2048, 1032, 41 로 흔들립니다.
          </p>
          <p>
            Batch 크기가 고정이라는 가정을 둔 kernel 이나
            <Link to="/ai/cuda-graph-capture#implementation">CUDA graph</Link> 는 이 흔들림을
            따로 받아 내야 합니다.
          </p>
          <p>
            Mixed batch 를 만드는 이유는 GPU 를 비우지 않기 위해서입니다. Decode 41 token 만
            있는 step 은 weight 를 한 번 읽어 41 token 만 계산하니 memory-bound 로 남고, 거기에
            prefill chunk 를 얹으면 같은 weight 읽기에 수천 token 의 연산이 붙습니다.
            Sarathi-Serve 는 이렇게 채운 batch 로 decode 를 멈추지 않으면서 처리량을 올렸다고
            보고했습니다.
          </p>
          <p>
            비용은 그 step 의 decode 지연입니다. 한 forward 는 batch 안에서 가장 무거운 작업이
            끝나야 돌아오므로, decode 40개는 prefill 2008 token 의 계산 시간을 그대로
            기다립니다.
          </p>
          <p>
            Decode-only step 이 수 ms 라면 mixed step 은 chunk 크기에 비례해
            길어지고, 그 차이가 ITL 의 꼬리로 나타납니다. Budget 을 줄이면 chunk 가 작아져
            ITL 은 안정되지만 prompt 완료가 늦어져 TTFT 가 밀립니다.
          </p>
        </div>
        <TermBreakdown
          title="한 step 이 만들 수 있는 batch 의 세 모양"
          description="세 모양은 서로 다른 scheduler 가 아니라 같은 step 절차가 running·waiting 상태에 따라 낸 결과입니다."
          items={[
            { term: "Decode batch", description: "Running 의 모든 request 가 need 1 이고 waiting 이 비어 있을 때. Token 수는 running 크기와 같습니다.", example: "Decode 41개 → 41 token, step 시간은 weight 읽기가 정합니다.", boundary: "GPU 연산 단위가 작아 memory-bound 로 남습니다." },
            { term: "Prefill batch", description: "Running 이 비었고 waiting 의 prompt 가 잔액 전부를 받을 때. 서비스 시작 직후나 burst 첫 step 에 나타납니다.", example: "3000-token prompt 가 budget 2048 을 혼자 채우고 다음 step 에 992 를 받습니다.", boundary: "Decode 가 없어 ITL 에는 영향이 없지만 sequence 자리 하나가 여러 step 을 씁니다." },
            { term: "Mixed batch", description: "Running 의 decode 뒤에 waiting 또는 chunk 가 남은 running prefill 이 잔액을 채울 때.", example: "Decode 40 + prefill 2008 = 2048 token 한 forward.", boundary: "그 step 의 decode 지연이 chunk 크기에 비례해 늘어납니다." },
          ]}
        />
        <ProgressiveDetail
          title="Budget 을 max_model_len 만큼 크게 두면 무엇이 달라지나요?"
          preview="공식 문서는 max_num_batched_tokens 를 max_model_len 과 같게 두면 decode 를 먼저 보는 점만 빼고 V0 기본 정책과 거의 같아진다고 적습니다. Chunk 가 사라져 prompt 하나가 한 step 을 통째로 차지합니다."
        >
          <p>
            문서는 작은 값(예 2048)이 prefill 을 잘게 나눠 ITL 을 좋게 하고, 큰 값이 한 step
            에 더 많은 prefill token 을 넣어 TTFT 를 좋게 한다고 안내합니다. 큰 GPU 의 작은
            model 에는 8192 를 넘기는 값을 권합니다. 이 권고는 처리량 기준이며, ITL SLO 가
            있는 배포에서는 chunk 크기별 p99 ITL 을 함께 재야 합니다.
          </p>
          <p>
            <code>long_prefill_token_threshold</code> 는 잔액과 별도로 한 prompt 의 chunk 상한을
            둡니다. 잔액이 2008 이어도 threshold 가 512 면 그 step 의 chunk 는 512 로 잘리고,
            남은 잔액은 waiting 의 다음 request 가 받습니다. 긴 prompt 하나가 여러 짧은
            prompt 의 admission 을 막지 않게 하는 손잡이입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Orca 가 iteration 단위를, Sarathi-Serve 가 chunk 배치를 보였습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Step 단위 결정의 출발은 Orca(OSDI 2022)입니다. Orca 는 batch 가 끝날 때까지
            구성을 고정하던 request-level scheduling 을 iteration 마다 다시 고르는
            iteration-level scheduling 으로 바꿨습니다. 이 글의 step 은 그 iteration 안쪽을
            token budget 과 chunk 로 더 잘게 나눈 것입니다.
          </p>
          <p>
            Sarathi-Serve 는 prompt 를 chunk 로 나누고 decode 를 먼저 배치한 뒤 남은 budget 에
            chunk 를 넣는 stall-free schedule 을 제안했습니다. 보고된 처리 용량 2.6×(Mistral-7B,
            A100 1장)·3.7×(Yi-34B, A100 2장)·5.6×(Falcon-180B, pipeline parallel)는 당시 vLLM
            대비 저자 자기보고이며 최신 vLLM 에서 재현된다는 뜻은 아닙니다.
          </p>
          <p>
            이 글의 필드·함수 이름은 vLLM V1 의 <code>vllm/v1/core/sched/scheduler.py</code> 와
            <code>vllm/config/scheduler.py</code> 를 2026년 8월 기준으로 읽은 것입니다. 소스는
            계속 바뀌므로 절차의 뼈대만 믿고 세부 조건은 배포 중인 버전에서 다시 확인해야 합니다.
          </p>
        </div>
        <div id="paper-orca-iteration" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Yu et al. · Orca: A Distributed Serving System for Transformer-Based Generative Models (OSDI 2022)"
            citeKey={1}
            href="https://www.usenix.org/conference/osdi22/presentation/yu"
          >
            Request 단위로 batch 를 고정하던 serving 에 iteration-level scheduling 과
            selective batching 을 도입해 완료 request 를 즉시 빼고 새 request 를 iteration
            경계에서 받게 했습니다. Chunked prefill 과 token budget 은 후속 시스템의 확장입니다.
          </CitationBlock>
        </div>
        <div id="paper-sarathi-serve" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Agrawal et al. · Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve (OSDI 2024)"
            citeKey={2}
            href="https://arxiv.org/abs/2403.02310"
          >
            Chunked-prefills 와 stall-free scheduling 으로 decode 를 멈추지 않는 mixed batch 를
            만들고, 균일한 batch 가 pipeline bubble 도 줄인다고 보였습니다. 수치는 명시된
            model·GPU·latency 조건에서의 저자 측정입니다.
          </CitationBlock>
        </div>
        <div id="source-vllm-v1-scheduler" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="vllm-project/vllm · vllm/v1/core/sched/scheduler.py"
            citeKey={3}
            href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/sched/scheduler.py"
            type="code"
          >
            <code>schedule()</code> 의 running 순회 → preemption → waiting admission 순서,
            <code>token_budget</code>·<code>max_num_running_reqs</code>·<code>long_prefill_token_threshold</code>
            의 clipping, allocation 실패 시 running 은 preempt 하고 waiting 은 break 하는 분기를
            이 소스에서 확인했습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/ai/vllm-scheduler#prefill-decode">Chunked prefill 과 decode latency</Link>,
          그리고 <Link to="/ai/vllm-paged-attention#kv-cache-manager">Scheduler 와 KV allocation 계약</Link>.
        </p>
      </section>
    </div>
  );
}
