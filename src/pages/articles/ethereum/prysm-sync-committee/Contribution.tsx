import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Contribution({ onCodeRef }: Props) {
  return (
    <section id="contribution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">기여 집계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "process-sync-aggregate",
                codeRefs["process-sync-aggregate"],
              )
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            ProcessSyncAggregate()
          </span>
        </div>

        {/* ── 4 subnet 집계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Subnet 집계 — SyncAggregate 구성
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              용어 정리
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-foreground/80">
              <div>
                <span className="font-semibold">SyncCommitteeMessage</span> —
                개별 validator 서명
              </div>
              <div>
                <span className="font-semibold">SyncCommitteeContribution</span>{" "}
                — subnet 내 집계
              </div>
              <div>
                <span className="font-semibold">SyncAggregate</span> — 모든
                subcommittee contribution의 최종 집계
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                SyncCommitteeContribution
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>
                  <code>slot: Slot</code>
                </p>
                <p>
                  <code>beacon_block_root: Root</code>
                </p>
                <p>
                  <code>subcommittee_index: uint64</code> — preset 범위
                </p>
                <p>
                  <code>aggregation_bits</code> — subcommittee 크기의 Bitvector
                </p>
                <p>
                  <code>signature: BLSSignature</code>
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                SyncAggregate
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>
                  <code>
                    sync_committee_bits: Bitvector[SYNC_COMMITTEE_SIZE]
                  </code>
                </p>
                <p>
                  <code>sync_committee_signature: BLSSignature</code>
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              aggregateContributions 흐름
            </p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. Subnet aggregator 선정 (committee처럼)</p>
              <p>
                2. 각 subnet에서 subcommittee member의 서명을 수집해
                Contribution 생성
              </p>
              <p>
                3. Block proposer가 서로 다른 subcommittee contribution을 수신
              </p>
              <p>
                4. preset의 subcommittee size로 전체 sync committee bitvector
                위치에 매핑
              </p>
              <p>5. contribution 서명을 BLS aggregate해 SyncAggregate 생성</p>
              <p>6. Block body에 포함</p>
            </div>
          </div>
        </div>
        <p>
          Sync committee는 preset이 정한 subnet 수와 subcommittee 크기에 따라 나뉩니다. 각 subnet의 aggregator가 같은 beacon block root에 대한 signature를 contribution으로 묶고, block proposer는 선택한 contribution을 통합해 전체 participation bitvector와 하나의 aggregate signature를 <code>SyncAggregate</code>에 넣습니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Position은 validator index가 아니다</h3>
        <p>
          Mainnet preset의 512 positions와 4 subnet을 예로 들면 한
          subcommittee는 128 positions입니다. Subnet 2의 local bit 5는 전체
          bitvector의 <code>2 × 128 + 5 = 261</code> 위치에 놓입니다. 같은
          validator가 sampling with replacement로 두 position에 뽑혔다면 public
          key도 두 위치에 나타날 수 있으므로 unique validator 수로 bitvector를
          다시 만들면 안 됩니다.
        </p>

        <ExplainedFormula
          question="각 sync subcommittee에서 slot마다 소수의 aggregator를 선택하는 기준은 무엇일까요?"
          idea={<>Subcommittee 한 칸의 크기를 목표 aggregator 수로 나눠 modulo를 만들고, domain-separated selection proof hash가 0번 residue에 들어온 validator를 선택합니다.</>}
          formula={String.raw`\begin{aligned}
q&=C/N\\
a&=\left\lfloor q/A\right\rfloor\\
m&=\max(1,a)\\
z&=H(\sigma)\\
h&=\operatorname{u64}(z_{0:8})\\
h\bmod m&=0
\end{aligned}`}
          terms={[
            { symbol: "C", name: "sync committee size", description: "Mainnet preset에서 512 positions입니다." },
            { symbol: "N", name: "sync subnet count", description: "Mainnet preset에서 4개 subcommittee입니다." },
            { symbol: "A", name: "target aggregators per subcommittee", description: "Subcommittee별 기대 aggregator 수를 정하는 preset 값입니다." },
            { symbol: "q", name: "subcommittee size", description: "전체 committee positions를 subnet 수로 나눈 값입니다." },
            { symbol: "a", name: "raw modulo", description: "Subcommittee 크기를 목표 aggregator 수로 나눈 정수 몫입니다." },
            { symbol: "z", name: "proof hash bytes", description: "Selection proof에 hash 함수를 적용한 byte string입니다." },
            { symbol: "h", name: "proof hash integer", description: "Selection proof hash의 앞 8 bytes를 uint64로 읽은 값입니다." },
            { symbol: "\\sigma", name: "sync selection proof", description: "slot과 subcommittee index에 DOMAIN_SYNC_COMMITTEE_SELECTION_PROOF로 서명한 값입니다." },
          ]}
          assumptions={["C/N이 subcommittee position 수를 이루며 preset·fork를 고정합니다.", "동일 validator가 여러 committee position에 들어갈 수 있으므로 participant identity와 bit position을 구분합니다."]}
          interpretation="Mainnet의 512 positions를 4개 subnet으로 나누면 contribution bitvector는 subnet당 128 bits입니다. 이후 proposer가 네 구간을 올바른 offset에 놓아 전체 bitvector를 만듭니다."
        />

        {/* ── Light Client 활용 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Light Client — SyncAggregate로 head 검증
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              1. Bootstrapping (최초 1회)
            </p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>
                <code>
                  GET
                  /eth/v1/beacon/light_client/bootstrap/&#123;trusted_block_root&#125;
                </code>
              </p>
              <p>
                header + <code>current_sync_committee</code> + merkle proof 수신
              </p>
              <p>
                <code>state_root</code>에서 <code>current_sync_committee</code>{" "}
                merkle proof 검증
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              2. Update 수신 (주기적)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span>
                <code>attested_header</code> — 신뢰할 새 block
              </span>
              <span>
                <code>next_sync_committee</code> — 다음 committee
              </span>
              <span>
                <code>finalized_header</code>
              </span>
              <span>
                <code>sync_aggregate</code> — 현재 committee 서명
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              3-4. SyncAggregate 검증
            </p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>
                참여자 수를 현재 committee size와 update 종류별 안전 임계값에
                대조
              </p>
              <p>bit가 set된 position의 pubkey 수집</p>
              <p>
                <code>
                  FastAggregateVerify(activePubkeys, signingRoot, signature)
                </code>{" "}
                — BLS 검증
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              5. Update 채택 효과
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-center">
              <div className="rounded border border-border/40 p-2">
                <p className="text-foreground/70 font-semibold">
                  제한된 위원회
                </p>
                <p className="text-foreground/50">전체 state 실행 생략</p>
              </div>
              <div className="rounded border border-border/40 p-2">
                <p className="text-foreground/70 font-semibold">크기 제한</p>
                <p className="text-foreground/50">preset·branch 내용 의존</p>
              </div>
              <div className="rounded border border-border/40 p-2">
                <p className="text-foreground/70 font-semibold">
                  모바일/브라우저
                </p>
                <p className="text-foreground/50">Helios 등 가능</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          Light client는 <code>SyncAggregate</code>로 attested beacon header에 충분한 sync committee가 서명했는지 확인하고, Merkle branch로 finalized checkpoint와 다음 committee를 state root에 연결합니다. 이 경로는 full state를 내려받지 않아도 되지만 모든 block과 state transition을 실행하는 full consensus node와 같은 검증 범위를 제공하지는 않습니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 서브넷 집계</strong> — committee size와 subnet 수를
          preset에서 읽어 subcommittee로 분할합니다. Subnet 안에서 BLS signature를 contribution으로 aggregate하고, proposer가 이를 전체 committee bitvector와 aggregate signature로 합쳐 block에 포함합니다.
        </p>

        <p className="mt-4 border-l-2 border-violet-500/50 pl-3 text-sm">
          <strong>💡 보상 & 패널티</strong> — sync committee reward는 total
          active balance와 preset constant, proposer·participant 역할을 사용해 계산합니다. 불참 delta도 현재 fork formula를 따르는 값이지 고정 금액이 아닙니다. Light client는 SyncAggregate만 보는 것이 아니라 trusted root, Merkle branch와 update selection rule까지 검증합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Light client가 믿는 범위와 release gate</h3>
        <p>
          신뢰는 공격자가 건넨 committee의 자기서명에서 시작하지 않습니다.
          사용자가 고정한 trusted block root에서 current committee Merkle
          branch를 확인하고, update의 participant-position public keys와 BLS
          signature, finalized·next-committee branch, update selection rule을
          차례로 검증합니다. 이 경로는 full execution과 모든 BeaconState
          transition을 대신하지 않습니다.
        </p>
        <p>
          Release 전에는 period 전환, duplicate positions, wrong domain·root,
          잘못된 subnet offset, 부족한 participation, 깨진 Merkle branch,
          reorg와 restart를 동일 fixture로 paired 실행합니다. Contribution
          bytes와 light-client optimistic/finalized header가 baseline과 같아야
          BLS batch나 pool 성능 개선을 비교합니다.
        </p>
      </div>
    </section>
  );
}
