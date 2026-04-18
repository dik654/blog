import ContextViz from './viz/ContextViz';
import AttestationFlowViz from './viz/AttestationFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">어테스테이션 생명주기</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 어테스테이션 생성부터 집계, 블록 포함, 보상 수령까지의 전체 생명주기를 코드 수준으로 추적한다.
        </p>

        {/* ── Attestation 역할 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Attestation — PoS 합의의 기본 단위</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">Attestation 구조체</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p><code>aggregation_bits: Bitlist</code> — 누가 서명했는지</p>
                <p><code>data: AttestationData</code> — 투표 내용</p>
                <p><code>signature: BLSSignature</code> — 집계 서명 (96 bytes)</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">AttestationData 구조체</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p><code>slot: Slot</code> — 투표 대상 슬롯</p>
                <p><code>index: CommitteeIndex</code> — 위원회 번호</p>
                <p><code>beacon_block_root: Root</code> — head block vote</p>
                <p><code>source: Checkpoint</code> — justified checkpoint</p>
                <p><code>target: Checkpoint</code> — justify 대상</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">3가지 투표 (per attestation)</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">beacon_block_root</p><p className="text-foreground/50">LMD-GHOST input</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">source</p><p className="text-foreground/50">이미 justified</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">target</p><p className="text-foreground/50">Casper FFG</p></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">Committee 할당</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>매 slot마다 active validator를 committee에 배정</p>
                <p>메인넷: ~30,000 attestation/slot</p>
                <p>1 epoch에 정확히 1번 attestation 생성</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">Attestation의 역할</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>Fork choice 입력 (LMD-GHOST)</p>
                <p>Justification/Finalization (Casper FFG)</p>
                <p>Validator reward 기반</p>
                <p>슬래싱 증거 (double-vote 감지)</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Attestation은 <strong>3가지 투표 동시 포함</strong>.<br />
          beacon_block_root + source + target → fork choice + finality.<br />
          매 validator epoch당 1번 → 슬롯당 ~30K attestation.
        </p>

        {/* ── 생명주기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Attestation 생명주기 — 10단계</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">생명주기 10단계</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p><span className="font-semibold">1. Committee assignment</span> — epoch 시작 시 (slot N, committee_index C) 결정</p>
              <p><span className="font-semibold">2. Attestation 준비 (t=4s)</span> — head 조회, source/target checkpoint 결정</p>
              <p><span className="font-semibold">3. Slashing protection 체크</span> — 로컬 DB에서 double-vote / surround-vote 방지</p>
              <p><span className="font-semibold">4. Attestation 서명</span> — <code>DOMAIN_BEACON_ATTESTER</code>로 BLS 서명</p>
              <p><span className="font-semibold">5. Subnet publish (t=4s)</span> — <code>beacon_attestation_&#123;subnet&#125;</code> 토픽에 자기 bit만 set하여 방송</p>
              <p><span className="font-semibold">6. Aggregator 수집 (t=8s)</span> — 무작위 선정 validator가 committee attestations 수집 &rarr; BLS 집계</p>
              <p><span className="font-semibold">7. Aggregate 방송 (t=8s)</span> — <code>beacon_aggregate_and_proof</code> 토픽</p>
              <p><span className="font-semibold">8. Block inclusion (slot N+1+)</span> — proposer가 최대 128 aggregates를 block body에 포함</p>
              <p><span className="font-semibold">9. State transition</span> — <code>processAttestation</code> 실행, participation flag 설정</p>
              <p><span className="font-semibold">10. Rewards (epoch 경계)</span> — source/target/head vote 정확도별 reward</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">t=0s</p><p className="text-foreground/50">slot 시작</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">t=4s</p><p className="text-foreground/50">서명 &amp; 방송</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">t=8s</p><p className="text-foreground/50">aggregate 방송</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">t=12s</p><p className="text-foreground/50">slot N+1 시작</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">N+1~N+32</p><p className="text-foreground/50">블록 포함 기회</p></div>
          </div>
        </div>
        <p className="leading-7">
          Attestation <strong>10단계 생명주기</strong>.<br />
          assignment → 서명 → 방송 → 집계 → block 포함 → 보상.<br />
          생성~보상까지 최대 1 epoch 소요 (~6.4분).
        </p>
      </div>
      <div className="not-prose mt-6"><AttestationFlowViz /></div>
    </section>
  );
}
