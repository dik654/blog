import SceneShell from "./SceneShell";

/**
 * 본문 대응: #audit-evidence — 퇴직자 모집단 52명을 IAM·VPN·cloud·DB 계정 목록과 같은 identifier·cutoff로 join하고,
 * 맞지 않는 항목을 예외로 뽑아 coverage를 보고한다.
 * 50명은 모든 하위 시스템 회수 확인, 2명은 cloud API key 잔존 → 50 ÷ 52 = 96.2%.
 * 예외 두 명이 격자의 어느 칸인지는 그림을 위한 임의 배치다.
 */
const POPULATION = 52;
const EXCEPTIONS = [17, 38] as const;
const VERIFIED = POPULATION - EXCEPTIONS.length;
const COVERAGE = ((VERIFIED / POPULATION) * 100).toFixed(1);
const SYSTEMS = ["IAM", "VPN", "cloud", "DB"] as const;
const CLOUD = 2;

interface Scene {
  label: string;
  summary: string;
  note: string;
  joined: boolean;
  flagged: boolean;
  report: boolean;
}

const SCENES: readonly Scene[] = [
  {
    label: "모집단부터 고정합니다",
    summary: `HR 퇴직자 ${POPULATION}명`,
    note: "심사기간 HR 퇴직자 원장에서 cutoff time을 정해 모집단을 고정합니다. 칸 하나가 퇴직자 한 명입니다. 발견하기 쉬운 계정만 골라 분모에 넣지 않는 것이 출발점입니다.",
    joined: false,
    flagged: false,
    report: false,
  },
  {
    label: "네 시스템 계정 목록과 join합니다",
    summary: "같은 identifier · 같은 cutoff",
    note: "각 퇴직자를 IAM, VPN, cloud, DB 계정 목록과 같은 identifier와 같은 cutoff time으로 맞춥니다. 칸 안의 작은 네 점이 이 네 시스템이며, 시스템마다 회수가 확인됐는지를 따로 봅니다.",
    joined: true,
    flagged: false,
    report: false,
  },
  {
    label: "맞지 않는 항목이 예외 목록이 됩니다",
    summary: `예외 ${EXCEPTIONS.length}명 · cloud API key 잔존`,
    note: `맞지 않는 항목과 SLA 초과 건이 예외 목록에 오릅니다. 본문 예시에서는 ${EXCEPTIONS.length}명에게 cloud API key가 남아 있고, 나머지 ${VERIFIED}명은 모든 하위 시스템 회수가 확인됐습니다.`,
    joined: true,
    flagged: true,
    report: false,
  },
  {
    label: "전체 coverage와 남은 예외를 함께 보고합니다",
    summary: `${VERIFIED} ÷ ${POPULATION} = ${COVERAGE}%`,
    note: `coverage는 ${COVERAGE}%이며 100%로 반올림하지 않습니다. 남은 ${EXCEPTIONS.length}명은 차단, 원인, 전수 재검증까지 따로 추적합니다.`,
    joined: true,
    flagged: true,
    report: true,
  },
];

const OK = "#2563eb";
const BAD = "#ef4444";
const IDLE = "#cbd5e1";


export default function LeaverCoverageViz() {
  const exceptionSet = new Set<number>(EXCEPTIONS);
  return (
    <SceneShell
      eyebrow="모집단 join"
      title="퇴직자 52명을 네 시스템과 맞춰 보면 남은 예외가 드러납니다"
      description="칸 하나가 퇴직자 한 명이고, 칸 안의 네 점이 IAM·VPN(위), cloud·DB(아래) 회수 여부입니다. 회색은 대조 중, 파랑은 회수 확인, 빨강은 남아 있음입니다."
      note="52명·50명·cloud API key 2건은 본문 예시의 숫자입니다. 예외 두 명의 칸 위치는 임의입니다."
      ariaLabel="퇴직자 모집단 52명을 IAM, VPN, cloud, DB 계정과 join해 예외 2명을 찾고 coverage 96.2퍼센트를 보고하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="mx-auto grid max-w-xl grid-cols-[repeat(13,minmax(0,1fr))] gap-1">
              {Array.from({ length: POPULATION }, (_, person) => {
                const isException = scene.flagged && exceptionSet.has(person);
                const border = isException ? BAD : scene.report && !isException ? OK : "#94a3b8";
                return (
                  <div
                    key={person}
                    className="flex aspect-square min-w-0 items-center justify-center rounded-[3px] border"
                    style={{ borderColor: border, borderWidth: isException ? 1.25 : 1 }}
                  >
                    <span className={`grid grid-cols-2 gap-[2px] ${scene.joined ? "" : "invisible"}`} aria-hidden>
                      {SYSTEMS.map((system, index) => (
                        <span
                          key={system}
                          className="block h-[4px] w-[4px] rounded-full sm:h-[5px] sm:w-[5px]"
                          style={{
                            backgroundColor:
                              exceptionSet.has(person) && index === CLOUD && scene.flagged ? BAD : scene.flagged ? OK : "#94a3b8",
                          }}
                        />
                      ))}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mx-auto mt-3 grid max-w-xl grid-cols-3 gap-2 text-center text-xs sm:text-sm">
              <div className="rounded-lg border border-border/80 px-2 py-1.5">
                <span className="block text-muted-foreground">모집단</span>
                <span className="font-mono font-bold">{POPULATION}</span>
              </div>
              <div className="rounded-lg border px-2 py-1.5" style={{ borderColor: scene.report ? OK : IDLE }}>
                <span className="block text-muted-foreground">검증 완료</span>
                <span className="font-mono font-bold">{scene.flagged ? VERIFIED : "−"}</span>
              </div>
              <div className="rounded-lg border px-2 py-1.5" style={{ borderColor: scene.flagged ? BAD : IDLE }}>
                <span className="block text-muted-foreground">예외</span>
                <span className="font-mono font-bold">{scene.flagged ? EXCEPTIONS.length : "−"}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
