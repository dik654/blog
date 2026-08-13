import OAuthFlowViz from "./viz/OAuthFlowViz";

const tokenRules = [
  ["저장", "refresh token은 OS keychain 또는 전용 secret store에 둔다"],
  ["갱신", "clock skew와 rotation을 고려해 한 번만 refresh한다"],
  ["로그", "code·token·Authorization header를 항상 redaction한다"],
  ["종료", "logout 시 local secret을 지우고 가능하면 server에서 revoke한다"],
] as const;

export default function OAuth() {
  return (
    <section id="oauth" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        OAuth 2.0 Authorization Code + PKCE를 CLI에 안전하게 연결하기
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          CLI는 binary 안에 client secret을 숨길 수 없는{" "}
          <strong>public client</strong>
          입니다. provider가 OAuth login을 지원한다면 Authorization Code flow에
          PKCE(Proof Key for Code Exchange)를 결합해, browser에서 받은 code가
          중간에 노출돼도 verifier 없이는 token으로 교환하지 못하게 할 수
          있습니다.
        </p>
        <p className="leading-7">
          다만 특정 구독 계정이 CLI API 사용을 허용하는지, 어떤 authorization
          endpoint와 scope를 쓰는지는 provider의 공식 문서와 등록된 client
          설정에 따라 달라집니다. 분석 snapshot의 endpoint를 일반 규격처럼
          하드코딩하면 안 됩니다.
        </p>

        <div className="not-prose my-8">
          <OAuthFlowViz />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          PKCE와 state는 서로 다른 공격을 막는다
        </h3>
        <p className="leading-7">
          client는 충분히 긴 random <code>code_verifier</code>를 만들고,
          <code>base64url(SHA-256(code_verifier))</code>를
          <code>code_challenge</code>로 보냅니다. callback에서 받은 code를
          token으로 교환할 때 원본 verifier를 제출하므로, code만 가로챈 공격자는
          교환을 완료할 수 없습니다.
        </p>
        <p className="leading-7">
          별도의 random <code>state</code>는 callback을 시작한 login attempt에
          묶어 CSRF와 callback mix-up을 막습니다. callback handler는 state가
          일치하지 않거나 이미 소비된 요청이면 code를 사용하지 않고
          fail-closed해야 합니다. PKCE가 state 검증을 대신하지는 않습니다.
        </p>
        <p className="leading-7">
          표준의 세부 요구사항은
          <a
            href="https://www.rfc-editor.org/rfc/rfc7636"
            target="_blank"
            rel="noreferrer"
          >
            RFC 7636(PKCE)
          </a>
          와 native app의 browser·redirect 지침을 정리한
          <a
            href="https://www.rfc-editor.org/rfc/rfc8252"
            target="_blank"
            rel="noreferrer"
          >
            RFC 8252
          </a>
          에서 바로 확인할 수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          loopback callback listener는 첫 유효 요청을 처리한 뒤 종료한다
        </h3>
        <p className="leading-7">
          desktop CLI는 <code>127.0.0.1</code>의 임의 port에 임시 HTTP
          listener를 열고, 등록 규칙이 허용하는 redirect URI를 authorization
          request에 넣을 수 있습니다. 모든 network interface에 bind하지 않으며
          callback의 path, state와 error를 검증하고 첫 유효 요청을 처리한 뒤
          listener를 닫습니다.
        </p>
        <p className="leading-7">
          timeout은 고정된 표준값이 아니라 UX와 위협 모델에 맞춘 설정입니다.
          timeout·사용자 취소·browser open 실패에서는 listener와 verifier를
          정리하고, code와 query string 전체를 access log에 남기지 않습니다.
          headless 환경에서는 provider가 지원할 때 Device Authorization Grant
          같은 별도 flow를 선택합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          token exchange는 issuer 설정에서 조립한다
        </h3>
        <p className="leading-7">
          callback에서 얻은 code, 동일한 redirect URI, client ID와 verifier를
          provider의 token endpoint에 TLS로 전송합니다. 정확한 parameter, client
          authentication 방식, scope와 audience는 provider metadata와 공식
          문서를 따라야 하며 임의의 endpoint를 추측해서는 안 됩니다.
        </p>
        <p className="leading-7">
          OpenID Connect를 함께 쓴다면 ID token의 issuer, audience, signature,
          nonce와 시간 claim을 검증합니다. OAuth access token을 단순히 decode한
          payload만 보고 사용자 identity로 받아들이는 것은 검증이 아닙니다.
        </p>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tokenRules.map(([title, body]) => (
          <article
            key={title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <h4 className="text-sm font-bold text-foreground">{title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          token lifecycle은 login 이후가 더 길다
        </h3>
        <p className="leading-7">
          access token은 memory에 두고 가능한 한 짧게 사용하며, refresh token은
          project file이 아니라 OS keychain이나 전용 secret store에 저장합니다.
          여러 요청이 동시에 만료를 감지했을 때 refresh가 중복되지 않도록 single
          flight를 적용하고, provider가 refresh token을 rotation하면 새 값을
          원자적으로 교체합니다.
        </p>
        <p className="leading-7">
          만료 판단에는 clock skew를 두고, refresh가 거부되면 오래된 token으로
          계속 재시도하지 말고 다시 login하도록 안내합니다. logout은 local token
          삭제로 끝내지 않고 provider가 revocation을 지원하면 server-side
          credential도 폐기합니다. 이 전체 과정에서 token 값은 telemetry와 error
          message에 나타나지 않아야 합니다.
        </p>
      </div>
    </section>
  );
}
