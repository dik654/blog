import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function SlashingProtection({ onCodeRef }: Props) {
  return (
    <section id="slashing-protection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">슬래싱 방지 DB</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('validator-loop', codeRefs['validator-loop'])} />
          <span className="text-[10px] text-muted-foreground self-center">Run() — 슬래싱 체크 포함</span>
        </div>

        {/* ── Slashing 조건 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Slashing 조건 — 2가지</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">1. Proposer Slashing</p>
              <p className="text-sm text-foreground/80">같은 slot에 2개 다른 block 서명</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">2. Attester Slashing</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p><span className="font-semibold">Double Vote</span> — 같은 target epoch에 2개 다른 attestation</p>
                <p><span className="font-semibold">Surround Vote</span> — 범위가 이전 투표를 감싸거나 감싸임</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Surround Vote 판정 예시</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-foreground/80">
              <div>
                <p className="text-xs text-foreground/50 mb-1">안전 (no surround)</p>
                <p>Past: source=3, target=7 / Curr: source=5, target=9</p>
                <p className="text-xs text-foreground/50">3&lt;5 &amp;&amp; 9&lt;7 = FALSE</p>
              </div>
              <div>
                <p className="text-xs text-foreground/50 mb-1">슬래싱 대상 (surround!)</p>
                <p>Past: source=3, target=10 / Curr: source=5, target=8</p>
                <p className="text-xs text-foreground/50">3&lt;5 &amp;&amp; 8&lt;10 = TRUE</p>
              </div>
            </div>
            <p className="text-xs text-foreground/60 mt-2">양방향 체크 — new가 old를 감쌈 + old가 new를 감쌈</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">슬래싱 페널티</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>즉시: <code>effective_balance / 64</code> (~0.5 ETH from 32 ETH)</p>
                <p>epoch offset 후: proportional multiplier 적용</p>
                <p>최소 1 ETH 손실 + exit 강제 + 1년 withdrawal 대기</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">메인넷 슬래싱 이력</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>~400 slashing 발생 (2020-2025)</p>
                <p>대부분 운영 실수 (dual setup, key migration)</p>
                <p>악의적 공격은 거의 없음</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Slashing은 <strong>double-vote + surround-vote</strong> 2가지.<br />
          Surround vote: attestation range가 이전/이후와 겹치는 경우.<br />
          메인넷 실제 슬래싱 대부분 운영 실수 (dual setup).
        </p>

        {/* ── Slashing DB 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Slashing Protection DB — 구현 상세</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">SlashingProtectionDB 구조</p>
            <p className="text-sm text-foreground/80 mb-2"><code>db: *bolt.DB</code> — EIP-3076 compatible 독립 DB file</p>
            <p className="text-xs font-bold text-foreground/70 mb-1">버킷 구조 (pubkeys_bucket)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span><code>latest_signed_block_slot</code></span>
              <span><code>min_source_epoch</code></span>
              <span><code>max_target_epoch</code></span>
              <span><code>attestations</code> — 최근 ~1000개</span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">CheckAttestation — 서명 전 체크</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. <span className="font-semibold">Min source check</span> — <code>data.Source.Epoch &lt; min_source_epoch</code> &rarr; <code>ErrSlashable</code></p>
              <p>2. <span className="font-semibold">Max target check</span> — <code>data.Target.Epoch &lt;= max_target_epoch</code>이면 같은 epoch의 signingRoot 비교 &rarr; 다르면 <code>ErrDoubleVote</code></p>
              <p>3. <span className="font-semibold">Surround check (pairwise)</span> — past가 현재를 감쌈 &rarr; <code>ErrSurroundingVote</code> / 현재가 past를 감쌈 &rarr; <code>ErrSurroundedVote</code></p>
              <p>4. 모두 통과 &rarr; <code>nil</code> (safe)</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">RecordAttestation — 서명 후 저장</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p><code>db.Update()</code> 트랜잭션 내에서 history에 attestation 추가</p>
              <p><code>min_source_epoch</code> / <code>max_target_epoch</code> 업데이트 후 <code>history.Save(tx, pubKey)</code></p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">백업 중요성</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>DB 손실 &rarr; 새 validator처럼 시작 &rarr; double-signing 위험</p>
              <p>항상 백업 필수 (클라우드 스토리지, RAID 등)</p>
              <p>migration 시 EIP-3076 JSON export 먼저</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Slashing Protection DB</strong>가 validator 안전의 핵심.<br />
          매 서명 전 surround-vote 양방향 체크 + double-vote 확인.<br />
          DB 손실 = 재서명 위험 → 백업 필수.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 서라운드 투표 방지</strong> — source/target 범위가 이전 투표를 감싸거나 감싸이면 슬래싱 대상.<br />
          서명 전에 SlashingProtectionDB 조회로 이중 투표 + 범위 교차 확인.<br />
          EIP-3076 교환 형식으로 검증자 이전 시 슬래싱 이력 JSON 이동.
        </p>
      </div>
    </section>
  );
}
