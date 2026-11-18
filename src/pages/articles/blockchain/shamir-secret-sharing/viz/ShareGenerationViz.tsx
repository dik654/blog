import SceneShell from "./SceneShell";

/**
 * 본문 대응: #active-boundary — 거짓 조각 12, 상수항 0 규칙 4x를 더한 갱신, 옛 조각과 새 조각을 섞는 실수.
 * 복원식은 1·2번 기록으로 2×(1번) − (2번)을 17로 나눈 나머지.
 * 정상 2×8−11=5, 거짓 2×8−12=4, 갱신 5+7x → (1,12)·(2,2)·(3,9), 2×12−2=22→5, 혼합 2×8−2=14.
 */
type Tag = "원래" | "거짓" | "새" | "옛";

interface Share {
  value: number;
  tag: Tag;
}

const SCENES = [
  {
    label: "정상 복원",
    summary: "2×8 − 11 = 5",
    shares: [{ value: 8, tag: "원래" }, { value: 11, tag: "원래" }, { value: 14, tag: "원래" }] as const,
    calc: "2×8 − 11 = 5",
    result: 5,
    note: "규칙 5 + 3x에서 나온 1·2번 기록을 모으면 비밀 5가 나옵니다. 3번 기록은 쓰지 않습니다.",
  },
  {
    label: "2번이 12를 냄",
    summary: "2×8 − 12 = 4",
    shares: [{ value: 8, tag: "원래" }, { value: 12, tag: "거짓" }, { value: 14, tag: "원래" }] as const,
    calc: "2×8 − 12 = 4",
    result: 4,
    note: "(1,8)·(2,12)를 지나는 다른 규칙 4 + 4x가 실제로 있습니다. 두 점만 보간하면 4도 멀쩡한 답처럼 나오고, 어느 조각이 거짓인지는 알 수 없습니다.",
  },
  {
    label: "4x를 더해 갱신",
    summary: "5 + 7x → 12 · 2 · 9",
    shares: [{ value: 12, tag: "새" }, { value: 2, tag: "새" }, { value: 9, tag: "새" }] as const,
    calc: "2×12 − 2 = 22 → 5",
    result: 5,
    note: "상수항이 0인 규칙 4x를 더하면 5 + 7x가 됩니다. 2번은 19, 3번은 26을 17로 나눈 나머지라 2와 9입니다. 새 1·2번으로 계산한 22를 17로 나누면 나머지가 비밀 5입니다.",
  },
  {
    label: "옛 1번 + 새 2번",
    summary: "2×8 − 2 = 14",
    shares: [{ value: 8, tag: "옛" }, { value: 2, tag: "새" }, { value: 9, tag: "새" }] as const,
    calc: "2×8 − 2 = 14",
    result: 14,
    note: "갱신 전 1번 (1,8)과 갱신 후 2번 (2,2)는 서로 다른 규칙에서 나왔습니다. 같은 비밀을 나눈 조각이어도 섞으면 14가 나오니 회차를 식별해야 합니다.",
  },
] as const;

const TAG_STYLE: Record<Tag, string> = {
  원래: "border-border bg-background",
  거짓: "border-dashed border-red-600",
  새: "border-primary bg-primary/10",
  옛: "border-dashed border-amber-600",
};

const TAG_TEXT: Record<Tag, string> = {
  원래: "text-muted-foreground",
  거짓: "font-semibold text-red-700 dark:text-red-400",
  새: "font-semibold text-primary",
  옛: "font-semibold text-amber-700 dark:text-amber-400",
};

export default function ShareGenerationViz() {
  return (
    <SceneShell
      eyebrow="거짓 조각과 갱신"
      title="복원식은 같아도 어떤 조각을 넣느냐에 따라 답이 달라집니다"
      description="칸 하나가 보관자 한 명의 기록입니다. 매번 1·2번 기록만 모아 2×(1번) − (2번)을 계산하고, 17 이상이면 17로 나눈 나머지를 취합니다."
      ariaLabel="정상 복원, 거짓 조각 12, 상수항 0 규칙을 더한 갱신, 옛 조각과 새 조각을 섞은 경우의 복원 결과"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const shares: readonly Share[] = scene.shares;
        const ok = scene.result === 5;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-3 gap-2">
              {shares.map((share, index) => {
                const used = index < 2;
                return (
                  <div key={index} className={`rounded-lg border px-2 py-2 text-center leading-5 ${TAG_STYLE[share.tag]} ${used ? "" : "opacity-40"}`}>
                    <span className="block text-xs text-muted-foreground">{index + 1}번</span>
                    <span className="block font-mono text-lg font-bold">({index + 1},{share.value})</span>
                    <span className={`block text-xs ${TAG_TEXT[share.tag]}`}>{share.tag} 조각{used ? "" : " · 안 씀"}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
              <span className="min-w-0 font-mono text-sm sm:text-base">{scene.calc}</span>
              <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${ok ? "border-green-600 text-green-700 dark:text-green-400" : "border-red-600 text-red-700 dark:text-red-400"}`}>
                {ok ? "비밀 5와 같음" : `${scene.result} · 비밀 아님`}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
