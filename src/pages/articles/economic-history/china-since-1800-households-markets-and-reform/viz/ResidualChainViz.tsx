import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 농가의 추가 10자루에서 도시·수출 성장까지의 중간 고리.
 * 네 줄: 가구 처분 → 농촌 소득·노동 이동(관문: 이동 허가·공공서비스) → 특구 수출 주문 사슬 → 지방정부 토지·세입·부채.
 * 본문이 "~할 수 있습니다"로 쓴 고리는 그대로 가능성으로 표시한다.
 */
interface Row {
  actor: string;
  chain: readonly string[];
  side: string;
  sideTone: "gate" | "risk" | "plain";
}

const ROWS: readonly Row[] = [
  { actor: "농가", chain: ["추가 10자루를 남김", "소비 · 저축 · 농기구 구매"], side: "달라질 수 있음", sideTone: "plain" },
  { actor: "농촌 → 공장", chain: ["농촌 소득과 노동 이동", "향진기업 · 도시 공장에 수요 · 자금 · 인력"], side: "관문: 이동 허가 · 공공서비스 접근", sideTone: "gate" },
  { actor: "경제특구", chain: ["수출 주문", "부품 수입", "가공", "항만", "외화 수입"], side: "주문 하나가 뒤의 네 고리를 잇습니다", sideTone: "plain" },
  { actor: "지방정부", chain: ["토지 · 인프라 제공", "세입"], side: "부채 · 토지 의존도 함께 쌓일 수 있음", sideTone: "risk" },
];

const SCENES = [
  { label: "1. 가구의 처분", summary: "추가 10 → 소비·저축·농기구", note: "3절의 가정처럼 가족이 추가 10자루를 남기면, 그 몫을 먹고 쓰는지, 모아 두는지, 농기구를 사는지가 달라질 수 있습니다. 출발점은 마을 장부의 잔여 몫입니다." },
  { label: "2. 농촌에서 공장으로", summary: "소득·노동 → 향진기업·도시 공장", note: "향진기업은 농촌의 향·진(읍·면급 행정 단위)이나 마을이 세운 기업입니다. 농촌의 소득과 노동 이동이 이 기업과 도시 공장에 수요·자금·인력을 대지만, 이동 허가와 공공서비스 접근이 이 길을 좁힙니다." },
  { label: "3. 특구의 수출 주문", summary: "주문 → 부품 수입 → 가공 → 항만 → 외화", note: "경제특구에 들어온 수출 주문 하나가 부품을 들여오고, 가공하고, 항만으로 내보내고, 외화를 받는 고리를 한 줄로 잇습니다." },
  { label: "4. 지방정부의 몫", summary: "토지·인프라 → 세입, 그리고 부채", note: "지방정부는 토지와 인프라를 내주고 세입을 얻습니다. 같은 길에서 부채와 토지 의존도 함께 쌓일 수 있어, 이 줄에는 이익과 비용이 같이 붙습니다." },
] as const;

const SIDE_CLASS = {
  gate: "border-amber-600 text-amber-800 dark:text-amber-300",
  risk: "border-red-600 text-red-700 dark:text-red-400",
  plain: "border-border text-muted-foreground",
} as const;

export default function ResidualChainViz() {
  return (
    <SceneShell
      eyebrow="중간 고리"
      title="마을의 잔여 몫이 공장 주문과 지방 재정까지 이어지는 네 줄"
      description="줄 하나가 한 경로이고, 화살표는 앞 고리가 다음 고리로 이어지는 순서입니다. 지금 장면의 줄만 진하게 그렸습니다. 본문이 가능성으로 쓴 고리는 가능성으로 남겼습니다."
      ariaLabel="농가, 농촌에서 공장, 경제특구, 지방정부 네 경로의 중간 고리"
      scenes={SCENES}
      render={(active) => (
        <ol className="space-y-3">
          {ROWS.map((row, i) => {
            const on = i === active;
            return (
              <li
                key={row.actor}
                className={`rounded-lg border px-3 py-2 transition-opacity duration-300 motion-reduce:transition-none ${on ? "border-primary opacity-100" : "border-border/60 opacity-40"}`}
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm leading-6">
                  <span className="mr-1 font-bold">{row.actor}</span>
                  {!on && <span className="text-xs text-muted-foreground sm:hidden">{row.chain[0]} → …</span>}
                  {row.chain.map((step, k) => (
                    <span key={step} className={`items-center gap-x-2 ${on ? "flex" : "hidden sm:flex"}`}>
                      {k > 0 && <span aria-hidden className="text-muted-foreground">→</span>}
                      <span className={`rounded-md border px-2 py-0.5 ${on ? "border-primary/60 bg-primary/5" : "border-border"}`}>{step}</span>
                    </span>
                  ))}
                </div>
                <p className={`mt-1.5 rounded-md ${on ? "inline-block" : "hidden sm:inline-block"} border border-dashed px-2 py-0.5 text-xs leading-5 ${SIDE_CLASS[row.sideTone]}`}>{row.side}</p>
              </li>
            );
          })}
        </ol>
      )}
    />
  );
}
