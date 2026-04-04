import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PruningArchival({ onCodeRef: _ }: Props) {
  return (
    <section id="pruning-archival" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프루닝 & 아카이벌</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Finalized 체크포인트가 갱신되면 그 이전의 비-캐노니컬 데이터를 정리한다.<br />
          디스크 사용량을 제어하는 핵심 메커니즘이다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">프루닝 대상</h3>
        <ul>
          <li><strong>비-캐노니컬 블록</strong> — Finalized 이전, 캐노니컬 체인에 포함되지 않은 블록</li>
          <li><strong>고아 상태</strong> — 참조하는 블록이 삭제된 상태</li>
          <li><strong>만료된 어테스테이션</strong> — 이미 Finalized된 에폭의 미포함 어테스테이션</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 아카이벌 모드</strong> — --archive 플래그로 프루닝을 건너뛸 수 있음<br />
          블록 탐색기, 분석 인프라 등 전체 히스토리가 필요한 경우 사용<br />
          메인넷 기준 연간 수백 GB 이상이므로 충분한 스토리지가 전제
        </p>
      </div>
    </section>
  );
}
