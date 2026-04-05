export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">VASP 내부통제 체계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-4">내부통제의 출발점</h3>
        <p className="leading-7">
          VASP(Virtual Asset Service Provider, 가상자산사업자)는 이용자의 가상자산을 수탁하고 이전하는 사업자를 총칭한다.
          <br />
          거래소, 수탁업체, 결제 대행사 모두 이 범주에 포함되며, 각각이 지켜야 할 내부통제 기준이 법률과 감독 지침으로 정해져 있다.
          <br />
          내부통제란 조직 내부에서 자산 유출, 횡령, 시스템 오작동을 예방하기 위해 마련한 일련의 절차와 규칙 체계를 뜻한다.
        </p>
        <p className="leading-7">
          전통 금융에서는 수십 년간 내부통제 프레임워크가 발전해 왔지만, 가상자산 영역은 비교적 최근에 규제 틀이 잡혔다.
          <br />
          블록체인 거래는 되돌릴 수 없고(irreversible), 개인키(Private Key) 하나가 곧 자산 전체의 통제권이므로 전통 금융보다 한 번의 실수가 치명적이다.
          <br />
          이 때문에 VASP 내부통제는 "사전 예방"에 극단적으로 무게를 둔다.
        </p>
        <p className="leading-7">
          내부통제의 3대 축은 자산 보관(지갑 분리), 접근 통제(인증/권한), 사고 대응(탐지/복구)이다.
          <br />
          이 세 가지가 유기적으로 연결되어야 단일 장애점(single point of failure)이 사라진다.
          <br />
          예를 들어 지갑이 아무리 안전해도 접근 통제가 허술하면 내부자가 키를 탈취할 수 있고,
          접근 통제가 완벽해도 사고 대응이 없으면 제로데이(zero-day) 공격에 속수무책이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">핫월렛과 콜드월렛 분리 운영</h3>
        <p className="leading-7">
          가상자산 보관의 핵심 구조는 핫월렛(Hot Wallet)과 콜드월렛(Cold Wallet)의 분리다.
          <br />
          핫월렛은 인터넷에 연결된 상태로 즉시 출금이 가능한 지갑이고, 콜드월렛은 오프라인 장치에 개인키를 보관하여 네트워크 공격으로부터 차단된 지갑이다.
        </p>
        <p className="leading-7">
          분리 운영의 이유는 보안과 편의성 사이의 트레이드오프(trade-off)를 관리하기 위함이다.
          <br />
          이용자가 입금하거나 출금을 요청하면 즉각 처리해야 하므로 일정 물량은 핫월렛에 둔다.
          <br />
          그러나 핫월렛은 서버 해킹, 내부자 탈취, 악성코드 감염에 노출될 수 있으므로 전체 자산의 극히 일부만 유지한다.
          <br />
          나머지 대부분은 콜드월렛에 보관하여 물리적 접근 없이는 이동이 불가능하게 만든다.
          이렇게 하면 핫월렛이 침해되더라도 피해 규모가 한정된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Multi-sig: 2인 이상 서명 체계</h3>
        <p className="leading-7">
          Multi-sig(다중서명)는 하나의 트랜잭션을 실행하기 위해 복수의 개인키 서명이 필요한 구조다.
          <br />
          예를 들어 3-of-5 Multi-sig는 5개의 키 중 3개 이상이 서명해야만 자금 이동이 가능하다.
          <br />
          비트코인은 OP_CHECKMULTISIG 스크립트로, 이더리움은 Multi-sig 스마트 컨트랙트(예: Gnosis Safe)로 구현한다.
        </p>
        <p className="leading-7">
          단일 키 체계에서는 한 명의 관리자가 탈취당하거나 매수당하면 자산 전체가 유출된다.
          <br />
          Multi-sig를 적용하면 공격자가 동시에 복수의 키 소유자를 장악해야 하므로 공격 난이도가 기하급수적으로 상승한다.
          <br />
          또한 내부자 단독 범행도 방지할 수 있다 -- 한 사람이 아무리 높은 직급이라도 혼자서는 자금을 이동시킬 수 없기 때문이다.
          <br />
          이 원칙은 콜드월렛에서 핫월렛으로 자산을 전송하거나, 대규모 출금을 처리할 때 필수로 적용된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">KYC/AML 연동</h3>
        <p className="leading-7">
          KYC(Know Your Customer, 고객확인제도)는 이용자의 신원을 사전에 검증하는 절차다.
          <br />
          AML(Anti-Money Laundering, 자금세탁방지)은 불법 자금이 가상자산을 통해 세탁되는 것을 차단하는 규제 체계다.
          <br />
          VASP에서는 이 두 가지가 거래 처리 파이프라인에 직접 연동되어야 한다.
        </p>
        <p className="leading-7">
          고객확인이 완료되지 않은 계정은 입출금 자체가 불가능하게 시스템에서 차단한다.
          <br />
          실명인증, 신분증 검증, 실제소유자(Beneficial Owner) 확인을 거친 후에야 거래가 열린다.
          <br />
          거래가 발생하면 실시간으로 FDS(Fraud Detection System, 이상거래탐지시스템)가 패턴을 분석하고,
          의심거래(STR, Suspicious Transaction Report) 기준에 해당하면 자동 보류 후 내부 심사로 넘긴다.
          <br />
          이 흐름이 끊어지면 자금세탁 경로로 악용될 수 있으므로 KYC-거래-AML 검증은 단일 파이프라인으로 엮여 있다.
        </p>
        <p className="leading-7">
          FATF(Financial Action Task Force, 국제자금세탁방지기구)의 Travel Rule도 이 파이프라인에 포함된다.
          <br />
          일정 금액 이상의 가상자산 전송 시 송신자와 수신자의 정보를 함께 전달해야 하며,
          상대 VASP가 Travel Rule을 지원하지 않으면 전송 자체를 거부하는 것이 원칙이다.
          <br />
          이 규칙이 적용되면서 익명 전송의 범위가 점점 좁아지고, VASP 간 상호 검증 체계가 강화되고 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">시스템 접근: VPN + MFA + 최소권한</h3>
        <p className="leading-7">
          VASP의 관리 시스템에 접근하려면 VPN(Virtual Private Network, 가상사설망) 연결이 선행되어야 한다.
          <br />
          VPN은 공개 인터넷 구간을 암호화 터널로 감싸서 도청과 중간자 공격을 차단한다.
          <br />
          VPN 접속 후에도 MFA(Multi-Factor Authentication, 다중인증)를 통과해야 실제 시스템에 진입할 수 있다.
          MFA는 비밀번호(지식 요소)에 더해 OTP(소유 요소)나 생체인증(존재 요소)을 결합하는 방식이다.
        </p>
        <p className="leading-7">
          최소권한 원칙(Principle of Least Privilege)은 각 직원에게 업무 수행에 꼭 필요한 권한만 부여하는 것이다.
          <br />
          개발자는 프로덕션 DB에 직접 접근할 수 없고, 운영자는 소스코드 저장소에 쓰기 권한이 없다.
          <br />
          권한이 넓을수록 한 계정이 침해되었을 때 피해 반경이 커지기 때문에, 권한을 최소 단위로 쪼개서 부여한다.
          <br />
          퇴직자 계정 즉시 비활성화, 부서 이동 시 권한 재검토도 이 원칙의 연장이다.
        </p>
        <p className="leading-7">
          접근 권한은 정기적으로(분기 1회 이상) 재검토한다.
          <br />
          부서 이동, 직급 변경, 프로젝트 종료 등 역할 변화가 있으면 기존 권한을 회수하고 새 역할에 맞는 권한을 재부여한다.
          <br />
          이를 권한 재인증(re-certification)이라 하며, 형식적 승인이 아닌 실제 업무 필요성 검증을 거쳐야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">투명한 거래 기록: 이중 기록 체계</h3>
        <p className="leading-7">
          블록체인 자체가 거래 기록의 불변 원장(immutable ledger) 역할을 하지만, VASP는 내부 데이터베이스에도 별도 로그를 남긴다.
          <br />
          이중 기록을 유지하는 이유는 크게 세 가지다.
        </p>
        <p className="leading-7">
          첫째, 온체인(on-chain) 기록은 주소만 보이고 누구의 거래인지 특정하기 어렵다.
          내부 로그에는 이용자 ID, 요청 시각, 승인자, IP 주소 등 메타데이터가 함께 기록되어 감사 추적(audit trail)이 가능하다.
          <br />
          둘째, 블록체인에 기록되기까지 시간차(confirmation time)가 있으므로, 내부 시스템은 "요청 접수 → 서명 → 브로드캐스트 → 컨펌" 각 단계를 개별적으로 추적한다.
          <br />
          셋째, 규제 기관의 검사나 외부 감사 시 내부 로그를 기반으로 거래 이력을 제출해야 하므로, 가독성 높은 정형 데이터가 별도로 필요하다.
        </p>
        <p className="leading-7">
          온체인 기록과 내부 로그의 정합성(consistency)은 정기적으로 대조 검증한다.
          <br />
          두 기록 사이에 불일치가 발생하면 즉시 조사에 착수하며, 이는 내부자 비리나 시스템 오류를 조기에 발견하는 핵심 수단이 된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">내부통제 조직 구조</h3>
        <p className="leading-7">
          내부통제가 실효성을 가지려면 독립적인 감시 체계가 필요하다.
          <br />
          CISO(정보보호최고책임자)는 보안 정책 수립과 기술적 통제를 총괄하고,
          CCO(준법감시인)는 법규 준수와 AML/CFT 체계를 관장한다.
          <br />
          두 역할은 서로 견제하면서 보완하는 관계로, 동일인이 겸임하지 않도록 분리하는 것이 원칙이다.
        </p>
        <p className="leading-7">
          내부감사 부서는 1선(현업)과 2선(CISO/CCO)의 통제가 제대로 작동하는지 독립적으로 검증하는 3선 방어(three lines of defense) 역할을 한다.
          <br />
          감사 결과는 이사회 또는 경영진에게 직접 보고되어, 중간 관리층에 의해 은폐되거나 축소되는 것을 방지한다.
          <br />
          이 3선 방어 구조가 무너지면 내부통제는 형식에 그치게 되므로, 각 라인의 독립성 확보가 가장 중요한 전제 조건이다.
        </p>
      </div>
    </section>
  );
}
