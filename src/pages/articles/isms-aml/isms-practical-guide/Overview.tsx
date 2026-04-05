import CertProcessViz from './viz/CertProcessViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">VASP ISMS 인증, 실제로 해보니</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          가상자산 거래소(VASP, Virtual Asset Service Provider)에서 ISMS 인증을 직접 준비하고 현장심사를 받은 경험을 정리한 글.<br />
          교과서적인 내용이 아니라, 실제로 결함을 받았던 항목과 그걸 어떻게 고쳤는지를 다룬다.<br />
          "이론상 맞는데 심사에서 떨어진" 사례, "기술적으로 더 좋은데 기준에 안 맞는" 사례가 핵심.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 VASP에 ISMS가 필요한가</h3>
        <p>
          특정금융정보법(특금법) 제7조 — VASP 신고 시 ISMS 인증 의무 명시.<br />
          인증 없이는 신고 수리 자체가 불가하므로, 사실상 영업의 전제조건.<br />
          우리 거래소도 이 의무 때문에 인증 준비를 시작했다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">인증 과정 타임라인</h3>
        <p>
          전체 과정은 대략 6~10개월. 우리 거래소 기준으로 실제 소요 기간을 정리하면:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">단계</th>
                <th className="text-left px-3 py-2 border-b border-border">기간</th>
                <th className="text-left px-3 py-2 border-b border-border">실제로 한 일</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">준비</td>
                <td className="px-3 py-1.5 border-b border-border/30">~3개월</td>
                <td className="px-3 py-1.5 border-b border-border/30">정책 문서 작성, 위험평가, 보호대책 이행, 증적 수집 시작</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">서면심사</td>
                <td className="px-3 py-1.5 border-b border-border/30">2~3주</td>
                <td className="px-3 py-1.5 border-b border-border/30">제출 문서 검토, 누락 항목 보완 요청 대응</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">현장심사</td>
                <td className="px-3 py-1.5 border-b border-border/30">3~5일</td>
                <td className="px-3 py-1.5 border-b border-border/30">심사원이 사무실·서버실 방문, 시스템 직접 확인</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">보완조치</td>
                <td className="px-3 py-1.5 border-b border-border/30">~2개월</td>
                <td className="px-3 py-1.5 border-b border-border/30">결함 항목 수정, 증적 재수집, 보완 내역서 작성</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">인증</td>
                <td className="px-3 py-1.5">-</td>
                <td className="px-3 py-1.5">보완조치 적합 판정 → 인증서 발급</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">현장심사의 현실</h3>
        <p>
          현장심사는 "발표"가 아니다. 심사원이 직접 시스템을 만진다.<br />
          처음에는 정책 문서를 잘 쓰면 될 줄 알았는데, 현장에서 완전히 다른 경험을 했다.
        </p>

        <p>
          심사원이 실제로 한 것들:
        </p>
        <ul>
          <li>서버에 직접 SSH 접속해서 <code>nginx -V</code> 명령어를 치라고 요청 — 버전 정보, 컴파일 옵션 확인</li>
          <li>웹사이트에 직접 접속해서 없는 URL을 쳐봄 — 404 에러 페이지에서 서버 정보가 노출되는지 확인</li>
          <li>DB 접근제어 솔루션에 로그인해서 지난달 로그를 직접 뽑아봄</li>
          <li>관리자 페이지에 접속해서 2차 인증이 실제로 뜨는지 확인</li>
          <li>월렛룸 문 앞에 가서 출입 권한이 누구한테 있는지 명부 확인</li>
          <li>임의 직원을 골라서 "이 사람 계정으로 DB 접속해보라" 요청</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 가장 큰 교훈</strong><br />
          "정책 문서만 있고 증적이 없으면 결함"이다.
          반대로, 못 하고 있더라도 인지하고 있고 개선 계획이 문서화되어 있으면 경결함(경미한 결함)으로 끝날 수 있다.
          ISMS는 기술력 시험이 아니라 문서화와 프로세스의 시험이다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">결함 유형: 중결함 vs 경결함</h3>
        <p>
          현장심사 후 도출되는 결함은 두 가지 유형으로 나뉜다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">유형</th>
                <th className="text-left px-3 py-2 border-b border-border">의미</th>
                <th className="text-left px-3 py-2 border-b border-border">영향</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium text-red-600">중결함</td>
                <td className="px-3 py-1.5 border-b border-border/30">인증 기준을 전혀 이행하지 않았거나 심각하게 부적합</td>
                <td className="px-3 py-1.5 border-b border-border/30">보완 미완료 시 인증 불가</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium text-amber-600">경결함</td>
                <td className="px-3 py-1.5">부분적으로 이행했으나 일부 미흡</td>
                <td className="px-3 py-1.5">보완조치 후 인증 가능</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          우리 거래소는 중결함 없이 경결함 위주로 도출되었는데, 그래도 보완조치에 2개월 가까이 걸렸다.<br />
          중결함이 나오면 보완 범위가 훨씬 커지므로, 준비 단계에서 최대한 잡아야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">이 글에서 다루는 것</h3>
        <p>
          이 아티클은 실제로 결함을 받거나, 심사 과정에서 급히 수정한 항목들을 정리한 것.<br />
          각 섹션에서 BEFORE(원래 상태) → 결함/지적 사항 → AFTER(수정 결과) → 교훈 순서로 설명한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">섹션</th>
                <th className="text-left px-3 py-2 border-b border-border">주요 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">암호화와 인증</td>
                <td className="px-3 py-1.5 border-b border-border/30">bcrypt → SHA-256 사건, 비밀번호 정책, 관리자 2차인증, 중복로그인 차단</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">DB 접근통제</td>
                <td className="px-3 py-1.5 border-b border-border/30">계정 분리, PETRA 도입, 월간 로그 검토, 임시 권한 관리</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">웹 보안</td>
                <td className="px-3 py-1.5 border-b border-border/30">nginx 정보 노출, UUID 전환, 시크릿 관리, 2차 승인</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">월렛 운영과 이상거래</td>
                <td className="px-3 py-1.5 border-b border-border/30">월렛룸 통제, 이상거래 탐지 기준, 회원탈퇴 분리보관</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">증적 자료</td>
                <td className="px-3 py-1.5">IDC 촬영금지 대응, 증적 폴더 관리, 보완조치 프로세스</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          모든 사례는 실제 경험 기반이다. 회사명은 "우리 거래소" 또는 "VASP"로 대체했고, 개인 이름은 사용하지 않았다.<br />
          ISMS 인증을 준비 중인 VASP 실무자에게 "이건 미리 고쳐놓으세요"라고 말해줄 수 있는 글이 되길 바란다.
        </p>

        <CertProcessViz />

      </div>
    </section>
  );
}
