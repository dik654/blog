import TippingOffViz from './viz/TippingOffViz';
import TippingOffRiskViz from './viz/TippingOffRiskViz';
import NeedToKnowViz from './viz/NeedToKnowViz';

export default function TippingOff() {
  return (
    <section id="tipping-off" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tipping-off 금지와 내부 통제</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          SAR을 제출한 사실을 고객이나 제3자에게 알리는 행위를 Tipping-off라 한다.<br />
          Tipping-off는 전 세계 AML 법률에서 공통적으로 금지하는 행위이며,
          한국에서도 형사처벌 대상이다.
        </p>

        <TippingOffViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 금지되는가</h3>
        <p>
          고객이 "나에 대한 의심거래보고가 접수되었다"는 사실을 알게 되면 다음과 같은 행동을 할 수 있다:
        </p>
        <ul>
          <li><strong>증거 인멸</strong> — 관련 거래 기록 삭제, 증거가 될 수 있는 대화 내역 파기</li>
          <li><strong>자산 도피</strong> — 거래소 잔액을 즉시 외부 지갑으로 이전, 프라이버시 코인으로 교환하여 추적 차단</li>
          <li><strong>공범 통보</strong> — 자금세탁 네트워크의 다른 구성원에게 경고하여 전체 수사를 무력화</li>
          <li><strong>도주</strong> — 국외 도피 시도로 법집행의 실효성 상실</li>
        </ul>
        <p>
          즉, Tipping-off 한 번으로 수개월간의 수사와 분석이 무위로 돌아갈 수 있다.<br />
          이 때문에 법률은 보고 사실의 누설을 엄격히 금지한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">법적 근거와 처벌</h3>
        <p>
          특금법 제4조의2(비밀 보장):<br />
          금융회사등과 그 종사자는 STR을 한 사실이나 그 내용을 누구에게도 알려서는 안 된다.<br />
          위반 시 3년 이하의 징역 또는 2천만 원 이하의 벌금(특금법 제17조).
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">Tipping-off 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">구체적 사례</th>
                <th className="text-left px-3 py-2 border-b border-border">위반 여부</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">직접 고지</td>
                <td className="px-3 py-1.5 border-b border-border/30">"고객님 계정에 대해 FIU에 보고했습니다"</td>
                <td className="px-3 py-1.5 border-b border-border/30">명백한 위반 — 형사처벌 대상</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">간접 암시</td>
                <td className="px-3 py-1.5 border-b border-border/30">"AML 관련하여 조치가 취해졌습니다"</td>
                <td className="px-3 py-1.5 border-b border-border/30">위반 — "AML" 언급 자체가 보고 사실을 추론 가능하게 함</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">계정 정지 사유 상세 안내</td>
                <td className="px-3 py-1.5 border-b border-border/30">"자금세탁 의심으로 계정을 정지합니다"</td>
                <td className="px-3 py-1.5 border-b border-border/30">위반 — 의심 사유 자체를 고객에게 알림</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">일반적 안내</td>
                <td className="px-3 py-1.5 border-b border-border/30">"내부 보안 점검으로 계정을 일시 제한합니다"</td>
                <td className="px-3 py-1.5 border-b border-border/30">허용 — SAR 사실을 추론할 수 없는 일반적 표현</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">추가 정보 요청</td>
                <td className="px-3 py-1.5">"거래 확인을 위해 자금 출처 서류를 제출해 주세요"</td>
                <td className="px-3 py-1.5">허용 — CDD/EDD 절차로서 정상적인 요청</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          핵심 원칙: "왜 이 조치가 취해졌는지"를 고객이 추론할 수 없도록 해야 한다.<br />
          계정 정지 사유는 "내부 보안 점검", "정기 확인 절차", "시스템 점검"처럼 일반적이고 모호한 표현을 사용한다.<br />
          "자금세탁", "의심거래", "FIU", "SAR", "STR" 같은 용어는 고객 대면 커뮤니케이션에서 절대 사용하지 않는다.
        </p>

        <TippingOffRiskViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">내부 공유 범위 — Need-to-know 원칙</h3>
        <p>
          SAR 제출 사실은 조직 내부에서도 "알아야 할 사람만" 알 수 있다.<br />
          이를 Need-to-know 원칙이라 하며, 불필요한 인원에게 정보가 확산되면 Tipping-off 위험이 증가한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">역할</th>
                <th className="text-left px-3 py-2 border-b border-border">SAR 사실 인지</th>
                <th className="text-left px-3 py-2 border-b border-border">사유</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">준법감시인</td>
                <td className="px-3 py-1.5 border-b border-border/30">인지 (필수)</td>
                <td className="px-3 py-1.5 border-b border-border/30">최종 승인권자, 법적 보고 책임</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">AML 담당자</td>
                <td className="px-3 py-1.5 border-b border-border/30">인지 (필수)</td>
                <td className="px-3 py-1.5 border-b border-border/30">SAR 작성 및 제출 실무 담당</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">경영진(CEO/CFO)</td>
                <td className="px-3 py-1.5 border-b border-border/30">인지 (필요 시)</td>
                <td className="px-3 py-1.5 border-b border-border/30">중대 사안(대규모 세탁, 수사기관 협조 등) 보고</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">보안팀</td>
                <td className="px-3 py-1.5 border-b border-border/30">온체인 분석 결과만 인지</td>
                <td className="px-3 py-1.5 border-b border-border/30">기술적 분석 지원, SAR 제출 사실은 불필요</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">운영팀/CS팀</td>
                <td className="px-3 py-1.5 border-b border-border/30">미인지</td>
                <td className="px-3 py-1.5 border-b border-border/30">"계정 제한 조치" 사실만 전달받아 고객 안내 실행</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">일반 직원</td>
                <td className="px-3 py-1.5">미인지</td>
                <td className="px-3 py-1.5">업무상 관련 없음, 정보 확산 방지</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          운영팀과 CS팀이 고객에게 안내할 때는 "계정 제한" 사실만 알려주고, 그 이유가 SAR이라는 점은 모른다.<br />
          이렇게 해야 CS 직원이 고객 문의에 응대할 때 실수로 Tipping-off 하는 것을 방지할 수 있다.
        </p>

        <NeedToKnowViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">Safe Harbor — 선의의 보고에 대한 면책</h3>
        <p>
          Safe Harbor(면책 보호)는 선의로 STR/SAR을 제출한 금융회사와 종사자를 보호하는 법적 장치.<br />
          특금법 제4조의3에 따르면, 선의로(악의 없이) 의심거래를 보고한 경우
          그 보고로 인해 발생하는 손해에 대해 민·형사상 책임을 지지 않는다.
        </p>
        <p>
          Safe Harbor가 보호하는 범위:
        </p>
        <ul>
          <li><strong>오보(잘못된 보고)</strong> — 의심이 결과적으로 사실이 아니었더라도, 합리적 근거에 기반한 보고였으면 면책</li>
          <li><strong>고객 손해</strong> — SAR 제출에 따른 계정 정지로 고객에게 손해가 발생해도, 선의의 보고였으면 면책</li>
          <li><strong>영업 비밀</strong> — 보고 과정에서 고객 정보를 FIU에 제공하는 것은 개인정보보호법 위반이 아님(법률에 의한 제공)</li>
        </ul>
        <p>
          Safe Harbor의 한계 — "선의"가 전제.<br />
          고의로 허위 보고를 하거나, 경쟁사를 해하기 위해 보고한 경우는 면책 대상이 아니다.<br />
          또한 보고 의무를 이행하지 않은 것(미보고)에 대해서는 Safe Harbor가 적용되지 않는다.
        </p>

        <p>
          Safe Harbor가 왜 필요한가 — 면책 보호가 없으면 금융회사가 보고를 꺼리게 된다.<br />
          "보고했다가 고객이 소송하면 어떡하나"라는 우려가 STR 의무 이행을 저해할 수 있기 때문.<br />
          Safe Harbor는 "보고하는 것이 보고하지 않는 것보다 안전하다"는 인센티브 구조를 만든다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">내부 통제 체계</h3>
        <p>
          Tipping-off 방지를 위한 내부 통제 체계:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">통제 수단</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
                <th className="text-left px-3 py-2 border-b border-border">목적</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">접근 통제</td>
                <td className="px-3 py-1.5 border-b border-border/30">SAR 시스템/기록에 AML 담당자와 준법감시인만 접근 가능</td>
                <td className="px-3 py-1.5 border-b border-border/30">불필요한 인원의 정보 접근 차단</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">CS 응대 스크립트</td>
                <td className="px-3 py-1.5 border-b border-border/30">계정 제한 안내 시 사용할 표준 문구 사전 마련</td>
                <td className="px-3 py-1.5 border-b border-border/30">CS 직원의 실수로 인한 Tipping-off 방지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">정기 교육</td>
                <td className="px-3 py-1.5 border-b border-border/30">연 1회 전사 교육에 Tipping-off 금지 내용 필수 포함</td>
                <td className="px-3 py-1.5 border-b border-border/30">인식 제고, 위반 시 처벌 경고</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">감사 로그</td>
                <td className="px-3 py-1.5 border-b border-border/30">SAR 관련 시스템 접근 및 조회 기록 전수 보관</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부 정보 유출 사후 추적</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">내부 신고 채널</td>
                <td className="px-3 py-1.5">Tipping-off 의심 행위를 익명으로 신고할 수 있는 채널 운영</td>
                <td className="px-3 py-1.5">내부 자정 기능, 위반 조기 발견</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 실무에서 가장 흔한 Tipping-off 경로</strong><br />
          CS팀이 고객 문의에 응대하면서 "AML 팀에서 확인 중입니다"라고 말하는 것이 가장 빈번한 위반 사례.<br />
          CS 직원은 SAR 사실 자체를 모르더라도, "AML 확인"이라는 표현이 고객에게 보고 사실을 추론하게 한다.<br />
          CS 응대 스크립트의 사전 마련과 교육이 Tipping-off 방지의 첫 번째 방어선.
        </p>

      </div>
    </section>
  );
}
