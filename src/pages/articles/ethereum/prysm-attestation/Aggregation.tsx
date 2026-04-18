import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Aggregation({ onCodeRef }: Props) {
  return (
    <section id="aggregation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">집계 & 서브넷</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('compute-subnet', codeRefs['compute-subnet'])} />
          <span className="text-[10px] text-muted-foreground self-center">서브넷 + 풀 조회</span>
        </div>

        {/* ── Subnet 매핑 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Attestation Subnet — 64 subnet 분산</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">computeSubnetForAttestation</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p><code>slotsSinceEpochStart = slot % SLOTS_PER_EPOCH</code></p>
              <p><code>committeesSinceEpochStart = committeesPerSlot * slotsSinceEpochStart</code></p>
              <p><code>return (committeesSinceEpochStart + committeeIndex) % 64</code></p>
            </div>
            <p className="text-xs text-foreground/60 mt-2"><code>ATTESTATION_SUBNET_COUNT = 64</code> (2^6 = 64 subnets)</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">네트워크 부하 분산</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>전체 attestation: ~30,000/slot</p>
                <p>subnet별: ~500/slot</p>
                <p>각 노드는 자기 committee subnet만 구독</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">Subnet 구독 규칙</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>기본: 자기 committee의 subnet</p>
                <p>Aggregator: 여러 subnets (blanket coverage)</p>
                <p>Fork choice용: 보통 1~3 subnets 구독</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-foreground/60">ENR <code>attnets</code> bitfield 8 bytes (64 bits) — discv5 lookup 시 peer 필터링</p>
        </div>
        <p className="leading-7">
          64 attestation subnets로 <strong>네트워크 부하 분산</strong>.<br />
          각 noode는 자기 committee subnet만 구독 → bandwidth 절약.<br />
          ENR attnets bitfield로 peer discovery 시 효율적 필터링.
        </p>

        {/* ── BLS 집계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BLS Aggregation — Aggregator 역할</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">isAggregator — 선정 로직</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. <code>DOMAIN_SELECTION_PROOF</code> 도메인으로 <code>selectionProof</code> 서명 생성</p>
              <p>2. <code>modulo = committeeLength / TARGET_AGGREGATORS_PER_COMMITTEE</code> (평균 16)</p>
              <p>3. <code>sha256(selectionProof)[:8]</code>의 uint64 값 <code>% modulo == 0</code> &rarr; aggregator</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">AggregateAndProof — 집계 수행</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. Aggregator 자격 확인</p>
              <p>2. <code>attestationsPool.GetAttestations(slot, committeeIdx)</code> — 같은 committee의 attestation 수집</p>
              <p>3. BLS signature aggregation — 각 attestation의 bit &amp; 서명을 합침 &rarr; <code>bls.Aggregate(sigs)</code> (G2 point addition)</p>
              <p>4. <code>SignedAggregateAndProof</code> 생성 — <code>AggregatorIndex</code> + <code>Aggregate</code> + <code>SelectionProof</code></p>
              <p>5. <code>pubsub.Publish("beacon_aggregate_and_proof", proof)</code> — 글로벌 토픽에 방송</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Aggregator</strong>가 committee 내 attestations 집계.<br />
          평균 16 aggregator per committee → 중복 확보.<br />
          BLS aggregation으로 N 서명 → 1 서명 (크기 N배 절약).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 BLS 집계</strong> — 같은 AttestationData를 가진 서명들의 BLS 서명을 합침.<br />
          N개 서명 → 1개 집계 서명 — 블록 크기 대폭 감소.<br />
          무작위 선정된 Aggregator가 서브넷 내 어테스테이션 수집 후 SubmitAggregateAndProof.
        </p>
      </div>
    </section>
  );
}
