import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StateFork({ onCodeRef: _ }: Props) {
  return (
    <section id="state-fork" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">포크별 상태 변형</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 인플레이스 변환</strong> — UpgradeToAltair() 등으로 기존 상태를 복사하지 않고 제자리에서 변환<br />
          새 필드(SyncCommittee 등)를 초기화하고 fork 버전을 갱신<br />
          Phase0 → Altair → Bellatrix → Capella → Deneb 순서
        </p>
        <p className="text-sm border-l-2 border-violet-500/50 pl-3 mt-4">
          <strong>💡 fieldIndex 확장</strong> — 포크마다 열거형이 확장됨<br />
          Bellatrix에서 latestExecutionPayloadHeader 추가<br />
          Deneb에서 blobKzgCommitments 추가 — Version() 메서드로 포크별 로직 분기
        </p>
      </div>
    </section>
  );
}
