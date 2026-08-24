import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
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
          Attestation subnet — mainnet preset의 64개 topic
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

        <ExplainedFormula
          question="Slot 35의 committee 2 투표는 64개 attestation subnet 중 어디로 갈까요?"
          idea={<>Epoch 안에서 먼저 지난 committee 수를 세고 현재 committee index를 더한 뒤 subnet 수로 나눈 나머지를 씁니다.</>}
          formula={String.raw`\begin{aligned}u&=c\,(s\bmod S)+j\\s_{net}&=u\bmod N\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}u&=\underbrace{c\,(s\bmod S)+j}_{\text{slot 계산}}\\s_{net}&=\underbrace{u\bmod N}_{\text{slot 계산}}\end{aligned}`}
          operations={[
            { expression: String.raw`c\,(s\bmod S)+j`, annotation: ["slot이(가) 식의 결과에 기여하는 방식을 계산합니다.","Epoch 안에서 먼저 지난 committee 수를 세고 현재","committee index를 더한 뒤 subnet 수로 나눈","나머지를 씁니다."] },
            { expression: String.raw`u\bmod N`, annotation: ["slot이(가) 식의 결과에 기여하는 방식을 계산합니다.","Epoch 안에서 먼저 지난 committee 수를 세고 현재","committee index를 더한 뒤 subnet 수로 나눈","나머지를 씁니다."] },
          ]}
          terms={[
            { symbol: "s", name: "slot", description: "투표 duty의 slot 번호입니다." },
            { symbol: "S", name: "slots per epoch", description: "network preset의 epoch당 slot 수입니다." },
            { symbol: "c", name: "committees per slot", description: "해당 target epoch에서 slot마다 배치되는 committee 수입니다." },
            { symbol: "j", name: "committee index", description: "그 slot 안의 committee 번호입니다." },
            { symbol: "N", name: "attestation subnet count", description: "Phase 0 mainnet 설정에서 64인 subnet 수입니다." },
          ]}
          assumptions={["Phase 0 형태의 index field를 설명합니다. 활성 fork가 committee_bits 등 schema와 mapping을 바꾸면 그 함수를 사용합니다.", "예시에서 S=32, c=4, s=35, j=2, N=64이면 (4×3+2) mod 64=14입니다."]}
          interpretation="Subnet은 투표의 의미나 유효성을 바꾸지 않고 gossip 부하만 분산합니다. 같은 AttestationData끼리만 집계할 수 있다는 조건도 그대로 남습니다."
        />

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

        <ExplainedFormula
          question="Committee 크기가 달라도 평균 aggregator 수를 비슷하게 유지하려면 어떻게 고를까요?"
          idea={<>Validator가 slot selection proof에 먼저 서명하고 그 hash를 modulo test에 넣습니다. 개인키를 모르는 다른 참여자는 결과를 조작하기 어렵지만 proof를 받아 자격은 검증할 수 있습니다.</>}
          formula={String.raw`\begin{aligned}
m&=\max\!\left(1,\left\lfloor\frac{n}{A}\right\rfloor\right)\\
h&=\operatorname{u64}\!\left(H(\sigma)_{0:8}\right)\\
h\bmod m&=0
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
m&=\underbrace{\max\!\left(1,\left\lfloor\frac{n}{A}\right\rfloor\right)}_{\text{기준량당 비율}}\\
h&=\underbrace{\operatorname{u64}\!\left(H(\sigma)_{\underbrace{0}_{\text{selection modulo 계산}}:8}\right)}_{\text{허용 경계 판정}}\\
h\bmod m&=0
\end{aligned}`}
          operations={[
            { expression: String.raw`\max\!\left(1,\left\lfloor\frac{n}{A}\right\rfloor\right)`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Validator가 slot selection proof에","먼저 서명하고 그 hash를 modulo test에 넣습니다."] },
            { expression: String.raw`\operatorname{u64}\!\left(H(\sigma)_{0:8}\right)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","Validator가 slot selection proof에","먼저 서명하고 그 hash를 modulo test에 넣습니다."] },
            { expression: String.raw`0`, annotation: ["selection modulo이(가) 식의 결과에 기여하는","방식을 계산합니다.","Validator가 slot selection proof에","먼저 서명하고 그 hash를 modulo test에 넣습니다."] },
          ]}
          terms={[
            { symbol: "n", name: "committee size", description: "이 slot·committee에 배정된 validator 수, 단위는 명입니다." },
            { symbol: "A", name: "target aggregators", description: "v1.6.1에서 committee당 목표 16명입니다." },
            { symbol: "m", name: "selection modulo", description: "최소 1인 정수 나눗셈 결과입니다." },
            { symbol: "h", name: "proof hash integer", description: "Selection proof hash의 앞 8 bytes를 uint64로 읽은 값입니다." },
            { symbol: "\\sigma", name: "selection proof", description: "DOMAIN_SELECTION_PROOF로 slot에 서명한 96-byte BLS signature입니다." },
          ]}
          assumptions={["Hash 결과가 충분히 균등하고 selection proof의 domain·slot·public key를 검증합니다.", "목표값은 평균이며 정확히 A명이 선택된다는 뜻은 아닙니다."]}
          interpretation="n=128, A=16이면 m=8이므로 각 validator가 약 1/8 확률로 선택되어 기대 aggregator 수가 16입니다."
        />

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
