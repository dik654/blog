import SceneShell from "./SceneShell";

/**
 * 본문 대응: #publication (4절 inside-entry의 "구현·검사·병합·공개를 합치지 않는다"와 연결).
 * 단계가 진행될 때 운영 환경이 쓰는 코드와 Changelog 문서 안에서 항목이 놓인 자리를 함께 본다.
 * run-1842, v1.4.0, 2026-04-16은 본문의 설명용 값이다. (가정)
 */
const STAGES = ["구현", "검사 4/4", "병합", "배포·공개 확인"] as const;
const ENTRY = "빈 정리 결과가 기존 프로필을 자동으로 덮어쓰지 않도록 수정";

const SCENES = [
  {
    label: "구현",
    summary: "운영: 예전 코드 · 항목 없음",
    note: "수정 코드를 썼지만 아직 검사하지 않았습니다. 이 글의 순서에서는 이 단계를 “완료”라고 부르지 않고 Changelog에도 적지 않습니다.",
  },
  {
    label: "검사 4/4 통과",
    summary: "run-1842 · 항목은 Unreleased",
    note: "run-1842에서 네 검사의 기대값과 실제값이 모두 맞았습니다. 항목을 문서 상단 Unreleased의 Fixed에 적습니다. 운영 환경은 여전히 예전 코드라 사용자는 같은 오류를 만날 수 있습니다.",
  },
  {
    label: "병합",
    summary: "운영: 아직 예전 코드 · 그대로 Unreleased",
    note: "코드를 합쳤어도 운영 반영 전이면 날짜가 있는 배포 항목으로 옮기지 않습니다. 검사 통과와 병합은 공개가 아닙니다.",
  },
  {
    label: "배포·공개 확인",
    summary: "v1.4.0 — 2026-04-16",
    note: "v1.4.0을 배포하고 같은 공개 위치에서 반영을 확인한 뒤에야 항목을 v1.4.0 아래로 옮깁니다. 공개 대상이 패키지라면 릴리스 확인과 각 설치 환경의 업그레이드는 따로 봅니다.",
  },
] as const;

export default function ReleaseStateViz() {
  return (
    <SceneShell
      eyebrow="공개 상태"
      title="검사를 통과해도 배포를 확인하기 전까지 항목은 Unreleased에 남습니다"
      description="위 띠는 작업 단계와 운영 환경이 쓰는 코드이고, 아래 상자는 Changelog 문서에서 이 항목이 놓인 자리입니다. Unreleased는 다음 공개에 넣을 변화를 모아 두는 문서 상단의 절입니다."
      note="run-1842, v1.4.0, 2026-04-16은 실제 사건이 아니라 본문의 설명용 값입니다. (가정)"
      ariaLabel="구현, 검사, 병합, 배포 단계에서 운영 코드와 Changelog 항목 위치의 변화"
      scenes={SCENES}
      render={(active) => {
        const released = active === 3;
        const entryWritten = active >= 1;
        return (
          <div className="grid gap-3">
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STAGES.map((stage, index) => (
                <li
                  key={stage}
                  className={`rounded-lg border px-2 py-1.5 text-center text-xs ${
                    index === active ? "border-primary bg-primary/10 font-bold" : index < active ? "border-border text-foreground" : "border-dashed border-border text-muted-foreground"
                  }`}
                >
                  <span className="mr-1 font-mono">{index + 1}</span>
                  {stage}
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm">
              <span className="font-semibold">운영 환경이 쓰는 코드</span>
              <span className={`font-mono text-xs ${released ? "font-bold text-blue-700 dark:text-blue-400" : "text-red-700 dark:text-red-400"}`}>
                {released ? "v1.4.0 (수정 반영)" : "예전 코드 (오류 그대로)"}
              </span>
            </div>
            <div className="rounded-lg border border-border px-3 py-3 font-mono text-xs leading-5">
              <p className="font-bold">CHANGELOG</p>
              <div className="mt-2 border-l-2 border-amber-600 pl-3">
                <p className="font-bold">## [Unreleased]</p>
                <p className="text-muted-foreground">### Fixed</p>
                <p className={`min-h-[2.5rem] break-keep [overflow-wrap:anywhere] ${entryWritten && !released ? "text-foreground" : "text-muted-foreground/60"}`}>
                  {entryWritten && !released ? `- ${ENTRY}` : "(이 항목 없음)"}
                </p>
              </div>
              <div className={`mt-2 border-l-2 pl-3 ${released ? "border-blue-600" : "border-dashed border-border"}`}>
                <p className={released ? "font-bold" : "text-muted-foreground/60"}>{released ? "## v1.4.0 — 2026-04-16" : "## 날짜가 있는 버전 절 (아직 없음)"}</p>
                <p className="text-muted-foreground">{released ? "### Fixed" : " "}</p>
                <p className={`min-h-[2.5rem] break-keep [overflow-wrap:anywhere] ${released ? "text-foreground" : "text-muted-foreground/60"}`}>{released ? `- ${ENTRY}` : " "}</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
