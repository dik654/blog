import SceneShell from "./SceneShell";

/**
 * 본문 대응: #diagnose — mount 아래에 가려진 파일. 크기는 본문이 정하지 않아 숫자를 쓰지 않는다.
 * 루트 파일시스템의 /var/log 칸 위에 별도 디스크가 덮이는 모습과, bind mount로 그 아래를 보는 경로를 그린다.
 */
const STATES = [
  { covered: false, bind: false, du: "옛 파일까지 셈", df: "옛 파일까지 셈", lsof: "아무것도 안 나옴" },
  { covered: true, bind: false, du: "옛 파일을 못 봄", df: "옛 파일까지 셈", lsof: "아무것도 안 나옴" },
  { covered: true, bind: true, du: "bind 경로에서 옛 파일을 셈", df: "옛 파일까지 셈", lsof: "아무것도 안 나옴" },
];

const SCENES = [
  { label: "mount 전", summary: "du와 df가 같은 파일을 셈", note: "(가정) /var/log는 아직 루트 파일시스템의 디렉터리입니다. 여기에 쌓인 옛 파일은 du에도 df에도 잡힙니다." },
  { label: "별도 디스크를 mount", summary: "du에서 사라지고 블록은 남음", note: "옛 파일은 mount에 가려 du가 보지 못하지만 루트 파일시스템의 블록은 차지합니다. lsof +L1은 링크 수가 1보다 작은 열린 파일만 보여 주므로 여기에도 나오지 않습니다." },
  { label: "다른 경로에 bind mount", summary: "가려진 아래를 직접 셈", note: "같은 파일시스템을 다른 경로에도 붙이는 것이 bind mount입니다. 그 경로의 /var/log 아래에는 별도 디스크가 아니라 원래 내용이 보입니다. 거기서 직접 세어 차이의 정체를 확인합니다." },
];

export default function MountHiddenViz() {
  return (
    <SceneShell
      eyebrow="가려진 파일"
      title="mount가 덮은 파일은 du에서 사라지지만 블록은 남습니다"
      description="큰 상자가 루트 파일시스템이고 그 안의 칸이 원래 /var/log입니다. 파란 상자가 그 위에 덮이는 별도 디스크입니다."
      note="옛 파일의 크기는 정하지 않았습니다. 상자 크기는 용량을 나타내지 않습니다."
      ariaLabel="mount에 가려진 파일과 du, df, lsof의 결과"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        return (
          <div className="min-w-0">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div className="min-w-0 rounded-md border px-3 py-2" style={{ borderColor: "#64748b" }}>
                <p className="text-[11px] font-bold">루트 파일시스템 /</p>
                <div className="relative mt-2 h-20 rounded-sm border border-border p-2">
                  <p className="font-mono text-[11px] text-muted-foreground">/var/log 원래 내용</p>
                  <div className="mt-1.5 inline-block rounded-sm px-2 py-1 text-xs font-semibold text-white" style={{ backgroundColor: "#dc2626" }}>옛 파일</div>
                  {state.covered ? (
                    <div className="absolute inset-0 flex flex-col justify-center rounded-sm border bg-background px-2 text-xs" style={{ borderColor: "#2563eb" }}>
                      <span className="font-bold" style={{ color: "#2563eb" }}>별도 디스크</span>
                      <span className="font-mono text-[11px] text-muted-foreground">/var/log로 mount됨</span>
                      <span className="text-[11px] text-muted-foreground">옛 파일은 이 아래에 가려짐</span>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className={`min-w-0 rounded-md border border-dashed px-3 py-2 ${state.bind ? "" : "opacity-40"}`} style={{ borderColor: "#16a34a" }}>
                <p className="text-[11px] font-bold">{state.bind ? "bind mount한 경로" : "bind mount 전"}</p>
                <p className="mt-2 break-all font-mono text-[11px] text-muted-foreground">{state.bind ? "<다른 경로>/var/log" : "아직 없음"}</p>
                {state.bind ? <div className="mt-1.5 inline-block rounded-sm px-2 py-1 text-xs font-semibold text-white" style={{ backgroundColor: "#dc2626" }}>옛 파일</div> : null}
              </div>
            </div>
            <dl className="mt-3 space-y-1 text-xs">
              <div className="flex flex-wrap justify-between gap-x-3"><dt className="text-muted-foreground">du</dt><dd className="font-bold">{state.du}</dd></div>
              <div className="flex flex-wrap justify-between gap-x-3"><dt className="text-muted-foreground">루트의 df Used</dt><dd className="font-bold">{state.df}</dd></div>
              <div className="flex flex-wrap justify-between gap-x-3"><dt className="text-muted-foreground">lsof +L1</dt><dd className="font-bold">{state.lsof}</dd></div>
            </dl>
          </div>
        );
      }}
    />
  );
}
