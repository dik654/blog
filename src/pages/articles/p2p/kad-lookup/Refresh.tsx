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

        <h3 className="text-xl font-semibold mt-6 mb-3">Bootstrap과 Network Healing</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// DHT Bootstrap과 Refresh 메커니즘
//
// Bootstrap Problem:
//   "새 노드가 network에 어떻게 연결?"
//
//   초기 상태: peer 0개
//   필요: 최소 1개 known peer
//
// 해결:
//
// 1. Hardcoded Bootnodes
//    - 클라이언트에 내장
//    - 공개 접근 가능한 노드
//    - Ethereum mainnet 예:
//      * enode://..@18.138.108.67:30303 (EF)
//      * enode://..@3.209.45.79:30303 (Nethermind)
//      * ...
//
// 2. DNS Discovery (EIP-1459)
//    - DNS TXT records에 ENR 리스트
//    - enrtree://... URL
//    - 동적 노드 리스트
//
// 3. Persistent DB
//    - 이전 세션 노드 저장
//    - 재시작 시 재사용
//    - seedCount (30), seedMaxAge (5d)

// Self Lookup:
//   bootstrap 후 첫 작업
//   Target = own node ID
//   → 가까운 노드 찾기
//   → 버킷 채우기

// Random Lookup:
//   테이블 다양성 확보
//   random target으로 3회 추가 lookup
//   → 다양한 distance 범위 커버

// Refresh Cycle:
//   Timer: 15~30 min (랜덤 jitter)
//   Jitter 이유:
//     - 동시 refresh 방지
//     - Network load 분산
//     - Thundering herd 방지
//
//   Trigger:
//     - Timer expiry
//     - Bucket empty
//     - Lookup failure
//     - Manual refresh command

// Bucket Management:
//   Ping-Pong liveness check
//   Missing node → evict
//   Replacement list → promote

// Peer Churn Handling:
//   Ethereum typical churn:
//     - 노드 수천~수만
//     - Daily online: ~5000
//     - Average uptime: 12 hours
//
//   Strategy:
//     - Aggressive refresh
//     - Diverse bucket population
//     - DB fallback
//     - Continuous lookup

// 실패 복구:
//   Network partition: auto-heal via refresh
//   Mass disconnect: re-bootstrap
//   DNS failure: hardcoded fallback`}
        </pre>
      </div>
    </section>
  );
}
