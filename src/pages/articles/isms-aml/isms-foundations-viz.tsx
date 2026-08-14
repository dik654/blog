import VizFrame from "@/components/viz/VizFrame";

type Mode = "management-loop" | "evidence-chain" | "access-path" | "identity-lifecycle";

const FLOW = {
  "management-loop": {
    eyebrow: "Management system loop",
    title: "인증은 장비 목록이 아니라 범위·위험·통제·증거가 되먹임되는 운영 체계입니다",
    description: "심사에서 발견된 차이는 보완조치로 끝나지 않고 다음 위험평가와 운영계획의 입력으로 돌아갑니다.",
    rows: [
      ["01", "범위 고정", "서비스·조직·정보자산·물리 위치·외부자를 한 경계로 묶습니다.", "범위 정의서"],
      ["02", "위험 판단", "위협과 취약점이 어떤 업무 영향을 만드는지 시나리오별로 평가합니다.", "위험등록부"],
      ["03", "통제 설계", "회피·감소·전가·수용 중 처리 방법과 책임자·기한을 정합니다.", "위험처리계획"],
      ["04", "운영·검증", "정책의 존재가 아니라 실행 기록과 표본 결과로 효과를 확인합니다.", "운영 증적"],
      ["05", "보완·재평가", "원인과 영향 범위를 확인한 뒤 수정하고 같은 표본을 다시 검증합니다.", "종결 기록"],
    ],
    note: "인증서가 유효해도 신규 서비스·조직개편·사고처럼 위험이 바뀌는 사건은 다음 정기심사까지 기다리지 않고 관리체계에 반영해야 합니다.",
  },
  "evidence-chain": {
    eyebrow: "Control evidence chain",
    title: "한 요구사항을 구현하고 실제 운영한 사실까지 이어져야 심사 가능한 증거가 됩니다",
    description: "문서·설정·로그가 각각 따로 존재하는 것보다 같은 통제 ID와 기간, 자산, 책임자로 연결되는지가 중요합니다.",
    rows: [
      ["01", "요구사항", "어떤 위험을 어느 범위에서 줄여야 하는지 확인합니다.", "통제 ID"],
      ["02", "설계", "승인자·실행 주기·예외·실패 시 조치를 절차로 정합니다.", "정책·절차"],
      ["03", "구현", "IAM·방화벽·DB 접근제어 등 실제 enforcement point에 반영합니다.", "설정 snapshot"],
      ["04", "운영", "정해진 주기와 event에서 담당자가 통제를 수행합니다.", "ticket·log"],
      ["05", "검토", "모집단과 표본을 연결하고 예외·누락·재발 여부를 판정합니다.", "review receipt"],
    ],
    note: "화면 캡처 한 장은 그 순간의 상태만 보여 줍니다. 조회 조건·원본 위치·추출 시각·담당자·승인·결과를 함께 남겨야 재현할 수 있습니다.",
  },
  "access-path": {
    eyebrow: "Access decision path",
    title: "네트워크 연결 허용과 업무 권한 허용을 서로 다른 단계에서 검사합니다",
    description: "망분리만으로 사용자의 업무 권한이 정당해지지 않으며, 애플리케이션 RBAC만으로 우회 DB 접속이 막히지도 않습니다.",
    rows: [
      ["01", "주체 확인", "사람·서비스 계정을 고유하게 식별하고 강한 인증을 적용합니다.", "identity"],
      ["02", "접속 경로", "관리 단말·VPN·bastion·허용 시간과 source network를 제한합니다.", "session"],
      ["03", "권한 결정", "업무 역할·자원·행위·조건·승인 상태로 allow 또는 deny를 계산합니다.", "decision"],
      ["04", "실행 지점", "API gateway·OS·DB가 같은 정책 revision을 실제 요청에 강제합니다.", "enforcement"],
      ["05", "감사·회수", "행위와 결과를 남기고 만료·직무변경·퇴직 시 권한을 제거합니다.", "receipt"],
    ],
    note: "긴급 권한은 영구 예외가 아니라 별도 승인·짧은 만료·세션 기록·사후 검토가 있는 break-glass 경로로 설계합니다.",
  },
  "identity-lifecycle": {
    eyebrow: "Identity lifecycle",
    title: "인증수단과 권한은 입사·이동·퇴직 event에 맞춰 함께 바뀌어야 합니다",
    description: "로그인 성공은 현재 업무 권한의 정당성을 뜻하지 않습니다. 계정 상태, authenticator 상태, entitlement를 각각 추적합니다.",
    rows: [
      ["01", "Joiner", "고유 계정을 만들고 신원을 확인한 뒤 최소 역할과 인증수단을 결속합니다.", "issued"],
      ["02", "Mover", "새 역할을 부여하기 전에 기존 역할과 충돌·불필요 권한을 제거합니다.", "changed"],
      ["03", "Use", "MFA·session·위험 신호와 resource policy를 요청마다 검사합니다.", "active"],
      ["04", "Review", "인사 원장과 계정·권한·최근 사용을 대조해 소유자와 필요성을 재확인합니다.", "attested"],
      ["05", "Leaver", "세션·token·key·shared secret과 하위 시스템 권한을 정해진 SLA 안에 폐기합니다.", "revoked"],
    ],
    note: "계정 하나를 disabled로 바꿔도 이미 발급된 API key·refresh token·VPN certificate·DB role이 남아 있으면 퇴직 처리가 끝난 것이 아닙니다.",
  },
} as const;

export default function IsmsFoundationsViz({ mode }: { mode: Mode }) {
  const flow = FLOW[mode];

  return (
    <VizFrame
      eyebrow={flow.eyebrow}
      title={flow.title}
      description={flow.description}
      note={flow.note}
      canvasClassName="bg-background"
    >
      <div className="border-y border-border/80">
        {flow.rows.map(([step, name, action, artifact]) => (
          <div
            key={step}
            className="grid min-w-0 gap-2 border-b border-border/70 py-5 last:border-b-0 sm:grid-cols-[3rem_7.5rem_minmax(0,1fr)_7rem] sm:items-start sm:gap-5"
          >
            <span className="text-xs font-semibold tracking-wide text-muted-foreground">{step}</span>
            <strong className="text-sm leading-6 text-foreground">{name}</strong>
            <span className="min-w-0 text-sm leading-6 text-foreground/75">{action}</span>
            <span className="w-fit rounded-md border border-border/80 px-2 py-1 text-xs font-medium text-muted-foreground">
              {artifact}
            </span>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
