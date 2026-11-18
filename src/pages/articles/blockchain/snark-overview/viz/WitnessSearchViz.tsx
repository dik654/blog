import SceneShell from "./SceneShell";

/**
 * 본문 대응: #security — (3,12)에 정상 증인 4, (3,12)에 잘못 넣은 5, 증인이 없는 (0,1)을 구별한다.
 * 관계 xw = y (17로 나눈 나머지). w = 0..16 전부의 x·w를 칸으로 늘어놓는다.
 * 3w mod 17에서 12가 되는 칸은 w=4 하나, 3×5=15. 0·w는 언제나 0이라 1이 되는 칸이 없다.
 */
const P = 17;
const WS = Array.from({ length: P }, (_, w) => w);

const SCENES = [
  {
    label: "(3,12)에 4를 넣음",
    summary: "3×4 = 12 · 통과해야 함",
    x: 3,
    y: 12,
    tried: 4,
    verdict: 0,
    note: "완전성은 정상 증인으로 만든 증거가 통과해야 한다는 요구입니다. 17개 후보 가운데 3×w가 12가 되는 칸은 4 하나이고, 그 4로 만든 증거는 통과해야 합니다.",
  },
  {
    label: "(3,12)에 5를 넣음",
    summary: "3×5 = 15 ≠ 12 · 명제는 여전히 참",
    x: 3,
    y: 12,
    tried: 5,
    verdict: 1,
    note: "5는 등식을 만족하지 못하는 잘못된 입력입니다. 그래도 같은 줄에 증인 4가 있으므로 공개 명제 (3,12)는 참입니다. 증명 생성 쪽이 입력을 거절하는 일이고, 거짓 명제에 관한 보안 정의와는 다른 문제입니다.",
  },
  {
    label: "(0,1)",
    summary: "17칸 모두 0 · 증인 없음",
    x: 0,
    y: 1,
    tried: null,
    verdict: 2,
    note: "0에 무엇을 곱해도 0이라 1이 되는 칸이 하나도 없습니다. 증인이 없는 거짓 명제입니다. 건전성은 공격자가 이런 명제를 통과시키기 어려워야 한다는 요구입니다.",
  },
] as const;

const VERDICTS = [
  { title: "완전성", body: "정상 증인 증거는 통과" },
  { title: "입력 오류", body: "참 명제 · 잘못된 값" },
  { title: "건전성", body: "증인 없으면 통과 어려움" },
] as const;

export default function WitnessSearchViz() {
  return (
    <SceneShell
      eyebrow="증인이 있는가"
      title="17개 후보 중 등식을 맞추는 칸이 있는지가 명제의 참·거짓을 가릅니다"
      description="칸 하나가 넣어 볼 수 있는 값 w입니다. 위는 w, 아래는 공개값 x와 곱해 17로 나눈 나머지입니다. 아래 값이 공개값 y와 같은 칸이 증인입니다(숫자는 설명용 가정)."
      ariaLabel="공개 명제 (3,12)와 (0,1)에서 0부터 16까지의 후보 w에 대한 x 곱하기 w의 나머지, 정상 증인 4와 잘못된 입력 5, 증인이 없는 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const tried: number | null = scene.tried;
        return (
          <div className="min-w-0">
            <p className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span>공개 명제 (x, y) = <span className="font-mono font-bold">({scene.x}, {scene.y})</span></span>
              <span>찾는 것: <span className="font-mono font-bold">{scene.x}×w = {scene.y}</span></span>
            </p>
            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9">
              {WS.map((w) => {
                const product = (scene.x * w) % P;
                const hit = product === scene.y;
                const isTried = tried === w;
                const style = isTried && !hit
                  ? "border-dashed border-red-600"
                  : hit
                    ? "border-green-600 bg-green-600/10"
                    : "border-border bg-background";
                return (
                  <div key={w} className={`rounded-lg border px-1 py-1.5 text-center font-mono leading-5 ${style}`}>
                    <span className="block text-xs text-muted-foreground">w={w}</span>
                    <span className={`block text-sm font-bold ${hit ? "text-green-700 dark:text-green-400" : isTried ? "text-red-700 dark:text-red-400" : ""}`}>{product}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {VERDICTS.map((verdict, index) => (
                <div
                  key={verdict.title}
                  className={`rounded-lg border px-2 py-2 text-center text-xs leading-5 ${index === scene.verdict ? "border-primary bg-primary/10" : "border-border/60 text-muted-foreground"}`}
                >
                  <span className={`block font-semibold ${index === scene.verdict ? "text-primary" : ""}`}>{verdict.title}</span>
                  <span className="block">{verdict.body}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
