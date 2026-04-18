import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function NewPayload({ onCodeRef }: Props) {
  return (
    <section id="new-payload" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">NewPayload 호출</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">호출 시점</h3>
        <p className="leading-7">
          비콘 블록 처리 중 <code>notifyNewPayload()</code>가 실행 페이로드를 추출하여 EL에 전달한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('engine-new-payload', codeRefs['engine-new-payload'])} />
          <span className="text-[10px] text-muted-foreground self-center">NewPayload()</span>
        </div>

        {/* ── newPayloadV3 request/response ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">engine_newPayloadV3 — 요청/응답 구조</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">요청: <code>engine_newPayloadV3</code></h4>
            <p className="text-xs text-muted-foreground mb-2"><code>POST http://localhost:8551</code> / <code>Authorization: Bearer {'{jwt}'}</code></p>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">1</span>
                <div><strong>ExecutionPayload</strong> — <code>parentHash</code>, <code>feeRecipient</code>, <code>stateRoot</code>, <code>receiptsRoot</code>, <code>logsBloom</code>, <code>prevRandao</code>, <code>blockNumber</code>, <code>gasLimit</code>, <code>gasUsed</code>, <code>timestamp</code>, <code>baseFeePerGas</code>, <code>blockHash</code>, <code>transactions</code>, <code>withdrawals</code>, <code>blobGasUsed</code>, <code>excessBlobGas</code></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">2</span>
                <div><strong>versionedHashes</strong> — blob KZG commitment 해시 배열</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">3</span>
                <div><strong>parentBeaconBlockRoot</strong> — EIP-4788 부모 비콘 블록 루트</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">응답</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
              <span><code>status</code> — VALID / INVALID / SYNCING / ACCEPTED</span>
              <span><code>latestValidHash</code> — 가장 최신 valid 블록</span>
              <span><code>validationError</code> — INVALID 시 에러 메시지</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">타임아웃: 8초 — 초과 시 CL이 EL 응답 포기 → optimistic 처리</p>
          </div>
        </div>
        <p className="leading-7">
          newPayloadV3 요청이 <strong>3 파라미터 포함</strong>.<br />
          ExecutionPayload (블록) + versionedHashes (blob) + beaconRoot (EIP-4788).<br />
          응답은 4가지 상태 (VALID/INVALID/SYNCING/ACCEPTED).
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">요청 파라미터</h3>
        <ul>
          <li><strong>executionPayload</strong> — 트랜잭션, 상태 루트, 가스 정보</li>
          <li><strong>versionedHashes</strong> — Deneb blob KZG 커밋먼트 해시</li>
          <li><strong>parentBeaconBlockRoot</strong> — 부모 비콘 블록 루트</li>
        </ul>

        {/* ── Response 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Response 처리 — 4가지 상태</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code>notifyNewPayload</code> — Response 분기 처리</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded border border-green-500/20 bg-green-500/5 p-2">
                <span className="font-medium shrink-0 text-green-500 w-16">VALID</span>
                <div className="text-muted-foreground">EL 검증 성공 → block 유효 처리</div>
              </div>
              <div className="flex items-start gap-2 rounded border border-red-500/20 bg-red-500/5 p-2">
                <span className="font-medium shrink-0 text-red-500 w-16">INVALID</span>
                <div className="text-muted-foreground">EL 거부 → <code>markBlockInvalid(blockHash)</code> → fork choice에서 제외</div>
              </div>
              <div className="flex items-start gap-2 rounded border border-amber-500/20 bg-amber-500/5 p-2">
                <span className="font-medium shrink-0 text-amber-500 w-16">SYNCING</span>
                <div className="text-muted-foreground">EL sync 중 → <code>markBlockOptimistic(blockHash)</code> → 나중에 재검증</div>
              </div>
              <div className="flex items-start gap-2 rounded border border-blue-500/20 bg-blue-500/5 p-2">
                <span className="font-medium shrink-0 text-blue-500 w-16">ACCEPTED</span>
                <div className="text-muted-foreground">side chain으로만 수락 (canonical 아님)</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Optimistic Sync 흐름</h4>
            <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <span className="rounded bg-muted px-2 py-1">노드 시작, EL 뒤처짐</span>
              <span>→</span>
              <span className="rounded bg-muted px-2 py-1">CL이 몇 블록 앞서 처리</span>
              <span>→</span>
              <span className="rounded bg-muted px-2 py-1">EL 따라오면 재검증</span>
              <span>→</span>
              <span className="rounded bg-muted px-2 py-1">모두 VALID → optimistic → verified</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">INVALID 판정 시 해당 블록 + 후손 전부 무효화 → reorg</p>
          </div>
        </div>
        <p className="leading-7">
          <strong>4가지 응답 상태</strong>로 CL이 다르게 처리.<br />
          SYNCING은 optimistic sync 트리거 — EL 지연 시에도 CL 진행.<br />
          INVALID는 즉시 block + 후손 무효화 → reorg.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 응답 3가지 상태</strong> — VALID: 모든 TX 실행 성공 + 상태 루트 일치.<br />
          INVALID: 실행 실패 → 포크 선택에서 해당 체인 제거.<br />
          SYNCING: EL이 아직 동기화 중 → 나중에 재검증 (임시 보류).
        </p>
      </div>
    </section>
  );
}
