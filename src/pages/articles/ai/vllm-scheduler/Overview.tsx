import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">vLLM 스케줄러 개요</h2>
        <CodeViewButton onClick={() => onCodeRef('scheduler', {} as CodeRef)} label="Scheduler 클래스" />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          vLLM V1 스케줄러의 핵심 설계 — <strong>"phase 구분이 없다"</strong>.
          기존 LLM 서빙은 Prefill(프롬프트 처리)과 Decode(토큰 생성) 단계를 분리했습니다.<br />
          V1 스케줄러는 요청마다 <code>num_computed_tokens</code>와 <code>num_tokens_with_spec</code>만 추적합니다.
        </p>

        <p>
          매 스텝에서 schedule()은 그 차이(= 새로 계산할 토큰 수)를 token_budget에서 차감합니다.<br />
          Chunked Prefill, Prefix Caching, Speculative Decoding 모두 이 단일 모델로 처리합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">스케줄러 역할</h3>
        <ul>
          <li><strong>배치 구성</strong> — RUNNING 요청 순회 후 WAITING 큐에서 새 요청 추가</li>
          <li><strong>블록 할당</strong> — KVCacheManager.allocate_slots()로 물리 블록 확보</li>
          <li><strong>프리엠션</strong> — 블록 부족 시 낮은 우선순위 요청을 waiting으로 되돌림</li>
          <li><strong>출력 처리</strong> — update_from_output()으로 생성된 토큰 반영</li>
        </ul>

        <p>
          이 아티클에서는 schedule()의 루프 구조, Prefill/Decode 통합 방식,
          프리엠션 메커니즘을 코드 수준에서 추적합니다.
        </p>
      </div>
    </section>
  );
}
