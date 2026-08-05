import ScheduleMethod from './vllm-scheduler/ScheduleMethod';
import PrefillDecode from './vllm-scheduler/PrefillDecode';
import Preemption from './vllm-scheduler/Preemption';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import { schedulerCodeRefs } from './vllm-serving/codeRefsScheduler';
import { sharedCodeRefs } from './vllm-serving/sharedCodeRefs';
import { vllmTree } from './vllm-serving/fileTrees';
import ServingDepthGuide from './llm-serving-ops/ServingDepthGuide';
import { SchedulerBudgetViz } from './vllm-runtime/viz/VllmRuntimeViz';

const allRefs = { ...sharedCodeRefs, ...schedulerCodeRefs };

export default function VLLMSchedulerArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <QuestionLead
          question="128개 요청이 한 token씩 기다리는데 8,192-token prompt도 도착했다. 다음 GPU step의 1,024-token 예산을 어떻게 나눌까?"
          answer={<>먼저 현재 decode 요청의 inter-token latency를 보호해 128 token을 배정하고, 남은 896을 긴 prompt의 prefill chunk에 줄 수 있다. 하지만 이는 <strong>token 장부의 후보</strong>일 뿐이다. 실제 admission은 KV block, encoder budget, priority와 preemption 상태까지 통과해야 한다.</>}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Model runner는 주어진 tensor batch를 계산하지만 어떤 요청을 묶을지는 결정하지 않는다. Scheduler는 매 step마다 running·waiting request를 다시 보고, 이미 계산한 위치와 목표 위치의 차이를 work item으로 바꾼다. 이 iteration-level 재배치가 continuous batching의 핵심이다.</p>
          <p>V1 구현은 prefill과 decode를 별도 상태 이름보다 <code>num_computed_tokens</code>와 목표 token 수의 차이로 통합해 다룬다. 이것은 <strong>회계 단위가 통합되었다</strong>는 뜻이다. 긴 prompt의 matrix 연산과 한 token decode의 memory access가 같은 비용이라는 뜻은 아니다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'Prefill', meaning: 'Prompt 여러 token을 병렬로 처리해 첫 KV 상태를 만드는 구간이다.', why: '긴 prompt는 compute burst와 TTFT 압력을 만든다.' },
          { term: 'Decode', meaning: '각 요청이 직전 상태에서 다음 token 하나를 반복 생성하는 구간이다.', why: '작은 step이 자주 돌아 TPOT와 memory bandwidth를 압박한다.' },
          { term: 'Iteration-level scheduling', meaning: '요청 전체가 아니라 한 model step이 끝날 때마다 batch를 다시 구성한다.', why: '완료·도착·길이가 다른 요청을 빈 slot에 계속 채울 수 있다.' },
          { term: 'Chunked prefill', meaning: '긴 prompt를 한 번에 끝내지 않고 step budget에 맞춰 여러 조각으로 계산한다.', why: 'Prefill이 decode를 오래 막는 head-of-line stall을 줄인다.' },
          { term: 'Output placeholder', meaning: 'Async scheduling에서 이전 model step의 output 처리가 돌아오기 전에 다음 위치를 중복 배정하지 않도록 예약한 token 자리다.', why: '아직 request token 목록에 확정되지 않은 in-flight work도 이번 step의 남은 일 계산에 포함한다.' },
        ]} />
        <SchedulerBudgetViz />
      </section>

      <section id="step-budget" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Scheduler의 출력은 배치가 아니라 한 step의 작업 계획이다</h2>
        <M display>{String.raw`\begin{aligned}
\underbrace{n_i^{\mathrm{target}}}_{\text{이번 장부의 목표 위치}}&=
\underbrace{n_i^{\mathrm{with\_spec}}}_{\text{prompt·output·draft}}+
\underbrace{n_i^{\mathrm{placeholder}}}_{\text{비동기 예약 자리}}\\
\underbrace{r_i}_{\text{요청 }i\text{의 남은 계산}}&=\underbrace{n_i^{\mathrm{target}}-n_i^{\mathrm{computed}}}_{\text{목표와 완료 위치의 차이}}\\
\underbrace{u_i}_{\text{이번 step 배정}}&=\min\!\left(\underbrace{r_i}_{\text{남은 일}},\underbrace{B_{\mathrm{rem}}}_{\text{남은 token 예산}},\underbrace{C_i}_{\text{요청별 허용량}}\right)\\
\sum_i u_i&\leq\underbrace{B_{\mathrm{step}}}_{\text{한 step 전체 token 예산}}
\end{aligned}`}</M>
        <FormulaNote
          meaning={'Speculative token까지 포함한 현재 token 길이에 async output placeholder를 더해 장부의 목표 위치를 만든다. 여기서 이미 계산한 위치를 빼고, step budget과 요청별 제한을 넘지 않는 양만 배정한다. 동기 경로에서는 placeholder가 0이다. 실제 vLLM scheduler의 priority, structured output, encoder와 KV 조건을 모두 적은 공식이 아니라 핵심 장부를 검산하는 단순 모델이다.'}
          symbols={[
            [String.raw`n_i^{\mathrm{with\_spec}}`, 'prompt, 확정 output과 아직 검증 전인 speculative token을 포함한 길이'],
            [String.raw`n_i^{\mathrm{placeholder}}`, 'async scheduling에서 아직 결과가 돌아오지 않은 예약 token 수'],
            [String.raw`r_i`, '요청 i에서 아직 계산하지 않은 token 수'],
            [String.raw`u_i`, '이번 model step에 실제 배정할 token 수'],
            [String.raw`C_i`, 'chunk 경계, model 길이, speculative slot 등 요청별 제한을 묶은 상한'],
            [String.raw`B_{\mathrm{step}}=1024`, '공유 fixture의 한 step token budget'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>공유 fixture에서 128개 running decode request가 각각 한 token을 요구하면 128을 먼저 쓴다. 계산상 896이 남으므로 waiting prompt에 896-token prefill chunk를 줄 수 있다. 그러나 896 token에 필요한 새 KV block이 없거나 encoder budget이 이미 찼으면 allocate가 실패한다. Scheduler는 이때 admission을 미루거나 낮은 우선순위 request를 preempt해 상태를 되돌린다.</p>
          <p>좋은 schedule은 throughput 숫자 하나로 정해지지 않는다. Decode를 과도하게 우선하면 새 요청의 TTFT가 늘고, prefill을 크게 잡으면 현재 사용자의 TPOT가 튄다. 따라서 token budget, KV headroom, queue age와 실제 TTFT·TPOT trace를 함께 봐야 한다.</p>
        </div>
        <Misconception>“Prefill phase와 decode phase가 없다”는 내부 scheduler의 통합 표현이다. Prefill이 compute-bound이고 decode가 memory-bandwidth-bound가 되기 쉽다는 물리적 차이, 그리고 두 SLO가 다르다는 사실까지 없어진 것은 아니다.</Misconception>
      </section>

      <ScheduleMethod onCodeRef={sidebar.open} />
      <PrefillDecode onCodeRef={sidebar.open} />
      <Preemption onCodeRef={sidebar.open} />

      <section id="handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">다음 글에 넘길 산출물: 검증 전 lookahead를 포함한 step plan</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Scheduler가 내보내는 것은 request별 scheduled token 수, block allocation, encoder item과 preemption reason이다. Speculative request라면 아직 확정되지 않은 draft를 계산할 <strong>lookahead slot</strong>도 잡는다. 어떤 draft token을 최종 state에 commit할지는 <InternalLink slug="vllm-spec-decode">Speculative Decoding</InternalLink>의 verifier가 결정한다.</p>
        </div>
        <CapabilityCheck items={[
          'Prefill과 decode의 물리 비용을 구분하면서 하나의 step token ledger를 계산할 수 있다.',
          'Token budget이 남아도 KV·encoder headroom 때문에 admission이 실패하는 이유와 preemption 대가를 설명할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Orca · OSDI 2022', href: 'https://www.usenix.org/conference/osdi22/presentation/yu', note: 'Iteration-level scheduling과 selective batching의 최소 기준점.' },
          { label: 'Sarathi-Serve', href: 'https://arxiv.org/abs/2403.02310', note: 'Chunked prefill과 decode stall 완화의 연구 설계 및 논문 범위.' },
          { label: 'vLLM optimization and tuning', href: 'https://docs.vllm.ai/en/stable/configuration/optimization/', note: '현재 V1 chunked prefill 우선순위와 token budget 조정 경계.' },
          { label: 'vLLM Scheduler API', href: 'https://docs.vllm.ai/en/latest/api/vllm/v1/core/sched/scheduler/', note: '현재 scheduler의 running/waiting, KV와 encoder budget 구현.' },
          { label: 'vLLM V1 guide', href: 'https://docs.vllm.ai/en/latest/getting_started/v1_user_guide.html', note: 'V1 runtime 기능과 version-sensitive 설정을 확인하는 공식 안내.' },
        ]} />
      </section>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ServingDepthGuide guideKey="scheduler" />
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={allRefs}
        fileTrees={{ vllm: vllmTree }}
        projectMetas={{
          vllm: { id: 'vllm', label: 'vLLM · Python', badgeClass: 'bg-[#fef3c7] border-[#f59e0b] text-[#92400e]' },
        }}
      />
    </>
  );
}
