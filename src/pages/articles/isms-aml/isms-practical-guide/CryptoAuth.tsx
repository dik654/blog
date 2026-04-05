import CryptoAuthViz from './viz/CryptoAuthViz';

export default function CryptoAuth() {
  return (
    <section id="crypto-auth" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호화와 인증 — bcrypt 사건</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          ISMS 인증에서 가장 당황했던 순간은 암호화 관련 지적이었다.<br />
          기술적으로 더 강한 방식을 쓰고 있었는데, 심사 기준에 맞지 않아 바꿔야 했다.
        </p>

        <CryptoAuthViz />

        {/* ── bcrypt → SHA-256+Salt ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">bcrypt에서 SHA-256+Salt로 — 기술 ≠ 심사</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          우리 거래소는 회원 비밀번호를 bcrypt로 해싱하여 저장하고 있었다.<br />
          bcrypt는 비밀번호 해싱에 특화된 알고리즘으로, 내부적으로 salt를 자동 생성하고 cost factor로 연산 비용을 조절할 수 있다.<br />
          보안 업계에서는 비밀번호 저장에 bcrypt, scrypt, Argon2를 권장하는 것이 상식이었다.<br />
          당연히 문제없을 거라고 생각했다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">심사원 지적</h4>
        <p>
          심사원이 암호화 적용 현황표를 보더니 이렇게 말했다:<br />
          <em>"국정원 검증 암호모듈 기준에 SHA-256 이상이어야 합니다. bcrypt는 검증 목록에 없습니다."</em>
        </p>
        <p>
          국내 ISMS 인증에서 암호화 알고리즘은 KISA(한국인터넷진흥원)와 국정원이 공동으로 관리하는 "검증 대상 암호 알고리즘 목록"을 기준으로 판단한다.<br />
          이 목록에는 SHA-256, SHA-512, ARIA, SEED 등 국내/국제 표준 알고리즘이 포함되어 있지만, bcrypt는 포함되어 있지 않다.<br />
          bcrypt가 기술적으로 열등해서가 아니라, 국가 검증 체계에서 별도로 심사하지 않은 것.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          SHA-256 + 랜덤 Salt 방식으로 교체했다.<br />
          Salt는 사용자별로 고유하게 생성하여 DB에 별도 컬럼으로 저장.<br />
          해싱 결과 = <code>SHA-256(password + salt)</code> 형태로, salt가 없으면 레인보우 테이블(Rainbow Table, 미리 계산된 해시값 목록) 공격에 취약하므로 salt는 필수.
        </p>
        <p>
          기존 bcrypt 해시값은 일괄 변환이 불가능하므로(해시는 복호화 불가), 마이그레이션 전략을 세웠다:
        </p>
        <ol>
          <li>신규 가입자는 즉시 SHA-256+Salt 적용</li>
          <li>기존 사용자는 다음 로그인 시 입력한 평문 비밀번호를 SHA-256+Salt로 재해싱하여 DB 갱신</li>
          <li>장기 미접속자(6개월 이상)는 비밀번호 재설정 유도</li>
        </ol>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 교훈: 기술적 우수성 ≠ 심사 통과</strong><br />
          bcrypt가 비밀번호 해싱에 더 적합한 알고리즘인 것은 사실이다.
          하지만 ISMS 심사는 "최고의 기술을 쓰고 있는가"가 아니라 "국가 검증 기준에 부합하는가"를 본다.
          심사 준비 시 KISA 검증 알고리즘 목록을 먼저 확인하고, 그 안에서 선택해야 한다.
        </p>

        {/* ── 비밀번호 정책 UI ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">비밀번호 정책 — UI에 규칙을 보여줘야 한다</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          회원가입 페이지에 비밀번호 입력 필드만 있고, 생성 규칙 안내 텍스트가 없었다.<br />
          서버 사이드에서 비밀번호 복잡도를 검증하고 있었지만, 사용자에게 "어떤 규칙을 충족해야 하는지" 사전에 알려주지 않았다.<br />
          비밀번호가 규칙에 맞지 않으면 단순히 "비밀번호가 올바르지 않습니다" 에러만 표시.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          회원가입 화면에 비밀번호 생성 규칙을 실시간으로 보여주도록 수정:
        </p>
        <ul>
          <li>8자 이상</li>
          <li>영문 대/소문자 포함</li>
          <li>숫자 포함</li>
          <li>특수문자 포함</li>
          <li>연속된 문자/숫자 3자 이상 금지 (abc, 123 등)</li>
          <li>아이디와 동일한 문자열 포함 금지</li>
        </ul>
        <p>
          각 규칙 충족 여부를 실시간 체크 표시로 피드백. 모든 규칙 충족 시에만 가입 버튼 활성화.
        </p>

        {/* ── 장기 미접속자 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">장기 미접속자 처리</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          마지막 로그인 일시(<code>last_login</code>)를 DB에 기록하고 있었지만, 이 값을 활용하는 로직이 없었다.<br />
          1년 넘게 접속하지 않은 계정도 아이디/비밀번호만 맞으면 그대로 로그인 가능.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          로그인 시 <code>last_login</code> 기준 6개월 미접속 여부를 체크.<br />
          6개월 이상 미접속 → 계정복구 페이지로 리다이렉트. 본인인증(휴대폰/이메일) 완료 후 비밀번호 재설정 → 로그인 허용.<br />
          관리자 계정도 동일 정책 적용. 관리자는 90일마다 비밀번호 변경을 강제하되, 6개월 미접속 시 계정 잠금 + 복구 절차.
        </p>

        {/* ── 관리자 2차인증 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">관리자 2차인증 — 아이디/비밀번호만으로는 부족</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          관리자 페이지에 아이디와 비밀번호만으로 접속이 가능했다.<br />
          관리자 페이지는 회원 정보 조회, 출금 승인, 시스템 설정 변경 등 민감한 기능이 집중된 곳인데, 1차 인증만 적용.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          2단계 인증 체계를 구축했다:
        </p>
        <ol>
          <li><strong>1차 인증</strong> — 아이디 + 비밀번호 입력. 서버에서 일치 여부 확인</li>
          <li><strong>2차 인증</strong> — 1차 성공 시 본인인증 모달 팝업. 등록된 휴대폰으로 인증번호 발송 → 입력 → 인증 완료</li>
          <li><strong>세션 생성</strong> — 2차 인증까지 완료되어야만 관리자 세션 생성. 세션에 <code>second_auth: true</code> 플래그 기록</li>
        </ol>
        <p>
          모든 관리자 기능은 세션의 <code>second_auth</code> 값을 서버 사이드에서 체크한다.<br />
          프록시 도구로 클라이언트 요청값을 변조해도, 서버에서 세션을 직접 확인하므로 우회 불가.
        </p>

        {/* ── 중복로그인 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">중복로그인 제한</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          같은 계정으로 여러 브라우저/기기에서 동시 접속이 가능했다.<br />
          계정 탈취 시 원래 사용자와 공격자가 동시에 로그인한 상태로 있을 수 있는 구조.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          세션 매니저를 도입하여 동일 계정의 동시 접속을 차단했다.<br />
          새로운 로그인 발생 시 기존 세션을 강제 만료시키고, 기존 세션 사용자에게 "다른 기기에서 로그인되어 로그아웃됩니다" 알림 표시.<br />
          관리자 계정도 동일하게 적용 — 동시에 두 명이 같은 관리자 계정을 사용할 수 없다.
        </p>

        {/* ── 카카오 인증 동의서 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">카카오 인증 동의서 — 소셜 로그인의 함정</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          카카오 인증을 통한 로그인/본인확인 기능이 있었는데, 카카오로부터 전달받는 개인정보(이름, 이메일, 전화번호 등)에 대한 별도 동의서가 없었다.<br />
          카카오 OAuth 동의 화면은 카카오 플랫폼에서 제공하는 것이고, 우리 서비스에서의 개인정보 수집·이용 동의는 별개라는 점을 놓쳤다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          카카오 인증 완료 후, 우리 서비스의 개인정보 수집·이용 동의서를 별도로 표시하도록 수정.<br />
          동의 항목: 수집 목적, 수집 항목, 보유 기간을 명시하고, 동의하지 않으면 서비스 가입 불가 처리.<br />
          이미 가입한 기존 사용자에게는 다음 로그인 시 동의서를 표시하여 소급 동의를 받았다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 교훈: 소셜 로그인 동의 ≠ 우리 서비스 동의</strong><br />
          카카오/구글 등 소셜 플랫폼의 OAuth 동의와, 우리 서비스의 개인정보 수집·이용 동의는 완전히 별개.
          소셜 로그인을 도입할 때 "플랫폼 동의가 있으니까 괜찮겠지"라고 생각하면 결함을 받는다.
          우리 서비스에서 직접 수집·이용하는 항목에 대해 별도 동의를 받아야 한다.
        </p>

        {/* ── 비밀번호 변경 주기 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">비밀번호 변경 주기 — 회원과 관리자 모두</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          회원 비밀번호 변경 권유 기능이 없었다. 가입 시 설정한 비밀번호를 평생 사용해도 시스템이 아무 조치를 하지 않았다.<br />
          관리자 계정도 마찬가지 — 비밀번호 변경을 "권장"하는 안내만 있었고, 강제 변경 메커니즘은 없었다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          일반 회원: 비밀번호 변경을 주기적으로 권유하되, 강제하지는 않음(사용자 편의성 고려). 대신 6개월 미접속 시 계정복구 절차를 통해 자연스럽게 비밀번호 재설정 유도.<br />
          관리자: 90일마다 비밀번호 변경을 시스템에서 강제. 90일 초과 시 로그인 불가 → 비밀번호 변경 페이지로 리다이렉트. 변경 시 직전 3개 비밀번호와 동일 여부 검증(재사용 방지).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 교훈 종합</strong><br />
          암호화/인증 영역은 "기술적으로 맞는 것"과 "심사 기준에 맞는 것"이 다를 수 있다.
          KISA 검증 알고리즘 목록을 확인하고, 비밀번호 정책은 시스템에 강제 설정한 뒤 UI에도 표시해야 한다.
          관리자 계정은 2차인증 + 중복로그인 차단 + 주기적 변경이 기본이다.
          소셜 로그인 동의와 자사 서비스 동의는 별개 — 반드시 분리.
        </p>

      </div>
    </section>
  );
}
