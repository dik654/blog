import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 나쁜 믿음은 사실성과 초월 가운데 하나만 붙잡는 자기기만이다.
 * 5절의 장부 표현: 묶인 22시간(조건)과 남은 2시간(선택)을 함께 적는다.
 * 한쪽을 지우는 두 갈래를 같은 자리에서 비교한다.
 */
const SCENES = [
  {
    label: "두 쪽을 함께 적습니다",
    summary: "사실성 + 초월",
    erased: "none",
    claim: "조건을 사실대로 인정하고, 그 조건과 맺을 다음 관계를 묻습니다.",
    note: "사실성은 이미 놓인 조건, 초월은 그 조건을 해석하고 아직 없는 가능성을 향해 계획하는 움직임입니다. 둘 다 장부에 남아 있습니다.",
  },
  {
    label: "‘나는 직원이니 거부할 수 없다’",
    summary: "가능성을 지움",
    erased: "right",
    claim: "사실성만 붙잡습니다. 남은 선택과 협상할 여지가 장부에서 사라집니다.",
    note: "조건을 이유로 어떤 응답도 불가능하다고 단정하면 실제로 남은 선택과 연대의 가능성이 지워집니다. 나쁜 믿음에 해당할 수 있는 한쪽 실패입니다.",
  },
  {
    label: "‘마음만 먹으면 된다’",
    summary: "생계와 돌봄 조건을 지움",
    erased: "left",
    claim: "초월만 붙잡습니다. 노동계약·돌봄 부담·주거 위치가 장부에서 사라집니다.",
    note: "조건을 지우면 22시간을 묶은 것까지 개인의 태도 탓이 됩니다. 이것도 나쁜 믿음에 해당할 수 있습니다. 곤란한 선택이나 억압받는 상태 자체를 도덕적 결함이라 부르는 말은 아닙니다.",
  },
] as const;

function Side({ title, body, erased, color }: { title: string; body: string; erased: boolean; color: string }) {
  return (
    <div
      className="min-w-0 rounded-lg px-3 py-3 transition-opacity duration-300 motion-reduce:transition-none"
      style={{ borderWidth: 1, borderStyle: erased ? "dashed" : "solid", borderColor: erased ? "#cbd5e1" : color, opacity: erased ? 0.45 : 1 }}
    >
      <p className="text-sm font-bold" style={{ color: erased ? "#94a3b8" : color }}>
        {title}
      </p>
      <p className={`mt-1 text-xs leading-5 ${erased ? "line-through" : ""}`}>{body}</p>
      <p className="mt-2 text-xs font-semibold" style={{ color: erased ? "#dc2626" : "#64748b" }}>
        {erased ? "지워짐" : "장부에 남음"}
      </p>
    </div>
  );
}

export default function BadFaithViz() {
  return (
    <SceneShell
      eyebrow="나쁜 믿음의 두 갈래"
      title="한쪽만 붙잡으면 다른 쪽이 장부에서 사라집니다"
      description="왼쪽은 사실성(이미 놓인 조건), 오른쪽은 초월(아직 없는 가능성을 향한 계획)입니다. 시간 숫자는 3·5절의 설명용 시간표입니다."
      ariaLabel="사실성과 초월을 함께 적는 경우와 한쪽만 붙잡아 다른 쪽을 지우는 두 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Side title="사실성" body="몸·과거·노동계약·돌봄·주거가 묶은 22시간" erased={scene.erased === "left"} color="#475569" />
              <Side title="초월" body="남은 2시간과 조건을 바꾸려는 계획" erased={scene.erased === "right"} color="#2563eb" />
            </div>
            <p className="min-h-[3.5rem] rounded-md border border-border px-3 py-2 text-sm leading-6">{scene.claim}</p>
          </div>
        );
      }}
    />
  );
}
