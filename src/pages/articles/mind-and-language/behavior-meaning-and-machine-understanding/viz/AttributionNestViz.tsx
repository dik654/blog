import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 이해를 어느 수준에 귀속할지. 설의 논증과 대표 반론이 그리는 테두리.
 * 어느 테두리가 옳은지는 정하지 않는다.
 */
const SCENES = [
  { label: "설이 가리키는 곳", summary: "작업자", level: 0, note: "중국어를 모르는 사람이 영어 규칙에 따라 기호를 조작해 밖에서는 자연스러운 답을 만듭니다. 설은 구문 규칙을 실행하는 사실만으로 의미 이해가 충분히 생기지 않는다고 주장합니다. 구문은 기호의 모양과 배열을 바꾸는 규칙입니다." },
  { label: "시스템 전체를 보자는 반론", summary: "규칙 · 기억 · 입출력까지", level: 1, note: "대표 반론은 방 안 사람 하나가 아니라 규칙·기억·입출력을 합친 시스템 전체가 이해한다고 봅니다." },
  { label: "세계와 연결하자는 반론", summary: "몸과 센서까지", level: 2, note: "몸과 센서로 세계에 연결되면 고정 규칙실과 다르다는 반론입니다." },
  { label: "학습을 넣자는 반론", summary: "학습 과정까지", level: 3, note: "학습 과정이 포함되면 고정 규칙실과 다르다는 별도의 반론입니다. 사고실험은 이 답들을 자동으로 끝내지 않고 이해를 어느 수준에 귀속할지 묻게 합니다." },
] as const;

function ring(on: boolean) {
  return on ? "border-primary bg-primary/5" : "border-border/60";
}

export default function AttributionNestViz() {
  return (
    <SceneShell
      eyebrow="이해의 주인을 찾는 테두리"
      title="논쟁은 어느 테두리에 ‘이해’를 붙일지를 두고 갈립니다"
      description="안쪽 테두리는 바깥 테두리의 일부입니다. 진한 테두리는 그 입장이 이해를 묻는 범위이며, 어느 입장이 옳은지를 표시하지 않습니다."
      ariaLabel="작업자, 시스템, 세계 연결, 학습 과정의 포함 관계"
      scenes={SCENES}
      render={(active) => {
        const { level } = SCENES[active];
        return (
          <div className={`rounded-xl border p-2 sm:p-3 ${ring(level >= 2)}`}>
            <div className="mb-2 grid grid-cols-2 gap-2 text-center text-xs font-semibold leading-5">
              <span className={`rounded border px-1 py-1 ${level === 2 ? "border-primary text-primary" : "border-border/60 text-muted-foreground"} ${level === 3 ? "invisible" : ""}`}>몸과 센서 · 세계 연결</span>
              <span className={`rounded border px-1 py-1 ${level === 3 ? "border-primary text-primary" : "border-border/60 text-muted-foreground"} ${level === 2 ? "invisible" : ""}`}>학습 과정</span>
            </div>
            <div className={`rounded-lg border p-2 sm:p-3 ${ring(level === 1)}`}>
              <div className="mb-2 grid grid-cols-3 gap-1 text-center text-xs font-semibold leading-5 text-muted-foreground">
                <span>규칙</span><span>기억</span><span>입출력</span>
              </div>
              <div className={`rounded-lg border px-2 py-3 text-center text-sm font-bold ${ring(level === 0)}`}>
                작업자
                <span className="mt-1 block text-xs font-normal leading-5 text-muted-foreground">중국어를 모른 채 기호 조작</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
