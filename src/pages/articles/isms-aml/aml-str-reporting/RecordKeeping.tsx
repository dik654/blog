import RecordKeepingViz from './viz/RecordKeepingViz';
import RetentionRequirementsViz from './viz/RetentionRequirementsViz';
import TrainingCycleViz from './viz/TrainingCycleViz';

export default function RecordKeeping() {
  return (
    <section id="record-keeping" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">기록 보관과 교육</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          AML/CFT 체계의 마지막 축은 기록 보관과 교육.<br />
          아무리 정교한 FDS와 SAR 프로세스를 갖춰도, 기록이 소실되면 사후 검증이 불가능하고,
          교육이 부실하면 체계가 형식에 그친다.<br />
          규제 당국의 점검에서 "기록 보관 미흡"과 "교육 미실시"는 가장 빈번하게 지적되는 사항.
        </p>

        <RecordKeepingViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">보관 대상</h3>
        <p>
          특금법 제5조의3은 금융회사등에 거래 기록과 고객확인 자료의 보관 의무를 부과한다.<br />
          VASP가 보관해야 할 기록은 크게 네 가지 범주로 나뉜다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">범주</th>
                <th className="text-left px-3 py-2 border-b border-border">포함 자료</th>
                <th className="text-left px-3 py-2 border-b border-border">활용 목적</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">고객확인(CDD) 자료</td>
                <td className="px-3 py-1.5 border-b border-border/30">실명 확인 서류, 신분증 사본, EDD 자료, 실제소유자 확인 기록, 위험 등급 산정 근거</td>
                <td className="px-3 py-1.5 border-b border-border/30">고객 신원 재확인, 수사기관 자료 제공, 규제 점검 시 제시</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">거래 내역</td>
                <td className="px-3 py-1.5 border-b border-border/30">모든 입출금 기록(원화/가상자산), 매수/매도 기록, 블록체인 트랜잭션 해시, 상대방 정보</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 경로 추적, 자금 흐름 분석, SAR 증빙</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">SAR 사본 및 조치 기록</td>
                <td className="px-3 py-1.5 border-b border-border/30">제출한 SAR 전문, FDS 경보 로그, 분석 보고서, 계정 조치 이력, FIU 접수 확인</td>
                <td className="px-3 py-1.5 border-b border-border/30">보고 의무 이행 증빙, 감사 시 제시, 수사 협조</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">내부 통제 기록</td>
                <td className="px-3 py-1.5">AML 정책 문서, 교육 기록, 감사 보고서, FDS 규칙 변경 이력</td>
                <td className="px-3 py-1.5">체계 적정성 입증, 규제 점검 시 내부통제 운영 현황 제시</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">보관 기간</h3>
        <p>
          특금법은 최소 5년 이상의 보관 기간을 규정한다.<br />
          5년의 기산점은 "거래 관계 종료일" 또는 "거래일" 중 늦은 날.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">자료 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">보관 기간</th>
                <th className="text-left px-3 py-2 border-b border-border">기산점</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">CDD 자료</td>
                <td className="px-3 py-1.5 border-b border-border/30">5년 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 관계 종료일 (계정 해지일)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">거래 내역</td>
                <td className="px-3 py-1.5 border-b border-border/30">5년 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">해당 거래 발생일</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">SAR 사본</td>
                <td className="px-3 py-1.5 border-b border-border/30">5년 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">SAR 제출일</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">내부 통제 기록</td>
                <td className="px-3 py-1.5">5년 이상 (내부 규정에 따라 연장 가능)</td>
                <td className="px-3 py-1.5">문서 작성일 또는 교육 실시일</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          "5년"이 최소 기준이며, 수사가 진행 중인 건은 수사 종료 시까지 보관 기간이 연장된다.<br />
          실무적으로는 7~10년 보관을 권고하는 경우도 있다 — 자금세탁 사건의 수사 기간이 길어질 수 있기 때문.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">보관 방법</h3>
        <p>
          기록은 수사기관이나 FIU 요청 시 즉시 제공할 수 있는 형태로 보관해야 한다.<br />
          "보관하고 있었지만 찾을 수 없다"는 사실상 미보관과 동일하게 취급된다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">보관 요건</th>
                <th className="text-left px-3 py-2 border-b border-border">구체적 방법</th>
                <th className="text-left px-3 py-2 border-b border-border">근거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">전자적 보관</td>
                <td className="px-3 py-1.5 border-b border-border/30">데이터베이스 + 파일 스토리지. 종이 문서도 전자화(스캔) 후 보관</td>
                <td className="px-3 py-1.5 border-b border-border/30">즉시 검색 및 제공 가능</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">암호화</td>
                <td className="px-3 py-1.5 border-b border-border/30">저장 시 암호화(AES-256 이상), 전송 시 TLS 1.2+ 적용</td>
                <td className="px-3 py-1.5 border-b border-border/30">ISMS-P 2.7 암호화 요구사항, 개인정보보호법</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">접근 통제</td>
                <td className="px-3 py-1.5 border-b border-border/30">역할 기반 접근제어(RBAC), 접근 로그 기록, 주기적 접근 권한 검토</td>
                <td className="px-3 py-1.5 border-b border-border/30">불필요한 열람 방지, 내부 유출 추적</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">무결성 보장</td>
                <td className="px-3 py-1.5 border-b border-border/30">WORM(Write Once Read Many) 스토리지 또는 해시 체인으로 변조 방지</td>
                <td className="px-3 py-1.5 border-b border-border/30">기록의 증거 능력 유지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">백업</td>
                <td className="px-3 py-1.5">이중화 백업(온사이트 + 오프사이트), 주기적 복구 테스트</td>
                <td className="px-3 py-1.5">재해 발생 시 기록 소실 방지</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          SAR 사본은 특히 엄격한 접근 통제가 필요하다.<br />
          SAR 내용이 유출되면 Tipping-off에 해당하므로, AML 담당자와 준법감시인만 접근 가능하도록 별도 저장소에 보관한다.
        </p>

        <RetentionRequirementsViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">정기 교육</h3>
        <p>
          AML/CFT 교육은 "형식적 이행"이 아니라 "실질적 역량 강화"를 목표로 해야 한다.<br />
          규제 당국 점검에서 "교육 실시 기록"뿐 아니라 "교육 내용의 실효성"도 평가 대상이다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">대상</th>
                <th className="text-left px-3 py-2 border-b border-border">주기</th>
                <th className="text-left px-3 py-2 border-b border-border">교육 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">전 직원</td>
                <td className="px-3 py-1.5 border-b border-border/30">연 1회 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">특금법 개요, AML/CFT 기본 개념, Tipping-off 금지, 내부 신고 절차</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">출금 승인자 / CS팀</td>
                <td className="px-3 py-1.5 border-b border-border/30">반기 1회 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">의심 징후 식별법, 계정 제한 안내 스크립트, 에스컬레이션 절차</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">AML 담당자</td>
                <td className="px-3 py-1.5 border-b border-border/30">분기 1회 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">SAR 작성법 심화, 온체인 분석 기법, 최신 세탁 유형, FDS 규칙 업데이트</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">경영진</td>
                <td className="px-3 py-1.5">연 1회 이상</td>
                <td className="px-3 py-1.5">규제 환경 변화, 과태료/제재 사례, AML 투자 필요성, 경영진 책임</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">교육 내용 상세</h3>
        <p>
          <strong>1. 특금법 및 가상자산이용자보호법 개요</strong><br />
          VASP의 법적 의무(신고, CDD, STR, 기록 보관), 위반 시 제재(과태료, 형사처벌, 신고 취소),
          최근 법률 개정 사항(Travel Rule 확대, 2단계 입법 동향 등).
        </p>
        <p>
          <strong>2. 의심 징후 식별</strong><br />
          FDS 경보 외에 현업에서 감지해야 할 이상 징후.<br />
          구조화 거래, 빠른 이동, 명의 불일치, 급박한 출금 요구, 거래 목적 미소명 등.<br />
          실제 SAR 사례(익명화 처리)를 교육 자료로 활용하면 효과적.
        </p>
        <p>
          <strong>3. SAR 작성법</strong><br />
          AML 담당자 대상 심화 교육. 의심 사유의 구체적 서술 방법, 증빙 자료 구성,
          FIU가 요구하는 양식과 품질 기준, "방어적 보고" 지양.
        </p>
        <p>
          <strong>4. 최신 세탁 유형</strong><br />
          DeFi를 활용한 세탁, 크로스체인 브릿지 경유, AI 기반 계정 자동 생성, 스테이블코인 악용 등.<br />
          세탁 수법은 지속적으로 진화하므로 교육 내용도 분기별로 갱신해야 한다.
        </p>

        <TrainingCycleViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">교육 기록 보관</h3>
        <p>
          교육 기록은 규제 점검의 핵심 증빙 자료 — "교육을 실시했다"는 것을 입증할 수 있어야 한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">기록 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
                <th className="text-left px-3 py-2 border-b border-border">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">참석자 명단</td>
                <td className="px-3 py-1.5 border-b border-border/30">이름, 부서, 직급. 전자 출석부 또는 서명부</td>
                <td className="px-3 py-1.5 border-b border-border/30">전 직원 교육 이수 여부 확인</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">교육 일시 및 장소</td>
                <td className="px-3 py-1.5 border-b border-border/30">날짜, 시작/종료 시간, 장소(오프라인) 또는 플랫폼(온라인)</td>
                <td className="px-3 py-1.5 border-b border-border/30">교육 주기 준수 확인</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">교육 자료</td>
                <td className="px-3 py-1.5 border-b border-border/30">사용한 교재, 발표자료, 동영상 링크 보관</td>
                <td className="px-3 py-1.5 border-b border-border/30">교육 내용의 실효성 검증</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">평가 결과</td>
                <td className="px-3 py-1.5 border-b border-border/30">교육 후 테스트 점수, 이해도 설문 결과</td>
                <td className="px-3 py-1.5 border-b border-border/30">미달 인원 재교육 여부 확인</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">개선 조치</td>
                <td className="px-3 py-1.5">교육 후 도출된 개선 사항, 후속 조치 이행 여부</td>
                <td className="px-3 py-1.5">교육→개선 연결 고리 입증</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          교육 미이수자에 대한 후속 조치도 기록해야 한다.<br />
          단순히 "OO팀 3명 미참석"으로 끝나면 안 되고, 보충 교육 실시 일정과 이수 확인까지 남겨야 한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 시뮬레이션 훈련의 효과</strong><br />
          연 1~2회 모의 의심거래 시나리오(Tabletop Exercise)를 실시하면 실전 대응 역량이 크게 향상된다.<br />
          시나리오 예: "신규 가입 고객이 3일간 5억 원 입금 후 믹서 연계 주소로 전액 출금 시도"<br />
          각 팀(CS, AML, 보안, 운영, 경영진)이 실제 프로세스대로 대응하고, 소요 시간과 병목을 측정하여 개선.
        </p>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} 기록 보관과 교육은 "비용"이 아니라 "보험"</strong><br />
          과태료 1건이 수십억 원에 달할 수 있는 상황에서, 체계적인 기록 보관과 교육은 가장 비용 효율적인 투자.<br />
          FIU 점검에서 "기록이 있고 교육을 실시했다"는 것만으로도 과태료 감경 사유가 될 수 있다.<br />
          반대로 미비 시에는 핵심 의무 위반으로 건당 과태료가 급증한다.
        </p>

      </div>
    </section>
  );
}
