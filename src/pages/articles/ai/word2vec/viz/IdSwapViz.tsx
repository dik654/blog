import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release-check — 번호표만 맞바꾸면 크기 검사는 통과하지만 다른 행을 읽는다.
 * 원래 cat=2, saw=3: W[2]·U[3] = 2. 번호만 교환 cat=3, saw=2: W[3]·U[2] = [0,1,1]·[2,0,1] = 1.
 * 두 표의 행도 함께 교환: W[3]=[1,2,0], U[2]=[0,1,2] → 2.
 */
const ORIGINAL_W = { 2: "[1, 2, 0]", 3: "[0, 1, 1]" } as const;
const ORIGINAL_U = { 2: "[2, 0, 1]", 3: "[0, 1, 2]" } as const;
const MOVED_W = { 2: "[0, 1, 1]", 3: "[1, 2, 0]" } as const;
const MOVED_U = { 2: "[0, 1, 2]", 3: "[2, 0, 1]" } as const;

const SCENES = [
  { label: "처음: 번호표와 표가 맞습니다", summary: "cat→saw = 2", cat: 2, saw: 3, w: ORIGINAL_W, u: ORIGINAL_U, math: "[1, 2, 0] · [0, 1, 2] = 2", check: "cat → [1, 2, 0]", note: "cat은 번호 2라 W[2]를, saw는 번호 3이라 U[3]을 읽습니다. 3절에서 계산한 점수 2입니다." },
  { label: "번호만 맞바꾸면", summary: "cat→saw = 1", cat: 3, saw: 2, w: ORIGINAL_W, u: ORIGINAL_U, math: "[0, 1, 1] · [2, 0, 1] = 1", check: "cat → [0, 1, 1]", note: "cat의 새 번호 3은 W[3] = [0, 1, 1]을 읽습니다. 표의 크기는 여전히 5×3이라 크기 검사만으로는 이 오류를 잡지 못합니다." },
  { label: "두 표의 행도 함께 옮기면", summary: "cat→saw = 2", cat: 3, saw: 2, w: MOVED_W, u: MOVED_U, math: "[1, 2, 0] · [0, 1, 2] = 2", check: "cat → [1, 2, 0]", note: "번호를 바꿀 때는 입력과 출력의 두 표에서도 해당 행을 함께 옮겨야 합니다. 번호는 달라졌어도 같은 값을 읽어 점수가 2로 돌아옵니다." },
] as const;

function Mini({ title, rows, picked }: { title: string; rows: Readonly<Record<2 | 3, string>>; picked: 2 | 3 }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{title}</p>
      {([2, 3] as const).map((id) => {
        const on = id === picked;
        return (
          <div key={id} className="mb-0.5 flex items-center justify-between rounded-sm border px-1.5 py-1.5 font-mono text-xs" style={{ borderColor: on ? "#2563eb" : "#94a3b8", backgroundColor: on ? "#2563eb22" : "transparent", fontWeight: on ? 700 : 400 }}>
            <span>{id}행</span>
            <span>{rows[id]}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function IdSwapViz() {
  return (
    <SceneShell
      eyebrow="번호표와 표의 짝"
      title="번호만 바꾸면 크기는 맞아도 다른 행을 읽습니다"
      description="cat을 입력, saw를 대상으로 둔 한 쌍을 따라갑니다. 나머지 세 행은 그대로라 2행과 3행만 그렸습니다."
      note="표의 값은 3절의 가정입니다."
      ariaLabel="번호표만 바꿨을 때와 표의 행까지 옮겼을 때 읽는 행과 점수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <p className="mb-3 font-mono text-xs sm:text-sm">
              <span className="text-muted-foreground">번호표 </span>
              <span className="font-bold">cat = {scene.cat} · saw = {scene.saw}</span>
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <Mini title="W · 입력 역할" rows={scene.w} picked={scene.cat} />
              <Mini title="U · 대상 역할" rows={scene.u} picked={scene.saw} />
            </div>
            <dl className="mt-3 space-y-1 font-mono text-xs sm:text-sm">
              <div className="flex flex-wrap justify-between gap-x-3"><dt className="text-muted-foreground">표 크기 검사</dt><dd className="font-bold">5×3 통과</dd></div>
              <div className="flex flex-wrap justify-between gap-x-3"><dt className="text-muted-foreground">cat이 읽은 값</dt><dd className="font-bold">{scene.check}</dd></div>
              <div className="flex flex-wrap justify-between gap-x-3"><dt className="text-muted-foreground">점수</dt><dd className="font-bold">{scene.math}</dd></div>
            </dl>
          </div>
        );
      }}
    />
  );
}
