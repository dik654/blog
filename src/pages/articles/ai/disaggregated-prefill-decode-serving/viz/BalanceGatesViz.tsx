import SceneShell from "./SceneShell";

/**
 * 본문 대응: #routing-source — 불균형 = (max−min > 32) AND (max > 1.1×min).
 * (40,8)=F, (41,8)=T, (1000,967)=F. 균형이면 일치율 분기로 간다.
 */
const SCENES = [
  { label: "load 40과 8", summary: "두 조건 중 하나만 → 균형", a: 40, b: 8, abs: "40 − 8 = 32 > 32", absOk: false, rel: "40 > 1.1 × 8 = 8.8", relOk: true, verdict: "균형으로 봄 → 일치율 분기", imbalanced: false, note: "차이가 기준과 같은 32라서 넘지 않습니다. 두 조건을 함께 봐야 하므로 불균형이 아닙니다." },
  { label: "load 41과 8", summary: "두 조건 모두 → 불균형", a: 41, b: 8, abs: "41 − 8 = 33 > 32", absOk: true, rel: "41 > 1.1 × 8 = 8.8", relOk: true, verdict: "불균형 → 가장 작은 load 선택", imbalanced: true, note: "load가 1 늘자 절대 조건까지 맞습니다. 이때는 캐시 일치를 보지 않고 가장 작은 load인 8 쪽을 고릅니다." },
  { label: "load 1000과 967", summary: "차이는 같은 33 → 균형", a: 1000, b: 967, abs: "1000 − 967 = 33 > 32", absOk: true, rel: "1000 > 1.1 × 967 = 1063.7", relOk: false, verdict: "균형으로 봄 → 일치율 분기", imbalanced: false, note: "41과 8의 차이와 똑같이 33이지만 비율로 보면 거의 같은 값입니다. 절대 차이만 보고 불균형이라 판정할 수 없는 이유입니다." },
] as const;

function Check({ ok }: { ok: boolean }) {
  return <span className={`shrink-0 font-bold ${ok ? "text-[#16a34a]" : "text-[#dc2626]"}`}>{ok ? "예" : "아니오"}</span>;
}

const TREE = [
  { depth: 0, text: "불균형인가? (차이 > 32 그리고 큰 값 > 1.1 × 작은 값)", strong: true },
  { depth: 1, text: "예 → 가장 작은 load" },
  { depth: 1, text: "아니오 → 일치율이 기본값 0.5보다 높은가?", strong: true },
  { depth: 2, text: "높음 → 가장 긴 prefix 서버 (건강 상태 조건도 남음)" },
  { depth: 2, text: "낮음 → 가장 작은 load" },
];

export default function BalanceGatesViz() {
  const all = [...SCENES, { label: "다음 분기", summary: "균형이면 일치율을 봅니다", note: "prefix는 입력 앞부분, 일치율은 원문 문자를 근사 tree에서 센 값입니다. 낮은 일치율의 실행 분기는 최소 load를 고릅니다." }];
  return (
    <SceneShell
      eyebrow="SGLang commit 35f3c96 · load 값은 (가정)"
      title="load 차이가 같아도 불균형 판정은 달라집니다"
      description="load는 서버에 걸린 일의 양입니다. 막대는 장면마다 큰 값을 같은 길이로 맞췄고, 32·1.1은 배포 인자가 덮어쓸 수 있는 기본값입니다."
      ariaLabel="절대 차이와 상대 비율 두 조건으로 불균형을 판정하는 과정"
      scenes={all}
      render={(active) => {
        if (active === 3) {
          return (
            <ul key="tree" className="space-y-1.5 text-xs leading-5 sm:text-sm sm:leading-6">
              {TREE.map((node) => (
                <li key={node.text} style={{ marginLeft: `${node.depth * 1}rem` }} className={`rounded-md border border-border px-2.5 py-1.5 ${node.strong ? "font-semibold" : ""}`}>{node.text}</li>
              ))}
            </ul>
          );
        }
        const scene = SCENES[active];
        const max = Math.max(scene.a, scene.b);
        return (
          <div key={scene.label} className="min-w-0 space-y-3 text-sm">
            <div className="space-y-1.5">
              {[scene.a, scene.b].map((value, index) => (
                <div key={index} className="grid grid-cols-[3.5rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-xs">
                  <span className="text-muted-foreground">복사본 {index + 1}</span>
                  <div className="h-4 rounded-sm bg-muted/40">
                    <div className="h-full rounded-sm" style={{ width: `${(value / max) * 100}%`, backgroundColor: "#64748b" }} />
                  </div>
                  <span className="text-right font-mono font-bold">{value}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3 rounded-md border border-border px-3 py-2">
                <span className="min-w-0 font-mono text-xs sm:text-sm">{scene.abs}</span>
                <Check ok={scene.absOk} />
              </div>
              <div className="flex items-baseline justify-between gap-3 rounded-md border border-border px-3 py-2">
                <span className="min-w-0 font-mono text-xs sm:text-sm">{scene.rel}</span>
                <Check ok={scene.relOk} />
              </div>
            </div>
            <p className={`rounded-md px-3 py-2 text-center font-semibold ${scene.imbalanced ? "bg-[#d97706]/15 text-[#b45309] dark:text-[#fbbf24]" : "bg-[#2563eb]/10 text-[#2563eb] dark:text-[#93c5fd]"}`}>{scene.verdict}</p>
          </div>
        );
      }}
    />
  );
}
