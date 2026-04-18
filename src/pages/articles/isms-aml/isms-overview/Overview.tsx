import OverviewViz from './viz/OverviewViz';
import CertificationFlowViz from './viz/CertificationFlowViz';
import OrgRolesViz from './viz/OrgRolesViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ISMS-P 인증이란</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <OverviewViz />

        <h3 className="text-xl font-semibold mt-2 mb-3">정의</h3>
        <p>
          ISMS-P(Information Security Management System - Personal information & information)는 한국인터넷진흥원(KISA, Korea Internet & Security Agency)이 주관하는 정보보호 및 개인정보보호 관리체계 인증 제도.<br />
          조직이 보유한 정보자산을 체계적으로 보호하고 있는지를 102개 인증 기준으로 심사.<br />
          ISMS(정보보호 관리체계)와 ISMS-P(개인정보보호 포함)는 별도 인증이지만, 가상자산사업자(VASP, Virtual Asset Service Provider)는 대부분 ISMS-P를 취득해야 한다 — 이용자 개인정보(실명, 연락처, 지갑주소)를 직접 처리하기 때문.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 필요한가</h3>
        <p>
          특정금융정보법(특금법) 제7조 — VASP 신고 시 ISMS 인증 의무 명시.<br />
          인증 없이 영업하면 신고 수리 자체가 불가하므로, 사실상 시장 진입의 전제조건.<br />
          단순 법적 의무를 넘어 실질적 가치도 존재한다:
        </p>
        <ul>
          <li><strong>침해사고 예방</strong> — 체계적 위험평가로 취약점을 사전 식별, 보안 투자의 우선순위 결정 가능</li>
          <li><strong>고객 신뢰</strong> — 제3자(인증기관) 검증을 통해 보안 수준을 객관적으로 증명</li>
          <li><strong>사고 시 법적 감면</strong> — 인증 유지 조직은 과태료·과징금 감경 사유에 해당</li>
          <li><strong>내부 통제 기반</strong> — 정보보호 정책, 위험 관리, 사고 대응 절차가 문서화되어 조직 전체의 보안 수준 상향</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">인증 범위: 3개 영역</h3>
        <p>
          ISMS-P 인증 기준은 크게 세 영역으로 구분. 각 영역은 번호 체계로 관리되며, 심사 시 항목별로 적합/부적합을 판정.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">영역</th>
                <th className="text-left px-3 py-2 border-b border-border">번호</th>
                <th className="text-left px-3 py-2 border-b border-border">항목 수</th>
                <th className="text-left px-3 py-2 border-b border-border">핵심 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">관리체계 수립·운영</td>
                <td className="px-3 py-1.5 border-b border-border/30">1.x</td>
                <td className="px-3 py-1.5 border-b border-border/30">16개</td>
                <td className="px-3 py-1.5 border-b border-border/30">정보보호 정책, 조직, 위험관리, 자원 배분</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">보호대책 요구사항</td>
                <td className="px-3 py-1.5 border-b border-border/30">2.x</td>
                <td className="px-3 py-1.5 border-b border-border/30">64개</td>
                <td className="px-3 py-1.5 border-b border-border/30">접근통제, 암호화, 물리보안, 개발보안, 사고대응</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">개인정보 처리단계별 요구사항</td>
                <td className="px-3 py-1.5">3.x</td>
                <td className="px-3 py-1.5">22개</td>
                <td className="px-3 py-1.5">수집·이용·제공·파기의 전 생명주기 관리</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          1.x 영역은 "관리체계를 만들고 운영하는 프레임워크".<br />
          정보보호 정책 수립, 최고정보보호책임자(CISO) 지정, 위험평가 주기, 예산 배분 등을 다룬다.<br />
          2.x 영역은 "실제 기술적·관리적 보호 조치".<br />
          방화벽 설정, DB 접근제어, 암호화 알고리즘 선정, 백업 주기 등 구체적 실행 항목.<br />
          3.x 영역은 "개인정보 보호법 연동".<br />
          동의 수집 절차, 제3자 제공, 파기 절차 등을 ISMS 프레임워크에 통합한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} ISMS vs ISMS-P 선택 기준</strong><br />
          개인정보를 직접 처리하지 않는 인프라 전용 사업자는 ISMS만으로 충분하나,
          VASP는 KYC(Know Your Customer, 고객확인) 과정에서 실명·연락처·신분증 사본 등을 수집하므로
          3.x 영역이 포함된 ISMS-P가 필수.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">인증 흐름: 5단계</h3>
        <CertificationFlowViz />
        <p>
          인증 취득까지 통상 6~12개월 소요. 각 단계를 순서대로 정리하면:
        </p>
        <ol>
          <li>
            <strong>인증 신청</strong> — 인증 범위(시스템, 서비스, 물리적 위치) 확정 후 KISA 또는 인증기관에 신청서 제출.<br />
            범위 설정이 가장 중요한 단계. 범위가 넓으면 심사 비용·기간 증가, 좁으면 "범위 축소 지적"을 받을 수 있다.
          </li>
          <li>
            <strong>서면심사</strong> — 제출된 문서(정보보호 정책서, 위험평가서, 보호대책 이행 증적 등)를 심사원이 검토.<br />
            문서가 인증 기준을 모두 다루는지, 내용에 논리적 모순이 없는지 확인. 결함 발견 시 서면 보완 요청.
          </li>
          <li>
            <strong>현장심사</strong> — 심사원이 실제 사업장을 방문하여 문서와 현실의 일치 여부를 확인.<br />
            서버실 출입통제 장치가 실제로 작동하는지, DB 접근 로그가 실제로 생성되는지, 교육 수료증이 존재하는지 등을 직접 검증.<br />
            VASP의 경우 월렛(Wallet) 관리 절차가 특히 중점 심사 대상 — 콜드월렛(Cold Wallet, 오프라인 지갑) 보관 장소, 멀티시그(Multi-signature, 다중 서명) 설정, 출금 승인 프로세스 등.
          </li>
          <li>
            <strong>보완조치</strong> — 현장심사에서 도출된 결함(부적합 사항)에 대해 개선 조치를 수행하고 증적을 제출.<br />
            통상 40일 이내에 완료해야 하며, 기간 연장이 필요하면 연장 공문을 제출.
          </li>
          <li>
            <strong>인증 부여</strong> — 보완조치가 적합 판정을 받으면 인증서 발급.<br />
            유효기간 3년, 매년 사후심사(연차 심사)를 통해 유지 여부를 재확인.
          </li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 mb-3">조직 역할 구분</h3>
        <OrgRolesViz />
        <p>
          ISMS-P 인증에서 가장 먼저 확인하는 것이 "조직 구조와 책임 배분".<br />
          법적으로 지정해야 하는 역할은 세 가지:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">역할</th>
                <th className="text-left px-3 py-2 border-b border-border">직책</th>
                <th className="text-left px-3 py-2 border-b border-border">핵심 책임</th>
                <th className="text-left px-3 py-2 border-b border-border">법적 근거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">CISO</td>
                <td className="px-3 py-1.5 border-b border-border/30">최고정보보호책임자</td>
                <td className="px-3 py-1.5 border-b border-border/30">정보보호 정책 총괄, 예산 승인, 사고 대응 총책임</td>
                <td className="px-3 py-1.5 border-b border-border/30">정보통신망법 제45조의3</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">CPO</td>
                <td className="px-3 py-1.5 border-b border-border/30">개인정보보호책임자</td>
                <td className="px-3 py-1.5 border-b border-border/30">개인정보 처리 정책 총괄, 정보주체 권리 보장, 파기 관리</td>
                <td className="px-3 py-1.5 border-b border-border/30">개인정보보호법 제31조</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">실무 조직</td>
                <td className="px-3 py-1.5">보안팀 / IT운영팀</td>
                <td className="px-3 py-1.5">위험평가 실행, 보호대책 이행, 증적 관리, 모니터링</td>
                <td className="px-3 py-1.5">내부 규정</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          CISO와 CPO는 겸직이 가능하나, 소규모 사업자에 한정.<br />
          일정 규모 이상(자산총액 5조 원 또는 이용자 수 100만 명 이상) 사업자는 CISO를 임원급으로 지정해야 하며, 다른 직무와 겸직 불가.<br />
          실무 조직은 정보보호 계획의 실행 주체로, 위험평가 수행, 보호대책 구현, 증적(Evidence, 심사 시 제출하는 이행 근거 자료) 수집을 담당한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} VASP 특수성</strong><br />
          VASP는 일반 정보통신서비스 제공자와 달리 "가상자산의 이전·보관"이라는 고유 리스크 보유.<br />
          심사에서 핫월렛(Hot Wallet, 온라인 지갑)/콜드월렛 비율, 멀티시그 정책, 출금 승인 체계,
          트래블룰(Travel Rule, 가상자산 이전 시 송수신자 정보 전달 의무) 이행 여부를 추가로 확인한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">인증 기준 번호 체계</h3>
        <p>
          모든 인증 기준은 "영역.분류.항목" 형식의 3자리 번호로 식별.<br />
          예: <code>2.5.6</code>은 보호대책(2) {'>'} 인증 및 권한관리(5) {'>'} 6번째 세부항목.<br />
          이 번호 체계를 이해하면 심사 결함 보고서를 읽을 때 해당 항목이 어느 영역에 속하는지 즉시 파악 가능.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">2.x 분류</th>
                <th className="text-left px-3 py-2 border-b border-border">주제</th>
                <th className="text-left px-3 py-2 border-b border-border">항목 수</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.1</td><td className="px-3 py-1.5 border-b border-border/30">정책, 조직, 자산관리</td><td className="px-3 py-1.5 border-b border-border/30">3</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.2</td><td className="px-3 py-1.5 border-b border-border/30">인적 보안</td><td className="px-3 py-1.5 border-b border-border/30">6</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.3</td><td className="px-3 py-1.5 border-b border-border/30">외부자 보안</td><td className="px-3 py-1.5 border-b border-border/30">4</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.4</td><td className="px-3 py-1.5 border-b border-border/30">물리 보안</td><td className="px-3 py-1.5 border-b border-border/30">7</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.5</td><td className="px-3 py-1.5 border-b border-border/30">인증 및 권한관리</td><td className="px-3 py-1.5 border-b border-border/30">6</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.6</td><td className="px-3 py-1.5 border-b border-border/30">접근통제</td><td className="px-3 py-1.5 border-b border-border/30">7</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.7</td><td className="px-3 py-1.5 border-b border-border/30">암호화 적용</td><td className="px-3 py-1.5 border-b border-border/30">2</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.8</td><td className="px-3 py-1.5 border-b border-border/30">정보시스템 도입 및 개발 보안</td><td className="px-3 py-1.5 border-b border-border/30">6</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.9</td><td className="px-3 py-1.5 border-b border-border/30">시스템 및 서비스 운영관리</td><td className="px-3 py-1.5 border-b border-border/30">7</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.10</td><td className="px-3 py-1.5 border-b border-border/30">시스템 및 서비스 보안관리</td><td className="px-3 py-1.5 border-b border-border/30">9</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.11</td><td className="px-3 py-1.5 border-b border-border/30">사고 예방 및 대응</td><td className="px-3 py-1.5 border-b border-border/30">5</td></tr>
              <tr><td className="px-3 py-1.5">2.12</td><td className="px-3 py-1.5">재해 복구</td><td className="px-3 py-1.5">2</td></tr>
            </tbody>
          </table>
        </div>

        <p>
          이후 섹션에서 VASP에 특히 중요한 2.2(인적보안), 2.4(물리보안), 2.5(인증/권한), 2.6(접근통제), 2.7(암호화), 2.8(개발보안), 2.11(사고대응), 2.12(재해복구)를 상세히 다룬다.
        </p>

      </div>
    </section>
  );
}
