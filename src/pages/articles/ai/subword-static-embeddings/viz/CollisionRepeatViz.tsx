import SceneShell from "./SceneShell";

/**
 * 본문 대응: #collisions — <ru·run은 충돌, aaaa의 aaa 두 번은 반복.
 * aaaa 주소 5, 2, 2, 3 → 합 (12, 4), 평균 (3, 1). 한 번만 남기면 (10, 3) ÷ 3.
 */
interface Item {
  text: string;
  place: string;
  bucket: number;
  mark: "plain" | "same" | "gone";
}

const AAAA: readonly Item[] = [
  { text: "<aa", place: "1번째 창", bucket: 5, mark: "plain" },
  { text: "aaa", place: "2번째 창", bucket: 2, mark: "same" },
  { text: "aaa", place: "3번째 창", bucket: 2, mark: "same" },
  { text: "aa>", place: "4번째 창", bucket: 3, mark: "plain" },
];

const SCENES = [
  {
    label: "충돌", summary: "<ru ≠ run, 줄은 둘 다 2번",
    note: "철자가 다른 두 조각이 같은 줄 번호를 받은 경우입니다. 이것을 해시 충돌이라고 부릅니다. 조각은 둘이고 읽기도 두 번입니다.",
    items: [
      { text: "<ru", place: "1번째 창", bucket: 2, mark: "same" },
      { text: "run", place: "2번째 창", bucket: 2, mark: "same" },
      { text: "un>", place: "3번째 창", bucket: 4, mark: "plain" },
    ] as readonly Item[],
    result: "다른 철자가 같은 줄로",
  },
  { label: "반복", summary: "aaa가 두 위치에서", note: "<aaaa>에서는 2번째와 3번째 창이 똑같이 aaa를 읽습니다. 충돌과 달리 철자까지 같고, 읽은 위치만 다릅니다. aaaa에는 전용 행이 없다고 두고, 줄 값은 앞의 가정대로 (b, 1)입니다.", items: AAAA, result: "같은 철자가 다른 위치에서" },
  { label: "그대로 평균", summary: "(12, 4) ÷ 4 = (3, 1)", note: "네 기여를 모두 세면 첫 좌표 합은 5+2+2+3=12, 둘째 좌표 합은 4입니다. 네 번으로 나누어 (3, 1)이 됩니다.", items: AAAA, result: "합 (12, 4) ÷ 4 → (3, 1)" },
  {
    label: "집합으로 줄이면", summary: "(10, 3) ÷ 3 → 첫 좌표 10/3",
    note: "이름이 같은 조각을 한 번만 보관하면 합이 (10, 3), 나눌 수가 3으로 바뀌어 첫 좌표가 3이 아니라 10/3이 됩니다. 원문의 계산과 다른 값입니다.",
    items: AAAA.map((item, index): Item => (index === 2 ? { ...item, mark: "gone" } : { ...item, mark: "plain" })),
    result: "합 (10, 3) ÷ 3 → (10/3, 1)",
  },
] as const;

export default function CollisionRepeatViz() {
  return (
    <SceneShell
      eyebrow="겹침의 두 종류"
      title="충돌과 반복은 다른 일이지만 둘 다 횟수로 남습니다"
      description="칸 하나가 읽기 한 번입니다. 칸 안의 위는 조각, 아래는 그 조각이 받은 줄 번호입니다. 줄 값 (b, 1)은 글의 계산용 가정입니다."
      ariaLabel="해시 충돌과 조각 반복의 차이, 그리고 반복을 지울 때 평균이 바뀌는 계산"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map((slot) => {
                const item = scene.items[slot];
                if (!item) return <div key={slot} className="rounded-md border border-dashed border-border/40" />;
                return (
                  <div key={slot} className={`rounded-md border px-0.5 py-2 text-center ${item.mark === "same" ? "border-blue-600 bg-blue-500/10" : item.mark === "gone" ? "border-dashed border-red-600 opacity-70" : "border-border bg-background"}`}>
                    <span className="block text-[11px] text-muted-foreground">{item.place}</span>
                    <span className={`block font-mono text-base font-bold ${item.mark === "gone" ? "line-through" : ""}`}>{item.text}</span>
                    <span className="block text-xs">{item.bucket}번 줄</span>
                    <span className={`block text-[11px] font-bold text-red-700 dark:text-red-400 ${item.mark === "gone" ? "" : "invisible"}`}>지움</span>
                  </div>
                );
              })}
            </div>
            <p className="rounded-md border border-border bg-background px-3 py-2 text-center font-mono text-sm font-bold">{scene.result}</p>
          </div>
        );
      }}
    />
  );
}
