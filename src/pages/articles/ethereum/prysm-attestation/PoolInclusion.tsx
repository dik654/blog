import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function PoolInclusion({ onCodeRef }: Props) {
  return (
    <section id="pool-inclusion" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">풀 관리 & 블록 포함</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("attestation-pool", codeRefs["attestation-pool"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            Pool + SaveAggregated
          </span>
        </div>

        {/* ── Attestation pool 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          AttestationPool — 집계 후보 관리
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              Pool 구조체
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span>
                <code>aggregatedAttestations: map[[32]byte]*Attestation</code> —
                집계 완료
              </span>
              <span>
                <code>unaggregatedAttestations: map[[32]byte]*Attestation</code>{" "}
                — 단일 validator
              </span>
              <span>
                <code>blockAttestations: []*Attestation</code> — 블록 포함 대기
              </span>
              <span>
                각각 <code>sync.RWMutex</code>로 동시성 보호
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">SaveAggregated</p>
              <p className="text-foreground/50">집계된 것 저장</p>
            </div>
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">
                SaveUnaggregated
              </p>
              <p className="text-foreground/50">단일 저장</p>
            </div>
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">AggregateAll</p>
              <p className="text-foreground/50">주기적 집계</p>
            </div>
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">ForInclusion</p>
              <p className="text-foreground/50">블록 포함용 선택</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              tryMerge — 집계 병합 (Boyer-Moore 기반)
            </p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>
                1. <code>HashTreeRoot()</code> 비교 — 다른{" "}
                <code>AttestationData</code>이면 병합 불가
              </p>
              <p>
                2. <code>AggregationBits.Disjoint()</code> — bit 겹침 시 병합
                불가 (정당한 집계가 아님)
              </p>
              <p>
                3. <code>AggregationBits.Or()</code>로 bit 합침 +{" "}
                <code>bls.AggregatePublicKeys()</code>로 서명 합침
              </p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          AttestationPool은 집계 전후의 attestation을 나누어 보관하기 때문에,
          블록 제안 시점에 다시 사용할 후보를 빠르게 찾을 수 있다. 병합할 때는
          같은 <code>AttestationData</code>인지 확인한 뒤 participation bit가
          겹치지 않는 경우에만 bitlist와 BLS 서명을 합친다.
        </p>

        {/* ── 블록 포함 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Block Inclusion — fork별 공간 제약
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              AttestationsForInclusion 흐름
            </p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>
                1. <code>GetAllAttestations()</code> — pool에서 후보 수집
              </p>
              <p>
                2. 현재 fork의 inclusion window와 상태 기준으로 유효 후보 필터링
              </p>
              <p>
                3. 아직 덮지 않은 participant, 적시성, 예상 reward를 구현
                정책으로 점수화
              </p>
              <p>
                4. 중복 participation을 제거하며 현재 block schema의{" "}
                <code>MAX_ATTESTATIONS</code>까지 선택
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              보상 계산
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span>
                <span className="font-semibold">Proposer reward</span> — 포함된
                validator 수에 비례
              </span>
              <span>
                <span className="font-semibold">Attester reward</span> —
                source/target/head 적시성 flag에 따라 계산
              </span>
              <span>
                <span className="font-semibold">Inclusion delay</span> — fork별
                timely flag 조건에 반영
              </span>
              <span>
                <span className="font-semibold">Schema</span> — Electra 등에서
                attestation 표현과 상한이 달라짐
              </span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Block proposer가{" "}
          <strong>현재 fork의 operation limit 안에서 aggregate를 선택</strong>
          한다. 이때 단순히 가장 최근 메시지를 고르는 것이 아니라, 이미 포함된
          participation과의 중복을 피하면서 새 validator를 더 많이 덮고 적시성
          조건을 만족하는 후보를 우선한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 포함 보상 구조</strong> — 제안자는 fork별 상한까지 집계
          attestation을 선택하며,
          포함 지연은 timely source/target/head 규칙과 proposer reward에 영향을
          준다. 따라서 투표자의 정확도와 제안자의 선택 정책을 함께 봐야 실제
          보상 흐름을 이해할 수 있다.
        </p>
      </div>
    </section>
  );
}
