import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import IsmsFoundationsViz from "./isms-foundations-viz";

const KISA_GUIDE =
  "https://www.isms-p.or.kr/ntcn/rcsrm/selectGnrlRcsrmList.do";
const KISA_TARGET =
  "https://www.isms-p.or.kr/cert/aply/selectCertTrgtDetail.do";
const NETWORK_ACT =
  "https://law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=900628579";

export default function IsmsOverview() {
  return (
    <div className="space-y-12">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">ISMS-P는 무엇을 설치했는지가 아니라 위험을 계속 관리하는 방법을 심사합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            방화벽과 MFA가 있어도 누가 어떤 위험을 판단해 설정을 바꾸고, 예외를 승인하고,
            결과를 다시 확인하는지가 없다면 관리체계라고 보기 어렵습니다. ISMS(정보보호
            관리체계)는 조직이 정한 인증범위 안에서 관리적·기술적·물리적 보호조치를
            수립하고 실제로 운영하는지를 확인합니다. ISMS-P는 여기에 개인정보 처리
            단계와 정보주체 권리보호 기준을 더한 통합 인증입니다.
          </p>
          <p>
            이 글은 처음 준비하는 독자가 <strong>범위 → 자산과 위험 → 보호대책 → 운영
            증적 → 심사와 보완</strong>의 전체 루프를 먼저 잡도록 돕습니다. 개별 보안제품의
            세부 설정은 뒤 글로 넘기고, 여기서는 무엇이 왜 연결돼야 하는지와 인증으로
            증명할 수 없는 범위를 함께 구분합니다.
          </p>
        </div>

        <div className="not-prose my-6 grid gap-4 rounded-xl border border-border/80 p-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-bold text-primary">관할·확인일</p>
            <p className="mt-2 text-sm leading-6">대한민국 · 2026-08-14 확인</p>
          </div>
          <div>
            <p className="text-xs font-bold text-primary">적용 판단</p>
            <p className="mt-2 text-sm leading-6">정보통신망법 제47조와 시행령 제49조, 업종별 별도 법령을 함께 확인</p>
          </div>
          <div>
            <p className="text-xs font-bold text-primary">해석 경계</p>
            <p className="mt-2 text-sm leading-6">이 글은 학습용 해설이며 개별 사업자의 법률·심사 의견을 대신하지 않음</p>
          </div>
        </div>

        <ContentBoundary article="isms-overview" />
        <IsmsFoundationsViz mode="management-loop" />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>ISMS와 ISMS-P, 의무대상과 자율신청을 먼저 분리합니다</h3>
          <p>
            정보통신망법상 의무대상자는 ISMS 또는 ISMS-P를 선택할 수 있습니다. 현재
            시행령은 ISP·IDC 외에도 일정 범주의 상급종합병원·학교, 정보통신서비스 부문
            전년도 매출액 100억원 이상, 전년도 일일평균 이용자 100만명 이상인 자 등을
            규정하지만, 금융회사 예외와 사업 구조를 함께 읽어야 합니다. 숫자 하나만 보고
            해당 여부를 확정하지 말고 법인, 서비스, 매출 산정 범위와 통지 내용을 확인해야
            하며, 의무대상이 아니어도 자율 신청은 가능합니다.
          </p>
          <p>
            인증범위(scope)는 회사 이름과 같은 말이 아닙니다. 대상 서비스, 이를 운영하는
            조직과 사람, 애플리케이션·서버·네트워크·데이터, 사무실·IDC·클라우드 위치,
            외부 위탁자를 경계로 고정한 것입니다. 범위 밖 시스템이 인증 서비스의 로그인,
            배포, 결제나 백업에 의존된다면 연결 관계와 제외 근거를 설명해야 합니다.
          </p>
        </div>

        <div id="paper-isms-legal-basis" className="scroll-mt-24">
          <CitationBlock citeKey={1} source="정보통신망법 제47조 · 2026-07-07 시행" href={NETWORK_ACT}>
            문제: 어떤 사업자에게 정보보호 관리체계 인증 의무와 사후관리가 적용되는지 정합니다. 기여: 관리적·기술적·물리적 보호조치를 포함한 관리체계, 3년 유효기간, 연 1회 이상 사후관리의 법적 틀을 둡니다. 전제: 대한민국에서 해당 정보통신서비스를 제공하고 현재 시행 법령의 대상 요건을 충족해야 합니다. 근거 범위: 법정 인증 의무와 제도 구조입니다. 비주장: 인증 취득이 침해사고 방지나 모든 개별 통제의 효과를 보장한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-isms-target" className="scroll-mt-24">
          <CitationBlock citeKey={2} source="KISA ISMS-P 누리집 · 인증대상" href={KISA_TARGET}>
            문제: 신청 조직이 의무대상인지 자율 신청자인지 실무적으로 확인해야 합니다. 기여: ISP·IDC·매출·이용자 기준과 최초 의무대상자의 취득 시점을 안내합니다. 전제: 2026-08-14 확인 화면이며 사업자별 매출·이용자 산정과 예외는 원 법령과 KISA 안내를 다시 대조합니다. 근거 범위: 현재 제도 안내입니다. 비주장: 누리집의 일반 표만으로 특정 법인의 최종 법률 판단을 대신하지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-isms-guide" className="scroll-mt-24">
          <CitationBlock citeKey={3} source="KISA ISMS-P 인증기준 안내서 · 2023.11" href={KISA_GUIDE}>
            문제: 추상적인 인증기준을 조직이 확인 가능한 활동과 증적으로 바꿔야 합니다. 기여: 관리체계 수립·운영, 보호대책, 개인정보 처리 단계의 주요 확인사항·결함사례·증적 예를 제공합니다. 전제: 2023.11 안내서는 심사 해설 자료이므로 2026-08-14 시행 법령·고시와 함께 읽습니다. 근거 범위: 기준 해석과 준비 방향입니다. 비주장: 예시 문서나 제품을 그대로 복제하면 적합하다는 체크리스트가 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="asset-risk" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">자산 목록을 서비스 의존성과 위험 시나리오로 바꿉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            정보자산은 서버만 뜻하지 않습니다. 고객 로그인 서비스라면 사용자 데이터,
            인증 API, 계정 DB, encryption key, 배포 pipeline, 운영자, 클라우드 계정,
            공급자 계약과 복구 절차까지 서비스 제공에 필요한 대상을 포함합니다. 각 자산에는
            owner, 위치, 처리하는 정보, 상·하위 의존성, 변경·폐기 상태를 붙여야 누락과
            범위 이탈을 찾을 수 있습니다.
          </p>
          <p>
            위험은 “DB가 위험하다”가 아니라 <strong>위협 행위자 또는 사건이 취약점을 이용해
            자산에 영향을 주는 시나리오</strong>로 씁니다. 예를 들어 “퇴직자 VPN 계정이
            회수되지 않아 외부에서 고객 DB를 조회하고 개인정보 기밀성이 훼손된다”라고 쓰면,
            계정 회수 SLA·MFA·접속 경로·DB 권한·로그 검토 중 무엇을 통제로 둘지 결정할 수
            있습니다.
          </p>
        </div>

        <ExplainedFormula
          question="서로 다른 위험 시나리오의 처리 우선순위를 어떻게 일관되게 정할까?"
          idea="발생가능성과 업무 영향을 같은 등급표로 판정하고 곱해 우선순위 후보를 만듭니다. 곱셈값은 위험의 물리량이 아니라 조직이 정의한 ordinal score이므로, 동일 점수의 의미와 수용 기준을 별도로 검토합니다."
          formula={String.raw`R_i=L_i\times I_i`}
          terms={[
            { symbol: "i", name: "위험 시나리오", description: "자산·위협·취약점·영향이 연결된 한 평가 단위입니다." },
            { symbol: "L_i", name: "발생가능성 등급", description: "예를 들어 1~5 표에서 관측된 노출·사건 빈도·통제 상태로 판정합니다." },
            { symbol: "I_i", name: "영향 등급", description: "기밀성·무결성·가용성, 법규·고객·재무 영향을 정의된 기준으로 판정합니다." },
            { symbol: "R_i", name: "고유위험 점수", description: "현재 보완통제를 반영하기 전 우선순위용 점수입니다." },
          ]}
          assumptions={[
            "등급 1과 2의 차이가 실제로 두 배라는 뜻은 아니며 조직의 평가표와 근거가 versioning되어야 합니다.",
            "낮은 빈도·치명적 영향, 법정 필수조치, 연쇄위험은 단순 곱셈 임계값만으로 자동 수용하지 않습니다.",
          ]}
          interpretation="퇴직 계정 악용의 L=3, 개인정보 대량조회 영향 I=4라면 R=12입니다. 통제 적용 뒤 L이 1로 낮아졌다고 평가하면 잔여위험은 4이지만, 실제 회수 표본·접속 차단 test·로그를 근거로 L을 다시 판정해야 하며 숫자만 낮춰서는 안 됩니다."
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>통제 후에는 잔여위험과 처리 결정을 기록합니다</h3>
          <p>
            위험처리는 회피, 감소, 전가, 수용으로 나눌 수 있습니다. 통제를 적용했다면
            통제 owner, 구현 위치, 완료 기한, 검증 방법, 예상 잔여위험을 기록하고 실제
            운영 결과로 재평가합니다. 위험수용은 “아무것도 하지 않음”이 아니라 수용 권한자,
            이유, 만료일, 모니터링 조건을 가진 명시적 결정입니다. 범위 변경·사고·중대한
            취약점·법령 개정은 정기 주기 전에도 재평가 trigger가 됩니다.
          </p>
        </div>
      </section>

      <section id="protection-measures" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">보호대책은 정책·실행 지점·운영 기록·효과 검증으로 완성됩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            인증기준 번호에 문서 파일 하나씩 대응시키는 방식은 통제의 작동 여부를 보여주지
            못합니다. 하나의 위험 시나리오에 정책과 승인 책임을 두고, IAM·endpoint·network·
            application·database·physical zone에서 실제 요청을 차단하거나 허용하며, 그 결과를
            log·ticket·review receipt로 남겨야 합니다.
          </p>
          <h3>세 층을 함께 설계합니다</h3>
          <ul>
            <li><strong>관리적 통제:</strong> 책임·승인·교육·외부자 계약·변경과 예외 절차를 정합니다.</li>
            <li><strong>기술적 통제:</strong> 인증·권한·암호화·logging·backup·취약점 관리가 정책을 강제합니다.</li>
            <li><strong>물리적 통제:</strong> 시설 출입·장비 반출·환경 장애와 매체 폐기를 관리합니다.</li>
          </ul>
          <p>
            세 층은 대체재가 아닙니다. 서버실 출입카드가 있어도 공유 root 비밀번호를 막지
            못하고, RBAC가 있어도 승인되지 않은 backup 반출을 막지 못할 수 있습니다.
            예방·탐지·대응·복구 통제가 같은 위험을 서로 다른 시점에서 다루도록 defense in
            depth를 구성하되, 통제 수가 많다는 이유만으로 효과가 높다고 결론내리지 않습니다.
          </p>
        </div>

        <div className="not-prose my-8 overflow-x-auto">
          <table className="w-full min-w-[680px] border-y border-border text-sm">
            <thead><tr className="border-b border-border text-left text-xs text-muted-foreground"><th className="px-3 py-3">통제 질문</th><th className="px-3 py-3">구현 증거</th><th className="px-3 py-3">운영 증거</th><th className="px-3 py-3">효과 검증</th></tr></thead>
            <tbody>
              <tr className="border-b border-border"><td className="px-3 py-4 font-medium">퇴직자의 접근이 끝났는가?</td><td className="px-3 py-4">HR–IAM workflow·SLA</td><td className="px-3 py-4">revocation ticket·token 폐기</td><td className="px-3 py-4">퇴직자 모집단 대조·login deny</td></tr>
              <tr><td className="px-3 py-4 font-medium">DB 조회가 업무 목적에 맞는가?</td><td className="px-3 py-4">role matrix·query gateway</td><td className="px-3 py-4">승인 session·query log</td><td className="px-3 py-4">이상 조회 표본·owner 재인증</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="audit-remediation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">심사는 표본으로 운영 실태를 확인하고, 보완은 원인과 영향 범위까지 추적합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            심사 준비는 먼저 범위와 운영기간을 확정하고, 요구사항별 owner와 증적 원본을
            연결하는 데서 시작합니다. 심사원은 정책 문구만 읽지 않고 계정 모집단에서 표본을
            뽑아 승인·변경·회수 기록을 대조하거나, 설정 화면과 실제 차단 결과, log의 시간과
            보관 상태를 함께 확인합니다. 따라서 제출용 캡처와 운영 원본이 다른 경우 오히려
            재현성과 신뢰성이 떨어집니다.
          </p>
          <p>
            결함이 나오면 증상만 수정하지 않습니다. 요구사항, 직접 원인, 근본 원인, 같은
            원인이 영향을 준 자산·기간·계정을 조사한 뒤 수정·보상통제·재발방지를 정합니다.
            이후 원래 표본과 확장 표본으로 다시 검증하고 owner·완료일·검증자·잔여위험을
            종결 기록에 남깁니다. 예를 들어 퇴직자 한 명의 계정을 끄는 것으로 끝내지 않고,
            HR event 누락 원인을 고쳐 전체 퇴직자 모집단과 API key·VPN certificate까지
            재대조해야 합니다.
          </p>
          <p>
            법상 인증 유효기간은 3년이고 연 1회 이상 사후관리가 수행됩니다. 그러나 이는
            그 기간 동안 시스템이 안전하다는 보증기간이 아닙니다. 인증은 정해진 범위와
            심사시점·표본에서 관리체계가 기준에 적합했음을 보여주는 evidence이며, 범위 밖
            서비스, 이후 변경, 발견되지 않은 취약점과 실제 공격 성공 가능성은 별도 운영
            관리가 필요합니다.
          </p>
          <h3>다음 글에서 무엇을 확장할까?</h3>
          <p>
            <a href="/isms-aml/isms-practical-guide">실전 가이드</a>에서는 요구사항을
            control-evidence chain으로 만드는 방법을, <a href="/isms-aml/isms-access-control">접근통제</a>와
            <a href="/isms-aml/isms-auth-management">인증·계정관리</a>에서는 identity에서 DB
            query까지의 실행 경로를 자세히 다룹니다. 이 글의 위험등록부와 범위 정의가 뒤
            글의 입력입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
