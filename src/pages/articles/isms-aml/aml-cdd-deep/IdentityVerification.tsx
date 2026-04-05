export default function IdentityVerification() {
  return (
    <section id="identity-verification" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">신원확인과 검증 절차</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          CDD의 첫 단계는 고객이 "누구인지" 파악하는 것.<br />
          신원확인(Identification)과 신원검증(Verification)은 서로 다른 단계이며,
          두 단계를 모두 완료해야 적법한 CDD가 성립한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">개인 고객 확인 항목</h3>
        <p>
          특금법 시행령이 정하는 개인 고객의 필수 확인 정보는 다음과 같다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">구체 내용</th>
                <th className="text-left px-3 py-2 border-b border-border">확인 목적</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">실명</td>
                <td className="px-3 py-1.5 border-b border-border/30">한글 성명 + 영문 성명(외국인)</td>
                <td className="px-3 py-1.5 border-b border-border/30">제재 리스트 대조</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">주민등록번호</td>
                <td className="px-3 py-1.5 border-b border-border/30">13자리 (외국인: 외국인등록번호 또는 여권번호)</td>
                <td className="px-3 py-1.5 border-b border-border/30">동명이인 구별, 중복 계정 방지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">주소</td>
                <td className="px-3 py-1.5 border-b border-border/30">실거주지 (등본/우편물 확인 가능 주소)</td>
                <td className="px-3 py-1.5 border-b border-border/30">고위험 지역 거주 여부 판단</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">연락처</td>
                <td className="px-3 py-1.5 border-b border-border/30">휴대전화 번호 (본인 명의 확인)</td>
                <td className="px-3 py-1.5 border-b border-border/30">이상거래 알림, 본인확인 채널</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">직업</td>
                <td className="px-3 py-1.5">업종 + 직위 (자영업자는 업종 상세)</td>
                <td className="px-3 py-1.5">PEP 여부 판단, 자금출처 합리성 검토</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          직업 정보가 왜 CDD에 포함되는가 — 고객의 직업과 소득 수준을 알아야
          거래 규모의 합리성을 판단할 수 있기 때문.<br />
          월 소득 300만 원인 고객이 매월 5억 원을 입금한다면 의심거래 검토 대상이 된다.<br />
          직업은 PEP(정치적 주요인물) 해당 여부 판단의 1차 필터이기도 하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">법인 고객 확인 항목</h3>
        <p>
          법인 고객의 확인 범위는 개인보다 넓다.<br />
          법인 자체의 정보에 더해 실제소유자(Beneficial Owner)까지 확인해야 한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">구체 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">법인명</td>
                <td className="px-3 py-1.5 border-b border-border/30">상호명 + 영문명</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">사업자등록번호</td>
                <td className="px-3 py-1.5 border-b border-border/30">10자리 사업자번호 (법인등록번호 포함)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">본점 소재지</td>
                <td className="px-3 py-1.5 border-b border-border/30">등기부상 본점 주소</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">대표자 정보</td>
                <td className="px-3 py-1.5 border-b border-border/30">대표이사의 성명, 주민등록번호</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">업종</td>
                <td className="px-3 py-1.5 border-b border-border/30">주된 사업 활동 내용</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">실제소유자</td>
                <td className="px-3 py-1.5">25% 이상 지분 보유자 또는 실질적 지배자</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제소유자(Beneficial Owner) 확인</h3>
        <p>
          실제소유자 확인은 CDD에서 가장 까다로운 부분.<br />
          "법인 뒤에 숨은 실제 주인이 누구인가"를 밝히는 절차이며,
          차명 거래(nominee arrangement)를 통한 자금세탁을 방지하는 핵심 장치다.
        </p>

        <p>
          <strong>왜 필요한가</strong> — 자금세탁자는 직접 거래하지 않는다.<br />
          페이퍼컴퍼니(shell company)를 설립하고, 여러 단계의 법인 구조를 만들어
          실제 수익자의 정체를 숨긴다.<br />
          법인명만 확인하면 이 구조를 탐지할 수 없기 때문에
          FATF 권고사항 R.10과 R.24는 실제소유자 확인을 별도로 요구한다.
        </p>

        <p>
          <strong>확인 기준</strong> — 특금법 시행령은 실제소유자를 다음과 같이 정의한다.
        </p>

        <div className="not-prose my-4 p-3 bg-muted/20 rounded border border-border/30 text-sm">
          <p className="mb-1"><strong>1순위:</strong> 법인의 의결권 있는 주식 25% 이상을 직접 또는 간접 보유한 자연인</p>
          <p className="mb-1"><strong>2순위:</strong> 1순위에 해당하는 자가 없으면, 법인을 실질적으로 지배·통제하는 자연인</p>
          <p><strong>3순위:</strong> 1·2순위 모두 해당 없으면, 대표이사 또는 업무 집행 사원</p>
        </div>

        <p>
          "간접 보유"란 자회사, 손자회사 등 다단계 구조를 통한 지분 보유를 포함한다는 뜻.<br />
          A법인이 B법인 지분 100%를 보유하고, B법인이 C법인 지분 30%를 보유하면
          A법인의 실제소유자는 C법인에 대해서도 간접 30% 지분을 갖는 것으로 판단한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">신원검증 방법</h3>
        <p>
          정보를 수집했으면 그 정보가 진짜인지 독립적 출처를 통해 검증해야 한다.<br />
          VASP에서 사용하는 주요 검증 방법은 다음과 같다.
        </p>

        <p>
          <strong>대면 검증</strong><br />
          고객이 오프라인 창구를 방문해 신분증 원본을 제시하고, 직원이 육안으로 확인.<br />
          가장 전통적인 방법이지만, VASP는 대부분 온라인 서비스이므로 실무적으로 비대면이 주류.
        </p>

        <p>
          <strong>비대면 검증 (eKYC)</strong><br />
          eKYC(electronic Know Your Customer)는 온라인에서 본인확인을 수행하는 기술.<br />
          일반적인 흐름: 신분증 촬영 → OCR로 정보 추출 → 안면인식(신분증 사진 vs 실시간 셀피 비교) → 활성도 검사(liveness check).<br />
          활성도 검사는 사진이 아닌 실제 사람인지 확인하는 과정으로,
          고개 돌리기, 눈 깜빡이기 같은 동작을 요청하여 딥페이크를 차단한다.
        </p>

        <p>
          <strong>영상통화 검증</strong><br />
          비대면이지만 실시간으로 직원이 고객의 얼굴과 신분증을 화면으로 확인하는 방식.<br />
          eKYC 자동화가 어려운 외국인 고객이나, 기술적 한계로 자동 검증이 실패한 경우에 사용.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실명확인 입출금 계정</h3>
        <p>
          특금법은 VASP가 고객의 원화(KRW) 입출금에 "실명확인 입출금 계정"을 사용하도록 요구한다.<br />
          이 계정은 은행이 실명을 확인한 계좌와 VASP의 가상계좌를 1:1로 연동한 것.
        </p>

        <p>
          고객이 거래소에 원화를 입금하려면 본인 명의의 은행 계좌에서만 가능하고,
          출금도 동일한 은행 계좌로만 이루어진다.<br />
          은행이 1차 실명확인을 수행하므로, VASP의 CDD에 은행의 KYC가 추가 레이어로 결합되는 구조.
        </p>

        <p>
          이 요건 때문에 한국의 VASP는 은행과의 제휴(실명 계좌 발급 계약)가 영업의 전제 조건이 된다.<br />
          은행은 VASP의 AML 체계를 평가한 뒤 계약 여부를 결정하며,
          체계가 미흡하면 계좌 발급을 거부할 수 있다.
        </p>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} 실명 계좌의 이중 효과</strong><br />
          실명확인 입출금 계정은 자금세탁 방지뿐 아니라 이용자 자산 보호에도 기여한다.<br />
          고객 예치금이 VASP의 고유 재산과 분리되어 은행에 보관되므로,
          VASP가 파산하더라도 고객 원화 자산은 보전될 수 있다.<br />
          이 구조는 가상자산이용자보호법 제6조(이용자 자산의 구분 관리)와도 연계된다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 외국인 고객의 특수성</strong><br />
          외국인 고객의 경우 주민등록번호가 없으므로 여권번호 또는 외국인등록번호로 대체한다.<br />
          검증 시에는 여권의 MRZ(Machine Readable Zone) 판독, 체류 자격 확인이 추가된다.<br />
          FATF 고위험 국가 국적인 경우 자동으로 EDD 대상으로 분류되며,
          이 경우 자금 출처 소명과 경영진 승인이 필수다.
        </p>

      </div>
    </section>
  );
}
