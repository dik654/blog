import SarProcessViz from './viz/SarProcessViz';
import InitialDetectionViz from './viz/InitialDetectionViz';
import SarSubmissionViz from './viz/SarSubmissionViz';

export default function SarProcess() {
  return (
    <section id="sar-process" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SAR 작성과 제출 프로세스</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          SAR(Suspicious Activity Report)은 의심거래를 발견한 시점부터 FIU 제출까지
          5단계의 프로세스를 거친다.<br />
          각 단계에서 책임자가 명확히 지정되어야 하며, 전 과정의 기록이 남아야 한다.
        </p>

        <SarProcessViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">1단계 — 현업 의심 인지</h3>
        <p>
          의심거래의 최초 인지는 두 가지 경로로 발생한다.
        </p>
        <ul>
          <li><strong>FDS 경보</strong> — 이상거래탐지시스템이 자동으로 경보를 생성. 전체 의심 인지의 대부분을 차지</li>
          <li><strong>현업 직원 보고</strong> — CS(고객서비스)팀, 운영팀 등 현업에서 직접 이상 징후를 인지하여 내부 보고</li>
        </ul>
        <p>
          현업 직원이 인지해야 하는 대표적 징후:<br />
          고객이 거래 목적을 설명하지 못함, 본인확인 회피 시도, 타인 명의 이용 정황,
          거래 패턴이 직업·소득과 불일치, 급박하게 대규모 출금을 요구하는 경우 등.<br />
          이러한 징후를 인지하면 "내부 보고서(Internal Report)"를 작성하여 보고책임자(AML 담당자 또는 준법감시인)에게 전달한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2단계 — 보고책임자 1차 검토</h3>
        <p>
          AML 담당자가 내부 보고서를 접수하고 1차 검토를 수행한다.<br />
          검토 내용:
        </p>
        <ul>
          <li><strong>경보 유효성</strong> — FDS 경보가 오탐(False Positive)인지 확인. 정상 거래가 규칙에 걸린 것은 아닌지 판별</li>
          <li><strong>고객 프로파일 대조</strong> — CDD 자료(직업, 소득 수준, 거래 목적)와 실제 거래 패턴의 정합성 확인</li>
          <li><strong>온체인 분석</strong> — 관련 지갑 주소의 위험 점수, 거래 경로, 믹서/제재 주소 연관성 조회</li>
          <li><strong>추가 정보 수집</strong> — 고객에게 자금 출처 소명을 요청하거나 타 VASP에 정보 조회(Travel Rule 활용)</li>
        </ul>
        <p>
          1차 검토 결과는 세 가지로 분류된다:<br />
          (a) 오탐 확인 → 경보 종료,<br />
          (b) 추가 조사 필요 → 심층 분석 진행,<br />
          (c) SAR 작성 필요 → 3단계로 이행.
        </p>

        <InitialDetectionViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">3단계 — SAR 작성</h3>
        <p>
          SAR은 FIU가 분석하고 수사기관에 전달할 수 있는 수준의 구체적 정보를 포함해야 한다.<br />
          부실한 SAR은 FIU에서 "정보 부족"으로 반려되거나 분석 우선순위에서 밀린다.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">필수 기재 항목</h4>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">기재 내용</th>
                <th className="text-left px-3 py-2 border-b border-border">기재 이유</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">거래 일시/금액/유형</td>
                <td className="px-3 py-1.5 border-b border-border/30">의심 거래 발생 일시(KST), 금액(원화 환산 포함), 거래 유형(입금/출금/매수/매도)</td>
                <td className="px-3 py-1.5 border-b border-border/30">수사 시점 특정, 거래 규모 파악</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">관련 계정/지갑 주소</td>
                <td className="px-3 py-1.5 border-b border-border/30">대상자 실명, 계정 ID, 가입일, KYC 등급, 관련 블록체인 주소(전체)</td>
                <td className="px-3 py-1.5 border-b border-border/30">대상자 특정, 타 금융기관 교차 조회, 온체인 추적 시작점</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">의심 사유</td>
                <td className="px-3 py-1.5 border-b border-border/30">왜 이 거래가 의심스러운지 구체적으로 서술. FDS 규칙 매칭 결과, 행동 분석 결과, 온체인 분석 결과 포함</td>
                <td className="px-3 py-1.5 border-b border-border/30">FIU의 분석 방향 제시, 수사 개시 판단 근거</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">관련 증빙자료</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래내역 캡처, FDS 경보 로그, 온체인 분석 리포트, 고객 소명 내용(있는 경우)</td>
                <td className="px-3 py-1.5 border-b border-border/30">의심 근거의 증거력 확보</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">VASP 조치 내역</td>
                <td className="px-3 py-1.5">계정 정지 여부, 본인확인 재요청 결과, 출금 차단 시점</td>
                <td className="px-3 py-1.5">VASP의 선제 대응 확인, 추가 조치 필요 여부 판단</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          의심 사유 작성이 SAR의 핵심.<br />
          "FDS 경보 발생"만으로는 부족하다 — "왜 이 경보가 자금세탁 의심으로 이어지는지"를 논리적으로 서술해야 한다.<br />
          예: "가입 3일 차 고객이 5천만 원 입금 후 30분 내 전액을 믹서 연계 주소로 출금.
          CDD 상 직업은 대학생이며 소득 수준과 거래 규모가 현저히 불일치.
          온체인 분석 결과 수신 주소는 Tornado Cash와 2홉 내 연결되어 위험 점수 87점."
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">4단계 — FIU 제출</h3>
        <p>
          SAR은 FIU에 전자적 방식으로 제출한다.<br />
          FIU가 운영하는 온라인 보고 시스템(goAML 등)을 통해 접수하며,
          지정된 양식에 맞춰 전자 서명과 함께 제출한다.
        </p>
        <p>
          제출 전 준법감시인(또는 보고책임자)의 최종 승인이 필수.<br />
          승인권자가 부재 시를 대비한 대행 체계(직무 대행자 지정)도 사전에 마련해야 한다 —
          "지체 없이" 보고해야 하는 의무를 이행하기 위해 승인 절차가 지연되어서는 안 된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">5단계 — FIU 분석과 후속 조치</h3>
        <p>
          FIU는 접수된 SAR을 분석하여 법집행기관(검찰, 경찰, 국세청, 관세청 등)에 통보한다.<br />
          모든 SAR이 수사로 이어지는 것은 아니다 — FIU가 정보를 분석하여 "수사 가치가 있는 건"을 선별한다.
        </p>
        <p>
          VASP 입장에서 SAR 제출 후 해야 할 것:
        </p>
        <ul>
          <li><strong>계정 모니터링 유지</strong> — 보고 후에도 해당 계정의 거래를 지속 감시. 추가 의심 거래 발생 시 후속 SAR 제출</li>
          <li><strong>수사 협조</strong> — FIU 또는 수사기관의 자료 요청에 즉시 응대. 거래내역, 로그, KYC 자료 등 제공</li>
          <li><strong>계정 처리 결정</strong> — 의심이 해소되지 않으면 계정 해지 검토. 해지 시에도 기록은 5년 이상 보관</li>
          <li><strong>내부 교훈 반영</strong> — SAR 건에서 발견된 새로운 패턴을 FDS 규칙에 반영, 교육 사례로 활용</li>
        </ul>

        <SarSubmissionViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">전체 프로세스 타임라인</h3>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">단계</th>
                <th className="text-left px-3 py-2 border-b border-border">담당</th>
                <th className="text-left px-3 py-2 border-b border-border">시한</th>
                <th className="text-left px-3 py-2 border-b border-border">산출물</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1. 의심 인지</td>
                <td className="px-3 py-1.5 border-b border-border/30">FDS(자동) / 현업 직원</td>
                <td className="px-3 py-1.5 border-b border-border/30">실시간</td>
                <td className="px-3 py-1.5 border-b border-border/30">FDS 경보 또는 내부 보고서</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2. 1차 검토</td>
                <td className="px-3 py-1.5 border-b border-border/30">AML 담당자</td>
                <td className="px-3 py-1.5 border-b border-border/30">경보 후 24시간 이내</td>
                <td className="px-3 py-1.5 border-b border-border/30">검토 보고서 (오탐/추가조사/SAR 판정)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3. SAR 작성</td>
                <td className="px-3 py-1.5 border-b border-border/30">AML 담당자 + 보안팀</td>
                <td className="px-3 py-1.5 border-b border-border/30">판정 후 24시간 이내</td>
                <td className="px-3 py-1.5 border-b border-border/30">SAR 초안 + 증빙자료</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">4. 승인 및 제출</td>
                <td className="px-3 py-1.5 border-b border-border/30">준법감시인</td>
                <td className="px-3 py-1.5 border-b border-border/30">의심 인지 후 3영업일 이내</td>
                <td className="px-3 py-1.5 border-b border-border/30">FIU 제출 완료 확인서</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">5. 후속 조치</td>
                <td className="px-3 py-1.5">AML 담당자 + 운영팀</td>
                <td className="px-3 py-1.5">제출 후 지속</td>
                <td className="px-3 py-1.5">모니터링 기록, 수사 협조 기록</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} "방어적 보고"의 문제</strong><br />
          일부 VASP는 과태료를 피하기 위해 의심 수준이 낮은 거래까지 무분별하게 SAR을 제출한다.<br />
          이를 "방어적 보고(Defensive Filing)"라 하며, FIU의 분석 역량을 희석시키는 부작용이 있다.<br />
          FIU는 양보다 질을 강조하고 있으며, 보고의 구체성과 논리성이 평가 기준이 된다.
        </p>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} 제재 주소 연관 시 즉시 대응</strong><br />
          OFAC SDN 리스트에 등재된 제재 주소와의 직접 거래가 감지되면 SAR 프로세스를 기다리지 않고 즉시 거래를 차단해야 한다.<br />
          제재 위반은 자금세탁보다 중한 처벌 대상이며, "보고 후 조치"가 아니라 "즉시 차단 + 보고 병행"이 원칙.
        </p>

      </div>
    </section>
  );
}
