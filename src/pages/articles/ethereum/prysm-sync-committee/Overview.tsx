import ContextViz from './viz/ContextViz';
import SyncCommitteeViz from './viz/SyncCommitteeViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">싱크 위원회 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 싱크 위원회 선정, 매 슬롯 서명, 라이트 클라이언트 증명 생성 과정을 코드 수준으로 추적한다.
        </p>

        {/* ── Sync Committee 배경 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Sync Committee — light client 지원 (Altair+)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sync Committee (Altair fork, 2021-10)
// Light client의 가벼운 consensus verification 제공

// 문제: Light client가 block root 검증 방법?
// - 전체 validator attestation 수집 → 불가능 (100만+)
// - 모든 attestation 검증 → 너무 많은 BLS 연산
// → 512명의 "대표 committee" 도입

// Sync Committee 특성:
// - 크기: 512 validators
// - 교대 주기: 256 epochs (~27시간)
// - 역할: 매 slot block_root에 BLS 서명
// - 서명 집계: SyncAggregate (1 BLS signature + 512 bit flags)

// Light client 사용:
// 1. trusted sync committee snapshot 로드
// 2. 새 LightClientUpdate 수신
// 3. update.sync_aggregate 검증 (512 validators 2/3+ 서명)
// 4. block_root가 attested 되었으면 신뢰

// 왜 512명?
// - 512 × 48 bytes (pubkey) = 24 KB (경량)
// - BLS FastAggregateVerify로 빠른 검증 (~30ms)
// - 2/3 supermajority = 341 validators로 안전

// 27시간 주기:
// - 8192 slots × 12초 = 27시간
// - 너무 짧으면 committee 업데이트 자주 필요
// - 너무 길면 소수 validator 지배 위험`}
        </pre>
        <p className="leading-7">
          Sync Committee는 <strong>light client 전용 validator 대표단</strong>.<br />
          512명 × 27시간 임기로 block root 서명 제공.<br />
          light client가 sync committee 서명만 검증 → 가벼운 trust.
        </p>
      </div>
      <div className="not-prose mt-6"><SyncCommitteeViz /></div>
    </section>
  );
}
