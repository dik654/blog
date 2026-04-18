import CddProcessViz from './viz/CddProcessViz';
import CddComponentsViz from './viz/CddComponentsViz';
import EddTargetsViz from './viz/EddTargetsViz';

export default function CddProcess() {
  return (
    <section id="cdd-process" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">고객확인제도 (CDD/EDD)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <CddProcessViz />

        <p>
          CDD(Customer Due Diligence)는 "이 사람이 누구인지 확인하고, 어떤 위험을 가져오는지 평가하는" 절차.<br />
          금융 시스템에 진입하는 모든 고객의 신원을 확인하지 않으면, 범죄자가 가명으로 계정을 만들어
          자금세탁 통로로 활용할 수 있다.<br />
          CDD는 이 진입 지점을 통제하는 첫 번째 방어선.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CDD의 세 가지 구성 요소</h3>

        <p>
          <strong>1. 신원확인 (Identification)</strong><br />
          고객이 "나는 홍길동이다"라고 주장하는 정보를 수집하는 단계.<br />
          개인: 실명, 생년월일, 주소, 연락처, 국적.<br />
          법인: 법인명, 사업자등록번호, 본점 소재지, 업종, 설립일.<br />
          이 단계에서는 정보를 수집만 하고, 진위 여부는 다음 단계에서 검증한다.
        </p>

        <p>
          <strong>2. 신원검증 (Verification)</strong><br />
          수집한 정보가 사실인지 독립적인 출처로 대조하는 단계.<br />
          개인: 신분증(주민등록증, 운전면허증, 여권) 사본 또는 촬영본을 신원확인 정보와 대조.<br />
          요즘은 eKYC(electronic KYC) — 신분증 OCR 인식 + 안면인식(liveness check) + 계좌 1원 인증을 조합하는 방식이 일반적.<br />
          법인: 사업자등록증, 법인등기부등본으로 대조.
        </p>

        <p>
          <strong>3. 실제소유자 확인 (Beneficial Owner)</strong><br />
          법인 고객의 경우, 법인 뒤에 숨은 "진짜 주인"이 누구인지 확인해야 한다.<br />
          기준: 직접·간접적으로 지분 25% 이상을 보유한 자연인.<br />
          25% 이상 보유자가 없으면 최고경영자(CEO)를 실제소유자로 간주.<br />
          다단계 지배구조(모회사→자회사→손자회사)의 경우 최상위 자연인까지 추적해야 한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 왜 25%인가</strong><br />
          FATF가 "실질적 지배력(effective control)"의 기준으로 25%를 권고하기 때문.<br />
          한국 특금법도 이 기준을 따른다. 일부 국가(EU)는 더 낮은 기준(10%)을 적용하기도 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CDD 이행 시기</h3>
        <p>
          CDD는 "한 번 하고 끝"이 아니라, 특정 조건이 충족될 때마다 수행한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">시기</th>
                <th className="text-left px-3 py-2 border-b border-border">구체적 상황</th>
                <th className="text-left px-3 py-2 border-b border-border">이유</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">계정 개설</td>
                <td className="px-3 py-1.5 border-b border-border/30">회원가입 + 실명인증 시점</td>
                <td className="px-3 py-1.5 border-b border-border/30">진입 통제 — 익명 계정 차단</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">일정 금액 이상 거래</td>
                <td className="px-3 py-1.5 border-b border-border/30">1회 또는 누적 기준 초과 시</td>
                <td className="px-3 py-1.5 border-b border-border/30">고액 거래 = 세탁 위험 상승</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">자금세탁 의심</td>
                <td className="px-3 py-1.5 border-b border-border/30">FDS 탐지 또는 수동 모니터링에서 이상 감지</td>
                <td className="px-3 py-1.5 border-b border-border/30">의심 시점에 재확인 필수</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">기존 정보 의심</td>
                <td className="px-3 py-1.5">신분증 만료, 연락처 변경, 주소 불일치 발견</td>
                <td className="px-3 py-1.5">정보 신뢰도 하락 → 재검증</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CddComponentsViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">CDD 미이행 시 조치</h3>
        <p>
          CDD를 완료하지 못하면 시스템이 자동으로 해당 계정을 "제한 상태"로 전환한다.<br />
          제한 상태에서는 다음이 불가:
        </p>
        <ul>
          <li>신규 계정 개설 불가 — 실명인증 완료 전까지 가입 절차 중단</li>
          <li>입출금 및 거래 불가 — 기존 고객이라도 재확인 미완료 시 거래 정지</li>
          <li>거래 관계 종료 — 합리적 기간 내 미이행 시 계정 해지 가능</li>
        </ul>
        <p>
          이 조치가 엄격한 이유 — CDD 없이 거래를 허용하면 VASP 자체가 법적 제재를 받는다.<br />
          FIU 검사에서 CDD 미이행이 적발되면 과태료, 시정명령, 심하면 신고 말소까지 가능.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">EDD — 강화된 고객확인</h3>
        <p>
          EDD(Enhanced Due Diligence)는 고위험 고객에게 적용하는 추가 확인 절차.<br />
          일반 CDD로는 위험을 충분히 통제할 수 없는 경우에 발동된다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">EDD 대상</th>
                <th className="text-left px-3 py-2 border-b border-border">추가 확인 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">이유</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">PEP(정치적 주요 인물)</td>
                <td className="px-3 py-1.5 border-b border-border/30">자금 출처, 재산 형성 과정, 거래 목적</td>
                <td className="px-3 py-1.5 border-b border-border/30">공적 지위를 이용한 부패·뇌물 세탁 위험</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">고위험국 거주자</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 목적, 자금 출처, 지속 모니터링 강화</td>
                <td className="px-3 py-1.5 border-b border-border/30">FATF 비협조국(이란, 북한 등) 연계 위험</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">복잡한 법인 구조</td>
                <td className="px-3 py-1.5 border-b border-border/30">전체 지배구조도, 최종 수익자 추적</td>
                <td className="px-3 py-1.5 border-b border-border/30">다단계 법인으로 실소유자 은닉 가능</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">비대면 거래</td>
                <td className="px-3 py-1.5">추가 신원 검증(영상통화, 추가 서류)</td>
                <td className="px-3 py-1.5">대면 확인 불가에 따른 사칭 위험</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          PEP(Politically Exposed Person)란 국가 원수, 고위 공무원, 군 장성, 사법부 고위직, 공기업 임원 등
          공적 영향력을 가진 인물과 그 가족·측근을 포함한다.<br />
          PEP 자체가 범죄자는 아니지만, 직위를 이용한 부패 자금을 세탁할 가능성이 통계적으로 높기 때문에
          모든 AML 프레임워크에서 고위험으로 분류한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">간소화 CDD (Simplified Due Diligence)</h3>
        <p>
          위험기반 접근법(RBA)에 따라 저위험으로 평가된 고객에게는 CDD 절차를 간소화할 수 있다.<br />
          예: 소액 거래만 하는 개인, 규제를 이미 받는 금융기관 간 거래.<br />
          다만 간소화 CDD를 적용하더라도 최소한의 신원확인은 반드시 수행해야 하며,
          위험도가 변경되면 즉시 일반 CDD 또는 EDD로 전환해야 한다.
        </p>

        <EddTargetsViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">고객수용정책 (Customer Acceptance Policy)</h3>
        <p>
          CDD 결과에 따라 고객을 수용할지, 거절할지 결정하는 기준.<br />
          모든 VASP는 문서화된 고객수용정책을 보유해야 한다.
        </p>

        <p>
          <strong>거래 거절 사유</strong><br />
          - 실명 확인 불가(위조 신분증, 정보 불일치)<br />
          - 제재 대상(UN/OFAC/EU 제재 리스트 등재)<br />
          - 자금 출처 미소명(EDD 대상인데 자금 출처를 입증하지 못하는 경우)<br />
          - 대리 거래 의심(타인 명의 사용 의심)
        </p>

        <p>
          <strong>거래 종료 사유</strong><br />
          - 지속적 CDD 갱신 거부<br />
          - 반복적 의심 거래 발생<br />
          - 제재 리스트 신규 등재<br />
          거래 종료 시에도 STR 보고 필요 여부를 검토해야 하며, 기록은 5년간 보관한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">자산 분리 의무</h3>
        <p>
          가상자산이용자보호법에 따라 VASP는 고객 자산과 고유 재산을 분리 관리해야 한다.<br />
          이 의무는 CDD와 직결 — 고객별 거래 내역을 정확히 분리하려면 신원이 확인된 계정 단위로 관리해야 하기 때문.
        </p>
        <ul>
          <li><strong>예치금 분리</strong> — 고객이 맡긴 원화는 은행 별도 계좌(신탁 또는 예치)에 보관. VASP 운영 자금과 혼합 금지.</li>
          <li><strong>가상자산 분리</strong> — 고객 가상자산은 VASP 고유 자산과 별도 지갑(주소)으로 관리. 혼합 시 회계 추적 불가.</li>
          <li><strong>거래내역 분리</strong> — 고객별 입출금, 매수/매도, 이체 내역을 개별 추적 가능한 형태로 기록·보관.</li>
        </ul>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} 자산 분리가 실패하면</strong><br />
          VASP가 파산했을 때 고객 자산이 채권자에게 넘어갈 수 있다.<br />
          분리가 제대로 되어 있으면 고객 자산은 파산 재단에 포함되지 않아 보호받는다 — 이것이 분리 의무의 본질적 이유.
        </p>

      </div>
    </section>
  );
}
