import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
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
          Sync committee member는 active validator에서 effective balance에 가중된 sampling으로 뽑습니다. Sampling은 preset size만큼 position을 채우며 replacement를 허용하므로 같은 validator가 두 position 이상에 선정될 수 있습니다. 개별 확률은 active set과 balance distribution, 활성 fork의 effective-balance rule에 따라 달라집니다.
        </p>

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
