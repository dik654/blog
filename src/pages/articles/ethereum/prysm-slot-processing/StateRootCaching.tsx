import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StateRootCaching({ onCodeRef: _ }: Props) {
  return (
    <section id="state-root-caching" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 루트 캐싱</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 링 버퍼 8192</strong> — stateRoots와 blockRoots는 고정 크기 8192 배열<br />
          slot % 8192로 인덱싱하여 오래된 값을 자연스럽게 덮어씀<br />
          약 27시간 분량 — 이보다 오래된 루트는 historicalRoots로 이동
        </p>
        <p className="text-sm border-l-2 border-violet-500/50 pl-3 mt-4">
          <strong>💡 HistoricalBatch 압축</strong> — 에폭 경계에서 링 버퍼가 한 바퀴 돌면<br />
          stateRoots + blockRoots의 Merkle Root를 historicalRoots에 추가<br />
          장기 상태 증명에 필요한 최소한의 데이터만 보관
        </p>
      </div>
    </section>
  );
}
