import SceneShell from "./SceneShell";

/**
 * 본문 대응: #applications — 같은 g=3, mod 17에서 a=5, b=3(가정).
 * gᵃ=3⁵=5, gᵇ=3³=27→10, gᵃᵇ=5³=125→6 (=3¹⁵=6).
 * DLP를 풀어 a=5를 얻으면 (gᵇ)ᵃ=10⁵ mod 17 = 6으로 CDH의 답을 만든다.
 */
type Row = "dlp" | "cdh" | "ddh";

const ROWS: readonly { key: Row; name: string; full: string; inputs: string; output: string }[] = [
  { key: "dlp", name: "DLP", full: "이산로그", inputs: "gᵃ = 5", output: "a = 5" },
  { key: "cdh", name: "CDH", full: "계산 DH", inputs: "gᵃ = 5, gᵇ = 10", output: "gᵃᵇ = 6" },
  { key: "ddh", name: "DDH", full: "판정 DH", inputs: "5, 10, 제시값 6", output: "6이 gᵃᵇ인가 → 예" },
];

const SCENES = [
  { label: "공개 값 만들기", summary: "3⁵→5, 3³→10", focus: null, chain: false, note: "두 사람이 비밀 a=5, b=3을 골라(가정) 각각 3⁵ mod 17=5와 3³ mod 17=10을 공개합니다. 공유 값은 5³ mod 17=6이고 3¹⁵ mod 17=6과 같습니다." },
  { label: "DLP: 지수를 찾기", summary: "5 → a=5", focus: "dlp", chain: false, note: "이산로그 문제는 공개 값 gᵃ=5에서 숨은 반복 횟수 a를 찾습니다. 이 글 전체가 다룬 문제입니다." },
  { label: "CDH: 공유 값을 만들기", summary: "5, 10 → 6", focus: "cdh", chain: false, note: "계산 Diffie–Hellman 문제는 gᵃ와 gᵇ에서 gᵃᵇ를 계산합니다. 비밀 5나 3 자체를 돌려주지 않아도 6을 만들면 해결한 것입니다." },
  { label: "DDH: 맞는지 판정", summary: "5, 10, 6 → 예/아니오", focus: "ddh", chain: false, note: "판정 Diffie–Hellman 문제는 제시한 세 번째 값이 gᵃᵇ인지만 구분합니다. 값을 만들 필요 없이 6이 맞는지 답하면 됩니다." },
  { label: "한 방향으로만 이어짐", summary: "DLP 풀이 → CDH 풀이", focus: "cdh", chain: true, note: "DLP를 풀어 a=5를 얻으면 10⁵ mod 17=6으로 CDH의 답을 만듭니다. 반대로 CDH를 풀 수 있다고 DLP가 자동으로 풀리지는 않습니다." },
] as const;

export default function DhProblemsViz() {
  return (
    <SceneShell
      eyebrow="세 문제의 입출력"
      title="같은 공개 값 5와 10에서 묻는 것이 다릅니다"
      description="g=3, mod 17의 같은 작은 군입니다. 각 줄은 한 문제가 받는 값과 내놓아야 하는 값입니다. DH는 Diffie–Hellman의 줄임말입니다."
      ariaLabel="DLP, CDH, DDH가 같은 공개 값에서 각각 무엇을 받고 무엇을 내놓는지 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg border border-border bg-background px-2 py-2">
                <div className="text-muted-foreground">비밀 a=5 (가정)</div>
                <div className="mt-1 font-mono text-sm font-bold">gᵃ = 3⁵ → 5</div>
              </div>
              <div className="rounded-lg border border-border bg-background px-2 py-2">
                <div className="text-muted-foreground">비밀 b=3 (가정)</div>
                <div className="mt-1 font-mono text-sm font-bold">gᵇ = 3³ → 10</div>
              </div>
            </div>
            <div className={`rounded-lg border px-3 py-2 text-center font-mono text-xs sm:text-sm ${scene.chain ? "border-amber-600 font-semibold text-amber-800 dark:text-amber-300" : "border-dashed border-border/50 text-muted-foreground/60"}`}>
              {scene.chain ? "DLP로 a=5 → 10⁵ mod 17 = 6 = CDH 답 · 역방향은 자동 아님" : "DLP 답 → CDH 답으로 잇는 길 (5번째 장면)"}
            </div>
            <div className="space-y-2">
              {ROWS.map((row) => {
                const on = scene.focus === row.key || (scene.chain && row.key === "dlp");
                return (
                  <div
                    key={row.key}
                    className={`grid grid-cols-[3.75rem_minmax(0,1fr)] items-center gap-2 rounded-lg border px-2 py-2 text-xs sm:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)] ${
                      on ? "border-blue-600" : "border-border/60 opacity-50"
                    }`}
                  >
                    <div>
                      <div className="font-mono text-sm font-bold">{row.name}</div>
                      <div className="text-[11px] text-muted-foreground">{row.full}</div>
                    </div>
                    <div className="min-w-0"><span className="text-muted-foreground">받음 </span><span className="font-mono">{row.inputs}</span></div>
                    <div className="col-start-2 min-w-0 sm:col-start-3"><span className="text-muted-foreground">내놓음 </span><span className={`font-mono font-semibold ${on ? "text-blue-700 dark:text-blue-400" : ""}`}>{row.output}</span></div>
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
