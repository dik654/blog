export default function UtmFirewall() {
  return (
    <section id="utm-firewall" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">UTM과 방화벽 — 인바운드/아웃바운드 규칙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">방화벽(Firewall)이란</h3>
        <p>
          방화벽은 네트워크 트래픽을 검사하여 사전에 정의된 규칙에 따라 허용하거나 차단하는 장비.<br />
          IP 주소, 포트 번호, 프로토콜을 기준으로 패킷을 필터링한다.<br />
          "문지기" 역할 — 허용 목록에 없는 트래픽은 모두 거부하는 것이 기본 원칙(Default Deny).
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Stateless vs Stateful 방화벽</h3>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">Stateless (비상태)</th>
                <th className="text-left px-3 py-2 border-b border-border">Stateful (상태 추적)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">검사 단위</td>
                <td className="px-3 py-1.5 border-b border-border/30">개별 패킷</td>
                <td className="px-3 py-1.5 border-b border-border/30">세션(연결) 단위</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">동작 방식</td>
                <td className="px-3 py-1.5 border-b border-border/30">각 패킷을 독립적으로 검사 — 이전 패킷과의 관계를 모름</td>
                <td className="px-3 py-1.5 border-b border-border/30">TCP 핸드셰이크부터 종료까지 전체 세션을 추적</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">응답 트래픽</td>
                <td className="px-3 py-1.5 border-b border-border/30">인바운드 허용 규칙과 별도로 아웃바운드 응답 규칙도 필요</td>
                <td className="px-3 py-1.5 border-b border-border/30">정상 세션의 응답 트래픽은 자동 허용</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">성능</td>
                <td className="px-3 py-1.5 border-b border-border/30">빠름 — 세션 테이블 유지 불필요</td>
                <td className="px-3 py-1.5 border-b border-border/30">세션 테이블 메모리 필요 — 대규모 연결 시 부하</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">보안 수준</td>
                <td className="px-3 py-1.5">낮음 — 위조 응답 패킷 구분 불가</td>
                <td className="px-3 py-1.5">높음 — 정상 세션이 아닌 패킷은 차단</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          현재 대부분의 방화벽은 Stateful 방식.<br />
          Stateless는 클라우드 환경의 네트워크 ACL(Access Control List) 등 제한적 용도로만 사용한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">UTM (Unified Threat Management, 통합위협관리)</h3>
        <p>
          UTM은 방화벽을 기본으로, IPS(침입방지) + VPN + 안티바이러스 + URL 필터링 + 안티스팸 등 여러 보안 기능을 하나의 장비에 통합한 솔루션.<br />
          중소규모 조직에서 개별 보안 장비를 따로 구매·운영하기 어려울 때, UTM 하나로 경계 보안을 구성할 수 있다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">UTM 통합 기능</th>
                <th className="text-left px-3 py-2 border-b border-border">역할</th>
                <th className="text-left px-3 py-2 border-b border-border">개별 장비 대체</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">방화벽</td>
                <td className="px-3 py-1.5 border-b border-border/30">IP/포트 기반 트래픽 제어</td>
                <td className="px-3 py-1.5 border-b border-border/30">Firewall</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">IPS 모듈</td>
                <td className="px-3 py-1.5 border-b border-border/30">시그니처 기반 공격 탐지·차단</td>
                <td className="px-3 py-1.5 border-b border-border/30">IPS 전용 장비</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">VPN 게이트웨이</td>
                <td className="px-3 py-1.5 border-b border-border/30">IPSec / SSL VPN 터널 제공</td>
                <td className="px-3 py-1.5 border-b border-border/30">VPN 전용 장비</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">안티바이러스</td>
                <td className="px-3 py-1.5 border-b border-border/30">네트워크 트래픽 내 악성코드 검사</td>
                <td className="px-3 py-1.5 border-b border-border/30">네트워크 AV 게이트웨이</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">URL/콘텐츠 필터링</td>
                <td className="px-3 py-1.5 border-b border-border/30">유해 사이트 차단, 카테고리별 웹 접근 제어</td>
                <td className="px-3 py-1.5 border-b border-border/30">웹 필터 프록시</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">안티스팸</td>
                <td className="px-3 py-1.5">스팸 이메일 필터링</td>
                <td className="px-3 py-1.5">스팸 필터 게이트웨이</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">UTM vs NGFW (차세대 방화벽)</h3>
        <p>
          NGFW(Next-Generation Firewall, 차세대 방화벽)는 UTM과 유사하게 여러 기능을 통합하지만, 애플리케이션 계층(L7)에서의 정밀 제어에 초점을 둔다.<br />
          포트 번호가 아니라 애플리케이션 자체를 식별하여 정책을 적용 — 예: "포트 443은 열지만, 그중 토렌트 트래픽은 차단".
        </p>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">UTM</th>
                <th className="text-left px-3 py-2 border-b border-border">NGFW</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">대상</td>
                <td className="px-3 py-1.5 border-b border-border/30">중소규모 조직 — 올인원 솔루션</td>
                <td className="px-3 py-1.5 border-b border-border/30">중대규모 조직 — 대용량 트래픽 처리</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">앱 식별</td>
                <td className="px-3 py-1.5 border-b border-border/30">제한적 — 포트 기반 + URL 필터 수준</td>
                <td className="px-3 py-1.5 border-b border-border/30">DPI(Deep Packet Inspection, 심층 패킷 검사)로 앱 레벨 식별</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">성능</td>
                <td className="px-3 py-1.5 border-b border-border/30">기능 전부 활성화 시 성능 저하 가능</td>
                <td className="px-3 py-1.5 border-b border-border/30">전용 ASIC/FPGA로 고속 처리</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">위협 인텔리전스</td>
                <td className="px-3 py-1.5">시그니처 DB 기반</td>
                <td className="px-3 py-1.5">클라우드 기반 실시간 위협 정보 연동</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          실무에서 UTM과 NGFW의 경계는 점점 흐려지고 있다.<br />
          최신 UTM 장비도 DPI, 애플리케이션 식별 기능을 포함하는 경우가 많아 두 용어가 혼용되기도 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">인바운드 규칙 설계</h3>
        <p>
          인바운드(Inbound)란 외부에서 내부로 유입되는 트래픽.<br />
          기본 원칙: <strong>모든 인바운드 차단(Deny All)</strong> → 필요한 것만 명시적 허용(Allow).
        </p>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">순번</th>
                <th className="text-left px-3 py-2 border-b border-border">출발지</th>
                <th className="text-left px-3 py-2 border-b border-border">목적지</th>
                <th className="text-left px-3 py-2 border-b border-border">포트</th>
                <th className="text-left px-3 py-2 border-b border-border">동작</th>
                <th className="text-left px-3 py-2 border-b border-border">사유</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">1</td>
                <td className="px-3 py-1.5 border-b border-border/30">Any</td>
                <td className="px-3 py-1.5 border-b border-border/30">DMZ 웹서버</td>
                <td className="px-3 py-1.5 border-b border-border/30">80, 443</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-green-600 font-medium">Allow</td>
                <td className="px-3 py-1.5 border-b border-border/30">웹 서비스 제공 (HTTP/HTTPS)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">2</td>
                <td className="px-3 py-1.5 border-b border-border/30">관리자 IP 대역</td>
                <td className="px-3 py-1.5 border-b border-border/30">DMZ 서버</td>
                <td className="px-3 py-1.5 border-b border-border/30">22</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-green-600 font-medium">Allow</td>
                <td className="px-3 py-1.5 border-b border-border/30">SSH 관리 접근 (IP 제한)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">3</td>
                <td className="px-3 py-1.5 border-b border-border/30">Any</td>
                <td className="px-3 py-1.5 border-b border-border/30">VPN 게이트웨이</td>
                <td className="px-3 py-1.5 border-b border-border/30">443, 4500</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-green-600 font-medium">Allow</td>
                <td className="px-3 py-1.5 border-b border-border/30">원격 VPN 접속</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">999</td>
                <td className="px-3 py-1.5">Any</td>
                <td className="px-3 py-1.5">Any</td>
                <td className="px-3 py-1.5">Any</td>
                <td className="px-3 py-1.5 text-red-500 font-medium">Deny</td>
                <td className="px-3 py-1.5">기본 거부 — 위 규칙에 매칭되지 않는 모든 트래픽 차단</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">아웃바운드 규칙 설계</h3>
        <p>
          아웃바운드(Outbound)란 내부에서 외부로 나가는 트래픽.<br />
          보안이 강화된 환경에서는 아웃바운드도 기본 차단(Deny All) 후 필요한 것만 허용한다.<br />
          아웃바운드를 통제하지 않으면 악성코드가 C&C(Command and Control) 서버와 통신하거나, 데이터를 외부로 유출할 수 있다.
        </p>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">순번</th>
                <th className="text-left px-3 py-2 border-b border-border">출발지</th>
                <th className="text-left px-3 py-2 border-b border-border">목적지</th>
                <th className="text-left px-3 py-2 border-b border-border">포트</th>
                <th className="text-left px-3 py-2 border-b border-border">동작</th>
                <th className="text-left px-3 py-2 border-b border-border">사유</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">1</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부 DNS</td>
                <td className="px-3 py-1.5 border-b border-border/30">외부 DNS</td>
                <td className="px-3 py-1.5 border-b border-border/30">53</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-green-600 font-medium">Allow</td>
                <td className="px-3 py-1.5 border-b border-border/30">도메인 이름 해석</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">2</td>
                <td className="px-3 py-1.5 border-b border-border/30">서버 대역</td>
                <td className="px-3 py-1.5 border-b border-border/30">NTP 서버</td>
                <td className="px-3 py-1.5 border-b border-border/30">123</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-green-600 font-medium">Allow</td>
                <td className="px-3 py-1.5 border-b border-border/30">시간 동기화 (로그 타임스탬프 정확성)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">3</td>
                <td className="px-3 py-1.5 border-b border-border/30">서버 대역</td>
                <td className="px-3 py-1.5 border-b border-border/30">업데이트 저장소</td>
                <td className="px-3 py-1.5 border-b border-border/30">443</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-green-600 font-medium">Allow</td>
                <td className="px-3 py-1.5 border-b border-border/30">OS/SW 보안 패치 다운로드</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">4</td>
                <td className="px-3 py-1.5 border-b border-border/30">Any</td>
                <td className="px-3 py-1.5 border-b border-border/30">알려진 악성 IP</td>
                <td className="px-3 py-1.5 border-b border-border/30">Any</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-red-500 font-medium">Deny</td>
                <td className="px-3 py-1.5 border-b border-border/30">위협 인텔리전스 기반 차단</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">999</td>
                <td className="px-3 py-1.5">Any</td>
                <td className="px-3 py-1.5">Any</td>
                <td className="px-3 py-1.5">Any</td>
                <td className="px-3 py-1.5 text-red-500 font-medium">Deny</td>
                <td className="px-3 py-1.5">기본 거부</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">DMZ ↔ 내부망 규칙</h3>
        <p>
          DMZ와 내부망 사이의 트래픽 규칙은 가장 엄격하게 설계해야 한다.<br />
          DMZ 서버가 공격자에게 장악되었을 때, 내부망으로의 2차 침투를 막는 마지막 방어선이기 때문.
        </p>
        <ul>
          <li><strong>DMZ → 내부망</strong> — 특정 서비스 포트만 허용. 예: DMZ 웹서버 → 내부 DB서버의 3306(MySQL) 또는 5432(PostgreSQL)만 열고, 나머지 전부 차단</li>
          <li><strong>내부망 → DMZ</strong> — 관리 목적의 SSH(22)만 허용. 관리자 IP로 제한하여 아무 내부 사용자나 DMZ 서버에 접근하지 못하게 함</li>
          <li><strong>DMZ → 인터넷</strong> — 제한적 허용. 업데이트 서버, 외부 API 호출(결제, 블록체인 노드 등) 등 명시적으로 필요한 목적지만 허용</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">규칙 관리 원칙</h3>
        <ul>
          <li><strong>최소 권한</strong> — "왜 이 규칙이 필요한가"를 문서화하지 못하는 규칙은 삭제 대상</li>
          <li><strong>분기별 리뷰</strong> — 최소 3개월마다 전체 규칙을 재검토. 사용되지 않는 규칙(트래픽 로그에서 히트 수 0)은 비활성화 후 삭제</li>
          <li><strong>변경 로그</strong> — 규칙 추가/수정/삭제 시 승인자, 사유, 일시를 기록. ISMS 심사에서 "이 규칙은 언제, 왜, 누가 만들었는가"를 반드시 확인</li>
          <li><strong>테스트 환경</strong> — 운영 방화벽에 직접 규칙을 적용하기 전에 테스트 환경에서 검증. 잘못된 규칙이 서비스 장애를 유발할 수 있다</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 규칙 순서의 중요성</strong><br />
          방화벽은 규칙을 위에서 아래로 순서대로 매칭한다 — 첫 번째 매칭된 규칙이 적용되고 나머지는 무시.
          따라서 구체적인 허용 규칙을 먼저, 포괄적인 차단 규칙(Deny All)을 마지막에 배치해야 한다.
          순서가 잘못되면 정상 트래픽이 차단되거나, 차단해야 할 트래픽이 허용될 수 있다.
        </p>

      </div>
    </section>
  );
}
