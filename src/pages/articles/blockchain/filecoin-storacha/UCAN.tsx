import type { CodeRef } from '@/components/code/types';

export default function UCAN({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="ucan" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">UCAN 인증 &amp; 권한 위임</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          UCAN — 키페어 기반 분산 인증. JWT와 유사하지만 중앙 서버 없이 권한 위임 체인 구성.<br />
          각 단계에서 권한 범위를 축소(attenuation) 가능 — 최소 권한 원칙 준수
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">UCAN Protocol 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// UCAN (User-Controlled Authorization Networks):

// Structure (JWT-like):
// {
//   "iss": did:key:abc...,    // issuer DID
//   "aud": did:key:xyz...,    // audience
//   "att": [{                  // capabilities
//     "with": "ipfs:...",
//     "can": "storage/upload"
//   }],
//   "prf": [...],              // parent tokens
//   "exp": 1234567890,
//   "nnc": "..."
// }
// signature: ED25519(content, issuer_key)

// Delegation chain:
// Root: user's DID (full capabilities)
// → delegates to app (reduced scope)
// → app delegates to service
// → service delegates to worker
// Each step: attenuate

// Attenuation rule:
// - can't grant more than you have
// - child capabilities ⊆ parent
// - security property
// - enforced by verification

// Verification:
// 1. signature valid
// 2. issuer == parent.audience
// 3. capabilities ⊆ parent
// 4. not expired
// 5. complete chain to root

// Storacha usage:
// - user grants upload capability
// - app forwards to Storage Node
// - node verifies UCAN chain
// - no central auth server

// vs OAuth:
// OAuth:
// - central server
// - session tokens
// - server-verified
//
// UCAN:
// - decentralized
// - self-verifying
// - capability-based
// - user sovereignty`}
        </pre>
        <p className="leading-7">
          UCAN: <strong>capability tokens + delegation + attenuation</strong>.<br />
          OAuth 탈중앙 버전, 최소 권한 원칙.<br />
          no central auth server, self-verifying chain.
        </p>
      </div>
    </section>
  );
}
