import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 둘을 다 켜도 남는 빈틈.
 * Claude Code 문서: 샌드박스는 셸 명령을 감싸고, 내장 파일 도구·훅·로컬 MCP 서버는 그 밖에서 돈다.
 * 허용한 패키지 저장소로 향하는 올리기도 같은 호스트(벽이 호스트 이름만 본다면 구별 못함).
 * 경계 밖 실행을 승인하면 그 실행에는 벽이 없어 심사 하나만 남는다.
 */

type Part = "wall" | "outside" | "registry" | "escalation";

const SCENES: readonly { label: string; summary: string; note: string; focus: Part }[] = [
  {
    label: "벽이 감싸는 범위",
    summary: "셸 명령은 벽 안",
    focus: "wall",
    note: "Claude Code 문서는 샌드박스가 셸 명령을 감싼다고 적습니다. 셸 명령이 폴더 밖에 쓰거나 목록 밖 호스트에 연결하면 실패하지만, 폴더 안의 rm -rf src는 벽이 허락합니다. 앞 표의 피해 0건은 벽에 삭제를 묻는 심사를 더했을 때 다섯 명령 안에서 센 숫자입니다.",
  },
  {
    label: "벽 밖에서 도는 부품",
    summary: "파일 도구·훅·MCP는 벽 밖",
    focus: "outside",
    note: "같은 문서는 내장 파일 도구, 훅, 로컬 MCP 서버가 샌드박스 밖에서 돈다고 적습니다. 셸만 막았다고 에이전트 전체를 막은 것이 아닙니다.",
  },
  {
    label: "허용한 목적지",
    summary: "내려받기와 올리기가 같은 호스트",
    focus: "registry",
    note: "패키지 저장소를 열어 두면 그곳으로 올리는 전송도 같은 호스트로 향합니다. 벽이 호스트 이름만 본다면 내려받기와 올리기를 구별하지 못합니다.",
  },
  {
    label: "경계 밖 실행 승인",
    summary: "그 실행에는 벽 없음 · 심사만",
    focus: "escalation",
    note: "경계 밖 실행 요청(escalation)은 벽 안에서 실패한 명령을 벽 밖에서 다시 돌려도 되는지 묻는 절차입니다. 승인하는 순간 그 실행에는 벽이 없으므로 실행 전 심사 하나만 남습니다.",
  },
];

const OUTSIDE_PARTS = ["내장 파일 도구", "훅", "로컬 MCP 서버"] as const;

function dim(on: boolean) {
  return on ? "opacity-100" : "opacity-40";
}

export default function WallGapsViz() {
  return (
    <SceneShell
      eyebrow="둘을 다 켜도 남는 빈틈"
      title="벽을 켜도 셸 밖의 부품, 허용한 목적지, 승인한 실행이 빈틈으로 남습니다"
      description="점선 상자가 실행 중 벽(샌드박스)입니다. 벽 안팎의 구성은 9절이 인용한 Claude Code 문서 기준이며, 패키지 저장소와 ~/.bashrc 명령은 이 글의 사례입니다."
      ariaLabel="샌드박스가 감싸는 범위와 그 밖에 남는 부품, 허용 목적지, 승인된 경계 밖 실행"
      scenes={SCENES}
      render={(active) => {
        const focus = SCENES[active].focus;
        return (
          <div className="grid min-w-0 gap-3 text-xs sm:text-sm md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="min-w-0 rounded-lg border border-border p-3">
              <p className="font-bold">내 컴퓨터</p>
              <div
                className={`mt-2 rounded-lg border border-dashed p-3 transition-opacity motion-reduce:transition-none ${
                  focus === "wall" ? "border-primary" : "border-border"
                } ${dim(focus === "wall")}`}
              >
                <p className="font-bold text-primary">실행 중 벽(샌드박스)</p>
                <div className="mt-2 rounded-md border border-border px-2 py-1.5">
                  <span className="block font-semibold">셸 명령</span>
                  <span className="block font-mono text-muted-foreground">rg · sed · npm test …</span>
                </div>
                <p className="mt-2 leading-5 text-muted-foreground">폴더 밖 쓰기 → 실패 · 목록 밖 연결 → 실패</p>
              </div>
              <p className="mt-3 text-muted-foreground">벽 밖</p>
              <div className={`mt-1.5 grid grid-cols-3 gap-1.5 transition-opacity motion-reduce:transition-none ${dim(focus === "outside")}`}>
                {OUTSIDE_PARTS.map((part) => (
                  <div
                    key={part}
                    className={`min-w-0 break-keep rounded-md border px-1.5 py-1.5 text-center leading-5 ${
                      focus === "outside" ? "border-amber-600 font-semibold" : "border-border"
                    }`}
                  >
                    {part}
                  </div>
                ))}
              </div>
              <div
                className={`mt-1.5 rounded-md border px-2 py-1.5 transition-opacity motion-reduce:transition-none ${
                  focus === "escalation" ? "border-amber-600" : "border-border"
                } ${dim(focus === "escalation")}`}
              >
                <span className="block font-semibold">승인된 경계 밖 실행</span>
                <span className="block text-muted-foreground">
                  <code className="font-mono">~/.bashrc</code> 쓰기를 벽 없이 다시 실행 → 막는 것은 실행 전 심사뿐
                </span>
              </div>
            </div>
            <div className={`min-w-0 rounded-lg border border-border p-3 ${focus === "registry" ? "max-md:order-first" : ""}`}>
              <p className="font-bold">외부 네트워크</p>
              <div
                className={`mt-2 rounded-md border px-2 py-1.5 transition-opacity motion-reduce:transition-none ${
                  focus === "registry" ? "border-amber-600" : "border-border"
                } ${dim(focus === "registry" || focus === "wall")}`}
              >
                <span className="block font-semibold">허용한 패키지 저장소</span>
                <span className="mt-1 block font-mono">내려받기 → 통과</span>
                <span className="block font-mono">올리기 → 같은 호스트로</span>
                <span className="mt-1 block leading-5 text-muted-foreground">벽이 호스트 이름만 본다면 둘을 구별 못함</span>
              </div>
              <div className={`mt-2 rounded-md border border-border px-2 py-1.5 transition-opacity motion-reduce:transition-none ${dim(focus === "wall")}`}>
                <span className="block font-semibold">허용 목록 밖 호스트</span>
                <span className="mt-1 block font-mono">셸 명령의 연결 → 실패</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
