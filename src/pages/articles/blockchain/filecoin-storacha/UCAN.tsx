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
        <div className="bg-muted rounded-lg p-4 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-2">Structure (JWT-like)</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li><code className="text-xs bg-background px-1 rounded">iss</code>: issuer DID (발행자)</li>
            <li><code className="text-xs bg-background px-1 rounded">aud</code>: audience (수신자)</li>
            <li><code className="text-xs bg-background px-1 rounded">att</code>: capabilities 배열 — <code className="text-xs bg-background px-1 rounded">with</code>(리소스) + <code className="text-xs bg-background px-1 rounded">can</code>(동작, 예: storage/upload)</li>
            <li><code className="text-xs bg-background px-1 rounded">prf</code>: parent tokens (위임 체인)</li>
            <li><code className="text-xs bg-background px-1 rounded">exp</code>: 만료 시간, <code className="text-xs bg-background px-1 rounded">nnc</code>: nonce</li>
            <li>서명: <code className="text-xs bg-background px-1 rounded">ED25519(content, issuer_key)</code></li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Delegation Chain</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>Root: user DID (full capabilities)</li>
              <li>→ app에 위임 (scope 축소)</li>
              <li>→ service에 위임</li>
              <li>→ worker에 위임</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">각 단계에서 attenuation(권한 축소) 적용</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Attenuation Rule</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>자신이 가진 것보다 더 많이 부여 불가</li>
              <li>child capabilities는 parent의 부분집합</li>
              <li>보안 속성: verification이 강제</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Verification (5단계)</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>signature 유효성 확인</li>
              <li><code className="text-xs bg-background px-1 rounded">issuer == parent.audience</code></li>
              <li>capabilities가 parent 범위 이하인지</li>
              <li>만료 여부 확인</li>
              <li>root까지 완전한 chain 존재</li>
            </ol>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">UCAN vs OAuth</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground text-xs mb-1">OAuth</p>
                <ul className="space-y-0.5 text-xs">
                  <li>central server</li>
                  <li>session tokens</li>
                  <li>server-verified</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground text-xs mb-1">UCAN</p>
                <ul className="space-y-0.5 text-xs">
                  <li>decentralized</li>
                  <li>self-verifying</li>
                  <li>capability-based</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          UCAN: <strong>capability tokens + delegation + attenuation</strong>.<br />
          OAuth 탈중앙 버전, 최소 권한 원칙.<br />
          no central auth server, self-verifying chain.
        </p>
      </div>
    </section>
  );
}
