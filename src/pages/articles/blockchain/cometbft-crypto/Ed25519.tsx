import { codeRefs } from './codeRefs';
import SignVerifyViz from './viz/SignVerifyViz';
import type { CodeRef } from '@/components/code/types';

export default function Ed25519({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="ed25519" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Ed25519 서명 & 검증</h2>
      <div className="not-prose mb-8">
        <SignVerifyViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Ed25519 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Ed25519 — Edwards 곡선 서명</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Ed25519 (RFC 8032)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Curve25519 기반 twisted Edwards 곡선</li>
              <li>256-bit prime field, cofactor 8</li>
              <li>~128-bit 보안 수준</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Key/Signature 크기</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">PrivKey []byte</code> — 64 bytes (32 seed + 32 pubkey cache)</li>
              <li><code className="text-xs">PubKey []byte</code> — 32 bytes (compressed point)</li>
              <li>Signature — 64 bytes (r + s)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">내부 구현</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Go 표준 <code className="text-xs">crypto/ed25519</code></li>
              <li>Assembly 최적화 (amd64, arm64)</li>
              <li>constant-time 연산 (side-channel 방어)</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">Address 유도</div>
            <div className="text-sm text-muted-foreground">
              <code className="text-xs">tmhash.SumTruncated(pubKey)</code> → SHA256(pubkey)[:20] (20 bytes)
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">서명</div>
            <div className="text-sm text-muted-foreground">
              <code className="text-xs">ed25519.Sign(privKey.Bytes(), msg)</code> → Go 표준 <code className="text-xs">crypto/ed25519</code>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">검증</div>
            <div className="text-sm text-muted-foreground">
              <code className="text-xs">ed25519.Verify(pubKey.Bytes(), msg, sig)</code> — sig 길이 64 아니면 false
            </div>
          </div>
        </div>
        <p className="leading-7">
          CometBFT가 <strong>Ed25519 (Go 표준)</strong> 사용.<br />
          32 bytes pubkey + 64 bytes signature + 20 bytes address.<br />
          Go assembly 최적화 → 빠른 서명/검증.
        </p>

        {/* ── Batch Verification ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Batch Verification — 투표 일괄 검증</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Batch 검증 성능</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>단일 verify: ~60us</li>
              <li>배치 100개: ~1.5ms (60배 가속)</li>
              <li>배치 1000개: ~14ms (~400배 가속)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">CometBFT 사용처</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Vote batch verification (100+ validators)</li>
              <li>PartSetHeader 서명 배치 검증</li>
              <li>LastCommit의 모든 Vote 일괄 검증</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">주의사항</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>배치 실패 → 어떤 서명이 문제인지 모름</li>
              <li>fallback: 개별 검증으로 bad signature 탐색</li>
              <li>strict subgroup check 필요 (small subgroup attack)</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Ed25519 <strong>batch verification</strong>이 핵심 성능 강점.<br />
          100 서명 배치 = 단일 60배 가속.<br />
          Vote/Commit 집계 검증에 필수.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Ed25519 vs secp256k1</strong> — 이더리움은 secp256k1이지만 CometBFT는 Ed25519를 선택.<br />
          검증 속도 ~2배, batch verification 지원. 합의 라운드마다 수십 투표를 처리하는 BFT에 최적.
        </p>
      </div>
    </section>
  );
}
