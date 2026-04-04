import { CodeViewButton } from '@/components/code';
import { schedulerCodeRefs } from '../vllm-serving/codeRefsScheduler';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PrefillDecode({ onCodeRef }: Props) {
  return (
    <section id="prefill-decode" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Prefill/Decode 통합 모델</h2>
        <CodeViewButton
          onClick={() => onCodeRef('scheduler-update', schedulerCodeRefs['scheduler-update'])}
          label="update_from_output()"
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          V1 스케줄러의 가장 큰 혁신 — <strong>"Prefill Phase"와 "Decode Phase"가 없다</strong>.
          소스 코드 주석에도 명시되어 있습니다:
        </p>

        <blockquote className="border-l-4 border-sky-400 pl-4 my-4 text-sm">
          "There's no 'decoding phase' nor 'prefill phase' in the scheduler.
          Each request just has num_computed_tokens and num_tokens_with_spec."
          <br />
          — scheduler.py L342-346
        </blockquote>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 통합했을까?</h3>
        <p>
          Phase 분리 시 Prefill 중에는 Decode 요청이 대기하고, 그 반대도 마찬가지입니다.<br />
          GPU 활용률이 떨어집니다. 통합 모델은 한 배치에 Prefill 토큰과 Decode 토큰을 함께 넣어
          GPU 연산량을 최대화합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">update_from_output() 흐름</h3>
        <p>
          모델 실행 후 <code>update_from_output()</code>이 결과를 처리합니다.
        </p>
        <ol>
          <li>요청별로 생성된 토큰 ID 추출</li>
          <li>Speculative Decoding 시: 거부된 토큰만큼 <code>num_computed_tokens</code> 롤백</li>
          <li>정지 조건(EOS, max_tokens) 체크</li>
          <li>완료된 요청의 KV 블록 해제 (<code>_free_request</code>)</li>
          <li>Structured Output grammar 업데이트</li>
        </ol>

        <p>
          이 루프가 최대 1,000개 이상의 요청을 처리하므로,
          내부에서 비싼 연산은 피해야 합니다 (소스 주석 L1333-1335 참조).
        </p>
      </div>
    </section>
  );
}
