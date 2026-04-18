import PasswordPolicyViz from './viz/PasswordPolicyViz';
import HashStorageViz from './viz/HashStorageViz';
import PasswordResetViz from './viz/PasswordResetViz';

export default function PasswordPolicy() {
  return (
    <section id="password-policy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비밀번호 정책과 생명주기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PasswordPolicyViz />

        <h3 className="text-xl font-semibold mt-2 mb-3">비밀번호 생성 규칙</h3>
        <p>
          ISMS 2.5.2는 비밀번호의 복잡도와 길이에 대한 최소 기준을 요구.<br />
          약한 비밀번호는 무차별 대입(Brute Force, 가능한 모든 조합을 시도하는 공격)이나 사전 공격(Dictionary Attack, 자주 쓰이는 단어/패턴을 우선 시도하는 공격)에 수분 내 뚫린다.<br />
          조직이 설정해야 하는 최소 기준:
        </p>
        <ul>
          <li><strong>길이</strong> — 최소 8자 이상. 관리자 계정은 10자 이상 권장. 길이가 복잡도보다 엔트로피(Entropy, 비밀번호의 예측 불가능성을 나타내는 수치) 기여도가 높다</li>
          <li><strong>구성</strong> — 영문 대소문자 + 숫자 + 특수문자 중 3종 이상 조합. 두 종류만 사용하면 10자 이상 필요</li>
          <li><strong>금지 패턴</strong> — 연속 문자(abc, 123), 반복 문자(aaa), 아이디 포함, 사전 단어, 키보드 배열(qwerty) 금지</li>
          <li><strong>유사도 검사</strong> — 이전 비밀번호와 80% 이상 유사한 새 비밀번호 거부. 단순히 끝에 숫자만 바꾸는 패턴 차단</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 엔트로피 비교</strong><br />
          8자 소문자(26^8 = 약 2,000억 조합) vs 12자 소문자(26^12 = 약 9.5경 조합).<br />
          단순히 길이를 4자 늘리는 것만으로 탐색 공간이 47만 배 증가한다.
          따라서 복잡도 규칙을 과도하게 강제하기보다 길이를 늘리는 편이 보안과 사용성 모두에 유리.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">변경 주기</h3>
        <p>
          비밀번호 변경 주기는 보안과 사용성 사이의 균형점.<br />
          ISMS 기준은 최소 반기(6개월) 1회 변경을 요구하며, 대부분의 조직은 90일(분기) 주기를 적용.
        </p>
        <ul>
          <li><strong>일반 계정</strong> — 90일마다 변경 강제. 변경 알림은 만료 14일 전부터 로그인 시 팝업</li>
          <li><strong>관리자 계정</strong> — 60일 주기 권장. 더 짧은 주기가 부담되면 MFA 강도를 높여 보완</li>
          <li><strong>서비스 계정</strong> — 애플리케이션이 사용하는 계정(DB 접속 등). 수동 변경이 어려우므로 비밀번호 관리 도구(Vault 등)를 통해 자동 교체. 최소 반기 1회</li>
          <li><strong>재사용 금지</strong> — 최근 5회 이내 사용한 비밀번호는 재사용 불가. 해시 이력을 저장하여 비교</li>
        </ul>

        <p>
          변경 주기가 너무 짧으면 사용자가 패턴화된 비밀번호(예: Password01, Password02)를 생성하는 역효과 발생.<br />
          최근 보안 업계 추세는 주기적 강제 변경보다 유출 탐지 시 즉시 변경을 권장하지만,
          ISMS 심사에서는 여전히 주기적 변경 정책의 존재와 이행을 확인한다.
        </p>

        <HashStorageViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">비밀번호 저장: 단방향 해시</h3>
        <p>
          비밀번호를 평문(Plaintext)이나 복호화 가능한 형태로 저장하는 것은 ISMS 부적합 사유.<br />
          DB 유출 시 전체 비밀번호가 즉시 노출되기 때문이다.<br />
          반드시 단방향 해시(One-way Hash) 함수로 변환하여 저장해야 한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">알고리즘</th>
                <th className="text-left px-3 py-2 border-b border-border">특성</th>
                <th className="text-left px-3 py-2 border-b border-border">적합성</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">MD5</td>
                <td className="px-3 py-1.5 border-b border-border/30">128비트 해시. 연산 속도 극히 빠름</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-red-500 font-medium">부적합 — 충돌 공격 가능, 레인보우 테이블(미리 계산된 해시-평문 매핑 테이블) 공격에 취약</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">SHA-1</td>
                <td className="px-3 py-1.5 border-b border-border/30">160비트 해시. MD5보다 안전하나 이미 충돌 발견</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-red-500 font-medium">부적합 — 2017년 실질적 충돌 공격 성공</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">SHA-256</td>
                <td className="px-3 py-1.5 border-b border-border/30">256비트 해시. 현재 안전하지만 범용 해시 함수</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-yellow-600 font-medium">조건부 — salt 추가 시 사용 가능하나, 비밀번호 전용 함수가 더 적합</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">bcrypt</td>
                <td className="px-3 py-1.5 border-b border-border/30">Blowfish 기반. cost factor로 연산 시간 조절 가능</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-green-600 font-medium">적합 — 의도적으로 느린 연산으로 무차별 대입 방어</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">scrypt / Argon2</td>
                <td className="px-3 py-1.5">메모리 집약적 해시. GPU 병렬 공격 저항</td>
                <td className="px-3 py-1.5 text-green-600 font-medium">적합 — bcrypt보다 GPU/ASIC 공격에 강함. Argon2는 2015년 PHC(Password Hashing Competition) 우승</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          bcrypt나 scrypt는 내부에 salt(임의 문자열)를 자동 포함하여 동일 비밀번호라도 다른 해시값을 생성.<br />
          cost factor(반복 횟수)를 높이면 해시 계산에 수백 ms가 소요되어 초당 수십억 회 시도하는 무차별 대입을 현실적으로 불가능하게 만든다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 레거시 마이그레이션</strong><br />
          MD5나 SHA-1로 저장된 기존 비밀번호가 있다면 즉시 마이그레이션 필요.
          전략: 사용자 로그인 시 입력한 평문을 bcrypt로 재해시하여 저장. 미로그인 계정은 다음 로그인 시 강제 변경 유도.
          ISMS 심사에서 "구 해시 잔존 비율"을 확인하므로 마이그레이션 진행률을 추적해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">장기 미접속 계정 처리</h3>
        <p>
          6개월 이상 로그인하지 않은 계정은 자동 잠금 처리.<br />
          잠긴 계정은 본인 확인 후에만 복구 가능하며, 복구 시 비밀번호 즉시 변경을 강제.<br />
          장기 미접속 계정이 위험한 이유:
        </p>
        <ul>
          <li>퇴직자/이직자의 계정이 활성 상태로 남아 있을 가능성 — 외부에서 악용 가능</li>
          <li>유출된 자격증명이 오래된 계정에 유효할 확률 높음 — 비밀번호 변경이 없었으므로</li>
          <li>감사 추적 시 "사용하지 않는 활성 계정" 존재 자체가 ISMS 부적합 사유</li>
        </ul>

        <PasswordResetViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">비밀번호 초기화 절차</h3>
        <p>
          사용자가 비밀번호를 분실했거나 계정이 잠긴 경우의 초기화 절차도 보안 대상.<br />
          초기화 과정 자체가 공격 벡터가 될 수 있다 — 공격자가 "비밀번호 분실"을 가장하여 초기화를 요청하는 사회공학(Social Engineering) 공격.
        </p>
        <ul>
          <li><strong>본인 확인</strong> — 등록된 이메일/휴대폰으로 인증 코드 발송. 관리자 계정은 대면 확인 또는 영상 통화 필수</li>
          <li><strong>임시 비밀번호</strong> — 초기화 시 시스템이 생성한 임시 비밀번호 발급. 유효 시간 제한(예: 24시간)</li>
          <li><strong>즉시 변경 강제</strong> — 임시 비밀번호로 첫 로그인 시 반드시 새 비밀번호 설정. 임시 비밀번호 상태에서는 다른 기능 접근 차단</li>
          <li><strong>초기화 권한</strong> — 일반 사용자는 셀프 서비스, 관리자 계정은 슈퍼관리자(또는 CISO 승인)만 초기화 가능</li>
          <li><strong>이력 기록</strong> — 초기화 요청자, 승인자, 일시, 사유를 로그에 기록. 분기별 검토 대상</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 비밀번호 정책 산출물</strong><br />
          ISMS 심사에서 확인하는 비밀번호 관련 증적: (1) 비밀번호 정책서 (2) 시스템 설정 스크린샷(복잡도·주기·잠금 설정) (3) 해시 알고리즘 확인서 (4) 초기화 이력 대장 (5) 장기 미접속 계정 처리 내역.
          정책서에 기준을 명시해 놓고 시스템에 실제로 적용하지 않은 경우 "서면과 현실 불일치"로 부적합.
        </p>

      </div>
    </section>
  );
}
