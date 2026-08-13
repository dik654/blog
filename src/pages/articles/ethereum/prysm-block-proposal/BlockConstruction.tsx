import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function BlockConstruction({ onCodeRef }: Props) {
  return (
    <section id="block-construction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 조립</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "aggregate-attestations",
                codeRefs["aggregate-attestations"],
              )
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            어테스테이션 수집
          </span>
        </div>

        {/* ── Block construction ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          ProduceBlockV3 — 블록 조립 흐름
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          validator client가 beacon node의 block production API를 호출한다. REST
          v3처럼 blinded/unblinded 결과와 builder 경로를 표현할 수 있는 현재
          endpoint를 우선하고, 내부 전송 경계는 버전별 구현으로 본다.
        </p>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              1. Parent Block 결정
            </div>
            <p className="text-sm">
              <code>forkchoiceStore.GetHead()</code> → LMD-GHOST head 선택 →{" "}
              <code>beaconDB.Block(head)</code>로 parent block 로드.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              2. Parent State 로드 + Slot 진전
            </div>
            <p className="text-sm">
              <code>stategen.StateByRoot(head)</code>로 parent state 로드 →{" "}
              <code>ProcessSlots(parentState, req.Slot)</code>으로 현재 slot까지
              진전.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              3. Block Body 조립
            </div>
            <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
              <span>
                <code>RandaoReveal</code> — 제안자 reveal
              </span>
              <span>
                <code>Eth1Data</code> — eth1 체인 데이터
              </span>
              <span>
                <code>ProposerSlashings</code> — fork별 max operations
              </span>
              <span>
                <code>AttesterSlashings</code> — fork별 타입·상한
              </span>
              <span>
                <code>Attestations</code> — pool에서 수집
              </span>
              <span>
                <code>Deposits</code> — eth1 deposit
              </span>
              <span>
                <code>VoluntaryExits</code> — preset 상한
              </span>
              <span>
                <code>BlsToExecutionChanges</code> — preset 상한
              </span>
              <span>
                <code>SyncAggregate</code> — Altair+
              </span>
              <span>
                <code>ExecutionPayload</code> — Bellatrix+
              </span>
              <span>
                <code>BlobKzgCommitments</code> — Deneb+
              </span>
              <span>
                <code>ExecutionRequests</code> — Electra+
              </span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              4. BeaconBlock 생성
            </div>
            <p className="text-sm">
              <code>Slot</code>, <code>ProposerIndex</code>,{" "}
              <code>ParentRoot</code> 설정. <code>StateRoot</code>는 임시로{" "}
              <code>ZERO_HASH</code>.
            </p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="text-xs font-semibold text-amber-400 mb-2">
              5. 임시 State Transition → StateRoot Backfill
            </div>
            <p className="text-sm">
              <code>processBlock(preState, block)</code> →{" "}
              <code>postState.HashTreeRoot()</code>로 state_root 계산 →{" "}
              <code>block.StateRoot = stateRoot</code>.
            </p>
          </div>
        </div>
        <p className="leading-7">
          Block construction은 parent와 execution payload를 정하고 consensus
          operation을 모은 뒤, 조립한 block으로 임시 state transition을 실행해
          <code>state_root</code>를 채우는 흐름이다. 마지막으로 proposer가 완성된
          block에 서명해 전파한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 임시 상태 전이</strong> — 조립된 블록으로 임시 상태 전이를
          실행하고 결과 state의 HashTreeRoot를 block.StateRoot에 설정한다.
          이 단계는 operation 검증과 state hashing을 포함하므로 block 조립의
          주요 비용 경로다.
        </p>
      </div>
    </section>
  );
}
