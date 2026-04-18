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
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">문제: Light client의 block root 검증</p>
            <p className="text-sm text-foreground/80">전체 1M+ validator attestation 수집/검증 불가능 &rarr; 512명 "대표 committee" 도입 (Altair fork, 2021-10)</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Sync Committee 특성</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">512 validators</p><p className="text-foreground/50">위원회 크기</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">256 epochs</p><p className="text-foreground/50">~27시간 교대</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">매 slot 서명</p><p className="text-foreground/50">block_root BLS</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">SyncAggregate</p><p className="text-foreground/50">1 sig + 512 bits</p></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">Light client 사용 흐름</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>1. trusted sync committee snapshot 로드</p>
                <p>2. 새 <code>LightClientUpdate</code> 수신</p>
                <p>3. <code>sync_aggregate</code> 검증 (2/3+ = 341명)</p>
                <p>4. block_root attested &rarr; 신뢰</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">설계 근거</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>512 x 48 bytes = 24 KB (경량)</p>
                <p><code>FastAggregateVerify</code> ~30ms</p>
                <p>27시간: 너무 짧으면 잦은 업데이트, 너무 길면 소수 지배</p>
              </div>
            </div>
          </div>
        </div>
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
