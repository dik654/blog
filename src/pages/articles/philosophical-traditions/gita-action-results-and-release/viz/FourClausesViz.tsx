import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 『바가바드 기타』 2.47의 네 부분. 넷을 함께 읽어야
 * 결과를 포기하라는 말이 행동 포기로 뒤집히지 않는다. 농부 대입은 본문 둘째 문단의 문장을 따른다.
 */
const CLAUSES = [
  { id: 1, text: "행위에 대한 권한", term: "adhikāra" },
  { id: 2, text: "그것과 구분되는 열매에 대한 권한", term: "phala" },
  { id: 3, text: "열매를 행위의 동기로 삼지 말 것", term: "hetu" },
  { id: 4, text: "무행동에 대한 집착도 두지 말 것", term: "akarman · saṅga" },
] as const;

const SCENES = [
  { label: "네 부분", summary: "행위 · 열매 · 동기 · 무행동", note: "번호는 구절에 나오는 순서입니다. 번역과 주석 전통에 따라 ‘권한’, ‘열매’, ‘동기’의 설명이 달라지므로 한 가지 한국어 표현으로 확정하지 않습니다.", lit: [1, 2, 3, 4], head: "구절의 구성", reading: "네 부분이 한 구절 안에 이어집니다.", warn: false },
  { label: "열매 쪽만 떼어 읽으면", summary: "②③만 읽은 경우", note: "설명을 위해 결과에 관한 ②③만 떼어 본 경우입니다. ‘결과를 포기하라’는 말이 ‘행동도 포기하라’로 뒤집힐 수 있습니다.", lit: [2, 3], head: "뒤집힌 읽기", reading: "결과를 포기하라 → 행동도 포기하라", warn: true },
  { label: "넷을 함께 읽으면", summary: "네 부분을 함께", note: "①과 ④까지 함께 읽으면 결과를 놓으라는 말이 행동을 버리라는 말이 되지 않습니다.", lit: [1, 2, 3, 4], head: "함께 읽은 뜻", reading: "열매를 동기로 붙잡지 않되, 무행동에도 집착하지 않습니다.", warn: false },
  { label: "농부에게 대입하면", summary: "준비와 파종 + 수확을 소유하지 않음", note: "구절을 이 글의 농부에게 옮긴 것이며, 교리를 확정하는 번역은 아닙니다.", lit: [1, 2, 3, 4], head: "밭에서", reading: "준비와 파종은 합니다. 수확 전체를 소유 가능한 보상으로 보지는 않습니다.", warn: false },
] as const;

export default function FourClausesViz() {
  return (
    <SceneShell
      eyebrow="2.47 나눠 읽기"
      title="네 부분 가운데 둘만 읽으면 뜻이 어떻게 뒤집힐까요"
      description="네 칸은 구절의 네 부분이고, 열매는 행위의 결과를 뜻합니다. 진한 칸이 이 장면에서 읽는 부분이고, 아래 칸이 그렇게 읽었을 때의 뜻입니다."
      ariaLabel="바가바드 기타 2.47의 네 부분과 일부만 읽을 때와 함께 읽을 때의 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const lit = new Set<number>(scene.lit);
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CLAUSES.map((clause) => {
                const on = lit.has(clause.id);
                return (
                  <li key={clause.id} className={`grid grid-cols-[1.5rem_minmax(0,1fr)] rounded-lg border px-3 py-2 text-sm leading-6 ${on ? "border-foreground/60 bg-background" : "border-dashed border-border/60 text-muted-foreground/50"}`}>
                    <span className="font-mono font-bold">{"①②③④"[clause.id - 1]}</span>
                    <span>
                      <span className={on ? "font-semibold" : ""}>{clause.text}</span>
                      <span className="ml-1 text-xs italic">{clause.term}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className={`mt-3 rounded-lg border px-3 py-3 text-sm leading-6 ${scene.warn ? "border-dashed border-red-600" : "border-primary/50"}`}>
              <p className={`text-xs font-bold leading-5 ${scene.warn ? "text-red-700 dark:text-red-400" : "text-primary"}`}>{scene.head}</p>
              <p className="mt-1 font-semibold">{scene.reading}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
