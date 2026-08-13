import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Aggregation({ onCodeRef }: Props) {
  return (
    <section id="aggregation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">집계 & 서브넷</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("compute-subnet", codeRefs["compute-subnet"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            서브넷 + 풀 조회
          </span>
        </div>

        {/* ── Subnet 매핑 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Attestation Subnet — 64 subnet 분산
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              computeSubnetForAttestation
            </p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>
                <code>slotsSinceEpochStart = slot % SLOTS_PER_EPOCH</code>
              </p>
              <p>
                <code>
                  committeesSinceEpochStart = committeesPerSlot *
                  slotsSinceEpochStart
                </code>
              </p>
              <p>
                <code>
                  return (committeesSinceEpochStart + committeeIndex) % 64
                </code>
              </p>
            </div>
            <p className="text-xs text-foreground/60 mt-2">
              <code>ATTESTATION_SUBNET_COUNT = 64</code> (2^6 = 64 subnets)
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                네트워크 부하 분산
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>committee vote를 subnet별 gossip topic으로 분산</p>
                <p>
                  실제 메시지 수는 활성 validator·집계율·네트워크 상태에 따라
                  변함
                </p>
                <p>validator duty와 long-lived subnet 구독을 구분</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                Subnet 구독 규칙
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>기본: 자기 committee의 subnet</p>
                <p>Aggregator: 배정된 committee/subnet에서 aggregate 생성</p>
                <p>노드는 custody·구현 정책에 맞춰 필요한 topic을 구독</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-foreground/60">
            ENR <code>attnets</code> bitfield 8 bytes (64 bits) — discv5 lookup
            시 peer 필터링
          </p>
        </div>
        <p className="leading-7">
          Attestation gossip을 64개 subnet으로 나누면 모든 노드가 모든 단일
          투표를 받을 필요가 없다. 노드는 duty와 구독 정책에 맞는 subnet을
          선택하고, ENR의 <code>attnets</code> bitfield를 이용해 필요한 peer를
          찾는다.
        </p>

        {/* ── BLS 집계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          BLS Aggregation — Aggregator 역할
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              isAggregator — 선정 로직
            </p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>
                1. <code>DOMAIN_SELECTION_PROOF</code> 도메인으로{" "}
                <code>selectionProof</code> 서명 생성
              </p>
              <p>
                2.{" "}
                <code>
                  modulo = committeeLength / TARGET_AGGREGATORS_PER_COMMITTEE
                </code>{" "}
                (평균 16)
              </p>
              <p>
                3. <code>sha256(selectionProof)[:8]</code>의 uint64 값{" "}
                <code>% modulo == 0</code> &rarr; aggregator
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              AggregateAndProof — 집계 수행
            </p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. Aggregator 자격 확인</p>
              <p>
                2.{" "}
                <code>
                  attestationsPool.GetAttestations(slot, committeeIdx)
                </code>{" "}
                — 같은 committee의 attestation 수집
              </p>
              <p>
                3. BLS signature aggregation — 각 attestation의 bit &amp; 서명을
                합침 &rarr; <code>bls.Aggregate(sigs)</code> (G2 point addition)
              </p>
              <p>
                4. <code>SignedAggregateAndProof</code> 생성 —{" "}
                <code>AggregatorIndex</code> + <code>Aggregate</code> +{" "}
                <code>SelectionProof</code>
              </p>
              <p>
                5.{" "}
                <code>pubsub.Publish("beacon_aggregate_and_proof", proof)</code>{" "}
                — 글로벌 토픽에 방송
              </p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Aggregator</strong>는 같은 committee와
          <code>AttestationData</code>를 가리키는 단일 투표를 모아 하나의 BLS
          aggregate signature로 만든다. 프로토콜은 committee마다 목표
          aggregator 수를 두어 중복 경로를 확보하며, 참여자 수가 늘어도 서명
          필드는 고정 크기로 유지된다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 BLS 집계</strong> — 같은 AttestationData를 가진 서명들의
          BLS 서명을 합치고 participation bitlist로 서명자를 나타낸다. 선정된
          aggregator는 subnet의 attestation을 수집한 뒤
          <code>SubmitAggregateAndProof</code> 경로로 집계 결과를 전파한다.
        </p>
      </div>
    </section>
  );
}
