import CookiePolicyViz from './viz/CookiePolicyViz';
import CookieBannerInlineViz from './viz/CookieBannerInlineViz';
import CookieSecurityInlineViz from './viz/CookieSecurityInlineViz';

export default function CookiePolicy() {
  return (
    <section id="cookie-policy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">쿠키 정책과 기술적 조치</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">쿠키란</h3>
        <p>
          쿠키(Cookie)는 웹사이트가 이용자의 브라우저에 저장하는 소량의 텍스트 데이터.<br />
          서버가 HTTP 응답 헤더의 <code>Set-Cookie</code> 필드로 쿠키를 전송하면, 브라우저가 로컬에 저장하고 이후 동일 도메인 요청 시 자동으로 포함하여 전송한다.<br />
          쿠키는 그 자체로 개인정보는 아니지만, 이용자를 식별하거나 행동을 추적하는 데 사용되면 개인정보에 해당할 수 있다.
        </p>

        <div className="my-8">
          <CookiePolicyViz />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">쿠키의 유형</h3>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">유형</th>
                <th className="text-left px-3 py-2 border-b border-border">목적</th>
                <th className="text-left px-3 py-2 border-b border-border">예시</th>
                <th className="text-left px-3 py-2 border-b border-border">동의 필요</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">필수 쿠키</td>
                <td className="px-3 py-1.5 border-b border-border/30">서비스 기본 기능 유지</td>
                <td className="px-3 py-1.5 border-b border-border/30">세션 ID, 로그인 토큰, CSRF 토큰</td>
                <td className="px-3 py-1.5 border-b border-border/30">불필요</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">분석 쿠키</td>
                <td className="px-3 py-1.5 border-b border-border/30">이용 통계 수집, 서비스 개선</td>
                <td className="px-3 py-1.5 border-b border-border/30">Google Analytics, 페이지 방문 기록</td>
                <td className="px-3 py-1.5 border-b border-border/30">필요</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">기능 쿠키</td>
                <td className="px-3 py-1.5 border-b border-border/30">이용자 설정 저장</td>
                <td className="px-3 py-1.5 border-b border-border/30">언어 설정, 다크모드, 최근 검색어</td>
                <td className="px-3 py-1.5 border-b border-border/30">필요</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">광고 쿠키</td>
                <td className="px-3 py-1.5">타겟 광고, 리타겟팅</td>
                <td className="px-3 py-1.5">Facebook Pixel, 광고 추적 ID</td>
                <td className="px-3 py-1.5">필요</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          필수 쿠키는 서비스 제공에 불가결하므로 동의 없이 설정 가능.<br />
          그 외 분석·기능·광고 쿠키는 이용자의 사전 동의가 필요하다 — 정보통신망법 제22조의2(접근권한 동의)와 개인정보보호법의 적법한 수집 근거가 연동되는 영역.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">동의 의무와 쿠키 배너</h3>
        <div className="my-6">
          <CookieBannerInlineViz />
        </div>
        <p>
          정보통신망법 제22조의2 — 정보통신서비스 제공자는 이용자의 이동통신단말장치(스마트폰, PC 브라우저 포함)에 저장되어 있는 정보에 접근하려면 이용자의 동의를 받아야 한다.<br />
          쿠키는 브라우저에 저장되는 정보이므로 이 조항의 적용을 받는다.
        </p>
        <p>
          쿠키 배너(Cookie Banner)는 이 동의를 받기 위한 UI 요소. 웹사이트 방문 시 화면 하단 또는 팝업으로 표시되며, 다음 정보를 포함해야 한다:
        </p>
        <ul>
          <li><strong>수집 목적</strong> — 각 쿠키 유형별로 왜 사용하는지 설명</li>
          <li><strong>쿠키 유형</strong> — 필수/분석/기능/광고 구분</li>
          <li><strong>거부 방법</strong> — 유형별로 선택적 거부가 가능하도록 토글(Toggle) 제공</li>
          <li><strong>상세 정보 링크</strong> — 쿠키 정책 전문으로 연결되는 링크</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 구현 주의점</strong><br />
          쿠키 배너에서 "모두 수락" 버튼만 크게 표시하고 "거부" 버튼을 숨기면 유효한 동의로 인정받기 어렵다.<br />
          "수락"과 "거부"를 동등한 크기·위치로 배치하고, 유형별 세부 선택이 가능해야 한다.<br />
          EU의 GDPR(General Data Protection Regulation, 유럽 개인정보 보호 규정)은 이를 더 엄격하게 요구하며, 글로벌 서비스를 운영하는 VASP는 GDPR 기준도 함께 고려해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">거부 시 영향 범위</h3>
        <p>
          이용자가 분석·광고 쿠키를 거부하면 해당 기능이 제한될 수 있다.<br />
          처리방침(또는 쿠키 정책)에 거부 시 영향을 구체적으로 명시해야 한다:
        </p>
        <ul>
          <li><strong>분석 쿠키 거부</strong> — 이용 통계에서 제외. 서비스 이용에는 영향 없음</li>
          <li><strong>기능 쿠키 거부</strong> — 언어·테마 설정이 매 방문 시 초기화. 핵심 서비스 이용은 가능</li>
          <li><strong>광고 쿠키 거부</strong> — 맞춤형 광고 대신 일반 광고 표시. 서비스 이용에는 영향 없음</li>
          <li><strong>필수 쿠키 거부</strong> — 로그인, 장바구니 등 핵심 기능 작동 불가. 거부 시 서비스 이용 자체가 제한될 수 있음을 안내</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">기술적 보안 조치: 쿠키 속성 설정</h3>
        <div className="my-6">
          <CookieSecurityInlineViz />
        </div>
        <p>
          쿠키 자체의 보안도 중요하다. 쿠키에 민감한 정보(세션 ID, 인증 토큰)가 담기면 탈취 시 세션 하이재킹(Session Hijacking, 타인의 로그인 세션을 가로채는 공격)이 가능하기 때문.<br />
          HTTP 응답 헤더에서 설정할 수 있는 보안 속성 3가지:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">속성</th>
                <th className="text-left px-3 py-2 border-b border-border">설정값</th>
                <th className="text-left px-3 py-2 border-b border-border">효과</th>
                <th className="text-left px-3 py-2 border-b border-border">방어 대상</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">HttpOnly</td>
                <td className="px-3 py-1.5 border-b border-border/30"><code>HttpOnly</code></td>
                <td className="px-3 py-1.5 border-b border-border/30">JavaScript에서 쿠키 접근 차단</td>
                <td className="px-3 py-1.5 border-b border-border/30">XSS(Cross-Site Scripting) 공격</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">Secure</td>
                <td className="px-3 py-1.5 border-b border-border/30"><code>Secure</code></td>
                <td className="px-3 py-1.5 border-b border-border/30">HTTPS 연결에서만 쿠키 전송</td>
                <td className="px-3 py-1.5 border-b border-border/30">네트워크 도청(Man-in-the-Middle)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">SameSite</td>
                <td className="px-3 py-1.5"><code>Strict</code> / <code>Lax</code> / <code>None</code></td>
                <td className="px-3 py-1.5">교차 사이트 요청 시 쿠키 전송 제어</td>
                <td className="px-3 py-1.5">CSRF(Cross-Site Request Forgery) 공격</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          <code>HttpOnly</code> — XSS 공격으로 악성 스크립트가 삽입되더라도 <code>document.cookie</code>로 쿠키 값을 읽을 수 없다. 세션 쿠키, 인증 토큰에 반드시 설정.<br />
          <code>Secure</code> — HTTP(평문) 연결에서는 쿠키가 전송되지 않으므로, 네트워크 상에서 쿠키가 평문으로 노출되는 것을 방지.<br />
          <code>SameSite=Strict</code> — 다른 사이트에서 오는 모든 요청에 쿠키를 포함하지 않는다. CSRF 방어에 가장 강력하지만, 외부 링크로 접근 시 로그인이 풀리는 불편이 있다.<br />
          <code>SameSite=Lax</code> — GET 요청(링크 클릭)에는 쿠키를 포함하되, POST 등 상태 변경 요청에는 포함하지 않는다. 실무에서 가장 많이 사용하는 균형점.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} VASP 쿠키 설정 권장사항</strong><br />
          VASP는 금융 서비스 성격이 강하므로 세션 쿠키에 <code>HttpOnly; Secure; SameSite=Strict</code>를 모두 적용하는 것을 권장한다.<br />
          출금·이체 등 자산 이동이 수반되는 요청에서 CSRF 공격이 성공하면 직접적인 금전 피해로 이어지기 때문.<br />
          ISMS-P 심사에서는 2.10(시스템 및 서비스 보안관리) 항목에서 쿠키 보안 설정을 점검한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">쿠키 외 추적 기술</h3>
        <p>
          최근에는 쿠키 외에도 다양한 추적 기술이 사용된다. 이들도 쿠키와 동일한 동의 의무가 적용:
        </p>
        <ul>
          <li><strong>웹 비콘(Web Beacon)</strong> — 1x1 픽셀 이미지를 삽입하여 이메일 열람 여부나 페이지 방문을 추적하는 기법</li>
          <li><strong>로컬 스토리지(Local Storage)</strong> — 브라우저의 <code>localStorage</code>에 데이터를 저장. 쿠키보다 용량이 크고 만료 기한이 없어 장기 추적에 사용</li>
          <li><strong>핑거프린팅(Browser Fingerprinting)</strong> — 브라우저 버전, 화면 해상도, 설치된 플러그인 등을 조합하여 이용자를 식별하는 기법. 쿠키 삭제로 회피 불가</li>
          <li><strong>SDK 추적</strong> — 모바일 앱에서 분석·광고 SDK가 기기 식별자(ADID, IDFA)를 수집하여 행동을 추적</li>
        </ul>

        <p>
          처리방침에는 쿠키뿐만 아니라 이러한 추적 기술의 사용 여부와 목적도 함께 기재해야 한다.<br />
          특히 핑거프린팅은 이용자가 거부하기 어렵다는 특성이 있으므로, 사용 시 동의 근거를 더욱 명확히 해야 한다.
        </p>

      </div>
    </section>
  );
}
