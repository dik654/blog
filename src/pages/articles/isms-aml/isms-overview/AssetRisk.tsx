export default function AssetRisk() {
  return (
    <section id="asset-risk" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">정보자산 분류와 위험평가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          ISMS-P 인증의 출발점은 "무엇을 보호할 것인가"를 정의하는 것.<br />
          자산을 모르면 위험을 평가할 수 없고, 위험을 모르면 보호대책의 우선순위를 정할 수 없다.<br />
          자산 분류 → 보안등급 산정 → 위험평가 → 보호대책 선정 순서로 진행하며, 이 과정 전체가 1.2(위험관리) 인증 기준의 핵심.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">자산 분류 체계</h3>
        <p>
          정보자산은 조직이 보유한 모든 IT 자원 + 물리 자원 + 데이터를 포함.<br />
          VASP 환경에서 일반적으로 식별하는 자산 유형은 약 14종. 각 유형별 특성과 보호 필요성이 다르므로 분류가 필수.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">분류</th>
                <th className="text-left px-3 py-2 border-b border-border">자산 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">예시</th>
                <th className="text-left px-3 py-2 border-b border-border">VASP 특이사항</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-1.5 border-b border-border/30">서버</td><td className="px-3 py-1.5 border-b border-border/30">물리/가상 서버</td><td className="px-3 py-1.5 border-b border-border/30">API 서버, 매칭엔진, 블록체인 노드</td><td className="px-3 py-1.5 border-b border-border/30">노드 서버는 P2P 포트 노출</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">DBMS</td><td className="px-3 py-1.5 border-b border-border/30">데이터베이스</td><td className="px-3 py-1.5 border-b border-border/30">MySQL, PostgreSQL, Redis</td><td className="px-3 py-1.5 border-b border-border/30">거래 원장, 잔고 데이터</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">네트워크</td><td className="px-3 py-1.5 border-b border-border/30">스위치, 라우터, 방화벽</td><td className="px-3 py-1.5 border-b border-border/30">L3 스위치, WAF, IPS</td><td className="px-3 py-1.5 border-b border-border/30">망분리 구간 명확 구분</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">보안장비</td><td className="px-3 py-1.5 border-b border-border/30">보안 솔루션</td><td className="px-3 py-1.5 border-b border-border/30">IDS/IPS, DLP, 접근제어</td><td className="px-3 py-1.5 border-b border-border/30">-</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">PC/단말</td><td className="px-3 py-1.5 border-b border-border/30">업무용 PC</td><td className="px-3 py-1.5 border-b border-border/30">개발자 워크스테이션, CS 단말</td><td className="px-3 py-1.5 border-b border-border/30">-</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">지갑전용PC</td><td className="px-3 py-1.5 border-b border-border/30">콜드월렛 서명 전용</td><td className="px-3 py-1.5 border-b border-border/30">에어갭(Air-gap) PC</td><td className="px-3 py-1.5 border-b border-border/30 text-blue-600 font-medium">VASP 고유 자산 — 최고 보안등급</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">응용프로그램</td><td className="px-3 py-1.5 border-b border-border/30">서비스 소프트웨어</td><td className="px-3 py-1.5 border-b border-border/30">거래소 웹앱, 관리자 포털</td><td className="px-3 py-1.5 border-b border-border/30">-</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">소스코드</td><td className="px-3 py-1.5 border-b border-border/30">개발 자산</td><td className="px-3 py-1.5 border-b border-border/30">Git 저장소, CI/CD 파이프라인</td><td className="px-3 py-1.5 border-b border-border/30">서명 키 관련 코드 분리</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">문서</td><td className="px-3 py-1.5 border-b border-border/30">정책/절차 문서</td><td className="px-3 py-1.5 border-b border-border/30">정보보호 정책서, SOP</td><td className="px-3 py-1.5 border-b border-border/30">-</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">개인정보파일</td><td className="px-3 py-1.5 border-b border-border/30">이용자 개인정보</td><td className="px-3 py-1.5 border-b border-border/30">KYC 서류, 실명 DB</td><td className="px-3 py-1.5 border-b border-border/30 text-blue-600 font-medium">신분증 사본 — 암호화 보관 필수</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">암호키</td><td className="px-3 py-1.5 border-b border-border/30">서명키, 암호화키</td><td className="px-3 py-1.5 border-b border-border/30">개인키, TLS 인증서, API 키</td><td className="px-3 py-1.5 border-b border-border/30 text-blue-600 font-medium">지갑 개인키 = 자산 그 자체</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">CCTV</td><td className="px-3 py-1.5 border-b border-border/30">물리보안 장비</td><td className="px-3 py-1.5 border-b border-border/30">서버실, 출입구 녹화</td><td className="px-3 py-1.5 border-b border-border/30">-</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">출입시스템</td><td className="px-3 py-1.5 border-b border-border/30">출입통제 장비</td><td className="px-3 py-1.5 border-b border-border/30">카드리더, 생체인식</td><td className="px-3 py-1.5 border-b border-border/30">월렛룸(Wallet Room) 전용 출입</td></tr>
              <tr><td className="px-3 py-1.5">클라우드</td><td className="px-3 py-1.5">CSP 자원</td><td className="px-3 py-1.5">AWS VPC, S3, KMS</td><td className="px-3 py-1.5">공동 책임 모델 문서화</td></tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 에어갭(Air-gap)이란</strong><br />
          네트워크에 물리적으로 연결되지 않은 상태. 콜드월렛 서명 전용 PC는 인터넷·내부망 모두 차단한 환경에서
          트랜잭션 서명만 수행한 뒤, USB 또는 QR 코드로 서명 결과를 전달한다.
          네트워크 공격 벡터를 원천 차단하는 가장 강력한 물리적 보안 조치.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">보안등급 산정: CIA 평가</h3>
        <p>
          각 자산에 대해 CIA 3요소(기밀성·무결성·가용성)를 1~3점으로 평가, 평균값으로 보안등급을 결정.<br />
          CIA는 정보보안의 가장 기본적인 세 축:
        </p>
        <ul>
          <li><strong>기밀성(Confidentiality)</strong> — 인가된 사람만 접근 가능한가. 유출 시 피해 크기 기준 점수 부여</li>
          <li><strong>무결성(Integrity)</strong> — 비인가 변경 없이 원본 상태를 유지하는가. 위·변조 가능성과 영향도 기준</li>
          <li><strong>가용성(Availability)</strong> — 필요할 때 접근 가능한가. 서비스 중단 시 업무 영향도 기준</li>
        </ul>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">점수</th>
                <th className="text-left px-3 py-2 border-b border-border">기밀성</th>
                <th className="text-left px-3 py-2 border-b border-border">무결성</th>
                <th className="text-left px-3 py-2 border-b border-border">가용성</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3 (높음)</td>
                <td className="px-3 py-1.5 border-b border-border/30">유출 시 심각한 재정·법적 피해</td>
                <td className="px-3 py-1.5 border-b border-border/30">위변조 시 거래 무결성 훼손</td>
                <td className="px-3 py-1.5 border-b border-border/30">1시간 이상 중단 불가</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2 (보통)</td>
                <td className="px-3 py-1.5 border-b border-border/30">유출 시 업무 지장</td>
                <td className="px-3 py-1.5 border-b border-border/30">위변조 시 제한적 영향</td>
                <td className="px-3 py-1.5 border-b border-border/30">수시간 중단 허용</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">1 (낮음)</td>
                <td className="px-3 py-1.5">공개 정보 수준</td>
                <td className="px-3 py-1.5">위변조 영향 미미</td>
                <td className="px-3 py-1.5">장기 중단 가능</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          <strong>등급 산정 공식: (C + I + A) / 3 = 평균 점수</strong>
        </p>
        <ul>
          <li><strong>2.0 초과 → 비밀(Secret)</strong> — 최고 보안등급. 접근 권한 최소화, 암호화 필수, 변경 시 승인 절차</li>
          <li><strong>1.0 ~ 2.0 → 대외비(Confidential)</strong> — 내부 공유 가능하나 외부 유출 금지. 접근 로그 기록 필수</li>
          <li><strong>1.0 이하 → 일반(Internal)</strong> — 공개 가능 수준. 기본적인 접근통제만 적용</li>
        </ul>

        <p>
          예시: 콜드월렛 개인키의 CIA 평가<br />
          기밀성 3 (유출 = 자산 탈취) + 무결성 3 (변조 = 서명 불가) + 가용성 2 (복구 키 존재) = 평균 2.67 → <strong>비밀 등급</strong>.<br />
          반면, 공개 블록체인 노드 데이터는 기밀성 1 + 무결성 2 + 가용성 2 = 평균 1.67 → <strong>대외비 등급</strong>.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">위험평가 5단계</h3>
        <p>
          자산 분류와 보안등급 산정이 완료되면, 각 자산에 대한 위험(Risk)을 체계적으로 평가.<br />
          위험 = 자산 가치 x 위협 발생 가능성 x 취약점 노출 정도. 이 공식을 5단계로 풀어낸다:
        </p>

        <ol>
          <li>
            <strong>자산 식별</strong> — 앞서 수행한 자산 분류 결과를 위험평가 대장에 등록.<br />
            각 자산의 소유자(Owner), 관리자(Custodian), 위치(물리/논리), 용도를 명시.
          </li>
          <li>
            <strong>중요도 산정</strong> — CIA 기반 보안등급을 수치화한 "자산 중요도" 결정.<br />
            비밀 = 3, 대외비 = 2, 일반 = 1로 변환하여 이후 위험값 계산에 사용.
          </li>
          <li>
            <strong>위협 수집</strong> — 각 자산에 적용 가능한 위협(Threat) 목록 작성.<br />
            KISA 위협 사전, 최근 침해사고 사례, OWASP Top 10 등을 참조.<br />
            VASP 특화 위협: 피싱을 통한 관리자 계정 탈취, 내부자의 개인키 유출, 스마트 컨트랙트 취약점 악용 등.
          </li>
          <li>
            <strong>위험 평가</strong> — 각 위협에 대해 발생 가능성(Likelihood)을 H(High)/M(Medium)/L(Low)로 평가.<br />
            발생 가능성은 GAP 분석(현재 통제 수준 vs 요구 수준의 차이) 결과를 참조.<br />
            위험값 = 자산 중요도 x 발생 가능성(H=3, M=2, L=1).<br />
            위험값이 DoA(Degree of Assurance, 수용 가능 위험 수준) 이상이면 "미수용 위험"으로 분류.
          </li>
          <li>
            <strong>DoA 승인</strong> — 경영진(CISO)이 DoA 기준선을 승인.<br />
            DoA는 조직이 감수할 수 있는 위험의 상한선. 예를 들어 DoA=4로 설정하면 위험값 5 이상인 항목은 반드시 추가 보호대책을 적용해야 한다.<br />
            DoA 이하 위험은 "잔여 위험(Residual Risk)"으로 수용 — 단, 경영진 서명이 필수.
          </li>
        </ol>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} GAP 분석이란</strong><br />
          현재 조직의 보안 수준과 ISMS-P 인증 기준이 요구하는 수준 사이의 격차(GAP)를 측정하는 분석.
          102개 인증 기준 각각에 대해 "이행 중 / 부분 이행 / 미이행"으로 현황을 매핑한 뒤,
          미이행 항목에 높은 발생 가능성을 부여하여 위험평가에 반영한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">보호대책 선정</h3>
        <p>
          위험평가 결과 미수용 위험으로 분류된 항목에 대해 보호대책을 선정.<br />
          보호대책은 네 가지 전략 중 하나를 적용:
        </p>
        <ul>
          <li><strong>위험 감소(Mitigation)</strong> — 기술적/관리적 통제 추가. 가장 일반적인 전략. 예: DB 접근제어 소프트웨어 도입</li>
          <li><strong>위험 회피(Avoidance)</strong> — 해당 활동 자체를 중단. 예: 보안 요건을 충족하지 못하는 서비스 폐지</li>
          <li><strong>위험 전가(Transfer)</strong> — 보험 가입 또는 외부 위탁. 예: 사이버 보험, 관제 서비스 외주</li>
          <li><strong>위험 수용(Acceptance)</strong> — 잔여 위험으로 수용. 반드시 경영진 승인 + 문서화 필수</li>
        </ul>

        <p>
          중요도가 높은 자산(비밀 등급)에는 다중 보호대책 적용이 원칙.<br />
          예를 들어 콜드월렛 개인키에는 위험 감소(에어갭 PC + 멀티시그) + 위험 전가(사이버 보험) 두 전략을 동시 적용.<br />
          보호대책 선정 결과는 "위험 처리 계획서(Risk Treatment Plan)"에 문서화하며,
          이 문서가 2.x 영역의 보호대책 이행 근거가 된다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 위험평가는 연 1회 이상</strong><br />
          인증 취득 후에도 매년 위험평가를 재수행해야 한다. 신규 자산 도입, 조직 변경, 신규 위협 출현 시
          즉시 위험평가를 갱신하는 것이 모범 사례. 사후심사에서 위험평가 갱신 여부를 반드시 확인한다.
        </p>

      </div>
    </section>
  );
}
