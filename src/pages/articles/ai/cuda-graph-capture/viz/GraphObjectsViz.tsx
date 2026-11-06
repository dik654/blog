import SceneShell from "./SceneShell";

/**
 * 본문 대응: #graph-anatomy — 정의(cudaGraph_t)와 실행 객체(cudaGraphExec_t), keep_graph에 따른 실행 준비 시점.
 * 마지막 장면의 "정의 변경"은 본문의 "원래 정의를 나중에 바꾼 경우"를 그린 것이다.
 */
const SCENES = [
  { label: "keep_graph=False · 기본", summary: "캡처를 마칠 때 준비", def: "원래 정의를 남기지 않음", defOn: false, step: "캡처 종료 때 실행 준비", exec: "준비 완료", execOn: true, note: "PyTorch 2.14의 기본값에서는 캡처를 마칠 때 실행 준비까지 합니다. 재생은 준비된 실행 객체를 씁니다. 네 번의 계산과 매회 graph 제출은 여전히 필요합니다." },
  { label: "keep_graph=True", summary: "명시적 준비 또는 첫 재생", def: "원래 정의를 남김", defOn: true, step: "명시적으로 준비하거나 첫 재생에서 준비", exec: "아직 없음", execOn: false, note: "원래 정의를 남겨 두면 캡처 종료 때는 실행 객체를 준비하지 않습니다. 명시적으로 준비하거나 첫 재생에서 준비합니다." },
  { label: "정의를 나중에 바꾼 경우", summary: "다시 준비해야 반영", def: "바꾼 정의", defOn: true, step: "다시 준비해야 변경이 반영됨", exec: "바꾸기 전의 내용", execOn: true, note: "정의만 바꿔서는 이미 준비한 실행 객체에 들어가지 않습니다. 다시 준비해야 변경이 반영된다는 조건이 원문에 있습니다." },
] as const;

export default function GraphObjectsViz() {
  return (
    <SceneShell
      eyebrow="두 객체"
      title="정의와 실행 객체는 준비 단계를 사이에 두고 따로 있습니다"
      description="cudaGraph_t는 node(할 일)와 edge(의존 관계)로 적은 정의이고, cudaGraphExec_t는 그 정의를 반복 실행하도록 준비한 객체입니다."
      ariaLabel="cudaGraph_t, 실행 준비, cudaGraphExec_t의 관계"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const box = (on: boolean) => `min-w-0 rounded-md border px-2 py-2 text-xs leading-5 ${on ? "border-primary bg-background" : "border-dashed border-border text-muted-foreground"}`;
        return (
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)] sm:items-stretch">
            <div className={box(scene.defOn)}>
              <p className="font-mono font-bold">cudaGraph_t</p>
              <p>{scene.def}</p>
            </div>
            <div className="min-w-0 rounded-md bg-muted/50 px-2 py-2 text-center text-xs font-semibold leading-5">
              <span aria-hidden="true" className="sm:hidden">↓ </span>
              {scene.step}
              <span aria-hidden="true" className="hidden sm:inline"> →</span>
            </div>
            <div className={box(scene.execOn)}>
              <p className="font-mono font-bold">cudaGraphExec_t</p>
              <p>{scene.exec}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
