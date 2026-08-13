import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function PayloadRetrieval({ onCodeRef }: Props) {
  return (
    <section id="payload-retrieval" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GetPayload & MEV-Boost</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">GetPayloadV3</h3>
        <p>
          ForkchoiceUpdated에서 받은 <code>payloadId</code>로 EL이 빌드한
          페이로드를 회수한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("engine-get-payload", codeRefs["engine-get-payload"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            GetPayload()
          </span>
        </div>

        {/* ── GetPayloadV3 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          engine_getPayloadV3 — 응답 구조
        </h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              <code>engine_getPayloadV3</code> 응답 (Deneb)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded border p-2">
                <p className="font-medium mb-1">executionPayload</p>
                <div className="text-muted-foreground space-y-0.5">
                  <p>
                    <code>parentHash</code>, <code>feeRecipient</code>,{" "}
                    <code>stateRoot</code>, <code>receiptsRoot</code>
                  </p>
                  <p>
                    <code>logsBloom</code>, <code>prevRandao</code>,{" "}
                    <code>blockNumber</code>, <code>gasLimit</code>
                  </p>
                  <p>
                    <code>gasUsed</code>, <code>timestamp</code>,{" "}
                    <code>baseFeePerGas</code>, <code>blockHash</code>
                  </p>
                  <p>
                    <code>transactions</code>, <code>withdrawals</code>,{" "}
                    <code>blobGasUsed</code>, <code>excessBlobGas</code>
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="rounded border p-2">
                  <p className="font-medium mb-1">blockValue</p>
                  <p className="text-muted-foreground">
                    validator 예상 수익 (wei)
                  </p>
                </div>
                <div className="rounded border p-2">
                  <p className="font-medium mb-1">blobsBundle</p>
                  <p className="text-muted-foreground">
                    <code>commitments</code>, <code>proofs</code>,{" "}
                    <code>blobs</code>
                  </p>
                </div>
                <div className="rounded border p-2">
                  <p className="font-medium mb-1">shouldOverrideBuilder</p>
                  <p className="text-muted-foreground">
                    MEV-Boost override hint
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Prysm 처리 흐름</h4>
            <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <span className="rounded bg-muted px-2 py-1">
                ExecutionPayload 파싱
              </span>
              <span>→</span>
              <span className="rounded bg-muted px-2 py-1">
                Beacon block에 payload 통합
              </span>
              <span>→</span>
              <span className="rounded bg-muted px-2 py-1">
                blob sidecar 준비
              </span>
              <span>→</span>
              <span className="rounded bg-muted px-2 py-1">BLS 서명 추가</span>
              <span>→</span>
              <span className="rounded bg-muted px-2 py-1">
                SignedBeaconBlock 완성
              </span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>getPayloadV3</code>가{" "}
          <strong>완성된 execution payload와 fork별 envelope 정보</strong>를 반환합니다. Response의 block value는 builder가 산정한 payload value를 전달하며 Deneb 계열 envelope에는 blob commitment·proof·blob data를 담은 bundle이 포함될 수 있습니다. Consensus client는 이를 beacon block body의 commitment와 sidecar construction에 연결합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">블록 조립 완료</h3>
        <ul>
          <li>
            <strong>비콘 블록 헤더</strong> — slot, proposer_index, parent_root,
            state_root
          </li>
          <li>
            <strong>실행 페이로드</strong> — GetPayload 또는 MEV-Boost에서 획득
          </li>
          <li>
            <strong>BLS 서명</strong> — RANDAO reveal + 블록 서명
          </li>
        </ul>

        {/* ── MEV-Boost 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          MEV-Boost 선택 — local vs relay bid
        </h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Local Build (EL)</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>
                  <code>GetPayloadV3</code> → <code>local_payload</code> +{" "}
                  <code>local_value</code>
                </li>
                <li>execution client가 직접 만든 payload와 block value</li>
                <li>relay 장애·정책 제한 시 독립적인 fallback 경로</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">MEV-Boost Relay</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>
                  <code>
                    POST /eth/v1/builder/header/{"{slot}"}/{"{parent_hash}"}/
                    {"{pubkey}"}
                  </code>
                </li>
                <li>
                  응답: <code>execution_payload_header</code> +{" "}
                  <code>value</code> (bid)
                </li>
                <li>relay bid value와 payload header를 함께 수신</li>
                <li>사용률·수익 차이는 시점과 validator 정책에 따라 변동</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              <code>selectPayload</code> — 선택 로직
            </h4>
            <p className="text-xs text-muted-foreground mb-2">
              <code>relayBid.Cmp(localValue) &gt; 0</code> → relay 선택 / 아니면
              local 선택
            </p>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  1
                </span>
                <div className="text-muted-foreground">
                  validator가 header에 서명
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  2
                </span>
                <div className="text-muted-foreground">
                  relay에 signed_header POST
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  3
                </span>
                <div className="text-muted-foreground">
                  relay가 full payload 반환
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  4
                </span>
                <div className="text-muted-foreground">
                  validator가 block + payload 전파
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          Proposer가 external builder를 사용하면 local execution payload value와 relay bid를 policy에 따라 비교할 수 있습니다. Adoption rate나 수익 배수는 시점과 validator population에 따라 변하므로 고정 수치로 두지 않습니다. Builder path에서는 proposer가 signed blinded block을 제출한 뒤 relay가 payload를 공개하는 unblinding dependency와 timeout risk까지 고려해야 합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 MEV-Boost 비드 비교</strong> — MEV-Boost 릴레이에서도
          payload bid를 받을 수 있습니다. Client는 local build와 relay bid의 value·validity·deadline을 비교하고 선택한 block에 proposer signature를 붙여 publish합니다. Relay path 실패 시 fallback behavior는 client와 operator policy에 달려 있습니다.
        </p>
      </div>
    </section>
  );
}
