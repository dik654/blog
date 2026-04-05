export default function PrivacyWebAudit() {
  return (
    <section id="privacy-web-audit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개인정보 · 웹사이트 점검</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          ISMS-P 3.x(개인정보 처리단계별 요구사항) 영역.<br />
          심사원이 직접 웹 브라우저를 열고 서비스에 접속하여 확인한다.<br />
          기술적 설정 점검이 아니라 "사용자 관점에서 법적 요건이 충족되는가"를 눈으로 보는 방식.
        </p>

        {/* --- 개인정보 처리방침 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">1. 개인정보 처리방침 확인</h3>
        <p>
          심사원이 가장 먼저 하는 행동 — 서비스 메인 페이지 하단으로 스크롤.<br />
          "개인정보 처리방침" 링크가 있는지 확인한다.
        </p>

        <h4 className="text-lg font-medium mt-4 mb-2">링크 존재 여부</h4>
        <ul>
          <li>메인 페이지 하단(Footer)에 "개인정보 처리방침" 링크가 있어야 한다</li>
          <li>링크가 없거나 깨져있으면 즉시 결함</li>
          <li>링크 텍스트가 "Privacy Policy"만 있고 한글이 없으면 — 한국어 서비스에서는 지적 가능</li>
        </ul>

        <h4 className="text-lg font-medium mt-4 mb-2">처리방침 필수 기재 항목 (개인정보보호법 제30조)</h4>
        <p>
          심사원은 처리방침 내용을 읽으며 법정 필수 8개 항목이 모두 기재돼 있는지 하나씩 확인한다:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">번호</th>
                <th className="text-left px-3 py-2 border-b border-border">필수 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">결함 사례</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">1</td>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">개인정보 처리 목적</td>
                <td className="px-3 py-1.5 border-b border-border/30">"서비스 제공"만 적고 구체적 목적 미기재</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">2</td>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">처리하는 개인정보 항목</td>
                <td className="px-3 py-1.5 border-b border-border/30">실제 수집하는 항목과 방침의 항목이 불일치</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">3</td>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">처리 및 보유 기간</td>
                <td className="px-3 py-1.5 border-b border-border/30">보유 기간 미명시 또는 "필요 시까지"처럼 불명확</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">4</td>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">제3자 제공 사항</td>
                <td className="px-3 py-1.5 border-b border-border/30">제공하고 있으면서 방침에 미기재</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">5</td>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">파기 절차 및 방법</td>
                <td className="px-3 py-1.5 border-b border-border/30">파기 방법(덮어쓰기, 물리파괴 등) 미명시</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">6</td>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">정보주체의 권리·의무·행사방법</td>
                <td className="px-3 py-1.5 border-b border-border/30">열람/정정/삭제 요청 방법 미안내</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">7</td>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">안전성 확보 조치</td>
                <td className="px-3 py-1.5 border-b border-border/30">기술적/관리적 보호 조치 미기재</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">8</td>
                <td className="px-3 py-1.5 font-medium">개인정보 보호책임자</td>
                <td className="px-3 py-1.5">이름/부서/연락처 중 일부 누락</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 처리방침 변경 이력</strong><br />
          심사원은 "처리방침이 마지막으로 변경된 날짜"를 확인한다.
          서비스가 업데이트됐는데 처리방침이 1년 이상 변경되지 않았으면
          "실제 처리 현황과 방침이 불일치할 가능성"으로 지적.
          변경 이력을 처리방침 하단에 표시하는 것이 좋다 — "시행일: 2026.03.01 (이전 버전 보기)".
        </p>

        {/* --- 동의 화면 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2. 동의 화면 확인</h3>
        <p>
          심사원이 직접 회원가입 페이지에 접속하여 확인하는 항목:
        </p>
        <ul>
          <li>
            <strong>필수/선택 구분</strong> — 개인정보 수집 동의가 "필수 동의"와 "선택 동의"로 명확히 분리돼 있는지.<br />
            하나의 체크박스로 전체 동의를 받는 것은 결함 (포괄 동의 금지)
          </li>
          <li>
            <strong>사전 체크 금지</strong> — 체크박스가 미리 체크(checked) 상태로 돼 있으면 결함.<br />
            사용자가 직접 체크해야 유효한 동의
          </li>
          <li>
            <strong>동의 없이 진행 차단</strong> — 필수 동의를 하지 않고 "다음" 버튼을 누르면 진행이 차단되는지
          </li>
          <li>
            <strong>수집 항목 명시</strong> — "이름, 이메일, 전화번호를 수집합니다"처럼 구체적 항목이 표시되는지
          </li>
          <li>
            <strong>목적 명시</strong> — 각 항목을 "왜" 수집하는지 목적이 표시되는지
          </li>
          <li>
            <strong>보유 기간 명시</strong> — "회원 탈퇴 시까지" 또는 구체적 기간이 표시되는지
          </li>
        </ul>

        <p>
          증적 준비: 회원가입 화면 전체 캡처 (스크롤 포함), 필수/선택 동의 화면, 동의 거부 시 차단 화면.
        </p>

        {/* --- 에러 페이지 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3. 에러 페이지 확인</h3>
        <p>
          심사원: 존재하지 않는 URL을 직접 입력하여 접속 시도.<br />
          예: <code>https://example.com/asdfjkl123</code>
        </p>
        <ul>
          <li><strong>404 페이지</strong> — 커스텀 에러 페이지가 표시되는지 확인</li>
          <li><strong>정보 노출 금지</strong> — 다음이 노출되면 결함:
            <ul>
              <li>스택 트레이스(Stack Trace) — Java, Python 등의 에러 추적 정보</li>
              <li>서버 버전 — "nginx/1.18.0", "Apache/2.4.41"</li>
              <li>내부 경로 — "/home/deploy/app/src/controllers/user.js:42"</li>
              <li>DB 에러 메시지 — "MySQL Error 1045: Access denied"</li>
            </ul>
          </li>
        </ul>

        <div className="not-prose bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <p className="text-muted-foreground"># nginx — 서버 버전 노출 방지 설정</p>
          <p>server_tokens off;</p>
          <br />
          <p className="text-muted-foreground"># 확인 방법 — 응답 헤더에서 Server 항목 확인</p>
          <p>$ curl -I https://example.com</p>
          <p>Server: nginx            <span className="text-muted-foreground">← 양호: 버전 미노출</span></p>
          <p>Server: nginx/1.18.0     <span className="text-muted-foreground">← 결함: 버전 노출</span></p>
          <br />
          <p className="text-muted-foreground"># Apache — 서버 버전 노출 방지</p>
          <p>ServerTokens Prod</p>
          <p>ServerSignature Off</p>
        </div>

        <p>
          심사원은 HTTP 응답 헤더도 확인한다. <code>X-Powered-By: Express</code>, <code>X-AspNet-Version</code> 같은 헤더가 있으면 프레임워크 정보 노출로 지적 가능.
        </p>

        {/* --- 비밀번호 생성 규칙 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">4. 비밀번호 생성 규칙 표시</h3>
        <p>
          심사원: 회원가입 페이지에서 비밀번호 입력란 확인.<br />
          확인 사항:
        </p>
        <ul>
          <li><strong>규칙 안내 텍스트</strong> — "영문, 숫자, 특수문자를 포함하여 8자 이상"처럼 규칙이 화면에 표시되는지</li>
          <li><strong>실시간 검증</strong> — 규칙에 맞지 않는 비밀번호 입력 시 즉시 경고 메시지가 표시되는지</li>
          <li><strong>서버 측 검증</strong> — 클라이언트 검증만 있고 서버 검증이 없으면 우회 가능 → 서버에서도 동일 규칙 적용 필수</li>
          <li><strong>연속 문자/반복 문자 제한</strong> — "1234", "aaaa" 같은 패턴 차단 여부 (권장 사항)</li>
        </ul>

        {/* --- 회원탈퇴 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">5. 회원탈퇴 절차</h3>
        <p>
          심사원: "회원탈퇴 경로 보여주세요."<br />
          개인정보보호법상 정보주체는 언제든 동의를 철회(탈퇴)할 수 있어야 한다.
        </p>
        <ul>
          <li>
            <strong>접근성</strong> — 탈퇴 버튼이 찾기 어려운 곳에 숨겨져 있으면 지적.<br />
            "마이페이지 → 설정 → 계정관리 → 회원탈퇴"처럼 3단계 이내가 권장
          </li>
          <li>
            <strong>탈퇴 안내</strong> — 탈퇴 시 어떤 정보가 파기/보관되는지 안내 텍스트 표시 여부
          </li>
          <li>
            <strong>분리보관 안내</strong> — 법적 보존 의무가 있는 정보(전자상거래법 등)는 분리보관됨을 안내
          </li>
          <li>
            <strong>즉시 처리</strong> — 탈퇴 요청 후 불필요한 대기 기간(예: "30일 후 처리") 없이 즉시 처리되는지
          </li>
        </ul>

        <p>
          심사원이 후속 확인하는 것:
        </p>
        <ul>
          <li>탈퇴 후 DB에서 개인정보가 실제로 삭제/비식별화됐는지 — DB 직접 조회</li>
          <li>분리보관 DB가 별도로 존재하는지 — 분리보관 테이블/DB 구조 확인</li>
          <li>분리보관된 정보의 접근 통제 — 일반 서비스에서 접근 불가해야 함</li>
        </ul>

        {/* --- HTTPS --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">6. HTTPS 적용</h3>
        <p>
          심사원이 브라우저에서 직접 확인:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">확인 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">확인 방법</th>
                <th className="text-left px-3 py-2 border-b border-border">결함 조건</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">HTTPS 적용</td>
                <td className="px-3 py-1.5 border-b border-border/30">브라우저 주소창 자물쇠 아이콘 확인</td>
                <td className="px-3 py-1.5 border-b border-border/30">HTTP로 서비스 운영</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">HTTP → HTTPS 리다이렉트</td>
                <td className="px-3 py-1.5 border-b border-border/30"><code>http://</code>로 접속 시 자동 전환되는지</td>
                <td className="px-3 py-1.5 border-b border-border/30">HTTP 접속이 그대로 유지됨</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">인증서 유효 기간</td>
                <td className="px-3 py-1.5 border-b border-border/30">자물쇠 클릭 → 인증서 상세 → 만료일</td>
                <td className="px-3 py-1.5 border-b border-border/30">만료 임박(30일 이내) 또는 이미 만료</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">TLS 버전</td>
                <td className="px-3 py-1.5 border-b border-border/30">브라우저 개발자 도구 → Security 탭</td>
                <td className="px-3 py-1.5 border-b border-border/30">TLS 1.0 또는 1.1 사용 (1.2 이상 필수)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">혼합 콘텐츠(Mixed Content)</td>
                <td className="px-3 py-1.5">HTTPS 페이지에서 HTTP 리소스 로딩</td>
                <td className="px-3 py-1.5">이미지/스크립트가 HTTP로 로딩됨</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="not-prose bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <p className="text-muted-foreground"># TLS 버전 확인 (CLI)</p>
          <p>$ openssl s_client -connect example.com:443 -tls1_2 2{'>'}/dev/null | head -5</p>
          <p className="text-muted-foreground mt-1"># 접속 성공하면 TLS 1.2 지원</p>
          <br />
          <p className="text-muted-foreground"># 약한 암호 스위트 확인</p>
          <p>$ nmap --script ssl-enum-ciphers -p 443 example.com</p>
          <p className="text-muted-foreground mt-1"># Grade A/B가 아닌 C 이하의 cipher가 있으면 지적 가능</p>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 인증서 자동 갱신</strong><br />
          Let's Encrypt 무료 인증서는 90일 유효기간. certbot 자동 갱신이 제대로 설정돼 있지 않으면
          심사 시점에 만료돼 있을 수 있다. <code>certbot renew --dry-run</code>으로 갱신 테스트를 사전에 확인.
          유료 인증서라도 만료 30일 전 알림 설정이 필수.
        </p>

        {/* --- 쿠키 동의 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">7. 쿠키 배너</h3>
        <p>
          심사원이 서비스에 처음 접속할 때 쿠키 동의 배너/팝업이 표시되는지 확인.<br />
          특히 마케팅 쿠키, 분석 쿠키(Google Analytics 등)를 사용하는 경우:
        </p>
        <ul>
          <li><strong>동의 전 쿠키 설치 금지</strong> — 동의 버튼을 누르기 전에 이미 쿠키가 설치돼 있으면 결함</li>
          <li><strong>거부 옵션</strong> — "동의" 버튼만 있고 "거부" 옵션이 없으면 지적</li>
          <li><strong>쿠키 종류별 선택</strong> — 필수 쿠키/분석 쿠키/마케팅 쿠키를 구분하여 선택적 동의 가능해야 함</li>
          <li><strong>쿠키 정책 링크</strong> — 쿠키 배너에서 상세 쿠키 정책 페이지로 이동 가능한 링크</li>
        </ul>

        {/* --- 종합 체크리스트 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">현장심사 대응 종합 체크리스트</h3>
        <p>
          마지막으로, 현장심사 전 최종 확인 항목을 정리:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">영역</th>
                <th className="text-left px-3 py-2 border-b border-border">최종 확인 항목</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">서버</td>
                <td className="px-3 py-1.5 border-b border-border/30">SSH 설정, 패스워드 정책, 불필요 포트 차단, 패치 현황, 커널 버전</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">네트워크</td>
                <td className="px-3 py-1.5 border-b border-border/30">방화벽 ANY 규칙 제거, 망분리 ping 테스트, 장비 기본 계정 변경</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">계정</td>
                <td className="px-3 py-1.5 border-b border-border/30">장기 미접속 계정 정리, 공용 계정 대장, MFA 적용, 권한 검토 기록</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">로그</td>
                <td className="px-3 py-1.5 border-b border-border/30">로그 수집 확인, 보존 기간 충족, 위변조 방지, NTP 동기화</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">백업</td>
                <td className="px-3 py-1.5 border-b border-border/30">백업 스케줄 확인, 암호화 여부, 복구 테스트 보고서, 소산 백업</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">웹사이트</td>
                <td className="px-3 py-1.5 border-b border-border/30">처리방침 8개 항목, 동의 화면, 에러 페이지, HTTPS, 쿠키 배너</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">문서</td>
                <td className="px-3 py-1.5">정책서 최종 수정일, 점검 보고서 연속성, 변경 이력 대장, 교육 수료 기록</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 심사 당일 마음가짐</strong><br />
          심사원은 "결함을 찾으러 오는 사람"이 아니라 "관리체계가 작동하는지 확인하러 오는 사람"이다.
          완벽한 조직은 없다. 결함이 나와도 보완조치를 성실히 수행하면 인증을 받을 수 있다.
          중요한 것은 투명성 — 문제를 숨기려 하면 심사원의 신뢰를 잃고 더 깊이 파고들게 된다.
          "이 부분은 현재 미흡하며 이렇게 개선할 계획입니다"라고 솔직하게 말하는 것이 훨씬 낫다.
        </p>

      </div>
    </section>
  );
}
