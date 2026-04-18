import OverviewViz from './viz/OverviewViz';
import MfaFlowViz from './viz/MfaFlowViz';
import SessionControlViz from './viz/SessionControlViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인증 체계 설계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <OverviewViz />

        <h3 className="text-xl font-semibold mt-2 mb-3">왜 인증이 필요한가</h3>
        <p>
          ISMS 보호대책 2.5(인증 및 권한관리)는 "정보시스템에 접근하는 사용자가 본인인지 확인하고, 업무에 필요한 최소한의 권한만 부여하라"는 요구사항.<br />
          인증(Authentication)은 "너는 누구인가"를 확인하는 절차이고, 인가(Authorization)는 "너는 무엇을 할 수 있는가"를 결정하는 절차.<br />
          이 두 개념이 혼동되면 보안 설계에 구멍이 생긴다 — 인증을 통과했다고 모든 자원에 접근할 수 있는 것이 아니다.
        </p>

        <p>
          VASP(가상자산사업자) 환경에서 인증 실패의 결과는 특히 치명적.<br />
          공격자가 관리자 계정을 탈취하면 핫월렛(Hot Wallet, 온라인 지갑) 출금 승인 권한까지 확보할 수 있다.<br />
          단일 비밀번호만으로 보호하는 시스템은 피싱(Phishing, 가짜 사이트로 유인해 자격증명 탈취), 크리덴셜 스터핑(Credential Stuffing, 유출된 아이디/비밀번호 조합을 여러 사이트에 시도), 키로거(Keylogger, 키 입력 기록 악성코드) 공격에 취약.<br />
          따라서 다중인증(MFA)이 필수이며, 권한 분리를 통해 단일 계정의 피해 범위를 제한해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">인증 3요소</h3>
        <p>
          인증 수단은 세 가지 범주로 분류. 각 범주의 특성과 취약점이 다르므로, 서로 다른 범주를 조합해야 효과적.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">요소</th>
                <th className="text-left px-3 py-2 border-b border-border">정의</th>
                <th className="text-left px-3 py-2 border-b border-border">예시</th>
                <th className="text-left px-3 py-2 border-b border-border">취약점</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">지식(Knowledge)</td>
                <td className="px-3 py-1.5 border-b border-border/30">사용자가 아는 것</td>
                <td className="px-3 py-1.5 border-b border-border/30">비밀번호, PIN, 보안 질문</td>
                <td className="px-3 py-1.5 border-b border-border/30">피싱, 무차별 대입, 사전 공격</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">소유(Possession)</td>
                <td className="px-3 py-1.5 border-b border-border/30">사용자가 가진 것</td>
                <td className="px-3 py-1.5 border-b border-border/30">OTP(One-Time Password) 앱, 보안 토큰, 스마트카드</td>
                <td className="px-3 py-1.5 border-b border-border/30">분실, SIM 스와핑, 물리적 탈취</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">생체(Inherence)</td>
                <td className="px-3 py-1.5">사용자 자체의 특성</td>
                <td className="px-3 py-1.5">지문, 홍채, 안면 인식</td>
                <td className="px-3 py-1.5">위조(딥페이크), 센서 오류, 변경 불가(유출 시 대체 수단 없음)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          같은 범주 내에서 두 가지를 조합하는 것은 MFA가 아니다.<br />
          비밀번호 + 보안 질문은 둘 다 "지식" 요소이므로 단일 요소 인증과 동일한 수준.<br />
          비밀번호(지식) + OTP(소유)처럼 서로 다른 범주를 결합해야 진정한 MFA.
        </p>

        <MfaFlowViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">MFA(Multi-Factor Authentication) 필수 적용 범위</h3>
        <p>
          ISMS 2.5 기준에서 MFA를 반드시 적용해야 하는 영역:
        </p>
        <ul>
          <li><strong>관리자 페이지</strong> — 서버 설정, 사용자 관리, 권한 변경 등 시스템 전반에 영향을 미치는 기능. 비밀번호 인증 후 OTP 2차 인증을 거쳐야 접근 가능</li>
          <li><strong>VPN(Virtual Private Network) 접속</strong> — 외부에서 내부망에 접근하는 통로. 인증서 + OTP 조합 또는 비밀번호 + OTP 조합 적용</li>
          <li><strong>월렛 서명/출금 승인</strong> — VASP 고유 영역. 출금 요청 → 1차 승인자 MFA → 2차 승인자 MFA → 실행의 다단계 구조 필요</li>
          <li><strong>DB 접근</strong> — 접근제어 소프트웨어를 통한 세션 인증 + OTP. 직접 DB 접속은 원칙적으로 차단</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} OTP 방식 선택</strong><br />
          SMS OTP는 SIM 스와핑(공격자가 통신사를 속여 피해자 번호를 자기 SIM에 옮기는 공격) 위험이 있어 권장하지 않는다.
          TOTP(Time-based One-Time Password, 시간 기반 일회용 비밀번호) 앱이나 FIDO2(Fast Identity Online, 생체/보안키 기반 인증 표준) 하드웨어 키가 더 안전한 선택.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">중복 로그인 제한</h3>
        <p>
          동일 계정으로 여러 세션이 동시에 활성화되면 두 가지 위험 발생.<br />
          첫째, 계정 공유 — 하나의 관리자 계정을 여러 명이 사용하면 행위 추적이 불가능해진다.<br />
          둘째, 세션 하이재킹(Session Hijacking, 다른 사람의 세션 토큰을 탈취하여 대신 접속) — 정상 사용자와 공격자가 동시에 접속한 상황을 탐지하기 어렵다.
        </p>
        <p>
          대응책: 관리자 계정은 단일 세션만 허용, 새 로그인 시 기존 세션 강제 종료.<br />
          일반 사용자 계정도 동시 접속 수를 제한(예: 최대 3개)하고, 비정상적 동시 접속 시 알림 발생.
        </p>

        <SessionControlViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">권한 분리 체계</h3>
        <p>
          모든 사용자를 동일한 권한 수준으로 관리하면 내부자 위협에 무방비.<br />
          최소 3단계로 권한을 분리하는 것이 ISMS 기준의 기본 요구:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">등급</th>
                <th className="text-left px-3 py-2 border-b border-border">역할</th>
                <th className="text-left px-3 py-2 border-b border-border">권한 범위</th>
                <th className="text-left px-3 py-2 border-b border-border">인증 수준</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">일반 사용자</td>
                <td className="px-3 py-1.5 border-b border-border/30">서비스 이용자, 일반 직원</td>
                <td className="px-3 py-1.5 border-b border-border/30">자기 데이터 조회/수정만 가능</td>
                <td className="px-3 py-1.5 border-b border-border/30">비밀번호 + OTP (선택)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">관리자</td>
                <td className="px-3 py-1.5 border-b border-border/30">운영팀, CS팀, 개발팀</td>
                <td className="px-3 py-1.5 border-b border-border/30">담당 업무 범위 내 시스템 운영. 읽기 위주, 쓰기는 승인 후</td>
                <td className="px-3 py-1.5 border-b border-border/30">비밀번호 + OTP (필수)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">슈퍼관리자</td>
                <td className="px-3 py-1.5">CISO, 시스템 관리자 (최소 인원)</td>
                <td className="px-3 py-1.5">계정 생성/삭제, 권한 변경, 시스템 설정</td>
                <td className="px-3 py-1.5">비밀번호 + OTP + 접근 IP 제한</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          슈퍼관리자 계정은 2인 이상 지정하되, 일상 업무에는 관리자 계정을 사용하고 슈퍼관리자 권한은 필요한 순간에만 활성화하는 것이 원칙.<br />
          이를 "특권 계정 관리(PAM, Privileged Access Management)"라 하며, 사용 시마다 사유 기록과 사후 검토가 필수.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 역할 기반 접근제어(RBAC)</strong><br />
          Role-Based Access Control — 개인이 아닌 역할(Role)에 권한을 부여하고, 사용자를 역할에 매핑하는 모델.
          직원의 부서 이동이나 직책 변경 시 역할만 재배정하면 되므로 관리 부담이 크게 감소.
          VASP에서는 "거래 모니터링 담당자", "월렛 운영자", "KYC 심사자" 등 업무 단위로 역할을 정의하는 것이 일반적.
        </p>

      </div>
    </section>
  );
}
