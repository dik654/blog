import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PoolInclusion({ onCodeRef }: Props) {
  return (
    <section id="pool-inclusion" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">풀 관리 & 블록 포함</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('attestation-pool', codeRefs['attestation-pool'])} />
          <span className="text-[10px] text-muted-foreground self-center">Pool + SaveAggregated</span>
        </div>

        {/* ── Attestation pool 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">AttestationPool — 집계 후보 관리</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Pool 구조체</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span><code>aggregatedAttestations: map[[32]byte]*Attestation</code> — 집계 완료</span>
              <span><code>unaggregatedAttestations: map[[32]byte]*Attestation</code> — 단일 validator</span>
              <span><code>blockAttestations: []*Attestation</code> — 블록 포함 대기</span>
              <span>각각 <code>sync.RWMutex</code>로 동시성 보호</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">SaveAggregated</p><p className="text-foreground/50">집계된 것 저장</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">SaveUnaggregated</p><p className="text-foreground/50">단일 저장</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">AggregateAll</p><p className="text-foreground/50">주기적 집계</p></div>
            <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">ForInclusion</p><p className="text-foreground/50">블록 포함용 선택</p></div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">tryMerge — 집계 병합 (Boyer-Moore 기반)</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. <code>HashTreeRoot()</code> 비교 — 다른 <code>AttestationData</code>이면 병합 불가</p>
              <p>2. <code>AggregationBits.Disjoint()</code> — bit 겹침 시 병합 불가 (정당한 집계가 아님)</p>
              <p>3. <code>AggregationBits.Or()</code>로 bit 합침 + <code>bls.AggregatePublicKeys()</code>로 서명 합침</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          AttestationPool이 <strong>집계 후보 수집 & 병합</strong>.<br />
          aggregated/unaggregated 분리 관리 → efficient 선택.<br />
          disjoint bits check로 안전한 병합만 수행.
        </p>

        {/* ── 블록 포함 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Block Inclusion — 최대 128 aggregates</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">AttestationsForInclusion 흐름 (MAX_ATTESTATIONS = 128)</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. <code>GetAllAttestations()</code> — pool에서 후보 수집</p>
              <p>2. 유효 필터링 — <code>slot - 32 &lt;= att.slot &lt; slot - 1</code></p>
              <p>3. Score 계산 — <code>AggregationBits.Count() * 1000</code> (validator 수) - <code>(slot - att.Slot) * 100</code> (distance 감점)</p>
              <p>4. Greedy 선택 — score 내림차순 정렬 후 <code>coveredBits</code>와 Xor로 중복 bit 제외, 128개까지</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">보상 계산</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span><span className="font-semibold">Proposer reward</span> — 포함된 validator 수에 비례</span>
              <span><span className="font-semibold">Attester reward</span> — head/source/target 정확도 x (1/inclusion_distance)</span>
              <span><span className="font-semibold">distance 1</span> — 최대 reward</span>
              <span><span className="font-semibold">distance 32</span> — 최소 reward (거의 0)</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Block proposer가 <strong>최대 128 aggregate 선택</strong>.<br />
          validator count + inclusion distance 점수화 → greedy 선택.<br />
          최신 + 많은 validator 집계된 attestation 우선 포함.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 포함 보상 구조</strong> — 제안자는 풀에서 최대 128개의 집계 어테스테이션을 선택.<br />
          inclusion distance가 1이면 최대 보상 — 최신 어테스테이션 우선 선택.<br />
          투표자는 head/source/target 정확도, 제안자는 포함 수에 비례 보상.
        </p>
      </div>
    </section>
  );
}
