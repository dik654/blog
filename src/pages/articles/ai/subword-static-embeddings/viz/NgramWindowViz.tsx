import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — <run>을 세 글자 창으로 읽어 조각 주소 2, 2, 4를 얻고,
 * <runs>는 2, 2, 3, 0을 얻는다. 줄 값 (b, 1)과 줄 수 8은 글의 계산용 가정이다.
 */
interface Piece {
  text: string;
  bucket: number;
}

const RUN_PIECES: readonly Piece[] = [
  { text: "<ru", bucket: 2 },
  { text: "run", bucket: 2 },
  { text: "un>", bucket: 4 },
];
const RUNS_PIECES: readonly Piece[] = [
  { text: "<ru", bucket: 2 },
  { text: "run", bucket: 2 },
  { text: "uns", bucket: 3 },
  { text: "ns>", bucket: 0 },
];

const SCENES = [
  { label: "시작·끝 표시", summary: "run → <run>", note: "단어 양쪽에 시작 표시 <와 끝 표시 >를 붙입니다. 세 글자 창은 이 다섯 칸 위를 왼쪽부터 한 칸씩 움직입니다.", chars: "<run>", win: null, read: [] as readonly Piece[] },
  { label: "첫째 창", summary: "<ru → 2번 줄", note: "첫 창의 조각 <ru는 주소 계산을 거쳐 2번 줄을 가리킵니다. 그 줄의 값 (2, 1)이 첫 기여가 됩니다.", chars: "<run>", win: 0, read: RUN_PIECES.slice(0, 1) },
  { label: "둘째 창", summary: "run → 또 2번 줄", note: "조각 run은 <ru와 철자가 다른데 같은 2번 줄을 가리킵니다. 줄이 여덟 개뿐이라 생길 수 있는 겹침입니다. 단어 run의 전용 줄 (8, 0)은 이 표 밖에 있습니다.", chars: "<run>", win: 1, read: RUN_PIECES.slice(0, 2) },
  { label: "셋째 창", summary: "un> → 4번 줄", note: "창이 끝 표시에 닿으면 끝납니다. 조각 셋이 2번, 2번, 4번을 읽었고, 2번 칸의 ×2가 같은 줄을 두 번 읽었다는 표시입니다.", chars: "<run>", win: 2, read: RUN_PIECES },
  { label: "runs의 조각", summary: "2번, 2번, 3번, 0번", note: "<runs>는 여섯 칸이라 창이 네 번 멈춥니다. 앞의 두 조각은 run 때와 같은 줄을 읽고, uns와 ns>는 3번과 0번을 읽습니다.", chars: "<runs>", win: null, read: RUNS_PIECES },
] as const;

export default function NgramWindowViz() {
  return (
    <SceneShell
      eyebrow="세 글자 창"
      title="창을 한 칸씩 밀면 조각마다 읽을 줄이 정해집니다"
      description="위 칸은 글자, 아래 여덟 칸은 조각용 줄입니다. 값 (b, 1)과 줄 수 8은 계산을 보이려는 가정입니다."
      ariaLabel="세 글자 창이 run과 runs를 읽으며 조각용 줄 번호를 정하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const chars = Array.from(scene.chars);
        return (
          <div className="min-w-0 space-y-4">
            <div className="flex justify-center gap-1.5">
              {chars.map((char, index) => {
                const inside = scene.win !== null && index >= scene.win && index < scene.win + 3;
                return (
                  <span key={index} className={`flex h-10 w-10 items-center justify-center rounded-md border font-mono text-base font-bold ${inside ? "border-blue-600 bg-blue-500/15" : "border-border bg-background"}`}>
                    {char}
                  </span>
                );
              })}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map((slot) => {
                const piece = scene.read[slot];
                return (
                  <div key={slot} className={`rounded-md border px-0.5 py-1.5 text-center font-mono text-[11px] sm:text-xs ${piece ? "border-border bg-background" : "border-dashed border-border/50 text-muted-foreground/50"}`}>
                    {piece ? `${piece.text}→${piece.bucket}번` : "−"}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((bucket) => {
                const hits = scene.read.filter((piece) => piece.bucket === bucket).length;
                return (
                  <div key={bucket} className={`rounded-md border px-1 py-1.5 text-center ${hits > 0 ? "border-blue-600 bg-blue-500/10" : "border-border/60"}`}>
                    <span className="block text-xs font-bold">{bucket}번</span>
                    <span className="block font-mono text-[11px] text-muted-foreground">({bucket},1)</span>
                    <span className={`block font-mono text-xs font-bold text-blue-700 dark:text-blue-400 ${hits > 0 ? "" : "invisible"}`}>×{hits}</span>
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
