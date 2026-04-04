import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { NODES_BY_DISTANCE_CODE, QUERY_CODE, TRACK_REQUEST_CODE } from './GethLookupData';
import { codeRefs } from './codeRefs';

export default function GethLookup({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="geth-lookup" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">go-ethereum lookup 구현 상세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">nodesByDistance: 이진 탐색 정렬 리스트</h3>
        <p>
          <code>push()</code>는 <code>sort.Search</code>로 XOR 거리 기준 삽입 위치를 O(log n)에 결정한다.<br />
          리스트 크기가 <code>maxElems</code>(=16)을 넘으면 가장 먼 노드가 자동 탈락한다.<br />
          탐색이 진행될수록 target에 더 가까운 노드만 남는다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('nodes-by-distance', codeRefs['nodes-by-distance'])} />
            <span className="text-[10px] text-muted-foreground self-center">nodesByDistance.push()</span>
          </div>
        )}
        <CodePanel title="nodesByDistance — 거리순 정렬 + push" code={NODES_BY_DISTANCE_CODE} annotations={[
          { lines: [8, 10], color: 'sky', note: 'sort.Search: XOR 거리 이진 탐색' },
          { lines: [12, 13], color: 'emerald', note: 'maxElems 미만이면 슬롯 확장' },
          { lines: [16, 18], color: 'amber', note: 'copy로 밀어내기 + 삽입' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">query() 고루틴과 결과 수집</h3>
        <p>
          각 고루틴은 <code>queryfunc</code>으로 FINDNODE RPC를 실행하고,
          결과를 <code>replyCh</code> 채널로 전송한다.
          <code>advance()</code>가 채널에서 수신하여 <code>addNodes()</code>로 result에 병합한다.<br />
          이미 본 노드(<code>seen</code> 맵)는 건너뛰어 중복을 방지한다.
        </p>
        <CodePanel title="query() — FINDNODE 실행 + 결과 전송" code={QUERY_CODE} annotations={[
          { lines: [2, 2], color: 'sky', note: 'queryfunc: UDP FINDNODE 호출' },
          { lines: [5, 5], color: 'emerald', note: 'trackRequest: 테이블 피드백' },
          { lines: [10, 10], color: 'amber', note: '채널로 결과 전송' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">trackRequest: 테이블 피드백</h3>
        <p>
          질의 성공 시 연속 실패 카운터를 리셋한다.<br />
          실패가 누적되면(<code>maxFindnodeFailures</code>) 해당 노드를 버킷에서 제거한다.<br />
          응답에 포함된 새 노드는 라우팅 테이블에 자동 추가된다.
        </p>
        <CodePanel title="handleTrackRequest — 실패 추적 + 노드 갱신" code={TRACK_REQUEST_CODE} annotations={[
          { lines: [2, 3], color: 'sky', note: '성공: 실패 카운터 리셋' },
          { lines: [10, 12], color: 'emerald', note: '연속 실패 초과 시 퇴출' },
          { lines: [14, 16], color: 'amber', note: '발견된 노드를 테이블에 추가' },
        ]} />
      </div>
    </section>
  );
}
