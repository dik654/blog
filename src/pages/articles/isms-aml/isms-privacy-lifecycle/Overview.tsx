export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개인정보 생명주기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">수집에서 파기까지: 4단계</h3>
        <p>
          개인정보는 수집 → 이용 → 보관 → 파기의 생명주기(Lifecycle)를 거친다.<br />
          개인정보보호법은 각 단계마다 별도의 의무를 부과하며, ISMS-P 인증 기준 3.x 영역이 이 생명주기 전체를 관리한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">단계</th>
                <th className="text-left px-3 py-2 border-b border-border">핵심 의무</th>
                <th className="text-left px-3 py-2 border-b border-border">관련 법조문</th>
                <th className="text-left px-3 py-2 border-b border-border">ISMS-P 항목</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">수집</td>
                <td className="px-3 py-1.5 border-b border-border/30">동의 획득, 최소 수집, 목적 명시</td>
                <td className="px-3 py-1.5 border-b border-border/30">제15조, 제16조, 제22조</td>
                <td className="px-3 py-1.5 border-b border-border/30">3.1</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">이용</td>
                <td className="px-3 py-1.5 border-b border-border/30">목적 범위 내 이용, 제3자 제공 동의</td>
                <td className="px-3 py-1.5 border-b border-border/30">제17조, 제18조</td>
                <td className="px-3 py-1.5 border-b border-border/30">3.2</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">보관</td>
                <td className="px-3 py-1.5 border-b border-border/30">안전성 확보조치, 분리보관, 접근통제</td>
                <td className="px-3 py-1.5 border-b border-border/30">제29조, 제21조 제1항 단서</td>
                <td className="px-3 py-1.5 border-b border-border/30">3.3</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">파기</td>
                <td className="px-3 py-1.5">복구 불가 파기, 파기 기록 보관</td>
                <td className="px-3 py-1.5">제21조</td>
                <td className="px-3 py-1.5">3.3</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          이 글에서는 "보관"과 "파기" 단계에 집중한다 — 수집과 이용은 처리방침·동의 체계에서 다루었으므로,
          여기서는 "수집한 개인정보를 얼마나, 어떻게 보관하고, 언제, 어떤 방법으로 파기하는가"를 상세히 분석한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">보유기간 산정의 원칙</h3>
        <p>
          개인정보보호법 제21조 제1항 — "개인정보처리자는 보유기간의 경과, 개인정보의 처리 목적 달성 등 그 개인정보가 불필요하게 되었을 때에는 지체 없이 그 개인정보를 파기하여야 한다."<br />
          핵심 원칙은 "목적 달성 시 즉시 파기". 보유기간은 수집 목적을 달성하는 데 필요한 최소 기간으로 설정해야 한다.
        </p>
        <p>
          그러나 법령이 별도 보존 의무를 부과하는 경우가 있다. 이때는 해당 법령이 정한 기간까지 보관한 후 파기한다.<br />
          "보유기간 = max(수집 목적 달성 기간, 법령 보존 의무 기간)"으로 산정.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">법령에 따른 보존 의무</h3>
        <p>
          다양한 법령이 개인정보의 보존 기간을 정하고 있다. VASP에 적용되는 주요 보존 의무:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">보존 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">보존 기간</th>
                <th className="text-left px-3 py-2 border-b border-border">법적 근거</th>
                <th className="text-left px-3 py-2 border-b border-border">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">고객확인(CDD) 자료</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래종료 후 5년</td>
                <td className="px-3 py-1.5 border-b border-border/30">특정금융정보법 제5조의4</td>
                <td className="px-3 py-1.5 border-b border-border/30">신분증 사본, 실명확인 기록 포함</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">거래기록</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래종료 후 5년</td>
                <td className="px-3 py-1.5 border-b border-border/30">특정금융정보법 제5조의4</td>
                <td className="px-3 py-1.5 border-b border-border/30">가상자산 이전 기록, 원화 입출금 기록</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">계약·청약철회 기록</td>
                <td className="px-3 py-1.5 border-b border-border/30">5년</td>
                <td className="px-3 py-1.5 border-b border-border/30">전자상거래법 제6조</td>
                <td className="px-3 py-1.5 border-b border-border/30">이용약관 동의, 서비스 가입 기록</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">대금결제·공급 기록</td>
                <td className="px-3 py-1.5 border-b border-border/30">5년</td>
                <td className="px-3 py-1.5 border-b border-border/30">전자상거래법 제6조</td>
                <td className="px-3 py-1.5 border-b border-border/30">결제 수단, 금액, 일시</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">소비자 불만·분쟁처리 기록</td>
                <td className="px-3 py-1.5 border-b border-border/30">3년</td>
                <td className="px-3 py-1.5 border-b border-border/30">전자상거래법 제6조</td>
                <td className="px-3 py-1.5 border-b border-border/30">민원, 분쟁조정 기록</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">통신사실 확인자료</td>
                <td className="px-3 py-1.5 border-b border-border/30">3개월 (인터넷 로그 12개월)</td>
                <td className="px-3 py-1.5 border-b border-border/30">통신비밀보호법 제15조의2</td>
                <td className="px-3 py-1.5 border-b border-border/30">접속 IP, 접속 일시</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">접속기록(로그)</td>
                <td className="px-3 py-1.5">2년</td>
                <td className="px-3 py-1.5">개인정보의 안전성 확보조치 기준 제8조</td>
                <td className="px-3 py-1.5">개인정보처리시스템 접속 로그</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} VASP의 5년 보존 의무</strong><br />
          VASP는 특정금융정보법(특금법)에 따라 고객확인 자료와 거래기록을 "거래관계 종료 후 5년"간 보존해야 한다.<br />
          여기서 "거래관계 종료"는 회원탈퇴 시점이 아니라 "마지막 거래가 발생한 시점"으로 해석하는 것이 일반적.<br />
          탈퇴 후에도 5년간 개인정보를 보관해야 하므로, 분리보관(별도 DB 격리)이 필수적으로 동반된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">보유 vs 보존: 용어 구분</h3>
        <p>
          실무에서 혼동되기 쉬운 용어를 정리:
        </p>
        <ul>
          <li><strong>보유</strong> — 수집 목적 달성을 위해 개인정보를 유지하는 상태. 이용자 서비스 이용 중에 해당</li>
          <li><strong>보존</strong> — 수집 목적은 달성되었으나, 법령에 따라 일정 기간 더 유지하는 상태. 분리보관 대상</li>
          <li><strong>파기</strong> — 보존 기간마저 만료되어 복구 불가능하게 삭제하는 행위</li>
        </ul>
        <p>
          보유 → (목적 달성) → 보존(분리보관) → (법정 기간 만료) → 파기. 이 흐름이 개인정보 생명주기의 후반부를 구성한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">ISMS-P 심사에서 확인하는 포인트</h3>
        <p>
          ISMS-P 인증 기준 3.3(개인정보 보관 및 파기)에서 심사원이 확인하는 주요 항목:
        </p>
        <ul>
          <li><strong>보유기간 산정 근거</strong> — 각 개인정보 항목별로 보유기간과 그 법적 근거가 문서화되어 있는가</li>
          <li><strong>분리보관 체계</strong> — 법정 보존 의무가 있는 정보를 별도 DB 또는 테이블에 분리하고 있는가</li>
          <li><strong>파기 절차 문서화</strong> — 파기 방법, 파기 주기, 파기 담당자가 내부 규정에 명시되어 있는가</li>
          <li><strong>파기 증적</strong> — 실제 파기가 이루어졌음을 증명하는 파기 대장, 파기 확인서가 존재하는가</li>
          <li><strong>휴면계정 처리</strong> — 1년 미접속 계정의 개인정보를 분리보관하고 있는가</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 블록체인 데이터의 특수성</strong><br />
          블록체인에 기록된 트랜잭션 데이터는 기술적으로 삭제가 불가능하다 — 블록체인의 불변성(Immutability)은 핵심 설계 원칙이기 때문.<br />
          따라서 개인정보(성명, 계좌번호 등)를 온체인(On-chain)에 직접 저장하면 파기 의무를 이행할 수 없다.<br />
          개인정보는 반드시 오프체인(Off-chain, 블록체인 외부) DB에 저장하고, 온체인에는 해시값 또는 식별 불가능한 지갑주소만 기록해야 한다.
        </p>

      </div>
    </section>
  );
}
