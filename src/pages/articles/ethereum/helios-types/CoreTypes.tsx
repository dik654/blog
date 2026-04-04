import type { CodeRef } from '@/components/code/types';
import CoreTypesViz from './viz/CoreTypesViz';

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function CoreTypes({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="core-types" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Helios가 사용하는 CL 타입은 4개 구조체로 요약된다.
          BeaconBlockHeader, SyncAggregate, LightClientUpdate, LightClientStore.
        </p>
      </div>

      {/* Viz: 4 steps — 각 구조체의 필드·역할·크기 */}
      <div className="not-prose my-8">
        <CoreTypesViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} state_root가 핵심인 이유</strong><br />
          Helios는 state_root 하나로 EL 상태를 간접 검증한다.
          execution_payload 안의 state_root를 추출하여 계정·스토리지 증명에 사용한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} Update vs Store 관계</strong><br />
          Update는 일회성 메시지, Store는 누적 상태이다.
          매 Update를 검증·적용하면 Store의 finalized_header가 전진한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} Reth 비교</strong><br />
          Reth는 MDBX에 700GB+ 상태를 저장한다.
          Helios Store는 수 KB — 풀노드 대비 10만 배 이상 가볍다.
        </p>
      </div>
    </section>
  );
}
