import SceneShell from "./SceneShell";

/**
 * 본문 대응: #indexing-1d — launch 직후 확인과 완료 대기 지점 확인의 시간 순서.
 * 장치 쪽 접근 오류의 발생 시점은 그림의 가정.
 */
const SCENES = [
  { label: "Launch", summary: "주 프로그램 → 장치", last: "cudaDevice\u200bSynchronize", note: "작업표를 장치에 제출합니다. 계산은 비동기로 진행되므로 다음 줄로 넘어왔다고 계산이 끝난 것은 아닙니다." },
  { label: "Launch 직후 확인", summary: "cudaGetLastError", last: "cudaDevice\u200bSynchronize", note: "잘못된 실행 설정 같은 오류를 확인하는 데 씁니다. 이 시점의 장치는 아직 계산 중일 수 있습니다." },
  { label: "계산 중 접근 오류", summary: "장치 쪽에서 발생", last: "cudaDevice\u200bSynchronize", note: "접근 오류가 이 시점에 났다고 놓습니다(가정). 이 가정에서는 앞서 부른 cudaGetLastError가 값을 돌려줄 때 아직 없던 오류입니다." },
  { label: "완료를 기다리는 지점", summary: "cudaDeviceSynchronize", last: "cudaDevice\u200bSynchronize", note: "비동기 계산 중의 접근 오류는 cudaDeviceSynchronize처럼 완료를 기다리는 지점에서도 확인해야 합니다." },
  { label: "뒤의 API에서 보일 때", summary: "오류가 나중 호출에 나타남", last: "뒤에 부른 다른 API", note: "앞선 비동기 오류가 뒤의 API에서 관측될 수 있습니다. 그 호출의 잘못으로 읽지 않도록 각 호출의 반환값과 실행 순서를 함께 기록합니다." },
] as const;

function rows(last: string) {
  return [
    { host: "launch 제출", hostSub: "block 수·block 크기를 보냄", device: "작업표를 받음", deviceSub: "", at: 0 },
    { host: "cuda\u200bGetLastError", hostSub: "잘못된 실행 설정 확인", device: "계산 진행", deviceSub: "비동기", at: 1 },
    { host: "다음 코드", hostSub: "계속 진행(가정)", device: "접근 오류 발생", deviceSub: "(가정)", at: 2 },
    { host: last, hostSub: "여기서 앞선 오류가 보일 수 있음", device: "", deviceSub: "", at: 3 },
  ];
}

export default function AsyncErrorViz() {
  return (
    <SceneShell
      eyebrow="오류를 보는 시점"
      title="계산 중 오류는 launch 직후뿐 아니라 완료를 기다리는 지점에서도 확인합니다"
      description="위에서 아래로 시간이 흐릅니다. 왼쪽은 주 프로그램, 오른쪽은 장치이며 아직 오지 않은 시점은 흐리게 둡니다."
      ariaLabel="launch, 오류 확인, 비동기 접근 오류, 완료 대기의 시간 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const reached = Math.min(active, 3);
        const list = rows(scene.last);
        return (
          <div>
            <div className="grid grid-cols-2 gap-2 pb-1 text-xs font-semibold text-muted-foreground">
              <span>주 프로그램</span>
              <span>장치</span>
            </div>
            <div className="space-y-2">
              {list.map((row) => {
                const on = row.at <= reached;
                const current = row.at === reached;
                const isError = row.at === 2;
                return (
                  <div key={row.at} className={`grid grid-cols-2 gap-2 ${on ? "" : "opacity-30"}`}>
                    <div className={`min-w-0 rounded-lg border px-2 py-2 ${current && !isError ? "border-primary" : "border-border/70"}`}>
                      <strong className="block break-words text-xs leading-5">{row.host}</strong>
                      <span className="block text-xs leading-5 text-muted-foreground">{row.hostSub}</span>
                    </div>
                    <div className={`min-w-0 rounded-lg border px-2 py-2 ${row.device ? (isError && on ? "border-red-600" : "border-border/70") : "border-transparent"}`}>
                      <strong className={`block text-xs leading-5 ${isError && on ? "text-red-700 dark:text-red-400" : ""}`}>{row.device}</strong>
                      <span className="block text-xs leading-5 text-muted-foreground">{row.deviceSub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
