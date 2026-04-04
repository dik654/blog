import { CodeViewButton } from '@/components/code';
import { schedulerCodeRefs } from '../vllm-serving/codeRefsScheduler';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Preemption({ onCodeRef }: Props) {
  return (
    <section id="preemption" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">프리엠션 메커니즘</h2>
        <CodeViewButton
          onClick={() => onCodeRef('scheduler-preempt', schedulerCodeRefs['scheduler-preempt'])}
          label="_preempt_request()"
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GPU 메모리가 부족하면 실행 중인 요청을 <strong>프리엠션(선점)</strong>해야 합니다.
          vLLM V1은 V0의 Swapping(CPU 이동) 대신 <strong>Recomputation(재계산)</strong>을 사용합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 Recomputation인가?</h3>
        <p>
          Swap은 CPU-GPU 간 KV 캐시 복사가 필요합니다. 블록 크기 x 레이어 수 x 헤드 수만큼의
          데이터를 PCIe로 전송해야 하므로 오버헤드가 큽니다.<br />
          V1은 Prefill 재계산이 더 빠르다고 판단하여 KV 캐시를 완전히 해제합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">_preempt_request() 동작</h3>
        <ol>
          <li><code>kv_cache_manager.free(request)</code> — 모든 KV 블록 해제</li>
          <li><code>encoder_cache_manager.free(request)</code> — 인코더 캐시도 해제</li>
          <li><code>request.num_computed_tokens = 0</code> — 처음부터 다시 계산</li>
          <li><code>waiting.prepend_request(request)</code> — waiting 큐 <strong>맨 앞</strong>에 삽입</li>
        </ol>

        <p>
          맨 앞에 삽입하는 이유 — 이미 사용자가 대기 중이므로 최우선 처리합니다.
          <code>num_preemptions</code> 카운터로 프리엠션 횟수를 추적하여 모니터링에 활용합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">프리엠션 대상 선택</h3>
        <p>
          Priority 정책: <code>max(running, key=(priority, arrival_time))</code> — 우선순위 낮고 늦게 도착한 요청 먼저 프리엠션.
          FCFS 정책: <code>running.pop()</code> — 가장 마지막에 추가된 요청 (가장 적게 진행된 요청).
          프리엠션 루프는 블록 확보에 성공하거나 프리엠션 대상이 소진될 때까지 반복합니다.
        </p>
      </div>
    </section>
  );
}
