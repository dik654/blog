import { codeRefs } from './codeRefs';
import TMHASHViz from './viz/TMHASHViz';
import type { CodeRef } from '@/components/code/types';

export default function Hash({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="hash" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TMHASH & 해시 체인</h2>
      <div className="not-prose mb-8">
        <TMHASHViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── TMHASH ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">TMHASH — SHA256 truncated to 20 bytes</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">TMHASH 함수</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><code className="text-xs">Sum(bz)</code> → SHA256 full 32 bytes</p>
              <p><code className="text-xs">SumTruncated(bz)</code> → SHA256[:20] (20 bytes, 주소용)</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">왜 SHA256?</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Bitcoin 계보 (Tendermint 초기 설계)</li>
              <li>Go 표준 라이브러리 지원</li>
              <li>hardware acceleration (SHA extensions)</li>
              <li>ABCI 앱과 공유 (Cosmos SDK)</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Validator Address</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">SumTruncated(pubkey)</code> → 20 bytes</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Block Hash</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">sha256(header)</code> → 32 bytes</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Tx Hash</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">sha256(tx_bytes)</code> → 32 bytes</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Peer ID</div>
            <p className="text-sm text-muted-foreground">pubkey hash[:20]</p>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">Keccak256 (Ethereum)</div>
            <p className="text-sm text-muted-foreground">ASIC 덜 최적화</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">SHA256 (CometBFT)</div>
            <p className="text-sm text-muted-foreground">Bitcoin 표준, HW 가속 활발</p>
          </div>
        </div>
        <p className="leading-7">
          TMHASH는 <strong>SHA256의 CometBFT 래퍼</strong>.<br />
          Full 32 bytes (block hash) + Truncated 20 bytes (address).<br />
          Bitcoin 계보 + Cosmos SDK와 공유.
        </p>

        {/* ── 해시 체인 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Block Hash Chain — 불변성의 토대</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">블록 연결 구조</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Block N → Block N+1 → Block N+2</p>
              <p>각 Header의 <code className="text-xs">LastBlockID</code> = 이전 블록의 hash → 재귀적 체인 형성</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Header & BlockID</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">Header.LastBlockID BlockID</code></li>
              <li><code className="text-xs">BlockID.Hash []byte</code></li>
              <li><code className="text-xs">BlockID.PartSetHeader</code> — 블록 분할 전파용</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">변경 불가성</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Block 1개 수정 → hash 변경 → 이후 모든 LastBlockID 변경</p>
              <p>→ 모든 블록 재서명 필요 → 2/3+ validator 담합 필수</p>
              <p>→ 경제적 비용 (slashing) → 실질 불가</p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">Ethereum</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">parent_hash</code> 필드 (동일 역할)</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">CometBFT</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">LastBlockID</code> (Hash + PartSetHeader) — 블록 크기 MB → 청크 단위 gossip</p>
          </div>
        </div>
        <p className="leading-7">
          <strong>Block Hash Chain</strong>이 불변성의 토대.<br />
          LastBlockID가 이전 블록 hash 포함 → 재귀적 연결.<br />
          역사적 블록 수정 = 2/3+ 담합 + slashing → 경제적 불가능.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 SHA256 전체가 아닌 20바이트</strong> — Tendermint 초기 설계에서 BTC의 RIPEMD160(SHA256(x)) 패턴을 참고.<br />
          ETH 주소 길이(20B)와 호환, 네트워크 대역폭 37% 절약. 충돌 저항성 2^80으로 충분.
        </p>
      </div>
    </section>
  );
}
