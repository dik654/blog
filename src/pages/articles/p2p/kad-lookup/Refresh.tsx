import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { DO_REFRESH_CODE, LOAD_SEEDS_CODE, LOOKUP_ITERATOR_CODE, REFRESH_TIMER_CODE } from './RefreshData';
import { codeRefs } from './codeRefs';

export default function Refresh({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="refresh" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">테이블 리프레시와 부트스트랩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">doRefresh: 자기 탐색 + 랜덤 탐색</h3>
        <p>
          리프레시는 3단계로 진행된다.<br />
          먼저 DB와 부트노드에서 시드를 로드한다.<br />
          다음으로 자기 ID를 타겟으로 탐색하여 이웃을 발견한다.<br />
          마지막으로 랜덤 타겟 3회 탐색으로 다양한 버킷을 채운다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('do-refresh', codeRefs['do-refresh'])} />
            <span className="text-[10px] text-muted-foreground self-center">doRefresh()</span>
            <CodeViewButton onClick={() => onCodeRef('load-seeds', codeRefs['load-seeds'])} />
            <span className="text-[10px] text-muted-foreground self-center">loadSeedNodes()</span>
          </div>
        )}
        <CodePanel title="doRefresh() — self + random x3 탐색" code={DO_REFRESH_CODE} annotations={[
          { lines: [5, 5], color: 'sky', note: 'DB + 부트노드 시드 로드' },
          { lines: [8, 8], color: 'emerald', note: 'self lookup: 이웃 노드 발견' },
          { lines: [11, 13], color: 'amber', note: '랜덤 타겟 3회: 버킷 다양성 확보' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">loadSeedNodes: 시드 로드</h3>
        <p>
          DB에서 최대 30개(<code>seedCount</code>), 5일 이내(<code>seedMaxAge</code>) 노드를 조회한다.<br />
          여기에 Config.Bootnodes(nursery)를 합쳐 초기 라우팅 테이블을 구성한다.
        </p>
        <CodePanel title="loadSeedNodes() — DB + 부트노드 병합" code={LOAD_SEEDS_CODE} annotations={[
          { lines: [3, 3], color: 'sky', note: 'DB에서 최근 본 노드 조회' },
          { lines: [5, 5], color: 'emerald', note: '부트노드 추가' },
          { lines: [8, 10], color: 'amber', note: '각 시드를 테이블에 삽입' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">리프레시 타이머</h3>
        <p>
          기본 <code>RefreshInterval</code>은 30분이다.<br />
          실제 타이머는 15~30분 랜덤 지터를 적용하여 네트워크 전체가 동시에 리프레시하는 것을 방지한다.<br />
          테이블이 빈 상태이면 <code>lookupFailed()</code>가 즉시 리프레시를 트리거한다.
        </p>
        <CodePanel title="nextRefreshTime — 15~30분 랜덤 지터" code={REFRESH_TIMER_CODE} annotations={[
          { lines: [5, 5], color: 'sky', note: 'half = 30분 / 2 = 15분' },
          { lines: [6, 7], color: 'emerald', note: '15분 + 랜덤(0~15분)' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">lookupIterator: 연속 탐색</h3>
        <p>
          <code>lookupIterator</code>는 lookup을 연속으로 생성하며 발견된 노드를 순회한다.<br />
          현재 lookup이 완료되면 새 lookup을 생성하고,
          <code>slowdown()</code>으로 최소 1초 간격을 보장하여 과열을 방지한다.
        </p>
        <CodePanel title="lookupIterator — 연속 탐색 반복자" code={LOOKUP_ITERATOR_CODE} annotations={[
          { lines: [3, 3], color: 'sky', note: 'nextLookup: 새 탐색 생성 함수' },
          { lines: [7, 7], color: 'emerald', note: '최소 간격 타이머' },
          { lines: [11, 13], color: 'amber', note: '핵심 메서드 요약' },
        ]} />
      </div>
    </section>
  );
}
