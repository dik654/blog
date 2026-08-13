import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ForkchoiceUpdated({ onCodeRef }: Props) {
  return (
    <section id="forkchoice-updated" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ForkchoiceUpdated</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">역할</h3>
        <p>
          <code>forkchoiceUpdated</code>는 consensus layer가 선택한 head·safe·finalized execution block hash를 execution layer에 전달합니다. Execution layer는 이미 검증한 payload graph에서 이 pointer를 적용해 canonical view와 RPC-visible state를 갱신합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("engine-forkchoice", codeRefs["engine-forkchoice"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            ForkchoiceUpdated()
          </span>
        </div>

        {/* ── ForkchoiceState ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          ForkchoiceState — 3개 포인터
        </h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              <code>ForkchoiceState</code> 구조체
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded border p-2">
                <p className="font-medium text-green-500 mb-1">headBlockHash</p>
                <p className="text-muted-foreground">
                  최신 블록 (LMD-GHOST 결과)
                </p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium text-blue-500 mb-1">safeBlockHash</p>
                <p className="text-muted-foreground">
                  2/3+ validator 투표 블록 (justified)
                </p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium text-amber-500 mb-1">
                  finalizedBlockHash
                </p>
                <p className="text-muted-foreground">
                  되돌릴 수 없는 블록 (finalized)
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">EL의 활용</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>canonical chain 업데이트 (head → tip)</li>
                <li>safe/finalized 마킹 (reorg 불가 영역)</li>
                <li>pruning hint (finalized 이하는 permanent)</li>
                <li>
                  RPC 응답 (<code>eth_getBlockByTag "safe"/"finalized"</code>)
                </li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">업데이트 타이밍</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>매 CL slot (12초)</li>
                <li>새 block 수신, attestation 반영 시</li>
                <li>finality 갱신 (매 2 epoch)</li>
                <li>Prysm: slot당 여러 번 (fork choice 재계산마다)</li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          <code>ForkchoiceState</code>의 세 pointer는 최신 execution head, consensus가 safe하다고 보는 block과 finalized block을 구분합니다. Execution layer는 이 값을 database·in-memory tree의 canonicalization과 pruning boundary에 반영하며, 알지 못하는 hash가 들어오면 protocol status로 sync 필요 여부를 알립니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">ForkchoiceState</h3>
        <ul>
          <li>
            <strong>headBlockHash</strong> — 현재 체인 헤드
          </li>
          <li>
            <strong>safeBlockHash</strong> — 2/3 검증자가 투표한 블록
          </li>
          <li>
            <strong>finalizedBlockHash</strong> — 되돌릴 수 없는 확정 블록
          </li>
        </ul>

        {/* ── PayloadAttributes ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          PayloadAttributes — validator 전용 필드
        </h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              <code>PayloadAttributesV3</code> (Deneb)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span>
                <code>timestamp uint64</code> — 다음 block timestamp
              </span>
              <span>
                <code>prevRandao Hash32</code> — RANDAO mix
              </span>
              <span>
                <code>suggestedFeeRecipient Address</code> — 수수료 수취인
              </span>
              <span>
                <code>withdrawals Array[Withdrawal]</code> — Capella+
              </span>
              <span>
                <code>parentBeaconBlockRoot Hash32</code> — EIP-4788 (Cancun+)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              validator가 다음 slot proposer일 때만 포함 / 일반 slot →{" "}
              <code>null</code>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4 border-green-500/20">
              <h4 className="font-semibold text-sm mb-2">
                payload_attrs != null
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>
                  <code>payload_id</code> 반환 (새 빌드 작업 ID)
                </li>
                <li>EL이 백그라운드에서 블록 조립 시작</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">
                payload_attrs == null
              </h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>
                  <code>payload_id: null</code>
                </li>
                <li>단순 state 업데이트만</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">블록 빌드 타임라인</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-10 text-center">
                  t=0s
                </span>
                <div className="text-muted-foreground">
                  CL → EL: FCU + payload_attrs → EL이 <code>payload_id</code>{" "}
                  반환 + TX 선택/실행 시작
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-10 text-center">
                  deadline
                </span>
                <div className="text-muted-foreground">
                  CL → EL: <code>getPayload(payload_id)</code> → 가장 좋은 블록
                  반환 → CL이 서명 + 전파
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              더 오래 build하면 transaction과 bid를 더 수집할 수 있지만, 서명과
              gossip 시간이 줄어드는 trade-off가 생깁니다.
            </p>
          </div>
        </div>
        <p>
          Proposer duty가 있는 slot에는 consensus layer가 <code>PayloadAttributes</code>를 함께 보내 execution payload build를 시작합니다. Execution layer는 <code>payloadId</code>를 반환하고 이후 <code>getPayload</code>가 그 candidate를 가져갑니다. Build deadline은 slot timing, builder path와 client policy에 따라 정해야 하며 고정된 4초로 일반화할 수 없습니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 PayloadAttributes 이중 역할</strong> — 블록 제안자일 때만
          포함됩니다. Execution layer가 다음 payload build를 시작하고 <code>payloadId</code>를 반환하면 consensus layer는 이후 <code>getPayload</code>에서 같은 ID를 사용해 candidate를 요청합니다.
        </p>
      </div>
    </section>
  );
}
