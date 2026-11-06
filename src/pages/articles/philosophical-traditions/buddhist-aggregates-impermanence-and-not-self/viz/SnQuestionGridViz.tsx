import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source, #names — SN 22.59의 질문을 다섯 집합 각각에 반복한다.
 * 칸의 ?는 "이 질문을 던진다"는 표시이며 판정이 아니다. 10초 사례의 대응은 글의 대입이다.
 */
const ROWS = [
  { name: "몸", example: "얼굴의 열감" },
  { name: "느낌", example: "불쾌함" },
  { name: "지각", example: "‘무시’라는 의미" },
  { name: "형성", example: "반격 충동" },
  { name: "의식", example: "이 대상들을 앎" },
] as const;

const COLUMNS = ["자기라면", "무상", "괴로움", "내 것·나"] as const;

const SCENES = [
  { label: "자기라면", summary: "괴로움을 낳지 않고 원하는 대로?", question: "이것이 자기라면 괴로움을 낳지 않고 원하는 대로 되게 할 수 있어야 하지 않는가?", note: "먼저 통제를 묻습니다. 얼굴의 열감에도, 불쾌함에도, 다섯 칸 모두에 같은 질문을 던집니다." },
  { label: "무상", summary: "무상하고 변하는가?", question: "이것은 무상하고 변하는 것인가?", note: "다음은 변화를 묻습니다. 다섯 칸 모두 같은 질문이며 물음표는 판정이 아니라 물었다는 표시입니다." },
  { label: "괴로움", summary: "괴로움을 따로 묻기", question: "변하는 그것은 괴로움인가?", note: "6절에서 본 대로 경은 무상에서 곧바로 무아로 건너뛰지 않고 그 사이에 괴로움을 따로 묻습니다." },
  { label: "내 것·나", summary: "그렇게 보기에 알맞은가?", question: "‘이것은 내 것, 이것이 나, 이것이 나의 자아’라고 보기에 알맞은가?", note: "앞의 물음을 거친 뒤에야 동일시를 묻습니다. 묻는 것은 그렇게 보기에 알맞은가입니다." },
  { label: "반복 전체", summary: "질문 네 칸 × 다섯 집합", question: "‘아무것도 없다’는 선언 칸은 이 표에 없습니다.", note: "이 순서는 선언보다 검사의 반복입니다. 다만 번역마다 not-self와 no-self 선택이 다르고, 이 경전 하나로 초기 불교 전체의 인격 동일성 논쟁이 끝나지는 않습니다." },
] as const;

export default function SnQuestionGridViz() {
  return (
    <SceneShell
      eyebrow="SN 22.59의 순서"
      title="같은 물음이 다섯 집합마다 되풀이됩니다"
      description="줄은 다섯 집합과 10초 사례의 대응, 칸은 왼쪽부터 묻는 순서입니다. 물음표는 묻는다는 표시이며 판정이 아닙니다."
      ariaLabel="다섯 집합 각각에 네 질문을 차례로 던지는 표"
      scenes={SCENES}
      render={(active) => {
        const allDone = active === COLUMNS.length;
        return (
          <div className="min-w-0">
            <div className="grid min-h-[3.5rem] sm:min-h-[2.75rem] items-center rounded-lg border border-border px-3 py-2 text-sm font-semibold leading-6">
              {SCENES.map((scene, index) => (
                <p key={scene.label} className={`col-start-1 row-start-1 ${index === active ? "" : "invisible"}`}>{scene.question}</p>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-[5.75rem_repeat(4,minmax(0,1fr))] gap-1 text-center text-xs leading-4 sm:grid-cols-[9rem_repeat(4,minmax(0,1fr))] sm:text-sm sm:leading-5">
              <span />
              {COLUMNS.map((column, index) => (
                <span key={column} className={`pb-1 ${index === active ? "font-bold" : "text-muted-foreground"}`}>
                  <span className={`block ${index === active ? "" : "invisible"}`} aria-hidden>▼</span>
                  {column}
                </span>
              ))}
              {ROWS.map((row) => (
                <div key={row.name} className="contents">
                  <span className="py-1 text-left">
                    <strong>{row.name}</strong>
                    <span className="block text-[11px] leading-4 text-muted-foreground sm:ml-2 sm:inline sm:text-xs">{row.example}</span>
                  </span>
                  {COLUMNS.map((column, index) => {
                    const asked = allDone || index < active;
                    const current = index === active;
                    return (
                      <span
                        key={column}
                        className={`flex items-center justify-center rounded-sm border font-mono ${current ? "border-primary font-bold" : asked ? "border-border" : "border-dashed border-border/40 text-muted-foreground/30"}`}
                      >
                        {current || asked ? "?" : "·"}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
