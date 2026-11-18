import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need, #sigma — 같은 처음 수 10으로 질문 2와 5에 답하면(7, 8) 빼기에서 10이 지워지고 비밀 4만 남는다.
 * 모두 11로 나눈 나머지: 10+2×4=18≡7, 10+5×4=30≡8, 7−8=−1, 2−5=−3≡8, 8×7=56≡1 → (−1)×7=−7≡4.
 * 마지막 장면: 첫 메시지가 다르면 지워야 할 수가 달라 이 식을 그대로 쓸 수 없다(r′은 값을 정하지 않은 기호).
 */

interface Row {
  tag: string;
  answer: string;
  nonce: string;
  secret: string;
  side: string;
  cancel?: boolean;
  unknown?: boolean;
}

const ROW_A: Row = { tag: "질문 2", answer: "7", nonce: "10", secret: "2 × 4", side: "18 → 7" };
const ROW_B: Row = { tag: "질문 5", answer: "8", nonce: "10", secret: "5 × 4", side: "30 → 8" };
const ROW_DIFF: Row = { tag: "빼기", answer: "7 − 8 = −1", nonce: "10 − 10 = 0", secret: "(2 − 5) × 4", side: "−1 ≡ −3 × 4", cancel: true };
const ROW_B_FRESH: Row = { tag: "질문 5", answer: "s′", nonce: "새 수 r′", secret: "5 × 4", side: "r′를 모름" };
const ROW_DIFF_FRESH: Row = { tag: "빼기", answer: "7 − s′", nonce: "10 − r′", secret: "(2 − 5) × 4", side: "모르는 수가 남음", unknown: true };

const SCENES = [
  { label: "질문 2에 답 7", summary: "7 ≡ 10 + 2×4", note: "답은 이번에 고른 10과 질문×비밀을 더한 뒤 11로 나눈 나머지입니다. 답 7 한 줄에는 10과 2×4가 더해져 섞여 있습니다.", rows: [ROW_A, null, null], result: "답 하나에는 10과 4가 섞여 있음" },
  { label: "같은 10으로 질문 5", summary: "8 ≡ 10 + 5×4", note: "같은 처음 값 12(지수 10)로 질문 5에도 답하면 10+20=30의 나머지 8을 보냅니다. 두 줄에 같은 10이 들어 있습니다.", rows: [ROW_A, ROW_B, null], result: "두 줄에 같은 10" },
  { label: "두 답을 빼면", summary: "10이 지워짐", note: "두 줄을 빼면 같은 10끼리 지워지고 응답 차이 −1과 질문 차이 −3, 그리고 비밀 4만 남습니다.", rows: [ROW_A, ROW_B, ROW_DIFF], result: "−1 ≡ −3 × 비밀" },
  { label: "질문 차이로 나눔", summary: "(−1) × 7 ≡ 4", note: "11로 나눈 나머지에서 −3은 8과 같습니다. 곱해서 1이 되는 수(역수)를 곱하는 것이 나누기이고, 8×7=56≡1이므로 8의 역수는 7입니다. (−1)×7=−7≡4가 비밀입니다.", rows: [ROW_A, ROW_B, ROW_DIFF], result: "비밀 ≡ (−1) × 8⁻¹ ≡ (−1) × 7 ≡ 4" },
  { label: "질문마다 새 수를 쓰면", summary: "10 − r′ 가 남음", note: "두 번째 대화가 새 수 r′로 시작하면 빼도 10과 r′가 지워지지 않습니다. 첫 메시지가 서로 다르면 지워야 할 수가 달라져 같은 식을 그대로 적용할 수 없습니다.", rows: [ROW_A, ROW_B_FRESH, ROW_DIFF_FRESH], result: "이 빼기 식을 그대로 쓸 수 없음" },
] as const;

function Box({ text, tone }: { text: string; tone: "answer" | "nonce" | "secret" | "cancel" | "unknown" }) {
  const cls =
    tone === "answer"
      ? "border-border bg-background font-bold"
      : tone === "nonce"
        ? "border-amber-600/60 bg-amber-500/10 text-amber-800 dark:text-amber-300"
        : tone === "secret"
          ? "border-blue-600/60 bg-blue-500/10 text-blue-800 dark:text-blue-300"
          : tone === "cancel"
            ? "border-dashed border-border text-muted-foreground line-through"
            : "border-red-600/60 bg-red-500/10 font-semibold text-red-800 dark:text-red-300";
  return <span className={`flex min-h-[2.25rem] items-center justify-center rounded-md border px-1 text-center leading-4 ${cls}`}>{text}</span>;
}

export default function NonceReuseViz() {
  return (
    <SceneShell
      eyebrow="처음 수의 재사용"
      title="같은 처음 수로 두 번 답하면 빼기에서 비밀만 남습니다"
      description="한 줄이 응답 하나입니다. 주황 칸은 이번 대화용으로 고른 수, 파랑 칸은 질문 × 비밀입니다. 계산은 모두 11로 나눈 나머지이고 ≡는 나머지가 같다는 뜻입니다."
      ariaLabel="같은 처음 수 10으로 두 질문에 답하면 차이에서 비밀 4가 나오는 과정과 새 수를 쓸 때의 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 font-mono text-[11px] sm:text-sm">
            <div className="mb-1 grid grid-cols-[3.25rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)] gap-1 text-center font-sans text-[11px] text-muted-foreground sm:text-xs">
              <span />
              <span>응답</span>
              <span />
              <span>고른 수</span>
              <span />
              <span>질문 × 비밀</span>
            </div>
            <div className="space-y-2">
              {scene.rows.map((row, slot) => (
                <div key={slot} className={`grid grid-cols-[3.25rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)] items-center gap-1 ${row ? "" : "invisible"} ${slot === 2 ? "border-t border-border pt-2" : ""}`}>
                  <span className="font-sans font-semibold">{row?.tag ?? "·"}</span>
                  <Box text={row?.answer ?? "·"} tone="answer" />
                  <span className="text-center">≡</span>
                  <Box text={row?.nonce ?? "·"} tone={row?.cancel ? "cancel" : row?.unknown || row?.nonce.includes("r′") ? "unknown" : "nonce"} />
                  <span className="text-center">+</span>
                  <Box text={row?.secret ?? "·"} tone="secret" />
                  <span className="col-span-5 col-start-2 text-right text-[11px] text-muted-foreground sm:text-xs">{row?.side ?? "·"}</span>
                </div>
              ))}
            </div>
            <div className={`mt-3 flex min-h-[2.5rem] items-center justify-center rounded-lg border px-3 py-2 text-center ${active >= 2 ? "border-primary/40 font-semibold text-primary" : "border-dashed border-border text-muted-foreground"}`}>
              {scene.result}
            </div>
          </div>
        );
      }}
    />
  );
}
