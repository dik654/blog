export default function ProtectionMeasures() {
  return (
    <section id="protection-measures" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">보호대책 요구사항 (2.x) 핵심</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          2.x 영역은 64개 세부 항목으로 구성된 "실제 보안 조치"의 집합.<br />
          이 중 VASP 운영에서 가장 빈번하게 결함이 도출되고, 구현 난이도가 높은 8개 분류를 집중 분석한다.
        </p>

        {/* ── 2.2 인적 보안 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2.2 인적 보안</h3>
        <p>
          기술적 보안이 아무리 견고해도 사람이 취약하면 무력화된다.<br />
          내부자 위협(Insider Threat)은 VASP에서 가장 치명적인 공격 벡터 — 개인키에 접근 가능한 인원이 곧 자산에 접근 가능한 인원이므로.
        </p>
        <ul>
          <li>
            <strong>보안 서약서</strong> — 입사 시 + 연 1회 갱신. 비밀유지, 자산 보호, 위반 시 책임을 명시.<br />
            퇴사 시에도 퇴직 보안 서약서를 별도 징구 — 퇴사 후에도 영업비밀 유출 금지 의무가 지속됨을 고지.
          </li>
          <li>
            <strong>정보보호 교육</strong> — 전 임직원 대상 연 1회 이상(최소 1시간).<br />
            교육 내용: 최신 피싱 사례, 비밀번호 관리, 개인정보 처리 주의사항, 사고 신고 절차.<br />
            교육 수료 증적(출석부, 수료증, 교육 자료)을 반드시 보관 — 심사 시 증적 미비는 즉시 결함.
          </li>
          <li>
            <strong>신규입사자 절차</strong> — 교육 완료 후 접근권한 부여가 원칙.<br />
            교육 미수료 상태에서 시스템 접근권한을 부여하면 2.2.4 결함 대상. 입사일과 교육일, 권한 부여일의 시간 순서를 증적으로 증명해야 한다.
          </li>
          <li>
            <strong>퇴사자 절차</strong> — 퇴사일 당일 모든 계정 비활성화/삭제.<br />
            VPN, 사내 메신저, 클라우드 콘솔, Git 저장소, 관리자 포털 등 전 시스템에서 권한 회수.<br />
            회수 확인 체크리스트를 작성하여 누락 방지.
          </li>
        </ul>

        {/* ── 2.4 물리 보안 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2.4 물리 보안</h3>
        <p>
          물리 보안은 "서버실과 데이터에 물리적으로 접근하는 경로"를 통제하는 영역.<br />
          VASP에서는 월렛룸(Wallet Room, 콜드월렛 서명 작업을 수행하는 격리된 물리 공간)이 핵심 통제 대상.
        </p>
        <ul>
          <li>
            <strong>출입통제 구역 설정</strong> — 사무실, 서버실, 월렛룸을 각각 별도 보안 구역으로 분류.<br />
            월렛룸은 최고 보안 구역 — 지문+카드 이중 인증, CCTV 24시간 녹화, 동행 원칙(1인 출입 불가).
          </li>
          <li>
            <strong>작업 승인 프로세스</strong> — 서버실/월렛룸 출입 시 "작업계획서 → 승인 → 작업 수행 → 완료서" 4단계.<br />
            작업계획서에는 작업 목적, 예상 시간, 담당자, 영향 범위를 명시.<br />
            승인권자(보안담당자 또는 CISO)의 사전 승인 없이는 물리적 출입 자체가 불가해야 한다.
          </li>
          <li>
            <strong>반출입 통제</strong> — 노트북, USB, 외장하드 등 저장매체의 반출입을 기록.<br />
            월렛룸에는 개인 전자기기 반입 금지가 원칙. 서명 전용 PC와 격리된 환경만 사용.
          </li>
          <li>
            <strong>CCTV 및 출입 로그</strong> — 최소 6개월 보관. 심사 시 특정 일자의 출입 기록과 CCTV 영상을 대조하여 일치 여부를 확인.
          </li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 월렛룸 설계 원칙</strong><br />
          이상적인 월렛룸은 전자파 차폐, 네트워크 물리 차단, 이중 잠금, 이중 인증 출입, 상시 CCTV의 5중 보안.
          현실적으로는 네트워크 차단 + 이중 인증 + CCTV가 최소 요건이며,
          에어컨 덕트나 천장 타일을 통한 우회 침입 경로까지 차단해야 현장심사에서 지적을 피할 수 있다.
        </p>

        {/* ── 2.5 인증 및 권한관리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2.5 인증 및 권한관리</h3>
        <p>
          "누가 어디에 접근할 수 있는가"를 통제하는 핵심 영역.<br />
          인증(Authentication, 신원 확인)과 인가(Authorization, 권한 부여)를 분리하여 관리.
        </p>
        <ul>
          <li>
            <strong>MFA(Multi-Factor Authentication, 다중 인증) 필수</strong> — 관리자 시스템, 클라우드 콘솔, VPN 접속 시 MFA 적용.<br />
            MFA는 "알고 있는 것(비밀번호) + 가지고 있는 것(OTP 기기) + 자신인 것(생체)" 중 2가지 이상을 조합.<br />
            SMS 기반 OTP보다 TOTP(Time-based One-Time Password) 앱 또는 하드웨어 키 권장 — SIM 스와핑(SIM Swapping, 공격자가 통신사를 속여 피해자 전화번호를 탈취하는 기법) 공격 방어.
          </li>
          <li>
            <strong>비밀번호 정책</strong> — 최소 8자 이상, 영문+숫자+특수문자 조합, 90일 주기 변경.<br />
            직전 5개 비밀번호 재사용 금지. 초기 비밀번호(임시 발급)는 최초 로그인 시 반드시 변경.
          </li>
          <li>
            <strong>장기 미접속 계정 잠금</strong> — 6개월 이상 미접속 계정은 자동 잠금 또는 비활성화.<br />
            퇴사자 계정이 아닌 현직자라도 장기 미사용 계정은 공격 대상이 되므로 선제적 차단.
          </li>
          <li>
            <strong>공용 계정 관리</strong> — 부득이하게 공용 계정을 사용하는 경우 "공용계정 대장"에 등록.<br />
            대장에는 계정명, 용도, 사용자 목록, 비밀번호 변경 이력을 기록. 공용 계정도 90일 주기 변경 대상.
          </li>
          <li>
            <strong>권한 최소화 원칙(Least Privilege)</strong> — 업무에 필요한 최소 권한만 부여.<br />
            관리자 권한(root, admin)은 별도 승인 절차를 거쳐 부여하며, 정기적으로 권한 적정성을 검토.
          </li>
        </ul>

        {/* ── 2.6 접근통제 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2.6 접근통제</h3>
        <p>
          네트워크·시스템·데이터 수준에서 접근을 통제하는 기술적 조치.<br />
          2.5가 "누구에게 권한을 줄 것인가"라면, 2.6은 "그 권한을 기술적으로 어떻게 강제할 것인가".
        </p>
        <ul>
          <li>
            <strong>DB 접근제어 소프트웨어</strong> — 데이터베이스에 대한 모든 접근을 프록시(Proxy) 방식으로 중계하여 기록·통제.<br />
            쿼리 로그를 실시간 저장하며, 위험 쿼리(DROP, TRUNCATE, 대량 SELECT)는 차단 또는 경고.<br />
            DBA(Database Administrator)도 예외 없이 접근제어 경유 — "접근 우회"가 결함의 가장 흔한 원인.
          </li>
          <li>
            <strong>계정 분리</strong> — 하나의 시스템에 단일 계정이 아닌, 용도별로 계정을 분리.<br />
            서비스 계정(애플리케이션 전용), 관리 계정(DBA 전용), 백업 계정(백업 스크립트 전용), 비상 계정(장애 시 긴급 접근).<br />
            비상 계정은 봉인 관리 — 비밀번호를 봉투에 넣어 금고에 보관, 사용 시 파봉 기록.
          </li>
          <li>
            <strong>IP 기반 접근 제한</strong> — 허용된 IP 대역에서만 접근 가능하도록 방화벽/보안그룹 설정.<br />
            관리자 포털은 사내 IP + VPN IP만 허용. 클라우드 환경에서는 Security Group과 NACL(Network Access Control List)로 이중 통제.
          </li>
          <li>
            <strong>월간 로그 검토</strong> — 접근 로그를 매월 검토하여 비정상 접근 패턴 식별.<br />
            검토 결과를 문서화하고 이상 징후 발견 시 사고 대응 절차 연동. 로그 검토 증적 미비는 사후심사에서 가장 빈번한 결함.
          </li>
        </ul>

        {/* ── 2.7 암호화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2.7 암호화 적용</h3>
        <p>
          저장·전송 중인 데이터의 기밀성을 보장하는 기술적 조치.<br />
          VASP에서는 지갑 개인키, 이용자 비밀번호, KYC 서류, API 키 등이 암호화 대상.
        </p>
        <ul>
          <li>
            <strong>비밀번호 저장</strong> — bcrypt, scrypt, Argon2 등 단방향 해시(One-way Hash) 사용.<br />
            단방향 해시란 원문을 복원할 수 없는 변환 — 로그인 시 입력값을 다시 해시하여 저장값과 비교.<br />
            MD5, SHA-1은 충돌 취약점이 알려져 사용 금지. bcrypt는 cost factor로 연산 비용을 조절할 수 있어 무차별 대입(Brute-force) 공격에 강한 저항력 제공.
          </li>
          <li>
            <strong>키 관리</strong> — AWS Secrets Manager, HashiCorp Vault 등 전용 키 관리 서비스(KMS, Key Management Service) 사용.<br />
            소스코드에 API 키, DB 비밀번호, 개인키를 하드코딩하는 것은 절대 금지.<br />
            Git 저장소에 키가 커밋된 이력이 있으면, 심사 시 "키 노출 사고"로 간주될 수 있으므로 히스토리 정리까지 필요.
          </li>
          <li>
            <strong>전송 구간 암호화</strong> — TLS 1.2 이상 필수. 내부 서비스 간 통신(East-West Traffic)도 TLS 적용 권장.<br />
            인증서 만료 모니터링 체계를 구축하여 만료로 인한 서비스 중단 방지.
          </li>
          <li>
            <strong>저장 데이터 암호화</strong> — 개인정보(주민등록번호, 신분증 사본)는 AES-256(Advanced Encryption Standard, 256비트 키) 이상으로 암호화 저장.<br />
            클라우드 스토리지(S3 등)는 서버 측 암호화(SSE, Server-Side Encryption) 활성화.
          </li>
        </ul>

        {/* ── 2.8 개발 보안 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2.8 정보시스템 도입 및 개발 보안</h3>
        <p>
          소프트웨어 개발 과정에서 보안을 내재화하는 "Secure by Design" 원칙.<br />
          개발 완료 후 보안을 추가하는 것보다, 설계 단계부터 보안을 고려하는 것이 비용과 효과 모두 우수.
        </p>
        <ul>
          <li>
            <strong>서버 정보 노출 차단</strong> — nginx의 <code>server_tokens off</code> 설정으로 서버 버전 정보 숨김.<br />
            HTTP 응답 헤더에서 <code>Server: nginx/1.24.0</code> 같은 정보가 노출되면, 해당 버전의 알려진 취약점을 공격자가 즉시 활용 가능.
          </li>
          <li>
            <strong>에러 페이지 커스텀</strong> — 스택 트레이스(Stack Trace), DB 쿼리, 파일 경로가 노출되는 기본 에러 페이지 사용 금지.<br />
            404, 500 등 주요 에러 코드에 대해 커스텀 에러 페이지를 설정. 에러 상세 내용은 서버 로그에만 기록.
          </li>
          <li>
            <strong>열거 공격(Enumeration Attack) 방지</strong> — 리소스 식별자로 순차 정수(1, 2, 3...) 대신 UUID(Universally Unique Identifier) 사용.<br />
            순차 ID는 공격자가 ID를 1씩 증가시키며 타인의 리소스에 접근을 시도할 수 있다.<br />
            UUID v4는 122비트 랜덤값으로 생성되어 추측이 사실상 불가능.
          </li>
          <li>
            <strong>입력값 검증</strong> — 모든 외부 입력(API 파라미터, 폼 데이터, 헤더)에 대해 허용 목록(Allowlist) 기반 검증.<br />
            SQL Injection, XSS(Cross-Site Scripting), Command Injection 등 OWASP Top 10 취약점을 원천 차단.
          </li>
          <li>
            <strong>개발-스테이징-운영 환경 분리</strong> — 개발 환경의 데이터가 운영 환경에 영향을 주지 않도록 물리적/논리적 분리.<br />
            운영 DB의 데이터를 개발 환경에 복사할 때는 개인정보를 마스킹(Masking, 실제 값을 가려서 대체) 처리.
          </li>
        </ul>

        {/* ── 2.11 사고 대응 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2.11 사고 예방 및 대응</h3>
        <p>
          침해사고는 "발생 여부"가 아니라 "발생 시기"의 문제.<br />
          사고 대응 계획이 없으면 초동 대응에서 실패하고, 피해가 확산된 후에야 인지하는 최악의 시나리오가 반복된다.
        </p>
        <ul>
          <li>
            <strong>탐지(Detection)</strong> — SIEM(Security Information and Event Management, 보안 이벤트 통합 관리 시스템), IDS/IPS(침입탐지/차단 시스템), WAF(Web Application Firewall) 등을 통해 이상 징후를 실시간 모니터링.<br />
            VASP 특화: 비정상 출금 패턴(대량 출금, 심야 출금, 신규 주소 집중 출금) 감시.
          </li>
          <li>
            <strong>초동 대응(Initial Response)</strong> — 사고 인지 후 1시간 이내에 초동 대응팀 소집.<br />
            피해 확산 방지를 최우선으로 — 감염 서버 격리, 관련 계정 잠금, 출금 일시 중지 등 즉시 조치.
          </li>
          <li>
            <strong>분석(Analysis)</strong> — 공격 경로, 침입 시점, 영향 범위를 포렌식(Forensics, 디지털 증거 수집·분석) 기법으로 규명.<br />
            로그 무결성이 확보되어 있어야 분석이 가능하므로, 로그를 별도 저장소에 원본 보관하는 것이 전제조건.
          </li>
          <li>
            <strong>복구(Recovery)</strong> — 백업으로부터 시스템 복원. 복구 시점 목표(RPO, Recovery Point Objective)와 복구 시간 목표(RTO, Recovery Time Objective)를 사전 정의.<br />
            VASP의 경우 자산 손실이 발생했다면 이용자 피해 보전 계획까지 포함.
          </li>
          <li>
            <strong>재발 방지(Lessons Learned)</strong> — 사고 원인을 근본적으로 분석하고 보호대책을 보강.<br />
            사고 보고서를 작성하여 경영진에 보고하고, 위험평가에 반영하여 DoA를 재검토.
          </li>
        </ul>

        {/* ── 2.12 재해 복구 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2.12 재해 복구</h3>
        <p>
          자연재해, 하드웨어 장애, 랜섬웨어 등으로 시스템이 전면 장애에 빠졌을 때 사업을 지속할 수 있는 능력.<br />
          백업이 없으면 복구가 불가능하고, 백업이 있어도 테스트하지 않으면 복구 가능 여부를 보장할 수 없다.
        </p>
        <ul>
          <li>
            <strong>백업 정책</strong> — 자산 유형별 백업 주기와 보관 기간을 명확히 정의.
          </li>
        </ul>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">대상</th>
                <th className="text-left px-3 py-2 border-b border-border">백업 주기</th>
                <th className="text-left px-3 py-2 border-b border-border">보관 기간</th>
                <th className="text-left px-3 py-2 border-b border-border">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-1.5 border-b border-border/30">DB (거래 원장)</td><td className="px-3 py-1.5 border-b border-border/30">매일 (증분 + 주간 전체)</td><td className="px-3 py-1.5 border-b border-border/30">90일</td><td className="px-3 py-1.5 border-b border-border/30">거래 데이터는 법적 보관 의무</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">서버 이미지</td><td className="px-3 py-1.5 border-b border-border/30">분기별</td><td className="px-3 py-1.5 border-b border-border/30">1년</td><td className="px-3 py-1.5 border-b border-border/30">AMI/스냅샷</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">로그</td><td className="px-3 py-1.5 border-b border-border/30">매일</td><td className="px-3 py-1.5 border-b border-border/30">1년</td><td className="px-3 py-1.5 border-b border-border/30">접근 로그, 감사 로그</td></tr>
              <tr><td className="px-3 py-1.5">설정 파일</td><td className="px-3 py-1.5">변경 시</td><td className="px-3 py-1.5">무기한</td><td className="px-3 py-1.5">Git 버전 관리</td></tr>
            </tbody>
          </table>
        </div>

        <ul>
          <li>
            <strong>NTP 동기화</strong> — 모든 서버의 시각을 NTP(Network Time Protocol) 서버와 동기화.<br />
            로그의 시간 정보가 서버마다 다르면 사고 분석 시 이벤트 순서를 재구성할 수 없다. 시간 오차 허용 범위는 1초 이내가 권장.
          </li>
          <li>
            <strong>백업 암호화</strong> — 백업 데이터 자체를 AES-256으로 암호화하여 저장.<br />
            암호화하지 않은 백업이 유출되면 원본 데이터 유출과 동일한 사고. 암호화 키는 백업 데이터와 별도 위치에 보관.
          </li>
          <li>
            <strong>소산 백업(Off-site Backup)</strong> — 백업 사본을 물리적으로 다른 위치에 보관.<br />
            같은 건물에 원본과 백업이 모두 있으면 화재·지진 시 동시 소실. 클라우드 환경에서는 다른 리전(Region)에 복제하는 것이 소산 백업에 해당.<br />
            소산 백업의 복구 테스트도 반기 1회 이상 수행하여 실제로 복원 가능한지 검증.
          </li>
          <li>
            <strong>복구 훈련</strong> — 연 1회 이상 재해 복구 모의 훈련을 실시.<br />
            실제로 백업에서 시스템을 복원하고, RTO/RPO 목표 달성 여부를 측정. 훈련 결과 보고서를 경영진에 보고하고 미달 항목은 개선 계획 수립.
          </li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} VASP의 백업 특수성</strong><br />
          일반 서비스와 달리 VASP는 "지갑 개인키 백업"이라는 고유한 과제가 존재.
          개인키 백업은 니모닉(Mnemonic, 12~24개 영단어로 구성된 복구 구문) 또는 샤미르 비밀 공유(Shamir's Secret Sharing, 키를 N개 조각으로 분할하여 K개 이상 모이면 복원 가능한 기법)를 활용.
          물리적으로 분산 보관하되, 단일 보관 장소에서 키를 복원할 수 없도록 설계해야 한다.
        </p>

      </div>
    </section>
  );
}
