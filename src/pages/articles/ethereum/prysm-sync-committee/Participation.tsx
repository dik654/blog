import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Participation({ onCodeRef }: Props) {
  return (
    <section id="participation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">위원회 참여 & 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('submit-sync-msg', codeRefs['submit-sync-msg'])} />
          <span className="text-[10px] text-muted-foreground self-center">SubmitSyncCommitteeMessage()</span>
        </div>

        {/* ── Committee 선정 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Sync Committee 선정 알고리즘</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">getNextSyncCommittee 흐름</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. <code>epoch = getCurrentEpoch + EPOCHS_PER_SYNC_COMMITTEE_PERIOD</code> (256) — 미리 알려짐</p>
              <p>2. <code>getSeed(state, epoch, DOMAIN_SYNC_COMMITTEE)</code> — RANDAO 기반 seed</p>
              <p>3. 512명 무작위 선정 (effective_balance 가중)</p>
              <p className="pl-4 text-foreground/60"><code>randomByte = hash(seed || (i/32))[i%32]</code></p>
              <p className="pl-4 text-foreground/60"><code>effectiveBalance * 255 &gt;= MAX_EFFECTIVE_BALANCE * randomByte</code> &rarr; 선정</p>
              <p>4. 선정된 pubkeys + <code>bls.Aggregate(pubkeys)</code> &rarr; <code>SyncCommittee</code> 구성</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">32 ETH</p><p className="text-foreground/50">100% 선정 확률</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">낮은 balance</p><p className="text-foreground/50">낮은 확률</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">중복 허용</p><p className="text-foreground/50">같은 validator 복수</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">~0.05%</p><p className="text-foreground/50">개별 확률/period</p></div>
          </div>
        </div>
        <p className="leading-7">
          Sync committee는 <strong>effective_balance 가중 무작위 선정</strong>.<br />
          512명 중복 허용 → 같은 validator 여러 번 선정 가능.<br />
          validator당 ~0.05% 확률 per 27시간.
        </p>

        {/* ── SyncCommitteeMessage ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">매 slot SyncCommitteeMessage 서명</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">SubmitSyncCommitteeMessage 흐름</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. <code>getSyncCommitteeSubnets(slot)</code> — 멤버 확인 (0이면 참여 안 함)</p>
              <p>2. <code>GetHead(ctx)</code> — 현재 head block_root 조회</p>
              <p>3. <code>computeSigningRoot(head.Root, getDomain(DOMAIN_SYNC_COMMITTEE, epoch))</code></p>
              <p>4. <code>keyManager.Sign(pubkey, signingRoot)</code> — BLS 서명</p>
              <p>5. 각 subnet별 <code>SyncCommitteeMessage</code> 생성 &rarr; <code>pubsub.Publish("sync_committee_&#123;subnet&#125;", msg)</code></p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">Domain 분리</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p><code>DOMAIN_SYNC_COMMITTEE</code> ≠ <code>DOMAIN_BEACON_ATTESTER</code></p>
                <p>같은 block_root에 attestation + sync 서명 2개 (독립)</p>
                <p>서로 간섭 없음</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">보상 & 패널티</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>참여: <code>base_reward_per_increment x effective_balance</code></p>
                <p>미참여: 동일 금액 차감</p>
                <p>참여 인센티브로 높은 참여율 유지</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Committee 멤버는 <strong>매 slot head block에 서명</strong>.<br />
          DOMAIN_SYNC_COMMITTEE로 attestation과 구분.<br />
          4개 subnet에 방송 → aggregator가 수집 → block에 포함.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 서명 도메인 분리</strong> — DomainSyncCommittee는 어테스테이션(DOMAIN_BEACON_ATTESTER)과 다른 도메인.<br />
          같은 블록 루트에 대해 두 가지 서명이 생성되지만 도메인이 달라 충돌하지 않음.<br />
          256에폭(~27시간) 주기로 위원회 교체 — 중복 선정 허용.
        </p>
      </div>
    </section>
  );
}
