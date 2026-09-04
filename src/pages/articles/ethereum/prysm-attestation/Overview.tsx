import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ContextViz from "./viz/ContextViz";
import AttestationFlowViz from "./viz/AttestationFlowViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Attestation은 validator 관찰에서 fork choice weight까지 이어진다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 글은 “검증자 한 명이 본 head가 어떻게 네트워크의 합의 입력이 되는가?”에서 시작합니다. 같은 한 표 안의 head·source·target을 구분하고 duty의
          dependent root, signing domain, subnet, aggregation bits를 고정한 사례 하나로 끝까지 추적합니다.
        </p>
        <p className="leading-7">
          어테스테이션은 head 선택과 finality에 함께 쓰이지만 두 판단은 같지
          않습니다. 가중치 계산은 <Link to="/blockchain/prysm-forkchoice">fork choice</Link>,
          checkpoint 규칙은 <Link to="/blockchain/prysm-finality">finality</Link>,
          double/surround vote 방지는 <Link to="/blockchain/prysm-validator-client#slashing-protection">validator slashing protection</Link> 정본으로 이어집니다.
        </p>

        {/* ── Attestation 역할 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Attestation — PoS 합의의 기본 단위
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                Attestation 구조체
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>
                  <code>aggregation_bits: Bitlist</code> — 누가 서명했는지
                </p>
                <p>
                  <code>data: AttestationData</code> — 투표 내용
                </p>
                <p>
                  <code>signature: BLSSignature</code> — 집계 서명 (96 bytes)
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                AttestationData 구조체
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>
                  <code>slot: Slot</code> — 투표 대상 슬롯
                </p>
                <p>
                  <code>index / committee_bits</code> — 위원회 식별 방식은
                  fork별 스키마에 따름
                </p>
                <p>
                  <code>beacon_block_root: Root</code> — head block vote
                </p>
                <p>
                  <code>source: Checkpoint</code> — justified checkpoint
                </p>
                <p>
                  <code>target: Checkpoint</code> — justify 대상
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              3가지 투표 (per attestation)
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="rounded border border-border/40 p-2">
                <p className="text-foreground/70 font-semibold">
                  beacon_block_root
                </p>
                <p className="text-foreground/50">LMD-GHOST input</p>
              </div>
              <div className="rounded border border-border/40 p-2">
                <p className="text-foreground/70 font-semibold">source</p>
                <p className="text-foreground/50">이미 justified</p>
              </div>
              <div className="rounded border border-border/40 p-2">
                <p className="text-foreground/70 font-semibold">target</p>
                <p className="text-foreground/50">Casper FFG</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                Committee 할당
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>매 slot마다 active validator를 committee에 배정</p>
                <p>
                  활성 validator는 일반적으로 epoch마다 하나의 attester duty를
                  배정받음
                </p>
                <p>
                  gossip의 개별 vote는 committee별로 집계되어 block 공간
                  사용량을 줄임
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                Attestation의 역할
              </p>
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
          Attestation은 head를 가리키는 <code>beacon_block_root</code>와 source,
          target checkpoint를 함께 담는다. 하나의 메시지가 fork choice와
          Casper FFG finality에 모두 사용되지만,
          fork별 attestation 스키마와 block 포함 상한은 현재 consensus spec에서
          읽어야 한다.
        </p>

        {/* ── 생명주기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Attestation 생명주기 — 10단계
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              생명주기 10단계
            </p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>
                <span className="font-semibold">1. Committee assignment</span> —
                epoch 시작 시 (slot N, committee_index C) 결정
              </p>
              <p>
                <span className="font-semibold">2. Attestation 준비</span> —
                설정된 attestation 시점에 head 조회, source/target checkpoint
                결정
              </p>
              <p>
                <span className="font-semibold">
                  3. Slashing protection 체크
                </span>{" "}
                — 로컬 DB에서 double-vote / surround-vote 방지
              </p>
              <p>
                <span className="font-semibold">4. Attestation 서명</span> —{" "}
                <code>DOMAIN_BEACON_ATTESTER</code>로 BLS 서명
              </p>
              <p>
                <span className="font-semibold">5. Subnet publish</span> —{" "}
                <code>beacon_attestation_&#123;subnet&#125;</code> 토픽에 자기
                bit만 set하여 방송
              </p>
              <p>
                <span className="font-semibold">6. Aggregator 수집</span> —
                지정된 aggregation 시점까지 committee vote를 모아 BLS 집계
              </p>
              <p>
                <span className="font-semibold">7. Aggregate 방송</span> —{" "}
                <code>beacon_aggregate_and_proof</code> 토픽
              </p>
              <p>
                <span className="font-semibold">8. Block inclusion</span> — 다음
                proposer가 현재 fork의 operation limit 안에서 block body에 포함
              </p>
              <p>
                <span className="font-semibold">9. State transition</span> —{" "}
                <code>processAttestation</code> 실행, participation flag 설정
              </p>
              <p>
                <span className="font-semibold">10. Rewards (epoch 경계)</span>{" "}
                — source/target/head vote 정확도별 reward
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">slot start</p>
              <p className="text-foreground/50">block 대기</p>
            </div>
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">attest</p>
              <p className="text-foreground/50">head 서명·방송</p>
            </div>
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">aggregate</p>
              <p className="text-foreground/50">committee vote 집계</p>
            </div>
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">next slot</p>
              <p className="text-foreground/50">block 포함 시작</p>
            </div>
            <div className="rounded border border-border/40 p-2">
              <p className="text-foreground/70 font-semibold">epoch process</p>
              <p className="text-foreground/50">participation 정산</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Attestation은 committee assignment에서 시작해 서명, subnet gossip, aggregation, block inclusion, reward 계산으로
          이어진다. 각 단계의 책임을 나눠 보면 단일 vote가 합의 입력으로 바뀌는 흐름을 추적할 수 있다. 구체 시각과 포함 한도는 네트워크 preset과 fork별 operation
          규칙을 따른다.
        </p>
      </div>
      <ContentBoundary article="prysm-attestation" />
      <div className="not-prose mt-6">
        <AttestationFlowViz />
      </div>
      <div id="paper-consensus-attestation-spec" className="scroll-mt-24">
        <CitationBlock source="Ethereum Consensus Specifications v1.6.1 — attesting and aggregation" citeKey={1} href="https://github.com/ethereum/consensus-specs/blob/v1.6.1/specs/phase0/validator.md#attesting">
          AttestationData, subnet 계산, selection proof와 aggregation의 protocol
          기준입니다. Electra 이후 committee 식별 방식처럼 fork별 schema가
          달라질 수 있으므로 v1.6.1과 활성 fork를 함께 고정합니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-attestation-source" className="scroll-mt-24">
        <CitationBlock source="OffchainLabs/prysm — pinned attestation implementation" citeKey={2} type="code" href="https://github.com/OffchainLabs/prysm/tree/ea3fbe48b48170e7f7252fbc15e9591d462a0f87">
          Prysm validator·pool·gossip 구현의 실제 경계를 확인합니다. Deadline,
          deduplication receipt와 장애 주입 release gate는 source 사실과 구분한
          운영 hardening 제안입니다.
        </CitationBlock>
      </div>
    </section>
  );
}
