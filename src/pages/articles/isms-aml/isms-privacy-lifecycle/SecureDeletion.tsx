import SecureDeletionViz from './viz/SecureDeletionViz';
import OverwriteStandardsInlineViz from './viz/OverwriteStandardsInlineViz';
import BlockchainDeletionInlineViz from './viz/BlockchainDeletionInlineViz';

export default function SecureDeletion() {
  return (
    <section id="secure-deletion" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">안전한 파기 방법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SecureDeletionViz />

        <h3 className="text-xl font-semibold mt-2 mb-3">파기의 원칙: 복구 불가능</h3>
        <p>
          개인정보보호법 제21조와 시행령 제16조 — 파기 시 "복구 또는 재생되지 아니하도록" 조치해야 한다.<br />
          단순히 <code>DELETE</code> SQL을 실행하는 것만으로는 부족하다 — 대부분의 데이터베이스와 파일시스템은 삭제 후에도 실제 데이터가 디스크에 남아 있어, 포렌식(Forensic, 디지털 증거 분석) 도구로 복구 가능하기 때문.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">전자적 파기 방법</h3>
        <p>
          전자적 파일 형태의 개인정보를 파기하는 방법은 크게 세 가지:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">방법</th>
                <th className="text-left px-3 py-2 border-b border-border">원리</th>
                <th className="text-left px-3 py-2 border-b border-border">적용 대상</th>
                <th className="text-left px-3 py-2 border-b border-border">복구 가능성</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">덮어쓰기 (Overwriting)</td>
                <td className="px-3 py-1.5 border-b border-border/30">데이터 위치에 무의미한 값(0, 1, 랜덤)을 반복 기록</td>
                <td className="px-3 py-1.5 border-b border-border/30">HDD, 파일</td>
                <td className="px-3 py-1.5 border-b border-border/30">매우 낮음</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">암호화 키 폐기 (Crypto Erase)</td>
                <td className="px-3 py-1.5 border-b border-border/30">데이터를 암호화한 뒤 복호화 키를 파기</td>
                <td className="px-3 py-1.5 border-b border-border/30">DB, 클라우드, SSD</td>
                <td className="px-3 py-1.5 border-b border-border/30">키 없이 복구 불가</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">초기화 (Format + Overwrite)</td>
                <td className="px-3 py-1.5">저장매체 전체를 포맷 후 덮어쓰기</td>
                <td className="px-3 py-1.5">폐기 예정 디스크</td>
                <td className="px-3 py-1.5">매우 낮음</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">덮어쓰기 표준</h3>
        <div className="my-6">
          <OverwriteStandardsInlineViz />
        </div>
        <p>
          덮어쓰기의 횟수와 패턴에 따라 여러 표준이 존재한다:
        </p>
        <ul>
          <li>
            <strong>DoD 5220.22-M</strong> — 미국 국방부 표준. 3회 덮어쓰기: (1) 0x00 → (2) 0xFF → (3) 랜덤 값.<br />
            HDD(Hard Disk Drive, 하드디스크)에서 일반적인 복구 도구로는 데이터 복원이 불가능한 수준.<br />
            대부분의 상용 파기 소프트웨어가 이 표준을 지원한다.
          </li>
          <li>
            <strong>Gutmann 방법</strong> — 35회 덮어쓰기. 다양한 비트 패턴을 사용하여 자기 잔류(Magnetic Remanence, 삭제 후에도 디스크 표면에 남는 미약한 자기 신호)까지 제거.<br />
            이론적으로 가장 안전하지만 실행 시간이 매우 길어 실무에서는 잘 사용하지 않는다.
          </li>
          <li>
            <strong>NIST SP 800-88</strong> — 미국 국립표준기술연구소 가이드라인. 매체 유형별로 Clear(1회 덮어쓰기), Purge(고급 덮어쓰기/디가우징), Destroy(물리적 파기) 3단계를 구분.<br />
            최신 가이드라인으로, 실무에서 가장 널리 참조되는 표준.
          </li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} SSD에서 덮어쓰기의 한계</strong><br />
          SSD(Solid State Drive)는 HDD와 다른 저장 구조를 사용한다 — 웨어 레벨링(Wear Leveling, 셀 수명 균등화를 위해 데이터를 다른 물리적 위치에 분산 기록)과 오버 프로비저닝(Over-Provisioning, 예비 공간) 때문에,
          소프트웨어 덮어쓰기로 원본 데이터가 저장된 정확한 물리적 위치를 덮어쓸 수 없다.<br />
          SSD에서는 제조사의 Secure Erase 명령 또는 암호화 키 폐기(Crypto Erase)를 사용해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">DB 레코드 파기</h3>
        <p>
          데이터베이스에 저장된 개인정보를 파기하는 방법:
        </p>
        <ul>
          <li>
            <strong>방법 1: DELETE + 빈 공간 덮어쓰기</strong><br />
            SQL <code>DELETE</code>로 레코드를 삭제한 뒤, DB 엔진의 "빈 공간 재사용(Vacuum/Shrink)" 기능을 실행하여 삭제된 영역을 덮어쓴다.<br />
            PostgreSQL: <code>VACUUM FULL</code>, MySQL: <code>OPTIMIZE TABLE</code>, Oracle: <code>ALTER TABLE SHRINK SPACE</code>.
          </li>
          <li>
            <strong>방법 2: 암호화 후 키 폐기 (Crypto Erase)</strong><br />
            데이터를 컬럼 단위로 암호화하여 저장한 뒤, 파기 시 복호화 키를 파기한다.<br />
            데이터 자체는 디스크에 남아 있지만 키 없이는 복호화 불가능하므로 "복구 불가" 조건을 충족.<br />
            클라우드 환경에서 물리적 매체 접근이 어려운 경우 가장 실용적인 방법.
          </li>
          <li>
            <strong>방법 3: 비식별화 (De-identification)</strong><br />
            완전 파기가 아닌 대안으로, 개인을 식별할 수 없도록 데이터를 변환하는 방법.<br />
            가명처리(Pseudonymization, 식별자를 다른 값으로 대체), 총계처리(Aggregation, 통계값으로 변환), 삭제(Suppression, 식별 가능 항목 제거) 등.<br />
            통계·연구 목적으로 데이터를 보존해야 할 때 사용하나, 법적으로 "파기"로 인정받으려면 재식별이 불가능해야 한다.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">물리적 파기 방법</h3>
        <p>
          저장매체 자체를 폐기하는 경우 물리적 파기를 수행한다:
        </p>
        <ul>
          <li>
            <strong>디가우징(Degaussing)</strong> — 강력한 자기장을 사용하여 HDD/자기테이프의 데이터를 완전히 소거.<br />
            디가우저(Degausser) 장비로 수행하며, HDD에만 유효하다 — SSD는 자기 방식이 아니므로 디가우징으로 데이터가 삭제되지 않는다.
          </li>
          <li>
            <strong>SSD: TRIM + Secure Erase</strong> — SSD 제조사가 제공하는 Secure Erase 명령으로 전체 셀을 초기화.<br />
            TRIM은 운영체제가 삭제된 블록을 SSD에 알려주는 명령으로, SSD 컨트롤러가 해당 블록을 실제로 비운다.
          </li>
          <li>
            <strong>물리적 파쇄(Shredding)</strong> — 하드디스크, SSD, USB 등 저장매체를 파쇄기로 물리적으로 분쇄.<br />
            가장 확실한 방법이며, 민감도가 매우 높은 데이터(군사·금융)에서 사용.
          </li>
          <li>
            <strong>문서 파쇄</strong> — 종이 문서에 인쇄된 개인정보는 파쇄기(Cross-cut Shredder, 교차 절단 방식)로 파쇄.<br />
            NIST 기준 레벨 P-4 이상(입자 크기 2mm x 15mm 이하)을 권장.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">블록체인 특수성: 온체인 데이터</h3>
        <div className="my-6">
          <BlockchainDeletionInlineViz />
        </div>
        <p>
          블록체인에 기록된 데이터는 기술적으로 삭제할 수 없다 — 블록체인의 핵심 속성인 불변성(Immutability)과 개인정보 파기 의무가 충돌하는 지점.<br />
          따라서 VASP가 준수해야 할 원칙:
        </p>
        <ul>
          <li><strong>오프체인 저장 원칙</strong> — 개인정보(성명, 연락처, 계좌번호 등)는 반드시 오프체인(블록체인 외부) DB에 저장</li>
          <li><strong>온체인에는 식별불가 데이터만</strong> — 지갑주소, 트랜잭션 해시 등 그 자체로 개인을 식별할 수 없는 데이터만 기록</li>
          <li><strong>연결고리 파기</strong> — 오프체인 DB에서 "지갑주소 ↔ 개인정보" 매핑을 파기하면, 온체인 데이터만으로는 개인 식별이 불가능</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 지갑주소는 개인정보인가?</strong><br />
          지갑주소 자체는 익명의 문자열이지만, 다른 정보(KYC 기록, 거래소 매핑)와 결합하면 개인을 식별할 수 있으므로 "결합 가능한 개인정보"로 분류될 수 있다.<br />
          파기 시 "지갑주소 ↔ 실명" 매핑만 삭제하면 연결고리가 끊어져 지갑주소 단독으로는 개인을 식별할 수 없게 된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">파기 대장과 증적 관리</h3>
        <p>
          파기를 실행한 후에는 그 사실을 기록하고 증적을 보관해야 한다. ISMS-P 심사에서 반드시 확인하는 항목.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">기재 내용</th>
                <th className="text-left px-3 py-2 border-b border-border">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">파기 일자</td>
                <td className="px-3 py-1.5 border-b border-border/30">파기 실행 연-월-일</td>
                <td className="px-3 py-1.5 border-b border-border/30">2026-04-01</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">파기 대상</td>
                <td className="px-3 py-1.5 border-b border-border/30">파기한 개인정보 항목 및 건수</td>
                <td className="px-3 py-1.5 border-b border-border/30">2020년 탈퇴 회원 KYC 자료 1,234건</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">파기 방법</td>
                <td className="px-3 py-1.5 border-b border-border/30">사용한 파기 기법</td>
                <td className="px-3 py-1.5 border-b border-border/30">DB DELETE + VACUUM FULL</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">파기 수행자</td>
                <td className="px-3 py-1.5 border-b border-border/30">실제 파기 작업을 수행한 담당자</td>
                <td className="px-3 py-1.5 border-b border-border/30">DBA 담당자</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">파기 확인자</td>
                <td className="px-3 py-1.5 border-b border-border/30">파기 완료를 확인한 관리자</td>
                <td className="px-3 py-1.5 border-b border-border/30">CPO</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">증적</td>
                <td className="px-3 py-1.5">파기 완료 증거 자료</td>
                <td className="px-3 py-1.5">쿼리 실행 로그, 파기 완료 화면 캡처</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          파기 대장은 최소 3년간 보관하며, ISMS-P 심사 시 제출해야 한다.<br />
          물리적 파기의 경우 파기 현장 사진, 파기 업체의 파기 확인증, 파쇄된 매체의 사진을 증적으로 보관한다.
        </p>

      </div>
    </section>
  );
}
