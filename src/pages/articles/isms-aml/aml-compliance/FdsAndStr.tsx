import FdsAndStrViz from './viz/FdsAndStrViz';
import FdsAlertFlowViz from './viz/FdsAlertFlowViz';
import IncidentResponseViz from './viz/IncidentResponseViz';

export default function FdsAndStr() {
  return (
    <section id="fds-and-str" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">이상거래 탐지와 의심거래 보고</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <FdsAndStrViz />

        <p>
          CDD가 "입구"에서 고객을 확인하는 절차라면, FDS는 "내부"에서 거래를 감시하는 절차.<br />
          FDS(Fraud Detection System, 이상거래탐지시스템)는 정상 거래 패턴에서 벗어나는 행위를 실시간으로 감지한다.<br />
          감지된 이상 거래 중 자금세탁 의심이 확인되면 STR(Suspicious Transaction Report, 의심거래보고)로 FIU에 보고한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">FDS 자동 탐지 패턴</h3>
        <p>
          FDS는 규칙 기반(Rule-based)과 이상 탐지(Anomaly Detection) 두 가지 방식을 병행한다.<br />
          규칙 기반은 미리 정의한 조건에 부합하면 경보를 발생시키고,
          이상 탐지는 고객의 과거 행동 패턴 대비 통계적으로 이탈한 거래를 감지한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">탐지 패턴</th>
                <th className="text-left px-3 py-2 border-b border-border">구체적 조건</th>
                <th className="text-left px-3 py-2 border-b border-border">세탁 의도 추정</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">고빈도 반복 거래</td>
                <td className="px-3 py-1.5 border-b border-border/30">단시간 내 동일 금액 반복 입금 또는 출금</td>
                <td className="px-3 py-1.5 border-b border-border/30">구조화(structuring) — 보고 기준 회피 목적 소액 분할</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">신규 계정 고액 거래</td>
                <td className="px-3 py-1.5 border-b border-border/30">가입 후 7일 이내 대규모 입금·매수</td>
                <td className="px-3 py-1.5 border-b border-border/30">세탁 전용 계정("깡통 계좌") 의심</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">믹서/프라이버시 코인 전송</td>
                <td className="px-3 py-1.5 border-b border-border/30">Tornado Cash, Wasabi Wallet, XMR/ZEC 연계 거래</td>
                <td className="px-3 py-1.5 border-b border-border/30">자금 출처 은닉 — 추적 차단 의도</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">즉시 전액 출금</td>
                <td className="px-3 py-1.5 border-b border-border/30">입금 후 수분 내 전액을 외부 지갑으로 이전</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래소를 단순 경유지로 활용 — 계층화(layering)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">다수 주소 분산</td>
                <td className="px-3 py-1.5 border-b border-border/30">한 계정에서 단시간 내 10개 이상 외부 주소로 소액 분산 전송</td>
                <td className="px-3 py-1.5 border-b border-border/30">자금 흐름 복잡화 — 추적 난이도 상승</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">제재 주소 연계</td>
                <td className="px-3 py-1.5">OFAC SDN 리스트, 블랙리스트 지갑과의 직간접 거래</td>
                <td className="px-3 py-1.5">제재 대상 자금 유입 — 즉시 차단 대상</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 구조화(Structuring)란</strong><br />
          보고 기준 금액(예: 1천만 원) 바로 아래로 거래를 분할하여 STR 대상에서 벗어나려는 수법.<br />
          "스머핑(smurfing)"이라고도 한다. FDS는 개별 거래가 기준 이하라도 누적 패턴으로 탐지한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">감시 체계</h3>
        <p>
          FDS 경보가 발생하면 사람이 판단해야 한다.<br />
          시스템이 "이상하다"고 감지한 것을 사람이 "의심스럽다"로 확정하는 과정.
        </p>
        <ul>
          <li><strong>준법감시인</strong> — 감시 체계 전체를 총괄. FDS 규칙 승인, STR 보고 최종 결정.</li>
          <li><strong>AML 담당자</strong> — FDS 경보를 1차 분석. 오탐(false positive) 필터링, 추가 조사 필요 건 분류.</li>
          <li><strong>보안팀</strong> — 온체인 분석 수행. 의심 지갑의 클러스터 분석, 거래 경로 추적.</li>
          <li><strong>운영팀</strong> — 계정 정지/해제 실행, 고객 연락(본인확인 요청).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">이상거래 감지 후 처리 프로세스</h3>
        <p>
          FDS 경보 발생부터 최종 조치까지의 흐름은 다음과 같다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">단계</th>
                <th className="text-left px-3 py-2 border-b border-border">수행 내용</th>
                <th className="text-left px-3 py-2 border-b border-border">담당</th>
                <th className="text-left px-3 py-2 border-b border-border">시한</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1. 초기 감지</td>
                <td className="px-3 py-1.5 border-b border-border/30">FDS 규칙 매칭 → 경보 생성</td>
                <td className="px-3 py-1.5 border-b border-border/30">시스템(자동)</td>
                <td className="px-3 py-1.5 border-b border-border/30">실시간</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2. 1차 분석</td>
                <td className="px-3 py-1.5 border-b border-border/30">경보 검토, 오탐 필터링, 추가 정보 수집</td>
                <td className="px-3 py-1.5 border-b border-border/30">AML 담당자</td>
                <td className="px-3 py-1.5 border-b border-border/30">경보 후 24시간 이내</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3. 계정 조치</td>
                <td className="px-3 py-1.5 border-b border-border/30">의심 확인 시 즉시 계정 정지 + 출금 차단</td>
                <td className="px-3 py-1.5 border-b border-border/30">운영팀</td>
                <td className="px-3 py-1.5 border-b border-border/30">분석 완료 즉시</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">4. 심층 조사</td>
                <td className="px-3 py-1.5 border-b border-border/30">온체인 분석, 본인확인 재요청, 자금 출처 소명 요구</td>
                <td className="px-3 py-1.5 border-b border-border/30">보안팀 + AML 담당자</td>
                <td className="px-3 py-1.5 border-b border-border/30">계정 정지 후 72시간 이내</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">5. 보고 결정</td>
                <td className="px-3 py-1.5 border-b border-border/30">STR 보고 여부 최종 결정</td>
                <td className="px-3 py-1.5 border-b border-border/30">준법감시인</td>
                <td className="px-3 py-1.5 border-b border-border/30">의심 인지 후 3영업일</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">6. 후속 조치</td>
                <td className="px-3 py-1.5">FIU 보고 완료, 수사기관 협조, 계정 해지 또는 모니터링 강화</td>
                <td className="px-3 py-1.5">준법감시인 + AML 담당자</td>
                <td className="px-3 py-1.5">보고 후 지속</td>
              </tr>
            </tbody>
          </table>
        </div>

        <FdsAlertFlowViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">STR/SAR — 의심거래 보고</h3>
        <p>
          STR(Suspicious Transaction Report)과 SAR(Suspicious Activity Report)은 같은 개념의 다른 이름.<br />
          한국 특금법에서는 "의심되는 거래의 보고"로 표현하며, 국제적으로는 SAR이 더 보편적.
        </p>

        <p>
          <strong>FIU 보고 대상</strong><br />
          다음 중 하나에 해당하면 보고 의무가 발생한다.
        </p>
        <ul>
          <li><strong>불법재산 의심</strong> — 거래 자금이 범죄 수익(사기, 횡령, 마약 등)에서 유래했다는 합리적 의심</li>
          <li><strong>자금세탁 의심</strong> — 범죄 수익의 출처를 은닉하거나 위장하려는 행위 의심</li>
          <li><strong>공중협박자금 의심</strong> — 테러 활동에 자금을 제공하려는 행위 의심</li>
        </ul>

        <p>
          "합리적 의심"이란 — 확정적 증거가 아니더라도, AML 전문가가 관련 정황을 종합했을 때
          "일반적인 거래로 보기 어렵다"고 판단하는 수준.<br />
          의심의 기준을 너무 높게 잡으면 실제 세탁 거래를 놓치고,
          너무 낮게 잡으면 보고 건수가 폭증하여 FIU의 분석 역량이 희석된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SAR 작성 내용</h3>
        <p>
          SAR은 FIU가 분석하고 수사기관에 전달할 수 있는 수준의 정보를 포함해야 한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
                <th className="text-left px-3 py-2 border-b border-border">기재 이유</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">거래 시점</td>
                <td className="px-3 py-1.5 border-b border-border/30">의심 거래 일시(KST 기준), 연관 거래 기간</td>
                <td className="px-3 py-1.5 border-b border-border/30">시간대별 패턴 분석, 수사 시점 특정</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">계정 정보</td>
                <td className="px-3 py-1.5 border-b border-border/30">실명, 계정 ID, 가입일, 연락처, KYC 등급</td>
                <td className="px-3 py-1.5 border-b border-border/30">대상자 특정, 다른 금융기관 교차 조회</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">자산 종류</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 대상 가상자산(BTC, ETH 등), 수량, 환산 원화 금액</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 규모 파악, 관련 자산 동결 범위</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">외부 지갑 주소</td>
                <td className="px-3 py-1.5 border-b border-border/30">입출금 경유 블록체인 주소, 알려진 라벨(거래소/믹서)</td>
                <td className="px-3 py-1.5 border-b border-border/30">자금 흐름 추적, 타 VASP 연계 조사</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">조치 내역</td>
                <td className="px-3 py-1.5">계정 정지 여부, 본인확인 재요청 결과, 고객 응답 내용</td>
                <td className="px-3 py-1.5">VASP의 선조치 확인, 추가 조사 필요 여부 판단</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} Tipping-off 금지</strong><br />
          SAR을 제출한 사실을 고객에게 알리는 것(tipping-off)은 형사처벌 대상.<br />
          고객이 보고 사실을 알면 증거를 인멸하거나 도주할 수 있기 때문.<br />
          계정 정지 사유를 고객에게 설명할 때도 "내부 보안 점검"으로만 안내하고, SAR 제출 사실은 언급하지 않는다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">내부 vs 외부 금융사고 대응</h3>
        <p>
          이상거래는 외부 고객의 세탁 시도만이 아니다.<br />
          내부 직원의 부정행위(횡령, 정보 유출, 공모)도 금융사고의 주요 원인.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">외부 사고</th>
                <th className="text-left px-3 py-2 border-b border-border">내부 사고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">주체</td>
                <td className="px-3 py-1.5 border-b border-border/30">고객, 해커, 제3자</td>
                <td className="px-3 py-1.5 border-b border-border/30">임직원, 외주인력</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">유형</td>
                <td className="px-3 py-1.5 border-b border-border/30">자금세탁, 해킹, 피싱, 사기 입금</td>
                <td className="px-3 py-1.5 border-b border-border/30">횡령, 고객정보 유출, 시세조종 공모</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">탐지 수단</td>
                <td className="px-3 py-1.5 border-b border-border/30">FDS, 온체인 분석, 고객 신고</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부 감사, 접근 로그, 이상 권한 사용 감지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">초동 대응</td>
                <td className="px-3 py-1.5 border-b border-border/30">계정 정지 → 조사 → STR</td>
                <td className="px-3 py-1.5 border-b border-border/30">권한 회수 → 격리 → 내부 조사 → 수사 의뢰</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">보고 대상</td>
                <td className="px-3 py-1.5">FIU, 수사기관</td>
                <td className="px-3 py-1.5">이사회, 감사위원회, 수사기관, 금융당국</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          내부 사고가 더 치명적인 이유 — 내부자는 FDS 규칙을 알고 있어 우회할 수 있고,
          고객 개인정보에 직접 접근할 수 있으며, 관리자 권한으로 로그를 조작할 가능성이 있다.<br />
          이 때문에 최소 권한 원칙(Least Privilege), 직무 분리(Segregation of Duties),
          관리자 행위 로그의 별도 보관(WORM 스토리지)이 필수.
        </p>

        <IncidentResponseViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">재발 방지 — 체계 고도화</h3>
        <p>
          사고가 발생하면 원인을 분석하고 체계를 개선해야 한다.<br />
          "같은 유형의 사고가 반복되지 않도록" 하는 것이 재발 방지의 핵심.
        </p>

        <p>
          <strong>AI 기반 FDS 고도화</strong><br />
          규칙 기반 FDS의 한계 — 미리 정의하지 않은 패턴은 탐지하지 못한다.<br />
          머신러닝(ML) 모델을 도입하면 과거 의심거래 데이터에서 패턴을 학습하여 새로운 수법도 감지할 수 있다.<br />
          다만 ML 모델은 블랙박스 문제가 있어, "왜 이 거래가 의심스러운지" 설명 가능한 모델(XAI)이 규제 관점에서 선호된다.
        </p>

        <p>
          <strong>블랙리스트 실시간 갱신</strong><br />
          OFAC SDN 리스트, FATF 고위험국 목록, 온체인 분석 업체가 제공하는 의심 주소 데이터베이스를 실시간으로 갱신한다.<br />
          갱신 주기가 느리면 새로 등재된 제재 주소와의 거래를 놓칠 수 있다.
        </p>

        <p>
          <strong>eKYC 강화</strong><br />
          딥페이크 기술의 발전으로 기존 안면인식이 우회될 수 있다.<br />
          NFC 기반 신분증 진위 확인, 생체인증 다중 팩터(지문 + 안면 + 행동 패턴), 비대면 영상 면담 등을 추가한다.
        </p>

        <p>
          <strong>교육과 훈련</strong><br />
          연 1회 이상 전 직원 대상 AML/CFT 교육을 실시하고, AML 담당자는 심화 교육을 별도로 이수한다.<br />
          시뮬레이션 훈련(모의 의심거래 시나리오)을 통해 실제 감지·보고 절차를 점검한다.
        </p>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} 기술만으로는 부족하다</strong><br />
          아무리 정교한 FDS를 갖춰도, 경보를 분석하는 사람의 역량이 부족하면 오탐만 쌓인다.<br />
          반대로 사람이 아무리 유능해도 시스템 없이는 거래량을 감당할 수 없다.<br />
          기술(FDS/AI)과 인적 역량(교육/조직)의 균형이 AML 체계의 성숙도를 결정한다.
        </p>

      </div>
    </section>
  );
}
