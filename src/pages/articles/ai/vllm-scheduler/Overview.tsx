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
          vLLM V1 스케줄러의 핵심 설계는 <strong>phase 이름 대신 남은 token work를 공통 장부로 계산</strong>하는 것입니다.
          Prefill(프롬프트 처리)과 Decode(토큰 생성)는 물리 비용과 SLO가 다르지만,<br />
          V1 스케줄러는 <code>num_tokens_with_spec + num_output_placeholders - num_computed_tokens</code>로 이번 work를 표현합니다.
          동기 경로에서는 output placeholder가 0이고, async 경로에서는 아직 결과가 돌아오지 않은 예약 자리까지 센다.
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
