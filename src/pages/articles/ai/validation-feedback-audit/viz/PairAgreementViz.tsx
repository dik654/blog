import SceneShell from "./SceneShell";

/**
 * 본문 대응: #agreement — 다섯 후보의 10쌍에서 내부 차이와 공개 차이의 부호를 맞춘다(가정).
 * 내부 [0.80,0.79,0.78,0.77,0.76], 공개 [0.76,0.74,0.75,0.72,0.73], 허용폭 0.001.
 * B/C, D/E만 +0.01 → −0.01로 뒤집히고 나머지 8쌍은 같은 방향 → 8/10 = 0.8.
 */
const LOCAL: Readonly<Record<string, number>> = { A: 80, B: 79, C: 78, D: 77, E: 76 };
const PUBLIC: Readonly<Record<string, number>> = { A: 76, B: 74, C: 75, D: 72, E: 73 };
const IDS = ["A", "B", "C", "D", "E"] as const;

const PAIRS = IDS.flatMap((a, i) =>
  IDS.slice(i + 1).map((b) => {
    const dl = LOCAL[a] - LOCAL[b];
    const dp = PUBLIC[a] - PUBLIC[b];
    return { key: `${a}/${b}`, dl, dp, agree: Math.sign(dl) === Math.sign(dp) };
  }),
);
const AGREE = PAIRS.filter((pair) => pair.agree).length;

const fmt = (hundredths: number) => `${hundredths > 0 ? "+" : "−"}${(Math.abs(hundredths) / 100).toFixed(2)}`;

const SCENES = [
  { label: "후보 쌍 세기", summary: "5×4/2 = 10쌍", reveal: [] as string[], tie: false, note: "다섯 후보에서 두 후보를 고르는 방법은 5×4/2 = 10가지입니다. 차이는 앞 후보 점수에서 뒤 후보 점수를 뺀 값입니다." },
  { label: "B/C", summary: "내부 +0.01 · 공개 −0.01", reveal: ["B/C"], tie: false, note: "내부에서는 B가 0.01 앞섰는데 공개에서는 C가 0.01 앞섭니다. 두 부호가 반대이므로 이 쌍은 방향이 다릅니다." },
  { label: "D/E", summary: "내부 +0.01 · 공개 −0.01", reveal: ["B/C", "D/E"], tie: false, note: "D/E도 같은 모양입니다. 내부 0.01, 공개 −0.01로 부호가 뒤집혔습니다." },
  { label: "나머지 여덟 쌍", summary: `${AGREE}/${PAIRS.length} = ${(AGREE / PAIRS.length).toFixed(1)}`, reveal: PAIRS.map((pair) => pair.key), tie: false, note: "나머지 여덟 쌍은 두 차이의 부호가 같습니다. 모든 차이가 0.01 이상이라 허용폭 0.001 안에 드는 쌍이 없고, 분모는 10 그대로입니다." },
  { label: "동점 규칙", summary: "한쪽이라도 |차이| ≤ 0.001 → 분모에서 제외", reveal: PAIRS.map((pair) => pair.key), tie: true, note: "두 평가 모두 차이가 0.0005인 쌍을 가정하면 둘 다 허용폭 안이라 동점입니다. 부호 0과 0을 일치로 세지 않고 분모에서 빼며 제외 개수를 적습니다. 한쪽 평가만 허용폭 안이어도 똑같이 제외합니다. 유효 쌍이 없으면 계산 불가입니다." },
] as const;

export default function PairAgreementViz() {
  return (
    <SceneShell
      eyebrow="방향 일치율"
      title="열 쌍의 부호를 하나씩 맞춰 보면 0.8이 나옵니다"
      description="칸 하나가 후보 쌍 하나이고, 칸 안의 숫자는 ‘내부 차이 → 공개 차이’입니다. 같은 평가 안에서 두 후보를 뺀 값의 부호(+면 앞 후보가 좋음)를 내부와 공개 사이에서 비교합니다. 점수와 허용폭 0.001은 이 글의 가정입니다."
      ariaLabel="다섯 후보의 열 쌍에서 내부와 공개 차이의 부호를 비교해 방향 일치율 0.8을 계산"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const shown = new Set<string>(scene.reveal);
        const allShown = shown.size === PAIRS.length;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {PAIRS.map((pair) => {
                const isShown = shown.has(pair.key);
                const tone = !isShown ? "border-border bg-background" : pair.agree ? "border-[#16a34a] bg-background" : "border-[#dc2626] bg-background";
                return (
                  <div key={pair.key} className={`rounded-lg border px-2 py-1.5 text-xs leading-5 ${tone}`}>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold">{pair.key}</span>
                      <span className={`font-bold ${!isShown ? "text-muted-foreground/40" : pair.agree ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                        {!isShown ? "·" : pair.agree ? "✓ 같음" : "✗ 다름"}
                      </span>
                    </div>
                    <div className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">{fmt(pair.dl)} → {fmt(pair.dp)}</div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs">
              <span className="text-muted-foreground">같은 방향 </span>
              <span className="font-mono font-bold text-[#16a34a]">{allShown ? AGREE : "?"}</span>
              <span className="text-muted-foreground"> · 다른 방향 </span>
              <span className="font-mono font-bold text-[#dc2626]">{allShown ? PAIRS.length - AGREE : shown.size || "?"}</span>
              <span className="text-muted-foreground"> · 동점 제외 </span>
              <span className="font-mono font-bold">0</span>
            </p>
            <div className={`mt-3 rounded-lg border px-3 py-2 text-xs leading-5 ${scene.tie ? "border-dashed border-[#d97706]" : "border-border"}`}>
              {scene.tie ? (
                <span>
                  <strong>가정한 쌍 X/Y</strong>: 내부 +0.0005, 공개 +0.0005 → 둘 다 0.001 이하라 동점 → 분모에서 제외, 제외 1개로 보고 (한쪽만 0.001 이하여도 제외)
                </span>
              ) : (
                <span className="text-muted-foreground">허용폭 검사: 위 열 쌍의 차이는 가장 작아도 0.01이어서 0.001보다 큽니다. 열 쌍 모두 분모에 들어갑니다.</span>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
