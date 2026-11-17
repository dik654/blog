import XmlSceneShell from "./XmlSceneShell";

/**
 * 본문 대응: #advanced-tags — 위치 번호 인용 vs 안정된 id 인용.
 * 근거 문서는 faq-17이라고 가정한다. 검색 결과 네 칸 중 “세 번째 문서”와 id="faq-17"이 각각 어느 칸을 가리키는지 본다.
 * policy-v7-s3·faq-42는 본문 예시의 id이고 faq-17·handbook-s9는 설명용 가정 id다.
 */
type Scene = {
  label: string;
  summary: string;
  note: string;
  /** 검색 결과 칸, null = 빈 칸 */
  slots: readonly (string | null)[];
  /** id로 인용한 값 */
  cited: string;
};

const TARGET = "faq-17";

const SCENES: readonly Scene[] = [
  {
    label: "처음 검색 결과",
    summary: "세 번째 = faq-17 · id = faq-17",
    note: "근거 문서가 세 번째 칸에 있으니 지금은 ‘세 번째 문서’와 id=\"faq-17\"이 같은 문서를 가리킵니다.",
    slots: ["faq-42", "policy-v7-s3", "faq-17", "handbook-s9"],
    cited: TARGET,
  },
  {
    label: "검색 순위가 바뀝니다",
    summary: "세 번째 = faq-42 · id = faq-17",
    note: "같은 문서들이 다른 순서로 돌아왔습니다. ‘세 번째 문서’는 이제 faq-42를 가리키고, id=\"faq-17\"은 둘째 칸으로 옮겨 간 원래 문서를 그대로 찾습니다.",
    slots: ["policy-v7-s3", "faq-17", "faq-42", "handbook-s9"],
    cited: TARGET,
  },
  {
    label: "일부 문서가 빠집니다",
    summary: "세 번째 = handbook-s9 · id = faq-17",
    note: "faq-42가 결과에서 빠지자 뒤 문서가 한 칸씩 당겨졌습니다. 같은 번호가 또 다른 문서를 가리키지만 id 인용은 바뀌지 않습니다.",
    slots: ["policy-v7-s3", "faq-17", "handbook-s9", null],
    cited: TARGET,
  },
  {
    label: "없는 id는 별도 validator가 있어야 잡힙니다",
    summary: "id = faq-99 → 입력에 없음",
    note: "id라는 attribute 이름만으로 XML processor가 존재나 중복을 확인하지는 않습니다. 입력에 없는 faq-99를 인용하면 DTD·XSD 선언이나 application validator가 이를 찾아내야 합니다.",
    slots: ["policy-v7-s3", "faq-17", "handbook-s9", null],
    cited: "faq-99",
  },
];

export default function PositionVsIdViz() {
  return (
    <XmlSceneShell
      eyebrow="위치 번호와 identity"
      title="‘세 번째 문서’는 검색 결과가 바뀌면 다른 문서를 가리킵니다"
      description="모델이 근거로 쓴 문서를 faq-17이라고 두고(가정), 같은 인용을 위치 번호로 할 때와 id로 할 때를 비교합니다. 칸 하나가 검색 결과의 한 자리입니다."
      ariaLabel="검색 순서가 바뀌거나 문서가 빠질 때 위치 번호 인용과 id 인용이 가리키는 문서 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const third = scene.slots[2];
        const idSlot = scene.slots.indexOf(scene.cited);
        const positionOk = third === TARGET;
        const idFound = idSlot >= 0;
        return (
          <div className="min-w-0 space-y-3">
            <ol className="grid grid-cols-4 gap-1.5">
              {scene.slots.map((doc, slot) => {
                const isThird = slot === 2;
                const isId = slot === idSlot;
                return (
                  <li
                    key={slot}
                    className={`min-w-0 border px-1 py-2 text-center ${
                      doc === null
                        ? "border-dashed border-border/60"
                        : isId
                          ? "border-blue-600"
                          : "border-border"
                    }`}
                  >
                    <span className="block font-mono text-[10px] text-muted-foreground">{slot + 1}번째</span>
                    <span className={`mt-1 block font-mono text-[10px] font-bold [overflow-wrap:anywhere] sm:text-xs ${doc === null ? "text-muted-foreground/60" : ""}`}>
                      {doc ?? "빠짐"}
                    </span>
                    <span className="mt-1 flex min-h-4 flex-wrap justify-center gap-1 text-[9px] font-bold">
                      {isThird ? <span className="text-amber-700 dark:text-amber-400">▲번호</span> : null}
                      {isId ? <span className="text-blue-700 dark:text-blue-400">●id</span> : null}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="min-w-0 border-l-2 border-amber-600 pl-3">
                <p className="text-[10px] font-bold text-muted-foreground">▲ 위치로 인용 · “세 번째 문서”</p>
                <p className="mt-1 font-mono text-xs font-bold">→ {third ?? "빈 칸"}</p>
                <p className={`text-xs font-bold ${positionOk ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                  {positionOk ? "✓ 근거 문서와 같음" : "✕ 다른 문서를 가리킴"}
                </p>
              </div>
              <div className="min-w-0 border-l-2 border-blue-600 pl-3">
                <p className="text-[10px] font-bold text-muted-foreground">● id로 인용 · id="{scene.cited}"</p>
                <p className="mt-1 font-mono text-xs font-bold">→ {idFound ? `${idSlot + 1}번째 칸` : "입력에 없음"}</p>
                <p className={`text-xs font-bold ${idFound ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                  {idFound ? "✓ 근거 문서와 같음" : "✕ validator를 둬야 오류로 잡힘"}
                </p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
