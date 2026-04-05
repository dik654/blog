export default function RetentionPolicy() {
  return (
    <section id="retention-policy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">보유기간과 분리보관</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">보유기간 산정표</h3>
        <p>
          VASP가 처리하는 주요 개인정보 항목별로 보유기간을 산정한 표.<br />
          각 항목의 보유기간은 "수집 목적 달성 기간"과 "법령 보존 의무 기간" 중 더 긴 기간으로 설정한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">수집 목적</th>
                <th className="text-left px-3 py-2 border-b border-border">보유기간</th>
                <th className="text-left px-3 py-2 border-b border-border">법적 근거</th>
                <th className="text-left px-3 py-2 border-b border-border">파기 시점</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">성명, 생년월일</td>
                <td className="px-3 py-1.5 border-b border-border/30">본인확인(KYC)</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래종료 후 5년</td>
                <td className="px-3 py-1.5 border-b border-border/30">특금법 제5조의4</td>
                <td className="px-3 py-1.5 border-b border-border/30">보존기간 만료 익월</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">신분증 사본</td>
                <td className="px-3 py-1.5 border-b border-border/30">신원 검증</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래종료 후 5년</td>
                <td className="px-3 py-1.5 border-b border-border/30">특금법 제5조의4</td>
                <td className="px-3 py-1.5 border-b border-border/30">보존기간 만료 익월</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">연락처(전화, 이메일)</td>
                <td className="px-3 py-1.5 border-b border-border/30">서비스 안내, 본인인증</td>
                <td className="px-3 py-1.5 border-b border-border/30">회원탈퇴 시 즉시</td>
                <td className="px-3 py-1.5 border-b border-border/30">개인정보보호법 제21조</td>
                <td className="px-3 py-1.5 border-b border-border/30">탈퇴 후 5일 이내</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">은행 계좌번호</td>
                <td className="px-3 py-1.5 border-b border-border/30">원화 입출금</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래종료 후 5년</td>
                <td className="px-3 py-1.5 border-b border-border/30">전자상거래법 제6조</td>
                <td className="px-3 py-1.5 border-b border-border/30">보존기간 만료 익월</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">거래 내역</td>
                <td className="px-3 py-1.5 border-b border-border/30">AML 모니터링</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래종료 후 5년</td>
                <td className="px-3 py-1.5 border-b border-border/30">특금법 제5조의4</td>
                <td className="px-3 py-1.5 border-b border-border/30">보존기간 만료 익월</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">접속 로그(IP, 시각)</td>
                <td className="px-3 py-1.5 border-b border-border/30">보안 감사</td>
                <td className="px-3 py-1.5 border-b border-border/30">2년</td>
                <td className="px-3 py-1.5 border-b border-border/30">안전성 확보조치 기준 제8조</td>
                <td className="px-3 py-1.5 border-b border-border/30">생성 후 2년</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">마케팅 동의 기록</td>
                <td className="px-3 py-1.5">광고 수신 동의 증적</td>
                <td className="px-3 py-1.5">동의 철회 후 5년</td>
                <td className="px-3 py-1.5">개인정보보호법 제39조의7</td>
                <td className="px-3 py-1.5">보존기간 만료 익월</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">목적 달성 후: 지체 없이 파기</h3>
        <p>
          개인정보보호법 제21조 제1항 — "보유기간의 경과, 개인정보의 처리 목적 달성 등 그 개인정보가 불필요하게 되었을 때에는 지체 없이 그 개인정보를 파기하여야 한다."<br />
          여기서 "지체 없이"는 정당한 사유가 없는 한 5일 이내를 의미(개인정보보호법 시행령 제16조).
        </p>
        <p>
          실무에서는 매월 또는 매분기 파기 배치(Batch)를 실행하는 것이 일반적.<br />
          파기 대상을 선정하는 자동화 쿼리를 작성하고, 파기 담당자가 검토 후 실행하는 절차를 수립한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">분리보관 체계</h3>
        <p>
          개인정보보호법 제21조 제1항 단서 — "다른 법령에 따라 보존하여야 하는 경우에는 그러하지 아니하다."<br />
          즉, 수집 목적은 달성되었으나 법령 보존 의무가 남아 있는 경우, 해당 정보를 별도로 분리하여 보관해야 한다.<br />
          분리보관(Segregated Storage)의 목적: 서비스 운영에 사용하지 않으면서도 법적 요구를 충족시키는 것.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">활성 DB</th>
                <th className="text-left px-3 py-2 border-b border-border">분리보관 DB</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">저장 대상</td>
                <td className="px-3 py-1.5 border-b border-border/30">현재 서비스 이용 중인 회원 정보</td>
                <td className="px-3 py-1.5 border-b border-border/30">탈퇴/휴면 회원의 법정 보존 정보</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">접근 권한</td>
                <td className="px-3 py-1.5 border-b border-border/30">서비스 운영팀, 개발팀 등</td>
                <td className="px-3 py-1.5 border-b border-border/30">CPO + 법무팀 등 최소 인원만</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">이용 목적</td>
                <td className="px-3 py-1.5 border-b border-border/30">회원 서비스 제공, 거래 처리</td>
                <td className="px-3 py-1.5 border-b border-border/30">법령 준수, 수사 협조, 분쟁 대응</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">암호화</td>
                <td className="px-3 py-1.5 border-b border-border/30">필수 (주민번호, 계좌번호 등)</td>
                <td className="px-3 py-1.5 border-b border-border/30">전체 항목 암호화 권장</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">접근 로그</td>
                <td className="px-3 py-1.5">일반 접근 로그</td>
                <td className="px-3 py-1.5">접근 시 사유·승인 기록 필수</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          분리보관은 물리적 분리(별도 서버/인스턴스)가 가장 확실하지만, 비용 문제로 논리적 분리(같은 서버 내 별도 스키마/테이블 + 접근 권한 분리)도 허용된다.<br />
          핵심은 "서비스 운영 목적으로 분리보관 데이터에 접근할 수 없어야 한다"는 것.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">분리보관 접근통제</h3>
        <p>
          분리보관 DB에 대한 접근은 엄격히 통제해야 한다:
        </p>
        <ul>
          <li><strong>최소 인원</strong> — CPO, 법무팀, DBA(Database Administrator) 등 업무상 반드시 필요한 인원만 접근 권한 부여</li>
          <li><strong>접근 사유 기록</strong> — 분리보관 DB에 접근할 때마다 접근 사유(수사기관 요청, 분쟁 대응 등)를 기록</li>
          <li><strong>승인 절차</strong> — CPO 또는 CISO의 사전 승인 없이는 접근 불가</li>
          <li><strong>접근 로그</strong> — 접근 일시, 접근자, 접근 항목, 접근 사유를 자동 기록하고 2년 이상 보관</li>
          <li><strong>정기 감사</strong> — 분기 또는 반기 단위로 접근 로그를 검토하여 불필요한 접근이 없었는지 확인</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">회원탈퇴 시 처리 절차</h3>
        <p>
          회원이 탈퇴를 요청하면 즉시 모든 개인정보를 파기하는 것이 아니라, 법정 보존 의무가 있는 항목은 분리보관으로 이동시킨다.
        </p>
        <ol>
          <li><strong>탈퇴 접수</strong> — 이용자의 탈퇴 의사를 확인 (본인인증 후 처리)</li>
          <li><strong>즉시 파기 대상 삭제</strong> — 법정 보존 의무가 없는 항목(프로필 사진, 닉네임, 알림 설정 등)은 5일 이내 파기</li>
          <li><strong>분리보관 이동</strong> — 법정 보존 의무가 있는 항목(KYC 자료, 거래기록 등)은 분리보관 DB로 이동</li>
          <li><strong>활성 DB 삭제</strong> — 분리보관 이동이 완료되면 활성 DB에서 해당 레코드 삭제</li>
          <li><strong>보존 기간 경과 후 파기</strong> — 법정 보존기간이 만료되면 분리보관 DB에서도 파기</li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 mb-3">휴면계정 처리</h3>
        <p>
          정보통신망법 제29조 제2항 — 정보통신서비스 제공자는 이용자가 1년간 서비스를 이용하지 않으면 해당 이용자의 개인정보를 분리보관하거나 파기해야 한다.<br />
          이를 "휴면계정 전환"이라 한다.
        </p>
        <ul>
          <li><strong>사전 통지</strong> — 만료 30일 전까지 이메일·문자로 "1년 미접속 시 휴면 전환" 안내</li>
          <li><strong>분리보관</strong> — 1년 도래 시 활성 DB에서 분리보관 DB로 이동</li>
          <li><strong>재활성화</strong> — 이용자가 다시 로그인하면 본인인증 후 활성 DB로 복원</li>
          <li><strong>파기</strong> — 휴면 상태에서 추가 3년(또는 법정 보존기간)이 경과하면 파기</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} VASP 휴면계정의 특이점</strong><br />
          VASP 이용자가 휴면 상태가 되어도 지갑에 가상자산이 남아 있을 수 있다.<br />
          이 경우 자산 보관 의무와 개인정보 파기 의무가 충돌한다 — 자산 반환을 위해 최소한의 식별정보(지갑주소, 이름)는 유지해야 하기 때문.<br />
          이런 경우 분리보관 + 자산 안내(이메일, 문자)를 병행하여 이용자가 자산을 인출할 기회를 제공해야 한다.
        </p>

      </div>
    </section>
  );
}
