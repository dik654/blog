import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function AttestationCreation({ onCodeRef }: Props) {
  return (
    <section id="attestation-creation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">생성 & 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('submit-attestation', codeRefs['submit-attestation'])} />
          <span className="text-[10px] text-muted-foreground self-center">SubmitAttestation()</span>
        </div>

        {/* ── validator attestation 생성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Validator 측 — attestation 생성</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">SubmitAttestation 흐름 (attest.go)</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. <code>duties.AttesterDuty(pubKey, slot)</code> — committee 정보 조회 (beacon-chain RPC)</p>
              <p>2. <code>GetAttestationData(slot, committeeIndex)</code> — head + source/target checkpoint 결정</p>
              <p>3. <code>slashingDB.CheckAttestationSafety(pubKey, signingRoot, data)</code> — slashing 위험 시 거부</p>
              <p>4. <code>keyManager.Sign(pubKey, signingRoot)</code> — BLS 서명 생성</p>
              <p>5. <code>bitfield.NewBitlist(committeeLength)</code> — 자기 committee 내 위치의 bit만 true</p>
              <p>6. <code>Attestation&#123;AggregationBits, Data, Signature&#125;</code> 구성</p>
              <p>7. <code>slashingDB.SaveAttestation(pubKey, data)</code> — 재서명 방지 기록</p>
              <p>8. <code>ProposeAttestation(ctx, attestation)</code> — beacon-chain에 제출</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">t=4s</p><p className="text-foreground/50">실행 시점</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">4초 대기</p><p className="text-foreground/50">block propagation</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">t&lt;12s</p><p className="text-foreground/50">slot 종료 전 필수</p></div>
          </div>
        </div>
        <p className="leading-7">
          Validator가 매 slot <strong>committee 내 자기 bit만 set</strong> → attestation 생성.<br />
          Slashing DB 체크 → BLS 서명 → beacon-chain 제출.<br />
          4초 타이밍으로 block propagation 대기 후 head 결정.
        </p>

        {/* ── Slashing protection DB ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Slashing Protection — EIP-3076</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Slashing 조건 (attestation)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-foreground/80">
              <div><span className="font-semibold">Double vote</span> — 같은 target epoch에 두 번 서명</div>
              <div><span className="font-semibold">Surround vote</span> — <code>source_a &lt; source_b AND target_b &lt; target_a</code></div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">CheckAttestationSafety 흐름</p>
            <p className="text-sm text-foreground/80 mb-2"><code>SlashingProtectionDB</code> — <code>db: *bolt.DB</code> (validator 전용 독립 DB)</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. <code>getAttestationHistory(pubKey)</code> — 과거 attestation 조회</p>
              <p>2. <span className="font-semibold">Double-vote 체크</span> — 같은 <code>TargetEpoch</code>에 다른 <code>SigningRoot</code> &rarr; <code>ErrDoubleVote</code></p>
              <p>3. <span className="font-semibold">Surrounded vote 체크</span> — past가 현재를 감쌈 &rarr; <code>ErrSurroundingVote</code> / 현재가 past를 감쌈 &rarr; <code>ErrSurroundedVote</code></p>
              <p>4. 모두 통과 &rarr; <code>nil</code> (안전)</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">EIP-3076 Import/Export</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>JSON 포맷으로 다른 클라이언트와 migration</p>
                <p>pubkey별 <code>min_source_epoch</code>, <code>max_target_epoch</code> 저장</p>
                <p>client 교체 시 이 DB만 옮기면 안전</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">중요성</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>slashing 시 최소 1 ETH 손실 + strike out</p>
                <p>Protection DB 손실 &rarr; validator 재시작 위험</p>
                <p>항상 백업 유지 필수</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Slashing protection DB</strong>가 validator 안전의 핵심.<br />
          double-vote, surround-vote 2가지 slash 조건 사전 검증.<br />
          EIP-3076 포맷으로 client 간 이식 가능.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 3중 투표 구조</strong> — Source(이전 justified), Target(현재 에폭), Head(헤드 블록).<br />
          슬래싱 방지 DB를 먼저 조회하여 이중 투표/서라운드 투표 차단.<br />
          서명 도메인은 DOMAIN_BEACON_ATTESTER 사용.
        </p>
      </div>
    </section>
  );
}
