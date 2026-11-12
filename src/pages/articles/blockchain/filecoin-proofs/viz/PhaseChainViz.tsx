import SceneShell from "./SceneShell";

/**
 * 본문 대응: ModernArticle.tsx #phase-envelope — J_i = H(P‖J_{i-1}‖H(I_i)‖H(O_i)‖H(C_i)‖v).
 * 장면: 정상 연결 → 다른 sector의 PC1을 PC2에 넣기 → 오래된 parameter cache로 proof 만들기 → digest의 한계.
 * sector A·B, cache manifest "승인됨·오래됨"은 설명용 이름(가정).
 */
type Status = "ok" | "bad" | "off";
interface Card {
  p: string;
  up: string;
  cache: string;
  j: string;
  status: Status;
}

const PHASES = ["PC1", "PC2", "C1", "C2"] as const;

const ok = (p: string, up: string, j: string): Card => ({ p, up, cache: "승인됨", j, status: "ok" });

const SCENES = [
  {
    label: "정상 연결",
    summary: "J₁ → J₂ → J₃ → J₄",
    note: "칸 하나가 seal의 한 단계입니다. 각 단계의 receipt id Jᵢ는 proof profile P(proof type·sector·parameter), 바로 앞 단계의 Jᵢ₋₁, 입력·출력과 cache manifest(cache 파일 이름·크기·digest 목록)의 digest(내용을 해시한 짧은 값), binary revision을 함께 해시해 만듭니다. 그래서 J₄ 안에는 J₁부터의 연결이 들어 있습니다.",
    cards: [ok("sector A", "—", "J₁"), ok("sector A", "J₁", "J₂"), ok("sector A", "J₂", "J₃"), ok("sector A", "J₃", "J₄")],
  },
  {
    label: "다른 sector의 PC1",
    summary: "PC2의 P ≠ 들어온 J₁의 sector",
    note: "sector B의 PC1 labels를 sector A의 PC2에 넣으면 type 이름이 같아도 같은 작업이 아닙니다. PC2 receipt는 P와 J₁을 함께 묶으므로, sector가 다른 upstream receipt는 이 연결에 들어갈 수 없습니다.",
    cards: [
      { p: "sector B", up: "—", cache: "승인됨", j: "J₁(B)", status: "ok" },
      { p: "sector A", up: "J₁(B) ✕", cache: "승인됨", j: "만들지 않음", status: "bad" },
      { p: "sector A", up: "—", cache: "—", j: "—", status: "off" },
      { p: "sector A", up: "—", cache: "—", j: "—", status: "off" },
    ],
  },
  {
    label: "오래된 parameter cache",
    summary: "출력이 같아 보여도 J₄ ≠ 기대한 J₄",
    note: "오래된 parameter cache로 proof bytes를 만들면 출력은 같아 보여도 cache manifest digest H(C)가 다릅니다. 그래서 J₄가 달라지고, 같은 proof 작업으로 세지 않습니다.",
    cards: [
      ok("sector A", "—", "J₁"),
      ok("sector A", "J₁", "J₂"),
      ok("sector A", "J₂", "J₃"),
      { p: "sector A", up: "J₃", cache: "오래됨", j: "J₄′ ≠ J₄", status: "bad" },
    ],
  },
  {
    label: "digest가 말하지 않는 것",
    summary: "J₄ 일치 ≠ proof 검증 완료",
    note: "J₄가 기대와 같아도 이것은 같은 입력·출력·cache를 썼다는 기록입니다. 본문 가정대로 digest는 cache 내용의 의미 검증이나 proof verification을 대신하지 않으므로, 다음 절의 verifier 검사가 따로 필요합니다.",
    cards: [ok("sector A", "—", "J₁"), ok("sector A", "J₁", "J₂"), ok("sector A", "J₂", "J₃"), ok("sector A", "J₃", "J₄ ✓")],
  },
] as const;

const STATUS_CLASS: Record<Status, string> = {
  ok: "border-border bg-background",
  bad: "border-red-600 bg-red-50 dark:bg-red-950/30",
  off: "border-dashed border-border/60 text-muted-foreground/60",
};

function Field({ name, value, warn }: { name: string; value: string; warn: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-t border-border/60 py-1">
      <span className="shrink-0 text-[11px] text-muted-foreground">{name}</span>
      <span className={`min-w-0 break-keep text-right font-mono text-xs ${warn ? "font-bold text-red-700 dark:text-red-400" : ""}`}>{value}</span>
    </div>
  );
}

export default function PhaseChainViz() {
  return (
    <SceneShell
      eyebrow="단계 결과 이어 붙이기"
      title="각 단계 receipt가 앞 단계 receipt를 품고 이어집니다"
      description="PC1→PC2→C1→C2 칸마다 receipt id를 만드는 재료 일부를 적었습니다. sector A·B와 cache manifest의 승인됨·오래됨은 설명용 이름입니다(가정)."
      ariaLabel="seal 단계 receipt가 앞 단계 receipt, profile, cache manifest를 묶어 이어지는 과정"
      scenes={SCENES}
      render={(active) => {
        const cards: readonly Card[] = SCENES[active].cards;
        return (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {cards.map((card, index) => (
              <div key={PHASES[index]} className={`min-w-0 rounded-lg border px-2.5 py-2 ${STATUS_CLASS[card.status]}`}>
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-sm font-bold">{PHASES[index]}</span>
                  <span className="text-[11px] text-muted-foreground">{index === 0 ? "시작" : `← ${PHASES[index - 1]}`}</span>
                </div>
                <div className="mt-1">
                  <Field name="P" value={card.p} warn={card.p === "sector B"} />
                  <Field name="앞 receipt" value={card.up} warn={card.up.includes("✕")} />
                  <Field name="cache manifest" value={card.cache} warn={card.cache === "오래됨"} />
                  <Field name="이 단계 J" value={card.j} warn={card.status === "bad"} />
                </div>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
