import RelayChainViz from './viz/RelayChainViz';
import CodePanel from '@/components/ui/code-panel';

const RELAY_CODE = `// Polkadot 릴레이 체인 핵심 구성
// 1. 검증자 (Validators)
- 파라체인 블록(PoV) 검증
- GRANDPA 파이널리티 투표
- 에라(Era) 단위 선출 (NPoS)

// 2. 콜레이터 (Collators)
- 파라체인 트랜잭션 수집
- PoV 블록 생성 → 릴레이 체인 제출
- Cumulus 라이브러리 기반

// 3. 파라체인 슬롯
- 경매(Auction)로 슬롯 획득
- 최대 100개 파라체인 동시 운영
- Parathreads: 온디맨드 블록 생성

// 4. 공유 보안 (Shared Security)
- 모든 파라체인이 릴레이 체인 보안 공유
- 개별 보안 부트스트래핑 불필요
- 검증자가 랜덤 배정 → 담합 방지`;

export default function RelayChain({ title }: { title?: string }) {
  return (
    <section id="relay-chain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Polkadot 릴레이체인'}</h2>
      <div className="not-prose mb-8">
        <RelayChainViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Polkadot 릴레이 체인 — 파라체인에 <strong>공유 보안</strong> 제공하는 중앙 허브<br />
          검증자가 파라체인 블록(PoV) 검증 → GRANDPA로 파이널리티 확보<br />
          NPoS로 검증자 선출, 개별 체인의 독립 보안 확보 필요 제거
        </p>
        <CodePanel
          title="릴레이 체인 핵심 구성요소"
          code={RELAY_CODE}
          annotations={[
            { lines: [2, 5], color: 'sky', note: '검증자: PoV 검증 + GRANDPA' },
            { lines: [7, 10], color: 'emerald', note: '콜레이터: 파라체인 블록 생성' },
            { lines: [12, 15], color: 'amber', note: '슬롯 경매 & Parathreads' },
            { lines: [17, 20], color: 'violet', note: '공유 보안 메커니즘' },
          ]}
        />
      </div>
    </section>
  );
}
