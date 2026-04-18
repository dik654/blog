import RiskBasedApproachViz from './viz/RiskBasedApproachViz';
import RiskAssessmentStepsViz from './viz/RiskAssessmentStepsViz';
import CustomerRiskModelViz from './viz/CustomerRiskModelViz';

export default function RiskBasedApproach() {
  return (
    <section id="risk-based-approach" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">위험기반 접근법 (RBA)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <RiskBasedApproachViz />

        <p>
          RBA(Risk-Based Approach)는 "모든 고객에게 동일한 수준의 확인을 하는 대신,
          위험이 높은 곳에 자원을 집중하자"는 원칙.<br />
          FATF가 2012년 권고사항 개정에서 RBA를 AML/CFT의 핵심 방법론으로 확정했다.
        </p>

        <p>
          왜 RBA가 필요한가 — 모든 고객에게 EDD 수준의 확인을 하면 비용이 폭증하고, 정상 고객의 서비스 경험이 나빠진다.<br />
          반대로 모든 고객에게 최소한의 확인만 하면 고위험 고객이 빠져나간다.<br />
          RBA는 이 두 극단 사이에서 효율적 균형을 찾는 방법.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">위험평가 4단계</h3>

        <p>
          VASP는 자사가 직면하는 자금세탁·테러자금 위험을 체계적으로 평가해야 한다.<br />
          이 평가는 4단계로 진행된다.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">1단계: 식별 (Identification)</h4>
        <p>
          "어디서 위험이 발생할 수 있는가"를 찾는 단계.<br />
          위험 요소를 네 가지 차원으로 분류한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">차원</th>
                <th className="text-left px-3 py-2 border-b border-border">위험 요소 예시</th>
                <th className="text-left px-3 py-2 border-b border-border">VASP 특수성</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">고객 위험</td>
                <td className="px-3 py-1.5 border-b border-border/30">PEP, 제재 대상, 고위험국 국적</td>
                <td className="px-3 py-1.5 border-b border-border/30">익명 지갑 사용자, DeFi 경유 자금</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">상품/서비스 위험</td>
                <td className="px-3 py-1.5 border-b border-border/30">프라이버시 코인, 스테이블코인 대량 거래</td>
                <td className="px-3 py-1.5 border-b border-border/30">믹서 경유, 크로스체인 브릿지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">지역 위험</td>
                <td className="px-3 py-1.5 border-b border-border/30">FATF 블랙리스트/그레이리스트 국가</td>
                <td className="px-3 py-1.5 border-b border-border/30">글로벌 P2P 거래, 해외 거래소 경유</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">거래 채널 위험</td>
                <td className="px-3 py-1.5">비대면, 제3자 경유, API 거래</td>
                <td className="px-3 py-1.5">봇 거래, 자동화된 대량 출금</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="text-lg font-semibold mt-6 mb-2">2단계: 분석 (Analysis)</h4>
        <p>
          식별한 위험 요소 각각에 대해 "발생 가능성(Likelihood)"과 "영향도(Impact)"를 평가하고,
          두 값을 조합하여 위험 등급(고/중/저)을 산출한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">발생 가능성 \ 영향도</th>
                <th className="text-center px-3 py-2 border-b border-border">낮음</th>
                <th className="text-center px-3 py-2 border-b border-border">중간</th>
                <th className="text-center px-3 py-2 border-b border-border">높음</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">높음</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-center text-yellow-600 font-medium">중</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-center text-red-600 font-medium">고</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-center text-red-600 font-medium">고</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">중간</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-center text-green-600 font-medium">저</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-center text-yellow-600 font-medium">중</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-center text-red-600 font-medium">고</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">낮음</td>
                <td className="px-3 py-1.5 text-center text-green-600 font-medium">저</td>
                <td className="px-3 py-1.5 text-center text-green-600 font-medium">저</td>
                <td className="px-3 py-1.5 text-center text-yellow-600 font-medium">중</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          예: "프라이버시 코인 취급"은 발생 가능성이 높고(세탁 도구로 활용 빈번), 영향도도 높음(추적 불가) → 고위험.<br />
          "KRW 소액 입금"은 발생 가능성 낮고, 영향도 낮음 → 저위험.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">3단계: 평가 (Evaluation)</h4>
        <p>
          2단계에서 산출한 "고유위험(Inherent Risk)"에 현재 통제 수준을 반영하여 "잔여위험(Residual Risk)"을 산출한다.
        </p>

        <p>
          고유위험이 높더라도 강력한 통제(FDS 자동 차단, EDD 적용 등)가 있으면 잔여위험은 낮아질 수 있다.<br />
          반대로 고유위험이 낮아도 통제가 부실하면 잔여위험이 높아진다.<br />
          핵심 공식: <strong>잔여위험 = 고유위험 - 통제 효과</strong>
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 잔여위험이 "0"이 될 수 없는 이유</strong><br />
          어떤 통제도 완벽하지 않다 — 새로운 세탁 수법, 시스템 장애, 인적 오류가 항상 존재.<br />
          RBA의 목표는 잔여위험을 "수용 가능한 수준"까지 낮추는 것이지, 제거하는 것이 아니다.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">4단계: 지속 (Ongoing)</h4>
        <p>
          위험평가는 일회성이 아니라 지속적 프로세스.<br />
          연 1회 이상 전사 차원의 위험평가를 실시하고, 다음 상황에서는 수시 재평가를 수행한다.
        </p>
        <ul>
          <li>새로운 상품·서비스 출시 (예: NFT 거래 추가, 스테이킹 서비스 도입)</li>
          <li>법규·규제 변경 (예: Travel Rule 적용 범위 확대)</li>
          <li>자금세탁 유형 변화 (예: 새로운 믹싱 프로토콜 등장)</li>
          <li>내부 감사 결과 취약점 발견</li>
          <li>외부 환경 급변 (예: 특정 국가 제재 추가)</li>
        </ul>

        <RiskAssessmentStepsViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">3선 방어 모델 (Three Lines of Defence)</h3>
        <p>
          RBA를 조직적으로 실행하기 위한 거버넌스 구조.<br />
          각 선(line)은 서로 독립적으로 작동하며, 상위 선이 하위 선을 감시한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">방어선</th>
                <th className="text-left px-3 py-2 border-b border-border">담당</th>
                <th className="text-left px-3 py-2 border-b border-border">역할</th>
                <th className="text-left px-3 py-2 border-b border-border">VASP 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1선 (현업)</td>
                <td className="px-3 py-1.5 border-b border-border/30">운영팀, CS팀</td>
                <td className="px-3 py-1.5 border-b border-border/30">일상적 위험 관리, CDD 실행</td>
                <td className="px-3 py-1.5 border-b border-border/30">KYC 심사원이 신분증 검증 수행</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2선 (준법감시/위험관리)</td>
                <td className="px-3 py-1.5 border-b border-border/30">준법감시팀, AML팀</td>
                <td className="px-3 py-1.5 border-b border-border/30">정책 수립, 모니터링, 1선 감독</td>
                <td className="px-3 py-1.5 border-b border-border/30">FDS 규칙 설정, STR 보고 결정</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">3선 (내부감사)</td>
                <td className="px-3 py-1.5">감사팀/외부감사</td>
                <td className="px-3 py-1.5">1선·2선 적정성 독립 평가</td>
                <td className="px-3 py-1.5">연 1회 AML 체계 감사, 개선 권고</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          3선이 독립적이어야 하는 이유 — 2선이 설계한 정책에 결함이 있어도 2선 스스로는 발견하기 어렵다.<br />
          3선(감사)이 "외부 시각"으로 전체 체계를 검증해야 사각지대가 드러난다.<br />
          감사팀은 CCO나 CISO의 지휘를 받지 않고, 이사회 또는 감사위원회에 직접 보고한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">위험관리 위원회</h3>
        <p>
          일정 규모 이상의 VASP는 위험관리 위원회를 구성하여 전사 차원의 위험을 논의한다.
        </p>
        <ul>
          <li><strong>구성</strong> — CCO(의장), CISO, AML팀장, 운영팀장, 법무팀장. 필요 시 외부 전문가 참여.</li>
          <li><strong>주기</strong> — 분기 1회 정기 회의 + 긴급 사안 발생 시 수시 회의.</li>
          <li><strong>의결 사항</strong> — 신규 위험 식별 결과 승인, 잔여위험 수용 여부, 통제 개선 계획, 위험평가 방법론 변경.</li>
          <li><strong>기록</strong> — 회의록 작성·보관 의무. FIU 검사 시 위원회 활동 내역이 핵심 점검 대상.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">고객 위험평가 모델</h3>
        <p>
          전사 위험평가와 별도로, 개별 고객의 위험 등급을 산정하는 모델도 필요하다.<br />
          정성 평가와 정량 평가를 조합하는 것이 일반적.
        </p>

        <p>
          <strong>정성 평가 (Expert Judgment)</strong><br />
          AML 담당자가 고객의 직업, 거래 목적, 자금 출처 등을 종합적으로 판단하여 위험 등급을 부여.<br />
          장점: 맥락을 반영할 수 있다. 단점: 일관성이 떨어질 수 있다.
        </p>

        <p>
          <strong>정량 평가 (Scoring Model)</strong><br />
          각 위험 요소에 점수를 부여하고 가중합으로 총점을 산출.<br />
          예: 국적 위험(0~30점) + 직업 위험(0~20점) + 거래 패턴(0~30점) + 자금 출처(0~20점) = 총 100점 만점.<br />
          60점 이상 고위험, 30~59점 중위험, 29점 이하 저위험.<br />
          장점: 일관성 있다. 단점: 수치에 포착되지 않는 위험을 놓칠 수 있다.
        </p>

        <p>
          실무에서는 정량 모델로 초기 등급을 산출하고, 정성 평가로 조정(override)하는 방식을 병행한다.<br />
          override 시에는 반드시 사유를 기록하고, 상위자 승인을 받아야 한다.
        </p>

        <CustomerRiskModelViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">문서화 의무</h3>
        <p>
          위험평가의 모든 과정은 문서로 남겨야 한다.<br />
          "했다"고 말하는 것과 "문서로 증명할 수 있다"는 것은 규제 관점에서 전혀 다르다.
        </p>
        <ul>
          <li><strong>위험평가 계획서</strong> — 평가 범위, 방법론, 일정, 담당자</li>
          <li><strong>위험평가 수행 기록</strong> — 식별된 위험, 분석 과정, 산출 근거</li>
          <li><strong>위험평가 결과 보고서</strong> — 잔여위험 현황, 고위험 항목, 개선 권고</li>
          <li><strong>위원회 승인 기록</strong> — 결과 승인일, 승인자, 조건부 승인 시 조건 내용</li>
          <li><strong>이행 계획서</strong> — 개선 조치 항목, 담당자, 완료 기한, 진행 상태</li>
        </ul>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} FIU 검사의 핵심</strong><br />
          FIU 현장 검사에서 가장 먼저 요구하는 것이 "위험평가 보고서"와 "위원회 회의록".<br />
          체계가 아무리 좋아도 문서가 없으면 "미이행"으로 판정된다 — 문서화 자체가 통제의 일부.
        </p>

      </div>
    </section>
  );
}
