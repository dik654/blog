import SceneShell from "./SceneShell";

/**
 * 본문 대응: #research(Foundry) — 새 프로세스에서 입력 5의 답 30을 기대하려면 갖춰야 하는 것.
 * 연결 목록만으로는 재생을 보장할 수 없고, 주소 확보·값 준비·실행 코드 복원이 더해져야 한다.
 */
const ITEMS = [
  { name: "네 작업의 연결", detail: "+1 → ×2 → +3 → ×2" },
  { name: "기록된 A의 주소 공간", detail: "다시 확보" },
  { name: "그 주소의 입력 5", detail: "새 프로세스에서 준비" },
  { name: "네 작업의 실행 코드", detail: "kernel 바이너리 복원" },
] as const;

const SCENES = [
  { label: "연결 목록만 옮김", summary: "재생 보장 없음", ready: 1, result: "?", note: "네 작업의 연결만 저장해도 새 실행에서 A의 주소와 kernel 함수가 살아 있다는 보장은 없습니다. 연결 목록만 복사한 것으로 재생을 보장할 수 없습니다." },
  { label: "A의 주소 공간 확보", summary: "자리는 생김", ready: 2, result: "?", note: "기록에 적힌 A의 주소 공간을 다시 확보합니다. 주소 확보를 보장하지 못하면 재생을 보장할 수 없습니다. 자리만 있고 값은 아직 없습니다." },
  { label: "그 주소에 5 준비", summary: "값도 준비됨", ready: 3, result: "?", note: "확보한 주소에 입력 5를 넣습니다. 아직 네 작업을 돌릴 실행 코드가 없습니다." },
  { label: "실행 코드 복원", summary: "답 30을 기대", ready: 4, result: "30", note: "이 조건을 모두 만족시키면 같은 연산의 답 30을 기대할 수 있습니다. 이 그림은 우리 사례에 조건을 옮긴 설명이며, Foundry를 실행해 본 결과가 아닙니다." },
] as const;

export default function RestoreChecklistViz() {
  return (
    <SceneShell
      eyebrow="새 프로세스"
      title="새 프로세스에서는 연결 목록 말고도 세 가지를 되살려야 합니다"
      description="Foundry 논문의 재시작 문제를 이 글의 네 작업에 옮겨 그렸습니다. 칸이 위에서부터 하나씩 갖춰지는 순서는 설명을 위한 것입니다(가정)."
      ariaLabel="새 프로세스에서 재생에 필요한 네 조건이 갖춰지는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <ol className="space-y-1.5">
              {ITEMS.map((item, index) => {
                const done = index < scene.ready;
                return (
                  <li key={item.name} className={`grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-2 rounded-md border px-2 py-1.5 text-xs leading-5 ${done ? "border-primary bg-background" : "border-dashed border-border text-muted-foreground"}`}>
                    <span className="font-mono font-bold">{done ? "있음" : "없음"}</span>
                    <span className="min-w-0"><span className="font-semibold">{item.name}</span> · {item.detail}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-2 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs font-bold">입력 5의 재생 결과: {scene.result === "?" ? "보장할 수 없음" : `${scene.result} 기대`}</p>
          </div>
        );
      }}
    />
  );
}
