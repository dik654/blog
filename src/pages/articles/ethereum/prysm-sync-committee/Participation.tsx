import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Participation({ onCodeRef }: Props) {
  return (
    <section id="participation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">위원회 참여 & 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("submit-sync-msg", codeRefs["submit-sync-msg"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            SubmitSyncCommitteeMessage()
          </span>
        </div>

        {/* ── Committee 선정 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Sync Committee 선정 알고리즘
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              getNextSyncCommittee 흐름
            </p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>
                1. 현재 epoch를 <code>EPOCHS_PER_SYNC_COMMITTEE_PERIOD</code>에
                맞춰 다음 period로 변환
              </p>
              <p>
                2. <code>getSeed(state, epoch, DOMAIN_SYNC_COMMITTEE)</code> —
                RANDAO 기반 seed
              </p>
              <p>
                3. <code>SYNC_COMMITTEE_SIZE</code>만큼 effective balance 가중
                표본 추출
              </p>
              <p className="pl-4 text-foreground/60">
                <code>randomByte = hash(seed || (i/32))[i%32]</code>
              </p>
              <p className="pl-4 text-foreground/60">
                <code>
                  effectiveBalance * 255 &gt;= MAX_EFFECTIVE_BALANCE *
                  randomByte
                </code>{" "}
                &rarr; 선정
              </p>
              <p>
                4. 선정된 pubkeys + <code>bls.Aggregate(pubkeys)</code> &rarr;{" "}
                <code>SyncCommittee</code> 구성
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">
                effective balance
              </p>
              <p className="text-foreground/50">fork별 상한까지 가중</p>
            </div>
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">낮은 balance</p>
              <p className="text-foreground/50">낮은 확률</p>
            </div>
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">중복 허용</p>
              <p className="text-foreground/50">같은 validator 복수</p>
            </div>
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">동적 확률</p>
              <p className="text-foreground/50">활성 집합·balance 의존</p>
            </div>
          </div>
        </div>
        <p>
          Sync committee member는 active validator에서 effective balance에 가중된 sampling으로 뽑습니다. Sampling은 preset
          size만큼 position을 채우면서 replacement를 허용하므로 같은 validator가 두 position 이상에 선정될 수 있습니다. 개별 확률은 active set과
          balance distribution, 활성 fork의 effective-balance rule이 함께 정합니다.
        </p>

        <ExplainedFormula
          question="같은 block root에 대한 attestation 서명을 sync-committee 서명으로 재사용하지 못하게 하려면 무엇이 달라야 할까요?"
          idea={<>객체 root에 역할과 fork를 담은 domain을 결합한 signing root를 만든 뒤 BLS로 서명합니다.</>}
          formula={String.raw`\begin{aligned}
R_{sign}&=\operatorname{HTR}(\\&\quad R_{block},D_{sync})\\
\sigma&=\operatorname{BLS.Sign}(\\&\quad sk,R_{sign})
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
R_{sign}&=\underbrace{\operatorname{HTR}(}_{\text{signing root 계산}}\\&\quad R_{block},D_{sync})\\
\sigma&=\underbrace{\operatorname{BLS.Sign}(}_{\text{BLS signature 계산}}\\&\quad sk,R_{sign})
\end{aligned}`}
          operations={[
            { expression: String.raw`\operatorname{HTR}(`, annotation: ["signing root이(가) 식의 결과에 기여하는 방식을","계산합니다.","객체 root에 역할과 fork를 담은 domain을 결합한","signing root를 만든 뒤 BLS로 서명합니다."] },
            { expression: String.raw`\operatorname{BLS.Sign}(`, annotation: ["BLS signature이(가) 식의 결과에 기여하는 방식을","계산합니다.","객체 root에 역할과 fork를 담은 domain을 결합한","signing root를 만든 뒤 BLS로 서명합니다."] },
          ]}
          terms={[
            { symbol: "R_{block}", name: "beacon block root", description: "위원회 구성원이 관찰한 32-byte head root입니다." },
            { symbol: "D_{sync}", name: "sync domain", description: "DOMAIN_SYNC_COMMITTEE와 fork/genesis context로 만든 32-byte domain입니다." },
            { symbol: "R_{sign}", name: "signing root", description: "SSZ SigningData의 32-byte hash-tree-root입니다." },
            { symbol: "sk", name: "validator secret key", description: "외부에 공개하지 않는 BLS scalar key입니다." },
            { symbol: "\\sigma", name: "BLS signature", description: "Validator secret key가 만든 96-byte 서명입니다." },
          ]}
          assumptions={["신뢰한 fork schedule과 genesis validators root로 domain을 계산합니다.", "서명 검증 성공은 해당 root에 대한 위원회 표를 뜻하며 full state transition이나 finality를 단독 증명하지 않습니다."]}
          interpretation="block root가 같아도 attester domain과 sync domain이 다르면 signing root와 signature가 달라져 역할 간 replay가 차단됩니다."
        />

        {/* ── SyncCommitteeMessage ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          매 slot SyncCommitteeMessage 서명
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              SubmitSyncCommitteeMessage 흐름
            </p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>
                1. <code>getSyncCommitteeSubnets(slot)</code> — 멤버 확인 (0이면
                참여 안 함)
              </p>
              <p>
                2. <code>GetHead(ctx)</code> — 현재 head block_root 조회
              </p>
              <p>
                3.{" "}
                <code>
                  computeSigningRoot(head.Root, getDomain(DOMAIN_SYNC_COMMITTEE,
                  epoch))
                </code>
              </p>
              <p>
                4. <code>keyManager.Sign(pubkey, signingRoot)</code> — BLS 서명
              </p>
              <p>
                5. 각 subnet별 <code>SyncCommitteeMessage</code> 생성 &rarr;{" "}
                <code>
                  pubsub.Publish("sync_committee_&#123;subnet&#125;", msg)
                </code>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                Domain 분리
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>
                  <code>DOMAIN_SYNC_COMMITTEE</code> ≠{" "}
                  <code>DOMAIN_BEACON_ATTESTER</code>
                </p>
                <p>같은 block_root에 attestation + sync 서명 2개 (독립)</p>
                <p>서로 간섭 없음</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                보상 & 패널티
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>
                  참여·미참여 delta는 해당 fork의 sync committee reward 계산을
                  따름
                </p>
                <p>제안자 보상과 참가자 보상을 분리해 계산</p>
                <p>
                  고정 금액이 아니라 총 활성 balance와 preset 상수에 영향받음
                </p>
              </div>
            </div>
          </div>
        </div>
        <p>
          Committee member는 매 slot 자신이 보는 beacon block root에 <code>DOMAIN_SYNC_COMMITTEE</code>로 서명합니다. 이 domain이 attestation signature와 replay domain을 분리하며, signature는 assigned sync-committee subnet에서 전파되어 aggregator contribution과 block의 <code>SyncAggregate</code>로 이어집니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 서명 도메인 분리</strong> — DomainSyncCommittee는
          attestation의 <code>DOMAIN_BEACON_ATTESTER</code>와 다릅니다. 같은 block root에 서명하더라도 signing root가 달라 signature를 다른 역할에 재사용할 수 없습니다. Committee size와 period는 preset에서 읽으며 동일 validator의 중복 position을 허용합니다.
        </p>
      </div>
    </section>
  );
}
