import OAuthFlowViz from "./viz/OAuthFlowViz";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

const tokenRules = [
  ["현재 저장", "credentials.json을 temp file 뒤 rename으로 갱신한다"],
  ["현재 helper", "PKCE·state 생성, URL·form 조립과 callback parsing을 제공한다"],
  ["추가 검증", "state single-use, listener lifecycle과 token redaction을 확인한다"],
  ["추가 hardening", "file permission·fsync 또는 OS secret store를 검토한다"],
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

        <div id="paper-claw-oauth-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code OAuth helpers @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/oauth.rs"
            citeKey={3}
            type="code"
          >
            <p>
              <strong>문제:</strong> CLI OAuth 요청에 필요한 PKCE·state·request와
              credential persistence primitive를 제공합니다. <strong>기여:</strong>
              pinned source는 OS random, S256 challenge, authorize/token/refresh
              form, callback query parsing과 credentials JSON의 temp-rename 갱신을
              구현합니다. <strong>전제:</strong> commit·OAuthConfig·config home과
              filesystem semantics를 고정합니다. <strong>근거 범위:</strong> 이
              helper와 unit test입니다. <strong>일반화 금지:</strong> browser 실행,
              loopback listener, state 소비, HTTP token exchange, OS keychain,
              revocation과 concurrent refresh가 완결됐다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>

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

        <ExplainedFormula
          question="Authorization server가 원래 login을 시작한 CLI인지 어떻게 확인할까?"
          idea={<>CLI가 추측하기 어려운 verifier를 먼저 만들고, 그 원문 대신 SHA-256 digest를 URL-safe 문자열로 바꾼 challenge만 authorization request에 보냅니다. Token 교환 때 verifier를 제출하면 server가 같은 변환을 다시 계산해 비교합니다.</>}
          formula={String.raw`\operatorname{challenge}=\operatorname{BASE64URL}\!\left(\operatorname{SHA256}\!\left(\operatorname{ASCII}(\operatorname{verifier})\right)\right)`}
          annotatedFormula={String.raw`\operatorname{challenge}=\underbrace{\operatorname{BASE64URL}\!\left(\operatorname{SHA256}\!\left(\operatorname{ASCII}(\operatorname{verifier})\right)\right)}_{\text{허용 경계 판정}}`}
          operations={[
            { expression: String.raw`\operatorname{BASE64URL}\!\left(\operatorname{SHA256}\!\left(\operatorname{ASCII}(\operatorname{verifier})\right)\right)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","CLI가 추측하기 어려운 verifier를 먼저 만들고, 그","원문 대신 SHA-256 digest를 URL-safe","문자열로 바꾼 challenge만 authorization"] },
          ]}
          terms={[
            { symbol: "verifier", name: "code verifier", description: "각 login attempt마다 CSPRNG로 새로 만든 비밀 문자열입니다." },
            { symbol: "SHA256", name: "one-way digest", description: "verifier를 256-bit digest로 바꾸며 challenge에서 원문을 되찾기 어렵게 합니다." },
            { symbol: "BASE64URL", name: "URL-safe encoding", description: "digest bytes를 query parameter에 넣을 수 있는 padding 없는 문자열로 표현합니다." },
            { symbol: "challenge", name: "code challenge", description: "authorization request에 공개되고 token endpoint가 나중에 verifier와 대조하는 값입니다." },
          ]}
          assumptions={[
            "verifier는 충분한 entropy를 가진 CSPRNG로 만들고 login attempt 사이에 재사용하지 않습니다.",
            "authorization server가 S256을 지원하고 token 교환에서 verifier를 실제로 검증합니다.",
            "state는 별도로 생성·비교·한 번만 소비하며 TLS와 redirect URI 검증도 유지합니다.",
          ]}
          interpretation="challenge가 같으면 제출한 verifier가 앞서 commit한 값과 일치한다는 근거가 됩니다. 이 식만으로 callback CSRF, 악성 redirect, token 탈취나 local credential file 권한까지 막히는 것은 아닙니다."
        />

        <div id="paper-oauth-pkce" className="scroll-mt-24">
          <CitationBlock
            source="RFC 7636 · RFC 8252 — PKCE and native apps"
            href="https://www.rfc-editor.org/rfc/rfc7636"
            citeKey={4}
          >
            <p>
              <strong>문제:</strong> public client의 authorization code 탈취와
              native app redirect 위험을 줄입니다. <strong>기여:</strong> RFC
              7636은 verifier·S256 검증을, RFC 8252는 external browser·loopback
              redirect 등 native-app profile을 정의합니다. <strong>전제:</strong>
              authorization server 지원, 등록된 client·redirect와 TLS endpoint를
              고정합니다. <strong>근거 범위:</strong> OAuth protocol 요구사항입니다.
              <strong> 일반화 금지:</strong> 특정 provider endpoint·scope나 Claw의
              end-to-end listener·storage 구현을 인증하는 문서는 아닙니다. Native
              app profile은 RFC 8252 원문에서도 함께 확인해야 합니다.
            </p>
          </CitationBlock>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          loopback callback listener는 첫 유효 요청을 처리한 뒤 종료한다
        </h3>
        <p className="leading-7">
          RFC 8252의 native-app profile에서는 loopback interface의 임의 port에
          임시 HTTP listener를 두는 구성을 사용할 수 있습니다. pinned source에는
          loopback URI 생성과 <code>/callback</code> query parsing helper가 있지만,
          listener bind·첫 유효 요청·state single-use·종료 lifecycle까지는 이
          파일의 근거 범위에 없습니다.
        </p>
        <p className="leading-7">
          timeout은 고정된 표준값이 아니라 UX와 위협 모델에 맞춘 설정입니다. timeout·사용자 취소·browser open 실패에서는 listener와 verifier를
          정리하고 code와 query string 전체를 access log에 남기지 않습니다. headless 환경에서는 provider가 지원할 때 Device
          Authorization Grant 같은 별도 flow를 선택합니다.
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
            className="min-w-0 rounded-lg border border-border/70 bg-card p-4"
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
          권장 설계에서는 access token을 memory에 두고 가능한 한 짧게 사용하며,
          refresh token은 project file이 아니라 OS keychain이나 전용 secret
          store에 저장합니다. 그러나 pinned 구현은 config home 아래
          <code>credentials.json</code>에 token set을 저장합니다. 기존 JSON의 다른
          field를 보존하고 temp file을 rename하지만, source만 보면 keychain 사용,
          explicit mode restriction과 directory fsync는 확인되지 않습니다. 여러
          요청의 refresh single flight와 token rotation도 상위 계층에서 확인해야
          합니다.
        </p>
        <p className="leading-7">
          만료 판단에는 clock skew를 두고 refresh가 거부되면 오래된 token으로 계속 재시도하지 말고 다시 login하도록 안내합니다. logout은 local token
          삭제로 끝내지 않고 provider가 revocation을 지원하면 server-side credential도 폐기합니다. 이 전체 과정에서 token 값은 telemetry와
          error message에 나타나지 않아야 합니다.
        </p>
      </div>
    </section>
  );
}
