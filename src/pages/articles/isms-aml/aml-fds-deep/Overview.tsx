import OverviewViz from './viz/OverviewViz';
import FdsArchitectureViz from './viz/FdsArchitectureViz';
import MonitoringOrgViz from './viz/MonitoringOrgViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">이상거래 탐지 시스템(FDS)이란</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          FDS(Fraud Detection System)는 거래 데이터를 실시간으로 분석하여 비정상 거래를 자동 감지하는 시스템.<br />
          가상자산 거래소에서 FDS는 자금세탁, 사기, 시세조종 같은 불법 행위의 첫 번째 방어선 역할을 한다.<br />
          고객의 거래 패턴, 접속 환경, 지갑 주소 이력 등을 종합 분석하여 "정상 범위를 벗어난 거래"에 경보를 발생시킨다.
        </p>

        <OverviewViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">법적 근거 — 이상거래 상시 감시 의무</h3>
        <p>
          가상자산이용자보호법 제12조는 가상자산사업자에게 이상거래를 상시 감시할 의무를 부과한다.<br />
          "가상자산의 가격이나 거래량이 비정상적으로 변동하는 거래 등 대통령령으로 정하는 이상거래를 상시 감시하고,
          이용자 보호 및 건전한 거래질서 유지를 위하여 적절한 조치를 취하여야 한다."<br />
          이 의무를 이행하지 않으면 과태료 부과 대상이며, 중대한 위반 시 사업 신고 취소까지 가능하다.
        </p>

        <p>
          별도로 특금법 제4조는 의심거래보고(STR) 의무를 규정한다.<br />
          FDS가 감지한 이상거래 중 자금세탁이 의심되는 건은 금융정보분석원(FIU)에 보고해야 한다.<br />
          즉 FDS는 두 가지 법률의 교차점에 위치한다 — 이용자보호법의 "시장 감시"와 특금법의 "자금세탁 방지"를 동시에 수행.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">FDS의 세 가지 접근 방식</h3>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">방식</th>
                <th className="text-left px-3 py-2 border-b border-border">원리</th>
                <th className="text-left px-3 py-2 border-b border-border">장점</th>
                <th className="text-left px-3 py-2 border-b border-border">한계</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">규칙 기반(Rule-based)</td>
                <td className="px-3 py-1.5 border-b border-border/30">미리 정의한 조건(임계값, 패턴)에 부합하면 경보 발생</td>
                <td className="px-3 py-1.5 border-b border-border/30">설명 가능, 즉시 배포 가능, 규제 검증 용이</td>
                <td className="px-3 py-1.5 border-b border-border/30">새로운 수법 대응 불가, 규칙이 많아지면 오탐 급증</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">행위 기반(Behavior-based)</td>
                <td className="px-3 py-1.5 border-b border-border/30">고객별 과거 행동 프로파일 대비 통계적 이탈 감지</td>
                <td className="px-3 py-1.5 border-b border-border/30">개인화된 탐지, 미지의 패턴도 포착 가능</td>
                <td className="px-3 py-1.5 border-b border-border/30">신규 고객은 프로파일 부족, 모델 구축에 시간 소요</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">AI 기반(ML/DL)</td>
                <td className="px-3 py-1.5">과거 의심거래 데이터에서 패턴을 학습하여 새로운 거래를 분류</td>
                <td className="px-3 py-1.5">복합 패턴 인식, 자동 고도화, 대규모 데이터 처리</td>
                <td className="px-3 py-1.5">블랙박스 문제, 학습 데이터 편향, 설명 가능성 부족</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          실무에서는 세 가지를 병행한다.<br />
          규칙 기반이 1차 필터 역할을 하고, 행위 기반이 개인화된 이상 탐지를 수행하며, AI 모델이 복합 패턴을 보완한다.<br />
          국내 주요 거래소들은 AI 기반 FDS를 도입하여 누적 수천억 원 규모의 이상거래를 차단한 것으로 알려져 있다.
        </p>

        <FdsArchitectureViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">FDS 아키텍처</h3>
        <p>
          FDS는 크게 네 단계로 구성된다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">단계</th>
                <th className="text-left px-3 py-2 border-b border-border">역할</th>
                <th className="text-left px-3 py-2 border-b border-border">주요 데이터</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1. 데이터 수집</td>
                <td className="px-3 py-1.5 border-b border-border/30">모든 거래·접속·행위 데이터를 실시간 수집</td>
                <td className="px-3 py-1.5 border-b border-border/30">호가 정보, 매매 주문, 입출금 내역, IP/디바이스, 지갑 주소</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2. 패턴 분석</td>
                <td className="px-3 py-1.5 border-b border-border/30">규칙 매칭 + 통계 모델 + ML 추론</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 금액/빈도, 지갑 위험 점수, 행동 프로파일</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3. 경보 발생</td>
                <td className="px-3 py-1.5 border-b border-border/30">임계값 초과 시 담당자에게 즉시 알림</td>
                <td className="px-3 py-1.5 border-b border-border/30">경보 등급(높음/중간/낮음), 의심 사유, 관련 거래 목록</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">4. 조치 실행</td>
                <td className="px-3 py-1.5">사람이 판단 후 계정 정지, 추가 확인, STR 보고 등 실행</td>
                <td className="px-3 py-1.5">조치 이력, 고객 소명 자료, FIU 보고 기록</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          핵심은 "자동 감지 + 사람의 판단"이 결합된 구조라는 점.<br />
          시스템이 경보를 발생시키면 AML 담당자가 1차 분석하고, 준법감시인이 최종 판단한다.<br />
          자동화만으로는 오탐(false positive)을 제거할 수 없고, 사람만으로는 초당 수천 건의 거래를 감당할 수 없다.
        </p>

        <MonitoringOrgViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">감시 조직</h3>
        <p>
          FDS 운영은 단일 부서의 업무가 아니라 여러 부서의 협력 체계로 운영된다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">역할</th>
                <th className="text-left px-3 py-2 border-b border-border">책임</th>
                <th className="text-left px-3 py-2 border-b border-border">FDS와의 관계</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">준법감시인</td>
                <td className="px-3 py-1.5 border-b border-border/30">FDS 규칙 승인, STR 보고 최종 결정, 감시 체계 총괄</td>
                <td className="px-3 py-1.5 border-b border-border/30">경보의 최종 의사결정자</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">AML 담당자</td>
                <td className="px-3 py-1.5 border-b border-border/30">경보 1차 분석, 오탐 필터링, 의심 건 분류</td>
                <td className="px-3 py-1.5 border-b border-border/30">경보의 1차 처리자</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">보안팀</td>
                <td className="px-3 py-1.5 border-b border-border/30">온체인 분석, 지갑 클러스터 추적, 위협 인텔리전스</td>
                <td className="px-3 py-1.5 border-b border-border/30">기술적 심층 분석 담당</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">운영팀</td>
                <td className="px-3 py-1.5">계정 정지/해제 실행, 고객 본인확인 요청</td>
                <td className="px-3 py-1.5">경보에 따른 조치 실행자</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          가상자산이용자보호법은 이상거래 감시를 위한 "상시감시조직"의 구성과 운영을 요구한다.<br />
          금융위원회 가이드라인에 따르면, 호가 정보와 매매 주문 매체 정보를 축적하는 시스템,
          이상거래 적출 시스템, 심리 체계, 혐의사항 통보 및 신고 체계를 모두 갖춰야 한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} FDS vs AML 모니터링의 차이</strong><br />
          FDS는 넓은 의미에서 모든 이상거래(사기, 해킹, 시세조종 포함)를 탐지하는 시스템.<br />
          AML 모니터링은 FDS의 하위 집합으로, 자금세탁 관련 패턴에 집중한다.<br />
          실무에서는 하나의 시스템이 양쪽 기능을 모두 수행하되,
          경보를 "시장 감시 경보"와 "AML 경보"로 분류하여 서로 다른 조직이 처리하는 구조를 취한다.
        </p>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} 과태료 현황</strong><br />
          FIU가 부과한 과태료 총액의 약 77%가 가상자산사업자에 집중되어 있다(건수 기준으로는 4.2%).<br />
          건당 과태료가 높은 이유는 의심거래 미보고, CDD 미이행 등 핵심 의무 위반이 대부분이기 때문.<br />
          FDS 체계의 부실이 곧 대규모 과태료로 직결된다.
        </p>

      </div>
    </section>
  );
}
