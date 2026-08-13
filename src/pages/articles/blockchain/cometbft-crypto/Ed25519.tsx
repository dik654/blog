import { codeRefs } from "./codeRefs";
import SignVerifyViz from "./viz/SignVerifyViz";
import type { CodeRef } from "@/components/code/types";

export default function Ed25519({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="ed25519" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Ed25519 서명 & 검증</h2>
      <div className="not-prose mb-8">
        <SignVerifyViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── Ed25519 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          Ed25519 — Edwards 곡선 서명
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Ed25519 (RFC 8032)
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Curve25519 기반 twisted Edwards 곡선</li>
              <li>256-bit prime field, cofactor 8</li>
              <li>~128-bit 보안 수준</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
              Key/Signature 크기
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">PrivKey []byte</code> — 64 bytes (32
                seed + 32 pubkey cache)
              </li>
              <li>
                <code className="text-xs">PubKey []byte</code> — 32 bytes
                (compressed point)
              </li>
              <li>Signature — 64 bytes (r + s)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              내부 구현
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                Go 표준 <code className="text-xs">crypto/ed25519</code>
              </li>
              <li>검증 동작은 Go library contract에 위임</li>
              <li>key와 signature 길이는 호출 전에 확인</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">
              Address 유도
            </div>
            <div className="text-sm text-muted-foreground">
              <code className="text-xs">tmhash.SumTruncated(pubKey)</code> →
              SHA256(pubkey)[:20] (20 bytes)
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">
              서명
            </div>
            <div className="text-sm text-muted-foreground">
              <code className="text-xs">
                ed25519.Sign(privKey.Bytes(), msg)
              </code>{" "}
              → Go 표준 <code className="text-xs">crypto/ed25519</code>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">
              검증
            </div>
            <div className="text-sm text-muted-foreground">
              <code className="text-xs">
                ed25519.Verify(pubKey.Bytes(), msg, sig)
              </code>{" "}
              — sig 길이 64 아니면 false
            </div>
          </div>
        </div>
        <p className="leading-7">
          CometBFT의 기본 validator key 경로는 <strong>Ed25519</strong>를
          사용한다. Public key는 32 bytes, signature는 64 bytes이며 validator
          address는 public key hash에서 파생한 20 bytes다.
          구현 세부와 성능은 사용 중인 Go/toolchain 및 hardware에 따라 달라진다.
        </p>

        {/* ── Consensus verification ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          합의에서의 signature 검증 경계
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              검증 입력
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>chain ID·height·round·vote type</li>
              <li>BlockID와 validator address</li>
              <li>canonical vote sign bytes</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
              합의 문맥
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>현재 height의 proposal·vote 검증</li>
              <li>commit의 voting power threshold 계산</li>
              <li>historical validator set으로 evidence 검증</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">
              구분할 책임
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>crypto package: bytes와 signature 검증</li>
              <li>consensus: message 좌표와 power 판정</li>
              <li>signer: 이중 서명 방지와 key custody</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Ed25519 검증 성공은{" "}
          <strong>그 public key가 그 bytes에 서명했다</strong>는 사실만
          확인한다.
          vote가 현재 round에 유효한지, commit이 threshold를 넘는지는 consensus
          layer가 별도로 판단하므로,
          특정 batch 속도나 가속 배수를 protocol 특성으로 고정하지 않는다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 알고리즘과 합의 책임</strong> — Ed25519는 compact
          key/signature와 deterministic signing API를 제공하지만,
          안전성은 알고리즘 이름만으로 생기지 않고 canonical sign bytes,
          validator-set 문맥, signer state를 함께 지켜야 한다.
        </p>
      </div>
    </section>
  );
}
