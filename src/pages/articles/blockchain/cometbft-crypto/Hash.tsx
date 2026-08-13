import { codeRefs } from "./codeRefs";
import TMHASHViz from "./viz/TMHASHViz";
import type { CodeRef } from "@/components/code/types";

export default function Hash({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="hash" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TMHASH & 해시 체인</h2>
      <div className="not-prose mb-8">
        <TMHASHViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── TMHASH ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          TMHASH — 용도별 full·truncated SHA-256
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              TMHASH 함수
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <code className="text-xs">Sum(bz)</code> → SHA256 full 32 bytes
              </p>
              <p>
                <code className="text-xs">SumTruncated(bz)</code> → SHA256[:20]
                (20 bytes, 주소용)
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
              왜 SHA256?
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>고정된 결정적 해시 함수</li>
              <li>Go 표준 라이브러리와 광범위한 구현 지원</li>
              <li>full hash와 address 파생값을 명시적으로 분리</li>
              <li>해시 용도는 호출 지점이 결정</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
              Validator Address
            </div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">SumTruncated(pubkey)</code> → 20 bytes
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
              Block Hash
            </div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">sha256(header)</code> → 32 bytes
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
              Tx Hash
            </div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">sha256(tx_bytes)</code> → 32 bytes
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
              Peer ID
            </div>
            <p className="text-sm text-muted-foreground">pubkey hash[:20]</p>
          </div>
        </div>

        <p className="leading-7">
          TMHASH는 <strong>SHA-256을 사용하는 CometBFT 래퍼</strong>다.
          <code>Sum</code>은 32-byte digest를, <code>SumTruncated</code>는 주소
          파생에 쓰는 앞 20 byte를 반환한다. 이는 모든 블록·거래·peer 식별자가
          일괄적으로 20 byte라는 의미는 아니며,
          타입과 코드 경로를 같이 확인해야 한다.
        </p>

        {/* ── 해시 체인 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Block Hash Chain — 불변성의 토대
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              블록 연결 구조
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Block N → Block N+1 → Block N+2</p>
              <p>
                각 Header의 <code className="text-xs">LastBlockID</code> = 이전
                블록의 hash → 재귀적 체인 형성
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
              Header & BlockID
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">Header.LastBlockID BlockID</code>
              </li>
              <li>
                <code className="text-xs">BlockID.Hash []byte</code>
              </li>
              <li>
                <code className="text-xs">BlockID.PartSetHeader</code> — 블록
                분할 전파용
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">
              변경 불가성
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Block 1개 수정 → hash 변경 → 이후 모든 LastBlockID 변경</p>
              <p>→ 이후 모든 헤더와 commit의 해시·서명을 갈아치워야 함</p>
              <p>→ 이미 검증된 commit과 light-client 신뢰 규칙에서 거부됨</p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
              Ethereum
            </div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">parent_hash</code> 필드 (동일 역할)
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">
              CometBFT
            </div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">LastBlockID</code> (Hash +
              PartSetHeader) — 블록 크기 MB → 청크 단위 gossip
            </p>
          </div>
        </div>
        <p className="leading-7">
          <strong>Block hash chain</strong>은 이전 블록의 hash를
          <code>LastBlockID</code>에 포함해 이력을 재귀적으로 연결한다. 따라서
          역사적 블록을 수정하면 후속 해시 연결과 commit이 깨지고, 검증자는
          자신의 신뢰된 상태에서 이 모순을 감지할 수 있다. 다만
          경제적 처벌 여부와 규칙은 CometBFT 해시 함수가 아니라 ABCI
          애플리케이션이 결정한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 20 byte는 용도를 포함한 설계 선택</strong> —{" "}
          <code>SumTruncated</code>는 validator address 같은 식별자를 위해
          해시를 잘라낸다. 앞 20 byte만 쓴다고 해서 Ethereum 주소 형식과
          호환되는 것은
          아니며, block·transaction 커밋먼트에는 full digest가 사용된다.
        </p>
      </div>
    </section>
  );
}
