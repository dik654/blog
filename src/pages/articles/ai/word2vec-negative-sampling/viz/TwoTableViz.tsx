import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 가정한 두 표. 입력 saw [0,1,1]과 대상 cat [2,0,1], red [1,0,1], dog [1,1,0]의 내적은 모두 1.
 * 읽은 줄은 입력 1 + 대상 3 = 4개, 점수 계산은 3번.
 */
const WORDS = ["문장 끝", "red", "cat", "saw", "dog"];
const INPUT = [[0, 0, 0], [1, 0, 0], [1, 2, 0], [0, 1, 1], [0, 0, 1]];
const OUTPUT = [[0, 0, 0], [1, 0, 1], [2, 0, 1], [0, 1, 2], [1, 1, 0]];
const SAW = 3;

const SCENES = [
  { label: "saw × cat", summary: "0×2 + 1×0 + 1×1 = 1", note: "입력 표에서 saw 줄을, 대상 표에서 cat 줄을 읽어 같은 자리끼리 곱해 더합니다. 문장에서 직접 관찰한 짝이라 표시는 1입니다.", targets: [2], tag: "표시 1" },
  { label: "saw × red", summary: "0×1 + 1×0 + 1×1 = 1", note: "입력 줄은 그대로 두고 대상 줄만 red로 바꿉니다. 추첨에서 왔으므로 표시는 0입니다. red가 문장에 없다는 뜻이 아닙니다.", targets: [1], tag: "표시 0" },
  { label: "saw × dog", summary: "0×1 + 1×1 + 1×0 = 1", note: "dog 줄과 비교해도 점수는 1입니다. 추첨에서 왔으므로 표시는 0입니다.", targets: [4], tag: "표시 0" },
  { label: "읽은 줄 세기", summary: "줄 4개 · 점수 3번", note: "입력에서 saw 한 줄, 대상에서 cat·red·dog 세 줄입니다. 같은 saw 값을 세 번 곱셈에 써도 입력 줄이 세 개가 되지는 않습니다. 표는 앞 글과 같은 가정값입니다.", targets: [2, 1, 4], tag: "" },
] as const;

function Table({ title, rows, on }: { title: string; rows: number[][]; on: readonly number[] }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{title}</p>
      <div className="space-y-1">
        {rows.map((row, index) => {
          const lit = on.includes(index);
          return (
            <div key={index} className="grid grid-cols-[2.75rem_repeat(3,minmax(0,1fr))] items-center gap-0.5 text-xs">
              <span className={`leading-4 break-keep ${lit ? "font-bold" : "text-muted-foreground/70"}`}>{WORDS[index]}</span>
              {row.map((value, column) => (
                <span key={column} className={`flex h-7 items-center justify-center rounded-sm border font-mono ${lit ? "border-primary bg-primary/10 font-bold" : "border-border/50 text-muted-foreground/60"}`}>
                  {value}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TwoTableViz() {
  return (
    <SceneShell
      eyebrow="가정한 두 표"
      title="입력 표의 한 줄을 대상 표의 세 줄과 차례로 곱합니다"
      description="한 단어도 입력 역할과 비교 대상 역할에 따라 다른 표의 줄을 읽습니다. 밝은 줄이 이번 계산에서 읽는 줄입니다."
      ariaLabel="입력 표의 saw 줄과 대상 표의 cat, red, dog 줄을 곱해 점수 1을 세 번 얻는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-6">
              <Table title="입력 역할" rows={INPUT} on={[SAW]} />
              <Table title="비교 대상 역할" rows={OUTPUT} on={scene.targets} />
            </div>
            <p className="min-h-5 text-right text-xs font-semibold text-primary">{scene.tag}</p>
          </div>
        );
      }}
    />
  );
}
