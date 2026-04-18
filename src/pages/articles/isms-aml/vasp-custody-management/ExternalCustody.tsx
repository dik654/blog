import ExternalCustodyViz from './viz/ExternalCustodyViz';
import CustodyConditionsViz from './viz/CustodyConditionsViz';
import EmergencyHaltViz from './viz/EmergencyHaltViz';

export default function ExternalCustody() {
  return (
    <section id="external-custody" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">외부 수탁과 취약점 점검</h2>
      <ExternalCustodyViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-4">외부 수탁이란</h3>
        <p className="leading-7">
          VASP가 이용자 자산을 직접 보관하지 않고, 전문 수탁기관(Custodian)에 위탁하는 방식을 외부 수탁이라 한다.
          <br />
          수탁기관은 가상자산의 개인키 관리, 트랜잭션 서명, 물리적 보안을 전담하는 사업자다.
          <br />
          VASP 입장에서는 자체 콜드월렛 인프라 구축·운영 부담을 줄일 수 있고,
          수탁기관 입장에서는 보안 전문성을 여러 VASP에 제공하여 규모의 경제를 달성할 수 있다.
        </p>

        <p className="leading-7">
          국내에서는 2025년 12월 기준 보관·지갑 사업자로 신고 수리된 기관이 존재하며,
          총 수탁고는 시장 상황에 따라 변동이 크다.
          <br />
          외부 수탁을 활용하더라도, 이용자 자산 보관에 대한 최종 책임은 위탁한 VASP에게 있다.
          수탁기관의 과실로 자산 손실이 발생해도, 이용자에 대한 손해배상 의무는 원래 VASP가 부담한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">외부 수탁 가능 조건</h3>
        <p className="leading-7">
          가상자산이용자보호법과 감독 지침은 외부 수탁 시 충족해야 할 세 가지 핵심 조건을 정한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">조건</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
                <th className="text-left px-3 py-2 border-b border-border">위반 시 위험</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">사고예방 체계</td>
                <td className="px-3 py-1.5 border-b border-border/30">해킹·내부자 위협·물리적 침입에 대한 예방 시스템 구비</td>
                <td className="px-3 py-1.5 border-b border-border/30">보안 사고 시 수탁기관과 VASP 모두 책임</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">이해상충 방지</td>
                <td className="px-3 py-1.5 border-b border-border/30">수탁 자산을 자기 이익을 위해 사용하지 않을 것</td>
                <td className="px-3 py-1.5 border-b border-border/30">자산 유용, 횡령 위험</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">재위탁 금지</td>
                <td className="px-3 py-1.5">수탁기관이 다시 제3자에게 보관을 위탁할 수 없음</td>
                <td className="px-3 py-1.5">책임 소재 불명확, 통제력 상실</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          특히 재위탁 금지는 가상자산 수탁의 핵심 원칙이다.
          <br />
          {'수탁 체인이 A사 -> B사 -> C사로 길어지면, 각 단계에서 보안 표준이 상이하고 사고 시 책임 추적이 어려워진다.'}
          <br />
          전통 금융에서도 수탁업무의 재위탁은 엄격히 제한되는데, 블록체인 자산은 한 번 유출되면 복구가 불가능하므로 더 엄격하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">수탁기관 선정 기준</h3>
        <p className="leading-7">
          VASP가 수탁기관을 선정할 때 확인해야 할 사항은 다음과 같다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">세부 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">보안 인증</td>
                <td className="px-3 py-1.5 border-b border-border/30">ISMS 인증, SOC 2 Type II, ISO 27001 등 국제 보안 인증 보유 여부</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">보험 가입</td>
                <td className="px-3 py-1.5 border-b border-border/30">해킹·내부 범죄에 대한 배상보험 가입 및 보상 한도</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">업무지침 공시</td>
                <td className="px-3 py-1.5 border-b border-border/30">키 관리 절차, 접근 통제 정책, 사고 대응 계획 등을 문서화하여 공시</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">재무 건전성</td>
                <td className="px-3 py-1.5 border-b border-border/30">자본금, 영업 이력, 감사 보고서를 통한 재무 안정성 확인</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">FIU 신고 여부</td>
                <td className="px-3 py-1.5">금융정보분석원에 가상자산사업자로 신고 수리되었는지 확인</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          SOC 2 Type II는 미국공인회계사협회(AICPA)가 정한 서비스 조직 통제 보고서로,
          보안·가용성·처리무결성·기밀성·프라이버시 다섯 가지 원칙에 대해 일정 기간(보통 6~12개월) 동안의 통제 실효성을 감사한 결과다.
          <br />
          Type I은 특정 시점의 설계 적정성만 평가하지만, Type II는 기간 동안 실제로 작동했는지를 검증하므로 더 신뢰도가 높다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">정기 점검: 분기별 위탁관리 내역 확인</h3>
        <p className="leading-7">
          수탁기관을 선정하면 끝이 아니다.
          <br />
          VASP는 분기별로 수탁기관의 위탁관리 내역을 확인해야 한다.
          <br />
          확인 항목은 다음을 포함한다.
        </p>

        <p className="leading-7">
          <strong>잔고 대조</strong> -- 이용자 자산 총량과 수탁기관 보관 잔고의 일치 여부를 검증한다.
          온체인 잔고와 수탁기관 장부, VASP 내부 장부의 3자 대조가 기본이다.
          <br />
          <strong>접근 로그 검토</strong> -- 수탁기관의 키 접근 로그, 서명 이력, 관리자 변경 이력을 요청하여 검토한다.
          비인가 접근이나 이상 패턴이 발견되면 즉시 원인 조사에 착수한다.
          <br />
          <strong>보안 인증 갱신 여부</strong> -- 수탁기관의 ISMS, SOC 2 등 인증이 만료되지 않았는지 확인한다.
          인증 만료 시 수탁 계약을 재검토하거나 대체 기관을 준비한다.
          <br />
          <strong>SLA 이행 여부</strong> -- 서비스 수준 협약(SLA, Service Level Agreement)에서 정한 가용성, 응답 시간, 장애 복구 시간을 실제로 충족했는지 점검한다.
        </p>

        <div className="not-prose my-6">
          <CustodyConditionsViz />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">취약점 분석 평가</h3>
        <p className="leading-7">
          가상자산이용자보호법은 VASP에 연 1회 이상 취약점 분석·평가를 의무화한다.
          <br />
          평가는 금융위원회 고시로 지정된 전문기관이 수행한다.
          <br />
          평가 대상은 VASP의 전체 인프라를 포함하며, 외부 수탁기관과의 연동 구간도 범위에 들어간다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">평가 영역</th>
                <th className="text-left px-3 py-2 border-b border-border">점검 항목</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">네트워크</td>
                <td className="px-3 py-1.5 border-b border-border/30">방화벽 설정, DMZ 구성, 내부망 분리, VPN 설정</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">애플리케이션</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 시스템, 지갑 관리 시스템, API 보안</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">키 관리</td>
                <td className="px-3 py-1.5 border-b border-border/30">HSM 설정, 다중서명 구성, 키 백업·복구 절차</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">물리 보안</td>
                <td className="px-3 py-1.5 border-b border-border/30">서버실 출입 통제, 콜드월렛 보관소, CCTV</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">인적 보안</td>
                <td className="px-3 py-1.5">직원 접근 권한, 보안 교육 이수, 퇴직자 계정 관리</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          평가 후 30일 이내에 결과보고서와 보완계획서를 금융감독원에 제출해야 한다.
          <br />
          결과보고서에는 발견된 취약점의 위험 등급(상/중/하), 영향 범위, 재현 가능성이 포함된다.
          <br />
          보완계획서에는 취약점별 조치 내용, 담당자, 완료 예정일을 명시한다.
          <br />
          금융감독원은 보완 조치 이행 여부를 추적 점검할 수 있으며,
          중대한 취약점이 방치될 경우 시정 명령이나 과태료를 부과할 수 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">비상 상황 대응: 긴급 전송 중지</h3>
        <p className="leading-7">
          해킹이 감지되거나 개인키 유출이 의심되면, 가장 먼저 해야 할 일은 모든 지갑 전송을 즉시 중지하는 것이다.
          <br />
          이를 "긴급 전송 중지(Emergency Transfer Halt)"라 하며, 다음 순서로 진행된다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">순서</th>
                <th className="text-left px-3 py-2 border-b border-border">조치</th>
                <th className="text-left px-3 py-2 border-b border-border">담당</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1</td>
                <td className="px-3 py-1.5 border-b border-border/30">전 지갑 입출금 API 비활성화(Kill Switch 발동)</td>
                <td className="px-3 py-1.5 border-b border-border/30">보안팀 / 인프라팀</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2</td>
                <td className="px-3 py-1.5 border-b border-border/30">침해 범위 파악: 어떤 지갑, 어떤 키가 영향받았는지 분석</td>
                <td className="px-3 py-1.5 border-b border-border/30">보안팀 / CISO</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3</td>
                <td className="px-3 py-1.5 border-b border-border/30">감독기관(금융감독원) 및 수사기관 신고</td>
                <td className="px-3 py-1.5 border-b border-border/30">법무팀 / CCO</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">4</td>
                <td className="px-3 py-1.5 border-b border-border/30">이용자 공지: 서비스 중단 사유와 예상 복구 시점 안내</td>
                <td className="px-3 py-1.5 border-b border-border/30">CS팀 / 경영진</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">5</td>
                <td className="px-3 py-1.5 border-b border-border/30">미침해 자산을 새 콜드월렛으로 긴급 이전</td>
                <td className="px-3 py-1.5 border-b border-border/30">키 관리자 / 보안팀</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">6</td>
                <td className="px-3 py-1.5">원인 분석 완료 후 단계적 서비스 재개</td>
                <td className="px-3 py-1.5">경영진 / CISO / CCO 합의</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          외부 수탁기관을 이용하는 경우에도 동일한 프로토콜이 적용된다.
          <br />
          수탁기관과의 계약에 "긴급 전송 중지 요청권"과 "응답 시간 SLA"를 반드시 포함해야 한다.
          <br />
          수탁기관이 즉시 대응하지 못하면 피해가 확대되므로, 응답 시간은 15분 이내로 설정하는 것이 통상적이다.
        </p>

        <div className="not-prose my-6">
          <EmergencyHaltViz />
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 수탁 vs 자체 보관의 판단 기준</strong><br />
          자체 보관은 통제력이 높지만 보안 인프라 구축·유지 비용이 크다.
          <br />
          외부 수탁은 비용을 줄일 수 있지만, 수탁기관에 대한 의존도가 높아진다.
          <br />
          대규모 거래소는 자체 보관 비중이 높고, 중소 규모 사업자는 외부 수탁을 활용하는 경향이 있다.
          <br />
          어떤 방식을 선택하든 법적 보관 의무(분리 보관, 80% 콜드, 이용자명부)는 동일하게 적용된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">감독 체계: 금융감독원의 역할</h3>
        <p className="leading-7">
          가상자산이용자보호법상 검사 업무는 금융감독원이 집행한다.
          <br />
          금융감독원은 VASP에 대해 정기 검사(반기별 실태조사)와 수시 검사(사고 발생 시, 제보 접수 시)를 수행한다.
          <br />
          검사 시 VASP는 관련 자료를 지체 없이 제출해야 하며, 관계자 출석과 진술 협조 의무가 있다.
          자료 제출을 거부하거나 허위 자료를 제출하면 과태료 또는 형사처벌 대상이 된다.
        </p>

        <p className="leading-7">
          검사 결과 법규 위반이 확인되면, 금융위원회는 시정 명령, 업무 정지, 등록 취소 등의 조치를 취할 수 있다.
          <br />
          중대한 위반(이용자 자산 유용, 콜드월렛 비율 지속 미달 등)은 형사 고발로 이어질 수 있다.
          <br />
          이러한 감독 체계가 있기 때문에, 보관 의무는 단순한 권고가 아니라 이행하지 않으면 사업 존속 자체가 위협받는 강제 규범이다.
        </p>

      </div>
    </section>
  );
}
