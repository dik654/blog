import SceneShell from "./SceneShell";

/**
 * 본문 대응: #lateral-reach — "내부에서 온 요청이면 인증 생략" 설정이 계정 하나의 탈취를 대역 전체로 넓히는 과정과 두 갈래 대응.
 * 내부 서비스 6개 중 4개가 내부 요청의 인증을 생략한다고 가정합니다(가정). → |H|·p = 6 × 4/6 = 4.
 * 자원 단위 부여는 1개라고 가정합니다(가정). → |G_u| = 1.
 */
type State = "idle" | "pass" | "stop" | "none" | "check" | "granted";

const SERVICES = [
  { name: "관리 화면", skip: true },
  { name: "데이터베이스", skip: true },
  { name: "사내 위키", skip: false },
  { name: "배포 도구", skip: true },
  { name: "로그 조회", skip: true },
  { name: "결제 내부 API", skip: false },
] as const;

const HOSTS = SERVICES.length;
const SKIPPING = SERVICES.filter((s) => s.skip).length;

const SCENES = [
  {
    label: "전제: 밖에서는 직접 닿지 못함",
    summary: "외부 요청 → 경계에서 멈춤",
    note: "많은 내부 서비스가 '내부에서 온 요청이면 인증 생략'을 켜 둡니다. 외부에서 직접 닿지 못한다는 전제 아래 만든 편의입니다.",
    attacker: "outside",
  },
  {
    label: "사설망 계정 하나가 뚫림",
    summary: "공격자의 요청 = 내부에서 온 요청",
    note: "탈취한 계정으로 사설망에 접속하면 공격자의 요청도 내부 대역에서 출발합니다. 전제가 깨진 순간입니다.",
    attacker: "inside",
  },
  {
    label: "인증을 생략하는 서비스를 차례로 지남",
    summary: `|H|·p = ${HOSTS} × ${SKIPPING}/${HOSTS} = ${SKIPPING}개 통과`,
    note: `|H|는 경로가 생긴 대역에서 응답하는 호스트 수, p는 그중 내부 요청을 추가 인증 없이 통과시키는 비율입니다. 뚫린 것은 계정 하나인데 생략 설정이 있는 ${SKIPPING}곳이 함께 열립니다.`,
    attacker: "inside",
  },
  {
    label: "갈래 1: 닿는 범위를 좁힘",
    summary: "|G_u| = 1개만 닿음",
    note: "자원 단위로 하나만 부여했다면 같은 계정이 뚫려도 경로가 생기는 곳은 그 하나입니다. 나머지는 생략 설정이 남아 있어도 닿을 길이 없습니다. 다음 두 절이 이 갈래입니다.",
    attacker: "inside",
  },
  {
    label: "갈래 2: 내부를 권한 근거로 쓰지 않음",
    summary: "내부라는 이유로 통과 0개",
    note: "경로가 남아 있어도 각 서비스가 요청마다 신원과 기기 상태를 보고 판정하면, 내부에서 왔다는 사실만으로 통과하는 곳은 없습니다. 판정 결과는 그 요청의 조건에 달려 있으며, 그 뒤 절이 이 갈래입니다.",
    attacker: "inside",
  },
] as const;

function stateOf(active: number, index: number): State {
  const svc = SERVICES[index];
  if (active <= 1) return "idle";
  if (active === 2) return svc.skip ? "pass" : "stop";
  if (active === 3) return index === 1 ? "granted" : "none";
  return "check";
}

const STYLE: Record<State, { border: string; text: string; tag: (skip: boolean) => string }> = {
  idle: { border: "#94a3b8", text: "#475569", tag: (skip) => (skip ? "내부면 인증 생략" : "인증 요구") },
  pass: { border: "#dc2626", text: "#b91c1c", tag: () => "확인 없이 통과" },
  stop: { border: "#64748b", text: "#475569", tag: () => "인증에서 멈춤" },
  none: { border: "#cbd5e1", text: "#94a3b8", tag: () => "경로 없음" },
  granted: { border: "#d97706", text: "#b45309", tag: () => "부여된 1개" },
  check: { border: "#2563eb", text: "#1d4ed8", tag: () => "요청마다 판정" },
};

export default function LateralTrustViz() {
  return (
    <SceneShell
      eyebrow="내부 신뢰"
      title="계정 하나가 뚫리면 '내부라서 통과'를 켠 서비스가 전부 열립니다"
      description="안쪽 서비스 6개 중 4개가 내부 요청의 인증을 생략한다고 가정한 축소 모형입니다(가정). 서비스 이름도 예시입니다."
      ariaLabel="내부 요청 인증 생략 설정 때문에 탈취된 계정 하나가 여러 서비스를 지나는 과정과 두 갈래 대응"
      scenes={SCENES}
      render={(active) => {
        const inside = SCENES[active].attacker === "inside";
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
            <div className="flex min-w-0 flex-row items-center gap-2 sm:flex-col sm:items-stretch">
              <div className="flex-1 rounded-lg border px-2 py-2 text-center text-xs leading-5" style={{ borderColor: "#dc2626" }}>
                <span className="block font-semibold" style={{ color: "#b91c1c" }}>공격자</span>
                <span className="block text-muted-foreground">{inside ? "탈취한 계정으로 접속" : "인터넷 쪽"}</span>
              </div>
              <div className="flex-1 rounded-lg border border-dashed px-2 py-2 text-center text-xs leading-5" style={{ borderColor: "#64748b" }}>
                <span className="block font-semibold">경계</span>
                <span className="block text-muted-foreground">{inside ? "사설망 접속으로 통과" : "직접 접근 막힘"}</span>
              </div>
            </div>
            <div className="min-w-0 rounded-lg border border-border px-3 py-3">
              <p className="text-xs font-semibold text-muted-foreground">
                안쪽 대역 · {inside ? "요청 출발지: 내부" : "외부 요청은 여기까지 오지 못함"}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {SERVICES.map((svc, index) => {
                  const st = stateOf(active, index);
                  const style = STYLE[st];
                  return (
                    <div
                      key={svc.name}
                      className={`rounded-lg border px-2 py-2 text-center text-xs leading-5 ${st === "none" ? "border-dashed" : ""}`}
                      style={{ borderColor: style.border }}
                    >
                      <span className="block font-semibold" style={{ color: st === "none" ? style.text : undefined }}>
                        {svc.name}
                      </span>
                      <span className="block font-semibold" style={{ color: style.text }}>
                        {style.tag(svc.skip)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
