import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { LOOKUP_STRUCT_CODE, ADVANCE_CODE, START_QUERIES_CODE } from './AlgorithmData';
import { codeRefs } from './codeRefs';

export default function Algorithm({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="algorithm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">반복 탐색 알고리즘</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          go-ethereum의 <code>lookup</code> 구조체가 Kademlia iterative lookup을 구현한다.<br />
          핵심 상수 두 가지: <strong>alpha=3</strong> (동시 질의 수), <strong>bucketSize=16</strong> (최대 결과 수).
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">lookup 구조체</h3>
        <CodePanel title="lookup 구조체 — lookup.go" code={LOOKUP_STRUCT_CODE} annotations={[
          { lines: [6, 7], color: 'sky', note: 'asked/seen: 중복 방지 맵' },
          { lines: [8, 8], color: 'emerald', note: 'result: 거리순 정렬 리스트' },
          { lines: [10, 10], color: 'amber', note: 'queries: 동시 진행 고루틴 수' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">run → advance → startQueries 루프</h3>
        <p>
          <code>run()</code>은 <code>advance()</code>를 반복 호출한다.
          advance 내부에서 <code>startQueries()</code>가 alpha개까지 고루틴을 띄우고,
          <code>replyCh</code>로 응답을 수신한다.<br />
          새 노드가 발견되면 true를 반환하고, 모든 후보를 소진하면 false로 루프를 종료한다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('lookup-advance', codeRefs['lookup-advance'])} />
            <span className="text-[10px] text-muted-foreground self-center">advance()</span>
            <CodeViewButton onClick={() => onCodeRef('lookup-start-queries', codeRefs['lookup-start-queries'])} />
            <span className="text-[10px] text-muted-foreground self-center">startQueries()</span>
          </div>
        )}
        <CodePanel title="advance() — 응답 수신 루프" code={ADVANCE_CODE} annotations={[
          { lines: [3, 4], color: 'sky', note: 'replyCh에서 응답 수신' },
          { lines: [6, 8], color: 'emerald', note: '새 노드 발견 시 true 반환' },
          { lines: [14, 14], color: 'amber', note: '수렴 완료: false 반환' },
        ]} />
        <CodePanel title="startQueries() — alpha=3 동시 질의" code={START_QUERIES_CODE} annotations={[
          { lines: [6, 6], color: 'sky', note: 'result.entries 순회 + alpha 제한' },
          { lines: [9, 11], color: 'emerald', note: '미질의 노드에 고루틴 발사' },
          { lines: [14, 14], color: 'amber', note: '진행 중 질의 유무로 계속 여부 결정' },
        ]} />
        <p>
          수렴 조건: result.entries의 모든 노드에 이미 질의했고(<code>asked</code> 맵),
          진행 중인 고루틴도 0개이면 탐색이 종료된다.
        </p>
      </div>
    </section>
  );
}
