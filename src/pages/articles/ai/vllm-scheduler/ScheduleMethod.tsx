import { CodeViewButton } from '@/components/code';
import { schedulerCodeRefs } from '../vllm-serving/codeRefsScheduler';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ScheduleMethod({ onCodeRef }: Props) {
  return (
    <section id="schedule-method" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">schedule() 메서드 분석</h2>
        <CodeViewButton
          onClick={() => onCodeRef('scheduler-schedule', schedulerCodeRefs['scheduler-schedule'])}
          label="schedule() 소스"
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          schedule()은 vLLM의 심장입니다. 매 스텝에서 <strong>어떤 요청에 몇 토큰을 계산할지</strong> 결정합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">1단계: RUNNING 요청 처리</h3>
        <p>
          이미 실행 중인 요청부터 순회합니다.<br />
          각 요청의 <code>num_tokens_with_spec - num_computed_tokens</code>가 새로 계산할 토큰 수입니다.
          <code>token_budget</code>(기본값: <code>max_num_batched_tokens</code>)에서 차감하며 진행합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">2단계: KV 블록 할당</h3>
        <p>
          <code>kv_cache_manager.allocate_slots(request, num_new_tokens)</code> 호출.
          성공하면 배치에 추가, 실패하면 프리엠션 루프에 진입합니다.<br />
          프리엠션은 가장 낮은 우선순위 요청(FCFS 또는 Priority 기반)을 선택하여
          KV 캐시를 해제하고 waiting 큐로 되돌립니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3단계: WAITING 큐 처리</h3>
        <p>
          RUNNING 처리 후 남은 token_budget으로 waiting 큐에서 새 요청을 스케줄합니다.<br />
          새 요청은 <code>get_computed_blocks()</code>로 Prefix Cache 히트를 먼저 확인하고,
          히트한 블록만큼 <code>num_computed_tokens</code>를 건너뜁니다.<br />
          이것이 <strong>Chunked Prefill</strong> — 한 스텝에 프롬프트 일부만 처리하는 방식입니다.
        </p>
      </div>
    </section>
  );
}
